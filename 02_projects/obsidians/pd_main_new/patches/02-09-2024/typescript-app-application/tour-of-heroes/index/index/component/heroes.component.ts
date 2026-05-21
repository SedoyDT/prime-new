// component/heroes.component.ts
import {IComponentController} from "angular";
import {Component, Inject} from "../../../../../angular/decorator/component.decorator";
import {THero} from "../module";
import {HEROES} from "../mock-heroes";
import {HeroService} from "../service/hero.service";
import {MessageService} from "../service/message.service";
import {resolve} from "when";
import {AmdWindowService} from "../../../../../angular/component/amd-dialog/service/amd-window.service";


@Component({
    selector: 'heroes',
    template: `
        <h2>My Heroes</h2>
        <div class="margin-bottom-10">
            <amd-button ng-click="$ctrl.openAddForm()">добавить</amd-button>
        </div>
        <table data-amd-datatable data-rows="$ctrl.heroes" data-striped="true">
            <thead>
            <tr>
                <th data-width="50px">Id</th>
                <th>Имя</th>
                <th data-width="50px">&nbsp;</th>
            </tr>
            </thead>
            <tbody>
            <tr
                ng-click="$ctrl.onSelect(row)"
                ng-dblclick="$ctrl.openEditForm(row)"
                ng-class="{'amd-datatable__row_select': $ctrl.selectedHero === row}">
                <td>{{row.id}}</td>
                <td>{{row.name}}</td>
                <td>
                    <amd-icon class="color_danger" title="delete hero" ng-click="$ctrl.delete(row)">remove</amd-icon>
                </td>
            </tr>
            </tbody>
        </table>
  `
})

export class HeroesComponent implements IComponentController
{
    // private heroes: THero[] = HEROES;
    private heroes: THero[] = [];
    //...
    private selectedHero?: THero;

    public newHeroName: string;

    $onInit()
    {
        this.getHeroes();
    }

    public constructor(
        @Inject(HeroService) private heroService: HeroService,
        @Inject(MessageService) private messageService: MessageService,
        @Inject(AmdWindowService) private amdWindowService: AmdWindowService,
    )
    {

    }

    public openAddForm()
    {
        this.amdWindowService
            .get<null, THero>({
                destroyOnHide: true,
                width: 400,
                template: `<add-hero-form></add-hero-form>`,
            })
            .show()
            .then(hero => hero ? this.heroes.push(hero) : null);
    }

    public add(name: String) {
        this.heroService.addHero({name} as THero)
            .then(hero => this.heroes.push(hero));
    }

    public onSelect(hero: THero) {
        this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
        this.selectedHero = hero;
    }

    private getHeroes()
    {
        this.heroService
            .getHeroes()
            .then(heroes => this.heroes = heroes);
    }

    private delete(hero: THero)
    {
        this.heroService.deleteHero(hero.id).then(() =>
        {
            this.heroes = this.heroes.filter(h => h != hero);
        });
    }

    // Добавим метод `HeroesComponent.openEditForm`
    public openEditForm(hero: THero)
    {
        console.log(hero);
        this.amdWindowService
            .get<{hero: THero}, null>({
                destroyOnHide: true,
                width        : 400,
                template     : `<edit-hero-form></edit-hero-form>`,
            })
            .show({hero})
            .then(() => void 0);
    }

}