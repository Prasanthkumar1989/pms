'use strict';
// projectApp App Module
var projectApp = angular.module('projectApp', [
	'ngRoute',
	'angularFileUpload',
	'projectControllers',
	'ngResource'
]);
// projectApp App route provider
projectApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		    when('/login', {
				templateUrl: 'projects/login.html',
				controllers: 'projectLoginController'
			}).
			when('/projects', {
				templateUrl: 'projects/projectList.html',
				controllers: 'projectListController'
			}).
			when('/projects/:projectId', {
				templateUrl: 'projects/projectTemplate.html',
				controllers: 'projectDetailController'
			}).
			when('/add', {
				templateUrl: 'projects/addProject.html',
				controllers: 'addProjectController'
			}).
			when('/edit/:projectId', {
				templateUrl: 'projects/editProject.html',
				controllers: 'editProjectController'
			}).
			when('/delete/:projectId', {
				templateUrl: 'projects/deleteProject.html',
				controllers: 'deleteProjectController'
			}).
			otherwise({
				redirectTo: '/login'
		});
	}]);

projectApp.run(function($rootScope, $location, loginService){
	var routespermission=['/projects','/add','/edit','/delete/'];  //route that require login
	$rootScope.$on('$routeChangeStart', function(){

		if( routespermission.indexOf($location.path()) !=-1)
		{
			var connected=loginService.islogged();
			connected.then(function(msg){
				if(!msg.data) $location.path('/login');
			});
		}
		// if(loginService.islogged())
		// {
		// 	var connected=loginService.islogged();
		// 	connected.then(function(msg){
		// 		if(msg.data) $location.path('/projects');
		// 	});
		// }
	});
});