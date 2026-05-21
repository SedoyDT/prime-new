// require.config({
//     paths: {
//         'jqFieldDecorator': 'field_decorator',
//         'jqChangeDetector': 'analitics/director-wage/plugin/changedetector',
//         'jqLoadingBlock': 'analitics/director-wage/plugin/loadingblock'
//     },
//     shim: {
//         'jqFieldDecorator': {
//             exports: 'jqFieldDecorator'
//         },
//         'jqChangeDetector': {
//             exports: 'jqChangeDetector'
//         },
//         'jqLoadingBlock': {
//             exports: 'jqLoadingBlock'
//         }
//     }
// });
//
// var dependencies = [
//     '/js/analitics/director-wage/messagewindow.js',
//     '/js/analitics/director-wage/calendarform.js',
//     'jqFieldDecorator',
//     'jqChangeDetector',
//     'jqLoadingBlock'
// ];
//
// /**
//  * контейнер для управления опцией "проценты для расчёта зп пользователей"
//  * @param {type} MessageWindow
//  * @param {type} CalendarForm
//  * @returns {userwage_L21.Analitics_DirectorWage_Option_Container_Userwage}
//  */
// define(dependencies, function (MessageWindow, CalendarForm) {

import {MessageWindow} from "../../messagewindow";
import {CalendarForm} from "../../calendarform";
import "/js/field_decorator.js";
import "/js/analitics/director-wage/plugin/changedetector.js";
import "/js/analitics/director-wage/plugin/loadingblock.js";
import {IDirectorWageError} from "../../types";

/**
 *
 * @param {Object} params
 *
 * @property {Object} periods периоды
 * @property {Array} periods.periods массив периодов
 * @property {Array} periods.minDate минимальная дата
 * @property {Array} periods.maxDate максимальная дата
 *
 * @returns {userwage_L6.Analitics_DirectorWage_Option_Container_Userwage}
 */
