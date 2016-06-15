var app = angular.module('chatJs', ['appRoute', 'authService', 'mainCtrl', 'socket', 'btsocket', 'btford.socket-io', 'chat','userCtrl', 'userService'])

.config(function($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptor');
	
})

