
# Начало карточки

<!-- basicblock-start oid="ObsYJFqAlV1wkrAG9G0pX1fb"  deck='0_Pd_CSSHtML6_properties' -->
Блочная верстка. Часть 2::


В прошлой теме было рассмотрено создание страницы с двумя колонками. Подобным образом мы можем добавить на страницу и большее количество колонок и сделать более сложную структуру. Например, добавим на веб-страницу второй сайдбар:

https://codepen.io/sedoydt/pen/MWMjNXV

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Блочная верстка в HTML5</title>
        <style>
            div{
                margin: 10px;
                border: 1px solid black;
                font-size: 20px;
                height: 80px;
            }
            #header{ 
                background-color: #ccc;
            }
            #leftSidebar{
                background-color: #ddd;
            }
            #rightSidebar{
                background-color: #bbb;
            }
            #main{
                background-color: #eee;
                height: 200px;
            }
            #footer{ 
                background-color: #ccc;
            }
        </style>
    </head>
    <body>
        <div id="header">Шапка сайта</div>
        <div id="leftSidebar">Левый сайдбар</div>
        <div id="rightSidebar">Правый сайдбар</div>
        <div id="main">Основное содержимое</div>
        <div id="footer">Футер</div>
    </body>
</html>

```

Здесь опять же код обоих сайдбаров должен идти до блока с основным содержимым, который обтекает их.

Теперь изменим стили обоих сайдбаров и основного блока

```

#leftSidebar{
    background-color: #ddd;
    float: left;
    width: 150px;
}
#rightSidebar{
    background-color: #bbb;
    float: right;
    width: 150px;
}
#main{
    background-color: #eee;
    height: 200px;
    margin-left: 170px;
    margin-right: 170px;
}

```

Здесь опять же код обоих сайдбаров должен идти до блока с основным содержимым, который обтекает их.

Теперь изменим стили обоих сайдбаров и основного блока:
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Блочная верстка. Часть 2

В прошлой теме было рассмотрено создание страницы с двумя колонками. Подобным образом мы можем добавить на страницу и большее количество колонок и сделать более сложную структуру. Например, добавим на веб-страницу второй сайдбар:

https://codepen.io/sedoydt/pen/MWMjNXV

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Блочная верстка в HTML5</title>
        <style>
            div{
                margin: 10px;
                border: 1px solid black;
                font-size: 20px;
                height: 80px;
            }
            #header{ 
                background-color: #ccc;
            }
            #leftSidebar{
                background-color: #ddd;
            }
            #rightSidebar{
                background-color: #bbb;
            }
            #main{
                background-color: #eee;
                height: 200px;
            }
            #footer{ 
                background-color: #ccc;
            }
        </style>
    </head>
    <body>
        <div id="header">Шапка сайта</div>
        <div id="leftSidebar">Левый сайдбар</div>
        <div id="rightSidebar">Правый сайдбар</div>
        <div id="main">Основное содержимое</div>
        <div id="footer">Футер</div>
    </body>
</html>

```

Здесь опять же код обоих сайдбаров должен идти до блока с основным содержимым, который обтекает их.

Теперь изменим стили обоих сайдбаров и основного блока

```

#leftSidebar{
    background-color: #ddd;
    float: left;
    width: 150px;
}
#rightSidebar{
    background-color: #bbb;
    float: right;
    width: 150px;
}
#main{
    background-color: #eee;
    height: 200px;
    margin-left: 170px;
    margin-right: 170px;
}

```

Здесь опять же код обоих сайдбаров должен идти до блока с основным содержимым, который обтекает их.

Теперь изменим стили обоих сайдбаров и основного блока:



