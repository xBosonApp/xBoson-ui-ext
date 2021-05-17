const fs = require("fs");
const path = require("path");
const Nfs = require('./lib/fs.js');

var base = './test';
var dirs = fs.readdirSync(base);

const FILE_PROTOCOL = "file://";

if (!module.parent) {
  test(require('./lib/index.js'));
}


function test(lib) {
  var emuData = {
    name : 'test xboson'
  };

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
    
    const fn = lib.ext_mapping[ext];
    if (fn) {
      const nfs = new Nfs(fileloader);
      fn(nfs, done, full, code, emuData)

      function done(err, code) {
        console.log('\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\t', full);
        if (err) {
          console.error(err.stack);
        } else {
          console.log(code);
          console.log(">> depend:", nfs.deps);
        }
      }
    } else {
      console.log("Unknow file type");
    }
  }
}

  
function fileloader(url, x, done) {
  try {
    let rpath = path.join('./test/', path.normalize(url));
    let content = fs.readFileSync(rpath, {encoding: 'utf8'});
    done(null, content);
  } catch(err) {
    done(err);
  }
}


module.exports = test;