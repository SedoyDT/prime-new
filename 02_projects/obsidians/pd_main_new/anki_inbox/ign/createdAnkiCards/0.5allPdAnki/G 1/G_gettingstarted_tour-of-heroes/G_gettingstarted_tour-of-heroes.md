
#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Добавим обработку ответа, когда `{success: false}`. 
<!-- basicblock-start oid="Obs7yxC7lnFUQep1PFQYnW8z"  deck='G_gettingstarted_tour-of-heroes' -->
Добавим обработку ответа, когда `{success: false}`. ::


```
export class AddHeroFormComponent implements IComponentController
{
    // ...
    private add()
    {
        this.errors = null;
        this.heroService.addHero({name: this.newHeroName} as THero)
            .then((hero) => this.amdWindow.hide(hero))
            .catch((reason: ResponseError<TZendFormMessagesResponse<TFormData>>) =>
            {
                this.errors = reason.response.errors;
            });
    }
    // ...
}
```
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Теперь валидация происходит и на стороне сервера, но пользователь не видит ошибок.
<!-- basicblock-start oid="ObsVcueCay2oJ444gWp0eeJC"  deck='G_gettingstarted_tour-of-heroes' -->
Теперь валидация происходит и на стороне сервера, но пользователь не видит ошибок.::


Для такой ситуации у нас есть `AmdZendFormModule`.
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Валидаторы Zend лежат в
<!-- basicblock-start oid="ObsDpXuAHZi2W1N79TedkqsT"  deck='G_gettingstarted_tour-of-heroes' -->
Валидаторы Zend лежат в::


 [`/library/Zend/Validate`](../../../../library/Zend/Validate).
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Нашему полю мы указали `'required' => true`, что не только добавляет аттрибут для HTML,
<!-- basicblock-start oid="ObsHCNrDgsJygHyC6mhwwDu3"  deck='G_gettingstarted_tour-of-heroes' -->
Нашему полю мы указали `'required' => true`, что не только добавляет аттрибут для HTML,::


но и добавляет валидатор `NotEmpty`, если прямо не указано, что он не нужен.
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Фильтры Zend лежат в
<!-- basicblock-start oid="Obsbb22Q9WsGm2nk2GtzXXU3"  deck='G_gettingstarted_tour-of-heroes' -->
Фильтры Zend лежат в::


Фильтры Zend лежат в [`/library/Zend/Filter`](../../../../library/Zend/Filter).
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Для очистки данных используются фильтры 
<!-- basicblock-start oid="ObsiJ95xj4Or0cTq8u8FJUGG"  deck='G_gettingstarted_tour-of-heroes' -->
Для очистки данных используются фильтры ::


`Zend_Filter_Interface`.
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Как выглядит простейшая форма добавления на php?
<!-- basicblock-start oid="ObsseBKUzt0FJLFGRoLUtBi6"  deck='G_gettingstarted_tour-of-heroes' -->
Как выглядит простейшая форма добавления на php?::


```
class HeroForm extends App_Form
{
    public function init()
    {
        parent::init();

        $this->addElement(
            new Zend_Form_Element_Text(
                'name',
                [
                    'required' => true,
                ]
            )
        );
    }
}
```
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Для чего используется AmdWindowComponent?
<!-- basicblock-start oid="ObsB4gYG626g5T4YCuhycn1A"  deck='G_gettingstarted_tour-of-heroes' -->
Для чего используется AmdWindowComponent?::


этот объект используется для управления модельным окном изнутри компонента-содержимого окна.
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Где нужно импортировать        AmdDatatableModule,        AmdIconModule,? почему?
<!-- basicblock-start oid="ObsKwhMnVGoRVx3y5jXkCTmP"  deck='G_gettingstarted_tour-of-heroes' -->
Где нужно импортировать        AmdDatatableModule,        AmdIconModule,? почему?::


в imports , а почему пока что хз
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Где находятся Общие глобальные компоненты typescript?
<!-- basicblock-start oid="ObsIZRpxgE2fHNSYibjDmOz0"  deck='G_gettingstarted_tour-of-heroes' -->
Где находятся Общие глобальные компоненты typescript?::


