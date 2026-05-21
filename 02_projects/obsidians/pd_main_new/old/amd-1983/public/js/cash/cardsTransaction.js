/**
 * @see application/modules/cash/views/scripts/planned/view.phtml
 */
/**
 * стандартный класс информации карт
 * Используется в:
 * /cash/money
 * /cash/planned/money
 * @returns {undefined}
 */
function cardsAbstract(params)
{
    /**===== минимальный набор методов ======**/
    // таблица {jQuery-object}
    this.table;
    // селектор для поиска таблицы
    this.tableSelector;
    // участвовать в  предпросмотре
    this.usePrepareTable;
    // транзакция
    this.newTransactionObject;
    // сохранненая информация по картам
    this.savedInterpretation;
    // значение примечания
    this.annotation;
    // данные по умолчанию
    this.defaultInterpretation = {
        annotation: '',
        check: '',
        client_bank: '',
        client_card_number: '',
        client_city: '',
        client_firstname: '',
        client_fullname_md5: '',
        client_id: '',
        client_lastname: '',
        client_middlename: '',
        file: '{}',
        trans_id: null,
        user_bank: '',
        user_card_number: '',
        user_city: '',
        user_firstname: '',
        user_id: '',
        user_lastname: '',
        user_middlename: '',
        user_transfer: ''
    };

    /**
     * уникальный id блока расшифровки
     */
    this._slideId;

    /**
     * Клиент транзакции пользователь, скрываем выбор сотрудника и чекбокс
     */
    this._clientIsUser;


    /**
     * чекбокс "Выдано/Получено на руки" обязательно, скрываем чекбокс
     */
    this._requiredCheckTr;

    /**
     * удаляем автодополнение
     * @returns {undefined}
     */
    this.annotationReplace = function ()
    {
        this.annotation.val(this.annotation.val().replace(/[\n\r]{0,}Выдано\/Получено на руки.+$/g, ''));
    };

    /**
     * Инициализация
     * @returns {undefined}
     */
    this.init = function ()
    {
        this.table = this.newTransactionObject.table || $(this.tableSelector);
        this._slideId = this.table.attr('id') + '-cardsInfo';
        this.annotation = this.table.find('#annotation');
        this.annotationReplace();
        //this.depotIdSelect = this.table.find('#depot_id');
        this._clientIsUser = parseInt(this.table.find('#transaction_type').val()) === 5;
        // бензин по заявке
        this._requiredCheckTr = parseInt(this.table.find('#transaction_type').val()) === 22;
        this.initFields();
        this.bind();
        this.getUsers();


        this.userSelect.val(this.savedInterpretation.user_id);
    };

    /**
     * Сохранение
     * @returns {undefined}
     */
    this.info = function ()
    {
        var errors = [];

        if (this.checkBox.is(':checked')) {

            if (this.userSelect.val() === '0') {
                errors.push('Укажите сотрудника');
            }
            if (this.newTransactionObject.access.cardsinfo === '1') {
                var fields = this.table.find('.cards-transaction input[value=][name]');

                if (fields.length) {
                    errors.push('Заполните поля информации по карте');
                } else {
                    this.table.find('.cards-transaction input[data-filter=card]').each(function (k, e)
                    {
                        var v = $(e).val();
                        //console.log(v);
                        if (v.length < 4) {
                            errors.push('Номер карты не может быть меньше 4 цифр');
                        }
                    });
                }
            }
        }
        if (!errors.length) {
            if (this.checkBox.is(':checked')) {
                this.annotationReplace();
                this.annotation.val(this.annotation.val() + '\r\nВыдано/Получено на руки: ' + this.userSelect.find('option:selected').text());
            }
            return true;
        }
        alert(errors.join('\n'));
        return false;
    };

    /**
     * уничтожение объекта
     * @returns {undefined}
     */
    this.destruct = function ()
    {
        $('#backButton').unbind('click', this.annotationReplace);
        this.destructFields();
    };

    /**
     * Сохраняем переданные параметры
     */
    if (typeof params === 'object') {
        for (var i in params) {
            this[i] = params[i];
        }
    }
    /**!===== минимальный набор методов ======**/

    /**
     * инициализация полей
     * @returns {undefined}
     */
    this.initFields = function ()
    {
        //console.log(this.savedInterpretation);
        this.savedInterpretation = $.extend(this.defaultInterpretation, this.savedInterpretation);
        var checked = (this.savedInterpretation.trans_id || this._clientIsUser || this._requiredCheckTr) ? ' checked="checked"' : '';

        var values = this.savedInterpretation;

        //строка чекбокса
        this.checkTr = $('<tr class="cards-transaction"><td><label for="ct_check">Выдано/Получено на руки</label></td>' +
                '<td><input type="checkbox" name="ct[check]" id="ct_check"' + checked + '></td></tr>');
        //чекбокс на руки
        this.checkBox = this.checkTr.find('#ct_check');

        //строка выбора сотрудника
        this.userTr = $('<tr class="cards-transaction"><td><label for"ct_user_id">Сотрудник</label></td><td><input type="text" id="userName" data-target-id="ct_user_id" style="margin: 0px 0px 7px 0px;"><br>' +
                '<select id="ct_user_id" name="ct[interpretation][user_id]" class="cashSelect"></select></td></tr>');
        //селект выбора сотрудника
        this.userSelect = this.userTr.find('#ct_user_id');
        //добавляем после клиента
        this.table.find('#client_id').parents('tr:first').after([this.checkTr, this.userTr]);
        //шапка информации карт
        this.interpretationHead = $('<tr class="interpretationHead cards-transaction" data-slide="true" data-children="' + this._slideId + '" style="display:none;"><td colspan="2"><a href="#" class="transcript">Информация по картам</a></td></tr>');
        //тело информации
        this.interpretationTr = $('<tr id="' + this._slideId + '" class="cards-transaction" style="display:none;"><td colspan="2"><table class="table-std table-md"><tbody>'
                + '<tr><th colspan="2" class="otherExpensesFiles">Сотрудник</th></tr>'
                + '<tr><td>Номер карты</td><td><input type="text" data-filter="card" name="ct[interpretation][user_card_number]" value="' + values['user_card_number'] + '"></td></tr>'
                + '<tr><td>Перевод</td><td><input type="hidden" name="ct[interpretation][user_transfer]" value="0"><input type="checkbox" value="1" name="ct[interpretation][user_transfer]"' + (parseInt(values['user_transfer']) ? ' checked="checked"' : '') + '></td></tr>'
                + '<tr><td>Фамилия</td><td><input type="text" name="ct[interpretation][user_lastname]" value="' + values['user_lastname'] + '"></td></tr>'
                + '<tr><td>Имя</td><td><input type="text" name="ct[interpretation][user_firstname]" value="' + values['user_firstname'] + '"></td></tr>'
                + '<tr><td>Отчество</td><td><input type="text" name="ct[interpretation][user_middlename]" value="' + values['user_middlename'] + '"></td></tr>'
                + '<tr><td>Банк</td><td><input type="text" name="ct[interpretation][user_bank]" value="' + values['user_bank'] + '"></td></tr>'
                + '<tr><td>Город банка</td><td><input type="text" name="ct[interpretation][user_city]" value="' + values['user_city'] + '"></td></tr>'

                + '<tr><th colspan="2" class="otherExpensesFiles">Клиент</th></tr>'
                + '<tr><td>Номер карты</td><td><input type="text" data-filter="card" name="ct[interpretation][client_card_number]" value="' + values['client_card_number'] + '"></td></tr>'
                + '<tr><td>Фамилия</td><td><input type="text" name="ct[interpretation][client_lastname]" value="' + values['client_lastname'] + '"></td></tr>'
                + '<tr><td>Имя</td><td><input type="text" name="ct[interpretation][client_firstname]" value="' + values['client_firstname'] + '"></td></tr>'
                + '<tr><td>Отчество</td><td><input type="text" name="ct[interpretation][client_middlename]" value="' + values['client_middlename'] + '"></td></tr>'
                + '<tr><td>Банк</td><td><input type="text" name="ct[interpretation][client_bank]" value="' + values['client_bank'] + '"></td></tr>'
                + '<tr><td>Город банка</td><td><input type="text" name="ct[interpretation][client_city]" value="' + values['client_city'] + '"></td></tr>'

                + '</tbody></table>'
                + '</td></tr>');

        //если нет доступа только чтение
        if (this.newTransactionObject.access.cardsinfo !== '1') {
            this.interpretationTr.find('input').attr('readonly', true);
        }

        //добавляем перед кнопкой сохранить
        this.table.find('tr:last').before([this.interpretationHead, this.interpretationTr]);
    };

    /**
     * вешаем обработчики
     * @returns {undefined}
     */
    this.bind = function ()
    {
        var _self = this;

        $('#backButton').click(function ()
        {
            _self.annotationReplace();
        });
        this.bindCardInput();

        //выбор на руки
        this.checkBox.change(function ()
        {
            if ($(this).is(':checked')) {
                _self.userTr.show();
                if (_self.newTransactionObject.access.cardsinfo === '1') {
                    _self.interpretationHead.show();
                    //_self.interpretationTr.show();
                }
            } else {
                _self.userTr.hide();
                _self.interpretationHead.hide();
                _self.interpretationTr.hide();
                _self.annotationReplace();
            }
        }).change();

        //поиск по сотрудникам
        this.table.find('#userName').keyup(function ()
        {
            var node = _self.userSelect.get(0);
            var options = node.options;
            var search = $(this).val().toLowerCase().replace(/^\s+|\s+$/, '');

            for (var i = 1; i < options.length; i++) {
                if (search.length && options[i].text.toLowerCase().indexOf(search) === -1) {
                    options[i].style.display = 'none';
                } else {
                    options[i].style.display = '';
                }
            }
        });

        if (this._clientIsUser) {
            this.table.find('#transport_claims').change(function ()
            {
                _self.userSelect.find('option[value="' + this.value + '"]').attr('selected', 'selected');
            });
            this.userTr.hide();
            this.checkTr.hide();
        }

        if (this._requiredCheckTr) {
            this.checkTr.hide();
        }
    };

    /**
     * События для маски номера карты
     * @returns {undefined}
     */
    this.bindCardInput = function ()
    {
        //поля карты
        var cardInputs = this.interpretationTr.find('[data-filter=card]');

        //фокус
        cardInputs.focus(function ()
        {
            var value = $(this).val();
            if (value.length < 16) {
                value = value + '___________________';
                value = value.substr(0, 16);
            }
            value = value.replace(/([\w]{4})(?!$)/g, '$1-');
            $(this).val(value);
            var pos = value.indexOf('_');
            if (pos !== -1) {
                this.setSelectionRange(pos, pos + 1);
            }
            return true;
        });
        //с фокус
        cardInputs.blur(function ()
        {
            var value = $(this).val();
            $(this).val(value.replace(/[^0-9]/g, ''));
        });

        //отлавливаем ввод
        cardInputs.keypress(function (event)
        {
            var currentField = $(this);
            var value = currentField.val();
            var select = {start: this.selectionStart, end: this.selectionEnd};
            value = value.replace(/[^0-9]/g, '');
            if ((value.length > 18 && !Math.abs(select.start - select.end)) || isNaN(parseInt(event.key))) {
                switch (event.keyCode) {
                    case 37:
                    case 39:
                    case 9:
                        break;
                    case 46:
                        if (select.start === select.end) {
                            select.end += 1;
                        }
                    case 8:
                        if (select.start === select.end) {
                            select.start -= 1;
                        }
                    case -33:
                        value = currentField.val();
                        value = value.substr(0, select.start) + value.substr(select.end);
                        value = value.replace(/[^0-9]/g, '');
                        if (value.length < 16) {
                            value = value + '___________________';
                            value = value.substr(0, 16);
                        }
                        value = value.replace(/([\w]{4})(?!$)/g, '$1-');
                        currentField.val(value);
                        this.setSelectionRange(select.start, select.start);
                    default:
                        event.preventDefault();
                }
            } else {
                value = currentField.val();
                value = value.substr(0, select.start) + '0' + value.substr(select.end);
                value = value.replace(/[^0-9]/g, '');
                if (value.length < 16) {
                    value = value + '___________________';
                    value = value.substr(0, 16);
                }
                value = value.replace(/([\w]{4})(?!$)/g, '$1-');
                currentField.val(value);
                if (value[select.start] === '-') {
                    select.start++;
                }
                this.setSelectionRange(select.start, select.start + 1);
            }
        });
    };

    /**
     * удаялем наши строки
     * @returns {undefined}
     */
    this.destructFields = function ()
    {
        this.table.find('.cards-transaction').remove();
    };

    /**
     * Перезаписывает пользователей в поле клиента
     */
    this.getUsers = function ()
    {
        var _self = this;
        this.userId = _self.userSelect.val();
        // Надо заполнить список сотрудниками
        $.ajax({
            async: false,
            type: 'POST',
            url: '/cash/ajax/getusers',
            //data: {'depotId': null}, //_self.depotIdSelect.val()},
            success: function (data)
            {
                _self.userSelect.html($(data));

                // Если установлен пользователь, то покажем его
                if (null !== _self.userId) {
                    _self.userSelect.val(_self.userId);
                }
            }
        });
    };

    this.getFormData = function ()
    {
        var table = this.interpretationTr;
        var data = {
            check: this.checkBox.is(':checked') ? 1 : 0,
            interpretation: {
                user_id: this.userSelect.val(),
                user_card_number: null,
                user_transfer: table.find('input[name="ct[interpretation][user_transfer]"]').is(':checked') ? 1 : 0,
                user_lastname: null,
                user_firstname: null,
                user_middlename: null,
                user_bank: null,
                user_city: null,
                client_card_number: null,
                client_lastname: null,
                client_firstname: null,
                client_middlename: null,
                client_bank: null,
                client_city: null
            }
        };

        for (var name in data.interpretation) {
            var input = table.find('input[type="text"][name="ct[interpretation][' + name + ']"]');
            if (input.length) {
                data.interpretation[name] = input.val();
            }
        }
        return data;
    };

}
