import {IComponentController} from "angular";
import {Component, Inject, Require} from "../../../../../angular/decorator/component.decorator";
import {AmdWindowComponent} from "../../../../../angular/component/amd-dialog/component/amd-window.component";
import {TFormData, THero} from "../module";
import {HeroService} from "../service/hero.service";
import {
    TZendFormElementMessages,
    TZendFormMessages,
    TZendFormMessagesResponse
} from '../../../../../../types/zend-form';
import {ResponseError} from "../../../../../core/service/ajax-form-http.service";

@Component({
    selector: 'add-hero-form',
    template: `
        <amd-dialog ng-form="newHero">
            <dialog-header>Добавить героя</dialog-header>
            <dialog-body>
                <div class="margin-10-0">
                    <label for="new-hero">Имя героя: </label>
                    <amd-zend-control data-errors="$ctrl.errors.name">
                        <pre>{{$ctrl.errors.name | json}}</pre>
                        <input id="edit-hero" type="text" name="name" required ng-model="$ctrl.newHeroName">
                    </amd-zend-control>
                </div>
            </dialog-body>
            <dialog-footer>
<!--                <amd-button ng-click="$ctrl.add()" ng-disabled="newHero.$invalid">Добавить</amd-button>-->
                <amd-button ng-click="$ctrl.add()" >Добавить</amd-button>
                <amd-button ng-click="$ctrl.amdWindow.hide()">Закрыть</amd-button>
            </dialog-footer>
        </amd-dialog>
    `,
})

export class AddHeroFormComponent implements IComponentController
{
    private newHeroName?: string;

    private errors?: TZendFormMessages<TFormData>;

    @Require('^amdWindow')
    private amdWindow: AmdWindowComponent<null, THero>

    public constructor(
        @Inject(HeroService) private heroService: HeroService,
    )
    {
    }

    private add()
    {
        // this.heroService.addHero({name: this.newHeroName} as THero)
        //     .then((hero) => this.amdWindow.hide(hero));

        this.errors = null;
        console.log('her')
        this.heroService.addHero({name: this.newHeroName} as THero)
            .then((hero) => this.amdWindow.hide(hero))
            .catch((reason: ResponseError<TZendFormMessagesResponse<TFormData>>) =>
            {
                // console.log(12)

                this.errors = reason.response.errors;
                console.log('13')
                if (this.errors)
                {
                    console.log('14')
                    this.errors = reason.response.errors.name;
                }
                else {
                    // this.errors = reason.response.errors.message;
                    console.log(`here`);
                    console.log(reason);
                }

            });
    }

    public $onInit()
    {
    }
}