import {Inject, Injectable} from "../../../../../../../../../angular/decorator/component.decorator";
import AjaxFormBackendService from "../../../../../../../../../angular/service/ajax-form-backend.service";
import {
    AJAX_FORM_BACKEND_SERVICE,
    TAjaxFormDataResponse
} from "../../../../../../../../../angular/service/network-service.module";
import {NSectionShowSections} from "../../../module";
import angular = require("angular");
import {IQService} from "angular";
import AccessService, {AMD_ACCESS_SERVICE} from "../../../../../../../../../core/service/access.service";

let promiseFunctions = {
    resolve: (result: boolean) => void 0,
    reject : (reason: any) => void 0,
};

@Injectable()
export class TransferItemForm
{
    public constructor(
        @Inject(AJAX_FORM_BACKEND_SERVICE) private httpService: AjaxFormBackendService,
        @Inject('$q') private $q: IQService,
        @Inject(AMD_ACCESS_SERVICE) private accessService: AccessService,
    )
    {
    }

    public show(row: NSectionShowSections.TGridRow)
    {
        return this.$q((resolve, reject) =>
        {
            promiseFunctions = {
                resolve,
                reject
            };

            this.getTransferInfo(row)
                .then(response =>
                {
                    const rowData: any = angular.copy(row);
                    rowData.addinfo    = response.data;

                    itemWindow.perm.price = Number(this.accessService.getAccess('section>showprice').isAllowed());
                    itemWindow.showWindow(rowData);
                });
        });
    }

    private getTransferInfo(item: NSectionShowSections.TGridRow)
    {
        return this.httpService
            .postOverlay<TAjaxFormDataResponse<NSectionShowSections.TTransferItemInfo[]>>(
                '/depot/section/transferinfo?format=ajaxForm',
                {
                    itemId : item.id,
                    section: item.placing,
                    amount : item.totalAmount,
                    depotId: item.depot_id,
                }
            );
    }

}

/// старый непонятный из-за блокировки под менеджеров, но рабочий код
declare var overley: any;
declare var Grid: any;
declare var itemWindow: any;
declare var Depot_Section_DepotDetailedManager_Transfer_Form: any;

