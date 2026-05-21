
# Начало карточки

<!-- basicblock-start oid="Obs1x73ZpjW4aSPPt5BaklWf"  deck='0_Pd_CSSHtML_3_forms' -->
Что можно сказать про select в форме?::


Для создания списка с множественным выбором к элементу select надо добавить атрибут multiple:


Внутрь элемента select помещаются элементы option - элементы списка. Каждый элемент option содержит атрибут value, который хранит значение элемента. При этом значение элемента option не обязательно должно совпадать с отображаемым им текстом. Например:

Элемент select создает список. В зависимости от настроек это может быть выпадающий список для выбора одного элемента, либо раскрытый список, в котором можно выбрать сразу несколько элементов.

Select также позволяет группировать элементы с помощью тега <optgroup>:


https://codepen.io/sedoydt/pen/PorGeaG
https://metanit.com/web/html5/3.11.php

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Элемент select в HTML5</title>
    </head>
    <body>
        <form method="get">
            <p>
                <label for="phone">Выберите модель:</label> <br/>
             
                <select multiple id="phone" name="phone">
                    <option value="iphone 6s">iPhone 6S</option>
                    <option value="lumia 950">Lumia 950</option>
                    <option value="nexus 5x">Nexus 5X</option>
                    <option value="galaxy s7">Galaxy S7</option>
                </select>
            </p>
            <p>
                <input type="submit" value="Отправить" />
            </p>
        </form>
    </body>
</html>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что можно сказать про select в форме?

Для создания списка с множественным выбором к элементу select надо добавить атрибут multiple:


Внутрь элемента select помещаются элементы option - элементы списка. Каждый элемент option содержит атрибут value, который хранит значение элемента. При этом значение элемента option не обязательно должно совпадать с отображаемым им текстом. Например:

Элемент select создает список. В зависимости от настроек это может быть выпадающий список для выбора одного элемента, либо раскрытый список, в котором можно выбрать сразу несколько элементов.

Select также позволяет группировать элементы с помощью тега <optgroup>:


https://codepen.io/sedoydt/pen/PorGeaG
https://metanit.com/web/html5/3.11.php

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Элемент select в HTML5</title>
    </head>
    <body>
        <form method="get">
            <p>
                <label for="phone">Выберите модель:</label> <br/>
             
                <select multiple id="phone" name="phone">
                    <option value="iphone 6s">iPhone 6S</option>
                    <option value="lumia 950">Lumia 950</option>
                    <option value="nexus 5x">Nexus 5X</option>
                    <option value="galaxy s7">Galaxy S7</option>
                </select>
            </p>
            <p>
                <input type="submit" value="Отправить" />
            </p>
        </form>
    </body>
</html>
```



