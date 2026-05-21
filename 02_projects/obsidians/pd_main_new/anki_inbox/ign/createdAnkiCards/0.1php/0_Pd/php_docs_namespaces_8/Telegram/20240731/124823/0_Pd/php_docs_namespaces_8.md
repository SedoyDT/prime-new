
# Начало карточки

<!-- basicblock-start oid="Obs6UVyrQ8XYliThv11dkF0E"  deck='0_Pd_php_docs_namespaces_8' -->
Ключевое слово namespace и магическая константа *NAMESPAC*E ¶::


 PHP поддерживает два способа абстрактного доступа к элементам в текущем пространстве имён: магическая константа *NAMESPAC*E и ключевое слово namespace.

Значение константы *NAMESPAC*E — это строка, которая содержит имя текущего пространства имён. В глобальном пространстве, вне пространства имён, она содержит пустую строку. 

Пример #1 Пример записи константы *NAMESPAC*E в коде с пространством имён

```


<?php

namespace MyProject;

echo '"', __NAMESPACE__, '"'; // Выводит «MyProject»

?>

```


Пример #2 Пример записи константы *NAMESPAC*E в глобальном пространстве

```


<?php

echo '"', __NAMESPACE__, '"'; // Выводит «»
?>

```

 Константа *NAMESPAC*E полезна для динамически конструируемых имён, например: 

Пример #3 Константа *NAMESPAC*E и динамическое конструирование имени
```


<?php

namespace MyProject;

function get($classname)
{
    $a = __NAMESPACE__ . '\\' . $classname;
    return new $a;
}

?>
```

 Ключевое слово namespace разрешено указывать для явного запроса элемента из текущего пространства имён или из подпространства. Это эквивалент ключевого слова self для классов в пространстве имён. 

Пример #4 Ключевое слово namespace внутри пространства имён
```


<?php

namespace MyProject;

use blah\blah as mine; // Смотрите «Пространства имён: псевдонимирование и импорт»

blah\mine(); // Вызывает функцию MyProject\blah\mine()
namespace\blah\mine(); // Вызывает функцию MyProject\blah\mine()

namespace\func(); // Вызывает функцию MyProject\func()
namespace\sub\func(); // Вызывает функцию MyProject\sub\func()
namespace\cname::method(); // Вызывает статический метод method класса MyProject\cname
$a = new namespace\sub\cname(); // Создаёт экземпляр класса MyProject\sub\cname
$b = namespace\CONSTANT; // Присваивает значение константы MyProject\CONSTANT переменной $b

?>
```

Пример #5 Ключевое слово namespace в глобальном коде
```


<?php

namespace\func(); // Вызывает функцию func()
namespace\sub\func(); // Вызывает функцию sub\func()
namespace\cname::method(); // Вызывает статический метод method класса cname
$a = new namespace\sub\cname(); // Создаёт экземпляр класса sub\cname
$b = namespace\CONSTANT; // Присваивает значение константы CONSTANT переменной $b

?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Ключевое слово namespace и магическая константа *NAMESPAC*E ¶

 PHP поддерживает два способа абстрактного доступа к элементам в текущем пространстве имён: магическая константа *NAMESPAC*E и ключевое слово namespace.

Значение константы *NAMESPAC*E — это строка, которая содержит имя текущего пространства имён. В глобальном пространстве, вне пространства имён, она содержит пустую строку. 

Пример #1 Пример записи константы *NAMESPAC*E в коде с пространством имён

```


<?php

namespace MyProject;

echo '"', __NAMESPACE__, '"'; // Выводит «MyProject»

?>

```


Пример #2 Пример записи константы *NAMESPAC*E в глобальном пространстве

```


<?php

echo '"', __NAMESPACE__, '"'; // Выводит «»
?>

```

 Константа *NAMESPAC*E полезна для динамически конструируемых имён, например: 

Пример #3 Константа *NAMESPAC*E и динамическое конструирование имени
```


<?php

namespace MyProject;

function get($classname)
{
    $a = __NAMESPACE__ . '\\' . $classname;
    return new $a;
}

?>
```

 Ключевое слово namespace разрешено указывать для явного запроса элемента из текущего пространства имён или из подпространства. Это эквивалент ключевого слова self для классов в пространстве имён. 

Пример #4 Ключевое слово namespace внутри пространства имён
```


<?php

namespace MyProject;

use blah\blah as mine; // Смотрите «Пространства имён: псевдонимирование и импорт»

blah\mine(); // Вызывает функцию MyProject\blah\mine()
namespace\blah\mine(); // Вызывает функцию MyProject\blah\mine()

namespace\func(); // Вызывает функцию MyProject\func()
namespace\sub\func(); // Вызывает функцию MyProject\sub\func()
namespace\cname::method(); // Вызывает статический метод method класса MyProject\cname
$a = new namespace\sub\cname(); // Создаёт экземпляр класса MyProject\sub\cname
$b = namespace\CONSTANT; // Присваивает значение константы MyProject\CONSTANT переменной $b

?>
```

Пример #5 Ключевое слово namespace в глобальном коде
```


<?php

namespace\func(); // Вызывает функцию func()
namespace\sub\func(); // Вызывает функцию sub\func()
namespace\cname::method(); // Вызывает статический метод method класса cname
$a = new namespace\sub\cname(); // Создаёт экземпляр класса sub\cname
$b = namespace\CONSTANT; // Присваивает значение константы CONSTANT переменной $b

?>
```



