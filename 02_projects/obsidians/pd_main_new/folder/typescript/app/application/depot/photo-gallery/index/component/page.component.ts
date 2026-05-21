import {IComponentController} from "angular";
import {Component, Inject} from "../../../../../angular/decorator/component.decorator";
import AmdGridComponent from "../../../../../angular/component/amd-grid/amd-grid.component";
import 'grid';
import '/js/filter/product-type-decorator.js'
import HttpDataSource from "../../../../../angular/component/amd-grid/data-source/http.data-source";
import {
    DatatableTemplateGenerator
} from "../../../../../angular/component/amd-grid/generator/datatable-template.generator";
import {filterConfig} from "../config/filter.config";
import ArrayDataSource from "../../../../../core/model/data-source/array.data-source";
import AmdSelectFilter from "../../../../../angular/component/amd-select/amd-select.filter";
import AjaxFormBackendService from "../../../../../angular/service/ajax-form-backend.service";
import {ToastService} from "../../../../../core/service/toast.service";

// import {BackendService} from "../../../../analytics/potential-clients/index/service/backend.service";

const TEMPLATE = `
    <amd-grid 
        data-bind-view-child="$ctrl.setGrid(grid)"
        data-data-source="$ctrl.gridDataSource"
        data-extra-data="$ctrl.filterExtraData"
        data-on-grid-update="$ctrl.onGridUpdate(data)" 
        ng-click="$ctrl.onSelect(data)"

    >          
            <div class="p-filter-controls">
            <div class="p-filter-controls__left">
                <amd-select
                    data-source="$ctrl.amountWeightParams"
                    ng-model="$ctrl.filterExtraData.amountWeightParams"
                    data-controls="{searchString: false}"
                ></amd-select>
                <amd-search-with-button
                    ng-disabled="$ctrl.filterExtraData.amountWeightParams == null"
                    ng-style=""
                    ng-model="$ctrl.filterExtraData.amountWeight"
                    data-on-apply="$ctrl.updateGrid()"
                    data-placeholder="'Поиск по Кол-ву'"
                ></amd-search-with-button>
                <amd-search-with-button
                    ng-model="$ctrl.filterExtraData.searchId"
                    data-on-apply="$ctrl.updateGrid()"
                ></amd-search-with-button>
            </div>
            <div class="p-filter-controls__right">
                <div>
                    <label class="amd-straight-checkbox">
                        <span>Только акции</span>
                        <span>
                            <input 
                                id="showSale" 
                                type="checkbox" 
                                name="showsale" 
                                ng-model="$ctrl.filterExtraData.showSale" 
                                ng-change="$ctrl.updateGrid()"
                            />
                        </span>
                    </label>
                </div>
                <div>
                    <label class="amd-straight-checkbox">
                        <span>В наличии</span>
                        <span>
                            <input 
                                type="checkbox" 
                                name="notempty" 
                                ng-model="$ctrl.filterExtraData.notEmpty" 
                                ng-change="$ctrl.updateGrid()"
                            />
                        </span>
                    </label>
                </div>
                <div>
                    <label 
                        class="amd-straight-checkbox"
                        title="Отображать только заблокированный товар" 
                    >
                        Заблокированные
                        <input 
                            type="checkbox" 
                            ng-model="$ctrl.filterExtraData.onlyBlocked" 
                            ng-change="$ctrl.updateGrid()"
                        />
                        
                        <span class="custom-checkbox-icon"></span>
                    </label>
                </div>
            </div>
            
        </div>  
            ${(new DatatableTemplateGenerator()).generate(filterConfig )}
        <grid-footer>
             <amd-button
                ng-click="$ctrl._grid.downloadExcel($event)"
            >
                Выгрузить в Excel
            </amd-button>
        </grid-footer>
    </amd-grid>
`;

@Component({
    selector: 'page',
    template: TEMPLATE,
})
export class PageComponent implements IComponentController
{
    public filterExtraData = {
        onlyBlocked        : 0,
        notEmpty           : 0,
        searchId           : null,
        amountWeight       : null,
        amountWeightParams : null,
        showSale           : 0,
    };
    /**
     * Источник данных для грида
     */
    public gridDataSource: HttpDataSource<any>;


    protected amountWeightParams
    /**
     * Грид
     */
    private _grid: AmdGridComponent<any>;

    /**
     * @constructor
     */
    public constructor(
        @Inject('ConfigService') private config: any,
        @Inject('AjaxFormBackendService') public ajaxService: AjaxFormBackendService,
    ) {
        this.gridDataSource = new HttpDataSource<any>({
            result: '/depot/photo-gallery/get-filter-result',
            config: '/depot/photo-gallery/get-filter-config',
            excel: '/depot/photo-gallery/get-filter-excel',
            mask: '/depot/photo-gallery/get-filter-mask',
        });

        this.amountWeightParams = new ArrayDataSource(new AmdSelectFilter(), this.config.amountWeightParams);

    }

    /**
     * Обновить грида
     * @returns {void}
     */
    public updateGrid()
    {
        this._grid.updateGrid();
    }

    /**
     * Обновить грид и фильтр
     * @returns {void}
     */
    public updateFilter()
    {
        this._grid.update().then(r => 'success');
    }


    public $onInit()
    {
    }

    /**
     * Метод установки компонента грида
     * @param {AmdGridComponent<any>} grid
     * @returns {void}
     */
    public setGrid( grid: AmdGridComponent<any> )
    {
        this._grid = grid;
    }

    /**
     * Сбросить грид и фильтр
     * @returns {void}
     */
    public resetFilter()
    {
        this._grid.reset();
    }

    public isBlocked(row) {
        return +row.block > 0;
    }

    // Показать инфо о блокировках
    public getBlockInfoForm(row)
    {
        console.log(row) // frolov debug
        // this.shippedService.getBlockInfo(1);
        // this.amdWindowService
        //     .get<TParams, void>({
        //         destroyOnHide: true,
        //         width        : 1200,
        //         template     : `<block-info></block-info>`,
        //     })
        //     .show({
        //         showClaims: false,
        //         id: row.id,
        //         itemTitle: row.title
        //     })
        //     .then(()=> {});
    }

    public async loadPhotoData(row)
    {
        const url = '/claim/ajax/detailed-photo-list-group';

        this.ajaxService.get(url, {
            itemId: row.id,
            claimId: row.claimId,
        }).then((response)=> {
            console.log(response);
        })


        //     .then(
        //     () => {
        //         this.amdWindow.hide(true)
        //         ToastService.successFromRight("Примечание сохранено");
        //     }
        // ).catch(
        //     (result) => {
        //         ToastService.dangerFromRight(result);
        //     })
        // let elem = document.createElement("div");
        // elem.setAttribute("id", '1');
        //
        // let elem2 = await SectionPhotoPreviewManager.renderEyeIcon(elem, row.claimId, row.id)
        //
        // console.log(elem.outerHTML) // frolov debug
        // console.log(elem.innerHTML) // frolov debug
        //
        // return elem.outerHTML;

        // return `<div><p>hello world</p></div>`


        // let photoData = [
        //     {
        //         "itemId": row.id,
        //         "claimId": row.claimId,
        //         "params": photoParams
        //     }
        // ];

        // if (typeof window['oDetailedPhotoManager'] != 'undefined') {
        //     window['oDetailedPhotoManager'].loadGroup(photoData);
        // }

    }

}