window['itemWindow'] = new (function ()
{

    this.perm = {};

    this.showWindow = function (data)
    {
        const rootScope = this;

        this.overlay                 = new overley();
        this.overlay.tmpdata         = data;
        this.overlay.tmpdata.claimId = 0;
        this.overlay.onAfterCreate   = function ()
        {

            var wnd             = this.crnode();
            wnd.className       = 'filter-wnd section-transfer-item-wnd';
            wnd.id              = this.blockId + '_cnt';
            wnd.style.display   = 'inline-block';
            wnd.style.position  = 'relative';
            wnd.style.border    = '1px solid gray';
            wnd.style.maxHeight = '750px';
            wnd.style.overflowY = 'scroll';
            itemWindow.node(this.blockId + '_block').appendChild(wnd);
            $('.filter-wnd .filter-grid-body').css({
                'max-height': '300px'
            }); // Скрол для большого колличества разбитий

            var area           = this.crnode();
            area.style.display = 'inline-block';
            area.style.width   = 'auto';
            area.style.height  = 'auto';
            area.style.padding = '5px';
            wnd.appendChild(area);

            // create wnd caption
            var wndcap       = this.crnode();
            wndcap.className = 'filter-wnd-caption';
            $(wndcap).html('Расширенная информация по товару : ' + data.title + ' (ID:id)'.replace(/id/, data.id));
            wnd.appendChild(wndcap);

            // create wnd caption close button
            var wndcapbt       = this.crnode();
            wndcapbt.className = 'filter-wnd-caption-close-button';
            wndcapbt.title     = 'закрыть диалог';
            wnd.appendChild(wndcapbt);
            wndcapbt.onclick = function ()
            {
                close();
            };

            // create info;
            var cntgrid         = this.crnode();
            cntgrid.id          = this.blockId + '_grid';
            cntgrid.style.width = '951px';
            cntgrid.align       = 'left';
            area.appendChild(cntgrid);

            if (data.addinfo.length) {
                var cntinfo              = this.crnode();
                cntinfo.id               = this.blockId + '_old_data_block';
                cntinfo.style.minHeight  = '30px';
                cntinfo.style.paddingTop = '10px';
                cntinfo.style.color      = 'black';
                cntinfo.style.fontSize   = '10pt';
                cntinfo.align            = 'left';
                area.appendChild(cntinfo);
                var table         = this.crnode('table');
                table.cellSpacing = 0;
                table.border      = 0;
                table.cellPadding = 1;
                cntinfo.appendChild(table);
                // Вычисляем общее колличество boxes и amount у товара
                // Нужно для формирования таблицы "Было"
                var old = {
                    amount: 0,
                    boxes : 0
                }, cur  = {
                    amount: 0,
                    boxes : 0
                };
                for (var i = 0; i < data.addinfo.length; i++) {
                    old.amount += itemWindow.toFloat(data.addinfo[i].lastBlockAmount);
                    old.boxes += itemWindow.toFloat(data.addinfo[i].lastBlockBoxes);
                    cur.amount += itemWindow.toFloat(data.addinfo[i].curBlockAmount);
                    cur.boxes += itemWindow.toFloat(data.addinfo[i].curBlockBoxes);
                }

                var allClaims = data.addinfo; // Данные полученные с сервера

                // Таблица "Было"
                var row                   = table.insertRow(0); // Создаем заголовки табилцы "Было"
                row.style.backgroundColor = '#bbb';
                $(row.insertCell(0)).attr({
                    width: 150,
                    align: 'center'
                }).html('Заявка');
                $(row.insertCell(1)).attr({
                    width: 100,
                    align: 'center'
                }).html('Вес');
                $(row.insertCell(2)).attr({
                    width: 100,
                    align: 'center'
                }).html('Кол-во/Роликов');
                $(row.insertCell(3)).attr({
                    width: 100,
                    align: 'center'
                }).html('Секция');

                var line = 1; // добавляем данные пришедшие с сервера в таблицу  "Было"
                allClaims.forEach(function (claim)
                {
                    var row = table.insertRow(line);
                    if (line % 2 == 0) {
                        row.style.backgroundColor = '#cacaca';
                    }
                    $(row.insertCell(0)).attr({
                        width: 150,
                        align: 'center'
                    }).html(claim.task);
                    $(row.insertCell(1)).attr({
                        width     : 100,
                        align     : 'center',
                        'data-old': itemWindow.toFloat(claim.curBlockAmount),
                        'class'   : 'old_amount_' + claim.task
                    })
                        .html(itemWindow.toFloat(claim.curBlockAmount));
                    $(row.insertCell(2)).attr({
                        width     : 100,
                        align     : 'center',
                        'data-old': itemWindow.toFloat(claim.curBlockBoxes),
                        'class'   : 'old_box_' + claim.task
                    })
                        .html(claim.curBlockBoxes);
                    $(row.insertCell(3)).attr({
                        width: 100,
                        align: 'center'
                    }).html(claim.placing);
                    line++;
                });

                var row                   = table.insertRow(line);
                row.style.backgroundColor = '#ccc';
                $(row.insertCell(0)).attr({
                    width: 150,
                    align: 'center'
                }).html('Всего: ');
                $(row.insertCell(1)).attr({
                    width: 100,
                    align: 'center'
                }).html(itemWindow.toFloat(cur.amount));
                $(row.insertCell(2)).attr({
                    width: 100,
                    align: 'center'
                }).html(String(cur.boxes));
                $(row.insertCell(3)).attr({
                    width: 100,
                    align: 'center'
                }).html(' ');
                // ---- конец таблицы "Было"
            }

            // create information grid
            this.grid = new Grid({
                conteinerId             : cntgrid.id,
                imgError                : '/img/system/error.16.png',
                imgLoader               : '/img/ld/ld3.gif',
                perpage                 : 10,
                displayPaging           : 0,
                useCorrectionScrollWidth: false
            });

            // Верхний грид с информацией о товаре
            this.grid.head = {
                id          : {
                    caption: 'ID',
                    width  : 50,
                    aliace : function (v, cnt, rowData)
                    {
                        return $('<span>')
                            .text(v)
                            .after(
                                $('<input>').attr({
                                    type : 'hidden',
                                    name : 'data[depotId]',
                                    value: rowData.depot_id
                                })
                            )
                            .after(
                                $('<input>').attr({
                                    type : 'hidden',
                                    name : 'data[itemid]',
                                    value: v
                                })
                            );
                    }
                },
                title       : {
                    caption: configTitle,
                    width  : 160,
                    aliace : function (v, cnt, rowData)
                    {
                        return v;
                    },
                    align  : 'left'
                },
                prop        : {
                    caption: configProp,
                    width  : 80,
                    aliace : function (v, cnt, rowData)
                    {
                        return eval(configPropReturn);
                    }
                },
                color       : {
                    caption: configColor,
                    width  : 100,
                    aliace : function (v, cnt, rowData)
                    {
                        return eval(configColorReturn);
                    }
                },
                boxType     : {
                    caption: configBoxType,
                    width  : 80,
                    aliace : function (v, cnt, rowData)
                    {
                        return eval(configBoxTypeReturn);
                    }
                },
                volum       : {
                    caption: configVolum,
                    width  : 80,
                    aliace : function (v, cnt, rowData)
                    {
                        return eval(configVolumReturn);
                    }
                },
                height      : {
                    caption: configHeight,
                    width  : 80,
                    aliace : function (v, cnt, rowData)
                    {
                        // Отображение реального поставщика
                        showVendornameTitle(rowData, cnt);
                        return eval(configHeightReturn);
                    }
                },
                width       : {
                    caption: configWidth,
                    width  : 80,
                    aliace : function (v, cnt, rowData)
                    {
                        return eval(configWidthReturn);
                    }
                },
                depth       : {
                    caption: configDepth,
                    width  : 80,
                    aliace : function (v, cnt, rowData)
                    {
                        return eval(configDepthReturn);
                    }
                },
                labelWidth  : {
                    caption: configLabelWeight,
                    width  : 80,
                    sort   : 1,
                    aliace : function (v, cnt, rowData)
                    {
                        return eval(configLabelWeightReturn);
                    }
                },
                inBoxes     : {
                    caption: 'Кол-во в упаковке / средний вес ',
                    width  : 100,
                    aliace : function (v, cnt, rowData)
                    {
                        return (parseFloat(v) || '');
                    }
                },
                amountWeight: {
                    caption: 'Кол-во (штук) / общий вес',
                    width  : 100,
                    aliace : function (v, cnt, rowData)
                    {
                        return (parseFloat(v) || '');
                    }
                },
                boxesRols   : {
                    caption: 'Кол-во упаковок / кол-во роликов',
                    width  : 100,
                    aliace : function (v, cnt, rowData)
                    {
                        return (parseFloat(v) || '');
                    }
                },
                description : {
                    caption: 'Примечание',
                    width  : 200,
                    aliace : function (v, cnt, rowData)
                    {
                        return (v || '');
                    }
                }
            };

            this.grid.create();
            this.grid.data = [data];
            this.grid.update();

            // create cubpunel for select all
            var cntinfo = this.crnode();
            cntinfo.appendChild(itemWindow.crtxtnode('Информация по приходам '));
            cntinfo.style.paddingTop = '10px';
            cntinfo.style.textAlign  = 'left';
            var all                  = this.crnode('label');
            $(all).css({
                'float'       : 'right',
                'margin-right': '20px'
            });
            cntinfo.appendChild(all);
            area.appendChild(cntinfo);

            // create conteier for comment data

            // create conteier for input amount/boxes
            var cntinfo              = this.crnode();
            cntinfo.id               = this.blockId + '_info';
            cntinfo.style.minHeight  = '30px';
            cntinfo.style.paddingTop = '10px';
            cntinfo.align            = 'left';
            area.appendChild(cntinfo);

            this.grid2 = new Grid({
                conteinerId: this.blockId + '_info',
                imgError   : '/img/system/error.16.png',
                imgLoader  : '/img/ld/ld3.gif',
                perpage    : 9999 // Выводим на странице все 9999 элементов, т.к. иначе при сохранении окна могут возникнуть ошибки типа "Количество и вес товара по заявке №... не совпадают"
            });

            // грид содержащий данные о всех заявках и который мы по сути редактируем
            // Вся информация, которая шлется на сервер берется из этого грида
            this.grid2.head = {
                task                : {
                    caption: 'Заявка',
                    width  : 100,
                    aliace : function (v, cnt, rowData)
                    {
                        // Привязываем строку для дальнейших проверок
                        rowData.bindedSectionTr = $(cnt).parents('tr:first');

                        if (rowData.defect == 1) {
                            // Если товар бракованый, подсветим строку
                            $(cnt).closest('tr').css('backgroundColor', '#dfd3c9');
                            var title = 'Брак';
                            if (rowData.defect_reason) {
                                title += '. Причина брака: ' + rowData.defect_reason;
                            }
                            $(cnt).closest('tr').attr('title', title);
                        }

                        let update    = '<input type="hidden" class="isupdate" name="data[tasks][' + v + '][update][]" value="1"/>';
                        let defect    = '<input type="hidden" class="defect" name="data[tasks][' + v + '][defect][]" value="' + rowData.defect + '"/>';
                        let history   = '<input type="hidden" name="data[tasks][' + v + '][history][]" value="' + rowData.history_id + '"/>';
                        let oldAmount = '<input type="hidden" name="data[tasks][' + v + '][oldAmount][]" value="' + rowData.amount + '"/>';

                        return `
                            <a target="_blank" rel="opener" href="` + rowData.url + `">` + v + `</a>
                            <input type="hidden" name="data[tasks][` + v + `][oldPlace][]" value="` + rowData.placing + `" />
                            <input type="hidden" name="data[tasks][` + v + `][initial_transfer_detailed_id][]" value="` + rowData.initial_transfer_detailed_id + `" />
                        ` + update + defect + history + oldAmount;
                    }
                },
                date                : {
                    caption: 'Дата',
                    width  : 75
                },
                price               : {
                    caption: 'Цена',
                    width  : 75,
                    aliace : function (v, cnt, rowData)
                    {
                        return (itemWindow.toFloat(v) || '');
                    }
                },
                average             : {
                    caption: 'Средний вес',
                    width  : 100,
                    aliace : function (v, cnt, rowData)
                    {
                        return (itemWindow.toFloat(v) || itemWindow.overlay.grid.data[0].inBoxes);
                    }
                },
                placing             : {
                    caption: 'Секция',
                    width  : 140,
                    aliace : function (v, cnt, rowData, rowIndex)
                    {
                        var claimid = '<input type="hidden" name="data[tasks][' + rowData.task + '][claimid][]" value="' + rowData.claimid + '" />';
                        return claimid + '<input name="data[tasks][' + rowData.task + '][placing][]" data-old-section="' + v + '" class="section_all section_' + rowData.task + '" style="text-align:left; box-sizing: border-box; width:100%;"' + ' type="text" value="' + v + '"  >';
                    }
                },
                curBlockAmount      : {
                    caption: 'Кол-во/<br>общий вес',
                    width  : 120,
                    aliace : function (v, cnt, rowData, rowIndex)
                    {
                        var addStyle    = (rowData.type != 2 ? 'background-color:#eee; color:#777;' : '');
                        var readonly    = (rowData.type != 2 ? 'readonly' : '');
                        var blockedItem = ((Number(rowData.blocked) || 0) > 0) ? 'readonly' : '';
                        //
                        if ((Number(rowData.curBlockBoxes) || 0) > 0) {
                            var blocked = '';
                        } else {
                            var blocked = 'readonly';
                            v           = 0;
                        }
                        readonly   = (readonly.length == 0) ? blocked : '';
                        readonly   = (readonly.length == 0) ? blockedItem : readonly;
                        const hidden = rootScope.isOnlySectionsMode(rowData) ? 'hidden' : 'text';

                        return ((hidden == 'hidden') ? (itemWindow.toFloat(v) ? itemWindow.toFloat(v) : '') : '') + '<input name="data[tasks][' + rowData.task + '][amount][]" itype="amount" oninput="itemWindow.overlay.updateCelldata(this, \'curBlockAmount\')"  style="text-align:left; box-sizing: border-box; width: 100%; ' + addStyle + '" type="' + hidden + '" value="' + (itemWindow.toFloat(v) ? itemWindow.toFloat(v) : '') + '" ' + 'class="amount_all amount_' + rowData.task + '" ' + readonly + ' >';
                    }
                },
                curBlockBoxes       : {
                    caption: 'Кол-во упаковок/<br>кол-во роликов',
                    width  : 120,
                    aliace : function (v, cnt, rowData, rowIndex)
                    {
                        var addStyle    = (rowData.type == 2 ? 'background-color:#eee; color:#777;' : '');
                        var readonly    = ''; //(rowData.type == 2 ? 'readonly' : '');
                        var blockedItem = ((Number(rowData.blocked) || 0) > 0) ? 'readonly' : '';

                        var blocked = ((Number(rowData.curBlockBoxes) || 0) > 0) ? '' : 'readonly';
                        readonly    = (readonly.length == 0) ? blocked : readonly;
                        readonly    = (readonly.length == 0) ? blockedItem : readonly;
                        var hidden  = rootScope.isOnlySectionsMode(rowData) ? 'hidden' : 'text';

                        return ((hidden == 'hidden') ? (itemWindow.toFloat(v) ? itemWindow.toFloat(v) : '') : '') + '<input name="data[tasks][' + rowData.task + '][box][]" itype="boxes" oninput="itemWindow.overlay.updateCelldata(this, \'curBlockBoxes\')" style="text-align:left; box-sizing: border-box; width:100%; ' + addStyle + '" type="' + hidden + '" value="' + (itemWindow.toFloat(v) ? itemWindow.toFloat(v) : '') + '" ' + 'class="box_all box_' + rowData.task + '" ' + ' data-task="' + rowData.task + '" ' + readonly + ' >';
                    }
                },
                blocked             : {
                    caption: ' ',
                    width  : 50,
                    aliace : function (v, cnt, rowData)
                    {
                        if (parseInt(v) > 0) {
                            const claims = (rowData?.sectionDdmInitialInfo?.ddData?.blocksData?.blockedByClaims||[]);
                            const btn = $('<input class="attention" title="Заблокировано ' + Number(v) + ', ' + claims.map(c => c.full_id).join(', ') + '" type="button" style="cursor:pointer; width:40px; border:none; background:transparent url(/img/system/error.16.png) no-repeat center center">');

                            btn.click((e) =>
                            {
                                e.stopPropagation();
                                e.preventDefault();

                                let html = '';
                                for (let claim of claims) {
                                    if (parseInt(claim.claim_status)) {
                                        html += `<a href="${claim.url}" target="_blank" rel="opener">${claim.full_id}</a> `;
                                    }
                                }

                                (new AjaxForm(
                                    `
                                        <section>
                                            <form action="">
                                                <section style="padding: 10px;">${html}</section>
                                                <footer>
                                                    <input type="button" data-form-button="hide" value="Закрыть" class="amd-button amd-button_primary">
                                                </footer>
                                            </form>
                                        </section>`,
                                    {
                                        width        : 300,
                                        style        : 'strict',
                                        hideOnEscape : true,
                                        destroyOnHide: true
                                    })).show();
                            });

                            return btn;
                        } else {
                            return '';
                        }
                    }
                },
                addItem             : {
                    caption: ' ',
                    width  : 50,
                    aliace : function (v, cnt, rowData)
                    {
                        var blockedItem = Number(rowData.blocked) > 0;
                        var nullBoxes   = Number(rowData.curBlockBoxes) == 0;

                        // если есть блокировки, то не показываем плюсик
                        if (blockedItem || nullBoxes) {
                            return '';
                        }

                        // Разбиение на секции запрещено, не показываем кнопку
                        if (rootScope.isOnlySectionsMode(rowData)) {
                            return '';
                        }

                        return '<input class="addItem" type="button" style="cursor:pointer; width:40px; border:none; background:transparent url(/img/system/add.png) no-repeat center center">';
                    }
                },
                depotDetailedManager: {
                    caption: 'Блокировки под менеджеров',
                    width  : 150,
                    aliace : function (v, cnt, rowData)
                    {
                        $(cnt).parents('tr:first').append(
                            $('<input type="hidden" data-rowdata-field-name="sectionDdmInitialInfo">')
                                .val(JSON.stringify(rowData.sectionDdmInitialInfo))
                        );

                        if (rowData.sectionDdmInitialInfo.managersRowsCount > 0) {
                            // Если по строке есть детализации, отображаем кнопку редактирования
                            return $('<img src="/img/system/clientinfo.png" style="cursor: pointer" title="По данной секции имеются блокировки под менеджеров"/>').click(function ()
                            {
                                showDepotDetailedManagerTransferForm(rowData, $(cnt).parents('tr:first'));
                            });
                        }

                        return '';
                    }
                }
            };

            var depotDetailedManagerTransferForms = {};

            var transferItemForm = this;

            /**
             * Функция выполняет отображения формы переноса детализаций по указанной секции
             * ticket3333
             *
             * @param sectionRowData    Объект, содержащий информацию по секции
             * @param sectionTr         $-объект строки, использоваемой для редактирования секции
             */
            function showDepotDetailedManagerTransferForm(sectionRowData, sectionTr)
            {
                if (!depotDetailedManagerTransferForms[sectionRowData.claimid]) {
                    depotDetailedManagerTransferForms[sectionRowData.claimid] = new Depot_Section_DepotDetailedManager_Transfer_Form({
                        transferItemForm: transferItemForm,
                        sectionRowData  : sectionRowData,
                        bindedSectionTr : sectionTr
                    });

                    // Обнуляем ключ `sectionDdmInitialInfo`, т.к. он больше не нужен
                    sectionRowData.sectionDdmInitialInfo = null;
                }

                depotDetailedManagerTransferForms[sectionRowData.claimid].actualizeState().show();
            }

            // Убираем колонку "Цена", если нет прав упользователя
            if (typeof itemWindow.perm.price === "undefined" || itemWindow.perm.price != 1) {
                delete this.grid2.head.price;
            }

            this.grid2.create();
            this.grid2.data          = data.addinfo;
            this.grid2.onAfterUpdate = function ()
            {
                // itemWindow.overlay.cntToCenter();
                itemWindow.overlay.controlButtonsGrid2();
            };
            this.grid2.update();
            this.grid2.onClick = function (dataRowIndex, dataColIndex, node)
            {
                if (node.nodeName.toLowerCase() != 'input') {
                    return;
                }
                if (dataColIndex == 'clear') {
                    itemWindow.overlay.grid2.data[dataRowIndex].curBlockAmount = 0;
                    itemWindow.overlay.grid2.data[dataRowIndex].curBlockBoxes  = 0;
                    itemWindow.overlay.grid2.update();
                }
                if (dataColIndex == 'save') {
                    itemWindow._displayEditproductEnd({
                        claimId   : itemWindow.overlay.tmpdata.claimId,
                        data      : [this.data[dataRowIndex]],
                        itemId    : itemWindow.overlay.tmpdata.id,
                        pnumber   : itemWindow.getProductNumber(itemWindow.overlay.tmpdata.id),
                        afterClose: 0
                    }, 1);
                }
            };

            // create button conteiner
            var cntinfo              = this.crnode();
            cntinfo.style.paddingTop = '10px';
            cntinfo.style.textAlign  = 'right';
            // control close after save
            var all                  = this.crnode('label');
            $(all).css({
                'float': 'left'
            });
            var ch                 = this.crnode('input');
            ch.type                = 'checkbox';
            ch.id                  = this.blockId + '_close_after_save';
            ch.style.verticalAlign = 'middle';
            ch.checked             = true;
            all.appendChild(ch);
            all.appendChild(itemWindow.crtxtnode(' закрыть после сохранения '));

            // create button ok
            var btok         = this.crnode('input');
            btok.type        = 'button';
            btok.disabled    = true;
            btok.id          = this.blockId + '_bt_ok';
            btok.value       = 'Принять';
            btok.style.width = '125px';
            // При отправке данных, проверяем есть ли дробление штуного товара
            // Если есть то выводим окно с подтвержением
            btok.onclick = function ()
            {
                btok.disabled = true;

                if (parseInt(itemWindow.overlay.tmpdata.type) == 1) {
                    var isFloat = false;
                    $('.filter-grid-body input.box_all, .filter-grid-body input.amount_all').each(function ()
                    {
                        //Приводим к числу чтоб не отправлялась пустая строка
                        $(this).val($(this).val() * 1);

                        if ($(this).val().indexOf('.') != -1) {
                            isFloat       = true;
                            btok.disabled = false;
                            return;
                        }
                    });
                    if (isFloat) {
                        if (!confirm('Вы уверены что хотите раздробить штучный товар?')) {
                            btok.disabled = false;
                            return false;
                        }
                    }
                }

                // Собираем и отправляем данные об изменениях в секциях
                var collectedData = $('.section-transfer-item-wnd .filter-grid-body input').serialize();

                // Сбрасываем ошибки детализаций броней под менеджеров
                $(transferItemForm.grid2.node()).find('tr.ddm-errored').each(function (i, target)
                {
                    $(target).removeClass('ddm-errored');
                    $(target).find('td[lang="depotDetailedManager"]').attr('title', null);
                });

                /**
                 * Функция выполняет отображение ошибки для секции
                 *
                 * @param sectionTr
                 * @param message
                 */
                function addSectionTrError(sectionTr, message)
                {
                    sectionTr.addClass('ddm-errored');
                    if (message) {
                        // Добавляем сообщение об ошибке в тег `title`
                        sectionTr.find('td[lang="depotDetailedManager"]').attr('title', message);
                    }
                }

                // Проверяем детализации броней под менеджеров
                var sectionDdmInitialInfoValidateResult = true;
                data.addinfo.forEach(function (sectionRowData)
                {
                    if (sectionRowData.sectionDdmInitialInfo && sectionRowData.sectionDdmInitialInfo.managersRowsCount > 0) {
                        // Если по секции есть детализации броней под менеджеров,
                        // то необходимо проверить схождение их количества с общим количеством по секции

                        var sectionAmountInput = sectionRowData.bindedSectionTr.find('input[itype="amount"]');
                        var sectionBoxesInput  = sectionRowData.bindedSectionTr.find('input[itype="boxes"]');

                        if (
                            (Math.abs(parseFloat(sectionRowData.sectionDdmInitialInfo.ddData.amount || 0) - parseFloat(sectionAmountInput.val() || 0)) > 0) ||
                            (Math.abs(parseFloat(sectionRowData.sectionDdmInitialInfo.ddData.boxes || 0) - parseFloat(sectionBoxesInput.val() || 0)) > 0)
                        ) {
                            addSectionTrError(sectionRowData.bindedSectionTr, 'Суммарное количество по блокировкам под менеджеров должно быть равно общему количеству по секции');
                            sectionDdmInitialInfoValidateResult = false;
                        }
                    }
                });

                // Также собираем данные для сохранения детализаций
                var ddmTransferFormsData           = {};
                var ddmTransferFormsValidateResult = true;
                for (var ddId in depotDetailedManagerTransferForms) {
                    /** @type {Depot_Section_DepotDetailedManager_Transfer_Form} */
                    var depotDetailedManagerTransferForm = depotDetailedManagerTransferForms[ddId];

                    // Перед проверкой формы делаем загрузку актуального состояния
                    depotDetailedManagerTransferForm.actualizeState();
                    if (depotDetailedManagerTransferForm.validate(false)) {
                        if (depotDetailedManagerTransferForm.isFormChanged()) {
                            // Добавляем данные с формы в массив только в том случае, если были изменения
                            ddmTransferFormsData[ddId] = depotDetailedManagerTransferForm.getSendData();
                        }
                    } else {
                        // В случае ошибок отображаем их на форме
                        addSectionTrError(depotDetailedManagerTransferForm.bindedSectionTr, depotDetailedManagerTransferForm.validation.getErrorInfo('При проверке формы БЛОКИРОВКИ СЕКЦИИ ПОД МЕНЕДЖЕРОВ обнаружены ошибки:'));
                        ddmTransferFormsValidateResult = false;
                    }
                }

                if (!(
                    sectionDdmInitialInfoValidateResult === true &&
                    ddmTransferFormsValidateResult === true
                )) {
                    return false;
                }

                $.ajax({
                    url    : '/depot/section/transfer',
                    cache  : false,
                    data   : {
                        collectedData       : collectedData,
                        ddmTransferFormsData: ddmTransferFormsData
                    },
                    type   : 'POST',
                    success: function (data)
                    {
                        var received = (typeof (data) === "object") ? data : $.parseJSON(data);
                        if (received.error) {
                            if (received.reason === 'reload') {
                                // Если необходима перезагрузка форм (детализации по секциям)
                                for (var ddId in received.data) {
                                    if (ddId in depotDetailedManagerTransferForms) {
                                        /** @type {Depot_Section_DepotDetailedManager_Transfer_Form} */
                                        var depotDetailedManagerTransferForm = depotDetailedManagerTransferForms[ddId];

                                        depotDetailedManagerTransferForm.reloadState($.extend(received.data[ddId], {
                                            initialFormDataIsChanged: true
                                        }), function ()
                                        {
                                            depotDetailedManagerTransferForm.update('reload');

                                            // Обязательно сохраняем новое состояние
                                            depotDetailedManagerTransferForm.saveCurrentState();
                                        });

                                        // Информируем пользователя о необходимости проверки формы
                                        addSectionTrError(depotDetailedManagerTransferForm.bindedSectionTr, 'На сервере произошли изменения. Ознакомьтесь с изменениями, сделайте необходимые правки и повторите отправку формы');
                                    }
                                }
                            } else if (received.reason === 'reloadGrid') {
                                alert(received.errortext); // Если была ошибка, уведомляем
                                // Если нет, просто закрываем окно и обновляем основной грид на странице
                                close();
                            } else {
                                alert(received.errortext); // Если была ошибка, уведомляем
                                btok.disabled = false;
                            }
                        } else {
                            // Если нет, просто закрываем окно и обновляем основной грид на странице
                            success();
                        }
                    },
                    error  : function (obj)
                    {
                        alert('Во время выполнения операции произошла ошибка');
                    }
                });
                return 1;
            };
            cntinfo.appendChild(btok);
            $(btok).attr('data-action', 'apply');

            // create button cancel
            var btcn         = this.crnode('input');
            btcn.type        = 'button';
            btcn.value       = 'Отмена';
            btcn.style.width = '125px';
            btcn.onclick     = function ()
            {
                close();
            };
            cntinfo.appendChild(btcn);
            // add buttons comteiner
            area.appendChild(cntinfo);
            // to center popup
            this.cntToCenter();
        };
        this.overlay.onBeforeClose   = function ()
        {
            this.grid.close();
            this.grid2.close();
        };
        this.overlay.onAfterClose    = function ()
        {
            delete (itemWindow.overlay);
        };
        this.overlay.restore         = function ()
        {
            var obj = this.getCnt();
            $(obj).css({
                'background-image'   : '',
                'background-position': 'center center',
                'background-repeat'  : 'no-repeat'
            });
            this.onBeforeClose();
            $(obj).empty();
            this.onAfterCreate();
        };
        /**
         * Функция автоматического расчета веса или колличества, при изменении данных в input
         * */
        this.overlay.updateCelldata = function (obj, type)
        {

            var one = itemWindow.toFloat(this.grid.data[0].inBoxes);
            var tr  = $(obj).parents('tr');
            if (type == 'curBlockBoxes') {
                $(tr).find('.amount_all').val(itemWindow.toFloat(one * parseInt($(obj).val())));
            } else {
                if (this.tmpdata.type != 2) {
                    $(tr).find('.box_all').val(Math.ceil(Math.abs($(obj).val() / one)));
                }
            }
        };
        this.overlay.controlButtonsGrid2 = function ()
        {
            var maxBlock       = itemWindow.toFloat((this.tmpdata.type == 2 ? this.tmpdata.boxes : this.tmpdata.amountWeight));
            var lastTotalBlock = 0,
                curTotalBlock  = 0;
            var saveAll        = false;
            for (var i = 0; i < this.grid2.data.length; i++) {
                maxBlock += itemWindow.toFloat((this.tmpdata.type == 2 ? this.grid2.data[i].boxes : this.grid2.data[i].amount));
                lastTotalBlock += itemWindow.toFloat(this.grid2.data[i][(this.tmpdata.type == 2 ? 'lastBlockBoxes' : 'lastBlockAmount')]);
                curTotalBlock += itemWindow.toFloat(this.grid2.data[i][(this.tmpdata.type == 2 ? 'curBlockBoxes' : 'curBlockAmount')]);
                if ((Math.abs(this.grid2.data[i].curBlockAmount - this.grid2.data[i].lastBlockAmount) > itemWindow.precision || Math.abs(this.grid2.data[i].curBlockBoxes - this.grid2.data[i].lastBlockBoxes) > itemWindow.precision)) {
                    saveAll = true;
                }
            }
            const rows = this.grid2.node().firstChild.childNodes.item(1).firstChild.rows || [];

            for (var i = 0; i < rows.length; i++) {

                var index    = i;
                var saveInp  = this.getInputTypeRow(rows[i], 'save');
                var clearInp = this.getInputTypeRow(rows[i], 'clear');
                if (saveInp) {
                    saveInp.disabled         = true;
                    saveInp.style.background = 'transparent url(/img/system/reserve.16.png) no-repeat center center';
                }
                if (clearInp) {
                    clearInp.disabled = !itemWindow.toFloat(this.grid2.data[index].curBlockAmount);
                }
                if ((Math.abs(this.grid2.data[index].curBlockAmount - this.grid2.data[index].lastBlockAmount) > itemWindow.precision || Math.abs(this.grid2.data[index].curBlockBoxes - this.grid2.data[index].lastBlockBoxes) > itemWindow.precision)) {
                    if (saveInp && itemWindow.perm.products.sectionedit > 2 && this.grid2.head.info) {
                        saveInp.disabled         = (!saveAll || curTotalBlock < itemWindow.precision);
                        saveInp.style.background = 'transparent url(/img/system/save.16.png) no-repeat center center';
                    }
                }
            }
            if (itemWindow.node(this.blockId + '_bt_ok')) {
                itemWindow.node(this.blockId + '_bt_ok').disabled = (!saveAll || curTotalBlock < itemWindow.precision);
            }
        };
        this.overlay.getInputTypeRow     = function (row, type)
        {
            var inp = row.getElementsByTagName('input');
            for (var i = 0; i < inp.length; i++) {
                if (inp.item(i).getAttribute('itype') == type) {
                    return inp.item(i);
                }
            }
            return false;
        };
        this.overlay.getAll              = function (obj)
        {
            obj.previousSibling.data = (obj.checked ? 'отменить все : ' : 'забрать все : ');
            for (var i = 0; i < this.grid2.data.length; i++) {
                this.grid2.data[i].curBlockAmount = (obj.checked ? (this.grid2.data[i].type == 2 ? (this.grid2.data[i].otherblock - this.grid2.data[i].confirmBoxes > 0 ? (this.grid2.data[i].maxAmount - this.grid2.data[i].confirmAmount - 1) : (this.grid2.data[i].maxAmount - this.grid2.data[i].confirmAmount)) : this.grid2.data[i].amount) : 0);
                this.grid2.data[i].curBlockBoxes  = (obj.checked ? this.grid2.data[i].boxes : 0);
            }
            this.grid2.update();
        };
        this.overlay.updateData          = function (data)
        {
            this.tmpdata         = data;
            this.tmpdata.claimId = itemWindow.node(itemWindow.formId)['claim[id]'].value;
            this.grid.data       = [data];
            this.grid.update();
            for (var i = 0; i < this.grid2.data.length; i++) {
                for (var j = 0; j < data.addinfo.length; j++) {
                    if (data.addinfo[j].detailed_id == this.grid2.data[i].detailed_id) {
                        data.addinfo[j].curBlockAmount = this.grid2.data[i].curBlockAmount > data.addinfo[j].amount ? data.addinfo[j].amount : this.grid2.data[i].curBlockAmount;
                        data.addinfo[j].curBlockBoxes  = this.grid2.data[i].curBlockBoxes > data.addinfo[j].boxes ? data.addinfo[j].boxes : this.grid2.data[i].curBlockBoxes;
                        break;
                    }
                }
            }
            this.grid2.data = data.addinfo;
            this.grid2.update();
        };
        this.overlay.checkChangeTotal    = function ()
        {
            var ctrlValue  = this.tmpdata.curblock;
            var ctrlValue2 = 0;
            for (var i = 0; i < this.grid2.data.length; i++) {
                ctrlValue2 += itemWindow.toFloat((this.tmpdata.type == 1 ? this.grid2.data[i].curBlockAmount : this.grid2.data[i].curBlockBoxes));
            }
            return Math.abs(itemWindow.round(ctrlValue) - itemWindow.round(ctrlValue2)) > itemWindow.precision;
        };
        this.overlay.create              = function ()
        {
            var _self = this;
            var block = this.crnode();
            block.id  = this.blockId + '_block';
            $(block).css({
                'position'        : 'fixed',
                'left'            : '0px',
                'top'             : '0px',
                'width'           : '100%',
                'height'          : '100%',
                'background-color': this.backgroundColor,
                'text-align'      : 'center',
                'z-index'         : '1000',
            });
            document.body.appendChild(block);
            this.onAfterCreate();
            return this;
        };

        this.overlay.create();
    };


    /**
     * Возвращает true если можно редактировать только название секции
     * @param rowData
     */
    this.isOnlySectionsMode = function(rowData)
    {
        return (
            [20, 22].includes(parseInt(rowData.claim_type_id)) ||
            parseInt(rowData.product_type) === 4
        );
    }

    this.node = function (id)
    {
        return typeof id == 'string' ? document.getElementById(id) : id;
    };

    this.crtxtnode = function (text)
    {
        return document.createTextNode(text);
    };

    /**
     * создание узла дом
     */
    this.crnode = function (el)
    {
        return document.createElement((el || 'div'));
    };

    this.toFloat = function (str)
    {
        str = parseFloat(str);
        if (isNaN(str)) {
            return 0;
        }
        return this.round(str);
    };

    /**
     * round number with precision 5
     * @param float number
     * @return float
     */
    this.round = function (number)
    {
        return Math.round(parseFloat(number) * 100000) / 100000;
    };

    /**
     * удаляет все дочерние елементы из заданного контейнера
     * @param node|string obj
     * @return void
     */
    this.empty = function (obj)
    {
        obj = this.node(obj);
        while (obj.firstChild) {
            obj.removeChild(obj.firstChild);
        }
    };

    /**
     * uncompres data
     */
    this.uncompresData = function (str)
    {
        return eval('(' + str + ')');
    };

});

