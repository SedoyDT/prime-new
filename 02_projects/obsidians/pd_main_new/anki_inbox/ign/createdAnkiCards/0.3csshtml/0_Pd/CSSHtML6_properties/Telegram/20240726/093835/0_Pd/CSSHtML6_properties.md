
# Начало карточки

<!-- basicblock-start oid="ObsuWWEElwOO9nnJ2msYvPBb"  deck='0_Pd_CSSHtML6_properties' -->
Выравнивание столбцов по высоте::


При блочной верстке мы можем столкнуться с проблемой высоты с столбцов, которая может особенно сильно проявиться, если плавающие блоки имеют определенный фон. Рассмотрим проблему на примере:
https://codepen.io/sedoydt/pen/poXEMOp

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Блочная верстка в HTML5</title>
        <style>
            body, h2, p{
                margin:0;
                padding:0;
            }
            body{
                font-size: 18px;
            }
            #header{ 
                background-color: #eee;
                border-bottom: 1px solid #ccc;
                height: 80px;
            }
            #wrapper{
                background-color: #ddd;
            }
            #menu{
                float: left;
                width: 150px;
            }
            #main{
                background-color: #f7f7f7;
                border-left: 1px solid #ccc;
                margin-left: 150px;
                padding: 10px;
            }
            #footer{ 
                border-top: 1px solid #ccc;
                background-color: #dedede;
            }
        </style>
    </head>
    <body>
        <div id="header"><h2>Сайт MySyte.com</h2></div>
        <div id="wrapper">
            <div id="menu">
                <ul>
                    <li><a href="#">Главная</a></li>
                    <li><a href="#">Блог</a></li>
                    <li><a href="#">Контакты</a></li>
                    <li><a href="#">О сайте</a></li>
                </ul>
            </div>
            <div id="main">
                <h2>What is Lorem Ipsum?</h2>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum 
                    has been the industry...</p>
            </div>
        </div>
        <div id="footer">
            <p>Copyright © MySyte.com, 2016</p>
        </div>
    </body>
</html>

```

В данном случае плавающий блок menu и обтекающий его блок main обертываются в один элемент wrapper, в котором устанавливается фон для элемента menu. А элемент main, как наибольший элемент, может использовать собственную установку фона.
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Выравнивание столбцов по высоте

При блочной верстке мы можем столкнуться с проблемой высоты с столбцов, которая может особенно сильно проявиться, если плавающие блоки имеют определенный фон. Рассмотрим проблему на примере:
https://codepen.io/sedoydt/pen/poXEMOp

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Блочная верстка в HTML5</title>
        <style>
            body, h2, p{
                margin:0;
                padding:0;
            }
            body{
                font-size: 18px;
            }
            #header{ 
                background-color: #eee;
                border-bottom: 1px solid #ccc;
                height: 80px;
            }
            #wrapper{
                background-color: #ddd;
            }
            #menu{
                float: left;
                width: 150px;
            }
            #main{
                background-color: #f7f7f7;
                border-left: 1px solid #ccc;
                margin-left: 150px;
                padding: 10px;
            }
            #footer{ 
                border-top: 1px solid #ccc;
                background-color: #dedede;
            }
        </style>
    </head>
    <body>
        <div id="header"><h2>Сайт MySyte.com</h2></div>
        <div id="wrapper">
            <div id="menu">
                <ul>
                    <li><a href="#">Главная</a></li>
                    <li><a href="#">Блог</a></li>
                    <li><a href="#">Контакты</a></li>
                    <li><a href="#">О сайте</a></li>
                </ul>
            </div>
            <div id="main">
                <h2>What is Lorem Ipsum?</h2>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum 
                    has been the industry...</p>
            </div>
        </div>
        <div id="footer">
            <p>Copyright © MySyte.com, 2016</p>
        </div>
    </body>
</html>

```

В данном случае плавающий блок menu и обтекающий его блок main обертываются в один элемент wrapper, в котором устанавливается фон для элемента menu. А элемент main, как наибольший элемент, может использовать собственную установку фона.



