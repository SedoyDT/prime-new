
#P_PHP
#PHP

#telegram 

# 🤔 **<u>Что такое интерфейсы и для чего они нужны?</u>** 
<!-- basicblock-start oid="ObseO6OYE1eabCdk9Cy7D9bX"  deck='P_PHP' -->
🤔 **<u>Что такое интерфейсы и для чего они нужны?</u>** ::


Интерфейсы в программировании, включая PHP, — это абстрактные типы, которые определяют набор методов, которые должен реализовать класс, но не содержат их реализации. Интерфейсы служат для определения общего контракта, который должны соблюдать классы, реализующие этот интерфейс.

🚩**Основные характеристики интерфейсов**

🟠**Абстракция**:
Интерфейсы объявляют методы, которые должны быть реализованы классами, но не содержат их реализации. Это обеспечивает высокий уровень абстракции.

🟠**Множественное наследование**:
В отличие от классов, PHP поддерживает множественное наследование интерфейсов. Класс может реализовывать несколько интерфейсов.

🟠**Отсутствие реализации**:
Интерфейсы не могут содержать реализации методов. Все методы интерфейса должны быть реализованы в классе, который его реализует.

Пример интерфейса
```
interface Logger {
    public function log(string $message);
}

class FileLogger implements Logger {
    public function log(string $message) {
        file_put_contents('log.txt', $message.PHP_EOL, FILE_APPEND);
    }
}

class DatabaseLogger implements Logger {
    public function log(string $message) {
        // Логирование в базу данных
    }
}

function logMessage(Logger $logger, string $message) {
    $logger->log($message);
}

$fileLogger = new FileLogger();
logMessage($fileLogger, "This is a log message.");
```

Интерфейс `Logger` объявляет метод `log`. Классы `FileLogger` и `DatabaseLogger` реализуют интерфейс `Logger` и предоставляют собственную реализацию метода `log`. Функция `logMessage` принимает любой объект, реализующий интерфейс `Logger`, что позволяет легко менять тип логгера без изменения логики функции.

🚩**Зачем нужны интерфейсы**

➕**Определение контрактов**:
Интерфейсы позволяют определить контракт, который должен быть соблюден классами. Это означает, что все классы, реализующие интерфейс, будут иметь определенный набор методов, что упрощает разработку и поддержку кода.

➕**Гибкость и расширяемость**:
Интерфейсы позволяют легко изменять и расширять функциональность приложения. Например, можно добавить новый класс, реализующий интерфейс, без необходимости изменения существующего кода, который работает с этим интерфейсом.

➕**Полиморфизм**:
Интерфейсы позволяют использовать полиморфизм, то есть возможность использовать объекты разных классов через один и тот же интерфейс. Это упрощает управление различными типами объектов в коде.

➕**Снижение зависимости**:
Интерфейсы помогают снизить зависимость между компонентами системы, что упрощает тестирование и модульность кода. Это позволяет заменять реализации без изменения потребителей этих интерфейсов.

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->




#P_PHP
#PHP

#telegram 

# 🤔 **<u>Что такое PHP FPM?</u>** 
<!-- basicblock-start oid="ObsXzc2b8WZAoFMnWTPCO778"  deck='P_PHP' -->
🤔 **<u>Что такое PHP FPM?</u>** ::


PHP-FPM (PHP FastCGI Process Manager) – это альтернативная реализация PHP FastCGI, предназначенная для обеспечения высокой производительности и управляемости PHP-приложений.

🚩**Плюсы**

➕**Повышение производительности**: 
PHP-FPM позволяет значительно улучшить производительность веб-серверов за счет управления пулом PHP-процессов, которые могут обрабатывать запросы параллельно.

➕**Масштабируемость**: 
Он легко масштабируется для работы с большим количеством одновременных запросов.

➕**Настраиваемость**: 
PHP-FPM предлагает широкие возможности для настройки, такие как управление количеством процессов, лимиты на использование ресурсов, настройка поведения при возникновении ошибок и многое другое.

➕**Изоляция окружений**: 
Можно настроить несколько пулов процессов для различных приложений, что позволяет изолировать их друг от друга.

