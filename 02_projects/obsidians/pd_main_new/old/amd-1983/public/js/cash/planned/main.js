$(document).ready(function ()
{
    var claimTable = $('table.claim-table');

    $(document).on('blur', '.document_summ', function (event)
    {
        const value = parseFloat(this.value.replace(',', '.').replace(/[^\d\.]/g, ''));
        this.value  = value >= 0 ? value : '';
        $(event.target).change();
    });

    if (CashPlannedObject.supplyDepartmentBlockEnabled) {
        $(document).on('click', '.js-document-original, img.deleteDocument', function () {
            if (CashPlannedObject.isOriginalDocumentExists()) {
                $('input.accept[type="button"]').prop('disabled', false).attr('title', '');
            } else {
                $('input.accept[type="button"]').prop('disabled', true).attr('title', 'выберите один из загруженных документов оригиналом');
            }
        });
        if (CashPlannedObject.isOriginalDocumentExists()) {
            $('input.accept[type="button"]').prop('disabled', false).attr('title', '');
        } else {
            $('input.accept[type="button"]').prop('disabled', true).attr('title', 'выберите один из загруженных документов оригиналом');
        }
    }

    // Удаление планируемого платежа
    $("input.reject[type='button']").click(function (e)
    {
        var table = claimTable;
        var sendData = {
            'planned_id': $(e.target).attr("trid"),
            'claim_id': $(e.target).attr("trreason")
        };
        if ($('input[name="transport_out"]').length) {
            sendData['transport_out'] = $('input[name="transport_out"]:checked').val();
        }

        if (confirm("Вы уверены, что хотите отклонить платеж?")) {
            $.ajax({
                async: false,
                type: 'POST',
                url: linkPrefix + '/cash/planned/' + cashType + '/reject',
                data: sendData,
                dataType: 'json',
                success: function (data)
                {
                    if (data.success) {
                        // Если все получилось, то напишем, что транзакция отклонена и скроем кнопки
                        table.find("tfoot tr td").html($('<h2>Платеж отклонен</h2>'));
                    }
                    alert(data.message);
                }
            });
        }
    });

    // Планируемый платеж отложен
    $("input.disaccept[type='button']").click(function (e)
    {
        // Выполним проверку корректности добавленных документов
        var table = claimTable;
        var flag = true;
        //var editorIndex = parseInt(table.index("table[id^='table_']")) * 2;
        var editorIndex = parseInt($("table[id^='table_']").index(table)) * 2;

        var sendData = {
            'planned_id': $(e.target).attr("trid"),
            'claim_id': $(e.target).attr("trreason"),
            'excel': table.find('tbody input.prepareExcel').val(),
            'cash_reason': $('textarea.cashReason').val(),
            'annotation': $('textarea.cashAnnotation').val(),
            'factsumm': 0,
            'postpone_no_support': $(e.target).attr("no_support") == 1 ? 1 : 0
        };
        //var sendData = getFormParams(table);

        if ('account' == cashType) {
            var trId = table.attr('id').split('_')[1];
            var tk = $(e.target).attr("tk");
            if (tk) {
                sendData['tk'] = '1';
                var documents = transactions[trId+'0'];
                if (typeof documents != 'undefined' && documents.isValid()) {
                    sendData['documents_tk'] = transactions[trId+'0'].getFileInfo();
                }else{
                    flag = false;
                }
            } else {
                var documents = transactions[trId];
                if (typeof documents != 'undefined' && documents.isValid()) {
                    sendData['documents'] = transactions[trId].getFileInfo();
                }else{
                    flag = false;
                }

                if ($('input[name="transport_out"]').length) {
                    sendData['transport_out'] = $('input[name="transport_out"]:checked').val();
                }
            }

        } else {
            var summ = table.find("span.prepareSumm input[type='text']").val();
            //проверим формат суммы, если она есть
            if ('' != summ) {
                if (!/^(\-)?\d+(\.\d{1,2})?$/.test(summ)) {
                    alert('Не верно указан формат суммы');
                    return false;
                }
            }
            sendData['factsumm'] = summ;
        }

        if (flag) {
            // Соберем данные о новых документах для передачи на сервер
            $.ajax({
                async: false,
                type: 'POST',
                url: linkPrefix + '/cash/planned/' + cashType + '/disaccept',
                data: sendData,
                dataType: 'json',
                success: function (data)
                {
                    if (data.success) {
                        // Если все получилось, то напишем, что транзакция отложена и скроем кнопки
                        $("table input[type='button'][value='отложить']").parent('td').html($('<h2>Обработка платежа отложена</h2>'));
//                        table.find("tfoot tr td").html($('<h2>Обработка платежа отложена</h2>'));
                    }
                    alert(data.message);
                }
            });
        }
    });

    // Планируемый платеж проведен
    $("input.accept[type='button']").click(function (e)
    {
        // Выполним проверку корректности добавленных документов
        var table = claimTable;
        var flag = true;
        var editorIndex = parseInt($("table[id^='table_']").index(table)) * 2;
        var ct = null;

        if(window.cardsInfo){
            if(false === window.cardsInfo.info()){
                return false;
            }
            ct = window.cardsInfo.getFormData();
        }

        var sendData = {
            'planned_id': $(e.target).attr("trid"),
            'claim_id': $(e.target).attr("trreason"),
            'excel': table.find('tbody input.prepareExcel').val(),
            'cash_reason': $('textarea.cashReason').val(),
            'annotation': $('textarea.cashAnnotation').val(),
            'factsumm': 0,
            'alreadyPaid': table.find("input#alreadyPaid[type='checkbox']").val(),
            'samples': table.find("input#samples[type='checkbox']").val(),
            'samplesWithDocs': table.find("input#samplesWithDocs[type='checkbox']").val(),
            'exchange': table.find("input#exchange[type='checkbox']").val(),
            'ourCompany': table.find("input#ourCompany[type='checkbox']").is(':checked') ? '1' : '0',
            'ct': ct
        };

        if ('account' == cashType) {
            var tk = $(e.target).attr("tk");
            if (!tk && $('input[name="transport_out"]').length) {
                sendData['transport_out'] = $('input[name="transport_out"]:checked').val();
            }

            if (!table.find("input.special[type='checkbox']:checked:not(.require-docs)").length) {
                var trId = table.attr('id').split('_')[1];
                var documents = transactions[trId];
                var documents_tk = transactions[trId+'0'];

                if (typeof documents != 'undefined' && documents.isValid(true)) {
                    sendData['documents'] = transactions[trId].getFileInfo();
                    if (typeof documents_tk != 'undefined') {
                        if (documents_tk.isValid(false, "TK")) {
                            sendData['documents_tk'] = transactions[trId+'0'].getFileInfo();
                        } else {
                            flag = false;
                        }
                    }
                }else{
                    flag = false;
                }
            }


        } else {
            var summ = table.find("span.prepareSumm input[type='text']").val();
            // При проведении должна быть указана сумма документа
            // если не стоит чекбокс
            if (!table.find("input.special[type='checkbox']:checked").length) {
                if ('' == summ) {
                    alert('Не указана фактическая сумма предварительной оплаты');
                    return false;
                } else {
                    //проверим формат суммы
                    if (!/^(\-)?\d+(\.\d{1,2})?$/.test(summ)) {
                        alert('Не верно указан формат суммы');
                        return false;
                    } else if (!parseFloat(summ)) {
                        alert('Нельзя проводить нулевые транзакции');
                        return false;
                    }
                }
                sendData.factsumm = summ;
            }
        }

        // дополнительные проверки
        if (!CashPlannedObject.save(sendData)) {//!parseInt($('#tr-car').data('check-driver')) && !$('#ourCompany').is(':checked')) {
            return false;
        }

        if (flag) {
            $.ajax({
                async: false,
                type: 'POST',
                url: linkPrefix + '/cash/planned/' + cashType + '/accept',
                data: sendData,
                dataType: 'json',
                success: function (data)
                {
                    alert(data.message);
                    if (data.success) {
                        // Если это одиночный документ, то просто перегрузим страницу
                        if ('single' == viewMode) {
                            //window.location.reload(true);
                            setTimeout(function ()
                            {
                                //table.fadeIn("slow", function() { $(this).remove(); } );
                                if (typeof window.opener != 'undefined' && null != window.opener) {
                                    window.opener.location.reload();
                                    window.close();
                                } else {
                                    window.location.reload();
                                }
                            }, 100);
                        } else {
                            // Если все получилось, то напишем, что транзакция проведена и скроем кнопки
                            table.find("tfoot tr td").html($('<h2>Транзакция проведена</h2>'));
                        }
                    }
                }
            });
        }
    });

    $("input.js-create-supply-department-ticket").on('click', function () {
        if ('account' !== cashType.toString()) {
            return ;
        }

        var self = $(this);
        var container = $(this).closest('.js-create-supply-department-ticket-container');
        var sendData = new FormData();
        sendData.append('planned_id', container.find('[name="planned_id"]').val());
        Array.from(container.find('input[type="file"]').get(0).files).forEach(function (file, index) {
            sendData.append('files[' + index + ']', file);
        })

        self.prop('disabled', true);
        container.addClass('element-preload');

        // Соберем данные о новых документах для передачи на сервер
        $.ajax({
            async: false,
            type: 'POST',
            url: '/cash/planned/account/create-supply-department-ticket',
            data: sendData,
            dataType: 'json',
            processData : false,
            contentType : false,
        })
            .done(function (data) {
                if (data.success) {
                    alert('Документы отправлены');
                    setTimeout(function ()
                    {
                        if (typeof window.opener != 'undefined' && null != window.opener) {
                            window.opener.location.reload();
                            window.close();
                        } else {
                            window.location.reload();
                        }
                    }, 100);
                } else {
                    alert('Ошибка: ' + data.error);
                }
            })
            .fail(function () {
                console.error(arguments);
                alert('Возникла непредвиденная ошибка.');
            })
            .always(function () {
                self.prop('disabled', false);
                container.removeClass('element-preload');
            });
    });

    $("input.special[type='checkbox']").click(function (e)
    {
        cashPlannedMainCheckboxClickCallback($(e.target));
    });

    // Обработка кликов по чекбоксам вынесена в отделную функцию
    window.cashPlannedMainCheckboxClickCallback = function($targetElement)
    {
        var value;
        var table = $targetElement.parents('table:first');
        var tfoot = $('table.submit-buttons');
        var summField = table.find("input[name='summ']").parents("tr:first");

        // Элемент на котором произошло событие
        var target = $targetElement || $(window.event.srcElement);

        // Остальные элементы
        var otherCheckbox = $('.special').not(target);

        // Типы планируемых платежей
        var types = {
            alreadyPaid: 2, // Ранее оплаченные
            samples: 3, // Образцы
            exchange: 4,  // Обмен товара
            ourCompany: 6, // Наша компания
            samplesWithDocs: 9 // Образцы + документы
        };

        for (let key in types) {
            if (key === target.attr('name')) {
                value = types[key]; break;
            }
        }

        if (target.prop("checked") && parseInt(value) === 9)
        {
            target.val(value);
            // Скрыть кнопки: "Отклонить", "Отложить", "Отложить без сапорта"
            tfoot.find("input.reject[type='button']").hide();
            tfoot.find("input.disaccept[type='button']").hide();
            target.parents('table:first').find("input[name='summ']").val('');
            summField.hide();

            // Если это безнал, то покажем все что было по документам
            if ('account' === cashType.toString()) {
                let separator = table.find('tbody').find('tr.separator');

                separator.show();

                $.each(separator.nextAll(), function (n, id)
                {
                    $(id).show();
                });

                if (CashPlannedObject.supplyDepartmentBlockEnabled) {
                    if (CashPlannedObject.isOriginalDocumentExists()) {
                        $('input.accept[type="button"]').prop('disabled', false).attr('title', '');
                    } else {
                        $('input.accept[type="button"]').prop('disabled', true).attr('title', 'выберите один из загруженных документов оригиналом');
                    }
                    $('.js-create-supply-department-ticket-container').show();
                }
            }

            // Снимаем галочки с остальных чекбоксов
            otherCheckbox.prop("checked", false).val(1);
        }
        else if (target.prop("checked")) {
            target.val(value);
            tfoot.find("input.reject[type='button']").hide();
            tfoot.find("input.disaccept[type='button']").hide();
            target.parents('table:first').find("input[name='summ']").val('');
            summField.hide();

            // Если это безнал, то надо скрыть еще и документы
            if ('account' == cashType) {
                var separator = table.find('tbody').find('tr.separator');
                separator.hide();
                $.each(separator.nextAll(), function (n, id)
                {
                    $(id).hide();
                });

                if (CashPlannedObject.supplyDepartmentBlockEnabled) {
                    $('.js-create-supply-department-ticket-container').hide();
                }
            }

            // Снимаем галочки с остальных чекбоксов
            otherCheckbox.prop("checked", false).val(1);
            if ($('input.accept[type="button"]') &&
                $('input.accept[type="button"]').prop('disabled')
            ) {
                $('input.accept[type="button"]').prop('disabled', false).attr('title', '');
            }
        } else {

            // вернем флажок в исходное состояние; покажем скрытые кнопки и поля
            target.val(1);
            tfoot.find("input.reject[type='button']").show();
            tfoot.find("input.disaccept[type='button']").show();
            summField.show();

            // Если это безнал, то покажем все что было по документам
            if ('account' == cashType) {
                var separator = table.find('tbody').find('tr.separator');
                separator.show();
                $.each(separator.nextAll(), function (n, id)
                {
                    $(id).show();
                });

                if (CashPlannedObject.supplyDepartmentBlockEnabled) {
                    if (CashPlannedObject.isOriginalDocumentExists()) {
                        $('input.accept[type="button"]').prop('disabled', false).attr('title', '');
                    } else {
                        $('input.accept[type="button"]').prop('disabled', true).attr('title', 'выберите один из загруженных документов оригиналом');
                    }
                    $('.js-create-supply-department-ticket-container').show();
                }
            }
        }
    };
});
