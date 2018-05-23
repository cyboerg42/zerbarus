var express = require('express');
var router = express.Router();
var url = require('url');
var settings = require('../modules/settings.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var output = "";
  var q = url.parse(req.url, true).query;
  var result = require('child_process').execSync("virsh -c "+settings.get("host")+" start " + q.vname).toString();
   output += "starting vm " + q.vname + "...";
   output += "<script>setTimeout(function(){window.location.href='/list'},2000);</script>";
   res.send(output);
});

module.exports = router;
