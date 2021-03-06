var mqtt = require('mqtt');
var winston = require('winston');
var mysql = require('mysql');

var settings = require('./settings/index'); 

if(settings.database_enabled) {
  var connection = mysql.createConnection(settings.database);

  connection.connect();
}

var topics = {};
var client = mqtt.connect(settings.broker);

var meta = new (winston.Logger)({
      transports: [ new (winston.transports.File)({ filename: settings.logDir + "app.metalog", json: false})]
});

client.on('connect', function () {
  client.subscribe('#');
  meta.info("Initiated.");
})

client.on('message', function(topic, message) {
  var topic = String(topic);

  if(Object.keys(topics).indexOf(topic) == -1){
    var path = settings.logDir + topic + ".log";
    topics[topic] = new (winston.Logger)({
      transports: [ new (winston.transports.File)({ filename: path, json: false})]
    });
  }

  topics[topic].info(String(message));

  if(settings.database_enabled) logToDatabase(topic, String(message));
});

client.on('error', function (err) {
  meta.error(err);
});

function logToDatabase(topic, message){
  connection.query('INSERT INTO logging (topic, content) VALUES (\"' + 
    connection.escape(topic) + "\",\"" + connection.escape(message) + "\");", 
    function(err) {
    if (err)
      meta.error('Error while performing Database Query. \n ' + err);
  });
}
