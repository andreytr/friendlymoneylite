//var mainUrl = 'https://friendly-money.com/api/';
var mainUrl = 'http://192.168.0.101:8080/friendly-money/api/';


angular.module('fm.services', [])

.factory('HttpInterceptor', function($q, $rootScope, settingsService) {
    return {
        request: function(config) {
            config.headers = config.headers || {};

            var token = settingsService.get('fmData.token');
            if (token && token != 'null') {
                config.headers['X-Auth-Token'] = token;
            }

            //$rootScope.$broadcast('loading:show')
            return config
        },
        response: function(response) {
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
                $rootScope.$broadcast('loading:showError', 'Сервер временно не доступен');
            }
            if (rejection.status == 401) {
                $rootScope.$broadcast('loading:showError', 'Необходимо авторизоваться');
                settingsService.set('fmData.token', "");
                $rootScope.$broadcast('state:login');
            }
            return $q.reject(rejection);
        }
    }
})

.factory('LoadingService', ['$ionicLoading', function($ionicLoading) {
    return {
        show: function(content) {
            $ionicLoading.show({
                content: content || 'Loading Data',
                animation: 'fade-in',
                showBackdrop: true,
                showDelay: 300
            });
        },

        hide: function() {
            $ionicLoading.hide();
        }
    };
}])


.factory('userService', function($http, $ionicPopup) {

    var currentPlatform = ionic.Platform.platform();
    var currentPlatformVersion = ionic.Platform.version();

    var getAppName = function() {
        return 'FM Lite: ' + currentPlatform + ' ' + currentPlatformVersion;
    }

    return {
        login: function(username, password) {
             return $http.post(mainUrl + "user/login", {
                    name: username,
                    password: password,
                    appName: getAppName()
                 }
             )
             .success(function(result) {
                 return true;
             });
        },

        register: function(userData) {
             userData['appName'] = getAppName();
             return $http.post(mainUrl + "user/register", userData)
             .success(function(result) {
                 return true;
             });
        },

        logout: function(callback) {
             return $http.post(mainUrl + "user/logout")
             .success(function(result) {
                 callback.call(this);
                 return true;
             });
        },

        changePassword: function(password, callback) {
            return $http.post(mainUrl + "user/changePassword", {
                password: password,
                password2: password
            })
            .success(function(result) {
                callback.call(this);
                return true;
            });
        },

        saveProfile: function(profile, callback) {
            return $http.post(mainUrl + "user/saveProfile", profile)
            .success(function(result) {
                callback.call(this);
                return true;
            });
        }

   }
})

.factory('accountService', function($http) {

   return {
        getList: function() {
             return $http.get(mainUrl + "account/list")
             .then(function(result) {
                 return result.data;
             });
        },
        getTypeList: function() {
             return $http.get(mainUrl + "account/typeList")
             .then(function(result) {
                 return result.data;
             });
        },
        getCurrencyList: function() {
             return $http.get(mainUrl + "account/currencyList")
             .then(function(result) {
                 return result.data;
             });
        },
        update: function(account) {
            return $http.post(mainUrl + "account/update", account)
            .success(function(result) {
                return result;
            });
        },
        remove: function(accountId) {
            return $http.post(mainUrl + "account/delete/" + accountId)
            .success(function(result) {
                return result;
            });
        }
   }
})

.factory('categoryService', function($http) {

   return {
        getTreeList: function() {
            return $http.get(mainUrl + "categories/treeAmountList")
            .then(function(result) {
                return result.data;
            });
        },

        update: function(category) {
            return $http.post(mainUrl + "categories/update", category)
            .success(function(result) {
                return result;
            });
        }
   }
})

.factory('shopService', function($http) {

   return {
        getList: function() {
             return $http.post(mainUrl + "shop/list", {})
             .success(function(result) {
                 return result;
             });
        },
        update: function(record) {
            return $http.post(mainUrl + "shop/update", record)
            .success(function(result) {
                return result;
            });
        },
        remove: function(id) {
            return $http.post(mainUrl + "shop/delete/" + id)
            .success(function(result) {
                return result;
            });
        }
   }
})

