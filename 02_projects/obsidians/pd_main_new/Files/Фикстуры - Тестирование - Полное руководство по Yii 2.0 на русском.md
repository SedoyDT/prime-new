---
created: 2024-02-12T07:29:47 (UTC +03:00)
tags: [Yii2 русская документация,Yii 2.0 на русском,Yii 2 по-русски]
source: https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#
author: 
tags:
 - web
 - firefox
---
[[2024-02-12]]

# Фикстуры - Тестирование - Полное руководство по Yii 2.0 на русском

> ## Excerpt
> Фикстуры (англ. fixtures) - это важная составляющая тестирования. Их основная задача заключается в подготовке окружения
с заранее фиксированным/известным состоянием для гарантии повторяемости процесса тестирования. Yii предоставляет
фреймворк, который позволяет легко и точно определять фикстуры и использовать их в ваших тестах.

---
## Фикстуры

1.  [Объявление фикстуры](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
2.  [Использование фикстур](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
3.  [Определение и использование глобальных фикстур](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
4.  [Организация классов фикстур и файлов с данными](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
5.  [Резюме](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
6.  [Формат фикстуры](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
7.  [Загрузка фикстур](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
8.  [Выгрузка фикстур](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
9.  [Глобальная настройка команды](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
10.  [Автоматическая генерация фикстур](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)

Фикстуры (англ. fixtures) - это важная составляющая тестирования. Их основная задача заключается в подготовке окружения с заранее фиксированным/известным состоянием для гарантии повторяемости процесса тестирования. Yii предоставляет фреймворк, который позволяет легко и точно определять фикстуры и использовать их в ваших тестах.

Ключевым понятием в фреймворке фикстур Yii является так называемый _объект фикстуры_. Объект фикстуры представляет собой особый аспект тестового окружения, который наследуется от [yii\\test\\Fixture](https://p0vidl0.info/yii2-api-guides/yii-test-fixture.html) или его наследников. Например, вы можете использовать `UserFixture` для того, чтобы быть уверенным, что таблица пользователей содержит известный набор данных. Вы загружаете один или несколько объектов фикстур перед запуском теста и выгружаете их после его завершения.

Фикстура может зависеть от других фикстур, заданных через свойство [yii\\test\\Fixture::$depends](https://p0vidl0.info/yii2-api-guides/yii-test-fixture.html#$depends-detail). Когда фикстура загружается, фикстуры, от которых она зависит, будут автоматически загружены ДО нее, а когда она выгружается все зависимые фикстуры будут выгружены ПОСЛЕ нее.

## Объявление фикстуры

Для объявления фикстуры создайте новый класс унаследованный от [yii\\test\\Fixture](https://p0vidl0.info/yii2-api-guides/yii-test-fixture.html) или [yii\\test\\ActiveFixture](https://p0vidl0.info/yii2-api-guides/yii-test-activefixture.html). Первый лучше всего подходит для фикстур общего назначения, в то время как последний имеет расширенные функции, специально предназначенные для работы с базой данных и ActiveRecord.

Следующий код показывает как объявить фикстуру для модели ActiveRecord `User`, которая соответствует таблице пользователей.

```php
<?php namespace app\tests\fixtures; use yii\test\ActiveFixture; class UserFixture extends ActiveFixture { public $modelClass = 'app\models\User'; }
```

> **Tip:** каждая `ActiveFixture` предназначена для подготовки таблицы базы данных для тестирования. Вы можете указать таблицу как через свойство [yii\\test\\ActiveFixture::$tableName](https://p0vidl0.info/yii2-api-guides/yii-test-activefixture.html#$tableName-detail), так и через свойство [yii\\test\\ActiveFixture::$modelClass](https://p0vidl0.info/yii2-api-guides/yii-test-baseactivefixture.html#$modelClass-detail). Если последнее, то в этом случае имя таблицы будет взято из модели `ActiveRecord`, указанной в `modelClass`.

> **Note:** [yii\\test\\ActiveFixture](https://p0vidl0.info/yii2-api-guides/yii-test-activefixture.html) используется только для реляционных баз данных. Для NoSQL-решений Yii предоставляет следующие классы `ActiveFixture`:
> 
> -   MongoDB: [yii\\mongodb\\ActiveFixture](https://p0vidl0.info/yii2-api-guides/yii-mongodb-activefixture.html)
> -   Elasticsearch: [yii\\elasticsearch\\ActiveFixture](https://p0vidl0.info/yii2-api-guides/yii-elasticsearch-activefixture.html) (начиная с версии 2.0.2)

Данные для фикстуры `ActiveFixture`, как правило, находятся в файле `FixturePath/data/TableName.php`,  
где `FixturePath` указывает на директорию, в которой располагается файл класса фикстуры, а `TableName` на имя таблицы, с которой она ассоциируется. Для примера выше, данные должны быть в файле `@app/tests/fixtures/data/user.php`. Данный файл должен вернуть массив данных для строк, которые будут вставлены в таблицу пользователей. Например

```php
<?php return [ 'user1' => [ 'username' => 'lmayert', 'email' => 'strosin.vernice@jerde.com', 'auth_key' => 'K3nF70it7tzNsHddEiq0BZ0i-OU8S3xV', 'password' => '$2y$13$WSyE5hHsG1rWN2jV8LRHzubilrCLI5Ev/iK0r3jRuwQEs2ldRu.a2', ], 'user2' => [ 'username' => 'napoleon69', 'email' => 'aileen.barton@heaneyschumm.com', 'auth_key' => 'dZlXsVnIDgIzFgX4EduAqkEPuphhOh9q', 'password' => '$2y$13$kkgpvJ8lnjKo8RuoR30ay.RjDf15bMcHIF7Vz1zz/6viYG5xJExU6', ], ];
```

Вы можете задать псевдоним строке для того, чтобы в будущем вы могли ссылаться на нее в ваших тестах. В примере выше 2 строки имеют псевдонимы `user1` и `user2`, соответственно.

Также вам не нужно указывать данные для столбцов с автоинкрементом. Yii автоматически заполнит значения данных столбцов в момент загрузки фикстуры.

> **Tip:** вы можете указать свой путь до файла данных через свойство [yii\\test\\ActiveFixture::$dataFile](https://p0vidl0.info/yii2-api-guides/yii-test-activefixture.html#$dataFile-detail). Вы также можете переопределить метод [yii\\test\\ActiveFixture::getData()](https://p0vidl0.info/yii2-api-guides/yii-test-activefixture.html#getData()-detail), чтобы предоставить данные.

Как мы описали ранее, фикстура может зависеть от других фикстур. Например, для `UserProfileFixture` возможно потребуется зависимость от `UserFixture` так как таблица пользовательских профилей содержит внешний ключ, указывающий на таблицу пользователей. Зависимость указывается через свойство [yii\\test\\Fixture::$depends](https://p0vidl0.info/yii2-api-guides/yii-test-fixture.html#$depends-detail), как в следующем примере

```php
namespace app\tests\fixtures; use yii\test\ActiveFixture; class UserProfileFixture extends ActiveFixture { public $modelClass = 'app\models\UserProfile'; public $depends = ['app\tests\fixtures\UserFixture']; }
```

Зависимость также гарантирует, что фикстуры загружаются и выгружаются в определенном порядке. В предыдущем примере `UserFixture` будет автоматически загружена до `UserProfileFixture`, тем самым гарантируя существование всех внешних ключей, и будет выгружена после того как выгрузится `UserProfileFixture` по тем же причинам.

Выше мы показали как объявить фикстуру для таблицы базы данных. Для объявления фикстуры, не связанной с базой данных (например, фикстуры для определенных файлов и директорий), вам следует унаследовать ее от класса [yii\\test\\Fixture](https://p0vidl0.info/yii2-api-guides/yii-test-fixture.html) и переопределить методы [load()](https://p0vidl0.info/yii2-api-guides/yii-test-fixture.html#load()-detail) и [unload()](https://p0vidl0.info/yii2-api-guides/yii-test-fixture.html#unload()-detail).

## Использование фикстур

Если вы используете [Codeception](http://codeception.com/) для тестирования вашего кода, вам следует рассмотреть вопрос об использовании расширения `yii2-codeception`, которое имеет встроенную поддержку загрузки фикстур и доступа к ним. Если вы используете другой фреймворк для тестирования, вы можете использовать [yii\\test\\FixtureTrait](https://p0vidl0.info/yii2-api-guides/yii-test-fixturetrait.html) в ваших тестах для этих целей.

Далее мы опишем как написать класс модульного тестирования для модели `UserProfile` с использованием расширения `yii2-codeception`.

Объявите какие фикстуры вы хотите использовать в методе [fixtures()](https://p0vidl0.info/yii2-api-guides/yii-test-fixturetrait.html#fixtures()-detail) вашего класса модульного тестирования, унаследованного от [yii\\codeception\\DbTestCase](https://p0vidl0.info/yii2-api-guides/yii-codeception-dbtestcase.html) или [yii\\codeception\\TestCase](https://p0vidl0.info/yii2-api-guides/yii-codeception-testcase.html). Например,

```php
namespace app\tests\unit\models; use yii\codeception\DbTestCase; use app\tests\fixtures\UserProfileFixture; class UserProfileTest extends DbTestCase { public function fixtures() { return [ 'profiles' => UserProfileFixture::className(), ]; } // ...методы тестирования... }
```

Фикстуры перечисленные в методе `fixtures()` будут автоматически загружены перед выполнением каждого метода тестирования тест-кейса и выгружены после завершения каждого метода тестирования. И, как мы описали ранее, когда фикстура загружается, все зависимые от нее фикстуры будут автоматически загружены в первую очередь. В приведенном выше примере, при выполнении любого метода тестирования в тест-кейсе последовательно будут загружены две фикстуры: `UserFixture` и `UserProfileFixture`, поскольку `UserProfileFixture` зависит от `UserFixture`.

Для определения фикстур в методе `fixtures()` вы можете использовать либо имя класса, либо массив настроек. С помощью массива настроек вы можете настроить свойства фикстуры, которые будут установлены при ее загрузке.

Вы также можете назначить фикстуре псевдоним. В примере выше, `profiles` является псевдонимом фикстуры `UserProfileFixture`. С помощью псевдонима вы можете получить объект фикстуры в ваших методах тестирования. Например, `$this->profiles` вернет объект `UserProfileFixture`.

Поскольку `UserProfileFixture` наследуется от `ActiveFixture`, вы можете также использовать следующий синтаксис для доступа к данным фикстуры:

```php
// вернет строку данных для псевдонима 'user1' $row = $this->profiles['user1']; // вернет модель UserProfile, соответствующую строке данных для псевдонима 'user1' $profile = $this->profiles('user1'); // обход данных фикстуры в цикле foreach ($this->profiles as $row) ...
```

> **Info:** `$this->profiles` продолжает быть объектом класса `UserProfileFixture`. Указанные особенности доступа реализуются через магические методы PHP.

## Определение и использование глобальных фикстур

Фикстуры, описанные выше, в основном используются в рамках определенных тест-кейсов. В большинстве случаев, вам также нужны глобальные фикстры, которые применяются во ВСЕХ или большинстве тест-кейсов. Примером является фикстура [yii\\test\\InitDbFixture](https://p0vidl0.info/yii2-api-guides/yii-test-initdbfixture.html), которая делает 2 вещи:

-   Запускает скрипт `@app/tests/fixtures/initdb.php` для выполнения ряда общих задач инициализации тестового окружения;
-   Отключает проверку целостности данных перед загрузкой остальных фикстур, и включает ее обратно после того как все остальные фикстуры будут выгружены.

Использование глобальных фикстур схоже с использованием не глобальных. Единственное отличие в том, что вы должны объявить эти фикстуры в методе [yii\\codeception\\TestCase::globalFixtures()](https://p0vidl0.info/yii2-api-guides/yii-test-fixturetrait.html#globalFixtures()-detail), а не `fixtures()`. Когда тест-кейс загружает фикстуры, сначала загружаются глобальные фикстуры, затем все остальные.

По умолчанию фикстура `InitDbFixture` уже обяъвлена в методе `globalFixtures()` класса [yii\\codeception\\DbTestCase](https://p0vidl0.info/yii2-api-guides/yii-codeception-dbtestcase.html). Это означает, что вы должны работать только с файлом `@app/tests/fixtures/initdb.php`, если вы хотите чтобы перед каждым тестом выполнялись определенные подготовительные работы. В противном случае вы просто можете сфокусироваться на разработке конкретных тест-кейсов и соответствующих фикстур.

## Организация классов фикстур и файлов с данными

По умолчанию классы фикстур ищут соответствующие файлы данных в директории `data`, которая является подпапкой папки, содержащей файлы классов фикстур. Вы можете следовать этому соглашению при работе над простыми проектами. Есть вероятность, что на больших проектах вам потребуется менять набор данных для одного и того же класса фикстур в разных тестах. Таким образом, мы рекомендуем вам организовать файлы данных иерархически, подобно пространству имен ваших классов. Например,

```
# в папке <span>tests</span>\<span>unit</span>\<span>fixtures</span>

<span>data</span>\
    <span>components</span>\
        <span>fixture_data_file1</span><span>.php</span>
        <span>fixture_data_file2</span><span>.php</span>
        ...
        <span>fixture_data_fileN</span><span>.php</span>
    <span>models</span>\
        <span>fixture_data_file1</span><span>.php</span>
        <span>fixture_data_file2</span><span>.php</span>
        ...
        <span>fixture_data_fileN</span><span>.php</span>
# и так далее
```

Таким образом вы избежите коллизий файлов данных фикстур между тестами и будете использовать их, как вам нужно.

> **Note:** в примере выше файлы данных фикстур названы так только в качестве примера. В реальных жизни вам следует называть их в соответствии с тем от какого класса наследуется ваш класс фикстуры. Например, при наследовании от [yii\\test\\ActiveFixture](https://p0vidl0.info/yii2-api-guides/yii-test-activefixture.html) для фикстур БД вам следует использовать имя таблицы в качестве имени файла данных; при наследовании от [yii\\mongodb\\ActiveFixture](https://p0vidl0.info/yii2-api-guides/yii-mongodb-activefixture.html) для фикстур MongoDB вам следует использовать имя коллекции в качестве имени файла.

Вы можете использовать похожую иерархию для организации файлов классов фикстур. Чтобы избежать конфликта с файлами данных вы можете использовать в качестве корневой директории `fixtures` вместо `data`.

## Резюме

> **Note:** Этот раздел находится в разработке.

Выше мы описали как объявлять и использовать фикстуры. Ниже приведен типовой сценарий выполнения модульных тестов, связанных с БД:

1.  Используйте команду `yii migrate` для обновления тестовой БД до последней версии;
2.  Выполнить тест-кейс:
    -   Загрузка фикстур: очистка соответствующих таблиц БД и заполнение их данными фикстур;
    -   Выполнение теста;
    -   Выгрузка фикстур.
3.  Повторение шага 2 до тех пор, пока не выполнятся все тесты.

**Будет доработано**

## Управление фикстурами

1.  [Объявление фикстуры](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
2.  [Использование фикстур](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
3.  [Определение и использование глобальных фикстур](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
4.  [Организация классов фикстур и файлов с данными](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
5.  [Резюме](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
6.  [Формат фикстуры](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
7.  [Загрузка фикстур](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
8.  [Выгрузка фикстур](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
9.  [Глобальная настройка команды](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)
10.  [Автоматическая генерация фикстур](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#)

> **Note:** Данный раздел находится в разработке.
> 
> todo: данный раздел может быть объединен с предыдущими частями test-fixtures.md

Фикстуры являются важной составляющей тестирования. Их основная задача в предоставлении набора данных, необходимого для тестирования различных сценариев работы вашего приложения. С этими данными использование ваших тестов становятся более эффективным и полезным.

Yii поддерживает фикстуры через утилиту командной строки `yii fixture`. Эта утилита поддерживает:

-   Загрузку фикстур в различные хранилища, такие как: RDBMS, NoSQL и другие;
-   Выгрузку фикстур разными способами (как правило очищает хранилище);
-   Автоматическую генерацию фикстур и наполнение их случайными данными

## Формат фикстуры

Фикстуры - это объекты с различными методами и конфигурацией, с которыми вы можете ознакомиться в официальной [документации](https://github.com/yiisoft/yii2/blob/master/docs/guide/test-fixture.md).

Давайте предположим, что у нас есть следующий набор данных фикстуры для загрузки:

```
<span># файл users.php в директории файлов данных фикстур, по умолчанию @tests\unit\fixtures\data</span>

<span>return</span> [
    [
        <span>'name'</span> =&gt; <span>'Chase'</span>,
        <span>'login'</span> =&gt; <span>'lmayert'</span>,
        <span>'email'</span> =&gt; <span>'strosin.vernice@jerde.com'</span>,
        <span>'auth_key'</span> =&gt; <span>'K3nF70it7tzNsHddEiq0BZ0i-OU8S3xV'</span>,
        <span>'password'</span> =&gt; <span>'$2y$13$WSyE5hHsG1rWN2jV8LRHzubilrCLI5Ev/iK0r3jRuwQEs2ldRu.a2'</span>,
    ],
    [
        <span>'name'</span> =&gt; <span>'Celestine'</span>,
        <span>'login'</span> =&gt; <span>'napoleon69'</span>,
        <span>'email'</span> =&gt; <span>'aileen.barton@heaneyschumm.com'</span>,
        <span>'auth_key'</span> =&gt; <span>'dZlXsVnIDgIzFgX4EduAqkEPuphhOh9q'</span>,
        <span>'password'</span> =&gt; <span>'$2y$13$kkgpvJ8lnjKo8RuoR30ay.RjDf15bMcHIF7Vz1zz/6viYG5xJExU6'</span>,
    ],
];
```

Если вы используете фикстуру, которая загружает данные в базу данных, то эти строки будут применены к таблице `users`. Если вы используете фикстуру для загрузки данных в nosql, например, фикстура для `mongodb`, то данные будут применены к коллекции `users`. Для того, чтобы узнать о реализации различных сценариях загрузки фикстур, обратитесь к официальной [документации](https://github.com/yiisoft/yii2/blob/master/docs/guide/test-fixture.md). Предыдущий пример фикстуры был сгенерирован автоматически с использованием расширения `yii2-faker`, подробнее про это читайте в этом [разделе](https://p0vidl0.info/yii2-api-guides/guide-ru-test-fixtures.html#auto-generating-fixtures). Имя класса фикстуры должно быть в единственном числе.

## Загрузка фикстур

Класс фикстур должны содержать суффикс `Fixture`. По умолчанию поиск фикстур выполняется в пространстве имен `tests\unit\fixtures`, но вы можете изменить это поведение через конфигурационный файл или параметры команды. Вы можете исключить некоторые фикстуры из загрузки или выгрузки добавив `-` перед их именем, например `-User`.

Чтобы загрузить фикстуру, выполните следующую команду:

```
<span>yii</span> fixture/load &lt;fixture_name&gt;
```

Обязательный параметр `fixture_name` указываем на имя фикстуры, которая должна быть загружена. Вы можете загрузить несколько фикстур за раз. Ниже указаны примеры корректного использования данной команды:

```
<span>// загрузить фикстуру `User`</span>
yii fixture/load User

<span>// то же что и выше, т.к. "load" является действием по умолчанию для команды "fixture"</span>
yii fixture User

<span>// загрузить нескольких фикстур</span>
yii fixture <span>"User, UserProfile"</span>

<span>// загрузить все фикстуры</span>
yii fixture/load <span>"*"</span>

<span>// то же что и выше</span>
yii fixture <span>"*"</span>

<span>// загрузить все фикстуры кроме указанной</span>
yii fixture <span>"*, -DoNotLoadThisOne"</span>

<span>// загрузка фикстур, но искать их следует в другом пространстве имен. Пространство имен по умолчанию: tests\unit\fixtures.</span>
yii fixture User --namespace=<span>'alias\my\custom\namespace'</span>

<span>// загрузить глобальную фикстуру `some\name\space\CustomFixture` перед загрузкой остальных фикстур.</span>
<span>// По умолчанию данный параметр установлен в `InitDbFixture` для включения/отключения проверки целостности данных.</span>
<span>// Вы можете задать несколько глобальных фикстур, указав их через запятую</span>
yii fixture User --globalFixtures=<span>'some\name\space\Custom'</span>
```

## Выгрузка фикстур

Для выгрузки фикстур выполните следующую команду:

```
<span>// выгрузить фикстуру `Users`, по умолчанию будут удалены все данные из таблицы "users" или из коллекции "users", если это фикстура mongodb</span>
yii fixture/unload User

<span>// выгрузить несколько фикстур</span>
yii fixture/unload <span>"User, UserProfile"</span>

<span>// выгрузить все фикстуры</span>
yii fixture/unload <span>"*"</span>

<span>// выгрузить все фикстуры за исключением указанной</span>
yii fixture/unload <span>"*, -DoNotUnloadThisOne"</span>

```

При выгрузке фикстур вы также можете использовать параметры `namespace` и `globalFixtures`.

## Глобальная настройка команды

Хотя параметры командой строки и позволяют нам настраивать команду миграции на лету, иногда нам может понадобиться настроить команду один раз для всех сценариев запуска. Например, вы можете настроить различные пути до файлов с фикстурами как в примере ниже:

```
<span>'controllerMap'</span> =&gt; [
    <span>'fixture'</span> =&gt; [
        <span>'class'</span> =&gt; <span>'yii\console\controllers\FixtureController'</span>,
        <span>'namespace'</span> =&gt; <span>'myalias\some\custom\namespace'</span>,
        <span>'globalFixtures'</span> =&gt; [
            <span>'some\name\space\Foo'</span>,
            <span>'other\name\space\Bar'</span>
        ],
    ],
]
```

## Автоматическая генерация фикстур

Yii также может автоматически генерировать для вас фикстуры на основе некоторого шаблона. Вы можете генерировать фикстуры с различным набором данных на разных языках и в разных форматах. Данная возможность основана на использовании библиотеки [Faker](https://github.com/fzaninotto/Faker) и расширения `yii2-faker`.

Для получения дополнительной информации ознакомьтесь с [руководством](https://github.com/yiisoft/yii2-faker).
