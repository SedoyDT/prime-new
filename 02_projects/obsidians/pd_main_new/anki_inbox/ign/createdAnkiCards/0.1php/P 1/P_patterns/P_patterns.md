
#P_patterns
#patterns

#telegram 

# Как выглядит пример паттерна компоновщик(somposite)?
<!-- basicblock-start oid="ObsMs5Fb7ONMmhe8pi65ejHU"  deck='P_patterns' -->
Как выглядит пример паттерна компоновщик(somposite)?::


```
<?php

// Общий интерфейс для всех компонентов
interface FileSystemComponent {
    public function getName(): string;
    public function getSize(): int;
}


// Лист - простой компонент файл
class File implements FileSystemComponent
{
    private string $name;
    private int $size;

    public function __construct(string $name, int $size)
    {
        $this->name = $name;
        $this->size = $size;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getSize(): int
    {
        return $this->size;
    }
}

// Composite(Компоновщик) может содержать как листья, так и другие компоновщики (папки)
class Dir implements FileSystemComponent {
    private string $name;
    /** @var FileSystemComponent[] */
    private array $contents = [];

    public function __construct(string $name)
    {
        $this->name = $name;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function add(FileSystemComponent $component): void
    {
        $this->contents[] = $component;
    }

    public function remove(FileSystemComponent $component): void
    {
//        $index = array_search($component, $this->contents, true);
//        if ($index !== false) {
//            unset($this->contents[$index]);
//        }
//        // Перестроение массива после удаления элемента
//        $this->contents = array_values($this->contents);
        $this->contents = array_filter($this->contents, fn($item) => $item !== $component);

    }

    public function getSize(): int
    {
        $size = 0;
        foreach ($this->contents as $component) {
            $size += $component->getSize();
        }
        return $size;
    }

    public function listContents(): void
    {
        echo "Contents: of '{$this->name}'\n";
        foreach ($this->contents as $component) {
            echo "- " . $component->getName() . " (" . $component->getSize() . " KB)\n";
        }
    }

}

$file = new File("File1", 10);
$file2 = new File("File2", 30);
$file3 = new File("File3", 45);

$subDirectory = new Dir("SubDirectory1");
$subDirectory->add($file);
$subDirectory->add($file2);

$mainDirectory = new Dir("MainDirectory1");
$mainDirectory->add($subDirectory);
$mainDirectory->add($file3);

// Вывод директории
$mainDirectory->listContents();
echo "Total size of '{$mainDirectory->getName()}': " . $mainDirectory->getSize() . " KB\n";
```
<!-- basicblock-end -->




#P_patterns
#patterns

#telegram 

# Что представляет из себя композиция в php?
<!-- basicblock-start oid="ObspmjTCIMb9HcR2TgNfLFDF"  deck='P_patterns' -->
Что представляет из себя композиция в php?::


```
class Engine {
    public function start() {
        echo "Engine started\n";
    }
}

class Car {
    private Engine $engine;

    public function __construct(Engine $engine) {
        $this->engine = $engine;
    }

    public function startCar() {
        $this->engine->start();
        echo "Car is ready to go\n";
    }
}

// Пример использования
$engine = new Engine();
$car = new Car($engine);
$car->startCar();
```
<!-- basicblock-end -->




#P_patterns
#patterns

#telegram 

# #### Плюсы:
<!-- basicblock-start oid="Obs5nbD4btac2Om10lJ0D49V"  deck='P_patterns' -->
#### Плюсы:::

1. Упрощает добавление новых операций без изменения существующих классов.
2. Обеспечивает разделение ответственности (операции вынесены в отдельные классы).

#### Минусы:
1. Требует изменения всех классов элементов при добавлении нового типа элемента.
2. Может быть сложным для поддержки в больших структурах, где много типов объектов.

Этот паттерн полезен, если вам нужно часто добавлять новые операции к фиксированному набору объектов.
<!-- basicblock-end -->




#P_patterns
#patterns

#telegram 

# Расскажи про паттерн посетитель на примере php
<!-- basicblock-start oid="Obs4SKvRTB9bWArQS3thBmbl"  deck='P_patterns' -->
Расскажи про паттерн посетитель на примере php::



Паттерн **Посетитель** (Visitor) — это поведенческий паттерн проектирования, который позволяет добавлять новые операции для групп объектов, не изменяя сами эти объекты. Он используется, когда нужно выполнить какую-то операцию над элементами сложной структуры объектов, и для этого нет необходимости изменять сами классы этих объектов.

Давайте разберем этот паттерн на примере PHP.

---

### Пример: Посетитель для структуры файлов
Предположим, у нас есть файловая структура с папками и файлами, и мы хотим выполнить разные действия над файлами: например, подсчитать их размер или вывести список файлов.

