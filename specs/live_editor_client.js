(function() {

  $("form[data-js='tryit'").each(function(){
    toLiveEditor($(this));
  });

  function toLiveEditor($form){

    var editor = CodeMirror($form.find('.js')[0], {
      value: $form.find('.original').text(),
      theme: 'blackboard',
      viewportMargin: Infinity,
      lineNumbers: true
    });

    $form.find('.original').hide();

    $form.on('submit', function(){
      var output = $form.find('.output').empty();
      createIframe(output, {js: editor.getValue()});
      $form.find('.result').css('display', 'inline-block');
      return false;
    });
  }

  function createIframe($container, options){
    var $iframe = $('<iframe></iframe>').attr('src', '/specs/template.html');
    $container.append($iframe);

    var iframe = window.frames[window.frames.length - 1];
    iframe.onerror = function(){
      $container.siblings('.errors').append(this.event.message);
    }

    $iframe.on('load', function(){
      $body = $iframe.contents().find('body');
      if(options && options.js){
        $script = $('<script></script>');
        $body.append($script);
        $script.html(options.js);
      }
    });

    return $iframe;
  }

})();
