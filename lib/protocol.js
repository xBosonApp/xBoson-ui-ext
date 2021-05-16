const EventEmitter = require('events');


class Protocol extends EventEmitter {

  constructor() {
    super();
  }

  //
  // 解析数据包, 并发送对应的消息, 可以抛出异常
  //
  parse(buf) {
    let fn_num = buf.readUInt8(0);
    let msg_id = buf.readBigUInt64BE(1);
    let pkg_cnt = buf.readUInt8(9);
    let data_offset = 10 + 4*pkg_cnt;
    let pkg_data = [];

    for (let i = 0; i<pkg_cnt; ++i) {
      let len_offset = 10 + 4*i;
      let pkg_len = buf.readUInt32BE(len_offset);
      pkg_data[i] = buf.slice(data_offset, data_offset + pkg_len);
      data_offset += pkg_len;
    }

    this.ask(fn_num, msg_id, pkg_data);
  }

  ask(fn_num, msg_id, pkg_data) {
    switch (fn_num) {
      case 1:
        // 请求可解析文件扩展名列表
        this.emit('reqParsedExt', msg_id);
        break;

      case 2:
        let filename = pkg_data[0].toString('utf8');
        let content = pkg_data[1].toString('utf8');
        let data = JSON.parse(pkg_data[2]);
        // 请求渲染文件
        this.emit('reqRender', msg_id, filename, content, data);
        break;

      case 7:
        let askcontent = pkg_data[0].toString('utf8');
        // 应答文件内容
        this.emit('askFileContent', msg_id, askcontent);
        break;

      default:
        this.emit('error', 'unknow function num '+ fn_num);
        break;
    }
  }

  //
  // 创建数据包, 
  // fn_num - 功能号
  // msg_id - 消息id
  // pkg_data[] - Buffer 数据数组
  //
  make(fn_num, msg_id, pkg_data) {
    let pkg_len = 0;
    pkg_data.forEach(function(b) {
      pkg_len += b.length;
    });
    let data_offset = 10 + 4* pkg_data.length;
    let buf = Buffer.alloc(data_offset + pkg_len);

    buf.writeUInt8(fn_num, 0);
    buf.writeBigUInt64BE(msg_id, 1);
    buf.writeUInt8(pkg_data.length, 9);

    for (let i=0; i<pkg_data.length; ++i) {
      let len_offset = 10 + 4*i;
      buf.writeUInt32BE(pkg_data[i].length, len_offset);
      pkg_data[i].copy(buf, data_offset);
      data_offset += pkg_data[i].length;
    }

    return buf;
  }

  //
  // 创建错误消息数据包
  //
  makeError(msg_id, str) {
    return this.make(4, msg_id, [Buffer.from(str)]);
  }

  //
  // 创建请求文件数据包
  //
  makeFileReq(msg_id, filename) {
    return this.make(6, msg_id, [Buffer.from(filename)]);
  }

  //
  // 创建文件扩展名数据包
  // ext - 扩展名字符串数组
  //
  makeAskExt(msg_id, ext) {
    let str = ext.join(' ');
    return this.make(6, msg_id, [Buffer.from(str)]);
  }

  //
  // 应答渲染文件
  // content - 渲染后的文件内容
  // deps - 依赖文件列表, 字符串数组
  //
  makeAskRender(msg_id, content, mime, deps) {
    let bufs = [Buffer.from(content), Buffer.from(mime)];
    deps.forEach(function(filename) {
      bufs.push(Buffer.from(filename));
    });
    return this.make(3, msg_id, bufs);
  }
}


module.exports = Protocol;