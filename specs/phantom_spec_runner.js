var page = require('webpage').create();
var url = "http://localhost:8080/specs/index.html";

page.onConsoleMessage = function (msg) {
  var msg = JSON.parse(msg);

  if(msg.done){
    console.log("\n" + msg.totalCount + " specs total. All specs passed.");
    return phantom.exit(0);
  }
  if(msg.error){
    console.log("\nERROR: One or more specs are failing.\n");
    console.log("File: " + msg.error.id + "\n" + msg.error.url + "\n");
    console.log("Error: " + msg.error.message + "\n");
    return phantom.exit(1);
  }
};

page.open(url);
