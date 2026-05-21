/**
 * Проверка на существование элемента
 * @returns {jQuery.length|*|jQuery}
 */
jQuery.fn.exists = function() {
   return $(this).length;
};

/**
 * Заменяет в строке символ "," на "<br />", для того, чтобы каждая запись была в своей строчке
 *
 * @param str
 * @returns {string}
 */
var splitToBr = function(str) {
    if (str) {
        var substringArray = str.split(",");

        if (substringArray.length) {
            var returnStr = '';

            $.each(substringArray, function(i, val) {
                if (i !== 0) {
                    returnStr += '<br />';
                }

                returnStr += val;
            });

            return returnStr;
        }
    }

    return '-';
};

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
     * Получить узел по id.
     */
    this.node = function(id) {
        return typeof id == 'string' ? document.getElementById(id) : id;
    };

    /**
     * Опции полей таблицы
     */
    this.fieldsOptions = {
        id: {
            caption: '#', width: 85, sort: 1, align: 'center', aliace: function(value, container, rowData) {
                if (!parseInt(rowData.isBlocked)) {
                    $(container).parents('tr').css('background-color', '#DAF7D0')
                }

                return value;
            }
        },
        id_goods:     {caption: 'ID товара', width: 100, sort: 1, align: 'center'},
        title   : {
            caption: 'Наименование',
            width: _configFields.field1.tdWidth,
            sort: 1,
            align: 'center',
            aliace:function(v, cnt, rowData) {
                var title = eval(configPropReturn);
                // Вывод примечания отдела закупки
                if (rowData.annotationIn) {
                    var options = {
                        htmlPatternName : 'iconAnnotationBrown',
                        annotation      : rowData.annotationIn,
                        headerName      : 'annotationIn'
                    };
                    title += depot_tooltip.init(options).getTooltip();
                }
                return title;
            }
        },
        prop     : {caption: configProp,     width:_configFields.field2.tdWidth, sort:1, aliace:function(v, cnt, rowData) { return eval(configPropReturn);}},
        color    : {caption: configColor,    width:_configFields.field3.tdWidth, sort:1, aliace:function(v, cnt, rowData) { return eval(configColorReturn);}},
        boxType  : {caption: configBoxType,  width:_configFields.field4.tdWidth, sort:1, aliace:function(v, cnt, rowData) { return eval(configBoxTypeReturn);}},
        volum    : {caption: configVolum,    width:_configFields.field5.tdWidth, sort:1, aliace:function(v, cnt, rowData) { return eval(configVolumReturn);}},
        height   : {caption: configHeight,   width:_configFields.field6.tdWidth, sort:1,
            aliace:function(v, cnt, rowData) { // Отображение реального поставщика
                showVendornameTitle(rowData, cnt);
                return eval(configHeightReturn);
            }
        },
        width       : {caption: configWidth,   width:_configFields.field7.tdWidth, sort:1, aliace:function(v, cnt, rowData){ return eval(configWidthReturn);}},
        depth       : {caption: configDepth, width:_configFields.field8.tdWidth, sort:1, aliace:function(v, cnt, rowData){ return eval(configDepthReturn);}},
        labelWeight : {caption: configLabelWeight, width:_configFields.field9.tdWidth, sort:1, aliace:function(v, cnt, rowData){ return eval(configLabelWeightReturn);}},
        // title:        {caption: 'Наименование', width: 130, sort: 1, align: 'center'},
        managerName:  {caption: 'Менеджер', width: 160, sort: 1, align: 'center'},
        block_release_date_full:    {caption: 'Дата разблокировки', width: 130, sort: 1, align: 'center'},
        disable_block_days: {caption: 'Кол-во дней на запрет блокировки', width: 130, sort: 1, align: 'center'},
        access_dates: {
            caption: 'Даты разрешений', width: 130, sort: 1, align: 'center', aliace: function(value, container, rowData) {
                return splitToBr(value);
            }
        },
        access_count: {caption: 'Кол-во разрешений', width: 130, sort: 1, align: 'center'},
        access_user:   {
            caption: 'ФИО разрешающего', width: 130, sort: 1, align: 'center', aliace: function(value, container, rowData) {
                return splitToBr(value);
            }
        }
    };

    /**
     *  Инициализация фильтра и грида. 
     */
    this.init = function() {

        if (this.permissions.unblock_item > 0) {
            this.fieldsOptions.actions = {
                caption: 'Действия', width: 129, align: 'center', aliace: function(value, container, rowData) {
                    var giveaccess = $('');

                    if (parseInt(rowData.isBlocked)) {
                        giveaccess = $('<img/>')
                            .attr({'src' : linkPrefix + '/img/system/go.16.png','data-type' : 'reset','title' : "Разрешить блокировку", 'data-id' : rowData.id})
                            .css({'width' : '16px','height': '16px', cursor: 'pointer'})
                            .click(function(){
                                if (confirm('Вы уверены, что хотите разрешить менеджеру добавлять товар в заявки?')) {
                                    unblock.giveAccess(rowData.id);
                                }
                            });
                    }

                    return giveaccess;
                }
            }
        }

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
            urlGetFullData: linkPrefix + '/analitics/unblock/getfilterconfig?stat=true',
            urlGetMaskData: linkPrefix + '/analitics/unblock/getfiltermask?stat=true',
            conteinerId: 'filter',
            filterType: 'excel',
            imgLoader: linkPrefix + '/img/ld/ld3.gif',
            clsImgUrl: linkPrefix + '/img/system/clear.16.png',
            itemsInRow : 4
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
            conteinerId: 'searchResult',
            urlGetData: linkPrefix + '/analitics/unblock/getfilterresult?stat=true',
            imgError: linkPrefix + '/img/system/error.16.png',
            imgLoader: linkPrefix + '/img/ld/ld3.gif',
            sort: 'asc',
            sortColumn: 'block_release_date',
            perpage: 20,
            emptyMsg: '<h3>Нет записей</h3>',
            async : false
        });

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
                    if (inps.item(i).nodeName.toLowerCase() != 'input') {
                        continue;
                    }
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
                },
                error: function(o) {
                    _self._errorAjax(o.responseText);
                }
            });
            if (typeof this.onBeforeUpdateData == 'function') {
                this.onBeforeUpdateData();
            }
        };
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
    };

    /**
     * перстройка грида без загрузки данных при изменении видимости полей
     */
    this.rebildGrid = function() {
        var _self = this;

        var grid = new Grid({
            conteinerId: 'searchResult',
            urlGetData: linkPrefix + '/analitics/unblock/getfilterresult?stat=true',
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
     * Разрешить блокировку менеджерам
     */
    this.giveAccess = function (id) {
        $.ajax({
            url: linkPrefix + '/analitics/unblock/give-access',
            cache: false,
            type: 'POST',
            data: {rowId : id},
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
            url      : linkPrefix + '/analitics/unblock/saveconfigfieldsstatistics',
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
        $('input#perpage').val(1000);
    });
});