var express = require('express');
var router = express.Router();
var url = require('url');
var settings = require('../modules/settings.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var output = "";
  var q = url.parse(req.url, true).query;
  var cmd = "virsh -c "+settings.get("host")+" snapshot-delete " + q.vname +" "+ q.sname;
  var spawn = require('child_process').spawn;
    function shspawn(command) {
    spawn('sh', ['-c', command], { stdio: 'inherit' });
  }
  shspawn(cmd);
  output += "deleting  snapshot "+q.sname+" ("+q.vname+")...";
  output += "<script>setTimeout(function(){window.location.href='/list'},2000);</script>";
  res.send(output);
});

module.exports = router;
