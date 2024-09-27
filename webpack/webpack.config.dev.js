/**
 * @AUTHOR zhy
 * @DATE zhy (2022/1/24)
 * @Description:
 */
// eslint-disable-next-line no-undef,@typescript-eslint/no-var-requires
const { merge } = require('webpack-merge');
// eslint-disable-next-line no-undef,@typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line no-undef,@typescript-eslint/no-var-requires
const BASE = require('./webpack.config.base.js');
// eslint-disable-next-line no-undef,@typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line no-undef,@typescript-eslint/no-var-requires
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../src/config/development/serviceHost.conf');

module.exports = merge(
  BASE,
  smp.wrap({
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    target: 'web',
    devServer: {
      proxy: config.proxy,
      compress: false, // enable gzip compression
      historyApiFallback: true, // true for index.html upon 404, object for multiple paths
      hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
      open: true,
      port: 3000,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*', // 如果使用无界微服务框架作为子项目，这里需要填本地无界主项目的地址，比如 http://localhost:7700
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Accept,Accept-Encoding,Cookie,X-Auth-Token',
        'Access-Control-Expose-Headers': 'X-Subject-Token,X-Openstack-Request-Id,X-Auth-Token'
      }
      // client:{
      //   overlay: false
      // }
    },

    plugins: [
      new HtmlWebpackPlugin({
        title: 'OpenHydra',
        // eslint-disable-next-line no-undef
        favicon: path.resolve(__dirname, '../public/logo.svg'),
        template: path.resolve(__dirname, '../public/index.html')
      }) // new ForkTsCheckerWebpackPlugin(), // 编译时typescript类型检查

    ]

  })
);
