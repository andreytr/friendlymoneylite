angular.module('fm.directives', [])

.directive('categoryParentSelect', function($ionicModal, $filter, categoryService){
    return {
        restrict: 'E',
        replace : true,
        template: '<a ng-click="open()">parent - {{value}}</a>',
        scope   : {
            value: "=value",
            type: "=type",
            excludeId: "=excludeId"
        },
        link: function($scope, element, attrs) {
            $ionicModal.fromTemplateUrl("templates/categoryParentSelect.html", {
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

            $scope.getIcon = function(category) {
                return 'ion-pound';
            }

            $scope.doRefresh = function(isPull) {
                categoryService.getTreeList().then(function(data) {
                    if (data) {
                        data = $filter('filter')(data, { type: $scope.type });
                    }
                    $scope.categoryList = data;
                });

                if (isPull) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                }
            };

            $scope.select = function(category) {
                $scope.value = category.id;
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
});