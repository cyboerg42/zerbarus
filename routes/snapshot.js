var express = require('express');
var router = express.Router();
var url = require('url');
var settings = require('../modules/settings.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var q = url.parse(req.url, true).query;
  var output = "";
  output += '<script type="text/javascript" src="https://code.jquery.com/jquery-1.11.0.min.js"></script><script type="text/javascript">$(document).ready(function(){$("#button").click(function(e) {  var snapval = $("#sname").val();window.location.href="/screate?vname=' + q.vname + '&sname="+snapval;});});</script>'
  output += '<style>table, th, td {border: 1px solid black;border-collapse: collapse;}th, td {padding: 5px;}th {text-align: left;}</style>';
  var result = require('child_process').execSync("virsh -c "+settings.get("host")+" snapshot-list " + q.vname).toString();
  var stdout = result.replace(/-/gi,'');
      var artmp = stdout.split(" ");
      var tmp = "";
      var skip = 4;
      var i = 0;
      artmp.forEach(function(entry) {
        if (entry != "") {
	i++;
	if (i > skip) {
          tmp = tmp + "," + entry;
	}
	}
      });
     var works = tmp.substring(1, tmp.length-1).replace(/\n/gi,'').split(",");

     output += "<h3><br>SNAPSHOTS<br></h3>";
     output += "of " + q.vname;
     output += '<br><br>Name <input type="text" value="snapshot1" id="sname">'
     output += ' <button type="button" id="button">Create Snapshot</button><br><br>'
     output += '<table style="width:100%"><tr><th>name</th><th>date</th><th>state</th><th></th></tr>';

     for (var i = 0; i < works.length; i++) {
       if(works[i] != ""){
       output += '<tr><td>' + works[i] + '</td><td>' + works[i+1] + ' ' + works[i+2] + ' ' + works[i+3]  + '</td><td>' + works[i+4] + '</td><td><a href="/srestore?vname=' + q.vname + '&sname=' + works[i] + '">restore </a><a href="/sremove?vname=' + q.vname + '&sname=' + works[i] + '">delete </a></td></tr>';
       i = i+4;
       }
     }
     //output += "<br><br>" + works; //DEBUG
     res.render('list', { title: 'VMstat', input: output });
});

module.exports = router;

