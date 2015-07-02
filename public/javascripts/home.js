$(document).ready(function() {

  $('.quiz').on('click', 'button', function(){
    $(this).children().toggleClass('hidden');
    $(this).parents('.quiz').children('.info').children('.quizdesc').toggleClass('hidden');
  });

});
