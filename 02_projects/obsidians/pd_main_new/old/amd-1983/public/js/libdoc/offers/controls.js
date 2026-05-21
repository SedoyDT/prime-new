/**
 * Абстрактный объект элемента управления
 */
var Libdoc_Offers_Controls_Abstract = (function ()
{
    /**
     * Конструтор
     * @param {Libdoc_Offers_Abstract} offer - объект документа
     * @param {string} title - имя элемента
     */
    function Libdoc_Offers_Controls_Abstract(offer, title)
    {
        //объект документа
        this._offer = offer;
        //элемент контейнер блока элементов управления
        this._container = $('section#control_panel');
        //название элемента управления
        this._title = title;
        this._eventListeners = {};
        this.createControl();
        this.bindEvents();
    }

    /**
     *
     * @param event
     * @param cb
     * @return {boolean}
     */
    Libdoc_Offers_Controls_Abstract.prototype.addEventListener = function (event, cb)
    {
        if (!this._eventListeners[event]) {
            return false;
        }

        this._eventListeners[event].push(cb);

        return true;
    };

    /**
     *
     * @param event
     * @return {Array}
     */
    Libdoc_Offers_Controls_Abstract.prototype.getEventListeners = function (event)
    {
        return this._eventListeners[event]||[];
    };

    return Libdoc_Offers_Controls_Abstract;
}());
/**
 * Абстрактная кнопка
 */
var Libdoc_Offers_Controls_Button = (function (_super)
{
    __extends(Libdoc_Offers_Controls_Button, _super);
    function Libdoc_Offers_Controls_Button()
    {
        _super.apply(this, arguments);
    }
    /**
     * Создание элемента управления
     */
    Libdoc_Offers_Controls_Button.prototype.createControl = function ()
    {
        this._element = $('<input type="button" value="' + this._title + '">');
        this._container.append(this._element);
    };
    return Libdoc_Offers_Controls_Button;
}(Libdoc_Offers_Controls_Abstract));
/**
 * Абстрактный селект
 */
var Libdoc_Offers_Controls_Select = (function (_super)
{
    __extends(Libdoc_Offers_Controls_Select, _super);
    function Libdoc_Offers_Controls_Select()
    {
        _super.apply(this, arguments);
    }
    /**
     * Создание элемента управления
     */
    Libdoc_Offers_Controls_Select.prototype.createControl = function ()
    {
        var selectItem = $('span[data-section="' + this._section + '"][data-field="select_key"]').text();
        this._data = this.getData();
        this._element = $('<select/>');
        this._container.append(this._element);
        this._element.append('<option value="-1">**выбрать**</option>');
        for (var key in this._data) {
            var item = this._data[key];
            var option = $('<option value="' + key + '">' + item[this._titleField] + '</option>');
            if (selectItem === key) {
                option.attr('selected', 'selected');
            }
            this._element.append(option);
        }
    };
    /**
     * Получить данные в зависимости от выбора
     */
    Libdoc_Offers_Controls_Select.prototype._getSelectData = function ()
    {
        return this._data[this._element.val()];
    };
    return Libdoc_Offers_Controls_Select;
}(Libdoc_Offers_Controls_Abstract));
/**
 * Абстрактный модальные элемент
 */
var Libdoc_Offers_Controls_Modal = (function (_super)
{
    __extends(Libdoc_Offers_Controls_Modal, _super);
    function Libdoc_Offers_Controls_Modal()
    {
        _super.apply(this, arguments);
    }
    /**
     * Создание элемента управления
     */
    Libdoc_Offers_Controls_Modal.prototype.createControl = function ()
    {
        _super.prototype.createControl.call(this);
        this._panel = $('<div class="toolPanelDynamicBlock"></div>');
        this._container.append(this._panel);
        this.qwe();
    };
    /**
     * Вешаем события
     */
    Libdoc_Offers_Controls_Modal.prototype.bindEvents = function ()
    {
        var _self = this;
        this._element.click(function ()
        {
            if (!_self._panel.is(':visible')) {
                $('.toolPanelDynamicBlock').hide();
            }
            _self._panel.toggle();
        });
    };
    return Libdoc_Offers_Controls_Modal;
}(Libdoc_Offers_Controls_Button));
/**
 * Кнопка печати
 */
