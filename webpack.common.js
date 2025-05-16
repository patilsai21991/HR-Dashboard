// webpack.common.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Main entry point of our application
  output: {
    filename: '[name].[contenthash].js', // Bundled output file name
    path: path.resolve(__dirname, 'dist'), // Output directory
    publicPath: '/', // Public URL of the output directory when referenced in a browser
  },
  module: {
    rules: [
      // Rule for JavaScript files (transpiled by Babel)
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      // Rule for CSS files (processed by style-loader and css-loader)
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    // Cleans the 'dist' folder before each build
    new CleanWebpackPlugin(),
    // Generates an HTML file and injects the bundled JS
    new HtmlWebpackPlugin({
      template: './public/index.html', // Path to your HTML template
      filename: 'index.html', // Output HTML file name
    }),
  ],
};