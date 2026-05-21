
# Начало карточки

<!-- basicblock-start oid="ObsO6ssPpj7rJyTAHLsLsXVg"  deck='0_Pd_CSSHTML_5_styles' -->
background-clip::


Свойство background-clip определяет, какая часть изображения используется для фона. Он принимает те же значения:

    border-box: изображение обрезается по границам элемента

    padding-box: из изображения исключается та часть, которая находится под границами элемента

    content-box: изображение обрезается по содержимому с учетом внутренних отступов

Например, если к предыдущей разметке мы применим следующие стили:

```

div{
    width: 200px;
    height: 200px;
    margin: 10px;
    display: inline-block;
             
    color: #eee;
    padding:15px;
    border: 15px solid rgba(23,23,23,0.1);
             
    background-image: url(cats.jpg);
    background-size: cover;
    background-repeat: no-repeat;
}
.borderBox{background-clip: border-box;}
.paddingBox{background-clip: padding-box;}
.contentBox{background-clip: content-box;}
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

background-clip

Свойство background-clip определяет, какая часть изображения используется для фона. Он принимает те же значения:

    border-box: изображение обрезается по границам элемента

    padding-box: из изображения исключается та часть, которая находится под границами элемента

    content-box: изображение обрезается по содержимому с учетом внутренних отступов

Например, если к предыдущей разметке мы применим следующие стили:

```

div{
    width: 200px;
    height: 200px;
    margin: 10px;
    display: inline-block;
             
    color: #eee;
    padding:15px;
    border: 15px solid rgba(23,23,23,0.1);
             
    background-image: url(cats.jpg);
    background-size: cover;
    background-repeat: no-repeat;
}
.borderBox{background-clip: border-box;}
.paddingBox{background-clip: padding-box;}
.contentBox{background-clip: content-box;}
```



