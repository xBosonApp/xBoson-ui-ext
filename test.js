const lib = require('./index.js');
const fs = require("fs");
const path = require("path");

var base = './test';
var dirs = fs.readdirSync(base);

var mapping = {
  '.js' : lib.es5,
  '.vue': lib.vue,
  '.less': lib.less,
  '.sass': lib.sass,
};

if (process.argv[2]) {
  depfile(process.argv[2]);
} else {
  dirs.forEach(depfile);
}


function depfile(filename) {
  const full = path.join(base, filename);
  console.log('\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\t', full);
  const ext = path.extname(filename);
  const code = fs.readFileSync(full, {encoding: 'utf8'});
  
  const fn = mapping[ext];
  if (fn) {
    console.log(fn(full, code));
  } else {
    console.log("Unknow file type");
  }
}


console.log('\n<over>');