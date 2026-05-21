/**
 * Скрыть поля в таблице
 */
var depotFields = new (function () {

    /**
     * список всех полей доступных юзверю
     */
    this.allFields = {};

    /**
     * скрытые поля строковое представление
     */
    this.hideFieldsStr = '';

    /**
     * список скрытых полей
     */
    this.hideFields = {};

    /**
     * удалить дочерние элементы
     */
    this.empty = function (obj) {
        obj = this.node(obj);

        while (obj.firstChild) {
            obj.removeChild(obj.firstChild);
        }
    };

    /**
     * получить узел по ид
     */
    this.node = function (id) {
        return typeof id == 'string' ? document.getElementById(id) || null : id;
    };

    /**
     * удалить узел
     */
    this.removeNode = function (id) {
        var node = this.node(id).parentNode;
        node.removeChild(this.node(id));
        return this;
    }

    /**
     * создать узел
     */
    this.createNode = function (nodeName) {
        return document.createElement((nodeName || 'div'));
    };

    /**
     * преобразование hideFieldsStr => hideFields
     */
    this.prepareHideFields = function () {
        var tmp = this.hideFieldsStr.split('|');

        for (var i = 0; i < tmp.length; i++) {
            if (!tmp[i]) {
                continue;
            }
            this.hideFields[tmp[i]] = 1;
        }
    };

    /**
     * создание
     */
    this.create = function () {
        this.prepareHideFields();

        var cnt = this.createNode();
        cnt.className = 'fields-report-control';
        cnt.setAttribute('show', 'show');
        document.body.appendChild(cnt);

        // set head
        var h = this.createNode();
        h.innerHTML = '+';
        h.setAttribute('t', 'head');
        h.onclick = function () {
            var test = this.parentNode.getAttribute('show');
            test = (test == 'show' ? 'hide' : 'show');
            this.parentNode.setAttribute('show', test);
            this.innerHTML = (test == 'show' ? '+' : '-');
            $(this.parentNode).animate({height: (test == 'show' ? '20px' : '500px')}, "slow");
        }
        cnt.appendChild(h);

        // set body
        var h = this.createNode();
        h.setAttribute('t', 'fields');
        h.id = 'ctrl_grid_field_fields';
        cnt.appendChild(h);

        // set footer
        var h = this.createNode();
        h.setAttribute('t', 'bottom');
        cnt.appendChild(h);
        // bt ok
        var ok = this.createNode('input');
        ok.type = 'button';
        ok.value = 'Применить';
        ok.disabled = true;
        ok.style.width = '100px';
        ok.id = 'ctrl_grid_field_save';
        ok.onclick = function () {
            depotFields.save();
        };
        h.appendChild(ok);
        // bt reset
        var ok = this.createNode('input');
        ok.type = 'button';
        ok.value = 'Сброс';
        ok.disabled = true;
        ok.style.width = '100px';
        ok.id = 'ctrl_grid_field_reset';
        ok.onclick = function () {
            depotFields.reset();
        };
        h.appendChild(ok);

        // bt reset
        var ok = this.createNode('input');
        ok.type = 'button';
        ok.value = 'Скрыть';
        ok.style.width = '100px';
        ok.id = 'ctrl_grid_field_reset';
        ok.onclick = function () {
            $('div[t=head]').click();
        };
        h.appendChild(ok);
    };

    /**
     * отрисовка списка полей
     */
    this.showFields = function () {
        var h = this.node('ctrl_grid_field_fields');
        this.empty(h);
        for (var i in this.allFields) {
            var row = this.createNode();
            row.lang = i;
            row.innerHTML = this.allFields[i];
            row.title = this.allFields[i];
            row.setAttribute('disp', (!this.hideFields[i] ? 'yes' : 'no'));
            h.appendChild(row);
            row.onclick = function () {
                var disp = this.getAttribute('disp');
                disp = (disp == 'yes' ? 'no' : 'yes');
                this.setAttribute('disp', disp);

                if (disp == 'yes') {
                    delete(depotFields.hideFields[this.lang]);
                } else {
                    depotFields.hideFields[this.lang] = 1;
                }

                depotFields.checkButtonState();
            };
        }
    };

    /**
     * сброс изменений
     */
    this.reset = function () {
        this.prepareHideFields();
        this.showFields();
        this.checkButtonState();
    };

    /**
     * контроль состояния кнопок
     */
    this.checkButtonState = function () {
        var tmp = [];
        for (var i in this.hideFields) {
            tmp.push(i);
        }
        tmp.sort();
        var disabled = (tmp.join('|') == this.hideFieldsStr);
        $('#ctrl_grid_field_save').attr('disabled', disabled);
        $('#ctrl_grid_field_reset').attr('disabled', disabled);
    };

    /**
     * сохранение изменений
     */
    this.info = function () {
        var data = [];

        for (var i in this.hideFields) {
            data.push(i);
        }

        data = data.sort().join('|');

        $.ajax({
            url: linkPrefix + '/depot/basepricegroups/saveconfigfields',
            cache: false,
            type: 'POST',
            dataType: 'json',
            data: {fields: data},
            success: function (data) {
                depotFields.hideFieldsStr = data.setting
                depotFields.prepareHideFields();
                depotFields.checkButtonState();
            }
        });

        depot.rebildGrid();
    };
})();