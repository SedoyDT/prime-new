---
created: 2024-02-12T07:23:28 (UTC +03:00)
tags: []
source: https://www.yiiframework.com/doc/guide/2.0/ru/test-environment-setup
author: 
tags:
 - web
 - firefox
---
[[2024-02-12]]

# Тестирование: Настройка тестового окружения | Полное руководство по Yii 2.0 | Yii PHP Framework

> ## Excerpt
> Примечание: Данный раздел находится в разработке.

---
## Настройка тестового окружения

> **Примечание:** Данный раздел находится в разработке.

Yii 2 официально поддерживает интеграцию с фреймворком для тестирования [`Codeception`](https://github.com/Codeception/Codeception), который позволяет вам проводить следующие типы тестов:

-   [Модульное тестирование](https://www.yiiframework.com/doc/guide/2.0/ru/test-unit) - проверяет что отдельный модуль кода работает верно;
-   [Функциональное тестирование](https://www.yiiframework.com/doc/guide/2.0/ru/test-functional) - проверяет пользовательские сценарии через эмуляцию браузера;
-   [Приёмочное тестирование](https://www.yiiframework.com/doc/guide/2.0/ru/test-acceptance) - проверяет пользовательские сценарии в браузере.

Все три типа тестов представлены в шаблонах проектов [`yii2-basic`](https://github.com/yiisoft/yii2-app-basic) и [`yii2-advanced`](https://github.com/yiisoft/yii2-app-advanced).

Для того, чтобы запустить тесты, необходимо установить [Codeception](https://github.com/Codeception/Codeception). Сделать это можно как локально, то есть только для текущего проекта, так и глобально для компьютера разработчика.

Для локальной установки используйте следующие команды:

```
composer <span>require</span> <span>"codeception/codeception=2.1.*"</span>
composer <span>require</span> <span>"codeception/specify=*"</span>
composer <span>require</span> <span>"codeception/verify=*"</span>
```

Для глобальной установки необходимо добавить директиву `global`:

```
composer <span>global</span> <span>require</span> <span>"codeception/codeception=2.1.*"</span>
composer <span>global</span> <span>require</span> <span>"codeception/specify=*"</span>
composer <span>global</span> <span>require</span> <span>"codeception/verify=*"</span>
```

Если вы никогда не пользовались Composer для установки глобальных пакетов, запустите `composer global status`. На выходе вы должны получить:

```
<span>Changed</span> current directory to &lt;directory&gt;
```

Затем `<directory>/vendor/bin` добавьте в переменную окружения `PATH`. После этого можно использовать `codecept` глобально из командной строки.

> **Примечание:** глобальная установка позволяет вам использовать Codeception для всех проектов на компьютере разработчика путём запуска команды `codecept` без указания пути. Тем не менее, данный подход может не подойти. К примеру, в двух разных проектах может потребоваться установить разные версии Codeception. Для простоты все команды в разделах про тестирование используются так, будто Codeception установлен глобально.

### Настройка веб-сервера Apache

Если вы используете Apache и настроили его как описано в разделе «[Установка Yii](https://www.yiiframework.com/doc/guide/2.0/ru/start-installation)», то для тестов вам необходимо создать отдельный виртуальный хост который будет работать с той же папкой, но использовать входной скрипт `index-test.php`:

```
<span>&lt;VirtualHost *:80&gt;</span>
    <span><span>DocumentRoot</span></span> <span>"path/to/basic/web"</span>
    <span><span>ServerName</span></span> mysite-test
    <span>&lt;Directory "path/to/basic/web"&gt;</span>
        <span><span>Order</span></span> Allow,Deny
        <span><span>Allow</span></span> from <span>all</span>
        <span>AddDefaultCharset</span> utf-8
        <span>DirectoryIndex</span> index-test.php
        <span><span>RewriteEngine</span></span> <span>on</span>
        <span><span>RewriteCond</span></span> <span>%{REQUEST_FILENAME}</span> !-f
        <span><span>RewriteCond</span></span> <span>%{REQUEST_FILENAME}</span> !-d
        <span><span>RewriteRule</span></span> . index-test.php
    <span>&lt;/Directory&gt;</span>
<span>&lt;/VirtualHost&gt;</span>
```

Так мы укажем веб серверу перенаправлять все запросы на скрипт `index-test.php`. > Note: Обратите внимание, что здесь мы указываем параметр `DirectoryIndex`, помимо тех параметров, которые были указаны для первого хоста. Это сделано с той целью, чтобы при обращении к главной странице по адресу `mysite-test` также использовался бы скрипт `index-test.php`.
