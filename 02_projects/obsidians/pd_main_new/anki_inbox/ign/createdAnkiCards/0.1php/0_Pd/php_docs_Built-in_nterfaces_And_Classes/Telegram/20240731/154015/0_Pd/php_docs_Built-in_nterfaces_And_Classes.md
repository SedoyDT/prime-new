
# Начало карточки

<!-- basicblock-start oid="Obs5jjqlUbmAKSR2cB4z08iN"  deck='0_Pd_php_docs_Built-in_nterfaces_And_Classes' -->
Классы, которые реализуют интерфейс RecursiveIterator, умеют ::


 Классы, которые реализуют интерфейс RecursiveIterator, умеют рекурсивно перебирать итераторы. 

```

 interface RecursiveIterator extends Iterator {
/* Методы */
public getChildren(): ?RecursiveIterator
public hasChildren(): bool
/* Наследуемые методы */
public Iterator::current(): mixed
public Iterator::key(): mixed
public Iterator::next(): void
public Iterator::rewind(): void
public Iterator::valid(): bool
}

```

    RecursiveIterator::getChildren — Возвращает итератор для текущего элемента
    RecursiveIterator::hasChildren — Определяет, можно ли для текущего элемента создать итератор
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Классы, которые реализуют интерфейс RecursiveIterator, умеют 

 Классы, которые реализуют интерфейс RecursiveIterator, умеют рекурсивно перебирать итераторы. 

```

 interface RecursiveIterator extends Iterator {
/* Методы */
public getChildren(): ?RecursiveIterator
public hasChildren(): bool
/* Наследуемые методы */
public Iterator::current(): mixed
public Iterator::key(): mixed
public Iterator::next(): void
public Iterator::rewind(): void
public Iterator::valid(): bool
}

```

    RecursiveIterator::getChildren — Возвращает итератор для текущего элемента
    RecursiveIterator::hasChildren — Определяет, можно ли для текущего элемента создать итератор



