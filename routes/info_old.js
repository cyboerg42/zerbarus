var express = require('express');
var router = express.Router();
var url = require('url');
var settings = require('../modules/settings.js');
var dists = require('../modules/dists.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var output = "";
  var q = url.parse(req.url, true).query;
  var result = require('child_process').execSync("virsh -c "+settings.get("host")+" dominfo " + q.vname).toString();
  output += '<head><script type="text/javascript" src="http://code.jquery.com/jquery-1.11.0.min.js"></script><script type="text/javascript">$(document).ready(function(){$("#button").click(function(e) {  window.location.href="/remove?vname='+ q.vname +'";});});</script></head>';
  output += result.replace(/\n/gi,'<br>');
  output += "<br><h4>DELETE THIS VM -> <button type='button' id='button'>Delete Me!</button>";
  output += '<br><br><a href="/list">return to list</a>';

  output += '<br><br>TESTING AREA';
  output += '<br>' + dists.get("debian_j")["osType"];
  output += '<br>' + dists.get("debian_j")["location"];
  res.send(output);

});

module.exports = router;
