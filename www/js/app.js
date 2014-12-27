angular.module('fm', ['ionic', 'fm.controllers'])

.run(function($ionicPlatform) {
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
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('');

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
                templateUrl: "templates/accounts.html",
                controller: 'AccountsCtrl'
            }
        }
    })

    .state('app.account', {
        url: "/accounts/:accountId",
        views: {
            'menuContent': {
                templateUrl: "templates/account.html",
                controller: 'AccountCtrl'
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
    });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

});
