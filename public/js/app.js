/**
 * Created by USER on 10/21/2016.
 */
var app = angular.module('myApp', ['ui.router','todoappmodule']);
app.config(function ($urlRouterProvider,$stateProvider,$locationProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('login', {
                    url: "/",
                    templateUrl: "../login.html",
                    controller: 'loginController',
                     controllerAs: 'userlogin'
                   })
               .state('signUp', {
                       url: "/signUp",
                       templateUrl: "signUp.html",
                       controller: 'signUpController'

                   })
                   .state('toDoApp', {
                             url: "/toDoApp",
                             templateUrl: "toDoApp.html",
                             controller: 'toDoAppController',
                              controllerAs: 'todoApp'
                         }).state('managesession', {
                             url: "/managesession",
                            
                             controller: 'managesessionController',
                              controllerAs: 'managesession'
                         });;
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

   
});
app.controller('managesessionController', function ($scope, $http, $location, $state,$window,$timeout,$rootScope,GetReports) {
var data=JSON.parse(localStorage.getItem("access_Token"));
$scope.userInfo=false;
if(data !=='' && data != undefined && data != null){
$rootScope.username=data.username;
$scope.userInfo=true;
console.log("data.username"+data.username);

}
$scope.logout=function(){
    localStorage.removeItem("access_Token");
    $state.go('login');
     setTimeout(function(){  location.reload() }, 1000);
   // location.reload();

}
});
app.controller('toDoAppController', function ($scope, $http, $location, $window,$timeout,$rootScope,GetReports) {

var report=this;
var data=JSON.parse(localStorage.getItem("access_Token"));
var getReports=function(){
    GetReports.getUserReport(data.userId,data.access_token).then(function(response) {
       report.reports=response.user;
            
              }, function() {

            });
};
getReports();
$scope.removeRecord=function(id){
GetReports.removeRecordData(id).then(function(response) {
getReports();
});
}
$scope.addreport={"date":new Date(),"userId":data.userId}


console.log("data"+JSON.stringify(data));
$scope.addItems=function(){
console.log('enter'+JSON.stringify($scope.addreport));

 GetReports.postReport($scope.addreport,data.access_token).then(function(response) {
      
               if(response.status=='success'){
                  // $('#myModal').modal().hide();
                  $scope.addreport={};
                   $("#myModal").modal('hide');
                   getReports();
               }
            
              }, function() {

            });
}
report.getStatus=function(status){
   
    if(status=='New'){
     return ['Open','Reject'];
    }else if(status=='Open'){
     return ['Compleated','Reject'];
    }else if(status=='Compleated'){
        return ['Delete'];
    }else if(status=='Reject'){
        return ['Re open','Delete'];
    }
}

});

app.controller('loginController', function ($scope, $http, $location, $window,$rootScope,$timeout, $state,GetReports) {

$(function() {

    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

});
 var login = this;
login.userRegister={"username":"",
"email":"",
"password":""
};
login.userLoginData={
"email":"",
"password":""
};

login.userRegisterData=function(){
    if(login.userRegister.username!=''){
         if(login.userRegister.email!=''){
    if(login.userRegister.password==login.cpassword){
    GetReports.userRegister(login.userRegister).then(function(response) {
        if(response.status=='success'){
            login.userLoginData.email=login.userRegister.email;
            login.userLoginData.password=login.userRegister.password;
            login.userLoginSubmit();
            login.userRegister={};
        }else{
            $scope.message=response.message;
             $timeout(function () {
         $scope.message='';
    }, 2000);
            
        }
    });
}else{
    $scope.message="Passwords Don't Match";
             $timeout(function () {
         $scope.message='';
    }, 2000);
            
}
}else{
    $scope.message="Enter Email";
             $timeout(function () {
         $scope.message='';
    }, 2000);
            
}
}else{
    $scope.message="Enter Username";
             $timeout(function () {
         $scope.message='';
    }, 2000);
            
}
    //$state.go('toDoApp');
}
login.userLoginSubmit=function(){
 GetReports.userLogin(login.userLoginData).then(function(response) {
               if(response.success==true){
                   localStorage.setItem("access_Token", JSON.stringify({"access_token":response.token,"userId":response.userId,'username':response.username}));
                  $state.go('toDoApp');
                  setTimeout(function(){  location.reload() }, 1000);
               }else{
                    $scope.message=response.message;
                      $timeout(function () {
         $scope.message='';
    }, 2000);
               }
              }, function() {

            });

}

});
app.directive('allowPattern', [allowPatternDirective]);

function allowPatternDirective() {
    return {
        restrict: "A",
        compile: function() {
            return function(scope, element, attrs) {

                element.bind("keypress", function(event) {
                    var keyCode = event.which || event.keyCode;
                    var keyCodeChar = String.fromCharCode(keyCode);


                    if (!keyCodeChar.match(new RegExp(attrs.allowPattern, "i"))) {
                        event.preventDefault();
                        return false;
                    }

                });
            };
        }
    };
 }
 app.directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.myForm.password.$viewValue
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
})