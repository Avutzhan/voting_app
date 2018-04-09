var express = require("express"),
    router  = express.Router(),
    pollModel = require("../models/poll.js"),
    userModel = require("../models/user.js"),
    passport = require('passport'),
    middlewares = require("../helpers/middlewares.js");

//root route
router.post("/new", 
    middlewares.confirmPassword,
    middlewares.createUser,
    function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            req.logIn(user, function(err) {
              if (err) { return next(err); }
              req.flash("success","Signup and login successful");
              return res.redirect('/user/' + user._id);
            });
        })(req, res, next);
    }
);

router.get("/:userID", 
    middlewares.isLogged, 
    middlewares.isUser, 
    function(req, res, next){
        userModel.
        findOne({ _id: req.user._id }).
        populate('polls').
        exec(function (err, userWithPolls) {
            if (err) return next(err);
            res.render("user", { polls: userWithPolls.polls });
        });
    }
);

router.put("/:userID", //Modify passowrd
    middlewares.confirmPassword,
    middlewares.isLogged, 
    middlewares.isUser, 
    middlewares.updatePassword
);

module.exports = router;