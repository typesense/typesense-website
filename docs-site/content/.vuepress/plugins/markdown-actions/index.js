const resolve = require('path').resolve

module.exports = (options, context) => ({
  name: 'markdown-actions',
  enhanceAppFiles: resolve(__dirname, 'enhanceApp.js'),
})

