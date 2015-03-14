angular.module('fm.controllers', ['fm.services', 'fm.directives', 'angularCharts'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, dataService) {

    $scope.userName = "Friendly Money";

    var profile = dataService.getUserProfile();
    if (profile && profile['username']) {
        $scope.userName = profile['username'];
    }

})


.controller('LoginCtrl', function($scope, $state, $ionicPopup, $rootScope, userService, dataService) {

    $scope.user = {
        username: '',
        password: ''
    };

    $scope.login = function(user) {
        if (!user.username || !user.password) {
            $rootScope.$broadcast('loading:showError', 'Заполните все обязательные поля');
            return;
        }

        $rootScope.$broadcast('loading:show');
        userService.login(user.username, user.password).then(function(result) {
            if (result && result['data']) {
                dataService.setToken(result['data'][0]['token']);
                dataService.loadData(function() {
                    $state.go('app.operations');
                    $rootScope.$broadcast('loading:hide');
                }, function() {
                    $rootScope.$broadcast('loading:hide');
                });
            }
            else {
                $rootScope.$broadcast('loading:showError', 'Ошибка 0012');
            }
        });
    }

    $scope.register = function() {
        $state.go('registration');
    }

})

.controller('RegistrationCtrl', function($scope, $state, $ionicPopup, $rootScope, userService, dataService) {
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
            if (result && result['data']) {
                dataService.setToken(result['data'][0]['token']);
                dataService.loadData(function() {
                    $state.go('app.operations');
                    $rootScope.$broadcast('loading:hide');
                }, function() {
                    $rootScope.$broadcast('loading:hide');
                });
            }
            else {
                $rootScope.$broadcast('loading:showError', 'Ошибка 0013');
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

.controller('OperationsCtrl', function($scope, $filter, $ionicModal, $ionicScrollDelegate, $rootScope, iconService, operationService) {

    $scope.getItemHeight = function(operation, index) {
        if (operation.temp.needShowGroup) {
            return  115;
        }
        return 76;
    };

    $scope.getIcon = function(operation) {
        if (operation.type == 'INPUT_TRANSFER') {
            return 'ion-log-in';
        }
        if (operation.type == 'OUTPUT_TRANSFER') {
            return 'ion-log-out';
        }
        return iconService.getCategoryIcon(operation.category.icon);
    }

    $scope.doRefresh = function(isPull) {
        if (!isPull) {
            $rootScope.$broadcast('loading:show');
        }

        $scope.operations = [];
        $scope.loadedPage = 0;

        $scope.load(function() {
            if (isPull) {
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$apply();
            }
            $rootScope.$broadcast('loading:hide');
        });
    };

    $scope.load = function(callback, scope) {
        var pageSize = 30;
        var page = $scope.loadedPage + 1;

        operationService.getList(page, pageSize, $scope.filter).then(function(result) {
            $scope.loadedPage = page;

            if (result.data.length > 0) {
                for(var i = 0; i < result.data.length; i++) {
                    var prev = null;
                    if (i == 0 && $scope.operations.length > 0) {
                        prev = $scope.operations[$scope.operations.length - 1];
                    }
                    else {
                        prev = result.data[i - 1];
                    }

                    var oper = result.data[i];
                    oper.temp = {
                        groupTitle: $scope.getGroupTitle(oper),
                        currencyIcon: $scope.getCurrencyIcon(oper.currency)
                    }
                    oper.temp.needShowGroup = $scope.needShowGroup(oper, prev);
                }

                $scope.operations = $scope.operations.concat(result.data);
            }

            $scope.moreDataExists = result.data.length > 0 &&
                                    result.data.length % pageSize == 0
            $scope.$broadcast('scroll.infiniteScrollComplete');

            if (callback) {
                callback.call(scope || this);
            }
        });
    };

    $scope.moreDataCanBeLoaded = function() {
        return $scope.moreDataExists;
    };


    $scope.needShowGroup = function(operation, prevOperation) {
        if (prevOperation) {
            var group = operation.temp.groupTitle;
            var prevGroup = prevOperation.temp.groupTitle;
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

    $scope.getCurrencyIcon = function(currency) {
        if (!currency) {
            return '';
        }
        return iconService.getCurrencyIcon(currency.type);
    };


    $ionicModal.fromTemplateUrl('templates/operationEdit.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.editModal = modal
    })

    $scope.changeTab = function(tab) {
        $scope.tab = tab;
        if (tab != 'TRANSFER') {
            $scope.operation = {
                type: tab
            }
        }
        else {
            $scope.transfer = {};
        }
    };

    $scope.$watch("operation.shop", function(newValue, oldValue) {
        if ($scope.operation && !$scope.operation.category) {
            $scope.operation.category = newValue.defaultCategory;
        }
    });

    $scope.add = function() {
        $scope.showTabs = true;
        $scope.changeTab('OUTCOME');
        $scope.editModal.show();
    }

    $scope.edit = function(operation) {
        $scope.showTabs = false;
        if (operation.type == 'OUTCOME' || operation.type == 'INCOME') {
            $scope.changeTab(operation.type);
            $scope.operation = operation;
        }
        else {
            return; //TODO
            $scope.changeTab('TRANSFER');
            $scope.transfer = {
                date: operation.date
            };
        }

        $scope.editModal.show();
    }

    $scope.closeForm = function() {
        $scope.editModal.hide();
    };

    $scope.save = function(tab) {
        var callback = function(data) {
            $scope.editModal.hide();
            $scope.doRefresh(false);
        };

        $rootScope.$broadcast('loading:show', 'Сохранение');

        if (tab == 'TRANSFER') {
            operationService.transfer($scope.transfer).then(callback);
        }
        else {
            operationService.update($scope.operation).then(callback);
        }
    };

    $scope.remove = function(operation) {
        accountService.remove(operation.id).then(function(data) {
            $scope.doRefresh(false);
        });
    }

    $scope.filter = {};
    $ionicModal.fromTemplateUrl('templates/operationFilter.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.filterModal = modal
    })

    $scope.goToFilter = function() {
        $scope.filterModal.show();
    }

    $scope.closeFilterForm = function() {
        $scope.filterModal.hide();
    };

    $scope.applyFilter = function() {
        $scope.filterModal.hide();
        $scope.doRefresh(false);
    };

    $scope.$on('$destroy', function() {
        $scope.editModal.remove();
        $scope.filterModal.remove();
    });

    $scope.$on('$stateChangeSuccess', function() {
        $scope.doRefresh(false);
    });
})

.controller('AccountsCtrl', function($scope, $ionicActionSheet, $ionicModal, $rootScope, accountService, iconService, dataService) {

    $scope.showMenu = function(account) {
        var hideSheet = $ionicActionSheet.show({
            destructiveText: 'Удалить',
            cancelText: 'Отмена',
            destructiveButtonClicked: function() {
                $scope.remove(account);
                hideSheet();
            }
        });
    };

    $scope.getColor = function(type) {
        return iconService.getAccountColor(type);
    };

    $scope.getIcon = function(type) {
        return iconService.getAccountIcon(type);
    };

    $scope.getCurrencyIcon = function(currency) {
        return iconService.getCurrencyIcon(currency.type);
    };

    $scope.getCurrencyIconByType = function(currencyType) {
        return iconService.getCurrencyIcon(currencyType);
    };

    $scope.getTotalValue = function(accountList) {
        var sum = {};

        if (!accountList) {
            return sum;
        }

        var profile = dataService.getUserProfile();
        if (profile['defaultCurrency'] && profile['defaultCurrency']['type']) {
            sum[profile['defaultCurrency']['type']] = 0;
        }

        for(var i = 0; i < accountList.length; i++) {
            var account = accountList[i];
            var currencyType = account['currency']['type'];

            if (!sum.hasOwnProperty(currencyType)) {
                sum[currencyType] = 0;
            }

            sum[currencyType] += account['value'];
        }

        var result = [];
        for(key in sum) {
            if (sum[key]) {
                result.push({
                    currency: key,
                    value: sum[key]
                });
            }
        }

        return result;
    }

    $scope.doRefresh = function(isPull) {
        if (!isPull) {
            $rootScope.$broadcast('loading:show');
        }
        accountService.getList().then(function(data) {
            $scope.accountList = data;
            $scope.totalValue = $scope.getTotalValue(data);
            $rootScope.$broadcast('loading:hide');
        });

        if (isPull) {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        }
    };

    $scope.doRefresh(false);


    $ionicModal.fromTemplateUrl('templates/accountEdit.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal
    })

    $scope.add = function() {
        $scope.account = {};
        $scope.modal.show();
    }

    $scope.edit = function(account) {
        $scope.account = account;
        $scope.modal.show();
    }

    $scope.closeForm = function() {
        $scope.modal.hide();
    };

    $scope.save = function(account) {
        $rootScope.$broadcast('loading:show', 'Сохранение');
        accountService.update(account).then(function(data) {
            $scope.modal.hide();
            $scope.doRefresh(false);
        });
    };

    $scope.remove = function(account) {
        $rootScope.$broadcast('loading:show', 'Удаление');
        accountService.remove(account.id).then(function(data) {
            $scope.doRefresh(false);
        });
    }

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
})


.controller('CategoryListCtrl', function($scope, $stateParams, $ionicScrollDelegate, $ionicModal, $rootScope, iconService, categoryService, dataService) {

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

    $scope.doRefresh = function(isPull) {
        $scope.categoryList = dataService.getCategoryList();

        if (isPull) {
            dataService.loadData(function() {
                $scope.categoryList = dataService.getCategoryList();
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$apply();
                $rootScope.$broadcast('loading:hide');
            }, function() {
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$apply();
            });
        }
    };

    $scope.getIcon = function(category) {
        return iconService.getCategoryIcon(category.icon);
    };

    $scope.changeTab = function(tab) {
        $scope.tab = tab;
        $ionicScrollDelegate.scrollTop();
    };

    $scope.changeTab('OUTCOME');
    $scope.doRefresh(false);



    $ionicModal.fromTemplateUrl('templates/categoryEdit.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal
    })

    $scope.addCategory = function() {
        $scope.category = {
            type: $scope.tab
        };
        $scope.modal.show();
    }

    $scope.editCategory = function(category) {
        $scope.category = category;
        $scope.modal.show();
    }

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.saveCategory = function(category) {
        $rootScope.$broadcast('loading:show', 'Сохранение');

        var data = {
            id  : category.id,
            name: category.name,
            type: category.type,
            parentCategory: category.parent,
            color: category.color,
            icon : category.icon
        }

        categoryService.update(data).then(function(data) {
            $rootScope.$broadcast('loading:show');
            $scope.modal.hide();
            $scope.doRefresh(true);
        });
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

})



.controller('ShopListCtrl', function($scope, $ionicActionSheet, $ionicModal, $rootScope, shopService, iconService) {

    $scope.showMenu = function(shop) {
        var hideSheet = $ionicActionSheet.show({
            destructiveText: 'Удалить',
            cancelText: 'Отмена',
            destructiveButtonClicked: function() {
                $scope.remove(shop);
                hideSheet();
            }
        });
    };

    $scope.getIcon = function(category) {
        if (category) {
            return iconService.getCategoryIcon(category.icon);
        }
        return 'ion-help';
    };

    $scope.getColor = function(category) {
        if (category) {
            return category.color;
        }
        return '#ffffff';
    };

    $scope.doRefresh = function(isPull) {
        if (!isPull) {
            $rootScope.$broadcast('loading:show');
        }

        shopService.getList().then(function(data) {
            $scope.shopList = data.data;

            if (isPull) {
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$apply();
            }
            $rootScope.$broadcast('loading:hide');
        });
    };

    $scope.doRefresh(false);


    $ionicModal.fromTemplateUrl('templates/shopEdit.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal
    })

    $scope.add = function() {
        $scope.shop = {};
        $scope.modal.show();
    }

    $scope.edit = function(shop) {
        $scope.shop = shop;
        $scope.modal.show();
    }

    $scope.closeForm = function() {
        $scope.modal.hide();
    };

    $scope.save = function(shop) {
        $rootScope.$broadcast('loading:show', 'Сохранение');

        var record = {
            id: shop.id,
            name: shop.name,
            title: shop.title,
            defaultCategory: {
                id: shop.defaultCategory.id,
                name: shop.defaultCategory.name,
            }
        }
        shopService.update(record).then(function(data) {
            $scope.modal.hide();
            $scope.doRefresh(false);
        });
    };

    $scope.remove = function(shop) {
        shopService.remove(shop.id).then(function(data) {
            $scope.doRefresh(false);
        });
    }

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

})


.controller('ReportListCtrl', function($scope, $stateParams, $rootScope, reportService) {

    $scope.doRefresh = function(isPull) {
        if (!isPull) {
            $rootScope.$broadcast('loading:show');
        }

        reportService.getList().then(function(data) {
            $scope.reports = data;

            if (isPull) {
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$apply();
            }
            $rootScope.$broadcast('loading:hide');
        });
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
    };

    $scope.changeTab('common');
    $scope.doRefresh(false);
})

.controller('ReportCtrl', function($scope, $state, $stateParams, $ionicModal, $rootScope, reportService, iconService) {

    var chartColors = iconService.getColorList();

    $scope.legendData = [];
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
        click: function(chartItem, event) {
            if (arguments.length < 2 || !chartItem) {
                return;
            }

            $scope.onChartItemClick(chartItem.data.x);
        },
        colors: chartColors
    };

    $scope.report = reportService.getReportByName($stateParams['reportName']);
    if (!$scope.report) {
        $state.go('app.reports');
    }

    $scope.filter = {};

    $scope.getColor = function(index) {
        index = index % chartColors.length;
        return chartColors[index];
    }

    $scope.onChartItemClick = function(title) {
        for(var i = 0; i < $scope.legendData.length; i++) {
            $scope.legendData[i]['selected'] = ($scope.legendData[i]['title'] == title)
        }
    };

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

    $scope.getLegendData = function(type, data) {
        var result = [];

        if (type == 'LINE') {
            for(var i = 0; i < data.length; i++) {
                    result.push({
                        color: $scope.getColor(i),
                        icon: null,
                    title: data[i]['name'],
                    value: null
                });
            }
        }
        else if (type == 'DONUT') {
            for(var i = 0; i < data.length; i++) {
                var seriesName = data[i]['name'];
                var values = data[i]['values'];
                if (values) {
                    for(var name in values) {
                        if (!values.hasOwnProperty(name)) {
                            continue;
                        }
                        result.push({
                            color: $scope.getColor(result.length),
                            icon: null,
                            title: name,
                            value: values[name]
                        });
                    }
                }
            }
        }
        else if (type == 'BAR') {
            var buffer = {};
            for(var i = 0; i < data.length; i++) {
                var seriesName = data[i]['name'];
                var values = data[i]['values'];
                if (values) {
                    for(var name in values) {
                        if (!values.hasOwnProperty(name)) {
                            continue;
                        }

                        if (!buffer.hasOwnProperty(name)) {
                            buffer[name] = [];
                        }

                        buffer[name].push({
                            color: $scope.getColor(buffer[name].length),
                            icon: null,
                            title: seriesName,
                            value: values[name]
                        });
                    }
                }
            }

            for(var name in buffer) {
                if (!buffer.hasOwnProperty(name)) {
                    continue;
                }

                for(var i = 0; i < buffer[name].length; i++) {
                    var item = buffer[name][i];
                    item['title'] = name + ' (' + item['title'].toLowerCase() + ')';
                    result.push(item);
                }
            }
        }

        return result;
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

        if (!isPull) {
            $rootScope.$broadcast('loading:show');
        }

        reportService.getData($scope.report.name, $scope.filter).then(function(result) {
            $scope.chartType = $scope.getChartType($scope.report.type);
            $scope.chartData = $scope.getChartData($scope.report.type, result.data);
            $scope.legendData = $scope.getLegendData($scope.report.type, result.data);

            if (isPull) {
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$apply();
            }
            $rootScope.$broadcast('loading:hide');
        });
    };

    $scope.doRefresh(false);

    $scope.getCurrentFilter = function(report) {
        if ($scope.filter) {
            return $scope.filter;
        }
        return {};
    }

    $ionicModal.fromTemplateUrl('templates/reportFilter.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.filterModal = modal
    })

    $scope.goToFilter = function(report) {
        $scope.filter = $scope.getCurrentFilter(report);
        $scope.filterModal.show();
    }

    $scope.closeForm = function() {
        $scope.filterModal.hide();
    };

    $scope.apply = function(account) {
        $scope.filterModal.hide();
        $scope.doRefresh(false);
    };

    $scope.$on('$destroy', function() {
        $scope.filterModal.remove();
    });

})

