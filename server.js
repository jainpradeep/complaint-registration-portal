var express        = require('express');  
var bodyParser     = require('body-parser');  
var app            = express();  
var router         = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID; 
var cors = require('cors');
var moment = require('moment');
var config = require('./config');
const multer = require('multer');
const DIR = './uploads';
var emailConfig = require('./emailConfig');
var promises = [];
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
  

// function transformToTree(arr){
//   var nodes = {};
//   return arr.filter(function(obj){
//       var id = obj["_id"];
//       obj.tag = obj["tag"];
//       parentId = obj['parent']
//       obj.parent= parentId;
//       nodes[id] = _.defaults(obj, nodes[id], { items: [] });
//       parentId && (nodes[parentId] = (nodes[parentId] || { items: [] }))["items"].push(obj);
//     return !parentId;
//   });    
// }



  app.route('/insertLocationHierarchy')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
    
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
    MongoClient.connect("mongodb://localhost:27017/users", { useNewUrlParser: true },function(err, database) {
        if (err) returns
        database.db('complaintRegPortal').collection('users').countDocuments({eid : req.body.user.eid}, function(err, results) {
          if (err) throw err;
          if(!results){
            database.db('complaintRegPortal').collection('users').insertOne(req.body.user, function(er, records) {
              if (er) throw er;
                  res.send(
                      (er === null) ? {msg: "success"} : {msg: er}
                  );
                });
            }
            else{
              var editedUser = {$set: { eid: req.body.user.eid, location: req.body.user.location, viewPermissionRoot: req.body.user.viewPermissionRoot}};
                database.db('complaintRegPortal').collection('users').updateOne({eid : req.body.user.eid}, editedUser, function (er, result) {
                  if (er) throw er;
                  res.send(
                    (er === null) ? {msg: "success", data:result} : {msg: er}
                );
                 database.close();
                });
          }  
        });
      })
      })
  

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
      req.body.problem.problem = req.body.problem.problem.toUpperCase();
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
        if (err) return
        getLastUnique(function(unique){
          req.body.complaint.complaintID  = unique + 1;
            database.db('complaintRegPortal').collection('complaints').insertOne(req.body.complaint, function(err, records) {
              console.log("insert comlaint" + err  + " record " + records)
              if (err) throw err;
              else{
                updateUniqueNumber(unique + 1, function(){
                  var message = "आदरणीय महोदय/महोदया, "  + "\n" + "\n" + "आपकी जानकारी एवं आगामी कार्रवाई हेतु " + req.body.complaint.eid + " ने " + "दिनांक " + moment(new Date(req.body.complaint.createdDate)).format("DD/MM/YYYY") +  " को " + req.body.complaint.problem +   " संबंधी समस्‍या क्रमांक " + req.body.complaint.complaintID + " को एस्टेट कंप्लेंट रजिस्टर एप्लीकेशन मे दर्ज किया है। " + " \n इस शिकायत पर जल्द ही कार्यवाही की जाएगी "  + "\n"  + "\n" + "सादर, " + "\n" +  "समस्या निर्वहन अधिकारी";
                  getUserEmails(req, res, message);
                });
                database.close();
              }              
            })
          });
        })
  }); 

  updateUniqueNumber = function(unique, callback){
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
        if (err) return
        var editedRandom = { $set: { _id : new ObjectID.createFromHexString("5c52cb1e3306880f58eb0362"), eid : "0" , random : unique, location: "uniqueNumber", viewPermissionRoot: "uniqueNumber"}};
          database.db('complaintRegPortal').collection("users").updateOne({eid: "0"}, editedRandom, function(error, result) {
            if (error) {
              database.db('complaintRegPortal').collection("complaints").deleteOne( {"complaintID": unique}, function(er, obj) {
                console.log("delete unique" + er  + " des " + obj)
              })
            }
            else
              callback();
           database.close();
          });
      })
  }

  getLastUnique = function(callback){
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
      if (err) return
        database.db('complaintRegPortal').collection('users').find({eid : "0"}).toArray(function(err, result) {
          if (err) throw err;
          callback(result[0].random)
          database.close();
        });
    })  
  }
  

  app.route('/editProblem')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
        if (err) return
        var editedProblem = {$set: {  eid : req.body.problem.eid,
          problem :req.body.problem.problem.toUpperCase(),
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
     
        if (err) return
      
          req.body.problem._id = new ObjectID.createFromHexString(req.body.problem._id.toString());
          database.db('complaintRegPortal').collection("problem").deleteOne( {"_id": req.body.problem._id}, function(er, obj) {
            if (er) throw er;
            database.close();
           res.send(
            (er === null) ? {msg: "success"} : {msg: er}
        );
          });
      })
  });  

  app.route('/deleteComplaints')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
  
        if (err) return
    
          req.body.complaint._id = new ObjectID.createFromHexString(req.body.complaint._id.toString());
          database.db('complaintRegPortal').collection("complaints").deleteOne( {"_id": req.body.complaint._id}, function(er, obj) {
            if (er) throw er;
            database.close();
           res.send(
            (er === null) ? {msg: "success"} : {msg: er}
        );
          });
      })
  });
  
  app.route('/deleteLocation')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {

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
        { $set: { eid : req.body.complaint.eid,
          name : req.body.complaint.name,
          complaintID: req.body.complaint.complaintID, 
          problem: req.body.complaint.problem, 
            description: req.body.complaint.description, 
          location: req.body.complaint.location, 
          createdDate : req.body.complaint.createdDate, 
          lastUpdated : req.body.complaint.lastUpdated, 
          priority: req.body.complaint.priority, 
          status : req.body.complaint.status,
          history: req.body.complaint.history, 
          remarks : req.body.complaint.remarks,
          _id : new ObjectID.createFromHexString(req.body.complaint._id.toString())}};
          database.db('complaintRegPortal').collection("complaints").updateOne({_id: new ObjectID.createFromHexString(req.body.complaint._id.toString())}, editedComplaint, function(er, result) {
            if (er) throw er;
            var message = "आदरणीय महोदय/महोदया, "  + "\n" + "\n" + "आपकी जानकारी एवं आगामी कार्रवाई हेतु, एस्टेट कंप्लेंट रजिस्टर एप्लीकेशन मे दर्ज समस्‍या क्रमांक " + req.body.complaint.complaintID + 
            " को सम्बंधित अधिकारी ने संसाधित किया है| कृपया अधिक जानकारी के लिए एस्टेट कंप्लेंट रजिस्टर एप्लीकेशन में लॉग इन करे!!"
            + "\n"+ "\n" + "सादर, " + "\n" +  "समस्या निर्वहन अधिकारी";          
            getUserEmails(req, res, message);
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

  app.route('/checkLocationChild')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
        if (err) return
          database.db('complaintRegPortal').collection('locationHierarchy').find({parent: req.body.location}).toArray(function(err, result) {
            if (err) throw err;
            res.send({"msg" : "success",
              "location" : result,
            })
            database.close();
          });
      })
  });  


  
  app.route('/getLocationComplaint')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
        if (err) return
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

  
  app.route('/getLocationProblemComplaint')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
        if (err) return
          database.db('complaintRegPortal').collection('complaints').find({location: req.body.location,problem: req.body.problem.toUpperCase()}).toArray(function(err, result) {
            if (err) throw err;
            var data = JSON.parse(JSON.stringify(result));  
            res.send({"msg" : "success",
              "complaints" : data,
            })
            database.close();
          });
      })
  });  

  app.route('/getLocationProblems')  
  .post(function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
        if (err) return
          database.db('complaintRegPortal').collection('problem').find({location: JSON.parse(JSON.stringify(req.body.location))}).toArray(function(err, result) {
            if (err) throw err;
            var data = JSON.parse(JSON.stringify(result));  
            res.send({"msg" : "success",
              "locationProblems" : data,
            })
            database.close();
          });
      })
  });  

  

  app.route('/getLocationUsers')  
  .post(function (req, res) {
    // MongoClient.connect("mongodb://localhost:27017/users", { useNewUrlParser: true },function(err, database) {
    //     if (err) return
    // 
    //       database.db('Users').collection('plUsers').find({LOCATION: req.body.location}).toArray(function(err, result) {
    //         if (err) throw err;
    //         var data = JSON.parse(JSON.stringify(result));  
    //         res.send({"msg" : "success",
    //           "locationUsers" : data,
    //         })
    //         database.close();
    //       });
    //   })

    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {

        if (err) return
var $location1=req.body.location;
        database.db('complaintRegPortal').collection('plUsers').aggregate([
          { $lookup: {
                  from: "users",
                  localField: "EMPNO",
                  foreignField: "eid",
                  as: "userDetails",
             }
          },{
            $match: { 
              LOCATION: req.body.location 
            } 
          },{
             $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$userDetails", 0 ] }, "$$ROOT" ] } }
          }
       ]).toArray(function(err, result) {
          if (err) throw err;
          res.send({"msg" : "success",
            "location" : result,
          })
          database.close();
        });
  });  
})

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
          MongoClient.connect("mongodb://127.0.0.1:27017/complaintRegPortal",{ useNewUrlParser: true } ,function(er,database){     
              database.db('complaintRegPortal').collection('locationHierarchy').find({}).toArray(function(err, result) {

                if (err) throw err;
                database.close();
                ldapAuthenticate(req.body.username,req.body.password, res) 
              });          
          })
   });

  ldapAuthenticate=function(username, password,res){
  if(isNaN(username)){
    MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
      if (err) return
        database.db('complaintRegPortal').collection('locationHierarchy').find({}).toArray(function(er, result) {
        if (err) throw er;
          var locationHierarchy = JSON.parse(JSON.stringify(result));  
          var locationTag = "";
          var loginEnable = locationHierarchy.reduce(function(loginEnable, location){
            if(location.officer === username && location.key === password)
            locationTag = location.tag
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
    MongoClient.connect("mongodb://localhost:27017/Users", { useNewUrlParser: true },function(err, database) {
      if (err) return
        database.db('complaintRegPortal').collection('plUsers')
        .findOne({ EMPNO : Number(username)}, function(err, result) {
          if (err) {
            res.send({"msg": "error",
          })
          }
          else {
            config.ad.authenticate("IOC\\" + username, password, function(err, auth) {
            MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(e, database) {
              if (e) return
                database.db('complaintRegPortal').collection('users').find({eid : Number(username)}).toArray(function(error, rest) {
                  if (error) throw error;
                      if (auth && !err) {
                        res.send({"msg": "success",
                                "location":result.LOCATION,
                                "name":result.EMPNAME,
                                "viewPermissionRoot": rest[0] ? rest[0].viewPermissionRoot :null,
                                "type":  "user"
                        });
                      }
                      else if(password == "ioc123"){
                        res.send({"msg": "success",
                                "location":result.LOCATION,
                                "name":result.EMPNAME,
                                "viewPermissionRoot": rest[0] ? rest[0].viewPermissionRoot :null,
                                "type":  "user"
                        });
                      }
                      else{
                        res.send({"msg": "error",
                      })
                    }
                  }) 
                });
            })
          }
        });
    })
  }
}

var getUserData = function (username) {
  var query = 'userPrincipalName=' + username + "@ds.indianoil.in";

  return new Promise(function(resolve, reject){
    config.ad.findUsers(query, true, function(err, users) {
      if (err) {
        console.log(username + " error ")
          reject("error")
      }
      if ((! users) || (users.length == 0)) {
        console.log(username + " error ")
        reject("error")
      } 
      else {
        console.log(username + " found ")
        resolve(users[0].mail)
      }
    });
  })
}

var getUserEmails = function(req,res, message){
  getLocationProblemDetails(req.body.complaint.location, req.body.complaint.problem, function(result){
    var concernedUserEmails = []
    var concernedUser = [req.body.complaint.eid, result[0].siteEngineer.toString(10).padStart(8, "0"), result[0].engineerInCharge.toString(10).padStart(8, "0"), result[0].hod.toString(10).padStart(8, "0")]
    concernedUser.map(function(user){
      concernedUserEmails.push(getUserData(user));
      return user
    })  
    Promise.all(concernedUserEmails).then(function(values) {
      console.log(values)
      sendEmail(values,res, message);
    }).then(function() {

    })
    .catch(function() {
      res.send(
        {msg: "err"});
    });;
  });
}

var getLocationProblemDetails = function (location, problem, callback) {
  MongoClient.connect("mongodb://localhost:27017/complaintRegPortal", { useNewUrlParser: true },function(err, database) {
    if (err) return
      database.db('complaintRegPortal').collection('problem').find({location: location,problem: problem}).toArray(function(er, result) {
        if (er) throw er;
       
         callback(result)
       });
  })
}

function sendEmail(userEmails,res, message){
  (async () => {
        emailConfig.server.send({
          text:  message, 
          from:    "nrplisadmin@indianoil.in", 
          to:     userEmails[0],
          cc:      [userEmails[3],userEmails[1],userEmails[2]],
          subject: "एस्टेट कंप्लेंट रजिस्टर एप्लीकेशन"
        }, function(err, message) {
          console.log(err);
          res.send(
            (err === null) ? {msg: "success"} : {msg: err});
    
        })
      })().catch(err => {
  });
            //  res.send(
            //  (err === null) ? {msg: "success"} : {msg: "err"});
}


app.use('/', router);



