var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require("../models/user.js");

module.exports = function() {
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};