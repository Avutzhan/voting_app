var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema;
require('dotenv').config();

var UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String },
    dateCreated : { type: Date, default: Date.now },
    polls: [{ type: Schema.Types.ObjectId, ref: process.env.mongo_polldb}]
});

UserSchema.plugin(passportLocalMongoose) ;

module.exports = mongoose.model(process.env.mongo_userdb, UserSchema);