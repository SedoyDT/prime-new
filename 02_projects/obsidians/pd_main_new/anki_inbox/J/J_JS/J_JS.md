
#J_JS
#JS

#telegram 

# **🤔**** Как работает import и export?**
<!-- basicblock-start oid="ObsaRPanrDiuUqBCKigeNkV5"  deck='J_JS' -->
**🤔**** Как работает import и export?**::


-  export позволяет открыть переменные, функции, компоненты из модуля;
-  import — подключает экспортируемое в другом файле; Работают как часть модульной системы ES6, обеспечивают разделение кода и повторное использование.

Ставь 👍 если знал ответ, 🔥 если нет
Забирай [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#J_JS
#JS

#telegram 

# 🤔 **<u>Как работает settimeout?</u>**
<!-- basicblock-start oid="Obswd9Lkx2mWrYUzJoy19MCn"  deck='J_JS' -->
🤔 **<u>Как работает settimeout?</u>**::


Функция setTimeout используется для выполнения кода или функции спустя заданный интервал времени, однократно. Она является частью Web API в браузерах и глобального объекта `global` в Node.js, что делает её доступной для использования в любом окружении.
```
let timeoutID = setTimeout(function[, delay, arg1, arg2, ...]);
let timeoutID = setTimeout(functionCode[, delay]);

```

function: Будет вызвана после задержки.
functionCode: Строка кода для выполнения (использование этой формы не рекомендуется по соображениям безопасности).
delay: Задержка в миллисекундах, после которой будет выполнена функция. Если не указать, по умолчанию будет использовано значение 0.
arg1, arg2, ...: Аргументы, которые будут переданы в функцию при её вызове.
```
function sayHello() {
  console.log('Привет!');
}

// Вызывает функцию sayHello после задержки в 2000 миллисекунд (2 секунды)
setTimeout(sayHello, 2000);
```

🚩**Отмена выполнения** `setTimeout`

Вызов ее возвращает идентификатор таймера, который можно использовать для отмены выполнения с помощью функции `clearTimeout`.
```
let timerId = setTimeout(sayHello, 2000);

// Отменяет выполнение
clearTimeout(timerId);
```
****
**🚩****Особенности поведения**

🟠**Минимальная задержка**
В HTML5 спецификация предусматривает минимальную задержку в `4ms` для вложенных таймеров и в некоторых других случаях, что может повлиять на ожидаемое время выполнения.
🟠**Задержка в неактивных вкладках**
Браузеры могут изменять поведение таймеров для неактивных вкладок для оптимизации производительности и энергопотребления. Это может привести к значительно большей задержке, чем указано.
🟠**Асинхронность**
`setTimeout` не блокирует выполнение кода, который следует за ним. Он лишь запланирует выполнение функции на будущее, позволяя остальному коду продолжать выполняться без ожидания.

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#J_JS
#JS

#telegram 

# 🤔 **<u>Как работает settimeout?</u>**
<!-- basicblock-start oid="Obsv0FWQlQjlXt4V1OkUaIE5"  deck='J_JS' -->
🤔 **<u>Как работает settimeout?</u>**::


Функция setTimeout используется для выполнения кода или функции спустя заданный интервал времени, однократно. Она является частью Web API в браузерах и глобального объекта `global` в Node.js, что делает её доступной для использования в любом окружении.
```
let timeoutID = setTimeout(function[, delay, arg1, arg2, ...]);
let timeoutID = setTimeout(functionCode[, delay]);

```

function: Будет вызвана после задержки.
functionCode: Строка кода для выполнения (использование этой формы не рекомендуется по соображениям безопасности).
delay: Задержка в миллисекундах, после которой будет выполнена функция. Если не указать, по умолчанию будет использовано значение 0.
arg1, arg2, ...: Аргументы, которые будут переданы в функцию при её вызове.
```
function sayHello() {
  console.log('Привет!');
}

// Вызывает функцию sayHello после задержки в 2000 миллисекунд (2 секунды)
setTimeout(sayHello, 2000);
```

🚩**Отмена выполнения** `setTimeout`

Вызов ее возвращает идентификатор таймера, который можно использовать для отмены выполнения с помощью функции `clearTimeout`.
```
let timerId = setTimeout(sayHello, 2000);

// Отменяет выполнение
clearTimeout(timerId);
```
****
**🚩****Особенности поведения**

🟠**Минимальная задержка**
В HTML5 спецификация предусматривает минимальную задержку в `4ms` для вложенных таймеров и в некоторых других случаях, что может повлиять на ожидаемое время выполнения.
🟠**Задержка в неактивных вкладках**
Браузеры могут изменять поведение таймеров для неактивных вкладок для оптимизации производительности и энергопотребления. Это может привести к значительно большей задержке, чем указано.
🟠**Асинхронность**
`setTimeout` не блокирует выполнение кода, который следует за ним. Он лишь запланирует выполнение функции на будущее, позволяя остальному коду продолжать выполняться без ожидания.

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#J_JS
#JS

#telegram 

# 🤔 **<u>Как работает settimeout?</u>**
<!-- basicblock-start oid="ObsvyjvlDGJ1IT14h29sVOiR"  deck='J_JS' -->
🤔 **<u>Как работает settimeout?</u>**::


Функция setTimeout используется для выполнения кода или функции спустя заданный интервал времени, однократно. Она является частью Web API в браузерах и глобального объекта `global` в Node.js, что делает её доступной для использования в любом окружении.
```
let timeoutID = setTimeout(function[, delay, arg1, arg2, ...]);
let timeoutID = setTimeout(functionCode[, delay]);

```

function: Будет вызвана после задержки.
functionCode: Строка кода для выполнения (использование этой формы не рекомендуется по соображениям безопасности).
delay: Задержка в миллисекундах, после которой будет выполнена функция. Если не указать, по умолчанию будет использовано значение 0.
arg1, arg2, ...: Аргументы, которые будут переданы в функцию при её вызове.
```
function sayHello() {
  console.log('Привет!');
}

// Вызывает функцию sayHello после задержки в 2000 миллисекунд (2 секунды)
setTimeout(sayHello, 2000);
```

🚩**Отмена выполнения** `setTimeout`

Вызов ее возвращает идентификатор таймера, который можно использовать для отмены выполнения с помощью функции `clearTimeout`.
```
let timerId = setTimeout(sayHello, 2000);

// Отменяет выполнение
clearTimeout(timerId);
```
****
**🚩****Особенности поведения**

🟠**Минимальная задержка**
В HTML5 спецификация предусматривает минимальную задержку в `4ms` для вложенных таймеров и в некоторых других случаях, что может повлиять на ожидаемое время выполнения.
🟠**Задержка в неактивных вкладках**
Браузеры могут изменять поведение таймеров для неактивных вкладок для оптимизации производительности и энергопотребления. Это может привести к значительно большей задержке, чем указано.
🟠**Асинхронность**
`setTimeout` не блокирует выполнение кода, который следует за ним. Он лишь запланирует выполнение функции на будущее, позволяя остальному коду продолжать выполняться без ожидания.

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#J_JS
#JS

#telegram 

# **🤔**** Что такое хэш-таблица?**
<!-- basicblock-start oid="Obsmf8mbNSPypn10gwmGzVQ7"  deck='J_JS' -->
**🤔**** Что такое хэш-таблица?**::


Хэш-таблица — это структура данных, которая хранит пары ключ–значение. Ключи обрабатываются через хэш-функцию, что обеспечивает быстрый доступ к значениям — обычно за константное время.

Ставь 👍 если знал ответ, 🔥 если нет
Забирай [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#J_JS
#JS

#telegram 

# **<u>🤔</u>****<u> Как определить что состояние является глобальным?</u>**
<!-- basicblock-start oid="ObsjS3LHGySFcz9keM8Uf1UM"  deck='J_JS' -->
**<u>🤔</u>****<u> Как определить что состояние является глобальным?</u>**::


Глобальное состояние – это данные, которые должны быть доступны в разных частях приложения. Чтобы определить, является ли состояние глобальным, нужно задать себе несколько вопросов:  

🚩**Используется ли это состояние в нескольких независимых компонентах?**  

Если одно и то же состояние необходимо сразу нескольким компонентам, расположенным в разных частях дерева компонентов, скорее всего, его стоит сделать глобальным. В React, если в разных компонентах нужна информация о текущем пользователе (`user`), лучше хранить её в глобальном состоянии (например, в Context или Redux).  
```
// Глобальное состояние (например, Context API)
const UserContext = createContext();

function App() {
  const [user, setUser] = useState({ name: "Иван", isLoggedIn: true });

  return (
    <UserContext.Provider value={user}>
      <Navbar />
      <Profile />
    </UserContext.Provider>
  );
}

function Navbar() {
  const user = useContext(UserContext);
  return <div>Привет, {user.name}!</div>;
}

function Profile() {
  const user = useContext(UserContext);
  return <div>Профиль пользователя: {user.name}</div>;
}
```

🚩**Должно ли состояние сохраняться при переходе между страницами?**  

Если данные должны оставаться неизменными при смене страниц, лучше использовать глобальное хранилище (например, Redux, Zustand или React Context). Корзина товаров в интернет-магазине  
Авторизация пользователя  
Темная/светлая тема приложения  
Если данные теряются при смене страницы – это сигнал, что их нужно вынести в глобальное хранилище.  

🚩**Может ли состояние изменяться в одном месте, а использоваться в другом?**  

Если одно состояние обновляется в одном компоненте, но влияет на работу нескольких других компонентов, оно должно быть глобальным. В чате, если новое сообщение приходит в одном компоненте (`ChatInput`), а отображается в другом (`ChatList`), логично хранить все сообщения в глобальном состоянии.  
```
const ChatContext = createContext();

function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const sendMessage = (text) => {
    setMessages([...messages, { text, id: Date.now() }]);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

function ChatList() {
  const { messages } = useContext(ChatContext);
  return messages.map((msg) => <p key={msg.id}>{msg.text}</p>);
}

function ChatInput() {
  const { sendMessage } = useContext(ChatContext);
  const [text, setText] = useState("");

  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          sendMessage(text);
          setText("");
        }
      }}
    />
  );
}
```

🚩**Зависит ли состояние от URL (адресной строки)?**  

Иногда состояние можно не делать глобальным, а просто хранить его в URL (в `query-параметрах` или `path`). 
ID открытого товара: `/products/123`  
Фильтры товаров: `/shop?category=shoes&sort=price`  
Страница чата с пользователем: `/chat?user=ivan`

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#J_JS
#JS

#telegram 

# **<u>🤔</u>****<u> Как понять что код работает корректно?</u>**
<!-- basicblock-start oid="ObsxKesCWA8cTFX5wg9M67cI"  deck='J_JS' -->
**<u>🤔</u>****<u> Как понять что код работает корректно?</u>**::


Чтобы понять, что код работает корректно, нужно провести его тестирование, что включает в себя проверку кода на соответствие ожидаемым результатам в различных ситуациях. Вот основные подходы и шаги:

🚩**Проверка требований**

Прежде чем тестировать код, нужно понять, что он должен делать. Обычно для этого используют техническое задание или описание требований.
Например: если вы пишете функцию, которая складывает два числа, то ожидается, что при вызове `add(2, 3)` результат будет `5`.

🚩**Тестирование (Test Cases)**  

Тестирование предполагает выполнение кода с разными входными данными и проверку, что результат соответствует ожиданиям.
🟠**Ручное тестирование** 
Вы запускаете код с различными значениями и проверяете результаты.
🟠**Автоматизированное тестирование** 
Пишете тестовые скрипты, которые автоматически проверяют корректность работы.

```
function add(a, b) {
    return a + b;
}
```

Мы можем протестировать её так
```
console.log(add(2, 3)); // Должно вывести 5
console.log(add(0, 0)); // Должно вывести 0
console.log(add(-1, -1)); // Должно вывести -2
```

Однако лучше использовать автоматическое тестирование. Например, с помощью Jest
```
test('add function works correctly', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(0, 0)).toBe(0);
    expect(add(-1, -1)).toBe(-2);
});
```

🚩**Обработка крайних случаев**

Иногда код может работать корректно для обычных данных, но давать сбои в "необычных" случаях. Эти ситуации называют крайними случаями.
Пустой ввод (например, `add()` вместо двух чисел).
Очень большие числа.
Неправильные типы данных (например, строка вместо числа).
   
```
   console.log(add()); // undefined или ошибка
   console.log(add('2', 3)); // Может вернуть '23' или ошибку, если функция не проверяет типы
   
```

🚩**Отладка (Debugging)**

Если код не работает как надо, нужно использовать инструменты для отладки
🟠**console.log()** 
Вывод данных для проверки логики.
🟠**Инструменты разработчика в браузере** 
Для работы с JavaScript в реальном времени.
🟠**Дебаггер** 
Позволяет пошагово выполнять код.

🚩**Проверка производительности**

Иногда корректная работа кода связана не только с правильным результатом, но и с его скоростью. Если код работает слишком медленно, это может быть проблемой. Инструменты, такие как `performance.now()` в JavaScript, позволяют измерять время выполнения функций.

🚩**Code Reviews и тестирование пользователями**

После тестов полезно показать код другим разработчикам для проверки (code review) или провести тестирование с реальными пользователями. Это позволяет найти ошибки, которые могли быть упущены.

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#J_JS
#JS

#telegram 

# **<u>🤔</u>****<u> Что такое нечистая функция?</u>**
<!-- basicblock-start oid="ObsURcpG4lA74rT35c8cF5JK"  deck='J_JS' -->
**<u>🤔</u>****<u> Что такое нечистая функция?</u>**::


Нечистая функция (impure function) – это функция, результат которой зависит от внешних данных или побочных эффектов. При одном и том же входном значении она может возвращать разные результаты, что делает её непредсказуемой.  

🚩**Признаки нечистой функции**  

Зависит от внешнего состояния  
Изменяет глобальные переменные  
Вызывает побочные эффекты (запросы, изменения DOM, логирование, изменение переданных аргументов и т. д.)  

🚩**Примеры нечистых функций**  

Использует внешнюю переменную (зависит от внешнего состояния)
```
let count = 0;

function increment() {
    count += 1; 
    return count;
}

console.log(increment()); // 1
console.log(increment()); // 2 (результат меняется при каждом вызове)
```

Модифицирует переданный аргумент
```
function addElement(arr, item) {
    arr.push(item); // изменяет оригинальный массив
    return arr;
}

let numbers = [1, 2, 3];
console.log(addElement(numbers, 4)); // [1, 2, 3, 4]
console.log(numbers); // [1, 2, 3, 4] (исходный массив изменён)
```

Выполняет побочные эффекты (например, изменяет DOM)
```
function changeTitle(newTitle) {
    document.title = newTitle;
}

changeTitle("Новая страница");
console.log(document.title); // "Новая страница"
```

Генерирует случайное значение
```
function getRandomNumber() {
    return Math.random();
}

console.log(getRandomNumber()); // 0.37485647 (разный результат при каждом вызове)
```

🚩**Чем отличается от чистой функции?**  
Чистая функция (pure function) всегда возвращает один и тот же результат при одинаковых входных данных и не изменяет внешние состояния.

Чистый вариант функции `addElement()` (не меняет исходный массив)  
```
function addElementPure(arr, item) {
    return [...arr, item]; // создаёт новый массив, не изменяя старый
}

let numbers = [1, 2, 3];
console.log(addElementPure(numbers, 4)); // [1, 2, 3, 4]
console.log(numbers); // [1, 2, 3] (исходный массив не изменился)
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#J_JS
#JS

#telegram 

# **<u>🤔</u>****<u> Что делает и для чего нужна функци function.Prototype.Bind?</u>**
<!-- basicblock-start oid="Obsx6Z6Gr3kKUnwbXbfPSB0c"  deck='J_JS' -->
**<u>🤔</u>****<u> Что делает и для чего нужна функци function.Prototype.Bind?</u>**::


`bind()` – это метод, который создает новую функцию с привязанным контекстом (`this`) и (опционально) фиксированными аргументами.  

🚩**Основные возможности `bind()`**  

Привязывает `this`, чтобы не потерять контекст  
Позволяет создавать частично примененные функции 
Используется в обработчиках событий и таймерах  

Пример: потеря `this` без `bind()`  
```
const user = {
  name: "Иван",
  sayHello() {
    console.log(`Привет, ${this.name}!`);
  },
};

setTimeout(user.sayHello, 1000); // ❌ this = undefined
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#J_JS
#JS

#telegram 

# **<u>🤔</u>****<u> Является ли, drag and drop частью спецификации?</u>**
<!-- basicblock-start oid="ObstRLKW0wks5rM1yU6VqaCG"  deck='J_JS' -->
**<u>🤔</u>****<u> Является ли, drag and drop частью спецификации?</u>**::


Да! Drag and Drop (перетаскивание) — это часть спецификации HTML5. В браузерах есть встроенный API, который позволяет делать перетаскивание элементов без дополнительных библиотек.  

**🚩****Как работает Drag and Drop API?**  

В HTML5 можно сделать элемент перетаскиваемым, добавив ему атрибут `draggable="true"`. Затем срабатывают специальные события, такие как `dragstart`, `drop`, `dragover` и другие.  
```
<div id="drag-item" draggable="true">Перетащи меня</div>
<div id="drop-zone">Сюда можно сбросить</div>

<script>
  const dragItem = document.getElementById("drag-item");
  const dropZone = document.getElementById("drop-zone");

  dragItem.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", "Данные элемента");
  });

  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault(); // Нужно, чтобы разрешить сброс
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    alert("Элемент сброшен: " + data);
  });
</script>
```

**🚩****Какие события есть в Drag and Drop?**  

Основные события:  
`dragstart` — когда начали тянуть элемент.  
`drag` — когда элемент двигается (срабатывает много раз).  
`dragenter` — когда курсор заходит в зону сброса.  
`dragover` — когда элемент находится над зоной (нужно `preventDefault()`).  
`dragleave` — когда курсор покидает зону сброса.  
`drop` — когда элемент отпущен в зоне сброса.  
`dragend` — когда перетаскивание завершено (даже если не сбросили).  

**🚩****Где используется Drag and Drop?**  

- Перетаскивание файлов в `<input type="file">` (например, загрузка изображений).  
- Канбан-доски, как в Trello.  
- Онлайн-редакторы, как Figma.  
- Игры, где можно перемещать предметы.  
****
**🚩****Можно ли сделать Drag and Drop без HTML5 API?**  

Да, можно использовать другие методы:  
Через события мыши (`mousedown`, `mousemove`, `mouseup`).  
Через CSS `position: absolute` и `transform`.  
Через JS-библиотеки (`Sortable.js`, `React DnD`, `Draggable.js`).  
Например, в мобильных браузерах стандартный Drag and Drop API плохо работает, и там лучше использовать события `touchstart`, `touchmove`, `touchend`.

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#J_JS
#JS

#telegram 

# 🤔 **Чем похожи массивы, объекты и функции?**
<!-- basicblock-start oid="ObsNRQgAEroZSSln7OhpS42F"  deck='J_JS' -->
🤔 **Чем похожи массивы, объекты и функции?**::


Все они — объекты в JavaScript. Их можно изменять, расширять, передавать как аргументы, хранить свойства. Отличаются только поведением и встроенными методами.

Ставь 👍 если знал ответ, 🔥 если нет
Забирай [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#J_JS
#JS

#telegram 

# **<u>🤔</u>****<u> Как бы добавлял статический метод в prototype?</u>**
<!-- basicblock-start oid="ObsvRi6ijkfBQSmFypoDidnj"  deck='J_JS' -->
**<u>🤔</u>****<u> Как бы добавлял статический метод в prototype?</u>**::


На самом деле, статические методы не добавляются в `prototype`, потому что они принадлежат самому классу, а не его экземплярам.  
Но если ты хочешь имитировать статический метод в `prototype`, можно использовать функцию-конструктор и добавить метод вручную.  

🚩**Как работают статические методы? (`static`)**  

В классе статические методы объявляются с помощью `static`. Они не находятся в `prototype`, а принадлежат самому классу.  
```
class User {
  static sayHello() {
    return "Привет!";
  }
}

console.log(User.sayHello()); // ✅ "Привет!"
console.log(User.prototype.sayHello); // ❌ undefined (нет в prototype)
```

🚩**Добавление "статического" метода в `prototype` (не совсем статический)**  

Если нужно, чтобы каждый объект имел доступ к "статическому" методу через `prototype`, можно сделать так
```
function User(name) {
  this.name = name;
}

// Добавляем метод в prototype
User.prototype.sayHello = function () {
  return "Привет!";
};

const user1 = new User("Иван");
console.log(user1.sayHello()); // ✅ "Привет!"
```

🚩**Добавление метода напрямую в сам класс (имитация `static`)**  

Если хочется добавить метод на сам класс, а не в `prototype`, можно сделать так
```
function User(name) {
  this.name = name;
}

// Добавляем метод прямо в функцию-конструктор
User.sayHello = function () {
  return "Привет!";
};

console.log(User.sayHello()); // ✅ "Привет!"
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#J_JS
#JS

#telegram 

# **🤔**** Что такое IIFE (Immediately Invoked Function Expression) и для чего она нужна?**
<!-- basicblock-start oid="ObsKPnZl2AHO67pd2rkCZiY7"  deck='J_JS' -->
**🤔**** Что такое IIFE (Immediately Invoked Function Expression) и для чего она нужна?**::


Это немедленно вызываемое функциональное выражение. Используется для:
-  Изоляции области видимости;
-  Создания модуля;
-  Предотвращения загрязнения глобального пространства имён.

Ставь 👍 если знал ответ, 🔥 если нет
Забирай [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#J_JS
#JS

#telegram 

# **<u>🤔</u>****<u> Как можно работать с датами в js?</u>**
<!-- basicblock-start oid="ObsoHpeqcVFuq58zPEKDRtEq"  deck='J_JS' -->
**<u>🤔</u>****<u> Как можно работать с датами в js?</u>**::


В JavaScript для работы с датами можно использовать:  
`Date` – встроенный объект  
Библиотеку `Intl.DateTimeFormat` – для форматирования  
Библиотеки (`moment.js`, `date-fns`, `luxon`) – для удобной работы  

🚩**Встроенный объект `Date`**  

Создание даты  
```
const now = new Date(); // Текущая дата и время
console.log(now); // Например: 2025-02-25T12:34:56.789Z
```

Способы создания даты
```
new Date(); // Текущая дата
new Date(2025, 1, 25); // 25 февраля 2025 (месяцы с 0)
new Date("2025-02-25"); // ISO строка
new Date(1708850400000); // Unix timestamp (в мс)
```

Получение значений
```
const date = new Date();
console.log(date.getFullYear()); // 2025
console.log(date.getMonth());    // 1 (февраль, потому что январь — 0)
console.log(date.getDate());     // 25
console.log(date.getDay());      // 2 (вторник, потому что воскресенье — 0)
console.log(date.getHours());    // Часы
console.log(date.getMinutes());  // Минуты
console.log(date.getSeconds());  // Секунды
console.log(date.getTime());     // Время в миллисекундах (Unix timestamp)
```

Изменение даты
```
const date = new Date();
date.setFullYear(2030);
date.setMonth(11); // Декабрь
date.setDate(31);
console.log(date); // 31 декабря 2030
```

Форматирование даты
```
const date = new Date();
console.log(date.toDateString()); // "Tue Feb 25 2025"
console.log(date.toISOString());  // "2025-02-25T12:34:56.789Z"
console.log(date.toLocaleString()); // Локальное представление
console.log(date.toUTCString());  // "Tue, 25 Feb 2025 12:34:56 GMT"
```

Форматирование с `Intl.DateTimeFormat`
```
const date = new Date();
const formatter = new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
});
console.log(formatter.format(date)); // "вторник, 25 февраля 2025 г."
```

🚩**Библиотеки (более удобные способы)**  

`date-fns` (легковесная альтернатива Moment.js)  
```
npm install date-fns
```
```
import { format, addDays } from "date-fns";

const now = new Date();
console.log(format(now, "dd.MM.yyyy HH:mm")); // 25.02.2025 15:30
console.log(addDays(now, 5)); // Дата + 5 дней
```

`moment.js` (устаревший, но популярный)
```
npm install moment
```
```
import moment from "moment";

const now = moment();
console.log(now.format("DD.MM.YYYY HH:mm")); // 25.02.2025 15:30
console.log(now.add(5, "days").format("DD.MM.YYYY")); // +5 дней
```

`luxon` (современная альтернатива Moment.js)
```
npm install luxon
```
```
import { DateTime } from "luxon";

const now = DateTime.now();
console.log(now.toFormat("dd.MM.yyyy HH:mm")); // 25.02.2025 15:30
console.log(now.plus({ days: 5 }).toFormat("dd.MM.yyyy")); // +5 дней
```

Разница между датами  
```
const date1 = new Date("2025-02-25");
const date2 = new Date("2025-03-01");

const diff = date2 - date1; // Разница в миллисекундах
console.log(diff / (1000 * 60 * 60 * 24)); // Разница в днях (4)
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#J_JS
#JS

#telegram 

# 🤔 **Как работает new?**
<!-- basicblock-start oid="ObsBDGsfkpIySKsojCY1mnFJ"  deck='J_JS' -->
🤔 **Как работает new?**::


Ключевое слово new создаёт новый объект, основанный на конструкторе.
1. Создаётся пустой объект, связанный с прототипом конструктора.
2. Вызывается функция-конструктор, передающая объекту свои свойства и методы.
3. Если конструктор не возвращает объект явно, возвращается новый объект.

Ставь 👍 если знал ответ, 🔥 если нет
Забирай [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#J_JS
#JS

#telegram 

# Как из массива объектов js сделать объект ключами которого будет свойство объектов, которые содеражтся в массиве?
<!-- basicblock-start oid="ObsZ7iDXXkz2CL21SYi6vNr8"  deck='J_JS' -->
Как из массива объектов js сделать объект ключами которого будет свойство объектов, которые содеражтся в массиве?::


const items = [
  { id: 'a1', name: 'Item 1' },
  { id: 'b2', name: 'Item 2' },
  { id: 'c3', name: 'Item 3' }
];

const itemsById = items.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

console.log(itemsById);
/*
{
  a1: { id: 'a1', name: 'Item 1' },
  b2: { id: 'b2', name: 'Item 2' },
  c3: { id: 'c3', name: 'Item 3' }
}
*/
<!-- basicblock-end -->



