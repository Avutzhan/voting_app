var mongoose = require("mongoose");

var pollSchema = new mongoose.Schema({
   title: String,
   question: String,
   description: String,
   answers: [],
   user: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
});

module.exports = mongoose.model("Poll", pollSchema);