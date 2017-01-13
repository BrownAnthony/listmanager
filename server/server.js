"use strict";
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
    var id;
    if (list._id !== undefined) {
      id = mongo.getObjectID(list._id);
    } else {
      id = mongo.getObjectID();
      list.created = new Date();
    }
    delete list._id;
    list.items.forEach(function(item){
      item._id = mongo.getObjectID(item._id);
    });
    mongo.getCollection('lists')
      .then(function(coll){
        return coll.update({_id: id}, list, {upsert: true});
      })
      .then(function(resp){
        list._id = id;
        ack(list);
      })
    ;
  });
  //delete list
  socket.on('deleteList', function(data, ack){
    mongo.getCollection('lists')
      .then(function(coll){
        return coll.deleteOne({_id: mongo.getObjectID(data)});
      })
      .then(function(result){
        ack();
      })
    ;

  });
  //update for list item
  socket.on('updateItem', function(data){
    mongo.getCollection('lists')
      .then(function(coll){
        return coll.update({
          _id: mongo.getObjectID(data.list_id),
          'items._id': mongo.getObjectID(data.item._id)
        },{
          $set: {'items.$.checked': data.item.checked}
        },
        false);
      })
      .then(function(){
        socket.broadcast.emit('updateItem', data);
      })
    ;
  });
});

server.listen(8080);
console.log('server started');
