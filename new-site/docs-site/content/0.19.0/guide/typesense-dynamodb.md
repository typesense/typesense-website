# DynamoDB Integration with Typesense

Hey there! This post give you a guide to integrate Typesense cluster with AWS DynamoDB by setting up a trigger with AWS Lambda.

![Typesense DynamoDB Integration Chart](~@guide-images/typesense-dynamodb/typesense-dynamodb.svg)

## Step 1: Create Typesense Cluster

Sign up for a new account in [Typesense Cloud](https://cloud.typesense.org/) and get Endpoint URL, Port number and API key.

We're using Typesense Cloud for this walk-through since we need a public Typesense endpoint for the Lambda function to be able write to.

You can also self-host Typesense on a server of your choice. See [Typesense Installation](./install-typesense.md) for more details on how to self-host Typesense.
## Step 2: Create a DynamoDB table

Create a DynamoDB table with your choice of name and partition key ("id" is recommended).

After creating a DynamoDB table you want to enable streams in the Overview section of AWS console.

You can also do this using AWS CLI:

```bash
aws dynamodb create-table \
    --table-name YourTableName \
    --attribute-definitions AttributeName=id,AttributeType=N \
    --key-schema AttributeName=id,KeyType=HASH  \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES
```

## Step 3: Create Lambda Execution Role

Now let's create a "Lambda Execution Role" i.e give permission for your function, head over to IAM Roles section and create a new role with three main permissions:

* AmazonDynamoDBFullAccess
* AmazonDynamoDBFullAccesswithDataPipeline
* AWSLambdaBasicExecutionRole

:::warning
These IAM role permissions are just examples for the purposes of this guide. Before deploying for production, please consult the IAM documentation to only grant the minimal permissions needed for your particular use case.
:::

You can also do this using AWS CLI:

Create a file named ```trust-relationship.json``` with the following contents.
```json
{
   "Version": "2012-10-17",
   "Statement": [
     {
       "Effect": "Allow",
       "Principal": {
         "Service": "lambda.amazonaws.com"
       },
       "Action": "sts:AssumeRole"
     }
   ]
}
```

Then, create execute the following command

```bash
aws iam create-role --role-name YourLambdaRole \
    --path "/service-role/" \
    --assume-role-policy-document file://trust-relationship.json
```

Now, create ```role-policy.json``` with the following contents. (Replace ```accountID``` and ```region```)

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "lambda:InvokeFunction",
            "Resource": "arn:aws:lambda:region:accountID:function:typesense-indexing*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:region:accountID:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:DescribeStream",
                "dynamodb:GetRecords",
                "dynamodb:GetShardIterator",
                "dynamodb:ListStreams"
            ],
            "Resource": "arn:aws:dynamodb:region:accountID:table/typesense/stream/*"
        },
    ]
}
```

The policy has three statements that allow TypesenseLambdaRole to do the following:

* Run a Lambda function ```typesense-indexing```. We'll be creating the function later in this tutorial.
* Access Amazon CloudWatch Logs. The Lambda function writes diagnostics to CloudWatch Logs at runtime.
* Read data from the DynamoDB stream for ```typesense```.

Now, we are going to attach the above roles to our IAM execution role which we have created

```bash
aws iam put-role-policy --role-name YourLambdaRole \
    --policy-name TypesenseLambdaRolePolicy \
    --policy-document file://role-policy.json
```
## Step 4: Create a Lambda Function

Head over to Lambda section of AWS and create a new Lambda function with the above created execution role. See AWS Lambda function documentation for detailed information [AWS Lambda Execution Role](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)

Now, let's create a new python script file named `lambda_function.py`.

Here's what an example event that we will process using lambda function,

```javascript
{
    "Records": [
        {
            "eventID": "2",
            "eventVersion": "1.0",
            "dynamodb": {
            "OldImage": {
                // Existing values
            },
            "SequenceNumber": "222",
            "Keys": {
                // your partion key and sort key
            },
            "SizeBytes": 59,
            "NewImage": {
                // New Values
            },
            "awsRegion": "us-east-2",
            "eventName": "MODIFY", // this can 'INSERT', 'MODIFY' and 'DELETE'
            "eventSourceARN": "<AWS-ARN>",
            "eventSource": "aws:dynamodb"
        },
    ]
}
```

A example code snippet for the function,

```python
def lambda_handler(event, context):
    client = typesense.Client({
        'nodes': [{
            'host': '<Endpoint URL>',
            'port': '<Port Number>',
            'protocol': 'https',
        }],
        'api_key': '<API Key>',
        'connection_timeout_seconds': 2
    })

    processed = 0
    for record in event['Records']:
        ddb_record = record['dynamodb']
        if record['eventName'] == 'REMOVE':
            res = client.collections['<collection-name>'].documents[str(ddb_record['OldImage']['id']['N'])].delete()
        else:
            upload = ddb_record['NewImage'] # format your document here and the use upsert function to index it.
            res = client.collections['<collection-name>'].upsert(upload)
            print(res)
        processed = processed + 1
        print('Successfully processed {} records'.format(processed))
    return proceessed
```

See the [Typesense API](../api/README.md) documentation for detailed information about all the parameters available to create collections and documents.

::: tip
Install all your dependencies using `pip install <dependency-name> -t .`. This will install all the dependencies for the function in the current directory.
:::

After this zip your current directory and upload it to your Lambda function.

You can also do this using AWS CLI,

* Get the ARN for the the execution role you created.
    ```bash
    aws iam get-role --role-name YourLambdaRole
    ```
    In output, look for ARN,
    ```json
    ...
    "Arn": "arn:aws:iam::region:role/service-role/YourLambdaRole"
    ...
    ```

* Now, create the Lambda function

    ```bash
    aws lambda create-function \
    --region us-east-2 \
    --function-name YourLambdaFunction \
    --zip-file fileb://YourZipFile.zip \
    --role YourRoleARN \
    --handler lambda_function.lambda_handler \
    --timeout 5 \
    --runtime python3.7
    ```

Make sure to test the function with a set of sample events before enabling the trigger.

## Step 5: Setup up a trigger

Now, navigate to your DynamoDB table in the AWS Console, then visit the Triggers section and add this existing Lambda function to that table.

You can also do this using the AWS CLI:

* Get ARN for DynamoDB table
    ```bash
    aws dynamodb describe-table --table-name YourTableName
    ```
    Note, the ARN for the stream
    ```json
    ...
    "LatestStreamArn": "arn:aws:dynamodb:`region`:`accountID`:table/`table-name`/stream/`timestamp`"
    ...
    ```
* Now, add this ARN to Lambda
    ```bash
    aws lambda create-event-source-mapping \
    --region us-east-1 \
    --function-name YourLambdaFunction \
    --event-source YourStreamARN \
    --batch-size 1 \
    --starting-position TRIM_HORIZON
    ```

That's a wrap! Now your DynamoDB database will be automatically indexed in your Typesense cluster.

## References
- [Sample Code](https://github.com/HarisaranG/dynamodb-typesense-indexing)
- [DynamoDB Streams](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.Lambda.Tutorial.html)
- [Typesense API](../api/README.md)
- [Typesense guide](./README.md)