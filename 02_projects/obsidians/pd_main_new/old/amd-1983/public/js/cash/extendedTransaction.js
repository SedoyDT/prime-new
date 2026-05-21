/**
 * используется
 * @see application/modules/cash/views/scripts/cash/fileparser.phtml
 */
/**
 * Базовый класс для всех расширенных транзакций
 * @param int type - id типа транзакции
 */

var clientsInterpretationList = [];

/**
 * Тип кассы
 *
 * @type type
 */
var cashType;

/**
 * Класс для обработки интерфейса транзакций, имеющих расшифровку (транспорт, расходники)
 *
 * @param params - обязательные параметры: claimSelect (флажки типа "Транспорт есть"/"Транспорта нет" с метками к ним), сообщения об ошибках
 * @returns {WithInterpretation}
 */
class WithInterpretation
{
    constructor(params)
    {

        // Метка, к. показывается в списке выбора заявок при поиске (когда данных еще нет)
        this.selectEmpty = '<option value="0">Загрузка данных...</option>';

        // Метка, к. показывается в случае, если не найдено ни одной заявки по данным условиям
        this.dataNotFound = '<option value="0">Заявки не найдены</option>';

        // Шапка расшифровки
        this.trInterpretation = '<tr class="interpretation"><td colspan="2" style="background-color: #3c698e; border: 1px solid #FFFFFF;'
            + 'color: #FFFFFF; font-size: 10pt; font-weight: bold; padding: 8px; text-align: center;">'
            + 'Расшифровка</td></tr>';

        this.addImg = '<img height="16" border="0" width="16" title="добавить" alt="добавить"'
            + ' rel="add" style="margin-left: 5px;" class="helpButton" src="/img/system/add.png" />';

        this.deleteImg = '<img height="16" border="0" width="16" title="удалить" alt="удалить"'
            + ' rel="delete" style="margin-left: 5px;" class="helpButton" src="/img/system/del.png" />';

        this.interpretationOpenImg  = '<img src="/img/system/fieldsShowF.png" width="20" height="20" class="interpretationImg" rel="open" alt="" title="Расшифровать транзакцию" />';
        this.interpretationCloseImg = '<img src="/img/system/fieldsCloseF.png" width="20" height="20" class="interpretationImg" rel="close" alt="" title="Отменить расшифровку" />';

        // Счетчик кол-ва списков выбора заявок (где флажки находятся)
        this.count = 0;

        this.Tmp;

        this.claimsPeriod = 3;

        // Таблица, в к. все происходит по умолчанию
        // Может быть заменена передаваемым параметром
        this.table = $("table#newTransaction");

        // Блок заявок
        this.blockClaims = '<tr class="transport_claims">'
            + '<td><label class="required" tag="" for="interpretationClient">Заявки</label></td>'
            + '<td></td>';
        +'</tr>';

        // Блок клиента расшифровки
        this.blockClient = '<tr class="transport_client">'
            + '<td><label class="required" tag="" for="interpretationClient">Клиент</label></td>'
            + '<td><input type="text" id="interpretationClientName" style="margin: 0px 0px 7px 0px;" class="cashSelect" />'
            + '<br /><select class="cashSelect" id="interpretationClient" name="interpretationClient[]"></select>'
            + this.addImg + '</td></tr>';

        // Разделитель заявок
        this.separator = '<div class="separator" style="border-top: 1px solid; margin-top: 10px; line-height: 10px;">&nbsp;</div>';

        // Название типа данных (класс) - на всякий случай
        this.className = "WithInterpretation";

        // =================== Блок параметров, к. передаются в конструктор. Заполнение свойств в самом низу после методов =========================

        // url для получения списка заявок. Значение по умолчанию. При необходимости можно передать в конструктор нужное значение
        this.urlGetClaims = linkPrefix + '/cash/ajax/getclaims';

        // Часть блока заявок. Она будет подклеиваться сзади к фактически переданному параметру
        this.claimsSelect = '<select id="transport_claims" name="transport_claims[]" style="width: 150px;">' + this.selectEmpty + '</select>'
            + '&nbsp;&nbsp;&nbsp;<label for="transport_summ">Сумма</label>&nbsp;'
            + '<input type="text" name="transport_summ[]" id="transport_summ" size="10" />'
            + this.addImg;

        // Не указаны клиенты расшифровки
        this.errorNotClients;

        // Не указаны заявки расшифровки
        this.errorТotСlaims;

        // Не указан глобальный клиент
        this.errorNotMainClient;

        // Стартовый блок, передается в случае редактирования
        this.startEditBlock;

        // Использовать ли блок предпросмотра транзакции
        this.usePrepareTable = true;

        /**
         * Значение по умолчанию для поля "НДС" - "не выбрано"
         */
        this.savedNdsPayer = null;


        // Установка значений
        if (typeof params == 'object') {
            for (var i in params) {
                if ("claimsSelect" == i) {
                    this[i] = params[i] + this[i];
                } else {
                    this[i] = params[i];
                }
            }
        }

    }

    // =================== Конец блока настраиваемых параметров ====================================================================================

    // Инициализация интерфейса указанного типа транзакции
    init() {
        // "Подвязывание" событий
        var _self = this;

        if ('tableSelector' in this && typeof this.tableSelector != 'undefined')
            this.table = $(this.tableSelector);

        if (undefined == this.startEditBlock) {
            // var tr = $(this.trInterpretation);
            this.table.find("tbody:first").find("tr:last").after($(this.trInterpretation));
            var tr = this.table.find("tbody:first").find("tr:last");
            var img = $(this.interpretationOpenImg);
            img.css({'display': 'block', 'float': 'right', 'cursor': 'pointer'});
            tr.find("td").append(img);

            //this.addClientBlock();
        } else {
            this.table.find("tbody:first").find("tr:last").after($(this.startEditBlock));
        }

        // Смена даты
        this.table.find("tbody:first").find("input[name='date'][type='text']").change(function () {
            _self.refreshAllClaimsLists(_self.table.find("select#transport_claims"));
        });

        // Поиск клиента по первым буквам
        $('input#interpretationClientName').keyup(function(e) {
            _self.keyupClientName(e);
        });

        // Изменение клиента расшифровки
        this.table.find("tbody:first").find('#interpretationClient').change(function(e) {
            _self.refreshClaimsList($(e.target).parents("tr").next().find("select#transport_claims:first"));
        });

        this.table.find("tbody:first").find("input[id^='transport_']").click(function (e) {
    		_self._checkboxYesNoClick(e);
        });

        this.table.find("tbody").find("input[id^='transport_']").click(function(e) {
            _self._checkboxYesNoClick(e);
        });

        // При нажатии кнопки "Расшифровать  транзакцию / Отменить расшифровку"

        this.table.find("tbody:first").find("img.interpretationImg").click(function (e) {
            _self.clickInterpretation(e);
        });

        this.table.find("tbody:first").find("img.helpButton").click(function (e) {
            _self.clickImgHelpButton(e);
        });

        this.table.find("input:radio[name='claims_period']").filter("[value='" + this.claimsPeriod + "']").attr('checked', true);

        // Теперь обработка клика
        this.table.on('click', 'input:radio[name="claims_period"]', function(e) {
            $.each(_self.table.find('select#transport_claims'), function(n, id) {
                _self.refreshClaimsList($(id));
            });
        });

        this.initNds();
    }


    /**
     * Инициализация поля NDS
     *
     * @returns {Boolean}
     */
    initNds() {
        var self = this;

        if (!(parseInt(cashType) === 0)) {
            // Только для кассы "безнал"
            return false;
        }

        var html =
              '<tr class="ndsPayerTr">'
            + '<td><label class="required">НДС</label></td>'
            + '<td><select name="nds_payer">'
                + '<option value="">не выбрано</option>'
                + '<option value="1">Да</option>'
                + '<option value="0">Нет</option>'
            + '</select></td>'
            + '</tr>';

        this.table.find('select[name="client_id"]').parents('tr:first').after($(html));
        this.ndsPayerTr = this.table.find('tr.ndsPayerTr');

        if (!this.ndsPayerTr.length) {
            var message = 'Ошибка при инициализации поля НДС';
            alert(message + '. Обратитесь к администратору');
            throw new Error(message);
        }

        this.ndsPayerTr.find('select[name="nds_payer"]').val(this.savedNdsPayer); // Устанавливаем сохраненное значение
        this.savedNdsPayer = null; // После чего сразу удаляем его

        // При изменении клиента берем значение "НДС" с сервера
        this.table.find('select[name="client_id"]').change(function() {
            self.ndsPayerTr.find('td:last-child').addClass('element-preload');
            var clientId = parseInt($(this).val());

            if (clientId > 0) {
                // Запрос на получение поля "Плательщик НДС" по выбранному клиенту
                $.ajax({
                    url: '/cash/ajax/get-client-nds',
                    async: false,
                    type: 'POST',
                    data: {client_id: clientId},
                    dataType: 'json',
                    success: function(data)
                    {
                        self.ndsPayerTr.find('select[name="nds_payer"]').val(data.nds_payer);
                    }
                });
            }

            self.ndsPayerTr.find('td:last-child').removeClass('element-preload');
        });

        if (this.usePrepareTable) {
            this.ndsPrepareTableRow = $(
                '<tr class="ndsRow">'
                + '<td><label>НДС</label></td>'
                + '<td><span id="prepareNds"></span></td>'
                + '</tr>'
            );
            $("table#prepareTransaction").find('#prepareClient').parents('tr:first').after(this.ndsPrepareTableRow);
        }

        return true;
    };


    // Очистка своих хвостов
    destruct() {
        this.closeInterpretation();
        this.table.find("tbody:first").find("tr.interpretation").remove();
        this.table.find("tbody:first").find("img.interpretationImg").unbind('click');

        if (parseInt(cashType) === 0) {
            // Удаляем поле "НДС"
            this.ndsPayerTr.remove();
            if (this.usePrepareTable) {
                this.ndsPrepareTableRow.remove();
            }
        }
    }

    // Обновить все указанные списки
    refreshAllClaimsLists(selects) {
        var _self = this;
        $.each(selects, function(n, id) {
            _self.refreshClaimsList($(id));
        });
    }

    // Обновление списка заявок
    refreshClaimsList(select)
    {
        var _self = this;

        // Очистим список
        this.emptySelect(select);
        select.append($(this.selectEmpty));

        // Если не выбран клиент, то ничего не обновляем
        var client = select.parents("tr:first").prevAll("tr:first").find("select#interpretationClient");

        if (client.length) {
            if (0 == client.val()) {
                this.emptySelect(select);
                select.append($(this.dataNotFound));
            } else {
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: this.urlGetClaims,
                    data: {
                        trId: this.trId,
                        trType: this.table.find("tbody").find("select#transaction_type").val(),
                        cId: client.val(),
                        trYes: select.prevAll("div:first").find("input[type='checkbox'][id^='transport_yes_']:first").prop("checked"),
                        trNo: select.prevAll("div:first").find("input[type='checkbox'][id^='transport_no_']:first").prop("checked"),
                        date: this.table.find("tbody").find("input[id='date']").val(),
                        claimsPeriod: this.table.find("input[name='claims_period'][type='radio']:checked").val()
                    },
                    success: function(data) {
                        _self.emptySelect(select);
                        if (0 == data.length) {
                            select.append($(_self.dataNotFound));
                            return false;
                        }
                        select.append($(data));
                    }
                });
            }

            // При выборе заявки
//            this.table.find("tbody:first").find("select#transport_claims").change(function (e) { // При необходимости вернуть обратно
            select.parents('table:first').find("tbody:first").find("select#transport_claims").change(function (e) {
                // Установим подсказку со значением суммы
                var textBox = $(e.target).nextAll("input#transport_summ:first");
                var rel = $(e.target).find("option:selected").attr("rel");
                if (undefined != rel) {
                    textBox.attr("placeholder", rel);
                    textBox.placeholder();
                }
            });

