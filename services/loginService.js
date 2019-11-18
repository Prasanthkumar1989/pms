'use strict';
projectApp.factory('loginService',function($http, $location, sessionService){
	return{
		login:function(data,scope){
			var $promise=$http.post(site_url+'data/user.php',data); //send data to user.php
			$promise.then(function(msg){
				var uid=msg.data;
				if(uid!='error'){
					//scope.msgtxt='Correct information';
					sessionService.set('uid',uid);
					$location.path('/projects');
				}
				else  {
					scope.msgtxt='incorrect information';
					$location.path('/login');
				}
			});
		},
		logout:function(){
			sessionService.destroy('uid');
			$location.path('/login');
		},
		islogged:function(){
			var $checkSessionServer=$http.post(site_url+'data/check_session.php');
			return $checkSessionServer;
			/*
			if(sessionService.get('user')) return true;
			else return false;
			*/
		}
	}

});
