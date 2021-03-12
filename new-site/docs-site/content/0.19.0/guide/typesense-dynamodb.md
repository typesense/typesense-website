# DynamoDB Integration with Typesense

Hey there! This post give you a guide to integrate Typesense cluster with AWS DynamoDB by setting up a trigger with AWS Lambda.

![Typesense DynamoDB Integration Chart](~@guide-images/typesense-dynamodb/typesense-dynamodb.svg)

## Step 1: Create a DynamoDB table

Create a DynamoDB with your choice of name and partition key ("id" is recommended). Now, after creating a DynamoDB database you should enable streams in the "Overview" section.

You can also do this using AWS CLI:

```bash
aws dynamodb create-table \
    --table-name typensense \
    --attribute-definitions AttributeName=id,AttributeType=N \
    --key-schema AttributeName=id,KeyType=HASH  \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES
```

## Step 2: Create Lambda Execution Role

Now let's create a "Lambda Execution Role" i.e give permission for your function, head over to IAM Roles section and create a new role with three main permissions:

* AmazonDynamoDBFullAccess
* AmazonDynamoDBFullAccesswithDataPipeline
* AWSLambdaBasicExecutionRole

These IAM role permissions are just examples for the purposes of this guide. Before deploying for production, please consult the IAM documentation to only grant the minimal permissions needed for your particular use case.

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
aws iam create-role --role-name TypesenseLambdaRole \
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

* Run a Lambda function ```typesense-indexing```. You create the function later in this tutorial.
* Access Amazon CloudWatch Logs. The Lambda function writes diagnostics to CloudWatch Logs at runtime.
* Read data from the DynamoDB stream for ```typesense```.

Now, we are going to attach the above roles to our IAM execution role which we have created

```bash
aws iam put-role-policy --role-name TypesenseLambdaRole \
    --policy-name TypesenseLambdaRolePolicy \
    --policy-document file://role-policy.json
```
## Step 3: Create a Lambda Function

## Step 4: Setup up a trigger

## Typesense Cloud

Sign-Up for a Typesense Cloud account and then create a new cluster

After creating a cloud typesense account, you will get an 'Endpoint URL' and get a API key using 'Generate an API Key' option

Using this only we will call our typesense server and index the dynamodb documents

## Code for Lambda function

Now, import the following packages which we have imported as a layer in Lambda.

```python
import typesense
import simplejson as json
```

Initialize a Typesense client. For the above e.g,

```python
client = typesense.Client({
    'nodes': [{
        'host': 'i3jcr4k0wfbz6qnup-1.a1.typesense.net',
        'port': '443',
        'protocol': 'https',
    }],
    'api_key': 'AaBOdPwIj7doBybWN5rfiXd12baeudWD',
    'connection_timeout_seconds': 2
})
```
Now, we need to create a collection. For creating a collection, check out the API Docs of typesense

[Typesense API Docs](https://new-site.typesense.org/docs/0.19.0/api/collections.html#create-a-collection)

When a data is added in DynamoDB, the Lambda function is called with `event` and `context` parameters. A sample event parameter form DynamoDB would be,

```json
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

A sample to code to to process above `event` response

```python
processed = 0
for record in event['Records']:
    ddb_record = record['dynamodb']
    if record['eventName'] == 'REMOVE':
        res = client.collections['<collection-name>'].documents[str(ddb_record['OldImage']['id']['N'])].delete()
    else:
        upload = ddb_record['NewImage'] # format your document here and the use upsert function to index it.
        res = client.collections['IPL-Data'].upsert(upload)
        print(res)
    processed = processed + 1

print('Successfully processed {} records'.format(processed))
```

## Deploying a Lambda function (only for Command Line)

* Create a file named `typesense.py ` and add your code into it.
* Create a zip file to contain `typesense.py`. If you have zip command-line utility
  ```bash
  zip typesense-indexing.zip typesense.py
  ```
* Get the ARN for the the execution role you created
  ```bash
  aws iam get-role --role-name TypesenseLambdaRole
  ```
  In output, look for ARN,
  ```json
  ...
  "Arn": "arn:aws:iam::region:role/service-role/WooferLambdaRole"
  ...
  ```
* Now, create the Lambda function
  ```bash
  aws lambda create-function \
    --region us-east-2 \
    --function-name typesense-indexing \
    --zip-file fileb://typesense-indexing.zip \
    --role `roleARN` \
    --handler typesense-indexing.handler \
    --timeout 5 \
    --runtime python3.7
  ```
* We need to ARN for DynamoDB to enable trigger for the database
  ```bash
  aws dynamodb describe-table --table-name `table-name`
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
    --function-name typesense-indexing \
    --event-source `streamARN ` \
    --batch-size 1 \
    --starting-position TRIM_HORIZON
  ```
* Make sure to test the function with a set of sample events before enabling the trigger.

That's a wrap! Now your DynamoDB database will be automatically indexed in your Typesense cluster.

## References
- [Sample Code](https://github.com/HarisaranG/dynamodb-typesense-indexing)
- [DynamoDB Streams](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.Lambda.Tutorial.html)
- [Typesense API](https://typesense.org/docs/0.19.0/api/)
- [Typesense guide](https://typesense.org/docs/0.19.0/guide/)