            // Нажатие "плюсика" или "крестика"

//            this.table.find("tbody:first").find("img.helpButton").click(function (e) { // При необходимости вернуть обратно
            select.parents('table:first').find("tbody:first").find("img.helpButton").click(function (e) {
                _self.clickImgHelpButton(e);
            });
        }
    }

    clickInterpretation(e) {
        if ("open" == $(e.target).attr("rel")) {
            this.openInterpretation();
        } else {
            this.closeInterpretation();
        }
    }

    // Метод для обработчика события нажатия на "плюсик" или "крестик"
    clickImgHelpButton(e)
    {
        if ("add" == $(e.target).attr("rel")) {
            // Какой "плюсик" нажат - "верхний" или "нижний"?
            // Если перед "плюсиком" находится поле select#client_id, то это "верхний"
            if ($(e.target).siblings("select#interpretationClient").length > 0) {
                // верхний
                if (this.checkClient($(e.target))) {
                    this.addClientBlock();
                }
            } else {
                // "нижний"
                if (this.checkClaim($(e.target))) {
                    this.addClaimsSelect($(e.target).parents("td:first"));
                }
            }
        } else {
            // Какой "крестик" нажат - "верхний" или "нижний"?
            // Если перед "крестик" находится поле select#client_id, то это "верхний"
            if ($(e.target).siblings("select#interpretationClient").length > 0) {
                // верхний
                this.deleteClientBlock($(e.target));
            } else {
                // "нижний"
                this.deleteClaimsSelect($(e.target));
            }
        }

        DepartmentAutoSelect();
    };

    // Очистить указанный список
    emptySelect(select) {
        select.empty();
        var next = select.nextAll("input#transport_summ:first");

        if (undefined != next.attr("placeholder")) {
            next.attr("placeholder", "");
            next.placeholder();
        }
    }


    /**
     * Добавить блок клиента расшифровки
     *
     * @param {type} usedTable Таблица, в которую надо добавить
     *
     * @returns {undefined}
     */
    addClientBlock(useTable) {
        var _self = this;

        if (useTable == undefined) {
            // Если таблица не указана, то берём по-умолчанию таблицу редактирования транзакции
            useTable = this.table;
        }

        var table = useTable.find("tbody:first");
        var bc = $(this.blockClient);

        // Обнулим все поля
        bc.find("select#interpretationClient").val(0);
        bc.find("input#interpretationClientName").val("");

        // У последнего блока клиента сменить "плюсик" на "крестик"
        var tr = table.find("tr.transport_client:last");

        if (useTable.hasClass('detailsHelperTable')) {
            // Немного другая логика при добавлении строк в таблицу "похожие" расшифровки
            if (tr.length) {
                tr.find("img.helpButton[rel='add']").remove();
                tr.find("td:last").append($(this.deleteImg));
            }
            table.append(bc);
        } else {
            // Стандартная логика
            if (!tr.length) {
                tr = table.find("tr.interpretation");
                tr.after(bc);
            } else {
                tr.find("img.helpButton[rel='add']").remove();
                tr.find("td:last").append($(this.deleteImg));
                table.find("tr.transport_claims:last").after(bc);
            }
        }

        // Добавим новый блок заявок
        this.addClaimBlock(bc);

        // Нажатие "плюсика" или "крестика"
        table.find("img.helpButton").click(function (e) {
            _self.clickImgHelpButton(e);
        });

        table.find('input#interpretationClientName').keyup(function(e) {
            var useTmp = true;
            if (useTable.hasClass('detailsHelperTable')) {
                // Если это таблица "Варианты расшифровок", не используем переменную this.Tmp
                // Я сам пока не понял почему, но она конкретно мешает
                useTmp = false;
            }
            _self.keyupClientName(e, useTmp);
        });

        // Изменение клиента расшифровки
//        this.table.find("tbody:first").find('#interpretationClient').change(function(e) {
        bc.find("select#interpretationClient").change(function(e) {
            _self.refreshClaimsList($(e.target).parents("tr").next().find("select#transport_claims:first"));
        });

        // Обновим список клиентов с учетом того, что в поле поиска пустая строка (инициализируем заново)
        bc.find("input#interpretationClientName").trigger("keyup");

        // Возвращаем блок выбора клиентов
        return bc;
    }

    addClaimBlock(blockClient) {
        var bc = $(this.blockClaims);
        this.addClaimsSelect(bc.find("td:last"));
        blockClient.after(bc);
    }


    /**
     * Возвращает "похожие" расшифровки
     *
     * @returns {undefined}
     */
    getSimilarDetails() {
        var detailsResult = false;

        // Параметры для выбора "похожих" расшифровок
        var params = {
            summ: this.table.find('input#summ').val(),
            client_id: this.table.find('select#client_id').val(),
            date: this.table.find('input#date').val(),
            transaction_type:  this.table.find('select#transaction_type').val()
        };

        if (
            parseInt(params.summ)
            && parseInt(params.client_id)
            && params.date
            && parseInt(params.transaction_type)
        ) {
            // Если есть все необходимые параметры, сделаем запрос
            $.ajax({
                url: linkPrefix + '/cash/ajax/get-claims-helper-values',
                type: 'POST',
                async: false,
                data: params,
                dataType: 'json',
                success: function(data) {
                    detailsResult = data;
                }
            });
        }

        return detailsResult;
    }


    /**
     * Добавляет помощник выбора "подходящих" расшифровок.
     * Расшифровки берутся из "Запросов на оплату".
     * Критерии для поиска таких расшифровок:
     * 1) сумма
     * 2) тип транзакции (транспортные расходы | расходники)
     * 3) клиент
     * 4) дата (ticket.date_created < date < ticket.date_created + 3 дня)
     */
    addClaimsHelper() {
        if (!(typeof cashType != 'undefined' && cashType == 0)) {
            // Только для кассы безнал
            return false;
        }

        var self = this;

        // "Похожие" расшифровки
        var similarDetailsResult = this.getSimilarDetails();
        if (similarDetailsResult && similarDetailsResult.length) {
            // Если "похожие" расшифровки нашлись

            // Ссылка для отображения окна вариантов расшифровок
            var showSimilarDetailsResults = $('<img id="showSimilarDetailsResults" class="reminder"'
                    + ' src="/img/system/error.16.png" title="Есть варианты расшифровок из модуля &laquo;Запрос на оплату&raquo;" />');
            this.table.find('tr.interpretation img.interpretationImg').before(showSimilarDetailsResults);

            // Запустим мигание ссылки
            runIt();

            showSimilarDetailsResults.click(function(){
                self.showSimilarDetailsWindow();
            });
        }
    }


    /**
     * Показывает окно выбора "подходящих" расшифровок
     */
    showSimilarDetailsWindow() {
        var self = this;

        var interpretationTr = this.table.find('#showSimilarDetailsResults').parents('tr');

        var similarDetailsResult = this.getSimilarDetails();

        if (!(similarDetailsResult && similarDetailsResult.length)) {
            // Если не нашлось вариантов оповестим об этом пользователя
            alert('Не нашлось подходящих вариантов расшифровок');
            return false;
        }

        // Объект формы транзакции
        var parentForm = self.table.parents('form');
        // Устанавливаем стили для таблицы редактирования транзакции
        self.table.css({'zIndex': 100, 'position':'relative'});

        // Добавляем окошко для отображения "похожик" расшифровок
        // Оно у нас будет с абсолютным позиционированием
        var similarDetailsWindow = $('div#similarDetailsWindow');
        if (!(similarDetailsWindow.length)) {
            similarDetailsWindow = $('<div id="similarDetailsWindow"></div>');
            // Вставляем окошко после таблицы-транзакции (внутри 'parentForm')
            self.table.after(similarDetailsWindow);
        }

        // Начальная ширина
        var initialWidth = 150;
        // Начальное смещение слева
        var initialLeft = self.table.width() + 5;
        // Начальный отступ сверху: на уровне строки "Расшифровка"
        var initialTop = parseInt(interpretationTr.offset().top) - parseInt(parentForm.offset().top);
        similarDetailsWindow.css({
            'zIndex': 99,
            'top': initialTop,
            'left': initialLeft, // По левому краю таблицы редактирования транзакции
            'width': initialWidth,
            'height': interpretationTr.height() + 1,
            'display': 'block'
        }).addClass('element-preload');

        // Задисаблим кнопку открытия окна и скроем её
        var openButton = self.table.find('#showSimilarDetailsResults');
        if (openButton.length) {
            openButton.unbind('click').hide();
        }

        // Анимируем появление слева
        similarDetailsWindow.animate({'left': parseInt(self.table.width())}, 300);

        // После слайда рисуем таблицу с "похожими" расшифровками
        setTimeout(function(){
            // Таблица для вывода "похожих" расшифровок
            var newTable = similarDetailsWindow.find('table.detailsHelperTable');
            if (!newTable.length){
                // Если таблицы нет, создадим её
                // Клонируем таблицу редактирования транзакции
                var newTable = self.table.clone();
                newTable.addClass('detailsHelperTable');
                // Меняем заголовок
                newTable.find('thead th').attr('colspan', 3).text('Варианты расшифровок');
                // Меняем кнопки в футере
                // Класс detailsSelect для td нужен для того, чтобы не дисаблить такие td'шки
                newTable.find('tfoot').empty().append('<tr><td colspan="3" align="center" class="detailsSelect">'
                    + '<input type="button" class="amd-btn amd-btn_primary" id="detailsHelperSave" value="Сохранить выбор" disabled="disabled">'
                    + '<input type="button" class="amd-btn amd-btn_primary" id="detailsHelperClose" value="Закрыть">'
                    + '</td></tr>');
            }

            // Очищаем тело новой таблицы
            newTable.find('tbody').empty();

            // Закрытие окошка
            newTable.find('#detailsHelperClose').click(function(){
                self.closeSimilarDetailsWindow();
            });

            // Сохранить выбор "похожей" расшифровки
            newTable.find('#detailsHelperSave').click(function(){
                // Ищем выбранный вариант
                var selectedRadio = newTable.find('input[name="detailsSelect"]:checked');
                if (!selectedRadio.length) {
                    // Если не выбрано ни одной расшифровки
                    alert('Должен быть выбран по крайней мере один вариант');
                } else if (selectedRadio.length > 1) {
                    // Должна быть выбрана только одна расшифровка
                    alert('Неправильно выбрана расшифровка');
                } else {
                    // Иначе делаем подмену расшифровки в таблице редактирования транзакции

                    // Удаляем существующую расшифровку (transport_client + transport_claims)
                    self.table.find('tbody:first tr.transport_client, tbody:first tr.transport_claims').remove();

                    // Определяем набор строк, которые надо скопировать из detailsHelperTable в self.table

                    // Tr, внутри которой был выбран radio
                    var selectedClientsTr = selectedRadio.parents('tr:first');
                    // Следующий после этой строки разделитель
                    var nextSeparatorRow = selectedClientsTr.nextAll('tr.detailsHelperSeparator:first');

                    // Необходимо взять все строки между этими двумя и сунуть их в self.table.find('tbody:first')
                    var fromIndex = selectedClientsTr.index();
                    var toIndex = nextSeparatorRow.index();

                    var appendRows = new Array();
                    for (var i = fromIndex; i < toIndex; i++) {
                        appendRows.push(newTable.find('tbody').find('tr:eq(' + i + ')'));
                    }

                    appendRows.forEach(function(row){
                        // Удаляем radio для выбора строки
                        row.find('td.detailsSelect').remove();
                        // Инвертируем сумму
                        row.find('input#transport_summ').each(function(i, val){
                            $(this).val(-$(this).val());
                        });
                        // И пихаем строку в таблицу редактирования расшифровки
                        self.table.find('tbody:first').append(row);
                    });

                    // Обновить значение для склада
                    DepartmentAutoSelect();

                    // И закрываем окно
                    self.closeSimilarDetailsWindow();
                }
            });

            // Чекнем claims_period = -1 (все), чтобы в списках заявок выводились заявки за всё время
            self.table.find("input[name='claims_period'][type='radio'][value='-1']").prop('checked', true)

            // На основе полученных данных напихаем в новую таблицу расшифровок
            similarDetailsResult.forEach(function(detailsData){
                // detailsData - "похожий" вариант расшифровки. Каждое значение в этом массиве - массив с заявками клиента

                detailsData.forEach(function(clientData){
                    // Добавляем блок выбора клиента
                    var clientBlock = self.addClientBlock(newTable);
                    // Блок выбора заявки
                    var claimsBlock = clientBlock.next();

                    // Чекнем также флажок "Есть" сумма по заявке
                    claimsBlock.find('input[id^="transport_yes"]').attr('checked', 'checked');

                    // Присваиваем значение клиента
                    clientBlock.find('select#interpretationClient').val(clientData.clientId);
                    // Имитируем селект, чтобы подгрузились заявки для этого клиента
                    clientBlock.find('select#interpretationClient').change();

                    if (clientData.claims && clientData.claims.length) {
                        // Пробежимся по массиву заявок и добавим каждую из них в таблицу
                        var claimsCounter = 0;
                        clientData.claims.forEach(function(claimData){
                            if (claimsCounter != 0) {
                                // Если это не первая заявка в списке, надо "нажать" "плюсик" для добавления новой заявки.
                                // Это должен быть второй "плюсик" (именно он используется для добавления нового блока заявок для клиента).
                                // Ищем второй "плюсик" и "нажимаем".
                                claimsBlock.find('input#transport_summ:last').next('img.helpButton').click();

                                // И ещё раз чекнем чекбокс "Есть" для суммы заявок
                                claimsBlock.find('input[id^="transport_yes"]').attr('checked', 'checked');
                            }
                            // Выбираем заявку и сумму
                            claimsBlock.find('select#transport_claims:last').val(claimData.claimId);
                            claimsBlock.find('input#transport_summ:last').val(claimData.claimSum);

                            claimsCounter ++;
                        });
                    }
                });

                // Добавим чекбокс для выбора "похожего" варианта расшифровки

                // Номер последней добавленной строки
                var lastTrNum = parseInt(newTable.find('tbody tr:last').index()) + 1;

                // Tr, в которую надо добавить чекбокс
                var prependTo = false;
                if (newTable.find('tbody tr.detailsHelperSeparator:last').length) {
                    // Если уже есть строки, то возьмём следующую после разделителя
                    prependTo = newTable.find('tbody tr.detailsHelperSeparator:last').next('tr');
                } else {
                    // Иначе - это первая строка в таблице
                    prependTo = newTable.find('tbody tr:first');
                }

                // Высчитаем rowspan для вставляемого td.
                // Это разница между номером последней добавленной строки
                // и индексом строки, в которую собрались добавлять чекбокс
                var rowspan = lastTrNum - parseInt(prependTo.index());

                var radioTd = $('<td class="detailsSelect" rowspan="' + rowspan + '" align="center"></td>');
                radioTd.append($('<input type="radio" name="detailsSelect">'));

                // Добавим столбец с чекбоксом
                prependTo.prepend(radioTd);

                // Каждый блок с "похожей" расшифровкой выделяем: добавляем сепаратор
                newTable.find("tbody").append($('<tr class="detailsHelperSeparator"><td colspan="3"></td></tr>'));
            });

            newTable.find('input[name="detailsSelect"]').change(function(){
                // Если был сделан выбор расшифровки, раздисаблим кнопку сохранения выбора
                newTable.find('#detailsHelperSave').removeAttr('disabled');
            });

            // "Прилипаем" таблицу редактирования транзакции к верху окна
            self.table.scrollToFixed();

            // Добавляем сформированную таблицу в окно
            newTable.appendTo(similarDetailsWindow);

            // Высчитываем отступ сверху для окна
            var newTop = (parentForm.height() - newTable.height()) / 2;
            if (newTop < 0) {
                // Окно не должно "выехать" за пределы окна браузера
                newTop = 0;
            }
            // Плавно раскрываем окно
            similarDetailsWindow.animate({'top': newTop, 'height': newTable.height()},
                500,
                function(){
                    // Показываем таблицу
                    newTable.css('visibility', 'visible');
                    // Удаляем класс подгрузки
                    similarDetailsWindow.removeClass('element-preload');
                }
            );
        }, 500);
    }


    /**
     * Закрывает окно помощника выбора "подходящих" расшифровок
     *
     * @returns {undefined}
     */
    closeSimilarDetailsWindow() {
        var self = this;

        var similarDetailsWindow = this.table.siblings('div#similarDetailsWindow');
        if (similarDetailsWindow.length) {
            // Если окошко нашлось
            // Отвязываем события сохранения и закрытия
            similarDetailsWindow.find('#detailsHelperClose').unbind('click');
            similarDetailsWindow.find('#detailsHelperSave').unbind('click');
            // Удаляем таблицу "похожих" расшифровок
            similarDetailsWindow.find('table.detailsHelperTable').remove();
            // Отключаем "прилипание" для таблицы редактирования транзакции
            this.table.trigger('detach.ScrollToFixed');

            // Анимируем сворачивание
            similarDetailsWindow.addClass('element-preload');
            // Возвращаем начальный отступ сверху: на уровне строки "Расшифровка"
            var interpretationTr = this.table.find('tr.interpretation');
            var initialTop = parseInt(interpretationTr.offset().top) - parseInt(this.table.parents('form').offset().top);
            similarDetailsWindow.animate({
                'top': initialTop,
                'height': interpretationTr.height() + 1,
                'width': 150
            }, 300, function(){
                // Слайдим обратно
                similarDetailsWindow.animate({'left': parseInt(self.table.offset().left)},
                    300, function(){similarDetailsWindow.hide()}
                );
                // Опять забиндим клик и покажем кнопку
                var openButton = self.table.find('#showSimilarDetailsResults');
                if (openButton.length) {
                    openButton.click(function(){self.showSimilarDetailsWindow()}).show();
                }
            });
            // Скрываем окно
        }
    }


    /**
     * Удаляет помощник выбора "подходящих" расшифровок
     *
     * @param {type} td
     * @returns {undefined}
     */
    removeClaimsHelper() {
        if (!(typeof cashType != 'undefined' && cashType == 0)) {
            // Только для кассы безнал
            return false;
        }

        if (this.table.find('#showSimilarDetailsResults').length) {
            // Отвязываем нажатие на кнопку отображения хелпера и удаляем её
            this.table.find('#showSimilarDetailsResults').unbind('click').remove();
        }

        // + закрываем окно хелпера
        this.closeSimilarDetailsWindow();
    }

    // Добавить кусок выбора заявок (checkboxes, select, input)
    addClaimsSelect(td) {
        var _self = this;

        // Изменим "плюсик" на "крестик"
        if (td.find("img.helpButton[rel='add']").length > 0) {
            td.find("img.helpButton[rel='add']").replaceWith($(this.deleteImg));
            // td.append($(this.deleteImg));
            td.append($(this.separator));
        }
        // обертка td; нужна для функций поиска
        var cs = $('<td>' + this.claimsSelect + '</td>');

        //// Сосчитаем, сколько всего имеется чекбоксов такого типа
        //var count = this.table.find("input[type='checkbox'][id^='transport']").length / 2 + 1;
        // так, как выше, делать нельзя, потому что списки могут добавляться и удаляться
        // и рано или поздно возникнет ситуация присвоения одинаковых id разным блокам флажков

        // поэтому через обычный счетчик; при удалении списка этот счетчик НЕ уменьшается;
        // только при изменении типа транзакции - обнуляется
        this.count = this.count + 1;

        // Вставим id в чекбоксы
        cs.find("input[type='checkbox']:last").attr("id", "transport_yes_" + this.count);
        cs.find("input[type='checkbox']:first").attr("id", "transport_no_" + this.count);

        var parentTable = td.parents('table');
        if (parentTable.length && parentTable.hasClass('detailsHelperTable')) {
            // Если блок заявок добавляется в таблицу "похожих" расшифровок, то чекнем второй чекбокс
            cs.find("input[type='checkbox']:last").attr('checked', 'checked');
        }

        // Вставим атрибут 'for' для меток
        cs.find("input[type='checkbox']:last").nextAll("label:first").attr("for", "transport_yes_" + this.count);
        cs.find("input[type='checkbox']:first").nextAll("label:first").attr("for", "transport_no_" + this.count);

        //cs.find("input#transport_no_" + count).trigger("click");

        // Вставим только содержимое обертки
        td.append(cs.html());

        // Нажатие на флажок фильтра заявок ("Транспорт есть" или "Транспорта нет")
        // должен быть нажат (выделен) хотя бы один флажок из данной пары
        td.find("input#transport_yes_" + this.count + ", input#transport_no_" + this.count).click(function(e) {
            _self._checkboxYesNoClick(e);
        });

        this.refreshClaimsList(td.find("select#transport_claims:last"));

    }

    _checkboxYesNoClick(e) {
        // признак обновления списка заявок
        var refresh = true;

        // Если у текущего флажка снято выделение,
        if (false == $(e.target).prop("checked")) {
            // то надо проверить, стоит ли оно у соседа
            var ch;

            if (/transport_yes/.test($(e.target).attr("id"))) {
                ch = $(e.target).prevAll("input[type='checkbox'][id^='transport_no']:first");
            } else {
                ch = $(e.target).nextAll("input[type='checkbox'][id^='transport_yes']:first");
            }

            if (false == ch.prop("checked")) {
                // у соседа не стоит; надо вернуть состояние флажка
                $(e.target).prop("checked", true);
                // обновлять список заявок не нужно
                refresh = false;
            }
        }
        if (refresh) {
            this.refreshClaimsList($(e.target).parent().nextAll("select#transport_claims:first"));
        }
    }

    // Открыть (начать) расшифровку
    openInterpretation() {
        var _self = this;

        this.addClientBlock();
        var img = $(this.interpretationCloseImg);
        img.css({'display' : 'block', 'float' : 'right', 'cursor' : 'pointer'});

        var tr = this.table.find("tbody:first").find("tr.interpretation");
        tr.find("td").find("img").remove();
        tr.find("td").append(img);

        if (this.usePrepareTable)
            this.addPrepareInterpretation();

        this.table.find("tbody:first").find("img.interpretationImg").unbind("click");    // Открыть/закрыть расшифровку
        this.table.find("tbody:first").find("img.interpretationImg").click(function (e) {
            _self.clickInterpretation(e);
        });

        // Добавить к дате выбор периода отбора заявок
        // Если этого блока ещё нет
        if (!this.table.find('input[name="claims_period"]').length) {
            this.table.find("input[name='date'][type='text']").parents('td:first').append(
                $('<div><label>Отбирать заявки за:</label><br />' +
                    '<input type="radio" value="3" name="claims_period" checked/>3 месяца&nbsp;&nbsp;' +
                    '<input type="radio" value="6" name="claims_period" />6 месяцев<br>' +
                    '<input type="radio" value="9" name="claims_period" />9 месяцев' +
                    '<input type="radio" value="-1" name="claims_period" />Все</div>').val(3)
                );
        }

        // Добавим блок "Варианты расшифровок"
        this.addClaimsHelper();
    }


    // Добавление расшифровки в предосмотр транзакции
    addPrepareInterpretation() {
        // Если раскрыт блок расшифровки
        if ("close" == this.table.find("tbody:first").find("img.interpretationImg").attr("rel")){
            $("table#prepareTransaction tbody").find("tr:last").after($(this.trInterpretation));
            $("table#prepareTransaction tbody").find("tr:last").after($('<tr class="interpretation"><td colspan="2"></td></tr>'));
        }
    }


    // Удалить блок клиента целиком
    deleteClientBlock(img) {
        // Строка, где находится нажатый "крестик"
        var tr = img.parents("tr:first");
        // Удалим строку заявок
        tr.next().remove();
        // Удалим свою строку
        tr.remove();

        // Заменим последний "крестик" среди клиентов на "плюсик"
        tr = this.table.find("tbody:first").find("tr.transport_client");
        img = tr.find("img.helpButton:last");

        if ("delete" == img.attr("rel")) {
            img.after($(this.addImg));
            img.remove();
        }
    }


    // Удаление списка для выбора заявки
    deleteClaimsSelect(img) {
        // Удалим разделитель, стоящий за "крестиком"
        img.nextAll("div:first").remove();
        $.each(img.prevAll(), function(n, id) {
            // Если найденный элемент - сепаратор, то выйдем из цикла
            if ($(id).is("div.separator")) {
                return false;
            }
            $(id).remove();
        });
        // Если "крестик" на самом деле "плюсик" (такое может быть при упаковке транзакции перед проведением),
        // то удалим сепаратор, предшествующий ему
        if ("add" == img.attr("rel")) {
            img.prevAll("div.separator:first").remove();
        }

        var td = img.parents("td:first");

        // Удалим сам "крестик"
        img.remove();

        // Заменим последний "крестик" в данном блоке на "плюсик"
        img = td.find("img.helpButton:last");
        if ("delete" == img.attr("rel")) {
            img.after($(this.addImg));
            img.remove();
        }
    }


    // Закрыть (отменить) расшифровку
    closeInterpretation() {
        var _self = this;

        //Удалим все строки клиента
        $.each(this.table.find("tbody:first").find("tr.transport_client"), function (n, id) {
            $(id).remove();
        });
        // Удалим строки заявок
        $.each(this.table.find("tbody:first").find("tr.transport_claims"), function (n, id) {
            $(id).remove();
        });

        if (this.usePrepareTable) {
            $.each($("table#prepareTransaction tbody").find("tr.interpretation"), function (n, id) {
                $(id).remove();
            });
        }

        // Обнулим счетчик
        this.count = 0;

        // "Отвязывание" событий
        this.table.find("tbody:first").find('#interpretationClientName').unbind("keyup");    // Поиск клиента по первым буквам
        this.table.find("tbody:first").find('#interpretationClient').unbind("change");    // Изменение клиента расшифровки
        this.table.find("tbody:first").find("img.helpButton").unbind("click");            // Нажатие на "плюсик" или "крестик"
        this.table.find("tbody:first").find("input[type='checkbox'][id^='transport_']").unbind("click");    // Выбор флажка
        this.table.find("tbody:first").find("select#сlient").unbind("change");            // Изменение глобального клиента
        this.table.find("tbody:first").find("select#transport_claims").unbind("change");    // Быбор заявки
        this.table.find("tbody:first").find("input[name='date'][type='text']").unbind("change");    // Смена даты
        this.table.find("tbody:first").find("img.interpretationImg").unbind("click");    // Открыть/закрыть расшифровку

        var img = $(this.interpretationOpenImg);
        img.css({'display' : 'block', 'float' : 'right', 'cursor' : 'pointer'});

        var tr = this.table.find("tbody:first").find("tr.interpretation");
        tr.find("td").find("img").remove();
        tr.find("td").append(img);

        this.table.find("tbody:first").find("img.interpretationImg").click(function (e) {
            _self.clickInterpretation(e);
        });

        // Удалим блок выбора периода заявок
        this.table.find("input[name='claims_period'][type='radio']").unbind('click');
        this.table.find("input[name='claims_period'][type='radio']").parent('div').remove();

        // Удалим блок "Варианты расшифровок"
        this.removeClaimsHelper();
    }


    // Проверка заполнения полей при нажатии "плюсика" или "крестика"
    checkHelpButton(e)
    {
        // Какой "плюсик" нажат - "верхний" или "нижний"?
        // Если перед "плюсиком" находится поле select#client_id, то это "верхний"
        if ($(e.target).prev("select#interpretationClient").length > 0) {
            // верхний
            return this.checkClient($(e.target));
        } else {
            // "нижний"
            return this.checkClaim($(e.target));
        }
    }


    keyupClientName(e, useTmp) {
        var node = $(e.target).nextAll("select#interpretationClient:first");
        var options = node.find("option");

        if (!options.length) {
            if (useTmp === false) {
                var name = $(e.target).val();
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: linkPrefix + '/client/ajax/getclients',
                        data: {
                            name: name,
                            allowedStates: 1
                        },
                        success: function(data) {
                            $(e.target).nextAll("select:first").html(data);
                        }
                    });
            } else {
                if (this.Tmp) {
                    clearTimeout(this.Tmp);
                }

                var name = $(e.target).val();

                this.Tmp = setTimeout(function() {
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: linkPrefix + '/client/ajax/getclients',
                        data: {
                            name: name,
                            allowedStates: 1
                        },
                        success: function(data) {
                            $(e.target).nextAll("select:first").html(data);
                        }
                    });
                }, 556);
            }
        } else {
            if (this._searchInterpretationClientTimeout) {
                window.clearTimeout(this._searchInterpretationClientTimeout);
            }
            this._searchInterpretationClientTimeout = window.setTimeout(() =>
            {
                if (!clientsInterpretationList.length) {
                    for (var i = 0; i < options.length; i++) {
                        if (options[i].value == 0) {
                            continue;
                        }
                        clientsInterpretationList.push({
                            id  : options[i].value,
                            text: options[i].text.replace(/^\s+|\s+$/, ''),
                        });
                    }
                }

                // node.empty();
                node.get(0).options.length = 0
                node.append(new Option("не выбрано", 0));

                var search = $(e.target).val().toLowerCase().replace(/^\s+|\s+$/, '');

                for (var i = 0; i < clientsInterpretationList.length; i++) {
                    if (search.length && clientsInterpretationList[i].text.toLowerCase().indexOf(search) == -1) {
                        continue;
                    }
                    node.append(new Option(clientsInterpretationList[i].text, clientsInterpretationList[i].id));
                }
            }, 500);
        }
    }


    //Проверка заполнения полей клиента (верхний "плюсик")
    checkClient(img) {
        if (0 == img.prevAll("select#interpretationClient:first").val()) {
            // клиент не выбран
            return false;
        }
        var tr = img.parents("tr:first").next();
        // Если не найдена кнопка "удалить" ("крестик")
        if (0 == tr.find("img.helpButton[rel='delete']").length) {
            // то проверим, все ли поля выбраны около клиента
            return this.checkClaim(tr.find("img.helpButton[rel='add']"));
        }
        // Все поля заполнены, можно добавлять новые
        return true;
    }


    // Проверка заполнения полей заявки ("нижний плюсик")
    checkClaim(img) {
        // Должна быть выбрана заявка и указана сумма
        if (img.prevAll("select#transport_claims:first").val() > 0
            && img.prevAll("input#transport_summ:first").val().length > 0) {
            return true;
        }

        return false;
    }


    // Валидация формы в целом
    checkForm()
    {
        var table = this.table.find("tbody:first");
        var _self = this;
        var error = "";

        // Пройдемся по всем клиентам, где стоит "крестик"
        $.each(table.find("tr.transport_client").find("img.helpButton"), function(n, img) {
            var claimIds = [];

            // Проверим заполнение самого клиента
            if (0 == $(img).prevAll("select#interpretationClient:first").val()) {
                // Не заполнен - ошибка
                error = _self.errorNotClients;
                return false;
            }

            // в каждом клиенте проверим заполнение заявок
            // для этого пройдемся по всем "крестикам" заявок клиента
            $.each($(img).parents("tr:first").next().find("img.helpButton"), function(i, cross) {
                if (!_self.checkClaim($(cross))) {
                    // Не заполнена заявка - ошибка
                    //error = "Не заполнено одно или несколько полей заявок, по которым возникли транспортные расходы";
                    error = _self.errorNotClaims;
                    return false;
                }

                var claimId = $(cross).prevAll("select#transport_claims:first").val();

                if (-1 === claimIds.indexOf(claimId)) {
                    claimIds.push(claimId);
                } else {
                    error = 'Повторное использование заявки №' + claimId;
                    return false;
                }

                // А заодно и формат заполнения
                if (!/^-?[0-9]+(\.[0-9]{1,2})?$/.test($(cross).prevAll("input#transport_summ:first").val())) {
                    // Не соответствует формат - ошибка
                    error = "Одно из полей суммы не соответсвует денежному формату";
                    return false;
                }
            });
        });

        if (error.length > 0) {
            return error;
        }

        // Если до сих пор все в порядке, то проверим сумму транзакции с суммой всех заявок
        summ = 0;

        $.each(table.find("input#transport_summ[type='text']"), function(n, id) {
            if ($(id).val().length > 0) {
                summ = summ + parseFloat($(id).val());
            }
        });

        if (parseFloat((table.find("input#summ").val().length > 0) ? table.find("input#summ").val() : 0).toFixed(2) != summ.toFixed(2)) {
            // Общая сумма не равна сумме по заявкам
            return "Общая сумма транзакции не соответствует сумме по заявкам";
        }
        // Если все нормально, то вернем пустую строку
        return "";
    }


    // Пустой ли блок клиента
    isBlockClientIsEmpty(bc) {
        // Блок клиента будет считаться пустым, если:
        // - не выбран клиент
        // - в блоке заявок всего одна строка
        // - в строке блока заявок ничего не выбрано (ни заявка, ни сумма)

        // Проверяем выбор клиента
        if (bc.find("select#interpretationClient").val() > 0) {
            // кто-то выбран; блок не пустой
            return false;
        }
        // Проверим кол-во строк выбора
        var tr = bc.next();
        if (tr.find("img.helpButton").length > 1) {
            // Строка не одна; блок не пустой
            return false;
        }
        // Проверим, не заполнен ли блок выбора заявки
        return !this.checkClaim(tr.find("img.helpButton:last"));
    }

    // "Упаковать" транзакцию, т.е. убрать все не заполненные до конца поля
    packTransaction()
    {
        var table = this.table.find("tbody:first");//$("table#newTransaction tbody");
        var select;
        var textBox;
        var _self = this;

        // Если блоков клиентов больше одного, то надо проверить последний на пустоту
        if (table.find("tr.transport_client").length > 1) {
            // если последний блок клиентов пустой, то его надо удалить
            if (this.isBlockClientIsEmpty(table.find("tr.transport_client:last"))) {
                this.deleteClientBlock(table.find("tr.transport_client:last").find("img.helpButton:last"));
                // Заменим последний "крестик" на "плюсик"
            }
        }

        // Если блоков заявок больше 1
        if (table.find("select#transport_claims").length > 1) {
            // то идем по блокам клиентов и "пакуем" их (блоки заявок)
            $.each(table.find("tr.transport_client"), function(n, client) {
                var trClaims = $(client).nextAll("tr.transport_claims:first");
                // Если в блоке клиента больше одного блока заявок, то проверим последний из них на пустоту
                select = trClaims.find("select#transport_claims:last");
                textBox = trClaims.find("input#transport_summ[type='text']:last");
                // Если последний блок заявок пустой, то "упакуем" его
                if (0 == select.val() && 0 == textBox.val().length) {
                    _self.deleteClaimsSelect(trClaims.find("img.helpButton:last"));
                }
            });
        }
    }

    // Сохранение транзакции
    save() {
        if (this.usePrepareTable) {
            $('#prepareClient').html(this.table.find("tbody:first").find("select#client_id option:selected").text());

            if (parseInt(cashType) === 0) {
                // Записываем значение поля "НДС" в предварительную таблицу
                this.ndsPrepareTableRow.find('#prepareNds').text(this.ndsPayerTr.find('select[name="nds_payer"] option:selected').text());
            }
        }

        // Проверим заполнение глобального клиента
        if (0 == this.table.find("select#client_id").val()) {
            alert(this.errorNotMainClient);
            return false;
        }

        // Валидация поля "НДС"
        if (!this.checkNdsField()) {
            alert('Неверно указано значение поля "НДС"');
            return false;
        }

        // Если расшифровка не была использована, то проверять и формировать нечего
        if ("open" == this.table.find("tbody:first").find("tr.interpretation").find("img").attr("rel")) {
            return true;
        }
        this.packTransaction();

        var error = this.checkForm();
        if (error.length > 0) {
            alert(error);
            // Сменим "крестик" в последнем поле клиента на "плюсик"
            var img = this.table.find("tbody:first").find("tr.transport_client:last").find("img.helpButton[rel='delete']");
            if (img.length > 0) {
                img.parent().append($(this.addImg));
                img.remove();
            }
            // вернем false
            return false;
        }
        if (this.usePrepareTable) {
            var interpretation = "<dl>";
            //$.each(this.table.find("tr.transport_client").find("img.helpButton[rel='delete']"), function (n, img) {
            $.each(this.table.find("tbody:first").find("tr.transport_client").find("img.helpButton"), function (n, img) {
                interpretation = interpretation + '<dt>' + $(img).prevAll("select#interpretationClient").find("option:selected").html() + ':</dt>';
                $.each($(img).parents("tr:first").next().find("img.helpButton"), function (n, id) {
                    interpretation = interpretation + '<dd>' + $(id).prevAll("select#transport_claims:first").find("option:selected").html();
                    interpretation = interpretation + ': ' + $(id).prevAll("input#transport_summ:first").val() + '</dd>';
                });
            });
            interpretation = interpretation + "</dl>";
            $("table#prepareTransaction tbody").find("tr.interpretation:last").find("td").html($(interpretation));
        }

        // Ошибок нет; вернем true
        return true;
    }


    /**
     * Валидация поля "НДС"
     *
     * @returns {Boolean}
     */
    checkNdsField() {
        if (!(parseInt(cashType) === 0)) {
            // Для кассы "нал" проверку не делаем
            return true;
        }

        var fieldValue = this.ndsPayerTr.find('select[name="nds_payer"] option:selected').val();
        if (!(fieldValue === '1' || fieldValue === '0')) {
            return false;
        }

        return true;
    };

}

