
#ign_my_js
#my_js

#telegram 

# Создание одностраничного приложения (SPA) на чистом JavaScript можно сделать с помощью HTML, CSS и JavaScript без использования фреймворков. Ниже приведен пример базового SPA с использованием простого роутинга.
<!-- basicblock-start  deck='ign_my_js' -->
Создание одностраничного приложения (SPA) на чистом JavaScript можно сделать с помощью HTML, CSS и JavaScript без использования фреймворков. Ниже приведен пример базового SPA с использованием простого роутинга.::


### Шаги по созданию простого SPA

1. **Создайте структуру проекта:**

   ```

   my-spa/
   ├── index.html
   ├── style.css
   └── app.js
   
```

2. **Создайте файл `index.html`:**

   ```
   <!DOCTYPE html>
   <html lang="ru">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Простое SPA на чистом JS</title>
       <link rel="stylesheet" href="style.css">
   </head>
   <body>
       <nav>
           <ul>
               <li><a href="#home">Главная</a></li>
               <li><a href="#about">О нас</a></li>
               <li><a href="#contact">Контакты</a></li>
           </ul>
       </nav>
       <div id="content"></div>

       <script src="app.js"></script>
   </body>
   </html>
   
```

3. **Создайте файл `style.css`:**

   ```
   body {
       font-family: Arial, sans-serif;
       margin: 0;
       padding: 0;
   }

   nav {
       background: #333;
       color: white;
       padding: 1em;
   }

   nav ul {
       list-style-type: none;
       padding: 0;
   }

   nav a {
       color: white;
       text-decoration: none;
       padding: 0.5em;
   }

   nav a:hover {
       background: #555;
   }

   #content {
       padding: 1em;
   }
   
```

4. **Создайте файл `app.js`:**

   ```
   // Функция для отображения контента в зависимости от хеша
   function renderContent() {
       const content = document.getElementById('content');
       const hash = window.location.hash.substring(1); // Получаем хеш без #
       
       let htmlContent = '';

       switch (hash) {
           case 'home':
               htmlContent = '<h1>Главная страница</h1><p>Добро пожаловать на главную страницу!</p>';
               break;
           case 'about':
               htmlContent = '<h1>О нас</h1><p>Это простое SPA приложение на чистом JavaScript.</p>';
               break;
           case 'contact':
               htmlContent = '<h1>Контакты</h1><p>Свяжитесь с нами по email@example.com.</p>';
               break;
           default:
               htmlContent = '<h1>404</h1><p>Страница не найдена.</p>';
       }

       content.innerHTML = htmlContent;
   }

   // Добавляем обработчик события при загрузке и изменении хеша
   window.addEventListener('load', renderContent);
   window.addEventListener('hashchange', renderContent);
   
```

### Объяснение кода

- **HTML**: Создает простую навигацию и контейнер для контента.
- **CSS**: Стили для улучшения внешнего вида приложения.
- **JavaScript**:
  - `renderContent()` - функция для отображения содержимого на основе текущего хеша URL. Использует `window.location.hash`, чтобы определить, какой контент показывать.
  - `window.addEventListener` используется для установки обработчиков событий на загрузку страницы и изменения хеша, чтобы обновлять содержимое при переходах.

### Запуск приложения

1. Откройте `index.html` в вашем веб-браузере.
2. Кликните по ссылкам в навигации, чтобы переключаться между разными «страницами» (контент будет обновляться без перезагрузки).

### Дальнейшие улучшения

Вы можете добавить больше функций и улучшений в ваше приложение:
- **Динамическая загрузка контента**: Используйте AJAX для загрузки контента с сервера.
- **История навигации**: Используйте `history.pushState()` для управления историей браузера.
- **Форма и валидация**: Добавьте формы с валидацией и обработкой данных.
- **Хранение состояния**: Используйте `localStorage` или `sessionStorage` для хранения состояния приложения.

Эти шаги помогут вам создать базовое одностраничное приложение на чистом JavaScript.
<!-- basicblock-end -->



