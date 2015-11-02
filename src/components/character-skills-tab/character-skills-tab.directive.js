angular.module('app')
.directive('characterSkillsTab', function ($q, Skills) {
	return {
		restrict: 'E',
		scope: {
			character: '=ngModel'
		},
		templateUrl: 'components/character-skills-tab/character-skills-tab.html',
		link: function (scope, element) {
			
		}
	};
});