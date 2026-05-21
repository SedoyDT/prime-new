
# Начало карточки

<!-- basicblock-start oid="ObsNcQmN50ZeLnjg2HCHVeiw"  deck='0_Pd_php_docs_exception_10' -->
Пример #3 Обработка исключений в блоке finally::


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
} catch (Exception $e) {
    echo 'PHP перехватил исключение: ',  $e->getMessage(), "\n";
} finally {
    echo "Первый блок finally.\n";
}

try {
    echo inverse(0) . "\n";
} catch (Exception $e) {
    echo 'PHP перехватил исключение: ',  $e->getMessage(), "\n";
} finally {
    echo "Второй блок finally.\n";
}

// Продолжить выполнение
echo "Привет, мир\n";

?>
```

Результат выполнения приведённого примера:

finally

<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #3 Обработка исключений в блоке finally

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
} catch (Exception $e) {
    echo 'PHP перехватил исключение: ',  $e->getMessage(), "\n";
} finally {
    echo "Первый блок finally.\n";
}

try {
    echo inverse(0) . "\n";
} catch (Exception $e) {
    echo 'PHP перехватил исключение: ',  $e->getMessage(), "\n";
} finally {
    echo "Второй блок finally.\n";
}

// Продолжить выполнение
echo "Привет, мир\n";

?>
```



