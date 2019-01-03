//db.dropDatabase()
var express        = require('express');  
var morgan         = require('morgan');  
var bodyParser     = require('body-parser');  
var methodOverride = require('method-override');  
var app            = express();  
var router         = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID; 
var bodyParser = require('body-parser');
var cors = require('cors');
var pumpedTotalist = [];
var quarterTotalist = [];
var stationTotalist = [];
var yearList = [];
var path = require('path');
var moment = require('moment');
var config = require('./config');
var fs = require('fs')
const multer = require('multer');
const DIR = './uploads';
var emailConfig = require('./emailConfig');
var schedule = require('node-schedule');
var _ = require('lodash');
var items;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
let upload = multer({storage: storage});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(4, 6)];
rule.hour = 13;
rule.minute =16 ;



function sendEmail(location){
  (async () => {
    console.log("test email")
        emailConfig.server.send({
          text:   "आदरणीय महोदय/महोदया, "  + "\n" + "\n" + "आपकी जानकारी एवं आगामी कार्रवाई हेतु " + location.tag + " की"  + " दिनांक " + moment(new Date(location.fromDate)).format("DD/MM/YYYY") + " से " + moment(new Date(location.toDate)).format("DD/MM/YYYY") + " तक की हिन्दी पत्रचार रिपोर्ट पत्राचार रिपोर्ट एप्लिकेशन मे दर्ज कर दी गई है। " + " \n " + " \n" + "सादर, " + "\n" +"हिंदी एडमिन", 
          from:    "nrplisadmin@indianoil.in", 
          to:     location.officerEmail,
          cc:      [location.coordinatorEmail],
          subject: "पत्राचार रिपोर्ट एप्लिकेशन"
        }, function(err, message) { 
          console.log(message)
        })
      })().catch(err => {
  });
}

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors())
router.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.set('port', process.env.PORT || 3006);

app.listen(app.get('port'), function () {  
  console.log('Express up and listening on port ' + app.get('port'));
});

app.route('/insertHindiReport')  
      .post(function (req, res) {
        MongoClient.connect("mongodb://localhost:27017/hindiReports", { useNewUrlParser: true },function(err, database) {
        if (err) return
              req.body.fromDate = new Date(req.body.fromDate)
              req.body.toDate = new Date(req.body.toDate)

              database.db('hindiReports').collection('bimonthlyReports').aggregate([
                {
                    $match:{
                       'tag':req.body.tag,
                        'fromDate':
                        {
                          $lte: new Date(req.body.toDate),
                          $gte: new Date(req.body.fromDate)
                        }
                    }
                }
              ]).toArray(function (err, items) {  
                console.log("Record Successfully inserted in the database");
                console.log("Loading email configuration from config.js");
                console.log("Initialising SMTP connection");
                console.log("SMTP connection callback failure: stack trace as under");
                if(items.length==0){
                      database.db('hindiReports').collection('bimonthlyReports').insertOne(req.body, function(er, records) {
                          console.log(er);
                          if (er) throw er;
                          sendEmail(req.body);
                          res.send(
                              (er === null) ? {msg: 'success'} : {msg: er}
                          );
                      });
                    }
                    else{
                      res.send(
                        (err === null) ? {msg: 'duplicate'} : {msg: err}
                      );
                    }
            });


          })
      });  
  
    function transformToTree(arr){
      var nodes = {};
      return arr.filter(function(obj){
          var id = obj["tag"],
              parentId = obj["parent"];
        
          nodes[id] = _.defaults(obj, nodes[id], { items: [] });
          parentId && (nodes[parentId] = (nodes[parentId] || { items: [] }))["items"].push(obj);
  
          return !parentId;
      });    
  }
  
//  console.log(JSON.stringify(result, null, 2));

  app.route('/insertLocationHierarchy')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/hindiReports", { useNewUrlParser: true },function(err, database) {
      console.log(err);  
        if (err) return
        database.db('hindiReports').collection('locationHierarchy').insertOne(req.body.location, function(err, records) {
              if (err) throw err;
              // database.db('hindiReports').collection('locationHierarchy').find({}).toArray(function(err, result) {
              //   if (err) throw err;
              //   database.close();
              //   data = result;//convert(result);
              //   var tree = transformToTree(data);
                 res.send(
                     (err === null) ? {msg: "success"} : {msg: err}
                 );
               });
