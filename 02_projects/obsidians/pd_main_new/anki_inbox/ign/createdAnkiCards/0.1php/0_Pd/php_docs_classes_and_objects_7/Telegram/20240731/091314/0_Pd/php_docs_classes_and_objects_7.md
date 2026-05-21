
# Начало карточки

<!-- basicblock-start oid="ObsHJBUuxQmvGDs2Jzm8xaU3"  deck='0_Pd_php_docs_classes_and_objects_7' -->
Что можно сказать про сравнение объектов?::


Сравнение объектов ¶

При использовании оператора сравнения (==), свойства объектов просто сравниваются друг с другом, а именно: два объекта равны, если они имеют одинаковые атрибуты и значения (значения сравниваются через ==) и являются экземплярами одного и того же класса.

С другой стороны, при использовании оператора идентичности (===), переменные, содержащие объекты, считаются идентичными только тогда, когда они ссылаются на один и тот же экземпляр одного и того же класса.

Следующий пример пояснит эти правила. 

```


<?php
function bool2str($bool)
{
    return (string) $bool;
}

function compareObjects(&$o1, &$o2)
{
    echo 'o1 == o2 : ' . bool2str($o1 == $o2) . "\n";
    echo 'o1 != o2 : ' . bool2str($o1 != $o2) . "\n";
    echo 'o1 === o2 : ' . bool2str($o1 === $o2) . "\n";
    echo 'o1 !== o2 : ' . bool2str($o1 !== $o2) . "\n";
}

class Flag
{
    public $flag;

    function __construct($flag = true) {
        $this->flag = $flag;
    }
}

class OtherFlag
{
    public $flag;

    function __construct($flag = true) {
        $this->flag = $flag;
    }
}

$o = new Flag();
$p = new Flag();
$q = $o;
$r = new OtherFlag();

echo "Два экземпляра одного и того же класса\n";
compareObjects($o, $p);

echo "\nДве ссылки на один и тот же экземпляр\n";
compareObjects($o, $q);

echo "\nЭкземпляры двух разных классов\n";
compareObjects($o, $r);
?>

```


```

Два экземпляра одного и того же класса
o1 == o2 : TRUE
o1 != o2 : FALSE
o1 === o2 : FALSE
o1 !== o2 : TRUE

Две ссылки на один и тот же экземпляр
o1 == o2 : TRUE
o1 != o2 : FALSE
o1 === o2 : TRUE
o1 !== o2 : FALSE

Экземпляры двух разных классов
o1 == o2 : FALSE
o1 != o2 : TRUE
o1 === o2 : FALSE
o1 !== o2 : TRUE
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что можно сказать про сравнение объектов?

Сравнение объектов ¶

При использовании оператора сравнения (==), свойства объектов просто сравниваются друг с другом, а именно: два объекта равны, если они имеют одинаковые атрибуты и значения (значения сравниваются через ==) и являются экземплярами одного и того же класса.

С другой стороны, при использовании оператора идентичности (===), переменные, содержащие объекты, считаются идентичными только тогда, когда они ссылаются на один и тот же экземпляр одного и того же класса.

Следующий пример пояснит эти правила. 

```


<?php
function bool2str($bool)
{
    return (string) $bool;
}

function compareObjects(&$o1, &$o2)
{
    echo 'o1 == o2 : ' . bool2str($o1 == $o2) . "\n";
    echo 'o1 != o2 : ' . bool2str($o1 != $o2) . "\n";
    echo 'o1 === o2 : ' . bool2str($o1 === $o2) . "\n";
    echo 'o1 !== o2 : ' . bool2str($o1 !== $o2) . "\n";
}

class Flag
{
    public $flag;

    function __construct($flag = true) {
        $this->flag = $flag;
    }
}

class OtherFlag
{
    public $flag;

    function __construct($flag = true) {
        $this->flag = $flag;
    }
}

$o = new Flag();
$p = new Flag();
$q = $o;
$r = new OtherFlag();

echo "Два экземпляра одного и того же класса\n";
compareObjects($o, $p);

echo "\nДве ссылки на один и тот же экземпляр\n";
compareObjects($o, $q);

echo "\nЭкземпляры двух разных классов\n";
compareObjects($o, $r);
?>

```


```

Два экземпляра одного и того же класса
o1 == o2 : TRUE
o1 != o2 : FALSE
o1 === o2 : FALSE
o1 !== o2 : TRUE

Две ссылки на один и тот же экземпляр
o1 == o2 : TRUE
o1 != o2 : FALSE
o1 === o2 : TRUE
o1 !== o2 : FALSE

Экземпляры двух разных классов
o1 == o2 : FALSE
o1 != o2 : TRUE
o1 === o2 : FALSE
o1 !== o2 : TRUE
```