export function Analitics_DirectorWage_Option_Container_Userwage(params)
{
    var __self = this;

    /**
     * @type Number
     */
    this.type = params.type;

    /**
     * @type Number
     */
    this.ownerId = params.ownerId;

    /**
     * @type jQuery
     */
    this.container = params.container;

    this.rowCounter = 0;

    this.formInitialized = false;
    this.form            = new MessageWindow({
        width            : 400,
        destroyOnHide    : false,
        postBuildCallback: function (form)
        {
            __self._renderForm(form);
        }
    });

    /**
     * @type Analitics_DirectorWage_ExpenseTrasfer_Calendarform
     */
    this.calendar = new CalendarForm({
        calendar     : {
            minDate            : [2015, 3],
            dateRestrictionMode: 1,
            additionalClass    : 'js-userwageoption-calendar'
        },
        messageWindow: {
            buttons           : {
                'unlimited': {
                    'title'   : 'без ограничений',
                    'class'   : 'js-unlimited-btn',
                    'callback': function (form)
                    {
                        form.hide();

                        __self.calendar.onCalendarSelect(null, null);
                    }
                }
            },
            beforeShowCallback: function (form)
            {
                __self.calendar.calendar.setDate(__self.calendar.calendar.curYear, __self.calendar.calendar.curMonth);
                __self.calendar.calendar.ctrlMonth();
                if (form.showUnlimitedBtn) {
                    form.getDomObject().find('.js-unlimited-btn').removeClass('hide');
                } else {
                    form.getDomObject().find('.js-unlimited-btn').addClass('hide');
                }
            }
        },
        hideCallback : function (from)
        {
            this.calendar.allowedDate = {};
        }
    });
    // изменяем максимальную дату
    this.calendar.calendar.maxDate = [(new Date()).getFullYear() + 1, (new Date()).getMonth()];

    /**
     * @type Analitics_DirectorWage_Messagewindow
     */
    this.errorMessageWindow = new MessageWindow({width: 300});

    /**
     * @property {Analitics_DirectorWage_Messagewindow} optionHistoryWindow окно для отображения истории изменения опции
     */
    this.optionHistoryWindow = new MessageWindow({width: 500});

    this.periods = {
        periods        : [],
        minDate        : [2015, 3],
        maxDate        : [(new Date()).getFullYear(), ((new Date()).getMonth() + 1)],
        unlimitedExists: false,

        /**
         * добавление периода
         * @param {Number} id
         * @param {Number} yearfrom
         * @param {Number} monthfrom
         * @param {Number} yearto
         * @param {Number} monthto
         * @returns {undefined}
         */
        addPeriod: function (id, yearfrom, monthfrom, yearto, monthto)
        {
            if (yearto == null || monthto == null
                || isNaN(yearto) || isNaN(monthto)
            ) {
                this.unlimitedExists = true;
                this.periods.push([parseInt(id), [parseInt(yearfrom), parseInt(monthfrom)], null]);
            } else {
                this.periods.push([parseInt(id), [parseInt(yearfrom), parseInt(monthfrom)], [parseInt(yearto), parseInt(monthto)]]);
            }
        },

        /**
         * удаление периода
         * @param {Number} id
         * @returns {undefined}
         */
        deletePeriod: function (id)
        {
            var index = this.findPeriodIndexById(id);
            if (index >= 0) {
                this.periods.splice(index, 1);
            }
        },

        /**
         * сортировка периодов по убыванию
         * @returns {undefined}
         */
        sortPeriods: function ()
        {
            this.periods.sort(function (a, b)
            {
                if (b[2] == null) {
                    return 1;
                } else if (a[2] == null) {
                    return -1;
                }

                if (a[2][0] < b[2][0]) {
                    return 1;
                } else if (a[2][0] > b[2][0]) {
                    return -1;
                }

                if (a[2][0] == b[2][0] && a[2][1] < b[2][1]) {
                    return 1;
                } else if (a[2][0] == b[2][0] && a[2][1] > b[2][1]) {
                    return -1;
                } else {
                    return 0;
                }
            });
        },

        /**
         * получение возможных дат для начала периода
         * @param {Number} id
         * @returns {Array}
         */
        getFromAllowedDates: function (id)
        {
            var index = this.findPeriodIndexById(id);
            if (index === -1) {
                return this.getFreeDates();
            }

            var previousPeriodExists = (index !== (this.periods.length - 1));
            var startDate            = this.minDate.slice();
            if (previousPeriodExists) {
                var prevPeriod = this.periods[index + 1][2].slice();
                startDate[0]   = (prevPeriod[1] + 1 > 12 ? prevPeriod[0] + 1 : prevPeriod[0]);
                startDate[1]   = (prevPeriod[1] + 1 > 12 ? 1 : prevPeriod[1] + 1);
            }
            var endDate = (this.periods[index][2] != null ? this.periods[index][2] : this.maxDate.slice());
            var dates   = [startDate.slice()];

            while (startDate[0] !== endDate[0] || startDate[1] !== endDate[1]) {
                if (++startDate[1] > 12) {
                    startDate[1] = 1;
                    startDate[0]++;
                }

                dates.push([startDate[0], startDate[1]]);
            }

            return dates;
        },

        /**
         * получение возможных дат для конца периода
         * @param {Number} id
         * @returns {Array}
         */
        getToAllowedDates: function (id)
        {
            var index = this.findPeriodIndexById(id);
            if (index === -1) {
                return this.getFreeDates();
            }

            var nextPeriodExists = (index !== 0 && this.periods.length > 1);
            var startDate        = this.periods[index][1].slice();
            var endDate          = this.maxDate.slice();
            if (nextPeriodExists) {
                var nextPeriod = this.periods[index - 1][1].slice();
                endDate[0]     = (nextPeriod[1] - 1 <= 0 ? nextPeriod[0] - 1 : nextPeriod[0]);
                endDate[1]     = (nextPeriod[1] - 1 <= 0 ? 12 : nextPeriod[1] - 1);
            }
            var dates = [startDate.slice()];

            while (startDate[0] !== endDate[0] || startDate[1] !== endDate[1]) {
                if (++startDate[1] > 12) {
                    startDate[1] = 1;
                    startDate[0]++;
                }

                dates.push([startDate[0], startDate[1]]);
            }

            return dates;
        },

        /**
         * получение свободных дат
         * @returns {Array}
         */
        getFreeDates: function ()
        {
            var startDate    = this.minDate.slice();
            var endDate      = this.maxDate.slice();
            var periodNumber = this.periods.length - 1;
            var dates        = [];
            while (startDate[0] < endDate[0] || startDate[0] === endDate[0] && startDate[1] <= endDate[1]) {
                if (periodNumber >= 0
                    && startDate[0] === this.periods[periodNumber][1][0]
                    && startDate[1] === this.periods[periodNumber][1][1]
                ) {
                    if (this.periods[periodNumber][2] == null) {
                        break;
                    }
                    startDate = this.periods[periodNumber][2].slice();
                    periodNumber--;
                } else {
                    dates.push([startDate[0], startDate[1]]);
                }

                if (++startDate[1] > 12) {
                    startDate[1] = 1;
                    startDate[0]++;
                }
            }

            return dates;
        },

        /**
         * получение индекса периода в массиве периодов
         * @param {Number} id
         * @returns {Number}
         */
        findPeriodIndexById: function (id)
        {
            return parseInt(this.periods.findIndex(function (element)
            {
                return element[0] === id;
            }));
        },

        /**
         * проверка даты на бесконечность
         * @param {Number} id
         * @returns {Boolean}
         */
        isUnlimited: function (id)
        {
            var index = this.findPeriodIndexById(id);
            return this.periods[index][2] == null;
        }
    };
}

