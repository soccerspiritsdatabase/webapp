angular.module('app')
.service('Cache', function ($cacheFactory) {
	var cache = $cacheFactory('resource');
	var service = this;
	
	service.get = function (key) {
		return cache.get(key);
	};
	
	service.put = function (key, value) {
		cache.put(key, value);
	}
});