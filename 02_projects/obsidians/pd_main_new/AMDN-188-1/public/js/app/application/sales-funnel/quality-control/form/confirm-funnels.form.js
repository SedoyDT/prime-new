var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "../../../../angular/decorator/component.decorator", "../../../../core/model/data-source/array.data-source", "../service/backend.service", "../../../../angular/component/amd-select/amd-select.filter"], function (require, exports, component_decorator_1, array_data_source_1, backend_service_1, amd_select_filter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConfirmFunnelsForm = void 0;
    let ConfirmFunnelsForm = class ConfirmFunnelsForm {
        constructor(backendService, $q) {
            this.backendService = backendService;
            this.$q = $q;
            this.funnelIds = [];
            this.errors = {};
            this.totalFunnels = [];
            this.totalStages = [];
            this.totalStagesToConfirm = [];
            this.totalFunnelsToConfirm = [];
            this.totalFunnelsDataSourceData = [];
            this.totalStagesDataSourceData = [];
            this.excludedFunnels = [];
        }
        $onInit() {
            this.loadPromise = this.$q.all([
                this.backendService.getConfirmFunnels(),
                this.backendService.getConfirmStages(),
                this.backendService.getFunnelsToConfirm(),
                this.backendService.getStagesToConfirm()
            ]).then(([funnelsResponse, stagesResponse, funnelsToConfirmResponse, stagesToConfirmResponse]) => {
                this.totalFunnels = funnelsResponse.data;
                this.totalStages = stagesResponse.data;
                this.totalFunnelsToConfirm = funnelsToConfirmResponse.data;
                this.totalStagesToConfirm = stagesToConfirmResponse.data;
                console.log(this.totalStages);
                console.log(this.totalFunnels);
                console.log(this.totalFunnelsToConfirm);
                console.log(this.totalStagesToConfirm);
                this.settings = [];
                this.funnels = [];
            }).catch((reason) => {
                var _a;
                alert(((_a = reason === null || reason === void 0 ? void 0 : reason.response) === null || _a === void 0 ? void 0 : _a.error) || 'Ошибка загрузки данных');
            });
        }
        save() {
            this.loadPromise = this.backendService
                .setConfirmFunnels(this.funnelIds)
                .then(() => this.amdWindow.hide())
                .catch(reason => {
                var _a;
                if ((_a = reason.response) === null || _a === void 0 ? void 0 : _a.errors) {
                    this.errors = reason.response.errors;
                }
                else {
                    alert(reason.response.error);
                }
            });
        }
        addSetting() {
            this.settings.push({
                activeFunnelSelection: null,
                activeStageSelection: null,
                selectedStages: [],
                stagesSource: this.totalStagesDataSource,
                funnelsSource: this.totalFunnelsDataSource
            });
        }
        addFunnel() {
            let funnelId = null;
            this.funnels.push(funnelId);
        }
        onFunnelChange($event, setting) {
            console.log(this.funnels);
        }
        onStageChange(setting) {
        }
        updateExcludedFunnels() {
            this.totalFunnelsDataSourceData = this.totalFunnelsDataSourceData.filter(item => {
                return !this.funnels.indexOf(+item.value);
            });
        }
        updateExcludedStages() {
        }
        getDataSource(data) {
            let totalDataSourceData = data.map(item => ({
                value: +item[0],
                text: item[1]
            }));
            return new array_data_source_1.default(new amd_select_filter_1.default(), totalDataSourceData);
        }
    };
    exports.ConfirmFunnelsForm = ConfirmFunnelsForm;
    __decorate([
        (0, component_decorator_1.Require)("^amdWindow")
    ], ConfirmFunnelsForm.prototype, "amdWindow", void 0);
    exports.ConfirmFunnelsForm = ConfirmFunnelsForm = __decorate([
        (0, component_decorator_1.Component)({
            selector: 'confirm-funnels-form',
            template: `
        <amd-dialog data-wait-promise="$ctrl.loadPromise">
            <dialog-header>Выбрать воронки для взаимодействия</dialog-header>
            <dialog-body>
                <amd-zend-control class="text-align_center" data-errors="$ctrl.errors.funnelIds">

                </amd-zend-control>
            </dialog-body>
            <dialog-footer>
                <amd-button ng-click="$ctrl.save()">Сохранить</amd-button>
                <amd-button ng-click="$ctrl.amdWindow.hide()">Закрыть</amd-button>
            </dialog-footer>
        </amd-dialog>
    `,
        }),
        __param(0, (0, component_decorator_1.Inject)(backend_service_1.BackendService)),
        __param(1, (0, component_decorator_1.Inject)('$q'))
    ], ConfirmFunnelsForm);
});
