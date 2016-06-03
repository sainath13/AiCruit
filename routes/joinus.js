var express = require('express');
var Promise = require('bluebird');
var fs = require('fs');
var router = express.Router();
var formidable = require('formidable');
var Twitter = require('twitter');
var watson = require('watson-developer-cloud');
var jsonfile = require('jsonfile')
var util = require('util')
// asdfasf = sdgknf;
var personality_insights = watson.personality_insights({
  username: 'ab20a276-d007-43e1-9753-4934131a1a2c',
  password: 'SMMt3jzyfaUx',
  version: 'v2'
});

var document_conversion = watson.document_conversion({
  username:     '0eec9338-6199-4988-ad0f-16d6f94cfc3d',
  password:     'qnrv4IOUajzi',
  version:      'v1',
  version_date: '2015-12-01'
});


var alchemy_language = watson.alchemy_language({
  api_key: '93e808058818691b998c73b8c346533e8853296d'
});

router.get('/', function(req, res, next) {
  	 res.render('joinus', { title: 'Express' });
});
//GLOBALS
var allinfo = new Object();
var resumepath ;
var recumpath ;
var pushobj = new Object();
var myemail ;
var gettweerinfo = new Object();
var personalityobj = new Object();
var resumeobj = new Object();
var recumobj = new Object();
var tempobj = new Object();
// var personalityobj
router.post('/', function(req, res){
	var form = new formidable.IncomingForm();
    var	files = [];

    var	fields = [];
    form.parse(req);

    form.on('field', function(field, value) {
        allinfo[field] = value;
        // myemail =
    })
    form.on('file', function(field, file) {
          if (field =='Resume'){
           	resumepath = file.path;
           }
           if (field =='recom_letter'){
           	recumpath = file.path;
           }
        files.push([field, file]);
    })
    form.on('end', function() {
    	myemail = allinfo.email;
    	// console.log('resume path is'+resumepath);
		// console.log('recum path is'+recumpath);
		savefile(resumepath,'resume_'+allinfo.twitter);
		savefile(recumpath,'recum_'+allinfo.twitter);
		datacollector();
        res.render('thankyou');
    });
});//end of post
var savefile = function(filepath,filename){
		var content;
        fs.readFile(filepath, function read(err, data) {
		    if (err) {
		        throw err;
		    }
		    content = data;
		    fs.writeFile('public/'+filename , data, function (err) {
			  if (err) {
			  	return console.log(err);
			  }
			  else {
			  	// console.log('zal check');
				}
			});
	});
};
function getresumeinfo  (filepath){
	return new Promise (function(resolve,reject){
			document_conversion.convert({
			  // (JSON) ANSWER_UNITS, NORMALIZED_HTML, or NORMALIZED_TEXT
				  file: fs.createReadStream(filepath),
				  conversion_target: document_conversion.conversion_target.NORMALIZED_TEXT,
				  // Add custom configuration properties or omit for defaults
				  answer_units: {
				        selector_tags: ["h1","h3","h3","h4","h5","h6"]
				    }

				},
				function (err, response) {
				  if (err) {
				    console.error(err);
				  	reject(err);
				  } else {
				    // var resume = JSON.stringify(response, null, 2);
					console.log('got resume keywords');
					 var resume = JSON.stringify(response, null, 2);
				    resolve(resume.split("\\n\\n"));
				    // (response);
				  }
			});
});
};//end of getresumeinfo

function promiseA (params){
	return new Promise (function(resolve,reject){
		alchemy_language.sentiment(params, function (err, response) {
		  if (err){
		  	reject(err);
		  }
		  else{
			console.log("sentiment success");
			resolve(response);
		  	// console.log(JSON.stringify(response, null, 2));
			}
		});
	});
};//end of promiseA
function promiseB(params){
	return new Promise( function(resolve,reject){
		//code here
		alchemy_language.keywords(params, function (err, response) {
			  if (err){
			    console.log('error:', err);
			  }
			  else{
					console.log("keywords success");
					resolve(response);
				}
			});
	});
};//end of promiseB

 function getTweet(twitterHandle) {
		return new Promise (function(resolve,reject){
			    // do something
		    var client = new Twitter({
		        consumer_key: 'qPqtN3g4uDaP6qWYc2CrCUGan',
		        consumer_secret: 'jHwHeNCZVwf7A8d1GQKhXhko8EJW55eLkj6tTpem5C1x7L6Wsw',
		        access_token_key: '3333122590-oivDLDBXGI1Nxs5eRtKZzDv16e0wSQNecrCAkYA',
		        access_token_secret: 'sVAD9VLH2utuHneo0qmeVMloNoWKvtDj7xkxF1po03K3t'
		    });
		    var mytweets= ' ';
		    var params = {screen_name: twitterHandle, count :20};
		    client.get('statuses/user_timeline', params, function(error, tweets, response){
		        if (!error) {
		          var t = tweets;
		          var  i = 0;
		          for (twit in t){
		            mytweets = mytweets + ' ' + t[twit].text ;
		            i++;
		          }
		          var tweetparams = {
		            text:  mytweets,
		            language: 'en'
		          };
		          personality_insights.profile(tweetparams,function (err, response) {
		            if (err){
		            	reject(err);
		              console.log('error:', err);
		            }
		            else{
		                 console.log('got the personality data from twitter');
		            	 resolve(response);
		              // console.log(JSON.stringify(response, null, 2));
		            }
		            });
		        }
		        else {
		          console.log(error);
		          reject(error);
		        }
		    });

});
};

