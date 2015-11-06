angular.module('app')
.controller('RankingsController', function ($q, Characters) {
  var ctrl = this;
  
  ctrl.limits = [10, 25, 50, 100];
  ctrl.limit = ctrl.limits[0];
  
  ctrl.stats = ['power', 'technique', 'vitality', 'speed'];
  
  ctrl.statNames = {
    power: 'Power',
    technique: 'Technique',
    vitality: 'Vitality',
    speed: 'Speed'
  };
  
  ctrl.ranking = {};
  ['power', 'technique', 'vitality', 'speed'].forEach(function (statName) {
    Characters.getRanking(statName)
    .then(function (characters) {
      ctrl.ranking[statName] = characters;
    });
  })
});