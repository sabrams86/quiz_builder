var express = require('express');
var router = express.Router();
var db = require('./../connection');
var quizzes = db.get('quizzes');
var users = db.get('users');
var Validator = require('./../lib/validator');
var questionParser = require('./../lib/question_parser');

//************
//** PLAY   **
//************
router.get('/quizzes/:id/play', function(req, res, next) {
  quizzes.findOne({_id : req.params.id}, {}, function(err, doc){
    res.render('quizzes/play', {name: doc.name, description: doc.description, time_penalty_enabled: doc.time_penalties_enable, time_penalty: req.body.time_penalty, answer_penalty_enabled: doc.answer_penalties_enable, answer_penalty: req.body.answer_penalty, categories: doc.categories, questions: doc.questions});
  });
});
//***********
//** SCORE **
//***********
router.post('/quizzes/:id/score', function(req, res, next){
  var userId = req.cookies.user_id
  if (userId){
    users.findOne({_id: userId}, {}, function (err, doc) {
      quizzes.update({_id : req.params.id}, {$push :
        {scores:
          { $each: [{initials: doc.initials, score: req.body.score}],
            $sort: {score: 1}
          }
        }
      }
    );
    });
  }
  res.send('ok');
})
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
      res.render('quizzes', {quizzes: docs, user_id: userId, messages: req.flash('info')});
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
  console.log(req.files);
  var catArray = req.body.allcatagories.split('|');
  var questionArray = JSON.parse(req.body.allquestions);
  var userId = req.cookies.user_id;
  var validate = new Validator;
  if (req.body.multi_upload) {
    parsedCSV = questionParser.processCSV(req.body.multi_upload);
    validate.lengthOfSubArray(parsedCSV, 3, "You have too many or too little elements in one of your CSV lines, please fix and resubmit");
    validate.uniqueCSVQuestions(parsedCSV, "You cannot have duplicate questions, please modify your CSV and resubmit");
    validate.uploadType(parsedCSV, "You must have 'image-url' or 'plain-text' as the first item in each row of your CSV, please fix and resubmit")
    questionArray = questionParser.arrayToQuestionObject(parsedCSV);
    validate.questionObjects(questionArray, "Your CSV format is not valid, please check for extra commas or missing elements");
    if (validate._errors.length > 0){
      questionArray = [];
    } else {
      validate.minLength(questionArray, 5, 'You need at least 5 questions to make a quiz');
      if (validate._errors.length > 0){
        questionArray = [];
      }
    }
  } else {
    validate.exists(questionArray, 'You can\'t make a quiz without questions');
    validate.minLength(questionArray, 5, 'You need at least 5 questions to make a quiz');
  }
  validate.exists(req.body.name, 'Please enter a quiz name');
  validate.exists(req.body.description, 'Please enter a description for your quiz')
  validate.exists(catArray, 'Please enter a Category');
  if (validate._errors.length === 0){
    quizzes.insert({name: req.body.name, description: req.body.description, time_penalties_enabled: req.body.time_penalty_enable, time_penalty: req.body.time_penalty, answer_penalties_enabled: req.body.answer_penalty_enable, answer_penalty: req.body.answer_penalty, user_id: userId, categories: catArray, questions: questionArray}, function(err, doc){
      req.flash('info', 'Quiz successfully created')
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
  var userToken = req.cookies.user_id;
  quizzes.findOne({_id : req.params.id}, {}, function(err, doc){
    var is_ajax_request = req.xhr;
    if (is_ajax_request) {
      res.json(doc);
    } else {
      res.render('quizzes/show', {quiz: doc, messages: req.flash('info')});
    }
  });
});

//************
//** EDIT   **
//************
router.get('/quizzes/:id/edit', function(req, res, next) {
  var userToken = req.cookies.user_id;
  quizzes.findOne({_id : req.params.id}, {}, function(err, doc){
    if (userToken != doc.user_id){
      req.flash('info', 'You do not have access to that page');
      res.redirect('/');
    } else {
      if (userToken != doc.user_id){
        req.flash('info', 'You do not have access to that page');
        res.redirect('/');
      } else {
        res.render('quizzes/edit', {quiz: doc, name: doc.name, description: doc.description, time_penalty_enable: doc.time_penalties_enabled, time_penalty: doc.time_penalty, answer_penalty_enabled: doc.answer_penalties_enable, answer_penalty: req.body.answer_penalty, categories: doc.categories, questions: doc.questions});
      }
    }
  });
});

//************
//** UPDATE **
//************
router.post('/quizzes/:id', function(req, res, next) {
  console.log(req.files);
  
  var userToken = req.cookies.user_id;
  quizzes.findOne({_id: req.params.id}, function(err, doc){
    if (userToken != doc.user_id){
      req.flash('info', 'You do not have access to that page');
      res.redirect('/');
    } else {
      var catArray = req.body.allcatagories.split('|');
      var questionArray = JSON.parse(req.body.allquestions);
      var validate = new Validator;
      if (req.body.multi_upload) {
        parsedCSV = questionParser.processCSV(req.body.multi_upload);
        validate.lengthOfSubArray(parsedCSV, 3, "You have too many or too little elements in one of your CSV lines, please fix and resubmit");
        validate.uniqueCSVQuestions(parsedCSV, "You cannot have duplicate questions, please modify your CSV and resubmit");
        validate.uploadType(parsedCSV, "You must have 'image-url' or 'plain-text' as the first item in each row of your CSV, please fix and resubmit")
        questionArray = questionParser.arrayToQuestionObject(parsedCSV);
        validate.questionObjects(questionArray, "Your CSV format is not valid, please check for extra commas or missing elements");
        if (validate._errors.length > 0){
          questionArray = [];
        } else {
          validate.minLength(questionArray, 5, 'You need at least 5 questions to make a quiz');
          if (validate._errors.length > 0){
            questionArray = [];
          }
        }
      } else {
        validate.exists(questionArray, 'You can\'t make a quiz without questions');
        validate.minLength(questionArray, 5, 'You need at least 5 questions to make a quiz');
      }
      validate.exists(req.body.name, 'Please enter a quiz name');
      validate.exists(req.body.description, 'Please enter a description for your quiz')
      validate.exists(catArray, 'Please enter a Category');
      if (validate._errors.length === 0){
        quizzes.update({_id: req.params.id}, {$set: {name: req.body.name, description: req.body.description, time_penalties_enabled: req.body.time_penalty_enable, time_penalty: req.body.time_penalty,  answer_penalties_enabled: req.body.answer_penalty_enable, answer_penalty: req.body.answer_penalty,categories: catArray, questions: questionArray}});
        req.flash('info', 'Quiz successfully updated');
        res.redirect('/quizzes/'+req.params.id);
      } else {
        res.render('quizzes/new', {errors: validate._errors, name: req.body.name, description: req.body.description, time_penalties_enabled: req.body.time_penalty_enable, time_penalty: req.body.time_penalty,  answer_penalties_enabled: req.body.answer_penalty_enable, answer_penalty: req.body.answer_penalty, multi_upload: req.body.multi_upload, categories: catArray, questions: questionArray} )
      }
    }
  });
});

//************
//** DELETE **
//************
router.post('/quizzes/:id/delete', function(req, res, next) {
  var userToken = req.cookies.user_id;
  quizzes.findOne({_id: req.params.id}, function(err, doc){
    if (userToken != doc.user_id){
      req.flash('info', 'You do not have access to that page');
      res.redirect('/');
    } else {
      quizzes.remove({_id: req.params.id});
      req.flash('info', 'Quiz successfully deleted');
      res.redirect('/quizzes');
    }
  });
});


/*
quiz document structure:

{
name: 'super quiz',
description: 'asdf',
user_id: 'asdfaewfg3',
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
