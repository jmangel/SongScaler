const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// function modify(buffer) {
//   // copy-webpack-plugin passes a buffer
//   var manifest = JSON.parse(buffer.toString());

//   // pretty print to JSON with two spaces
//   manifest_JSON = JSON.stringify(manifest, null, 2);
//   return manifest_JSON;
// }

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(wav|gif|jpg|png|mp3|aac|ogg)$/,
        loader: 'file-loader'
      },
      {
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json", ".mjs", ".wasm"],
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, "src/index.html"),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "./static/**/*",
          to:   "./",
          // transform (content, _) {
          //     return modify(content)
          // }
        },
        {
          from: "./src/styles/**/*",
          to:   "./",
          // transform (content, _) {
          //     return modify(content)
          // }
        },
        {
          from: "./src/service_workers/**/*",
          to:   "./",
          // transform (content, _) {
          //     return modify(content)
          // }
        },
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    disableHostCheck: true,
    headers: {
      'Service-Worker-Allowed': '/',
    },
  },
};
