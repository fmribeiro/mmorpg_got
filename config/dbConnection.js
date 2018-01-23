/**
 * Importar o Mongo DB
 */
var MongoClient = require("mongodb");

var connMongoDb = function() {
  console.log("Entrou na funcao de conexao do MongoDB");
  var db = new MongoClient.Db(
    "got",
    new MongoClient.Server("localhost", 27017, {}),
    {}
  );
  return db;
}; 


module.exports = function() {
  return connMongoDb;
};
