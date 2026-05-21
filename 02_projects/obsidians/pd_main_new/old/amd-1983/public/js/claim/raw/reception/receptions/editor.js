/**
 * {Template_Description_Abstract}
 *
 * @author Pak Ivan
 * @date 21.02.19
 * @copyright {Template_Description_Copyrights}
 */
let ReceptionEditor = (function ()
{
    function ReceptionsEditor(options)
    {
        this.receptions = options.receptions;

        /** @type {ReceptionsEditorFieldFactory} */
        this.fieldFactory = new ReceptionsEditorFieldFactory({
            editor: this
        });

        /** @type {ReceptionsEditorValueExtractor} */
        this.valueExtractor = new ReceptionsEditorValueExtractor({
            editor: this
        });

        /** @type {ReceptionsEditorOverlay} */
        this.overlay = new ReceptionsEditorOverlay({
            editor: this
        });

        /** @type {receptionsEditorFieldBlock} */
        this.receptionsEditorFieldBlock = new ReceptionsEditorFieldBlock({
            editor: this
        });

        // Конфигурация редактируемых полей
        this.editableFieldsConfig = this.receptions.options.editorConfig.receptionsEditor.editableFieldsConfig;

        // Текущий набор полей
        this.editableFields = [];

        // Связь названия поля с индексом
        this.editableFieldsNameIndexMap = {};

        // Данные редактируемой строки
        this.editData = {};

        // Текущее состояние редактора, регулирует
        this.state = 0;
    }


    /**
     * Запускает редактирование строки
     * @param editData
     * @returns {*}
     */
    ReceptionsEditor.prototype.editRow = function (editData)
    {
        if (!this.isAwaiting()) {
            return alert('Завершите активное редактирование!');
        }

        // Переключиться в режим редактирование
        this.setModeEditing();

        // Данные редактируемого поля
        this.editData = editData;

        // Обнулить текущий набор полей
        this.editableFields = [];

        // Обнулить текущую карту полей
        this.editableFieldsNameIndexMap = {};

        // Перебор конфигурации с настройками полей
        $.each(this.editableFieldsConfig, (fieldIndex, fieldConfig) =>
        {
            // Контейнер
            let div = editData.tr.find('td[lang="' + fieldConfig.name + '"] > div');

            // Сгенерировать поле и добавить его в набор полей
            this.editableFields[fieldIndex] = this.fieldFactory.createField(fieldIndex, fieldConfig);

            // Создать карту для навигации по списку полей, используя название поля
            this.editableFieldsNameIndexMap[fieldConfig.name] = fieldIndex;

            // Очистить контейнер и вставить в него поле
            div.empty().append(this.editableFields[fieldIndex]);
        });

        // Сфокусироваться на первом поле
        editData.tr.find('.reception-editor-field:first').focus();

        return this;
    };


    /**
     * Возвращает поле по его названию
     * @param fieldName
     * @return {*}
     */
    ReceptionsEditor.prototype.getFieldByName = function (fieldName)
    {
        return this.editableFields[this.editableFieldsNameIndexMap[fieldName]];
    };


    /**
     * Возвращает настройки поля по его названию
     * @param fieldName
     * @return {*}
     */
    ReceptionsEditor.prototype.getFieldConfigByName = function (fieldName)
    {
        return this.editableFieldsConfig[this.editableFieldsNameIndexMap[fieldName]];
    };


    /**
     * Обрабатывает глобальные действия с клавиатуры
     * @param keyCode
     */
    ReceptionsEditor.prototype.handleGlobalKeyEvent = function (keyCode)
    {
        // Сфокусироваться на первом поле
        let firstField = $('.reception-editor-field:first').focus();

        if (keyCode) {
            firstField.trigger($.Event( "keydown", { which: keyCode } ));
        }
    };


    /**
     * Завершает редактирование строки
     * @returns {ReceptionsEditor}
     */
    ReceptionsEditor.prototype.closeRow = function ()
    {
        // Перебор конфигурации с настройками полей
        $.each(this.editableFieldsConfig, (fieldIndex, fieldConfig) =>
        {
            // Найти контейнер
            let div = this.editData.tr.find('td[lang="' + fieldConfig.name + '"] > div');

            // Сбросить строку с поиском в исходное состояние
            if (fieldConfig.type === 'selectWithSearchField') {
                this.fieldFactory.selectWithSearch[fieldConfig.name].dropSearchValue();
            }

            // Заполнение строки конечными данными
            // В качестве данных используется grid.data (т.е. к текущему моменту объект должен быть обновлен)
            // Заполнение просходит посредством вызовов методов описанных в grid (т.е. отработают все alias)
            div.html(
                this.receptions.callGridAlias(
                    fieldConfig.name, this.editData.rowData[fieldConfig.name], div, this.editData.rowData
                )
            );
        });

        // Переключение в режим "Ожидание"
        this.setModeAwaiting();

        return this;
    };


    /**
     * Добавление новой записи
     * @return void
     */
    ReceptionsEditor.prototype.newRow = function ()
    {
        if (!this.isAwaiting()) {
            return alert('Завершите активное редактирование!');
        }

        // Данные в гриде
        let gridData = this.receptions.getGridData();

        // Если в гриде есть данные, переместить указатель на последнюю строку
        if (gridData.length !== 0) {
            this.editData.rowIndex = (gridData.length -1);
        }

        this.nextRow();
    };


    /**
     * Переключение на следующую строку, если текущаяя строка последняя, создать новую запись
     * @returns {ReceptionsEditor}
     */
    ReceptionsEditor.prototype.nextRow = function ()
    {
        let gridData = this.receptions.getGridData();

        new Promise((resolve) =>
        {
            // Последняя строка
            if ((gridData.length -1) === this.editData.rowIndex || gridData.length === 0) {

                // Создать новую запись, значение является строкой из grid.data
                let newReception = this.createNewReception();

                // Новая запись успешно добавлена в БД, добавить значение в grid.data
                if (newReception) {
                    gridData.push(newReception);
                } else {
                    alert('Неудалось создать запись, обратитесь к администратору!'); return this;
                }

                // Обновить грид
                this.receptions.updateGridWithLocalData(gridData);
            }
            // Строка не последняя
            else {
                // Закрыть редактируемую строку
                this.closeRow();
            }

            // Найди индекс ближайшей редактируемой строки
            let nextIndex = parseInt(this.editData.rowIndex) >= 0 ? (this.editData.rowIndex + 1) : 0;

            // Перебрать все записи начиная от текущего индекса
            for (let index = nextIndex; index <= gridData.length - 1; index++) {
                // Последняя запись в гриде
                if (!gridData.hasOwnProperty(index)) {
                    nextIndex = index; break;
                } else if (!parseInt(gridData[index].accepted)) {
                    nextIndex = index; break;
                }
            }

            resolve({
                nexRowIndex: nextIndex
            });

        }).then((data) =>
        {
            // Запустить редактирование следующей строки
            this.editRow({
                rowIndex: data.nexRowIndex,
                tr: $('.filter-grid-body tr[data-index="' + data.nexRowIndex + '"]'),
                rowData: gridData[data.nexRowIndex]
            });
        });

        return this;
    };


    /**
     * Создает новую запись в базе, возвращает объект в формате grid.data[row], т.е. строку из грида
     * @returns {*}
     */
    ReceptionsEditor.prototype.createNewReception = function ()
    {
        let reception = null;

        $.ajax({
            url: '/claim/raw/reception/receptions/create-new-reception',
            async: false,
            dataType: "json",
            data: {
                reportId: this.receptions.options.requestParams.reportId,
            },
            success: function (response)
            {
                if (response.success === true) {
                    reception = response.hasOwnProperty('reception')
                        ? response.reception
                        : null;
                } else {
                    alert('Неудалось создать новую запись! Обратитесь к администратору!');
                }
            }
        });

        return reception;
    };


    /**
     * Сохранение поля, выполняется в фоновом режиме
     * @param field
     * @param fieldConfig
     * @returns {ReceptionsEditor}
     */
    ReceptionsEditor.prototype.saveData = function (field, fieldConfig)
    {
        // Получить данные поля
        let fieldData = this.valueExtractor.extractValue(field, fieldConfig);

        // Обновить данные грида
        this.editData.rowData = $.extend(this.editData.rowData, fieldData);

        let promise = new Promise(
            (resolve) =>
            {
                this.validateBaleNumber(field, fieldConfig, fieldData); resolve(true);
            }
        ).then(
            () =>
            {
                this.savDataAjax(fieldData);
            }
        );

        return this;
    };


    /**
     * @param fieldData
     */
    ReceptionsEditor.prototype.savDataAjax = function (fieldData)
    {
        $.ajax({
            url: '/claim/raw/reception/receptions/save-data',
            data: {
                receptionId: this.editData.rowData.id,
                editorData: fieldData
            },
            async: true,
            type: 'POST',
            dataType: "json",
            success: (response) =>
            {
                if (response.success !== true) {
                    // Закрыть редактируемую строку
                    this.closeRow();
                    // Заблокировать окно
                    this.overlay.toggle(true);
                    //
                    alert("Неудалось сохранить изменение!\n - Обратитесь к администратору!");
                } else {
                    // Неудалось сохранить
                    if (!response.info) {
                        // Закрыть редактируемую строку
                        this.closeRow();
                        // Обновить грид
                        this.receptions.filter.dataTable.update();
                        //
                        alert(response.validationMessage);
                    }
                    // Сохранено
                    else {
                        if (response.hasOwnProperty('receptionEntity')) {
                            this.updateViewValues(response.receptionEntity);
                        }
                    }
                }
            }
        });
    };


    /**
     * @param field
     * @param fieldConfig
     * @param fieldData
     */
    ReceptionsEditor.prototype.validateBaleNumber = function (field, fieldConfig, fieldData)
    {
        if (fieldConfig.name !== 'baleNumber') {
            return;
        }

        let baleNumber = field.val();

        $.ajax({
            url: '/claim/raw/reception/receptions/validate-bale-number',
            async: false,
            dataType: "json",
            data: {
                baleNumber,
            },
            success: function (response)
            {
                if (response.success === true) {
                    if (response.inStock > 0) {
                        fieldData.baleNumber = '';
                        field.val(fieldData.baleNumber);

                        alert('Кипа с номером ' + baleNumber + ' уже есть на складе!');
                    }
                } else {
                    alert('Неудалось проверить номер кипы! Обратитесь к администратору!');
                }
            }
        });
    };


    /**
     * Обновление нередактируемых параметров
     * @param {*} receptionEntity
     * @return {ReceptionsEditor}
     */
    ReceptionsEditor.prototype.updateViewValues = function (receptionEntity)
    {
        // let gridRow = this.receptions.filter.dataTable.grid.data[this.editData.rowIndex];

        // Перебор конфигурации с настройками полей
        $.each(['accepted'], (index, fieldName) =>
        {
            // Найти контейнер
            let div = this.editData.tr.find('td[lang="' + fieldName + '"] > div');

            // Заполнение строки конечными данными
            // В качестве данных используется grid.data (т.е. к текущему моменту объект должен быть обновлен)
            // Заполнение просходит посредством вызовов методов описанных в grid (т.е. отработают все alias)
            div.html(
                this.receptions.callGridAlias(
                    fieldName, receptionEntity[fieldName], div, this.editData.rowData
                )
            );
        });

        return this;
    };


    /**
     * Переключение в режим "Редактирование"
     * @returns {number}
     */
    ReceptionsEditor.prototype.setModeEditing = function ()
    {
        return this.state = 1;
    };


    /**
     * Переключение в режим "Ожидание"
     * @returns {number}
     */
    ReceptionsEditor.prototype.setModeAwaiting = function ()
    {
        return this.state = 0;
    };


    /**
     * Возвращает флаг, режим "Ожидание"
     * @returns {boolean}
     */
    ReceptionsEditor.prototype.isAwaiting  = function ()
    {
        return this.state === 0;
    };

    return ReceptionsEditor;

})();


