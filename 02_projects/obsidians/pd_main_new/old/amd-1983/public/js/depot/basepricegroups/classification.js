var item = new (function () {
    /**
     * права
     */
    this.access;
    /**
     * url autocomplete
     */
    this.urlAutocomplete = linkPrefix + '/depot/basepricegroups/classification/getparams';
    /**
     * url удаления классификации
     */
    this.urlDelete = linkPrefix + '/depot/basepricegroups/classification/delete';

    /**
     * контроллер фильтра
     */
    this.controller;
    /**
     * грид фильтра
     */
    this.grid;

    /**
     * Получить параметры формы
     * @returns {object}
     */
    this.getFormParams = function ()
    {
        var _self = this;
        return {
            width: 500,
            style: 'normal', // Доступно: 'normal', 'strict'
            destroyOnHide: true,
            hideOnEscape: true,
            postBuildCallback: function (form) {
                $('.plusParams').click(function () {
                    _self.addParam();
                    _self.setAutocomplete();
                });

                // Событие на успешную отправку форму и ответ об успехе операции
                form.done(function (data, form) {
                    _self.controller.dataTable.filter.rebuildFilter()
                    form.hide();
                });

                form.validation.append(function (form) {
                    form.domObject.find(':input').removeClass('error');
                    if (form.domObject.find(':input:visible[value=]').length) {
                        form.domObject.find(':input:visible[value=]').prop('placeholder', 'Поле не может быть пустым');
                        form.domObject.find(':input:visible[value=]').addClass('error');
                        return 'Заполните форму';
                    }
                    return true;
                });

                form.domObject.on('click', '.paramRemove', _self.removeParam);
                form.domObject.on('click', '.paramUp', _self.upParam);
                form.domObject.on('click', '.paramDown', _self.downParam);
            }
            // ...
        };
    };

    /**
     * добавить параметр
     * @param {type} value значение
     * @returns {undefined}
     */
    this.addParam = function (value)
    {
        value = value || '';
        var fields = $('<tr><td colspan="2">' +
                '<input type="text" name="params[]" value="' + value + '" class="paramTitle">' +
                '<a href="#" class=paramRemove></a>' +
                '<a href="#" class="paramDown"></a>' +
                '<a href="#" class="paramUp"></a>' +
                '</td></tr>');
        //$(this).prev().append(fields);
        $('#tbody_params').append(fields);
        fields.children('input').focus();
    };

    /**
     * Форма редактирования минимального кол-ва товара
     */
    this.editClassificationForm;

    /**
     * Форма добавления классификации
     */
    this.addClassificationForm;

    /**
     * удаление параметра
     * @returns {Boolean}
     */
    this.removeParam = function ()
    {
        $(this).parent().parent().remove();
        return false;
    };

    /**
     * Поднять параметр выше по списку
     * @returns {Boolean}
     */
    this.upParam = function ()
    {
        var prevParam = $(this).parent().parent().prev();
        if (prevParam.length) {
            $(this).parent().parent().insertBefore(prevParam);
        }
        return false;
    };

    /**
     * Опустить параметр ниже по списку
     * @returns {Boolean}
     */
    this.downParam = function ()
    {
        var nextParam = $(this).parent().parent().next();
        if (nextParam.length) {
            $(this).parent().parent().insertAfter(nextParam);
        }
        return false;
    };

    /**
     * Инициализация форм
     * @returns {undefined}
     */
    this.initEditClassificationForm = function ()
    {
        this.editClassificationForm = new AjaxForm($('script[data-template="editClassificationForm"]').html(), this.getFormParams());
    }

    this.initClassificationForm = function ()
    {
        this.addClassificationForm = new AjaxForm($('script[data-template="addClassificationForm"]').html(), this.getFormParams());
    }

    /**
     * Редактирование минимального количества товара
     * @return void
     */
    this.editClassification = function (i)
    {
        if (this.access.info !== '1') {
            return false;
        }
        if (i !== undefined) {
            this.selectedId = this.grid.data[i].id;
        } else if (this.grid.lastSelectionData && this.grid.lastSelectionData.length) {
            this.selectedId = this.grid.lastSelectionData[0].id;
        } else {
            this.selectedId = null;
        }

        if (this.selectedId == null) {
            alert('Необходимо выбрать Классификацию!');
        } else {
            var _self = this;
            var id = this.selectedId;
            var ajaxParams = {
                url: '/depot/basepricegroups/classification/get',
                dataType: 'json',
                //async: false,
                type: 'POST',
                data: {
                    id: id
                }
            };

            /**
             * AjaxForm предоставляет API для отправки и обработки AJAX-запросов 
             * На них НЕ ДЕЙСТВУЮТ коллбэки done/complete/error/fail, которые описываются в форме через соотсветствующие методы
             */

            _self.editClassificationForm.show();
            this.editClassificationForm.ajax(ajaxParams, {
                /**
                 * Указать объект, в котором будет отображаться ajax-индикатов.
                 * Если не задавать этот параметр, то по умолчанию ajax-запросы будут показывать индикатор во всей форме
                 */
                //                    domObject: formDomObject.find('span.some-container'),

                /**
                 form - ссылка на AjaxForm
                 
                 complete/done/fail аналогичны jquery'вским, но кроме данных передается форма
                 error - запрос прошел успешно, но получена ошибка в JSON-формате (см.ниже)
                 **/

                'complete': function (form) {

                },
                'done': function (data, form) {
                    //console.log(form);
                    _self.paramCounter = 0;
                    _self.paramCounter = data['params'].length;
                    for (var i = 0; i < _self.paramCounter; i++) {
                        _self.addParam(data['params'][i]['title']);
                    }
                    $(_self.editClassificationForm.domObject).find('.itemTitle').val(data['title']);
                    $(_self.editClassificationForm.domObject).find('#editId').val(data['id']);
                    _self.setAutocomplete();
                },
                'error': function (data, form) {
                    // ...
                },
                'fail': function (form) {
                    // ...
                }
            });
        }
    };

    /**
     * Удаление классификации
     * @return void
     */
    this.deleteClassification = function (i)
    {
        if (this.access.delete !== '1') {
            return false;
        }
        if (i !== undefined) {
            this.selectedId = this.grid.data[i].id;
        } else if (this.grid.lastSelectionData && this.grid.lastSelectionData.length) {
            this.selectedId = this.grid.lastSelectionData[0].id;
        } else {
            this.selectedId = null;
        }

        if (this.selectedId == null) {
            alert('Необходимо выбрать Классификацию!');
        } else if (window.confirm('Удалить?')) {
            var _self = this;
            var id = this.selectedId;

            $.ajax({
                url: _self.urlDelete,
                dataType: 'json',
                //async: false,
                type: 'POST',
                data: {
                    id: id
                },
                success: function (data) {
                    if (data.success) {
                        _self.controller.dataTable.reset();
                    } else {
                        alert(data.error);
                    }
                }
            });
        }
    };

    /**
     * Добавление группы минимального количества товара
     * @return void
     */
    this.addClassification = function ()
    {
        if (this.access.info !== '1') {
            return false;
        }
        this.addClassificationForm.show();
    };

    /**
     * Bind событий
     * @return void
     */
    this.bindEvents = function ()
    {

        var _self = this;

        $('#deleteField').click(function () {
            _self.deleteClassification();
        });

        $('#editField').click(function () {
            _self.editClassification();
        });

        $('#addField').click(function () {
            _self.addClassification();
        });

        // Поиск по id товара
        $('#numberSearchItem').keyup(function (e) {
            if (e.keyCode != 13) {
                return;
            }
            _self.controller.dataTable.filter.onChange();
        });
        // Поиск по id
        $('#doNumberSearchItem').click(function () {
            _self.controller.dataTable.filter.onChange();
        });

    };

    /**
     * установка автозаполнения
     * @returns {undefined}
     */
    this.setAutocomplete = function ()
    {
        $('#tbody_params input').autocomplete(linkPrefix + this.urlAutocomplete, {
            width: 300,
            multiple: true,
            matchContains: true,
            max: 999999,
            multipleSeparator: "\n",
            formatResult: function (row) {
                return row.to;
            }
        });
    }

    this.init = function (access)
    {
        this.access = access;
        // Фильтр
        this.controller = new Classification_Controller({});
        this.grid = this.controller.dataTable.grid;
        //инициализация форм
        this.initEditClassificationForm();
        this.initClassificationForm();
        // События
        this.bindEvents();
        //если перешли по ссылке добавить
        if (window.location.hash == '#add') {
            this.addClassification();
            window.location.hash = '';
        }
    };
})();