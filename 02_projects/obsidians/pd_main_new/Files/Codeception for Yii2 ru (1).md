---
created: 2024-02-18T17:13:27 (UTC +03:00)
tags: []
source: https://codeception.com/for/yii
author: 
---

# Codeception for Yii2

> ## Excerpt
> Yii Framework предоставляет базовые и расширенные шаблоны приложений. Оба включают примеры тестов Codeception, таким образом, чтобы начать с Codeception, вам нужно запустить новый проект Yii с одного из этих шаблонов.

---
Yii Framework предоставляет базовые и расширенные шаблоны приложений. Оба включают примеры тестов Codeception, таким образом, чтобы начать с Codeception, вам нужно запустить новый проект Yii с одного из этих шаблонов.

## Yii Basic

После создания проекта на основе [базового шаблона](https://github.com/yiisoft/yii2-app-basic/) вы должны увидеть папку `tests` и `codeception.yml` файл конфигурации. Для начала доступны наборы функциональных и модульных тестов.

Запустите их, выполнив в терминале:

```
./vendor/bin/codecept run
```

![Вывод](https://codeception.com/images/yii-basic-tests.png)

### Модульные тесты

Модульные тесты расположены в `tests/unit` каталоге и должны содержать все виды модульного и интеграционного тестирования.

Each test case extends `Codeception\Test\Unit` class, which is standard Codeception format for unit testing. It is pretty hard to develop completely isolated unit tests in Yii, so an application is bootstrapped before each test case. Tests are configured in `tests/unit.suite.yml` file with Yii2 module enabled:

```
<span>modules</span><span>:</span>
    <span>enabled</span><span>:</span>
      <span>-</span> <span>Yii2</span><span>:</span>
            <span>part</span><span>:</span> <span>[</span><span>orm</span><span>,</span> <span>email</span><span>]</span>
```

Этот модуль запускает приложение Yii для тестирования и предоставляет дополнительные вспомогательные методы для упрощения тестирования. В нем есть только части `orm` и `email`, чтобы исключить методы, необходимые только для функционального тестирования.

Получая доступ к `$this->tester` классу внутри тестового примера, вы можете использовать методы [модуля Yii2](https://codeception.com/docs/modules/Yii2). Итак, если у вас включены части orm и email, вы можете вызывать методы, принадлежащие этим частям:

```

<span>// insert records in database</span>
<span>$this</span><span>-&gt;</span><span>tester</span><span>-&gt;</span><span>haveRecord</span><span>(</span><span>'app/model/User'</span><span>,</span> <span>[</span><span>'username'</span> <span>=&gt;</span> <span>'davert'</span><span>]);</span>
<span>// check records in database</span>
<span>$this</span><span>-&gt;</span><span>tester</span><span>-&gt;</span><span>seeRecord</span><span>(</span><span>'app/model/User'</span><span>,</span> <span>[</span><span>'username'</span> <span>=&gt;</span> <span>'davert'</span><span>]);</span>
<span>// test email was sent</span>
<span>$this</span><span>-&gt;</span><span>tester</span><span>-&gt;</span><span>seeEmailIsSent</span><span>();</span>
<span>// get a last sent emails</span>
<span>$this</span><span>-&gt;</span><span>tester</span><span>-&gt;</span><span>grabLastSentEmail</span><span>();</span>
```

Если вы включите `fixtures` part, вы также получите методы для загрузки и использования приспособлений в ваших тестах:

```

<span>// load fixtures</span>
<span>$this</span><span>-&gt;</span><span>tester</span><span>-&gt;</span><span>haveFixtures</span><span>([</span>
    <span>'user'</span> <span>=&gt;</span> <span>[</span>
        <span>'class'</span> <span>=&gt;</span> <span>UserFixture</span><span>::</span><span>className</span><span>(),</span>
        <span>// fixture data located in tests/_data/user.php</span>
        <span>'dataFile'</span> <span>=&gt;</span> <span>codecept_data_dir</span><span>()</span> <span>.</span> <span>'user.php'</span>
    <span>]</span>
<span>]);</span>
<span>// get first user from fixtures</span>
<span>$this</span><span>-&gt;</span><span>tester</span><span>-&gt;</span><span>grabFixture</span><span>(</span><span>'user'</span><span>,</span> <span>0</span><span>);</span>
```

Если `Yii2` модуль включен, вы можете безопасно вызывать его `Yii::$app` внутри теста, так как приложение инициализируется и очищается после теста. Если вы хотите добавить свои вспомогательные методы или пользовательские утверждения для вашего тестового примера, вам не следует расширять его, `Codeception\Test\Unit` а написать свой собственный отдельный [вспомогательный класс](https://codeception.com/docs/06-ModulesAndHelpers#Helpers).

### Функциональные тесты

Когда дело доходит до тестирования _реальных_ функций веб-приложений, вы не можете ограничиться модульным тестированием. Вы хотите протестировать, как приложение обрабатывает запросы, какие ответы оно предоставляет, какие данные сохраняются в базе данных и так далее. Чтобы протестировать приложение в среде, близкой к пользовательской, но без запуска реального веб-сервера или браузера, вы можете использовать функциональные тесты. Они намного проще модульных тестов в том смысле, в каком они написаны. Они описывают сценарий взаимодействия в простом DSL, поэтому вам не нужно иметь дело с приложением напрямую, но описывать действия с точки зрения пользователя:

```

<span>$I</span><span>-&gt;</span><span>amOnPage</span><span>([</span><span>'site/contact'</span><span>]);</span>
<span>$I</span><span>-&gt;</span><span>submitForm</span><span>(</span><span>'#contact-form'</span><span>,</span> <span>[]);</span>
<span>$I</span><span>-&gt;</span><span>expectTo</span><span>(</span><span>'see validations errors'</span><span>);</span>
<span>$I</span><span>-&gt;</span><span>see</span><span>(</span><span>'Contact'</span><span>,</span> <span>'h1'</span><span>);</span>
<span>$I</span><span>-&gt;</span><span>see</span><span>(</span><span>'Name cannot be blank'</span><span>);</span>
<span>$I</span><span>-&gt;</span><span>see</span><span>(</span><span>'Email cannot be blank'</span><span>);</span>
<span>$I</span><span>-&gt;</span><span>see</span><span>(</span><span>'Subject cannot be blank'</span><span>);</span>
<span>$I</span><span>-&gt;</span><span>see</span><span>(</span><span>'Body cannot be blank'</span><span>);</span>
```

Таким образом, вы тестируете не только контактную форму на сайте, но и фактический вывод приложения, который видит пользователь. Codeception предоставляет стандартный набор действий, таких как `amOnPage`, `submitForm`, `see` для тестирования. Модуль Yii2 предоставляет специальные методы, такие как `amLoggedInAs` (для быстрой аутентификации), `haveRecord`, `seeRecord`, `seeEmailIsSent` и другие. Все они перечислены в [справочнике по модулю](https://codeception.com/docs/modules/Yii2).

Функциональные тесты должны быть записаны внутри [файлов Cest](https://codeception.com/docs/07-AdvancedUsage#Cest-Classes), которые представляют собой формат тестирования Codeception, основанный на сценарии. Вы можете легко создать новый тест, запустив:

```
./vendor/bin/codecept g:cest functional MyNewScenarioCest
```

### Тесты API

Тесты API не включены ни в какие шаблоны Yii, поэтому вам необходимо настроить их вручную, если вы разрабатываете веб-сервис. Тестирование API выполняется на уровне функционального тестирования, но вместо тестирования HTML-ответов на действия пользователя они тестируют запросы и ответы с помощью протоколов, таких как REST или SOAP. Чтобы начать писать тесты api, вы должны создать набор для них

```
./vendor/bin/codecept g:suite api
```

Вам нужно будет включить `REST`, `Yii2` модуль в `tests/api.suite.yml`:

```
<span>class_name</span><span>:</span> <span>ApiTester</span>
<span>modules</span><span>:</span>
    <span>enabled</span><span>:</span>
        <span>-</span> <span>REST</span><span>:</span>
            <span>url</span><span>:</span> <span>/api/v1</span>
            <span>depends</span><span>:</span> <span>Yii2</span>
        <span>-</span> <span>\ApiBundle\Helper\Api</span>
    <span>config</span><span>:</span>
        <span>-</span> <span>Yii2</span>

```

Действия модуля Yii2, такие как `amOnPage` или `see`, не должны быть доступны для тестирования API. Вот почему модуль Yii2 не включен, но объявлен с помощью `depends` для модуля REST.

### Приемо-сдаточные испытания

С точки зрения тестирования, приемочные тесты выполняют то же самое, что и функциональные тесты. Они тестируют взаимодействие пользователя с приложением, но в данном случае с использованием _реального_ браузера и веб-сервера. Они гораздо медленнее и гораздо более хрупкие. Они не должны дублировать функциональные тесты с точки зрения тестирования функциональности, но должны использоваться для тестирования пользовательского интерфейса вашего приложения. Если вы не уверены, какие тесты должны быть приемлемыми, а какие функциональными, напишите приемочные тесты для приложений с поддержкой JavaScript, где пользовательский интерфейс сильно зависит от работы браузера. Вы также можете использовать приемочные тесты для сценариев "счастливого пути", просто чтобы убедиться, что реальный пользователь, использующий реальный браузер, достигнет тех же результатов, которые вы ожидаете от функциональных тестов.

По умолчанию в базовом приложении приемочные тесты отключены (поскольку для них требуются веб-сервер, сервер Selenium и браузер для работы). Вы можете легко включить их, переименовав `acceptance.suite.yml.example` в `acceptance.suite.yml`

```
mv tests/acceptance.suite.yml.example tests/acceptance.suite.yml
```

Базовый шаблон использует `codeception/base` пакет, который не содержит `facebook/webdriver` библиотеки, необходимой для запуска приемочных тестов. Пожалуйста, измените `codeception/base` на `codeception/codeception` в `composer.json` и запустите команду update.

Затем вам нужно будет запустить сервер приложений в тестовом режиме:

и запустите [сервер Selenium](https://codeception.com/docs/modules/WebDriver#Local-Testing). Для принятия используется модуль WebDriver. Пожалуйста, проверьте ссылку на него, чтобы узнать, как с ним работать. В отличие от модуля Yii2, он ничего не знает о вашем приложении, поэтому, если вы хотите использовать функции Yii, такие как приспособления, для приемочного тестирования, вам следует убедиться, что модуль enable Yii2 также включен:

```
<span># config at tests/acceptance.yml</span>
<span>modules</span><span>:</span>
    <span>enabled</span><span>:</span>
        <span>-</span> <span>WebDriver</span><span>:</span>
            <span>url</span><span>:</span> <span>http://127.0.0.1:8080/</span>
            <span>browser</span><span>:</span> <span>firefox</span>
        <span>-</span> <span>Yii2</span><span>:</span>
            <span>part</span><span>:</span> <span>[</span><span>orm</span><span>,</span> <span>fixtures</span><span>]</span> <span># allow to use AR methods</span>
            <span>cleanup</span><span>:</span> <span>false</span> <span># don't wrap test in transaction</span>
            <span>entryScript</span><span>:</span> <span>index-test.php</span>
```

Как уже было сказано, функциональные и приемочные тесты схожи, поэтому во избежание конфликтов с этими модулями вам следует загружать только ту часть модуля Yii2, которая вам действительно нужна. Вы также должны настроить `cleanup: false` так, чтобы изменения Yii2 в базе данных сохранялись и использовались приложением, запущенным на веб-сервере. Используйте значения `entryScript` и `entryUrl`, чтобы изменить конфигурацию хоста и скрипта по умолчанию для вашего приложения.

Аналогично функциональным тестам, для приемочного тестирования рекомендуется использовать формат Cest:

```
./vendor/bin/codecept g:cest acceptance MyNewScenarioCest
```

## Yii Advanced

В расширенном шаблоне также предустановлен Codeception с примерами модульных, функциональных и приемочных тестов. Однако вы не найдете `tests` папку в корневом каталоге приложения. Это потому, что каждое приложение `frontend`, `backend` и их `common` имеют свои собственные тесты. Это сделано для того, чтобы тесты и исходный код размещались в одном месте. Чтобы запустить все тесты из всех приложений одновременно, вы должны выполнить `codecept run` из корня проекта. Глобальная `codeception.yml` конфигурация была написана так, чтобы включать тесты из всех приложений.

![](https://codeception.com/images/yii-advanced-tests.png)

Тесты также включают пространства имен для классов testcase и тестировщиков, чтобы избежать конфликтов между тестами из разных приложений.

## Ручная настройка

Для начала вам необходимо установить Codeception через Composer

```
composer require "codeception/codeception" --dev
```

Создание базовых наборов тестов

```
./vendor/bin/codecept bootstrap
```

Включить модуль Yii2 для функциональных тестов внутри `functional.suite.yml`:

```
<span># functional.suite.yml</span>
<span>modules</span><span>:</span>
    <span>enabled</span><span>:</span>
        <span>-</span> <span>Yii2</span><span>:</span>
            <span>configFile</span><span>:</span> <span>#insert path to config file</span>
```

Единственным обязательным параметром для модуля Yii2 является `configFile`. Этот файл с конфигурацией для тестовой настройки приложения Yii. Он должен объединить исходную конфигурацию приложения, переопределяющую `id` значение, и предоставить другую базу данных для тестирования:

```

<span>// config/test.php</span>
<span>$config</span> <span>=</span>  <span>yii\helpers\ArrayHelper</span><span>::</span><span>merge</span><span>(</span>
    <span>require</span><span>(</span><span>__DIR__</span> <span>.</span> <span>'/main.php'</span><span>),</span>
    <span>require</span><span>(</span><span>__DIR__</span> <span>.</span> <span>'/main-local.php'</span><span>),</span>
    <span>[</span>
        <span>'id'</span> <span>=&gt;</span> <span>'app-tests'</span><span>,</span>
        <span>'components'</span> <span>=&gt;</span> <span>[</span>
            <span>'db'</span> <span>=&gt;</span> <span>[</span>
                <span>'dsn'</span> <span>=&gt;</span> <span>'mysql:host=localhost;dbname=yii_app_test'</span><span>,</span>
            <span>]</span>
        <span>]</span>        
    <span>]</span>
<span>);</span>
<span>return</span> <span>$config</span><span>;</span>
```

Конфигурацию теста рекомендуется хранить в `config` папке приложения. Вы должны указать путь к тестовой конфигурации относительно `codeception.yml` файла.

Пожалуйста, также убедитесь, что для `YII_ENV` константы установлено значение `test`, как это делается в `tests/_bootstrap.php` файле базовых и расширенных шаблонов приложений.

После настройки функциональных тестов должно быть легко создать настройки для модульных и приемочных тестов, как это описано в этом руководстве.

В базовых и расширенных шаблонах приложений `configFile` определено в глобальном файле конфигурации:

```
<span># inside codeception.yml</span>
<span>modules</span><span>:</span>
    <span>config</span><span>:</span>
        <span>Yii2</span><span>:</span>
            <span>configFile</span><span>:</span> <span>'</span><span>config/test.php'</span>
```

Таким образом, нам не нужно предоставлять конфигурацию тестирования для каждого определенного набора.
