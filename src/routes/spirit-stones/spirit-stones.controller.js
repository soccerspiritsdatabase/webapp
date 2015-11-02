angular.module('app')
.controller('SpiritStonesController', function ($scope, $localStorage, SpiritStones, ImageIcons) {
  var ctrl = this;
  
  ctrl.filterValues = $localStorage.spiritStoneFilterValues;
  if (!ctrl.filterValues) {
    ctrl.filterValues = {};
  }
  
  ctrl.filters = {};
  
  ctrl.filters.element = {
    name: 'Element',
    options: [
      { value: 'Ardor', image: ImageIcons.get('element', 'ardor') },
      { value: 'Whirlwind', image: ImageIcons.get('element', 'whirlwind') },
      { value: 'Thunder', image: ImageIcons.get('element', 'thunder') },
      { value: 'Light', image: ImageIcons.get('element', 'light') },
      { value: 'Dark', image: ImageIcons.get('element', 'dark') }
    ]
  };
  
  ctrl.filters.rarity = {
    name: 'Rarity',
    options: [
      { value: 'Common' },
      { value: 'Rare' },
      { value: 'Unique' }
    ]
  };
  
  ctrl.filters.zodiac = {
    name: 'Zodiac',
    options: [
      'Aquarius', 'Aries',
      'Cancer', 'Capricorn',
      'Gemini',
      'Leo', 'Libra',
      'Pisces',
      'Sagittarius', 'Scorpio',
      'Taurus',
      'Virgo'
    ].map(function (name) {
      return {
        value: name,
        image: ImageIcons.get('stone', name)
      };
    })
  };
  
  $scope.$watch(function () {
    return ctrl.filterValues;
  }, function (filter) {
    $localStorage.spiritStoneFilterValues = ctrl.filterValues;
  
    SpiritStones.getAll(filter).then(function (spiritStones) {
      ctrl.spiritStones = spiritStones;
    });
  }, true);
});