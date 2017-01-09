var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('../client'));

app.all('/*', function(req, res, next){
  res.sendFile('/index.html', {root: __dirname+'/../client'});
});


io.on('connection', function(socket){
  //get active lists
  socket.on('getActiveLists', function(data, ack){
    ack([
      {id: 1, store:"Walmart", title:"list name", created:new Date()},
      {id: 2, store:"Target", title:"list name", created:new Date()}
    ]);
  });
  //get inactive lists
  socket.on('getInactiveLists', function(data, ack){
    ack([
      {id: 1, store:"Jcpenny", title:"list name", completed:new Date()},
      {id: 2, store:"Kohls", title:"list name", completed:new Date()}
    ]);
    console.log(data);
  });
    //get list
  socket.on('getList', function(data, ack){
    console.log(data.id);
    ack({
      id: 1,
      store:"Walmart",
      title:"list name",
      created:new Date(),
      items:[
        {value:"Butter"},
        {value:"Peanuts"}
      ]
    });
  });
  //new list
  socket.on('newList', function(data){});
  //update list
  socket.on('updateList', function(data){});
  //delete list
  socket.on('deleteList', function(data){});
  //update item
  socket.on('updateItem', function(data){});
});

server.listen(8080);
console.log('server started');