[/typescript/app/angular](../../../../typescript/app/angular)
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Что делает ng-disabled="newHero.$invalid"?
<!-- basicblock-start oid="ObsHtjzfJV0cHseYIsf5BekE"  deck='G_gettingstarted_tour-of-heroes' -->
Что делает ng-disabled="newHero.$invalid"?::


отключаем добавление, если форма не валидна
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Что делает `ng-model="newHeroName"`?
<!-- basicblock-start oid="ObsTFAM5prWLEbvGO5STJuLg"  deck='G_gettingstarted_tour-of-heroes' -->
Что делает `ng-model="newHeroName"`?::


- `ng-model="newHeroName"` - так же к scope-компонента привязывается значение инпута.
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Что делает `nf-form="newHero"`?
<!-- basicblock-start oid="ObsOT4OAZAreEHx1jOOkg4Fa"  deck='G_gettingstarted_tour-of-heroes' -->
Что делает `nf-form="newHero"`?::


- `nf-form="newHero"` - привязывает к scope-компонента форму по имени `newHero`
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# 0Для работы с сетью необходимо подключить модуль
<!-- basicblock-start oid="Obs7DM9laRFru1kbjDA2viVi"  deck='G_gettingstarted_tour-of-heroes' -->
0Для работы с сетью необходимо подключить модуль::


AmdCommonServiceModule
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Что можно сказать про IPromise?
<!-- basicblock-start oid="ObsICF3uuVrW2XfWTbcnGeVS"  deck='G_gettingstarted_tour-of-heroes' -->
Что можно сказать про IPromise?::


Для работы с асинхронными данными в angularJs используется своя реализация Promise, которая описана интерфейсом IPromise.
Создать IPromise можно через сервис angularJs $q.
Для доработки нашего сервиса необходимо:

внедрить в HeroService сервис $q
изменить метод getHeroes()
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Для того чтобы сервис HeroService был доступен для внедрения зависимостей необходимо сообщитьоб этом angularJs.
<!-- basicblock-start oid="ObsJ7jAXSsZGZnEsIoYbbHkz"  deck='G_gettingstarted_tour-of-heroes' -->
Для того чтобы сервис HeroService был доступен для внедрения зависимостей необходимо сообщитьоб этом angularJs.::


Используем декоратор @Injectable на классе сервиса. Благодаря ему мы можем регистрировать и использовать сервис по классу.
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Почему сервисы?
<!-- basicblock-start oid="ObsqYXwLjRxUGKuyERM6PPYY"  deck='G_gettingstarted_tour-of-heroes' -->
Почему сервисы?::


Компоненты не должны извлекать или сохранять данные напрямую, и они, конечно же, не должны сознательно предоставлять поддельные данные. Они должны сосредоточиться на отображении данных и делегировать доступ к данным сервису.

В этом руководстве вы создадите сервис HeroService, который смогут использовать все классы приложения для получения героев. Вместо того чтобы создавать этот сервис через конструктор, вы будете полагаться на внедрение зависимостей AngularJS, чтобы внедрить его в конструктор HeroesComponent.

Сервисы - отличный способ поделиться информацией между классами, которые не знают друг друга. Вы создадите MessageService и внедрите его в двух местах.

Внедрить в HeroService, который использует службу для отправки сообщения.
Внедрить в MessagesComponent, который отображает это сообщение, а также отображает идентификатор, когда пользователь нажимает на героя.
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Теперь надо передать в компоненте HeroesComponent selectedHero в компонент HeroDetailComponent.
<!-- basicblock-start oid="ObsMNcjFg9FRooPTGmnh5Jlo"  deck='G_gettingstarted_tour-of-heroes' -->
Теперь надо передать в компоненте HeroesComponent selectedHero в компонент HeroDetailComponent.::


