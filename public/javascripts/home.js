$(document).ready(function() {

  $('.quiz').on('click', 'button', function(){
    $(this).children().toggleClass('hidden');

  });
  // $('.score-button').on('click', 'button', function(){
  //   $(this).children().toggleClass('hidden');
  // });
});
