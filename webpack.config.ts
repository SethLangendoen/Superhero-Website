const path = require('path');

module.exports = {
  entry: './src/index.js', // Update this with the path to your entry file
  output: {
    filename: 'bundle.js', // Name of the output bundle file
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  module: {
    rules: [
      // Define rules for loading different file types (e.g., JavaScript, CSS)
      // You may need additional loaders based on your project's requirements
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Example: Use Babel for JavaScript files
        },
      },
    ],
  },
  devServer: {
    compress: true,
    disableHostCheck: true,
    port: 3000, // Set the port to 3000 or another port of your choice
    contentBase: path.join(__dirname, 'dist'), // Serve content from the 'dist' directory
    watchContentBase: true, // Enable watching files in the 'contentBase' directory
  },
};
