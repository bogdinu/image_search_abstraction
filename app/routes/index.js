var dbaccess = require("../modules/dbaccess.js")
//var mongodb = require("mongodb");
//var mongoClient = mongodb.MongoClient;

var mongoUrl = 'mongodb://localhost/search';//url to database
var mongoCollection = 'searchStamps';       //collection to use

var Bing = require('node-bing-api')({ accKey: "9f9zADgENk0T2TTebIo/c1Crj1X+14TtFfaXvntmw00" });

module.exports = function (app) {

    var output = [];
    var obj = {};
    var i;
	var offs = 0;
	var searchStamp = {};
	
	app.route('/api/imagesearch/:searchStr').get(function(req, res){ 
	    offs = parseInt(req.query.offset);
	        
	    //create the search object to store in the database
	    searchStamp = {};
	    searchStamp.text = req.params.searchStr;
	    searchStamp.date = new Date();
	       
	    Bing.images(req.params.searchStr, {top: 10, skip: offs}, function(error, result, body){
            console.log(body);
            output=[];
            for (i=0; i<body.d.results.length; i+=1){
                obj = {};
                obj.url = body.d.results[i].MediaUrl;
                obj.snippet = body.d.results[i].Title;
                obj.thumbnail = body.d.results[i].Thumbnail.MediaUrl;
                obj.context = body.d.results[i].SourceUrl;
                output.push(obj);
            }
                
            //before sending the answer, save the request in the database
            dbaccess.saveRequest(mongoUrl, searchStamp, mongoCollection, function(){
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(output)); 
            });
                
        });
	});
	
	
	
	app.route('/api/latest/imagesearch/').get(function(req, res){
        dbaccess.showLastSearches(mongoUrl, mongoCollection, function(data){
            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(data)); 
        });
    });
};






/*function saveRequest(dbUrl, stamp, coll, onSaved){
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


    
function showLastSearches(dbUrl, coll, callback){ //apply the parameters in the main program !!!!
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
        cursor.each(function(err, doc) { 
            //assert.equal(err, null);
            if (err){
                console.log('Error reading from database');
                throw err;
            }
            
            if (doc != null) {
                objToPrint.push(doc);
            } else {
                callback(objToPrint);
            }
        });
    });
}*/
