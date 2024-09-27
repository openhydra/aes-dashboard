/**
 * @AUTHOR zhy
 * @DATE zhy (2022/1/24)
 * @Description:
 */
/* eslint-disable */
const path = require('path');
const { resolve, join } = require('path');
const { merge } = require('webpack-merge');
const BASE = require('./webpack.config.base.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// eslint-disable-next-line no-undef,@typescript-eslint/no-var-requires
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(BASE, {
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
      ignoreOrder: true
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../public/index.html'),
      //注入静态资源
      inject: true,
      favicon: resolve(__dirname, '../public/logo.svg'),
      minify: {
        // 去除html注释
        removeComments: true,
        // 去除html空格
        collapseWhitespace: true,
        // 尽可能去除属性引号
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: resolve(__dirname, '../public/studentImg'), to: resolve(__dirname, '../dist/studentImg') },
        { from: resolve(__dirname, '../public/files'), to: resolve(__dirname, '../dist/files') }
      ]
    }) //打包静态资源
    //暂时屏蔽，使用后导致css包导入有误，可能有冲突，后期再解决
    // new PurgeCSSPlugin({ // 删除没有用到的css样式
    //     paths: glob.sync(`${PATHS.src}/**/*`, {nodir: true}),
    // }),
  ],

  optimization: {
    minimize: true,
    //Tree Shaking:通过标记某些函数是否被使用，之后通过 Terser 来进行优化的
    usedExports: true
  }
});
