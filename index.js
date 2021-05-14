var babel = require("@babel/core");
var vc    = require('vue-template-compiler');
var sassl = require('sass');
var lessl = require('less');

module.exports = {
  es5   : es5,
  jsx   : jsx,
  ts    : ts,
  tsx   : tsx,
  vue   : vue,
  sass  : sass,
  less  : less,
};


//
// 转换更高版本的 js 为 es5 语法
//
function es5(filename, code) {
  return babel.transform(code, {
    filename      : filename,
    configFile    : false,
    babelrc       : false,
    babelrcRoots  : false,
    sourceMaps    : false,
    presets       : ["@babel/preset-env"],
    plugins       : ["@babel/plugin-transform-modules-commonjs"],
  }).code;
}



//
// 转换 jsx 为 es5 语法
//
function jsx(filename, code) {
  return babel.transform(code, {
    filename      : filename,
    configFile    : false,
    babelrc       : false,
    babelrcRoots  : false,
    sourceMaps    : false,
    presets       : ["@babel/preset-env", "@babel/preset-react"],
    plugins       : ["@babel/plugin-transform-modules-commonjs"],
  }).code;
}


function vue(filename, code) {
  var c = vc.parseComponent(code);
  var r = {};

  if (c.template) {
    r.template = vc.compile(c.template.content).render;
  }

  //TODO: 检测脚本类型 r.script.attrs
  if (c.script) {
    r.script = es5(filename, c.script.content);
  }

  //TODO: 检测样式表类型 r.styles[x].attrs
  if (c.styles) {
    var buf = [];
    c.styles.forEach(function(s) {
      buf.push(s.content, '\n');
    });
    r.style = buf.join('');
  }
  return r;
}


//
// https://github.com/sass/dart-sass/blob/master/README.md#javascript-api
// https://www.sass.hk/guide/
//
function sass(filename, code) {
  var r = sassl.renderSync({
    data: code,
    file: filename,
    importer: function(url, prev) {
      //TODO: contents 用 scss 语法
      return { contents: '.import_test{color:0;}', file: url };
    }
  });
  return r.css.toString('utf8');
}


//
// https://lesscss.org/
//
function less(filename, code) {
  var output;
  lessl.render(code, {
    filename : filename,
  }, function(err, out) {
    if (err) throw err;
    output = out;
  });
  //TODO: 合并导入文件
  //if (output.imports)
  return output.css;
}


//
// 转换 TypeScript 为 es5 语法
//
function ts(filename, code) {}


//
// 转换 TypeScriptX 为 es5 语法
//
function tsx(filename, code) {}