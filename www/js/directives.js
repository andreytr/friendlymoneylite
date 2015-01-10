angular.module('fm.directives', [])

.directive('categorySelect', function($ionicModal, $ionicScrollDelegate, categoryService, iconService){
    return {
        restrict: 'E',
        replace : true,
        template: '<label class="item item-input item-select-list item-icon-left item-icon-right" ng-click="open()">' +
                       '<i class="icon fa fa-star"></i>' +
                       '<p ng-class="{empty: value.name == null}">{{value.name != null ? value.name : title}}</p>' +
                       '<i class="icon ion-chevron-right"></i>' +
                   '</label>',
        scope   : {
            value: "=value",
            type: "=type",
            excludeId: "=excludeId",
            title: "=title",
            maxLevel: "=maxLevel",
            allowChangeType: "=allowChangeType"
        },
        link: function($scope, element, attrs) {
            $ionicModal.fromTemplateUrl("templates/categorySelect.html", {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal
            });


            $scope.open = function() {
                if (!$scope.type) {
                    $scope.type = 'OUTCOME';
                }
                $scope.doRefresh(false);
                $scope.modal.show();
            };

            $scope.close = function() {
                $scope.modal.hide();
            }

            $scope.getIcon = function(category) {
                return iconService.getCategoryIcon(category.icon);
            }

            $scope.doRefresh = function(isPull) {
                categoryService.getTreeList().then(function(data) {
                    $scope.categoryList = data;
                });

                if (isPull) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                }
            };

            $scope.select = function(category) {
                $scope.value = {
                    id: category['id'],
                    name: category['name']
                };
                $scope.close();
            }


            $scope.changeTab = function(tab) {
                $scope.type = tab;
                $ionicScrollDelegate.scrollTop();
            };
        }
    };
})

.directive('colorSelect', function($ionicModal, accountService, iconService){
    return {
        restrict: 'E',
        replace : true,
        template: '<label class="item item-input item-select-list item-icon-left item-icon-right" ng-click="open()">' +
                       '<i class="icon ion-record" style="color: {{value}}"></i>' +
                       '<p ng-class="{empty: value == null}">{{title}}</p>' +
                       '<i class="icon ion-chevron-right"></i>' +
                   '</label>',
        scope   : {
            icon: "=icon",
            value: "=value"
        },
        link: function($scope, element, attrs) {
            $scope.title = 'Цвет категории';

            $ionicModal.fromTemplateUrl("templates/colorSelect.html", {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal
            });


            $scope.open = function() {
                $scope.iconValue = iconService.getCategoryIcon($scope.icon);
                $scope.doRefresh(false);
                $scope.modal.show();
            };

            $scope.close = function() {
                $scope.modal.hide();
            }

            $scope.doRefresh = function(isPull) {
                $scope.recordList = iconService.getColorList();

                if (isPull) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                }
            };

            $scope.select = function(color) {
                $scope.value = color;
                $scope.close();
            }
        }
    };
})




.directive('accountTypeSelect', function($ionicModal, accountService, iconService){
    return {
        restrict: 'E',
        replace : true,
        template: '<label class="item item-input item-select-list item-icon-right" ng-click="open()">' +
                       '<p ng-class="{empty: value.name == null}">{{value.name != null ? value.name : title}}</p>' +
                       '<i class="icon ion-chevron-right"></i>' +
                   '</label>',
        scope   : {
            value: "=value"
        },
        link: function($scope, element, attrs) {
            $scope.title = "Тип счета";

            $ionicModal.fromTemplateUrl("templates/typeRecordSelect.html", {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal
            });


            $scope.open = function() {
                $scope.doRefresh(false);
                $scope.modal.show();
            };

            $scope.close = function() {
                $scope.modal.hide();
            }

            $scope.doRefresh = function(isPull) {
                accountService.getTypeList().then(function(data) {
                    $scope.recordList = data;
                });

                if (isPull) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                }
            };

            $scope.select = function(type) {
                $scope.value = type;
                $scope.close();
            }

            $scope.getColor = function(type) {
                return iconService.getAccountColor(type);
            };

            $scope.getIcon = function(type) {
                return iconService.getAccountIcon(type);
            };

        }
    };
})

.directive('accountCurrencySelect', function($ionicModal, accountService, iconService){
    return {
        restrict: 'E',
        replace : true,
        template: '<label class="item item-input item-select-list item-icon-right" ng-click="open()">' +
                       '<p ng-class="{empty: value.name == null}">{{value.name != null ? value.name : title}}</p>' +
                       '<i class="icon ion-chevron-right"></i>' +
                   '</label>',
        scope   : {
            value: "=value"
        },
        link: function($scope, element, attrs) {
            $scope.title = 'Валюта счета';

            $ionicModal.fromTemplateUrl("templates/typeRecordSelect.html", {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal
            });


            $scope.open = function() {
                $scope.doRefresh(false);
                $scope.modal.show();
            };

            $scope.close = function() {
                $scope.modal.hide();
            }

            $scope.doRefresh = function(isPull) {
                accountService.getCurrencyList().then(function(data) {
                    $scope.recordList = data;
                });

                if (isPull) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                }
            };

            $scope.select = function(type) {
                $scope.value = type;
                $scope.close();
            }

            $scope.getColor = function(type) {
                return "#153043";
            };

            $scope.getIcon = function(type) {
                return iconService.getCurrencyIcon(type.type);
            };

        }
    };
})

