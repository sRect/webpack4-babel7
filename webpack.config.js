const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 打包html
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'); // 分离css
const PurifycssPlugin = require('purifycss-webpack'); // 消除无用的css
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin'); // 混淆压缩js
// const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const TerserPlugin = require('terser-webpack-plugin'); // 混淆压缩js

module.exports = {
  // devtool: 'inline-source-map',
  // entry: './src/index.js',
  entry: ['./src/index.js'], // 将两个文件打包成一个
  // entry: { // 多入口
  //   index: './src/index.js',
  //   a: './src/a.js'
  // },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:20].js' // 多出口
  },
  mode: process.env.NODE_ENV,
  resolve: {
    // 能够使用户在引入模块时不带扩展
    extensions: ['.js', '.json', '.vue', 'css', 'less'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  module: {
    rules: [{
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        // use: ['style-loader', 'css-loader'] // 从右往左
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'less-loader'
            }
          ]
        })
      },
      {
        test: /\.(png|jpg|gif|ttf|eot|woff(2)?)(\?[=a-z0-9]+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            outputPath: 'images/',
            name: '[name]_[hash:7].[ext]'
          }
        }]
      },
    ]
  },
  optimization: {
    // webpack4中废弃了webpack.optimize.CommonsChunkPlugin插件,用新的配置项替代,把多次import的文件打包成一个单独的common.js
    splitChunks: {
      cacheGroups: {
        commons: { // 抽离自己写的公共代码
          chunks: "initial",
          name: "common", // 打包后的文件名，任意命名
          minChunks: 2, //最小引用2次
          minSize: 0 // 只要超出0字节就生成一个新包
        },
        vendor: { // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 2,
          name: 'vendor', // 打包后的文件名，任意命名
          priority: 10 // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        exclude: /\/node_modules/,
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {
            drop_console: true,
            drop_debugger: true
          },
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
        },
      }),
      // new UglifyjsWebpackPlugin({
      //   uglifyOptions: {
      //     warnings: false,
      //     parse: {},
      //     compress: {
      //       drop_console: true,
      //       drop_debugger: true
      //     },
      //     mangle: true, // Note `mangle.properties` is `false` by default.
      //     output: null,
      //     toplevel: false,
      //     nameCache: null,
      //     ie8: false,
      //     keep_fnames: false,
      //   },
      // }),
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ExtractTextWebpackPlugin({
      filename: 'css/index.css',
      disable: process.env.NODE_ENV === 'development' ? true : false // 是否禁用(development下禁用，因为要热更新)
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'babel_demo',
      hash: true,
      minify: {
        collapseWhitespace: true, // 折叠空行
        removeAttributeQuotes: true
      },
      template: './index.html',
      // chunks: ['index', 'a'] // index.html 引入index.js
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'a.html',
    //   title: 'hello world',
    //   hash: true,
    //   minify: {
    //     collapseWhitespace: true, // 折叠空行
    //     removeAttributeQuotes: true
    //   },
    //   template: './index.html',
    //   chunks: ['a'] // a.html引入a.js
    // }),
    // 消除无用的css
    // new PurifycssPlugin({
    //   paths: glob.sync(path.join(__dirname, 'src/*.html'))
    // }),
    new webpack.HotModuleReplacementPlugin(),
    // new UglifyjsWebpackPlugin({
    //   exclude: /\/node_modules/,
    //   parallel: true,
    //   sourceMap: true,
    //   uglifyOptions: {
    //     warnings: false,
    //     parse: {},
    //     compress: {},
    //     mangle: true, // Note `mangle.properties` is `false` by default.
    //     output: null,
    //     toplevel: false,
    //     nameCache: null,
    //     ie8: false,
    //     keep_fnames: false,
    //   },
    // })
    // 暴露全局变量,引入第三方类库
    new webpack.ProvidePlugin({
      $: 'jquery', // npm
      jQuery: 'jQuery' // 本地Js文件
    }),
    // 指定环境, 定义环境变量
    new webpack.DefinePlugin({
      'process.env': env,
      'BASE_URL': '"http://api.xxx.com:8080"'
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3000,
    compress: true,
    hot: true,
    open: true,
    host: 'localhost',
    historyApiFallback: true, // 该选项的作用所有的404都连接到index.html
    proxy: {
      // 代理到后端的服务地址，会拦截所有以api开头的请求地址
      "/api": "http://localhost:3000"
    }
  }
}