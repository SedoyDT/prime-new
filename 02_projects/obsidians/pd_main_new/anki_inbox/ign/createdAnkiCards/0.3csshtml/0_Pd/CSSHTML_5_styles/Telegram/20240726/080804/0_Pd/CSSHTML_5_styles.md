
# Начало карточки

<!-- basicblock-start oid="ObshTQXiU81y7yAH4cZXul0B"  deck='0_Pd_CSSHTML_5_styles' -->
background-attachment::


Свойство background-attachment управляет, как фоновое изображение будет прикреплено к элементу. Это свойство может принимать следующие значения:

    fixed: фон элемента фиксирован вне зависимости от прокрутки внутри элемента

    local: по мере прокрутки внутри элемента фон изменяется

    scroll: фон фиксирован и не меняется при прокрутке, но в отличие от fixed несколько элементов могут использовать свой фон, тогда как при fixed создается один фон для всех элементов

Например:

```

div{
    width: 300px;
    height: 250px;
     
             
    overflow:scroll;    /* добавляем прокрутку  */
    border: 1px solid #ccc;
     
    background-image: url(dubi.png);
    background-size: 512px 384px;
    background-attachment: scroll;
    background-repeat: no-repeat;
}
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

background-attachment

Свойство background-attachment управляет, как фоновое изображение будет прикреплено к элементу. Это свойство может принимать следующие значения:

    fixed: фон элемента фиксирован вне зависимости от прокрутки внутри элемента

    local: по мере прокрутки внутри элемента фон изменяется

    scroll: фон фиксирован и не меняется при прокрутке, но в отличие от fixed несколько элементов могут использовать свой фон, тогда как при fixed создается один фон для всех элементов

Например:

```

div{
    width: 300px;
    height: 250px;
     
             
    overflow:scroll;    /* добавляем прокрутку  */
    border: 1px solid #ccc;
     
    background-image: url(dubi.png);
    background-size: 512px 384px;
    background-attachment: scroll;
    background-repeat: no-repeat;
}
```



