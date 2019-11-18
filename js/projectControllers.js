'use strict';

// Controller Module
var projectControllers = angular.module('projectControllers', ['ngResource']);

// Controller that handles the add project page and how the data is passed to the PHP file.
projectControllers.controller('projectLoginController', ["$scope", "$http", "$location",'loginService',
function ($scope, $http, $location,loginService){

  $scope.msgtxt='';
  $scope.doLogin=function(data){

    loginService.login(data,$scope); //call login service
  }

}]);
// Controller for displaying the list of projects, with 3 second timeout delay
projectControllers.controller('projectListController', [ "$scope", "$http", "$timeout","$resource","loginService",
	function ($scope, $http, $timeout,$resource,loginService) {
     $scope.sort = "id";
  $scope.page = 1;
  $scope.perPage = 10;
  $scope.query = '';
  $scope.state = '';
  $scope.headers = ['title'];
  var api = $resource(site_url+'projects/projects.php?action=list',
    {per_page:$scope.perPage,q:$scope.query},
    {query: {method:'GET', isArray:false}});

  $scope.updateList = function(){
    var query = $scope.query;
    if ($scope.state){
      query += " name:"+$scope.state;

    }

    api.query({
      sort:$scope.sort,
      page:$scope.page,
      per_page:$scope.perPage,
      q:query
    }, function(data){

      $scope.projects = data.items;
      $scope.loading = false;
      $scope.sortField = 'name';
      $scope.reverse = false;
      $scope.lastPage = Math.ceil(data.total_count/$scope.perPage);
    });
  };
  $scope.$watchCollection('[query,page,sort,perPage]',function(){
    $scope.updateList();
  });
  $scope.nextPage = function(){
    if ($scope.lastPage !== $scope.page){
      $scope.page++;
    }
  };
  $scope.previousPage = function(){
    if ($scope.page !== 1){
      $scope.page--;
    }
  };

  $scope.logout=function(){
    loginService.logout();
  }

   /* $timeout(function(){

      $http({method: 'GET', url: 'projects/projects.php?action=list'}).success(function(data){
        $scope.projects = data;
        $scope.loading = false;
      }, 3000);
      });
    $scope.sortField = 'name';
    $scope.reverse = false;*/



}]);


// Controller for displaying the details of the project when the name is clicked, with 3 second timeout delay
projectControllers.controller('projectDetailController', ["$scope", "$routeParams", "$http", "$timeout",
	function ($scope, $routeParams, $http, $timeout){
    $timeout(function(){
      $scope.projectId = $routeParams.projectId;
      $http({method: 'GET', url: site_url+'projects/projects.php?action=detail&id=' + $scope.projectId}).success(function(data){
        $scope.project = data;
        $scope.loading = false;
      }, 3000);
    });
}]);
// Controller that handles the add project page and how the data is passed to the PHP file.
projectControllers.controller('addProjectController', ["$scope", "$http", "$location",
function ($scope, $http, $location){
  $scope.addProject = function(){
    //Append all data to a new 'formData();'
    var formData = new FormData();

    formData.append("name", $scope.name);
    formData.append("category", $scope.category);
    formData.append("demo_link", $scope.demo_link);
    formData.append("live_link", $scope.live_link);
    formData.append("image", $scope.imageSubmit);
    formData.append("details", $scope.details);
    formData.append("ftp_details", $scope.ftp_details);
    formData.append("cpanel_details", $scope.cpanel_details);
    formData.append("status", $scope.status);

    //post form data to the action case of the php switch
    $http.post(site_url+"projects/projects.php?action=add", formData, { transformRequest: angular.identity, headers: { "Content-Type": undefined } }).success(function(data){
       //once project is added, redirect user back to the projects list
       $location.path('/projects');
       console.log(formData);
    return false;
       //return false;
    });
  };
}]);
//Controller that handles the edit project page and how the data is pulled/pushed to the DB
projectControllers.controller('editProjectController', ["$scope", "$routeParams", "$http", "$location",
  function ($scope, $routeParams, $http, $location){
    $scope.projectId = $routeParams.projectId;
    $http({method: 'GET', url: site_url+'projects/projects.php?action=detail&id=' + $scope.projectId}).success(function(data){
      $scope.projectedit = data;
    });
    $scope.editProject = function(){
    //Append all data to a new 'formData();'
    var formData = new FormData();
    formData.append("name", $scope.projectedit.name);
    formData.append("category", $scope.projectedit.category);
    formData.append("demo_link", $scope.projectedit.demo_link);
    formData.append("live_link", $scope.projectedit.live_link);
    if ($scope.imageSubmit){
		 formData.append("image", $scope.imageSubmit);
    } else {
       formData.append("image", $scope.projectedit.image);
    }
    formData.append("details", $scope.projectedit.details);
    formData.append("ftp_details", $scope.projectedit.ftp_details);
    formData.append("cpanel_details", $scope.projectedit.cpanel_details);
    formData.append("status", $scope.projectedit.status);
    //post form data to the action case of the php switch

    $http.post(site_url+"projects/projects.php?action=edit&id=" + $scope.projectedit.id, formData, { transformRequest: angular.identity, headers: { "Content-Type": undefined } }).success(function(data){

       //once project is added, redirect user back to the projects list
     //$location.path('/projects/' + $scope.projectedit.id);
     $location.path('/projects/');
       return false;
    });
  };
}]);
// Controller that handles the edit project page
projectControllers.controller('deleteProjectController', ["$scope", "$routeParams", "$http", "$location",
  function ($scope, $routeParams, $http, $location){
    $scope.projectId = $routeParams.projectId;
    $http({method: 'GET', url: site_url+'projects/projects.php?action=detail&id=' + $scope.projectId}).success(function(data){
      $scope.projectdelete = data;
    });
    $scope.deleteProject = function(){
      $http.post(site_url+"projects/projects.php?action=delete&id=" + $scope.projectId).success(function(data){
        $location.path('/projects');
      });
    };
  }]);



// Directive that adds file read to the image upload in the add project controller
projectControllers.directive("fileread", [function () {
  return {
    scope: {
      fileread: "="
    },
  link: function (scope, element, attributes) {
    element.bind("change", function (changeEvent) {
      var reader = new FileReader();
        reader.onload = function (loadEvent) {
          scope.$apply(function () {
            scope.fileread = loadEvent.target.result;
          });
        }
      reader.readAsDataURL(changeEvent.target.files[0]);
    });
  }
  }
}]);
// Directive that handles the back button which can be implemented where needed.
projectControllers.directive('backButton', function(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('click', function () {
          history.back();
          scope.$apply();
        });
      }
    }
});
//Directive that makes sure any 'value' attribute assigned to an input field is bound properly.
projectControllers.directive('input', function ($parse) {
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function (scope, element, attrs) {
      if (attrs.ngModel && attrs.value) {
        $parse(attrs.ngModel).assign(scope, attrs.value);
      }
    }
  };
});
//Setting the initial loading to be true for the 3 second delay on the details and list page
projectControllers.run(function($rootScope){
  $rootScope.loading = true;
});
