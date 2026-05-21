
# Начало карточки

<!-- basicblock-start oid="ObsjT4hnDAhXnXpqumikESk7"  deck='0_Pd_CSSHTML_5_styles' -->
background-origin::


Свойство background-origin указывает позицию на изображении, с которой будет начинаться собственно фоновое изображение для элемента. Оно может принимать следующие значения:

    border-box: фон у элемента устанавливается начиная с его внешней границы, определяемой свойством border

    padding-box: фон устанавливается с учетом внутренних отступов

    content-box: фон устанавливается по содержимому элемента

Используем все три значения:

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Блочная модель в CSS3</title>
        <style>
        div{
            width: 200px;
            height: 200px;
            margin: 10px;
            display: inline-block;  /* располагаем блоки в ряд */
            color: #eee;
             
            padding:15px;
            border: 15px solid rgba(23,23,23,0.2);
             
            background-image: url(cats.jpg);
            background-size: cover;
            background-repeat: no-repeat;
        }
        .borderBox {background-origin: border-box;}
        .paddingBox {background-origin: padding-box;}
        .contentBox {background-origin: content-box;}
        </style>
    </head>
    <body>
        <div class="borderBox">
            Вся власть - котикам!
        </div>
        <div class="paddingBox">
            Вся власть - котикам!
        </div>
        <div  class="contentBox">
            Вся власть - котикам!
        </div>
    </body>
</html>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

background-origin

Свойство background-origin указывает позицию на изображении, с которой будет начинаться собственно фоновое изображение для элемента. Оно может принимать следующие значения:

    border-box: фон у элемента устанавливается начиная с его внешней границы, определяемой свойством border

    padding-box: фон устанавливается с учетом внутренних отступов

    content-box: фон устанавливается по содержимому элемента

Используем все три значения:

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Блочная модель в CSS3</title>
        <style>
        div{
            width: 200px;
            height: 200px;
            margin: 10px;
            display: inline-block;  /* располагаем блоки в ряд */
            color: #eee;
             
            padding:15px;
            border: 15px solid rgba(23,23,23,0.2);
             
            background-image: url(cats.jpg);
            background-size: cover;
            background-repeat: no-repeat;
        }
        .borderBox {background-origin: border-box;}
        .paddingBox {background-origin: padding-box;}
        .contentBox {background-origin: content-box;}
        </style>
    </head>
    <body>
        <div class="borderBox">
            Вся власть - котикам!
        </div>
        <div class="paddingBox">
            Вся власть - котикам!
        </div>
        <div  class="contentBox">
            Вся власть - котикам!
        </div>
    </body>
</html>
```



