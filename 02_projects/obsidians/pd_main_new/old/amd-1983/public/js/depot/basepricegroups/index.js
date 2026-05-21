group = new (function ()
{
    /**
     * url autocomplete
     */
    this.urlAutocomplete = '/depot/basepricegroups/getvalues';
    /**
     * url списка классификаций
     */
    this.urlClassifications = '/depot/basepricegroups/classification/getlist';
    /**
     * url страницы классификаций
     */
    this.urlClassificationsShow = '/depot/basepricegroups/classification';

    /**
     * url информации о классификации
     */
    this.urlClassification = '/depot/basepricegroups/classification/get';

    /**
     * Id группы
     */
    this.groupId;
    /**
     * параметры группы
     */
    this.params = [];
    /**
     * права доступа
     */
    this.access;
    /**
     * Права доступа к закупочной бц
     */
    this.accessIn;

    /**
     * формы создания, редактирования, удаления БЦ
     */
    this.addForm;
    this.editForm;
    this.deleteForm;
    this.editBPForm;

    /**
     * контроллеры филтра для отображения групп и для миграции товара
     */
    this.migration;
    this.controller;

    this.depotId;

    this.subFilters;

    /**
     * параметры форм
     */
    this.getFormParams = function ()
    {
        var _self = this;
        return {
            width: 500,
            style: 'normal', // Доступно: 'normal', 'strict'
            destroyOnHide: true,
            hideOnEscape: true,
            postBuildCallback: function (form)
            {
                _self.setAutocomplete();
                form.domObject.find('[name="depot_id"]').val(_self.depotId);
                form.domObject.find('.summInput').fieldDecorator({decorator: 'summ'});
                form.domObject.find('#noPrice').change(function ()
                {
                    $('#blockCurPrice').css('display', $(this).prop('checked') ? 'none' : 'table-row');
                });
                form.domObject.find('#plan').change(function ()
                {
                    $('.blockPlan').css('display', $(this).prop('checked') ? 'table-row' : 'none');
                });
                form.validation.append(function (form)
                {
                    var emptyInputs = form.domObject.find(':input:visible[value=]');
                    form.domObject.find(':input').removeClass('error');
                    if (emptyInputs.length) {
                        emptyInputs.prop('placeholder', 'Поле не может быть пустым');
                        emptyInputs.addClass('error');

                        return 'Заполните форму';
                    }
                    return true;
                });
                form.done(function (data, form)
                {
                    _self.controller.dataTable.filter.rebuildFilter(false);
                    form.hide();
                });
            }
        };
    };

    /**
     * параметры форм
     */
    this.getEditFormParams = function ()
    {
        var _self = this;
        return {
            width: 500,
            style: 'normal', // Доступно: 'normal', 'strict'
            destroyOnHide: true,
            hideOnEscape: true,
            windowDomObjOptions: {
                minHeight: '1000px'
            },
            postBuildCallback: function (form) {
                _self.setAutocomplete();
                form.domObject.find('.summInput').fieldDecorator({decorator: 'summ'});
                form.domObject.find('#noPrice').change(function () {
                    $('#blockCurPrice').css('display', $(this).prop('checked') ? 'none' : 'table-row');
                    if ($(this).prop('checked')) {
                        form.domObject.find('[name="plan_price"]').prop('disabled', true);
                    } else {
                        form.domObject.find('[name="plan_price"]').prop('disabled', false);
                    }
                });
                form.domObject.find('#plan').change(function () {
                    $('.blockPlan').css('display', $(this).prop('checked') ? 'table-row' : 'none');
                });

                form.domObject.find('.js-change-plan').on('click', function () {
                    let basePrice = parseFloat(form.domObject.find('#curPrice').val() || '0.0');
                    let delta = parseFloat(form.domObject.find('[name="plan_price_change_value"]').val() || '0.0');
                    let deltaType = form.domObject.find('[name="plan_price_change_type"]:checked').val();
                    // увеличить или уменьшить
                    let isDecrease = $(this).hasClass('js-decrease');

                    form.domObject.find('[name="plan_price_change_value"]').val((isDecrease ? -1 : 1) * Math.abs(delta));

                    if (form.domObject.find('#noPrice').prop('checked')) {
                        return form.domObject.find('#planPrice').val('');
                    }

                    switch (deltaType) {
                        // рубли
                        case '0':
                            basePrice = Math.max(basePrice + (isDecrease ? -1 : 1) * Math.abs(delta), 0);
                            break;
                        // проценты
                        case '1':
                            basePrice = basePrice * Math.max((100 + (isDecrease ? -1 : 1) * Math.abs(delta)), 0) / 100;
                            break;
                    }

                    form.domObject.find('#planPrice').val(basePrice.toFixed(2));
                });


                form.validation.append(function (form)
                {
                    var emptyInputs = form.domObject.find(':input:visible[value=]:not(:disabled)');
                    form.domObject.find(':input').removeClass('error');
                    if (emptyInputs.length) {
                        emptyInputs.prop('placeholder', 'Поле не может быть пустым');
                        emptyInputs.addClass('error');

                        return 'Заполните форму';
                    }
                    return true;
                });
                form.done(function (data, form)
                {
                    const planDate = form.domObject.find('#planDate').val();
                    // если группа без бц и с планируемой ценой, тогда покажем сообщение
                    if (form.domObject.find('#noPrice').prop('checked') &&
                        form.domObject.find('#planDate').is(':visible') &&
                        planDate > ''
                    ) {
                        alert(`Данные сохранены. БЦ товаров будут изменены ${planDate}`);
                    }

                    _self.controller.dataTable.filter.rebuildFilter(false);
                    form.hide();
                });
            },
            getDataCallback: function (form) {
                form.getDomObject().find('[name="depots"]').val(ll_select.collectData()['ll_select_edit-baseprice-group-form-depots'].join(','));
                return form.getFormDomObject().serialize();
            },
            showCallback: function (form) {
                var ll_select_element = form.getDomObject().find('#ll_select_edit-baseprice-group-form-depots');
                ll_select_element.find('.ll_item').show();
                ll_select_element.find('.ll_item[data-val="'+_self.depotId+'"]').hide();
                ll_select_element.find('.ll_selectAll').trigger('click');
            }
        };
    };

    /**
     * параметры формы АБЦ
     */
    this.getFormAbpParams = function ()
    {
        var _self = this;
        return {
            width: 500,
            style: 'normal', // Доступно: 'normal', 'strict'
            destroyOnHide: true,
            hideOnEscape: true,
            postBuildCallback: function (form)
            {
                _self.setAutocomplete();
                form.domObject.find('.summInput').fieldDecorator({decorator: 'summ'});
                form.validation.append(function (form)
                {
                    var emptyInputs = form.domObject.find(':input:visible[value=]');
                    var dateFrom = Date.parse(form.domObject.find('#dateFrom').val().split('.').reverse().join('-'));
                    var dateTo = Date.parse(form.domObject.find('#dateTo').val().split('.').reverse().join('-'));
                    form.domObject.find(':input').removeClass('error');
                    if (emptyInputs.length) {
                        emptyInputs.prop('placeholder', 'Поле не может быть пустым');
                        emptyInputs.addClass('error');
                        
                        return 'Заполните форму';
                    }
                    if (isNaN(dateFrom) || isNaN(dateTo) || dateFrom >= dateTo) {
                        return 'Проверте период действия';
                    }
                    return true;
                });
                form.done(function (data, form)
                {
                    _self.controller.dataTable.filter.rebuildFilter(false);
                    form.hide();
                });
            },
            getDataCallback: function (form) {
                form.getDomObject().find('[name="depots"]').val(ll_select.collectData()['ll_select_abp-group-form-depots'].join(','));
                return form.getFormDomObject().serialize();
            },
            showCallback: function (form) {
                var ll_select_element = form.getDomObject().find('#ll_select_abp-group-form-depots');
                ll_select_element.find('.ll_item').show();
                ll_select_element.find('.ll_item[data-val="'+_self.depotId+'"]').hide();
                ll_select_element.find('.ll_selectAll').trigger('click');
            }
        };
    };

    /**
     * параметры формы изменения БЦ всех групп
     */
    this.getFormBPParams = function ()
    {
        var _self = this;
        return {
            width: 800,
            style: 'normal', // Доступно: 'normal', 'strict'
            destroyOnHide: true,
            hideOnEscape: true,
            postBuildCallback: function (form)
            {
                var ids = [];
                var divGroup = form.domObject.find('#groupsBP tbody');

                divGroup.empty();
                for (i = 0; i < _self.grid.lastSelectionData.length; i++) {
                    ids.push(_self.grid.lastSelectionData[i].id);
                    divGroup.append('<tr><td>"' + _self.grid.lastSelectionData[i].title + '"</td><td>' + _self.grid.lastSelectionData[i].cur_bp + '</td><td>' + _self.grid.lastSelectionData[i].remain_average_price + '</td></tr>');
                }

                form.domObject.find('#idsBP').val(ids.toString());

                form.validation.append(function (form)
                {
                    var errors = [];
                    var emptyInputs = form.domObject.find(':input:visible[value=]');

                    form.domObject.find(':input').removeClass('error');
                    if (emptyInputs.length) {
                        emptyInputs.prop('placeholder', 'Поле не может быть пустым');
                        emptyInputs.addClass('error');
                        errors.push('Введите значение');
                    } else if (form.domObject.find('#dx').val() === '-') {
                        var dx = parseFloat(form.domObject.find('input[name=value]').val());
                        var divGroup = form.domObject.find('#groupsBP tbody');
                        var type = form.domObject.find("input:radio[name=type]:checked").val();
                        //если по процентам
                        if (type === '1') {
                            if (!(dx < 100)) {
                                errors.push('Процент должен быть меньше 100');
                            }
                        } else {
                            divGroup.find('tr').each(function ()
                            {
                                var curBP = parseFloat($(this).children(':eq(1)').text());
                                var title = $(this).children(':eq(0)').text();

                                if (!isNaN(curBP) && (Math.round(100 * (curBP - dx)) <= 0)) {
                                    errors.push('В группе ' + title + ' БЦ <= 0');
                                }
                            });
                        }
                    }
                    return errors.length ? errors.join('\r\n') : true;
                });

                form.domObject.find('.amd-btn').click(function ()
                {
                    form.domObject.find('#dx').val($(this).val());
                    form.submit();
                });

                form.domObject.find('input[type=text]').fieldDecorator({decorator: 'summ'});

                form.done(function (data, form)
                {
                    _self.grid.lastSelectionData = [];
                    _self.grid._updateSelectedRow();
                    _self.controller.dataTable.filter.rebuildFilter(false);
                    form.hide();
                });

                form.error(function (data, form)
                {
                    _self.controller.dataTable.filter.rebuildFilter();
                    if (data.hasOwnProperty('groups') && data.groups.length) {
                        var selectRows = _self.grid.lastSelectionData;
                        _self.grid.lastSelectionData = [];
                        for (i = 0; i < selectRows.length; i++) {
                            if (-1 === data.groups.indexOf(selectRows[i].id)) {
                                _self.grid.lastSelectionData.push(selectRows[i]);
                            }
                        }
                        _self.grid._updateSelectedRow();
                        form.hide();
                    }
                });
            },
            getDataCallback: function (form) {
                form.getDomObject().find('[name="depots"]').val(ll_select.collectData()['ll_select_edit-baseprice-value-form-depots'].join(','));
                return form.getFormDomObject().serialize();
            },
            showCallback: function (form) {
                var ll_select_element = form.getDomObject().find('#ll_select_edit-baseprice-value-form-depots');
                ll_select_element.find('.ll_item').show();
                ll_select_element.find('.ll_item[data-val="'+_self.depotId+'"]').hide();
                ll_select_element.find('.ll_selectAll').trigger('click');
            }
        };
    };

    /**
     * параметры формы удаления
     */
    this.getFormDeleteParams = function ()
    {
        var _self = this;
        return {
            width: 1200,
            style: 'normal', // Доступно: 'normal', 'strict'
            destroyOnHide: false,
            hideOnEscape: true,
            postBuildCallback: function (form)
            {
                _self.migration = new BasePricesGroups_Controller({gridContainer: 'delete-grid-container', filterContainer: 'delete-filter-container'});
                var oldAfterRowCreate = _self.migration.dataTable.grid.onAfterRowCreate;
                _self.migration.dataTable.grid.onAfterRowCreate = function (row, rowData)
                {
                    if (_self.selectedRow.id == rowData.id) {
                        row.css('display', 'none');
                    }
                    oldAfterRowCreate(row, rowData);
                };
                _self.migration.dataTable.grid.onClick = function (index, row, rowData)
                {
                    form.domObject.find('input[name=group_id]').val(_self.migration.dataTable.grid.data[index].id);
                };
                form.validation.append(function (form)
                {
                    if (!form.domObject.find('input[name=group_id]').val()) {
                        return 'Необходимо выбрать новую группу!';
                    }
                    return true;
                });
                form.done(function (data, form)
                {
                    _self.controller.dataTable.filter.rebuildFilter(false);
                    _self.controller.dataTable.grid.lastSelectionData = [];
                    form.hide();
                });
            }
        };
    };

    /**
     * инициализация форм
     * @returns {undefined}
     */
    this.initForms = function ()
    {
        var _self = this;
        this.addForm = new AjaxForm($('script[data-template="addForm"]').html(), this.getFormParams());
        this.editForm = new AjaxForm($('script[data-template="editForm"]').html(), this.getEditFormParams());
        this.deleteForm = new AjaxForm($('script[data-template="deleteForm"]').html(), this.getFormDeleteParams());
        this.editBPForm = new AjaxForm($('script[data-template="editBPForm"]').html(), this.getFormBPParams());
        this.addAbpForm = new AjaxForm($('script[data-template="addAbpForm"]').html(), this.getFormAbpParams());

        _self.deleteForm.setShowCallback(function (form)
        {
            form.domObject.find('header h1').text('Удалить группу "' + _self.selectedRow.title + '" и перенести товар в группу:');
            form.domObject.find('input[name=delete_id]').val(_self.selectedRow.id);
            form.domObject.find('input[name=group_id]').val('');

            _self.migration.dataTable.grid.lastSelectionData = [];
            form.domObject.find('.filter-grid-body table tr').removeClass('filter-grid-body-select-row');
        });
    };

    /**
     * показать форму при удалении группы
     * @returns {Boolean}
     */
    this.deleteShow = function ()
    {
        if (this.access.delete !== '1') {
            return false;
        }
        if (this.grid.lastSelectionData && this.grid.lastSelectionData.length) {
            if (this.grid.lastSelectionData.length === 1) {
                this.selectedRow = this.grid.lastSelectionData[0];

                if (this.selectedRow.not_default == 0) {
                    alert('Нельзя удалить группу по умолчанию!');
                } else {
                    if (this.migration) {
                        this.migration.dataTable.filter.rebuildFilter(false);
                    }
                    this.deleteForm.show();
                }
            } else {
                alert('Необходимо выбрать одну группу');
            }
        } else {
            alert('Необходимо выбрать Группу БЦ!');
        }

        return false;
    };

    /**
     * Показать форму редактирования группы
     * @param {int} groupId номер строки группы
     * @returns {undefined}
     */
    this.editItem = function (groupId)
    {
        if (this.access.info !== '1') {
            return false;
        }
        if (groupId !== undefined) {
            this.selectedId = groupId;//this.grid.data[i].id;
        } else if (this.grid.lastSelectionData && this.grid.lastSelectionData.length) {
            if (this.grid.lastSelectionData.length === 1) {
                this.selectedId = this.grid.lastSelectionData[0].id;
            } else {
                alert('Необходимо выбрать одну группу');
                return false;
            }
        } else {
            this.selectedId = null;
        }

        if (this.selectedId === null) {
            alert('Необходимо выбрать Группу БЦ!');
        } else if (this.selectedId == 1) {
            alert('Нельзя редактировать группу по умолчанию!');
        } else {
            var _self = this;
            var id = this.selectedId;
            var ajaxParams = {
                url: '/depot/basepricegroups/get',
                dataType: 'json',
                type: 'POST',
                data: {
                    'id': id
                }
            };

            _self.params = [];
            this.editForm.show();
            this.updateClassifications(this.editForm);
            _self.editForm.domObject.find('#editBpType').val($('#groupType').val());
            _self.editForm.domObject.find('#planDate').datepicker({minDate: "+1d"});
            this.editForm.ajax(ajaxParams, {
                'complete': function (form)
                {

                },
                'done': function (data, form)
                {
                    _self.params = data['params'];
                    _self.editForm.domObject.find('#editId').val(data['id']);
                    _self.editForm.domObject.find('#title').val(data['title']);
                    _self.editForm.domObject.find('#curPrice').val(data['cur_price']);
                    _self.editForm.domObject.find('#classification_id').val(data['classification_id']);
                    if (data['cur_price'] === null) {
                        _self.editForm.domObject.find('#noPrice').prop('checked', true);

                    }
                    if (data['plan_date'] !== null) {
                        var planDate = data['plan_date'].split('-');
                        _self.editForm.domObject.find('#planDate').val(planDate[2] + '.' + planDate[1] + '.' + planDate[0]);
                        _self.editForm.domObject.find('#planPrice').val(data['plan_price']);
                        _self.editForm.domObject.find('#plan').prop('checked', true);
                        _self.editForm.domObject.find(`[name="plan_price_change_type"][value="${data['plan_price_change_type']}"]`).prop('checked', true);
                        _self.editForm.domObject.find('[name="plan_price_change_value"]').val(data['plan_price_change_value']);
                    }
                    _self.editForm.domObject.find('#noPrice').change();
                    _self.editForm.domObject.find('#plan').change();
                    _self.editForm.domObject.find('#classification_id').change();

                    _self.editForm.domObject.find('#remainProductAveragePrice').text(data.average_price);

                },
                'error': function (data, form)
                {
                    // ...
                },
                'fail': function (form)
                {
                    // ...
                }
            });
        }
    };

    /**
     * Показать форму добавления группы
     * @returns {undefined}
     */
    this.addItem = function ()
    {
        if (this.access.info !== '1') {
            return false;
        }
        this.params = [];
        this.addForm.show();

        // выставление типа бц
        this.addForm.getDomObject().find('#addBpType').val($('#groupType').val());
        this.updateClassifications(this.addForm);
    };

    /**
     * Показать форму добавления АБЦ группы
     * @returns {undefined}
     */
    this.addAbp = function (i)
    {
        if (this.access.info !== '1') {
            return false;
        }
        var row = {};
        if (i !== undefined) {
            row = this.grid.data[i];
        } else if (this.grid.lastSelectionData && this.grid.lastSelectionData.length) {
            if (this.grid.lastSelectionData.length === 1) {
                row = this.grid.lastSelectionData[0];
            } else {
                alert('Необходимо выбрать одну группу');
                return false;
            }
        }

        if (!row.id) {
            alert('Необходимо выбрать Группу БЦ!');
        } else if (row.id == 1) {
            alert('Нельзя редактировать группу по умолчанию!');
        } else if (row.cur_price === '-') {
            alert('Группа без БЦ');
        } else {
            var form = this.addAbpForm;
            form.show();
            form.domObject.find('.dateInput').datepicker({minDate: "+0d"});
            form.domObject.find('#groupTitle').text(row.title);
            form.domObject.find('input[name="groupId"]').val(row.id);
        }
    };

    /**
     * Показать форму изменения БЦ
     * @returns {undefined}
     */
    this.editBP = function ()
    {
        if (this.access.info !== '1') {
            return false;
        }
        if (!this.grid.lastSelectionData || !this.grid.lastSelectionData.length) {
            alert('Необходимо выбрать группу');
            return false;
        }
        this.editBPForm.show();
    };

    /**
     * установка автозаполнения
     * @returns {undefined}
     */
    this.setAutocomplete = function ()
    {
        $('#tbody_params textarea').autocomplete(this.urlAutocomplete, {
            width: 300,
            multiple: true,
            matchContains: true,
            max: 999999,
            multipleSeparator: "\n",
            formatResult: function (row)
            {
                return row.to;
            }
        });
    };

    /**
     * Обновление классификаций
     * @param {AjaxForm} form
     * @returns {undefined}
     */
    this.updateClassifications = function (form)
    {

        var _self = this;
        _self.getClassifications(form);
        //обновление параметров при смене классификации
        form.domObject.find('#classification_id').change(function ()
        {
            form.domObject.find('#tbody_params').empty();
            form.domObject.find('#tbody_params').append($('<tr><td colspan="2" class="no-params">Без параметров</td></tr>'));
            if (!$(this).val()) {
                return false;
            }
            var data = {id: $(this).val()};
            form.ajax(
                {
                    dataType: "json",
                    url: _self.urlClassification,
                    data: data,
                    async: false
                },
                {
                    done: function (data)
                    {
                        var tbodyParams = form.domObject.find('#tbody_params');
                        if (data.params.length) {
                            tbodyParams.empty();
                            $.each(data.params, function (k, v)
                            {
                                var param = '<tr><td><label for="param' + v.id + '">' + v.title + '</label></td>' +
                                        '<td><textarea id="param' + v.id + '" name="param' + v.id + '" cols="5" rows="5" type="text" class="paramText" fieldname="' + v.id + '">' + (_self.params[v.id] || '') + '</textarea></td></tr>';
                                tbodyParams.append($(param));
                            });
                        }
                        _self.setAutocomplete();
                    }
                }
            );
        });
        //обновление списка классификаций
        $('#classificationRefresh').click(function ()
        {
            _self.getClassifications(form);
            return false;
        });
    };

    this.getClassifications = function (form)
    {
        form.ajax(
            {
                dataType: "json",
                url: this.urlClassifications,
                async: false
            },
            {
                done: function (data)
                {
                    var selectClassification = form.domObject.find('#classification_id');
                    var i = selectClassification.val();
                    selectClassification.empty();
                    selectClassification.append($('<option value="">**выбрать**</option>'));
                    $.each(data['list'], function (k, v)
                    {
                        var selected = (i == v.id ? ' selected="selected"' : '');
                        selectClassification.append($('<option value="' + v.id + '"' + selected + '>' + v.title + '</option>'));
                    });
                    selectClassification.change();
                }
            }
        );
    };

    /**
     * добавляем обработчики кнопок
     * @returns {undefined}
     */
    this.bindEvents = function ()
    {
        var _self = this;

        $('#editField').click(function ()
        {
            _self.editItem();
        });

        $('#addField').click(function ()
        {
            _self.addItem();
        });

        $('#editBP').click(function ()
        {
            _self.editBP();
        });

        $('#addAbp').click(function ()
        {
            _self.addAbp();
        });

        $('#deleteField').click(function ()
        {
            _self.deleteShow();
        });

        $('#migrationProducts').click(function ()
        {
            _self.deleteItem();
        });

        $('#showClassifications').click(function ()
        {
            window.open(_self.urlClassificationsShow);
        });

        // Кнопка "Выгрузка в excel" нестандарт что бы не выгружался файл с грида при удалении
        $('input[data-action="excel1"]').click(function ()
        {
            _self.controller.dataTable.params.gridParams.extendAddPostData.groupType = $('#groupType').val();
            _self.controller.dataTable.params.gridParams.extendAddPostData.depotId = _self.depotId;
            _self.controller.dataTable.excel();
        });
        
        $('#groupType').change(function ()
        {
            _self.controller.dataTable.filter.extendAddPostData.groupType = $(this).val();
            _self.controller.dataTable.grid.extendAddPostData.groupType = $(this).val();
            _self.controller.dataTable.grid.lastSelectionData = [];
            _self.controller.dataTable.filter.rebuildFilter();
        });
    };

    this.init = function (access, accessIn)
    {
        var _self = this;
        _self.access = access;
        _self.accessIn = accessIn;
        //фильтр
        this.controller = new BasePricesGroups_Controller({});
        this.grid = this.controller.dataTable.grid;
        //инициализация форм
        this.initForms();
        // События
        this.bindEvents();
        //если перешли по ссылке добавить
        if (window.location.hash === '#add') {
            this.addItem();
            window.location.hash = '';
        } else if (window.location.hash.indexOf('#edit') !== -1) {
            var groupId = window.location.hash.replace(/^\#edit/, '');
            this.editItem(groupId);
            history.pushState(null, null, window.location.href.replace(/#.+$/, ''));
        } else if (window.location.hash === '#addin') {
            var ingroupOptionValue = $("#groupType option.ingroup").val();
            $("#groupType").val(ingroupOptionValue);
            this.addItem();
            window.location.hash = '';
            $("#groupType").trigger('change');
        }

        this.depotId = this.subFilters.getSubFilterData('depotListSubFilter')[0];

        this.subFilters.setOptions({
            filters: [{
                filter: this.controller.dataTable.filter,
                grid: this.controller.dataTable.grid
            }],
            onFilterChanged: function(parentScope)
            {
                _self.depotId = parentScope.getSubFilterData('depotListSubFilter')[0];

                _self.controller.dataTable.filter.extendAddPostData.depotId = _self.depotId;
                _self.controller.dataTable.grid.extendAddPostData.depotId = _self.depotId;
                _self.controller.dataTable.grid.lastSelectionData = [];
                _self.controller.dataTable.filter.rebuildFilter();
            }
        });
    };
})();
