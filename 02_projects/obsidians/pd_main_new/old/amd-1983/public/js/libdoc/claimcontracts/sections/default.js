/**
 * Конроллер секций по умолчанию
 */
var Libdoc_ClaimContracts_Sections_Default = (function ()
{
    /**
     * Конструктор
     * @param {Libdoc_ClaimContracts_Abstract} claimcontract - объект документа
     * @param {string} section
     */
    function Libdoc_ClaimContracts_Sections_Default(claimcontract, section) {
        this._section = section;
        this._claimcontract = claimcontract;
    }
    /**
     * Получить данные секции
     * @param {mixed} defaultValue - значение по умолчанию
     */
    Libdoc_ClaimContracts_Sections_Default.prototype._getData = function (defaultValue)
    {
        if (defaultValue === void 0) {
            defaultValue = {};
        }
        return this._claimcontract.getValues(this._section, defaultValue);
    };
    /**
     * Получить поля секции
     */
    Libdoc_ClaimContracts_Sections_Default.prototype._getFields = function ()
    {
        return this._claimcontract._getFields(this._section);
    };
    /**
     * Проверить загружен ли документ
     * @returns {boolean}
     */
    Libdoc_ClaimContracts_Sections_Default.prototype._isLoad = function ()
    {
        return this._claimcontract._isLoad;
    };
    /**
     * Постобработка содержимого ввода
     * @param {JQuery} element - объект поля
     */
    Libdoc_ClaimContracts_Sections_Default.prototype.input = function (element)
    {
        var field = element.data();
        var oldValue = this._getData()[field.field];
        var newValue = $.trim(element.text());
        if (newValue == oldValue) {
            return;
        }
        this._getData()[field.field] = newValue;
        this.updateField(field.field);
        this._claimcontract._isChanged = true;
    };
    /**
     * Обновление секции
     */
    Libdoc_ClaimContracts_Sections_Default.prototype.update = function ()
    {
        var fields = this._getFields();
        for (var field in fields) {
            this.updateField(field);
        }
    };

    /**
     * Получение поля
     * @param {string} field
     * @return {jQuery}
     */
    Libdoc_ClaimContracts_Sections_Default.prototype.getField = function (field)
    {
        return $('[data-section=' + this._section + '][data-field=' + field + ']');
    };

    /**
     * Обновление поля
     * @param {string} field
     */
    Libdoc_ClaimContracts_Sections_Default.prototype.updateField = function (field)
    {
        $('[data-section=' + this._section + '][data-field=' + field + ']').text(this._getData()[field] || "");
    };
    
    /**
     * Обработка и получение данных секции при сохранении
     * @returns {mixed}
     */
    Libdoc_ClaimContracts_Sections_Default.prototype.info = function ()
    {
        return this._getData();
    };
    return Libdoc_ClaimContracts_Sections_Default;
}());
