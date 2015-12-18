angular.module('app')
.service('Characters', function ($http, $q, Skills, Calculator) {
	var service = this;
	
	var charactersById, characters, rankedPlayers;
	
	var promise = $http.get('data/json_files/characters.json')
	.success(function (data) {
		charactersById = data;
    
    Object.keys(charactersById).forEach(function (id) {
      var primaryStats = {};
      ['power', 'technique', 'vitality', 'speed'].map(function (statName) {
        primaryStats[statName] = Calculator.calcPrimaryStat(charactersById[id], statName, 60, 5, 40);
      });
      var secondaryStats = Calculator.calcSecondaryStats(
        primaryStats.power,
        primaryStats.technique,
        primaryStats.vitality,
        primaryStats.speed,
        60
      );
      charactersById[id].primaryStats = primaryStats;
      charactersById[id].secondaryStats = secondaryStats;
    });
    
		characters = Object.keys(charactersById).map(function (key) {
			return charactersById[key];
		})
		.sort(function (a, b) {
			// by name
			if (a.name.en < b.name.en) return -1;
			if (a.name.en > b.name.en) return 1;
			// by rarity
			if (a.value > b.value) return -1;
			if (a.value < b.value) return 1;
			// by id
			if (a.id < b.id) return -1;
			if (a.id > b.id) return 1;
			return 0;
		});
		
		rankedPlayers = characters.filter(function (character) {
			return character.power.ranking;
		});
	});
	
	service.get = function (id) {
		return promise.then(function () {
			return angular.copy(charactersById[id]);
		});
	};
	
	service.getAll = function (filter) {
		var filters = [];
	
		if (filter.name) {
			var nameRegex = new RegExp(filter.name.split(/\s+/).join('.*'), 'i');
			filters.push(function (character) {
				return character.name.en.match(nameRegex);
			});
		}
		
		['characterType', 'gender', 'type', 'element', 'value', 'stoneElements', 'season', 'weatherImmunity'].forEach(function (filterName) {
			if (filter[filterName]) {
				filters.push(function (character) {
					if (!character[filterName]) {
						return false;
					}
					
					if (Array.isArray(filter[filterName])) {
						if (filter[filterName].length === 0) {
							return true;
						}
						
						var setMethod = (filterName === 'stoneElements') ? 'every' : 'some';
						return filter[filterName][setMethod](function (filterValue) {
							if (Array.isArray(character[filterName])) {
								return character[filterName].some(function (characterValue) {
									return characterValue == filterValue;
								});
							} else {
								return character[filterName] == filterValue;
							}
						});
					} else {
						if (Array.isArray(character[filterName])) {
							return character[filterName].some(function (characterValue) {
								return characterValue == filter[filterName];
							});
						} else {
							return character[filterName] == filter[filterName];
						}
					}
				});
			}
		});
		
		['isSpecial'].forEach(function (filterName) {
			if (typeof filter[filterName] === 'boolean') {
				filters.push(function (character) {
					return character[filterName] == filter[filterName];
				});
			}
		});
		
		filters.push(function (character) {
			if (filter.extremeEvolution !== undefined) {
				if (character.isPlayer) {
					if (filter.extremeEvolution) {
						return character.id >= 30000 && character.id < 40000;	
					} else {
						return character.id >= 20000 && character.id < 30000 &&
							!character.evolution;
					}
				}
			}
			
			if (character.isPlayer || character.isManager) {
				return !character.evolution;
			}
			return true;
		});
		
		var queue = promise;
		if (filter.skill) {
			if (filter.skill.ace) {
				queue = queue.then(function () {
					return Skills.getAll({
						type: 'Ace',
						description: filter.skill.ace
					});
				})
				.then(function (skills) {
					filters.push(function (character) {
						return character.skills.ace && skills.some(function (skill) {
							return skill.id === character.skills.ace;
						});
					});
				});
			}
			if (filter.skill.active) {
				queue = queue.then(function () {
					return Skills.getAll({
						type: 'Active',
						description: filter.skill.active
					});
				})
				.then(function (skills) {
					filters.push(function (character) {
						return character.skills.active && skills.some(function (skill) {
							return skill.id === character.skills.active;
						});
					});
				});
			}
			if (filter.skill.passive) {
				queue = queue.then(function () {
					return Skills.getAll({
						type: 'Passive',
						description: filter.skill.passive
					});
				})
				.then(function (skills) {
					filters.push(function (character) {
						return character.skills.passives && skills.some(function (skill) {
							return character.skills.passives.some(function (skillId) {
								return skillId === skill.id;
							});
						});
					});
				});
			}
		}
		
		return queue.then(function () {
			var result;
			result = filters.reduce(function (prev, filterFn) {
				return prev.filter(filterFn);
			}, characters);
			return result;
		});
	};
	
	service.getRanking = function (stat) {
		return promise.then(function () {
			return rankedPlayers.slice().sort(function (a, b) {
				if (a[stat].ranking < b[stat].ranking) return -1;
				if (a[stat].ranking > b[stat].ranking) return 1;
				return 0;
			});
		});
	};
	
});