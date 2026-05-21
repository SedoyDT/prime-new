
# Начало карточки

<!-- basicblock-start oid="ObsDoVp2qMKJq5p73AmbIxoj"  deck='0_Pd_php_docs_operators_4' -->
Пример #2 Алгоритм сравнения обычных массивов::


```


<?php

// Массивы сравниваются как в этом примере — со стандартными операторами сравнения, а также оператором «космический корабль» (spaceship).
function standard_array_compare($op1, $op2)
{
    if (count($op1) < count($op2)) {
        return -1; // $op1 < $op2
    } elseif (count($op1) > count($op2)) {
        return 1; // $op1 > $op2
    }

    foreach ($op1 as $key => $val) {
        if (!array_key_exists($key, $op2)) {
            return 1;
        } elseif ($val < $op2[$key]) {
            return -1;
        } elseif ($val > $op2[$key]) {
            return 1;
        }
    }

    return 0; // $op1 == $op2
}
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #2 Алгоритм сравнения обычных массивов

```


<?php

// Массивы сравниваются как в этом примере — со стандартными операторами сравнения, а также оператором «космический корабль» (spaceship).
function standard_array_compare($op1, $op2)
{
    if (count($op1) < count($op2)) {
        return -1; // $op1 < $op2
    } elseif (count($op1) > count($op2)) {
        return 1; // $op1 > $op2
    }

    foreach ($op1 as $key => $val) {
        if (!array_key_exists($key, $op2)) {
            return 1;
        } elseif ($val < $op2[$key]) {
            return -1;
        } elseif ($val > $op2[$key]) {
            return 1;
        }
    }

    return 0; // $op1 == $op2
}
```



