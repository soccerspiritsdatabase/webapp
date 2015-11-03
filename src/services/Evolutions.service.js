angular.module('app')
.service('Evolutions', function ($http, $q, Characters) {
	var service = this;
	
	var evolutionsById, evolutions;
	
	var promise = $http.get('data/json_files/evolutions.json')
	.success(function (data) {
		evolutionsById = data;
		evolutions = Object.keys(evolutionsById).map(function (key) {
			return evolutionsById[key];
		});
	});
	
	service.get = function (characterId) {
		return promise.then(function () {
			for (var i = 0; i < evolutions.length; i++) {
				if (evolutions[i].preResult === characterId) {
					return processMaterials(angular.copy(evolutions[i]));
				}
			}
			return null;
		});
	};
	
	service.reverse = function (characterId) {
		return promise.then(function () {
			for (var i = 0; i < evolutions.length; i++) {
				if (evolutions[i].result === characterId) {
					return processMaterials(angular.copy(evolutions[i]));
				}
			}
			return null;
		});
	};
	
	function processMaterials (evolution) {
		if (evolution) {
			return $q.all(evolution.materials.map(function (material) {
				return Characters.get(material.character);
			}))
			.then(function (characters) {
				evolution.materials.forEach(function (material, index) {
					material.character = characters[index];
				});
				return evolution;
			});	
		}
		return null;
	}
});;