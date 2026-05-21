
#G_gettingstarted
#gettingstarted

#telegram 

# Как работать с правами в angularTS?
<!-- basicblock-start oid="ObsaEm5D0ewKzHMWMnzU7H0I"  deck='G_gettingstarted' -->
Как работать с правами в angularTS?::


```
import {Inject} from "./component.decorator";
import AccessService, {AMD_ACCESS_SERVICE} from "./access.service";

@Module({
    providers: [
        {
            provide : AMD_ACCESS_SERVICE,
            useValue: new AccessService(mod.config().access)
        }]
})
export class ExampleModule
{
}

// ...
class PageComponent
{
    public constructor(
        @Inject(AMD_ACCESS_SERVICE) private accessService: AccessService
    )
    {
        console.log(this.accessService.getAccess('branch>subbranch>access').isAllowed());
    }
}
```

где `mod.config().access` - переданный объект прав из контроллера php

```TS
$this->view->access = [
   'branch' => [
       'subbranch' => [
           'access' => App_Access::get('all', "branch>subbranch"),
       ],
   ],
];
```
<!-- basicblock-end -->




#G_gettingstarted
#gettingstarted

#telegram 

# Как правильно использвать права в php?
<!-- basicblock-start oid="ObsN4MigHP6M3NkrkrSKLsPY"  deck='G_gettingstarted' -->
Как правильно использвать права в php?::


для работы с правами существует метод

App_Access::get('type', 'branch>subbranch>field')
основные типы:

key - возвращает значение без обработки, которое храниться в БД
access - приводит значение к bool
all - возвращает все значения, если это лист дерева, то просто значение, если ветка, то всю ветку
и др

\App\Access\Guard::assertEqual("analitics>cashproject>external_office", 1);

<!-- basicblock-end -->




#G_gettingstarted
#gettingstarted

#telegram 

# Что представляет из себя файл  с правами?
<!-- basicblock-start oid="Obsb6yZ98C9VhhaNPX9Mgt6K"  deck='G_gettingstarted' -->
Что представляет из себя файл  с правами?::




Файл представляет собой текстовый файл вида

# склад маркетплейс
ADD marketplaces>example BRANCH auto Маркетплейсы
ADD marketplaces>example>field ACCESS auto Поле с описанием
Где первая строка представляет собой комментарий и никак не обрабатывается, остальные строки разбираются на части:

команда
путь — путь с разделителем >
Тип права — Строка (BRANCH, ACCESS, CRUD) или id типа из /library/App/Access/Field/
порядок — auto — добавление в конец
Название права
Список типов прав можно посмотреть по пути /library/App/Access/Field/
<!-- basicblock-end -->




#G_gettingstarted
#gettingstarted

#telegram 

# Как работают права доступа? 
<!-- basicblock-start oid="ObsXKNZ3FYU1lImV8ItWTpuO"  deck='G_gettingstarted' -->
Как работают права доступа? ::


Файлы для импорта хранятся в папке: /tests/suites/default/tools/acl-export/access
Для импорта необходимо запустить скрипт:

```
php ./tests/suites/default/tools/acl-export/standalone.php <APPLICATION_ENV> <FILE_PATH>
amd-executor.sh php bin/devconsole.php stanok tests/suites/default/tools/acl-export/access/amd-1839.acl
```
<!-- basicblock-end -->




#G_gettingstarted
#gettingstarted

#telegram 

# Константы из таблиц
<!-- basicblock-start oid="ObsOkq7Y1hf9rQ0DeovPJc3v"  deck='G_gettingstarted' -->
Константы из таблиц::

Если в настройках таблицы указано, что она каталог и по ней необходимо генерировать список констант, то при запуске генерации (Админка > Эталонная база > "Константы таблиц") будут сгенерированы файлы:

PHP - класс в папке /library/App/Constant/Table App_Constant_Table_<TableName>
JS - файл в папке /public/js/constant/table/ /public/js/constant/table/tablename.js
TS - файл в папке /typescript/app/angular/generated/constant/table
создает enum EConstantTable<TableName>
создает angularjs модуль ConstantTable<TableName>Module c фильтром amd<TableName>
<!-- basicblock-end -->




#G_gettingstarted
#gettingstarted

#telegram 

# Как запустить генерацию TableList?
<!-- basicblock-start oid="ObsK3bwpOMOJG1woajPZiPK4"  deck='G_gettingstarted' -->
Как запустить генерацию TableList?::


Файл /library/App/Constant/TableList.php - генерируемый. Генерация запускается в Админка > Эталонная база > "Названия таблиц"
<!-- basicblock-end -->




#G_gettingstarted
#gettingstarted

#telegram 

# Список таблиц(константы) что скажешь?
<!-- basicblock-start oid="ObsEHeutHNsvHI1t3bLdT6wQ"  deck='G_gettingstarted' -->
Список таблиц(константы) что скажешь?::


Для каждой таблицы создается константа с именем таблицы вида define(DB_<TABLE_NAME>, TableName) в файле /library/App/Constant/TableList.php
<!-- basicblock-end -->




#G_gettingstarted
#gettingstarted

#telegram 

