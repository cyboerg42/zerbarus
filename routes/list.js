var express = require('express');
var router = express.Router();
var url = require('url');
var settings = require('../modules/settings.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var output = "";
  output += '<style>table, th, td {border: 1px solid black;border-collapse: collapse;}th, td {padding: 5px;}th {text-align: left;}</style>';
  var result = require('child_process').execSync("virsh -c "+settings.get("host")+" list --all").toString();
  var stdout = result.replace(/-/gi,'');
      var artmp = stdout.split(" ");
      var tmp = "";
      var skip = 3;
      var i = 0;
      artmp.forEach(function(entry) {
        if (entry != "") {
	i++;
	if (i > skip) {
          tmp = tmp + "," + entry;
	}
	}
      });
     var work = tmp.substring(1, tmp.length-1).replace(/\n/gi,'').split(",");
     var online = "";
     var offline = "";

     for (var i = 0; i < work.length; i++) {
     if (work[i+1] == "shut" && work[i+2] == "off") {
	offline = offline + "," + work[i];
        i++;i++;
     } else if (work[i+2] == "running") {
	online = online + "," + work[i] + "," + work[i+1];
        i++;i++;
     }
     }
     output += "<h3><br>ONLINE<br></h3>";
     output += '<table style="width:100%"><tr><th>id</th><th>name</th><th>nat ip</th><th></th></tr>';
     var on = online.split(",");
     for (var i = 0; i < on.length; i++) {
       if(on[i] != ""){
       output += '<tr><td>' + on[i] + '</td><td>' + on[i+1] + '</td><td id="ip_'+on[i+1]+'">';
       output += '</td><td><a href="/stop?vname=' + on[i+1] + '">stop</a> <a href="/reset?vname=' + on[i+1] + '">kill</a> <a href="/reboot?vname=' + on[i+1] + '">reboot</a> <a href="/info?vname=' + on[i+1] + '">info</a> <a href="/vnc?vname=' + on[i+1] + '">start vnc</a> <a href="/vnc?vname=' + on[i+1] + '&stop=1">stop vnc</a> <a href="/snapshot?vname=' + on[i+1] + '">snapshotctl</a></td></tr>';
       output += '<script>var xhr'+on[i+1]+' = new XMLHttpRequest();xhr'+on[i+1]+'.open("GET", "//" + window.location.host + "/netinfo?vname='+on[i+1]+'", true);xhr'+on[i+1]+'.send();xhr'+on[i+1]+'.onreadystatechange = processRequest;function processRequest(e){if(xhr'+on[i+1]+'.readyState == 4 && xhr'+on[i+1]+'.status == 200){document.getElementById("ip_' + on[i+1] +'").innerHTML=xhr'+on[i+1]+'.responseText;}}</script>';
       i++;
       }
     }
     output += '</table>';
     output += "<h3><br>OFFLINE<br></h3>";
     output += '<table style="width:100%"><tr><th>id</th><th>name</th><th></th></tr>';
     var off = offline.split(",");
     for (var i = 0; i < off.length; i++) {
       if(off[i] != "") {
       output += '<tr><td>-</td><td>' + off[i] + '</td><td><a href="/start?vname=' + off[i] + '">start</a> <a href="/delete?vname=' + off[i] + '">delete</a> <a href="/snapshot?vname=' + off[i] + '">snapshotctl</a></td></tr>';
       }
     }
     output += "</table>";
     output += "<br>";

     res.render('list', { title: 'VMstat', input: output });
});

module.exports = router;
