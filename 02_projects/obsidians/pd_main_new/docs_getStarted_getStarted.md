## Где находятся конфиги  
  
[`/application/configs`](../../application/configs) - расположение конфигов  
  
Конфиги делятся на два типа:  
  
1. Общие (для всех проектов)  
   1. файлы [`/application/configs/*`](../../application/configs)  
   2. файлы настроек templatedb [`/application/configs/templatedb`](../../application/configs/templatedb)  
2. Конфиги проектов  
   3. файлы `/application/configs/<projectDir>/*`.    
       Например: конфиги проекта АВАНТПАК: [`/application/configs/amdco/*`](../../application/configs/amdco)  
  
Конфиги могут быть как зашиты в код (пр.: [`application.ini`](../../application/configs/application.ini)), так и нет (  
пр.: [`dbconfig.ini`](../../application/configs/dbconfig.ini)). Для незашитых конфигов есть примеры  
заполнения `<name>.example.<ext>` для конфига `<name>.<ext>`.  
  
Конфиги могут быть в виде `ini` или `yaml` файлов.  
  
**! Так как используется `Zend_Config_Ini`, что расширяет спецификацию ini-файла, следует помнить о наследовании  
секций.    
Подробнее [https://framework.zend.com/manual/1.12/ru/zend.config.adapters.ini.html](https://framework.zend.com/manual/1.12/ru/zend.config.adapters.ini.html)**  
  
## Куда загружать файлы  
  
1. Временные файлы (пр.: файл выгрузок из банка)    
   [`/public/files/tmp`](../../public/files/tmp)  
2. Запись логов    
   [`/public/files/tmp/log`](../../public/files/tmp/log)  
3. Постоянные файлы    
   `/public/uploads/<module>/<submodule>`  
    - пр.: [`/public/uploads/agreement`](../../public/uploads/agreement)  
   - ! тк пустые папки нельзя добавить в GIT, необходимо добавить в GIT файл `.gitignore` с содержимым:  
        ```gitignore  
        *  
        !.gitignore  
        ```  
## Иерархия каталогов (классов)  
  
Документация по Zend MVC  
1 [https://framework.zend.com/manual/1.12/en/learning.quickstart.html](https://framework.zend.com/manual/1.12/en/learning.quickstart.html)  
  
### Основные моменты Zend MVC:  
  
1. основной каталог приложения [`application`](../../application)  
2. модули лежат в каталоге [`modules`](../../application/modules)  
   1. папка модуля именуется в `kebab-case`  
    1. в папке модуля должен находится файл `Bootstrap.php`(`<module-dir>/Bootstrap.php`) с классом  
        ```php  
        <ModuleDir>_Bootstrap.php extends Zend_Application_Module_Bootstrap  
        ```  
Пр.: [application/modules/access/Bootstrap.php](../../application/modules/access/Bootstrap.php)  
  
3. Наименование классов что-то среднее между `PSR-0` и магией  
4. Загрузчик классов ZF меняет часть имени классов на псевдонимы:  
    2. `Model => models`  
        1. `ExampleModule_Model_User` будет искать по пути `/application/modules/example-module/models/User.php`  
        1.        Пр.: [`Cash_Model_Abstract => /application/modules/cash/models/Abstract.php`](../../application/modules/cash/models/Abstract.php)  
    3. `Controller => controllers`  
        1. `ExampleModule_UserController` будет искать по  
           пути `/application/modules/example-module/controllers/UserController.php`  
        1.        Пр.: [`Cash_CashController => /application/modules/cash/controllers/CashController.php`](../../application/modules/cash/controllers/CashController.php)  
    4. `Form => forms`  
        1. `ExampleModule_Form_User` будет искать по пути `/application/modules/example-module/forms/User.php`  
        1.        Пр.: [`Cash_Form_Abstract => /application/modules/cash/forms/Abstract.php`](../../application/modules/cash/forms/Abstract.php)  
   5. возможно существуют и другие  
  
**Обработка URL**  
  
Если маршрут специально не описан в конфиге [`routers.ini`](../../application/configs/routes.ini) или не добавлен в  
файлах `Bootstrap.php`, то диспетчер ZF будет искать обработчик по пути `/<module>/<controller>/[action=index]`.  
Если `controller` содержит `_`, то путь будет обработан согласно `PSR-0`  
  
Пр.:  
  
1. [`/claim/main/show => Claim_MainController::showAction`](../../application/modules/claim/controllers/MainController.php)  
1. [`/libdoc/ajax_offers_type1/get-actual-data => Libdoc_Ajax_Offers_Type1Controller::getActualDataAction`](../../application/modules/libdoc/controllers/Ajax/Offers/Type1Controller.php)  
  
### Библиотеки и логика  
  
1. Внешние библиотеки (Zend, Composer, Pear, PHPExcel) и часть логики находится по пути [`/library`](../../library)  
2. Часть логики приложения находится в папке [`/library/App`](../../library/App)  
   1. в этой папке можно использовать наименование классов PSR-4 c корнем `/library`  
    2. пр: `\App\Example\ConcreteClass => /library/App/Example/ConcreteClass.php`  
  
## Template-db  
  
1. Наименование таблиц, полей таблиц идет в виде snake_case  
2. все таблицы имеют настройки в [`/application/configs/templatedb/tables`](../../application/configs/templatedb/tables)  
3. пример  
   конфига [`/application/configs/templatedb/tables/0_TABLE_EXAMPLE.ini`](../../application/configs/templatedb/tables/0_TABLE_EXAMPLE.ini)  
4. типы таблиц:  
   1. обычные  
       1. при обновлении обрабатывается только структура  
   2. каталоги  
       2. содержимое каталогов храниться в template-db и копируется при обновлении  
       3. в конфиге можно указать какие столбцы не стоить трогать  
       4. если по таблице необходимо генерировать константы, то необходимо добавить блок constant  
5. настройки с чем будет происходить сверка находится в  
   конфиге [`/application/configs/templatedb/dbfrom.ini`](../../application/configs/templatedb/dbfrom.ini)  
6. Запуск обновления можно произвести из:  
   3. админка-Управление системой-Эталонная база  
       5. форма сверху - обновление структуры  
       6. ссылка Обновление Mysql Stored Data - обновление функций, процедур, и тп  
   4. через адрес `/system/`  
        7. данные для  
           входа [http://report.amd-co.ru/staff/index.php?_m=tickets&_a=viewticket&ticketid=6300&departmentid=28&ticketstatusid=3](http://report.amd-co.ru/staff/index.php?_m=tickets&_a=viewticket&ticketid=6300&departmentid=28&ticketstatusid=3)  
    5. **! Обновление продуктивов производится только через админку!**  
  
## Работа с базой (App_Db_::obtain)  
  
1. Получение адаптера по умолчанию `App_Db::get()` (`Zend_Db_Adapter_Abstract`)  
2. Для упрощения работы с таблицами БД для каждой таблицы создается класс:  
    ```php  
    App_Db_<TableName> extends App_Db_Abstract  
    ```3. `App_Db_<TableName>::obtain()` - возвращает объект для работы с таблицей (`Zend_Db_Table_Abstract`)  
   1. альтернативный путь `App_Db::get(<TABLE_NAME_CONSTANT>)`  
  
## Константы  
  
### Список таблиц  
  
Для каждой таблицы создается константа с именем таблицы вида `define(DB_<TABLE_NAME>, TableName)` в  
файле [`/library/App/Constant/TableList.php`](old/177/library/App/Constant/TableList.php)  
  
Файл [`/library/App/Constant/TableList.php`](old/177/library/App/Constant/TableList.php) - генерируемый. Генерация  
запускается в `Админка > Эталонная база > "Названия таблиц"`  
  
### Константы из таблиц  
  
Если в настройках таблицы указано, что она каталог и по ней необходимо генерировать список констант, то при запуске  
генерации (`Админка > Эталонная база > "Константы таблиц"`) будут сгенерированы файлы:  
  
1. PHP - класс в папке [`/library/App/Constant/Table`](../../library/App/Constant/Table) `App_Constant_Table_<TableName>`  
2. JS - файл в  
   папке [`/public/js/constant/table/`](../../public/js/constant/table/) `/public/js/constant/table/tablename.js`  
3. TS - файл в  
   папке [`/typescript/app/angular/generated/constant/table`](../../typescript/app/angular/generated/constant/table)  
   1. создает `enum EConstantTable<TableName>`  
    2. создает angularjs модуль `ConstantTable<TableName>Module` c фильтром `amd<TableName>`  
  
## Как работают права доступа (включая aclchanges)  
  
В системе для разграничения доступа существуют права доступа. Права имеют древовидную структуру.  
  
### Добавление  
  
Добавление происходит через импорт из файлов. Заливка на проекты происходит в два этапа:  
  
1. импорт из файла на проект ns25.ru  
1. копирование прав с проекта ns25.ru на остальные  
  
Файлы для импорта хранятся в папке: [`/tests/suites/default/tools/acl-export/access`](../../tests/suites/default/tools/acl-export/access)    
Для импорта необходимо запустить скрипт:  
```shell  
php ./tests/suites/default/tools/acl-export/standalone.php <APPLICATION_ENV> <FILE_PATH>  
```  
где:  
- `APPLICATION_ENV` - проект  
- `FILE_PATH` - путь к файлу относительно папки `/tests/suites/default/tools/acl-export/access`  
  
Файл представляет собой текстовый файл вида  
  
```amdacl  
# склад маркетплейс  
ADD marketplaces>example BRANCH auto Маркетплейсы  
ADD marketplaces>example>field ACCESS auto Поле с описанием  
```  
  
Где первая строка представляет собой комментарий и никак не обрабатывается, остальные строки разбираются на части:  
  
1. команда  
2. путь — путь с разделителем `>`  
3. Тип права — Строка (`BRANCH`, `ACCESS`, `CRUD`)  
   или id типа из [`/library/App/Access/Field/`](../../library/App/Access/Field)  
4. порядок — `auto` — добавление в конец  
5. Название права  
  
Список типов прав можно посмотреть по пути [`/library/App/Access/Field/`](../../library/App/Access/Field)  
  
### Выставление прав  
  
Права назначаются роли или пользователю. Права пользователя перебивают права его роли.  
  
`Админка > Права доступа`  
  
### Использование  
  
#### PHP  
  
для работы с правами существует метод  
  
```php App_Access::get('type', 'branch>subbranch>field')  
```  
  
основные типы:  
  
1. **key** - возвращает значение без обработки, которое храниться в БД  
2. **access** - приводит значение к bool  
3. **all** - возвращает все значения, если это лист дерева, то просто значение, если ветка, то всю ветку  
4. и др  
  
#### AngularTS  
  
для работы с правами можно инициализировать объект:  
  
```ts  
import {Inject} from "./component.decorator";  
import AccessService, {AMD_ACCESS_SERVICE} from "./access.service";  
  
@Module({  
    providers: [        {            provide : AMD_ACCESS_SERVICE,            useValue: new AccessService(mod.config().access)        }]})  
export class ExampleModule  
{  
}  
  
// ...  
class PageComponent  
{  
    public constructor(        @Inject(AMD_ACCESS_SERVICE) private accessService: AccessService    )    {        console.log(this.accessService.getAccess('branch>subbranch>access').isAllowed());    }}  
```  
  
где `mod.config().access` - переданный объект прав из контроллера php  
  
```php  
$this->view->access = [   'branch' => [       'subbranch' => [           'access' => App_Access::get('all', "branch>subbranch"),  
       ],   ],];  
```  
  
## Компоненты  
[Список компонентов](../Components)    
Начальный файл GetStarted.md  
  
## Typescript  
[Офф. документация](https://www.typescriptlang.org/docs/handbook/intro.html)  
  
[примеры с типами](../Frontend/Typescript/type-examples.md)  
  
## AngularTS  
[Документация](../Frontend/AngularTS/GetStarted.md)  
  
  
## Где находится инструкция к модулям  
  
?  
  
## Какой кодогенератор существует  
  
1. [Кодогенератор Вовчека](https://docs.google.com/document/d/16qRYJrvrf9gyEec96Qf7J5P8YyZpX2onRErCjKQbTlY/edit)  
  
## Работа с кроном  
  
1. [Описание Управление списком кронов](https://docs.google.com/document/d/1ELbTjs_6fPFbPLmD9pbB1TwbUEDVZWEppntiAWCgPhU/edit#)  
  
## Загрузка файлов (по умолчанию)  
  
?  
  
## Backuper  
  
[документация](../Utils/BackupDownloader.md)  
  
## Puller  
  
[документация](../Utils/Puller.md)  
  
## Стиль кода  
  
[документация](../CodeStyles)  
  
## Правила работы