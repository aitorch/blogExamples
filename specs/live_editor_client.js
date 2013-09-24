(function() {

  var host = window.location.protocol + '//' + window.location.host;
  var action= "/specs/liveeditor";

  $("form[data-js='tryit'").each(function(){
    toLiveEditor($(this));
  });

  function createIframe(src, $container){
    var $iframe = $('<iframe></iframe>').attr('src', src);
    $container.append($iframe);
    var iframe = window.frames[window.frames.length - 1];
    iframe.onerror = function(){
      $container.siblings('.errors').append(this.event.message);
    }
    return iframe;
  }

  function toLiveEditor($form){

    var editor = CodeMirror($form.find('.js')[0], {
      value: $form.find('.original').text(),
      theme: 'blackboard',
      viewportMargin: Infinity,
      lineNumbers: true
    });

    $form.find('.original').hide();

    $form.on('submit', function(){
      $.ajax({
        url: action,
        type: 'POST',
        data: {
          js: editor.getValue()
        }
      })
        .done(function(){
          var output = $form.find('.output').empty();
          var iframe = createIframe(action, output);
          $form.find('.result').css('display', 'inline-block');
        });

      return false;
    });

  }

})();
