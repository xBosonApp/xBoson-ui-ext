const lib = require("./index.js");
const tool = require("./tool.js");
const log = require("./log");
const Protocol = require("./protocol");
const WebServer = require('websocket').server;
const http = require('http');
const path = require('path');

const port = 7788;
const http_server = http.createServer(function(request, response) {
  response.writeHead(404);
  response.end();
});

http_server.listen(port, function() {
  log.info('Server is listening on port '+ port);
});

const wserver = new WebServer({
  httpServer : http_server,
  autoAcceptConnections : true,
  disableNagleAlgorithm : false,
  assembleFragments : true,
  maxReceivedMessageSize : tool.sizeMB(20),
});


wserver.on('connect', function(conn) {
  log.info("New connect from", conn.remoteAddress);
  let pt = new Protocol();

  conn.on('message', function(msg) {
    if (message.type != 'binary') {
      log.error("Bad message type, close connect");
      conn.close(conn.CLOSE_REASON_PROTOCOL_ERROR, 'bad data type');
      return;
    }
    log.debug('Received Binary Message of', message.binaryData.length, 'bytes');

    try {
      pt.parse(msg.binaryData);
    } catch(err) {
      sendError(err);
    }
  });

  pt.on('error', sendError);

  pt.on('reqParsedExt', function(msgid) {
    conn.sendBytes(pt.makeAskExt(msg_id, lib.ext_names));
  });

  pt.on('reqRender', function(msg_id, filename, content, data) {
    let deps = [];
    let ext = path.extname(filename);
    let render = lib.ext_mapping[ext];
    if (!render) {
      sendError('cannot render '+ filename +' unsupport file type.');
      return;
    }
    render(render_done, filename, content, data);

    function render_done(err, content) {
      if (err) return sendError(err);
      conn.sendBytes(pt.makeAskRender(msg_id, content, lib.mime[ext], deps));
    }
  });

  function sendError(err) {
    log.error('Error', err.message);
    conn.sendBytes(p.sendError(err.message));
  }
});