#### 1. Интерфейс элемента
Элементы файловой структуры должны поддерживать возможность принять посетителя:
```
<?php

interface FileSystemItem {
    public function accept(Visitor $visitor): void;
}
```

#### 2. Конкретные элементы
Файлы и папки реализуют интерфейс `FileSystemItem`.

```
<?php

class File implements FileSystemItem {
    private string $name;
    private int $size;

    public function __construct(string $name, int $size) {
        $this->name = $name;
        $this->size = $size;
    }

    public function getName(): string {
        return $this->name;
    }

    public function getSize(): int {
        return $this->size;
    }

    public function accept(Visitor $visitor): void {
        $visitor->visitFile($this);
    }
}

class Directory implements FileSystemItem {
    private string $name;
    private array $items = []; // массив объектов FileSystemItem

    public function __construct(string $name) {
        $this->name = $name;
    }

    public function addItem(FileSystemItem $item): void {
        $this->items[] = $item;
    }

    public function getName(): string {
        return $this->name;
    }

    public function getItems(): array {
        return $this->items;
    }

    public function accept(Visitor $visitor): void {
        $visitor->visitDirectory($this);
    }
}
```

#### 3. Интерфейс посетителя
Посетитель должен уметь работать с разными типами элементов:
```
<?php

interface Visitor {
    public function visitFile(File $file): void;
    public function visitDirectory(Directory $directory): void;
}
```

#### 4. Конкретные посетители
Теперь реализуем посетителей, выполняющих различные операции над элементами файловой структуры.

**Подсчет общего размера:**
```
<?php

class SizeCalculator implements Visitor {
    private int $totalSize = 0;

    public function visitFile(File $file): void {
        $this->totalSize += $file->getSize();
    }

    public function visitDirectory(Directory $directory): void {
        foreach ($directory->getItems() as $item) {
            $item->accept($this);
        }
    }

    public function getTotalSize(): int {
        return $this->totalSize;
    }
}
```

**Вывод списка файлов:**
```
<?php

class FileLister implements Visitor {
    private array $fileList = [];

    public function visitFile(File $file): void {
        $this->fileList[] = $file->getName();
    }

    public function visitDirectory(Directory $directory): void {
        foreach ($directory->getItems() as $item) {
            $item->accept($this);
        }
    }

    public function getFileList(): array {
        return $this->fileList;
    }
}
```

#### 5. Использование
Теперь можно собрать файловую структуру и применить к ней посетителей:
```
<?php

// Создаем файловую структуру
$file1 = new File("file1.txt", 100);
$file2 = new File("file2.txt", 200);

$directory = new Directory("folder");
$directory->addItem($file1);
$directory->addItem($file2);

// Подсчитываем общий размер
$sizeCalculator = new SizeCalculator();
$directory->accept($sizeCalculator);
echo "Общий размер: " . $sizeCalculator->getTotalSize() . " байт\n";

// Выводим список файлов
$fileLister = new FileLister();
$directory->accept($fileLister);
echo "Список файлов: " . implode(", ", $fileLister->getFileList()) . "\n";
```

#### Результат выполнения:
```
Общий размер: 300 байт
Список файлов: file1.txt, file2.txt
```

---

### Плюсы и минусы
<!-- basicblock-end -->




#P_patterns
#patterns

#telegram 

# 🤔 <u>**Что такое паттерн event sourcing, когда его нужно использовать**?</u>
<!-- basicblock-start oid="ObsGbTkTHvLNhYLehflXOGNl"  deck='P_patterns' -->
🤔 <u>**Что такое паттерн event sourcing, когда его нужно использовать**?</u>::


Это паттерн проектирования, при котором все изменения состояния приложения сохраняются как последовательность неизменяемых событий. Вместо хранения текущего состояния объекта, приложение сохраняет каждое событие, которое изменило состояние объекта, и на основе этих событий может воссоздать текущее состояние.

🚩**Основные принципы Event Sourcing**

🟠**Сохранение событий**
Все изменения состояния приложения сохраняются как события. Эти события неизменяемы и добавляются в журнал событий (event log).

🟠**Воспроизведение состояния**
Текущее состояние объекта можно воспроизвести, проигрывая все события, относящиеся к этому объекту. Это позволяет легко воссоздавать состояние объекта на любой момент времени.

🟠**Неизменяемость событий**
События являются неизменяемыми. Если необходимо изменить состояние, создается новое событие.
   
🚩**Пример использования Event Sourcing**

