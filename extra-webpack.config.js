module.exports = {
  module: {
    rules: [{
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.less$/,
        use: [{
          loader: "less-loader",
          options: {
            modifyVars: { // 修改主题变量

            },
            javascriptEnabled: true
          }
        }]
      }
    ]
  }
}
