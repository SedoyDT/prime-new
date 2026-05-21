
# Начало карточки

<!-- basicblock-start oid="Obs09v1xFOADssl5bJROknf8"  deck='0_Pd_php_docs_namespaces_8' -->
Определение подпространств имён ¶::


 Так же как файлы и каталоги, пространства имён PHP разрешают создавать иерархию имён. Поэтому имя пространства разрешено определять с подуровнями:

Пример #1 Определение пространства имён с иерархией
```

<?php

namespace MyProject\Sub\Level;

const CONNECT_OK = 1;
class Connection { /* ... */ }
function connect() { /* ... */  }

?>

```
Приведённый пример создаёт константу MyProject\Sub\Level\CONNECT_OK, класс MyProject\Sub\Level\Connection и функцию MyProject\Sub\Level\connect.
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Определение подпространств имён ¶

 Так же как файлы и каталоги, пространства имён PHP разрешают создавать иерархию имён. Поэтому имя пространства разрешено определять с подуровнями:

Пример #1 Определение пространства имён с иерархией
```

<?php

namespace MyProject\Sub\Level;

const CONNECT_OK = 1;
class Connection { /* ... */ }
function connect() { /* ... */  }

?>

```
Приведённый пример создаёт константу MyProject\Sub\Level\CONNECT_OK, класс MyProject\Sub\Level\Connection и функцию MyProject\Sub\Level\connect.



