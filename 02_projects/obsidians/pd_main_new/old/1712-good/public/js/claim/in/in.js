var claimin = new (
    function()
    {
        this.errorColor         = '#FFC0CB';
        this.goodColor          = '#CDFBCD';
        this.formId             = 'claimin-form';
        this.clientsList        = [];
        this.worktimeList       = [];
        this.managerList        = [];
        this.listCars           = [];
        this.loaderImg          = '/img/ld/ld3.gif';
        this.imgSrcDelSection   = '/img/system/delete.png';
        this.date               = -1;
        this.fullData           = {products:{}};
        this.pNumber            = 0;
        this.totalData          = {};
        this.permissions        = {};
        this.annotationRequired = 0;
        this.flagInfoIn         = false;
        this.saveForm           = false;
        this.onlyView           = false;
        this.accept             = 0;
        this.timeOut            = null;
        this.unloadRequired     = null;
        this.requiredFiles      = false;
        this.earlyBooking       = null;
        this.precision          = 0.00001;
        this.dataContainer = null;

        /**
         * хранит результат условия, является ли заявка на статусе менеджера
         * 1 - заявка на статусе "на подтв. менеджера"
         * 0 - любой другой статус
         * @var Int
         */
        this.managerStatus = 0;

        /**
         * хранит текущий статус завяки
         * 1 - создание
         * 2 - диспетчер
         * 0 - любой другой
         * @var Boolean
         */
        this.carStatusFlag = true;

        /**
         * @property {boolean} isClosedClaim флаг для определения закрытости заявки
         */
        this.isClosedClaim = false;

        /**
         * @property {boolean} isCreateStatus флаг для определения, что статус заявки на создании
         * @type {boolean}
         */
        this.isCreateStatus = false;

        /**
         * Бц за штуку
         */
        this.itemBaseprice;

        /**
         * форма с бц по остаткам
         */
        this.basePriceCheckerForm;

        /**
         * прокси объект для взаимодействия с angular приложением
         * @property {Claim_In_AngularProxy}
         */
        this.angularProxy;

        /**
         * ссылка на объект для работы с заказом total price
         * @type {boolean}
         */
        this.totalPriceOrder = false;

        /**
         * Получить id заявки
         * @returns {null|string}
         */
        this.getClaimId = function ()
        {
            return this.claimData ? this.claimData.claimId : null;
        };


        /**
         * Получить статус заявки
         * @returns {claimin.claimData.claim_status}
         */
        this.getClaimStatus = function ()
        {
            return this.claimData ? this.claimData.claim_status : null;
        };


        /**
         * Получить строки с данными товаров
         * @returns {jQuery}
         */
        this.getProductRows = function()
        {
            return $('#table_products_tbody').find('tr');
        };

        /**
         * Получить стоимость доставки
         * @returns {Number}
         */
        this.getRentPrice = function ()
        {
            return carView.getTotalPrice();
        };

        this.start = function()
        {
            var _self = this;
            $('input').live('focus', function() {
                $(this).select();
            });

            $('#claimin_date').datepicker({duration: 'fast', showAnim: 'fadeIn'});
            $('#claimin_paydate').datepicker({duration: 'fast', showAnim: 'fadeIn'});

            this.bindCountAmount();
            this.updateTotal();
            this.showBlockClaimInfo();
            this.showBlockClaimError();
            if (!this.onlyView) {
                this.showBlockServiceError();
            }

            // Установить декораторы
            $('.floatInput').fieldDecorator({ decorator: 'summ' });
            if ($('#poise').length) {
                $('#poise').fieldDecorator({ decorator: 'show', element: '#mechanicalWeightLoadedCarPoise', event: 'change' });
            }

            this.initDdmEdit();

            this.basePriceCheckerForm = new BasePriceChecker();

            this.dataContainer = new DataContainer();
            this.eventBus = new EventBus();

            if (window.DepotIndex) {
                this.depotIndex = new DepotIndex({
                    preset: 'claim',
                    eventBus: this.eventBus,
                });
            }

            if (window.DepotNominal) {
                this.depotNominal = new DepotNominal({
                    preset: 'claim',
                    eventBus: this.eventBus,
                });
            }

            if (window.Dimensions) {
                this.dimensions = new Dimensions({
                    preset: 'claim',
                });
            }

            if (window.Dispatcher) {
                this.dispatcher = new Dispatcher({
                    preset: 'claim',
                    dataContainer: this.dataContainer,
                    eventBus: this.eventBus,
                    updateCarListActionUrl: '/claim/out/get-dispatcher-drivers/',
                    depotIndex: this.depotIndex || false
                });
            }

            if (window.ApproximateClaimWeight) {
                new ApproximateClaimWeight({
                    preset: 'claim',
                });
            }

            if (window.CarProxy) {
                this.carProxy = new CarProxy({
                    preset: 'claim',
                });
            }

            if (window.TotalPriceOrder) {
                this.totalPriceOrder = new TotalPriceOrder({
                    orderFormButton: $('.js-create-total-price-order'),
                    totalPriceOrderForm: $('#totalPriceOrdersPage [ng-controller="ClaimInFormController"]'),
                    clientSelect: $('#claimin_client'),
                    claim: this
                });
            }

            if (window.LeadId) {
                new LeadId({
                    changeBtn: $('.js-lead-change-btn'),
                    dropBtn: $('.js-lead-drop-btn'),
                    field: $('[name="claim[leadId]"]'),
                    projectField: $('[name="claim[leadProjectId]"]'),
                    text: $('.js-lead-text'),
                    url: $('.js-lead-url'),
                    projectSelect: $('.js-lead-project-select'),
                });
            }

            if (window.Claim_In_AngularProxy) {
                this.angularProxy = new Claim_In_AngularProxy({
                    claim: this,
                    angularElement: $('#app')
                });

                $('#products input[fieldtype="boxes"], #products input[fieldtype="amount"]').each(function(){
                    // инициализация предыдущих значений
                    $(this).data('prev-value', $(this).val());

                    // откат значений на предыдущие значения
                    $(this).on('companyEquipment.rollback', function () {
                        $(this).val($(this).data('prev-value'));
                    });

                    // подтверждение изменения значения поля и замена предыдущего значения
                    $(this).on('companyEquipment.commit', function () {
                        $(this).data('prev-value', $(this).val());
                    });
                });

                // изменение поля "Кол-во упаковок / кол-во роликов"
                $('#products').on('change amount:changed', 'input[fieldtype="amount"]', function() {
                    var currentVal = isNaN(parseInt($(this).val())) ? 0 : parseInt($(this).val());
                    var parent = $(this).closest('tr');
                    var boxes = parent.find('input[fieldtype="boxes"]');
                    var productNumber = parent.attr('number');
                    var element = $(this);
                    var boxesLinked = parseInt($(this).attr('itemtype')) === 1;

                    $('#app').addClass('element-preload');
                    _self.angularProxy.whenReady(function () {
                        _self.angularProxy.params.angularApi.product.fetchCompanyEquipment().then(
                            function () {
                                var error = '';
                                if (_self.angularProxy.canChangeCompanyEquipmentConsumableAmount(productNumber, currentVal)) {
                                    if (_self.angularProxy.changeCompanyEquipmentMaxInventoryNumbers(productNumber, currentVal)) {
                                        element.trigger('companyEquipment.commit');
                                        if (boxesLinked) {
                                            boxes.trigger('companyEquipment.commit');
                                        }
                                        return true;
                                    } else {
                                        error = 'Нельзя уменьшить кол-во уп-к/кол-во роликов.\r\nСначала нужно удалить инвентарные номера.';
                                    }
                                } else {
                                    error = 'Нельзя уменьшить кол-во уп-к/кол-во роликов.\r\nЕсть списанные расходники.';
                                }

                                alert(error);
                                element.trigger('companyEquipment.rollback');
                                if (boxesLinked) {
                                    boxes.trigger('companyEquipment.rollback');
                                }
                                return false;
                            },
                            function (reason) {
                                alert('Возникла ошибка при получении данных об имуществе компании, обратитесь к администраторам.');
                                element.trigger('companyEquipment.rollback');
                                if (boxesLinked) {
                                    boxes.trigger('companyEquipment.rollback');
                                }
                                console.error(reason);
                            }
                        ).finally(function () {
                            $('#app').removeClass('element-preload');
                        });
                    });
                });

                // Вызов формы создания товара через "Дополнительные товары"
                if (typeof productsExtra != 'undefined') {
                    productsExtra.showProductEditor = (formData) => {
                        this.angularProxy.showProductEditor(formData);
                    }
                }

                $("#table_products_tbody>tr")
                    .each(function (_, tr) {
                        tr.classList.add("js-tableNavigatorRow");
                        $("input[type=\"text\"]", tr).each(function (_, td) {
                            td.classList.add("js-tableNavigationCell");
                        });
                    });

                $("#table_products").tableNavigatorPlugin();
            }
        };

        /**
         * преобразование строки во float  с точностью 5 знаков после запятой
         * @param {string} str
         * @return float
         */
        this.toFloat = function(str)
        {
            str = parseFloat(str);
            if (isNaN(str)) {
                return 0;
            }
            return this.round(str);
        };

        /**
         * round number with precision 5
         * @param {Number} number
         * @return float
         */
        this.round = function(number)
        {
            return Math.round(parseFloat(number)*100000)/100000;
        };

        /**
         * get element by id
         * @param {string} id
         * @return link to Node
         */
        this.el = function(id)
        {
            return document.getElementById(id);
        };

        /**
         * удаляет все дочерние елементы из заданного контейнера
         * @param {node|string} obj
         * @return void
         */
        this.empty = function(obj)
        {
            if (typeof obj === 'string') {
                obj = this.el(obj);
            }
            while(obj.firstChild) {
                obj.removeChild(obj.firstChild);
            }
        };

        /**
         * получить елемент формы
         * @param {String} name
         */
        this.element = function(name)
        {
            return this.node(this.formId)[name];
        };

        this.node = function(id) {
            if (typeof id === 'string') {
                return document.getElementById(id);
            }
            return id.nodeType === 1 ? id : null;
        };


        /**
         * uncompres data
         * @param {String} str
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
         * фильтр для менеджеров
         * @param nodeObject obj
         * @return void
         */
        this.filterManager = function(obj)
        {
            var options = this.el(obj.lang).options;
            if (!this.managerList.length) {
                for(var i = 0; i < options.length; i++) {
                    this.managerList.push({id:options[i].value, text:options[i].text});
                }
            }
            options.length = 0;
            var search = obj.value.toLowerCase().replace(/^\s+|\s+$/, '');

            for(var i = 1; i < this.managerList.length; i++) {
                if (search.length && this.managerList[i].text.toLowerCase().indexOf(search) == -1) {
                    continue;
                }
                options[options.length] = new Option(this.managerList[i].text, this.managerList[i].id);
            }
            //this.el(obj.lang).onchange();
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
                var options = self.el('claimin_carNumber').options;
                options.length = 0;
                var search = obj.value.toLowerCase().replace(/^\s+|\s+$/, '');

                for (let key in self.dataContainer.get('carList')) {
                    if (search.length && self.dataContainer.get('carList')[key].carNumber.toLowerCase().indexOf(search) == -1) {
                        continue;
                    }
                    options[options.length] = new Option(self.dataContainer.get('carList')[key].carNumber, self.dataContainer.get('carList')[key].id);
                }
                options.length ? self.changeCarNumber('claimin_carNumber', options[0].value) : self.changeCarNumber('claimin_carNumber');
            }, 500);
        };


        /**
         * филтр для клиентов
         * @param nodeObject obj
         * @return void
         */
        this.filterClient = function(obj)
        {
            var node = document.getElementById('claimin_client');
            var options = node.options;
            if (!this.clientsList.length){
                for(var i = 0; i < options.length; i++) {
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
         * изменение клиента
         * @param nodeObject obj
         * @return void
         */
        this.changeClient = function(obj)
        {
            this.el('claimin-work-time').innerHTML = '<span style="font-size: 10pt; font-weight: bold;">Время работы : </span>' + obj.options[obj.selectedIndex].lang;
        };


        /**
         * отображение информации о товарах
         * @param object data
         * @return void
         */
        this.displayProductsInfo = function(data)
        {
            $('#products').html(data);
            this.filter.rebuildFilter();
        };


        /**
         * изменение машины
         * @param nodeObject obj
         * @return void
         */
        this.changeCar = function(obj)
        {
            var disabled = obj.value != 1;
            if (obj.value == '' || obj.value == '0') {
                $('input[name="claim[tk]"]').prop('disabled', true);
            } else {
                $('input[name="claim[tk]"]').prop('disabled', false);
            }
            var inps = this.el(obj.id + '_tbody').getElementsByTagName('input');
            for(var i = 0; i < inps.length; i++) {
                inps.item(i).disabled = disabled;
            }
            var inps = this.el(obj.id + '_tbody').getElementsByTagName('select');
            for(var i = 0; i < inps.length; i++) {
                inps.item(i).disabled = disabled;
            }
            this.el(obj.id + '_tbody').style.display = (disabled?'none':'');

        };

        /**
         * синхронизация данных по машине
         * @param nodeObject obj
         * @param integer idChangedCar принимает id выбранной при быстром поиске по машине
         * @return void
         */
        this.changeCarNumber = function(obj, idChangedCar)
        {
            // ФИО водителя
            var obj2 = this.el(this.formId)['claim[driverName]'];
            // Телефон водителя
            var obj3 = this.el(this.formId)['claim[driverPhone]'];

            //если значение idChangedCar передано из быстрого поиска заполняем поля имя и телефон водителя
            if (idChangedCar) {
                for(let key in claimin.dataContainer.get('carList')) {
                    if (claimin.dataContainer.get('carList')[key].id != idChangedCar) {
                        continue;
                    }
                    obj2.value = claimin.dataContainer.get('carList')[key].name;
                    obj3.value = claimin.dataContainer.get('carList')[key].phone;
                    return;
                }
            }

            if ((obj.value == -1) || (obj.value == undefined)){
                obj2.value = '';
                obj3.value = '';
                return;
            }

            //если в листбоксе выбрано значение, заполняем поля имя и телефон водителя
            for(let key in claimin.dataContainer.get('carList')) {
                if (claimin.dataContainer.get('carList')[key].id != obj.value) {
                    continue;
                }
                obj2.value = claimin.dataContainer.get('carList')[key].name;
                obj3.value = claimin.dataContainer.get('carList')[key].phone;
                break;
            }
        };


        /**
         * общее обновленеи сумм
         */
        this.updateTotal = function()
        {
            if(this.onlyView) {
                return;
            }
            var countData = {
                //price : {classname : 'productClass', },
                totalprice : {classname : 'productTotalPrice', totalId : 'autosummtotalprice'},
                boxes      : {classname : 'productBoxes', totalId: 'autosummboxes'},
                amount     : {classname : 'productAmount', totalId : 'autosummamount'},
                fweight    : {classname : 'productWeight', totalId: 'autosummfweight'},
                rweight    : {classname : 'productRweight', totalId: 'autosummrweight'}
            };

            var _self = this;

            _self.totalData = {
                productTotalPrice : 0,
                productAmount     : 0,
                productBoxes      : 0,
                productWeight     : 0,
                productRweight    : 0
            };

            for(var field in countData) {
                var elementClassName = '.' + countData[field].classname;
                $(elementClassName).each(function(i, val) {
                    _self.totalData[countData[field].classname] += claimin.round($(this).val()) || 0;
                });

                if (!claimin.userBlockInfo) {
                    $('#' + countData[field].totalId).text(_self.round(_self.totalData[countData[field].classname]));
                }
            }

            $('#claimin_factsumm').val(_self.round(_self.totalData['productTotalPrice']));
            $('#claimin_factsumm_view').text(_self.round(_self.totalData['productTotalPrice']));
            $('#claimin_productweight').val(_self.round(_self.totalData['productWeight']));
        };


        /**
         * Подсчет
         *
         */
        this.bindCountAmount = function()
        {
            var self = this;
            $('.productWeight').live('input', function() {
                var tmpVal = $(this).val();
                if(/,/.test(tmpVal)) {
                    tmpVal = tmpVal.replace(',', '.');
                }
                $(this).val(tmpVal);
            });

            /**
             * обработка изменений в поле
             */
            function processInput() {
                var tmpVal = $(this).val();
                if(/,/.test(tmpVal)) {
                    tmpVal = tmpVal.replace(',', '.');
                }
                $(this).val(tmpVal);

                var price, totalprice, boxes, inboxes, amount,fweight,dweight,spoolweight;
                var itemType = parseInt($(this).attr('itemtype'));
                var name = $(this).attr('fieldtype');
                var number = $(this).closest('tr').attr('number');

                amount     = parseFloat($('input[fieldtype=amount]', $(this).parent().parent()).val());
                $('input.productWeight[itemtype="2"]', $(this).parent().parent()).val((amount > 0 ? amount : 0));

                boxes      = parseFloat($('input[fieldtype=boxes]', $(this).parent().parent()).val());
                totalprice = parseFloat($('input[fieldtype=totalprice]', $(this).parent().parent()).val());
                price      = parseFloat($('input[fieldtype=price]', $(this).parent().parent()).val());
                inboxes    = parseFloat($('input[fieldtype=inboxes]', $(this).parent().parent()).val());
                fweight    = parseFloat($('input[fieldtype=fweight]', $(this).parent().parent()).val());
                dweight    = parseFloat($('input[fieldtype=dweight]', $(this).parent().parent()).val());
                spoolweight= parseFloat($('input[fieldtype=spoolweight]', $(this).parent().parent()).val());

                // Если изменяется цена или сумма
                if (name == 'totalprice') {
                    if(!isNaN(amount) && !isNaN(totalprice)) {
                        price = claimin.round(totalprice / amount);
                        if(!isNaN(price) && price != 'Infinity') {
                            $('input[fieldtype=price]', $(this).parent().parent()).val(price);
                        }
                    } else {
                        if(!isNaN(price) && price != 'Infinity') {
                            $('input[fieldtype=price]', $(this).parent().parent()).val('');
                        }
                    }
                } else if (name == 'price') {
                    if(!isNaN(amount) && !isNaN(price)) {
                        totalprice = claimin.round(amount * price);
                        if(!isNaN(totalprice) && totalprice != 'Infinity') {
                            $('input[fieldtype=totalprice]', $(this).parent().parent()).val(totalprice);
                        }
                    } else {
                        if(!isNaN(totalprice) && totalprice != 'Infinity') {
                            $('input[fieldtype=totalprice]', $(this).parent().parent()).val('');
                        }
                    }
                }

                // Если мешки то подсчет общего количества
                if(itemType == 1) {
                    // Если правится количество упаковок
                    if(name == 'boxes') {
                        if(!isNaN(inboxes)) {
                            boxes = (isNaN(boxes)) ? 0 : boxes;
                            amount = boxes * inboxes;
                            totalprice = amount * price;
                            $('input[fieldtype=amount]', $(this).parent().parent()).val(amount).trigger('amount:changed');
                            if(!isNaN(totalprice)) {
                                $('input[fieldtype=totalprice]', $(this).parent().parent()).val(totalprice);
                            }

                            newDweight = boxes * spoolweight + fweight;
                            if(!isNaN(newDweight)) {
                                $('input[fieldtype=dweight]', $(this).parent().parent()).val(newDweight);
                                dweight = newDweight;
                            }

                            spoolweight = (dweight - fweight)/boxes;
                            if(!isNaN(spoolweight)) {
                                $('input[fieldtype=spoolweight]', $(this).parent().parent()).val(spoolweight);
                            }

                            if (self.totalPriceOrder) {
                                self.totalPriceOrder.changeAmount(number * 1, amount);
                            }
                        }
                    }
                    // Если правится количество
                    if (name == 'amount') {
                        if(!isNaN(inboxes) && !isNaN(amount)) {
                            boxes = claimin.round(parseFloat(amount / inboxes));
                            $('input[fieldtype=boxes]', $(this).parent().parent()).val(boxes).trigger('boxes:changed');
                            if(!isNaN(amount) && !isNaN(price) ) {
                                totalprice = claimin.round(parseFloat(amount * price));
                                $('input[fieldtype=totalprice]', $(this).parent().parent()).val(totalprice);
                            }
                        } else if(isNaN(amount)) {
                            $('input[fieldtype=boxes]', $(this).parent().parent()).val('').trigger('boxes:changed');
                        }
                        dweight = boxes * spoolweight + fweight;
                        if(!isNaN(dweight)) {
                            $('input[fieldtype=dweight]', $(this).parent().parent()).val(dweight);
                        }
                        spoolweight = (dweight - fweight)/boxes;
                        if(!isNaN(spoolweight)) {
                            $('input[fieldtype=spoolweight]', $(this).parent().parent()).val(spoolweight);
                        }

                        if (self.totalPriceOrder) {
                            self.totalPriceOrder.changeAmount(number * 1, amount);
                        }
                    }
                }
                else if(itemType == 2) {
                    // Если ролики, то подсчет среднего веса
                    if (name == 'amount' || name == 'boxes') {
                        // Общий вес
                        if(!isNaN(amount) && !isNaN(boxes)) {
                            inboxes = claimin.round(amount / boxes);
                            $('input[fieldtype=inboxes]', $(this).parent().parent()).val(inboxes);
                        }

                        if (name == 'amount') {
                            if(!isNaN(amount) && !isNaN(price)) {
                                $('input[fieldtype=totalprice]', $(this).parent().parent()).val( parseFloat(price) * parseFloat(amount));
                            }

                            if (self.totalPriceOrder) {
                                self.totalPriceOrder.changeAmount(number * 1, amount);
                            }
                        }

                        newDweight = boxes * spoolweight + fweight;
                        if(!isNaN(newDweight)) {
                            $('input[fieldtype=dweight]', $(this).parent().parent()).val(newDweight);
                            dweight = newDweight;
                        }

                        spoolweight = (dweight - fweight)/boxes;
                        if(!isNaN(spoolweight)) {
                            $('input[fieldtype=spoolweight]', $(this).parent().parent()).val(spoolweight);
                        }
                    }
                }

                // Если правится фактический вес
                if (name == 'fweight') {
                    newDweight = boxes * spoolweight + fweight;
                    if(!isNaN(newDweight)) {
                        $('input[fieldtype=dweight]', $(this).parent().parent()).val(newDweight);
                    } else {
                        spoolweight = (dweight - fweight) / boxes;
                        if(!isNaN(dweight)) {
                            $('input[fieldtype=spoolweight]', $(this).parent().parent()).val(spoolweight);
                        }
                    }
                }
                // Если правится грязный вес
                if (name == 'dweight') {
                    spoolweight = (dweight - fweight)/boxes;
                    if(!isNaN(spoolweight)) {
                        $('input[fieldtype=spoolweight]', $(this).parent().parent()).val(spoolweight);
                    }
                }
                // Если правится вес шпули
                if (name == 'spoolweight') {
                    dweight = boxes * spoolweight + fweight;
                    if(!isNaN(dweight)) {
                        $('input[fieldtype=dweight]', $(this).parent().parent()).val(dweight);
                    }
                }

                self.setMinusFieldColor($('input[fieldtype=spoolweight]', $(this).parent().parent()), spoolweight);
                self.setMinusFieldColor($('input[fieldtype=dweight]', $(this).parent().parent()), dweight);

                claimin.updateTotal();
            }

            $('input[triggerevent=Y]').live('input', function() {
                // если есть заказ total price, то при изменении кол-ва и цены происходит куча действий в форме заказа
                if (self.totalPriceOrder || self.angularProxy) {
                    if ($(this).data('eventTimer')) {
                        clearTimeout($(this).data('eventTimer'));
                    }

                    var element = $(this);
                    $(this).data('eventTimer', setTimeout(function () {
                        processInput.call(element);
                    }, 100));
                } else {
                    processInput.call($(this));
                }
            });

            $('.productWeight').live('input', function() {
                claimin.updateTotal();
            });
        };

        /**
         * Метод возвращает начальную информацию по блокировкам секции под менеджеров
         *
         * @param $sectionTr Строка, с помощью которой осуществляется редактирование секции на форме
         *
         * @returns {null}
         */
        this.getSectionDdmInitialInfo = function($sectionTr) {
            return Claim_In_Product_DepotDetailedManager_Transfer_Form.prototype.getSectionDdmInitialInfo.apply({
                getBindedSectionTr: function () {
                    return $sectionTr;
                }
            });
        };

        /**
         * Метод возвращает текущую информацию по блокировкам секции под менеджеров
         *
         * @param $sectionTr
         *
         * @returns {*}
         */
        this.getSectionDdmInfo = function ($sectionTr) {
            var depotDetailedManagerTransferForm = this.getDepotDetailedManagerTransferForm($sectionTr);
            if (depotDetailedManagerTransferForm) {
                // Если форма блокировки секций под менеджеров открыта, возьмем данные оттуда
                return depotDetailedManagerTransferForm.getSectionDdmInfo();
            } else {
                // Иначе - начальные данные
                return this.getSectionDdmInitialInfo($sectionTr);
            }
        };

        /**
         * подсветка красным поля с отрицательным значением
         * @returns bool
         */
        this.setMinusFieldColor = function(field, val)
        {
            if (val < 0) {
                field.css({backgroundColor: '#f7a0a0'});
            } else {
                field.css({backgroundColor: ''});
            }
        }


        /**
         * проверка правильности введенных данных
         * @returns bool
         */
        this.checkForm = function()
        {
            var self = this;

            var isClaimClosed = ( $('input[name="claim[claimStatus]"]').val() == 0 );

            var elements = this.el(this.formId).elements;

            this.saveForm = false;
            var data = {products:[]};
            for(var i = 0; i < elements.length; i++) {
                if (/^claim\[[a-zA-Z_0-9]+\]$/.test(elements[i].name)) {
                    var name = elements[i].name.replace(/^claim\[/, '').replace(/\]/, '');
                    data[name] = elements[i].value;
                    continue;
                }
                if (/^products\[\d+\]\[[a-zA-Z_0-9]+\]$/.test(elements[i].name)) {
                    var name = elements[i].name.replace(/^products/, '').replace(/^\[|\]$/g, '').replace(/\]\[/g, '.').split('.');
                    var pnumber = name[0];
                    var key = name[1];
                    if (typeof data.products[pnumber] == 'undefined') {
                        data.products[pnumber] = {};
                    }
                    data.products[pnumber][key] = elements[i].value;
                    continue;
                }
            }

            var errors = [];

            claimInDepotRejectMain.check(errors);

            if (typeof(data.clientId) != 'undefined' && parseInt(data.clientId) < 1) {
                errors.push(' - не выбран клиент');
            }

            if(typeof(data.kpp) != 'undefined') {
                if(parseInt(data.kpp) == -1 || isNaN(parseInt(data.kpp))) {
                    errors.push(' - не указан КПП клиента');
                }
            }

            if (typeof(data.car) != 'undefined' && data.car == '') {
                errors.push(' - не выбрана машина');
            }

            if($('select[name="claim[payment]"] option[data-claim-payment-no-choice]:selected').size()) {
                errors.push(' - не выбран тип оплаты');
            }

            if (typeof(data.managerId) != 'undefined' && parseInt(data.managerId) < 1) {
                errors.push(' - не выбран менеджер');
            }
            if (typeof(data.date) != 'undefined' && !this.checkDate(data.date)) {
                errors.push(' - не указана дата исполнения или не верный формат');
            }

            if ($("#js-early-booking-container-number input").length > 0 && !$("#js-early-booking-container-number input").prop('disabled') && $("#js-early-booking-container-number input").val().length === 0) {
                errors.push(' - заполните поле "Контейнер №"');
            }

            // Валидация поля "Грузчики"
            if (typeof(data.carLoaders) != 'undefined') {
                if (data.carLoaders == 0) {
                    errors.push(' - необходимо заполнить поле "Грузчики"');
                } else if (data.carLoaders == 1) {
                    if (data.carLoadersCount < 1) {
                        errors.push(' - не указано кол-во грузчиков');
                    }
                    if (data.carLoadersPrice < 1) {
                        errors.push(' - стоимость найма грузчиков имеет неверный формат');
                    }
                }
            }
            if (typeof(data.paydate) != 'undefined' && !this.checkDate(data.paydate)) {
                errors.push(' - не указана дата оплаты или не верный формат');
            }
            var flag = parseInt(this.el(this.formId)['changeStatusAvaleble'].value);
            if (typeof(data.annotation) != "undefined" && parseInt(this.annotationRequired) && flag) {
                if (typeof(tinyMCE) !== "undefined" && tinymce.get('claimin_annotation')) {
                    if (!tinyMCE.get('claimin_annotation').getContent()) {
                        errors.push(' - не указано примечание');
                    }
                }
            }

            if (typeof(carView) != 'undefined' && data.car != 1 && carView.getVehicleAccessController() && !carView.getVehicleAccessController().check()) {
                errors.push(' - необходимо заполнить все поля для доступа ТС на территорию');
            }

            var products = data.products || [];

            // Содержит флаг сохраняем или отправляем заявку
            var nextStatusAv = $("[name=changeStatusAvaleble]").val();

            //true если цена хотя бы одного из продуктов = 0
            var priceZero = false;
            var baseprices = new Array();
            var basepricesin = new Array();

            // Сбрасываем ошибки детализаций броней под менеджеров
            $(this.el(this.formId)).find('tr.ddm-errored').each(function(i, target) {
                $(target).removeClass('ddm-errored').attr('title', null);
            });

            /**
             * Функция выполняет отображение ошибки для секции
             *
             * @param sectionTr
             * @param message
             */
            function addSectionTrError(sectionTr, message) {
                sectionTr.addClass('ddm-errored');
                if (message) {
                    // Добавляем сообщение об ошибке в тег `title`
                    sectionTr.attr('title', message);
                }
            }

            // Проверка детализации броней под менеджеров
            var ddmDataValidateResult = true;
            function checkDdmData(product) {
                if (!(parseInt(product.number) > 0)) {
                    try {
                        _tools.throwError(new Error('Неверно указан номер товара'), _tools.defaultAlertErrorMessage);
                    } catch (e) { _tools.processError(e); }
                }

                var row = $(claimin.el(claimin.formId)).find('#table_products #table_products_tbody tr[number="' + parseInt(product.number) + '"]');
                if (!row.length) {
                    try {
                        _tools.throwError(new Error('Товар с указанным номером не найден на форме'), _tools.defaultAlertErrorMessage);
                    } catch (e) { _tools.processError(e); }
                }

                // Данные по блокировке секции под мнеджеров
                var sectionDdmInfo = self.getSectionDdmInfo(row);
                if (sectionDdmInfo.managersRowsCount > 0) {
                    var depotDetailedManagerTransferForm = self.getDepotDetailedManagerTransferForm(row);

                    var sectionData = Claim_In_Product_DepotDetailedManager_Transfer_Form.prototype.getSectionTrData.apply({
                        getBindedSectionTr: function () { return row; },
                        getSectionDdmInitialInfo: function () {
                            return self.getSectionDdmInitialInfo(row);
                        }
                    });

                    if (
                        (Math.abs(parseFloat(sectionDdmInfo.ddData.amount||0) - sectionData.amount) > 0.00001) ||
                        (Math.abs(parseFloat(sectionDdmInfo.ddData.boxes||0) - sectionData.boxes) > 0.00001)
                    ) {
                        // Если есть расхождение в количествах

                        // Есть ли возможность переноса всего количества в секции под одного менеджера (если есть только одна блокировка под менеджера)
                        var availableToSetAllAmountToOneManager = parseInt(sectionDdmInfo.managersRowsCount) === 1;
                        // Результат автоматического переноса
                        var autoAllocationResult = false;
                        if (
                            availableToSetAllAmountToOneManager
                            && confirm("Для товара № " + parseInt(product.number) + ":" + product.id + ' (Секция ' + product.section + ')' + " необходимо перераспределение блокировок под менеджеров. \r\n\r\nПеренести всё доступное количество под одного менеджера?")
                        ) {
                            if (!depotDetailedManagerTransferForm) {
                                // Создаем форму
                                depotDetailedManagerTransferForm = self.createDepotDetailedManagerTransferForm(row);
                            } else {
                                depotDetailedManagerTransferForm.actualizeState();
                            }

                            if (!(autoAllocationResult = depotDetailedManagerTransferForm.allSectionAmountToOneDdmRow())) {
                                alert("Произошла ошибка при автоматическом перераспределении. \r\n\r\nПожалуйста, отредактируйте форму БЛОКИРОВКИ СЕКЦИИ ПОД МЕНЕДЖЕРОВ самостоятельно.");
                            }
                        }

                        if (!depotDetailedManagerTransferForm && !autoAllocationResult) {
                            addSectionTrError(row, 'Суммарное количество по блокировкам под менеджеров должно быть равно общему количеству по секции');
                            ddmDataValidateResult = false;
                        }
                    }

                    if (depotDetailedManagerTransferForm) {
                        // В случае, если для этой секции есть открытая форма, сделаем проверку формы

                        // Перед проверкой формы делаем загрузку актуального состояния
                        if (!depotDetailedManagerTransferForm.actualizeState().validate(false)) {
                            addSectionTrError(depotDetailedManagerTransferForm.getBindedSectionTr(), depotDetailedManagerTransferForm.validation.getErrorInfo('При проверке формы БЛОКИРОВКИ СЕКЦИИ ПОД МЕНЕДЖЕРОВ обнаружены ошибки:'));
                            ddmDataValidateResult = false;
                        }
                    }
                }
            }

            for(var i = 0; i < products.length; i++) {
                if (typeof products[i] == 'undefined') {
                    continue;
                }

                //если не указана цена товара
                if (isNaN(parseFloat(products[i].price)) || parseFloat(products[i].price) <= 0.00001) {
                    priceZero = true;
                }
                if (isNaN(parseFloat(products[i].price)) !== isNaN(parseFloat(products[i].totalprice))) {
                    errors.push(' - не указана цена или сумма в товаре');
                }
                if (
                    (isNaN(parseFloat(products[i].amount)) || parseFloat(products[i].amount) <= 0.00001) &&
                    this.permissions['amount'] > 3
                ) {
                    errors.push(' - не указан вес в товаре');
                }
                if (
                    (isNaN(parseFloat(products[i].boxes)) || parseFloat(products[i].boxes) <= 0.00001) &&
                    this.permissions['boxes'] > 3
                ) {
                    errors.push(' - не указано кол-во в товаре');
                }
                if (nextStatusAv == 1 && typeof(products[i].section) != 'undefined' && products[i].section == '' && this.permissions['section'] > 3) {
                    errors.push(' - не указан № секции');
                }
                if(claimin.splitgoods === 0 && products[i].itemType == 1 && (parseFloat(products[i].amount)%parseFloat(products[i].inboxes))){
                    errors.push(' - товар:' +  products[i].id + ' количество товара должно быть кратно количеству в упаковке ' + products[i].inboxes);
                }

                if(products[i].itemType == 2 && parseFloat(products[i].parity) > 0 && (parseFloat(products[i].boxes) % parseFloat(products[i].parity))){
                    errors.push(' - товар:' +  products[i].id + ' количество упаковок должно быть кратно коэффициенту кратности ' + products[i].parity);
                }

                // проверяем фактический вес, только если заявка не закрыта
                if ( nextStatusAv == 1
                     && ! isClaimClosed
                     && typeof(products[i].fweight) != 'undefined'
                     && products[i].fweight == ''
                     && this.permissions['fweight'] > 3
                ) {
                    errors.push(' - не указан фактический вес');
                }

                if (typeof(products[i].baseprice) != 'undefined') {
                    if (typeof(baseprices[products[i].id]) != 'undefined'
                        && (Math.abs(baseprices[products[i].id] - products[i].baseprice) > this.precision)
                    ) {
                        errors.push(' - по товару с ID ' + products[i].id + ' в этой же заявке уже стоит другая БЦ');
                    } else {
                        baseprices[products[i].id] = products[i].baseprice;
                    }
                }

                if (typeof(products[i].baseprice_in) != 'undefined') {
                    if (typeof(basepricesin[products[i].id]) != 'undefined'
                        && basepricesin[products[i].id] !== products[i].baseprice_in
                    ) {
                        errors.push(' - по товару с ID ' + products[i].id + ' в этой же заявке уже стоит другая ЗБЦ');
                    } else {
                        basepricesin[products[i].id] = products[i].baseprice_in;
                    }
                }

                if (this.accept) {
                    if (typeof(products[i].baseprice) != 'undefined' && products[i].baseprice == '') {
                        errors.push(' - не указана базовая цена товара');
                    }
                    if (typeof(products[i].baseprice_in) != 'undefined' && products[i].baseprice_in == '') {
                        errors.push(' - не указана закупочная базовая цена товара');
                    }
                }

                // Делаем проверку по блокировкам секции под менеджеров
                checkDdmData(products[i]);
            }

            if (!ddmDataValidateResult) {
                errors.push(' - проверьте правильность блокировки секций под менеджеров');
            }

            // Содержит в себе массив ошибок в случае если мы должны перевести заявку на статус диспетчера
            var emptyFileds = [];

            if(typeof(data.car) != 'undefined' && parseInt(data.car) == 1) {

                if(typeof(data.carType) != 'undefined' && !this.checkEmpty(data.carType)) {
                    errors.push(' - не указан тип машины');
                }
                if(typeof(data.carNumber) != 'undefined' && parseInt(data.carNumber) < 1) {
                    if(this.carStatusFlag != 2 && this.carStatusFlag != 1 && nextStatusAv == 0) {
                        emptyFileds.push(' - не выбран номер машины');
                    }
                    if(nextStatusAv == 1 && (this.carStatusFlag == 2 || this.carStatusFlag == 0)) {
                        errors.push(' - не выбран номер машины');
                    }

                }

                if (this.dispatcher && !this.dispatcher.isValid()) {
                    errors.push(' - не выбран диспетчер');
                }

                if(typeof(data.driverName) != 'undefined' && !this.checkEmpty(data.driverName)) {
                    if(this.carStatusFlag != 2 && this.carStatusFlag != 1 && nextStatusAv == 0) {
                         emptyFileds.push(' - не указаны ФИО водителя');
                    }
                    if(nextStatusAv == 1 && (this.carStatusFlag == 2 || this.carStatusFlag == 0)) {
                           errors.push(' - не указаны ФИО водителя');
                    }
                }
                if(typeof(data.driverPhone) != 'undefined' && !this.checkEmpty(data.driverPhone)) {
                    if(this.carStatusFlag != 2 && this.carStatusFlag != 1 && nextStatusAv == 0) {
                        emptyFileds.push(' - не указан телефон водителя');
                    }
                    if(nextStatusAv == 1 && (this.carStatusFlag == 2 || this.carStatusFlag == 0)) {
                        errors.push(' - не указан телефон водителя');
                    }
                }

                // Сумма найма
                if(typeof window.claimFieldRentPriceValidate == 'function') {
                    window.claimFieldRentPriceValidate({
                        'error': function(msg) {
                            errors.push(' - ' + msg);
                        }
                    });
                }

                // Данные ТК
                if(typeof window.carDataFieldInstance == 'object') {
                    window.carDataFieldInstance.validation({
                        'error': function(msg) {
                            errors.push(' - ' + msg);
                        }
                    });
                }

                // Адрес загрузки
                if (typeof(data.unloadAddressId) != 'undefined' && data.unloadAddressId == '') {
                    errors.push(' - не выбран "Адрес загрузки"');
                }

                // Ориентировочный вес
                if (parseInt(this.unloadRequired) === 1 && typeof(data.aproxClaimWeight) != 'undefined' && data.aproxClaimWeight <= '') {
                    errors.push(' - заполните поле "Ориентировочный вес по заявке"');
                }
                // Время подачи авто
                if (parseInt(this.unloadRequired) === 1 && typeof(data.transportDeliveryTime) != 'undefined' && data.transportDeliveryTime == '') {
                    errors.push(' - заполните поле "Время подачи автомобиля"');
                }
                // Поля выгрузки

                // Габариты, проверяем только при отправке на  следующий статус
                if (flag > 0 && !this.isClosedClaim && this.dimensions && !this.dimensions.isValid()) {
                    errors.push('- заполните поле "Габариты"');
                }

                if (!this.isClosedClaim && this.carProxy && !this.carProxy.isValid()) {
                    errors.push('- заполните поле "Требуется доверенность"');
                }

                if ((nextStatusAv == 1 || window.financeBtnClicked) && !this.validateManagerCorpPhone()) {
                    errors.push('- Внимание! Заявка в диспетчерский саппорт не может быть отправлена, так как у менеджера по заявке отсутствует корп. номер.');
                }
            }
            if(this.el('claimin_kickback') && parseInt(this.el('claimin_kickback').value) == 1) {
                if(!parseFloat(data.kickback)) {
                    errors.push(' - не указаны представительские расходы');
                }
            }

            if (typeof this.depotNominal !== 'undefined'
                && !this.depotNominal.isValid()
                && !this.isClosedClaim
            ) {
                errors.push('- заполните поле "Условный склад"');
            }

            // проверка при отправке на следующий статус, загружены ли документы, если документы обязательны для загрузки
            if (this.requiredFiles > 1 && !$('#docUpload').find('ul.documents li').length && nextStatusAv == 1) {
                errors.push(' - не загружены документы');
            }

            //проверка БЦ на подтверждении у менеджера
            if (this.managerStatus == 1) {
                $('input.productBasePrice[data-group_price!=null]').each(function (k, v) {
                    if (parseFloat($(v).val()) !== parseFloat($(v).data('real_baseprice'))) {
                            errors.push('- товар №' + $(v).data('id') + ' состоит в группе с БЦ. Установленная БЦ: ' + $(v).val() + '. Текущая БЦ: ' + $(v).data('real_baseprice') + '.');
                    }
                });
            }

            if (this.angularProxy) {
                errors = errors.concat(this.angularProxy.validateCompanyEquipment());
            }

            // проверка заполненности названия в дополнительных товарах
            if(typeof productsExtra != 'undefined') {
                var checkProductsExtra = productsExtra.checkProductsExtra();
                if (checkProductsExtra != "") {
                    errors.push(checkProductsExtra);
                }
            }

            if(emptyFileds.length) {
                var confirmation = confirm('Заявка будет возвращена на статус диспетчера т.к. не заполнены все поля: ' + String.fromCharCode(10, 13) + emptyFileds.join(String.fromCharCode(10, 13)) + String.fromCharCode(10, 13) + '');
                if (confirmation) {
                    this.saveForm = true;
                    emptyFileds = [];
                } else {
                    this.saveForm = false;
                    return false;
                }
            }

            // валидация заказа total price
            if (this.totalPriceOrder){
                var totalPriceCheck = this.totalPriceOrder.isValid((nextStatusAv * 1) === 1, this.managerStatus);
                if (!totalPriceCheck.result) {
                    errors = errors.concat(totalPriceCheck.errors);
                }
            }

            if (this.orgDepotCheck) {
                let depotValidation = (new OrgDepotValidator()).validate(this.getClaimId());
                if (!depotValidation.check) {
                    errors.push(`- Внимание! Вам запрещено проводить изменения в складе ${depotValidation.depotTitle}.`);
                }
            }

            if (errors.length) {
                var txt = 'Ошибки :' + String.fromCharCode(10, 13) + errors.join(String.fromCharCode(10, 13));
                alert(txt);
                return false;
            }

            //если не заполненна цена и закрываем заявку то выводим уведомление
            if(this.managerStatus == 1 && priceZero == true && nextStatusAv == 1) {
                var notice = confirm('Вы уверены что хотите закрыть заявку, не заполнив цену?');
                if (!notice) {
                    this.saveForm = false;
                    return false;
                }
            }

            this.saveForm = true;

            if (window.directoWageChecker
                && !window.directoWageChecker.check($('input[name="claim[id]"]').val(), $('input[name="claim[date]"]').val())
            ) {
                this.saveForm = false;
                return false;
            }

            this.beforeSave();

            return true;
        };


        /**
         * проверка на пустые значения
         * @param nodeObject obj
         * @returns bool
         */
        this.checkEmpty = function(value)
        {
            if (!value.replace(/^\s+|\s+$/, '')) {
                return false;
            }
            return true;
        };




        this.showDefectForm = function(pnumber, status)
        {
            buildForm(pnumber);
            var defect_reason = $("input[name='products["+pnumber+"][defect_reason]']").val();
            var data = '<textarea ' + status +' placeholder="Описание брака" name="products['+pnumber+'][form_defect_reason]" type="text"  style="margin-top:45px; width:250px; height:100px;" value="' + defect_reason + '">' + defect_reason + '</textarea><br/><span id="form_defect_reason_error" style="display:none;">Необходимо заполнить Описание брака</span><br/><br/>\n\
                        <input ' + status +' type="submit" value="Применить" onclick="claimin.submitDefectForm(' + pnumber +')"><br/><br/><br/>';
            $('#fieldsForm').html(data);
            correctBlocks();
            correctView();
        };

        this.submitDefectForm = function(pnumber) {

            var defect_reason = $("textarea[name='products["+pnumber+"][form_defect_reason]']").val();

            if (defect_reason !== '') {
                $("input[name='products["+pnumber+"][defect_reason]']").val(defect_reason);
            } else {
                $("#form_defect_reason_error").show();
            }
            if (defect_reason !== '') {
                closeFullDiv();
            }
        };

        this.showDefect = function(data, obj)
        {
            var number = $(obj).closest('tr').attr('number');
            if(obj.checked) {
                $(obj).closest('td').append(
                    '<span id="defect_reason_img_' + number + '">\n\
                        <img src="/img/system/edit.png" style="cursor:pointer" \n\
                         onclick="javascript:claimin.showDefectForm(' +number+ ')"/>\n\
                        <input type="hidden" value="" name="products['+number+'][defect_reason]" type="text" >\n\
                    </span>');
                claimin.showDefectForm(number);

            }else{
                $('#defect_reason_img_' + number).remove();
            }
        };

         /**
          * @param {String|Number} data id товара
          * @param {Object} obj dom элемент инпута
          *
          */
        this.checkBasePrice = function(data, obj)
        {
            this.basePriceCheckerForm.checkBasePrice({
                productId: data,
                basePrice: obj.value,
                bpType: obj.dataset.bp_type,
                depotId: $('.js-item-depot-id:first').val()
            });
        };

        /**
         *
         *
         */
        this.aliace = function(v, cnt, rowData) {
            var title = '<span class="show_advanced" itemId="' + rowData.id + '">' + v + '</span>';

            // Вывод примечания отдела закупок
            if (rowData.annotationIn) {
                var options = {
                    htmlPatternName : 'iconAnnotationBrown',
                    annotation      : rowData.annotationIn,
                    headerName      : 'annotationIn'
                };
                title += depot_tooltip.init(options).getTooltip();
            }

            return title;
        };


        /**
         * Поиск уже добавленных товаров
         * для пометки их в окне выбора
         */
        this.getAddedProducts = function()
        {
            var reg = new RegExp('^products\\[ids\\]\\[\\d+\\]$');
            var elements = document.getElementById(this.formId).elements;
            var data = [];
            for(var i=0; i<elements.length; i++) {
                if (reg.test(elements[i].name)) {
                    data.push({id:elements[i].value});
                }
            }
            return data;
        };


        /**
         * вставка данных по выбранному товару в форму
         * !компилирует angular код
         */
        this.addProduct = function(_data)
        {
            data = this.uncompresData(this.compresData(_data));

            data.production_manager_id = data.production_manager_id||'';

            data.unitWeight = 0;
            if  (data.formula) {
                data.unitWeight = eval('(' + data.formula.replace(/\$field6/g, data.height).replace(/\$field8/g, data.depth).replace(/\$field7/g, data.width) + ')');
            }

            // Если в массиве есть ключ 'product_number', используется он
            var number = ('product_number' in data && parseInt(data.product_number) > 0) ? data.product_number : (++this.pNumber);

            var _self = this;
            var list = {
                price:   {type:'input', name:'products[{number}][price]', value:'', fieldtype: 'price', classname: 'productPrice'},
                totalprice: {type:'input', name:'products[{number}][totalprice]',value:'', fieldtype: 'totalprice', classname: 'productTotalPrice'},
                baseprice: {
                    type: 'input',
                    name: 'products[{number}][baseprice]',
                    value: data.basePriceRegularValue,
                    title: (claimin.itemBaseprice == 1 ? data.basePricePerItemRegularValue : ''),
                    fieldtype: 'baseprice',
                    classname: 'productBasePrice'
                },
                baseprice_in: {
                    type: 'input',
                    name: 'products[{number}][baseprice_in]',
                    value: data.basePriceInRegularValue,
                    title: (claimin.itemBaseprice == 1 ? data.basePriceInPerItemValue : ''),
                    fieldtype: 'baseprice_in',
                    classname: 'productBasePriceIn'
                },
                special_bp_in: {
                    type: 'checkbox',
                    name: 'products[{number}][special_bp_in]',
                    value: data.special_bp_in,
                    fieldtype: 'special_bp_in',
                    classname: 'productSpecialBpIn js-special-bp-in'
                },
                boxes:   {type:'input', value: parseFloat(data.boxes)||'', name:'products[{number}][boxes]', oninput:function(){}, fieldtype: 'boxes', classname: 'productBoxes'}, // кол-во упаковок / кол-во роликов
                amount:  {type:'input', value: parseFloat(data.amount)||'', name:'products[{number}][amount]', oninput:function(){}, fieldtype: 'amount', classname: 'productAmount'}, // кол-во штук / вес
                id:      {type:'hidden', name:'products[{number}][id]'}, // id товара
                depot_id: {
                    type: 'hidden',
                    value: data.depot_id || 2,
                    name: 'products[{number}][depot_id]',
                    className: 'js-item-depot-id'
                },
                itemType:{
                    type: 'hidden',
                    name: 'products[{number}][itemType]',
                    value: data.type,
                    fieldAttrs: {
                        'data-rowdata-field-name': 'itemType'
                    }
                }, // тип товара
                number  :{type:'hidden', name:'products[{number}][number]', value:number}, // номер товара
                parity  :{type:'hidden', name:'products[{number}][parity]', value:data.parity}, // номер товара
                production_manager_id:{type:'hidden', name:'products[{number}][production_manager_id]', value:data.production_manager_id}, // блокировка под менеджера
                inboxes :{type:'input', name:'products[{number}][inboxes]', value:parseFloat(data.inBoxes), oninput:function(){}, fieldtype: 'inboxes', classname: 'productInBoxes'},
                section: {type:'input', name:'products[{number}][section]', value:'', classname: 'productSection'},
                defect: {type:'input', name:'products[{number}][defect]',value:'1', fieldtype: 'defect', classname: 'productDefect'},
                fweight: {type:'input', name:'products[{number}][fweight]', value:'', classname : 'productWeight', fieldtype: 'fweight'},
                rweight: {type:'input', name:'products[{number}][rweight]', value:'', classname : 'productRweight', fieldtype: 'rweight'},
                uin_entity: {
                    type: 'userFunction',
                    userFunction: function (cell) {
                        _self.angularProxy.createCompanyEquipmentList(cell, number);
                    }
                },
                dweight: {type:'input', name:'products[{number}][dweight]', value:'', classname : 'productDweight', fieldtype: 'dweight'},
                spoolweight: {type:'input', name:'products[{number}][spoolweight]', value:'', classname : 'productSpoolweight', fieldtype: 'spoolweight'},
                drop:    {
                    type:'imgs',
                    src: [
                        {src: '/img/system/delete.png', callback: 'claimin.deleteProduct(this)', title: 'удалить товар'},
                        {src: '/img/system/copy.24.png', callback: 'claimin.copyProduct(this)', title: 'Копировать товар'}
                    ],
                }, // удалить из списка, копировать товар
                // заменить товар
                replace: {
                    type:'userFunction',
                    userFunction: function (cell) {
                        if (data.sectionDdmInitialInfo) {
                            _self.angularProxy.createReplaceProduct(cell);
                        }
                    }
                },
                early_booking: {
                    type: 'userFunction',
                    userFunction: function (cell) {
                        switch (_self.permissions.early_booking) {
                            case 1:
                                $(cell).css({
                                    'white-space': 'nowrap',
                                }).hide().append($(this.elems).hide());
                                break;
                            case 2:
                            case 3:
                                $(cell).css({
                                    'white-space': 'nowrap',
                                }).append($(this.elems).hide());
                                $(cell).append($('<input type="checkbox" style="vertical-align: sub; margin-right: 10px;" disabled="disabled" class="productEarlyBookingCheckbox"><span>-</span>'));
                                break;
                            case 4:
                                $(cell).css({
                                    'white-space': 'nowrap',
                                }).append($(this.elems));
                                break;
                        }
                    },
                    elems: '<input type="hidden" name="earlyBooking[' + number + '][canBookProduct]" value="0">'
                            + '<input type="checkbox" name="earlyBooking[' + number + '][canBookProduct]" value="1" itemtype="' + data.type + '" fieldtype="canBookProduct" class="productEarlyBookingCheckbox"  style="vertical-align: sub; margin-right: 10px;">'
                            + '<input type="text" disabled="disabled" name="earlyBooking[' + number + '][canBookProductAmount]" fieldtype="canBookProductAmount" class="productEarlyBookingAmount" style="width: 120px;">',
                },
                total_price_order: {
                    type: 'userFunction',
                    userFunction: function (cell) {
                        if (_self.permissions.total_price_order) {
                            $(cell).append($(this.elems));
                            _self.totalPriceOrder.addPriceFromClaim(number);
                        }
                    },
                    elems: '<input type="checkbox" class="js-total-price-order_action" number="' + number + '"/>'
                },
                ids:     {
                    type:'text',
                    width:50,
                    value: data.parity > 0 ? "<span style='cursor:pointer; color: green; text-decoration: underline;' title='коэффициент кратности " + data.parity + "'>" + data.id + "</span>" : data.id,
                    colAttrs: {
                        'data-col-name': 'ids'
                    }
                }, // id товара
                title:   {type:'text', align:'left', width:180}, //название
                prop:    {type:'text', value: ((configPropType == 'string') ? data['prop']||'&nbsp;' : parseFloat(data['prop'])||'&nbsp;')}, // сорт товара первичка.вторичка
                color:   {type:'text', value: ((configColorType == 'string') ? data['color']||'&nbsp;' : parseFloat(data['color'])||'&nbsp;')}, // цвет товара
                boxType: {type:'text', value: ((configBoxTypeType == 'string') ? data['boxType']||'&nbsp;' : parseFloat(data['boxType'])||'&nbsp;')}, // тип упаковки
                volum:   {type:'text', value: ((configVolumType == 'string') ? data['volum']||'&nbsp;' : parseFloat(data['volum'])||'&nbsp;')}, // объем
                height:  {type:'text', value: ((configHeightType == 'string') ? data['height']||'&nbsp;' : parseFloat(data['height'])||'&nbsp;')}, // ширина
                width:   {type:'text', value: ((configWidthType == 'string') ? data['width']||'&nbsp;' : parseFloat(data['width'])||'&nbsp;')}, // длина
                depth:   {type:'text', value: ((configDepthType == 'string') ? data['depth']||'&nbsp;' : parseFloat(data['depth'])||'&nbsp;')}, // толщина
                labelWeight:  {type:'text', value: ((configLabelWeightType == 'string') ? data['labelWeight']||'&nbsp;' : parseFloat(data['labelWeight'])||'&nbsp;')}, // вес этикетки
                inBoxes: {type:'text'} // в упаковке
            };

            if(accessGlobalAmount == 1) {
                list['amountWeight'] = {type:'text'}; //вес/кол-во на складе
                list['boxesRols'] = {type:'text'}; // шт.рол-ов на складе
            }
            list['description'] = {type:'text', width:180}; // описание

            if ($('#table_products th[fieldname="from_production_claim"]').length) {
                list.fromProductionClaim = {type:'text', value: data.from_production_claim||'&nbsp;', fieldname: 'from_production_claim'};
            }

            var table = this.node("table_products_tbody");
            var row = table.insertRow(table.rows.length);
            row.setAttribute('number', number);
            row.lang = this.compresData(data);
            row.setAttribute('itemid', data.id);

            var addCell = true;
            for(var field in list) {
                /** обнуляем переменную, тк ниже в некоторых случаях (list[field].type == userFunction)
                 * node не устанавливается и после применяются действия к предыдущему элементу
                 * @type {HTMLInputElement}
                 */
                var node = document.createElement('input');
                if (this.permissions[field] === 0) {
                    continue;
                }
                this.setPermission(list[field], this.permissions[field]);

                addCell = true;

                if (list[field].type != 'hidden') {

                    if(field == 'price' || field == 'totalprice') {
                        if(this.permissions[field] < 2) {
                            addCell = false;
                        }
                    }

                    if(field == 'replace') {
                        addCell = false;
                    }

                    if(addCell) {
                        var cell = row.insertCell(row.cells.length);
                        cell.align = (list[field].align||'center');
                        cell.vAlign = 'center';
                    }
                }

                if (list[field].fieldname) {
                    cell.setAttribute('fieldname', list[field].fieldname);
                }

                switch(list[field].type) {
                    case 'userFunction':
                        list[field].userFunction(cell);
                        break;
                    case 'input':
                        node = document.createElement('input');
                        node.type = 'text';
                        node.name = list[field].name.replace(/\{number\}/, number);
                        node.value = list[field].value;
                        node.size = 8;
                        node.addEventListener('input', list[field].oninput, false);
                        if(list[field].fieldtype === 'baseprice') {
                            node.setAttribute('onchange','claimin.checkBasePrice(data.id, this)');
                            //если группа с БЦ запрещаем менять БЦ
                            node.dataset.group_price = data.basePriceGroupValue || null;
                            node.dataset.id = data.id;
                            node.dataset.real_baseprice = list[field].value;
                            node.dataset.bp_type = 1;
                            node.dataset.item_weight = (claimin.itemBaseprice == 1 ? data.item_weight : '');
                        }

                        if (list[field].fieldtype === 'baseprice_in') {
                            node.setAttribute('onchange','claimin.checkBasePrice(data.id, this)');
                            //если группа с БЦ запрещаем менять БЦ
                            node.dataset.group_price = data.basePriceInGroupValue || null;
                            node.dataset.id = data.id;
                            node.dataset.real_baseprice = list[field].value;
                            node.dataset.bp_type = 2;
                            node.dataset.item_weight = (claimin.itemBaseprice == 1 ? data.item_weight : '');
                        }

                        if(list[field].fieldtype == 'defect') {
                            node.type = 'checkbox';
                            node.setAttribute('onchange','claimin.showDefect(data.id, this)');
                        }
                        if(list[field].fieldtype == 'inboxes' || list[field].fieldtype == 'rweight') {
                            node.setAttribute('style', 'color: #aca899');
                            node.setAttribute('readonly', 'readonly');
                        }
                        node.setAttribute('class', list[field].classname);
                        node.setAttribute('fieldtype', list[field].fieldtype);
                        node.setAttribute('triggerevent', 'Y');
                        node.setAttribute('itemtype', data.type);
                        if ("title" in list[field]) {
                            node.setAttribute('title', list[field].title == null || list[field].title == undefined ? "" : list[field].title);
                        }
                        if ("item_weight" in list[field]) {
                            node.setAttribute('item_weight', list[field].item_weight);
                        }

                        if ($(node).hasClass('productAmount') && this.permissions.converter) {
                            this.applyMetricConverter($(cell), $(node));
                        }

                        if (field == 'boxes') {
                            $(node).data('prev-value', 0);
                        }

                        if(this.permissions[field] > 1) {
                            cell.appendChild(node);
                        }else {
                            row.appendChild(node);
                        }

                        break;
                    case 'hidden':
                        node = document.createElement('input');
                        node.type = 'hidden';
                        node.value = list[field].value||data[field];
                        node.name = list[field].name.replace(/\{number\}/, number);
                        node.size = 8;
                        node.className = list[field].className||'';
                        if(this.permissions[field] > 1) {
                            cell.appendChild(node);
                        }else {
                            row.appendChild(node);
                        }
                        break;
                    case 'img':
                        node = document.createElement('img');
                        node.src = list[field].src;
                        node.setAttribute('onclick','claimin.deleteProduct(this)');
                        node.align = 'absmiddle';
                        node.style.cursor = 'pointer';
                        node.title = 'удалить товар';
                        node.setAttribute('class', 'delPImg');
                        cell.appendChild(node);
                        break;
                    case 'imgs':
                        list[field].src.forEach((item) =>
                        {
                            node = document.createElement('img');
                            node.src = item.src;
                            node.setAttribute('onclick',item.callback);
                            node.align = 'absmiddle';
                            node.style.cursor = 'pointer';
                            node.title = item.title;
                            node.setAttribute('class', 'delPImg');
                            cell.appendChild(node);
                        });

                        break;
                    case 'text':
                        // Вывод примечания отдела закупок с проверкой на резрешенные к выводу поля
                        if (depot_tooltip.isAllowedField('annotationIn', field) && data.annotationIn) {
                            var options = {
                                htmlPatternName : 'iconAnnotationBrown',
                                annotation      : data.annotationIn,
                                headerName      : 'annotationIn'
                            };

                            var icon = depot_tooltip.init(options).getTooltip();

                            (list[field].value) ? list[field].value += icon : (data[field]) ? data[field] += icon : '&nbsp;' + icon;
                        }

                        cell.innerHTML = (list[field].value||data[field]||'&nbsp;');
                        // Отображение реального поставщика
                        showVendornameTitle(data, cell, field);
                        break;
                    case 'checkbox':
                        node = document.createElement('input');
                        node.type = 'checkbox';
                        node.name = list[field].name.replace(/\{number\}/, number);
                        node.value = "1";
                        node.setAttribute('fieldtype', list[field].fieldtype);

                        //Закупочная базовая цена
                        if(list[field].fieldtype === 'special_bp_in'){
                            if (data.id * 1 in BasePriceFormsIn.items
                                && $(BasePriceFormsIn.fieldNameFactory(data.id, 'special_bp')).prop('checked')
                            ) {
                                node.checked = true;
                            }

                            // если право Редактировать СБЦ не установлено на редактировать, отключение этой возможности
                            if (!(this.perm.products.special_bp_in == 4)) {
                                node.onclick = function(){
                                    return false;
                                };
                            }
                        }
                        node.setAttribute('class',list[field].classname);
                        node.setAttribute('fieldtype',list[field].originalname);
                        node.setAttribute('triggerevent','Y');
                        node.setAttribute('itemtype',data.type);
                        cell.appendChild(node);

                        // добавление на форму кнопки редактирования СПЗ/СБЦ для специальной базововй цены
                        if(list[field].fieldtype === 'special_bp_in'){
                            node.dataset.itemid = data.id;
                            node.dataset.pnumber = number;

                            var values = {
                                'reason_reject_request': '',
                                'price_on_request': '',
                                'price_on_request_state': '',
                                'special_bp_checker': '',
                                'special_bp_txt': '',
                                'special_bp_price': '',
                                'special_bp_files': '',
                                'notify_depot': ''
                            };

                            if (data.id * 1 in BasePriceFormsIn.items) {
                                for (var key in values) {
                                    values[key] = $(BasePriceFormsIn.fieldNameFactory(data.id, key)).val();
                                }
                            }

                            $(document.getElementsByName('products[' + number + '][special_bp_in]')[0]).closest('td').append(
                                '<span id="baseprice_in_img_' + number + '">\n\
                                <img src="/img/system/edit.png" style="cursor:pointer" onclick="javascript:BasePriceFormsIn.showBasePriceForm(' + data.id + ', false)"/>\n\
                                <input type="hidden" value="' + values['reason_reject_request'] + '" name="products[' + number + '][reason_reject_request_in]" type="text" >\n\
                                <input type="hidden" value="' + values['price_on_request'] + '" name="products[' + number + '][price_on_request_in]" type="text" >\n\
                                <input type="hidden" value="' + values['price_on_request_state'] + '" name="products[' + number + '][price_on_request_state_in]" type="text" >\n\
                                <input type="hidden" value="' + values['special_bp_checker'] + '" name="products[' + number + '][special_bp_checker_in]" type="text" >\n\
                                <input type="hidden" value="' + values['special_bp_txt'] + '" name="products[' + number + '][special_bp_txt_in]" type="text" >\n\
                                <input type="hidden" value="' + values['special_bp_price'] + '" name="products[' + number + '][special_bp_price_in]" type="text" >\n\
                                <input type="hidden" value="' + values['special_bp_files'] + '" name="products[' + number + '][special_bp_files_in]" type="text" >\n\
                                <input type="hidden" value="' + values['notify_depot'] + '"  name="products[' + number + '][notify_depot_in]" type="text" >\n\
                            </span>'
                            );


                            BasePriceFormsIn.addItem($(node));
                        }

                        break;
                    // инвентарные номера
                    case 'custom-img':
                        _self.angularProxy.createCompanyEquipmentList(cell, number);

                        break;
                }
                if(list[field].permType !== undefined) {
                    node.setAttribute(list[field].permType, list[field].permValue);
                }

                if(
                    cell
                    && typeof list[field].colAttrs === 'object'
                    && Object.keys(list[field].colAttrs).length
                ) {
                    for (var attrName in list[field].colAttrs) {
                        cell.setAttribute(attrName, list[field].colAttrs[attrName]);
                    }
                }

                if(
                    node
                    && typeof list[field].fieldAttrs === 'object'
                    && Object.keys(list[field].fieldAttrs).length
                ) {
                    for (var attrName in list[field].fieldAttrs) {
                        node.setAttribute(attrName, list[field].fieldAttrs[attrName]);
                    }
                }
            }

            if (data.sectionDdmInitialInfo) {
                // Данные по блокировкам секции под менеджеров
                $(row).find('td[data-col-name="ids"]').append(
                    $('<input type="hidden" data-rowdata-field-name="sectionDdmInitialInfo">')
                        .val(data.sectionDdmInitialInfo)
                );
            }

            if (data.sectionDdmInitialInfo) {
                // Кнопка для отображения формы редактирования блокировок секции под менеджеров
                $(row).find('td[data-col-name="ids"]').append(
                    $('<img data-action="show-ddm-form" src="/img/system/clientinfo.png" style="cursor: pointer" title="Блокировка секции под менеджеров"/>')
                );
            }

            if (this.overley !== undefined && this.overley.grid !== undefined) {
                this.overley.grid.lastSelectionData = this.getAddedProducts();
                if (this.overley.grid.node()) {
                    this.overley.grid._updateSelectedRow();
                }
            }

            this.earlyBooking.add();

            $(row).find("input[type=\"text\"]").each(function (_, td) {
                td.classList.add("js-tableNavigationCell");
            });
            $("#table_products").data('tableNavigator').addRow($(row));

            if (this.angularProxy) {
                this.angularProxy.compileProductRow($(cell).closest('tr'));
                this.angularProxy.insertItem(Object.assign({number: number}, data));
            }

            return row;
        };

        /**
         * Скопировать товар
         * @param data
         */
        this.copyProduct = function(data)
        {
            let row = $(data).closest('tr');
            let originalNumber = row.attr('number');
            row = row.clone();
            $("#table_products_tbody").append(row.get(0));

            $("#table_products").data('tableNavigator').addRow(row);

            //last row
            let lastRow = $(`.table_products_tbody tr[number=${this.pNumber}]`);

            if (lastRow.hasClass('odd') && row.hasClass('odd')
                || lastRow.hasClass('even') && row.hasClass('even')
            ) {
                row.toggleClass('odd even');
            }

            //number для новой строки
            let number = ++this.pNumber;
            row.attr('number', number);
            row.find('input[name^=products]').each((i, el) =>
            {
                el.name = el.name.replace(`[${originalNumber}]`, `[${number}]`);
            });

            //change hidden field number
            row.find(`input[name="products[${number}][number]"]`).val(number);

            let selectTd = row.find('select').closest('td');
            selectTd.html('');

            if (this.angularProxy) {
                this.angularProxy.cloneItem(originalNumber, number);
                this.angularProxy.createCompanyEquipmentList(selectTd.get(0), number);
            }
        }

        this.setPermission = function(element, permission)
        {
            switch (permission) {
                case 0:
                    delete(element);
                    break;
                case 1:
                    element.permType = "type";
                    element.permValue = "hidden";
                    break;
                case 2:
                    element.permType = "disabled";
                    element.permValue = "disabled";
                    break;
                case 3:
                    element.permType = "readonly";
                    element.permValue = "readonly";
                    break;
            }
        };

        /**
         * подсветка не верного распределения по секциям
         */
        this.backlightInputs = function(pnumber, word, error)
        {
            pnumber = pnumber.replace(/[^\d]/g, '');
            var key = new RegExp('^products\\[' + pnumber + '\\]\\[sections\\]\\[\\d+\\]\\[' + word + '\\]$');
            var elements = this.el(this.formId).elements;
            for(var i=0; i<elements.length; i++) {
                if (!key.test(elements[i].name)) {
                    continue;
                }
                elements[i].style.backgroundColor = error?this.errorColor:'';
            }
        };


        /**
         * устанавливает разрешение на смену статуса
         * @param bool flag
         */
        this.avalibleChangeStatus = function(flag, accept)
        {
            this.accept = accept;
            this.el(this.formId)['changeStatusAvaleble'].value = ( flag ? 1 : 0 );
            if ($(this.el(this.formId)['mechanicalWeightLoadedCarPoise']).length) {
                this.el(this.formId)['mechanicalWeightLoadedCarPoise'].value = ($(this.el(this.formId)['poise']).length)
                                                                            ? ((!$(this.el(this.formId)['poise']).is(':checked'))
                                                                              ? ''
                                                                              : this.el(this.formId)['mechanicalWeightLoadedCarPoise'].value
                                                                            )
                                                                            : this.el(this.formId)['mechanicalWeightLoadedCarPoise'].value;
            }

            if (this.el(this.formId).onsubmit()) {
                this.el(this.formId).submit();
            }
        };


        /**
         * Удалить товар
         * @param {HTMLElement} obj - объект строки удаляемого товара
         * @param {boolean} c - отображать подтверждение или нет
         * @return void
         */
        this.deleteProduct = function(obj, c)
        {
            var _self = this;
            var confText = 'Удалить?';
            var row = $(obj).closest('tr');
            var number = row.attr('number') + '';
            // действие после подтверждения удаления товара
            var onConfirm = function () {
                $("#table_products").data('tableNavigator').deleteRow($(row));

                var specialBasepriceIn = $(obj).closest('tr').find('.js-special-bp-in');
                if (specialBasepriceIn.length > 0) {
                    BasePriceFormsIn.removeItem(specialBasepriceIn);
                }

                var declineResult = 1;

                // ticket2841, доработка №7, пункт 2
                // Если данный товар резервирует позицию производства, необходимо удалить резерв
                var reservedCpmrpRowIdElement = $(obj).parents('tr:first').find('input[type="hidden"][data-field-name="reserved_cpmrp_row_id"]');
                if (reservedCpmrpRowIdElement.length) {
                    declineResult = getManufacturerClaimsComponent().reserver.declineRow(reservedCpmrpRowIdElement.val());
                }

                // ticket-3996 (this.earlyBooking.canDeleteProduct) Если по товару есть бронь, то в заявке на приход его нельзя удалить
                if (declineResult && _self.earlyBooking.canDeleteProduct($(obj))) {
                    $(obj).parent().parent().remove();
                    _self.updateTotal();
                }

                if (_self.totalPriceOrder) {
                    _self.totalPriceOrder.removeItemFromOrder(number);
                }

                if (_self.angularProxy) {
                    _self.angularProxy.deleteItem(number);
                }
            };

            if (this.angularProxy) {
                $('#app').addClass('element-preload');

                this.angularProxy.whenReady(function () {
                    _self.angularProxy.companyEquipmentExists(number).then(
                        function (result) {
                            var conf = c||confirm(result ? 'Вместе с товаром будут удалены записи на проекте УИН, Вы уверены, что хотите продолжить?' : confText);
                            if (!conf) {
                                return ;
                            }

                            if (result) {
                                _self.angularProxy.deleteCompanyEquipmentByNumber(number)
                                    .then(
                                        function () {
                                            onConfirm();
                                        },
                                        function (reason) {
                                            alert('Нельзя удалить товар из-за записей на УИН. ' + reason);
                                        }
                                    );
                            } else {
                                onConfirm();
                            }
                        },
                        function (reason) {
                            console.error(reason);
                            return reason;
                        }
                    ).finally(function() {
                        $('#app').removeClass('element-preload');
                    })
                })
            } else {
                var conf = c||confirm(confText);
                if (conf) {
                    onConfirm();
                }
            }
        };



        /**
         * Изменение селекта
         * представительские расходы
         */
        this.changeKickback = function(object)
        {
            var value = parseInt(object.value);

            if (parseInt(object.value)) {
                if (this.node('kickback')) {
                    this.node('kickback').style.display = '';
                }
                if (this.node(this.formId)['claim[kickback]']) {
                    this.node(this.formId)['claim[kickback]'].disabled = false;
                }
            }
            else {
                if (this.node('kickback')) {
                    this.node('kickback').style.display = 'none';
                }
                if (this.node(this.formId)['claim[kickback]']) {
                    this.node(this.formId)['claim[kickback]'].disabled = true;
                }
            }
        };


        /**
         * проверка дат
         * @param nodeObject obj
         * @return void
         */
        this.checkDate = function(value)
        {
            value = value.replace(/(\,|\/)/g, '.');
            if (!/^([0-2]\d|3[0-1])\.[0-1]\d\.20\d\d$/.test(value)) {
                return false;
            }
            // var tmp = value.split('.');
            // this.date = parseInt((new Date(tmp[2], tmp[1], tmp[0])).getTime()/1000);
            return true;
        };


        /**
         *управление добавленными товарами
         */
        this.showClaimGoodsFilter = function(obj)
        {
            //var cnt = this.el('filter-claim-goods-cnt');
            /*
             cnt.style.display = cnt.style.display == 'block' ? 'none' : 'block';
            this.el('filter-claim-goods').style.height = (cnt.style.display == 'block' ? 'auto' : '0px');
            */
            if (obj.lang == 0) {
                this.el('filter-claim-goods-cnt').style.overflow = 'hidden';
                $('#filter-claim-goods-cnt').animate({height:'0px', opacity:0}, 200);
                obj.lang = 1;
                obj.src = '/img/system/fieldsShowF.png';
            }
            else {
                this.el('filter-claim-goods-cnt').style.overflow = 'visible';
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
                urlGetFullData: '/claim/in/getproductfilterconfig',
                // получение маски для для полей
                urlGetMaskData: '/claim/in/getproductmaskfilter',
                // filter type simple|excel default=simple
                filterType: 'excel',
                //create in node||id
                conteinerId: 'filter-claim-goods',
                // урл индикатора загрузки
                imgLoader: '/img/ld/ld3.gif'
            });
            this.filter.onBeforeCreate = function() {
                this.addPostData = claimin.getAllProductsIds();
                this.addPostData.products = serialize(this.addPostData.products);
            };
            this.filter.onAfterCreate = function() {
                claimin.applyProductFilter(this.getValue());
            };
            this.filter.onBeforeRebuild = function(){
                this.addPostData = claimin.getAllProductsIds();
                this.addPostData.products = serialize(this.addPostData.products);
            };
            this.filter.onAfterRebuild = function(){
                claimin.applyProductFilter(this.getValue());
            };
            this.filter.onChange = function() {
                claimin.applyProductFilter(this.getValue());
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
                url      : linkPrefix + '/claim/in/getproductfilterdata',
                cache    : false,
                type     : 'POST',
                dataType : 'json',
                data     : data,
                success  : function(data){
                    income.showHideProducts(data.result);
                }
            });
        };


        /**
         *
         */
        this.showHideProducts = function(data)
        {
            if (!this.el("table_products")) return;
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
            var rows = this.el("table_products").rows;
            for(var i=1; i< rows.length-1; i++) {
                var number = rows[i].getAttribute('pnumber');
                rows[i].style.display = tmp[number];
            }
        };

        /**
         * Вызов каскада
         * @return void
         */
        this.sendToCascade = function(params)
        {
            if (typeof params !== 'undefined' && params.hasOwnProperty('deleteOnCascade') && parseInt(params.deleteOnCascade) === 1) {
                let deleteOnCascadeField = $('[name="deleteOnCascade"]').val(params.deleteOnCascade);

                if (!parseInt(deleteOnCascadeField.val())) {
                    alert('Не удалось установить флаг удаления!');
                }
            }

            this.el(this.formId).action = linkPrefix + '/claim/in/cascade/';
            console.log(linkPrefix + '/claim/in/cascade') // frolov debug


            if (this.el(this.formId).onsubmit()) {
                this.el(this.formId).submit();
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

        /**
        * отображение инфы о заблокировавшем юзвере
        */
        this.showBlockClaimError = function()
        {
            if (!this.errorInfoBlock) return;
            $('#block_info_html').remove();
            var html = '<div id="block_info_html" style="text-align:center; font-weight:bold; position:fixed; top:100px; right:20px; padding:15px; border:1px solid gray; background:rgba(100, 100, 100, 0.5); color:red; border-radius:15px;">'
            + this.errorInfoBlock.msg
            + '</div>';
            $(document.body).append(html);
        };

        /**
        * отображение инфы об ошибке сервиса
        */
        this.showBlockServiceError = function()
        {
            if (!this.serviceErrorBlock) return;
            $('#block_info_html').remove();
            var html = '<div id="block_info_html" style="text-align:center; font-weight:bold; position:fixed; top:100px; right:20px; padding:15px; border:1px solid gray; background:rgba(100, 100, 100, 0.5); color:red; border-radius:15px;">'
            + this.serviceErrorBlock.msg
            + '</div>';
            $(document.body).append(html);
        };

        /**
         * Наложение метричекого конвертера
         */
        this.applyMetricConverter = function(cell, input)
        {
            // Добавить стиль для подсказки
            input.addClass('metricTooltipField');

            // Добавить иконку конвертера
            cell.css({position: 'relative'})
                .append('<img class="claimMetricConverter" title="Метрический конвертор" src="/img/system/ruler_16.png" data-square-millimeter-field="' + input.prop('name') + '" data-millimeter-field="' + input.prop('name') + '">');
        }


        /**
         * Метод возвращает текущие данные по заявке
         *
         * @returns {Claim.claimData}
         */
        this.getClaimData = function () { return this.claimData; };

        /**
         * Получить текущее значение склада
         * @returns {any}
         */
        this.getDepotIndex = function ()
        {
            let depotInput = $('[name="claim[depotIndex]"]');
            return depotInput.length ? depotInput.val() : this.claimData.depot;
        }

        /**
         * Метод возвращает jQuery-объект списка выбора клиента
         *
         * @returns {jQuery}
         */
        this.getClientIdInput = function() {
            return $('#' + this.formId).find('select[name="claim[clientId]"]');
        };


        /**
         * Метод возвращает идентификатор клиента
         *
         * @returns {Integer}
         */
        this.getClientId = function() {
            if (this.getClientIdInput().length) {
                return parseInt(this.getClientIdInput().val());
            }

            return parseInt(this.getClaimData().client);
        };

        /**
         * Инициализация функционала редактирования блокировок секций под менеджеров
         */
        this.initDdmEdit = function () {
            var self = this;

            this.depotDetailedManagerTransferForms = [];

            // Отображение всплывающей формы редактирования блокировок секции под менеджеров
            $(this.el(this.formId)).on('click', 'img[data-action="show-ddm-form"]', function (e) {
                self.createDepotDetailedManagerTransferForm($(e.target).parents('tr:first')).show();
            });
        };

        /**
         * Метод возвращает объект формы блокировки секции под менеджеров
         *
         * @param sectionTr $-объект строки, использоваемой для редактирования секции
         *
         * @returns {Claim_In_Product_DepotDetailedManager_Transfer_Form|null}
         */
        this.getDepotDetailedManagerTransferForm = function (sectionTr) {
            var productNumber = sectionTr.attr('number');

            if (!(parseInt(productNumber) > 0)) {
                try {
                    _tools.throwError(new Error('Неверно указан номер товара'), _tools.defaultAlertErrorMessage);
                } catch (e) { _tools.processError(e); }
            }

            var form = null;

            for (var i in this.depotDetailedManagerTransferForms) {
                if (parseInt(this.depotDetailedManagerTransferForms[i].productNumber) === parseInt(productNumber)) {
                    form = this.depotDetailedManagerTransferForms[i];
                    break;
                }
            }

            return form;
        };

        /**
         * Метод создает (в случае необходимости) и возвращает объект формы блокировки секции под менеджеров
         *
         * @param sectionTr $-объект строки, использоваемой для редактирования секции
         *
         * @returns {Claim_In_Product_DepotDetailedManager_Transfer_Form}
         */
        this.createDepotDetailedManagerTransferForm = function (sectionTr) {
            /** @type {Claim_In_Product_DepotDetailedManager_Transfer_Form} */
            var form;

            if (form = this.getDepotDetailedManagerTransferForm(sectionTr)) {
                form.actualizeState();
            } else {
                form = new Claim_In_Product_DepotDetailedManager_Transfer_Form({
                    productNumber: sectionTr.attr('number')
                });

                this.depotDetailedManagerTransferForms.push(form);
            }

            return form;
        };

        /**
         * Метод, запускаемый перед сохранением формы.
         * Может использоваться для дополнительных преобразований над данными перед сохранением.
         */
        this.beforeSave = function() {
            var self = this;

            // Перед отправкой формы добавим на неё данные в виде input[type="hidden"] с форм блокировки секций под менеджеров

            // Удаляем с формы все input[type="hidden"], содержащие данные по формам блокировки секций под менеджеров
            $(this.el(this.formId)).find('input[type="hidden"][data-rowdata-field-name="ddmTransferFormData"]').remove();

            // И добавляем заново, для каждого товара на форме
            $(this.el(this.formId)).find('#table_products_tbody > tr').each(function(i, sectionTr) {
                /** @type {Claim_In_Product_DepotDetailedManager_Transfer_Form} */
                var depotDetailedManagerTransferForm = self.getDepotDetailedManagerTransferForm($(sectionTr));
                if (depotDetailedManagerTransferForm) {
                    if (depotDetailedManagerTransferForm.isFormChanged()) {
                        // Добавляем данные с формы только в том случае, если были изменения
                        depotDetailedManagerTransferForm.getBindedSectionTr().append(
                            $('<input type="hidden" data-rowdata-field-name="ddmTransferFormData" name="products[' + depotDetailedManagerTransferForm.productNumber + '][ddmTransferFormData]">')
                                .val(JSON.stringify(depotDetailedManagerTransferForm.getSendData()))
                        );
                    }
                }
            });

            if (this.totalPriceOrder) {
                this.totalPriceOrder.save();
            }

            if (this.angularProxy) {
                this.angularProxy.saveCompanyEquipment();
            }
        };

        /**
         * проверка наличия корп телефона у менеджера
         * @return {boolean}
         */
        this.validateManagerCorpPhone = function ()
        {
            if (!this.checkManagerCorpPhoneRequired) {
                return true;
            }

            const managerId = $('[name="claim[managerId]"]').val();
            const canEditManager = (this.perm.manager == "4") * 1;
            const claimId = this.claimData.claimId;

            let result = false;
            $.ajax({
                url: "/claim/ajax/manager-have-corp-phone",
                data: {managerId, canEditManager, claimId},
                method: 'GET',
                async: false,
                dataType: 'json'
            }).done(
                (data) => {
                    if (data.success) {
                        result = data.result;
                    } else {
                        alert(data.error);
                    }
                }
            );

            return result;
        };
    }
)();

window.onbeforeunload = function() {
    window.unloadData = {};
    window.unloadData.cid = claimin.element('claim[id]').value;

    var restore = parseInt(window.location.pathname.replace(/[^\d]/g, ''));

    claim.onunload = ((isNaN(restore) || !restore) ? 1 : 0);

    if (!claim.saveForm && claim.onunload) {
        alert('Данная заявка не сохранена\r\nи находится на этапе создания,\r\nесли Вы продолжите,\r\nто все данные будут утеряны!');
        return '?';
    }

    return void(0);
};

window.addEventListener('unload', function() {
    if (!claimin.saveForm && window.unloadData.cid && !claimin.onlyView) {
        $.ajax({
            url      : '/claim/in/unblockclaim',
            cache    : false,
            data     : {claimId : window.unloadData.cid},
            type     : 'POST',
            dataType : 'html',
            async    : false,
            success  : function(data){}
        });
    }

    // ticket2841, доработка №7, пункт 2, удаление резервов при уходе со страницы
    if (!claimin.saveForm) {
        try {
            getManufacturerClaimsComponent().reserver.declineAll();
        } catch (e) {}
    }
});
