
# Начало карточки

<!-- basicblock-start oid="Obs63TSbOq9olNjOMoTSHsNR"  deck='0_Pd_php_options_and_context_parameters_16' -->
Пример #1 Пример использования опции bindto::


```


<?php

// Соединение с сетью через IP-адрес 192.168.0.100
$opts = array(
    'socket' => array(
        'bindto' => '192.168.0.100:0',
    ),
);


// Соединение с сетью через IP-адрес 192.168.0.100 и порт 7000
$opts = array(
    'socket' => array(
        'bindto' => '192.168.0.100:7000',
    ),
);


// Соединение с сетью через IPv6-адрес 2001:db8::1
// и порт 7000
$opts = array(
    'socket' => array(
        'bindto' => '[2001:db8::1]:7000',
    ),
);


// Соединение с сетью через порт 7000
$opts = array(
    'socket' => array(
        'bindto' => '0:7000',
    ),
);


// Создаём контекст...
$context = stream_context_create($opts);

// ...и получаем через него данные
echo file_get_contents('http://www.example.com', false, $context);

?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Пример #1 Пример использования опции bindto

```


<?php

// Соединение с сетью через IP-адрес 192.168.0.100
$opts = array(
    'socket' => array(
        'bindto' => '192.168.0.100:0',
    ),
);


// Соединение с сетью через IP-адрес 192.168.0.100 и порт 7000
$opts = array(
    'socket' => array(
        'bindto' => '192.168.0.100:7000',
    ),
);


// Соединение с сетью через IPv6-адрес 2001:db8::1
// и порт 7000
$opts = array(
    'socket' => array(
        'bindto' => '[2001:db8::1]:7000',
    ),
);


// Соединение с сетью через порт 7000
$opts = array(
    'socket' => array(
        'bindto' => '0:7000',
    ),
);


// Создаём контекст...
$context = stream_context_create($opts);

// ...и получаем через него данные
echo file_get_contents('http://www.example.com', false, $context);

?>
```



