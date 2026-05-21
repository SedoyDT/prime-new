
# Начало карточки

<!-- basicblock-start oid="ObsaEETZcZBPhd13i6VWdIjp"  deck='0_Pd_php_docs_Built-in_nterfaces_And_Classes' -->
Пример #1 Базовый пример реализации интерфейса serializable?::


```


<?php

class obj implements Serializable
{
    private $data;

    public function __construct()
    {
        $this->data = "Мои закрытые данные";
    }

    public function serialize()
    {
        return serialize($this->data);
    }

    public function unserialize($data)
    {
        $this->data = unserialize($data);
    }

    public function getData()
    {
        return $this->data;
    }
}

$obj = new obj();
$ser = serialize($obj);

var_dump($ser);

$newobj = unserialize($ser);

var_dump($newobj->getData());

?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #1 Базовый пример реализации интерфейса serializable?

```


<?php

class obj implements Serializable
{
    private $data;

    public function __construct()
    {
        $this->data = "Мои закрытые данные";
    }

    public function serialize()
    {
        return serialize($this->data);
    }

    public function unserialize($data)
    {
        $this->data = unserialize($data);
    }

    public function getData()
    {
        return $this->data;
    }
}

$obj = new obj();
$ser = serialize($obj);

var_dump($ser);

$newobj = unserialize($ser);

var_dump($newobj->getData());

?>
```



