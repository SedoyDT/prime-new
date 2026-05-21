
# Начало карточки

<!-- basicblock-start oid="ObsgA8IeIbgZcLDtkIrOuxlO"  deck='0_Pd_php_docs_types_2' -->
Пример #7 Объявление аргумента с обнуляемым типом::


```


<?php

class C {}

function f(?C $c) {
    var_dump($c);
}

f(new C);
f(null);
?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #7 Объявление аргумента с обнуляемым типом

```


<?php

class C {}

function f(?C $c) {
    var_dump($c);
}

f(new C);
f(null);
?>
```



