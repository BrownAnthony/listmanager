var client = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var cache;

function getConnection(){
  if (cache !== undefined){
    return Promise.resolve(cache);
  }

  return client.connect(process.env.dburl)
    .then(function(db){
      cache = db;
      return db;
    })
  ;
}
function getCollection(collection){
  return getConnection()
    .then(function(db){
      return db.collection(collection);
    })
  ;
}
function getObjectID(id){
  return new ObjectID(id);
}

module.exports = {
  getConnection: getConnection,
  getCollection: getCollection,
  getObjectID: getObjectID,
};
