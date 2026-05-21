---
created: 2024-02-17T19:47:54 (UTC +03:00)
tags: []
source: https://www.yiiframework.com/doc/guide/2.0/ru/runtime-requests
author: 
tags:
 - web
 - firefox
---
[[books/2024-02-17]]

# Обработка запросов: Запросы | Полное руководство по Yii 2.0 | Yii PHP Framework

> ## Excerpt
> Запросы, сделанные к приложению, представлены в терминах yii\web\Request объектов, которые предоставляют информацию о параметрах запроса, HTTP заголовках, cookies и т.д. Для получения доступа к текущему запросу вы должны обратиться к объекту request application component, который по умолчанию является экземпляром yii\web\Request.

---
## Запросы

Запросы, сделанные к приложению, представлены в терминах [yii\\web\\Request](https://www.yiiframework.com/doc/api/2.0/yii-web-request) объектов, которые предоставляют информацию о параметрах запроса, HTTP заголовках, cookies и т.д. Для получения доступа к текущему запросу вы должны обратиться к объекту `request` [application component](https://www.yiiframework.com/doc/guide/2.0/ru/structure-application-components), который по умолчанию является экземпляром [yii\\web\\Request](https://www.yiiframework.com/doc/api/2.0/yii-web-request).

## Параметры запроса

Чтобы получить параметры запроса, вы должны вызвать методы [get()](https://www.yiiframework.com/doc/api/2.0/yii-web-request#get()-detail) и [post()](https://www.yiiframework.com/doc/api/2.0/yii-web-request#post()-detail) компонента `request`. Они возвращают значения переменных `$_GET` и `$_POST` соответственно. Например,

```php
$request = Yii::$app->request; $get = $request->get(); // эквивалентно: $get = $_GET; $id = $request->get('id'); // эквивалентно: $id = isset($_GET['id']) ? $_GET['id'] : null; $id = $request->get('id', 1); // эквивалентно: $id = isset($_GET['id']) ? $_GET['id'] : 1; $post = $request->post(); // эквивалентно: $post = $_POST; $name = $request->post('name'); // эквивалентно: $name = isset($_POST['name']) ? $_POST['name'] : null; $name = $request->post('name', ''); // эквивалентно: $name = isset($_POST['name']) ? $_POST['name'] : '';
```

> **Информация:** Вместо того, чтобы обращаться напрямую к переменным `$_GET` и `$_POST` для получения параметров запроса, рекомендуется чтобы вы обращались к ним через компонент `request` как было показано выше. Это упростит написание тестов, поскольку вы можете создать mock компонент запроса с не настоящими данными запроса.

При реализации [RESTful API](https://www.yiiframework.com/doc/guide/2.0/ru/rest-quick-start), зачастую вам требуется получить параметры, которые были отправлены через PUT, PATCH или другие [методы запроса](https://www.yiiframework.com/doc/guide/2.0/ru/runtime-requests#request-methods). Вы можете получить эти параметры, вызвав метод [yii\\web\\Request::getBodyParam()](https://www.yiiframework.com/doc/api/2.0/yii-web-request#getBodyParam()-detail). Например,

```php
$request = Yii::$app->request; // возвращает все параметры $params = $request->bodyParams; // возвращает параметр "id" $param = $request->getBodyParam('id');
```

> **Информация:** В отличие от `GET` параметров, параметры, которые были переданы через `POST`, `PUT`, `PATCH` и д.р. отправляются в теле запроса. Компонент `request` будет обрабатывать эти параметры, когда вы попробуете к ним обратиться через методы, описанные выше. Вы можете настроить способ обработки этих параметров через настройку свойства [yii\\web\\Request::$parsers](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$parsers-detail).

## Методы запроса

Вы можете получить названия HTTP метода, используемого в текущем запросе, обратившись к выражению `Yii::$app->request->method`. Также имеется целый набор логических свойств для проверки соответствует ли текущий метод определённому типу запроса. Например,

```php
$request = Yii::$app->request; if ($request->isAjax) { /* текущий запрос является AJAX запросом */ } if ($request->isGet) { /* текущий запрос является GET запросом */ } if ($request->isPost) { /* текущий запрос является POST запросом */ } if ($request->isPut) { /* текущий запрос является PUT запросом */ }
```

## URL запроса

Компонент `request` предоставляет множество способов изучения текущего запрашиваемого URL.

Если предположить, что URL запроса будет `https://example.com/admin/index.php/product?id=100`, то вы можете получить различные части этого адреса так как это показано ниже:

-   [url](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$url-detail): вернёт адрес `/admin/index.php/product?id=100`, который содержит URL без информации об имени хоста.
-   [absoluteUrl](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$absoluteUrl-detail): вернёт адрес `https://example.com/admin/index.php/product?id=100`, который содержит полный URL, включая имя хоста.
-   [hostInfo](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$hostInfo-detail): вернёт адрес `https://example.com`, который содержит только имя хоста.
-   [pathInfo](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$pathInfo-detail): вернёт адрес `/product`, который содержит часть между адресом начального скрипта и параметрами запроса, идущих после знака вопроса.
-   [queryString](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$queryString-detail): вернёт адрес `id=100`, который содержит часть URL после знака вопроса.
-   [baseUrl](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$baseUrl-detail): вернёт адрес `/admin`, который является частью URL после информации о хосте и перед именем входного скрипта.
-   [scriptUrl](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$scriptUrl-detail): вернёт адрес `/admin/index.php`, который содержит URL без информации о хосте и параметрах запроса.
-   [serverName](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$serverName-detail): вернёт адрес `example.com`, который содержит имя хоста в URL.
-   [serverPort](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$serverPort-detail): вернёт 80, что является адресом порта, который использует веб-сервер.

Вы можете получить информацию о HTTP заголовках через [header collection](https://www.yiiframework.com/doc/api/2.0/yii-web-headercollection), возвращаемыми свойством [yii\\web\\Request::$headers](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$headers-detail). Например,

```php
// переменная $headers является объектом yii\web\HeaderCollection $headers = Yii::$app->request->headers; // возвращает значения заголовка Accept $accept = $headers->get('Accept'); if ($headers->has('User-Agent')) { /* в запросе есть заголовок User-Agent */ }
```

Компонент `request` также предоставляет доступ к некоторым часто используемым заголовкам, включая

-   [userAgent](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$userAgent-detail): возвращает значение заголовка `User-Agent`.
-   [contentType](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$contentType-detail): возвращает значение заголовка `Content-Type`, который указывает на MIME тип данных в теле запроса.
-   [acceptableContentTypes](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$acceptableContentTypes-detail): возвращает список MIME типов данных, которые принимаются пользователем. Возвращаемый список типов будет отсортирован по показателю качества. Типы с более высокими показателями будут первыми в списке.
-   [acceptableLanguages](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$acceptableLanguages-detail): возвращает языки, которые поддерживает пользователь. Список языков будет отсортирован по уровню предпочтения. Наиболее предпочитаемый язык будет первым в списке.

Если ваше приложение поддерживает множество языков и вы хотите показать страницу на языке, который предпочитает пользователь, то вы можете воспользоваться языковым методом согласования (negotiation) [yii\\web\\Request::getPreferredLanguage()](https://www.yiiframework.com/doc/api/2.0/yii-web-request#getPreferredLanguage()-detail). Этот метод принимает список поддерживаемых языков в вашем приложении, сравнивает их с [acceptableLanguages](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$acceptableLanguages-detail) и возвращает наиболее подходящий язык.

> **Подсказка:** Вы также можете использовать фильтр [ContentNegotiator](https://www.yiiframework.com/doc/api/2.0/yii-filters-contentnegotiator) для динамического определения какой тип содержимого и язык должен использоваться в ответе. Фильтр реализует согласование содержимого на основе свойств и методов, описанных выше.

## Информация о клиенте

Вы можете получить имя хоста и IP адрес пользователя через свойства [userHost](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$userHost-detail) и [userIP](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$userIP-detail) соответственно. Например,

```php
$userHost = Yii::$app->request->userHost; $userIP = Yii::$app->request->userIP;
```

## Доверенные прокси и заголовки

В предыдущем разделе вы видели, как получить информацию о пользователе, такую как хост и IP-адрес. Это будет работать из коробки в обычной установке, где один веб-сервер используется для обслуживания веб-сайта. Однако если ваше приложение работает за обратным прокси-сервером, вам нужно дополнить конфигурацию, поскольку клиентом теперь является прокси-сервер, а IP-адрес пользователя передаётся приложению с помощью заголовка, установленного им.

Вы не должны слепо доверять заголовкам, предоставленным прокси, если вы явно не доверяете прокси. Начиная с 2.0.13, Yii поддерживает настройку доверенных прокси через следующие свойства компонента `request`: [trustedHosts](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$trustedHosts-detail), [secureHeaders](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$secureHeaders-detail), [ipHeaders](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$ipHeaders-detail) и [secureProtocolHeaders](https://www.yiiframework.com/doc/api/2.0/yii-web-request#$secureProtocolHeaders-detail)

Ниже приведена конфигурация компонента `request` для приложения, которое работает за рядом обратных прокси, расположенных в IP-сети `10.0.2.0/24`:

```php
'request' => [ // ... 'trustedHosts' => [ '10.0.2.0/24', ], ],
```

IP-адрес, по умолчанию, отправляется прокси-сервером в заголовке `X-Forwarded-For`, а протокол (`http` или `https`) отправляется в `X-Forwarded-Proto`. Если ваши прокси используют другие заголовки, вы можете использовать конфигурацию компонента `request` для их настройки, например:

```php
'request' => [ // ... 'trustedHosts' => [ '10.0.2.0/24' => [ 'X-ProxyUser-Ip', 'Front-End-Https', ], ], 'secureHeaders' => [ 'X-Forwarded-For', 'X-Forwarded-Host', 'X-Forwarded-Proto', 'X-Proxy-User-Ip', 'Front-End-Https', ], 'ipHeaders' => [ 'X-Proxy-User-Ip', ], 'secureProtocolHeaders' => [ 'Front-End-Https' => ['on'] ], ],
```

В приведенной выше конфигурации все заголовки, перечисленные в `secureHeaders`, отфильтровываются из запроса, кроме заголовков `X-ProxyUser-Ip` и `Front-End-Https` в случае, если запрос создан прокси. В этом случае первый используется для получения IP-адреса пользователя, настроенного в `ipHeaders`, а последний будет использоваться для определения результата [yii\\web\\Request::getIsSecureConnection()](https://www.yiiframework.com/doc/api/2.0/yii-web-request#getIsSecureConnection()-detail).
