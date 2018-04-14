var mongoose = require("mongoose");

var pollSchema = new mongoose.Schema({
   question: String,
   dateCreated : { type: Date, default: Date.now },
   answers: [
      {
         item : String,
         count : { type: Number, default: 0 }
      }
   ],
});

module.exports = mongoose.model(process.env.mongo_polldb, pollSchema);