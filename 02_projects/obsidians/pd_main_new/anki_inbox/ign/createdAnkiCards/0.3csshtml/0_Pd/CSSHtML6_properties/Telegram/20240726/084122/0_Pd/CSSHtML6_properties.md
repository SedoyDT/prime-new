
# Начало карточки

<!-- basicblock-start oid="ObsBHSmL9hR3rruUlhKWgi7c"  deck='0_Pd_CSSHtML6_properties' -->
Контуры элементов::


Концепция контуров похожа на использование границ у элементов. Не стоит путать или заменять границы контурами, они имеют разное значение. Контуры полезны тем, что позволяют выделить элемент, чтобы привлечь к нему внимание в какой-то ситуации. Контуры располагаются вне элемента сразу за его границами.

Контур в CSS 3 представлен свойством outline, хотя данное свойство является сокращением следующих свойств:

    outline-color: цвет контура

    outline-offset: смещение контура

    outline-style: стиль контура. Оно принимает те же значения, что и border-style:

        none: контур отсутствует

        solid: контур в виде обычной линии

        dashed: штриховая линия

        dotted: линия в виде последовательности точек

        double: контур в виде двух параллельных линий

    outline-width: толщина контура


```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Контур в CSS3</title>
        <style>
        div{
            width: 128px;
            height: 96px;
            margin: 20px;
            border: 1px solid #ccc;
            background-color: #eee;
            outline-color: red;
            outline-style: dashed;
            outline-width: 2px;
        }
        </style>
    </head>
    <body>
        <div>Контур в CSS3</div>
    </body>
</html>

```

С помощью свойства outline данное определение контура можно сократить следующим образом:

outline: red dashed 2px;
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Контуры элементов

Концепция контуров похожа на использование границ у элементов. Не стоит путать или заменять границы контурами, они имеют разное значение. Контуры полезны тем, что позволяют выделить элемент, чтобы привлечь к нему внимание в какой-то ситуации. Контуры располагаются вне элемента сразу за его границами.

Контур в CSS 3 представлен свойством outline, хотя данное свойство является сокращением следующих свойств:

    outline-color: цвет контура

    outline-offset: смещение контура

    outline-style: стиль контура. Оно принимает те же значения, что и border-style:

        none: контур отсутствует

        solid: контур в виде обычной линии

        dashed: штриховая линия

        dotted: линия в виде последовательности точек

        double: контур в виде двух параллельных линий

    outline-width: толщина контура


```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Контур в CSS3</title>
        <style>
        div{
            width: 128px;
            height: 96px;
            margin: 20px;
            border: 1px solid #ccc;
            background-color: #eee;
            outline-color: red;
            outline-style: dashed;
            outline-width: 2px;
        }
        </style>
    </head>
    <body>
        <div>Контур в CSS3</div>
    </body>
</html>

```

С помощью свойства outline данное определение контура можно сократить следующим образом:

outline: red dashed 2px;