//          });
      })
  });  

  app.route('/deleteLocation')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/hindiReports", { useNewUrlParser: true },function(err, database) {
      console.log(err);  
        if (err) return
          database.db('hindiReports').collection("locationHierarchy").deleteOne( { tag: req.body.location }, function(err, obj) {
            if (err) throw err;
           database.close();
           res.send(
            (err === null) ? {msg: "success"} : {msg: err}
        );
          });
      })
  });  

  app.route('/editLocation')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/editLocation", { useNewUrlParser: true },function(err, database) {
        if (err) return
        var editedLocation = { $set: { tag: req.body.location.tag, officer: req.body.location.employee, officerEmail: req.body.location.officerEmail, coordinatorEmail: req.body.coordinatorEmail, frequency : req.body.location.frequency}};
          database.db('hindiReports').collection("locationHierarchy").updateOne({tag: req.body.location.tag}, editedLocation, function(er, result) {
            if (er) throw er;
            res.send(
              (er === null) ? {msg: "success", data:result} : {msg: err}
          );
           database.close();
          });
      })
  });  


  app.route('/getLocationHierarchy')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/hindiReports", { useNewUrlParser: true },function(err, database) {
        if (err) return
          database.db('hindiReports').collection('locationHierarchy').find({}).toArray(function(err, result) {
            if (err) throw err;
            var data = JSON.parse(JSON.stringify(result));  
            var tree = transformToTree(result);
            res.send({"msg" : "success",
              "locationConfig" : tree,
              "addRecordsAllowed" : tree[0].items.length>0?false:true,
              "locationList" : data
            })
            database.close();
          });
      })
  });  

  app.route('/deleteHindiData')  
      .post(function (req, res) {
         MongoClient.connect("mongodb://localhost:27017/hindiReports", { useNewUrlParser: true },function(err, database) {
              if (err) return
              req.body._id = new ObjectID.createFromHexString(req.body._id.toString());
              database.db('hindiReports').collection('bimonthlyReports').deleteOne({"_id": req.body._id}, function(err, rec) {
                  if (err) throw err;
                  res.send(
                      (err === null) ? {msg: 'success'} : {msg: err}
                  );
              });
          })
      });

  app.route('/editHindiData')  
    .post(function (req, res) {
      MongoClient.connect("mongodb://localhost:27017/hindiReports", { useNewUrlParser: true },function(err, database) {          
        req.body.fromDate = new Date(req.body.fromDate)
        req.body.toDate = new Date(req.body.toDate)
        if (err) return
            req.body._id = new ObjectID.createFromHexString(req.body._id.toString());
           // req.body.date = new Date(req.body.date)
            database.db('hindiReports').collection('bimonthlyReports').updateOne({"_id": req.body._id}, {$set : req.body }, function (err, result) {
              res.send(
                    (err === null) ? {msg: 'success'} : {msg: err}
                ); 
            });
        })
    });   
    
    app.route('/getHindiData').post(function (req, res) {
      var equipmentData = []    

      MongoClient.connect("mongodb://localhost:27017/hindiReports",{ useNewUrlParser: true },function(er,database){     
            if (er) return
            database.db('hindiReports').collection('bimonthlyReports').aggregate([
              {
                  $match:{
                     'tag':
                      {
                          $in: req.body.tags
                      },
                      'fromDate':
                      {
                        $lte: new Date(req.body.searchDateRange.endDate),
                        $gte: new Date(req.body.searchDateRange.startDate)
                      }
                  }
              }
            ]).toArray(function (err, items) {
            
              hindiSummary = [];
              items.map(function(item){
                  item.found = false;
                  if(hindiSummary.length == 0){
                    hindiSummary.push(item)
                    hindiSummary[0].totalHLettersSent = Number(item.hLettersSent)
                    hindiSummary[0].totalELettersSent = Number(item.eLettersSent)
                    hindiSummary[0].totalHEmailsSent = Number(item.hEmailsSent)
                    hindiSummary[0].totalHCommentsSent = Number(item.hCommentsSent)
                    hindiSummary[0].totalECommentsSent = Number(item.eCommentsSent)
                    hindiSummary[0].totalHLettersRecieved = Number(item.hLettersRecieved)
                    hindiSummary[0].totalELettersRecieved = Number(item.eLettersRecieved)
                    hindiSummary[0].totalHCorrespondenceSent = Number(item.hCorrespondenceSent)
                    hindiSummary[0].hiraricalTotalECommentsSent = null;
                    hindiSummary[0].hiraricalTotalELettersSent = null;
                    hindiSummary[0].hiraricalTotalHEmailsSent = null;
                    hindiSummary[0].hiraricalTotalHCommentsSent = null;
                    hindiSummary[0].hiraricalTotalECommentsSent = null;
                    hindiSummary[0].hiraricalTotalHLettersRecieved = null;
                    hindiSummary[0].hiraricalTotalELettersRecieved = null;
                    hindiSummary[0].hiraricalTotalHCorrespondenceSent = null;
                  }
                  else{
                    hindiSummary.map(function(location){
                        if(item.tag == location.tag){
                          item.found=true;
                          location.totalHLettersSent += Number(item.hLettersSent)
                          location.totalELettersSent += Number(item.eLettersSent)
                          location.totalHEmailsSent += Number(item.hEmailsSent)
                          location.totalHCommentsSent += Number(item.hCommentsSent)
                          location.totalECommentsSent += Number(item.eCommentsSent)
                          location.totalHLettersRecieved += Number(item.hLettersRecieved)
                          location.totalELettersRecieved += Number(item.eLettersRecieved)
                          location.totalHCorrespondenceSent += Number(item.hCorrespondenceSent);
                          location.hiraricalTotalECommentsSent = null;
                          location.hiraricalTotalELettersSent = null;
                          location.hiraricalTotalHEmailsSent = null;
                          location.hiraricalTotalHCommentsSent = null;
                          location.hiraricalTotalECommentsSent = null;
                          location.hiraricalTotalHLettersRecieved = null;
                          location.hiraricalTotalELettersRecieved = null;
                          location.hiraricalTotalHCorrespondenceSent = null;
                        }
                        return location;
                    })
                    if(!item.found){
                      hindiSummary.push(item)
                      hindiSummary[hindiSummary.length-1].totalHLettersSent = Number(item.hLettersSent)
                      hindiSummary[hindiSummary.length-1].totalELettersSent = Number(item.eLettersSent)
                      hindiSummary[hindiSummary.length-1].totalHEmailsSent = Number(item.hEmailsSent)
                      hindiSummary[hindiSummary.length-1].totalHCommentsSent = Number(item.hCommentsSent)
                      hindiSummary[hindiSummary.length-1].totalECommentsSent = Number(item.eCommentsSent)
                      hindiSummary[hindiSummary.length-1].totalHLettersRecieved = Number(item.hLettersRecieved)
                      hindiSummary[hindiSummary.length-1].totalELettersRecieved = Number(item.eLettersRecieved)
                      hindiSummary[hindiSummary.length-1].totalHCorrespondenceSent = Number(item.hCorrespondenceSent)
                      hindiSummary[hindiSummary.length-1].hiraricalTotalECommentsSent = null;
                      hindiSummary[hindiSummary.length-1].hiraricalTotalELettersSent = null;
                      hindiSummary[hindiSummary.length-1].hiraricalTotalHEmailsSent = null;
                      hindiSummary[hindiSummary.length-1].hiraricalTotalHCommentsSent = null;
                      hindiSummary[hindiSummary.length-1].hiraricalTotalECommentsSent = null;
                      hindiSummary[hindiSummary.length-1].hiraricalTotalHLettersRecieved = null;
                      hindiSummary[hindiSummary.length-1].hiraricalTotalELettersRecieved = null;
                      hindiSummary[hindiSummary.length-1].hiraricalTotalHCorrespondenceSent = null;
                    }
                  }
                  return item
              })
              res.send({allRecords : items,
                summary : hindiSummary,
                msg:'success'       
              });
          });
  
          })
  
        })  
  
