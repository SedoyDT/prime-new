
# Начало карточки

<!-- basicblock-start oid="ObsXVrW2cEfUEMkioX02vBOT"  deck='0_Pd_CSSHTML_5_styles' -->
Пример обращения к дочернему элементу::


```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Селекторы атрибутов в CSS3</title>
        <style>
            .article > p{
             
                color: red;
            }
        </style>
    </head>
    <body>
        <div class="article">
            <p>Аннотация к статье</p>
            <div class="content">
                <p>Текст статьи</p>
            </div>
        </div>
    </body>
</html>

```

В блоке с классом article есть два параграфа. Селектор .article > p выбирает только те параграфы, который находятся непосредственно в блоке article:

Если бы мы использовали другой селектор без символа >

```

.article p{
             
    color: red;
}

```
Тогда стиль бы применялся ко всем параграфам на всех уровнях вложенности:
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример обращения к дочернему элементу

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Селекторы атрибутов в CSS3</title>
        <style>
            .article > p{
             
                color: red;
            }
        </style>
    </head>
    <body>
        <div class="article">
            <p>Аннотация к статье</p>
            <div class="content">
                <p>Текст статьи</p>
            </div>
        </div>
    </body>
</html>

```

В блоке с классом article есть два параграфа. Селектор .article > p выбирает только те параграфы, который находятся непосредственно в блоке article:

Если бы мы использовали другой селектор без символа >

```

.article p{
             
    color: red;
}

```
Тогда стиль бы применялся ко всем параграфам на всех уровнях вложенности:



