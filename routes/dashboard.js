var express = require('express');
var router = express.Router();
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res) {
  //read data from file
  //jsonobj = that apply algo and parse
  //use jquery on the client side and print the data
	// fs.readFile('mydata_file.json','utf8',function(err,data){
	// 	if(err){
	// 		console.log(err);
	// 	}
	// 	else{
	// 		console.log('read the file.');
	// 		//write something to find just what to send to the dashboard
	// 		var dashboarddata = JSON.parse(data);
	// 		// console.log(dashboarddata);
	// 		console.log(dashboarddata['latkarsainath@gmail.com'].basicdata.full_name);
	// 	}
	// });
  
  res.render('dashboard', { title: 'Express' });

});

//TODO : error handling for twitter text less than 100 words
module.exports = router;