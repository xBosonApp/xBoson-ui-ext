const path = require('path');
const WebpackBar = require('webpackbar');

const externlib = ['fs', 'v8', 'util', 'module', 'os', 'domain', 'async_hooks',
  "http", "https", "tty", "constants", "readline", "string_decoder", "stream",
  "vm","inspector",
  // 这个模块使用的正则表达式引擎无法解析
  "needle",
];

const externals = {};

externlib.forEach(function(n) {
  externals[n] = 'commonjs2 '+ n;
});


// 资源文件打包说明: https://webpack.docschina.org/guides/asset-modules/
module.exports = {
  mode: 'production',
  target: 'es5',

  entry: './index.js',
  // entry : './test/basic.es6.js',

  output: {
    filename: 'xboson-ui-ext.pack.js',
    path: path.resolve(__dirname, './dist'),
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [
      {
        test: /\.js$|\.mjs$/,
        // 不可对 core-js 进行转换
        exclude: /core-js/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  // 检测模块功能, 替换为 require/exports
                  modules: 'commonjs', // commonjs / auto,
                  // es6 的垫片功能
                  useBuiltIns: 'usage',
                  corejs: { version: "3.12.1", proposals: false },
                }
              ],
            ],
            compact: false,
            minified: false,
            cacheDirectory: './dist/cache',
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  regenerator: true,
                  // absoluteRuntime: true,
                }
              ]
            ]
          }
        },
      },
    ]
  },

  optimization: {
    minimize : false,
    moduleIds: 'named',
  },

  plugins: [
    new WebpackBar({
      profile : true,
    })
  ],

  // 外部库用 require() 加载
  externals,

  resolve: { 
    fallback: {  
      // Nodejs 模块
      "path": require.resolve("path-browserify"),
      "url": require.resolve("url/"),
      "assert": require.resolve("assert/"),
      "crypto": require.resolve("crypto-browserify"),
      "buffer": require.resolve("buffer/"),

      // Consolidate.js 模板引擎合并库引用, 这些库都是动态加载, 可以不存在
      "velocityjs": false,
      "dustjs-linkedin": false,
      "atpl": false,
      "liquor": false,
      "twig": false,
      "ejs": false,
      "eco": false,
      "jazz": false,
      "jqtpl": false,
      "hamljs": false,
      "hamlet": false,
      "whiskers": false,
      "haml-coffee": false,
      "hogan.js": false,
      "templayed": false,
      "handlebars": false,
      "underscore": false,
      "lodash": false,
      "walrus": false,
      "mustache": false,
      "just": false,
      "ect": false,
      "mote": false,
      "toffee": false,
      "dot": false,
      "bracket-template": false,
      "ractive": false,
      "htmling": false,
      "babel-core": false,
      "plates": false,
      "react-dom/server": false,
      "react": false,
      "vash": false,
      "slm": false,
      "marko": false,
      "teacup/lib/express": false,
      "coffee-script": false,

      // stylus 的可选库
      './lib-cov/stylus': false,

      // @vue/component-compiler 忽略
      'vue': false
    }
  }
};