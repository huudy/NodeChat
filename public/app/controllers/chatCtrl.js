angular.module('chat', [])

.controller('chatCtrl', function($scope, Socket, Auth) {
	Socket.connect();

	$scope.users = [];
	$scope.messages = []; 
		
	var scrollDown = function(){
		 $(document).ready(function() {
		   $("#chat-window").animate({
		        scrollTop: $("#chat-window").height()
		    }, 100);
		});
	}
	var getUsername  = function(){
		Auth.getUser()
			.then(function(data){
				$scope.uname =data.data.username;
				Socket.emit('add-user', {username: $scope.uname});
			});
	}

	$scope.sendMsg = function(msg){
		if(msg!=null && msg!=""){
			Socket.emit('send message', {message: msg});
		}
		scrollDown();
		$scope.msg = "";
	}

	getUsername();
	
	Socket.emit('request-users', {});

	Socket.on('users', function(data){
		$scope.users = data.users;
	});

	Socket.on('message', function(data){
		$scope.messages.push(data);
		$scope.$digest();
	});

	Socket.on('add-user', function(data){
		$scope.users.push(data.username);
		$scope.messages.push({username: data.username, message:"Has joined!"});
	});

	Socket.on('remove-user', function(data){
		$scope.users.splice($scope.users.indexOf(data.username), 1);
		$scope.messages.push({username: data.username, message:"Just left..."});
	});

	$scope.$on('$locationChangeStart', function(event){
		Socket.disconnect(true);
	});
});