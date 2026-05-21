import {IComponentController, INgModelController ,IPromise} from "angular";
import {AmdWindowComponent} from "../../../../../angular/component/amd-dialog/component/amd-window.component";
import {Component, Inject, Require} from "../../../../../angular/decorator/component.decorator";
import {BackendService} from "../../../potential-clients/index/service/backend.service";
import {AmdWindowService} from "../../../../../angular/component/amd-dialog/service/amd-window.service";

const TEMPLATE = `
<amd-dialog data-wait-promise="$ctrl.loadingPromise">
    <dialog-header>  
        <h3>Добавить/Редактировать аннотацию</h3>  
    </dialog-header>
    <dialog-body>
        <div>
            <label for="annotation">Аннотация:</label>
            <textarea id="annotation" ng-model="$ctrl.annotationValue" rows="5" style="width: 100%;"></textarea>
        </div>
    </dialog-body>
    <dialog-footer>
        <amd-button ng-click="$ctrl.saveAnnotation()">Сохранить</amd-button>
        <amd-button ng-click="$ctrl.amdWindow.hide()">Закрыть</amd-button>
    </dialog-footer>
</amd-dialog>
`;

@Component({
    selector: 'set-annotation',
    template: TEMPLATE,
})
export class SetAnnotationFormComponent implements IComponentController {

    @Require('^amdWindow')
    private amdWindow: AmdWindowComponent<TParams, void>;

    private loadingPromise: IPromise<any>;

    public annotationValue: string = ''; // Модель для ввода аннотации

    public constructor(
        // @Inject(BackendService) public shippedService: BackendService,
        @Inject(AmdWindowService) private amdWindowService: AmdWindowService,
    ) {
    }

    public $onInit() {
        // Можно инициализировать значение аннотации, если это редактирование
        this.amdWindow.onChangeParams(() => {
            // const params = this.amdWindow.getParams();
            // if (params && params.id) {
            //     Получаем аннотацию по id и устанавливаем в модель
                // this.loadAnnotation(params.id);
            // }
        });
    }

    private loadAnnotation(id: number): void {
        // Пример запроса к backend для получения текущей аннотации
        // this.loadingPromise = this.shippedService.getAnnotation(id).then((response) => {
        //     this.annotationValue = response.data.annotation;
        // });
    }

    public saveAnnotation(): void {
        // const params = this.amdWindow.getParams();
        // if (params && params.id) {
        //     Сохраняем аннотацию через backend
            // this.loadingPromise = this.shippedService.saveAnnotation(params.id, this.annotationValue).then(() => {
            //     this.amdWindow.hide(); // Закрываем окно после сохранения
            // });
        // }
    }
}

export type TParams = {
    id: number,
}