.controller('MessagesCtrl', function($scope, $ionicModal, $ionicScrollDelegate, $rootScope, messagesService, smsService) {
    $scope.receivedMessages = [];

    $scope.doRefresh = function(isPull) {
        if (!isPull) {
            $rootScope.$broadcast('loading:show');
        }

        messagesService.loadTemplates(function() {
            $scope.availableNumbers = messagesService.getAvailableNumbers();
            $scope.stat = messagesService.getMessageStats();
            $scope.receivedMessages = messagesService.getReceivedMessages();

            if (isPull) {
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$apply();
            }
            $rootScope.$broadcast('loading:hide');
        });
    };

    $scope.changeTab = function(tab) {
        $scope.tab = tab;
        $ionicScrollDelegate.scrollTop();
    };

    $scope.changeTab('history');
    $scope.doRefresh(false);



    $scope.getStatus = function(message) {
        if (message.status == 'QUEUE') {
            return 'В очереди';
        }
        if (message.status == 'CREATED_OPERATIONS') {
            return 'Создана операция';
        }
        if (message.status == 'SKIPPED') {
            return 'Пропущено';
        }
        if (message.status == 'EXCEPTION') {
            return 'Ошибка';
        }
        return message.status || 'Ошибка отправки';
    }



    $ionicModal.fromTemplateUrl('templates/messagesReadForm.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.readFormModal = modal
    })

    $scope.showReadForm = function() {
        $scope.readForm = {
            fromDate: null
        }
        $scope.readFormModal.show();
    }

    $scope.closeReadForm = function() {
        $scope.readFormModal.hide();
    };

    $scope.readMessages = function() {
        if ($scope.readForm.fromDate) {
            smsService.readMessages($scope.readForm.fromDate);
        }
        $scope.readFormModal.hide();
        $scope.doRefresh(false);
    };

    $scope.$on('$destroy', function() {
        $scope.readFormModal.remove();
    });
})

