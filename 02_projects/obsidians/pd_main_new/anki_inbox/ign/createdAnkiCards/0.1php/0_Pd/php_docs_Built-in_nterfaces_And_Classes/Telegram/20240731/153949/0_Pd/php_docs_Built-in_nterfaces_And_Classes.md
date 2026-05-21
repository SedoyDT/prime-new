
# Начало карточки

<!-- basicblock-start oid="ObsWQCppywwZ3gEfgKB6Rl06"  deck='0_Pd_php_docs_Built-in_nterfaces_And_Classes' -->
Классы, реализующие OuterIterator::


 Классы, реализующие OuterIterator, могут быть использованы для перебора итераторов. 

```

 interface OuterIterator extends Iterator {
/* Методы */
public getInnerIterator(): ?Iterator
/* Наследуемые методы */
public Iterator::current(): mixed
public Iterator::key(): mixed
public Iterator::next(): void
public Iterator::rewind(): void
public Iterator::valid(): bool
}

```

OuterIterator::getInnerIterator — Возвращает внутренний итератор для текущего элемента
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Классы, реализующие OuterIterator

 Классы, реализующие OuterIterator, могут быть использованы для перебора итераторов. 

```

 interface OuterIterator extends Iterator {
/* Методы */
public getInnerIterator(): ?Iterator
/* Наследуемые методы */
public Iterator::current(): mixed
public Iterator::key(): mixed
public Iterator::next(): void
public Iterator::rewind(): void
public Iterator::valid(): bool
}

```

OuterIterator::getInnerIterator — Возвращает внутренний итератор для текущего элемента



