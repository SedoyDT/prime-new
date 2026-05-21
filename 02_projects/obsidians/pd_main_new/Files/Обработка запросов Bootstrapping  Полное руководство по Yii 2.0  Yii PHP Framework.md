---
created: 2024-02-17T19:37:23 (UTC +03:00)
tags: []
source: https://www.yiiframework.com/doc/guide/2.0/ru/runtime-bootstrapping
author: 
tags:
 - web
 - firefox
---
[[books/2024-02-17]]

# Обработка запросов: Bootstrapping | Полное руководство по Yii 2.0 | Yii PHP Framework

> ## Excerpt
> Предзагрузка это процесс настройки рабочей среды до того, как будет запущено приложение и обработан входящий запрос. 
Предзагрузка осуществляется в двух местах: во входном скрипте и в приложении.

---
## Предзагрузка

Предзагрузка это процесс настройки рабочей среды до того, как будет запущено приложение и обработан входящий запрос. Предзагрузка осуществляется в двух местах: [во входном скрипте](https://www.yiiframework.com/doc/guide/2.0/ru/structure-entry-scripts) и в [приложении](https://www.yiiframework.com/doc/guide/2.0/ru/structure-applications).

Во [входном скрипте](https://www.yiiframework.com/doc/guide/2.0/ru/structure-entry-scripts), регистрируются автозагрузчики классов различных библиотек. Этот процесс включает в себя автозагрузчик классов Composer через `autoload.php` файл и автозагрузчик классов Yii через его `Yii` файл. Затем входной скрипт загружает [конфигурацию](https://www.yiiframework.com/doc/guide/2.0/ru/concept-configurations) приложения и создает объект [приложения](https://www.yiiframework.com/doc/guide/2.0/ru/structure-applications).

В конструкторе приложения происходит следующий процесс предзагрузки:

1.  Вызывается метод [preInit()](https://www.yiiframework.com/doc/api/2.0/yii-base-application#preInit()-detail), который конфигурирует свойства приложения, имеющие наивысший приоритет, такие как [basePath](https://www.yiiframework.com/doc/api/2.0/yii-base-application#$basePath-detail);
2.  Регистрируется [обработчик ошибок](https://www.yiiframework.com/doc/api/2.0/yii-base-application#$errorHandler-detail);
3.  Происходит инициализация свойств приложения согласно заданной конфигурации;
4.  Вызывается метод [init()](https://www.yiiframework.com/doc/api/2.0/yii-base-application#init()-detail), который в свою очередь вызывает метод [bootstrap()](https://www.yiiframework.com/doc/api/2.0/yii-base-application#bootstrap()-detail) для запуска компонентов предзагрузки.
    -   Подключается файл манифеста `vendor/yiisoft/extensions.php`;
    -   Создаются и запускаются [компоненты предзагрузки](https://www.yiiframework.com/doc/guide/2.0/ru/structure-extensions#bootstrapping-classes) объявленные в расширениях;
    -   Создаются и запускаются [компоненты приложения](https://www.yiiframework.com/doc/guide/2.0/ru/structure-application-components) и/или [модули](https://www.yiiframework.com/doc/guide/2.0/ru/structure-modules), объявленные в свойстве [предзагрузка](https://www.yiiframework.com/doc/guide/2.0/ru/structure-applications#bootstrap) приложения.

Поскольку предзагрузка осуществляется прежде чем будет обработан _каждый_ запрос, то очень важно, чтобы этот процесс был легким и максимально оптимизированным.

Старайтесь не регистрировать слишком много компонентов в предзагрузке. Компонент предзагрузки нужен только тогда, когда он должен участвовать в полном жизненном цикле процесса обработки запроса. Например, если модуль должен зарегистрировать дополнительные правила парсинга URL, то он должен быть указан в свойстве [предзагрузка](https://www.yiiframework.com/doc/guide/2.0/ru/structure-applications#bootstrap), чтобы новые правила URL были учтены при обработке запроса.

В производственном режиме включите байткод кэшеры, такие как [PHP OPcache](https://www.php.net/manual/ru/intro.opcache.php) или [APC](https://www.php.net/manual/ru/book.apcu.php), для минимизации времени подключения и парсинг php файлов.

Некоторые большие приложения могут иметь сложную [конфигурацию](https://www.yiiframework.com/doc/guide/2.0/ru/concept-configurations), которая разделена на несколько мелких файлов. Если это тот самый случай, возможно вам стоит кэшировать весь конфигурационный файл и загружать его прямо из кэша до создания объекта приложения во входном скрипте.
