
# Начало карточки

<!-- basicblock-start oid="Obs3tAfvBrmT176BMPrvzcQz"  deck='0_Pd_CSSHTML_12_grid_loyout' -->
Что делает свойство grid?::


Свойство grid объединяет свойства grid-template-rows и grid-template-columns и разом позволяет задать настройки для строк и столбцов в следующем формате:

```

.grid-container {
    border: solid 2px #000;
    display: grid;
    grid-template-columns: 8em 8em 8em;
    grid-template-rows: 5em 5em 5em 5em;
}
```

Мы можем сократить этот класс следующим образом:
```

.grid-container {
    border: solid 2px #000;
    display: grid;
    grid: 5em 5em 5em 5em / 8em 8em 8em;
}
```

Либо опять же используя функцию repeat(), можно еще больше сократить определение грида:

```

.grid-container {
    border: solid 2px #000;
    display: grid;
    grid: repeat(4, 5em) / repeat(3, 8em);
}
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что делает свойство grid?

Свойство grid объединяет свойства grid-template-rows и grid-template-columns и разом позволяет задать настройки для строк и столбцов в следующем формате:

```

.grid-container {
    border: solid 2px #000;
    display: grid;
    grid-template-columns: 8em 8em 8em;
    grid-template-rows: 5em 5em 5em 5em;
}
```

Мы можем сократить этот класс следующим образом:
```

.grid-container {
    border: solid 2px #000;
    display: grid;
    grid: 5em 5em 5em 5em / 8em 8em 8em;
}
```

Либо опять же используя функцию repeat(), можно еще больше сократить определение грида:

```

.grid-container {
    border: solid 2px #000;
    display: grid;
    grid: repeat(4, 5em) / repeat(3, 8em);
}
```



