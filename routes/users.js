var express = require('express');
var router = express.Router();
var db = require('./../connection');
var users = db.get('users');
var quizzes = db.get('quizzes');
var bcrypt = require('bcryptjs');
var Validator = require('./../lib/validator');

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
        res.cookie('user_id', doc._id);
        res.redirect('/quizzes');
      });
    } else {
      res.render('users/new', {email: req.body.email, firstName: req.body.first_name, lastName: req.body.last_name, errors: validate._errors});
    }
  });
});
//***********************************************************
//** Check for cookie before allowing quiz editting access **
//***********************************************************
// router.all('/users/*', function(req, res, next){
//   var userLoggedIn = req.cookies.user_id;
//   if (userLoggedIn) {
//     next();
//   } else {
//     res.redirect('/');
//   }
// });

//LOGOUT
router.get('/users/logout', function(req, res, next) {
  res.clearCookie('user_id');
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
  var userToken = req.cookies.user_id;
  users.findOne({_id: req.params.id}, function(err, doc){
    if (userToken != doc._id){
      res.redirect('/');
    } else {
      res.render('users/show', {user: doc});
    }
  });
});

//EDIT
router.get('/users/:id/edit', function(req, res, next){
  var userToken = req.cookies.user_id;
  users.findOne({_id: req.params.id}, function(err, doc){
    if (userToken != doc._id){
      res.redirect('/');
    } else {
    res.render('users/edit', {user: doc, user_id: userToken});
    }
  });
});

//UPDATE
router.post('/users/:id/update', function(req, res, next){
  var userToken = req.cookies.user_id;
  if (userToken != req.params.id){
    res.redirect('/');
  } else {
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
          res.redirect('/quizzes');
        } else {
          res.render('users/edit', {email: req.body.email, firstName: req.body.first_name, lastName: req.body.last_name, initials: req.body.initials, errors: ['Incorrect password, please try again']});
        }
      } else {
        res.render('users/edit', {email: req.body.email, firstName: req.body.first_name, lastName: req.body.last_name, initials: req.body.initials, errors: validate._errors});
      }
    });
  }
});

//DELETE
router.post('/users/:id/delete', function(req, res, next){
  var userToken = req.cookies.user_id;
  if (userToken != req.params.id){
    res.redirect('/');
  } else {
    quizzes.remove({user_id: req.params.id})
    users.remove({_id: req.params.id});
    res.clearCookie('user_id');
    res.redirect('/');
  }
});

module.exports = router;
