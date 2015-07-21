var express = require('express');
var router = express.Router();
var db = require('./../connection');
var users = db.get('users');
var quizzes = db.get('quizzes');
var bcrypt = require('bcryptjs');
var Validator = require('./../lib/validator');

var validateUser = function(){
  if (req.session.passport.user_id != req.params.id){
    req.flash('info', 'You do not have access to that page');
    res.redirect('/');
  } else {
    next();
  }
}

var ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

//Login
router.post('/users/login', function(req, res, next) {
  users.findOne({email: req.body.email}, {}, function(err, doc){
    if(doc && bcrypt.compareSync(req.body.password, doc.password)){
      req.session.user_id = doc._id;
      res.redirect('/');
    } else {
      req.flash('info', 'Email or password is incorrect, please try again');
      res.redirect('/');
    }
  });
});
//NEW
router.get('/users/new', function(req, res, next) {
  res.render('users/new');
});

//CREATE
router.post('/users', function(req, res, next){
  var password = bcrypt.hashSync(req.body.password, 8);
  users.findOne({email: req.body.email}, {}, function(err, doc){
    var validate = new Validator;
    if (doc){
      validate._errors.push("Email already exists, please login or register with a different email");
    }
    validate.exists(req.body.first_name, 'First name can\'t be blank');
    validate.exists(req.body.last_name, 'Last name can\'t be blank');
    validate.exists(req.body.email, "Email can't be blank");
    validate.exists(req.body.initials, "Initials can't be blank");
    validate.exists(req.body.password, "Please enter a password");
    validate.exists(req.body.password_confirm, "Please confirm your password");
    validate.compare(req.body.password, req.body.password_confirm, "Passwords do not match, please try again");
    validate.maxLength(req.body.initials, 3, "Initials cannot be more than three characters")
    if (req.body.email) {
      validate.email(req.body.email, "Invalid email format, please enter format 'example@website.com'");
    }
    validate.length(req.body.password, 8, "Password must be a minimum of 8 characters");
    if (validate._errors.length === 0) {
      users.insert({email: req.body.email, firstName: req.body.first_name, lastName: req.body.last_name, initials: req.body.initials, password: password}, function(err, doc){
        req.session.user_id = doc._id;
        res.redirect('/quizzes');
      });
    } else {
      res.render('users/new', {email: req.body.email, firstName: req.body.first_name, lastName: req.body.last_name, errors: validate._errors});
    }
  });
});

//LOGOUT
router.get('/users/logout', function(req, res, next) {
  req.session.user_id = null;
  // req.logout();
  res.redirect('/');
});

//INDEX
router.get('/users', function(req, res, next) {
  users.find({},{},function(err, docs){
    res.render('users/index');
  });
});

//SHOW
router.get('/users/:id', function(req, res, next){
  users.findOne({_id: req.params.id}, function(err, doc){
    if (req.session.user_id != doc._id){
      req.flash('info', 'You do not have access to that page');
      res.redirect('/');
    } else {
      res.render('users/show', {user: doc});
    }
  });
});

//EDIT
router.get('/users/:id/edit', function(req, res, next){
  users.findOne({_id: req.params.id}, function(err, doc){
    if (req.session.user_id != doc._id){
      req.flash('info', 'You do not have access to that page');
      res.redirect('/');
    } else {
    res.render('users/edit', {user: doc, user_id: req.session.user_id});
    }
  });
});

//UPDATE
router.post('/users/:id/update', validateUser, function(req, res, next){
  users.findOne({_id: req.params.id}, {}, function(err, doc){
    var validate = new Validator;
    validate.exists(req.body.first_name, 'First name can\'t be blank');
    validate.exists(req.body.last_name, 'Last name can\'t be blank');
    validate.exists(req.body.email, "Email can't be blank");
    validate.exists(req.body.initials, "Initials can't be blank");
    validate.exists(req.body.password, "Please enter a password");
    validate.exists(req.body.password_confirm, "Please confirm your password");
    validate.compare(req.body.password, req.body.password_confirm, "Passwords do not match, please try again");
    validate.maxLength(req.body.initials, 3, "Initials cannot be more than three characters")
    if (req.body.email)
    validate.email(req.body.email, "Invalid email format, please enter format 'example@website.com'");
    if (validate._errors.length === 0) {
      if(doc && bcrypt.compareSync(req.body.password, doc.password)){
        users.update({_id: req.params.id}, {$set: {email: req.body.email, firstName: req.body.first_name, lastName: req.body.last_name, initials: req.body.initials}});
        req.flash('info', 'User info successfully updated');
        res.redirect('/quizzes');
      } else {
        res.render('users/edit', {email: req.body.email, firstName: req.body.first_name, lastName: req.body.last_name, initials: req.body.initials, errors: ['Incorrect password, please try again']});
      }
    } else {
      res.render('users/edit', {email: req.body.email, firstName: req.body.first_name, lastName: req.body.last_name, initials: req.body.initials, errors: validate._errors});
    }
  });
});

//DELETE
router.post('/users/:id/delete', validateUser, function(req, res, next){
  quizzes.remove({user_id: req.params.id})
  users.remove({_id: req.params.id});
  req.session.user_id = null;
  res.redirect('/');
});

module.exports = router;
