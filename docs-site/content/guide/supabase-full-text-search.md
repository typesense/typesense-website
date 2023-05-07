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

To enable RLS on the products table, you can either enable it using the Supabase's _Table Editor_, or you can execute the following query:

#### Enabling RLS

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
```

The policies that will be used for the walkthrough are:

#### Products Table RLS Policies

```sql
CREATE POLICY "only an authenticated user can view their products in PostgreSQL"
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

> NOTE: Although most of this tutorial is done using PG/plSQL, Supabase does provide support for the [PLV8](https://supabase.com/docs/guides/database/extensions/plv8) and [PLJAVA](https://tada.github.io/pljava/) extensions. They enable users to write routines in JavaScript and Java, respectively.

### Tracking changes

Numerous methods exist for tracking unsynced rows in PostgreSQL, each offering its own advantages and disadvantages. This guide will explore various strategies for both real-time and bulk syncing. Ultimately, it's essential to determine which methods are best suited for your database design and use case.

Creating a log table for tracking unsynced rows, is the first strategy that will be demonstrated. It is relatively straightforward to set-up and provides the most control over the amount rows that are synced at any given time.

#### Creating a Logging Table to Track Unsynced Rows

```sql
CREATE TABLE public.products_sync_tracker (
    product_id UUID NOT NULL PRIMARY KEY,
    is_synced BOOLEAN DEFAULT FALSE,
    CONSTRAINT product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products (id) ON DELETE CASCADE
);
```

Triggers provide a PostgreSQL native way to populate the above table with the correct data.

#### Creating a Trigger to Monitor Product Inserts

```sql
CREATE OR REPLACE FUNCTION insert_products_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO products_sync_tracker (product_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER insert_products_trigger
    AFTER INSERT ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION insert_products_trigger_func();
```

#### Creating a Trigger to Monitor Product Updates

```sql
CREATE OR REPLACE FUNCTION update_products_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    -- Update products_sync_tracker table
    UPDATE products_sync_tracker
    SET is_synced = FALSE
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

If your Typesense instance is already running and connected to the internet, skip to the _Setup API Keys_ section. This guide refers to the Docker portion of [Typesense's installation documentation](https://Typesense.org/docs/guide/install-Typesense.html#option-1-Typesense-cloud) with some modifications.

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

> NOTE: consider formatting cURL responses with json_pp, jq, or some other JSON prettier

#### Creating a New Administrator API Key

```bash
curl 'http://localhost:8108/keys' \
    -X POST \
    -H "X-Typesense-API-KEY: Hu52dwsas2AdxdE" \
    -H 'Content-Type: application/json' \
    -d '{"description":"Admin key.","actions": ["*"], "collections": ["*"]}' 
```

Save the returned admin key value. It should be the only active key:

#### Listing All Active API Keys

```bash
curl 'http://localhost:8108/keys' \
    -X GET \
    -H "X-Typesense-API-KEY: ${Typesense_API_KEY}" 
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
     }' 
```

We will need to create two more keys: a "search only" key and "master" key for the products collection.

#### Creating Products Search-Only API Key

```bash
curl 'http://localhost:8108/keys' \
    -X POST \
    -H "X-Typesense-API-KEY: ${Typesense_API_KEY}" \
    -H 'Content-Type: application/json' \
    -d '{"description":"Search-only products key.","actions": ["documents:search"], "collections": ["products"]}' 
```

#### Creating Products Admin API Key

```bash
curl 'http://localhost:8108/keys' \
    -X POST \
    -H "X-Typesense-API-KEY: ${Typesense_API_KEY}" \
    -H 'Content-Type: application/json' \
    -d '{"description":"Admin products key","actions": ["*"], "collections": ["products"]}' 
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
    *,
    (response).body::JSON AS body
FROM
    net._http_collect_response(<request_id>);
