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
				
				getFirstEvolution(character.id)
				.then(function (id) {
					return getNextEvolutions(id);
				})
				.then(function (evolutions) {
					scope.evolutions = evolutions;
				});
			});
		}
	};
	
	function getFirstEvolution (id) {
		return Evolutions.reverse(id)
		.then(function (preEvolution) {
			if (preEvolution) {
				return getFirstEvolution(preEvolution.preResult);
			} else {
				return id;
			}
		});
	}
	
	function getNextEvolutions (id, result) {
		if (!result) result = [];
		
		return Evolutions.get(id)
		.then(function (evolution) {
			if (evolution) {
				result.push(evolution);
				return getNextEvolutions(evolution.result, result);
			} else {
				return result;
			}
		});
	}
});