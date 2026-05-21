
# Начало карточки

<!-- basicblock-start oid="Obsq8PS7mWdGsU2frrilGm5Z"  deck='0_Pd_php_docs_namespaces_8' -->
Пространства имён и динамические особенности языка ¶::


 На реализацию пространств имён в PHP повлияли и динамические свойства языка. Поэтому, чтобы преобразовать код наподобие следующего примера в код, который будет работать внутри пространства имён:… 

Пример #1 Динамически доступные элементы

example1.php:

```


<?php

class classname
{
    function __construct()
    {
        echo __METHOD__,"\n";
    }
}

function funcname()
{
    echo __FUNCTION__,"\n";
}

const constname = "global";

$a = 'classname';
$obj = new $a; // Выводит classname::__construct
$b = 'funcname';
$b(); // Выводит funcname
echo constant('constname'), "\n"; // Выводит global

?>

```


 …нужно указать абсолютное имя (имя класса с префиксом пространства имён). Обратите внимание, поскольку между полным и абсолютным именем внутри динамического имени класса, функции или константы нет разницы, начальный обратный слеш не нужен. 

```


<?php

namespace namespacename;

class classname
{
    function __construct()
    {
        echo __METHOD__,"\n";
    }
}

function funcname()
{
    echo __FUNCTION__,"\n";
}

const constname = "namespaced";

include 'example1.php';

$a = 'classname';
$obj = new $a; // Выводит classname::__construct
$b = 'funcname';
$b(); // Выводит funcname
echo constant('constname'), "\n"; // Выводит global

/* Обратите внимание, что в двойных кавычках символ обратного слеша нужно заэкранировать. Например, "\\namespacename\\classname" */
$a = '\namespacename\classname';
$obj = new $a; // Выводит namespacename\classname::__construct
$a = 'namespacename\classname';
$obj = new $a; // Тоже выводит namespacename\classname::__construct
$b = 'namespacename\funcname';
$b(); // Выводит namespacename\funcname
$b = '\namespacename\funcname';
$b(); // Тоже выводит namespacename\funcname
echo constant('\namespacename\constname'), "\n"; // Выводит namespaced
echo constant('namespacename\constname'), "\n"; // Тоже выводит namespaced

?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пространства имён и динамические особенности языка ¶

 На реализацию пространств имён в PHP повлияли и динамические свойства языка. Поэтому, чтобы преобразовать код наподобие следующего примера в код, который будет работать внутри пространства имён:… 

Пример #1 Динамически доступные элементы

example1.php:

```


<?php

class classname
{
    function __construct()
    {
        echo __METHOD__,"\n";
    }
}

function funcname()
{
    echo __FUNCTION__,"\n";
}

const constname = "global";

$a = 'classname';
$obj = new $a; // Выводит classname::__construct
$b = 'funcname';
$b(); // Выводит funcname
echo constant('constname'), "\n"; // Выводит global

?>

```


 …нужно указать абсолютное имя (имя класса с префиксом пространства имён). Обратите внимание, поскольку между полным и абсолютным именем внутри динамического имени класса, функции или константы нет разницы, начальный обратный слеш не нужен. 

```


<?php

namespace namespacename;

class classname
{
    function __construct()
    {
        echo __METHOD__,"\n";
    }
}

function funcname()
{
    echo __FUNCTION__,"\n";
}

const constname = "namespaced";

include 'example1.php';

$a = 'classname';
$obj = new $a; // Выводит classname::__construct
$b = 'funcname';
$b(); // Выводит funcname
echo constant('constname'), "\n"; // Выводит global

/* Обратите внимание, что в двойных кавычках символ обратного слеша нужно заэкранировать. Например, "\\namespacename\\classname" */
$a = '\namespacename\classname';
$obj = new $a; // Выводит namespacename\classname::__construct
$a = 'namespacename\classname';
$obj = new $a; // Тоже выводит namespacename\classname::__construct
$b = 'namespacename\funcname';
$b(); // Выводит namespacename\funcname
$b = '\namespacename\funcname';
$b(); // Тоже выводит namespacename\funcname
echo constant('\namespacename\constname'), "\n"; // Выводит namespaced
echo constant('namespacename\constname'), "\n"; // Тоже выводит namespaced

?>
```