```

> NOTE: At the end of STEP 4, we will discuss how this table can be used to retry failed syncs.

The net.http_post function is just one means for posting to Typesense directly. However, it has a significant limitation: it only supports JSON as the *Content-Type*, whereas Typesense requires NDJSON compatibility. Fortunately, JSON and NDJSON are functionally equivalent when dealing with a single row. As a result, the code below will work when it only has to send one row from PostgreSQL to Typesense.

If you go to the _Authentication_ tab in the Supabase side nav, you can create a new user. Using the new user profile, go to the Supabase _Table Editor_ and manually add new rows to the _products_ table.

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
            -- UNCOMMENT THE BELOW LINE TO MAKE THE QUERY WORK
            -- LIMIT 1
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

*PG_NET* functions are incompatible for multi-row updates, but they are powerful for real-time syncing. Direct PostgreSQL-to-Typesense real-time syncs utilize  triggers, which can block transactions for users. However, PG_NET functions are asynchronous, ensuring transactions are not delayed. They are also essential for deploying edge functions.

On the other hand, the *HTTP* extension supports NDJSON, making it suitable for direct bulk updates. It is also synchronous, so it will wait for a *success* or *fail* response, which makes handling errors simpler. It is compatible with PG_CRON cron jobs, which run on separate threads and do not interfere with the main database operations, minimizing impacts on user experience.

To perform bulk updates, rows must be converted into NDJSON. This can be accomplished using a PL/pgSQL function within PostgreSQL.

#### Formatting Table Rows into NDJSON

```sql
CREATE OR REPLACE FUNCTION get_products_ndjson()
RETURNS TEXT
AS $$
DECLARE
    ndjson TEXT := '';
BEGIN
    SELECT string_agg(row_to_json(row_data)::text, E'\n')
    INTO ndjson
    FROM (
        SELECT
            p.product_name,
            p.id,
            CAST(EXTRACT(epoch FROM p.updated_at) AS FLOAT) AS updated_at,
            p.user_id
        FROM products p
    ) AS row_data;
    RETURN ndjson;
END;
$$ LANGUAGE plpgSQL;
```

Utilizing the above function, you can use the _HTTP_ extension to make bulk upserts:

#### Bulk Approach to Sync with Typesense

```sql
SELECT
    status AS response_status,
    content AS response_body,
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
    "<TYPESENSE URL>/collections/products/documents/search?q=*"
```

## Step 4: Syncing Inserts/Updates

### Scheduling Bulk Updates/Inserts with Cron Jobs

You can schedule cron jobs to bulk sync a database with Typesense.

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

Cron jobs in PostgreSQL are timed using [cron-syntax](https://en.wikipedia.org/wiki/Cron). Each job can be run at most once per minute. Unfortunately, Supabase does not offer native support for bulk syncing at shorter intervals. An imperfect workaround involves scheduling multiple cron jobs with staggered timings, but this should be used with caution as too many cron jobs can strain your PostgreSQL instance. If you must bulk sync at shorter intervals, you should use a more precise external cron or bridge server for better control.

#### Function that Schedules Multiple Cron Jobs

```sql
CREATE OR REPLACE FUNCTION schedule_jobs (job_name TEXT, times_per_minute INTEGER DEFAULT 1)
RETURNS VOID
AS $$
DECLARE
    cnt INTEGER;
    sleep_interval INTERVAL;
BEGIN
    IF times_per_minute > 6 THEN
        RAISE EXCEPTION 'Max times cannot be greater than 6';
    END IF;

    sleep_interval := '60 seconds'::interval / times_per_minute;

    FOR cnt IN 1..times_per_minute LOOP
        PERFORM cron.schedule(
            (job_name || cnt)::TEXT,
            '* * * * *', -- Executes every minute (cron syntax)
            $$
            -- SQL query
                SELECT net.http_get(
                    -- URL of Supabase Edge function
                    url:='https://<reference id>.functions.Supabase.co/Typesense-example',
                    headers:='{
                        "Content-Type": "application/json", 
                        "Authorization": "Bearer <TOKEN>"
                    }'::JSONB
                ) as request_id;
            $$
        );
        
        IF times_per_minute <> 1 AND cnt <> times_per_minute THEN
            PERFORM pg_sleep(sleep_interval);
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

The following PL/pgSQL function converts unsynced rows into NDJSON and then upserts them into Typesense in bulk. If the upsert fails, the tracking table *products_sync_tracker* will be reverted to reflect this failure. By incorporating the function into a cron job, syncing at intervals becomes possible natively in PostgreSQL without the use of external servers. Though this is impressive, it does take up database resources. These functions should be set-up to finish quickly, so it is important to keep the sync size relatively low. By default, requests made by the *HTTP* extension timeout after 5 seconds. However, this can be changed by modifying the global variable *http.timeout_msec*.

#### Modifying HTTP Timeout

```sql
http.timeout_msec = 2400; -- milliseconds
```

#### Function to Bulk Sync Rows