/**
 * Класс для описания интерфейса для типа транзакции "Прочее"
 * @param params
 */
function Other(params)
{
    this.defaultInfo = "<label>Расход будет списан сразу после сохранения транзакции</label>    <input type=\"button\" class=\"amd-btn amd-btn_primary\" value=\"Отменить\" id=\"cancelChargeOff\" />";

    this.info;

    this.alreadyCharged;

    this.chargeOffButton = '<input class="amd-btn amd-btn_primary" id="chargeOff" type="button" value="Списать" />';

    this.table = $("table#newTransaction");

    // Использовать ли блок предпросмотра транзакции
    this.usePrepareTable = true;

    // Установка значений
    if (typeof params == 'object') {
        for (var i in params) {
            this[i] = params[i];
        }
    }

    // Если транзакция новая, то установим сообщение по умолчанию
    if (0 == this.info) {
        this.info = this.defaultInfo;
    }

    this.interpretationHeadHtml = '<tr id="trTranscript"><td colspan="2"><a href="javascript:void(0);" class="transcript">Расшифровка</a></td></tr>';

    this.interpretationTrHtml = '<tr id="chargeOffTableTr"><td colspan="2"><table class="chargeOffTable"><thead><tr>'
            + '<td>Сумма</td><td>Дата</td><td>Порядковый номер</td><td>Пользователь</td></tr></thead><tbody></tbody>'
            + '<tfoot></tfoot></table>'
            + '<div class="otherExpensesFiles">'
            + '<div class="documentsTitle">Документы</div>'
            + '<div class="savedDocuments"><ul></ul></div>'
            + '</div>'
            + '</td></tr>';

    this.prepareInterpretationHeadHtml = '<tr class="interpretation"><td colspan="2" style="text-align: center; background-color: #3c698e;"><span style="color: #fff;font-size: 12px;font-weight: bold;text-decoration: none;">Расшифровка</span></td></tr>';
    this.prepareInterpretationHtml = '<tr id="chargeOffTableTrShow"><td colspan="2"><table class="chargeOffTableShow">'
            + '<thead><tr><td>Сумма</td><td>Дата</td><td>Порядковый номер</td><td>Пользователь</td></tr></thead>'
            + '<tbody></tbody><tfoot></tfoot></table></td></tr>';

    this.chargeOffchagesFlag = false;

    this.addInterpretationBlock = function()
    {
        var self = this;
        if (otherExpensesPermission > 0) {
            this.interpretationHead = $(this.interpretationHeadHtml);
            this.table.find("tfoot:first").find("tr:last").before(this.interpretationHead);
            this.interpretationHead.show();
            if (undefined == this.savedInterpretationBlock) {
                this.interpretationTr = $(this.interpretationTrHtml);
                if (otherExpensesPermission > 1) {
                    this.interpretationTr.find('table.chargeOffTable thead tr').append($('<td/>', {class: 'addNewChargeOffRow', text: '+'}));
                }
            } else {
                this.interpretationTr = $(this.savedInterpretationBlock);
            }
            this.chargeOffTable = this.interpretationTr.find('table.chargeOffTable');
            this.interpretationHead.after(this.interpretationTr);

            if (this.chargeOffTable.find('.chargeOffDate').length) {
                this.chargeOffTable.find('.chargeOffDate').datepicker();
            }

            if (this.usePrepareTable) {
                this.prepareTable.find("tbody").find("tr:last").after($(this.prepareInterpretationHeadHtml));
                this.prepareTable.find("tbody").find("tr:last").after($(this.prepareInterpretationHtml));
            }

            if (chargeOffRight > 0) {
                this.interpretationHead.find('.transcript').click(function ()
                {
                    self.interpretationTr.toggle();
                });
            } else {
                this.interpretationHead.hide();
            }

            if (this.documents.length) {
                // Если по списаниям есть документы, покажем их
                var cashTypeString = (cashType == 1) ? 'money' : 'account';
                this.documents.forEach(function(document){
                    var documentLi = $('<li/>');

                    var downloadLink = $('<a>', {
                        target: '_black',
                        text: document.name,
                        href: '/cash/' + cashTypeString + '/download-other-document?trId=' + self.trId + '&hash=' + document.hash
                    });

                    documentLi.append($('<div class="fileName">').append(downloadLink));

                    if (otherExpensesPermission > 1) {
                        // Добавляем ссылку на удаление только если есть права на редактирование списаний
                        var removeLink = $('<a>', {
                            class: 'icon-close',
                            href: '#'
                        }).append($('<img />', {src: '/img/system/remove.png'}));
                        documentLi.append($('<div class="close">').append(removeLink));

                        // Добавляем это поле только если есть права на редактирование списаний
                        documentLi.append($('<input>', {type: 'hidden', name: 'chargeOffSavedDocumentsHash[]', value: document.hash}));
                    }

                    self.table.find('.savedDocuments ul').append(documentLi);
                });
            }

            if (otherExpensesPermission < 2) {
                return;
            }

            // Если есть права на редактирование списаний, добавим пустой массив chargeOffSavedDocumentsHash[] на форму
            this.table.find('.savedDocuments').append($('<input type="hidden" name="chargeOffSavedDocumentsHash[]" value="">'));

            // Также добавим инпут для загрузки файлов
            this.table.find('.savedDocuments').before($('<div class="documentsUpload">'
                + '<input type="file" name="uploadedFiles[]" multiple="multiple">'
                + '</div>'
            ));

            // Вставим раздел, аналог "Расшифровки"
            this.chargeOffTable.find('tfoot').append($('<tr class="interpretation"><td colspan="5" align="center">'
                + '<input type="hidden" name="already_charged" id="already_charged" value="' + (this.alreadyCharged || '') + '" />'
                + '<input type="hidden" name="transport_claims[]" id="transport_claims" value="" />'
                + '<input type="hidden" name="transport_summ[]" id="transport_summ" value="" />'
                + '<input type="hidden" name="newCharge" id="newCharge" value="0" />'
                + '<span id="info">&nbsp;</span>'
                + '</td></tr>'));

            var id = parseInt(this.table.find("input#id[type='hidden']:first").val());

            switch (id) {
                case 0 :
                    // Если транзакция новая, то добавим кнопку для списания
                    this.chargeOffTable.find('tfoot').find("tr.interpretation td").find("span#info").html($(this.chargeOffButton));
                    break;
                default :
                    // Транзакция не новая. Надо запросить информацию
                    if (undefined == this.info) {
                        this.chargeOffTable.find('tfoot').find("tr.interpretation td").find("span#info").html($(this.chargeOffButton));
                    } else {
                        this.chargeOffTable.find('tfoot').find("tr.interpretation td").find("span#info").html(this.info);
                        this.chargeOffTable.find('tfoot').find("tr.interpretation td").find("input#transport_claims").val("-1");
                        this.chargeOffTable.find('tfoot').find("tr.interpretation td").find("input#transport_summ").val(this.table.find("input#summ").val());
                    }
                    break;
            }

            // Если транза новая, и кассир нажал кнопку "Списать"
            this.chargeOffTable.on('click', 'input#chargeOff[type="button"]', function(e){
                // Если транзакция новая
                var id = parseInt(self.table.find("input#id[type='hidden']").val());

                // Добавим в скрытую заявку значение -1 - признак того, что расход надо списать при сохранении
                // Сумму расхода сразу не записываю, т.к. кассир может ее изменить после нажатия "Списать"
                // Сумма будет записана при нажатии кнопки "Сохранить"
                self.chargeOffTable.find('tfoot').find("tr.interpretation td").find("input#transport_claims").val(-1);
                $(e.target).parent().html($(self.defaultInfo));
            });

            // Если транза новая, кассир нажал "Списать", а потом передумал
            this.chargeOffTable.on('click', 'input#cancelChargeOff[type="button"]', function(e){
                // Обнулим признак списания и сумму расхода
                self.chargeOffTable.find('tfoot').find("tr.interpretation td").find("input#transport_claims").val("");
                self.chargeOffTable.find('tfoot').find("tr.interpretation td").find("input#transport_summ").val("");
                $(e.target).parent().html($(self.chargeOffButton));
            });

            if (!chargeOffRight) {
                self.interpretationTr.find('input').attr('disabled', true);
            }
        }
    }

    /**
     * Удаляет блок "расшифровка"
     */
    this.removeInterpretationBlock = function()
    {
        if (otherExpensesPermission > 0) {
            if (this.interpretationHead)
                this.interpretationHead.remove();
            if (this.interpretationTr)
                this.interpretationTr.remove();
            if (this.usePrepareTable) {
                this.prepareTable.find("tr.interpretation").remove();
                this.prepareTable.find("tr#chargeOffTableTrShow").remove();
            }
        }
    }

    this.init = function ()
    {
        if ('tableSelector' in this && typeof this.tableSelector != 'undefined')
            this.table = $(this.tableSelector);

        if (this.usePrepareTable)
            this.prepareTable = $('table#prepareTransaction');

        if (undefined == this.documents)
            this.documents = [];

        this.addInterpretationBlock();
        this.disableChargeOffButton();
        this.bindEvents();
    }

    this.bindEvents = function()
    {
        if (otherExpensesPermission > 1) {
            var self = this;
            /**
             * Добавление нового списания
             */
            this.chargeOffTable.find('.addNewChargeOffRow').click(function() {
                var countChargeOffRows = self.chargeOffTable.find('tbody').find('tr').size() + 1;

                var newTr = $('<tr/>');
                var tdCashAmount = $('<td/>').append($('<input/>').addClass('chargeOffCashAmount').attr({type: 'text', name: 'chargeOffCashAmount[]'}));
                var tdDate = $('<td/>').append($('<input/>').addClass('chargeOffDate').val(dateNow).attr({name: 'chargeOffCashDate[]'}));
                var tdOrderNumber = $('<td/>').append($('<span/>').addClass('orderNumber').text('списание ' + countChargeOffRows));
                var tdUser = $('<td/>').append($('<span/>').text(userName));
                var tdRemove = $('<td/>').addClass('removeNewChargeOffRow').text('-');

                newTr.append(tdCashAmount);
                newTr.append(tdDate);
                newTr.append(tdOrderNumber);
                newTr.append(tdUser);
                newTr.append(tdRemove);

                self.chargeOffTable.find('tbody').append(newTr);

                tdDate.find('.chargeOffDate').datepicker();

                self.chargeOffchagesFlag = true;
                self.recalcOrderNumbers();
            });

            /**
             * Удаление списания
             */
            this.chargeOffTable.on('click', '.removeNewChargeOffRow', function(){
                $(this).parent().remove();
                self.recalcOrderNumbers();
            });

            /**
             * Удаляем из поля "Сумма" все символы, кроме цифр "0-9", "." и "-"
             * Символ "," заменяем на "."
             * Запрещаем вводить более 1 символа "."
             */
            this.chargeOffTable.on('change keyup input', '.chargeOffCashAmount', function(){
                this.value = this.value.replace(/[,]/g, '.');
                this.value = this.value.replace(/[^\d.-]/g, '');

                if (this.value[0] == '.') {
                    if (this.value[1] == '-') {
                        this.value = this.value.substr(2);
                        this.value = '-0.' + this.value;
                    } else {
                        this.value = '0' + this.value;
                    }
                }

                var strArray = this.value.split('.');

                if (strArray.length > 2) {
                    this.value = strArray[0] + '.' + strArray[1];
                }

                self.chargeOffchagesFlag = true;
            });

            /**
             * Если изменяется дата сипсания, то также изменим флаг списаний
             */
            this.chargeOffTable.on('change keyup input', '.chargeOffDate', function(){
                self.chargeOffchagesFlag = true;
            });

            /**
             * Исправление бага из-за несовместимости версий jQuery и Jquery UI
             */
            if (!$.curCSS)
                $.curCSS = $.css;

            var fixHelper = function(e, ui) {
                ui.children().each(function() {
                    $(this).width($(this).width());
                });
                return ui;
            };

            /**
             * Сортировка списаний Drag-n-drop
             */
            this.chargeOffTable.find("tbody").sortable({
                helper: fixHelper,
                update: function(event, ui) {
                    self.recalcOrderNumbers();
                }
            }).disableSelection();

            // При добавлении новых документов
            this.table.find(".documentsUpload input[type='file']").change(function(){
                self.chargeOffchagesFlag = true;
            });

            // При удалении документов
            if (chargeOffRight) {
                this.table.find(".savedDocuments .close img").click(function ()
                {
                    self.documents.splice($(this).parents('li').index(), 1);
                    $(this).parents('li').remove();
                    self.chargeOffchagesFlag = true;
                    return false;
                });
            }
        }
    }

    /**
     * Пересчет порядкого номера списания
     */
    this.recalcOrderNumbers = function() {

        var TRs = this.chargeOffTable.find('tbody').find('tr');

        $.each(TRs, function(i, tr) {
            i++;
            $(tr).find('td span.orderNumber').text('списание ' + i);
        })
        this.chargeOffchagesFlag = true;

        if (!(TRs.length)) {
            // Если нет строк, добавим кнопку списать
            this.chargeOffTable.find('tfoot').find("tr.interpretation td span#info").html($(this.chargeOffButton));
        }

        this.disableChargeOffButton();
    }

    this.disableChargeOffButton = function() {
        if (undefined != this.chargeOffTable) {
            if (this.chargeOffTable.find('tbody').find('tr').length) {
                // Если в таблице добавлены строки для списаний, раздизаблим кнопку
                this.chargeOffTable.find('tfoot').find("tr.interpretation td span#info input[type='button']#chargeOff").removeAttr('disabled');
            } else {
                // Если их нет, задизаблим
                this.chargeOffTable.find('tfoot').find("tr.interpretation td span#info input[type='button']#chargeOff").attr('disabled', 'disabled');
            }
        }
    }

    // при выборе другого типа транзакции надо все за собой почистить
    this.destruct = function()
    {
        if (this.chargeOffTable != undefined) {
            this.chargeOffTable.find('.chargeOffTable tbody').empty();
            this.chargeOffTable.find('.chargeOffTable tfoot').empty();

            this.chargeOffTable.find("input#chargeOff[type='button']").unbind("click");
            this.chargeOffTable.find("input#cancelChargeOff[type='button']").unbind("click");
        }

        this.removeInterpretationBlock();
    }

    /**
     * Проверяет значение поля сумма на соответствие формату
     *
     * @param {type} summ Проверяемое значение
     * @returns {Boolean}
     */
    this.checkFieldSumm = function(summ) {
        return /^-?\d+\.?\d*$/.test(summ);
    }

    // Сохранение транзакции
    this.info = function()
    {
        var table = this.table;

        var self = this;

        // Перед сохранением запишем сумму списания, если списание "заказано"
        // Или если списание уже есть, но изменилась сумма
        //if ("" != table.find("tr.interpretation td").find("input#transport_claims").val()
        if (table.find("tr.interpretation td").find("input#cancelChargeOff[type='button']").length > 0
            || table.find("tr.interpretation td").find("input[type='button']").length == 0
            && table.find("input#summ").val() != table.find("tr.interpretation td").find("input#transport_summ").val()) {

            // "Закажем" списание принудительно и обновим сумму
            table.find("tr.interpretation td").find("input#transport_claims").val("-1");
            table.find("tr.interpretation td").find("input#transport_summ").val(table.find("input#summ").val());
        }

        if (otherExpensesPermission > 0) {
            var TRs = self.table.find('table.chargeOffTable tbody').find('tr');

            if (otherExpensesPermission > 1) {
                var errors = false;

                if (TRs.size()) {
                    // Проверим на выбор документов
                    var uploadDocumentsInput = this.table.find(".documentsUpload input[type='file']");
                    if (!Lib_Access.get('access', 'cash>' + cashTypeStr + '>access>extendedtransactions>other>upload_not_require')) {
                        if (!(this.documents.length) && !(uploadDocumentsInput.val())) {
                            // Если у нас нет ни сохраненных документов, ни выбранных для загрузки документов
                            alert('Для того, чтобы выполнить списание, сначала выберите документ(ы)');
                            return false;
                        }
                    }

                    if (self.chargeOffchagesFlag && self.table.find('#chargeOff').length) {
                        alert('Для того, чтобы произошло списание, необходимо нажать на кнопку "Списать"');
                        return false;
                    }

                    var cashAmount = 0;

                    $.each(TRs, function(i, tr) {
                        tr = $(tr);

                        var trVal = tr.find('.chargeOffCashAmount').val();

                        cashAmount = cashAmount + parseFloat(trVal);

                        if (!trVal || !self.checkFieldSumm(trVal)) {
                            alert('Неверно заполнено поле сумма в списании');
                            errors = true;
                            return false;
                        }
                    });

                    var trSumm = parseFloat(self.table.find('#summ:first').val());
                    var trSummConv = 0;
                    var cashAmountConv = 0;
                    var cashError = false;

                    if (trSumm < 0 && cashAmount > 0 || trSumm > 0 && cashAmount < 0) {
                        cashError = true;
                    } else {
                        if (trSumm < 0 && cashAmount < 0) {
                            trSummConv = -trSumm;
                            cashAmountConv = -cashAmount;
                        } else {
                            trSummConv = trSumm;
                            cashAmountConv = cashAmount;
                        }
                    }

                    if (cashError) {
                        alert('Некорректная сумма списаний');
                        return false;
                    }

                    cashAmountConv = parseFloat(cashAmountConv.toFixed(2));
                    trSummConv = parseFloat(trSummConv.toFixed(2));

                    if (cashAmountConv > trSummConv) {
                        alert('Сумма списаний не должна превышать суммы транзакции');
                        return false;
                    }

                    if (errors) {
                        return false;
                    }
                }

                if (
                    self.chargeOffchagesFlag === true           // если были изменения по списаниям
                    || !self.table.find('#chargeOff').length    // или нажата кнопка "Списать"
                ) {
                    // Установим флаг newCharge
                    this.chargeOffTable.find('tfoot').find("tr.interpretation td").find("input#newCharge").val("1");
                } else {
                    this.chargeOffTable.find('tfoot').find("tr.interpretation td").find("input#newCharge").val("0");
                }
            }

            if (TRs.size()) {
                var chargeOffTableShow = $('.chargeOffTableShow');

                chargeOffTableShow.empty();

                $.each(TRs, function(i, tr) {
                    tr = $(tr);

                    if (otherExpensesPermission == 2) {
                        var trCashVal = parseFloat(tr.find('.chargeOffCashAmount').val());
                        var trDateVal = tr.find('.chargeOffDate').val();
                        var trNumber = tr.find('.orderNumber').text();
                        var trName = tr.find('span:last').text();

                        var newTr = $('<tr/>');
                        var newTdCash = $('<td/>').text(trCashVal);
                        var newTdDate = $('<td/>').text(trDateVal);
                        var newTdNumber = $('<td/>').text(trNumber);
                        var newTdName = $('<td/>').text(trName);

                        newTr.append(newTdCash);
                        newTr.append(newTdDate);
                        newTr.append(newTdNumber);
                        newTr.append(newTdName);

                        chargeOffTableShow.append(newTr);
                    } else {
                        var trCashVal = '';
                        var trDateVal = '';
                        var trNumber = '';
                        var trName = '';
                        var TDs = tr.find('td');

                        $.each(TDs, function(j, td){
                            td = $(td);

                            switch(j) {
                                case 0:
                                    trCashVal = td.text();
                                    break;
                                case 1:
                                    trDateVal = td.text();
                                    break;
                                case 2:
                                    trNumber = td.text();
                                    break;
                                case 3:
                                    trName = td.text();
                                    break;
                            }
                        });

                        var newTr = $('<tr/>');
                        var newTdCash = $('<td/>').text(trCashVal);
                        var newTdDate = $('<td/>').text(trDateVal);
                        var newTdNumber = $('<td/>').text(trNumber);
                        var newTdName = $('<td/>').text(trName);

                        newTr.append(newTdCash);
                        newTr.append(newTdDate);
                        newTr.append(newTdNumber);
                        newTr.append(newTdName);

                        chargeOffTableShow.append(newTr);
                    }
                });
            }
        }

        return true;
    }
}

