require.config({
    paths: {
        'jqFieldDecorator': 'field_decorator',
        'jqChangeDetector': '/js/analitics/director-wage/plugin/changedetector',
        'jqLoadingBlock': 'analitics/director-wage/plugin/loadingblock'
    },
    shim: {
        'jqFieldDecorator': {
            exports: 'jqFieldDecorator'
        },
        'jqChangeDetector': {
            exports: 'jqChangeDetector'
        },
        'jqLoadingBlock': {
            exports: 'jqLoadingBlock'
        }
    }
});

var dependencies = [
    '/js/analitics/director-wage/messagewindow.js',
    '/js/analitics/director-wage/calendarform.js',
    'jqFieldDecorator',
    'jqChangeDetector',
    'jqLoadingBlock',
];

/**
 * @class класс формы редактирования корректировок
 * @param {Analitics_DirectorWage_Messagewindow} MessageWindow
 * @param {Analitics_DirectorWage_Calendarform} CalendarForm
 * @returns {correctionform_L31.Analitics_DirectorWage_Balance_Correctionform}
 */
define(dependencies, function (MessageWindow, CalendarForm) {
    function Analitics_DirectorWage_Balance_Correctionform(params)
    {
        var __self = this;
        
        this.userId = params.userId;

        this.afterHide = params.afterHide || function () {};

        this.rowCounter = 1;

        this.form = new MessageWindow({
            width: 500,
            destroyOnHide: false,
            postBuildCallback: function (form) {
                __self._renderForm(form);
            },
            hideCallback: function (form) {
                __self.afterHide(__self.hasChanges);
            }
        });

        /**
         * @type Analitics_DirectorWage_ExpenseTrasfer_Calendarform
         */
        this.calendar = new CalendarForm({
            calendar: {
                minDate: [2015, 3]
            }
        });
        // изменяем максимальную дату
        this.calendar.calendar.maxDate = [(new Date()).getFullYear() + 1, (new Date()).getMonth()];

        /**
         * @type Analitics_DirectorWage_Messagewindow
         */
        this.errorMessageWindow = new MessageWindow({width: 300});

        this.hasChanges = false;
    }

    /**
     * отображение формы
     * @returns {undefined}
     */
    Analitics_DirectorWage_Balance_Correctionform.prototype.show = function ()
    {
        this.form.ajaxForm.show();
    };

    /**
     * рендер формы, добавление внутреннего кода формы, настройка action формы
     * @param {AjaxForm} form
     * @returns {undefined}
     */
    Analitics_DirectorWage_Balance_Correctionform.prototype._renderForm = function (form)
    {
        var __self = this;
        form.title = "Управление корректировками";

        form.getDomObject().find('.js-message').html(this._getHtml());

        form.getDomObject().find('.js-row').each(function () {
            // добавление отслеживания изменений в строке
            $(this).changeDetector({
                "title": "есть несохранённые изменения"
            });
        });

        this.rowCounter++;

        this._bindEvents(form);
    };

    /**
     * создание событий для внутренностей формы
     * @param {AjaxForm} form
     * @returns {undefined}
     */
    Analitics_DirectorWage_Balance_Correctionform.prototype._bindEvents = function (form)
    {
        var __self = this;
        // кнопка сохранения строки
        this._getRowPlaceholder().on('click', '.js-save', function () {
            var id = $(this).closest('.js-row').data('id');
            __self.save(id);
        });

        // кнопка удаления строки
        this._getRowPlaceholder().on('click', '.js-remove', function () {
            var id = $(this).closest('.js-row').data('id');
            __self.delete(id);
        });

        // кнопка добавления новой строки
        form.getDomObject().find('.js-add-row').on('click', function () {
            __self.addRow();
        });

        // кнопка выбора начала действия опции
        this._getRowPlaceholder().on('click', '.js-calendar', function (event) {
            if ($(this).hasClass('js-inactive')) {
                return false;
            }

            var id = $(this).closest('.js-row').data('id');
            __self.showCalendar(id);

            event.preventDefault();
            return false;
        });
    };

    /**
     * получение html формы
     * @returns {String}
     */
    Analitics_DirectorWage_Balance_Correctionform.prototype._getHtml = function ()
    {
        var html = '';

        $.ajax({
           url: '/analitics/director-wage/balance/ajax/correction-form-html',
           type: 'POST',
           method: 'POST',
           data: {
               userId: this.userId
           },
           async: false
        }).done(function (data) {
            html = data;
        }).fail(function () {
            throw 'не удалось получить html формы редактирования корректировок сальдо';
        });

        return html;
    };

    /**
     * отображение календаря
     * @param {Number} id
     * @returns {undefined}
     */
    Analitics_DirectorWage_Balance_Correctionform.prototype.showCalendar = function (id)
    {
        var __self = this;

        this.calendar.onCalendarSelect = function (year, month)
        {
            __self._setDate(id, year, month);
        };

        this.calendar.show();
    };

    /**
     * установка даты в выбранную строку
     * @param {Number} id id строки
     * @param {Number} year год периода
     * @param {Number} month месяц периода
     * @returns {undefined}
     */
    Analitics_DirectorWage_Balance_Correctionform.prototype._setDate = function (id, year, month)
    {
        this._getRow(id).find('[name="year"]').val(year);
        this._getRow(id).find('[name="month"]').val(month);
        this._getRow(id).find('.js-calendar').text(this.calendar.calendar.getMonthName(month) + ' ' + year);
    };

    /**
     * добавление строки
     * @returns {undefined}
     */
    Analitics_DirectorWage_Balance_Correctionform.prototype.addRow = function ()
    {
        var __self = this;
        this.rowCounter++;
        var rowTemplate = $(this._getRowTemplate().html());
        rowTemplate.attr('data-id', this.rowCounter);

        rowTemplate.find('[name="summ"]').fieldDecorator({
            decorator: 'float'
        }).on('change', function (event) {
            var element = $(event.target);
            var cleanValue = element.val().replace(/[^\-\d\.\,]/g, '');
            var value = [];
            value[0] = cleanValue.replace(',', '.').split('.', 2)[0];
            if (cleanValue.replace(',', '.').split('.', 2).length > 1) {
                value[1] = cleanValue.replace(',', '.').split('.', 2)[1].replace('.', '');
            }

            element.val(value.join('.'));
        });

        rowTemplate.changeDetector({
            "title": "есть несохранённые изменения"
        });

        this._getRowPlaceholder().append(rowTemplate);
    };

    /**
     * получение шаблона строки
     * @returns {jQuery}
     */
    Analitics_DirectorWage_Balance_Correctionform.prototype._getRowTemplate = function ()
    {
        return this.form.ajaxForm.getDomObject().find('.js-row-template');
    };

    /**
     * получение элемента, в который будут вставляться строки
     * @returns {jQuery}
     */
    Analitics_DirectorWage_Balance_Correctionform.prototype._getRowPlaceholder = function ()
    {
        return this.form.ajaxForm.getDomObject().find('.js-row-placeholder');
    };

    /**
     * получение элемента строки
     * @returns {jQuery}
     */
    Analitics_DirectorWage_Balance_Correctionform.prototype._getRow = function (id)
    {
        return this._getRowPlaceholder().find('.js-row[data-id="' + id + '"]');
    };

    /**
     * сохранение опции
     * @param {Number} id
     * @returns {Promise}
     */
    Analitics_DirectorWage_Balance_Correctionform.prototype.info = function (id)
    {
        var __self = this;
        var row = __self._getRow(id);

        // инициализация блока с бегунком происходит здесь,
        // потому что только здесь можно быть уверенным в правильном расчёте размеров
        // здесь элемент виден
        row.loadingBlock();

        return new Promise(function (resolve, reject) {            

            row.loadingBlock('show');

            $.ajax({
                "url": "/analitics/director-wage/balance/ajax/save-correction",
                "method": "POST",
                "type": "POST",
                "data": __self.getData(id)
            }).done(function (data) {
                resolve(data);
            }).fail(function (jXHR, textStatus, errorThrown) {
                reject(jXHR.responseText);
            });
        }).then(function (data) {
            var error;
            if (!$.isPlainObject(data)) {
                error = data;
            } else if (data.success === false) {
                error = new Error(data.error);
            } else {
                return data;
            }

            if (error) {
                throw error;
            }
        }).then(function (data) {
            $.fn.changeDetector('initOriginal', row);
            $.fn.changeDetector('dropSelection', row);

            row.find('[name="id"]').val(data.id);
            row.find('[data-name="created_at"]').text(data.created_at);
            row.find('[data-name="created_by"]').text(data.created_by);

            row.find('.js-save').addClass('hide');
            row.find('.js-calendar').addClass('js-inactive');
            row.find('[name="summ"]').prop('disabled', 'disabled').addClass('inactive-input');

            row.loadingBlock('hide');

            __self.hasChanges = true;
        }).catch(function (error) {
            row.loadingBlock('hide');

            __self.showError(error);
        });
    };

    /**
     * получение информации по номеру строки
     * @param {Number} id
     * @returns {Object}
     */
    Analitics_DirectorWage_Balance_Correctionform.prototype.getData = function (id)
    {
        var row = this._getRow(id);
        var data = {
            "id": row.find('[name="id"]').val(),
            "summ": row.find('[name="summ"]').val(),
            "year": row.find('[name="year"]').val(),
            "month": row.find('[name="month"]').val(),
            "userId": this.userId
        };

        return data;
    };

    /**
     * отображение ошибки
     * @param {Error|String} error
     * @returns {undefined}
     */
    Analitics_DirectorWage_Balance_Correctionform.prototype.showError = function(error)
    {
        if (error instanceof Error) {
            this.errorMessageWindow.show('title' in error ? error.title : 'Ошибка сохранения корректировки ', error.message);
        } else {
            this.errorMessageWindow.show('Ошибка', error);
        }
    };

    /**
     * удаление опции
     * @param {Number} id
     * @returns {Promise}
     */
    Analitics_DirectorWage_Balance_Correctionform.prototype.delete = function (id)
    {
        var __self = this;
        var data = __self.getData(id);
        var row = __self._getRow(id);

        // инициализация блока с бегунком происходит здесь,
        // потому что только здесь можно быть уверенным в правильном расчёте размеров
        // здесь элемент виден
        row.loadingBlock();

        return new Promise(function (resolve, reject) {
            if (data.id > 0) {
                $.ajax({
                    "url": "/analitics/director-wage/balance/ajax/delete-correction",
                    "method": "POST",
                    "type": "POST",
                    "data": {
                        "id": data.id
                    }
                }).done(function (data) {
                    resolve(data);
                }).fail(function (jXHR, textStatus, errorThrown) {
                    reject(jXHR.responseText);
                });
            } else {
                resolve({success: true});
            }
        }).then(function (data) {
            var error;
            if (!$.isPlainObject(data)) {
                error = data;
            } else if (data.success === false) {
                error = new Error(data.error);
            }

            if (error) {
                throw error;
            }
        }).then(function (data) {
            row.loadingBlock('hide');
            row.loadingBlock('remove');            
            row.remove();

            __self.hasChanges = true;
        }).catch(function (error) {
            row.loadingBlock('hide');
            __self.showError(error);
        });
    };

    return Analitics_DirectorWage_Balance_Correctionform;
});