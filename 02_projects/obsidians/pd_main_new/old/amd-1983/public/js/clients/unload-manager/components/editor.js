/**
 * Компонент редактор, реализует добавление и удаление адреса
 *
 * @package Client
 * @subpackage UnloadManager
 * @copyright ${Template_Description_Copyrights}
 *
 * @author Popov K. <konstantin.icreative@gmail.com>
 */
define(['/js/clients/unload-manager/components/abstract.js', '/js/clients/unload-manager/plugins/editor/fields/phone/controller.js'], function (abstract, phoneFieldController)
{
    let instanceWrapper = (function (abstract)
    {
        /**
         * Конструктор компонента
         * @param controller
         * @constructor
         */
        let UnloadManagerComponentEditor = function (controller)
        {
            this.name = 'editor';

            // Вызов родительского конструктора с присвоением его свойств текущему объекту
            abstract.apply(this, arguments);

            this.fieldsHydrateConfiguration = {
                /**
                 * Обработка заполнения поля со списком телефонов
                 * @param data - значение поля, в данном случае - массив адресов
                 */
                phone: function (data) {
                    this.phoneFieldController.generate(data,  $('.phone section.items'));
                }
            };
        };


        UnloadManagerComponentEditor.prototype = Object.create(abstract.prototype);
        UnloadManagerComponentEditor.prototype.constructor = abstract;


        /**
         * Инициализация событий на основе конфигурации
         */
        UnloadManagerComponentEditor.prototype.bindEvents = function ()
        {
            this.phoneFieldController = new phoneFieldController.instance(this.getElement());

            $.each(this.options.buttons, function (key, name)
            {
                // Навешиваем обработчики на кнопки
                this.getElement().find(this.options.selectors.controls[name]).click(function ()
                {
                    this[name].call(this);
                }.bind(this));
            }.bind(this));

            // Показываем кнопку "Добавить" всегда
            this.showControls('add');

            this.processBehaviour('onBindEventHandler');
        };


        /**
         * Показывает переданные элементы управления
         * @param names
         */
        UnloadManagerComponentEditor.prototype.showControls = function (names)
        {
            names = $.isArray(names) ? names : [names];

            Object.keys(names).map(function (key)
            {
                this.getElement().find(this.options.selectors.controls[names[key]]).show();
            }, this)
        };


        /**
         * Скрывает переданные элементы управления
         * @param names
         */
        UnloadManagerComponentEditor.prototype.hideControls = function (names)
        {
            names = $.isArray(names) ? names : [names];

            Object.keys(names).map(function (key)
            {
                this.getElement().find(this.options.selectors.controls[names[key]]).hide();
            }, this)
        };


        /**
         * Предзагрузка данных
         * @returns {*|Promise}
         */
        UnloadManagerComponentEditor.prototype.preRender = function ()
        {
            if (this.preRenderCompleted) {
                return abstract.prototype.preRender();
            } else {
                this.preRenderCompleted = true;
                return this.loadForm();
            }
        };


        /**
         * Получение разметки zend-формы без данных
         * @returns {*|Promise}
         */
        UnloadManagerComponentEditor.prototype.loadForm = function ()
        {
            var loadPromise = abstract.prototype.preRender();

            // Если есть предопределённые данные
            if (typeof this.getScope().predefined !== 'undefined')
            {
                this.form = this.getScope().predefined.editor.form;
            } else {
                // Загрузка формы посредством ajax, если будет необходимо
            }

            return loadPromise;
        };


        /**
         * Отображание и заполнение формы
         */
        UnloadManagerComponentEditor.prototype.render = function ()
        {
            this.getElement().find('.unload-manager-editor__form').html(this.form);

            this.fill();

            // Инициализируем jQuery mask для полученных с сервера элементов
            this.phoneFieldController.initFieldsMask();
        };


        /**
         * Сохранение адреса
         * @returns Promise
         */
        UnloadManagerComponentEditor.prototype.info = function ()
        {
            // Устанавливаем тип адреса при сохранении
            this.getElement().find('input[name="type"]').val(this.controller.options.type);

            var savePromise = $.post('/client/unload-manager/save-item', this.getElement().find('.unload-manager-editor__form input, .unload-manager-editor__form select, .unload-manager-editor__form textarea').serialize(), null, 'json');

            savePromise.done(function (resp) {

                this.getElement().find('.unload-manager-editor__form').html(resp.form);

                // Инициализируем jQuery mask для полученных с сервера элементов
                this.phoneFieldController.initFieldsMask();

                if (resp.status === 'success') {
                    // Если вставляется новый адрес и необходимо выбрать его после вставки
                    if (parseInt(resp.id)) {
                        this.controller.setItemId(resp.id);
                    }

                    this.controller.fetchItems(function ()
                    {
                        this.controller.getList().render(function ()
                        {
                            // Прокручиываем список до последнего элемента в низ
                            this.controller.getList().scrollTo();
                            this.controller.getList().refreshControls();
                            this.processBehaviour('onSaveClickHandler');

                            // сохранение текущего состояния адреса
                            this.curentAddressMd5 = this.getElement().find('.unload-manager-editor__form input').serialize();
                        }.bind(this))
                    }.bind(this));
                } else if (resp.status === 'forbidden') {
                    // Если запрещено сохранять форму
                    if (confirm(resp.msg)) {
                        // Сбросить форму и привязку
                        this.getElement().find('input[name="id"]').val('');
                        this.hideControls('remove');
                        // TODO избавиться от эмуляции событий
                        this.getElement().find('[data-role="save"]').trigger('click');
                    }
                }
            }.bind(this));

            return savePromise;
        };


        /**
         * Удаление адреса
         * @return Promise|boolean
         */
        UnloadManagerComponentEditor.prototype.remove = function ()
        {
            if (!confirm('Вы действительно хотите удалить адрес?')) return false;

            var removePromise = $.post('/client/unload-manager/remove-item', {itemId: this.controller.getItemId()}, null, 'json');

            removePromise.done(function (resp)
            {
                if (resp.status === 'success') {
                    this.add();
                    this.controller.fetchItems(function ()
                    {
                        this.controller.getList().render();
                    }.bind(this));
                } else {
                    // Если адрес не заблокирован, то спрашиваем
                    if (!parseInt(resp['isInactive'])) {
                        if (confirm(resp.msg)) {
                            // Нажимаем кнопку "Заблокировать"
                            this.controller.getList().getElement().find('input[data-role="inactive"]').trigger('click');
                        }
                    } else {
                        alert(resp.msg);
                    }
                }
            }.bind(this));
        };


        /**
         * Добавление адреса
         */
        UnloadManagerComponentEditor.prototype.add = function ()
        {
            // Сбрасывем привязку к существующему адресу
            this.controller.setItemId(null);

            // Убираем отметку из интерфейса
            this.controller.getList().onEditorAddClickHandler();

            // Сбрасываем значения всех полей кроме id клиента
            this.getElement().find('input[name!="client_id"], textarea').val('');

            // Оставить одно поле ввода телефона
            this.getElement().find('.phone .item:gt(0)').remove();

            // Инициализируем jQuery mask для полученных с сервера элементов
            this.phoneFieldController.initFieldsMask();

            this.processBehaviour('onAddClickHandler');
        };


        /**
         * Сохраняет адрес как новый
         */
        UnloadManagerComponentEditor.prototype.saveAsNew = function ()
        {
            if (!confirm('Вы действительно хотите сохранить адрес как новый?')) {
                return false;
            }

            // проверка нового сохраняесого адреса на отличие от текущего выбранного
            var newAddressMd5 = this.getElement().find('.unload-manager-editor__form input').serialize();

            if (this.curentAddressMd5 === newAddressMd5) {
                alert('Адрес совпадает с текущим!');
                return false;
            }

            // Сброс привязки к существующему адресу
            this.controller.setItemId(null);

            // Убрать отметку из интерфейса
            this.controller.getList().onEditorAddClickHandler();

            // Сброс значения id адреса
            this.getElement().find('input[name="id"]').val('');

            // Сохранение адреса как нового
            this.save();
        };


        /**
         * Обработчик выбора элемента списка из компонента list
         */
        UnloadManagerComponentEditor.prototype.onItemSelectedHandler = function ()
        {
            this.processBehaviour('onItemSelectedHandler');
            this.fill();

            // сохранение текущего состояния адреса
            this.curentAddressMd5 = this.getElement().find('.unload-manager-editor__form input').serialize();
        };


        /**
         * Заполняет форму из массива данных в контроллере на основе индекса
         */
        UnloadManagerComponentEditor.prototype.fill = function ()
        {
            // Скрываем сообщения валидации, если такие есть
            this.getElement().find('.errors').hide();

            var itemData = this.controller.getItemId() ? this.getScope().items[this.controller.getItemId()] : {};

            // Если нет данных
            if ($.isEmptyObject(itemData)) {
                // Как минимум всегда заполняем id клиента
                if (this.controller.getClientId()) {
                    $(this.getElement()).find('#client_id').val(this.controller.getClientId());
                }
                return false;
            }

            $(this.getElement())
                .find('#search')
                .attr({ disabled: (parseInt($(this.getElement()).find('#country')) > 1) });

            Object.keys(itemData).map(function (key)
            {
                // Если задана специальная обработка заполнения поля
                if ($.inArray(key, Object.keys(this.fieldsHydrateConfiguration)) !== -1) {
                    this.fieldsHydrateConfiguration[key].call(this, itemData[key]);
                } else {
                    let element = $(this.getElement()).find('#' + key);
                    if (element) {
                        element.val(itemData[key]);
                    }
                }
            }, this);
        };

        return UnloadManagerComponentEditor;
    })(abstract.instance);

    return {
        instance: instanceWrapper
    }
});
