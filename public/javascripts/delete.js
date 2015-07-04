$(document).ready(function() {
  $('#delete-user').click(function () {
    var confirmation = window.confirm('Are you sure?  All quizzes and user information will be deleted?');
    console.log(confirmation);
    if (confirmation){
      $('#delete-user-form').submit();
    } else {
      event.preventDefault();
    }
  });
});
