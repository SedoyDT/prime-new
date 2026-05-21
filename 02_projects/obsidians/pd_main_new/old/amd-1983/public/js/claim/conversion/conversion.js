var conversion = new (
    function()
    {
        this.errorColor         = '#FFC0CB';
        this.goodColor          = '#CDFBCD';
        this.formId             = 'conversion-form';

        this.clientsList        = [];
        this.managerList        = [];

        this.loaderImg          = '/img/ld/ld3.gif';
        this.imgSrcDelSection   = '/img/system/delete.png';

        this.productsNumber     = 0;
        this.showInfoSupplyFlag = false;
        this.saveForm           = false;

        this.conversionType     = 1;

        this.enableType2        = 1;

        this.annotationRequired   = 0; // флаг проверки - обязательно ли поле примечание

        this.node = function(id) {
            if (typeof id == 'string') {
                return document.getElementById(id);
            }
            return id.nodeType == 1 ? id : null;
        };
        this.crnode = function(el){return document.createElement((el||'div'));};
        this.crtnode = function(text){return document.createTextNode(text);};

        this.start = function(){
            $('#date').datepicker({duration: 'fast', showAnim: 'fadeIn'});
            this.createGoodsFilter();
            this.showBlockClaimInfo();
            this.showBlockClaimError();
            if (this.conversionType != this.node('conversion_type').value) {
                this.changeConversionType(this.node('conversion_type').value);
            }
            if (this.type2ErrorMsg) {
                this.showWarning(this.type2ErrorMsg, 'Ошибки при сохранении!');
            }
        };

        /**
         * преобразование строки во float  с точностью 5 знаков после запятой
         * @param string str
         * @return float
         */
        this.toFloat = function(str, ee)
        {
            str = str.toString().replace(/[,]/g, '.');
            str = parseFloat(str);
            if (isNaN(str)) return 0;
            return ee ? str : this.round(str);
        };

        /**
         * round number with precision 5
         * @param float number
         * @return float
         */
        this.round = function(number, percision)
        {
            if (!percision) {
                percision = 5;
            }
            return Math.round(parseFloat(number)*Math.pow(10,percision))/Math.pow(10,percision);
        };

        /**
         * uncompres data
         */
        this.uncompresData = function(str)
        {
            return eval('(' + str + ')');
        }

        /**
         * compres data
         */
        this.compresData = function(data)
        {
            var tmp = [];
            var tpl = '';
            var getType = function(obj){
                return obj.constructor.toString().toLowerCase().match(/(\w+)\(/)[1];
            }
            for(var i in data) {
                switch((typeof data[i]).toLowerCase()){
                    case 'string':
                        tpl = (getType(data) == 'array') ? "'{val}'" : "'i':'{val}'" ;
                        tmp.push( tpl.replace(/i/, i).replace(/\{val\}/, String(data[i]).replace(/\r|\n/g, '').replace(/'/g, '\'')));
                        break;
                    case 'number':
                        tpl = (getType(data) == 'array') ? "{val}" : "'i':{val}" ;
                        tmp.push( tpl.replace(/i/, i).replace(/\{val\}/, String(data[i])));
                        break;
                    case 'boolean':
                        tpl = (getType(data) == 'array') ? "{val}" : "'i':{val}" ;
                        tmp.push( tpl.replace(/i/, i).replace(/\{val\}/, String(data[i])));
                        break;
                    default:
                        if (data[i] === null) {
                            tpl = (getType(data) == 'array') ? "null" : "'i':null" ;
                            tmp.push( tpl.replace(/i/, i));
                        }
                        else if (data[i]){
                            tpl = (getType(data) == 'array') ? "{val}" : "'i':{val}" ;
                            tmp.push( tpl.replace(/i/, i).replace(/\{val\}/, this.compresData(data[i])));
                        }
                        break;
                }
            }
            if (getType(data) == 'array') {
                return '[' + tmp.join(',') + ']';
            }
            else {
                return '{' + tmp.join(',') + '}';
            }
        }

        /**
         * фильтр для манагеров
         * @param nodeObject obj
         * @return void
         */
        this.filterManager = function(obj)
        {
            var node = document.getElementById('manager');
            var options = node.options;
            if (!this.managerList.length){
                for(var i=0; i<options.length; i++) {
                    this.managerList.push({id:options[i].value, text:options[i].text, time:(options[i].getAttribute('lang')||'')});
                }
            }
            options.length = 1;
            var search = obj.value.toLowerCase().replace(/^\s+|\s+$/, '');
            for(var i = 1; i < this.managerList.length; i++){
                if (search.length && this.managerList[i].text.toLowerCase().indexOf(search) == -1) {
                    continue;
                }
                var item = options.length;
                options[item] = new Option(this.managerList[i].text, this.managerList[i].id);
                options[item].setAttribute('lang', this.managerList[i].time);
            }
        };

        /**
         * филтр для переработчиков
         * @param nodeObject obj
         * @return void
         */
        this.filterClient = function(obj)
        {
            var node = document.getElementById('client');
            var options = node.options;
            if (!this.clientsList.length){
                for(var i=0; i<options.length; i++) {
                    this.clientsList.push({id:options[i].value, text:options[i].text, time:options[i].getAttribute('lang')});
                }
            }
            options.length = 1;
            var search = obj.value.toLowerCase();
            for(var i = 1; i < this.clientsList.length; i++){
                if (search.length && this.clientsList[i].text.toLowerCase().indexOf(search) == -1) {
                    continue;
                }
                var item = options.length;
                options[item] = new Option(this.clientsList[i].text, this.clientsList[i].id);
                options[item].setAttribute('lang', this.clientsList[i].time);
            }
            $('#work-time').html('<span style="font-size: 10pt; font-weight: bold;">Время работы : </span>не определено');
        };

        /**
        * удаляет все дочерние елементы из заданного контейнера
        * @param node|string obj
        * @return void
        */
        this.empty = function(obj)
        {
            obj = typeof obj == 'string' ? this.node(obj) : obj;
            while(obj.firstChild){
                obj.removeChild(obj.firstChild);
            }
        };

        /**
        * создание текстового узла
        */
        this.crtxtnode = function(text)
        {
            return document.createTextNode(text);
        };

        /**
         * изменение переработчика
         * @param nodeObject obj
         * @return void
         */
        this.changeClient = function(obj)
        {
            $('#work-time').html('<span style="font-size: 10pt; font-weight: bold;">Время работы : </span>' + obj.options[obj.selectedIndex].getAttribute('lang'));
        };

        /**
         * управление товарами для переработки
         */
        this.addProducts = function()
        {
            this.overley = new overley();
            this.overley.onAfterCreate = function() {
                var res0 = document.createElement('div');
                res0.style.border = '1px solid black';
                res0.style.borderBottom = 'none';
                res0.id = 'clsFilter';

                var res1 = document.createElement('div');
                res1.style.border = '1px solid black';
                res1.style.borderTop = 'none';
                res1.id = 'filter';
                res1.align = 'center';

                var res2 = document.createElement('div');
                res2.style.border = '1px solid black';
                res2.style.marginTop = '5px';
                res2.id = 'subfilter';

                var res3 = document.createElement('div');
                res3.style.border = '1px solid black';
                res3.style.marginTop = '5px';
                res3.id = 'grid';

                var d1 = this.getCnt();
                $(d1).css({
                    width:1100 + 'px',
                    maxHeight: this.getBlock().clientHeight - 60 + 'px'
                })
                d1.appendChild(res0);
                d1.appendChild(res1);
                d1.appendChild(res2);
                d1.appendChild(res3);

                var _self = this;
                // кнопка очистить фильтр
                res0.innerHTML = '<span style="font-size: 8pt; cursor: pointer; font-weight: bold;">сбросить фильтры</span>';
                res0.style.padding = '3px 30px 5px 0';
                res0.style.textAlign = 'right';
                res0.onclick = function(e){
                    if (e.target.nodeName.toLowerCase() != 'span') {
                        return;
                    }
                    _self.grid.close();
                    _self.filter.rebuildFilter(true);
                };
                this.subfilter = new subFilter();
                this.subfilter.conteinerId = 'subfilter';
                this.subfilter.create();
                this.subfilter.onChange = function(){
                    _self.filter.onChange(1);
                }
                this.filter = new Filter({
                    // получение списка значение для полей
                    urlGetFullData:linkPrefix + '/claim/conversion/getdepotfilterconfig',
                    // получение маски для для полей
                    urlGetMaskData:linkPrefix + '/claim/conversion/getdepotmaskfilter',
                    // filter type simple|excel default=simple
                    filterType:'excel',
                    //create in node||id
                    conteinerId:'filter',
                    // урл индикатора загрузки
                    imgLoader:'/img/ld/ld3.gif'
                });
                this.grid = new Grid({
                    conteinerId:'grid',
                    urlGetData:linkPrefix + '/claim/conversion/getdepotresult',
                    imgError:'/img/system/error.16.png' ,
                    imgLoader:'/img/ld/ld3.gif',
                    sortColumn:'title',
                    perpage:20,
                    backlightSelectRow:true
                });

                this.grid.head = {
                    id:      {caption:'ID', width:50, sort:1},
                    title:   {caption: configTitle,    width:160, sort:1, aliace:function(v, cnt, rowData){ return '<span style="text-decoration:underline; cursor:pointer;">' + v + '</span>';}, align:'left'},
                    prop:    {caption: configProp,     width:80, sort:1, aliace:function(v, cnt, rowData){ return eval(configPropReturn);}},
                    color:   {caption: configColor,    width:100, sort:1, aliace:function(v, cnt, rowData){ return eval(configColorReturn);}},
                    boxType: {caption: configBoxType, width:80, sort:1, aliace:function(v, cnt, rowData){ return eval(configBoxTypeReturn);}},
                    volum:   {caption: configVolum,    width:80, sort:1, aliace:function(v, cnt, rowData){ return eval(configVolumReturn);}},
                    height:  {caption: configHeight,   width:80, sort:1, aliace:function(v, cnt, rowData){
                            // Отображение реального поставщика
                            showVendornameTitle(rowData, cnt);
                            return eval(configHeightReturn);
                        }
                    },
                    width:   {caption: configWidth,   width:80, sort:1, aliace:function(v, cnt, rowData){ return eval(configWidthReturn);}},
                    depth:   {caption: configDepth, width:80, sort:1, aliace:function(v, cnt, rowData){ return eval(configDepthReturn);}},
                    labelWeight:{caption: configLabelWeight, width:80, sort:1, aliace:function(v, cnt, rowData){ return eval(configLabelWeightReturn);}},
                    inBoxes: {caption:'Кол-во в упаковке / средний вес ', width:100, sort:1, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                    amountWeight:{caption:'Кол-во (штук) / общий вес', width:100, sort:1, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                    boxesRols:{caption:'Кол-во упаковок / кол-во роликов', width:100, sort:1, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                    description:{caption:'Примечание', width:200, sort:1, aliace:function(v, cnt, rowData){ return (v||'');}}
                };


                this.filter.onAfterCreate = function() {
                    _self.grid.create();
                    _self.grid.fieldControll = 'id';
                    _self.grid.lastSelectionData = conversion.getChoiseGoods();
                    _self.grid.addPostData = _self.subfilter.getValue();
                    _self.grid.update(_self.filter.getValue());
                };
                this.filter.onChange = function() {
                    _self.grid.curpage = 1;
                    _self.grid.lastSelectionData = conversion.getChoiseGoods();
                    _self.grid.addPostData = _self.subfilter.getValue();
                    if (!arguments[0]) {
                        _self.grid.addPostData.searchId = 0;
                    }
                    _self.grid.update(this.getValue());
                };
                this.grid.bodyHeight = this.getBlock().offsetHeight - res0.offsetHeight - res1.offsetHeight - res2.offsetHeight - 300;
                this.grid.onAfterCreate = function(){
                    this.node().firstChild.childNodes.item(1).style.maxHeight = this.bodyHeight + 'px';
                    _self.cntToCenter();
                };
                this.grid.onBeforeUpdate = function(){
                    _self.cntToCenter();
                };
                this.grid.onAfterUpdate = function(){
                    _self.cntToCenter();
                };
                this.grid.onDblClick = function(rowIndex, field, node){
                    if (field == 'title' && node.nodeName.toLowerCase() == 'span') {
                        conversion.flagInfoIn = false;
                        return;
                    }

                    // Условие на проверку существования уже такого товара в списке.
                    var old_products = conversion.getChoiseGoods();
                    var prod = this.data[rowIndex];
                    var allow_add = true;
                    if (!$.isEmptyObject(old_products)) {
                        $(old_products).each(function(i, j) {
                            if (prod.id == j.id) {
                                allow_add = false;
                                alert('Товар с таким ID уже добавлен в список!');
                            }
                        });
                    }
                    if (allow_add) {
                        conversion.addProduct(prod);
                    }
                };
                this.grid.onClick = function(rowIndex, field, node) {
                    if (field != 'title' || node.nodeName.toLowerCase() != 'span') {
                        return;
                    }
                    conversion.flagInfoIn = true;
                    setTimeout(function(data){if (conversion.flagInfoIn) conversion.showInfoIn(data, 1);}, 250, this.data[rowIndex]);
                };


                this.filter.create();
                this.cntToCenter();
            };
            this.overley.onBeforeClose = function(){
                this.filter.close();
                this.grid.close();
                this.subfilter.close();
                setTimeout(function(){
                    if (conversion.overley4 && !conversion.overley4.data.id) {
                        conversion.overley4.close();
                    }
                }, 0);
            };
            this.overley.create();
        };

        /**
         * получение списка ранее выбранных товаров
         * @return
         */
        this.getChoiseGoods = function()
        {
            var elements = $('input');
            var data = [];
            var temp = {};
            var reg = /^products\[[\d]+\]\[id\]$/;
            for(var i=0; i<elements.length; i++) {
                if (!reg.test(elements[i].name)) {
                    continue;
                }
                var number = elements[i].name.replace(/[^\d]/g, '');
                temp[number] = elements[i].value;
            }

            for(i in temp){
                if (parseInt(temp[i])) {
                    data.push({id:temp[i]});
                }
            }
            return data;
        };

        this.closeFilter = function()
        {
            if (this.filter) this.filter.close();
            if (this.grid)   this.grid.close();
            if (this.mfilter) this.mfilter.close();
            if (this.mgrid)   this.mgrid.close();
            if (this.subfilter) this.subfilter.close();
        }

        /**
         * вставка данных по выбранному товару в форму
         */
        this.addProduct = function(_data)
        {
            data = this.uncompresData(this.compresData(_data));
            data.unitWeight = 0;
            // расчет веса единицы товара
            if  (data.formula) {
                data.unitWeight = eval('(' + data.formula.replace(/\$field6/g, data.height).replace(/\$field8/g, data.depth).replace(/\$field7/g, data.width) + ')');
            }
            var conversionType = this.conversionType;

            if (this.overley4) {// определение номера товара
                // при редактировании определение прошлых значение
                var lastData = {
                    amount : 0,
                    price  : 0,
                    boxes  : 0
                };
                conversionType = this.overley4.conversionType;

                if (parseInt(this.overley4.pnumber)) {// если редактирование
                    var number = parseInt(this.overley4.pnumber);
                    // установка прошлых значение
                    lastData.amount = $('#cnt div[type="products"] input[name="products[' + number + '][amount]"]').val();
                    lastData.boxes  = $('#cnt div[type="products"] input[name="products[' + number + '][boxes]"]').val();
                    lastData.price  = $('#cnt div[type="products"] input[name="products[' + number + '][price]"]').val();
                }
                else { // если добавление
                    var number = (++this.productsNumber);
                }
            }
            else { // нормальное редактирование
                var number = (++this.productsNumber);
            }
            // описание полей
            var list = {
                total:   {type:'text', value:' '},
                // цена за кг переработки
                price:   {
                    type:'input',
                    value:'',
                    name:'products[{number}][price]',
                    oninput:function(){
                        conversion.updateTotals();
                    }
                },
                // ид товара
                id:      {type:'hidden', name:'products[{number}][id]'},
                // ид товара
                itemType:{type:'hidden', name:'products[{number}][itemType]', value:data.type, lang : data.type},
                // сделать вес
                amount:  {
                    type:'input',
                    value:'',
                    name:'products[{number}][amount]',
                    oninput:function(){
                        conversion.controlAmountBoxes(this);
                        conversion.updateTotals();
                    },
                    onclick:function(){
                        if (conversion.conversionType == 2) {
                            conversion.changeConversionType(1);
                        }
                    },
                    lang : data.type,
                    readonly : (conversionType == 2)
                },
                // сделпть шт/рол-ов
                boxes:   {
                    type:'input',
                    value:'',
                    name:'products[{number}][boxes]',
                    oninput:function(){
                        conversion.controlAmountBoxes(this);
                        conversion.updateTotals();
                    },
                    onclick:function(){
                        if (conversion.conversionType == 2 && this.lang == 1) {
                            conversion.changeConversionType(1);
                        }
                    },
                    lang : data.type,
                    readonly : (conversionType == 2 && data.type == 1)
                },
                // удалить из списка
                drop:    {
                    type:'img',
                    src:'/img/system/delete.png',
                    onclick:function(){
                        conversion.dropProducts(this.parentNode.parentNode);
                    },
                    title:'удалить товар'
                },
                pid:     {type:'text', align:'center', width:50, value:data['id']}, //id
                title:   {type:'text', align:'left', width:180, }, //название
                prop:    {type:'text', value: ((configPropType == 'string') ? data['prop']||'&nbsp;' : parseFloat(data['prop'])||'&nbsp;')}, // сорт товара первичка.вторичка
                color:   {type:'text', value: ((configColorType == 'string') ? data['color']||'&nbsp;' : parseFloat(data['color'])||'&nbsp;')}, // цвет товара
                boxType: {type:'text', value: ((configBoxTypeType == 'string') ? data['boxType']||'&nbsp;' : parseFloat(data['boxType'])||'&nbsp;')}, // тип упаковки
                volum:   {type:'text', value: ((configVolumType == 'string') ? data['volum']||'&nbsp;' : parseFloat(data['volum'])||'&nbsp;')}, // объем
                height:  {type:'text', value: ((configHeightType== 'string') ? data['height']||'&nbsp;' : parseFloat(data['height'])||'&nbsp;')}, // длина
                width:   {type:'text', value: ((configWidthType  == 'string') ? data['width']||'&nbsp;' : parseFloat(data['width'])||'&nbsp;')}, // ширина
                depth:   {type:'text', value: ((configDepthType == 'string') ? data['depth']||'&nbsp;' : parseFloat(data['depth'])||'&nbsp;')}, // олщина
                labelWeight:  {type:'text', value: ((configLabelWeightType == 'string') ? data['labelWeight']||'&nbsp;' : parseFloat(data['labelWeight'])||'&nbsp;')}, // вес этикетки
                inBoxes: {type:'text'} // в упаковке
            };
            if(accessGlobalAmount == 1) {
                list.amountWeight = {type : 'text'}; //вес/кол-во на складе
                list.boxesRols = {type : 'text'}; // шт.рол-ов на складе
            }
            list.description = {type : 'text', width : 180}; // описание
            // вставка строки товара
            if (!this.overley4) { // если создание заявки или нормальное редактирование
                var table = this.node("table_products");
                var row = table.insertRow(table.rows.length-1);
            }
            else { // редактирование заявки при наличии прихода
                list.drop = {
                    type:'img',
                    src:'/img/system/edit.png',
                    onclick:function(){
                        conversion.overley4.editProducts(this.parentNode.parentNode);
                    },
                    title:'Изменить товар'
                };
                var table = $('#cnt div[type="products"]>table')[0];
                if (parseInt(this.overley4.pnumber)) { // если редактирование товара
                    var row = $(table).find('tr[type="data"]')[0];
                    $(row).empty();
                }
                else { // добавляем товар
                    var row = $("#cnt table>tbody")[0].insertRow(0);
                }
            }

            row.setAttribute('pnumber', number);
            row.data = this.compresData(data);
            row.id = 'products' + number + 'data';
            row.setAttribute('type', 'data');
            // создание строки товара
            for(var field in list){
                if (list[field].type != 'hidden') {
                    var cell = row.insertCell(row.cells.length);
                    cell.align = (list[field].align||'center');
                    cell.vAlign = 'center';
                }
                switch(list[field].type) {
                    case 'input':
                        var node = document.createElement('input');
                        node.type = 'text';
                        node.name = list[field].name.replace(/\{number\}/, number);
                        node.value = list[field].value;
                        node.size = 8;
                        node.addEventListener('input', list[field].oninput, false);
                        if (list[field].onclick) {
                            node.addEventListener('click', list[field].onclick, false);
                        }
                        cell.appendChild(node);
                        node.readOnly = list[field].readonly;
                        node.lang = list[field].lang;
                        // востановление данных
                        if (this.overley4) {
                            if (/(amount|boxes|price)]$/.test(node.name)) {
                                node.value = lastData[field]
                            }
                        }
                        break;
                    case 'hidden':
                        var node = document.createElement('input');
                        node.type = 'hidden';
                        node.value = list[field].value||data[field];
                        node.name = list[field].name.replace(/\{number\}/, number);
                        node.size = 8;
                        cell.appendChild(node);
                        break;
                    case 'img':
                        var node = document.createElement('img');
                        node.src = list[field].src;
                        node.onclick = list[field].onclick;
                        node.align = 'absmiddle';
                        node.style.cursor = 'pointer';
                        node.title = list[field].title; //'удалить товар';
                        cell.appendChild(node);
                        break;
                    case 'text':
                        cell.innerHTML = (list[field].value||data[field]||'&nbsp;');
                        if (list[field].value || data[field]) {
                            // Отображение реального поставщика
                            showVendornameTitle(data, cell, field);
                        }
                        
                        break;
                }

            }
            // создание последних 2х строк для товара
            if (!this.overley4) { // обычный режим создпния/редактирования
                var colspan = row.cells.length;
                var row = table.insertRow(table.rows.length-1);
                row.setAttribute('pnumber', number);
                row.setAttribute('forinsertmaterials', '1');
                row.lang = this.compresData(data);
                var cell = row.insertCell(0);
                cell.colSpan = colspan;
                cell.innerHTML = '<span class="addMaterial" style="cursor: pointer;">добавить сырье</span>'
                + '&nbsp;&nbsp;|&nbsp;&nbsp;'
                + '<span class="addMaterialClient" style="cursor: pointer;">добавить сырье переработчика</span>';
                cell.onclick = function(e){
                    switch(e.target.className){
                        case 'addMaterial':
                            conversion.showMaterial(this.parentNode);
                            break;
                        case 'addMaterialClient':
                            conversion.showMaterialClient(this.parentNode);
                            break;
                    };
                };
                var row = table.insertRow(table.rows.length-1);
                row.setAttribute('pnumber', number);
                var cell = row.insertCell(0);
                cell.colSpan = colspan;
                cell.innerHTML = '<br><hr><br>';
            }
            else { // редактирование заявки при наличии прихода
                if (!parseInt(this.overley4.pnumber)) { // добавление нового товара
                    var colspan = row.cells.length;
                    var row = table.insertRow(table.rows.length);
                    row.setAttribute('pnumber', number);
                    row.setAttribute('forinsertmaterials', '1');
                    var cell = row.insertCell(0);
                    cell.colSpan = colspan;
                    cell.innerHTML = '<span onclick="conversion.overley4.addMaterial(this.parentNode.parentNode)" style="cursor: pointer;">добавить сырье</span>'
                    + '&nbsp;&nbsp;|&nbsp;&nbsp;'
                    + '<span onclick="conversion.overley4.addMaterialClient(this.parentNode.parentNode)" style="cursor: pointer;">добавить сырье переработчика</span>';
                }
            }
            if (this.overley4) {
                var updateIncoms = (this.overley4.pnumber != number);
                this.overley4.pnumber = number;
                this.overley4.data = data;
                this.overley4.widthCorrection().toCenter();
                this.overley.close();
                delete(this.overley);
                if (updateIncoms) {
                    this.overley4.getIncoms();
                }
            }
            else {
                this.overley.grid.lastSelectionData = this.getChoiseGoods();
                this.overley.grid._updateSelectedRow();
                this.filter.rebuildFilter();
            }
        };

        /**
         * удаление все инфы о товаре из формы
         */
        this.dropProducts = function(obj)
        {
            var data = this.uncompresData(obj.data);
            this.overleyDropProduct = new Overley();
            this.overleyDropProduct.title = 'Удаление товара {title} (ID:{id})'.replace(/\{title\}/, data.title).replace(/\{id\}/, data.id);
            this.overleyDropProduct.pnumber = obj.getAttribute('pnumber');
            this.overleyDropProduct.onAfterCreate = function()
            {
                var html = '<center style="padding:30px; width:300px;">';
                html += 'Вы уверены в удаление товара';
                html += '</center>';
                html += '<div style="padding-bottom:5px; text-align: right;">';
                html += '<input type="button" value="Удалить" style="width:100px" onclick="conversion.overleyDropProduct.apply()" />';
                html += '&nbsp;<input type="button" value="Отмена" style="width:100px" onclick="conversion.overleyDropProduct.close()" />';
                html += '</div>';
                this.getArea().innerHTML = html;
            };
            this.overleyDropProduct.onAfterClose = function()
            {
                delete(conversion.overleyDropProduct);
            };
            this.overleyDropProduct.apply = function()
            {
                var table = this.node("table_products");
                var rows = table.rows;
                var i = 0;
                while(rows[i]) {
                    if (rows[i].getAttribute('pnumber') == this.pnumber){
                        table.deleteRow(i);
                    }
                    else {
                        ++i;
                    }
                }
                if (conversion.overley4) {
                    conversion.overley4.close();
                }
                conversion.updateTotals();
                conversion.filter.rebuildFilter();
                this.close();
            };
            this.overleyDropProduct.create().toCenter();
        };

        /**
         * упраление сырьем
         */
        this.showMaterial = function(obj)
        {
            var pnumber = obj.getAttribute('pnumber');
            if (this.node('client').value == 0) {
                this.showWarning('Вы не выбрали переработчика!', 'Предупреждение');
                return;
            }

            this.overley2 = new overley();
            this.overley2.onAfterCreate = function() {
                var res0 = document.createElement('div');
                res0.style.border = '1px solid black';
                res0.style.borderBottom = 'none';
                res0.id = 'clsFilter';

                var res1 = document.createElement('div');
                res1.style.border = '1px solid black';
                res1.style.borderTop = 'none';
                res1.id = 'filter';
                res1.align = 'center';

                var res2 = document.createElement('div');
                res2.style.border = '1px solid black';
                res2.style.marginTop = '5px';
                res2.id = 'subfilter';

                var res3 = document.createElement('div');
                res3.style.border = '1px solid black';
                res3.style.marginTop = '5px';
                res3.id = 'grid';

                var d1 = this.getCnt();
                $(d1).css({
                    width:1100 + 'px',
                    maxHeight: this.getBlock().clientHeight - 60 + 'px'
                })
                d1.appendChild(res0);
                d1.appendChild(res1);
                d1.appendChild(res2);
                d1.appendChild(res3);

                var _self = this;
                // кнопка очистить фильтр
                res0.innerHTML = '<span style="font-size: 8pt; cursor: pointer; font-weight: bold;">сбросить фильтры</span>';
                res0.style.padding = '3px 30px 5px 0';
                res0.style.textAlign = 'right';
                res0.onclick = function(e){
                    if (e.target.nodeName.toLowerCase() != 'span') {
                        return;
                    }
                    _self.grid.close();
                    _self.filter.rebuildFilter(true);
                };
                this.subfilter = new subFilter();
                this.subfilter.conteinerId = 'subfilter';
                this.subfilter.create();
                this.subfilter.onChange = function(){
                    _self.filter.onChange(1);
                }
                this.filter = new Filter({
                    urlGetFullData:linkPrefix + '/claim/conversion/getclientfilterconfig',
                    urlGetMaskData:linkPrefix + '/claim/conversion/getclientmaskfilter',
                    filterType:'excel',
                    conteinerId:'filter',
                    imgLoader:'/img/ld/ld3.gif'
                });
                this.grid = new Grid({
                    conteinerId:'grid',
                    urlGetData:linkPrefix + '/claim/conversion/getclientresult',
                    imgError:'/img/system/error.16.png' ,
                    imgLoader:'/img/ld/ld3.gif',
                    sortColumn:'title',
                    perpage:20,
                    backlightSelectRow:true
                });

                this.grid.head = {
                    id:      {caption:'ID', width:43, sort:1},
                    title:   {caption: configTitle, width:115, sort:1, aliace:function(v, cnt, rowData){ return '<span style="cursor:pointer;text-decoration:underline;">' + v + '</span>';}, align:'left'},
                    prop:    {caption: configProp,     width:77, sort:1, aliace:function(v, cnt, rowData){ return eval(configPropReturn);}},
                    color:   {caption: configColor,    width:100, sort:1, aliace:function(v, cnt, rowData){ return eval(configColorReturn);}},
                    boxType: {caption: configBoxType, width:80, sort:1, aliace:function(v, cnt, rowData){ return eval(configBoxTypeReturn);}},
                    volum:   {caption: configVolum,    width:70, sort:1, aliace:function(v, cnt, rowData){ return eval(configVolumReturn);}},
                    height:  {caption: configHeight,   width:75, sort:1, aliace:function(v, cnt, rowData){
                            // Отображение реального поставщика
                            showVendornameTitle(rowData, cnt);
                            return eval(configHeightReturn);
                        }
                    },
                    width:   {caption: configWidth,   width:75, sort:1, aliace:function(v, cnt, rowData){ return eval(configWidthReturn);}},
                    depth:   {caption: configDepth, width:75, sort:1, aliace:function(v, cnt, rowData){ return eval(configDepthReturn);}},
                    labelWeight:{caption: configLabelWeight, width:75, sort:1, aliace:function(v, cnt, rowData){ return eval(configLabelWeightReturn);}},
                    amountWeight:{caption:'Кол-во (штук) / общий вес', width:100, sort:1, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                    //boxesRols:{caption:'Кол-во упаковок / кол-во роликов', width:100, sort:1, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                    description:{caption:'Примечание', width:200, sort:1, aliace:function(v, cnt, rowData){ return (v||'');}}
                };


                this.filter.onAfterCreate = function() {
                    _self.grid.create();
                    _self.grid.fieldControll = 'id';
                    _self.grid.lastSelectionData = conversion.findAddedMaterial(_self.grid.pnumberOuter);
                    _self.grid.addPostData = _self.subfilter.getValue();
                    _self.grid.addPostData.clientId = this.node('client').value;
                    _self.grid.update(_self.filter.getValue());
                };
                this.filter.onChange = function() {
                    _self.grid.curpage = 1;
                    _self.grid.lastSelectionData = conversion.findAddedMaterial(_self.grid.pnumberOuter);
                    _self.grid.addPostData = _self.subfilter.getValue();
                    _self.grid.addPostData.clientId = this.node('client').value;
                    if (!arguments[0]) {
                        _self.grid.addPostData.searchId = 0;
                    }
                    _self.grid.update(this.getValue());
                };
                this.grid.bodyHeight = this.getBlock().offsetHeight - res0.offsetHeight - res1.offsetHeight - res2.offsetHeight - 300;
                this.grid.pnumberOuter = pnumber;
                this.grid.onAfterCreate = function(){
                    this.node().firstChild.childNodes.item(1).style.maxHeight = this.bodyHeight + 'px';
                    _self.cntToCenter();
                };
                this.grid.onBeforeUpdate = function(){
                    _self.cntToCenter();
                };
                this.grid.onAfterUpdate = function(){
                    _self.cntToCenter();
                };
                this.grid.onDblClick = function(rowIndex, field, node) {
                    conversion.showInfoSupplyFlag = false;
                    if (field == 'title' && node.nodeName.toLowerCase() == 'span') return;
                    conversion.addMaterial(this.pnumberOuter, this.data[rowIndex]);
                };
                this.grid.onClick = function(rowIndex, field, node){
                    if (field != 'title' || node.nodeName.toLowerCase() != 'span') return;
                    conversion.showInfoSupplyFlag = true;
                    setTimeout(function(data){conversion.showInfoSupplyByItem(data);}, 250, this.data[rowIndex]);
                }
                this.filter.create();
                this.cntToCenter();
            };
            this.overley2.onBeforeClose = function(){
                this.filter.close();
                this.grid.close();
                this.subfilter.close();
            };
            this.overley2.create();
        };

        /**
         * список добавленного сырья в продукт
         */
        this.findAddedMaterial = function(pnumber)
        {
            var data = [];
            var reg = new RegExp('^products\\[' + pnumber +'\\]\\[conversions\\]\\[\\d+\\]\\[id\\]$');
            if (!this.overley4) {
                var elements = document.getElementById(this.formId).elements;
                for(var i=0; i<elements.length; i++) {
                    if (reg.test(elements[i].name)) {
                        data.push({id:elements[i].value});
                    }
                }
                return data;
            }
            $('#cnt div[type="products"] input[type="hidden"]').each(function(i, inp){
                if (reg.test(inp.name) && parseInt(inp.value)) {
                    data.push({id:inp.value});
                }
            });
            return data;
        };

        /**
         * вставка данных в форму
         */
        this.addMaterial = function(pnumber, data)
        {
            var itemnumber = 0;
            var _self = this;
            data.parent_number = pnumber;

            // find max number
            var reg2 = new RegExp('^products\\[' + pnumber +'\\]\\[conversions\\]\\[[\\d]+\\]\\[id\\]$');
            var addedIds = '|';
            var conversionType = 0;
            var enableType2 = 0;

            if (!this.overley4) {
                var elements = document.getElementById(this.formId).elements;
                for(var i=0; i<elements.length; i++) {
                    if (reg2.test(elements[i].name) && parseInt(elements[i].value)){
                        addedIds += elements[i].value + '|';
                    }
                }
                conversionType = this.conversionType;
                enableType2 = this.enableType2;
                var table = document.getElementById("table_products");
            }
            else {
                $('#cnt div[type="products"] input[type="hidden"]').each(function(i, inp){
                    if (reg2.test(inp.name) && parseInt(inp.value)) {
                        addedIds += inp.value + '|';
                    }
                });
                conversionType = this.overley4.conversionType;
                enableType2 = this.overley4.enableType2;
                var table = $('#cnt div[type="products"]>table')[0];
            }

            if (addedIds.indexOf('|' + data.id + '|') != -1) {
                this.showWarning('сырье : ' + data.title + String.fromCharCode(10,13) + 'ID : ' + data.id + String.fromCharCode(10,13) + ' уже добавлено !', 'Предупреждение');
                return;
            }
            if (conversionType == 2 && parseFloat(data.amountWeight) <=0) {
                this.showWarning('сырье : ' + data.title + String.fromCharCode(10,13) + 'ID : ' + data.id + String.fromCharCode(10,13) + '<br>не возможно добавить при альтернативном типе переработки,<br>т.к. оно отсутствует на складе!', 'Предупреждение');
                return;
            }

            itemnumber = parseInt($(table).find('tr[pnumber="' + pnumber + '"][forinsertmaterials]').attr('forinsertmaterials')) + 1;
            var i = $(table).find('tr[pnumber="' + pnumber + '"][forinsertmaterials]').attr('forinsertmaterials', itemnumber)[0].rowIndex;

            var row = table.insertRow(i);
            row.setAttribute('pnumber', pnumber);
            row.setAttribute('itemnumber', itemnumber);
            row.data = this.compresData(data);
            row.id = 'products' + pnumber + 'conversions' + itemnumber + 'data';
            var list = {
                ddd:     {type:'text', value:'&nbsp;'},
                text:    {type:'text', value:'% использования'},
                id:      {type:'hidden', name:'products[' + pnumber + '][conversions][' + itemnumber + '][id]'}, // ид товара
                number:  {type:'hidden', name:'products[' + pnumber + '][conversions][' + itemnumber + '][number]', value:itemnumber},
                price:   {type:'hidden', name:'products[' + pnumber + '][conversions][' + itemnumber + '][price]', value:'0'},
                // процент использование
                percent: {
                    type     : 'input',
                    name     : 'products[' + pnumber + '][conversions][' + itemnumber + '][percent]',
                    value    : '',
                    oninput  : function(){conversion.updateTotalsType1(this); conversion.inputPercent(this);},
                    onclick  : function(){conversion.changeConversionType(1);},
                    readonly : (conversionType == 2),
                    title    : 'значения выставляются в %\nот общего веса'
                },

                title0:  {type:'hidden', name:'products[' + pnumber + '][conversions][' + itemnumber + '][title]', value:' '},
                itemType:{type:'hidden', name:'products[' + pnumber + '][conversions][' + itemnumber + '][itemType]', value:data.type},
                // процент использование 2
                boxes: {
                    type     : 'input',
                    name     : 'products[' + pnumber + '][conversions][' + itemnumber + '][percent2]',
                    value    : '',
                    oninput  : function(){conversion.updateTotalsType2(this)},
                    readonly : (conversionType == 1),
                    onclick  : function(){conversion.changeConversionType(2);},
                    title    : 'значения выставляются в кг используемого сырья,\nобщий вес равен сумме всего используемого сырья ',
                    maxvalue : data.amountWeight
                },

                //boxes:   {type:'text', value:'&nbsp;'}, // сделпть шт/рол-ов
                drop:    {type:'img', src:'/img/system/delete.png', onclick:function(){_self.dropItems(this.parentNode.parentNode);}}, // удалить из списка
                mid:     {type:'text', align:'center', width:50, value:data['id']}, // mid
                title:   {type:'text', align:'left', width:150}, // название
                prop:    {type:'text'}, // сорт товара первичка.вторичка
                color:   {type:'text'}, // цвет товара
                boxType: {type:'text'}, // тип упаковки
                volum:   {type:'text', value:(parseFloat(data['volum'])||'&nbsp;')}, // объем
                height:  {type:'text', value:(parseFloat(data['height'])||'&nbsp;')}, // длина
                width:   {type:'text', value:(parseFloat(data['width'])||'&nbsp;')}, // ширина
                depth:   {type:'text', value:(parseFloat(data['depth'])||'&nbsp;')}, // олщина
                labelWeight:  {type:'text', value:(parseFloat(data['labelWeight'])||'&nbsp;')}, // вес этикетки
                inBoxes:      {type:'text', value:' '} // в упаковке
            };

            if (!enableType2) {
                list.boxes = {type:'text', value:'&nbsp;'};
            }

            if(accessGlobalAmount == 1) {
                list.amountWeight = {type : 'text'}; //вес/кол-во на складе
                list.boxesRols = {type : 'text', value : ' '}; // шт.рол-ов на складе
            }
            list.description = {type : 'text'};  // описание

            for(var field in list){
                if (list[field].type != 'hidden') {
                    var cell = row.insertCell(row.cells.length);
                    cell.align = (list[field].align||'center');
                    cell.vAlign = 'center';
                }
                switch(list[field].type) {
                    case 'input':
                        var node = document.createElement('input');
                        node.type = 'text';
                        node.name = list[field].name;
                        node.value = (list[field].value||data[field]||'');
                        node.size = 8;
                        node.addEventListener('input', list[field].oninput, false);
                        node.onclick = list[field].onclick;
                        node.title = list[field].title;
                        if (typeof list[field].readonly != 'undefined') {
                            node.readOnly = list[field].readonly;
                        }
                        if (typeof list[field].maxvalue != 'undefined') {
                            node.setAttribute('maxvalue', list[field].maxvalue);
                        }
                        cell.appendChild(node);
                        break;
                    case 'hidden':
                        var node = document.createElement('input');
                        node.type = 'hidden';
                        node.value = list[field].value||data[field];
                        node.name = list[field].name;
                        node.size = 8;
                        cell.appendChild(node);
                        break;
                    case 'img':
                        var node = document.createElement('img');
                        node.src = list[field].src;
                        node.onclick = list[field].onclick;
                        node.align = 'absmiddle';
                        node.style.cursor = 'pointer';
                        cell.appendChild(node);
                        break;
                    case 'text':
                        cell.innerHTML = (list[field].value||data[field]||'&nbsp;');
                        
                        if (list[field].value || data[field]) {
                            // Отображение реального поставщика
                            showVendornameTitle(data, cell, field);
                        }
                        
                        break;
                }

            }
            this.overley2.grid.lastSelectionData = this.findAddedMaterial(pnumber);
            this.overley2.grid._updateSelectedRow();
            if (this.overley4) {
                this.overley4.widthCorrection().toCenter();
                this.overley4.updateMaterialPercentOff();
            }
        };

        /**
         * удаление сырья из продукта
         */
        this.dropItems = function(obj)
        {
            this.overleyDropItem = new Overley();
            this.overleyDropItem.title = 'Удаление сырья';
            this.overleyDropItem.pnumber = obj.rowIndex;
            this.overleyDropItem.onAfterCreate = function()
            {
                var html = '<center style="padding:30px; width:300px;">';
                html += 'Вы уверены в удаление сырья';
                html += '</center>';
                html += '<div style="padding-bottom:5px; text-align: right;">';
                html += '<input type="button" value="Удалить" style="width:100px" onclick="conversion.overleyDropItem.apply()" />';
                html += '&nbsp;<input type="button" value="Отмена" style="width:100px" onclick="conversion.overleyDropItem.close()" />';
                html += '</div>';
                this.getArea().innerHTML = html;
            };
            this.overleyDropItem.onAfterClose = function()
            {
                delete(conversion.overleyDropItem);
            };
            this.overleyDropItem.apply = function()
            {
                if (!conversion.overley4) {
                    var table = this.node("table_products");
                    table.deleteRow(this.pnumber);
                    conversion.updateTotals();
                }
                else {
                    var table = $('#cnt div[type="products"]>table')[0];
                    table.deleteRow(this.pnumber);
                    conversion.overley4.widthCorrection().toCenter();
                    conversion.overley4.updateMaterialPercentOff();
                }
                this.close();
            };
            this.overleyDropItem.create().toCenter();
        };

        /**
         * добавление сырья переработчика
         */
        this.showMaterialClient = function(obj)
        {
            var conversionType = 0;
            if (!this.overley4) {
                conversionType = this.conversionType;
            }
            else {
                conversionType = this.overley4.conversionType;
            }

            if (conversionType == 2) {
                this.showWarning('не возможно использовать сырье переработчика<br>в режиме альтернативной переработки', 'Предупреждение');
                return;
            }

            this.overley3 = new Overley();
            this.overley3.pnumber = obj.getAttribute('pnumber');
            this.overley3.data = this.uncompresData(obj.lang);
            this.overley3.onAfterCreate = function()
            {
                var html = '<div style="padding: 5px; font-size: 8pt; color: black;">продукт ID : {id}</div>'.replace(/\{id\}/, this.data.id)
                + '<fieldset style="width: 483px;"><legend>Сырье переработчика</legend>'
                + '<div style="text-align: right; margin: 0px 0px 5px; padding: 0px 10px 0px 0px;">название : '
                + '<input style="text-align: left; width: 370px;" id="material-conv-title" /></div>'
                + '<div style="text-align: right; margin: 0px 0px 15px; padding: 0px 10px 0px 0px;">цена : '
                + '<input style="text-align: left; width: 370px;" id="material-conv-price" /></div>'
                + '</fieldset>'
                + '<div style="text-align:right"><br>'
                + '<input type="button" value="Оk" style="width:100px" onclick="conversion.overley3.apply()" id="material-conv-apply" />&nbsp;&nbsp;'
                + '<input type="button" value="Отмена" style="width:100px" onclick="conversion.overley3.close()" />'
                + '</div>';
                this.getArea().innerHTML = html;
                this.getArea().style.padding = '0px 5px 5px 5px';
                this.getCaption().innerHTML = 'Сырье переработчика для ' + this.data.title;

                this.node("material-conv-title").oninput = function()
                {
                    conversion.overley3.checkApply();
                };
                this.node("material-conv-title").onkeyup = function(e)
                {
                    switch (e.keyCode) {
                        case 13:
                            conversion.overley3.apply();
                            break;
                        case 27:
                            conversion.overley3.close();
                            break;
                        default:
                            break;
                    }
                };

                this.node("material-conv-price").oninput = function()
                {
                    conversion.controlNumberValue(this);
                    conversion.overley3.checkApply();
                };
                this.node("material-conv-price").onkeyup = function(e)
                {
                    switch (e.keyCode) {
                        case 13:
                            conversion.overley3.apply();
                            break;
                        case 27:
                            conversion.overley3.close();
                            break;
                        default:
                            break;
                    }
                };
                this.checkApply();
                this.node("material-conv-title").focus();
            };
            this.overley3.onAfterClose = function()
            {
                delete(conversion.overley3);
            };
            this.overley3.apply = function()
            {
                if (this.node('material-conv-apply').disabled) {
                    return;
                }
                var data = {
                    pnumber:this.pnumber,
                    id:null,
                    title:this.node('material-conv-title').value,
                    price:this.node('material-conv-price').value
                };
                setTimeout(
                    function(data){
                        conversion.addMaterialClient(data);
                    },
                    0,
                    data
                );
                this.close();
            };
            this.overley3.checkApply = function()
            {
                this.node('material-conv-apply').disabled = !(
                    this.node('material-conv-title').value.replace(/\s+|\s+/g, '').length
                    && /^\d+(\.\d+)?$/.test(this.node('material-conv-price').value)
                ) ;
            };
            this.overley3.create().toCenter();
        };

        /**
         * вставка данных в форму
         */
        this.addMaterialClient = function(data)
        {
            var itemnumber = 0;
            var _self = this;
            data.parent_number = data.pnumber;

            // find max number
            if (!this.overley4) {
                var table = document.getElementById("table_products");
            }
            else {
                var table = $('#cnt div[type="products"]>table')[0];
            }

            itemnumber = parseInt($(table).find('tr[pnumber="' + data.pnumber + '"][forinsertmaterials]').attr('forinsertmaterials')) + 1;
            var i = $(table).find('tr[pnumber="' + data.pnumber + '"][forinsertmaterials]').attr('forinsertmaterials', itemnumber)[0].rowIndex;

            var row = table.insertRow(i);
            row.setAttribute('pnumber', data.pnumber);
            row.setAttribute('itemnumber', itemnumber);
            row.data = this.compresData(data);
            row.id = 'products' + data.pnumber + 'conversions' + itemnumber + 'data';
            var list = {
                ddd:     {type:'text', value:'&nbsp;'},
                text:    {type:'text', value:'% использования'},
                id:      {type:'hidden', name:'products[' + data.pnumber + '][conversions][' + itemnumber + '][id]',       value:'0'}, // ид товара
                number:  {type:'hidden', name:'products[' + data.pnumber + '][conversions][' + itemnumber + '][number]',   value:itemnumber},
                price:   {type:'hidden', name:'products[' + data.pnumber + '][conversions][' + itemnumber + '][price]',    value:data.price},
                title0:  {type:'hidden', name:'products[' + data.pnumber + '][conversions][' + itemnumber + '][title]',    value:data.title},
                itemType:{type:'hidden', name:'products[' + data.pnumber + '][conversions][' + itemnumber + '][itemType]', value:'0'},
                // процент использование
                percent: {
                    type     : 'input',
                    name     : 'products[' + data.pnumber + '][conversions][' + itemnumber + '][percent]',
                    value    : '',
                    oninput  : function(){conversion.updateTotalsType1(this); conversion.updateTotals();},
                    onclick  : function(){conversion.changeConversionType(1);},
                    readonly : (this.conversionType == 2),
                    title    : 'значения выставляются в %\nот общего веса'
                },
                // процент использование
                boxes:{
                    type     : 'input',
                    name     : 'products[' + data.pnumber + '][conversions][' + itemnumber + '][percent2]',
                    value    : '',
                    oninput  : function(){conversion.updateTotalsType2(this); conversion.updateTotals();},
                    readonly : (this.conversionType == 1),
                    onclick  : function(){conversion.changeConversionType(2);},
                    title    : 'значения выставляются в кг используемого сырья,\nобщий вес равен сумме всего используемого сырья '
                },
                // boxes:   {type:'text', value:'&nbsp;'}, // сделпть шт/рол-ов
                drop:    {
                    type    : 'img',
                    src     : '/img/system/delete.png',
                    onclick : function(){_self.dropItems(this.parentNode.parentNode);}
                }, // удалить из списка
                pid:     {type:'text', align:'left', value:'&nbsp;'}, // название
                title:   {type:'text', align:'left', colspan:13}, // название
            };
            if (!this.enableType2) {
                list.boxes = {type:'text', value:'&nbsp;'};
            }
            for(var field in list){
                if (list[field].type != 'hidden') {
                    var cell = row.insertCell(row.cells.length);
                    cell.align = (list[field].align||'center');
                    cell.vAlign = 'center';
                    if  (list[field].colspan) {
                        cell.colSpan = list[field].colspan;
                    }
                }
                switch(list[field].type) {
                    case 'input':
                        var node = document.createElement('input');
                        node.type = 'text';
                        node.name = list[field].name;
                        node.value = (list[field].value||data[field]||'');
                        node.size = 8;
                        node.addEventListener('input', list[field].oninput, false);
                        node.onclick = list[field].onclick;
                        node.title = list[field].title;
                        if (typeof list[field].readonly != 'undefined') {
                            node.readOnly = list[field].readonly;
                        }
                        cell.appendChild(node);
                        break;
                    case 'hidden':
                        var node = document.createElement('input');
                        node.type = 'hidden';
                        node.value = list[field].value||data[field];
                        node.name = list[field].name;
                        node.size = 8;
                        cell.appendChild(node);
                        break;
                    case 'img':
                        var node = document.createElement('img');
                        node.src = list[field].src;
                        node.onclick = list[field].onclick;
                        node.align = 'absmiddle';
                        node.style.cursor = 'pointer';
                        cell.appendChild(node);
                        break;
                    case 'text':
                        cell.innerHTML = (list[field].value||data[field]||'&nbsp;');
                        break;
                }
            }
            if (this.overley4) {
                this.overley4.widthCorrection().toCenter();
                this.overley4.updateMaterialPercentOff();
            }
        };

        /**
         * изменение типа переработки
         * @param int type - тип переработки 1-обычный / 2-доп
         */
        this.changeConversionType = function(type)
        {
            var checkMaterialsClient = false;
            if (!this.overley4) {
                if (!this.enableType2) {
                    return;
                }
                if (this.conversionType == type) {
                    return;
                }
                if (this.onlyView) {
                    return;
                }
                var elements = this.node(this.formId).elements;
            }
            else {
                if (!this.overley4.enableType2) {
                    return;
                }
                if (this.overley4.conversionType == type) {
                    return;
                }
                var elements = $('#cnt div[type="products"] input');
            }
            var msg = {};
            // проверка наличия сырья пер-ка в заявке
            for (var i=0; i<elements.length; i++) {
                if (!/^products\[\d+\]\[conversions\]\[\d+\]\[id\]$/i.test(elements[i].name)) {
                    continue;
                }
                if (elements[i].value == 0) {
                    checkMaterialsClient = true;
                    var itemData = this.uncompresData(elements[i].parentNode.parentNode.data);
                    if (!this.overley4) {
                        var pData = this.uncompresData(this.node('products' + itemData.parent_number + 'data"]').data);
                    }
                    else {
                        var pData = this.uncompresData($('#cnt #products' + itemData.parent_number + 'data')[0].data);
                    }
                    if (!msg['_' + pData.id]) {
                        msg['_' + pData.id] = {id : pData.id, title : pData.title, items : {}};
                    }
                    msg['_' + pData.id].items[i] = itemData;
                }
            }
            if (checkMaterialsClient) {
                var html = '';
                html += 'не возможно использовать режим альтернативной переработки';
                html += '<br>т.к. уже используется сырье переработчика.';
                html += '<hr width="70%" />';
                html += '<div style="text-align:left">';
                for (var i in msg) {
                    html += 'Товар : ' + msg[i].title + ' (ID:' + msg[i].id + '):<br>';
                    for(var j in msg[i].items) {
                        html += '&nbsp;&nbsp;&nbsp;&nbsp;- ' + msg[i].items[j].title + '<br>';
                    }
                }
                html += '</div>';
                this.showWarning(html, 'Предупреждение');
                return;
            }
            // переключение типа заявки
            if (this.overley4) {
                this.overley4.conversionType = type;
            }
            else {
                this.conversionType = type;
                this.node('conversion_type').value = type;
            }
            for (var i=0; i<elements.length; i++) {
                if (!/^products\[\d+\](\[(amount|boxes)\]|\[conversions\]\[\d+\]\[(percent|percent2)\])$/i.test(elements[i].name)) {
                    continue;
                }
                if (/^products\[\d+\]\[boxes\]$/i.test(elements[i].name)) {
                    elements[i].readOnly = (type == 2 && elements[i].lang == 1);
                }
                else if (/^products\[\d+\](\[amount\]|\[conversions\]\[\d+\]\[(percent)\])$/i.test(elements[i].name)) {
                    elements[i].readOnly = (type == 2);
                }
                else {
                    elements[i].readOnly = (type == 1);
                }
            }
        };

        /**
         * пересчет показателей вес сырья при изменении сырья для альтернотивного ввода
         */
        this.updateTotalsType1 = function(node)
        {
            this.controlNumberValue(node);
            var name = node.name.replace(/percent/, 'percent2');
            var pnumber = node.name.replace(/^products\[/, '').split(']')[0];
            if (!this.overley4) {
                var total = (parseFloat(this.node(this.formId)['products[' + pnumber + '][amount]'].value)||0);
                if (this.node(this.formId)[name]) {
                    this.node(this.formId)[name].value = total * (parseFloat(node.value)||0) / 100;
                }
            }
            else {
                var total = (parseFloat($('#cnt div[type="products"] input[name="products[' + pnumber + '][amount]"]').val())||0);
                $('#cnt div[type="products"] input[name="' + name + '"]').val(total * (parseFloat(node.value)||0) / 100);
            }
        };

        /**
         * пересчет показателей % и вес при изменении сырья для альтернотивного ввода
         */
        this.updateTotalsType2 = function(node)
        {
            if (!node) {
                return;
            }
            this.controlNumberValue(node, (parseFloat(node.getAttribute('maxvalue'))||0));
            var pnumber = node.name.replace(/^products\[/, '').split(']')[0];
            var regexp = new RegExp('^products\\[' + pnumber + '\\](\\[(amount)\\]|\\[conversions\\]\\[\\d+\\]\\[percent2\\])$', 'i');
            if (!this.overley4) {
                var elements = this.node(this.formId).elements;
            }
            else {
                var elements = $('#cnt div[type="products"] input');
            }
            var inpAmount = null;
            var percents = [];
            var totalAmount = 0;
            for (var i=0; i<elements.length; i++) {
                if (!regexp.test(elements[i].name)) {
                    continue;
                }
                if (/amount\]$/.test(elements[i].name)) {
                    inpAmount = elements[i];
                }
                else {
                    totalAmount += (parseFloat(elements[i].value)||0);
                    percents.push(elements[i]);
                }
            }
            inpAmount.value = totalAmount;

            for(var i=0, name = '', percent = 0; i<percents.length; i++) {
                name = percents[i].name.replace(/percent2/, 'percent');
                percent = (this.round((100 * percents[i].value/totalAmount), 9)||0);
                if (!this.overley4) {
                    this.node(this.formId)[name].value = percent;
                }
                else {
                    $('#cnt div[type="products"] input[name="' + name + '"]').val(percent)
                }
            }
            this.controlAmountBoxes(inpAmount);
            this.updateTotals();
        }

        /**
         * корректировка вводимых значений
         */
        this.controlNumberValue = function(node, maxValue)
        {
            node.value = node.value.replace(/\,/g, '.').replace(/[^0123456789\.]/g, '');
            if (node.value && /^\.\d*?$/.test(node.value)) {
                node.value = '0' + node.value;
                node.selectionStart = node.selectionStart + 1;
                node.selectionEnd   = node.selectionEnd + 1;
            }
            if (node.value && !/^\d+(\.\d*)?$/.test(node.value)) {
                var tmp = Math.abs(this.toFloat(node.value, 1));
                node.value = (node.value ? tmp : '');
            }
            if (typeof maxValue != 'undefined' && this.toFloat(node.value, 1) > this.toFloat(maxValue, 1) && node.value) {
                node.value = this.toFloat(maxValue, 1);
            }
        };

        /**
         * пересчет штук -> кол-во и обратно
         */
        this.controlAmountBoxes = function(obj)
        {
            obj.value = obj.value.replace(/[,]/g, '.');
            var updateItemsWeight = false;
            var conversionType = (this.overley4 ? this.overley4.conversionType : this.conversionType);

            if (/^products\[\d+\]\[amount\]$/.test(obj.name)) {
                var data = this.uncompresData(obj.parentNode.parentNode.data);
                var amount = Math.abs(this.toFloat(obj.value));
                if (amount != obj.value) {
                    obj.value = amount;
                }
                if (parseFloat(data.unitWeight)) {
                    if (!this.overley4) {
                        var node = this.node(this.formId)[obj.name.replace(/amount/, 'boxes')];
                    }
                    else {
                        var node = $('#cnt div[type="products"] input[name="' + obj.name.replace(/amount/, 'boxes') + '"]')[0]
                    }
                    node.value = this.round(amount/parseFloat(data.unitWeight));
                }
                updateItemsWeight = (conversionType != 2);
            }
            else {
                var data = this.uncompresData(obj.parentNode.parentNode.data);
                var boxes = Math.abs(this.toFloat(obj.value));
                if (boxes != obj.value) {
                    obj.value = boxes;
                }
                if (parseInt(data.type) == 1 && boxes){
                    if (!this.overley4) {
                        var node = this.node(this.formId)[obj.name.replace(/boxes/, 'amount')];
                    }
                    else {
                        var node = $('#cnt div[type="products"] input[name="' + obj.name.replace(/boxes/, 'amount') + '"]')[0]
                    }
                    node.value = this.round(boxes * parseFloat(data.unitWeight));
                }
                updateItemsWeight = (obj.lang == 1 && conversionType != 2);
            }
            if (!updateItemsWeight || !this.enableType2) {
                return;
            }
            // update percent weight;
            var pnumber = obj.name.replace(/[^\d]*/g, ' ').replace(/^\s+|\s+$/g, '').split(' ')[0];

            if (!this.overley4) {
                var amount = (parseFloat(this.node(this.formId)['products[' + pnumber + '][amount]'].value)||0);
            }
            else {
                var amount = (parseFloat($('#cnt div[type="products"] input[name="products[' + pnumber + '][amount]"]').val())||0);
            }

            var regexp = new RegExp('^products\\[' + pnumber + '\\]\\[conversions\\]\\[\\d+\\]\\[percent\\]$', 'i');
            if (!this.overley4) {
                var elements = this.node(this.formId).elements;
            }
            else {
                var elements = $('#cnt div[type="products"] input');
            }

            for (var i=0, name = '', inpamount = 0; i<elements.length; i++) {
                if (!regexp.test(elements[i].name)) {
                    continue;
                }
                name = elements[i].name.replace(/percent/, 'percent2');
                inpamount = amount * (parseFloat(elements[i].value)||0) / 100
                if (!this.overley4) {
                    this.node(this.formId)[name].value = inpamount;
                }
                else {
                    $('#cnt div[type="products"] input[name="' + name + '"]').val(inpamount);
                }
            }
        };

        /**
         * проверка правильности введенных данных
         * @returns bool
         */
        this.checkForm = function()
        {
            this.saveForm = false;
            if (this.onlyView) {
                return false;
            }
            this.saveForm = true;
            var nextStatusAv = this.node(this.formId)['changeStatusAvaleble'].value;
            var elements = this.node(this.formId).elements;
            var data = {products:[]};
            for(var i=0; i<elements.length; i++){
                if (/^claim\[[a-zA-Z_0-9]+\]$/.test(elements[i].name)) {
                    var name = elements[i].name.replace(/^claim\[/, '').replace(/\]/, '');
                    data[name] = elements[i].value;
                    continue;
                }
                if (/^products\[\d+\]\[[a-zA-Z_0-9]+\]$/.test(elements[i].name)) {
                    var name = elements[i].name.replace(/^products/, '').replace(/^\[|\]$/g, '').replace(/\]\[/g, '.').split('.');
                    var pnumber = name[0];
                    var key = name[1];
                    if (typeof data.products[pnumber] == 'undefined') data.products[pnumber] = {};
                    data.products[pnumber][key] = elements[i].value;
                    continue;
                }
                if (/^products\[\d+\]\[conversions\]\[\d+\]\[[a-zA-Z_0-9]+\]$/.test(elements[i].name)) {
                    var name = elements[i].name.replace(/^products/, '').replace(/\]\[/g, '.').replace(/^\[|\]$/g, '').split('.');
                    var pnumber = name[0];
                    if (typeof data.products[pnumber] == 'undefined') data.products[pnumber] = {};
                    var inumber = name[2]
                    var key = name[3];
                    if (typeof data.products[pnumber].materials == 'undefined') data.products[pnumber].materials = [];
                    if (typeof data.products[pnumber].materials[inumber] == 'undefined') data.products[pnumber].materials[inumber] = {};
                    data.products[pnumber].materials[inumber][key] = elements[i].value;
                }
            }
            var errors = [];
            if (parseInt(data.clientId) < 1) {
                errors.push(' - не выбран переработчик');
            }
            if (parseInt(data.managerId) < 1) {
                errors.push(' - не выбран менеджер');
            }

            var kpp = parseInt($('input[name="claim[kpp]"]').val());

            if(isNaN(kpp) || kpp == -1) {
                errors.push(' - не указан КПП клиента');
            }

            if (this.annotationRequired && nextStatusAv == 1) {
                if (typeof(tinyMCE) !== "undefined" && tinymce.get('annotation')) {
                    if (!tinyMCE.get('annotation').getContent()) {
                        errors.push(' - не заполнено Примечание');
                    }
                }
            }
            if (!this.checkDate(data.date)) {
                errors.push(' - не указана дата или не верный формат');
            }
            var products = data.products || [];
            for(var i=0; i<products.length; i++) {
                if (typeof products[i] == 'undefined') {
                    continue;
                }
                if (isNaN(parseFloat(products[i].amount)) || parseFloat(products[i].amount) <= 0.00001) {
                    errors.push(' - не верно указан вес в продукте №' + i);
                }
                if (isNaN(parseFloat(products[i].boxes)) || parseFloat(products[i].boxes) <= 0.00001) {
                    errors.push(' - не верно указано кол-во в продукте №' + i);
                }
                if (isNaN(parseFloat(products[i].price)) || parseFloat(products[i].price) < 0) {
                    errors.push(' - не верно указана стоимость переработки в продукте №' + i);
                }
                var materials = products[i].materials||[];
                var percent = 0;
                var itemNumber = 1;
                for(var j=0; j<materials.length; j++) {
                    if (typeof materials[j] == 'undefined') {
                        continue;
                    }
                    percent += isNaN(parseFloat(materials[j].percent)) ? 0 : parseFloat(materials[j].percent);
                    if (((isNaN(parseFloat(materials[j].percent)) ? 0 : parseFloat(materials[j].percent))) == 0){
                        errors.push(' - не верно указан процент использования в продукте №' + i + ' для сырья № ' + itemNumber + (parseInt(materials[j].id) ? ' (ID : ' + materials[j].id + ')' : ' (' + materials[j].title + ')' ));
                    }
                    itemNumber += 1;
                }
                if (Math.abs(100 - this.round(percent, 15)) > 0.00001 && materials.length) {
                    errors.push(' - не верное распределение процента использования в продукте №' + i + ' (%' + this.round(percent, 15) + ') ');
                }
                else if (!materials.length) {
                    errors.push(' - нет сырья для переработки в продукте №' + i);
                }
            }
            if (!products.length) {
                errors.push(' - нет выбранных товаров');
            }
            if (errors.length) {
                this.saveForm = false;
                this.showWarning('<div style="display:inline-block; text-align:left;">' + errors.join('<br>') + '</div>', 'Ошибки');
                return false;
            }
            this.saveForm = true;
            return true;
        };

        /**
         * устанавливает разрешение на смену статуса
         * @param bool flag
         */
        this.avalibleChangeStatus = function(flag)
        {
            this.node(this.formId)['changeStatusAvaleble'].value = ( flag ? 1 : 0 );
            if (this.node(this.formId).onsubmit()){
                this.node(this.formId).submit();
            }
        };

        /**
         * обновить инфу о суммах
         */
        this.updateTotals = function()
        {
            if (this.overley4) {
                conversion.overley4.updateMaterialPercentOff();
                return;
            }
            var elements = this.node(this.formId).elements;
            var data = {products:[]};
            var totalAmount = 0;
            var totalBoxes = 0;
            var totalSum = 0;
            for(var i=0; i<elements.length; i++){
                if (/^products\[\d+\]\[[a-zA-Z_0-9]+\]$/.test(elements[i].name)) {
                    var name = elements[i].name.replace(/^products/, '').replace(/^\[|\]$/g, '').replace(/\]\[/g, '.').split('.');
                    var pnumber = name[0];
                    var key = name[1];
                    if (typeof data.products[pnumber] == 'undefined') {
                        data.products[pnumber] = {};
                    }
                    elements[i].value = elements[i].value.replace(/[,]/g, '.');
                    data.products[pnumber][key] = elements[i].value;
                    if (key == 'amount') {
                        totalAmount += parseFloat(elements[i].value)||0;
                    }
                    if (key == 'boxes') {
                        totalBoxes += parseFloat(elements[i].value)||0;
                    }
                    continue;
                }
                if (/^products\[\d+\]\[conversions\]\[\d+\]\[[a-zA-Z_0-9]+\]$/.test(elements[i].name)) {
                    var name = elements[i].name.replace(/^products/, '').replace(/\]\[/g, '.').replace(/^\[|\]$/g, '').split('.');
                    var pnumber = name[0];
                    if (typeof data.products[pnumber] == 'undefined') {
                        data.products[pnumber] = {};
                    }
                    var inumber = name[2]
                    var key = name[3];
                    if (typeof data.products[pnumber].materials == 'undefined') {
                        data.products[pnumber].materials = [];
                    }
                    if (typeof data.products[pnumber].materials[inumber] == 'undefined') {
                        data.products[pnumber].materials[inumber] = {};
                    }
                    // elements[i].value = elements[i].value.replace(/[,]/g, '.');
                    if (key != 'title') {
                        data.products[pnumber].materials[inumber][key] = Math.abs(this.toFloat(elements[i].value, 1));
                    }
                    //if (elements[i].value != data.products[pnumber].materials[inumber][key] && key != 'title') {
                    //    elements[i].value = data.products[pnumber].materials[inumber][key];
                    // }
                }
            }
            for(var i=0; i < data.products.length; i++) {
                if (typeof data.products[i] == 'undefined') {
                    continue;
                }
                var cursum = 0;
                if (parseFloat(data.products[i].amount) && data.products[i].price) {
                    cursum += this.round(data.products[i].amount * data.products[i].price);
                }
                if (typeof data.products[i].materials != 'undefined') {
                    for(var j = 0; j < data.products[i].materials.length; j++) {
                        if (typeof data.products[i].materials[j] == 'undefined') {
                            continue;
                        }
                        if (parseInt(data.products[i].materials[j].id)) {
                            continue;
                        }
                        cursum += this.round(data.products[i].materials[j].price * (data.products[i].materials[j].percent/100) * data.products[i].amount)
                    }
                }
                totalSum += cursum;
                this.node(this.formId)['products[' + i + '][price]'].parentNode.parentNode.cells[0].innerHTML = cursum;
            }
            this.node('autosummSum').innerHTML = this.round(totalSum);
            this.node('autosummInAmount').innerHTML = this.round(totalAmount);
            this.node('autosummInAmountboxes').innerHTML = this.round(totalBoxes);
        };

        /**
         * ввод процентов
         */
        this.inputPercent = function(obj)
        {
            this.controlNumberValue(obj, 100);
            this.updateTotals();
        };

        /**
         * проверка дат
         * @param nodeObject obj
         * @return void
         */
        this.checkDate = function(str)
        {
            str = str.replace(/(\,|\/)/g, '.');
            return /^([0-2]\d|3[0-1])\.(0\d|1[0-2])\.20\d\d$/.test(str);
        };

        /**
         * отпрвить на каскад
         */
        this.toCascade = function()
        {
            if (!this.node(this.formId).onsubmit()) return;
            this.node(this.formId).action = linkPrefix + '/claim/conversion/cascade/cid/' + this.node('conversion_claim_id').value;
            this.node(this.formId)['accept'].value = 0;
            this.node(this.formId).submit();
        }

        /**
         * открыть заявку заново
         */
        this.toReopen = function()
        {
            this.node(this.formId).action = linkPrefix + '/claim/conversion/reopen/';
            this.node(this.formId).submit();
        }

        /**
         *управление добавленными товарами
         */
        this.showClaimGoodsFilter = function(obj)
        {
            if (obj.lang == 0) {
                this.node('filter-claim-goods-cnt').style.overflow = 'hidden';
                $('#filter-claim-goods-cnt').animate({height:'0px', opacity:0}, 200);
                obj.lang = 1;
                obj.src = '/img/system/fieldsShowF.png';
            }
            else {
                this.node('filter-claim-goods-cnt').style.overflow = 'visible';
                $('#filter-claim-goods-cnt').animate({height:'136px', opacity:1}, 200);
                obj.lang = 0;
                obj.src = '/img/system/fieldsCloseF.png';
            }
        };

        /**
         * создание фильтра переработки
         */
        this.createGoodsFilter = function()
        {
            //filter-claim-goods
            this.filter = new Filter({
                // получение списка значение для полей
                urlGetFullData:linkPrefix + '/claim/conversion/getproductfilterconfig',
                // получение маски для для полей
                urlGetMaskData:linkPrefix + '/claim/conversion/getproductmaskfilter',
                // filter type simple|excel default=simple
                filterType:'excel',
                //create in node||id
                conteinerId:'filter-claim-goods',
                // урл индикатора загрузки
                imgLoader:'/img/ld/ld3.gif'
            });
            this.filter.onBeforeCreate = function() {
                this.addPostData = conversion.getAllProductsIds();
                this.addPostData.products = serialize(this.addPostData.products);
            };
            this.filter.onAfterCreate = function() {
                conversion.applyProductFilter(this.getValue());
            };
            this.filter.onBeforeRebuild = function(){
                this.addPostData = conversion.getAllProductsIds();
                this.addPostData.products = serialize(this.addPostData.products);
            };
            this.filter.onAfterRebuild = function(){
                conversion.applyProductFilter(this.getValue());
            };
            this.filter.onChange = function() {
                conversion.applyProductFilter(this.getValue());
            };
            this.filter.create();
        };

        /**
         * применение фильтра
         */
        this.applyProductFilter = function(filter)
        {
            var data = {
                data     : serialize(filter),
                products : serialize(this.getAllProductsIds().products),
                perpage:0
            };
            $.ajax({
                url      : linkPrefix + '/claim/conversion/getproductfilterdata',
                cache    : false,
                type     : 'POST',
                dataType : 'json',
                data     : data,
                success  : function(data){
                    conversion.showHideProducts(data.result);
                }
            });
        };

        /**
         *
         */
        this.showHideProducts = function(data)
        {
            var products = this.getAllProductsIds(true).products;
            for(var i in products) {
                if (!parseInt(i)) continue;
                products[i] =  {number:products[i], display:0};
            }
            for(var i=0; i < data.length; i++) {
                products[data[i].id].display = 1;
            }
            var tmp = {};
            for(var i in products) {
                tmp[products[i].number] = (products[i].display ? '' : 'none');
            }
            var rows = document.getElementById("table_products").rows;
            for(var i=1; i< rows.length-1; i++) {
                var number = rows[i].getAttribute('pnumber');
                rows[i].style.display = tmp[number];
            }
        };

        /**
         * получение списка товаров для переработки
         */
        this.getAllProductsIds = function(rev)
        {
            var elements = this.node(this.formId).elements;
            var data = {products:{}};
            for(var i=0; i<elements.length; i++) {
                if (/^products\[\d+\]\[id\]$/.test(elements[i].name)) {
                    var number = elements[i].name.replace(/[^\d]/g, '');
                    if (!rev) {
                        data.products[number] = elements[i].value;
                    }
                    else {
                        data.products[elements[i].value] = number;
                    }
                }
            }
            return data;
        };

        /**
         * показать инфу по приходам сырья
         */
        this.showInfoSupplyByItem = function(data)
        {
            if (!this.showInfoSupplyFlag) {
                return;
            }
            this.overleyInfo = new Overley();
            this.overleyInfo.title = 'Информация по приходам товара  : ' + data.title + ' (ID:id)'.replace(/id/, data.id);
            this.overleyInfo.onAfterCreate = function() {

                var html = '<div id="cnt_item_info" style="padding:5px; width:1010px"></div>'
                + '<center><h3 style="margin:0;">Информация по приходам товара </h3></center>'
                + '<div id="cnt_item_in" style="background:transparent url(/img/ld/ld3.gif) no-repeat center; min-height:50px;" align="center"></div>';
                html += '<center style="padding-bottom:5px">';
                html += '<input type="button" value="Закрыть" style="width:100px" onclick="conversion.overleyInfo.close()" />';
                html += '</center>';
                this.getArea().innerHTML = html;

                this.grid = new Grid({
                    conteinerId : 'cnt_item_info',
                    imgError:'/img/system/error.16.png' ,
                    imgLoader:'/img/ld/ld3.gif',
                    perpage:10,
                    displayPaging:0,
                    useCorrectionScrollWidth:false
                });

                this.grid.head = {
                    id:      {caption:'ID', width:43},
                    title:   {caption: configTitle,    width:115, aliace:function(v, cnt, rowData){ return v;}, align:'left'},
                    prop:    {caption: configProp,     width:77, aliace:function(v, cnt, rowData){ return eval(configPropReturn);}},
                    color:   {caption: configColor,    width:100, aliace:function(v, cnt, rowData){ return eval(configColorReturn);}},
                    boxType: {caption: configBoxType, width:100, aliace:function(v, cnt, rowData){ return eval(configBoxTypeReturn);}},
                    volum:   {caption: configVolum,    width:100, aliace:function(v, cnt, rowData){ return eval(configVolumReturn);}},
                    height:  {caption: configHeight,   width:100, aliace:function(v, cnt, rowData){ 
                            // Отображение реального поставщика
                            showVendornameTitle(rowData, cnt);
                            return eval(configHeightReturn);
                        }
                    },
                    width:   {caption: configWidth,   width:100, aliace:function(v, cnt, rowData){ return eval(configWidthReturn);}},
                    depth:   {caption: configDepth, width:100, aliace:function(v, cnt, rowData){ return eval(configDepthReturn);}},
                    labelWeight:{caption: configLabelWeight, width:75, sort:1, aliace:function(v, cnt, rowData){ return eval(configLabelWeightReturn);}},
                    totalAmount : {caption:'Кол-во (штук) / общий вес', width:100, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                    description :  {caption:'Примечание', width:200, aliace:function(v, cnt, rowData){ return (v||'');}}
                };

                this.grid.create();
                this.grid.data = [data];
                this.grid.update();

                $.ajax({
                    url      : linkPrefix + '/claim/conversion/getsupplyinfo',
                    cache    : false,
                    data     : {itemId:data.id, clientId:conversion.node('client').value},
                    type     : 'POST',
                    dataType : 'html',
                    success  : function(data) {
                        $('#cnt_item_in').html(data);
                        $('#cnt_item_in').css({'background':''})
                        conversion.overleyInfo.toCenter();
                    }
                });
                this.toCenter();
            };
            this.overleyInfo.onBeforeClose = function(){
                this.grid.close();
            };
            this.overleyInfo.onAfterClose = function(){
                delete(conversion.overleyInfo);
            };
            this.overleyInfo.create().toCenter();
        };

        /**
         * инфа по товарам на складе АМД
         */
        this.showInfoIn = function(data, ajax)
        {
            this.overleyInfoIn = new Overley();
            this.overleyInfoIn.itemId = data.id;
            this.overleyInfoIn.title = 'Информация по приходам товара : ' + data.title + ' (ID:id)'.replace(/id/, data.id);
            this.overleyInfoIn.onAfterCreate = function() {
                var html = '<div id="cnt_item_info_amd" style="padding:5px; width:1010px"></div>'
                + '<div id="cnt_item_in_amd" style="background:transparent url(/img/ld/ld3.gif) no-repeat center; min-height:50px;" align="center"></div>';
                html += '<center style="padding-bottom:5px">';
                html += '<input type="button" value="Закрыть" style="width:100px" onclick="conversion.overleyInfoIn.close()" />';
                html += '</center>';
                this.getArea().innerHTML = html;

                // create information grid
                this.grid = new Grid({
                    conteinerId:'cnt_item_info_amd',
                    imgError:'/img/system/error.16.png' ,
                    imgLoader:'/img/ld/ld3.gif',
                    perpage:10,
                    displayPaging:0,
                    useCorrectionScrollWidth:false
                });
                this.grid.head = {
                    id:      {caption:'ID', width:43},
                    title:   {caption: configTitle,    width:115, aliace:function(v, cnt, rowData){ return '<span style="text-decoration:underline; cursor:pointer;">' + v + '</span>';}, align:'left'},
                    prop:    {caption: configProp,     width:77, aliace:function(v, cnt, rowData){ return eval(configPropReturn);}},
                    color:   {caption: configColor,    width:100, aliace:function(v, cnt, rowData){ return eval(configColorReturn);}},
                    boxType: {caption: configBoxType, width:80, aliace:function(v, cnt, rowData){ return eval(configBoxTypeReturn);}},
                    volum:   {caption: configVolum,    width:70, aliace:function(v, cnt, rowData){ return eval(configVolumReturn);}},
                    height:  {caption: configHeight,   width:75, aliace:function(v, cnt, rowData){
                            // Отображение реального поставщика
                            showVendornameTitle(rowData, cnt);
                            return eval(configHeightReturn);
                        }
                    },
                    width:   {caption: configWidth,   width:75, aliace:function(v, cnt, rowData){ return eval(configWidthReturn);}},
                    depth:   {caption: configDepth, width:75, aliace:function(v, cnt, rowData){ return eval(configDepthReturn);}},
                    labelWeight:{caption: configLabelWeight, width:80, sort:1, aliace:function(v, cnt, rowData){ return eval(configLabelWeightReturn);}},
                    inBoxes: {caption: 'Кол-во в упаковке / средний вес ', width:95, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                    amountWeight : {caption:'Кол-во (штук) / общий вес', width:95, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                    boxesRols :    {caption:'Кол-во упаковок / кол-во роликов', width:95, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                    description :  {caption:'Примечание', width:200, aliace:function(v, cnt, rowData){ return (v||'');}}
                };
                this.grid.create();
                this.grid.data = [data];
                this.grid.update();

                $.ajax({
                    url      : linkPrefix + '/claim/conversion/getinfoin',
                    cache    : false,
                    data     : {itemId : this.itemId},
                    type     : 'POST',
                    dataType : 'html',
                    success  : function(html) {
                       $('#cnt_item_in_amd').html(html);
                       $('#cnt_item_in_amd').css({'background':''})
                        conversion.overleyInfoIn.toCenter();
                    }
                });

                this.toCenter();
            };
            this.overleyInfoIn.onBeforeClose = function() {
                this.grid.close();
            };
            this.overleyInfoIn.onAfterClose = function() {
                delete(conversion.overleyInfoIn);
            };
            this.overleyInfoIn.create();
        };

        /**
         * отображение инфы о заблокировавшем юзвере
         */
        this.showBlockClaimInfo = function()
        {
            if (!this.userBlockInfo) return;
            if (this.errorInfoBlock) return;
            $('#block_info_html').remove();
            var html = '<div id="block_info_html" style="position:fixed; top:10px; right:10px; padding:15px; border:1px solid gray; background:rgba(0, 0, 0, 0.5); color:white; border-radius:15px;">'
            + '<h3>Заявка ' + this.userBlockInfo.params.task + ' заблокирована </h3>'
            + 'пользователь : ' + this.userBlockInfo.params.user + '<br>'
            + 'время блокировки : ' + this.userBlockInfo.params.time +' <br>'
            + '</div>';
            $(document.body).append(html);
        };

        /**
         * отображение инфы о заблокировавшем юзвере
         */
        this.showBlockClaimError = function()
        {
            if (!this.errorInfoBlock) {
                return;
            }
            $('#block_info_html').remove();
            var html = '<div id="block_info_html" style="text-align:center; font-weight:bold; position:fixed; top:100px; right:20px; padding:15px; border:1px solid gray; background:rgba(100, 100, 100, 0.5); color:red; border-radius:15px;">'
            + this.errorInfoBlock.msg
            + '</div>';
            $(document.body).append(html);
        };

        /**
         * показать предупреждение
         */
        this.showWarning = function(msg, title)
        {
            this.overleyWarning = new Overley();
            this.overleyWarning.msg = msg;
            this.overleyWarning.title = title;
            this.overleyWarning.onAfterCreate = function()
            {
                var html = '<center style="padding:30px">';
                html += this.msg;
                html += '</center>';
                html += '<center style="padding-bottom:5px">';
                html += '<input type="button" value="ОК" style="width:100px" onclick="conversion.overleyWarning.close()" />';
                html += '</center>';
                this.getArea().innerHTML = html;
            };
            this.overleyWarning.onAfterClose = function()
            {
                delete(conversion.overleyWarning);
            };
            this.overleyWarning.create().toCenter();
        };

        /**
         * изменение существуещего товара
         */
        this.changeProduct = function(node)
        {
            if (this.conversionType == 2) {
                this.showWarning('не возможно изменить товар<br>в режиме альтернативной переработки', 'Предупреждение');
                return;
            }

            this.overley4 = new Overley();
            this.overley4.pnumber = (node ? node.getAttribute('pnumber') : 0);
            this.overley4.data = (node ? this.uncompresData(node.lang) : {});
            this.overley4.eventType = (node ? 'edit' : 'add');
            this.overley4.enableType2 = this.enableType2;
            this.overley4.conversionType = this.conversionType;
            // создание контента окна
            this.overley4.onAfterCreate = function()
            {
                var html = '<div id="cnt">'
                    + '<div type="labels">'
                        + '<span type="products" active="1">Товар</span>'
                        + '<span type="incoms" active="0">Приходы от перка</span>'
                    + '</div>'
                    + '<div type="tabs">'
                        + '<div type="products" active="1">'
                        + this.loadProducts()
                        + '</div>'
                        + '<div type="incoms" active="0"></div>'
                    + '</div>'
                + '</div>'
                + '<div style="text-align:right; padding: 5px 5px 1px 5px;">';
                if (this.eventType == 'edit') {
                    html += '<input type="button" value="Удалить"  style="width:100px" onclick="conversion.overley4.eventType = \'drop\'; conversion.overley4.beforeApplyChangeProduct()" id="change-product-drop" />&nbsp;&nbsp;';
                    html += '<input type="button" value="Изменить" style="width:100px" onclick="conversion.overley4.eventType = \'edit\'; conversion.overley4.beforeApplyChangeProduct()" id="change-product-apply" />&nbsp;&nbsp;'
                }
                else {
                    html += '<input type="button" value="Добавить" style="width:100px" onclick="conversion.overley4.eventType = \'add\'; conversion.overley4.beforeApplyChangeProduct()" id="change-product-apply" />&nbsp;&nbsp;'
                }
                html += '<input type="button" value="Отмена"   style="width:100px" onclick="conversion.overley4.close()" />'
                + '</div>';
                $(this.getArea()).html(html);
                $('#cnt script').remove();
                $('#cnt table tr').each(function(i, tr){
                    if (!tr.id) {
                        return;
                    }
                    tr.data = $('#' +  tr.id)[0].data;
                });
                this.getArea().style.padding = '5px 5px 5px 5px';
                this.getCaption().innerHTML = (this.eventType == 'edit' ? 'Изменение товара ' + this.data.title : 'Добавление товара ');
                this.setCssEvent();
                this.ctrlTabs();
                this.getIncoms();
            };
            // получение списка приходов от пер-ка
            this.overley4.getIncoms = function()
            {
                var data = {
                    claimId : conversion.claimId,
                    pnumber : this.pnumber,
                    event   : this.eventType
                };
                $.ajax({
                    url      : linkPrefix + '/claim/conversion/getincompercentoff',
                    cache    : false,
                    type     : 'POST',
                    dataType : 'html',
                    data     : data,
                    success  : function(html)
                    {
                        $('#cnt>div[type="tabs"]>div[type="incoms"]').html(html);
                        conversion.overley4.widthCorrection().toCenter();
                    }
                });
            };
            // установка стилей и событий
            this.overley4.setCssEvent = function()
            {
                $('#cnt').css({minHeight:'100px', minWidth:'400px', position:'relative'});
                $('#cnt>div[type="labels"]').css({position:'absolute', textAlign:'left', padding:'0px 5px', overflow:'hidden', left:'0px', top:'0px', right:'0px', height:'24px'});
                $('#cnt>div[type="tabs"]').css({position:'absolute', textAlign:'left', padding:'0px 5px', overflow:'auto', left:'0px', top:'24px', right:'0px', bottom:'0px', border:'1px solid #cccccc'});
                $('#cnt>div[type="tabs"]>div').css({position:'absolute', textAlign:'left', padding:'5px', overflow:'auto', left:'0px', top:'0px', right:'0px', bottom:'0px'});
                $('#cnt>div[type="labels"]>span').css({margin:'0px 5px', padding:'0px 5px', border:'1px solid #cccccc', borderBottom:'none', display:'inline-block', height:'23px', lineHeight:'23px', cursor:'pointer'});

                var colspan = $('#cnt div[type="products"]>table')[0].rows[0].cells.length;
                $('#cnt div[type="products"] td[type="ctrl_material"]').attr('colspan', colspan);
                $('#cnt div[type="products"] td[type="ctrl_material"]>span').click(function(){
                    var action = this.getAttribute('action');
                    conversion.overley4[action](this.parentNode.parentNode);
                });
                $('#cnt div[type="products"]>table input[type="text"]').each(function(i, inp){
                    inp.disabled = false;
                });
                $('#cnt div[type="products"]>table img').each(function(i, img){
                    img.style.display = '';
                    if (!i) {
                        img.title = 'изменить товар'
                        img.src = '/img/system/edit.png';
                        img.onclick = function(){conversion.overley4.editProducts(this.parentNode.parentNode);}
                        return;
                    }
                    img.onclick = function(){conversion.overley4.dropItems(this.parentNode.parentNode);}
                });
                $('#cnt>div[type="labels"]>span').click(function(){
                    conversion.overley4.changeTabs(this)
                });
            };
            // управление видимостью вкладок
            this.overley4.ctrlTabs = function()
            {
                $('#cnt>div[type="labels"]>span[active="1"]').css({backgroundColor:'white', cursor:'default'});
                $('#cnt>div[type="labels"]>span[active="0"]').css({backgroundColor:'#eeeeee', cursor:'pointer'});
                $('#cnt>div[type="tabs"]>div[active="1"]').show();
                $('#cnt>div[type="tabs"]>div[active="0"]').hide();
            };
            // изменение видимости вкладок
            this.overley4.changeTabs = function(node)
            {
                $('#cnt *[active]').attr('active', '0');
                $('#cnt *[type="' + node.getAttribute('type') + '"]').attr('active', '1');
                this.ctrlTabs();
            };
            // получение хтмл изменяемого товара
            this.overley4.loadProducts = function()
            {
                var html = '<table class="claimtable tablesorter" width="1620" cellspacing="1" cellpadding="0" style="margin:0px 0px 7px 0px;">'
                + $('#table_products>thead')[0].outerHTML;
                html += '<tbody>';
                $('#table_products>tbody>tr[pnumber="' + this.pnumber + '"][type="data"]').each(function(i, node){
                    html += node.outerHTML;
                });
                if (this.pnumber) {
                    var matrialsCount = $('#table_products>tbody>tr[pnumber="' + this.pnumber + '"][forinsertmaterials]').attr('forinsertmaterials');
                    html += '<tr forinsertmaterials="{cc}" pnumber="{pn}"><td type="ctrl_material">'.replace(/\{pn\}/, this.pnumber).replace(/\{cc\}/, matrialsCount);
                    html += '<span action="addMaterial" style="cursor: pointer;">добавить сырье</span>';
                    html += '&nbsp;&nbsp;|&nbsp;&nbsp;';
                    html += '<span action="addMaterialClient" style="cursor: pointer;">добавить сырье переработчика</span>';
                    html += '</td></tr>';
                }
                html += '</tbody>';
                html += '</table>';
                return html;
            };
            // корректировка видимой области окна
            this.overley4.widthCorrection = function()
            {
                var width  = ($('#cnt div[type="products"]>table')[0].offsetWidth + 30);
                var height = $('#cnt div[type="products"]>table')[0].offsetHeight + 50;
                if ($('#cnt div[type="incoms"]>table').length) {
                    var height2 = $('#cnt div[type="incoms"]>table')[0].offsetHeight + 50;
                    height = (height > height2 ? height : height2);
                }
                var maxWidth = parseInt(this.getArea().style.maxWidth.replace(/[^\d]/g, '')) - 30;
                var maxHeight = parseInt(this.getArea().style.maxHeight.replace(/[^\d]/g, '')) - 130;
                //console.log('maxWidth:%s   maxHeight:%s', maxWidth, maxHeight)
                if (width > maxWidth) {
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    height = maxHeight
                }
                $('#cnt').css({width: width + 'px', height : height + 'px'});
                return this;
            };
            // очиста после закрытия
            this.overley4.onAfterClose = function()
            {
                delete(conversion.overley4);
            };
            // удаление сырья из товара
            this.overley4.dropItems = function(tr)
            {
                conversion.dropItems(tr);
            };
            // изменение самого товара
            this.overley4.editProducts = function()
            {
                conversion.addProducts();
            };
            // контроль изменений параметров товара
            this.overley4.changeParam = function()
            {
            };
            // добавление сырья со склада
            this.overley4.addMaterial = function(tr)
            {
                conversion.showMaterial(tr);
            };
            // добавление сырья пер-ка
            this.overley4.addMaterialClient = function(tr)
            {
                tr.lang = conversion.compresData(this.data);
                conversion.showMaterialClient(tr);
            };
            // проверить данные и применить изменения
            this.overley4.beforeApplyChangeProduct = function()
            {
                var pnumber = this.pnumber;
                // сбор данных
                var data = {
                    claimId    : conversion.claimId,
                    event     : this.eventType,
                    conversion : {
                        products : {
                            number : this.pnumber,
                            id     : $('#cnt div[type="products"] input[name="products[' + pnumber + '][id]"]').val(),
                            amount : $('#cnt div[type="products"] input[name="products[' + pnumber + '][amount]"]').val(),
                            boxes  : $('#cnt div[type="products"] input[name="products[' + pnumber + '][boxes]"]').val(),
                            price  : $('#cnt div[type="products"] input[name="products[' + pnumber + '][price]"]').val(),
                            type   : this.data.type,
                            items  : this.getConversionItems()
                        }
                    },
                    incoms     : this.getIncomsData()
                };
                if (this.eventType != 'drop') { // если не удаление
                    var errors = [];
                    var totalPercentUse = 0;
                    // провкрка параметров товара
                    if (conversion.round(data.conversion.products.amount, 9) <= 0) {
                        var error = 'Не верно указан вес товара';
                        errors.push(error);
                    }
                    if (conversion.round(data.conversion.products.boxes, 9) <= 0) {
                        var error = 'Не верно указано кол-во товара';
                        errors.push(error);
                    }
                    if (conversion.round(data.conversion.products.price, 9) <= 0) {
                        var error = 'Не верно указана стоимость переработки';
                        errors.push(error);
                    }
                    if (!Object.keys(data.conversion.products.items).length) {
                        var error = 'Отсутствует сырье';
                        errors.push(error);
                    }
                    else {
                    // провкрка параметров сырья товара
                        $.each(data.conversion.products.items, function(i, item){
                            totalPercentUse += (parseFloat(item.percent)||0);
                            if (!(parseFloat(item.percent)||0)) {
                                var error = 'Не корректный процент использования сырья №';
                                var n = 0, title = '';
                                $('#cnt div[type="products"] tr[itemnumber]').each(function(i, tr){
                                    if ($(tr).attr('itemnumber') == item.number) {
                                        n = i + 1;
                                        title = conversion.uncompresData(tr.data).title;
                                    }
                                })
                                error += (n + ' ' + title);
                                if (parseInt(item.id) > 0) {
                                    error += ' (ID:' + item.item_id + ')'
                                }
                                errors.push(error);
                            }
                        });
                        totalPercentUse = conversion.round(totalPercentUse, 9);
                        if (totalPercentUse != 100) {
                            var error = 'Сумма используемого сырья в процентах ' +  (totalPercentUse > 100 ? 'больше' : 'меньше') + ' 100% процентов ' + totalPercentUse;
                            errors.push(error);
                        }
                        // проверка параметров процентов потерь
                        $.each(data.incoms, function(claimId, claim){
                            $.each(claim.items, function(i, item){
                                if (!/^\-?\d+(\.\d+)?$/.test(item.p_off)) {
                                    var error = 'Не указано значение процента потерь в заявке №' + claimId + '  для сырья №', n = 0;
                                    var query = '#cnt div[type="incoms"]>table tr[type="percentoff"][claim="' + claimId + '"]';
                                    $(query).each(function(i, tr){
                                        if ($(tr).attr('inumber') == item.number) {
                                           n = i + 1;
                                        }
                                    });
                                    error += (n + ' ' + item.title);
                                    errors.push(error);
                                }
                            });
                        });
                    }
                    // проверка распределения товара по приходам
                    var totalAmount = 0, totalBoxes = 0;
                    $.each(data.incoms, function(claimId, claim){
                        if (!claim.product.amount) {
                            errors.push('Для заявки №' + claimId + ' не указан вес');
                        }
                        if (!claim.product.boxes) {
                            errors.push('Для заявки №' + claimId + ' не указано кол-во');
                        }
                        totalAmount += claim.product.amount;
                        totalBoxes  += claim.product.boxes;
                    });
                    var curTotalAmount = conversion.toFloat($('#cnt div[type="products"] input[name="products[' + this.pnumber + '][amount]"]').val());
                    var curTotalBoxes  = conversion.toFloat($('#cnt div[type="products"] input[name="products[' + this.pnumber + '][boxes]"]').val());
                    if (curTotalBoxes < totalBoxes) {
                        errors.push('Кол-во в переработке указано меньше чем сумма по приходам, мин = ' + totalBoxes);
                    }
                    if (curTotalAmount < totalAmount) {
                        errors.push('Вес в переработке указан меньше чем сумма по приходам, мин = ' + totalAmount);
                    }
                    // вывод ошибок
                    if (errors.length) {// если есть ошибки
                        var msg = '<div align="left" style="color:red;">- '
                        + errors.join('<br />- ')
                        + '</div>';
                        conversion.showWarning(msg, 'Ошибки');
                        return;
                    }
                }
                // отправка на сервер, проверка типа и возможности изменений
                $.ajax({
                    url      : linkPrefix + '/claim/conversion/getchanges',
                    cache    : false,
                    type     : 'POST',
                    dataType : 'json',
                    data     : data,
                    success  : function(data)
                    {
                        if (!data.error) {
                            conversion.overley4.showWarningSave(data, 'Список изменений');
                        }
                        else {
                            conversion.overley4.close();
                            if (conversion.overleyWarning){
                                conversion.overleyWarning.close();
                            }
                            conversion.showWarning(data.error, 'Ошибка!');
                        }
                    },
                    error : function(obj)
                    {
                        conversion.showWarning(obj.responseText, 'Ошибка!');
                    }
                });
            };
            // контроль изменений в приходах от пер-ка
            this.overley4.controlIncomeInputs = function(node)
            {
                conversion.controlNumberValue(node);
                var claim = node.name.replace(/[^\d]+/g, ' ').replace(/^\s+|\s+$/g, '').split(' ')[0];
                var type = (/amount\]$/.test(node.name) ? 'amount' : 'boxes');
                if (type == 'amount') { // редактируют вес
                    if (this.data.type == 1 && parseFloat(this.data.unitWeight)) { // шт товар
                        var boxes = Math.round(conversion.toFloat(node.value) / parseFloat(this.data.unitWeight));
                        var name = node.name.replace(/amount\]$/, 'boxes]');
                        console.log('name=%s boxes=%s', name, boxes);
                        $('#cnt div[type="incoms"] input[name="' + name + '"]').val(boxes);
                    }
                }
                else { // редактирут кол-во
                    if (this.data.type == 1 && parseFloat(this.data.unitWeight)) { // шт товар
                        var amount = Math.round(conversion.toFloat(node.value) * parseFloat(this.data.unitWeight));
                        var name = node.name.replace(/boxes\]$/, 'amount]');
                        console.log('name=%s amount=%s', name, amount);
                        $('#cnt div[type="incoms"] input[name="' + name + '"]').val(amount);
                    }
                }
                this.updateTotals();
            };
            // обновление итоговых данных
            this.overley4.updateTotals = function()
            {
                var totalAmount = 0, totalBoxes = 0;
                $('#cnt div[type="incoms"] tr[type="product"] input').each(function(i, node){
                    if (/amount\]$/.test(node.name)) {
                        totalAmount += conversion.toFloat(node.value);
                    }
                    else {
                        totalBoxes  += conversion.toFloat(node.value);
                    }
                });
                var curTotalAmount = conversion.toFloat($('#cnt div[type="products"] input[name="products[' + this.pnumber + '][amount]"]').val());
                var curTotalBoxes  = conversion.toFloat($('#cnt div[type="products"] input[name="products[' + this.pnumber + '][boxes]"]').val());
                if (curTotalAmount < totalAmount || curTotalBoxes < totalBoxes) {
                    $('#cnt div[type="products"] input[name="products[' + this.pnumber + '][amount]"]').val(totalAmount);
                    $('#cnt div[type="products"] input[name="products[' + this.pnumber + '][boxes]"]').val(totalBoxes);
                }
            };
            // получение новых параметров сырья
            this.overley4.getConversionItems = function()
            {
                var items = {};
                var pnumber = this.pnumber;
                var pid = $('#cnt div[type="products"] input[name="products[' + pnumber + '][id]"]').val();
                $('#cnt div[type="products"] tr[itemnumber]').each(function(i, tr){
                    var number = $(tr).attr('itemnumber');
                    var tmp = {
                        claim_id      : conversion.claimId,
                        product_id    : pid,
                        parent_number : pnumber,
                        number        : number,
                        item_id       : $(tr).find('input[name="products[' + pnumber + '][conversions][' + number + '][id]"]').val(),
                        title         : $(tr).find('input[name="products[' + pnumber + '][conversions][' + number + '][title]"]').val(),
                        price         : $(tr).find('input[name="products[' + pnumber + '][conversions][' + number + '][price]"]').val(),
                        percent       : $(tr).find('input[name="products[' + pnumber + '][conversions][' + number + '][percent]"]').val()
                    };
                    items[number] = tmp;
                });
                return items;
            };
            // получение данных по приходам от пер-ка
            this.overley4.getIncomsData = function()
            {
                var pnumber = this.pnumber;
                var check = new RegExp('^products\\[\\d+\\]\\[conversions\\]\\[\\d+\\]\\[percent\\]$');
                var claims = {};
                var productId = $('#cnt div[type="products"] input[name="products[' + pnumber + '][id]"]').val();
                $('#cnt div[type="incoms"]>table tr[type="claim"]').each(function(i, node){
                    claims[node.getAttribute('claim')] = {items:[]};
                });
                // нет заявок - нечего делить
                if (!Object.keys(claims).length) {
                    return claims;
                }
                // сбор текущих % потерь
                $('#cnt div[type="products"] input[type="text"]').each(function(i, node){
                    if (!check.test(node.name)) {
                        return;
                    }
                    var inumber = node.name.replace(/[^\d]+/g, ' ').replace(/^\s+|\s+$/g, '').split(' ')[1];
                    var p_use = node.value;
                    var ititle = conversion.uncompresData(node.parentNode.parentNode.data).title;
                    $.each(claims, function(claimId, claim) {
                        var name='income[' + claimId + '][products][' + pnumber + '][items][' + inumber + '][percentoff]';
                        var p_off = $('#cnt div[type="incoms"]>table input[name="' + name + '"]').val();
                        claim.items.push({
                            claim_id      : claimId,
                            parent_number : pnumber,
                            product_id    : productId,
                            number        : inumber,
                            p_use         : p_use,
                            title         : ititle,
                            p_off         : $('#cnt div[type="incoms"]>table input[name="' + name + '"]').val(),
                            item_id       : $('#cnt div[type="products"]>table input[name="products['+ pnumber + '][conversions][' + inumber + '][id]"]').val(),
                            price         : $('#cnt div[type="products"]>table input[name="products['+ pnumber + '][conversions][' + inumber + '][price]"]').val()
                        });
                    })
                });
                // добавим параметры веса и кол-ва
                $.each(claims, function(claimId, claim) {
                    var amount = $('#cnt input[name="income[' + claimId + '][products][' + pnumber + '][amount]"]').val();
                    amount     = (!isNaN(parseFloat(amount)) ? parseFloat(amount) : 0 );

                    var boxes  = $('#cnt input[name="income[' + claimId + '][products][' + pnumber + '][boxes]"]').val();
                    boxes      = (!isNaN(parseFloat(boxes)) ? parseFloat(boxes) : 0 );

                    claim.product = {
                        claim_id     : claimId,
                        amount       : amount,
                        boxes        : boxes,
                        pnumber      : pnumber,
                        product_id   : productId,
                        type         : conversion.overley4.data.type
                    };
                });
                return claims;
            };
            // актуализация процента потерь
            this.overley4.updateMaterialPercentOff = function()
            {
                var pnumber = this.pnumber;
                var claims = this.getIncomsData();

                $('#cnt div[type="incoms"] tr[type="percentoff"]').remove();

                $.each(claims, function(claimId, claim){
                    $.each(claim.items, function(i, item){
                        var html = '<tr claim="{claimId}" pnumber="{pnumber}" inumber="{inumber}" type="percentoff">'
                            + '<td width="30">&nbsp;</td>'
                            + '<td width="150">{ititle}</td>'
                            + '<td width="70" align="right">% потерь</td>'
                            + '<td><input type="text" oninput="conversion.overley4.controlPercentOff(this);" value="{p_off}" name="income[{claimId}][products][{pnumber}][items][{inumber}][percentoff]" placeholder="процент потерь, от -100% до 100%"></td>'
                            + '<td width="150" align="right">% использования</td>'
                            + '<td width="50" align="center">{p_use}%</td>'
                        + '</tr>';
                        html = html
                        .replace(/\{claimId\}/g, claimId)
                        .replace(/\{pnumber\}/g, pnumber)
                        .replace(/\{inumber\}/g, item.number)
                        .replace(/\{ititle\}/g,  item.title)
                        .replace(/\{p_off\}/g,   (item.p_off||''))
                        .replace(/\{p_use\}/g,   (item.p_use||''));
                        $(html).insertAfter('#cnt div[type="incoms"] tr[claim="' + claimId + '"]:last');
                    });
                });
            };
            //корректировка вводимых значений
            this.overley4.controlPercentOff = function(node)
            {
                node.value = node.value.replace(/\,/g, '.').replace(/[^\-0123456789\.]/g, '');
                if (node.value && /^\-?\.\d*?$/.test(node.value)) {
                    node.value = (/^\-/.test(node.value) ? '-' : '') + '0.' + node.value.replace(/[^\d]/g, '');
                    node.selectionStart = node.selectionStart + 1;
                    node.selectionEnd   = node.selectionEnd + 1;
                }
                var tmp = (!isNaN(parseFloat(node.value)) ? parseFloat(node.value) : 0);
                if (tmp < -100) {
                    node.value = -100;
                }
            };
            // показ списка изменений
            this.overley4.showWarningSave = function(data, title)
            {
                conversion.overleyWarning = new Overley();
                conversion.overleyWarning.msg = data;
                conversion.overleyWarning.title = title;
                conversion.overleyWarning.onAfterCreate = function()
                {
                    this.prepareMsg();
                    var html = '<div id="owarning" style="padding:10px; text-align: left; overflow: auto; min-width: 400px;">';
                    html += this.msg;
                    html += '</div>';
                    html += '<center style="padding:5px; text-align: right;">';
                    html += '<input type="button" value="Продолжить" style="width:100px" onclick="conversion.overley4.info();" />';
                    html += '<input type="button" value="Обновить" style="width:100px" onclick="conversion.overleyWarning.close(); conversion.overley4.beforeApplyChangeProduct()" />';
                    html += '<input type="button" value="Отмена" style="width:100px" onclick="conversion.overleyWarning.close()" />';
                    html += '</center>';
                    this.getArea().innerHTML = html;
                };
                conversion.overleyWarning.prepareMsg = function()
                {
                    var text = '';
                    $.each(this.msg, function(claimId, data){
                        text += '<div style="margin: 10px 0px; border:1px solid #efefef; font-size: 10pt;">';
                        text += '<div style="background-color: #efefef; padding:2px;">Заявка №' + claimId + '</div>';
                        $.each(data.msg, function(j, msg){
                            text += '<div style=" padding:2px; padding-left: 10px;">-' + msg + '</div>';
                        })
                        if (data.warning) {
                            text += '<div style=" padding:2px;padding-left: 10px; color:#eb8f00;">-С этой заявкой сейчас работает ' + data.warning.params.user + '<br>встречные изменения могут привести к нарушению данных<br>дождитесь оканчания редактирования заявки.</div>';
                        }
                        text += '</div>';
                    });
                    this.msg = text;
                };
                conversion.overleyWarning.onAfterClose = function()
                {
                    delete(conversion.overleyWarning);
                };
                conversion.overleyWarning.widthCorrection = function()
                {
                    var width  = ($('#owarning')[0].offsetWidth + 30);
                    var height = $('#owarning')[0].offsetHeight + 50;
                    var maxWidth = parseInt(this.getArea().style.maxWidth.replace(/[^\d]/g, '')) - 30;
                    var maxHeight = parseInt(this.getArea().style.maxHeight.replace(/[^\d]/g, '')) - 130;
                    if (width > maxWidth) {
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        height = maxHeight
                    }
                    $('#owarning').css({width: width + 'px', height : height + 'px'});
                    return this;
                };
                conversion.overleyWarning.create().widthCorrection().toCenter();
            };
            // сохранение изменений
            this.overley4.info = function()
            {
                if (conversion.overleyWarning) {
                    var html = '<center id="owarning" style="padding:30px 10px;"><h1>Идет сохранение<h1><img src="' + conversion.loaderImg + '" /></center>';
                    conversion.overleyWarning.getCaption().innerHTML = 'Сохранение';
                    conversion.overleyWarning.getArea().innerHTML = html;
                    conversion.overleyWarning.widthCorrection().toCenter();
                }
                var pnumber = this.pnumber;
                // сбор данных
                var data = {
                    claimId    : conversion.claimId,
                    event     : this.eventType,
                    conversion : {
                        products : {
                            number : this.pnumber,
                            id     : $('#cnt div[type="products"] input[name="products[' + pnumber + '][id]"]').val(),
                            amount : $('#cnt div[type="products"] input[name="products[' + pnumber + '][amount]"]').val(),
                            boxes  : $('#cnt div[type="products"] input[name="products[' + pnumber + '][boxes]"]').val(),
                            price  : $('#cnt div[type="products"] input[name="products[' + pnumber + '][price]"]').val(),
                            type         : conversion.overley4.data.type,
                            items  : this.getConversionItems()
                        }
                    },
                    incoms     : this.getIncomsData()
                };
                $.ajax({
                    url      : linkPrefix + '/claim/conversion/setchanges',
                    cache    : false,
                    type     : 'POST',
                    dataType : 'json',
                    data     : data,
                    success  : function(data)
                    {
                        if (!data.error) {
                            conversion.overley4.afetrSave(data);
                        }
                        else {
                            conversion.overley4.close();
                            if (conversion.overleyWarning){
                                conversion.overleyWarning.close();
                            }
                            conversion.showWarning(data.error, 'Ошибка!');
                        }
                    },
                    error : function(obj){
                        conversion.showWarning(obj.responseText, 'Ошибка!');
                    }
                });
            };
            // изменения на странице
            this.overley4.afetrSave = function(data)
            {
                if (data.event == 'drop') {
                    var query = '#table_products>tbody>tr[pnumber="' + this.pnumber + '"]';
                    conversion.overley4.close();
                    $(query).remove();
                    conversion.updateTotals();
                    conversion.overleyWarning.close();
                }
                else {
                    $.ajax({
                    url      : linkPrefix + '/claim/conversion/getproductstable',
                    cache    : false,
                    async    : false,
                    type     : 'POST',
                    dataType : 'html',
                    data     : {claimId : conversion.claimId},
                    success  : function(html)
                    {
                        conversion.overley4.close();
                        $('#products').html(html);
                        conversion.updateTotals();
                        conversion.overleyWarning.close();
                    }
                });
                }
            };
            this.overley4.create().toCenter().widthCorrection().toCenter();
        };
    }
)();

window.onbeforeunload = function() {
    window.unloadData = {};
    window.unloadData.cid = parseInt(conversion.node(conversion.formId)['claim[id]'].value);
}

window.onunload = function() {
    if (!conversion.saveForm && !conversion.onlyView && window.unloadData.cid) {
        $.ajax({
            url      : linkPrefix + '/claim/conversion/unblockclaim',
            cache    : false,
            data     : {claimId : window.unloadData.cid},
            type     : 'POST',
            dataType : 'html',
            async    : false,
            success  : function(data){}
        });
    }
}
