/**
 * скрипт поддержки страницы детализации отчета
 */


var Report = function()
{
    /**
     * список полей фильтра для создания правил
     */
    this.map = {
        manager_id       : 'out_manager_id',
        supplier_id      : 'in_client_id',
        client_id        : 'out_client_id',
        product_title_id    : 'product_title_id',
        product_prop_id     : 'product_prop_id',
        product_color_id    : 'product_color_id',
        product_box_type_id : 'product_box_type_id',
        product_type     : 'product_type',
        orgstructure_id  : 'orgstructure_id',
        code             : 'operation_id'
    };

    /**
     * удалить дочернии элементы
     */
    this.empty = function(obj)
    {
        obj = this.node(obj);
        while(obj.firstChild){
            obj.removeChild(obj.firstChild);
        }
    };

    /**
     * округление до 5 знаков
     */
    this.round = function(v)
    {
        return Math.round((parseFloat(v)||0)*100000)/100000;
    };

    /**
     * округление до 2 знаков
     */
    this.round2 = function(v)
    {
        return Math.round((parseFloat(v)||0)*100)/100;
    };

    /**
     * получить узел по ид
     */
    this.node = function(id)
    {
        return typeof id == 'string' ? document.getElementById(id)||null : id;
    };

    /**
     * удалить узел
     */
    this.removeNode = function(id)
    {
        var node = this.node(id).parentNode;
        node.removeChild(this.node(id));
        return this;
    }

    /**
     * лоадер
     */
    this.loaderUrl = '/img/ld/ld3.gif';

    /**
     * инициализация фильтра
     */
    this.initFilter = function()
    {
        var _self = this;

        this.aliaces = {
            description1          :function(v, cnt, rowData){cnt.title = (v||'').replace(/\|/g, String.fromCharCode(10,13)); return (v||'').replace(/\|/g, '<br>----<br>');},
            string                :function(v, cnt, rowData){cnt.title = v; return (v||'');},
            title                 :function(v, cnt, rowData){
                cnt.title = v;
                // Вывод примечания отдела закупок
                if (rowData.annotationIn) {
                    var options = {
                        htmlPatternName : 'iconAnnotationBrown',
                        annotation      : rowData.annotationIn,
                        headerName      : 'annotationIn'
                    };
                    v += depot_tooltip.init(options).getTooltip();
                }
                return (v||'');
            },
            stringNoTag           :function(v, cnt, rowData){cnt.title = v; return (v||'').replace(/\<[^\>]+\>/g, '');},
            simple                :function(v, cnt, rowData){cnt.title = v; return Report.round2((v||''));},
            simpleND              :function(v, cnt, rowData){return Report.round2((v||'')) ? Report.round2((v||'')) : 'н/д'; },
            simpleNDSign          :function(v, cnt, rowData){return Report.round2((v||'')) ? Report.round2((v||'')) *  rowData.operation_sign: 'н/д'; },
            simpleSumm            :function(v, cnt, rowData){
                cnt.title = v;
                return Report.round2((v||'')) ? Report.round2((v||'')) : 0;
            },
            profitSumm             :function(v, cnt, rowData){
                var text = (Report.round2((v||'')) ? Report.round2((v||'')) : '0') + '';
                if (typeof rowData.profit_period != 'undefined') {
                    text += String.fromCharCode(10) + '(' +(Report.round2((rowData.profit_period||'')) ? Report.round2((rowData.profit_period||'')) : '0') + ')';
                }
                cnt.title = text;
                return text.replace(/\n/, '<br />');
            },
            simpleSummSign        :function(v, cnt, rowData){cnt.title = v; return (Report.round2((v||'')) ? Report.round2((v||'')) : 0) * rowData.operation_sign; },
            simpleND2             :function(rowData, key){
                var v = rowData[key];
                if (Report.round((v||''))) return Report.round2((v||''));
                if (rowData['formula_' + key] != '0') return 0;
                return'н/д';
            },
            simpleND2sign         :function(rowData, key){
                var v = rowData[key];
                if (Report.round((v||''))) return Report.round2((v||'')) * rowData.operation_sign;
                if (rowData['formula_' + key] != '0') return 0;
                return'н/д';
            },

            distribution_car      :function(v, cnt, rowData){ return ((v || v == '0') ? Report.round2(v) : 'пропорц.') + (Report._getPermissionRow(rowData, 'car_distribution') && rowData.detailed_type == 0 && rowData.total_car_cost > 0 && rowData.count_products > 1 ? '<span types="bt" action="distribution_car"><span></span></span>':'');},
            distribution_other    :function(v, cnt, rowData){ return ((v || v == '0') ? Report.round2(v) : 'пропорц.') + (Report._getPermissionRow(rowData, 'other_distribution') && rowData.detailed_type == 0 && rowData.total_other_cost > 0 && rowData.count_products > 1 ? '<span types="bt" action="distribution_other"><span></span></span>':'');},
            distribution_kickback :function(v, cnt, rowData){ return ((v || v == '0') ? Report.round2(v) : 'пропорц.') + (Report._getPermissionRow(rowData, 'distribution_kickback') && rowData.detailed_type == 0 && rowData.total_kickback > 0 && rowData.count_products > 1 ? '<span types="bt" action="distribution_kickback"><span></span></span>':'');},
            distribution_agent_commission :function(v, cnt, rowData){ return ((v || v == '0') ? Report.round2(v) : 'пропорц.') + (Report._getPermissionRow(rowData, 'distribution_agent_commission') && rowData.detailed_type == 0 && rowData.total_agent_commission > 0 && rowData.count_products > 1 ? '<span types="bt" action="distribution_agent_commission"><span></span></span>':'');},

            background_row        :function(v, cnt, rowData, ind){
                //cnt.parentNode.parentNode.style.backgroundColor = (parseInt(v) ? (ind%2 ? '#D0FFD0' : '#A5E3A5') : ''); // green
                cnt.parentNode.parentNode.style.backgroundColor = _self.legendHelper.getColor('payed', ind%2); // green
                cnt.parentNode.parentNode.style.color = parseInt(v)?'black':'red'; return parseInt(v)?'оплачено':'не оплачено';
            },
            claim_type            :function(v, cnt, rowData){
                switch(v) {
                    case '1' : return 'приход-отгрузка'; break;
                    case '2' : return 'отгрузка'; break;
                    case '3' : return 'приход от пер-ка - отгрузка'; break;
                    case '4' : return 'возврат отгрузки'; break;
                    case '5' : return 'отгрузка зап. частей'; break;
                    case '6' : return 'отгрузка отходов'; break;
                    case '7' : return 'возврат отходов'; break;
                    case '8' : return 'приход отходов'; break;
                    case '9' : return 'ремонт'; break;
                    case '10' : return 'ремонт не нашего оборудования'; break;
                    case '12' : return 'продажа маркетплейс'; break;
                    case '13' : return 'ремонт не нашего оборудования(услуга)';
                    case '14' : return 'ремонт нашего оборудования(услуга)';
                }
                return '';
            },
            payment_type          :function(v, cnt, rowData){ return (v == '0' ? 'без нал.' : 'налич.');},
            receipts_amd          :function(v, cnt, rowData){cnt.title = v; return Report.aliaces.simpleND2(rowData, 'receipts_amd') + (!Report._getPermissionRow(rowData, 'receipts_amd') ? '' : '<span types="bt" action="receipts_amd"><span></span></span>');},
            price_kg              :function(v, cnt, rowData){cnt.title = v; return Report.aliaces.simpleND2(rowData, 'price_kg')     + (!Report._getPermissionRow(rowData, 'price_kg') ? '' : '<span types="bt" action="price_kg"><span></span></span>');},
            in_price_kg           :function(v, cnt, rowData){cnt.title = v; return Report.aliaces.simpleND2(rowData, 'in_price_kg')  + (!Report._getPermissionRow(rowData, 'in_price_kg') ? '' : '<span types="bt" action="in_price_kg"><span></span></span>');},
            price_item            :function(v, cnt, rowData){cnt.title = v; return Report.aliaces.simpleND2(rowData, 'price_item')   + (!Report._getPermissionRow(rowData, 'price_item') ? '' : '<span types="bt" action="price_item"><span></span></span>');},
            in_price_item         :function(v, cnt, rowData){cnt.title = v; return Report.aliaces.simpleND2(rowData, 'in_price_item')+ (!Report._getPermissionRow(rowData, 'in_price_item') ? '' : '<span types="bt" action="in_price_item"><span></span></span>');},
            summ1                 :function(v, cnt, rowData){cnt.title = v; return Report.aliaces.simpleND2(rowData, 'summ1')        + (!Report._getPermissionRow(rowData, 'summ1') ? '' : '<span types="bt" action="summ1"><span></span></span>');},
            summ2                 :function(v, cnt, rowData){cnt.title = v; return Report.aliaces.simpleND2(rowData, 'summ2')        + (!Report._getPermissionRow(rowData, 'summ2') ? '' : '<span types="bt" action="summ2"><span></span></span>');},
            salary                :function(v, cnt, rowData){
                cnt.title = v;
                var html = Report.aliaces.simpleND2(rowData, 'salary')
                + (!Report._getPermissionRow(rowData, 'salary') ? '' : '<span types="bt" action="salary"><span></span></span>')
                + (Report._getPermissionRow(rowData, 'showkoof') == 0 ? '' : '<span types="bt" action="salary_detailed"><span></span></span>');
                return html;
            },
            profit                :function(v, cnt, rowData){cnt.title = v; return Report.aliaces.simpleND2(rowData, 'profit')       + (!Report._getPermissionRow(rowData, 'profit') ? '' : '<span types="bt" action="profit"><span></span></span>');},
            net_profit            :function(v, cnt, rowData){cnt.title = v; return Report.aliaces.simpleND2(rowData, 'net_profit')   + (!Report._getPermissionRow(rowData, 'net_profit') ? '' : '<span types="bt" action="net_profit"><span></span></span>');},
            price_base            :function(v, cnt, rowData, ind){
                cnt.title = v;
                if (!Report.round2((v||'')) && Report.round2((rowData.status||''))) {
                    //cnt.parentNode.parentNode.style.backgroundColor = (ind%2 ? '#E88D54' : '#F4B38A');
                    cnt.parentNode.parentNode.style.backgroundColor = _self.legendHelper.getColor('no_bp', ind%2); // orange
                }

                return Report.aliaces.simpleND(v) + _self.getBasePriceIcon(rowData) + (!Report._getPermissionRow(rowData, 'price_base') ? '' : '<span types="bt" action="price_base"><span></span></span>');
            },
            price_base_manager    :function(v, cnt, rowData, ind){
                cnt.title = v;
                var ret = Report.aliaces.simpleND(v) + (!Report._getPermissionRow(rowData, 'price_base_manager') ? '' : '<span types="bt" action="price_base_manager"><span></span></span>');
                if (!Report.round((rowData.status||''))) {
                    return ret;
                }
                //cnt.parentNode.parentNode.style.backgroundColor = (ind%2 ? '#D0FFD0' : '#A5E3A5'); // green
                cnt.parentNode.parentNode.style.backgroundColor = _self.legendHelper.getColor('payed', ind%2); // green

                var pm = Report.round((v||0));
                var bp = Report.round((rowData.price_base||0));

                if (!Report.grid.head.price_base) {
                    return ret;
                }

                if (!bp) {
                    //cnt.parentNode.parentNode.style.backgroundColor = (ind%2 ? '#E88D54' : '#F4B38A'); // orange
                    cnt.parentNode.parentNode.style.backgroundColor = _self.legendHelper.getColor('no_bp', ind%2); // orange
                }
                else if (pm < bp) {
                    //cnt.parentNode.parentNode.style.backgroundColor = (ind%2 ? '#C6E2FE' : '#AFD3F7'); // blue
                    cnt.parentNode.parentNode.style.backgroundColor = _self.legendHelper.getColor('pm_bp', ind%2); // blue
                }

                //tender
                if (rowData.tender == 1) {
                    cnt.parentNode.parentNode.style.backgroundColor = _self.legendHelper.getColor('tender', ind%2); // green
                }

                return  ret;
            },
            checkbox              :function(v, cnt, rowData){
                if ((rowData.description2||'').replace(/^\s+|\s+$/g, '') != '') cnt.style.background = 'transparent url(/img/salary/check.18.png) no-repeat center center';
                return '';
            },
            description2          :function(v, cnt, rowData){ v = (v||''); cnt.title = v; return v.substring(0, 10) +  (!Report._getPermissionRow(rowData, 'description2') ? '' : '<span types="bt" action="description2"><span></span></span>');},
            description3          :function(v, cnt, rowData){ v = (v||''); cnt.title = v; return v.substring(0, 10) +  (!Report._getPermissionRow(rowData, 'description3') ? '' : '<span types="bt" action="description3"><span></span></span>');},
            detailed_type         :function(v, cnt, rowData){if (v==0){return 'заявка целиком';} return 'корр. к прошлым отчетам';},
            close_net_profit      :function(v, cnt, rowData){cnt.title = v; return Report.aliaces.simpleND2(rowData, 'close_net_profit') + (!Report._getPermissionRow(rowData, 'close_net_profit') ? '' : '<span types="bt" action="close_net_profit"><span></span></span>');},
            profitableness        :function(v, cnt, rowData){
                cnt.title = v + ' %';
                return Report.round2((v||'0')) + ' %';
            },
            claim                 :function(v, cnt, rowData){
                if (!v) {
                    return '';
                }
                cnt.title = v;
                return '<a href="' + linkPrefix + rowData.out_claim_url + '" target="_blank">' + rowData.out_full_id + '</a>';
            },

            product_type          :function(v, cnt, rowData){ return (v != '1' ? 'кг' : 'шт');},
            summClaims1           :function(v, cnt, rowData){
                var cascad = 0, claims = 0, d = 0;
                if (rowData.claim_id > 0 && rowData.detailed_type > 0) {
                    d = 1;
                }
                if (rowData.claim_id > 0) {
                    claims = rowData.countClaims - d;
                }
                if (rowData.detailed_type > 0) {
                    cascad = rowData.countCorrection - d;
                }
                return 'корр. : ' + cascad;
            },
            summClaims2           :function(v, cnt, rowData){
                var cascad = 0, claims = 0, d = 0;
                if (rowData.claim_id > 0 && rowData.detailed_type > 0) {
                    d = 1;
                }
                if (rowData.claim_id > 0) {
                    claims = rowData.countClaims - d;
                }
                if (rowData.detailed_type > 0) {
                    cascad = rowData.countCorrection - d;
                }
                return 'заявок : ' + claims;
            },
            product_width         : function (v, cnt, rowData) {
                // Отображение реального поставщика
                var vendornameResult = false;
                if (rowData[vendornameColName] != undefined) {
                    // Если есть поле vendornameColName, запишем название поставщика в атрибут title
                    vendornameResult = showVendornameTitle(rowData, cnt);
                }
                if (!vendornameResult) {
                    // Если vendornameResult всё ещё false, запишем обычный title
                    cnt.title = v;
                }
                return (v||'');
            },
            hasOverdraft: function(value, container, rowData, callBack)
            {
                if (parseInt(rowData.has_overdraft)) {
                    return $('<span>').text('Н/Д').attr({ title: 'Овердрафт' });
                }

                return callBack(value, container, rowData);
            },
            prepayment: function(value, container, rowData, callBack)
            {
                return value + (Report._getPermissionRow(rowData, 'showkoof') == 0
                    ? ''
                    : `<span types="bt" action="salary_detailed"><span></span></span>`);
            },
            delayed_payment: function(value, container, rowData, callBack)
            {
                return value + (Report._getPermissionRow(rowData, 'showkoof') == 0
                    ? ''
                    : `<span types="bt" action="salary_detailed"><span></span></span>`);
            }
        };

        // проверка на необходимость создания отчетов по параметрам
        // #report.check.create
        if (parseInt(this.needCreated)) {
            this.preCreated();
            return;
        }

        this.filter = new Filter({
            // получение списка значение для полей
            urlGetFullData : linkPrefix + '/salary/report/getfilterconfig',
            // получение маски для для полей
            urlGetMaskData : linkPrefix + '/salary/report/getfiltermask',
            // filter type simple|excel default=simple
            filterType : 'excel',
            //create in node||id
            conteinerId : 'filter',
            // урл индикатора загрузки
            imgLoader : '/img/ld/ld3.gif',
            clsImgUrl : '/img/system/clear.16.png',
            itemsInRow:6,
            defaultStartValues: this.defaultFilterStartValues,
            addPostData:{
                useReports:serialize(this.defaultFilterStartValues.id_salary_report),
                managerSalesId:0,
                onlyTender:0,
            }
        });

        this.filter.onBeforeRebuild = function(){};

        this.grid = new Grid({
            conteinerId: 'search',
            urlGetData: linkPrefix + '/salary/report/getfilterresult',
            imgError: '/img/system/error.16.png',
            imgLoader: '/img/ld/ld3.gif',
            sortColumn: 'date2',
            displayPaging: 1,
            page: 1,
            perpage: this.gerPerPage(),
            backlightSelectRow: 'multiSingleClick',
            clearSingleDowbleSelection: true,
            fieldControll: 'id'
        });

        this.grid.head = {
            id :                     { sort:1, width:100, aliace: this.aliaces.simple,                caption:'№п/п', align:'right'},
            id_salary_report:        { sort:1, width:100, aliace: this.aliaces.string,                caption:'№ отчета'},
            detailed_type:           { sort:1, width:100, aliace: this.aliaces.detailed_type,         caption:'Тип записи', aliaceSumm :this.aliaces.summClaims1},
            operation_id:            { sort:1, width:120, aliace: this.aliaces.claim_type,            caption:'Тип заявки'},
            status:                  { sort:1, width:100, aliace: this.aliaces.background_row,        caption:'Статус'},
            date2:                   { sort:1, width:100, aliace: this.aliaces.string,                caption:'Дата'},
            manager_name:            { sort:1, width:100, aliace: this.aliaces.string,                caption:'Менеджер'},
            orgstructure_name:       { sort:1, width:100, aliace: this.aliaces.string,                caption:'Отдел'},
            claim_id:                { sort:1, width:100, aliace: this.aliaces.claim,                 caption:'Заявка', aliaceSumm :this.aliaces.summClaims2},
            payment_type:            { sort:1, width:100, aliace: this.aliaces.payment_type,          caption:'Тип оплаты'},
            client_name:             { sort:1, width:100, aliace: this.aliaces.string,                caption:'Организация'},
            supplier_name:           { sort:1, width:100, aliace: this.aliaces.string,                caption:'Поставщик'},
            car_distribution:        { sort:1, width:100, aliace: this.aliaces.distribution_car,      caption:'% распред. транспортных расходы'},
            car_cost:                { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Транспортные расходы распред.', aliaceSumm:this.aliaces.simpleSumm},
            other_distribution:      { sort:1, width:100, aliace: this.aliaces.distribution_other,    caption:'% распред. расходников'},
            other_cost:              { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Расходники на товар распред.', aliaceSumm:this.aliaces.simpleSumm},
            receipts_amd:            { sort:1, width:100, aliace: this.aliaces.receipts_amd,          caption:'Сумма по приходу АМД', aliaceSumm:this.aliaces.simpleSumm},
            return_car_cost:         { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Оплата доставки клиентом(сумма) распред.', aliaceSumm:this.aliaces.simpleSumm},
            distribution_agent_commission: { sort:1, width:100, aliace: this.aliaces.distribution_agent_commission,      caption:'% распред. агентской комиссии'},
            agent_commission:        { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Агентская комиссия распред.', aliaceSumm:this.aliaces.simple},
            transfer_additional_expenses: { sort:1, width:100, aliace: this.aliaces.simple,           caption:'Расходы(внутр. перемещение)', aliaceSumm:this.aliaces.simple},

            product_id:              { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Id товара'},
            product_title:           { sort:1, width:100, aliace: this.aliaces.title,                 caption:'Наименование товара'},
            product_prop:            { sort:1, width:100, aliace: this.aliaces.string,                caption:'Тип сырья'},
            product_box_type:        { sort:1, width:100, aliace: this.aliaces.string,                caption:'Упаковка'},
            product_volume:          { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Объем'},
            product_color:           { sort:1, width:100, aliace: this.aliaces.string,                caption:'Цвет'},
            product_width:           { sort:1, width:100, aliace: this.aliaces.product_width,         caption:'Ширина мм'},
            product_height:          { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Длина мм'},
            product_depth:           { sort:1, width:100, aliace: this.aliaces.simple,                caption:'МКМ'},
            product_in_boxes:        { sort:1, width:100, aliace: this.aliaces.simple,                caption:'В упаковке'},
            product_label_weight:    { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Вес этикетки'},
            product_description:     { sort:1, width:100, aliace: this.aliaces.stringNoTag,           caption:'Примечание по товару'},
            product_type:            { sort:1, width:100, aliace: this.aliaces.product_type,          caption:'Тип товара кг/шт'},
            product_item_weight2:    { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Вес в граммах'},

            price:                   { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Цена за ед. изм-я (заявка)'},
            fact_expenses_sum:       { sort:1, width:100, aliace: this.aliaces.simple,                caption:'ФСР'},
            price_kg:                { sort:1, width:100, aliace: this.aliaces.price_kg,              caption:'Цена за кг'},
            price_item:              { sort:1, width:100, aliace: this.aliaces.price_item,            caption:'Цена за ед. изм-я (формула)'},
            in_price_item:           { sort:1, width:100, aliace: this.aliaces.in_price_item,         caption:'Цена за ед. изм-я (закупка)'},
            //amount:                  { sort:1, width:100, aliace: this.aliaces.simpleSummSign,        caption:'Кол-во', aliaceSumm:this.aliaces.simpleSumm},
            amount:                  { sort:1, width:100, aliace: this.aliaces.simpleSumm,            caption:'Кол-во', aliaceSumm:this.aliaces.simpleSumm},
            //weight:                  { sort:1, width:100, aliace: this.aliaces.simpleNDSign,          caption:'Общий вес', aliaceSumm:this.aliaces.simpleSumm},
            weight:                  { sort:1, width:100, aliace: this.aliaces.simpleND,              caption:'Общий вес', aliaceSumm:this.aliaces.simpleSumm},
            summ1:                   { sort:1, width:100, aliace: this.aliaces.summ1,                 caption:'Чистая сумма продажи', aliaceSumm:this.aliaces.simpleSumm},
            summ2:                   { sort:1, width:100, aliace: this.aliaces.summ2,                 caption:'Сумма по заявке', aliaceSumm:this.aliaces.simpleSumm},
            prepayment:              { sort:1, width:100, aliace: this.aliaces.prepayment,            caption:'Предоплата', aliacePrepayment:this.aliaces.simpleSumm},
            delayed_payment:         { sort:1, width:100, aliace: this.aliaces.delayed_payment,       caption:'Отсрочка', aliaceDelayedPayment:this.aliaces.simpleSumm},
            price_base:              { sort:1, width:100, aliace: this.aliaces.price_base,            caption:'Базовая цена'},
            price_base_manager:      { sort:1, width:100, aliace: this.aliaces.price_base_manager,    caption:'Базовая цена менеджера'},
            price_base_with_additional_expenses:  { sort:1, width:100, aliace: this.aliaces.simple,   caption:'Б/ц с доп расходами'},
            salary:                  { sort:1, width:160, aliace: this.aliaces.salary,                caption:'З/п', aliaceSumm:this.aliaces.simpleSumm},
            in_price: {
                sort: 1,
                width: 120,
                aliace: function(value, container, rowData)
                {
                    return _self.aliaces.hasOverdraft(value, container, rowData, _self.aliaces.simple);
                },
                caption: 'Цена за ед. изм. закуп. (заявка)'
            },
            in_price_kg: {
                sort: 1, width: 120,
                aliace: function(value, container, rowData)
                {
                    return _self.aliaces.hasOverdraft(value, container, rowData, _self.aliaces.in_price_kg);
                },
                caption: 'Цена за кг закуп. (формула)'
            },
            profit: {
                sort: 1,
                width: 100,
                aliace: function(value, container, rowData)
                {
                    return _self.aliaces.hasOverdraft(value, container, rowData, _self.aliaces.profit);
                },
                caption: 'Грязная прибыль',
                aliaceSumm: this.aliaces.profitSumm
            },
            net_profit: {
                sort: 1,
                width: 100,
                aliace: function(value, container, rowData)
                {
                    return _self.aliaces.hasOverdraft(value, container, rowData, _self.aliaces.net_profit);
                },
                caption: 'Прибыль',
                aliaceSumm: this.aliaces.simpleSumm
            },
            profitableness:          { sort:1, width:100, aliace: this.aliaces.profitableness,        caption:'% прибыльности'},
            close_net_profit:        { sort:1, width:100, aliace: this.aliaces.close_net_profit,      caption:'Отчетная прибыль', aliaceSumm:this.aliaces.simpleSumm},
            distribution_kickback:   { sort:1, width:100, aliace: this.aliaces.distribution_kickback, caption:'% распред. отката'},
            kickback:                { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Откат распред.', aliaceSumm:this.aliaces.simpleSumm},
            description1:            { sort:1, width:100, aliace: this.aliaces.description1,          caption:'Примечание'},
            checkbox:                { sort:0, width:50,  aliace: this.aliaces.checkbox,              caption:' '},
            description2:            { sort:1, width:100, aliace: this.aliaces.description2,          caption:'Примечание менеджера'},
            description3:            { sort:1, width:100, aliace: this.aliaces.description3,          caption:'Примечание ст.&nbsp;менеджера'}
        };

        this.applyConfigGrid(this.grid);

        for (var i in this.perm.fields) {
            if (!parseInt(this.perm.fields[i])) {
                delete(this.grid.head[i]);
            }
        }

        for (var i in this.grid.head) {
            reportFields.allFields[i] = this.grid.head[i].caption;
        }

        reportFields.prepareHideFields()

        for (var i in reportFields.hideFields) {
            delete(this.grid.head[i]);
        }

        this.filter.onAfterCreate = function()
        {
            Report.grid.addPostData = {};
            if (!Report.grid._isCreated) {
                Report.grid.create();
                Report.grid.fieldControll = 'id';
                Report.grid.lastSelectionData = [];
                Report.lightFilter();
                Report.grid.addPostData.useReports = this.addPostData.useReports;
                Report.grid.addPostData.managerSalesId = this.addPostData.managerSalesId;
                Report.grid.addPostData.onlyTender = this.addPostData.onlyTender;
                this._applyFilter('id_salary_report');
                Report.grid._isCreated = true;
            }
            else {
                Report.lightFilter();
                Report.grid.addPostData.useReports = this.addPostData.useReports;
                Report.grid.addPostData.managerSalesId = this.addPostData.managerSalesId;
                Report.grid.addPostData.onlyTender = this.addPostData.onlyTender;
                Report.grid.update(this.getValue());
            }
        };

        this.filter.onChange = function()
        {
            Report.grid.addPostData.useReports = this.addPostData.useReports;
            Report.grid.addPostData.managerSalesId = this.addPostData.managerSalesId;
            Report.grid.addPostData.onlyTender = this.addPostData.onlyTender;
            Report.grid.curpage = 1;
            Report.grid.update(this.getValue());
        };

        this.filter.onAfterRebuild = function()
        {
            Report.lightFilter();
            Report.grid.update(this.getValue());
        };

        this.grid.onBeforeUpdate = function()
        {
            Report.tmpSelectedReports = this.lastSelectionData;
        }

        this.grid.onClick = function(rowIndex, field, node)
        {
            if (node.nodeName.toLowerCase() != 'span') {
                return;
            }
            var showKoof = false;
            if (node.getAttribute('action') == 'salary_detailed'
                || node.parentNode.getAttribute('action') == 'salary_detailed') {
                showKoof = true;
            }
            while (node.nodeName.toLowerCase() != 'td' && node.id != this.conteinerId) {
                node = node.parentNode;
            }
            if (node.nodeName.toLowerCase() == 'td') {
                this._updateSelectedRow(node);
            }
            var data = this.data[rowIndex];
            if (showKoof) {
                Report.showCalcSalary(data);
                return;
            }
            switch(field){
                case 'car_distribution':
                case 'other_distribution':
                case 'distribution_kickback':
                case 'distribution_agent_commission':
                    if (data.detailed_type == 0) Report.onDistribution(data, field);
                    break;
                case 'receipts_amd':
                case 'price_kg':
                case 'price_item':
                case 'in_price_item':
                case 'in_price_kg':
                case 'summ1':
                case 'summ2':
                case 'salary':
                case 'profit':
                case 'close_net_profit':
                case 'net_profit':
                    Report.onEditFormul(data, field);
                    break;
                case 'price_base':
                case 'price_base_manager':
                    Report.onEditPrice(data, field);
                    break;
                case 'description2':
                    Report.onEditDescription(data);
                    break;
                case 'description3':
                    Report.onEditDescription3(data);
                    break;
            }
        };

        this.grid.onDblClick = function(rowIndex, field, node)
        {
            var data = this.data[rowIndex];
            switch(field){
                case 'car_distribution':
                case 'other_distribution':
                case 'distribution_kickback':
                    if (data.detailed_type == 0 && data.count_products > 1 && data['total_' + field] > 0) {
                        if (!Report._getPermissionRow(data, field)) {
                            return;
                        }
                        Report.onDistribution(data, field);
                    }
                    break;
                case 'receipts_amd':
                case 'price_kg':
                case 'price_item':
                case 'in_price_item':
                case 'in_price_kg':
                case 'summ1':
                case 'summ2':
                case 'salary':
                case 'profit':
                case 'close_net_profit':
                case 'net_profit':
                    if (!Report._getPermissionRow(data, field)) {
                        return;
                    }
                    Report.onEditFormul(data, field);
                    break;
                case 'price_base':
                case 'price_base_manager':
                    if (!Report._getPermissionRow(data, field)) {
                        return;
                    }
                    Report.onEditPrice(data, field);
                    break;
                case 'description2':
                    if (!Report._getPermissionRow(data, 'description2')) {
                        return;
                    }
                    Report.onEditDescription(data);
                    break;
                case 'description3':
                    if (!Report._getPermissionRow(data, 'description3')) {
                        return;
                    }
                    Report.onEditDescription3(data);
                    break;
            }
        };

        this.grid.onAfterUpdate = function()
        {
            this._updateBottom(this.node().lastChild.childNodes[2], this.ajaxAllData.summpage);
            this._updateBottom(this.node().lastChild.childNodes[3], this.ajaxAllData.summ);

            this.node().lastChild.childNodes[1].scrollLeft = this.lastScroll;
            this.node().lastChild.childNodes[1].onscroll();
            this.lastSelectionData = [];
            var tmp = Report.tmpSelectedReports;
            for (var i = 0; i< tmp.length; i++) {
                var ctrl = tmp[i][this.fieldControll];
                for (var j=0; j<this.data.length; j++) {
                    if (this.data[j][this.fieldControll] ==  ctrl) {
                        this.lastSelectionData.push(this.data[j]);
                        break;
                    }
                }
            }

            if (this.ajaxAllData.recalc == 1) {
                $('#recalc_report').removeAttr('disabled');
            }
            else {
                $('#recalc_report').attr('disabled', 'disabled');
            }

        };

        this.grid.onAfterCreate = function()
        {
            this.node().lastChild.childNodes[1].onscroll();

            var pagesum = this.crnode('div');
            pagesum.className = 'filter-grid-page';
            $(pagesum).css({overflow:'hidden', borderBottom:'1px solid black', borderTop:'1px solid black'});
            this.node().firstChild.insertBefore(pagesum, this.node().firstChild.lastChild);

            pagesum = this.crnode('div');
            pagesum.className = 'filter-grid-page';
            $(pagesum).css({overflow:'hidden', borderBottom:'1px solid black'});
            this.node().firstChild.insertBefore(pagesum, this.node().firstChild.lastChild);
        };

        this._custumizeGrid(this.grid);

        this.filter.create();

        reportFields.create();

        $('#total-sum-switcher-button').click(function()
        {
            if (Report.grid.lastSelectionData.length == 0) {
                alert('Выделите строки отчета');
                return;
            }

            var switcherValue = 0;

            var form = new AjaxForm($('script[data-template="total-sum-switch-window"]').html(), {
                width: 400,
                style: 'strict',
                destroyOnHide: true,
                preventDefaultActions: true,
                getDataCallback: function()
                {
                    var ids = Report.grid.lastSelectionData.map(function(row)
                    {
                        return row.id;
                    });

                    return {
                        rows: serialize(ids),
                        value: $('input[name="total-sum-switcher"]:checked').val()
                    }
                },
                postBuildCallback: function(form)
                {
                    $('input[name="total-sum-switcher"][value="' + switcherValue + '"]').prop("checked", true);

                    form.done(function(data, form) {
                        console.log(111);
                        form.hide();
                    });


                    // Событие при возвращении сервером { success:false }
                    form.error(function(data, form) {
                        console.log(222);
                        form.hide();
                    });

                    // Событие при неудачном выполнении ajax-запроса
                    form.fail(function(form) {
                        console.log(333);
                        form.hide();
                    });
                }
            });
            new Promise(function(resolve, reject)
            {
                $.ajax({
                    url: '/salary/report/get-total-sum-switcher',
                    data: {
                        rowId: Report.grid.lastSelectionData[0].id
                    },
                    success: function(data)
                    {
                        switcherValue = parseInt(JSON.parse(data));
                        console.log(switcherValue);
                        resolve(switcherValue);
                    },
                    error: function(data)
                    {
                        reject(data);
                    }
                });
            }).then(function(data)
            {
                form.show();
            }).catch(function(data)
            {
                console.log(data);
            });
        });

        $('#select_all_result').click(function(){
            Report.grid.lastSelectionData = [];
            for (var i=0; i < Report.grid.data.length; i++) {
                Report.grid.lastSelectionData.push(Report.grid.data[i]);
            }
            Report.grid._updateSelectedRow();
        });

        $('#unselect_all_result').click(function(){
            Report.grid.lastSelectionData = [];
            Report.grid._updateSelectedRow();
        });

        if (this.perm.recalc) {
            $('#recalc_report').click(function(){
                Report.recalcReport();
            });
        }
        else {
            $('#recalc_report').hide();
        }

        $('#filterReset').click(function(){
            Report.filter.rebuildFilter(true);
        });

        $('#excel').click(function(){
            Report.excel();
        });

        //Вкл./выкл. продажи Брагина(ticket-6593)
        $('#manager-sales-checkbox').click(function()
        {
            if ($(this).is(':checked')) {
                //777 - userID Брагина
                _self.filter.addPostData.managerSalesId = 777;
                _self.grid.addPostData.managerSalesId = 777;

                _self.filter.rebuildFilter(true);
            } else {
                _self.filter.addPostData.managerSalesId = 0;
                _self.grid.addPostData.managerSalesId = 0;

                _self.filter.rebuildFilter(true);
            }
        });

        $('#disable-pagination').change(() => {
            $.ajax({
                type: 'POST',
                url: '/user-settings/ajax/toggle-salary-report-pagination',
                dataType: 'json',
                async: true,
                success: function (response) {
                    console.log('response', response);
                }
            });

            this.grid.perpage = this.gerPerPage();
            this.grid.update();
        });

        //только тендер
        $('#only-tender').change(function()
        {
            if ($(this).is(':checked')) {
                //только тендер
                _self.filter.addPostData.onlyTender = 1;
                _self.grid.addPostData.onlyTender = 1;
            } else {
                _self.filter.addPostData.onlyTender = 0;
                _self.grid.addPostData.onlyTender = 0;
            }

            _self.filter.rebuildFilter(true);
        });
    };


    this.getBasePriceIcon = function (rowData)
    {
        let checkDate = rowData.date_to.substring(0, 7);

        if (checkDate < '2024-05' || this.perm.base_price_disparity < 1) {
            return '';
        }

        // Базовая цена на дату, в приоритете акционная
        let basePriceOnDate = +rowData.price_base_sale_on_date || +rowData.price_base_standard_on_date;
        let resultHTML = ``;

        if (Math.abs(rowData.price_base - basePriceOnDate) > 0) {
            let title = `БЦ ЗП отчета: ${rowData.price_base || 0} | БЦ в складе: ${rowData.price_base_standard_on_date || 0}`;

            if (+rowData.price_base_sale_on_date) {
                title += `| АБЦ в складе: ${rowData.price_base_sale_on_date}`;
            }

            resultHTML = ` <i class="fa-solid fa-circle-exclamation price-base-alert" title="${title}"></i>`
        }

        return resultHTML;
    }


    this.gerPerPage = function () {
        return $('#disable-pagination').attr('checked') ? 1000000 : 15;
    }


    /**
     * получение прав для споля в записи
     */
    this._getPermissionRow = function (row, field) {
        try {
            return this.perm.fields.edit['status_' + row.report_status][field];
        }
        catch(e){
            return 0;
        }
    };

    /**
     * расширение грида
     */
    this._custumizeGrid = function(grid)
    {
        grid._showSumm = true;

        grid.pageingScroll = function(pageObj, scrollValue)
        {
            if (!this._showSumm) {
                return;
            }
            if (this.node().lastChild.childNodes[2]) {
                this.node().lastChild.childNodes[2].scrollLeft = scrollValue;
            }
            if (this.node().lastChild.childNodes[3]) {
                this.node().lastChild.childNodes[3].scrollLeft = scrollValue;
            }
        };

        grid._updateBottom = function(target, data)
        {
            target.innerHTML = '';
            var realWidth = {};
            for (var field in this.head) {
                realWidth[field] = (this.head[field].width||this.defaultColumnWidth) - 6 + 'px';
            }
            var table = this.crnode('table');
            table.cellPadding = 0;
            table.cellSpacing = 1;
            var row = table.insertRow(table.rows.length);
            for (var field in this.head) {
                var cell = row.insertCell(row.cells.length);
                cell.dataColIndex = field;
                var div = this.crnode();
                div.dataColIndex = field;
                cell.appendChild(div);
                div.style.width = realWidth[field];
                div.style.padding = '4px 3px';
                div.style.overflow = 'hidden';
                div.style.cursor = 'default';
                if (typeof this.head[field].aliaceSumm != 'function'){
                    div.appendChild(this.crtxtnode(data[field]||' '));
                }
                else {
                    var v = this.head[field].aliaceSumm(data[field], div, data, field);
                    div.innerHTML = v;
                }
                if ('--|left|right|center|'.indexOf('|' + this.head[field].align + '|')) {
                    div.style.textAlign = this.head[field].align;
                }
            }
            target.appendChild(table);
            target.scrollLeft = this.lastScroll;
        };
    };

    /**
     * подсветка фильтра
     */
    this.lightFilter = function()
    {
        var t = this.filter.node().firstChild, i = 0, j = 0;
        while (t.rows[i]) {
            j = 0;
            while (t.rows[i].cells[j]) {
                if (this.map[t.rows[i].cells[j].lang]) {
                    t.rows[i].cells[j].firstChild.childNodes[1].style.color = '#FF0000';
                    t.rows[i].cells[j].firstChild.childNodes[1].title = 'внимание данный фильтр используется при редактировании отчета.'
                }
                ++j;
            }
            ++i;
        }
    };

    /**
     * окно предсоздания выбранных отчетов
     * #report.create.report
     */
    this.preCreated = function()
    {
        this.block = new Overley();
        this.block.title = 'Создание выбранных отчетов';
        this.block.needCreated = this.needCreated;
        this.block.closeabled = false;
        this.block.onAfterCreate = function(){
            var html = '<iframe id="ctree" frameborder="no" style="background:black;" scrolling="auto" width="1000" height="500" name="create_reports_result" src="/salary/report/create?index=' + this.needCreated +'"></iframe>';
            html += '<div style="text-align:right; padding:3px;"><input id="'+this.blockId+'_btok" type="button" value="закрыть" onclick="Report.block.close()" disabled></div>';
            this.getArea().innerHTML = html;
            this.getArea().style.background = 'transparent';
            this.toCenter();
        };
        this.block.unblockedBlock = function(){
            this.node(this.blockId+'_btok').disabled = false;
            this.closeabled = true;
        };
        this.block.create();
        this.block.onBeforeClose = function(){
            return this.closeabled;
        };
        this.block.onAfterClose = function(){
            delete(Report.needCreated);
            delete(Report.block);
            Report.initFilter();
        };
    };

    /**
     * создание окна
     */
    this._createWindow = function(config)
    {
        this.block = new Overley();
        this.block.title = config.title;
        this.block.config = config;
        this.block.apply = function(){};
        this.block.onAfterCreate = function()
        {
            var html = '<div id="'+this.blockId+'_area-result" style="min-width:600px; text-align:center;"><img src="' + Report.loaderUrl + '" align="absmiddle" style="padding:50px;"></div>';
            html += '<div style="text-align:right; padding:3px;">';
            var buttons = this.config.battons.split('|'), i=0;
            while (buttons[i]) {
                var bt = buttons[i].split(':');
                if (typeof this[bt[1]] != 'function') this[bt[1]] = function(){};
                html += '<input id="'+this.blockId+'_' + bt[0] + '" type="button" value="' + bt[2] + '" onclick="Report.block.' + bt[1] + '()" >';
                ++i;
            }
            html += '</div>';
            this.getArea().innerHTML = html;
            this.getArea().style.background = 'transparent';
            this.toCenter();
            if (!this.config.url) {
                this.onAfterLoad();
                this.toCenter();
                return;
            }
            this.unblockedBlockWnd(false);
            $.ajax({
                url      : this.config.url,
                cache    : false,
                type     : 'POST',
                dataType : 'html',
                data     : this.config.postData||{},
                success  : function(html)
                {
                    $(Report.block.node(Report.block.blockId + '_area-result')).html(html) ;
                    Report.block.unblockedBlockWnd(true);
                    Report.block.toCenter();
                    Report.block.onAfterLoad(false);
                },
                error    : function(o)
                {
                    $(Report.block.node(Report.block.blockId + '_area-result')).html(o.responseText) ;
                    Report.block.unblockedBlockWnd(true);
                    Report.block.toCenter();
                    Report.block.onAfterLoad(true);
                }
            });
        };
        this.block.unblockedBlockWnd = function(blk)
        {
            var buttons = this.config.battons.split('|'), i=0;
            while (buttons[i]) {
                var bt = buttons[i].split(':');
                if (this.node(this.blockId+'_' + bt[0])) {
                    this.node(this.blockId+'_' + bt[0]).disabled = !blk;
                }
                ++i;
            }
            this.closeabled = blk;
        };
        this.block.onBeforeClose = function()
        {
            return this.closeabled;
        };
        this.block.onAfterClose = function()
        {
            delete(Report.block);
        };
        this.block.onAfterLoad = function(){};
    }

    /**
     * установка распределения
     */
    this.onDistribution = function(data, type)
    {
        type = type.replace(/([_]?distribution[_]?)/, '');
        let typeTitle = '';

        switch (type) {
            case 'car':
                typeTitle = 'транспортных расходов';
                break;
            case 'other':
                typeTitle = 'расходников';
                break;
            case 'kickback':
                typeTitle = 'откатов';
                break;
            case 'agent_commission':
                typeTitle = 'агентской комиссии';
                break;
            default:
                alert('Неизвестный тип расходов для распределения');
                return;
        }

        this._createWindow({
            title    : 'Распределение ' + typeTitle + ' по товарам для заявки №' + data.claim_id,
            url      : linkPrefix + '/salary/report/distribution',
            url2     : linkPrefix + '/salary/report/distributionapply',
            battons  : 'ok:apply:Применить|close:close:Отмена',
            postData : {type:type, claim:data.claim_id, report:data.id_salary_report}
        });
        this.block.onAfterLoad = function()
        {
            if (this.node('distribution_error')) {
                this.node(this.blockId+'_ok').parentNode.removeChild(this.node(this.blockId+'_ok'));
            }
            else {
                this.checkDistribution();
            }
        };
        this.block.ctrlInput = function(obj)
        {
            var val = (parseFloat(obj.value) || 0);
            if (!/^\d+(\.(\d+)?)?$/.test(obj.value)) {
                obj.value = obj.value.replace(/\,/g, '.').replace(/[^\-\d\.]/g, '');
                val = (parseFloat(obj.value) || 0);
                obj.value = (obj.value ? val : '') + (/\.$/.test(obj.value) ? '.' : '');
            }

            var pnumber = $(obj).attr('lang');
            var checkSumm = Math.round(parseFloat($('#distribution_result_summ').attr('summ')) * 100) / 100;
            if ($(obj).attr('data-type') == 'summ'){
                val = val*100/checkSumm;
                val = Math.round(val * 1000000) / 1000000;
                $('#distribution input[data-type="percent"][lang="' + pnumber + '"]').val(val||0);
            }
            else {
                val = val * checkSumm;
                val = Math.round(val) / 100;
                $('#distribution input[data-type="summ"][lang="' + pnumber + '"]').val(val||0);
            }
            this.checkDistribution();
        };
        this.block.clearInput = function(id)
        {
            $('#distribution input[data-type="percent"][id="' + id + '"]').val('');
            $('#distribution input[data-type="summ"][id="' + id + '"]').val('');
            this.checkDistribution();
        };
        this.block.checkDistribution = function()
        {
            var total = '', summ = 0, color = 'green', total2 = 0;
            $('#distribution input[data-type="percent"]').each(function(i, inp){
                total += inp.value;
                total2 += parseFloat(inp.value)||0;
            });
            $('#distribution input[data-type="summ"]').each(function(i, inp){
                inp.value = total ? inp.value : $(inp).attr('default-value');
            });
            summ = 0;
            $('#distribution input[data-type="summ"]').each(function(i, inp){
                summ += parseFloat(inp.value)||0;
            });

            summ = Math.round(summ * 100) / 100;
            var checkSumm = Math.round(parseFloat($('#distribution_result_summ').attr('summ')) * 100) / 100;
            color = (summ == checkSumm ? 'green' : 'red')

            $('#distribution_result_percent').html((total ? total2 + '%' : 'отсутствует')).css({color:color});
            $('#' + this.blockId+'_ok').prop({disabled : (summ != checkSumm)});
            $('#distribution_result_summ').html(summ + ' / ' + checkSumm).css({color:color});
        };
        this.block.apply = function()
        {
            var data = {
                report   : this.config.postData.report,
                claim    : this.config.postData.claim,
                type     : this.config.postData.type,
                useReports:serialize(Report.defaultFilterStartValues.id_salary_report)
            };
            var total = 0;
            $('#distribution input[data-type="percent"]').each(function(i, inp){
                total += parseFloat(inp.value)||0;
            });
            $('#distribution input[data-type="percent"]').each(function(i, inp){
                data['products_' + inp.lang] = total ? parseFloat(inp.value)||0 : '-1';
                // inp.value = total ? parseFloat(inp.value)||0 : '';
            });
          //  for (var i=0; i<inps.length; i++) {
          //      data['products_' + inps[i].lang] = total ? parseFloat(inps[i].value)||0 : '-1';
          //  }
            this.unblockedBlockWnd(false);
            $('#' + this.blockId +'_area-result').html('<div id="area-result" style="min-width:400px; text-align:center;"><img src="' + Report.loaderUrl + '" align="absmiddle" style="padding:50px;"></div>');
            $.ajax({
                url      : this.config.url2,
                cache    : false,
                type     : 'POST',
                dataType : 'html',
                data     : data||{},
                success  : function(html)
                {
                    $(Report.block.node(Report.block.blockId + '_area-result')).html(html) ;
                    Report.block.unblockedBlockWnd(true);
                    Report.node(Report.block.blockId+'_ok').parentNode.removeChild(Report.node(Report.block.blockId+'_ok'));
                    Report.node(Report.block.blockId+'_close').value = "Закрыть";
                    Report.block.toCenter();
                    Report.block.afterUpdate = true;
                },
                error    : function(o)
                {
                    $(Report.block.node(Report.block.blockId + '_area-result')).html(o.responseText) ;
                    Report.block.unblockedBlockWnd(true);
                    Report.node(Report.block.blockId+'_ok').parentNode.removeChild(Report.node(Report.block.blockId+'_ok'));
                    Report.node(Report.block.blockId+'_close').value = "Закрыть";
                    Report.block.toCenter();
                    Report.block.afterUpdate = true;
                }
            });
        };
        this.block.obBeforeClose = function()
        {
            this.afterClose = (this.node('distribution_apply_set') !== null);
            return this.closeabled;
        };
        this.block.onAfterClose = function()
        {
            if (this.afterUpdate) {
                setTimeout(function(){Report.grid.update(Report.filter.getValue());}, 0);
            }
            delete(Report.block);
        };
        this.block.create();
    };

    /**
     * установка формул
     */
    this.onEditFormul = function(data, type)
    {
        var title = 'Редактирование формулы для расчета поля "' + this.grid.head[type].caption + '"';
        this._createWindow({
            title    : title,
            url      : linkPrefix + '/salary/report/getformuls',
            url2     : linkPrefix + '/salary/report/setformuls',
            battons  : 'reset:reset:Сброс|ok:apply:Применить|close:close:Отмена',
            postData : {type:type, rowId:data.id, report:data.id_salary_report}
        });
        this.block.onAfterLoad = function(error)
        {
            if (error) {
                return;
            }
            this.startData = {
                formula_type : this.config.postData.type,
                formula_mane : 0,
                id           : 0,
                applyAs      : 'only_row',
                clear_spc    : 'no',
                filterData   : {},
                rowId        : this.config.postData.rowId,
                selRows      : '',
                report       : this.config.postData.report
            };
            var spans = this.node('fdata').getElementsByTagName('span'), i=0;

            var filter  = Report.filter.getValueObjectForFormuls();
            this.filterEnabled = false;
            for (var k in filter) {
                if (!Report.map[k] || !filter[k].isSet) {
                    delete(filter[k]);
                }
                else {
                    this.filterEnabled = true;
                    this.startData.filterData[k] = filter[k];
                }
            }

            var selrows = [], i=0;
            while (Report.grid.lastSelectionData[i]) {
                selrows.push(Report.grid.lastSelectionData[i].id);
                ++i;
            }
            this.startData.selRows = selrows;

            while (spans[i]) {
                if (!spans[i].lang) {
                    ++i;
                    continue;
                }
                if (spans[i].lang == 'clear_spc') {
                    this.startData.clear_spc = (spans[i].getAttribute('use') == 'yes' && spans[i].getAttribute('disabled') == 'no' ? 'yes' : 'no');
                    ++i;
                    continue;
                }

                if (spans[i].lang == 'for_checked' && !this.startData.selRows.length) {
                    spans[i].setAttribute('disabled', 'yes');
                }

                if (!this.filterEnabled && spans[i].lang == 'as_filter') {
                    spans[i].setAttribute('disabled', 'yes');
                }

                if (spans[i].getAttribute('use') == 'yes') {
                    this.startData.applyAs = spans[i].lang;
                }
                ++i;
            }
            var s = this.node('fdata').getElementsByTagName('select'), i=0;
            while (s[i]) {
                if (!s[i].disabled) {
                    this.startData.formula_mane = (s[i].lang == 'base' ? 1 : 0 );
                    this.startData.id = s[i].value;
                }
                ++i;
            }

            this.controlApply();
        };
        this.block.reset = function()
        {
            this.onAfterCreate();
        };
        this.block.setActiveFormula = function(obj)
        {
            var sels = this.node('fdata').getElementsByTagName('select'), i=0;
            while (sels[i]) {
                sels[i].disabled = true;
                sels[i].parentNode.setAttribute('use', 'no');
                ++i;
            }
            obj.getElementsByTagName('select')[0].disabled = false;
            obj.setAttribute('use', 'yes');
            var spans = obj.parentNode.getElementsByTagName('span');
            i = 0;
            while (spans[i]) {
                if (spans[i].lang == 'clear_spc') spans[i].setAttribute('disabled', (obj.lang == 'base' ? 'no' : 'yes'));
                ++i;
            }
            this.controlApply();
        };
        this.block.setConfigSave = function(obj, e)
        {
            if (e.target.nodeName.toLowerCase() != 'span') {
                return;
            }
            if (e.target.getAttribute('disabled') == 'yes') {
                return;
            }
            if (e.target.lang == 'clear_spc') {
                e.target.setAttribute('use', (e.target.getAttribute('use') == 'no' ? 'yes' : 'no'));
                this.controlApply();
                return;
            }
            var spans = obj.getElementsByTagName('span'), i=0;
            while (spans[i]) {
                if (spans[i].lang == 'clear_spc') {
                    ++i;
                    continue;
                }
                spans[i].setAttribute('use', (spans[i] == e.target ? 'yes' : 'no'));
                ++i;
            }
            this.controlApply();
        };
        this.block.controlApply = function()
        {
            this.currData = {
                formula_type : this.startData.formula_type,
                formula_mane : 0,
                id           : 0,
                applyAs      : 'only_row',
                clear_spc    : 'no',
                rowId        : this.startData.rowId,
                selRows      : this.startData.selRows,
                filterData   : this.startData.filterData,
                report       : this.config.postData.report
            };
            var spans = this.node('fdata').getElementsByTagName('span'), i=0;
            while (spans[i]) {
                if (!spans[i].lang) {
                    ++i;
                    continue;
                }
                if (spans[i].lang == 'clear_spc') {
                    this.currData.clear_spc = (spans[i].getAttribute('use') == 'yes' && spans[i].getAttribute('disabled') == 'no' ? 'yes' : 'no');
                    ++i;
                    continue;
                }
                if (spans[i].getAttribute('use') == 'yes') {
                    this.currData.applyAs = spans[i].lang;
                }
                ++i;
            }
            var s = this.node('fdata').getElementsByTagName('select'), i=0, disabled = true;
            while (s[i]) {
                if (!s[i].disabled) {
                    this.currData.formula_mane = (s[i].lang == 'base' ? 1 : 0 );
                    this.currData.id = s[i].value;
                }
                ++i;
            }
            for (var i in this.currData) {
                if (this.currData[i] != this.startData[i] && parseInt(this.currData.id)) {
                    disabled = false;
                    break;
                }
            }
            if (!parseInt(this.currData.id) && this.currData.clear_spc == 'yes') {
                disabled = false;
            }
            this.node(this.blockId + '_' + 'ok').disabled = disabled;
        };
        this.block.apply = function()
        {
            this.unblockedBlockWnd(false);
            $.ajax({
                url      : this.config.url2,
                cache    : false,
                type     : 'POST',
                dataType : 'html',
                data     : {
                    data:serialize(this.currData),
                    useReports:serialize(Report.defaultFilterStartValues.id_salary_report)
                },
                success  : function(html)
                {
                    $(Report.node(Report.block.blockId + '_area-result')).html(html).css({overflow:'auto'});
                    Report.block.unblockedBlockWnd(true);
                    Report.removeNode(Report.block.blockId + '_ok').removeNode(Report.block.blockId + '_reset');
                    Report.node(Report.block.blockId + '_close').value = 'Закрыть';
                    Report.block.toCenter();
                    Report.block.updateGrid = true;
                },
                error    : function(o)
                {
                    $(Report.block.node(Report.block.blockId + '_area-result')).html(o.responseText).css({overflow:'auto'}) ;
                    Report.block.unblockedBlockWnd(true);
                    Report.removeNode(Report.block.blockId + '_ok').removeNode(Report.block.blockId + '_reset');
                    Report.node(Report.block.blockId + '_close').value = 'Закрыть';
                    Report.block.toCenter();
                }
            });
        };
        this.block.onAfterClose = function()
        {
            if (this.updateGrid) {
                Report.grid.update();
            }
            delete(Report.block);
        };
        this.block.create();
    };

    /**
     * редактирование цен
     */
    this.onEditPrice = function(data, type)
    {
        var title = 'Редактирование поля "' + this.grid.head[type].caption + '"';
        this._createWindow({
            title    : title,
            url      : linkPrefix + '/salary/report/getprice',
            url2     : linkPrefix + '/salary/report/setprice',
            battons  : 'reset:reset:Сброс|ok:apply:Применить|close:close:Отмена',
            postData : {type:type, rowId:data.id, report:data.id_salary_report}
        });
        this.block.reset = function()
        {
            this.onAfterCreate();
        };
        this.block.onAfterLoad = function(error)
        {
            if (error) {
                return;
            }
            this.saveData = {
                price_type   : this.config.postData.type,
                value        : parseFloat(this.node('edit_price_wnd').value)||0,
                applyAs      : 'only_row',
                filterData   : Report.filter.getValue(),
                rowId        : this.config.postData.rowId,
                report       : this.config.postData.report
            };
            this.controlApply();
            var input = $('#edit_price_wnd')[0];
            var textLength = input.value.length;
            input.selectionStart = 0;
            input.selectionEnd = textLength;
            input.focus();
        };
        this.block.ctrlInputPrice = function(obj)
        {
            var val = obj.value.replace(/^\s+|\s+$/g, '').replace(/\,/g, '.');
            if (!/^\d+(\.?(\d+)?)?$/.test(val)) {
                val = Math.abs(parseFloat(val)||0)||'';
            }
            obj.value = val;
            this.saveData.value = parseFloat(obj.value)||0;
            this.controlApply();
        };
        this.block.setConfigSave = function(obj, e)
        {
            if (!e.target.id) {
                return;
            }
            e.target.setAttribute('use', 'yes');
            this.node(e.target.id == 'as_filter' ? 'only_row' : 'as_filter').setAttribute('use', 'no');
            this.saveData.applyAs = e.target.id;
            this.controlApply();
        };
        this.block.controlApply = function()
        {
            var disabled = (this.saveData.applyAs == 'only_row');
            if (disabled) {
                disabled = ((parseFloat(this.node('edit_price_wnd').lang)||0) == this.saveData.value);
            }
            this.node(this.blockId + '_' + 'ok').disabled = disabled;
        };
        this.block.apply = function()
        {
            if (this.node(this.blockId + '_' + 'ok').disabled) {
                return;
            }
            this.unblockedBlockWnd(false);
            $.ajax({
                url      : this.config.url2,
                cache    : false,
                type     : 'POST',
                dataType : 'html',
                data     : {
                    data:serialize(this.saveData),
                    useReports:serialize(Report.defaultFilterStartValues.id_salary_report)
                },
                success  : function(html)
                {
                    $(Report.node(Report.block.blockId + '_area-result')).html(html).css({overflow:'auto'});
                    Report.block.unblockedBlockWnd(true);
                    Report.removeNode(Report.block.blockId + '_ok').removeNode(Report.block.blockId + '_reset');
                    Report.node(Report.block.blockId + '_close').value = 'Закрыть';
                    Report.block.toCenter();
                    Report.block.updateGrid = true;
                },
                error    : function(o)
                {
                    $(Report.block.node(Report.block.blockId + '_area-result')).html(o.responseText).css({overflow:'auto'}) ;
                    Report.block.unblockedBlockWnd(true);
                    Report.removeNode(Report.block.blockId + '_ok').removeNode(Report.block.blockId + '_reset');
                    Report.node(Report.block.blockId + '_close').value = 'Закрыть';
                    Report.block.toCenter();
                }
            });
        };
        this.block.onAfterClose = function()
        {
            if (this.updateGrid) {
                Report.grid.update();
            }
            delete(Report.block);
        };
        this.block.create();
    };

    /**
     * редактирование комментариев юзверя
     */
    this.onEditDescription = function(data)
    {
        var title = 'Редактирование поля "Примечание менеджера"';
        this._createWindow({
            title    : title,
            url      : linkPrefix + '/salary/report/getdescription',
            url2     : linkPrefix + '/salary/report/setdescription',
            url3     : linkPrefix + '/salary/report/dropdescription',
            battons  : 'reset:reset:Сброс|ok:apply:Применить|drop:drop:Удалить|close:close:Отмена',
            postData : {rowId:data.id, report:data.id_salary_report, field:'description2'}
        });
        this.block.reset = function()
        {
            this.onAfterCreate();
        };
        this.block.onAfterLoad = function(error)
        {
            if (error || !this.config.url) {
                return;
            }
            this.saveData = {
                value        : '',
                applyAs      : 'only_row',
                filterData   : Report.filter.getValue(),
                rowIds       : [],
                rowId        : this.config.postData.rowId,
                report       : this.config.postData.report
            };

            var i = 0;
            while (Report.grid.lastSelectionData[i]) {
                this.saveData.rowIds.push(Report.grid.lastSelectionData[i].id);
                ++i;
            }

            for (var k in this.saveData.filterData) {
                if (this.saveData.filterData[k].sql) {
                    Report.node('as_filter').setAttribute('disabled', 'no');
                    break;
                }
            }

            Report.node('fdata').querySelector('textarea').lastValue = Report.node('fdata').querySelector('textarea').value.replace(/^\s+|\s+$/g, '');

            Report.node('for_checked').setAttribute('disabled', (this.saveData.rowIds.length < 2 ? 'yes' : 'no'));

            this.controlApply();
        };
        this.block.setConfigSave = function(obj, e)
        {
            if (!e.target.id) {
                return;
            }
            if (e.target.getAttribute('disabled') == 'yes') {
                return;
            }
            Report.node('only_row').setAttribute('use', 'no');
            Report.node('for_checked').setAttribute('use', 'no');
            Report.node('as_filter').setAttribute('use', 'no');
            e.target.setAttribute('use', 'yes');
            this.saveData.applyAs = e.target.id;
            this.controlApply();
        };
        this.block.controlApply = function(obj)
        {
            if (obj) {
                this.saveData.value = obj.value
            }
            this.node(this.blockId + '_ok').disabled = (this.saveData.value == '');
            this.node(this.blockId + '_drop').disabled = (Report.node('fdata').querySelector('textarea').lastValue == '');
        };
        this.block.apply = function()
        {
            var tmp = this.config.url;
            this.config.url = false;
            this.onAfterCreate();
            this.config.url = tmp;
            this.unblockedBlockWnd(false);
            Report.removeNode(Report.block.blockId + '_ok').removeNode(Report.block.blockId + '_reset').removeNode(Report.block.blockId + '_drop');
            Report.node(Report.block.blockId + '_close').value = 'Закрыть';
            $.ajax({
                url      : this.config.url2,
                cache    : false,
                type     : 'POST',
                dataType : 'html',
                data     : {
                    data:serialize(this.saveData),
                    useReports:serialize(Report.defaultFilterStartValues.id_salary_report),
                    field:'description2'
                },
                success  : function(html)
                {
                    $(Report.node(Report.block.blockId + '_area-result')).html(html).css({overflow:'auto'});
                    Report.block.unblockedBlockWnd(true);

                    Report.block.toCenter();
                    Report.block.updateGrid = true;
                },
                error    : function(o)
                {
                    $(Report.block.node(Report.block.blockId + '_area-result')).html(o.responseText).css({overflow:'auto'}) ;
                    Report.block.unblockedBlockWnd(true);
                    Report.block.toCenter();
                }
            });
        };
        this.block.drop = function()
        {
            if (!confirm('Вы уверены в удалении ?')) {
                return;
            }

            var tmp = this.config.url;
            this.config.url = false;
            this.onAfterCreate();
            this.config.url = tmp;
            this.unblockedBlockWnd(false);
            Report.removeNode(Report.block.blockId + '_ok').removeNode(Report.block.blockId + '_reset').removeNode(Report.block.blockId + '_drop');
            Report.node(Report.block.blockId + '_close').value = 'Закрыть';
            $.ajax({
                url      : this.config.url3,
                cache    : false,
                type     : 'POST',
                dataType : 'html',
                data     : {
                    data:serialize(this.saveData),
                    useReports:serialize(Report.defaultFilterStartValues.id_salary_report),
                    field:'description2'
                },
                success  : function(html)
                {
                    $(Report.node(Report.block.blockId + '_area-result')).html(html).css({overflow:'auto'});
                    Report.block.unblockedBlockWnd(true);

                    Report.block.toCenter();
                    Report.block.updateGrid = true;
                },
                error    : function(o)
                {
                    $(Report.block.node(Report.block.blockId + '_area-result')).html(o.responseText).css({overflow:'auto'}) ;
                    Report.block.unblockedBlockWnd(true);
                    Report.block.toCenter();
                }
            });
        };
        this.block.onAfterClose = function()
        {
            if (this.updateGrid) {
                Report.grid.update();
            }
            delete(Report.block);
        };
        this.block.create();
    };

    /**
     * редактирование комментариев ст. манагера
     */
    this.onEditDescription3 = function(data)
    {
        var title = 'Редактирование поля "Примечание ст. менеджера"';
        this._createWindow({
            title    : title,
            url      : linkPrefix + '/salary/report/getdescription',
            url2     : linkPrefix + '/salary/report/setdescription',
            url3     : linkPrefix + '/salary/report/dropdescription',
            battons  : 'reset:reset:Сброс|ok:apply:Применить|drop:drop:Удалить|close:close:Отмена',
            postData : {rowId:data.id, report:data.id_salary_report, field:'description3'}
        });
        this.block.reset = function()
        {
            this.onAfterCreate();
        };
        this.block.onAfterLoad = function(error)
        {
            if (error || !this.config.url) {
                return;
            }
            this.saveData = {
                value        : '',
                applyAs      : 'only_row',
                filterData   : Report.filter.getValue(),
                rowIds       : [],
                rowId        : this.config.postData.rowId,
                report       : this.config.postData.report
            };

            var i = 0;
            while (Report.grid.lastSelectionData[i]) {
                this.saveData.rowIds.push(Report.grid.lastSelectionData[i].id);
                ++i;
            }

            for (var k in this.saveData.filterData) {
                if (this.saveData.filterData[k].sql) {
                    Report.node('as_filter').setAttribute('disabled', 'no');
                    break;
                }
            }

            Report.node('fdata').querySelector('textarea').lastValue = Report.node('fdata').querySelector('textarea').value.replace(/^\s+|\s+$/g, '');

            Report.node('for_checked').setAttribute('disabled', (this.saveData.rowIds.length < 2 ? 'yes' : 'no'));

            this.controlApply();
        };
        this.block.setConfigSave = function(obj, e)
        {
            if (!e.target.id) {
                return;
            }
            if (e.target.getAttribute('disabled') == 'yes') {
                return;
            }
            Report.node('only_row').setAttribute('use', 'no');
            Report.node('for_checked').setAttribute('use', 'no');
            Report.node('as_filter').setAttribute('use', 'no');
            e.target.setAttribute('use', 'yes');
            this.saveData.applyAs = e.target.id;
            this.controlApply();
        };
        this.block.controlApply = function(obj)
        {
            if (obj) {
                this.saveData.value = obj.value
            }
            this.node(this.blockId + '_' + 'ok').disabled = (this.saveData.value == '');
            this.node(this.blockId + '_drop').disabled = (Report.node('fdata').querySelector('textarea').lastValue == '');
        };
        this.block.apply = function()
        {
            var tmp = this.config.url;
            this.config.url = false;
            this.onAfterCreate();
            this.config.url = tmp;
            this.unblockedBlockWnd(false);
            Report.removeNode(Report.block.blockId + '_ok').removeNode(Report.block.blockId + '_reset').removeNode(Report.block.blockId + '_drop');
            Report.node(Report.block.blockId + '_close').value = 'Закрыть';
            $.ajax({
                url      : this.config.url2,
                cache    : false,
                type     : 'POST',
                dataType : 'html',
                data     : {
                    data:serialize(this.saveData),
                    useReports:serialize(Report.defaultFilterStartValues.id_salary_report),
                    field:'description3'
                },
                success  : function(html)
                {
                    $(Report.node(Report.block.blockId + '_area-result')).html(html).css({overflow:'auto'});
                    Report.block.unblockedBlockWnd(true);
                    Report.block.toCenter();
                    Report.block.updateGrid = true;
                },
                error    : function(o)
                {
                    $(Report.block.node(Report.block.blockId + '_area-result')).html(o.responseText).css({overflow:'auto'}) ;
                    Report.block.unblockedBlockWnd(true);
                    Report.block.toCenter();
                }
            });
        };

        this.block.drop = function(){
            if (!confirm('Вы уверены в удалении ?')) {
                return;
            }
            var tmp = this.config.url;
            this.config.url = false;
            this.onAfterCreate();
            this.config.url = tmp;
            this.unblockedBlockWnd(false);
            Report.removeNode(Report.block.blockId + '_ok').removeNode(Report.block.blockId + '_reset').removeNode(Report.block.blockId + '_drop');
            Report.node(Report.block.blockId + '_close').value = 'Закрыть';
            $.ajax({
                url      : this.config.url3,
                cache    : false,
                type     : 'POST',
                dataType : 'html',
                data     : {
                    data:serialize(this.saveData),
                    useReports:serialize(Report.defaultFilterStartValues.id_salary_report),
                    field:'description3'
                },
                success  : function(html)
                {
                    $(Report.node(Report.block.blockId + '_area-result')).html(html).css({overflow:'auto'});
                    Report.block.unblockedBlockWnd(true);
                    Report.block.toCenter();
                    Report.block.updateGrid = true;
                },
                error    : function(o)
                {
                    $(Report.block.node(Report.block.blockId + '_area-result')).html(o.responseText).css({overflow:'auto'}) ;
                    Report.block.unblockedBlockWnd(true);
                    Report.block.toCenter();
                }
            });
        };
        this.block.onAfterClose = function()
        {
            if (this.updateGrid) {
                Report.grid.update();
            }
            delete(Report.block);
        };
        this.block.create();
    };

    /**
     * пересчет отчета
     */
    this.recalcReport = function()
    {
        var title = 'Пересчет отчетов';
        this._createWindow({
            title    : title,
            battons  : 'close:close:Закрыть'
        });
        this.block.onAfterLoad = function()
        {
            var data = Report.grid.data;
            var reports = [], test = '||';
            for(var i=0; i<data.length; i++){
                if (test.indexOf('|' + data[i].id_salary_report + '|') == -1) {
                    test += data[i].id_salary_report + '|';
                    reports.push(data[i].id_salary_report);
                }
            }
            this.unblockedBlockWnd(false);
            var html = '<iframe id="ctree" frameborder="no" style="background:black;" scrolling="auto" width="1000" height="500" name="create_reports_result" src="/salary/report/recalc?index=' + reports.join('|') +'"></iframe>';
            this.node(this.blockId+'_area-result').innerHTML = html;
            this.getArea().style.background = 'transparent';
        };
        this.block.unblockedBlock = function()
        {
            this.unblockedBlockWnd(true);
        };
        this.block.onAfterClose = function()
        {
            if (this.updateGrid) {
                Report.filter.rebuildFilter(false);
            }
            delete(Report.block);
        };
        this.block.create();
    };

    /**
     * выгрузка в ексель
     */
    this.excel = function()
    {
        //продажи Брагина(ticket-6593)
        var managerSalesId = 0;

        if ($('#manager-sales-checkbox').is(':checked')) {
            managerSalesId = 777;
        } else {
            managerSalesId = 0;
        }

        //Только тендер
        let onlyTender = 0;
        if ($('#only-tender').is(':checked')) {
            onlyTender = 777;
        } else {
            onlyTender = 0;
        }

        var filter = this.filter.getValue();
        this.node('excel_data').value   = serialize(filter);
        this.node('excel_sort').value   = this.grid.sortType;
        this.node('excel_column').value = this.grid.sortColumn;
        this.node('useReports').value = serialize(this.defaultFilterStartValues.id_salary_report);
        this.node('managerSalesId').value = managerSalesId;
        this.node('only_tender_excel').value = onlyTender;
        this.node('excel_form').submit();
    };

    /**
     * показ окна с ошибкой
     */
    this.showError = function(caption, msg)
    {
        this.eblock = new Overley();
        this.eblock.title = '<img src="/img/system/error.16.png" align="absmiddle">&nbsp;' + caption;
        this.eblock.msg = msg;
        this.eblock.onAfterCreate = function(){
            var html = '<div style="min-width:600px; text-align:center; padding:30px 0px;">' + this.msg + '</div>';
            html += '<div style="text-align:right; padding:3px;">';
            html += '<input type="button" value="Закрыть" onclick="Report.eblock.close()" >';
            html += '</div>';
            this.getArea().innerHTML = html;
            this.getArea().style.background = 'transparent';
            this.toCenter();
        };
        this.eblock.onAfterClose = function(){
            delete(Report.eblock);
        };
        this.eblock.create();
    };

    /**
     * перстройка грида без загрузки данных при изменении видимости полей
     */
    this.rebildGrid = function()
    {
        var _self = this;

        var grid = new Grid({
            conteinerId : 'search',
            urlGetData : linkPrefix + '/salary/report/getfilterresult',
            imgError : '/img/system/error.16.png' ,
            imgLoader : '/img/ld/ld3.gif',
            sortColumn : 'date2',
            displayPaging:1,
            page : this.grid.curpage,
            perpage : 200,
            backlightSelectRow : 'multiSingleClick',
            clearSingleDowbleSelection : true,
            fieldControll:'id'
        });

        grid.head = {
            id :                     { sort:1, width:100, aliace: this.aliaces.simple,                caption:'№п/п', align:'right'},
            id_salary_report:        { sort:1, width:100, aliace: this.aliaces.string,                caption:'№ отчета'},
            detailed_type:           { sort:1, width:100, aliace: this.aliaces.detailed_type,         caption:'Тип записи'},
            operation_id:            { sort:1, width:100, aliace: this.aliaces.claim_type,            caption:'Тип заявки'},
            status:                  { sort:1, width:100, aliace: this.aliaces.background_row,        caption:'Статус'},
            date2:                   { sort:1, width:100, aliace: this.aliaces.string,                caption:'Дата'},
            manager_name:            { sort:1, width:100, aliace: this.aliaces.string,                caption:'Менеджер'},
            orgstructure_name:       { sort:1, width:100, aliace: this.aliaces.string,                caption:'Отдел'},
            claim_id:                { sort:1, width:100, aliace: this.aliaces.claim,                 caption:'Заявка'},
            payment_type:            { sort:1, width:100, aliace: this.aliaces.payment_type,          caption:'Тип оплаты'},
            client_name:             { sort:1, width:100, aliace: this.aliaces.string,                caption:'Организация'},
            supplier_name:           { sort:1, width:100, aliace: this.aliaces.string,                caption:'Поставщик'},
            car_distribution:        { sort:1, width:100, aliace: this.aliaces.distribution_car,      caption:'% распред. транспортных расходы'},
            car_cost:                { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Транспортные расходы распред.', aliaceSumm:this.aliaces.simpleSumm},
            other_distribution:      { sort:1, width:100, aliace: this.aliaces.distribution_other,    caption:'% распред. расходников'},
            other_cost:              { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Расходники на товар распред.', aliaceSumm:this.aliaces.simpleSumm},
            receipts_amd:            { sort:1, width:100, aliace: this.aliaces.receipts_amd,          caption:'Сумма по приходу АМД', aliaceSumm:this.aliaces.simpleSumm},
            return_car_cost:         { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Оплата доставки клиентом(сумма) распред.', aliaceSumm:this.aliaces.simpleSumm},

            product_id:              { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Id товара'},
            product_title:           { sort:1, width:100, aliace: this.aliaces.string,                caption:'Наименование товара'},
            product_prop:            { sort:1, width:100, aliace: this.aliaces.string,                caption:'Тип сырья'},
            product_box_type:        { sort:1, width:100, aliace: this.aliaces.string,                caption:'Упаковка'},
            product_volume:          { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Объем'},
            product_color:           { sort:1, width:100, aliace: this.aliaces.string,                caption:'Цвет'},
            product_width:           { sort:1, width:100, aliace: this.aliaces.product_width,         caption:'Ширина мм'},
            product_height:          { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Длина мм'},
            product_depth:           { sort:1, width:100, aliace: this.aliaces.simple,                caption:'МКМ'},
            product_in_boxes:        { sort:1, width:100, aliace: this.aliaces.simple,                caption:'В упаковке'},
            product_label_weight:    { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Вес этикетки'},
            product_description:     { sort:1, width:100, aliace: this.aliaces.stringNoTag,           caption:'Примечание по товару'},
            product_type:            { sort:1, width:100, aliace: this.aliaces.product_type,          caption:'Тип товара кг/шт'},
            product_item_weight2:    { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Вес в граммах'},

            price:                   { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Цена за ед. изм-я (заявка)'},
            price_kg:                { sort:1, width:100, aliace: this.aliaces.price_kg,              caption:'Цена за кг'},
            price_item:              { sort:1, width:100, aliace: this.aliaces.price_item,            caption:'Цена за ед. изм-я (формула)'},
            in_price_item:           { sort:1, width:100, aliace: this.aliaces.in_price_item,         caption:'Цена за ед. изм-я (закупка)'},
            amount:                  { sort:1, width:100, aliace: this.aliaces.simpleSummSign,        caption:'Кол-во', aliaceSumm:this.aliaces.simpleSumm},
            weight:                  { sort:1, width:100, aliace: this.aliaces.simpleNDSign,          caption:'Общий вес', aliaceSumm:this.aliaces.simpleSumm},
            summ1:                   { sort:1, width:100, aliace: this.aliaces.summ1,                 caption:'Чистая сумма продажи', aliaceSumm:this.aliaces.simpleSumm},
            summ2:                   { sort:1, width:100, aliace: this.aliaces.summ2,                 caption:'Сумма по заявке', aliaceSumm:this.aliaces.simpleSumm},
            price_base:              { sort:1, width:100, aliace: this.aliaces.price_base,            caption:'Базовая цена'},
            price_base_manager:      { sort:1, width:100, aliace: this.aliaces.price_base_manager,    caption:'Базовая цена менеджера'},
            salary:                  { sort:1, width:100, aliace: this.aliaces.salary,                caption:'З/п', aliaceSumm:this.aliaces.simpleSumm},
            in_price: {
                sort: 1,
                width: 120,
                aliace: function(value, container, rowData)
                {
                    return _self.aliaces.hasOverdraft(value, container, rowData, _self.aliaces.simple);
                },
                caption: 'Цена за ед. изм. закуп. (заявка)'
            },
            in_price_kg: {
                sort: 1,
                width: 120,
                aliace: function(value, container, rowData)
                {
                    return _self.aliaces.hasOverdraft(value, container, rowData, _self.aliaces.in_price_kg);
                },
                caption: 'Цена за кг закуп. (формула)'
            },
            profit: {
                sort: 1,
                width: 100,
                aliace: function(value, container, rowData)
                {
                    return _self.aliaces.hasOverdraft(value, container, rowData, _self.aliaces.profit);
                },
                caption: 'Грязная прибыль',
                aliaceSumm: this.aliaces.profitSumm
            },
            net_profit: {
                sort: 1,
                width: 100,
                aliace: function(value, container, rowData)
                {
                    return _self.aliaces.hasOverdraft(value, container, rowData, _self.aliaces.net_profit);
                },
                caption: 'Прибыль',
                aliaceSumm: this.aliaces.simpleSumm
            },
            profitableness:          { sort:1, width:100, aliace: this.aliaces.profitableness,        caption:'% прибыльности'},
            close_net_profit:        { sort:1, width:100, aliace: this.aliaces.close_net_profit,      caption:'Отчетная прибыль', aliaceSumm:this.aliaces.simpleSumm},
            distribution_kickback:   { sort:1, width:100, aliace: this.aliaces.distribution_kickback, caption:'% распред. отката'},
            kickback:                { sort:1, width:100, aliace: this.aliaces.simple,                caption:'Откат распред.', aliaceSumm:this.aliaces.simpleSumm},
            description1:            { sort:1, width:100, aliace: this.aliaces.description1,          caption:'Примечание'},
            checkbox:                { sort:0, width:50,  aliace: this.aliaces.checkbox,              caption:' '},
            description2:            { sort:1, width:100, aliace: this.aliaces.description2,          caption:'Примечание менеджера'},
            description3:            { sort:1, width:100, aliace: this.aliaces.description3,          caption:'Примечание ст.&nbsp;менеджера'}
        };

        this.applyConfigGrid(grid);

        for (var i in this.perm.fields) {
            if (!parseInt(this.perm.fields[i])) {
                delete(grid.head[i]);
            }
        }

        for (var i in reportFields.hideFields) {
            delete(grid.head[i]);
        }

        var data = this.grid.ajaxAllData;
        grid.lastSelectionData = this.grid.lastSelectionData;
        grid.addPostData = this.grid.addPostData;
        grid.curpage = this.grid.curpage;

        this.grid.close();
        delete(this.grid);

        this.grid = grid;
        this._custumizeGrid(grid);

        this.grid.onBeforeUpdate = function()
        {
            Report.tmpSelectedReports = this.lastSelectionData;
        };

        this.grid.onClick = function(rowIndex, field, node)
        {
            if (node.nodeName.toLowerCase() != 'span') {
                return;
            }
            while (node.nodeName.toLowerCase() != 'td' && node.id != this.conteinerId) {
                node = node.parentNode;
            }
            if (node.nodeName.toLowerCase() == 'td') {
                this._updateSelectedRow(node);
            }
            var data = this.data[rowIndex];
            switch(field){
                case 'car_distribution':
                case 'other_distribution':
                case 'distribution_kickback':
                    if (data.detailed_type == 0) Report.onDistribution(data, field);
                    break;
                case 'receipts_amd':
                case 'price_kg':
                case 'price_item':
                case 'in_price_item':
                case 'in_price_kg':
                case 'summ1':
                case 'summ2':
                case 'salary':
                case 'profit':
                case 'close_net_profit':
                case 'net_profit':
                    Report.onEditFormul(data, field);
                    break;
                case 'price_base':
                case 'price_base_manager':
                    Report.onEditPrice(data, field);
                    break;
                case 'description2':
                    Report.onEditDescription(data);
                    break;
                case 'description3':
                    Report.onEditDescription3(data);
                    break;
            }
        };

        this.grid.onDblClick = function(rowIndex, field, node)
        {
            var data = this.data[rowIndex];
            switch(field){
                case 'car_distribution':
                case 'other_distribution':
                case 'distribution_kickback':
                    if (data.detailed_type == 0 && data.count_products > 1 && data['total_' + field] > 0) {
                        if (!Report._getPermissionRow(data, field)) {
                            return;
                        }
                        Report.onDistribution(data, field);
                    }
                    break;
                case 'receipts_amd':
                case 'price_kg':
                case 'price_item':
                case 'in_price_item':
                case 'in_price_kg':
                case 'summ1':
                case 'summ2':
                case 'salary':
                case 'profit':
                case 'close_net_profit':
                case 'net_profit':
                    if (!Report._getPermissionRow(data, field)) {
                        return;
                    }
                    Report.onEditFormul(data, field);
                    break;
                case 'price_base':
                case 'price_base_manager':
                    if (!Report._getPermissionRow(data, field)) {
                        return;
                    }
                    Report.onEditPrice(data, field);
                    break;
                case 'description2':
                    if (!Report._getPermissionRow(data, 'description2')) {
                        return;
                    }
                    Report.onEditDescription(data);
                    break;
                case 'description3':
                    if (!Report._getPermissionRow(data, 'description3')) {
                        return;
                    }
                    Report.onEditDescription3(data);
                    break;
            }
        };

        this.grid.onAfterUpdate = function()
        {
            this._updateBottom(this.node().lastChild.childNodes[2], this.ajaxAllData.summpage);
            this._updateBottom(this.node().lastChild.childNodes[3], this.ajaxAllData.summ);

            this.node().lastChild.childNodes[1].scrollLeft = this.lastScroll;
            this.node().lastChild.childNodes[1].onscroll();
            this.lastSelectionData = [];
            var tmp = Report.tmpSelectedReports;
            for (var i = 0; i< tmp.length; i++) {
                var ctrl = tmp[i][this.fieldControll];
                for (var j=0; j<this.data.length; j++) {
                    if (this.data[j][this.fieldControll] ==  ctrl) {
                        this.lastSelectionData.push(this.data[j]);
                        break;
                    }
                }
            }

            if (this.ajaxAllData.recalc == 1) {
                $('#recalc_report').removeAttr('disabled');
            }
            else {
                $('#recalc_report').attr('disabled', 'disabled');
            }

        };

        this.grid.onAfterCreate = function()
        {
            this.node().lastChild.childNodes[1].onscroll();

            var pagesum = this.crnode('div');
            pagesum.className = 'filter-grid-page';
            $(pagesum).css({overflow:'hidden', borderBottom:'1px solid black', borderTop:'1px solid black'});
            this.node().firstChild.insertBefore(pagesum, this.node().firstChild.lastChild);

            pagesum = this.crnode('div');
            pagesum.className = 'filter-grid-page';
            $(pagesum).css({overflow:'hidden', borderBottom:'1px solid black'});
            this.node().firstChild.insertBefore(pagesum, this.node().firstChild.lastChild);
        };

        grid.create();

        this.grid._displayResultAjax(data);
    };


    this.applyConfigGrid = function(grid)
    {
        for (var i in this.gridFieldConfig) {
            if (!grid.head[i]) {
                continue;
            }
            if (this.gridFieldConfig[i].disabled == '1') {
                delete(grid.head[i]);
                continue;
            }
            for (var j in this.gridFieldConfig[i]) {
                switch (j) {
                    case 'aliace':
                    case 'aliaceSumm':
                        grid.head[i][j] = this.aliaces[this.gridFieldConfig[i][j]];
                        break;
                    case 'sort':
                    case 'width':
                        grid.head[i][j] = parseInt(this.gridFieldConfig[i][j]);
                        break;
                    default:
                        grid.head[i][j] = this.gridFieldConfig[i][j];
                }
            }
        }
    };

    /**
     * вывод кооф. как считалась зп
     */
    this.showCalcSalary = function(data)
    {
        var title = 'Коэф. по записи';
        this._createWindow({
            title: title,
            url: linkPrefix + '/salary/report/getkoof',
            url1: linkPrefix + '/salary/report/setdefaultkoof',
            url2: linkPrefix + '/salary/report/setusekoof',
            battons: (this._getPermissionRow(data, 'showkoof') != 2 ? '' : 'save:save:Отключить|apply:apply:Особый случай|') + 'close:close:Закрыть',
            postData: {rowId: data.id, reportId: data.id_salary_report}
        });
        this.block.onAfterLoad = function()
        {
            var _self = this, wndarea = this.getArea();
            if ($(wndarea).find('#koof').length){
                Page.init();
                if ($(wndarea).find('input[data-type="disabled-koof-deley"]').length) {
                    $(wndarea).find('#' + this.blockId + '_save').prop({disabled:true});
                    $(wndarea).find('input[data-type="disabled-koof-grace"]').change(function(){
                        $(_self.getArea()).find('input[data-type="disabled-koof-grace"]').prop({checked:this.checked});
                        _self.ctrlBtnSave();
                    });
                    $(wndarea).find('input[data-type="disabled-koof-deley"]').change(function(){
                        $(_self.getArea()).find('input[data-type="disabled-koof-deley"]').prop({checked:this.checked});
                        _self.ctrlBtnSave();
                    });
                }
                else {
                    $(wndarea).find('#' + this.blockId + '_save').remove();
                }
            }
            else {
                $(wndarea).find('#' + this.blockId + '_apply').remove();
                $(wndarea).find('#' + this.blockId + '_save').remove();
            }
            this.toCenter();
        };
        this.block.ctrlBtnSave = function()
        {
            var inp1 = $(this.getArea()).find('input[data-type="disabled-koof-grace"]');
            var inp2 = $(this.getArea()).find('input[data-type="disabled-koof-deley"]');
            var disabled = (
                inp1.val() == (inp1.prop('checked') ? 1 : 0)
                && inp2.val() == (inp2.prop('checked') ? 1 : 0)
            );
            $(this.getArea()).find('#' + this.blockId + '_save').prop({disabled:disabled});
        };
        this.block.info = function()
        {
            this.unblockedBlockWnd(false);
            this.config.postData.unusedGrace = ($(this.getArea()).find('input[data-type="disabled-koof-grace"]').prop('checked') ? 1 : 0);
            this.config.postData.unusedDeley = ($(this.getArea()).find('input[data-type="disabled-koof-deley"]').prop('checked') ? 1 : 0);
            $.ajax({
                url      : this.config.url2,
                cache    : false,
                type     : 'POST',
                dataType : 'html',
                data     : this.config.postData||{},
                success  : function(html)
                {
                    Report.block.unblockedBlockWnd(true);
                    Report.block.onAfterCreate();
                },
                error: function (o) {
                    $(Report.block.node(Report.block.blockId + '_area-result')).html(o.responseText);
                    Report.block.unblockedBlockWnd(true);
                    Report.block.toCenter();
                    Report.block.onAfterLoad(true);
                }
            });
        };
        this.block.apply = function()
        {
            this.unblockedBlockWnd(false);
            $.ajax({
                url      : this.config.url1,
                cache    : false,
                type     : 'POST',
                dataType : 'html',
                data     : this.config.postData||{},
                success  : function(html)
                {
                    Report.block.unblockedBlockWnd(true);
                    Report.block.onAfterCreate();
                },
                error    : function(o)
                {
                    $(Report.block.node(Report.block.blockId + '_area-result')).html(o.responseText) ;
                    Report.block.unblockedBlockWnd(true);
                    Report.block.toCenter();
                    Report.block.onAfterLoad(true);
                }
            });
        };
        this.block.onAfterClose = function()
        {
            delete(Report.block);
        };
        this.block.create();
    };

};


/**
 *
 */
var reportFields = new (function()
{
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
    this.empty = function(obj)
    {
        obj = this.node(obj);
        while(obj.firstChild){
            obj.removeChild(obj.firstChild);
        }
    };

    /**
     * получить узел по ид
     */
    this.node = function(id)
    {
        return typeof id == 'string' ? document.getElementById(id)||null : id;
    };

    /**
     * удалить узел
     */
    this.removeNode = function(id)
    {
        var node = this.node(id).parentNode;
        node.removeChild(this.node(id));
        return this;
    }

    /**
     * создать узел
     */
    this.createNode = function(nodeName)
    {
        return document.createElement((nodeName||'div'));
    };

    /**
     * преобразование hideFieldsStr => hideFields
     */
    this.prepareHideFields = function()
    {
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
    this.create = function()
    {
        this.prepareHideFields();

        var cnt = this.createNode();
        cnt.className = 'fields-report-control';
        cnt.setAttribute('show', 'show');
        document.body.appendChild(cnt);

        // set head
        var h = this.createNode();
        h.innerHTML = '+';
        h.setAttribute('t', 'head');
        h.onclick = function()
        {
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
        this.showFields();


        // set footer
        var h = this.createNode();
        h.setAttribute('t', 'bottom');
        cnt.appendChild(h);
        // bt ok
        var ok = this.createNode('input');
        ok.type = 'button';
        ok.classList.add('amd-btn');
        ok.classList.add('amd-btn_primary');
        ok.value = 'Применить';
        ok.disabled = true;
        ok.style.width = '100px';
        ok.id = 'ctrl_grid_field_save';
        ok.onclick = function () {
            reportFields.save();
        };
        h.appendChild(ok);
        // bt reset
        var ok = this.createNode('input');
        ok.type = 'button';
        ok.classList.add('amd-btn');
        ok.classList.add('amd-btn_primary');
        ok.value = 'Сброс';
        ok.style.width = '100px';
        ok.id = 'ctrl_grid_field_reset';
        ok.onclick = function () {
            reportFields.reset();
        };
        h.appendChild(ok);

        // bt reset
        var ok = this.createNode('input');
        ok.type = 'button';
        ok.classList.add('amd-btn');
        ok.classList.add('amd-btn_primary');
        ok.value = 'Скрыть';
        ok.style.width = '100px';
        ok.id = 'ctrl_grid_field_reset';
        ok.onclick = function () {
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
            row.onclick = function()
            {
                var disp = this.getAttribute('disp');
                disp = (disp == 'yes' ? 'no' : 'yes');
                this.setAttribute('disp', disp);
                if (disp == 'yes') {
                    delete(reportFields.hideFields[this.lang]);
                }
                else {
                    reportFields.hideFields[this.lang] = 1;
                }
                reportFields.checkButtonState();
            };
        }
    };

    /**
     * сброс изменений
     */
    this.reset = function()
    {
        this.hideFields = {};
        this.showFields();
        this.save();
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
            url      : linkPrefix + '/salary/report/saveconfigfields',
            cache    : false,
            type     : 'POST',
            dataType : 'json',
            data     : { fields : data },
            success  : function(data)
            {
                reportFields.hideFieldsStr = data.fields
                reportFields.prepareHideFields();
                reportFields.checkButtonState();
            }
        });
        Report.rebildGrid();
    };

})();
