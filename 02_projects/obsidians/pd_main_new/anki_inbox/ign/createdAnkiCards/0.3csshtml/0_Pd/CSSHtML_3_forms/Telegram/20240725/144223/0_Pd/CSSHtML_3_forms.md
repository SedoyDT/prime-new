
# Начало карточки

<!-- basicblock-start oid="ObsM1764fearUQz6oUgGP3CX"  deck='0_Pd_CSSHtML_3_forms' -->
Что можно сказтаь про работу с датой и временем в html?::


https://codepen.io/sedoydt/pen/ExBgLoO

Для работы с датами и временем в HTML5 предназначено несколько типов элементов input:

    datetime-local: устанавливает дату и время

    date: устанавливает дату

    month: устанавливает текущий месяц и год

    time: устанавливает время

    week: устанавливает текущую неделю

Например, используем поле для установки даты:

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
                <label for="firstname">Имя: </label>
                <input type="text" id="firstname" name="firstname"/>
            </p>
            <p>
                <label for="date">Дата рождения: </label>
                <input type="date" id="date" name="date"/>
            </p>
            <p>
                <button type="submit">Отправить</button>
            </p>
        </form>
    </body>
</html>
```


И при вводе в поле для даты будет открываться календарик:

Правда, здесь надо отметить, что действие этого элемента зависит от браузера. В данном случае используется Google Chrome. В последних версиях Opera элемент не будет сильно отличаться. А вот в Microsoft Edge элемент будет выглядеть так:

Применение остальных элементов:

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
                <label for="week">Неделя: </label>
                <input type="week" name="week" id="week" />
            </p>
            <p>
                <label for="localdate">Дата и время: </label>
                <input type="datetime-local" id="localdate" name="date"/>
            </p>
            <p>
                <label for="month">Месяц: </label>
                <input type="month" id="month" name="month"/>
            </p>
            <p>
                <label for="time">Время: </label>
                <input type="time" id="time" name="time"/>
            </p>
            <p>
                <button type="submit">Отправить</button>
            </p>
        </form>
    </body>
</html>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что можно сказтаь про работу с датой и временем в html?

https://codepen.io/sedoydt/pen/ExBgLoO

Для работы с датами и временем в HTML5 предназначено несколько типов элементов input:

    datetime-local: устанавливает дату и время

    date: устанавливает дату

    month: устанавливает текущий месяц и год

    time: устанавливает время

    week: устанавливает текущую неделю

Например, используем поле для установки даты:

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
                <label for="firstname">Имя: </label>
                <input type="text" id="firstname" name="firstname"/>
            </p>
            <p>
                <label for="date">Дата рождения: </label>
                <input type="date" id="date" name="date"/>
            </p>
            <p>
                <button type="submit">Отправить</button>
            </p>
        </form>
    </body>
</html>
```


И при вводе в поле для даты будет открываться календарик:

Правда, здесь надо отметить, что действие этого элемента зависит от браузера. В данном случае используется Google Chrome. В последних версиях Opera элемент не будет сильно отличаться. А вот в Microsoft Edge элемент будет выглядеть так:

Применение остальных элементов:

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
                <label for="week">Неделя: </label>
                <input type="week" name="week" id="week" />
            </p>
            <p>
                <label for="localdate">Дата и время: </label>
                <input type="datetime-local" id="localdate" name="date"/>
            </p>
            <p>
                <label for="month">Месяц: </label>
                <input type="month" id="month" name="month"/>
            </p>
            <p>
                <label for="time">Время: </label>
                <input type="time" id="time" name="time"/>
            </p>
            <p>
                <button type="submit">Отправить</button>
            </p>
        </form>
    </body>
</html>
```



