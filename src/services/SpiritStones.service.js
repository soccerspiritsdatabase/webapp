angular.module('app')
.service('SpiritStones', function ($http, $q, Skills, ImageIcons) {
	var service = this;
	
	var spiritStones, spiritStonesById;
	
	var promise = $http.get('data/json_files/spiritStones.json').success(function (data) {
		spiritStonesById = data;
		
		spiritStones = Object.keys(spiritStonesById)
		.map(function (id) {
			return spiritStonesById[id];
		})
		.filter(function (spiritStone) {
			return spiritStone.value >= 6;
		})
		.sort(function (a, b) {
			if (a.name.en < b.name.en) return -1;
			if (a.name.en > b.name.en) return 1;
			if (a.value < b.value) return -1;
			if (a.value > b.value) return 1;
			if (a.id < b.id) return -1;
			if (a.id > b.id) return 1;
			return 0;
		});
		
		spiritStones.forEach(function (spiritStone) {
			if (spiritStone.rarity === 'Unique') {
				spiritStone.iconImage = ImageIcons.get('stone', spiritStone.iconImage);	
			} else {
				spiritStone.iconImage = ImageIcons.get('stone', spiritStone.element + '-' + spiritStone.rarity);
			}
			if (spiritStone.zodiac) {
				spiritStone.zodiacImage = ImageIcons.get('stone', spiritStone.zodiac);	
			}
		});
	});
	
	service.getAll = function (filter) {
		if (!filter) {
			filter = {};
		}
		
		var filters = [];
		
		if (filter.name) {
			var nameRegex = new RegExp(filter.name.split(/\s+/).join('.+'), 'i');
			filters.push(function (spiritStone) {
				return spiritStone.name.en.match(nameRegex);
			});
		}
		
		['element', 'zodiac', 'rarity'].forEach(function (filterName) {
			if (filter[filterName]) {
				filters.push(function (spiritStone) {
					return spiritStone[filterName] === filter[filterName];
				});
			}
		});
		
		var queue = promise;
		if (filter.skill) {
			queue = queue.then(function () {
				return Skills.getAll({
					type: 'Item',
					description: filter.skill
				});
			})
			.then(function (skills) {
				filters.push(function (spiritStone) {
					return spiritStone.skills.some(function (skillId) {
						return skills.some(function (skill) {
							return skill.id === skillId;
						});
					});
				});
			});
		}
		
		return queue.then(function () {
			return filters.reduce(function (prev, filterFn) {
				return prev.filter(filterFn);
			}, spiritStones);
		});
	};
	
});