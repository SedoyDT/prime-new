var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./component/page.component", "../../../../angular/decorator/module.decorator", "../../../../angular/common-service", "../../../../angular/directive/amd-button/amd-button.module", "../../../../angular/component/amd-grid/elements/product-measure-type-hint.component", "../../../../angular/component/amd-grid/amd-grid2.module", "../../../../angular/component/amd-sub-filter/amd-sub-filter.module", "module", "../../../../angular/filter/trust-as-html.filter", "../../../../angular/service/network-service.module"], function (require, exports, page_component_1, module_decorator_1, common_service_1, amd_button_module_1, product_measure_type_hint_component_1, amd_grid2_module_1, amd_sub_filter_module_1, mod, trust_as_html_filter_1, network_service_module_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageModule = void 0;
    let PageModule = class PageModule {
    };
    exports.PageModule = PageModule;
    exports.PageModule = PageModule = __decorate([
        (0, module_decorator_1.Module)({
            declarations: [
                page_component_1.PageComponent,
                product_measure_type_hint_component_1.ProductMeasureTypeHintComponent,
            ],
            providers: [
                { provide: 'ConfigService', useValue: mod.config() },
            ],
            imports: [
                amd_button_module_1.AmdButtonModule,
                common_service_1.AmdCommonServiceModule,
                amd_grid2_module_1.AmdGrid2Module,
                amd_sub_filter_module_1.default,
                trust_as_html_filter_1.AmdTrustAsHtmlModule,
                network_service_module_1.AmdNetworkServiceModule,
            ],
        })
    ], PageModule);
});
