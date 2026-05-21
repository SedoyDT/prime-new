
# Начало карточки

<!-- basicblock-start oid="Obsij3jJ9TXbI3Pn11kx1tVW"  deck='0_Pd_CSSHtML_3_forms' -->
```::

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Поиск в HTML5</title>
    </head>
    <body>
    <form>
        <input type="search" name="term" />
        <input type="submit" value="Поиск" />
    </form>
    </body>
</html>

```

Поле ввода пароля

Для ввода пароля используется элемент input с атрибутом type="password". Его отличительной чертой является то, что вводимые символы маскируются точками:

```

<form>
    <p><input type="text" name="login" /></p>
    <p><input type="password" name="password" /></p>
    <input type="submit" value="Авторизация" />
</form>

```

https://codepen.io/sedoydt/pen/PorGRrY
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Поиск в HTML5</title>
    </head>
    <body>
    <form>
        <input type="search" name="term" />
        <input type="submit" value="Поиск" />
    </form>
    </body>
</html>

```

Поле ввода пароля

Для ввода пароля используется элемент input с атрибутом type="password". Его отличительной чертой является то, что вводимые символы маскируются точками:

```

<form>
    <p><input type="text" name="login" /></p>
    <p><input type="password" name="password" /></p>
    <input type="submit" value="Авторизация" />
</form>

```

https://codepen.io/sedoydt/pen/PorGRrY




# Начало карточки

<!-- basicblock-start oid="ObsfDhzbLHGO6UnpUhq0ifoD"  deck='0_Pd_CSSHtML_3_forms' -->
Что можно сказать про текстовые поля в форме?::


Однострочное текстовое поле создается с помощью элемента input, когда его атрибут type имеет значение text:

```

<input type="text" name="login" />

```

С помощью ряда дополнительных атрибутов можно настроить текстовое поле:

    dir: устанавливает направление текста
    list: устанавливает список подсказок для ввода в поле
    maxlength: максимально допустимое количество символов в текстовом поле
    pattern: определяет шаблон, которому должен соответствовать вводимый текст
    placeholder: устанавливает текст, который по умолчанию отображается в текстовом поле
    readonly: делает текстовом поле доступным только для чтения
    required: указывает, что текстовое поле обязательно должно иметь значение
    size: устанавливает ширину текстового поля в видимых символах
    value: устанавливает значение по умолчанию в текстовом поле

Применим некоторые атрибуты:

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Текстовые поля в HTML5</title>
    </head>
    <body>
        <form>
            <p><input type="text" name="userName" placeholder="Введите имя" size="18" /></p>
            <p><input type="text" name="userPhone" placeholder="Введите номер телефона" size="18" maxlength="11" /></p>
            <p>
                <button type="submit">Отправить</button> 
                <button type="reset">Отмена</button>
            </p>
        </form>
    </body>
</html>


```

В этом примере во втором текстовом поле сразу устанавливаются атрибуты maxlength и size. При этом size - то есть количество символов, которые помещаются в видимое пространство поля больше, чем допустимое количество символов. Однако все равно ввести символов больше, чем maxlength, мы не сможем.

В данном случае также важно различать атрибуты value и placeholder, хотя оба устанавливают видимый текст в поле. Однако placeholder устанавливает своего рода подсказку или приглашение к вводу, поэтому он обычно отмечается серым цветом. В то время как значение value представляет введенный в поле текст по умолчанию:

```

<p><input type="text" name="userName" value="Том" /></p>
<p><input type="text" name="userPhone" placeholder="Номер телефона" /></p>

```

Атрибуты readonly и disabled делают текстовое поле недоступным, однако сопровождаются разным визуальным эффектом. В случае с disabled текстовое поле затеняется:

```

<p><input type="text" name="userName" value="Том" readonly /></p>
<p><input type="text" name="userPhone" value="+12345678901" disabled /></p>

```

Среди атрибутов текстового поля также следует отметить такой атрибут как list. Он содержит ссылку на элемент datalist, который определяет набор значений, появляющихся в виде подсказки при вводе в текстовое поле. Например:

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
Направление текста

Атрибут dir задает направление ввода текста. Он может принимать два значения: ltr (слева направо) и rtl (справа налево):
Поле поиска

Для создания полей поиска предназначен элемент input с атрибутом type="search". Формально он представляет собой простое текстовое поле:
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что можно сказать про текстовые поля в форме?

Однострочное текстовое поле создается с помощью элемента input, когда его атрибут type имеет значение text:

```

<input type="text" name="login" />

```

С помощью ряда дополнительных атрибутов можно настроить текстовое поле:

    dir: устанавливает направление текста
    list: устанавливает список подсказок для ввода в поле
    maxlength: максимально допустимое количество символов в текстовом поле
    pattern: определяет шаблон, которому должен соответствовать вводимый текст
    placeholder: устанавливает текст, который по умолчанию отображается в текстовом поле
    readonly: делает текстовом поле доступным только для чтения
    required: указывает, что текстовое поле обязательно должно иметь значение
    size: устанавливает ширину текстового поля в видимых символах
    value: устанавливает значение по умолчанию в текстовом поле

Применим некоторые атрибуты:

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Текстовые поля в HTML5</title>
    </head>
    <body>
        <form>
            <p><input type="text" name="userName" placeholder="Введите имя" size="18" /></p>
            <p><input type="text" name="userPhone" placeholder="Введите номер телефона" size="18" maxlength="11" /></p>
            <p>
                <button type="submit">Отправить</button> 
                <button type="reset">Отмена</button>
            </p>
        </form>
    </body>
</html>


```

В этом примере во втором текстовом поле сразу устанавливаются атрибуты maxlength и size. При этом size - то есть количество символов, которые помещаются в видимое пространство поля больше, чем допустимое количество символов. Однако все равно ввести символов больше, чем maxlength, мы не сможем.

В данном случае также важно различать атрибуты value и placeholder, хотя оба устанавливают видимый текст в поле. Однако placeholder устанавливает своего рода подсказку или приглашение к вводу, поэтому он обычно отмечается серым цветом. В то время как значение value представляет введенный в поле текст по умолчанию:

```

<p><input type="text" name="userName" value="Том" /></p>
<p><input type="text" name="userPhone" placeholder="Номер телефона" /></p>

```

Атрибуты readonly и disabled делают текстовое поле недоступным, однако сопровождаются разным визуальным эффектом. В случае с disabled текстовое поле затеняется:

```

<p><input type="text" name="userName" value="Том" readonly /></p>
<p><input type="text" name="userPhone" value="+12345678901" disabled /></p>

```

Среди атрибутов текстового поля также следует отметить такой атрибут как list. Он содержит ссылку на элемент datalist, который определяет набор значений, появляющихся в виде подсказки при вводе в текстовое поле. Например:

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
Направление текста

Атрибут dir задает направление ввода текста. Он может принимать два значения: ltr (слева направо) и rtl (справа налево):
Поле поиска

Для создания полей поиска предназначен элемент input с атрибутом type="search". Формально он представляет собой простое текстовое поле:



