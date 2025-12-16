const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 5174,
    liveReload: true,
    hot: true,
    open: true,
    static: ['./'],
    historyApiFallback: true,
    proxy: [ { context: '/api', target: 'http://localhost:8080', changeOrigin: true } ]
  },
  plugins: [
    new Dotenv(),
  ],
});

