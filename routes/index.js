var express = require("express");
var router  = express.Router();

//root route
router.get("/", function(req, res){
    res.render("index");
});

module.exports = router;