
# Начало карточки

<!-- basicblock-start oid="Obsr0YzzjboBa6YHaLscDG81"  deck='0_Pd_CSSHTML_11_flexbox' -->
Какое свойство объединяет flex-basis, flex-shrink, flex-grow? ::


flex 
и его синтаксис такой:

flex: [flex-grow], [flex-shrink], [flex-basis]
По умолчанию свойство flex имеет значение 0 1 auto.
Кроме конкретных значений для каждого из подсвойств мы можем задать для свойства flex одно из трех общих значений:


    flex: none: эквивалентно значению 0 0 auto, при котором flex-элемент не растягивается и не усекается при увеличении и уменьшении контейнера
    flex: auto: эквивалентно значению 1 1 auto
    flex: initial: эквивалентно значению 0 1 auto

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Flexbox в CSS3</title>
        <style>
            .flex-container {
                display: flex;
                border:1px #ccc solid;
                width: 600px;
            }
            .flex-item {
                text-align:center;
                font-size: 16px;
                padding: 10px 0;
                color: white;
            }
            .item1 {background-color: #675BA7; width: 150px; flex: 0 0 auto }
            .item2 {background-color: #9BC850; width: 150px; flex: 1 0 auto;}
            .item3 {background-color: #A62E5C; width: 150px; flex: 0 1 auto;}
            .item4 {background-color: #2A9FBC; width: 150px; flex: 1 1 auto;}
        </style>
    </head>
    <body>
        <div class="flex-container">
            <div class="flex-item item1">Flex Item 1</div>
            <div class="flex-item item2">Flex Item 2</div>
            <div class="flex-item item3">Flex Item 3</div>
            <div class="flex-item item4">Flex Item 4</div>
        </div>
</html>

```

Здесь каждый элемент имеет начальную ширину в 150 пикселей, так как у всех элементов свойство flex-basis имеет значение 0, что в целом для всех элементов будет составлять 600 пикселей.

При сжатии контейнера будут уменьшаться 3-й и 4-й элементы, так как у них свойство flex-shrink больше нуля. И так как у обоих элементов это свойство равно 1, то оба элемента будут уменьшаться в равных долях.

При растяжении контейнера будут увеличиваться 2-й и 4-й элементы, так как у этих элементов свойство flex-grow больше нуля. И также, так как это свойство равно 1, то эти элементы будут увеличиваться в равных долях.
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Какое свойство объединяет flex-basis, flex-shrink, flex-grow? 

flex 
и его синтаксис такой:

flex: [flex-grow], [flex-shrink], [flex-basis]
По умолчанию свойство flex имеет значение 0 1 auto.
Кроме конкретных значений для каждого из подсвойств мы можем задать для свойства flex одно из трех общих значений:


    flex: none: эквивалентно значению 0 0 auto, при котором flex-элемент не растягивается и не усекается при увеличении и уменьшении контейнера
    flex: auto: эквивалентно значению 1 1 auto
    flex: initial: эквивалентно значению 0 1 auto

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Flexbox в CSS3</title>
        <style>
            .flex-container {
                display: flex;
                border:1px #ccc solid;
                width: 600px;
            }
            .flex-item {
                text-align:center;
                font-size: 16px;
                padding: 10px 0;
                color: white;
            }
            .item1 {background-color: #675BA7; width: 150px; flex: 0 0 auto }
            .item2 {background-color: #9BC850; width: 150px; flex: 1 0 auto;}
            .item3 {background-color: #A62E5C; width: 150px; flex: 0 1 auto;}
            .item4 {background-color: #2A9FBC; width: 150px; flex: 1 1 auto;}
        </style>
    </head>
    <body>
        <div class="flex-container">
            <div class="flex-item item1">Flex Item 1</div>
            <div class="flex-item item2">Flex Item 2</div>
            <div class="flex-item item3">Flex Item 3</div>
            <div class="flex-item item4">Flex Item 4</div>
        </div>
</html>

```

Здесь каждый элемент имеет начальную ширину в 150 пикселей, так как у всех элементов свойство flex-basis имеет значение 0, что в целом для всех элементов будет составлять 600 пикселей.

При сжатии контейнера будут уменьшаться 3-й и 4-й элементы, так как у них свойство flex-shrink больше нуля. И так как у обоих элементов это свойство равно 1, то оба элемента будут уменьшаться в равных долях.

При растяжении контейнера будут увеличиваться 2-й и 4-й элементы, так как у этих элементов свойство flex-grow больше нуля. И также, так как это свойство равно 1, то эти элементы будут увеличиваться в равных долях.



