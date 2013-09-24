var result = JSCalc.substract(4,3);

$(document).ready(function(){

  $('body').html(result);
  result.should.equal(2);

});
