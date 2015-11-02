angular.module('app')
.service('Calculator', function () {
	var service = this;
	
	var MAX_LEVEL = 60;
	var POSITION_STATS = {
		LWF: {
			dribble: 0.1,
			hp: 0.05,
			actionSpeed: 0.1,
			critical: 0.05
		},
		ST: {
			dribble: 0.1,
			actionSpeed: 0.05,
			critical: 0.1,
			steal: 0.05
		},
		SS: {
			dribble: 0.05,
			defense: 0.05,
			actionSpeed: 0.1,
			critical: 0.05,
			reflex: 0.05
		},
		RWF: {
			dribble: 0.1,
			hp: 0.05,
			actionSpeed: 0.1,
			critical: 0.05
		},
		LWM: {
			dribble: 0.05,
			hp: 0.05,
			recovery: 0.05,
			actionSpeed: 0.05,
			critical: 0.05,
			reflex: 0.05,
			pass: 0.05
		},
		CAM: {
			dribble: 0.05,
			recovery: 0.05,
			actionSpeed: 0.05,
			critical: 0.1,
			reflex: 0.05,
			pass: 0.05
		},
		CM: {
			dribble: 0.05,
			defense: 0.05,
			recovery: 0.1,
			reflex: 0.05,
			pass: 0.1,
			steal: 0.05
		},
		RWM: {
			dribble: 0.05,
			hp: 0.05,
			recovery: 0.05,
			actionSpeed: 0.05,
			critical: 0.05,
			reflex: 0.05,
			pass: 0.05
		},
		LM: {
			dribble: 0.05,
			defense: 0.05,
			recovery: 0.1,
			reflex: 0.05,
			pass: 0.1,
			steal: 0.05
		},
		RM: {
			dribble: 0.05,
			defense: 0.05,
			recovery: 0.1,
			reflex: 0.05,
			pass: 0.1,
			steal: 0.05
		},
		CDM: {
			defense: 0.1,
			hp: 0.05,
			reflex: 0.1,
			steal: 0.05
		},
		LWB: {
			dribble: 0.05,
			defense: 0.05,
			hp: 0.05,
			recovery: 0.05,
			reflex: 0.1,
			pass: 0.05
		},
		RWB: {
			dribble: 0.05,
			defense: 0.05,
			hp: 0.05,
			recovery: 0.05,
			reflex: 0.1,
			pass: 0.05
		},
		LB: {
			defense: 0.05,
			hp: 0.1,
			recovery: 0.05,
			reflex: 0.05,
			pass: 0.05,
			steal: 0.05
		},
		CB: {
			defense: 0.1,
			hp: 0.1,
			reflex: 0.05,
			steal: 0.05
		},
		RB: {
			defense: 0.05,
			hp: 0.1,
			recovery: 0.05,
			reflex: 0.05,
			pass: 0.05,
			steal: 0.05
		},
		GK: {
			defense: 0.15,
			hp: 0.3,
			steal: 0.05
		}
	};
	
	service.calcPrimaryStat = function (character, stat, level, superb, bonus) {
		var min = Math.floor(character[stat].min * minStatRate(character.value, level));
		var max = character[stat].max;
		var range = max - min;
		var increment = range / (MAX_LEVEL - 1);
		
		var value = Math.floor(min + (increment * (level - 1)));
		if (!isNaN(superb) && superb > 0) {
			// +10% per superb
			value = Math.floor(value + (value * 0.1 * superb));
		}
		if (!isNaN(bonus) && bonus > 0) {
			value = Math.floor(value + bonus);
		}
		return value;
	};
	
	service.calcSecondaryStats = function (power, technique, vitality, speed, level, position) {
		var stats = {
			dribble: { value: Math.floor(5 + power + (speed * 0.2)) },
			defense: { value: Math.floor((vitality * 0.2) + (technique * 0.8)) },
			steal: { value: Math.floor(5 + technique + (speed * 0.2)) },
			hp: { value: Math.floor(20 + (level * 0.8) + Math.round(vitality * 1.8)) },
			pass: { value: Math.floor(3 + (technique * 0.8)) },
			reflex: { value: Math.floor(((5 + technique + (speed / 12)) / 4 / (level + 30)) * 1000) },
			actionSpeed: { value: Math.floor(30 + (speed * 0.1)) },
			recovery: { value: 0.03 + (power + vitality) * 0.002 },
			critical: { value: 0.05 + (power * 0.3 + technique * 0.8 + speed * 0.4) * 0.001 }
		};
		
		if (position && position.name && POSITION_STATS[position.name]) {
			var positionStats = POSITION_STATS[position.name];
			Object.keys(positionStats).forEach(function (stat) {
				var value = positionStats[stat];
				value *= (position.main) ? 2 : 1.5;
				
				if (stat === 'critical') {
					stats[stat].value += value;
				} else {
					stats[stat].value += stats[stat].value * value;
					if (stat !== 'recovery') {
						stats[stat].value = Math.floor(stats[stat].value);
					}
				}
				
				stats[stat].positionBuff = true;
			});
		}
		
		stats.recovery.value = round(stats.recovery.value, 100);
		stats.critical.value = round(stats.critical.value * 100, 10) + '%';
		return stats;
	};
	
	function minStatRate (value, level) {
		if (level / 10 > value) {
			value = Math.ceil(level / 10);
		}
		return Math.min(1, Math.pow(0.176, (6 - value) / 10));
	}
	
	function round (value, accuracy) {
		if (isNaN(accuracy)) {
			return Math.round(value);
		}
		return Math.round(value * accuracy) / accuracy;
	}
});