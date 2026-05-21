
# Начало карточки

<!-- basicblock-start oid="ObsKSkZzipVRWDE6B3AQgvj2"  deck='0_Pd_CSSHtML_3_forms' -->
Как выглядит datalist для формы с числами?::

https://codepen.io/sedoydt/pen/zYVKjvW

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Числовое поле в HTML5</title>
    </head>
    <body>
        <form>
            <p>
                <label for="price">Цена: </label>
                <input type="number" list="priceList"
                    step="1000" min="3000" max="100000" value="10000" id="price" name="price"/>
            </p>
            <p>
                <button type="submit">Отправить</button>
            </p>
        </form>
        <datalist id="priceList">
            <option value="15000" />
            <option value="20000" />
            <option value="25000" />
        </datalist>
    </body>
</html>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Как выглядит datalist для формы с числами?

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Числовое поле в HTML5</title>
    </head>
    <body>
        <form>
            <p>
                <label for="price">Цена: </label>
                <input type="number" list="priceList"
                    step="1000" min="3000" max="100000" value="10000" id="price" name="price"/>
            </p>
            <p>
                <button type="submit">Отправить</button>
            </p>
        </form>
        <datalist id="priceList">
            <option value="15000" />
            <option value="20000" />
            <option value="25000" />
        </datalist>
    </body>
</html>
```



