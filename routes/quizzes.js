var express = require('express');
var router = express.Router();
var db = require('./../connection');
var quizzes = db.get('quizzes');
var Validator = require('./../lib/validator');

//*********
//**INDEX**
//*********
router.get('/quizzes', function(req, res, next) {
  quizzes.find({}, {}, function(err, docs){
    res.render('quizzes', {quizzes: docs});
  });
});

//*********
//** NEW **
//*********
router.get('/quizzes/new', function(req, res, next) {
  res.render('quizzes/new');
});

//************
//** CREATE **
//************
router.post('/quizzes', function(req, res, next) {
  var catArray = req.body.allcatagories.split('|');
  var questionArray = req.body.allquestions.split('|');
  var validate = new Validator;
  validate.exists(req.body.name, 'Please enter a quiz name');
  validate.exists(questionArray, 'You can\'t make a quiz without questions');
  validate.exists(catArray, 'Please enter a Category');
  validate.minLength(questionArray, 5, 'You need at least 5 questions to make a quiz');
  if (validate._errors.length === 0){
    questionArray = questionArray.map(function(e){
      return JSON.parse(e);
    });
    quizzes.insert({name: req.body.name, categories: catArray, questions: questionArray}, function(err, doc){
      res.redirect('/quizzes/'+doc._id);
    });
  } else {
    res.render('quizzes/new', {errors: validate._errors} )
  }
});

//*********
//**SHOW **
//*********
router.get('/quizzes/:id', function(req, res, next) {
  quizzes.findOne({_id : req.params.id}, {}, function(err, doc){
    res.render('quizzes/show', {quiz: doc});
  });
});

//************
//** EDIT   **
//************
router.get('/quizzes/:id/edit', function(req, res, next) {
  quizzes.findOne({_id : req.params.id}, {}, function(err, doc){
    res.render('quizzes/edit', {quiz: doc});
  });
});

//************
//** UPDATE **
//************
router.post('/quizzes/:id', function(req, res, next) {
  var catArray = req.body.allcatagories.split('|');
  var questionArray = req.body.allquestions.split('|');
  questionArray = questionArray.map(function(e){
    return JSON.parse(e);
  });
  quizzes.update({_id: req.params.id}, {$set: {name: req.body.name, categories: catArray, questions: questionArray}});
  res.redirect('/quizzes/'+doc._id);
});

//************
//** DELETE **
//************
router.post('/quizzes/:id/delete', function(req, res, next) {
  quizzes.remove({_id: req.params.id});
  res.redirect('/quizzes');
});

//************
//** PLAY   **
//************
router.get('/quizzes/:id/play', function(req, res, next) {
  quizzes.findOne({_id : req.params.id}, {}, function(err, doc){
    res.render('quizzes/play', {quiz: doc});
  });
});


/*
quiz document structure:

{
name: 'super quiz',
categories: ['games', 'jquery', 'gschool'];
questions: [
            {
            type: 'url';
            image-url: 'asdf.com'
            answer: 'stuff'
          },
          {
            type: 'text';
            question: 'stuff about stuff?'
            answer: 'stuff'
          }
        ],

}

*/


module.exports = router;
