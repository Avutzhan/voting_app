var express = require("express"),
    router  = express.Router(),
    pollModel = require("../models/poll.js"),
    userModel = require("../models/user.js"),
    middlewares = require("../helpers/middlewares.js");

router.get("/new", 
    middlewares.isLogged, 
    function(req, res) {
        res.render("newPoll");
    }
);

router.post("/new", 
    middlewares.isLogged,
    middlewares.formatAnswer,
    middlewares.createNewPoll
);

router.get("/:pollId", function(req, res, next){ // NEED TO HANDLE WHEN GIVE A WRONG ID, OTHERWIE WILL BUG
    pollModel.findOne({_id : req.params.pollId}, function(err,pollRetrieved) {
        if (err) { return next(err); }
        var graphParameters = new middlewares.GraphCreator(pollRetrieved);
        return res.render("poll", {poll:pollRetrieved, graphParameters : graphParameters}); // UPDATE FOR GRAPH
    });
});

router.put("/:pollId", function(req, res, next){ // Vote from anybody. Adds +1 to the selected answer.
    pollModel.findOne({_id : req.params.pollId}, function(err,pollRetrieved) {
        if (err) { return next(err); }
        pollRetrieved.answers.forEach(function(data){
            if(data.item == req.query.answer) {
                ++pollRetrieved.answers[pollRetrieved.answers.indexOf(data)].count;
                pollRetrieved.save(function(err){
                    if (err) { return next(err); }
                    req.flash("success","Vote successfully registered");
                    return res.redirect('back');   
                })
            }
        })
    });
});

router.get("/:pollId/edit", 
    middlewares.isLogged,
    middlewares.ownsPoll,
    function(req, res, next) {
        pollModel.findById(req.params.pollId, function (err, pollRetrieved) {
        if (err) { return next(err); }
        return res.render("editPoll",{poll:pollRetrieved});   
        });
    }
);

router.put("/:pollId/edit", 
    middlewares.isLogged,
    middlewares.ownsPoll,
    middlewares.updatePoll
);

router.delete("/:pollId", 
    middlewares.isLogged,
    middlewares.ownsPoll,
    function(req, res, next) {
        var userID = req.user._id,
        pollID = req.params.pollId;
        pollModel.findByIdAndRemove(pollID, function (err, removedPoll) { 
        if (err) { return next(err); }
            userModel.findByIdAndUpdate(userID, { $pull: { "polls": pollID} }, function (err, removedPoll) {
                if (err) { return next(err); }
                req.flash("success","Poll successfully deleted");
                res.redirect("/user/" + userID);
            });
        });
    }
);

module.exports = router;