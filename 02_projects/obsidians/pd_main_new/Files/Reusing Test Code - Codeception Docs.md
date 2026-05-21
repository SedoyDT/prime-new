---
created: 2024-02-18T17:26:46 (UTC +03:00)
tags: []
source: https://codeception.com/docs/ReusingTestCode
author: 
---

# Reusing Test Code - Codeception Docs

> ## Excerpt
> Вы читаете документы для последней версии Codeception 5

---
💡

**Вы читаете документы для последней версии Codeception 5**

. [Читать для 4.x](https://codeception.com/docs/4.x/ReusingTestCode)

## Повторное использование тестового кода

Codeception использует модульность для создания удобной среды тестирования для каждого написанного вами набора тестов. Модули позволяют выбирать действия и утверждения, которые могут выполняться в тестах.

## Что такое действующие лица

Все действия и утверждения, которые могут выполняться объектом-субъектом в классе, определены в модулях. Может показаться, что Codeception ограничивает вас в тестировании, но это не так. Вы можете расширить набор тестов своими собственными действиями и утверждениями, записав их в пользовательский модуль, называемый помощником. Мы вернемся к этому позже в этой главе, а пока давайте рассмотрим следующий тест:

```
<span>$I</span><span>-&gt;</span><span>amOnPage</span><span>(</span><span>'/'</span><span>);</span>
<span>$I</span><span>-&gt;</span><span>see</span><span>(</span><span>'Hello'</span><span>);</span>
<span>$I</span><span>-&gt;</span><span>seeInDatabase</span><span>(</span><span>'users'</span><span>,</span> <span>[</span><span>'id'</span> <span>=&gt;</span> <span>1</span><span>]);</span>
<span>$I</span><span>-&gt;</span><span>seeFileFound</span><span>(</span><span>'running.lock'</span><span>);</span>
```

Он может работать с различными объектами: веб-страница может быть загружена с помощью модуля PhpBrowser, утверждение базы данных использует модуль Db, а состояние файла может быть проверено с помощью модуля файловой системы.

Модули прикреплены к классам-исполнителям в конфигурации пакета. Например, в `tests/Acceptance.suite.yml` мы должны увидеть:

```
<span>actor</span><span>:</span> <span>AcceptanceTester</span>
<span>modules</span><span>:</span>
    <span>enabled</span><span>:</span>
        <span>-</span> <span>PhpBrowser</span><span>:</span>
            <span>url</span><span>:</span> <span>http://localhost</span>
        <span>-</span> <span>Db</span>
        <span>-</span> <span>Filesystem</span>
```

Методы класса AcceptanceTester определены в модулях. Давайте посмотрим, что находится внутри `AcceptanceTester` класса, который расположен внутри `tests/Support` каталога:

```


<span>declare</span><span>(</span><span>strict_types</span><span>=</span><span>1</span><span>);</span>

<span>namespace</span> <span>Tests\Support</span><span>;</span>

<span>/**
 * Inherited Methods
 * @method void wantToTest($text)
 * @method void wantTo($text)
 * @method void execute($callable)
 * @method void expectTo($prediction)
 * @method void expect($prediction)
 * @method void amGoingTo($argumentation)
 * @method void am($role)
 * @method void lookForwardTo($achieveValue)
 * @method void comment($description)
 * @method void haveFriend($name, $actorClass = null)
 *
 * @SuppressWarnings(PHPMD)
*/</span>
<span>class</span> <span>AcceptanceTester</span> <span>extends</span> <span>\</span><span>Codeception\Actor</span>
<span>{</span>
    <span>use</span> <span>_generated\AcceptanceTesterActions</span><span>;</span>

   <span>/**
    * Define custom actions here
    */</span>
<span>}</span>
```

Наиболее важной частью является `_generated\AcceptanceTesterActions` функция, которая используется в качестве прокси для включенных модулей. Она знает, какой модуль выполняет какое действие, и передает в него параметры. Эта функция была создана при запуске `codecept build` и обновляется при каждом изменении модуля или конфигурации.

> Используйте классы участников для задания общих действий, которые могут использоваться в рамках всего набора.

## PageObjects

Для приемо-сдаточного и функционального тестирования нам понадобятся не только общие действия, повторно используемые в разных тестах, но и кнопки, ссылки и поля формы, которые также будут использоваться повторно. Для этих случаев нам необходимо реализовать [шаблон PageObject](https://www.selenium.dev/documentation/en/guidelines_and_recommendations/page_object_models/), который широко используется инженерами по автоматизации тестирования. Шаблон PageObject представляет веб-страницу как класс, элементы DOM на этой странице - как ее свойства, а некоторые базовые взаимодействия - как ее методы. Объекты PageObjects очень важны при разработке гибкой архитектуры ваших приемо-сдаточных или функциональных тестов. Не программируйте сложные локаторы CSS или XPath в своих тестах жестко, а скорее переместите их в классы PageObject.

Codeception может сгенерировать для вас класс PageObject с помощью command:

```
php vendor/bin/codecept generate:pageobject acceptance Login
```

> Рекомендуется использовать объекты page только для приемочного тестирования

Это создаст `Login` класс в `tests/Support/Page/Acceptance`. Базовый PageObject - это не что иное, как пустой класс с несколькими заглушками.

Ожидается, что вы заполните его локаторами пользовательского интерфейса страницы, которую он представляет. Локаторы могут быть добавлены как общедоступные свойства:

```


<span>namespace</span> <span>Tests\Support\Page\Acceptance</span><span>;</span>

<span>class</span> <span>Login</span>
<span>{</span>
    <span>public</span> <span>static</span> <span>$URL</span> <span>=</span> <span>'/login'</span><span>;</span>

    <span>public</span> <span>$usernameField</span> <span>=</span> <span>'#mainForm #username'</span><span>;</span>
    <span>public</span> <span>$passwordField</span> <span>=</span> <span>'#mainForm input[name=password]'</span><span>;</span>
    <span>public</span> <span>$loginButton</span> <span>=</span> <span>'#mainForm input[type=submit]'</span><span>;</span>

    <span>// ...</span>
<span>}</span>
```

Но давайте двигаться дальше. Концепция PageObject определяет, что методы для взаимодействия со страницей также должны храниться в классе PageObject.

Давайте определим `login` метод в этом классе:

```
<span>namespace</span> <span>Tests\Support\Page\Acceptance</span><span>;</span>

<span>use</span> <span>Tests\Support\AcceptanceTester</span><span>;</span>

<span>class</span> <span>Login</span>
<span>{</span>
    <span>public</span> <span>static</span> <span>$URL</span> <span>=</span> <span>'/login'</span><span>;</span>

    <span>public</span> <span>$usernameField</span> <span>=</span> <span>'#mainForm #username'</span><span>;</span>
    <span>public</span> <span>$passwordField</span> <span>=</span> <span>'#mainForm input[name=password]'</span><span>;</span>
    <span>public</span> <span>$loginButton</span> <span>=</span> <span>'#mainForm input[type=submit]'</span><span>;</span>

    <span>protected</span> <span>AcceptanceTester</span> <span>$tester</span><span>;</span>

    <span>// we inject AcceptanceTester into our class</span>
    <span>public</span> <span>function</span> <span>__construct</span><span>(</span><span>AcceptanceTester</span> <span>$I</span><span>)</span>
    <span>{</span>
        <span>$this</span><span>-&gt;</span><span>tester</span> <span>=</span> <span>$I</span><span>;</span>
    <span>}</span>

    <span>public</span> <span>function</span> <span>login</span><span>(</span><span>$name</span><span>,</span> <span>$password</span><span>)</span>
    <span>{</span>
        <span>$I</span> <span>=</span> <span>$this</span><span>-&gt;</span><span>tester</span><span>;</span>

        <span>$I</span><span>-&gt;</span><span>amOnPage</span><span>(</span><span>self</span><span>::</span><span>$URL</span><span>);</span>
        <span>$I</span><span>-&gt;</span><span>fillField</span><span>(</span><span>$this</span><span>-&gt;</span><span>usernameField</span><span>,</span> <span>$name</span><span>);</span>
        <span>$I</span><span>-&gt;</span><span>fillField</span><span>(</span><span>$this</span><span>-&gt;</span><span>passwordField</span><span>,</span> <span>$password</span><span>);</span>
        <span>$I</span><span>-&gt;</span><span>click</span><span>(</span><span>$this</span><span>-&gt;</span><span>loginButton</span><span>);</span>
    <span>}</span>
<span>}</span>
```

Если вы укажете, какой объект вам нужен для теста, Codeception попытается создать его с помощью контейнера внедрения зависимостей. В случае PageObject вы должны объявить класс в качестве параметра для тестового метода:

```


<span>namespace</span> <span>Tests\Acceptance</span><span>;</span>

<span>use</span> <span>\</span><span>Tests\Support\AcceptanceTester</span><span>;</span>
<span>use</span> <span>\</span><span>Tests\Support\Page\Acceptance\Login</span><span>;</span>

<span>class</span> <span>UserCest</span>
<span>{</span>
    <span>function</span> <span>showUserProfile</span><span>(</span><span>AcceptanceTester</span> <span>$I</span><span>,</span> <span>Login</span> <span>$loginPage</span><span>)</span>
    <span>{</span>
        <span>$loginPage</span><span>-&gt;</span><span>login</span><span>(</span><span>'bill evans'</span><span>,</span> <span>'debby'</span><span>);</span>
        <span>$I</span><span>-&gt;</span><span>amOnPage</span><span>(</span><span>'/profile'</span><span>);</span>
        <span>$I</span><span>-&gt;</span><span>see</span><span>(</span><span>'Bill Evans Profile'</span><span>,</span> <span>'h1'</span><span>);</span>
    <span>}</span>
<span>}</span>
```

Контейнер для внедрения зависимостей может создавать любой объект, для которого требуется любой известный тип класса. Например, `Page\Login` требуется `AcceptanceTester`, и поэтому оно было введено в `Page\Login`конструктор, и был создан PageObject, который был передан в аргументы метода. Вы должны явно указать типы необходимых объектов для Codeception, чтобы знать, какие объекты следует создавать для теста. Внедрение зависимостей будет описано в следующей главе.

## StepObjects

StepObjects отлично подходят, если вам нужна общая функциональность для группы тестов. Допустим, вы собираетесь протестировать область администрирования сайта. Вероятно, вам не понадобятся те же действия из области администрирования при тестировании интерфейса, поэтому хорошей идеей будет перенести эти тесты, специфичные для администратора, в их собственный класс. Мы называем такой класс StepObjects .

Позволяет создать Admin StepObject с помощью генератора:

```
php vendor/bin/codecept generate:stepobject acceptance Admin
```

Вы можете указать необязательные имена действий. Вводите по одному, затем переводите строку. Завершите пустой строкой, чтобы продолжить создание StepObject.

```
php vendor/bin/codecept generate:stepobject acceptance Admin
Add action to StepObject class (ENTER to exit): loginAsAdmin
Add action to StepObject class (ENTER to exit):
StepObject was created in /tests/acceptance/_support/Step/Acceptance/Admin.php
```

Это сгенерирует класс в `/tests/Support/Step/Acceptance/Admin.php` похожий на этот:

```

<span>namespace</span> <span>Tests\Support\Step\Acceptance</span><span>;</span>

<span>use</span> <span>Tests\Support\AcceptanceTester</span><span>;</span>

<span>class</span> <span>Admin</span> <span>extends</span> <span>AcceptanceTester</span>
<span>{</span>
    <span>public</span> <span>function</span> <span>loginAsAdmin</span><span>()</span>
    <span>{</span>
        <span>$I</span> <span>=</span> <span>$this</span><span>;</span>
    <span>}</span>
<span>}</span>
```

Как вы видите, этот класс очень прост. Он расширяет `AcceptanceTester`класс, что означает, что он может получить доступ ко всем методам и свойствам `AcceptanceTester`.

`loginAsAdmin` Метод может быть реализован следующим образом:

```


<span>namespace</span> <span>Tests\Support\Step\Acceptance</span><span>;</span>

<span>use</span> <span>Tests\Support\AcceptanceTester</span><span>;</span>

<span>class</span> <span>Admin</span> <span>extends</span> <span>AcceptanceTester</span>
<span>{</span>
    <span>public</span> <span>function</span> <span>loginAsAdmin</span><span>()</span>
    <span>{</span>
        <span>$I</span> <span>=</span> <span>$this</span><span>;</span>
        <span>$I</span><span>-&gt;</span><span>amOnPage</span><span>(</span><span>'/admin'</span><span>);</span>
        <span>$I</span><span>-&gt;</span><span>fillField</span><span>(</span><span>'username'</span><span>,</span> <span>'admin'</span><span>);</span>
        <span>$I</span><span>-&gt;</span><span>fillField</span><span>(</span><span>'password'</span><span>,</span> <span>'123456'</span><span>);</span>
        <span>$I</span><span>-&gt;</span><span>click</span><span>(</span><span>'Login'</span><span>);</span>
    <span>}</span>
<span>}</span>
```

Экземпляр StepObject может быть создан автоматически при использовании в формате Cest:

```

<span>namespace</span> <span>Tests\Acceptance</span><span>;</span>

<span>use</span> <span>Tests\Support\Step\Acceptance\Admin</span><span>;</span>

<span>class</span> <span>UserCest</span>
<span>{</span>
    <span>function</span> <span>showUserProfile</span><span>(</span><span>Admin</span> <span>$I</span><span>)</span>
    <span>{</span>
        <span>$I</span><span>-&gt;</span><span>loginAsAdmin</span><span>();</span>
        <span>$I</span><span>-&gt;</span><span>amOnPage</span><span>(</span><span>'/admin/profile'</span><span>);</span>
        <span>$I</span><span>-&gt;</span><span>see</span><span>(</span><span>'Admin Profile'</span><span>,</span> <span>'h1'</span><span>);</span>
    <span>}</span>
<span>}</span>
```

Если у вас сложный сценарий взаимодействия, вы можете использовать несколько объектов step в одном тесте. Если вам захочется добавить слишком много действий в свой класс Actor (в данном случае это AcceptanceTester), рассмотрите возможность переноса некоторых из них в отдельные StepObjects.

> Используйте StepObjects, когда у вас есть несколько областей применения или несколько ролей.

## Заключение

Существует множество способов создания повторно используемых и читаемых тестов. Сгруппируйте общие действия и переместите их в класс Actor или StepObjects. Переместите локаторы CSS и XPath в PageObjects. Запишите свои пользовательские действия и утверждения в хелперах. Тесты, основанные на сценариях, не должны содержать ничего более сложного, чем `$I->doSomething` команды. Следование этому подходу позволит вам сохранить ваши тесты чистыми, читаемыми, стабильными и упростит их обслуживание.

[**Улучшите** это руководство](https://github.com/Codeception/codeception.github.com/edit/master/docs/ReusingTestCode.md)