.factory('operationService', function($http, $filter) {

   return {
        getList: function(page, count, filter) {
            var dataFilter = filter;

            if (dataFilter['fromDate']) {
                dataFilter['fromDate'] = $filter('date')(dataFilter['fromDate'], "yyyy-MM-dd");
            }
            if (dataFilter['toDate']) {
                dataFilter['toDate'] = $filter('date')(dataFilter['toDate'], "yyyy-MM-dd");
            }

            return $http.post(mainUrl + "operation/list?page=" + page + "&count=" + count, dataFilter)
            .success(function(result) {
                return result;
            });
        },
        update: function(operation) {
            delete operation['temp'];
            return $http.post(mainUrl + "operation/update", operation)
            .success(function(result) {
                return result;
            });

        },
        transfer: function(transfer) {
            delete transfer['fromCurrency'];
            delete transfer['toCurrency'];

            return $http.post(mainUrl + "operation/transfer", transfer)
            .success(function(result) {
                return result;
            });
        }
   }
})


.factory('reportService', function($http, $filter) {

    var reportList = [];

    var loadReportList = function() {
        return $http.get(mainUrl + "report/list")
            .then(function(result) {
                reportList = result.data;
                return reportList;
            });
    }

    var getReportByName = function(name) {
        if (reportList && reportList.length) {
            for(var i = 0; i < reportList.length; i++) {
                var report = reportList[i];
                if (report['name'] == name) {
                    return report;
                }
            }
        }
        return null;
    }

    return {
        getList: loadReportList,
        getReportByName: getReportByName,
        getData: function(reportName, filter) {
            var dataFilter = filter;
            if (dataFilter['fromDate']) {
                dataFilter['fromDate'] = $filter('date')(dataFilter['fromDate'], "yyyy-MM-dd");
            }
            if (dataFilter['toDate']) {
                dataFilter['toDate'] = $filter('date')(dataFilter['toDate'], "yyyy-MM-dd");
            }


            return $http.post(mainUrl + "report/data?reportName=" + reportName, dataFilter)
             .success(function(result) {
                 return result;
             });
        }
    }

})

