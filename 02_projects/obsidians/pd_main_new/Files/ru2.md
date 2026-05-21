---
created: 2024-02-18T08:52:58 (UTC +03:00)
tags: []
source: https://codeception.com/docs/4.x/FunctionalTests
author: 
---

# FunctionalTests - Codeception 4 Documentation

> ## Excerpt
> Теперь, когда мы написали несколько приемочных тестов, функциональные тесты почти такие же, с одним существенным отличием: для функциональных тестов не требуется веб-сервер.

---
## Функциональные тесты

Теперь, когда мы написали несколько приемочных тестов, функциональные тесты почти такие же, с одним существенным отличием: для функциональных тестов не требуется веб-сервер.

По сути, Codeception использует [BrowserKit](https://symfony.com/doc/current/components/browser_kit.html) от Symfony для “отправки” запросов в ваше приложение. Таким образом, реальный HTTP-запрос не выполняется, а скорее на (front-) контроллер вашего фреймворка передается [объект запроса](https://github.com/symfony/browser-kit/blob/master/Request.php) BrowserKit с требуемыми свойствами.

В качестве первого шага вам необходимо включить модуль Codeception для вашего фреймворка в `functional.suite.yml` (см. Ниже).

Все модули Codeception framework используют один и тот же интерфейс, и, следовательно, ваши тесты не привязаны ни к одному из них. Это пример функционального теста:

```php
// LoginCest.php class LoginCest { public function tryLogin(FunctionalTester $I) { $I->amOnPage('/'); $I->click('Login'); $I->fillField('Username', 'Miles'); $I->fillField('Password', 'Davis'); $I->click('Enter'); $I->see('Hello, Miles', 'h1'); // $I->seeEmailIsSent(); // only for Symfony } }
```

Как вы видите, синтаксис одинаков для функциональных и приемочных тестов.

## Ограничения

Функциональные тесты обычно выполняются намного быстрее, чем приемочные тесты. Но функциональные тесты менее стабильны, поскольку они запускают Codeception и приложение в одной среде. Если ваше приложение не было разработано для запуска в долговременных процессах (например, если вы используете `exit` оператор или глобальные переменные), то функциональные тесты, вероятно, не для вас.

Одной из распространенных проблем, связанных с функциональными тестами, является использование функций PHP, которые имеют дело с заголовками, сеансами и файлами cookie. Как вы, возможно, уже знаете, `header` функция выдает ошибку, если она выполняется после того, как PHP уже что-то вывел. В функциональных тестах мы запускаем приложение несколько раз, таким образом, в результате получаем множество несущественных ошибок.

### Внешние URL-адреса

Функциональные тесты не могут обращаться к внешним URL-адресам, только к URL-адресам внутри вашего проекта. Вы можете использовать PhpBrowser для открытия внешних URL-адресов.

### Общая память

При функциональном тестировании, в отличие от запуска приложения традиционным способом, PHP-приложение не останавливается после завершения обработки запроса. Поскольку все запросы выполняются в одном контейнере памяти, они не изолированы. Итак, **если вы видите, что ваши тесты таинственным образом завершаются сбоем, хотя и не должны были - попробуйте выполнить один тест.** Это покажет, завершались ли тесты сбоем из-за того, что они не были изолированы во время выполнения. Поддерживайте чистоту вашей памяти, избегайте утечек памяти и очищайте глобальные и статические переменные.

## Включение модулей фреймворка

У вас есть набор для функционального тестирования в `tests/functional` каталоге. Для начала вам необходимо включить один из модулей framework в файл конфигурации набора: `tests/functional.suite.yml`.

### Symfony

Для выполнения интеграции с Symfony вам просто нужно включить модуль Symfony в свой набор тестов. Если вы также используете Doctrine2, не забудьте включить и его. Чтобы заставить модуль Doctrine2 подключаться с помощью `doctrine` сервиса Symfony, вы должны указать модуль Symfony в качестве зависимости для Doctrine2:

```yaml
# functional.suite.yml actor: FunctionalTester modules: enabled: - Symfony - Doctrine2: depends: Symfony # connect to Symfony
```

По умолчанию этот модуль будет выполнять поиск AppKernel в `app` каталоге.

Модуль использует профилировщик Symfony для предоставления дополнительной информации и утверждений.

[See the full reference](https://codeception.com/docs/modules/Symfony)

### Laravel5

Модуль [Laravel5](https://codeception.com/docs/modules/Laravel5) включен в комплект поставки и не требует настройки:

```yaml
# functional.suite.yml actor: FunctionalTester modules: enabled: - Laravel5
```

### Yii2

Тесты Yii2 включены в шаблоны приложений [Basic](https://github.com/yiisoft/yii2-app-basic) и [Advanced](https://github.com/yiisoft/yii2-app-advanced). Для начала следуйте руководствам по Yii2.

### Zend Framework 2

Используйте [модуль ZF2](https://codeception.com/docs/modules/ZF2) для запуска функциональных тестов внутри Zend Framework 2:

```yaml
# functional.suite.yml actor: FunctionalTester modules: enabled: - ZF2
```

### Zend Expressive

[Выразительные](https://codeception.com/docs/modules/ZendExpressive) тесты Zend могут выполняться при включении соответствующего модуля.

```yaml
# functional.suite.yml actor: FunctionalTester modules: enabled: - ZendExpressive
```

> Смотрите ссылку на модуль для получения дополнительных параметров конфигурации

### Phalcon 4

Для `Phalcon4` модуля требуется создать загрузочный файл, который возвращает экземпляр `\Phalcon\Mvc\Application`. Чтобы начать писать функциональные тесты с поддержкой Phalcon, вы должны включить `Phalcon4` модуль и указать путь к этому загрузочному файлу:

```yaml
# functional.suite.yml actor: FunctionalTester modules: enabled: - Phalcon4: bootstrap: 'app/config/bootstrap.php' cleanup: true savepoints: true
```

[Смотрите полную ссылку](https://codeception.com/docs/modules/Phalcon4)

## Написание функциональных тестов

Функциональные тесты пишутся тем же способом, что и [приемочные тесты](https://codeception.com/docs/03-AcceptanceTests) с включенным `PhpBrowser` модулем. Все модули framework и `PhpBrowser` модуль используют одни и те же методы и один и тот же движок.

Поэтому мы можем открыть веб-страницу с помощью `amOnPage` метода:

```php
$I->amOnPage('/login');
```

Мы можем нажимать на ссылки, чтобы открывать веб-страницы:

```php
$I->click('Logout'); // click link inside .nav element $I->click('Logout', '.nav'); // click by CSS $I->click('a.logout'); // click with strict locator $I->click(['class' => 'logout']);
```

Мы также можем отправлять формы:

```php
$I->submitForm('form#login', ['name' => 'john', 'password' => '123456']); // alternatively $I->fillField('#login input[name=name]', 'john'); $I->fillField('#login input[name=password]', '123456'); $I->click('Submit', '#login');
```

И выполняйте утверждения:

```php
$I->see('Welcome, john'); $I->see('Logged in successfully', '.notice'); $I->seeCurrentUrlEquals('/profile/john');
```

Модули фреймворка также содержат дополнительные методы для доступа к внутренним компонентам фреймворка. Например, модули Laravel5, Phalcon, и Yii2 имеют `seeRecord` метод, который использует уровень ActiveRecord для проверки наличия записи в базе данных.

Взгляните на полный справочник по используемому модулю. Большинство его методов являются общими для всех модулей, но некоторые из них уникальны.

Вы также можете получить доступ к глобальным файлам фреймворка внутри теста или получить доступ к контейнеру внедрения зависимостей внутри `Helper\Functional` класса:

```php
namespace Helper; class Functional extends \Codeception\Module { function doSomethingWithMyService() { $service = $this->getModule('Symfony')->grabServiceFromContainer('myservice'); $service->doSomething(); } }
```

Также проверьте все доступные _общедоступные свойства_ используемых модулей, чтобы получить полный доступ к их данным.

## Сообщение об ошибках

По умолчанию Codeception использует `E_ALL & ~E_STRICT & ~E_DEPRECATED` уровень отчетов об ошибках. В функциональных тестах вы можете захотеть изменить этот уровень в зависимости от политики ошибок вашего фреймворка. Уровень отчетов об ошибках можно установить в файле конфигурации пакета:

```yaml
actor: FunctionalTester ... error_level: E_ALL & ~E_STRICT & ~E_DEPRECATED
```

`error_level` также могут быть установлены глобально в `codeception.yml` файле. Для этого вам необходимо указать `error_level` как часть `settings`. Для получения дополнительной информации см. в разделе [Глобальная конфигурация](https://codeception.com/docs/reference/Configuration). Обратите внимание, что значение, зависящее от набора, `error_level` переопределяет глобальное значение.

## Заключение

Функциональные тесты хороши, если вы используете мощные фреймворки. Используя функциональные тесты, вы можете получать доступ к их внутреннему состоянию и манипулировать им. Это делает ваши тесты короче и быстрее. В других случаях, если вы не используете фреймворки, нет практической причины писать функциональные тесты. Если вы используете фреймворк, отличный от перечисленных здесь, создайте для него модуль и поделитесь им с сообществом.

-   **Следующая глава: [UnitTests >](https://codeception.com/docs/05-UnitTests)**
-   **Предыдущая глава: [< Тесты принятия](https://codeception.com/docs/03-AcceptanceTests)**

[**Отредактируйте** эту страницу на GitHub](https://github.com/Codeception/codeception.github.com/edit/master/docs/4.x/FunctionalTests.md)



