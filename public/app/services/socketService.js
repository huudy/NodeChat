angular.module('socket',[])
.factory('socket', function(){
	var socket = io.connect('http://localhost:8100');
	return socket;
});