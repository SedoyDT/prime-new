var claim = new (function()
{
    this.productMeasureTypeHint = new ProductMeasureTypeHint();

    // список манагеров
    this.managerList      = [];
    // список переработчиков
    this.conversionClient = [];
    // ид формы заявки
    this.formId           = 'returnsupply-form';
    // индикатор загрузки
    this.loaderImg        = '/img/ld/ld3.gif';
    // подсветка ошибок
    this.errorColor       = '#FFC0CB';
    // флаг отправки данных
    this.saveForm         = false;
    // htfrwbz yf pfrhsnbt pfzdrb
    this.onunload         = false;
    // наличие секций обязательно
    this.sectionRequered  = false;
    //фильтр по номеру машины
    this.timeOut          = null;
    this.unloadRequired   = 1;

    /**
     *Содержит флаг сохраняем или отправляем заявку
     **/
    this.nextStatusAv = 0;

    /**
     * get element by id
     * @param string id
     * @return link to Node
     */
    this.el = function(id)
    {
        return document.getElementById(id);
    };

    /**
     * хранит текущий статус завяки
     * 1 - создание
     * 2 - диспетчер
     * 0 - любой другой
     * @var Boolean
     */
    this.carStatusFlag = true;


    /**
     * инициализация заявки
     */
    this.start = function(){
        $('#claim_date').datepicker({duration: 'fast', showAnim: 'fadeIn'});
        this.createGoodsFilter();
        $('#products').css({ width: document.body.clientWidth - 40 + 'px' });
        this.node(this.formId).onsubmit = function(){
            return claim.checkForm(this);
        };
        this.recountSumm();
        this.showBlockClaimInfo();

        this.dataContainer = new DataContainer();
        if (window.Dispatcher) {
            new Dispatcher({
                preset: 'claim',
                dataContainer: this.dataContainer,
                updateCarListActionUrl: '/claim/returnsupply/get-dispatcher-drivers/',
            });
        }

        if (window.ApproximateClaimWeight) {
            new ApproximateClaimWeight({
                preset: 'claim',
            });
        }

        if (window.DepotNominal) {
            this.depotNominal = new DepotNominal({
                preset: 'claim',
                eventBus: null,
            });
        }

        if (window.Dimensions) {
            this.dimensions = new Dimensions({
                preset: 'claim'
            });
        }

        if (typeof DepotIndex !== 'undefined') {
            this.depotIndex = new DepotIndex({
                claimId: this.getClaimId()
            });
        }
    };


    /**
     * Алиасы для грида
     */
    this.aliace = function(v, cnt, rowData)
    {
        let title = `
            <span style="text-decoration:underline; cursor:pointer;">
                ` + v + `
            </span>
        `;

        // Если есть Примечание отдела закупок, то при наличии прав -  показать иконку
        if (rowData.annotationIn) {
            let options = {
                htmlPatternName : 'iconAnnotationBrown',
                headerName      : 'annotationIn',
                annotation      : rowData.annotationIn,
                useInlineWrapper: 1
            };

            let iconAnnotationIn = depot_tooltip.init(options).getTooltip();

            if (iconAnnotationIn) {
                title += `<div class="text-align_right">` + iconAnnotationIn + `</div>`;
            }
        }

        return claim.productMeasureTypeHint.prependHint(rowData.type, title);
    };


    /**
     * создание текстового узла
     */
    this.crtxtnode = function(text)
    {
        return document.createTextNode(text);
    };

    /**
     * создание узла дом
     */
    this.crnode = function(el)
    {
        return document.createElement((el||'div'));
    };

    /**
    * преобразование строки во float  с точностью 5 знаков после запятой
    * @param string str
    * @return float
    */
    this.toFloat = function(str)
    {
        str = String(str).replace(/\,/, '.');
        str = parseFloat(str);
        if (isNaN(str)) return 0;
        return this.round(str);
    };

    /**
    * round number with precision 5
    * @param float number
    * @return float
    */
    this.round = function(number)
    {
        return Math.round(parseFloat(number)*100000)/100000;
    };

    /**
    * get element by id
    * @param string id
    * @return link to Node
    */
    this.node = function(id)
    {
        return document.getElementById(id);
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
     * uncompres data
     */
    this.uncompresData = function(str)
    {
        return eval('(' + str + ')');
    };

    /**
     * compres data
     */
    this.compresData = function(data)
    {
        var tmp = [];
        var tpl = '';
        var getType = function(obj){
            return obj.constructor.toString().toLowerCase().match(/(\w+)\(/)[1];
        };
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
    };

    /**
     * фильтр для манагеров
     * @param nodeObject obj
     * @return void
     */
    this.filterManager = function(obj)
    {
        var options = this.node(obj.lang).options;
        if (!this.managerList.length) {
            for(var i=0; i<options.length; i++) {
                this.managerList.push({id : options[i].value, text : options[i].text});
            }
        }
        options.length = 1;

        var val = obj.value.replace(/^\s+|\s+$/, '').toLowerCase();

        for(var i=1; i<this.managerList.length; i++) {
            if (this.managerList[i].text.toLowerCase().indexOf(val) == -1) continue;
            options[options.length]   = new Option(this.managerList[i].text, this.managerList[i].id);
        }
    };

    /**
     * филтр для переработчиков
     * @param nodeObject obj
     * @return void
     */
    this.filterConversionClient = function(obj)
    {
        var options = this.node(obj.lang).options;
        if (!this.conversionClient.length) {
            for(var i=0; i<options.length; i++) {
                this.conversionClient.push({id:options[i].value, text:options[i].text, wtime:options[i].getAttribute('lang')});
            }
        }

        var val = obj.value.toLowerCase();

        if (parseInt(this.node(this.formId)['claim[clientId]'].value) > 0) {
            var text = 'Применение фильтра прведет к смене клиента\r\nи сбросу всех блокировок по товару!\r\n\r\nПродолжить?';
            if (!confirm(text)){
                obj.value = '';
                return;
            }
        }

        options.length = 1;

        for(var i=1; i<this.conversionClient.length; i++) {
            if (this.conversionClient[i].text.toLowerCase().indexOf(val) == -1) continue;
            options[options.length] = new Option(this.conversionClient[i].text, this.conversionClient[i].id);
            options[options.length-1].setAttribute('lang', this.conversionClient[i].wtime);
        }
        this.el('claim-client-work-time').innerHTML = '<span style="font-size: 10pt; font-weight: bold;">Время работы : </span>' + this.node(obj.lang).options[0].lang;
        this.node(obj.lang).selectedIndex = 0;
        this.node(obj.lang).lastValue = this.node(obj.lang).options[0].value;
        this.node(obj.lang).onchange();
    };

    /**
     * изменение клиента
     */
    this.changeClient = function(obj)
    {
        if (parseInt(obj.lastValue) > 0) {
            var text = 'Применение фильтра прведет к смене клиента\r\nи сбросу всех блокировок по товару!\r\n\r\nПродолжить?';
            if (!confirm(text)){
                obj.value = obj.lastValue;
                return;
            }
        }
        obj.lastValue = obj.value;
        this.node('claim-client-work-time').innerHTML = '<span style="font-size: 10pt; font-weight: bold;">Время работы : </span>' + obj.options[obj.selectedIndex].getAttribute('lang');
        this.updateProducts();
    };

    /**
     * аякс запрос на данные по товару
     */
    this.updateProducts = function()
    {
        var data = {
            claimId:  this.node(this.formId)["claim[id]"].value,
            clientId: this.node(this.formId)["claim[clientId]"].value,
            clear: 1
        };
        $.ajax({
            url      : linkPrefix + '/claim/returnsupply/getproducts',
            cache    : false,
            data     : data,
            type     : 'POST',
            dataType : 'html',
            success  : function(data){claim.applyUpdateProducts(data);}
        });
        this.node('products').innerHTML = '<div align=center>Загрузка данных <img align="absmiddle" src="' + this.loaderImg + '"></div>';
    };

    /**
     * вставка данных по товарм полученным через аякс
     */
    this.applyUpdateProducts = function(data)
    {
        $(this.node('products')).html(data);
        this.filter.rebuildFilter();
    };

    /**
     * изменение машины
     */
    this.changeCar = function(obj)
    {
        if (obj.value == '' || obj.value == '0') {
            $('input[name="claim[tk]"]').prop('disabled', true);
        } else {
            $('input[name="claim[tk]"]').prop('disabled', false);
        }
        if (parseInt(obj.value)) {
            this.node('car_claim_tbody').style.display = '';
            var inps = this.node('car_claim_tbody').getElementsByTagName('input');
            for (var i=0; i<inps.length; i++) inps[i].disabled = false;
            var inps = this.node('car_claim_tbody').getElementsByTagName('select');
            for (var i=0; i<inps.length; i++) inps[i].disabled = false;
        }
        else {
            this.node('car_claim_tbody').style.display = 'none';
            var inps = this.node('car_claim_tbody').getElementsByTagName('input');
            for (var i=0; i<inps.length; i++) inps[i].disabled = true;
            var inps = this.node('car_claim_tbody').getElementsByTagName('select');
            for (var i=0; i<inps.length; i++) inps[i].disabled = true;
        }
    };

    /* products */

    /**
     * получение списка добавленных товаров для возврата
     */
    this.findAddedMaterial = function()
    {
        var data = [];
        var ids = '|';
        var p = null;
        var rows = this.node('table_products').rows;
        for(var i=0; i<rows.length; i++) {
            p = rows[i].getAttribute('product');
            if (!p) continue;
            if (ids.indexOf(p + '|') != -1) continue;
            ids += (p + '|');
            data.push({id : p});
        }
        return data;
    };

    /**
     * показать подробную инфу о товаре на складе клиента
     */
    this.showDetailedFormProducts = function(data, ajax)
    {
        if (ajax) {
            $.ajax({
                url      : linkPrefix + '/claim/returnsupply/getfullblockproduct',
                cache    : false,
                data     : {itemId:data, claimId:this.node(this.formId)['claim[id]'].value, clientId:this.node(this.formId)['claim[clientId]'].value},
                type     : 'POST',
                dataType : 'json',
                success  : function(data) {
                    claim.showDetailedFormProducts(data.product);
                }
            });
            return;
        }

        this.overley2 = new overley();
        this.overley2.backgroundColor = 'rgba(255,255,255, 0.4)';
        this.overley2.onAfterCreate = function(){
            this.tmpdata = {};
            claim.empty(this.blockId + '_block');

            var wnd = this.crnode();
            wnd.className = 'filter-wnd';
            wnd.id = this.blockId + '_cnt';
            wnd.style.display = 'inline-block';
            wnd.style.position = 'relative';
            wnd.style.border = '1px solid gray';
            claim.node(this.blockId + '_block').appendChild(wnd);

            var area = this.crnode();
            area.style.display = 'inline-block';
            area.style.width = 'auto';
            area.style.height = 'auto';
            area.style.padding = '5px';
            wnd.appendChild(area);

            // create wnd caption
            var wndcap = this.crnode();
            wndcap.className = 'filter-wnd-caption';
            wndcap.appendChild(claim.crtxtnode('Расширенная информация по товару : ' + data.title + ' (ID:id)'.replace(/id/, data.id)));
            wnd.appendChild(wndcap);

            // create wnd caption close button
            var wndcapbt = this.crnode();
            wndcapbt.className = 'filter-wnd-caption-close-button';
            wndcapbt.title = 'закрыть диалог';
            wnd.appendChild(wndcapbt);
            wndcapbt.onclick = function(){
                claim.overley2.close();
            };

            // create info;
            var cntgrid = this.crnode();
            cntgrid.id = this.blockId + '_grid';
            cntgrid.style.width = '800px';
            cntgrid.align = 'left';
            area.appendChild(cntgrid);

            this.grid = new Grid({
                conteinerId:cntgrid.id,
                imgError:'/img/system/error.16.png' ,
                imgLoader:'/img/ld/ld3.gif',
                perpage:10,
				displayPaging:0
            });

            this.grid.head = {
                id:      {caption:'ID', width:43},
                title:   {caption: configTitle,   width:120, aliace:claim.aliace, align:'left'},
                prop:    {caption: configProp,    width:80,  aliace:function(v, cnt, rowData){ return eval(configPropReturn);}},
                color:   {caption: configColor,   width:100, aliace:function(v, cnt, rowData){ return eval(configColorReturn);}},
                boxType: {caption: configBoxType, width:80,  aliace:function(v, cnt, rowData){ return eval(configBoxTypeReturn);}},
                volum:   {caption: configVolum,   width:70,  aliace:function(v, cnt, rowData){ return eval(configVolumReturn);}},
                height:  {caption: configHeight,  width:75,  aliace:function(v, cnt, rowData){
                        // Отображение реального поставщика
                        showVendornameTitle(rowData, cnt);
                        return eval(configHeightReturn);
                    }
                },
                width:   {caption: configWidth,   width:75, aliace:function(v, cnt, rowData){ return eval(configWidthReturn);}},
                depth:   {caption: configDepth, width:75, aliace:function(v, cnt, rowData){ return eval(configDepthReturn);}},
                labelWeight:  {caption: configLabelWeight, width:75, aliace:function(v, cnt, rowData){ return eval(configLabelWeightReturn);}},
                // amountWeight:{caption:'Кол-во (штук) / общий вес', width:100, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                description:{caption:'Примечание', width:200, aliace:function(v, cnt, rowData){ return (v||'');}}
            };

            this.grid.create();
			this.grid.data = [data];
			this.grid.update();

            var cntinfo = this.crnode();
            cntinfo.appendChild(claim.crtxtnode('Информация по поставкам сырья '));
            cntinfo.style.paddingTop = '10px';
            cntinfo.style.textAlign = 'left';
            var all = this.crnode('label');
            $(all).css({'float':'right', 'margin-right':'20px'});
            all.appendChild(claim.crtxtnode('забрать все : '));
            var ch =  this.crnode('input');
            ch.type = 'checkbox';
            ch.id = this.blockId + '_get_all';
            ch.style.verticalAlign = 'middle';
            ch.disabled = (claim.perm.products.edit < 4);
            ch.onchange = function(){
                claim.overley2.getAll();
            };
            all.appendChild(ch);

            //Добавление в таблицу значения кратности
            if (data.type == 2 && data.parity > 0) {
                var parity = this.crnode('label');
                $(parity).css({'float':'right', 'margin-right':'50px'});
                $(parity).attr({'id':'parity'});
                parity.appendChild(claim.crtxtnode('Коэффициент кратности : ' + data.parity));
                cntinfo.appendChild(parity);
            }
            cntinfo.appendChild(all);
            area.appendChild(cntinfo);

            var cntinfo = this.crnode();
            cntinfo.id = this.blockId + '_info';
            cntinfo.style.minHeight = '30px';
            cntinfo.style.paddingTop = '10px';
            cntinfo.align = 'left';
            area.appendChild(cntinfo);

            this.grid2 = new Grid({
                urlGetData  : linkPrefix + '/claim/returnsupply/getproductinfo',
                conteinerId : this.blockId + '_info',
                imgError    : '/img/system/error.16.png' ,
                imgLoader   : '/img/ld/ld3.gif',
                perpage     : 15,
                sortColumn  : 'claim_id'
            });

            this.grid2.head = {
                task:    {caption:'Заявка',             width:125},
                date:    {caption:'Дата', width:75},
                price:   {caption:'Цена',               width:75, aliace:function(v, cnt, rowData){ return (v||'');}},
                averege: {caption:'Средний вес',        width:100, aliace:function(v, cnt, rowData){ return (v||'');}},
                weight:  {caption:'Вес (поставка)',     width:100, aliace:function(v, cnt, rowData){ return (v||'');}},
                boxes:   {caption:'Штук (поставка)',    width:100, aliace:function(v, cnt, rowData){ return (v||'');}},
                avalible:{caption:'Вес (доступно)',     width:100, aliace:function(v, cnt, rowData){ return (v||'');}},
                placing: {caption:'Ячейка (склад АМД)', width:100},
                ret_w:   {caption:'Вес (возврат)',      width:120, aliace:function(v, cnt, rowData){
                        var readonly = claim.perm.products.edit < 4 ? 'readonly' : '';
                        var val = claim.round(claim.overley2.tmpdata[rowData.detailed_clients_id].new_block_weight);
                        return '<input oninput="claim.overley2.updateCelldata(this, \'ret_w\')" style="text-align:left; width:95%" type="text" value="' + val + '" ' + readonly + '>';
                    }
                },
                ret_b:   {caption:'Штук (возврат)',     width:120, aliace:function(v, cnt, rowData){
                        var val = claim.round(claim.overley2.tmpdata[rowData.detailed_clients_id].new_block_boxes);
                        var readonly = claim.perm.products.edit < 4 ? 'readonly' : '';
                        return '<input oninput="claim.overley2.updateCelldata(this, \'ret_b\')" style="text-align:left; width:95%" type="text" value="' + val + '" ' + readonly + '>';
                    }
                },
                save:    {caption:' ',                  width:50,  aliace:function(v, cnt, rowData){ return '<input disabled lang="save" type="button" style="width:40px; border:none; background:transparent url(/img/system/reserve.16.png) no-repeat center center">';}},
                clear:   {caption:' ',                  width:50,  aliace:function(v, cnt, rowData){ return '<input lang="clear" type="button" style="width:40px; border:none; background:transparent url(/img/system/clear.16.png) no-repeat center center">';}}
            };

            if (claim.perm.products.edit < 4) {
                delete(this.grid2.head.info);
                delete(this.grid2.head.clear);
            }
            if (claim.perm.products.price < 2) {
                delete(this.grid2.head.price);
            }
            this.grid2.addPostData = {
                itemid : data.id,
                clientid : parseInt(claim.node(claim.formId)['claim[clientId]'].value),
                claim_id : parseInt(claim.node(claim.formId)['claim[id]'].value)
            };
            this.grid2.onBeforeUpdate = function(){
                claim.overley2.cntToCenter();
                var all = claim.node(claim.overley2.blockId + '_get_all').checked;
                //console.log(this.data);
                for (var i=0; i < this.data.length; i++) {
                    if (typeof claim.overley2.tmpdata[this.data[i].detailed_clients_id] == 'undefined') {
                        var oo = {
                            detailed_id         : this.data[i].depot_detailed_id,
                            detailed_clients_id : this.data[i].detailed_clients_id,
                            old_block_weight : this.data[i].ret_w,
                            old_block_boxes  : this.data[i].ret_b,
                            new_block_weight : !all ? this.data[i].ret_w : claim.round(claim.round(this.data[i].ret_w) + this.data[i].avalible),
                            new_block_boxes  : !all ? this.data[i].ret_b : claim.round((claim.round(this.data[i].ret_w) + this.data[i].avalible)/this.data[i].averege),
                            avalible_weight  : this.data[i].avalible,
                            averege          : this.data[i].averege,
                            returnsupply_id  : this.data[i].returnsupply_id,
                            task_id          : this.data[i].task,
                            placing          : this.data[i].placing,
                            allboxes         : this.data[i].boxes,
                            item_type        : this.data[i].itemType,
                            parity           : this.data[i].parity
                        };
                        claim.overley2.tmpdata[this.data[i].detailed_clients_id] = oo;
                    }
                    else {
                        claim.overley2.tmpdata[this.data[i].detailed_clients_id].avalible_weight  = this.data[i].avalible;
                        claim.overley2.tmpdata[this.data[i].detailed_clients_id].old_block_weight = this.data[i].ret_w;
                        claim.overley2.tmpdata[this.data[i].detailed_clients_id].old_block_boxes  = this.data[i].ret_b;
                    }
                }
            };
            this.grid2.onClick = function(dataRowIndex, dataColIndex, node){
                if (dataColIndex == 'clear' && node.lang == 'clear') {
                    var obj = node.parentNode.parentNode.parentNode.cells[node.parentNode.parentNode.cellIndex - 2].getElementsByTagName('input').item(0);
                    obj.value = 0;
                    claim.overley2.updateCelldata(obj, 'ret_b');
                }
                if (dataColIndex == 'save' && node.lang == 'save') {
                    var data = {
                        data         : {'0':claim.overley2.tmpdata[this.data[dataRowIndex].detailed_clients_id]},
                        afterClose   : false,
                        all          : false,
                        closeOverley : 0
                    };
                    claim.saveTempBlockData(data, true);
                }
            };
            this.grid2.onAfterUpdate = function(){
                claim.overley2.cntToCenter();
                claim.overley2.controllButtons();
            };
            this.grid2.create();
            var width = cntinfo.clientWidth + 18;
            cntinfo.style.width = width + 'px';
            cntgrid.style.width = width + 'px';
            this.grid.setWidthControll();
            this.grid2.setWidthControll();
            this.grid2.update({});

            var cntinfo = this.crnode();
            cntinfo.style.paddingTop = '10px';
            cntinfo.style.textAlign = 'right';
            var btok = this.crnode('input');
            btok.type = 'button';
            btok.disabled = true;
            btok.id = this.blockId + '_bt_ok';
            btok.value = 'Принять';
            btok.style.width = '125px';
            btok.onclick = function(){
                claim.saveTempBlockData({
                    data         : claim.overley2.tmpdata,
                    afterClose   : true,
                    all          : claim.node(claim.overley2.blockId + '_get_all').checked,
                    closeOverley : 1
                }, true);
            };
            cntinfo.appendChild(btok);
            var btcn = this.crnode('input');
            btcn.type = 'button';
            btcn.value = 'Отмена';
            btcn.style.width = '125px';
            btcn.onclick = function(){
                claim.overley2.close();
            };
            cntinfo.appendChild(btcn);
            area.appendChild(cntinfo);

            this.cntToCenter();
        };
        this.overley2.updateCelldata = function(obj, type) {
            var gridDataIndex = obj.parentNode.dataRowIndex;
            var index = this.grid2.data[gridDataIndex].detailed_clients_id;
            if (type == 'ret_w') {
                var weight = Math.abs(claim.toFloat(obj.value));
                var averege = this.grid2.data[gridDataIndex].averege;
                if (this.tmpdata[index].avalible_weight < weight) {
                    weight = claim.toFloat(this.tmpdata[index].avalible_weight);
                }
                if (/^\d+(\.|\,)$/.test(obj.value)) obj.value = weight + '.';
                else obj.value = weight;
                this.tmpdata[index].new_block_weight = weight;
                var boxes = Math.ceil(weight/averege);
                if (boxes > this.tmpdata[index].allboxes) boxes = this.tmpdata[index].allboxes;
                this.tmpdata[index].new_block_boxes = claim.round(boxes);
                obj.parentNode.parentNode.parentNode.cells[obj.parentNode.parentNode.cellIndex + 1].getElementsByTagName('input').item(0).value = claim.round(boxes);
            }
            else {
                var boxes = Math.abs(claim.toFloat(obj.value));
                if (claim.splitgoods === 0 && this.tmpdata[index].item_type == 1) {
                    boxes = Math.round(boxes);
                }
                if (boxes > this.tmpdata[index].allboxes) {
                    boxes = this.tmpdata[index].allboxes;
                }
                if (boxes < 0.00001) {
                    boxes = 0;
                    this.tmpdata[index].new_block_weight = 0;
                    obj.parentNode.parentNode.parentNode.cells[obj.parentNode.parentNode.cellIndex - 1].getElementsByTagName('input').item(0).value = 0;
                }
                if (/^\d+(\.|\,)$/.test(obj.value)) obj.value = boxes + '.';
                else obj.value = boxes;
                this.tmpdata[index].new_block_boxes = boxes;
            }
            this.controllButtons();
        };
        this.overley2.controllButtons = function(){
            if (claim.node(this.blockId + '_info').firstChild.firstChild.nextSibling.firstChild.nodeName.toLowerCase() != 'table') {
                return;
            }
            var rows = claim.node(this.blockId + '_info').firstChild.firstChild.nextSibling.firstChild.rows;
            var background =  'transparent url(/img/system/save.16.png) no-repeat center center';
            var title = '';
            $('#parity').css({"color": 'red'});
            if (claim.perm.products.edit == 4) {
                for(var i=0; i < rows.length; i++){
                    var dindex = this.grid2.data[rows[i].dataRowIndex].detailed_clients_id;
                    var a = this.tmpdata[dindex].parity&this.tmpdata[dindex].new_block_boxes;
                    var b = this.tmpdata[dindex].new_block_boxes&this.tmpdata[dindex].parity;
                    background = 'transparent url(/img/system/reserve.16.png) no-repeat center center';
                    title = 'товар заблокирован';
                    rows[i].cells[rows[i].cells.length - 2].getElementsByTagName('input').item(0).disabled = true;
                    if (this.tmpdata[dindex].item_type == 1) {
                        if (Math.abs(this.tmpdata[dindex].old_block_boxes - this.tmpdata[dindex].new_block_boxes) > 0.00001
                            || Math.abs(this.tmpdata[dindex].old_block_weight - this.tmpdata[dindex].new_block_weight) > 0.00001) {
                            background = 'transparent url(/img/system/save.16.png) no-repeat center center';
                            title = 'изменения еще не сохранены';
                            rows[i].cells[rows[i].cells.length - 2].getElementsByTagName('input').item(0).disabled = false;
                        }
                    } else {
                        if ((Math.abs(this.tmpdata[dindex].old_block_boxes - this.tmpdata[dindex].new_block_boxes) > 0.00001
                            || Math.abs(this.tmpdata[dindex].old_block_weight - this.tmpdata[dindex].new_block_weight) > 0.00001)
                            && !(this.tmpdata[dindex].new_block_boxes%this.tmpdata[dindex].parity)) {
                            background = 'transparent url(/img/system/save.16.png) no-repeat center center';
                            title = 'изменения еще не сохранены';
                            rows[i].cells[rows[i].cells.length - 2].getElementsByTagName('input').item(0).disabled = false;
                            $('#parity').css({"color": '#313131'});
                        }else{
                            title = 'товар заблокирован количество должно быть кратно коэффициенту кратности';
                        }
                    }
                    rows[i].cells[rows[i].cells.length - 2].getElementsByTagName('input').item(0).style.background = background;
                    rows[i].cells[rows[i].cells.length - 2].getElementsByTagName('input').item(0).title = title;
                }
            }
            var disabled = true;
            var checked = claim.node(this.blockId + '_get_all').checked;
            for (var i in this.tmpdata){
                if (this.tmpdata[i].item_type == 1) {
                    if (Math.abs(this.tmpdata[i].old_block_boxes - this.tmpdata[i].new_block_boxes) > 0.00001
                        || Math.abs(this.tmpdata[i].old_block_weight - this.tmpdata[i].new_block_weight) > 0.00001) {
                        disabled = false;
                    }
                } else {
                    if ((Math.abs(this.tmpdata[i].old_block_boxes - this.tmpdata[i].new_block_boxes) > 0.00001
                        || Math.abs(this.tmpdata[i].old_block_weight - this.tmpdata[i].new_block_weight) > 0.00001)
                        && !(this.tmpdata[i].new_block_boxes%this.tmpdata[i].parity)) {
                        disabled = false;
                    }
                }
                if (Math.abs(this.tmpdata[i].old_block_weight + this.tmpdata[i].avalible_weight - this.tmpdata[i].new_block_weight) > 0.00001) {
                    checked = false;
                }
            }
            claim.node(this.blockId + '_bt_ok').disabled = disabled;
            claim.node(this.blockId + '_get_all').checked = checked;
        };
        this.overley2.getAll = function(){
            for (var i in this.tmpdata) {
                this.tmpdata[i].new_block_weight = claim.round(claim.round(this.tmpdata[i].avalible_weight));
                this.tmpdata[i].new_block_boxes  = Math.ceil(this.tmpdata[i].new_block_weight/this.tmpdata[i].averege);
                if (this.tmpdata[i].new_block_boxes > this.tmpdata[i].allboxes) this.tmpdata[i].new_block_boxes = this.tmpdata[i].allboxes;
            }
            var rows = claim.node(this.blockId + '_info').firstChild.firstChild.nextSibling.firstChild.rows||[];
            for(var i=0; i < rows.length; i++){
                var dindex = this.grid2.data[rows[i].dataRowIndex].detailed_clients_id;
                rows[i].cells[rows[i].cells.length - 3].getElementsByTagName('input').item(0).value = this.tmpdata[dindex].new_block_boxes;
                rows[i].cells[rows[i].cells.length - 4].getElementsByTagName('input').item(0).value = this.tmpdata[dindex].new_block_weight;
            }
            this.controllButtons();
        };
        this.overley2.onBeforeClose = function(){
            //;
        };
        this.overley2.onAfterClose = function(){
            delete(claim.overley2);
        };
        this.overley2.create();
    };


    this.validateBlockData = function (data)
    {
        for (const row of Object.values(data)) {
            const boxes  = +row.new_block_boxes;
            const weight = +row.new_block_weight;

            if (boxes && !weight || !boxes && weight) {
                return false;
            }
        }

        return true;
    }


    /**
     * сохранение временной блокировки
     */
    this.saveTempBlockData = function(data, ajax, ignoreErrors)
    {
        //console.log(data);
        if (ajax) {
            if (!this.validateBlockData(data.data)) {
                alert('Форма содержит ошибки'); return;
            }

            this.node(this.overley2.blockId + '_block').style.display = 'none';
            if (this.overley && this.node(this.overley.blockId + '_block')) {
                this.node(this.overley.blockId + '_block').style.display = 'none';
            }
            if (!this.overley3){
                this.overley3 = new overley();
                this.overley3.backgroundColor = 'rgba(255,255,255, 0.4)';
                this.overley3.onAfterCreate = function() {
                    claim.empty(this.blockId + '_block');

                    var wnd = this.crnode();
                    wnd.className = 'filter-wnd';
                    wnd.id = this.blockId + '_cnt';
                    wnd.style.display = 'inline-block';
                    wnd.style.position = 'relative';
                    wnd.style.border = '1px solid gray';
                    claim.node(this.blockId + '_block').appendChild(wnd);

                    var area = this.crnode();
                    area.style.display = 'inline-block';
                    area.id = this.blockId + '_area';
                    area.style.width = 'auto';
                    area.style.height = 'auto';
                    area.style.padding = '5px';
                    wnd.appendChild(area);

                    // create wnd caption
                    var wndcap = this.crnode();
                    wndcap.className = 'filter-wnd-caption';
                    wndcap.appendChild(claim.crtxtnode('Сохранение блокировки'));
                    wnd.appendChild(wndcap);

                    // create wnd caption close button
                    var wndcapbt = this.crnode();
                    wndcapbt.className = 'filter-wnd-caption-close-button';
                    wndcapbt.id = this.blockId + '_cls_end_bt';
                    wndcapbt.title = 'закрыть диалог';
                    wnd.appendChild(wndcapbt);
                    wndcapbt.onclick = function(){
                        claim.overley3.close();
                    };
                    this.cntToCenter();
                };
                this.overley3.onBeforeClose = function(param){
                    if (param) {
                        if (param.x) {
                            claim.saveTempBlockData(this.tmpdata, true, true);
                            return false;
                        }
                        else {
                            claim.node(claim.overley2.blockId + '_block').style.display = '';
                            if (claim.overley && claim.node(claim.overley.blockId + '_block')) {
                                claim.node(claim.overley.blockId + '_block').style.display = '';
                            }
                            claim.overley2.grid2.update();
                        }
                    }
                    else {
                        claim.node(claim.overley2.blockId + '_block').style.display = '';
                        if (claim.overley && claim.node(claim.overley.blockId + '_block')) {
                            claim.node(claim.overley.blockId + '_block').style.display = '';
                        }
                    }
                    return void(1);
                };
                this.overley3.onAfterClose = function(){
                    delete(claim.overley3);
                };
                this.overley3.create();
            }

            this.node(this.overley3.blockId + '_cls_end_bt').style.display = 'none';
            this.node(this.overley3.blockId + '_area').innerHTML = '<div align=center style="width:400px; pdding:30px 10px;"><img align="absmiddle" src="' + this.loaderImg + '"></div>';
            this.overley3.cntToCenter();
            var tmp = this.overley2.grid2.addPostData;
            data.ignoreErrors = Boolean(ignoreErrors);
            data.claimId  = tmp.claim_id;
            data.itemId   = tmp.itemid;
            data.clientId = tmp.clientid;
            data.number   = this.getProductNumber(tmp.itemid);
            $.ajax({
                url      : linkPrefix + '/claim/returnsupply/savetempblock',
                cache    : false,
                data     : {data : serialize(data)},
                type     : 'POST',
                dataType : 'json',
                success  : function(data){claim.saveTempBlockData(data);}
            });
        }
        else {
            var error = false;
            this.node(this.overley3.blockId + '_cls_end_bt').style.display = 'block';
            for(var i in data.data) {
                if (data.data[i].error) {
                    error = true;
                    break;
                }
            }
            if (error) {
                this.empty(this.overley3.blockId + '_area');
                var area = this.node(this.overley3.blockId + '_area');
                var str = '<div style="widrth:450px;" align=left>Изменения в блокировках подробно</div><div style="padding-top:10px;">{info}</div>'
                +'<div align="right" style="padding-top:10px;"><input onclick="claim.overley3.close({x:1});" type="button" value="Приняить" style="width:125px"><input onclick="claim.overley3.close({x:0});" type="button" value="Отмена" style="width:125px"></div>';
                var info = '';
                for(var i in data.data) {
                    if (data.data[i].error) {
                        info += '<div style="color:red"> - в ячейке {placing} ({task}) теперь доступно для блокировки {avalible}, требуется {need}</div>'
                        .replace(/\{placing\}/, data.data[i].placing)
                        .replace(/\{task\}/, data.data[i].task_id)
                        .replace(/\{avalible\}/, data.data[i].avalible_weight + data.data[i].old_block_boxes)
                        .replace(/\{need\}/, data.data[i].new_block_weight);
                    }
                    else {
                        info += '<div style="color:green"> - в ячейке {placing} ({task}) требуеемое кол-во доступно для блокировки</div>'
                        .replace(/\{placing\}/, data.data[i].placing)
                        .replace(/\{task\}/, data.data[i].task_id);
                    }
                }
                area.innerHTML = str.replace('{info}', info);
                this.overley3.tmpdata = data;
            }
            else {
                this.overley3.close();
                if (parseInt(data.closeOverley)) {
                    this.overley2.close();
                }
                else {
                    for(var i in data.data) {
                        delete(claim.overley2.tmpdata[data.data[i].detailed_clients_id]);
                    }
                    this.overley2.grid2.update();
                }
                this.updateClaimProduct({
                    claimId  : data.claimId,
                    itemId   : data.itemId,
                    clientId : data.clientId
                }, true);
            }
        }
    };

    /**
     * получить номер для товара
     */
    this.getProductNumber = function(pid, rowtype)
    {
        var rows = this.node('table_products').rows;
        var number = 0;
        var srowtype = rowtype ? rowtype : 'product';
        for(var i=1; i < rows.length-1; i++) {
            if (rows[i].getAttribute('rowtype') == srowtype && rows[i].getAttribute('product') == pid) {
                return rowtype ? i : rows[i].getAttribute('pnumber');
            }
            if (parseInt(rows[i].getAttribute('pnumber')) && number < parseInt(rows[i].getAttribute('pnumber'))) {
                number = parseInt(rows[i].getAttribute('pnumber'));
            }
        }
        return number + 1;
    };

    /**
     * добавление/именение товара в заявке
     */
    this.updateClaimProduct = function(fulldata, ajax)
    {
        if (ajax) {
            $.ajax({
                url      : linkPrefix + '/claim/returnsupply/getfullblockproduct',
                cache    : false,
                data     : fulldata,
                type     : 'POST',
                dataType : 'json',
                success  : function(data) {
                    claim.updateClaimProduct(data);
                }
            });
            return;
        }
        //console.log(fulldata);
        var data = fulldata.product;
        var sections = fulldata.sectionOut;
        var head = this.node('table_products').rows[0].cells;

        // products find
        var rows = this.node('table_products').rows;
        var number = this.getProductNumber(data.id);
        //console.log(number);
        var setIds = '|';
        for(var i=1; i<rows.length - 1; i++){
            if (rows[i].getAttribute('rowtype') == 'product' && rows[i].getAttribute('product') == data.id) {
                var form = this.node(this.formId);
                //console.log(number);
                if (form['products[' + number + '][amount]'])  form['products[' + number + '][amount]'].value  = this.round(data.amount);
                if (form['products[' + number + '][boxes]'])   form['products[' + number + '][boxes]'].value   = this.round(data.boxes);
                if (form['products[' + number + '][average]']) form['products[' + number + '][average]'].value = this.round(data.average);
                if (form['products[' + number + '][price]'])   form['products[' + number + '][price]'].value   = this.round(data.averagePrice);
                rows[i].setAttribute('lastdate', data.lastDate);
                // ставим метки на всех ячеек из которых брали
                for(var j=i; j<rows.length - 1; j++) {
                    if (rows[j].getAttribute('rowtype') == 'sectionout' && rows[j].getAttribute('product') == data.id) rows[j].setAttribute('templabel', '1');
                }
                // обновляем данные по секция из которых берем и сбрасываем метки
                for(var j=i; j<rows.length - 1; j++) {
                    if (rows[j].getAttribute('rowtype') == 'sectionout'
                        && rows[j].getAttribute('product') == data.id
                        && sections[rows[j].getAttribute('detailed_client_id')]) {
                        rows[j].removeAttribute('templabel');
                        var dci = rows[j].getAttribute('detailed_client_id');
                        setIds += dci + '|';
                        if (form['products[' + number + '][sectionOut][' + dci +'][amount]'])  form['products[' + number + '][sectionOut][' + dci +'][amount]'].value  = this.round(sections[dci].amount);
                        if (form['products[' + number + '][sectionOut][' + dci +'][boxes]'])   form['products[' + number + '][sectionOut][' + dci +'][boxes]'].value   = this.round(sections[dci].boxes);
                        if (form['products[' + number + '][sectionOut][' + dci +'][average]']) form['products[' + number + '][sectionOut][' + dci +'][average]'].value = this.round(sections[dci].average);
                        if (form['products[' + number + '][sectionOut][' + dci +'][price]'])   form['products[' + number + '][sectionOut][' + dci +'][price]'].value   = this.round(sections[dci].price);
                    }
                }
                //console.log(setIds);
                // удалем все отмеченные секции
                var j=i;
                while( j<rows.length - 1) {
                    if (rows[j].getAttribute('rowtype') == 'sectionout'
                        && rows[j].getAttribute('product') == data.id
                        && rows[j].getAttribute('templabel'))
                        {
                        var delParam = rows[j].getAttribute('detailed_client_id');
                        var k = j;
                        while (k < rows.length - 1) {
                            if (rows[k].getAttribute('detailed_client_id') == delParam) this.node('table_products').deleteRow(k);
                            else k++;
                        }
                    }
                    else {
                        j++;
                    }
                }
                for(var j in sections) {
                    if (setIds.indexOf('|' + j + '|') != -1) continue;
                    var row = this.node('table_products').insertRow(this.getProductNumber(data.id, 'endproduct'));
                    for(var i = 0; i < head.length; i++) {
                        switch(head[i].lang) {
                            case 'amount':
                            case 'average':
                            case 'price':
                            case 'boxes' :
                                var cell = row.insertCell(row.cells.length);
                                cell.setAttribute('width', head[i].getAttribute('width'));
                                cell.setAttribute('align', 'center');
                                var inp = this.crnode('input');
                                $(inp).attr({type : 'text', value : this.round(sections[j][head[i].lang]), size : 10, readOnly : true, name:'products[' + number + '][sectionOut][' + j +'][' + head[i].lang +']'}).css({'text-align':'left'});
                                cell.appendChild(inp);
                                break;
                            case 'section':
                                var cell = row.insertCell(row.cells.length);
                                cell.setAttribute('width', head[i].getAttribute('width'));
                                cell.setAttribute('align', 'center');
                                var inp = this.crnode('input');
                                $(inp).attr({type : 'button', title:'добавить секцию', lang:this.compresData(sections[j])}).css({background:'transparent url(/img/system/add.png) no-repeat center center', border:'none', 'outline':'none'});
                                inp.onclick = function(){
                                    claim.addNewSection(this);
                                };
                                cell.appendChild(inp);
                                break;
                        }
                    }
                    var cell = row.insertCell(row.cells.length);
                    cell.colSpan = head.length - row.cells.length + 1;
                    cell.innerHTML = sections[j].info;//'&nbsp;';
                    row.setAttribute('product', data.id);
                    row.setAttribute('pnumber', number);
                    row.setAttribute('detailed_client_id', sections[j].detailed_client_id);
                    row.setAttribute('rowtype', 'sectionout');
                }
                return;
            }
        }

        // console.log(data);
        var number = this.getProductNumber(data.id);
        var row = this.node('table_products_tbody').insertRow(this.node('table_products').rows.length - 2);
        // input  hidden pid
        var inp = this.crnode('input');
        $(inp).attr({type : 'hidden', value : data.id, name:'products[' + number + '][id]'});
        row.appendChild(inp);

        // input  hidden pnumber
        var inp = this.crnode('input');
        $(inp).attr({type : 'hidden', value : number, name:'products[' + number + '][number]'});
        row.appendChild(inp);

        // input  hidden pnumber
        var inp = this.crnode('input');
        $(inp).attr({type : 'hidden', value : data.type, name:'products[' + number + '][type]'});
        row.appendChild(inp);

        for(var i = 0; i < head.length; i++) {
            var cell = row.insertCell(row.cells.length);
            cell.setAttribute('width', head[i].getAttribute('width'));
            cell.setAttribute('align', 'center');
            switch(head[i].lang) {
                case 'amount':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : this.round(data[head[i].lang]), size : 8, readOnly : true, name:'products[' + number + '][amount]'}).css({'text-align':'left'});
                    cell.appendChild(inp);
                    break;
                case 'boxes':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : this.round(data[head[i].lang]), size : 8, readOnly : true, name:'products[' + number + '][boxes]'}).css({'text-align':'left'});
                    cell.appendChild(inp);
                    break;
                case 'price':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : this.round(data.averagePrice), size : 8, readOnly : true, name:'products[' + number + '][price]'}).css({'text-align':'left'});
                    cell.appendChild(inp);
                    break;
                case 'average':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : this.round(data[head[i].lang]), size : 8, readOnly : true, name:'products[' + number + '][average]'}).css({'text-align':'left'});
                    cell.appendChild(inp);
                    break;
                case 'edit':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'button', title:'редактировать '+data.title, lang:data.id}).css({background:'transparent url(/img/system/editproduct.png) no-repeat center center', border:'none', 'outline':'none','width': '16px', 'height': '16px'});
                    inp.onclick = function(){
                        claim.showDetailedFormProducts(this.lang, true);
                    };
                    cell.appendChild(inp);
                    break;
                case 'drop':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'button', title:'удалить '+data.title, lang:data.id}).css({background:'transparent url(/img/system/delete.png) no-repeat center center', border:'none', 'outline':'none', 'width': '16px', 'height': '16px'});
                    inp.onclick = function(){

                        claim.deleteProduct(this.lang, true);
                    };
                    cell.appendChild(inp);
                    break;
                case 'section':
                    cell.innerHTML = '&nbsp';
                    break;
                case 'pid':
                    cell.innerHTML = data.id;
                    break;
                default:
                    var tmp = data[head[i].lang];
                    // if (head[i].lang.replace(/field/, '') > 4 && head[i].lang.replace(/field/, '') < 13) {
                    //     tmp = this.toFloat(tmp) > 0 ? tmp : 0;
                    // }

                    // Вывод примечания отдела закупок с проверкой на резрешенные к выводу поля
                    if (depot_tooltip.isAllowedField('annotationIn', head[i].lang) && data.annotationIn) {
                        var options = {
                            htmlPatternName : 'iconAnnotationBrown',
                            annotation      : data.annotationIn,
                            headerName      : 'annotationIn'
                        };

                        tmp += depot_tooltip.init(options).getTooltip();
                    }

                    $(cell).html(tmp||'&nbsp;');
                    if (head[i].lang.replace(/field/, '') == 1) {
                        // Плейсхолдер для просмотра фотографий
                        var placeholder = this.crnode('div');
                        $(placeholder).attr({class : 'detailed-photo-placeholder'});
                        $(placeholder).attr('data-attr-claim-id', this.node(this.formId)['claim[id]'].value);
                        $(placeholder).attr('data-attr-item-id', data.id);
                        $(placeholder).css('display','none');
                        cell.appendChild(placeholder);
                        cell.align = 'left';
                    }
                    break;
            }
        }
        row.setAttribute('product', data.id);
        row.setAttribute('pnumber', number);
        row.setAttribute('rowtype', 'product');
        row.setAttribute('lastdate', data.lastDate);


        for(var j in sections) {
            var row = this.node('table_products_tbody').insertRow(this.node('table_products').rows.length - 2);
            for(var i = 0; i < head.length; i++) {
                switch(head[i].lang) {
                    case 'amount':
                    case 'average':
                    case 'price':
                    case 'boxes' :
                        var cell = row.insertCell(row.cells.length);
                        cell.setAttribute('width', head[i].getAttribute('width'));
                        cell.setAttribute('align', 'center');
                        var inp = this.crnode('input');
                        $(inp).attr({type : 'text', value : this.round(sections[j][head[i].lang]), size : 8, readOnly : true, name:'products[' + number + '][sectionOut][' + j +'][' + head[i].lang +']'}).css({'text-align':'left'});
                        cell.appendChild(inp);
                        break;
                    case 'section':
                        var cell = row.insertCell(row.cells.length);
                        cell.setAttribute('width', head[i].getAttribute('width'));
                        cell.setAttribute('align', 'center');
                        var inp = this.crnode('input');
                        $(inp).attr({type : 'button', title:'добавить секцию', lang:this.compresData(sections[j])}).css({background:'transparent url(/img/system/add.png) no-repeat center center', border:'none', 'outline':'none','width': '16px', 'height': '16px'});
                        inp.onclick = function(){
                            claim.addNewSection(this);
                        };
                        cell.appendChild(inp);
                        break;
                }
            }
            var cell = row.insertCell(row.cells.length);
            cell.colSpan = head.length - row.cells.length + 2;
            cell.innerHTML = sections[j].info;//'&nbsp;';
            row.setAttribute('product', data.id);
            row.setAttribute('pnumber', number);
            row.setAttribute('detailed_client_id', sections[j].detailed_client_id);
            row.setAttribute('rowtype', 'sectionout');
        }

        // footer product
        var row2 = this.node('table_products_tbody').insertRow(this.node('table_products').rows.length - 2);
        row2.setAttribute('product', data.id);
        row2.setAttribute('pnumber', number);
        row2.setAttribute('rowtype', 'endproduct');
        row2.insertCell(0).innerHTML = '<br><hr><br>';
        row2.cells[0].colSpan = this.node('table_products').rows[0].cells.length;
        this.filter.rebuildFilter();
        if (this.overley) {
            this.overley.grid.lastSelectionData = claim.findAddedMaterial();
            this.overley.grid._updateSelectedRow();
        }
        this.recountSumm();
        this.updateDepotIndexState();
    };

    /**
     * удалить товар из заявки
     */
    this.deleteProduct = function(productId, ajax)
    {
        if (ajax) {
            var msg = 'вы уверены что хотите удалить товар ?';
            if (!confirm(msg)) {
                return;
            }
            $.ajax({
                url      : linkPrefix + '/claim/returnsupply/deleteproduct',
                cache    : false,
                data     : {pid:productId, claimId:this.node(this.formId)['claim[id]'].value},
                type     : 'POST',
                dataType : 'json',
                success  : function(data) {
                    if (data.result) {
                        claim.deleteProduct(data.productId);
                    }
                }
            });
            return;
        }
        var rows = this.node('table_products').rows;
        var i = 1;
        while(i < rows.length - 1) {
            if (rows[i].getAttribute('product') == productId) {
                this.node('table_products').deleteRow(i);
            }
            else {
                ++i;
            }
        }
        this.filter.rebuildFilter();
        this.recountSumm();
        this.updateDepotIndexState();
    };

    /**
     * добавить секцию для товара
     */
    this.addNewSection = function(obj)
    {
        var data = this.uncompresData(obj.lang);
        //console.log();
        //return;

        var rows = this.node('table_products').rows;
        var pnumber   = obj.parentNode.parentNode.getAttribute('pnumber');
        var productId = obj.parentNode.parentNode.getAttribute('product');
        var detailedClientId = obj.parentNode.parentNode.getAttribute('detailed_client_id');
        var head = this.node('table_products').rows[0].cells;
        var i = 1;
        var lastRowProduct = 0;
        while(i < rows.length - 1) {
            if (rows[i].getAttribute('product') == productId
                && (rows[i].getAttribute('rowtype') == 'sectionout' || rows[i].getAttribute('rowtype') == 'sectionin')
                && rows[i].getAttribute('detailed_client_id') == detailedClientId) {
                lastRowProduct = i;
                ++i;
            }
            else if (!lastRowProduct) {
                ++i;
            }
            else {
                break;
            }
        };
        var snumber = parseInt(rows[lastRowProduct].getAttribute('snumber')||0) + 1;
        var section = this.node('table_products').insertRow(lastRowProduct+1);

        section.setAttribute('product', productId);
        section.setAttribute('pnumber', pnumber);
        section.setAttribute('snumber', snumber);
        section.setAttribute('rowtype', 'sectionin');
        section.setAttribute('detailed_client_id', detailedClientId);

        var inp = this.crnode('input');
        $(inp).attr({type : 'hidden', value : detailedClientId, name:'products[' + pnumber + '][sectionIn]['+detailedClientId+'][' + snumber +'][detailed_client_id]'});
        section.appendChild(inp);

        var inp = this.crnode('input');
        $(inp).attr({type : 'hidden', value : snumber, name:'products[' + pnumber + '][sectionIn]['+detailedClientId+'][' + snumber +'][number]'});
        section.appendChild(inp);

        for(var i = 0; i < head.length; i++) {
            switch(head[i].lang) {
                case 'amount':
                    var cell = section.insertCell(section.cells.length);
                    cell.setAttribute('width', head[i].getAttribute('width'));
                    cell.setAttribute('align', 'center');
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : '', size : 8, name:'products[' + pnumber + '][sectionIn]['+detailedClientId+'][' + snumber +'][amount]', lang : (data.amount/data.boxes)}).css({'text-align':'left'});
                    inp.oninput = function(){claim.updateSectionData(this);};
                    cell.appendChild(inp);
                    break;
                case 'average':
                    var cell = section.insertCell(section.cells.length);
                    cell.setAttribute('width', head[i].getAttribute('width'));
                    cell.setAttribute('align', 'center');
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : '', size : 8, readOnly : true, name:'products[' + pnumber + '][sectionIn]['+detailedClientId+'][' + snumber +'][average]'}).css({'text-align':'left'});
                    cell.appendChild(inp);
                    break;
                case 'price':
                    var cell = section.insertCell(section.cells.length);
                    cell.setAttribute('width', head[i].getAttribute('width'));
                    cell.setAttribute('align', 'center');
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : data.price, size : 8, readOnly : true, name:'products[' + pnumber + '][sectionIn]['+detailedClientId+'][' + snumber +'][price]'}).css({'text-align':'left'});
                    cell.appendChild(inp);
                    break;
                case 'boxes' :
                    var cell = section.insertCell(section.cells.length);
                    cell.setAttribute('width', head[i].getAttribute('width'));
                    cell.setAttribute('align', 'center');
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : '', size : 8, name:'products[' + pnumber + '][sectionIn]['+detailedClientId+'][' + snumber +'][boxes]', lang : (data.amount/data.boxes)}).css({'text-align':'left'});
                    inp.oninput = function(){claim.updateSectionData(this);};
                    cell.appendChild(inp);
                    break;
                case 'section':
                    var cell = section.insertCell(section.cells.length);
                    cell.setAttribute('width', head[i].getAttribute('width'));
