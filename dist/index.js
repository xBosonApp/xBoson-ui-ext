//
// 初步测试打包后的文件可执行性
//
//eval(fs.readFileSync('dist/xboson-ui-ext.pack.js', 'utf8'));


var lib = require('./xboson-ui-ext.pack.js');
require("../test.js")(lib);