var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

// var routes = require('./routes/index');
// var welcome = require('./routes/welcome')
var joinus = require('./routes/joinus');
var dashboard = require('./routes/dashboard');
var cdlist = require('./routes/cdlist');
var todo = require('./routes/todo');
var help = require('./routes/help');
var trade = require('./routes/trade');

var app = express();

var bluemix = require('./config/bluemix'),
   watson = require('watson-developer-cloud'),
   extend = require('util')._extend;

// Bootstrap application settings
require('./config/express')(app);

// if bluemix credentials exists, then override local
var credentials = extend({
  version: 'v1',
  username: 'ce9fccd2-3a1b-45a8-99e7-08313717d488',
  password: '0q6DLBpy6ljK'
}, bluemix.getServiceCreds('tradeoff_analytics')); // VCAP_SERVICES

// Create the service wrapper
var tradeoffAnalytics = watson.tradeoff_analytics(credentials);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(express.static(__dirname + '/public'));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/public')));

var formidable = require('formidable');
// app.use(formidable.parse());
var email;
app.get('/test',function(req,res){
    res.render('thankyou');
});
app.get('/cdper*@:email', function (req, res) {
    email = req.params.email;
    console.log("Email is"+ email)
     fs.readFile('data_file.json','utf8',function(err,data){
      if(err){
         console.log(err);
      }
      else{
         //load entire data from data file
         var obj = JSON.parse(data);
         //create new detail object
         // console.log("OBJ is got data "+JSON.stringify(obj));
         var user_details = new Object();
         // console.log("*****"+email);
         var tmp = email;
         user_details['full_name'] = obj[email].basicdata.full_name;
         user_details['DOB'] = obj[email].basicdata.DOB;
         user_details['email'] = obj[email].basicdata.email;
         user_details['username'] = email;
         user_details['sex'] = obj[email].basicdata.sex;
         user_details['careerobj'] = obj[email].resumekeydata.careerobj;

         //getting twitterdata
         var tmp = obj[email].twitterdata.tree.children[0].children[0].children;
         var twitter_big5 = new Object();
         twitter_big5['openness'] = tmp[0].percentage;
         twitter_big5['conscientiousness'] = tmp[1].percentage;
         twitter_big5['extraversion'] = tmp[2].percentage;
         twitter_big5['agreeableness'] = tmp[3].percentage;
         twitter_big5['neuroticism'] = tmp[4].percentage;
         user_details['twitterdata'] = twitter_big5;

         //getting personality data
         tmp = obj[email].personalitydata.tree.children[0].children[0].children;
         var personality_big5 = new Object();
         personality_big5['openness'] = tmp[0].percentage;
         personality_big5['conscientiousness'] = tmp[1].percentage;
         personality_big5['extraversion'] = tmp[2].percentage;
         personality_big5['agreeableness'] = tmp[3].percentage;
         personality_big5['neuroticism'] = tmp[4].percentage;
         user_details['personalitydata'] = personality_big5;

         //getting answers
         user_details['about_yourself'] = obj[email].basicdata.about_yourself;
         user_details['ton_of_work'] = obj[email].basicdata.ton_of_work;
         user_details['difficult_time'] = obj[email].basicdata.difficult_time;
         user_details['team_player'] = obj[email].basicdata.team_player;
         user_details['book'] = obj[email].basicdata.book;
         user_details['role'] = obj[email].basicdata.role_model;


         //getting resume
         user_details['resumedata'] = obj[email].resumekeydata;
         // console.log(JSON.stringify(user_details));
         res.render('personality', { title: 'personality' , ud : user_details});
      }
   });
  // console.log("useris name "+ cdEmail);
});

