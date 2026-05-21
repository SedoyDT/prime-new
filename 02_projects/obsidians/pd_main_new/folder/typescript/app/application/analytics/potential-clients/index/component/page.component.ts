import {IComponentController} from "angular";
import {Component, Inject, Input, Require} from "../../../../../angular/decorator/component.decorator";
import AmdGridComponent from "../../../../../angular/component/amd-grid/amd-grid.component";
import 'grid';
import '/js/depot/products/list/depot-products-admission-form.js';
import '/js/depot/products/list/depot-products-product-info.js';
import '/js/depot/products/list/depot-products-admission-sections.js';
import '/js/depot/products/list/depot-products-empty-form.js';
import '/js/depot/products/list/depot-products-reserve-info.js';
import '/js/filter/product-type-decorator.js'
import HttpDataSource from "../../../../../angular/component/amd-grid/data-source/http.data-source";
import {
    DatatableTemplateGenerator
} from "../../../../../angular/component/amd-grid/generator/datatable-template.generator";
import MultiSelection from "../../../../../angular/component/amd-grid/selection/multi.selection";
import {PotentialClients_Index} from "../page";
import {filterConfig} from "../config/filter.config";
import * as lodash from "../../../../../../vendor/lodash/lodash";
import {AmdWindowService} from "../../../../../angular/component/amd-dialog/service/amd-window.service";
import {BackendService} from "../service/backend.service";
import AccessService from "../../../../../core/service/access.service";
import {TParams} from "./shipped-info.component";
import {TRow} from "../../../../receipt/purchases/index/page.module";
import ArrayDataSource from "../../../../../core/model/data-source/array.data-source";
import AmdSelectFilter from "../../../../../angular/component/amd-select/amd-select.filter";
declare var filterProductTypeDecorator : any;

