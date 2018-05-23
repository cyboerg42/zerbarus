var express = require('express');
var router = express.Router();
var dists = require('../modules/dists.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(dists.getAll());
});

module.exports = router;
