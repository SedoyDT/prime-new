/**
 * {Template_Description_Abstract}
 *
 * @author Popov K. konstantin.icreative@gmail.com
 * @date_created 26.06.17
 * @copyright {Template_Description_Copyrights}
 */

var dependencies = [];

define(dependencies, function () {
    var app = angular.module('modules.total-price.forms.index.resources');

    /**
     * Angular контроллер формы Total Price
     */
    app.controller('FormController', ['$scope', 'form', 'DataService', 'ProductService', 'AjaxService', 'AclService', 'CurrencyService', 'TnvedService', 'NotifyService', 'gridController',
        /**
         *
         * @param $scope
         * @param Form AjaxForm
         * @param DataService
         * @param ProductService
         * @param AjaxService
         * @param AclService
         * @param CurrencyService
         * @param TnvedService
         * @param NotifyService
         * @param GridController - Контроллер grid (внешний функционал)
         */
        function ($scope, Form, DataService, ProductService, AjaxService, AclService, CurrencyService, TnvedService, NotifyService, GridController) {
            /**
             * Конструктор
             * @return void
             */
            $scope.init = function () {
                // Связывание свойства $scope с дата-сервисом
                $scope.dataService = DataService.get();
                $scope.aclService = AclService;
                $scope.currencyService = CurrencyService;

                // Необходимо уведомить $scope о том, что форма построена
                Form.options.postBuildCallback = function (form) {
                    DataService.set('isAjaxFormLoaded', true);
                    form.getDomObject().find('dl>div').not('[style*="display:none"]').filter(':odd').css('background', '#F0F0F6');
                };

                // Так как autocomplete требует, чтобы выпадающие селекты выходили за пределы страницы, изменяем стили jquery transition
                Form.setShowCallback(function () {
                    $(' div.jquery-transition-desktop div.jquery-transition-window ').css({overflow: 'visible'});
                });

                // Инициализировать форму выбора товара
                ProductService.init();
                // Инициализировать форму выбора кода ТНВЭД
                TnvedService.init();
            }();


            /**
             * Открыть ajax-форму
             */
            $scope.openForm = function (event) {

                var renderViewProductTableCb = function () {
                    ProductService.renderProductTable();
                };

                var renderViewTnvedTableCb = function () {
                    TnvedService.renderTnvedTable();
                };

                var selectedId = event.target.getAttribute('data-selected-id');
                var copyId = event.target.getAttribute('data-copy-id');

                if (selectedId || copyId) {

                    // Включаем прелоадер
                    DataService.set('isLoading', 'isLoading');

                    AjaxService.fetch(selectedId || copyId)
                        .then(function (result) {

                            var worldPhonesService = DataService.get('params').worldPhones;

                            // Так как код страны не хранится в БД, его необходимо определить, для этого используем /js/world-phones.js
                            if ($.isArray(result.model.phones)) {
                                // Если номеров не было сохранено - добавляем один по-умолчанию
                                if (!result.model.phones.length) {
                                    result.model.phones.push({
                                        $$mask: DataService.get('params').worldPhones.countryPhoneMasks['ru'],
                                        phone: '',
                                        ext: ''
                                    })
                                }
                                // Если номера были получены, то подготоваливаем данные - определяем маску
                                else
                                {
                                    result.model.phones.forEach(function (phone) {
                                        phone.$$mask = worldPhonesService.countryPhoneMasks[worldPhonesService.detectNumberAlias(phone.phone)];
                                    });
                                }
                            }

                            // Сохраняем клиента, который был выбран изначально
                            result.model.$$initialClientId = result.model.client_id;

                            // если форма открыта для создания копии записи, то производим доп подготовку данных
                            if (copyId) {
                                result.model.hash = new Date().valueOf();
                                result.model.id = null;
                                result.model.item_id = null;
                                result.product = {};
                                result.model.phones.forEach(function (phone) {
                                    phone.id = null;
                                    phone.catalog_id = null;
                                });
                                result.model.files.forEach(function (fileType) {
                                    fileType.forEach(function (file) {
                                        file.catalog_id = null;
                                        file.original_id = file.id;
                                        file.id = null;
                                        AjaxService.fileCopy(file.original_id, result.model.hash).then(
                                            function (result) {
                                                if (result.success === false) {
                                                    NotifyService.error(result.message);
                                                }
                                            },
                                            function (reason) {
                                                console.error(reason);
                                                NotifyService.error('Возникла ошибка при копировании файла');
                                            }
                                        ).catch(function (reason) {
                                            console.error(reason);
                                            NotifyService.error('Возникла ошибка при копировании файла');
                                        });
                                    });
                                });
                            }

                            DataService.set('model', result.model, renderViewTnvedTableCb);
                            // Отрендерить таблицу с продуктом
                            DataService.set('product', result.product, renderViewProductTableCb);
                        })
                        .catch(function (error) {
                            alert(error);
                        })
                        .finally(function () {
                            // Убираем прелоадер
                            DataService.set('isLoading', false);
                        });
                }
                // Иначе - добавление
                else
                {
                    // Обнуляем модель
                    DataService.set('model', {
                        // Уникальный хеш, необходим для загрузки файлов при добавлении формы
                        hash: new Date().valueOf(),
                        // Чтобы отобразить пустое поле с предложением по-умолчанию
                        client_id: 0,
                        price: '',
                        // Чтобы по-умолчанию был выбран "Справочник" в типе для ТНВЭД кода
                        tnved_type: 1,
                        tnved: {},
                        descr: '',
                        phones: [{
                            $$mask: DataService.get('params').worldPhones.countryPhoneMasks['ru'],
                            phone: '',
                            ext: ''
                        }],
                        // По-умолчанию тип файла "не выбрано"
                        file_type: '0',
                        files: [[],[]],
                        typeKeys: {
                            documents: 0,
                            additional: 1
                        }
                    }, renderViewTnvedTableCb);
                    DataService.set('product', {}, renderViewProductTableCb);
                }

                // Показываем сразу
                Form.show();
            };


            /**
             * Сохранить данные формы
             */
            $scope.info = function () {
                var promise = AjaxService.info(DataService.get('model'));
                promise
                    .then(function (result) {
                        if (result.isValid) {
                            Form.hide();

                            // Запустить обновление внешнего для формы grid
                            GridController.filter.dataTable.grid.update();
                        } else {
                            var message = '';
                            Object.keys(result.errors).forEach(function (field) {
                                message += field + ': ' + result.errors[field] + "\n";
                            });

                            NotifyService.error('Форма содержит ошибки', message);
                        }
                    })
                    .catch(function (error) {
                        alert(error);
                    })
            };


            /**
             * Открыть форму выбора товара
             */
            $scope.openProductForm = function () {
                ProductService.openSelectionForm(function (itemId) {
                    // Посылаем запрос на сервер для поиска совпадений
                    AjaxService.checkIfTnvedCodeWasMatched(itemId)
                    // Вызываем обработчика результата запроса из сервиса
                        .then(TnvedService.setAutomaticallyCallback.bind(TnvedService))
                });
            };


            /**
             * Открытие формы выбора кода ТНВЭД
             */
            $scope.openTnvedForm = function () {

                // Предупреждение, если код был установлен автоматически на основании имеющихся данных
                if (DataService.get('model').tnved.isCodeWasSetAutomatically) {
                    if (!confirm('Код ТНВЭД был установлен автоматически, так как было найдено соответствие по выбранному товару, вы уверены, что хотите выбрать другой код ТНВЭД?')) {
                        return false;
                    }
                }

                TnvedService.openSelectionForm();
            };


            /**
             * Добавить новый номер телефона
             */
            $scope.addPhone = function () {
                var model = DataService.get('model');
                model.phones.push({
                    // Связь с total_price строкой
                    catalog_id: model.id,
                    $$mask: DataService.get('params').worldPhones.countryPhoneMasks['ru'],
                    // Не выбрано
                    phone: '',
                    ext: ''
                });
            };


            /**
             * Удалить номер телефона
             */
            $scope.removePhone = function (offerItem) {
                // Данные удаляются только на клиентской стороне, на сервере изменения применятся при сохранении формы
                var phones = DataService.get('model').phones;
                phones.splice(phones.indexOf(offerItem), 1);
            };


            /**
             * Получение списка масок для использования в шаблоне
             * @return {worldPhones.countryPhoneMasks|{ru, cn, tw, hk, kz, by, uz, am}}
             */
            $scope.getPhoneMasks = function () {
                return DataService.get('params').worldPhones.countryPhoneMasks;
            };


            /**
             * Параметры для работы директивы ui-mask
             * @type {{maskDefinitions: (any)}}
             */
            $scope.maskOptions = {
                maskDefinitions: DataService.get('params').worldPhones.maskDefinitions
            };

            /**
             * Установка доп полей после выбора завода
             * @param {Object} data
             * @returns {undefined}
             */
            $scope.setFactoryFields = function(data) {
                var model = DataService.get('model');
                var worldPhonesService = DataService.get('params').worldPhones;

                if (!model.name && data.name) {
                    model.name = data.name;
                }

                if (!model.email && data.email) {
                    model.email = data.email;
                }

                if (!model.site && data.site) {
                    model.site = data.site;
                }

                if (data.phones) {
                    data.phones.forEach(function (phone) {
                        phone.catalog_id = model.id;
                        phone.$$mask = worldPhonesService.countryPhoneMasks[worldPhonesService.detectNumberAlias(phone.phone)];

                        model.phones.push(phone);
                    });
                }
            };

        }]);
});