//                    cell.setAttribute('width', '175');
                    cell.setAttribute('align', 'center');
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : '', size : 8, name:'products[' + pnumber + '][sectionIn]['+detailedClientId+'][' + snumber +'][section]'}).css({'text-align':'left', 'width':'60px', 'float':'left'});
                    cell.appendChild(inp);
                    inp.oninput = function(){claim.updateSectionData(this);};
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'checkbox', value : '1', name:'products[' + pnumber + '][sectionIn]['+detailedClientId+'][' + snumber +'][defect]'}).css({'float':'left'});
                    inp.onchange = function(){claim.showDefect(this);};
                    cell.appendChild(inp);
                    break;
            }
        }

        var cell = section.insertCell(section.cells.length);
        cell.colSpan = head.length - section.cells.length + 2;
        cell.innerHTML = '&nbsp;&nbsp;&nbsp;';
        var inp = this.crnode('input');
        $(inp).attr({type : 'button', title:'удалить секцию'}).css({background:'transparent url(/img/system/delete.png) no-repeat center center', border:'none', 'outline':'none', 'width': '16px', 'height': '16px'});
        inp.onclick = function(){
            claim.deleteSubSection(this);
        };
        cell.appendChild(inp);
        cell.align = 'left';
    };

    this.showDefectForm = function(pnumber, snumber, detailed_client_id, status)
    {
//            console.log(pnumber);products[' + number + '][sectionIn]['+productId+']['+snumber+'][defect_reason]
        buildForm(pnumber, snumber, detailed_client_id);
        var defect_reason = $("input[name='products[" + pnumber + "][sectionIn]["+detailed_client_id+"]["+snumber+"][defect_reason]']").val();
        var data = '<textarea ' + status +' placeholder="Описание брака" name="products['+pnumber+'][sectionIn]['+detailed_client_id+']['+snumber+'][form_defect_reason]" type="text"  style="margin-top:45px; width:250px; height:100px;" value="' + defect_reason + '">' + defect_reason + '</textarea><br/><span id="form_defect_reason_error" style="display:none;">Необходимо заполнить Описание брака</span><br/><br/>\n\
                    <input ' + status +' type="submit" value="Применить" onclick="claim.submitDefectForm(' + pnumber +', ' + snumber + ', ' + detailed_client_id +')"><br/><br/><br/>';
        $('#fieldsForm').html(data);
        correctBlocks();
        correctView();
    };

    this.submitDefectForm = function(pnumber, snumber, detailed_client_id) {
        var defect_reason = $("textarea[name='products[" + pnumber + "][sectionIn]["+detailed_client_id+"]["+snumber+"][form_defect_reason]']").val();
        if (defect_reason !== '') {
            $("input[name='products[" + pnumber + "][sectionIn]["+detailed_client_id+"]["+snumber+"][defect_reason]']").val(defect_reason);
        } else {
            $("#form_defect_reason_error").show();
        }
        if (defect_reason !== '') {
            closeFullDiv();
        }
    };

    this.showDefect = function(obj)
    {
        var number = $(obj).closest('tr').attr('pnumber');
        var snumber = $(obj).closest('tr').attr('snumber');
        var detailed_client_id = $(obj).closest('tr').attr('detailed_client_id');
        if(obj.checked) {
            $(obj).closest('td').append(
                '<span id="defect_reason_img_' + number + '_' + snumber + '">\n\
                    <img src="/img/system/edit.png" style="cursor:pointer" \n\
                     onclick="javascript:claim.showDefectForm(' + number + ', ' + snumber + ', ' + detailed_client_id + ')"/>\n\
                    <input type="hidden" value="" name="products[' + number + '][sectionIn]['+detailed_client_id+']['+snumber+'][defect_reason]" type="text" >\n\
                </span>');

            claim.showDefectForm(number, snumber, detailed_client_id);

        }else{
            $('#defect_reason_img_' + number + '_' + snumber).remove();
        }
    };
    /**
     * delete subsection
     */
    this.deleteSubSection = function(obj)
    {
        var rowIndex = obj.parentNode.parentNode.rowIndex;
        var txt = 'Вы уверены в удалении секции ?';
        if (confirm(txt)) {
            this.node('table_products').deleteRow(rowIndex);
        }
    };

    /**
     * расчет распределения внутри секций
     */
    this.updateSectionData = function(obj)
    {
        var number = obj.parentNode.parentNode.getAttribute('pnumber');
        var dit = obj.parentNode.parentNode.getAttribute('detailed_client_id');
        this.lightingSectionError(number, dit);
        var average = this.round(this.node(this.formId)['products[' + number + '][sectionOut][' + dit + '][average]'].value);
        var ramount = /amount\]$/;
        var rboxes = /boxes\]$/;
        //console.log(obj.value)
        switch(true) {
            case ramount.test(obj.name) :
                var amount = Math.abs(this.toFloat(obj.value));
                //console.log(amount);
                if (amount != obj.value) {
                    if (/^\d+(\.|\,)$/.test(obj.value)) obj.value = amount + '.';
                    else obj.value = amount;
                }
                var boxes =  Math.ceil(this.toFloat(amount/average));
                this.node(this.formId)[obj.name.replace(ramount, 'boxes]')].value = boxes;
                var name  = obj.name.replace(ramount, 'average]');
                // update average
                this.node(this.formId)[name].value = this.round(amount/boxes)||0;
                break;
            case rboxes.test(obj.name) :
                var boxes = Math.abs(this.toFloat(obj.value));
                if (boxes != obj.value) {
                    if (/^\d+(\.|\,)$/.test(obj.value)) obj.value = boxes + '.';
                    else obj.value = boxes;
                }
                if (!boxes) this.node(this.formId)[obj.name.replace(rboxes, 'amount]')].value = boxes;
                var amount = this.node(this.formId)[obj.name.replace(rboxes, 'amount]')].value;
                var name  = obj.name.replace(rboxes, 'average]');
                // update average
                this.node(this.formId)[name].value = this.round(amount/boxes)||0;
                break;
        }
    };

    /* filter */

    /**
     *управление добавленными товарами
     */
    this.showClaimGoodsFilter = function(obj)
    {
        if (obj.lang == 0) {
            $('#filter-claim-goods-cnt').css({overflow:'hidden'}).animate({height:'0px', opacity:0}, 200);
            obj.lang = 1;
            obj.src = '/img/system/fieldsShowF.png';
        }
        else {
            $('#filter-claim-goods-cnt').css({overflow:'visible'}).animate({height:'136px', opacity:1}, 200);
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
            urlGetFullData:linkPrefix + '/claim/returnsupply/getproductfilterconfig',
            // получение маски для для полей
            urlGetMaskData:linkPrefix + '/claim/returnsupply/getproductmaskfilter',
            // filter type simple|excel default=simple
            filterType:'excel',
            //create in node||id
            conteinerId:'filter-claim-goods',
            // урл индикатора загрузки
            imgLoader:'/img/ld/ld3.gif'
        });
        this.filter.onBeforeCreate = function() {
            this.addPostData = claim.getAllProductsIds();
            this.addPostData.products = serialize(this.addPostData.products);
        };
        this.filter.onAfterCreate = function() {
            claim.applyProductFilter(this.getValue());
        };
        this.filter.onBeforeRebuild = function(){
            this.addPostData = claim.getAllProductsIds();
            this.addPostData.products = serialize(this.addPostData.products);
        };
        this.filter.onAfterRebuild = function(){
            claim.applyProductFilter(this.getValue());
            claim.recountSumm();
            claim.updateDepotIndexState();
        };
        this.filter.onChange = function() {
            claim.applyProductFilter(this.getValue());
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
            perpage  : 0
        };
        $.ajax({
            url      : linkPrefix + '/claim/returnsupply/getproductfilterdata',
            cache    : false,
            type     : 'POST',
            dataType : 'json',
            data     : data,
            success  : function(data){
                claim.showHideProducts(data.result);
            }
        });
    };

    /**
     *
     */
    this.showHideProducts = function(data)
    {
        //console.log(data);
        //return;
        if (!this.node("table_products")) return;
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
        var rows = this.node("table_products").rows;
        for(var i=1; i< rows.length-1; i++) {
            var number = rows[i].getAttribute('pnumber');
            rows[i].style.display = tmp[number];
        }
    };

    /**
     * получение списка товаров для возврата
     */
    this.getAllProductsIds = function(rev)
    {
        var data = {products:{}};
        var rows = this.node('table_products').rows;
        var p = null;
        var n = null;
        for(var i=0; i<rows.length; i++) {
            p = rows[i].getAttribute('product');
            n = rows[i].getAttribute('pnumber');
            if (!p) continue;
            if (!rev) {data.products[n + ''] = p;}
            else {data.products[p + ''] = n;}
        }
        return data;
    };

    /* отправка формы */

    /**
     * отправка формы
     */
    this.sendForm = function(nextStatus)
    {
        claim.nextStatusAv =  ( nextStatus ? 1 : 0 );
        if (!nextStatus) this.sectionRequered = false;
        if (this.node(this.formId).onsubmit()){
            this.node(this.formId)['changeStatusAvaleble'].value = ( nextStatus ? 1 : 0 );
            this.saveForm = true;
            this.node(this.formId).submit();
        }
    };

    /**
     * Проверка валидности введеных данных
     */
    this.checkFormFinanceSupport = function()
    {
        if(this.checkForm(this.node(this.formId))) {
            this.saveForm = true;
            return true;
        }else{
            return false;
        }
    };

    /**
     * проверка валидности введенных данных
     */
    this.checkForm = function(form)
    {
        let claimId = this.node(this.formId)['claim[id]'].value;
        var errors = [];
        // Содержит в себе массив ошибок в случае если мы должны перевести заявку на статус диспетчера
        var emptyFileds = [];
        // Содержит флаг наша машина или нет
        var car = $("#claim_car").val();
        var products = {};
        var maxProductDate = 0;
        var rows = this.node('table_products').rows;
        for(var i = 1; i < rows.length - 1; i++) {
            if (rows[i].getAttribute('rowtype') == 'product' && parseInt(rows[i].getAttribute('lastdate')) > maxProductDate) {
                maxProductDate = parseInt(rows[i].getAttribute('lastdate'));
            }
        }
        var els = form.elements;
        for(var i = 0; i < els.length; i++) {
            if (els[i].disabled) {
                continue;
            }
            if (!els[i].name.indexOf('products')) {
                var path = els[i].name.replace(/^products\[/, '').replace(/(\[|\]\[|\])/g, '.').replace(/\.$/, '').split('.');
                var cur = products;
                while (path.length) {
                    var level = path.shift();
                    if (typeof cur[level] == 'undefined') cur[level] = {};
                    if (!path.length) {
                        // если это кол-во, то преобразуем в число с точкой, а не запятой
                        // сделано так, чтобы ничего не сломать
                        if (['amount', 'boxes'].includes(level)) {
                            els[i].value = this.toFloat(els[i].value) || '';
                        }
                        cur[level] = els[i].value;
                    }
                    cur = cur[level];
                }
            }
            else {
                switch (els[i].name) {
                    case 'claim[managerId]':
                        if (!parseInt(els[i].value)) {
                            errors.push(' - не указан менеджер');
                        }
                        break;
                    case 'claim[clientId]':
                        if (!parseInt(els[i].value)) {
                            errors.push(' - не указан переработчик');
                        }
                        break;
                    case 'claim[kpp]':
                        var value = parseInt(els[i].value);

                        if(isNaN(value) || value == -1) {
                            errors.push('- не выбран КПП клиента\r\n');
                            result = false;
                        }

                        break;
                    case 'claim[car]':
                        if ($(els[i]).val() == "") {
                            errors.push(' - не выбрана машина');
                        }
                        break;
                    case 'claim[date]':
                        if (!/^([0-2]\d|3[0-1])\.(0\d|1[0-2])\.20\d\d$/.test(els[i].value)) {
                            errors.push(' - не верный формат даты');
                        }
                        else {
                            var date = els[i].value.split('.');
                            var time = (new Date(date[2], date[1], date[0])).getTime()/1000;
                            if (time < maxProductDate) {
                                errors.push(' - дата возврата не может раньше поставки товаров');
                            }
                        }
                        break;
                    case 'claim[carType]':
                        if (els[i].value.replace(/^\s+|\s+$/g, '') == '' && car==1) {
                            errors.push(' - не указан тип машины');
                        }
                        break;
                    case 'claim[dispetcher]':
                        if(!parseFloat(els[i].value) && car == 1) {
                            errors.push(' - не выбран диспетчер');
                        }
                        break;
                    case 'claim[annotation]':
                        if(parseInt(claim.perm.annotationrequired) && claim.nextStatusAv == 1) {
                            if (typeof(tinyMCE) !== "undefined" && tinymce.get('claim_annotation')) {
                                if (!tinyMCE.get('claim_annotation').getContent()) {
                                    errors.push(' - не заполнено Примечание');
                                }
                            }
                        }
                        break;
                    case 'claim[carNumber]':
                        if(claim.carStatusFlag != 2 &&
                           claim.carStatusFlag != 1 &&
                           !parseFloat(els[i].value) &&
                           claim.nextStatusAv == 0 && car == 1
                        ) {
                            emptyFileds.push(" - не указан номер машины");
                        }
                        if(claim.nextStatusAv == 1 &&
                           (claim.carStatusFlag == 2 ||
                            claim.carStatusFlag == 0) &&
                            !parseFloat(els[i].value)
                            && car == 1
                          ) {
                            errors.push(' - не указан номер машины');
                        }
                        break;
                    case 'claim[driverName]':
                        if((claim.carStatusFlag != 1 &&
                            claim.carStatusFlag != 2) &&
                            els[i].value.replace(/^\s+|\s+$/g, '') == '' &&
                            claim.nextStatusAv == 0 && car == 1
                        ) {
                            emptyFileds.push(" - не указано имя водителя");
                        }
                        if(claim.nextStatusAv == 1 &&
                          (claim.carStatusFlag == 2 ||
                           claim.carStatusFlag == 0) &&
                           els[i].value.replace(/^\s+|\s+$/g, '') == ''
                           && car == 1
                        ) {
                            errors.push(' - не указано имя водителя');
                        }
                        break;
                    case 'claim[driverPhone]':
                        if(claim.carStatusFlag != 1 &&
                           claim.carStatusFlag != 2 &&
                           els[i].value.replace(/^\s+|\s+$/g, '') == '' &&
                           claim.nextStatusAv == 0 &&
                           car == 1
                        ) {
                            emptyFileds.push(" - не указан телефон водителя");
                        }
                        if(claim.nextStatusAv == 1 &&
                          (claim.carStatusFlag == 2 ||
                           claim.carStatusFlag == 0) &&
                           !parseFloat(els[i].value) &&
                           car == 1
                        ) {
                            errors.push(' - не указан телефон водителя');
                        }
                        break;
                    case 'claim[rentPrice]':
                        if (els[i].value != '' && isNaN(parseFloat(els[i].value))) {
                            errors.push(' - не допустимое значение стоимости найма');
                        }
                        break;
                    case 'claim[carDataId]':
                        if(typeof window.carDataFieldInstance == 'object') {
                            window.carDataFieldInstance.validation({
                                'error': function(msg) {
                                    errors.push(' - ' + msg);
                                }
                            });
                        }
                        break;
                    case 'claim[unloadAddressId]':
                        if (els[i].value.replace(/^\s+|\s+$/g, '') == '' && car == 1) {
                            errors.push(' - не выбран "Адрес загрузки"');
                        }
                        break;
                    case 'claim[aproxClaimWeight]':
                        if (els[i].value.replace(/^\s+|\s+$/g, '') == '' && car == 1 && this.unloadRequired == 1) {
                            errors.push(' - заполните поле Ориентировочный вес по заявке');
                        }
                        break;
                    case 'claim[transportDeliveryTime]':
                        if (els[i].value.replace(/^\s+|\s+$/g, '') == '' && car == 1 && this.unloadRequired == 1) {
                            errors.push(' - заполните поле Время подачи автомобиля');
                        }
                        break;
                }
            }
        }

        if (claim.nextStatusAv > 0 && car == 1 && this.dimensions && !this.dimensions.isValid()) {
            errors.push(' - заполните поле "Габариты"');
        }

        if (typeof this.depotNominal !== 'undefined'
            && !this.depotNominal.isValid()
            && parseInt(claim.claimStatus) > 0
        ) {
            errors.push(' - заполните поле "Условный склад"');
        }

        if(typeof window.claimFieldRentPriceValidate == 'function') {
            window.claimFieldRentPriceValidate({
                'error': function(msg) {
                    errors.push(' - ' + msg);
                }
            });
        }

        if (typeof(carView) != 'undefined' && car != 1 && carView.getVehicleAccessController() && !carView.getVehicleAccessController().check()) {
            errors.push(' - необходимо заполнить все поля для доступа ТС на территорию');
        }

        var productsExists = false;
        var autosection = [];

        for(var i in products) {
            if (typeof products[i].amount != 'undefined' && !this.toFloat(products[i].amount)) {
                errors.push(' - не корректно указан вес для товара : ' + i);
            }
            if (typeof products[i].boxes != 'undefined' && !this.toFloat(products[i].boxes)) {
                errors.push(' - не корректно указано кол-во для товара : ' + i);
            }
            if (Object.keys(products[i].sectionOut||{}).length !== Object.keys(products[i].sectionIn||{}).length) {
                autosection.push(i)
            }
            productsExists = true;
            if (products[i].sectionIn) {
                for(var k in products[i].sectionIn) {
                    var setSection = false;
                    var totalSectionAmount = 0;
                    var totalSectionBoxes  = 0;
                    for(var j in products[i].sectionIn[k]) {
                        if (!products[i].sectionIn[k][j].hasOwnProperty('amount') ||
                            !products[i].sectionIn[k][j].hasOwnProperty('boxes')
                        ) {
                            break;
                        }
                        totalSectionAmount += this.toFloat(products[i].sectionIn[k][j].amount);
                        totalSectionBoxes  += this.toFloat(products[i].sectionIn[k][j].boxes);
                        setSection = true;
                        if (products[i].sectionIn[k][j].hasOwnProperty('section') &&
                            products[i].sectionIn[k][j].section.replace(/^\s+|\s+$/g, '') == ''
                        ) {
                            errors.push(' - не указано название ячейки для товара : ' + i + ', ячейка : ' + j);
                            this.lightingSectionError(i, k, true);
                        }
                    }
                    if (Math.abs(totalSectionBoxes - products[i].sectionOut[k].boxes) > 0.00001) {
                        if (setSection) {
                            errors.push(' - не корректное распределение по секциям кол-ва для товара : ' + i);
                            this.lightingSectionError(i, k, true);
                        }
                    }
                    if (Math.abs(totalSectionAmount - products[i].sectionOut[k].amount) > 0.00001) {
                        if (setSection) {
                            errors.push(' - не корректное распределение по секциям веса для товара  : ' + i);
                            this.lightingSectionError(i, k, true);
                        }
                    }
                    if (this.sectionRequered && !totalSectionAmount && setSection) {
                        errors.push(' - отсутсвует или не полное распределение по секциям для товара : ' + i);
                    }
                }
            }
            else if (this.sectionRequered) {
                errors.push(' - отсутсвует или не полное распределение по секциям для товара : ' + i);
            }
        }
        if (!productsExists) {
            errors.push(' - нет товаров в заявке');
        }
        if(emptyFileds.length) {
            if (confirm('Заявка будет возвращена на статус диспетчера т.к. не заполнены все поля: ' + String.fromCharCode(10, 13) + emptyFileds.join(String.fromCharCode(10, 13)) + String.fromCharCode(10, 13) + '')) {
                this.saveForm = true;
                emptyFileds = [];
            } else {
                this.saveForm = false;
            }
        }

        if (this.orgDepotCheck) {
            let depotValidation = (new OrgDepotValidator()).validate(claimId);
            if (!depotValidation.check) {
                errors.push(`- Внимание! Вам запрещено проводить изменения в складе ${depotValidation.depotTitle}.`);
            }
        }

        if (errors.length) {
            alert('Обнаружены следующие ошибки :' + String.fromCharCode(10, 13) + errors.join(String.fromCharCode(10, 13)));
        } else {
            if (autosection.length) {
                if (!confirm(`Вы не разбили по секциям товар: \n\r${autosection.join(', ')}\n\rРазбить автоматически?`)) {
                    return false;
                }
            }
        }
        return !errors.length;
    };

    /**
     * подсветка ошибок в секциях
     */
    this.lightingSectionError = function(pnumber, detailedId, error)
    {
        var rows = this.node('table_products').rows;
        for(var i=0; i<rows.length; i++) {
            if (rows[i].getAttribute('pnumber') == pnumber
                && rows[i].getAttribute('rowtype').toLowerCase() == 'sectionin'
                && rows[i].getAttribute('detailed_client_id') == detailedId) {
                var inps = rows[i].getElementsByTagName('input');
                for(var j=0; j<inps.length; j++) {
                    if (inps.item(j).type == 'text' && !inps.item(j).readOnly) {
                        inps.item(j).style.backgroundColor = error ? claim.errorColor : '';
                    }
                }
            }
        }
    };


    /**
     * синхронизация данных по машине
     * @param nodeObject obj
     * @param integer idChangedCar принимает id выбранной при быстром поиске по машине
     * @return void
     */
    this.updateCarNumber = function(obj, idChangedCar)
    {
        var obj2 = this.node(this.formId)['claim[driverName]'];
        var obj3 = this.node(this.formId)['claim[driverPhone]'];

        //если значение idChangedCar передано из быстрого поиска заполняем поля имя и телефон водителя
        if (idChangedCar) {
            for (let i in claim.dataContainer.get('carList')) {
                if (claim.dataContainer.get('carList')[i].id != idChangedCar) {
                    continue;
                }
                obj2.value = claim.dataContainer.get('carList')[i].name;
                obj3.value = claim.dataContainer.get('carList')[i].phone;
                return;
            }
        }

        if ((obj.value == -1) || (obj.value == undefined)){
            obj2.value = '';
            obj3.value = '';
            return;
        }
        for (let i in claim.dataContainer.get('carList')) {
            if (claim.dataContainer.get('carList')[i].id != obj.value) {
                continue;
            }
            obj2.value = claim.dataContainer.get('carList')[i].name;
            obj3.value = claim.dataContainer.get('carList')[i].phone;
            break;
        }
    };

    /**
     * фильтр для Номера машины
     * @param nodeObject obj
     * @return void
     */
    this.filterCarNumber = function(obj)
    {
        if(this.timeOut) {
            clearTimeout(this.timeOut);
        }
        var self = this;
        this.timeOut = setTimeout(function() {
            var options = self.el('claim_carNumber').options;
            options.length = 0;
            var search = obj.value.toLowerCase().replace(/^\s+|\s+$/, '');

            for (let key in self.dataContainer.get('carList')) {
                if (search.length && self.dataContainer.get('carList')[key].carNumber.toLowerCase().indexOf(search) == -1) {
                    continue;
                }
                options[options.length] = new Option(self.dataContainer.get('carList')[key].carNumber, self.dataContainer.get('carList')[key].id);
            }
            options.length ? self.updateCarNumber('claim_carNumber', options[0].value) : self.updateCarNumber('claim_carNumber');
        }, 500);
    };

    /**
     * обновление общих данных
     */
    this.recountSumm = function()
    {
        var els = this.node(this.formId).elements;
        var products = {};
        for(var i=0; i<els.length; i++) {
            if (els[i].disabled) {
                continue;
            }
            if (!els[i].name.indexOf('products')) {
                var path = els[i].name.replace(/^products\[/, '').replace(/(\[|\]\[|\])/g, '.').replace(/\.$/, '').split('.');
                var cur = products;
                while (path.length) {
                    var level = path.shift();
                    if (typeof cur[level] == 'undefined') cur[level] = {};
                    if (!path.length) cur[level] = els[i].value;
                    cur = cur[level];
                }
            }
        }
        var totals = {
            amount:0,
            boxes:0,
            summa:0
        };
        for(var i in products) {
            if (products[i].amount) totals.amount += this.toFloat(products[i].amount);
            if (products[i].boxes) totals.boxes += this.toFloat(products[i].boxes);
            if (products[i].amount && products[i].averagePrice) totals.summa += this.round(this.toFloat(products[i].amount) * this.toFloat(products[i].averagePrice));
        }
        var target = null;
        if (target = this.node('autosum-amount')) target.innerHTML = this.round(totals.amount);
        if (target = this.node('autosum-boxes')) target.innerHTML = this.round(totals.boxes);
        if (target = this.node('autosum-price')) target.innerHTML = this.round(totals.summa);
    };

    /**
     * инфа по приходам
     */
    this.showInfoIn = function(data, ajax)
    {
        this.overleyInfoIn = new overley();
        this.overleyInfoIn.tmpdata = data;
        this.overleyInfoIn.onAfterCreate = function() {
            claim.empty(this.blockId + '_block');

            var wnd = this.crnode();
            wnd.className = 'filter-wnd';
            wnd.id = this.blockId + '_cnt';
            wnd.style.display = 'inline-block';
            wnd.style.position = 'relative';
            wnd.style.border = '1px solid gray';
            claim.node(this.blockId + '_block').appendChild(wnd);

            var area = this.crnode();
            area.style.display = 'inline-block';
            area.style.width = 'auto';
            area.style.height = 'auto';
            area.style.padding = '5px';
            wnd.appendChild(area);

            // create wnd caption
            var wndcap = this.crnode();
            wndcap.className = 'filter-wnd-caption';
            $(wndcap).html('Информация по приходам товара : ' + data.title + ' (ID:id)'.replace(/id/, data.id));
            wnd.appendChild(wndcap);

            // create wnd caption close button
            var wndcapbt = this.crnode();
            wndcapbt.className = 'filter-wnd-caption-close-button';
            wndcapbt.title = 'закрыть диалог';
            wnd.appendChild(wndcapbt);
            wndcapbt.onclick = function(){
                claim.overleyInfoIn.close();
            };

            // create info;
            var cntgrid = this.crnode();
            cntgrid.id = this.blockId + '_grid';
            cntgrid.style.width = '1010px';
            cntgrid.align = 'left';
            area.appendChild(cntgrid);

            // create information grid
            this.grid = new Grid({
                conteinerId:cntgrid.id,
                imgError:'/img/system/error.16.png' ,
                imgLoader:'/img/ld/ld3.gif',
                perpage:10,
                displayPaging:0,
                useCorrectionScrollWidth:false
            });

            this.grid.head = {
                id:      {caption:'ID', width:43},
                title:   {caption: configTitle,   width:115, aliace:claim.aliace, align:'left'},
                prop:    {caption: configProp,    width:77,  aliace:function(v, cnt, rowData){ return eval(configPropReturn);}},
                color:   {caption: configColor,   width:100, aliace:function(v, cnt, rowData){ return eval(configColorReturn);}},
                boxType: {caption: configBoxType, width:80,  aliace:function(v, cnt, rowData){ return eval(configBoxTypeReturn);}},
                volum:   {caption: configVolum,   width:70,  aliace:function(v, cnt, rowData){ return eval(configVolumReturn);}},
                height:  {caption: configHeight,  width:75,  aliace:function(v, cnt, rowData){
                        // Отображение реального поставщика
                        showVendornameTitle(rowData, cnt);
                        return eval(configHeightReturn);
                    }
                },
                width:   {caption: configWidth,   width:75, aliace:function(v, cnt, rowData){ return eval(configWidthReturn);}},
                depth:   {caption: configDepth, width:75, aliace:function(v, cnt, rowData){ return eval(configDepthReturn);}},
                labelWeight:  {caption: configLabelWeight, width:75, aliace:function(v, cnt, rowData){ return eval(configLabelWeightReturn);}},
                inBoxes: {caption:'Кол-во в упаковке / средний вес ', width:95, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                amountWeight : {caption:'Кол-во (штук) / общий вес', width:95, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                boxesRols :    {caption:'Кол-во упаковок / кол-во роликов', width:95, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                description :  {caption:'Примечание', width:200, aliace:function(v, cnt, rowData){ return (v||'');}}
            };

            this.grid.create();
            this.grid.data = [data];
            this.grid.update();

            // create conteier for html
            var inf = this.crnode();
            inf.style.paddingTop = '10px';
            inf.align = 'center';
            inf.id = this.blockId + '_inf';
            inf.innerHTML = '<img src="/img/ld/ld3.gif" style="margin:10px;">';
            area.appendChild(inf);

            // create button conteiner
            var cntinfo = this.crnode();
            cntinfo.style.paddingTop = '10px';
            cntinfo.style.textAlign = 'center';

            // create button cancel
            var btcn = this.crnode('input');
            btcn.type = 'button';
            btcn.value = 'Закрыть';
            btcn.style.width = '125px';
            btcn.className = 'amd-btn amd-btn_primary';
            btcn.onclick = function () {
                claim.overleyInfoIn.close();
            };
            cntinfo.appendChild(btcn);
            area.appendChild(cntinfo);

            // to center popup
            this.cntToCenter();
        };
        this.overleyInfoIn.onBeforeClose = function() {this.grid.close();};
        this.overleyInfoIn.onAfterClose = function() {delete(claim.overleyInfoIn);};
        this.overleyInfoIn.restore = function(msg) {
            var obj = this.getCnt();
            if (!obj) return;
            $(obj.firstChild).show();
            $(obj).css({'background-image':'', 'background-position':'center center', 'background-repeat':'no-repeat'});
            $('#' + this.blockId + '_inf').html(msg);
            this.cntToCenter();
        };
        this.overleyInfoIn.create();
        if (ajax) {
            var obj = this.overleyInfoIn.getCnt();
            $(obj.firstChild).hide();
            $(obj).css({'background-image':'url(/img/ld/ld3.gif)', 'background-position':'center center', 'background-repeat':'no-repeat'});
            $.ajax({
                url      : linkPrefix + '/claim/returnsupply/getinfoin',
                cache    : false,
                data     : {itemId : data.id, claimId : this.node(this.formId)['claim[id]'].value, clientId:this.node(this.formId)['claim[clientId]'].value},
                type     : 'POST',
                dataType : 'html',
                success  : function(data) {
                    claim.overleyInfoIn.restore(data);
                }
            });
            return;
        }
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


    this.getClientId = function()
    {
        return parseInt($('[name="claim[clientId]"]').val()) || 0;
    }


    this.getClaimId = function ()
    {
        return parseInt($('[name="claim[id]"]').val()) || 0;
    }


    this.getDepotId = function()
    {
        return parseInt($('[name="claim[depotIndex]"]').val()) || 0;
    }


    this.updateDepotIndexState = function ()
    {
        if (claim.depotIndex) {
            claim.depotIndex.updateState()
        }
    }
})();




window.onbeforeunload = function() {
    var restore = parseInt(window.location.pathname.replace(/[^\d]/g, ''));
    window.unloadData = {};
    window.unloadData.cid = claim.node(claim.formId)['claim[id]'].value;
    claim.onunload = ((isNaN(restore) || !restore) ? 1 : 0);
    if (!claim.saveForm && claim.onunload) {
        alert('Данная заявка не сохранена\r\nи находится на этапе создания,\r\nесли Вы продолжите,\r\nто все данные будут утеряны!');
        return '?';
    }
    return void(0);
};

// удаление обавленных товаров при нажатии закрыть браузер
window.onunload = function() {
    if (!claim.saveForm && claim.onunload) {
        $.ajax({
            url      : linkPrefix + '/claim/returnsupply/dropclaims',
            cache    : false,
            data     : {claimId : window.unloadData.cid},
            type     : 'POST',
            dataType : 'html',
            async    : false,
            success  : function(data){}
        });
    }
    if (!claim.saveForm && !claim.userBlockInfo) {
        $.ajax({
            url      : linkPrefix + '/claim/out/unblockclaim',
            cache    : false,
            data     : {claimId : window.unloadData.cid},
            type     : 'POST',
            dataType : 'html',
            async    : false,
            success  : function(data){}
        });
    }
};
