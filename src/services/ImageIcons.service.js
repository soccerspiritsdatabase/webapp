angular.module('app')
.service('ImageIcons', function () {
	var service = this;
	
	service.get = function (group, item) {
		if (group && item) {
			return [
				'img/icons/',
				group.toLowerCase(),
				'/',
				item.toLowerCase(),
				'.png'
			].join('');
		}
		return '';
	};
});