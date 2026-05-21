var structure = new (function()
{
    this._controls = {};

    this.afterUpdateFieldsListeners = [];

    this.onAfterUpdateFields = function (listener)
    {
        this.afterUpdateFieldsListeners.push(listener);
    };

    /**
     * Инициализация плагина
     * @return void
     */
    this.init = function(data)
    {
        var self = this;

        /**
        * typeId договора
        * @type {number}
        */
        this.typeId = $('#contractTypeId').val();

        // Установка параметров
        this.data = data;

        // Инициализация обработчика печатей
        this.seal.initSeals();

        // Инициализация обработчика разделов
        this.article.initSelect();

        // Инициализация календаря
        this.almanac.initCalendar();

        // Инициализация календаря для дат
        this.customContractDate.init();

        // Инициализация обработчика клиента
        this.singleClient.initSelect();

        // Инициализация обработчика KПП
        this.kpp.initSelect();

        // Инициализация обработчика "Тип договора"
        this.subType.initSelect();

        // Инициализация обработчика "Тип Доставки"
        this.contractType.initSelect();

        // Инициализация кнопки "Сохранить"
        this.save.initButton();

        // Инициализация кнопки "Печать"
        this.print.initButton();

        // Инициализация кнопки "Отправить по почте"
        this.sendMail.initButton();

        // Инициализация обработчика "Исполнитель"
        this.executorId.initSelect();

        // Инициализация обработчик "Конфигурация проекта"
        this.configuration.initSelect();

        // Инициализация списка водителей
        this.driver.initSelect();

        // Инициализация списка машин
        this.vehicle.initSelect();

        // Клик по кнопкам связанным с модальными блоками
        $('[data-dynamic-block]').click(function(){
            self.toggleSelectBlock($(this));
        });

        // Обработка ввода в групповое полей
        $('.cv[data-group]').live('input', function(){
            self.fillGroupValues($(this));
        });

        // Закрыть окно
        $('#closeButton').click(function(){
            window.location.replace(self.data.urls.close);
        });

        this.salesFunnelLeadId.init();

        this.sealShow();

        for (let controlName in this._controls) {
            this._controls[controlName].init();
        }

        this.addControlEventListener('vatPayerSelect', 'change', () =>
        {
            this.updateVatFields();
        });

        this.addControlEventListener('warrantySelect', 'change', (data) =>
        {
            this.setFieldText('warrantyStr', data.text);
        });

        const warrantyEnabledCallback = () =>
        {
            const control = structure.getControl('warrantyEnableSelect');
            if (control) {
                const data = control.getValueData();

                // Скрыть все блоки не подходящие по группе
                $('.warrantyEnableField[data-warranty-enable]').hide();
                // Отобразить блок с указанной группой
                $(`.warrantyEnableField[data-warranty-enable="${data.value}"]`).show();
            }
            return warrantyEnabledCallback;
        };
        this.addControlEventListener('warrantyEnableSelect', 'change', warrantyEnabledCallback());

        this.addControlEventListener('courtRegionSelect', 'change', (data) =>
        {
            this.setFieldText('courtRegion', data.text);
            this.setFieldText('courtRegion2', data.text2);
        });
    };

    this.sealShow = function ()
    {
        var self = this;
        var selected = self.sealSelect.data('selected');
        //скрываем все печати
        $.each(self.sealSelect.find('option'), function (elementIndex, element) {
            $('[data-seal-id="' + element.value + '"]').hide();
        });
        if (selected === null || selected === undefined) {
            return true;
        }
        //показываем нужные печати
        $.each(selected, function (k, v) {
            $('[data-seal-id="' + v + '"]').show();
            self.sealSelect.find('option[value='+v+']').prop('selected', 'selected');
        });
    };


    /**
     * Заполнить поля из группы
     * @param field
     * @returns {*}
     */
    this.fillGroupValues = function(field)
    {
        // Найти поля из группы
        $('[data-group="' + field.attr('data-group') + '"]').not(field).text(field.text());

        return this;
    };


    this.updateGroupValues = function ()
    {
        let elements = {};


        $('.cv[data-group]').each((index, element) => {
            let group = element.getAttribute('data-group');

            if (!elements.hasOwnProperty(group)) {
                elements[group] = element;
            } else {
                element.innerText = elements[group].innerText;
            }
        })
    }


    /**
     * Показать скрыть блок с селектом
     * @param button
     */
    this.toggleSelectBlock = function(button)
    {
        // Скрыть все блоки кроме целевого
        $('[data-block-id]:not([data-block-id="' + button.attr('data-dynamic-block') + '"])').hide();
        // Отобразить целевой блок
        $('[data-block-id="' + button.attr('data-dynamic-block') + '"]').toggle();
    };


    /**
     * Обработчик печатей
     * @type {{initSeals: initSeals}}
     */
    this.seal =
    {
        initSeals: function()
        {
            var self = structure;

            // Селект с печатями
            self.sealSelect = $('#sealSelect').html('');

            // Перебрать печати из параметров, вставить печати в блоки
            structure.seal.setSeals(self.data.seals);

            // Скрытие/Отображение печатей
            $('.sealSelectButton').click(function(){
                // Действие которое нужно произвести на печатью
                var action = this.getAttribute('data-action');
                // Перебрать печати из списка, найти соответствующую печать и обработать её
                $.each(self.sealSelect.find('option:selected'), function(elementIndex, element) {
                    $('[data-seal-id="' + element.value + '"]')[action]();
                });
                // Скрыть селект с печатями
                //structure.toolPanel.hideDynamicBlock(this);
                $('#sealButton').click();
            });

            // Клик по кнопке "Печати"
            $('#sealButton').click(function(){
                // Снять выделение со всех опций
                self.sealSelect.find('option').prop({selected: false});
                // Выделить только видимые печати
                $.each($('[data-seal-id]:visible'), function(elementIndex, element){
                    $('select#sealSelect [value="' + element.getAttribute('data-seal-id') + '"]').prop({ selected: true });
                });
                self.sealSelect.data('selected', self.sealSelect.val());
            });
        },
        setSeals: function(seals)
        {
            var self = structure;

            // Удалить существующие печати
            $('[data-seal-id]').remove();

            // Очистить список с печатями
            self.sealSelect.html('');

            if (seals) {
                // Перебрать печати из параметров, вставить печати в блоки
                $.each(seals, function (sealId, sealParams) {
                    // Добавить печать в список для управления
                    self.sealSelect.append('<option value="' + sealId + '">' + (sealParams.title ? sealParams.title : ('Изображение_' + sealId)) + '</option>');

                    // Установить стили для контейнера печати, вставить печать в контейнер
                    $('[data-seal="' + sealId + '"]')
                        .attr('style', sealParams.spotCss)
                        .append(self.elementFactory.stampImg(sealId, sealParams));
                });
            }

            self.sealShow();
        }
    };


    /**
     * Обработчик разделов
     * @type {{initSelect: initSelect}}
     */
    this.article =
    {
        initSelect: function()
        {
            var self = structure;

            // Предварительно очищенный селект с разделами
            self.articleSelect = $('#articleSelect').html('');

            // Сформировать набор элементов для селекта
            $.each($('[data-article-id]'), function(elementId, elementData) {
                self.articleSelect.append('<option value="' + elementData.getAttribute('data-article-id') + '">' + elementData.getAttribute('data-article-title') + '</option>');
            });

            // Скрытие/Отображение "Разделов"
            $('.articleButton').click(function(){
                // Действие которое нужно произвести на печатью
                var action = this.getAttribute('data-action');
                // Перебрать печати из списка, найти соответствующую печать и обработать её
                $.each(self.articleSelect.find('option:selected'), function(elementIndex, element) {
                    $('[data-article-id="' + element.value + '"]')[action]();
                });
                // Клик по кнопке показать/скрыть раздел
                structure.toolPanel.hideDynamicBlock(this);
            });

            // Клик по кнопке разделы
            $('#articleButton').click(function(){
                // Снять выделение со всех опций
                self.articleSelect.find('option').prop({selected: false});
                // Выделить только видимые разделы
                $.each($('[data-article-id]:visible'), function(elementIndex, element){
                    $('select#articleSelect [value="' + element.getAttribute('data-article-id') + '"]').prop({ selected: true });
                });
            });
        }
    };


    /**
     * Обработчик даты
     * @type {{initCalendar: initCalendar}}
     */
    this.almanac =
    {
        _eventListeners: {'select': []},
        // Инициализация календаря
        initCalendar: function()
        {
            const self = structure;
            const btn  = $('#contractDatePickerButton');

            // Предварительно очищенный селект с разделами
            self.contractDatePicker = $("#contractDatePicker");

            // Выбор даты в календаре
            self.contractDatePicker.datepicker({
                onSelect: function(regularDate)
                {
                    // Обновить значение кнопки
                    btn.val(regularDate);

                    // Скрыть блок с календарем
                    structure.toolPanel.hideDynamicBlock(self.contractDatePicker);

                    for(const listener of structure.almanac._eventListeners.select){
                        listener(structure.almanac.getDate());
                    }

                    self.almanac.updateFields();
                }
            });

            // Клик по кнопке дата
            btn.click(function ()
            {
                self.contractDatePicker.datepicker('setDate', new Date(dateStringHelper.regularToSqlDate(this.value)));
            });

            self.contractDatePicker.datepicker('setDate', new Date(dateStringHelper.regularToSqlDate(btn.val())));
        },
        showTitle: function()
        {
            var date = structure.contractDatePicker.val().split('.');
            var contractDate = new Date(date[2] + '-' + date[1] + '-' + date[0]);
            var resetDate = new Date('2016-03-02');
            var newTitle = contractDate > resetDate;

            $('span[data-contract-title="v1"]').css('display', newTitle ? 'none' : 'inline');
            $('span[data-contract-title="v2"]').css('display', newTitle ? 'inline' : 'none');
        },
        updateFields: function ()
        {
            const self         = structure;
            const regularDate  = structure.contractDatePicker.val();
            const date         = regularDate.split('.');

            // Обновить значение в договора
            $('.contractDate').text(dateStringHelper.regularDateToContractDate(regularDate));
            //Год в номере договора
            $('.contractPeriod').text(date[2]);
            //действует до
            $('[data-field=contractDateToDay]').text(date[0]);
            $('[data-field=contractDateToMonth]').text(dateStringHelper.getMonthName(2, date[1]));
            $('[data-field=contractDateToYear]').text(parseInt(date[2]) + 1);

            self.almanac.showTitle();
            self.updateVatFields();
        },
        getDate: function ()
        {
            const date = structure.contractDatePicker.val().split('.');

            return new Date(date[2] + '-' + date[1] + '-' + date[0]);
        },
        addEventListener: function (type, listener)
        {
            if (this._eventListeners[type]) {
                this._eventListeners[type].push(listener);
            }
        }
    };


    /**
     * Обработка дат без привязки к конкретному пол.
     * @type {{init: customContractDate.init}}
     */
    this.customContractDate =
    {
        init: function()
        {
            var customContractDateCalendar = $('.custom-contract-date');

            customContractDateCalendar.datepicker({
                changeMonth: true,
                changeYear: true,
                onSelect: function(regularDate)
                {
                    customContractDateCalendar.data('bind-field').text(
                        dateStringHelper.regularDateToContractDate(regularDate)
                    );
                    // Обновить связанные поля
                    structure.fillGroupValues(customContractDateCalendar.data('bind-field'));
                    // Скрыть блок
                    structure.toolPanel.hideDynamicBlock(customContractDateCalendar);
                }
            });

            $('.custom-contract-date-field').click(function()
            {
                customContractDateCalendar.datepicker(
                    'setDate', new Date(dateStringHelper.contractDateToSqlDate($(this).text()))
                );

                customContractDateCalendar.data({
                    'bind-field': $(this)
                });
            });
        }
    };

    /**
     * Обработчик одиночных клиентов
     * @type {{initSelect: initSelect}}
     */
    this.singleClient =
    {
        value: null,
        data: {},
        initSelect: function()
        {
            var self = structure;

            // Селект с клиентами
            self.singleClientSelect = $('#singleClientSelect');
            var blacklistWarning = $('.js-single-client-select-blacklist-warning');
            var singleClientButton = $('.singleClientButton');

            self.singleClientSelect.on('click', function () {
                var option = $(this).find('option:selected');

                singleClientButton.prop('disabled', false);
                if (option.data('in-blacklist') > 0) {
                    blacklistWarning.show();
                    blacklistWarning.find('.js-blacklist-annotation').text(option.data('blacklist-annotation'));

                    if (option.data('disabled') > 0) {
                        singleClientButton.prop('disabled', true);
                    }
                } else {
                    blacklistWarning.hide();
                }
            });

            // Установить декоратор быстрого поиска
            $('#singleClientSelectSearch').fieldDecorator({ decorator: 'search' });

            // Кнопка "Выбрать клиента"
            singleClientButton.click(function(e) {
                // Выделенная опция
                var selectedOption = self.singleClientSelect.find('option:selected');
                // Наличие выделенной опции
                if (!selectedOption.length) {
                    return alert('Необходимо выбрать клиента!');
                }

                // Наличие клиентских данных
                if (typeof self.data.singleClient === 'undefined') {
                    // установка данных по клиенту
                    var clientData = self.singleClient.getClientData(selectedOption.val());
                    // Запуск метода по умолчанию
                    self.singleClient.applyClientData(clientData);
                    // обновление списка КПП
                    self.kpp.updateKppList(clientData.kppList);

                    self.singleClient.addClientCard(clientData);
                } else if (typeof self.data.singleClient.onApply === 'function') {
                    // Вызов клиентского метода
                    self.data.singleClient.onApply(selectedOption);
                }

                structure.toolPanel.hideDynamicBlock(this);
                structure.singleClient.value = selectedOption.val();

                let event = new CustomEvent('single-client-selected', {
                    detail: clientData,
                });

                document.dispatchEvent(event);

                return this;
            });
            //обновляем поля
            this.updateFields();

        },
        addClientCard: function (clientData)
        {
            $('[data-field="customerNameRod"]').next('.client-card-info').remove();
            $('[data-field="customerNameRod"]').after('<i class="client-card-info fa-solid fa-circle-info"></i>');

            const controls = $('i.client-card-info');

            controls.click(function ()
            {
                (new AjaxForm(
                        `
                        <section>
                            <form>
                                <header>
                                    <h1>Информация по клиенту</h1>
                                </header>
                    
                                <table class="table-std">
                                    <tbody>
                                    <tr>
                                        <th>Название</th>
                                        <td>${clientData.lawForm} "${clientData.lawName}"</td>
                                    </tr>
                                    <tr>
                                        <th>Руководитель</th>
                                        <td>${clientData.gendirektor}</td>
                                    </tr>
                                    <tr class="client-info-form__card">
                                        <th>Карточка</th>
                                        <td></td>
                                    </tr>
                                </tbody>
                                </table>
                    
                                <footer>
                                    <input type="button" data-form-button="hide" value="закрыть"/>
                                </footer>
                            </form>
                        </section>
                        `,
                        {
                            destroyOnHide    : true,
                            width            : 500,
                            hideOnEscape     : true,
                            postBuildCallback: (form) =>
                            {
                                const row = form.getDomObject().find('.client-info-form__card');

                                if (clientData.card) {
                                    const file = $(`<span>${clientData.card.fileName} <i class="client-info-form__preview fa-solid fa-eye"></i></span>`);

                                    file.find('.client-info-form__preview').click(() =>
                                    {
                                        Filemanager_PreviewHelper.open(clientData.card);
                                    });

                                    row.find('td').append(file);
                                } else {
                                    row.hide();
                                }
                            }
                        }
                    )
                ).show();
            });
        },
        updateFields: function(){
            var self = structure;
            var clientData = this.data;

            //если нет информации по клиенту
            if(!clientData.kppList){
                //из-за поля email клиента
                var selectedOption = self.singleClientSelect.find('option:selected');
                // если никто не выбран выходим
                if (!selectedOption.length) {
                    return false;
                }
                clientData = self.singleClient.getClientData(selectedOption.val());
            }

            for(var key in clientData){
                //обновляем свойства введенными/сохраненными значениями
                /*if(typeof clientData[key] !== 'object' || clientData[key] === null){
                    clientData[key] = $('[data-field=' + key + ']:first').text();
                }*/
                //обновляем свойства кот. можно редактировать
                if (key === 'kpp') {
                    var field = $('[data-field=kpp]:first');
                } else {
                    var field = $('[data-field=' + key + '][contenteditable]:first');
                }

                if(field.length){
                    clientData[key]=field.text();
                }
            }

            // Запуск метода по умолчанию
            self.singleClient.applyClientData(clientData);
            // обновление списка КПП
            self.kpp.updateKppList(clientData.kppList);

            self.singleClientSelect.trigger('click');

            self.singleClient.addClientCard(clientData);

        },
        // Получить данные о клиенте
        getClientData: function(clientId)
        {
            var clientData = {};

            $.ajax({
                url      : '/libdoc/ajax_contracts_contract' + structure.typeId + '/get-client-data',
                async    : false,
                type     : 'POST',
                data     : { clientId: clientId },
                dataType : 'json',
                success  : function(resp)
                {
                    // удаляем данные от AjaxForm
                    delete(resp.success);
                    delete(resp.messages);

                    clientData = resp;
                }
            });

            return clientData;
        },
        // Принять клиентские данные
        applyClientData: function(clientData)
        {
            var self = this;
            this.data = clientData;

            $.each(this.data, function(fieldName, fieldValue){
                $('.sc[data-field=' + fieldName + ']').html(self.dataFormatter(fieldName, fieldValue));
            });
        },
        // Форматировщик данных клиента
        dataFormatter: function(fieldName, fieldValue)
        {
            // Если есть метод форматировщик значения, вернуть отформатировнное значение
            if(typeof this.dataFormats[fieldName] === 'function') {
                return this.dataFormats[fieldName](fieldValue);
            }

            return fieldValue;
        },
        // Шаблоны для форматирования
        dataFormats: {
        }
    };

    /**
     * Обработчик водителей
     * @type {{initSelect: initSelect}}
     */
    this.driver =
    {
        value: null,
        data: {},
        initSelect: function()
        {
            var self = structure;

            // Селект с клиентами
            self.driverSelect = $('#driverSelect');

            var selectedOption = self.driverSelect.find('option:selected');
            structure.driver.value = selectedOption.val();

            // Установить декоратор быстрого поиска
            $('#driverSelectSearch').fieldDecorator({ decorator: 'search' });

            // Кнопка "Выбрать клиента"
            $('.driverButton[data-action="apply"]').click(function(e) {
                // Выделенная опция
                var selectedOption = self.driverSelect.find('option:selected');
                // Наличие выделенной опции
                if (!selectedOption.length) {
                    return alert('Необходимо выбрать водителя!');
                }

                // Наличие клиентских данных
                if (typeof self.data.driver === 'undefined') {
                    // установка данных по клиенту
                    var data = self.driver.getData(selectedOption.val());
                    // Запуск метода по умолчанию
                    self.driver.applyData(data);

                } else if (typeof self.data.driver.onApply === 'function') {
                    // Вызов клиентского метода
                    self.data.driver.onApply(selectedOption);
                }

                structure.toolPanel.hideDynamicBlock(this);
                structure.driver.value = selectedOption.val();

                return this;
            });

            $('.driverButton[data-action="hide"]').click(function(e) {
                structure.toolPanel.hideDynamicBlock(this);
                self.driverSelect.val(structure.driver.value);

                return this;
            });

            //обновляем поля
            this.updateFields();
        },
        updateFields: function(){
            let selectedOption = structure.driverSelect.find('option:selected');
            if (selectedOption.length === 0) {
                return ;
            }

            this.data = this.getData(selectedOption.val());

            // Запуск метода по умолчанию
            structure.driver.applyData(this.data);
        },
        // Получить данные о клиенте
        getData: function(id)
        {
            var data = {};

            $.ajax({
                url      : '/libdoc/ajax_contracts_contract' + structure.typeId + '/get-driver-data',
                async    : false,
                type     : 'POST',
                data     : { id },
                dataType : 'json',
                success  : function(resp)
                {
                    data = resp;
                }
            });

            return data;
        },
        // Принять клиентские данные
        applyData: function(data)
        {
            var self = this;
            this.data = data;

            $.each(this.data, function(fieldName, fieldValue){
                $('.driver[data-field=' + fieldName + ']').html(self.dataFormatter(fieldName, fieldValue));
            });
        },
        // Форматировщик данных клиента
        dataFormatter: function(fieldName, fieldValue)
        {
            // Если есть метод форматировщик значения, вернуть отформатировнное значение
            if(typeof this.dataFormats[fieldName] === 'function') {
                return this.dataFormats[fieldName](fieldValue);
            }

            return fieldValue;
        },
        // Шаблоны для форматирования
        dataFormats: {
        }
    };

    this.vehicle =
    {
        value: null,
        options: {},
        data: {},
        initSelect: function()
        {
            var self = structure;

            // Селект с клиентами
            self.vehicleSelect = $('#vehicleSelect');

            var selectedOption = self.vehicleSelect.find('option:selected');
            structure.vehicle.value = selectedOption.val();

            self.vehicleSelect.on('change', function () {
                var selectedOption = self.vehicleSelect.find('option:selected');

                // установка данных по клиенту
                var data = self.vehicle.getData(selectedOption.val());
                // Запуск метода по умолчанию
                self.vehicle.applyData(data);

                structure.vehicle.value = selectedOption.val();
            });

            //обновляем поля
            this.updateFields();
        },
        updateFields: function(){
            let selectedOption = structure.vehicleSelect.find('option:selected');
            if (selectedOption.length === 0) {
                return ;
            }

            this.data = this.getData(selectedOption.val());

            // Запуск метода по умолчанию
            structure.vehicle.applyData(this.data);
        },
        // Получить данные о клиенте
        getData: function(id)
        {
            return this.options[id];
        },
        // Принять клиентские данные
        applyData: function(data)
        {
            this.data = data;

            $(`[data-vehicle-field]`).text('');
            if (data) {
                for (let [key, value] of Object.entries(data)) {
                    $(`[data-vehicle-field="${key}"]`).text(value);
                }
            }
        }
    };


    /**
     * Обработчик "КПП клиента"
     * @type {{initSelect: initSelect}}
     */
    this.kpp =
    {
        initSelect: function()
        {
            var self = structure;

            // Селект с КПП клиента
            self.kppSelect = $('#kppSelect');

            // Изменение в селекте
            self.kppSelect.change(function() {
                // Нет клиентских данных для КПП
                if (typeof self.data.kpp === 'undefined') {
                    self.kpp.applyKpp($(this).find('option:selected').data('kpp'));
                } else if (typeof self.data.type.onChange === 'function') {
                    self.data.kpp.onChange($(this));
                }
            });
        },
        // Установить значение для всех полей КПП
        applyKpp: function(kpp)
        {
            $('[data-field="kpp"]').html(kpp);
        },
        // обновление списка КПП
        updateKppList: function(kppList)
        {
            var option = $('<option>');
            var count = 0;
            var kpp = $('#kppSelect');
            var select = kpp.val();

            // очистка списка КПП
            kpp.html('');

            // установка списка КПП
            $.each(kppList, function(kppId, kppData)
            {
                // если КПП активен, добавление его в список
                if (kppData.state != 0) {
                    var selected = (select == kppId);
                    kpp.append(option.clone().val(kppId).text(kppData.title).prop('selected', selected).data('kpp', kppData.kpp));
                    count++;
                }
            });

            // если нет добавленных КПП, установка поля Нет данных
            if (count < 1) {
                kpp.append(option.clone().val('0').text('Нет данных'));
            }
        }
    };


    /**
     * Обработчик "Подтип договора"
     * @type {{initSelect: initSelect, toggleTypeBlocks: toggleTypeBlocks}}
     */
    this.subType =
    {
        value: null,
        initSelect: function()
        {
            var self = structure;

            // Селект с КПП клиента
            self.subTypeSelect = $('#subTypeSelect');

            // Изменение в селекте
            self.subTypeSelect.change(function() {
                self.subType.value = this.value;
                // Нет клиентских данных для типа
                if (typeof self.data.subType === 'undefined') {
                    self.subType.toggleTypeBlocks(this.value);
                } else if (typeof self.data.subType.onChange === 'function') {
                    self.data.subType.onChange($(this));
                }
            });

            // Для скрытия ненужных и отображения нужных блоков генерируем событие смены типа
            self.subTypeSelect.change();
        },
        // Скрывает отображает блоки с данными для определенного типа
        toggleTypeBlocks: function(subTypeId)
        {
            // Скрыть все блоки не подходящие по группе
            $('[data-type-id]:not([data-type-id="' + subTypeId + '"])').hide();
            // Отобразить блок с указанной группой
            $('[data-type-id="' + subTypeId + '"]').show();
        },
        updateFields: function ()
        {
            var self = structure;
            self.subType.toggleTypeBlocks(self.subType.value);
        }
    };

    /**
     * Обработчик "Тип Доставки"
     * @type {{initSelect: initSelect, toggleTypeBlocks: toggleTypeBlocks}}
     */
    this.contractType =
    {
        value: null,
        initSelect: function()
        {
            var self = structure;

            // Список с типом доставки
            self.contractTypeSelect = $('#contractTypeSelect');

            self.contractTypeSelect.change(function() {
                self.contractType.value = this.value;
                // Нет клиентских данных для типа
                if (typeof self.data.contractType === 'undefined') {
                    self.contractType.toggleTypeBlocks(this.value);
                } else if (typeof self.data.contractType.onChange === 'function') {
                    self.data.contractType.onChange($(this));
                }
            });

            // Для скрытия ненужных и отображения нужных блоков генерируем событие смены типа
            self.contractTypeSelect.change();
        },
        // Скрывает отображает блоки с данными для определенного типа
        toggleTypeBlocks: function(contractTypeId)
        {
            // Скрыть все блоки не подходящие по группе
            $('.contractTypeSelect[data-contract-type-id]:not([data-contract-type-id="' + contractTypeId + '"])').hide();
            // Отобразить блок с указанной группой
            $('.contractTypeSelect[data-contract-type-id="' + contractTypeId + '"]').show();
        },
                updateFields: function ()
                {
                    var self = structure;
                    self.contractType.toggleTypeBlocks(self.contractType.value);
                }
    };


    /**
     * Обработчик "Исполнитель"
     * @type {{initSelect: executorId.initSelect, updateSignature: executorId.updateSignature}}
     */
    this.executorId =
    {
        initSelect: function()
        {
            var self = structure;

            // Список исполнителей
            self.executorSelect = $('#executorSelect');

            // Есть список с исполнителями
            if (self.executorSelect.length) {
                // Изменение в списке
                self.executorSelect.change(function()
                {
                    structure.configuration.changeSection(structure.configurationSelect.val());
                });
            }
        },
    };


    /**
     * Обработчик "Конфигурации проекта"
     * @type {{initSelect: initSelect}}
     */
    this.configuration =
    {
        value: null,
        initSelect: function()
        {
            var self = structure;

            // Селект с КПП клиента
            self.configurationSelect = $('#configurationSelect');

            // Изменение в селекте
            self.configurationSelect.change(function()
            {
                // Нет клиентских данных для КПП
                if (typeof self.data.configuration === 'undefined'){
                    self.configuration.changeSection(this.value)
                } else if (typeof self.data.type.onChange === 'function'){
                    self.data.configuration.onChange($(this));
                }

                // изменяем title страницы
                document.title = document.title.split('::')[0] + ":: " + $(this).find('option:selected').text().replace(/(\(.+\)|[^а-я\s\-])/gi, '');

                //показываем/скрываем печати
                self.sealShow();
            });
            self.configuration.value = self.configuration.getSectionData(self.configurationSelect.val());
            // для совместимости
            self._configurationData = self.configuration.value;
        },
        // Выбор секции конфига
        changeSection: function(sectionId)
        {
            var self = structure;
            // Получить данные конфигурации с сервера
            self.configuration.value = self.configuration.getSectionData(sectionId);
            // для совместимости
            self._configurationData = self.configuration.value;

            self.configuration.updateFields();
        },
        getSectionData: function(sectionId)
        {
            var sectionData = {};

            // Запрос конфигурации
            $.ajax({
                url      : '/libdoc/ajax_contracts_contract' + structure.typeId + '/get-config-section',
                async    : false,
                type     : 'POST',
                data     : { sectionId : sectionId, executorId: structure.executorSelect.val() },
                dataType : 'json',
                success  : function(resp)
                {
                    sectionData = resp;
                }
            });

            return sectionData;
        },
                updateFields: function ()
                {
                    // значения по умолчанию
                    const defaultValues = {
                        contractRegion: 'Московская область<br>город Подольск',
                        courtRegion: {
                            0: {
                                title: 'Московская область',
                                text : 'Московской области',
                                text2: 'Подольский городской суд Московской области'
                            }
                        },
                    };
                    const sectionData   = structure.configuration.value;

                    for (let [key, value] of Object.entries(defaultValues)) {
                        if (sectionData[key] === undefined) {
                            sectionData[key] = value;
                        }
                    }

                    if (structure.getControl('courtRegionSelect')) {
                        const control = structure.getControl('courtRegionSelect');
                        const options = [];

                        for (let [id, data] of Object.entries(sectionData.courtRegion)) {
                            data.value = id;
                            options.push(data);
                        }

                        control.setOptions(options);

                        const selected = sectionData.courtRegion[control.getValue()];

                        structure.setFieldText('courtRegion', selected.text);
                        structure.setFieldText('courtRegion2', selected.text2);

                        if (options.length === 1) {
                            control.hide();
                        } else {
                            control.show();
                        }
                    }

                    // Обновить текстовые значения связанные с конфигурацией
                    $.each(sectionData, function (fieldName, fieldValue)
                    {
                        $('[data-field="_' + fieldName + '"]').html(fieldValue);
                    });

                    $('[data-form]').hide();
                    $('[data-form="' + sectionData.form + '"]').show();
                    // Обновить печати
                    if (sectionData.seals != null && sectionData.seals != undefined) {
                        structure.seal.setSeals(sectionData.seals[$('#contractTypeTitle').val()]||sectionData.seals.default);
                    }

                    if (+sectionData.disableVAT) {
                        document.body.classList.add('vat_disable');
                    } else {
                        document.body.classList.remove('vat_disable');
                    }
                    if (+sectionData.license) {
                        document.body.classList.add('conf__license_enable');
                    } else {
                        document.body.classList.remove('conf__license_enable');
                    }
                    if (+sectionData.isDivision) {
                        document.body.classList.add('conf__is-division');
                    } else {
                        document.body.classList.remove('conf__is-division');
                    }

                    for (let listener of structure.afterUpdateFieldsListeners) {
                        listener();
                    }
                }
    };


    /**
     * Клик по кнопке сохранить
     * @type {{initButton: initButton}}
     */
    this.info = {
        initButton: function()
        {
            // Селект с КПП клиента
            structure.saveButton = $('#saveButton');

            // Клик по кнопке сохранить
            structure.saveButton.click(function(){
                // Вызывем клиентскую функцию
                if (typeof structure.data.info !== 'undefined' && typeof structure.data.info.onClick === 'function') {
                    structure.data.info.onClick($(this));
                } else {
                    alert('Не определена клиентская функция!');
                }
            });
        },
        // Сбора данных со всех полей
        collectData: function()
        {
            var self = this;

            // Шаблон с данными
            var values = { data: {
                sealSelect: $('#sealSelect').val()
            } };
            // Сбора элементов и данных
            $.each($('[data-field]'), function(elementId, elemet){
                switch(true) {
                    case $(elemet).is('.dt'):
                    case $(elemet).is('.cv, .cd'):
                        self.valueExtractor(elemet, values.data);
                        break;
                    default:
                        self.valueExtractor(elemet, values);
                        break;
                }
            });

            // Установить занчения для ID договора и Даты договора
            values = $.extend({
                id: $('#contractId').val(),//values.contractId,
                number: values.contractNumber,
                recordDate: dateStringHelper.contractDateToSqlDate(values.contractDate),
                leadId: $('[name="leadId"]').val(),
                leadProjectId: $('[name="leadProjectId"]').val(),
            }, values);

            return values;
        },
        // Получает значение из поля в зависимости от типа поля
        valueExtractor: function(elemet, container)
        {
            // Определение метода сбора данных в зависимости от типа элемента
            switch (elemet.tagName) {
                case 'INPUT':
                case 'SELECT':
                    container[elemet.getAttribute('data-field')] = elemet.value;
                    break;
                default:
                    container[elemet.getAttribute('data-field')] = elemet.innerHTML;
                    break;
            }
        },
        // Отправить запрос на сохранение договора
        saveRequest: function(requestData, redirectUrl, requestUrl)
        {

            requestUrl=requestUrl||'/libdoc/ajax_contracts_contract' + structure.typeId + '/save';

            $.ajax({
                url      : requestUrl,
                async    : false,
                type     : 'POST',
                data     : { contractData : requestData },
                dataType : 'json',
                success  : function(resp)
                {
                    if (resp.result === true) {
                        if (!requestData.id) {
                            window.location.replace('/libdoc/contracts/editor/id/' + resp.id);
                        } else if (redirectUrl) {
                            window.location.replace(redirectUrl);
                        } else {
                            if (!structure.save.disableAlert) {
                                alert('Успешно сохранено');
                            }
                        }
                    } else {
                        alert(resp.message);
                    }
                }
            });
        }
    };


    /**
     * Клик по кнопке печать
     * @type {{initButton: initButton}}
     */
    this.print = {
        initButton: function()
        {
            // Селект с КПП клиента
            structure.printButton = $('#printButton');

            // Клик по кнопке сохранить
            structure.printButton.click(function(){
                structure.updateTitle();

                structure.save.disableAlert = true;
                structure.saveButton.click();
                structure.save.disableAlert = false;

                // Вызывем клиентскую функцию
                if (typeof structure.data.print !== 'undefined' && typeof structure.data.print.onClick === 'function') {
                    structure.data.print.onClick($(this));
                } else {

                    // Проверка клиента
                    if (!parseInt($('[data-field="clientId"]:first').val())) {
                        return alert('Необходимо выбрать клиента');
                    }

                    var fields = $('.rq:empty').filter(':visible');
                    //var fields = $('.rq:visible:empty'); - не всегда срабатывает
                                /* structure.subTypeSelect.length
                               ? $('[data-type-id="' + structure.subTypeSelect.val() + '"] .rq:empty')
                               : $('.rq:empty'); */

                    if (fields.length) {
                        //переносим к первому незаполненному полю - 10
                        $(document).scrollTop($(fields[0]).offset().top - 10 - $('section.controlPanel',0).height());
                        $(fields[0]).focus();
                        alert('Не заполнены обязательные поля!');
                    } else {
                        //,[data-field="customerEmail"]:empty
                        $('[data-field="email"]:empty').parent().hide();
                        window.print();
                        $('[data-field="email"]:empty').parent().show();
                    }
                }
            });
        }
    };


    /**
     * Обновить название страницы
     * @returns {undefined}
     */
    this.updateTitle = function ()
    {
        var docData = {
            number: $('span[data-field="contractNumber"]:visible:first').text(),
            date: $('span[data-field="contractDate"]:first').text()
        };

        document.title = 'Договор №' + docData.number + ' от ' + docData.date;
        //document.title = $('.documentTitle > span:visible').text();
    };

    /**
     * Кнопка отправить по почте
     * @type {{initButton: initButton}}
     */
    this.sendMail = {
        url: "/mail/send-mail/showwindowform/?type=contract",
        pdfUrl: '/libdoc/index/savepdf',
        initButton: function()
        {
            // Jquery объект кнопки
            structure.sendMailButton = $('#sendMailButton');

            // Клик по кнопке
            structure.sendMailButton.click(function(){
                structure.updateTitle();
                //Проверка на заполнение обязательных полей
                var fields = $('.rq:empty').filter(':visible');
                //var fields = $('.rq:visible:empty'); - не всегда срабатывает
                if (fields.length) {
                    //переносим к первому незаполненному полю - 10
                    $(document).scrollTop($(fields[0]).offset().top - 10 - $('section.controlPanel',0).height());
                    $(fields[0]).focus();
                    alert('Не заполнены обязательные поля!');
                    //выход из функции если есть незаполненные обязательные поля
                    return;
                }

                var siteName = document.location.origin;
                /*
                 * Добавляем http://SITE_NAME к src,href у элементов img, link
                 * это необходимо для того чтобы phantomjs мог загрузить эти ресурсы при создании
                 * pdf файла
                 */
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
                // Сохраняем всю разметку страницы
                var markup = document.documentElement.outerHTML;

                //Блокировка экрана, вывод окна загрузки на время создания pdf файла
                $('#transition-overlay').transition('show');

                //Ставим задержку 1,5 сек для того чтобы transition успел выполниться
                setTimeout(function()
                {
                    // Флаг успеха создания pdf файла
                    var success = false;
                    // Запрос на создание pdf файла
                    $.ajax({
                        type: 'POST',
                        async: false,
                        url: structure.sendMail.pdfUrl,
                        data: {
                            number: $('span[data-field="contractNumber"]:visible:first').text(),
                            data: markup,
                            date: $('span[data-field="contractDate"]:first').text(),
                            period: $('span[data-field="contractPeriod"]:visible:first').text(),
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
                        beforeSend: function()
                        {
                        },
                        complete: function()
                        {
                            // Восстанавливаем старые значения src и href
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

                            //Убираем окно блокировки
                            $('#transition-overlay').transition('hide');
                        }
                    });

                    // Если файл не создан выходим
                    if(!success) {
                        return;
                    }

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
                    var wnd = window.open(structure.sendMail.url,
                        'Отправка договора по почте',
                        "toolbar=0,height=" + h + ",width=" + w + ",top=" + Math.abs(top) + ",left=" + left
                    );
                    wnd.focus();
                }, 1500);
            });
        }
    };

    this.salesFunnelLeadId = {
        button: null,
        leadProjectElement: null,
        init: function ()
        {
            var self = structure.salesFunnelLeadId;

            self.button = $('[name="leadId"]');
            self.leadProjectElement = $('[name="leadProjectId"]');

            if (!self.button) {
                return ;
            }

            self.button.on('click', function () {
                self.showDatatable();
            });
        },
        showDatatable: function ()
        {
            var self = structure.salesFunnelLeadId;

            self.form = new AjaxForm(`
                <section class="filter-forms form-transition-white ajax-forms ajax-forms-normal">
                    <form method="post">                        
                        <header>
                            <h1>Выбор лида</h1>
                        </header>
                        
                        <iframe 
                            src="/sales-funnel/lead/filter-form/iframe?leadProjectId=${self.leadProjectElement.val()}" 
                            width="100%" 
                            height="860" 
                            style="border: none"
                        />
                        
                        <footer>
                            <input type="button" data-form-button="save" value="выбрать"/>
                            <input type="button" data-form-button="drop" value="сбросить"/>
                            <input type="button" data-form-button="hide" value="закрыть"/>
                        </footer>
                    </form>
                </section>
            `,
                {
                    'width': 1050,
                    'disableAjaxHandler': true,
                    'destroyOnHide': true,
                    'hideOnEscape': false,
                    preBuildCallback: function(form, formBuilder) {
                        formBuilder.formButtonActions['save'] = self.save;
                        formBuilder.formButtonActions['drop'] = self.drop;
                    },
                    postBuildCallback: function (form) {
                        window.removeEventListener('message', self.eventMessageHandler);
                        window.addEventListener('message', self.eventMessageHandler);
                    }
                });

            self.form.show();
        },

        save: function () {
            var self = structure.salesFunnelLeadId;

            self.button.val(self.form.leadId);
            self.button.text("Лид " + self.form.leadId);
            self.leadProjectElement.val(self.form.leadProjectId);

            self.form.hide();
        },

        drop: function () {
            var self = structure.salesFunnelLeadId;

            self.button.val(0);
            self.button.text("Лид -не выбран-");
            self.leadProjectElement.val(0);

            self.form.hide();
        },

        eventMessageHandler: function (event)
        {
            var self = structure.salesFunnelLeadId;
            if (event.data.msg === 'lead chosed') {
                self.form.leadId = event.data.leadId;
                self.form.leadProjectId = event.data.leadProjectId;
            } else if (event.data.msg === 'lead confirmed') {
                self.form.leadId = event.data.leadId;
                self.form.leadProjectId = event.data.leadProjectId;
                self.save();
            }
        }
    };

    /**
     * Панель инструментов
     * @type {{hideToolPanelDynamicBlock: hideToolPanelDynamicBlock}}
     */
    this.toolPanel =
    {
        hideDynamicBlock: function(button){
            $(button).closest('.toolPanelDynamicBlock').hide();
        }
    };


    /**
     * Фабрика элементов
     * @type {{stampImg: stampImg}}
     */
    this.elementFactory =
    {
        /**
         * Вернуть HTML для изображения печати
         * @param sealId
         * @param sealParams
         * @returns {string}
         */
        stampImg: function(sealId, sealParams) {
            return (sealParams.stamp ? '<img class="stamp" src="' + sealParams.stamp.url + '" data-seal-id="' + sealId + '" style="position: absolute; ' + sealParams.stamp.css + '" title="Печать" />' : '')
                 + (sealParams.signature ? '<img class="signature" src="' + sealParams.signature.url + '" data-seal-id="' + sealId + '" style="position: absolute; ' + sealParams.signature.css + '" title="Подпись" />' : '');
        }
    };

    /**
     * Получить дату договора
     * @return {Date}
     */
    this.getContractDate = function ()
    {
        return this.almanac.getDate();
    };


    /**
     * Добавить новый элемент управления
     * @param {string} name
     * @param {LibDoc_Contracts_Editor_Controls_Abstract} control
     * @returns {void}
     */
    this.appendControl = function (name, control)
    {
        this._controls[name] = control;
    };


    /**
     * Получить элемент управления
     * @param {string} name
     * @returns {LibDoc_Contracts_Editor_Controls_Abstract}
     */
    this.getControl = function (name)
    {
        return this._controls[name];
    };


    /**
     * Добавить обработчик элемента управления
     * @param {string} controlName
     * @param {string} type
     * @param {Function} eventListener
     * @returns {this}
     */
    this.addControlEventListener = function (controlName, type, eventListener)
    {
        const control = this.getControl(controlName);
        if (control) {
            control.addEventListener(type, eventListener);
        }

        return this;
    };

    /**
     * Получить значение из элемента управления
     * @param {string} controlName
     * @returns {*}
     */
    this.getControlValue = function (controlName)
    {
        return this.getControl(controlName) ? this.getControl(controlName).getValue() : undefined;
    };

    /**
     * Обновить поля НДС
     * @returns {void}
     */
    this.updateVatFields = function ()
    {
        let vatStr = this.getVatRateStr();
        let trueClass = 'vat-payer_true';
        let falseClass = 'vat-payer_false';

        $('[data-field="_vatStr"]').text(vatStr);

        if (parseInt(this.getControlValue('vatPayerSelect')) === 2) {
            document.body.classList.remove(trueClass);
            document.body.classList.add(falseClass);
        } else {
            document.body.classList.add(trueClass);
            document.body.classList.remove(falseClass);
        }
    };


    /**
     * Получить размер НДС в виде строки
     * @returns {*}
     */
    this.getVatRateStr = function ()
    {
        if (
            parseInt(this._configurationData.disableVAT) ||
            parseInt(this.getControlValue('vatPayerSelect')) === 2
        ) {
            return 'Не облагается';
        }

        return Lib_Nds.getVatRateStr(this.getContractDate());
    };


    /**
     * Получить размер НДС
     * @returns {number}
     */
    this.getVatRate = function ()
    {
        if (
            parseInt(this._configurationData.disableVAT) ||
            parseInt(this.getControlValue('vatPayerSelect')) === 2
        ) {
            return 0;
        }

        return Lib_Nds.getVatRate(this.getContractDate());
    };


    /**
     * Получить НДС
     * @param {number} price
     * @returns {number}
     */
    this.getVat = function (price)
    {
        if (!this.getVatRate()) {
            return 0;
        }

        return Lib_Nds.getVat(price, this.getContractDate());
    };

    /**
     * Установить текст поля
     * @param {string} fieldName
     * @param {string} text
     */
    this.setFieldText = function (fieldName, text)
    {
        $(`[data-field="${fieldName}"]`).text(text);
    };


    this.enableContractTypeDepotSelectBind = function ()
    {
        if (parseInt(this.contractTypeSelect.val()) === 2) {
            this.getControl('depotSelect').show();
        } else {
            this.getControl('depotSelect').hide()
        }

        this.contractTypeSelect.on('change', () => {
            let contractType = parseInt(this.contractTypeSelect.val());

            if (contractType === 1) {
                this.getControl('depotSelect').show();
            } else {
                this.getControl('depotSelect').hide()
            }
        });
    }

});

$(document).ready(function(){
    //очищаем от форматирования вводимые данные
    $('section.print').on('focusout','[contenteditable=true]', function(){
        $(this).text($.trim($(this).text()));
    });
    $('#transition-overlay').transition({
        "backgroundColor": 'grey',
    });
});