/**
 * Класс для описания интерфейса для типа транзакции "Бензин"
 * @param params
 */
function Petrol(params)
{
    this.selectEmpty = '';

    this.table = $("table#newTransaction");

    this.clientId = null;

    this.depotId = null;

    this.dataNotFound = '';

    this.userList = [];

    this.userId = null;

    // Блок сотрудника
    this.blockClaims = '<tr class="transport_claims">'
        + '<td><label class="required" tag="" for="interpretationClient">Сотрудник</label></td>'
        + '<td>'
        + '<input type="text" style="margin: 0px 0px 7px 0px;" class="cashSelect" value="" id="userName" name="userName">'
        + '<select id="transport_claims" name="transport_claims[]" class="cashSelect">' + this.selectEmpty + '</select>'
        + '<input type="hidden" name="transport_summ[]" id="transport_summ" />'
        + '</td></tr>';

    // Блок заявок для предосмотра
    this.blockClaimsPrepare = '<tr>'
        + '<td><label>Сотрудник</label></td>'
        + '<td><span val="" id="prepareClaims"></span></td>'
        + '</tr>';

    // Использовать ли блок предпросмотра транзакции
    this.usePrepareTable = true;

    this.init = function ()
    {
        var _self = this;

        this.clientId.change(function (e) {
            _self.refreshDepot();
        });

        if (! this.table.find("tr.transport_claims").length) {
            this.addUserBlock();
        }
    }

    this.destruct = function ()
    {
    	var prepTable = $("table#prepareTransaction");
        // Удалим блок заявок
		this.table.find("tr.transport_claims").remove();
        if (this.usePrepareTable)
            prepTable.find("span#prepareClaims").parents("tr:first").remove();

        this.clientId.unbind();

        // Покажем склад
        this.depotId.unbind().parents("tr:first").show();

        if (this.usePrepareTable)
            prepTable.find("span#prepareDepot").parents("tr:first").show();

        // "Отвязывание" событий
        this.table.find("input#userName").unbind("keyup");
        this.table.find("select#transport_claims").unbind("change");    // Быбор заявки
    }

    /**
     * Добавить блок заявок
     */
    this.addUserBlock = function ()
    {
    	var _self = this;
        this.depotId.parents("tr:first").hide().after($(this.blockClaims));

        if (this.usePrepareTable)
            $("#prepareTransaction").find("span#prepareDepot").parents("tr:first").hide().after($(this.blockClaimsPrepare));

        // Надо заполнить список сотрудниками
        $.ajax({
        	async: false,
        	type: 'POST',
        	url: linkPrefix + '/cash/ajax/getusers',
        	//dataType: 'json',
        	success: function(data) {
        		_self.table.find("select#transport_claims").html($(data));

        		// ПОдвесим событие на поиск по вхождению
        		_self.table.find("input#userName").keyup(function(e) {
        			_self.keyup(e);
    			});

        		// После окончания фильтрации поиска принудительно вызываем смену пользователя
        		_self.table.find("input#userName").blur(function(e) {
        			_self.table.find("select#transport_claims").trigger('change');
        		});

        		_self.table.find("select#transport_claims").change(function() {
        			_self.refreshDepot();
        		});

        		// Если установлен пользователь, то покажем его
        		if (null != _self.userId) {
        			_self.table.find("select#transport_claims").val(_self.userId);
        		}

        	}
        });
    }


    this.refreshDepot = function ()
    {
        var select = this.table.find("select#transport_claims");
        var _self = this;

        $.ajax({
            async   : false,
            type    : 'POST',
            url     : linkPrefix + '/cash/ajax/getdepotbyuser',
            data    : {user_id    : select.val()},
            success : function (data) {
            	var depot = _self.depotId;
                if (null == data) {
                    depot.val(2);
                } else {
                    depot.val(parseInt(data));
                }
            }
        });
    }

    // Валидация формы в целом
    this.checkForm = function ()
    {
        var error = "";

        // Должен быть указан сотрудник
        if (0 == this.table.find("select#transport_claims").val()) {
            error = "Не указан сотрудник";
        }

        if (error.length > 0) {
            return error;
        }

        // Запишем сумму транзакции в поле
        this.table.find("input#transport_summ:first").val(parseFloat(this.table.find("input#summ").val()));

        // Если все нормально, то вернем пустую строку
        return "";
    }

    // Сохранение транзакции
    this.info = function()
    {
        var error = this.checkForm();

        if (error.length > 0) {
            alert(error);
            return false;
        }
        //var table = $("table#newTransaction");

        if (this.usePrepareTable) {
            var prepareTable = $("table#prepareTransaction");
            prepareTable.find('#prepareClient').html(this.clientId.find("option:selected").text());
            prepareTable.find("span#prepareClaims").html(this.table.find("select#transport_claims").find("option:selected").text());
        }

        // Ошибок нет; вернем true
        return true;
    }

    this.keyup = function(e) {
        var node = document.getElementById('transport_claims');
        var options = node.options;

        if (!this.userList.length) {
            for (var i = 0; i < options.length; i++) {
                this.userList.push({id: options[i].value, text: options[i].text.replace(/^\s+|\s+$/, '')});
            }
        }
        options.length = 0;
        var search = $(e.target).val().toLowerCase().replace(/^\s+|\s+$/, '');
        for (var i = 0; i < this.userList.length; i++) {
            if (search.length && this.userList[i].text.toLowerCase().indexOf(search) == -1) {
                continue;
            }
            var item = options.length;
            options[item] = new Option(this.userList[i].text, this.userList[i].id);
        }
    }

    // Установка значений
    if (typeof params == 'object') {
        for (var i in params) {
            if ("claimsSelect" == i) {
                this[i] = params[i] + this[i];
            } else {
                this[i] = params[i];
            }
        }
    }

    if ('tableSelector' in this && typeof this.tableSelector != 'undefined')
        this.table = $(this.tableSelector);

    if (null == this.depotId) {
    	this.depotId = this.table.find('select#depot_id');
    } else {
    	this.depotId = this.table.find('select.' + this.depotId);
    }

    if (null == this.clientId) {
    	this.clientId = this.table.find('select#client_id');
    } else {
    	this.clientId = this.table.find('select#' + this.clientId);
    }
}