🚩**Как работает?**

**1⃣****Запуск пула процессов**: 
При старте PHP-FPM инициализирует пул процессов, которые готовы принимать запросы.
2⃣**Обработка запросов**: 
Веб-сервер перенаправляет запросы на сокет PHP-FPM, где процессы обрабатывают их и возвращают результаты.
3⃣**Управление процессами**: 
PHP-FPM управляет количеством процессов, создавая новые при необходимости и завершая неиспользуемые для оптимизации использования ресурсов.

🚩**Пример конфигурации PHP-FPM**

PHP-FPM (обычно находится в `/etc/php/7.x/fpm/pool.d/www.conf`):
```
[www]
user = www-data
group = www-data
listen = /run/php/php7.x-fpm.sock
listen.owner = www-data
listen.group = www-data
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
```

Nginx для использования PHP-FPM:
```
server {
    listen 80;
    server_name example.com;
    root /var/www/html;

    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php7.x-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->




#P_PHP
#PHP

#telegram 

# 🤔 **<u>Что такое магические методы?</u>** 
<!-- basicblock-start oid="ObspAMYkbU3QhLSjjisaorXN"  deck='P_PHP' -->
🤔 **<u>Что такое магические методы?</u>** ::


Это специальные методы, которые имеют префикс `__` (две подчёркивания) и предназначены для выполнения определённых действий, когда происходят определённые события в объектах. 

🚩**Основные**

🟠**`__construct`** и **`__destruct`**
`__construct`: Вызывается при создании нового объекта. `__destruct`: Вызывается при удалении объекта. 
```
class MyClass {
    public function __construct() {
        echo "Object created";
    }

    public function __destruct() {
        echo "Object destroyed";
    }
}

$obj = new MyClass(); // выводит: Object created
unset($obj); // выводит: Object destroyed    
```

🟠**`__call`** и **`__callStatic`**
`__call`: Вызывается при вызове недоступного метода в контексте объекта. `__callStatic`: Вызывается при вызове недоступного статического метода.    
```
    class MyClass {
        public function __call($name, $arguments) {
            echo "Calling method '$name' with arguments: " . implode(', ', $arguments);
        }

        public static function __callStatic($name, $arguments) {
            echo "Calling static method '$name' with arguments: " . implode(', ', $arguments);
        }
    }

    $obj = new MyClass();
    $obj->nonExistingMethod('arg1', 'arg2'); // выводит: Calling method 'nonExistingMethod' with arguments: arg1, arg2

    MyClass::nonExistingStaticMethod('arg1', 'arg2'); // выводит: Calling static method 'nonExistingStaticMethod' with arguments: arg1, arg2    
```

🟠**`__get`** и **`__set`**
`__get`: Вызывается при доступе к недоступным свойствам. `__set`: Вызывается при установке значений недоступным свойствам.   
```
class MyClass {
    private $data = [];

    public function __get($name) {
        return $this->data[$name];
    }

    public function __set($name, $value) {
        $this->data[$name] = $value;
    }
}

$obj = new MyClass();
$obj->nonExistingProperty = 'value';
echo $obj->nonExistingProperty; // выводит: value    
```

🟠**`__isset`** и **`__unset`**
`__isset`: Вызывается при вызове `isset()` или `empty()` на недоступных свойствах. `__unset`: Вызывается при вызове `unset()` на недоступных свойствах.   
```
class MyClass {
    private $data = [];

    public function __isset($name) {
        return isset($this->data[$name]);
    }

    public function __unset($name) {
        unset($this->data[$name]);
    }
}

    $obj = new MyClass();
    $obj->property = 'value';
    var_dump(isset($obj->property)); // выводит: bool(true)
    unset($obj->property);
    var_dump(isset($obj->property)); // выводит: bool(false)    
```

🟠**`__toString`**
Вызывается при попытке использовать объект как строку (например, при `echo` или `print`).
```
class MyClass {
    public function __toString() {
        return "This is MyClass object";
    }
}

