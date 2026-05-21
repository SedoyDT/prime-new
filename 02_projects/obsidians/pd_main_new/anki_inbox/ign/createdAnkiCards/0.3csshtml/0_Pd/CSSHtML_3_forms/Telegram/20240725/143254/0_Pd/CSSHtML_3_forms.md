
# Начало карточки

<!-- basicblock-start oid="ObsUtfRksk1IeZojWLWrSLVu"  deck='0_Pd_CSSHtML_3_forms' -->
Что можно сказать про Поля для ввода url, email, телефона::


Ряд полей input предназначены для ввода таких данных, как url, адреса электронной почты и телефонного номера. Они однотипны и во многом отличаются только тем, что для атрибута type принимают соответственно значения email, tel и url.

Для их настройки мы можем использовать те же атрибуты, что и для обычного текстового поля:

    maxlength: максимально допустимое количество символов в поле
    pattern: определяет шаблон, которому должен соответствовать вводимый текст
    placeholder: устанавливает текст, который по умолчанию отображается в поле
    readonly: делает текстовом поле доступным только для чтения
    required: указывает, что текстовое поле обязательно должно иметь значение
    size: устанавливает ширину поля в видимых символах
    value: устанавливает значение по умолчанию для поля
    list: устанавливает привязку к элементу datalist со списком возможных значений

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Форма ввода в HTML5</title>
    </head>
    <body>
        <form>
            <p>
                <label for="email">Email: </label>
                <input type="email" placeholder="user@gmail.com" id="email" name="email"/>
            </p>
            <p>
                <label for="url">URL: </label>
                <input type="url" id="url" name="url"/>
            </p>
            <p>
                <label for="phone">Телефон: </label>
                <input type="tel" placeholder="(XXX)-XXX-XXXX" id="phone" name="phone"/>
            </p>
            <p>
                <button type="submit">Отправить</button>
            </p>
        </form>
    </body>
</html>

```

https://codepen.io/sedoydt/pen/XWLjqgY
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что можно сказать про Поля для ввода url, email, телефона

Ряд полей input предназначены для ввода таких данных, как url, адреса электронной почты и телефонного номера. Они однотипны и во многом отличаются только тем, что для атрибута type принимают соответственно значения email, tel и url.

Для их настройки мы можем использовать те же атрибуты, что и для обычного текстового поля:

    maxlength: максимально допустимое количество символов в поле
    pattern: определяет шаблон, которому должен соответствовать вводимый текст
    placeholder: устанавливает текст, который по умолчанию отображается в поле
    readonly: делает текстовом поле доступным только для чтения
    required: указывает, что текстовое поле обязательно должно иметь значение
    size: устанавливает ширину поля в видимых символах
    value: устанавливает значение по умолчанию для поля
    list: устанавливает привязку к элементу datalist со списком возможных значений

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Форма ввода в HTML5</title>
    </head>
    <body>
        <form>
            <p>
                <label for="email">Email: </label>
                <input type="email" placeholder="user@gmail.com" id="email" name="email"/>
            </p>
            <p>
                <label for="url">URL: </label>
                <input type="url" id="url" name="url"/>
            </p>
            <p>
                <label for="phone">Телефон: </label>
                <input type="tel" placeholder="(XXX)-XXX-XXXX" id="phone" name="phone"/>
            </p>
            <p>
                <button type="submit">Отправить</button>
            </p>
        </form>
    </body>
</html>

```

https://codepen.io/sedoydt/pen/XWLjqgY



