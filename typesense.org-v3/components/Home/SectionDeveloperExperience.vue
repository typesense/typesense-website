<script lang="ts" setup>
const typesenseLatestVersion = "28.0";
</script>
<template>
  <section class="flex w-full flex-col gap-6">
    <div class="ctn">
      <div class="guide">
        <div class="max-md:mb-8 max-md:text-center">
          <h3>
            Batteries-Included <br />
            Developer Experience
          </h3>
          <p class="subtext">Zero to Instant-Search, in 30 seconds 🚀</p>
        </div>
        <div>
          <div class="step">Step 01</div>
          <h4>Run Typesense</h4>
          <p class="subtext !text-[14px]">
            Use Docker, our native binaries or our RPM or DEB packages. Or, use
            Typesense Cloud to provision a cluster with a few clicks.
          </p>
        </div>
      </div>
      <CodeBlockTabbed state-id="install-typesense" class="code">
        <pre data-language="bash" data-display-language="Docker">
docker run \
    -p 8108:8108 -v/tmp:/data \
    typesense/typesense:{{ typesenseLatestVersion }} \
      --data-dir /data --api-key=xyz</pre
        >
        <pre data-language="bash" data-display-language="DEB">
curl -O https://dl.typesense.org/releases/{{
            typesenseLatestVersion
          }}/typesense-server-{{ typesenseLatestVersion }}-amd64.deb

apt install ./typesense-server-{{ typesenseLatestVersion }}-amd64.deb</pre
        >
        <pre data-language="bash" data-display-language="RPM">
curl -O https://dl.typesense.org/releases/{{
            typesenseLatestVersion
          }}/typesense-server-{{ typesenseLatestVersion }}-1.x86_64.rpm

yum install ./typesense-server-{{ typesenseLatestVersion }}.x86_64.rpm</pre
        >
        <pre data-language="bash" data-display-language="Linux">
curl -O https://dl.typesense.org/releases/{{
            typesenseLatestVersion
          }}/typesense-server-{{ typesenseLatestVersion }}-linux-amd64.tar.gz

tar xvzf ./typesense-server-{{ typesenseLatestVersion }}-linux-amd64.tar.gz

./typesense-server --data-dir /tmp --api-key=xyz</pre
        >
        <pre data-language="bash" data-display-language="macOS">
brew install typesense/tap/typesense-server@{{ typesenseLatestVersion }}</pre
        >
      </CodeBlockTabbed>
    </div>
    <div class="ctn">
      <div class="guide">
        <div></div>
        <div>
          <div class="step">Step 02</div>
          <h4>Import Your Data</h4>
          <p class="subtext !text-[14px]">
            Create a collection, then add some documents to it.
          </p>
        </div>
      </div>

      <CodeBlockTabbed class="code">
        <pre data-language="bash" data-display-language="Shell">
curl "http://localhost:8108/collections" \
        -X POST \
        -H "X-TYPESENSE-API-KEY: xyz" \
        -d '{
              "name": "books",
              "fields": [
                {"name": "title", "type": "string" },
                {"name": "author", "type": "string" },
                {"name": "ratings", "type": "int32" }
              ],
              "default_sorting_field": "ratings"
            }'

curl "http://localhost:8108/collections/books/documents/import" \
        -X POST \
        -H "X-TYPESENSE-API-KEY: xyz" \
        -d '
          {"title":"Book 1","author":"Author1","ratings":24}
          {"title":"Book 2","author":"Author2","ratings":31}
          {"title":"Book 3","author":"Author3","ratings":30}'</pre
        >
        <pre data-language="javascript">
// npm install typesense @babel/runtime

const Typesense = require('typesense')
const client = new Typesense.Client({
  'nodes': [{'host': 'localhost', 'port': '8108', 'protocol': 'http'}],
  'apiKey': 'xyz'
})

const schema = {
  "name": "books",
  "fields": [
    {"name": "title", "type": "string"},
    {"name": "author", "type": "string"},
    {"name": "ratings", "type": "int32"}
  ],
  "default_sorting_field": "ratings"
}

const documents = [
    {"title":"Book 1","author":"Author1","ratings":24},
    {"title":"Book 2","author":"Author2","ratings":31},
    {"title":"Book 3","author":"Author3","ratings":30}
  ]

client.collections().create(schema).then(() => {
  client.collections('books').documents().import(documents)
})</pre
        >
        <pre data-language="php" data-display-language="PHP">
// composer require php-http/curl-client typesense/typesense-php

