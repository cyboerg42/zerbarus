var express = require('express');
var router = express.Router();
var settings = require('../modules/settings.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('stats', { netdata: settings.get("netdata") });
});

module.exports = router;
