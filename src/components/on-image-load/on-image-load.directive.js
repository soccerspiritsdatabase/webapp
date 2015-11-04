angular.module('app')
.directive('onImageLoad', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			element.bind('load', onImageLoad);
			scope.$on('$destroy', function () {
				element.unbind('load', onImageLoad);
			});
			
			function onImageLoad () {
				scope.$apply(attrs.onImageLoad);
			}
		}
	}
});