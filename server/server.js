var express = require('express');
var app = express();

app.use(express.static('../client'));

app.all('/*', function(req, res, next){
  res.sendFile('/index.html', {root: __dirname+'/../client'});
})
app.listen(8080);
console.log('server started');
