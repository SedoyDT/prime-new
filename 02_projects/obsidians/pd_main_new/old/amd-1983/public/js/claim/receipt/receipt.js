var Claim = new (function(){
    // фильтр по менеджерам
    this.filterMananeger = null;
    // фильтр по переработчикам
    this.filterClient = null;
    // блок товаров
    this.products = null;
    // id claim
    this.claimId = null;
    // список машин
    this.filterCar = null;
    // инфа о блокировке
    this.userBlockInfo = false;
    // заявка на статусе создания
    this.isCreateStatus = false;
    // описание шапки грида шаблонов
    this.headGridConfig = null;
    // флаг блокировки обновления фото товаров
    this.disabledUpdatePhoto = false;
    // типы списания товаров(шт/кг)
    this.accountTypes = {};

    //инициализация
    this.start = function()
    {
        var _self = this;
        this.showBlockClaimInfo();
        // ид заявки
        this.claimId = $('input[name="claim[id]"]').val();
        // фильтр по менеджерам
        this.filterMananeger = new selectFilter({
            filterId : '#claim_manager_filter',
            selectId : '#claim_manager'
        });
        // фильтр по переработчикам
        this.filterClient = new selectFilter({
            filterId : '#claim_client_filter',
            selectId : '#claim_client'
        });
        this.filterClient.onChange = function()
        {
            _self.changeClient();
        };
        // выбор даты
        $('#claim_date').datepicker({
            duration : 'fast',
            showAnim : 'fadeIn'
        });
        // блок товаров
        this.products = new Product({
            blockId                    : '#products',
            claimId                    : this.claimId,
            headGridConfig             : this.headGridConfig,
            disabledUpdatePhoto        : this.disabledUpdatePhoto,
            onClaimProductApplyCallback: this.onClaimProductApplyCallback,
        });

        // фильтр по машинам
        this.filterCar = new selectFilter({
            filterId : '#claim_carNumber_filter',
            selectId : '#claim_carNumber'
        });

        this.filterCar.filter = function(text)
        {
            var val = $(this.selectId).val();
            var newValue;
            var options = $(this.selectId).prop('options');
            if (!options) {
                return;
            }
            options.length = 0;
            text = text.toLowerCase();
            $.each(this.listValues, function(i, data){
                if (text && data.t.indexOf(text) == -1) {
                    return;
                }
                if (typeof newValue == 'undefined') {
                    newValue = data.v;
                }
                var option = new Option(data.t, data.v);
                option.lang = data.lang;
                options[options.length] = option;
            });
            if (!options.length) {
                newValue = this.listValues[0].v;
                var option = new Option(this.listValues[0].t, this.listValues[0].v);
                option.lang = this.listValues[0].lang;
                options[0] = option;
            }
            $(this.selectId).val(newValue);
        };
        this.filterCar.onChange = function()
        {
            var id = this.getValue();
            $('input[name="claim[driverName]"]').val('');
            $('input[name="claim[driverPhone]"]').val('');
            $.each(this.listValues, function(i, val){
                if (val.id != id) {
                    return;
                }
                $('input[name="claim[driverName]"]').val(val.name);
                $('input[name="claim[driverPhone]"]').val(val.phone);
            });
        };

        $('#btn_close').click(function(){
            window.close();
        });
        $('#btn_save').click(function(){
            _self.save(false);
        });
        if (!this.isCreateStatus
            || !$('input[data-action="finance-support-show"]').length
            || $('input[data-action="finance-support-show"]').prop('disabled')
        ) {
            $('#btn_send').click(function(){
                _self.save(true);
            });
        }

        //Кнопка отправить + поставка
        $('#btn-send-supply').click(function()
        {
            _self.createSupply();
        });

        $('#exportExcel').click(function(){
            $(this).parent().find('a').remove();
            exportToExcel(_self.claimId);
        });
        $('#btn_cascade').click(function(){
            _self.save(true);
        });

        // Установить декораторы
        $('.floatInput').fieldDecorator({ decorator: 'summ' });

        this.dataContainer = new DataContainer();
        this.eventBus = new EventBus();

        if (window.DepotIndex) {
            this.depotIndex = new DepotIndex({
                preset: 'claim',
                eventBus: this.eventBus,
            });
        }

        if (window.Dispatcher) {
            let DispatcherReceipt = (function (_super) {
                function DispatcherReceipt() {
                    _super.apply(this, arguments);
                }

                DispatcherReceipt.prototype = Object.create(Dispatcher.prototype);
                DispatcherReceipt.prototype.constructor = Dispatcher;

                DispatcherReceipt.prototype.updateCarList = function ()
                {
                    _super.prototype.updateCarList.apply(this, arguments);
                    let car = _self.filterCar.getValue();
                    _self.filterCar.setList(Object.values(_self.dataContainer.get('carList')), 'carNumber', 'id');
                    _self.filterCar.setValue(car, true);

                    return this;
                };

                return DispatcherReceipt;
            })(Dispatcher);

            this.dispatcher = new DispatcherReceipt({
                preset: 'claim',
                dataContainer: this.dataContainer,
                eventBus: this.eventBus,
                updateCarListActionUrl: '/claim/receipt/get-dispatcher-drivers/',
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
                eventBus: this.eventBus,
            });
        }

        if (window.Dimensions) {
            new Dimensions({
                preset: 'claim'
            });
        }

        if (window.CarProxy) {
            new CarProxy({
                preset: 'claim'
            })
        }

        this.previousClientId = this.getClientId();
    };

    /**
     * Получить id заявки
     * @returns {string}
     */
    this.getClaimId = function ()
    {
        return this.claimId;
    };


    /**
     * Получить тип заявки
     * @returns {Number}
     */
    this.getClaimType = function ()
    {
        return 12;
    };


    /**
     * Получить дату исполнения заявки
     * @returns {String}
     */
    this.getDate = function ()
    {
        var inputValue = $('#claim_date').val();

        return  undefined === inputValue ? this.claimData.date : inputValue;
    };


    /**
     * Получить строки с данными товаров
     * @returns {jQuery}
     */
    this.getProductRows = function()
    {
        return $('#products').find('tr[type="product"]');
    };


    /**
     * Алиас для названия товара
     * @param v
     * @param cnt
     * @param rowData
     * @return {*}
     */
    this.aliace = function(v, cnt, rowData)
    {
        if (typeof Claim.productMeasureTypeHint === 'undefined' && typeof ProductMeasureTypeHint !== 'undefined') {
            Claim.productMeasureTypeHint = new ProductMeasureTypeHint()
        }

        let title = `
            <span>` + v + `</span>
        `;

        // Если есть Примечание отдела закупок, то при наличии прав -  показать иконку
        if (rowData.annotationIn) {
            let options = {
                htmlPatternName : 'iconAnnotationBrown',
                annotation      : rowData.annotationIn,
                headerName      : 'annotationIn',
                useInlineWrapper: 1
            };

            title = `<div class="text-align_right">` + depot_tooltip.init(options).getTooltip(title) + `</div>`;
        }

        return Claim.productMeasureTypeHint.prependHint(rowData.type, title);
    };


    // id client
    this.getClient = function()
    {
        return this.filterClient.getValue();
    };

    // изменение переработчика - переблокировка товаров
    this.changeClient = function()
    {
        var time = $('#claim_client option:selected').attr('lang');
        $('#claim-work-time').html('<span style="font-size: 10pt; font-weight: bold;">Время работы : </span>' + time);
        var _self = this;
        this.products.blockEvent();
        $.ajax({
            url      : '/claim/receipt/changeclient',
            cache    : false,
            data     : {claimId : this.claimId, clientId : this.getClient()},
            type     : 'POST',
            dataType : 'json',
            success  : function(data)
            {
                if (data.ok) {
                    _self.previousClientId = _self.getClientId();
                    _self.products.update();

                    if (window.dealWageForm) {
                        window.dealWageForm.setCurrentClientId(_self.getClient());
                    }
                } else {
                    // если ошибка, то возвращаем прежнего клиента
                    _self.filterClient.setValue(_self.previousClientId);
                    console.error(data.message);
                    alert(`Произошла ошибка! Значение клиента восстановлено.`);
                }
                return;
            },
            error    : function(o)
            {
                // если ошибка, то возвращаем прежнего клиента
                _self.filterClient.setValue(_self.previousClientId);
                _self.showError(o.responseText, 'Ошибка!');
            }
        });
    };

    // показать предупреждения
    this.showError = function(msg, title)
    {
        var _self = this;
        this.overleyWarning = new Overley();
        this.overleyWarning.msg = msg;
        this.overleyWarning.title = title;
        this.overleyWarning.onAfterCreate = function()
        {
            var html = '<div type="data" style="padding:10px; min-width:400px; text-align:center; overflow:auto;">';
            html += this.msg;
            html += '</div>';
            html += '<div type="btn" style="padding:5px; text-align:right;">';
            html += '<input type="button" value="Закрыть" style="width:100px" />';
            html += '</div>';
            var area = this.getArea();
            $(area).html(html).find('input[value="Закрыть"]').click(function(){
                _self.overleyWarning.close();
            });
            this.toCenter();
            var h = parseInt(area.style.maxHeight) - $(area).find('div[type="btn"]')[0].offsetHeight - 20;
            $(area).find('div[type="data"]').css({'max-height': h + 'px'});
            this.toCenter();
        };
        this.overleyWarning.onAfterClose = function()
        {
            delete(_self.overleyWarning);
        };
        this.overleyWarning.create().toCenter();
    };

    // Окно подтверждения создания заявки на поставку по товарам в овердрафте
    this.confirmSupplyWindow = function(depotIndex, data)
    {
        //список блокировок по сырью в овердрафте
        var items = data.data.blocks;

        //Получение кг/шт для сырья
        var getItemMeasure = function(item)
        {
            if (item.itemType == 2) {
                return 'кг.';
            }

            if (item.itemType == 1) {
                return 'шт.';
            }
        }

        //Получение кг/шт для овердрафта
        var getOverdraftMeasure = function(item)
        {
            if (item.itemType == 2) {
                return 'кг.';
            }

            if (item.itemType == 1 && item.accountType == 1) {
                return 'шт.';
            }

            if (item.itemType == 1 && item.accountType == 2) {
                return 'кг.';
            }
        }

        var notFullAmount = [];
        //Шаблон окна
        var html = '<section><form>';
        html += '<header><h1>Блокировка товаров для поставки</h1></header>';
        html += '<div style="padding:0 5px 0 5px;"><table class="table-std margin-10">';
        html += '<thead>';
        html += '<tr><th>ID сырья</th><th>Овердрафт</th><th>Заблокировано кг/шт</th><th>Заблокировано упаковок</th></tr>';
        html += '</thead>';
        html += '<tbody>';
        items.forEach(function(item, data)
        {
            var style = item.fullAmount ? '' : " style='background-color: rgb(247, 208, 208)!important;'";
            !item.fullAmount && notFullAmount.push(item.itemId);
            html += '<tr' + style + '><td>' + item.itemId + '</td><td>' + item.overdraft + getOverdraftMeasure(item) + '</td><td>' + item.amount + getItemMeasure(item) + '</td><td>' + item.boxes + '</td></tr>';
        });
        html += '</tbody>';
        html += '</table>';
        (notFullAmount.length > 0) && (html += '<p>Недостаточное кол-во товара на складе для погашения овердрафта по сырью с ID: ' + notFullAmount.join(', ') + '</p>');
        html += '</div>'
        html += '<footer>';
        html += '<input type="button" value="Создать поставку" data-form-button="submit" />&nbsp';
        html += '<input type="button" value="Отменить" data-form-button="hide" />';
        html += '</footer></form></section>';

        // Создание формы
        var supplyConfirmForm = new AjaxForm(html, {
            width: 500,
            style: 'strict',
            destroyOnHide: true,
            hideOnEscape: true,
            disableAjaxHandler: true,
            postBuildCallback: function(form) {
                form.submit = function()
                {
                    $('input[name="claim[createSupply]"]').val(1);
                    $('input[name="claim[supply][depotIndex]"]').val(depotIndex);
                    $('#btn_send').click();
                    form.hide();
                }
            }
        });
        supplyConfirmForm.show();
        return;
    }


    /**
     * Метод выполняет проверку правильности заполнения формы
     *
     * @returns {boolean}
     */
    this.checkForm = function () {
        var self = this;

        if (!this.products.checkPercentOff()) {
            return false;
        }

        var errors = [];

        if (!this.products.validateDepotDetailedManager()) {
            errors.push(' - проверьте правильность блокировки секций под менеджеров');
        }

        // Валидация привязанных планов производства
        if(!Receiptplan.checkClaimForm()) {
            errors.push(Receiptplan.getErrorMessage());
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

        if (window.directoWageChecker
            && !window.directoWageChecker.check($('input[name="claim[id]"]').val(), $('input[name="claim[date]"]').val())
        ) {
            return false;
        }

        return true;
    };


    /**
     * Каскад + удаление
     * @param params
     */
    this.sendToCascade = function(params)
    {
        console.log('sendToCascade');
        let deleteOnCascade = params && params.hasOwnProperty('deleteOnCascade')
            ? parseInt(params.deleteOnCascade)
            : 0;

        if (deleteOnCascade === 1) {
            let deleteOnCascadeField = $('[name="deleteOnCascade"]').val(params.deleteOnCascade);

            if (!parseInt(deleteOnCascadeField.val())) {
                alert('Не удалось установить флаг удаления!');
            }
        }

        this.save(true);
    };


    // сохранение заявки
    this.info = function(check)
    {
        if (!this.checkForm()) {
            return false;
        }

        var _self = this;

        if (typeof(tinyMCE) !== "undefined" && tinymce.get('claim_annotation')) {
            if (tinyMCE.get('claim_annotation').getContent()) {
                $('textarea[name="claim[annotation]"]').val(tinyMCE.get('claim_annotation').getContent());
            }
        }
        if (typeof(tinyMCE) !== "undefined" && tinymce.get('claim_annotation_dispatcher')) {
            if (tinyMCE.get('claim_annotation_dispatcher').getContent()) {
                $('textarea[name="claim[annotationDispatcher]"]').val(tinyMCE.get('claim_annotation_dispatcher').getContent());
            }
        }
        $('input[name="accept"]').val(0);
        $('input[name="changeStatusAvailable"]').val((check ? 1 : 0));

        // проверка заполненности названия в дополнительных товарах
        if(typeof productsExtra != 'undefined') {
            var checkProductsExtra = productsExtra.checkProductsExtra();
            if (checkProductsExtra != "") {
                _self.showError(checkProductsExtra);
                return;
            }
        }

        this.products.showLoader('Проверка данных ...');
        var data = $('#claim-form').serialize();

        $.ajax({
            url      : linkPrefix + '/claim/receipt/checkdata',
            cache    : false,
            data     : data,
            type     : 'POST',
            async    : true,
            dataType : 'json',
            success  : function(data)
            {
                _self.products.hideLoader();
                if (!data.error)
                {
                    _self.products.showLoader('Сохранение ...');
                    $('input[name="accept"]').val(1);
                    window.onunload = function(){};
                    $('#claim-form').submit();
                } else {
                    if (data.reason === 'reload') {
                        // Если необходима перезагрузка форм (детализации по секциям)
                        for (var ddId in data.data) {
                            if (ddId in _self.products.depotDetailedManagerTransferForms) {
                                /** @type {Claim_Receipt_Product_DepotDetailedManager_Transfer_Form} */
                                var depotDetailedManagerTransferForm = _self.products.depotDetailedManagerTransferForms[ddId];

                                depotDetailedManagerTransferForm.reloadState($.extend(data.data[ddId], {
                                    initialFormDataIsChanged: true
                                }), function () {
                                    depotDetailedManagerTransferForm.update('reload');

                                    // Обязательно сохраняем новое состояние
                                    depotDetailedManagerTransferForm.saveCurrentState();
                                });

                                // Информируем пользователя о необходимости проверки формы
                                _self.products.addSectionTrError(depotDetailedManagerTransferForm.getBindedSectionTr(), 'На сервере произошли изменения. Ознакомьтесь с изменениями, сделайте необходимые правки и повторите отправку формы');
                            }
                        }
                    }
                    $('input[name="claim[createSupply]"]').val(0);
                    _self.showError('<div align="left" style="color:red;">' + data.error.join('<br>') + '</div>', 'Ошибка!');
                }
            },
            error    : function(o)
            {
                $('input[name="claim[createSupply]"]').val(0);
                _self.products.hideLoader();
                _self.showError(o.responseText, 'Ошибка!');
            }
        });
    };

    /**
     * создание поставки для сырья в овердрафте
     * @returns {null}
     */
    this.createSupply = function()
    {
        var rows = $('tbody.table_products_tbody tr[type="item"][overdraft="yes"]');
        var self = this;

        if (rows.length <= 0) {
            alert('Отсутствует овердрафт по сырью');
            $('input[name="createSupply"]').val(0);
            return;
        }

        // Создание формы
        var supplyConfirmForm = new AjaxForm(
            `
                <section>
                    <form>
                        <input type="hidden" name="claimId">
                        <header>
                            <h1>Создать поставку со склада:</h1>
                        </header>
                        <div style="padding: 10px; margin-top: -10px">
                            <select name="depotIndex" style="width: 100%; box-sizing: border-box">
                                <option value="">выбрать</option>
                                ${self.depotList.list.map(depot => `<option value="${depot.id}">${depot.title}</option>`).join('')}
                            </select>
                        </div>
                        <footer>
                            <input type="button" value="Создать поставку" data-form-button="submit">&nbsp;
                            <input type="button" value="Отменить" data-form-button="hide">
                        </footer>
                    </form>
                </section>
            `,
            {
                width             : 300,
                style             : 'strict',
                destroyOnHide     : true,
                hideOnEscape      : true,
                disableAjaxHandler: true,
                postBuildCallback : function (form)
                {
                    form.validation.append(function ()
                    {
                        if (!form.getElementByName('depotIndex').val()) {
                            return 'Укажите склад';
                        }

                        return true;
                    });
                    form.submit = function ()
                    {
                        const depotIndex = form.getElementByName('depotIndex').val();
                        if (!form.validate()) {
                            return;
                        }

                        form.hide();

                        self.products.showLoader('Проверка наличия сырья для поставки...');
                        $.ajax({
                            url    : linkPrefix + '/claim/receipt/createsupply',
                            data   : {
                                claimId: self.claimId,
                                depotIndex,
                            },
                            success: function (data)
                            {
                                self.products.hideLoader();
                                //Вывод информации о заявке в окне
                                self.confirmSupplyWindow(depotIndex, JSON.parse(data));
                            },
                            error  : function ()
                            {
                                self.products.hideLoader();
                                alert("Ошибка при создании заявки на поставку");
                            }
                        });
                    }
                }
            }
        );
        supplyConfirmForm.show();
    };

    this.checkFormAsync = function(options)
    {
        var _self = this;

        if (!this.products.checkPercentOff()) {
            options.error();
            return false;
        }

        // Валидация привязанных планов производства
        if (!Receiptplan.checkClaimForm()) {
            options.error();
            _self.showError('<div align="left" style="color:red;">' + Receiptplan.getErrorMessage() + '</div>', 'Ошибка!');
            return false;
        }
        $('input[name="changeStatusAvailable"]').val((options.nextStatus ? 1 : 0));
        $.ajax({
            url      : linkPrefix + '/claim/receipt/checkdata',
            cache    : false,
            data     : $('#claim-form').serialize(),
            type     : 'POST',
            async    : true,
            dataType : 'json',
            success  : function(data)
            {
                if (!data.error){
                    $('input[name="accept"]').val(1);
                    options.done();
                } else {
                    $('input[name="changeStatusAvailable"]').val(0);
                    options.error();
                    _self.showError('<div align="left" style="color:red;">' + data.error.join('<br>') + '</div>', 'Ошибка!');
                }
            },
            error    : function(o)
            {
                $('input[name="changeStatusAvailable"]').val(0);
                options.error();
                _self.showError('<div align="left" style="color:red;">' + data.error.join('<br>') + '</div>', 'Ошибка!');
            }
        });
    };

    //отображение инфы о заблокировавшем юзвере
    this.showBlockClaimInfo = function()
    {
        if (!this.userBlockInfo) {
            return;
        }
        var html = '<div id="block_info_html" style="position:fixed; top:10px; right:10px; padding:15px; border:1px solid gray; background:rgba(0, 0, 0, 0.5); color:white; border-radius:15px;">'
        + '<h3>Заявка ' + this.userBlockInfo.params.task + ' заблокирована </h3>'
        + 'пользователь : ' + this.userBlockInfo.params.user + '<br>'
        + 'время блокировки : ' + this.userBlockInfo.params.time +' <br>'
        + '</div>';
        $(document.body).append(html);
    };


    /**
     * Метод возвращает текущие данные по заявке
     *
     * @returns {Claim.claimData}
     */
    this.getClaimData = function () { return this.claimData; };


    /**
     * Метод возвращает jQuery-объект списка выбора клиента
     *
     * @returns {jQuery}
     */
    this.getClientIdInput = function()
    {
        return $('select[name="claim[clientId]"]');
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
     * представительские расходы
     */
    this.kickback = {
        parent : this,
        change : function (obj)
        {
            if (parseInt(obj.value)) {
                $('#kickback').css('display', '');

                // if (this.parent.node('kickback')) {
                //     this.parent.node('kickback').style.display = '';
                // }
                $('[name="claim[kickback]"]').removeAttr('disabled');
                // if (this.parent.node(this.parent.formId)['claim[kickback]']) {
                //     this.parent.node(this.parent.formId)['claim[kickback]'].disabled = false;
                // }
            } else {
                $('#kickback').css('display', 'none');
                $('[name="claim[kickback]"]').attr('disabled', 'disabled');
                // if (this.parent.node('kickback')) {
                //     this.parent.node('kickback').style.display = 'none';
                // }
                // if (this.parent.node(this.parent.formId)['claim[kickback]']) {
                //     this.parent.node(this.parent.formId)['claim[kickback]'].disabled = true;
                // }
            }
        },
        oninput: function (obj)
        {
            obj.value = obj.value.replace(/[,]/g, '.');
            if (!/^\d+(\.(\d*))?$/.test(obj.value)) {
                let  a = parseFloat(obj.value)||0;
                obj.value = Math.abs(Math.round(100000 * a)/100000);
            }
            obj.value = obj.value.replace(/^0+/, '');
        }
    };

    /**
     * Callback для обновления значения поля "склад" при прикреплении товаров к заявке
     */
    this.onClaimProductApplyCallback = () =>
    {
        this.depotIndex.setDepotId(this.products.getDepotId());
    }
});

// объект филтра
var selectFilter = function(param)
{
    // поле ввода патерна
    this.filterId = '';
    // селект для выбора
    this.selectId = '';
    // список начальных данных
    this.listValues = [];

    // инициализация
    this.init = function()
    {
        var _self = this;
        try {
            $(this.selectId+'>option').each(function(i, node){
                _self.listValues.push({t:node.text, v:node.value, lang:node.lang, s : node.text.toLowerCase()});
            });
            $(this.filterId)[0].oninput = function(){
                _self.filter(this.value);
            };
            $(this.filterId)[0].onblur = function(){
                if (this.data != $(_self.selectId).val()) {
                    setTimeout(function(){_self._onChange();}, 0);
                }
            };
            $(this.filterId)[0].onfocus = function(){
                this.data = $(_self.selectId).val();
            };
            $(this.selectId)[0].onchange = function(){
                setTimeout(function(){_self._onChange();}, 0);
            };
        } catch(e){
            return false;
        }
        return true;
    };

    // фильтрация значений для выбора
    this.filter = function(text)
    {
        var val = $(this.selectId).val();
        var newValue;
        var options = $(this.selectId).prop('options');
        if (!options) {
            return;
        }
        options.length = 0;
        text = text.toLowerCase();
        $.each(this.listValues, function(i, data){
            if (text && data.s.indexOf(text) == -1) {
                return;
            }
            if (typeof newValue == 'undefined') {
                newValue = data.v;
            }
            var option = new Option(data.t, data.v);
            option.lang = data.lang;
            options[options.length] = option;
        });
        if (!options.length) {
            newValue = this.listValues[0].v;
            var option = new Option(this.listValues[0].t, this.listValues[0].v);
            option.lang = this.listValues[0].lang;
            options[0] = option;
        }
        $(this.selectId).val(newValue);
    };

    // закрытие
    this.close = function()
    {
        $(this.selectId).off('change');
        $(this.filterId).oninput = function(){};
    };

    // событие при изменении значения селекта
    this._onChange = function()
    {
        $(this.selectId).attr('disabled',true);
        this.onChange();
        $(this.selectId).attr('disabled',false);
    };

    // событие при изменении значения селекта
    this.onChange = function()
    {};

    // очистка списка значений
    this.cliearList = function()
    {
        this.listValues.length = 0;
    };

    // установка нового списка значений
    /**
     *
     * @param data список со значениями
     * @param t - title для значения
     * @param v - value для значения
     */
    this.setList = function(data, t, v)
    {
        if (t && v) {
            $.each(data, function(i, o){
                o.t = o[t];
                o.v = o[v];
                o.s = o[v].toLowerCase();
            })
        }
        this.listValues = data;
        this.filter('');
    };

    // получить значение
    this.getValue = function()
    {
        return $(this.selectId).val();
    };

    // установить значение
    this.setValue = function(val, event)
    {
        $(this.selectId).val(val);
        if (event) {
            this._onChange();
        }
        return this;
    };

    for(var i in param){
        this[i] = param[i];
    }

    this.init();
};

/**
 * управление товарами
 * @param param
 * @constructor
 * @property onClaimProductApplyCallback {callback}
 * @property $ctrl {ReceiptController}
 */
var Product = function(param)
{
    this.claimId = '';
    this.blockId = ''; // #products
    this.tplLoad = '';
    this.lastFocusName = '';
    // описание шапки грида шаблонов
    this.headGridConfig = null;
    // флаг блокировки обновления фото товаров
    this.disabledUpdatePhoto = false;

    // корректировка вводимых значений
    this.controlNumberValue = function(node, minValue, maxValue)
    {
        if (node.value == '') {
            return;
        }
        if (/^\-?\d+(\.(\d+)?)?$/.test(node.value)) {
            if (/^\-?\d+(\.(\d+)?)?$/.test(minValue) && minValue > node.value) {
                node.value = minValue;
            }
            if (/^\-?\d+(\.(\d+)?)?$/.test(maxValue) && maxValue < node.value) {
                node.value = maxValue;
            }
            return;
        }
        node.value = node.value.replace(/\,/g, '.').replace(/[^\-\d\.]/g, '');
        if (/^\-\./.test(node.value)) {
            var tmp = (parseFloat(node.value)||'-0');
            if (/^\-?\d+(\.(\d+)?)?$/.test(minValue) && minValue >= 0){
                tmp = String(tmp).replace(/^\-/, '');
            }
        }
        else if (/^\-/.test(node.value)) {
            var tmp = (parseFloat(node.value)||'-');
            if (/^\-?\d+(\.(\d+)?)?$/.test(minValue) && minValue >= 0){
                tmp = String(tmp).replace(/^\-/, '');
            }
        } else {
            var tmp = (parseFloat(node.value)||'0');
        }
        node.value = (node.value ? tmp : '') + (/\.$/.test(node.value) ? '.' : '');
    };

    // инициализация
    this.init = function()
    {
        var _self = this;
        this.tplLoad = '<div align="center"><img src="' + linkPrefix + '/img/ld/ld3.gif" style="margin:30px 150px;" /></div>';
        this.tplLoad2 = '<div id="product-block" tabindex="0" align="center"><span style="line-height:normal;"><h1>Сохранение</h1><br><img src="' + linkPrefix + '/img/ld/ld3.gif" style="margin:30px 150px;" /><span></div>';

        $('span[action="manager_tpls"]').click(function(){
            window.open('/analitics/receipttemplates');
        });

        $('span[action="templates"]').click(function(){
            _self.showTemplates();
        });

        $('#claim-form').on('click', '.js-use-template', function () {
            _self.showTemplates($(this).data('product-id'), $(this).data('product-number'));
            return false;
        });

        $('span[data-action="add_sections"]').click(function ()
        {
            var section = $('.add_sections__input').val() || "";
            _self.addFirstSections(section);
        });
        this.updateEvents();
        this.ctrlSectionWeightAmount();

        this.initDdmEdit();
    };

    // добавление/обновление событий
    this.updateEvents = function()
    {
        var _self = this;

        $("#products").tableNavigatorPlugin(
            "ifEnabled",
            pluginApi => {
                let position = pluginApi.getCurPosition();
                pluginApi.rereadRows();
                pluginApi.trySetPointer(position);
            },
            pluginApi => pluginApi.init()
        );

        $(this.blockId).find('input[type="text"]').prop({'readonly':false});
        $(this.blockId).find('img[action]').off('click');
        $(this.blockId).find('input[type="button"][action]').off('click');
        $(this.blockId).find('input[type="checkbox"][action]').off('change');
        $(this.blockId).find('span[action="show_info"]').each(function(i, node){
            node.style.cursor = 'pointer';
            node.style.textDecoration = 'underline';
            if ($(node).parent().parent().attr('type') == 'item') {
                node.onclick = function()
                {
                    var pnumber = $(this).parent().parent().attr('pnumber');
                    var inumber = $(this).parent().parent().attr('inumber')
                    _self.itemInfo($(this).attr('data-id'), inumber, pnumber);
                };
                return;
            }
            if ($(node).parent().parent().attr('type') == 'product') {
                node.onclick = function()
                {
                    // Текст примечания отдела закупок
                    var annotationIn = $(this).siblings('div.depotTooltipContainer').find('div#tooltipBody').html();
                    _self.productInfo({id : $(this).attr('data-id'), title:$(this).html(), annotationIn : annotationIn});
                };
            }
        });

        $(this.blockId).find('input[type="text"]').each(function(i, node){
            node.oninput = function()
            {
                _self.inputValue(this);
            };
            node.onfocus = function()
            {
                _self.lastFocusName = this.name;
                this._value = this.value;
            };
            node.onblur  = function()
            {
                if (this._value != this.value) {
                    var oldVal = this._value;
                    this._value = this.value;
                    setTimeout(function(o){_self.autosave(o, oldVal);}, 0, this);
                }
            };
            node.onkeydown  = function(e)
            {
                if (e.keyCode == 13) {
                    var oldVal = this._value;
                    this._value = this.value;
                    setTimeout(function(o){_self.autosave(o, oldVal);}, 0, this);
                    return false;
                }
                if (e.keyCode == 27) {
                    this.value = this._value;
                    setTimeout(function(o){_self.inputValue(o); _self.onfocus();}, 0, this);
                    return false;
                }
                return 1;
            }
        });

        $(this.blockId).find('input[type="button"][action]').css({cursor:'pointer'})
        .on('click', function(){
            var pnumber = $(this).attr('pnumber');
            switch($(this).attr('action')){
                // items
                case 'add_item':
                    _self.addItem(pnumber, {accountType: Claim.accountTypes.weight});
                    break;
                case 'add_item_client':
                    _self.addItemClient(pnumber);
                    break;
                case 'add_quantity':
                    _self.addItem(pnumber, {accountType: Claim.accountTypes.quantity});
                    break;
                // sections
                case 'add_section':
                    _self.addSection(pnumber);
                    break;
                case 'exchange_overdraft':
                    var inumber = $(this).attr('inumber');
                    _self.exchangeOverdraft(pnumber, inumber);
                    break;
            }
        });

        $(this.blockId).find('img[action]').css({cursor:'pointer'})
        .on('click', function(){
            var pnumber = $(this).attr('pnumber');
            switch($(this).attr('action')){
                // products
                case 'edit_product':
                    _self.changeProduct(pnumber);
                    break;
                case 'drop_product':
                    _self.dropProduct(pnumber);
                    break;
                // items
                case 'drop_item':
                    var inumber = $(this).attr('inumber');
                    _self.dropItem(pnumber, inumber);
                    break;
                case 'edit_item':
                    var inumber = $(this).attr('inumber');
                    _self.changeItemBefore(pnumber, inumber, {accountType: Claim.accountTypes.weight});
                    break;
                case 'edit_item_quantity':
                    var inumber = $(this).attr('inumber');
                    _self.changeItemBefore(pnumber, inumber, {accountType: Claim.accountTypes.quantity});
                    break;
                // sections
                case 'drop_section':
                    var snumber = $(this).attr('snumber');
                    _self.dropSection(pnumber, snumber);
                    break;
                // defect
                case 'edit_defect':
                    var snumber = $(this).attr('snumber');
                    _self.changeDefectForm(pnumber, snumber);
                    break;
                case 'show_defect':
                    var snumber = $(this).attr('snumber');
                    _self.showDefect(pnumber, snumber);
                    break;
            }
        });

        $(this.blockId).find('input[type="checkbox"][action]').on('change', function(){
            var pnumber = $(this).attr('pnumber');
            switch($(this).attr('action')){
                case 'change_defect':
                    var snumber = $(this).attr('snumber');
                    _self.changeDefect(pnumber, snumber);
                    break;
                case 'without_overdraft':
                    var inumber = $(this).attr('inumber');
                    _self.changeWithoutOverdraft(pnumber, inumber);
                    break;
                case 'blockpercentoff':
                    var block = this.checked;
                    this.value = (block ? 1 : 0);
                    _self.autosave(this, '');
            }
        });

    };

    this.blockEvent = function()
    {
        $(this.blockId).find('input[type="text"]').prop({'readonly':true});
        $(this.blockId).find('img[action]').off('click');
        $(this.blockId).find('input[type="button"][action]').off('click');
        $(this.blockId).find('input[type="checkbox"][action]').off('change');
    };

    // обновление товаров
    this.update = function()
    {
        var _self = this;
        this.showLoader('Обновление товаров');
        this.sendQuery(
            '/claim/receipt/updateproduct',
            {claimId : this.claimId},
            function(html){
                $(_self.blockId).html(html);
                _self.updateEvents();
                _self.updatePhoto();
                _self.hideLoader();
                _self.ctrlSectionWeightAmount();
            },
            'html'
        );
    };

    // обновление фотографий
    this.updatePhoto = function()
    {
        if (this.disabledUpdatePhoto) {
            return;
        }
        var _self = this;
        $.ajax({
            url      : linkPrefix + '/claim/ajax/detailed-photo-list',
            cache    : false,
            data     : {claimId:this.claimId},
            type     : 'POST',
            dataType : 'json',
            success  : function(data){
                $('.detailed-photo-placeholder').hide();
                for (var n=0; n<data.records.length; n++) {
                    if (!data.records[n].photo.file.isUploaded) {
                        continue;
                    }
                    var pid = data.records[n].product.itemId;
                    var cid = data.records[n].product.claimId;
                    $('div[data-attr-item-id="' + pid + '"][data-attr-claim-id="' + cid + '"]').show();
                    var link = data.records[n].photo.link;
                    link.claimId = data.records[n].product.claimId;
                    link.itemId  = data.records[n].product.itemId;
                    (new DetailedPhotoManager()).enable(link);
                }
            },
            error    : function(){
                _self.disabledUpdatePhoto = true;
            }
        });

    };

    // показать лоадер
    this.showLoader = function(title)
    {
        var _self = this;
        this.overleyLoad = new Overley();
        this.overleyLoad.title = title;
        this.overleyLoad.onAfterCreate = function()
        {
            $(this.getArea()).html(_self.tplLoad);
            this.toCenter();
            this.closeable = false;
        };
        this.overleyLoad.onBeforeClose = function()
        {
            return this.closeable;
        };
        this.overleyLoad.onAfterClose = function()
        {
            delete(_self.overleyLoad);
        };
        this.overleyLoad.create().toCenter();
    };

    // скрыть лоадер
    this.hideLoader = function()
    {
        if (this.overleyLoad) {
            this.overleyLoad.closeable = true;
            this.overleyLoad.close();
        }
    };

    /**
     * запрос на сервер
     * @param {String} url - адрес дял запроса
     * @param {Object} data - данные для запроса
     * @param {Callback} callback - обработчик удачного вызова
     * @param {String} dataType - тип данных
     * @param {Callback} errorCallback - обработчик ошибки
     * @param {Boolean} async - асинхронный запрос или нет
     * @returns {JQueryXHR}
     */
    this.sendQuery = function(url, data, callback, dataType, errorCallback, async)
    {
        var _self = this;
        if (data && typeof data == 'object') {
            data.claimId = this.claimId;
        } else {
            data = {claimId : this.claimId};
        }
        if (typeof async == 'undefined') {
            async = true;
        }
        this.blockEvent();
        return $.ajax({
            url      : linkPrefix + url,
            cache    : false,
            data     : data,
            type     : 'POST',
            async    : async,
            dataType : (dataType||'json'),
            success  : function(data)
            {
                callback(data);
                _self.updatePhoto();
            },
            error    : function(o)
            {
                if (errorCallback) {
                    errorCallback(o.responseText);
                } else {
                    _self.showError(o.responseText, 'Ошибка!');
                }
            },
            complete: function()
            {
                _self.updateEvents();
            }
        });
    };

    // показать предупреждения
    this.showError = function(msg, title, callback)
    {
        var _self = this;
        this.overleyWarning = new Overley();
        this.overleyWarning.msg = msg;
        this.overleyWarning.title = title;
        this.overleyWarning.onAfterCreate = function()
        {
            var html = '<div type="data" style="padding:10px; min-width:400px; text-align:center; overflow:auto;">';
            html += this.msg;
            html += '</div>';
            html += '<div type="btn" style="padding:5px; text-align:right;">';
            html += '<input type="button" value="Закрыть" style="width:100px" />';
            html += '</div>';
            var area = this.getArea();
            $(area).html(html).find('input[value="Закрыть"]').click(function(){
                _self.overleyWarning.close();
            });
            this.toCenter();
            var h = parseInt(area.style.maxHeight) - $(area).find('div[type="btn"]')[0].offsetHeight - 20;
            $(area).find('div[type="data"]').css({'max-height': h + 'px'});
            this.toCenter();
        };
        this.overleyWarning.onAfterClose = function()
        {
            delete(_self.overleyWarning);
            if (typeof callback == 'function') {
                callback();
            }
        };
        this.overleyWarning.create().toCenter();
    };

    // контроль вводимых значений и пересчет показателей
    this.inputValue = function(obj)
    {
        var rvalue = obj.value;
        if (/(amount|boxes|weight|baseprice|receipt_price|baseprice_in)\]$/.test(obj.name)) {
            this.controlNumberValue(obj, 0);
        }
        if (/(percentuse)\]$/.test(obj.name)) {
            this.controlNumberValue(obj, 0, 100);
        }
        if (/(percentoff)\]$/.test(obj.name)) {
            this.controlNumberValue(obj, -100);
        }
        if (/products\[\d+\]\[materials\]\[\d+\]\[\w+\]/i.test(obj.name)) {
            //products[pnumber][materials][inumber][field]
            var tmp = obj.name.replace(/(\]\[|\[)/g, '.').replace(/\[|\]/g, '').split('.');
            var pnumber = tmp[1];
            var inumber = tmp[3];
            var value = (parseFloat(obj.value)||0);
            switch(tmp[4]){
                case 'amount':
                    this.changeItemAmount(pnumber, inumber, value);
                    break;
                case 'percentoff':
                    this.changeItemPercentOff(pnumber, inumber, value);
                    break;
                case 'percentuse':
                    this.changeItemPercentUse(pnumber, inumber, value);
                    break;
            };
        } else if (/products\[\d+\]\[sections\]\[\d+\]\[\w+\]/i.test(obj.name)) {
            //products[pnumber][sections][inumber][field]
            var tmp = obj.name.replace(/(\]\[|\[)/g, '.').replace(/\[|\]/g, '').split('.');
            var pnumber = tmp[1];
            var snumber = tmp[3];
            var value = (parseFloat(obj.value)||0);
            switch(tmp[4]){
                case 'weight':
                    this.changeSectionWeight(pnumber, snumber, value);
                    break;
                case 'amount':
                    this.changeSectionAmount(pnumber, snumber, value);
                    break;
                case 'section':
                    var color = !this.checkSectionName(pnumber, snumber, value) ? '#FFC0CB' : '';
                    obj.style.backgroundColor = color;
                    break;
            }
        } else if (/products\[\d+\]\[\w+\]/i.test(obj.name)) {
            //products[pnumber][field]
            var tmp = obj.name.replace(/(\]\[|\[)/g, '.').replace(/\[|\]/g, '').split('.');
            var pnumber = tmp[1];
            var value = (parseFloat(obj.value)||0);
            switch(tmp[2]){
                case 'amount':
                    this.changeProductAmount(pnumber, value);
                    break;
                case 'boxes':
                    this.changeProductBoxes(pnumber, value);
                    break;
            }
        }
        if (rvalue == '') {
            obj.value = rvalue;
        }
    };

    // автосохранение изменений
    this.autosave = function(obj, oldVal)
    {
        if (this.autosaveFlag) {
            return;
        }
        var _self = this;
        var key = obj.name.replace(/(\]\[|\[)/g, '.').replace(/\[|\]/g, '').replace(/(\.\d+)/g, '');
        var pnumber = obj.name.replace(/(\]\[|\[)/g, '.').replace(/\[|\]/g, '').split('.')[1];
        var accountType = $(obj).attr('account_type');
        accountType = accountType || Claim.accountTypes.weight;

        //обработка приходных спец бц
        if(key === 'products.baseprice_in' || key === 'products.special_bp_in') {
            var data = BasePriceFormsIn.getData(pnumber, true);
            data.pnumber = pnumber;
            data.key = 'products.baseprice_in';
        } else {
            var data = {
                pnumber : pnumber,
                key     : key,
                value   : obj.value,
                accountType: accountType
            };
        }


        if (/(materials|sections)/.test(key)) {
            data.number = obj.name.replace(/(\]\[|\[)/g, '.').replace(/\[|\]/g, '').split('.')[3];
        }
        // проверка на уникальность имени секции в пределах товара
        if (key == 'products.sections.section' && !this.checkSectionName(pnumber, data.number, obj.value)) {
            this.showError(
                '<span style="color:red"><br>Название секции в пределах одного товара<br>должно быть уникально!<br>Проверте названия секций.<br></span>',
                'Ошибка',
                function(){
                    setTimeout(function(){obj.focus(); obj._value = oldVal;}, 0);
                }
            );
            return;
        }


        this.autosaveFlag = true;
        $(this.blockId).append(this.tplLoad2);
        $('#product-block').focus();

        this.saveproduct(data);
    };


    /**
     * Метод выполняет редактирование товара по переданному массиву данных
     *
     * @param {type} data
     */
    this.saveproduct = function(data, async)
    {
        var _self = this;

        var pnumber = data.pnumber;
        var amount = data.value;
        var dataKey = data.key;

        this.sendQuery(
            '/claim/receipt/saveproduct',
            data,
            function(html){
                try {
                    var data = JSON.parse(html);
                } catch(e) {
                    var data = false;
                }

                if (typeof data == 'object'
                        && data.hasOwnProperty('success')
                        && data.hasOwnProperty('render')
                        && data.success
                        && !data.render
                ) {
                    $('#product-block').remove();
                    _self.updateEvents();
                    if (_self.lastFocusName) {
                        var node = $(_self.blockId).find('input[name="' + _self.lastFocusName + '"]')[0];
                        node.focus();
                        node.selectionStart = 0;
                        node.selectionEnd   = node.value.length;
                    }
                    _self.autosaveFlag = false;
                    return true;
                }
                _self.showAutosaveMsg();
                $(_self.blockId).html(html);
                _self.updateEvents();
                if (_self.lastFocusName) {
                    var node = $(_self.blockId)
                    .find('input[name="' + _self.lastFocusName + '"]')[0];
                    node.focus();
                    node.selectionStart = 0;
                    node.selectionEnd   = node.value.length;
                    // блокировка на % потерь и флаг без овердрафтности
                    if(!$(_self.blockId).find('input[action="blockpercentoff"][pnumber="' + data.pnumber + '"]').val()){
                        node.oninput();
                    }
                }
                _self.autosaveFlag = false;

                BasePriceFormsIn.initSpecialPriceIn();

                if (dataKey === 'products.boxes' && window.dealWageForm) {
                    window.dealWageForm.getItemList().updateItem(pnumber, {amount: amount});
                }
            },
            'html',
            function(html){
                $('#product-block').remove();
                _self.showError(html, 'Ошибка', function(){_self.update(); _self.autosaveFlag = false;});
            },
            async
        );
    };

    // проверка на уникальность имени секции в пределах товара
    this.checkSectionName = function(pnumber, snumber, sname)
    {
        var result = true;
        $('.even tr[type="section"][pnumber="' + pnumber + '"] input').each(function(i, input){
            if (!/section\]$/.test(input.name)){
                return;
            }
            var number = input.name.replace(/(\]\[|\[)/g, '.').replace(/\[|\]/g, '').split('.')[3];
            if (number == snumber){
                return;
            }
            if (input.value != sname) {
                return;
            }
            result = false;
        });
        return result;
    };


    /**
     * Метод выполняет добавление товара на форму
     *
     * @param {type} params Массив параметров для передачи на сервер
     * @param async
     */
    this.applyProduct = function(params, async)
    {
        var self = this;

        this.sendQuery(
            '/claim/receipt/addproduct',
            params,
            function(html){
                $(self.blockId).html(html);
                self.updateEvents();
                if (self.overleyProducts) {
                    self.overleyProducts.grid.lastSelectionData = self.getProductsIds();
                    self.overleyProducts.grid._updateSelectedRow();
                }
                self.hideLoader();

                BasePriceFormsIn.initSpecialPriceIn();

                if (window.dealWageForm) {
                    var lastRow = $(self.blockId).find('tr[type="product"]:last');
                    window.dealWageForm.getItemList()
                        .addItem({
                            number: lastRow.attr('pnumber'),
                            id: params.productData.id,
                            title: params.productData.color
                        }).catch(function (error) {
                            alert('Ошибка при добавлении товара в форму ЗП за сделку');
                            console.warn(error);
                        });
                }

                self.onAfterClaimProductApply();
            },
            'html',
            function(html){
                if (self.overleyProducts) {
                    self.overleyProducts.close();
                }
                self.showError(html, 'Ошибка!', function(){self.update();});
            },
            async
        );
    };


    // products methods----------------------------
    // окно для выбора товаров
    // теперь в angularjs

    // изменение номенклатуры товара form
    this.changeProduct = function(pnumber)
    {
        this.$ctrl.openChangeProductForm(
            parseInt(pnumber),
            parseInt($(this.blockId + ' input[name="products[' + pnumber + '][id]"]').val())
        );
    };

    // список ид уже добавленных товаров
    this.getProductsIds = function()
    {
        var ids = [], tmp = [];
        $(this.blockId + ' tbody>tr').each(function(i, node){
            var pnumber = parseInt($(node).attr('pnumber'));
            if (tmp.indexOf(pnumber) == -1) {
                tmp.push(pnumber);
                ids.push({id:$('#products tbody input[type="hidden"][name="products[' + pnumber + '][id]"]').val()});
            }
        });
        return ids;
    };

    // инфа по товарам на складе АМД
    this.productInfo = function(data, ajax)
    {
        var _self = this;
        _self.flagInfoIn = false;
        this.overleyInfoIn = new Overley();
        this.overleyInfoIn.itemId = data.id;
        this.overleyInfoIn.title = 'Информация по приходам товара : ' + data.title + ' (ID:id)'.replace(/id/, data.id);
        this.overleyInfoIn.onAfterCreate = function()
        {
            var html = '<div id="cnt_item_info_amd" style="padding:5px; width:1010px"></div>'
            + '<div id="cnt_item_in_amd" style="background:transparent url(/img/ld/ld3.gif) no-repeat center; min-height:50px;" align="center"></div>';
            html += '<div style="padding:5px; text-align:right;">';
            html += '<input type="button" action="close" value="Закрыть" style="width:100px" />';
            html += '</div>';
            this.getArea().innerHTML = html;
            $(this.getArea()).find('input[action="close"]').click(function(){
                _self.overleyInfoIn.close();
            });

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
                id:            {caption:'ID', width:43},
                title:         {caption: configTitle,       width:115, aliace:Claim.aliace, align:'left'},
                prop:          {caption: configProp,        width:77,  aliace:function(v, cnt, rowData){ return eval(configPropReturn);}},
                color:         {caption: configColor,       width:100, aliace:function(v, cnt, rowData){ return eval(configColorReturn);}},
                boxType:       {caption: configBoxType,     width:80,  aliace:function(v, cnt, rowData){ return eval(configBoxTypeReturn);}},
                volum:         {caption: configVolum,       width:70,  aliace:function(v, cnt, rowData){ return eval(configVolumReturn);}},
                height:        {caption: configHeight,      width:75,  aliace:function(v, cnt, rowData){
                        // Отображение реального поставщика
                        showVendornameTitle(rowData, cnt);
                        return eval(configHeightReturn);
                    }},
                width:         {caption: configWidth,       width:75,  aliace:function(v, cnt, rowData){ return eval(configWidthReturn);}},
                depth:         {caption: configDepth,       width:75,  aliace:function(v, cnt, rowData){ return eval(configDepthReturn);}},
                labelWeight:   {caption: configLabelWeight, width:80, sort:1, aliace:function(v, cnt, rowData){ return eval(configLabelWeightReturn);}},
                inBoxes:       {caption: 'Кол-во в упаковке / средний вес ', width:95, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                amountWeight : {caption:'Кол-во (штук) / общий вес', width:95, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                boxesRols :    {caption:'Кол-во упаковок / кол-во роликов', width:95, aliace:function(v, cnt, rowData){ return (parseFloat(v)||'');}},
                description :  {caption:'Примечание',       width:200, aliace:function(v, cnt, rowData){ return (v||'');}}
            };
            this.grid.create();
            this.grid.data = [data];
            this.grid.update();

            _self.sendQuery(
                '/claim/receipt/getinfoin',
                {itemId : this.itemId},
                function(html) {
                   $('#cnt_item_in_amd').html(html);
                   $('#cnt_item_in_amd').css({'background':''})
                    _self.overleyInfoIn.toCenter();
                },
                'html',
                function(html){
                    if (_self.overleyInfoIn) {
                        _self.overleyInfoIn.close();
                    }
                    _self.showError(html, 'Ошибка!');
                }
            );

            this.toCenter();
        };
        this.overleyInfoIn.onBeforeClose = function()
        {
            this.grid.close();
        };
        this.overleyInfoIn.onAfterClose = function()
        {
            delete(_self.overleyInfoIn);
            _self.updateEvents();
        };
        this.overleyInfoIn.create();
    };

    // запрос на удаление товара
    this.dropProduct = function(pnumber)
    {
        var _self = this;
        this.overleyDropProducts = new Overley();
        this.overleyDropProducts.pnumber = pnumber;
        this.overleyDropProducts.title = 'Удаление товара';
        this.overleyDropProducts.onAfterCreate = function()
        {
            $(this.getArea()).html(_self.tplLoad);
            this.toCenter();
            _self.sendQuery(
                '/claim/receipt/dropproductsform',
                {pnumber : this.pnumber},
                function(html){
                    _self.overleyDropProducts.onAfterLoad(html);
                },
                'html',
                function(html){
                    if (_self.overleyDropProducts) {
                        _self.overleyDropProducts.close();
                    }
                    _self.showError(html, 'Ошибка!', function(){_self.update()});
                }
            );
        };
        this.overleyDropProducts.onAfterLoad = function(html)
        {
            var self = this;

            var area = this.getArea();
            $(area).html(html);
            $(area).find('input[action="close"]').click(function(){
                _self.overleyDropProducts.close();
            });
            $(area).find('input[action="drop_product"]').click(function(){
                // ticket2841, доработка №7, пункт 2
                // Если данный товар резервирует позицию производства, необходимо удалить резерв
                var reservedCpmrpRowIdElement = $('#products input[type="hidden"][name="products[' + self.pnumber + '][reserved_cpmrp_row_id]"]');
                if (
                    reservedCpmrpRowIdElement.length
                    && !getManufacturerClaimsComponent().reserver.declineRow(reservedCpmrpRowIdElement.val())
                ) {
                    // Если не удалось удалить резерв, строку тоже не удаляем
                    return false;
                }

                _self.overleyDropProducts.apply();
            });
            this.toCenter();
        };
        this.overleyDropProducts.apply = function()
        {
            var pnumber = this.pnumber;
            $(this.getArea()).html(_self.tplLoad);
            this.toCenter();
            _self.sendQuery(
                '/claim/receipt/dropproduct',
                { pnumber : this.pnumber },
                function(html){
                    $(_self.blockId).html(html);
                    _self.updateEvents();
                    if (_self.overleyDropProducts) {
                        _self.overleyDropProducts.close();
                    }

                    BasePriceFormsIn.initSpecialPriceIn();
                    if (window.dealWageForm) {
                        window.dealWageForm.getItemList().deleteItem(pnumber);
                    }
                },
                'html',
                function(html){
                    if (_self.overleyDropProducts) {
                        _self.overleyDropProducts.close();
                    }
                    _self.showError(html, 'Ошибка!', function(){_self.update()});
                }
            );
        };
        this.overleyDropProducts.onAfterClose = function()
        {
            delete(_self.overleyDropProducts);
            _self.updateEvents();
        };
        this.overleyDropProducts.create().toCenter();
    };



    // items methods----------------------------
    // добавить сырье пер-ка form
    this.addItemClient = function(pnumber)
    {
        var _self = this;
        this.overleyItemClient = new Overley();
        this.overleyItemClient.pnumber = pnumber;
        this.overleyItemClient.title = 'Сырье переработчика';
        this.overleyItemClient.onAfterCreate = function()
        {
            $(this.getArea()).html(_self.tplLoad);
            this.toCenter();
            _self.sendQuery(
                '/claim/receipt/itemclientform',
                null,
                function(html){
                    if (_self.overleyItemClient) {
                        _self.overleyItemClient.onAfterLoad(html);
                    }
                },
                'html',
                function(html){
                    if (_self.overleyItemClient) {
                        _self.overleyItemClient.close();
                    }
                    _self.showError(html, 'Ошибка!', function(){_self.update();});
                }
            );
        };
        this.overleyItemClient.onAfterLoad = function(html)
        {
            var area = this.getArea();
            $(area).html(html);
            $(area).find('input[action="close"]').click(function(){
                _self.overleyItemClient.close();
            });
            $(area).find('input[action="save"]').prop({disabled : true}).click(function(){
                _self.overleyItemClient.apply();
            });
            $(area).find('input[type="text"][name="price"]').on('input', function(){
                _self.controlNumberValue(this, 0);
                _self.overleyItemClient.ctrlBtn();
            });
            $(area).find('input[type="text"][name="title"]').on('input', function(){
                _self.overleyItemClient.ctrlBtn();
            }).focus();

            this.toCenter();
        };
        this.overleyItemClient.apply = function()
        {
            var area = this.getArea();
            var itemTitle = $(area).find('input[name="title"]').val().replace(/^\s+|\s+$/g, '');
            var itemPrice = $(area).find('input[name="price"]').val();
            $(area).html(_self.tplLoad);
            this.toCenter();
            _self.sendQuery(
                '/claim/receipt/additem',
                {
                    pnumber     : this.pnumber,
                    itemId      : 0,
                    itemTitle   : itemTitle,
                    itemPrice   : itemPrice,
                    accountType : Claim.accountTypes.weight,
                },
                function(html){
                    $(_self.blockId).html(html);
                    _self.updateEvents();
                    if (_self.overleyItemClient){
                        _self.overleyItemClient.close();
                    }
                },
                'html',
                function(html){
                    if (_self.overleyItemClient){
                        _self.overleyItemClient.close();
                    }
                    _self.showError(html, 'Ошибка!', function(){_self.update()});
                }
            );
        };
        this.overleyItemClient.ctrlBtn = function()
        {
            var area  = this.getArea();
            var text  = $(area).find('input[name="title"]').val().replace(/^\s+|\s+$/g, '');
            var price = $(area).find('input[name="price"]').val();
            $(area).find('input[action="save"]').prop({disabled : !(text && price)});
        }
        this.overleyItemClient.onAfterClose = function()
        {
            delete(_self.overleyItemClient);
            _self.updateEvents();
        };
        this.overleyItemClient.create().toCenter();
    };

    // добавить сырье form
    this.addItem = function(pnumber, params)
    {
        this.$ctrl.openAddItemForm(pnumber, params);
    };

    // добавить сырье form
    this.exchangeOverdraft = function(pnumber, inumber)
    {
        this.$ctrl.openExchangeOverdraftForm(
            parseInt(pnumber),
            parseInt(inumber),
            parseInt($(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][id]"]').val()),
            Claim.accountTypes.weight,
        );
    };

    // список уже добавленного сырья в товар
    this.getItemIds = function(pnumber)
    {
        var ids = [];
        $(this.blockId).find('tr[inumber][pnumber="' + pnumber + '"]').each(function(i, node){
            var inumber = $(node).attr('inumber');
            var q = 'input[name="products[%p][materials][%i][id]"]'.replace('%p', pnumber).replace('%i', inumber);
            var id = parseInt($(node).find(q).val());
            if (!id) {
                return;
            }
            ids.push({id:id});
        });
        return ids;
    };

    /**
     * Получить количество товаров
     * @returns {number | jQuery}
     */
    this.getProductCount = function ()
    {
        return $(this.blockId).find('tr[pnumber][type="product"]').length;
    }

    // удалить сырье из товара form
    this.dropItem = function(pnumber, inumber)
    {
        var _self = this;
        this.overleyDropItem = new Overley();
        this.overleyDropItem.pnumber = pnumber;
        this.overleyDropItem.inumber = inumber;
        this.overleyDropItem.title = 'Удаление сырья';
        this.overleyDropItem.onAfterCreate = function()
        {
            $(this.getArea()).html(_self.tplLoad);
            this.toCenter();
            _self.sendQuery(
                '/claim/receipt/dropitemform',
                {
                    pnumber   : this.pnumber,
                    inumber   : this.inumber,
                },
                function(html){
                    if (_self.overleyDropItem) {
                        _self.overleyDropItem.onAfterLoad(html);
                    }
                },
                'html',
                function(html){
                    if (_self.overleyDropItem) {
                        _self.overleyDropItem.close();
                    }
                    _self.showError(html, 'Ошибка', function(){_self.update();});
                }
            );
        };
        this.overleyDropItem.onAfterLoad = function(html)
        {
            var area = this.getArea();
            $(area).html(html);
            $(area).find('input[action="close"]').click(function(){
                _self.overleyDropItem.close();
            });
            $(area).find('input[action="drop_item"]').click(function(){
                _self.overleyDropItem.apply();
            });
            this.toCenter();
        };
        this.overleyDropItem.apply = function()
        {
            $(this.getArea()).html(_self.tplLoad);
            this.toCenter();
            _self.sendQuery(
                '/claim/receipt/dropitem',
                {
                    pnumber   : pnumber,
                    inumber   : inumber
                },
                function(html){
                    $(_self.blockId).html(html);
                    _self.updateEvents();
                    if (_self.overleyDropItem) {
                        _self.overleyDropItem.close();
                    }
                },
                'html',
                function(html){
                    if (_self.overleyDropItem) {
                        _self.overleyDropItem.close();
                    }
                    _self.showError(html, 'Ошибка', function(){_self.update();});
                }
            );
        };
        this.overleyDropItem.onAfterClose = function()
        {
            delete(_self.overleyDropItem);
            _self.updateEvents();
        };
        this.overleyDropItem.create().toCenter();
    };

    //изменение сырья
    this.changeItemBefore = function(pnumber, inumber, params)
    {
        var itemId = $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][id]"]').val();
        var _self = this;
        if (itemId > 0) {
            this.changeItem(pnumber, inumber, params);
        } else {
            this.changeItemClient(pnumber, inumber);
        }
    };

    // изменение сырья пер-ка
    this.changeItemClient = function(pnumber, inumber)
    {
        var _self = this;
        this.overleyChangeItem = new Overley();
        this.overleyChangeItem.pnumber = pnumber;
        this.overleyChangeItem.inumber = inumber;
        this.overleyChangeItem.title = 'Сырье переработчика';
        this.overleyChangeItem.onAfterCreate = function()
        {
            $(this.getArea()).html(_self.tplLoad);
            this.toCenter();
            _self.sendQuery(
                '/claim/receipt/itemclientform',
                {
                    pnumber : pnumber,
                    inumber : inumber
                },
                function(html){
                    if (_self.overleyChangeItem) {
                        _self.overleyChangeItem.onAfterLoad(html);
                    }
                },
                'html',
                function(html){
                    if (_self.overleyChangeItem) {
                        _self.overleyChangeItem.close();
                    }
                    _self.showError(html, 'Ошибка!', function(){_self.update();});
                }
            );
        };
        this.overleyChangeItem.onAfterLoad = function(html)
        {
            var area = this.getArea();
            $(area).html(html);
            $(area).find('input[action="close"]').click(function(){
                _self.overleyChangeItem.close();
            });
            $(area).find('input[action="save"]').click(function(){
                _self.overleyChangeItem.apply();
            });

            $(area).find('input[type="text"][name="price"]').on('input', function(){
                _self.controlNumberValue(this, 0);
                _self.overleyChangeItem.ctrlBtn();
            });
            $(area).find('input[type="text"][name="title"]').on('input', function(){
                _self.overleyChangeItem.ctrlBtn();
            }).focus();
            this.toCenter();
        };
        this.overleyChangeItem.apply = function()
        {
            var area = this.getArea();
            var itemTitle = $(area).find('input[name="title"]').val().replace(/^\s+|\s+$/g, '');
            var itemPrice = $(area).find('input[name="price"]').val();
            $(area).html(_self.tplLoad);
            _self.overleyChangeItem.toCenter();

            _self.sendQuery(
                '/claim/receipt/changeitem',
                {
                    pnumber   : this.pnumber,
                    inumber   : this.inumber,
                    itemTitle : itemTitle,
                    itemPrice : itemPrice
                },
                function(html){
                    $(_self.blockId).html(html);
                    _self.updateEvents();
                    if (_self.overleyChangeItem) {
                        _self.overleyChangeItem.close();
                    }
                },
                'html',
                function(html){
                    if (_self.overleyChangeItem) {
                        _self.overleyChangeItem.close();
                    }
                    _self.showError(html, 'Ошибка!', function(){_self.update();});
                }
            );
        };
        this.overleyChangeItem.ctrlBtn = function()
        {
            var area  = this.getArea();
            var text  = $(area).find('input[name="title"]').val().replace(/^\s+|\s+$/g, '');
            var price = $(area).find('input[name="price"]').val();
            $(area).find('input[action="save"]').prop({disabled : !(text.length && price)});
        };
        this.overleyChangeItem.onAfterClose = function()
        {
            delete(_self.overleyChangeItem);
            _self.updateEvents();
        };
        this.overleyChangeItem.create().toCenter();
    };

    // изменение сырья амд
    this.changeItem = function(pnumber, inumber, params)
    {
        this.$ctrl.openChangeItemForm(
            parseInt(pnumber),
            parseInt(inumber),
            parseInt($(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][id]"]').val()),
            params,
        );
    };

    // информация по поставка сырья
    this.itemInfo = function(itemId, inumber, pnumber)
    {
        var _self = this;
        this.overleyInfo = new Overley();
        this.overleyInfo.clientId = Claim.getClient();
        this.overleyInfo.itemId = itemId;
        this.overleyInfo.title = 'Информация о поставках на склад переработчика';
        this.overleyInfo.onAfterCreate = function()
        {
            $(this.getArea()).html(_self.tplLoad);
            this.toCenter();
            _self.sendQuery(
                '/claim/receipt/iteminfo',
                {
                    clientId : this.clientId,
                    itemId   : this.itemId,
                    inumber  : (parseInt(inumber)||0),
                    pnumber  : (parseInt(pnumber)||0)
                },
                function(html){
                    if (_self.overleyInfo) {
                        $(_self.overleyInfo.getArea()).html(html);
                        $(_self.overleyInfo.getArea()).find('input[action="close"]').click(function(){
                            _self.overleyInfo.close();
                        });
                    }
                },
                'html',
                function(html){
                    if (_self.overleyInfo) {
                        _self.overleyInfo.close();
                    }
                    _self.showError(html, 'Ошибка!');
                }
            );
        };
        this.overleyInfo.onAfterClose = function()
        {
            delete(_self.overleyInfo);
            _self.updateEvents();
        };
        this.overleyInfo.create().toCenter();
    };



    // section methods----------------------------
    // добавить секцию
    this.addSection = function(pnumber)
    {
        var _self = this;
        this.showLoader('Добавление секции');
        this.sendQuery(
            '/claim/receipt/addsection',
            { pnumber : pnumber },
            function (html) {
                try {
                    var data = JSON.parse(html);
                } catch(e) {
                    var data = false;
                }

                if (typeof data == 'object'
                        && data.hasOwnProperty('success')
                        && data.hasOwnProperty('render')
                        && data.hasOwnProperty('html')
                        && data.success
                        && !data.render
                ) {
                    $(_self.blockId).find('tr[type="add_section"][pnumber="'+ pnumber +'"]').before(data.html);
                } else {
                    $(_self.blockId).html(html);
                }
                _self.updateEvents();
                _self.hideLoader();
            },
            'html',
            function(html){
                _self.hideLoader();
                _self.showError(html, 'Ошибка!', function(){_self.update();});
            }
        );
    };

    /**
     * добавить первые секции
     * @param {string} section
     * @returns {void}
     */
    this.addFirstSections = function (section)
    {
        var _self = this;
        this.showLoader('Добавление секций');
        this.sendQuery(
                '/claim/receipt/addsections',
                {section: section}, //{ pnumber : pnumber },
                function (html)
                {
                    try {
                        var data = JSON.parse(html);
                    } catch (e) {
                        var data = false;
                    }

                    if (typeof data == 'object'
                            && data.hasOwnProperty('success')
                            && data.hasOwnProperty('render')
                            && data.hasOwnProperty('html')
                            && data.success
                            && !data.render
                            ) {
                        for (var pnumber in data.html) {
                            for (var section in data.html[pnumber]) {
                                $(_self.blockId).find('tr[type="add_section"][pnumber="' + pnumber + '"]').before(data.html[pnumber][section]);
                            }
                        }
                    } else {
                        $(_self.blockId).html(html);
                    }
                    _self.updateEvents();
                    _self.hideLoader();
                },
                'html',
                function (html)
                {
                    _self.hideLoader();
                    _self.showError(html, 'Ошибка!', function ()
                    {
                        _self.update();
                    });
                }
        );
    };

    // удалить секцию
    this.dropSection = function(pnumber, snumber)
    {
        var _self = this;
        this.showLoader('Удаление секции');
        this.sendQuery(
            '/claim/receipt/dropsection',
            {
                pnumber : pnumber,
                snumber : snumber
            },
            function (html) {
                $(_self.blockId).html(html);
                _self.updateEvents();
                _self.hideLoader();
            },
            'html',
            function(html){
                _self.hideLoader();
                _self.showError(html, 'Ошибка!', function(){_self.update();});
            }
        );
    };




    // метка о браке
    this.changeDefect = function(pnumber, snumber)
    {
        var isDefect = $(this.blockId).find('input[type="checkbox"][action="change_defect"][pnumber="' + pnumber + '"][snumber="' + snumber + '"]').is(':checked');
        var _self = this;
        if (isDefect) {
            this.changeDefectForm(pnumber, snumber);
        }
        else {
            this.showLoader('Брак');
            this.sendQuery(
                '/claim/receipt/changedefect',
                {
                    claimId : this.claimId,
                    pnumber : pnumber,
                    snumber : snumber,
                    defect  : 0,
                    text    : ''
                },
                function(html){
                    $(_self.blockId).html(html);
                    _self.updateEvents();
                    _self.hideLoader();
                },
                'html',
                function(html){
                    _self.hideLoader();
                    _self.showError(html, 'Ошибка!', function(){_self.update();});
                }
            );
        }
    };

    // комментарий к браку редактирование
    this.changeDefectForm = function(pnumber, snumber)
    {
        var _self = this;
        this.overleyDefect = new Overley();
        this.overleyDefect.pnumber = pnumber;
        this.overleyDefect.snumber = snumber;
        this.overleyDefect.notsaved = true;
        this.overleyDefect.title = 'Брак';
        this.overleyDefect.onAfterCreate = function()
        {
            $(this.getArea()).html(_self.tplLoad);
            this.toCenter();
            _self.sendQuery(
                '/claim/receipt/defectform',
                {
                    claimId : _self.claimId,
                    pnumber : pnumber,
                    snumber : snumber
                },
                function(html){
                    if (_self.overleyDefect) {
                        _self.overleyDefect.onAfterLoad(html);
                    }
                },
                'html',
                function(html){
                    if (_self.overleyDefect) {
                        _self.overleyDefect.close();
                    }
                    _self.showError(html, 'Ошибка!', function(){_self.update();});
                }
            );
        };
        this.overleyDefect.onAfterLoad = function(html)
        {
            var area = this.getArea();
            $(area).html(html);
            $(area).find('input[action="close"]').click(function(){
                _self.overleyDefect.close();
            });
            $(area).find('input[action="save"]').click(function(){
                _self.overleyDefect.apply();
            });
            $(area).find('textarea').each(function(i, node){
                node.oninput = function(){_self.overleyDefect.ctrlBtn();};
            }).focus();
            this.toCenter();
        };
        this.overleyDefect.ctrlBtn = function()
        {
            var area  = this.getArea();
            var text  = $(area).find('textarea').val().replace(/^\s+|\s+$/g, '');
            $(area).find('input[action="save"]').prop({disabled : !(text.length)});
        };
        this.overleyDefect.apply = function()
        {
            var area = this.getArea();
            var reason = $(area).find('textarea').val().replace(/^\s+|\s+$/g, '');
            $(area).html(_self.tplLoad);
            this.toCenter();
            this.notsaved = false;
            _self.sendQuery(
                '/claim/receipt/changedefect',
                {
                    claimId : _self.claimId,
                    pnumber : pnumber,
                    snumber : snumber,
                    defect  : 1,
                    text    : reason
                },
                function(html){
                    if (_self.overleyDefect) {
                        _self.overleyDefect.close();
                    }
                    $(_self.blockId).html(html);
                    _self.updateEvents();
                },
                'html',
                function(html){
                    if (_self.overleyDefect) {
                        _self.overleyDefect.close();
                    }
                    _self.showError(html, 'Ошибка!', function(){_self.update();});
                }
            );
        };
        this.overleyDefect.onAfterClose = function()
        {
            if (this.notsaved) {
                var checked = ($(_self.blockId).find('input[name="products[' + this.pnumber + '][sections][' + this.snumber + '][defect]"]').val() == 1);
                $(_self.blockId).find('input[type="checkbox"][action="change_defect"][pnumber="' + this.pnumber + '"][snumber="' + this.snumber + '"]').prop({checked:checked});
            }
            delete(_self.overleyDefect);
            _self.updateEvents();
        };
        this.overleyDefect.create().toCenter();
    };

    // комментарий к браку просмотр
    this.showDefect = function(pnumber, snumber)
    {
        var _self = this;
        this.overleyDefect = new Overley();
        this.overleyDefect.pnumber = pnumber;
        this.overleyDefect.snumber = snumber;
        this.overleyDefect.notsaved = true;
        this.overleyDefect.title = 'Брак';
        this.overleyDefect.onAfterCreate = function()
        {
            $(this.getArea()).html(_self.tplLoad);
            this.toCenter();
            _self.sendQuery(
                '/claim/receipt/showdefect',
                {
                    claimId : _self.claimId,
                    pnumber : pnumber,
                    snumber : snumber
                },
                function(html){
                    if (_self.overleyDefect) {
                        _self.overleyDefect.onAfterLoad(html);
                    }
                },
                'html',
                function(html){
                    if (_self.overleyDefect) {
                        _self.overleyDefect.close();
                    }
                    _self.showError(html, 'Ошибка!', function(){_self.update();});
                }
            );
        };
        this.overleyDefect.onAfterLoad = function(html)
        {
            var area = this.getArea();
            $(area).html(html);
            $(area).find('input[action="close"]').click(function(){
                _self.overleyDefect.close();
            }).focus();
            this.toCenter();
        };
        this.overleyDefect.onAfterClose = function()
        {
            delete(_self.overleyDefect);
            _self.updateEvents();
        };
        this.overleyDefect.create().toCenter();
    };

    // отметка об отсутствии овердрафта
    this.changeWithoutOverdraft = function(pnumber, inumber)
    {
        var checked = $(this.blockId).find('input[type="checkbox"][action="without_overdraft"][pnumber="' + pnumber + '"][inumber="' + inumber + '"]').is(':checked');
        var _self = this;
        this.showLoader('Изменение параметров овердрафта');
        this.sendQuery(
            '/claim/receipt/changewithoutoverdraft',
            {
                claimId : this.claimId,
                pnumber : pnumber,
                inumber : inumber,
                without : (checked ? 1 : 0)
            },
            function(html){
                $(_self.blockId).html(html);
                _self.updateEvents();
                _self.hideLoader();
            },
            'html',
            function(html){
                _self.hideLoader();
                _self.showError(html, 'Ошибка!', function(){_self.update();});
            }
        );
    };

    // пересчеты показателей товара
    // изменение процента потерь
    this.changeItemPercentOff = function(pnumber, inumber, percentoff)
    {
        // ид сырья
        var itemId = $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][id]"]').val();
        // флаг безовердрафтности
        var withoutOverdraft = $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][without_overdraft]"]').val() == 1;
        // максимальный свободный остаток сырья на складе
        var maxIamount = $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][max_amount]"]').val();
        maxIamount = (parseFloat(maxIamount)||0);
        // процент использования
        var percentuse =  $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][percentuse]"]').val();
        percentuse = (parseFloat(percentuse)||0);
        //общее вес товара
        var pamount = $(this.blockId).find('input[name="products[' + pnumber + '][amount]"]').val();
        pamount = (parseFloat(pamount)||0);
        // расчет новой массы сырья
        var iamount = pamount * percentuse / 100;
        if (itemId > 0) {
            iamount += iamount * percentoff / 100
            // если без овердрафта и есть привышение - уменьшим процент потерь
            if (withoutOverdraft && iamount > maxIamount) {
                // расчет % потерь
                percentoff = 100 * (maxIamount / (pamount * percentuse / 100) - 1);
                $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][percentoff]"]').val(percentoff);
            }
            iamount = pamount * percentuse / 100;
            iamount += iamount * percentoff / 100;
        } else {
            // добавление процента потерь
            iamount += iamount * percentoff / 100;
        }
        $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][amount]"]').val(iamount);
    };
    // изменение процента использования
    this.changeItemPercentUse = function(pnumber, inumber, percentuse)
    {
        // блокировка на % потерь и флаг без овердрафтности
        var block = $(this.blockId).find('input[action="blockpercentoff"][pnumber="' + pnumber + '"]').prop("checked");
        // ид сырья
        var itemId = $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][id]"]').val();
        // флаг безовердрафтности
        var withoutOverdraft = $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][without_overdraft]"]').val() == 1;
        // максимальный свободный остаток сырья на складе
        var maxIamount = $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][max_amount]"]').val();
        maxIamount = (parseFloat(maxIamount)||0);
        // процент потерь
        var percentoff =  $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][percentoff]"]').val();
        percentoff = (parseFloat(percentoff)||0);
        //общее вес товара
        var pamount = $(this.blockId).find('input[name="products[' + pnumber + '][amount]"]').val();
        pamount = (parseFloat(pamount)||0);
        // расчет новой массы сырья
        var iamount = pamount * percentuse / 100;
        if (itemId > 0) {
            iamount += iamount * percentoff / 100
            // если без овердрафта и есть привышение - уменьшим процент потерь
            if (withoutOverdraft && iamount > maxIamount && !block) {
                // расчет % потерь
                percentoff = 100 * (maxIamount / (pamount * percentuse / 100) - 1);
                $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][percentoff]"]').val(percentoff);
            }
            iamount = pamount * percentuse / 100;
            iamount += iamount * percentoff / 100;
        } else {
            // добавление процента потерь
            iamount += iamount * percentoff / 100;
        }
        $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][amount]"]').val(iamount);
    };
    // изменение массы сырья
    this.changeItemAmount = function(pnumber, inumber, iamount)
    {
        // блокировка на % потерь и флаг без овердрафтности
        var block = $(this.blockId).find('input[action="blockpercentoff"][pnumber="' + pnumber + '"]').prop("checked");
        // ид сырья
        var itemId = $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][id]"]').val();
        // флаг безовердрафтности
        var withoutOverdraft = $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][without_overdraft]"]').val() == 1;
        // максимальный свободный остаток сырья на складе
        var maxIamount = $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][max_amount]"]').val();
        maxIamount = (parseFloat(maxIamount)||0);
        // процент потерь
        var percentoff =  $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][percentoff]"]').val();
        percentoff = (parseFloat(percentoff)||0);
        // процент использования
        var percentuse =  $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][percentuse]"]').val();
        percentuse = (parseFloat(percentuse)||0);
        //общее вес товара
        var pamount = $(this.blockId).find('input[name="products[' + pnumber + '][amount]"]').val();
        pamount = (parseFloat(pamount)||0);
        if (block){
            percentuse = iamount * 100 / (pamount*(1 + percentoff/100));
            if (percentuse != Math.min(percentuse, 100)) {
                percentuse = Math.min(percentuse, 100);
                iamount = (pamount * percentuse / 100) * (1 + percentoff / 100);
                $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][amount]"]').val(iamount);
            }
            $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][percentuse]"]').val(percentuse);
            return;
        }
        // если не установлен процент потерь
        if (percentuse == 0 || pamount == 0) {
            if (itemId && withoutOverdraft) {
                iamount = Math.min(iamount, maxIamount);
            }
            $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][amount]"]').val(iamount);
            return;
        }
        if (itemId > 0 && withoutOverdraft) {
            iamount = Math.min(iamount, maxIamount);
            $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][amount]"]').val(iamount);
            percentoff = 100 * (iamount / (pamount * percentuse / 100) - 1);
            $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][percentoff]"]').val(percentoff);
        } else {
            // расчет % потерь
            percentoff = 100 * (iamount / (pamount * percentuse / 100) - 1);
            $(this.blockId).find('input[name="products[' + pnumber + '][materials][' + inumber + '][percentoff]"]').val(percentoff);
        }
    };
    // изменения массы прихода
    this.changeProductAmount = function(pnumber, amount)
    {
        var ptype = $(this.blockId).find('input[name="products[' + pnumber + '][type]"]').val();
        // вес одной единицы товара
        var unitWeight = $(this.blockId).find('input[name="products[' + pnumber + '][unitweight]"]').val();
        unitWeight = (parseFloat(unitWeight)||0);
        // уже введенное кол-во товара
        var count = $(this.blockId).find('input[name="products[' + pnumber + '][boxes]"]').val();
        count = (parseFloat(count)||0);
        if (unitWeight) {
            count = Math.round(amount/unitWeight);
        }
        $(this.blockId).find('input[name="products[' + pnumber + '][boxes]"]').val(count);
        this.updateItems(pnumber);
        this.ctrlSectionWeightAmount(pnumber);
    };
    // изменение кол-ва прихода
    this.changeProductBoxes = function(pnumber, boxes)
    {
        this.ctrlSectionWeightAmount(pnumber);
        return;
    };
    // обновление сырья
    this.updateItems = function(pnumber)
    {
        var items = [];
        var _self = this;
        var test = new RegExp('^products\\[' + pnumber + '\\]\\[materials\\]\\[\\d+\\]\\[percentuse\\]$');
        $(this.blockId).find('input').each(function(i, node){
            if (!test.test(node.name)) {
                return;
            }
            var percent = node.value;
            var inumber = node.name.replace(/(\]\[|\[)/g, '.').replace(/\[|\]/g, '').split('.')[3];
            items.push({inumber:inumber, percent:percent});
        });
        $.each(items, function(i, obj){
            _self.changeItemPercentUse(pnumber, obj.inumber, obj.percent);
        });
    };
    // изменение кол-ва в секциях
    this.changeSectionWeight = function(pnumber, snumber, weight)
    {
        // вес одной единицы товара
        var unitWeight = $(this.blockId).find('input[name="products[' + pnumber + '][unitweight]"]').val();
        unitWeight = (parseFloat(unitWeight)||0);
        // уже введенное кол-во товара
        var count = $(this.blockId).find('input[name="products[' + pnumber + '][sections][' + snumber + '][amount]"]').val();
        count = (parseFloat(count)||0);
        if (unitWeight > 0) {
            count = Math.round(weight/unitWeight);
        }
        $(this.blockId).find('input[name="products[' + pnumber + '][sections][' + snumber + '][amount]"]').val(count);
        this.ctrlSectionWeightAmount(pnumber);
    };
    // изменения массы в секциях
    this.changeSectionAmount = function(pnumber, snumber, amount)
    {
        this.ctrlSectionWeightAmount(pnumber);
    };
    // контроль веса или колва
    this.ctrlSectionWeightAmount = function(pnumber)
    {
        var _self = this;
        if (!pnumber) {
            $(this.blockId + ' tr[type="product"]').each(function(i, tr){
                _self.ctrlSectionWeightAmount($(tr).attr('pnumber'));
            });
            return;
        }
        var productAmount = $('input[name="products[' + pnumber + '][boxes]"]').val(),
            productWeight = $('input[name="products[' + pnumber + '][amount]"]').val(),
            sectionAmount = 0,
            sectionWeight = 0;
        $('tr[type="section"][pnumber="' + pnumber + '"]').each(function(i, tr){
            var snumber = $(tr).attr('snumber');
            var q = 'input[name="products[' + pnumber + '][sections][' + snumber + '][amount]"]';
            sectionAmount += parseFloat($(tr).find(q).val());
            q = 'input[name="products[' + pnumber + '][sections][' + snumber + '][weight]"]';
            sectionWeight += parseFloat($(tr).find(q).val());
        });
        $('tr[type="section"][pnumber="' + pnumber + '"]').each(function(i, tr){
            var snumber = $(tr).attr('snumber');
            var q1 = 'input[name="products[' + pnumber + '][sections][' + snumber + '][amount]"]';
            var q2 = 'input[name="products[' + pnumber + '][sections][' + snumber + '][weight]"]';
            var colorAmount = Math.round((Math.abs(productAmount - sectionAmount) * 100000)/100000) > 0.00001 ? '#FFC0CB' : '';
            var colorWeight = Math.round((Math.abs(productWeight - sectionWeight) * 100000)/100000) > 0.00001 ? '#FFC0CB' : '';
            $(tr).find(q1).css({'background-color':colorAmount});
            $(tr).find(q2).css({'background-color':colorWeight});
        });

    };
    // сообщение об успешном автосохранении
    this.showAutosaveMsg = function()
    {
        $('#autosavemsg').show();
        setTimeout(function(){
            $('#autosavemsg').fadeOut(500) ;
        }, 1500);
    };
    // окно выбора шаблонов
    this.showTemplates = function(productId = 0, productNumber = 0)
    {
        var _self = this;
        this.disabledUpdatePhoto = true;
        this.overleyTpl = new Overley();
        this.overleyTpl.title = 'Шаблоны товаров для переработки';
        this.overleyTpl.onAfterCreate = function()
        {
            $(this.getArea()).html(_self.tplLoad);
            this.toCenter();
            this.closeable = false;
            _self.sendQuery(
                '/claim/receipt/tpl',
                null,
                function(html){
                    if (_self.overleyTpl) {
                        $(_self.overleyTpl.getArea()).html(html);
                        _self.overleyTpl.onAfterLoad();
                    }
                },
                'html',
                function(html){
                    if (_self.overleyTpl) {
                        _self.overleyTpl.closeable = true;
                        _self.overleyTpl.close();
                    }
                    _self.showError(html, 'Ошибка!');
                }
            );
        };
        this.overleyTpl.onAfterLoad = function()
        {
            var area = this.getArea();
            this.closeable = true;
            $(area).find('input[action="close"]').click(function(){
                _self.overleyTpl.close();
            });

            var filterParams = {
                grid  : {
                    containerId       : 'result-tpl',
                    perpage           : 200,
                    backlightSelectRow: '',
                },
                filter: {
                    containerId: 'filter-tpl',
                },
            };

            this.filterController = new Analitics_Receipttemplates_Filter_Controller(filterParams);

            this.initGrid();
            this.initFilter();
            this.initSubFilter();
            this.toCenter();
        };
        this.overleyTpl.initFilter = function()
        {
            this.filter = this.filterController.dataTable.filter;
            this.filter.onChange = function() {
                _self.overleyTpl.grid.addPostData = _self.overleyTpl.subFilters.getSubFiltersData();
                if (! arguments[0]) {
                   _self.overleyTpl.grid.addPostData.searchId = 0;
                }
                _self.overleyTpl.grid.update(this.getValue());
            };

            $('#filterReset-tpl').on('click', function () {
                _self.overleyTpl.filter.rebuildFilter(true);
            });

            filterProductTypeDecorator.modifyProductData('claimReceipt', this.filter, this.grid);
        };
        this.overleyTpl.initSubFilter = function()
        {
            const id = 'depot-list-sub-filter-tpl';
            const listElement = $(claim.depotProductsForm.options.subFiltersOptions.subFilters.depotListSubFilter.list);
            listElement.attr('id', `ll_select_${id}`);

            // Суб фильтры
            this.subFilters = new SubFilters({
                container : 'subfilter-tpl',
                subFilters: {
                    findById: {},
                    depotListSubFilter: {
                        id  : id,
                        list: listElement.get(0).outerHTML,
                    }
                }
            });

            // Установка фильтров
            this.subFilters.setOptions({
                filters        : [{
                    dataTable: this.filterController.dataTable,
                    filter   : this.filter,
                    grid     : this.grid
                }],
                onFilterChanged: (parentScope) =>
                {
                    const filter = this.filterController.dataTable.filter;
                    const grid   = this.filterController.dataTable.grid;

                    filter.extendAddPostData.searchId = filter.extendAddPostData.findById;
                    grid.extendAddPostData.searchId   = filter.extendAddPostData.findById;

                    this.depotIndex = (filter.extendAddPostData.depotListSubFilter||[])[0];

                    if (Claim.depotIndex) {
                        const selectedDepots = this.subFilters.getSubFilterData('depotListSubFilter');
                        Claim.depotIndex.setDepotId(selectedDepots[0]);
                    }

                    this.filterController.dataTable.update();
                }
            });

            this.subFilters.depotListSubFilter.updateSelectedValues(
                claim.depotProductsForm.options.depotListSubFilterGetSelected()
            );

            this.subFilters.depotListSubFilter.toggleOverlay(Boolean(claim.products.getProductCount()));
        };
        this.overleyTpl.initGrid = function()
        {
            this.grid = this.filterController.dataTable.grid;

            var addProductFn = function(rowIndex)
            {
                var data = this.data[rowIndex];
                if (productNumber > 0) {
                    data.productNumber = productNumber;
                }

                // спросить о необходимости добавления шаблона
                if (!confirm('Вы уверены что хотите добавить товар из шаблона в заявку?')) {
                    return;
                }

                _self.overleyTpl.addProduct(data);
            }.bind(this.grid);

            this.grid.onDblClick = function(rowIndex, field, node)
            {
                addProductFn(rowIndex);
            };

            $('#' + this.grid.containerId).on('click', '.js-template-id', function () {
                addProductFn($(this).data('rowIndex'));
            });

            this.grid.onAfterUpdate = function()
            {
                _self.overleyTpl.toCenter();
                _self.overleyTpl.ctrlHeight();
            };
        };
        this.overleyTpl.ctrlHeight = function()
        {
            var h = parseInt($(this.getArea()).css('max-height')) - 40;
            $(this.getArea()).find('div[type="data-tpl"]>div').each(function(i, div){
                if (div.id != 'result-tpl') {
                    h -= div.offsetHeight;
                } else {
                    h -= div.offsetHeight - $(div).find('.filter-grid-body')[0].offsetHeight;
                }
            });
            h -= $(this.getArea()).find('div[type="btn-tpl"]')[0].offsetHeight;
            $(this.getArea()).find('.filter-grid-body').css({'max-height':h + 'px'});
        };
        /**
         * Добавить товар по шаблону
         * @param {object} data
         * @returns {void}
         */
        this.overleyTpl.addProduct = function (data)
        {
            this.closeable = false;
            var useAlternativeItem = $(this.getArea()).find('.js-tpl-use-alternative').prop('checked') * 1;
            _self.sendQuery(
                    '/claim/receipt/addtpl',
                    {
                        productNumber: data.productNumber || 0,
                        tplId: data.id,
                        useAlternative: useAlternativeItem,
                        depotIndex: this.depotIndex,
                    },
                    function (data)
                    {
                        _self.overleyTpl.closeable = true;
                        _self.update();

                        if (window.dealWageForm) {
                            window.dealWageForm.getItemList().loadNew()
                            .catch(function (error) {
                                _self.showError(error.message, 'Ошибка добавления новых товаров в форму ЗП за сделку');
                            });
                        }
                    },
                    'json',
                    function (html)
                    {
                        _self.overleyTpl.closeable = true;
                        _self.showError(html, 'Ошибка!');
                    }
            );
        };
        this.overleyTpl.onBeforeClose = function()
        {
            return this.closeable;
        };
        this.overleyTpl.onAfterClose = function()
        {
            delete(_self.overleyTpl);
            _self.disabledUpdatePhoto = false;
            _self.updatePhoto();
        };
            this.overleyTpl.create().toCenter();
    };

    /**
     * Инициализация функционала редактирования блокировок секций под менеджеров
     */
    this.initDdmEdit = function () {
        var self = this;

        this.depotDetailedManagerTransferForms = {};

        // Отображение всплывающей формы редактирования блокировок секции под менеджеров
        $('#claim-form').on('click', 'img[data-action="show-ddm-form"]', function (e) {
            self.createDepotDetailedManagerTransferForm($(e.target).parents('tr:first')).show();
        });
    };

    /**
     * Метод возвращает объект формы блокировки секции под менеджеров
     *
     * @param sectionTr $-объект строки, использоваемой для редактирования секции
     *
     * @returns {Claim_Receipt_Product_DepotDetailedManager_Transfer_Form|null}
     */
    this.getDepotDetailedManagerTransferForm = function (sectionTr) {
        var ddIdInput = sectionTr.find('input[type="hidden"][data-rowdata-field-name="dd_id"]');
        if (ddIdInput.length) {
            if (!(parseInt(ddIdInput.val()) > 0)) {
                try {
                    _tools.throwError(new Error('Не найден идентификатор секции'), _tools.defaultAlertErrorMessage);
                } catch (e) { _tools.processError(e); }
            }

            var ddId = parseInt(ddIdInput.val());

            if (this.depotDetailedManagerTransferForms[ddId]) {
                return this.depotDetailedManagerTransferForms[ddId]
            }
        }

        return null;
    };

    /**
     * Метод создает (в случае необходимости) и возвращает объект формы блокировки секции под менеджеров
     *
     * @param sectionTr $-объект строки, использоваемой для редактирования секции
     *
     * @returns {Claim_Receipt_Product_DepotDetailedManager_Transfer_Form}
     */
    this.createDepotDetailedManagerTransferForm = function (sectionTr) {
        var ddIdInput = sectionTr.find('input[type="hidden"][data-rowdata-field-name="dd_id"]');
        if (!(ddIdInput.length && parseInt(ddIdInput.val()) > 0)) {
            try {
                _tools.throwError(new Error('Не найден идентификатор секции'), _tools.defaultAlertErrorMessage);
            } catch (e) { _tools.processError(e); }
        }

        var ddId = parseInt(ddIdInput.val());

        /** @type {Claim_Receipt_Product_DepotDetailedManager_Transfer_Form} */
        var form;
        if (form = this.getDepotDetailedManagerTransferForm(sectionTr)) {
            form.actualizeState();
        } else {
            this.depotDetailedManagerTransferForms[ddId] = form = new Claim_Receipt_Product_DepotDetailedManager_Transfer_Form({
                ddId: ddId,
                receiptForm: this
            });
        }

        return form;
    };

    /**
     * Метод выполняет отображение ошибки для секции
     *
     * @param sectionTr
     * @param message
     */
    this.addSectionTrError = function(sectionTr, message) {
        sectionTr.addClass('ddm-errored');
        if (message) {
            // Добавляем сообщение об ошибке в тег `title`
            sectionTr.attr('title', message);
        }
    };


    /**
     * Метод возвращает начальную информацию по блокировкам секции под менеджеров
     *
     * @param $sectionTr Строка, с помощью которой осуществляется редактирование секции на форме
     *
     * @returns {null}
     */
    this.getSectionDdmInitialInfo = function($sectionTr) {
        return Claim_Receipt_Product_DepotDetailedManager_Transfer_Form.prototype.getSectionDdmInitialInfo.apply({
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
     * Валидация блокировок секций под менеджеров
     *
     * @returns {boolean}
     */
    this.validateDepotDetailedManager = function() {
        var self = this;

        var result = true;

        // Сбрасываем ошибки детализаций броней под менеджеров
        $('#claim-form').find('tr.ddm-errored').removeClass('ddm-errored').attr('title', null);

        // Проверка детализации блокировок под менеджеров
        $('#claim-form .table_products_tbody tr[type="section"]').each(function (e) {
            var sectionTr = $(this);
            var pnumber = sectionTr.attr('pnumber');
            var snumber = sectionTr.attr('snumber');

            // Данные по блокировке секции под мнеджеров
            var sectionDdmInfo = self.getSectionDdmInfo(sectionTr);
            if (sectionDdmInfo.managersRowsCount > 0) {
                var depotDetailedManagerTransferForm = self.getDepotDetailedManagerTransferForm(sectionTr);

                var sectionData = Claim_Receipt_Product_DepotDetailedManager_Transfer_Form.prototype.getSectionTrData.apply({
                    getBindedSectionTr: function () { return sectionTr; },
                    getItemType: function () { return parseInt($(self.blockId).find('input[name="products[' + pnumber + '][itemtype]"]').val());},
                    getField10: function () { return parseFloat($(self.blockId).find('input[name="products[' + pnumber + '][field10]"]').val());},
                    getSectionDdmInitialInfo: function () { return sectionDdmInfo; }
                });

                if (
                    (Math.abs(parseFloat(sectionDdmInfo.ddData.amount||0) - parseFloat(sectionData.amount||0)) > 0.00001) ||
                    (Math.abs(parseFloat(sectionDdmInfo.ddData.boxes||0) - parseFloat(sectionData.boxes||0)) > 0.00001)
                ) {
                    // Если есть расхождение в количествах

                    // Есть ли возможность переноса всего количества в секции под одного менеджера (если есть только одна блокировка под менеджера)
                    var availableToSetAllAmountToOneManager = parseInt(sectionDdmInfo.managersRowsCount) === 1;
                    // Результат автоматического переноса
                    var autoAllocationResult = false;
                    if (
                        availableToSetAllAmountToOneManager
                        && confirm("Для секции №  " + sectionTr.attr('snumber') + " по товару № " + pnumber + " id: " + $(self.blockId).find('input[name="products[' + pnumber + '][sections][' + snumber + '][product_id]"]').val() + " необходимо перераспределение блокировок под менеджеров. \r\n\r\nПеренести всё доступное количество под одного менеджера?")
                    ) {
                        if (!depotDetailedManagerTransferForm) {
                            // Создаем форму
                            depotDetailedManagerTransferForm = self.createDepotDetailedManagerTransferForm(sectionTr);
                        } else {
                            depotDetailedManagerTransferForm.actualizeState();
                        }

                        if (!(autoAllocationResult = depotDetailedManagerTransferForm.allSectionAmountToOneDdmRow())) {
                            alert("Произошла ошибка при автоматическом перераспределении. \r\n\r\nПожалуйста, отредактируйте форму БЛОКИРОВКИ СЕКЦИИ ПОД МЕНЕДЖЕРОВ самостоятельно.");
                        }
                    }

                    if (!depotDetailedManagerTransferForm && !autoAllocationResult) {
                        self.addSectionTrError(Claim_Receipt_Product_DepotDetailedManager_Transfer_Form.prototype.getBindedSectionTr.apply({
                            ddId: sectionTr.find('input[type="hidden"][data-rowdata-field-name="dd_id"]').val()
                        }), 'Суммарное количество по блокировкам под менеджеров должно быть равно общему количеству по секции');
                        result = false;
                    }
                }

                if (depotDetailedManagerTransferForm) {
                    // В случае, если для этой секции есть открытая форма, сделаем проверку формы

                    // Перед проверкой формы делаем загрузку актуального состояния
                    if (!depotDetailedManagerTransferForm.actualizeState().validate(false)) {
                        self.addSectionTrError(sectionTr, depotDetailedManagerTransferForm.validation.getErrorInfo('При проверке формы БЛОКИРОВКИ СЕКЦИИ ПОД МЕНЕДЖЕРОВ обнаружены ошибки:'));
                        result = false;
                    }
                }
            }
        });

        return result;
    };

    /**
     * Проверить заполение процента потерь
     * @returns {boolean}
     */
    this.checkPercentOff = function ()
    {
        if (!parseInt(fieldPermissions.check_percentoff)) {
            return true;
        }

        let error = false;
        $('input[name*="[percentoff]"]').each((i, e) =>
        {
            if (!parseFloat(e.value)) {
                error = true;
            }
        });

        if (error && !window.confirm('Внимание! % потерь не заполнен. Что бы не получить штраф, проверьте все внимательно!')) {
            return false;
        }
        return true;
    };

    /**
     * Установить поле с контроллером
     * @param {ReceiptController} $ctrl
     */
    this.setAngularController = $ctrl =>
    {
        this.$ctrl = $ctrl;

        // проверка заполненности названия в дополнительных товарах
        if (typeof productsExtra != 'undefined') {
            productsExtra.showProductEditor = (formData) => {
                this.$ctrl.showProductEditor(formData);
            }
        }
    }

    /**
     * Обработчик события
     * @return {void}
     */
    this.onAfterClaimProductApply = () =>
    {
        this.$ctrl.onAfterClaimProductApply();
        this.onClaimProductApplyCallback();
    };

    /**
     * Получить id склада по прикрепленным товарам
     * @return {number | null}
     */
    this.getDepotId = () =>
    {
        const inputs = $('#products input[type="hidden"].js-item-depot-id');
        const resultSet = new Set();
        let result = null;

        inputs.each((index, element) =>
        {
            resultSet.add(element.value);
        });

        if (resultSet.size > 1) {
            alert('Найдены товары с разными складами! Обратитесь к администратору');
        } else if (resultSet.size) {
            result = parseInt(resultSet.values().next().value);
        }

        return result;
    }

    for(var i in param){
        this[i] = param[i];
    }

    this.init();
};
