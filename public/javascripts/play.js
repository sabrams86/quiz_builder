$(document).ready(function() {
  //set up a variable to generate the form needed for each question
  var form = '<div class="form">\
    <form action="#" method="get">\
      <p><input type="text" name="guess" class="guess" autofocus></p> \
      <input type="submit" name="submit" value="Submit" class="btn btn-sml btn-primary try">\
    </form></div>';
  // set a variable to the html needed to generate a form that will reload the page when the user wants to play again
  var playAgain = '<form action="index.html" method="get"><input class="retry" type="submit" name="again" value="Play Again!"></form>';
  //create variables for the timer display
  var centiseconds = 0, seconds = 0, minutes = 0;
  var t;
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
  //add time to the timer
  var add = function() {
      centiseconds++;
      if (centiseconds >= 100) {
          centiseconds = 0;
          seconds++;
          if (seconds >= 60) {
              seconds = 0;
              minutes++;
          }
      }
      $('.timer').html((minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00") + ":" + (centiseconds > 9 ? centiseconds : "0" + centiseconds));
      timer();
  }
  //sets up the timer to run every 100th of a second.
  var timer = function() {
      t = setTimeout(add, 10);
  }
//*********************************************
//**   Start the game when user clicks start **
//*********************************************
  $('#start').click(function(){
    var penalty = 0;
    timer();
    event.preventDefault();
    var quizId = getId();
    var xhr = new XMLHttpRequest;
    //get the current quiz data
    xhr.open('get', '/quizzes/'+quizId, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.addEventListener('load', function(){
      var quizData = JSON.parse(xhr.response);
      if (quizData.time_penalties_enabled){
        var penaltyBump = Number(quizData.time_penalty);
      } else {
        var penaltyBump = 0;
      }
      if (quizData.answer_penalties_enabled){
        penaltyBump += Number(quizData.time_penalty);
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
        var winner = '<h3 class="game-message">Nice Work!</h3>';
        var loser = '<h3 class="game-message">Sorry, that was actually '+answer+'</h3>';
        var scoreBoard = '<h4 class="score">Score: '+score+' / '+maxScore+'</h4>';
        var userGuess = $('.guess').val().toLowerCase();
        //if there are still questions, evaluate and continue
        if (questions.length > 0) {
          //if user is correct
          if (userGuess === answer.toLowerCase()) {
            score += 1;
            scoreBoard = '<h4 class="score">Points: '+score+' / '+maxScore+'</h4>';
            $('.game-message').remove();
            $('.score').remove();
            $('.question-area').prepend(winner);
            $('.question-area').append(scoreBoard);
            //if user is wrong
          } else {
            penalty += penaltyBump;
            $('.game-message').remove();
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
          clearTimeout(t);
          var totalTime = $('.timer')[0].textContent;
          $('.question-area').append('<h3>Your total time: '+totalTime+' Seconds');
          if (userGuess === answer.toLowerCase()) {
            score += 1;
            var totalScore = minutes * 60 + seconds + penalty;
            $('.question-area').append('<h3>Your Time (with penalties): '+ totalScore);
            $('.score').remove();
            $('.question-area').prepend(winner);
          } else {
            penalty += penaltyBump;
            var totalScore = minutes * 60 + seconds + penalty;
            $('.question-area').append('<h3>Your Time (with penalties): '+ totalScore);
            $('.score').remove();
            $('.question-area').prepend(loser);
            $('.question-area').append(scoreBoard);
          }
          var playAgain = '<form action="'+document.location.pathname+'" method="get"><input class="retry btn btn-primary" type="submit" name="again" value="Play Again!"></form>';
          var home = '<form action="/" method="get"><input class="btn btn-success" type="submit" name="home" value="Return to Main Page"></form>';
          $('.question').html('GAME OVER');
          $('.game-message').remove();
          $('.form').remove();
          $('.answer-area').append(playAgain);
          $('.answer-area').append(home);
          var data = {"score": totalScore};
          var scoreXhr = new XMLHttpRequest;
          scoreXhr.open('post', '/quizzes/'+quizId+'/score', true);
          scoreXhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          scoreXhr.send(JSON.stringify(data));
        }
      });

    });
    xhr.send();
  });
});
