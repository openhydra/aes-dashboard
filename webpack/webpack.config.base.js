/**
 * @AUTHOR zhy
 * @DATE zhy (2022/1/24)
 * @Description:
 */
// eslint-disable-next-line no-undef,@typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line no-undef,@typescript-eslint/no-var-requires
const webpack = require('webpack');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// eslint-disable-next-line no-undef,@typescript-eslint/no-var-requires
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 性能优化-资源压缩
// eslint-disable-next-line no-undef,@typescript-eslint/no-var-requires
const CompressionPlugin = require('compression-webpack-plugin');

// eslint-disable-next-line no-undef,@typescript-eslint/no-var-requires
const TerserWebpackPlugin = require('terser-webpack-plugin');
// eslint-disable-next-line no-undef,@typescript-eslint/no-var-requires
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// eslint-disable-next-line no-undef,@typescript-eslint/no-var-requires
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

// 定义压缩文件类型
// eslint-disable-next-line no-undef
prductionGzip = true;
const productionGzipExtensions = ['js', 'css'];

// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

// eslint-disable-next-line no-undef
const DEV = process.env.NODE_ENV === 'development';

const getLessCssLoaders = () => [
  DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      sourceMap: false,
      modules: {
        localIdentName: '[path][name]-[local]'
      }
    }
  },
  {
    //antd-pro，需安装less less-loader
    loader: 'less-loader',
    options: {
      lessOptions: {
        // strictMath: true,
        // noIeCompat: true,
        javascriptEnabled: true,
        modifyVars: {
          // 'primary-color': '#2660FC',
          // 'link-color': '#2660FC'
        }
      }
    }
  }
];
// eslint-disable-next-line no-undef
module.exports = smp.wrap({
  entry: './src/index.tsx',
  output: {
    // webpack 如何输出结果的相关选项
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, '../dist'),
    // 文件名
    filename: '[name].[contenthash].bundle.js',
    publicPath: '/',
    clean: true
  },
  plugins: [
    // 提示 compression-webpack-plugin@3.0.0的话asset改为filename
    // asset： 目标资源名称。 [file] 会被替换成原始资源。[path] 会被替换成原始资源的路径， [query] 会被替换成查询字符串。默认值是 "[path].gz[query]"。
    // algorithm： 可以是 function(buf, callback) 或者字符串。对于字符串来说依照 zlib 的算法(或者 zopfli 的算法)。默认值是 "gzip"。
    // test： 所有匹配该正则的资源都会被处理。默认值是全部资源。
    // threshold： 只有大小大于该值的资源会被处理。单位是 bytes。默认值是 0。
    // minRatio： 只有压缩率小于这个值的资源才会被处理。默认值是 0.8。
    new CompressionPlugin({
      filename: '[path][base].gz', // 提示compression-webpack-plugin@3.0.0的话asset改为filename
      algorithm: 'gzip',
      test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8
    }),

    // new BundleAnalyzerPlugin(),

    // 全局化使用
    new webpack.DefinePlugin({
      // eslint-disable-next-line no-undef
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
    //新增插件

  ],
  module: {
    rules: [
      {
        test: /\.m?(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            // 减少转译文件
            plugins: ['@babel/plugin-transform-runtime'],
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      // 解决使用pro-table 中解析modules时less样式
      {
        test: /\.less$/i,
        use: getLessCssLoaders()
      },
      // 忽略掉所有 .md 文件
      {
        test: /\.md$/,
        loader: 'url-loader',
        options: {
          limit: 10,
          generator: () => ''
        }
      },
      // 解决使用css modules时antd样式不生效
      {
        test: /\.css$/,
        // 排除业务模块，其他模块都不采用css modules方式解析
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        // 如果图片太大再转成base64, 会让图片的体积增大 30% ，得不偿失。
        generator: {
          filename: 'images/[name][ext]'
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      }
    ]
  },
  optimization: {
    runtimeChunk: 'single',
    minimizer: [
      new TerserWebpackPlugin({
        // js压缩
        extractComments: false,
        terserOptions: {
          compress: {
            // eslint-disable-next-line camelcase
            pure_funcs: ['console.log']
          }
        }
      }),
      new CssMinimizerPlugin({
        parallel: true
      }) // css压缩整合
    ].filter(Boolean),
    splitChunks: {
      // 分包优化
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          priority: -10,
          reuseExistingChunk: false,
          test: /node_modules\/(.*)\.js/
        },
        styles: {
          name: 'styles',
          test: /\.(less|css)$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    }
  },
  //webpack打包后的生成文件和入口文件体积过大，超过了默认值,打包会出现warning，以下为解决方案
  performance: {
    hints: 'warning',
    //入口起点的最大体积 整数类型（以字节为单位）
    maxEntrypointSize: 50000000,
    //生成文件的最大体积 整数类型（以字节为单位 300k）
    maxAssetSize: 30000000,
    //只给出 js\css 文件的性能提示
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.less'],
    alias: {
      '@src': path.resolve('./src'),
      '@ant-design/icons/lib/dist$': path.resolve(__dirname, 'utils/antdIcon.js')
    },
    modules: ['node_modules']
  }
});
