/**
 * Плагин для редактирования записей в базе
 * Пример вызова:
 *
 * ajaxEditor.init({
 *     triggerSelector: '.myButton', // Элементы с данным селектором будут вызывать форму с редактированием данных
 *     ajaxFormSelector: '#ajaxFormWrapper', // Селектор для AJAX формы (на его основе будет создана AJAX Form)
 *     getterType: 'server', // Тип метода извлечения данных для вставки в редактор доступны
 *                                    (server - с сервера,
 *                                     bind-id - с элемента формы мвязанного по bindId (необходимо указать в data-bind-id в .myButton),
 *                                     function(){} - Пользовательский метод)
 *     urlGetData: '/development/index/get-value', // URL по которому можно получить данные для ячейки если их требуется получать из базы
 *     urlSetData: '/development/index/set-value', // URL по которому можно сохранить данные для ячейки
 *     filter: false // Ссылка на объект фильтра нового образца, если после сохранения данных требуется обновить грид
 * });
 */
var ajaxEditor = new (function()
{
    /**
     * Инициализация плагина
     * @param options
     */
    this.init = function(options)
    {
        var self = this;

        /**
         * Дефолтные настроки объединяются с пользовательскики
         * с приоритетом за пользовательскими
         */
        this.options = $.extend(
            {
                getterType: 'server',
                updateFieldValue: false,
                filter: false,
                width: 600
            },
            options
        );

        // AJAX форма для редактирования записи
        this.ajaxForm = new AjaxForm($(options.ajaxFormSelector), { width: this.options.width, style: 'strict' });

        // Оверлей для блокировки формы
        this.overlay = this.ajaxForm.domObject.find('.ajax-editor-overlay');

        // Клик по одной из кнопок редактирования
        $('body').on('click', options.triggerSelector, function() {
            // Отобразить оверлей
            self.overlay.show();
            // Отобразить форму
            self.edit($(this));
            // Скрыть оверлей
            self.overlay.hide();
        });

        // Клик по кнокпе сохранить
        this.ajaxForm.domObject.find('input[data-form-button="save"]').click(function() {
            // Отобразить оверлей
            self.overlay.show();
            // Сохранить данные формы
            self.save();
            // Скрыть оверлей
            self.overlay.hide();
        });

        // Клик по кнопке сохранить
        this.ajaxForm.domObject.find('input[data-form-button="close"]').click(function() {
            self.cancel();
        });
    };


    /**
     * Изменить значение в ячейки
     * @param element
     * @returns {*}
     */
    this.edit = function(element)
    {
        // Объект кнопки, которая вызвала форму с редактированием
        this.trigger = element;
        // В объекте кнопки должны хранить необходимые данные в "data" аттрибутах
        this.triggerData = this.trigger.data();

        // Получить данные ячейки
        var data = this.getData();

        // Данные загружены успешно
        if (data !== false) {
            // Установить нужное значение в поле с редактором
            this.ajaxForm.domObject.find('.ajax-editor-text').val(data);
            // Установить заголовок
            this.ajaxForm.domObject.find('.ajax-editor-header').html(this.setTitle());

            // Отобразить форму
            this.ajaxForm.show();
        }

        return this;
    };


    /**
     * Изменить значение в ячейке
     * @returns {*}
     */
    this.info = function()
    {
        var self = this;

        $.ajax({
            url      : this.options.urlSetData,
            async    : false,
            type     : 'POST',
            data     : this.getFormData(),
            dataType : 'json',
            success  : function(response)
            {
                // При успешном результате, обновляем данные на стороне клиента
                if (response.result === true) {
                    // 1й приоритет за пользовательской функцией
                    if (typeof self.options.updateFieldValue === 'function') {
                        self.options.updateFieldValue();
                    }
                    // 2й приоритет за фильтром, если есть фильтр просто обновляем грид
                    else if (self.options.filter) {
                        self.options.filter.dataTable.update();
                    }
                    // 3й приоритет обновляем поле связанное по bindId
                    else if (self.triggerData.bindId) {
                        var element = $('#' + self.triggerData.bindId);
                        if (element[0].tagName == 'INPUT' || element[0].tagName == 'TEXTAREA') {
                            element.val(response.value);
                        } else {
                            element.text(response.value);
                        }
                    }
                    // Скрыть форму
                    self.ajaxForm.hide();
                }
                // Ошибка на сервере
                else {
                    if (typeof response.message !== 'undefined') {
                        alert(response.message);
                    } else {
                        alert('Неопознанная ошибка');
                    }
                }
            },
            error: function()
            {
                alert('Неизвестный ответ с сервера');
            }
        });

        return this;
    };


    /**
     * Закрывает окно с редактированием записи
     * @returns {*}
     */
    this.cancel = function()
    {
        this.ajaxForm.hide();

        return this;
    };


    /**
     * Получить данные для формы
     * @returns {string}
     */
    this.getData = function()
    {
        var data = "";

        // Получить данные для ячейки с сервера
        if (this.options.getterType === 'server') {
            $.ajax({
                url      : this.options.urlGetData,
                async    : false,
                type     : 'POST',
                data     : this.triggerData,
                dataType : 'json',
                success  : function(response)
                {
                    data = response.result === true ? response.value : false;

                    if (response.result !== true) {
                        if (typeof response.message !== 'undefined') {
                            alert(response.message);
                        } else {
                            alert('Неопознанная ошибка');
                        }
                    }
                },
                error: function()
                {
                    data = false;

                    alert('Неизвестный ответ с сервера');
                }
            });
        }
        // Получить данные для ячейки с из дом объекта
        else if (this.options.getterType === 'bind-id') {

            var bindObject = $('#' + this.triggerData.bindId);

            if (bindObject[0].tagName == 'INPUT' || bindObject[0].tagName == 'TEXTAREA') {
                data = bindObject.val();
            }
            else {
                data = bindObject.text();
            }
        }
        // Получить данные для ячейки используя пользовательскую функцию
        else if (typeof this.options.getterType === 'function') {
            data = this.options.getterType(this);
        }

        return data;
    };


    /**
     * Устанавливает заголовок
     * @returns {*}
     */
    this.setTitle = function()
    {
        if (typeof this.options.setTitle === 'string') {
            return '<h1>' + this.options.setTitle + '</h1>';
        }
        else if (typeof this.options.setTitle === 'function') {
            return this.options.setTitle();
        }

        return '<h1>Введите желаемое значение:</h1>';
    };


    /**
     * Возвращает данные формы
     * @returns {{}}
     */
    this.getFormData = function()
    {
        var formData = {};

        $.each(this.ajaxForm.domObject.find('form').serializeArray(), function(index, field) {
            formData[field.name] = field.value;
        });

        return $.extend(this.triggerData, { formData: formData });
    };
});