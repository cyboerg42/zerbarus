var express = require('express');
var router = express.Router();
var url = require('url');
var settings = require('../modules/settings.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var output = "";
  var q = url.parse(req.url, true).query;

  var spawn = require('child_process').spawn;

  function shspawn(command) {
    spawn('sh', ['-c', command], { stdio: 'inherit' });
  }
  shspawn("virsh -c "+settings.get("host")+" destroy " +q.vname);

  var result = require('child_process').execSync("virsh -c "+settings.get("host")+" undefine " + q.vname).toString();

  output += "deleting vm " + q.vname + " & volumes...";
  var cmd = "rm "+settings.get("datastore") + q.vname + ".qcow2";
  shspawn(cmd);
  output += "<script>setTimeout(function(){window.location.href='/list'},2000);</script>";
  res.send(output);
});

module.exports = router;
