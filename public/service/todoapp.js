var todoApp=angular.module('todoappmodule',[]);

todoApp.factory('GetReports',['$http','$q', function ($http, $q) {
    return {
        getUserReport: function (userId,access_token) {

            return $http({
                method: "POST",
                url:'/api/report?token='+access_token,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                data:{'userId':userId}
            })
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        },
         postReport: function (postdata,token) {

            return $http({
                method: "POST",
                url:'/api/createreport?token='+token,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                data:postdata
            })
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        },userLogin: function (userLogin) {
           
            return $http({
                method: "POST",
                url:'/api/login',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                data:userLogin
            })
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        },userRegister: function (userRegister) {
           
            return $http({
                method: "POST",
                url:'/api/userRegister',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                data:userRegister
            })
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        },removeRecordData: function (recordid) {
           console.log("emter")
            return $http({
                method: "POST",
                url:'/api/reportdelete',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                data:{"taskname":recordid}
            })
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        }


    };
}]);