var path = require('path'),
    bodyParser  = require("body-parser"),
    cookieParser = require("cookie-parser"),
    mongoose    = require("mongoose"),
    express = require('express'),
    app = express(),
    passport = require("passport"),
    session = require("express-session"),
    methodOverride = require("method-override"),
    setupPassport = require("./helpers/passportconfig.js");
    
    

require('dotenv').config();


//requiring routes
var indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/user"),
    pollRoutes = require("./routes/poll");
    

mongoose.connect("mongodb://" + process.env.mongo_user + ":" + process.env.mongo_pwd + "@" + process.env.mongo_uri);
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));

//Passport 
setupPassport();
app.use(cookieParser());
app.use(session({
  secret: "forzajuve",
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Seeder
var seeds = require("./models/seeds.js");
seeds();
//

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/poll", pollRoutes);

app.use(function(req, res) {
  res.status(404).send("Sorry, the page you are looking for does not exist.");
});

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Server listening...");
});
