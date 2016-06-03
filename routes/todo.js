var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  
  res.render('todo', { title: 'Express' });

});

//TODO : error handling for twitter text less than 100 words
module.exports = router;