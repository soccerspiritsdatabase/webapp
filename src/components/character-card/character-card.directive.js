angular.module('app')
.directive('characterCard', function ($window, $timeout, Characters) {
	return {
		restrict: 'E',
		scope: {
			model: '=ngModel'
		},
		templateUrl: 'components/character-card/character-card.html',
		link: function (scope, element) {
			
			scope.$watch('model', function (model) {
				if (!model) return;
				
				if (!isNaN(model)) {
					Characters.get(model).then(initialize);
				} else {
					initialize(model);
				}
			});
			
			function initialize (character) {
				scope.character = character;
				
				scope.image = {};
				scope.image.character = 'data/card_files/' + scope.character.imageId + '_CS.jpg';
				scope.image.star = 'img/icons/star/';
			
				var evolutionNumber = Math.floor(scope.character.id / 10000) % 3;
				if (character.isOther || evolutionNumber === 1) {
					scope.image.star += 'normal';
				} else if (evolutionNumber === 2) {
					scope.image.star += 'evolved';
				} else {
					scope.image.star += 'extreme-evolved';
				}
				scope.image.star += '.png';
			
				scope.stars = [];
				for (var i = 0; i < scope.character.value; i++) {
					scope.stars.push(i);
				}
				
				$timeout(calculateFontSize, 10);
			}
		
			function calculateFontSize (event) {
				console.log('calculate font size');
				scope.fontSize = Math.min(25, (element[0].clientWidth / 10)) + 'px';
				if (event) {
					scope.$apply();	
				}
			}
			
			$window.addEventListener('resize', calculateFontSize);
			scope.$on('$destroy', function () {
				$window.removeEventListener('resize', calculateFontSize);
			});
		}
	};
});