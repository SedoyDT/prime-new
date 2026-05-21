
# Начало карточки

<!-- basicblock-start oid="ObsOFfADDBfE4Tc0ffMbGvE5"  deck='0_Pd_php_docs_types_2' -->
Пример #2 Пример передачи замыкания (объекта класса Closure) в качестве callback-функции ::


```


<?php

// Замыкание
$double = function($a) {
    return $a * 2;
};

// Диапазон чисел
$numbers = range(1, 5);

// Передаём замыкание как callback-функцию,
// чтобы удвоить каждый элемент диапазона
$new_numbers = array_map($double, $numbers);

print implode(' ', $new_numbers);

?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #2 Пример передачи замыкания (объекта класса Closure) в качестве callback-функции 

```


<?php

// Замыкание
$double = function($a) {
    return $a * 2;
};

// Диапазон чисел
$numbers = range(1, 5);

// Передаём замыкание как callback-функцию,
// чтобы удвоить каждый элемент диапазона
$new_numbers = array_map($double, $numbers);

print implode(' ', $new_numbers);

?>
```



