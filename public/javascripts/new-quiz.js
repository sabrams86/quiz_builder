$(document).ready(function() {

  $('#add-category').click(function(){
    var newCat = document.createElement('div')
    newCat.innerHTML = $('#categories').val();
    $('#category-list').prepend(newCat);
  });

});
