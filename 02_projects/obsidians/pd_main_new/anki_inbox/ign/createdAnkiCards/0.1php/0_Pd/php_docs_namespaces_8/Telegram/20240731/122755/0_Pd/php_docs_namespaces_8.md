
# Начало карточки

<!-- basicblock-start oid="ObsIx9dfDdmqy63sVr5ZPwF7"  deck='0_Pd_php_docs_namespaces_8' -->
Описание нескольких пространств имён в одном файле ¶::


 В одном файле разрешено объявлять несколько пространств имён. Есть два разрешённых синтаксиса:

Пример #1 Описание нескольких пространств имён, простой синтаксис

```


<?php

namespace MyProject;

const CONNECT_OK = 1;
class Connection { /* ... */ }
function connect() { /* ... */  }

namespace AnotherProject;

const CONNECT_OK = 1;
class Connection { /* ... */ }
function connect() { /* ... */  }

?>

```


Этот синтаксис не рекомендован для комбинирования пространств имён в одном файле. Вместо него лучше пользоваться альтернативным синтаксисом со скобками. 

Пример #2 Описание нескольких пространств имён, синтаксис со скобками

```


<?php

namespace MyProject {
    const CONNECT_OK = 1;
    class Connection { /* ... */ }
    function connect() { /* ... */  }
}

namespace AnotherProject {
    const CONNECT_OK = 1;
    class Connection { /* ... */ }
    function connect() { /* ... */  }
}

?>

```


 Практика написания кода настоятельно не рекомендует объединять пространства имён в одном файле. Главный сценарий того, когда это потребуется, — объединение нескольких PHP-файлов в один файл.

Для объединения кода в глобальном пространстве имён с кодом в других пространствах имён пользуются только синтаксисом со скобками. Глобальный код должен быть помещён в конструкцию описания пространства имён без указания имени:

Пример #3 Описание глобального и обычного пространства имён в одном файле
```


<?php

namespace MyProject {
    const CONNECT_OK = 1;
    class Connection { /* ... */ }
    function connect() { /* ... */  }
}

namespace {       // Глобальный код
    session_start();
    $a = MyProject\connect();
    echo MyProject\Connection::start();
}

?>
```


Никакой PHP-код нельзя размещать за пределами скобок пространства имён, кроме начального выражения declare. 

Пример #4 Описание глобального и обычного пространства имён в одном файле

```


<?php

declare(encoding='UTF-8');
namespace MyProject {
    const CONNECT_OK = 1;
    class Connection { /* ... */ }
    function connect() { /* ... */  }
}

namespace {      // Глобальный код
    session_start();
    $a = MyProject\connect();
    echo MyProject\Connection::start();
}

?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Описание нескольких пространств имён в одном файле ¶

 В одном файле разрешено объявлять несколько пространств имён. Есть два разрешённых синтаксиса:

Пример #1 Описание нескольких пространств имён, простой синтаксис

```


<?php

namespace MyProject;

const CONNECT_OK = 1;
class Connection { /* ... */ }
function connect() { /* ... */  }

namespace AnotherProject;

const CONNECT_OK = 1;
class Connection { /* ... */ }
function connect() { /* ... */  }

?>

```


Этот синтаксис не рекомендован для комбинирования пространств имён в одном файле. Вместо него лучше пользоваться альтернативным синтаксисом со скобками. 

Пример #2 Описание нескольких пространств имён, синтаксис со скобками

```


<?php

namespace MyProject {
    const CONNECT_OK = 1;
    class Connection { /* ... */ }
    function connect() { /* ... */  }
}

namespace AnotherProject {
    const CONNECT_OK = 1;
    class Connection { /* ... */ }
    function connect() { /* ... */  }
}

?>

```


 Практика написания кода настоятельно не рекомендует объединять пространства имён в одном файле. Главный сценарий того, когда это потребуется, — объединение нескольких PHP-файлов в один файл.

Для объединения кода в глобальном пространстве имён с кодом в других пространствах имён пользуются только синтаксисом со скобками. Глобальный код должен быть помещён в конструкцию описания пространства имён без указания имени:

Пример #3 Описание глобального и обычного пространства имён в одном файле
```


<?php

namespace MyProject {
    const CONNECT_OK = 1;
    class Connection { /* ... */ }
    function connect() { /* ... */  }
}

namespace {       // Глобальный код
    session_start();
    $a = MyProject\connect();
    echo MyProject\Connection::start();
}

?>
```


Никакой PHP-код нельзя размещать за пределами скобок пространства имён, кроме начального выражения declare. 

Пример #4 Описание глобального и обычного пространства имён в одном файле

```


<?php

declare(encoding='UTF-8');
namespace MyProject {
    const CONNECT_OK = 1;
    class Connection { /* ... */ }
    function connect() { /* ... */  }
}

namespace {      // Глобальный код
    session_start();
    $a = MyProject\connect();
    echo MyProject\Connection::start();
}

?>
```



