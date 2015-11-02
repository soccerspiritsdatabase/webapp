angular.module('app')
.service('TimeLogger', function ($http, $q) {
	var service = this;
	var times = {};
	
	service.start = function (id) {
		times[id] = new Date().getTime();
	};
	
	service.end = function (id) {
		console.log('[TimeLogger]', id, (new Date().getTime() - times[id]) + 'ms');
	};
});