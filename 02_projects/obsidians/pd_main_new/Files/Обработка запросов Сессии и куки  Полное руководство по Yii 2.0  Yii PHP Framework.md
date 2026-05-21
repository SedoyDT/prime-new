---
created: 2024-02-17T19:51:52 (UTC +03:00)
tags: []
source: https://www.yiiframework.com/doc/guide/2.0/ru/runtime-sessions-cookies
author: 
tags:
 - web
 - firefox
---
[[books/2024-02-17]]

# Обработка запросов: Сессии и куки | Полное руководство по Yii 2.0 | Yii PHP Framework

> ## Excerpt
> Сессии и куки позволяют сохранять пользовательские данные между запросами. При использовании чистого PHP можно получить доступ к этим данным через глобальные переменные $_SESSION и $_COOKIE, соответственно. Yii инкапсулирует сессии и куки в объекты, что дает возможность обращаться к ним в объектно-ориентированном стиле и дает дополнительное удобство в работе.

---
## Сессии и куки

Сессии и куки позволяют сохранять пользовательские данные между запросами. При использовании чистого PHP можно получить доступ к этим данным через глобальные переменные `$_SESSION` и `$_COOKIE`, соответственно. Yii инкапсулирует сессии и куки в объекты, что дает возможность обращаться к ним в объектно-ориентированном стиле и дает дополнительное удобство в работе.

## Сессии