```sql
CREATE OR REPLACE FUNCTION sync_products_updates()
RETURNS VOID
LANGUAGE plpgsql
AS $$
    DECLARE
        -- lock key: an arbitary number that will be used as a 'key' to lock the function
        -- only one instance of the function can have the key and run at any time
        lock_key INTEGER := 123456;
        is_locked BOOLEAN := FALSE;

        -- used to tell Typesense how many rows need to be synced
        total_rows INTEGER;

        -- variables for converting rows to NDJSON
        ndjson TEXT := '';

        -- variables for referencing http response values
        request_status INTEGER;
        response_message TEXT;
    BEGIN
        -- Create lock, so that only one instance of the function can
        -- be run at a time. If multiple syncs happen at the same time while 
        -- rows are actively being updated, a race condition can occur that causes 
        -- Typesense to receive stale data.
        SELECT pg_try_advisory_xact_lock(lock_key) INTO is_locked;
        IF NOT is_locked THEN
            RAISE EXCEPTION 'Could not lock. Other job in process';
        END IF;

        -- Update 40 unsynced products to be synced.
        -- Create a temporary table to return the row values into. 
        -- These will be synced with Typesense.
        -- The update will automatically be undone if the function fails  
        UPDATE public.products_sync_tracker
        SET is_synced = TRUE
        WHERE is_synced = FALSE
        LIMIT 40
        RETURNING product_id
        INTO TEMPORARY TABLE updated_rows ON COMMIT DROP;

        SELECT 
            COUNT(product_id) 
            INTO total_rows
        FROM updated_rows;

        IF total_rows < 1 THEN 
            RAISE EXCEPTION 'No rows need to be synced';
        END IF;

        -- Cast the soon-to-be synced rows into a Typesense interpretable format
        WITH row_data AS (
            SELECT
                p.product_name,
                p.id,
                CAST(EXTRACT(epoch FROM p.updated_at) AS FLOAT) AS updated_at,
                p.user_id
            FROM products p
            JOIN updated_rows u ON p.id = u.product_id
        )
        SELECT 
            string_agg(row_to_json(row_data)::text, E'\n')
        INTO ndjson
        FROM row_data;

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
            RAISE LOG 'Typesense Sync request failed. Message: %', response_message;
            -- Raises Exception, which undoes the transaction
            RAISE EXCEPTION 'UPSERT FAILED';
        ELSE
            -- A successful response will contain NDJSON of the results for each row
            /* possible results:
                {"success": true}
                {"success": false, "error": "Bad JSON.", "document": "[bad doc]"}
            */ 
            -- This must be processed to determine which rows synced and which did not
            WITH ndjson_from_response AS (
                SELECT unnest(string_to_array(response_message, E'\n')) AS ndjson_line
            ),
            ndjson_to_json_data AS (
                SELECT 
                    ndjson_line::JSON AS json_line
                FROM ndjson_from_response
            ),
            failed_syncs AS (
                SELECT 
                    json_line
                FROM ndjson_to_json_data
                WHERE (json_line->>'success')::BOOLEAN = FALSE
            ),
            unsynced_ids AS (
                SELECT 
                    ((json_line->>'document')::JSON->>'id')::UUID AS ids
                FROM failed_syncs
            )
            UPDATE public.products_sync_tracker
            SET is_synced = FALSE
            WHERE product_id IN (SELECT ids FROM unsynced_ids);
        END IF;
    END;
$$;
```

#### Cron Job to Bulk Upsert into Typesense

```sql
SELECT cron.schedule(
    'update-insert-Typesense-job',
    '* * * * *',
    $$
    -- SQL query
        SELECT sync_products_updates();
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
    -H "X-TYPESENSE-API-KEY: <API KEY>"
```

Some users may prefer using servers as an intermediary to communicate with Typesense. This has the benefit of reducing strain on the database, as well as being able to accomodate relatively high volume syncs. It is also particularly useful when it is necessary to santize or reformat data. Fortunately, Supabase offers serverless edge functions in Deno (TypeScript).

However, instead of putting all the logic onto a server, it is best to have a PL/pgSQL function that can fetch unsynced rows and update the *products_sync_tracker* table in a single request on behalf of the edge function.

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
            -- find 40 unsynced rows and update them as 'synced'. 
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
        -- reformat the rows to be compatible with Typesense
        SELECT
            products.id,
            products.product_name,
            -- Casting can be done in the edge function, as well
            CAST(EXTRACT(epoch FROM products.updated_at) AS FLOAT) AS updated_at,
            products.user_id
        FROM products
        INNER JOIN unsynced_rows ON unsynced_rows.product_id = products.id;
