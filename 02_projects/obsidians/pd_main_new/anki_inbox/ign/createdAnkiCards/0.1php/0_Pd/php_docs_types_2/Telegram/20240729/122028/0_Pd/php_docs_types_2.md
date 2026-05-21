
# Начало карточки

<!-- basicblock-start oid="Obsd7IPm2Jz02LCQ8cdNED7d"  deck='0_Pd_php_docs_types_2' -->
Пример #3 Пример объявления типа класса::


```


<?php

class C {}
class D extends C {}

// Не наследует C.
class E {}

function f(C $c) {
    echo get_class($c)."\n";
}

f(new C);
f(new D);
f(new E);
?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #3 Пример объявления типа класса

```


<?php

class C {}
class D extends C {}

// Не наследует C.
class E {}

function f(C $c) {
    echo get_class($c)."\n";
}

f(new C);
f(new D);
f(new E);
?>
```



