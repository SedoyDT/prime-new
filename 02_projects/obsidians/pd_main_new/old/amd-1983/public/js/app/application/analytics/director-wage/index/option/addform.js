define(["require", "exports", "../messagewindow", "../calendarform", "./containerfactory"], function (require, exports, messagewindow_1, calendarform_1, OptionContainerFactory) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OptionAddForm = exports.Analitics_DirectorWage_Option_AddForm = void 0;
    var defaultOptions = {
        width: 335,
        optionType: 0,
        onDone: function () {
        }
    };
    function Analitics_DirectorWage_Option_AddForm(options) {
        this.options = $.extend(true, {}, defaultOptions, options);
        var __self = this;
        this.formInitialized = false;
        this.form = new messagewindow_1.MessageWindow({
            buttons: {
                'save': {
                    'title': 'Сохранить',
                    'class': '',
                    'callback': function (form) {
                        __self.save();
                    }
                }
            },
            width: this.options.width,
            destroyOnHide: false,
            postBuildCallback: function (form) {
                __self._renderForm(form);
            }
        });
        this.calendar = new calendarform_1.CalendarForm({
            calendar: {
                minDate: [2015, 3]
            }
        });
        this.calendar.onCalendarSelect = function (year, month) {
            __self.setDate(year, month);
        };
    }
    exports.Analitics_DirectorWage_Option_AddForm = Analitics_DirectorWage_Option_AddForm;
    Analitics_DirectorWage_Option_AddForm.prototype.show = function () {
        this.form.ajaxForm.show();
    };
    Analitics_DirectorWage_Option_AddForm.prototype._renderForm = function (form) {
        if (!this.formInitialized) {
            var __self = this;
            form.title = "Добавление опции";
            form.getDomObject().find('.js-message').html(this._getHtml());
            this.formInitialized = true;
            form.getFormDomObject().attr('action', '/analitics/director-wage/ajax/add-option');
            form.getFormDomObject().attr('method', 'POST');
            this._bindEvents();
        }
    };
    Analitics_DirectorWage_Option_AddForm.prototype._bindEvents = function () {
        var __self = this;
        this.form.ajaxForm.getDomObject().find('input.owner_search').fieldDecorator({
            decorator: "search"
        });
        this.form.ajaxForm.getDomObject().find('input[name="value"]').fieldDecorator({
            decorator: "float"
        });
        this.form.ajaxForm.getDomObject().find('.js-calendar-button').on('click', function () {
            __self.calendar.show();
        });
    };
    Analitics_DirectorWage_Option_AddForm.prototype._getHtml = function () {
        var html = '';
        $.ajax({
            url: '/analitics/director-wage/ajax/get-add-form-option-html',
            type: 'POST',
            method: 'POST',
            data: {
                optionType: this.options.optionType
            },
            async: false
        }).done(function (data) {
            html = data;
        }).fail(function () {
            throw 'не удалось получить html формы добавления опции';
        });
        return html;
    };
    Analitics_DirectorWage_Option_AddForm.prototype.setDate = function (year, month) {
        this.form.ajaxForm.getDomObject().find('.js-calendar-button').text(this.calendar.calendar.getMonthName(month) + ' ' + year);
        this.form.ajaxForm.getDomObject().find('.js-addform-year').val(year);
        this.form.ajaxForm.getDomObject().find('.js-addform-month').val(month);
    };
    Analitics_DirectorWage_Option_AddForm.prototype.info = function () {
        var __self = this;
        return new Promise(function (resolve, reject) {
            __self.form.ajaxForm.done(function (data, form) {
                form.hide();
                resolve(data);
            });
            __self.form.ajaxForm.error(function () {
                reject();
            });
            __self.form.ajaxForm.submit();
        }).then(function (data) {
            __self.addRowInTable(data.rowHtml);
            __self.options.onDone();
        });
    };
    Analitics_DirectorWage_Option_AddForm.prototype.addRowInTable = function (html) {
        var optionContainerElement = $(html);
        var params = optionContainerElement.data('option-params');
        var optionContainer = OptionContainerFactory.create(optionContainerElement.data('container-type'), {
            container: optionContainerElement,
            type: params.type,
            ownerId: params.ownerId,
            value: params.value,
            additionalParams: params.additionalParams || {}
        });
        optionContainer.init();
        $(optionContainerElement).data('option-container', optionContainer);
        $('.js-option-container-placeholder[data-option-type="' + this.options.optionType + '"]').append(optionContainerElement);
    };
    exports.OptionAddForm = Analitics_DirectorWage_Option_AddForm;
});
