
# Начало карточки

<!-- basicblock-start oid="ObsT4gY1aKnHx3b7JxayPeDC"  deck='0_Pd_php_docs_exception_10' -->
Пример выброса исключения::


```


<?php

function inverse($x) {
    if (!$x) {
        throw new Exception('Деление на ноль.');
    }
    return 1 / $x;
}

try {
    echo inverse(5) . "\n";
    echo inverse(0) . "\n";
} catch (Exception $e) {
    echo 'PHP перехватил исключение: ',  $e->getMessage(), "\n";
}

// Продолжить выполнение
echo "Привет, мир\n";

?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример выброса исключения

```


<?php

function inverse($x) {
    if (!$x) {
        throw new Exception('Деление на ноль.');
    }
    return 1 / $x;
}

try {
    echo inverse(5) . "\n";
    echo inverse(0) . "\n";
} catch (Exception $e) {
    echo 'PHP перехватил исключение: ',  $e->getMessage(), "\n";
}

// Продолжить выполнение
echo "Привет, мир\n";

?>
```



