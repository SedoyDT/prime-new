
# Начало карточки

<!-- basicblock-start oid="ObsbVRuVNVgzx0Y70rVFHlPe"  deck='0_Pd_php_docs_Built-in_nterfaces_And_Classes' -->
Пример #1 Создание stdClass в результате преобразования в объект?::


```


<?php
$obj = (object) array('foo' => 'bar');
var_dump($obj);
```


 Результат выполнения приведённого примера: 

```

object(stdClass)#1 (1) {
  ["foo"]=>
  string(3) "bar"
}
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #1 Создание stdClass в результате преобразования в объект?

```


<?php
$obj = (object) array('foo' => 'bar');
var_dump($obj);
```


 Результат выполнения приведённого примера: 

```

object(stdClass)#1 (1) {
  ["foo"]=>
  string(3) "bar"
}
```



