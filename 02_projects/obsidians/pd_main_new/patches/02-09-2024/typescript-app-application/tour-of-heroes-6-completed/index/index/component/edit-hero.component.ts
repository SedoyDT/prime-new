import {IComponentController} from "angular";
import {Component, Inject, Input, Require} from "../../../../../angular/decorator/component.decorator";
import {THero} from "../module";
import {HeroService} from "../service/hero.service";
import {AmdWindowComponent} from "../../../../../angular/component/amd-dialog/component/amd-window.component";

@Component({
    selector: 'edit-hero-form',
    template: `
        <amd-dialog ng-form="editHero">
            <dialog-header>Изменить героя: {{$ctrl.amdWindow.params.hero.name}}</dialog-header>
            <dialog-body>
                <div class="margin-10-0">
                    <div><span>id: </span>{{$ctrl.amdWindow.params.hero.id}}</div>
                    <label for="edit-hero">Hero name: </label>
                    <input id="edit-hero" type="text" name="name" required ng-model="$ctrl.heroName">
                </div>
            </dialog-body>
            <dialog-footer>
                <amd-button ng-click="$ctrl.save()" ng-disabled="editHero.$invalid">Сохранить</amd-button>
                <amd-button ng-click="$ctrl.amdWindow.hide()">Закрыть</amd-button>
            </dialog-footer>
        </amd-dialog>
    `,
})
export class EditHeroFormComponent implements IComponentController
{
    private heroName?: string;

    @Require('^amdWindow')
    private amdWindow: AmdWindowComponent<{ hero: THero }, null>

    public constructor(
        @Inject(HeroService) private heroService: HeroService,
    )
    {
    }

    private save()
    {
        const oldHero = this.amdWindow.params.hero;
        this.heroService.updateHero({id: oldHero.id, name: this.heroName})
            .then(() =>
            {
                oldHero.name = this.heroName;
                this.amdWindow.hide();
            });
    }

    public $onInit()
    {
        this.amdWindow.onChangeParams(() =>
        {
            this.heroName = this.amdWindow.params.hero.name;
        });
    }
}