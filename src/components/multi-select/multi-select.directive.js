angular.module('app')
.directive('multiSelect', function ($q, Skills) {
	return {
		restrict: 'E',
		scope: {
			model: '=ngModel',
			options: '=options',
			multiple: '=multiple',
			required: '=required'
		},
		templateUrl: 'components/multi-select/multi-select.html',
		link: function (scope, element) {
			scope.selectOption = function (option) {
				if (scope.multiple) {
					if (!scope.model) {
						scope.model = [];
					}
					var index = scope.model.indexOf(option.value);
					if (index === -1) {
						scope.model.push(option.value);
					} else {
						scope.model.splice(index, 1);
					}
				} else {
					if (scope.model === option.value) {
						if (!scope.required) {
							delete scope.model;
						}
					} else {
						scope.model = option.value;
					}
				}
			};
			
			scope.isOptionSelected = function (option) {
				if (scope.multiple) {
					if (scope.model && scope.model.length > 0) {
						return scope.model.indexOf(option.value) !== -1;
					}
				} else {
					return scope.model === option.value;
				}
				return false;
			};
			
			if (scope.model === undefined && scope.required) {
				scope.selectOption(scope.options[0]);
			}
		}
	};
});