var path = require('path'),
    bodyParser  = require("body-parser"),
    cookieParser = require("cookie-parser"),
    mongoose    = require("mongoose"),
    express = require('express'),
    app = express(),
    flash = require("connect-flash"),
    passport = require("passport"),
    session = require("express-session"),
    methodOverride = require("method-override"),
    setupPassport = require("./helpers/passportconfig.js");
    
//requiring routes
var indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/user"),
    pollRoutes = require("./routes/poll");
    

mongoose.connect("mongodb://" + process.env.mongo_user + ":" + process.env.mongo_pwd + "@" + process.env.mongo_uri);
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());
//Passport 
setupPassport();
app.use(cookieParser("jacktessupporterssontla"));
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
  res.locals.success = req.flash('success');
  res.locals.warning = req.flash('warning');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/poll", pollRoutes);

app.use(function(err, req, res, next) {
  console.log(err);
  req.flash("error","There was an error processing your request, please try again later");
  res.status(500).redirect("/");
});

app.use(function(req, res) {
  req.flash("warning","The page you are looking for does not exist");
  res.status(404).redirect("/");
});

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Server listening...");
});
