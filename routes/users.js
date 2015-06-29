var express = require('express');
var router = express.Router();
var db = require('./../connection');
var users = db.get('users');
var bcrypt = require('bcryptjs');

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
      res.redirect('/quizzes');
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
  var password = bcrypt.hashSync(req.body.password, 8);
  users.insert({email: req.body.email, firstName: req.body.first_name, lastName: req.body.last_name, password: password}, function(err, doc){
    res.cookie('user_id', doc._id);
    res.redirect('/quizzes');
  });
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
