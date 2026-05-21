/**
 * Конроллер секций по умолчанию
 */
var Libdoc_Letters_Sections_Default = (function ()
{
    /**
     * Конструктор
     * @param {Libdoc_Letters_Abstract} libdoc - объект документа
     */
    function Libdoc_Letters_Sections_Default(libdoc, section) {
        this._section = section;
        this._libdoc = libdoc;
    }
    /**
     * Получить данные секции
     * @param {mixed} defaultValue - значение по умолчанию
     */
    Libdoc_Letters_Sections_Default.prototype._getData = function (defaultValue)
    {
        if (defaultValue === void 0) {
            defaultValue = {};
        }
        return this._libdoc.getValues(this._section, defaultValue);
    };
    /**
     * Получить поля секции
     */
    Libdoc_Letters_Sections_Default.prototype._getFields = function ()
    {
        return this._libdoc._getFields(this._section);
    };
    /**
     * Проверить загружен ли документ
     * @returns {boolean}
     */
    Libdoc_Letters_Sections_Default.prototype._isLoad = function ()
    {
        return this._libdoc._isLoad;
    };
    /**
     * Постобработка содержимого ввода
     * @param {JQuery} element - объект поля
     */
    Libdoc_Letters_Sections_Default.prototype.input = function (element)
    {
        var field = element.data();
        var oldValue = this._getData()[field.field];
        var newValue = $.trim(element.text());
        if (newValue == oldValue) {
            return;
        }
        this._getData()[field.field] = newValue;
        this.updateField(field.field);
        this._libdoc._isChanged = true;
    };
    /**
     * Обновление секции
     */
    Libdoc_Letters_Sections_Default.prototype.update = function ()
    {
        var fields = this._getFields();
        for (var field in fields) {
            this.updateField(field);
        }
    };
    /**
     * Обновление поля
     * @param {string} field
     */
    Libdoc_Letters_Sections_Default.prototype.updateField = function (field)
    {
        $('[data-section=' + this._section + '][data-field=' + field + ']').text(this._getData()[field] || "");
    };
    /**
     * Обработка и получение данных секции при сохранении
     * @returns {mixed}
     */
    Libdoc_Letters_Sections_Default.prototype.info = function ()
    {
        return this._getData();
    };
    return Libdoc_Letters_Sections_Default;
}());
