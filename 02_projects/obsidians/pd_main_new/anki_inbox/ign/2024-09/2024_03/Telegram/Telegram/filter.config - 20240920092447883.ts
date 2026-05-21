import {TDatatableTemplateConfig} from "../../../../angular/component/amd-grid/generator/types";
import {DepotFieldsCollection} from "../../../depot/components/grid/depot-fields.collection";

const depotFieldsCollection = new DepotFieldsCollection();

depotFieldsCollection.getField('title').getConfig().template =
    `<amd-product-measure-type-hint data-type-id="row.type">
        {{row.title|depotValue:'title'}}
    </amd-product-measure-type-hint>`

const collection = [
    {
        name: 'item_id',
        caption: "id",
        sort: true,
        template: `<span title="{{row.baseprice ? row.item_price : ''}}"> {{row.item_id}} </span>`,
        width: "120px"
    },
    {name: 'depot_title', caption: "Склад", sort: true, width: "100px"},
    depotFieldsCollection.getField('title').getConfig(),
    depotFieldsCollection.getField('prop').getConfig(),
    depotFieldsCollection.getField('color').getConfig(),
    depotFieldsCollection.getField('boxType').getConfig(),
    depotFieldsCollection.getField('volum').getConfig(),
    depotFieldsCollection.getField('height').getConfig(),
    depotFieldsCollection.getField('width').getConfig(),
    depotFieldsCollection.getField('depth').getConfig(),
    {
        caption: "Площадка №",
        name   : "manufacturer_id",
        sort   : true,
        width  : "120px",
    },
    {
        caption: "БЦ",
        name   : 'baseprice',
        sort   : true,
        width  : "100px",
        template: `<span title="{{row.baseprice ? row.item_price : ''}}"> {{row.baseprice}} </span>`
    },
    {
        name    : "claim_id",
        caption : "Заявка",
        sort    : true,
        template: `<a target="_blank" clsss="white-space_nowrap" ng-href="{{row.claim_url}}">{{row.claim}}</a>`,
        width  : "120px"
    },
    {
        name   : "blocked_manager_name",
        caption: "Менеджер",
        sort   : true,
        width  : "150px"
    },
    {
        name   : "depot",
        caption: "Отдел",
        sort   : true,
        body: {
            attributes: {"class": 'white-space_nowrap'},
        },
        width  : "150px"
    },
    {
        name   : "client",
        caption: "Контрагент поставщик",
        sort   : true,
        width  : "250px"
    },
    {
        name   : "client_buyer",
        caption: "Контрагент покупатель",
        sort   : true,
        width  : "250px"
    },
    {
        name    : "date_in",
        caption : "Дата подачи",
        sort    : true,
        body: {
            attributes: {"class": 'white-space_nowrap'},
        },
        template: `{{(row.date_in ? row.date_in * 1000 : '-') | date }}`

    },
    {
        name   : "placing",
        caption: "Секция",
        sort   : true,
        template: `{{(row.placing ? row.placing  : '-')}}`,
        width  : "100px",
    },
    {
        name   : "amount",
        caption: "Кол-во (штук) / общий вес",
        sort   : true,
        template: `<div style="min-width: 150px">{{row.amount | number}}</div>`
    },
    {
        sort   : true,
        name   : 'boxes',
        caption: "Кол-во роликов / упаковок",
        body: {
            attributes: {"class": 'white-space_nowrap'},
        },
        template: `<div style="min-width: 150px">{{row.boxes | number}}</div>`
    },
    {
        sort   : true,
        name   : 'max_out_date',
        body: {
            attributes: {"class": 'white-space_nowrap'},
        },
        caption: "Дата последней отгрузки",
        template: `{{(row.max_out_date ? row.max_out_date * 1000 : '-') | date }}`,
        width  : "100px",
    },
    {
        sort    : true,
        name    : 'annotation_value',
        caption : "Примечание",
        width  : "100px",
        template: `
                <div>
                    <amd-button title="Редактировать примечание" 
                        data-color="{{$ctrl.buttonColor}}" 
                        ng-disabled="$ctrl.buttonDisabled" 
                        ng-click="$ctrl.setAnnotation(row)"
                    >
                        <amd-icon>edit</amd-icon>
                    </amd-button>
                </div>
                <div>
                    <amd-icon ng-if="!row.annotation_value">info</amd-icon>
<!--                    {{row.annotation_value || 'Нет примечания'}}-->
                </div>
        `,
    }
]

export const FILTER_CONFIG: TDatatableTemplateConfig = {
    striped       : true,
    hider         : true,
    fillEmptySpace: false,
    attributes    : {
        class: "amd-datatable__table_padding_4",
    },
    fields        : collection,
    body: {
        row: {
            attributes: {"class" : "{{row.rowColor}}"	},
        },
    },
};