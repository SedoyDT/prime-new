var claim = new (function()
{
    this.formId           = 'out-form';
    this.precision        = 0.00001;
    this.startNumber      = 0;
    this.timeOut          = null;
    this.сarNumberList    = [];
    this.isEditProductFormDataLoading = false;

    /**
     * хранит результат условия, является ли заявка на статусе менеджера
     * 1 - заявка на статусе "на подтв. менеджера"
     * 0 - любой другой статус
     * @var Int
     */
    this.managerStatus    = 0;

    /**
     * хранит текущий статус завяки
     * 1 - создание
     * 2 - диспетчер
     * 0 - любой другой
     * @var Boolean
     */
    this.carStatusFlag    = true;

    /**
     * Изначальные товары
     * id товаров заявки перед изменениями
     * @var array
     */
    this.originalProductsId     = [];

    /**
     * @var String
     */
    this.claimTypeName = 'out';

    /**
     * Бц за штуку
     */
    this.itemBaseprice;

    /**
     * 1 - связанная заявка, 0 - обычная заявка
     * @type Number
     */
    this.isLinkedClaim = 0;

    /**
     * 1 - главный проект, 0 - не главный проект
     * @type Number
     */
    this.isMainProject = 0;

    /**
     * 1 - филиал, 0 - не филиал
     * @type Number
     */
    this.isSubsidiaryProject = 0;

    /**
     * Проверка соответствия склада заявки и отдела пользователя
     * @type Number
     */
    this.orgDepotCheck = 0;

    /**
     * Режим работы формы блокировки
     * @type Object
     * @property {Object} types - типы режимов
     * @property {String} mode - текущий режим
     * @property {Function} setLocal - установить режим - локальный
     * @property {Function} setRemote - установить режим - локальный
     * @property {Function} isLocal - проверить режим - локальный
     * @property {Function} isRemote - проверить режим - локальный
     */
    this.blockFormMode = {
        types: {UNDEFINED: -1, LOCAL: 0, REMOTE: 1},
        mode: -1,
        setLocal: function () {
            this.mode = this.types.LOCAL;
        },
        setRemote: function () {
            this.mode = this.types.REMOTE;
        },
        isLocal: function () {
            return this.mode === this.types.LOCAL;
        },
        isRemote: function () {
            return this.mode === this.types.REMOTE;
        },
        reset: function () {
            this.mode = this.types.UNDEFINED;
        }
    };


    /**
     * @returns {number}
     */
    this.getSubsidiaryClaimDepotId = function()
    {
        if (!claim.blockFormMode.isRemote() || !claim.isSubsidiaryProject) {
            return 0;
        }

        // Если добавляем товар с главного склада, то есть селект "Склад назначения"
        // В форме для локальных товаров, селекта нет, берем значение из базы
        var depotId = this.depotIndex.getDepotId() || 0;

        if (depotId > '') {
            return parseInt(depotId);
        }

        $.ajax({
            url: '/claim/ajax/get-claim-depot-id',
            type: 'POST',
            data: {
                claimId: claim.id
            },
            dataType: 'json',
            async: false,
            success: function (response)
            {
                if (response.hasOwnProperty('depotId')) {
                    depotId = parseInt(response.depotId);
                }
            }
        });

        if (isNaN(depotId) || depotId < 2) {
            alert('Ошибка при получении склада. Обратитесь к администратору!')
            throw new Error('Ошибка при получении склада.');
        }

        return depotId;
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
     * Returns claimTypeName
     * @return {String}
     */
    this.getClaimTypeName = function ()
    {
        return this.claimTypeName;
    };

    /**
     * Получить id заявки
     * @returns {string|Number}
     */
    this.getClaimId = function ()
    {
        return this.getClaimOutId();
    };

    /**
     * Получить id клиента по заявке
     * @returns {number}
     */
    this.getClientId = function ()
    {
        return this.client.value();
    };

    /**
     * Получить кпп
     * @returns {number}
     */
    this.getClientKpp = function ()
    {
        return parseInt($('input[name="claim[kpp]"]').val());
    };

    /**
     * Получить строки с данными товаров
     * @returns {jQuery}
     */
    this.getProductRows = function ()
    {
        return $('#table_products_tbody tr[rowtype="productstart"]');
    };

    /**
     * Получить данные по товарам заявки
     * используется в typescript/app/application/claim/out/controller/app.controller.ts
     * @returns {Array}
     */
    this.getProductsData = function ()
    {
        let rows   = this.getProductRows();
        let result = [];

        rows.each(function (k, e)
        {
            let je = $(e);
            result.push({
                number    : je.attr('pnumber'),
                product_id: je.attr('product'),
                price     : je.find('input[name$="[price]"]').val(),
                boxes     : je.find('input[name$="[boxes]"]').val(),
                amount    : je.find('input[name$="[amount]"]').val(),
                type      : je.find('input[name$="[type]"]').val(),
            });
        });

        return result;
    };


    /**
     * инициализация заявки
     */
    this.start = function()
    {
        var $claimDate = $('#claim_date');
        $claimDate.datepicker({duration: 'fast', showAnim: 'fadeIn'});
        $claimDate.data('oldVal',  $claimDate.val() );
        $('.guarantee')
            .datepicker({duration: 'fast', showAnim: 'fadeIn'})
            // проверка формата даты гарантии
            .on('blur', function () {
                if (!/^\d{2}\.\d{2}\.\d{4}$/.test($(this).val())) {
                    $(this).val(null).trigger("change");
                }
            });

        if (this.node('check_show_product')) {
            $('#products').css({ width: document.body.clientWidth - 40 + 'px' });
            this.updateTotals(1);
        }

        this.node(this.formId).onsubmit = function() {
            return claim.checkForm(this);
        };
        this.showBlockClaimInfo();
        this.showBlockClaimError();

        // Установка изначального набора id товаров
        if (this.claimStatus == 0){
            this.setOriginalProductsId();
        }

        if (this.node('check_show_product')) {
            this.startNumber = this.getProductNumber(-1)+1;
        }

        // если проект дочерний, то появляется возможность выбора склада с которого будет взят товар
        if (claim.isSubsidiaryProject) {
            $('#products').find('.js-dropdown').each(function () {
                var items = $(this).data('items');
                claim.initEditProductDropdownlist($(this), items);
            });

            // выбор склада для удаления
            $('#products').find('.js-dropdown-delete').each(function () {
                var items = $(this).data('items');
                claim.initDeleteProductDropdownlist($(this), items);
            });
        }

        /**
         * Клик по иконке "Редактировать товар"
         */
        $('.editProduct').live('click', function()
        {
            // Тип товара
            var productType = parseInt($(this).closest('tr').find('input.productType').val());

            if (isNaN(productType) || productType < 1) {
                return alert('Не удалось определить тип товара. Обратитесь к администратору!');
            }

            // Товар из сырья
            if (productType == 3) {
                raw.getProductAllocation(this.lang);
            }
            // Все остальные товары
            else {
                // форма блокировки из главного проекта или локального проекта
                // если товар из другого проекта
                if (parseInt($(this).data('project_depot_id')) > 0 || claim.isLinkedClaim && claim.isMainProject) {
                    claim.blockFormMode.setRemote();

                    if (claim.isLinkedClaim && claim.isMainProject) {
                        var depotId = $(this).closest('tr').find('input[type="hidden"].product-depot-id').val()
                    } else {
                        var depotId = claim.linkedClaimDepotData.requestLinkedClaimDepotData({ subsidiaryClaimId: claim.id }).getClaimDepotId();
                    }
                } else {
                    claim.blockFormMode.setLocal();
                    var depotId = $(this).closest('tr').find('input[type="hidden"].product-depot-id').val();
                }

                claim.displayEditProductStart(
                    {
                        productId: this.lang,
                        depotId: depotId
                    },
                    true
                );
            }

            return this;
        });

        // Поля время взвешивание машины1
        var timeWeighingCarHelper = new TimeWeighingCar();

        // Поля механический вес машин
        var mechanicalWeightFieldsHelper = new MechanicalWeightFields();

        // сверка актов
        this.checkActReviseControl = new Claims_CheckActReviseControl(this);

        // Обработка поля гарантия
        this.guaranteeLighter = new GuaranteeField();
        this.guaranteeLighter.processFields();

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

        if (window.Dispatcher) {
            new Dispatcher({
                preset: 'claim',
                dataContainer: this.dataContainer,
                eventBus: this.eventBus,
                updateCarListActionUrl: '/claim/out/get-dispatcher-drivers/',
            });
        }

        if (window.ApproximateClaimWeight) {
            new ApproximateClaimWeight({
                preset: 'claim',
            });
        }

        if (window.Dimensions) {
            this.dimensions = new Dimensions({
                preset: 'claim',
            });
        }

        if (window.CarProxy) {
            this.carProxy = new CarProxy({
                preset: 'claim'
            });
        }

        if (window.SendUpdToClient) {
            window.SendUpdToClient.init(this.node(this.formId), this.getClaimId());
        }

        // инициализация типа блокировки
        if (this.isLinkedClaim) {
            this.blockFormMode.setRemote();
        }

        if (window.LeadId) {
            this.leadId = new LeadId({
                changeBtn: $('.js-lead-change-btn'),
                dropBtn: $('.js-lead-drop-btn'),
                field: $('[name="claim[leadId]"]'),
                projectField: $('[name="claim[leadProjectId]"]'),
                text: $('.js-lead-text'),
                url: $('.js-lead-url'),
                projectSelect: $('.js-lead-project-select'),
            });
        }

        if (window.Claim_Out_AngularProxy) {
            this.angularProxy = new Claim_Out_AngularProxy({
                claim: this,
                angularElement: $('#app'),
            });
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
    * преобразование строки во float  с точностью 5 знаков после запятой
    * @param string str
    * @return float
    */
    this.toFloat = function(str)
    {
        // str = String(str).replace(/\,/, '.');
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
    * @param {node|string} obj
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
                    tpl = (getType(data) == 'array') ? "'{val}'" : "'i':'{val}'";
                    tmp.push( tpl.replace(/i/, i).replace(/\{val\}/, String(data[i]).replace(/\r|\n/g, '').replace(/'/g, '\'')));
                    break;
                case 'number':
                    tpl = (getType(data) == 'array') ? "{val}" : "'i':{val}";
                    tmp.push( tpl.replace(/i/, i).replace(/\{val\}/, String(data[i])));
                    break;
                case 'boolean':
                    tpl = (getType(data) == 'array') ? "{val}" : "'i':{val}";
                    tmp.push( tpl.replace(/i/, i).replace(/\{val\}/, String(data[i])));
                    break;
                default:
                    if (data[i] === null) {
                        tpl = (getType(data) == 'array') ? "null" : "'i':null";
                        tmp.push( tpl.replace(/i/, i));
                    }
                    else if (data[i]){
                        tpl = (getType(data) == 'array') ? "{val}" : "'i':{val}";
                        tmp.push( tpl.replace(/i/, i).replace(/\{val\}/, this.compresData(data[i])));
                    }
                    break;
            }
        }
        if (getType(data) == 'array') {
            return '[' + tmp.join(',') + ']';
        }else {
            return '{' + tmp.join(',') + '}';
        }
    };

    /**
     * получить елемент формы
     */
    this.element = function(name)
    {
        return this.node(this.formId)[name];
    };

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

            for(var i = 1; i < this.managerList.length; i++) {
                if (this.managerList[i].text.toLowerCase().indexOf(val) == -1) {
                    continue;
                }

                options[options.length]   = new Option(this.managerList[i].text, this.managerList[i].id);
            }
            if (typeof this.parent.node(obj.lang).lastValue != 'undefined') {
                this.parent.node(obj.lang).value = this.parent.node(obj.lang).lastValue;
            }

            this.change(this.parent.node(obj.lang), 1);
        },
        change:function(obj, not) {
            if (!not) {
                obj.lastValue = obj.value;
            }
        },
        value:function() {
            return parseInt(this.parent.element('claim[managerId]').value);
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
            var options = self.el('claimCarNumber').options;
            options.length = 0;
            var search = obj.value.toLowerCase().replace(/^\s+|\s+$/, '');

            for (let key in self.dataContainer.get('carList')) {
                if (search.length && self.dataContainer.get('carList')[key].carNumber.toLowerCase().indexOf(search) == -1) {
                    continue;
                }
                options[options.length] = new Option(self.dataContainer.get('carList')[key].carNumber, self.dataContainer.get('carList')[key].id);
            }
            options.length ? self.car.changeNumber('claimCarNumber', options[0].value) : self.car.changeNumber('claimCarNumber');
        }, 500);
    };

    /**
     * фильтр для клиентов
     */
    this.client = {
        parent : this,
        clientList : [],
        filter : function(obj) {
            var options = this.parent.node(obj.lang).options;
            if (!this.clientList.length) {
                for(var i = 0; i < options.length; i++) {
                    this.clientList.push({
                        id     : options[i].value,
                        text   : options[i].text,
                        wtime  : options[i].getAttribute('lang'),
                        dataset: options[i].dataset,
                    });
                }
            }
            options.length = 1;

            var val = obj.value.toLowerCase();

            for(var i = 1; i < this.clientList.length; i++) {
                if (this.clientList[i].text.toLowerCase().indexOf(val) == -1) {
                    continue;
                }

                options[options.length]   = new Option(this.clientList[i].text, this.clientList[i].id);
                options[options.length-1].setAttribute('lang', this.clientList[i].wtime);
                Object.assign(options[options.length-1].dataset, this.clientList[i].dataset);
            }
            if (typeof this.parent.node(obj.lang).lastValue != 'undefined') {
                this.parent.node(obj.lang).value = this.parent.node(obj.lang).lastValue;
            }

            this.change(this.parent.node(obj.lang), 1);
        },
        change:function(obj, not) {
            if (!not) {
                obj.lastValue = obj.value;
            }
            claim.node('claim-client-work-time').innerHTML = '<span style="font-size: 10pt; font-weight: bold;">Время работы : </span>'
                    + (obj.selectedIndex === -1 ? 'не определено' : obj.options[obj.selectedIndex].getAttribute('lang'));
        },
        value:function() {
            return parseInt(this.parent.element('claim[clientId]').value);
        }
    };


    this.claimDate = {
        change:function(obj) {
            $("#table_products_tbody tr[rowtype='productstart']").each(function() {
                var $this = $(this);
                var $guarantee_int = $this.find("input[name='products[" + $this.attr("pnumber") + "][guarantee_int]']");
                var $guarantee = $this.find("input[name='products[" + $this.attr("pnumber") + "][guarantee]']");
                var guaranteeDate = '';
                if ($(obj).val() && $guarantee_int.val() > 0) {
                    //если уже установлена дата гарантии - проверим не менялась ли она от стандарта
                    if ($guarantee.val() !== "") {
                        var guaranteeDateOld = claim.makeGuaranteeDate($(obj).data('oldVal'), $guarantee_int.val());
                        if ($guarantee.val() === guaranteeDateOld) {
                            guaranteeDate = claim.makeGuaranteeDate($(obj).val(), $guarantee_int.val());
                        } else {
                            guaranteeDate = $guarantee.val();
                        }
                    } else {
                        guaranteeDate = claim.makeGuaranteeDate($(obj).val(), $guarantee_int.val());
                    }
                }
                $this.find("input[name='products[" + $this.attr("pnumber") + "][guarantee]']").val(guaranteeDate);
            });
            $(obj).data('oldVal', $(obj).val());

            // Обновляем подсветку поля гарантия после изменения даты исполнения заявки
            this.guaranteeLighter.processFields();
        }.bind(this)
    };


    /**
     * @param {string} date format d.m.Y
     * @param {int} days
     * @return string
     */
    this.makeGuaranteeDate = function(date, days)
    {
        date = new Date(date.replace(/(\d+)\.(\d+)\.(\d+)/, '$3/$2/$1'));
        date.setDate(date.getDate() + parseInt(days));
        return moment(date).format("DD.MM.YYYY");
    };

    /**
     * Счета
     */
    this.invoices = {
        invoicesElId : 'claim-client-invoices',
        listInvoices : [],
        usedInvoices : {},
        totalSum : 0,
        withoutDocs : false,
        creditLimit : 0,
        currentSum : 0,
        block : true,
        deferment : null,
        default_option : 'null',
        maxCountSelects : 0,
        currentCountSelects : 0,
        show : function() {
            $(claim.el(this.invoicesElId)).show();
        },
        hide : function() {
            $(claim.el(this.invoicesElId)).hide();
        },
        getInvoices : function() {
            var data = {};

            data['client'] = isNaN(parseInt($('#client_select').val())) ? $('input[name="claim[clientId]"]').val() : $('#client_select').val();
            data['claim'] = $('#claim_id').val();

            if (data.client == 0) {
                this.hide();
                return false;
            }

            $.ajax({
                url      : '/claim/out/get-invoices',
                cache    : false,
                type     : 'POST',
                data     : data,
                dataType : 'json',
                async    : false,
                success : function(data) {
                    claim.invoices.creditLimit = parseFloat(data.credit_limit);
                    claim.invoices.deferment = data.deferment;
                    claim.invoices.listInvoices = data.invoices;
                    claim.invoices.totalSum = parseFloat(data.client_balance[0].balance);
                    claim.invoices.withoutDocs = data.without_docs;

                    select_1 = $('#claim-client-invoices_1');

                    if (claim.invoices.listInvoices.length > 0) {

                        claim.invoices.maxCountSelects = claim.invoices.listInvoices.length;

                        for (var i = 0; i < claim.invoices.listInvoices.length; i++) {
                            var invoice = claim.invoices.listInvoices[i];
                            message = '№' + invoice.id + ' ';

                            if (invoice.revision === null) {
                                message += '(Оригинал)';
                            } else {
                                message += '(Версия №' + invoice.revision + ')';
                            }
                            select_1.append($('<option/>').attr({'value' : invoice.prim_id}).text(message));
                        }
                    }

                    select_1.append($('<option/>').attr({'value' : 'without_docs'}).text('Без документов'));

                    if (claim.invoices.default_option == 'without_docs') {
                        $('#claim-client-invoices_1').children('option[value="without_docs"]').prop('selected', true);
                    }
                }
            });
        },
        reset : function(default_option, onload) {
            var selects = $('#' + this.invoicesElId).children('select');

            for (var i = selects.length; i > 0; i--) {
                if (i != 1) {
                    $('#claim-client-invoices_' + i).remove();
                }
                $('#invoices_clear_' + i).remove();
            }

            $('#claim-client-invoices-link-add').hide();

            $('#' + this.invoicesElId + '_1').empty().append($('<option/>').attr({'value' : 'null'}).text('----'));
            $('#' + this.invoicesElId).children('span.claim_invoice_result').removeClass('red').removeClass('green').empty().hide();

            this.default_option = default_option;
            this.usedInvoices = {};
            this.totalSum = 0;
            this.currentSum = {};
            this.maxCountSelects = 1;
            this.listInvoices = [];
            this.currentCountSelects = 1;

            this.getInvoices();
            this.show();
            this.blockSendInput();

            if (onload) {
                this.load();
            }
        },
        change : function(obj) {
            select_id = obj.attr('id');
            select_val = obj.val();

            if (select_id == 'claim-client-invoices_1' && (select_val == 'without_docs' || select_val == 'null')) {
                this.default_option = select_val;
                this.block = select_val == 'null' ? true : false;
                this.reset(select_val);
                return;
            }

            if (this.maxCountSelects > 1 && this.currentCountSelects < this.maxCountSelects) {
                $('#claim-client-invoices-link-add').show();
            }

            old_val = this.usedInvoices[select_id];

            this.usedInvoices[select_id] = select_val;

            for (var i = 0; i < this.listInvoices.length; i++) {
                if (this.listInvoices[i].prim_id == select_val) {
                    this.currentSum[select_id] = this.listInvoices[i].summ;
                }
            }

            selects = $('#' + this.invoicesElId).children('select');

            for (var i = 0; i < selects.length; i++) {

                if ($(obj).val() != 'null') {
                    $(selects[i]).children('option[value=' + select_val + ']').hide();
                } else {
                    this.currentSum[select_id] = 0;
                }

                if (typeof old_val != 'undefined') {
                    $(selects[i]).children('option[value=' + old_val + ']').show();
                }
            }

            this.validate();
        },
        validate : function () {
            var summa = 0, span_message = $('#' + this.invoicesElId).children('span.claim_invoice_result');

            if (this.currentCountSelects > 0) {
                for (var i = 1; i <= this.currentCountSelects; i++) {
                    var curSum = parseFloat(this.currentSum['claim-client-invoices_' + i]);

                    if (isNaN(curSum)) {
                        curSum = 0;
                    }

                    summa = parseFloat(summa) + curSum;
                }

                if (this.deferment === false || ((this.totalSum - summa) < 0 && (this.creditLimit - summa) < 0)) {
                    span_message.removeClass('green').addClass('red').text('Недопустимый кредитный лимит');
                    this.block = true;
                } else {
                    span_message.removeClass('red').addClass('green').text('Проверка успешна');
                    this.block = false;
                }

            } else {
                span_message.removeClass('green').addClass('red').text('Недопустимый кредитный лимит');
                this.block = true;
            }

            this.blockSendInput();
            span_message.show();
        },
        addSelect : function () {
            if (this.currentCountSelects < this.maxCountSelects) {
                var index_last = this.currentCountSelects;
                var select_last = $('#claim-client-invoices_' + index_last);

                this.currentCountSelects++;

                var select = $('<select/>').attr({
                    'id' : 'claim-client-invoices_' + this.currentCountSelects,
                    'onchange' : "claim.invoices.change($(this));",
                    'name' : 'invoices[]'
                }).append($('<option>', {'value' : 'null'}).text('----'));

                for (var i = 0; i < this.listInvoices.length; i++) {
                    var message = '№' + this.listInvoices[i].id + ' ';

                    if (this.listInvoices[i].revision === null) {
                        message += '(Оригинал)';
                    } else {
                        message += '(Версия №' + this.listInvoices[i].revision + ')';
                    }

                    $(select).append($('<option/>').attr({'value': this.listInvoices[i].prim_id}).text(message));
                }

                select.addClass('clientselect').insertAfter(select_last);

                for (var i = 1; i <= this.currentCountSelects; i++) {
                    if (typeof this.usedInvoices['claim-client-invoices_' + i] != 'undefined') {
                        $('#claim-client-invoices_' + this.currentCountSelects + ' option[value=' + this.usedInvoices["claim-client-invoices_" + i] + ']').hide();
                    }
                }

                $('<div/>').attr({'id' : 'invoices_clear_' + index_last}).addClass('clr').insertAfter(select_last);

                if (this.currentCountSelects == this.maxCountSelects) {
                    $('#claim-client-invoices-link-add').hide();
                }
            }
        },
        isBlock : function () {
            return (this.block) ? true : false;
        },
        blockSendInput : function () {
            claim.blockButton('sendButton');
            //$('#out-form input[value="отправить"]').prop('disabled', this.isBlock());
        },
        load : function () {
            if($('#invoicesForceHidden').size() == 1) {
                claim.perm.invoices = 3;
            }

            switch (parseInt(claim.perm.invoices)) {
                case 0: break;
                case 1:
                case 2:
                case 3:
                    var permInvoices = parseInt(claim.perm.invoices)

                    if (this.withoutDocs) {
                        if (permInvoices != 1) {
                            $('#claim_invoices_text_1').text('Без документов').addClass('red').removeClass('green');
                            this.show();
                        }
                        if (permInvoices != 2) {
                            $('#claim_invoices_input_1').val(0);
                        }
                    } else {
                        var currentSelect = 1;

                        for (var i = 0; i < this.listInvoices.length; i++) {
                            var invoice = this.listInvoices[i];

                            if (invoice.selected) {
                                if (currentSelect > 1) {
                                    if (permInvoices != 2) {
                                        var currentInput = $('<input/>').attr({
                                            'id': 'claim_invoices_input_' + currentSelect,
                                            'type': 'hidden',
                                            'value': invoice.prim_id,
                                            'name': 'invoices[]'
                                        });
                                    }
                                    if (permInvoices == 1) {
                                        currentInput.insertAfter($('#claim_invoices_input_' + (currentSelect - 1)));
                                    } else {
                                        var prevText = $('#claim_invoices_text_' + parseInt(currentSelect - 1));

                                        $('<span/>').attr({'id': 'claim_invoices_text_' + currentSelect}).insertAfter(prevText);

                                        if (permInvoices != 2) {
                                            currentInput.insertAfter(prevText);
                                        }

                                        $('<div/>').addClass('clr').insertAfter(prevText);
                                    }
                                } else {
                                    if (permInvoices != 2) {
                                        $('#claim_invoices_input_' + currentSelect).val(invoice.prim_id);
                                    }
                                }

                                this.currentSum['claim-client-invoices_' + (i + 1)] = invoice.summ;

                                if (permInvoices != 1) {
                                    var option = $('#claim_invoices_text_' + currentSelect);
                                    var message = '№' + invoice.id + ' ';

                                    if (invoice.revision === null) {
                                        message += '(Оригинал)';
                                    } else {
                                        message += '(Версия №' + invoice.revision + ')';
                                    }

                                    option.text(message);
                                    this.show();
                                }
                                currentSelect++;
                            }
                        }

                        if (permInvoices > 1) {
                            this.currentCountSelects = currentSelect - 1;
                            this.validate();
                        }
                    }
                    break;
                case 4:
                    if (this.withoutDocs) {
                        $('#claim-client-invoices_1').children('option[value="without_docs"]').prop('selected', true);
                        this.change($('#claim-client-invoices_1'));
                        return;
                    }

                    var currentSelect = 1;

                    for (var i = 0; i < this.listInvoices.length; i++) {
                        var invoice = this.listInvoices[i];
                        var option = $('#claim-client-invoices_' + currentSelect).children('option[value="' + invoice.prim_id + '"]');

                        if (invoice.selected) {
                            option.prop('selected', true);
                            var newDef = $.when(claim.invoices.change($('#claim-client-invoices_' + currentSelect)));
                            newDef.done(function() {
                                claim.invoices.addSelect();
                                currentSelect++;
                            });
                        }
                    }
                    break;
            }
        }
    }

    /**
     * машина
     */
    this.car = {
        parent : this,
        tid : 'car_claim_tbody',
        changeCar : function(obj) {
            if (obj.value == '' || obj.value == '0') {
                $('input[name="claim[tk]"]').prop('disabled', true);
            } else {
                $('input[name="claim[tk]"]').prop('disabled', false);
            }
            var show = parseInt(obj.value) == 1;
            this.parent.node(this.tid).style.display = (show ? '' : 'none');
            var inp = this.parent.node(this.tid).getElementsByTagName('input');
            var sel = this.parent.node(this.tid).getElementsByTagName('select');
            for(var i = 0; i < inp.length; i++) {
                inp.item(i).disabled = !show;
            }
            for(var i = 0; i < sel.length; i++) {
                sel.item(i).disabled = !show;
            }
        },

        /**
         * синхронизация данных по машине
         * @param nodeObject obj
         * @param integer idChangedCar принимает id выбранной при быстром поиске по машине
         * @return void
         */
        changeNumber:function(obj, idChangedCar) {
            this.parent.element('claim[driverName]').value = '';
            this.parent.element('claim[driverPhone]').value = '';

            //если значение idChangedCar передано из быстрого поиска заполняем поля имя и телефон водителя
            if (idChangedCar) {
                for (let key in this.parent.dataContainer.get('carList')) {
                    if (this.parent.dataContainer.get('carList')[key].id != idChangedCar) {
                        continue;
                    }

                    this.parent.element('claim[driverName]').value = this.parent.dataContainer.get('carList')[key].name;
                    this.parent.element('claim[driverPhone]').value = this.parent.dataContainer.get('carList')[key].phone;
                    return;
                }
            }

            for (let key in this.parent.dataContainer.get('carList')) {
                if (this.parent.dataContainer.get('carList')[key].id != obj.value) {
                    continue;
                }
                this.parent.element('claim[driverName]').value = this.parent.dataContainer.get('carList')[key].name;
                this.parent.element('claim[driverPhone]').value = this.parent.dataContainer.get('carList')[key].phone;
                break;
            }
        }
    };

    /**
     * представительские расходы
     */
    this.kickback = {
        parent:this,
        change:function(obj){
            if (parseInt(obj.value)) {
                if (this.parent.node('kickback')) {
                    this.parent.node('kickback').style.display = '';
                }
                if (this.parent.node(this.parent.formId)['claim[kickback]']) {
                    this.parent.node(this.parent.formId)['claim[kickback]'].disabled = false;
                }
            }else {
                if (this.parent.node('kickback')) {
                    this.parent.node('kickback').style.display = 'none';
                }
                if (this.parent.node(this.parent.formId)['claim[kickback]']) {
                    this.parent.node(this.parent.formId)['claim[kickback]'].disabled = true;
                }
            }
        },
        oninput:function(obj) {
            obj.value = obj.value.replace(/[,]/g, '.');
            if (!/^\d+(\.(\d*))?$/.test(obj.value)) {
                obj.value = Math.abs(this.parent.toFloat(obj.value));
            }
            obj.value = obj.value.replace(/^0+/, '');
        }
    };

    /**
     * payment field
     */
    this.changeSumm = function(obj) {
        obj.value = obj.value.replace(/[,]/g, '.');
        if (!/^\d+(\.(\d*))?$/.test(obj.value)) {
            obj.value = Math.abs(this.toFloat(obj.value));
        }
        if (/^0\d+/.test(obj.value)) {
            obj.value = obj.value.replace(/^0/, '');
        }
    };

    /**
     * price products field
     */
    this.changePrice = function(obj) {
        obj.value = obj.value.replace(/[,]/g, '.');
        if (!/^\d+(\.(\d*))?$/.test(obj.value)) {
            obj.value = Math.abs(this.toFloat(obj.value));
        }
        if (/^0\d+/.test(obj.value)) {
            obj.value = obj.value.replace(/^0/, '');
        }
        if (obj.name.indexOf('totalprice') > 0) {
            this.node(this.formId)[obj.name.replace(/totalprice/, 'price')].value = (this.toFloat(obj.value) / this.toFloat(this.node(this.formId)[obj.name.replace(/totalprice/, 'amount')].value))||'';
        }
        else {
            this.node(this.formId)[obj.name.replace(/price/, 'totalprice')].value = this.round(parseFloat(obj.value) * this.toFloat(this.node(this.formId)[obj.name.replace(/price/, 'amount')].value))||'';
        }
        this.updateTotals();
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
        }else {
            $('#filter-claim-goods-cnt').css({overflow:'visible'}).animate({height:'136px', opacity:1}, 200);
            obj.lang = 0;
            obj.src = '/img/system/fieldsCloseF.png';
        }
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
            url      : linkPrefix + '/claim/out/getproductfilterdata',
            cache    : false,
            type     : 'POST',
            dataType : 'json',
            data     : data,
            success  : function(data) {
                claim.showHideProducts(data.result);
            }
        });
    };

    /**
     * показать скрыть продукт
     */
    this.showHideProducts = function(data)
    {
        if (!this.node("table_products")) {
            return;
        }
        var products = this.getAllProductsIds(true).products;
        for(var i in products) {
            if (!parseInt(i)) {
                continue;
            }
            products[i] = {number:products[i], display:0};
        }
        for(var i = 0; i < data.length; i++) {
            products[data[i].id].display = 1;
        }
        var tmp = {};
        for(var i in products) {
            tmp[products[i].number] = (products[i].display ? '' : 'none');
        }
        var rows = this.node("table_products").rows;
        for(var i = 1; i < rows.length - 1; i++) {
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
            if (!p) {
                continue;
            }
            if (!rev) {
                data.products[n + ''] = p;
            }else {
                data.products[p + ''] = n;
            }
        }
        return data;
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


    /**
     * Отображение формы "Блокировка товара"
     * @param {*} data
     * @param ajax
     * @return {boolean}
     */
    this.displayEditProductStart = function(data, ajax)
    {
        if (ajax) {
            // Предотвращаем повторную отправку запроса до завершения пердыдущего
            if (this.isEditProductFormDataLoading) {
                Lib.Notify.prototype.getInstance().add({
                    text: 'Данные ещё загружаются, пожалуйста, подождите',
                    type: 'info',
                    hide: true,
                    delay: 5000
                }, "isEditProductFormDataLoading");

                return false;
            }

            this.isEditProductFormDataLoading = true;

            $.ajax({
                url: (claim.blockFormMode.isRemote() && claim.isSubsidiaryProject ? '/claim/out/extproject/getinfoblock' : '/claim/out/getinfoblock'),
                cache: false,
                data: {
                    depotId: data.depotId,
                    itemId: data.productId,
                    claimId: this.node(this.formId)['claim[id]'].value
                },
                type     : 'POST',
                dataType : 'json',
                complete: function () {
                    this.isEditProductFormDataLoading = false;
                }.bind(this),
                success: function(data) {
                    if (data.error) {
                        claim.showError(data.error);
                    } else {
                        if (parseInt(data.isBlocked) === 1) {
                            claim.showError('Вам запрещено добавлять данный товар, обратитесь к руководителю!');
                        } else {
                            claim.displayEditProductStart(data, false);
                        }
                    }
                },
                error    : function(obj, text) {
                    claim.showError(obj.responseText);
                }
            });
            return;
        }

        if (parseInt(this.claimStatus) === 0) {
            this._displayEditProductSimple(data);
        } else if (parseInt(this.perm.products.editproduct) === 4) {
            this._displayEditProductFull(data);
        } else {
            this._displayEditProductSimple(data);
        }
    };


    /**
     * редактирование с ручной блокировкой
     * @param {Object} data информация для формы блокировки
     * @return {void}
     */
    this._displayEditProductFull = function(data)
    {
        this.overley2 = new overley();

        // Метод выполняет подготовку данных перед отображением
        function prepareData(data) {
            for(var i = 0; i < data.addinfo.length; i++) {
                ddRowProxyHandler.forEachDdmRow(data.addinfo[i], function(ddmRowData) {
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
                perpage     : 15,
                enableTotalRowAll: true,
                totalRowOptions: {
                    fields: {
                        price: (price) => price
                    }
                },
            });

            // Ширина таблицы детализаций
            var ddmSubtableWidth = 0;
            DdmSubtableFieldsClasses.forEach(function(fieldClass) {
                ddmSubtableWidth += fieldClass.prototype.width;
            });

            this.grid2.head = {
                task: {
                    caption: 'Заявка',
                    width: 100
                },
                date: {
                    caption: 'Дата',
                    width: 75
                },
                price: {
                    caption: 'Цена',
                    width: 75,
                    aliace: function(v)
                    {
                        return (claim.toFloat(v) || '');
                    }
                },
                franco: {
                    caption: 'Франко склад',
                    width:75,
                    aliace: function(v)
                    {
                        return (claim.toFloat(v) || '');
                    }
                },
                payment: {
                    caption: 'Тип оплаты',
                    width: 75,
                    aliace: function (v)
                    {
                        return v || '';
                    }
                },
                placing: {
                    caption: 'Секция',
                    width: 100
                },
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
                                tr.addClass('disableWorkWithRow').attr('title', 'Недостаточно прав для работы со строкой');
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
                delete(this.grid2.head.franco);
                delete(this.grid2.head.payment);
            }
            this.grid2.create();
            this.grid2.data = data.addinfo;
            this.grid2.totalRow = {
                'all': {
                    'price': data.addinfo.reduce((acc, cur) => acc + parseFloat(cur.price), 0) / (Math.max(data.addinfo.length, 1))
                }
            };
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
                        subsidiaryClaimDepotId: claim.getSubsidiaryClaimDepotId(),
                        data : claim.blockFormMode.isRemote() || claim.isLinkedClaim && claim.isMainProject ? this.data : [ddRowData],
                        itemId : claim.overley2.tmpdata.id,
                        pnumber : claim.getProductNumber(claim.overley2.tmpdata.id),
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
                    claimId : claim.overley2.tmpdata.claimId,
                    depotId: claim.overley2.tmpdata.depotId,
                    subsidiaryClaimDepotId: claim.getSubsidiaryClaimDepotId(),
                    data : claim.overley2.grid2.data,
                    itemId : claim.overley2.tmpdata.id,
                    pnumber : claim.getProductNumber(claim.overley2.tmpdata.id),
                    parity : claim.overley2.tmpdata.parity,
                    afterClose : claim.node(claim.overley2.blockId + '_close_after_save').checked
                };
                // значение заблокированного товара по всем секциям
                var allBlockAmount;

                // если по правам включена проверка На минимальное количество на складе
                if (data.data.length && claim.perm.checkminoutamount == 1) {
                    // значение минимального количества на складе по умолчанию из options
                    var minOutAmount = (claim.overley2.tmpdata.minOutAmount > 0) ?  claim.overley2.tmpdata.minOutAmount : MIN_OUT_AMOUNT;

                    if (claim.overley2.tmpdata.exceptMinOutAmountIds) {
                        var values = claim.overley2.tmpdata.exceptMinOutAmountIds.split(',');

                        $.each(values, function (index, value) {
                            if (parseInt(value) == claim.overley2.tmpdata.id) {
                                minOutAmount = 0;
                            }
                        });
                    }

                    // установка значения заблокированного товара по всем секциям
                    allBlockAmount = 0;
                    for(var i = 0; i < data.data.length; i++) {
                        ddRowProxyHandler.forEachDdmRow(data.data[i], function(ddmRowData) {
                            allBlockAmount += parseInt(ddmRowData.curBlockAmount)||0;
                        });
                    }

                    // установка значения количества оставшегося на складе
                    var allowedAmountWeight = parseInt(claim.overley2.tmpdata.amountWeight) - allBlockAmount;

                    // если разница между товаром на складе и заблокированным значением меньше Минимального количества на складе
                    if (allowedAmountWeight > 0 && allowedAmountWeight < minOutAmount) {
                        alert('Нельзя оставить на складе меньше минимального количества ' + minOutAmount + ', на складе остается ' + allowedAmountWeight + '!');
                        return false;
                    }
                }

                if (data.data.length && data.data[0].type == 1) {
                    var message = [];
                    var splitGoodsErrorAverage = null;

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
                                splitGoodsErrorAverage = tmp.average;
                            }
                        });
                    }

                    //Если разрешено дробление товаров предупреждение иначе сообщение с запретом
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
                            claim.showError('Нельзя добавить количество товара не кратное его количеству в упаковке ' + splitGoodsErrorAverage, function(){});
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

                if (claim.perm.products.sectionedit == 4) {
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

            // Небольшой костыль для высоты всей таблицы, так как высота может превысить высоту экрана после добавления детализаций к секциям
            $(area).find('.block_info .filter-grid-body').css({
                'maxHeight': '570px'
            });

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

            // Если идёт работа с полем boxes
            if (type == 'curBlockBoxes' && data.type == 2) {
                if (!expression.test(obj.value)) {
                    obj.value = Math.ceil(Math.abs(claim.toFloat(obj.value)));
                }
            } else {
                // Если идёт работа с полем amount (кг товар)
                if (data.type == 2) {
                    if (!floatNumbers.test(obj.value)) {
                        obj.value = Math.abs(claim.toFloat(obj.value));
                    }
                } else {
                // Если идёт работа с полем amount (шт товар)
                    if (!integerNumbers.test(obj.value)) {
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

            // Если товар КГ
            if (data.type == 2) {
                var maxVal = data.maxAmount - data.confirmAmount;
                    // КГ товар, блокируется boxes
                if (type == 'curBlockBoxes') {
                    // Максимально допустимое значение boxes из модели
                    var controlValue = Math.round(claim.toFloat(data.boxes));
                    // Проверка, что введённое значение не превышает максимально допустимое
                    // Если разрешены дробные boxes на проекте (pzo)
                    if (BLOCK_DOUBLE) {
                        // Берём не округлённое значение boxes из модели для сравнения
                        if (obj.value - (parseFloat(data.maxBoxes) || 0) > 0.00001) {
                            obj.value = data.maxBoxes;
                        }
                    } else {
                        // Если boxes только целочисленные
                        if (obj.value > controlValue) {
                            obj.value = controlValue;
                        }
                    }

                    // Для boxes берём значение, которое ввёл пользователь
                    var boxes = obj.value;
                    // Amount вычисляем
                    var amount = claim.round(boxes * data.average);

                    // Если выбраны не все boxes, обязательно оставить amount
                    if (!BLOCK_DOUBLE) {
                        // Если boxes ещё остаются, то отнять 1 от максимально допустимого значения amount (если не разрешены дробные boxes)
                        if (data.otherblock - data.confirmBoxes > 0 || boxes < controlValue) {
                            maxVal -= 1;
                        }
                    }

                    // Сбросить amount до максимально допустимого, если, то, что мы ввели больше, либо, если выбраны все boxes (TODO: понять зачем второе условие)
                    let allBoxesBlocked = (claim.toFloat(data.confirmBoxes) + claim.toFloat(boxes)) === claim.toFloat(data.maxBoxes);

                    if (amount > maxVal || allBoxesBlocked) {
                        amount = maxVal;
                    }

                    // Установка в модель значения amount, который был получен умножением значения boxes (который можно установить) на средний вес
                    data.curBlockAmount = amount;

                    // КГ товар, блокируется amount
                } else {

                    var amount = claim.toFloat(obj.value);

                    if (BLOCK_DOUBLE) {
                        if (obj.value > Math.round(parseFloat(data.maxAmount))) {
                            obj.value = data.maxAmount;
                        }
                    } else {
                        if (data.otherBlock - data.confirmBoxes > 0 || data.curBlockBoxes < data.boxes) {
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
                // Если товар шт
            } else {
                var controlValue = claim.toFloat(data[type.replace(/curBlock/, '').toLowerCase()]);
                if (obj.value > controlValue) {
                    obj.value = controlValue;
                }
                obj.value = claim.toFloat(obj.value);

                if (type == 'curBlockBoxes') {
                    var amount = claim.round(obj.value * data.average);
                    amount = amount > data.amount ? data.amount : amount;
                    data.curBlockAmount = amount;
                } else {
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

        /**
         * Метод выполняет обновление блока "Было/стало"
         */
        this.overley2.updateOldDataBlock = function() {
            if (claim.node(this.blockId + '_old_data_block')) {
                var row = claim.node(this.blockId + '_old_data_block').firstChild.rows[1];
                var cur = {amount: 0, boxes: 0};
                for (var i = 0; i < this.grid2.data.length; i++) {
                    cur.amount += claim.toFloat(this.grid2.data[i].curBlockAmount);
                    cur.boxes += claim.toFloat(this.grid2.data[i].curBlockBoxes);
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
            for(var i = 0; i < this.grid2.data.length; i++) {
                ddRowProxyHandler.forEachDdmRow(this.grid2.data[i], function(ddmRowData) {
                    if ((new Proxy(ddmRowData, ddmRowProxyHandler)).availableWorkWithRow) {
                        // Если есть возможность работы со строкой (с блокировкой под менеджера)

                        if (parseInt(claim.perm.products.amount) === 4) {
                            // Если есть права редактировать количество
                            ddmRowData.curBlockAmount = (obj.checked ? (itemType == 2 ? ( ddmRowData.otherBlock - ddmRowData.confirmBoxes > 0 ? (ddmRowData.maxAmount - ddmRowData.confirmAmount - 1) : (ddmRowData.maxAmount - ddmRowData.confirmAmount)) : ddmRowData.amount) : 0);
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

            // обновление блока "Было/стало"
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
            var ctrlValue = this.tmpdata.curblock; //(this.tmpdata.type == 1 ? this.tmpdata.amountWeight : this.tmpdata.boxesRols);
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
     * @param {Object} data информация для формы блокировки
     * @return {void}
     */
    this._displayEditProductSimple = function(data)
    {
        var _self = this;

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
                id:      {caption: 'ID', width:50},
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
            //inp.productType = data.type;
            //inp.inBoxes = data.inBoxes;
            inp.lang = this.blockId + '_bt_ok';
            inp.maxValue = data.addinfo.maxBlock||0; // data.addinfo.blokMaxInput
            inp.value = parseFloat(data.addinfo.curBlock)||'';
            inp.lastValue = parseFloat(data.addinfo.curBlock)||'';
            inp.oninput = function() {
                this.value = this.value.replace(/[,]/g, '.');
                // Шт товар или нельзя блокировать дробное значение
                // 05-06-2019 Нечаев С. добавить проверку на право
                if ((!BLOCK_DOUBLE || parseInt(claim.overley2.tmpdata.type) == 1) && !parseInt(claim.splitgoods)) {
                    this.value = Math.floor(Math.abs(claim.toFloat(this.value)));
                    this.value = this.value.replace(/^0+/, '');
                } else {
                    // Можно блокировать дробное значение
                    if (this.value.length > 1 && this.value.charAt(1) !== '.') {
                        this.value = this.value.replace(/^0+/, '');
                    }

                    // Если строка начинается с точки добавить ведущий ноль
                    if (this.value.charAt(0) === '.') {
                        this.value = '0' + this.value;
                    }

                    // Удалить буквы и личние точки
                    this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
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
                    depotId : claim.overley2.tmpdata.depotId,
                    subsidiaryClaimDepotId: claim.getSubsidiaryClaimDepotId(),
                    block : claim.overley2.tmpdata.addinfo.curBlock,
                    itemId : claim.overley2.tmpdata.id,
                    pnumber : claim.getProductNumber(claim.overley2.tmpdata.id),
                    parity : claim.overley2.tmpdata.parity,
                    afterClose : 1
                };

                // проверка при каскаде на то, был ли добавляемый товар удален в этом же каскаде
                if (claim.claimStatus == 0 && (claim.originalProductsId.indexOf(data.itemId) != -1)) {
                    alert('Удаление и добавление одного и того же товара в рамках одного каскада запрещено!');
                    return;
                }

                var text = 'введенное кол-во ' + claim.overley2.tmpdata.addinfo.curBlock;
                text += ' не кратно кол-ву в упаковке ' + claim.overley2.tmpdata.inBoxes;

                // установка значения Минимального количества на складе
                var minOutAmount = (claim.overley2.tmpdata.minOutAmount > 0) ?  claim.overley2.tmpdata.minOutAmount : MIN_OUT_AMOUNT;

                if (claim.overley2.tmpdata.exceptMinOutAmountIds) {
                    var values = claim.overley2.tmpdata.exceptMinOutAmountIds.split(',');

                    $.each(values, function (index, value) {
                        if (value == claim.overley2.tmpdata.id) {
                            minOutAmount = 0;
                        }
                    });
                }

                // установка значения количества оставшегося на складе
                var allowedAmountWeight = parseInt(claim.overley2.tmpdata.amountWeight) - parseInt(claim.overley2.tmpdata.addinfo.curBlock);

                // если разница между товаром на складе и заблокированным значением меньше Минимального количества на складе
                if (allowedAmountWeight > 0 && allowedAmountWeight < minOutAmount && claim.perm.checkminoutamount == 1) {
                    alert('Нельзя оставить на складе меньше минимального количества ' + minOutAmount + ', на складе остается ' + allowedAmountWeight + '!');
                    return false;
                }

                text += '<br> - ближайшее наименьшее ' + Math.floor(claim.overley2.tmpdata.addinfo.curBlock / claim.overley2.tmpdata.inBoxes) * claim.overley2.tmpdata.inBoxes;
                var tmp = Math.ceil(claim.overley2.tmpdata.addinfo.curBlock / claim.overley2.tmpdata.inBoxes) * claim.overley2.tmpdata.inBoxes;
                tmp = tmp <= claim.overley2.tmpdata.addinfo.maxBlock ? tmp : claim.overley2.tmpdata.addinfo.maxBlock;
                text += '<br> - ближайшее наибольшее ' + tmp;
                text += ' <br><br>Вы уверены в правильности указанного кол-ва?';

                if (claim.overley2.tmpdata.type == 1
                    && claim.overley2.tmpdata.addinfo.curBlock%claim.overley2.tmpdata.inBoxes
                    && parseFloat(claim.overley2.tmpdata.addinfo.maxBlock) > parseFloat(claim.overley2.tmpdata.addinfo.curBlock)
                )  {
                    //Дробление товаров предупреждение или запрет
                    if (claim.splitgoods === 1) {
                        data.msg = text;
                        data.caption = 'Внимание';
                        claim.showAhtung(data, function(data) {
                            claim._displayEditproductEnd(data, 1);
                        });
                    } else {
                        claim.showError('Нельзя добавить количество товара не кратное его количеству в упаковке ' + parseFloat(claim.overley2.tmpdata.inBoxes), function(){});
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
            btcn.onclick = function() {
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
     * @param {Object} data данные о товаре
     * @param {Boolean} ajax использовать ajax или нет
     * @return {void}
     */
    this._displayEditproductEnd = function(data, ajax)
    {
        var Data = data;

        if (ajax) {
            var obj = this.overley2.getCnt();
            obj.style.minWidth =  '700px';
            obj.style.minHeight = '100px';
            $(obj.firstChild).hide();
            $(obj).css({'background-image':'url(/img/ld/ld3.gif)', 'background-position':'center center', 'background-repeat':'no-repeat'});
            $.ajax({
                url      : (
                    claim.blockFormMode.isRemote() || claim.isLinkedClaim && claim.isMainProject ?
                        '/claim/out/set-block-linked-claim' :
                        '/claim/out/setblockitem'
                ),
                cache    : false,
                data     : { data : serialize(data), claimId: data.claimId, depotId: data.depotId },
                type     : 'POST',
                dataType : 'json',
                success  : function(data) {
                    if (data.error) {
                        claim.showError(data.msg, function(){claim.overley2.restore();});
                    }else if (data.ahtung) {
                        if (claim.perm.products.editproduct == 4) {
                            claim.overley2.close();
                            claim.showError(data.msg, function(){claim._displayEditProductFull(this.tmpdata);});
                            claim.overleyError.tmpdata = data.extSectionData;
                        }else
                            claim.showAhtung(data, function(data){claim._displayEditproductEnd(data, 1);}, function(){claim.overley2.restore();});
                    }
                    else {
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
                error    : function(obj){
                    claim.overley2.restore();
                    claim.showError('<div align=left>' + obj.responseText  + '<div>', function(){});
                },
                complete: function()
                {
                }
            });
            return;
        }

        // Если есть оверлей обновить его
        if (typeof claim.overley2 !== 'undefined') {
            if (!parseInt(data.afterClose) && data.extSectionData) {
                claim.overley2.updateData(data.extSectionData);
            }
            if (parseInt(data.afterClose)) {
                claim.overley2.close();
            } else {
                claim.overley2.restore();
            }
        }

        var ptable = this.node('table_products');
        var rowIndex = this.getProductNumber(data.itemId, 1);

        // Если
        if (data.product === false) {
            this._removeClaimProduct(data);
        } else if (ptable.rows[rowIndex].getAttribute('product') == data.itemId) {
            this._updateClaimProduct(data);
        }else {
            this._addClaimProduct(data);
        }
        if (this.overley) {
            this.overley.grid.lastSelectionData = this.findAddedMaterial();
            this.overley.grid._updateSelectedRow();
        }
        if (this.node(this.formId)['products[' + this.getProductNumber(data.itemId) + '][price]']) {
            claim.changePrice(this.node(this.formId)['products[' + this.getProductNumber(data.itemId) + '][price]']);
        }else {
            this.updateTotals();
        }
    };

    /**
     * добавление данных по товару
     */
    this._addClaimProduct = function(data)
    {
        var guaranteeDate;
        if ($('#claim_date').val() && parseInt(data.product.guarantee_int)) {
            guaranteeDate = new Date($('#claim_date').val().replace(/(\d+)\.(\d+)\.(\d+)/, '$3/$2/$1'));
            guaranteeDate.setDate(guaranteeDate.getDate() + parseInt(data.product.guarantee_int));
            guaranteeDate = moment(guaranteeDate).format("DD.MM.YYYY");
        } else {
            guaranteeDate = '';
        }
        var number = data.pnumber;
        var head = this.node('table_products').rows[0].cells;
        var row = this.node('table_products_tbody').insertRow(this.node('table_products').rows.length - 2);

        // Скрытый инпут для св-ва depot_id
        var inp = this.crnode('input');
        $(inp).attr({ type: 'hidden', 'class': "product-depot-id", value: data.product.depot_id, name: 'products[' + number + '][depot_id]' });
        row.appendChild(inp);

        // input  hidden pid
        var inp = this.crnode('input');
        $(inp).attr({type : 'hidden', value : data.itemId, name:'products[' + number + '][product_id]'});
        row.appendChild(inp);

        // Скрытый инпут для св-ва тип товара (сырье, мусор и т.д.)
        var inp = this.crnode('input');
        $(inp).attr({ type: 'hidden', class: 'productType', value: data.product.productType, name: 'products[' + number + '][product_type]' });
        row.appendChild(inp);

        // Скрытый инпут для св-ва тип товара (сырье, мусор и т.д.)
        var inp = this.crnode('input');
        $(inp).attr({ type: 'hidden', class: 'itemWeight', value: data.product.item_weight, name: 'products[' + number + '][item_weight]' });
        row.appendChild(inp);

        var inp = this.crnode('input');
        $(inp).attr({type : 'hidden', value : data.product.guarantee_int, name:'products[' + number + '][guarantee_int]'});
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

        // input  hidden pnumber
        var inp = this.crnode('input');
        $(inp).attr({type : 'hidden', value : data.product.inboxes, name:'products[' + number + '][inboxes]'});
        row.appendChild(inp);

        if (this.perm.price == 1 ) {
            var inp = this.crnode('input');
            $(inp).attr({type : 'hidden', value : '', name:'products[' + number + '][price]'});
            row.appendChild(inp);
        }

        if (this.perm.amount == 1 ) {
            var inp = this.crnode('input');
            $(inp).attr({type : 'hidden', value : this.round(data.product.amount), name:'products[' + number + '][amount]', 'calculated-weight': this.round(data.product.amount * data.product.item_weight)});
            row.appendChild(inp);
        }

        if (this.perm.baseprice == 1 ) {
            var inp = this.crnode('input');
            $(inp).attr({type : 'hidden', value : this.round(data.product.baseprice), name:'products[' + number + '][baseprice]'});
            row.appendChild(inp);
        }
        if (this.perm.guarantee == 1 ) {
            var inp = this.crnode('input');
            $(inp).attr({type : 'hidden', value : guaranteeDate, name:'products[' + number + '][guarantee]'});
            row.appendChild(inp);
        }

        if (this.perm.boxes == 1 ) {
            var inp = this.crnode('input');
            $(inp).attr({type : 'hidden', value : this.round(data.product.boxes), name:'products[' + number + '][boxes]'});
            row.appendChild(inp);
        }

        // create table product row
        for(var i = 0; i < head.length; i++) {
            var cell = row.insertCell(row.cells.length);
            cell.setAttribute('width', head[i].getAttribute('width'));
            cell.setAttribute('align', 'center');
            switch(head[i].lang) {
                case 'price':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : '', readOnly : !(this.perm.products.price == 4), size : 8, name:'products[' + number + '][price]'}).css({'text-align':'left'});
                    inp.oninput = function(){
                        claim.changePrice(this);
                    };
                    inp.onchange = function () {
                        claim.bcControl(this);
                    };
                    cell.appendChild(inp);
                    break;
                case 'totalprice':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : '', readOnly : !(this.perm.products.totalprice == 4), size : 8, name:'products[' + number + '][totalprice]'}).css({'text-align':'left'});
                    inp.oninput = function(){
                        claim.changePrice(this);
                    };
                    inp.onchange = function () {
                        claim.bcControl(this);
                    };
                    cell.appendChild(inp);
                    break;
                case 'baseprice':
                    var inp = this.crnode('input');
                    $(inp).attr({
                        type : 'text',
                        value: data.product.baseprice,
                        readOnly: !(this.perm.products.baseprice == 4),
                        size: 8,
                        name: 'products[' + number + '][baseprice]',
                        title: (claim.itemBaseprice == 1 ? data.product.item_baseprice : '')
                    }).data('item_weight', data.product.item_weight).css({'text-align':'left'});

                    cell.appendChild(inp);

                    inp.onchange = function ()
                    {
                        claim.bcControl(this);
                    };
                break;
                case 'base_price_with_additional_expenses':
                    let input = $('<input>')
                        .attr({
                            'type'                    : 'text',
                            'value'                   : data.product.base_price_with_additional_expenses,
                            'disabled'                : true,
                            'name'                    : 'products[' + number + '][base_price_with_additional_expenses]',
                            'data-additional-expenses': data.product.additional_expenses,
                        })
                        .css({
                            'width': '80px',
                        })
                    ;

                    $(cell).append(input);
                break;
                case 'special_bp':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'checkbox', value : '1', size : 8, name:'products[' + number + '][special_bp]', checked: (data.product.special_bp === '1')}).css({'text-align':'left'});
                    inp.onchange = function(){
                        BasePriceForms.showBasePrice(number);
                    };

                    // если право Редактировать СБЦ не установлено на редактировать, отключение этой возможности
                    if (!(this.perm.products.special_bp == 4)) {
                        inp.onclick = function(){
                            return false;
                        };
                    }

                    cell.appendChild(inp);

                    // добавление на форму кнопки редактирования СПЗ/СБЦ
                    $(document.getElementsByName('products[' + number + '][special_bp]')[0]).closest('td').append(
                        '<span id="baseprice_img_' + number + '">\n\
                            <img src="/img/system/edit.png" style="cursor:pointer" \n\
                                onclick="javascript:BasePriceForms.showBasePriceForm(' + number + ', false )"/>\n\
                            <input type="hidden" value=""  name="products['+number+'][reason_reject_request]" type="text" >\n\
                            <input type="hidden" value=""  name="products['+number+'][price_on_request]" type="text" >\n\
                            <input type="hidden" value=""  name="products['+number+'][price_on_request_state]" type="text" >\n\
                            <input type="hidden" value="0" name="products['+number+'][special_bp_checker]" type="text" >\n\
                            <input type="hidden" value=""  name="products['+number+'][special_bp_txt]" type="text" >\n\
                            <input type="hidden" value=""  name="products['+number+'][special_bp_price]" type="text" >\n\
                            <input type="hidden" value=""  name="products['+number+'][special_bp_files]" type="text" >\n\
                            <input type="hidden" value=""  name="products['+number+'][notify_depot]" type="text" >\n\
                        </span>'
                    );
                    break;
                case 'baseprice_in':
                    var span = this.crnode('span');
                    $(span).attr('title', (claim.itemBaseprice == 1 ? data.product.item_baseprice_in : ''));
                    $(span).html(data.product.baseprice_in)
                    cell.appendChild(span);
                    break;
                case 'guarantee':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : guaranteeDate, readOnly : !(this.perm.products.guarantee == 4), size : 8, name:'products[' + number + '][guarantee]'}).css({'text-align':'left'});
                    cell.appendChild(inp);
                    $(cell).addClass('guaranteeLight');
                    $(inp).datepicker({duration: 'fast', showAnim: 'fadeIn'});
                    // проверка формата даты гарантии
                    $(inp).on('blur', function () {
                        if (!/^\d{2}\.\d{2}\.\d{4}$/.test($(this).val())) {
                            $(this).val(null).trigger("change");
                        }
                    });
                    break;
                case 'boxes':
                    var inp = this.crnode('input');
                    $(inp).attr({type : 'text', value : this.toFloat(String(data.product.boxes)), size : 8, readOnly : (this.claimStatus > 0), name:'products[' + number + '][boxes]'}).css({'text-align':'left'});
                    cell.appendChild(inp);
                    if (this.claimStatus == 0) {
                        inp.oninput = function(){
                            claim.changeCloseAmountBoxes(this);
                        };
                    }
                    break;
                case 'amount':
                    var inp = this.crnode('input');
                    $(inp).attr({
                        type : 'text',
                        value : this.toFloat(String(data.product.amount)),
                        size : 8,
                        readOnly : (this.claimStatus > 0),
                        name:'products[' + number + '][amount]',
                        'calculated-weight': this.round(data.product.amount * data.product.item_weight),
                        'title': 'расчётный вес: ' + this.round(data.product.amount * data.product.item_weight)
                    }).css({'text-align':'left'});
                    cell.appendChild(inp);
                    if (this.claimStatus == 0) {
                        inp.oninput = function(){
                            claim.changeCloseAmountBoxes(this);
                        };
                    }
                    break;
                case 'inboxes':
                    $(cell).html(this.toFloat(String(data.product.inboxes)));
                    break;
                case 'editproduct':
                    var inp;
                    if (claim.isSubsidiaryProject) {
                        var items = Object.create(null);
                        for (var k = 0; k < data.sections.length; k++) {
                            items[data.sections[k].project_depot_id] = {
                                id: data.sections[k].project_depot_id,
                                title: (data.sections[k].project_depot_id == 0 ? window.projectList[window.currentProjectId] : window.projectList[+data.sections[k].project_depot_id]),
                                product_id: data.itemId
                            };
                        }
                        inp = this.crnode('div');
                        $(inp).append('<div class="dropdown-btn">' +
                            '   <input type="image" src="/img/system/editproduct.png" class="dropdown-toggle_btn" width="16" height="16"/>' +
                            '</div>');
                        $(inp).addClass('dropdown js-dropdown js-dropdownlist-' + data.itemId + '');
                        claim.initEditProductDropdownlist($(inp), items);
                    } else {
                        inp = this.crnode('input');

                        $(inp).attr({
                            class: 'editProduct',
                            type: 'button',
                            title: 'редактировать',
                            lang: data.itemId
                        }).css({
                            background: 'transparent url(/img/system/editproduct.png) no-repeat center center',
                            border: 'none',
                            'outline': 'none',
                            cursor: 'pointer',
                            width: '16px',
                            height: '16px',
                        });
                    }

                    cell.appendChild(inp);
                    break;
                case 'delproduct':
                    var inp;
                    var langData = {
                        "itemId": data.itemId,
                        "caption": "Удаление товара",
                        "msg": "Вы уверены в удалении товара : " + data.product.field1 + "(" + data.itemId + ") ?",
                        "claimId": data.claimId
                    };

                    if (claim.isSubsidiaryProject) {
                        var items = Object.create(null);
                        for (var k = 0; k < data.sections.length; k++) {
                            items[data.sections[k].project_depot_id] = {
                                id: data.sections[k].project_depot_id,
                                title: (data.sections[k].project_depot_id == 0 ? window.projectList[window.currentProjectId] : window.projectList[+data.sections[k].project_depot_id]),
                                product_id: data.itemId
                            };
                        }

                        inp = this.crnode('div');
                        $(inp).append('<div class="dropdown-btn">' +
                            '   <input type="image" src="/img/system/delete.png" class="claim__input_delete dropdown-toggle_btn" width="16" height="16" lang="' + claim.compresData(langData) + '"/>' +
                            '</div>');
                        $(inp).addClass('dropdown js-dropdown-delete js-dropdownlist-' + data.itemId + '');
                        claim.initDeleteProductDropdownlist($(inp), items);
                    } else {
                        inp = this.crnode('input');
                        $(inp).attr({
                            type: 'button',
                            title: 'удалить ' + data.product.field1,
                            lang: claim.compresData(langData),
                            'class': 'claim__input_delete',
                        }).css({
                            background: 'transparent url(/img/system/delete.png) no-repeat center center',
                            border: 'none',
                            'outline': 'none',
                            'cursor': 'pointer'
                        });
                        inp.onclick = function(){
                            claim.showAhtung(claim.uncompresData(this.lang), function(data) {
                                claim._deleteClaimProduct(data, true);
                            });
                        };
                    }
                    cell.appendChild(inp);
                    break;
                case 'product_id':
                    $(cell).html(data.itemId);
                    break;
                default:
                    var tmp = data.product[head[i].lang];
                    // if (head[i].lang.replace(/field/, '') > 4 && head[i].lang.replace(/field/, '') < 13) {
                        // tmp = this.toFloat(tmp) > 0 ? tmp : 0;
                    // }

                    var value = (fieldTypes[head[i].lang] == 'string') ? tmp||'&nbsp;' : parseFloat(tmp)||'&nbsp;';

                    // Вывод примечания отдела закупок с проверкой на резрешенные к выводу поля
                    if (depot_tooltip.isAllowedField('annotationIn', head[i].lang) && data.product.annotationIn) {
                        var options = {
                            htmlPatternName : 'iconAnnotationBrown',
                            annotation      : data.product.annotationIn,
                            headerName      : 'annotationIn'
                        };

                        value += depot_tooltip.init(options).getTooltip();
                    }

                    $(cell).html(value||'&nbsp;');

                    if (tmp) {
                        // Если есть значение
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

        // Обновляем подсветку поля гарантия после вставки нового товара
        this.guaranteeLighter.processFields();

        if (this.angularProxy) {
            this.angularProxy.addItem({id: data.itemId});
        }
    };

    /**
     * обновление данных по товару
     * @param {Object} data - инфрмация по товару и секциям
     */
    this._updateClaimProduct = function(data)
    {
        var number = data.pnumber;
        if (this.node(this.formId)['products[' + number + '][boxes]']) this.node(this.formId)['products[' + number + '][boxes]'].value = data.product.boxes;
        if (this.node(this.formId)['products[' + number + '][amount]']) {
            this.node(this.formId)['products[' + number + '][amount]'].value = data.product.amount;
            this.node(this.formId)['products[' + number + '][amount]'].attributes['calculated-weight'].value = this.round(data.product.amount * data.product.item_weight);
            this.node(this.formId)['products[' + number + '][amount]'].title = this.round(data.product.amount * data.product.item_weight);
        }
        if (this.node(this.formId)['products[' + number + '][inboxes]']) this.node(this.formId)['products[' + number + '][inboxes]'].value = data.product.inboxes;
        this.node('table_products').rows[this.getProductNumber(data.itemId, 1, 1)].setAttribute('lastdate', data.product.lastDate);
        // show section
        this._updateProductSections(data);
        var obj = this.node(this.formId)['products[' + number + '][amount]'];
        var rowIndex = obj.parentNode.parentNode.rowIndex;
        var headRow = obj.parentNode.parentNode.parentNode.parentNode.rows[0];
        for(var i = 0; i < headRow.cells.length; i++) {
            if (headRow.cells[i].lang === 'inboxes') {
                obj.parentNode.parentNode.parentNode.parentNode.rows[rowIndex].cells[i].innerHTML = this.toFloat(data.product.inboxes);
                break;
            }
        }

        if (this.isSubsidiaryProject) {
            var projects = $('.js-dropdownlist-' + data.itemId + ':first').data('projects') || [];
            if (projects.indexOf(parseInt(data.project_depot_id)) === -1) {
                var dropdownlist = $('.js-dropdownlist-' + data.itemId);
                var item = {
                    id: data.project_depot_id,
                    title: (data.project_depot_id * 1 === 0 ? 'ИП Буданов' : 'ТД Авантпак'),
                    product_id: data.itemId
                };
                dropdownlist.each(function () {
                    $(this).data('dropdownlist').addItem(item);
                });
            }
        }
    };


    /**
     * Удаляет строку с товаров по ID товара
     * @param data
     * @private
     */
    this._removeClaimProduct = function(data)
    {
        $('#table_products_tbody').find('[product="' + data.itemId + '"]').remove();
    };


    /**
     * обновление данных по секциям
     */
    this._updateProductSections = function(data)
    {
        if (data.product.type == 1) {
            var rows = this.node('table_products').rows;
            var stop = false;
            for (let i = 1; rows[i] && !stop; i++) {
                if (rows[i].getAttribute('product') == data.itemId && rows[i].getAttribute('rowtype') == 'productstart') {
                    var sectionAverageWeight = $(rows[i]).find('.js-section-averageweight');
                    if (!sectionAverageWeight.length) {
                        sectionAverageWeight = $(`<input type="hidden" class="js-section-averageweight" value="0"/>`);
                        $(rows[i]).prepend(sectionAverageWeight);
                    }

                    sectionAverageWeight.val(data.sections.reduce(function(summ, value) {
                        return summ + value.averageweight;
                    }, 0));

                    stop = true;
                }
            }
        }

        if (this.perm.products.sectionview < 2) {
            return;
        }
        var rows = this.node('table_products').rows;
        var i = 1;
        while(rows[i]) {
            if (rows[i].getAttribute('product') == data.itemId && rows[i].getAttribute('rowtype') != 'productstart') {
                this.node('table_products').deleteRow(i);
                continue;
            }
            i++;
        }
        var rowIndex = this.getProductNumber(data.itemId, 1);
        var pnumber = this.getProductNumber(data.itemId);
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
            if (data.sections[i].type == 1) {
                if (this.perm.products.sectionedit) {
                    var inp = this.crnode('input');
                    inp.type = 'hidden';
                    inp.name = 'products['+pnumber+'][sections]['+i+'][detailed_id]';
                    inp.value = data.sections[i].detailed_id;
                    row.appendChild(inp);

                    var inp = this.crnode('input');
                    inp.type = 'hidden';
                    inp.name = 'products['+pnumber+'][sections]['+i+'][amount]';
                    inp.value = data.sections[i].amount;
                    row.appendChild(inp);

                    var inp = this.crnode('input');
                    inp.type = 'hidden';
                    inp.name = 'products['+pnumber+'][sections]['+i+'][boxes]';
                    inp.value = data.sections[i].boxes;
                    row.appendChild(inp);
                }
                row.insertCell(0).innerHTML = '№ секции : ' + data.sections[i].placing;
                row.insertCell(1).innerHTML = 'Количество : ' + this.toFloat(data.sections[i].curBlockAmount);
                let cell = row.insertCell(2);
                cell.innerHTML = 'Остаток по секции : ' + data.sections[i].fullamount + "/" + data.sections[i].fullboxes;

                let claimId = data.sections[i].claimId;
                let itemId = data.sections[i].id;

                SectionPhotoPreviewManager.renderEyeIcon(cell, claimId, itemId).then(r => r);

                //Вес шпули
                if (this.perm.products.spoolweight > 0) {
                    row.insertCell(3).innerHTML = 'Факт вес: ' + data.sections[i].averageweight;
                    row.insertCell(4).colSpan = head.length - 4;
                } else {
                    row.insertCell(3).colSpan = head.length - 3;
                }

            } else {
                var ind = -1;
                if (this.perm.products.sectionedit) {
                    var inp = this.crnode('input');
                    inp.type = 'hidden';
                    inp.name = 'products['+pnumber+'][sections]['+i+'][detailed_id]';
                    inp.value = data.sections[i].detailed_id;
                    row.appendChild(inp);

                    var inp = this.crnode('input');
                    inp.type = 'hidden';
                    inp.name = 'products['+pnumber+'][sections]['+i+'][amount]';
                    inp.value = data.sections[i].curBlockAmount;
//                    if (this.perm.products.sectionedit == 1)
                        row.appendChild(inp);

                    var inp = this.crnode('input');
                    inp.type = 'hidden';
                    inp.name = 'products['+pnumber+'][sections]['+i+'][boxes]';
                    inp.value = data.sections[i].curBlockBoxes;
                    row.appendChild(inp);
                }
                if (beforeColspan-1) {
                    row.insertCell(++ind).colSpan = beforeColspan - 2;
                }
                var cell = row.insertCell(++ind);
                cell.innerHTML = '№ секции : ' + data.sections[i].placing;;
                cell.align = 'center';
                if (this.perm.products.sectionedit > 1) {
                    var cell = row.insertCell(++ind);
                    var langdatastr = '{maxboxes:' + data.sections[i].maxBoxes + ', maxamount:' + data.sections[i].maxAmount + ', blockboxes:'+ data.sections[i].curBlockBoxes + ', confirmAmount:'+ data.sections[i].confirmAmount + ', confirmBoxes:'+ data.sections[i].confirmBoxes + ', curblocks:'+ data.sections[i].curcellblock + '}';
                    cell.innerHTML = 'Вес: ' + this.toFloat(data.sections[i].curBlockAmount);
                    cell.align = 'center';
                }
                var cell = row.insertCell(++ind);
                cell.innerHTML = 'Количество : ' + this.toFloat(data.sections[i].curBlockBoxes) + this.addBaleOrder(data.sections[i]);
                cell.align = 'center';
                //Остаток по секции
                var cell = row.insertCell(++ind);
                cell.align = 'center';
                cell.innerHTML = 'Остаток по секции : ' + data.sections[i].fullamount + "/" + data.sections[i].fullboxes;
                let claimId = data.sections[i].claimId;
                let itemId = data.sections[i].id;

                SectionPhotoPreviewManager.renderEyeIcon(cell, claimId, itemId).then(r => r);

                //Вес шпули
                if (this.perm.products.spoolweight > 0) {
                    var cell = row.insertCell(++ind);
                    cell.align = 'center';
                    cell.innerHTML = 'Вес шпули : ' + data.sections[i].spoolweight;
                    row.insertCell(++ind).colSpan   = head.length - beforeColspan - 3;
                } else {
                    row.insertCell(++ind).colSpan   = head.length - beforeColspan - 2;
                }
            }
        }
        var row = this.node('table_products_tbody').insertRow(i + rowIndex);
        row.setAttribute('product', data.itemId);
        row.setAttribute('rowtype', 'productend');
        row.insertCell(0).innerHTML = '<hr size=2 style="color:gray;">';
        row.cells[0].colSpan = head.length;
    };


    /**
     * При наличии baleOrder в данных секции формирует строку с даннми о номерах тюков
     * @param sectionData
     * @returns {string}
     * ToDo RAW_CLAIM
     */
    this.addBaleOrder = function(sectionData)
    {
        if (typeof sectionData.baleOrder !== 'undefined') {
            return '<div class="extraInfo">(' + sectionData.baleOrder + ')</div>';
        }

        return '';
    };


    /**
     * удаление данных по товару
     * @return {Promise}
     */
    this._deleteClaimProduct = function(data)
    {
        var deletePromise = new Promise(function (resolve, reject) {
            if (claim.claimStatus == 0) {
                data.productId = data.itemId;
                data.full_delete = true;
                resolve(data);
            } else {
                $.ajax({
                    url      : (claim.blockFormMode.isRemote() || claim.isLinkedClaim && claim.isMainProject ? '/claim/out/drop-product-linked-claim' : '/claim/out/dropproduct'),
                    cache    : false,
                    data     : { itemId : data.itemId, claimId: data.claimId },
                    type     : 'POST',
                    dataType : 'json',
                    success  : function(data) {
                        if (data.error) {
                            reject(data.error);
                        } else {
                            resolve(data);
                        }
                    },
                    error    : function(obj) {
                        reject(obj.responseText);
                    }
                });
            }
        }).then(function (data) {
            // Проверка на существование блока с ошибкой.
            if ($('h4#error_item_' + data.productId).length) {
                $('h4#error_item_' + data.productId).remove();
            }
            if ($('#check_show_product').find('.helpButtonForElement').parent().find('h4').length === 1) {
                $('#check_show_product').find('.helpButtonForElement').empty();
            }

            if (data.full_delete) {
                var rows = claim.node('table_products').rows;
                var i = 1;
                while(rows[i]) {
                    if (rows[i].getAttribute('product') == data.productId) {
                        claim.node('table_products').deleteRow(i);
                        continue;
                    }
                    i++;
                }
            } else {
                // обновить строку
                claim._updateClaimProduct(data.product_info);
            }

            claim.updateTotals();

            // если были удалены все товары, то сбрасываем режим блокировки формы
            if (claim.getProductRows().length === 0) {
                claim.blockFormMode.reset();
            }

            if (claim.angularProxy) {
                claim.angularProxy.deleteItem(data.productId);
            }

            return true;
        }, function (error) {
            claim.showError(error);
            return false;
        });

        return deletePromise;
    };

    /**
     * получить номер товара или строки таблицы
     */
    this.getProductNumber = function(productId, trow, firstrow)
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
        if (trow) {
            return (lastProductRow ? lastProductRow : rows.length -1);
        }
        number = (productId == -1 ? number : this.startNumber);
        this.startNumber++;
        return number;
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
            wndcapbt.onclick = function(){
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
            btok.onclick = function() { claim.overleyAhtung.afteClose = 1; claim.overleyAhtung.close(); };
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
            wndcapbt.onclick = function(){
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
            btcn.onclick = function(){ claim.overleyError.close(); };
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
     * @param totalAmount
     * @param totalFactWeight
     * @param totalCalculatedWeight
     * @returns {string}
     */
    this.getAutosumAmountHTML = function(totalAmount, totalFactWeight, totalCalculatedWeight)
    {
        // В totalCalculatedWeight может быть отрицательное значение, если в таблице depot_2_item_weight поле value=-1
        // Н. Сергей "Добавить конвертацию сюда"
        totalCalculatedWeight = totalCalculatedWeight < 0 ? totalCalculatedWeight * -1 : totalCalculatedWeight;

        var html = `<div title="суммарное кол-во/общий вес">${this.round(totalAmount)}</div>`;

        if (this.perm.products.sectionview > 1 && this.perm.products.spoolweight > 0) {
            html+= `<div title="суммарный факт вес">${this.round(totalFactWeight)}</div>`;
        } else {
            html += `<div title="суммарный расчётный вес">${this.round(totalCalculatedWeight)}</div>`;
        }

        return html;
    };

    /**
     * обновление результирующих значений
     */
    this.updateTotals = function(x)
    {
        var totalAmount = 0, totalBoxes = 0, totalSumm = 0, totalFactWeight = 0, totalCalculatedWeight = 0;
        var elements = this.node(this.formId).elements;
        var productType = 0;
        for(var i = 0; i < elements.length; i++) {
            switch (true) {
                case /^products\[\d+\]\[amount\]$/.test(elements[i].name):
                    totalAmount += this.toFloat(elements[i].value);
                    if (this.node(this.formId)[elements[i].name.replace(/amount/, 'totalprice')]) {
                        totalSumm += this.toFloat(this.node(this.formId)[elements[i].name.replace(/amount/, 'totalprice')].value);
                    }
                    productType = $(elements[i]).closest('tr').children('input[name$="][type]"]').val();
                    if (productType == 2) {
                        totalFactWeight += this.toFloat(elements[i].value);
                    }
                    totalCalculatedWeight += this.toFloat(elements[i].attributes['calculated-weight'].value);
                    break;
                case /^products\[\d+\]\[boxes\]$/.test(elements[i].name):
                    totalBoxes += this.toFloat(elements[i].value);
                    break;
            }

            productType = 0;
        }

        var _this = this;
        $('.js-section-averageweight').each(function () {
            totalFactWeight += _this.toFloat($(this).val());
        });

        if (this.node('autosum-boxes'))  this.node('autosum-boxes').innerHTML  = this.round(totalBoxes);
        if (this.node('autosum-amount')) {
            this.node('autosum-amount').innerHTML = this.getAutosumAmountHTML(totalAmount, totalFactWeight, totalCalculatedWeight);
        }
        if (this.node('autosum-summa'))  this.node('autosum-summa').innerHTML  = this.round(totalSumm);

        if (this.node(this.formId)['claim[summ]'] && this.perm.products.price > 1) {
            this.node(this.formId)['claim[summ]'].value = this.round(totalSumm);
        }
        if (this.node('claim-summ') && this.perm.products.price > 1 && !x) {
            this.node('claim-summ').innerHTML  = this.round(totalSumm);
        }
    };

    /**
     * Проверка Цена < БЦ при onchange
     */
    this.bcControl = function (obj)
    {
        obj = $(obj);

        if (parseInt(claim.perm.pricebccontrol) === 1) {
            let section = obj.parents('#check_show_product').find('.helpButtonForElement');

            section.empty();
            section.nextAll().remove();

            claim.bcControlStart();
        }

        if (obj.attr('name').indexOf('[baseprice]') > -1) {
            this.onBasePriceChange(obj);
        }
    }


    /**
     * @param $input
     */
    this.onBasePriceChange = ($input) =>
    {
        // Не обновлять поле "БЦ с расходами", на статусах
        if ([0,13,10].includes(this.claimStatus)) {
            return;
        }

        let productNumber = this.getProductNumberByField($input);
        let additionalExpensesField = this.getAdditionalExpensesField(productNumber);

        if (!additionalExpensesField) {
            return;
        }

        let basePriceValue = parseFloat($input.val()) || 0;
        let additionalExpenses = this.getAdditionalExpenses(productNumber);

        additionalExpensesField.val(basePriceValue + additionalExpenses);
    };


    /**
     * Возвращает number товара, $input - поле от которого будет запущен поиск
     * @param $input
     * @returns {number}
     */
    this.getProductNumberByField = ($input) =>
    {
        let $parentTr = $input.closest('tr[rowtype="productstart"]');

        if (!$parentTr.length) {
            throw new Error('Ошибка при получении данных товара!');
        }

        let productNumber = $parentTr.attr('pnumber');

        if (typeof productNumber === 'undefined' || isNaN(productNumber = parseInt(productNumber))) {
            throw new Error('Ошибка при получении данных товара!');
        }

        return productNumber;
    };


    /**
     * Возвращает поле с "БЦ с расходами"
     * @param productNumber
     * @returns {{length}|*|jQuery|HTMLElement|JQuery|undefined}
     */
    this.getAdditionalExpensesField = (productNumber) =>
    {
        let $additionalExpensesField = $(`[name="products[${productNumber}][base_price_with_additional_expenses]"]`);

        // Поле для доп. расходов не найдено
        if (!$additionalExpensesField.length) {
            return undefined;
        }

        return $additionalExpensesField;
    };


    /**
     * Возвращает дополнительные расходы по товару, productNumber - номер товара в заявке
     * @param productNumber
     * @returns {number|undefined}
     */
    this.getAdditionalExpenses = (productNumber) =>
    {
        let $additionalExpensesField = this.getAdditionalExpensesField(productNumber);

        if (!$additionalExpensesField) {
            return undefined;
        }

        let additionalExpenses = $additionalExpensesField.attr('data-additional-expenses');

        // Параметр не установлен
        if (typeof additionalExpenses === 'undefined') {
            return undefined;
        }

        if (isNaN(additionalExpenses = parseFloat(additionalExpenses))) {
            throw new Error('Ошибка при получении дополнительных расходов!');
        }

        return additionalExpenses;
    };


    /**
     * Проверка Цена < БЦ при загрузке страницы
     */
    this.bcControlStart = function () {
        if (claim.perm.pricebccontrol == 1) {
            if ($('#table_products tr[rowtype="productstart"]').length) {
                var lasth4 = '';
                // коэфициэнт минимального процента
                var min_percent = 3;

                $('#table_products tr[rowtype="productstart"]').each(function () {
                    var section   = $(this).parents('#check_show_product').find('.helpButtonForElement');
                    var price     = $(this).find('td').eq(0).find('input').val();
                    var baseprice = $(this).find('td').eq(2).find('input').val();
                    var item_id   = $(this).attr('product');

                    // Процент
                    var percent   = Math.round(((price * 100) / baseprice) - 100);//Math.abs(Math.round(((price * 100) / baseprice) - 100));
                    if (percent < 0) {
                        percent   = Math.abs(percent);
                        // Значение
                        var value     = Math.abs(Math.round(baseprice - price));

                        // Если процент составлаяет более коэфициэнта минимального процента, то выводим сообщение об ошибке, если же нет, то убираем его или не выводим вовсе.
                        if (percent > min_percent) {
                            $(this).find('td').eq(0).css('background', '#ffcfcc');
                            $(this).find('td').eq(2).css('background', '#ffcfcc');

                            section.html('<h4 style="color: red">Внимание!</h4>');
                            if (lasth4) {
                                $('h4#error_item_' + lasth4).after('<h4 id="error_item_' + item_id + '"></h4>')
                            } else {
                                section.after('<h4 id="error_item_' + item_id + '"></h4>');
                            }
                            $('h4#error_item_' + item_id).css({
                                'color'       :'red',
                                'line-height' : 0
                            }).text('товар: ' + item_id + ' - продажная цена (' + price + ') < БЦ (' + baseprice + '). Разница составляет: ' + value + 'р. (' + percent + '%)');
                            lasth4 = item_id;
                        }
                    } else {
                        $(this).find('td').eq(0).css('background', '');
                        $(this).find('td').eq(2).css('background', '');
                    }
                });
            }
        }
    }

    /**
     * Предпросмотр загруженных файлов.
     */
    this.showFile = function (obj) {
        var el = $(obj);
        var type = $(obj).data('file-type');
        var array_image_type = ['jpg','gif','jpeg','png','JPG','GIF','JPEG','PNG'];

        var id = el.data('id');
        var fileName = el.data('file-name');
        var publicLink = el.data('file-public-link');
        var title = el.data('title');
        var vendorLink = '/filemanager/preview/view/type/claim-out-document/?claimId=' + id + '&fileName=' + fileName;

        switch (true) {
            case ($.inArray(type, array_image_type) !== -1):
                Filemanager_PreviewHelper.open({
                    'type': 'image',
                    'fileName': fileName,
                    'publicLink': publicLink,
                    'title': title
                });
                break;
            case (type == 'pdf'):
                Filemanager_PreviewHelper.open({
                    'type': 'image-vendor',
                    'fileName': fileName,
                    'publicLink': publicLink,
                    'vendorLink' : vendorLink,
                    'title': title
                });
                break;
            case (type == 'doc' || type == 'docx'):
                Filemanager_PreviewHelper.open({
                    'type': 'vendor',
                    'fileName': fileName,
                    'publicLink': publicLink,
                    'vendorLink' : vendorLink,
                    'title': title
                });
                break;
            case (type == 'xls' || type == 'xlsx'):
                Filemanager_PreviewHelper.open({
                    'type': 'vendor',
                    'fileName': fileName,
                    'publicLink': publicLink,
                    'vendorLink' : vendorLink,
                    'title': title
                });
                break;
        }
    }

    /**
     * Получение промиса для проверки соответствия склада заявки и отдела
     * @returns {Promise}
     */
    this.getOrgDepotCheckPromise = function()
    {
        return new Promise((resolve, reject) =>
        {
            $.post('/claim/ajax/check-org-depot',{
                    claimId: claim.id,
                },
                (data) => {
                    if (parseInt(data.check)) {
                        resolve(data);
                    } else {
                        reject(data);
                    }

                })
        });
    }

    /**
     * Отправка формы с доп. проверками
     * @param nextStatus
     */
    this.sendFormWithExtraCheck = function (nextStatus)
    {
        if (claim.orgDepotCheck) {
            claim.getOrgDepotCheckPromise()
                 .then((data) =>
                 {
                     claim.sendForm(nextStatus);
                 })
                 .catch((error) =>
                 {
                     alert(`Внимание! Вам запрещено проводить изменения в складе ${error.depotTitle}`);
                 });
        } else {
            claim.sendForm(nextStatus);
        }
    }

    /**
     * подготовка формы к отправке
     * проверка есть ли товар у которого Цена < БЦ
     * отправка рассылки
     * @param bool nextStatus
     */
    this.sendForm = function(nextStatus)
    {
        var _breakFlag = false;
        var items          = 0;
        var itemsId        = [];
        var itemsPrice     = [];
        var itemsBaseprice = [];
        var end            = '';
        var percents       = [];

        if (
            nextStatus &&
            claim.basePriceAutoChanger.willBeApplied()
        ) {
            alert('Внимание, базовая цена будет увеличена в связи с маленьким объёмом');
        }

        if (claim.perm.pricebccontrol == 1
            && claim.managerStatus
            && nextStatus
        ) {
            $('#table_products_tbody').find('tr[rowtype="productstart"]').each(function(i) {
                if (parseFloat($(this).find('td').eq(0).find('input').val()) < parseFloat($(this).find('td').eq(2).find('input').val())) {
                    items++;
                    itemsId[i]        = $(this).attr('product');
                    itemsPrice[i]     = $(this).find('td').eq(0).find('input').val();
                    itemsBaseprice[i] = $(this).find('td').eq(2).find('input').val();

                    // Процент
                    var percent   = Math.abs(Math.round(((itemsPrice[i] * 100) / itemsBaseprice[i]) - 100));
                    // Значение
                    var value     = Math.abs(Math.round(itemsBaseprice[i] - itemsPrice[i]));

                    percents[i] = 'Разница составляет: ' + value + 'р. (' + percent + '%)';
                } else {
                    $(this).removeAttr('style');
                }
            });
            if (items == 0) {
                _breakFlag = true;
            } else {
                var id      = this.node(claim.formId)['claim[id]'].value;
                var link    = '/claim/out/' + id;
                var textarea = $('input[name="claim[annotation]"]');
                var manager = $('input[name="claim[managerId]"]');
                var client  = $('input[name="claim[clientId]"]');

                if (textarea.length) {
                    textarea = textarea.val();
                } else {
                    textarea  = tinyMCE.get('claim_annotation').getContent();
                }

                if (manager.length) {
                    manager = manager.val();
                } else {
                    manager = $('#manager_select').val();
                }

                if (client.length) {
                    client = client.val();
                } else {
                    client = $('#client_select').val()
                }

                var fileCount = $('#docUploadOut ul.documentsOut li').length;

                if (textarea.length == 0 && fileCount == 0) {
                    if (itemsId.length > 1) {
                        end = 'ы';
                    }
                    itemsId.join(', ');
                    $('tr[data-field-name="out/annotation"]').addClass('errorContent');
                    if ($('h2.errorOutContetnMessage').length) {
                        $('h2.errorOutContetnMessage').remove();
                    }
                    $('.td-filelistout').parent().append('<h2 class="errorOutContetnMessage">Цена на товар' + end + ': ' + itemsId + ', меньше базовой цены! Добавьте файл или напишите примечание</h2>');
                } else {
                    $.post('/claim/out/sendmailpricelessbaseprice',{
                        claimId   : id,
                        link      : link,
                        manager   : manager,
                        client    : client,
                        items     : itemsId,
                        price     : itemsPrice,
                        baseprice : itemsBaseprice,
                        percent   : percents
                    }, function (data) {
                        claim.send(nextStatus);
                    });
                }
            }
        } else {
            _breakFlag = true;
        }

        if (_breakFlag) {
            claim.send(nextStatus);
        }
    };

    /**
     * отправка формы
     */
    this.send = function (nextStatus) {
        var submit = function (form) {
            if (nextStatus && window.SendUpdToClient && window.SendUpdToClient.isActive()) {
                window.SendUpdToClient.show();
            } else {
                form.submit()
            }
        };

        this.node(this.formId)['changeStatusAvaleble'].value = (nextStatus ? 1 : 0);
        if (this.checkForm(this.node(this.formId))) {
            if (nextStatus && Claim_ClaimProductionGroupCloser.isEnabled()) {
                Claim_ClaimProductionGroupCloser.show(function () {
                    submit(this.node(this.formId));
                }.bind(this));
            } else {
                submit(this.node(this.formId));
            }
        }
    };

    this.checkFormFinanceSupport = function()
    {
        return this.checkForm(this.node(this.formId));
    };

    this.checkForm = function(form)
    {
        this.saveForm = false;
        if (this.userBlockInfo) {
            return false;
        }
        if (this.errorInfoBlock) {
            return false;
        }
        this.saveForm = true;
        var errors = [];
        var products = {};
        // Содержит в себе массив ошибок в случае если мы должны перевести заявку на статус диспетчера
        var emptyFileds = [];
        // Содержит флаг сохраняем или отправляем заявку
        var nextStatusAv = $(form).children("[name=changeStatusAvaleble]").val();
        // Содержит флаг наша машина или нет
        var car = $("#claim_car").val();
        // Выдает сообщение при отсутствии настройки региона
        if(car == 1 && claim.neighborRegionsFlag == 0) {
            errors.push(' - Не установлена настройка "Ближний транспорт"');
        }

        var maxProductDate = 0;
        if (this.node('check_show_product')) {
            var rows = this.node('table_products').rows;
            for(var i = 1; i < rows.length - 1; i++) {
                if (rows[i].getAttribute('rowtype') == 'product' && parseInt(rows[i].getAttribute('lastdate')) > maxProductDate) {
                    maxProductDate = parseInt(rows[i].getAttribute('lastdate'));
                }
            }
        }

        var els = form.elements;
        for(var i = 0; i < els.length; i++) {
            if (els[i].disabled) continue;
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
            }
            else {
                switch (els[i].name) {
                    case 'claim[managerId]':
                        if (!this.manager.value()) {
                            errors.push(' - не указан менеджер');
                        }
                        break;
                    case 'claim[payment]':
                        if($(els[i]).find('option[data-claim-payment-no-choice]:selected').size()) {
                            errors.push(' - не выбран тип оплаты');
                        }
                        break;
                    case 'claim[clientId]':
                        if (!this.client.value()) {
                            errors.push(' - не указан клиент');
                        }

                        break;

                    case 'claim[tender][agreementList]':
                        Claim_Out_Tender.getInstance().check(errors);
                        break;

                    case 'claim[kpp]':
                        var kpp = parseInt(els[i].value);

                        if(isNaN(kpp) || kpp == -1) {
                            errors.push(' - не указан КПП клиента');
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
                    case 'claim[car]':
                        if (car=="") {
                            errors.push(' - не выбрана машина');
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
                    case 'claim[carNumber]':
                        if(claim.carStatusFlag != 2 &&
                           claim.carStatusFlag != 1 &&
                           !parseFloat(els[i].value) &&
                           nextStatusAv == 0 && car == 1
                        ) {
                            emptyFileds.push(" - не указан номер машины");
                        }
                        if(nextStatusAv == 1 &&
                          (claim.carStatusFlag == 2 || claim.carStatusFlag == 0) &&
                          !parseFloat(els[i].value) &&
                          car == 1
                        ) {
                            errors.push(' - не указан номер машины');
                        }
                        break;

                    case 'claim[driverName]':
                        if((claim.carStatusFlag != 1 && claim.carStatusFlag != 2) &&
                            els[i].value.replace(/^\s+|\s+$/g, '') == '' &&
                            nextStatusAv == 0 && car == 1
                        ) {
                            emptyFileds.push(" - не указано имя водителя");
                        }
                        if(nextStatusAv == 1 &&
                          (claim.carStatusFlag == 2 || claim.carStatusFlag == 0) &&
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
                           nextStatusAv == 0 && car == 1
                        ) {
                            emptyFileds.push(" - не указан телефон водителя");
                        }
                        if(nextStatusAv == 1 &&
                          (claim.carStatusFlag == 2 || claim.carStatusFlag == 0) &&
                           els[i].value.replace(/^\s+|\s+$/g, '') == '' &&
                           car == 1
                        ) {
                            errors.push(' - не указан телефон водителя');
                        }
                        break;

                    case 'claim[kickback]':
                        if (!parseFloat(els[i].value)) {
                            errors.push(' - не указаны представительские расходы');
                        }
                        break;

                    case 'claim[annotation]':
                        if (parseInt(claim.perm.annotationrequired) && parseInt(this.node(this.formId)['changeStatusAvaleble'].value)) {
                            if (typeof(tinyMCE) !== "undefined" && tinymce.get('claim_annotation')) {
                                if (!tinyMCE.get('claim_annotation').getContent()) {
                                    errors.push(' - не указано примечание');
                                }
                            }
                        }

                        if (typeof(tinyMCE) !== "undefined" && tinymce.get('claim_annotation')) {
                            if (tinyMCE.get('claim_annotation').getContent()) {
                                $('textarea[name="claim[annotation]"]').val(tinyMCE.get('claim_annotation').getContent());
                            }
                        }

                        break;

                    case 'claim[annotationDispatcher]':
                        if (typeof(tinyMCE) !== "undefined" && tinymce.get('claim_annotation_dispatcher')) {
                            if (tinyMCE.get('claim_annotation_dispatcher').getContent()) {
                                $('textarea[name="claim[annotationDispatcher]"]').val(tinyMCE.get('claim_annotation_dispatcher').getContent());
                            }
                        }

                        break;

                    case 'claim[annotationDepot]':
                        if (typeof(tinyMCE) !== "undefined" && tinymce.get('claim_annotation_depot')) {
                            if (tinyMCE.get('claim_annotation_depot').getContent()) {
                                $('textarea[name="claim[annotationDepot]"]').val(tinyMCE.get('claim_annotation_depot').getContent());
                            }
                        }

                        break;
                    // Проверка на обязательность выбора адреса из менеджера адресов
                    case 'claim[unloadAddressId]':
                        if (!(els[i].value) && car == 1 ) {
                            errors.push(' - не выбран "Адрес выгрузки"');
                        }
                        break;
                    case 'claim[aproxClaimWeight]':
                        if (!parseFloat(els[i].value) && car == 1 && claim.perm.unloaddatarequired == 1) {
                            errors.push(' - не указан Ориентировочный вес по заявке');
                        }
                        break;
                    case 'claim[transportDeliveryTime]':
                        if(!(els[i].value) && car == 1 && claim.perm.unloaddatarequired == 1) {
                            errors.push(' - не указано Время подачи автомобиля');
                        }
                        break;

                    case 'claim[rentPrice]':
                        if(typeof window.claimFieldRentPriceValidate == 'function') {
                            window.claimFieldRentPriceValidate({
                                'error': function(msg) {
                                    errors.push(' - ' + msg);
                                }
                            });
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
                    case 'claim[dimensions]':
                        if (nextStatusAv > 0
                            && !this.isClosedClaim
                            && car == 1
                            && this.dimensions
                            && !this.dimensions.isValid()
                        ) {
                            errors.push(' - не указаны "Габариты"');
                        }
                        break;
                    case 'claim[depotNominalId]':
                        if (typeof this.depotNominal !== 'undefined' &&
                            !this.depotNominal.isValid() &&
                            !this.isClosedClaim
                        ) {
                            errors.push(' - заполните поле "Условный склад"');
                        }
                        break;
                    case 'claim[carProxy]':
                        if (parseInt(car) === 1 &&
                            !this.isClosedClaim &&
                             this.carProxy &&
                            !this.carProxy.isValid()
                        ) {
                            errors.push(' - заполните поле "Требуется доверенность"');
                        }
                        break;
                    case 'claim[leadId]':
                        if (nextStatusAv > 0 && this.leadId && !this.leadId.isValid()) {
                            errors.push(' - укажите номер лида');
                        }
                        break;
                }
            }
        }

        if (nextStatusAv == 1 && this.perm.fileslistin == 2
            && this.perm.fileslistin_required > 0 && fmDropUploader.documentList.length === 0
        ) {
            errors.push(' - загрузите файлы');
        }

        //true если цена хотя бы одного из продуктов = 0
        var priceZero = false;

        var checkSectionAmount = false;
        if (this.node('check_show_product')) {
            var productsExists = false;
            for(var i in products) {
                if (!this.toFloat(products[i].amount)) {
                    errors.push(' - не корректно указан вес для товара : ' + products[i].title);
                }
                //если не указана цена товара
                if (isNaN(parseFloat(products[i].price)) || parseFloat(products[i].price) <= 0.00001) {
                    priceZero = true;
                }
                if (!this.toFloat(products[i].boxes)) {
                    errors.push(' - не корректно указано кол-во для товара : ' + products[i].title);
                }
                if (products[i].sections) {
                    checkSectionAmount = true;
                    for(var j in products[i].sections) {
                        if (this.toFloat(products[i].sections[j].amount) < this.precision) {
                            errors.push(' - не корректно указан вес для товара : ' + products[i].title + ' в одной из секций');
                        }
                    }
                }
                productsExists = true;
            }
            if (!productsExists) {
                errors.push(' - отсутствуют товары в заявке');
            }
        }
        if (typeof(carView) != 'undefined' && car != 1 && carView.getVehicleAccessController() && !carView.getVehicleAccessController().check()) {
            errors.push(' - необходимо заполнить все поля для доступа ТС на территорию');
        }
        sectionErrors = false;

        (new ClientOfficialStateValidator()).validateByAjax(
            [this.getClientId()],
            { initialMessages: errors, claimStatus: this.claimStatus }
        );

        if (!errors.length && checkSectionAmount && this.claimStatus != 0) {
            $.ajax({
                url      : linkPrefix + '/claim/out/checksectionamount',
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
                    claim.showError('<div align=left>' + obj.responseText  + '<div>', function(){});
                    sectionErrors = true;
                    this.saveForm = false;
                }
            });
        }

        // проверка при подтверждении заявки, при максимальном количестве роликов соответствия максимальному значению веса
        if (!errors.length && checkSectionAmount && this.managerStatus == 1 && nextStatusAv == 1) {
            $.ajax({
                url      : linkPrefix + '/claim/out/check-max-amount',
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
                    claim.showError('<div align=left>' + obj.responseText  + '<div>', function(){});
                    sectionErrors = true;
                    this.saveForm = false;
                }
            });
        }

        var claimIdField = $('[name="claim[id]"]');
        var linkedProductionField = $('[name="claimLinkedProduction[claimProductionId]"]');

        // Проверка на наличие товара с производства
        if (!errors.length && parseInt(nextStatusAv) === 1 && claimIdField.length && linkedProductionField.length && parseInt(linkedProductionField.val())) {
            $.ajax({
                url: '/claim/out/validate-linked-production-products',
                cache: false,
                data: {
                    claimId: claimIdField.val(),
                    linkedProductionId: linkedProductionField.val(),
                },
                type: 'POST',
                dataType: 'json',
                async: false,
                success: function(data)
                {
                    for(var i in data.errors) {
                        if (data.errors.hasOwnProperty(i)) {
                            errors.push(data.errors[i]);
                        }
                    }
                },
                error: function(obj)
                {
                    claim.showError('<div align=left>' + obj.responseText  + '<div>', function(){});
                    this.saveForm = false;
                }
            });
        }

        if (emptyFileds.length && parseInt(this.claimStatus) !== 0) {
            if (confirm('Заявка будет возвращена на статус диспетчера т.к. не заполнены все поля: ' + String.fromCharCode(10, 13) + emptyFileds.join(String.fromCharCode(10, 13)) + String.fromCharCode(10, 13) + '')) {
                this.saveForm = true;
                emptyFileds = [];
            } else {
                this.saveForm = false;
            }
        }

        if (car == 1 && (nextStatusAv == 1 || window.financeBtnClicked) && !this.validateManagerCorpPhone()) {
            errors.push('- Внимание! Заявка в диспетчерский саппорт не может быть отправлена, так как у менеджера по заявке отсутствует корп. номер.');
        }

        if (errors.length) {
            alert('Обнаружены следующие ошибки :' + String.fromCharCode(10, 13) + errors.join(String.fromCharCode(10, 13)));
            this.saveForm = false;
        }

        var notice = true;
        //если не заполненна цена и закрываем заявку то выводим уведомление
        if(this.managerStatus == 1 && priceZero == true && nextStatusAv == 1) {
            notice = confirm('Вы уверены что хотите закрыть заявку, не заполнив цену?');
            if (!notice) {
                this.saveForm = false;
                //return false;
            }
        }
        return (!errors.length && !sectionErrors && !emptyFileds.length && notice);
    };

    /**
     * Вывод информации по приходам
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
                imgError:'/img/system/error.16.png',
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
                labelWeight:  {caption: configLabelWeight, width:75, aliace:function(v, cnt, rowData){ return eval(configLabelWeightReturn);}},
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
            btcn.onclick = function() {
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
                url      : linkPrefix + '/claim/out/getinfoin',
                cache    : false,
                data     : {itemId : data.id, claimId : this.node(this.formId)['claim[id]'].value},
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
     * Установка алиасов
     */
    this.aliace = function(v, cnt, rowData) {
        var title = '<span style="text-decoration:underline; cursor:pointer;">' + v + '</span>';

        // Вывод примечания отдела закупок
        if (rowData.annotationIn) {
            var options = {
                htmlPatternName : 'iconAnnotationBrown',
                annotation      : rowData.annotationIn,
                headerName      : 'annotationIn'
            };
            var iconAnnotation = depot_tooltip.init(options).getTooltip();
            if (iconAnnotation) {
                title += iconAnnotation;
            }
        }
        return title;
    };

    /**
     * послать на каскад
     */
    this.sendToCascade = function(params)
    {
        if (typeof params !== 'undefined' && params.hasOwnProperty('deleteOnCascade') && parseInt(params.deleteOnCascade) === 1) {
            let deleteOnCascadeField = $('[name="deleteOnCascade"]').val(params.deleteOnCascade);

            if (!parseInt(deleteOnCascadeField.val())) {
                alert('Не удалось установить флаг удаления!');
            }
        }

        this.saveForm = true;
        this.node(this.formId).action = linkPrefix + '/claim/out/cascade/';

        // если валидация формы прошла успешно, выполнить submit формы
        if (this.checkFormCascade(this.node(this.formId))) {
            this.node(this.formId).submit();
        }
    };


    /**
     * Валидация полей формы при каскадном изменении
     * @param form
     * @returns {boolean}
     */
    this.checkFormCascade = function(form)
    {
        this.saveForm = true;
        var errors = [];

        // установка значения поля Машина
        var car = $("#claim_car").val();

        var els = form.elements;
        for(var i = 0; i < els.length; i++) {
            if (els[i].disabled) {
                continue;
            }
            switch (els[i].name) {
                // проверка на обязательность выбора адреса из менеджера адресов
                case 'claim[unloadAddressId]':
                    if (!(els[i].value) && car == 1 ) {
                        errors.push(' - не выбран "Адрес выгрузки"');
                    }
                    break;
            }
        }

        // если имеются ошибки, отобразить alert
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

        return !errors.length;
    };


    /**
     *
     */
    this.changeCloseAmountBoxes = function(obj)
    {
        if (this.element(obj.name.replace(/(amount|boxes)/, 'type')).value == 1) {
            if (obj.name.indexOf('amount') > 0) {
                obj.value = obj.value.replace(/[,]/g, '.');
                if (!/^\d+$/.test(obj.value)) {
                    obj.value = Math.abs(this.toFloat(obj.value));
                }
                obj.value = obj.value.replace(/^0/, '');
                this.element(obj.name.replace(/amount/, 'boxes')).value = this.toFloat((obj.value/this.element(obj.name.replace(/amount/, 'inboxes')).value).toString());
            }else {
                obj.value = obj.value.replace(/[,]/g, '.');
                if (!/^\d+(\.(\d*))?$/.test(obj.value)) {
                    obj.value = Math.abs(this.toFloat(obj.value));
                }
                obj.value = obj.value.replace(/^0/, '');
                this.element(obj.name.replace(/boxes/, 'amount')).value = this.toFloat((obj.value * this.element(obj.name.replace(/boxes/, 'inboxes')).value).toString());
            }
        }
        else {
            if (obj.name.indexOf('amount') > 0) {
                obj.value = obj.value.replace(/[,]/g, '.');
                if (!/^\d+(\.(\d*))$/.test(obj.value)) {
                    obj.value = Math.abs(this.toFloat(obj.value));
                }
                obj.value = obj.value.replace(/^0/, '');
                if (!this.toFloat(obj.value)) {
                    this.element(obj.name.replace(/amount/, 'boxes')).value = 0;
                }
                this.element(obj.name.replace(/amount/, 'inboxes')).value = obj.value / this.element(obj.name.replace(/amount/, 'boxes')).value;
                var rowIndex = obj.parentNode.parentNode.rowIndex;
                var headRow = obj.parentNode.parentNode.parentNode.parentNode.rows[0];
                for(var i=0; i<headRow.cells.length; i++) {
                    if (headRow.cells[i].lang == 'inboxes') {
                        obj.parentNode.parentNode.parentNode.parentNode.rows[rowIndex].cells[i].innerHTML = this.toFloat(this.element(obj.name.replace(/amount/, 'inboxes')).value);
                        break;
                    }
                }
            }else {
                obj.value = obj.value.replace(/[,]/g, '.');
                if (!/^\d+(\.(\d*))?$/.test(obj.value)) {
                    obj.value = Math.abs(this.toFloat(obj.value));
                }
                obj.value = obj.value.replace(/^0/, '');
                if (this.element(obj.name.replace(/boxes/, 'inboxes')).value > 0) {
                    this.element(obj.name.replace(/boxes/, 'amount')).value = this.toFloat((obj.value * this.element(obj.name.replace(/boxes/, 'inboxes')).value).toString());
                }
            }
        }
        this.changePrice(this.element(obj.name.replace(/(amount|boxes)/, 'price')));
    };

    /**
     * отображение инфы о заблокировавшем юзвере
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
        + '<h3>Заявка ' + this.userBlockInfo.params.task + ' заблокирована '
        + (claim.showLinkedProjectBlockCheck ? '<input id="check_block_source" class="amd-btn amd-btn_primary" value="Проверить блокировку" type="button">' : '')
        + '</h3>'
        + 'пользователь : ' + this.userBlockInfo.params.user + '<br>'
        + 'время блокировки : ' + this.userBlockInfo.params.time +' <br>'
        + '</div>';
        $(document.body).append(html);

        /**
         * Клик по иконке "Проверить блокировку"
         */
        $('#check_block_source').live('click', function()
        {
            claim.checkBlockSource();
        });
    };


    /**
     * Проверка блокировки связанной заявки на связанном проекте
     */
    this.checkBlockSource = function()
    {
        // скрытие кнопки отображение загрузчика
        $('#check_block_source').after('<img id="check_block_source_loader" src="/img/ld/ld3.gif"/>');
        $('#check_block_source').hide();

        $.ajax({
            url: '/claim/ajax/check-block-source',
            cache: false,
            type: 'POST',
            dataType: 'json',
            data: {claimId: claim.node(claim.formId)['claim[id]'].value},
            success: function(response)
            {
                if (response.success) {
                    alert(response.success);
                    // перезагрузка страницы, если необходимо
                    if (response.reload) {
                        location.reload();
                        // скрытие загрузчика
                        $('#check_block_source_loader').hide();
                    } else {
                        // скрытие загрузчика отображение кнопки
                        $('#check_block_source_loader').hide();
                        $('#check_block_source').show();
                    }
                } else {
                    alert(response.error);
                }
            },
            error: function()
            {
                alert('Не удалось выполнить запрос к серверу! Обратитесь к администратору.');
            }
        });
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
     * Установка изначального набора id товаров
     * @return void
     */
    this.setOriginalProductsId = function()
    {
        var rows = this.node('table_products').rows;
        var i = 1;
        while(rows[i]) {
            if (this.originalProductsId.indexOf(rows[i].getAttribute('product')) == -1 && rows[i].getAttribute('product') != null) {
                this.originalProductsId.push(rows[i].getAttribute('product'));
            }
            i++;
        }
    };


    /**
     * Получить элемент выбора менеджера отгрузки
     * @returns {$|window.$}
     */
    this.getManagerOutElement = function()
    {
        return $('[name="claim[managerId]"]');
    };

    /**
     * Получить элемент выбора клиента отгрузки
     * @returns {$|window.$}
     */
    this.getClientOutElement = function()
    {
        return $('[name="claim[clientId]"]');
    };

    /**
     * Получить элемент выбора типа оплаты отгрузки
     * @returns {$|window.$}
     */
    this.getPaymentTypeOutElement = function ()
    {
        return $('[name="claim[payment]"]');
    };

    this.getTypeId = function ()
    {
        return 2;
    };

    /**
     * Получить id заявки отгрузки
     * @returns {string}
     */
    this.getClaimOutId = function()
    {
        return $('#claim_id').val();
    };

    /**
     * Получить состояние кнопок
     * @param {type} type
     * @returns {ClaimController.isBlock.block|incomeout.isBlock.block|Boolean|Boolean.isBlock.block|Window.invoicesControl|invoices_L109.Claim_InvoicesControl|income.isBlock.block|insupply.isBlock.block|conversion.isBlock.block|inout.isBlock.block|_L7.isBlock.block|checkActReviseControl_L9.Claims_CheckActReviseControl._data.access.check|_L1.isBlock.block|claimController.isBlock.block|claimin.isBlock.block|_L2.isBlock.block}
     */
    this.getStatusButtons = function ()
    {
        var block = {};

        // состояния из-за счетов
        this._statusButtonsMerge(block, (window.invoicesControl ? window.invoicesControl.util.getStatusButtons() : {}));
        // состояния из-за проверки сверки актов
        this._statusButtonsMerge(block, this.checkActReviseControl.getStatusButtons());

        return block;
    };

    /**
     * Объединение состояний кнопок
     * @param {object} a
     * @param {object} b
     * @returns {undefined}
     */
    this._statusButtonsMerge = function (a, b)
    {
        if (b) {
            for (var button in b) {
                a[button] = a[button] || b[button];
            }
        }
    };

    /**
     * Блокировка кнопок
     * @returns {undefined}
     */
    this.blockButtons = function ()
    {
        var block = this.getStatusButtons();
        if (undefined !== block.sendButton) {
            $('input[data-action-claim-send]').prop('disabled', block.sendButton);
        }
        if (undefined !== block.saveButton) {
            $('input[data-action-claim-save]').prop('disabled', block.saveButton);
        }
    };

    /**
     * инициализация выпадающего списка с выбором склада
     * @param {jQuery} element - элемент, который нужно инициалицировать
     * @param {Object} items
     * @returns {undefined}
     */
    this.initEditProductDropdownlist = function (element, items)
    {
        element.dropdownList({
            items: items,
            callback:{
                menuItemCreateCallback: function (item) {
                    return '<span class="editProduct" data-project_depot_id="' + item.id +
                            '" lang="' + item.product_id + '">' + item.title + '</span>';
                },
                afterItemAdd: function (index, item, itemDOM) {
                    var projects = this.container.data('projects') || [];
                    if (projects.length !== 0 && parseInt(projects[0]) > parseInt(item.id)) {
                        this.dropdownmenu.prepend(itemDOM);
                    }
                    projects.push(parseInt(item.id));
                    this.container.data('projects', projects);
                },
                afterItemDelete: function (index, item) {
                    var projects = this.container.data('projects');
                    var projectIndex = projects.indexOf(parseInt(item.id));
                    if (projectIndex !== -1) {
                        projects.splice(projectIndex, 1);
                    }
                    this.container.data('projects', projects);
                }
            }
        });
    };

    /**
     * инициализация выпадающего списка с выбором склада для удаления товара
     * @param {jQuery} element - элемент, который нужно инициалицировать
     * @param {Object} items
     * @returns {undefined}
     */
    this.initDeleteProductDropdownlist = function (element, items) {
        element.dropdownList({
            items: items,
            callback:{
                menuItemCreateCallback: function (item) {
                    var langdata = this.container.find('.dropdown-toggle_btn').attr('lang');
                    return '<span lang="' + langdata + '" data-project_depot_id="' + item.id + '">' + item.title + '</span>';
                },
                afterItemAdd: function (index, item, itemDOM) {
                    var projects = this.container.data('projects') || [];
                    if (projects.length !== 0 && parseInt(projects[0]) > parseInt(item.id)) {
                        this.dropdownmenu.prepend(itemDOM);
                    }
                    projects.push(parseInt(item.id));
                    this.container.data('projects', projects);
                },
                onItemClick: function (event, dropdownlist) {
                    var index = $(this).data('id');

                    if ($(this).children().first().data('project_depot_id') > 0) {
                        claim.blockFormMode.setRemote();
                    } else {
                        claim.blockFormMode.setLocal();
                    }

                    claim.showAhtung(
                        claim.uncompresData($(this).children().first().attr('lang')),
                        function (data) {
                            claim._deleteClaimProduct(data, true).then(
                                function (result) {
                                    if (result) {
                                        dropdownlist.deleteItem(index);
                                    }
                                    return result;
                                }, function () {
                                    return false;
                                }
                            );
                        }
                    );
                },
                afterItemDelete: function (index, item) {
                    var projects = this.container.data('projects');
                    var projectIndex = projects.indexOf(parseInt(item.id));
                    if (projectIndex !== -1) {
                        projects.splice(projectIndex, 1);
                    }
                    this.container.data('projects', projects);

                    var editdropdown =  $('.js-dropdown.js-dropdownlist-' + item.product_id);
                    if (editdropdown.length) {
                        editdropdown.data('dropdownlist').deleteItem(index);
                    }
                }
            }
        });
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
        const claimId = this.id;

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
})();

window.onload = function () {
    if (typeof(tinyMCE) !== "undefined" && tinymce.get('claim_annotation')) {
        tinyMCE.get('claim_annotation').on('keyup', function(ed,e){
            if ($('tr[data-field-name="out/annotation"]').hasClass('errorContent')) {
                $('tr[data-field-name="out/annotation"]').removeClass('errorContent');
                $('h2.errorOutContetnMessage').remove();
            }
        });
    }
}

window.onbeforeunload = function() {
    var restore = parseInt(window.location.pathname.replace(/[^\d]/g, ''));
    window.incomeoutUnloadData = {};
    window.incomeoutUnloadData.cid = claim.element('claim[id]').value;
    claim.onunload = ((isNaN(restore) || !restore) ? 1 : 0);
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
            url      : linkPrefix + '/claim/out/dropclaims',
            cache    : false,
            data     : { claimId : window.incomeoutUnloadData.cid },
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
            data     : {claimId : window.incomeoutUnloadData.cid},
            type     : 'POST',
            dataType : 'html',
            async    : false,
            success  : function(data){}
        });
    }
};

function buildFormD() {
    var x,y;
    var YY = 0;
    if(window.innerWidth) {
            x = window.innerWidth;
            YY = window.pageYOffset;
    }else {
            with(document.body) {
                    x = clientWidth;
                    YY = scrollTop;
            }
    }
    y = document.body.scrollHeight;
    if(!$.browser.msie) {
            x = x - 16;
    }
    var width = x + 'px';
    var height = y + 156 + 'px';

    //var coords = getPageSize();
    var fTop = YY + 100 + 'px';
    //var fLeft = (parseInt((coords[2] / 2)) - 500) + 'px';


    var fullDiv = document.createElement('div');
    $(fullDiv).attr({
                                    id: 'fullDiv'
                                    })
                            .css({
                                    display: 'none',
                                    position: 'absolute',
                                    top: '0px',
                                    left: '0px',
                                    width: width,
                                    height: height,
                                    border: '0px solid green',
                                    //background: '#333232',
                                    //opacity: 0.9,
                                    background: 'url("/img/formOverlay.png")',
                                    padding: '56px 0px 0px 0px',
                                    zIndex: 999
                                    });

    var table = document.createElement('table');
    $(table).attr({
                                    id: 'prevTable'
                                    })
                            .css({
                                    width: '100%',
                                    position: 'absolute',
                                    top: fTop
                                    });
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    $(td).attr('align', 'center')
                    .css({
                            width: '100%',
                            border: '0px solid red'
                            });

    // Большой общий див
    var bigPrevDiv = document.createElement('div');
    $(bigPrevDiv).attr({
                                    id: 'bigPrevDiv'
                                    })
                            .css({
                                    width: '1078px',
                                    border: '0px solid red'
                                    });

    // маленький левый div
    var leftDiv = document.createElement('div');
    $(leftDiv).css({
                                    width: '26px'
                                    }).css('float', 'left');
    $(leftDiv).html('<img src="/img/1x1.gif" width="26" height="1" border="0">');

    // маленький правый div с кнопкой закрыть
    var rightCloseDiv = document.createElement('div');
    $(rightCloseDiv).css({
                                    width: '26px',
                                    cursor: 'pointer'
                                    }).css('float', 'left');
    $(rightCloseDiv).html('<img src="/img/closePreview.png" width="32" height="32" border="0" alt="закрыть" title="закрыть">');


    var predPreviewDiv = document.createElement('div');
    $(predPreviewDiv).attr({
                                            id: 'predPreviewDiv'
                                            })
                            .css({
                                    width: '1020px',
                                    //height: '555px',
                                    //margin: '10px 15px 10px 15px',
                                    border: '1px solid #000',
                                    background: '#F3F5F8'
                                    //overflow: 'hidden'
                                    })
                                    .css('float', 'left')
                                    //.css('overflowY', 'scroll');

    var fieldsForm = document.createElement('div');
    $(fieldsForm).attr({
                                            id: 'fieldsForm'
                                            })
                            .css({
                                    width: '1010px',
                                    //height: '100px',
                                    display: 'none',
                                    margin: '5px 0px 0px 0px',
                                    border: '0px solid red',
                                    background: '#F3F5F8'
                                    });
    //$(fieldsForm).html('<br><img src="/img/ld/ld2.gif" border="0">');

    var previewDiv = document.createElement('div');
    $(previewDiv).attr({
                                            id: 'previewDiv'
                                            })
                            .css({
                                    width: '1010px',
                                    height: '100px',
                                    margin: '5px 0px 5px 0px',
                                    textAlign: 'center'
                                    })
    $(previewDiv).html('<br><br><img src="/img/ld/ld3.gif" border="0">');

    $(predPreviewDiv).append(fieldsForm).append(previewDiv);

    $(bigPrevDiv).append(leftDiv).append(predPreviewDiv).append(rightCloseDiv);

    $(table).append($(tr).append($(td).append(bigPrevDiv)));
    $('body').append($(fullDiv).append(table));
    $(fullDiv).show();

    $(rightCloseDiv).bind('click', closeFullDiv);
}

$(function () {
    // При изменении значения, делается задержку на 300 милисекунд, после чего выдается сообщение
    // Задержка нужна для того, чтобы запрет печати на странице работал корректно.
    // Если выдавать сообщение перед return false при нажатии на ctrl+p, печать будет работать.
    $('#printEvent').live('change', function () {
        setTimeout(function () {
            if ($('#printEvent').val() == 1) {
                alert("Невозможно распечатать");
                $('#printEvent').val(0);
            }
        }, 300);
    });
});

// запрет на печать
$(document).on('keydown', function ( e ) {
    if (e.ctrlKey && String.fromCharCode(e.which).toLowerCase() === 'p') {
        $('#printEvent').val(1).change();
        return false;
    }
});