.controller('SettingsCtrl', function($scope, $rootScope, $state, $filter, $ionicPopup, $ionicScrollDelegate, dataService, userService) {

    $scope.getData = function() {
        $scope.userProfile = dataService.getUserProfile();
        $scope.security = dataService.getSecurity();
    }

    $scope.save = function(userProfile) {
        $rootScope.$broadcast('loading:show', "Сохранение профиля...");
        dataService.setSecurity($scope.security);
        userService.saveProfile({
            email: userProfile['email'],
            defaultCurrency: userProfile['defaultCurrency'],
            groupLineReportToDefaultCurrency: userProfile['groupLineReportToDefaultCurrency'],
            groupBarReportToDefaultCurrency: userProfile['groupBarReportToDefaultCurrency']
        }, function() {
            $rootScope.$broadcast('loading:hide');
            $scope.doRefresh(true);
        });
    }

    $scope.logout = function() {
        userService.logout(function() {
            dataService.clearData();
            $state.go('login');
        });
    }

    $scope.changePassword = function() {
        $scope.popupData = {};
        var myPopup = $ionicPopup.show({
            template: '<input type="password" ng-model="popupData.pass1" placeholder="Пароль">' +
                      '<input type="password" ng-model="popupData.pass2" placeholder="Подтверждение пароля">',
            title   : 'Задайте новый пароль',
            scope   : $scope,
            buttons : [{
                text: 'Отмена',
                type: 'button-positive'
            }, {
                text: 'ОК',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.popupData.pass1 || !$scope.popupData.pass2) {
                        //don't allow the user to close unless he enters wifi password
                        $rootScope.$broadcast('loading:showError', 'Заполните все обязательные поля');
                        e.preventDefault();
                    } else {
                        if ($scope.popupData.pass1 != $scope.popupData.pass2) {
                            e.preventDefault();
                            $rootScope.$broadcast('loading:showError', 'Пароль и подтверждение не совпадают');
                        }
                        else {
                            return $scope.popupData;
                        }
                    }
                }
            }]
        });
        myPopup.then(function(res) {
            if (res === undefined) {
                return;
            }

            $rootScope.$broadcast('loading:show', "Смена пароля...");
            userService.changePassword(res.pass1, function() {
                $rootScope.$broadcast('loading:hide');
            });
        });
    }

    $scope.getPremiumStatus = function(userProfile) {
        if (userProfile && userProfile.status == 'PREMIUM') {
            return 'Активна до ' + $filter('date')(userProfile.premiumEndDate, "yyyy-MM-dd");
        }

        return 'Не активна';
    }

    $scope.doRefresh = function(isPull) {
        if (isPull) {
            dataService.loadData(function() {
                $scope.getData();
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$apply();
            });
        }
    }

    $scope.getData();

});




