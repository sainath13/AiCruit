var express = require('express');
var fs = require('fs');
var router = express.Router();
var multer	=	require('multer');

var watson = require('watson-developer-cloud');
// var fs = require('fs');
 
var document_conversion = watson.document_conversion({
  username:     'd7d2a83d-5d6f-478b-a296-90fc9bfca782',
  password:     'daEqXb4dxvHj',
  version:      'v1',
  version_date: '2015-12-01'
});

var alchemy_language = watson.alchemy_language({
  api_key: '9ee33298d317162241eb17a6c7bfe51cc6a1a9d1'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  	 res.render('recommendation', { title: 'Express' });
});


var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

var upload = multer({ storage : storage}).single('recommendationfile');

router.post('/', function(req, res){
	// console.log(req.body);
 //    console.log(req.files);
	// res.send('got responce');
	upload(req,res,function(err){
		// var uploadcallback = new Function(afterupload);
		// uploadcallback();
		if(err) {
			return res.end("Error uploading file.");
		}
		else {
			res.send("File is uploaded");
		 	console.log(req.file);
		 	// fs = require('fs')
		 	console.log("-------------------------");
			// fs.readFile(req.file.path, 'utf8', function (err,data) {
			//   if (err) {
			//     return console.log(err);
			//   }
			//   console.log(data);
			// });
			document_conversion.convert({
				  file: fs.createReadStream(req.file.path),
				  conversion_target: document_conversion.conversion_target.NORMALIZED_TEXT,
				}, 
				function (err, response) {
				  if (err) {
				    console.error(err);
				  } else {
				    var recommendationletter = JSON.stringify(response, null, 2);
				    console.log(recommendationletter);
				    // var recommendationletter = tmpfile.split("\\n\\n"));
					var params = {
					  text: recommendationletter
					};
					alchemy_language.sentiment(params, function (err, response) {
					  if (err)
					    console.log('error:', err)
					;  else
					    console.log(JSON.stringify(response, null, 2));
					});

					alchemy_language.keywords(params, function (err, response) {
					  if (err)
					    console.log('error:', err)
					;  else
					    console.log(JSON.stringify(response, null, 2));
					});

				  }
			});
		}
	});

  
});

module.exports = router;