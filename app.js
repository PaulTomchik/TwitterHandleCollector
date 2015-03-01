// http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connection-pooling

var express     = require('express'),
    bodyParser  = require("body-parser"),
    MongoClient = require('mongodb').MongoClient;

var MONGO_URL        = "mongodb://localhost:27017/",
    PORT             = 3000,
    DB_NAME          = 'ProjectSocrates',
    COLLECTION_NAME  = 'metadata';

var db;


app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/javascripts'))


MongoClient.connect(MONGO_URL + DB_NAME, function(err, database) {
  if(err) throw err;

  db = database;

  app.listen(PORT);
  console.log("Listening on port " + PORT);
});


app.get("/", function(req, res) {
  res.render('index');
});


app.post("/upsertPoliticianMetadata", function(req, res) {
  res.end(JSON.stringify({ 'message': upsertPoliticanMetadata(req.body) }));
});


function upsertPoliticanMetadata (upsertObject) {
  var returnMessage;

  if(upsertObject && upsertObject['screen_name']) {

    db.collection(COLLECTION_NAME).findAndModify (
      { screen_name: upsertObject['screen_name'] }, 
      {},
      { $set: upsertObject }, 
      { upsert: true },
      function (err, result) { 
        if (err) {
          returnMessage = err.toString();
          console.error(err); 
        } else {
          returnMessage = "\n\tUPSERTED: Result = " + JSON.stringify(result);
        }
      }
    );

  } else {
    returnMessage = "ERROR: Invalid upsert object: " + JSON.stringify(upsertObject);
  }

  return returnMessage;
}
