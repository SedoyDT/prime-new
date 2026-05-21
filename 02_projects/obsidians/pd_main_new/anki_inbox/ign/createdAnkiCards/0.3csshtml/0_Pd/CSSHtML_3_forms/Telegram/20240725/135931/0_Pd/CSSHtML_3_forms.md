
# Начало карточки

<!-- basicblock-start oid="Obs4ZNROZH6jIYxtj5hIg4xQ"  deck='0_Pd_CSSHtML_3_forms' -->
Среди атрибутов текстового поля также следует отметить такой атрибут как list. Он содержит ссылку на элемент datalist, который определяет набор значений, появляющихся в виде подсказки при вводе в текстовое поле. Например:::


https://codepen.io/sedoydt/pen/GRbjxVV

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Текстовые поля в HTML5</title>
    </head>
    <body>
        <form>
            <p><input list="phonesList" type="text" name="model" placeholder="Введите модель" /></p>
            <p>
                <button type="submit">Отправить</button>
            </p>
        </form>
        <datalist id="phonesList">
            <option value="iPhone 6S" label="54000"/>
            <option value="Lumia 950">35000</option>
            <option value="Nexus 5X"/>
        </datalist>
    </body>
</html>

```

Атрибут list текстового поля указывает на id элемента datalist. Сам элемент datalist с помощью вложенных элементов option определяет элементы списка. И при вводе в текстовое поле этот список отображается в виде подсказки.
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Среди атрибутов текстового поля также следует отметить такой атрибут как list. Он содержит ссылку на элемент datalist, который определяет набор значений, появляющихся в виде подсказки при вводе в текстовое поле. Например:

https://codepen.io/sedoydt/pen/GRbjxVV

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Текстовые поля в HTML5</title>
    </head>
    <body>
        <form>
            <p><input list="phonesList" type="text" name="model" placeholder="Введите модель" /></p>
            <p>
                <button type="submit">Отправить</button>
            </p>
        </form>
        <datalist id="phonesList">
            <option value="iPhone 6S" label="54000"/>
            <option value="Lumia 950">35000</option>
            <option value="Nexus 5X"/>
        </datalist>
    </body>
</html>

```

Атрибут list текстового поля указывает на id элемента datalist. Сам элемент datalist с помощью вложенных элементов option определяет элементы списка. И при вводе в текстовое поле этот список отображается в виде подсказки.



