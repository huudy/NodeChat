angular.module('mainCtrl', [])

.controller('MainCtrl', function($rootScope, $location, Auth, socket){

	var vm = this;

	vm.loggedIn = Auth.isLoggedIn();

	$rootScope.$on('$routeChangeStart', function(){

		vm.loggedIn = Auth.isLoggedIn();

		Auth.getUser()
			.then(function(data){
				vm.user=data.data;
			});
	});

	vm.Login = function(){

		vm.processing = true;

		vm.error = '';

		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data){
				vm.processing = false;

				Auth.getUser()
					.then(function(data){
						vm.user = data.data;
					});

				if(data.success){
					console.log(vm.user);
					$location.path('/home');
				} else{
					vm.error = data.message;
					bootbox.alert("Wrong username or password..."+"<br>"+"Make sure you enter correct information", function() {
					});
				}
			});
	}

	vm.Logout = function(){
		Auth.logout();
		$location.path('/');			
	}

});