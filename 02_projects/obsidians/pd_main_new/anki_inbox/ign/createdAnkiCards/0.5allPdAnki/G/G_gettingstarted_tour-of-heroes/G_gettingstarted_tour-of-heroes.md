
#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Связка php и typescript - Для этого нам необходимо сообщить requirejs, что надо начать работу с файла /typescript/app/application/tour-of-heroes/index/index/config/config.ts.
<!-- basicblock-start oid="Obs1l58IQygI9uRkkWXVH2wk"  deck='G_gettingstarted_tour-of-heroes' -->
Связка php и typescript - Для этого нам необходимо сообщить requirejs, что надо начать работу с файла /typescript/app/application/tour-of-heroes/index/index/config/config.ts.::


```
//...
    public function indexAction()
    {
        $this->view->getRequire()->setDataMain('/js/app/application/tour-of-heroes/index/index/config');
    }
//...
```
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Файл главного компонента страницы, все остальные компоненты будут отображаться внутри него.
<!-- basicblock-start oid="ObsPNzV0sdvZErCl0u4FnHSD"  deck='G_gettingstarted_tour-of-heroes' -->
Файл главного компонента страницы, все остальные компоненты будут отображаться внутри него.::


```
import {IComponentController} from "angular";
import {Component} from "../../../../../angular/decorator/component.decorator";

@Component({
    // селектор по которому angularjs будет понимать, 
    // что необходимо отобраить именно этот компонент на месте <page></page>
    selector: 'page',
    template: `page works`,
})
export class PageComponent implements IComponentController
{

    public $onInit()
    {
    }
}
```
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Для чего page.module.ts
<!-- basicblock-start oid="ObsZL7QhdVHcVx9ICYUgCVI6"  deck='G_gettingstarted_tour-of-heroes' -->
Для чего page.module.ts::


Файл модуля angularTs это по сути обычный модуль, отличается от остальных, что его загружает config.ts

```
// компонент нашей страницы
import {PageComponent} from "./component/page.component";
import {Module} from "../../../../angular/decorator/module.decorator";
// необязательно, служит для получения параметров переданных модулю requirejs из контроллера
import mod = require("module");

@Module({
    // регистрируем компоненты страницы
    declarations: [
        PageComponent,
    ],
    // регистрируем сервисы. 
    // В данном случаем регистрируем переданные данные из контроллера-php 
    // в сервис с именем config
    providers   : [
        {provide: 'config', useValue: mod.config()},
    ],
    // место для импорта других модулей angularTS
    imports     : [],
})
export class PageModule
{
}
```
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Для чего файл config.ts?
<!-- basicblock-start oid="ObsAcJaW61kWsbDocLYoC0gt"  deck='G_gettingstarted_tour-of-heroes' -->
Для чего файл config.ts?::


Начальный файл, с которого происходит загрузка - config.ts. Это файл настройки requirejs. В большинстве случаев он выглядит так:

```
import {IAngularStatic} from "angular";
// импорт общего конфига с описанием подключения библиотек, которые не поддерживают requirejs 
import defaultConfig from "../../../../config";

declare var angular: IAngularStatic;

// примененить настройки
requirejs.config(defaultConfig);

// загрузить файл ./page.module.ts и запустить angularjs на элементе <page></page>
require(['page.module'], () => angular.bootstrap('page', ['pageModule']));
```
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Минимальный набор файлов для разработки страницы содержит в себе:
<!-- basicblock-start oid="ObstbzWAndrT43AhUAj9fzeF"  deck='G_gettingstarted_tour-of-heroes' -->
Минимальный набор файлов для разработки страницы содержит в себе:::


tour-of-heroes
    └── index
        └── index -- наша страница
            ├── component
            │   └── page.component.ts
            ├── config.ts
            └── page.module.ts
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Тк наш контроллер называется TourOfHeroes_IndexController, а action indexAction то для TS создаем папу по пути ...
<!-- basicblock-start oid="ObsUSIQhy377SypAHyu5aoaQ"  deck='G_gettingstarted_tour-of-heroes' -->
Тк наш контроллер называется TourOfHeroes_IndexController, а action indexAction то для TS создаем папу по пути ...::


/typescript/app/application/tour-of-heroes/index/index
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Почему мы используем AbstactPageController а не стандартный Zend_Controller_Action?
<!-- basicblock-start oid="ObsKBVuKp7viY8icn39qbge2"  deck='G_gettingstarted_tour-of-heroes' -->
Почему мы используем AbstactPageController а не стандартный Zend_Controller_Action?::


Благодаря методу preDispatch в AbstractPageController нет необходимости создавать view
<!-- basicblock-end -->



