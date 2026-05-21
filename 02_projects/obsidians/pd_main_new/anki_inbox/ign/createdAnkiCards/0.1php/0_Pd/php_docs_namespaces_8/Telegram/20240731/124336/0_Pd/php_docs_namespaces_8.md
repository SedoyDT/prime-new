
# Начало карточки

<!-- basicblock-start oid="Obs1yPhBJT4hPEMcNAZ28x6b"  deck='0_Pd_php_docs_namespaces_8' -->
Пространства имён: основы ¶::


 Прежде чем обсуждать работу с пространствами имён, важно понять, как PHP узнаёт, какие элементы из пространства имён запрашиваются в коде. Можно провести аналогию между пространствами имён PHP и файловой системой. Есть три способа обратиться к файлу в файловой системе:

    Относительное имя файла наподобие foo.txt разрешится в currentdirectory/foo.txt, где currentdirectory — текущая директория, в которой мы находимся. Тогда, если текущая директория — /home/foo, то имя преобразуется в /home/foo/foo.txt.
    Относительное имя пути наподобие subdirectory/foo.txt разрешится в currentdirectory/subdirectory/foo.txt.
    Абсолютное имя пути наподобие /main/foo.txt останется таким же: /main/foo.txt.

Тот же принцип сохранится при разрешении элементов из пространств имён PHP. Например, имя класса разрешено указывать тремя способами:

    Неполное имя, или имя класса без префикса, наподобие $a = new foo(); или foo::staticmethod();. Если текущее пространство имён — currentnamespace, то это имя разрешится в currentnamespace\foo. В коде в глобальном пространстве имён имя останется таким же: foo. Предостережение: неполные имена функций и констант будут разрешатся в глобальные функции и константы, если они не определены в текущем пространстве имён. Подробнее об этом рассказано в разделе « Пространства имён: возврат к глобальному пространству для функций и констант ».
    Полное имя, или имя класса с префиксами наподобие $a = new subnamespace\foo(); или subnamespace\foo::staticmethod();. Если текущее пространство имён — currentnamespace, то это имя разрешится в currentnamespace\subnamespace\foo. В коде в глобальном пространстве имён имя разрешится в subnamespace\foo.
    Абсолютное имя, или имя с префиксом в начале, который указывает на глобальное пространство имён наподобие $a = new \currentnamespace\foo(); или \currentnamespace\foo::staticmethod();. Такое имя разрешается в буквальное имя, заданное в коде: currentnamespace\foo.

 Вот пример трёх видов синтаксиса в реальном коде: 


file1.php
```

<?php

namespace Foo\Bar\subnamespace;

const FOO = 1;
function foo() {}
class foo
{
    static function staticmethod() {}
}
?>
```


file2.php

```

<?php

namespace Foo\Bar;
include 'file1.php';

const FOO = 2;
function foo() {}
class foo
{
    static function staticmethod() {}
}

/* Неполные имена */
foo(); // Разрешается в функцию Foo\Bar\foo
foo::staticmethod(); // Разрешается в метод staticmethod класса Foo\Bar\foo
echo FOO; // Разрешается в константу Foo\Bar\FOO

/* Полные имена */
subnamespace\foo(); // Разрешается в функцию Foo\Bar\subnamespace\foo
subnamespace\foo::staticmethod(); // Разрешается в метод staticmethod класса Foo\Bar\subnamespace\foo
echo subnamespace\FOO; // Разрешается в константу Foo\Bar\subnamespace\FOO

/* Абсолютные имена */
\Foo\Bar\foo(); // Разрешается в функцию Foo\Bar\foo
\Foo\Bar\foo::staticmethod(); // Разрешается в метод staticmethod класса Foo\Bar\foo
echo \Foo\Bar\FOO; // Разрешается в константу Foo\Bar\FOO

?>
```


Обратите внимание, что для доступа к глобальным классам, функциям или константам разрешается указывать абсолютное имя, например, \strlen(), \Exception или \INI_ALL.