/**
 * Класс для описания интерфейса для типа транзакции "Аванс"
 * @param params
 */
function Prepayment(params)
{
    this.userId = null;

    this.table = $("table#newTransaction");

    this.depotId = null;

    this.clientId = null;

    this.quickSearch = null;

    this.id;

    this.newTransactionObject;

    this.usePrepareTable = true;

    this.init = function ()
    {
        var _self = this;

        _self.depotId.change(function(e) {
            _self.getUsers();
            // Обнулим список клиентов для быстрого поиска
            if (null != _self.id) {
                clientsList[_self.id] = [];
            } else {
                clientsList = [];
            }
        });
    }

    this.destruct = function ()
    {
    	var _self = this;
    	_self.depotId.unbind();
    }

    /**
     * Перезаписать пользователей в поле клиента
     */
    this.getUsers = function() {
        var _self = this;
        this.userId = _self.clientId.val();
        // Надо заполнить список сотрудниками
        $.ajax({
            async: false,
            type: 'POST',
            url: '/cash/ajax/getusers',
            data: {'depotId': _self.depotId.val()},
            success: function(data) {
                _self.clientId.html($(data));

                // Если установлен пользователь, то покажем его
                if (null != _self.userId) {
                    _self.clientId.val(_self.userId);
                }
            }
        });
    }

    // Валидация формы в целом
    this.checkForm = function() {
        var _self = this;
        var errors = [];

        // Должен быть указан сотрудник
        if (0 == _self.table.find("select#transport_claims").val()) {
            errors.push("Не указан сотрудник");
        }

        if (
            !this.newTransactionObject.access.extendedtransactions.advance ||
            !parseInt(this.newTransactionObject.access.extendedtransactions.advance.upload_not_required)
        ) {
            if (cashModule.id && !this.newTransactionObject.files.checkFileCount()) {
                errors.push("Аванс: Необходимо прикрепить файл");
            }
        }

        if (errors.length > 0) {
            return errors.join('\r\n');
        }

        // Запишем сумму транзакции в поле
        _self.table.find("input#transport_summ:first").val(parseFloat(_self.table.find("input#summ").val()));

        // Если все нормально, то вернем пустую строку
        return "";
    };

    // Сохранение транзакции
    this.info = function()
    {
        var _self = this;
        var error = this.checkForm();

        if (error.length > 0) {
            alert(error);
            return false;
        }

        var userOption = this.clientId.get(0).options[this.clientId.get(0).selectedIndex];

        if (+userOption.dataset.isDismiss) {
            if (!window.confirm('Внимание! Данный сотрудник уволен ' + userOption.dataset.dateDismiss.replace(/(\d+)-(\d+)-(\d+)/, '$3.$2.$1') + ', вы хотите провести транзакцию?')) {
                return false;
            }
        }

        //var table = $("table#newTransaction");
        if (this.usePrepareTable) {
            var prepareTable = $("table#prepareTransaction");
            prepareTable.find('#prepareClient').html(_self.clientId.find("option:selected").text());
            prepareTable.find("span#prepareClaims").html(_self.table.find("select#transport_claims").find("option:selected").text());
        }

        // Ошибок нет; вернем true
        return true;
    }

    // Установка значений
    if (typeof params == 'object') {
        for (var i in params) {
            if ("claimsSelect" == i) {
                this[i] = params[i] + this[i];
            } else {
                this[i] = params[i];
            }
        }
    }

    if ('tableSelector' in this && typeof this.tableSelector != 'undefined')
        this.table = $(this.tableSelector);

    if (null == this.depotId) {
        this.depotId = this.table.find('select#depot_id');
    } else {
        this.depotId = this.table.find('select.' + this.depotId);
    }

    if (null == this.clientId) {
        this.clientId = this.table.find('select#client_id');
    } // иначе если передали объект JQuery, то ничего не делаем
    else if (this.clientId instanceof $){
        // this.clientId
    } else {
        this.clientId = this.table.find('select#' + this.clientId);
    }
}