END;
$$ LANGUAGE plpgsql;
```

To deploy an edge function, you must have a Node Package Manager, such as NPM, Yarn, or PNPM. NPM can be installed by downloading Node.JS through the official [download page](https://nodejs.org/en/download)

To create your first function, create a folder with your function name, and add an index.ts file inside. The code below is a modified version of the [Supabase PostgreSQL demo](https://supabase.com/docs/guides/functions/connect-to-postgres), using the _get_products_updates_from_edge_ PL/pgSQL function from earlier.

> NOTE: All functions and their logs can be found in the *Edge Functions* section of your Supabase dashboard.

#### Edge Function to Sync Typesense

```typescript
import * as postgres from 'https://deno.land/x/postgres@v0.14.2/mod.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// define your types at top
type TProductRows = {
	id: string;
	product_name: string;
	updated_at: string;
	user_id: string;
}[];

// Your Database's connection URL is made available by default in all edge functions
// You can view it in the dashboard by going to the Project Settings's Database tab
const databaseUrl = Deno.env.get('SUPABASE_DB_URL')!;

// Create a database pool with three connections that are lazily established
const pool = new postgres.Pool(databaseUrl, 3, true);

serve(async (_req) => {
	try {
		// Grab a connection from the pool
		const connection = await pool.connect();

		try {
			// Retrieve unsynced products from the database
			const result = await connection.queryObject<TProductRows>`SELECT * FROM get_updates_for_edge()`;
			const unsyncedProducts = result.rows;

			// Convert unsyncedProducts into NDJSON format
			const unsyncedProductsNDJSON: string = unsyncedProducts
				.map((product) =>
					JSON.stringify({
						...product,
						updated_at: parseFloat(product.updated_at),
					})
				)
				.join('\n');

			// Sync the new products to Typesense
			const response = await fetch(
				// ADD YOUR TYPESENSE URL
				'<TYPESENSE URL>/collections/products/documents/import?action=upsert',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-ndjson',
						//ADD YOUR TYPESENSE API KEY
						'X-TYPESENSE-API-KEY': '<API KEY>',
					},
					body: unsyncedProductsNDJSON,
				}
			);

			// The response will contain NDJSON of the results. In the case that some updates failed,
			// we need to reflect this failure in the products_sync_tracker table
			/* possible results
				{"success": true}
				{"success": false, "error": "Bad JSON.", "document": "[bad doc]"}
			*/
			const ndJsonResponse = await response.text();
			// If there is no response, no rows needed to be synced so the function can return early
			if (!ndJsonResponse) {
				return new Response('no rows to sync', {
					status: 200,
					headers: {
						'Content-Type': 'application/json; charset=utf-8',
					},
				});
			}
			//converting response to array of objects
			let JSONStringArr = ndJsonResponse.split('\n');
			const parsedJSON = JSONStringArr.map((res) => JSON.parse(res));

			// filtering out the failed syncs' ids
			const failedSyncIds = parsedJSON
				.filter((doc) => !doc.success)
				.map((doc) => JSON.parse(doc.document).id);

			// if there are any failures, update the products_sync_tracker table to reflect the failed syncs
			if (failedSyncIds.length) {
				const result = await connection.queryArray(
					`UPDATE products_sync_tracker
					SET is_synced = FALSE
					WHERE product_id = ANY($1::uuid[])`,
					[failedSyncIds]
				);
			}

			// Return the response with the correct content type header
			return new Response(ndJsonResponse, {
				status: 200,
				headers: {
					'Content-Type': 'application/x-ndjson; charset=utf-8',
				},
			});
		} finally {
			// Release the connection back into the pool
			connection.release();
		}
	} catch (err) {
		console.error(err);
		return new Response(String(err?.message ?? err), {
			status: 500,
		});
	}
});
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

Although the above solution works well, if the edge function fails halfway through, there is no way in the current design to capture and resolve the failure. So far, most of the syncing has been tracked with a *products_sync_tracker* table. However, an alternative structure can be introduced that offers advantages for edge functions. Using the *products* table *updated_at* column, unsynced rows can be tracked by timing instead, which works well with edge functions. It is necessary to create a *edge_function_tracker* table. 

```sql
CREATE TABLE edge_function_tracker(
    id UUID NOT NULL DEFAULT uuid_generate_v4 (),
    start_time TIMESTAMPTZ DEFAULT NOW (),
    start_time_of_prev_func TIMESTAMPTZ,
    attempts INTEGER DEFAULT 1,
    func_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('SUCCEEDED', 'FAILED', 'PENDING')),
    request_id BIGINT NULL,
    CONSTRAINT products_pkey PRIMARY KEY (id)
);
```

