/**
 * Прикрепляемые файлы к тразакциям
 */
var Cash_SimpleFiles = (function ()
{

    /**
     * Конструктор
     * @param {object} params
     * @returns {files_L4.Cash_SimpleFiles}
     */
    function Cash_SimpleFiles(params)
    {
        /**
         * Использовать или нет таблицу предпросмотра
         */
        this.usePrepareTable = true;
        /**
         * Селектор таблицы транзакций
         */
        this.tableSelector = undefined;
        /**
         * Сохраненные данные
         */
        this.savedFiles = undefined;
        /**
         * Список документов
         */
        this._files = undefined;
        /**
         * Список документов для удаления
         */
        this._removeFiles = [];
        /**
         * уникальный id блока с файлами (для транзакций транзакции под отчет)
         */
        this._slideId = undefined;//'fileList-' + this.table.attr('id');//'file-list-' + Math.round(10000 * Math.random());
        /**
         * Код блока
         */
        this.blockTrHtml = '<tr class="interpretationHead" data-slide="true" data-children="%slideId%"><td colspan="2"><a href="#" class="transcript">Прикрепить документы <span class="file-count"></span></a></td></tr>'
                + '<tr style="display: none;" id="%slideId%"><td colspan="2"><div class="transactionFiles">'
                + '<div class="filesUpload">'
                + '<input type="file" name="simpleFilesNew[]" multiple="multiple">'
                + '<input type="hidden" name="simpleFilesRemove" id="sf_remove" value="">'
                + '</div>'
                + '<div class="savedFiles"><ul></ul></div>'
                + '</div></td></tr>';
        /**
         * id типа cash
         */
        this.cashTypeId = undefined;
        /**
         * Строковый тип cash
         */
        this.cashType = undefined;
        /**
         * номер транзакции
         */
        //trId = undefined;
        /**
         * тип транзакции
         */
        //transaction_type = undefined;
        /**
         * Использовать предпросмотр
         */
        this.prepareTable = false;
        /**
         * Таблица транзакции
         */
        this.table = $(params.tableSelector ? params.tableSelector : "table#newTransaction");
        /**
         * Разрешенные расширения файлов
         */
        this._allowedFileExtensions = allowedFileExtensions;
        /**
         * Обновляем параметры
         */
        if (typeof params === 'object') {
            for (var i in params) {
                this[i] = params[i];
            }
        }
    }
    /**
     * Инициализация
     * @returns {undefined}
     */
    Cash_SimpleFiles.prototype.init = function ()
    {
        if ('tableSelector' in this && typeof this.tableSelector != 'undefined') {
            this.table = $(this.tableSelector);
        }
        if (this.usePrepareTable) {
            this.prepareTable = $('table#prepareTransaction');
        }
        this._slideId = this.table.attr('id') + '-fileList';//'file-list-' + Math.round(10000 * Math.random());
        this.cashTypeId = parseInt(cashType);
        this.cashType = this.cashTypeId ? 'money' : 'account';
        this.addBlock();
        this.bindEvents();
    };
    /**
     * Добавление блока для интерпретации
     * @returns {undefined}
     */
    Cash_SimpleFiles.prototype.addBlock = function ()
    {
        this.blockTr = $(this.blockTrHtml.replace(/%slideId%/g, this._slideId));
        this.table.find("tfoot:first").find("tr:last").before(this.blockTr);
        this.updateFileList();
    };
    /**
     * Отобразить кол-во файлов
     * @returns {String}
     */
    Cash_SimpleFiles.prototype.showFileCount = function (count)
    {
        this.blockTr.find('span.file-count').html(
                '<div class="filterRowFilesIcon">' +
                '<img src="/img/system/save.16.png">' +
                '<span>' + (count ? count : '-') + '</span>' +
                '</div>'
                );

        if (count) {
            this.table.find('#' + this.blockTr.data('children')).show();
        } else {
            this.table.find('#' + this.blockTr.data('children')).hide();
        }
    };
    /**
     * Обновить список файлов
     */
    Cash_SimpleFiles.prototype.updateFileList = function ()
    {
        var count = 0;
        //если уже есть сохраненные документы
        if (this.savedFiles && this.savedFiles) {
            var ulFiles = this.blockTr.find('div.savedFiles ul');
            this._files = this.savedFiles;
            for (var key in this._files) {
                count++;
                ulFiles.append('<li>\
                    <div class="fileName">\
                        <a target="_black" href="' + this._files[key].path + this._files[key].file_name + '">' + this._files[key].file_name + '</a>\
                    </div>\
                    <div class="view">\
                        <a title="Просмотр файла" href="#" class="icon-view" data-ext="' + this._files[key].file_ext.toLowerCase() + '" data-link="/filemanager/preview/view/type/transaction-files/?file=' + this._files[key].path + this._files[key].file_name + '">\
                            <img src="/img/filemanager/view.png" alt="Просмотр"/>\
                        </a>\
                    </div>\
                    <div class="close">\
                        <a class="icon-close" href="#" data-hash="' + key + '"><img src="/img/system/remove.png"></a>\
                    </div>\
                    </li>');
            }
        }
        this.showFileCount(count);
    };
    /**
     * Вешаем события
     * @returns {undefined}
     */
    Cash_SimpleFiles.prototype.bindEvents = function ()
    {
        var _self = this;
        //удаление документа
        this.blockTr.find('div.savedFiles').on('click', '.close a', function ()
        {
            _self._removeFiles.push($(this).data('hash'));
            $(this).closest('li').remove();
            return false;
        });
        // просмотр документа
        this.blockTr.find('div.savedFiles').on('click', '.icon-view', function (event)
        {
            //Filemanager_PreviewHelper.open({type: 'image-vendor', vendorLink: $(this).data('link')});
            var array_image_type = ['jpg', 'gif', 'jpeg', 'png'];
            var type = $(this).data('ext');
            var link = $(this).data('link');

            switch (true) {
                case ($.inArray(type, array_image_type) !== -1):
                    Filemanager_PreviewHelper.open({type: 'image', publicLink: link});
                    break;
                case (type == 'pdf'):
                    Filemanager_PreviewHelper.open({'type': 'pdf', 'publicLink': link, 'vendorLink': link});
                    break;
                case (type == 'doc' || type == 'docx'):
                    Filemanager_PreviewHelper.open({'type': 'vendor', 'publicLink': link, 'vendorLink': link});
                    break;
                case (type == 'txt'):
                    Filemanager_PreviewHelper.open({'type': 'text', 'publicLink': link, 'vendorLink': link});
                    break;
                case (type == 'xls' || type == 'xlsx'):
                    Filemanager_PreviewHelper.open({'type': 'vendor', 'publicLink': link, 'vendorLink': link});
                    break;
                default:
                    Filemanager_PreviewHelper.open({type: 'image-vendor', vendorLink: link});
                    break;
            }
            event.preventDefault();
        });
    };
    /**
     * Сохранение
     * @returns {Boolean}
     */
    Cash_SimpleFiles.prototype.info = function ()
    {
        this.blockTr.find('input#sf_remove').val(this._removeFiles);
        return this._checkNewFiles();
    };
    /**
     * Проверка новый файлов
     * @returns {Boolean}
     */
    Cash_SimpleFiles.prototype._checkNewFiles = function ()
    {
        var files = this.blockTr.find('input[type=file]').get(0).files;
        var errors = [];

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var ext = file.name.substr(file.name.lastIndexOf(".") + 1).toLowerCase();
            if ($.inArray(ext, this._allowedFileExtensions) === -1) {
                errors.push(' - ' + file.name + ': запрещенный тип файла');
            }
        }
        if (errors.length) {
            alert('Нельзя прикрепить файлы: \n' + errors.join('\n'));
            return false;
        } else {
            return true;
        }
    };
    /**
     * Проверка наличия файлов
     * @returns {Boolean}
     */
    Cash_SimpleFiles.prototype.checkFileCount = function ()
    {
        // новые файлы которые хотят прикрепить
        var filesNew = this.blockTr.find('input[type=file]').get(0).files;
        // количество прикрепленных файлов с учетом удаленых
        var fileCount = 0;
        if (this._files && this._removeFiles) {
            for (var key in this._files) {
                //console.log(this._removeFiles, key, this._removeFiles.indexOf(key));
                if (-1 === this._removeFiles.indexOf(parseInt(key))) {
                    fileCount++;
                }
            }
        }
        return filesNew.length || fileCount;
    };
    return Cash_SimpleFiles;
})();
