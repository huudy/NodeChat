var mongoose = require("mongoose");
var msgSchema = new mongoose.Schema({
	 	msg: String,
	 	sender: String,
	 	time:{type: Date, default: Date.now}
	 });

module.exports = mongoose.model('Message', msgSchema);