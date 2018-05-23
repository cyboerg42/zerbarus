exports.getAll = function() {
  var fs = require("fs");
  var contents = fs.readFileSync("dists.json");
  var jsonContent = JSON.parse(contents);
  return jsonContent;
}

exports.get = function(name) {
  var fs = require("fs");
  var contents = fs.readFileSync("dists.json");
  var jsonContent = JSON.parse(contents);
  return jsonContent[name];
}

