var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // var username = req.params.username
     // console.log("useris name "+ username);
     var tod = new Object();
     tod.subject = "recruitment";

     //defining columns
     var columns = new Array();
     var tmp = new Object();
     tmp.key = "personality_score";
     tmp.full_name = "Personality Score";
     tmp.type = "NUMERIC";
     tmp.is_objective = true;
     tmp.goal = "MAX";
     columns.push(tmp);

     var tmp1 = new Object();
     tmp1.key = "honesty_score";
     tmp1.full_name = "Honesty Score";
     tmp1.type = "NUMERIC";
     tmp1.is_objective = true;
     tmp1.goal = "MAX";
     columns.push(tmp1);

     var tmp2 = new Object();
     tmp2.key = "recommd_score";
     tmp2.full_name = "Recommandation Sentiment";
     tmp2.type = "NUMERIC";
     tmp2.is_objective = true;
     tmp2.goal = "MAX";
     columns.push(tmp2);

     tod.columns = columns;

     //adding options
     fs.readFile('data_file.json','utf8',function(err,data){
        if(err){
           console.log(err);
        }
        else{
           //load entire data from data file
           var obj = JSON.parse(data);
           var i = 1;
           var options = new Array();
           for (var entry in obj) {
              if (obj.hasOwnProperty(entry)) {
                 var t = new Object();
                 t.key = i.toString();
                 t.name = obj[entry].basicdata.full_name;
                 var val = new Object();
                 val.personality_score = obj[entry].personality_score;
                 val.honesty_score = obj[entry].honesty_score;
                 val.recommd_score = parseFloat(obj[entry].recumsentimentdata.docSentiment.score) * 100;
                 t.values = val;
                 options.push(t);
                 i++;
              }
           }
           tod.options = options;
           // console.log(JSON.stringify(tod));
           res.render('trade', { title: 'Trade Off', prbdata : tod });
        }
     });
});

module.exports = router;