For this design to work, creating a tracker PG/plSQL function that records edge function information before deploying them is required.

#### Edge Function Tracker/Deployer

```sql
CREATE OR REPLACE FUNCTION manage_edge_functions()
RETURNS VOID
AS $$
DECLARE
    func_request_id BIGINT;
    payload JSONB;
    prev_start_time TIMESTAMPTZ;
BEGIN
    -- Creates a new entry for the soon to be run edge function
    INSERT INTO edge_function_tracker 
    DEFAULT VALUES
    RETURNING to_jsonb(id, start_time) INTO payload;

    -- Get Previous function time.
    -- The prev and current time will be used to select 
    -- unsynced rows
    SELECT 
        start_time
        INTO prev_start_time
    FROM edge_function_tracker
    WHERE start_time < (payload->>'start_time')::TIMESTAMPTZ
    ORDER BY id DESC
    LIMIT 1;

    -- If there was no prior start time, set the prev_start_time to 0
    IF NOT FOUND THEN
        prev_start_time := '1970-01-01 00:00:00+00'::TIMESTAMPTZ;
    END IF;

    -- Reformat payload to include prev_start_time
    payload := payload || jsonb_build_object('start_time_of_prev_func', prev_start_time);

    -- Send request to edge function
    SELECT net.http_post(
        url := '<FUNCTION URL>',
        body := payload,
        headers := '{
            "Content-Type": "application/json", 
            "Authorization": "Bearer YOUR_ANON_KEY"
        }'::JSONB,
        timeout_milliseconds := 4000
    ) INTO func_request_id;

    -- Record request_id and start_time_of_prev_func
    UPDATE edge_function_tracker
    SET 
        request_id = func_request_id,
        start_time_of_prev_func = (payload->>'start_time_of_prev_func')::TIMESTAMPTZ
    WHERE id = payload->>'id'::UUID
END;
$$ LANGUAGE plpgsql;
```

The tracking PG/plSQL function will be called by a cron job to begin the syncing process.

#### Cron Job to Execute Edge Function
```sql
SELECT
  cron.schedule(
    'update-insert-Typesense-job',
    '* * * * *', -- Executes every minute (cron syntax)
	$$
    -- SQL query
        SELECT manage_edge_functions();
	$$
);
```

The edge function that will be used can be broken down into 7-step process, designed to ensure efficient synchronization of data:

1. Parse the request body to identify the specific rows that require synchronization.
2. Retrieve unsynchronized rows by querying the products table.
3. Convert the retrieved rows into the NDJSON (Newline Delimited JSON) format.
4. Synchronize the formatted rows with the Typesense.
5. Examine Typesense's response to determine if any rows failed to synchronize.
6. Update the products table to indicate the synchronization status of each row, marking any unsuccessful attempts.
7. Record the overall success or failure of the edge function within the edge_function_tracker table for monitoring and analysis.

#### Edge Function to Update Typesense

