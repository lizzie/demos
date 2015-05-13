module.exports = {
  entry: "./demo-2/index.js",
  output: {
    path: __dirname,
    publicPath: 'http://mycdn.com/',
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
      {test: /\.css$/, loader: 'style-loader!css-loader' },

      {test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]},

      {test: /\.(png|jpe?g)$/, loader: 'url-loader?limit=8192'}
    ]
  }
};