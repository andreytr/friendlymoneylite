angular.module('fm.controllers', ['fm.services', 'angularCharts'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})


.controller('LoginCtrl', function($scope, $state, $ionicPopup, userService) {

    $scope.user = {
        username: '',
        password: ''
    };

    $scope.login = function(user) {
        if (!user.username || !user.password) {
            $ionicPopup.alert({
                cssClass: 'error',
                template: 'Заполните все обязательные поля'
            });

            return;
        }

        userService.login(user.username, user.password).then(function(result) {
            if (result) {
                $state.go('app.main');
            }
        });
    }

    $scope.register = function() {
        $state.go('registration');
    }

})

.controller('RegistrationCtrl', function($scope, $state, $ionicPopup, $cookieStore, userService) {
    $scope.user = {
        username: '',
        password: '',
        confirmPassword: ''
    };

    $scope.register = function(user) {
        if (!user.username || !user.password || !user.confirmPassword) {
            $ionicPopup.alert({
                cssClass: 'error',
                template: 'Заполните все обязательные поля'
            });

            return;
        }

        userService.register({
            name: user.username,
            password: user.password,
            password2: user.confirmPassword
        })
        .then(function(result) {
            if (result) {
                $state.go('app.main');
            }
        });
    }
})

.controller('MainCtrl', function($scope) {

    $scope.scheduledOperations = [{
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
    }];

    $scope.operations = [{
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
    }];

})

.controller('OperationsCtrl', function($scope, $filter, operationService) {

    console.info('open operations');

    $scope.load = function() {
        operationService.getList().then(function(result) {
            $scope.operations = result.data;
        });
    }

    $scope.onSwipeDown = function() {
        $scope.load();
    }

    $scope.needShowGroup = function(operation, prevOperation) {
        if (prevOperation) {
            var group = $scope.getGroupTitle(operation);
            var prevGroup = $scope.getGroupTitle(prevOperation);
            return group != prevGroup;
        }
        else {
            return true;
        }
    }

    $scope.getGroupTitle = function(operation) {
        if (operation && operation.date) {
            return $filter('date')(operation.date, "dd MMMM")
        }
        return null;
    }

    $scope.load();


})

.controller('AccountsCtrl', function($scope, $ionicActionSheet, accountService) {

    $scope.showMenu = function(account) {
        $ionicActionSheet.show({
            destructiveText: 'Удалить',
            cancelText: 'Отмена',
            buttonClicked: function(index) {
                console.info(index);
                return true;
            },
            destructiveButtonClicked: function() {
                console.info("delete");
            }
        });
    };

    $scope.getColor = function(type) {
        if (type) {
            if (type.type == 1) {
                return '#94b46b';
            }
            if (type.type == 2) {
                return '#b9ab6a';
            }
            if (type.type == 3) {
                return '#b46e70';
            }
            if (type.type == 4) {
                return '#6da1b6';
            }
        }
        return '#00b9f2';
    };

    $scope.getIcon = function(type) {
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
    };

    accountService.getList().then(function(data) {
        $scope.accounts = data;
    });



})


.controller('AccountCtrl', function($scope, $stateParams) {

})


.controller('CategoryListCtrl', function($scope, $stateParams, $ionicScrollDelegate, categoryService) {

    $scope.doRefresh = function(isPull) {
        categoryService.getTreeList().then(function(data) {
            $scope.categoryList = data;
        });

        if (isPull) {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        }
    };

    $scope.getIcon = function(category) {
        return 'ion-pound';
    };

    $scope.changeTab = function(tab) {
        $scope.tab = tab;
        $ionicScrollDelegate.scrollTop();
    };

    $scope.changeTab('OUTCOME');
    $scope.doRefresh(false);
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



.controller('ReportListCtrl', function($scope, $stateParams, reportService) {

    $scope.doRefresh = function(isPull) {
        reportService.getList().then(function(data) {
            $scope.reports = data;
        });

        if (isPull) {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        }
    };

    $scope.getIcon = function(type) {
        if (type == 'LINE') {
            return 'ion-arrow-graph-up-right';
        }
        if (type == 'DONUT') {
            return 'ion-pie-graph';
        }
        if (type == 'BAR') {
            return 'ion-stats-bars';
        }
        return 'ion-pound';
    };

    $scope.changeTab = function(tab) {
        $scope.tab = tab;
        $scope.reportList = tab == 'common' ? $scope.commonReportList : $scope.userReportList;
    };

    $scope.changeTab('common');
    $scope.doRefresh(false);
})

.controller('ReportCtrl', function($scope, $state, $stateParams, reportService) {

    $scope.chartType = 'line';
    $scope.chartData = null;
    $scope.chartConfig = {
        tooltips: true,
        labels: false,
        legend: {
            display: false,
            position: "right"
        },
        innerRadius: 0,
        lineLegend: 'traditional',
        lineCurveType: 'cardinal',
        xAxisMaxTicks: 5,
        click: function() {
            console.info(arguments);
        }
    };

    $scope.report = reportService.getReportByName($stateParams['reportName']);
    if (!$scope.report) {
        $state.go('app.reports');
    }

    $scope.filter = {};

    $scope.getChartType = function(type) {
        if (type == 'LINE') {
            return 'area';
        }
        if (type == 'BAR') {
            return 'bar';
        }
        if (type == 'DONUT') {
            return 'pie';
        }
        return null;
    }

    $scope.getChartData = function(type, data) {
        var result = {
            series: [],
            data  : []
        }

        if (!data || !data.length) {
            return result;
        }

        var rawData = {};
        for(var i = 0; i < data.length; i++) {
            var series = data[i];

            result.series.push(series['name']);

            for(var x in series.values) {
                if (!series.values.hasOwnProperty(x)) {
                    continue;
                }

                if (!rawData.hasOwnProperty(x)) {
                    rawData[x] = [];
                }

                rawData[x].push(series.values[x]);
            }
        }

        for(var x in rawData) {
            if (!rawData.hasOwnProperty(x)) {
                continue;
            }

            result.data.push({
                x: x,
                y: rawData[x],
                tooltip: x,
                color: 'red'
            });
        }

        return result;
    }

    $scope.doRefresh = function(isPull) {
        if (!$scope.report) {
            $state.go('app.reports');
        }

        reportService.getData($scope.report.name, $scope.filter).then(function(result) {
            $scope.chartType = $scope.getChartType($scope.report.type);
            $scope.chartData = $scope.getChartData($scope.report.type, result.data);

            if (isPull) {
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$apply();
            }
        });
    };

    $scope.doRefresh(false);

    $scope.goToFilter = function(report) {
        $state.go('app.reportFilter', {reportName: report.name});
    }
})

.controller('ReportFilterCtrl', function($scope, $state, $stateParams, reportService) {

    $scope.reportName = $stateParams['reportName'];
    $scope.filter = reportService.getDataFilter();

    $scope.save = function() {
        reportService.setDataFilter($scope.filter);
        $state.go('app.report', {reportName: $scope.reportName, refresh: true});
    }

});




