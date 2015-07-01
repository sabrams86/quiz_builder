var express = require('express');
var router = express.Router();
var db = require('./../connection');
var quizzes = db.get('quizzes');

/* GET home page. */
router.get('/', function(req, res, next) {
  var userId = req.cookies.user_id;
  var categories = req.query.categorysearch;
  var users = req.query.usersearch;
  var searchParams;
  if (categories){
    searchParams = {categories : categories.toLowerCase()};
    if (users) {
      searchParams = {categories: categories, email: users};
    }
  } else if (users) {
    searchParams = {email: users};
  } else {
    searchParams = {};
  }
  quizzes.find(searchParams, {}, function(err, docs){
    res.render('index', {quizzes: docs, user_id: userId});
  });
});

module.exports = router;
