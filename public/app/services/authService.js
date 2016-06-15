angular.module("authService", [])

.factory('Auth', function($http, $q, AuthToken ) {
	
	var authFactory = {};

	authFactory.login = function(username, password){
		return $http.post('/api/login', {
			username: username,
			password: password
		})
		.success(function(data){
			AuthToken.setToken(data.token);
			return data;
		})
	}

	authFactory.logout = function(){
		AuthToken.setToken();
	}

	authFactory.isLoggedIn = function(){
		if(AuthToken.getToken())
			return true;
		else
			return false;
	}

	authFactory.getUser = function(){
		if(AuthToken.getToken())
			return $http.get('/api/me');
		else
			return $q.reject({ message:"No token for the user"});
	}

	return authFactory;
})

.factory("AuthToken", function($window){
	var authTokenFactory = {};

	authTokenFactory.getToken = function(){
		return $window.sessionStorage.getItem('token');
	}

	authTokenFactory.setToken = function(token){
		if(token)
			$window.sessionStorage.setItem('token', token);
		else
			$window.sessionStorage.removeItem('token');
	}

	return authTokenFactory;
})

.factory('AuthInterceptor', function($q, $location, AuthToken){

	var interceptorFactory = {};

	interceptorFactory.request = function(config){

		var token = AuthToken.getToken();

		if(token){
			config.headers['x-access-token'] = token;//passing token to the x-access-token
		}

		return config;
	};

	interceptorFactory.resonponseError = function(response){
		if(response.status == 403)
			$location.path('/login');
		return $q.reject(response);
	}

	return interceptorFactory;
});