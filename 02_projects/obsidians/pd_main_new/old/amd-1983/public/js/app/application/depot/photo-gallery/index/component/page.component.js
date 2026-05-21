var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "../../../../../angular/decorator/component.decorator", "../../../../../angular/component/amd-grid/data-source/http.data-source", "../../../../../angular/component/amd-dialog/service/amd-window.service", "grid", "/js/filter/product-type-decorator.js"], function (require, exports, component_decorator_1, http_data_source_1, amd_window_service_1) {
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
    let PageComponent = class PageComponent {
        constructor(config, ajaxService, $element, amdWindowService) {
            this.config = config;
            this.ajaxService = ajaxService;
            this.$element = $element;
            this.amdWindowService = amdWindowService;
            this.filterExtraData = {
                onlyBlocked: 0,
                notEmpty: 0,
                searchId: null,
                amountWeight: null,
                amountWeightParams: null,
                showSale: 0,
                selectedDepots: null,
            };
            this.gridDataSource = new http_data_source_1.default({
                result: '/depot/photo-gallery/get-filter-result',
                config: '/depot/photo-gallery/get-filter-config',
                excel: '/depot/photo-gallery/get-filter-excel',
                mask: '/depot/photo-gallery/get-filter-mask',
            });
        }
        updateGrid() {
            this._grid.updateGrid();
        }
        updateFilter() {
            this._grid.update().then(r => 'success');
        }
        $onInit() {
            if (Array.isArray(this.config.depotsData.selected)) {
                this.filterExtraData.selectedDepots = [
                    ...this.config.depotsData.selected,
                    ...this.filterExtraData.selectedDepots
                ];
            }
            else {
                this.filterExtraData.selectedDepots = [];
                this.filterExtraData.selectedDepots.push(this.config.depotsData.selected);
            }
            this.filterExtraData.selectedDepots = this.filterExtraData.selectedDepots.filter((item, index) => this.filterExtraData.selectedDepots.indexOf(item) === index);
            this.depotsList = this.config.depotsData.list;
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
        loadInfoAboutPhoto(row) {
            this.amdWindowService
                .get({
                destroyOnHide: true,
                width: "95vw",
                height: "98vh",
                template: `<photo-info></photo-info>`,
            })
                .show({ row: row })
                .then((result) => {
                if (result) {
                    this._grid.updateGrid();
                }
            }, _ => { });
        }
        onGridUpdate(data) {
            this.rows = data.rows;
        }
    };
    exports.PageComponent = PageComponent;
    exports.PageComponent = PageComponent = __decorate([
        (0, component_decorator_1.Component)({
            selector: 'page',
            template: TEMPLATE,
        }),
        __param(0, (0, component_decorator_1.Inject)('ConfigService')),
        __param(1, (0, component_decorator_1.Inject)('AjaxFormBackendService')),
        __param(2, (0, component_decorator_1.Inject)("$element")),
        __param(3, (0, component_decorator_1.Inject)(amd_window_service_1.AmdWindowService))
    ], PageComponent);
});
