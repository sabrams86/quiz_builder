$(document).ready(function() {
  //list out categories as the users add them showing the category with a delete button
  var questionArray = [];
  var questionField;
  var categoryArray = [];
  var categoryField;

  $('#add-category').click(function(){
    var newCat = document.createElement('div');
    var deleteButton = document.createElement('div');
    deleteButton.className = 'fa fa-times fa-2x delete';
    newCat.innerHTML = $('#categories').val();
    categoryArray.push($('#categories').val());
    newCat.appendChild(deleteButton);
    newCat.className = 'col-md-12 category-item';
    $('#category-list').prepend(newCat);
    $('#categories').val('');
  });
  //remove categories from the list on clicking the delete button
  $('#category-list').on('click', '.delete', function(cat){
    var text = this.parentNode.textContent;
    categoryArray = categoryArray.filter(function(e){
      return e != text;
    });
    console.log(categoryArray);
    this.parentNode.remove();
  });
  //update the form field for questions based on the select element value
  $('#question-type').change(function(){
    if ($(this).val() === 'image-upload') {
      $('#url-field').addClass('hidden');
      $('#file-field').removeClass('hidden');
      $('#text-field').addClass('hidden');
    } else if ($(this).val() === 'image-url') {
      $('#url-field').removeClass('hidden');
      $('#file-field').addClass('hidden');
      $('#text-field').addClass('hidden');
    } else if ($(this).val() === 'plain-text') {
      $('#url-field').addClass('hidden');
      $('#file-field').addClass('hidden');
      $('#text-field').removeClass('hidden');
    }
  });

  $('#add-question').click(function(){
    var newRow = document.createElement('div');
    var questionCol = document.createElement('div');
    var answerCol = document.createElement('div');
    var deleteButton = document.createElement('div');
    deleteButton.className = 'fa fa-times fa-2x delete';
    newRow.className = 'row form-group';
    questionCol.className = 'col-md-6';
    answerCol.className = 'col-md-6';
    if ($('#question-type').val() === 'image-upload') {
      var questionVal = $('#file-field').val();
    } else if ($('#question-type').val() === 'image-url') {
      var questionVal = $('#url-field').val();
    } else if ($('#question-type').val() === 'plain-text') {
      var questionVal = $('#text-field').val();
    }
    questionCol.innerHTML = questionVal;
    answerCol.innerHTML = $('#answer').val();
    answerCol.appendChild(deleteButton);
    newRow.appendChild(questionCol);
    newRow.appendChild(answerCol);
    $('#question-list').prepend(newRow);

    questionArray.push({
      'type': $('#question-type').val(),
      'question': questionVal,
      'answer': $('#answer').val(),
    });
    console.log(questionArray);
  });

  $('#question-list').on('click', '.delete', function(){
    this.parentNode.parentNode.remove();
  });

  $('#submit').click(function(){
    categoryField = document.createElement('input');
    categoryField.type = 'text';
    categoryField.name = 'allcatagories';
    categoryField.value = categoryArray.join('|');

    questionField = document.createElement('input');
    questionField.type = 'text';
    questionField.name = 'allquestions';
    questionField.value = questionArray.map(function(e){
      return JSON.stringify(e);
    }).join('|');
    console.log(questionField.value);

    $('#new_quiz').append(categoryField);
    $('#new_quiz').append(questionField);
    $('#new_quiz').submit();
  });

});
