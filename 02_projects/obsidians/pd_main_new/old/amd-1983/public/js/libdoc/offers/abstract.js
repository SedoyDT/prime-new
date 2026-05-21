/**
 * Абстрактный класс
 * Основные методы + фабрика
 */
var Libdoc_Offers_Abstract = (function ()
{
    /**
     * Конструктор
     * @constructor
     * @param {number} id
     */
    function Libdoc_Offers_Abstract(id, access, leadId, leadProjectId) {
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
        this._controllers = {};
        //элементы управления
        this._controls = {};
        // отображене загрузчика
        this._id = id;
        //права
        this._access = access;

        /**
         * Данные секций конфигурации
         * @type {object}
         */
        this.sectionData = {};

        this.leadId = leadId;
        this.leadProjectId = leadProjectId;
        _tools.requireClass('Libdoc_Offers_Sections_Default');
        this.init();
        // Скрыть загрузчика
        $('#section-loader').hide('slow');
    }
    /**
     * инициализация
     */
    Libdoc_Offers_Abstract.prototype.init = function ()
    {
        this.getControlConfigurations();
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
    Libdoc_Offers_Abstract.prototype.getField = function (section, name)
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
    Libdoc_Offers_Abstract.prototype.bind = function ()
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
     * Получит URL получения данных
     * @returns {string}
     */
    Libdoc_Offers_Abstract.prototype.getDataUrl = function ()
    {
        return '/libdoc/offers_crud/read';
    };
    /**
     * Получить данные
     * @param {string} section - секция
     */
    Libdoc_Offers_Abstract.prototype.getData = function (section)
    {
        if (section === void 0) {
            section = '';
        }
        var _self = this;
        $.ajax(this.getDataUrl(), {
            dataType: 'json',
            data    : {offerId: _self._id, offerTypeId: _self._type, leadProjectId: _self.leadProjectId},
            async   : false,
            success : function (response)
            {
                _self._values = response.data.values;
                _self._fields = response.data.fields;

                _self.updateSections(section);
                _self._isLoad = true;
            },
        });
    };
    /**
     * Обновление секций
     * @param {string} section
     */
    Libdoc_Offers_Abstract.prototype.updateSections = function (section)
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

        this.checkManagerValues();
    };
    /**
     * Проверить и выполнить действия по данным менеджера
     * @returns {void}
     */
    Libdoc_Offers_Abstract.prototype.checkManagerValues = function ()
    {
        if (parseInt(this.getValues('manager').phone)) {
            $('.manager-phone').show();
        } else {
            $('.manager-phone').hide();
        }
    };
    /**
     * Получить URL сохранения данных
     * @returns {string}
     */
    Libdoc_Offers_Abstract.prototype.getSaveUrl = function ()
    {
        return '/libdoc/offers/save/';
    };
    /**
     * Сохранение
     */
    Libdoc_Offers_Abstract.prototype.info = function ()
    {
        var _self = this;
        var saveData = {};
        for (var i in this._fields) {
            saveData[i] = this._getController(i).info();
        }
        $.ajax(this.getSaveUrl(), {
            dataType: 'json',
            data: {id: _self._id, type: _self._type, data: saveData, leadId: this.leadId, leadProjectId: _self.leadProjectId},
            //async: false,
            type: 'POST',
            success: function (data)
            {
                if (!isNaN(parseInt(data.success))) {
                    if (_self._id) {
                        alert('Успешно сохранено');
                        _self._isChanged = false;
                        _self._postSave();
                    } else {
                        window.location.href = '/libdoc/offers/editor/id/' + data.success;
                    }
                } else {
                    alert('Ошибка сохранения: ' + data.error);
                }
            }
        });
    };
    Libdoc_Offers_Abstract.prototype._postSave = function ()
    {
    };
    /**
     * Получить контроллер секции
     * @param {string} section
     * @returns {Libdoc_Offers_Sections_Default}
     */
    Libdoc_Offers_Abstract.prototype._getController = function (section)
    {
        if (!this._controllers[section]) {
            this._controllers[section] = new Libdoc_Offers_Sections_Default(this, section);
        }
        return this._controllers[section];
    };
    /**
     * Фабрика
     * @param {string} typeId - Тип предложения
     * @param {number} id - id предложения
     * @param {object} access - права
     * @returns {Libdoc_Offers_Abstract}
     */
    Libdoc_Offers_Abstract.factory = function (typeId, id, access, leadId, leadProjectId)
    {
        var requireClass = 'Libdoc_Offers_Offer' + typeId;
        if (!_tools.requireClass(requireClass)) {
            return alert('Error require class "' + requireClass + '"');
        }
        return new window[requireClass](id, access, leadId, leadProjectId);
    };
    /**
     * Получить значения секции или значение по умолчанию
     * @param {string} section - секция
     * @param {*?} defaultValue - значение по умолчанию
     * @returns {*}
     */
    Libdoc_Offers_Abstract.prototype.getValues = function (section, defaultValue)
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
    Libdoc_Offers_Abstract.prototype._getFields = function (section)
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
    Libdoc_Offers_Abstract.prototype.checkFields = function ()
    {
        var fields = $('.rq:empty').filter(':visible');
        //var fields = $('.rq:visible:empty'); - не всегда срабатывает FF 44.02 Linux
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
    Libdoc_Offers_Abstract.prototype.setValues = function (section, data)
    {
        this._values[section] = data;
        this.updateSections(section);
    };
    /**
     * Изменить часть значений секции и обновить поля
     * @param {string} section - секция
     * @param {mixed} data - данные
     */
    Libdoc_Offers_Abstract.prototype.patchValues = function (section, data)
    {
        if (!this._values[section]) {
            this._values[section] = {};
        }
        for(let key in data){
            this._values[section][key] = data[key];
        }
        this.updateSections(section);
    };
    /**
     * Запуск печати
     */
    Libdoc_Offers_Abstract.prototype.print = function ()
    {
        if (this._isChanged) {
            return alert('Сохраните изменения перед печатью');
        }
        window.print();
    };
    /**
     * Получить обработчик элемента управления
     * @param {string} name - имя элемента
     * @returns {Libdoc_Offers_Controls_Abstract}
     */
    Libdoc_Offers_Abstract.prototype.getControl = function (name)
    {
        return this._controls[name];
    };
    /**
     * Получить строковый тип документа
     */
    Libdoc_Offers_Abstract.prototype.getTypeName = function ()
    {
        return 'offer' + this._type;
    };
    /**
     * Получить тип документа
     */
    Libdoc_Offers_Abstract.prototype.getType = function ()
    {
        return this._type;
    };
    /**
     * Получить URL актуализации данных
     * @returns {string}
     */
    Libdoc_Offers_Abstract.prototype.getActualDataUrl = function ()
    {
        return '/libdoc/ajax_offers_type' + this._type + '/get-actual-data';
    };
    /**
     * Получить актуальные данные
     * @param {object} updateList
     * @returns {object}
     */
    Libdoc_Offers_Abstract.prototype._getActualData = function (updateList)
    {
        var result = '';
        $.ajax({
            url: this.getActualDataUrl(),
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
    /**
     *
     * @returns {string}
     */
    Libdoc_Offers_Abstract.prototype.getConfigurationUrl = function ()
    {
        return '/libdoc/offers_data-source/get-control-configurations';
    };

    /**
     * Получить данные конфигурации КП
     */
    Libdoc_Offers_Abstract.prototype.getControlConfigurations = function ()
    {
        $.ajax(
            this.getConfigurationUrl(),
            {
                dataType: 'json',
                data    : {},
                async   : false,
                success : (response) => this.sectionData = response.data,
            }
        );
    }

    // /**
    //  * Создать счет
    //  * @param data
    //  * @returns {Promise<unknown>}
    //  */
    // Libdoc_Offers_Abstract.prototype.createInvoice = function (data)
    // {
    //     return new Promise((resolve, reject) =>
    //     {
    //         $.ajax({
    //             url     : '/libdoc/offers/create-invoice/',
    //             data    : {
    //                 data: data,
    //             },
    //             dataType: 'json',
    //             type    : 'POST',
    //             success : function (data)
    //             {
    //                 resolve(data);
    //             },
    //             error   : function (data)
    //             {
    //                 reject(data);
    //             }
    //         });
    //     });
    // };
    return Libdoc_Offers_Abstract;
}());
