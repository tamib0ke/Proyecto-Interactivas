const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    //este fue codigo de chat gpt porque no me servia para verlo en el cel 
    host: '0.0.0.0',
    port: 8080,
    static: './',
    //
    liveReload: true,
    hot: true,
    open: true,
    static: ['./'],
  },
});
