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

router.post('/login', // Use custom callback to redirect to user/id
    passport.authenticate('local', { successRedirect: '/yes', failureRedirect: '/no'/*, failureFlash: true*/ })
);

router.get("/signup", function(req, res){
    res.render("signup");
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;