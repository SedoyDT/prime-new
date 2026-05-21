
# Начало карточки

<!-- basicblock-start oid="ObsZkTyzuSkoLbiEklZKd4UC"  deck='0_Pd_php_docs_exception_10' -->
Пример #4 Взаимодействие между блоками finally и return::


```


<?php

function test() {
    try {
        throw new Exception('foo');
    } catch (Exception $e) {
        return 'catch';
    } finally {
        return 'finally';
    }
}

echo test();

?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #4 Взаимодействие между блоками finally и return

```


<?php

function test() {
    try {
        throw new Exception('foo');
    } catch (Exception $e) {
        return 'catch';
    } finally {
        return 'finally';
    }
}

echo test();

?>
```



