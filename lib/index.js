const babel   = require("@babel/core");
const benv    = require("@babel/preset-env");
const bcjs    = require("@babel/plugin-transform-modules-commonjs");
const bjsx    = require("@babel/plugin-syntax-jsx");
const brct    = require("@babel/preset-react");
const sassc   = require('sass');
const vcc     = require('@vue/component-compiler');
const tsc     = require('typescript');
const pugc    = require('pug');
const path    = require('path');
const stylusc = require('stylus');
const tool    = require("./tool.js");
const stylhlp = require("./stylus.js");
const lessc   = require("./less.js");

let ext_names = [];
let ext_mapping = {
  '.es5'  : es5,
  '.vue'  : vue,
  '.jsx'  : jsx,
  '.ts'   : ts,
  '.tsx'  : tsx,
  '.pug'  : pug,
  '.styl' : stylus,
  '.less' : less,
  '.sass' : sass,
};
let mime = {
  '.es5'  : 'application/javascript',
  '.vue'  : 'application/javascript',
  '.jsx'  : 'application/javascript',
  '.ts'   : 'application/javascript',
  '.tsx'  : 'application/javascript',
  '.pug'  : 'text/html',
  '.styl' : 'text/css',
  '.less' : 'text/css',
  '.sass' : 'text/css',
};

for (let name in ext_mapping) {
  ext_names.push(name);
}


module.exports = {
  ext_names,
  ext_mapping,
  mime,

  es5,
  vue,
  jsx,
  ts,
  tsx,
  pug,
  stylus,
  sass,
  less,
};

//
// 转换更高版本的 js 为 es5 语法
//
function es5(fs, done, filename, code) {
  try {
    var r = babel.transform(code, {
      filename      : filename,
      configFile    : false,
      babelrc       : false,
      babelrcRoots  : false,
      sourceMaps    : false,
      presets       : [benv],
      plugins       : [bcjs],
      cwd           : '/',
      highlightCode : false,
      minified      : false,
    });
    done(null, r.code);
  } catch(err) {
    done(err);
  }
}



//
// 转换 jsx 为 js 语法, React 专用
//
function jsx(fs, done, filename, code) {
  try {
    let r = babel.transform(code, {
      filename      : filename,
      configFile    : false,
      babelrc       : false,
      babelrcRoots  : false,
      sourceMaps    : false,
      presets       : [benv, brct],
      plugins       : [bjsx],
      cwd           : '/',
      highlightCode : false,
      minified      : false,
    });
    done(null, r.code);
  } catch(err) {
    done(err);
  }
}


//
// https://github.com/vuejs/vue-component-compiler
//
function vue(fs, done, filename, code, data) {
  try {      
    const vueCompiler = vcc.createDefaultCompiler({
      template : {
        isProduction : true,
      }
    });

    const assOpt = {
      // 必须是 false, 否则浏览器报错
      isWebComponent : false,
    };

    let desc = vueCompiler.compileToDescriptor(filename, code);
    let asse = vcc.assemble(vueCompiler, filename, desc, assOpt);
    if (data['es6']) {
      done(null, asse.code);
    } else {
      es5(fs, done, filename, asse.code);
    }
  } catch(err) {
    done(err);
  }
}


//
// https://github.com/sass/dart-sass/blob/master/README.md#javascript-api
// https://www.sass.hk/guide/
// TODO: @import 命令工作不正常!
//
function sass(fs, done, filename, code) {
  sassc.render({
    data: code,
    file: filename,
    importer: function(url, prev, idone) {
      // contents 用 scss/sass 语法
      try {
        fs.load(url, function(err, contents) {
          if (err) return idone(err);
          idone({ contents });
        });
      } catch(err) {
        idone(err);
      }
    }
  }, function(err, res) {
    if (err) {
      return done(err);
    } else {
      done(null, res.css.toString('utf8'));
    }
  });
}


//
// https://lesscss.org/
//
function less(fs, done, filename, code) {
  lessc.create(fs).render(code, {
    filename : filename,
    async : true,
  }, function(err, out) {
    if (err) return done(err);
    done(null, out.css);
  });
}


function __ts(done, filename, code, jsx) {
  try {
    let r = tsc.transpileModule(code, 
      { 
        fileName : filename,
        moduleName : filename,
        compilerOptions: { 
          module: tsc.ModuleKind.CommonJS,
          jsx: jsx,
        },
        reportDiagnostics : true,
      });
    
    if (r.diagnostics.length) {
      return done(tool.make_ts_err(r.diagnostics[0], code, filename));
    }

    done(null, r.outputText);
  } catch(err) {
    done(err);
  }
}


//
// 转换 TypeScript 为 js 语法
//
function ts(fs, done, filename, code) {
  __ts(done, filename, code, tsc.JsxEmit.Preserve);
}


//
// 转换 TypeScriptX 为 js 语法, React 专用
//
function tsx(fs, done, filename, code) {
  __ts(done, filename, code, tsc.JsxEmit.React);
}


//
// https://www.pugjs.cn/api/reference.html
// 之前叫 jade
// 
function pug(fs, done, filename, code, data) {
  let tmpl = pugc.compile(code, {
    filename : path.basename(filename),
    basedir : '/tmp/',
    compileDebug : false,
  });
  done(null, tmpl(data));
}


//
// https://stylus.bootcss.com/docs/js.html
//
function stylus(fs, done, filename, code) {
  stylusc.render(code, { 
    filename,
    Evaluator : stylhlp.DefEval,
  }, done);
}