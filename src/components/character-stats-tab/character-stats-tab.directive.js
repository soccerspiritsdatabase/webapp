angular.module('app')
.directive('characterStatsTab', function (Calculator) {
	return {
		restrict: 'E',
		scope: {
			character: '=ngModel'
		},
		templateUrl: 'components/character-stats-tab/character-stats-tab.html',
		link: function (scope, element) {
			scope.$watch('character', function (character) {
				if (!character) return;
					
				scope.statOptionValues = {
					level: [1],
					superb: [0, 1, 2, 3, 4, 5]
				};
				for (var i = character.value; i <= 6; i++) {
					scope.statOptionValues.level.push(i * 10);
				}
				
				scope.statOptions = {
					level: 1,
					superb: 0,
					bonus: {
						power: 0,
						technique: 0,
						vitality: 0,
						speed: 0
					}
				};
				
				scope.positions = [ 
					[['LWF'], ['ST', 'SS'], ['RWF']],
					[['LM', 'LWM'], ['CM', 'CDM', 'CAM'], ['RM', 'RWM']],
					[['LB', 'LWB'], ['CB'], ['RB', 'RWB']],
					[['GK']]
				].map(function (row) {
					return row.map(function (positions) {
						var position = positions.filter(function (position) {
							return character.positions.indexOf(position) !== -1; 
						}).pop();
						
						if (position) {
							return {
								name: position,
								main: character.positions[0] === position
							};
						} else {
							return null;
						}
					});
				});
				
				scope.stats = {
					power: { name: 'Power', color: 'red' },
					technique: { name: 'Technique', color: 'blue' },
					vitality: { name: 'Vitality', color: 'green' },
					speed: { name: 'Speed', color: 'violet' }
				};
					
			});
			
			scope.$watch('statOptions', function (options) {
				if (options) {
					calculateStats(scope.character, options)	
				}
			}, true);
			
			function calculateStats (character, options) {
				['power', 'technique', 'vitality', 'speed'].forEach(function (stat) {
					scope.stats[stat].value = Calculator.calcPrimaryStat(character, stat, options.level, options.superb, options.bonus[stat]);
				});
				
				var secondaryStats = Calculator.calcSecondaryStats(
					scope.stats.power.value,
					scope.stats.technique.value,
					scope.stats.vitality.value,
					scope.stats.speed.value,
					options.level,
					options.position
				);
				
				scope.secondaryStats = [
					[angular.merge({ name: 'Dribble' }, secondaryStats.dribble), angular.merge({ name: 'Defense' }, secondaryStats.defense)],
					[angular.merge({ name: 'Steal' }, secondaryStats.steal), angular.merge({ name: 'HP' }, secondaryStats.hp)],
					[angular.merge({ name: 'Pass' }, secondaryStats.pass), angular.merge({ name: 'Reflex' }, secondaryStats.reflex)],
					[angular.merge({ name: 'Action Speed' }, secondaryStats.actionSpeed), angular.merge({ name: 'Recovery' }, secondaryStats.recovery)],
					[angular.merge({ name: 'Critical' }, secondaryStats.critical)],
				];
			}
		}
	};
});