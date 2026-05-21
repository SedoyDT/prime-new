/**
 * Проведение непроведенных транзакций
 * Если клиента нет, то
 * @see public/js/cash/account/edit_unverified.js
 */
    var clientsList = [];

    addOnLoadEvent(bindAccountEvents);

    /**
     * Старт страницы
     */
    function bindAccountEvents()
    {
        // Удалить транзакцию
        const deleteBtn = $(".delete[type='button']");
        const deleteBtnMenu = deleteBtn.find('.amd-btn__caret');
        const forceDeleteBtn = deleteBtnMenu.find('.js-force-delete');

        let deleteBtnMenuOpen = false;

        const deleteFunction = (e, trId, forceDelete) =>
        {
            const table = $(e.target).parents("table:first");
            table.addClass('element-preload');

            $.getJSON(
                linkPrefix + '/cash/ajax/delete',
                {
                    ids        : trId,
                    type       : cashType,
                    forceDelete: Number(forceDelete)
                },
                function (data)
                {
                    if (data.success == true) {
                        var count = parseInt($(e.target).parents("table:first").prevAll("span:first").find("b").html());
                        $(e.target).parents("table:first").prevAll("span:first").find("b").html(--count);
                        $(e.target).parents("table:first").remove();
                    }
                }
            );
        };

        deleteBtn.click(function (e)
        {
            deleteFunction(
                e,
                $(e.target).attr("trid"),
                false
            );
        });

        deleteBtnMenu.click(($event) =>
        {
            $event.stopPropagation();
            $event.preventDefault();

            deleteBtnMenuOpen = !deleteBtnMenuOpen;
            if (deleteBtnMenuOpen) {
                deleteBtnMenu.addClass('amd-btn__caret_open')
            } else {
                deleteBtnMenu.removeClass('amd-btn__caret_open');
            }
        });

        deleteBtnMenu.blur(() =>
        {
            deleteBtnMenuOpen = true;
            deleteBtnMenu.click();
        });

        deleteBtnMenu.on('keydown keyup', ($event) =>
        {
            $event.stopPropagation();
            $event.preventDefault();

            if ($event.type == 'keyup') {
                if ([13, 32].includes($event.keyCode)) {
                    deleteBtnMenu.click();
                }
            }
        });

        forceDeleteBtn.click((event) =>
        {
            deleteFunction(
                event,
                $(event.target).closest('.delete').attr("trid"),
                true
            );
        });

        $("select.trType").change(function (e) {
            /*if(Tmp) {
                clearTimeout(Tmp);
            }
            Tmp = setTimeout(function() {*/
            $(e.target).parents("tbody:first").find("input.searchClientMoney").val("");
            $(e.target).parents("tbody:first").find("select[id^='prepareClient']").empty();

            var id = $(e.target).parents("table:first").attr("id").split("_")[1];

            if ("object" == typeof extendedTransactions[id] && extendedTransactions[id].newTransactionObject) {
                extendedTransactions[id].newTransactionObject.files.blockTr.remove();
            }
            if ("object" == typeof extendedTransactions[id] && "function" == typeof extendedTransactions[id].destruct) {
                extendedTransactions[id].destruct();
                delete(extendedTransactions[id]);
            }

            switch ($(e.target).val()) {
                // Транспортные расходы
                case globalCashParams.types.fare :
                    _tools.requireClass('Cash_Extended_Fare');
                    extendedTransactions[id] = new Cash_Extended_Fare({'claimsSelect' : '<div style="margin: 10px 0 20px 20px;"><label>Сумма по заявке</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                            '<input type="checkbox" checked="checked" />' +
                            '<label>Нет</label>' +
                            '<input type="checkbox" />' +
                            '<label>Есть</label></div>',
                        'errorNotClients'        : "Не заполнено одно или несколько полей клиентов, по которым возникли транспортные расходы",
                        'errorNotClaims'        : "Не заполнено одно или несколько полей заявок, по которым возникли транспортные расходы",
                        'errorNotMainClient'    : "Не заполнено поле клиента, на которого списываются транспортные расходы",
                        'table'    : $(e.target).parents("table:first")
                    });
                    break;
                // Расходники на товар
                case "11" :
                    extendedTransactions[id] = new WithInterpretation({'claimsSelect' : '<div style="margin: 10px 0 20px 20px;"><label>Сумма по заявке</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '<input type="checkbox" checked="checked" />' +
                        '<label>Нет</label>' +
                        '<input type="checkbox" />' +
                        '<label>Есть</label></div>',
                        'errorNotClients'        : "Не заполнено одно или несколько полей клиентов, по которым возникли расходники на товар",
                        'errorNotClaims'        : "Не заполнено одно или несколько полей заявок, по которым возникли расходники на товар",
                        'errorNotMainClient'    : "Не заполнено поле клиента, на которого списываются расходники на товар",
                        'table'    : $(e.target).parents("table:first")
                    });
                    break;
                case "5":
                    extendedTransactions[id] = new Petrol({
                        'table'      : $(e.target).parents("table:first"),
                        'clientId'    : 'prepareClient_' + id,
                        'depotId'    : 'depotIds',
                        'id'		: id,
                    });
                    break;
                // аванс
                case "7":
                    extendedTransactions[id] = new Prepayment({
                        'table'      : $(e.target).parents("table:first"),
                        'clientId'   : 'clientAdvance_' + id + ', select#prepareClient_' + id,
                        'depotId'    : 'depotIds',
                        'id'		: id,
                        newTransactionObject: {
                            files: new Cash_SimpleFiles({
                                'tableSelector': 'table#transaction_' + id,
                                'usePrepareTable': false,
                                newTransactionObject: undefined
                            }),
                            access: Lib_Access.get('all', `cash>${cashModule.alias}>access`),
                        },
                    });
                    break;
                case "8":
                    extendedTransactions[id] = new Other({
                        'table'     : $(e.target).parents("table:first"),
                        'clientId'  : 'prepareClient_' + id,
                        'depotId'   : 'depotIds',
                        'id'        : id
                    });
                    break;
                case "15":
                    extendedTransactions[id] = new Patent({
                        'table'      : $(e.target).parents("table:first"),
                        'clientId'    : 'prepareClient_' + id,
                        'depotId'    : 'depotIds',
                        'id'		: id,
                    });
                    break;
                case "16":
                    extendedTransactions[id] = new Percent({
                        'table'      : $(e.target).parents("table:first"),
                        'clientId'    : 'prepareClient_' + id,
                        'depotId'    : 'depotIds',
                        'id'		: id,
                    });
                    break;
                /*default:
                    // По умолчанию ничего не делаем (стандартный интерфейс)
                    break;*/
            }

            if ("object" == typeof extendedTransactions[id] && "function" == typeof extendedTransactions[id].init) {
                extendedTransactions[id].init();
            }
            if ("object" == typeof extendedTransactions[id] && extendedTransactions[id].newTransactionObject) {
                extendedTransactions[id].newTransactionObject.files.init();
            }

            if ($(e.target).parents("tbody:first").find("select[id^='prepare']").length) {
                id = $(e.target).parents("tbody:first").find("select[id^='prepare']").attr("id").replace(/^prepareClient_/, '');
            }
            clientsList[id] = new Array();
            // от элемента видимо отказались, поиск на стороне клиента
            let element = $(e.target).parents("tbody:first").find("input.searchClientMoney");
            getClientsMoney(element.length ? element : $(this));
            //}, 556);
        }).change();

        // Отложить транзакцию
        $('.disaccept').click(function() {
            //alert(56);
            $(this).parent().html('<span class="disaccepted">Транзакция отложена</span>');
        });

        /**
         * Сменить знак у транзакции
         */
        $('.change-sign').on('click', function ()
        {
            const input    = this.closest('tr').querySelector('input[name="change_sign"]');
            const span     = this.closest('tr').querySelector('.prepareSumm');
            const sum      = parseFloat(span.innerText);
            input.value    = parseInt(input.value) ? 0 : 1;
            span.innerHTML = -1 * sum;

            input.dispatchEvent(new Event('change'));
        });


        // Провести транзакцию
        $('.accept').live("click", function(e) {

            var id = $(this).attr('trid');
            var table = $(e.target).parents("table:first");

            var reasonInput       = $('.cashReason', table);
            var sumInput          = $('#summ,input[name="summ"]', table);
            var currencyRateInput = $('input[name="currency_rate"]', table);
            var currencySumInput  = $('input[name="currency_sum"]', table);

            var depotId = $('.depotIds', table).val();
            var trType = parseInt($('.trType', table).val());
            var annotation = $('.cashAnnotation', table).val();
            //var clientId = $('.prepareClient', table).attr('val');
            var clientId = $('.prepareClient', table).attr('val');
            if (undefined == clientId) {
                clientId = $('.prepareClient', table).val();
            }
            if(trType == 0) {
                alert('Необходимо выбрать назначение платежа!');
            } else if (0 == clientId || null == clientId) {
                alert('Необходимо выбрать клиента!');
            } else if (currencyRateInput.length && !parseFloat(currencyRateInput.val())) {
                alert('Необходимо указать курс валюты!');
            } else {
                var table = $(e.target).parents("table:first");
                // Определим id транзакции
                var id = table.attr("id").split("_")[1];
                if ("object" == typeof extendedTransactions[id] && "function" == typeof extendedTransactions[id].info) {
                    if (! extendedTransactions[id].info()) {
                        return false;
                    }
                }

                // Если это расширенная транзакция, соберем заявки и суммы по ним
                var claims = new Array();
                var summs = new Array();
                $.each(table.find("tbody").find("tr.transport_claims").find("img.helpButton"), function (n, img) {
                    claims.push($(img).prevAll("select#transport_claims:first").find("option:selected").val());
                    summs.push($(img).prevAll("input#transport_summ:first").val());
                });



                $(this).attr('disabled', true);

                var url = linkPrefix + '/cash/ajax/accept';

                var sendParams = {
                    'tid'             : id,
                    'depot_id'        : depotId,
                    'transaction_type': trType,
                    'annotation'      : annotation,
                    'client_id'       : clientId,
                    'cashType'        : cashType,
                    'transport_claims': claims,
                    'transport_summ'  : summs,
                    'change_sign'     : $(table).find('input[name="change_sign"]').val(),
                    'absolute_sign'   : $(table).find('input[name="absolute_sign"]').val(),
                };

                if (reasonInput.length) {
                    sendParams.reason = reasonInput.val();
                }
                if (sumInput.length) {
                    sendParams.summ = sumInput.val();
                }

                if (currencyRateInput.length) {
                    sendParams.currency_sum  = currencySumInput.val();
                    sendParams.currency_rate = currencyRateInput.val();
                    sendParams.currency_id   = JS_CONST.CURRENCY.CODE_RUB;
                }

                if ("object" === typeof extendedTransactions[id] && "function" == typeof extendedTransactions[id].prepareSendData) {
                    extendedTransactions[id].prepareSendData(sendParams);
                }

                var formData = new FormData();

                var documentsInput = table.find('input[type="file"]');

                if (documentsInput.length) {
                    // Если есть файлы, то передадим их на сервер
                    documentsInput.each(function () {
                        for (var i = 0; i < this.files.length; i++) {
                            formData.append(this.name, this.files[i]);
                        }
                    });
                }

                if (parseInt(trType) == 8) {
                    // Если имеем дело с прочими списаниями
                    var chargeOffTable = table.find('table.chargeOffTable');

                    var chargesSumms = new Array();
                    var chargesDates = new Array();

                    $.each(chargeOffTable.find("tbody tr"), function (n, tr) {
                        chargesSumms.push($(tr).find('input[name="chargeOffCashAmount[]"]').val());
                        chargesDates.push($(tr).find('input[name="chargeOffCashDate[]"]').val());
                    });

                    sendParams['chargeOffCashAmount'] = chargesSumms;
                    sendParams['chargeOffCashDate'] = chargesDates;

                    sendParams['already_charged'] = table.find("tbody").find("input#already_charged").val();

                    sendParams['transport_claims'].push(chargeOffTable.find('tfoot input#transport_claims').val());
                    sendParams['transport_summ'].push(chargeOffTable.find('tfoot input#transport_summ').val());
                }

                formData.append('sendParams', JSON.stringify(sendParams, function(key, value) {
                    if (value === null) return '';
                    return value;
                }));

                /*$.getJSON(url, sendParams, function(data) {
                    if(data.success == true) {
                        $('.resultTd', table).html('<span class="disaccepted">Транзакция проведена</span>');
                        if ('function' == typeof window.acceptComplete) {
                            acceptComplete();
                        }
                    } else if (data.success == false){
                        $(this).attr('disabled', false);
                    } else {
                        $('.resultTd', table).html('<span class="disaccepted">Транзакция отклонена</span>');
                        alert("В указанный Вами период транзакцию провести невозможно, обратитесь к администратору.");
                    }
                });*/
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: url,
                    dataType: 'json',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success    : function (data) {
                        if(data.success == true) {
                            $('.resultTd', table).html('<span class="disaccepted">Транзакция проведена</span>');
                            //if ('function' == typeof window.acceptComplete) {
                                acceptComplete(table);
                            //}
                        } else if (data.success == false){
                            $(this).attr('disabled', false);
                        } else {
                            $('.resultTd', table).html('<span class="disaccepted">Транзакция отклонена</span>');
                            acceptComplete(table);
                            alert("В указанный Вами период транзакцию провести невозможно, обратитесь к администратору.");
                        }

                        var slideButton = table.find('[data-slide=true]');
                        if(slideButton.length && slideButton.data('children')) {
                            table.find('#' + slideButton.data('children')).hide();
                        }
                    }
                });
            }

        });


        /*$('.searchClientMoney').keyup(function() {
            if(Tmp) {
                clearTimeout(Tmp);
            }

            var id = $(this).attr('tids');
            var name = $(this).val();

            //if(name != '') {
                Tmp = setTimeout(function() {
                    getClientsMoney(name, id);
                }, 556);
            //}

        });*/


        /*$('.searchClientMoney').keyup(function(e) {
            if(Tmp) {
                clearTimeout(Tmp);
            }

            //var id = $(this).attr('tids');
            //var name = $(this).val();

            //if(name != '') {
                Tmp = setTimeout(function() {
                    getClientsMoney($(e.target));
                }, 556);
            //}

        });*/

        // Фильтр клиентов по первым буквам
        $('input.searchClientMoney').live('keyup', function(e) {

            var node = $(e.target).nextAll("select[id^='prepare']:first");
            var options = node.find("option");
            var id = node.attr("id").replace(/^prepareClient_/, '');


            if (! clientsList[id].length) {
                for(var i = 0; i < options.length; i++) {
                    if (options[i].value == 0) {
                        continue;
                    }
                    clientsList[id].push({id:options[i].value, text:options[i].text.replace(/^\s+|\s+$/, '')});
                }
            }
            node.empty();
            var search = $(this).val().toLowerCase().replace(/^\s+|\s+$/, '');
            node.append(new Option("не выбрано", 0));
            for(var i = 0; i < clientsList[id].length; i++) {
                if (search.length && clientsList[id][i].text.toLowerCase().indexOf(search) == -1) {
                    continue;
                }
                node.append(new Option(clientsList[id][i].text, clientsList[id][i].id));
            }
        });


        $('.cashAnnotation').autocomplete(linkPrefix + '/cash/ajax/autocomplete', {
            width: 300,
            multiple: true,
            matchContains: true,
            max: 999999,
            multipleSeparator: " ",
            // formatResult: function(data, value) {
                // console.log(value);
                // return $.trim(value);
            // }
            formatResult: function(row) {
                return row.to;
            }
            // formatItem: formatItem,
            // formatResult: formatResult
        });


        // Сохранение в excel
        $('#saveExcel').click(function() {
            var url = linkPrefix + '/cash/ajax/saveunknown';

            var sendParams = {};

            $('#excelRefer').html('<img src="/img/ld/analitics1.gif" border="0" class=""/>');

            $.post(url, sendParams, function(data) {
            //$.getJSON(url, sendParams, function(data) {
                //alert(data);
                //console.log(data);

                //if(data == '1') {
                    var eRefer = '<a href="' + linkPrefix + '/excel/cash/unknown/transactiona.xlsx">скачать файл</a>';
                    $('#excelRefer').html(eRefer);
                //}

            });
        });
    }

    $(document).ready(function () {
        $.each($("select[id^='prepare']"), function (n, element) {
            var id = $(element).attr("id").replace(/^prepareClient_/, '');
            clientsList[id] = new Array();
        });

        $(document).on('click', '[data-slide=true]', function ()
        {
            $(this).closest('table').find('#' + $(this).data('children')).toggle();
            return false;
        });
    });


    /*function getClientsMoney(name, tid)
    {
        var url = linkPrefix + '/client/ajax/getclients';
        var sendData = {
            'name': name
        };

        $.post(url, sendData, function(data) {
            //console.log(data);
            var element = '#prepareClient_' + tid;
            $(element).html(data);
        });
    }*/

    function getClientsMoney(element)
    {
        var transactionType = element.parents("tbody:first").find("select.trType").val();
        var depotId         = element.parents("tbody:first").find("select.depotIds").val();

        if (transactionType == 7) {
            var url = linkPrefix + '/cash/ajax/getusers';
            var sendData = {
                depotId: depotId
            };
        } else {
            var url = linkPrefix + '/client/ajax/getclients';
            var sendData = {
                'trType': element.parents("tbody:first").find("select.trType").val(),
                'cashType': cashType,
                'name': element.val()
            };
        }

        /*$.post(url, sendData, function(data) {
            element.nextAll("select[id^='prepare']:first").html($(data));
        });*/
        $.ajax({
            async    : false,
            type    : 'POST',
            url        : url,
            data    : sendData,
            success    : function (data) {
                element.nextAll("select[id^='prepare']:first").html($(data));
            }
        });
    }


    function acceptComplete(table)
    {
        //var a = table.find("thead").find("a");
        var link = table.attr("id");
        table = table.find("tbody");

        if (table.find("img.interpretationImg").length && "close" == table.find("img.interpretationImg").attr("rel")) {

            // Подготовим предосмотр
            var interpretation = "<dl>";
            $.each(table.find("tr.transport_client").find("img.helpButton"), function (n, img) {
                interpretation = interpretation + '<dt>' + $(img).prevAll("select#interpretationClient").find("option:selected").html() + ':</dt>';
                //$.each($(img).parents("tr:first").next().find("img.helpButton[rel='delete']"), function (n, id) {
                $.each($(img).parents("tr:first").next().find("img.helpButton"), function (n, id) {
                    interpretation = interpretation + '<dd>' + $(id).prevAll("select#transport_claims:first").find("option:selected").html();
                    interpretation = interpretation + ': ' + $(id).prevAll("input#transport_summ:first").val() + '</dd>';
                });
            });
            interpretation = interpretation + "</dl>";

            // Уберем блок расшифровки, а вместо него вставим предосмотр
            table.find("img.interpretationImg").trigger("click");
            table.find("img.interpretationImg").remove();

            //var tr = table.find("interpretation:first");
            table.append('<tr><td colspan="2">' + interpretation + '</td></tr>');
        } else {
            table.find("tr.interpretation").remove();
        }


        var b;
        // Заменим изменяемые блоки на метки

        // Склад
        b = table.find("select.depotIds option:selected").text();
        table.find("select.depotIds").parents("td:first").html(b);

        // Тип транзакции
        b = table.find("select.trType option:selected").text();
        table.find("select.trType").parents("td:first").html(b);

        // Клиент
        b = table.find("select.prepareClient option:selected").text();
        table.find("select.prepareClient").parents("td:first").html(b);

        // Примечание
        b = table.find("textarea.cashAnnotation").html();
        table.find("textarea.cashAnnotation").parents("td:first").html(b);

        //a.trigger("click");
        window.location.href = "#" + link;
    }
