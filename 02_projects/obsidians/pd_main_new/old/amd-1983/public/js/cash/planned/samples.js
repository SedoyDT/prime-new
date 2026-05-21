/**
 * Класс поведения образцов
 */
var Cash_Planned_Samples = (function ()
{
    /**
     * Конструктор
     * @param {type} params - Параметры вида {id: string, CashPlannedObject}
     * @returns {samples_L4.Cash_Planned_Samples}
     */
    function Cash_Planned_Samples(params)
    {
        /**
         * id чекбокса
         */
        this._elementId = params.elementId || '#samples';

        /**
         * Объект платежа
         */
        this._cashPlannedObject = params.CashPlannedObject;

        /**
         * Права
         */
        this._permissions = this._cashPlannedObject.permissions || {};

        /**
         * Флаг ТК
         */
        this._tk = this._cashPlannedObject.transaction.tk;

        /**
         * Id заявки
         */
        this._claimId = this._cashPlannedObject.transaction.reason;

        /**
         * Чекбокс
         */
        this._element = $(this._elementId);
        this._initFields();
    }
    /**
     * Инициализировать Поля
     */
    Cash_Planned_Samples.prototype._initFields = function ()
    {
        if (this._permissions.restrictsamples) {
            // Все заявки на продажу у которых сумма = 0, являются образцами
            if (
                (parseInt(claimType) === 1) &&
                (
                    (cashType === 'account' && parseFloat(invoiceSum) <= 0) ||
                    (cashType === 'money'   && parseFloat(claimSum) <= 0)
                )
            ) {
                this._element.prop({ checked: true });
                cashPlannedMainCheckboxClickCallback(this._element);
            }
        }
    };
    /**
     * Проверки при сохранением
     */
    Cash_Planned_Samples.prototype.info = function ()
    {
        /**
         * Захаров:
         * Умножаем на 10 потомучто в application/modules/cash/views/scripts/planned/form/account.phtml, строка 75 добавляется 0
         * Ранее была ошибка связанная с заменой ключа на tr->reason на tr->id
         */
        let documentId = this._cashPlannedObject.transaction.id * 10;

        var documentControl = this._cashPlannedObject.documentControl[documentId];

        if (
                !this._cashPlannedObject.transaction.tk
                || !this._permissions.restrictsamples // если не обязательно
                || this._cashPlannedObject.transaction.cash_type // если нал
                || !this._element.is(':checked') // если не образцы
                || (documentControl.getFileCount() && documentControl.isValid()) // если подгрузил документы ТК
        ) {
            return true;
        }
        return 'Необходимо прикрепить документы ТК';
    };
    return Cash_Planned_Samples;
}());
