angular.module('app')
.controller('CharactersController', function ($scope, $timeout, $interval, $localStorage, Cache, Characters, ImageIcons) {
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
      { value: 'Leader', image: ImageIcons.get('type', 'leader') },
      { value: 'Goal Keeper', image: ImageIcons.get('type', 'goal keeper') }
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
  
  var pageLimitInterval = null;
  ctrl.pageLimits = [20, 40, 60, 'All'];
  ctrl.pageLimit = ctrl.pageLimitActual = ctrl.pageLimits[0];
  ctrl.setPageLimit = function (limit) {
    ctrl.pageLimit = limit;
    if (pageLimitInterval) {
      $interval.cancel(pageLimitInterval);
    }
    
    if (limit <= 60) {
      ctrl.pageLimitActual = limit; 
    } else {
      ctrl.pageLimitActual = 60;
      var count = Math.ceil((limit - ctrl.pageLimitActual) / 5);
      pageLimitInterval = $interval(function () {
        ctrl.pageLimitActual += 5;
      }, 100, count);
    }
  };
  
  ctrl.layouts = ['grid', 'list'];
  ctrl.layout = ctrl.layouts[0];
  
  ctrl.getImageIcon = function (type, name) {
    return ImageIcons.get(type, name);
  };
  
  $scope.$watch(function () {
    return ctrl.sortBy;
  }, getCharacters);
  
  $scope.$watch(function () {
    return ctrl.layout;
  }, function () {
    delete ctrl.sortBy;
  })
  
  $scope.$watch(function () {
    return ctrl.filterValues;
  }, getCharacters, true);
  
  function getCharacters () {
    $localStorage.characterFilterValues = ctrl.filterValues;
    
    Characters.getAll(ctrl.filterValues, ctrl.sortBy).then(function (characters) {
      ctrl.characters = characters;
    });
  }

  // remembers previous scroll position  
  $scope.$on('$stateChangeSuccess', function () {
    var scrollTop = Cache.get('charactersState:scrollTop') || 0;
    $timeout(function () {
      document.documentElement.scrollTop = document.body.scrollTop = scrollTop;
    }, 0);
  });
  $scope.$on('$stateChangeStart', function () {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
    Cache.put('charactersState:scrollTop', scrollTop);
  });
});