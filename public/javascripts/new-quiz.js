$(document).ready(function() {
  //list out categories as the users add them showing the category with a delete button
  var questionArray = [];
  var questionField;
  var categoryArray = [];
  var categoryField;
  //add categories below the category field
  $('#add-category').click(function(){
    //check to make sure category doesn't already exist
    $('.error').remove();
    var check = 0;
    var existingCategories = document.getElementsByClassName('category-item');
    for (var i = 0; i < existingCategories.length; i++){
      if ($('#categories').val().toLowerCase() === existingCategories[i].textContent.toLowerCase()) {
        check = 1;
        break;
      }
    }
    //if it doesn't exist, add it to the list
    if (check === 0) {
      var newCat = document.createElement('div');
      var deleteButton = document.createElement('div');
      deleteButton.className = 'fa fa-times fa-2x delete';
      newCat.innerHTML = $('#categories').val();
      // categoryArray.push($('#categories').val());
      newCat.appendChild(deleteButton);
      newCat.className = 'col-md-12 category-item';
      $('#category-list').prepend(newCat);
      $('#categories').val('');
      //if it does exist, show an error message
    } else {
      var categoryError = document.createElement('div');
      categoryError.className = 'error';
      var catError = document.createElement('p');
      catError.innerHTML = 'Category already entered, please enter a different category';
      categoryError.appendChild(catError);
      $('h1').after(categoryError);
    }
  });
  //remove categories from the list on clicking the delete button
  $('#category-list').on('click', '.delete', function(cat){
    var text = this.parentNode.textContent;
    categoryArray = categoryArray.filter(function(e){
      return e != text;
    });
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
  //add questions below the question field
  $('#add-question').click(function(){

    $('.error').remove();
    var check = 0;
    var existingQuestions = document.getElementsByClassName('ques');
    for (var i = 0; i < existingQuestions.length; i++){
      var input = '';
      if ($('#question-type').val() === 'image-upload') {
        var input = $('#file-field').val();
      } else if ($('#question-type').val() === 'image-url') {
        var input = $('#url-field').val();
      } else if ($('#question-type').val() === 'plain-text') {
        var input = $('#text-field').val();
      }
      if (input.toLowerCase() === existingQuestions[i].textContent.toLowerCase()) {
        check = 1;
        break;
      }
    }
    //if it doesn't exist, add it to the list
    if (check === 0) {
      var newRow = document.createElement('div');
      var questionCol = document.createElement('div');
      var questionType = document.createElement('div');
      var answerCol = document.createElement('div');
      var deleteButton = document.createElement('div');
      deleteButton.className = 'fa fa-times fa-2x delete';
      newRow.className = 'row form-group block question-div';
      questionCol.className = 'col-md-6 ques';
      answerCol.className = 'col-md-6 answ';
      questionType.className = 'hidden ques-type';
      questionType.innerHTML = $('#question-type').val();
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
      newRow.appendChild(questionType);
      newRow.appendChild(questionCol);
      newRow.appendChild(answerCol);
      $('#question-list').prepend(newRow);
      $('#text-field').val('');
      $('#url-field').val('');
      $('#file-field').val('');
      $('#answer').val('');
    } else {
      var questionError = document.createElement('div');
      questionError.className = 'error';
      var quesError = document.createElement('p');
      quesError.innerHTML = 'That question already exists, please enter a new one';
      questionError.appendChild(quesError);
      $('h1').after(questionError);
    }
  });

  $('#question-list').on('click', '.delete', function(){
    var text = this.parentNode.parentNode.childNodes[0].textContent
    console.log(text);
    questionArray = questionArray.filter(function(e){
      return e.question != text;
    });
    this.parentNode.parentNode.remove();
  });
  //when the form is submitted, also create two new input fields and include the category and question arrays
  $('#submit').click(function(){

    $('.category-item').each(function(e){
      categoryArray.push(this.textContent);
    });
    console.log(categoryArray);

    $('.question-div').each(function(e){
      questionArray.push({
        'type': this.children[0].textContent,
        'question': this.children[1].textContent,
        'answer': this.children[2].textContent,
      });
    });
    console.log(questionArray);

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

    $('#new_quiz').append(categoryField);
    $('#new_quiz').append(questionField);
    $('#new_quiz').submit();
  });

});
