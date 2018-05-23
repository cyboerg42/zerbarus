var express = require('express');
var router = express.Router();
var url = require('url');
var settings = require('../modules/settings.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var output = "";
  var q = url.parse(req.url, true).query;

  var result = require('child_process').execSync("virsh -c "+settings.get("host")+" vncdisplay " + q.vname).toString();

  var spawn = require('child_process').spawn;
  function shspawn(command) {
    spawn('sh', ['-c', command], { stdio: 'inherit' });
  }

  var tmp = result.split(":");

  if (q.stop != 1) {
    var randport = Math.round(Math.random() * (8000 - 6000) + 6000);
    if (tmp[1] < 10) { var cmd= "./noVNC/utils/launch.sh --cert "+settings.get("combined_cert")+" --listen " + randport + " --vnc localhost:590" + tmp[1]; }
    else { var cmd="./noVNC/utils/launch.sh --cert "+settings.get("combined_cert")+" --listen " + randport + " --vnc localhost:59" + tmp[1]; }
    
    shspawn(cmd);

    output += "redirecting to novnc...<br>";
    output += "<script>setTimeout(function(){window.location.href='https://'+ location.hostname +':" + randport +"/vnc.html?host='+ location.hostname +'&port="+randport+"'},2000);</script>";
  }
  else if (q.stop == 1) {
    if (tmp[1] < 10) { var cmd="./killvnc.sh 590" + tmp[1]; }
    else { var cmd="./killvnc.sh 59" + tmp[1]; }
    shspawn(cmd);
    output += "killing novnc...";
    output += "<script>setTimeout(function(){window.location.href='/list'},2000);</script>";
  }
  res.send(output);
});

module.exports = router;
