// webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development', // Sets Webpack to development mode
  devtool: 'inline-source-map', // Generates source maps for easier debugging
  devServer: {
    static: './dist', // Serves content from the 'dist' directory
    hot: true, // Enables Hot Module Replacement (HMR)
    historyApiFallback: true, // Fallback to index.html for SPA routing
    open: true, // Opens the browser after server starts
    port: 1000, // Port for the dev server
  },
});