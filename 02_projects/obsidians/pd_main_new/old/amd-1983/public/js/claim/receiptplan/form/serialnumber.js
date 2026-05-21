/**
 * Класс для редактирования серийного номера
 * @type Claim_ReceiptPlan_Form_SerialNumber
 */
var Claim_ReceiptPlan_Form_SerialNumber = (function ()
{

    /**
     * @constructor
     * @param {object} params
     * @returns {Claim_ReceiptPlan_Form_SerialNumber}
     */
    function Claim_ReceiptPlan_Form_SerialNumber(params)
    {
        /**
         * id записи плана
         * @type {string}
         */
        this._planId = undefined;
        /**
         * серийный номер
         * @type {string}
         * @private
         */
        this._serialNumber = undefined;
        /**
         * Номер плана в привязках
         * @type {number}
         * @private
         */
        this._rowNumber = undefined;
        /**
         * Id заявки
         * @type {string}
         * @private
         */
        this._claimId = undefined;
        /**
         * Дата заявки
         * @type {string}
         * @private
         */
        this._claimDate = undefined;
        // /**
        //  * Родитель
        //  * @type {Receiptplan}
        //  */
        // this._parent = params.parent;
        /**
         * Форма с фильтром для выбора пользователей
         * @type {Receipt_Tools_Filter_AjaxForm}
         */
        this._form = new Receipt_Tools_Filter_AjaxForm(this._getFormParams());
        /**
         * Обратный вызов для сохранения
         * @type {()=>void}
         * @private
         */
        this._onSave = params.onSave;
    }

    /**
     * Установить серийный номер
     * @param {string} serialNumber
     * @returns {Claim_ReceiptPlan_Form_SerialNumber}
     */
    Claim_ReceiptPlan_Form_SerialNumber.prototype.setSerialNumber = function (serialNumber)
    {
        this._serialNumber = serialNumber;
        return this;
    };


    /**
     * Установить id записи плана
     * @param {string} planId
     * @returns {Claim_ReceiptPlan_Form_SerialNumber}
     */
    Claim_ReceiptPlan_Form_SerialNumber.prototype.setPlanId = function (planId)
    {
        this._planId = planId;
        // this.setSerialNumber(this._parent.getSerialNumber(this._planId));
        return this;
    };


    /**
     *
     * @param {number} rowNumber
     * @return {Claim_ReceiptPlan_Form_SerialNumber}
     */
    Claim_ReceiptPlan_Form_SerialNumber.prototype.setRowNumber = function (rowNumber)
    {
        this._rowNumber = rowNumber;
        return this;
    };


    /**
     *
     * @param {string} claimId
     * @return {Claim_ReceiptPlan_Form_SerialNumber}
     */
    Claim_ReceiptPlan_Form_SerialNumber.prototype.setClaimId = function (claimId)
    {
        this._claimId = claimId;
        return this;
    };


    /**
     *
     * @param {string} claimDate
     * @return {Claim_ReceiptPlan_Form_SerialNumber}
     */
    Claim_ReceiptPlan_Form_SerialNumber.prototype.setClaimDate = function (claimDate)
    {
        this._claimDate = claimDate;
        return this;
    };


    /**
     * Сохранить
     * @param {object} data
     * @returns {void}
     */
    Claim_ReceiptPlan_Form_SerialNumber.prototype.info = function (data)
    {
        let workers = data.map(function (v)
        {
            return v.id;
        });

        let initials = data.map(function (v)
        {
            let list = $.trim(v.name.replace(/\s{2,}/g, ' ')).split(' ');
            return (list[0].substr(0, 1) + list[1].substr(0, 1)).toUpperCase();
        }).join('');

        let index = Number(-this._rowNumber - 1).lpad(3);

        let serialNumber = (this._claimDate.replace(/^.+\.(\d+)\.(\d{2})(\d{2})$/, '$1$3') || '0000')
            + Number(this._claimId).lpad(5)
            + initials
            + index;

        // this._parent.setSerialNumber(this._planId, serialNumber, workers);
        this._onSave(this._planId, serialNumber, workers);

        this._form.hide();
    };

    /**
     * Показать форму для выбора сотрудников
     * @returns {void}
     */
    Claim_ReceiptPlan_Form_SerialNumber.prototype.show = function ()
    {
        this._form.show();
    };


    /**
     * Получить id используемой заявки
     * @returns {null|string}
     */
    Claim_ReceiptPlan_Form_SerialNumber.prototype.getCurrentClaimId = function ()
    {
        let serialNumber = String(this._serialNumber);

        if (!serialNumber) {
            return null;
        }

        return serialNumber.substr(4, (serialNumber.indexOf(serialNumber.match(/[a-zа-яё]/i).join(''))) - 4);
    };

    /**
     * Получить текущий номер строки
     * @return {null|number}
     */
    Claim_ReceiptPlan_Form_SerialNumber.prototype.getCurrentRowNumber = function ()
    {
        let serialNumber = String(this._serialNumber);
        let separatorIndex = serialNumber.indexOf('-');

        if (!serialNumber || -1 === separatorIndex) {
            return null;
        }

        return parseInt(serialNumber.substr(separatorIndex + 1)) || null;
    };

    /**
     * Разукрасить серийный номер
     * @param {string} serialNumber
     * @returns {string}
     */
    Claim_ReceiptPlan_Form_SerialNumber.prototype.colorize = function (serialNumber)
    {
        if (!serialNumber) {
            return 'Назначить номер оборудования';
        }

        return this._colorize(serialNumber);
    };

    /**
     * Разукрасить серийный номер
     * @param {string} serialNumber
     * @returns {string}
     */
    Claim_ReceiptPlan_Form_SerialNumber.prototype._colorize = function (serialNumber)
    {
        var colors = [
            '#ffff00',
            '#00ff00',
            '#00ffff',
            'inherit',
        ];

        return this._explode(serialNumber).map(function (v, i)
        {
            return '<span style="background-color: ' + colors[i] + '">' + v + '</span>';
        }).join('');
    };

    /**
     * Разбить серийный номер на состовляющие
     * @param {string} serialNumber
     * @returns {string[]}
     */
    Claim_ReceiptPlan_Form_SerialNumber.prototype._explode = function (serialNumber)
    {
        var ws, separatorIndex;

        separatorIndex = serialNumber.indexOf('-');

        return [
            serialNumber.substr(0, 4),
            serialNumber.substr(4, (ws = serialNumber.indexOf(serialNumber.match(/[a-zа-яё]/i).join(''))) - 4),
            serialNumber.substr(ws, separatorIndex !== -1 ? separatorIndex - ws : undefined),
            separatorIndex !== -1 ? serialNumber.substr(separatorIndex) : '',
        ];
    };

    /**
     * Получить параметры формы
     * @returns {object}
     */
    Claim_ReceiptPlan_Form_SerialNumber.prototype._getFormParams = function ()
    {
        var _self = this;
        var filterConfig = __.extend(receiptShareFiltercfgUsers, {
            urls: {
                resultUrl: "/claim/receipt_users/getfilterresult",
                configUrl: "/claim/receipt_users/getfilterconfig",
                maskUrl: "/claim/receipt_users/getfiltermask"
            }
        });

        return {
            filter: filterConfig,
            title: 'Выберите сотрудников',
            overflowXScroll: false,
            addPostData: {
//                planType: 3,
                closed: 0
            },
            form: {
                width: 850,
                destroyOnHide: true
            },
            onSubmit: function ()
            {
                var data = _self._form.getSelectionData();
                if (!data.length) {
                    alert('- необходимо указать оборудование');
                    return false;
                }

                _self.save(data);
            }
        };
    };

    return Claim_ReceiptPlan_Form_SerialNumber;
})();