//var mainUrl = 'https://friendly-money.com/api/';
var mainUrl = 'http://192.168.0.101:8080/friendly-money/api/';


angular.module('fm.services', [])

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

   return {
        login: function(username, password) {
             return $http.post(mainUrl + "user/login", {
                    name: username,
                    password: password
                 }
             )
             .success(function(result) {
                 return true;
             });
        },

        register: function(userData) {
             return $http.post(mainUrl + "user/register", userData)
             .success(function(result) {
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

.factory('operationService', function($http) {

   return {
        getList: function() {
            return $http.post(mainUrl + "operation/list", {})
            .success(function(result) {
                return result;
            });
        }
   }
})


.factory('reportService', function($http) {

    var reportList = [];
    var dataFilter = {};

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

    var getDataFilter = function() {
        return dataFilter;
    }

    var setDataFilter = function(filter) {
        dataFilter = filter;
    }

    return {
        getList: loadReportList,
        getReportByName: getReportByName,
        setDataFilter: setDataFilter,
        getDataFilter: getDataFilter,
        getData: function(reportName) {
            return $http.post(mainUrl + "report/data?reportName=" + reportName, dataFilter)
             .success(function(result) {
                 return result;
             });
        }
    }

})

.factory('iconService', function() {

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
            return 'ion-help';
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

});