function success()
{
    itemWindow.overlay.close();
    promiseFunctions.resolve(true);
}

function close()
{
    itemWindow.overlay.close();
    promiseFunctions.resolve(false);
}


$(document).ready(function () {
    /**
     * Событие на нажатие кнопки добавить сецию,
     * клонируем строку, в которой было нажатие, изменяем нужные аттрибуты и вставляем сразу за ней
     * */
    $('body').on('click', '.addItem', function () {
        var line = $(this).parents('tr');
        var cloneline = $(line).clone();
        $(cloneline).find('input[type="text"]').val(''); // зануляем все инпуты
        $(cloneline).find('input.attention').remove(); // Убираем восклицательный знак, если он есть
        $(cloneline).find('.addItem').css({
            'background': 'url(/img/system/del.png) center center no-repeat'
        })
            .addClass('delItem')
            .removeClass('addItem'); // Переназначаем кнопку с "Добавить" на "Удалить"
        $(cloneline).find('input.isupdate').val('0'); // По дефолту, в этой строке все поля предназначены для инсерта

        // Удаляем ссылку на редактирование детализации броней заказов
        $(cloneline).find('td[lang="depotDetailedManager"] img').remove();

        $(cloneline).insertAfter(line);
    });

    /**
     * Удаление строки с секцией
     * */
    $('body').on('click', '.delItem', function () {
        $(this).parents('tr').remove();
    });

    // /**
    //  * Показывать информацию про товар
    //  */
    // $('body').on('click', '.show_advanced', function (e) {
    //     if (!e) {
    //         e = window.event;
    //     }
    //     if (e.stopPropagation) {
    //         e.stopPropagation();
    //     }
    //     var itemId = $(this).attr('itemid');
    //     showAdvanced(itemId);
    // });

    /**
     * Разрешаем только цифры для Кол-во/Общий вес
     */
    $('body').on('keydown', '.amount_all', function (event) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110, 190, 188]) !== -1 ||
            // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
            // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
            // let it happen, don't do anything
            if (event.keyCode == 188 || event.keyCode == 190 || event.keyCode == 110) {
                event.preventDefault();
                var rawval = $(this).val().toString();
                $(this).val(rawval + '.');
            }
            return;
        } else {
            // Ensure that it is a number and stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                event.preventDefault();
            }
        }
    });

    /**
     * Разрешаем только цифры для Кол-во упаковок/кол-во роликов
     */
    $('body').on('keydown', '.box_all', function (event) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 190, 110, 188]) !== -1 ||
            // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
            // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
            // let it happen, don't do anything
            if (event.keyCode == 188 || event.keyCode == 190 || event.keyCode == 110) {
                event.preventDefault();
                var rawval = $(this).val().toString();
                $(this).val(rawval + '.');
            }
            return;
        } else {
            // Ensure that it is a number and stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                event.preventDefault();
            }
        }
    });

    /**
     * События по вводу информации
     * Тут проходит верификация вводимых данных
     * */
    $('body').on('keyup', '.section-transfer-item-wnd .filter-grid-body input', function (e) {
        var className = $(this).attr('class').split(/\s+/).pop();

        if (className.indexOf('box_') >= 0 || className.indexOf('amount_') >= 0) { // верификация boxes и amount
            let hasZero = false;

            // Сумма введеная в форме
            var summ = 0;
            $('.' + className).each(function () {
                const v = Number($(this).val());
                summ += v;

                if (v <= 0) {
                    hasZero = true;
                }
            });

            // Сумма по заявке
            var tasksumm = 0;
            $('.old_' + className).each(function () {
                tasksumm += Number($(this).data('old'));
            });

            // Если сумма введены boxes или amount больше чем было, то ошибка.
            // Нельзя выставлять 0.
            if (summ > tasksumm || hasZero) {
                isError('.' + className);
                return false;
            } else {
                isOk('.' + className);
            }

        } else if (className.indexOf('section_') >= 0) { // Верификация вводимых секций

            var compareResult = compareValues('.' + className); // У одной заявки не могут быть 2 секции с одним названием
            if (!compareResult) {
                isError('.' + className);
            } else {
                isOk('.' + className);
            }

        }
    });
});

