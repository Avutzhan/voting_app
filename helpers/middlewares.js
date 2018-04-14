var userModel = require("../models/user.js"),
pollModel = require("../models/poll.js"),
flash = require("connect-flash");

exports.GraphCreator = function (poll) { // Creates the object with all the needed poll graph information to be passed to chart.js for displaying polls graphs
    this.type = "pie";
    var tempLabels = [],
        tempCount = [],
        tempBGC = [];
    poll.answers.forEach(function(data){
        tempLabels.push(data.item);
        tempCount.push(data.count);
        tempBGC.push("rgb("+ Math.floor(Math.random()*255) + ", "+ Math.floor(Math.random()*255) + ", "+ Math.floor(Math.random()*255) + ")");
    });
    this.data = {
        labels: tempLabels,
        datasets: [{
            label: "Answers",
            data: tempCount,
            backgroundColor: tempBGC,
            borderWidth: 1
        }]
    },
    this.options = {
        legend: {
            position: "right"
        },
        animation: {
			animateScale: true,
			animateRotate: true
		},
        cutoutPercentage : 50
    };
};

exports.confirmPassword = function(req, res, next) { // Ensures passwords are the same in signup or modify forms
  if (req.body.password == req.body.confirmPassword) { return next(); }
  req.flash("warning","Passwords do not match, please try again");
  return res.redirect('back');
};

exports.createUser = function(req, res, next) { // Creates user in DB
  var username = req.body.username;
  var password = req.body.password;
  userModel.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }
    if (user) {
      req.flash("warning","Username already exists, please choose another one");
      return res.redirect("back");  
    }
    
    var newUser = new userModel({username});
    userModel.register(newUser, password, function(err, user){
        if (err) { return next(err); }
        return next();
    });
    
  });
};

exports.updatePassword = function(req, res, next) { // Updates user's password in DB
  var userId = req.user._id;
  var newPassword = req.body.password;
  userModel.findByIdAndUpdate(userId, { password : newPassword }, function(err, user) {
    if (err) { return next(err); }
    req.flash("success","Password successfully updated");
    return res.redirect("back");
  });
};

exports.isLogged = function (req, res, next) { // Ensures the user is logged
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("warning", "You must be logged in to perform this action");
    res.redirect("/login");
  }
};

exports.isUser = function (req, res, next) { // Ensures the user the right one being alloed to modify its profile
  if (req.user._id == req.params.userID) {
    next();
  } else {
    req.flash("warning","You are not allowed to perform this action");
    res.redirect("/");
  }
};

exports.formatAnswer = function(req, res, next) { // Formats the form to then be created as a new poll in createNewPoll()
  let answers =  Array.from(new Set(req.body.answers)).filter( x => x.replace(/\s+/, "")).map(function(data){ // Set enables to remove duplicates (if user uses Post Man) and filter removes blanks only or empty inputs.
    if (data) return {item : data};  
  });
  req.pollToCreate = {
    question : req.body.question,
    answers
  }
  next();
};

exports.createNewPoll = function(req, res, next) { // Create new poll in DB
  pollModel.create(req.pollToCreate, function(err, createdPoll){
    if (err) { return next(err); }
    userModel.findByIdAndUpdate(req.user._id, { $push: { polls: { $each: [createdPoll._id], $position: 0 } } }, function(err, user) {
      if (err) { return next(err); }
      req.flash("success","Poll successfully created");
      res.redirect("/poll/" + createdPoll._id);
    });
  });
};

exports.ownsPoll = function (req, res, next) { // Checks if the user owns the poll to modify it
  if ( req.user.polls.indexOf(req.params.pollId) != -1 ) {
    next();
  } else {
    req.flash("warning","You can only perform actions on your own polls");
    res.redirect("back");
  }
};

exports.updatePoll = function (req, res, next) { // Updates poll in DB
  var toDelete = req.body.toDelete,
  toAdd = req.body.answers;
  
  pollModel.findOne({_id: req.params.pollId}, function (err, pollToUpdate) {
    if (err) { return next(err); }
    
    if (req.body.question) { // Update questions
      pollToUpdate.question = req.body.question;
    }
    
    if (toDelete) { // Remove the answers to be deleted if user selected any answer to delete
      pollToUpdate.answers = pollToUpdate.answers.filter(data => toDelete.indexOf(data.item) == -1);
    }

    if (toAdd) { // Add new answers if user input any
      if (typeof toAdd === 'object') { // If user user only adds 1 answer, value is a string (otherwise array). So have to identify the case to take proper action.
        toAdd.forEach(data => pollToUpdate.answers.push({item: data}));
      } else {
        pollToUpdate.answers.push({item: toAdd});
      }
    } 

    pollToUpdate.save(function(err,end){
      if (err) { return next(err); }
      req.flash("success","Poll successfully updated");
      res.redirect("/user/" + req.user._id);
    });
  });
};

module.exports = exports;
