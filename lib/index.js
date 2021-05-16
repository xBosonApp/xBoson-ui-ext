/* must first line */ require("./pre-load");
const babel   = require("@babel/core");
const sassc   = require('sass');
const vcc     = require('@vue/component-compiler');
const tsc     = require('typescript');
const pugc    = require('pug');
const path    = require('path');
const stylusc = require('stylus');
const tool    = require("./tool.js");
const stylhlp = require("./stylus.js");

let fs;
let lessc;
let ext_names = [];
let ext_mapping = {
  '.es5'  : es5,
  '.vue'  : vue,
  '.less' : less,
  '.sass' : sass,
  '.jsx'  : jsx,
  '.ts'   : ts,
  '.tsx'  : tsx,
  '.pug'  : pug,
  '.styl' : stylus,
};
let mime = {
  '.es5'  : 'application/javascript',
  '.vue'  : 'application/javascript',
  '.less' : 'text/css',
  '.sass' : 'text/css',
  '.jsx'  : 'application/javascript',
  '.ts'   : 'application/javascript',
  '.tsx'  : 'application/javascript',
  '.pug'  : 'text/html',
  '.styl' : 'text/css',
};

for (let name in ext_mapping) {
  ext_names.push(name);
}

module.exports = {
  init,
  ext_names,
  ext_mapping,
  mime,

  es5,
  jsx,
  ts,
  tsx,
  vue,
  sass,
  less,
  pug,
  stylus,
};


function init(_fs) {
  fs = _fs;
  lessc = require("./less.js").create(fs);
  stylhlp.init(fs);
}


//
// 转换更高版本的 js 为 es5 语法
//
function es5(done, filename, code) {
  try {
    var r = babel.transform(code, {
      filename      : filename,
      configFile    : false,
      babelrc       : false,
      babelrcRoots  : false,
      sourceMaps    : false,
      presets       : ["@babel/preset-env"],
      plugins       : ["@babel/plugin-transform-modules-commonjs"],
    });
    done(null, r.code);
  } catch(err) {
    done(err);
  }
}



//
// 转换 jsx 为 js 语法, React 专用
//
function jsx(done, filename, code) {
  try {
    let r = babel.transform(code, {
      filename      : filename,
      configFile    : false,
      babelrc       : false,
      babelrcRoots  : false,
      sourceMaps    : false,
      presets       : ["@babel/preset-env", "@babel/preset-react"],
      plugins       : ["@babel/plugin-syntax-jsx"],
    });
    done(null, r.code);
  } catch(err) {
    done(err);
  }
}


//
// https://github.com/vuejs/vue-component-compiler
//
function vue(done, filename, code) {
  try {
    let comp = vcc.createDefaultCompiler({
      template : {
        isProduction : true,
      }
    });
    let desc = comp.compileToDescriptor(filename, code);
    let jscode = vcc.assemble(comp, filename, desc).code;
    es5(done, filename, jscode);
  } catch(err) {
    done(err);
  }
}


//
// https://github.com/sass/dart-sass/blob/master/README.md#javascript-api
// https://www.sass.hk/guide/
// TODO: @import 命令工作不正常!
//
function sass(done, filename, code) {
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
function less(done, filename, code) {
  lessc.render(code, {
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
function ts(done, filename, code) {
  __ts(done, filename, code, tsc.JsxEmit.Preserve);
}


//
// 转换 TypeScriptX 为 js 语法, React 专用
//
function tsx(done, filename, code) {
  __ts(done, filename, code, tsc.JsxEmit.React);
}


//
// https://www.pugjs.cn/api/reference.html
// 之前叫 jade
// 
function pug(done, filename, code, data) {
  let tmpl = pugc.compile(code, {
    filename : path.basename(filename),
    basedir : path.dirname(filename),
  });
  done(null, tmpl(data));
}


//
// https://stylus.bootcss.com/docs/js.html
//
function stylus(done, filename, code) {
  stylusc.render(code, { 
    filename,
    Evaluator : stylhlp.DefEval,
  }, done);
}