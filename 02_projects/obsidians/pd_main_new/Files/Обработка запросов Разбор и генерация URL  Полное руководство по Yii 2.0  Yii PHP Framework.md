---
created: 2024-02-17T19:38:16 (UTC +03:00)
tags: []
source: https://www.yiiframework.com/doc/guide/2.0/ru/runtime-routing
author: 
tags:
 - web
 - firefox
---
[[books/2024-02-17]]

# Обработка запросов: Разбор и генерация URL | Полное руководство по Yii 2.0 | Yii PHP Framework

> ## Excerpt
> При обработке запрошенного URL, Yii приложение первым делом разбирает URL в маршрут. Полученный маршрут используется при создании
соответствующего экземпляра действия контроллера для обработки запроса. Этот процесс называется роутинг.

---
При обработке запрошенного URL, Yii приложение первым делом разбирает URL в [маршрут](https://www.yiiframework.com/doc/guide/2.0/ru/structure-controllers#marsruty). Полученный маршрут используется при создании соответствующего экземпляра действия контроллера для обработки запроса. Этот процесс называется _роутинг_.

Обратный роутингу процесс называется _Создание URL_, он отвечает за создание URL из заданного маршрута и соответствующих параметров запроса. При необходимости, созданный URL всегда может быть преобразован в первоначальные маршрут и параметры запроса.

В основе роутинга и создания URL лежит использование [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager), зарегистрированного в качестве [компонента приложения](https://www.yiiframework.com/doc/guide/2.0/ru/structure-application-components) `urlManager`. [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager) содержит метод [parseRequest()](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#parseRequest()-detail) для разбора входящего запроса на маршрут и параметры запроса, и метод [createUrl()](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#createUrl()-detail) для создания URL из заданного маршрута и параметров запроса.

Настройка компонента `urlManager` в конфигурации приложения, позволяет приложению распознавать различные форматы URL без внесения изменений в существующий код приложения. Например, для создания URL для действия `post/view`, можно использовать следующий код:

```php
use yii\helpers\Url; // Url::to() вызывает UrlManager::createUrl() для создания URL $url = Url::to(['post/view', 'id' => 100]);
```

В зависимости от настройки `urlManager`, URL может быть создан в одном из следующих форматов (или любом другом формате). При последующем запросе URL в таком формате, он будет разобран на исходные маршрут и параметры запроса.

```
/index.php?r=post/view&amp;id=100
/index.php/post/100
/post/100
```

## Форматы URL

[URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager) поддерживает два формата URL:

-   Обычный.
-   Человекопонятные URL.

Обычный формат URL использует параметр `r` для передачи маршрута и любые другие параметры для передачи остальных параметров запроса. Например, URL `/index.php?r=post/view&id=100` задает маршрут `post/view` и параметр `id`, равный 100. Данный формат не требует специальной конфигурации [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager) и работает с любыми настройками веб-сервера.

Человекопонятный формат URL представляет собой дополнительный путь, следующий за именем входного скрипта, описывающий маршрут и остальные параметров запроса. Например, дополнительный путь в URL `/index.php/post/100` - это `/post/100`, который может представлять маршрут `post/view` и параметр `id` со значением равным 100, при наличии соответствующего [правила](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$rules-detail). Для использования ЧПУ, необходимо создать набор правил, соответствующих требованиям к URL.

Переключение между двумя форматами URL осуществляется при помощи свойства [enablePrettyUrl](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$enablePrettyUrl-detail) компонента [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager) без внесения изменений в код приложения.

## Роутинг

Роутинг осуществляется в два этапа:

-   Входящий запрос разбирается в маршрут и параметры запроса.
-   Для обработки запроса создается [действие контроллера](https://www.yiiframework.com/doc/guide/2.0/ru/structure-controllers#actions), соответствующее полученному маршруту.

При использовании простого формата URL, получение маршрута из запроса заключается в получении параметра `r` из массива `GET`.

При использовании ЧПУ, компонент [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager) ищет среди зарегистрированных [правил](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$rules-detail) подходящее для разрешения запроса в маршрут. Если такое правило не найдено, вызывается исключение [yii\\web\\NotFoundHttpException](https://www.yiiframework.com/doc/api/2.0/yii-web-notfoundhttpexception).

После того, как из запроса получен маршрут, самое время создать действие контроллера, соответствующее этому маршруту. Маршрут разделяется на несколько частей, метками деления служат прямые слеши. Например, маршрут `site/index` будет разделен на `site` и `index`. Каждая из частей представляет собой _идентификатор_, который может ссылаться на модуль, контроллер или действие. Начиная с первой части маршрута, приложение следует следующему алгоритму для создания модуля (если есть), контроллера и действия:

1.  Текущим модулем считаем приложение.
2.  Проверяем, содержит ли [карта контроллеров](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$controllerMap-detail) текущего модуля текущий _идентификатор_. Если содержит, в соответствии с конфигурацией контроллера, найденной в карте, создаем объект контроллера и переходим в п. 5 для обработки оставшейся части маршрута.
3.  Проверяем, есть ли модуль, соответствующий _идентификатору_ в списке модулей (свойство [modules](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$modules-detail)) текущего модуля. Если есть, в соответствии с конфигурацией модуля, найденной в списке модулей, создаем модуль и переходим в п. 2, считая только что созданный модуль текущим.
4.  Рассматриваем _идентификатор_ как [идентификатор контроллера](https://www.yiiframework.com/doc/guide/2.0/ru/structure-controllers#id-kontrollerov) и создаем объект контроллера. Для оставшейся части маршрута выполняем п. 5.
5.  Контроллер ищет текущий _идентификатор_ в его [карте действий](https://www.yiiframework.com/doc/api/2.0/yii-base-controller#actions()-detail). В случае нахождения, контроллер создает действие, в соответствии с конфигурацией, найденной в карте. Иначе, контроллер пытается создать встроенное действие, описанное методом, соответствующим текущему [идентификатору действия](https://www.yiiframework.com/doc/guide/2.0/ru/structure-controllers#id-dejstvij).

При возникновении ошибок на любом из описанных выше этапов, вызывается исключение [yii\\web\\NotFoundHttpException](https://www.yiiframework.com/doc/api/2.0/yii-web-notfoundhttpexception), указывающее на ошибку в процессе роутинга.

### Маршрут по умолчанию

В случае, если в результате разбора запроса получен пустой маршрут, вместо него будет использован, так называемый, маршрут по умолчанию. Изначально, маршрут по умолчанию имеет значение `site/index`, и указывает на действие `index` контроллера `site`. Указать свое значение можно при помощи свойства приложения [defaultRoute](https://www.yiiframework.com/doc/api/2.0/yii-web-application#$defaultRoute-detail), например так:

```php
[ // ... 'defaultRoute' => 'main/index', ];
```

В добавок к маршруту по умолчанию приложения, существует маршрут по умолчанию модулей. Например, если у нас есть модуль `user` и запрос разбирается в маршрут `user`, [defaultRoute](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$defaultRoute-detail) модуля используется для определения контроллера. По умолчанию имя контроллера —`default`. Если действие не задано в [defaultRoute](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$defaultRoute-detail), то для его определения используется свойство [defaultAction](https://www.yiiframework.com/doc/api/2.0/yii-base-controller#$defaultAction-detail) контроллера. В данном примере полный маршрут будет `user/default/index`.

### Маршрут `catchAll`

Иногда возникает необходимость временно перевести приложение в режим обслуживания и отображать одно информационное сообщение для всех запросов. Существует много вариантов реализации этой задачи. Но одним из самых простых, является использование свойства [yii\\web\\Application::$catchAll](https://www.yiiframework.com/doc/api/2.0/yii-web-application#$catchAll-detail), например так:

```php
[ // ... 'catchAll' => ['site/offline'], ];
```

В данном случае, действие `site/offline` будет обрабатывать все входящие запросы.

Свойство `catchAll` должно принимать массив, первый элемент которого определяет маршрут, а остальные элементы (пары ключ-значение) определяют параметры, [передаваемые действию](https://www.yiiframework.com/doc/guide/2.0/ru/structure-controllers#parametry-dejstvij).

## Создание URL

Для создания разных видов URL из заданных маршрутов и параметров, Yii предоставляет метод-помощник [yii\\helpers\\Url::to()](https://www.yiiframework.com/doc/api/2.0/yii-helpers-baseurl#to()-detail). Примеры:

```php
use yii\helpers\Url; // создает URL для маршрута: /index.php?r=post/index echo Url::to(['post/index']); // создает URL для маршрута с параметрами: /index.php?r=post/view&id=100 echo Url::to(['post/view', 'id' => 100]); // создает якорный URL: /index.php?r=post/view&id=100#content echo Url::to(['post/view', 'id' => 100, '#' => 'content']); // создает абсолютный URL: https://www.example.com/index.php?r=post/index echo Url::to(['post/index'], true); // создает абсолютный URL с использованием схемы https: https://www.example.com/index.php?r=post/index echo Url::to(['post/index'], 'https');
```

Обратите внимание, что в последнем примере подразумевается использование обычного формата URL. При использовании ЧПУ, будут созданы другие URL, соответствующие [правилам создания URL](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$rules-detail).

Маршрут, переданный методу [yii\\helpers\\Url::to()](https://www.yiiframework.com/doc/api/2.0/yii-helpers-baseurl#to()-detail), является контекстно-зависимым. Он может быть _относительным_ или _абсолютным_, в зависимости от следующих правил:

-   Если маршрут является пустой строкой, будет использован текущий [маршрут](https://www.yiiframework.com/doc/api/2.0/yii-base-controller#$route-detail);
-   Если маршрут не содержит слешей вообще, он рассматривается как _идентификатор_ действия текущего контроллера и будет дополнен значением [uniqueId](https://www.yiiframework.com/doc/api/2.0/yii-base-controller#$uniqueId-detail) текущего контроллера в качестве префикса;
-   Если маршрут не содержит слеша в начале, он будет рассматриваться как маршрут относительно текущего модуля и будет дополнен значением [uniqueId](https://www.yiiframework.com/doc/api/2.0/yii-base-module#$uniqueId-detail) текущего модуля, в качестве префикса.

Начиная с версии 2.0.2, при составлении маршрутов, стало возможным использовать [псевдонимы](https://www.yiiframework.com/doc/guide/2.0/ru/concept-aliases). В таком случае, псевдоним будет преобразован в маршрут, который будет использован для создания URL по правилам, указанным выше.

Для примера, будем считать, что текущим модулем является `admin`, а текущим контроллером - `post`,

```php
use yii\helpers\Url; // запрошенный маршрут: /index.php?r=admin/post/index echo Url::to(['']); // относительный маршрут с указанием только идентификатора действия: /index.php?r=admin/post/index echo Url::to(['index']); // относительный маршрут: /index.php?r=admin/post/index echo Url::to(['post/index']); // абсолютный маршрут: /index.php?r=post/index echo Url::to(['/post/index']); // /index.php?r=post/index псевдоним "@posts" определен как "/post/index" echo Url::to(['@posts']);
```

В основе реализации метода [yii\\helpers\\Url::to()](https://www.yiiframework.com/doc/api/2.0/yii-helpers-baseurl#to()-detail) лежит использование двух методов компонента [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager): [createUrl()](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#createUrl()-detail) и [createAbsoluteUrl()](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#createAbsoluteUrl()-detail). Ниже будут рассмотрены способы конфигурации [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager) для создания URL в различных форматах.

Метод [yii\\helpers\\Url::to()](https://www.yiiframework.com/doc/api/2.0/yii-helpers-baseurl#to()-detail) также поддерживает создание URL, не связанных с маршрутами приложения. В данном случае, нужно передать в качестве первого параметра строку, а не массив. Например,

```php
use yii\helpers\Url; // запрошенный URL: /index.php?r=admin/post/index echo Url::to(); // URL из псевдонима: https://example.com Yii::setAlias('@example', 'https://example.com/'); echo Url::to('@example'); // абсолютный URL: https://example.com/images/logo.gif echo Url::to('/images/logo.gif', true);
```

Кроме метода `to()`, класс [yii\\helpers\\Url](https://www.yiiframework.com/doc/api/2.0/yii-helpers-url) предоставляет и другие удобные методы для создания URL. Например,

```php
use yii\helpers\Url; // домашний URL: /index.php?r=site/index echo Url::home(); // базовый URL, удобно использовать в случае, когда приложение расположено в подкаталоге // относительно корневого каталога веб-сервера echo Url::base(); // канонический URL запрошенного URL // подробнее https://support.google.com/webmasters/answer/139066?hl=ru echo Url::canonical(); // запомнить запрошенный URL и восстановить его при следующих запросах Url::remember(); echo Url::previous();
```

## Использование человекопонятных URL

Для активации ЧПУ, необходимо настроить компонент `urlManager` в конфигурации приложения следующим образом:

```php
[ 'components' => [ 'urlManager' => [ 'enablePrettyUrl' => true, 'showScriptName' => false, 'enableStrictParsing' => false, 'rules' => [ // ... ], ], ], ]
```

Свойство [enablePrettyUrl](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$enablePrettyUrl-detail) является ключевым, активирует формат ЧПУ. Остальные свойства необязательные. Однако в примере выше показан самый популярный вариант конфигурации ЧПУ.

-   [showScriptName](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$showScriptName-detail): это свойство определяет необходимость включения имени входного скрипта в создаваемый URL. Например, при его значении `false`, вместо `/index.php/post/100`, будет сгенерирован URL `/post/100`.
-   [enableStrictParsing](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$enableStrictParsing-detail): это свойство позволяет включить строгий разбор URL. Если строгий разбор URL включен, запрошенный URL должен соответствовать хотя бы одному из [правил](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$rules-detail), иначе будет вызвано исключение [yii\\web\\NotFoundHttpException](https://www.yiiframework.com/doc/api/2.0/yii-web-notfoundhttpexception). Если строгий разбор URL отключен и ни одно из [правил](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$rules-detail) не подходит для разбора запрошенного URL, часть этого URL, представляющая путь, будет использована как маршрут.
-   [rules](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$rules-detail): это свойство содержит набор правил для разбора и создания URL. Это основное свойство, с которым нужно работать, чтобы URL создавались в формате, соответствующем требованиям приложения.

> **Примечание:** Для того, чтобы скрыть имя входного скрипта в создаваемых URL, кроме установки значения свойства [showScriptName](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$showScriptName-detail) в `false`, необходимо настроить веб-сервер, чтобы он мог правильно определять PHP-скрипт, который должен быть запущен, если в запрошенном URL он не указан явно. Рекомендованные настройки для Apache и Nginx описаны в разделе [Установка Yii](https://www.yiiframework.com/doc/guide/2.0/ru/start-installation#rekomenduemye-nastrojki-apache).

### Правила URL

Правила URL - это экземпляр класса [yii\\web\\UrlRule](https://www.yiiframework.com/doc/api/2.0/yii-web-urlrule) или класса, унаследованного от него. Каждое правило состоит из шаблона, используемого для поиска пути в запрошенном URL, маршрута и нескольких параметров запроса. Правило может быть использовано для разбора запроса в том случае, если шаблон правила совпадает с запрошенным URL. Правило может быть использовано для создания URL в том случае, если его маршрут и параметры запроса совпадают с заданными.

При включенном режиме ЧПУ, компонент [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager) использует правила URL, содержащиеся в его свойстве [rules](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$rules-detail), для разбора входящих запросов и создания URL. Обычно, при разборе входящего запроса, [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager) проверяет все правила в порядке их следования, до _первого_ правила, соответствующего запрошенному URL. Найденное правило используется для разбора URL на маршрут и параметры запроса. Аналогично для создания URL компонент [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager) ищет первое правило, соответствующее заданному маршруту и параметрам и использует его для создания URL.

[Правила](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$rules-detail) задаются ассоциативным массивом, где ключи определяют шаблоны, а значения соответствующие маршруты. Каждая пара шаблон-маршрут составляет правило разбора URL. Например, следующие [правила](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$rules-detail) определяют два правила разбора URL. Первое правило задает соответствие URL `posts` маршруту `post/index`. Второе правило задает соответствие URL, соответствующего регулярному выражению `post/(\d+)` маршруту `post/view` и параметру `id`.

```php
[ 'posts' => 'post/index', 'post/<id:\d+>' => 'post/view', ]
```

> **Примечание:** Шаблон правила используется для поиска соответствия с частью URL, определяющей путь. Например, в URL `/index.php/post/100?source=ad` путь определяет часть `post/100` (начальный и конечный слеши игнорируются), соответствующая регулярному выражению `post/(\d+)`.

Правила URL можно определять не только в виде пар шаблон-маршрут, но и в виде массива. Каждый массив используется для определения одного правила. Такой вид определения правил используется в случаях, когда необходимо указать другие параметры правила URL. Например,

```php
[ // ...другие правила URL... [ 'pattern' => 'posts', 'route' => 'post/index', 'suffix' => '.json', ], ]
```

По умолчанию, если в конфигурации правила URL не указан явно параметр `class`, будет создано правило класса [yii\\web\\UrlRule](https://www.yiiframework.com/doc/api/2.0/yii-web-urlrule).

### Именованные параметры

Правило URL может содержать несколько именованных параметров запроса, которые указываются в шаблоне в следующем формате: `<ParamName:RegExp>`, где `ParamName` определяет имя параметра, а `RegExp` - необязательное регулярное выражение, используемое для определения значения параметра. В случае, если `RegExp` не указан, значением параметра будет любая последовательность символов кроме слешей.

> **Примечание:** Возможно указание только регулярного выражения для параметров. В таком случае остальная часть шаблона будет считаться простым текстом.

После разбора URL, параметры запроса, соответствующие шаблону правила, будут доступны в массиве `$_GET` через компонент приложения `request`. При создании URL, значения указанных параметров будут вставлены в URL в соответствии с шаблоном правила.

Рассмотрим несколько примеров работы с именованными параметрами. Допустим, мы определили следующие три правила URL:

```php
[ 'posts/<year:\d{4}>/<category>' => 'post/index', 'posts' => 'post/index', 'post/<id:\d+>' => 'post/view', ]
```

При разборе следующих URL:

-   `/index.php/posts` будет разобран в маршрут `post/index` при помощи второго правила;
-   `/index.php/posts/2014/php` будет разобран на маршрут `post/index` и параметры `year` со значением 2014, `category` со значением `php` при помощи первого правила;
-   `/index.php/post/100` будет разобран на маршрут `post/view` и параметр `id` со значением 100 при помощи третьего правила;
-   `/index.php/posts/php` вызовет исключение [yii\\web\\NotFoundHttpException](https://www.yiiframework.com/doc/api/2.0/yii-web-notfoundhttpexception), если [yii\\web\\UrlManager::$enableStrictParsing](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$enableStrictParsing-detail) имеет значение `true`, так как правило для разбора данного URL отсутствует. Если [yii\\web\\UrlManager::$enableStrictParsing](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$enableStrictParsing-detail) имеет значение `false` (по умолчанию), значение `posts/php` будет возвращено в качестве маршрута.

При создании URL:

-   `Url::to(['post/index'])` создаст `/index.php/posts` при помощи второго правила;
-   `Url::to(['post/index', 'year' => 2014, 'category' => 'php'])` создаст `/index.php/posts/2014/php` при помощи первого правила;
-   `Url::to(['post/view', 'id' => 100])` создаст `/index.php/post/100` при помощи третьего правила;
-   `Url::to(['post/view', 'id' => 100, 'source' => 'ad'])` создаст `/index.php/post/100?source=ad` при помощи третьего правила. Параметр `source` не указан в правиле, поэтому он добавлен в созданный URL в качестве параметра запроса.
-   `Url::to(['post/index', 'category' => 'php'])` создаст `/index.php/post/index?category=php` без использования правил. При отсутствии подходящего правила, URL будет создан простым соединением маршрута, как части пути, и параметров, как части запроса.

### Параметры в маршрутах

В маршруте правила URL возможно указание имен параметров. Это позволяет использовать правило URL для обработки нескольких маршрутов. Например, следующие правила содержат параметры `controller` и `action` в маршрутах.

```php
[ '<controller:(post|comment)>/<id:\d+>/<action:(create|update|delete)>' => '<controller>/<action>', '<controller:(post|comment)>/<id:\d+>' => '<controller>/view', '<controller:(post|comment)>s' => '<controller>/index', ]
```

Для разбора URL `/index.php/comment/100/create` будет использовано первое правило, которое установит значения параметров `controller` равным `comment` и `action` равным `create`. Таким образом, маршрут `<controller>/<action>` будет разрешен в `comment/create`.

Аналогично, для маршрута `comment/index`, при помощи третьего правила, будет создан URL `comment/index`.

> **Примечание:** Использование параметров в маршрутах позволяет значительно уменьшить количество правил URL и улучшить производительность компонента [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager).

По умолчанию все параметры, указанные в правиле, являются обязательными. Если запрошенный URL не содержит обязательный параметр, или если URL создается без обязательного параметра, данное правило не будет применено. Свойство [yii\\web\\UrlRule::$defaults](https://www.yiiframework.com/doc/api/2.0/yii-web-urlrule#$defaults-detail) позволяет сделать нужные параметры не обязательными. Параметры, перечисленные в данном свойстве, будут иметь заданные значения, в случае если они пропущены.

В следующем правиле описаны необязательные параметры `page` и `tag`, которые примут значения `1` и `пустая строка` в случае, если они будут пропущены.

```php
[ // ...другие правила... [ 'pattern' => 'posts/<page:\d+>/<tag>', 'route' => 'post/index', 'defaults' => ['page' => 1, 'tag' => ''], ], ]
```

Вышеприведенное правило может быть использовано для разбора или создания следующих URL:

-   `/index.php/posts`: `page` равно 1, `tag` равно ''.
-   `/index.php/posts/2`: `page` равно 2, `tag` равно ''.
-   `/index.php/posts/2/news`: `page` равно 2, `tag` равно `'news'`.
-   `/index.php/posts/news`: `page` равно 1, `tag` равно `'news'`.

Без использования необязательных параметров понадобилось бы создать 4 правила для достижения того же результата.

### Правила с именами серверов

Существует возможность включать имена серверов в шаблон правил URL. Главным образом, это удобно, когда требуется разное поведение приложения, в зависимости от разных имен веб-серверов. Например, следующее правило позволит разобрать URL `https://admin.example.com/login` в маршрут `admin/user/login` и `https://www.example.com/login` в `site/login`.

```php
[ 'https://admin.example.com/login' => 'admin/user/login', 'https://www.example.com/login' => 'site/login', ]
```

Также возможно комбинирование параметров и имени сервера для динамического извлечения данных из него. Например, следующее правило позволит разобрать URL `https://en.example.com/posts` на маршрут и параметр `language=en`.

```php
[ 'http://<language:\w+>.example.com/posts' => 'post/index', ]
```

> **Примечание:** Правила, содержащие имя сервера, НЕ должны содержать в шаблоне подкаталог пути ко входному скрипту. Например, если приложение расположено в `https://www.example.com/sandbox/blog`, шаблон должен быть `https://www.example.com/posts`, вместо `https://www.example.com/sandbox/blog/posts`. Это позволит изменять расположение приложения без необходимости внесения изменений в его код.

### Суффиксы в URL

Компонент предоставляет возможность добавления к URL суффиксов. Например, можно добавить к URL `.html`, чтобы они выглядели как статические HTML-страницы; можно добавить к URL суффикс `.json`, для указания на ожидаемый тип данных ответа. Настроить суффиксы в URL можно при помощи соответствующего свойства [yii\\web\\UrlManager::$suffix](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$suffix-detail) в конфигурации приложения:

```php
[ 'components' => [ 'urlManager' => [ 'enablePrettyUrl' => true, 'showScriptName' => false, 'enableStrictParsing' => true, 'suffix' => '.html', 'rules' => [ // ... ], ], ], ]
```

Данная конфигурация позволяет компоненту [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager) разбирать и создавать URL с суффиксом `.html`.

> **Подсказка:** При установке суффикса `/`, все URL будут заканчиваться слешем.

> **Примечание:** При настроенном суффиксе, все URL не содержащие этот суффикс будут расценены как неизвестные URL. Такое поведение рекомендовано для SEO (поисковая оптимизация).

Иногда возникает необходимость использовать разные суффиксы для разных URL. Добиться этого можно настройкой свойства [suffix](https://www.yiiframework.com/doc/api/2.0/yii-web-urlrule#$suffix-detail) у каждого правила. Когда это свойство установлено, оно имеет приоритет перед общей конфигурацией компонента [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager). Например, следующая конфигурация содержит правило URL, которое использует `.json` в качестве суффикса вместо глобального `.html`.

```php
[ 'components' => [ 'urlManager' => [ 'enablePrettyUrl' => true, 'showScriptName' => false, 'enableStrictParsing' => true, 'suffix' => '.html', 'rules' => [ // ... [ 'pattern' => 'posts', 'route' => 'post/index', 'suffix' => '.json', ], ], ], ], ]
```

### Нормализация URL

Начиная с версии 2.0.10 [UrlManager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager) может быть настроен на использование [UrlNormalizer](https://www.yiiframework.com/doc/api/2.0/yii-web-urlnormalizer), что позволяет справиться с вариациями одного и того же URL с присутствующим или отсутствующим слешем в конце. Технически `https://example.com/path` и `https://example.com/path/` являются разными URL, отдача одинакового содержимого в обоих вариантах может негативно повлиять на SEO. По умолчанию нормализатор заменяет повторяющиеся слеши на один и либо убирает, либо добавляет завершающие слеши в зависимости от суффикса и производит [редирект 301](https://ru.wikipedia.org/wiki/HTTP_301) на нормализованный URL. Нормализатор может быть настроен как глобально для менеджера URL, так и индивидуально для каждого правила. По умолчанию все правила используют нормализатор, заданный в менеджере URL. Вы можете выставить [UrlRule::$normalizer](https://www.yiiframework.com/doc/api/2.0/yii-web-urlrule#$normalizer-detail) в `false` для отключения нормализации для конкретного правила.

Ниже преведён пример конфигурации UrlNormalizer:

```php
[ 'components' => [ 'urlManager' => [ 'enablePrettyUrl' => true, 'showScriptName' => false, 'enableStrictParsing' => true, 'suffix' => '.html', 'normalizer' => [ 'class' => 'yii\web\UrlNormalizer', 'action' => UrlNormalizer::ACTION_REDIRECT_TEMPORARY, // используем временный редирект вместо постоянного ], 'rules' => [ // ... [ 'pattern' => 'posts', 'route' => 'post/index', 'suffix' => '/', 'normalizer' => false, // отключаем нормализатор для этого правила ], [ 'pattern' => 'tags', 'route' => 'tag/index', 'normalizer' => [ 'collapseSlashes' => false, // не убираем дублирующиеся слеши для этого правила ], ], ], ], ], ]
```

> **Примечание:** По умолчанию [UrlManager::$normalizer](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$normalizer-detail) отключен. Чтобы использовать нормализацию, его необходимо сконфигурировать.

### Методы HTTP

При реализации RESTful API, зачастую бывает необходимость в том, чтобы один и тот же URL был разобран в разные маршруты, в зависимости от HTTP-метода запроса. Это легко достигается указанием HTTP-методов, поддерживаемых правилом в начале шаблона. Если правило поддерживает несколько HTTP-методов, их имена разделяются запятыми. Например, следующие правила имеют шаблон `post/<id:\d+>` с разными поддерживаемыми HTTP-методами. Запрос `PUT post/100` будет разобран в маршрут `post/create`, в то время, как запрос `GET post/100` будер разобран в `post/view`.

```php
[ 'PUT,POST post/<id:\d+>' => 'post/create', 'DELETE post/<id:\d+>' => 'post/delete', 'post/<id:\d+>' => 'post/view', ]
```

> **Примечание:** Если правило URL содержит HTTP-метод в шаблоне, это правило будет использовано только при разборе URL. Такое правило не будет учитываться компонентом [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager) при создании URL.

> **Подсказка:** Для упрощения маршрутизации RESTful API, Yii предоставляет специальный класс [yii\\rest\\UrlRule](https://www.yiiframework.com/doc/api/2.0/yii-rest-urlrule), который достаточно эффективен и предоставляет такие удобные возможности, как автоматическое приведение идентификаторов контроллеров к множественной форме. Более подробную информацию можно найти в разделе Веб-сервисы REST [Роутинг](https://www.yiiframework.com/doc/guide/2.0/ru/rest-routing).

### Гибкая настройка правил

В предыдущих примерах, преимущественно, приводились правила URL, заданные парами шаблон-маршрут. Это самый распространенный, краткий формат. В некоторых случаях возникает необходимость более гибкой настройки правил, например указание суффикса при помощи свойства [yii\\web\\UrlRule::$suffix](https://www.yiiframework.com/doc/api/2.0/yii-web-urlrule#$suffix-detail). Пример конфигурации правила URL при помощи массива был рассмотрен в главе [Суффиксы в URL](https://www.yiiframework.com/doc/guide/2.0/ru/runtime-routing#suffiksy-v-url):

```php
[ // ...другие правила URL... [ 'pattern' => 'posts', 'route' => 'post/index', 'suffix' => '.json', ], ]
```

> **Информация:** По умолчанию, если в конфигурации правила явно не задан параметр `class`, будет создано правило класса [yii\\web\\UrlRule](https://www.yiiframework.com/doc/api/2.0/yii-web-urlrule).

### Добавление правил URL динамически

Правила URL могут быть динамически добавлены в компонент [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager). Часто это необходимо подключаемым [модулям](https://www.yiiframework.com/doc/guide/2.0/ru/structure-modules) для настройки своих правил URL. Для того чтобы динамически добавленные правила могли влиять на процесс роутинга, они должны быть добавлены в процессе [предзагрузки](https://www.yiiframework.com/doc/guide/2.0/ru/runtime-bootstrapping). В частности, модули должны реализовываться интерфейс [yii\\base\\BootstrapInterface](https://www.yiiframework.com/doc/api/2.0/yii-base-bootstrapinterface) и добавлять правила в методе [bootstrap()](https://www.yiiframework.com/doc/api/2.0/yii-base-bootstrapinterface#bootstrap()-detail), например:

```php
public function bootstrap($app) { $app->getUrlManager()->addRules([ // правила URL описываются здесь ], false); }
```

Также необходимо включить данный модуль в [yii\\web\\Application::bootstrap()](https://www.yiiframework.com/doc/api/2.0/yii-web-application#bootstrap()-detail), чтобы он смог участвовать в процессе [предзагрузки](https://www.yiiframework.com/doc/guide/2.0/ru/runtime-bootstrapping).

### Создание классов правил

Несмотря на то, что встроенный класс [yii\\web\\UrlRule](https://www.yiiframework.com/doc/api/2.0/yii-web-urlrule) достаточно функционален для большинства проектов, иногда возникает необходимость в создании своего класса правил URL. Например, на сайте продавца автомобилей существует необходимость поддержки URL в таком формате: `/Manufacturer/Model`, где и `Manufacturer` и `Model` должны соответствовать данным, хранящимся в базе данных. Стандартный класс [yii\\web\\UrlRule](https://www.yiiframework.com/doc/api/2.0/yii-web-urlrule) не подойдет, так как он рассчитан на работу со статичными шаблонами.

Для решения данной проблемы можно создать такой класс правила URL.

```php
namespace app\components; use yii\web\UrlRuleInterface; use yii\base\BaseObject; class CarUrlRule extends BaseObject implements UrlRuleInterface { public function createUrl($manager, $route, $params) { if ($route === 'car/index') { if (isset($params['manufacturer'], $params['model'])) { return $params['manufacturer'] . '/' . $params['model']; } elseif (isset($params['manufacturer'])) { return $params['manufacturer']; } } return false; // данное правило не применимо } public function parseRequest($manager, $request) { $pathInfo = $request->getPathInfo(); if (preg_match('%^(\w+)(/(\w+))?$%', $pathInfo, $matches)) { // Ищем совпадения $matches[1] и $matches[3] // с данными manufacturer и model в базе данных // Если нашли, устанавливаем $params['manufacturer'] и/или $params['model'] // и возвращаем ['car/index', $params] } return false; // данное правило не применимо } }
```

И использовать новый класс [yii\\web\\UrlManager::$rules](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager#$rules-detail) при определении правил URL:

```php
[ // ...другие правила... [ 'class' => 'app\components\CarUrlRule', // ...настройка других параметров правила... ], ]
```

## Производительность

При разработке сложных веб-приложений, важно оптимизировать правила URL так, чтобы разбор запросов и создание URL занимали минимальное время.

Использование параметров в маршрутах позволяет уменьшить количество правил, что значительно увеличивает производительность.

При разборе или создании URL, компонент [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager) проверяет правила в порядке их определения. Поэтому следует более узконаправленные и/или часто используемые правила размещать раньше прочих.

В случае, если несколько правил имеют один и тот же префикс в шаблоне или маршруте, можно рассмотреть использование [yii\\web\\GroupUrlRule](https://www.yiiframework.com/doc/api/2.0/yii-web-groupurlrule), что позволит компоненту [URL manager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager) более эффективно обрабатывать правила группами. Часто это бывает полезно в случае, если приложение состоит из модулей, каждый из которых имеет свой набор правил с идентификатором модуля в качестве общего префикса.
