import {TUrlMap} from "../../../../angular/component/amd-grid/data-source/http.data-source";
import {TDepotListItem} from "../../../../angular/component/amd-sub-filter/depot-list-select.component";


export namespace PhotoGallery_Index
{
    type TRow = {
        id: number,
        title: string,
        prop: string,
        color: string,
        boxType: string,
        volum: string,
        height: string,
        width: string,
        depth: string,
        labelWeight: string,
        description: string,
        isArchive: string,
        type: string,
        out_sale_price: number
    };
    export type TConfig = {
        id: number;
        dataTable: {
            urls: TUrlMap,
            fieldAccessPath: string,
        },
        access: Assoc<any>,
        depotParams: {
            selected: number,
            list: TDepotListItem[],
        },
    };
}

