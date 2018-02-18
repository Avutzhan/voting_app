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
    {title: "Question 1", question :"Who is the best player", answers: [{item : "Ronaldo"},{item : "Messi"},{item : "Pele"}]},
    {title: "Question 2", question :"What is the best city", answers: [{item : "Paris"},{item : "London"}]},
    {title: "Question 3", question :"What is the best animal", answers: [{item : "Dog"},{item : "Cat"},{item : "Mouse"},{item : "Turkey"}]},
    {title: "Question 4", question :"Who is the best actor", answers: [{item : "Brad Pitt"},{item : "Costner"},{item : "Di Caprio"}]},
    {title: "Question 5", question :"Who is the best driver", answers: [{item : "Montoya"}]},
    {title: "Question 6", question :"Who is the best worker"},
];

var users = [
    [{ username: "jo", password: "ilo"} , [polls[0]] ],
    [{ username: "jacki", password: "derf34"} , [polls[1],polls[2]] ],
    [{ username: "toti", password: "dkeoffj33"} , [polls[3],polls[4],polls[5]] ],
    [{ username: "yoyo", password: "zzz2za"}, []]
];


function load() {
    users.forEach(function(seed){
        userModel.create(seed[0], function(err, data){
            if (err) {
                console.log(err);  
            } else {
                seed[1].forEach(function(value) {
                    pollModel.create(value, function(err, createdPoll){
                        if (err) {
                            console.log(err)
                        } else if (createdPoll) {
                            userModel.update({_id : data._id},{$push: {polls: createdPoll._id}}, {safe : true, upsert: true}).then(dd=>console.log("HERRRE" + dd));
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