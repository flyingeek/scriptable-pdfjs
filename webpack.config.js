require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ofp2text.js',
    library: "ofp2text",
    libraryTarget: "var"
  },
  module: {
    rules: [
      {
        test: /pdf\.worker\.js/,
        use: {
          loader: 'worker-loader',
          options: { inline: true, fallback: false }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html'),
      inject: "body",
      inlineSource: '.(js|css)$',
      filename: "ofp2text4scriptable.html"
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ]
};

module.exports = config;