/**
 * инициализация контейнера
 * @returns {undefined}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype.init = function ()
{
    this.getContainer().loadingBlock();
    this._bindEvents();
};

/**
 * формирование событий
 * @returns {undefined}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype._bindEvents = function ()
{
    var __self = this;

    this.getEditBtn().on('click', function ()
    {
        __self.getContainer().loadingBlock("show");
        __self.form.ajaxForm.show();
        __self.getContainer().loadingBlock("hide");
    });

    // обработка нажатия на ссылку в результате
    __self.getResultViewContainer().on('click', function (event)
    {
        __self.getContainer().loadingBlock("show");

        $.ajax({
            url   : '/analitics/director-wage/ajax/option-history',
            method: 'POST',
            type  : 'POST',
            data  : {
                type   : __self.type,
                ownerId: __self.ownerId
            }
        }).done(function (data)
        {
            __self.optionHistoryWindow.show('История изменения опции', data);
        }).fail(function (jXHR, textStatus, errorThrown)
        {
            __self.showError(jXHR.responseText);
        }).always(function ()
        {
            __self.getContainer().loadingBlock("hide");
        });

        event.preventDefault();
        return false;
    });
};

/**
 * получение кнопки для включения редактирования
 * @returns {jQuery}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype.getEditBtn = function ()
{
    return this.getContainer().find('.js-option-edit');
};

/**
 * получение главного DOM контейнера
 * @returns {jQuery}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype.getContainer = function ()
{
    return this.container;
};

/**
 * рендер формы, добавление внутреннего кода формы, настройка action формы
 * @param {AjaxForm} form
 * @returns {undefined}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype._renderForm = function (form)
{
    var __self = this;
    form.title = "Редактирование процентов";

    form.getDomObject().find('.js-message').html(this._getHtml());

    form.getDomObject().find('.js-row').each(function ()
    {
        var id        = $(this).data('id');
        var yearFrom  = $('[name="year_from"]', this).val();
        var monthFrom = $('[name="month_from"]', this).val();
        var yearTo    = $('[name="year_to"]', this).val();
        var monthTo   = $('[name="month_to"]', this).val();

        __self.periods.addPeriod(id, yearFrom, monthFrom, yearTo, monthTo);

        // добавление отслеживания изменений в строке
        $(this).changeDetector({
            "title"         : "есть несохранённые изменения",
            "onChangeAppear": function (row)
            {
                row.find('.js-option-save').removeClass('hide');
            },
            "onChangeCancel": function (row)
            {
                row.find('.js-option-save').addClass('hide');
            }
        });

        __self.rowCounter++;
    });
    __self.periods.sortPeriods();
    __self.sortRows();

    this._bindFormEvents(form);

    this.controlButtons();

    this.formInitialized = true;
};

/**
 * создание событий для внутренностей формы
 * @param {AjaxForm} form
 * @returns {undefined}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype._bindFormEvents = function (form)
{
    var __self = this;
    // кнопка сохранения строки
    this._getRowPlaceholder().on('click', '.js-option-save', function ()
    {
        var id = $(this).closest('.js-row').data('id');
        __self.save(id);
    });

    // кнопка удаления строки
    this._getRowPlaceholder().on('click', '.js-option-remove', function ()
    {
        var id = $(this).closest('.js-row').data('id');
        __self.delete(id);
    });

    // кнопка добавления новой строки
    form.getDomObject().find('.js-add-row').on('click', function ()
    {
        __self.addRow();
    });

    // кнопка выбора начала действия опции
    this._getRowPlaceholder().on('click', '.js-date-from', function (event)
    {
        if ($(this).hasClass('js-inactive')) {
            return false;
        }

        var id = $(this).closest('.js-row').data('id');
        __self.showCalendar(id, 0, __self.periods.getFromAllowedDates(id));

        event.preventDefault();
        return false;
    });

    // кнопка выбора конца действия опции
    this._getRowPlaceholder().on('click', '.js-date-to', function (event)
    {
        if ($(this).hasClass('js-inactive')) {
            return false;
        }

        var id = $(this).closest('.js-row').data('id');
        __self.showCalendar(id, 1, __self.periods.getToAllowedDates(id));

        event.preventDefault();
        return false;
    });
};

/**
 * получение html формы
 * @returns {String}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype._getHtml = function ()
{
    var html = '';

    $.ajax({
        url   : '/analitics/director-wage/ajax/get-user-wage-form-html',
        type  : 'POST',
        method: 'POST',
        data  : {
            ownerId: this.ownerId
        },
        async : false
    }).done(function (data)
    {
        html = data;
    }).fail(function ()
    {
        throw 'не удалось получить html формы редактирования процентов пользователя';
    });

    return html;
};

/**
 * отображение календаря
 * @param {Number} id
 * @param {Number} dateType - тип даты, 0 - начало периода, 1 - конец периода
 * @param {Array} allowedDates - разрешённые даты
 * @returns {undefined}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype.showCalendar = function (id, dateType, allowedDates)
{
    var __self = this;

    // деактивация недоступных дат
    for (var i = 0; i < allowedDates.length; i++) {
        this.calendar.calendar.addAllowedDate(allowedDates[i][0], allowedDates[i][1]);
    }

    // кнопка с возможностью выставления неограниченного периода может быть только у первого периода
    if (dateType === 1 && this.periods.findPeriodIndexById(id) === 0) {
        this.calendar.window.ajaxForm.showUnlimitedBtn = true;
    } else {
        this.calendar.window.ajaxForm.showUnlimitedBtn = false;
    }

    this.calendar.onCalendarSelect = function (year, month)
    {
        __self._setDate(id, dateType, year, month);
    };

    if (allowedDates.length > 0) {
        this.calendar.calendar.curYear  = allowedDates[0][0];
        this.calendar.calendar.curMonth = allowedDates[0][1];
    }
    this.calendar.show();
};

/**
 * установка даты в выбранную строку
 * @param {Number} id id строки
 * @param {Number} dateType тип даты, 0 - начало периода, 1 - конец периода
 * @param {Number} year год периода
 * @param {Number} month месяц периода
 * @returns {undefined}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype._setDate = function (id, dateType, year, month)
{
    var periodIndex = this.periods.findPeriodIndexById(id);
    if (periodIndex === -1) {
        this.periods.addPeriod(id, year, month, year, month);
        this.form.ajaxForm.getDomObject().find('[data-id="' + id + '"] [name="year_from"]').val(year).trigger('change');
        this.form.ajaxForm.getDomObject().find('[data-id="' + id + '"] [name="month_from"]').val(month).trigger('change');
        this.form.ajaxForm.getDomObject().find('[data-id="' + id + '"] .js-date-from').text(this.calendar.calendar.getMonthName(month) + ' ' + year);
        this.form.ajaxForm.getDomObject().find('[data-id="' + id + '"] [name="year_to"]').val(year).trigger('change');
        this.form.ajaxForm.getDomObject().find('[data-id="' + id + '"] [name="month_to"]').val(month).trigger('change');
        this.form.ajaxForm.getDomObject().find('[data-id="' + id + '"] .js-date-to').text(this.calendar.calendar.getMonthName(month) + ' ' + year);
    } else if (dateType === 0) {
        this.periods.periods[periodIndex][1] = [parseInt(year), parseInt(month)];
        this.form.ajaxForm.getDomObject().find('[data-id="' + id + '"] [name="year_from"]').val(year).trigger('change');
        this.form.ajaxForm.getDomObject().find('[data-id="' + id + '"] [name="month_from"]').val(month).trigger('change');
        this.form.ajaxForm.getDomObject().find('[data-id="' + id + '"] .js-date-from').text(this.calendar.calendar.getMonthName(month) + ' ' + year);
    } else if (dateType === 1 && year != null && month != null) {
        this.periods.periods[periodIndex][2] = [parseInt(year), parseInt(month)];
        this.periods.unlimitedExists         = false;
        this.form.ajaxForm.getDomObject().find('[data-id="' + id + '"] [name="year_to"]').val(year).trigger('change');
        this.form.ajaxForm.getDomObject().find('[data-id="' + id + '"] [name="month_to"]').val(month).trigger('change');
        this.form.ajaxForm.getDomObject().find('[data-id="' + id + '"] .js-date-to').text(this.calendar.calendar.getMonthName(month) + ' ' + year);
    } else {
        this.periods.periods[periodIndex][2] = null;
        this.periods.unlimitedExists         = true;
        this.form.ajaxForm.getDomObject().find('[data-id="' + id + '"] [name="year_to"]').val(null).trigger('change');
        this.form.ajaxForm.getDomObject().find('[data-id="' + id + '"] [name="month_to"]').val(null).trigger('change');
        this.form.ajaxForm.getDomObject().find('[data-id="' + id + '"] .js-date-to').text('-');
    }

    this.periods.sortPeriods();

    this.controlButtons();
};

/**
 * Управление отображением, активностью кнопок
 * @returns {undefined}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype.controlButtons = function ()
{
    for (var index in this.periods.periods) {
        var rowId = this.periods.periods[index][0];
        // несохранённую строку не трогаем
        if (this._getRow(rowId).find('[name="id"]').val() == 0) {
            continue;
        }

        if (index as any == 0 || index as any == this.periods.periods.length - 1) {
            this._getRow(rowId).find('.js-date-to, .js-date-from').removeClass('js-inactive inactive');
            this._getRow(rowId).find('.js-option-remove').removeClass('hide');
        } else {
            this._getRow(rowId).find('.js-date-to, .js-date-from').addClass('js-inactive inactive');
            this._getRow(rowId).find('.js-option-remove').addClass('hide');
        }
    }
};

/**
 * сортировка строк по периодам, по убыванию
 * @returns {undefined}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype.sortRows = function ()
{
    for (var i in this.periods.periods) {
        var row = this._getRow(this.periods.periods[i][0]);
        this._getRowPlaceholder().prepend(row);
    }
};

/**
 * добавление строки
 * @returns {undefined}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype.addRow = function ()
{
    var __self = this;
    this.rowCounter++;
    var rowTemplate = $(this._getRowTemplate().html());
    rowTemplate.attr('data-id', this.rowCounter);

    rowTemplate.find('[name="value"]').fieldDecorator({
        decorator: 'float'
    }).on('change', function (event)
    {
        var element    = $(event.target);
        var cleanValue = element.val().replace(/[^\d\.\,]/g, '');
        var value      = [];
        value[0]       = cleanValue.replace(',', '.').split('.', 2)[0];
        if (cleanValue.replace(',', '.').split('.', 2).length > 1) {
            value[1] = cleanValue.replace(',', '.').split('.', 2)[1].replace('.', '');
        }

        element.val(value.join('.'));
    });

    rowTemplate.changeDetector({
        "title"         : "есть несохранённые изменения",
        "onChangeAppear": function (row)
        {
            row.find('.js-option-save').removeClass('hide');
        },
        "onChangeCancel": function (row)
        {
            row.find('.js-option-save').addClass('hide');
        }
    });

    this._getRowPlaceholder().append(rowTemplate);
};

/**
 * получение шаблона строки
 * @returns {jQuery}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype._getRowTemplate = function ()
{
    return this.form.ajaxForm.getDomObject().find('.js-row-template');
};

/**
 * получение элемента, в который будут вставляться строки
 * @returns {jQuery}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype._getRowPlaceholder = function ()
{
    return this.form.ajaxForm.getDomObject().find('.js-row-placeholder');
};

/**
 * получение элемента строки
 * @returns {jQuery}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype._getRow = function (id)
{
    return this._getRowPlaceholder().find('.js-row[data-id="' + id + '"]');
};

/**
 * получение контейнера для отображения значения элемента
 * @returns {jQuery}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype.getResultViewContainer = function ()
{
    return this.getContainer().find('.js-option-result-result');
};

/**
 * сохранение опции
 * @param {Number} id
 * @returns {Promise}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype.info = function (id)
{
    var __self = this;
    var row    = __self._getRow(id);

    this._getRowPlaceholder().loadingBlock();

    return new Promise(function (resolve, reject)
    {
        if (__self.periods.findPeriodIndexById(id) === -1) {
            throw new Error('Укажите период действия опции');
        }

        __self._getRowPlaceholder().loadingBlock('show');

        $.ajax({
            "url"   : "/analitics/director-wage/ajax/save-option",
            "method": "POST",
            "type"  : "POST",
            "data"  : __self.getData(id)
        }).done(function (data)
        {
            resolve(data);
        }).fail(function (jXHR, textStatus, errorThrown)
        {
            reject(jXHR.responseText);
        });
    }).then(function (data: any)
    {
        var error;
        if (!$.isPlainObject(data)) {
            error = data;
        } else if (data.success === false) {
            error = new Error(data.error);
        } else {
            return data.id;
        }

        if (error) {
            throw error;
        }
    }).then(function (optionId)
    {
        row.find('[name="id"]').val(optionId);
        $.fn.changeDetector('initOriginal', row);
        $.fn.changeDetector('dropSelection', row);

        __self.sortRows();
        __self._showViewResult();
        __self._getRowPlaceholder().loadingBlock('hide');
    }).catch(function (error)
    {
        __self._getRowPlaceholder().loadingBlock('hide');

        __self.showError(error);
    });
};

/**
 * получение информации по номеру строки
 * @param {Number} id
 * @returns {Object}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype.getData = function (id)
{
    var row  = this._getRow(id);
    var data = {
        'id'     : row.find('[name="id"]').val(),
        'type'   : this.type,
        'ownerId': this.ownerId,
        'value'  : row.find('[name="value"]').val()
    };

    var periodIndex = this.periods.findPeriodIndexById(id);
    if (periodIndex !== -1) {
        var period       = this.periods.periods[this.periods.findPeriodIndexById(id)];
        data['dateFrom'] = period[1].join('-') + '-01';
        if (period[2] != null) {
            data['dateTo'] = period[2].join('-') + '-01';
        }
    }

    return data;
};

/**
 * отображение ошибки
 * @param {Error|String} error
 * @returns {undefined}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype.showError = function (error: IDirectorWageError)
{
    if (error instanceof Error) {
        this.errorMessageWindow.show('title' in error ? error.title : 'Ошибка сохранения опции ', error.message);
    } else {
        this.errorMessageWindow.show('Ошибка', error);
    }
};

/**
 * удаление опции
 * @param {Number} id
 * @returns {Promise}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype.delete = function (id)
{
    var __self = this;
    var data   = __self.getData(id);
    var row    = __self._getRow(id);

    this._getRowPlaceholder().loadingBlock();

    return new Promise(function (resolve, reject)
    {
        if (data.id > 0) {
            __self._getRowPlaceholder().loadingBlock('show');

            $.ajax({
                "url"   : "/analitics/director-wage/ajax/delete-option",
                "method": "POST",
                "type"  : "POST",
                "data"  : {
                    "id": data.id
                }
            }).done(function (data)
            {
                resolve(data);
            }).fail(function (jXHR, textStatus, errorThrown)
            {
                reject(jXHR.responseText);
            });
        } else {
            resolve({success: true});
        }
    }).then(function (data: any)
    {
        var error;
        if (!$.isPlainObject(data)) {
            error = data;
        } else if (data.success === false) {
            error = new Error(data.error);
        }

        if (error) {
            throw error;
        }
    }).then(function (data)
    {
        __self._getRowPlaceholder().loadingBlock('hide');
        __self._getRowPlaceholder().loadingBlock('remove');
        __self.periods.deletePeriod(id);
        row.remove();
        __self.controlButtons();
        __self._showViewResult();
    }).catch(function (error)
    {
        __self._getRowPlaceholder().loadingBlock('hide');
        __self.showError(error);
    });
};

/**
 * формирование значения для режима отображения
 * @returns {undefined}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype._showViewResult = function ()
{
    var curYear  = (new Date()).getFullYear();
    var curMonth = (new Date()).getMonth() + 1;
    var value    = '-';
    var date     = '-';

    var period = this.periods.periods[0];
    if (period
        && (
            period[2] == null
            || period[2][0] >= curYear && period[2][1] >= curMonth
        )
    ) {
        var id = period[0];
        value  = this._getRow(id).find('[name="value"]').val();
        date   = period[1][0] + '.' + (period[1][1] + '').padStart(2, '0');
    }

    this.getDateBlock().text(date);
    this.getResultViewContainer().text(value);
};

/**
 * получение блока с датой
 * @returns {jQuery}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype.getDateBlock = function ()
{
    return this.getContainer().find('.js-option-date');
};

/**
 * получение контейнера для отображения значения элемента
 * @returns {jQuery}
 */
Analitics_DirectorWage_Option_Container_Userwage.prototype.getResultViewContainer = function ()
{
    return this.container.find('.js-option-result-result');
};

// return Analitics_DirectorWage_Option_Container_Userwage;
export const UserWageContainer = Analitics_DirectorWage_Option_Container_Userwage;
// });
