var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require("../models/user.js");

module.exports = function() {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
     
    passport.use('local', new LocalStrategy(
      function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
          if (err) {return done(err); }
          if ( (!user) || (user.password != password) ) {
            return done(null, false, { message: 'Incorrect Username or Password.' });
          }
          return done(null, user);
        });
      }
    ));

};