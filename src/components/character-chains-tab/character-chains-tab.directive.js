angular.module('app')
.directive('characterChainsTab', function (Calculator) {
	return {
		restrict: 'E',
		scope: {
			character: '=ngModel'
		},
		templateUrl: 'components/character-chains-tab/character-chains-tab.html',
		link: function (scope, element) {
			scope.$watch('character', function (character) {
				if (!character || !character.chain || !character.chain.chains) return;
				
				scope.chains = character.chain.chains;
			});
		}
	};
});