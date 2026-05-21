
# Начало карточки

<!-- basicblock-start oid="ObsjqYMnSFig1Rd8UIIm1opF"  deck='0_Pd_CSSHTML_11_flexbox' -->
Что делает flex-flow?::


https://codepen.io/pen/?editors=1100
flex-flow позволяет установить значения для flex-direction и для flex-wrap
Оно имеет следующий формальный синтаксис: flex-flow: [flex-direction] [flex-wrap]                 flex-flow: row wrap;


```HTML
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Flexbox в CSS3</title>
        <style>
             
            .flex-container {
                display: flex;
                border: solid 0.25em #000;
                height:8.25em;
                flex-flow: row wrap;
            }
            .flex-item {
                text-align:center;
                font-size: 1em;
                padding: 1.5em;
                color: white;
                opacity: 0.8;
            }
            .color1 {background-color: #675BA7;}
            .color2 {background-color: #9BC850;}
            .color3 {background-color: #A62E5C;}
            .color4 {background-color: #2A9FBC;}
            .color5 {background-color: #F15B2A;}
        </style>
    </head>
    <body>
        <div class="flex-container">
            <div class="flex-item color1">Flex Item 1</div>
            <div class="flex-item color2">Flex Item 2</div>
            <div class="flex-item color3">Flex Item 3</div>
            <div class="flex-item color4">Flex Item 4</div>
            <div class="flex-item color5">Flex Item 5</div>
        </div>
    </body>
</html>
```



<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что делает flex-flow?

https://codepen.io/pen/?editors=1100
flex-flow позволяет установить значения для flex-direction и для flex-wrap
Оно имеет следующий формальный синтаксис: flex-flow: [flex-direction] [flex-wrap]                 flex-flow: row wrap;



