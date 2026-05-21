
# Начало карточки

<!-- basicblock-start oid="ObsQYukgrLVPBh2EVaHxXvtA"  deck='0_Pd_php_docs_operators_4' -->
Пример #1 Сравнение boolean/null::


```

// Логические значения и null всегда сравниваются как логические
var_dump(1 == TRUE); // TRUE  — то же, что и (bool)1 == TRUE
var_dump(0 == FALSE); // TRUE  — то же, что и (bool)0 == FALSE
var_dump(100 < TRUE); // FALSE  — то же, что и (bool)100 < TRUE
var_dump(-10 < FALSE); // FALSE  — то же, что и (bool)-10 < FALSE
var_dump(min(-100, -10, NULL, 10, 100)); // NULL  — (bool)NULL < (bool)-100 это FALSE < TRUE
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #1 Сравнение boolean/null

```

// Логические значения и null всегда сравниваются как логические
var_dump(1 == TRUE); // TRUE  — то же, что и (bool)1 == TRUE
var_dump(0 == FALSE); // TRUE  — то же, что и (bool)0 == FALSE
var_dump(100 < TRUE); // FALSE  — то же, что и (bool)100 < TRUE
var_dump(-10 < FALSE); // FALSE  — то же, что и (bool)-10 < FALSE
var_dump(min(-100, -10, NULL, 10, 100)); // NULL  — (bool)NULL < (bool)-100 это FALSE < TRUE
```