Пример #1 Доступ к глобальным классам, функциям и константам из пространства имён
```

<?php

namespace Foo;

function strlen() {}
const INI_ALL = 3;
class Exception {}

$a = \strlen('hi'); // Вызывает глобальную функцию strlen
$b = \INI_ALL; // Получает доступ к глобальной константе INI_ALL
$c = new \Exception('error'); // Создаёт экземпляр глобального класса Exception

?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пространства имён: основы ¶

 Прежде чем обсуждать работу с пространствами имён, важно понять, как PHP узнаёт, какие элементы из пространства имён запрашиваются в коде. Можно провести аналогию между пространствами имён PHP и файловой системой. Есть три способа обратиться к файлу в файловой системе:

    Относительное имя файла наподобие foo.txt разрешится в currentdirectory/foo.txt, где currentdirectory — текущая директория, в которой мы находимся. Тогда, если текущая директория — /home/foo, то имя преобразуется в /home/foo/foo.txt.
    Относительное имя пути наподобие subdirectory/foo.txt разрешится в currentdirectory/subdirectory/foo.txt.
    Абсолютное имя пути наподобие /main/foo.txt останется таким же: /main/foo.txt.

Тот же принцип сохранится при разрешении элементов из пространств имён PHP. Например, имя класса разрешено указывать тремя способами:

    Неполное имя, или имя класса без префикса, наподобие $a = new foo(); или foo::staticmethod();. Если текущее пространство имён — currentnamespace, то это имя разрешится в currentnamespace\foo. В коде в глобальном пространстве имён имя останется таким же: foo. Предостережение: неполные имена функций и констант будут разрешатся в глобальные функции и константы, если они не определены в текущем пространстве имён. Подробнее об этом рассказано в разделе « Пространства имён: возврат к глобальному пространству для функций и констант ».
    Полное имя, или имя класса с префиксами наподобие $a = new subnamespace\foo(); или subnamespace\foo::staticmethod();. Если текущее пространство имён — currentnamespace, то это имя разрешится в currentnamespace\subnamespace\foo. В коде в глобальном пространстве имён имя разрешится в subnamespace\foo.
    Абсолютное имя, или имя с префиксом в начале, который указывает на глобальное пространство имён наподобие $a = new \currentnamespace\foo(); или \currentnamespace\foo::staticmethod();. Такое имя разрешается в буквальное имя, заданное в коде: currentnamespace\foo.

 Вот пример трёх видов синтаксиса в реальном коде: 


file1.php
```

<?php

namespace Foo\Bar\subnamespace;

const FOO = 1;
function foo() {}
class foo
{
    static function staticmethod() {}
}
?>
```


file2.php

```

<?php

namespace Foo\Bar;
include 'file1.php';

const FOO = 2;
function foo() {}
class foo
{
    static function staticmethod() {}
}

/* Неполные имена */
foo(); // Разрешается в функцию Foo\Bar\foo
foo::staticmethod(); // Разрешается в метод staticmethod класса Foo\Bar\foo
echo FOO; // Разрешается в константу Foo\Bar\FOO

/* Полные имена */
subnamespace\foo(); // Разрешается в функцию Foo\Bar\subnamespace\foo
subnamespace\foo::staticmethod(); // Разрешается в метод staticmethod класса Foo\Bar\subnamespace\foo
echo subnamespace\FOO; // Разрешается в константу Foo\Bar\subnamespace\FOO

/* Абсолютные имена */
\Foo\Bar\foo(); // Разрешается в функцию Foo\Bar\foo
\Foo\Bar\foo::staticmethod(); // Разрешается в метод staticmethod класса Foo\Bar\foo
echo \Foo\Bar\FOO; // Разрешается в константу Foo\Bar\FOO

?>
```


Обратите внимание, что для доступа к глобальным классам, функциям или константам разрешается указывать абсолютное имя, например, \strlen(), \Exception или \INI_ALL.

Пример #1 Доступ к глобальным классам, функциям и константам из пространства имён
```

<?php

namespace Foo;

function strlen() {}
const INI_ALL = 3;
class Exception {}

$a = \strlen('hi'); // Вызывает глобальную функцию strlen
$b = \INI_ALL; // Получает доступ к глобальной константе INI_ALL
$c = new \Exception('error'); // Создаёт экземпляр глобального класса Exception

?>
```