use Typesense\Client;
$client = new Client(
  [
    'api_key' => 'xyz',
    'nodes'   => [['host' => 'localhost', 'port' => '8108', 'protocol' => 'http']],
  ]
);

$schema = [
  "name" => "books",
  "fields" => [
    ["name" => "title", "type" => "string"],
    ["name" => "author", "type" => "string"],
    ["name" => "ratings", "type" => "int32"]
  ],
  "default_sorting_field" => "ratings"
];
$client->collections->create($schema);

$documents = [
  ["title"=>"Book 1","author"=>"Author1","ratings"=>24],
  ["title"=>"Book 2","author"=>"Author2","ratings"=>31],
  ["title"=>"Book 3","author"=>"Author3","ratings"=>30]
];
$client->collections['books']->documents->import($documents);</pre
        >

        <pre data-language="python">
# pip install typesense

import typesense
client = typesense.Client({
  'nodes': [{ 'host': 'localhost', 'port': '8108', 'protocol': 'http' }],
  'api_key': 'xyz'
});

schema = {
  "name": "books",
  "fields": [
    {"name": "title", "type": "string"},
    {"name": "author", "type": "string"},
    {"name": "ratings", "type": "int32"}
  ],
  "default_sorting_field": "ratings"
}
client.collections.create(schema)

documents = [
  {"title":"Book 1","author":"Author1","ratings":24},
  {"title":"Book 2","author":"Author2","ratings":31},
  {"title":"Book 3","author":"Author3","ratings":30}
]
client.collections['books'].documents.import_(documents)</pre
        >

        <pre data-language="ruby">
# gem install typesense

require 'typesense'
client = Typesense::Client.new(
  nodes: [{ host: 'localhost', port: '8108', protocol: 'http' }],
  api_key: 'xyz'
);

schema = {
  name: "books",
  fields: [
    { name: "title", type: "string" },
    { name: "author", type: "string" },
    { name: "ratings", type: "int32" }
  ],
  default_sorting_field: "ratings"
}
client.collections.create(schema)

documents = [
  {"title" => "Book 1", "author" => "Author1", "ratings" => 24},
  {"title" => "Book 2", "author" => "Author2", "ratings" => 31},
  {"title" => "Book 3", "author" => "Author3", "ratings" => 30}
]
client.collections['books'].documents.import(documents)</pre
        >
      </CodeBlockTabbed>
    </div>

    <div class="ctn">
      <div class="guide">
        <div></div>
        <div>
          <div class="step">Step 03</div>
          <h4>And, that's it! Search away</h4>
          <p class="subtext !text-[14px]">
            You now have a typo-tolerant, search server you can send search
            queries to.
          </p>
        </div>
      </div>
      <CodeBlockTabbed class="code">
        <pre data-language="bash" data-display-language="Shell">
curl "http://localhost:8108/collections/books/documents/search?query_by=title,author&q=boo" \
        -H "X-TYPESENSE-API-KEY: xyz"</pre
        >
        <pre data-language="javascript">
console.log(client.collections('books').documents().search({
  'query_by': 'title,author',
  'q': 'boo'
}))</pre
        >
        <pre data-language="php" data-display-language="PHP">
print_r($client->collections['books']->documents->search([
  'query_by' => 'title,author',
  'q' => 'boo'
]));</pre
        >
        <pre data-language="python">
print(client.collections['books'].documents.search({
  'query_by': 'title,author',
  'q': 'boo'
}))</pre
        >
        <pre data-language="ruby">
puts client.collections['books'].documents.search({
  query_by: 'title,author',
  q: 'boo'
})</pre
        >
      </CodeBlockTabbed>
    </div>
  </section>
</template>

<style scoped>
.ctn {
  @apply relative flex h-[650px] justify-between gap-24 overflow-hidden rounded-[32px] bg-secondary-bg pl-32 max-md:h-auto max-md:flex-col max-md:gap-8 max-md:rounded-b-none max-md:rounded-t-3xl max-md:px-4;
}
.guide {
  @apply flex flex-col justify-between py-14 max-md:pb-0 max-md:pt-8;
}
.step {
  @apply mb-3 text-sm tracking-tight;
  opacity: 0.7;
}
.code {
  @apply mt-[142px] min-h-[350px] flex-1 max-md:mt-0 max-md:max-h-[350px] max-md:!min-w-[calc(100%+48px)];
  max-width: 801px;
  min-width: 801px;
}
</style>
