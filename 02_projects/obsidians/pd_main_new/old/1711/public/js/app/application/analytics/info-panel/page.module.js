var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../angular/decorator/module.decorator", "./component/page.component", "../../../angular/component/amd-calendar/amd-calendar-month.module", "../../../angular/directive/amd-button/amd-button.module", "../../../angular/service/network-service.module", "../../../angular/component/amd-filter/amd-filter2.module", "../../../angular/component/amd-panel-row/amd-panel-row.component", "./service/report-data.service", "../../../angular/component/amd-content/amd-content.module", "../../../angular/component/amd-dialog/amd-dialog.module", "./component/vertical-column-chart.component", "./component/line-chart.component", "./component/horizontal-column-chart.component", "./component/settings-form.component", "../../../angular/component/amd-zend-form/amd-zend-form.module", "../../../angular/component/amd-icon/amd-icon.module", "../../../angular/component/amd-select/amd-multiselect.module", "../../../angular/service/amd-access.module", "./component/filter-by-value.component", "./service/chart-registry.service", "./component/ltv.component", "../../../angular/filter/month-with-suffix.filter", "../../../angular/component/amd-filter/templates/amd-filter-templates.module", "../../../angular/component/amd-switch/module", "./component/difference-settings.component", "./component/pie-chart.component", "./component/chart-wrapper.component", "./component/chart-form.component", "./component/sunburst-chart.component", "./component/detailed-client-form.component", "../../call/utils/phone-block/angular/call-phone-block2.module", "../../global-project/global-project.module", "./component/table-detalization.component", "./component/value-switcher.component", "module", "ngLocaleRu"], function (require, exports, module_decorator_1, page_component_1, amd_calendar_month_module_1, amd_button_module_1, network_service_module_1, amd_filter2_module_1, amd_panel_row_component_1, report_data_service_1, amd_content_module_1, amd_dialog_module_1, vertical_column_chart_component_1, line_chart_component_1, horizontal_column_chart_component_1, settings_form_component_1, amd_zend_form_module_1, amd_icon_module_1, amd_multiselect_module_1, amd_access_module_1, filter_by_value_component_1, chart_registry_service_1, ltv_component_1, month_with_suffix_filter_1, amd_filter_templates_module_1, module_1, difference_settings_component_1, pie_chart_component_1, chart_wrapper_component_1, chart_form_component_1, sunburst_chart_component_1, detailed_client_form_component_1, call_phone_block2_module_1, global_project_module_1, table_detalization_component_1, value_switcher_component_1, mod) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageModule = void 0;
    let PageModule = class PageModule {
    };
    exports.PageModule = PageModule;
    exports.PageModule = PageModule = __decorate([
        (0, module_decorator_1.Module)({
            imports: [
                amd_calendar_month_module_1.AmdCalendarMonthModule,
                amd_button_module_1.AmdButtonModule,
                network_service_module_1.AmdNetworkServiceModule,
                amd_filter2_module_1.default,
                amd_panel_row_component_1.AmdPanelRowModule,
                amd_content_module_1.AmdContentModule,
                amd_dialog_module_1.AmdDialogModule,
                amd_zend_form_module_1.default,
                amd_icon_module_1.AmdIconModule,
                amd_multiselect_module_1.AmdMultiselectModule,
                amd_access_module_1.AmdAccessModule,
                month_with_suffix_filter_1.MonthWithSuffixFilterModule,
                amd_filter_templates_module_1.AmdFilterTemplatesModule,
                module_1.AmdSwitchModule,
                call_phone_block2_module_1.CallPhoneBlock2Module,
                global_project_module_1.GlobalProjectModule,
            ],
            declarations: [
                page_component_1.PageComponent,
                chart_form_component_1.ChartFormComponent,
                vertical_column_chart_component_1.VerticalColumnChartComponent,
                line_chart_component_1.LineChartComponent,
                horizontal_column_chart_component_1.HorizontalColumnChartComponent,
                settings_form_component_1.SettingsFormComponent,
                filter_by_value_component_1.FilterByValueComponent,
                ltv_component_1.LtvComponent,
                difference_settings_component_1.DifferenceSettingsComponent,
                pie_chart_component_1.PieChartComponent,
                chart_wrapper_component_1.ChartWrapperComponent,
                sunburst_chart_component_1.SunburstChartComponent,
                detailed_client_form_component_1.DetailedClientFormComponent,
                table_detalization_component_1.TableDetalizationComponent,
                value_switcher_component_1.ValueSwitcherComponent,
            ],
            providers: [
                report_data_service_1.ReportDataService,
                chart_registry_service_1.ChartRegistryService,
                { provide: amd_access_module_1.AMD_ACCESS_SERVICE_DATA, useValue: mod.config().access },
                { provide: "ConfigService", useValue: mod.config() },
            ],
        })
    ], PageModule);
});
