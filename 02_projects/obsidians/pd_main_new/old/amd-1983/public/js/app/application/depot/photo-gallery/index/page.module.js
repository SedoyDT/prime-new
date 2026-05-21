var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./component/page.component", "../../../../angular/decorator/module.decorator", "../../../../angular/common-service", "../../../../angular/component/amd-grid/amd-grid2.module", "../../../../angular/component/amd-sub-filter/amd-sub-filter.module", "../../../../angular/filter/trust-as-html.filter", "../../../../angular/service/network-service.module", "../../../../angular/component/amd-dialog/amd-dialog.module", "./component/photo-info.component", "../../../../angular/component/amd-icon/amd-icon.module", "../../../../angular/component/amd-panel-row/amd-panel-row.component", "../../../../angular/component/amd-content/amd-content.module", "module", "../../../../angular/directive/amd-button/amd-button.module"], function (require, exports, page_component_1, module_decorator_1, common_service_1, amd_grid2_module_1, amd_sub_filter_module_1, trust_as_html_filter_1, network_service_module_1, amd_dialog_module_1, photo_info_component_1, amd_icon_module_1, amd_panel_row_component_1, amd_content_module_1, mod, amd_button_module_1) {
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
                photo_info_component_1.PhotoInfoComponent
            ],
            providers: [
                { provide: 'ConfigService', useValue: mod.config() },
            ],
            imports: [
                common_service_1.AmdCommonServiceModule,
                amd_grid2_module_1.AmdGrid2Module,
                amd_sub_filter_module_1.default,
                trust_as_html_filter_1.AmdTrustAsHtmlModule,
                network_service_module_1.AmdNetworkServiceModule,
                amd_dialog_module_1.AmdDialogModule,
                amd_icon_module_1.AmdIconModule,
                amd_content_module_1.AmdContentModule,
                amd_panel_row_component_1.AmdPanelRowModule,
                amd_button_module_1.AmdButtonModule
            ],
        })
    ], PageModule);
});
