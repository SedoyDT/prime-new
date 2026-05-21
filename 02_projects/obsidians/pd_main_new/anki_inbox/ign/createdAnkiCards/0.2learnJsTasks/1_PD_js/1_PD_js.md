
#1_PD_js
#js

#telegram 

# Что делает contains?
<!-- basicblock-start oid="ObsqpDm32c9DP6V46Z7BzFx8"  deck='1_PD_js' -->
Что делает contains?::


const parentElement = document.getElementById('parent');
const childElement = document.getElementById('child');
undefined
parentElement.contains(childElement)
true
<!-- basicblock-end -->




#1_PD_js
#js

#telegram 

# **Зачем необходим dom ?**
<!-- basicblock-start oid="Obsrdt1Mm7jXOjJ3XOHyxy2q"  deck='1_PD_js' -->
**Зачем необходим dom ?**::

*Спросят с вероятностью 7%*

<u>DOM (Document Object Model)</u> необходим для взаимодействия с веб-страницами и управления их содержимым, структурой и стилями программным образом. DOM представляет собой программный интерфейс для HTML и XML документов. Он описывает логическую структуру документов и позволяет языкам программирования взаимодействовать с ними.

**Зачем он нужен**

1️⃣**Доступ к элементам страницы**: Позволяет программно получать доступ к элементам HTML-документа (теги, текст, атрибуты) и манипулировать ими.
2️⃣**Изменение содержимого**: С помощью него можно изменять содержимое страницы динамически, например, обновлять текст, менять изображения, добавлять или удалять элементы.
3️⃣**Обработка событий**: Позволяет обрабатывать события, такие как клики, нажатия клавиш, прокрутка и другие взаимодействия пользователя с веб-страницей.
4️⃣**Динамическое изменение структуры страницы**: Предоставляет методы для добавления, удаления и изменения элементов и атрибутов, что позволяет динамически изменять структуру страницы.
5️⃣**Интерактивность**: С помощью него можно создавать интерактивные веб-приложения, которые реагируют на действия пользователя без перезагрузки страницы.

**Как он работает** 

Представляет собой древовидную структуру, где каждый элемент страницы является узлом дерева. Вершиной дерева является объект `document`, который представляет весь HTML-документ. Узлы могут быть элементами (`<div>`, `<p>`, `<a>` и т.д.), текстом, комментариями и другими типами.

**Пример HTML-документа:**
```
<!DOCTYPE html>
<html>
<head>
  <title>Document Object Model</title>
</head>
<body>
  <h1>Hello, world!</h1>
  <p>This is a paragraph.</p>
</body>
</html>
```

**Структура для этого документа:**
```
document
 └── html
     ├── head
     │   └── title
     │       └── "Document Object Model"
     └── body
         ├── h1
         │   └── "Hello, world!"
         └── p
             └── "This is a paragraph."
```

**Основные методы и свойства**

1️⃣**Доступ к элементам**:
✅`document.getElementById(id)`: Возвращает элемент по его `id`.
✅`document.getElementsByClassName(className)`: Возвращает все элементы с указанным классом.
✅`document.getElementsByTagName(tagName)`: Возвращает все элементы с указанным тегом.
✅`document.querySelector(selector)`: Возвращает первый элемент, соответствующий CSS селектору.
✅`document.querySelectorAll(selector)`: Возвращает все элементы, соответствующие CSS селектору.

2️⃣**Создание и удаление элементов**:
✅`document.createElement(tagName)`: Создает новый элемент.
✅`parentElement.appendChild(childElement)`: Добавляет элемент в конец дочерних элементов родителя.
✅`parentElement.removeChild(childElement)`: Удаляет элемент из дочерних элементов родителя.

3️⃣**Изменение содержимого и атрибутов**:
✅`element.innerHTML`: Изменяет или получает HTML-содержимое элемента.
✅`element.textContent`: Изменяет или получает текстовое содержимое элемента.
✅`element.setAttribute(name, value)`: Устанавливает значение атрибута элемента.
✅`element.getAttribute(name)`: Получает значение атрибута элемента.

**Пример:**
```
// Изменение текста заголовка
const header = document.querySelector('h1');
header.textContent = 'Hello, DOM!';

// Добавление нового параграфа
const newParagraph = document.createElement('p');
newParagraph.textContent = 'This is a new paragraph.';
document.body.appendChild(newParagraph);

// Изменение атрибута
const link = document.querySelector('a');
link.setAttribute('href', 'https://www.example.com');
```

DOM необходим для программного доступа и управления содержимым веб-страницы. Он позволяет изменять текст, структуру, стили и обрабатывать события на странице.

👉 Можно посмотреть [Примеры как отвечают люди](https://easyoffer.ru/question/1871?utm_source=tg&utm_medium=my_group&utm_campaign=frontend) на этот вопрос, или перейти [К списку 1429 вопроса на Frontend разработчика.](https://easyoffer.ru/rating/frontend_developer?utm_source=tg&utm_medium=my_group&utm_campaign=frontend) Ставь 👍 если нравится контент

🔐 [База собесов](https://t.me/access_interview_bot) | 🔐 [База тестовых](https://t.me/eo_test_task_bot)
<!-- basicblock-end -->



