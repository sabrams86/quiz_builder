var express = require('express');
var router = express.Router();
var db = require('./../connection');
var quizzes = db.get('quizzes');
var Validator = require('./../lib/validator');
var questionParser = require('./../lib/question_parser');

//*********
//**INDEX**
//*********
router.get('/quizzes', function(req, res, next) {
  userId = req.cookies.user_id;
  quizzes.find({user_id: userId}, {}, function(err, docs){
    var is_ajax_request = req.xhr;
    if (is_ajax_request) {
      res.json(docs);
    } else {
      res.render('quizzes', {quizzes: docs});
    }
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
  var questionArray = JSON.parse(req.body.allquestions);
  var userId = req.cookies.user_id;
  var validate = new Validator;
  if (req.body.multi_upload) {
    questionArray = questionParser.processCSV(req.body.multi_upload);
    validate.questionObjects(questionArray, "Your CSV format is not valid, please check to make sure you are not missing any elements");
    if (validate._errors.length > 0){
      questionArray = [];
    }
  }
  validate.exists(req.body.name, 'Please enter a quiz name');
  validate.exists(req.body.description, 'Please enter a description for your quiz')
  validate.exists(questionArray, 'You can\'t make a quiz without questions');
  validate.exists(catArray, 'Please enter a Category');
  validate.minLength(questionArray, 5, 'You need at least 5 questions to make a quiz');
  if (validate._errors.length === 0){
    quizzes.insert({name: req.body.name, description: req.body.description, time_penalties_enabled: req.body.time_penalty_enable, time_penalty: req.body.time_penalty, answer_penalties_enabled: req.body.answer_penalty_enable, answer_penalty: req.body.answer_penalty, user_id: userId, categories: catArray, questions: questionArray}, function(err, doc){
      res.redirect('/quizzes/'+doc._id);
    });
  } else {
    res.render('quizzes/new', {errors: validate._errors, name: req.body.name, description: req.body.description, time_penalties_enabled: req.body.time_penalty_enable, time_penalty: req.body.time_penalty,  answer_penalties_enabled: req.body.answer_penalty_enable, answer_penalty: req.body.answer_penalty, multi_upload: req.body.multi_upload, categories: catArray, questions: questionArray} )
  }
});

//*********
//**SHOW **
//*********
router.get('/quizzes/:id', function(req, res, next) {
  quizzes.findOne({_id : req.params.id}, {}, function(err, doc){
    var is_ajax_request = req.xhr;
    if (is_ajax_request) {
      res.json(doc);
    } else {
      res.render('quizzes/show', {quiz: doc});
    }
  });
});

//************
//** EDIT   **
//************
router.get('/quizzes/:id/edit', function(req, res, next) {
  quizzes.findOne({_id : req.params.id}, {}, function(err, doc){
    res.render('quizzes/edit', {quiz: doc, name: doc.name, description: doc.description, time_penalty_enable: doc.time_penalties_enabled, time_penalty: doc.time_penalty, answer_penalty_enabled: doc.answer_penalties_enable, answer_penalty: req.body.answer_penalty, categories: doc.categories, questions: doc.questions});
  });
});

//************
//** UPDATE **
//************
router.post('/quizzes/:id', function(req, res, next) {
  var catArray = req.body.allcatagories.split('|');
  var questionArray = JSON.parse(req.body.allquestions);
  quizzes.update({_id: req.params.id}, {$set: {name: req.body.name, description: req.body.description, time_penalties_enabled: req.body.time_penalty_enable, time_penalty: req.body.time_penalty,  answer_penalties_enabled: req.body.answer_penalty_enable, answer_penalty: req.body.answer_penalty,categories: catArray, questions: questionArray}});
  res.redirect('/quizzes/'+req.params.id);
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
    res.render('quizzes/play', {name: doc.name, description: doc.description, time_penalty_enabled: doc.time_penalties_enable, time_penalty: req.body.time_penalty, answer_penalty_enabled: doc.answer_penalties_enable, answer_penalty: req.body.answer_penalty, categories: doc.categories, questions: doc.questions});
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
high_scores: [
        {
         user_id: joe,
         score: 1222
        },
        {
         user_id: steve,
         score: 1151
        },
        {
         user_id: bob,
         score: 1231
        }
      ]
}

*/


module.exports = router;
