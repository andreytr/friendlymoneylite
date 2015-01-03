angular.module('fm', ['ionic', 'fm.controllers', 'fm.services'])

.run(function($ionicPlatform, $http, $rootScope, $ionicLoading, $ionicPopup) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
    });

    $rootScope.$on('loading:show', function() {
        $ionicLoading.show({
            animation: 'fade-in',
            showBackdrop: true,
            template: 'Загрузка'
        })
    })

    $rootScope.$on('loading:hide', function() {
        $ionicLoading.hide();
    })

    $rootScope.$on('loading:showError', function(event, message) {
        $ionicLoading.hide();
        $ionicPopup.alert({
             cssClass: 'error',
             template: message
        });
    })

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.common["Access-Control-Allow-Origin"] = "localhost:8100";
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

    $ionicConfigProvider.backButton.text('');

    $httpProvider.interceptors.push(function($q, $rootScope) {
        return {
            request: function(config) {
                $rootScope.$broadcast('loading:show')
                return config
            },
            response: function(response) {
                $rootScope.$broadcast('loading:hide');
                if (response.data && typeof response.data === 'object' && 'rows' in response.data) {
                    if (response.data.success) {
                        response.data = response.data.rows;
                    }
                    else if (response.data.errors && response.data.errors.length > 0) {
                        $rootScope.$broadcast('loading:showError', response.data.errors[0].message);
                        return $q.reject(response);
                    }
                    else {
                        $rootScope.$broadcast('loading:showError', "Ошибка сервера");
                        return $q.reject(response);
                    }
                }

                return response
            },
            'responseError': function(rejection) {
                $rootScope.$broadcast('loading:hide')
                if (rejection.status == 0) {
                    $rootScope.$broadcast('loading:showError', 'Сервер не доступен');
                }
                return $q.reject(rejection);
            }
        }
    });


    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })

    .state('registration', {
        url: '/registration',
        templateUrl: 'templates/registration.html',
        controller: 'RegistrationCtrl'
    })

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })

    .state('app.main', {
        url: "/main",
        views: {
            'menuContent': {
                templateUrl: "templates/main.html",
                controller: 'MainCtrl'
            }
        }
    })

    .state('app.operations', {
        url: "/operations",
        views: {
            'menuContent': {
                templateUrl: "templates/operations.html",
                controller: 'OperationsCtrl'
            }
        }
    })

    .state('app.accounts', {
        url: "/accounts",
        views: {
            'menuContent': {
                templateUrl: "templates/accountList.html",
                controller: 'AccountsCtrl'
            }
        }
    })

    .state('app.categories', {
        url: "/categories",
        views: {
            'menuContent': {
                templateUrl: "templates/categoryList.html",
                controller: 'CategoryListCtrl'
            }
        }
    })

    .state('app.shops', {
        url: "/shops",
        views: {
            'menuContent': {
                templateUrl: "templates/shopList.html",
                controller: 'ShopListCtrl'
            }
        }
    })

    .state('app.shop', {
        url: "/shops/:shopId",
        views: {
            'menuContent': {
                templateUrl: "templates/shop.html",
                controller: 'ShopCtrl'
            }
        }
    })

    .state('app.reports', {
        url: "/reports",
        views: {
            'menuContent': {
                templateUrl: "templates/reports.html",
                controller: 'ReportListCtrl'
            }
        }
    })

    .state('app.report', {
        url: "/reports/:reportName",
        views: {
            'menuContent': {
                templateUrl: "templates/report.html",
                controller: 'ReportCtrl'
            }
        }
    })

    .state('app.reportFilter', {
        url: "/reportFilter/:reportName",
        views: {
            'menuContent': {
                templateUrl: "templates/reportFilter.html",
                controller: 'ReportFilterCtrl'
            }
        }
    });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

});
