var express = require('express');
var router = express.Router();
var db = require('./../connection');
var quizzes = db.get('quizzes');
var users = db.get('users');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.flash('test'));
  var userId = req.session.user_id;
  var categories = req.query.categorysearch;
  var userEmail = req.query.usersearch;
  var searchParams;
  if (userEmail && categories) {
    users.find({email: userEmail}, {}, function(err, userDocs){
      if(userDocs > 0){
        searchParams = {$and: [{user_id: String(userDocs[0]._id)}, {categories : categories.toLowerCase()}]};
        quizzes.find(searchParams, {}, function(err, docs){
          res.render('index', {quizzes: docs, user_id: userId});
        });
      } else {
        searchParams = {name: 'asdf'};
        quizzes.find(searchParams, {}, function(err, docs){
          res.render('index', {quizzes: docs, user_id: userId, message: 'No Results Found'});
        });
      }
    });
  }
  else if (categories){
    searchParams = {categories : categories.toLowerCase()};
    quizzes.find(searchParams, {}, function(err, docs){
      res.render('index', {quizzes: docs, user_id: userId});
    });
  } else if (userEmail) {
    users.find({email: userEmail}, {}, function(err, userDocs){
      if (userDocs.length > 0) {
        searchParams = {user_id: String(userDocs[0]._id)};
        quizzes.find(searchParams, {}, function(err, docs){
          res.render('index', {quizzes: docs, user_id: userId});
        });
      } else {
        searchParams = {name: 'asdf'};
        quizzes.find(searchParams, {}, function(err, docs){
          res.render('index', {quizzes: docs, user_id: userId, message: 'No Results Found'});
        });
      }
    });
  } else {
    searchParams = {};
    quizzes.find(searchParams, {}, function(err, docs){
      res.render('index', {quizzes: docs, user_id: userId, messages: req.flash('info')});
    });
  }

});

module.exports = router;
