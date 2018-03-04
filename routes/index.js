var express = require("express"),
    router  = express.Router(),
    pollModel = require("../models/poll.js");

//root route
router.get("/", function(req, res){
    pollModel.find()
    .sort({ dateCreated: "descending" })
    .exec(function(err, polls,next) {
        if (err) { return next(err); }
        console.log(polls);
        res.render("index", { polls: polls });
    });
});

module.exports = router;