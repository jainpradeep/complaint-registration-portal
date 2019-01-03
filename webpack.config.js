const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader', 'angular2-template-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(html|css)$/,
        loader: 'raw-loader'
      },
    ]
  },
  
  resolve: {
    extensions: ['.ts', '.js']
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body'
    })
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: true
  },

  devServer: {
    contentBase: '.',
    host: '0.0.0.0',
    port: 3000,
    disableHostCheck: true,
    historyApiFallback: true
  },
  devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
};