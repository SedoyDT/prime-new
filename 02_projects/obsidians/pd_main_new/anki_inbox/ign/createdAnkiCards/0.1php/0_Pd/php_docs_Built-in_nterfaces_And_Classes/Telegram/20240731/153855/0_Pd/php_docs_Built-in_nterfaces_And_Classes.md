
# Начало карточки

<!-- basicblock-start oid="ObsEI23TI1pCYGIOITgorgLx"  deck='0_Pd_php_docs_Built-in_nterfaces_And_Classes' -->
Что можно сказать про интерфейс countable?::


 Классы, которые реализуют интерфейс Countable, можно использовать с функцией count(). 

```

 interface Countable {
/* Методы */
public count(): int
}
```


Countable::count — Количество элементов объекта

Пример #1 Пример использования Countable::count()

```


<?php
class myCounter implements Countable {
    private $count = 0;
    public function count() {
        return ++$this->count;
    }
}

$counter = new myCounter;

for($i=0; $i<10; ++$i) {
    echo "Я посчитан " . count($counter) . " раз\n";
}
?>

```

```

Я посчитан 1 раз
Я посчитан 2 раз
Я посчитан 3 раз
Я посчитан 4 раз
Я посчитан 5 раз
Я посчитан 6 раз
Я посчитан 7 раз
Я посчитан 8 раз
Я посчитан 9 раз
Я посчитан 10 раз
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что можно сказать про интерфейс countable?

 Классы, которые реализуют интерфейс Countable, можно использовать с функцией count(). 

```

 interface Countable {
/* Методы */
public count(): int
}
```


Countable::count — Количество элементов объекта

Пример #1 Пример использования Countable::count()

```


<?php
class myCounter implements Countable {
    private $count = 0;
    public function count() {
        return ++$this->count;
    }
}

$counter = new myCounter;

for($i=0; $i<10; ++$i) {
    echo "Я посчитан " . count($counter) . " раз\n";
}
?>

```

```

Я посчитан 1 раз
Я посчитан 2 раз
Я посчитан 3 раз
Я посчитан 4 раз
Я посчитан 5 раз
Я посчитан 6 раз
Я посчитан 7 раз
Я посчитан 8 раз
Я посчитан 9 раз
Я посчитан 10 раз
```