var Libdoc_Offers_Controls_Print = (function (_super)
{
    __extends(Libdoc_Offers_Controls_Print, _super);
    /**
     * Конструтор
     * @param {Libdoc_Offers_Abstract} offer - объект документа
     * @param {string} title - имя элемента
     */
    function Libdoc_Offers_Controls_Print(offer)
    {
        _super.call(this, offer, 'Печать');
    }
    /**
     * Вешаем события
     */
    Libdoc_Offers_Controls_Print.prototype.bindEvents = function ()
    {
        var _self = this;
        this._element.click(function ()
        {
            if (!_self._offer._id) {
                alert('Сохраните документ перед печатью!');
                return;
            }
            if (_self._offer.checkFields()) {
                _self._offer.print();
            }
        });
    };
    return Libdoc_Offers_Controls_Print;
}(Libdoc_Offers_Controls_Button));
/**
 * Кнопка сохранения
 */
var Libdoc_Offers_Controls_Save = (function (_super)
{
    __extends(Libdoc_Offers_Controls_Save, _super);
    /**
     * Конструтор
     * @param {Libdoc_Offers_Abstract} offer - объект документа
     * @param {string} title - имя элемента
     */
    function Libdoc_Offers_Controls_Save(offer)
    {
        _super.call(this, offer, 'Сохранить');
    }
    /**
     * Вешаем события
     */
    Libdoc_Offers_Controls_Save.prototype.bindEvents = function ()
    {
        var _self = this;
        this._element.click(function ()
        {
            _self._offer.save();
        });
    };
    return Libdoc_Offers_Controls_Save;
}(Libdoc_Offers_Controls_Button));
/**
 * Выбор реквизитов и тд и тп
 */
var Libdoc_Offers_Controls_Configuration = (function (_super)
{
    __extends(Libdoc_Offers_Controls_Configuration, _super);
    /**
     * Конструтор
     * @param {Libdoc_Offers_Abstract} offer - объект документа
     * @param {string} title - имя элемента
     */
    function Libdoc_Offers_Controls_Configuration(offer)
    {
        this._section = 'configuration';
        this._titleField = 'sectionName';
        _super.call(this, offer, 'configuration');

        this._eventListeners.change = [];
    }
    /**
     * Вешаем события
     */
    Libdoc_Offers_Controls_Configuration.prototype.bindEvents = function ()
    {
        var _self = this;
        this._element.change(function ()
        {
            var data = _self._getSelectData();
            let listeners = _self.getEventListeners('change');

            _self._offer.setValues(_self._section, data);
            _self._offer._isChanged = true;

            for (let listener of listeners) {
                listener();
                // _self._offer.getControl('seal')['updateList'](data ? data['seals'][_self._offer.getTypeName()] : null);
            }
        });
    };
    /**
     * Получить данные для селекта
     */
    Libdoc_Offers_Controls_Configuration.prototype.getData = function ()
    {
        var data;

        $.ajax({
            dataType: 'json',
            async   : false,
            url     : this._offer.getConfigurationUrl(),
            success : function (response)
            {
                data = response.data;

                for (var key in data) {
                    data[key].vat = +data[key]['disableVAT'] ? '' : 'Цена указана с учетом НДС';
                }
            }
        });

        return data;
    };
    return Libdoc_Offers_Controls_Configuration;
}(Libdoc_Offers_Controls_Select));
/**
 * Выбор даты
 */
var Libdoc_Offers_Controls_Date = (function (_super)
{
    __extends(Libdoc_Offers_Controls_Date, _super);
    /**
     * Конструтор
     * @param {Libdoc_Offers_Abstract} offer - объект документа
     * @param {string} title - имя элемента
     */
    function Libdoc_Offers_Controls_Date(offer)
    {
        _super.call(this, offer, offer._values['_']['date']);
    }
    /**
     * Вешаем события
     */
    Libdoc_Offers_Controls_Date.prototype.qwe = function ()
    {
        var _self = this;
        this.datePicker = $('<div></div>');
        this._panel.append(this.datePicker);
        this.datePicker.datepicker({
            onSelect: function (regularDate)
            {
                _self._element.val(regularDate);
                _self._offer.getValues('_')['date'] = regularDate;
                _self._offer._getController('_').updateField('date');
                _self._panel.hide();
                _self._offer._isChanged = true;
            }
        });
        this._element.click(function ()
        {
            var selectDate = this.value.split('.');
            _self.datePicker.datepicker('setDate', new Date(selectDate[2] + '-' + selectDate[1] + '-' + selectDate[0]));
        });
    };
    return Libdoc_Offers_Controls_Date;
}(Libdoc_Offers_Controls_Modal));
/**
 * Кнопка обновления данных
 */
