
# Начало карточки

<!-- basicblock-start oid="ObsMkeBn3xEbPkFbWyG6MNhh"  deck='0_Pd_CSSHtML6_properties' -->
Использование float::


Алгоритм создания панели навигации с помощью float разделяется на два этапа. На первом этапе у элемента li, в который заключена ссылка, устанавливается float: left;. Это позволяет расположить все элементы списка в ряд при достаточной ширине, когда правый элемент списка обтекает левый элемент списка.

Второй этап заключается в установке у элемента ссылки display: block, что дает нам возможность устанавливать ширину, отступы, вообщем все те признаки, которые характерны для блочных элементов.

https://codepen.io/sedoydt/pen/ZEdpgZj

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
                float: left;
            }
            ul.nav a {
                display: block;
                width: 5em;
                padding:10px;
                margin: 0 5px;
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

Использование float

Алгоритм создания панели навигации с помощью float разделяется на два этапа. На первом этапе у элемента li, в который заключена ссылка, устанавливается float: left;. Это позволяет расположить все элементы списка в ряд при достаточной ширине, когда правый элемент списка обтекает левый элемент списка.

Второй этап заключается в установке у элемента ссылки display: block, что дает нам возможность устанавливать ширину, отступы, вообщем все те признаки, которые характерны для блочных элементов.

https://codepen.io/sedoydt/pen/ZEdpgZj

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
                float: left;
            }
            ul.nav a {
                display: block;
                width: 5em;
                padding:10px;
                margin: 0 5px;
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



