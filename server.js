var express        = require('express');  
var bodyParser     = require('body-parser');  
var app            = express();  
var router         = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID; 
var bodyParser = require('body-parser');
var cors = require('cors');
var moment = require('moment');
var config = require('./config');
const multer = require('multer');
const DIR = './uploads';
var emailConfig = require('./emailConfig');
var schedule = require('node-schedule');
var _ = require('lodash');

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
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
      console.log(err);  
        if (err) return
        database.db('complaintRegPortal').collection('locationHierarchy').insertOne(req.body.location, function(err, records) {
            if (err) throw err;
                res.send(
                    (err === null) ? {msg: "success"} : {msg: err}
                );
              });
        })
  }); 
  
  app.route('/insertUser')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
      console.log(err);  
        if (err) return
        database.db('complaintRegPortal').collection('users').insertOne(req.body.user, function(err, records) {
            if (err) throw err;
                res.send(
                    (err === null) ? {msg: "success"} : {msg: err}
                );
              });
        })
  }); 
  

  app.route('/editUser')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/users", { useNewUrlParser: true },function(err, database) {
        if (err) returns
        var editedUser = {$set: { eid: req.body.user.eid, location: req.body.user.location, viewPermissionRoot: req.body.user.viewPermissionRoot}};
        req.body.user._id = new ObjectID.createFromHexString(req.body.user._id.toString());
            database.db('complaintRegPortal').collection('users').updateOne({"_id": req.body.user._id}, editedUser, function (er, result) {
            if (er) throw er;
            res.send(
              (er === null) ? {msg: "success", data:result} : {msg: er}
          );
           database.close();
          });
      })
  });  

  app.route('/deleteUser')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
      console.log(err);  
        if (err) return
          req.body.user._id = new ObjectID.createFromHexString(req.body.user._id.toString());
          database.db('complaintRegPortal').collection("users").deleteOne( {"_id": req.body.user._id}, function(err, obj) {
            if (err) throw err;
           database.close();
           res.send(
            (err === null) ? {msg: "success"} : {msg: err}
        );
          });
      })
  });  


  app.route('/insertProblem')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
      console.log(err);  
        if (err) return
        database.db('complaintRegPortal').collection('problem').insertOne(req.body.problem, function(err, records) {
            if (err) throw err;
                res.send(
                    (err === null) ? {msg: "success"} : {msg: err}
                );
              });
        })
  }); 
  

  app.route('/insertComplaint')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
      console.log(err);  
        if (err) return
        database.db('complaintRegPortal').collection('complaints').insertOne(req.body.complaint, function(err, records) {
            if (err) throw err;
                res.send(
                    (err === null) ? {msg: "success"} : {msg: err}
                );
              });
        })
  }); 
  

  app.route('/editProblem')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
        if (err) return
        var editedProblem = {$set: {  eid : req.body.problem.eid,
          problem :req.body.problem.problem,
          description : req.body.problem.description,
          priority : req.body.problem.priority,
          siteEngineer : req.body.problem.siteEngineer,
          engineerInCharge :req.body.problem.engineerInCharge,
          hod : req.body.problem.hod,
          workOrderNo : req.body.problem.workOrderNo,
          workOrderDetails : req.body.problem.workOrderDetails,
          location : req.body.problem.location}};
        req.body.problem._id = new ObjectID.createFromHexString(req.body.problem._id.toString());
            database.db('complaintRegPortal').collection('problem').updateOne({"_id": req.body.problem._id}, editedProblem, function (er, result) {
            if (er) throw er;
            res.send(
              (er === null) ? {msg: "success", data:result} : {msg: er}
          );
           database.close();
          });
      })
  });  

  app.route('/deleteProblem')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
      console.log(err);  
        if (err) return
          req.body.problem._id = new ObjectID.createFromHexString(req.body.problem._id.toString());
          database.db('complaintRegPortal').collection("problem").deleteOne( {"_id": req.body.problem._id}, function(err, obj) {
            if (err) throw err;
           database.close();
           res.send(
            (err === null) ? {msg: "success"} : {msg: err}
        );
          });
      })
  });  

  app.route('/deleteLocation')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
      console.log(err);  
        if (err) return
          database.db('complaintRegPortal').collection("locationHierarchy").deleteOne( { tag: req.body.location }, function(err, obj) {
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
          database.db('complaintRegPortal').collection("locationHierarchy").updateOne({tag: req.body.location.tag}, editedLocation, function(er, result) {
            if (er) throw er;
            res.send(
              (er === null) ? {msg: "success", data:result} : {msg: err}
          );
           database.close();
          });
      })
  });  

  app.route('/editComplaint')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/editLocation", { useNewUrlParser: true },function(err, database) {
        if (err) return
        var editedComplaint = 
        { $set: { problem: req.body.complaint.problem, 
            description: req.body.complaint.description, 
          officerEmail: req.body.complaint.officerEmail, 
          priority: req.body.complaint.priority, 
          status : req.body.complaint.status,
          history: req.body.complaint.history, 
          remarks : req.body.complaint.remarks,
          _id : new ObjectID.createFromHexString(req.body.complaint._id.toString())}};
          
          console.log(editedComplaint);
          database.db('complaintRegPortal').collection("complaints").updateOne({_id: new ObjectID.createFromHexString(req.body.complaint._id.toString())}, editedComplaint, function(er, result) {
            if (er) throw er;
            console.log(result);
            res.send(
              (er === null) ? {msg: "success", data:result} : {msg: err}
          );
           database.close();
          });
      })
  });  

  app.route('/getLocationHierarchy')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
        if (err) return
          database.db('complaintRegPortal').collection('locationHierarchy').find({}).toArray(function(err, result) {
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

  app.route('/getUserComplaint')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
        if (err) return
          console.log(req.body)
          database.db('complaintRegPortal').collection('complaints').find({eid: req.body.user}).toArray(function(err, result) {
            if (err) throw err;
            var data = JSON.parse(JSON.stringify(result));  
            res.send({"msg" : "success",
              "complaints" : data,
            })
            database.close();
          });
      })
  });  

  app.route('/getLocationComplaint')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
        if (err) return
          console.log(req.body)
          database.db('complaintRegPortal').collection('complaints').find({location: req.body.location}).toArray(function(err, result) {
            if (err) throw err;
            var data = JSON.parse(JSON.stringify(result));  
            res.send({"msg" : "success",
              "complaints" : data,
            })
            database.close();
          });
      })
  });  


  

  app.route('/getLocationUsers')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
        if (err) return
          database.db('complaintRegPortal').collection('users').find({location: req.body.location}).toArray(function(err, result) {
            if (err) throw err;
            var data = JSON.parse(JSON.stringify(result));  
            res.send({"msg" : "success",
              "locationUsers" : data,
            })
            database.close();
          });
      })
  });  

  app.route('/getLocationProblem')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
        if (err) return
          database.db('complaintRegPortal').collection('problem').find({location: req.body.location}).toArray(function(err, result) {
            if (err) throw err;
            var data = JSON.parse(JSON.stringify(result));  
            res.send({"msg" : "success",
              "locationProblem" : data,
            })
            database.close();
          });
      })
  }); 