/**
 * Обработчик блокировки полей
 * @type {ReceptionsEditorFieldBlock}
 */
let ReceptionsEditorFieldBlock = (function ()
{
    function ReceptionsEditorFieldBlock(options)
    {
        this.editor = options.editor;
    }

    ReceptionsEditorFieldBlock.prototype.handleField = function (field, fieldConfig, disable)
    {
        return this[fieldConfig.type](field, fieldConfig, disable);
    };

    /**
     * Текстовые поля
     * @param field
     * @param fieldConfig
     * @param disable
     */
    ReceptionsEditorFieldBlock.prototype.textAreaField = function (field, fieldConfig, disable)
    {
        field.attr({ disabled: disable }).val('');
    };


    /**
     * Строковые поля
     * @param field
     * @param fieldConfig
     * @param disable
     */
    ReceptionsEditorFieldBlock.prototype.textField = function (field, fieldConfig, disable)
    {
        field.attr({ disabled: disable }).val('');
    };


    /**
     * Селект с поиском
     * @param field
     * @param fieldConfig
     * @param disable
     */
    ReceptionsEditorFieldBlock.prototype.selectWithSearchField = function (field, fieldConfig, disable)
    {

    };

    return ReceptionsEditorFieldBlock;

}());


/**
 * Фабрика полей
 * @type {ReceptionsEditorFieldFactory}
 */
