import {IComponentController} from "angular";
import {Component, Inject, Require} from "../../../../../angular/decorator/component.decorator";
import {AmdWindowComponent} from "../../../../../angular/component/amd-dialog/component/amd-window.component";
import {THero} from "../module";
import {HeroService} from "../service/hero.service";

@Component({
    selector: 'add-hero-form',
    template: `
        <amd-dialog ng-form="newHero">
            <dialog-header>Добавить героя</dialog-header>
            <dialog-body>
                <div class="margin-10-0">
                    <label for="new-hero">Hero name: </label>
                    <input id="new-hero" type="text" name="new-hero" required ng-model="$ctrl.newHeroName">
                </div>
            </dialog-body>
            <dialog-footer>
                <amd-button ng-click="$ctrl.add()" ng-disabled="newHero.$invalid">Добавить</amd-button>
                <amd-button ng-click="$ctrl.amdWindow.hide()">Закрыть</amd-button>
            </dialog-footer>
        </amd-dialog>
    `,
})

export class AddHeroFormComponent implements IComponentController
{
    private newHeroName?: string;

    @Require('^amdWindow')
    private amdWindow: AmdWindowComponent<null, THero>

    public constructor(
        @Inject(HeroService) private heroService: HeroService,
    )
    {
    }

    private add()
    {
        this.heroService.addHero({name: this.newHeroName} as THero)
            .then((hero) => this.amdWindow.hide(hero));
    }

    public $onInit()
    {
    }
}