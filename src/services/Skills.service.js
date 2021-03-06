angular.module('app')
.service('Skills', function ($http, $q) {
	var service = this;
	
	var skillsById, skills;
	
	var promise = $http.get('data/json_files/skills.json')
	.success(function (data) {
		skillsById = data;
		skills = Object.keys(skillsById).map(function (key) {
			return skillsById[key];
		});
	});
	
	service.get = function (id) {
		return promise.then(function () {
			return angular.copy(skillsById[id]);
		});
	};
	
	service.getAll = function (filter) {
		var filters = [];
		
		['type'].forEach(function (filterName) {
			if (filter[filterName]) {
				filters.push(function (skill) {
					return skill[filterName] === filter[filterName];
				});
			}
		});
		
		if (filter.description) {
			try {
				var regexArr = filter.description.split(/\s+/).map(function (str) {
					return new RegExp(str, 'i');
				});
				filters.push(function (skill) {
					return regexArr.every(function (regex) {
						return skill.description.en.match(regex);
					});
				});	
			} catch (e) {}
		}
		
		return promise.then(function () {
			var result;
			result = filters.reduce(function (prev, filterFn) {
				return prev.filter(filterFn);
			}, skills);
			return result;
		});
	};
});