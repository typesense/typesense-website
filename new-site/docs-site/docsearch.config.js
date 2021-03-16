// Echoes a JSON config that can be passed to the `CONFIG` env variable of docsearch scraper
const { typesenseVersions } = require('../typsenseVersions')
const config = {
  index_name: 'typesense_docs',
  start_urls: [
    {
      url: 'https://typesense.org/docs/(?P<version>.*?)/',
      variables: {
        version: typesenseVersions,
      },
    },
  ],
  selectors: {
    default: {
      lvl0: '.content__default h1',
      lvl1: '.content__default h2',
      lvl2: '.content__default h3',
      lvl3: '.content__default h4',
      lvl4: '.content__default h5',
      text: '.content__default p, .content__default li',
    },
  },
  scrape_start_urls: false,
  strip_chars: ' .,;:#',
}
console.log(JSON.stringify(config))
