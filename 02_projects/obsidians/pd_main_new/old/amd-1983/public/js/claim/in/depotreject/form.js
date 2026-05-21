/// <reference path="../../../receipt/ts/_d/interfaces.d.ts" />
/// <reference path="../../../receipt/ts/_d/ajaxform.d.ts" />
/// <reference path="main.ts" />
/**
 * Форма для красного склада
 */
var Claim_In_DepotReject_Form = /** @class */ (function ()
{
    /**
     * @constructor
     * @param {} params
     * @returns {Claim_In_DepotReject_Form}
     */
    function Claim_In_DepotReject_Form(params)
    {
        /**
         *
         * @type {Claim_In_DepotReject_Main}
         */
        this._parent = undefined;

        /**
         * AjaxFrom
         * @type {AjaxFrom}
         */
        this._form = undefined;

        /**
         * Список товаров
         * @type {{}}
         */
        this._productList = {};

        /**
         * Информация по товарам
         * @type {{}}
         */
        this._itemsInfo = {};

        /**
         * Список менеджеров
         * @type {{}}
         */
        this._users = undefined;

        /**
         * Данные по товарам
         * @type {{}}
         */
        this._data = {};

        this._parent = params.parent;
        this._form = new AjaxForm(this._getFormCode(), this._getFormParams());

        this._searchForm = new Claim_In_DepotReject_FromSearch();
    }

    /**
     * Показать форму
     * @param {} data
     * @returns {void}
     */
    Claim_In_DepotReject_Form.prototype.show = function (data)
    {
        this._data = data;
        this._form.show();
    };

    /**
     * Сохранить
     * @param {string} claimId
     * @param {{}} data
     * @returns {void}
     */
    Claim_In_DepotReject_Form.prototype.info = function (claimId, data, async)
    {
        if (async === void 0) {
            async = true;
        }
        var _self = this;

        this.show(data);
        this._form.ajax({
            url: '/claim/in/save-depot-reject',
            data: {claimId: claimId, data: data},
            dataType: 'json',
            type: 'POST',
            async: async,
            success: function ()
            {
                _self._form.hide();
            }
        }, {});
    };

    /**
     * Получить код формы
     * @returns {string}
     */
    Claim_In_DepotReject_Form.prototype._getFormCode = function ()
    {
        var head = '<th>№</th><th>Id</th><th>Сумма</th><th>Транспорт</th>';

        for (var fieldKey in _configFields) {
            head += "<th>" + _configFields[fieldKey].title + "</th>";
        }
        head += '<th>Выполнить до</th><th>Ответственный сотрудник</th><th>Cумма штрафа</th>';

        return "<section>\n                    <form>\n                        <header>\n                            <h1>\u041A\u0440\u0430\u0441\u043D\u044B\u0439 \u0441\u043A\u043B\u0430\u0434: \u0440\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C \u0442\u043E\u0432\u0430\u0440</h1>\n                        </header>\n\n                        <article>\n                            <table class=\"table-std\">\n                                <thead><tr>" + head + "</tr></thead>\n                                <tbody></tbody>\n                            </table>\n                        </article>\n\n                        <footer>\n                            <input data-form-button=\"submit\" value=\"\u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C\" class=\"amd-btn amd-btn_primary\" type=\"button\">\n                            <input data-form-button=\"hide\" value=\"\u0437\u0430\u043A\u0440\u044B\u0442\u044C\" class=\"amd-btn amd-btn_primary\" type=\"button\">\n                        </footer>\n                    </form>\n                </section>";
    };

    /**
     * Получить параметры формы
     * @returns {AjaxFormParams}
     */
    Claim_In_DepotReject_Form.prototype._getFormParams = function ()
    {
        var _self = this;

        return {
            width: 1200,
            style: 'strict',
            destroyOnHide: false,
            hideOnEscape: true,
            postBuildCallback: function (form)
            {
                form.validation.append(function ()
                {
                    var rexDate = /^\d\d\.\d\d\.\d{4}$/;
                    var error = false;

                    form.getDomObject().find('tbody tr').each(function (i, e)
                    {
                        var tr = $(e);
                        var transport = tr.find('.depot-reject__transport');
                        var user = tr.find('.depot-reject__user');
                        var date = tr.find('.depot-reject__date');

                        if (!transport.val() && !+user.val() && !date.val()) {
                            return;
                        }

                        if (!rexDate.test(date.val()) || !+user.val() || isNaN(parseFloat(transport.val()))) {
                            e.style.background = 'rgba(255,0,0,0.1)';
                            error = true;
                        } else {
                            e.style.background = '';
                        }
                    });

                    return error ? 'Проверьте введенные данные' : true;
                });

                form.submit(function ()
                {
                    if (form.validate()) {
                        var result = {};
                        var formData = form.getFormDomObject().serializeArray();
                        for (var _i = 0, formData_1 = formData; _i < formData_1.length; _i++) {
                            // если нет данных, то пропускаем
                            if (!formData_1[_i].value || '0' == formData_1[_i].value) {
                                continue;
                            }

                            var fieldData = formData_1[_i];
                            var names = fieldData.name.replace(/]/g, '').split('[');
                            var _number = names[1];
                            var _key = names[2];

                            if (!result[_number]) {
                                result[_number] = _self._data[_number];
                            }

                            result[_number][_key] = fieldData.value;
                        }
                        _self._parent.apply(result);
                        form.hide();
                    }

                    return false;
                });

                form.setShowCallback(function ()
                {
                    var errors = [];
                    _self._productList = _self._parent.getProductsData();
                    //                    _self._rentPrice = _self._parent.getRentPrice();
                    if (!_self._checkSum()) {
                        errors.push('У одного или нескольких товаров не указана сумма');
                    }

                    if (errors.length) {
                        alert(errors.join('\n'));
                        form.hide();
                        return;
                    }

                    form.ajax({
                        url: '/claim/in/get-depot-reject-info',
                        dataType: 'json',
                        data: {products: _self._getProductIds()},
                        type: 'POST',
                        success: function (data)
                        {
                            _self._itemsInfo = data.itemsInfo;
                            _self._users = data.users;
                            _self._appendData();



                            if (!_self._parent.isEdit()) {
                                form.getDomObject().find('[data-form-button="submit"]').hide();
                            } else {
                                form.getDomObject().find('.depot-reject__date').datepicker({duration: 'fast', showAnim: 'fadeIn', minDate: new Date()});
                                form.getDomObject().find('.depot-reject__transport')
                                        .change(function ()
                                        {
                                            console.log(this);
                                            var _number = this.dataset.number;
                                            var fieldSum = $(this).closest('tr').find('.depot-reject__total-sum');

                                            _self._data[_number].transport = this.value;
                                            _self._data[_number].total_sum = +_self._data[_number].transport + _self._data[_number].sum;
                                            fieldSum.html(_self._data[_number].total_sum);
                                        })
                                        .fieldDecorator({decorator: 'float'});

                                form.getDomObject().find('.depot-reject__clear').click(function ()
                                {
                                    var tr = $(this).closest('tr');
                                    var _number = tr.data('number');

                                    tr.find('input, select').val('');

                                    _self._data[_number].date = '';
                                    _self._data[_number].total_sum = _self._data[_number].sum;
                                    _self._data[_number].transport = '';

                                    $(this).closest('tr').find('.depot-reject__total-sum').html(_self._data[_number].total_sum);

                                    return false;
                                });

                                form.getDomObject().find('.depot-reject__user-search').click(function ()
                                {
                                    var options = [];
                                    var tr = $(this).closest('tr');
//                                    var _number = tr.data('number');
                                    var userSelect = tr.find('select');

                                    for (var _i = 0; _i < _self._users.sort.length; _i++) {
                                        var userId = String(_self._users.sort[_i]);
                                        options.push({id: userId, text: _self._users.data[userId]});
                                    }

                                    _self._searchForm.show(options, function (id)
                                    {
//                                        _self._data[_number].user_id = id;
                                        userSelect.val(id);
                                    });

                                    return false;
                                });
                            }
                        },
                        error: function ()
                        {
                            form.hide();
                        }
                    }, {});
                });
            }
        };
    };

    /**
     * Проверить суммы товаров
     * @returns {boolean}
     */
    Claim_In_DepotReject_Form.prototype._checkSum = function ()
    {
        for (var _number in this._productList) {
            if (!parseFloat(this._productList[_number].sum)) {
                return false;
            }
        }
        return true;
    };

    /**
     * Добавить данные в форму
     * @returns {void}
     */
    Claim_In_DepotReject_Form.prototype._appendData = function ()
    {
        var table = this._form.getDomObject().find('tbody');
        var content = '';
        var oldData = this._data;
        var isEdit = this._parent.isEdit();

        this._data = {};
        for (var _number in this._productList) {
            var itemId = this._productList[_number].itemId;
            var info = this._itemsInfo[itemId];
            var sum = parseFloat(this._productList[_number].sum);
            var transport = oldData[_number] && oldData[_number].transport ? +oldData[_number].transport : '';
            var data = {
                date: oldData[_number] && oldData[_number].date ? oldData[_number].date : '',
                user_id: oldData[_number] && oldData[_number].user_id ? oldData[_number].user_id : '',
                sum: sum,
                transport: transport,
                total_sum: sum + +transport
            };

            content += "<tr data-number=\"" + _number + "\">" + (isEdit ? this._getRowEdit(_number, info, data) : this._getRowShow(_number, info, data)) + "</tr>";
            this._data[_number] = data;
        }

        table.html(content);
    };

    Claim_In_DepotReject_Form.prototype._getRowEdit = function (_number, info, data)
    {
        var row = "<td>" + _number + "</td><td>" + info.id + "</td><td>" + data.sum + '</td>\n\
                   <td><input data-number="' + _number + '" class=\"depot-reject__transport\" type="text" name="data[' + _number + '][transport]" value="' + data.transport + '" size=\"4\"></td>';

        for (var fieldKey in _configFields) {
            row += "<td>" + (info[fieldKey] || '') + "</td>";
        }

        row += "<td><input type=\"text\" name=\"data[" + _number + "][date]\" class=\"depot-reject__date\" size=\"10\" value=\"" + data.date + "\"></td>\n\
                <td><div style=\"display: flex;justify-content: space-between;align-items: baseline;\"><select name=\"data[" + _number + "][user_id]\" class=\"depot-reject__user\">" + this._getUserOptions(data.user_id) + "</select><a href=\"#\" class=\"depot-reject__user-search\"><span class=\"fa fa-search\"></span></a></div></td>\n\
                <td><span  class=\"depot-reject__total-sum\">" + data.total_sum + '</span><a href="#" class="depot-reject__clear"><span class="fa fa-trash"></span></a></td>';

        return row;
    };

    Claim_In_DepotReject_Form.prototype._getRowShow = function (_number, info, data)
    {
        var row = "<td>" + _number + "</td><td>" + info.id + "</td><td>" + data.sum + '</td><td>' + data.transport + '</td>';
        var user = this._users.data[data.user_id] ? this._users.data[data.user_id] : '';

        for (var fieldKey in _configFields) {
            row += "<td>" + (info[fieldKey] || '') + "</td>";
        }

        row += "<td>" + data.date + "</td><td>" + user + "</td><td>" + data.total_sum + "</td>";

        return row;
    };

    /**
     * Получить список id товаров
     * @returns {string[]}
     */
    Claim_In_DepotReject_Form.prototype._getProductIds = function ()
    {
        var result = [];

        for (var _number in this._productList) {
            result.push(this._productList[_number].itemId);
        }
        return result;
    };

    /**
     * Получить список менеджеров для выбора
     * @param {string} user
     * @returns {string}
     */
    Claim_In_DepotReject_Form.prototype._getUserOptions = function (user)
    {
        var options = '';

        for (var _i = 0, _a = this._users.sort; _i < _a.length; _i++) {
            var userId = _a[_i];
            options += "<option value=\"" + userId + "\" " + (userId == user ? 'selected="selected"' : '') + ">" + this._users.data[userId] + "</option>";
        }

        return options;
    };

    return Claim_In_DepotReject_Form;
}());
