
# Начало карточки

<!-- basicblock-start oid="ObsOGiwBUJ6HRGNZFk9rzK3K"  deck='0_Pd_php_docs_namespaces_8' -->
Групповые объявления через ключевое слово use?::


Классы, функции и константы, импортируемые из одного и того же пространства имён (namespace), разрешено группировать в одном выражении с ключевым словом use. 

```


<?php

use some\namespace\ClassA;
use some\namespace\ClassB;
use some\namespace\ClassC as C;

use function some\namespace\fn_a;
use function some\namespace\fn_b;
use function some\namespace\fn_c;

use const some\namespace\ConstA;
use const some\namespace\ConstB;
use const some\namespace\ConstC;

// Эквивалентно следующему групповому объявлению с ключевым словом use
use some\namespace\{ClassA, ClassB, ClassC as C};
use function some\namespace\{fn_a, fn_b, fn_c};
use const some\namespace\{ConstA, ConstB, ConstC};
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Групповые объявления через ключевое слово use?

Классы, функции и константы, импортируемые из одного и того же пространства имён (namespace), разрешено группировать в одном выражении с ключевым словом use. 

```


<?php

use some\namespace\ClassA;
use some\namespace\ClassB;
use some\namespace\ClassC as C;

use function some\namespace\fn_a;
use function some\namespace\fn_b;
use function some\namespace\fn_c;

use const some\namespace\ConstA;
use const some\namespace\ConstB;
use const some\namespace\ConstC;

// Эквивалентно следующему групповому объявлению с ключевым словом use
use some\namespace\{ClassA, ClassB, ClassC as C};
use function some\namespace\{fn_a, fn_b, fn_c};
use const some\namespace\{ConstA, ConstB, ConstC};
```



