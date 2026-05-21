
# Начало карточки

<!-- basicblock-start oid="ObsVq6LG5a14Nn6pEz5hZUZ4"  deck='0_Pd_php_docs_function_6' -->
Пример #3 Передача аргументов по ссылке::

<?php

function add_some_extra(&$string)
{
    $string .= 'и кое-что ещё.';
}

$str = 'Это строка, ';
add_some_extra($str);
echo $str;    // Выведет «Это строка, и кое-что ещё.»

?>
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #3 Передача аргументов по ссылке
<?php

function add_some_extra(&$string)
{
    $string .= 'и кое-что ещё.';
}

$str = 'Это строка, ';
add_some_extra($str);
echo $str;    // Выведет «Это строка, и кое-что ещё.»

?>




# Начало карточки

<!-- basicblock-start oid="ObsbHOUdxRONH6AOQqCqLqzp"  deck='0_Pd_php_docs_function_6' -->
Пример #3 Передача аргументов по ссылке::


```

<?php

function add_some_extra(&$string)
{
    $string .= 'и кое-что ещё.';
}

$str = 'Это строка, ';
add_some_extra($str);
echo $str;    // Выведет «Это строка, и кое-что ещё.»

?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #3 Передача аргументов по ссылке

```

<?php

function add_some_extra(&$string)
{
    $string .= 'и кое-что ещё.';
}

$str = 'Это строка, ';
add_some_extra($str);
echo $str;    // Выведет «Это строка, и кое-что ещё.»

?>
```