function getpersonalityinfo(passedtext){
	return new Promise (function(resolve,reject){
			  var params = {
			    text:  passedtext,
			    language: 'en'
			  };
			  personality_insights.profile(params,function (err, response) {
			    if (err){
			      console.log('error:', err);
			      reject(err);
				}
			    else{
			         console.log('got the personality data from form filled');
			         resolve(response);
			    	}
			    });

});
}
function getrecuminfo_sentiment (filepath){
		return new Promise (function(resolve,reject){
				document_conversion.convert({
				  file: fs.createReadStream(filepath),
				  conversion_target: document_conversion.conversion_target.NORMALIZED_TEXT,
				},
				function (err, response) {
				  if (err) {

				    	reject(err);
				  } else {

				    var recommendationletter = JSON.stringify(response, null, 2);
					var params = {
					  text: recommendationletter
					};
					alchemy_language.sentiment(params, function (err, response) {
					  if (err){
					    console.log('error:', err);
					  	reject(err);
					  }
					  else{
						console.log("sentiment success");
						resolve(response);
						}
					});

				  }

			});//end document_conversion.convert

	});//end of promise
	// return tempobj;
};//end
 function  getrecuminfo_keyword (filepath){
	return new Promise (function(resolve,reject){
			document_conversion.convert({
				  file: fs.createReadStream(filepath),
				  conversion_target: document_conversion.conversion_target.NORMALIZED_TEXT,
				},
				function (err, response) {
				  if (err) {
				  	reject(err);
				    console.error(err);
				  } else {

				    var recommendationletter = JSON.stringify(response, null, 2);
					var params = {
					  text: recommendationletter
					};

					alchemy_language.keywords(params, function (err, response) {
					  if (err){
					  	reject(err);
					  	  console.log('error:', err);
					  }
					  else{
							console.log("keywords success");
							// var send = JSON.stringify(response);
							//send = send.replace("relevance", "value");
							//send = send.replace("text", "key");
							//send = JSON.parse(send);
							resolve(response);
						}
					});
				  }

			});//end document_conversion.convert

	});//end of promise
	// return tempobj;
};//end
function datacollector(){
		var passtext =  allinfo.about_yourself + ' ' + allinfo.ton_of_work + ' ' + allinfo.difficult_time + ' ' + allinfo.team_player + ' ' + allinfo.book +' ' + allinfo.role_model;
// TODO: add allinfo in jsonfile
		var a =	getTweet(allinfo.twitter);
		var b =	a.then(function(resultA) {
					return getpersonalityinfo(passtext);
				});
		var c = b.then(function(resultB){
					return getresumeinfo(resumepath);
				});
		var d = c.then(function(resultC){
					return getrecuminfo_sentiment(recumpath);
				});
		var e = d.then(function(resultD){
					return getrecuminfo_keyword(recumpath);
				});
		return Promise.all([a, b, c, d, e]).spread(function(resultA, resultB, resultC, resultD, resultE) {
				// console.log('a is ==' + resultA);
				// console.log('b is ==' + resultB);
				// for (i = 0 ; i < resultC.length ; i ++ ){
				// 	console.log(i +" , "+ resultC[i]);
				// }// console.log('c is == ' + resultC);
            var resumedata = new Object()
				resumedata.careerobj = resultC[8];
				resumedata.ssc = resultC[11];
				resumedata.hsc = resultC[12];
				resumedata.ug = resultC[13];
				resumedata.pg = resultC[14];
				resumedata.work1 = resultC[17];
				resumedata.work2 = resultC[18];
				resumedata.work3 = resultC[19];
				resumedata.c = resultC[23];
				resumedata.cpp = resultC[24];
				resumedata.java = resultC[25];
				resumedata.python = resultC[26];
				resumedata.js = resultC[27];
				resumedata.angular = resultC[29];
				resumedata.node = resultC[30];
				resumedata.rails = resultC[31];
				resumedata.django = resultC[32];
				resumedata.database = resultC[34];
				resumedata.os = resultC[35];
				resumedata.network = resultC[36];
				resumedata.english = resultC[38];
				resumedata.hindi = resultC[39];
				resumedata.japanese = resultC[40];
				resumedata.chinese = resultC[41];
				// console.log('d is = '+ resultD);
				// console.log('e is =' + resultE);
				var pushdata = new Object();
				var myemail = allinfo.email;
				// pushdata.myemail = myemail;

            // adding submission date to data
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!

            var yyyy = today.getFullYear();
            if(dd<10){
                dd='0'+dd
            }
            if(mm<10){
                mm='0'+mm
            }
            var today = dd+'/'+mm+'/'+yyyy;

            // console.log(today);
            pushdata.basicdata = allinfo;
				pushdata.twitterdata = resultA;
				pushdata.personalitydata = resultB;
				pushdata.resumekeydata = resumedata;
				pushdata.recumsentimentdata = resultD;
				pushdata.recumkeyworddata = resultE;
            pushdata.submitdate = today;
            pushdata.appstatus = 'Applied';

            //generating twitter score
            var tmp = pushdata.twitterdata.tree.children[0].children[0].children;
            var to = parseFloat(tmp[0].percentage); // 3
            var tc = parseFloat(tmp[1].percentage); // 1
            var te = parseFloat(tmp[2].percentage); // 2
            var ta = parseFloat(tmp[3].percentage); // 3
            var tn = parseFloat(tmp[4].percentage); // 1
            var twit_score = (to * 3 + tc * 1 + te * 2 + ta * 3 + tn * 1) / 10;

            //generating personality score
            var tmp = pushdata.personalitydata.tree.children[0].children[0].children;
            var po = parseFloat(tmp[0].percentage); // 3
            var pc = parseFloat(tmp[1].percentage); // 1
            var pe = parseFloat(tmp[2].percentage); // 2
            var pa = parseFloat(tmp[3].percentage); // 3
            var pn = parseFloat(tmp[4].percentage); // 1
            var personality_score = (po * 3 + pc * 1 + pe * 2 + pa * 3 + pn * 1) / 10;

            //honesty score
            var honesty_score = (1.0 - Math.abs(twit_score - personality_score)) * 100;
            personality_score = (personality_score + twit_score) * 50;

            pushdata.honesty_score = honesty_score;
            pushdata.personality_score = personality_score;

            var term = myemail.indexOf('@');
            myemail = myemail.slice(0, term);
				var obj;
				fs.readFile('data_file.json','utf8',function(err,data){
					if(err){
						console.log(err);
					}
					else{
						obj = JSON.parse(data);
						obj[myemail] = pushdata;
						fs.writeFile('data_file.json', JSON.stringify(obj),function(err, resp){
							if(err){
								console.log(err);
							}
							else{
								console.log('Data has been updated');
							}

						});
					}
				});


		});
}
module.exports = router;
