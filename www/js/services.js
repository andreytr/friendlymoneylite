var mainUrl = 'http://localhost:8080/friendly-money/api/';


angular.module('fm.services', [])

.factory('LoadingService', ['$ionicLoading', function($ionicLoading) {
    return {
        show: function(content) {
            $ionicLoading.show({
                content: content || 'Loading Data',
                animation: 'fade-in',
                showBackdrop: true,
                showDelay: 300
            });
        },

        hide: function() {
            $ionicLoading.hide();
        }
    };
}])


.factory('userService', function($http, $ionicPopup) {

   return {
        login: function(username, password) {
             return $http.post(mainUrl + "user/login", {
                    name: username,
                    password: password
                 }
             )
             .success(function(result) {
                 return true;
             });
        },

        register: function(userData) {
             return $http.post(mainUrl + "user/register", userData)
             .success(function(result) {
                 return true;
             });
        }
   }
})

.factory('accountService', function($http) {

   return {
        getList: function() {
             return $http.get(mainUrl + "account/list")
             .then(function(result) {
                 return result.data;
             });
        }
   }
})

.factory('operationService', function($http) {

   return {
        getList: function() {
             return $http.post(mainUrl + "operation/list", {})
             .success(function(result) {
                 return result;
             });
        }
   }
})


.factory('reportService', function($http) {

    var reportList = [];

    var loadReportList = function() {
        return $http.get(mainUrl + "report/list")
            .then(function(result) {
                reportList = result.data;
                return reportList;
            });
    }

    var getReportByName = function(name) {
        if (reportList && reportList.length) {
            for(var i = 0; i < reportList.length; i++) {
                var report = reportList[i];
                if (report['name'] == name) {
                    return report;
                }
            }
        }
        return null;
    }

    return {
        getList: loadReportList,
        getReportByName: getReportByName,
        getData: function(reportName, filter) {
            return $http.post(mainUrl + "report/data?reportName=" + reportName, filter)
             .success(function(result) {
                 return result;
             });
        }
    }

});

