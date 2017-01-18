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
        return coll.find({$or: [{completed: {$exists: false}}, {completed: {$eq: false}}]}).toArray();
      })
      .then(function(results){
        ack(results);
      })
    ;
  });
  //get inactive lists
  socket.on('getInactiveLists', function(data, ack){
    data.page--;
    mongo.getCollection('lists')
      .then(function(coll){
        return coll
          .find({completed: {$exists: true, $ne: false}})
          .sort({completed: -1})
          .skip(data.page * data.count)
          .limit(data.count)
          .toArray()
        ;
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
    var newList;
    if (list._id !== undefined) {
      id = mongo.getObjectID(list._id);
      list.created = new Date(list.created);
    } else {
      id = mongo.getObjectID();
      list.created = new Date();
      newList = true;
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
        if(newList === true) {
          socket.broadcast.emit('newList', list);
        }
      })
    ;
  });
  //delete list
  socket.on('deleteList', function(_id, ack){
    mongo.getCollection('lists')
      .then(function(coll){
        return coll.deleteOne({_id: mongo.getObjectID(_id)});
      })
      .then(function(result){
        ack();
        socket.broadcast.emit('deletedList', _id);
      })
    ;

  });

  socket.on('completeList', function(data, ack){
    var completed;
    if(data.allChecked === true){
      completed = new Date();
    } else {
      completed = false;
    }
    mongo.getCollection('lists')
      .then(function(coll){
        return coll.update(
          {_id: mongo.getObjectID(data._id)},
          {$set: {completed: completed}},
          false
        );
      })
      .then(function(){
        ack(completed);
        socket.broadcast.emit('completedList', data._id);
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
