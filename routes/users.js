var express = require('express');
var router = express.Router();
var db = require('./../connection');
var users = db.get('users');

//INDEX
router.get('/users', function(req, res, next) {
  users.find({},{},function(err, docs){
    res.render('users/index');
  });
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
router.post('/users/:id', function(req, res, next){
  users.insert({_id: req.params.id})
  res.redirect('/users/'+req.params.id);
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
