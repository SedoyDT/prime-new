/**
 * для работы с формой total price
 * @class
 * @type {TotalPriceOrder}
 */
var TotalPriceOrder = (function() {
    var defaultOptions = {
        orderFormButton: null,
        totalPriceOrderForm: null,
        claim: null,
        clientSelect: null,
    };

    /**
     * обработка reject-а promise
     * @param reason
     */
    function promiseRejectHandler(reason)
    {
        alert(reason instanceof Error ? reason.message : reason);
    }

    /**
     *
     * @param options
     * @constructor
     */
    function TotalPriceOrder(options)
    {
        var self = this;
        this.options = $.extend(defaultOptions, options);

        this.formInitialized = false;

        // метки для предотвращения цикличных вызовов, возможно нужны не все, но созданы на всякий случай
        this.isAddingInProcess = false;
        this.isRemovingInProcess = false;
        this.isChangeAmountInProcess = false;

        /**
         * объект для отслеживания статуса поля "Скидка" у товаров
         * @type {{}}
         */
        this.priceFromClaimMap = {};

        /**
         * объект для хранения кол-ва товара по номеру этого товара
         * @type {{}}
         */
        this.amountMap = {};

        // кнопка открытия формы заказа
        this.options.orderFormButton.on('click', function(event) {
            if (self.options.totalPriceOrderForm.scope().DataService.get('isNewRecord')) {
                self.filterItemsInTotalPriceCatalog()
                    .then(function(products) {
                        self.openOrderForm(products, event);
                        self.setupAngularCallbacks();
                    }, self.addPositionRejection)
                    .catch(promiseRejectHandler);
            } else {
                self.openOrderForm([], event);
            }
        });

        // обработка изменения клиента
        this.options.clientSelect.on('change', function () {
            self.options.totalPriceOrderForm.scope().DataService.set('model.client_id', $(this).val());
            self.options.totalPriceOrderForm.scope().DataService.set('model.client', $(this).find('option:selected').text());
        });

        // нажатия на галочку "Скидка"
        $('#table_products_tbody').on('click', '.js-total-price-order_action', function () {
            var number = $(this).attr('number') * 1;
            self.togglePriceFromClaim(number);
        });

        // заполнение связей между ценами товаров и позиций заказа
        $('.js-total-price-order_action').each(function () {
            self.priceFromClaimMap[$(this).attr('number') * 1] = $(this).prop('checked');
        });

        // заполнение карты соответсвий между номерами товаров и их кол-ом
        $('#table_products_tbody input[fieldtype="amount"]').each(function () {
            var amount = $(this).val() * 1;
            self.amountMap[$(this).closest('tr').attr('number') * 1] = (amount <= 0 ? 1 : amount);
        });
    }

    /**
     * фильтрация товаров по существованию в каталоге
     * @param itemList
     * @returns {Promise<unknown>}
     */
    TotalPriceOrder.prototype.filterItemsInTotalPriceCatalog = function(itemList)
    {
        var products = [];
        if (!itemList || typeof itemList !== 'object' || !(itemList instanceof Array)) {
            this.options.claim.getProductRows().each(function() {
                var id = $(this).attr('itemid') * 1;
                var number = $(this).attr('number') * 1;
                var amount = Math.max(1, $(this).find('input[fieldtype="amount"]').val() * 1);
                var priceFromClaim = $(this).find('.js-total-price-order_action').prop('checked') * 1;

                products.push({
                    item_id: id,
                    number: number,
                    amount: amount,
                    price_from_claim: priceFromClaim
                });
            });
        } else {
            itemList.forEach(function(item) {
                products.push({
                    item_id: item.id,
                    number: item.number || 0,
                    amount: 1,
                    price_from_claim: 0
                });
            })
        }

        return new Promise(function(resolve, reject) {
            $.ajax({
                url: '/total-price/catalog/service',
                data: {
                    'command': 'getCatalogListByItem',
                    'params': {
                        'item_id': products.map(function (item) {
                            return item.item_id;
                        })
                    }
                },
                dataType: 'json',
                type: 'POST'
            }).done(function(data) {
                if (data.success === false) {
                    reject(data.error);
                } else {
                    var newCatalogList = [];
                    // создаётся новый каталог, чтобы делать копии записей из каталога, в случае дубликатов товаров в заявке
                    for (var i = 0; i < data.catalogList.length; i++) {
                        newCatalogList = newCatalogList.concat(...products.filter(function (item) {
                            return item.item_id == data.catalogList[i].item_id;
                        }).map(function (item) {
                            var catalogCopy = $.extend(true, {}, data.catalogList[i]);
                            catalogCopy.number = item.number;
                            catalogCopy.amount = item.amount;
                            catalogCopy.price_from_claim = item.price_from_claim;
                            return catalogCopy;
                        }));
                    }

                    // удаление записей из списка товаров для фильтрации, чтобы определить существование товаров, которых нет в каталоге
                    newCatalogList.forEach(function (catalogItem) {
                        var index = products.findIndex(function (item) {
                            return item.number == catalogItem.number;
                        });
                        products.splice(index, 1);
                    });

                    // если после цикла у нас остались элементы в списке products, это значит что есть товары, отсутствующие в каталоге
                    if (Object.keys(products).length > 0) {
                        reject(products);
                    } else {
                        resolve(newCatalogList);
                    }
                }
            }).fail(function() {
                reject('Неизвестная ошибка');
            });
        });
    };

    /**
     * открытие формы total price
     * @param products
     * @param event
     */
    TotalPriceOrder.prototype.openOrderForm = function(products, event)
    {
        var self = this;
        this.options.totalPriceOrderForm.scope().openForm(function()
        {
            /** @var ClaimInFormController controller */
            var controller = this;
            // первое открытие формы, нужно добавить все товары из заявки в заказ, которых ещё нет в заказе
            if (controller.DataService.get('isNewRecord')) {
                const productCount = products.length;

                products.forEach(function(item, iteratee) {
                    var amount = item.amount - controller.DataService.get('model').positions.filter(function (position) {
                        return item.number == position.claim_product_number;
                    }).length;
                    // добавляем столько позиций в заказ, сколько у нас кол-во товара в заявке
                    const isLastProduct = iteratee + 1 === productCount;
                    for (var k = 0; k < amount; k++) {
                        const isLastItem = k + 1 === amount;
                        controller.addPosition(item, !isLastProduct || !isLastItem);
                    }
                    self.amountMap[item.number] = item.amount;
                    self.setPriceFromClaim(item.number, item.price_from_claim);
                });
            }

            self.formInitialized = true;
        }, event);
    };

    /**
     * настройка колбеков angular формы заказа
     */
    TotalPriceOrder.prototype.setupAngularCallbacks = function()
    {
        var self = this;
        var $scope = this.options.totalPriceOrderForm.scope();

        // колбэк добавления товара в форме заказа
        $scope.setExternalAddPositionCallback(function(catalogRow) {
            if (self.isChangeAmountInProcess) {
                return ;
            }
            var modelPositions = this.DataService.get('model').positions;
            modelPositions[modelPositions.length - 1].claim_product_number = self.addPositionToClaim(catalogRow);
        });

        // колбэк удаления товара в форме заказа
        $scope.setExternalRemovePositionCallback(function(position) {
            if (!position.claim_product_number) {
                return ;
            }
            self.removeItemFromClaim(position.claim_product_number);
        });
    };

    /**
     * добавление позиции в заявку, а затем попытка добавления товара в заказ
     * вызывается через двойное нажатие на товар в форме склада
     * @param item
     */
    TotalPriceOrder.prototype.addPosition = function(item)
    {
        // если в заказ товар добавлять не нужно, тогда просто добавляем товар в заявку
        if (this.isAddingInProcess || !this.isAngularReady()
            || this.options.totalPriceOrderForm.scope().DataService.get('isNewRecord')
        ) {
            this.options.claim.addProduct(item);
            return ;
        }

        var self = this;

        this.filterItemsInTotalPriceCatalog([item])
            .then(function (products) {
                var row = self.options.claim.addProduct(item);
                products[0].number = $(row).attr('number') * 1;
                self.options.totalPriceOrderForm.scope().addPosition(products[0]);
            }, this.addPositionRejection)
            .catch(promiseRejectHandler);
    };

    /**
     * удаление позиции из заказа
     * @param number
     */
    TotalPriceOrder.prototype.removeItemFromOrder = function(number)
    {
        if (this.isRemovingInProcess || !this.isAngularReady()) {
            return ;
        }

        this.isRemovingInProcess = true;

        var self = this;
        var positions = this.getItemInOrderByNumber(number);
        self.options.totalPriceOrderForm.scope().$apply(function () {
            positions.forEach(function(item) {
                self.options.totalPriceOrderForm.scope().removePosition(item);
            });
        });

        this.isRemovingInProcess = false;
    };

    /**
     * добавление позиции в заявку из заказа
     * @param item
     */
    TotalPriceOrder.prototype.addPositionToClaim = function(item)
    {
        var self = this, number = null;

        this.isAddingInProcess = true;

        $.ajax({
            url: '/claim/in/get-item-depot-row',
            dataType: 'json',
            data: {
                item_id: item.item_id
            },
            async: false
        }).done(function(data) {
            if (data.success && data.result.length > 0) {
                var newRow = self.options.claim.addProduct(data.result[0]);
                self.isAddingInProcess = false;
                number = $(newRow).attr('number');
            } else {
                alert('Произошла ошибка: ' + data.error);
            }
        }).fail(function(reason) {
            alert('Произошла неизвестная ошибка');
        });

        return number;
    };

    /**
     * удаление товара из заявки
     * @param number
     */
    TotalPriceOrder.prototype.removeItemFromClaim = function(number)
    {
        if (this.isRemovingInProcess || !number || this.isChangeAmountInProcess) {
            return ;
        }

        this.isRemovingInProcess = true;
        this.amountMap[number]--;
        if (this.amountMap[number] >= 1) {
            var input = this.options.claim.getProductRows().filter('[number=' + number + ']').find('input[fieldtype="amount"]');
            if (input.length) {
                input.val(this.amountMap[number]).trigger('input');
            }
        } else {
            var deleteButton = this.options.claim.getProductRows().filter('[number=' + number + ']');
            if (deleteButton.length && confirm('При удалении позиции из заказа, удалить ее из заявки?')) {
                this.options.claim.deleteProduct(deleteButton.find('.delPImg'), true);
            }
        }

        this.isRemovingInProcess = false;
    };

    /**
     * сохранение данных формы
     * если данные формы не были инициализированы, то сохранения не будет
     */
    TotalPriceOrder.prototype.info = function()
    {
        var form = $('#' + this.options.claim.formId);
        var input = form.find('[name="totalPriceOrder"]');
        var data = _.escape(JSON.stringify(this.options.totalPriceOrderForm.scope().DataService.get('model')));
        if (input.length === 0) {
            form.append('<input type="hidden" name="totalPriceOrder" value="' + data + '"/>');
        } else {
            input.val(data);
        }
    };

    /**
     * проверка данных формы
     * @param {boolean} changeStatus - изменение статуса
     * @param isManagerStatus
     * @returns {{result: boolean, errors: []}|{result: *, errors: *}}
     */
    TotalPriceOrder.prototype.isValid = function(changeStatus, isManagerStatus)
    {
        // если у заказа нет id и форма не открывалась, то не запукаем валидацию
        if (!this.options.totalPriceOrderForm.scope().DataService.get('params').selectedId && !this.formInitialized
            // заказ не подтверждён
            || this.options.totalPriceOrderForm.scope().DataService.get('isNewRecord')
        ) {
            return {result: true, errors: []};
        }

        var errors = [];
        $.ajax({
            url: '/total-price/orders/service/',
            data: {
                command: 'validate',
                params: this.options.totalPriceOrderForm.scope().DataService.get('model')
            },
            dataType: 'json',
            type: 'POST',
            async: false
        }).done(function(data) {
            if (data.success && !data.result.isValid) {
                Object.keys(data.result.errors).forEach(function(field) {
                    errors.push('Заказ total price: ' + field + ' - ' + data.result.errors[field] + "\n");
                });
            } else if (!data.success) {
                alert('Произошла ошибка: ' + data.error);
            }
        }).fail(function(reason) {
            console.error(reason);
            alert('Ошибка при проверке заказа total price');
        });

        var itemList = {};
        this.options.totalPriceOrderForm.scope().DataService.get('model').positions.forEach(function (position) {
            if (position.price_from_claim == 0) {
                if (!(position.item_id in itemList)) {
                    itemList[position.item_id] = position.price;
                } else if (position.item_id in itemList && Math.abs(itemList[position.item_id] - position.price) > 0.00001) {
                    errors.push('Заказ total price: товар ' + position.item_id + ' добавлен в заказ в множественном кол-ве и должен обновить цену в каталоге, но имеет несколько вариантов цен. Возможно нужно проставить скидку.');
                }
            }
        });

        if (changeStatus) {
            if (this.options.totalPriceOrderForm.scope().DataService.get('model').files[5].length === 0) {
                errors.push('Заказ total price: загрузите подтверждение заказа');
            }

            if (isManagerStatus && this.options.totalPriceOrderForm.scope().DataService.get('model').files[1].length === 0) {
                errors.push('Заказ total price: загрузите китайскую экспортную декларацию');
            }

            if (isManagerStatus && this.options.totalPriceOrderForm.scope().DataService.get('model').files[3].length === 0) {
                errors.push('Заказ total price: загрузите таможенная декларация');
            }
        }

        return {result: errors.length === 0, errors: errors};
    };

    /**
     * обработчик изменения кол-ва
     * @param number
     * @param amount
     */
    TotalPriceOrder.prototype.changeAmount = function(number, amount)
    {
        if (this.isChangeAmountInProcess || !this.isAngularReady()
            || !this.formInitialized && this.options.totalPriceOrderForm.scope().DataService.get('isNewRecord')
        ) {
            return ;
        }

        var self = this;
        var $scope = this.options.totalPriceOrderForm.scope();
        var prevAmount = this.amountMap[number];

        if (!prevAmount) {
            this.amountMap[number] = 1;
        } else {
            // увеличение кол-ва товара в заявке -> добавлем товар в заказ
            if (prevAmount < amount) {
                var item = this.getItemInOrderByNumber(number)[0];
                var catalogRow = Object.assign($scope.DataService.get('displayData').positions[item.catalog_id].info, {
                    item_id: item.item_id,
                    id: item.catalog_id,
                    number: number,
                    fyle_type: $scope.DataService.get('displayData').positions[item.catalog_id].fyle_type,
                    price: item.price,
                    price_from_claim: this.priceFromClaimMap[number] || 0
                });

                this.isChangeAmountInProcess = true;
                for (var i = 0; i < amount - prevAmount; i++) {
                    $scope.addPosition(catalogRow);
                    this.amountMap[number]++;
                }
                this.isChangeAmountInProcess = false;
            }
            // уменьшение кол-ва товара в заявке -> удаление товара в заказе
            else if (prevAmount > amount) {
                var positions = this.getItemInOrderByNumber(number);
                if (positions.length > 1) {
                    this.isChangeAmountInProcess = true;
                    $scope.$apply(function () {
                        for (var j = 0; j < Math.max(prevAmount - amount, 1); j++) {
                            $scope.removePosition(positions[j]);
                            self.amountMap[number]--;
                        }
                    });
                    this.isChangeAmountInProcess = false;
                }
            }
        }
    };

    /**
     * получение позиции/позиций в заказе по номеру товара в заявке
     * @param number
     * @returns {Promise<never>|Promise<unknown>|*}
     */
    TotalPriceOrder.prototype.getItemInOrderByNumber = function(number)
    {
        if (!this.isAngularReady()) {
            return [];
        }

        return this.options.totalPriceOrderForm.scope().DataService.get('model').positions.filter(function(position) {
            return position.claim_product_number == number;
        });
    };

    /**
     * добавление флага для отслеживания связанности цен в заявке и в заказе
     * @param number
     */
    TotalPriceOrder.prototype.addPriceFromClaim = function(number)
    {
        if (number * 1 in this.priceFromClaimMap) {
            return;
        }

        this.priceFromClaimMap[number * 1] = 0;
    };

    /**
     * установка значения флага скидка
     * @param number
     * @param value
     */
    TotalPriceOrder.prototype.setPriceFromClaim = function(number, value)
    {
        this.priceFromClaimMap[number] = value;

        var self = this;
        this.getItemInOrderByNumber(number).forEach(function (item) {
            item.price_from_claim = self.priceFromClaimMap[number] ? 1 : 0;
        });
    };

    /**
     * изменение галки "скидка"
     * @param number
     */
    TotalPriceOrder.prototype.togglePriceFromClaim = function(number)
    {
        this.setPriceFromClaim(number, !this.priceFromClaimMap[number])
    };

    /**
     * проверка готовности angular приложения
     * @return {boolean}
     */
    TotalPriceOrder.prototype.isAngularReady = function()
    {
        return this.options.totalPriceOrderForm.scope() && this.options.totalPriceOrderForm.scope().DataService
            && this.options.totalPriceOrderForm.scope().DataService.initialized;
    };

    /**
     * отказ добавления товаров в заказ
     * @param products
     */
    TotalPriceOrder.prototype.addPositionRejection = function(products)
    {
        var productIdList = new Set(products.map(function(item) { return item.item_id }));
        alert('Внимание! Создать заказ TotalPrice невозможно, так как товары с id: ' + Array.from(productIdList.values()).join(', ') + ' не найдены в каталоге TotalPrice');
    };

    return TotalPriceOrder;
})();
