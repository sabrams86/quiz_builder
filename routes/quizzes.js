var express = require('express');
var router = express.Router();
var db = require('./../connection');
var quizzes = db.get('quizzes');

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
router.get('/quiz/new', function(req, res, next) {
  res.render('quizzes/new');
});

//************
//** CREATE **
//************
router.post('/quizzes', function(req, res, next) {
  quizzes.insert({name: req.body.name, categories: req.body.categories});
  res.redirect('/quizzes');
});

module.exports = router;
