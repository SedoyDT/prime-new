
# Начало карточки

<!-- basicblock-start oid="Obs9uwg8XQNtFZQgAy58gF8t"  deck='0_Pd_CSSHTML_11_flexbox' -->
Что делает flex-order ?::


https://codepen.io/pen/?editors=0100
Свойство flex-order позволяет установить группу для html элемента, позволяя тем самым переопределитьВ качестве значения свойство принимает числовой порядок группы. К одной группе может принадлежать несколько элементов.

Например, элементы в группе 0 располагаются перед элементами с группой 1, а элементы с группой 1 располагаются перед элементами с группой 2 и так далее. его позицию внутри flex - контейнера. 

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Flexbox в CSS3</title>
        <style>
             
            .flex-container {
                display: flex;
                flex-flow: row wrap;
            }
            .flex-item {
                text-align:center;
                font-size: 1em;
                padding: 1.5em;
                color: white;
                opacity: 0.8;
            }
            .group1{
                order:-1;
            }
            .group2{
                order:1;
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
            <div class="flex-item color2 group2">Flex Item 2</div>
            <div class="flex-item color3 group2">Flex Item 3</div>
            <div class="flex-item color4">Flex Item 4</div>
            <div class="flex-item color5 group1">Flex Item 5</div>
        </div>
</html>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что делает flex-order ?

https://codepen.io/pen/?editors=0100
Свойство flex-order позволяет установить группу для html элемента, позволяя тем самым переопределитьВ качестве значения свойство принимает числовой порядок группы. К одной группе может принадлежать несколько элементов.

Например, элементы в группе 0 располагаются перед элементами с группой 1, а элементы с группой 1 располагаются перед элементами с группой 2 и так далее. его позицию внутри flex - контейнера. 

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Flexbox в CSS3</title>
        <style>
             
            .flex-container {
                display: flex;
                flex-flow: row wrap;
            }
            .flex-item {
                text-align:center;
                font-size: 1em;
                padding: 1.5em;
                color: white;
                opacity: 0.8;
            }
            .group1{
                order:-1;
            }
            .group2{
                order:1;
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
            <div class="flex-item color2 group2">Flex Item 2</div>
            <div class="flex-item color3 group2">Flex Item 3</div>
            <div class="flex-item color4">Flex Item 4</div>
            <div class="flex-item color5 group1">Flex Item 5</div>
        </div>
</html>
```



