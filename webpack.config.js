require('webpack');
const path = require('path');
const infos = require("./package.json");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `${infos.name}.js`,
    library: "pdfjs",
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
      filename: `${infos.name}.html`,
    }),
    new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
  ]
};

module.exports = config;
