var http = require('http');
var fs = require("fs");
var WebSocketServer = require('ws').Server;

var wsPort = 5000;
var masterId;
var listeners = {};

var httpServer = http.createServer().listen(wsPort);
http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html' })
  fs.createReadStream('index.html').pipe(res)
}).listen(42080)

var wss = new WebSocketServer({ server: httpServer });

wss.on('connection', function (ws) {
    var connectionId = ws.upgradeReq.headers['sec-websocket-key'];
    var isMaster = false;

    if (!masterId) {
        masterId = connectionId;
        isMaster = true;
        ws.on('message', function (message) {
            for (var cid in listeners) {
                listeners[cid].send(message, {
                    binary: true
                }, function (err) {
                    if (err) {
                        console.log('Error: ', err);
                    }
                });
            }
        });
        console.log('Speaker connected');
    } else {
        listeners[connectionId] = ws;
        isMaster = false;
        console.log('Listener connected');
    }

    ws.on('close', function () {
       if (isMaster) {
           masterId = null;
           console.log('Speaker disconnected');
       } else {
           delete listeners[connectionId];
           console.log('Listener disconnected');
       }
    });
});

console.log('webgui listening on port: 42080');
console.log('ws listening on port:', wsPort);
