/**
 * Проверка на существование элемента
 * @returns {$.length|_L1._$.length}
 */
jQuery.fn.exists = function() {
    return $(this).length;
}

/**
 * Фильтр для страницы с блокированными товарами
 * Подключается в виде /application/modules/analitics/views/scripts/unblock/index.phtml
 * Содержит методы построения грида (таблица с результатом), методы построения фильтра и работы с ним, методы для скрывания полей
 */
var unblock = new (function() {

    /**
     *  Права доступа
     */
    this.permissions = null;

    /**
     * ID отчета
     */
    this.report_id = 0;

    /**
     * Дата разблокировки товаров
     */
    this.release_date = '';

    this.release_date_full = '';

    /**
     * Выходные дни
     */
    this.unavailableDates = [];

    /**
     * Получить узел по id.
     */
    this.node = function(id) {
        return typeof id == 'string' ? document.getElementById(id) : id;
    };

    /**
     * Опции полей таблицы
     */
    this.fieldsOptions = {
        id          : {caption: '#п/п', width: 70, sort: 1, align: 'center'},
        deptTitle   : {caption: 'Отдел', width: 120, sort: 1, align: 'center'},
        managerName : {caption: 'ФИО', width: 130, sort: 1, align: 'center'},
        clientTitle : {caption: 'Клиент', width: 120, sort: 1, align: 'center', },
        claimTitle  : {caption: 'Заявка', width: 100, sort: 1, align: 'center',
            aliace: function(value, container, rowData) {
                return '<a href="' + rowData.claimUrl + '" style="font-size: 8pt;" target="_blank">' + value + '</a> ';
            }
        },
        id_goods : {caption: 'ID товара', width: 93, sort: 1, align: 'center'},
        title    : {caption: 'Наименование', width: 120, sort: 1, align: 'center',
            aliace: function(value, container, rowData) {
                // Вывод примечания отдела закупок
                if (rowData.annotationIn) {
                    var options = {
                        htmlPatternName : 'iconAnnotationBrown',
                        annotation      : rowData.annotationIn,
                        headerName      : 'annotationIn'
                    };
                    var iconAnnotation = depot_tooltip.init(options).getTooltip();
                    if (iconAnnotation) {
                        value += iconAnnotation;
                    }
                }
                return value;
            }
        },
        prop     : {caption: configProp,     width:77, sort:1, aliace:function(v, cnt, rowData) { return eval(configPropReturn);}},
        color    : {caption: configColor,    width:80, sort:1, aliace:function(v, cnt, rowData) { return eval(configColorReturn);}},
        boxType  : {caption: configBoxType,  width:80, sort:1, aliace:function(v, cnt, rowData) { return eval(configBoxTypeReturn);}},
        volum    : {caption: configVolum,    width:70, sort:1, aliace:function(v, cnt, rowData) { return eval(configVolumReturn);}},
        height   : {caption: configHeight,   width:75, sort:1,
            aliace:function(v, cnt, rowData) { // Отображение реального поставщика
                showVendornameTitle(rowData, cnt);
                return eval(configHeightReturn);
            }
        },
        width       : {caption: configWidth,   width:75, sort:1, aliace:function(v, cnt, rowData){ return eval(configWidthReturn);}},
        depth       : {caption: configDepth, width:75, sort:1, aliace:function(v, cnt, rowData){ return eval(configDepthReturn);}},
        labelWeight : {caption: configLabelWeight, width:75, sort:1, aliace:function(v, cnt, rowData){ return eval(configLabelWeightReturn);}},
        inBoxes     : {caption: 'Кол-во в упаковке / средний вес ', width:90, sort:1, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
        totalAmount : {caption: 'Кол-во (штук) / общий вес', width:90, sort:1, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
        totalBoxes  : {caption: 'Кол-во упаковок / кол-во роликов', width:90, sort:1, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
        date_add    : {caption: 'Дата добавления', width: 130, sort: 1, align: 'center'},
        balance: {caption: 'Сальдо', width: 130, sort: 1, align: 'center'},
        defermentTitle: {caption: 'Отсрочка', width: 130, sort: 1, align: 'center',aliace: function(value, container, rowData) {return value === null ? 'Нет отсрочки' : value;}},
        has_depot_ticket: {
            caption: 'Запрос',
            width: 70,
            sort: 1,
            align: 'center',
            aliace: function(value, container, rowData) {
                if(parseInt(value) == 1) {
                    $(container).parent().parent().attr('title', 'По заявке '+rowData['claimTitle']+' есть запрос в саппорт').addClass('has_depot_ticket');
                    return '✔';
                }else{
                    return '';
                }
            }
        },
        actions: {caption: 'Действия', width: 120, align: 'center',
            aliace: function(value, container, rowData) {
                function nationalDays(date) {
                    // Получение даты
                    var dmy = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();

                    // Если день выходной, то блокируем его
                    if ($.inArray(dmy, unblock.unavailableDates) > -1) {
                        return [false, "", "Unavailable"];
                    }

                    return [true, ""];
                }

                var input = $('<input/>')
                    .attr({'type': 'image','src': linkPrefix + '/img/calendar.png','data-pp': rowData.pp})
                    .addClass('date_unset')
                    .addClass('dp_img')
                    .val(rowData.block_release_date)
                    .datepicker({
                        beforeShowDay: nationalDays,
                        minDate: 1,
                        onSelect: function(dateText) {
                            if (confirm('Вы уверены, что хотите изменить дату разблокировки данной записи на ' + dateText + '?')) {
                                unblock.changeDate($(this).attr('data-pp'), this.value);
                            }
                        }
                    });

                var clearLink = $('<a/>').addClass('date_unset').attr({'href' : 'javascript:void(0);','data-pp' : rowData.pp});
                clearLink.append(
                    $('<img/>')
                        .attr({'src' : linkPrefix + '/img/system/receipts.png','data-type' : 'reset','title' : "Сбросить все заявки по менеджеру и товару"})
                        .css({'width' : '16px','height': '16px'})
                );

                var clearOneRowLink = $('<a/>').addClass('date_unset').attr({'href' : 'javascript:void(0);','data-pp' : rowData.id});
                clearOneRowLink.append(
                    $('<img/>')
                        .attr({'src' : linkPrefix + '/img/system/receipt.png','data-type' : 'resetone','title' : "Сбросить заявку"})
                        .css({'width' : '16px','height': '16px'})
                );

                var deleteLink = $('');

                /**
                 * Если есть права на удаление записи и тип отчета "разовый"
                 */
                if (unblock.permissions.deleterecord && parseInt(rowData.reportType) === 1) {
                    deleteLink = $('<a/>').addClass('date_unset').attr({'href' : 'javascript:void(0);','data-pp' : rowData.pp});
                    deleteLink.append(
                        $('<img/>')
                            .attr({'src' : linkPrefix + '/img/system/receipt--minus.png','data-type' : 'delete','title' : "Удаление заявок из отчета"})
                            .css({'width' : '16px','height': '16px'})
                    );
                }

                var span = $('<span/>').addClass('date_set').text(rowData.block_release_date);

                var changeImage = $('<img/>')
                    .addClass('date_set')
                    .attr({
                        'src' : linkPrefix + '/img/system/editFilterS.png',
                        'title' : 'Удалить изменение даты',
                        'alt' : 'X',
                        'width' : '16px',
                        'height' : '16px',
                        'data-pp' : rowData.pp
                    })
                    .css({
                        'cursor': 'pointer',
                        'margin-left' : '2px'
                    }).click(function() {
                        unblock.changeDate($(this).attr('data-pp'), unblock.release_date_full);
                    });

                // если установлена дата разблокировки вручную, то отображение даты
                if (rowData.release_date_diff) {
                    span.text(rowData.release_date_diff);
                    input.toggle();
                    span.toggle();
                    input.val(rowData.release_date_diff);
                }

                if (!unblock.permissions.changedate)
                    input = $('');

                if (!unblock.permissions.unblockclaim) {
                    clearLink = $('');
                    clearOneRowLink = $('');
                }

                if (!unblock.permissions.deletechangedate)
                    changeImage = $('');

                return input.after(clearLink).after(clearOneRowLink).after(deleteLink).after(span).after(changeImage);
            }
        }
    };

    /**
     *  Инициализация фильтра и грида.
     */
    this.init = function() {
        $('.beforeFilterRow').show();
        $('.afterGridRow').show();
        this.initFilter();
        this.initGrid();
        this.bindEvents();
    };

    /**
     *  Инициализация фильтра. @return void
     */
    this.initFilter = function() {

        var _self = this;

        // Фильтр
        this.filter = new Filter({
            urlGetFullData : linkPrefix + '/analitics/unblock/getfilterconfig?report_id=' + _self.report_id,
            urlGetMaskData : linkPrefix + '/analitics/unblock/getfiltermask?report_id=' + _self.report_id,
            imgLoader      : linkPrefix + '/img/ld/ld3.gif',
            clsImgUrl      : linkPrefix + '/img/system/clear.16.png',
            conteinerId    : 'filter',
            filterType     : 'excel',
            itemsInRow     : 5
        });

        this.filter.onBeforeCreate = function() {
            this.addPostData = {};
        };

        // После создания фильтра (событие)
        this.filter.onAfterCreate = function() {
            _self.grid.create();
            _self.grid.addPostData = {};
            _self.grid.update(this.getValue());
        };

        // После выборки значений фильтра (событие)
        this.filter.onChange = function() {
            _self.grid.curpage = 1;
            _self.grid.addPostData = {};
            _self.grid.addPostData.markAll = $('#markAll').is(':checked') ? 1 : 0;
            _self.grid.update(this.getValue());
        };

        // После обновления фильтра (событие)
        this.filter.onAfterRebuild = function() {
            _self.grid.addPostData = {};
            _self.filter.onChange();
        };

        // Создание фильтра
        this.filter.create();

        unblockFields.create();
    };

    /**
     *  Инициализация грида. @return void
     */
    this.initGrid = function() {

        /*
         * Запрос на формирование
         * данных для грида (на контроллер)
         */
        this.grid = new Grid({
            conteinerId : 'searchResult',
            urlGetData  : linkPrefix + '/analitics/unblock/getfilterresult?report_id=' + this.report_id,
            imgError    : linkPrefix + '/img/system/error.16.png',
            imgLoader   : linkPrefix + '/img/ld/ld3.gif',
            sortColumn  : 'id',
            perpage     : 20,
            emptyMsg    : '<h3>Нет записей</h3>',
            async       : false,
            backlightSelectRow         : 'multiSingleClick',
            clearSingleDowbleSelection : true
        });

        // Шапка грида
        this.grid.head = jQuery.extend(true, {}, this.fieldsOptions);

        this.grid.update = function(filter) {
            if (filter) {
                this.lastFilter = filter;
            }

            if (this.urlGetData) {
                this._updateFromAjax(this.lastFilter);
            } else {
                if ((this.curpage - 1) * this.perpage > this.data.length) {
                    this.curpage = Math.floor(this.data.length / this.perpage);
                }
                this._updateFromData((this.curpage - 1) * this.perpage, this.curpage * this.perpage);
                this.node().firstChild.lastChild.firstChild.innerHTML = 'страниц : ' + Math.ceil(this.data.length / this.perpage) + '| записей : ' + this.data.length;
                var inps = this.node().firstChild.lastChild.childNodes;
                this.totalrow = this.data.length;
                for (var i = 0; i < inps.length; i++) {
                    if (inps.item(i).nodeName.toLowerCase() != 'input')
                        continue;

                    inps.item(i).disabled = (this.data.length <= this.perpage);
                }
            }
        };

        for (var i in this.grid.head) {
            unblockFields.allFields[i] = this.grid.head[i].caption;
        }

        unblockFields.showFields();
        unblockFields.prepareHideFields();

        for (var i in unblockFields.hideFields) {
            delete(this.grid.head[i]);
        }

        // Тип сортировки по умолчанию
        this.grid.sortType = 'desc';

        this.grid._updateFromAjax = function(filter) {
            var _self = this;
            var block  = this.crnode();
            block.className = 'filter-grid-body-block';

            if (!this.node().firstChild.childNodes.item(1).firstChild) {
                block.style.width = this.node().firstChild.childNodes.item(1).offsetWidth + 'px';
            } else {
                block.style.width = this.node().firstChild.childNodes.item(1).firstChild.offsetWidth + 'px';
            }

            block.style.height = this.node().firstChild.childNodes.item(1).offsetHeight + this.node().firstChild.childNodes.item(1).scrollHeight + 'px';
            this.node().firstChild.childNodes.item(1).appendChild(block);

            // block paging buttons
            var inps = this.node().firstChild.lastChild.childNodes;

            for(var i=0; i<inps.length; i++) {
                if (inps.item(i).nodeName.toLowerCase() != 'input') {
                    continue;
                }

                inps.item(i).disabled = true;
            }

            this.node().firstChild.lastChild.style.backgroundImage = 'url(' + this.imgLoader + ')';

            var data = {data:serialize(filter), perpage:this.perpage, page:this.curpage-1, column:this.sortColumn, sort:this.sortType};

            if (typeof this.addPostData == 'object') {
                for(var key in this.addPostData) {
                    data[key] = this.addPostData[key];
                }
            }

            $.ajax({
                url: this.urlGetData,
                cache: false,
                type: 'POST',
                dataType: 'json',
                data: data,
                async    : false,
                success: function(data) {
                    _self._displayResultAjax(data);

                    $('#all_amount').text(data.total_amount);
                    $('#all_weight').text(data.total_weight);

                    // Проверка, является ли какой либо товар авторазблокированным у этого менеджера
                    unblock.checkDateChanges();
                },
                error: function(o) {
                    _self._errorAjax(o.responseText);
                }
            });

            if (typeof this.onBeforeUpdateData == 'function') {
                this.onBeforeUpdateData();
            }
        };

        /**
         * Клик на строке grid
         * @return void
         */
        this.grid.onClick = function(rowIndex, field, node) {
            $('#amountSelected').text(unblock.grid.lastSelectionData.length);
        };
    };

    /**
     * перстройка грида без загрузки данных при изменении видимости полей
     */
    this.rebildGrid = function() {
        var _self = this;

        var grid = new Grid({
            conteinerId: 'searchResult',
            urlGetData: linkPrefix + '/analitics/unblock/getfilterresult?report_id=' + _self.report_id,
            imgError: linkPrefix + '/img/system/error.16.png',
            imgLoader: linkPrefix + '/img/ld/ld3.gif',
            sortColumn: 'id',
            perpage: 20,
            emptyMsg: '<h3>Нет записей</h3>'
        });

        grid.head = jQuery.extend(true, {}, _self.fieldsOptions);

        grid.update = function(filter) {
            if (typeof filter == 'undefined')
                filter = unblock.filter.getValue();

            if (filter)
                this.lastFilter = filter;

            if (this.urlGetData) {
                this._updateFromAjax(this.lastFilter);
            } else {
                if ((this.curpage - 1) * this.perpage > this.data.length)
                    this.curpage = Math.floor(this.data.length / this.perpage);

                this._updateFromData((this.curpage - 1) * this.perpage, this.curpage * this.perpage);
                this.node().firstChild.lastChild.firstChild.innerHTML = 'страниц : ' + Math.ceil(this.data.length / this.perpage) + '| записей : ' + this.data.length;
                var inps = this.node().firstChild.lastChild.childNodes;
                this.totalrow = this.data.length;

                for (var i = 0; i < inps.length; i++) {
                    if (inps.item(i).nodeName.toLowerCase() != 'input')
                        continue;

                    inps.item(i).disabled = (this.data.length <= this.perpage);
                }
            }
        };

        for (var i in unblockFields.hideFields) {
            delete(grid.head[i]);
        }

        var data = this.grid.ajaxAllData;

        grid.addPostData = this.grid.addPostData;
        grid.curpage = this.grid.curpage;

        this.grid.close();
        delete(this.grid);

        this.grid = grid;

        grid.create();

        this.grid._displayResultAjax(data);
    };

    /**
     * Изменение даты разблокировки товара
     */
    this.changeDate = function(pp, date, pps) {
        $.ajax({
            url: linkPrefix + '/analitics/unblock/change-date',
            cache: false,
            type: 'POST',
            data: {'pp': pp, 'date' : date, 'pps' : pps},
            dataType: 'json',
            success: function(data) {
                if (data === true) {
                    if (!pps) {
                        var tdInput = $('.filter-grid-body input[data-pp="' + pp + '"]');
                        var tdDiv = tdInput.parent();

                        tdDiv.find('span').text(date);
                        tdDiv.find('.date_unset').toggle();
                        tdDiv.find('.date_set').toggle();
                        tdInput.val(date);
                    } else {
                        unblock.filter.onChange();
                    }
                } else {
                    alert(data['errors']);
                }
            }
        });
    };

    this.markAll = function(type) {
        this.filter.onChange();
        this.grid.lastSelectionData = [];

        if (type) {
            this.grid.lastSelectionData = this.grid.ajaxAllData.totalresult;
            $('.filter-grid-body table tr').addClass('filter-grid-body-select-row');
        } else {
            $('.filter-grid-body table tr').removeClass('filter-grid-body-select-row');
        }

        $('#amountSelected').text(this.grid.lastSelectionData.length);
    };

    /**
     * События.
     */
    this.bindEvents = function() {
        var _self = this;

        // Сброс фильтра
        $('#filterReset').click(function() {
            _self.grid.close();
            _self.filter.rebuildFilter(true);
        });

        // Клик на чекбоксе выделить        
        $('#markAll').click(function() {
            _self.markAll($(this).is(':checked'));
        });

        this.initControlButtons();
    };

    this.initControlButtons = function() {
        function nationalDays(date) {
            // Получение даты
            dmy = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();

            // Если день выходной, то блокируем его
            if ($.inArray(dmy, unblock.unavailableDates) > -1)
                return [false, "", "Unavailable"];

            return [true, ""];
        }

        var input = $('<input/>')
            .attr({type : 'image',src : linkPrefix + '/img/calendar.png'})
            .addClass('date_unset')
            .addClass('dp_img')
            .datepicker({
                beforeShowDay: nationalDays,
                minDate: 1,
                onSelect: function(dateText) {
                    if (unblock.grid.lastSelectionData && unblock.grid.lastSelectionData.length) {
                        if (confirm('Вы уверены, что хотите изменить дату разблокировки записей на ' + dateText + '?')) {
                            unblock.changeDate(undefined, this.value, unblock.grid.lastSelectionData);
                        }
                    } else {
                        alert('Необходимо выбрать запись!');
                    }
                }
            });

        var clearLink = $('<a/>').addClass('date_unset').attr({'href' : 'javascript:void(0);'}).css({'margin-right': '5px'});
        clearLink.append(
            $('<img/>')
                .attr({'src' : linkPrefix + '/img/system/receipts.png','title' : "Сбросить товары по всем заявкам менеджеров"})
                .css({'width' : '16px','height': '16px'})
                .click(function() {
                    if (unblock.grid.lastSelectionData && unblock.grid.lastSelectionData.length) {
                        if (confirm('Вы уверены, что хотите сбросить товары во всех заявках менеджера?')) {
                            unblock.reset(undefined, unblock.grid.lastSelectionData);
                        }
                    } else {
                        alert('Необходимо выбрать запись!');
                    }
                })
        );

        var clearOneRowLink = $('<a/>').addClass('date_unset').attr({'href' : 'javascript:void(0);'}).css({'margin-right': '5px'});
        clearOneRowLink.append(
            $('<img/>')
                .attr({'src' : linkPrefix + '/img/system/receipt.png','title' : "Сбросить товары по выбранным заявкам"})
                .css({'width' : '16px','height': '16px'})
                .click(function() {
                    if (unblock.grid.lastSelectionData && unblock.grid.lastSelectionData.length) {
                        if (confirm('Вы уверены, что хотите сбросить товары только по выбранным заявкам?')) {
                            unblock.resetone(undefined, unblock.grid.lastSelectionData);
                        }
                    } else {
                        alert('Необходимо выбрать запись!');
                    }
                })
        );

        var deleteLink = $('<a/>').addClass('date_unset').attr({'href' : 'javascript:void(0);'}).css({'margin-right': '5px'});
        deleteLink.append(
            $('<img/>')
                .attr({'src' : linkPrefix + '/img/system/receipt--minus.png','title' : "Удаление записей"})
                .css({'width' : '16px','height': '16px'})
                .click(function() {
                    if (unblock.grid.lastSelectionData && unblock.grid.lastSelectionData.length) {
                        if (confirm('Вы уверены, что хотите удалить выбранные записи?')) {
                            unblock.removeRow(undefined, unblock.grid.lastSelectionData);
                        }
                    } else {
                        alert('Необходимо выбрать запись!');
                    }
                })
        );

        var changeImage = $('<img/>')
            .addClass('date_set')
            .attr({'src' : linkPrefix + '/img/system/editFilterS.png','title' : 'Удалить изменение даты','alt' : 'X','width' : '16px','height' : '16px'})
            .css({'display' : 'inline','cursor': 'pointer','margin-left' : '2px'})
            .click(function() {
                if (unblock.grid.lastSelectionData && unblock.grid.lastSelectionData.length) {
                    if (confirm('Вы уверены, что хотите удалить изменение даты выбранных записей?')) {
                        unblock.changeDate(undefined, unblock.release_date_full, unblock.grid.lastSelectionData);
                    }
                } else {
                    alert('Необходимо выбрать запись!');
                }
            });

        if (!unblock.permissions.changedate)
            input = $('');

        if (!unblock.permissions.unblockclaim) {
            clearOneRowLink = $('');
            clearLink = $('');
        }

        if (!unblock.permissions.deleterecord)
            deleteLink = $('');

        if (!unblock.permissions.deletechangedate)
            changeImage = $('');

        $('#controlButtons').append(input.after(clearLink).after(clearOneRowLink).after(deleteLink).after(changeImage));
    };

    this.checkDateChanges = function() {
        var spans = $('.filter-grid-body').find('span');

        $.each(spans, function(key, span){
            var span = $(span);

            if (span.text() != unblock.release_date) {
                span.parent().children('.date_set').show();
                span.parent().children('.date_unset').hide();
            }
        });
    };

    /**
     * Удалить элемент из списка разблокировок
     */
    this.removeRow = function (obj, pps) {
        var pp = 0;
        if (obj) {
            pp =  obj.attr('data-pp')
        }
        $.ajax({
            url: linkPrefix + '/analitics/unblock/remove',
            cache: false,
            type: 'POST',
            data: {pp: pp, pps: pps},
            dataType: 'json',
            success: function(data) {
                if (data === true) {
                    unblock.filter.rebuildFilter(false);
                } else {
                    alert('Произошла ошибка!');
                }
            }
        });
    };

    /**
     * Сброс блокировки в одной заявке
     */
    this.resetone = function (obj, pps) {
        pp = obj ? obj.attr('data-pp') : 0;

        $.ajax({
            url: linkPrefix + '/analitics/unblock/resetone',
            cache: false,
            type: 'POST',
            data: {pp: pp, pps: pps},
            dataType: 'json',
            success: function(data) {
                if (data.result === true) {
                    unblock.filter.rebuildFilter(false);
                } else if (data.error) {
                    alert(data.error);
                }
            }
        });
    };

    /**
     * Сброс блокировки во всех заявках менеджера
     */
    this.reset = function (obj, pps) {
        var pp = obj ? obj.attr('data-pp') : 0;

        $.ajax({
            url: linkPrefix + '/analitics/unblock/reset',
            cache: false,
            type: 'POST',
            data: {pp: pp, pps: pps},
            dataType: 'json',
            success: function(data) {
                if (data.result === true) {
                    unblock.filter.rebuildFilter(false);
                } else if (data.error) {
                    alert(data.error);
                }
            }
        });
    };

    /**
     * Поведение формы при изменении полей
     */
    this.search = {
        sel_val : 0,
        loadedProds : false,
        change : function(obj) {
            var users_sel = $('#users_sel');
            var filter_and_grid = $('#filterFields');
            var exclusion_users_sel = $('#exclusion_users_sel');
            var exclusion_filter_and_grid = $('#exclusion_filterFields');
            this.closeEl(exclusion_users_sel);
            this.closeEl(exclusion_filter_and_grid);
            this.sel_val = $(obj).val();
            $("#exclusion option").show();
            $('#exclusion option:eq(0)').prop('selected', true);
            $("#exclusion option[value='" + this.sel_val + "']").hide();
            switch(this.sel_val) {
                case '1':
                    this.closeEl(users_sel);
                    this.closeEl(filter_and_grid);
                    break;
                case '2':
                    this.openEl(users_sel);
                    this.closeEl(filter_and_grid);
                    this.loadDept();
                    break;
                case '3':
                    this.openEl(users_sel);
                    this.closeEl(filter_and_grid);
                    this.loadManagers();
                    break;
                case '4':
                    this.closeEl(users_sel);
                    this.openEl(filter_and_grid);
                    this.loadProducts();
                    break;
            }
        },
        changeExclusion : function(obj) {
            var users_sel = $('#exclusion_users_sel');
            var filter_and_grid = $('#exclusion_filterFields');

            this.sel_val = $(obj).val();
            switch(this.sel_val) {
                case '0':
                    this.closeEl(users_sel);
                    this.closeEl(filter_and_grid);
                    break;
                case '2':
                    this.openEl(users_sel);
                    this.closeEl(filter_and_grid);
                    this.loadDept('exclusion_');
                    break;
                case '3':
                    this.openEl(users_sel);
                    this.closeEl(filter_and_grid);
                    this.loadManagers('exclusion_');
                    break;
                case '4':
                    this.closeEl(users_sel);
                    this.openEl(filter_and_grid);
                    this.loadProducts('exclusion_');
                    break;
            }
        },
        checkForm : function() {
            this.clearErrors();

            if ($('#unblock_type').val() == 4) {
                var table_data = depot.grid.ajaxAllData;
                var unblock_products = $('#unblock_products');
                $('#unblock_products option').remove();
                var ids = table_data.ids.split(",");

                $.each(ids, function(k, v) {
                    var option = $('<option/>');
                    option.val(v);
                    option.text(v);
                    option.prop('selected', true);
                    option.appendTo(unblock_products);
                });
            }
            if ($('#exclusion').val() == 4) {
                var table_data = depot.grid.ajaxAllData;
                var unblock_products = $('#unblock_exclusion_products');
                $('#unblock_exclusion_products option').remove();
                var ids = table_data.ids.split(",");

                $.each(ids, function(k, v) {
                    var option = $('<option/>');
                    option.val(v);
                    option.text(v);
                    option.prop('selected', true);
                    option.appendTo(unblock_products);
                });
            }

            var data = $('#form_params').serialize();

            $.ajax({
                url: linkPrefix + '/analitics/unblock/check-form',
                cache: false,
                type: 'POST',
                data: data,
                dataType: 'json',
                success: function(data) {
                    if (typeof data == 'string') {
                        window.location.replace(data);
                    } else {
                        $.each(data, function(id, errors) {
                            var ul = $('<ul/>');
                            ul.addClass('errors');

                            if (id == 'unblock_managers' || id == 'unblock_depts') {
                                ul.insertAfter('#users_sel');
                            } else if (id == 'unblock_products') {
                                ul.insertAfter('#searchResult');
                            } else {
                                ul.insertAfter('#' + id);
                            }

                            $.each(errors, function(key, value) {
                                var li = $('<li/>');
                                li.text(value).appendTo(ul);
                            });
                        });
                    }
                }
            });
        },
        clearErrors : function() {
            $('#form_params ul[class=errors]').remove();
        },
        closeEl : function(obj) {
            obj.parent('td').parent('tr').hide();
        },
        openEl : function(obj) {
            obj.parent('td').parent('tr').show();
        },
        loadDept : function(name) {
            if (!name) {
                name = '';
            }
            var _self = this;
            var users_sel = $('#' + name + 'users_sel');
            var unblock_depts = $('#unblock_' + name + 'depts');

            if ($('#' + name + 'users_sel-label label').exists()) {
                $('#' + name + 'users_sel-label label').text('Выберите отдел:');
            } else {
                var label = $('<label/>');
                label.addClass('required');
                label.attr('for', name + 'users_sel');
                label.text('Выберите отдел:');
                $('#' + name + 'users_sel-label').append(label);
            }

            $.ajax({
                url: linkPrefix + '/analitics/unblock/get-dept',
                cache: false,
                type: 'POST',
                data: {},
                dataType: 'json',
                beforeSend: function() {
                    _self.preloader(users_sel, 'on');
                    unblock_depts.empty();
                    users_sel.empty();
                },
                success: function(data) {
                    var b = $('<b/>');
                    $('<img/>').attr({list:'collapce', src : linkPrefix + '/img/salary/collapse.18.png',align : "absmiddle"}).appendTo(b);
                    $('<img/>').attr({list:'expand', src : linkPrefix + '/img/salary/expand.18.png',align : "absmiddle"}).appendTo(b);

                    b.append('Выберите отдел:');

                    $('<img/>').attr({action:'unselect', src : linkPrefix + '/img/salary/all.unselect.18.png'}).appendTo(b);
                    $('<img/>').attr({action:'select', src : linkPrefix + '/img/salary/all.select.18.png'}).appendTo(b);
                    $('<small/>').text('0/0').appendTo(b);

                    var div_list = $('<div/>').attr('list', 'collapce');

                    b.appendTo(div_list);

                    div_list.appendTo(users_sel.css('height', '110px'));

                    var spans_div = $('<div/>');

                    spans_div.appendTo(users_sel.children('div'));

                    $.each(data, function(key, rows) {

                        var option = $('<option/>');
                        option.text(rows.dept_title);
                        option.val(rows.dept_id);
                        option.appendTo(unblock_depts);

                        var span = $('<span/>');

                        span.attr({
                            lang : rows.dept_id,
                            number : key,
                            selected : "no",
                            tabIndex : "0",
                            title : rows.dept_title
                        });

                        span.text(rows.dept_title);
                        span.appendTo(spans_div);
                    });

                    unblock.ctrlSelectedUsers(name);

                    _self.preloader(users_sel, 'off');
                }
            });
        },
        loadManagers : function(name) {
            if (!name) {
                name = '';
            }
            var _self = this;
            var users_sel = $('#' + name + 'users_sel');
            var unblock_managers = $('#unblock_' + name + 'managers');

            if ($('#' + name + 'users_sel-label label').exists()) {
                $('#' + name + 'users_sel-label label').text('Выберите менеджеров:');
            } else {
                var label = $('<label/>');
                label.addClass('required');
                label.attr('for', '' + name + 'users_sel');
                label.text('Выберите менеджеров:');
                $('#' + name + 'users_sel-label').append(label);
            }

            $.ajax({
                url: linkPrefix + '/analitics/unblock/get-managers',
                cache: false,
                type: 'POST',
                data: {},
                dataType: 'json',
                beforeSend: function (xhr) {
                    _self.preloader(users_sel, 'on');
                    unblock_managers.empty();
                    users_sel.empty();
                },
                success: function(data) {

                    $.each(data, function(key, depts) {
                        var b = $('<b/>');
                        $('<img/>').attr({list:'collapce', src : linkPrefix + '/img/salary/collapse.18.png',align : "absmiddle"}).appendTo(b);
                        $('<img/>').attr({list:'expand', src : linkPrefix + '/img/salary/expand.18.png',align : "absmiddle"}).appendTo(b);

                        b.append(depts.dept_title);

                        $('<img/>').attr({action:'unselect', src : linkPrefix + '/img/salary/all.unselect.18.png'}).appendTo(b);
                        $('<img/>').attr({action:'select', src : linkPrefix + '/img/salary/all.select.18.png'}).appendTo(b);
                        $('<small/>').text('0/0').appendTo(b);

                        var div_list = $('<div/>').attr('list', 'collapce');

                        b.appendTo(div_list);

                        div_list.appendTo(users_sel.css('height', '200px'));

                        var spans_div = $('<div/>');

                        spans_div.appendTo(users_sel.children('div').last());

                        $.each(depts.managers, function(k, user) {

                            var option = $('<option/>');
                            option.text(user.name);
                            option.val(user.id);
                            option.appendTo(unblock_managers);

                            var span = $('<span/>');

                            span.attr({
                                lang: user.id,
                                number: key,
                                selected: "no",
                                tabIndex: "0",
                                title: user.name
                            });

                            span.text(user.name);
                            span.appendTo(spans_div);
                        });

                    });

                    unblock.ctrlSelectedUsers(name);

                    _self.preloader(users_sel, 'off');
                },
            });
        },
        loadProducts : function(name) {
            if(!name) {
                name = '';
            }
            if (!depot.checkIsInit(name)) {
                depot.initFilter(name);
            }
        },
        preloader : function(el, type) {
            var disabled = false;
            var backgnd = '';

            if (type == 'on') {
                disabled = true;
                backgnd = 'url("' + linkPrefix + '/img/ld/indicator.gif") no-repeat scroll center center';
            }

            el.prop('disabled', disabled);
            el.css({background : backgnd});
        }
    };

    /**
     * Инициализация блока юзверей.
     */
    this.initUsers = function(name) {
        var users_sel = $('#' + name + 'users_sel');

        users_sel.click(function(e) {
            setTimeout(function(node) {unblock.onClickUsers({target:node}, name)}, 0, e.target);
        });
        users_sel.keydown(function(e) {
            return unblock.onKeyUsers(e, name);
        });
        $('#' + name + 'users_sel_ctrl').click(function(e) {
            if (!e.target.getAttribute('action')) {
                return;
            }
            var action = e.target.getAttribute('action');
            switch (action) {
                case 'all':
                case 'clear':
                    var list = $('#' + name + 'users_sel span'), i=0;

                    while (list[i]) {
                        var sel_attrs;
                        sel_attrs = action == 'all' ? 'yes' : 'no';
                        list[i].setAttribute('selected', sel_attrs)
                        ++i;
                    }

                    unblock.ctrlSelectedUsers(name);
                    break;
                case 'expand':
                case 'collapce':
                    var nodes = $('#' + name + 'users_sel div'), i=0;
                    while (nodes[i]) {
                        if (nodes[i].nodeType == 1) {
                            nodes[i].setAttribute('list', action);
                        }
                        ++i;
                    }
                    break;
            }
        });
        this.ctrlSelectedUsers(name);
        this.node('filter_' + name + 'users_sel_input').oninput = function() {
            unblock.applyFilterUsers(this, name);
        };
        $('#filter_' + name + 'users_sel').click(function(e) {
            if (e.target.lang != 'clear') return;
            unblock.node('filter_' + name + 'users_sel_input').value = '';
            unblock.node('filter_' + name + 'users_sel_input').oninput()
        });
    };

    /**
     * Обработка клавиатурных событий в блоке юзверей.
     */
    this.onKeyUsers = function(e, name) {
        if (e.keyCode == 13 || e.keyCode == 32) {
            e.target.setAttribute('selected', (e.target.getAttribute('selected') == 'yes' ? 'no' : 'yes'));
            this.ctrlSelectedUsers(name);
            return 1;
        }
        if (e.keyCode == 38 || e.keyCode == 40) {
            var spans = $('#users_sel span');
            var i = (e.keyCode == 38 ? spans.length - 1 : 0), next = false;
            while (spans[i]) {
                if (spans[i].parentNode.parentNode.getAttribute('list') == 'expand') {
                    i += (e.keyCode == 38 ? -1 : 1);
                    continue;
                }
                if (next) {
                    spans[i].focus();
                    if (spans[i].getAttribute('number') == '0') {
                        $('#users_sel').scrollTop -= (e.keyCode == 38 ? 25 : 0);
                    }
                    return false;
                }
                if (spans[i] == e.target) {
                    next = true;
                }
                i += (e.keyCode == 38 ? -1 : 1);
            }
            return false;
        }
        return 1;
    };

    /**
     * Обработка клика в блоке юзверей.
     */
    this.onClickUsers = function(e, name) {
        if (e.target.nodeName.toLowerCase() == 'b' || (e.target.nodeName.toLowerCase() == 'img' && !e.target.getAttribute('action'))) {
            var cnt = e.target.nodeName.toLowerCase() == 'b' ? e.target.parentNode : e.target.parentNode.parentNode;
            cnt.setAttribute('list', (cnt.getAttribute('list') == 'collapce' ? 'expand' : 'collapce'));

            if (cnt.getAttribute('list') == 'collapce') {
                if (cnt.getElementsByTagName('span')[0]) {
                    cnt.getElementsByTagName('span')[0].focus();
                }
            } else {
                var spans = $('#' + name + 'users_sel span'), next = false, test = cnt.getElementsByTagName('span')[0];
                i = 0;
                while (spans[i]) {
                    if (next && spans[i].parentNode.parentNode.getAttribute('list') == 'collapce') {
                        spans[i].focus();

                        if (spans[i].getAttribute('number') == '0') {
                            $('#' + name + 'users_sel').scrollTop -= 25;
                        }
                        return;
                    }
                    if (spans[i] == test) {
                        next = true;
                    }
                    ++i;
                }
                i = spans.length - 1;
                while (spans[i]) {
                    if (next && spans[i].parentNode.parentNode.getAttribute('list') == 'collapce') {
                        spans[i].focus();

                        if (spans[i].getAttribute('number') == '0') {
                            $('#' + name + 'users_sel').scrollTop -= 25;
                        }
                        return;
                    }
                    if (spans[i] == test) {
                        next = true;
                    }
                    --i;
                }
            }
            return;
        }

        if (e.target.getAttribute('selected')) {
            e.target.setAttribute('selected', (e.target.getAttribute('selected') == 'yes') ? 'no' : 'yes');
            this.ctrlSelectedUsers(name);
        }
        if (e.target.nodeName.toLowerCase() == 'img' && e.target.getAttribute('action')) {
            var cnt = e.target.nodeName.toLowerCase() == 'b' ? e.target.parentNode : e.target.parentNode.parentNode;
            var spans = cnt.getElementsByTagName('span'), sel = (e.target.getAttribute('action') == 'select'), i = 0;
            while (spans[i]) {
                if (spans[i].style.display != 'none') spans[i].setAttribute('selected', (sel ? 'yes' : 'no'));
                ++i;
            }
            this.ctrlSelectedUsers(name);
            if (cnt.getAttribute('list') == 'collapce') {
                if (spans[0]) {
                    spans[0].focus();
                }
            }
            else {
                var test = spans[0];
                var spans = $('#' + name + 'users_sel span'), next = false;
                i = 0;
                while (spans[i]) {
                    if (next && spans[i].parentNode.parentNode.getAttribute('list') == 'collapce') {
                        spans[i].focus();
                        if (spans[i].getAttribute('number') == '0') this.node(name + 'users_sel').scrollTop -= 25;
                        return;
                    }
                    if (spans[i] == test) {
                        next = true;
                    }
                    ++i;
                }
                i = spans.length - 1;
                while (spans[i]) {
                    if (next && spans[i].parentNode.parentNode.getAttribute('list') == 'collapce') {
                        spans[i].focus();
                        if (spans[i].getAttribute('number') == '0') this.node(name + 'users_sel').scrollTop -= 25;
                        return;
                    }
                    if (spans[i] == test) {
                        next = true;
                    }
                    --i;
                }
            }
        }
    };

    /**
     * Контроль выделения юзверей.
     */
    this.ctrlSelectedUsers = function(name) {
        if (!name) {
            name = '';
        }
        var smalls = $('#' + name + 'users_sel small'), i = 0, spans = null, j = 0, total = 0, sel = 0;
        if (!name) {
            var type_val = $('#unblock_type').val();
        } else {
            var type_val = $('#exclusion').val();
        }
        var select_depts = $('#unblock_' + name + 'depts');
        var select_managers = $('#unblock_' + name + 'managers');

        while (smalls[i]) {
            j = 0;
            total = 0;
            sel = 0;
            spans = smalls[i].parentNode.parentNode.getElementsByTagName('span');
            while (spans[j]) {
                ++total;

                var selected_value = false;

                if (spans[j].getAttribute('selected') == 'yes') {
                    ++sel;
                    selected_value = true;
                }

                switch(type_val) {
                    case '2':
                        var value = spans[j].getAttribute('lang');
                        select_depts.children('option[value="' + value + '"]').prop('selected', selected_value);
                        break;
                    case '3':
                        var value = spans[j].getAttribute('lang');
                        select_managers.children('option[value="' + value + '"]').prop('selected', selected_value);
                        break;
                }

                ++j;
            }
            smalls[i].innerHTML = '(' + sel + '/' + total + ')';
            ++i;
        }
    }

    /**
     * Обработка изменений фильтра по юзверям.
     */
    this.applyFilterUsers = function(obj, name) {
        var search = obj.value.toLowerCase().split(','), i=0;

        var list = $('#' + name + 'users_sel div div span'), j=0, display = 'none';

        while (list[j]) {
            display = (obj.value.replace(/^\s+|\s+$/, '') == '' ? '' : 'none');
            i=0;
            while (search[i]) {
                if (list[j].title.toLowerCase().indexOf(search[i].replace(/^\s+|\s+$/, '')) > -1) {
                    display = '';
                    list[j].parentNode.parentNode.setAttribute('list', 'collapce');
                    break;
                }
                ++i;
            }
            list[j].style.display = display;
            ++j;
        }
    };

    /**
     * Список помеченных юзверей.
     */
    this.getSelectedUsers = function() {
        var list = $('#users_sel span'), i=0, users=[];
        while (list[i]) {
            if (list[i].getAttribute('selected') == 'yes')
                users.push(list[i].lang);
            ++i;
        }
        return users;
    };
});
/**
 * Запрос возвращает выходные дни из календаря
 */
$.ajax({
    url: linkPrefix + '/analitics/unblock/get-holidays',
    cache: false,
    type: 'POST',
    data: {},
    dataType: 'json',
    success: function(data) {
        unblock.unavailableDates = data;
    }
});

/**
 * Скрыть поля в таблице
 */
var unblockFields = new (function() {

    /**
     * список всех полей доступных юзверю
     */
    this.allFields = {};

    /**
     * скрытые поля строковое представление
     */
    this.hideFieldsStr = '';

    /**
     * список скрытых полей
     */
    this.hideFields = {};

    /**
     * удалить дочерние элементы
     */
    this.empty = function(obj) {
        obj = this.node(obj);

        while (obj.firstChild) {
            obj.removeChild(obj.firstChild);
        }
    };

    /**
     * получить узел по ид
     */
    this.node = function(id) {
        return typeof id == 'string' ? document.getElementById(id)||null : id;
    };

    /**
     * удалить узел
     */
    this.removeNode = function(id) {
        var node = this.node(id).parentNode;
        node.removeChild(this.node(id));
        return this;
    }

    /**
     * создать узел
     */
    this.createNode = function(nodeName) {
        return document.createElement((nodeName||'div'));
    };

    /**
     * преобразование hideFieldsStr => hideFields
     */
    this.prepareHideFields = function() {
        var tmp = this.hideFieldsStr.split('|');

        for (var i=0; i<tmp.length; i++) {
            if (!tmp[i]) {
                continue;
            }
            this.hideFields[tmp[i]] = 1;
        }
    };

    /**
     * создание
     */
    this.create = function() {
        this.prepareHideFields();

        var cnt = this.createNode();
        cnt.className = 'fields-report-control';
        cnt.setAttribute('show', 'show');
        document.body.appendChild(cnt);

        // set head
        var h = this.createNode();
        h.innerHTML = '+';
        h.setAttribute('t', 'head');
        h.onclick = function() {
            var test = this.parentNode.getAttribute('show');
            test = (test == 'show' ? 'hide' : 'show');
            this.parentNode.setAttribute('show', test);
            this.innerHTML = (test == 'show' ? '+' : '-');
            $(this.parentNode).animate({height :(test == 'show' ? '20px' : '500px')}, "slow");
        }
        cnt.appendChild(h);

        // set body
        var h = this.createNode();
        h.setAttribute('t', 'fields');
        h.id = 'ctrl_grid_field_fields';
        cnt.appendChild(h);

        // set footer
        var h = this.createNode();
        h.setAttribute('t', 'bottom');
        cnt.appendChild(h);
        // bt ok
        var ok = this.createNode('input');
        ok.type = 'button';
        ok.value = 'Применить';
        ok.disabled = true;
        ok.style.width = '100px';
        ok.id = 'ctrl_grid_field_save';
        ok.onclick = function() {
            unblockFields.save();
        };
        h.appendChild(ok);
        // bt reset
        var ok = this.createNode('input');
        ok.type = 'button';
        ok.value = 'Сброс';
        ok.disabled = true;
        ok.style.width = '100px';
        ok.id = 'ctrl_grid_field_reset';
        ok.onclick = function() {
            unblockFields.reset();
        };
        h.appendChild(ok);

        // bt reset
        var ok = this.createNode('input');
        ok.type = 'button';
        ok.value = 'Скрыть';
        ok.style.width = '100px';
        ok.id = 'ctrl_grid_field_reset';
        ok.onclick = function() {
            $('div[t=head]').click();
        };
        h.appendChild(ok);
    };

    /**
     * отрисовка списка полей
     */
    this.showFields = function()
    {
        var h = this.node('ctrl_grid_field_fields');
        this.empty(h);
        for (var i in this.allFields) {
            var row = this.createNode();
            row.lang = i;
            row.innerHTML = this.allFields[i];
            row.title = this.allFields[i];
            row.setAttribute('disp', (!this.hideFields[i] ? 'yes' : 'no'));
            h.appendChild(row);
            row.onclick = function() {
                var disp = this.getAttribute('disp');
                disp = (disp == 'yes' ? 'no' : 'yes');
                this.setAttribute('disp', disp);

                if (disp == 'yes') {
                    delete(unblockFields.hideFields[this.lang]);
                } else {
                    unblockFields.hideFields[this.lang] = 1;
                }

                unblockFields.checkButtonState();
            };
        }
    };

    /**
     * сброс изменений
     */
    this.reset = function()
    {
        this.prepareHideFields();
        this.showFields();
        this.checkButtonState();
    };

    /**
     * контроль состояния кнопок
     */
    this.checkButtonState = function()
    {
        var tmp = [];
        for (var i in this.hideFields) {
            tmp.push(i);
        }
        tmp.sort();
        var disabled = (tmp.join('|') == this.hideFieldsStr);
        $('#ctrl_grid_field_save').attr('disabled', disabled);
        $('#ctrl_grid_field_reset').attr('disabled', disabled);
    };

    /**
     * сохранение изменений
     */
    this.info = function()
    {
        var data = [];
        for (var i in this.hideFields) {
            data.push(i);
        }
        data = data.sort().join('|');
        $.ajax({
            url      : linkPrefix + '/analitics/unblock/saveconfigfields',
            cache    : false,
            type     : 'POST',
            dataType : 'json',
            data     : { fields : data },
            success  : function(data) {
                unblockFields.hideFieldsStr = data.setting
                unblockFields.prepareHideFields();
                unblockFields.checkButtonState();
            }
        });
        unblock.rebildGrid();
    };
})();

$(document).ready(function() {
    $('input#saveExcel[type="submit"]').click(function() {
        $('input#data').val(serialize(unblock.filter.getValue()));
        $('input#column').val(unblock.grid.sortColumn);
        $('input#sort').val(unblock.grid.sortType);
        $('input#report_id').val(unblock.report_id);
        $('input#perpage').val(1000);
        $('input#release_date').val(unblock.release_date_full);
        $('input#total_weight').val($('#all_weight').text());
        $('input#total_amount').val($('#all_amount').text());
    });

    $('.filter-grid-body tr td a').live('click', function() {
        var obj = $(this);

        switch (obj.children('img').attr('data-type')) {
            case 'delete' :
                if (confirm('Вы уверены, что хотите удалить запись?')) {
                    unblock.removeRow(obj);
                }
                break;
            case 'reset' :
                if (confirm('Вы уверены, что хотите сбросить товар во всех заявках менеджера?')) {
                    unblock.reset(obj);
                }
                break;
            case 'resetone' :
                if (confirm('Вы уверены, что хотите сбросить товар по заявке?')) {
                    unblock.resetone(obj);
                }
                break;
        }
    });
    $('#deleteReport').click(function() {
        if (unblock.report_id != 0) {
            window.location.href = linkPrefix + '/analitics/unblock/remove-report/' + unblock.report_id;
        }
        return false;
    });
});