---
created: 2024-02-18T17:23:00 (UTC +03:00)
tags: []
source: https://codeception.com/docs/4.x/AdvancedUsage
author: 
---

# AdvancedUsage - Codeception 4 Documentation

> ## Excerpt
> В этой главе мы рассмотрим некоторые методы и опции, которые вы можете использовать, чтобы улучшить свой опыт тестирования и улучшить организацию вашего проекта.

---
## Расширенное использование

В этой главе мы рассмотрим некоторые методы и опции, которые вы можете использовать, чтобы улучшить свой опыт тестирования и улучшить организацию вашего проекта.

## Классы Cest

Если вы хотите получить классоподобную структуру для своих Cepts, вы можете использовать формат Cest вместо обычного PHP. Он очень прост и полностью совместим со сценариями Cept. Это означает, что если вы чувствуете, что ваш тест достаточно длинный, и вы хотите разделить его, вы можете легко разделить его на классы.

Вы можете создать файл Cest, выполнив команду:

```bash
php vendor/bin/codecept generate:cest suitename CestName
```

Сгенерированный файл будет выглядеть следующим образом:

```php
class BasicCest { public function _before(\AcceptanceTester $I) { } public function _after(\AcceptanceTester $I) { } // tests public function tryToTest(\AcceptanceTester $I) { } }
```

**Каждый открытый метод Cest (кроме тех, которые начинаются с `_`) будет выполняться как тестовый** и получит экземпляр класса Actor в качестве первого параметра и `$scenario` переменную в качестве второго.

В `_before` и `_after` методах вы можете использовать общие настройки и разборки для тестов в классе.

Как вы видите, мы передаем объект Actor в `tryToTest` метод. Это позволяет нам писать сценарии так, как мы делали раньше.:

```php
class BasicCest { // test public function tryToTest(\AcceptanceTester $I) { $I->amOnPage('/'); $I->click('Login'); $I->fillField('username', 'john'); $I->fillField('password', 'coltrane'); $I->click('Enter'); $I->see('Hello, John'); $I->seeInCurrentUrl('/account'); } }
```

Как вы видите, классы Cest не имеют родительских элементов. Это сделано намеренно. Это позволяет вам расширить ваши классы с помощью общих моделей поведения и обходных путей которые могут использоваться в дочерних классах. Но не забудьте создать эти методы, `protected` чтобы они не выполнялись как тесты.

Формат Cest также может содержать перехваты, основанные на результатах тестирования:

-   `_failed` будет выполнено при неудачном тестировании
-   `_passed` будет выполнено по пройденному тесту

```php
public function _failed(\AcceptanceTester $I) { // will be executed on test failure } public function _passed(\AcceptanceTester $I) { // will be executed when test is successful }
```

## Внедрение зависимостей

Codeception поддерживает простое внедрение зависимостей для классов Cest и \\Codeception\\TestCase\\Test. Это означает, что вы можете указать, какие классы вам нужны в качестве параметров специального `_inject()` метода, и Codeception автоматически создаст соответствующие объекты и вызовет этот метод, передавая все зависимости в качестве аргументов. Это может быть полезно при работе с помощниками. Вот пример для Cest:

```php
class SignUpCest { /** * @var Helper\SignUp */ protected $signUp; /** * @var Helper\NavBarHelper */ protected $navBar; protected function _inject(\Helper\SignUp $signUp, \Helper\NavBar $navBar) { $this->signUp = $signUp; $this->navBar = $navBar; } public function signUp(\AcceptanceTester $I) { $this->navBar->click('Sign up'); $this->signUp->register([ 'first_name' => 'Joe', 'last_name' => 'Jones', 'email' => 'joe@jones.com', 'password' => '1234', 'password_confirmation' => '1234' ]); } }
```

И для тестовых классов:

```php
class MathTest extends \Codeception\TestCase\Test { /** * @var \UnitTester */ protected $tester; /** * @var Helper\Math */ protected $math; protected function _inject(\Helper\Math $math) { $this->math = $math; } public function testAll() { $this->assertEquals(3, $this->math->add(1, 2)); $this->assertEquals(1, $this->math->subtract(3, 2)); } }
```

Однако внедрение зависимостей этим не ограничивается. Это позволяет вам **вводить любой класс**, который может быть сконструирован с аргументами, известными Codeception.

