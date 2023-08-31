# Recommendations

Typesense can generate recommendations based on the actions they take in a given session, using the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html`">Vector Search</RouterLink> feature.

This involves building a Machine Learning model to generate <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html#what-is-an-embedding`">embeddings</RouterLink>, storing them in Typesense, and then doing a nearest-neighbor search.

In this article's we'll talk about how to use the [Starspace](https://ai.meta.com/tools/starspace/) ML model to generate embeddings. 

[Transformers4Rec](https://github.com/NVIDIA-Merlin/Transformers4Rec) is another ML model that can be used for this use-case, among others. 

### Scenario

We'll use an e-commerce products dataset in this article for illustration, but the concepts below can be applied to any domain (eg: recommending articles, movies, or any type of records stored in Typesense).

## Step 1: Prepare training dataset

We'll be using [Starspace](https://ai.meta.com/tools/starspace/) to build our ML model. 

Starspace expects the training dataset in the following format - one line for each user session and the set of items that they interacted with in that session.

<Tabs :tabs="['session-data.txt']">
  <template v-slot:session-data.txt>

```
apple orange banana broccoli mango
cereals soda bread nuts cookies
tissue detergent butter cheese milk eggs
ice_cream milk pancake_mix muffins
```
  </template>
</Tabs>

In the example above, the first line indicates that a certain user interacted with (viewed, bought, added to cart, etc) the products `apple`, `orange`, `banana`, `broccoli` and `mango` in a single session.

Another user (or may be even the same user as above) interacted with the products `cereals`, `soda`, `bread`, `nuts` and `cookies` in another session.

:::tip
We're using the `product_name` in this example to make this article easier to read.
In a production setting, you'd want to use the product's ID or SKU in the training dataset.
:::

## Step 2: Setup Starspace

### Install system dependencies

Ensure that you have a C++11 compiler (gcc-4.6.3 or newer or Visual Studio 2015 or clang-3.3 or newer).

On macOS you'd need to install XCode and on Linux distros, you'd need to install the `build-essential` package from your distro's package manager.

### Clone Starspace source code

```shell
git clone https://github.com/facebookresearch/Starspace.git
cd Starspace
```

### Setup Boost

Boost is a library required by Starspace. 

From inside the `Starspace` directory above, run the following:

```shell
curl -LO https://boostorg.jfrog.io/artifactory/main/release/1.82.0/source/boost_1_82_0.tar.gz
tar -xzvf boost_1_82_0.tar.gz
```

### Compile Starspace

From inside the `Starspace` directory above, run the following:

```shell
make -e BOOST_DIR=boost_1_82_0 && \
  make embed_doc -e BOOST_DIR=boost_1_82_0
```

To verify that Starspace is working fine, if you run `./starspace`, you should see output similar to the following:

```shellsession
$ ./starspace
Usage: need to specify whether it is train or test.

"starspace train ..."  or "starspace test ..."
...
```

## Step 3: Train Starspace model

Name the file with your training dataset from Step 1 as `session-data.txt`.

Then run the following command to train your model:

```shell
./starspace train \
  -trainFile <path/to/session-data.txt> \
  -model productsModel \
  -label '' \
  -trainMode 1 \
  -epoch 25 \
  -dim 100
```

Once this command runs, it will generate two files - a binary file called `productsModel` and a TSV file with model weights called `productsModel.tsv`.

You want to run this training step periodically as you collect new session data as users use your site / app. 

## Step 4: Generate embeddings

First extract all the unique products from our training dataset:

```bash
export unique_items=$(tr ' ' '\n' < session-data.txt | sed '/^$/d' | sort -u)
export output_jsonl_file="products-with-embeddings.jsonl"
```

For each product, generate embeddings and store them in a JSONL file:

```bash
echo -n > ${output_jsonl_file}

while read -r item; do
    embedding=$(echo "${item}" | ./embed_doc productsModel | tail -1 | tr ' ' ',')
    echo "{\"id\":\"${item}\",\"embedding\":[${embedding%?}]}" >> "${output_jsonl_file}"
done <<< "${unique_items}"
```

This will generate a JSONL file that looks like this:

<Tabs :tabs="['products-with-embeddings.jsonl']">
  <template v-slot:products-with-embeddings.jsonl>

```json lines
{"id":"apple","embedding":[-0.129717,0.173566,0.105385,0.0413297,-0.0290213,-0.0255852,0.0825889,-0.0261474,-0.0672213,-0.020061,-0.0227523,-0.232531,0.126667,0.053292,0.0092951,-0.117847,-0.0203866,0.067803,0.0669588,-0.0958568,-0.126915,0.120737,0.0547092,0.00512978,0.0257105,-0.0784047,-0.0348654,-0.125596,0.087177,0.132318,0.151595,-0.0326471,-0.169206,-0.00846743,0.184474,-0.148861,0.0110634,-0.0613974,0.0422888,-0.137809,0.0259965,-0.0851748,0.0202873,-0.120347,0.182447,0.110794,-0.200759,0.130639,-0.157653,-0.0173171,0.101569,-0.224391,-0.0160616,-0.0754992,-0.0967191,0.00498547,-0.144638,0.046945,-0.11333,-0.0533871,0.0118368,0.0670858,-0.0714718,-0.0474113,0.0123388,0.0553516,-0.163903,0.0201541,-0.0880148,0.0344916,-0.0213696,0.111026,0.0823451,-0.0152207,0.0427815,0.00890293,-0.163427,-0.165768,0.0409641,0.0668304,0.0868884,-0.0690655,-0.120059,-0.157864,-0.12657,0.0895369,-0.0551588,-0.138711,-0.0834502,0.0384778,-0.122425,0.00729352,-0.108975,-0.201364,-0.0596544,-0.0512629,-0.0172166,-0.147633,0.048211,0.0167111]}
{"id":"banana","embedding":[-0.151976,0.167556,0.0984403,0.0582992,-0.0267645,-0.0632901,0.0818063,-0.0577236,-0.0661825,-0.0224044,-0.0083418,-0.235444,0.106222,0.098582,-0.0422992,-0.16124,-0.0754309,0.0859816,0.0505005,-0.0773229,-0.0878463,0.126327,0.0319473,0.0662375,0.0288876,-0.099176,-0.0356668,-0.118937,0.085241,0.145321,0.127992,-0.0275212,-0.164231,0.007687,0.15164,-0.149566,0.0513335,-0.0522685,0.00915292,-0.127394,0.0438007,-0.0371664,0.0524856,-0.126597,0.187275,0.0891057,-0.229951,0.138657,-0.146845,0.0245155,0.0622531,-0.22075,-0.0497431,-0.0837679,-0.092076,0.00150625,-0.158956,-0.00107306,-0.104141,-0.0596481,0.00658634,0.0868983,-0.0158821,-0.0623965,0.0369001,0.0743422,-0.218009,0.0531221,-0.033627,0.036802,-0.0232749,0.149437,0.0692087,0.0290572,-0.00513245,-0.0166902,-0.162802,-0.15936,0.0567595,0.101776,0.125398,-0.114981,-0.0962633,-0.110599,-0.0872082,0.0987341,-0.0343689,-0.0974114,-0.0465906,0.00473119,-0.133105,0.0337405,-0.0637639,-0.194511,-0.0586302,0.0310114,0.004405,-0.108879,-0.0131596,0.0469659]}
...
```
  </template>
</Tabs>

We can now ingest this JSONL file into Typesense.

## Step 5: Index the embeddings in Typesense

```bash
export TYPESENSE_API_KEY=xyz
export TYPESENSE_URL='https://xyz.a1.typesense.net'
```

Create a collection:

```bash
curl "${TYPESENSE_URL}/collections" \
       -X POST \
       -H "Content-Type: application/json" \
       -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
       -d '{
         "name": "products",
         "fields": [
           {"name": "name", "type": "string", "optional": true},
           {"name": "description", "type": "string", "optional": true},
           {"name": "price", "type": "float", "optional": true},
           {"name": "categories", "type": "string[]", "optional": true},
           {"name": "embedding", "type": "float[]", "num_dim": 100 }
         ]
       }'
```

Notice how we've set `num_dim: 100`. This correlates to the `-dim 100` parameter we set when training our Starspace model.

Import the JSONL file with embeddings into the collection:

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
      -X POST \
      -T products-with-embeddings.jsonl \
      "${TYPESENSE_URL}/collections/products/documents/import?action=emplace"
```

We're only inserting the embeddings for each product here. You can also import other values like name, description, price, categories, etc separately using the same `id` field as reference to populate the rest of the product record.

## Step 6: Generate recommendations

Now let's say a user lands on our site / app and interacts with the following products in their session:

```
mango broccoli milk
```

To generate recommendations based on this session data, let's first generate embeddings:

```shell
export embedding=$(echo "mango broccoli milk" | ./embed_doc productsModel | tail -1 | tr ' ' ',')
```

```shell
echo ${embedding}
-0.0862846,0.127956,0.0558543,0.0745331,0.02449,-0.131018,0.0886827,-0.0571893,-0.0398686,-0.0116799,-0.0164978,-0.173818,0.0478985,0.109211,-0.0826394,-0.177671,-0.219366,0.180478,-0.0140154,-0.0237589,-0.010896,0.115979,-0.044924,0.129452,-0.0111529,-0.0978542,-0.121468,-0.0700872,-0.0190036,0.116127,0.0617186,-0.0463324,-0.172141,0.0302211,0.0610366,-0.0831281,0.04558,-0.00370933,-0.107602,-0.0394414,0.0334175,0.0429023,0.133572,-0.124658,0.225743,-0.0156787,-0.284864,0.148183,-0.0508378,0.175489,-0.0417769,-0.0920536,-0.0443016,-0.0838343,-0.0694042,-0.0333535,-0.108574,-0.0894618,-0.022049,-0.0500605,-0.0234268,0.00732048,0.0817547,0.00764651,0.0285933,0.100818,-0.229398,0.0508415,0.117766,-0.0289333,-0.0493134,0.167664,0.0696889,0.115228,-0.0609508,-0.12562,-0.0450054,-0.0648439,0.0817176,0.169663,0.133255,-0.111001,-0.0467052,-0.0373238,0.005385,0.111311,-0.0171787,0.0311545,0.0474074,-0.0301008,-0.0555648,0.0776044,-0.0287841,-0.162136,-0.0511268,0.174767,-0.0169033,-0.0223623,-0.140496,0.154727
```

Now we can send the embedding generated for this user's session data to Typesense as a `vector_query` to do a nearest neighbor search, which will return the list of products to recommend to this user:

```shell
curl "${TYPESENSE_URL}/multi_search" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -d '{
          "searches": [
            {
              "q": "*",
              "collection": "products",
              "vector_query": "embedding:(['${embedding%?}'], k:10, distance_threshold: 1)"
            }
          ]
        }' | jq '.results[0].hits[] | .document.id'
```

This will return the following recommendations, which we can show to users in our UI:

```
"broccoli"
"mango"
"banana"
"apple"
"orange"
"tissue"
"detergent"
"cheese"
"milk"
"butter"
```

:::tip
We're using the product's name in this example to make this article easier to read.
In a production setting, you'd want to use the product's ID or SKU in the training dataset and to generate embeddings.
:::