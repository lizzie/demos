var webpack = require('webpack');

module.exports = {
  entry: "./demo-4/index.js",
  output: {
    //chunkFilename: "[chunkhash].bundle.js"
    filename: "[id].[name].js"
  },
  plugins: [
    new webpack.optimize.MinChunkSizePlugin(1024)
  ]
};