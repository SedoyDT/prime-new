
#W_WebApi
#WebApi

#telegram 

# **🤔**** Что такое virtual dom?**
<!-- basicblock-start oid="ObsbPIFociOJyD407kVyspRS"  deck='W_WebApi' -->
**🤔**** Что такое virtual dom?**::


Virtual DOM — это легковесное представление реального DOM, которое используется для оптимизации обновлений пользовательского интерфейса. При изменении состояния приложения, виртуальный DOM обновляется сначала, после чего вычисляются минимальные изменения для реального DOM. Это позволяет сократить количество операций с реальным DOM, которые могут быть затратными. Virtual DOM широко используется в библиотеках, таких как React.

Ставь 👍 если знал ответ, 🔥 если нет
Забирай [📚Базу Знаний](https://t.me/easy_frontend_tests/525)
<!-- basicblock-end -->




#W_WebApi
#WebApi

#telegram 

# - **loadPage(page)**: Эта функция обновляет содержимое страницы и добавляет новое состояние в историю с помощью `pushState`.
<!-- basicblock-start oid="ObsMidWh0B2RkGzIzHBVVI5R"  deck='W_WebApi' -->
- **loadPage(page)**: Эта функция обновляет содержимое страницы и добавляет новое состояние в историю с помощью `pushState`.::

- **popstate**: Это событие срабатывает, когда пользователь переходит к предыдущей или следующей странице в истории. Оно позволяет загружать нужное содержимое, сохраняя при этом состояние.

### Итоги

Использование методов `history` позволяет создать плавный интерфейс с поддержкой навигации, которая не требует перезагрузки страницы. Это особенно полезно для одностраничных приложений (SPA) и динамически загружаемых контентов.
<!-- basicblock-end -->




#W_WebApi
#WebApi

#telegram 

# Покажи примеры работы с history back go?
<!-- basicblock-start oid="Obs4BstJJRFSM5vkoiZmqsQ2"  deck='W_WebApi' -->
Покажи примеры работы с history back go?::


Работа с `history` в JavaScript позволяет управлять историей посещенных страниц в браузере. Основные методы, которые мы будем использовать, это `history.back()`, `history.forward()`, и `history.go()`. 

Вот примеры, показывающие, как они работают:

### Пример 1: Использование `history.back()`

Этот метод возвращает на одну страницу назад в истории браузера.

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>History Back Example</title>
</head>
<body>
    <h1>History Back Example</h1>
    <button id="back-button">Назад</button>
    <script>
        document.getElementById('back-button').addEventListener('click', () => {
            history.back(); // Возвращает на предыдущую страницу
        });
    </script>
</body>
</html>
```

### Пример 2: Использование `history.forward()`

Этот метод возвращает на одну страницу вперед в истории браузера.

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>History Forward Example</title>
</head>
<body>
    <h1>History Forward Example</h1>
    <button id="forward-button">Вперед</button>
    <script>
        document.getElementById('forward-button').addEventListener('click', () => {
            history.forward(); // Переходит на следующую страницу
        });
    </script>
</body>
</html>
```

### Пример 3: Использование `history.go()`

Метод `history.go()` позволяет переходить к любой странице в истории, используя целое число в качестве аргумента. Например, `-1` вернет на одну страницу назад, `1` — вперед, а `0` обновит текущую страницу.

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>History Go Example</title>
</head>
<body>
    <h1>History Go Example</h1>
    <button id="go-back-button">Назад</button>
    <button id="go-forward-button">Вперед</button>
    <button id="refresh-button">Обновить</button>
    <script>
        document.getElementById('go-back-button').addEventListener('click', () => {
            history.go(-1); // Возвращает на предыдущую страницу
        });

        document.getElementById('go-forward-button').addEventListener('click', () => {
            history.go(1); // Переходит на следующую страницу
        });

        document.getElementById('refresh-button').addEventListener('click', () => {
            history.go(0); // Обновляет текущую страницу
        });
    </script>
</body>
</html>
```

### Пример 4: Обработка `popstate` для управления состоянием

Когда вы используете методы `pushState` или `replaceState`, вы можете также обрабатывать события `popstate`, чтобы реагировать на навигацию назад и вперед.

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Popstate Example</title>
</head>
<body>
    <h1>Popstate Example</h1>
    <button id="go-to-page-1">Перейти на страницу 1</button>
    <button id="go-to-page-2">Перейти на страницу 2</button>

    <div id="content"></div>

    <script>
        function loadPage(page) {
            document.getElementById('content').innerText = `Содержимое страницы ${page}`;
            history.pushState({ page: page }, '', `?page=${page}`);
        }

        window.addEventListener('popstate', (event) => {
            if (event.state) {
                loadPage(event.state.page);
            }
        });

        document.getElementById('go-to-page-1').addEventListener('click', () => {
            loadPage(1);
        });

        document.getElementById('go-to-page-2').addEventListener('click', () => {
            loadPage(2);
        });
    </script>
</body>
</html>
```

### Объяснение кода:
<!-- basicblock-end -->




# history api
<!-- basicblock-start oid="Obs2KIIrMdK5ZscMh9AFyAcG"  deck='W_WebApi' -->
Что можно сказать про history api?::

API History позволяет веб-сайту взаимодействовать с историей сессии браузера — списком страниц, которые пользователь посещал в данном окне. По мере того как пользователь посещает новые страницы, например, кликая по ссылкам, эти страницы добавляются в историю сессии. Пользователь также может перемещаться назад и вперед по истории с помощью кнопок "Назад" и "Вперед" в браузере.

Основной интерфейс, определяемый в API History, — это интерфейс `History`, который включает два набора методов:

1. Методы для навигации по страницам в истории сессии:
   - `History.back()`
   - `History.forward()`
   - `History.go()`
2. Методы для изменения истории сессии:
   - `History.pushState()`
   - `History.replaceState()`

В этом руководстве мы рассмотрим второй набор методов, так как их поведение сложнее.

Метод `pushState()` добавляет новую запись в историю сессии, тогда как метод `replaceState()` обновляет текущую запись истории. Оба этих метода принимают параметр состояния, который может содержать любой сериализуемый объект. Когда браузер переходит к этой записи истории, он инициирует событие `popstate`, содержащее объект состояния, связанный с этой записью.

Основное назначение этих API — поддержка веб-сайтов, таких как одностраничные приложения (SPA), которые используют JavaScript API, например, `fetch()`, для обновления страницы новым контентом без загрузки новой страницы.

### Одностраничные приложения и история сессии

Традиционно сайты реализуются как набор страниц. Когда пользователь переходит на разные части сайта, кликая по ссылкам, браузер загружает каждую страницу заново.

Хотя это работает для многих сайтов, у такого подхода есть недостатки:
- Загружать всю страницу каждый раз неэффективно, если нужно обновить только её часть.
- Сложно поддерживать состояние приложения при навигации между страницами.

Для решения этих проблем популярным шаблоном является одностраничное приложение (SPA), в котором сайт состоит из одной страницы. Когда пользователь кликает по ссылкам, страница:
- Предотвращает стандартное поведение загрузки новой страницы.
- Загружает новый контент.
- Обновляет страницу новым контентом.

Пример:

```javascript
document.addEventListener("click", async (event) => {
  const creature = event.target.getAttribute("data-creature");
  if (creature) {
    // Предотвращаем загрузку новой страницы
    event.preventDefault();
    try {
      // Загружаем новый контент
      const response = await fetch(`creatures/${creature}.json`);
      const json = await response.json();
      // Обновляем страницу новым контентом
      displayContent(json);
    } catch (err) {
      console.error(err);
    }
  }
});
```

Файл JSON может выглядеть так:

```json
{
  "description": "Белоголовые орланы на самом деле не лысые.",
  "image": {
    "src": "images/eagle.jpg",
    "alt": "Белоголовый орлан"
  },
  "name": "Орлан"
}
```

Функция `displayContent()` обновляет страницу новым контентом:

```javascript
// Обновляем страницу новым контентом
function displayContent(content) {
  document.title = `Creatures: ${content.name}`;

  const description = document.querySelector("#description");
  description.textContent = content.description;

  const photo = document.querySelector("#photo");
  photo.setAttribute("src", content.image.src);
  photo.setAttribute("alt", content.image.alt);
}
```

Проблема в том, что это нарушает ожидаемое поведение кнопок "Назад" и "Вперед" в браузере.

С точки зрения пользователя, он кликнул по ссылке, и страница обновилась, поэтому кажется, что открылась новая страница. Если затем он нажимает кнопку "Назад", он ожидает вернуться на состояние до клика по ссылке. Но для браузера новая страница не была загружена, поэтому "Назад" вернёт его на страницу, которая была загружена перед открытием SPA.

Эту проблему решают методы `pushState()`, `replaceState()` и событие `popstate`. Они позволяют синтезировать записи истории и получать уведомления, когда текущая запись изменяется (например, при нажатии кнопок "Назад" или "Вперед").

### Использование `pushState()`

Мы можем добавить запись в историю в нашем обработчике кликов так:

```javascript
document.addEventListener("click", async (event) => {
  const creature = event.target.getAttribute("data-creature");
  if (creature) {
    event.preventDefault();
    try {
      const response = await fetch(`creatures/${creature}.json`);
      const json = await response.json();
      displayContent(json);
      // Добавляем новую запись в историю
      history.pushState(json, "", creature);
    } catch (err) {
      console.error(err);
    }
  }
});
```

### Использование события `popstate`

Предположим, пользователь:

- Кликнул по ссылке в нашем SPA, обновил страницу и добавил запись A в историю с помощью `pushState()`.
- Кликнул по другой ссылке, обновил страницу и добавил запись B.
- Нажал кнопку "Назад".

Теперь новая текущая запись — это запись A. Браузер инициирует событие `popstate`, и в его аргументе будет JSON, переданный в `pushState()` при навигации к A.

Мы можем восстановить правильный контент с помощью такого обработчика:

```javascript
// Обрабатываем кнопки "Назад" и "Вперед"
window.addEventListener("popstate", (event) => {
  if (event.state) {
    displayContent(event.state);
  }
});
```

### Использование `replaceState()`

Когда пользователь загружает SPA, браузер добавляет запись в историю, но эта запись не содержит состояния. Решение — использовать `replaceState()`:

```javascript
const image = document.querySelector("#photo");
const initialState = {
  description: document.querySelector("#description").textContent,
  image: {
    src: image.getAttribute("src"),
    alt: image.getAttribute("alt"),
  },
  name: "Home",
};
history.replaceState(initialState, "", document.location.href);
```

Когда пользователь вернётся на исходную точку, событие `popstate` будет содержать это начальное состояние, и мы можем обновить страницу.
<!-- basicblock-end -->




#W_WebApi
#WebApi

#telegram 

# fetch api
<!-- basicblock-start oid="ObsUkpmcP3AkPsI7EvUbTHAz"  deck='W_WebApi' -->
Что можно сказать про fetch API::

API Fetch предоставляет интерфейс JavaScript для выполнения HTTP-запросов и обработки ответов.

Fetch является современной заменой XMLHttpRequest: в отличие от XMLHttpRequest, который использует обратные вызовы (callbacks), Fetch основан на промисах (promises) и интегрирован с такими функциями современных веб-технологий, как сервис-воркеры и кросс-доменные запросы (CORS).

С помощью Fetch API вы отправляете запрос, вызвав функцию `fetch()`, которая доступна как глобальная функция в контексте как окна, так и воркера. Вы передаете ей объект `Request` или строку с URL, который нужно получить, а также необязательный аргумент для настройки запроса.

Функция `fetch()` возвращает промис, который разрешается объектом `Response`, представляющим ответ сервера. Затем можно проверить статус запроса и извлечь тело ответа в различных форматах, таких как текст или JSON, вызвав соответствующий метод объекта ответа.

Пример минимальной функции, использующей `fetch()` для получения JSON-данных с сервера:

```js
async function getData() {
  const url = "https://example.org/products.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Статус ответа: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}
```

Мы объявляем строку, содержащую URL, затем вызываем `fetch()`, передавая URL без дополнительных опций.

Функция `fetch()` отклоняет промис при некоторых ошибках, но не в случае, если сервер возвращает ошибочный статус, например 404. Поэтому мы также проверяем статус ответа и выбрасываем ошибку, если он не OK.

Если статус нормальный, мы получаем содержимое тела ответа в формате JSON, вызывая метод `json()` объекта `Response`, и выводим его в консоль. Обратите внимание, что, как и сама функция `fetch()`, метод `json()` является асинхронным, как и все другие методы для доступа к содержимому тела ответа.

### Выполнение запроса

Чтобы выполнить запрос, вызовите `fetch()`, передав:

- определение ресурса, который нужно получить. Это может быть:
  - строка с URL;
  - объект, например, экземпляр `URL`, который может быть преобразован в строку с URL;
  - экземпляр `Request`;
- необязательный объект, содержащий параметры для настройки запроса.

В этом разделе мы рассмотрим наиболее часто используемые параметры. Чтобы узнать о всех параметрах, которые можно передать, см. страницу справки по `fetch()`.

### Установка метода

По умолчанию `fetch()` выполняет запрос с методом `GET`, но вы можете использовать параметр `method`, чтобы указать другой метод запроса:

```js
const response = await fetch("https://example.org/post", {
  method: "POST",
  // ...
});
```

Если параметр `mode` установлен в `no-cors`, метод должен быть одним из `GET`, `POST` или `HEAD`.

### Установка тела запроса

Тело запроса – это данные, которые клиент отправляет на сервер. Вы не можете включать тело в запросы с методом `GET`, но это полезно для запросов, отправляющих контент на сервер, например, `POST` или `PUT`. Например, если вы хотите загрузить файл на сервер, можно выполнить запрос с методом `POST` и включить файл в тело запроса.

Чтобы установить тело запроса, передайте его в параметр `body`:

```js
const response = await fetch("https://example.org/post", {
  body: JSON.stringify({ username: "example" }),
  // ...
});
```

Вы можете передавать тело запроса в виде экземпляра одного из следующих типов:

- строка (`string`);
- `ArrayBuffer`;
- `TypedArray`;
- `DataView`;
- `Blob`;
- `File`;
- `URLSearchParams`;
- `FormData`.

Обратите внимание, что тело запросов и ответов является потоками (streams), и запрос читает поток, поэтому если запрос содержит тело, его нельзя отправить дважды:

```js
const request = new Request("https://example.org/post", {
  method: "POST",
  body: JSON.stringify({ username: "example" }),
});

const response1 = await fetch(request);
console.log(response1.status);

// Вызовет ошибку: "Тело уже было прочитано."
const response2 = await fetch(request);
console.log(response2.status);
```

Вместо этого вам нужно создать клон запроса перед отправкой:

```js
const request1 = new Request("https://example.org/post", {
  method: "POST",
  body: JSON.stringify({ username: "example" }),
});

const request2 = request1.clone();

const response1 = await fetch(request1);
console.log(response1.status);

const response2 = await fetch(request2);
console.log(response2.status);
```

### Установка заголовков

Заголовки запроса предоставляют серверу информацию о запросе. Например, заголовок `Content-Type` сообщает серверу формат тела запроса. Многие заголовки устанавливаются браузером автоматически и не могут быть изменены скриптом – такие заголовки называются запрещенными (Forbidden header names).

Чтобы установить заголовки запроса, присвойте их параметру `headers`.

Вы можете передать объект с парой "имя-заголовка: значение-заголовка":

```js
const response = await fetch("https://example.org/post", {
  headers: {
    "Content-Type": "application/json",
  },
  // ...
});
```

Или можно создать объект `Headers`, добавить заголовки в этот объект с помощью метода `Headers.append()`, а затем передать объект в параметр `headers`:

```js
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const response = await fetch("https://example.org/post", {
  headers: myHeaders,
  // ...
});
```

Если параметр `mode` установлен в `no-cors`, можно устанавливать только заголовки, разрешенные для CORS-запросов.

### Выполнение запросов с методом POST

Мы можем объединить параметры `method`, `body` и `headers`, чтобы выполнить запрос с методом `POST`:

```js
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const response = await fetch("https://example.org/post", {
  method: "POST",
  body: JSON.stringify({ username: "example" }),
  headers: myHeaders,
});
```

<!-- basicblock-end -->



