var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var maxResults = 10;

exports.showLastSearches = function(dbUrl, coll, callback){ //apply the parameters in the main program !!!!
    var dbCollection;
    var objToPrint = [];
    mongoClient.connect(dbUrl, function(err, db) { //connect to database
        if(err){
            console.log('Error connecting to database');
            throw err;
        }
        console.log("connected to the mongoDB !");
        
        dbCollection = db.collection(coll); //set the collection
        var cursor =dbCollection.find({},{"_id":0}).sort({'date':-1});
        
        //limit to 10 answers and deport the functions into a new module !!!!!!
        var iterations = 0;
        cursor.each(function(err, doc) { 
            //assert.equal(err, null);
            iterations += 1;
            if (err){
                console.log('Error reading from database');
                throw err;
            }
            
            if (doc != null) {
                if(iterations < maxResults + 1){ //limit the number of results at maxResults
                    objToPrint.push(doc);
                }
            } else {
                callback(objToPrint);
            }
        });
    });
}






exports.saveRequest = function(dbUrl, stamp, coll, onSaved){
    var dbCollection;
    mongoClient.connect(dbUrl, function(err, db) { //connect to database
        if(err){
            console.log('Error connecting to database');
            throw err;
        }
        console.log("connected to the mongoDB !");
        
        dbCollection = db.collection(coll); //set the collection
        dbCollection.insert(stamp, function(err, result){
            if (err) throw err;
            db.close();
            onSaved();
        });
    });
}