
# Начало карточки

<!-- basicblock-start oid="ObsLmcxt0IFqxE726QwDvnc9"  deck='0_Pd_php_docs_classes_and_objects_7' -->
Что такое ковариантность?::


 Чтобы проиллюстрировать, как работает ковариантность, создадим простой абстрактный родительский класс Animal. Animal будет расширен за счёт дочерних классов Cat и Dog. 

```

interface AnimalShelter
{
    public function adopt(string $name): Animal;
}

class CatShelter implements AnimalShelter
{
    public function adopt(string $name): Cat // Возвращаем класс Cat вместо Animal
    {
        return new Cat($name);
    }
}

class DogShelter implements AnimalShelter
{
    public function adopt(string $name): Dog // Возвращаем класс Dog вместо Animal
    {
        return new Dog($name);
    }
}

$kitty = (new CatShelter)->adopt("Рыжик");
$kitty->speak();
echo "\n";

$doggy = (new DogShelter)->adopt("Бобик");
$doggy->speak();
```


 Результат выполнения приведённого примера: 

```

Рыжик мяукает
Бобик лает
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что такое ковариантность?

 Чтобы проиллюстрировать, как работает ковариантность, создадим простой абстрактный родительский класс Animal. Animal будет расширен за счёт дочерних классов Cat и Dog. 

```

interface AnimalShelter
{
    public function adopt(string $name): Animal;
}

class CatShelter implements AnimalShelter
{
    public function adopt(string $name): Cat // Возвращаем класс Cat вместо Animal
    {
        return new Cat($name);
    }
}

class DogShelter implements AnimalShelter
{
    public function adopt(string $name): Dog // Возвращаем класс Dog вместо Animal
    {
        return new Dog($name);
    }
}

$kitty = (new CatShelter)->adopt("Рыжик");
$kitty->speak();
echo "\n";

$doggy = (new DogShelter)->adopt("Бобик");
$doggy->speak();
```


 Результат выполнения приведённого примера: 

```

Рыжик мяукает
Бобик лает
```