```typescript
import * as postgres from 'https://deno.land/x/postgres@v0.14.2/mod.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// define your types at top
type TProductRows = {
	id: string;
	product_name: string;
	updated_at: string;
	user_id: string;
}[];

type TRequestJSON = {
    id: string;
    start_time: string;
    start_time_of_prev_func: string;
}

// Your Database's connection URL is made available by default in all edge functions
// You can view it in the dashboard by going to the Project Settings's Database tab
const databaseUrl = Deno.env.get('SUPABASE_DB_URL')!;

// Create a database pool with three connections that are lazily established
const pool = new postgres.Pool(databaseUrl, 3, true);

serve(async (_req) => {
	try {
        // 1. Parse Request Body:
        const reqJSON = await req.json() as TRequestJSON;

		// Grab a connection from the pool
		const connection = await pool.connect();

		try {
			// 2. Retrieve unsynced products from the database
			const unsyncedRows = await connection.queryArray<TProductRows>(
                `SELECT 
                    *
                FROM products
                WHERE updated_at BETWEEN $1::TIMESTAMPTZ AND $2::TIMESTAMPTZ`, 
                [reqJSON.start_time_of_prev_func, reqJSON.start_time] 
            );

			// 3. Convert newProducts into NDJSON format
			const unsyncedProductsNDJSON: string = unsyncedRows
				.map((product) =>
					JSON.stringify({
						...product,
						updated_at: parseFloat(product.updated_at),
					})
				)
				.join('\n');

			// 4. Sync the new products with Typesense
			const response = await fetch(
				// ADD YOUR TYPESENSE URL
				'<TYPESENSE URL>/collections/products/documents/import?action=upsert',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-ndjson',
						//ADD YOUR TYPESENSE API KEY
						'X-TYPESENSE-API-KEY': '<API KEY>',
					},
					body: unsyncedProductsNDJSON,
				}
			);

			// The response will contain NDJSON of the results. In the case that some updates failed,
			// we need to reflect this failure in the products_sync_tracker table
			/* possible results
				{"success": true}
				{"success": false, "error": "Bad JSON.", "document": "[bad doc]"}
			*/
			const ndJsonResponse = await response.text();
			// If there is no response, no rows needed to be synced so the function can return early
			if (!ndJsonResponse) {
				return new Response('no rows to sync', {
					status: 200,
					headers: {
						'Content-Type': 'application/json; charset=utf-8',
					},
				});
			}


			// 5. filtering out the failed syncs' ids
            // converting response to array of JSON objects
			let JSONStringArr = ndJsonResponse.split('\n');
			const parsedJSON = JSONStringArr.map((res) => JSON.parse(res));
			const failedSyncIds = parsedJSON
				.filter((doc) => !doc.success)
				.map((doc) => JSON.parse(doc.document).id);

            // 6/7. Updates the "updated_at" column in the products table to NOW().
            // By doing so, the failed rows will be resynced by the next edge function 
            // Declare the function call to be a success.
			if (failedSyncIds.length) {
				const result = await connection.queryArray(
					`
                        BEGIN;
                            -- Update the "edge_function_tracker" table to reflect the 
                            -- function call's status

                                UPDATE edge_function_tracker
                                SET func_status = 'SUCCEEDED'
                                WHERE id = '$1'::UUID;

                            -- This line disables the updated_at trigger for the transaction. 
                            -- Without it, the trigger could potentially enter an infinite loop

                                SET LOCAL session_replication_role = 'replica';

                            -- Update failed product syncs to NOW(), so that they will included in the next
                            -- syncing function 

                                UPDATE products
                                SET updated_at = NOW() 
                                WHERE id = ANY($2::uuid[]);
                        COMMIT;
					)`,
					[reqJSON.id, failedSyncIds]
				);
			}

			// Return the response with the correct content type header
			return new Response(`synced rows between ${reqJSON.start_time_of_prev_func} and ${reqJSON.start_time}`, {
				status: 200,
				headers: {
					'Content-Type': 'application/x-ndjson; charset=utf-8',
				},
			});
		} finally {
			// Release the connection back into the pool
			connection.release();
		}
	} catch (err) {
		console.error(err);
		return new Response(String(err?.message ?? err), {
			status: 500,
		});
	}
});
```

Unfortunately, not all syncs will succeed. It's important to have some retry mechanism. Also, at some point the *edge_function_tracker* table may become bloated and need to be cleaned. The below PG/plSQL function manages both of these issues with the following steps:

1. Deletes successful sync records from the *edge_function_tracker* table.
2. Updates 'PENDING' functions to 'FAILED' if certain conditions are met
3. Re-attempts a failed sync request

#### Edge Function Mainter

