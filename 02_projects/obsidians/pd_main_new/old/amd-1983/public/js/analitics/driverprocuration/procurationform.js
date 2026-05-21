var procurationform = new function () {
    /**
     * Селектор для секции печати
     * @type {string}
     */
    this.printSection = '.print.section';


    /**
     * Начальные действия которые будут выполняться после перенаправления страницы
     * @type {Object}
     */
    this.redirectWhithActions = {};


    /**
     * Селектори для кнопок управления
     * @type {{saveButton: string, printButton: string, sendEmailButton: string, sealButton: string, addRow: string, delRow: string, sectionsSelect: string, driverButton: string, clientButton: string}}
     */
    this.buttons = {
        saveButton: '#saveProcuration',
        printButton: '#printButton',
        sendEmailButton: '#sendEmail',
        sealButton: '#sealButton',
        addRow: '.addRow',
        delRow: '.delRow',
        sectionsSelect: '#sectionsSelect',
        driverButton: '#driverButton',
        // clientButton: '#clientButton',
    };


    // /**
    //  * Селектори для блока клиентов
    //  * @type {{clientBox: string, clientSelect: string, clientSearch: string}}
    //  */
    // this.client = {
    //     clientBox: '.toolPanelDynamicBlock.client',
    //     clientSelect: '#client',
    //     clientSearch: '#clientSearch',
    // };


    /**
     * Селектори для блока водителей
     * @type {{id: boolean, data: {}, newPassportData: {}, driverBox: string, driverSelect: string, driverSearch: string, passportDataFields: string, passportDataChanged: boolean}}
     */
    this.driver = {
        id: false,
        data: {},
        newPassportData: {},
        driverBox: '.toolPanelDynamicBlock.driver',
        driverSelect: '#driver',
        driverSearch: '#driverSearch',
        passportDataFields: '[data-field="passportSeries"],[data-field="passportNumber"],[data-field="passportIssuedBy"],[data-field="passportIssuedDate"]',
        passportDataChanged: false,
    };


    /**
     * Селектори для блока печатей и подписей
     * @type {{shown: boolean, box: string, selectButtons: string}}
     */
    this.seals = {
        shown: false,
        box: '.sealSelectBox',
        selectButtons: '.sealSelectButton',
    };


    /**
     * Селектори для полей в которых хранятся данные для отправки на сервер
     * @type {{id: string, driverId: string, clientId: string, ticketId: string, configSectionNumber: string}}
     */
    this.fields = {
        id: '#procurationId',
        driverId: '#driver',
        clientId: '#client',
        ticketId: '#ticketId',
        claimId: '#claimId',
        typeId: '#typeId',
        configSectionNumber: '#sectionsSelect',
    };


    /**
     * Календарь
     * @type {mixed}
     */
    this.datepicker = '#datepicker';


    /**
     * Инициализация
     * @param {Object} params
     */
    this.init = function (params) {
        $('[data-field]').each(function () {
            $(this).text($.trim($(this).text()))
        });

        this.transition.obj = $('#transition-overlay').transition({
            "backgroundColor": 'grey'
        });

        this.printSection = $(this.printSection);

        this.popups = $('.toolPanelDynamicBlock:not(.legend)');

        this.driver.driverBox = $(this.driver.driverBox);
        this.driver.driverSelect = $(this.driver.driverSelect);
        this.driver.driverSearch = $(this.driver.driverSearch);
        this.driver.passportDataFields = $(this.driver.passportDataFields);

        // this.client.clientBox = $(this.client.clientBox);
        // this.client.clientSelect = $(this.client.clientSelect);
        // this.client.clientSearch = $(this.client.clientSearch);

        this.months = ['', 'Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря'];

        this.url = params.url;
        this.startActions = params.startActions;
        this.period = params.period;
        this.saveAccess = params.saveAccess;

        this.materalAssestListCount = params.materalAssestListCount;

        this.datepicker= $(this.datepicker);

        this.setStyles();

        this.save.initButton();
        this.print.initButton();
        this.sendEmail.initButton();
        this.addRow.initButton();
        this.delRow.initButton();
        this.sealButton.initButton();
        this.sectionsSelect.initButton();
        // this.clientButton.initButton();
        this.driverButton.initButton();
        this.bindEvents();

        setTimeout(() =>
        {
            this.buttons.printButton.attr('disabled', false);
            this.buttons.sendEmailButton.attr('disabled', false);
            this.doStartActions();
        }, 1000);

        // Используется для быстрого поиска, без учета регистра
        $.expr[':'].ContainsG = function(a, i, m) {
            return $(a).text().toUpperCase()
                    .indexOf(m[3].toUpperCase()) >= 0;
        };

        if (this.materalAssestListCount >= 2) {
            procurationform.delRow.show();
        }
    };


    this.setStyles = function () {
        if (!this.saveAccess) {
            $('[contenteditable]').attr('contenteditable', false);
            $('.cv, .dv, .rqr, .nrq').removeClass('cv').removeClass('dv').removeClass('rqr').removeClass('nrq');
        }
    };


    /**
     * Привязка событий
     */
    this.bindEvents = function () {
        const self = this;

        // // флаг нужен, чтобы для сохранённых доверенностей не менялись "дата выдачи" и "срок действия"
        // let clientInit = false;
        // this.client.clientSelect.change(function () {
        //     if (+$(this).val()) {
        //         procurationform.setClientData($(this));
        //
        //         if (clientInit) {
        //             self.updateDates();
        //         }
        //     }
        // }).change();
        // clientInit = !clientInit;

        // флаг нужен, чтобы для сохранённых доверенностей не менялись "дата выдачи" и "срок действия"
        let driverInit = false;
        this.driver.driverSelect.change(function () {
            if ($(this).val()) {
                procurationform.setDriverData($(this).val());

                if (driverInit) {
                    self.updateDates();
                }
            }
        }).change();
        driverInit = !driverInit;

        this.printSection.on('input', function (e) {
            if ($(e.target).is('[contenteditable][data-field]')) {
                $('[data-field="' + $(e.target).data('field') + '"]')
                    .not($(e.target))
                    .text($(e.target).text());
            }
        });
        this.printSection.on('focusout', function (e) {
            setTimeout(function () {
                if ($(e.target).is('[contenteditable][data-field]')) {
                    $(e.target).text($.trim($(e.target).text())).trigger('input');
                }
                if ($(e.target).is('[data-group]') && $(e.target).is('[data-field]')) {
                    var date = $(e.target).text();
                    date = date.match(new RegExp(/^([0-9]{2})\.([0-9]{2})\.([0-9]{4})$/));
                    date = +date[1] + ' ' + procurationform.months[+date[2]] + ' ' + date[3] + ' г.';
                    $('[data-group="' + $(e.target).data('group') + '"]').not('[data-field]').text(date);
                }
            },500);
        });
        this.printSection.find('[data-group]').focusout();
        // this.client.timerId = null;
        // this.client.clientSearch.on('input', function () {
        //     if (procurationform.client.timerId) {
        //         window.clearTimeout(procurationform.client.timerId);
        //     }
        //     procurationform.client.timerId = window.setTimeout(function ()
        //     {
        //         procurationform.fastSearch(procurationform.client.clientSearch, 'client');
        //     }, 500);
        // });
        this.driver.timerId = null;
        this.driver.driverSearch.on('input',function () {
            // var el = $(this);
            if (procurationform.driver.timerId) {
                window.clearTimeout(procurationform.driver.timerId);
            }
            procurationform.driver.timerId = window.setTimeout(function ()
            {
                procurationform.fastSearch(procurationform.driver.driverSearch, 'driver');
            }, 500);
        });
        this.driver.passportDataFields.on('input', function (e) {
            if (e.originalEvent && e.originalEvent.isTrusted) {
                procurationform.driver.passportDataChanged = true;
            }
        });
        this.driver.passportDataFields.filter('[data-field="passportIssuedDate"]').on('blur', function () {
            var dateVal = $.trim($(this).text());

            if (procurationform.driver.passportDataChanged === true
                && dateVal !== $.trim(procurationform.driver.data[$(this).data('field')])
            ) {
                if (procurationform.validateDate(dateVal)) {
                    alert('Неверный формат даты выдачи паспорта.\n\rПоле должно соответствовать формату: дд.мм.гггг');
                    setTimeout(function () {
                        procurationform.driver.passportDataFields.filter('[data-field="passportIssuedDate"]:visible').focus()
                    },100);
                }
            }
        });
        $('.cv[data-field="dateIssue"],.cv[data-field="dateValid"],.cv[data-field="passportIssuedDate"]').focus(function () {
            var currentDate = procurationform.getDateObject($(this).text());

            procurationform.printSection.find('[currentDateField="true"]').attr('currentDateField',false);
            $(this).attr('currentDateField', true);

            if (currentDate) {
                procurationform.datepicker.datepicker('setDate', currentDate)
            }
            procurationform.datepicker.show();
            procurationform.setDatePickerCoords();
        });
        this.datepicker.datepicker({
            onSelect: function (date) {
                procurationform.printSection.find('[currentDateField="true"]')
                    .text(date)
                    .focusout();
                $(this).hide();
            }
        });
        $(document).click(function (e) {
            if(procurationform.datepicker.is(':visible')) {
                if(!$(e.target).is('.cv[data-field="dateIssue"],.cv[data-field="dateValid"],.cv[data-field="passportIssuedDate"]')
                    && !(e.target.closest(procurationform.datepicker.selector)
                        || e.target.closest('.ui-corner-all')
                    )
                ) {
                    procurationform.datepicker.hide();
                }
            }
        });
        $(window).scroll(function () {
            setTimeout(procurationform.setDatePickerCoords,100);
        });

        let script = document.createElement('script');

        script.innerHTML = `
        window.addEventListener('beforeprint', function ()
        {
            var breakpoint = document.querySelector('.breakpoint');

            if (document.querySelector('.material-assets-list').offsetHeight > 150) {
                breakpoint.style.pageBreakAfter = 'always';
            } else {
                breakpoint.style.pageBreakAfter = '';
            }
        });
        `;

        document.body.children[0].before(script);
    };


    /**
     * Печать
     */
    this.doPrint = function () {
        this.buttons.printButton.click();
    };


    /**
     * Отправка по емайл
     */
    this.doSendEmail = function () {
        this.buttons.sendEmailButton.click();
    };


    /**
     * Вызываются начальные действии при открытии страницы
     */
    this.doStartActions = function () {
        if (this.startActions instanceof Object) {
            for(var i in this.startActions) {
                if (!this.startActions.hasOwnProperty(i)) {
                    continue;
                }

                var action = 'do' + i.charAt(0).toUpperCase() + i.substr(1);
                if (typeof this[action] === 'function') {
                    this[action](this.startActions[i]);
                }
            }
        }
    };


    /**
     * Устанавливает начальные действия которые будут выполняться после перенаправления страницы
     * @param {String} param
     * @param {mixed} val
     */
    this.setRedirectStartAction = function (param, val) {
        val = val || 1;
        this.redirectWhithActions[param] = val;
    };


    /**
     * Удаляет действие
     * @param param
     */
    this.unsetRedirectStartAction = function (param) {
        if (this.redirectWhithActions.hasOwnProperty(param)) {
            delete this.redirectWhithActions.hasOwnProperty(param)
        }
    };


    /**
     * Возвращает действии
     * @return {string}
     */
    this.getRedirectStartActions = function () {
        var query = '';
        for (var i in this.redirectWhithActions) {
            query += '&' + i + '=' + this.redirectWhithActions[i];
        }
        return query;
    };


    /**
     * Быстрый поиск (водители, клиенты)
     * @param {jQuery} elem
     * @param {String} type
     */
    this.fastSearch = function (elem, type) {

        var val = $.trim(elem.val()).toLowerCase();
        var select = procurationform[type][type + 'Select'];

        if (val) {
            var options = select.find('option:ContainsG("' + val + '")').show();
            var oldVal = select.val();
            select.find('option').not(':ContainsG("' + val + '")').hide();

            if (options.length == 1) {
                select.val(options.val());
            } else {
                select.val('');
            }
            if (oldVal !== select.val()) {
                select.change();
            }
        } else {
            select.find('option').show();
        }
    };


    // /**
    //  * Установка данных клиента
    //  * @param select
    //  */
    // this.setClientData = function (select)
    // {
    //     var option = select.find('option:selected');
    //     this.updateClientData({
    //         name   : option.data('name'),
    //         address: option.data('address'),
    //     });
    // };

    this.updateClientData = function (data)
    {
        $('[data-field="providerName"]').text(data.name);
        $('[data-field="confPayerAddress"]').text(data.name + (data.address ? ', ' : '') + data.address);
    }

    /**
     * Установка id водителя
     * @param driverId
     */
    this.setDriverData = function (driverId) {
        if(driverId) {
            this.driver.id = +driverId;
            this.getDriverData();
        }

        if (this.driver.data) {
            $('[data-field="tableFullName"],[data-field="driverName"]').text(this.driver.data.name || '');
            $('[data-field="passportSeries"]').text(this.driver.data.passportSeries || '');
            $('[data-field="passportNumber"]').text(this.driver.data.passportNumber || '');
            $('[data-field="passportIssuedBy"]').text(this.driver.data.passportIssuedBy || '');
            $('[data-field="passportIssuedDate"]').text(this.driver.data.passportIssuedDate || '');
            procurationform.driver.passportDataChanged = false;
        }
    };


    /**
     * Получение данных водителя из сервера
     */
    this.getDriverData = function () {
        if(this.driver.id) {
            $.ajax({
                url: this.url.getDriverData,
                type: 'POST',
                async: false,
                data: {driverId: this.driver.id},
                dataType: 'JSON',
                success: function (response) {
                    if(response.success) {
                        procurationform.driver.data = response.data;
                    }
                }
            })
        } else {
            this.driver.data = {}
        }
    };


    // /**
    //  *  Кнопка "Клиенты"
    //  * @type {{initButton: procurationform.clientButton.initButton, clientBoxSwitch: procurationform.clientButton.clientBoxSwitch}}
    //  */
    // this.clientButton = {
    //     initButton: function () {
    //         procurationform.buttons.clientButton = $(procurationform.buttons.clientButton);
    //
    //         if (!procurationform.saveAccess) {
    //             procurationform.buttons.clientButton.parent().css('display', 'none');
    //             return;
    //         }
    //
    //         procurationform.buttons.clientButton.click(function () {
    //             procurationform.clientButton.clientBoxSwitch()
    //         })
    //     },
    //
    //
    //     /**
    //      * Показать/скрыть блок
    //      */
    //     clientBoxSwitch: function () {
    //         var isVisible = procurationform.client.clientBox.is(':visible');
    //         procurationform.popups.hide();
    //         if(isVisible) {
    //             procurationform.client.clientBox.hide();
    //         } else {
    //             procurationform.client.clientBox.show();
    //         }
    //     }
    // };


    /**
     * Кнопка "Водители"
     * @type {{initButton: procurationform.driverButton.initButton, driverBoxSwitch: procurationform.driverButton.driverBoxSwitch}}
     */
    this.driverButton = {
        initButton: function () {
            procurationform.buttons.driverButton = $(procurationform.buttons.driverButton);

            if (!procurationform.saveAccess) {
                procurationform.buttons.driverButton.parent().css('display', 'none');
                return;
            }

            procurationform.buttons.driverButton.click(function () {
                procurationform.driverButton.driverBoxSwitch()
            })
        },


        /**
         * Показать/скрыть блок
         */
        driverBoxSwitch: function () {
            var isVisible = procurationform.driver.driverBox.is(':visible');
            // procurationform.popups.hide();
            procurationform.hidePopups();
            if(isVisible) {
                procurationform.driver.driverBox.hide();
            } else {
                procurationform.driver.driverBox.show();
            }
        }
    };


    /**
     * Кнопка "Печати"
     * @type {{initButton: procurationform.sealButton.initButton, sealBoxSwitch: procurationform.sealButton.sealBoxSwitch, sealselectEvent: procurationform.sealButton.sealselectEvent}}
     */
    this.sealButton = {
        initButton: function () {
            procurationform.buttons.sealButton = $(procurationform.buttons.sealButton);

            if (!procurationform.saveAccess) {
                procurationform.buttons.sealButton.parent().css('display', 'none');
                return;
            }

            procurationform.seals.box = $(procurationform.seals.box);
            procurationform.seals.selectButtons = $(procurationform.seals.selectButtons);
            procurationform.buttons.sealButton.click(function () {
                procurationform.sealButton.sealBoxSwitch();
            });
            procurationform.seals.selectButtons.click(function () {
                procurationform.sealButton.sealselectEvent($(this));
            });
        },


        /**
         * Показать/скрыть блок
         */
        sealBoxSwitch: function () {
            var isVisible = procurationform.seals.box.is(':visible');
            // procurationform.popups.hide();
            procurationform.hidePopups();
            if(isVisible) {
                procurationform.seals.box.hide();
            } else {
                procurationform.seals.box.show();
            }
        },


        /**
         * Показать/скрыть печати
         * @param {jQuery} elem
         */
        sealselectEvent: function (elem) {
            $('.dSeals,.bSeals, .sSeals').hide();
            procurationform.seals.shown = false;
            if (elem.data('action') == 'show') {
                var sealSelect = $('.sealSelect:visible'),
                    sealSelects = $('.sealSelect'),
                    vals = sealSelect.val();
                sealSelects.find('option').prop('selected', false);
                vals.forEach(function (val) {
                    sealSelects.find('option[value="' + val + '"]').prop('selected', true);
                    $('.' + val).show();
                });
                procurationform.seals.shown = true;
            }
            procurationform.buttons.sealButton.click();
        }
    };


    /**
     * Список секций из конфигов
     * @type {{initButton: procurationform.sectionsSelect.initButton}}
     */
    this.sectionsSelect = {
        initButton: function () {
            procurationform.buttons.sectionsSelect = $(procurationform.buttons.sectionsSelect);
            procurationform.buttons.sectionsSelect.change(function () {
                $('.section').hide();
                $('.sealSelect').hide();
                $('.sealSelect[data-section="section' + $(this).val() + '"]').show();
                $('#section' + $(this).val()).show();
            }).change();

            if (!procurationform.saveAccess) {
                procurationform.buttons.sectionsSelect.parent().css('display', 'none');
                return;
            }
        }
    };


    /**
     * Кнопка для добавления новой строки в таблице "Перечень материальных ценностей"
     * @type {{initButton: procurationform.addRow.initButton, add: procurationform.addRow.add, addNewRow: procurationform.addRow.addNewRow}}
     */
    this.addRow = {
        initButton: function () {
            procurationform.materialValuesAlert = $('.materialValuesAlert');
            procurationform.buttons.addRow = $(procurationform.buttons.addRow);

            if (!procurationform.saveAccess) {
                procurationform.buttons.addRow.css('display', 'none');
                return;
            }

            procurationform.buttons.addRow.click(function () {
                procurationform.addRow.add()
            })
        },


        /**
         * Валидация и добавление
         */
        add: function () {
            var table = $('.material-assets-list:visible');
            var lastRow = table.find('tbody tr:last').find('td');

            if($.trim(lastRow.eq(1).text()) === ''
                && $.trim(lastRow.eq(2).text()) === ''
                && $.trim(lastRow.eq(3).text()) === '') {
                procurationform.materialValuesAlert.css('opacity',1);
                setTimeout(function () {
                    procurationform.materialValuesAlert.css('opacity',0);
                }, 2000);
            } else {
                procurationform.addRow.addNewRow();
            }
        },


        /**
         * Добавление строки
         */
        addNewRow: function () {
            var table = $('.material-assets-list:visible');
            var row = table.find('.templateRow').clone(true).show();
            row.removeClass('templateRow');
            row.find('td').each(function () {
                var number = table.find('tbody tr').length - 1;

                if (number == 2) {
                    procurationform.delRow.show();
                }

                if ($(this).data('field') == 'consecutiveNumber') {
                    $(this).text(number);
                }

                this.setAttribute('data-field', $(this).data('field') + number);
                this.setAttribute('data-row', number);
            });
            table.append(row);
            $('.material-assets-list').each(function () {
                $(this).html(table.html());
            })
        },
    };


    /**
     * Кнопка для удаления последней строки из таблицы "Перечень материальных ценностей"
     * @type {{initButton: procurationform.delRow.initButton, del: procurationform.delRow.del}}
     */
    this.delRow = {
        initButton: function () {
            procurationform.buttons.delRow = $(procurationform.buttons.delRow);
            procurationform.buttons.delRow.click(function () {
                procurationform.delRow.del()
            })
        },


        /**
         * Удаление
         */
        del: function () {
            var rows = $('.material-assets-list:visible').find('tbody tr').length;

            if (rows >= 4) {
                $('.material-assets-list').find('tbody tr:last').remove();

                if (rows == 4) {
                    procurationform.delRow.hide()
                }
            }
        },


        /**
         * Показать
         */
        show: function () {
            procurationform.buttons.addRow.addClass('addRowTop');
            procurationform.buttons.delRow.show();
        },


        /**
         * Скрыть
         */
        hide: function () {
            procurationform.buttons.addRow.removeClass('addRowTop');
            procurationform.buttons.delRow.hide();
        }

    };


    /**
     * Кнопка сохранить
     * @type {{initButton: initButton}}
     */
    this.info = {
        initButton: function() {
            procurationform.buttons.saveButton = $(procurationform.buttons.saveButton);

            if(!procurationform.saveAccess) {
                procurationform.buttons.saveButton.css('display', 'none');
            }

            if (!procurationform.buttons.saveButton.length) {
                return;
            }

            // Клик по кнопке сохранить
            procurationform.buttons.saveButton.click(function(){
                procurationform.save.save();
            });
        },


        /**
         * Сохранение
         * @return {boolean}
         */
        save: function () {
            var result = false;
            if(procurationform.isValid()) {
                result = procurationform.save.saveRequest(procurationform.save.collectData());
            }
            return result;
        },


        /**
         * Сбора данных со всех полей
         * @return {Object}
         */
        collectData: function() {
            var self = this;
            // Шаблон с данными
            var values = {
                materialAssetsList: {}
            };

            for (var i in procurationform.fields) {
                values[i] = $(procurationform.fields[i]).val()
            }

            var sealSelect = $('.sealSelect[data-section="section' + values.configSectionNumber + '"]');
            values.directorSignature = procurationform.seals.shown ? sealSelect.find('option[value="dSeals"]:selected').length : 0;
            values.accountantSignature = procurationform.seals.shown ? sealSelect.find('option[value="bSeals"]:selected').length : 0;
            values.seal = procurationform.seals.shown ? sealSelect.find('option[value="sSeals"]:selected').length : 0;


            // Сбора элементов и данных
            $.each($('[data-field]:visible'), function(elementId, elemet){
                if ($(elemet).hasClass('mal')) {
                    if (!values.materialAssetsList[$(elemet).data('row')]) {
                        values.materialAssetsList[$(elemet).data('row')] = {};
                    }
                    self.valueExtractor(elemet, values.materialAssetsList[$(elemet).data('row')]);
                } else {
                    self.valueExtractor(elemet, values);
                }
            });

            return values;
        },


        /**
         * Получает значение из поля в зависимости от типа поля
         * @param {DOMObject} elemet
         * @param {Object} container
         */
        valueExtractor: function(elemet, container) {
            // Определение метода сбора данных в зависимости от типа элемента
            switch (elemet.tagName) {
                case 'SELECT':
                    container[elemet.getAttribute('data-field')] = elemet.value;
                    break;
                default:
                    container[elemet.getAttribute('data-field')] = elemet.innerHTML;
                    break;
            }
        },


        /**
         * Отправить запрос на сохранение договора
         * @param {Object} data
         * @return {boolean}
         */
        saveRequest: function(data) {
            var success = false;
            $.ajax({
                url      : procurationform.url.info,
                async    : false,
                type     : 'POST',
                data     : {data : data},
                dataType : 'json',
                success  : function(result)
                {
                    if (result.success) {
                        if(result.data.isNew) {
                            window.location.replace(result.data.url + procurationform.getRedirectStartActions());
                        } else {
                            if (!Object.keys(procurationform.redirectWhithActions).length) {
                                alert('Данные Успешно сохранены');
                            }
                            success = true;
                        }
                    } else {
                        alert(result.message);
                    }
                }
            });
            return success;
        }
    };


    /**
     * Валидация данных
     * @return {boolean}
     */
    this.isValid = function () {
        if (!+$.trim($(this.fields.ticketId).val())
            && !+$.trim($(this.fields.clientId).val())
        ) {
            if (this.angularCtrl) {
                this.angularCtrl.showClients();
            }
            // if(!this.client.clientBox.is('visible')) {
            //     this.buttons.clientButton.click();
            // }
            alert('Не выбран клиент');
            return false;
        }

        if (!+$.trim($(this.fields.driverId).val())) {
            if(!this.driver.driverBox.is('visible')) {
                this.buttons.driverButton.click();
            }
            alert('Не выбран водитель');
            return false;
        }

        var fields = $('.rq[data-field]:empty').filter(':visible');

        if (fields.length) {
            //переносим к первому незаполненному полю - 10
            $(document).scrollTop($(fields[0]).offset().top - 80 - $('section.controlPanel',0).height());
            $(fields[0]).focus();
            alert('Не заполнены обязательные поля!');
            return false;
        }

        return this.checkDriverPassportData();
    };


    /**
     * Проверка паспортных данных водителя
     * @return {boolean}
     */
    this.checkDriverPassportData = function () {
        if (+this.driver.id && this.driver.passportDataChanged === true) {
            if(this.compareDriverPassportData()) {
                if(!this.confirmNewDriverData()) {
                    return false;
                }
            }
        }
        return true;
    };


    /**
     * Проверка паспортных данных водителя на изменение
     * @return {boolean}
     */
    this.compareDriverPassportData = function () {
        var changed = false,
            newData = {};
        this.driver.passportDataFields.filter(':visible').each(function () {
            var pData = $.trim(procurationform.driver.data[$(this).data('field')]) || '';
            newData[$(this).data('field')] = $.trim($(this).text());
            if (pData !== $.trim($(this).text())) {
                changed = true;
            }
        });
        if (changed) {
            this.driver.newPassportData = newData;
        }
        return changed;
    };


    /**
     * Запрос на подтверждение изменений паспортных данных водителя
     */
    this.confirmNewDriverData = function () {
        if(confirm('Редактировать данные водителя? ')) {
            return this.saveDriverPassportData()
        } else {
            this.setDriverData();
        }
    };


    /**
     * Сохранение новых паспортных данных водителя
     * @return {boolean}
     */
    this.saveDriverPassportData = function () {
        var valid = false;
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url.saveDriverPassportData,
            data: {
                driverId: this.driver.id,
                data: this.driver.newPassportData,
            },
            dataType: 'JSON',
            success: function (result) {
                if (result.success) {
                    if (result.saved) {
                        alert('Паспортные данные водителя успешно обновлены');
                        procurationform.setDriverData(procurationform.driver.id);
                        valid = true;
                    }
                } else {
                    alert(result.message);
                }
            }
        });
        return valid;
    };


    /**
     * Валидация дат (формат: дд.мм.гггг)
     * @param date
     * @return {boolean}
     */
    this.validateDate = function (date) {
        date = this.getDateObject(date);
        return !date || date.toDateString() === 'Invalid Date';
    };


    /**
     * Возвращает js Date если date соответствует формату дд.мм.гггг
     * @param {String} date
     * @param {RegExp}formatPattern
     * @return {mixed}
     */
    this.getDateObject = function (date, formatPattern) {
        formatPattern = formatPattern || new RegExp(/^([0-9]{2})\.([0-9]{2})\.([0-9]{4})$/);
        if(!(formatPattern instanceof RegExp)) {
            throw new Error('Передан неправильный шаблон');
        }

        date = date.match(formatPattern);

        if (date) {
            return new Date(date[3] + '-' + date[2] + '-' + date[1]);
        }
        return false;
    };


    /**
     * Клик по кнопке печать
     * @type {{initButton: initButton}}
     */
    this.print = {
        initButton: function()  {
            // Селект с КПП клиента
            procurationform.buttons.printButton = $(procurationform.buttons.printButton);

            if(!procurationform.buttons.printButton.length) {
                return;
            }

            // Клик по кнопке сохранить
            procurationform.buttons.printButton.click(function(){
                procurationform.setRedirectStartAction('print');
                /*procurationform.isValid()*/
                if(!procurationform.saveAccess || procurationform.save.save()) {
                    window.print();
                    procurationform.unsetRedirectStartAction('print');
                }
            });
        }
    };


    /**
     * Кнопка отправить по почте
     * @type {{initButton: initButton}}
     */
    this.sendEmail = {
        initButton: function() {
            // Jquery объект кнопки
            procurationform.buttons.sendEmailButton = $(procurationform.buttons.sendEmailButton);
            // Клик по кнопке
            procurationform.buttons.sendEmailButton.click(function(){
                procurationform.sendEmail.send();
            });
        },


        /**
         * Отправка по почте
         */
        send: function () {
            procurationform.setRedirectStartAction('sendEmail');
            if(!procurationform.saveAccess || procurationform.save.save()) {
                var siteName = document.location.origin;
                var breakpoint = $('.breakpoint');
                //Добавляем http://SITE_NAME к src,href у элементов img, link
                procurationform.sendEmail.setOriginLocation(siteName);
                // Сохраняем всю разметку страницы
                breakpoint.css('page-break-after', 'always');
                var markup = document.documentElement.outerHTML;
                breakpoint.css('page-break-after', '');

                //Блокировка экрана, вывод окна загрузки на время создания pdf файла
                procurationform.transition.show();

                //Ставим задержку 1,5 сек для того чтобы transition успел выполниться
                setTimeout(function()
                {
                    // Флаг успеха создания pdf файла
                    var success = false;
                    // Запрос на создание pdf файла
                    $.ajax({
                        type: 'POST',
                        async: false,
                        url: procurationform.url.pdf,
                        data: {
                            number: $('.driverProcurationNumber:visible:first').text(),
                            data: markup,
                            date: $('[data-field="dateIssue"]:visible:first').text(),
                            period: procurationform.period,
                        },
                        success: function(data)
                        {
                            success = true;
                        },
                        error: function()
                        {
                            success = false;
                            alert('Ошибка при сохранении pdf файла');
                        },
                        complete: function()
                        {
                            // Восстанавливаем старые значения src и href
                            procurationform.sendEmail.resetOriginLocation(siteName);
                            //Убираем окно блокировки
                            procurationform.transition.hide()
                        }
                    });

                    // Если файл не создан выходим
                    if(!success) {
                        return;
                    }

                    procurationform.unsetRedirectStartAction('sendEmail');

                    // Формируем размеры всплывающего окна
                    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
                    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

                    var w = 690;
                    var h = 800;
                    width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
                    height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

                    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
                    var top = ((height / 2) - (h / 2)) + dualScreenTop;

                    // Открываем новое окно с формой отправки счета по почте
                    var wnd = window.open("/mail/send-mail/showwindowform/?type=driverprocuration",
                        'Отправка доверенности по почте',
                        "toolbar=0,height=" + h + ",width=" + w + ",top=" + Math.abs(top) + ",left=" + left
                    );
                    wnd.focus();
                }, 1500);
            }
        },


        /*
         * Добавляем http://SITE_NAME к src,href у элементов img, link
         * это необходимо для того чтобы phantomjs мог загрузить эти ресурсы при создании
         * pdf файла
         * @param siteName {String}
         */
        setOriginLocation: function (siteName) {
            $(document).find('img[src]').each(function(a)
            {
                var src = $(this).attr('src');
                $(this).attr('src', siteName + src)
            });

            $(document).find('link[rel="stylesheet"]').each(function(a)
            {
                var href = $(this).attr('href');
                $(this).attr('href', siteName + href)
            });
        },


        /**
         * Удаляем
         * @param siteName {String}
         */
        resetOriginLocation: function (siteName) {
            $(document).find('img[src]').each(function(a)
            {
                var src = $(this).attr('src');
                $(this).attr('src', src.substring(siteName.length))
            });

            $(document).find('link[rel="stylesheet"]').each(function(a)
            {
                var href = $(this).attr('href');
                $(this).attr('href', href.substring(siteName.length))
            });
        }
    };


    /**
     * Оверлей
     * @type {{show: procurationform.transition.show, hide: procurationform.transition.hide}}
     */
    this.transition = {
        /**
         * Показать
         */
        show: function () {
            $(".print.section").addClass('z2');
            $(".controlPanel").addClass('z1');
            procurationform.transition.obj.css({display:'block'});
            procurationform.transition.obj.transition('show');
        },


        /**
         * Скрыть
         */
        hide: function () {
            procurationform.transition.obj.transition('hide');
            procurationform.transition.obj.css({display:'none'});
            $(".print.section").removeClass('z2');
            $(".controlPanel").removeClass('z1');
        }
    };


    /**
     * Установка координатов календаря
     */
    this.setDatePickerCoords = function () {
        if(procurationform.datepicker.is(':visible')
            && document.querySelector('[currentDateField="true"]')
        ) {
            var coords = document.querySelector('[currentDateField="true"]').getBoundingClientRect();
            procurationform.datepicker.css({
                top: (coords.bottom + 5) + 'px',
                left: coords.left + 'px',
            });
        }
    };

    /**
     * обновляет поля "дата выдачи" и "срок действия"
     */
    this.updateDates = function () {
        $('[data-field="dateIssue"]').text(moment().format("DD.MM.YYYY"));
        $('[data-field="dateValid"]').text(moment().add(10, 'days').format("DD.MM.YYYY"));

        this.printSection.find('[data-group]').focusout();
    }

    this.hidePopups = function(){
        this.popups.hide();
        if (this.angularCtrl) {
            this.angularCtrl.hidePopups()
        }
    }


    return this;
};