$obj = new MyClass();
echo $obj; // выводит: This is MyClass object
```

🟠**`__invoke`**
Вызывается при попытке использовать объект как функцию.
```
class MyClass {
    public function __invoke($arg) {
        echo "Called with argument: $arg";
    }
}

$obj = new MyClass();
$obj('some argument'); // выводит: Called with argument: some argument
```

🟠**`__clone`**
Вызывается при клонировании объекта.
```
class MyClass {
   public function __clone() {
        echo "Object cloned";
    }
}

$obj = new MyClass();
$clonedObj = clone $obj; // выводит: Object cloned  
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->




#P_PHP
#PHP

#telegram 

# 🤔 **<u>Когда имеет смысл использовать event sourcing?</u>** 
<!-- basicblock-start oid="ObsV3crGlfq0x3MezbCvz0yB"  deck='P_PHP' -->
🤔 **<u>Когда имеет смысл использовать event sourcing?</u>** ::


Это паттерн проектирования, при котором все изменения состояния приложения сохраняются как последовательность событий. Вместо хранения только текущего состояния системы, каждая операция записывается как отдельное событие. Это позволяет восстанавливать состояние системы на любой момент времени, просто воспроизведя все события до этого момента.

🚩**Когда имеет смысл?**

🟠**Необходимость аудита и отслеживания изменений**
Если требуется вести полный аудит всех изменений данных, включая информацию о том, кто и когда вносил изменения, Event Sourcing предоставляет подробную историю событий.

🟠**Восстановление состояния системы**
При необходимости восстановления состояния системы на определённый момент времени Event Sourcing позволяет воспроизвести последовательность событий, что полезно для восстановления после сбоев.

🟠**Поддержка сложных бизнес-правил**
Если система имеет сложные бизнес-правила, которые изменяются с течением времени, Event Sourcing может помочь управлять этими изменениями и обеспечивать их прозрачность.

🟠**Интеграция и согласованность данных**
В системах, где важно поддерживать согласованность данных между различными сервисами и компонентами, Event Sourcing обеспечивает последовательность и целостность данных.

🟠**Отказоустойчивость и масштабируемость**
Event Sourcing часто используется в микросервисной архитектуре для повышения отказоустойчивости и масштабируемости системы. Каждый сервис может хранить свою собственную историю событий, а централизованный лог событий может служить для синхронизации между сервисами.

🟠**Реализация CQRS (Command Query Responsibility Segregation)**
Event Sourcing часто используется вместе с CQRS, где команды (commands) и запросы (queries) обрабатываются раздельно. Команды изменяют состояние через события, а запросы получают данные из проекций событий.

🚩**Пример**

Событие
```
class Event {
    public $type;
    public $data;
    public $timestamp;

    public function __construct($type, $data) {
        $this->type = $type;
        $this->data = $data;
        $this->timestamp = time();
    }
}
```

Агрегат
```
class ShoppingCart {
    private $events = [];
    private $items = [];

    public function addItem($item) {
        $event = new Event('ItemAdded', ['item' => $item]);
        $this->apply($event);
        $this->events[] = $event;
    }

    private function apply(Event $event) {
        switch ($event->type) {
            case 'ItemAdded':
                $this->items[] = $event->data['item'];
                break;
        }
    }

    public function getItems() {
        return $this->items;
    }

    public function getEvents() {
        return $this->events;
    }
}
```

Использование
```
$cart = new ShoppingCart();
$cart->addItem('Apple');
$cart->addItem('Banana');

echo "Current items in cart: " . implode(', ', $cart->getItems()) . "\n";
```

