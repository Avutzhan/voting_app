var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateCreated : { type: Date, default: Date.now },
    polls: [{ type: Schema.Types.ObjectId, ref: 'Poll'}]
    //CHECK FOR POLL
});

//UserSchema.plugin(passportLocalMongoose) Will use with passport => https://www.npmjs.com/package/passport-local-mongoose

module.exports = mongoose.model("User", UserSchema);