```sql
CREATE OR REPLACE FUNCTION edge_function_maintainer()
RETURNS VOID
AS $$
DECLARE
    func_request_id BIGINT;
    payload JSONB;
BEGIN
    -- Any successful syncs that border two 'SUCCEEDED' rows are no longer necessary to maintain.
    -- To prevent the table from growing endlessly, these rows will be deleted
    WITH delete_conditions AS (
        SELECT id,
            func_status,
            LAG(func_status) OVER (ORDER BY start_time) AS prev_func_status,
            LEAD(func_status) OVER (ORDER BY start_time) AS next_func_status
        FROM edge_function_tracker
        WHERE 
            func_status = 'SUCCEEDED' 
            AND 
            prev_func_status = 'SUCCEEDED' 
            AND 
            next_func_status = 'SUCCEEDED'
    )
    DELETE FROM edge_function_tracker
    WHERE id IN (SELECT id FROM success_conditions);

    -- Starts with updating any bad reqeusts in the edge_function_tracker table to 'FAILED'
    -- NOTE: the _http_response table, which holds the status for all PG_NET requests, is "unlogged".
    -- This means that it will lose all its data in the case of a crash
    -- As a failsafe, all functions that have not yet responded after 2 minutes will be assumed to have failed
    WITH failed_rows AS (
        SELECT 
            edge_function_tracker.id
        FROM edge_function_tracker
        INNER JOIN net._http_response ON net._http_response.id = edge_function_tracker.pg_request_id
        WHERE net._http_response.status_code NOT BETWEEN 200 AND 202
    )
    UPDATE edge_function_tracker
    SET status = 'FAILED',
    WHERE 
        failed_rows.id = edge_function_tracker.id
            OR
        status = 'PENDING' AND (NOW() - start_time > '2 minutes'::interval)
    ;

    -- Fetch the data of a failed request, so that it can placed into a payload
    -- for a retry
    SELECT 
        id,
        start_time,
        start_time_of_prev_func
    FROM edge_function_tracker
    WHERE status = 'FAILED' and attempts < 4 -- if attempts are more than 3, assume the data is unsyncable for this section
    LIMIT 1
    RETURNING to_jsonb(*) INTO payload;

    -- test to see if there are any viable requests to retry
    IF (payload->>id)::UUID IS NOT NULL THEN
        -- Send retry request to edge function
        SELECT net.http_post(
            url := '<FUNCTION URL>',
            body := payload,
            headers := '{
                "Content-Type": "application/json", 
                "Authorization": "Bearer YOUR_ANON_KEY"
            }'::JSONB,
            timeout_milliseconds := 4000
        ) INTO func_request_id;

        -- Record new request_id
        UPDATE edge_function_tracker
        SET 
            request_id = func_request_id,
            attempts = attempts + 1
        WHERE id = (payload->>'id')::UUID
    END IF;
END;
$$ LANGUAGE plpgSQL;
```
    
The maintainer function can be scheduled with a cron job

#### Retry Failed Functions Every Minute

