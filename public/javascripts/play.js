$(document).ready(function() {
  //returns the quiz id that is listed in the url
  var getId = function(){
    var path = document.location.pathname;
    var array = path.split('/');
    return array[array.length-2];
  }
  //shuffles an array
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  //set up a variable to generate the form needed for each question
  var form = '<div class="form">\
    <form action="#" method="get">\
      <p><input type="text" name="guess" class="guess" autofocus></p> \
      <input type="submit" name="submit" value="Submit" class="btn btn-sml btn-primary try">\
    </form></div>';
  // set a variable to the html needed to generate a form that will reload the page when the user wants to play again
  var playAgain = '<form action="index.html" method="get"><input class="retry" type="submit" name="again" value="Play Again!"></form>';
//*********************************************
//**   Start the game when user clicks start **
//*********************************************
  $('#start').click(function(){
    var penalty = 0;
    var startTime = new Date();
    event.preventDefault();
    var quizId = getId();
    var xhr = new XMLHttpRequest;
    //get the current quiz data
    xhr.open('get', '/quizzes/'+quizId);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.addEventListener('load', function(){
      var quizData = JSON.parse(xhr.response);
      if (quizData.time_penalties_enabled){
        var penaltyBump = Number(quizData.time_penalty);
      } else {
        var penaltyBump = 0;
      }
      var score = 0;
      var maxScore = quizData.questions.length;
      //shuffle array of questions
      var questions = shuffleArray(quizData.questions);
      //set the current question and answer as the last question in the shuffled array
      var question = questions[questions.length-1];
      if (question.type === 'plain-text') {
        question = questions[questions.length-1].question;
      } else if (question.type === 'image-url') {
        question = '<img class="quiz-thumbnail" src='+questions[questions.length-1].question+' alt="loading error">';
      } else {
        question = questions[questions.length-1].question;
      }
      var answer = questions[questions.length-1].answer;
      //remove the start button and show the first question and answer form
      $('#start').remove();
      $('.question').html(question);
      $('.answer-area').html(form);
      //remove the current question from the questions array
      questions.pop();

      //evaluate answer when submit button is clicked
      $(document).on('click', '.try', function(){
        event.preventDefault();
        var winner = '<h3 class="message">Nice Work!</h3>';
        var loser = '<h3 class="message">Sorry, that was actually '+answer+'</h3>';
        var scoreBoard = '<h4 class="score">Score: '+score+' / '+maxScore+'</h4>';
        var userGuess = $('.guess').val().toLowerCase();
        //if there are still questions, evaluate and continue
        if (questions.length > 0) {
          //if user is correct
          if (userGuess === answer.toLowerCase()) {
            score += 1;
            scoreBoard = '<h4 class="score">Score: '+score+' / '+maxScore+'</h4>';
            $('.message').remove();
            $('.score').remove();
            $('.question-area').prepend(winner);
            $('.question-area').append(scoreBoard);
            //if user is wrong
          } else {
            penalty += penaltyBump;
            $('.message').remove();
            $('.score').remove();
            $('.question-area').prepend(loser);
            $('.question-area').append(scoreBoard);
          }
          question = questions[questions.length-1];
          if (question.type === 'plain-text') {
            question = questions[questions.length-1].question;
          } else if (question.type === 'image-url') {
            question = '<img class="quiz-thumbnail" src='+questions[questions.length-1].question+' alt="loading error">';
          } else {
            question = questions[questions.length-1].question;
          }
          answer = questions[questions.length-1].answer;
          questions.pop();
          $('.question').html('');
          $('.question').html(question);
          $('.form').remove();
          $('.answer-area').append(form);
          $('.guess').focus();
          //if there are no more questions, evaluate and show end of game screen
        } else {
          var endTime = new Date();
          var totalTime = (endTime.getTime() - startTime.getTime())/1000;
          $('.question-area').append('<h3>Your total time: '+Number(totalTime.toFixed(2))+' Seconds');

          if (userGuess === answer.toLowerCase()) {
            score += 1;
            scoreBoard = '<h4 class="score">Score: '+score+' / '+maxScore+'</h4>';
            $('.score').remove();
            $('.question-area').prepend(winner);
            $('.question-area').append(scoreBoard);
          } else {
            penalty += penaltyBump;
            $('.question-area').append('<h3>Your time (with penalties): '+(Number(penalty)+Number(totalTime.toFixed(2)))+' Seconds')
            $('.score').remove();
            $('.question-area').prepend(loser);
            $('.question-area').append(scoreBoard);
          }
          var playAgain = '<form action="'+document.location.pathname+'" method="get"><input class="retry btn btn-primary" type="submit" name="again" value="Play Again!"></form>';
          var home = '<form action="/" method="get"><input class="btn btn-success" type="submit" name="home" value="Return to Main Page"></form>';
          $('.question').html('GAME OVER');
          $('.message').remove();
          $('.form').remove();
          $('.answer-area').append(playAgain);
          $('.answer-area').append(home);
        }
      });

    });
    xhr.send();
  });
});
