
#P_PHP
#PHP

#telegram 

# **🤔**** Что такое pod?**
<!-- basicblock-start oid="Obsg2D7HAtCSiQtT7l8POqxm"  deck='P_PHP' -->
**🤔**** Что такое pod?**::


Pod — это основная единица развертывания в Kubernetes, которая представляет собой один или несколько контейнеров, работающих вместе и разделяющих общие ресурсы, такие как сеть и хранилище. Каждый pod получает уникальный IP-адрес в кластере и может включать контейнеры, которые взаимодействуют друг с другом. Pod является недолговечным и может быть перезапущен или пересоздан при сбое, поэтому Kubernetes автоматически управляет их состоянием. Pod помогает упрощать управление контейнерами в кластере.

Ставь 👍 если знал ответ, 🔥 если нет
Забирай [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_devops/400)
<!-- basicblock-end -->




#P_PHP
#PHP

#telegram 

# 🤔 **<u>Как вы реализуете паттерн проектирования 'Стратегия' в РНР?</u>** 
<!-- basicblock-start oid="ObsbarPgoDvyzeg51i2mTA9P"  deck='P_PHP' -->
🤔 **<u>Как вы реализуете паттерн проектирования 'Стратегия' в РНР?</u>** ::


Это поведенческий паттерн, который позволяет определять семейство схожих алгоритмов, инкапсулировать каждый из них и обеспечивать их взаимозаменяемость. Этот паттерн позволяет изменять алгоритм независимо от клиентов, которые его используют.

🚩**Как вы реализуете** 

1⃣**Создание интерфейса стратегии**
Определим интерфейс для всех алгоритмов (стратегий), который будет использоваться для их реализации.
2⃣**Реализация конкретных стратегий**
Создадим классы, реализующие данный интерфейс для различных алгоритмов.
3⃣**Контекст**
Создадим класс контекста, который будет использовать одну из стратегий.

🚩**Примеры** 

**🟠****Интерфейс стратегии**
Этот интерфейс определяет метод `pay`, который будут реализовывать конкретные стратегии оплаты.
```
interface PaymentStrategy {
    public function pay($amount);
}
```

🟠**Конкретные стратегии**
Эти классы реализуют интерфейс `PaymentStrategy` и содержат собственные алгоритмы оплаты.
```
class CreditCardPayment implements PaymentStrategy {
    private $cardNumber;
    private $cvv;
    private $expiryDate;

    public function __construct($cardNumber, $cvv, $expiryDate) {
        $this->cardNumber = $cardNumber;
        $this->cvv = $cvv;
        $this->expiryDate = $expiryDate;
    }

    public function pay($amount) {
        echo "Paid $amount using Credit Card.\n";
    }
}

class PayPalPayment implements PaymentStrategy {
    private $email;
    private $password;

    public function __construct($email, $password) {
        $this->email = $email;
        $this->password = $password;
    }

    public function pay($amount) {
        echo "Paid $amount using PayPal.\n";
    }
}

class BitcoinPayment implements PaymentStrategy {
    private $walletAddress;

    public function __construct($walletAddress) {
        $this->walletAddress = $walletAddress;
    }

    public function pay($amount) {
        echo "Paid $amount using Bitcoin.\n";
    }
}
```

🟠**Контекст**
Класс `Order` является контекстом, который использует стратегию оплаты для выполнения платежа.
```
class Order {
    private $paymentStrategy;

    public function __construct(PaymentStrategy $paymentStrategy) {
        $this->paymentStrategy = $paymentStrategy;
    }

    public function setPaymentStrategy(PaymentStrategy $paymentStrategy) {
        $this->paymentStrategy = $paymentStrategy;
    }

    public function checkout($amount) {
        $this->paymentStrategy->pay($amount);
    }
}
```

Использование паттерна "Стратегия"
```
// Создаем стратегии оплаты
$creditCardPayment = new CreditCardPayment("1234567890123456", "123", "12/23");
$paypalPayment = new PayPalPayment("user@example.com", "securepassword");
$bitcoinPayment = new BitcoinPayment("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa");

// Создаем заказ и используем стратегию оплаты кредитной картой
$order = new Order($creditCardPayment);
$order->checkout(100); // Выведет: "Paid 100 using Credit Card."

// Меняем стратегию оплаты на PayPal
$order->setPaymentStrategy($paypalPayment);
$order->checkout(200); // Выведет: "Paid 200 using PayPal."

// Меняем стратегию оплаты на Bitcoin
$order->setPaymentStrategy($bitcoinPayment);
$order->checkout(300); // Выведет: "Paid 300 using Bitcoin."
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->



