# Syncing Supabase with Typesense

[Supabase](https://Supabase.com/) is an open-source development platform constructed on PostgreSQL, offering secure direct database access to app users and an array of features including authentication management, TypeScript edge functions, logging, and storage, making it a popular choice among developers. However, its search functionality, based on PostgreSQL fuzzy search, is not as powerful compared to specialized search engines such as Typesense.

In this guide, we'll walk you through the process of syncing your user data with a Typesense search instance to enhance search capabilities and provide a more robust search experience for your users.

## Step 1: Configuring Supabase

### Creating a Products Table

Supabase offers a browser-based SQL and GUI editor for executing queries. If you prefer a database manager like PGAdmin, refer to [Supabase's tutorial](https://Supabase.com/docs/guides/database/connecting-to-postgres) for setting up external connections. The upcoming examples use a hypothetical _products table_, which you can create using your preferred interface.

#### Products table

```sql
CREATE TABLE public.products (
	id UUID NOT NULL DEFAULT uuid_generate_v4 (),
	product_name TEXT NULL,
	updated_at TIMESTAMPTZ NULL DEFAULT now(),
	user_id UUID NULL, -- References an authenticated user's id in Supabase managed auth.users database
	CONSTRAINT products_pkey PRIMARY KEY (id),
	CONSTRAINT products_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);
```


### Enabling Row Level Security

Row Level Security (RLS) restricts the actions a user can perform on a row within a table. This feature will be utilized in the _Syncing Deletes_ portion of the tutorial to support _soft-deleting_. There are two main app user roles Supabase utilizes:

- **anon**: anonymous users
- **authenticated**: registered users

Using RLS, it is possible to restrict access to only authenticated users with the appropriate user_id and session key.

#### Example: Creating an RLS policy

```sql
CREATE POLICY "only an authenticated user can view their respective rows in the products table"
ON public.products
FOR SELECT
TO authenticated
USING  (
	-- auth.uid is a helper function provided by Supabase
	auth.uid() = user_id
);
```

It's important to note that once RLS is enabled for a table, by default it will prevent all non-administrative roles (all app users) from accessing the table unless policies are written that explicitly grant permissions.

To enable RLS on the products table, you can either enable it using the GUI in the _Table Editor_ section, or you can execute the following query:

#### Enabling RLS

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
```

The policies that will be used for the walkthrough are:

#### Products Table RLS Policies

```sql
CREATE POLICY "only an authenticated user can view their products from PostgreSQL"
ON public.products
FOR SELECT
TO authenticated
USING  (
	auth.uid() = user_id
);

CREATE POLICY "only authenticated users can insert into the products table"
ON public.products
FOR INSERT
TO authenticated
WITH  CHECK  (true);

CREATE POLICY "only an authenticated user is allowed to update their product offerings"
ON public.products
FOR UPDATE
TO authenticated
USING  (
	auth.uid()  = user_id
)  WITH  CHECK  (
	auth.uid()  = user_id
);

CREATE POLICY "only an authenticated user is allowed to remove their products from the database"
ON public.products
FOR DELETE
TO authenticated
USING  (
	auth.uid()  = user_id
);
```

### Enabling Relevant PostgreSQL Extensions

The three extensions this tutorial will be using are:

1. [PG_NET](https://github.com/Supabase/pg_net): allows the database to make asynchronous http/https requests with JSON
2. [HTTP](https://github.com/pramsey/pgSQL-http): allows the database to make synchronous http/https requests with all data formats
3. [PG_CRON](https://github.com/citusdata/pg_cron): gives the database the ability to double as a CRON server

All of these extensions can be found and enabled in Supabase by clicking on the _Database_ icon in the nav menu, and then clicking on _Extensions_. For more guidance, you can check out [Supabase's documentation](https://Supabase.com/docs/guides/database/extensions#full-list-of-extensions).

The PG_NET extension will be used to realtime sync PostgreSQL with Typesense. The HTTP and PG_CRON extensions will be used together to schedule and execute bulk syncing. 

### Tracking changes

There are tens of ways to track unsynced rows in PostgreSQL, each with their own benefits and drawbacks. This guide will discuss varying strategies for both realtime and bulk syncing. However, it is up to you to decide which methods fit your database design and use case. 

One such method that will be demonstrated for tracking changes are log tables because they are relatively easy to implement.

Create a table for tracking unsynced rows.

#### Creating a Logging Table

```sql
CREATE TABLE public.products_sync_tracker (
	product_id UUID NOT NULL,
    is_synced BOOLEAN FALSE,
	CONSTRAINT product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products (id) ON DELETE SET NULL
);
```

Using triggers, it is easy to record new rows and updates changes.

#### Creating a Trigger to Monitor Inserts

```sql
CREATE OR REPLACE FUNCTION update_products_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into products_sync_tracker 
    INSERT INTO products_sync_tracker (product_id)
    VALUES (OLD.id);

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER insert_products_trigger
AFTER INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION insert_products_trigger_func();
```

#### Creating a Trigger to Monitor Updates

```sql
CREATE OR REPLACE FUNCTION update_products_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    -- Update products_sync_tracker table
    UPDATE products_sync_tracker
    SET 
        is_synced = FALSE
    WHERE product_id = NEW.id;

    -- update products.updated_at column
    NEW.updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_products_trigger
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION update_products_trigger_func();
```

## Step 2: Configuring Typesense

If your Typesense instance is already running and connected to the internet, proceed to the _Setup API Keys_ section. This guide refers to the Docker section of [Typesense's installation documentation](https://Typesense.org/docs/guide/install-Typesense.html#option-1-Typesense-cloud) with some modifications.

### Install with Docker

Docker offers a consistent configuration process across Windows, Linux, and MacOS. First, install [Docker Desktop](https://www.docker.com/products/docker-desktop/) if you haven't already. With Docker running, execute the command from the [Typesense's Docker page](https://hub.docker.com/r/typesense/typesense):

#### Deploy Docker Image and Container

```bash
mkdir /tmp/Typesense-data
docker run -p 8108:8108 -v/tmp/data:/data typesense/typesense:0.24.1 --data-dir /data --api-key=Hu52dwsas2AdxdE
```

The following url can be used to ping your instance. If it is up and running, you will receive the back _{"ok":true}_

#### Testing Connection in the Browser

```bash
http://localhost:8108/health
```

### Setup API Keys

The Typesense instance is deployed with a default API key: _Hu52dwsas2AdxdE_. For better security, we'll generate new keys. First, execute the following Shell command to replace the default API key:

#### Creating a New Administrator API Key

```bash
curl 'http://localhost:8108/keys' \
    -X POST \
    -H "X-Typesense-API-KEY: Hu52dwsas2AdxdE" \
    -H 'Content-Type: application/json' \
    -d '{"description":"Admin key.","actions": ["*"], "collections": ["*"]}' | json_pp
```

Save the returned admin key value. It should be the only active key:

#### Listing All Active API Keys

```bash
curl 'http://localhost:8108/keys' \
    -X GET \
    -H "X-Typesense-API-KEY: ${Typesense_API_KEY}" | json_pp
```

Now that there is only one master key remaining, you can use it to create a products's collection.

#### Creating Product Collection

```bash
curl "http://localhost:8108/collections" \
     -X POST \
     -H "Content-Type: application/json" \
     -H "X-Typesense-API-KEY: ${Typesense_API_KEY}" \
     -d '{
       "name": "products",
       "fields": [
         {"name": "id", "type": "string" },
         {"name": "product_name", "type": "string" },
         {"name": "user_id", "type": "string" },
         {"name": "updated_at", "type": "float" }
       ],
       "default_sorting_field": "updated_at"
     }' | json_pp
```

We will need to create two more keys: a "search only" key and "master" key for the products collection.

#### Creating Products Search-Only API Key

```bash
curl 'http://localhost:8108/keys' \
    -X POST \
    -H "X-Typesense-API-KEY: ${Typesense_API_KEY}" \
    -H 'Content-Type: application/json' \
    -d '{"description":"Search-only products key.","actions": ["documents:search"], "collections": ["products"]}' | json_pp
```

#### Creating Products Admin API Key

```bash
curl 'http://localhost:8108/keys' \
    -X POST \
    -H "X-Typesense-API-KEY: ${Typesense_API_KEY}" \
    -H 'Content-Type: application/json' \
    -d '{"description":"Admin products key","actions": ["*"], "collections": ["products"]}' | json_pp
```

### Tunneling to Connect to the Web

This Supabase walkthrough does not cover deploying a self-hosted instance on a dedicated server. Instead, you can use services such as [Ngrok](https://ngrok.com/) or [Cloudflare Tunnel](https://www.cloudflare.com/products/tunnel/) to securely forward traffic between your local machine and the web. Ngrok is slightly easier to use and offers a generous free tier. After setting up an account, follow the [guide to install Ngrok](https://dashboard.ngrok.com/get-started/setup). Once finished, use a terminal command to forward your Typesense instance to the web.

#### Activating Ngrok connection

```bash
ngrok http 8108
```

To test your tunnel, you can use the your Ngrok url in the browser

#### Testing Connection

```bash
<NGROK URL>/health
```

If you receive the response _{"ok":true}_, then you are connected.

## Step 3: Introduction to PostgreSQL Connectivity

The **PG_NET** extension allows Supabase to communicate asynchronously through HTTP/HTTPS requests.

The following example requests data from the [postman-echo API](https://learning.postman.com/docs/developer/echo-api/).

#### Requesting Data from an Endpoint

```sql
SELECT net.http_get('https://postman-echo.com/get?foo1=bar1&foo2=bar2') AS request_id;
```

When the query completes, you can use the returned _request_id_ to find the response in Supabase's *net._http_response* table. You can also view the response by using the following query

#### Viewing HTTP/HTTPS Response Message

```sql
SELECT
    (response).body::JSON
FROM
    net._http_collect_response(<request_id>);
```

If you go to the _Authentication_ tab in the Supabase side nav, you can create a new user. Using the new user profile, go to the Supabase _Table Editor_ and manually add new rows to the _products_ table.

The net.http_post function is just one means for posting to Typesense directly. However, it has a significant limitation: it only supports JSON as the *Content-Type*, whereas Typesense requires NDJSON compatibility. Fortunately, JSON and NDJSON are functionally equivalent when dealing with a single row. As a result, the code below will work when it only has to send one row from PostgreSQL to Typesense.

#### Naive Attempt to Connect to Typesense

```sql
SELECT net.http_post(
    url := '<TYPESENSE URL>/collections/products/documents/import?action=upsert'::TEXT,
    -- Formats the products table's rows into JSONB and also converts updated_at from type TIMESTAMPTZ to type FLOAT
    -- The body must be formatted as JSONB data
    body := (
        SELECT
            to_jsonb(rows)
        FROM (
            SELECT
                -- Converting type TIMESTAMPTZ to type float
                EXTRACT(EPOCH FROM updated_at)::float AS updated_at,
                id,
                product_name,
                user_id
            FROM products
        ) rows
    )::JSONB,
    headers := json_build_object(
            'Content-Type', 'application/json',
            'X-Typesense-API-KEY', '<API KEY>'
    )::JSONB,
    timeout_milliseconds := 4000
) AS request_id;
```

If you were upserting multiple rows, you would have received the following error message:

> Failed to run sql query: more than one row returned by a subquery used as an expression

*PG_NET* functions are incompatible for multi-row updates, but they are essential for real-time syncing. Real-time syncs utilize PostgreSQL triggers, which can block transactions for users. However, PG_NET functions are asynchronous, ensuring transactions are not delayed.

On the other hand, the *HTTP* extension supports NDJSON, making it suitable for bulk updates. It is also synchronous, so it will wait for a *succeeded* or *failed* response and respond accordingly. This plugin is compatible with PG_CRON cron jobs, which run on separate threads and do not interfere with the main database operations, preventing any negative impact on user experience.

To perform bulk updates, rows must be converted into NDJSON. This can be accomplished using a PL/pgSQL function within PostgreSQL.

#### Formatting Table Rows into NDJSON

```sql
CREATE OR REPLACE FUNCTION get_products_ndjson()
RETURNS TEXT
AS $$
DECLARE
    row_data RECORD;
    ndjson TEXT := '';
BEGIN
    FOR row_data IN (
        SELECT
            product_name,
            id,
            CAST(EXTRACT(epoch FROM updated_at) AS FLOAT) AS updated_at,
            user_id
        FROM products
    )
    LOOP
        -- Concatenate JSON text values with newline character
        ndjson := ndjson || row_to_json(row_data)::TEXT || E'\n';
    END LOOP;

    RETURN ndjson;
END;
$$ LANGUAGE plpgSQL;
```

Utilizing the above function, we can use the _HTTP_ extension to make bulk upserts:

#### Bulk Approach to Sync with Typesense

```sql
SELECT
    status,
    (unnest(headers)).*
-- The http function returns a table of response headers
FROM http((
    -- Method
    'POST'::http_method,
    -- ADD TYPESENSE URL
    '<TYPESENSE URL>/collections/products/documents/import?action=upsert'::VARCHAR,
    -- Headers
    ARRAY[
        -- ADD API KEY
        http_header('X-Typesense-API-KEY', '<API KEY>')
    ]::http_header[],
    -- Content type
    'application/text',
    -- Payload
    (SELECT get_products_ndjson())
)::http_request);
```

You can check if Typesense was updated with the following cURL request:

#### Searching Typesense

```bash
curl -H "X-TYPESENSE-API-KEY: <API KEY>" \
"<TYPESENSE URL>/collections/products/documents/search?q=*" \
| json_pp
```

## Step 4: Syncing Inserts/Updates

### Scheduling Bulk Updates/Inserts with Cron Jobs

Using the _PG_CRON_ and _HTTP_ extensions, you can schedule cron jobs to bulk sync a database with Typesense. Cron jobs in PostgreSQL are timed using [cron-syntax](https://en.wikipedia.org/wiki/Cron). Each job can be run at most once per minute. Unfortunately, Supabase does not offer native support for bulk syncing at shorter intervals. An imperfect workaround involves scheduling multiple cron jobs with staggered timings. If you must bulk sync at shorter intervals, you should use a more precise external cron or bridge server for better control.

#### Example Cron Job: Calling Edge Function Every Minute

```sql
SELECT
  cron.schedule(
    'cron-job-name',
    '* * * * *', -- Executes every minute (cron syntax)
	$$
    -- SQL query
        net.http_get(
            -- URL of Supabase Edge function
            url:='https://<reference id>.functions.Supabase.co/Typesense-example',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer <TOKEN>"}'
        ) as request_id;
	$$
  );
```

It may also be useful to know how to unschedule active cron jobs.

#### Example: Unscheduling an Active Cron Job

```sql
SELECT cron.unschedule('cron-job-name')
```

The following PL/pgSQL function converts unsynced rows into NDJSON and then upserts them into Typesense in bulk. If the upsert fails, the tracking table *products_sync_tracker* will be reverted to reflect this failure. By incorporating the function into a cron job, syncing at intervals becomes possible natively in Supabase.

#### Query to Bulk Synce Rows


duck:

```sql
CREATE TABLE public.products (
	id UUID NOT NULL DEFAULT uuid_generate_v4 (),
	product_name TEXT NULL,
	updated_at TIMESTAMPTZ NULL DEFAULT now(),
	user_id UUID NULL, -- References an authenticated user's id in Supabase managed auth.users database
	CONSTRAINT products_pkey PRIMARY KEY (id),
	CONSTRAINT products_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);
```

```sql
CREATE TABLE public.products_sync_tracker (
	product_id UUID NOT NULL,
    is_synced BOOLEAN FALSE,
	CONSTRAINT products_pkey PRIMARY KEY (id),
	CONSTRAINT product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products (id) ON DELETE SET NULL
);
```

```sql
CREATE OR REPLACE FUNCTION sync_products_updates()
RETURNS VOID
AS $$
    DECLARE
        -- variables for converting rows to NDJSON
        row_data RECORD;
        ndjson TEXT := '';

        -- variables for referencing http response values
        request_status INTEGER;
        response_message TEXT;
    BEGIN
        
        -- Create a temporary table to track updated rows
        CREATE TEMPORARY TABLE temp_synced_products (
            temp_product_id UUID NOT NULL,
            temp_is_synced BOOLEAN NOT NULL
        ) ON COMMIT DROP;

        -- Update is_synced value to TRUE and copy updated rows into the temporary table
        WITH updated_rows AS (
            UPDATE public.products_sync_tracker
            SET is_synced = TRUE
            WHERE product_id IN (
                SELECT product_id
                FROM public.products_sync_tracker
                WHERE is_synced = FALSE
                LIMIT 40
            )
            RETURNING product_id, is_synced
        )
        INSERT INTO temp_synced_products (temp_product_id, temp_is_synced)
        SELECT product_id, is_synced
        FROM updated_rows;

        -- Formatting unsynced rows as NDJSON ---------------------------------------------------

        -- Formatting each unsynced row into NDJSON
        FOR row_data IN (
            SELECT
                product_name,
                id,
                CAST(EXTRACT(epoch FROM updated_at) AS FLOAT) AS updated_at,
                user_id
            FROM products
            INNER JOIN temp_synced_products ON temp_synced_products.temp_product_id = products.id
        )
        LOOP
            ndjson := ndjson || row_to_json(row_data)::TEXT || E'\n';
        END LOOP;

        -- Sending upsert request to Typesense server ---------------------------------------------

        -- Sending request
        SELECT
            status,
            content
            INTO request_status, response_message
        FROM http((
            'POST'::http_method,
            -- ADD TYPESENSE URL
            '<TYPESENSE URL>/collections/products/documents/import?action=upsert',
            ARRAY[
                -- ADD API KEY
                http_header('X-Typesense-API-KEY', '<API KEY>')
            ]::http_header[],
            'application/text',
            ndjson
        )::http_request);

        -- Check if the request failed
        IF request_status <> 200 THEN
            -- undo sync
            UPDATE public.products_sync_tracker
            SET is_synced = FALSE
            FROM temp_synced_products
            WHERE temp_synced_products.product_id = products_sync_tracker.product_id;
            -- stores error message in Supabase Postgres Logs
            RAISE LOG 'HTTP POST request failed. Message: %', response_message;
            -- Raises Exception, which undoes the transaction
            RAISE EXCEPTION 'UPSERT FAILED';
        END IF;
    END;
$$ LANGUAGE plpgsql;
```

Embedding the above function *sync_product_updates* into a cron job, Supabase can directly update Typesense at regular intervals.

#### Cron Job to Bulk Upsert into Typesense

```sql
SELECT cron.schedule(
    'update-insert-Typesense-job',
    '* * * * *',
    $$
    -- SQL query
        SELECT sync_product_updates();
    $$
);
```

In Supabase, cron job details are recorded in the cron schema with two tables:

- jobs
- job_run_details

It is helpful to reference these tables for debugging. Execution logs can be checked either through the Supabase table editor or by querying the tables directly.

#### Query to Find Most Recent 10 Cron Execution Failures

```sql
SELECT
    *
FROM cron.job_run_details
INNER JOIN cron.job ON cron.job.jobid = cron.job_run_details.jobid
WHERE 
    cron.job.jobname = 'cron-job-name' 
        AND 
    cron.job_run_details.status = 'failed'
ORDER BY start_time DESC
LIMIT 10;
```

To test if Typesense synced, manually add a row to the products table using Supabase's table editor. Check the _cron_ schema in the same table editor to observe when your cron job executed.

#### Testing if cron job updated Typesense

```bash
curl -X GET "<TYPESENSE URL>/collections/products/documents/search?q=*" \
    -H "X-TYPESENSE-API-KEY: <API KEY>" \
    | json_pp
```

Some users may prefer using servers as an intermediary to communicate with Typesense. This is particularly useful when it is necessary to santize or reformat data. Supabase natively offers serverless edge functions in Deno (TypeScript).

It is also helpful to have a PL/pgSQL function that can retrieve unsynced rows and update the *products_sync_tracker* table in a single request.

#### PL/pgSQL Function to Find Unsynced Rows and Record Edge Function Request

```sql
CREATE OR REPLACE FUNCTION get_updates_for_edge()
RETURNS TABLE(
    id UUID,
    product_name TEXT,
    updated_at FLOAT,
    user_id UUID
)
AS $$

BEGIN
    RETURN QUERY
        WITH unsynced_rows AS (
            UPDATE public.products_sync_tracker
            SET is_synced = TRUE
            WHERE product_id IN (
                SELECT 
                    product_id
                FROM public.products_sync_tracker
                WHERE is_synced = FALSE
                LIMIT 40
            )
            RETURNING product_id
        )
        SELECT
            products.id,
            products.product_name,
            CAST(EXTRACT(epoch FROM products.updated_at) AS FLOAT) AS updated_at,
            products.user_id
        FROM products
        INNER JOIN unsynced_rows ON unsynced_rows.product_id = products.id;
END;
$$ LANGUAGE plpgsql;
```

To deploy an edge function, you must have a Node Package Manager, such as NPM, Yarn, or PNPM. NPM can be installed by downloading Node.JS through the official [download page](https://nodejs.org/en/download)

To create your first function, create a folder with your function name, and add an index.ts file inside. The code below is a modified version of the [Supabase edge functon demo](https://supabase.com/docs/guides/functions/auth), using the _get_products_updates_from_edge_ PL/pgSQL function from earlier.

#### Edge Function to Update Typesense

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req: Request) => {
  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    // Now we can get the session or user object
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    // And we can run queries in the context of our authenticated user
    const { data, error } = await supabaseClient.rpc('get_updates_for_edge')
    if (error) throw error
    
    // Convert data into NDJSON format
      const newProductsNDJSON = data
        .map(product =>
          JSON.stringify({
            ...product,
            updated_at: parseFloat(product.updated_at),
          }),
        )
        .join('\n')
      // ADD YOUR TYPESENSE URL
      const response = await fetch('<TYPESENSE URL>/collections/products/documents/import?action=upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-ndjson',
          //ADD YOUR TYPESENSE API KEY
          'X-TYPESENSE-API-KEY': '<API KEY>',
        },
        body: newProductsNDJSON,
      })
      const ndJsonResponse = await response.text()
      // The response will contain NDJSON of the results, It must be converted back into JS
      /* possible results
        {"success": true}
        {"success": false, "error": "Bad JSON.", "document": "[bad doc]"}
      */ 
        const parsedResponse = ndJsonResponse
        .split('\n')
        .map(line => JSON.parse(line));

        const failedUpsertsId = parsedResponse
        .filter(doc => !doc.success)
        .map(doc=>({
            product_id: doc.document.id, 
            is_synced: false
        }))
        const { data, error } = await supabase
        .from('products_sync_tracker')
        .upsert(failedUpsertsId)
    return new Response(JSON.stringify({ parsedResponse }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})































// import * as postgres from 'https://deno.land/x/postgres@v0.14.2/mod.ts'
// import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// // Get the connection string from the environment variable "SUPABASE_DB_URL"
// const databaseUrl = Deno.env.get('SUPABASE_DB_URL')!

// // Create a database pool with three connections that are lazily established
// const pool = new postgres.Pool(databaseUrl, 3, true)
// serve(async _req => {
//   try {
//     // Grab a connection from the pool
//     const connection = await pool.connect()

//     try {
//       // Run a query
//       // ADD YOUR EDGE FUNCTION NAME
//       const result = await connection.queryObject`SELECT * FROM get_updates_for_edge()`
//       const newProducts = result.rows ?? []
//       // Convert newProducts into NDJSON format
//       const newProductsNDJSON = newProducts
//         .map(product =>
//           JSON.stringify({
//             ...product,
//             updated_at: parseFloat(product.updated_at),
//           }),
//         )
//         .join('\n')
//       // ADD YOUR TYPESENSE URL
//       const response = await fetch('<TYPESENSE URL>/collections/products/documents/import?action=upsert', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-ndjson',
//           //ADD YOUR TYPESENSE API KEY
//           'X-TYPESENSE-API-KEY': '<API KEY>',
//         },
//         body: newProductsNDJSON,
//       })
//       const ndJsonResponse = await response.text()
//       // The response will contain NDJSON of the results
//       /*
//         {"success": true}
//         {"success": false, "error": "Bad JSON.", "document": "[bad doc]"}
//       */ 
//         const parsedResponse = ndJsonResponse
//         .split('\n')
//         .map(line => JSON.parse(line));

//         const failedUpsertsId = parsedResponse
//         .filter(doc => !doc.success)
//         .map(doc=>doc.document.id)
        
//         // update Supabase to reflect failures
//         const result = await connection.queryObject`
//             UPDATE public.products_sync_tracker
//             SET is_synced = FALSE
//             WHERE
//         `

//         const arrayOfFailedUpserts = jsonArray.filter(document=>document.)
//       // Return the response with the correct content type header
//       return new Response(body, {
//         status: 200,
//         headers: {
//           'Content-Type': 'application/json; charset=utf-8',
//         },
//       })
//     } finally {
//       // Release the connection back into the pool
//       connection.release()
//     }
//   } catch (err) {
//     console.error(err)
//     return new Response(String(err?.message ?? err), {
//       status: 500,
//     })
//   }
// })
```

With the function set-up, navigate to your function's parent directory in the terminal and execute the following command

#### Login to Supabase Command Line

```bash
npx supabase login
```

You will be prompted to enter your password and directed towards a link to generate an access token. After logging in, you can deploy your function.

#### Deploy Edge Function To Supabase

```bash
npx supabase functions deploy <YOUR FUNCTION`S DIRECTORY NAME>
```

You should receive a link that will give you insight about your new function. To call it, you will also need your project's _ANON KEY_, which can be found in the _API Tab_ of your project's settings. You can schedule your function to sync Typesense with a cron job.

#### Cron Job to Update Typesense with Edge Functions

```sql
SELECT
  cron.schedule(
    'update-insert-Typesense-job',
    '* * * * *', -- Executes every minute (cron syntax)
	$$
    -- SQL query
        SELECT net.http_get(
            -- ADD YOUR FUNCTION URL
            url:='<EDGE FUNCTION URL>',
            -- ADD YOUR FUNCTION'S BEARER TOKEN
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer <SUPABASE ANON KEY>"}'::JSONB
        ) as request_id;
	$$
);
```

### Realtime Updates/Inserts with Triggers

There are some circumstances where realtime syncing may be important. This can only be achieved with triggers. The below example directly syncs between Supabase and Typesense, but you could also use the trigger to call an Edge function that does the same thing.

#### Syncing Data with Triggers

```sql
-- Creating a function to be used by a update/insert trigger for the products table
CREATE OR REPLACE FUNCTION public.sync_products()
RETURNS TRIGGER AS $$
BEGIN
    -- Make an https request to the Typesense server
	PERFORM net.http_post(
        -- ADD TYPESENSE URL
        url := '<TYPESENSE URL>/collections/products/documents/import?action=upsert'::TEXT,
        -- The NEW keyword represents the new row data
        body := (
            SELECT
                to_jsonb(row.*)
            FROM (
                SELECT
                    -- Converting type TIMESTAMPTZ to type float
                    EXTRACT(EPOCH FROM NEW.updated_at)::float AS updated_at,
                    NEW.id,
                    NEW.product_name,
                    NEW.user_id
            ) AS row
        )::JSONB,
        headers := json_build_object(
            'Content-Type', 'application/json',
            -- ADD API KEY
            'X-Typesense-API-KEY', '<API KEY>'
        )::JSONB
    );
	RETURN NEW;
END;
$$ LANGUAGE plpgSQL;

-- Trigger that runs after any insert or update in the products table
CREATE TRIGGER sync_updates_and_inserts_in_Typesense
AFTER INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION sync_products();
```

It is important to restate that these requests are asynchronous, and they must be to avoid blocking user tranactions. Once the response is received, a background worker will listen for a response and add it to the net._http_response table. It's possible to monitor these updates with cron jobs or triggers to make attempts to reupload the data. Using triggers, though, can be dangerous for this task. If the data is incompatible with Typesense, the request will always fail, resulting in an infinite loop of reattempts. 

## Step 5: Syncing Deletes

### Scheduling Bulk Deletes with Cron Jobs

To sync deletions between Supabase and Typesense, you can use one of two approaches:

1. Temporarily saving deleted rows' ids in an intermediary table until they can be removed from Typesense
2. Soft deleting rows until they are removed from TypeSense

#### Approach 1: Intermediary Tables

To achieve the first approach, you need to create a table to store the deleted rows' ids until Typesense can be synced.

#### deleted_rows Table

```sql
CREATE TABLE deleted_rows(
    table_name TEXT,
    deleted_row_id UUID,
    CONSTRAINT deleted_rows_pkey PRIMARY KEY (deleted_row_id)
);
```

Whenever a row is deleted in the main table, a trigger should record a copy of its id.

#### Trigger to Save id Column

```sql
-- Create the function to copy id to deleted_rows on delete
CREATE OR REPLACE FUNCTION copy_deleted_product_id()
    RETURNS TRIGGER
    LANGUAGE plpgSQL
AS $$
BEGIN
    INSERT INTO deleted_rows (table_name, deleted_row_id)
    VALUES ('products', OLD.id);
    RETURN OLD;
END $$;

-- Create the trigger that calls the function when a record is deleted from the products table
CREATE TRIGGER copy_id_on_delete
    AFTER DELETE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION copy_deleted_product_id();
```

In Typesense, bulk deletions are performed using DELETE requests that include the conditions for deletion as query parameters within the URL.

#### Example: Delete Request 

```bash
curl -g -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X DELETE \
"http://localhost:8108/collections/companies/documents?filter_by=id:[id1, id2, id3]"
```
| It may be necessary to use the url-encoded characters for square brackets "[ ]", respectively %5B and %5D

A PL/pgSQLfunction can be written to sync the deletions with Typesense before removing the copies from the deleted_rows table.

#### Bulk Sync Deleted Rows

```sql
-- Create the function to delete the record from Typesense
CREATE OR REPLACE FUNCTION bulk_delete_products()
    RETURNS VOID
    LANGUAGE plpgSQL
AS $$
    DECLARE
        id_arr UUID[];
        query_params TEXT;
        request_status INTEGER;
        response_message TEXT;
    BEGIN
        -- Select ids from deleted_rows
        SELECT
            -- store values into array so it can be deleted later
            array_agg(deleted_row_id),
            -- Format the rows to be used in the filter_by parameter
            string_agg(deleted_row_id::text, ',')
            INTO id_arr, query_params
        FROM deleted_rows
        LIMIT 40;

        -- The params must be formatted within square brackets "[ ]", which are URL encoded as %5B and %5D, respectively.
        query_params:= '%5B' || query_params || '%5D'

        SELECT
            status,
            content
            INTO request_status, response_message
        FROM http((
            'DELETE'::http_method,
            -- ADD TYPESENSE URL
            '<TYPESENSE URL>collections/products/documents?filter_by=' || query_params,
            ARRAY[
                -- ADD API KEY
                http_header('X-Typesense-API-KEY', '<API KEY>')
            ]::http_header[],
            'application/json',
            NULL
        )::http_request);

        -- Check if the request failed
        IF request_status <> 200 THEN
            -- stores error message in Supabase Postgres Logs
            RAISE LOG 'HTTP DELETE request failed. Message: %', response_message;
            -- Raises Exception, which undoes the transaction
            RAISE EXCEPTION 'DELETE FAILED';
        ELSE
            DELETE FROM deleted_rows WHERE deleted_row_id = ANY(id_arr);
        END IF;
    END;
$$;
```

The function can be called every minute by a Cron Job.

#### Sync Deleted Rows Every Minute

```sql
SELECT
  cron.schedule(
    'delete-from-typesese',
    '* * * * *', -- Executes every minute (cron syntax)
	$$
    -- SQL query
        SELECT bulk_delete_products();
	$$
  );
```

#### Approach 2: Soft Deleting

In this approach, users must be restricted from directly deleting rows from the products table. To ensure this, it is essential to modify Row Level Security, revoking their deletion privileges. Without this modification, data inconsistencies between Supabase and Typesense are guaranteed to occur.

#### Modifying RLS to Prevent Users from Deleting Rows

```sql
ALTER POLICY "only an authenticated user is allowed to remove their products from the database" ON public.products TO NONE;
```

Instead of directly deleting rows, users will have to modify a row in a way that essentially tags it as unuseable. In this case, setting the user_id column to NULL will make the row inaccessible to all app users.

Create a function to sync nullified rows with Typesense and delete them:

#### Syncing Nullified Rows Before Deleting Them

```sql
-- Create the function to delete the record from Typesense
CREATE OR REPLACE FUNCTION bulk_delete_products()
    RETURNS VOID
    LANGUAGE plpgSQL
AS $$
    DECLARE
        query_params TEXT;
        request_status INTEGER;
        response_message TEXT;
    BEGIN
        -- Select and format of ids from deleted_rows
        SELECT
            string_agg(id::text, ',')
            INTO query_params
        FROM products
        WHERE user_id IS NULL;


        -- Send delete request to Typesense server
        SELECT
            status,
            content
            INTO request_status, response_message
        FROM http((
            'DELETE'::http_method,
            -- ADD TYPESENSE URL
            '<TYPESENSE URL>/collections/products/documents?filter_by=' || query_params, 
            ARRAY[
                -- ADD API KEY
                http_header('X-Typesense-API-KEY', '<API KEY>')
            ]::http_header[],
            'application/json',
            NULL
        )::http_request);

        -- Check if the request failed
        IF request_status <> 200 THEN
            -- stores error message in Supabase Postgres Logs
            RAISE LOG 'HTTP DELETE request failed. Message: %', response_message;
            -- Raises Exception, which undoes the transaction
            RAISE EXCEPTION 'DELETE FAILED';
        ELSE
            DELETE FROM products WHERE user_id IS NULL;
        END IF;
    END;
$$;
```

The function can be called every minute by a cron bob.

#### Scheduling Bulk Deletes

```sql
SELECT
  cron.schedule(
    'delete-from-typesese',
    '* * * * *', -- Executes every minute(cron syntax)
	$$
    -- SQL query
        SELECT bulk_delete_products;
	$$
  );
```

### Syncing in Realtime

Depending on you organize your database, you may come across a situation
where deleting one row causes a cascade of deletes in another table. To sync these changes, you can use triggers. In Typesense, bulk deletes can be performed by querying a shared field. In the below example, when a user is deleted, Typesense will delete all corresponding entries.

#### Bulk Delete by a Shared Field

```sql
-- Create the function to delete the record from Typesense
CREATE OR REPLACE FUNCTION bulk_delete_products()
    RETURNS TRIGGER
    LANGUAGE plpgSQL
AS $$
BEGIN
    SELECT net.http_delete(
        -- ADD TYPESENSE URL
        url := format('<TYPESENSE URL>/collections/products/documents?filter_by=user_id:=%s', OLD.id::TEXT),
        -- ADD API KEY
        headers := '{"X-Typesense-API-KEY": "<API KEY>"}'
    )
    RETURN OLD;
END $$;

-- Create the trigger that calls the function when a user deletes their account, which would
-- Subsequently delete all of their entries to the products table
CREATE TRIGGER bulk_delete_products_trigger
    AFTER DELETE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION bulk_delete_products();
```

In Typesense, a single document can be deleted by making a request with the document's ID as a path parameter.

#### cURL Request, Deleting by id

```bash
curl -H "X-Typesense-API-KEY: ${Typesense_API_KEY}" -X DELETE \
    "http://localhost:8108/collections/products/documents/<id>"
```

Syncing individual deletes in realtime can be managed with a trigger.

#### Single Row Delete Using Triggers

```sql
-- Create the function to delete the record from Typesense
CREATE OR REPLACE FUNCTION delete_products()
    RETURNS TRIGGER
    LANGUAGE plpgSQL
AS $$
BEGIN
    SELECT net.http_delete(
        url := format('<TYPESENSE URL>/collections/products/documents/%s', OLD.id),
        headers := '{"X-Typesense-API-KEY": "<Typesense_API_KEY>"}'
    )
    RETURN OLD;
END $$;

-- Create the trigger that calls the function when a record is deleted from the products table
CREATE TRIGGER delete_products_trigger
    AFTER DELETE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION delete_products();

```

## Conclusion

In this tutorial, we explored different methods to synchronize data between Supabase and Typesense, ensuring that our search engine stays up-to-date with the latest changes in our database. We covered syncing inserts, updates, and deletes through interval-based and real-time strategies, using triggers, functions, and cron jobs.

By implementing these techniques, you can create a robust, efficient, and responsive search system for your application, providing users with a seamless and accurate search experience.

If we can make any improvements to this guide, click on the "Edit page" link below and send us a pull request.













import * as postgres from 'https://deno.land/x/postgres@v0.14.2/mod.ts'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// Get the connection string from the environment variable "SUPABASE_DB_URL"
const databaseUrl = Deno.env.get('SUPABASE_DB_URL')!

// Create a database pool with three connections that are lazily established
const pool = new postgres.Pool(databaseUrl, 3, true)
serve(async _req => {
  try {
    // Grab a connection from the pool
    const connection = await pool.connect()

    try {
      // Run a query
      // ADD YOUR EDGE FUNCTION NAME
      const result = await connection.queryObject`SELECT * FROM get_updates_for_edge()`
      const newProducts = result.rows ?? []
      // Convert newProducts into NDJSON format
      const newProductsNDJSON = newProducts
        .map(product =>
          JSON.stringify({
            ...product,
            updated_at: parseFloat(product.updated_at),
          }),
        )
        .join('\n')
      // ADD YOUR TYPESENSE URL
      const response = await fetch('<TYPESENSE URL>/collections/products/documents/import?action=upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-ndjson',
          //ADD YOUR TYPESENSE API KEY
          'X-TYPESENSE-API-KEY': '<API KEY>',
        },
        body: newProductsNDJSON,
      })
      const ndJsonResponse = await response.text()
      // The response will contain NDJSON of the results
      /*
        {"success": true}
        {"success": false, "error": "Bad JSON.", "document": "[bad doc]"}
      */ 
        const parsedResponse = ndJsonResponse
        .split('\n')
        .map(line => JSON.parse(line));

        const failedUpsertsId = parsedResponse
        .filter(doc => !doc.success)
        .map(doc=>doc.document.id)
        
        // update Supabase to reflect failures
        const result = await connection.queryObject`
            UPDATE public.products_sync_tracker
            SET is_synced = FALSE
            WHERE
        `

        const arrayOfFailedUpserts = jsonArray.filter(document=>document.)
      // Return the response with the correct content type header
      return new Response(body, {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      })
    } finally {
      // Release the connection back into the pool
      connection.release()
    }
  } catch (err) {
    console.error(err)
    return new Response(String(err?.message ?? err), {
      status: 500,
    })
  }
})