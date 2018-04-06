var userModel = require("../models/user.js");
var pollModel = require("../models/poll.js");

exports.GraphCreator = function (poll) {
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

exports.confirmPassword = function(req, res, next) { // ADD FLASH!
  if (req.body.password == req.body.confirmPassword) { return next();}
  return res.send("Passwords do not match. Please try again.") // TO BO MODIFIED
}

exports.createUser = function(req, res, next) { // ADD FLASH!
  var username = req.body.username;
  var password = req.body.password;
  userModel.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }
    if (user) {
      //req.flash("error", "User already exists");
      return res.redirect("/exist");  // TO BO MODIFIED
    }
    
    userModel.create({ username: username, password: password}, function(err, data){
        if (err) { return next(err); }
        return next();
    });
    
  });
};

exports.updatePassword = function(req, res, next) { // ADD FLASH! CHECK IF HAVE TO MODIFY BECAUSE OF MONGOOSE PASSPORT PLUGIN ENEBALING
  var userId = req.user._id;
  var newPassword = req.body.password;
  userModel.findByIdAndUpdate(userId, { password : newPassword }, function(err, user) {
    if (err) { return next(err); }
      //req.flash("error", "User already exists");
      return res.redirect("/modified");  // TO BO MODIFIED
  });
};

exports.isLogged = function (req, res, next) { // ADD FLASH!
  if (req.isAuthenticated()) {
    next();
  } else {
    //req.flash("info", "You must be logged in to see this page.");
    res.redirect("/login");
  }
};

exports.isUser = function (req, res, next) {  // ADD FLASH!
  if (req.user._id == req.params.userID) {
    next();
  } else {
    //req.flash("info", "Forbidden");
    res.redirect("/user/" + req.user._id);
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

exports.createNewPoll = function(req, res, next) { // NEED FLASH when created. Create new poll in DB.
  pollModel.create(req.pollToCreate, function(err, createdPoll){
    if (err) { return next(err); }
    userModel.findByIdAndUpdate(req.user._id, { $push: { polls: { $each: [createdPoll._id], $position: 0 } } }, function(err, user) {
      if (err) { return next(err); }
      res.redirect("/poll/" + createdPoll._id); // FLASH HERE
    });
  });
};

exports.ownsPoll = function (req, res, next) {  // ADD FLASH!
  if ( req.user.polls.indexOf(req.params.pollId) != -1 ) {
    next();
  } else {
    //req.flash("info", "Forbidden");
    res.redirect("/user/" + req.user._id);
  }
};

exports.updatePoll = function (req, res, next) {  // ADD FLASH!
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
    console.log(toDelete);
    console.log(toAdd);
    
    if (toAdd) { // Add new answers if user input any
      if (typeof toAdd === 'object') { // If user user only adds 1 answer, value is a string (otherwise array). So have to identify the case to take proper action.
        toAdd.forEach(data => pollToUpdate.answers.push({item: data}));
      } else {
        pollToUpdate.answers.push({item: toAdd});
      }
    } 

    pollToUpdate.save(function(err,end){
      if (err) { return next(err); }
      //req.flash("info", "OK");
      res.redirect("/user/" + req.user._id);
    });
  });
  

};

/*
title: String,
   question: String,
   dateCreated : { type: Date, default: Date.now },
   answers: [
      {
         item : String,
         count : { type: Number, default: 0 }
      }
   ],
*/
module.exports = exports;
