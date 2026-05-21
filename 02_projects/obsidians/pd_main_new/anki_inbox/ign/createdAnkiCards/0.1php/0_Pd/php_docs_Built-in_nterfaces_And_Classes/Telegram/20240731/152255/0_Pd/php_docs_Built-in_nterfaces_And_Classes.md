
# Начало карточки

<!-- basicblock-start oid="ObsZL00aRxZnSBlDSJ4KyAW1"  deck='0_Pd_php_docs_Built-in_nterfaces_And_Classes' -->
Обзор класса closure::


```

 final class Closure {
/* Методы */
private __construct()
public static bind(Closure $closure, ?object $newThis, object|string|null $newScope = "static"): ?Closure
public bindTo(?object $newThis, object|string|null $newScope = "static"): ?Closure
public call(object $newThis, mixed ...$args): mixed
public static fromCallable(callable $callback): Closure
}

```

    Closure::__construct — Конструктор, запрещающий создание экземпляра
    Closure::bind — Дублирует замыкание с указанием конкретного связанного объекта и области видимости класса
    Closure::bindTo — Дублирует замыкание с новым связанным объектом и областью видимости класса
    Closure::call — Связывает и запускает замыкание
    Closure::fromCallable — Конвертирует callable в замыкание
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Обзор класса closure

```

 final class Closure {
/* Методы */
private __construct()
public static bind(Closure $closure, ?object $newThis, object|string|null $newScope = "static"): ?Closure
public bindTo(?object $newThis, object|string|null $newScope = "static"): ?Closure
public call(object $newThis, mixed ...$args): mixed
public static fromCallable(callable $callback): Closure
}

```

    Closure::__construct — Конструктор, запрещающий создание экземпляра
    Closure::bind — Дублирует замыкание с указанием конкретного связанного объекта и области видимости класса
    Closure::bindTo — Дублирует замыкание с новым связанным объектом и областью видимости класса
    Closure::call — Связывает и запускает замыкание
    Closure::fromCallable — Конвертирует callable в замыкание



