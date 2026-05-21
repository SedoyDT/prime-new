
# Начало карточки

<!-- basicblock-start oid="ObsFZ7Y7Sly4hzOFNY0cdaN7"  deck='0_Pd_CSSHTML_11_flexbox' -->
Как выглядит пример трехколоночного макета?::


https://codepen.io/sedoydt/pen/qBzaRRV?editors=1000
```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Flexbox в CSS3</title>
        <style>
            *{
                box-sizing: border-box;
            }
            html,
            body {
                padding: 0;
                margin: 0;
                font-family: verdana, arial, sans-serif;
            }
 
            body {
                display: flex;
                padding: 1em;
                flex-direction: column;
            }
 
            .item {
                background-color: #455a64;
                color: #fff;
                font-size: 1.1em;
                padding: 1em;
                flex: 1;
            }
 
            .item:nth-child(1) {
                background-color: #607d8b;
            }
            @media screen and (min-width: 600px) {
     
                body {
                    flex-direction: row;
                }
                .item:nth-child(2) {
                    order: -1;
                }
            }
        </style>
    </head>
    <body>
         
        <div class="item">
            <h1>Что такое Lorem Ipsum?</h1>
            <p>Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" 
            для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал ...</p>
        </div>
         
        <div class="item">
            <h3>Классический текст Lorem Ipsum, используемый с XVI века</h3>
            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore 
            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco</p>
        </div>
        <div class="item">
            <h3>Где его взять?</h3>
            <p>Есть много вариантов Lorem Ipsum, но большинство из них имеет не всегда приемлемые модификации, например, 
            юмористические вставки или слова, которые даже отдалённо не напоминают латынь.</p>
        </div>
    </body>
</html>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Как выглядит пример трехколоночного макета?

https://codepen.io/sedoydt/pen/qBzaRRV?editors=1000
```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Flexbox в CSS3</title>
        <style>
            *{
                box-sizing: border-box;
            }
            html,
            body {
                padding: 0;
                margin: 0;
                font-family: verdana, arial, sans-serif;
            }
 
            body {
                display: flex;
                padding: 1em;
                flex-direction: column;
            }
 
            .item {
                background-color: #455a64;
                color: #fff;
                font-size: 1.1em;
                padding: 1em;
                flex: 1;
            }
 
            .item:nth-child(1) {
                background-color: #607d8b;
            }
            @media screen and (min-width: 600px) {
     
                body {
                    flex-direction: row;
                }
                .item:nth-child(2) {
                    order: -1;
                }
            }
        </style>
    </head>
    <body>
         
        <div class="item">
            <h1>Что такое Lorem Ipsum?</h1>
            <p>Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" 
            для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал ...</p>
        </div>
         
        <div class="item">
            <h3>Классический текст Lorem Ipsum, используемый с XVI века</h3>
            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore 
            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco</p>
        </div>
        <div class="item">
            <h3>Где его взять?</h3>
            <p>Есть много вариантов Lorem Ipsum, но большинство из них имеет не всегда приемлемые модификации, например, 
            юмористические вставки или слова, которые даже отдалённо не напоминают латынь.</p>
        </div>
    </body>
</html>
```