Для того, чтобы выполнить автоматическую настройку, вам нужно будет реализовать `_inject()` метод со списком желаемых аргументов. Важно указать тип аргументов, чтобы Codeception мог угадать, какие объекты, как ожидается, будут получены. `_inject()` будет вызван только один раз, сразу после создания объекта TestCase (либо Cest, либо Test). Внедрение зависимостей также будет работать аналогичным образом для классов Helper и Actor.

Каждый тест класса Cest может объявлять свои собственные зависимости и получать их из аргументов метода:

```php
class UserCest { function updateUser(\Helper\User $u, \AcceptanceTester $I, \Page\User $userPage) { $user = $u->createDummyUser(); $userPage->login($user->getName(), $user->getPassword()); $userPage->updateProfile(['name' => 'Bill']); $I->see('Profile was saved'); $I->see('Profile of Bill','h1'); } }
```

Более того, Codeception может рекурсивно разрешать зависимости (когда `A` зависит от `B`, и `B` зависит от `C`и т.д.) и обрабатывать параметры примитивных типов со значениями по умолчанию (например, `$param = 'default'`). Конечно, вам не разрешено иметь _циклические зависимости_.

## Пример аннотации

Что делать, если вы хотите выполнить один и тот же тестовый сценарий с разными данными? В этом случае вы можете вводить примеры в виде `\Codeception\Example` экземпляров. Данные определяются с помощью `@example` аннотации, используя JSON или нотацию в стиле Doctrine (ограниченную одной строкой). В стиле Doctrine:

```php
class EndpointCest { /** * @example ["/api/", 200] * @example ["/api/protected", 401] * @example ["/api/not-found-url", 404] * @example ["/api/faulty", 500] */ public function checkEndpoints(ApiTester $I, \Codeception\Example $example) { $I->sendGet($example[0]); $I->seeResponseCodeIs($example[1]); } }
```

JSON:

```php
class PageCest { /** * @example { "url": "/", "title": "Welcome" } * @example { "url": "/info", "title": "Info" } * @example { "url": "/about", "title": "About Us" } * @example { "url": "/contact", "title": "Contact Us" } */ public function staticPages(AcceptanceTester $I, \Codeception\Example $example) { $I->amOnPage($example['url']); $I->see($example['title'], 'h1'); $I->seeInTitle($example['title']); } }
```