const TEMPLATE = `
    <div class="text-align_center margin-bottom_default"
         ng-if="$ctrl.access.similarProducts"
    >
        <amd-button 
            ng-href="/analitics/potentialclients/similar-products/2"
            target="_blank"
        >
            Параметры схожести
        </amd-button>
    </div>
    <amd-grid 
        data-bind-view-child="$ctrl.setGrid(grid)"
        data-data-source="$ctrl.gridDataSource"
        data-extra-data="$ctrl.filterExtraData"
        data-on-grid-update="$ctrl.onGridUpdate(data)" 
        ng-click="$ctrl.onSelect(data)"
    >            
        <div class="centered-block text-align_center"></div>
        
        <div class="report-controls text-align_center margin-bottom_default">
            <div class="display_inline-block">
                <div class="amd-panel-row_default margin-bottom_default">
                    <div class="amd-panel-row_default__header">Сформировать отчет:</div>
                    <div class="amd-panel-row_default__body report-controls__body">
                        <div>
                            <label>Выделено записей:</label>
                            <span 
                                id="amountSelected" 
                                class="amd-tag amd-tag_primary"
                            >
                                {{$ctrl.selection.count()}}
                            </span>
                        </div>
                        <div>
                            <amd-button 
                                type="submit" 
                                ng-click="$ctrl.selectAll()"
                            >
                                Выделить все
                            </amd-button>
                        </div>
                        <div>
                            <amd-button 
                                type="submit" 
                                ng-click="$ctrl.selection.clear()"
                            >
                                Снять выделение
                            </amd-button>
                        </div>
                        <div>
                            <form 
                                  target="_blank"
                                  method="POST"
                                  action="/analitics/potentialclients/show/"
                            >
                                <amd-button 
                                    type="submit" 
                                    name="ids"
                                    ng-if="$ctrl.access.allInfo"
                                    value="{{$ctrl.filterExtraData.ids}}"
                                    ng-disabled="$ctrl.selection.isEmpty()"
                                />
                                    Показать
                                </amd-button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="p-filter-controls">
            <div class="p-filter-controls__left">
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
                        ng-if="$ctrl.access.showBlock" 
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
                <div>
                    <label class="amd-straight-checkbox">
                        <span>
                            <i class="fas fa-camera"></i>
                        </span>
                        <span>
                            <input 
                                  class="amd-straight-checkbox"
                                  id="showOnlyHasProducts" 
                                  type="checkbox" 
                                  ng-model="$ctrl.filterExtraData.onlyHasPhotos" 
                                  ng-change="$ctrl.updateGrid()"
                             />
                         </span>
                    </label>
                </div>
            </div>
        </div>
            ${(new DatatableTemplateGenerator()).generate(filterConfig )}
        <grid-footer>
             <amd-button ng-if="$ctrl.access.excel"
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
        searchId           : null,
        depots             : this.config['depots'],
        showSale           : 0,
        notEmpty           : 0,
        onlyBlocked        : 0,
        onlyManagersBlocked: 0,
        onlyHasPhotos      : 0,
        onlyBadQuality     : 0,
        ids                : '',
        productTypes       : filterProductTypeDecorator.requestTypes.all
    };

    public access = {
        showBlock           : false,
        showManagersBlocks  : false,
        showDefect          : false,
        showInfo            : false,
        similarProducts     : false,
        allInfo             : true,
        fullBlockInfo       : false,
        excel               : false
    };

    private depotProductsAdmissionForm: DepotProductsAdmissionForm;

    /**
     * Источник данных для грида
     */
    public gridDataSource: HttpDataSource<any>;

    /**
     * Выделение строк
     */
    public selection = new MultiSelection<PotentialClients_Index.TRow>();

    /**
     * Грид
     */
    private _grid: AmdGridComponent<any>;

    /**
     * @constructor
     * @param {TConfig} config
     * @param shippedService
     * @param amdWindowService
     * @param {AccessService} accessService
     */
    public constructor(
        @Inject('config') public config: PotentialClients_Index.TConfig,
        @Inject(BackendService) public shippedService: BackendService,
        @Inject(AmdWindowService) private amdWindowService: AmdWindowService,
        @Inject('accessService') public accessService: AccessService,
    ) {
        this.gridDataSource = new HttpDataSource(this.config.dataTable.urls);
        this._initAccess();
    }

    /**
     * Обновить грида
     * @returns {void}
     */
    public updateGrid()
    {
        this.selection.clear();
        this._grid.updateGrid();
    }

    /**
     * Обновить грид и фильтр
     * @returns {void}
     */
    public updateFilter()
    {
        this.selection.clear();
        this._grid.update().then(r => 'success');
    }


    public $onInit()
    {
        this.depotProductsAdmissionForm = new DepotProductsAdmissionForm();
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


    public onSelect( )
    {
        let result = this.selection.getData();
        if (this.selection.isEmpty()) {
            this.filterExtraData.ids = '';
        } else {
            this.filterExtraData.ids = result.map( x => x.id ).join(',');
        }
    }


    /**
     * Обратный вызов
     * @param {{totalSum: number, onPageSum: number}} data
     * @returns {void}
     */
    public onGridUpdate( data: {rows: PotentialClients_Index.TRow} )
    {
        this.selection.clear();
    }


    /**
     * Выделить все
     * @returns {void}
     * @private
     */
    private selectAll(): void
    {
        this._grid
            .waitPromise(
                this.gridDataSource
                    .getRows(lodash.extend({
                        startRow   : 0,
                        rowCount   : 0,
                        filterModel: this._grid.getFilterModel(),
                    }, this.filterExtraData || {})
                    )
            )
            .then(data => this.selection.setData(data.rows));
    }


    /**
     * Переключить выделение строки
     * @param {TRow} row
     * @returns {void}
     * @private
     */
    private toggleRow(row: PotentialClients_Index.TRow): void
    {
        this.selection.processRow(row);
    }


    /**
     * Сбросить грид и фильтр
     * @returns {void}
     */
    public resetFilter()
    {
        this._grid.reset();
    }

    // Показать информацию об отгрузках товара
    public getShippedInfoForm(row: PotentialClients_Index.TRow)
    {
        this.amdWindowService
            .get<TParams, void>({
                destroyOnHide: true,
                width        : 1000,
                template     : `<shipped-info></shipped-info>`,
            })
            .show({
                showClaims: false,
                id: row.id,
                itemTitle: row.title
            })
            .then( ()=> {} );
    }


    // Показать инфо о блокировках
    public getBlockInfoForm(row: PotentialClients_Index.TRow)
    {
        this.amdWindowService
            .get<TParams, void>({
                destroyOnHide: true,
                width        : 1200,
                template     : `<block-info></block-info>`,
            })
            .show({
                showClaims: false,
                id: row.id,
                itemTitle: row.title
            })
            .then(()=> {});
    }


    public showAdvanced(event: JQueryEventObject, row: PotentialClients_Index.TRow)
    {
        event.stopPropagation();
        this.depotProductsAdmissionForm.show(
            this.filterExtraData.depots, row.id, 0
        );
    }


    /**
     * Инициализировать права
     * @returns {void}
     * @private
     */
    private _initAccess(): void
    {
        this.accessService.clearCache();
        this.access = {
            showBlock         : this.accessService.getAccess( 'potentialclients>access>showblock' ).isAllowed(),
            showManagersBlocks: this.accessService.getAccess( 'depot>access>managersblocks>access' ).isAllowed(),
            showDefect        : this.accessService.getAccess( 'depot>access>showonlydefect' ).isAllowed(),
            showInfo          : this.accessService.getAccess( 'potentialclients>info>all_info' ).isAllowed(),
            similarProducts   : this.accessService.getAccess( 'potentialclients>info>similarproducts' ).isAllowed(),
            allInfo           : this.accessService.getAccess( 'potentialclients>info>all_info' ).isAllowed(),
            fullBlockInfo     : this.accessService.getAccess('fieldAccessPath>fullblockinfo').isAllowed(),
            excel             : this.accessService.getAccess('potentialclients>info>excel').isAllowed(),

        };
    }
}
