
# Начало карточки

<!-- basicblock-start oid="Obs83hkWdYqBX3E5FXL9zxZ3"  deck='0_Pd_php_docs_exception_10' -->
Пример #2 Наследование класса Exception::


```


<?php

/**
 * Определим класс исключения
 */
class MyException extends Exception
{
    // Переопределим исключение так, что параметр message станет обязательным
    public function __construct($message, $code = 0, Throwable $previous = null) {
        // Какой-то код

        // Убедимся, что родительский класс правильно присвоил значения
        parent::__construct($message, $code, $previous);
    }

    // Переопределим строковое представление объекта
    public function __toString() {
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }

    public function customFunction() {
        echo "Пользовательская функция для этого типа исключения\n";
    }
}


/**
 * Создадим класс для тестирования исключения
 */
class TestException
{
    public $var;

    const THROW_NONE    = 0;
    const THROW_CUSTOM  = 1;
    const THROW_DEFAULT = 2;

    function __construct($avalue = self::THROW_NONE) {

        switch ($avalue) {
            case self::THROW_CUSTOM:
                // Выбрасываем собственное исключение
                throw new MyException('1 — неправильный параметр', 5);
                break;

            case self::THROW_DEFAULT:
                // Выбрасываем встроеное исключение
                throw new Exception('2 — недопустимый параметр', 6);
                break;

            default:
                // Без исключения, PHP создаст объект
                $this->var = $avalue;
                break;
        }
    }
}

// Пример 1
try {
    $o = new TestException(TestException::THROW_CUSTOM);
} catch (MyException $e) {      // Будет перехвачено
    echo "Поймано собственное переопределённое исключение\n", $e;
    $e->customFunction();
} catch (Exception $e) {        // Будет пропущено
    echo "Поймано встроенное исключение\n", $e;
}

// Продолжить выполнение
var_dump($o); // Null
echo "\n\n";


// Пример 2
try {
    $o = new TestException(TestException::THROW_DEFAULT);
} catch (MyException $e) {      // Тип исключения не совпадёт
    echo "Поймано переопределённое исключение\n", $e;
    $e->customFunction();
} catch (Exception $e) {        // Будет перехвачено
    echo "Перехвачено встроенное исключение\n", $e;
}

// Продолжить выполнение
var_dump($o); // Null
echo "\n\n";


// Пример 3
try {
    $o = new TestException(TestException::THROW_CUSTOM);
} catch (Exception $e) {        // Будет перехвачено
    echo "Поймано встроенное исключение\n", $e;
}

// Продолжить выполнение
var_dump($o); // Null
echo "\n\n";


// Пример 4
try {
    $o = new TestException();
} catch (Exception $e) {        // Будет пропущено, т.к. исключение не выбрасывается
    echo "Поймано встроенное исключение\n", $e;
}

// Продолжить выполнение
var_dump($o); // TestException
echo "\n\n";

?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #2 Наследование класса Exception

```


<?php

/**
 * Определим класс исключения
 */
class MyException extends Exception
{
    // Переопределим исключение так, что параметр message станет обязательным
    public function __construct($message, $code = 0, Throwable $previous = null) {
        // Какой-то код

        // Убедимся, что родительский класс правильно присвоил значения
        parent::__construct($message, $code, $previous);
    }

    // Переопределим строковое представление объекта
    public function __toString() {
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }

    public function customFunction() {
        echo "Пользовательская функция для этого типа исключения\n";
    }
}


/**
 * Создадим класс для тестирования исключения
 */
class TestException
{
    public $var;

    const THROW_NONE    = 0;
    const THROW_CUSTOM  = 1;
    const THROW_DEFAULT = 2;

    function __construct($avalue = self::THROW_NONE) {

        switch ($avalue) {
            case self::THROW_CUSTOM:
                // Выбрасываем собственное исключение
                throw new MyException('1 — неправильный параметр', 5);
                break;

            case self::THROW_DEFAULT:
                // Выбрасываем встроеное исключение
                throw new Exception('2 — недопустимый параметр', 6);
                break;

            default:
                // Без исключения, PHP создаст объект
                $this->var = $avalue;
                break;
        }
    }
}

// Пример 1
try {
    $o = new TestException(TestException::THROW_CUSTOM);
} catch (MyException $e) {      // Будет перехвачено
    echo "Поймано собственное переопределённое исключение\n", $e;
    $e->customFunction();
} catch (Exception $e) {        // Будет пропущено
    echo "Поймано встроенное исключение\n", $e;
}

// Продолжить выполнение
var_dump($o); // Null
echo "\n\n";


// Пример 2
try {
    $o = new TestException(TestException::THROW_DEFAULT);
} catch (MyException $e) {      // Тип исключения не совпадёт
    echo "Поймано переопределённое исключение\n", $e;
    $e->customFunction();
} catch (Exception $e) {        // Будет перехвачено
    echo "Перехвачено встроенное исключение\n", $e;
}

// Продолжить выполнение
var_dump($o); // Null
echo "\n\n";


// Пример 3
try {
    $o = new TestException(TestException::THROW_CUSTOM);
} catch (Exception $e) {        // Будет перехвачено
    echo "Поймано встроенное исключение\n", $e;
}

// Продолжить выполнение
var_dump($o); // Null
echo "\n\n";


// Пример 4
try {
    $o = new TestException();
} catch (Exception $e) {        // Будет пропущено, т.к. исключение не выбрасывается
    echo "Поймано встроенное исключение\n", $e;
}

// Продолжить выполнение
var_dump($o); // TestException
echo "\n\n";

?>
```