let ReceptionsEditorFieldFactory = (function ()
{
    function ReceptionsEditorFieldFactory(options)
    {
        this.editor = options.editor;

        this.selectWithSearch = {};

        for (let fieldName in this.editor.receptions.options.editorConfig.fieldsFactory.selectWithSearch) {
            if (this.editor.receptions.options.editorConfig.fieldsFactory.selectWithSearch.hasOwnProperty(fieldName)) {
                this.selectWithSearch[fieldName] = new SelectWithSearch(
                    this.editor.receptions.options.editorConfig.fieldsFactory.selectWithSearch[fieldName]
                )
            }
        }
    }


    /**
     * Создание нового поля + общие действия
     * @param fieldIndex
     * @param fieldConfig
     * @returns {*}
     */
    ReceptionsEditorFieldFactory.prototype.createField = function (fieldIndex, fieldConfig)
    {
        if (typeof this[fieldConfig.type] !== 'function') {
            return alert('Неизвестный тип');
        }

        return this[fieldConfig.type](fieldIndex, fieldConfig)
            .attr({
                'data-index': fieldIndex
            });
    };


    /**
     * Текстовое поле
     * @param fieldIndex
     * @param fieldConfig
     * @returns {Window.jQuery.fn.init|jQuery.fn.init|jQuery|HTMLElement}
     */
    ReceptionsEditorFieldFactory.prototype.textAreaField = function (fieldIndex, fieldConfig)
    {
        let label = $('<label class="reception-editor-text-area-label">').text(fieldConfig.title);
        let field = $('<textarea class="mceNoEditor reception-editor-field reception-editor-text-area">');

        field.keydown((event) =>
        {
            switch (event.which) {
                case 13: // Enter
                    event.preventDefault();
                    // Сохранить поле, закрыть строку
                    this.editor.saveData(field, fieldConfig).closeRow();
                    break;
                case 27: // Esc
                    this.editor.closeRow();
                    break;
                case 9: // Tab
                    // Последнее поле, иначе сработает "blur"
                    if (this.editor.editableFields.length - 1 === fieldIndex && !event.shiftKey) {
                        // Заблокировать действие Tab
                        event.preventDefault();
                        // Перейти на новую строку
                        this.editor.saveData(field, fieldConfig).closeRow().nextRow();
                    }
                    break;
                default:

                    if (fieldConfig.hasOwnProperty('filter')) {
                        if (!this.keyFilter(event, fieldConfig)) {
                            event.preventDefault();
                        }
                    }

                    break;
            }
        });

        // Снятие фокуса с поля
        field.blur(() =>
        {
            this.editor.saveData(field, fieldConfig);
        });

        field.focus(() =>
        {
            field.select();
        });

        field.val(this.editor.editData.rowData[fieldConfig.name]);

        return label.after(field);
    };


    /**
     * Строковое поле
     * @param fieldIndex
     * @param fieldConfig
     * @returns {Window.jQuery.fn.init|jQuery.fn.init|jQuery|HTMLElement}
     */
    ReceptionsEditorFieldFactory.prototype.textField = function (fieldIndex, fieldConfig)
    {
        let label = $('<label class="reception-editor-input-text-label">').text(fieldConfig.title);
        let field = $('<input type="text" class="text-center reception-editor-field reception-editor-input-text">');

        if (fieldConfig.hasOwnProperty('mask')) {
            field.mask(fieldConfig.mask);
        }

        if (fieldConfig.hasOwnProperty('datePicker') && fieldConfig.datePicker === true) {
            field.attr({readonly: true}).datepicker({
                onClose: () => {
                    field.closest('tr')
                         .find('[data-index="' + (parseInt(field.attr('data-index')) + 1) + '"] .reception-editor-field')
                         .focus()
                }
            });
        }

        if (fieldConfig.hasOwnProperty('dateField') && fieldConfig.dateField === true) {
            field.blur(() => {
                let fieldDate = moment(field.val(), 'DD.MM.YYYY');
                let today     = moment();
                let diff      = today.diff(fieldDate, 'hours');

                let alertCallback = (message, field) =>
                {
                    field.val(today.format('DD.MM.YYYY')).blur();

                    alert(message);

                    setTimeout(
                        () => { field.focus() },
                        1
                    )
                };

                if (!fieldDate.isValid()) {
                    alertCallback('Дата указана неверно', field);
                }
                // Дата из будущего
                else if (diff < 0) {
                    alertCallback('Нельзя указывать дату из будущего', field);
                }
                // Дата из прошлого
                else if (diff / 24 > 730) {
                    alertCallback('Нельзя указывать дату из прошлого с разницей более 730 дней', field);
                }
            });
        }

        field.keydown((event) =>
        {
            switch (event.which) {
                case 13: // Enter
                    event.preventDefault();
                    // Сохранить поле, закрыть строку
                    this.editor.saveData(field, fieldConfig).closeRow();
                    break;
                case 27: // Esc
                    this.editor.closeRow();
                    break;
                case 9: // Tab
                    // Последнее поле, иначе сработает "blur"
                    if (this.editor.editableFields.length - 1 === fieldIndex && !event.shiftKey) {
                        // Заблокировать действие Tab
                        event.preventDefault();
                        // Перейти на новую строку
                        this.editor.saveData(field, fieldConfig).closeRow().nextRow();
                    }
                    break;
            }
        });

        // Снятие фокуса с поля
        field.blur(() =>
        {
            this.editor.saveData(field, fieldConfig);
        });

        field.focus(() =>
        {
            field.select();
        });

        if (fieldConfig.hasOwnProperty('convertModelValue')) {
            field.mask(fieldConfig.mask);
        }

        field.val(
            this.modelValueConverter(fieldConfig, this.editor.editData.rowData[fieldConfig.name])
        );

        return label.after(field);
    };


    /**
     * Фильтр клавишь, блокирует действия клавишь по сценарию
     * @param event
     * @param fieldConfig
     * @return {boolean}
     */
    ReceptionsEditorFieldFactory.prototype.keyFilter = function (event, fieldConfig)
    {
        let allowed = true;
        let keyInt = parseInt(event.key);

        switch (fieldConfig.filter) {
            case 'integer':
                allowed = (!isNaN(keyInt) || ['ArrowLeft','ArrowRight','Delete','Backspace'].includes(event.key));
                break;
            case 'float':
                allowed = (!isNaN(keyInt) || ['.','ArrowLeft','ArrowRight','Delete','Backspace'].includes(event.key));
                break;
        }

        return allowed;
    };


    /**
     * @param fieldConfig
     * @param value
     * @return {*}
     */
    ReceptionsEditorFieldFactory.prototype.modelValueConverter = function (fieldConfig, value)
    {
        switch (fieldConfig.modelValueConverter) {
            case 'sqlDateToRegular':
                return dateStringHelper.sqlDateToRegularDate(value);
            default:
                return value;
        }
    };


    /**
     * Тип элемента <select> с поиском
     * @param fieldIndex
     * @param fieldConfig
     * @return {SelectWithSearch.options.mainElement|{cssClass}|*}
     */
    ReceptionsEditorFieldFactory.prototype.selectWithSearchField = function (fieldIndex, fieldConfig)
    {
        let field = this.selectWithSearch[fieldConfig.name].mainElement;

        // Для селекта необходимо добавить обязательные элементы
        if (fieldConfig.hasOwnProperty('requireOptions') && fieldConfig.requireOptions) {

            let requiredOptions = {};
            let value = this.editor.editData.rowData[fieldConfig.valueField];

            if (parseInt(value) !== 0) {
                requiredOptions[this.editor.editData.rowData[fieldConfig.valueField]] = {
                    id: this.editor.editData.rowData[fieldConfig.valueField],
                    title: this.editor.editData.rowData[fieldConfig.name],
                };
            }

            this.selectWithSearch[fieldConfig.name].setRequiredOptionsData(requiredOptions).buildElements();
        }

        this.selectWithSearch[fieldConfig.name].setOptions({
            enterAction: {
                enableDefaultAction: false,
                beforeDefaultAction: () =>
                {
                    this.editor.saveData(field, fieldConfig).closeRow();
                },
            },
            tabAction: {
                enableDefaultAction: false,
                beforeDefaultAction: (event) =>
                {
                    // Последнее поле, иначе сработает "blur"
                    if (this.editor.editableFields.length - 1 === fieldIndex && !event.shiftKey) {
                        // Заблокировать действие Tab
                        event.preventDefault();
                        // Перейти на новую строку
                        this.editor.saveData(field, fieldConfig).closeRow().nextRow();
                    }
                },
            },
            escapeAction: {
                enableDefaultAction: false,
                beforeDefaultAction: () =>
                {
                    this.editor.closeRow();
                },
            },
            blurAction: {
                enableDefaultAction: false,
                beforeDefaultAction: () =>
                {
                    this.editor.saveData(field, fieldConfig);
                },
            },
            changeAction: {
                enableDefaultAction: false,
                beforeDefaultAction: () =>
                {
                    let searchWithSelectConfig = this.editor.receptions.options.editorConfig.fieldsFactory.selectWithSearch[fieldConfig.name];

                    if (searchWithSelectConfig.hasOwnProperty('disableFieldsOnValue')) {

                        let fieldValue = parseInt(field.find('select').val());

                        for (let fieldName in searchWithSelectConfig.disableFieldsOnValue) {
                            if (searchWithSelectConfig.disableFieldsOnValue.hasOwnProperty(fieldName)) {

                                this.editor.receptionsEditorFieldBlock.handleField(
                                    this.editor.getFieldByName(fieldName),
                                    this.editor.getFieldConfigByName(fieldName),
                                    searchWithSelectConfig.disableFieldsOnValue[fieldName].includes(fieldValue)
                                );
                            }
                        }
                    }
                },
            }
        })
        .setSelectedValues([this.editor.editData.rowData[fieldConfig.valueField]])
        .applySelectedValues()
        .setEvents();

        return field;
    };

    return ReceptionsEditorFieldFactory;

})();