app.get('/cdres*@:email', function (req, res) {
    email = req.params.email;
    console.log("Email is"+ email);
     fs.readFile('data_file.json','utf8',function(err,data){
      if(err){
         console.log(err);
      }
      else{
         //load entire data from data file
                  //load entire data from data file
         var obj = JSON.parse(data);

         //create new detail object
         var user_details = new Object();
         user_details['full_name'] = obj[email].basicdata.full_name;
         user_details['DOB'] = obj[email].basicdata.DOB;
         user_details['email'] = obj[email].basicdata.email;
         user_details['username'] = email;
         user_details['sex'] = obj[email].basicdata.sex;
         user_details['careerobj'] = obj[email].resumekeydata.careerobj;

         //create temp
         var arr = new Array();

         //getting resume
         var resume_data = new Object();
         var tmp = obj[email].resumekeydata;

         //careerobj
         resume_data.careerobj = tmp.careerobj;

         //ssc
         var ssc = new Object();
         arr = [];
         arr = tmp.ssc.split(" ");
         ssc.percentage = arr[2];
         ssc.insti = "";
         for(i = 3; i < arr.length; i++)
         {
            ssc.insti = ssc.insti + " " + arr[i];
         }
         resume_data.ssc = ssc;

         //hsc
         var hsc = new Object();
         arr = [];
         arr = tmp.hsc.split(" ");
         hsc.percentage = arr[2];
         hsc.insti = "";
         for(i = 3; i < arr.length; i++)
         {
            hsc.insti = hsc.insti + " " + arr[i];
         }
         resume_data.hsc = hsc;

         //ug
         var ug = new Object();
         arr = [];
         arr = tmp.ug.split(" ");
         ug.percentage = arr[2];
         ug.insti = "";
         for(i = 3; i < arr.length; i++)
         {
            ug.insti = ug.insti + " " + arr[i];
         }
         resume_data.ug = ug;

         //pg
         var pg = new Object();
         arr = [];
         arr = tmp.pg.split(" ");
         pg.percentage = arr[2];
         pg.insti = "";
         for(i = 3; i < arr.length; i++)
         {
            console.log(arr[i]);
            pg.insti = pg.insti + " " + arr[i];
         }
         resume_data.pg = pg;
         //work 1
         arr = [];
         var wr1 = new Object();
         arr = tmp.work1.split(" ");
         wr1.duration = arr[0];
         wr1.position = arr[1];
         wr1.org = arr[2];
         resume_data.work1 = wr1;

         //work 2
         arr = [];
         var wr2 = new Object();
         arr = tmp.work2.split(" ");
         wr2.duration = arr[0];
         wr2.position = arr[1];
         wr2.org = arr[2];
         resume_data.work2 = wr2;

         //work 3
         arr = [];
         var wr3 = new Object();
         arr = tmp.work3.split(" ");
         wr3.duration = arr[0];
         wr3.position = arr[1];
         wr3.org = arr[2];
         resume_data.work3 = wr3;

         //c
         arr = [];
         arr = tmp.c.split(" ");
         resume_data.c = arr[1].split("/")[0];

         //cpp
         arr = [];
         arr = tmp.cpp.split(" ");
         resume_data.cpp = arr[1].split("/")[0];

         //java
         arr = [];
         arr = tmp.java.split(" ");
         resume_data.java = arr[1].split("/")[0];

         //python
         arr = [];
         arr = tmp.python.split(" ");
         resume_data.python = arr[1].split("/")[0];

         //js
         arr = [];
         arr = tmp.js.split(" ");
         resume_data.js = arr[1].split("/")[0];

         //angular
         arr = [];
         arr = tmp.angular.split(" ");
         resume_data.angular = arr[1].split("/")[0];

         //node
         arr = [];
         arr = tmp.node.split(" ");
         resume_data.node = arr[1].split("/")[0];

         //rails
         arr = [];
         arr = tmp.rails.split(" ");
         resume_data.rails = arr[1].split("/")[0];

         //django
         arr = [];
         arr = tmp.django.split(" ");
         resume_data.django = arr[1].split("/")[0];

         //database
         arr = [];
         arr = tmp.database.split(" ");
         resume_data.database = arr[1].split("/")[0];

         //os
         arr = [];
         arr = tmp.os.split(" ");
         resume_data.os = arr[1].split("/")[0];

         //network
         arr = [];
         arr = tmp.network.split(" ");
         resume_data.network = arr[1].split("/")[0];

         //english
         arr = [];
         arr = tmp.english.split(" ");
         resume_data.english = arr[1];

         //hindi
         arr = [];
         arr = tmp.hindi.split(" ");
         resume_data.hindi = arr[1];

         //japanese
         arr = [];
         arr = tmp.japanese.split(" ");
         resume_data.japanese = arr[1];

         //chinese
         arr = [];
         arr = tmp.chinese.split(" ");
         resume_data.chinese = arr[1];

         console.log(JSON.stringify(resume_data));
         // res.render
         var rd = JSON.stringify(resume_data);
      }
         res.render('resume', { title: 'resume' , ud : resume_data, details : user_details});
   });
});

app.get('/cdrecum*@:email', function (req, res) {
  var email = req.params.email;
   fs.readFile('data_file.json','utf8',function(err,data){
      if(err){
         console.log(err);
      }
      else{
         //load entire data from data file
         var obj = JSON.parse(data);

         //get the required object
         var candidate = obj[email];
         // var candidate = obj[email];
         var sentscore = obj[email].recumsentimentdata.docSentiment.score;
         var keywords = obj[email].recumkeyworddata.keywords;
         // console.log(keywords)
         var txt = JSON.stringify(keywords);
         txt = txt.replace(/\\\\n/g, " ");
         txt = txt.replace(/relevance/g, "value");
         txt = txt.replace(/text/g, "key");
         console.log(txt);
         var passdata = JSON.parse(txt);
      }
      res.render('recum',        { title : 'Recommendation' , cd : email, ud : passdata, sentiment : sentscore});
   });//file
});//get

function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}

// app.use('/', routes);
app.use('/' , joinus);
app.use('/dashboard' , dashboard);
app.use('/cdlist',cdlist);
app.use('/todo',todo);
// app.use('/welcome',welcome);
app.use('/help',help);
app.use('/trade',trade);

app.post('/demo/dilemmas/', function(req, res) {
  var params = extend(req.body);
  params.metadata_header = getMetadata(req);

  tradeoffAnalytics.dilemmas(params, function(err, dilemma) {
    if (err)
      return res.status(Number(err.code) || 502).send(err.error || err.message || 'Error processing the request');
    else
      return res.json(dilemma);
  });
});

app.post('/demo/events/', function(req, res) {
  var params = extend(req.body);
  params.metadata_header = getMetadata(req);

  tradeoffAnalytics.events(params, function(err) {
    if (err)
      return res.status(Number(err.code) || 502).send(err.error || err.message || 'Error forwarding events');
    else
      return res.send();
  });
});

function getMetadata(req) {
	var metadata = req.header('x-watson-metadata');
	if (metadata) {
		metadata += "client-ip:" + req.ip;
	}
	return metadata;
}

// app.use('/candidatedetails' , candidatedetails);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
