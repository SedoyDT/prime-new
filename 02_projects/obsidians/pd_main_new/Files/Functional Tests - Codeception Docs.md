---
created: 2024-02-18T08:33:40 (UTC +03:00)
tags: []
source: https://codeception.com/docs/FunctionalTests
author: 
tags:
 - web
 - firefox
---
[[2024-02-18]]

# Functional Tests - Codeception Docs

> ## Excerpt
> 💡 You are reading docs for latest Codeception 5. Read for 4.x

---
💡 **You are reading docs for latest Codeception 5**. [Read for 4.x](https://codeception.com/docs/4.x/FunctionalTests)

Now that we’ve written some acceptance tests, functional tests are almost the same, with one major difference: Functional tests don’t require a web server.

Under the hood, Codeception uses Symfony’s [BrowserKit](https://symfony.com/doc/current/components/browser_kit.html) to “send” requests to your app. So there’s no real HTTP request made, but rather a BrowserKit [Request object](https://github.com/symfony/browser-kit/blob/master/Request.php) with the required properties is passed to your framework’s (front-)controller.

As a first step, you need to enable Codeception’s module for your framework in `Functional.suite.yml` (see below).

All of Codeception’s framework modules share the same interface, and thus your tests are not bound to any one of them. This is a sample functional test:

```


<span>namespace</span> <span>Tests\Functional</span><span>;</span>

<span>use</span> <span>\</span><span>Tests\Support\FunctionalTester</span><span>;</span>

<span>class</span> <span>LoginCest</span>
<span>{</span>
    <span>public</span> <span>function</span> <span>tryLogin</span><span>(</span><span>FunctionalTester</span> <span>$I</span><span>)</span>
    <span>{</span>
        <span>$I</span><span>-&gt;</span><span>amOnPage</span><span>(</span><span>'/'</span><span>);</span>
        <span>$I</span><span>-&gt;</span><span>click</span><span>(</span><span>'Login'</span><span>);</span>
        <span>$I</span><span>-&gt;</span><span>fillField</span><span>(</span><span>'Username'</span><span>,</span> <span>'Miles'</span><span>);</span>
        <span>$I</span><span>-&gt;</span><span>fillField</span><span>(</span><span>'Password'</span><span>,</span> <span>'Davis'</span><span>);</span>
        <span>$I</span><span>-&gt;</span><span>click</span><span>(</span><span>'Enter'</span><span>);</span>
        <span>$I</span><span>-&gt;</span><span>see</span><span>(</span><span>'Hello, Miles'</span><span>,</span> <span>'h1'</span><span>);</span>
        <span>// $I-&gt;seeEmailIsSent(); // only for Symfony</span>
    <span>}</span>
<span>}</span>
```

As you see, the syntax is the same for functional and acceptance tests.

## Limitations

Functional tests are usually much faster than acceptance tests. But functional tests are less stable as they run Codeception and the application in one environment. If your application was not designed to run in long lived processes (e.g. if you use the `exit` operator or global variables), then functional tests are probably not for you.

One of the common issues with functional tests is the use of PHP functions that deal with headers, sessions and cookies. As you may already know, the `header` function triggers an error if it is executed after PHP has already output something. In functional tests we run the application multiple times, thus we will get lots of irrelevant errors in the result.

### External URLs

Functional tests cannot access external URLs, just URLs within your project. You can use PhpBrowser to open external URLs.

### Shared Memory

In functional testing, unlike running the application the traditional way, the PHP application does not stop after it has finished processing a request. Since all requests are run in one memory container, they are not isolated. So **if you see that your tests are mysteriously failing when they shouldn’t - try to execute a single test.** This will show if the tests were failing because they weren’t isolated during the run. Keep your memory clean, avoid memory leaks and clean global and static variables.

## Enabling Framework Modules

You have a functional testing suite in the `tests/functional` directory. To start, you need to include one of the framework modules in the suite configuration file: `tests/Functional.suite.yml`.

### Symfony

To perform Symfony integration you just need to include the Symfony module into your test suite. If you also use Doctrine2, don’t forget to include it too. To make the Doctrine2 module connect using the `doctrine` service from Symfony, you should specify the Symfony module as a dependency for Doctrine2:

```
<span># Functional.suite.yml</span>

<span>actor</span><span>:</span> <span>FunctionalTester</span>
<span>modules</span><span>:</span>
    <span>enabled</span><span>:</span>
        <span>-</span> <span>Symfony</span>
        <span>-</span> <span>Doctrine2</span><span>:</span>
            <span>depends</span><span>:</span> <span>Symfony</span> <span># connect to Symfony</span>
```

By default this module will search for AppKernel in the `app` directory.

The module uses the Symfony Profiler to provide additional information and assertions.

[See the full reference](https://codeception.com/docs/modules/Symfony)

### Laravel

The [Laravel](https://codeception.com/docs/modules/Laravel) module is included and requires no configuration:

```
<span># Functional.suite.yml</span>

<span>actor</span><span>:</span> <span>FunctionalTester</span>
<span>modules</span><span>:</span>
    <span>enabled</span><span>:</span>
        <span>-</span> <span>Laravel</span>
```

### Yii2

Yii2 tests are included in [Basic](https://github.com/yiisoft/yii2-app-basic) and [Advanced](https://github.com/yiisoft/yii2-app-advanced) application templates. Follow the Yii2 guides to start.

### Laminas

[Laminas](https://codeception.com/docs/modules/Laminas) tests can be executed with enabling a corresponding module.

```
<span># Functional.suite.yml</span>

<span>actor</span><span>:</span> <span>FunctionalTester</span>
<span>modules</span><span>:</span>
    <span>enabled</span><span>:</span>
        <span>-</span> <span>Laminas</span>
```

> See module reference to more configuration options

### Phalcon 5

The `Phalcon5` module requires creating a bootstrap file which returns an instance of `\Phalcon\Mvc\Application`. To start writing functional tests with Phalcon support you should enable the `Phalcon5` module and provide the path to this bootstrap file:

```
<span># Functional.suite.yml</span>

<span>actor</span><span>:</span> <span>FunctionalTester</span>
<span>modules</span><span>:</span>
    <span>enabled</span><span>:</span>
        <span>-</span> <span>Phalcon5</span><span>:</span>
            <span>bootstrap</span><span>:</span> <span>'</span><span>app/config/bootstrap.php'</span>
             <span>cleanup</span><span>:</span> <span>true</span>
             <span>savepoints</span><span>:</span> <span>true</span>
```

[See the full reference](https://codeception.com/docs/modules/Phalcon4)

## Writing Functional Tests

Functional tests are written in the same manner as [Acceptance Tests](https://codeception.com/docs/03-AcceptanceTests) with the `PhpBrowser` module enabled. All framework modules and the `PhpBrowser` module share the same methods and the same engine.

Therefore we can open a web page with `amOnPage` method:

We can click links to open web pages:

```
<span>$I</span><span>-&gt;</span><span>click</span><span>(</span><span>'Logout'</span><span>);</span>
<span>// click link inside .nav element</span>
<span>$I</span><span>-&gt;</span><span>click</span><span>(</span><span>'Logout'</span><span>,</span> <span>'.nav'</span><span>);</span>
<span>// click by CSS</span>
<span>$I</span><span>-&gt;</span><span>click</span><span>(</span><span>'a.logout'</span><span>);</span>
<span>// click with strict locator</span>
<span>$I</span><span>-&gt;</span><span>click</span><span>([</span><span>'class'</span> <span>=&gt;</span> <span>'logout'</span><span>]);</span>
```

We can submit forms as well:

```
<span>$I</span><span>-&gt;</span><span>submitForm</span><span>(</span><span>'form#login'</span><span>,</span> <span>[</span><span>'name'</span> <span>=&gt;</span> <span>'john'</span><span>,</span> <span>'password'</span> <span>=&gt;</span> <span>'123456'</span><span>]);</span>
<span>// alternatively</span>
<span>$I</span><span>-&gt;</span><span>fillField</span><span>(</span><span>'#login input[name=name]'</span><span>,</span> <span>'john'</span><span>);</span>
<span>$I</span><span>-&gt;</span><span>fillField</span><span>(</span><span>'#login input[name=password]'</span><span>,</span> <span>'123456'</span><span>);</span>
<span>$I</span><span>-&gt;</span><span>click</span><span>(</span><span>'Submit'</span><span>,</span> <span>'#login'</span><span>);</span>
```

And do assertions:

```
<span>$I</span><span>-&gt;</span><span>see</span><span>(</span><span>'Welcome, john'</span><span>);</span>
<span>$I</span><span>-&gt;</span><span>see</span><span>(</span><span>'Logged in successfully'</span><span>,</span> <span>'.notice'</span><span>);</span>
<span>$I</span><span>-&gt;</span><span>seeCurrentUrlEquals</span><span>(</span><span>'/profile/john'</span><span>);</span>
```

Framework modules also contain additional methods to access framework internals. For instance, Laravel, Phalcon, and Yii2 modules have a `seeRecord` method which uses the ActiveRecord layer to check that a record exists in the database.

Take a look at the complete reference for the module you are using. Most of its methods are common to all modules but some of them are unique.

You can also access framework globals inside a test or access the dependency injection container inside the `Helper\Functional` class:

```


<span>namespace</span> <span>Tests\Support\Helper</span><span>;</span>

<span>class</span> <span>Functional</span> <span>extends</span> <span>\</span><span>Codeception\Module</span>
<span>{</span>
    <span>function</span> <span>doSomethingWithMyService</span><span>()</span>
    <span>{</span>
        <span>$service</span> <span>=</span> <span>$this</span><span>-&gt;</span><span>getModule</span><span>(</span><span>'Symfony'</span><span>)</span><span>-&gt;</span><span>grabServiceFromContainer</span><span>(</span><span>'myservice'</span><span>);</span>
        <span>$service</span><span>-&gt;</span><span>doSomething</span><span>();</span>
    <span>}</span>
<span>}</span>
```

Also check all available _Public Properties_ of the used modules to get full access to their data.

## Error Reporting

By default Codeception uses the `E_ALL & ~E_STRICT & ~E_DEPRECATED` error reporting level. In functional tests you might want to change this level depending on your framework’s error policy. The error reporting level can be set in the suite configuration file:

```
<span>actor</span><span>:</span> <span>FunctionalTester</span>
<span>...</span>
<span>error_level</span><span>:</span> <span>E_ALL &amp; ~E_STRICT &amp; ~E_DEPRECATED</span>
```

`error_level` can also be set globally in `codeception.yml` file. In order to do that, you need to specify `error_level` as a part of `settings`. For more information, see [Global Configuration](https://codeception.com/docs/reference/Configuration). Note that suite specific `error_level` value will override global value.

## Conclusion

Functional tests are great if you are using powerful frameworks. By using functional tests you can access and manipulate their internal state. This makes your tests shorter and faster. In other cases, if you don’t use frameworks there is no practical reason to write functional tests. If you are using a framework other than the ones listed here, create a module for it and share it with the community.

Don't know how to write tests on your own? We will build or improve them for you. **Request a quote for official [enterprise support](https://sdclabs.com/codeception?utm_source=codeception.com&utm_medium=docs_bottom&utm_term=link&utm_campaign=reference) or [trainings](https://sdclabs.com/trainings?utm_source=codeception.com&utm_medium=docs_bottom&utm_term=link&utm_campaign=reference)**
