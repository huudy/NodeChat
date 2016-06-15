angular.module('appRoute', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

		$routeProvider
		.when('/home', {
			templateUrl: 'app/views/pages/home.html'
		})
		.when('/login', {
			templateUrl: 'app/views/pages/login.html'
		})
		.when('/sign', {
			templateUrl: 'app/views/pages/signup.html'
		})
		.when('/chat',{
			templateUrl: 'app/views/pages/chat.html',
			controller: 'chatCtrl'
		});
		$routeProvider.otherwise({redirectTo:'/home'});	
		$locationProvider.html5Mode({enabled:true, requireBase: false});
	}
]);