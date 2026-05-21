
# Начало карточки

<!-- basicblock-start oid="Obs8cJsIWzkhYpsjNhA8RmR1"  deck='0_Pd_php_docs_Built-in_nterfaces_And_Classes' -->
Пример #2 Создание stdClass в результате работы функции json_decode()::


```


<?php
$json = '{"foo":"bar"}';
var_dump(json_decode($json));
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

Пример #2 Создание stdClass в результате работы функции json_decode()

```


<?php
$json = '{"foo":"bar"}';
var_dump(json_decode($json));
```



 Результат выполнения приведённого примера: 

```

object(stdClass)#1 (1) {
  ["foo"]=>
  string(3) "bar"
}
```