/**
 * Сравнение полей. Нужно для секций
 * @param {string} classname Имя класса с точкой
 * @return {boolean} Если повторения не найдены, возращает true
 * */
function compareValues(classname) {
    if ($(classname).length > 0) {
        var result = true;
        var allVal = [];
        $(classname).each(function () {
            var currentEl = $(this);
            var val = $(this).val();

            // Посмотрим, дефект, ли это
            var allow = false;

            var curElDefectVal = currentEl.closest('tr').find('input.defect').val();
            var curElUpdateVal = currentEl.closest('tr').find('input.isupdate').val();
            // Также необходимо проверить дефект ли это в таблице грида
            if (curElDefectVal == 1 && curElUpdateVal == 1) {
                // Если это строка с дефектной секцией
                // и если это не новая строка
                allow = true;
            }

            if (typeof allVal[val] === "undefined" || allow === true) {
                allVal[val] = 1
            } else {
                result = false;
                return;
            }
        });
        return result;
    }

    return true;
}

/**
 * @var object Сигнализатор ошибки при вводе
 * */
var errorContent = {
    'section': true,
    'amount': true,
    'box': true
};

/**
 * Если хотя бы одно поле с ошибкой, то блокирует кнопку отправки данных
 * @param {string} name имя класса
 * */
function isError(name) {
    var method = name.substr(1, name.indexOf('_') - 1);
    if (typeof errorContent[method] !== "undefined") {
        errorContent[method] = false;
        $(name).css({
            'background-color': '#E52D2D'
        });
        $(name).data('error', '1');
        $('#' + itemWindow.overlay.blockId + '_bt_ok').attr("disabled", "disabled");
    }
}

/**
 * Смотрит, если все поля не содержат ошибок, то разблокирует кнопку отправки данных
 * @param {string} name имя класса
 * */
function isOk(name) {
    var method = name.substr(1, name.indexOf('_') - 1);
    if (typeof errorContent[method] !== "undefined") {
        $(name).removeData('error');
        var errors = 0;
        $('.' + method + '_all').each(function () {
            errors += Number($(this).data('error')) || 0;
        });

        if (errors == 0) {
            errorContent[method] = true;
        }
    }

    $(name).css({
        'background-color': 'white'
    });
    if (errorContent.section && errorContent.amount && errorContent.box) {
        $('#' + itemWindow.overlay.blockId + '_bt_ok').removeAttr('disabled');
    }
}
