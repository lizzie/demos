module.exports = {
  entry: "./demo-5/index",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.jsx?$/, loader: 'jsx-loader?harmony', exclude: /node_modules/}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json', '.less', '.png', '.jsx']
  }
};