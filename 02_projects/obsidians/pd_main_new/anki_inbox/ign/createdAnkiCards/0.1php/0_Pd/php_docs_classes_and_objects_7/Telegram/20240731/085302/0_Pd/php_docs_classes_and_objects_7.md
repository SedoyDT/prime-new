
# Начало карточки

<!-- basicblock-start oid="ObsMUSkMxRuiyAPbbPZSicsh"  deck='0_Pd_php_docs_classes_and_objects_7' -->
Перегрузка методов Пример #2 Перегрузка методов с помощью методов __call() и __callStatic() ::


```

 public __call(string $name, array $arguments): mixed
```


```

public static __callStatic(string $name, array $arguments): mixed
```


 __call() запускается при вызове недоступных методов в контексте объект.

__callStatic() запускается при вызове недоступных методов в статическом контексте.

Аргумент $name представляет собой имя вызываемого метода. Аргумент $arguments представляет собой нумерованный массив, содержащий параметры, переданные в вызываемый метод $name. 

```


<?php
class MethodTest {
    public function __call($name, $arguments) {
        // Замечание: значение $name регистрозависимо.
        echo "Вызов метода '$name' "
             . implode(', ', $arguments). "\n";
    }

    public static function __callStatic($name, $arguments) {
        // Замечание: значение $name регистрозависимо.
        echo "Вызов статического метода '$name' "
             . implode(', ', $arguments). "\n";
    }
}

$obj = new MethodTest;
$obj->runTest('в контексте объекта');

MethodTest::runTest('в статическом контексте');
?>

```


```

Вызов метода 'runTest' в контексте объекта
Вызов статического метода 'runTest' в статическом контексте
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Перегрузка методов Пример #2 Перегрузка методов с помощью методов __call() и __callStatic() 

```

 public __call(string $name, array $arguments): mixed
```


```

public static __callStatic(string $name, array $arguments): mixed
```


 __call() запускается при вызове недоступных методов в контексте объект.

__callStatic() запускается при вызове недоступных методов в статическом контексте.

Аргумент $name представляет собой имя вызываемого метода. Аргумент $arguments представляет собой нумерованный массив, содержащий параметры, переданные в вызываемый метод $name. 

```


<?php
class MethodTest {
    public function __call($name, $arguments) {
        // Замечание: значение $name регистрозависимо.
        echo "Вызов метода '$name' "
             . implode(', ', $arguments). "\n";
    }

    public static function __callStatic($name, $arguments) {
        // Замечание: значение $name регистрозависимо.
        echo "Вызов статического метода '$name' "
             . implode(', ', $arguments). "\n";
    }
}

$obj = new MethodTest;
$obj->runTest('в контексте объекта');

MethodTest::runTest('в статическом контексте');
?>

```


```

Вызов метода 'runTest' в контексте объекта
Вызов статического метода 'runTest' в статическом контексте
```



