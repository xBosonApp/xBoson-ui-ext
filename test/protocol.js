const P = require("../lib/protocol");
const t = require("assert");

let a = Buffer.from([2, 0,0,0,0, 0,0,1,0, 3, 0,0,0,4, 0,0,0,4, 0,0,0,2,
  97,98,99,100, // abcd
  49,50,51,52, //1234
  123, 125]); // {}

let p = new P();

p.on('reqRender', function(msg_id, filename, content, data) {
  t.equal(msg_id, 0x0100);
  t.equal(filename, 'abcd');
  t.equal(content, '1234');
  t.deepEqual(data, {});

  console.log('id', msg_id, ', name', filename, ', content', content, ', data', data);
});

p.parse(a);


let sbuf = p.make(0x05, BigInt(0x90), [
  Buffer.from([1, 2, 3, 0xff]),
  Buffer.from([0xee, 5, 6, 7, 7]),
  Buffer.from([0x11, 9,9,8,8]),
]);

t.equal(sbuf.toString('hex'), Buffer.from([
  0x05, 0,0,0,0, 0,0,0,0x90, 3, 0,0,0,0x4, 0,0,0,0x5, 0,0,0,0x5,
  1, 2, 3, 0xff,
  0xee, 5, 6, 7, 7,
  0x11, 9,9,8,8
]).toString('hex'));