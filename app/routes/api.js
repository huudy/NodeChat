var User = require("../models/user");
var config = require("../../config");
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');

// creates token using secretKey
function createToken(user){

	var token = jsonwebtoken.sign({
		id: user._id,
		name: user.name,
		username: user.username,
	}, secretKey, {
		expiresIn: 1440
	});

	return token;
}

module.exports = function (app, express) {

	var api = express.Router();

	api.post("/signup", function(req, res){
		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});

		var token = createToken(user);

		user.save(function(err){
			if(err){
				res.send(err);
				return;
			}

			res.json({ 
				success: true,
				message: "User created!",
				token: token
			});
		});
	});

	api.post("/login", function(req, res){
		User.findOne({
			username: req.body.username
		}).select('user username password').exec(function(err, user){
			if(err) throw err;

			if(!user){
				res.send({message: "User does not exist!"});
			} else if(user){
				var validPass = user.comparePass(req.body.password);

				if(!validPass){
					res.send({message:"Wrong password"});

				} else {
					var token = createToken(user);

					res.json({
						success: true,
						message: "Logged in",
						token: token
					});
				}
			}
		});
	});

	api.use(function(req, res, next){

		console.log("Cusotmer here");

		var token = req.body.token || req.param("token") || req.headers["x-access-token"];

		//check ig token exists

		if(token){

			jsonwebtoken.verify(token, secretKey, function(err, decoded){

				if(err){
					res.status(403).send({success: false, message: "Auth failed"});
				} else{
					req.decoded = decoded;
					next();
				}
			});
		} else{

			res.status(403).send({ success: true, message: "there is no token"});
		}
	});

	api.get('/me', function(req, res){
		res.json(req.decoded);
	});

	return api
}