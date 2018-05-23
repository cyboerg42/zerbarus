var express = require('express');
var router = express.Router();
var settings = require('../modules/settings.js');
var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  var q = url.parse(req.url, true).query;
  res.render('info', { netdata: settings.get("netdata"), name: q.vname });
});

module.exports = router;
