
# Начало карточки

<!-- basicblock-start oid="ObsS4QcXpbQbjkJrGIkHVnFZ"  deck='0_Pd_php_docs_exception_10' -->
Что можно сказать про наследование исключений?::


 Пользовательский класс исключения определяют путём расширения встроенного класса Exception. Ниже показаны методы и свойства класса Exception, которые доступны дочерним классам. 

Пример #1 Встроенный класс Exception

```


<?php

class Exception implements Throwable
{
    protected $message = 'Unknown exception';   // Сообщение исключения
    private   $string;                          // Кеш метода __toString
    protected $code = 0;                        // Пользовательский код исключения
    protected $file;                            // Файл, в котором код выбросил исключение
    protected $line;                            // Строка, в которой код выбросил исключение
    private   $trace;                           // Трассировка вызовов методов и функций
    private   $previous;                        // Предыдущее исключение, если исключение вложенное

    public function __construct($message = '', $code = 0, Throwable $previous = null);

    final private function __clone();           // Запрещает клонирования исключения

    final public  function getMessage();        // Сообщение исключения
    final public  function getCode();           // Код исключения
    final public  function getFile();           // Файл, в котором код выбросил исключение
    final public  function getLine();           // Строка, на которой код выбросил исключение
    final public  function getTrace();          // Массив функции backtrace()
    final public  function getPrevious();       // Предыдущее исключение
    final public  function getTraceAsString();  // Отформатированная строка трассировки

    // Переопределяемый
    public function __toString();               // Отформатированная строка для отображения
}

?>
```
В конструкторе класса-наследника нужно также вызвать конструктор родительского класса — [parent::__construct()](https://www.php.net/manual/ru/language.oop5.paamayim-nekudotayim.php), когда класс расширяет класс Exception и переопределяет [конструктор](https://www.php.net/manual/ru/language.oop5.decon.php), чтобы гарантировать, что родительский класс правильно присвоил значения доступным данным. Метод [__toString()](https://www.php.net/manual/ru/language.oop5.magic.php) допустимо переопределять, чтобы настроить пользовательский вывод, когда с объектом исключения работают как со строкой.

> **Замечание**:
> 
> Исключения нельзя клонировать. Попытка [клонировать](https://www.php.net/manual/ru/language.oop5.cloning.php) исключение приведёт к фатальной ошибке **`[E_ERROR](https://www.php.net/manual/ru/errorfunc.constants.php#constant.e-error)`**.
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что можно сказать про наследование исключений?

 Пользовательский класс исключения определяют путём расширения встроенного класса Exception. Ниже показаны методы и свойства класса Exception, которые доступны дочерним классам. 

Пример #1 Встроенный класс Exception

```


<?php

class Exception implements Throwable
{
    protected $message = 'Unknown exception';   // Сообщение исключения
    private   $string;                          // Кеш метода __toString
    protected $code = 0;                        // Пользовательский код исключения
    protected $file;                            // Файл, в котором код выбросил исключение
    protected $line;                            // Строка, в которой код выбросил исключение
    private   $trace;                           // Трассировка вызовов методов и функций
    private   $previous;                        // Предыдущее исключение, если исключение вложенное

    public function __construct($message = '', $code = 0, Throwable $previous = null);

    final private function __clone();           // Запрещает клонирования исключения

    final public  function getMessage();        // Сообщение исключения
    final public  function getCode();           // Код исключения
    final public  function getFile();           // Файл, в котором код выбросил исключение
    final public  function getLine();           // Строка, на которой код выбросил исключение
    final public  function getTrace();          // Массив функции backtrace()
    final public  function getPrevious();       // Предыдущее исключение
    final public  function getTraceAsString();  // Отформатированная строка трассировки

    // Переопределяемый
    public function __toString();               // Отформатированная строка для отображения
}

?>
```



