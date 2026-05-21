import {IComponentController} from "angular";
import {Component, Inject} from "../../../../../angular/decorator/component.decorator";
import AmdGridComponent from "../../../../../angular/component/amd-grid/amd-grid.component";
import 'grid';
import '/js/filter/product-type-decorator.js'
import HttpDataSource from "../../../../../angular/component/amd-grid/data-source/http.data-source";
import AjaxFormBackendService from "../../../../../angular/service/ajax-form-backend.service";
import {AmdWindowService} from "../../../../../angular/component/amd-dialog/service/amd-window.service";


const TEMPLATE = `
    <amd-grid 
        data-bind-view-child="$ctrl.setGrid(grid)"
        data-data-source="$ctrl.gridDataSource"
        data-extra-data="$ctrl.filterExtraData"
        data-on-grid-update="$ctrl.onGridUpdate(data)" 
        ng-click="$ctrl.onSelect(data)"

    >          
        <div class="filter-controls">
            <div class="filter-controls__left">

            </div>
            <div class="filter-controls__right">
                
            </div>
            <amd-content class="margin-bottom_default_half">
            <content class="display_flex justify-content_space-between align-items_center">
                <amd-panel-row>
                    <panel-label>Дополнительные фильтры</panel-label>
                    <panel-body>
                        <amd-depot-list-select
                            ng-model="$ctrl.filterExtraData.selectedDepots"
                            data-list="$ctrl.depotsList"
                            ng-change="$ctrl.updateGrid()"
                        ></amd-depot-list-select>
                        <amd-search-with-button
                            ng-model="$ctrl.filterExtraData.searchId"
                            data-on-apply="$ctrl.updateGrid()"
                        ></amd-search-with-button>
                        <span>
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
                        </span>
                        <span>
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
                        </span>
                        <span>
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
                        </span>
                    </panel-body>
                </amd-panel-row>
            </content>
        </amd-content>
        </div>
        <div class="grid">
            <div class="grid__item" ng-repeat="row in $ctrl.rows" title="ID товара {{row.id}}">
                <img 
                    class="grid__image" 
                    alt="Фото товара {{row.id}}" 
                    src="{{row.filename}}" 
                    ng-click="$ctrl.loadInfoAboutPhoto(row)"
                />
            </div>
        </div>
        <grid-footer>
        </grid-footer>
    </amd-grid>
`;

@Component({
    selector: 'page',
    template: TEMPLATE,
})
export class PageComponent implements IComponentController
{
    private filterExtraData = {
        onlyBlocked        : 0,
        notEmpty           : 0,
        searchId           : null,
        amountWeight       : null,
        amountWeightParams : null,
        showSale           : 0,
        selectedDepots     : null,
    };

    /**
     * Источник данных для грида
     */
    private gridDataSource: HttpDataSource<any>;

    /**
     *
     * @protected
     */
    private depotsList;

    /**
     *
     * @private
     */
    private rows;

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
        @Inject("$element") private $element: JQuery,
        @Inject(AmdWindowService) private amdWindowService: AmdWindowService,

    ) {
        this.gridDataSource = new HttpDataSource<any>({
            result: '/depot/photo-gallery/get-filter-result',
            config: '/depot/photo-gallery/get-filter-config',
            excel: '/depot/photo-gallery/get-filter-excel',
            mask: '/depot/photo-gallery/get-filter-mask',
        });

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
        if (Array.isArray(this.config.depotsData.selected)) {
            this.filterExtraData.selectedDepots = [
                ...this.config.depotsData.selected,
                ...this.filterExtraData.selectedDepots
            ];
        } else {
            this.filterExtraData.selectedDepots = [];
            this.filterExtraData.selectedDepots.push(this.config.depotsData.selected);
        }

        this.filterExtraData.selectedDepots = this.filterExtraData.selectedDepots.filter(
            (item, index) => this.filterExtraData.selectedDepots.indexOf(item) === index
        );

        this.depotsList = this.config.depotsData.list;
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

    public loadInfoAboutPhoto(row)
    {
        this.amdWindowService
            .get<{row}, boolean>({
                destroyOnHide: true,
                width: "95vw",
                height: "98vh",
                template     : `<photo-info></photo-info>`,
            })
            .show({row : row})
            .then( (result)=> {
                if (result) {
                    this._grid.updateGrid();
                }
            }, _ => {} );
    }

    public onGridUpdate(data)
    {
        this.rows = data.rows;
    }
}
