---
created: 2024-07-29T08:35:48 (UTC +03:00)
tags: [xdebug,phpstorm,docker,docker swarm,ssh tunnel,debug]
source: https://habr.com/ru/articles/665860/
author: Костин Алексей
---


[Настройка Xdebug 3 на внешнем сервере в Docker-контейнере через SSH-туннель / Хабр](https://habr.com/ru/articles/665860/)
created: [[2024-07-29]]
[[]]
[[]]
[[]]
[[]]

# Настройка Xdebug 3 на внешнем сервере в Docker-контейнере через SSH-туннель / Хабр

> ## Excerpt
> В нашей организации используется такой подход к разработке - на локальной машине (Windows 11) установлен PhpStorm и находится репозиторий с кодом. В PhpStorm нас...

---
В нашей организации используется такой подход к разработке - на локальной машине (Windows 11) установлен PhpStorm и находится репозиторий с кодом. В PhpStorm настроена автоматическая выгрузка изменений на dev-стенд (внешний сервер), где и исполняется код. На dev-стенде: Ubuntu 20 и Docker (swarm mode).

Общий принцип настройки Xdebug таков:

-   Открываем SSH-туннель между локальной машиной и dev-стендом
    
-   Xdebug из контейнера подключается к 9003-му порту хоста (dev-стенд)
    
-   dev-стенд по SSH-туннелю перенаправляет запрос на 9003-й порт локальной машины
    

## 1\. Настройка на стороне внешнего сервера:

**1.1. Добавить Xdebug в образ**

В `Dockerfile`, из которого собирается Ваш образ PHP-FPM необходимо добавить установку и активацию XDebug 3:

```
FROM php:8.0.6-fpm-alpine 

RUN apk add --no-cache \  
    $PHPIZE_DEPS \  
    &amp;&amp; pecl install xdebug \  
    &amp;&amp; docker-php-ext-enable xdebug
```

**1.2. Определить IP адрес, по которому хост доступен из контейнера**

Для этого нужно выполнить в нем команду:

```
docker exec <span>$(docker ps -q --filter=</span><span>"NAME=php-fpm"</span><span>)</span> \<br>/sbin/ip route|awk <span>'/default/ { print $3 }'</span>
```

`php-fpm` - это название сервиса PHP-FPM, указанное в compose-файле.

Получим IP, который будем далее указывать в настройках Xdebug и правилах перенаправления пакетов.

В моем случае - `172.18.0.1`

**1.3. Настройка Xdebug в php.ini**

```
[X-debug]  
xdebug.mode=debug  
xdebug.client_host=172.18.0.1  
xdebug.client_port=9003
```

В опции `xdebug.client_host` указан IP, полученный на шаге 1.2

**1.4. Правки docker-compose.yml**

Для сервиса `php-fpm` необходимо добавить переменную окружения `PHP_IDE_CONFIG` с названием сервера, в котором в PhpStorm будет задан маппинг. `Docker` - это название сервера в настройках PhpStorm (Шаг 2.2).

```
<span>version</span><span>: </span><span>"3.9"</span><br><br><span>services</span><span>:</span><br><br>  <span>### php-fpm ###########################################################</span><br><span>  php-fpm</span><span>:</span><br><span>    image</span><span>: </span>$<span>{</span>PHP_FPM_IMAGE<span>}</span><br><span>    environment</span><span>:</span><br><span>      PHP_IDE_CONFIG</span><span>: </span>serverName=Docker
```

**1.5. Переадресация трафика на внешний порт**

```
<span>sudo</span> iptables <span>-t</span> nat <span>-I</span> PREROUTING <span>-p</span> tcp <span>-d</span> <span>172</span>.18.0.1 \<br><span>--dport</span> <span>9003</span> <span>-j</span> DNAT <span>--to</span> <span>127</span>.0.0.1:9003
```

`172.18.0.1` - это адрес, по которому можно обратиться к хост-машине из контейнера (пункт 1.2).

Для того, чтобы правила сохранялись после перезагрузки необходимо установть пакет `iptables-persistent`

```
<span>sudo</span> apt-get install iptables-persistent
```

В процессе установки будет предложено сохранить все правила для IPv4. Ответить нужно положительно.

## 2\. Настройка на стороне локальной машины:

**2.1. Открыть SSH-туннель**

Вы должны иметь возможность подключения к внешнему серверу по SSH.

Запустите SSH-туннель с проброской 9003-го порта внешнего сервера на 9003-й порт локального хоста:

```
<span>ssh</span> <span>-R</span> &lt;remote_port&gt;:localhost:&lt;local_port&gt; &lt;user&gt;@&lt;host&gt;<br><span># например</span><br><span>ssh</span> <span>-R</span> <span>9003</span>:localhost:9003 my-user@example.com
```

`my-user` - это имя вашего пользователя на внешнем сервер

`example.com` - это адрес внешнего сервера

**2.2. Настройка PhpStorm**

В настройках `PHP -> Servers` добавить сервер под названием `Docker`. Хост и порт не важны, можно оставить localhost и 80-й порт.  
Главное - задать маппинг от корня локального проекта до корня проекта в контейнере на внешнем сервере

![[Настройка Xdebug 3 на внешнем сервере в Docker-контейнере через SSH-туннель  Хабр/4ec6ac4c0aa299d326a26e305ca86647.png]]

## 3\. Использование

**3.1. Включить "прослушку" порта 9003 в PhpStorm:**

![[Настройка Xdebug 3 на внешнем сервере в Docker-контейнере через SSH-туннель  Хабр/1e7e9ee06e54d4e5993b4bc081b47176.png]]

**3.2. Инициализация отладки через браузер**

Необходимо установить специальное расширение Xdebug Helper для вашего браузера, которое позволит легко запускать режим отладки.

[Для Firefox][]

[Для Chrome][]

Включить режим отладки:

![[Настройка Xdebug 3 на внешнем сервере в Docker-контейнере через SSH-туннель  Хабр/3903c5fc3b8b2f948a5fa69ac5e55b1f.png]]

В PhpStorm установите в нужном месте точку останова и перезагрузите страницу.

После этого должно произойти подключение к PhpStorm и начаться сессия отладки.

**3.3. Инициализация откладки консольных команд.**

Необходимо в команду добавить опцию `-dxdebug.start_with_request=yes`

Например,  
`php -dxdebug.start_with_request=yes bin/phpunit`

## 4.Отладка подключения

Если подключение к PHPStorm не происходит, то можно воспользоваться легковесным клиентом для проверки подключения - [https://xdebug.org/docs/dbgpClient][]

Его нужно скачать на локальный хост.

Запустить сначала на локальном хосте и попытаться подключиться к нему из контейнера:  
`curl -Iv 172.18.0.1:9003`

Если в терминале с клиентом появилась надпись `Connect from 127.0.0.1:xxxxx`, то X-debug успешно соединяется с клиентом и проблема в настройках PHPStorm.

[Для Firefox]: https://addons.mozilla.org/en-US/firefox/addon/xdebug-helper-for-firefox/
[Для Chrome]: https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc
[https://xdebug.org/docs/dbgpClient]: https://xdebug.org/docs/dbgpClient
created: [[2024-07-29]]