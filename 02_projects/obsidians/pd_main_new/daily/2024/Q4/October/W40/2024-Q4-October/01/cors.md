---
author: Frolov Anatolui
date: 2024-10-01
time: 20:10:10
aliases: 
- 
tags:
- unique-note
---


Ошибка, которую вы видите, связана с политикой безопасности браузеров, называемой CORS (Cross-Origin Resource Sharing). Браузеры блокируют запросы, если сервер не предоставляет правильные заголовки, позволяющие доступ с других доменов. В вашем случае, сервер на `https://http.hexlet.app` не возвращает заголовок `Access-Control-Allow-Origin`, что вызывает блокировку.

### Варианты решения:

1. **Добавить заголовок CORS на стороне сервера:**
   Если у вас есть доступ к серверу, добавьте заголовок `Access-Control-Allow-Origin: *` (или укажите конкретный домен вместо `*`), чтобы разрешить доступ с других доменов.

2. **Использовать серверный прокси:**
   Если вы не можете изменить сервер, попробуйте сделать запрос через серверный прокси, который будет выступать посредником между вашим клиентским кодом и удаленным сервером. Серверный код не подчиняется CORS-ограничениям, так как CORS проверяется только на уровне браузера.

3. **Локальное тестирование с отключенной проверкой CORS:**
   В некоторых случаях можно временно отключить проверку CORS в браузере (например, через специальные флаги запуска Chrome), но это решение не подходит для продакшн среды.

4. **JSONP (если сервер поддерживает):**
   Это устаревший метод, который можно использовать для обхода CORS в GET-запросах. Однако его использование ограничено и небезопасно, поэтому он не рекомендуется.

Вот пример, как можно использовать серверный прокси с Node.js и Express для обработки CORS:

```javascript
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

app.get('/proxy', async (req, res) => {
    const apiUrl = 'https://http.hexlet.app/http-api/users';
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Теперь вы можете изменить запрос в вашем клиентском коде, чтобы делать его на ваш локальный сервер (например, на `/proxy`):

```javascript
async function getData() {
    const url = "http://localhost:3000/proxy";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
}
```

Это устранит проблему с CORS на стороне клиента.