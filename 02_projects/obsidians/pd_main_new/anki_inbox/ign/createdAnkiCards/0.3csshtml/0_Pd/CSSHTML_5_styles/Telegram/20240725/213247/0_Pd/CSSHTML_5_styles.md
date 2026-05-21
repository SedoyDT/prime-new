
# Начало карточки

<!-- basicblock-start oid="Obs4xGGSPgbtgGkmSybf3Wdi"  deck='0_Pd_CSSHTML_5_styles' -->
Позиционирование заголовка::

https://codepen.io/sedoydt/pen/rNEMoyd

Свойство caption-side управляет позицией заголовка и может принимать следующие значения:

    top: позиционирование заголовка вверху (значение по умолчанию)

    bottom: позиционирование заголовка внизу


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
         
        caption {
         
            font-weight: bold;
        }
         
        td, th{
            border: solid 1px #ccc;
        }
        .captionBottom{
            caption-side: bottom;
        }
        </style>
    </head>
    <body>
        <h3>Top</h3>
        <table>
            <caption>Флагманы 2015 года</caption>
            <tr><th>Модель</th><th>Производитель</th><th>Цена</th></tr>
            <tr><td>Lumia 950</td><td>Microsoft</td><td>29900</td></tr>
            <tr><td>iPhone 6S</td><td>Apple</td><td>52900</td></tr>
            <tr><td>Nexus 6P</td><td>Huawei</td><td>49000</td></tr>
        </table>
        <h3>Bottom</h3>
        <table class="captionBottom">
            <caption>Новинки 2016 года</caption>
            <tr><th>Модель</th><th>Производитель</th><th>Цена</th></tr>
            <tr><td>G 5</td><td>LG</td><td>44900</td></tr>
            <tr><td>HTC 10</td><td>HTC</td><td>49900</td></tr>
            <tr><td>iPhone SE</td><td>Apple</td><td>37000</td></tr>
        </table>
    </body>
</html>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Позиционирование заголовка

Свойство caption-side управляет позицией заголовка и может принимать следующие значения:

    top: позиционирование заголовка вверху (значение по умолчанию)

    bottom: позиционирование заголовка внизу


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
         
        caption {
         
            font-weight: bold;
        }
         
        td, th{
            border: solid 1px #ccc;
        }
        .captionBottom{
            caption-side: bottom;
        }
        </style>
    </head>
    <body>
        <h3>Top</h3>
        <table>
            <caption>Флагманы 2015 года</caption>
            <tr><th>Модель</th><th>Производитель</th><th>Цена</th></tr>
            <tr><td>Lumia 950</td><td>Microsoft</td><td>29900</td></tr>
            <tr><td>iPhone 6S</td><td>Apple</td><td>52900</td></tr>
            <tr><td>Nexus 6P</td><td>Huawei</td><td>49000</td></tr>
        </table>
        <h3>Bottom</h3>
        <table class="captionBottom">
            <caption>Новинки 2016 года</caption>
            <tr><th>Модель</th><th>Производитель</th><th>Цена</th></tr>
            <tr><td>G 5</td><td>LG</td><td>44900</td></tr>
            <tr><td>HTC 10</td><td>HTC</td><td>49900</td></tr>
            <tr><td>iPhone SE</td><td>Apple</td><td>37000</td></tr>
        </table>
    </body>
</html>
```



