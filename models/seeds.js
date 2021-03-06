//requiring models
var userModel = require("./user.js"),
    pollModel = require("./poll.js");

module.exports = function() {
//Seeding
userModel.remove()
.then(function (product) {
    console.log("All users removed");
    return pollModel.remove()
})
.then(function (product) {
    console.log("All polls removed");
    return load();
})
.catch(function (err) {
    console.log(err);
})

var polls = [
    {question :"Who is the best player", answers: [{item : "Ronaldo", count : 2},{item : "Messi", count : 4},{item : "Pele", count : 1}]},
    {question :"What is the best city", answers: [{item : "Paris", count : 2},{item : "London", count : 5}]},
    {question :"What is the best animal", answers: [{item : "Dog", count : 0},{item : "Cat", count : 2},{item : "Mouse", count : 9},{item : "Turkey", count : 3}]},
    {question :"Who is the best actor", answers: [{item : "Brad Pitt", count : 2},{item : "Costner", count : 6},{item : "Di Caprio"}]},
    {question :"Who is the best driver", answers: [{item : "Montoya", count : 2}]},
    {question :"Who is the best worker"},
];

var users = [
    [{ username: "jo", password: "ilo"} , [polls[0]] ],
    [{ username: "jacki", password: "derf34"} , [polls[1],polls[2]] ],
    [{ username: "toti", password: "dkeoffj33"} , [polls[3],polls[4],polls[5]] ],
    [{ username: "yoyo", password: "zzz2za"}, []]
];


function load() {
    /*
    var newUser = new userModel({username});
    userModel.register(newUser, password, function(err, user){
        if (err) { return next(err); }
        return next();
    });
    */
    users.forEach(function(seed){
        var newUser = new userModel({username: seed[0]["username"]});
        userModel.register(newUser, seed[0]["password"], function(err, data){
            if (err) {
                console.log(err);  // MODIFY HERE
            } else {
                seed[1].forEach(function(value) {
                    pollModel.create(value, function(err, createdPoll){
                        if (err) {
                            console.log(err) // MODIFY HERE
                        } else if (createdPoll) {
                            userModel.update({_id : data._id},{$push: {polls: createdPoll._id}}, {safe : true, upsert: true}).then(pushed => console.log("Pushed poll to " + data.username));
                        }
                    });
                });
            } 
        });
    });
}


/*
var usersbackup = [
    [{ username: "jo", password: "ilo"} , [{title: "Question 1", question :"Who is the best player", answers: [{item : "Ronaldo"},{item : "Messi"},{item : "Pele"}]}] ],
    [{ username: "jacki", password: "derf34"} , [{title: "Question 2", question :"What is the best city", answers: [{item : "Paris"},{item : "London"}]},{title: "Question 3", question :"What is the best animal", answers: [{item : "Dog"},{item : "Cat"},{item : "Mouse"},{item : "Turkey"}]}] ],
    [{ username: "toti", password: "dkeoffj33"} , [{title: "Question 4", question :"Who is the best actor", answers: [{item : "Brad Pitt"},{item : "Costner"},{item : "Di Caprio"}]},{title: "Question 5", question :"Who is the best driver", answers: [{item : "Montoya"}]},{title: "Question 6", question :"Who is the best worker"}] ],
    [{ username: "yoyo", password: "zzz2za"}, []]
];
*/


// End seeding

};



/* join code
db.users.aggregate([

{
   $lookup:
     {
       from: "polls",
       localField: "polls",
       foreignField: "_id",
       as: "test"
     }
}
])

*/