var Libdoc_Offers_Controls_Refresh = (function (_super)
{
    __extends(Libdoc_Offers_Controls_Refresh, _super);
    /**
     * Конструтор
     * @param {Libdoc_Offers_Abstract} offer - объект документа
     * @param {string} title - имя элемента
     */
    function Libdoc_Offers_Controls_Refresh(offer)
    {
        _super.call(this, offer, 'Обновить');
    }
    /**
     * Заполнение панели
     */
    Libdoc_Offers_Controls_Refresh.prototype.qwe = function ()
    {
        var list = this._offer.getRefreshObjects();
        this._select = $('<select style="width: 100%; height: 200px;" multiple="multiple" id="refreshSelect"></select>');
        for (var key in list) {
            this._select.append('<option value="' + key + '">' + list[key] + '</option>');
        }
        this._panel.append('<div style="margin-bottom: 10px;"></div>\
        <div>\
            <input type="button" value="Обновить" data-action="select" class="sealSelectButton">\
            <input type="button" value="Обновить всё" data-action="all" class="sealSelectButton">\
        </div>');
        this._panel.find('div:first').append(this._select);
        this.initButtons();
    };
    /**
     * Вешаем события
     */
    Libdoc_Offers_Controls_Refresh.prototype.initButtons = function ()
    {
        var _self = this;
        this._panel.find('input[data-action="select"]').click(function ()
        {
            _self.refresh();
        });
        this._panel.find('input[data-action="all"]').click(function ()
        {
            _self._select.find('option').prop('selected', true);
            _self.refresh();
        });
    };
    /**
     * Обновить выбранные объекты
     * @returns {undefined}
     */
    Libdoc_Offers_Controls_Refresh.prototype.refresh = function ()
    {
        this._offer.refresh(this._select.val());
        this._select.find('option').prop('selected', false);
        this._panel.toggle();
    };
    return Libdoc_Offers_Controls_Refresh;
}(Libdoc_Offers_Controls_Modal));


/**
 * Кнопка копирования
 */
var Libdoc_Offers_Controls_Copy = (function (_super)
{
    __extends(Libdoc_Offers_Controls_Copy, _super);

    /**
     * Конструтор
     * @param {Libdoc_Offers_Abstract} offer - объект документа
     * @param {string} title - имя элемента
     */
    function Libdoc_Offers_Controls_Copy(offer)
    {
        _super.call(this, offer, 'Копировать');
    }


    /**
     * Вешаем события
     */
    Libdoc_Offers_Controls_Copy.prototype.bindEvents = function ()
    {
        var _self = this;

        this._element.click(function ()
        {
            Libdoc_Offers_Copy.copy(_self._offer._id);
        });
    };

    return Libdoc_Offers_Controls_Copy;

}(Libdoc_Offers_Controls_Button));


/**
 * Кнопка закрытия
 */
var Libdoc_Offers_Controls_Close = (function (_super)
{
    __extends(Libdoc_Offers_Controls_Close, _super);
    /**
     * Конструтор
     * @param {Libdoc_Offers_Abstract} offer - объект документа
     * @param {string} title - имя элемента
     */
    function Libdoc_Offers_Controls_Close(offer)
    {
        _super.call(this, offer, 'Закрыть');
    }
    /**
     * Вешаем события
     */
    Libdoc_Offers_Controls_Close.prototype.bindEvents = function ()
    {
        var _self = this;
        this._element.click(function ()
        {
            if (!_self._offer._isChanged || window.confirm('Есть не сохраненные изменения. Закрыть?')) {
                window.close();
            }
        });
    };
    return Libdoc_Offers_Controls_Close;
}(Libdoc_Offers_Controls_Button));
/**
 * Выбор печатей
 */