По аналогии с [запросами](https://www.yiiframework.com/doc/guide/2.0/ru/runtime-requests) и [ответами](https://www.yiiframework.com/doc/guide/2.0/ru/runtime-responses), к сессии можно получить доступ через `session` [компонент приложения](https://www.yiiframework.com/doc/guide/2.0/ru/structure-application-components), который по умолчанию является экземпляром [yii\\web\\Session](https://www.yiiframework.com/doc/api/2.0/yii-web-session).

### Открытие и закрытие сессии

Открыть и закрыть сессию можно следующим образом:

```php
$session = Yii::$app->session; // проверяем что сессия уже открыта if ($session->isActive) ... // открываем сессию $session->open(); // закрываем сессию $session->close(); // уничтожаем сессию и все связанные с ней данные. $session->destroy();
```

Можно вызывать [open()](https://www.yiiframework.com/doc/api/2.0/yii-web-session#open()-detail) и [close()](https://www.yiiframework.com/doc/api/2.0/yii-web-session#close()-detail) многократно без возникновения ошибок; внутри компонента все методы проверяют сессию на факт того, открыта она или нет.

### Доступ к данным сессии

Получить доступ к сохраненным в сессию данным можно следующим образом:

```php
$session = Yii::$app->session; // получение переменной из сессии. Следующие способы использования эквивалентны: $language = $session->get('language'); $language = $session['language']; $language = isset($_SESSION['language']) ? $_SESSION['language'] : null; // запись переменной в сессию. Следующие способы использования эквивалентны: $session->set('language', 'en-US'); $session['language'] = 'en-US'; $_SESSION['language'] = 'en-US'; // Удаление переменной из сессии. Следующие способы использования эквивалентны: $session->remove('language'); unset($session['language']); unset($_SESSION['language']); // проверка на существование переменной в сессии. Следующие способы использования эквивалентны: if ($session->has('language')) ... if (isset($session['language'])) ... if (isset($_SESSION['language'])) ... // Обход всех переменных в сессии. Следующие способы использования эквивалентны: foreach ($session as $name => $value) ... foreach ($_SESSION as $name => $value) ...
```

> **Информация:** При получении данных из сессии через компонент `session`, сессия будет автоматически открыта, если она не была открыта до этого. В этом заключается отличие от получения данных из глобальной переменной `$_SESSION`, которое требует обязательного вызова `session_start()`.

При работе с сессионными данными, являющимися массивами, компонент `session` имеет ограничение, запрещающее прямую модификацию отдельных элементов массива. Например,

```php
$session = Yii::$app->session; // следующий код НЕ БУДЕТ работать $session['captcha']['number'] = 5; $session['captcha']['lifetime'] = 3600; // а этот будет: $session['captcha'] = [ 'number' => 5, 'lifetime' => 3600, ]; // этот код также будет работать: echo $session['captcha']['lifetime'];
```

Для решения этой проблемы можно использовать следующие обходные приемы:

```php
$session = Yii::$app->session; // прямое использование $_SESSION (убедитесь, что Yii::$app->session->open() был вызван) $_SESSION['captcha']['number'] = 5; $_SESSION['captcha']['lifetime'] = 3600; // получите весь массив, модифицируйте и сохраните обратно в сессию $captcha = $session['captcha']; $captcha['number'] = 5; $captcha['lifetime'] = 3600; $session['captcha'] = $captcha; // используйте ArrayObject вместо массива $session['captcha'] = new \ArrayObject; ... $session['captcha']['number'] = 5; $session['captcha']['lifetime'] = 3600; // записывайте данные с ключами, имеющими одинаковый префикс $session['captcha.number'] = 5; $session['captcha.lifetime'] = 3600;
```

Для улучшения производительности и читаемости кода рекомендуется использовать последний прием. Другими словами, вместо того, чтобы хранить массив как одну переменную сессии, мы сохраняем каждый элемент массива как обычную сессионную переменную с общим префиксом.

### Пользовательское хранилище для сессии

По умолчанию класс [yii\\web\\Session](https://www.yiiframework.com/doc/api/2.0/yii-web-session) сохраняет данные сессии в виде файлов на сервере. Однако Yii предоставляет ряд классов, которые реализуют различные способы хранения данных сессии:

-   [yii\\web\\DbSession](https://www.yiiframework.com/doc/api/2.0/yii-web-dbsession): сохраняет данные сессии в базе данных.
-   [yii\\web\\CacheSession](https://www.yiiframework.com/doc/api/2.0/yii-web-cachesession): хранение данных сессии в предварительно сконфигурированном компоненте кэша [кэш](https://www.yiiframework.com/doc/guide/2.0/ru/caching-data#cache-components).
-   yii\\redis\\Session: хранение данных сессии в [redis](https://redis.io/).
-   yii\\mongodb\\Session: хранение сессии в [MongoDB](https://www.mongodb.com/).

Все эти классы поддерживают одинаковый набор методов API. В результате вы можете переключаться между различными хранилищами сессий без модификации кода приложения.

> **Примечание:** Если вы хотите получить данные из переменной `$_SESSION` при использовании пользовательского хранилища, вы должны быть уверены, что сессия уже стартовала [yii\\web\\Session::open()](https://www.yiiframework.com/doc/api/2.0/yii-web-session#open()-detail), в связи с тем, что обработчики хранения пользовательских сессий регистрируются в этом методе.

Чтобы узнать, как настроить и использовать эти компоненты, обратитесь к документации по API. Ниже приведен пример конфигурации [yii\\web\\DbSession](https://www.yiiframework.com/doc/api/2.0/yii-web-dbsession) для использования базы данных для хранения сессии:

```php
return [ 'components' => [ 'session' => [ 'class' => 'yii\web\DbSession', // 'db' => 'mydb', // ID компонента для взаимодействия с БД. По умолчанию 'db'. // 'sessionTable' => 'my_session', // название таблицы для хранения данных сессии. По умолчанию 'session'. ], ], ];
```

Также необходимо создать таблицу для хранения данных сессии:

```sql
CREATE TABLE session ( id CHAR(40) NOT NULL PRIMARY KEY, expire INTEGER, data BLOB )
```

где 'BLOB' соответствует типу данных предпочитаемой вами DBMS. Ниже приведены примеры соответствия типов BLOB в наиболее популярных DBMS:

-   MySQL: LONGBLOB
-   PostgreSQL: BYTEA
-   MSSQL: BLOB

> **Примечание:** В зависимости от настроек параметра `session.hash_function` в вашем php.ini, может понадобиться изменить длину поля `id`. Например, если `session.hash_function=sha256`, нужно установить длину поля в 64 вместо 40.

### Flash-сообщения

Flash-сообщения - это особый тип данных в сессии, которые устанавливаются один раз во время запроса и доступны только на протяжении следующего запроса, затем они автоматически удаляются. Такой способ хранения информации в сессии наиболее часто используется для реализации сообщений, которые будут отображены конечному пользователю один раз, например подтверждение об успешной отправке формы.

Установить и получить flash-сообщения можно через компонент приложения `session`. Например:

```php
$session = Yii::$app->session; // Запрос #1 // установка flash-сообщения с названием "postDeleted" $session->setFlash('postDeleted', 'Вы успешно удалили пост.'); // Запрос #2 // отображение flash-сообщения "postDeleted" echo $session->getFlash('postDeleted'); // Запрос #3 // переменная $result будет иметь значение false, так как flash-сообщение было автоматически удалено $result = $session->hasFlash('postDeleted');
```

Так как flash-сообщения хранятся в сессии как обычные данные, в них можно записывать произвольную информацию, и она будет доступна лишь в следующем запросе.

При вызове [yii\\web\\Session::setFlash()](https://www.yiiframework.com/doc/api/2.0/yii-web-session#setFlash()-detail), происходит перезаписывание flash-сообщений c таким же названием. Для того, чтобы добавить новые данные к уже существующему flash-сообщению, необходимо вызвать [yii\\web\\Session::addFlash()](https://www.yiiframework.com/doc/api/2.0/yii-web-session#addFlash()-detail). Например:

```php
$session = Yii::$app->session; // Запрос #1 // добавить новое flash-сообщение с названием "alerts" $session->addFlash('alerts', 'Вы успешно удалили пост.'); $session->addFlash('alerts', 'Вы успешно добавили нового друга.'); $session->addFlash('alerts', 'Благодарим.'); // Запрос #2 // Переменная $alerts теперь содержит массив flash-сообщений с названием "alerts" $alerts = $session->getFlash('alerts');
```

> **Примечание:** Старайтесь не использовать [yii\\web\\Session::setFlash()](https://www.yiiframework.com/doc/api/2.0/yii-web-session#setFlash()-detail) совместно с [yii\\web\\Session::addFlash()](https://www.yiiframework.com/doc/api/2.0/yii-web-session#addFlash()-detail) для flash-сообщений с одинаковым названием. Это связано с тем, что последний метод автоматически преобразует хранимые данные в массив, чтобы иметь возможность хранить и добавлять новые данные в flash-сообщения с тем же названием. В результате, при вызове [yii\\web\\Session::getFlash()](https://www.yiiframework.com/doc/api/2.0/yii-web-session#getFlash()-detail) можно обнаружить, что возвращается массив, в то время как ожидалась строка.

## Куки

Yii представляет каждую куку как объект [yii\\web\\Cookie](https://www.yiiframework.com/doc/api/2.0/yii-web-cookie). Оба компонента приложения [yii\\web\\Request](https://www.yiiframework.com/doc/api/2.0/yii-web-request) и [yii\\web\\Response](https://www.yiiframework.com/doc/api/2.0/yii-web-response) поддерживают коллекции кук через свойство `cookies`. В первом случае коллекция кук является их представлением из HTTP-запроса, во втором - представляет куки, которые будут отправлены пользователю.

### Чтение кук

Получить куки из текущего запроса можно следующим образом:

```php
// получение коллекции кук (yii\web\CookieCollection) из компонента "request" $cookies = Yii::$app->request->cookies; // получение куки с названием "language. Если кука не существует, "en" будет возвращено как значение по-умолчанию. $language = $cookies->getValue('language', 'en'); // альтернативный способ получения куки "language" if (($cookie = $cookies->get('language')) !== null) { $language = $cookie->value; } // теперь переменную $cookies можно использовать как массив if (isset($cookies['language'])) { $language = $cookies['language']->value; } // проверка на существование куки "language" if ($cookies->has('language')) ... if (isset($cookies['language'])) ...
```

### Отправка кук

Отправить куку конечному пользователю можно следующим образом:

```php
// получение коллекции (yii\web\CookieCollection) из компонента "response" $cookies = Yii::$app->response->cookies; // добавление новой куки в HTTP-ответ $cookies->add(new \yii\web\Cookie([ 'name' => 'language', 'value' => 'zh-CN', ])); // удаление куки... $cookies->remove('language'); // ...что эквивалентно следующему: unset($cookies['language']);
```

Кроме свойств [name](https://www.yiiframework.com/doc/api/2.0/yii-web-cookie#$name-detail) и [value](https://www.yiiframework.com/doc/api/2.0/yii-web-cookie#$value-detail), класс [yii\\web\\Cookie](https://www.yiiframework.com/doc/api/2.0/yii-web-cookie) также предоставляет ряд свойств для получения информации о куках: [domain](https://www.yiiframework.com/doc/api/2.0/yii-web-cookie#$domain-detail), [expire](https://www.yiiframework.com/doc/api/2.0/yii-web-cookie#$expire-detail). Эти свойства можно сконфигурировать и затем добавить куку в коллекцию для HTTP-ответа.

> **Примечание:** Для большей безопасности значение свойства [yii\\web\\Cookie::$httpOnly](https://www.yiiframework.com/doc/api/2.0/yii-web-cookie#$httpOnly-detail) по умолчанию установлено в `true`. Это уменьшает риски доступа к защищенной куке на клиентской стороне (если браузер поддерживает такую возможность). Вы можете обратиться к [httpOnly wiki](https://owasp.org/www-community/HttpOnly) для дополнительной информации.

### Валидация кук

Во время записи и чтения кук через компоненты `request` и `response`, как будет показано в двух последующих подразделах, фреймворк предоставляет автоматическую валидацию, которая обеспечивает защиту кук от модификации на стороне клиента. Это достигается за счет подписи каждой куки секретным ключом, позволяющим приложению распознать куку, которая была модифицирована на клиентской стороне. В таком случае кука НЕ БУДЕТ доступна через свойство [cookie collection](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$cookies-detail) компонента `request`.

> **Примечание:** Валидация кук защищает только от их модификации. Если валидация не была пройдена, получить доступ к кукам все еще можно через глобальную переменную `$_COOKIE`. Это связано с тем, что дополнительные пакеты и библиотеки могут манипулировать куками без вызова валидации, которую обеспечивает Yii.

По-умолчанию валидация кук включена. Её можно отключить, установив свойство [yii\\web\\Request::$enableCookieValidation](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$enableCookieValidation-detail) в `false`, однако мы настоятельно не рекомендуем это делать.

> **Примечание:** Куки, которые напрямую читаются/пишутся через `$_COOKIE` и `setcookie()` НЕ БУДУТ валидироваться.

При использовании валидации кук необходимо указать значение свойства [yii\\web\\Request::$cookieValidationKey](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$cookieValidationKey-detail), которое будет использовано для генерации вышеупомянутого секретного ключа. Это можно сделать, настроив компонент `request` в конфигурации приложения:

```php
return [ 'components' => [ 'request' => [ 'cookieValidationKey' => 'fill in a secret key here', ], ], ];
```

> **Примечание:** Свойство [cookieValidationKey](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$cookieValidationKey-detail) является секретным значением и должно быть известно только людям, которым вы доверяете. Не помещайте эту информацию под систему контроля версий.
