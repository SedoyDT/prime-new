---
created: 2024-02-18T16:59:49 (UTC +03:00)
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

This module starts Yii application for a test case and provides additional helper methods to simplify testing. It has only `orm` and `email` parts in order to exclude methods needed for functional testing only.

By accessing `$this->tester` class inside a test case you can use methods of [Yii2 module](https://codeception.com/docs/modules/Yii2). So if you have orm and email parts enabled so you can call methods belonging from these parts:

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

If you enable `fixtures` part you will also get methods to load and use fixtures in your tests:

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

If `Yii2` module is enabled you can safely call `Yii::$app` inside a test, as application is initialized and cleaned up after a test. If you want to add your helper methods or custom assertions for your test case you should not extend `Codeception\Test\Unit` but write your own separate [Helper class](https://codeception.com/docs/06-ModulesAndHelpers#Helpers).

### Functional Tests

When it comes to test _real_ features of web applications you can’t go with unit testing only. You want to test how application handles the requests, what responses it provides, what data is saved to database and so on. To test application in near user environment but without launching real webserver or a browser you can use functional tests. They are far more simpler than unit tests in a way they are written. They describe interaction scenario in a simple DSL so you don’t need to deal with application directly but describe actions from a user’s perspective:

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

This way you not only test the ContactForm on a site but actual output of application that user sees. Codeception provides standard set of actions like `amOnPage`, `submitForm`, `see` for testing. Yii2 module provides special methods, like `amLoggedInAs` (for fast authentication), `haveRecord`, `seeRecord`, `seeEmailIsSent` and others. They all are listed in [module reference](https://codeception.com/docs/modules/Yii2).

Functional tests should be written inside [Cest files](https://codeception.com/docs/07-AdvancedUsage#Cest-Classes), which is a scenario-driven test format of Codeception. You can easily create a new test by running:

```
./vendor/bin/codecept g:cest functional MyNewScenarioCest
```

Functional tests are really powerful and simple. They are highly **recommended to use** for any Yii application.  
Continue to [Functional Testing Guide »](https://codeception.com/docs/04-FunctionalTests)

### API Tests

API tests are not included in any Yii templates so you need to set up them manually if you developing a web service. API testing is done at functional testing level but instead of testing HTML responses on user actions, they test requests and responses via protocols like REST or SOAP. To start writing api tests you should create a suite for them

```
./vendor/bin/codecept g:suite api
```

You will need to enable `REST`, `Yii2` module in `tests/api.suite.yml`:

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

Yii2 module actions like `amOnPage` or `see` should not be available for testing API. This is why Yii2 module is not enabled but declared with `depends` for REST module.

### Acceptance Tests

From a test perspective acceptance tests do the same as functional tests. They test the user interaction with application but in this case using _real_ browser and web server. They are much slower and much more fragile. They should not duplicate functional tests in matter of testing functionality but should be used for testing the UI of your application. If you are unsure which tests should be acceptance and which are functional, write acceptance tests for JavaScript-rich applications, where UI highly depends on a browser processing. You can also use acceptance tests for happy-path scenarios, just to ensure that a real user using a real browser achieve the same results you expect in functional tests.

By default in basic application acceptance tests are disabled (as they require web server, Selenium Server and browser to be running). You can easily enable them by renaming `acceptance.suite.yml.example` to `acceptance.suite.yml`

```
mv tests/acceptance.suite.yml.example tests/acceptance.suite.yml
```

Basic template uses `codeception/base` package which doesn’t contain `facebook/webdriver` library required to run acceptance tests. Please change `codeception/base` to `codeception/codeception` in `composer.json` and run the update command.

Then you will need to launch application server in test mode:

and start a [Selenium Server](https://codeception.com/docs/modules/WebDriver#Local-Testing). For acceptance WebDriver module is used. Please check its reference to learn how to work with it. Unlike Yii2 module it does know nothing about your application, so if you want to use features of Yii like fixtures for acceptance testing, you should check that enable Yii2 module is enabled as well:

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

As it was said, functional and acceptance tests are similar, so in order to avoid conflicts with these modules you should load only a part of Yii2 module which you really need. You must also set `cleanup: false` so Yii2 changes to database to be saved and used by application running on web server. Use `entryScript` and `entryUrl` values to change the default host and script configuration for your app.

Similar as for functional tests it is recommended to use Cest format for acceptance testing:

```
./vendor/bin/codecept g:cest acceptance MyNewScenarioCest
```

## Yii Advanced

Advanced template also has Codeception preinstalled with examples of unit, functional, and acceptance tests. However, you won’t find `tests` folder in a root of application. This because every application `frontend`, `backend`, and their `common` has their own tests. This is done to have tests and source to be placed in a same location. To run all tests from all application at once, you should execute `codecept run` from a project root. Global `codeception.yml` config was written to include tests from all applications.

![](https://codeception.com/images/yii-advanced-tests.png)

Tests also include namespaces for testcase classes and testers to avoid conflicts between tests from different applications.

## Manual Setup && Configuration

To start you need to install Codeception via Composer

```
composer require "codeception/codeception" --dev
```

Create basic test suites

```
./vendor/bin/codecept bootstrap
```

Enable module Yii2 for functional tests inside `functional.suite.yml`:

```
<span># functional.suite.yml</span>
<span>modules</span><span>:</span>
    <span>enabled</span><span>:</span>
        <span>-</span> <span>Yii2</span><span>:</span>
            <span>configFile</span><span>:</span> <span>#insert path to config file</span>
```

The only required parameter for Yii2 module is `configFile`. This file with configuration for test configuration of Yii application. It should merge original application config overriding `id` value and provide different database for testing:

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

Test config is recommended to store in `config` folder of application. You should provide path to test config relatively to `codeception.yml` file.

Please also make sure that `YII_ENV` constant is set to `test` as it is done in `tests/_bootstrap.php` file of basic and advanced app templates.

Once you configured functional tests it should be easy to create setup for unit and acceptance tests, as it is described in this guide.

In basic and advanced application templates `configFile` is defined in global configuration file:

```
<span># inside codeception.yml</span>
<span>modules</span><span>:</span>
    <span>config</span><span>:</span>
        <span>Yii2</span><span>:</span>
            <span>configFile</span><span>:</span> <span>'</span><span>config/test.php'</span>
```

This way we don’t need to provide test config for each defined suite.
