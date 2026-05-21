
# Начало карточки

<!-- basicblock-start oid="ObsGgOHbJ28XjiuYG3GG9UX6"  deck='0_Pd_CSSHTML_5_styles' -->
Вертикальное выравнивание ячеек::


Как правило, содержимое ячеек таблицы выравнивается по центру ячейки. Но с помощью свойства vertical-align это поведение можно переопределить. Это свойство принимает следующие значения:

https://codepen.io/sedoydt/pen/yLdaGpp?editors=1010

    top: выравнивание содержимого по верху ячейки

    baseline: выравнивание первой строки текста по верху ячейки

    middle: выравнивание по центру (значение по умолчанию)

    bottom: выравнивание по низу

Свойство vertical-align применяется только к элементам <th> и <td>😂️️
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
    table-layout: fixed;
    width:350px; 
}
         
        caption {
         
            font-weight: bold;
        }
         
          td, th{
            border: solid 1px #ccc;
            vertical-align: top;
            height: 30px;
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
            <tr><td>Nexus 6P</td><td>Huawei</td><td>4900049000490004900049000</td></tr>
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

Вертикальное выравнивание ячеек

Как правило, содержимое ячеек таблицы выравнивается по центру ячейки. Но с помощью свойства vertical-align это поведение можно переопределить. Это свойство принимает следующие значения:

https://codepen.io/sedoydt/pen/yLdaGpp?editors=1010

    top: выравнивание содержимого по верху ячейки

    baseline: выравнивание первой строки текста по верху ячейки

    middle: выравнивание по центру (значение по умолчанию)

    bottom: выравнивание по низу

Свойство vertical-align применяется только к элементам <th> и <td>😂️️
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
    table-layout: fixed;
    width:350px; 
}
         
        caption {
         
            font-weight: bold;
        }
         
          td, th{
            border: solid 1px #ccc;
            vertical-align: top;
            height: 30px;
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
            <tr><td>Nexus 6P</td><td>Huawei</td><td>4900049000490004900049000</td></tr>
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



