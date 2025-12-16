const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    static: ['./'],
    historyApiFallback: true,
  },
  plugins: [
    new Dotenv(),
<<<<<<< admin-page
  ],
});
=======
  ]
});
>>>>>>> dev
