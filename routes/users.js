var express = require('express');
var router = express.Router();
var db = require('./../connection');
var users = db.get('users');
var bcrypt = require('bcryptjs');
var Validator = require('./../lib/validator');
//INDEX
router.get('/users', function(req, res, next) {
  users.find({},{},function(err, docs){
    res.render('users/index');
  });
});

//Login
router.post('/users/login', function(req, res, next) {
  users.findOne({email: req.body.email}, {}, function(err, doc){
    if(doc && bcrypt.compareSync(req.body.password, doc.password)){
      res.cookie('user_id', doc._id);
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  });
});

//LOGOUT
router.get('/users/logout', function(req, res, next) {
  res.clearCookie('user_id');
  res.redirect('/');
});

//NEW
router.get('/users/new', function(req, res, next) {
  res.render('users/new');
});

//SHOW
router.get('/users/:id', function(req, res, next){
  users.findOne({_id: req.params.id}, function(err, doc){
    res.render('users/show', {user: doc});
  });
});

//EDIT
router.get('/users/:id/edit', function(req, res, next){
  users.findOne({_id: req.params.id}, function(err, doc){
    res.render('users/edit', {user: doc});
  });
});

//CREATE
router.post('/users', function(req, res, next){
  var validate = new Validator;
  var password = bcrypt.hashSync(req.body.password, 8);
  validate.exists(req.body.first_name, 'First name can\'t be blank');
  validate.exists(req.body.last_name, 'Last name can\'t be blank');
  validate.exists(req.body.email, "Email can't be blank");
  validate.exists(req.body.password, "Please enter a password");
  validate.exists(req.body.password_confirm, "Please confirm your password");
  validate.compare(req.body.password, req.body.password_confirm, "Passwords do not match, please try again");
  if (req.body.email)
  validate.email(req.body.email, "Invalid email format, please enter format 'example@website.com'");
  validate.length(req.body.password, 8, "Password must be a minimum of 8 characters");
  if (validate._errors.length === 0) {
    users.insert({email: req.body.email, firstName: req.body.first_name, lastName: req.body.last_name, password: password}, function(err, doc){
      res.cookie('user_id', doc._id);
      res.redirect('/quizzes');
    });
  } else {
    res.render('users/new', {email: req.body.email, firstName: req.body.first_name, lastName: req.body.last_name, errors: validate._errors});
  }
});

//UPDATE
router.post('/users/:id/update', function(req, res, next){
  users.update({_id: req.params.id}, {$set: {}});
  res.redirect('/users/'+req.params.id);
});

//DELETE
router.post('/users/:id/delete', function(req, res, next){
  users.remove({_id: req.params.id});
  res.redirect('/');
});

module.exports = router;
