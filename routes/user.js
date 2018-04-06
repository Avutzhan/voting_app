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
    passport.authenticate('local', { successRedirect: '/yes', failureRedirect: '/no'/*, failureFlash: true*/ })
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

router.put("/:userID", // ADD FLASH!  Modify passowrd
    middlewares.confirmPassword,
    middlewares.isLogged, 
    middlewares.isUser, 
    middlewares.updatePassword
);

module.exports = router;