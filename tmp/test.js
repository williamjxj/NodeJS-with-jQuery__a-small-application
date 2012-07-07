/**
 * Created with JetBrains WebStorm.
 * User: william
 * Date: 05/06/12
 * Time: 12:13 PM
 * To change this template use File | Settings | File Templates.
 */

// npm install mongodb
var mongodb = require('mongodb');
var url = require('url');
var log = console.log;

process.env.MONGOHQ_URL="mongodb://pm_admin:pech0nka@flame.mongohq.com:27039/pm_test"

var connectionUri = url.parse(process.env.MONGOHQ_URL);
var dbName = connectionUri.pathname.replace(/^\//, '');

mongodb.Db.connect(process.env.MONGOHQ_URL, function(error, client) {
    if (error) throw error;

    client.collectionNames(function(error, names){
        if(error) throw error;

        // output all collection names
        log("Collections");
        log("===========");
        var lastCollection = null;
        names.forEach(function(colData){
            var colName = colData.name.replace(dbName + ".", '')
            log(colName);
            log(colData.name);
            lastCollection = colName;
        });

        var collection = new mongodb.Collection(client, lastCollection);
        log("\nDocuments in " + lastCollection);
        var documents = collection.find({}, {limit:5});

        // output a count of all documents found
        documents.count(function(error, count){
            log(" " + count + " documents(s) found");
            log("====================");

            // output the first 5 documents
            documents.toArray(function(error, docs) {
                if(error) throw error;

                docs.forEach(function(doc){
                    log(doc);
                });

                // close the connection
                client.close();
            });
        });
    });
});
