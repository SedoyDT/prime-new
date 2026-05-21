
# Начало карточки

<!-- basicblock-start oid="ObsK3b7pS1Y6W0BblKM96zxo"  deck='0_Pd_php_docs_Built-in_nterfaces_And_Classes' -->
Пример #3 Объявление динамических свойств stdClass ::


```


<?php
$obj = new stdClass();
$obj->foo = 42;
$obj->{1} = 42;
var_dump($obj);
```


 Результат выполнения приведённого примера: 

```

object(stdClass)#1 (2) {
  ["foo"]=>
  int(42)
  ["1"]=>
  int(42)
}
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #3 Объявление динамических свойств stdClass 

```


<?php
$obj = new stdClass();
$obj->foo = 42;
$obj->{1} = 42;
var_dump($obj);
```


 Результат выполнения приведённого примера: 

```

object(stdClass)#1 (2) {
  ["foo"]=>
  int(42)
  ["1"]=>
  int(42)
}
```



