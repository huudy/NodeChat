angular.module('btsocket', [])

.factory('Socket', function (socketFactory) {
  return socketFactory();
});