/*
import * as fs from 'fs'
import * as path from 'path'
import * as j5 from 'json5'

console.log(fs.readFileSync);
console.log(path.join);
console.log(j5);
*/

const a = 10;
let b = [1,2,3];
// es5 无法识别的正则表达式
// let c = /([a-z0-9_-]+)="?([a-z0-9=\/\.@\s-\+)()]+)"?/gi;
let m = {
  a() {console.log('m.a')}
};

b.forEach((x)=>{
  console.log(x);
});
console.log(`a=${a}`);
console.log(m.a());

export default b;