const http = require('http');
const tool = require("./tool.js");
const log = require("./log");
const WebServer = require('websocket').server;


function createServer() {
  const port = process.env.port || 7788;
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

  return wserver;
}


process.on('uncaughtException', (err, origin) => {
  log.error("Uncaught", origin, err);
});


module.exports = {
  createServer,
}