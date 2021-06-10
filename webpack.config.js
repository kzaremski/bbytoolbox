// Packages
const path = require('path');

module.exports = {
  module:{
    rules:[
      {
        test:/\.(js|jsx)$/,
        exclude:/node_modules/,
        use: {
          loader:'babel-loader',
        },
      },
    ]
  },
  entry: {
    main: path.resolve(__dirname, "src/main.jsx"),
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js"
  }
};