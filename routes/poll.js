var express = require("express"),
    router  = express.Router(),
    pollModel = require("../models/poll.js"),
    test = require("../helpers/middlewares.js")

router.get("/:pollId", function(req, res){
    pollModel.findOne({_id : req.params.pollId}, function(err,pollRetrieved) {
        if (err) {
           console.log(err);
           res.redirect("/");
        } else {
            var graphParameters = new test.GraphCreator(pollRetrieved);
            res.render("poll", {poll:pollRetrieved, graphParameters : graphParameters}); // UPDATE FOR GRAPH
        }
    });
});

router.put("/:pollId", function(req, res){
    pollModel.findOne({_id : req.params.pollId}, function(err,pollRetrieved) {
        if (err) {
           console.log(err);
           res.redirect("/");
        } else {
            pollRetrieved.answers.forEach(function(data){
                if(data.item == req.query.answer) {
                    ++pollRetrieved.answers[pollRetrieved.answers.indexOf(data)].count;
                    pollRetrieved.save(function(err){
                        if(err) {
                            console.log(err);
                            res.redirect("/");
                        } else {
                            res.redirect('back');   
                        }
                    })
                }
            })
        }
    });
    
    ("You voted for " + req.query.answer)
});

router.use(function(req, res) {
    res.redirect("/");
});

module.exports = router;