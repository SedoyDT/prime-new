
# Начало карточки

<!-- basicblock-start oid="ObsEeiamzs8gghvBjTMn4wcD"  deck='0_Pd_php_docs_exception_10' -->
Пример #6 Обработка нескольких исключений в одном блоке catch::


```


<?php

class MyException extends Exception { }

class MyOtherException extends Exception { }

class Test {
    public function testing() {
        try {
            throw new MyException();
        } catch (MyException | MyOtherException $e) {
            var_dump(get_class($e));
        }
    }
}

$foo = new Test;
$foo->testing();

?>
```


 Результат выполнения приведённого примера: 

```

string(11) "MyException"
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #6 Обработка нескольких исключений в одном блоке catch

```


<?php

class MyException extends Exception { }

class MyOtherException extends Exception { }

class Test {
    public function testing() {
        try {
            throw new MyException();
        } catch (MyException | MyOtherException $e) {
            var_dump(get_class($e));
        }
    }
}

$foo = new Test;
$foo->testing();

?>
```


 Результат выполнения приведённого примера: 

```

string(11) "MyException"
```




# Начало карточки

<!-- basicblock-start oid="ObsxktEQyLDFIdbQbK9OEOzO"  deck='0_Pd_php_docs_exception_10' -->
Пример #5 Вложенные исключения::


```

<?php

class MyException extends Exception { }

class Test {
    public function testing() {
        try {
            try {
                throw new MyException('foo!');
            } catch (MyException $e) {
                // Повторный выброс исключения
                throw $e;
            }
        } catch (Exception $e) {
            var_dump($e->getMessage());
        }
    }
}

$foo = new Test;
$foo->testing();

?>
```


 Результат выполнения приведённого примера: 

```

string(4) "foo!"
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #5 Вложенные исключения

```

<?php

class MyException extends Exception { }

class Test {
    public function testing() {
        try {
            try {
                throw new MyException('foo!');
            } catch (MyException $e) {
                // Повторный выброс исключения
                throw $e;
            }
        } catch (Exception $e) {
            var_dump($e->getMessage());
        }
    }
}

$foo = new Test;
$foo->testing();

?>
```


 Результат выполнения приведённого примера: 

```

string(4) "foo!"
```



