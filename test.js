const fs = require("fs");
const path = require("path");

var base = './test';
var dirs = fs.readdirSync(base);

const FILE_PROTOCOL = "file://";

if (!module.parent) {
  test(require('./index.js'));
}

function test(lib) {    
  var mapping = {
    '.js' : lib.es5,
    '.vue': lib.vue,
    '.less': lib.less,
    '.sass': lib.sass,
    '.jsx': lib.jsx,
    '.ts': lib.ts,
    '.tsx': lib.tsx,
    '.pug': lib.pug,
    '.styl': lib.stylus,
  };

  var fs_gasket = {
    // url 或者本地路径
    load(url) {
      if (url.startsWith(FILE_PROTOCOL)) {
        url = url.substr(FILE_PROTOCOL.length);
      }
      let rpath = path.join('./test/', path.normalize(url));
      return fs.readFileSync(rpath, {encoding: 'utf8'});
    }
  };

  var emuData = {
    name : 'test xboson'
  };

  lib.init(fs_gasket);

  if (process.argv[2]) {
    depfile(process.argv[2]);
  } else {
    dirs.forEach(depfile);
  }


  function depfile(filename) {
    const full = path.join(base, filename);
    if (fs.statSync(full).isDirectory()) return;

    const ext = path.extname(filename);
    const code = fs.readFileSync(full, {encoding: 'utf8'});
    
    const fn = mapping[ext];
    if (fn) {
      function done(err, code) {
        console.log('\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\t', full);
        if (err) {
          console.error(err.stack);
        } else {
          console.log(code);
        }
      }
      fn(done, full, code, emuData)
    } else {
      console.log("Unknow file type");
    }
  }
}

module.exports = test;