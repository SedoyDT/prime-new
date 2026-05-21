var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../../../../../angular/decorator/component.decorator", "../../../../../angular/component/amd-grid/data-source/http.data-source", "../../../../../angular/component/amd-grid/generator/datatable-template.generator", "../config/filter.config", "../../../../../core/model/data-source/array.data-source", "../../../../../angular/component/amd-select/amd-select.filter", "grid", "/js/filter/product-type-decorator.js"], function (require, exports, component_decorator_1, http_data_source_1, datatable_template_generator_1, filter_config_1, array_data_source_1, amd_select_filter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageComponent = void 0;
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
            ${(new datatable_template_generator_1.DatatableTemplateGenerator()).generate(filter_config_1.filterConfig)}
        <grid-footer>
             <amd-button
                ng-click="$ctrl._grid.downloadExcel($event)"
            >
                Выгрузить в Excel
            </amd-button>
        </grid-footer>
    </amd-grid>
`;
    let PageComponent = class PageComponent {
        constructor(config, ajaxService) {
            this.config = config;
            this.ajaxService = ajaxService;
            this.filterExtraData = {
                onlyBlocked: 0,
                notEmpty: 0,
                searchId: null,
                amountWeight: null,
                amountWeightParams: null,
                showSale: 0,
            };
            this.gridDataSource = new http_data_source_1.default({
                result: '/depot/photo-gallery/get-filter-result',
                config: '/depot/photo-gallery/get-filter-config',
                excel: '/depot/photo-gallery/get-filter-excel',
                mask: '/depot/photo-gallery/get-filter-mask',
            });
            this.amountWeightParams = new array_data_source_1.default(new amd_select_filter_1.default(), this.config.amountWeightParams);
        }
        updateGrid() {
            this._grid.updateGrid();
        }
        updateFilter() {
            this._grid.update().then(r => 'success');
        }
        $onInit() {
        }
        setGrid(grid) {
            this._grid = grid;
        }
        resetFilter() {
            this._grid.reset();
        }
        isBlocked(row) {
            return +row.block > 0;
        }
        getBlockInfoForm(row) {
            console.log(row);
        }
        loadPhotoData(row) {
            return __awaiter(this, void 0, void 0, function* () {
                const url = '/claim/ajax/detailed-photo-list-group';
                this.ajaxService.get(url, {
                    itemId: row.id,
                    claimId: row.claimId,
                }).then((response) => {
                    console.log(response);
                });
            });
        }
    };
    exports.PageComponent = PageComponent;
    exports.PageComponent = PageComponent = __decorate([
        (0, component_decorator_1.Component)({
            selector: 'page',
            template: TEMPLATE,
        }),
        __param(0, (0, component_decorator_1.Inject)('ConfigService')),
        __param(1, (0, component_decorator_1.Inject)('AjaxFormBackendService'))
    ], PageComponent);
});