.factory('iconService', function() {

    var categoryIconMap = {
        'business':     'ion-briefcase',        //Бизнес
        'charity':      'ion-heart',            //Благотворительность
        'home':         'ion-home',             //Дом
        'household_appliances': 'ion-monitor',  //Бытовая техника
        'utilities':    '',                     //Коммунальные платежи
        'rent':         'ion-clock',            //Аренда
        'repair':       '',                     //Ремонт
        'credit'        : 'ion-percent',        //Долги, кредиты
        'mortgage':     '',                     //Ипотека
        'other':        'ion-more',             //Другое
        'invest':       'ion-arrow-graph-up-right', //Инвестиции
        'beauty':       '',                     //Красота и здоровье
        'medicine':     'ion-medkit',           //Медицина, аптеки
        'internet':     'ion-wifi',             //Мобильная связь, интернет, ТВ
        'education':    'ion-university',       //Образование
        'clothing':     '',                     //Одежда, обувь, аксесуары
        'food':         'fa fa-shopping-cart',  //Продукты
        'star':         'fa fa-star-o',         //Развлечения
        'restaurant':   'ion-coffee',           //Кафе, рестораны
        'rocket':       'fa fa-rocket',         //Хобби, увлечения
        'vacation':     'fa fa-sun-o',          //Отпуск, путешествия
        'road':         'fa fa-road',           //Транспорт
        'car':          'ion-model-s',          //Личный автомобиль (топливо, обслужива...
        'bus':          'fa fa-bus',            //Общественный транспорт
        'airplane':     'ion-plane',            //Поезда, самолеты, корабли
        'taxi':         'fa fa-taxi',           //Такси
        'tax':          'fa fa-newspaper-o',    //Штрафы, налоги, пошлины
        'cinema':       'ion-film-marker',      //Боулинг, кино и т.д.
        'flowers':      'ion-leaf',             //Цветы
        'cloud':        'ion-cloud',            //Софт, программы
        'sport':        'fa fa-bicycle',        //Спорт
        'dance':        '',                     //Танцы
        'music':        'ion-music-note',       //Музыка
        'celebration':  'ion-wineglass',        //Торжества
        'freelance':    'ion-paper-airplane',   //Фриланс
        'gift':         'fa fa-gift',           //Подарки
        'money':        'fa fa-money',          //Работа
        'deposit':      'fa fa-bank',            //Депозит, cashback




        'checkmark-round':  'ion-checkmark-round',
        'help-buoy':    'ion-help-buoy',
        'asterisk':     'ion-asterisk',
        'alert':        'ion-alert',
        'alert-circled':    'ion-alert-circled',
        'flag':         'ion-flag',
        'star':         'ion-star',
        'heart-broken': 'ion-heart-broken',
        'gear':         'ion-gear-a',
        'settings':     'ion-settings',
        'wrench':       'ion-wrench',
        'hammer':       'ion-hammer',
        'edit':         'ion-edit',
        'trash-a':      'ion-trash-a',
        'trash-b':      'ion-trash-b',
        'document':     'ion-document',
        'document-text':'ion-document-text',
        'bookmark':     'ion-bookmark',
        'email':        'ion-email',
        'archive':      'ion-archive',
        'share':        'ion-share',
        'paperclip':    'ion-paperclip',
        'at':           'ion-at',
        'pound':        'ion-pound',
        'compass':      'ion-compass',
        'pinpoint':     'ion-pinpoint',
        'pin':          'ion-pin',
        'navigate':     'ion-navigate',
        'location':     'ion-location',
        'map':          'ion-map',
        'unlocked':     'ion-unlocked',
        'key':          'ion-key',
        'arrow-graph-down-right': 'ion-arrow-graph-down-right',
        'chatbubble':   'ion-chatbubble',
        'chatbubbles':  'ion-chatbubbles',
        'person':       'ion-person',
        'person-stalker':'ion-person-stalker',
        'woman':        'ion-woman',
        'man':          'ion-man',
        'female':       'ion-female',
        'male':         'ion-male',
        'fork':         'ion-fork',
        'knife':        'ion-knife',
        'spoon':        'ion-spoon',
        'beer':         'ion-beer',
        'icecream':     'ion-icecream',
        'pizza':        'ion-pizza',
        'camera':       'ion-camera',
        'images':       'ion-images',
        'image':        'ion-image',
        'laptop':       'ion-laptop',
        'ipad':         'ion-ipad',
        'iphone':       'ion-iphone',
        'printer':      'ion-printer',
        'game':         'ion-game-controller-b',
        'video':        'ion-videocamera',
        'bag':          'ion-bag',
        'trophy':       'ion-trophy',
        'happy':        'ion-happy',
        'sad':          'ion-sad',
        'egg':          'ion-egg',
        'light':        'ion-lightbulb',
        'bonfire':      'ion-bonfire',
        'animal':       'fa fa-paw',
        'tree':         'fa fa-tree',
        'university':   'fa fa-university',
        'futbol':       'fa fa-futbol-o',
        'plane2':       'fa fa-plane',
        'anchor':       'fa fa-anchor',
        'book':         'fa fa-book',
        'child':        'fa fa-child',
        'truck':        'fa fa-truck',
        'gavel':        'fa fa-gavel',
        'cake':         'fa fa-birthday-cake'
    }

   return {
        getAccountIcon: function(type) {
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
        },

        getAccountColor: function(type) {
             if (type) {
                 if (type.type == 1) {
                     return '#b9ab6a';
                 }
                 if (type.type == 2) {
                     return '#94b46b';
                 }
                 if (type.type == 3) {
                     return '#b46e70';
                 }
                 if (type.type == 4) {
                     return '#6da1b6';
                 }
             }
             return '#00b9f2';
        },

        getCurrencyIcon: function(type) {
            if (type == 'RUB') {
                return 'fa fa-rub';
            }
            if (type == 'USD') {
                return 'fa fa-usd';
            }
            if (type == 'EUR') {
                return 'fa fa-eur';
            }
            if (type == 'CNY') {
                return 'fa fa-cny';
            }
            if (type == 'JPY') {
                return 'fa fa-jpy';
            }
            if (type == 'GBP') {
                return 'fa fa-gbp';
            }

            return type ? 'currency-' + type.toLowerCase() : 'ion-help';
        },

        getCategoryIcon: function(iconName) {
            if (categoryIconMap.hasOwnProperty(iconName)) {
                return categoryIconMap[iconName];
            }
            return 'ion-help';
        },

        getIconList: function() {
            var result = [];
            for(var k in categoryIconMap) {
                if (categoryIconMap[k]) {
                    result.push(k);
                }
            }
            return result;
        },

        getColorList: function() {
            return [  '#6c75b6', '#6c8db6', '#6c98b5', '#6da6b7', '#6cacb6',
                      '#6cb3b7', '#6cb6a5', '#6db5b1', '#6cb57d', '#6fb56c',
                      '#80b66b', '#9ab66c', '#aab66c', '#b2b66c', '#b7b56b',
                      '#b69f6d', '#b5926c', '#b6956c', '#b78a6d', '#b7796c',
                      '#b6786d', '#b36b6c', '#b66c6d', '#b76b6b', '#b66b80',
                      '#b76caf', '#9a6cb5' ]
        }
   }
})

