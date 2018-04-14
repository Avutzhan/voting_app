var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String },
    dateCreated : { type: Date, default: Date.now },
    polls: [{ type: Schema.Types.ObjectId, ref: 'Poll'}]
});

UserSchema.plugin(passportLocalMongoose) ;

module.exports = mongoose.model("User", UserSchema);