/**
 * Класс для описания интерфейса для типа транзакции "Узбеки". Полная копия (или почти) транзакции типа "Бензин".
 *
 * @param params
 */
function Patent(params)
{
    this.userId = null;

    this.table = $("table#newTransaction");

    this.depotId = null;

    this.clientId = null;

    this.quickSearch = null;

    this.id;

    this.usePrepareTable = true;

    this.init = function ()
    {
        var _self = this;

        _self.depotId.change(function(e) {
            _self.getUsers();
            // Обнулим список клиентов для быстрого поиска
            if (null != _self.id) {
                clientsList[_self.id] = [];
            } else {
                clientsList = [];
            }
        });
    };

    this.destruct = function ()
    {
    	var _self = this;
    	_self.depotId.unbind();
    };

    /**
     * Перезаписать пользователей в поле клиента
     */
    this.getUsers = function()
    {
        var _self = this;
        this.userId = _self.clientId.val();
        // Надо заполнить список сотрудниками
        $.ajax({
            async: false,
            type: 'POST',
            url: '/cash/ajax/getusers',
            data: {'depotId': _self.depotId.val()},
            success: function(data) {
                _self.clientId.html($(data));

                // Если установлен пользователь, то покажем его
                if (null != _self.userId) {
                    _self.clientId.val(_self.userId);
                }
            }
        });
    };

    // Валидация формы в целом
    this.checkForm = function() {
        var _self = this;
        var error = "";

        // Должен быть указан сотрудник
        if (0 == _self.table.find("select#transport_claims").val()) {
            error = "Не указан сотрудник";
        }

        if (error.length > 0) {
            return error;
        }

        // Запишем сумму транзакции в поле
        _self.table.find("input#transport_summ:first").val(parseFloat(_self.table.find("input#summ").val()));

        // Если все нормально, то вернем пустую строку
        return "";
    };

    // Сохранение транзакции
    this.info = function()
    {
        var _self = this;
        var error = this.checkForm();

        if (error.length > 0) {
            alert(error);
            return false;
        }

        var userOption = this.clientId.get(0).options[this.clientId.get(0).selectedIndex];

        if (+userOption.dataset.isDismiss) {
            if (!window.confirm('Внимание! Данный сотрудник уволен ' + userOption.dataset.dateDismiss.replace(/(\d+)-(\d+)-(\d+)/, '$3.$2.$1') + ', вы хотите провести транзакцию?')) {
                return false;
            }
        }

        //var table = $("table#newTransaction");
        if (this.usePrepareTable) {
            var prepareTable = $("table#prepareTransaction");
            prepareTable.find('#prepareClient').html(_self.clientId.find("option:selected").text());
            prepareTable.find("span#prepareClaims").html(_self.table.find("select#transport_claims").find("option:selected").text());
        }

        // Ошибок нет; вернем true
        return true;
    };

    // Установка значений
    if (typeof params == 'object') {
        for (var i in params) {
            if ("claimsSelect" == i) {
                this[i] = params[i] + this[i];
            } else {
                this[i] = params[i];
            }
        }
    };

    if ('tableSelector' in this && typeof this.tableSelector != 'undefined')
        this.table = $(this.tableSelector);

    if (null == this.depotId) {
        this.depotId = this.table.find('select#depot_id');
    } else {
        this.depotId = this.table.find('select.' + this.depotId);
    }

    if (null == this.clientId) {
        this.clientId = this.table.find('select#client_id');
    } else {
        this.clientId = this.table.find('select#' + this.clientId);
    }
}


