var host = window.location.protocol + '//' + window.location.host;
var specListingURL = host + "/specs/examples";
var totalCount = 0;
var loadCount = 0;
var errorCount = 0;
var timeoutID;

$.get(specListingURL)
    .done(function(html){
      var filePaths = $(html).find('#files a')
                             .map(function(){ return $(this).attr('href'); })
                             .filter(function(){ return this.match(/\.js$/); });

      if(filePaths.length <= 0){
        updateErrorCount("Spec Listing", "No spec files found",
                         specListingURL);
      }
      else {
        updateTotalCount(filePaths.length);
        _.each(filePaths, runInFrame);
        resetTimeout();
      }
    })
    .fail(function(){
      updateErrorCount("Spec Listing", "Error while loading spec listing",
                       specListingURL);
    });

function runInFrame(filePath){
  var fileName = _.last(filePath.split('/'));
  var iframe = createIframe($('body'), {jsSrc: filePath});
  iframe.onload = checkIfLoadedCorrectly;
  iframe.onerror = _.partial(onSpecFail, fileName, filePath);
}

function createIframe($container, options){
  var $iframe = $('<iframe></iframe>').attr('src', '/specs/template.html')
                                      .hide();
  $container.append($iframe);

  var iframe = window.frames[window.frames.length - 1];

  $iframe.on('load', function(){
    $body = $iframe.contents().find('body');
    if(options && options.jsSrc){
      $script = $('<script></script>');
      $body.append($script);
      $script.attr('src', options.jsSrc);
    }

  });

  return iframe;
}

function onSpecFail(fileName, src){
  updateErrorCount(fileName, this.event.message, src);
  return false;
}

function resetTimeout(){
  if(timeoutID){ clearTimeout(timeoutID); }
  timeoutID = setTimeout(function(){ checkTestResults(); }, 1000);
}

function checkTestResults() {
  if(loadCount < totalCount){
    log('error', {
      id: 'Timeout',
      message: loadCount + " out of " + totalCount + " loaded"
    });
  }
  else if(errorCount <= 0){
    log('done');
  }
}

function updateTotalCount(total){
  totalCount = total;
  log('totalCount', totalCount);
}

function updateErrorCount(id, message, url){
  errorCount += 1;
  log('error', { id: id, message: message, url: url });
}

function checkIfLoadedCorrectly(evt){
  if($(evt.target).find('body').text().match(/^Cannot GET/)){
    // load failed
  }
  else {
    // load succeeded
    resetTimeout();
    updateLoadCount();
  }
}

function updateLoadCount(){
  loadCount += 1;
  log('loadCount', loadCount);
}

function log(type, data){
  switch(type){

    case 'totalCount':
      $('#totalCount').html(data);
      break;

    case 'loadCount':
      $('#loadCount').html(data);
      break;

    case 'done':
      console.log(JSON.stringify({ done: true, totalCount: totalCount }));
      $('#done').show();
      break;

    case 'error':
      console.log(JSON.stringify({ error: data }));
      var id;
      if(data.url){
        id = $('<a></a>').attr('href', data.url)
                     .attr('target', '_blank')
                     .html(data.id);
      } else {
        id = data.id
      }
      var dt = $('<dt>').append(id);
      var dd = $('<dd>').html(data.message);
      $('#failed').append(dt).append(dd).show();
      break;
  }

}