.factory('smsService', function($ionicPopup, messagesService) {

    document.addEventListener('onSMSArrive', function(e) {
        var data = e.data;
        var availableNumbers = messagesService.getAvailableNumbers();
        if (availableNumbers && availableNumbers.length > 0) {
            if (availableNumbers.indexOf(data['address']) > -1) {
                messagesService.onReceiveMessage([{
                    address: data['address'],
                    date: data['date'],
                    body: data['body']
                }])
            }
        }
    });

    var readMessages = function(fromDate) {
        if (window.SMS === undefined) {
            return;
        }
        var availableNumbers = messagesService.getAvailableNumbers();

        if (availableNumbers && availableNumbers.length > 0) {

            var currentTimeMillis = Date.now();
            for(var i = 0; i < availableNumbers.length; i++) {
                var filter = {
                    box     : 'inbox',
                    address : availableNumbers[i],
                    maxCount: 999
                };

                SMS.listSMS(filter, function(data) {
                    if (data && data.length > 0) {
                        var messages = [];
                        for(var i = 0; i < data.length; i++) {
                            var date = data[i]['date'];
                            if (date < 0) {
                                date += currentTimeMillis;
                            }

                            if (date < fromDate) {
                                continue;
                            }

                            messages.push({
                                address: data[i]['address'],
                                date: date,
                                body: data[i]['body']
                            });
                        }
                        messagesService.onReceiveMessageList(messages);
                    }
                }, function(message) {
                    $ionicPopup.alert({
                         cssClass: 'error',
                         template: message
                    });
                });
            }
        }
    }

    var setEnabled = function(enabled, successCallback, errorCallback) {
         if (window.SMS === undefined) {
             return;
         }

         if (enabled) {
             SMS.startWatch(successCallback, errorCallback);
         }
         else {
             SMS.stopWatch(successCallback, errorCallback);
         }
    }

    setEnabled(true, function() {
        $ionicPopup.alert({
             template: 'SMS включено'
        });
    }, function() {
        $ionicPopup.alert({
             cssClass: 'error',
             template: 'Не удалось включить мониторинг SMS оповещений от банков'
        });
    });

    return {
        setEnabled: setEnabled,
        readMessages: readMessages
    }

})