Если вы используете нотацию JSON, пожалуйста, имейте в виду, что все строковые ключи и значения должны быть заключены в двойные кавычки (\`"\`) в соответствии со стандартом JSON.

Данные типа ключ-значение в синтаксисе аннотаций в стиле Doctrine:

```php
class PageCest { /** * @example(url="/", title="Welcome") * @example(url="/info", title="Info") * @example(url="/about", title="About Us") * @example(url="/contact", title="Contact Us") */ public function staticPages(AcceptanceTester $I, \Codeception\Example $example) { $I->amOnPage($example['url']); $I->see($example['title'], 'h1'); $I->seeInTitle($example['title']); } }
```

## Примечания к поставщику данных

Вы также можете использовать `@dataProvider` аннотацию для создания динамических примеров для [классов Cest](https://codeception.com/docs/4.x/AdvancedUsage#Cest-Classes), используя **защищенный метод** для предоставления данных примера:

```php
class PageCest { /** * @dataProvider pageProvider */ public function staticPages(AcceptanceTester $I, \Codeception\Example $example) { $I->amOnPage($example['url']); $I->see($example['title'], 'h1'); $I->seeInTitle($example['title']); } /** * @return array */ protected function pageProvider() // alternatively, if you want the function to be public, be sure to prefix it with `_` { return [ ['url'=>"/", 'title'=>"Welcome"], ['url'=>"/info", 'title'=>"Info"], ['url'=>"/about", 'title'=>"About Us"], ['url'=>"/contact", 'title'=>"Contact Us"] ]; } }
```

`@dataprovider` аннотация также доступна для [модульных тестов](https://codeception.com/docs/05-UnitTests), в этом случае **метод поставщика данных должен быть общедоступным**. Для получения более подробной информации о том, как использовать data provider для модульных тестов, пожалуйста, обратитесь к [документации PHPUnit](https://phpunit.de/manual/current/en/writing-tests-for-phpunit.html#writing-tests-for-phpunit.data-providers).

## Примечания до / После

Вы можете управлять потоком выполнения с помощью `@before` и `@after` аннотаций. Вы можете перенести обычные действия в защищенные (не тестовые) методы и вызывать их до или после тестового метода, поместив их в аннотации. Можно вызвать несколько методов, используя более одной `@before` или `@after` аннотации. Методы вызываются в порядке сверху вниз.

```php
class ModeratorCest { protected function login(AcceptanceTester $I) { $I->amOnPage('/login'); $I->fillField('Username', 'miles'); $I->fillField('Password', 'davis'); $I->click('Login'); } /** * @before login */ public function banUser(AcceptanceTester $I) { $I->amOnPage('/users/charlie-parker'); $I->see('Ban', '.button'); $I->click('Ban'); } /** * @before login * @before cleanup * @after logout * @after close */ public function addUser(AcceptanceTester $I) { $I->amOnPage('/users/charlie-parker'); $I->see('Ban', '.button'); $I->click('Ban'); } }
```

## Среды

Для случаев, когда вам нужно запускать тесты с разными конфигурациями, вы можете определить разные среды конфигурации. Наиболее типичными вариантами использования являются выполнение приемочных тестов в разных браузерах или выполнение тестов базы данных с использованием разных СУБД.

Давайте продемонстрируем использование сред для случая браузеров.

Нам нужно добавить несколько новых строк в `acceptance.suite.yml`:

```yaml
actor: AcceptanceTester modules: enabled: - WebDriver - \Helper\Acceptance config: WebDriver: url: 'http://127.0.0.1:8000/' browser: 'firefox' env: chrome: modules: config: WebDriver: browser: 'chrome' firefox: # nothing changed
```

В принципе, вы можете определить различные среды внутри `env` root, присвоить им имена (`chrome`, `firefox` и т.д.), а затем переопределить любые параметры конфигурации, которые были установлены ранее.

Вы также можете определять среды в отдельных файлах конфигурации, размещенных в каталоге, указанном `envs` параметром в `paths` конфигурации:

```yaml
paths: envs: tests/_envs
```

Имена этих файлов используются как имена сред (например, `chrome.yml` или `chrome.dist.yml` для среды с именем `chrome`). Вы можете сгенерировать новый файл с этой конфигурацией среды с помощью `generate:environment` команды:

```bash
$ php vendor/bin/codecept g:env chrome
```

В этом файле вы можете указать только те параметры, которые хотите переопределить:

```yaml
modules: config: WebDriver: browser: 'chrome'
```

Файлы конфигурации среды объединяются в основную конфигурацию перед объединением конфигурации пакета.

Вы можете легко переключаться между этими конфигурациями, запустив тесты с помощью `--env` опции. Чтобы запустить тесты только для Firefox, вам просто нужно пройти `--env firefox` в качестве опции:

```bash
$ php vendor/bin/codecept run acceptance --env firefox
```

Чтобы запустить тесты во всех браузерах, перечислите все среды:

```bash
$ php vendor/bin/codecept run acceptance --env chrome --env firefox
```

Тесты будут выполняться 3 раза, каждый раз в другом браузере.

Также возможно объединить несколько сред в единую конфигурацию, разделив их запятой:

```bash
$ php vendor/bin/codecept run acceptance --env dev,firefox --env dev,chrome --env dev,firefox
```

Конфигурация объединяется в указанном порядке. Таким образом, вы можете легко создавать несколько комбинаций конфигураций вашей среды.

В зависимости от среды вы можете выбрать, какие тесты будут выполняться. Например, вам может потребоваться выполнить некоторые тесты только в Firefox, а некоторые - только в Chrome.

Желаемые среды могут быть указаны с помощью `@env` аннотации для тестов в форматах Test и Cest:

```php
class UserCest { /** * This test will be executed only in 'firefox' and 'chrome' environments * * @env firefox * @env chrome */ public function webkitOnlyTest(AcceptanceTester $I) { // I do something } }
```

Таким образом, вы можете легко контролировать, какие тесты будут выполняться для каждой среды.

Иногда вам может потребоваться изменить поведение теста в режиме реального времени. Например, поведение одного и того же теста может отличаться в Firefox и Chrome. Во время выполнения мы можем получить текущее имя среды, имя теста или список включенных модулей, вызвав `$scenario->current()` метод.

```php
// retrieve current environment $scenario->current('env'); // list of all enabled modules $scenario->current('modules'); // test name $scenario->current('name'); // browser name (if WebDriver module enabled) $scenario->current('browser'); // capabilities (if WebDriver module enabled) $scenario->current('capabilities');
```

Вы можете внедрить `\Codeception\Scenario` следующим образом:

```php
public function myTest(\AcceptanceTester $I, \Codeception\Scenario $scenario) { if ($scenario->current('browser') == 'chrome') { // ... } }
```

`Codeception\Scenario` также доступно в классах актеров и StepObjects. Получить к нему доступ можно с помощью `$this->getScenario()`.

## Перемешать

По умолчанию Codeception запускает тесты в алфавитном порядке. Чтобы убедиться, что тесты не зависят друг от друга (если явно не указано через `@depends`), вы можете включить `shuffle` опцию.

```yaml
# inside codeception.yml settings: shuffle: true
```

В качестве альтернативы вы можете запускать тесты в случайном порядке без изменения конфигурации:

```yaml
codecept run -o "settings: shuffle: true"
```

Тесты будут случайным образом переупорядочиваться при каждом запуске. При выполнении тестов в случайном порядке будет напечатано начальное значение. Скопируйте это начальное значение из выходных данных, чтобы иметь возможность повторно запускать тесты в том же порядке.

```yaml
$ codecept run Codeception PHP Testing Framework v2.4.5 Powered by PHPUnit 5.7.27 by Sebastian Bergmann and contributors. [Seed] 1872290562
```

Передайте скопированное начальное значение в `--seed` опцию:

```yaml
codecept run --seed 1872290562
```

### Зависимости

С помощью `@depends` аннотации вы можете указать тест, который должен быть пройден перед текущим. Если этот тест завершится неудачей, текущий тест будет пропущен. Вы должны передать имя метода теста, на который вы полагаетесь.

```php
class ModeratorCest { public function login(AcceptanceTester $I) { // logs moderator in } /** * @depends login */ public function banUser(AcceptanceTester $I) { // bans user } }
```

`@depends` применяется к форматам `Cest` и `Codeception\Test\Unit`. Зависимости могут быть установлены для разных классов. Чтобы указать зависимый тест из другого файла, вы должны предоставить _подпись теста_. Обычно тестовая сигнатура соответствует `className:methodName` формату. Но чтобы получить точную тестовую сигнатуру, просто запустите тест с `--steps` возможностью ее просмотра:

```yaml
Signature: ModeratorCest:login`
```

Codeception переупорядочивает тесты, поэтому зависимые тесты всегда будут выполняться перед тестами, которые полагаются на них.

## Запуск из разных папок

Если у вас есть несколько проектов с тестами Codeception, вы можете использовать один `codecept` файл для запуска всех ваших тестов. Вы можете передать `-c` параметр любой команде Codeception (кроме `bootstrap`) для выполнения Codeception в другом каталоге:

```bash
$ php vendor/bin/codecept run -c ~/projects/ecommerce/ $ php vendor/bin/codecept run -c ~/projects/drupal/ $ php vendor/bin/codecept generate:cest acceptance CreateArticle -c ~/projects/drupal/
```

Чтобы создать проект в каталоге, отличном от текущего, просто укажите его путь в качестве параметра:

```bash
$ php vendor/bin/codecept bootstrap ~/projects/drupal/
```

Кроме того, опция `-c` позволяет вам указать другой файл конфигурации, который будет использоваться. Таким образом, у вас может быть несколько `codeception.yml` файлов для вашего набора тестов (например, для указания различных сред и настроек). Просто передайте `.yml` имя файла в качестве `-c` параметра для выполнения тестов с определенными настройками конфигурации.

## Группы

Существует несколько способов выполнить набор тестов. Вы можете запускать тесты из определенного каталога:

```bash
$ php vendor/bin/codecept run tests/acceptance/admin
```

Вы можете выполнить одну (или несколько) определенных групп тестов:

```bash
$ php vendor/bin/codecept run -g admin -g editor
```

Концепция групп была взята из PHPUnit и ведет себя таким же образом.

Для файлов тестов и Cest вы можете использовать `@group` аннотацию, чтобы добавить тест в группу.

```php
/** * @group admin */ public function testAdminUser() { }
```

Для `.feature`\-файлов (Gherkin) используйте теги:

```gherkin
@admin @editor Feature: Admin area
```

### Групповые файлы

Группы могут быть определены в глобальных файлах конфигурации или в файлах пакета. Тесты для групп могут быть указаны в виде массива имен файлов или каталогов, содержащих их:

```yaml
groups: # add 2 tests to db group db: [tests/unit/PersistTest.php, tests/unit/DataTest.php] # add all tests from a directory to api group api: [tests/functional/api]
```

Список тестов для группы может быть передан из файла группы. Он должен быть определен обычным текстом с названиями тестов в отдельных строках:

```bash
tests/unit/DbTest.php tests/unit/UserTest.php:create tests/unit/UserTest.php:update
```

Файл группы может быть включен по его относительному имени файла:

```yaml
groups: # requiring a group file slow: tests/_data/slow.txt
```

Вы можете создавать файлы групп вручную или генерировать их из сторонних приложений. Например, вы можете написать скрипт, который обновляет медленную группу, выполняя самые медленные тесты из xml-отчета.

Вы даже можете указать шаблоны для загрузки нескольких групповых файлов с одним определением:

```yaml
groups: p*: tests/_data/p*
```

Это загрузит все найденные `p*` файлы в `tests/_data` виде групп. Названия групп будут следующими: p1, p2,...,pN.

## Форматы

В дополнение к стандартным форматам тестирования (Cest, Unit, Gherkin) вы можете реализовать свои собственные классы форматов для настройки выполнения теста. Укажите их в конфигурации вашего пакета:

```yaml
formats: - \My\Namespace\MyFormat
```

Затем определите класс, который реализует LoaderInterface

```php
namespace My\Namespace; class MyFormat implements \Codeception\Test\Loader\LoaderInterface { protected $tests; protected $settings; public function __construct($settings = []) { //These are the suite settings $this->settings = $settings; } public function loadTests($filename) { //Load file and create tests } public function getTests() { return $this->tests; } public function getPattern() { return '~Myformat\.php$~'; } }
```

## Автоматическое завершение работы оболочки

Для оболочек bash и zsh вы можете использовать автозаполнение для своих проектов Codeception, выполнив следующее в своей оболочке (или добавив это в свой .bashrc / .zshrc):

```bash
# BASH ~4.x, ZSH source <([codecept location] _completion --generate-hook --program codecept --use-vendor-bin) # BASH ~3.x, ZSH [codecept location] _completion --generate-hook --program codecept --use-vendor-bin | source /dev/stdin # BASH (any version) eval $([codecept location] _completion --generate-hook --program codecept --use-vendor-bin)
```

### Объяснение

Используя приведенный выше код в вашей командной строке, Codeception попытается автоматически выполнить следующее:

-   Команды
-   Наборы
-   Пути тестирования

Использование `-use-vendor-bin` необязательно. Этот параметр будет работать для большинства проектов Codeception, где Codeception находится в вашей `vendor/bin` папке. Но, например, если вы используете глобальную установку Codeception, вы бы не использовали эту опцию.

Обратите внимание, что с параметром `-use-vendor-bin` ваши команды будут выполняться с использованием двоичного файла Codeception, расположенного в корневом каталоге вашего проекта. Без этой опции он будет использовать любой двоичный файл Codeception, который вы изначально использовали для создания сценария завершения (‘местоположение codeception’ в приведенных выше примерах)

## Заключение

Codeception - это фреймворк, который на первый взгляд может показаться простым, но он позволяет создавать мощные тесты с помощью единого API, проводить их рефакторинг и писать их быстрее с помощью интерактивной консоли. Тесты Codeception можно легко организовать в группах или классах Cest.

-   **Следующая глава: [BDD >](https://codeception.com/docs/07-BDD)**
-   **Предыдущая глава: [< Повторное использование тестового кода](https://codeception.com/docs/06-ReusingTestCode)**

[**Отредактируйте** эту страницу на GitHub](https://github.com/Codeception/codeception.github.com/edit/master/docs/4.x/AdvancedUsage.md)