Восстановление состояния из событий
```
$replayedCart = new ShoppingCart();
foreach ($cart->getEvents() as $event) {
    $replayedCart->apply($event);
}

echo "Replayed items in cart: " . implode(', ', $replayedCart->getItems()) . "\n";
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->




#P_PHP
#PHP

#telegram 

# 🤔 **<u>Как с MVI обрабатывать события, которые не нужно хранить?</u>** 
<!-- basicblock-start oid="ObseFlLR5BaWSX8IbCCksEPp"  deck='P_PHP' -->
🤔 **<u>Как с MVI обрабатывать события, которые не нужно хранить?</u>** ::


Популярна в мобильной разработке, особенно в Android, но её концепции могут быть адаптированы и для веб-разработки, включая PHP. В MVI основное внимание уделяется однонаправленному потоку данных и управлению состоянием.

🚩**Инструменты**

**🟠****Model (Модель)**
Представляет данные и бизнес-логику.
🟠**View (Представление)**
Отображает данные и реагирует на действия пользователя.
🟠**Intent (Интент)**
Определяет намерения пользователя (действия), которые изменяют состояние модели.

**🚩****Обработка временных событий**

Это такие события, которые не должны сохраняться в состоянии модели. Примеры таких событий включают показ сообщений об ошибках, всплывающих окон, уведомлений и т.д.

🚩**Подходы к обработке** 

**🟠****Одноразовые события (One-time Events)**
Эти события обрабатываются и удаляются сразу после обработки. Показ уведомления об ошибке, которое исчезает после закрытия пользователем.
🟠**Обратный вызов (Callback)**
Использование обратных вызовов для обработки событий. Передача функции обратного вызова, которая вызывается при возникновении события.
🟠**Временное состояние (Transient State)**
Использование специальных флагов или объектов для временного хранения событий. Хранение флага для показа всплывающего сообщения.

🚩**Пример реализации временного события в MVI**
Предположим, что у нас есть событие показа сообщения об ошибке, которое не нужно хранить в модели.
```
// Model
class ErrorModel {
    private $state;
    
    public function __construct() {
        $this->state = [];
    }
    
    public function getState() {
        return $this->state;
    }

    public function showError($message) {
        $this->state['error'] = $message;
    }

    public function clearError() {
        unset($this->state['error']);
    }
}

// Intent
class ErrorIntent {
    protected $model;
    
    public function __construct(ErrorModel $model) {
        $this->model = $model;
    }
    
    public function triggerError($message) {
        $this->model->showError($message);
    }
    
    public function clearError() {
        $this->model->clearError();
    }
}

// View
class ErrorView {
    public function render($state) {
        if (isset($state['error'])) {
            echo "<div class='error'>{$state['error']}</div>";
        }
    }
}

// Контроллер (Связка View и Intent)
class ErrorController {
    protected $view;
    protected $intent;
    
    public function __construct(ErrorView $view, ErrorIntent $intent) {
        $this->view = $view;
        $this->intent = $intent;
    }
    
    public function showError($message) {
        $this->intent->triggerError($message);
        $this->view->render($this->intent->getModel()->getState());
        $this->intent->clearError(); // Событие обработано и очищено
    }
}

// Использование
$model = new ErrorModel();
$intent = new ErrorIntent($model);
$view = new ErrorView();
$controller = new ErrorController($view, $intent);

// Триггер ошибки
$controller->showError("Произошла ошибка!");
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->




#P_PHP
#PHP

#telegram 

# 📌 <u>**Что такое типизация?**</u>
<!-- basicblock-start oid="ObsWxSIKQDvo7Fw9kueIiKyE"  deck='P_PHP' -->
📌 <u>**Что такое типизация?**</u>::


