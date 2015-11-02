angular.module('app')
.directive('characterSkill', function ($q, Skills) {
	return {
		restrict: 'E',
		scope: {
			skillId: '=ngModel'
		},
		templateUrl: 'components/character-skill/character-skill.html',
		link: function (scope, element) {
			scope.$watch('skillId', function (skillId) {
				if (!skillId) return;
				
				Skills.get(skillId)
				.then(function (skill) {
					scope.skill = skill;
					scope.levelIndex = skill.effects.length - 1;
					
					if (skill.cooldown > 60) {
						scope.cooldown = {
							value: skill.cooldown / (60 * 60),
							unit: ' hour'
						};
					} else {
						scope.cooldown = {
							value: skill.cooldown,
							unit: ' min'
						};
					}
					
					if (scope.cooldown.value !== 1) {
						scope.cooldown.unit += 's';
					}
				});
			});
		}
	};
});