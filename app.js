var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var cookieSession = require('cookie-session');
var flash = require('connect-flash');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;


require('dotenv').load();

var db = require('monk')(process.env.MONGO_URI);
var userCollection = db.get('users');

var routes = require('./routes/index');
var users = require('./routes/users');
var quizzes = require('./routes/quizzes');
var authRoutes = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//allow file uploads with req.files
app.use(multer({dest: './uploads/'}));
//allow flash messages
app.use(cookieParser('secret'));
app.set('trust proxy', 1)
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_KEY1, process.env.SESSION_KEY2, process.env.SESSION_KEY3]
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      userCollection.findOne({email: username}, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (!bcrypt.compareSync(password, user.password)) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, {user_id: user._id});
      });
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.HOST + "/auth/facebook/callback",
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    userCollection.update({ facebookId: profile.id }, {$set: {accessToken: accessToken, refreshToken: refreshToken, initials: profile.displayName.split(' ')[0].charAt(0) + profile.displayName.split(' ')[1].charAt(0) , cfirstName: profile.displayName.split(' ')[0], lastName: profile.displayName.split(' ')[1]}}, {upsert: true}, function(err, doc){
    process.nextTick(function () {
      userCollection.findOne({facebookId: profile.id}, {}, function(err,doc){
        return done(err, {user_id: doc._id});
      });
    })

    });

  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(function(req, res, next){
  // if (app.locals.user){
  //   req.session.user_id = app.locals.user;
  // }
  res.locals.user = req.user;  //passport sets this up
  next();
});

app.use('/', routes);
app.use('/', authRoutes);
app.use('/', quizzes);
app.use('/', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
