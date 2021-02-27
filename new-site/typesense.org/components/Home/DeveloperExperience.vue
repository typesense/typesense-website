<template>
  <div>
    <HomeSectionHeader
      heading="Batteries-Included Developer Experience"
      sub-heading="Zero to Instant-Search, in 30 seconds"
    />

    <HomeDeveloperExperienceStep>
      <template #code>
        <pre data-language="bash" data-display-language="Shell">
docker run \
        -p 8108:8108 -v/tmp:/data \
        typesense/typesense:0.18.0
          --data-dir /data --api-key=xyz</pre
        >
        <pre data-language="javascript">const a = 1;</pre>
      </template>
      <template #description>
        <h4>1. Run Typesense</h4>
        <div>Use Docker, our native binaries or our RPM or DEB packages.</div>
        <div>
          Or, use
          <a href="https://cloud.typesense.org" target="_blank"
            >Typesense Cloud</a
          >
          to provision a cluster with a few clicks.
        </div>
      </template>
    </HomeDeveloperExperienceStep>

    <HomeDeveloperExperienceStep>
      <template #code>
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
              "default_sorting_field": "ratings_count"
            }'

curl "http://localhost:8108/collections/books/documents/import" \
        -X POST \
        -H "X-TYPESENSE-API-KEY: xyz" \
        -d '
          {"title":"Book 1",author:"Author1","ratings":24}
          {"title":"Book 2",author:"Author2","ratings":31}
          {"title":"Book 3",author:"Author3","ratings":30}'</pre
        >
        <pre data-language="javascript">const a = 2;</pre>
      </template>
      <template #description>
        <h4>2. Index Data</h4>
        <div>Create a collection, then add some documents to it.</div>
      </template>
    </HomeDeveloperExperienceStep>

    <HomeDeveloperExperienceStep>
      <template #code>
        <pre data-language="bash" data-display-language="Shell">
curl "http://localhost:8108/collections/books/documents/search?q=boo" \
        -H "X-TYPESENSE-API-KEY: xyz"</pre
        >
        <pre data-language="javascript">const a = 3;</pre>
      </template>
      <template #description>
        <h4>And, that's it! Search away.</h4>
        <div>
          You now have a typo-tolerant, search server you can send search
          queries to.
        </div>
        <div class="mt-2">
          <a
            href="https://cloud.typesense.org"
            target="_blank"
            class="btn btn-primary"
            role="button"
          >
            <strong>Try on Typesense Cloud</strong>
          </a>
        </div>
      </template>
    </HomeDeveloperExperienceStep>
  </div>
</template>
