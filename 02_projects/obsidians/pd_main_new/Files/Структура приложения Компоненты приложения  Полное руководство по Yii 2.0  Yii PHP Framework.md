---
created: 2024-02-17T17:55:33 (UTC +03:00)
tags: []
source: https://www.yiiframework.com/doc/guide/2.0/ru/structure-application-components
author: 
tags:
 - web
 - firefox
---
[[books/2024-02-17]]

# Структура приложения: Компоненты приложения | Полное руководство по Yii 2.0 | Yii PHP Framework

> ## Excerpt
> Приложения являются сервис локаторами. Они хранят множество так называемых
компонентов приложения, которые предоставляют различные средства для обработки запросов. Например, 
компонент urlManager ответственен за маршрутизацию веб запросов к нужному контроллеру; компонент db предоставляет
средства для работы с базой данных; и т. д.

---
## Компоненты приложения

Приложения являются [сервис локаторами](https://www.yiiframework.com/doc/guide/2.0/ru/concept-service-locator). Они хранят множество так называемых _компонентов приложения_, которые предоставляют различные средства для обработки запросов. Например, компонент `urlManager` ответственен за маршрутизацию веб запросов к нужному контроллеру; компонент `db` предоставляет средства для работы с базой данных; и т. д.

Каждый компонент приложения имеет свой уникальный ID, который позволяет идентифицировать его среди других различных компонентов в одном и том же приложении. Вы можете получить доступ к компоненту следующим образом:

```php
\Yii::$app->componentID
```

Например, вы можете использовать `\Yii::$app->db` для получения [соединения с БД](https://www.yiiframework.com/doc/api/2.0/yii-db-connection), и `\Yii::$app->cache` для получения доступа к основному компоненту [кэша](https://www.yiiframework.com/doc/api/2.0/yii-caching-cache), зарегистрированному в приложении.

Компонент приложения будет создан при первом обращении к нему через вышеуказанное выражение. Любые дальнейшие обращения будут возвращать тот же экземпляр компонента.

Компонентами приложения могут быть любые объекты. Вы можете зарегистрировать их с помощью  
свойства [yii\\base\\Application::$components](https://www.yiiframework.com/doc/api/2.0/yii-di-servicelocator#$components-detail) в [конфигурации](https://www.yiiframework.com/doc/guide/2.0/ru/structure-applications#application-configurations) приложения. Например,

```php
[ 'components' => [ // регистрация "cache" компонента с помощью имени класса 'cache' => 'yii\caching\ApcCache', // регистрация "db" компонента с помощью массива конфигурации 'db' => [ 'class' => 'yii\db\Connection', 'dsn' => 'mysql:host=localhost;dbname=demo', 'username' => 'root', 'password' => '', ], // регистрация "search" компонента с помощью анонимной функции 'search' => function () { return new app\components\SolrService; }, ], ]
```

> **Информация:** Хотя вы можете зарегистрировать столько компонентов в приложении сколько вам нужно, все таки стоит это делать разумно. Компоненты приложения похожи на глобальные переменные. Использование слишком большого количества компонентов приложения может потенциально сделать ваш код сложным для разработки и тестирования. В большинстве случаев вы можете просто создать локальный компонент и использовать его при необходимости.

## Компоненты начальной загрузки

Как упоминалось выше, компонент приложения будет создан только при первом обращении к нему. Однако может возникнуть необходимость в наличии созданного компонента при каждом запросе, даже если напрямую к нему ни разу не обращались. Для этого необходимо указать ID компонента в качестве элемента свойства [bootstrap](https://www.yiiframework.com/doc/api/2.0/yii-base-application#bootstrap()-detail).

К примеру, при данной конфигурации компонент `log` всегда подгружается при загрузке:

```php
[ 'bootstrap' => [ 'log', ], 'components' => [ 'log' => [ // конфигурация для компонента `log` ], ], ]
```

## Встроенные компоненты приложения

В Yii есть несколько _встроенных_ компонентов приложения, с фиксированными ID и конфигурациями по умолчанию. Например, компонент [request](https://www.yiiframework.com/doc/api/2.0/yii-web-application#$request-detail) используется для сбора информации о запросе пользователя и разбора его в определенный [маршрут](https://www.yiiframework.com/doc/guide/2.0/ru/runtime-routing); компонент [db](https://www.yiiframework.com/doc/api/2.0/yii-base-application#$db-detail) представляет собой соединение с базой данных, через которое вы можете выполнять запросы. Именно с помощью этих встроенных компонентов Yii приложения могут обработать запрос пользователя.

Ниже представлен список встроенных компонентов приложения. Вы можете конфигурировать их также как и другие компоненты приложения. Когда вы конфигурируете встроенный компонент приложения и не указываете класс этого компонента, то значение по умолчанию будет использовано.

-   [assetManager](https://www.yiiframework.com/doc/api/2.0/yii-web-assetmanager): используется для управления и опубликования ресурсов приложения. Более детальная информация представлена в разделе [Ресурсы](https://www.yiiframework.com/doc/guide/2.0/ru/structure-assets);
-   [db](https://www.yiiframework.com/doc/api/2.0/yii-db-connection): представляет собой соединение с базой данных, через которое вы можете выполнять запросы. Обратите внимание, что когда вы конфигурируете данный компонент, вы должны указать класс компонента также как и остальные необходимые параметры, такие как [yii\\db\\Connection::$dsn](https://www.yiiframework.com/doc/api/2.0/yii-db-connection#$dsn-detail). Более детальная информация представлена в разделе [Объекты доступа к данным (DAO)](https://www.yiiframework.com/doc/guide/2.0/ru/db-dao);
-   [errorHandler](https://www.yiiframework.com/doc/api/2.0/yii-base-application#$errorHandler-detail): осуществляет обработку PHP ошибок и исключений. Более детальная информация представлена в разделе [Обработка ошибок](https://www.yiiframework.com/doc/guide/2.0/ru/runtime-handling-errors);
-   [formatter](https://www.yiiframework.com/doc/api/2.0/yii-i18n-formatter): форматирует данные для отображения их конечному пользователю. Например, число может быть отображено с различными разделителями, дата может быть отображена в формате `long`. Более детальная информация представлена в разделе [Форматирование данных](https://www.yiiframework.com/doc/guide/2.0/ru/output-formatting);
-   [i18n](https://www.yiiframework.com/doc/api/2.0/yii-i18n-i18n): используется для перевода сообщений и форматирования. Более детальная информация представлена в разделе [Интернационализация](https://www.yiiframework.com/doc/guide/2.0/ru/tutorial-i18n);
-   [log](https://www.yiiframework.com/doc/api/2.0/yii-log-dispatcher): обработка и маршрутизация логов. Более детальная информация представлена в разделе [Логирование](https://www.yiiframework.com/doc/guide/2.0/ru/runtime-logging);
-   yii\\swiftmailer\\Mailer: предоставляет возможности для составления и рассылки писем. Более детальная информация представлена в разделе [Отправка почты](https://www.yiiframework.com/doc/guide/2.0/ru/tutorial-mailing);
-   [response](https://www.yiiframework.com/doc/api/2.0/yii-base-application#$response-detail): представляет собой данные от сервера, которые будет направлены пользователю. Более детальная информация представлена в разделе [Ответы](https://www.yiiframework.com/doc/guide/2.0/ru/runtime-responses);
-   [request](https://www.yiiframework.com/doc/api/2.0/yii-base-application#$request-detail): представляет собой запрос, полученный от конечных пользователей. Более детальная информация представлена в разделе [Запросы](https://www.yiiframework.com/doc/guide/2.0/ru/runtime-requests);
-   [session](https://www.yiiframework.com/doc/api/2.0/yii-web-session): информация о сессии. Данный компонент доступен только в [веб приложениях](https://www.yiiframework.com/doc/api/2.0/yii-web-application). Более детальная информация представлена в разделе [Сессии и куки](https://www.yiiframework.com/doc/guide/2.0/ru/runtime-sessions-cookies);
-   [urlManager](https://www.yiiframework.com/doc/api/2.0/yii-web-urlmanager): используется для разбора и создания URL. Более детальная информация представлена в разделе [Разбор и генерация URL](https://www.yiiframework.com/doc/guide/2.0/ru/runtime-routing);
-   [user](https://www.yiiframework.com/doc/api/2.0/yii-web-user): представляет собой информацию аутентифицированного пользователя. Данный компонент доступен только в [веб приложениях](https://www.yiiframework.com/doc/api/2.0/yii-web-application). Более детальная информация представлена в разделе [Аутентификация](https://www.yiiframework.com/doc/guide/2.0/ru/security-authentication);
-   [view](https://www.yiiframework.com/doc/api/2.0/yii-web-view): используется для отображения представлений. Более детальная информация представлена в разделе [Представления](https://www.yiiframework.com/doc/guide/2.0/ru/structure-views).
