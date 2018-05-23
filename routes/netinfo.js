var express = require('express');
var router = express.Router();
var url = require('url');
var settings = require('../modules/settings.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var output = "";
  var q = url.parse(req.url, true).query;
  var result = require('child_process').execSync("virsh -c "+settings.get("host")+" domifaddr " + q.vname).toString();
  var tmp = result.split(" ");
  for (var i = 0; i < tmp.length; i++) {
      if (tmp[i] == "ipv4") for (var i = i + 1; i < tmp.length; i++) if(tmp[i] != "") output += tmp[i];
  }
  res.send(output);
});

module.exports = router;
