var express = require('express');
var router = express.Router();
var db = require('./../connection');
var quizzes = db.get('quizzes');

/* GET home page. */
router.get('/', function(req, res, next) {
  quizzes.find({}, {}, function(err, docs){
    res.render('index', {quizzes: docs});    
  });
});

module.exports = router;