Пример на Python. В этом примере все операции над счетом (`deposit`, `withdraw`) сохраняются как события (`Deposit`, `Withdrawal`), и текущее состояние (`balance`) можно воспроизвести, проигрывая эти события.
```
class Account:
    def __init__(self, id):
        self.id = id
        self.balance = 0
        self.events = []

    def apply(self, event):
        if isinstance(event, Deposit):
            self.balance += event.amount
        elif isinstance(event, Withdrawal):
            self.balance -= event.amount
        self.events.append(event)

    def deposit(self, amount):
        self.apply(Deposit(self.id, amount))

    def withdraw(self, amount):
        self.apply(Withdrawal(self.id, amount))

class Deposit:
    def __init__(self, account_id, amount):
        self.account_id = account_id
        self.amount = amount

class Withdrawal:
    def __init__(self, account_id, amount):
        self.account_id = account_id
        self.amount = amount

# Использование
account = Account(1)
account.deposit(100)
account.withdraw(50)

print(account.balance)  # Выведет: 50
```

🚩**Когда использовать** 

🟠**Аудит и история изменений**
Event Sourcing полезен, когда необходимо сохранять полную историю изменений состояния для аудита или анализа. Пример: финансовые приложения, где важно сохранять все транзакции.

🟠**Восстановление состояния**
Когда необходимо восстановить состояние объекта на любой момент времени в прошлом. Пример: системы резервного копирования и восстановления данных.

🟠**Асинхронные процессы**
Для приложений с высокой степенью асинхронности, где события могут обрабатываться в различных сервисах. Пример: системы микросервисов, где каждое событие может инициировать действие в другом сервисе.

**🟠****Event-Driven Architecture (Событийно-ориентированная архитектура)**
В архитектурах, где события являются основным способом взаимодействия между компонентами системы. Пример: системы с использованием очередей сообщений или потоков событий.

🚩**Плюсы**

➕**Историчность**
Полная история всех изменений.
➕**Восстановление состояния**
Возможность восстановления состояния на любой момент времени.
➕**Производительность**
Возможность оптимизации чтения данных с помощью проекций.
➕**Гибкость**
Возможность добавления новых бизнес-логик без изменения существующего состояния.

🚩**Минусы**

➖**Сложность**
Усложняет реализацию и требует дополнительного планирования.
➖**Объем данных**
Увеличение объема хранимых данных за счет хранения всех событий.
➖**Консистентность**
Необходимость управления консистентностью данных при распределенной обработке событий.

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->




#P_patterns
#patterns

#telegram 

# **🤔**** Какую проблему решают фабрика и фабричный метод?**
<!-- basicblock-start oid="ObsuAhOFwB16uosoOxNcZz7x"  deck='P_patterns' -->
**🤔**** Какую проблему решают фабрика и фабричный метод?**::


Фабрика и фабричный метод решают проблему создания объектов в программе, отделяя процесс их создания от бизнес-логики. Это помогает сделать код более гибким, давая возможность изменять способ создания объектов без изменения основного кода. Эти паттерны используются для улучшения тестируемости, расширяемости и поддерживаемости программы.

Ставь 👍 если знал ответ, 🔥 если нет
Забирай [📚Базу Знаний](https://t.me/easy_php_tests/72)
<!-- basicblock-end -->




#P_patterns
#patterns

#telegram 

# **🤔**** Какую проблему решают фабрика и фабричный метод?**
<!-- basicblock-start oid="Obs5mjC0hjO6s58BgIqVw4Wv"  deck='P_patterns' -->
**🤔**** Какую проблему решают фабрика и фабричный метод?**::


Фабрика и фабричный метод решают проблему создания объектов в программе, отделяя процесс их создания от бизнес-логики. Это помогает сделать код более гибким, давая возможность изменять способ создания объектов без изменения основного кода. Эти паттерны используются для улучшения тестируемости, расширяемости и поддерживаемости программы.

Ставь 👍 если знал ответ, 🔥 если нет
Забирай [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->




#P_patterns
#patterns

#telegram 

# 🤔 **Какой принцип из SOLID позволяет соблюдать добавочные преобразования в работе?**
<!-- basicblock-start oid="ObsieQvyNt8L4EhvDNg9sQFV"  deck='P_patterns' -->
🤔 **Какой принцип из SOLID позволяет соблюдать добавочные преобразования в работе?**::


Принцип открытости/закрытости (Open/Closed Principle) из SOLID утверждает, что программные сущности должны быть открыты для расширения, но закрыты для модификации. Это позволяет добавлять новые функциональности без изменения существующего кода.?

Ставь 👍 если знал ответ, 🔥 если нет
Забирай [📚Базу Знаний](https://t.me/easy_php_tests/72)
<!-- basicblock-end -->



