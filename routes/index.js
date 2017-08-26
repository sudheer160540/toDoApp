var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var jwt    = require('jsonwebtoken');
var ta = require('time-ago')();
var app         = express();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
app.set('superSecret', 'ilovescotchyscotch');
///////Mongo DB Connection//////////
var db;
var url = 'mongodb://localhost:29047/todoapp';
var User, Report;
MongoClient.connect(url, function (err, database) {
    assert.equal(null, err);
    db = database;
    User = db.collection('user');
    Report = db.collection('report');
    console.log("Connected correctly to server.");
    //db.close();
});
router.post('/api/login',function(req,res){
    console.log("user data"+JSON.stringify(req.body));
    User.findOne({
    email: req.body.email
  }, function(err, user) {
     if (err) throw err;
     console.log("user"+JSON.stringify(user));
     if (!user) {
         console.log("enter")
      res.json({ success: false, message: 'Authentication failed. User not found.' });
     }else if(user){
     if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      }else {
       var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        console.log(user._id);
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          userId:user._id,
          username:user.username
        });
      }
     }
  });
});
router.post('/api/userRegister', function (req, res) {
    console.log("req.body---------------"+JSON.stringify(req.body));
    //req.body={"username":"sudheer","email":"sudheernunna@gmail.com","password":"sudheer"}
    User.findOne({
    email: req.body.email
  }, function(err, user) {
      if (!user) {
         console.log("enter")
      User.save(req.body, (err, result) => {
        if (err) return console.log(err)
        res.json({ 'status': 'success' });
        console.log('saved to database')
        //res.redirect('/')
    })
     }else{
          res.json({ success: false, message: 'User already exists.' });
   
     }
    
  });
});

router.post('/api/reportdelete', function (req, res) {
   // var date = new Date();
   // req.body = { 'date': date };
   console.log("enter to del"+req.body.taskname);
    Report.deleteOne({"taskname":req.body.taskname}, (err, result) => {
        if (err) return console.log(err)
        
        res.json({ 'status': 'success' });

        //res.redirect('/')
    })
});
router.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {
   
		// if there is no token
		// return an error
         res.render('index', {});
		// return res.status(403).send({ 
		// 	success: false, 
		// 	message: 'No token provided.'
		// });
		
	}
	
});

router.post('/api/createreport', function (req, res, next) {
    var date = new Date();
   // req.body = { 'date': date };
    Report.save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        console.log("result"+JSON.stringify(result));
        if(result){
res.json({ 'status': 'success' });
        }
        

        //res.redirect('/')
    })
});

router.post('/api/report', function (req, res) {
    Report.find({"userId":req.body.userId}).toArray(function (err, result) {
        if (err) throw err;
        var count = 0;
        for (var i = 0; i < result.length; i++) {
            count++;
            result[i].date = ta.ago(new Date(result[i].date));
        }
        if (count == result.length) {
            res.json({ 'status': 'success', "user": result });

        }

    });
});
router.get('/api/users', function (req, res) {
    User.find({}).toArray(function (err, result) {
        if (err) throw err;

        res.json({ 'status': 'success', "user": result });

    });
});

var transactionDetails = {};


router.get('/**', function (req, res, next) {


    console.log("hello " + req.url);
    res.render('index', {});

});



app.use('/api', router);
module.exports = router;
