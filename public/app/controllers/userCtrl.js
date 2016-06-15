angular.module('userCtrl',['userService'])

.controller('CreateUserCtrl', function(User, $location, $window){
	var vm = this;
	vm.singUp = function(){
		vm.message = '';

		User.create(vm.userData)
			.then(function(response){
				vm.userData = {};
				vm.message = response.data.message;

				$window.sessionStorage.setItem('token', response.data.token);
				$location.path('/');

			});
	}
});