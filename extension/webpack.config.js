const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development", // or 'production'
  entry: {
    index: "./build/background/indeed/index.js",
    setup: "./build/content_scripts/indeed/processes/setup.js",
    getInitialData:
      "./build/content_scripts/indeed/processes/getInitialData.js",
    apply: "./build/content_scripts/indeed/processes/apply.js",
  }, // Entry point of your application
  output: {
    path: path.resolve(__dirname, "webpack_build"), // Output directory
    filename: "[name].js", // Output file
  },
  devtool: "cheap-module-source-map", // Avoids using 'eval'
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    // Ignore react-native-sqlite-storage module
    new webpack.IgnorePlugin({
      resourceRegExp: /^react-native-sqlite-storage$/,
    }),
  ],
};
