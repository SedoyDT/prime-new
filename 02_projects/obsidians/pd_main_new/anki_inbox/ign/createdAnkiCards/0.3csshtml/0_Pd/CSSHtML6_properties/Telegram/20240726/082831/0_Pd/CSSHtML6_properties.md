
# Начало карточки

<!-- basicblock-start oid="Obs1n1BQD34L9gW1rWsqKHYl"  deck='0_Pd_CSSHtML6_properties' -->
Пустые ячейки::


Свойство empty-cells позволяет стилизовать пустые ячейки с помощью одного из следующих значений:

    show: пустые ячейки отображаются, значение по умолчанию

    hide: пустые ячейки не отображаются

https://codepen.io/sedoydt/pen/zYVKgxp

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Стилизаци таблиц в CSS3</title>
        <style>
        table {
            border: 1px solid #ccc;
            border-spacing: 3px;
        }
         
        td, th{
            border: solid 1px #ccc;
        }
        .hidden-empty-cells{
            empty-cells: hide;
        }
        </style>
    </head>
    <body>
        <h3>Show</h3>
        <table>
            <tr><th>Модель</th><th>Производитель</th><th>Цена</th></tr>
            <tr><td>Lumia 950</td><td>Microsoft</td><td>29900</td></tr>
            <tr><td>iPhone 6S</td><td></td><td></td></tr>
            <tr><td>Nexus 6P</td><td>Huawei</td><td>49000</td></tr>
        </table>
        <h3>Hide</h3>
        <table class="hidden-empty-cells">
            <tr><th>Модель</th><th>Производитель</th><th>Цена</th></tr>
            <tr><td>G 5</td><td>LG</td><td>44900</td></tr>
            <tr><td>HTC 10</td><td></td><td></td></tr>
            <tr><td>Nexus 5X</td><td>Google/LG</td><td>25000</td></tr>
        </table>
    </body>
</html>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пустые ячейки

Свойство empty-cells позволяет стилизовать пустые ячейки с помощью одного из следующих значений:

    show: пустые ячейки отображаются, значение по умолчанию

    hide: пустые ячейки не отображаются

https://codepen.io/sedoydt/pen/zYVKgxp

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Стилизаци таблиц в CSS3</title>
        <style>
        table {
            border: 1px solid #ccc;
            border-spacing: 3px;
        }
         
        td, th{
            border: solid 1px #ccc;
        }
        .hidden-empty-cells{
            empty-cells: hide;
        }
        </style>
    </head>
    <body>
        <h3>Show</h3>
        <table>
            <tr><th>Модель</th><th>Производитель</th><th>Цена</th></tr>
            <tr><td>Lumia 950</td><td>Microsoft</td><td>29900</td></tr>
            <tr><td>iPhone 6S</td><td></td><td></td></tr>
            <tr><td>Nexus 6P</td><td>Huawei</td><td>49000</td></tr>
        </table>
        <h3>Hide</h3>
        <table class="hidden-empty-cells">
            <tr><th>Модель</th><th>Производитель</th><th>Цена</th></tr>
            <tr><td>G 5</td><td>LG</td><td>44900</td></tr>
            <tr><td>HTC 10</td><td></td><td></td></tr>
            <tr><td>Nexus 5X</td><td>Google/LG</td><td>25000</td></tr>
        </table>
    </body>
</html>
```



