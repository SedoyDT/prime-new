import {Component, Inject, Require} from "../../../../angular/decorator/component.decorator";
import {IComponentController, IPromise, IQService} from "angular";
import {AmdWindowComponent} from "../../../../angular/component/amd-dialog/component/amd-window.component";
import ArrayDataSource from "../../../../core/model/data-source/array.data-source";
import {NAmdSelectEvents, TAmdSelectRow} from "../../../../angular/component/amd-select/amd-select";
import {BackendService} from "../service/backend.service";
import AmdSelectFilter from "../../../../angular/component/amd-select/amd-select.filter";
import TChangeDataEvent = NAmdSelectEvents.TChangeDataEvent;

/**
 * Компонент формы выбора воронок продаж, лиды которых должны быть подтверждены при попадании в ОКК
 */
@Component({
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
})
export class ConfirmFunnelsForm implements IComponentController
{
    /**
     * Контроллер модального окна
     * @private
     */
    @Require("^amdWindow")
    private amdWindow: AmdWindowComponent<void, void>;

    /**
     * Выбранные воронки
     * @private
     */
    private funnelIds: string[] = [];

    /**
     * Ошибки
     * @private
     */
    private errors: Assoc<any> = {};

    /**
     * Все воронки
     * @private
     */
    public funnels: any[]

    /**
     * Все этапы
     * @private
     */
    private stages: number

    /**
     * Промис для отображения бегунка
     * @private
     */
    private loadPromise: IPromise<any>;

    /**
     * Настройки
     * @private
     */
    public settings: setting[];

    /**
     * Массив воронок
     * @private
     */
    private totalFunnels = [];

    /**
     * Массив этапов
     * @private
     */
    private totalStages = [];

    /**
     * Массив этапов, на подтверждение
     * @private
     */
    private totalStagesToConfirm = [];

    /**
     * Массив форонок, на подтверждение
     * @private
     */
    private totalFunnelsToConfirm = [];

    /**
     * Массив воронок, [{id: number, text: string}]
     * @private
     */
    private totalFunnelsDataSourceData = [];

    /**
     * Массив этапов, [{id: number, text: string}]
     * @private
     */
    private totalStagesDataSourceData = [];
    /**
     * Источник данных воронок продаж
     * @private
     */
    private totalFunnelsDataSource: ArrayDataSource<TAmdSelectRow>;

    /**
     * Источник данных этапов воронок продаж
     * @private
     */
    private totalStagesDataSource: ArrayDataSource<TAmdSelectRow>;

    private mapSettings: any

    /**
     * @param backendService
     * @param $q
     */
    public constructor(
        @Inject(BackendService) private backendService: BackendService,
        @Inject('$q') private $q: IQService,
    )
    {
    }

    /**
     * @inheritDoc
     */
    public $onInit()
    {
        this.loadPromise = this.$q.all([
            this.backendService.getConfirmFunnels(),
            this.backendService.getConfirmStages(),
            this.backendService.getFunnelsToConfirm(),
            this.backendService.getStagesToConfirm()
        ]).then(([funnelsResponse, stagesResponse,funnelsToConfirmResponse, stagesToConfirmResponse]) => {
            // Обработка ответов
            this.totalFunnels = funnelsResponse.data;
            this.totalStages = stagesResponse.data;
            this.totalFunnelsToConfirm = funnelsToConfirmResponse.data;
            this.totalStagesToConfirm = stagesToConfirmResponse.data;

            console.log(this.totalStages) // frolov debug
            console.log(this.totalFunnels) // frolov debug
            console.log(this.totalFunnelsToConfirm) // frolov debug
            console.log(this.totalStagesToConfirm) // frolov debug


            // Инициализируем массив настроек
            this.settings = [];

            // Инициализация списка воронок
            this.funnels = [];
        }).catch((reason) => {
            alert(reason?.response?.error || 'Ошибка загрузки данных');
        });
    }

    /**
     * Сохранить воронки
     * @private
     */
    private save()
    {
        this.loadPromise = this.backendService
            .setConfirmFunnels(this.funnelIds)
            .then(() => this.amdWindow.hide())
            .catch(reason =>
            {
                if (reason.response?.errors) {
                    this.errors = reason.response.errors;
                } else {
                    alert(reason.response.error);
                }
            });
    }

    public excludedFunnels = [];

    private addSetting()
    {
        this.settings.push({
            activeFunnelSelection: null,
            activeStageSelection: null,
            selectedStages: [],
            stagesSource: this.totalStagesDataSource,
            funnelsSource: this.totalFunnelsDataSource
        });
    }

    private addFunnel()
    {
        let funnelId = null;
        this.funnels.push(funnelId);
    }

    public onFunnelChange($event: TChangeDataEvent, setting: setting)
    {
        console.log(this.funnels) // frolov debug

    }

    public onStageChange(setting: any)
    {

    }

    public updateExcludedFunnels()
    {
        this.totalFunnelsDataSourceData = this.totalFunnelsDataSourceData.filter(item => {
            return !this.funnels.indexOf(+item.value);
        });


    }

    public updateExcludedStages()
    {

    }

    public getDataSource(data: any): ArrayDataSource
    {
        let totalDataSourceData = data.map(item => ({
            value: +item[0],
            text: item[1]
        }));

        return new ArrayDataSource<TAmdSelectRow>(new AmdSelectFilter(), totalDataSourceData);
    }
}
