var path = require('path'),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    express = require('express'),
    app = express();    

require('dotenv').config();

//requiring routes
var indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/user"),
    pollRoutes = require("./routes/poll");
    

mongoose.connect("mongodb://" + process.env.mongo_user + ":" + process.env.mongo_pwd + "@" + process.env.mongo_uri);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/poll", pollRoutes);

app.use(function(req, res) {
  res.status(404).send("Sorry; the page you are looking for does not exist.");
});

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Server listening...");
});
