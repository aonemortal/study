const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
  },
}

const webpack = require('webpack')
module.exports = {
  chainWebpack: config => {
    config.plugin('provide').use(webpack.ProvidePlugin, [{
      'window.Quill': 'quill',
      'Quill': 'quill/dist/quill.js'
    }])

  }
}