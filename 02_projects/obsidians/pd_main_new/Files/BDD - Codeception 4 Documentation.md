---
created: 2024-02-18T17:34:05 (UTC +03:00)
tags: []
source: https://codeception.com/docs/4.x/BDD
author: 
---

# BDD - Codeception 4 Documentation

> ## Excerpt
> Разработка, ориентированная на поведение (BDD), является популярной методологией разработки программного обеспечения. BDD считается расширением TDD и в значительной степени вдохновлена гибкими практиками. Основная причина выбора BDD в качестве процесса разработки - это устранение коммуникационных барьеров между бизнес- и техническими командами. BDD поощряет использование автоматического тестирования для проверки всех документированных функций проекта с самого начала. Вот почему принято говорить о BDD в контексте тестовых фреймворков (таких как Codeception). Однако подход BDD - это гораздо больше, чем тестирование - это общий язык для всех членов команды, который они могут использовать в процессе разработки.

---
## Разработка, ориентированная на поведение

Разработка, ориентированная на поведение (BDD), является популярной методологией разработки программного обеспечения. BDD считается расширением TDD и в значительной степени вдохновлена [гибкими](https://agilemanifesto.org/) практиками. Основная причина выбора BDD в качестве процесса разработки - это устранение коммуникационных барьеров между бизнес- и техническими командами. BDD поощряет использование автоматического тестирования для проверки всех документированных функций проекта с самого начала. Вот почему принято говорить о BDD в контексте тестовых фреймворков (таких как Codeception). Однако подход BDD - это гораздо больше, чем тестирование - это общий язык для всех членов команды, который они могут использовать в процессе разработки.

## Что такое разработка, ориентированная на поведение

BDD был представлен [Дэном Нортом](https://dannorth.net/introducing-bdd/). Он описал его как:

> методология "извне", основанная на извлечении данных, с участием многих заинтересованных сторон, многоуровневая, высокоавтоматизированная, гибкая. Она описывает цикл взаимодействий с четко определенными результатами, результатом которых является предоставление работающего, протестированного программного обеспечения, которое имеет значение.

BDD претерпевает собственную эволюцию с тех пор, как появился на свет, начатую с замены “test” на “should” в модульных тестах и перехода к мощным инструментам, таким как Cucumber и Behat, которые позволяют выполнять пользовательские истории (читаемый человеком текст) в качестве приемочного теста.

Идею сюжетного BDD можно сузить до:

-   опишите функции в сценарии с помощью формального текста
-   используйте примеры, чтобы конкретизировать абстрактные вещи
-   реализуйте каждый шаг сценария для тестирования
-   напишите фактический код, реализующий эту функцию

Записывая каждую функцию в формате User Story, которая автоматически выполняется в качестве теста, мы гарантируем, что бизнес, разработчики, QA и менеджеры находятся в одной лодке.

BDD поощряет изучение и обсуждение с целью формализации требований и функций, которые необходимо реализовать, предлагая писать истории пользователей так, чтобы их мог понять каждый.

Делая тесты частью истории пользователя, BDD позволяет нетехническому персоналу писать (или редактировать) приемочные тесты.

С помощью этой процедуры мы также гарантируем, что каждый член команды знает, что было разработано, а что нет, что было протестировано, а что нет.

### Повсеместный язык

Повсеместный язык всегда упоминается как _общий_ язык. В этом его главное преимущество. Это не пара слов из нашей бизнес-спецификации и не пара технических терминов разработчика. Это общеупотребительные слова и термины, которые могут быть понятны людям, для которых мы создаем программное обеспечение, и должны быть понятны разработчикам. Установление правильного общения между этими двумя группами людей жизненно важно для создания успешного проекта, который будет соответствовать предметной области и удовлетворять всем потребностям бизнеса.

Каждая функция продукта должна рождаться в результате обсуждения между

-   бизнес (аналитики, владелец продукта)
-   Разработчики
-   QAs

которые известны в BDD как “три друга”.

Из таких бесед должны получаться письменные истории. Должен быть актер, который что-то делает, функция, которая должна быть реализована в истории, и достигнутый результат.

Мы можем попробовать написать такую простую историю:

```yaml
As a customer I want to buy several products I put first product with $600 price to my cart And then another one with $1000 price When I go to checkout process I should see that total number of products I want to buy is 2 And my order amount is $1600
```

Как мы можем видеть, в этой простой истории освещаются основные концепции, которые называются _контрактами_. Мы должны выполнять эти контракты, чтобы правильно моделировать программное обеспечение. Но как мы можем проверить, что эти контракты выполняются? [Cucumber](https://cucumber.io/) представил специальный язык для таких историй под названием **Gherkin**. Та же история, преобразованная в Gherkin, будет выглядеть следующим образом:

```gherkin
Feature: checkout process In order to buy products As a customer I want to be able to buy several products Scenario: Given I have product with $600 price in my cart And I have product with $1000 price When I go to checkout process Then I should see that total number of products is 2 And my order amount is $1600
```

Cucumber, Behat и, конечно же, **Codeception** может выполнить этот сценарий шаг за шагом в виде автоматического теста. Для каждого шага в этом сценарии требуется код, который его определяет.

## Корнишон

Давайте узнаем немного больше о формате Gherkin, а затем посмотрим, как его выполнить с помощью Codeception:

### Характеристики

Всякий раз, когда вы начинаете писать статью, вы описываете конкретную функцию приложения с набором сценариев и примеров, описывающих эту функцию.

Файл функций записан в формате Gherkin. Codeception может сгенерировать файл функций для вас. Мы предполагаем, что будем использовать сценарии в файлах функций для приемочных тестов, поэтому файлы функций должны быть размещены в `acceptance` каталоге suite:

```bash
php vendor/bin/codecept g:feature acceptance checkout
```

Сгенерированный шаблон будет выглядеть следующим образом:

```gherkin
Feature: checkout In order to ... As a ... I need to ... Scenario: try checkout
```

Этот шаблон может быть реализован путем настройки действующего лица и целей:

```gherkin
Feature: checkout In order to buy product As a customer I need to be able to checkout the selected products
```

Далее мы опишем эту функцию, написав для нее примеры

#### Сценарии

Сценарии - это живые примеры использования функций. Внутри файла функций это должно быть записано внутри блока _функций_. Каждый сценарий должен содержать свое название.:

```gherkin
Feature: checkout In order to buy product As a customer I need to be able to checkout the selected products Scenario: order several products
```

Сценарии пишутся поэтапно с использованием подхода "Дано, когда". В начале сценарий должен описывать свой контекст с помощью **данного** ключевого слова:

```gherkin
Given I have product with $600 price in my cart And I have product with $1000 price in my cart
```

Здесь мы также используем слово **И**, чтобы расширить Данное, а не повторять его в каждой строке.

Вот как мы описали начальные условия. Затем мы выполняем некоторое действие. Для этого мы используем ключевое слово **When**:

```gherkin
When I go to checkout process
```

And in the end we are verifying our expectation using **Then** keyword. The action changed the initial given state, and produced some results. Let’s check that those results are what we actually expect.

```gherkin
Then I should see that total number of products is 2 And my order amount is $1600
```

We can test this scenario by executing it in dry-run mode. In this mode test won’t be executed (actually, we didn’t define any step for it, so it won’t be executed in any case).

```bash
$ codecept dry-run acceptance checkout.feature
```

```bash
checkout: order several products Signature: checkout:order several products Test: tests/acceptance/checkout.feature:order several products Scenario -- In order to buy product As a customer I need to be able to checkout the selected products Given i have product with $600 price in my cart And i have product with $1000 price in my cart When i go to checkout process Then i should see that total number of products is 2 And my order amount is $1600 INCOMPLETE Step definition for `I have product with $600 price in my cart` not found in contexts Step definition for `I have product with $1000 price` not found in contexts Step definition for `I go to checkout process` not found in contexts Step definition for `I should see that total number of products is 2` not found in contexts Step definition for `my order amount is $1600` not found in contexts Run gherkin:snippets to define missing steps
```

Помимо перечисленных шагов сценария, мы получили уведомление о том, что наши шаги еще не определены. Мы можем легко определить их, выполнив `gherkin:snippets` команду для данного набора:

```bash
codecept gherkin:snippets acceptance
```

Это создаст шаблоны кода для всех неопределенных шагов во всех файлах функций этого пакета. Нашим следующим шагом будет определение этих шагов и преобразование файла функций в действительный тест.

### Определения шагов

Для соответствия шагов из файла функций PHP-коду мы используем аннотации, которые добавляются к методам класса. По умолчанию Codeception ожидает, что все методы, помеченные `@Given`, `@When`, `@Then` аннотациями. Каждая аннотация должна содержать строку шага.

```yaml
/** @Given I am logged as admin */
```

Шаги также могут быть сопоставлены с регулярными выражениями. Таким образом, мы можем выполнять более гибкие шаги

```yaml
/** @Given /I am (logged|authorized) as admin/ */
```

Пожалуйста, обратите внимание, что регулярные выражения должны начинаться и заканчиваться на `/` символ char. Регулярное выражение также используется для сопоставления параметров и передачи их в качестве аргументов в методы.

```php
/** * @Given /I am (?:logged|authorized) as "(\w+)"/ */ function amAuthorized($role) { // logged or authorized does not matter to us // so we added ?: for this capture group }
```

Параметры также могут передаваться в строках, отличных от регулярных выражений, используя заполнитель “:” params.

```yaml
/** @Given I am logged in as :role */
```

Это будет соответствовать любому слову (переданному в двойных кавычках) или переданному числу:

```yaml
Given I am logged in as "admin" Given I am logged in as 1
```

Шаги определены в файлах контекста. Контекст по умолчанию - это класс-исполнитель, т. Е. Для набора приемочного тестирования контекстом по умолчанию является `AcceptanceTester` класс. Однако вы можете определять шаги в любых классах и включать их в качестве контекстов. Полезно определять шаги в классах StepObject и PageObject.

Чтобы перечислить все определенные шаги, выполните `gherkin:steps` команду:

```bash
codecept gherkin:steps
```

## Поведение при тестировании

Как уже упоминалось, файлы функций - это не просто история пользователя. Написав функции на формальном языке под названием Gherkin, мы можем выполнять эти сценарии в виде автоматических тестов. Нет никаких ограничений в том, как предполагается тестировать эти сценарии. Тесты могут выполняться на функциональном уровне, уровне принятия или домена. Однако в текущем руководстве мы сосредоточимся на тестах принятия или пользовательского интерфейса.

### Приемо-сдаточное тестирование

Поскольку мы сгенерировали фрагменты для пропущенных шагов с помощью `gherkin:snippets` команды, мы определим их в `AcceptanceTester` файле.

```php
class AcceptanceTester extends \Codeception\Actor { use _generated\AcceptanceTesterActions; /** * @Given I have product with :num1 price in my cart */ public function iHaveProductWithPriceInMyCart($num1) { throw new \PHPUnit\Framework\IncompleteTestError("Step `I have product with :num1 price in my cart` is not defined"); } /** * @When I go to checkout process */ public function iGoToCheckoutProcess() { throw new \PHPUnit\Framework\IncompleteTestError("Step `I go to checkout process` is not defined"); } /** * @Then I should see that total number of products is :num1 */ public function iShouldSeeThatTotalNumberOfProductsIs($num1) { throw new \PHPUnit\Framework\IncompleteTestError("Step `I should see that total number of products is :num1` is not defined"); } /** * @Then my order amount is :num1 */ public function myOrderAmountIs($num1) { throw new \PHPUnit\Framework\IncompleteTestError("Step `my order amount is :num1` is not defined"); } }
```

Пожалуйста, обратите внимание, что `:num1` заполнитель может использоваться для строк и цифр (может содержать знак валюты). В текущем регистре `:num1` совпадает `$600` и `$num1` присваивается значение 600. Если вам нужно получить точную строку, заключите значение в кавычки: `"600$"`

По умолчанию они генерируют неполные исключения, чтобы гарантировать, что тест с пропущенными шагами не будет случайно отмечен как успешный. Нам нужно будет реализовать эти шаги. Поскольку мы находимся в acceptance suite, мы, вероятно, используем модули [PhpBrowser](https://codeception.com/docs/modules/PhpBrowser) или [WebDriver](https://codeception.com/docs/modules/WebDriver). Это означает, что мы можем использовать их методы внутри файла Tester, как мы делаем при написании тестов с использованием `$I->`. Вы можете использовать `amOnPage`, `click`, `see` методы внутри определений шагов, поэтому каждый шаг сценария Gherkin должен быть расширен базовыми шагами Codeception. Давайте покажем, как это может быть реализовано в нашем случае:

```php
class AcceptanceTester extends \Codeception\Actor { use _generated\AcceptanceTesterActions; /** * @Given I have product with :num1 price in my cart */ public function iHaveProductWithPriceInMyCart($num1) { // haveRecord method is available in Laravel, Phalcon, Yii modules $productId = $this->haveRecord('Product', ['name' => 'randomProduct'.uniqid(), 'price' => $num1]); $this->amOnPage("/item/$productId"); $this->click('Order'); } /** * @When I go to checkout process */ public function iGoToCheckoutProcess() { $this->amOnPage('/checkout'); } /** * @Then I should see that total number of products is :num1 */ public function iShouldSeeThatTotalNumberOfProductsIs($num1) { $this->see($num1, '.products-count'); } /** * @Then my order amount is :num1 */ public function myOrderAmountIs($num1) { $this->see($num1, '.total'); } }
```

To make testing more effective we assumed that we are using one of the ActiveRecord frameworks like Laravel, Yii, or Phalcon so we are able to dynamically create records in database with `haveRecord` method. After that we are opening browser and testing our web pages to see that after selecting those products we really see the price was calculated correctly.

Мы можем выполнить предварительный запуск (или run) нашего файла функций, чтобы увидеть, что заданные / Когда / Then будут расширены с помощью подэтапов:

```bash
Given i have product with $600 price in my cart I have record 'Product',{"name":"randomProduct571fad4f88a04","price":"600"} I am on page "/item/1" I click "Order" And i have product with $1000 price in my cart I have record 'Product',{"name":"randomProduct571fad4f88b14","price":"1000"} I am on page "/item/2" I click "Order" When i go to checkout process I am on page "/checkout" Then i should see that total number of products is 2 I see "2",".products-count" And my order amount is $1600 I see "1600",".total"
```

Таким образом, файл feature file выполняется точно так же, как и любой другой тест Codeception. Дополнительные шаги предоставляют нам подробную информацию о том, как выполняется сценарий.

Одна из критических замечаний по тестированию с помощью Gherkin заключалась в том, что только техническая команда была осведомлена о том, как выполняется сценарий тестирования. Это могло привести к ложноположительным тестам. Разработчики могли использовать пустые шаги для сценариев (или нерелевантные) и создавать недействительные тесты для допустимых сценариев. Codeception выводит коммуникацию на новый уровень, каждый в команде может понять, что происходит на более низком (техническом) уровне. Сценарий, расширяемый до подэтапов, показывает фактический процесс выполнения теста. Любой член команды может прочитать выходные данные и приложить свои усилия к улучшению набора тестов.

## Продвинутый корнишон

Давайте улучшим наш пакет BDD, используя расширенные возможности Gherkin language.

### Справочная информация

Если группа сценариев имеет одинаковые начальные шаги, допустим, что для dashboard нам всегда нужно входить в систему как администратору. Мы можем использовать раздел _Справочная информация_, чтобы выполнить необходимые приготовления и не повторять одни и те же шаги в разных сценариях.

```gherkin
Feature: Dashboard In order to view current state of business As an owner I need to be able to see reports on dashboard Background: Given I am logged in as administrator And I open dashboard page
```

Шаги в фоновом режиме определяются так же, как и в сценариях.

### Таблицы

Сценарии могут стать более наглядными, когда вы представляете повторяющиеся данные в виде таблиц. Вместо написания нескольких шагов “У меня в корзине есть товар по цене num1 $”, у нас может быть один шаг с несколькими значениями.

```gherkin
Given i have products in my cart | name | category | price | | Harry Potter | Books | 5 | | iPhone 5 | Smartphones | 1200 | | Nuclear Bomb | Weapons | 100000 |
```

Таблицы - это рекомендуемый способ передачи массивов в тестовые сценарии. Внутри определения шага данные хранятся в аргументе, передаваемом как `\Behat\Gherkin\Node\TableNode` экземпляр.

```php
/** * @Given i have products in my cart */ public function iHaveProductsInCart(\Behat\Gherkin\Node\TableNode $products) { // iterate over all rows foreach ($node->getRows() as $index => $row) { if ($index === 0) { // first row to define fields $keys = $row; continue; } $this->haveRecord('Product', array_combine($keys, $row)); } }
```

### Примеры

В случае, если сценарии представляют одну и ту же логику, но отличаются данными, мы можем использовать _схему сценария_, чтобы предоставить разные примеры одного и того же поведения. Схема сценария аналогична базовому сценарию, только некоторые значения заменены заполнителями, которые заполняются из таблицы. Каждый набор значений выполняется как отдельный тест.

```gherkin
Scenario Outline: order discount Given I have product with price <price>$ in my cart And discount for orders greater than $20 is 10 % When I go to checkout Then I should see overall price is "<total>" $ Examples: | price | total | | 10 | 10 | | 20 | 20 | | 21 | 18.9 | | 30 | 27 | | 50 | 45 |
```

### Длинные строки

Текстовые значения внутри сценариев могут быть установлены внутри `"""` блока:

```gherkin
Then i see in file "codeception.yml" """ paths: tests: tests log: tests/_output data: tests/_data helpers: tests/_support envs: tests/_envs """
```

Эта строка передается как стандартный строковый параметр PHP

```php
/** * @Then i see in file :filename */ public function seeInFile($fileName, $fileContents) { // note: module "Asserts" is enabled in this suite if (!file_exists($fileName)) { $this->fail("File $fileName not found"); } $this->assertEquals(file_get_contents($fileName), $fileContents); }
```

### Теги

Сценарии и функции Gherkin могут содержать теги, помеченные `@`. Теги равны группам в Codeception. Таким образом, если вы определяете функцию с помощью `@important` тега, вы можете выполнить ее внутри `important` группы, выполнив:

```bash
codecept run -g important
```

Tag should be placed before _Scenario:_ or before _Feature:_ keyword. In the last case all scenarios of that feature will be added to corresponding group.

## Configuration

Как мы упоминали ранее, шаги должны быть определены внутри контекстных классов. По умолчанию все шаги определены внутри класса Actor, например, `AcceptanceTester`. Однако вы можете включить больше контекстов. Это можно настроить внутри глобального `codeception.yml` файла конфигурации или пакета:

```yaml
gherkin: contexts: default: - AcceptanceTester - AdditionalSteps
```

`AdditionalSteps` файл должен быть доступен с помощью автозагрузчика и может быть создан с помощью `Codeception\Lib\Di`. Это означает, что контекстом может быть практически любой класс. Если класс получает класс-субъект в конструкторе или в `_inject` методе, DI может внедрить его в него.

```php
class AdditionalSteps { protected $I; function __construct(AcceptanceTester $I) { $this->I = $I; } /** * @When I do something */ function additionalActions() { } }
```

Таким образом, объекты PageObjects, хелперы и StepObjects также могут стать контекстами. Но более предпочтительно включать классы контекста по их тегам или ролям.

Если у вас есть `Step\Admin` класс, который определяет только действия администратора, рекомендуется использовать его в качестве контекста для всех функций, содержащих with “От имени администратора”. В данном случае "администратор” - это роль, и мы можем настроить ее для использования дополнительного контекста.

```yaml
gherkin: contexts: role: admin: - "Step\Admin"
```

К тегам также могут быть прикреплены контексты. Это может быть полезно, если вы хотите переопределить шаги для некоторых сценариев. Допустим, мы хотим обойти шаги входа в систему для некоторых сценариев, загружающих уже определенный сеанс. В этом случае мы можем создать `Step\FastLogin` класс с переопределенным шагом “Я вошел в систему как”.

```yaml
gherkin: contexts: tag: fastlogin: - "Step\FastLogin"
```

Контексты также могут быть загружены автоматически:

```yaml
gherkin: contexts: path: tests/_support/Steps namespace_prefix: Steps default: - AcceptanceTester
```

Это загрузит весь контекст из заданного пути и добавит к нему префикс с заданным пространством имен.

## Миграция из Behat

Хотя Behat является отличным инструментом для разработки, ориентированной на поведение, вы все же можете предпочесть использовать Codeception в качестве основной платформы тестирования. В случае, если вы хотите унифицировать все ваши тесты (модульные / функциональные / приемлемые) и заставить их выполняться одним раннером, Codeception - хороший выбор. Также Codeception предоставляет богатый набор хорошо поддерживаемых модулей для различных серверных систем тестирования, таких как Selenium Webdriver, Symfony, Laravel и др.

Если вы решили запустить свои функции с Codeception, мы рекомендуем начать с символической привязки вашего `features` каталога к одному из наборов тестов:

```bash
ln -s $PWD/features tests/acceptance
```

Затем вам нужно будет реализовать все определения шагов. Запустите `gherkin:snippets`, чтобы сгенерировать для них заглушки. По умолчанию рекомендуется размещать определения шагов в классе actor (Тестер) и использовать его методы для реализации шагов.

## Тесты против возможностей

Принято считать, что сценарий BDD равен тестированию. Но на самом деле это не так. Не каждый тест следует описывать как функцию. Не каждый тест написан для проверки реальной ценности бизнеса. Например, регрессионные тесты или тесты с отрицательным сценарием не приносят никакой пользы бизнесу. Бизнес-аналитиков не волнует, воспроизводит ли сценарий ошибку № 13 или какое сообщение об ошибке отображается, когда пользователь пытается ввести неправильный пароль на экране входа в систему. Запись всех тестов внутри функциональных файлов приводит к информационному переполнению.

В Codeception вы можете комбинировать тесты, написанные в формате Gherkin, с тестами, написанными в форматах Cept / Cest / Test. Таким образом, вы сможете сохранить компактность файлов функций с минимальным набором сценариев и писать регулярные тесты, охватывающие все случаи.

Соответствующие функции и тесты могут быть присоединены к одной и той же группе. И что еще интереснее, вы можете создавать тесты в зависимости от функциональных сценариев. Допустим, у нас есть `login.feature` файл со сценарием “Войти в систему обычного пользователя”. В этом случае вы можете указать, что каждый тест, для прохождения которого требуется вход в систему, будет зависеть от сценария “Войти в систему обычного пользователя”.:

```yaml
@depends login:Log regular user
```

Внутри `@depends` блока вы должны использовать тестовую подпись. Запустите свою функцию с помощью `dry-run`, чтобы увидеть подписи для всех сценариев в ней. Отмечая тесты символом `@depends`, вы гарантируете, что этот тест не будет выполнен до теста, от которого он зависит.

## Выводы

Если вам нравится концепция разработки, основанной на поведении, или вы предпочитаете сохранять тестовые сценарии в удобочитаемом формате, Codeception позволяет вам писать и выполнять сценарии в Gherkin. Файлы функций - это просто еще один тестовый формат внутри Codeception, поэтому его можно комбинировать с файлами Cept и Cest в одном пакете. Определения шагов ваших сценариев могут использовать все возможности модулей Codeception, PageObjects и StepObjects.

-   **Следующая глава: [Настройка >](https://codeception.com/docs/08-Customization)**
-   **Предыдущая глава: [<Расширенное использование](https://codeception.com/docs/07-AdvancedUsage)**

[**Отредактируйте** эту страницу на GitHub](https://github.com/Codeception/codeception.github.com/edit/master/docs/4.x/BDD.md)
