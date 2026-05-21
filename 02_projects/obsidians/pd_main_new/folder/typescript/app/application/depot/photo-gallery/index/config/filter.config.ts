import {TDatatableTemplateConfig} from "../../../../../angular/component/amd-grid/generator/types";
import DepotConfigService from "../../../../../core/service/depot-config.service";

const depotConfig = new DepotConfigService();

export var filterConfig: TDatatableTemplateConfig = {
    striped: true,
    attributes: {},
    fields: [
        {
            name: 'id',
            sort: true,
            caption: `Склад`,
            template: `
<!--filename-->
                <img title="ID товара: 2777" class="getSlider detailed-photo-placeholder" src="{{row.filename}}" data-itemid="2777" data-claimid="204463" data-id="1" width="106" height="150">

            `
        },
    //     <div>
    //         <img
    //             ng-if="row.block>0"
    // ng-click="$ctrl.getBlockInfoForm(row)"
    // src="/img/system/blockinfo.png"
    // class="blockInfo"
    // width="16"
    // height="16" border="0"
    // />
    // </div>
    //
    // <span ng-bind-html="$ctrl.loadPhotoData(row) | trustAsHtml">
    //     </span>
        {
            name: 'id',
            sort: true,
            caption: `Наше производство/ покупное`
        },
        {
            name: 'filename',
            sort: true,
            caption: `Наименование`
        },
        {
            name: 'id',
            sort: true,
            caption: `Назначение`
        },
        {
            name: 'id',
            sort: true,
            caption: `Размер`
        },
        {
            name: 'id',
            sort: true,
            caption: `Диаметр`
        },
        {
            name: 'id',
            sort: true,
            caption: `Модель`
        },
        {
            name: 'id',
            sort: true,
            caption: `Обозначение`
        },
        {
            name: 'id',
            sort: true,
            caption: `Текущая бц`
        },
        {
            name: 'id',
            sort: true,
            caption: `Примечание`
        },
    ],
};
