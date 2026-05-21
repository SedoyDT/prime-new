// var dependencies = [
//     '/js/analitics/director-wage/expense-transfer/view.js'
// ];
//
// /**
//  * @class форма для создания переходов расходов
//  * @param {Analitics_DirectorWage_ExpenseTransfer_View} View
//  * @returns {form_L8.Analitics_DirectorWage_ExpenseTransfer_Form}
//  */
// define(dependencies, function (View) {
import {View} from "./view";

var defaultOptions = {
    openButton : false,
    cashType   : 0,
    expenseType: 0,
    year       : 0,
    month      : 0
};

/**
 * конструктор
 * @param {Object} options
 * @property {Analitics_DirectorWage_ExpenseTransfer_View} view
 * @returns {form_L5.Analitics_DirectorWage_ExpenseTransfer_Form}
 */
export function Analitics_DirectorWage_ExpenseTransfer_Form(options)
{
    this.options = $.extend({}, defaultOptions, options);

    var disabledDate                          = {};
    disabledDate[parseInt(this.options.year)] = [parseInt(this.options.month)];

    for (var i in this.options.calendar.fixedDate) {
        var date  = this.options.calendar.fixedDate[i].split('-');
        var year  = parseInt(date[0]);
        var month = parseInt(date[1]);
        if (!(year in disabledDate)) {
            disabledDate[year] = [];
        }
        disabledDate[year].push(month);
    }
    delete this.options.calendar.fixedDate;
    this.options.calendar.disabledDate       = disabledDate;
    this.options.calendar.multiSelectEnabled = false;

    this.view = new View({
        buttons    : {
            'save': {
                'title'   : 'Сохранить',
                'class'   : '',
                'callback': function (form)
                {
                    this.save();
                }.bind(this)
            }
        },
        cashType   : this.options.cashType,
        expenseType: this.options.expenseType,
        year       : this.options.year,
        month      : this.options.month,
        calendar   : this.options.calendar
    });
}

/**
 * инициализация формы
 * @returns {undefined}
 */
Analitics_DirectorWage_ExpenseTransfer_Form.prototype.init = function ()
{
    this._bindEvents();
};

/**
 * создание событий
 * @returns {undefined}
 */
Analitics_DirectorWage_ExpenseTransfer_Form.prototype._bindEvents = function ()
{
    var __self = this;

    this.options.openButton.on('click', function (event)
    {
        __self.view.show();

        event.preventDefault();
        return false;
    });
};

/**
 * сохранение данных формы
 * @returns {undefined}
 */
Analitics_DirectorWage_ExpenseTransfer_Form.prototype.info = function ()
{
    var __self = this;
    return new Promise<void>(function (resolve, reject)
    {
        __self.view.form.ajaxForm.done(function (data, form)
        {
            form.hide();
            resolve();
        });

        __self.view.form.ajaxForm.error(function ()
        {
            reject();
        });

        __self.view.form.ajaxForm.submit();
    }).then(function ()
    {
        __self.options.onDone();
    });
};

//     return Analitics_DirectorWage_ExpenseTransfer_Form;
export const ExpenseTransferForm = Analitics_DirectorWage_ExpenseTransfer_Form;
// });
