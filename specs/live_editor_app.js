var fs = require('fs');
var express = require('express');
var path = require('path');
var app = express();
var templateFile = path.resolve(__dirname, 'template.html');

app.use(express.bodyParser());

// get a specific file from specsPath as an html document
app.get('/specs/examples/:filename.html', function(req, res){
  var fileName = req.params.filename;
  renderSpecIntoTemplate(fileName, '/specs/examples/' + fileName,
    function(err, html){
      if(err) {
        res.send(500, err);
        return;
      }
      res.set({ 'Content-Type': 'text/html' });
      res.send(html);
    });
});

function renderSpecIntoTemplate(fileName, filePath, callback){
  // read template file
  fs.readFile( templateFile, { encoding: 'utf-8' }, function(err, html){
    if (err) {
      callback('error trying to read file ' + templateFile);
      return;
    }
    callback(null,
             html.replace('TITLE', fileName).replace('FILEPATH', filePath));
  });
}

module.exports = app;
