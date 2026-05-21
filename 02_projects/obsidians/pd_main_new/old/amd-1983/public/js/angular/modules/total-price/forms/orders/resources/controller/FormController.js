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
     * Angular контроллер формы Total Price
     */
    app.controller('FormController', ['$scope', 'form', 'DataService', 'AjaxService', 'AclService', '$window', 'FieldsHiderService', 'NotifyService', '$timeout', 'gridController', 'ClaimService',
        /**
         *
         * @param $scope
         * @param Form AjaxForm
         * @param DataService
         * @param AjaxService
         * @param AclService
         * @param $window
         * @param FieldsHiderService
         * @param NotifyService
         * @param $timeout
         * @param GridController
         * @param ClaimService
         */
            function ($scope, Form, DataService, AjaxService, AclService, $window, FieldsHiderService, NotifyService, $timeout, GridController, ClaimService) {

            /**
             * Конструктор
             * @return void
             */
            $scope.init = function () {
                // Связывание свойства $scope с дата-сервисом
                $scope.dataService = DataService.get();
                // Доступ к объекту window
                $scope.window = $window;
                // Доступ к объекту lodash
                $scope._ = $window._;
                // Доступ к сервису прав доступа
                $scope.aclService = AclService;

                /**
                 * Удаление несохранённых данных при закрытии страницы
                 * @return {*|JQueryXHR}
                 */
                $window.onunload = function () {
                    // https://stackoverflow.com/questions/21689233/how-to-send-an-http-request-onbeforeunload-in-angularjs
                    if (DataService.get('isNewRecord')) {
                        return $.ajax({
                            cache: false,
                            async: false,
                            type: 'POST',
                            url: AjaxService.baseUrl,
                            data: {command: 'remove', id: DataService.get('model').id}
                        });
                    }
                };

                /**
                 * Удаление несохранённых данных при нажатии кнопки "Закрыть"
                 */
                Form.setHideCallback(function () {
                    // Если форма закрывается, но не была сохранена, необходимо удалить данные из БД
                    if (DataService.get('isNewRecord')) {
                        return AjaxService.remove(DataService.get('model').id);
                    }
                });

                // Восстанавливаем настройки скрытия на основе localStorage
                FieldsHiderService.apply();

                // Параметры строки запроса
                var urlParams = new URLSearchParams(window.location.search);

                // Если установлен режим "Новый заказ"
                if (urlParams.get('mode') == 'new') {
                    // Открываем форму с переданными данными
                    $timeout($scope.buildForm);
                }

                /**
                 * Событие на закрытие родительского окна
                 * @type function
                 * @param {Object} catalogRow строка с информацией об элементе каталога
                 * @param {Number} rowAmount количество строк, которые нужно добавить
                 */
                $window.closeChildWindowCallback = function (catalogRow, rowAmount) {
                    for (var i = 0; i < rowAmount; i++) {
                        $scope.addPosition(catalogRow);
                    }
                };
            };


            /**
             * Программное открытие формы с какими либо дополнительными данными
             */
            $scope.buildForm = function () {
                $scope.openForm(function () {
                    if (!angular.isUndefined($window.catalogParams)) {
                        $window.catalogParams.rows.forEach(function (position) {
                            $scope.addPosition(position,
                                // Если есть данные с страницы "Заказы от менеджеров", передаём их вторым аргументом
                                $window.opener && $window.opener.opener && !angular.isUndefined($window.opener.opener.managerParams)
                                    ? $window.opener.opener.managerParams.row
                                    : null);
                        })
                    }
                }, null)
            };


            /**
             * Открыть ajax-форму
             */
            $scope.openForm = function (fetchCallback, event) {

                var renderViewClaimTableCb = function () {
                    ClaimService.renderClaimTable();
                };

                // Включаем прелоадер
                DataService.set('isLoading', 'isLoading');

                AjaxService.fetch(
                    // Если кнопка добавить
                    (event && event.target.dataset.mode == 'add')
                        // То новая запись
                        ? null
                        : DataService.get('selectedId')
                    )
                    // Первоначальное получение всех данных с сервера
                    .then(function (data) {

                        var result = data.result;

                        // Сохраняем клиента, который был выбран изначально
                        result.model.$$initialClientId = result.model.client_id;

                        // Устанавливаем данные модели заказа
                        DataService.set('model', result.model);

                        // Устанавливаем флаг, новый ли это заказ
                        DataService.set('isNewRecord', result.isNewRecord);

                        // Устанавливаем также данные, необходимые только для отображения
                        DataService.set('displayData', result.displayData, renderViewClaimTableCb);
                    })
                    // Случай программного построения формы (добавление дополнительных позиций из данных каталога)
                    .then(function () {
                        if (angular.isFunction(fetchCallback)) {
                            fetchCallback.call(this);
                        }
                    })
                    .catch(function (error) {
                        alert(error);
                    })
                    .finally(function () {
                        // Убираем прелоадер
                        DataService.set('isLoading', false);

                        // Подгрузка транзакций при открытии формы (если заполнены номер и дата платёжного документа)
                        $scope.fetchTransactions();
                    });

                // Показываем сразу
                Form.show();
            };


            /**
             * Сохранить данные формы
             */
            $scope.info = function () {
                var promise = AjaxService.info(DataService.get('model'));
                promise
                    .then(function (data) {

                        var result = data.result;

                        if (result.isValid) {
                            // Если производится сохранение - сбрасываем значение флага "Новая запись"
                            DataService.set('isNewRecord', false, Form.hide.bind(Form));

                            // Если при создании формы использовались данные (страница загружена в режиме выбора, то закрываем окно)
                            if (!angular.isUndefined($window.catalogParams)) {

                                // Если также были использованы данные страницы "Запросы от менеджеров" (есть родитель родителя)
                                if ($window.opener.opener && !angular.isUndefined($window.opener.opener.managerParams)) {

                                    // Выполняем callback на странице "Запросы от менеджеров"
                                    $window.opener.opener.managerParams.callback.call(
                                        $window.opener.opener.managerParams.context
                                    );

                                    // То закрываем ещё и страницу каталога
                                    $window.opener.close();
                                }

                                $window.close();
                            } else {
                                GridController.filter.dataTable.grid.update();
                            }

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
                    });
            };


            /**
             * Открытие формы выбора заяки
             */
            $scope.openClaimForm = function () {

                if (!DataService.get('model').files['5'].length) {
                    alert('Необходимо загрузить файл "Подтверждение заказа"!');
                    return;
                }

                ClaimService.openSelectionForm();
            };


            /**
             * Нажатие кнопки "Добавить позицию"
             */
            $scope.startCatalogSelection = function () {
                window.open("/total-price/catalog" + '?' + $.param({mode: 'select'}));
            };


            /**
             * Добавить выбранную позицию в список
             * @param catalogRow - Строка с данными грида со страницы каталога
             * @param managerRow - строка с данными грида со страницы заказы от менеджера (опционально)
             */
            $scope.addPosition = function (catalogRow, managerRow) {

                var orderModel = DataService.get('model');
                var positionsData = DataService.get('displayData').positions;

                // Если данных по новой позиции нету среди локальных (проверяем по id каталога, то необходимо добавить их)
                if (!(catalogRow.id in positionsData)) {
                    positionsData[catalogRow.id] = {
                        price: catalogRow.price,
                        file_type: catalogRow.file_type,
                        // В качестве данных по товару, просто отдадим строку из грида каталога (там есть необходимые данные)
                        info: catalogRow
                    }
                }

                var newPositionDefault = {
                    // null так как строка ещё не сохранено в БД
                    id: null,
                    // Id заказа-родителя из текущей модели
                    order_id: orderModel.id,
                    // Ссылка на каталог (total_price.id)
                    catalog_id: catalogRow.id,
                    // Целевой тип, по-умолчанию "На склад"
                    target_type: '0',
                    // Флаг, что строка была добавлена в существующий заказ (если происходит добавление - нет, иначе - да)
                    is_addition: DataService.get('isNewRecord')
                        ? 0
                        : 1,
                    // TODO не делать так, а передавать все необходимые константы на JS, когда будет время (нет),
                    client_id: 0,
                    item_id: catalogRow.item_id,
                    price: catalogRow.price
                };


                // Если имеются данные по позиции с страницы "Заказы от менеджеров"
                if (managerRow) {
                    // Применяем их для строки позиции
                    newPositionDefault = $.extend(newPositionDefault , {
                        // Тип "Клиенту"
                        target_type: '1',
                        client_id: managerRow.client_id,
                        date_prepayment: moment(managerRow.date_prepayment * 1000).format('YYYY-MM-DD'),
                        sum_prepayment: managerRow.sum_prepayment,
                        date_delivery: moment(managerRow.date_delivery * 1000).format('YYYY-MM-DD'),
                        // Связь с строкой total_price_managers_orders
                        mo_id: managerRow.id
                    });
                }

                // Добавление новой позиции, выбранной в новом окне
                orderModel.positions.push(newPositionDefault);

                DataService.set('model.positions', orderModel.positions);
            };


            /**
             * Удаление позиции из заказа
             */
            $scope.removePosition = function (position) {

                NotifyService.warning('', 'Сохраните форму для принятия изменений');

                var positions = DataService.get('model').positions;
                positions.splice(positions.indexOf(position), 1);
            };


            /**
             * Проверка на видимость колонки
             * @param title
             * @return {*}
             */
            $scope.checkColumnIsEnabled = function (title) {
                return _.first(_.filter(DataService.get('params').depotConfig, {title: title})).enabled;
            };


            /**
             * Необходимо осуществлять обрезку тегов, которые могут быть в строке
             * @param dirtyText
             */
            $scope.getText = function (dirtyText) {
                var div = document.createElement("div");
                div.innerHTML = dirtyText;
                return div.innerText;
            };


            /**
             * Вызов сервиса FieldsHider для записи обновлённых данных в localStorage при изменении видимости колонки
             */
            $scope.updateFieldsHiderData = function () {
                FieldsHiderService.update();
            };


            /**
             * Установка суммы заказа
             */
            $scope.setOrderSum = function () {
                var orderSum = 0,
                    model = DataService.get('model'),
                    displayData = DataService.get('displayData');

                // Если статус заказа "Создание" или "В пути"
                if (parseInt(model.status) === 0 || parseInt(model.status) === 1 || parseInt(model.status) === 2) {
                    // Считаем сумму заказа по входящим в него позициям из дополнительных данных
                    orderSum = model.positions.reduce(function (sum, current) {
                        return sum + parseFloat(current.price);
                    }, 0);

                    DataService.set('model.sum', orderSum);
                }
            };


            /**
             * Отправка запроса на сервер для поиска заявок
             */
            $scope.fetchTransactions = function ($event) {

                if ($event) {
                    $event.preventDefault();
                }

                var number = DataService.get('model').payment_document_number;
                var date = DataService.get('model').payment_document_date;

                if (number && date) {
                    AjaxService.fetchTransactions(number, date)
                        .then(function (data) {
                            if (data.response.ids.length) {
                                DataService.set('displayData.transactions', data.response.displayData);
                                DataService.set('model.transactions', data.response.ids);
                            } else {
                                // Показываем сообщение, если событие было вызвано нажатием кнопки
                                if ($event) {
                                    NotifyService.warning('', 'Транзакций по заданным параметрам не найдено');
                                }
                            }
                        });
                }
            };


            /**
             * Возвращает щаблон файла Подтверждение заказа
             */
            $scope.getOrderConfirmTemplate = function ($event)
            {
                if ($event) {
                    $event.preventDefault();
                }
                window.open('/total-price/orders/get-order-confirm-template' + '?' + $.param({id: DataService.get('model').id }));
            };


            /**
             * Вычисляет и возвращает сумму по транзакциям
             */
            $scope.getTransactionsSum = function ()
            {
                if (!DataService.get('model')) {
                    return false;
                }

                var sum = 0;
                var transactionsData = DataService.get('displayData').transactions;

                if (Object.keys(transactionsData).length) {
                    sum = Object.keys(transactionsData).reduce(function (sum, key) {
                        return sum + parseFloat(transactionsData[key].summ);
                    }, 0);
                }
                return sum;
            };


            /**
             * Переход на страницу кассы с выбранными транзакциями
             */
            $scope.openTransactionsPage = function () {
                var transactionPage = $window.open('/cash/account');
                transactionPage.totalPriceBoundTransactionsIds = DataService.get('model').transactions;
            };


            /**
             * Проверка на наличие позиций каталога с опцией разрешительного документа "не сделан на данный момент"
             */
            $scope.checkForNonExistentCatalogDocuments = function () {

                if (!DataService.get('displayData')) {
                    return false;
                }

                var positions = DataService.get('displayData').positions;

                if (Object.keys(positions).length) {
                    return Object.keys(positions).some(function (key) {
                        return positions[key].file_type === '4';
                    })
                } else {
                    return false;
                }
            };


            /**
             * Отслеживаем изменение содержимого заказа (удаление/добавление позиций)
             * @return void
             */
            $scope.$watchCollection('dataService.model.positions', function (newValue, oldValue) {
                if (newValue) {
                    $scope.setOrderSum();
                }             
            });

            /**
             * Обработка изменения цены
             * @returns {undefined}
             */
            $scope.changePrice = function (position) {
                position.price_from_catalog = 0;
                $scope.setOrderSum();
            };

            $scope.init();
        }]);
});