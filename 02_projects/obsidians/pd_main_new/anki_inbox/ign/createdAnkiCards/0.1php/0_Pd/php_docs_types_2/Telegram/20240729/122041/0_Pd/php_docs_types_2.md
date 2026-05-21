
# Начало карточки

<!-- basicblock-start oid="Obs4IoElpWYAgivNT3ZjGIvF"  deck='0_Pd_php_docs_types_2' -->
Пример #4 Пример объявления типа интерфейса::


```


<?php

interface I { public function f(); }
class C implements I { public function f() {} }

// Не реализует I.
class E {}

function f(I $i) {
    echo get_class($i)."\n";
}

f(new C);
f(new E);
?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #4 Пример объявления типа интерфейса

```


<?php

interface I { public function f(); }
class C implements I { public function f() {} }

// Не реализует I.
class E {}

function f(I $i) {
    echo get_class($i)."\n";
}

f(new C);
f(new E);
?>
```



