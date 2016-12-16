var mqtt = require('mqtt');
var winston = require('winston');

// Settings - bad practice but also bad time limitations, move away from here
const broker = {"host" : "oidc.tex.extensionengine.com", "port" : "1883"}
const logRoot = "/tmp/logs/"

var topics = {};
var client = mqtt.connect("mqtt://" + broker.host + ":" + broker.port);

var meta = new (winston.Logger)({
      transports: [ new (winston.transports.File)({ filename: logRoot + "app.metalog", json: false})]
});

client.on('connect', function () {
  client.subscribe('#');
  meta.info("Initiated.");
})

client.on('message', function(topic, message) {
  var topic = String(topic);

  if(Object.keys(topics).indexOf(topic) == -1){
    var path = logRoot + topic + ".log";
    topics[topic] = new (winston.Logger)({
      transports: [ new (winston.transports.File)({ filename: path, json: false})]
    });
  }

  topics[topic].info(String(message));
});

client.on('error', function (err) {
  meta.error(err);
});