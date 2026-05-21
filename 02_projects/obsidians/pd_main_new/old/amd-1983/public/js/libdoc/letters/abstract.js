/**
 * Абстрактный класс
 * Основные методы + фабрика
 */
var Libdoc_Letters_Abstract = (function ()
{
    /**
     * Конструктор
     * @param {number} id
     */
    function Libdoc_Letters_Abstract(id, access) {
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
        _tools.requireClass('Libdoc_Letters_Sections_Default');
        this.init();
        // Скрыть загрузчика
        $('#section-loader').hide('slow');
    }
    /**
     * инициализация
     */
    Libdoc_Letters_Abstract.prototype.init = function ()
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
    Libdoc_Letters_Abstract.prototype.getField = function (section, name)
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
    Libdoc_Letters_Abstract.prototype.bind = function ()
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
    Libdoc_Letters_Abstract.prototype.getData = function (section)
    {
        if (section === void 0) {
            section = '';
        }
        var _self = this;
        $.ajax('/libdoc/letters/get-data/', {
            dataType: 'json',
            data: {id: _self._id, type: _self._type, section: section},
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
    Libdoc_Letters_Abstract.prototype.updateSections = function (section)
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
    };
    /**
     * Сохранение
     */
    Libdoc_Letters_Abstract.prototype.info = function ()
    {
        var _self = this;
        var saveData = {};
        for (var i in this._fields) {
            saveData[i] = this._getController(i).info();
        }
        $.ajax('/libdoc/letters/save/', {
            dataType: 'json',
            data: {id: _self._id, type: _self._type, data: saveData},
            //async: false,
            type: 'POST',
            success: function (data)
            {
                if (!isNaN(parseInt(data.success))) {
                    if (_self._id) {
                        alert('Успешно сохранено');
                        _self._isChanged = false;
                    } else {
                        window.location.href = '/libdoc/letters/editor/id/' + data.success;
                    }
                } else {
                    alert('Ошибка сохранения');
                }
            }
        });
    };
    /**
     * Получить контроллер секции
     * @param {string} section
     * @returns {Libdoc_Letters_Sections_Default}
     */
    Libdoc_Letters_Abstract.prototype._getController = function (section)
    {
        if (!this._controllers[section]) {
            this._controllers[section] = new Libdoc_Letters_Sections_Default(this, section);
        }
        return this._controllers[section];
    };
    /**
     * Фабрика
     * @param {string} typeId - Тип предложения
     * @param {number} id - id предложения
     * @param {object} access - права
     * @returns {Libdoc_Letters_Abstract}
     */
    Libdoc_Letters_Abstract.factory = function (typeId, id, access)
    {
        var requireClass = 'Libdoc_Letters_Editor' + typeId;
        if (!_tools.requireClass(requireClass)) {
            return alert('Error require class "' + requireClass + '"');
        }
        return new window[requireClass](id, access);
    };
    /**
     * Получить значения секции или значение по умолчанию
     * @param {string} section - секция
     * @param {mixed} defaultValue - значение по умолчанию
     * @returns {mixed}
     */
    Libdoc_Letters_Abstract.prototype.getValues = function (section, defaultValue)
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
    Libdoc_Letters_Abstract.prototype._getFields = function (section)
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
    Libdoc_Letters_Abstract.prototype.checkFields = function ()
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
    Libdoc_Letters_Abstract.prototype.setValues = function (section, data)
    {
        this._values[section] = data;
        this.updateSections(section);
    };
    /**
     * Запуск печати
     */
    Libdoc_Letters_Abstract.prototype.print = function ()
    {
        if (this._isChanged) {
            return alert('Сохраните изменения перед печатью');
        }
        window.print();
    };
    /**
     * Получить обработчик элемента управления
     * @param {string} name - имя элемента
     * @returns {Libdoc_Letters_Controls_Abstract}
     */
    Libdoc_Letters_Abstract.prototype.getControl = function (name)
    {
        return this._controls[name];
    };
    /**
     * Получить строковый тип документа
     */
    Libdoc_Letters_Abstract.prototype.getTypeName = function ()
    {
        return 'letter' + this._type;
    };    
    /**
     * Получить актуальные данные
     * @param {object} updateList
     * @returns {object}
     */
    Libdoc_Letters_Abstract.prototype._getActualData = function (updateList)
    {
        var result = '';
        $.ajax({
            url: '/libdoc/ajax_letters_type' + this._type + '/get-actual-data',
            dataType: 'json',
            data: {updateList: updateList, id: this._id},
            async: false,
            success: function (data)
            {
                result = data;
            }
        });
        return result;
    }
    return Libdoc_Letters_Abstract;
}());
