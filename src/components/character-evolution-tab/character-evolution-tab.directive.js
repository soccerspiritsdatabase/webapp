angular.module('app')
.directive('characterEvolutionTab', function ($q, Evolutions) {
	return {
		restrict: 'E',
		scope: {
			character: '=ngModel'
		},
		templateUrl: 'components/character-evolution-tab/character-evolution-tab.html',
		link: function (scope, element) {
			scope.$watch('character', function (character) {
				if (!character) return;
				
				$q.all([
					Evolutions.reverse(character.id),
					Evolutions.get(character.evolution)
				])
				.then(function (result) {
					scope.prevEvolution = result[0];
					scope.evolution = result[1];
				});
			});
		}
	};
});