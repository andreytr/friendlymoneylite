angular.module('fm.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})


.controller('LoginCtrl', function($scope, $state) {

    $scope.login = function(user) {
        $state.go('app.accounts');
    }

})

.controller('RegistrationCtrl', function($scope) {

})

.controller('OperationsCtrl', function($scope) {

    $scope.operations = [{
        title: 'Сегодня, 28 декабря',
        records: [{
            id  : 1,
            date: new Date(),
            category: {
                icon: 'ion-locked',
                color: '#B6936C',
                name: 'Продукты'
            },
            shop: {
                name: 'Матрица'
            },
            description: '',
            value: 1234.44,
            currency: 'руб.'
        }, {
             id  : 2,
             date: new Date(),
             category: {
                 icon: 'ion-locked',
                 color: '#B6936C',
                 name: 'Продукты'
             },
             shop: {
                 name: 'Перекресток'
             },
             description: '',
             value: -134.44,
             currency: 'руб.'
        }, {
             id  : 1,
             date: new Date(),
             category: {
                 icon: 'ion-locked',
                 color: '#B6936C',
                 name: 'Продукты'
             },
             shop: {
                 name: 'Матрица'
             },
             description: 'Икра красная',
             value: 894.44,
             currency: 'руб.'
        }],
    }, {
        title: 'Вчера, 27 декабря',
        records: [{
            id  : 1,
            date: new Date(),
            category: {
                icon: 'ion-locked',
                color: '#B6936C',
                name: 'Продукты'
            },
            shop: {
                name: 'Матрица'
            },
            description: '',
            value: 1234.44,
            currency: 'руб.'
        }, {
             id  : 2,
             date: new Date(),
             category: {
                 icon: 'ion-locked',
                 color: '#B6936C',
                 name: 'Продукты'
             },
             shop: {
                 name: 'Перекресток'
             },
             description: '',
             value: -134.44,
             currency: 'руб.'
        }, {
             id  : 1,
             date: new Date(),
             category: {
                 icon: 'ion-locked',
                 color: '#B6936C',
                 name: 'Продукты'
             },
             shop: {
                 name: 'Матрица'
             },
             description: 'Икра красная',
             value: 894.44,
             currency: 'руб.'
        }]
    }];

})

.controller('AccountsCtrl', function($scope) {

    $scope.accounts = [{
        id  : 1,
        icon: 'ion-locked',
        color: '#B6936C',
        name: 'Альфа',
        total: 1234.44,
        currency: 'руб.'
    }, {
        id  : 2,
        icon: 'ion-email',
        color: '#91B66C',
        name: 'Сбер',
        total: 15654.44,
        currency: 'руб.'
    }, {
        id  : 3,
        icon: 'ion-coffee',
        color: '#996CB6',
        name: 'Тиньков',
        total: 3434.44,
        currency: '$'
    }, {
        id  : 2,
        icon: 'ion-email',
        color: '#91B66C',
        name: 'Сбер',
        total: 15654.44,
        currency: 'руб.'
    }, {
        id  : 3,
        icon: 'ion-coffee',
        color: '#996CB6',
        name: 'Тиньков',
        total: 3434.44,
        currency: '$'
    }, {
        id  : 2,
        icon: 'ion-email',
        color: '#91B66C',
        name: 'Сбер',
        total: 15654.44,
        currency: 'руб.'
    }, {
        id  : 3,
        icon: 'ion-coffee',
        color: '#996CB6',
        name: 'Тиньков',
        total: 3434.44,
        currency: '$'
    }, {
        id  : 2,
        icon: 'ion-email',
        color: '#91B66C',
        name: 'Сбер',
        total: 15654.44,
        currency: 'руб.'
    }, {
        id  : 3,
        icon: 'ion-coffee',
        color: '#996CB6',
        name: 'Тиньков',
        total: 3434.44,
        currency: '$'
    }];

})


.controller('AccountCtrl', function($scope, $stateParams) {

})

.controller('ShopListCtrl', function($scope, $stateParams) {
    $scope.shopList = [{
        id  : 1,
        name: 'Перекресток',
        category: {
            icon: 'ion-locked',
            color: '#B6936C',
            name : 'Продукты'
        }
    }, {
        id  : 2,
        name: 'Матрица',
        category: {
            icon: 'ion-locked',
            color: '#B6936C',
            name : 'Продукты'
        }
    }, {
        id  : 3,
        name: 'Apple',
        category: {
            icon: 'ion-email',
            color: '#91B66C',
            name : 'Музыка'
        }
    }];
})


.controller('ShopCtrl', function($scope, $stateParams) {

})



.controller('ReportListCtrl', function($scope, $stateParams) {
    $scope.commonReportList = [{
        name: 'report1',
        title: 'Баланс счетов',
        type : 'line'
    }, {
        name: 'report2',
        title: 'Расходы текущего месяца по категориям',
        type : 'donut'
    }, {
        name: 'report3',
        title: 'Расходы по месяцам',
        type : 'bar'
    }];

    $scope.userReportList = [{
        name: 'report1',
        title: 'Баланс наличных',
        type : 'line'
    }, {
        name: 'report2',
        title: 'Расходы 2014 по категориям',
        type : 'donut'
    }, {
        name: 'report3',
        title: 'Расходы на продукты по месяцам',
        type : 'bar'
    }, {
        name: 'report4',
        title: 'Расходы на транспорт по месяцам',
        type : 'bar'
    }];

    $scope.getIcon = function(type) {
        if (type == 'line') {
            return 'ion-arrow-graph-up-right';
        }
        if (type == 'donut') {
            return 'ion-pie-graph';
        }
        if (type == 'bar') {
            return 'ion-stats-bars';
        }
        return 'ion-pound';
    };

    $scope.changeTab = function(tab) {
        $scope.tab = tab;
        $scope.reportList = tab == 'common' ? $scope.commonReportList : $scope.userReportList;
    };

    $scope.changeTab('common');
})

.controller('ReportCtrl', function($scope, $stateParams) {

    $scope.loadReport = function(reportName) {
        return {
            name: reportName,
            title: 'Расходы на продукты по месяцам',
            type : 'bar'
        }
    }

    $scope.report = $scope.loadReport($stateParams['reportName']);
});