/**
 * Класс для описания интерфейса для типа транзакции "Процент"
 *
 * @param params
 */
function Percent(params)
{
    this.userId = null;

    this.table = $("table#newTransaction");

    this.depotId = null;

    this.clientId = null;

    this.quickSearch = null;

    this.id;

    this.usePrepareTable = true;


    this.init = function ()
    {
        var _self = this;

        _self.depotId.change(function(e) {
            _self.getUsers();
            // Обнулим список клиентов для быстрого поиска
            if (null != _self.id) {
                clientsList[_self.id] = [];
            } else {
                clientsList = [];
            }
        });
    };


    this.destruct = function ()
    {
    	var _self = this;
    	_self.depotId.unbind();
    };


    /**
     * Перезаписать пользователей в поле клиента
     */
    this.getUsers = function() {
        var _self = this;
        this.userId = _self.clientId.val();
        // Надо заполнить список сотрудниками
        $.ajax({
            async: false,
            type: 'POST',
            url: '/cash/ajax/getusers',
            data: {'depotId': _self.depotId.val()},
            success: function(data) {
                _self.clientId.html($(data));

                // Если установлен пользователь, то покажем его
                if (null != _self.userId) {
                    _self.clientId.val(_self.userId);
                }
            }
        });
    };


    // Валидация формы в целом
    this.checkForm = function() {
        var _self = this;
        var error = "";

        // Должен быть указан сотрудник
        if (0 == _self.table.find("select#transport_claims").val()) {
            error = "Не указан сотрудник";
        }

        if (error.length > 0) {
            return error;
        }

        // Запишем сумму транзакции в поле
        _self.table.find("input#transport_summ:first").val(parseFloat(_self.table.find("input#summ").val()));

        // Если все нормально, то вернем пустую строку
        return "";
    };


    // Сохранение транзакции
    this.info = function()
    {
        var _self = this;
        var error = this.checkForm();

        if (error.length > 0) {
            alert(error);
            return false;
        }
        //var table = $("table#newTransaction");
        if (this.usePrepareTable) {
            var prepareTable = $("table#prepareTransaction");
            prepareTable.find('#prepareClient').html(_self.clientId.find("option:selected").text());
            prepareTable.find("span#prepareClaims").html(_self.table.find("select#transport_claims").find("option:selected").text());
        }

        // Ошибок нет; вернем true
        return true;
    };


    // Установка значений
    if (typeof params == 'object') {
        for (var i in params) {
            if ("claimsSelect" == i) {
                this[i] = params[i] + this[i];
            } else {
                this[i] = params[i];
            }
        }
    }

    if ('tableSelector' in this && typeof this.tableSelector != 'undefined') {
        this.table = $(this.tableSelector);
    }

    if (null === this.depotId) {
        this.depotId = this.table.find('select#depot_id');
    } else {
        this.depotId = this.table.find('select.' + this.depotId);
    }

    if (null === this.clientId) {
        this.clientId = this.table.find('select#client_id');
    } else {
        this.clientId = this.table.find('select#' + this.clientId);
    }
}

/**
 * Класс для описания интерфейса для типа транзакции "Возвратные платежи (родительская)"
 *
 * @param params
 */
