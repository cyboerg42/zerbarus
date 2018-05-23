var express = require('express');
var router = express.Router();
var url = require('url');
var crypto = require('crypto');
var settings = require('../modules/settings.js');
var dists = require('../modules/dists.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var output = "";
  var q = url.parse(req.url, true).query;
    var spawn = require('child_process').spawn;
    function shspawn(command) {
    spawn('sh', ['-c', command], { stdio: 'inherit' });
  }
  if (settings.get("vncpw") == "rand") var vncpw = randomValueHex(6);
  else if (settings.get("vncpw") == "none") var vncpw = "";
  else var vncpw = settings.get("vncpw");

  var cmd="qemu-img create -f qcow2 "+settings.get("datastore")+q.vname+".qcow2 "+q.hdd+"G";
  shspawn(cmd);
  var cmd="virt-install --connect "+settings.get("host")+" --name "+q.vname+" --ram "+q.ram+" --disk " + settings.get("datastore") + q.vname + ".qcow2,size="+q.hdd+" --accelerate --hvm --vcpus "+q.cpu+" --os-type "+ dists.get(q.dist)["osType"] +" --os-variant generic --network type=direct,source="+settings.get("mainnetworkif")+",model=virtio,mac="+q.mac+" --graphics vnc,port="+Math.round(Math.random() * (5999 - 5900) + 5900)+",password=" + vncpw + " --location " + dists.get(q.dist)["location"];
  shspawn(cmd);

  if (settings.get("showvncpw") == true) output += "<br>your vnc pw (please note this down!) : " + vncpw;
  output += '<br><br><a href="/list">return to list</a>';

  res.send(output);
});

module.exports = router;

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex')
        .slice(0,len);
}
