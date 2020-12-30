'use strict';

const path = require("path");

module.exports = {
  entry: {
    "preview-panel": "./src/webview/previewPanel.tsx"
  },
  output: {
    path: path.resolve(__dirname, "..", "media"),
    filename: "[name].js"
  },
  // devtool: "eval-source-map",
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
        options: {}
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.ttf$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  performance: {
    hints: false
  }
};