```sql
SELECT
  cron.schedule(
    'edge_function_maintainer',
    '* * * * *', -- Executes every minute (cron syntax)
	$$
    -- SQL query
        SELECT bulk_delete_products();
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

> WARNING: It is important to restate that these requests are asynchronous, and they must be to avoid blocking user transactions. Once the request is sent, a background worker will listen for a response and add it to the net._http_response table. It's possible to monitor updates/inserts in the *net._http_response table* with cron jobs or triggers to retry failed syncs. Unfortunately, using triggers for immediate retries can be dangerous for this task, especially if the data is incompatible with Typesense. Without a clear breakout condition, they can enter an infinite loop. 

## Step 5: Syncing Deletes

### Scheduling Bulk Deletes with Cron Jobs

Bulk syncing deletions between Supabase and Typesense can be done with one of two approaches:

1. Temporarily preserving deleted rows' ids in an intermediary table until they can be removed from Typesense
2. Soft deleting rows from a table until they are removed from TypeSense

#### Approach 1: Intermediary Tables

To achieve the first approach, you need to create a table to store the deleted rows' ids until Typesense can be synced.

#### deleted_rows Table

```sql
CREATE TABLE deleted_rows(
    table_name TEXT, --assumes table and Typesense collection share a name
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

In Typesense, bulk deletions can be performed with DELETE requests that include the conditions for deletion as query parameters within the URL.

#### Example: Delete Request 

```bash
curl -g -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X DELETE \
"http://localhost:8108/collections/companies/documents?filter_by=id:[id1, id2, id3]"
```
> NOTE: it may be necessary to use the url-encoded characters for square brackets "[ ]", respectively %5B and %5D

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
            '<TYPESENSE URL>/collections/products/documents?filter_by=id:' || query_params,
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
ALTER POLICY "only an authenticated user is allowed to remove their products " 
ON public.products 
TO authenticated
USING(
  FALSE
);
```

Instead of directly deleting rows, users will have to modify a row in a way that essentially tags it as unuseable. In this case, setting the user_id column to NULL will make the row inaccessible to all app users.

A PG/plSQL function can be made with either the *PG_NET* or *HTTP* extension to sync nullified rows with Typesense and then delete them:

#### Syncing Nullified Rows Before Deleting Them

```sql
-- Create the function to delete the record from Typesense
CREATE OR REPLACE FUNCTION bulk_delete_products()
RETURN VOID
LANGUAGE plpgSQL
AS $$
    DECLARE
        -- stores and formats deleted row ids
        deleted_id_arr UUID[];
        query_params TEXT;

        -- monitors Typesense's response
        request_status INTEGER;
        response_message TEXT;
    BEGIN
        -- Select and format of ids from deleted_rows
        SELECT
            string_agg(id::text, ','),
            array_agg(id)
            INTO query_params, deleted_id_arr
        FROM products
        WHERE user_id IS NULL
        LIMIT 40;

        -- places the list of ids in url encoded brackets [ ], which are %5B and %5D
        query_params :=  '%5B' || query_params || '%5D'

        -- Send delete request to Typesense server
        SELECT
            status,
            content
            INTO request_status, response_message
        FROM http((
            'DELETE'::http_method,
            -- ADD TYPESENSE URL
            '<TYPESENSE URL>/collections/products/documents?filter_by=id:' || query_params, 
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
            DELETE FROM products WHERE id = ANY(deleted_id_arr);
        END IF;
    END;
$$;
```

The function can be called every minute by a cron job.

#### Scheduling Bulk Deletes

```sql
SELECT
  cron.schedule(
    'delete-from-typesese',
    '* * * * *', -- Executes every minute(cron syntax)
	$$
    -- SQL query
        SELECT bulk_delete_products();
	$$
  );
```

### Syncing in Realtime

Depending on how you organize your database, you may come across a situation
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
        url := '<TYPESENSE URL>/collections/products/documents?filter_by=user_id:=%s' || OLD.id::TEXT,
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

Unfortunately, if the sync fails for some reason, there would be no more data to reference to make a re-attempt. This can be managed by making a table to temporarily store deleted query values until the sync is confirmed.

```sql
CREATE TABLE deleted_query_values (
    query_field TEXT NOT NULL,
    query_param UUID NOT NULL,
    request_id BIGINT,
    created_at TIMESTAMPTZ NULL DEFAULT now()
)
```

The trigger's function can be modified to preserve the deleted values.

```sql
-- Create the function to delete the record from Typesense
CREATE OR REPLACE FUNCTION bulk_delete_products()
    RETURNS TRIGGER
    LANGUAGE plpgSQL
AS $$
DECLARE
    func_request_id BIGINT;
BEGIN
    SELECT net.http_delete(
        -- ADD TYPESENSE URL
        url := '<TYPESENSE URL>/collections/products/documents?filter_by=user_id:=%s' || OLD.id::TEXT,
        -- ADD API KEY
        headers := '{"X-Typesense-API-KEY": "<API KEY>"}'
    ) INTO func_request_id;

    -- populate table
    INSERT INTO deleted_query_values (query_field, query_param, request_id)
    VALUES ('user_id', OLD.id, func_request_id);

    RETURN OLD;
END $$;
```

The *deleted_query_values* and *net._http_response* table can be referenced periodically with a cron job to retry failed attempts.

```sql
CREATE OR REPLACE FUNCTION retry_bulk_deletes()
RETURNS VOID
LANGUAGE plpgSQL
AS $$
DECLARE
    id UUID;
    field TEXT;
    func_request_id BIGINT;
BEGIN
    -- clear synced rows from deleted_query_values table
    DELETE FROM deleted_query_values 
    USING net._http_response
    WHERE 
        net._http_response.status_code = 200
            AND
        net._http_response.id = deleted_query_values.request_id
        

    -- get oldest delete query that failed
    SELECT 
        query_param,
        query_field
        INTO id, field
    FROM deleted_query_values
    INNER JOIN net._http_response ON net._http_response.id = deleted_query_values.request_id
    WHERE net._http_response.status_code NOT BETWEEN 200 AND 202
    ORDER BY created_at
    LIMIT 1;

    -- reattempt deletion sync
    SELECT net.http_delete(
        -- ADD TYPESENSE URL
        url := FORMAT('<TYPESENSE URL>/collections/products/documents?filter_by=%s:=%s', field, id::TEXT),
        -- ADD API KEY
        headers := '{"X-Typesense-API-KEY": "<API KEY>"}'
    ) INTO func_request_id;

    -- update deleted_query_values with new values
    UPDATE deleted_query_values
    SET 
        request_id = func_request_id,
        created_at = NOW()
    WHERE query_param = id;
END $$;
```

The function can be placed into a cron job to gradually retry failed syncs.

#### Scheduling Bulk Deletes

```sql
SELECT
  cron.schedule(
    'delete-from-typesese-retry',
    '* * * * *', -- Executes every minute(cron syntax)
	$$
    -- SQL query
        SELECT retry_bulk_deletes();
	$$
  );
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