/**
 * Абстрактный класс
 * Основные методы + фабрика
 */
var Libdoc_ClaimContracts_Abstract = (function ()
{
    /**
     * Конструктор
     * @param {number} id
     * @param {number} ticketId
     * @param {object} access
     * @param {number} direction
     */
    function Libdoc_ClaimContracts_Abstract(id, ticketId, access, direction) {
        _tools.requireClass('Libdoc_ClaimContracts_Sections_Default');
        _tools.requireClass('Libdoc_ClaimContracts_Sections_Claim');
        _tools.requireClass('Libdoc_ClaimContracts_Sections_Ticket');
        _tools.requireClass('Libdoc_ClaimContracts_Sections_Executant');

        if (id === void 0) {
            id = 0;
        }
        //id типа
        this._type = 0;
        //значения полей
        this._values = {};
        //поля
        this._fields = {};
        //флаг загрузки
        this._isLoad = false;
        //флаг изменения
        this._isChanged = id ? false : true;
        //контроллеры секций
        this._controllers = {
            'claim': new Libdoc_ClaimContracts_Sections_Claim(this, 'claim'),
            'ticket': new Libdoc_ClaimContracts_Sections_Ticket(this, 'ticket'),
            'executant': new Libdoc_ClaimContracts_Sections_Executant(this, 'executant')
        };

        //элементы управления
        this._controls = {};
        // отображене загрузчика
        this._id = id;

        // направление движения товара
        // 1 - от нас, 2 - к нам
        this._direction = direction;

        /**
         * @property {Number} _ticketId id тикета(запроса в саппорте)
         */
        this._ticketId = ticketId;
        //права
        /**
         * @property {Object} _access права доступа
         */
        this._access = access;
        this.init();
        // Скрыть загрузчика
        $('#section-loader').hide('slow');
    }
    /**
     * инициализация
     */
    Libdoc_ClaimContracts_Abstract.prototype.init = function ()
    {
        this.getData();
        this.bind();
        this.initControls();
    };
    /**
     * Получить JQuery объект поля
     * @param {string} section - секция
     * @param {string} name - поле
     * @returns {JQuery}
     */
    Libdoc_ClaimContracts_Abstract.prototype.getField = function (section, name)
    {
        if (!this._fields[section] || !this._fields[section][name]) {
            return;
        }
        var field = this._fields[section][name];
        var newField = $('<span/>');
        newField.addClass(field.type + (field.required ? ' rq' : ''));
        newField.attr('data-section', section);
        newField.attr('data-field', name);
        if (field.editable) {
            newField.attr('contenteditable', true);
        }
        return newField;
    };
    /**
     * Вешаем события
     */
    Libdoc_ClaimContracts_Abstract.prototype.bind = function ()
    {
        var _self = this;
        $('body').on('focusout', '[data-field]', function ()
        {
            var field = $(this).data();
            _self._getController(field.section).input($(this));
        });
        
        $('#save').click(function ()
        {
            _self.save();
        });
    };
    /**
     * Получить данные
     * @param {string} section - секция
     */
    Libdoc_ClaimContracts_Abstract.prototype.getData = function (section)
    {
        if (section === void 0) {
            section = '';
        }
        var _self = this;
        $.ajax('/libdoc/claim-contracts/get-data/', {
            dataType: 'json',
            data: {id: _self._id, type: _self._type, section: section, ticket_id: _self._ticketId},
            async: false,
            success: function (data)
            {
                if (section) {
                    _self._values[section] = data['data'];
                } else {
                    _self._values = data['values'];
                    _self._fields = data['fields'];
                }
                _self.updateSections(section);
                _self._isLoad = true;
            }
        });
    };
    /**
     * Обновление секций
     * @param {string} section
     */
    Libdoc_ClaimContracts_Abstract.prototype.updateSections = function (section)
    {
        if (section === void 0) {
            section = '';
        }
        if (section) {            
            this._getController(section).update();
        } else {
            //иначе обновляем все
            for (var i in this._values) {
                this._getController(i).update();
            }
        }

        if (this._values && this._values.configuration && +this._values.configuration.isDivision) {
            document.body.classList.add('conf__is-division');
        } else {
            document.body.classList.remove('conf__is-division');
        }
    };
    /**
     * Сохранение
     * @param {boolean} verbose показывать сообщение о удачном сохранении или нет
     * @return {Boolean} сохранение удалось или нет
     */
    Libdoc_ClaimContracts_Abstract.prototype.info = function (verbose)
    {
        if (!this._access['edit']) {
            return true;
        }

        verbose = (typeof verbose === 'undefined' ? true : verbose);
        var _self = this;
        var result = false;

        if (!this.checkFields()) {
            return false;
        };

        if (this._controllers.ticket.getField('rate').text() <= 0) {
            alert('Заполните поле "Ставка" через поле "Сумма" в тикете саппорта');
            return false;
        }

        var saveData = {};
        for (var i in this._fields) {
            saveData[i] = this._getController(i).save();
        }
        $.ajax({
            url: '/libdoc/claim-contracts/save/', 
            dataType: 'json',
            data: {id: _self._id, ticket_id: _self._ticketId, data: saveData},
            async: false,
            type: 'POST'
        }).done(function (data) {
            var success = parseInt(data.success);
            if (!isNaN(success) && _self._id) {
                if (verbose) {
                    alert('Успешно сохранено');
                }
                _self._isChanged = false;
                result = true;
            } else if (!isNaN(success) && !_self._id) {
                if (verbose) {
                    alert('Договор создан');
                }
                if (window.opener != null  && window.opener.financeSupport) {
                    window.opener.financeSupport.filter.grid.update();
                }
                result = true;
                _self._id = success;
            } else {
                alert('Ошибка сохранения');
            }
        }).fail(function(){
            alert('Ошибка сохранения');
        });

        return result;
    };

    /**
     * Метод для запуска сохранения pdf файла
     * @param {number} claimId
     * @param {number} ticketId
     * @param {function} callback
     * @returns {undefined}
     */
    Libdoc_ClaimContracts_Abstract.prototype.savePdf = function (claimId, ticketId, callback)
    {
        var siteName = document.location.origin;
        /**
         * Добавляем http://SITE_NAME к src,href у элементов img, link
         * это необходимо для того чтобы phantomjs мог загрузить эти ресурсы при создании
         * pdf файла
         */
        $(document).find('img[src]').each(function(a)
        {
           var src = $(this).attr('src');
           $(this).attr('src', siteName + src);
        });

        $(document).find('link[rel="stylesheet"]').each(function(a)
        {
            var href = $(this).attr('href');
            $(this).attr('href', siteName + href);
        });

        // Сохраняем всю разметку страницы
        var markup = document.documentElement.outerHTML;

        //Блокировка экрана, вывод окна загрузки на время создания pdf файла
        $('#transition-overlay').transition('show');

        //Ставим задержку 1,5 сек для того чтобы transition успел выполниться
        setTimeout(function()
        {
            // Флаг успеха создания pdf файла
            var success = false;
            // Запрос на создание pdf файла
            $.ajax({
                type: 'POST',
                async: false,
                url: '/libdoc/claim-contracts/savepdf',
                data: {
                    data: markup,
                    claim_id: claimId,
                    ticket_id: ticketId
                },
                success: function(data)
                {
                    success = true;
                },
                error: function()
                {
                    success = false;
                    alert('Ошибка при сохранении pdf файла');
                },
                beforeSend: function()
                {
                },
                complete: function()
                {
                    // Восстанавливаем старые значения src и href
                    $(document).find('img[src]').each(function(a)
                    {
                        var src = $(this).attr('src');
                        $(this).attr('src', src.substring(siteName.length));
                    });

                    $(document).find('link[rel="stylesheet"]').each(function(a)
                    {
                        var href = $(this).attr('href');
                        $(this).attr('href', href.substring(siteName.length));
                    });

                    //Убираем окно блокировки
                    $('#transition-overlay').transition('hide');
                }
            });

            // Если файл не создан выходим
            if(!success) {
                return;
            }

            callback.call(this, claimId, ticketId);

        }, 1500);
    };

    /**
     * Получить контроллер секции
     * @param {string} section
     * @returns {Libdoc_ClaimContracts_Sections_Default}
     */
    Libdoc_ClaimContracts_Abstract.prototype._getController = function (section)
    {
        if (!this._controllers[section]) {
            this._controllers[section] = new Libdoc_ClaimContracts_Sections_Default(this, section);
        }
        return this._controllers[section];
    };
    /**
     * Фабрика
     * @param {string} typeId - Тип
     * @param {number} id - id договора
     * @param {number} ticketId - id тикета
     * @param {object} access - права
     * @param {number} direction - договор на доставку нам или от нас
     * @returns {Libdoc_ClaimContracts_Abstract}
     */
    Libdoc_ClaimContracts_Abstract.factory = function (typeId, id, ticketId, access, direction)
    {
        var requireClass = 'Libdoc_ClaimContracts_ClaimContract' + typeId;
        if (!_tools.requireClass(requireClass)) {
            return alert('Error require class "' + requireClass + '"');
        }
        return new window[requireClass](id, ticketId, access, direction);
    };
    /**
     * Получить значения секции или значение по умолчанию
     * @param {string} section - секция
     * @param {mixed} defaultValue - значение по умолчанию
     * @returns {mixed}
     */
    Libdoc_ClaimContracts_Abstract.prototype.getValues = function (section, defaultValue)
    {
        if (defaultValue === void 0) {
            defaultValue = {};
        }
        if (!this._values[section]) {
            this._values[section] = defaultValue;
        }
        return this._values[section];
    };
    /**
     * Получить поля секции
     * @param {string} section - секция
     * @returns {mixed}
     */
    Libdoc_ClaimContracts_Abstract.prototype._getFields = function (section)
    {
        if (!this._fields[section]) {
            this._fields[section] = {};
        }
        return this._fields[section];
    };
    /**
     * Проверить заполнение полей
     * @returns {boolean}
     */
    Libdoc_ClaimContracts_Abstract.prototype.checkFields = function ()
    {
        var fields = $('.rq:empty').filter(':visible');
        if (!fields.length) {
            return true;
        }
        $(document).scrollTop($(fields[0]).offset().top - 10 - $('section.controlPanel', 0).height());
        $(fields[0]).focus();
        alert('Не заполнены обязательные поля!');
        return false;
    };
    /**
     * Установить значения секции и обновить поля
     * @param {string} section - секция
     * @param {mixed} data - данные
     */
    Libdoc_ClaimContracts_Abstract.prototype.setValues = function (section, data)
    {
        this._values[section] = data;
        this.updateSections(section);
    };
    /**
     * Запуск печати
     */
    Libdoc_ClaimContracts_Abstract.prototype.print = function ()
    {
        if (this._isChanged) {
            return alert('Сохраните изменения перед печатью');
        }
        window.print();
    };
    /**
     * Получить обработчик элемента управления
     * @param {string} name - имя элемента
     * @returns {Libdoc_ClaimContracts_Controls_Abstract}
     */
    Libdoc_ClaimContracts_Abstract.prototype.getControl = function (name)
    {
        return this._controls[name];
    };
    /**
     * Получить строковый тип документа
     */
    Libdoc_ClaimContracts_Abstract.prototype.getTypeName = function ()
    {
        return 'claimcontract' + this._type;
    };

    /**
     * Получить актуальные данные
     * @param {object} updateList
     * @returns {object}
     */
    Libdoc_ClaimContracts_Abstract.prototype._getActualData = function (updateList)
    {
        var result = '';
        $.ajax({
            url: '/libdoc/ajax_claim-contracts_type' + this._type + '/get-actual-data',
            dataType: 'json',
            data: {updateList: updateList, id: this._id},
            async: false,
            success: function (data)
            {
                result = data;
            }
        });
        return result;
    };
    
    return Libdoc_ClaimContracts_Abstract;
}());
