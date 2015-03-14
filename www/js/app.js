angular.module('fm', ['ionic', 'fm.controllers', 'fm.services'])

.run(function($ionicPlatform, $http, $rootScope, $ionicLoading, $ionicPopup, $state) {
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

    $rootScope.$on('loading:show', function(event, message) {
        $ionicLoading.show({
            animation: 'fade-in',
            showBackdrop: true,
            template: message || 'Загрузка'
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

    $rootScope.$on('state:login', function() {
        $state.go('login');
    })


})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.views.maxCache(3);
    $ionicConfigProvider.templates.maxPrefetch(30);

    $httpProvider.interceptors.push('HttpInterceptor');


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

    .state('app.messages', {
        url: "/messages",
        views: {
            'menuContent': {
                templateUrl: "templates/messages.html",
                controller: 'MessagesCtrl'
            }
        }
    })

    .state('app.settings', {
        url: "/settings",
        views: {
            'menuContent': {
                templateUrl: "templates/settings.html",
                controller: 'SettingsCtrl'
            }
        }
    });


    // if none of the above states are matched, use this as the fallback
    if (window.localStorage['fmData.token']) {
        //$urlRouterProvider.otherwise('/app/main');
        $urlRouterProvider.otherwise('/app/operations');
    }
    else {
        $urlRouterProvider.otherwise('/login');
    }

});
