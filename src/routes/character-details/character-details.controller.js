angular.module('app')
.controller('CharacterDetailsController', function ($scope, $stateParams, Characters, Calculator, ImageIcons) {
  var ctrl = this;
  
  Characters.get($stateParams.characterId)
  .then(function (character) {
    ctrl.character = character;
    
    ctrl.imageIcons = {
      gender: ImageIcons.get('gender', character.gender),
      element: ImageIcons.get('element', character.element),
      type: ImageIcons.get('type', character.type),
      weatherImmunity: ImageIcons.get('weather', character.weatherImmunity),
      special: ImageIcons.get('other', 'special'),
      stoneElements: (character.stoneElements) ? character.stoneElements.map(function (element) {
        return ImageIcons.get('element', element);
      }) : []
    };
    
    ctrl.tabs = {
      stats: { name: 'Stats' },
      skills: { name: 'Skills' },
      evolution: { name: 'Evolution' },
      chains: { name: 'Chains' }
    };
    ctrl.selectedTab = Object.keys(ctrl.tabs).shift();
    
    ctrl.tabs = {};
    if (!character.isManager) {
      ctrl.tabs.stats = { name: 'Stats' }
    }
    ctrl.tabs.skills = { name: 'Skills' };
    ctrl.tabs.evolution = { name: 'Evolution' };
    if (character.chain) {
      ctrl.tabs.chains = { name: 'Chains' };
    }
    
    Object.keys(ctrl.tabs).forEach(function (key) {
      var tab = ctrl.tabs[key];
      
      tab.select = function () {
        ctrl.selectedTab = {};
        ctrl.selectedTab[key] = true;
      };
      tab.isSelected = function () {
        return ctrl.selectedTab[key];
      };
    });
    ctrl.selectedTab = {};
    ctrl.selectedTab[Object.keys(ctrl.tabs).shift()] = true;
  });
});