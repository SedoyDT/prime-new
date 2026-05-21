/**
 * {Template_Description_Abstract}
 *
 * @author Popov K. konstantin.icreative@gmail.com
 * @date_created 28.06.17
 * @copyright {Template_Description_Copyrights}
 */

var dependencies = [];

define(dependencies, function () {

    var app = angular.module('modules.total-price.forms.index.resources');

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
            this.baseUrl = '/total-price/catalog/service/';
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
        AjaxService.prototype.info = function (data) {
            return this.httpDefer($http({
                url: this.baseUrl,
                method: 'POST',
                params: {                    
                    command: 'save',
                    data: data
                }
            }));
        };


        /**
         * Проверка был ли для выбранного товара уже сопоставлен код ТНВЭД
         * @param item_id - идентификатор выбранного товара
         * @return {*}
         */
        AjaxService.prototype.checkIfTnvedCodeWasMatched = function (item_id) {
            return this.request({
                command: 'checkIfTnvedCodeWasMatched',
                item_id: item_id
            });
        };


        /**
         * Удаление файла
         * @param params - Параметры: режим, путь, имя файла
         * @return {*}
         */
        AjaxService.prototype.fileDelete = function (params) {
            return this.request({
                command: 'fileDelete',
                params: params
            });
        };

        /**
         * запуск копирования файла
         * @param source
         * @param destination
         * @return {Promise}
         */
        AjaxService.prototype.fileCopy = function (source, destination) {
            return this.request({
                command: 'fileCopy',
                params: {source: source, destination: destination}
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
            }));
        };


        /**
         * Деферед запросы
         * @param httpObj
         * @returns {*|Deferred}
         */
        AjaxService.prototype.httpDefer = function (httpObj) {
            return httpObj.then(
                function (response) {
                    if (response.data.success) {
                        return response.data.result;
                    } else {
                        if (typeof response.data.error == 'undefined') {
                            throw Error('Unknown error/response');
                        } else {
                            throw Error(response.data.error);
                        }
                    }
                },
                function (reason) {
                    throw Error(reason);
                }
            );
        };


        return new AjaxService();
    }]);
});
