var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "../../../../../../../../../angular/decorator/component.decorator", "../../../../../../../../../angular/service/network-service.module", "angular", "../../../../../../../../../core/service/access.service"], function (require, exports, component_decorator_1, network_service_module_1, angular, access_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TransferItemForm = void 0;
    let promiseFunctions = {
        resolve: (result) => void 0,
        reject: (reason) => void 0,
    };
    let TransferItemForm = class TransferItemForm {
        constructor(httpService, $q, accessService) {
            this.httpService = httpService;
            this.$q = $q;
            this.accessService = accessService;
        }
        show(row) {
            return this.$q((resolve, reject) => {
                promiseFunctions = {
                    resolve,
                    reject
                };
                this.getTransferInfo(row)
                    .then(response => {
                    const rowData = angular.copy(row);
                    rowData.addinfo = response.data;
                    itemWindow.perm.price = Number(this.accessService.getAccess('section>showprice').isAllowed());
                    itemWindow.showWindow(rowData);
                });
            });
        }
        getTransferInfo(item) {
            return this.httpService
                .postOverlay('/depot/section/transferinfo?format=ajaxForm', {
                itemId: item.id,
                section: item.placing,
                amount: item.totalAmount,
                depotId: item.depot_id,
            });
        }
    };
    exports.TransferItemForm = TransferItemForm;
    exports.TransferItemForm = TransferItemForm = __decorate([
        (0, component_decorator_1.Injectable)(),
        __param(0, (0, component_decorator_1.Inject)(network_service_module_1.AJAX_FORM_BACKEND_SERVICE)),
        __param(1, (0, component_decorator_1.Inject)('$q')),
        __param(2, (0, component_decorator_1.Inject)(access_service_1.AMD_ACCESS_SERVICE))
    ], TransferItemForm);
    window['itemWindow'] = new (function () {
        this.perm = {};
        this.showWindow = function (data) {
            const rootScope = this;
            this.overlay = new overley();
            this.overlay.tmpdata = data;
            this.overlay.tmpdata.claimId = 0;
            this.overlay.onAfterCreate = function () {
                var wnd = this.crnode();
                wnd.className = 'filter-wnd section-transfer-item-wnd';
                wnd.id = this.blockId + '_cnt';
                wnd.style.display = 'inline-block';
                wnd.style.position = 'relative';
                wnd.style.border = '1px solid gray';
                wnd.style.maxHeight = '750px';
                wnd.style.overflowY = 'scroll';
                itemWindow.node(this.blockId + '_block').appendChild(wnd);
                $('.filter-wnd .filter-grid-body').css({
                    'max-height': '300px'
                });
                var area = this.crnode();
                area.style.display = 'inline-block';
                area.style.width = 'auto';
                area.style.height = 'auto';
                area.style.padding = '5px';
                wnd.appendChild(area);
                var wndcap = this.crnode();
                wndcap.className = 'filter-wnd-caption';
                $(wndcap).html('Расширенная информация по товару : ' + data.title + ' (ID:id)'.replace(/id/, data.id));
                wnd.appendChild(wndcap);
                var wndcapbt = this.crnode();
                wndcapbt.className = 'filter-wnd-caption-close-button';
                wndcapbt.title = 'закрыть диалог';
                wnd.appendChild(wndcapbt);
                wndcapbt.onclick = function () {
                    close();
                };
                var cntgrid = this.crnode();
                cntgrid.id = this.blockId + '_grid';
                cntgrid.style.width = '951px';
                cntgrid.align = 'left';
                area.appendChild(cntgrid);
                if (data.addinfo.length) {
                    var cntinfo = this.crnode();
                    cntinfo.id = this.blockId + '_old_data_block';
                    cntinfo.style.minHeight = '30px';
                    cntinfo.style.paddingTop = '10px';
                    cntinfo.style.color = 'black';
                    cntinfo.style.fontSize = '10pt';
                    cntinfo.align = 'left';
                    area.appendChild(cntinfo);
                    var table = this.crnode('table');
                    table.cellSpacing = 0;
                    table.border = 0;
                    table.cellPadding = 1;
                    cntinfo.appendChild(table);
                    var old = {
                        amount: 0,
                        boxes: 0
                    }, cur = {
                        amount: 0,
                        boxes: 0
                    };
                    for (var i = 0; i < data.addinfo.length; i++) {
                        old.amount += itemWindow.toFloat(data.addinfo[i].lastBlockAmount);
                        old.boxes += itemWindow.toFloat(data.addinfo[i].lastBlockBoxes);
                        cur.amount += itemWindow.toFloat(data.addinfo[i].curBlockAmount);
                        cur.boxes += itemWindow.toFloat(data.addinfo[i].curBlockBoxes);
                    }
                    var allClaims = data.addinfo;
                    var row = table.insertRow(0);
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
                    var line = 1;
                    allClaims.forEach(function (claim) {
                        var row = table.insertRow(line);
                        if (line % 2 == 0) {
                            row.style.backgroundColor = '#cacaca';
                        }
                        $(row.insertCell(0)).attr({
                            width: 150,
                            align: 'center'
                        }).html(claim.task);
                        $(row.insertCell(1)).attr({
                            width: 100,
                            align: 'center',
                            'data-old': itemWindow.toFloat(claim.curBlockAmount),
                            'class': 'old_amount_' + claim.task
                        })
                            .html(itemWindow.toFloat(claim.curBlockAmount));
                        $(row.insertCell(2)).attr({
                            width: 100,
                            align: 'center',
                            'data-old': itemWindow.toFloat(claim.curBlockBoxes),
                            'class': 'old_box_' + claim.task
                        })
                            .html(claim.curBlockBoxes);
                        $(row.insertCell(3)).attr({
                            width: 100,
                            align: 'center'
                        }).html(claim.placing);
                        line++;
                    });
                    var row = table.insertRow(line);
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
                }
                this.grid = new Grid({
                    conteinerId: cntgrid.id,
                    imgError: '/img/system/error.16.png',
                    imgLoader: '/img/ld/ld3.gif',
                    perpage: 10,
                    displayPaging: 0,
                    useCorrectionScrollWidth: false
                });
                this.grid.head = {
                    id: {
                        caption: 'ID',
                        width: 50,
                        aliace: function (v, cnt, rowData) {
                            return $('<span>')
                                .text(v)
                                .after($('<input>').attr({
                                type: 'hidden',
                                name: 'data[depotId]',
                                value: rowData.depot_id
                            }))
                                .after($('<input>').attr({
                                type: 'hidden',
                                name: 'data[itemid]',
                                value: v
                            }));
                        }
                    },
                    title: {
                        caption: configTitle,
                        width: 160,
                        aliace: function (v, cnt, rowData) {
                            return v;
                        },
                        align: 'left'
                    },
                    prop: {
                        caption: configProp,
                        width: 80,
                        aliace: function (v, cnt, rowData) {
                            return eval(configPropReturn);
                        }
                    },
                    color: {
                        caption: configColor,
                        width: 100,
                        aliace: function (v, cnt, rowData) {
                            return eval(configColorReturn);
                        }
                    },
                    boxType: {
                        caption: configBoxType,
                        width: 80,
                        aliace: function (v, cnt, rowData) {
                            return eval(configBoxTypeReturn);
                        }
                    },
                    volum: {
                        caption: configVolum,
                        width: 80,
                        aliace: function (v, cnt, rowData) {
                            return eval(configVolumReturn);
                        }
                    },
                    height: {
                        caption: configHeight,
                        width: 80,
                        aliace: function (v, cnt, rowData) {
                            showVendornameTitle(rowData, cnt);
                            return eval(configHeightReturn);
                        }
                    },
                    width: {
                        caption: configWidth,
                        width: 80,
                        aliace: function (v, cnt, rowData) {
                            return eval(configWidthReturn);
                        }
                    },
                    depth: {
                        caption: configDepth,
                        width: 80,
                        aliace: function (v, cnt, rowData) {
                            return eval(configDepthReturn);
                        }
                    },
                    labelWidth: {
                        caption: configLabelWeight,
                        width: 80,
                        sort: 1,
                        aliace: function (v, cnt, rowData) {
                            return eval(configLabelWeightReturn);
                        }
                    },
                    inBoxes: {
                        caption: 'Кол-во в упаковке / средний вес ',
                        width: 100,
                        aliace: function (v, cnt, rowData) {
                            return (parseFloat(v) || '');
                        }
                    },
                    amountWeight: {
                        caption: 'Кол-во (штук) / общий вес',
                        width: 100,
                        aliace: function (v, cnt, rowData) {
                            return (parseFloat(v) || '');
                        }
                    },
                    boxesRols: {
                        caption: 'Кол-во упаковок / кол-во роликов',
                        width: 100,
                        aliace: function (v, cnt, rowData) {
                            return (parseFloat(v) || '');
                        }
                    },
                    description: {
                        caption: 'Примечание',
                        width: 200,
                        aliace: function (v, cnt, rowData) {
                            return (v || '');
                        }
                    }
                };
                this.grid.create();
                this.grid.data = [data];
                this.grid.update();
                var cntinfo = this.crnode();
                cntinfo.appendChild(itemWindow.crtxtnode('Информация по приходам '));
                cntinfo.style.paddingTop = '10px';
                cntinfo.style.textAlign = 'left';
                var all = this.crnode('label');
                $(all).css({
                    'float': 'right',
                    'margin-right': '20px'
                });
                cntinfo.appendChild(all);
                area.appendChild(cntinfo);
                var cntinfo = this.crnode();
                cntinfo.id = this.blockId + '_info';
                cntinfo.style.minHeight = '30px';
                cntinfo.style.paddingTop = '10px';
                cntinfo.align = 'left';
                area.appendChild(cntinfo);
                this.grid2 = new Grid({
                    conteinerId: this.blockId + '_info',
                    imgError: '/img/system/error.16.png',
                    imgLoader: '/img/ld/ld3.gif',
                    perpage: 9999
                });
                this.grid2.head = {
                    task: {
                        caption: 'Заявка',
                        width: 100,
                        aliace: function (v, cnt, rowData) {
                            rowData.bindedSectionTr = $(cnt).parents('tr:first');
                            if (rowData.defect == 1) {
                                $(cnt).closest('tr').css('backgroundColor', '#dfd3c9');
                                var title = 'Брак';
                                if (rowData.defect_reason) {
                                    title += '. Причина брака: ' + rowData.defect_reason;
                                }
                                $(cnt).closest('tr').attr('title', title);
                            }
                            let update = '<input type="hidden" class="isupdate" name="data[tasks][' + v + '][update][]" value="1"/>';
                            let defect = '<input type="hidden" class="defect" name="data[tasks][' + v + '][defect][]" value="' + rowData.defect + '"/>';
                            let history = '<input type="hidden" name="data[tasks][' + v + '][history][]" value="' + rowData.history_id + '"/>';
                            let oldAmount = '<input type="hidden" name="data[tasks][' + v + '][oldAmount][]" value="' + rowData.amount + '"/>';
                            return `
                            <a target="_blank" rel="opener" href="` + rowData.url + `">` + v + `</a>
                            <input type="hidden" name="data[tasks][` + v + `][oldPlace][]" value="` + rowData.placing + `" />
                            <input type="hidden" name="data[tasks][` + v + `][initial_transfer_detailed_id][]" value="` + rowData.initial_transfer_detailed_id + `" />
                        ` + update + defect + history + oldAmount;
                        }
                    },
                    date: {
                        caption: 'Дата',
                        width: 75
                    },
                    price: {
                        caption: 'Цена',
                        width: 75,
                        aliace: function (v, cnt, rowData) {
                            return (itemWindow.toFloat(v) || '');
                        }
                    },
                    average: {
                        caption: 'Средний вес',
                        width: 100,
                        aliace: function (v, cnt, rowData) {
                            return (itemWindow.toFloat(v) || itemWindow.overlay.grid.data[0].inBoxes);
                        }
                    },
                    placing: {
                        caption: 'Секция',
                        width: 140,
                        aliace: function (v, cnt, rowData, rowIndex) {
                            var claimid = '<input type="hidden" name="data[tasks][' + rowData.task + '][claimid][]" value="' + rowData.claimid + '" />';
                            return claimid + '<input name="data[tasks][' + rowData.task + '][placing][]" data-old-section="' + v + '" class="section_all section_' + rowData.task + '" style="text-align:left; box-sizing: border-box; width:100%;"' + ' type="text" value="' + v + '"  >';
                        }
                    },
                    curBlockAmount: {
                        caption: 'Кол-во/<br>общий вес',
                        width: 120,
                        aliace: function (v, cnt, rowData, rowIndex) {
                            var addStyle = (rowData.type != 2 ? 'background-color:#eee; color:#777;' : '');
                            var readonly = (rowData.type != 2 ? 'readonly' : '');
                            var blockedItem = ((Number(rowData.blocked) || 0) > 0) ? 'readonly' : '';
                            if ((Number(rowData.curBlockBoxes) || 0) > 0) {
                                var blocked = '';
                            }
                            else {
                                var blocked = 'readonly';
                                v = 0;
                            }
                            readonly = (readonly.length == 0) ? blocked : '';
                            readonly = (readonly.length == 0) ? blockedItem : readonly;
                            const hidden = rootScope.isOnlySectionsMode(rowData) ? 'hidden' : 'text';
                            return ((hidden == 'hidden') ? (itemWindow.toFloat(v) ? itemWindow.toFloat(v) : '') : '') + '<input name="data[tasks][' + rowData.task + '][amount][]" itype="amount" oninput="itemWindow.overlay.updateCelldata(this, \'curBlockAmount\')"  style="text-align:left; box-sizing: border-box; width: 100%; ' + addStyle + '" type="' + hidden + '" value="' + (itemWindow.toFloat(v) ? itemWindow.toFloat(v) : '') + '" ' + 'class="amount_all amount_' + rowData.task + '" ' + readonly + ' >';
                        }
                    },
                    curBlockBoxes: {
                        caption: 'Кол-во упаковок/<br>кол-во роликов',
                        width: 120,
                        aliace: function (v, cnt, rowData, rowIndex) {
                            var addStyle = (rowData.type == 2 ? 'background-color:#eee; color:#777;' : '');
                            var readonly = '';
                            var blockedItem = ((Number(rowData.blocked) || 0) > 0) ? 'readonly' : '';
                            var blocked = ((Number(rowData.curBlockBoxes) || 0) > 0) ? '' : 'readonly';
                            readonly = (readonly.length == 0) ? blocked : readonly;
                            readonly = (readonly.length == 0) ? blockedItem : readonly;
                            var hidden = rootScope.isOnlySectionsMode(rowData) ? 'hidden' : 'text';
                            return ((hidden == 'hidden') ? (itemWindow.toFloat(v) ? itemWindow.toFloat(v) : '') : '') + '<input name="data[tasks][' + rowData.task + '][box][]" itype="boxes" oninput="itemWindow.overlay.updateCelldata(this, \'curBlockBoxes\')" style="text-align:left; box-sizing: border-box; width:100%; ' + addStyle + '" type="' + hidden + '" value="' + (itemWindow.toFloat(v) ? itemWindow.toFloat(v) : '') + '" ' + 'class="box_all box_' + rowData.task + '" ' + ' data-task="' + rowData.task + '" ' + readonly + ' >';
                        }
                    },
                    blocked: {
                        caption: ' ',
                        width: 50,
                        aliace: function (v, cnt, rowData) {
                            var _a, _b, _c;
                            if (parseInt(v) > 0) {
                                const claims = (((_c = (_b = (_a = rowData === null || rowData === void 0 ? void 0 : rowData.sectionDdmInitialInfo) === null || _a === void 0 ? void 0 : _a.ddData) === null || _b === void 0 ? void 0 : _b.blocksData) === null || _c === void 0 ? void 0 : _c.blockedByClaims) || []);
                                const btn = $('<input class="attention" title="Заблокировано ' + Number(v) + ', ' + claims.map(c => c.full_id).join(', ') + '" type="button" style="cursor:pointer; width:40px; border:none; background:transparent url(/img/system/error.16.png) no-repeat center center">');
                                btn.click((e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    let html = '';
                                    for (let claim of claims) {
                                        if (parseInt(claim.claim_status)) {
                                            html += `<a href="${claim.url}" target="_blank" rel="opener">${claim.full_id}</a> `;
                                        }
                                    }
                                    (new AjaxForm(`
                                        <section>
                                            <form action="">
                                                <section style="padding: 10px;">${html}</section>
                                                <footer>
                                                    <input type="button" data-form-button="hide" value="Закрыть" class="amd-button amd-button_primary">
                                                </footer>
                                            </form>
                                        </section>`, {
                                        width: 300,
                                        style: 'strict',
                                        hideOnEscape: true,
                                        destroyOnHide: true
                                    })).show();
                                });
                                return btn;
                            }
                            else {
                                return '';
                            }
                        }
                    },
                    addItem: {
                        caption: ' ',
                        width: 50,
                        aliace: function (v, cnt, rowData) {
                            var blockedItem = Number(rowData.blocked) > 0;
                            var nullBoxes = Number(rowData.curBlockBoxes) == 0;
                            if (blockedItem || nullBoxes) {
                                return '';
                            }
                            if (rootScope.isOnlySectionsMode(rowData)) {
                                return '';
                            }
                            return '<input class="addItem" type="button" style="cursor:pointer; width:40px; border:none; background:transparent url(/img/system/add.png) no-repeat center center">';
                        }
                    },
                    depotDetailedManager: {
                        caption: 'Блокировки под менеджеров',
                        width: 150,
                        aliace: function (v, cnt, rowData) {
                            $(cnt).parents('tr:first').append($('<input type="hidden" data-rowdata-field-name="sectionDdmInitialInfo">')
                                .val(JSON.stringify(rowData.sectionDdmInitialInfo)));
                            if (rowData.sectionDdmInitialInfo.managersRowsCount > 0) {
                                return $('<img src="/img/system/clientinfo.png" style="cursor: pointer" title="По данной секции имеются блокировки под менеджеров"/>').click(function () {
                                    showDepotDetailedManagerTransferForm(rowData, $(cnt).parents('tr:first'));
                                });
                            }
                            return '';
                        }
                    }
                };
                var depotDetailedManagerTransferForms = {};
                var transferItemForm = this;
                function showDepotDetailedManagerTransferForm(sectionRowData, sectionTr) {
                    if (!depotDetailedManagerTransferForms[sectionRowData.claimid]) {
                        depotDetailedManagerTransferForms[sectionRowData.claimid] = new Depot_Section_DepotDetailedManager_Transfer_Form({
                            transferItemForm: transferItemForm,
                            sectionRowData: sectionRowData,
                            bindedSectionTr: sectionTr
                        });
                        sectionRowData.sectionDdmInitialInfo = null;
                    }
                    depotDetailedManagerTransferForms[sectionRowData.claimid].actualizeState().show();
                }
                if (typeof itemWindow.perm.price === "undefined" || itemWindow.perm.price != 1) {
                    delete this.grid2.head.price;
                }
                this.grid2.create();
                this.grid2.data = data.addinfo;
                this.grid2.onAfterUpdate = function () {
                    itemWindow.overlay.controlButtonsGrid2();
                };
                this.grid2.update();
                this.grid2.onClick = function (dataRowIndex, dataColIndex, node) {
                    if (node.nodeName.toLowerCase() != 'input') {
                        return;
                    }
                    if (dataColIndex == 'clear') {
                        itemWindow.overlay.grid2.data[dataRowIndex].curBlockAmount = 0;
                        itemWindow.overlay.grid2.data[dataRowIndex].curBlockBoxes = 0;
                        itemWindow.overlay.grid2.update();
                    }
                    if (dataColIndex == 'save') {
                        itemWindow._displayEditproductEnd({
                            claimId: itemWindow.overlay.tmpdata.claimId,
                            data: [this.data[dataRowIndex]],
                            itemId: itemWindow.overlay.tmpdata.id,
                            pnumber: itemWindow.getProductNumber(itemWindow.overlay.tmpdata.id),
                            afterClose: 0
                        }, 1);
                    }
                };
                var cntinfo = this.crnode();
                cntinfo.style.paddingTop = '10px';
                cntinfo.style.textAlign = 'right';
                var all = this.crnode('label');
                $(all).css({
                    'float': 'left'
                });
                var ch = this.crnode('input');
                ch.type = 'checkbox';
                ch.id = this.blockId + '_close_after_save';
                ch.style.verticalAlign = 'middle';
                ch.checked = true;
                all.appendChild(ch);
                all.appendChild(itemWindow.crtxtnode(' закрыть после сохранения '));
                var btok = this.crnode('input');
                btok.type = 'button';
                btok.disabled = true;
                btok.id = this.blockId + '_bt_ok';
                btok.value = 'Принять';
                btok.style.width = '125px';
                btok.onclick = function () {
                    btok.disabled = true;
                    if (parseInt(itemWindow.overlay.tmpdata.type) == 1) {
                        var isFloat = false;
                        $('.filter-grid-body input.box_all, .filter-grid-body input.amount_all').each(function () {
                            $(this).val($(this).val() * 1);
                            if ($(this).val().indexOf('.') != -1) {
                                isFloat = true;
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
                    var collectedData = $('.section-transfer-item-wnd .filter-grid-body input').serialize();
                    $(transferItemForm.grid2.node()).find('tr.ddm-errored').each(function (i, target) {
                        $(target).removeClass('ddm-errored');
                        $(target).find('td[lang="depotDetailedManager"]').attr('title', null);
                    });
                    function addSectionTrError(sectionTr, message) {
                        sectionTr.addClass('ddm-errored');
                        if (message) {
                            sectionTr.find('td[lang="depotDetailedManager"]').attr('title', message);
                        }
                    }
                    var sectionDdmInitialInfoValidateResult = true;
                    data.addinfo.forEach(function (sectionRowData) {
                        if (sectionRowData.sectionDdmInitialInfo && sectionRowData.sectionDdmInitialInfo.managersRowsCount > 0) {
                            var sectionAmountInput = sectionRowData.bindedSectionTr.find('input[itype="amount"]');
                            var sectionBoxesInput = sectionRowData.bindedSectionTr.find('input[itype="boxes"]');
                            if ((Math.abs(parseFloat(sectionRowData.sectionDdmInitialInfo.ddData.amount || 0) - parseFloat(sectionAmountInput.val() || 0)) > 0) ||
                                (Math.abs(parseFloat(sectionRowData.sectionDdmInitialInfo.ddData.boxes || 0) - parseFloat(sectionBoxesInput.val() || 0)) > 0)) {
                                addSectionTrError(sectionRowData.bindedSectionTr, 'Суммарное количество по блокировкам под менеджеров должно быть равно общему количеству по секции');
                                sectionDdmInitialInfoValidateResult = false;
                            }
                        }
                    });
                    var ddmTransferFormsData = {};
                    var ddmTransferFormsValidateResult = true;
                    for (var ddId in depotDetailedManagerTransferForms) {
                        var depotDetailedManagerTransferForm = depotDetailedManagerTransferForms[ddId];
                        depotDetailedManagerTransferForm.actualizeState();
                        if (depotDetailedManagerTransferForm.validate(false)) {
                            if (depotDetailedManagerTransferForm.isFormChanged()) {
                                ddmTransferFormsData[ddId] = depotDetailedManagerTransferForm.getSendData();
                            }
                        }
                        else {
                            addSectionTrError(depotDetailedManagerTransferForm.bindedSectionTr, depotDetailedManagerTransferForm.validation.getErrorInfo('При проверке формы БЛОКИРОВКИ СЕКЦИИ ПОД МЕНЕДЖЕРОВ обнаружены ошибки:'));
                            ddmTransferFormsValidateResult = false;
                        }
                    }
                    if (!(sectionDdmInitialInfoValidateResult === true &&
                        ddmTransferFormsValidateResult === true)) {
                        return false;
                    }
                    $.ajax({
                        url: '/depot/section/transfer',
                        cache: false,
                        data: {
                            collectedData: collectedData,
                            ddmTransferFormsData: ddmTransferFormsData
                        },
                        type: 'POST',
                        success: function (data) {
                            var received = (typeof (data) === "object") ? data : $.parseJSON(data);
                            if (received.error) {
                                if (received.reason === 'reload') {
                                    for (var ddId in received.data) {
                                        if (ddId in depotDetailedManagerTransferForms) {
                                            var depotDetailedManagerTransferForm = depotDetailedManagerTransferForms[ddId];
                                            depotDetailedManagerTransferForm.reloadState($.extend(received.data[ddId], {
                                                initialFormDataIsChanged: true
                                            }), function () {
                                                depotDetailedManagerTransferForm.update('reload');
                                                depotDetailedManagerTransferForm.saveCurrentState();
                                            });
                                            addSectionTrError(depotDetailedManagerTransferForm.bindedSectionTr, 'На сервере произошли изменения. Ознакомьтесь с изменениями, сделайте необходимые правки и повторите отправку формы');
                                        }
                                    }
                                }
                                else if (received.reason === 'reloadGrid') {
                                    alert(received.errortext);
                                    close();
                                }
                                else {
                                    alert(received.errortext);
                                    btok.disabled = false;
                                }
                            }
                            else {
                                success();
                            }
                        },
                        error: function (obj) {
                            alert('Во время выполнения операции произошла ошибка');
                        }
                    });
                    return 1;
                };
                cntinfo.appendChild(btok);
                $(btok).attr('data-action', 'apply');
                var btcn = this.crnode('input');
                btcn.type = 'button';
                btcn.value = 'Отмена';
                btcn.style.width = '125px';
                btcn.onclick = function () {
                    close();
                };
                cntinfo.appendChild(btcn);
                area.appendChild(cntinfo);
                this.cntToCenter();
            };
            this.overlay.onBeforeClose = function () {
                this.grid.close();
                this.grid2.close();
            };
            this.overlay.onAfterClose = function () {
                delete (itemWindow.overlay);
            };
            this.overlay.restore = function () {
                var obj = this.getCnt();
                $(obj).css({
                    'background-image': '',
                    'background-position': 'center center',
                    'background-repeat': 'no-repeat'
                });
                this.onBeforeClose();
                $(obj).empty();
                this.onAfterCreate();
            };
            this.overlay.updateCelldata = function (obj, type) {
                var one = itemWindow.toFloat(this.grid.data[0].inBoxes);
                var tr = $(obj).parents('tr');
                if (type == 'curBlockBoxes') {
                    $(tr).find('.amount_all').val(itemWindow.toFloat(one * parseInt($(obj).val())));
                }
                else {
                    if (this.tmpdata.type != 2) {
                        $(tr).find('.box_all').val(Math.ceil(Math.abs($(obj).val() / one)));
                    }
                }
            };
            this.overlay.controlButtonsGrid2 = function () {
                var maxBlock = itemWindow.toFloat((this.tmpdata.type == 2 ? this.tmpdata.boxes : this.tmpdata.amountWeight));
                var lastTotalBlock = 0, curTotalBlock = 0;
                var saveAll = false;
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
                    var index = i;
                    var saveInp = this.getInputTypeRow(rows[i], 'save');
                    var clearInp = this.getInputTypeRow(rows[i], 'clear');
                    if (saveInp) {
                        saveInp.disabled = true;
                        saveInp.style.background = 'transparent url(/img/system/reserve.16.png) no-repeat center center';
                    }
                    if (clearInp) {
                        clearInp.disabled = !itemWindow.toFloat(this.grid2.data[index].curBlockAmount);
                    }
                    if ((Math.abs(this.grid2.data[index].curBlockAmount - this.grid2.data[index].lastBlockAmount) > itemWindow.precision || Math.abs(this.grid2.data[index].curBlockBoxes - this.grid2.data[index].lastBlockBoxes) > itemWindow.precision)) {
                        if (saveInp && itemWindow.perm.products.sectionedit > 2 && this.grid2.head.info) {
                            saveInp.disabled = (!saveAll || curTotalBlock < itemWindow.precision);
                            saveInp.style.background = 'transparent url(/img/system/save.16.png) no-repeat center center';
                        }
                    }
                }
                if (itemWindow.node(this.blockId + '_bt_ok')) {
                    itemWindow.node(this.blockId + '_bt_ok').disabled = (!saveAll || curTotalBlock < itemWindow.precision);
                }
            };
            this.overlay.getInputTypeRow = function (row, type) {
                var inp = row.getElementsByTagName('input');
                for (var i = 0; i < inp.length; i++) {
                    if (inp.item(i).getAttribute('itype') == type) {
                        return inp.item(i);
                    }
                }
                return false;
            };
            this.overlay.getAll = function (obj) {
                obj.previousSibling.data = (obj.checked ? 'отменить все : ' : 'забрать все : ');
                for (var i = 0; i < this.grid2.data.length; i++) {
                    this.grid2.data[i].curBlockAmount = (obj.checked ? (this.grid2.data[i].type == 2 ? (this.grid2.data[i].otherblock - this.grid2.data[i].confirmBoxes > 0 ? (this.grid2.data[i].maxAmount - this.grid2.data[i].confirmAmount - 1) : (this.grid2.data[i].maxAmount - this.grid2.data[i].confirmAmount)) : this.grid2.data[i].amount) : 0);
                    this.grid2.data[i].curBlockBoxes = (obj.checked ? this.grid2.data[i].boxes : 0);
                }
                this.grid2.update();
            };
            this.overlay.updateData = function (data) {
                this.tmpdata = data;
                this.tmpdata.claimId = itemWindow.node(itemWindow.formId)['claim[id]'].value;
                this.grid.data = [data];
                this.grid.update();
                for (var i = 0; i < this.grid2.data.length; i++) {
                    for (var j = 0; j < data.addinfo.length; j++) {
                        if (data.addinfo[j].detailed_id == this.grid2.data[i].detailed_id) {
                            data.addinfo[j].curBlockAmount = this.grid2.data[i].curBlockAmount > data.addinfo[j].amount ? data.addinfo[j].amount : this.grid2.data[i].curBlockAmount;
                            data.addinfo[j].curBlockBoxes = this.grid2.data[i].curBlockBoxes > data.addinfo[j].boxes ? data.addinfo[j].boxes : this.grid2.data[i].curBlockBoxes;
                            break;
                        }
                    }
                }
                this.grid2.data = data.addinfo;
                this.grid2.update();
            };
            this.overlay.checkChangeTotal = function () {
                var ctrlValue = this.tmpdata.curblock;
                var ctrlValue2 = 0;
                for (var i = 0; i < this.grid2.data.length; i++) {
                    ctrlValue2 += itemWindow.toFloat((this.tmpdata.type == 1 ? this.grid2.data[i].curBlockAmount : this.grid2.data[i].curBlockBoxes));
                }
                return Math.abs(itemWindow.round(ctrlValue) - itemWindow.round(ctrlValue2)) > itemWindow.precision;
            };
            this.overlay.create = function () {
                var _self = this;
                var block = this.crnode();
                block.id = this.blockId + '_block';
                $(block).css({
                    'position': 'fixed',
                    'left': '0px',
                    'top': '0px',
                    'width': '100%',
                    'height': '100%',
                    'background-color': this.backgroundColor,
                    'text-align': 'center',
                    'z-index': '1000',
                });
                document.body.appendChild(block);
                this.onAfterCreate();
                return this;
            };
            this.overlay.create();
        };
        this.isOnlySectionsMode = function (rowData) {
            return ([20, 22].includes(parseInt(rowData.claim_type_id)) ||
                parseInt(rowData.product_type) === 4);
        };
        this.node = function (id) {
            return typeof id == 'string' ? document.getElementById(id) : id;
        };
        this.crtxtnode = function (text) {
            return document.createTextNode(text);
        };
        this.crnode = function (el) {
            return document.createElement((el || 'div'));
        };
        this.toFloat = function (str) {
            str = parseFloat(str);
            if (isNaN(str)) {
                return 0;
            }
            return this.round(str);
        };
        this.round = function (number) {
            return Math.round(parseFloat(number) * 100000) / 100000;
        };
        this.empty = function (obj) {
            obj = this.node(obj);
            while (obj.firstChild) {
                obj.removeChild(obj.firstChild);
            }
        };
        this.uncompresData = function (str) {
            return eval('(' + str + ')');
        };
    });
    function success() {
        itemWindow.overlay.close();
        promiseFunctions.resolve(true);
    }
    function close() {
        itemWindow.overlay.close();
        promiseFunctions.resolve(false);
    }
    $(document).ready(function () {
        $('body').on('click', '.addItem', function () {
            var line = $(this).parents('tr');
            var cloneline = $(line).clone();
            $(cloneline).find('input[type="text"]').val('');
            $(cloneline).find('input.attention').remove();
            $(cloneline).find('.addItem').css({
                'background': 'url(/img/system/del.png) center center no-repeat'
            })
                .addClass('delItem')
                .removeClass('addItem');
            $(cloneline).find('input.isupdate').val('0');
            $(cloneline).find('td[lang="depotDetailedManager"] img').remove();
            $(cloneline).insertAfter(line);
        });
        $('body').on('click', '.delItem', function () {
            $(this).parents('tr').remove();
        });
        $('body').on('keydown', '.amount_all', function (event) {
            if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110, 190, 188]) !== -1 ||
                (event.keyCode == 65 && event.ctrlKey === true) ||
                (event.keyCode >= 35 && event.keyCode <= 39)) {
                if (event.keyCode == 188 || event.keyCode == 190 || event.keyCode == 110) {
                    event.preventDefault();
                    var rawval = $(this).val().toString();
                    $(this).val(rawval + '.');
                }
                return;
            }
            else {
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            }
        });
        $('body').on('keydown', '.box_all', function (event) {
            if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 190, 110, 188]) !== -1 ||
                (event.keyCode == 65 && event.ctrlKey === true) ||
                (event.keyCode >= 35 && event.keyCode <= 39)) {
                if (event.keyCode == 188 || event.keyCode == 190 || event.keyCode == 110) {
                    event.preventDefault();
                    var rawval = $(this).val().toString();
                    $(this).val(rawval + '.');
                }
                return;
            }
            else {
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            }
        });
        $('body').on('keyup', '.section-transfer-item-wnd .filter-grid-body input', function (e) {
            var className = $(this).attr('class').split(/\s+/).pop();
            if (className.indexOf('box_') >= 0 || className.indexOf('amount_') >= 0) {
                let hasZero = false;
                var summ = 0;
                $('.' + className).each(function () {
                    const v = Number($(this).val());
                    summ += v;
                    if (v <= 0) {
                        hasZero = true;
                    }
                });
                var tasksumm = 0;
                $('.old_' + className).each(function () {
                    tasksumm += Number($(this).data('old'));
                });
                if (summ > tasksumm || hasZero) {
                    isError('.' + className);
                    return false;
                }
                else {
                    isOk('.' + className);
                }
            }
            else if (className.indexOf('section_') >= 0) {
                var compareResult = compareValues('.' + className);
                if (!compareResult) {
                    isError('.' + className);
                }
                else {
                    isOk('.' + className);
                }
            }
        });
    });
    function compareValues(classname) {
        if ($(classname).length > 0) {
            var result = true;
            var allVal = [];
            $(classname).each(function () {
                var currentEl = $(this);
                var val = $(this).val();
                var allow = false;
                var curElDefectVal = currentEl.closest('tr').find('input.defect').val();
                var curElUpdateVal = currentEl.closest('tr').find('input.isupdate').val();
                if (curElDefectVal == 1 && curElUpdateVal == 1) {
                    allow = true;
                }
                if (typeof allVal[val] === "undefined" || allow === true) {
                    allVal[val] = 1;
                }
                else {
                    result = false;
                    return;
                }
            });
            return result;
        }
        return true;
    }
    var errorContent = {
        'section': true,
        'amount': true,
        'box': true
    };
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
});
