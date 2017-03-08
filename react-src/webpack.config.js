var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.join(__dirname, '../js/');
var APP_DIR = path.join(__dirname, 'app');

var config = {
  entry: path.join(APP_DIR, 'index.jsx'),
  output: {
    path: BUILD_DIR,
    filename: 'habla-content-script.js',
    publicPath: 'http://localhost:3000/'
  },
  module : {
    loaders : [
      {
        test : /\.jsx$/,
        include : APP_DIR,
        loader : 'babel'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?name=../img/[name].[ext]',
            'image-webpack?bypassOnDebug'
        ]
      }
    ]
  },
  watchOptions : {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/
  }
};

module.exports = config;
