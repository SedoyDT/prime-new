
# Начало карточки

<!-- basicblock-start oid="Obsruzin0GPmSYlABx1M559R"  deck='0_Pd_CSSHtML6_properties' -->
inline и inline-block::


Для создания горизонтальной панели навигации нам надо сделать каждый элемент li строчным, то есть установить для него display: inline. После этого для элемента ссылки, которая располагается в элементе li, мы можем установить display: inline-block:

https://codepen.io/sedoydt/pen/vYqXowN

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Панель навигации в HTML5</title>
        <style>
            ul.nav{
                margin-left: 0px;
                padding-left: 0px;
                list-style: none;
            }
            .nav li { 
                display: inline; 
            }
            ul.nav a {
                display: inline-block;
                width: 5em;
                padding:10px;
                background-color: #f4f4f4;
                border: 1px dashed #333;
                text-decoration: none;
                color: #333;
                text-align: center;
            }
            ul.nav a:hover{
                background-color: #333;
                color: #f4f4f4;
            }
        </style>
    </head>
    <body>
        <ul class="nav">
            <li><a href="#">Главная</a></li>
            <li><a href="#">Блог</a></li>
            <li><a href="#">Контакты</a></li>
            <li><a href="#">О сайте</a></li>
        </ul>
    </body>
</html>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

inline и inline-block

Для создания горизонтальной панели навигации нам надо сделать каждый элемент li строчным, то есть установить для него display: inline. После этого для элемента ссылки, которая располагается в элементе li, мы можем установить display: inline-block:

https://codepen.io/sedoydt/pen/vYqXowN

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Панель навигации в HTML5</title>
        <style>
            ul.nav{
                margin-left: 0px;
                padding-left: 0px;
                list-style: none;
            }
            .nav li { 
                display: inline; 
            }
            ul.nav a {
                display: inline-block;
                width: 5em;
                padding:10px;
                background-color: #f4f4f4;
                border: 1px dashed #333;
                text-decoration: none;
                color: #333;
                text-align: center;
            }
            ul.nav a:hover{
                background-color: #333;
                color: #f4f4f4;
            }
        </style>
    </head>
    <body>
        <ul class="nav">
            <li><a href="#">Главная</a></li>
            <li><a href="#">Блог</a></li>
            <li><a href="#">Контакты</a></li>
            <li><a href="#">О сайте</a></li>
        </ul>
    </body>
</html>
```



