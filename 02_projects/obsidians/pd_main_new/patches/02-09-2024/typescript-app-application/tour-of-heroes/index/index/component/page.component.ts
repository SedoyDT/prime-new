import {IComponentController} from "angular";
import {Component} from "../../../../../angular/decorator/component.decorator";

@Component({
    // селектор по которому angularjs будет понимать,
    // что необходимо отобраить именно этот компонент на месте <page></page>
    selector: 'page',
    template:
            `
             <h1>{{$ctrl.title}}</h1>
             <heroes></heroes>
             <messages></messages>
            `
})
export class PageComponent implements IComponentController
{
    private title = "Тур героооя";

    public $onInit()
    {
    }
}