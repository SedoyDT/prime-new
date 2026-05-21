
#ign_ML
#ML

#telegram 

# Чтобы добавить аннотацию в данный код, можно создать отдельное поле для примечания с возможностью редактирования. В приведённом коде это уже реализовано через кнопку с вызовом метода `setAnnotation(row)`, который, вероятно, отвечает за редактирование примечания. Если нужно добавить что-то дополнительное, например, визуальные индикаторы для аннотации или другие свойства, можно изменить шаблон так:
<!-- basicblock-start  deck='ign_ML' -->
Чтобы добавить аннотацию в данный код, можно создать отдельное поле для примечания с возможностью редактирования. В приведённом коде это уже реализовано через кнопку с вызовом метода `setAnnotation(row)`, который, вероятно, отвечает за редактирование примечания. Если нужно добавить что-то дополнительное, например, визуальные индикаторы для аннотации или другие свойства, можно изменить шаблон так:::


1. Можно добавить иконку, которая будет указывать на наличие аннотации, рядом с кнопкой редактирования.
2. Сделать поле примечания больше или добавить стили для лучшего отображения текста.

Пример улучшенного шаблона:

```
{
    sort    : true,
    name    : 'annotation_value',
    caption : "Примечание",
    width   : "200px",
    template: `
    <div>
        <amd-button title="Редактировать примечание" 
            data-color="{{$ctrl.buttonColor}}" 
            ng-disabled="$ctrl.buttonDisabled" 
            ng-click="$ctrl.setAnnotation(row)"
        >
            <amd-icon>edit</amd-icon>
        </amd-button>
    </div>
    <div>
        <!-- Если есть аннотация, то отображаем иконку -->
        <amd-icon ng-if="row.annotation_value">info</amd-icon>
        {{row.annotation_value || 'Нет примечания'}}
    </div>
    `,
}
```

Теперь, если в поле `row.annotation_value` будет содержаться текст примечания, рядом с ним будет отображаться иконка. Также добавлена проверка на пустое значение примечания, и в случае его отсутствия выводится текст "Нет примечания".
<!-- basicblock-end -->




#ign_ML
#ML

#telegram 

# Чтобы данный код отображал поле для ввода аннотации в диалоговом окне, можно добавить соответствующую разметку внутри шаблона, а также подключить модель данных для связывания с вводом. Вот улучшенная версия, которая добавляет поле ввода для аннотации и связывает его с данными:
<!-- basicblock-start  deck='ign_ML' -->
Чтобы данный код отображал поле для ввода аннотации в диалоговом окне, можно добавить соответствующую разметку внутри шаблона, а также подключить модель данных для связывания с вводом. Вот улучшенная версия, которая добавляет поле ввода для аннотации и связывает его с данными:::


1. Добавлено текстовое поле `<textarea>` для ввода аннотации.
2. Модель данных для аннотации связывается с переменной `annotationValue`.
3. Добавлена кнопка "Сохранить" для обработки введённой аннотации.

Обновлённый код:

```
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
        @Inject(BackendService) public shippedService: BackendService,
        @Inject(AmdWindowService) private amdWindowService: AmdWindowService,
    ) {
    }

    public $onInit() {
        // Можно инициализировать значение аннотации, если это редактирование
        this.amdWindow.onChangeParams(() => {
            const params = this.amdWindow.getParams();
            if (params && params.id) {
                // Получаем аннотацию по id и устанавливаем в модель
                this.loadAnnotation(params.id);
            }
        });
    }

    private loadAnnotation(id: number): void {
        // Пример запроса к backend для получения текущей аннотации
        this.loadingPromise = this.shippedService.getAnnotation(id).then((response) => {
            this.annotationValue = response.data.annotation;
        });
    }

    public saveAnnotation(): void {
        const params = this.amdWindow.getParams();
        if (params && params.id) {
            // Сохраняем аннотацию через backend
            this.loadingPromise = this.shippedService.saveAnnotation(params.id, this.annotationValue).then(() => {
                this.amdWindow.hide(); // Закрываем окно после сохранения
            });
        }
    }
}

export type TParams = {
    id: number,
}
```

### Что было изменено:
1. **Текстовое поле**: Внутри блока `<dialog-body>` добавлено поле для ввода аннотации с помощью элемента `<textarea>` и привязано к модели `$ctrl.annotationValue`.
2. **Модель данных**: Введена переменная `annotationValue` для хранения значения аннотации.
3. **Методы загрузки и сохранения**: Добавлены методы для загрузки текущей аннотации (`loadAnnotation`) и её сохранения (`saveAnnotation`).
4. **Кнопки**: В диалоговом окне теперь есть две кнопки — "Сохранить" и "Закрыть".
<!-- basicblock-end -->



