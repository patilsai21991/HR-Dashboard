// webpack.prod.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production', // Sets Webpack to production mode (enables optimizations)
  devtool: 'source-map', // Generates source maps for production (optional, can be removed for smallest size)
  optimization: {
    runtimeChunk: 'single', // Creates a separate runtime chunk
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/, // Splits vendor (node_modules) code into a separate chunk
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
});