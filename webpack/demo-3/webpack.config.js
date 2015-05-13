var webpack = require('webpack');

var commonsPlugin =
  new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
  entry: {
    profile: "./demo-3/profile.js",
    feed: "./demo-3/feed.js"
  },
  output: {
    path: __dirname,
    filename: "[name].js"
  },
  plugins: [commonsPlugin]
};