var Libdoc_Offers_Controls_Seal = (function (_super)
{
    __extends(Libdoc_Offers_Controls_Seal, _super);
    /**
     * Конструтор
     * @param {Libdoc_Offers_Abstract} offer - объект документа
     * @param {string} title - имя элемента
     */
    function Libdoc_Offers_Controls_Seal(offer)
    {
        _super.call(this, offer, 'Печати');
        const configuration = offer.getValues('configuration');
        const offerCfg = configuration['offer'] && configuration['offer'][this._offer.getType()] ? configuration['offer'][this._offer.getType()] : null;
        //offer.getControl('configuration')._getSelectData();
        if (offerCfg && offerCfg['seals']) {
            this.updateList(offerCfg['seals']);
        }
        //если нет прав, скрываем кнопку
        if (!this._offer._access.signature) {
            this._element.hide();
        }
    }
    /**
     * Заполнение панели
     */
    Libdoc_Offers_Controls_Seal.prototype.qwe = function ()
    {
        this._select = $('<select style="width: 100%; height: 200px;" multiple="multiple" id="sealSelect"></select>');
        this._panel.append('<div style="margin-bottom: 10px;"></div>\
        <div>\
            <input type="button" value="Показать печати" data-action="show" class="sealSelectButton">\
            <input type="button" value="Скрыть печати" data-action="hide" class="sealSelectButton">\
        </div>');
        this._panel.find('div:first').append(this._select);
        this.initSealButtons();
        this.initImg();
    };
    /**
     * Инициализация кнопок выбора печатей
     */
    Libdoc_Offers_Controls_Seal.prototype.initSealButtons = function ()
    {
        var _self = this;
        this._panel.find('.sealSelectButton').click(function ()
        {
            var selectSeals = _self._select.val();
            if (!selectSeals) {
                return;
            }
            var action = $(this).data('action');
            var seals = _self._offer._values['_']['seals'];
            if (action === 'hide') {
                var rSelectSelals = seals.split(',');
                for (var i = 0; i < selectSeals.length; i++) {
                    for (var j = 0; j < rSelectSelals.length; j++) {
                        if (selectSeals[i] == rSelectSelals[j]) {
                            delete (rSelectSelals[i]);
                            break;
                        }
                    }
                }
                selectSeals = rSelectSelals;
            }
            _self._offer._values['_']['seals'] = selectSeals.join(',');
            _self.showSeals();
            _self._panel.toggle();
            _self._offer._isChanged = true;
        });
    };
    /**
     * Инициализация изображений
     */
    Libdoc_Offers_Controls_Seal.prototype.initImg = function ()
    {
        $('[data-seal]').each(function (key, item)
        {
            $(item).append('<img data-seal-id="' + $(item).data('seal') + '" style="display:none;">')
                    .append('<img data-signature-id="' + $(item).data('seal') + '" style="display:none;">');
        });
    };
    /**
     * Обновления списка печатей
     * @param {object} data - список
     */
    Libdoc_Offers_Controls_Seal.prototype.updateList = function (data)
    {
        this._select.empty();

        if (!data) {
            return;
        }

        for (var key in data) {
            this._select.append('<option value="' + key + '">' + data[key].title + '</option>');
            $('img[data-seal-id="' + key + '"]').attr('style', data[key].stamp.css).attr('src', data[key].stamp.url);
            $('img[data-signature-id="' + key + '"]').attr('style', data[key].signature.css).attr('src', data[key].signature.url);
        }
        this.showSeals();
    };
    /**
     * Показать выбраные печати
     */
    Libdoc_Offers_Controls_Seal.prototype.showSeals = function ()
    {
        var seals = this._offer._values['_']['seals'];
        var selectSelals = seals.split(',');
        $('[data-seal] img').hide();
        $('div[data-parent-seal]>div').hide();
        //если нет прав выходим
        if (!this._offer._access.signature) {
            $('div[data-parent-seal]>div.hide').show();
            return;
        }
        this._select.find('option').prop('selected', false);
        if (!seals) {
            $('div[data-parent-seal]>div.hide').show();
            return;
        }
        for (var i = 0; i < selectSelals.length; i++) {
            $('[data-seal="' + selectSelals[i] + '"] img').show();
            $('div[data-parent-seal="' + selectSelals[i] + '"]>div.show').show();
            this._select.find('option[value="' + selectSelals[i] + '"]').prop('selected', true);
        }
    };
    return Libdoc_Offers_Controls_Seal;
}(Libdoc_Offers_Controls_Modal));
/**
 * Легенда
 */
