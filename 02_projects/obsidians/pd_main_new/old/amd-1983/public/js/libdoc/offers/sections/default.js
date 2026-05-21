/**
 * Конроллер секций по умолчанию
 */
var Libdoc_Offers_Sections_Default = (function ()
{
    /**
     * Конструктор
     * @param {Libdoc_Offers_Abstract} offer - объект документа
     */
    function Libdoc_Offers_Sections_Default(offer, section) {
        this._section = section;
        this._offer = offer;
    }
    /**
     * Получить данные секции
     * @param {mixed} defaultValue - значение по умолчанию
     */
    Libdoc_Offers_Sections_Default.prototype._getData = function (defaultValue)
    {
        if (defaultValue === void 0) {
            defaultValue = {};
        }
        return this._offer.getValues(this._section, defaultValue);
    };
    /**
     * Получить поля секции
     */
    Libdoc_Offers_Sections_Default.prototype._getFields = function ()
    {
        return this._offer._getFields(this._section);
    };
    /**
     * Проверить загружен ли документ
     * @returns {boolean}
     */
    Libdoc_Offers_Sections_Default.prototype._isLoad = function ()
    {
        return this._offer._isLoad;
    };
    /**
     * Постобработка содержимого ввода
     * @param {JQuery} element - объект поля
     */
    Libdoc_Offers_Sections_Default.prototype.input = function (element)
    {
        var field = element.data();
        var oldValue = this._getData()[field.field];
        var newValue = $.trim(element.text());
        if (newValue == oldValue) {
            return;
        }
        this._getData()[field.field] = newValue;
        this.updateField(field.field);
        this._offer._isChanged = true;
    };
    /**
     * Обновление секции
     */
    Libdoc_Offers_Sections_Default.prototype.update = function ()
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
    Libdoc_Offers_Sections_Default.prototype.updateField = function (field)
    {
        $('[data-section=' + this._section + '][data-field=' + field + ']').text(this._getData()[field] || "");
    };
    /**
     * Обработка и получение данных секции при сохранении
     * @returns {mixed}
     */
    Libdoc_Offers_Sections_Default.prototype.info = function ()
    {
        return this._getData();
    };
    return Libdoc_Offers_Sections_Default;
}());
