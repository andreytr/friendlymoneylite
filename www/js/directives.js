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
        template: '<label class="item item-input">' +
                       '<input type="text" ng-model="value.name" placeholder="Тип счета" required ng-click="open()"">' +
                   '</label>',
        scope   : {
            value: "=value"
        },
        link: function($scope, element, attrs) {
            $ionicModal.fromTemplateUrl("templates/accountTypeSelect.html", {
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
                    $scope.typeList = data;
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
});