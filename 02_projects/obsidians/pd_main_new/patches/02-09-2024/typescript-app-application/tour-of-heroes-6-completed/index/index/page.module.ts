// компонент нашей страницы
import {PageComponent} from "./component/page.component";
import {Module} from "../../../../angular/decorator/module.decorator";
// необязательно, служит для получения параметров переданных модулю requirejs из контроллера
import mod = require("module");
import {HeroesComponent} from "./component/heroes.component";
import {HeroService} from "./service/hero.service";
import {MessageService} from "./service/message.service";
import {MessageComponent} from "./component/messages.component";
import {AmdCommonServiceModule} from "../../../../angular/common-service";
import {AmdDatatableModule} from "../../../../angular/directive/markup/amd-datatable.directive";
import {AmdIconModule} from "../../../../angular/component/amd-icon/amd-icon.module";
import {AmdButtonModule} from "../../../../angular/directive/amd-button/amd-button.module";
import {AmdDialogModule} from "../../../../angular/component/amd-dialog/amd-dialog.module";
import {AddHeroFormComponent} from "./component/add-hero-form.component";
import {EditHeroFormComponent} from "./component/edit-hero.component";

@Module({
    imports     : [
        AmdCommonServiceModule,
        // AmdDatatableModule,
        // AmdIconModule,
        AmdDatatableModule,
        AmdIconModule,
        AmdButtonModule,
        AmdDialogModule
    ],

    // регистрируем компоненты страницы
    declarations: [
        PageComponent,
        HeroesComponent,
        MessageComponent,
        AddHeroFormComponent,
        EditHeroFormComponent,
        // AmdIconModule,
        // AmdButtonModule - каак ломает?
    ],
    // регистрируем сервисы.
    // В данном случаем регистрируем переданные данные из контроллера-php
    // в сервис с именем config
    providers   : [
        {provide: 'config', useValue: mod.config()},
        HeroService,
        MessageService,

    ],
    // место для импорта других модулей angularTS

})
export class PageModule
{

}