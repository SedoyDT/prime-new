
# Начало карточки

<!-- basicblock-start oid="ObsVczCuLC8EsrC4WmvZONSD"  deck='0_Pd_php_docs_namespaces_8' -->
В дополнение, импорт распространяется только на неполные и полные имена. На абсолютные имена операция импорта не влияет. ::


Пример #4 Импортирование и абсолютные имена

```


<?php

use My\Full\Classname as Another, My\Full\NSname;

$obj = new Another; // Создаёт объект класса My\Full\Classname
$obj = new \Another; // Создаёт объект класса Another
$obj = new Another\thing; // Создаёт объект класса My\Full\Classname\thing
$obj = new \Another\thing; // Создаёт объект класса Another\thing

?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

В дополнение, импорт распространяется только на неполные и полные имена. На абсолютные имена операция импорта не влияет. 

Пример #4 Импортирование и абсолютные имена

```


<?php

use My\Full\Classname as Another, My\Full\NSname;

$obj = new Another; // Создаёт объект класса My\Full\Classname
$obj = new \Another; // Создаёт объект класса Another
$obj = new Another\thing; // Создаёт объект класса My\Full\Classname\thing
$obj = new \Another\thing; // Создаёт объект класса Another\thing

?>
```




# Начало карточки

<!-- basicblock-start oid="ObsxTQanISw53JbGz8eEBkqD"  deck='0_Pd_php_docs_namespaces_8' -->
Пространства имён: псевдонимирование и импорт ¶::


 Способность ссылаться на внешнее абсолютное имя по псевдониму или импортировать внешние абсолютные имена — это важное свойство пространств имён. Это похоже на способность файловых систем на основе Unix создавать символические ссылки на файл или директорию.

PHP умеет создавать псевдонимы или импортировать константы, функции, классы, интерфейсы, трейты, перечисления и пространства имён.

Псевдоним имени создают через ключевое слово use. Вот пример, который показывает 5 типов импорта: 

Пример #1 Импорт или псевдонимирование через ключевое слово use

```


<?php

namespace foo;

use My\Full\Classname as Another;

// Это то же, что и My\Full\NSname as NSname
use My\Full\NSname;

// Импортирование глобального класса
use ArrayObject;

// Импортирование функции
use function My\Full\functionName;

// Создание псевдонима функции
use function My\Full\functionName as func;

// Импортирование константы
use const My\Full\CONSTANT;

$obj = new namespace\Another; // Создаёт экземпляр класса foo\Another
$obj = new Another; // Создаёт объект класса My\Full\Classname
NSname\subns\func(); // Вызывает функцию My\Full\NSname\subns\func

$a = new ArrayObject(array(1)); // Создаёт объект класса ArrayObject
// без выражения use ArrayObject был бы создан объект класса foo\ArrayObject

func(); // вызывает функцию My\Full\functionName
echo CONSTANT; // выводит содержимое константы My\Full\CONSTANT

?>
```


Обратите внимание, что именам внутри пространства имён (абсолютным именам пространств имён, которые содержат разделитель пространств имён, например Foo\Bar, в отличие от глобальных имён, которые его не содержат, например FooBar) начальный обратный слеш (\) не нужен и не рекомендован, поскольку импортируемые имена должны быть абсолютными и не обрабатываются относительно текущего пространства имён.

PHP дополнительно поддерживает удобное сокращение для задания нескольких операторов use в одной и той же строке 

Пример #1 Импорт или псевдонимирование через ключевое слово use
```


<?php

namespace foo;

use My\Full\Classname as Another;

// Это то же, что и My\Full\NSname as NSname
use My\Full\NSname;

// Импортирование глобального класса
use ArrayObject;

// Импортирование функции
use function My\Full\functionName;

// Создание псевдонима функции
use function My\Full\functionName as func;

// Импортирование константы
use const My\Full\CONSTANT;

$obj = new namespace\Another; // Создаёт экземпляр класса foo\Another
$obj = new Another; // Создаёт объект класса My\Full\Classname
NSname\subns\func(); // Вызывает функцию My\Full\NSname\subns\func

$a = new ArrayObject(array(1)); // Создаёт объект класса ArrayObject
// без выражения use ArrayObject был бы создан объект класса foo\ArrayObject

func(); // вызывает функцию My\Full\functionName
echo CONSTANT; // выводит содержимое константы My\Full\CONSTANT

?>
```


Обратите внимание, что именам внутри пространства имён (абсолютным именам пространств имён, которые содержат разделитель пространств имён, например Foo\Bar, в отличие от глобальных имён, которые его не содержат, например FooBar) начальный обратный слеш (\) не нужен и не рекомендован, поскольку импортируемые имена должны быть абсолютными и не обрабатываются относительно текущего пространства имён.

PHP дополнительно поддерживает удобное сокращение для задания нескольких операторов use в одной и той же строке 

Пример #2 Импорт или создание псевдонима через ключевое слово use, комбинирование нескольких выражений

```


