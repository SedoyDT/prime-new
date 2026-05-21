define(["require", "exports", "./view"], function (require, exports, view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExpenseTransferForm = exports.Analitics_DirectorWage_ExpenseTransfer_Form = void 0;
    var defaultOptions = {
        openButton: false,
        cashType: 0,
        expenseType: 0,
        year: 0,
        month: 0
    };
    function Analitics_DirectorWage_ExpenseTransfer_Form(options) {
        this.options = $.extend({}, defaultOptions, options);
        var disabledDate = {};
        disabledDate[parseInt(this.options.year)] = [parseInt(this.options.month)];
        for (var i in this.options.calendar.fixedDate) {
            var date = this.options.calendar.fixedDate[i].split('-');
            var year = parseInt(date[0]);
            var month = parseInt(date[1]);
            if (!(year in disabledDate)) {
                disabledDate[year] = [];
            }
            disabledDate[year].push(month);
        }
        delete this.options.calendar.fixedDate;
        this.options.calendar.disabledDate = disabledDate;
        this.options.calendar.multiSelectEnabled = false;
        this.view = new view_1.View({
            buttons: {
                'save': {
                    'title': 'Сохранить',
                    'class': '',
                    'callback': function (form) {
                        this.save();
                    }.bind(this)
                }
            },
            cashType: this.options.cashType,
            expenseType: this.options.expenseType,
            year: this.options.year,
            month: this.options.month,
            calendar: this.options.calendar
        });
    }
    exports.Analitics_DirectorWage_ExpenseTransfer_Form = Analitics_DirectorWage_ExpenseTransfer_Form;
    Analitics_DirectorWage_ExpenseTransfer_Form.prototype.init = function () {
        this._bindEvents();
    };
    Analitics_DirectorWage_ExpenseTransfer_Form.prototype._bindEvents = function () {
        var __self = this;
        this.options.openButton.on('click', function (event) {
            __self.view.show();
            event.preventDefault();
            return false;
        });
    };
    Analitics_DirectorWage_ExpenseTransfer_Form.prototype.info = function () {
        var __self = this;
        return new Promise(function (resolve, reject) {
            __self.view.form.ajaxForm.done(function (data, form) {
                form.hide();
                resolve();
            });
            __self.view.form.ajaxForm.error(function () {
                reject();
            });
            __self.view.form.ajaxForm.submit();
        }).then(function () {
            __self.options.onDone();
        });
    };
    exports.ExpenseTransferForm = Analitics_DirectorWage_ExpenseTransfer_Form;
});