# Работа с базой (App_Db_::obtain)
<!-- basicblock-start oid="Obsrz8l6GZTN2x8bDVTkVPin"  deck='G_gettingstarted' -->
Работа с базой (App_Db_::obtain)::

Получение адаптера по умолчанию App_Db::get() (Zend_Db_Adapter_Abstract)
Для упрощения работы с таблицами БД для каждой таблицы создается класс:
App_Db_<TableName> extends App_Db_Abstract
App_Db_<TableName>::obtain() - возвращает объект для работы с таблицей (Zend_Db_Table_Abstract)
альтернативный путь App_Db::get(<TABLE_NAME_CONSTANT>)
<!-- basicblock-end -->




#G_gettingstarted
#gettingstarted

#telegram 

# Как произвести обновление из эталонной бд?
<!-- basicblock-start oid="Obs12quDRQEdY0HmPhXG6Uyo"  deck='G_gettingstarted' -->
Как произвести обновление из эталонной бд?::


админка-Управление системой-Эталонная база
форма сверху - обновление структуры
ссылка Обновление Mysql Stored Data - обновление функций, процедур, и тп
через адрес /system/
данные для входа http://report.amd-co.ru/staff/index.php?_m=tickets&_a=viewticket&ticketid=6300&departmentid=28&ticketstatusid=3
! Обновление продуктивов производится только через админку!
<!-- basicblock-end -->




#G_gettingstarted
#gettingstarted

#telegram 

# Чем обычные таблицы отличаются от католожных?
<!-- basicblock-start oid="Obsj0WcO7uadiinmscr1B9qW"  deck='G_gettingstarted' -->
Чем обычные таблицы отличаются от католожных?::


обычные
при обновлении обрабатывается только структура

каталоги
содержимое каталогов храниться в template-db и копируется при обновлении
в конфиге можно указать какие столбцы не стоить трогать
если по таблице необходимо генерировать константы, то необходимо добавить блок constant
<!-- basicblock-end -->




#G_gettingstarted
#gettingstarted

#telegram 

# Что можно сказать про table_example ?
<!-- basicblock-start oid="ObsML5pWUE1xIRuPGKddkes1"  deck='G_gettingstarted' -->
Что можно сказать про table_example ?::


;В этом файле содержатся описания директив для конфигов таблиц

;[config]
;catalog   => 0 - обычная, 1 = каталог. В таблицах-каталогах вместе со структурой таблицы проверяются также записи в таблице
;enable_delete => 0 - не удалять (по умолчанию), 1 - удалять записи
;notupdate => 1 - не обновлять таблицу из эталонной
;searchkey => Ключ по которому запись в каталоге-эталоне сравнивается на идентичность с записью в целевой БД.
;             Значения разделять символом запятая. Например searchkey = "id,title"

;[exceptions]
;ex1 = company_balance_start_saldo - пример поля
;Секция exceptions перечисляет поля-исключения, которые не будут участвовать при обновлении таблиц-каталогов
<!-- basicblock-end -->




#G_gettingstarted
#gettingstarted

#telegram 

# Куда загружать файлы
<!-- basicblock-start oid="ObsfCzx1XPZF5BSZshbycicB"  deck='G_gettingstarted' -->
Куда загружать файлы::

Временные файлы (пр.: файл выгрузок из банка)
/public/files/tmp
Запись логов
/public/files/tmp/log
Постоянные файлы
/public/uploads/<module>/<submodule>
пр.: /public/uploads/agreement
! тк пустые папки нельзя добавить в GIT, необходимо добавить в GIT файл .gitignore с содержимым:
*
!.gitignore
<!-- basicblock-end -->




#G_gettingstarted
#gettingstarted

#telegram 

# Конфиги делятся на два типа:
<!-- basicblock-start oid="ObsAOSUHSQWRGiBa2gveU1ts"  deck='G_gettingstarted' -->
Конфиги делятся на два типа:::


Общие (для всех проектов)
файлы /application/configs/*
файлы настроек templatedb /application/configs/templatedb
Конфиги проектов
файлы /application/configs/<projectDir>/*.
Например: конфиги проекта АВАНТПАК: /application/configs/amdco/*
Конфиги могут быть как зашиты в код (пр.: application.ini), так и нет ( пр.: dbconfig.ini). Для незашитых конфигов есть примеры заполнения <name>.example.<ext> для конфига <name>.<ext>.

Конфиги могут быть в виде ini или yaml файлов.

! Так как используется Zend_Config_Ini, что расширяет спецификацию ini-файла, следует помнить о наследовании секций.
Подробнее https://framework.zend.com/manual/1.12/ru/zend.config.adapters.ini.html
<!-- basicblock-end -->




#G_gettingstarted
#gettingstarted

#telegram 

# Где настройки templatedb?
<!-- basicblock-start oid="Obs046P3AAb7Wtcf0v6Po0gc"  deck='G_gettingstarted' -->
Где настройки templatedb?::



файлы настроек templatedb /application/configs/templa
<!-- basicblock-end -->




#G_gettingstarted
#gettingstarted

#telegram 

# Где находятся конфиги?
<!-- basicblock-start oid="Obsrrsu4EzTgyqY6daEWuvcf"  deck='G_gettingstarted' -->
Где находятся конфиги?::


/application/configs - расположение конфигов
<!-- basicblock-end -->



