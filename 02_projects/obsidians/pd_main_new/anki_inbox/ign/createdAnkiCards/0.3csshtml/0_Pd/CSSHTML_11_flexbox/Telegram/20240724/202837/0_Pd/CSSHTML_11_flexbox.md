
# Начало карточки

<!-- basicblock-start oid="ObsBU4jvZmVRVBpoAQGJIMgT"  deck='0_Pd_CSSHTML_11_flexbox' -->
Свойство flex-basis определяет начальный размер flex-элемента до того, как он начнет изменять размер, подстраиваясь под размеры flex-контейнера.::


https://codepen.io/sedoydt/pen/yLdaVjd?editors=1100

Это свойство может принимать следующие значения:

    auto: начальный размер flex-элемента устанавливается автоматически

    content: размер flex-элемента определяется по его содержимому, в то же время это значение поддерживается не всеми современными браузерами, поэтому его пока стоит избегать

    числовое значение: мы можем установить конкретное числовое значение для размеров элемента

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
                padding: 1.2em;
                color: white;
            }
            .item1 {background-color: #675BA7; flex-basis: auto; width:150px;}
            .item2 {background-color: #9BC850; flex-basis: auto; width:auto;}
            .item3 {background-color: #A62E5C; flex-basis: 200px;width:150px;}
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

У первого элемента у свойства flex-basis установлено значение auto. Поэтому первый элемент в качестве реального значения для ширины будет использовать значение свойства width.

У второго элемента у свойства flex-basis установлено значение auto, однако и свойство width имеет значение auto. Поэтому реальная ширина элемента будет устанавливаться по его содержимому.

У третьего элемента свойство flex-basis имеет конкретное значение, которое и используется. А свойство width в этом случае уже не играет никакой роли.
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Свойство flex-basis определяет начальный размер flex-элемента до того, как он начнет изменять размер, подстраиваясь под размеры flex-контейнера.

https://codepen.io/sedoydt/pen/yLdaVjd?editors=1100

Это свойство может принимать следующие значения:

    auto: начальный размер flex-элемента устанавливается автоматически

    content: размер flex-элемента определяется по его содержимому, в то же время это значение поддерживается не всеми современными браузерами, поэтому его пока стоит избегать

    числовое значение: мы можем установить конкретное числовое значение для размеров элемента

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
                padding: 1.2em;
                color: white;
            }
            .item1 {background-color: #675BA7; flex-basis: auto; width:150px;}
            .item2 {background-color: #9BC850; flex-basis: auto; width:auto;}
            .item3 {background-color: #A62E5C; flex-basis: 200px;width:150px;}
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

У первого элемента у свойства flex-basis установлено значение auto. Поэтому первый элемент в качестве реального значения для ширины будет использовать значение свойства width.

У второго элемента у свойства flex-basis установлено значение auto, однако и свойство width имеет значение auto. Поэтому реальная ширина элемента будет устанавливаться по его содержимому.

У третьего элемента свойство flex-basis имеет конкретное значение, которое и используется. А свойство width в этом случае уже не играет никакой роли.



