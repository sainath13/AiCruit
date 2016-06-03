var express = require('express');
var router = express.Router();
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res) {
     fs.readFile('data_file.json','utf8',function(err,data){
      if(err){
         console.log(err);
      }
      else{
         //load entire data from data file
         //full_name date hire stat job objective username
         var obj = JSON.parse(data);
         //create new detail object
         var cdlist = new Array();
         // user_details['full_name'] = obj[email].basicdata.full_name;
         // user_details['DOB'] = obj[email].basicdata.DOB;
         // user_details['email'] = email;
         // user_details['sex'] = obj[email].basicdata.sex;
         // user_details['careerobj'] = obj[email].resumekeydata.careerobj;
         for (var entry in obj) {
            if (obj.hasOwnProperty(entry)) {
               var new_entry = new Object();
               new_entry['full_name'] = obj[entry].basicdata.full_name;
               new_entry['submit_date'] = obj[entry].submitdate;
               new_entry['appstatus'] = obj[entry].appstatus;
               new_entry['careerobj'] = obj[entry].resumekeydata.careerobj;
               new_entry['username'] = entry;
               cdlist.push(new_entry);
            }
         }
         // console.log(JSON.stringify(cdlist[0]));
         res.render('cdlist', { title: 'Express', ud : cdlist });

      }
   });  

});

//TODO : error handling for twitter text less than 100 words
module.exports = router;