var Libdoc_Offers_Controls_Legend = (function (_super)
{
    __extends(Libdoc_Offers_Controls_Legend, _super);
    /**
     * Конструтор
     * @param {Libdoc_Offers_Abstract} offer - объект документа
     * @param {string} title - имя элемента
     */
    function Libdoc_Offers_Controls_Legend(offer)
    {
        _super.call(this, offer, 'Легенда');
    }
    /**
     * Заполнение панели
     */
    Libdoc_Offers_Controls_Legend.prototype.qwe = function ()
    {
        this._panel.addClass('legend');
        this._panel.append('<div style="margin-bottom: 10px;">\
        <table>\
            <col width="40px">\
            <col width="*">\
            <thead>\
                <tr>\
                    <th>Цвет</th>\
                    <th>Значение</th>\
                </tr>\
            </thead>\
            <tbody>\
                <tr>\
                    <td class="legend-dv-rq">&nbsp;</td>\
                    <td>незаполненое обязательное поле с автоматическим вводом</td>\
                </tr>\
                <tr>\
                    <td class="legend-dv">&nbsp;</td>\
                    <td>заполненое поле с автоматическим вводом</td>\
                </tr>\
                <tr>\
                    <td class="legend-cv-rq">&nbsp;</td>\
                    <td>незаполненое обязательное поле с ручным вводом</td>\
                </tr>\
                <tr>\
                    <td class="legend-cv">&nbsp;</td>\
                    <td>заполненое поле с ручным вводом</td>\
                </tr>\
                <tr>\
                    <td class="legend-cv-empty">&nbsp;</td>\
                    <td>незаполненое необязательное поле</td>\
                </tr>\
            </tbody>\
        </table>\
    </div>');
    };
    return Libdoc_Offers_Controls_Legend;
}(Libdoc_Offers_Controls_Modal));

var Libdoc_Offers_Controls_LeadId = (function (_super) {
    __extends(Libdoc_Offers_Controls_LeadId, _super);

    function Libdoc_Offers_Controls_LeadId(offer) {
        _super.call(this, offer, 'Лид ' + offer.leadId);
    }

    Libdoc_Offers_Controls_LeadId.prototype.createControl = function ()
    {
        if (this._offer._access.lead_id) {
            this._element = $(`<button type="button" value="${this._offer.leadId}" name="leadId">${this._title}</button>`);
        } else {
            this._element = $(`<input type="hidden" value="${this._offer.leadId}" name="leadId"/>`);
        }

        this._container.append(this._element);

        this._leadProjectIdElement = $(`<input type="hidden" value="${this._offer.leadProjectId}" name="leadProjectId"/>`);
        this._container.append(this._leadProjectIdElement);
    };

    Libdoc_Offers_Controls_LeadId.prototype.bindEvents = function ()
    {
        var self = this;
        this._element.on('click', function () {
            self.showDatatable();
        });
    }

    Libdoc_Offers_Controls_LeadId.prototype.showDatatable = function ()
    {
        var self = this;

        this.form = new AjaxForm(`
            <section class="filter-forms form-transition-white ajax-forms ajax-forms-normal lead-form">
                <form method="post">                        
                    <header style="margin-bottom: 0; border-bottom: none">
                        <h1>Выбор лида</h1>
                    </header>
                    
                    <iframe src="/sales-funnel/lead/filter-form/iframe?leadProjectId=${this._offer.leadProjectId}" width="100%" height="860" style="border: none"/>
                    
                    <footer>
                        <input type="button" data-form-button="save" value="выбрать"/>
                        <input type="button" data-form-button="drop" value="сбросить"/>
                        <input type="button" data-form-button="hide" value="закрыть"/>
                    </footer>
                </form>
            </section>
        `,
            {
                'width': 1050,
                'disableAjaxHandler': true,
                'hideOnEscape': false,
                'destroyOnHide': true,
                preBuildCallback: function(form, formBuilder) {
                    formBuilder.formButtonActions['save'] = self.save.bind(self);
                    formBuilder.formButtonActions['drop'] = self.drop.bind(self);
                },
                postBuildCallback: function (form) {
                    window.removeEventListener('message', self.eventMessageHandler.bind(self));
                    window.addEventListener('message', self.eventMessageHandler.bind(self));
                }
            });

        this.form.show();
    };

    Libdoc_Offers_Controls_LeadId.prototype.eventMessageHandler = function ()
    {
        if (event.data.msg === 'lead chosed') {
            this.form.leadId = event.data.leadId;
            this.form.leadProjectId = event.data.leadProjectId;
        } else if (event.data.msg === 'lead confirmed') {
            this.form.leadId = event.data.leadId;
            this.form.leadProjectId = event.data.leadProjectId;
            this.save();
        }
    };

    Libdoc_Offers_Controls_LeadId.prototype.info = function ()
    {
        this._offer.leadId = this.form.leadId;
        this._offer.leadProjectId = this.form.leadProjectId;
        this._element.text("Лид " + this.form.leadId);

        this.form.hide();
    };

    Libdoc_Offers_Controls_LeadId.prototype.drop = function ()
    {
        this._offer.leadId = 0;
        this._offer.leadProjectId = 0;
        this._element.text("Лид -не выбран-");

        this.form.hide();
    };

    return Libdoc_Offers_Controls_LeadId;
})(Libdoc_Offers_Controls_Button);