/**
 * Логика получения данных из редактируемого поля
 * @type {ReceptionsEditorValueExtractor}
 */
let ReceptionsEditorValueExtractor = (function ()
{
    function ReceptionsEditorValueExtractor(options)
    {
        this.editor = options.editor;
    }


    /**
     * @param fieldConfig
     * @param value
     * @return {*}
     */
    ReceptionsEditorValueExtractor.prototype.viewValueConverter = function (fieldConfig, value)
    {
        switch (fieldConfig.viewValueConverter) {
            case 'regularToSqlDate':
                return dateStringHelper.regularToSqlDate(value);
            default:
                return value;
        }
    };


    /**
     * Получает данные из поля, по конфигурации поля подбирает нужный метод
     * @param field
     * @param fieldConfig
     * @returns {*}
     */
    ReceptionsEditorValueExtractor.prototype.extractValue = function (field, fieldConfig)
    {
        let valueExtractorName = fieldConfig.hasOwnProperty('valueExtractor') && fieldConfig.valueExtractor
            ? fieldConfig.valueExtractor
            : fieldConfig.type;

        if (typeof this[valueExtractorName] !== 'function') {
            alert('Неизвестный тип экстрактора!'); return null;
        }

        return this[valueExtractorName](field, fieldConfig);
    };


    /**
     * Текстовое поле
     * @param field
     * @param fieldConfig
     */
    ReceptionsEditorValueExtractor.prototype.textAreaField = function (field, fieldConfig)
    {
        let result = {};

        result[fieldConfig.name] = (field.val()).trim();

        return result;
    };


    /**
     * Строковое поле
     * @param field
     * @param fieldConfig
     */
    ReceptionsEditorValueExtractor.prototype.textField = function (field, fieldConfig)
    {
        let result = {};

        result[fieldConfig.name] = this.viewValueConverter(fieldConfig, (field.val()).trim());

        return result;
    };


    /**
     * <select> с поиском
     * @param field
     * @param fieldConfig
     */
    ReceptionsEditorValueExtractor.prototype.selectWithSearchField = function (field, fieldConfig)
    {
        let result = {};

        result[fieldConfig.name] = this.editor.fieldFactory.selectWithSearch[fieldConfig.name].selectElement.find('option:selected').text();
        result[fieldConfig.valueField] = this.editor.fieldFactory.selectWithSearch[fieldConfig.name].selectElement.val();

        return result;
    };

    return ReceptionsEditorValueExtractor;

})();


/**
 * Затемнение страницы блокирует страницу
 * @type {ReceptionsEditorOverlay}
 */
let ReceptionsEditorOverlay = (function ()
{
    function ReceptionsEditorOverlay(options)
    {
        this.editor = options.editor;

        this.overlay = $('<div class="page-overlay">');

        this.toggle(false);

        $('body').append(this.overlay);
    }


    /**
     * Переключает состояние затемнения
     * @param state
     * @returns {ReceptionsEditorOverlay}
     */
    ReceptionsEditorOverlay.prototype.toggle = function (state)
    {
        this.overlay.toggle(state);

        return this;
    };

    return ReceptionsEditorOverlay;

})();
