/**
 * {Template_Description_Abstract}
 *
 * @author Popov K. konstantin.icreative@gmail.com
 * @date_created 20.07.17
 * @copyright {Template_Description_Copyrights}
 */

var dependencies = [];

define(dependencies, function () {

    var app = angular.module('modules.total-price.forms.orders.resources');

    /**
     * Определение сервиса "Ajax" для общения с сервером
     */
    app.factory('AjaxService', ['$http', '$q', function ($http, $q) {
        /**
         *
         * @constructor
         */
        function AjaxService() {
            /**
             * Путь к контроллеру \TotalPrice_IndexController::serviceAction
             * @type {string}
             */
            this.baseUrl = '/total-price/orders/service/';
        }


        /**
         * Чтение
         * @param id
         * @return {*}
         */
        AjaxService.prototype.fetch = function (id) {
            return this.request({
                command: 'fetch',
                id: id
            });
        };


        /**
         * Запись
         * @param data
         * @return {*}
         */
        AjaxService.prototype.info = function (params) {
            return this.httpDefer($http({
                url: this.baseUrl,
                method: 'POST',
                data: {
                    command: 'save',
                    data: params
                }
            })).promise;
        };


        /**
         * Удаление созданных (предсоздание), но не сохранённых заказов
         * @param id - Id заказа
         * @return {*}
         */
        AjaxService.prototype.remove = function (id) {
            return this.request({
                command: 'remove',
                id: id
            });
        };


        /**
         * Удаление файла
         * @param id - Id файла
         * @return {*}
         */
        AjaxService.prototype.fileDelete = function (id) {
            return this.request({
                command: 'fileDelete',
                id: id
            });
        };


        /**
         * Получение списка транзакций по номеру и дате, поиска по формату:
         * PURCHASE ORDER {№} DATE {MARCH 28. 2017}
         * @param number
         * @param date
         * @return {*}
         */
        AjaxService.prototype.fetchTransactions = function (number, date) {
            return this.request({
                command: 'fetchTransactions',
                number: number,
                date: date
            });
        };


        /**
         * Отправка запроса
         * @param params
         * @return {Promise}
         */
        AjaxService.prototype.request = function (params) {
            return this.httpDefer($http({
                url: this.baseUrl,
                params: params
            })).promise;
        };


        /**
         * Деферед запросы
         * @param httpObj
         * @returns {*|Deferred}
         */
        AjaxService.prototype.httpDefer = function (httpObj) {
            var defer = $q.defer();

            httpObj.then(function (response) {
                if (response.data.success) {
                    defer.resolve(response.data);
                } else {
                    if (typeof response.data.error == 'undefined') {
                        defer.reject('Unknown error/response');
                    } else {
                        defer.reject(response.data.error);
                    }
                }
            }, function () {
                defer.reject('HTTP Error1');
            }).catch(function () {
                defer.reject('HTTP Error2');
            });

            return defer;
        };


        return new AjaxService();
    }]);
});
