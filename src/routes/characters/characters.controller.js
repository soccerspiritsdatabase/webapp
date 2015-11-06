angular.module('app')
.controller('CharactersController', function ($scope, $localStorage, Characters, ImageIcons) {
  var ctrl = this;
  
  ctrl.filterValues = $localStorage.characterFilterValues;
  if (!ctrl.filterValues) {
    ctrl.filterValues = {};
  }
  
  ctrl.formatValue = function (value) {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value;
  };
  
  var filterTemplates = {
    'boolean': {
      options: [
        { value: true },
        { value: false }
      ]
    },
    element: {
      options: [
        { value: 'Ardor', image: ImageIcons.get('element', 'ardor') },
        { value: 'Whirlwind', image: ImageIcons.get('element', 'whirlwind') },
        { value: 'Thunder', image: ImageIcons.get('element', 'thunder') },
        { value: 'Light', image: ImageIcons.get('element', 'light') },
        { value: 'Dark', image: ImageIcons.get('element', 'dark') }
      ]
    }
  };
  
  ctrl.filters = {};
  
  ctrl.filters.characterType = {
    name: 'Character Type',
    options: [
      { value: 'Player' },
      { value: 'Manager' },
      { value: 'Other' },
    ],
    required: true
  };
  
  ctrl.filters.element = angular.merge({}, filterTemplates.element, {
    name: 'Element',
    multiple: true
  });
  
  ctrl.filters.value = {
    name: 'Rarity',
    options: [
      { value: 2, icon: 'star' },
      { value: 3, icon: 'star' },
      { value: 4, icon: 'star' },
      { value: 5, icon: 'star' },
      { value: 6, icon: 'star' },
    ],
    multiple: true
  };
  
  ctrl.filters.gender = {
    name: 'Gender',
    options: [
      { value: 'Male', image: ImageIcons.get('gender', 'male') },
      { value: 'Female', image: ImageIcons.get('gender', 'female') }
    ]
  };
  
  ctrl.filters.extremeEvolution = angular.merge({}, filterTemplates.boolean, {
    name: 'Extreme Evolution'
  });
  
  ctrl.filters.type = {
    name: 'Player Type',
    options: [
      { value: 'Striker', image: ImageIcons.get('type', 'striker') },
      { value: 'Attacker', image: ImageIcons.get('type', 'attacker') },
      { value: 'Defender', image: ImageIcons.get('type', 'defender') },
      { value: 'Assist', image: ImageIcons.get('type', 'assist') },
      { value: 'Leader', image: ImageIcons.get('type', 'leader') }
    ],
    multiple: true
  };
  
  ctrl.filters.stoneElements = angular.merge({}, filterTemplates.element, {
    name: 'Spirit Stone',
    multiple: true
  });
  
  ctrl.filters.weatherImmunity = {
    name: 'Weather Immunity',
    options: [
      { value: 'Rainy Weather', image: ImageIcons.get('weather', 'rainy weather') },
      { value: 'Soul Grave', image: ImageIcons.get('weather', 'soul grave') },
      { value: 'Piercing Wind', image: ImageIcons.get('weather', 'piercing wind') }
    ],
    multiple: true
  }
  
  ctrl.filters.season = {
    name: 'Season',
    options: [
      { value: 1 },
      { value: 2 }
    ]
  };
  
  ctrl.filters.isSpecial = angular.merge({}, filterTemplates.boolean, {
    name: 'Special'
  });
  
  ctrl.skillFilters = {
    ace: { name: 'Ace Skill' },
    active: { name: 'Active Skill' },
    passive: { name: 'Passive Skill' }
  };
  
  ctrl.pageLimits = [20, 40, 60];
  ctrl.pageLimit = ctrl.pageLimits[0];
  
  $scope.$watch(function () {
    return ctrl.filterValues;
  }, function (filter) {
    $localStorage.characterFilterValues = filter;
    
    Characters.getAll(filter).then(function (characters) {
      var maxLimit = ctrl.pageLimits[ctrl.pageLimits.length - 1];
      ctrl.characters = characters.slice(0, maxLimit);
    });
  }, true);
});