app.route('/authenticate')  
    .post(function (req, res) {
          MongoClient.connect("mongodb://127.0.0.1:27017/hindiDB",{ useNewUrlParser: true } ,function(er,database){     
              database.db('complaintRegPortal').collection('locationHierarchy').find({}).toArray(function(err, result) {
                console.log(err);
                if (err) throw err;
                database.close();
                ldapAuthenticate(req.body.username,req.body.password, res) 
              });          
          })
   });

  ldapAuthenticate=function(username, password,res){
  if(isNaN(username)){
    console.log("string")
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
      if (err) return
        database.db('complaintRegPortal').collection('locationHierarchy').find({}).toArray(function(er, result) {
        if (err) throw er;
          var locationHierarchy = JSON.parse(JSON.stringify(result));  
          var locationTag = "";
          var loginEnable = locationHierarchy.reduce(function(loginEnable, location){
            if(location.officer === username && location.key === password)
            locationTag = location.tag;
            loginEnable = loginEnable || (location.officer === username && location.key === password);
            return loginEnable
          },false)
          res.send({"msg": loginEnable === true ? "success" : "error",
                    "location" : locationTag,
                    "type":  "admin",
                    "viewPermissionRoot":null,
                  })
        });
    })
  }
  else {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
      if (err) return
        database.db('complaintRegPortal').collection('users')
        .findOne({ eid : username}, function(err, result) {
          if (err) {
            res.send({"msg": "error",
          })
          }
          else {
            config.ad.authenticate("IOC\\" + username, password, function(err, auth) {
              if (auth && !err) {
                    res.send({"msg": "success",
                            "location":result.location,
                            "viewPermissionRoot":result.viewPermissionRoot,
                            "type":  "user"
                    });
                  }
                  else{
                    res.send({"msg": "error",
                  })
                }
              }); 
          }
        });
    })
  }
}
app.use('/', router);



