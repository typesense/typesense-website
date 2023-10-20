// Echoes a JSON config that can be passed to the `CONFIG` env variable of docsearch scraper
const { typesenseVersions } = require('../typesenseVersions')
const config = {
  index_name: 'typesense_docs',
  start_urls: [
    {
      url: 'https://typesense.org/docs/(?P<version>.*?)/',
      variables: {
        version: typesenseVersions,
      },
    },
    {
      url: 'https://typesense.org/docs/overview/',
    },
    {
      url: 'https://typesense.org/docs/guide/',
    },
  ],
  selectors: {
    default: {
      lvl0: '.content__default h1',
      lvl1: '.content__default h2',
      lvl2: '.content__default h3',
      lvl3: '.content__default h4',
      lvl4: '.content__default h5',
      text: '.content__default p, .content__default ul li, .content__default table tbody tr',
    },
  },
  scrape_start_urls: false,
  strip_chars: ' .,;:#',
  custom_settings: {
    field_definitions: [
      { name: 'anchor', type: 'string', optional: true },
      { name: 'content', type: 'string', optional: true },
      { name: 'url', type: 'string', facet: true },
      { name: 'url_without_anchor', type: 'string', facet: true, optional: true },
      { name: 'version', type: 'string[]', facet: true, optional: true },
      { name: 'hierarchy.lvl0', type: 'string', facet: true, optional: true },
      { name: 'hierarchy.lvl1', type: 'string', facet: true, optional: true },
      { name: 'hierarchy.lvl2', type: 'string', facet: true, optional: true },
      { name: 'hierarchy.lvl3', type: 'string', facet: true, optional: true },
      { name: 'hierarchy.lvl4', type: 'string', facet: true, optional: true },
      { name: 'hierarchy.lvl5', type: 'string', facet: true, optional: true },
      { name: 'hierarchy.lvl6', type: 'string', facet: true, optional: true },
      { name: 'type', type: 'string', facet: true, optional: true },
      { name: '.*_tag', type: 'string', facet: true, optional: true },
      { name: 'language', type: 'string', facet: true, optional: true },
      { name: 'tags', type: 'string[]', facet: true, optional: true },
      { name: 'item_priority', type: 'int64' },
      {
        name: 'embedding',
        type: 'float[]',
        embed: {
          from: [
            'content',
            'hierarchy.lvl0',
            'hierarchy.lvl1',
            'hierarchy.lvl2',
            'hierarchy.lvl3',
            'hierarchy.lvl4',
            'hierarchy.lvl5',
            'hierarchy.lvl6',
            'tags',
          ],
          model_config: {
            model_name: 'ts/all-MiniLM-L12-v2',
          },
        },
      },
    ],
  },
}
console.log(JSON.stringify(config))
