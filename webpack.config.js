const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const devMode = process.env.NODE_ENV !== "production"

module.exports = {
  entry: path.resolve(__dirname, "src/index.ts"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: {
      type: "umd",
      name: "@la-voliere/react-mask-editor",
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".less", ".css"],
    modules: ["node_modules"],
  },
  externals: [
    "react",
    "chroma-js"
  ],
  module: {
    rules: [
      {
        test: /\.(ts)x?$/,
        exclude: [/node_modules/],
        use: [{ loader: "ts-loader" }],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        type: "asset/inline",
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [].concat(devMode ? [] : [new MiniCssExtractPlugin({
    filename: "style.css"
  })]),
}