.factory('messagesService', function($http) {
    var templates = [];
    var availableNumbers = [];
    var receivedMessages = [];

    var loadTemplates = function(callback, scope) {
         $http.post(mainUrl + "message/availableNumber", {})
         .success(function(result) {
             return result;
         })
         .then(function(data) {
             templates = data.data;

             availableNumbers = [];
             for(var i = 0; i < templates.length; i++) {
                 var number = templates[i]['phoneNumber'];
                 if (number && availableNumbers.indexOf(number) < 0) {
                     availableNumbers.push(number);
                 }
             }

             if (callback) {
                callback.call(scope || this);
             }
         });
    }

    var getVarList = function(body) {
        var re = new RegExp('\\[(.+?)\\]', 'g');
        var varList = body.match(re);
        if (varList && varList.length > 0) {
            for(var i = 0; i < varList.length; i++) {
                varList[i] = varList[i].replace('[', '');
                varList[i] = varList[i].replace(']', '');
            }
        }

        return varList;
    }

    var  replaceVarInTpl = function(tpl, varList) {
        for(var i = 0; i < varList.length; i++) {
            var v = varList[i];
            tpl = tpl.replace('[' + v + ']', v == 'NUMBER' ? '(\\d+?)' : '(.+?)');
        }
        return tpl;
    }

    var parseMessage = function(address, body, timestamp, messageId) {
        for(var i = 0; i < templates.length; i++) {
            var t = templates[i];
            if (t['phoneNumber'] != address) {
                continue;
            }

            var varList = getVarList(t['bodyTemplate']);
            var tpl = replaceVarInTpl(t['bodyTemplate'], varList);

            var re = new RegExp(tpl);
            if (!re.test(body)) {
                continue;
            }

            var dataList = re.exec(body);
            if (dataList.length > varList.length) {
                var data = {};
                for(var j = 0; j < varList.length; j++) {
                    data[varList[j]] = dataList[j + 1];
                }

                return {
                    id: messageId,
                    date: timestamp,
                    templateId: t['templateId'],
                    messageData: data
                };
            }
        }
        return null;
    }

    var sendDataToServer = function(messageDataList) {
        return $http.post(mainUrl + "message/process", {
                source: 'ANDROID_SMS',
                messageDataList: messageDataList
             })
             .success(function(result) {
                 return result;
             });
    }

    var applyProcessResult = function(messageList, resultList) {
        for(var i = 0; i < resultList.length; i++) {
            var externalMessageId = resultList[i]['externalMessageId'];
            for(var j = 0; j < messageList.length; j++) {
                if (messageList[j]['id'] == externalMessageId) {
                    var status = resultList[i].status;
                    if (status == 'ALREADY_EXISTS' || status == 'UNKNOWN_PATTERN') {
                        status = 'SKIPPED';
                    }

                    messageList[j]['status'] = status;
                    messageList[j]['sent'] = true;
                }
            }
        }
    };

    var processMessages = function(messageList) {
        var messageDataList = [];

        for(var i = 0; i < messageList.length; i++) {
            var message = messageList[i];
            var result = parseMessage(message['address'], message['body'], message['timestamp'], message['id']);
            if (!result) {
                message['status'] = 'SKIPPED';
            }
            else {
                message['sendCount']++;
                messageDataList.push(result);
            }
        }

        if (messageDataList.length > 0) {
            sendDataToServer(messageDataList).then(function(data) {
                applyProcessResult(messageList, data.data);
            });
        }
    }

    var addMessage = function(message) {
        for(var i = 0; i < receivedMessages.length; i++) {
            if (receivedMessages[i]['id'] == message['id']) {
                receivedMessages[i] = message;
                return;
            }
        }
        receivedMessages.push(message);
    }

    var hashCode = function(str) {
        var hash = 0, i, chr, len;
        if (str.length == 0) {
            return hash;
        }
        for (i = 0, len = str.length; i < len; i++) {
            chr   = str.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    loadTemplates();

    return {
        loadTemplates: loadTemplates,
        getAvailableNumbers: function() {
            return availableNumbers;
        },
        getReceivedMessages: function() {
            return receivedMessages;
        },
        getMessageStats: function() {
            var result = {
                count: 0,
                queueCount: 0,
                operationCount: 0,
                skipCount: 0,
                errorCount: 0
            };

            for(var i = 0; i < receivedMessages.length; i++) {
                result.count++;

                var m = receivedMessages[i];
                if (m.status == 'QUEUE') {
                    result.queueCount++;
                }
                else if (m.status == 'CREATED_OPERATIONS') {
                    result.operationCount++;
                }
                else if (m.status == 'SKIPPED') {
                    result.skipCount++;
                }
                else if (m.status == 'EXCEPTION') {
                    result.errorCount++;
                }
            }

            return result;
        },
        onReceiveMessageList: function(messageList) {
            var messageToSend = [];
            for(var i = 0; i < messageList.length; i++) {
                var message = {
                    id          : hashCode(messageList[i]['body']),
                    address     : messageList[i]['address'],
                    timestamp   : messageList[i]['date'],
                    body        : messageList[i]['body'],

                    status: 'QUEUE',
                    sent: false,
                    sendCount: 0,
                    errorMessage: null
                };

                addMessage(message);
                messageToSend.push(message);
            }

            processMessages(messageToSend);
        }
    }

})

.factory('dataService', function($http, settingsService) {
    return {
        loadData: function(callback, errorCallback) {
            return $http.get(mainUrl + "data/dictionaryData")
            .then(function(result) {
                var data = {};
                if (result && result.data && result.data.length > 0) {
                    data = result.data[0];
                }
                else if (errorCallback) {
                    errorCallback.call(this);
                    return;
                }

                settingsService.setObject('fmData.userProfile', data['userProfile']);
                settingsService.setObject('fmData.operationTypeList', data['operationTypeList']);
                settingsService.setObject('fmData.currencyList', data['currencyList']);
                settingsService.setObject('fmData.accountTypeList', data['accountTypeList']);
                settingsService.setObject('fmData.categoriesTreeList', data['categoriesTreeList']);
                console.info(data);
                if (callback) {
                    callback.call(this);
                }
            });
        },

        clearData: function() {
            settingsService.setObject('fmData.userProfile', null);
            settingsService.setObject('fmData.operationTypeList', null);
            settingsService.setObject('fmData.currencyList', null);
            settingsService.setObject('fmData.accountTypeList', null);
            settingsService.setObject('fmData.categoriesTreeList', null);
            settingsService.setObject('fmData.security', null);
            settingsService.set('fmData.token', "");
        },

        getUserProfile: function() {
            return settingsService.getObject('fmData.userProfile');
        },

        getOperationTypeList: function() {
            return settingsService.getObject('fmData.operationTypeList');
        },

        getCurrencyList: function() {
            return settingsService.getObject('fmData.currencyList');
        },

        getAccountTypeList: function() {
            return settingsService.getObject('fmData.accountTypeList');
        },

        getCategoryList: function() {
            return settingsService.getObject('fmData.categoriesTreeList');
        },

        getSecurity: function() {
            return settingsService.getObject('fmData.security');
        },

        setSecurity: function(security) {
            settingsService.setObject('fmData.security', security);
        },

        getToken: function() {
            return settingsService.get('fmData.token');
        },

        setToken: function(token) {
            settingsService.set('fmData.token', token);
        }
    }
})


.factory('settingsService', function($window) {

    return {
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },

        set: function(key, value) {
            $window.localStorage[key] = value;
        },

        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || "{}");
        },

        setObject: function(key, obj) {
            $window.localStorage[key] = JSON.stringify(obj);
        }

    }

});
