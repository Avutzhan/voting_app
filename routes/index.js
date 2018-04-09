var express = require("express"),
    router  = express.Router(),
    pollModel = require("../models/poll.js"),
    passport = require('passport');

//root route
router.get("/", function(req, res){
    pollModel.find()
    .sort({ dateCreated: "descending" })
    .exec(function(err, polls,next) {
        if (err) { return next(err); }
        res.render("index", { polls: polls });
    });
});

router.get("/login", function(req, res){
    res.render("login");
});
  
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
        req.flash("warning","Invalid username or password");
        return res.redirect('/login'); 
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      req.flash("success","Login successful");
      return res.redirect('/user/' + user._id);
    });
  })(req, res, next);
});

router.get("/signup", function(req, res){
    res.render("signup");
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash("success","Logout successful");
  res.redirect('/');
});

module.exports = router;