.directive('accountSelect', function($ionicModal, accountService, iconService){
    return {
        restrict: 'E',
        replace : true,
        template: '<label class="item item-input item-select-list item-icon-left item-icon-right" ng-click="open()">' +
                       '<i class="icon ion-card"></i>' +
                       '<p ng-class="{empty: value.name == null}">{{value.name != null ? value.name : title}}</p>' +
                       '<i class="icon ion-chevron-right"></i>' +
                   '</label>',
        scope   : {
            value: "=value",
            currency: "=currency",
            title: "=title"
        },
        link: function($scope, element, attrs) {
            $ionicModal.fromTemplateUrl("templates/typeRecordSelect.html", {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal
            });


            $scope.open = function() {
                $scope.doRefresh(false);
                $scope.modal.show();
            };

            $scope.close = function() {
                $scope.modal.hide();
            }

            $scope.doRefresh = function(isPull) {
                accountService.getList().then(function(data) {
                    $scope.recordList = data;
                });

                if (isPull) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                }
            };

            $scope.select = function(account) {
                $scope.value = {
                    id: account.id,
                    name: account.name
                };
                $scope.currency = account.currency;

                $scope.close();
            }

            $scope.getColor = function(account) {
                return iconService.getAccountColor(account.type);
            };

            $scope.getIcon = function(account) {
                return iconService.getAccountIcon(account.type);
            };

        }
    };
})


.directive('shopSelect', function($ionicModal, shopService, iconService){
    return {
        restrict: 'E',
        replace : true,
        template: '<label class="item item-input item-select-list item-icon-left item-icon-right" ng-click="open()">' +
                       '<i class="icon ion-bag"></i>' +
                       '<p ng-class="{empty: value.name == null}">{{value.name != null ? value.name : title}}</p>' +
                       '<i class="icon ion-chevron-right"></i>' +
                   '</label>',
        scope   : {
            value: "=value",
            category: "=category"
        },
        link: function($scope, element, attrs) {
            $scope.title = "Учреждение";

            $ionicModal.fromTemplateUrl("templates/shopSelect.html", {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal
            });


            $scope.open = function() {
                $scope.doRefresh(false);
                $scope.modal.show();
            };

            $scope.close = function() {
                $scope.modal.hide();
            }

            $scope.doRefresh = function(isPull) {
                shopService.getList().then(function(data) {
                    $scope.recordList = data.data;
                });

                if (isPull) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                }
            };

            $scope.select = function(shop) {
                $scope.value = {
                    id: shop.id,
                    type: shop.name,
                    name: shop.title
                };
                if (!$scope.category) {
                    $scope.category = shop.defaultCategory;
                }

                $scope.close();
            }

            $scope.getColor = function(category) {
                if (category) {
                    return category.color;
                }
                return '#ffffff';
            };

            $scope.getIcon = function(category) {
                if (category) {
                    return iconService.getCategoryIcon(category.icon);
                }
                return 'ion-help';
            };

        }
    };
})



.directive('datePicker', function($ionicModal, $ionicPopup, $filter){
    return {
        restrict: 'E',
        replace : true,
        template: '<label class="item item-input item-select-list item-icon-left item-icon-right" ng-click="open()">' +
                       '<i class="icon ion-calendar"></i>' +
                       '<p ng-class="{empty: value == null}">{{value == null ? title : ""}}{{value | date:"yyyy-MM-dd"}}</p>' +
                       '<i class="icon ion-chevron-right"></i>' +
                   '</label>',
        scope   : {
            value: "=value",
            title: "=title"
        },
        link: function($scope, element, attrs) {

            $scope.open = function() {
                if (window.datePicker == undefined) {
                    $scope.popupData = {
                        value: $filter('date')($scope.value ? $scope.value : new Date().getTime(), "yyyy-MM-dd")
                    }

                    var myPopup = $ionicPopup.show({
                        template: '<input type="text" ng-model="popupData.value">',
                        title   : 'Введите дату',
                        subTitle: 'YYYY-MM-DD',
                        scope   : $scope,
                        buttons : [{
                            text: 'Отмена',
                            type: 'button-positive'
                        }, {
                            text: 'ОК',
                            type: 'button-positive',
                            onTap: function(e) {
                                if (!$scope.popupData.value) {
                                    //don't allow the user to close unless he enters wifi password
                                    e.preventDefault();
                                } else {
                                    return $scope.popupData.value;
                                }
                            }
                        }]
                    });
                    myPopup.then(function(res) {
                        if (res === undefined) {
                            return;
                        }

                        var dateParts = res.split("-");
                        if (dateParts.length == 3) {
                            $scope.value = new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]);
                            $scope.$apply();
                        }
                    });
                }
                else {
                    var options = {
                        date: $scope.value ? new Date($scope.value) : new Date(),
                        mode: 'date'
                    };

                    datePicker.show(options, function(date){
                        $scope.value = date ? date.getTime() : date;
                        $scope.$apply();
                    });
                }
            }

        }
    };
});