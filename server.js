var  express = require("express"), //includes express
	 bodyParser = require("body-parser"),
	 morgan = require("morgan"),
	 app = express(),//initiates express
	 server = require("http").createServer(app),//creates http server
	 io = require("socket.io").listen(server),//includes web socket
	 config = require('./config'),
	 mongoose = require('mongoose'),
	 Chat = require('./app/models/chat'),
	 api = require('./app/routes/api')(app, express);

mongoose.connect(config.database, function(err){
	if(err){
		console.log(err);
	} else{
		console.log("Connected to database");
	}
});

server.listen(config.port, function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log("Running port: " + config.port);
	}
});// localhost port 8100

app.use(express.static(__dirname +"/public"));
app.use(express.static(__dirname+"/bower_components"));
app.use(express.static(__dirname+"/node_modules"));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use('/api', api);

app.get('*', function(req, res){
 res.sendFile(__dirname + '/public/app/views/index.html');
});

var users = [];

io.on('connection', function(socket){
	var username = '';

	socket.on('request-users', function(){
		socket.emit('users',{users:users});
	});

	socket.on('add-user', function(data){
		if(users.indexOf(data.username) == -1){
			io.emit('add-user', {
				username: data.username
			});
			username= data.username;
			users.push(data.username);
			console.log(username +" connected");
		}
	});

	socket.on('send message', function(data){
		console.log(data.message);
		var newMsg = new Chat({msg:data.message, sender: username});
		newMsg.save(function(err){
			if(err)
				throw err;
			else
				io.emit('message', {username: username, message: data.message});
		});
		
	});

	socket.on('disconnect', function(){
		console.log(username +" disconnected");
		users.splice(users.indexOf(username), 1);
		io.emit('remove-user', {username: username});
	});
});