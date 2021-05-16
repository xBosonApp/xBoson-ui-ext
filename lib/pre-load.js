// 预加载模块, 解决 webpack 打包后的循环依赖问题?
// 循环依赖在运行时抛出 '0 ,> [something] is not a function' 异常
// 不可简化!

require("core-js/internals/export");
require('@babel/runtime/helpers/typeof');
require("@babel/plugin-transform-modules-commonjs");
require("@babel/preset-env");
require("@babel/preset-react");
require("@babel/plugin-syntax-jsx");