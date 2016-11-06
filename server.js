var http = require('http');
var express = require('express');
var mavlink = require('mavlink');

var WebSocketServer = require('ws').Server;

var webServer = http.createServer();
var app = express();

var _ = require('lodash')

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(express.static('public'));

let webSocketServerOptions = {}
if (process.env.REACT_APP_WSS_PORT) {
  console.log(`websocket listening on ${process.env.REACT_APP_WSS_PORT}`);
  webSocketServerOptions.port = process.env.REACT_APP_WSS_PORT
  console.log('turn off CORS');
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
} else {
  console.log(`websocket listening on ${app.get('port')}`);
  webSocketServerOptions.server = webServer
}

var webSocketServer = new WebSocketServer(webSocketServerOptions);

// Broadcast to all.
webSocketServer.broadcast = function (data) {
  webSocketServer.clients.forEach(function each(client) {
    try {
      client.send(data);
    } catch (e) {
      // pass
    }
  });
};

webSocketServer.on('connection', function (socket) {
  console.log('new websocket');
  // socket.send(streamHeader, { binary: true });
});

webServer.on('request', app);

// var myMAV = new mavlink(1,1,"v1.0",["common", "ardupilotmega"]);
var myMAV = new mavlink(1, 1);

const dgram = require('dgram');
const mavSimServer = dgram.createSocket('udp4');
const QGC_UDP_LOCAL_PORT = 14550
const MESSAGES_TO_SEND = ['ATTITUDE']


myMAV.on("ready", function () {
  console.log('mavlink connected')

  mavSimServer.on('error', (err) => {
    console.log(`mavSimServer error:\n${err.stack}`);
    mavSimServer.close();
  });

  mavSimServer.on('message', (msg, rinfo) => {
    // console.log(`mavSimServer got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    myMAV.parse(msg);
  });

  mavSimServer.on('listening', () => {
    var address = mavSimServer.address();
    console.log(`mavSimServer listening ${address.address}:${address.port}`);
  });

  webServer.listen(app.get('port'), () => {
    console.log(`webServer at http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
  });

  // var messagesToThrottle = ["ATTITUDE"]
  MESSAGES_TO_SEND.forEach((messageName) => {
    myMAV.on(messageName, function (message, fields) {
      webSocketServer.broadcast(JSON.stringify({
        type: messageName,
        data: fields
      }))
    })
  })

  mavSimServer.bind(QGC_UDP_LOCAL_PORT);
});