💬 [Спросят с вероятностью 13%](https://easyoffer.ru/rating/frontend_developer)

<u>Типизация</u> — это концепция, которая определяет, каким образом и когда типы данных присваиваются переменным. Типы данных определяют, какие операции могут быть выполнены с данными, как они хранятся в памяти и как интерпретируются. Существует несколько аспектов типизации, включая строгость и время проверки типов.

🤔 **Основные виды**

1️⃣ **Статическая и динамическая типизация**

➕ **Статическая типизация**: Типы переменных определяются во время компиляции, и их проверка осуществляется компилятором. Это позволяет обнаруживать ошибки типов до выполнения программы. Языки со статической типизацией включают Java, C++, и TypeScript.
`          int number = 10; // Тип переменной number определён как int
     number = "Hello"; // Ошибка: Нельзя присвоить строку переменной типа int`
     
➕ **Динамическая типизация**: Типы переменных определяются во время выполнения программы, и типы могут изменяться. Это обеспечивает большую гибкость, но ошибки типов могут возникать только во время выполнения. Языки с динамической типизацией включают Python, JavaScript и PHP.
`          number = 10    # Тип переменной number определяется как int
     number = "Hello" # Теперь тип переменной number определяется как str`
     

2️⃣ **Сильная и слабая типизация**

➕ **Сильная типизация**: Типы строго контролируются, и не допускается неявное преобразование типов, которое могло бы привести к ошибкам. Языки со строгой типизацией включают Python и Java.
`          number = 10
     result = number + "10" # Ошибка: нельзя складывать int и str`
➕ **Слабая типизация**: Языки допускают неявное преобразование типов, что может приводить к неожиданным результатам. Языки со слабой типизацией включают JavaScript и PHP.
`          var number = 10;
     var result = number + "10"; // Неявное преобразование int в str, result будет "1010"`
     

Поддерживает динамическую и слабую типизацию, но с введением PHP 7, также поддерживается и строгая типизация с помощью деклараций типов и строгих типов.

🤔 **Динамическая типизация**
`<?php
$var = 10; // $var — это integer
$var = "Hello"; // Теперь $var — это string
?>`
🤔 **Преобразование типов**
`<?php
$number = 10;
$string = "20";

$result = $number + $string; // $string будет неявно преобразован в integer, результат будет 30
?>`
🤔 **Строгая типизация**
`<?php
declare(strict_types=1);

function add(int $a, int $b): int {
    return $a + $b;
}

echo add(5, 10); // Работает нормально
echo add(5, "10"); // Ошибка: аргумент должен быть int
?>`
🤔 **Зачем она нужна?**

1️⃣ **Повышение надежности кода**: Помогает обнаруживать и предотвращать ошибки типов на ранних стадиях разработки.

2️⃣ **Улучшение читаемости кода**: Типы данных делают код более понятным для разработчиков, позволяя легко понять, какие значения ожидаются и возвращаются функциями.

3️⃣ **Оптимизация производительности**: Статическая типизация позволяет компиляторам выполнять оптимизации, улучшая производительность программы.

4️⃣ **Улучшение безопасности кода**: Строгая типизация предотвращает неявные преобразования типов, которые могут привести к непредсказуемым результатам.

Типизация — это концепция, определяющая, как и когда типы данных присваиваются переменным в программе. Существует статическая и динамическая типизация, а также сильная и слабая типизация. Помогает повысить надежность, читаемость, производительность и безопасность кода.

🔥 [ТОП ВОПРОСОВ С СОБЕСОВ](https://easyoffer.ru/rating/frontend_developer)

🔒 [База собесов](https://t.me/access_interview_bot) | 🔒 [База тестовых](https://t.me/eo_test_task_bot)
<!-- basicblock-end -->




#P_PHP
#PHP

#telegram 

# 🤔 **Как вы реализуете паттерн проектирования 'Стратегия' ?**
<!-- basicblock-start oid="ObsPssUs5noKfBmGTXOvbNgE"  deck='P_PHP' -->
🤔 **Как вы реализуете паттерн проектирования 'Стратегия' ?**::


Паттерн проектирования <u>"Стратегия" (Strategy)</u> позволяет определить семейство алгоритмов, инкапсулировать каждый из них и сделать их взаимозаменяемыми. Этот паттерн позволяет клиенту выбрать алгоритм поведения во время выполнения программы, не изменяя при этом саму программу.

🚩**Реализация паттерна "Стратегия"**

Рассмотрим пример, в котором мы будем использовать паттерн "Стратегия" для выполнения различных способов расчета стоимости доставки.

Сначала создадим интерфейс, который будет определять метод для расчета стоимости доставки.
```
<?php
interface ShippingStrategy {
    public function calculateCost(int $weight, int $distance): float;
}
?>
```

Далее создадим несколько классов, реализующих этот интерфейс. Каждый класс будет представлять конкретную стратегию расчета стоимости доставки.
```
<?php
class RegularShipping implements ShippingStrategy {
    public function calculateCost(int $weight, int $distance): float {
        return $weight * 0.5 + $distance * 1.2;
    }
}

class ExpressShipping implements ShippingStrategy {
    public function calculateCost(int $weight, int $distance): float {
        return $weight * 0.7 + $distance * 1.5;
    }
}

class InternationalShipping implements ShippingStrategy {
    public function calculateCost(int $weight, int $distance): float {
        return $weight * 1.0 + $distance * 2.5;
    }
}
?>
```

Создадим класс `ShippingCostCalculator`, который будет использовать одну из стратегий для расчета стоимости доставки.
```
<?php
class ShippingCostCalculator {
    private ShippingStrategy $strategy;

    public function __construct(ShippingStrategy $strategy) {
        $this->strategy = $strategy;
    }

    public function setStrategy(ShippingStrategy $strategy) {
        $this->strategy = $strategy;
    }

    public function calculate(int $weight, int $distance): float {
        return $this->strategy->calculateCost($weight, $distance);
    }
}
?>
```

Теперь можем использовать наш класс `ShippingCostCalculator` с различными стратегиями.
```
<?php
$calculator = new ShippingCostCalculator(new RegularShipping());
echo "Regular Shipping: " . $calculator->calculate(10, 100) . "\n";

$calculator->setStrategy(new ExpressShipping());
echo "Express Shipping: " . $calculator->calculate(10, 100) . "\n";

$calculator->setStrategy(new InternationalShipping());
echo "International Shipping: " . $calculator->calculate(10, 100) . "\n";
?>
```

🚩**Зачем это нужно?**

🟠**Гибкость**: Легко менять алгоритмы во время выполнения программы без изменения кода клиентов.
🟠**Расширяемость**: Легко добавлять новые стратегии, не изменяя существующий код.
🟠**Поддерживаемость**: Логика выбора алгоритма вынесена в отдельные классы, что упрощает поддержку и тестирование.
****
🚩**Как это используется?**

🟠**ПО с изменяемыми алгоритмами**: Игры (различные стратегии поведения NPC), приложения с разными методами сортировки, приложения для работы с графикой (разные алгоритмы отрисовки).
🟠**Бизнес-логика**: Различные алгоритмы ценообразования, разные стратегии расчета налогов, различные методы доставки.

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->




#P_PHP
#PHP

#telegram 

# 🤔 **<u>Когда имеет смысл использовать event sourcing?</u>** 
<!-- basicblock-start oid="Obsc49lKC7XghV4DzFpJ54HJ"  deck='P_PHP' -->
🤔 **<u>Когда имеет смысл использовать event sourcing?</u>** ::


Это паттерн проектирования, при котором все изменения состояния приложения сохраняются как последовательность событий. Вместо хранения только текущего состояния системы, каждая операция записывается как отдельное событие. Это позволяет восстанавливать состояние системы на любой момент времени, просто воспроизведя все события до этого момента.

🚩**Когда имеет смысл?**

🟠**Необходимость аудита и отслеживания изменений**
Если требуется вести полный аудит всех изменений данных, включая информацию о том, кто и когда вносил изменения, Event Sourcing предоставляет подробную историю событий.

🟠**Восстановление состояния системы**
При необходимости восстановления состояния системы на определённый момент времени Event Sourcing позволяет воспроизвести последовательность событий, что полезно для восстановления после сбоев.

🟠**Поддержка сложных бизнес-правил**
Если система имеет сложные бизнес-правила, которые изменяются с течением времени, Event Sourcing может помочь управлять этими изменениями и обеспечивать их прозрачность.

🟠**Интеграция и согласованность данных**
В системах, где важно поддерживать согласованность данных между различными сервисами и компонентами, Event Sourcing обеспечивает последовательность и целостность данных.

🟠**Отказоустойчивость и масштабируемость**
Event Sourcing часто используется в микросервисной архитектуре для повышения отказоустойчивости и масштабируемости системы. Каждый сервис может хранить свою собственную историю событий, а централизованный лог событий может служить для синхронизации между сервисами.

🟠**Реализация CQRS (Command Query Responsibility Segregation)**
Event Sourcing часто используется вместе с CQRS, где команды (commands) и запросы (queries) обрабатываются раздельно. Команды изменяют состояние через события, а запросы получают данные из проекций событий.

🚩**Пример**

Событие
```
class Event {
    public $type;
    public $data;
    public $timestamp;

    public function __construct($type, $data) {
        $this->type = $type;
        $this->data = $data;
        $this->timestamp = time();
    }
}
```

Агрегат
```
class ShoppingCart {
    private $events = [];
    private $items = [];

    public function addItem($item) {
        $event = new Event('ItemAdded', ['item' => $item]);
        $this->apply($event);
        $this->events[] = $event;
    }

    private function apply(Event $event) {
        switch ($event->type) {
            case 'ItemAdded':
                $this->items[] = $event->data['item'];
                break;
        }
    }

    public function getItems() {
        return $this->items;
    }

    public function getEvents() {
        return $this->events;
    }
}
```

Использование
```
$cart = new ShoppingCart();
$cart->addItem('Apple');
$cart->addItem('Banana');

echo "Current items in cart: " . implode(', ', $cart->getItems()) . "\n";
```

Восстановление состояния из событий
```
$replayedCart = new ShoppingCart();
foreach ($cart->getEvents() as $event) {
    $replayedCart->apply($event);
}

echo "Replayed items in cart: " . implode(', ', $replayedCart->getItems()) . "\n";
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->




#P_PHP
#PHP

#telegram 

# **🤔**** Какая разница между self и this?**
<!-- basicblock-start oid="ObsiT82DpciRb40drXAxGjsj"  deck='P_PHP' -->
**🤔**** Какая разница между self и this?**::


self в PHP используется для обращения к текущему классу, включая статические методы и свойства, тогда как this ссылается на конкретный экземпляр класса. self подходит для работы с общими (статическими) членами класса, а this — для доступа к данным объекта. self не может использоваться для динамических данных объекта, в отличие от this.

Ставь 👍 если знал ответ, 🔥 если нет
Забирай [📚Базу Знаний](https://t.me/easy_php_tests/72)
<!-- basicblock-end -->




#P_PHP
#PHP

#telegram 

# 🤔 **<u>В чем разница между Coupling и Cohesion?</u>** 
<!-- basicblock-start oid="Obsbe9ah0ABmprpDh0rMvBvZ"  deck='P_PHP' -->
🤔 **<u>В чем разница между Coupling и Cohesion?</u>** ::


Coupling — это мера зависимости между модулями; чем ниже связанность, тем лучше, так как изменения в одном модуле минимально влияют на другие. Cohesion — это мера того, насколько функции внутри модуля связаны между собой и работают над одной задачей; чем выше сцепление, тем лучше, так как модуль выполняет одну четко определенную функцию. Идеальная система имеет низкую связанность и высокое сцепление.

🚩**Coupling (Связанность)**

Описывает степень зависимости между различными модулями или компонентами системы. Она отражает, насколько изменения в одном модуле могут повлиять на другие модули.

**🟠****Высокая связанность (Tight Coupling)**
Модули сильно зависят друг от друга. Изменение в одном модуле часто требует изменений в других модулях. Это делает систему менее гибкой и более трудной для модификации и тестирования.
🟠**Низкая связанность (Loose Coupling)**
Модули слабо зависят друг от друга. Изменения в одном модуле имеют минимальное влияние на другие модули. Это делает систему более гибкой, легко модифицируемой и тестируемой.
Высокая связанность
```
class Database {
    public function connect() {
        // Логика подключения к базе данных
    }
}

class User {
    private $db;

    public function __construct() {
        $this->db = new Database();
        $this->db->connect();
    }
}
```
****
**🟠****Низкая связанность**
Класс `User` меньше зависит от класса `Database`, так как зависимость передается через конструктор.
```
class Database {
    public function connect() {
        // Логика подключения к базе данных
    }
}

class User {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function connectToDatabase() {
        $this->db->connect();
    }
}
```

🚩**Cohesion (Сцепление)**

Описывает, насколько элементы внутри одного модуля связаны друг с другом. Оно отражает, насколько функционально связанные элементы объединены в одном модуле.

🟠**Высокое сцепление (High Cohesion)**
Модуль отвечает за одночетко определенное действие или группу связанных действий. Это делает модуль более понятным, поддерживаемым и переиспользуемым.
🟠**Низкое сцепление (Low Cohesion)**
Модуль отвечает за множество разнородных действий. Это делает модуль сложным для понимания и поддержки.
Низкое сцепление
```
class Utility {
    public function calculate() {
        // Логика расчета
    }

    public function formatString($string) {
        // Логика форматирования строки
    }

    public function connectToDatabase() {
        // Логика подключения к базе данных
    }
}
```
****
**🟠****Высокое сцепление**
Каждая класс отвечает за конкретную задачу, что делает их более понятными и легко поддерживаемыми.
```
class Calculator {
    public function calculate() {
        // Логика расчета
    }
}

class StringFormatter {
    public function formatString($string) {
        // Логика форматирования строки
    }
}

class DatabaseConnector {
    public function connectToDatabase() {
        // Логика подключения к базе данных
    }
}
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->




#P_PHP
#PHP

#telegram 

# 🤔 **<u>Что такое односвязный список?</u>** 
<!-- basicblock-start oid="ObsIjgKzzmLOlw0tAxzMj6Vm"  deck='P_PHP' -->
🤔 **<u>Что такое односвязный список?</u>** ::


Это структура данных, состоящая из узлов, где каждый узел содержит данные и указатель на следующий узел в списке. Односвязные списки используются для динамического хранения данных и предоставляют эффективные операции вставки и удаления элементов.

🟠**Узел (Node)**
Каждый узел содержит два элемента: данные и ссылку (указатель) на следующий узел.
🟠**Голова списка (Head)**
Ссылка на первый узел списка. Если список пуст, голова указывает на `null`.
   
🚩**Основные операции**

🟠**Добавление узла в начало списка**
Новый узел становится головой списка, а его указатель указывает на предыдущую голову.   
**🟠****Добавление узла в конец списка**
Пройти по списку до последнего узла и установить его указатель на новый узел.
🟠**Удаление узла**
Найти узел с заданным значением и перенаправить указатель предыдущего узла на следующий узел.
```
class Node {
    public $data;
    public $next;

    public function __construct($data) {
        $this->data = $data;
        $this->next = null;
    }
}

class LinkedList {
    private $head;

    public function __construct() {
        $this->head = null;
    }

    public function addFirst($data) {
        $newNode = new Node($data);
        $newNode->next = $this->head;
        $this->head = $newNode;
    }

    public function addLast($data) {
        $newNode = new Node($data);
        if ($this->head === null) {
            $this->head = $newNode;
        } else {
            $current = $this->head;
            while ($current->next !== null) {
                $current = $current->next;
            }
            $current->next = $newNode;
        }
    }

    public function remove($data) {
        if ($this->head === null) return;

        if ($this->head->data === $data) {
            $this->head = $this->head->next;
            return;
        }

        $current = $this->head;
        while ($current->next !== null && $current->next->data !== $data) {
            $current = $current->next;
        }

        if ($current->next !== null) {
            $current->next = $current->next->next;
        }
    }

    public function search($data) {
        $current = $this->head;
        while ($current !== null) {
            if ($current->data === $data) {
                return true;
            }
            $current = $current->next;
        }
        return false;
    }

    public function display() {
        $current = $this->head;
        while ($current !== null) {
            echo $current->data . " ";
            $current = $current->next;
        }
        echo "\n";
    }
}

// Пример использования
$list = new LinkedList();
$list.addFirst(10);
$list.addFirst(20);
$list.addLast(30);
$list.display(); // Вывод: 20 10 30
$list.remove(10);
$list.display(); // Вывод: 20 30
echo $list.search(20) ? "Found\n" : "Not Found\n"; // Вывод: Found
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->



