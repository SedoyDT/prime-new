
#H_html
#html

#telegram 

# **<u>🤔</u>****<u> Как изменить направление оси flexbox контейнера?</u>** 
<!-- basicblock-start oid="ObsrCfjvLgrp7b15UCwNrkYp"  deck='H_html' -->
**<u>🤔</u>****<u> Как изменить направление оси flexbox контейнера?</u>** ::


Чтобы изменить направление оси flexbox-контейнера, нужно использовать свойство CSS `flex-direction`. Это свойство определяет основную ось контейнера и направление размещения flex-элементов. 

🚩**Возможных значения** **flex-direction**

🟠**row**:
 Основная ось — горизонтальная, элементы располагаются слева направо. Это значение по умолчанию.
🟠**row-reverse**:
Основная ось — горизонтальная, элементы располагаются справа налево.
🟠**column**: 
Основная ось — вертикальная, элементы располагаются сверху вниз.
🟠**column-reverse**: 
Основная ось — вертикальная, элементы располагаются снизу вверх.

🚩**Примеры использования:**

Горизонтальное направление (слева направо):
```
.container {
    display: flex;
    flex-direction: row; /* или просто не указывать, так как это значение по умолчанию */
}
```

Горизонтальное направление (справа налево):
```
.container {
    display: flex;
    flex-direction: row-reverse;
}
```

Вертикальное направление (сверху вниз):
```
.container {
    display: flex;
    flex-direction: column;
}
```

Вертикальное направление (снизу вверх):
```
.container {
    display: flex;
    flex-direction: column-reverse;
}
```

Пример HTML и CSS:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flexbox Direction</title>
    <style>
        .container {
            display: flex;
            flex-direction: row; /* Измените значение на row-reverse, column, или column-reverse для проверки разных направлений */
            border: 1px solid #000;
            height: 200px;
        }
        .item {
            flex: 1;
            border: 1px solid #ccc;
            padding: 10px;
            margin: 5px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
    </div>
</body>
</html>
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#H_html
#html

#telegram 

# **<u>🤔</u>****<u> Как изменить направление оси flexbox контейнера?</u>** 
<!-- basicblock-start oid="ObsT3lu0TedpIV9LqAJ0hJN8"  deck='H_html' -->
**<u>🤔</u>****<u> Как изменить направление оси flexbox контейнера?</u>** ::


Чтобы изменить направление оси flexbox-контейнера, нужно использовать свойство CSS `flex-direction`. Это свойство определяет основную ось контейнера и направление размещения flex-элементов. 

🚩**Возможных значения** **flex-direction**

🟠**row**:
 Основная ось — горизонтальная, элементы располагаются слева направо. Это значение по умолчанию.
🟠**row-reverse**:
Основная ось — горизонтальная, элементы располагаются справа налево.
🟠**column**: 
Основная ось — вертикальная, элементы располагаются сверху вниз.
🟠**column-reverse**: 
Основная ось — вертикальная, элементы располагаются снизу вверх.

🚩**Примеры использования:**

Горизонтальное направление (слева направо):
```
.container {
    display: flex;
    flex-direction: row; /* или просто не указывать, так как это значение по умолчанию */
}
```

Горизонтальное направление (справа налево):
```
.container {
    display: flex;
    flex-direction: row-reverse;
}
```

Вертикальное направление (сверху вниз):
```
.container {
    display: flex;
    flex-direction: column;
}
```

Вертикальное направление (снизу вверх):
```
.container {
    display: flex;
    flex-direction: column-reverse;
}
```

Пример HTML и CSS:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flexbox Direction</title>
    <style>
        .container {
            display: flex;
            flex-direction: row; /* Измените значение на row-reverse, column, или column-reverse для проверки разных направлений */
            border: 1px solid #000;
            height: 200px;
        }
        .item {
            flex: 1;
            border: 1px solid #ccc;
            padding: 10px;
            margin: 5px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
    </div>
</body>
</html>
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#H_html
#html

#telegram 

# 🤔 **<u>Почему повсеместно нужен https?</u>**
<!-- basicblock-start oid="ObszfNMnMyBRm6bNHUbQwtuV"  deck='H_html' -->
🤔 **<u>Почему повсеместно нужен https?</u>**::


HTTPS (HyperText Transfer Protocol Secure) — это безопасная версия HTTP, которая шифрует данные между браузером и сервером. Он защищает пользователей и сайты от перехвата данных, атак и подделки информации.  

🚩 **Главные причины использовать HTTPS**  

🟠**Шифрование данных (Защита от перехвата)**  
Без HTTPS злоумышленники могут перехватить* данные, например, пароли или банковские карты.  
В HTTP данные передаются открытым текстом (их легко украсть в открытых Wi-Fi).  
В HTTPS данные зашифрованы с помощью SSL/TLS, и даже если их перехватят, их невозможно прочитать.  

🟠**Защита от атак "Человек посередине" (MITM)**  
Без HTTPS злоумышленник может подменить содержимое сайта.  
Опасные сценарии:  
Хакер в Wi-Fi кафе встраивает вредоносный код в сайт.  
Вредоносный провайдер заменяет рекламу или ворует куки.  

🟠**Google даёт больше доверия к HTTPS-сайтам**
Google понижает в поиске сайты без HTTPS, а Chrome помечает их как "Небезопасные".  

🟠**Обязателен для онлайн-платежей и авторизации**  
Для ввода паролей, карт и личных данных HTTPS обязателен по закону (например, PCI DSS для платежей).  
Если сайт работает без HTTPS, браузеры блокируют передачу банковских данных.  

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->