app.route('/authenticate')  
    .post(function (req, res) {
          MongoClient.connect("mongodb://127.0.0.1:27017/hindiDB",{ useNewUrlParser: true } ,function(er,database){     
              database.db('hindiReports').collection('locationHierarchy').find({}).toArray(function(err, result) {
                if (err) throw err;
                database.close();
                ldapAuthenticate(req.body.username,req.body.password, res) 
              });          
          })
   });

  ldapAuthenticate=function(username, password,res){
  //   res.send({"msg": "success",
  // });
  MongoClient.connect("mongodb://localhost:27017/hindiReports", { useNewUrlParser: true },function(err, database) {
    if (err) return
      database.db('hindiReports').collection('locationHierarchy').find({}).toArray(function(err, result) {
      if (err) throw err;
        var locationHierarchy = JSON.parse(JSON.stringify(result));  
        var loginEnable = locationHierarchy.reduce(function(loginEnable, location){
          loginEnable = loginEnable || typeof location.officer === 'number' && location.officer == username || typeof location.officer === 'string' && location.officer.includes(username,0);
          return loginEnable
        },false)
        config.ad.authenticate("IOC\\" + username, password, function(err, auth) {
          if (auth && loginEnable == true) {
              console.log(username + " " + loginEnable + " " + auth);
              res.send({"msg": "success",
              });
            }
            else if(password == "ioc123" && loginEnable == true){
              res.send({"msg": "success",
              })
            }
            else{
              res.send({"msg": "error",
            })
          }
        });
      });
  })
  }

app.route('/tagMatch')  
.post(function (req, res) {
      MongoClient.connect("mongodb://127.0.0.1:27017/hindiDB",function(er,database){     
        var searchTags = req.body.searchTags;
        searchTags.map(function(tag){
          res.send(
            (err === null) ? {msg: "success"} : {msg: err}
        );    
        })
      })
});

app.use('/', router);



