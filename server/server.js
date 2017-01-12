var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongo = require('./mongo');

app.use(express.static('../client'));

app.all('/*', function(req, res, next){
  res.sendFile('/index.html', {root: __dirname+'/../client'});
});


io.on('connection', function(socket){
  //get active lists
  socket.on('getActiveLists', function(data, ack){
    mongo.getCollection('lists')
      .then(function(coll){
        return coll.find({completed: {$exists: false}}).toArray();
      })
      .then(function(results){
        ack(results);
      })
    ;
  });
  //get inactive lists
  socket.on('getInactiveLists', function(data, ack){
    mongo.getCollection('lists')
      .then(function(coll){
        return coll.find({completed: {$exists: true}}).skip(data.page * data.count).limit(data.count).toArray();
      })
      .then(function(results){
        ack(results);
      })
    ;
  });
    //get list
  socket.on('getList', function(data, ack){
    mongo.getCollection('lists')
      .then(function(coll){
        return coll.findOne({_id: mongo.getObjectID(data.id)});
      })
      .then(function(results){
        ack(results);
      })
    ;
  });
  //update list
  socket.on('updateList', function(list, ack){
    console.log(list);
    var id = (list._id !== undefined)?mongo.getObjectID(list._id):mongo.getObjectID();
    delete list._id;
    mongo.getCollection('lists')
      .then(function(coll){
        return coll.update({_id: id}, list, {upsert: true});
      })
      .then(function(resp){
        if (resp.result.hasOwnProperty('upserted')){
          ack(resp.result.upserted[0]._id);
        } else {
          ack();
        }
      })
    ;
  });
  //delete list
  socket.on('deleteList', function(data){});
  //update for list item
  socket.on('updateItem', function(data){});
});

server.listen(8080);
console.log('server started');