Делается это через data-атрибуты в шаблоне:
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Чтобы ангуляр понимал Чтобы angularjs понимал, что можно передавать в компонент 
<!-- basicblock-start oid="ObsCd5KjJI5pHDmd5KVn8pbq"  deck='G_gettingstarted_tour-of-heroes' -->
Чтобы ангуляр понимал Чтобы angularjs понимал, что можно передавать в компонент ::


используется декоратор @Input.
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# О чем документ 3 тура героя?
<!-- basicblock-start oid="ObsL8agW8zjlViajZKgIqN02"  deck='G_gettingstarted_tour-of-heroes' -->
О чем документ 3 тура героя?::


Выделение детализации - с аргументами о том что по мере роста приложения будет труднее и труднее подерживать приложение при сохранении всех функций приложения в одном компоненте, поэтому нужно разделять
Шаблон
Добавление передачи героя в компонент
Итог

<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# О чем документ 2 тура героя?
<!-- basicblock-start oid="Obsq4TTvF42TG7XJChDlicqF"  deck='G_gettingstarted_tour-of-heroes' -->
О чем документ 2 тура героя?::


Создание mock-объекта списка героев
Отображение героев
Работа со списками с помощью ng-repeat
Добавление стилей
Подключение стилей
Просмотр информации по герою
Стилизация выбранного героя
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# О чем 1 документ тура героя?
<!-- basicblock-start oid="ObsfcgH8RwuonVN04iVzQWU2"  deck='G_gettingstarted_tour-of-heroes' -->
О чем 1 документ тура героя?::


Создание компонента
Добавление свойства
Отображение героя
Отображение рекдактора на странице
Создание типа героя
Форматтирование с uppercase filter
редактирование героя
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Как связать php и typescript?
<!-- basicblock-start oid="Obs0LotH49UmTjaKzCJJlUn6"  deck='G_gettingstarted_tour-of-heroes' -->
Как связать php и typescript?::


    public function indexAction()
    {
        $this->view->getRequire()->setDataMain('/js/app/application/tour-of-heroes/index/index/config');
    }
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# О чем 0  документ hero-tour?
<!-- basicblock-start oid="ObsY4JFn7bIIkPp1DsPHlFq8"  deck='G_gettingstarted_tour-of-heroes' -->
О чем 0  документ hero-tour?::


 Создание страницы - создание Zend модуля
 
```JS
class TourOfHeroes_Bootstrap extends Zend_Application_Module_Bootstrap
{
}
```

Инициализация заготовки на angularts
```bash
tour-of-heroes
    └── index
        └── index -- наша страница
            ├── component
            │   └── page.component.ts
            ├── config.ts
            └── page.module.ts
```

создание
config.ts
page.module.ts
page.component.ts
связка php и typescript

<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Как стилизовать выбранный элемент?
<!-- basicblock-start oid="ObsrKecGKYepAmBAcFUa0N09"  deck='G_gettingstarted_tour-of-heroes' -->
Как стилизовать выбранный элемент?::


 ng-class="{selected: $ctrl.selectedHero === hero}"

```
@Component({
    //...
    template: `
        ...
        <ul class="heroes">
          <li ng-repeat="hero in $ctrl.heroes"
            ng-click="$ctrl.onSelect(hero)"
            ng-class="{selected: $ctrl.selectedHero === hero}"
          >
            <span class="badge">{{$ctrl.hero.id}}</span> {{$ctrl.hero.name}}
          </li>
        </ul>
        ...
    `,
    //...
})
```
<!-- basicblock-end -->




#G_gettingstarted_tour-of-heroes
#gettingstarted_tour-of-heroes

#telegram 

# Что нужно сделать для появления стилей ?
<!-- basicblock-start oid="ObsmNLOMzbva9h99wMWsrFZ7"  deck='G_gettingstarted_tour-of-heroes' -->
Что нужно сделать для появления стилей ?::


Нужно создать файл scss/app/application/{наименование модуля}
Нужно создать файл /public/css/scss/app/application/{наименование модуля}/

Добавить в контроллер 
        $this->view->headLink()->appendCssFiles(['/css/scss/app/application/tour-of-heroes/index.css']);
<!-- basicblock-end -->



