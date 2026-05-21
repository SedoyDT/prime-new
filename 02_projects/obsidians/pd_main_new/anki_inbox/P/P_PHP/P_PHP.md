
#P_PHP
#PHP

#telegram 

# Как работает Docker? 
<!-- basicblock-start oid="Obsl0Koio7fZBvpevPnrSa89"  deck='P_PHP' -->
Как работает Docker? ::


🔹Docker Client — ты пишешь команды
🔹Docker Daemon (Darmon) — оркеструет всё внутри
🔹Docker Host — управляет образами и контейнерами
🔹Docker Registry — удалённое хранилище образов (Docker Hub, GitHub Container Registry и т.д.)

**Потоки взаимодействия:**

> docker build — создаёт образ → сохраняет его локально
> docker pull — тянет образ из registry
> docker run — запускает контейнер из образа

Всё работает по модели: клиент → демон → хост → registry

👉 @BackendPortal
<!-- basicblock-end -->




#P_PHP
#PHP

#telegram 

# 🤔 **Что известно про фабрики?**  
<!-- basicblock-start oid="Obs7ubBtmcfXb9aYPWmjtGug"  deck='P_PHP' -->
🤔 **Что известно про фабрики?**  ::


Это порождающий паттерн, создающий объекты без явного указания их класса.  
1. **Simple Factory:** один метод создаёт разные объекты.  
2. **Factory Method:** делегирует создание объектов подклассам.  
3. **Abstract Factory:** создаёт семейства связанных объектов.

Ставь 👍 если знал ответ, 🔥 если нет
Забирай [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->




#P_PHP
#PHP

#telegram 

# 🤔 **Что известно про фабрики?**  
<!-- basicblock-start oid="ObsOyrhEDN62yRVXaC8jMZw5"  deck='P_PHP' -->
🤔 **Что известно про фабрики?**  ::


Это порождающий паттерн, создающий объекты без явного указания их класса.  
1. **Simple Factory:** один метод создаёт разные объекты.  
2. **Factory Method:** делегирует создание объектов подклассам.  
3. **Abstract Factory:** создаёт семейства связанных объектов.

Ставь 👍 если знал ответ, 🔥 если нет
Забирай [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->




#P_PHP
#PHP

#telegram 

# **<u>🤔</u>****<u> Для чего нужна рефлексия?</u>**
<!-- basicblock-start oid="ObsQDjed7hBA5iDLbvPEwDLO"  deck='P_PHP' -->
**<u>🤔</u>****<u> Для чего нужна рефлексия?</u>**::


Рефлексия (Reflection) – это механизм анализа классов, методов, свойств и других структур во время выполнения. Она позволяет получать информацию о коде и даже изменять его динамически.  

🚩**Когда полезна рефлексия?**  

🟠**Фреймворки и DI-контейнеры**  
- Используется для автоматического внедрения зависимостей (Dependency Injection, DI).  
- Например, Laravel использует рефлексию в `Container` для автоматического создания объектов.  
```
class Database {
    public function connect() {
        return "Подключение к базе данных";
    }
}

class UserService {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function getUser() {
        return "Пользователь найден";
    }
}

function resolve($class) {
    $reflector = new ReflectionClass($class);
    $constructor = $reflector->getConstructor();
    
    if (!$constructor) {
        return new $class;
    }

    $params = $constructor->getParameters();
    $dependencies = [];

    foreach ($params as $param) {
        $type = $param->getType();
        if ($type) {
            $dependencies[] = resolve($type->getName());
        }
    }

    return $reflector->newInstanceArgs($dependencies);
}

$service = resolve(UserService::class);
echo $service->getUser(); // "Пользователь найден"
```

🟠**Декораторы, аннотации и атрибуты**  
- В PHP 8 появились атрибуты (аннотации), и рефлексия помогает их читать.  
- Используется в Symfony, Doctrine для работы с ORM.    
```
#[Attribute]
class Route {
    public function __construct(public string $path) {}
}

class Controller {
    #[Route('/home')]
    public function home() {
        return "Домашняя страница";
    }
}

$reflection = new ReflectionMethod(Controller::class, 'home');
$attributes = $reflection->getAttributes(Route::class);
$route = $attributes[0]->newInstance();

echo $route->path; // "/home"
```

🟠**Автоматическая генерация документации**  
- Реально использовать для автоматического создания Swagger/OpenAPI.  
- Можно извлекать PHPDoc-комментарии и на их основе генерировать документацию.  
```
class Example {
    /**
     * Возвращает приветствие
     * @return string
     */
    public function sayHello() {
        return "Привет!";
    }
}

$reflection = new ReflectionMethod(Example::class, 'sayHello');
echo $reflection->getDocComment();
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->




#P_PHP
#PHP

#telegram 

# **<u>🤔</u>****<u> В чем преимущество фасада?</u>**
<!-- basicblock-start oid="ObsOGJdIFRoPP9jLZr8PFWkq"  deck='P_PHP' -->
**<u>🤔</u>****<u> В чем преимущество фасада?</u>**::


Фасад (Facade) в PHP — это паттерн проектирования, который упрощает доступ к сложной системе классов, предоставляя единый интерфейс.  

🚩**Плюсы**  

➕**Упрощает код**  
Фасад скрывает сложные детали реализации и предоставляет удобный интерфейс.  
```
$logger = new Logger();
$db = new DatabaseConnection();
$mailer = new Mailer();

$user = new User($db, $logger, $mailer);
$user->register("example@example.com");
```

С фасадом (всё инкапсулировано в один класс)  
```
$userFacade = new UserFacade();
$userFacade->register("example@example.com");
```

➕**Ослабляет зависимость кода от реализации**  
Вы можете изменять внутреннюю структуру классов без влияния на клиентский код.  

➕**Улучшает поддержку и масштабируемость**  
- Если нужно добавить новую функциональность, можно просто изменить фасад, не переписывая весь код.  
- Удобно при развитии проекта и подключении новых сервисов.  

🚩**Пример фасада в PHP**  

```
class PaymentGateway {
    public function processPayment($amount) {
        echo "Оплата на сумму $amount выполнена.\n";
    }
}

class NotificationService {
    public function sendNotification($message) {
        echo "Отправлено уведомление: $message\n";
    }
}

class OrderFacade {
    private $payment;
    private $notification;

    public function __construct() {
        $this->payment = new PaymentGateway();
        $this->notification = new NotificationService();
    }

    public function placeOrder($amount) {
        $this->payment->processPayment($amount);
        $this->notification->sendNotification("Заказ оплачен на сумму $amount.");
    }
}

// Использование
$order = new OrderFacade();
$order->placeOrder(1000);
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->



