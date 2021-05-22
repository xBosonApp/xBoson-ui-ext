const lib       = require("./index.js");
const log       = require("./log");
const ws        = require("./ws-server.js");
const Protocol  = require("./protocol");
const path      = require('path');
const Nfs       = require("./fs.js");

const wserver = ws.createServer();


wserver.on('connect', function(conn) {
  log.info("New connect from", conn.remoteAddress);
  let pt = new Protocol();

  conn.on('message', function(msg) {
    if (msg.type == 'utf8') {
      log.info('client:', msg.utf8Data);
    }
    else if (msg.type == 'binary') {
      // log.debug('Received Binary Message of', msg.binaryData.length, 'bytes');
      try {
        pt.parse(msg.binaryData);
      } catch(err) {
        log.error('Error', err);
        conn.sendUTF(err.message);
      }
    }
    else {
      log.warn("Unknow message type", msg);
    }
  });

  conn.on('close', function(code, reason) {
    log.info("Client", conn.remoteAddress, 'closed', code, reason);
  });

  processor(pt, conn);
});


function processor(pt, conn) {
  let reqFileDone;

  pt.on('error', sendError);

  pt.on('reqParsedExt', function(msg_id) {
    conn.sendBytes(pt.makeAskExt(msg_id, lib.ext_names));
  });

  pt.on('reqRender', function(msg_id, filename, content, data) {
    let nfs = new Nfs(fileloader, msg_id);
    let ext = path.extname(filename);
    let render = lib.ext_mapping[ext];
    if (!render) {
      sendError(msg_id, 'cannot render '+ filename +' unsupport file type.');
      return;
    }

    render(nfs, render_done, filename, content, data);

    function render_done(err, content) {
      if (err) return sendError(msg_id, err);
      conn.sendBytes(pt.makeAskRender(msg_id, content, lib.mime[ext], nfs.deps));
      log.info(`Render success '${filename}'`);
    }
  });

  pt.on('ansFileContent', function(msg_id, askcontent) {
    if (reqFileDone) {
      reqFileDone(null, askcontent);
    } else {
      log.error("Ask file return not accepted", msg_id);
    }
  });

  function sendError(msgid, err) {
    log.error('Error', msgid, err);
    conn.sendBytes(pt.makeError(msgid, err.message));
  }

  function fileloader(url, msg_id, done) {
    reqFileDone = done;
    conn.sendBytes(pt.makeFileReq(msg_id, url));
  }
}
