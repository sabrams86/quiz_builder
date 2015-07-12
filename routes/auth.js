var express = require('express');
var router = express.Router();
var passport = require('passport');
var db = require('./../connection');
var users = db.get('users');
var quizzes = db.get('quizzes');
var bcrypt = require('bcryptjs');
var Validator = require('./../lib/validator');

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;
