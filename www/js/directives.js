angular.module('fm.directives', [])

.directive('categorySelect', function($ionicModal, $ionicScrollDelegate, categoryService){
    return {
        restrict: 'E',
        replace : true,
        template: '<label class="item item-input item-select-list item-icon-right" ng-click="open()">' +
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
                return 'ion-pound';
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
                $scope.value = category;
                $scope.close();
            }


            $scope.changeTab = function(tab) {
                $scope.type = tab;
                $ionicScrollDelegate.scrollTop();
            };
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

.directive('datePicker', function($ionicModal, $ionicPopup, $filter){
    return {
        restrict: 'E',
        replace : true,
        template: '<label class="item item-input item-select-list item-icon-right" ng-click="open()">' +
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