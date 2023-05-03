# Syncing Supabase with Typesense

[Supabase](https://Supabase.com/) is an open source development platform that is built on top of PostgreSQL. Its unique configuration allows developers to directly and securely query their PostgreSQL instances from the frontend instead of fetching data through a server. The platform also provides other features, such as authentication management, edge functions in TypeScript, logging, storage, etc.

However, the search functionality it provides (PostgreSQL fuzzy search) is lackluster compared to specialized search engines, such as Typesense.

This guide will walk you through the process of syncing user data with a Typesense search instance.

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
4. [MODDATETIME](https://doxygen.postgresql.org/moddatetime_8c.html): simplifies the process of updating timestamps

All of these extensions can be found and enabled in Supabase by clicking on the _Database_ icon in the nav menu, and then clicking on _Extensions_. For more guidance, you can check out [Supabase's documentation](https://Supabase.com/docs/guides/database/extensions#full-list-of-extensions).

The PG_NET extension will be used to realtime sync PostgreSQL with Typesense. The HTTP and PG_CRON extensions will be used together to schedule and execute bulk syncing. The MODDATETIME extension will be used to track unsynced rows.

### Tracking changes

Use the _MODDATETIME_ extension and SQL triggers to track row changes for efficient Typesense updates.

#### Creating Trigger to Monitor Updates

```sql
-- This trigger will set the "updated_at" column to the current timestamp for each update
CREATE trigger
  handle_updated_at BEFORE UPDATE
ON public.products
FOR EACH ROW EXECUTE
  PROCEDURE moddatetime(updated_at);
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

## Step 3: Syncing Inserts/Updates

### Introduction to PostgreSQL Connectivity

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

The net.http_post function provides a direct method for posting to Typesense. However, it has a significant limitation: it only supports JSON as the *Content-Type*, whereas Typesense requires NDJSON compatibility. Fortunately, JSON and NDJSON are functionally equivalent when dealing with a single row. As a result, the code below will work when it only has to send one row from PostgreSQL to Typesense.

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

The strategy mentioned above is incompatible for bulk updates, but is essential for real-time syncing. Real-time syncs utilizing PostgreSQL triggers can potentially block transactions for users. However, PG_NET functions are asynchronous, ensuring transactions are not delayed.

On the other hand, the *HTTP* extension supports NDJSON and operates synchronously, making it suitable for bulk updates. It can wait for a response within a transaction and revert any commits if an error occurs. This plugin is compatible with PG_CRON cron jobs, which run on separate threads and do not interfere with the main database operations, preventing any negative impact on user experience.

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

### Scheduling Bulk Updates/Inserts with Cron Jobs

Using the _PG_CRON_ and _HTTP_ extensions, you can schedule cron jobs to bulk sync their database with Typesense. Cron jobs in PostgreSQL are timed using [cron-syntax](https://en.wikipedia.org/wiki/Cron). Each job can be run at most once per minute. Unfortunately, Supabase does not offer native support for bulk syncing at shorter intervals. An imperfect workaround involves scheduling multiple cron jobs with staggered timings. If you must bulk sync at shorter intervals, you should use a more precise external cron or bridge server for better control.

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

In Supabase, cron jobs are recorded in the cron schema with two tables:

- jobs
- job_run_details

These tables help track current and previous cron job runs, essential for determining which rows still need syncing.

#### Cron Job that Returns Current and Previous Execution Times

```sql
SELECT cron.schedule(
    'cron-job-name',
    '* * * * *', -- Executes every minute (cron syntax)
    $$
    -- SQL query
        SELECT
            start_time
        FROM cron.job_run_details
        INNER JOIN cron.job ON cron.job.jobid = cron.job_run_details.jobid
        WHERE cron.job.jobname = 'cron-job-name'
        ORDER BY start_time DESC
        LIMIT 2;
    $$
);
```

The nested query in the above example can be modified and embedded into a PL/pgSQL function that tracks updated/new rows, converts them into NDJSON, and then upserts them into Typesense.

#### Query to Find Unsynced Rows

```sql
CREATE OR REPLACE FUNCTION sync_products_updates()
RETURNS VOID
AS $$
    DECLARE
        -- variables for tracking sync times
        ts_pair TIMESTAMPTZ[];
        previous_sync_time TIMESTAMPTZ;
        current_sync_time TIMESTAMPTZ;

        -- variables for converting rows to NDJSON
        row_data RECORD;
        ndjson TEXT := '';

        -- variables for referencing http response values
        request_status INTEGER;
        response_message TEXT;
    BEGIN
        -- Getting time range between last sync and current operation ----------------------------

        -- Get the current and previous cron start times
        SELECT 
            array_agg(start_time) INTO ts_pair
        FROM (
            SELECT start_time
            FROM cron.job_run_details
            INNER JOIN cron.job ON cron.job.jobid = cron.job_run_details.jobid
            WHERE 
                cron.job.jobname = 'update-insert-Typesense-job' 
                    AND 
                -- ignore jobs that failed
                cron.job_run_details.status <> 'failed'
            ORDER BY start_time DESC
            LIMIT 2
        ) AS recent_start_times;

        -- If there is no previous sync time, assign start time to TIMESTAMPTZ equivalence of 0
        previous_sync_time := COALESCE(ts_pair[2], '1970-01-01 00:00:00+00');

        current_sync_time := ts_pair[1];
        ASSERT current_sync_time IS NOT NULL, 'No Cron Jobs were found. Check jobname in the above WHERE statement';

        -- Formatting unsynced rows as NDJSON ---------------------------------------------------

        -- Formatting each unsynced row into NDJSON
        FOR row_data IN (
            SELECT
                product_name,
                id,
                CAST(EXTRACT(epoch FROM updated_at) AS FLOAT) AS updated_at,
                user_id
            FROM products
            WHERE updated_at BETWEEN previous_sync_time AND current_sync_time
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

To test if the above query worked, manually add a row to the products table using Supabase's table editor. Check the _cron_ schema in the same table editor to observe when your cron job executed.

#### Testing if cron job updated Typesense

```bash
curl -X GET "<TYPESENSE URL>/collections/products/documents/search?q=*" \
    -H "X-TYPESENSE-API-KEY: <API KEY>" \
    | json_pp
```

Some users may prefer using servers as an intermediary to communicate with Typesense. This is particularly useful when it is necessary to santize or reformat data. Supabase natively offers serverless edge functions in Deno (TypeScript).

In order to track when edge functions were last called, a tracking table must be created.

#### Edge Function Tracking Table

```sql
CREATE TABLE edge_function_calls(
  id UUID NOT NULL DEFAULT uuid_generate_v4 (),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  function_name TEXT NOT NULL,
  CONSTRAINT edge_function_calls_pkey PRIMARY KEY (id)
);
```

It is also helpful to have a PL/pgSQL function that can both retrieve unsynced rows and update the _edge_function_calls_ table in a single request.

#### PL/pgSQL Function to Find Unsynced Rows and Record Edge Function Request

```sql
CREATE OR REPLACE FUNCTION get_updates_for_edge(edge_function_name TEXT)
RETURNS TABLE(
    id UUID,
    product_name TEXT,
    updated_at FLOAT,
    user_id UUID
)
AS $$
DECLARE
    prior_function_call TIMESTAMPTZ;
    current_function_call TIMESTAMPTZ;
BEGIN
    -- Get last function call
    SELECT
      MAX(created_at)
    FROM edge_function_calls
    WHERE function_name = edge_function_name
    INTO prior_function_call;

    -- Log current function call into edge_function_calls table
    INSERT INTO edge_function_calls (function_name)
    VALUES (edge_function_name)
    RETURNING created_at INTO current_function_call;

    -- If there were no prior function calls, set variable to TIMESTAMPTZ equivalent to 0
    IF prior_function_call IS NULL THEN
        prior_function_call := '1970-01-01 00:00:00+00';
    END IF;

    RETURN QUERY
        SELECT
            products.id,
            products.product_name,
            CAST(EXTRACT(epoch FROM products.updated_at) AS FLOAT) AS updated_at,
            products.user_id
        FROM products
        WHERE products.updated_at BETWEEN prior_function_call AND current_function_call;
END;
$$ LANGUAGE plpgsql;
```

To deploy an edge function, you must have a Node Package Manager, such as NPM, Yarn, or PNPM. NPM can be installed by downloading Node.JS through the official [download page](https://nodejs.org/en/download)

To create your first function, create a folder with your function name, and add an index.ts file inside. The code below is a modified version of the [Supabase PostgreSQL demo](https://Supabase.com/docs/guides/functions/connect-to-postgres), using the _get_products_updates_from_edge_ PL/pgSQL function from earlier.

#### Edge Function to Update Typesense

```typescript
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
      const result = await connection.queryObject`SELECT * FROM get_updates_for_edge('<EDGE FUNCTION NAME')`
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
      const body = await response.text()
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
```

With the function set-up, navigate to your function's parent directory in the terminal and execute the following command

#### Login to Supabase Command Line

```bash
npx supabase login
```

You will be prompted to enter your password and directed towards a link to generate an access token. After logging in, you can deploy your function.

#### Deploy Edge Function To Supabase

```bash
npx supabase functions deploy <YOUR FUNCTION'S FOLDER NAME>
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

## Step 4: Syncing Deletes

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
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X DELETE \
"http://localhost:8108/collections/companies/documents?filter_by=id:id1x3||id:idw24||id:id1d4"

```

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
            string_agg('id:' || deleted_row_id::text, '||')
            INTO id_arr, query_params
        FROM deleted_rows;

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
            string_agg('id:' || id::text, '||')
        FROM products
        WHERE user_id IS NULL
        INTO query_params;

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
