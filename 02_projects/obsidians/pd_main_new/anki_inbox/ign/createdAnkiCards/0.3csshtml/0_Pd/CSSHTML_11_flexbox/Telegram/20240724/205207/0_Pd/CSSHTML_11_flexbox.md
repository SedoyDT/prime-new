
# Начало карточки

<!-- basicblock-start oid="Obsowx3QoAza0Jy5ipargf11"  deck='0_Pd_CSSHTML_11_flexbox' -->
Что делает свойство flex-grow?::


Свойство flex-grow управляет расширением элементов, если во flex-контейнере есть дополнительное место. Данное свойство во многом похоже на свойство flex-shrink за тем исключением, что работает в сторону увеличения элементов.

https://codepen.io/pen/?editors=1010

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
            }
            .flex-item {
                text-align:center;
                font-size: 1em;
                padding: 1.3em;
                color: white;
            }
            .item1 {background-color: #675BA7; flex-grow:0;}
            .item2 {background-color: #9BC850; flex-grow:1;}
            .item3 {background-color: #A62E5C; flex-grow:2;}
        </style>
    </head>
    <body>
        <div class="flex-container">
            <div class="flex-item item1">Flex Item 1</div>
            <div class="flex-item item2">Flex Item 2</div>
            <div class="flex-item item3">Flex Item 3</div>
        </div>
</html>

```

Итак, для каждого элемента есть базовые начальные размеры. Здесь явным образом размеры для элементов не указаны, поэтому размер каждого элемента в данном случае будет складываться из размеров внутреннего содержимого, к которым добавляются внутренние отступы.

По мере растягивания контейнера будут увеличиваться элементы в соответствии со свойством flex-grow, которое указано для каждого элемента. Пространство, на которое растягивается контейнер, считается дополнительным пространством.
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что делает свойство flex-grow?

Свойство flex-grow управляет расширением элементов, если во flex-контейнере есть дополнительное место. Данное свойство во многом похоже на свойство flex-shrink за тем исключением, что работает в сторону увеличения элементов.

https://codepen.io/pen/?editors=1010

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
            }
            .flex-item {
                text-align:center;
                font-size: 1em;
                padding: 1.3em;
                color: white;
            }
            .item1 {background-color: #675BA7; flex-grow:0;}
            .item2 {background-color: #9BC850; flex-grow:1;}
            .item3 {background-color: #A62E5C; flex-grow:2;}
        </style>
    </head>
    <body>
        <div class="flex-container">
            <div class="flex-item item1">Flex Item 1</div>
            <div class="flex-item item2">Flex Item 2</div>
            <div class="flex-item item3">Flex Item 3</div>
        </div>
</html>

```

Итак, для каждого элемента есть базовые начальные размеры. Здесь явным образом размеры для элементов не указаны, поэтому размер каждого элемента в данном случае будет складываться из размеров внутреннего содержимого, к которым добавляются внутренние отступы.

По мере растягивания контейнера будут увеличиваться элементы в соответствии со свойством flex-grow, которое указано для каждого элемента. Пространство, на которое растягивается контейнер, считается дополнительным пространством.



