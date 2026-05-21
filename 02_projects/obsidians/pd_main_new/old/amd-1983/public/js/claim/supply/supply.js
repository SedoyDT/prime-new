var claim = new (function()
{
    this.formId           = 'supply-form';
    this.precision        = 0.00001;
    this.perm             = {};
    this.onunload         = false;
    this.saveForm         = false;
    this.claimStatus      = 0;
    this.timeOut          = null;
    this.сarNumberList    = [];
    this.unloadRequired   = 1;

    /**
     * общая шина событий для связки различных компонентов
     */
    this.eventBus = new EventBus();

    /**
     * хранит текущий статус завяки
     * 1 - создание
     * 2 - диспетчер
     * 0 - любой другой
     * @var Boolean
     */
    this.carStatusFlag = true;

    /**
     * Angular контроллер
     * @type {SupplyController}
     */
    this.$ctrl;

    /**
     * Установить поле с контроллером
     * @param {SupplyController} $ctrl
     */
    this.setAngularController = function ($ctrl)
    {
        this.$ctrl = $ctrl;
    }

    /**
     * Получить id заявки // метод Гургена
     * @returns {String}
     */
    this.getClaimId = function()
    {
        return window.location.pathname.replace(/[^\d]/g, '');
    };


    this.getClaimProductsDepotId = function()
    {
        let productFields = $('#table_products input[type="hidden"].product-depot-id');
        let depotIdSet    = new Set();
        let depotId       = null;

        productFields.each(function(index, element)
        {
            depotIdSet.add(element.value);
        });

        if (depotIdSet.size > 1) {
            alert('Найдены товары с разым складом! Обратитесь к администратору');
        } else if (depotIdSet.size === 1) {
            depotId = parseInt(depotIdSet.values().next().value);
        }

        return depotId;
    }


    /**
     * Получить тип заявки
     * @returns {Number}
     */
    this.getClaimType = function ()
    {
        return 3;
    };


    /**
     * Получить строки с данными товаров
     * @returns {jQuery}
     */
    this.getProductRows = function()
    {
        return $('#table_products').find('tr[rowtype="productstart"]');
    };


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
     * инициализация заявки
     */
    this.start = function()
    {
        $('#claim_date').datepicker({duration: 'fast', showAnim: 'fadeIn'});
        this.createGoodsFilter();
        $('#products').css({
            width: document.body.clientWidth - 40 + 'px'
        });
        this.updateTotals(1);
        this.node(this.formId).onsubmit = function() {
            return claim.checkForm(this);
        };
        var clid = window.location.pathname.replace(/[^\d]/g, '');
        this.onunload = ((isNaN(clid) || !clid) ? true : false);
        this.showBlockClaimInfo();
        this.showBlockClaimError();
        this.productEvents();

        this.dataContainer = new DataContainer();

        if (window.DepotIndex) {
            this.depotIndex = new DepotIndex({
                preset: 'claim',
                eventBus: this.eventBus,
            });
        }

        if (window.Dispatcher) {
            this.dispatcher = new Dispatcher({
                preset: 'claim',
                dataContainer: this.dataContainer,
                updateCarListActionUrl: '/claim/supply/get-dispatcher-drivers/',
                eventBus: this.eventBus,
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
                preset: 'claim',
            });
        }

        if (window.ServiceNote) {
            this.serviceNote = new ServiceNote({});
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
     * создание узла дом
     */
    this.crnode = function(el)
    {
        return document.createElement((el||'div'));
    };

    /**
    * get element by id
    * @param string id
    * @return link to Node
    */
    this.node = function(id)
    {
        return typeof id == 'string' ? document.getElementById(id) : id;
    };

    /**
     * получить елемент формы
     */
    this.element = function(name)
    {
        return this.node(this.formId)[name];
    };

    /**
    * преобразование строки во float  с точностью 5 знаков после запятой
    * @param string str
    * @return float
    */
    this.toFloat = function(str)
    {
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
    * удаляет все дочерние елементы из заданного контейнера
    * @param node|string obj
    * @return void
    */
    this.empty = function(obj)
    {
        obj = this.node(obj);
        while(obj.firstChild) {
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
     * Алиасы для грида
     */
    this.aliace = function(v, cnt, rowData)
    {
        let title = `
            <span style="text-decoration: underline; cursor: pointer;">
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

        return title;
    };


    /**
     * compres data
     */
    this.compresData = function(data)
    {
        var tmp = [];
        var tpl = '';
        var getType = function(obj) {
            return obj.constructor.toString().toLowerCase().match(/(\w+)\(/)[1];
        };
        for(var i in data) {
            switch((typeof data[i]).toLowerCase()) {
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

    /* filter claim products START */

    /**
     * управление добавленными товарами
     */
    this.showClaimGoodsFilter = function(obj)
    {
        if (obj.lang == 0) {
            $('#filter-claim-goods-cnt').css({overflow:'hidden'}).animate({height:'0px', opacity:0}, 200);
            obj.lang = 1;
            obj.src = '/img/system/fieldsShowF.png';
        }else {
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
            urlGetFullData:linkPrefix + '/claim/supply/getproductfilterconfig',
            // получение маски для для полей
            urlGetMaskData:linkPrefix + '/claim/supply/getproductmaskfilter',
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
        this.filter.onBeforeRebuild = function() {
            this.addPostData = claim.getAllProductsIds();
            this.addPostData.products = serialize(this.addPostData.products);
        };
        this.filter.onAfterRebuild = function() {
            claim.applyProductFilter(this.getValue());
            claim.recountSumm();
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
            url      : linkPrefix + '/claim/supply/getproductfilterdata',
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
     * показать скрыть продукт
     */
    this.showHideProducts = function(data)
    {
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
    /* filter claim products END */

    this.productEvents = function()
    {
        $('input.account-type-checkbox').live('click', function(event)
        {
            claim.accountTypeChange(this);
        });
    }

    /**
     * Синхронизировать все товары в зависимости от типа учета
     * @returns {void}
     */
    this.accountTypeSyncAll = function()
    {
        $('input.account_type').each(function(index, el)
        {
            claim.accountTypeSync(el);
        });
    }

    /**
     * Синхронизировать все товар в зависимости от типа учета
     * @param {object} input
     * @returns {void}
     */
    this.accountTypeSync = function(input)
    {
        var row = $(input).parents('tr[rowtype="productstart"]');
        var type = $(row).find('input[name="products[' + row.attr('pnumber') + '][type]"]').val();
        //Выбор секций товара
        row.siblings('tr[rowtype="section"][pnumber="' + row.attr('pnumber') + '"]').each(function(index, section)
        {
            var fweight = $(this).find('input[name*="[fweight]"]');
            //Если тип учета в шт
            //факт. вес = кол-во
            //дизейбл поля фактического веса для секции
            if (input.value == claim.accountTypes.quantity && type == claim.accountTypes.quantity) {
                row.find('input[name*="[fweight]"]').val(row.find('input[name*="[amount]"]').val());
                fweight.val('');
                fweight.attr('disabled', true);
            } else {
                //fweight.val('');
                fweight.attr('disabled', false);
                //row.find('input[name*="[fweight]"]').val('');
            }
        });
    }

    /**
     * Обработчик нажатия на параметр "Списание в шт."
     * @param {object} checkbox
     * @returns {void}
     */
    this.accountTypeChange = function(checkbox)
    {
        var row = $(checkbox).parents('tr[rowtype="productstart"]');
        var input = $(row).find('input.account_type');
        if (checkbox.checked) {
            input.val(claim.accountTypes.quantity);
        } else {
            input.val(claim.accountTypes.weight);
        }
        this.accountTypeSync(input[0]);
    }

    /**
     * фильтр для манагеров
     */
    this.manager = {
        parent:this,
        managerList:[],
        filter:function(obj) {
            var options = this.parent.node(obj.lang).options;
            if (!this.managerList.length) {
                for(var i = 0; i < options.length; i++) {
                    this.managerList.push({id : options[i].value, text : options[i].text});
                }
            }
            options.length = 1;

            var val = obj.value.replace(/^\s+|\s+$/, '').toLowerCase();

            for(var i=1; i<this.managerList.length; i++) {
                if (this.managerList[i].text.toLowerCase().indexOf(val) == -1) {
                    continue;
                }

                options[options.length] = new Option(this.managerList[i].text, this.managerList[i].id);
            }
            if (typeof this.parent.node(obj.lang).lastValue != 'undefined') {
                this.parent.node(obj.lang).value = this.parent.node(obj.lang).lastValue;
            }

            this.change(this.parent.node(obj.lang), 1);
        },
        change: function(obj, not) {
            if (!not) {
                obj.lastValue = obj.value;
            }
        },
        value: function() {
            return parseInt(this.parent.element('claim[managerId]').value);
        }
    };

    /**
     * фильтр для клиентов
     */
    this.client = {
        parent:this,
        clientList:[],
        filter:function(obj) {
            var options = this.parent.node(obj.lang).options;
            if (!this.clientList.length) {
                for(var i = 0; i < options.length; i++) {
                    this.clientList.push({id : options[i].value, text : options[i].text, wtime:options[i].getAttribute('lang')});
                }
            }
            options.length = 1;

            var val = obj.value.toLowerCase().trim();

            for(var i=1; i<this.clientList.length; i++) {
                if (this.clientList[i].text.toLowerCase().indexOf(val) == -1) continue;

                options[options.length]   = new Option(this.clientList[i].text, this.clientList[i].id);
                options[options.length-1].setAttribute('lang', this.clientList[i].wtime);
            }
            if (typeof this.parent.node(obj.lang).lastValue != 'undefined') {
                this.parent.node(obj.lang).value = this.parent.node(obj.lang).lastValue;
            }

            this.change(this.parent.node(obj.lang), 1);
        },
        change: function(obj, not) {
            if (!not) {
                obj.lastValue = obj.value;
            }
            claim.node('claim-client-work-time').innerHTML = '<span style="font-size: 10pt; font-weight: bold;">Время работы : </span>' + obj.options[obj.selectedIndex].getAttribute('lang');
        },
        value: function() {
            return parseInt(this.parent.element('claim[clientId]').value);
        }
    };

    /**
     * машина
     */
    this.car = {
        parent:this,
        tid:'car_claim_tbody',

        /**
         * синхронизация данных по машине
         * @param nodeObject obj
         * @param integer idChangedCar принимает id выбранной при быстром поиске по машине
         * @return void
         */
        changeNumber:function(obj, idChangedCar) {
            var claim = this.parent;
            claim.element('claim[driverName]').value = '';
            claim.element('claim[driverPhone]').value = '';

            //если значение idChangedCar передано из быстрого поиска заполняем поля имя и телефон водителя
            if (idChangedCar) {
                for (var key in claim.dataContainer.get('carList')) {
                    if (claim.dataContainer.get('carList')[key].id != idChangedCar) {
                        continue;
                    }
                    claim.element('claim[driverName]').value = claim.dataContainer.get('carList')[key].name;
                    claim.element('claim[driverPhone]').value = claim.dataContainer.get('carList')[key].phone;
                    return;
                }
            }

            for (var key in claim.dataContainer.get('carList')) {
                if (claim.dataContainer.get('carList')[key].id != obj.value) {
                    continue;
                }
                claim.element('claim[driverName]').value = claim.dataContainer.get('carList')[key].name;
                claim.element('claim[driverPhone]').value = claim.dataContainer.get('carList')[key].phone;
                break;
            }
        },
        changeRentPrice:function(obj) {
            obj.value = obj.value.replace(/[,]/g, '.');
            if (!/^\d+(\.(\d*))?$/.test(obj.value)) {
                obj.value = Math.abs(this.parent.toFloat(obj.value))||'';
            }
            if (/^0\d+/.test(obj.value)) {
                obj.value = obj.value.replace(/^0/, '');//obj.value = this.parent.toFloat(obj.value.replace(/^0+/, ''));
            }
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
            var options = self.el('inout_carNumber').options;
            options.length = 0;
            var search = obj.value.toLowerCase().replace(/^\s+|\s+$/, '');

            for (let key in self.dataContainer.get('carList')) {
                if (search.length && self.dataContainer.get('carList')[key].carNumber.toLowerCase().indexOf(search) == -1) {
                    continue;
                }
                options[options.length] = new Option(self.dataContainer.get('carList')[key].carNumber, self.dataContainer.get('carList')[key].id);
            }
            options.length ? self.car.changeNumber('inout_carNumber', options[0].value) : self.car.changeNumber('inout_carNumber');
        }, 500);
    };


    /**
     * получить список добавленных товаров
     */
    this.findAddedMaterial = function()
    {
        var data = [];
        var ids = '|';
        var p = null;
        var rows = this.node('table_products').rows;
        for(var i = 0; i < rows.length; i++) {
            p = rows[i].getAttribute('product');
            if (!p) {
                continue;
            }
            if (ids.indexOf(p + '|') != -1) {
                continue;
            }
            ids += (p + '|');
            data.push({id : p});
        }
        return data;
    };

    /* products navigator END */
    /* product edit START */

    /**
     * display edit/add product window
     */
    this.displayEditProductStart = function(data, ajax)
    {
        if (ajax) {
            $.ajax({
                url: '/claim/supply/getinfoblock',
                cache: false,
                data: {
                    itemId: data.productId,
                    depotId: data.depotId,
                    claimId: this.node(this.formId)['claim[id]'].value
                },
                type: 'POST',
                dataType: 'json',
                success  : function(data) {
                    if (data.error) {
                        claim.showError(data.error);
                    }else {
                        claim.displayEditProductStart(data);
                    }
                },
                error    : function(obj, text){
                    claim.showError(obj.responseText);
                }
            });
            return;
        }

        if (this.perm.products.editproduct == 4) {
            this._displayEditProductFull(data);
        }else {
            this._displayEditProductSimple(data);
        }
    };

    /**
     * редактирование с ручной блокировкой
     */
    this._displayEditProductFull = function(data)
    {
        if (this.overley2) return;
        this.overley2 = new overley();

        // Метод выполняет подготовку данных перед отображением
        function prepareData(data) {
            for (var i = 0; i < data.addinfo.length; i++) {
                ddRowProxyHandler.forEachDdmRow(data.addinfo[i], function (ddmRowData) {
                    if (!ddmRowData.cleanRowData) {
                        // Указываем исходные данные, если этого ещё не сделано
                        ddmRowData.cleanRowData = $.extend({}, ddmRowData);
                    }
                });
            }
        }

        prepareData(data);

        var itemType = this.overley2.itemType = data.type;

        this.overley2.tmpdata = data;
        this.overley2.tmpdata.claimId = this.node(this.formId)['claim[id]'].value;
        this.overley2.onAfterCreate = function() {
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
            $(wndcap).html('Расширенная информация по товару : ' + data.title + ' (ID:id)'.replace(/id/, data.id));
            wnd.appendChild(wndcap);

            // create wnd caption close button
            var wndcapbt = this.crnode();
            wndcapbt.className = 'filter-wnd-caption-close-button';
            wndcapbt.title = 'закрыть диалог';
            wnd.appendChild(wndcapbt);
            wndcapbt.onclick = function() {
                claim.overley2.close();
            };

            // create info;
            var cntgrid = this.crnode();
            cntgrid.id = this.blockId + '_grid';
            cntgrid.style.width = '1140px';
            cntgrid.align = 'left';
            area.appendChild(cntgrid);

            if (data.addinfo.length) {
                var cntinfo = this.crnode();
                cntinfo.id = this.blockId + '_old_data_block';
                cntinfo.style.minHeight = '30px';
                cntinfo.style.paddingTop = '10px';
                cntinfo.style.color = 'black';
                cntinfo.style.fontSize = '10pt';
                cntinfo.align = 'left';
                area.appendChild(cntinfo);
                var table = this.crnode('table');
                table.cellSpacing = 0;
                table.border = 0;
                table.cellPadding = 1;
                cntinfo.appendChild(table);

                // Старые значения
                if (!data.oldDataBlockValues) {
                    data.oldDataBlockValues = {amount: 0, boxes: 0};

                    for (var i = 0; i < data.addinfo.length; i++) {
                        ddRowProxyHandler.forEachDdmRow(data.addinfo[i], function(ddmRowData) {
                            data.oldDataBlockValues.amount += claim.toFloat(ddmRowData.cleanRowData.curBlockAmount);
                            data.oldDataBlockValues.boxes += claim.toFloat(ddmRowData.cleanRowData.curBlockBoxes);
                        });
                    }
                }

                // Текущие значения
                var cur = {amount: 0, boxes: 0};
                for(var i = 0; i < data.addinfo.length; i++) {
                    ddRowProxyHandler.forEachDdmRow(data.addinfo[i], function(ddmRowData) {
                        cur.amount += claim.toFloat(ddmRowData.curBlockAmount);
                        cur.boxes += claim.toFloat(ddmRowData.curBlockBoxes);
                    });
                }

                var row = table.insertRow(0);
                row.style.backgroundColor = '#cacaca';
                $(row.insertCell(0)).attr({width:65, align:'right'}).html('Было : ');
                $(row.insertCell(1)).attr({width:150, align:'right'}).css({color:'#333'}).html('Кол-во/общий вес ');
                $(row.insertCell(2)).attr({width:100, align:'center'}).html(data.oldDataBlockValues.amount);
                $(row.insertCell(3)).attr({width:230, align:'right'}).css({color:'#333'}).html('Кол-во упаковок/кол-во роликов');
                $(row.insertCell(4)).attr({width:100, align:'center'}).html(data.oldDataBlockValues.boxes);
                //Если проставлено значение кратности то выводим его
                if(parseInt(data.parity) > 0){
                    $(row.insertCell(5)).attr({width:200, align:'center'}).css({fontWeight:'bold'}).html("Коэффициент кратности");
                    $(row.insertCell(6)).attr({width:100, align:'center'}).css({fontWeight:'bold'}).html(data.parity);
                }
                var row = table.insertRow(1);
                $(row.insertCell(0)).attr({width:65, align:'right'}).html('Стало : ');
                $(row.insertCell(1)).attr({width:150, align:'right'}).css({color:'#333'}).html('Кол-во/общий вес ');
                $(row.insertCell(2)).attr({width:100, align:'center'}).html(cur.amount);
                $(row.insertCell(3)).attr({width:230, align:'right'}).css({color:'#333'}).html('Кол-во упаковок/кол-во роликов');
                $(row.insertCell(4)).attr({width:100, align:'center'}).html(cur.boxes);
            }



            // create information grid
            this.grid = new Grid({
                conteinerId : cntgrid.id,
                imgError : '/img/system/error.16.png',
                imgLoader : '/img/ld/ld3.gif',
                perpage : 10,
                displayPaging : 0,
                useCorrectionScrollWidth : false
            });

            this.grid.head = {
                id:      {caption:'ID', width:50},
                title:   {caption: configTitle,   width:160, aliace:claim.aliace, align:'left'},
                prop:    {caption: configProp,    width:80,  aliace:function(v, cnt, rowData){ return eval(configPropReturn);}},
                color:   {caption: configColor,   width:100, aliace:function(v, cnt, rowData){ return eval(configColorReturn);}},
                boxType: {caption: configBoxType, width:80,  aliace:function(v, cnt, rowData){ return eval(configBoxTypeReturn);}},
                volum:   {caption: configVolum,   width:80,  aliace:function(v, cnt, rowData){ return eval(configVolumReturn);}},
                height:  {caption: configHeight,  width:80,  aliace:function(v, cnt, rowData){
                        // Отображение реального поставщика
                        showVendornameTitle(rowData, cnt);
                        return eval(configHeightReturn);
                    }
                },
                width:   {caption: configWidth,   width:80,  aliace:function(v, cnt, rowData){ return eval(configWidthReturn);}},
                depth:   {caption: configDepth, width:80,  aliace:function(v, cnt, rowData){ return eval(configDepthReturn);}},
                labelWeight:{caption: configLabelWeight, width:80, sort:1, aliace:function(v, cnt, rowData){ return eval(configLabelWeightReturn);}},
                inBoxes: {caption:'Кол-во в упаковке / средний вес ', width:100,  aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                amountWeight : {caption:'Кол-во (штук) / общий вес', width:100,  aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                boxesRols :    {caption:'Кол-во упаковок / кол-во роликов', width:100,  aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                description :  {caption:'Примечание', width:200,  aliace:function(v, cnt, rowData){ return (v||'');}}
            };


            this.grid.create();
            this.grid.data = [data];
            this.grid.update();
            // create cubpunel for select all
            var cntinfo = this.crnode();
            cntinfo.appendChild(claim.crtxtnode('Информация по приходам '));
            cntinfo.style.paddingTop = '10px';
            cntinfo.style.textAlign = 'left';
            var all = this.crnode('label');
            $(all).css({'float':'right', 'margin-right':'20px'});
            all.appendChild(claim.crtxtnode('забрать все : '));
            var ch =  this.crnode('input');
            ch.type = 'checkbox';
            ch.id = this.blockId + '_get_all';
            ch.style.verticalAlign = 'middle';
            ch.disabled = (claim.perm.products.amount < 4 && claim.perm.products.boxes < 4);
            ch.onchange = function() {
                claim.overley2.getAll(this);
            };
            all.appendChild(ch);
            cntinfo.appendChild(all);
            area.appendChild(cntinfo);

            // create conteier for comment data

            // create conteier for input amount/boxes
            var cntinfo = this.crnode();
            cntinfo.id = this.blockId + '_info';
            cntinfo.setAttribute('class', 'block_info');
            cntinfo.setAttribute('item_type', data.type);
            cntinfo.style.minHeight = '30px';
            cntinfo.style.paddingTop = '10px';
            cntinfo.align = 'left';
            area.appendChild(cntinfo);

            this.grid2 = new Grid({
                conteinerId : this.blockId + '_info',
                imgError    : '/img/system/error.16.png' ,
                imgLoader   : '/img/ld/ld3.gif',
                perpage     : 15
            });

            // Ширина таблицы детализаций
            var ddmSubtableWidth = 0;
            DdmSubtableFieldsClasses.forEach(function(fieldClass) {
                ddmSubtableWidth += fieldClass.prototype.width;
            });

            this.grid2.head = {
                task:    {caption:'Заявка',             width:100},
                date:    {caption:'Дата',               width:75},
                price:   {caption:'Цена',               width:75,  aliace : function(v, cnt, rowData) { return (claim.toFloat(v)||'');}},
                placing: {caption:'Секция', width:100},
                depot_detailed_manager_subtable : {
                    caption : ((function() {
                        var result =
'<table cellpadding="0" cellspacing="0">\n\
    <tr>';
                        DdmSubtableFieldsClasses.forEach(function(fieldClass) {
                            var field = fieldClass.prototype;

                            result +=
'\
        <td width="' + field.width + '" data-field-name="' + (field.name ? field.name : '') + '">\n\
            <div>' + field.caption + '</div>\n\
        </td>\n\
';
                        });

                        result +=
    '</tr>\n\
</table>';
                        return result;
                    })()),
                    width   : ddmSubtableWidth,
                    aliace  : function(v, cnt, rowData, rowIndex) {
                        // Массив детализаций
                        var ddmRows = [];
                        // Обработчик для Proxy
                        var proxyHandler;

                        if (rowData.depot_detailed_manager_rows.length > 1) {
                            // Если больше одной детализации, отображаем строку с суммарными данными

                            // Модель для строки "Итого"
                            var summaryRow = new DdmRowsSummaryRow({rows: ddmRows});

                            proxyHandler = new (DdmRowProxyHandler.extend({
                                set: function(target, name, value, receiver) {
                                    this._super(target, name, value, receiver);

                                    if (_tools.inArray(name, ['curBlockAmount', 'curBlockBoxes'])) {
                                        // При изменении соответствующих полей выполняем пересчет
                                        summaryRow.update();
                                    }
                                }
                            }));
                        } else {
                            proxyHandler = ddmRowProxyHandler;
                        }

                        // Каждую детализацию оборачиваем в Proxy
                        rowData.depot_detailed_manager_rows.forEach(function(ddmRowData) {
                            ddmRows.push(new Proxy(ddmRowData, proxyHandler));
                        });

                        var table = $('<table cellpadding="0" cellspacing="0"></table>');

                        ddmRows.forEach(function(ddmRow) {
                            var tr = $('<tr>');

                            if (!ddmRow.availableWorkWithRow) {
                                // Если у пользователя нет прав для работы со строкой
                                tr.addClass('disableWorkWithRow').attr('title', 'Блокировка зарезервированного под менеджеров количества недоступна для данной заявки');
                            }

                            (new DdmSubtableRowColumnsBuilder({
                                fieldsClasses: DdmSubtableFieldsClasses,
                                fieldParams: {bindedRowData: ddmRow}
                            })).build().forEach(function(td) {
                                tr.append(td);
                            });

                            table.append(tr);
                        });

                        // Если необходимо, добавляем строку с суммарной информацией
                        if (rowData.depot_detailed_manager_rows.length > 1) {
                            summaryRow.initValues();

                            var tr = $('<tr class="summary">');

                            (new DdmSubtableRowColumnsBuilder({
                                fieldsClasses: DdmSubtableSummaryRowFieldsClasses,
                                fieldParams: {bindedRowData: summaryRow}
                            })).build().forEach(function(td) {
                                tr.append(td);
                            });

                            table.append(tr);
                        }

                        return table;
                    }
                },
                save:    {
                    caption: ' ',
                    width: 50,
                    aliace: function(v, cnt, rowData) {
                        if ((new Proxy(rowData, ddRowProxyHandler)).availableWorkWithRow) {
                            // Если пользователь имеет право на работу с записью, выводим кнопку
                            return '<input disabled itype="save" type="button" style="cursor:pointer; width:40px; border:none; background:transparent url(/img/system/reserve.16.png) no-repeat center center">';
                        }

                        return '';
                    }
                },
                clear:   {
                    caption: ' ',
                    width: 50,
                    aliace: function(v, cnt, rowData) {
                        if ((new Proxy(rowData, ddRowProxyHandler)).availableWorkWithRow) {
                            // Если пользователь имеет право на работу с записью, выводим кнопку
                            return '<input itype="clear" type="button" style="cursor:pointer; width:40px; border:none; background:transparent url(/img/system/clear.16.png) no-repeat center center">';
                        }

                        return '';
                    }
                }
            };

            if (claim.perm.products.amount < 4 && claim.perm.products.boxes < 4) {
                delete(this.grid2.head.info);
                delete(this.grid2.head.clear);
            }
            if (claim.perm.products.sectionprice < 2) {
                delete(this.grid2.head.price);
            }
            this.grid2.create();
            this.grid2.data = data.addinfo;
            this.grid2.onAfterUpdate = function() {
                claim.overley2.cntToCenter();
                claim.overley2.controlButtonsGrid2();
            };
            this.grid2.update();
            this.grid2.onClick = function(dataRowIndex, dataColIndex, node) {
                if (node.nodeName.toLowerCase() != 'input') return;
                if (dataColIndex == 'clear') {
                    claim.overley2.grid2.data[dataRowIndex].curBlockAmount = 0;
                    claim.overley2.grid2.data[dataRowIndex].curBlockBoxes = 0;

                    // Очищаем детализации
                    ddRowProxyHandler.forEachDdmRow(claim.overley2.grid2.data[dataRowIndex], function(ddmRowData) {
                        if ((new Proxy(ddmRowData, ddmRowProxyHandler)).availableWorkWithRow) {
                            // Если есть возможность работы со строкой (с блокировкой под менеджера)

                            if (parseInt(claim.perm.products.amount) === 4) {
                                // Если есть права редактировать количество
                                ddmRowData.curBlockAmount = '';
                                ddmRowData.touched = true;
                            }

                            if (parseInt(claim.perm.products.boxes) === 4) {
                                // Если есть права редактировать коробки
                                ddmRowData.curBlockBoxes = '';
                                ddmRowData.touched = true;
                            }
                        }
                    });

                    // Обновляем грид
                    claim.overley2.grid2.update();

                    // Обновляем "Было/Стало"
                    claim.overley2.updateOldDataBlock();
                }
                if (dataColIndex == 'save') {
                    // Перед отправкой проверяем на кратность
                    if (itemType == 2) {
                        var ddRow = new Proxy(this.data[dataRowIndex], ddRowProxyHandler);
                        if (ddRow.curBlockBoxes % data.parity) {
                            claim.showError('Количество товара должно быть кратно коэффициенту кратности = ' + data.parity, function () {});
                            return false;
                        }
                    }

                    var ddRowData = this.data[dataRowIndex];

                    claim._displayEditproductEnd({
                        claimId : claim.overley2.tmpdata.claimId,
                        depotId: claim.overley2.tmpdata.depotId,
                        data : [ddRowData],
                        itemId : claim.overley2.tmpdata.id,
                        pnumber : claim.getProcuctNumber(claim.overley2.tmpdata.id),
                        afterClose : 0,
                        extSectionData: claim.overley2.tmpdata, // Передаем текущие данные, чтобы новая форма отрисовывалась на их основе
                        beforeGridUpdate: function() {
                            // Перед обновлением грида обновим исходное состояние детализаций по сохраняемой секции
                            ddRowProxyHandler.forEachDdmRow(ddRowData, function(ddmRowData) {
                                ddmRowData.cleanRowData = $.extend({}, ddmRowData);
                            });
                        },
                        afterGridUpdate: function() {
                            // После обновления обновляем кнопки футера
                            claim.overley2.controlButtonsGrid2();
                        }
                    }, 1);
                }
            };

            // create button conteiner
            var cntinfo = this.crnode();
            cntinfo.style.paddingTop = '10px';
            cntinfo.style.textAlign = 'right';
            // control close after save
            var all = this.crnode('label');
            $(all).css({'float':'left'});
            var ch =  this.crnode('input');
            ch.type = 'checkbox';
            ch.id = this.blockId + '_close_after_save';
            ch.style.verticalAlign = 'middle';
            ch.checked = true;
            all.appendChild(ch);
            all.appendChild(claim.crtxtnode(' закрыть после сохранения '));
            if (claim.perm.products.amount == 4) {
                cntinfo.appendChild(all);
            }
            // create button ok
            var btok = this.crnode('input');
            btok.type = 'button';
            btok.disabled = true;
            btok.id = this.blockId + '_bt_ok';
            btok.value = 'Принять';
            btok.style.width = '125px';
            btok.onclick = function() {
                var data = {
                    claimId    : claim.overley2.tmpdata.claimId,
                    depotId    : claim.overley2.tmpdata.depotId,
                    data       : claim.overley2.grid2.data,
                    itemId     : claim.overley2.tmpdata.id,
                    pnumber    : claim.getProcuctNumber(claim.overley2.tmpdata.id),
                    parity     : claim.overley2.tmpdata.parity,
                    afterClose : claim.node(claim.overley2.blockId + '_close_after_save').checked
                };

                if (data.data.length && data.data[0].type == 1) {
                    var message = [];

                    for(var i = 0; i < data.data.length; i++) {
                        ddRowProxyHandler.forEachDdmRow(data.data[i], function(ddmRowData) {
                            var tmp = ddmRowData;

                            if (
                                parseFloat(tmp.amount) > parseFloat(tmp.curBlockAmount) &&
                                parseFloat(tmp.curBlockAmount) > 0 &&
                                parseFloat(tmp.curBlockAmount) % parseFloat(tmp.average)
                            ) {
                                var text = ' в секции ' + data.data[i].placing + ' под менеджера "' + tmp.user_name + '" кол-во ';
                                text += tmp.curBlockAmount;
                                text += ' не кратно кол-ву в упаковке ';
                                text += tmp.average;
                                text += '<br>    - ближайшее наименьшее ' + Math.floor(tmp.curBlockAmount / tmp.average) * tmp.average;
                                text += '<br>    - ближайшее наибольшее ' + (Math.ceil(tmp.curBlockAmount / tmp.average) * tmp.average <= tmp.amount ? Math.ceil(tmp.curBlockAmount / tmp.average) * tmp.average : tmp.amount);
                                message.push(text);
                            }
                        });
                    }

                    //Если разрешено дробление товаров придупреждение иначе сообщение с запретом
                    if (message.length) {
                        if(claim.splitgoods === 1) {
                            message.push('<br> Вы уверены в правильности указанного кол-ва?');
                            data.caption = 'Внимание';
                            data.msg = 'Внимание!<br>' + message.join('<br>');
                            claim.showAhtung(data, function(data) {
                                if (claim.perm.products.sectionedit == 4) {
                                    claim._displayEditproductEnd(data, 1);
                                    return;
                                }
                                if (!claim.overley2.checkChangeTotal()) {
                                    claim._displayEditproductEnd(data, 1);
                                    return;
                                }else {
                                    data.caption = 'Изменение кол-ва';
                                    data.msg = 'Введенное значение "Кол-во/общий вес" отличается от изначального,<br>подтверждаете изменения?';
                                    claim.showAhtung(data, function(o) {
                                        claim._displayEditproductEnd(o, 1);
                                    });
                                }
                            });
                        } else {
                            claim.showError('Нельзя добавить количество товара не кратное его количеству в упаковке ' + tmp.average, function(){});
                        }
                        return false;
                    }
                }

                // Если количество не соответстует кратности товара запрет
                if (data.data.length && data.data[0].type == 2) {
                    for (var i = 0; i < data.data.length; i++) {
                        var ddRow = new Proxy(data.data[i], ddRowProxyHandler);

                        if (ddRow.curBlockBoxes % data.parity) {
                            claim.showError('Количество товара должно быть кратно коэффициенту кратности = ' + data.parity, function () {});
                            return false;
                        }
                    }
                }

                if (!claim.confirmChangeBlock) {
                    claim._displayEditproductEnd(data, 1);
                    return 1;
                }
                if (!claim.overley2.checkChangeTotal()) {
                    claim._displayEditproductEnd(data, 1);
                    return 1;
                }
                data.caption = 'Изменение кол-ва';
                data.msg = 'Введенное значение "Кол-во/общий вес" отличается от изначального,<br>подтверждаете изменения?';
                claim.showAhtung(data, function(o) {
                    claim._displayEditproductEnd(o, 1);
                });
                return 1;
            };
            if (claim.perm.products.amount == 4 || claim.perm.products.boxes == 4) {
                cntinfo.appendChild(btok);
            }

            // create button cancel
            var btcn = this.crnode('input');
            btcn.type = 'button';
            btcn.value = 'Отмена';
            btcn.style.width = '125px';
            btcn.onclick = function() {
                claim.overley2.close();
            };
            cntinfo.appendChild(btcn);
            // add buttons comteiner
            area.appendChild(cntinfo);
            // to center popup
            this.cntToCenter();


            // Небольшой костыль для ширины контейнера
            $('td[lang="depot_detailed_manager_subtable"] > div').css('width', this.grid2.head.depot_detailed_manager_subtable.width);

            $('td[lang="depot_detailed_manager_subtable"] > div').each(function(i, target) {
                $(target).css('height', $(target).parents('td:first').height());
            });
        };
        this.overley2.onBeforeClose = function() {
            this.grid.close(); this.grid2.close();
        };
        this.overley2.onAfterClose = function() {
            delete(claim.overley2);
        };
        this.overley2.restore = function() {
            var obj = this.getCnt();
            $(obj).css({'background-image':'', 'background-position':'center center', 'background-repeat':'no-repeat'});
            this.onBeforeClose();
            $(obj).empty();
            this.onAfterCreate();
        };

        this.overley2.updateCelldata = function(obj, type, data) {
            // Флаг, сигнализирующий о том, что строка была отредактирована.
            // В дальнейшем используется для сохранения на сервере.
            data.touched = true;

            obj.value = obj.value.replace(/[,]/g, '.');

            // Регулярное выражение для проекта с дробными значениями блокировки
            var floatNumbers = /^\d+(\.\d*)?$/;
            // Регулярное выражение для проекта с целыми значениями блокировки
            var integerNumbers = /^\d+?$/;

            var expression = (BLOCK_DOUBLE) ? floatNumbers : integerNumbers;

            if (type == 'curBlockBoxes' && data.type == 2) {
                if (!expression.test(obj.value)) {
                    obj.value = Math.ceil(Math.abs(claim.toFloat(obj.value)));
                }
            } else {
                if (data.type == 2) {
                    if (!/^\d+(\.(\d*))?$/.test(obj.value)) {
                        obj.value = Math.abs(claim.toFloat(obj.value));
                    }
                } else {
                    if (!/^\d+?$/.test(obj.value)) {
                        obj.value = Math.ceil(Math.abs(claim.toFloat(obj.value)));
                    }
                }
            }

            // если блокировать можно только целое значение
            // то проверка на первый 0
            if (!BLOCK_DOUBLE) {
                obj.value = obj.value.replace(/^0+/, '');
            } else {
                if (obj.value.length > 1 && obj.value.charAt(1) != '.') {
                    obj.value = obj.value.replace(/^0+/, '');
                }
            }

            // change boxes
            if (data.type == 2) {
                var maxVal = data.maxAmount - data.confirmAmount;
                if (type == 'curBlockBoxes') {
                    var controlValue = Math.round(claim.toFloat(data.boxes));
                    if (BLOCK_DOUBLE) {
                        if (obj.value > parseFloat(data.maxBoxes)) {
                            obj.value = data.maxBoxes;
                        }
                    } else {
                        if (obj.value > controlValue) {
                            obj.value = controlValue;
                        }
                    }

                    var boxes = obj.value;
                    var amount = claim.round(boxes * data.average);

                    if (!BLOCK_DOUBLE) {
                        if (data.otherblock - data.confirmBoxes > 0 || boxes < controlValue) {
                            maxVal -= 1;
                        }
                    }
                    if (amount > maxVal || claim.toFloat(data.confirmBoxes) + boxes == data.maxBoxes) {
                        amount = maxVal;
                    }

                    data.curBlockAmount = amount;
                } else {
                    var amount = claim.toFloat(obj.value);
                    if (BLOCK_DOUBLE) {
                        if (obj.value > Math.round(parseFloat(data.maxAmount))) {
                            obj.value = data.maxAmount;
                        }
                    } else {
                        if (data.otherblock - data.confirmBoxes > 0 || data.curBlockBoxes < data.boxes) {
                            maxVal -= 1;
                        }
                        if (amount > maxVal) {
                            amount = maxVal;
                        }
                        if (claim.toFloat(data.maxBoxes) == claim.toFloat(data.curBlockBoxes) + claim.toFloat(data.confirmBoxes)) {
                            amount = maxVal;
                        }
                    }

                    // Если доступное значение для блокировки больше чем то, что введено с формы
                    data.curBlockAmount = (maxVal > claim.toFloat(obj.value))
                        // Всё верно, позволяем его установить (включая символ ".", ничего страшного это потом обработается)
                        ? obj.value
                        // Если введённое значение превышает максимально допустимое, то берём максимально допустимое (сбрасываем значение пользователя)
                        : amount;

                    if (!BLOCK_DOUBLE) {
                        if (amount > 0 && data.curBlockBoxes == 0) {
                            var boxes = Math.ceil(obj.value / data.average);
                            boxes = boxes > data.boxes ? data.boxes : boxes;
                            data.curBlockBoxes = boxes;
                        } else if (amount < claim.precision) {
                            amount = '';
                            data.curBlockBoxes = 0;
                            data.curBlockAmount = 0;
                        }
                        if (Math.abs(claim.round(amount) - claim.toFloat(obj.value)) > claim.precision) {
                            obj.value = claim.round(amount);
                        }
                    }
                }
            }else {
                var controlValue = claim.toFloat(data[type.replace(/curBlock/, '').toLowerCase()]);
                if (obj.value > controlValue) {
                    obj.value = controlValue;
                }
                obj.value = claim.toFloat(obj.value);

                if (type == 'curBlockBoxes') {
                    var amount = claim.round(obj.value * data.average);
                    amount = amount > data.amount ? data.amount : amount;
                    data.curBlockAmount = amount;
                }else {
                    var boxes = claim.round(obj.value / data.average);
                    boxes = boxes > data.boxes ? data.boxes : boxes;
                    data.curBlockBoxes = boxes;
                }
            }

            this.updateOldDataBlock();

            // Контроль кнопок футера и чекбокса
            this.controlButtonsGrid2();
        };

        /**
         * Метод выполняет обновление блока "Было/стало"
         */
        this.overley2.updateOldDataBlock = function() {
            if (claim.node(this.blockId + '_old_data_block')) {
                var row = claim.node(this.blockId + '_old_data_block').firstChild.rows[1];
                var cur = {amount: 0, boxes: 0};
                for (var i = 0; i < this.grid2.data.length; i++) {
                    var ddRow = new Proxy(this.grid2.data[i], ddRowProxyHandler);

                    cur.amount += claim.toFloat(ddRow.curBlockAmount);
                    cur.boxes += claim.toFloat(ddRow.curBlockBoxes);
                }
                $(row.cells[2]).html(claim.toFloat(cur.amount));
                $(row.cells[4]).html(claim.toFloat(cur.boxes));
            }
        };

        this.overley2.controlButtonsGrid2 = function() {
            var maxBlock = 0;
            var curTotalBlock = 0;
            var saveAll = false;

            for (var i = 0; i < this.grid2.data.length; i++) {
                ddRowProxyHandler.forEachDdmRow(this.grid2.data[i], function(ddmRowData) {
                    maxBlock += claim.toFloat((itemType == 2 ? ddmRowData.boxes : ddmRowData.amount));
                    curTotalBlock  += claim.toFloat(ddmRowData[(itemType == 2 ? 'curBlockBoxes'  : 'curBlockAmount' )]);

                    var ddmRowProxy = new Proxy(ddmRowData, ddmRowProxyHandler);
                    if (ddmRowProxy.currentBlockValuesIsChanged) {
                        saveAll = true;
                    }
                });
            }

            claim.node(this.blockId + '_get_all').checked = (maxBlock == curTotalBlock);
            claim.node(this.blockId + '_get_all').previousSibling.data = (maxBlock == curTotalBlock ? 'отменить все : ' : 'забрать все : ');

            var rows = this.grid2.node().firstChild.childNodes.item(1).firstChild.rows || [];

            for(var i = 0; i < rows.length; i++) {
                var index = rows[i].dataRowIndex;
                var saveInp = this.getInputTypeRow(rows[i], 'save');
                var clearInp = this.getInputTypeRow(rows[i], 'clear');
                if (saveInp) {
                    saveInp.disabled = true;
                    saveInp.style.background = 'transparent url(/img/system/reserve.16.png) no-repeat center center';
                }
                if (clearInp) {
                    var ddRow = new Proxy(this.grid2.data[index], ddRowProxyHandler);
                    clearInp.disabled = !claim.toFloat(ddRow.curBlockAmount);
                }

                var currentBlockValuesIsChanged = false;
                ddRowProxyHandler.forEachDdmRow(this.grid2.data[index], function(ddmRowData) {
                    var ddmRowProxy = new Proxy(ddmRowData, ddmRowProxyHandler)
                    if (ddmRowProxy.currentBlockValuesIsChanged) {
                        currentBlockValuesIsChanged = true;
                    }
                });

                if (currentBlockValuesIsChanged) {
                    if (saveInp && claim.perm.products.sectionedit > 2 && this.grid2.head.info) {
                        saveInp.disabled = (!saveAll || curTotalBlock < claim.precision);
                        saveInp.style.background = 'transparent url(/img/system/save.16.png) no-repeat center center';
                    }
                }
            }

            if (claim.node(this.blockId + '_bt_ok')) {
                claim.node(this.blockId + '_bt_ok').disabled = (!saveAll || curTotalBlock < claim.precision);
            }
        };

        this.overley2.getInputTypeRow = function(row, type) {
            var inp = row.getElementsByTagName('input');
            for(var i = 0; i < inp.length; i++) {
                if (inp.item(i).getAttribute('itype') == type) {
                    return inp.item(i);
                }
            }
            return false;
        };

        this.overley2.getAll = function(obj) {
            obj.previousSibling.data = (obj.checked ? 'отменить все : ' : 'забрать все : ');
            var getAllAmountCell = function(boxes, data) {
                var amount = claim.round(boxes * data.average);
                var maxVal = data.maxAmount - data.confirmAmount;
                if ( data.otherBlock - data.confirmBoxes > 0 ) {
                    maxVal -= 1;
                }
                if (amount > maxVal || claim.toFloat(data.confirmBoxes) + boxes == claim.toFloat(data.maxBoxes)) {
                    amount = maxVal;
                }
                return amount;
            };
            for(var i = 0; i < this.grid2.data.length; i++) {
                ddRowProxyHandler.forEachDdmRow(this.grid2.data[i], function(ddmRowData) {
                    if ((new Proxy(ddmRowData, ddmRowProxyHandler)).availableWorkWithRow) {
                        // Если есть возможность работы со строкой (с блокировкой под менеджера)

                        if (parseInt(claim.perm.products.amount) === 4) {
                            // Если есть права редактировать количество
                            ddmRowData.curBlockAmount = (obj.checked ?
                                (itemType == 2 ? getAllAmountCell( ddmRowData.boxes, ddmRowData) : ddmRowData.amount) :
                                0);
                            ddmRowData.touched = true;
                        }

                        if (parseInt(claim.perm.products.boxes) === 4) {
                            // Если есть права редактировать коробки
                            ddmRowData.curBlockBoxes  = (obj.checked ? ddmRowData.boxes  : 0);
                            ddmRowData.touched = true;
                        }
                    }
                });
            }
            this.grid2.update();
            if (claim.node(this.blockId + '_old_data_block')) {
                var row = claim.node(this.blockId + '_old_data_block').firstChild.rows[1];
                var cur = {amount:0, boxes:0};
                for(var i = 0; i < this.grid2.data.length; i++) {
                    cur.amount += claim.toFloat(this.grid2.data[i].curBlockAmount);
                    cur.boxes += claim.toFloat(this.grid2.data[i].curBlockBoxes);
                }
                $(row.cells[2]).html(claim.toFloat(cur.amount));
                $(row.cells[4]).html(claim.toFloat(cur.boxes));
            }

            this.updateOldDataBlock();
        };
        this.overley2.updateData = function(data) {
            prepareData(data);

            this.tmpdata = data;
            this.tmpdata.claimId = claim.node(claim.formId)['claim[id]'].value;
            this.grid.data = [data];
            this.grid.update();
            for(var i = 0; i < this.grid2.data.length; i++) {
                for(var j = 0; j < data.addinfo.length; j++) {
                    if (data.addinfo[j].detailed_id == this.grid2.data[i].detailed_id) {
                        data.addinfo[j].curBlockAmount  = this.grid2.data[i].curBlockAmount > data.addinfo[j].amount ? data.addinfo[j].amount : this.grid2.data[i].curBlockAmount;
                        data.addinfo[j].curBlockBoxes   = this.grid2.data[i].curBlockBoxes  > data.addinfo[j].boxes  ? data.addinfo[j].boxes  : this.grid2.data[i].curBlockBoxes;
                        break;
                    }
                }
            }
            this.grid2.data = data.addinfo;
            this.grid2.update();
        };
        this.overley2.checkChangeTotal = function() {
            var ctrlValue = this.tmpdata.curblock;
            var ctrlValue2 = 0;
            for(var i = 0; i < this.grid2.data.length; i++) {
                ctrlValue2 += claim.toFloat((this.tmpdata.type == 1 ? this.grid2.data[i].curBlockAmount : this.grid2.data[i].curBlockBoxes));
            }
            return Math.abs(claim.round(ctrlValue) - claim.round(ctrlValue2)) > claim.precision;
        };
        this.overley2.create();
    };

    /**
     * редактирование с автоматической блокировкой
     */
    this._displayEditProductSimple = function(data)
    {
        if (data.addinfo.managersBlocksCount > 0) {
            // Если товар является заказным, запрещаем использовать простую форму
            alert('Данный товар является заказным. Использование простой формы блокировки запрещено. Обратитесь к администратору.');
            return;
        }

        if (this.overley2) {
            return;
        }
        this.overley2 = new overley();
        this.overley2.tmpdata = data;
        this.overley2.tmpdata.claimId = this.node(this.formId)['claim[id]'].value;
        this.overley2.onAfterCreate = function() {
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
            $(wndcap).html('Расширенная информация по товару : ' + data.title + ' (ID:id)'.replace(/id/, data.id));
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
            cntgrid.style.width = '1010px';
            //cntgrid.style.height = '400px';
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
                id:      {caption:'ID', width:50},
                title:   {caption: configTitle,    width:160, aliace:claim.aliace, align:'left'},
                prop:    {caption: configProp,     width:80,  aliace:function(v, cnt, rowData){ return eval(configPropReturn);}},
                color:   {caption: configColor,    width:100, aliace:function(v, cnt, rowData){ return eval(configColorReturn);}},
                boxType: {caption: configBoxType,  width:80,  aliace:function(v, cnt, rowData){ return eval(configBoxTypeReturn);}},
                volum:   {caption: configVolum,    width:80,  aliace:function(v, cnt, rowData){ return eval(configVolumReturn);}},
                height:  {caption: configHeight,   width:80,  aliace:function(v, cnt, rowData){
                        // Отображение реального поставщика
                        showVendornameTitle(rowData, cnt);
                        return eval(configHeightReturn);
                    }
                },
                width:   {caption: configWidth,   width:80, aliace:function(v, cnt, rowData){ return eval(configWidthReturn);}},
                depth:   {caption: configDepth, width:80, aliace:function(v, cnt, rowData){ return eval(configDepthReturn);}},
                labelWeight:{caption: configLabelWeight, width:80, sort:1, aliace:function(v, cnt, rowData){ return eval(configLabelWeightReturn);}},
                inBoxes: {caption:'Кол-во в упаковке / средний вес ', width:100, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                amountWeight : {caption:'Кол-во (штук) / общий вес', width:100, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                boxesRols :    {caption:'Кол-во упаковок / кол-во роликов', width:100, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                description :  {caption:'Примечание', width:200, aliace:function(v, cnt, rowData){ return (v||'');}}
            };


            this.grid.create();
            this.grid.data = [data];
            this.grid.update();
            this.grid.onDblClick = function(rowIndex, field, node){
                if (field == 'title' && node.nodeName.toLowerCase() == 'span') {
                    return;
                }
            };
            this.grid.onClick = function(rowIndex, field, node) {
                if (field != 'title' || node.nodeName.toLowerCase() != 'span') {
                    return;
                }
                claim.flagInfoIn = true;
                setTimeout(function(data) {
                    if (claim.flagInfoIn) {
                        claim.showInfoIn(data, 1);
                    }
                }, 250, this.data[rowIndex]);
            };

            //Если есть значение катности то выводим его на форму
            if (data.parity != "0" && data.parity != "") {
                var parity = this.crnode();
                parity.style.paddingTop = '10px';
                parity.style.textAlign = 'center';
                $(parity).html('<span style="margin:0px; color:black; font-size:12pt;">Коэффициент кратности: ' + data.parity + '</span>');
                area.appendChild(parity);
            }
            // create conteier for input amount/boxes
            var sum = this.crnode();
            sum.style.paddingTop = '10px';
            sum.style.textAlign = 'center';
            $(sum).html('<span style="margin:0px; color:black; font-size:12pt;">{text}</span><br>'.replace(/\{text\}/, data.addinfo.text)); // data.addinfo.text
            var inp = this.crnode('input');
            inp.style.marginTop = '10px';
            inp.style.textAlign = 'right';
            inp.style.width = '200px';
            inp.type = 'text';
            inp.lang = this.blockId + '_bt_ok';
            inp.maxValue = data.addinfo.maxBlock||0; // data.addinfo.blokMaxInput
            inp.value = parseFloat(data.addinfo.curBlock)||'';
            inp.lastValue = parseFloat(data.addinfo.curBlock)||'';
            inp.oninput = function() {
                this.value = this.value.replace(/[,]/g, '.');
                // Шт товар или нельзя блокировать дробное значение
                if (!BLOCK_DOUBLE || parseInt(claim.overley2.tmpdata.type) == 1) {
                    this.value = Math.floor(Math.abs(claim.toFloat(this.value)));
                    this.value = this.value.replace(/^0+/, '');
                } else {
                    // Можно блокировать дробное значение
                    if (this.value.length > 1 && this.value.charAt(1) != '.') {
                        this.value = this.value.replace(/^0+/, '');
                    }
                }
                // Проверка на максимально возможное количество
                if (parseFloat(this.value) > claim.toFloat(this.maxValue)) {
                    if (!BLOCK_DOUBLE || parseInt(claim.overley2.tmpdata.type) == 1) {
                        this.value = Math.floor(parseFloat(this.maxValue));
                    } else {
                        this.value = parseFloat(this.maxValue);
                    }
                }
                claim.node(this.lang).disabled = (!(parseFloat(this.value)) || this.lastValue == parseFloat(this.value));
                claim.overley2.tmpdata.addinfo.curBlock = this.value;
            };
            inp.onkeydown = function(e) {
                if (e.keyCode == 27) {
                    claim.overley2.close();
                    return false;
                }
                if (e.keyCode == 13 && !claim.node(this.lang).disabled) {
                    claim.node(this.lang).onclick();
                    return false;
                }
                return 1;
            };
            sum.appendChild(inp);
            area.appendChild(sum);
            // create button conteiner
            var cntinfo = this.crnode();
            cntinfo.style.paddingTop = '10px';
            cntinfo.style.textAlign = 'center';
            // create button ok
            var btok = this.crnode('input');
            btok.type = 'button';
            btok.disabled = true;
            btok.id = this.blockId + '_bt_ok';
            btok.value = 'Сохранить';
            btok.className = 'amd-btn amd-btn_primary';
            btok.style.width = '125px';
            btok.style.margin = ' 0 15px';
            btok.onclick = function() {
                var data = {
                    claimId : claim.overley2.tmpdata.claimId,
                    block : claim.overley2.tmpdata.addinfo.curBlock,
                    itemId : claim.overley2.tmpdata.id,
                    pnumber : claim.getProcuctNumber(claim.overley2.tmpdata.id),
                    parity : claim.overley2.tmpdata.parity,
                    afterClose : 1
                };

                var text = 'введенное кол-во ' + claim.overley2.tmpdata.addinfo.curBlock;
                text += ' не кратно кол-ву в упаковке ' + claim.overley2.tmpdata.inBoxes;
                text += ' ,<br> Вы уверены в правильности указанного кол-ва?';

                text += '<br> - ближайшее наименьшее ' + Math.floor(claim.overley2.tmpdata.addinfo.curBlock / claim.overley2.tmpdata.inBoxes) * claim.overley2.tmpdata.inBoxes;
                var tmp = Math.ceil(claim.overley2.tmpdata.addinfo.curBlock / claim.overley2.tmpdata.inBoxes) * claim.overley2.tmpdata.inBoxes;
                tmp = tmp <= claim.overley2.tmpdata.addinfo.maxBlock ? tmp : claim.overley2.tmpdata.addinfo.maxBlock;
                text += '<br> - ближайшее наибольшее ' + tmp;

                if (claim.overley2.tmpdata.type == 1
                    && claim.overley2.tmpdata.addinfo.curBlock%claim.overley2.tmpdata.inBoxes
                    && parseFloat(claim.overley2.tmpdata.addinfo.maxBlock) > parseFloat(claim.overley2.tmpdata.addinfo.curBlock)
                ) {
                    if (claim.splitgoods === 1) {
                        data.msg = text;
                        data.caption = 'Внимание';
                        claim.showAhtung(data, function(data){claim._displayEditproductEnd(data, 1);});
                    } else {
                        claim.showError('Нельзя добавить количество товара не кратное его количеству в упаковке ' + tmp.average, function(){});
                    }
                    return;
                }

                //Если количество товара не соответствует кратности то запрет
                if (claim.overley2.tmpdata.type == 2) {
                    if (claim.overley2.tmpdata.addinfo.curBlock % data.parity) {
                        claim.showError('Коичество товара должно быть кратно коэффициенту кратности = ' + data.parity, function () {});
                        return false;
                    }
                }

                claim._displayEditproductEnd(data, 1);
            };
            cntinfo.appendChild(btok);
            // create button cancel
            var btcn = this.crnode('input');
            btcn.type = 'button';
            btcn.value = 'Отмена';
            btcn.style.width = '125px';
            btcn.className = 'amd-btn amd-btn_primary';
            btcn.onclick = function () {
                claim.overley2.close();
            };
            cntinfo.appendChild(btcn);
            // add buttons comteiner
            area.appendChild(cntinfo);
            // to center popup
            this.cntToCenter();
            inp.focus();
        };
        this.overley2.onBeforeClose = function() {
            this.grid.close();
        };
        this.overley2.onAfterClose = function() {
            delete(claim.overley2);
        };
        this.overley2.restore = function() {
            var obj = this.getCnt();
            $(obj.firstChild).show();
            $(obj).css({'background-image':'', 'background-position':'center center', 'background-repeat':'no-repeat'});
        };
        this.overley2.create();
    };

    /**
     * add/edit block for item
     */
    this._displayEditproductEnd = function(data, ajax)
    {
        var Data = data;

        if (ajax) {
            var obj = this.overley2.getCnt();
            obj.style.minWidth =  '700px';
            obj.style.minHeight = '100px';
            $(obj.firstChild).hide();

            $(obj).css({
                'background-image': 'url(/img/ld/ld3.gif)',
                'background-position': 'center center',
                'background-repeat': 'no-repeat'
            });

            $.ajax({
                url      : '/claim/supply/setblockitem',
                cache    : false,
                type     : 'POST',
                dataType : 'json',
                data: {
                    data    : serialize(data),
                    claimId : data.claimId,
                    depotId : data.depotId,
                },
                success: function (data)
                {
                    if (data.error) {
                        claim.showError(data.msg, function(){
                            claim.overley2.restore();
                        });
                    } else if (data.ahtung) {
                        if (claim.perm.products.editproduct == 4) {
                            claim.overley2.close();
                            claim.showError(data.msg, function(){claim._displayEditProductFull(this.tmpdata);});
                            claim.overleyError.tmpdata = data.extSectionData;
                        } else {
                            claim.showAhtung(data, function(data){claim._displayEditproductEnd(data, 1);}, function(){claim.overley2.restore();});
                        }
                    } else {
                        if (Data.extSectionData != undefined) {
                            // Если указаны данные для отображения, используем их
                            data.extSectionData = Data.extSectionData;
                        }

                        if (typeof Data.beforeGridUpdate === 'function') {
                            // Если указан callback, который должен быть запущен перед обновлением грида
                            Data.beforeGridUpdate();
                        }

                        claim._displayEditproductEnd(data);

                        if (typeof Data.afterGridUpdate === 'function') {
                            // Если указан callback, который должен быть запущен после обновлением грида
                            Data.afterGridUpdate();
                        }
                    }
                },
                error    : function(obj) {
                    claim.overley2.restore();
                    claim.showError('<div align=left>' + obj.responseText  + '<div>', function() {});
                }
            });
            return;
        }
        if (!parseInt(data.afterClose) && data.extSectionData) {
            claim.overley2.updateData(data.extSectionData);
        }
        if (parseInt(data.afterClose)) {
            claim.overley2.close();
        }else {
            claim.overley2.restore();
        }
        var ptable = this.node('table_products');
        var rowIndex = this.getProcuctNumber(data.itemId, 1);

        this.calculatePrices(data);

        if (ptable.rows[rowIndex].getAttribute('product') == data.itemId) {
            this._updateClaimProduct(data);
        }else {
            this._addClaimProduct(data);
        }
        if (this.overley) {
            this.overley.grid.lastSelectionData = this.findAddedMaterial();
            this.overley.grid._updateSelectedRow();
        }
        this.updateTotals();
    };

    this.calculatePrices = function (data)
    {
        let totalSectionsPrice = 0;
        for (const section of data.sections) {
            totalSectionsPrice += parseFloat(section.price) * parseFloat(section.curBlockAmount);
        }

        data.product.totalPrice = Math.round(totalSectionsPrice * 100) / 100;
        data.product.price      = Math.round((totalSectionsPrice / parseFloat(data.product.amount)) * 100) / 100;
    }

    /**
     * получить номер товара или строки таблицы
     */
    this.getProcuctNumber = function(productId, trow, firstrow)
    {
        var rows = this.node('table_products').rows;
        var number = 0;
        var row = 0;
        var lastProductRow = false;
        for(var i = 1; i < rows.length -1; i++) {
            if (rows[i].getAttribute('product') == productId) {
                lastProductRow = i;
                if (trow && firstrow) {
                    return lastProductRow;
                }
            }
            if (rows[i].getAttribute('product') == productId && rows[i].getAttribute('rowtype') == 'productstart' && !trow) {
                return rows[i].getAttribute('pnumber');
            }
            if (rows[i].getAttribute('rowtype') == 'productstart') {
                number = (parseInt(rows[i].getAttribute('pnumber')) > number ? parseInt(rows[i].getAttribute('pnumber')) : number);
            }
        }
        return trow ? (lastProductRow ? lastProductRow : rows.length -1) : number + 1;
    };

    /**
     * добавление товара в заявку
     */
    this._addClaimProduct = function(data)
    {
        function getDefaultAccountType(item)
        {
            if (item.type == 2) {
                return 2;
            }

            return claim.defaultAccountType;
        };
        var number = data.pnumber;
        var head = this.node('table_products').rows[0].cells;
        var row = this.node('table_products_tbody').insertRow(this.node('table_products').rows.length - 2);

        // Скрытый инпут для св-ва depot_id
        var inp = this.crnode('input');
        $(inp).attr({ type: 'hidden', 'class': "product-depot-id", value: data.product.depot_id, name: 'products[' + number + '][depot_id]' });
        row.appendChild(inp);

        row.dataset['field2'] = data.product.field2_id;

        // input  hidden pid
        var inp = this.crnode('input');
        $(inp).attr({type : 'hidden', value : data.itemId, name:'products[' + number + '][product_id]'});
        row.appendChild(inp);

        // input  hidden pnumber
        var inp = this.crnode('input');
        $(inp).attr({type : 'hidden', value : number, name:'products[' + number + '][number]'});
        row.appendChild(inp);

        // input  hidden pnumber
        var inp = this.crnode('input');
        $(inp).attr({type : 'hidden', value : data.product.type, name:'products[' + number + '][type]'});
        row.appendChild(inp);

        // input  hidden pnumber
        var inp = this.crnode('input');
        $(inp).attr({type : 'hidden', value : data.product.field1, name:'products[' + number + '][title]'});
        row.appendChild(inp);

        // input account type
        var inp = this.crnode('input');
        $(inp).attr({type : 'hidden', value : getDefaultAccountType(data.product), name:'products[' + number + '][account_type]', class:'account_type'});
        row.appendChild(inp);

        if (this.perm.amount == 1 ) {
            var inp = this.crnode('input');
            $(inp).attr({type : 'hidden', value : this.round(data.product.amount), name:'products[' + number + '][amount]'});
            row.appendChild(inp);
        }

        if (this.perm.boxes == 1 ) {
            var inp = this.crnode('input');
            $(inp).attr({type : 'hidden', value : this.round(data.product.boxes), name:'products[' + number + '][boxes]'});
            row.appendChild(inp);
        }

        if (this.perm.fweight == 1 ) {
            var inp = this.crnode('input');
            $(inp).attr({type : 'hidden', value : this.round(data.product.fweight), name:'products[' + number + '][fweight]'});
            row.appendChild(inp);
        }

        if (this.perm.rweight == 1 ) {
            var inp = this.crnode('input');
            $(inp).attr({type : 'hidden', value : this.round(data.product.rweight), name:'products[' + number + '][rweight]'});
            row.appendChild(inp);
        }

        for(var i = 0; i < head.length; i++) {
            var cell = row.insertCell(row.cells.length);
            cell.setAttribute('width', head[i].getAttribute('width'));
            cell.setAttribute('align', 'center');
            switch(head[i].lang) {
                case 'price':
                    cell.innerText = String(this.round(data.product.price));
                    break;
                case 'totalprice':
                    cell.innerText = String(this.round(data.product.totalPrice));
                    break;
                case 'boxes':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : this.round(data.product.boxes), size : 8, readOnly : true, name:'products[' + number + '][boxes]'}).css({'text-align':'left'});
                    cell.appendChild(inp);
                    break;
                case 'amount':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : this.round(data.product.amount), size : 8, readOnly : true, name:'products[' + number + '][amount]'}).css({'text-align':'left'});
                    cell.appendChild(inp);
                    break;
                case 'inboxes':
                    $(cell).html(this.round(data.product.inboxes));
                    break;
                case 'fweight':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : this.round(data.product.fweight), size : 8, readOnly : true, name:'products[' + number + '][fweight]'}).css({'text-align':'left'});
                    cell.appendChild(inp);
                    break;
                case 'rweight':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : this.round(data.product.rweight), size : 8, readOnly : true, name:'products[' + number + '][rweight]'}).css({'text-align':'left'});
                    cell.appendChild(inp);
                    break;
                case 'editproduct':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'button', title:'редактировать ' + data.product.field1, lang:data.itemId}).css({background:'transparent url(/img/system/editproduct.png) no-repeat center center', border:'none', 'outline':'none', cursor:'pointer', width:'16px'});
                    inp.onclick = function() {
                        claim.displayEditProductStart({
                            productId: data.itemId,
                            depotId: data.depotId,
                            claimId: claim.uncompresData(this.lang),
                        }, true);
                    };
                    cell.appendChild(inp);
                    break;
                case 'delproduct':
                    var inp = this.crnode('input');
                    var langData = {
                        itemId:data.itemId,
                        caption:'Удаление товара',
                        msg:'Вы уверены в удалении товара : ' + data.product.field1 + '(' + data.itemId + ') ?',
                        claimId : data.claimId
                    };
                    $(inp).attr({class: 'claim__input_delete', type : 'button', title:'удалить ' + data.product.field1, lang : claim.compresData(langData)}).css({background:'transparent url(/img/system/delete.png) no-repeat center center', border:'none', 'outline':'none', 'cursor':'pointer'});
                    inp.onclick = function() {
                        claim.showAhtung(claim.uncompresData(this.lang), function(data){
                            claim._deleteClaimProduct(data, true);
                        });
                    };
                    cell.appendChild(inp);
                    break;
                case 'product_id':
                    $(cell).html(data.itemId);
                    break;
                case 'account_type':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'checkbox', name:'products[' + number + '][account_type_checkbox]', class: 'account-type-checkbox', value: 1, title:'Списание в шт.', lang:data.itemId}).css({border:'none', 'outline':'none'});
                    data.product.type == 2 &&  $(inp).attr('disabled', true);
                    (getDefaultAccountType(data.product) == 1) && $(inp).attr('checked', true);
                    cell.appendChild(inp);
                    break;
                default:
                    var tmp = data.product[head[i].lang];
                    // if (head[i].lang.replace(/field/, '') > 4 && head[i].lang.replace(/field/, '') < 13) {
                        // tmp = this.toFloat(tmp) > 0 ? tmp : 0;
                    // }
                    var value = (fieldTypes[head[i].lang] == 'string') ? tmp||'&nbsp;' : parseFloat(tmp)||'&nbsp;';

                    if (head[i].lang == 'field1') {
                        cell.align = 'left';
                    }

                    // Вывод примечания отдела закупок с проверкой на резрешенные к выводу поля
                    if (depot_tooltip.isAllowedField('annotationIn', head[i].lang) && data.product.annotationIn) {
                        cell.align = 'left';

                        var options = {
                            htmlPatternName : 'iconAnnotationBrown',
                            annotation      : data.product.annotationIn,
                            headerName      : 'annotationIn'
                        };

                        var icon = depot_tooltip.init(options).getTooltip();
                        value += icon;
                    }

                    $(cell).html(value||'&nbsp;');

                    if (tmp) {
                        // Отображение реального поставщика
                        showVendornameTitle(data.product, cell, head[i].lang);
                    }

                    break;
            }
        }

        row.setAttribute('product', data.itemId);
        row.setAttribute('pnumber', number);
        row.setAttribute('rowtype', 'productstart');
        row.setAttribute('lastdate', data.product.lastDate);
        // show section
        this._updateProductSections(data);

        this.onAfterClaimProductAdd(this);
    };

    /**
     * update products
     */
    this._updateClaimProduct = function(data) {
        var number = data.pnumber;
        if (this.element('products[' + number + '][boxes]')) {
            this.element('products[' + number + '][boxes]').value = data.product.boxes;
        }
        if (this.element('products[' + number + '][amount]')) {
            this.element('products[' + number + '][amount]').value = data.product.amount;
        }
        if (this.element('products[' + number + '][inboxes]')) {
            this.element('products[' + number + '][inboxes]').value = data.product.inboxes;
        }
        if (this.element('products[' + number + '][rweight]')) {
            this.element('products[' + number + '][rweight]').value = data.product.rweight;
        }
        if (this.element('products[' + number + '][fweight]')) {
                this.element('products[' + number + '][fweight]').value = data.product.fweight;
            }
        this.node('table_products').rows[this.getProcuctNumber(data.itemId, 1, 1)].setAttribute('lastdate', data.product.lastDate);
        // show section
        this._updateProductSections(data);
        claim.accountTypeSyncAll();

        this.onAfterClaimProductUpdate(this);
    };

    /**
     * обновление данных по секциям
     */
    this._updateProductSections = function(data)
    {
        if (this.perm.products.sectionview < 2) {
            return;
        }
        var rows = this.node('table_products').rows;

        var lastFWeight = {};
        var pnumber = this.getProcuctNumber(data.itemId);
        var regexp = new RegExp('^products\\[' + pnumber + '\\]\\[sections\\]\\[\\d+\\]\\[fweight\\]$');
        var els = this.node(this.formId).elements;
        for(var i = 0; i < els.length; i++) {
            if (!regexp.test(els[i].name)) {
                continue;
            }
            var k = els[i].name.replace(/\d+/, '').replace(/[^\d]/g, '');
            lastFWeight[this.element('products['+pnumber+'][sections]['+k+'][detailed_id]').value] = {
                fweight : this.toFloat(els[i].value),
                boxes  : this.toFloat(this.element('products['+pnumber+'][sections]['+k+'][boxes]').value)
            };
        }

        var i = 1;
        while(rows[i]) {
            if (rows[i].getAttribute('product') == data.itemId && rows[i].getAttribute('rowtype') != 'productstart') {
                this.node('table_products').deleteRow(i);
                continue;
            }
            i++;
        }
        var rowIndex = this.getProcuctNumber(data.itemId, 1);

        var head = this.node('table_products').rows[0].cells;
        var beforeColspan = 0;
        for(var j = 0; j < head.length; j++) {
            if (head[j].lang == 'amount') {
                break;
            }
            beforeColspan += 1;
        }

        // sectionedit
        for(var i = 0; i < data.sections.length; i++) {
            var row = this.node('table_products_tbody').insertRow(i + rowIndex);
            row.setAttribute('product', data.itemId);
            row.setAttribute('pnumber', pnumber);
            row.setAttribute('rowtype', 'section');

            var inp = this.crnode('input');
            inp.type = 'hidden';
            inp.name = 'products['+pnumber+'][sections]['+i+'][detailed_id]';
            inp.value = data.sections[i].detailed_id;
            row.appendChild(inp);

            var inp = this.crnode('input');
            inp.type = 'hidden';
            inp.name = 'products['+pnumber+'][sections]['+i+'][boxes]';
            inp.value = data.sections[i].curBlockBoxes;
            row.appendChild(inp);

            var colspan = head.length;
            for(var j = 0; j < head.length; j++) {
                switch (head[j].lang) {
                    case 'price':
                        row.insertCell(row.cells.length);
                        colspan -= 1;
                        break;
                    case 'totalprice':
                        row.insertCell(row.cells.length);
                        colspan -= 1;
                        break;
                    case 'boxes':
                        var cell = row.insertCell(row.cells.length);
                        colspan -= 1;
                        cell.align = 'center';
                        cell.innerHTML = '№ секции : ' + data.sections[i].placing;
                        break;
                    case 'amount':
                        var cell = row.insertCell(row.cells.length);
                        cell.align = 'center';
                        colspan -= 1;
                        var inp = this.crnode('input');
                        inp.type = 'text';
                        inp.name = 'products['+pnumber+'][sections]['+i+'][amount]';
                        inp.value = data.sections[i].curBlockAmount > 0 ? this.toFloat(data.sections[i].curBlockAmount) : '';
                        inp.lang = data.sections[i].curBlockAmount > 0 ? this.toFloat(data.sections[i].curBlockAmount) : '';
                        inp.size = 8;
                        inp.readOnly = true;
                        cell.appendChild(inp);
                        break;
                    case 'inboxes':
                        var cell = row.insertCell(row.cells.length);
                        colspan -= 1;
                        cell.align = 'center';
                        cell.innerHTML = this.toFloat(data.sections[i].curBlockBoxes);
                        break;
                    case 'fweight':
                        var cell = row.insertCell(row.cells.length);
                        cell.align = 'center';
                        colspan -= 1;
                        var inp = this.crnode('input');
                        inp.type = 'text';

                        if (data.sections[i].type == 2) {
                            // Для КГ-товара убираем возможность редактирования поля.
                            // Редактирование веса должно осуществляться через расширенную форму блокировки.
                            inp.readOnly = true;
                            inp.setAttribute('title', 'Для редактирования веса используйте форму редактирования товара');
                            inp.value = data.sections[i].curBlockAmount > 0 ? this.toFloat(data.sections[i].curBlockAmount) : '';
                        } else {
                            inp.oninput = function() {
                                claim.changeFWeight(this);
                            };

                            if (lastFWeight[data.sections[i].detailed_id]) {
                                if (lastFWeight[data.sections[i].detailed_id].boxes == data.sections[i].curBlockBoxes) {
                                    inp.value = lastFWeight[data.sections[i].detailed_id].fweight || (data.sections[i].fweight > 0 ? data.sections[i].fweight : '');
                                } else {
                                    inp.value = data.sections[i].fweight > 0 ? data.sections[i].fweight : '';
                                }
                            } else {
                                inp.value = '';
                            }
                        }

                        inp.lang = '{maxboxes:' + data.sections[i].maxBoxes
                        + ', maxamount:' + data.sections[i].maxAmount
                        + ', blockboxes:'+ data.sections[i].curBlockBoxes
                        + ', confirmAmount:'+ data.sections[i].confirmAmount
                        + ', confirmBoxes:'+ data.sections[i].confirmBoxes
                        + ', curblocks:'+ data.sections[i].curcellblock
                        + ', type:'+ data.sections[i].type
                        + '}';
                        inp.name = 'products['+pnumber+'][sections]['+i+'][fweight]';
                        inp.size = 8;

                        if (this.perm.products.fweight != 4 ) {
                            inp.readOnly = true;
                        }
                        cell.appendChild(inp);
                        //Остаток по секции
                        var cell = row.insertCell(row.cells.length);
                        colspan -= 1;
                        cell.align = 'center';
                        cell.innerHTML = 'Остаток по секции : ' + data.sections[i].fullamount + "/" + data.sections[i].fullboxes;

                        let claimId = data.sections[i].claimId;
                        let itemId = data.sections[i].id;

                        SectionPhotoPreviewManager.renderEyeIcon(cell, claimId, itemId).then(r => r);
                        break;
                }
            }

            var cell = row.insertCell(row.cells.length);
            cell.innerHTML = '&nbsp;';
            cell.align = 'left';
            cell.colSpan = colspan;

            if (parseInt(this.claimStatus) == 0) {
                // В случае, если выполняется каскадное редактирование,
                // необходимо также записать данные о блокировках детализаций под менеджеров
                $(row).append(
                    $('<input type="hidden" name="products[' + pnumber + '][sections][' + i +'][ddmRows]">')
                        .val(JSON.stringify(data.sections[i].ddmRows))
                );
            }
        }

        var row = this.node('table_products_tbody').insertRow(i + rowIndex);
        row.setAttribute('product', data.itemId);
        row.setAttribute('rowtype', 'productend');
        row.insertCell(0).innerHTML = '<hr size=2 style="color:gray;">';
        row.cells[0].colSpan = head.length;

        if (data.product.type == 2) {
            var total = 0;
            var regexp = new RegExp('^products\\[' + pnumber + '\\]\\[sections\\]\\[\\d+\\]\\[fweight\\]$');
            var els = this.node(this.formId).elements;
            for(var i=0; i<els.length; i++) {
                if (!regexp.test(els[i].name)) {
                    continue;
                }
                total += this.toFloat(els[i].value);
                if (this.toFloat(els[i].value)) {
                    this.element(els[i].name.replace(/fweight/, 'amount')).value = this.toFloat(els[i].value);
                }
            }
            if (this.element('products[' + pnumber + '][fweight]')) {
                this.element('products[' + pnumber + '][fweight]').value = total;
            }

            var total = 0;
            var regexp = new RegExp('^products\\[' + pnumber + '\\]\\[sections\\]\\[\\d+\\]\\[amount\\]$');
            for(var i = 0; i < els.length; i++) {
                if (!regexp.test(els[i].name)) {
                    continue;
                }
                total += this.toFloat(els[i].value);
            }
            this.element('products[' + pnumber + '][amount]').value = total;
            if (this.element('products[' + pnumber + '][rweight]')) {
                this.element('products[' + pnumber + '][rweight]').value = total;
            }
        }
    };

    this._deleteClaimProduct = function(data, ajax)
    {
        if (ajax && parseInt(this.claimStatus)) {
            $.ajax({
                url      : linkPrefix + '/claim/supply/dropproduct',
                cache    : false,
                data     : {itemId : data.itemId, claimId: data.claimId},
                type     : 'POST',
                dataType : 'json',
                success  : function(data) {
                    if (data.error) {
                        claim.showError(data.error);
                    }else {
                        claim._deleteClaimProduct(data);
                    }
                },
                error    : function(obj) {
                    claim.showError('<div align=left>' + obj.responseText  + '<div>', function() {
                        claim.overley2.restore();
                    });
                }
            });
            return;
        }
        if (!parseInt(this.claimStatus)) {
            data.productId = data.itemId;
        }

        var rows = this.node('table_products').rows;
        var i = 1;
        while(rows[i]) {
            if (rows[i].getAttribute('product') == data.productId) {
                this.node('table_products').deleteRow(i);
                continue;
            }
            i++;
        }
        this.updateTotals();
    };

    this.changeFWeight = function(obj)
    {
        var pnumber = obj.name.split('[sections]')[0].replace(/[^\d]/g, '');
        obj.value = obj.value.replace(/[,]/g, '.');
        if (!/^\d+(\.(\d*))?$/.test(obj.value)) {
            obj.value = Math.abs(this.toFloat(obj.value))||'';
        }
        if (/^0\d+/.test(obj.value)) {
            obj.value = obj.value.replace(/^0/, '');
        }

        var data = this.uncompresData(obj.lang);
        // control amount for itemType = 2
        if (data.type == 2) {
            var maxVal = data.maxamount - data.confirmAmount;
            if ((data.curblocks - data.confirmBoxes - data.blockboxes > 0 || (data.curblocks + data.confirmBoxes) < data.maxboxes) && !BLOCK_DOUBLE) {
                maxVal -= 1;
            }
            if (obj.value > maxVal || data.blockboxes + data.confirmBoxes == data.maxboxes ) {
                obj.value = this.toFloat(obj.value) ? this.round(maxVal) : '';
            }
            this.element(obj.name.replace(/fweight/, 'amount')).value = obj.value > 0 ? obj.value : this.element(obj.name.replace(/fweight/, 'amount')).lang;

            var total = 0;
            var regexp = new RegExp('^products\\[' + pnumber + '\\]\\[sections\\]\\[\\d+\\]\\[fweight\\]$');
            var els = this.node(this.formId).elements;
            for(var i = 0; i < els.length; i++) {
                if (!regexp.test(els[i].name)) {
                    continue;
                }
                total += this.toFloat(els[i].value);
            }
            if (this.element('products[' + pnumber + '][fweight]')) {
                this.element('products[' + pnumber + '][fweight]').value = total;
            }

            var total = 0;
            var regexp = new RegExp('^products\\[' + pnumber + '\\]\\[sections\\]\\[\\d+\\]\\[amount\\]$');
            for(var i = 0; i < els.length; i++) {
                if (!regexp.test(els[i].name)) {
                    continue;
                }
                total += this.toFloat(els[i].value);
            }
            this.element('products[' + pnumber + '][amount]').value = total;
            if (this.element('products[' + pnumber + '][rweight]')) {
                this.element('products[' + pnumber + '][rweight]').value = total;
            }
        }else {
            var total = 0;
            var regexp = new RegExp('^products\\[' + pnumber + '\\]\\[sections\\]\\[\\d+\\]\\[fweight\\]$');
            var els = this.node(this.formId).elements;
            for(var i = 0; i < els.length; i++) {
                if (!regexp.test(els[i].name)) {
                    continue;
                }
                total += this.toFloat(els[i].value);
            }
            this.element(['products[' + pnumber + '][fweight]']).value = total;

        }
        this.updateTotals();
    };

    /* product edit END */

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
            wndcapbt.onclick = function() {
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
                id:      {caption:'ID', width:50},
                title:   {caption: configTitle,   width:160, aliace:claim.aliace, align:'left'},
                prop:    {caption: configProp,    width:80,  aliace:function(v, cnt, rowData){ return eval(configPropReturn);}},
                color:   {caption: configColor,   width:100, aliace:function(v, cnt, rowData){ return eval(configColorReturn);}},
                boxType: {caption: configBoxType, width:80,  aliace:function(v, cnt, rowData){ return eval(configBoxTypeReturn);}},
                volum:   {caption: configVolum,   width:80,  aliace:function(v, cnt, rowData){ return eval(configVolumReturn);}},
                height:  {caption: configHeight,  width:80,  aliace:function(v, cnt, rowData){ return eval(configHeightReturn);}},
                width:   {caption: configWidth,   width:80,  aliace:function(v, cnt, rowData){ return eval(configWidthReturn);}},
                depth:   {caption: configDepth,   width:80,  aliace:function(v, cnt, rowData){ return eval(configDepthReturn);}},
                labelWeight:{caption: configLabelWeight, width:80, sort:1, aliace:function(v, cnt, rowData){ return eval(configLabelWeightReturn);}},
                inBoxes: {caption:'Кол-во в упаковке / средний вес ', width:100, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                amountWeight : {caption:'Кол-во (штук) / общий вес', width:100, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                boxesRols :    {caption:'Кол-во упаковок / кол-во роликов', width:100, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
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
        this.overleyInfoIn.onBeforeClose = function() {
            this.grid.close();
        };
        this.overleyInfoIn.onAfterClose = function() {
            delete(claim.overleyInfoIn);
        };
        this.overleyInfoIn.restore = function(msg) {
            var obj = this.getCnt();
            if (!obj) {
                return;
            }
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
                url      : linkPrefix + '/claim/supply/getinfoin',
                cache    : false,
                data     : {
                    itemId  : data.id,
                    claimId : this.node(this.formId)['claim[id]'].value
                },
                type     : 'POST',
                dataType : 'html',
                success  : function(data) {
                    claim.overleyInfoIn.restore(data);
                },
                error    : function(obj, text) {
                    claim.showError(obj.responseText);
                }
            });
            return;
        }
    };


    /**
     * показ сообщение требующих принятия решение
     */
    this.showAhtung = function(data, callbackOk, callbackCencel)
    {
        this.overleyAhtung = new overley();
        this.overleyAhtung.callbackOk = (typeof callbackOk == 'function' ? callbackOk : function(){});
        this.overleyAhtung.callbackCencel = (typeof callbackCencel == 'function' ? callbackCencel : function(){});
        this.overleyAhtung.tmpdata = data;
        this.overleyAhtung.onAfterCreate = function() {
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
            wndcap.innerHTML = '' + (this.tmpdata.caption||'');
            wnd.appendChild(wndcap);

            // create wnd caption close button
            var wndcapbt = this.crnode();
            wndcapbt.className = 'filter-wnd-caption-close-button';
            wndcapbt.title = 'закрыть диалог';
            wnd.appendChild(wndcapbt);
            wndcapbt.onclick = function() {
                claim.overleyAhtung.close();
            };

            // create conteier for input amount/boxes
            var sum = this.crnode();
            sum.style.paddingTop = '10px';
            sum.style.textAlign = 'center';
            sum.style.maxWidth = '1000px';
            sum.style.maxHeight = '800px';
            sum.style.overflow = 'auto';
            area.appendChild(sum);
            $(sum).html('<h4>' + this.tmpdata.msg + '</h4>');

            // create button conteiner
            var cntinfo = this.crnode();
            cntinfo.style.paddingTop = '10px';
            cntinfo.style.textAlign = 'center';
            // create button cancel
            var btok = this.crnode('input');
            btok.type = 'button';
            btok.value = 'Оk';
            btok.style.width = '125px';
            btok.onclick = function() {
                claim.overleyAhtung.afteClose = 1; claim.overleyAhtung.close();
            };
            btok.onkeydown = function(e) {
                if (e.keyCode == 39) {
                    this.nextSibling.focus();
                }
            };
            cntinfo.appendChild(btok);
            // create button cancel
            var btcn = this.crnode('input');
            btcn.type = 'button';
            btcn.value = 'Отмена';
            btcn.style.width = '125px';
            btcn.onclick = function() {
                claim.overleyAhtung.afteClose = 0; claim.overleyAhtung.close();
            };
            btcn.onkeydown = function(e) {
                if (e.keyCode == 37) {
                    this.previousSibling.focus();
                }
            };
            cntinfo.appendChild(btcn);
            // add buttons comteiner
            area.appendChild(cntinfo);
            // to center popup
            this.cntToCenter();
            btok.focus();
        };
        this.overleyAhtung.onBeforeClose = function() {};
        this.overleyAhtung.onAfterClose = function() {
            if (this.afteClose) {
                this.callbackOk(this.tmpdata);
            }else {
                this.callbackCencel(this.tmpdata);
            }
            delete(claim.overleyError);
        };
        this.overleyAhtung.create();
    };

    /**
     * display errors
     */
    this.showError = function(msg, callback)
    {
        this.overleyError = new overley();
        this.overleyError.callback = (typeof callback == 'function' ? callback : function(){});
        this.overleyError.onAfterCreate = function() {
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
            wndcap.innerHTML = '<img align="absmiddle" src="/img/system/error.16.png"> Ошибка';
            wnd.appendChild(wndcap);

            // create wnd caption close button
            var wndcapbt = this.crnode();
            wndcapbt.className = 'filter-wnd-caption-close-button';
            wndcapbt.title = 'закрыть диалог';
            wnd.appendChild(wndcapbt);
            wndcapbt.onclick = function() {
                claim.overleyError.close();
            };

            // create conteier for input amount/boxes
            var sum = this.crnode();
            sum.style.paddingTop = '10px';
            sum.style.textAlign = 'center';
            //sum.style.maxWidth = '1000px';
            sum.style.maxHeight = '800px';
            sum.style.overflow = 'auto';
            area.appendChild(sum);
            $(sum).html('<h4>' + msg + '</h4>');

            // create button conteiner
            var cntinfo = this.crnode();
            cntinfo.style.paddingTop = '10px';
            cntinfo.style.textAlign = 'center';
            // create button cancel
            var btcn = this.crnode('input');
            btcn.type = 'button';
            btcn.value = 'Закрыть';
            btcn.style.width = '125px';
            btcn.onclick = function() {
                claim.overleyError.close();
            };
            cntinfo.appendChild(btcn);
            // add buttons comteiner
            area.appendChild(cntinfo);
            // to center popup
            this.cntToCenter();
            btcn.focus();
        };
        this.overleyError.onBeforeClose = function() {};
        this.overleyError.onAfterClose = function() {
            this.callback();
            delete(claim.overleyError);
        };
        this.overleyError.create();
    };

    /**
     *
     */
    this.updateTotals = function()
    {
        var totalAmount = 0, totalBoxes = 0, totalSumm = 0, totalFWeight = 0, totalRWeight = 0;
        var elements = this.node(this.formId).elements;
        for(var i = 0; i < elements.length; i++) {
            switch (true) {
                case /^products\[\d+\]\[amount\]$/.test(elements[i].name):
                    totalAmount += this.toFloat(elements[i].value);
                    if (this.node(this.formId)[elements[i].name.replace(/amount/, 'totalprice')]) {
                        totalSumm += this.toFloat(this.node(this.formId)[elements[i].name.replace(/amount/, 'totalprice')].value);
                    }
                    break;
                case /^products\[\d+\]\[boxes\]$/.test(elements[i].name):
                    totalBoxes += this.toFloat(elements[i].value);
                    break;
                case /^products\[\d+\]\[fweight\]$/.test(elements[i].name):
                    totalFWeight += this.toFloat(elements[i].value);
                    break;
                case /^products\[\d+\]\[rweight\]$/.test(elements[i].name):
                    totalRWeight += this.toFloat(elements[i].value);
                    break;
            }
        }
        if (this.node('autosum-boxes')) {
            this.node('autosum-boxes').innerHTML  = this.round(totalBoxes);
        }
        if (this.node('autosum-amount')) {
            this.node('autosum-amount').innerHTML = this.round(totalAmount);
        }
        if (this.node('autosum-summa')) {
            this.node('autosum-summa').innerHTML  = this.round(totalSumm);
        }
        if (this.node('autosum-rweight')) {
            this.node('autosum-rweight').innerHTML  = this.round(totalRWeight);
        }
        if (this.node('autosum-fweight')) {
            this.node('autosum-fweight').innerHTML  = this.round(totalFWeight);
        }
    };

    /**
     * отправка формы
     */
    this.sendForm = function(nextStatus)
    {
        this.element('changeStatusAvaleble').value = (nextStatus ? 1 : 0);
        if (this.checkForm(this.node(this.formId))) {
            this.node(this.formId).submit();
        }
    };

    /**
     * Проверка правильности заполнения данных
     */
    this.checkFormFinanceSupport = function()
    {
        return this.checkForm($('form[data-form-type="claim"]').get(0));
    };

    /**
     * проверка правильности заполнения данных
     */
    this.checkForm = function(form)
    {
        if (this.userBlockInfo) {
            return false;
        }
        if (this.errorInfoBlock && !parseInt(this.perm.claimerroraccess)) {
            return false;
        }
        this.saveForm = true;
        //return false;
        /**
         *Содержит в себе массив ошибок в случае если мы должны перевести заявку на статус диспетчера
         **/
        var emptyFileds = [];

        /**
         *Содержит флаг сохраняем или отправляем заявку
         **/
        var nextStatusAv = $(form).children("[name=changeStatusAvaleble]").val();

        /**
         *Содержит флаг наша машина или нет
         **/
        var car = $("#ShowHideDispetcher").val();
        var claimCar = parseInt($('[name="claim[car]"]').val());
        var errors = [];
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

            if (!els[i].name.indexOf('products') && this.node('check_show_product')) {
                var path = els[i].name.replace(/^products\[/, '').replace(/(\[|\]\[|\])/g, '.').replace(/\.$/, '').split('.');
                var cur = products;
                while (path.length) {
                    var level = path.shift();
                    if (typeof cur[level] == 'undefined') {
                        cur[level] = {};
                    }
                    if (!path.length) {
                        cur[level] = els[i].value;
                    }
                    cur = cur[level];
                }
            }else {
                switch (els[i].name) {
                    case 'claim[managerId]':
                        if (!this.manager.value()) {
                            errors.push(' - не указан менеджер');
                        }
                        break;
                    case 'claim[clientId]':
                        if (!this.client.value()) {
                            errors.push(' - не указан клиент');
                        }
                        break;
                    case 'claim[kpp]':
                        var value = parseInt(els[i].value);

                        if(isNaN(value) || value == -1) {
                            errors.push(' - не указан КПП клиента');
                        }

                        break;
                    case 'claim[car]':
                        if ($(els[i]).val() === "") {
                            errors.push(' - не выбрана машина');
                        }
                        break;
                    case 'claim[date]':
                        if (!/^([0-2]\d|3[0-1])\.(0\d|1[0-2])\.20\d\d$/.test(els[i].value)) {
                            errors.push(' - не верный формат даты');
                        }else {
                            var date = els[i].value.split('.');
                            var time = (new Date(date[2], date[1], date[0])).getTime()/1000;
                            if (time < maxProductDate) {
                                errors.push(' - дата поставки сырья не может раньше прихода товаров');
                            }
                        }
                        break;
                    case 'claim[carType]':
                        if (els[i].value.replace(/^\s+|\s+$/g, '') == '' && car == 1) {
                            errors.push(' - не указан тип машины');
                        }
                        break;
                    case 'claim[dispetcher]':

                        if (claimCar == 1 && this.dispatcher && !this.dispatcher.isValid()) {
                            errors.push(' - не выбран диспетчер');
                        }
                        break;
                    case 'claim[annotation]':
                        if(parseInt(this.perm.annotationrequired) && nextStatusAv == 1) {
                            if (typeof(tinyMCE) !== "undefined" && tinymce.get('claim_annotation')) {
                                if (!tinyMCE.get('claim_annotation').getContent()) {
                                    errors.push(' - не заполнено Примечание');
                                }
                            }
                        }
                        break;
                    case 'claim[carNumber]':
                        if(claim.carStatusFlag!=2 &&
                           claim.carStatusFlag!=1 &&
                           !parseFloat(els[i].value) &&
                           nextStatusAv == 0 && car==1
                        ) {
                            emptyFileds.push(" - не указан номер машины");
                        }
                        if(nextStatusAv == 1 &&
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
                            nextStatusAv == 0 && car == 1
                          ) {
                            emptyFileds.push(" - не указано имя водителя");
                         }
                        if(nextStatusAv == 1 &&
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
                           nextStatusAv == 0 &&
                           car == 1
                          ) {
                            emptyFileds.push(" - не указан телефон водителя");
                        }
                        if(nextStatusAv == 1 &&
                          (claim.carStatusFlag == 2 ||
                           claim.carStatusFlag == 0) &&
                           !parseFloat(els[i].value) &&
                           car == 1
                          ) {
                            errors.push(' - не указан телефон водителя');
                        }
                        break;
                    // Поля выгрузки начало
                    case 'claim[unloadAddressId]':
                        if(els[i].value.replace(/^\s+|\s+$/g, '') == '' && claimCar==1)
                        {
                            errors.push(' - не выбран "Адрес загрузки"');
                        }
                        break;
                    case 'claim[aproxClaimWeight]':
                        if(els[i].value.replace(/^\s+|\s+$/g, '') == '' && parseInt(this.unloadRequired) && claimCar==1)
                        {
                            errors.push(' - заполните поле Ориентировочный вес по заявке');
                        }
                        break;
                    case 'claim[transportDeliveryTime]':
                        if(els[i].value.replace(/^\s+|\s+$/g, '') == '' && parseInt(this.unloadRequired) && claimCar==1)
                        {
                            errors.push(' - заполните поле Время подачи автомобиля');
                        }
                        break;
                    // Поля выгрузки конец
                }
            }
        }

        // нельзя отправить со статуса создания заявку на клиента, у которого нужно подгрузить акт сверки
        if (nextStatusAv > 0 && claim.claimStatus == 14 && claim.receiptClientActReviseCheckEnabled > 0) {
            var actReviseCheck = false;
            $.ajax({
                url: '/claim/ajax/check-receipt-client-act-revise-existence',
                data: {clientId: $('[name="claim[clientId]"]').val()},
                dataType: 'json',
                async: false
            }).done(function (data) {
                if (data.success !== true) {
                    alert('Не удалось проверить статус акта сверки переработчика');
                    return ;
                }
                actReviseCheck = data.result;
            });

            if (!actReviseCheck
                && (
                    !this.serviceNote
                    || !this.serviceNote.haveFiles()
                )
            ) {
                errors.push(' - нужно подгрузить акт сверки переработчика или загрузить служебную записку');
            }
        }

        // проверка габаритов
        if (nextStatusAv > 0 && !this.isClosedClaim && claimCar === 1 && this.dimensions && !this.dimensions.isValid()) {
            errors.push(' - заполните поле "Габариты"');
        }

        if (typeof this.depotNominal !== 'undefined'
            && !this.depotNominal.isValid()
            && parseInt(this.claimStatus) > 0
        ) {
            errors.push(' - заполните поле "Условный склад"');
        }

        // Валидация привязанных планов производства
        if(!Receiptplan.checkClaimForm()) {
            errors.push(Receiptplan.getErrorMessage());
        }

        if(typeof window.claimFieldRentPriceValidate == 'function') {
            window.claimFieldRentPriceValidate({
                'error': function(msg) {
                    errors.push(' - ' + msg);
                }
            });
        }

        if(typeof window.carDataFieldInstance == 'object') {
            window.carDataFieldInstance.validation({
                'error': function(msg) {
                    errors.push(' - ' + msg);
                }
            });
        }

        if (typeof(carView) != 'undefined' && $('input[name="claim[car]"]').val() != 1 && carView.getVehicleAccessController() && !carView.getVehicleAccessController().check()) {
            errors.push(' - необходимо заполнить все поля для доступа ТС на территорию');
        }

        var checkSectionAmount = false;
        if (this.node('check_show_product')) {
            // Флаг, отвечающий за отображение предупреждения о необходимости установить права на поле фактический вес
            var isFweightOccuredAccessWarning = false;

            var productsExists = false;
            for(var i in products) {
                if (!this.toFloat(products[i].amount)) {
                    errors.push(' - не корректно указан вес для товара : ' + products[i].title);
                }
                if (!this.toFloat(products[i].boxes)) {
                    errors.push(' - не корректно указано кол-во для товара : ' + products[i].title);
                }
                // True - списание в ШТ, false - списание в КГ
                var checked = $('input[name="products[' + i + '][account_type]"]').val() == claim.accountTypes.quantity ? true : false;
                if (products[i].sections && !checked) {
                    checkSectionAmount = true;
                    for(var j in products[i].sections) {
                        if (this.perm.products.fweight == 4 && this.toFloat(products[i].sections[j].fweight) < this.precision) {
                            errors.push(' - не корректно указан фактический вес для товара : ' + products[i].title + ' в одной из секций');
                        }
                    }
                }

                // Проверяем, что корректно заполнены поля с фактическим весом, если fweight < 4 (если есть доступ на ред, работает проверка выше)
                if (products[i].sections) {
                    for(var productKey in products) {
                        if (this.perm.products.fweight < 4 && this.toFloat(products[productKey].fweight) < this.precision) {
                            isFweightOccuredAccessWarning = true;
                        }
                    }
                }

                productsExists = true;
            }

            if (productsExists && isFweightOccuredAccessWarning) {
                // Так как при отправке формы происходит запись фактического веса товара в ddo (см. library/App/Claim/Mapper/Supply.php:246)
                errors.push(' - для сохранения заявки необходимо заполнить поле "Фактический вес", однако, у вас нет доступа на редактирование этого поля, обратитесь к администратору');
            }

            if (!productsExists && (parseInt(this.claimStatus) !== 0)) {
                errors.push(' - нет товаров в заявке');
            }
        }
        sectionErrors = false;

        if (!errors.length && checkSectionAmount) {
            $.ajax({
                url      : linkPrefix + '/claim/supply/checksectionamount',
                cache    : false,
                data     : {data : serialize(products), claimId: this.node(claim.formId)['claim[id]'].value},
                type     : 'POST',
                dataType : 'json',
                async    : false,
                success  : function(data) {
                    for(var i in data.errors) {
                        errors.push(data.errors[i]);
                    }
                },
                error    : function(obj) {
                    claim.showError('<div align=left>' + obj.responseText  + '<div>', function() {});
                    sectionErrors = true;
                    this.saveForm = false;
                }
            });
        }

        if (!errors.length && checkSectionAmount && parseInt(this.claimStatus) === 17 && parseInt(nextStatusAv) === 1) {
            $.ajax({
                url      : '/claim/out/check-max-amount',
                cache    : false,
                data     : {data : serialize(products), claimId: this.node(claim.formId)['claim[id]'].value},
                type     : 'POST',
                dataType : 'json',
                async    : false,
                success  : function(data)
                {
                    for (let i in data.errors) {
                        errors.push(data.errors[i]);
                    }
                },
                error    : function(obj) {
                    claim.showError('<div align=left>' + obj.responseText  + '<div>', function(){});
                    sectionErrors = true;
                    this.saveForm = false;
                }
            });
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
            let depotValidation = (new OrgDepotValidator()).validate(this.getClaimId());
            if (!depotValidation.check) {
                errors.push(`- Внимание! Вам запрещено проводить изменения в складе ${depotValidation.depotTitle}.`);
            }
        }

        if (errors.length) {
            alert('Обнаружены следующие ошибки :' + String.fromCharCode(10, 13) + errors.join(String.fromCharCode(10, 13)));
            this.saveForm = false;
        }

        if (window.directoWageChecker
            && !window.directoWageChecker.check($('input[name="claim[id]"]').val(), $('input[name="claim[date]"]').val())
        ) {
            this.saveForm = false;
            return false;
        }

        return (!errors.length && !sectionErrors && !emptyFileds.length);
    };

    /**
     * отображение инфы о заблокировавшем юзере
     */
    this.showBlockClaimInfo = function()
    {
        if (!this.userBlockInfo) {
            return;
        }
        if (this.errorInfoBlock) {
            return;
        }
        $('#block_info_html').remove();
        var html = '<div id="block_info_html" style="position:fixed; top:10px; right:10px; padding:15px; border:1px solid gray; background:rgba(0, 0, 0, 0.5); color:white; border-radius:15px;">'
        + '<h3>Заявка ' + this.userBlockInfo.params.task + ' заблокирована </h3>'
        + 'пользователь : ' + this.userBlockInfo.params.user + '<br>'
        + 'время блокировки : ' + this.userBlockInfo.params.time +' <br>'
        + '</div>';
        $(document.body).append(html);
    };


    /**
     * cascade
     */
    this.sendToCascade = function(params)
    {
        let deleteOnCascade = params && params.hasOwnProperty('deleteOnCascade')
            ? parseInt(params.deleteOnCascade)
            : 0;

        if (deleteOnCascade === 1) {
            let deleteOnCascadeField = $('[name="deleteOnCascade"]').val(params.deleteOnCascade);

            if (!parseInt(deleteOnCascadeField.val())) {
                alert('Не удалось установить флаг удаления!');
            }
        }

        var a =  window.location.toString();
        this.node(this.formId).action = a.replace(/(\d+)$/, '') + 'cascade/cid/' + a.replace(a.replace(/(\d+)$/, ''), '');
        this.element('accept').value = 0;
        this.sendForm(false);
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
     * Callback для события после добавления товара в заявку
     */
    this.onAfterClaimProductAdd = self => {
        if (this.depotIndex) {
            this.depotIndex.setDepotId(this.getClaimProductsDepotId());
        }
        this.$ctrl.onAfterClaimProductAdd(self);
    };

    /**
     * Callback для события после изменения товара в заявке
     */
    this.onAfterClaimProductUpdate = self => this.$ctrl.onAfterClaimProductUpdate(self);
}
)();



window.onbeforeunload = function() {
    window.incomeoutUnloadData = {};
    window.incomeoutUnloadData.cid = claim.element('claim[id]').value;
    if (!claim.saveForm && claim.onunload) {
        alert('Данная заявка не сохранена\r\nи находится на этапе создания,\r\nесли Вы продолжите,\r\nто все данные будут утеряны!');
        return '?';
    }
    return void(0);
};

// удаление добавленных товаров при нажатии закрыть браузер/вкладку
window.onunload = function() {
    if (!claim.saveForm && claim.onunload) {
        $.ajax({
            url      : linkPrefix + '/claim/supply/dropclaims',
            cache    : false,
            data     : {claimId : window.incomeoutUnloadData.cid},
            type     : 'POST',
            dataType : 'html',
            async    : false,
            success  : function(data){}
        });
    }
    if (!claim.saveForm && !claim.userBlockInfo) {
        $.ajax({
            url      : linkPrefix + '/claim/supply/unblockclaim',
            cache    : false,
            data     : {claimId : window.incomeoutUnloadData.cid},
            type     : 'POST',
            dataType : 'html',
            async    : false,
            success  : function(data){}
        });
    }
};
