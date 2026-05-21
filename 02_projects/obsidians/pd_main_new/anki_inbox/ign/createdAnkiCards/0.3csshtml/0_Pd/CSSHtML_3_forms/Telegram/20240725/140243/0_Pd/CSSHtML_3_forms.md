
# Начало карточки

<!-- basicblock-start oid="ObsW2qMwRIbKGt4RTkZq7PXO"  deck='0_Pd_CSSHtML_3_forms' -->
Что можно сказать про метки и автофокус?::


Вместе с полями ввода нередко используются метки, которые представлены элементом label. Метки создают аннотацию или заголовок к полю ввода, указывают, для чего это поле предназначено.

Для связи с полем ввода метка имеет атрибут for, который указывает на id поля ввода:

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Label в HTML5</title>
    </head>
    <body>
        <form>
            <p>
                <label for="login">Логин: </label>
                <input type="text" id="login" name="login" />
            </p>
            <p>
                <label for="password">Пароль: </label>
                <input type="password" id="password" name="password" />
            </p>
            <p>
                <button type="submit">Отправить</button>
            </p>
        </form>
    </body>
</html>

```

Так, текстовое поле здесь имеет атрибут id="login". Поэтому у связанной с ним метки устанавливается атрибут for="login". Нажатие на эту метку позволяет перевести фокус на текстовое поле для ввода логина:

Собственно на этом роль меток и заканчивается. Также мы можем установить автофокус по умолчанию на какое-либо поле ввода. Для этого применяется атрибут autofocus:

```

<form>
    <p>
        <label for="login">Логин: </label>
        <input type="text" autofocus id="login" name="login" />
    </p>
    <p>
        <label for="password">Пароль: </label>
        <input type="password" id="password" name="password" />
    </p>
    <p>
        <button type="submit">Отправить</button>
    </p>
</form>

```

Здесь при запуске страницы фокус сразу же переходит на текстовое поле.
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что можно сказать про метки и автофокус?

Вместе с полями ввода нередко используются метки, которые представлены элементом label. Метки создают аннотацию или заголовок к полю ввода, указывают, для чего это поле предназначено.

Для связи с полем ввода метка имеет атрибут for, который указывает на id поля ввода:

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Label в HTML5</title>
    </head>
    <body>
        <form>
            <p>
                <label for="login">Логин: </label>
                <input type="text" id="login" name="login" />
            </p>
            <p>
                <label for="password">Пароль: </label>
                <input type="password" id="password" name="password" />
            </p>
            <p>
                <button type="submit">Отправить</button>
            </p>
        </form>
    </body>
</html>

```

Так, текстовое поле здесь имеет атрибут id="login". Поэтому у связанной с ним метки устанавливается атрибут for="login". Нажатие на эту метку позволяет перевести фокус на текстовое поле для ввода логина:

Собственно на этом роль меток и заканчивается. Также мы можем установить автофокус по умолчанию на какое-либо поле ввода. Для этого применяется атрибут autofocus:

```

<form>
    <p>
        <label for="login">Логин: </label>
        <input type="text" autofocus id="login" name="login" />
    </p>
    <p>
        <label for="password">Пароль: </label>
        <input type="password" id="password" name="password" />
    </p>
    <p>
        <button type="submit">Отправить</button>
    </p>
</form>

```

Здесь при запуске страницы фокус сразу же переходит на текстовое поле.



