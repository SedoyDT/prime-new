
# Начало карточки

<!-- basicblock-start oid="ObsLf9ScPvx9tHzTJb171uaX"  deck='0_Pd_php_docs_Built-in_nterfaces_And_Classes' -->
Интерфейс SeekableIterator ¶::


```

 interface SeekableIterator extends Iterator {
/* Методы */
public seek(int $offset): void
/* Наследуемые методы */
public Iterator::current(): mixed
public Iterator::key(): mixed
public Iterator::next(): void
public Iterator::rewind(): void
public Iterator::valid(): bool
}
```


Пример #1 Простое использование

Этот пример показывает как создаётся пользовательский итератор SeekableIterator, который ищет и обрабатывает недопустимую позицию.


```


<?php

class MySeekableIterator implements SeekableIterator
{
    private $position;

    private $array = array(
        "первый элемент",
        "второй элемент",
        "третий элемент",
        "четвёртый элемент"
    );

    /* Метод, который требует интерфейс SeekableIterator */

    public function seek($position)
    {
      if (!isset($this->array[$position])) {
          throw new OutOfBoundsException("Недопустимая позиция ($position)");
      }

      $this->position = $position;
    }

    /*  Методы, которые требует интерфейс Iterator */

    public function rewind()
    {
        $this->position = 0;
    }

    public function current()
    {
        return $this->array[$this->position];
    }

    public function key()
    {
        return $this->position;
    }

    public function next()
    {
        ++$this->position;
    }

    public function valid()
    {
        return isset($this->array[$this->position]);
    }
}

try {
    $it = new MySeekableIterator();
    echo $it->current(), "\n";

    $it->seek(2);
    echo $it->current(), "\n";

    $it->seek(1);
    echo $it->current(), "\n";

    $it->seek(10);
} catch (OutOfBoundsException $e) {
    echo $e->getMessage();
}

?>

```

 Вывод приведённого примера будет похож на: 

```

первый элемент
третий элемент
второй элемент
Недопустимая позиция (10)
```
[SeekableIterator::seek](https://www.php.net/manual/ru/seekableiterator.seek.php) — Перемещается к позиции

<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Интерфейс SeekableIterator ¶

```

 interface SeekableIterator extends Iterator {
/* Методы */
public seek(int $offset): void
/* Наследуемые методы */
public Iterator::current(): mixed
public Iterator::key(): mixed
public Iterator::next(): void
public Iterator::rewind(): void
public Iterator::valid(): bool
}
```


Пример #1 Простое использование

Этот пример показывает как создаётся пользовательский итератор SeekableIterator, который ищет и обрабатывает недопустимую позицию.


```


<?php

class MySeekableIterator implements SeekableIterator
{
    private $position;

    private $array = array(
        "первый элемент",
        "второй элемент",
        "третий элемент",
        "четвёртый элемент"
    );

    /* Метод, который требует интерфейс SeekableIterator */

    public function seek($position)
    {
      if (!isset($this->array[$position])) {
          throw new OutOfBoundsException("Недопустимая позиция ($position)");
      }

      $this->position = $position;
    }

    /*  Методы, которые требует интерфейс Iterator */

    public function rewind()
    {
        $this->position = 0;
    }

    public function current()
    {
        return $this->array[$this->position];
    }

    public function key()
    {
        return $this->position;
    }

    public function next()
    {
        ++$this->position;
    }

    public function valid()
    {
        return isset($this->array[$this->position]);
    }
}

try {
    $it = new MySeekableIterator();
    echo $it->current(), "\n";

    $it->seek(2);
    echo $it->current(), "\n";

    $it->seek(1);
    echo $it->current(), "\n";

    $it->seek(10);
} catch (OutOfBoundsException $e) {
    echo $e->getMessage();
}

?>

```

 Вывод приведённого примера будет похож на: 

```

первый элемент
третий элемент
второй элемент
Недопустимая позиция (10)
```