function MoneyReturnParent(params)
{
    /**
     * Использовать или нет таблицу предпросмотра
     */
    this.usePrepareTable = true;
    /**
     * тип тарифа 0 - Стандартный, 1 - тариф+комиссия
     */
    this.tariffType = 0;
    /**
     * флаг спец тарифа
     */
    this.tariffSpecial = 0;
    /**
     * Максимальная разница в рублях
     */
    this.maxDifference = 10;
    /**
     * текущий тариф клиента
     */
    this.curTariff;

    /**
     * Инициализация
     */
    this.init = function ()
    {
        if ('tableSelector' in this && typeof this.tableSelector !== 'undefined') {
            this.table = $(this.tableSelector);
        } else {
            this.table = $("table#newTransaction");
        }
        this.prepareTable = $("table#prepareTransaction");

        this.initFields();

        if (this.savedInterpretation) {
            this.tariffType = this.savedInterpretation.tariff.type;
            this.rateInput.val(this.savedInterpretation.tariff.rate);
            this.commissionInput.val(this.savedInterpretation.tariff.commission);

            this.updateReturn();
        }
    };


    /**
     * Возвращает идентификтаор транзакции
     *
     * @returns {Integer|undefined}
     */
    this.getTrId = function() { return parseInt(this.table.find('input[type="hidden"][name="id"]').val())||undefined; };


    /**
     * Инициализация полей
     * @returns {undefined}
     */
    this.initFields = function ()
    {
        var self = this;

        this.clientIdSelect = this.clientIdSelect || this.table.find("select#client_id");
        this.sumInput = this.sumInput || this.table.find('input#summ');
        this.reasonInput = this.reasonInput || this.table.find('textarea#reason');

        this.reasonInput.parents('tr:first').hide(); // Скрываем поле "Основание"

        //if (this.usePrepareTable) {
        //    this.prepareTable.find('div#prepareReason').parents('tr:first').hide(); // Скрываем поле "Основание" в предпросмотре
        //}
        //if (this.usePrepareTable) {
        //
        //}

        this.returnTr = $('<tr>'
                + '<td><label class="required">Сумма с учетом тарифа:</label></td>'
                + '<td><input type="text" readonly="readonly"></td>'
                + '</tr>');
        this.returnInput = this.returnTr.find('input');
        this.sumInput.parents('tr:first').after(this.returnTr);

        this.tariffTr = $('<tr>'
                + '<td><label class="required">Тариф:</label></td>'
                + '<td id="tariff_title">&nbsp;</td></tr>'
                + '<tr><td><label class="required">Ставка (%):</label></td>'
                + '<td><input type="text" name="tariff[rate]" value="" id="tariff_rate"></td></tr>'
                + '<tr id="commission_tr"><td><label>Комиссия:</label></td>'
                + '<td><input type="text" name="tariff[commission]" value="" id="tariff_commission"></label></td></tr>');
        this.rateInput = this.tariffTr.find('#tariff_rate');
        this.commissionInput = this.tariffTr.find('#tariff_commission');
        this.sumInput.parents('tr:first').after(this.tariffTr);

        this.sumInput.on('change input', function () {
            self.onlyFloat(this);
            this.value = '-' + Math.abs(this.value);
            self.updateReturn();
        });
        this.rateInput.on('change input', function () {
            self.onlyFloat(this, 3);
            self.updateReturn();
        });
        this.commissionInput.on('change input', function () {
            self.onlyFloat(this);
            self.updateReturn();
        });

        this.clientIdSelect.on('change', function () {
            self.getTariff();
        });

        this.sumInput.trigger('change');
        this.clientIdSelect.trigger('change');
    };

    /**
     * Фильтрация вводимого значения
     * @param {domElement} e
     * @param {number} precession
     * @returns {undefined}
     */
    this.onlyFloat = function (e, precession)
    {
        precession=precession||2;
        e.value = e.value.replace(/[,]/g, '.');
        e.value = e.value.replace(/[^\-\d.]/g, '');

        if (e.value[0] === '.') {
            e.value = '0' + e.value;
        }

        var strArray = e.value.split('.');

        if (strArray.length > 2) {
            e.value = strArray[0] + '.' + strArray[1];
        } else {
            if (strArray.length === 2 && strArray[1] !== "" && strArray[1] !== "0") {
                if (precession != 3 || strArray[1].length !== 2 || strArray[1][1] !== "0") {
                    var m = Math.pow(10, precession);
                    e.value = Math.round(e.value * m) / m;
                }
            }
        }
    };

    /**
     * Обновление суммы с учетом тарифа
     * @returns {undefined}
     */
    this.updateReturn = function ()
    {
        var rate        = this.getRate();
        var commission  = this.getCommission();
        var sum         = Math.abs(parseFloat(this.sumInput.val())) || 0;

        var moneyReturn = sum - rate * sum / 100;

        if(this.tariffType){
            moneyReturn -= commission;
        }
        moneyReturn = Math.round(moneyReturn * 100) / 100;
        this.returnInput.val(moneyReturn);
        this.reasonInput.val('Тариф: ' + rate + '%' + (this.tariffType == '1' ? '+' + commission : '') + '. Возврат: ' + moneyReturn + '.');
    };

    /**
     * Сумма при инициализации
     * @returns {Number}
     */
    this.getInitialSum = function() { return parseFloat(this.sumInput.get(0).defaultValue); };


    /**
     * Метод возвращает TRUE, если значение поля "Сумма" было изменено
     *
     * @returns {Boolean}
     */
    this.sumIsChanged = function() { return this.getInitialSum() !== this.getSumValue(); };


    /**
     * Метод возвращает TRUE, если значение поля "Клиент" было изменено
     *
     * @returns {Boolean}
     */
    this.clientIdIsChanged = function()
    {
        var defaultSelectedOption = this.clientIdSelect.find('option').map(function() { if(this.defaultSelected === true) return this; });
        if (defaultSelectedOption.length) {
            var initialClientId = defaultSelectedOption.get(0).value;
        } else {
            var initialClientId = 0;
        }
        return parseInt(initialClientId) !== parseInt(this.clientIdSelect.val());
    };


    /**
     * Получение тарифа и прав
     */
    this.getTariff = function ()
    {
        var self = this;
        var clientId = this.getClientId();
        var tariffTitle = 'Стандартный тариф';
        self.tariffType = 0;
        self.tariffSpecial = 0;
        self.curTariff = null;
        if (!clientId) {
            self.rateInput.val('');
            self.commissionInput.val('');

            self.rateInput.prop({readonly: false});
            self.commissionInput.prop({readonly: false});
        } else {
            $.ajax({
                async: false,
                type: 'POST',
                url: '/cash/ajax/gettariffreturn',
                data: {client_id: clientId},
                success: function (data) {

                    readOnly = !data.access || (!self.savedInterpretation && data.tariff.special);

                    self.rateInput.val(data.tariff.rate);
                    self.commissionInput.val(data.tariff.commission);

                    self.rateInput.prop({readonly: readOnly});
                    self.commissionInput.prop({readonly: readOnly});

                    if(readOnly && data.tariff.special){
                        self.rateInput.addClass('text-danger');
                        self.commissionInput.addClass('text-danger');
                    }else{
                        self.rateInput.removeClass('text-danger');
                        self.commissionInput.removeClass('text-danger');
                    }

                    self.curTariff = data.tariff || {type: 0, special: 0, rate: 0, commission: 0};
                    self.tariffType = parseInt(self.curTariff.type);
                    self.tariffSpecial = parseInt(self.curTariff.special);
                }
            });
        }
        if (self.tariffType) {
            tariffTitle = 'Тариф + комиссия';
            $(self.tariffTr[2]).show();
        } else {
            $(self.tariffTr[2]).hide();
        }
        self.tariffTr.find('#tariff_title').text(tariffTitle + (self.tariffSpecial && !self.savedInterpretation ? ' (спец. тариф)' : ''));
        self.updateReturn();
    };


    /**
     * Возвращает идентификатор выбранного клиента
     *
     * @returns {ineger}
     */
    this.getClientId = function() { return parseInt(this.clientIdSelect.val()); };

    /**
     * Возвращает идентификатор выбранного клиента
     *
     * @returns {ineger}
     */
    this.getReturnSum = function() { return parseFloat(this.returnInput.val()); };

    /**
     * Возвращает процентную ставку
     *
     * @returns {float}
     */
    this.getRate = function() { return parseFloat(this.rateInput.val()) || 0; };

    /**
     * Возвращает коммиссию
     *
     * @returns {float}
     */
    this.getCommission = function() { return parseFloat(this.commissionInput.val()) || 0; };


    /**
     * Сброс обработчика поля "Назначение платежа"
     */
    this.resetTransactionTypeEvents = function()
    {
        // Убираем обработчики с "Назначения платежа", добавляем стандартную логику
        this.table.find('select#transaction_type').unbind();
        window.newTransactionObject.bindTransactionTypeChangeEvent();
    };


    /**
     * Валидация формы
     */
    this.checkForm = function ()
    {
        var errors = new Array();
        var childrenSum = 0;

        if (!this.checkSumField()) {
            errors.push(' - неверно указано значение поля "Сумма"');
        }

        if ((childrenSum = this.checkChildren())) {
            errors.push(' - есть дочерние транзакции на сумму: ' + childrenSum);
        }

        if ((childrenSum = this.checkChildrenMoney())) {
            errors.push(' - дочерняя транзакция должна полностью покрывать родительскую');
        }

        this.checkTariff();

        if($('input[name^=tariff]:visible[value=]').length){
            errors.push(' - укажите параметры тарифа');
        }

        return errors;
    };

    /**
     * Проверить изменения тарифа
     * @returns {Boolean}
     */
    this.checkTariff = function () {
        if (this.savedInterpretation && !this.clientIdIsChanged()) {
            return true;
        }
        if (!this.curTariff || Math.abs(this.curTariff.rate - this.getRate()) > 0.00001 || (this.tariffType == '1' && Math.abs(this.curTariff.commission - this.getCommission()) > 0.00001)) {
            alert('Новый тариф будет действовать с сегодняшнего числа');
        }
    };

    /**
     * Проверяем дочерние транзакции
     * @returns {integer}
     */
    this.checkChildren = function () {
        if (!this.savedInterpretation || !this.savedInterpretation.children) {
            return false;
        }
        var sum = 0.0;
        var returnSum = this.getReturnSum();
        var children = this.savedInterpretation.children;

        for(var ct in children){
            for(var i in children[ct]){
                sum+=parseFloat(children[ct][i].summ);
            }
        }
        //if (sum < returnSum || Math.abs(sum - returnSum) < 0.00001) {
        if (sum - returnSum > this.maxDifference) {
            return sum;
        }

        return false;
    };

    /**
     * Дополнительная проверка доч. для типа нал
     * @returns {Boolean|Number}
     */
    this.checkChildrenMoney = function(){
        if (!cashType || !this.savedInterpretation || !this.savedInterpretation.children) {
            return false;
        }
        var sum = 0.0;
        var returnSum = this.getReturnSum();
        var children = this.savedInterpretation.children;

        for(var ct in children){
            for(var i in children[ct]){
                sum+=parseFloat(children[ct][i].summ);
            }
        }

        if (Math.abs(sum - returnSum) > this.maxDifference) {
            return sum;
        }

        return false;

    };

    /**
     * Проверка поля "Сумма"
     *
     * @returns Boolean
     */
    this.checkSumField = function()
    {
        var sumValue = this.getSumValue();
        return (sumValue && sumValue !== '' && !isNaN(sumValue) && sumValue < 0 && this.checkFloat(sumValue, false));
    };


    /**
     * Возвращает значение поля "Сумма"
     *
     * @returns float
     */
    this.getSumValue = function()
    {
        return parseFloat(this.sumInput.val());
    };


    /**
     * Проверка переданное введённое float-значение
     *
     * @param {type} value          Проверяемое значение
     * @param {type} positiveCheck  Проверять ли на положительность
     *
     * @returns Boolean
     */
    this.checkFloat = function(value, positiveCheck)
    {
        if (positiveCheck === undefined || positiveCheck === false) {
            return /^-?\d+\.?\d*$/.test(value);
        } else if (positiveCheck === true) {
            return /^\d+\.?\d*$/.test(value);
        } else {
            throw new Error('неверно указано значение "positiveCheck"');
        }
    };


    /**
     * Сохранение транзакции
     */
    this.info = function()
    {
        var errors = this.checkForm();
        if (errors.length > 0) {
            alert('Ошибки:' + String.fromCharCode(10, 13) + errors.join(String.fromCharCode(10, 13)));
            return false;
        }
        if (this.usePrepareTable) {
            this.populatePrepareTable();
        }
        // Ошибок нет: вернем true
        return true;
    };


    /**
     * Заполняет таблицу предпросмотра транзакции
     */
    this.populatePrepareTable = function()
    {

    };


    /**
     * Деструктор объекта
     */
    this.destruct = function()
    {
        this.destructFields();
    };


    /**
     * Уничтожение дополнительных полей формы
     */
    this.destructFields = function()
    {

        // Возвращаем стандартную проверку поля "Сумма"
        this.sumInput.unbind();
        bindSummKeyupEvent(this.sumInput);

        this.table.find('select#client_id').unbind('change');
        this.table.find('input#date').unbind();

        this.table.find('textarea#reason').parents('tr:first').show(); // Снова отображаем поле "Основание"

        if (this.usePrepareTable) {
            this.prepareTable.find('div#prepareReason').parents('tr:first').show(); // Снова отображаем поле "Основание" в предпросмотре
        }

        this.returnTr.remove();
        this.tariffTr.remove();
    };

    /**
     * Подготовить отправляемые данные
     * @param {object} sendData
     * @returns {void}
     */
    this.prepareSendData = function (sendData)
    {
        sendData.tariff = {
            commission: this.getCommission(),
            rate      : this.getRate(),
        };
    };


    //обновления свойств
    if (typeof params == 'object') {
        for(var i in params) {
            if ("claimsSelect" == i) {
                this[i] = params[i] + this[i];
            } else {
                this[i] = params[i];
            }
        }
    }
}

/**
 * Автоматическое выделение отдела в зависимости от "Назначения платежа" и выбранных заявок.
 * @constructor\
 */
function DepartmentAutoSelect()
{
    // Если "Назначение платежа": "Раходники на товар", "Представительские расходы" или "Транспортные расходы"
    if ($.inArray(parseInt($('#transaction_type').val()), [4, 11, 12]) > -1)
    {
        // Выбранные заявки
        var claims = [];

        // Собрать ID заявок
        $('table#newTransaction:not(.detailsHelperTable) [name="transport_claims[]"]').each(function(index, element) {
            claims[index] = parseInt(element.value);
        });

        // Запрос на выборку отделов
        $.ajax({
            url      : '/cash/ajax/get-claims-department',
            async    : false,
            type     : 'POST',
            data     : { 'claims' : claims },
            dataType : 'json',
            success  : function(resp)
            {
                // Если запрос вернул ID отдел, сделать отдел выделенным
                if (parseInt(resp.department) > 0) {
                    $('#depot_id').val(resp.department);
                }
            }
        });
    }
}
