var fs = require('fs');
var express = require('express');
var path = require('path');
var app = express();
var templateFile = path.resolve(__dirname, 'template.html');

app.use(express.bodyParser());

function renderSpecIntoTemplate(options, callback){
  options || (options = {});
  // read template file
  fs.readFile( templateFile, { encoding: 'utf-8' }, function(err, html){
    if (err) {
      callback('error trying to read file ' + templateFile);
      return;
    }
    if(options.content){
      callback(null, html.replace('TITLE', options.fileName)
                         .replace('SRC', '')
                         .replace('CONTENT', options.content));
    } else if(options.src){
      callback(null, html.replace('TITLE', options.fileName)
                         .replace('SRC', 'src="'+ options.src + '"')
                         .replace('CONTENT', ''));
    } else {
      callback("you must provied either options.src or options.content");
    }
  });
}

// get a specific file from specsPath as an html document
app.get('/specs/examples/:filename.html', function(req, res){
  var fileName = req.params.filename;
  renderSpecIntoTemplate(
    { fileName: fileName, src: '/specs/examples/' + fileName },
    function(err, html){
      if(err) {
        res.send(500, err);
        return;
      }
      res.set({ 'Content-Type': 'text/html' });
      res.send(html);
    });
});

/*--- LiveEditor ---*/

var html = '';
var js = '';

app.post('/specs/liveeditor', function(req,res){
  html = req.body.html;
  js = req.body.js;
  res.end();
});

app.get('/specs/liveeditor', function(req, res){

  renderSpecIntoTemplate(
    {fileName: 'Live Editor', content: js},
    function(err, html){
      if(err) {
        res.send(500, err);
        return;
      }
      res.set({ 'Content-Type': 'text/html' });
      res.send(html);
    }
  );

});

module.exports = app;
