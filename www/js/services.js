//var mainUrl = 'https://friendly-money.com/api/';
var mainUrl = 'http://192.168.0.101:8080/friendly-money/api/';


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
        },
        getTypeList: function() {
             return $http.get(mainUrl + "account/typeList")
             .then(function(result) {
                 return result.data;
             });
        },
        getCurrencyList: function() {
             return $http.get(mainUrl + "account/currencyList")
             .then(function(result) {
                 return result.data;
             });
        },
        update: function(account) {
            return $http.post(mainUrl + "account/update", account)
            .success(function(result) {
                return result;
            });
        },
        remove: function(accountId) {
            return $http.post(mainUrl + "account/delete/" + accountId)
            .success(function(result) {
                return result;
            });
        }
   }
})

.factory('categoryService', function($http) {

   return {
        getTreeList: function() {
            return $http.get(mainUrl + "categories/treeAmountList")
            .then(function(result) {
                return result.data;
            });
        },

        update: function(category) {
            return $http.post(mainUrl + "categories/update", category)
            .success(function(result) {
                return result;
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
    var dataFilter = {};

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

    var getDataFilter = function() {
        return dataFilter;
    }

    var setDataFilter = function(filter) {
        dataFilter = filter;
    }

    return {
        getList: loadReportList,
        getReportByName: getReportByName,
        setDataFilter: setDataFilter,
        getDataFilter: getDataFilter,
        getData: function(reportName) {
            return $http.post(mainUrl + "report/data?reportName=" + reportName, dataFilter)
             .success(function(result) {
                 return result;
             });
        }
    }

})

.factory('iconService', function() {

   return {
        getAccountIcon: function(type) {
             if (type) {
                 if (type.type == 1) {
                     return 'ion-cash';
                 }
                 if (type.type == 2) {
                     return 'ion-card';
                 }
                 if (type.type == 3) {
                     return 'ion-briefcase';
                 }
                 if (type.type == 4) {
                     return 'ion-earth';
                 }
             }
             return 'ion-help';
        },

        getAccountColor: function(type) {
             if (type) {
                 if (type.type == 1) {
                     return '#b9ab6a';
                 }
                 if (type.type == 2) {
                     return '#94b46b';
                 }
                 if (type.type == 3) {
                     return '#b46e70';
                 }
                 if (type.type == 4) {
                     return '#6da1b6';
                 }
             }
             return '#00b9f2';
        },

        getCurrencyIcon: function(type) {
            if (type == 'RUB') {
                return 'fa fa-rub';
            }
            if (type == 'USD') {
                return 'fa fa-usd';
            }
            if (type == 'EUR') {
                return 'fa fa-eur';
            }
            if (type == 'CNY') {
                return 'fa fa-cny';
            }
            if (type == 'JPY') {
                return 'fa fa-jpy';
            }
            if (type == 'GBP') {
                return 'fa fa-gbp';
            }

            return type ? 'currency-' + type.toLowerCase() : 'ion-help';
        }
   }
});

