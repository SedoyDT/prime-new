---
created: 2024-02-11T19:10:19 (UTC +03:00)
tags: []
source: https://www.yiiframework.com/doc/guide/2.0/ru/structure-modules
author: 
tags:
 - web
 - firefox
---
[[2024-02-11]]

# Структура приложения: Модули | Полное руководство по Yii 2.0 | Yii PHP Framework

> ## Excerpt
> Модули - это законченные программные блоки, состоящие из моделей, представлений, контроллеров и других вспомогательных компонентов. При установке модулей в приложение, конечный пользователь получает доступ к их контроллерам. По этой причине модули часто рассматриваются как миниатюрные приложения. В отличие от приложений, модули нельзя развертывать отдельно. Модули должны находиться внутри приложений.

---
## Модули

Модули - это законченные программные блоки, состоящие из [моделей](https://www.yiiframework.com/doc/guide/2.0/ru/structure-models), [представлений](https://www.yiiframework.com/doc/guide/2.0/ru/structure-views), [контроллеров](https://www.yiiframework.com/doc/guide/2.0/ru/structure-controllers) и других вспомогательных компонентов. При установке модулей в [приложение](https://www.yiiframework.com/doc/guide/2.0/ru/structure-applications), конечный пользователь получает доступ к их контроллерам. По этой причине модули часто рассматриваются как миниатюрные приложения. В отличие от [приложений](https://www.yiiframework.com/doc/guide/2.0/ru/structure-applications), модули нельзя развертывать отдельно. Модули должны находиться внутри приложений.

## Создание модулей

Модуль помещается в директорию, которая называется [базовым путем](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$basePath-detail) модуля. Так же как и в директории приложения, в этой директории существуют поддиректории `controllers`, `models`, `views` и другие, в которых размещаются контроллеры, модели, представления и другие элементы. В следующем примере показано примерное содержимое модуля:

```
forum/
    Module.php                   файл класса модуля
    controllers/                 содержит файлы классов контроллеров
        DefaultController.php    файл класса контроллера по умолчанию
    models/                      содержит файлы классов моделей
    views/                       содержит файлы представлений контроллеров и шаблонов
        layouts/                 содержит файлы представлений шаблонов
        <span>default</span>/                 содержит файлы представления контроллера DefaultController
            index.php            файл основного представления
```

### Классы модулей

Каждый модуль объявляется с помощью уникального класса, который наследуется от [yii\\base\\Module](https://www.yiiframework.com/doc/api/2.0/yii-base-module). Этот класс должен быть помещен в корне [базового пути](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$basePath-detail) модуля и поддерживать [автозагрузку](https://www.yiiframework.com/doc/guide/2.0/ru/concept-autoloading). Во время доступа к модулю будет создан один экземпляр соответствующего класса модуля. Как и [экземпляры приложения](https://www.yiiframework.com/doc/guide/2.0/ru/structure-applications), экземпляры модулей нужны, чтобы код модулей мог получить общий доступ к данным и компонентам.

Приведем пример того, как может выглядеть класс модуля:

```php
namespace app\modules\forum; class Module extends \yii\base\Module { public function init() { parent::init(); $this->params['foo'] = 'bar'; // ... остальной инициализирующий код ... } }
```

Если метод `init()` стал слишком громоздким из-за кода, который задает свойства модуля, эти свойства можно сохранить в виде [конфигурации](https://www.yiiframework.com/doc/guide/2.0/ru/concept-configurations), а затем загрузить в методе `init()` следующим образом:

```php
public function init() { parent::init(); // инициализация модуля с помощью конфигурации, загруженной из config.php \Yii::configure($this, require __DIR__ . '/config.php'); }
```

При этом в конфигурационном файле `config.php` может быть код следующего вида, аналогичный [конфигурации приложения](https://www.yiiframework.com/doc/guide/2.0/ru/structure-applications#application-configurations):

```php
<?php return [ 'components' => [ // список конфигураций компонентов ], 'params' => [ // список параметров ], ];
```

### Контроллеры в модулях

При создании контроллеров модуля принято помещать классы контроллеров в подпространство `controllers` пространства имён класса модуля. Это также подразумевает, что файлы классов контроллеров должны располагаться в директории `controllers` [базового пути](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$basePath-detail) модуля. Например, чтобы описать контроллер `post` в модуле `forum` из предыдущего примера, класс контроллера объявляется следующим образом:

```php
namespace app\modules\forum\controllers; use yii\web\Controller; class PostController extends Controller { // ... }
```

Изменить пространство имен классов контроллеров можно задав свойство [yii\\base\\Module::$controllerNamespace](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$controllerNamespace-detail). Если какие-либо контроллеры выпадают из этого пространства имен, доступ к ним можно осуществить, настроив свойство [yii\\base\\Module::$controllerMap](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$controllerMap-detail), аналогично тому, [как это делается в приложении](https://www.yiiframework.com/doc/guide/2.0/ru/structure-applications#controller-map).

### Представления в модулях

Представления модуля также следует поместить в поддиректорию `views` [базового пути](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$basePath-detail) модуля. Виды, которые рендерит контроллер модуля, должны располагаться в директории `views/ControllerID`, где `ControllerID` соответствует [идентификатору контроллера](https://www.yiiframework.com/doc/guide/2.0/ru/structure-controllers#routes). Например, если контроллер реализуется классом `PostController`, представления следует разместить в поддиректории `views/post` [базового пути](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$basePath-detail) модуля.

В модуле можно задать [шаблон](https://www.yiiframework.com/doc/guide/2.0/ru/structure-views#layouts), который будет использоваться для рендеринга всех представлений контроллерами модуля. По умолчанию шаблон помещается в директорию `views/layouts`, а свойство [yii\\base\\Module::$layout](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$layout-detail) должно указывать на имя этого шаблона. Если не задать свойство `layout`, модуль будет использовать шаблон, заданный в приложении.

### Консольные команды в модулях

Ваш модуль также может объявлять команды, которые будут доступны через [консоль](https://www.yiiframework.com/doc/guide/2.0/ru/tutorial-console).

Для того, чтобы команда стала доступна, надо изменить свойство [yii\\base\\Module::$controllerNamespace](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$controllerNamespace-detail) для консольного режима так, чтобы оно содержало пространство имён ваших команд.

Этого можно добиться проверяя класс экземпляра приложения Yii в методе `init` модуля:

```php
public function init() { parent::init(); if (Yii::$app instanceof \yii\console\Application) { $this->controllerNamespace = 'app\modules\forum\commands'; } }
```

Ваши команды будут доступны из командной строки как:

```
<span>yii <span>&lt;<span>module_id</span>&gt;</span>/<span>&lt;<span>command</span>&gt;</span>/<span>&lt;<span>sub_command</span>&gt;</span>
</span>
```

## Использование модулей

Чтобы задействовать модуль в приложении, достаточно включить его в свойство [modules](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$modules-detail) в конфигурации приложения. Следующий код в [конфигурации приложения](https://www.yiiframework.com/doc/guide/2.0/ru/structure-applications#application-configurations) задействует модуль `forum`:

```php
[ 'modules' => [ 'forum' => [ 'class' => 'app\modules\forum\Module', // ... другие настройки модуля ... ], ], ]
```

> **Информация:** Для подключения консольных команд вашего модуля, нужно также включить его в [конфигурации консольного приложения](https://www.yiiframework.com/doc/guide/2.0/ru/tutorial-console#configuration)

Свойству [modules](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$modules-detail) присваивается массив, содержащий конфигурацию модуля. Каждый ключ массива представляет собой _идентификатор модуля_, который однозначно определяет модуль среди других модулей приложения, а соответствующий массив - это [конфигурация](https://www.yiiframework.com/doc/guide/2.0/ru/concept-configurations) для создания модуля.

### Маршруты

Как маршруты приложения используются для обращения к контроллерам приложения, [маршруты](https://www.yiiframework.com/doc/guide/2.0/ru/structure-controllers#routes) модуля используются, чтобы обращаться к контроллерам этого модуля. Маршрут контроллера в модуле должен начинаться с идентификатора модуля, за которым следуют [идентификатор контроллера](https://www.yiiframework.com/doc/guide/2.0/ru/structure-controllers#controller-ids) и [идентификатор действия](https://www.yiiframework.com/doc/guide/2.0/ru/structure-controllers#action-ids). Например, если в приложении задействован модуль `forum`, то маршрут `forum/post/index` соответствует действию `index` контроллера `post` этого модуля. Если маршрут состоит только из идентификатора модуля, то контроллер и действие определяются исходя из свойства [yii\\base\\Module::$defaultRoute](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$defaultRoute-detail), которое по умолчанию равно `default`. Таким образом, маршрут `forum` соответствует контроллеру `default` модуля `forum`.

Правила в URL manager для модулей должны быть добавленны перед началом работы [yii\\web\\UrlManager::parseRequest()](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#parseRequest()-detail), что не позволяет размещать код добавления правил модуля в `init()`, так как инициализация происходит уже после обработки маршрутов. Таким образом, добавление маршрутов необходимо осуществить в [предзагрузке модуля](https://www.yiiframework.com/doc/guide/2.0/ru/structure-extensions#bootstrapping-classes). Хорошей практикой, также, будет объединение всех правил модуля при помощи [yii\\web\\GroupUrlRule](https://www.yiiframework.com/doc/api/2.0/yii-web-groupurlrule).

Если же вы используете модуль для [версионирования API](https://www.yiiframework.com/doc/guide/2.0/ru/rest-versioning), URL правила необходимо добавлять непосредственно в конфигурации `urlManager` приложения.

### Получение доступа к модулям

Зачастую внутри модуля может потребоваться доступ к экземпляру [класса модуля](https://www.yiiframework.com/doc/guide/2.0/ru/structure-modules#module-classes), через который получаются идентификатор модуля, его параметры, компоненты, и т. п. Это можно сделать с помощью следующей конструкции:

```php
$module = MyModuleClass::getInstance();
```

где `MyModuleClass` соответствует имени класса модуля, доступ к которому нужно получить. Метод `getInstance()` возвращает запрошенный в данный момент экземпляр класса модуля. Если модуль не запрошен, метод вернет `null`. Учтите, что обычно экземпляры класса модуля вручную не создаются, так как созданный вручную экземпляр будет отличаться от экземпляра, созданного Yii в качестве ответа на запрос.

> **Информация:** При разработке модуля нельзя исходить из предположения, что модулю будет назначен конкретный идентификатор. Это связано с тем, что идентификатор, назначаемый модулю при использовании в приложении или в другом модуле, может быть выбран совершенно произвольно. Чтобы получить идентификатор модуля, нужно вначале выбрать экземпляр модуля, как это описано выше, а затем получить доступ к идентификатору через свойство `$module->id`.

Доступ к экземпляру модуля можно получить следующими способами:

```php
// получение дочернего модуля с идентификатором "forum" $module = \Yii::$app->getModule('forum'); // получение модуля, к которому принадлежит запрошенный в настоящее время контроллер $module = \Yii::$app->controller->module;
```

Первый подход годится только если известен идентификатор модуля, а второй подход наиболее полезен, если известно, какой контроллер запрошен.

Имея экземпляр модуля можно получить доступ к параметрам и компонентам, зарегистрированным в модуле. Например,

```php
$maxPostCount = $module->params['maxPostCount'];
```

### Предзагрузка модулей

Может потребоваться запускать некоторые модули при каждом запросе. Модуль yii\\debug\\Module - один из таких модулей. Для этого список идентификаторов таких модулей необходимо указать в свойстве [bootstrap](https://www.yiiframework.com/doc/api/2.0/yii-base-application#bootstrap()-detail) приложения.

Например, следующая конфигурация приложения обеспечивает загрузку модуля `debug` при каждом запросе:

```php
[ 'bootstrap' => [ 'debug', ], 'modules' => [ 'debug' => 'yii\debug\Module', ], ]
```

## Вложенные модули

Модули могут вкладываться друг в друга без ограничений по глубине. Иными словами, в модуле содержится модуль, в который входит еще один модуль, и т. д. Первый модуль называется _родительским_, остальные - _дочерними_. Дочерние модули объявляются в свойстве [modules](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$modules-detail) родительских модулей. Например,

```php
namespace app\modules\forum; class Module extends \yii\base\Module { public function init() { parent::init(); $this->modules = [ 'admin' => [ // здесь имеет смысл использовать более лаконичное пространство имен 'class' => 'app\modules\forum\modules\admin\Module', ], ]; } }
```

Маршрут к контроллеру вложенного модуля должен содержать идентификаторы всех его предков. Например, маршрут `forum/admin/dashboard/index` соответствует действию `index` контроллера `dashboard` модуля `admin`, который в свою очередь является дочерним модулем модуля `forum`.

> **Информация:** Метод [getModule()](https://www.yiiframework.com/doc/api/2.0/yii-base-module#getModule()-detail) возвращает только те дочерние модули, которые принадлежат родительскому модулю непосредственно. В свойстве [yii\\base\\Application::$loadedModules](https://www.yiiframework.com/doc/api/2.0/yii-base-application#$loadedModules-detail) содержится список загруженных модулей, в том числе прямых и косвенных потомков, с индексированием по имени класса.

## Лучшие практики

Модули лучше всего подходят для крупных приложений, функционал которых можно разделить на несколько групп, в каждой из которых функции тесно связаны между собой. Каждая группа функций может разрабатываться в виде модуля, над которым работает один разработчик или одна команда.

Модули - это хороший способ повторно использовать код на уровне групп функций. В виде модулей можно реализовать такую функциональность, как управление пользователями или управление комментариями, а затем использовать эти модули в будущих разработках.
