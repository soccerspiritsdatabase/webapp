angular.module('app')
.config(function ($compileProvider, $stateProvider, $urlRouterProvider) {
  $compileProvider.debugInfoEnabled(false);
  
  $urlRouterProvider.otherwise('/characters');
  
  $stateProvider
  .state('characters', {
    url: '/characters',
    templateUrl: 'routes/characters/characters.html',
    controller: 'CharactersController as ctrl'
  })
  .state('character-details', {
    url: '/characters/details/:characterId',
    templateUrl: 'routes/character-details/character-details.html',
    controller: 'CharacterDetailsController as ctrl'
  })
  .state('spirit-stones', {
    url: '/spiritstones',
    templateUrl: 'routes/spirit-stones/spirit-stones.html',
    controller: 'SpiritStonesController as ctrl'
  })
  .state('rankings', {
    url: '/rankings',
    templateUrl: 'routes/rankings/rankings.html',
    controller: 'RankingsController as ctrl'
  });
});