<?php

use My\Full\Classname as Another, My\Full\NSname;

$obj = new Another; // Создаёт объект класса My\Full\Classname
NSname\subns\func(); // Вызывает функцию My\Full\NSname\subns\func

?>
```


Импорт выполняется во время компиляции поэтому не влияет на имена динамических классов, функций или констант. 

Пример #3 Импорт и динамические имена
```


<?php

use My\Full\Classname as Another, My\Full\NSname;

$obj = new Another; // Создаёт объект класса My\Full\Classname
$a = 'Another';
$obj = new $a;      // Создаёт объект класса Another

?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пространства имён: псевдонимирование и импорт ¶

 Способность ссылаться на внешнее абсолютное имя по псевдониму или импортировать внешние абсолютные имена — это важное свойство пространств имён. Это похоже на способность файловых систем на основе Unix создавать символические ссылки на файл или директорию.

PHP умеет создавать псевдонимы или импортировать константы, функции, классы, интерфейсы, трейты, перечисления и пространства имён.

Псевдоним имени создают через ключевое слово use. Вот пример, который показывает 5 типов импорта: 

Пример #1 Импорт или псевдонимирование через ключевое слово use

```


<?php

namespace foo;

use My\Full\Classname as Another;

// Это то же, что и My\Full\NSname as NSname
use My\Full\NSname;

// Импортирование глобального класса
use ArrayObject;

// Импортирование функции
use function My\Full\functionName;

// Создание псевдонима функции
use function My\Full\functionName as func;

// Импортирование константы
use const My\Full\CONSTANT;

$obj = new namespace\Another; // Создаёт экземпляр класса foo\Another
$obj = new Another; // Создаёт объект класса My\Full\Classname
NSname\subns\func(); // Вызывает функцию My\Full\NSname\subns\func

$a = new ArrayObject(array(1)); // Создаёт объект класса ArrayObject
// без выражения use ArrayObject был бы создан объект класса foo\ArrayObject

func(); // вызывает функцию My\Full\functionName
echo CONSTANT; // выводит содержимое константы My\Full\CONSTANT

?>
```


Обратите внимание, что именам внутри пространства имён (абсолютным именам пространств имён, которые содержат разделитель пространств имён, например Foo\Bar, в отличие от глобальных имён, которые его не содержат, например FooBar) начальный обратный слеш (\) не нужен и не рекомендован, поскольку импортируемые имена должны быть абсолютными и не обрабатываются относительно текущего пространства имён.

PHP дополнительно поддерживает удобное сокращение для задания нескольких операторов use в одной и той же строке 

Пример #1 Импорт или псевдонимирование через ключевое слово use
```


<?php

namespace foo;

use My\Full\Classname as Another;

// Это то же, что и My\Full\NSname as NSname
use My\Full\NSname;

// Импортирование глобального класса
use ArrayObject;

// Импортирование функции
use function My\Full\functionName;

// Создание псевдонима функции
use function My\Full\functionName as func;

// Импортирование константы
use const My\Full\CONSTANT;

$obj = new namespace\Another; // Создаёт экземпляр класса foo\Another
$obj = new Another; // Создаёт объект класса My\Full\Classname
NSname\subns\func(); // Вызывает функцию My\Full\NSname\subns\func

$a = new ArrayObject(array(1)); // Создаёт объект класса ArrayObject
// без выражения use ArrayObject был бы создан объект класса foo\ArrayObject

func(); // вызывает функцию My\Full\functionName
echo CONSTANT; // выводит содержимое константы My\Full\CONSTANT

?>
```


Обратите внимание, что именам внутри пространства имён (абсолютным именам пространств имён, которые содержат разделитель пространств имён, например Foo\Bar, в отличие от глобальных имён, которые его не содержат, например FooBar) начальный обратный слеш (\) не нужен и не рекомендован, поскольку импортируемые имена должны быть абсолютными и не обрабатываются относительно текущего пространства имён.

PHP дополнительно поддерживает удобное сокращение для задания нескольких операторов use в одной и той же строке 

Пример #2 Импорт или создание псевдонима через ключевое слово use, комбинирование нескольких выражений

```


<?php

use My\Full\Classname as Another, My\Full\NSname;

$obj = new Another; // Создаёт объект класса My\Full\Classname
NSname\subns\func(); // Вызывает функцию My\Full\NSname\subns\func

?>
```


Импорт выполняется во время компиляции поэтому не влияет на имена динамических классов, функций или констант. 

Пример #3 Импорт и динамические имена
```


<?php

use My\Full\Classname as Another, My\Full\NSname;

$obj = new Another; // Создаёт объект класса My\Full\Classname
$a = 'Another';
$obj = new $a;      // Создаёт объект класса Another

?>
```



