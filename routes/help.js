var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // var username = req.params.username
     // console.log("useris name "+ username);
  res.render('help', { title: 'help' });
});


//TODO : error handling for twitter text less than 100 words
module.exports = router;