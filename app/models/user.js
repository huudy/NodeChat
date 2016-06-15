var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	name: String,
	username: { type: String, required: true, index: { unique: true}},
	password: { type: String, required: true, select: false}
});
var bcrypt = require('bcrypt-nodejs');

UserSchema.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.hash(user.password, null, null, function(err,hash){

		if(err) return next(err);

		user.password = hash;

		next();

	});
});

UserSchema.methods.comparePass = function(password){

	var user = this;

	return bcrypt.compareSync(password, user.password);

}

module.exports = mongoose.model("User", UserSchema);