
#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Что можно повторить про стрелочные функции?
<!-- basicblock-start oid="ObsC2b9y4cZ3QjhQ8gTOxndz"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Что можно повторить про стрелочные функции?::


Давайте вернёмся к стрелочным функциям.

Стрелочные функции – это не просто «сокращение», чтобы меньше писать. У них есть ряд других полезных особенностей.

При написании JavaScript-кода часто возникают ситуации, когда нам нужно написать небольшую функцию, которая будет выполнена где-то ещё.

Например:

    arr.forEach(func) – func выполняется forEach для каждого элемента массива.
    setTimeout(func) – func выполняется встроенным планировщиком.
    …и так далее.

Это очень в духе JavaScript – создать функцию и передать её куда-нибудь.

И в таких функциях мы обычно не хотим выходить из текущего контекста. Здесь как раз и полезны стрелочные функции.


У стрелочных функций нет «this»

Как мы помним из главы Методы объекта, "this", у стрелочных функций нет this. Если происходит обращение к this, его значение берётся снаружи.

Например, мы можем использовать это для итерации внутри метода объекта:

```

let group = {
  title: "Our Group",
  students: ["John", "Pete", "Alice"],

  showList() {
    this.students.forEach(
      student => alert(this.title + ': ' + student)
    );
  }
};

group.showList();

```

Здесь внутри forEach использована стрелочная функция, таким образом this.title в ней будет иметь точно такое же значение, как в методе showList: group.title.

Если бы мы использовали «обычную» функцию, была бы ошибка:


```

let group = {
  title: "Our Group",
  students: ["John", "Pete", "Alice"],

  showList() {
    this.students.forEach(function(student) {
      // Error: Cannot read property 'title' of undefined
      alert(this.title + ': ' + student)
    });
  }
};

group.showList();

```

Ошибка возникает потому, что forEach по умолчанию выполняет функции с this, равным undefined, и в итоге мы пытаемся обратиться к undefined.title.

Это не влияет на стрелочные функции, потому что у них просто нет this.


Стрелочные функции нельзя использовать с new

Отсутствие this естественным образом ведёт к другому ограничению: стрелочные функции не могут быть использованы как конструкторы. Они не могут быть вызваны с new.

Стрелочные функции VS bind

Стрелочные функции VS bind

Существует тонкая разница между стрелочной функцией => и обычной функцией, вызванной с .bind(this):

    .bind(this) создаёт «связанную версию» функции.
    Стрелка => ничего не привязывает. У функции просто нет this. При получении значения this – оно, как обычная переменная, берётся из внешнего лексического окружения.

Стрелочные функции не имеют «arguments»

У стрелочных функций также нет переменной arguments.

Это отлично подходит для декораторов, когда нам нужно пробросить вызов с текущими this и arguments.

Например, defer(f, ms) принимает функцию и возвращает обёртку над ней, которая откладывает вызов на ms миллисекунд:

```

function defer(f, ms) {
  return function() {
    setTimeout(() => f.apply(this, arguments), ms)
  };
}

function sayHi(who) {
  alert('Hello, ' + who);
}

let sayHiDeferred = defer(sayHi, 2000);
sayHiDeferred("John"); // выводит "Hello, John" через 2 секунды

```

То же самое без стрелочной функции выглядело бы так:

```

function defer(f, ms) {
  return function(...args) {
    let ctx = this;
    setTimeout(function() {
      return f.apply(ctx, args);
    }, ms);
  };
}

```

Здесь мы были вынуждены создать дополнительные переменные args и ctx, чтобы функция внутри setTimeout могла получить их.

Итого

Стрелочные функции:

    Не имеют this.
    Не имеют arguments.
    Не могут быть вызваны с new.
    (У них также нет super, но мы про это не говорили. Про это будет в главе Наследование классов).

Всё это потому, что они предназначены для небольшого кода, который не имеет своего «контекста», выполняясь в текущем. И они отлично справляются с этой задачей!
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Экзотический объект bound function, возвращаемый при первом вызове f.bind(...), запоминает
<!-- basicblock-start oid="ObsmML8Heh3EPHCp4tbioeEV"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Экзотический объект bound function, возвращаемый при первом вызове f.bind(...), запоминает::


Экзотический объект bound function, возвращаемый при первом вызове f.bind(...), запоминает контекст (и аргументы, если они были переданы) только во время создания.

Следующий вызов bind будет устанавливать контекст уже для этого объекта. Это ни на что не повлияет.

Можно сделать новую привязку, но нельзя изменить существующую.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Что в общем можно сказать про привязку контекста к функции?
<!-- basicblock-start oid="ObsAV38IgUUiRzpkTSo0PONH"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Что в общем можно сказать про привязку контекста к функции?::


Метод bind возвращает «привязанный вариант» функции func, фиксируя контекст this и первые аргументы arg1, arg2…, если они заданы.

Обычно bind применяется для фиксации this в методе объекта, чтобы передать его в качестве колбэка. Например, для setTimeout.

Когда мы привязываем аргументы, такая функция называется «частично применённой» или «частичной».

Частичное применение удобно, когда мы не хотим повторять один и тот же аргумент много раз. Например, если у нас есть функция send(from, to) и from всё время будет одинаков для нашей задачи, то мы можем создать частично применённую функцию и дальше работать с ней.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Что можно сказать про частичное применение без контекста?
<!-- basicblock-start oid="ObsJOpkZMkCNssupHhqTIbbY"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Что можно сказать про частичное применение без контекста?::


Что если мы хотим зафиксировать некоторые аргументы, но не контекст this? Например, для метода объекта.

Встроенный bind не позволяет этого. Мы не можем просто опустить контекст и перейти к аргументам.

К счастью, легко создать вспомогательную функцию partial, которая привязывает только аргументы.

Вот так:

```

function partial(func, ...argsBound) {
  return function(...args) { // (*)
    return func.call(this, ...argsBound, ...args);
  }
}

// использование:
let user = {
  firstName: "John",
  say(time, phrase) {
    alert(`[${time}] ${this.firstName}: ${phrase}!`);
  }
};

// добавляем частично применённый метод с фиксированным временем
user.sayNow = partial(user.say, new Date().getHours() + ':' + new Date().getMinutes());

user.sayNow("Hello");
// Что-то вроде этого:
// [10:00] John: Hello!

```

Результатом вызова partial(func[, arg1, arg2...]) будет обёртка (*), которая вызывает func с:

    Тем же this, который она получает (для вызова user.sayNow – это будет user)
    Затем передаёт ей ...argsBound – аргументы из вызова partial ("10:00")
    Затем передаёт ей ...args – аргументы, полученные обёрткой ("Hello")

Благодаря оператору расширения ... реализовать это очень легко, не правда ли?

Также есть готовый вариант _.partial из библиотеки lodash.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Для чего мы обычно создаём частично применённую функцию?
<!-- basicblock-start oid="ObsXEHIdYpsUkUP2hB2WhP4n"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Для чего мы обычно создаём частично применённую функцию?::


Польза от этого в том, что возможно создать независимую функцию с понятным названием (double, triple). Мы можем использовать её и не передавать каждый раз первый аргумент, т.к. он зафиксирован с помощью bind.

В других случаях частичное применение полезно, когда у нас есть очень общая функция и для удобства мы хотим создать её более специализированный вариант.

Например, у нас есть функция send(from, to, text). Потом внутри объекта user мы можем захотеть использовать её частный вариант: sendTo(to, text), который отправляет текст от имени текущего пользователя.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Покажи пример частичного применения?
<!-- basicblock-start oid="ObsKXKrkZr1CplL8esVCqaQg"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Покажи пример частичного применения?::


Давайте воспользуемся bind, чтобы создать функцию double на её основе:
```

function mul(a, b) {
  return a * b;
}

let double = mul.bind(null, 2);

alert( double(3) ); // = mul(2, 3) = 6
alert( double(4) ); // = mul(2, 4) = 8
alert( double(5) ); // = mul(2, 5) = 10
```
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Что такое Частичное применение?
<!-- basicblock-start oid="Obsa5vBA6n6wN4Roaui9bC8a"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Что такое Частичное применение?::


Частичное применение — возможность в ряде языков программирования зафиксировать часть аргументов многоместной функции и создать другую функцию, меньшей арности.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Полный синтаксис bind:
<!-- basicblock-start oid="Obss5f3q2Uq1K4uH9oSTOvX4"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Полный синтаксис bind:::


let bound = func.bind(context, [arg1], [arg2], ...);
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Если у объекта много методов и мы планируем их активно передавать, то можно привязать контекст для них всех в цикле:
<!-- basicblock-start oid="ObsFxO3tyEvbLyyxSJ1EyEl0"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Если у объекта много методов и мы планируем их активно передавать, то можно привязать контекст для них всех в цикле:::


```

for (let key in user) {
  if (typeof user[key] == 'function') {
    user[key] = user[key].bind(user);
  }
}
```
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Что делает bind?
<!-- basicblock-start oid="Obs0ozpz6NCHusI79VZyTLNy"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Что делает bind?::


В современном JavaScript у функций есть встроенный метод bind, который позволяет зафиксировать this.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Метод setTimeout в браузере имеет особенность: он устанавливает
<!-- basicblock-start oid="ObsAxG9IWhUBG7eHaWKckPev"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Метод setTimeout в браузере имеет особенность: он устанавливает::


Метод setTimeout в браузере имеет особенность: он устанавливает this=window для вызова функции (в Node.js this становится объектом таймера, но здесь это не имеет значения). Таким образом, для this.firstName он пытается получить window.firstName, которого не существует. В других подобных случаях this обычно просто становится undefined.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Объясни мне алгоритм троттлинга
<!-- basicblock-start oid="ObsPAiFIKGj8IKQs7mB5zsUM"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Объясни мне алгоритм троттлинга::


Функция троттлинга (throttling) — это программный паттерн, который ограничивает частоту выполнения функции. Этот паттерн особенно полезен, когда функция вызывается очень часто, и есть необходимость ограничить количество её вызовов, чтобы избежать перегрузки системы или оптимизировать использование ресурсов.

### Как работает троттлинг?

Алгоритм троттлинга заключается в том, чтобы позволять функции выполняться только один раз в определённый интервал времени, несмотря на то, что она может быть вызвана многократно.

#### Основные элементы троттлинга:

1. **Интервал времени (`ms`)**: Это время, в течение которого функция может быть вызвана только один раз.

2. **Таймер (`timerId`)**: Используется для отслеживания времени между вызовами функции.

3. **Функция-обёртка (`wrapper`)**: Это функция, которая содержит логику троттлинга и оборачивает исходную функцию.

### Пример реализации троттлинга

Давайте рассмотрим пример реализации функции троттлинга на JavaScript:

```

function throttle(func, ms) {
  let isThrottled = false; // переменная для контроля времени
  let savedArgs, savedThis; // переменные для сохранения аргументов и контекста

  function wrapper() {
    if (isThrottled) { // если функция вызвана в течение интервала, сохраняем её вызов
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); // иначе выполняем функцию

    isThrottled = true; // и устанавливаем флаг

    setTimeout(function() { // устанавливаем таймер
      isThrottled = false; // по истечении времени сбрасываем флаг
      if (savedArgs) { // если был сохранён вызов
        wrapper.apply(savedThis, savedArgs); // вызываем функцию с сохранёнными аргументами
        savedArgs = savedThis = null; // и очищаем сохранённые данные
      }
    }, ms);
  }

  return wrapper;
}

```

### Как работает эта функция?

1. **Инициализация**:
   - Переменная `isThrottled` используется для определения, выполняется ли функция в данный момент или была вызвана в течение последнего интервала.
   - `savedArgs` и `savedThis` используются для хранения аргументов и контекста вызова функции, если она вызвана в течение времени, когда функция была троттлинговой.

2. **Логика обёртки (`wrapper`)**:
   - Когда функция обёртка (`wrapper`) вызывается, она сначала проверяет `isThrottled`.
   - Если `isThrottled` равен `true`, это означает, что функция уже выполняется или была вызвана в течение последнего интервала. В этом случае мы сохраняем аргументы и контекст (`this`) в переменные `savedArgs` и `savedThis` и прерываем выполнение функции.
   
3. **Выполнение функции**:
   - Если `isThrottled` равен `false`, функция выполняется с помощью `func.apply(this, arguments)`, где `func` — исходная функция, переданная в `throttle`.
   - Затем устанавливаем `isThrottled` в `true`, чтобы предотвратить повторный вызов функции в течение интервала `ms`.

4. **Таймер (`setTimeout`)**:
   - Устанавливается таймер, который по истечении времени `ms` сбрасывает флаг `isThrottled` в `false`.
   - Если к этому времени были сохранены аргументы (`savedArgs`), функция обёртка (`wrapper`) будет вызвана ещё раз с этими аргументами и контекстом, после чего они очищаются.

### Пример использования:

```

function logMessage(message) {
  console.log(message);
}

let throttledLog = throttle(logMessage, 2000);

throttledLog("Message 1"); // Будет выведено сразу
throttledLog("Message 2"); // Будет проигнорировано
setTimeout(() => throttledLog("Message 3"), 1000); // Будет проигнорировано
setTimeout(() => throttledLog("Message 4"), 3000); // Будет выведено через 3 секунды

```

### Преимущества троттлинга:

- **Оптимизация производительности**: Ограничивает частоту выполнения ресурсоёмких операций.
- **Контроль нагрузки**: Полезно для сценариев, где необходимо контролировать нагрузку на сервер или другие системы.

Троттлинг полезен в ситуациях, когда вы хотите контролировать количество вызовов функции, сохраняя её эффективность и предотвращая возможные проблемы с производительностью.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Первая функция:
<!-- basicblock-start oid="Obs1ZNxDAJL7vF5Kr5plmL8C"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Первая функция:::


javascript

```

function throttle(f, ms) {
  let timerId = 0;
  function wrapper(args) {
    timerId = setInterval(() => f.apply(this, ...args), ms);
    console.log(args);
  }
  return wrapper;
}

```

    В этой функции wrapper принимает один параметр args, который предполагается быть массивом аргументов.
    Внутри setInterval, f вызывается с использованием оператора распространения (...args), который развертывает массив args в отдельные аргументы.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Вторая функция:
<!-- basicblock-start oid="ObstQoIh5geNoVL522ZILbbI"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Вторая функция:::


javascript

```

function throttle(f, ms) {
  let timerId = 0;
  function wrapper(...args) {
    timerId = setInterval(() => f.apply(this, args), ms);
    console.log(args);
  }
  return wrapper;
}

```

    Здесь wrapper использует оператор rest (...args), чтобы собрать все переданные аргументы в массив args.
    Внутри setInterval, f вызывается с теми же аргументами, но args уже является массивом, поэтому оператор распространения не используется.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# f
<!-- basicblock-start oid="ObsgU7PenkUSBSMfLGx1mkPh"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
f::


<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Объясни подробно эту функцию debounce
<!-- basicblock-start oid="ObsfvV9tNAK7D9FGJxl3xxia"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Объясни подробно эту функцию debounce
```JS
function debounce(func,ms) {
  let timerId;
  return function() {
    clearTimeout(timerId);
    timerId = setTimeout(() => {func.apply(this,arguments)}, ms);
  }
}

let f = debounce(console.log, 1000);

f("a");
setTimeout( () => f("b"), 200);
setTimeout( () => f("c"), 500);

// Обёрнутая в debounce фун
```
::

1. При вызове функции debounce при создании декоратора создается переменная timerId
2. Сам декоратор возвращает функцию которая очищает ранее установленный таймер и создает новый для параметров переданных в последнем вызове замыкания
3. То есть на вызовае функции f("a");
4. назначается timerId = a
5. Но при вызове функции setTimeout( () => f("b"), 200); timerId = a очищается
6. 


<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Что делает clearTimeout ?
<!-- basicblock-start oid="ObsPnETcfPRt0OSe401z82UE"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Что делает clearTimeout ?::


Для отмены выполнения необходимо вызвать clearTimeout со значением, которое возвращают методы setTimeout
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Что делает clearInterval ?
<!-- basicblock-start oid="ObsZ6055AfHiJWrigMRXjUT7"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Что делает clearInterval ?::


Для отмены выполнения необходимо вызвать clearInterval со значением, которое возвращают методы setInterval
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Что делает ...args?
<!-- basicblock-start oid="ObsWdB2UspYuL7mfGAJ12pVK"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Что делает ...args?::


`...args` — это так называемый **оператор остаточных параметров** (rest parameters) в JavaScript. Он позволяет собрать все оставшиеся аргументы функции в массив.

### Разбор:

1. **Оператор остаточных параметров:**
   - Когда вы пишете `function wrapper(...args)`, это означает, что все аргументы, переданные функции `wrapper`, будут собраны в массив `args`.
   - Например, если `wrapper` вызвана как `wrapper(1, 2, 3)`, то `args` будет равно `[1, 2, 3]`.

2. **Использование `...args` для передачи аргументов:**
   - Когда вы используете `...args` внутри функции, например, в `console.log(...args)`, это значит, что массив `args` будет "распакован", и каждый элемент массива будет передан как отдельный аргумент.
   - Например, если `args` равно `[1, 2, 3]`, то `console.log(...args)` эквивалентно `console.log(1, 2, 3)`.

### Как это работает в вашем коде:

1. **Функция `f`:**
   - Просто выводит свой аргумент `x` в консоль.

2. **Функция `delay`:**
   - Принимает функцию `func` и задержку `ms` в миллисекундах.
   - Внутри `delay` создается функция-обертка `wrapper`, которая принимает аргументы.

3. **Функция `wrapper`:**
   - Ваша функция `wrapper(args)` принимает аргумент `args`, который является массивом (в вашем примере это `["test", "test2"]`).
   - При вызове `console.log(...args)` массив `args` распаковывается, и его элементы выводятся в консоль отдельно: как `"test"` и `"test2"`.
   - Если бы вы использовали `func.apply(this, args)`, то `func` была бы вызвана с элементами `args` как отдельными аргументами.

4. **Пример использования:**

```
function f(x) {
  console.log(x);
}

function delay(func, ms) {
  function wrapper(args) {
    console.log(...args);
    // setTimeout(() => func.apply(this, args), ms);
  }
  
  return wrapper;
}

// создаём обёртки
let f1000 = delay(f, 1000);
let f1500 = delay(f, 1500);

f1000(["test", "test2"]); // показывает "test", "test2" сразу
// f1500("test"); // показывает "test" после 1500 мс
```

### Итог:

- **`args`** в функции собирает все переданные аргументы в массив.
- **`...args`** при передаче в другую функцию (или в `console.log`) распаковывает массив, передавая его элементы как отдельные аргументы.

В вашем коде `f1000(["test", "test2"])` передает массив `["test", "test2"]` в `wrapper`. Затем `console.log(...args)` выводит `"test"` и `"test2"` отдельно в консоль.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# почему этот код является демонстрацией замыкания?
<!-- basicblock-start oid="ObsMn70CEug88GF5UTCGzh66"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
почему этот код является демонстрацией замыкания?

```JS
function spy(func) { 
	function wrapper(...args) { 
	wrapper.calls.push(args); // Теперь args добавляются в wrapper.calls 
		return func.apply(this, args); // Вызов оригинальной функции с правильным контекстом и аргументами
	 } 
	wrapper.calls = []; // Массив для хранения аргументов всех вызовов return wrapper;
 } 
work = spy(work);
```
::
Этот код является демонстрацией замыкания, потому что функция `wrapper`, определенная внутри функции `spy`, сохраняет доступ к переменной `func`, даже после того, как функция `spy` завершила своё выполнение. Это ключевая особенность замыкания.

### Детальный разбор:

1. **Лексическое окружение (Lexical Environment):**
   - Когда функция `spy` вызывается, создается её лексическое окружение, включающее переменную `func`, которая ссылается на переданную функцию.
   - Внутри `spy` определяется функция `wrapper`, которая замыкается на этом лексическом окружении. То есть, она сохраняет доступ к переменной `func` из внешней функции `spy`.

2. **Возврат функции `wrapper`:**
   - Функция `spy` завершает выполнение, но возвращает функцию `wrapper`.
   - Несмотря на то, что выполнение `spy` завершилось, функция `wrapper` продолжает "помнить" о переменной `func`, к которой у неё есть доступ через замыкание.

3. **Использование переменной `func` внутри `wrapper`:**
   - Когда позже вызывается `wrapper` (например, через `work(1, 2)` после того, как `work = spy(work)`), она использует переменную `func` для вызова оригинальной функции с помощью `func.apply(this, args)`.
   - Замыкание обеспечивает сохранение ссылки на `func`, даже если она была определена в уже завершившей выполнение функции `spy`.

### Пример:

```javascript
function work(a, b) {
  return a + b;
}

let spiedWork = spy(work);

spiedWork(1, 2); // 3
spiedWork(4, 5); // 9

console.log(spiedWork.calls); // [[1, 2], [4, 5]]
```

В этом примере, `spiedWork` — это функция `wrapper`, которая, несмотря на завершение работы функции `spy`, все еще может вызвать оригинальную функцию `work`, используя переменную `func`, к которой она получила доступ через замыкание.

### Почему это замыкание?

- **Замыкание** — это способность функции запоминать свое лексическое окружение, включая переменные, которые были доступны в момент её создания, даже после того, как внешняя функция завершила выполнение.

- В вашем коде:
  - Функция `wrapper` запоминает переменную `func`, которая определена в функции `spy`.
  - Функция `wrapper` возвращается из `spy`, но переменная `func` сохраняется, что позволяет `wrapper` использовать её при каждом вызове.

Таким образом, этот код демонстрирует замыкание, поскольку функция `wrapper` сохраняет доступ к переменной `func` благодаря замыканию на лексическом окружении функции `spy`.

<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Что самое главное происходит в функции обертке js при добавлении нового поведения?:
<!-- basicblock-start oid="ObsPgLBBFFUK8rPvcWg30Ymt"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Что самое главное происходит в функции обертке js при добавлении нового поведения?::

Самое главное, что происходит в функции-обертке в JavaScript при добавлении нового поведения — это интерцепция вызовов оригинальной функции, что позволяет добавлять дополнительную логику до или после вызова этой функции, либо изменять способ её выполнения. Вот ключевые моменты:

### 1. **Перехват вызова оригинальной функции:**
   - Функция-обертка («wrapper») принимает те же аргументы, что и оригинальная функция, и затем может решить, как и когда вызвать оригинальную функцию. Это дает возможность выполнить дополнительную логику до, после или вместо вызова оригинальной функции.

### 2. **Добавление нового поведения:**
   - Внутри обертки можно выполнить любые дополнительные действия: логгирование, проверку прав доступа, обработку ошибок, кэширование и т.д. Например, можно записывать аргументы функции в лог, измерять время выполнения, изменять результат или даже возвращать другое значение.

### 3. **Сохранение контекста и аргументов:**
   - Чтобы оригинальная функция могла работать правильно, функция-обертка часто использует `func.apply(this, args)` или `func.call(this, ...args)`, чтобы передать правильный контекст (`this`) и аргументы (`args`).

### 4. **Расширение функциональности без изменения исходного кода:**
   - Обертка позволяет добавить новое поведение без необходимости изменять исходную функцию. Это полезно для создания легко масштабируемого и поддерживаемого кода, особенно если работа ведется с библиотеками или чужим кодом, где прямое изменение может быть невозможно.

### Пример:
```javascript
function spy(func) {
  function wrapper(...args) {
    console.log("Аргументы вызова:", args); // Логирование
    const result = func.apply(this, args);  // Вызов оригинальной функции
    console.log("Результат:", result);      // Логирование результата
    return result; // Возвращение результата, чтобы не нарушать поведение оригинальной функции
  }
  return wrapper;
}
```

В этом примере функция-обертка `wrapper` перехватывает вызов оригинальной функции `func`, добавляет логгирование аргументов и результата, а затем вызывает `func` и возвращает её результат. Оригинальная функция остается неизменной, но её поведение расширено за счет обертки.

```JS
function spy(func) {
  function wrapper(...args) {
    wrapper.calls.push(args); // Теперь args добавляются в wrapper.calls
    return func.apply(this, args); // Вызов оригинальной функции с правильным контекстом и аргументами
  }
  wrapper.calls = []; // Массив для хранения аргументов всех вызовов
  return wrapper;
}

work = spy(work);

```

<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Что такое дэбаунсинг?
<!-- basicblock-start oid="ObsXhMSP7rkIDr87mX02qybF"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Что такое дэбаунсинг?::


Код, который вы предоставили, реализует технику, называемую "дебаунсинг" (debouncing). Дебаунсинг позволяет ограничить частоту вызова функции, чтобы она не выполнялась слишком часто. Эта техника часто используется в обработчиках событий, таких как ввод текста в поле поиска, чтобы избежать избыточных запросов или обработок.

Вот подробное объяснение того, что делает каждый фрагмент кода:

### Функция `debounce`

```

function debounce(func, ms) {
  let timeout;
  return function() {
    console.log(timeout)
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), ms);
    console.log(timeout)
  };
}

```

1. **Определение функции `debounce(func, ms)`**
   - `func` — это функция, которую вы хотите дебаунсить (отложить).
   - `ms` — это количество миллисекунд, на которое нужно отложить вызов функции `func`.

2. **Переменная `timeout`**
   - Эта переменная используется для хранения идентификатора таймера, возвращаемого `setTimeout`.

3. **Возвращаемая функция**
   - Эта функция возвращается из `debounce` и будет вызываться каждый раз, когда вызывается дебаунсированная функция `f`.

4. **Вызов `console.log(timeout)`**
   - Перед сбросом таймера, этот `console.log` выводит текущее значение `timeout` в консоль. Это поможет вам увидеть, какой идентификатор таймера был установлен ранее.

5. **Очистка таймера**
   - `clearTimeout(timeout)` отменяет предыдущий таймер, если он существует. Это предотвращает выполнение функции `func` до тех пор, пока не истечет новый таймер.

6. **Установка нового таймера**
   - `timeout = setTimeout(() => func.apply(this, arguments), ms);` устанавливает новый таймер, который вызовет функцию `func` через `ms` миллисекунд. `func.apply(this, arguments)` обеспечивает передачу правильного контекста `this` и аргументов в `func`.

7. **Вызов `console.log(timeout)`**
   - Этот `console.log` выводит новый идентификатор таймера, установленный `setTimeout`.

### Применение функции `debounce`

```

let f = debounce(console.log, 10000);

```

Создается дебаунсированная версия функции `console.log`, которая будет вызываться не чаще чем раз в 10 секунд (10000 миллисекунд).

### Вызов `f` с различными задержками

```

f("a");
setTimeout(() => f("b"), 200);
setTimeout(() => f("c"), 5000);

```

1. **Первый вызов `f("a")`**
   - `f("a")` устанавливает таймер на 10 секунд для вызова `console.log("a")`.

2. **Второй вызов `f("b")` через 200 мс**
   - Этот вызов вызывает `f` снова через 200 мс после первого вызова. В результате, предыдущий таймер (для `"a"`) очищается и устанавливается новый таймер для `"b"`. Таймер для `"b"` будет работать в течение следующих 10 секунд.

3. **Третий вызов `f("c")` через 5000 мс (5 секунд)**
   - Этот вызов происходит через 5 секунд после первого вызова. Поскольку таймер для `"b"` еще не истек, новый таймер для `"c"` также сбрасывает таймер для `"b"` и устанавливает новый таймер для `"c"`. Теперь функция `console.log("c")` будет вызвана через 10 секунд после последнего вызова `f`.

### Подведение итогов

- **Функция `debounce`** гарантирует, что функция `func` (в данном случае `console.log`) будет вызвана только после того, как прошло `ms` миллисекунд с последнего вызова дебаунсированной функции.
- **Все промежуточные вызовы функции** (например, `f("a")`, `f("b")`, `f("c")`) сбрасывают таймер и не вызывают `func` до тех пор, пока не истечет время задержки `ms` после последнего вызова.

Таким образом, после последнего вызова `f`, который передан в `setTimeout` через 5000 мс, функция `console.log` будет вызвана с аргументом `"c"` через 10 секунд после этого вызова, что в итоге будет в 15 секунд после первоначального вызова `f`.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Создайте декоратор delay(f, ms), который задерживает каждый вызов f на ms миллисекунд. Например:
<!-- basicblock-start oid="ObseukEPlL5QO3WzLxH14Ihe"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Создайте декоратор delay(f, ms), который задерживает каждый вызов f на ms миллисекунд. Например:::


Решение:

```

function delay(f, ms) {

  return function() {
    setTimeout(() => f.apply(this, arguments), ms);
  };

}

let f1000 = delay(alert, 1000);

f1000("test"); // показывает "test" после 1000 мс
```


Обратите внимание, как здесь используется функция-стрелка. Как мы знаем, функция-стрелка не имеет собственных this и arguments, поэтому f.apply(this, arguments) берет this и arguments из обёртки.

Если мы передадим обычную функцию, setTimeout вызовет её без аргументов и с this=window (при условии, что код выполняется в браузере).

Мы всё ещё можем передать правильный this, используя промежуточную переменную, но это немного громоздко:

```

function delay(f, ms) {

  return function(...args) {
    let savedThis = this; // сохраняем this в промежуточную переменную
    setTimeout(function() {
      f.apply(savedThis, args); // используем её
    }, ms);
  };

}
```
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Создайте декоратор spy(func), который должен возвращать обёртку, которая сохраняет все вызовы функции в своём свойстве calls. solution
<!-- basicblock-start oid="ObsRKbk1oIDvQxbWpvni3uNT"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Создайте декоратор spy(func), который должен возвращать обёртку, которая сохраняет все вызовы функции в своём свойстве calls. solution::


```

function spy(func) {

  function wrapper(...args) {
    // мы используем ...args вместо arguments для хранения "реального" массива в wrapper.calls
    wrapper.calls.push(args);
    return func.apply(this, args);
  }

  wrapper.calls = [];

  return wrapper;
}
```
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Создайте декоратор spy(func), который должен возвращать обёртку, которая сохраняет все вызовы функции в своём свойстве calls.
<!-- basicblock-start oid="Obs1ZJGfyDfuBSnA9WTYQD7p"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Создайте декоратор spy(func), который должен возвращать обёртку, которая сохраняет все вызовы функции в своём свойстве calls.::


```

function work(a, b) {
  alert( a + b ); // произвольная функция или метод
}

work = spy(work);

work(1, 2); // 3
work(4, 5); // 9

for (let args of work.calls) {
  alert( 'call:' + args.join() ); // "call:1,2", "call:4,5"
}
```
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Что можно сказать в общем про Декораторы и переадресация вызова, call/apply?
<!-- basicblock-start oid="ObsmjQ2Ik3Kle3W5Ziux4d5A"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Что можно сказать в общем про Декораторы и переадресация вызова, call/apply?::


Декоратор – это обёртка вокруг функции, которая изменяет поведение последней. Основная работа по-прежнему выполняется функцией.

Обычно безопасно заменить функцию или метод декорированным, за исключением одной мелочи. Если исходная функция предоставляет свойства, такие как func.calledCount или типа того, то декорированная функция их не предоставит. Потому что это обёртка. Так что нужно быть осторожным в их использовании. Некоторые декораторы предоставляют свои собственные свойства.

Декораторы можно рассматривать как «дополнительные возможности» или «аспекты», которые можно добавить в функцию. Мы можем добавить один или несколько декораторов. И всё это без изменения кода оригинальной функции!

Для реализации cachingDecorator мы изучили методы:

    func.call(context, arg1, arg2…) – вызывает func с данным контекстом и аргументами.
    func.apply(context, args) – вызывает func, передавая context как this и псевдомассив args как список аргументов.

В основном переадресация вызова выполняется с помощью apply:

```

let wrapper = function(original, arguments) {
  return original.apply(this, arguments);
};



```

Мы также рассмотрели пример заимствования метода, когда мы вызываем метод у объекта в контексте другого объекта. Весьма распространено заимствовать методы массива и применять их к arguments. В качестве альтернативы можно использовать объект с остаточными параметрами ...args, который является реальным массивом.

На практике декораторы используются для самых разных задач. Проверьте, насколько хорошо вы их освоили, решая задачи этой главы.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Что можно сказать про заимствование методов?
<!-- basicblock-start oid="Obse14RTNHHA0paEyAlAwJhI"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Что можно сказать про заимствование методов?::


Мы берём (заимствуем) метод join из обычного массива [].join. 
И используем [].join.call, чтобы выполнить его в контексте arguments.

Почему это работает?

Это связано с тем, что внутренний алгоритм встроенного метода arr.join(glue) очень прост. Взято из спецификации практически «как есть»:

    Пускай первым аргументом будет glue или, в случае отсутствия аргументов, им будет запятая ","
    Пускай result будет пустой строкой "".
    Добавить this[0] к result.
    Добавить glue и this[1].
    Добавить glue и this[2].
    …выполнять до тех пор, пока this.length элементов не будет склеено.
    Вернуть result.

Таким образом, технически он принимает this и объединяет this[0], this[1]… и т.д. вместе. Он намеренно написан так, что допускает любой псевдомассив this (не случайно, многие методы следуют этой практике). Вот почему он также работает с this=arguments.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Чем является arguments и что это означает?
<!-- basicblock-start oid="ObsXbs1J9ASLawdKNqnouVJB"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Чем является arguments и что это означает?::


arguments - это перебераемый псевдомассив, это означает, что метода массива к нему не применимы
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Как называется передача всех аргументов вместе с контекстом другой функции?
<!-- basicblock-start oid="ObshPUFASBMkR3JIrPmSOL8d"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Как называется передача всех аргументов вместе с контекстом другой функции?::


Передача всех аргументов вместе с контекстом другой функции называется «перенаправлением вызова» (call forwarding).
Простейший вид такого перенаправления:

```

let wrapper = function() {
  return func.apply(this, arguments);
};
```
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Как же кешировать метод с несколькими и больше аргументами аргументами worker.slow?
<!-- basicblock-start oid="ObsvkXJwrYPF9PQ9Czr3RlbP"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Как же кешировать метод с несколькими и больше аргументами аргументами worker.slow?::


```

let worker = {
  slow(min, max) {
    alert(`Called with ${min},${max}`);
    return min + max;
  }
};

function cachingDecorator(func, hash) {
  let cache = new Map();
  return function() {
    let key = hash(arguments); // (*)
    if (cache.has(key)) {
      return cache.get(key);
    }

    let result = func.call(this, ...arguments); // (**)

    cache.set(key, result);
    return result;
  };
}

function hash(args) {
  return args[0] + ',' + args[1];
}

worker.slow = cachingDecorator(worker.slow, hash);

alert( worker.slow(3, 5) ); // работает
alert( "Again " + worker.slow(3, 5) ); // аналогично (из кеша)

```

Теперь он работает с любым количеством аргументов.

Есть два изменения:

    В строке (*) вызываем hash для создания одного ключа из arguments. Здесь мы используем простую функцию «объединения», которая превращает аргументы (3, 5) в ключ "3,5". В более сложных случаях могут потребоваться другие функции хеширования.
    Затем в строке (**) используем func.call(this, ...arguments) для передачи как контекста, так и всех аргументов, полученных обёрткой (независимо от их количества), в исходную функцию.

Вместо func.call(this, ...arguments) мы могли бы написать func.apply(this, arguments).
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# В чем проблема при использовании декоратора с объектом?
<!-- basicblock-start oid="ObsqMwCNaufSQzLJNaLpby7X"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
В чем проблема при использовании декоратора с объектом?::


```JS
// сделаем worker.slow кеширующим
let worker = {
  someMethod() {
    return 1;
  },

  slow(x) {
    // здесь может быть страшно тяжёлая задача для процессора
    alert("Called with " + x);
    return x * this.someMethod(); // (*)
  }
};

// тот же код, что и выше
function cachingDecorator(func) {
  let cache = new Map();
  return function(x) {
    if (cache.has(x)) {
      return cache.get(x);
    }
    let result = func(x); // (**)
    cache.set(x, result);
    return result;
  };
}
alert( worker.slow(1) ); // оригинальный метод работает
worker.slow = cachingDecorator(worker.slow); // теперь сделаем его кеширующим
alert( worker.slow(2) ); // Ой! Ошибка: не удаётся прочитать свойство 'someMethod' из 'undefined'
```
////
```JS
// сделаем worker.slow кеширующим
let worker = {
  someMethod() {
    return 1;
  },

  slow(x) {
    // здесь может быть страшно тяжёлая задача для процессора
    alert("Called with " + x);
    return x * this.someMethod(); // (*)
  }
};

// тот же код, что и выше
function cachingDecorator(func) {
  let cache = new Map();
  return function(x) {
    if (cache.has(x)) {
      return cache.get(x);
    }
    let result = func(x); // (**)
    cache.set(x, result);
    return result;
  };
}
```

```JS
alert( worker.slow(1) ); // оригинальный метод работает
worker.slow = cachingDecorator(worker.slow); // теперь сделаем его кеширующим
alert( worker.slow(2) ); // Ой! Ошибка: не удаётся прочитать свойство 'someMethod' из 'undefined'
```

Теперь всё в порядке.

Чтобы всё было понятно, давайте посмотрим глубже, как передаётся `this`:

1. После _декорации_ `worker.slow` становится обёрткой `function (x) { ... }`.
2. Так что при выполнении `worker.slow(2)` обёртка получает `2` в качестве аргумента и `this=worker` (так как это объект перед точкой).
3. Внутри обёртки, если результат ещё не кеширован, `func.call(this, x)` передаёт текущий `this` (`=worker`) и текущий аргумент (`=2`) в оригинальную функцию.

<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Как выгляидит премер декоатора кеширования с мапперов в js?
<!-- basicblock-start oid="Obsn7lZBRpL1oizT3UTGcIAP"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Как выгляидит премер декоатора кеширования с мапперов в js?::


```JS
function slow(x) {
  // здесь могут быть ресурсоёмкие вычисления
  console.log(`Called with ${x}`);
  return x;
}

function cachingDecorator(func) {
  let cache = new Map();

  return function(x) {
    if (cache.has(x)) {    // если кеш содержит такой x,
      console.log(`Из кеша читаем ${x}`);
      return cache.get(x); // читаем из него результат
    }

    let result = func(x); // иначе, вызываем функцию

    cache.set(x, result); // и кешируем (запоминаем) результат
    return result;
  };
}

cachedSlow = cachingDecorator(slow);

cachedSlow(1);
cachedSlow(1);
cachedSlow(1);
cachedSlow(2);
```
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Напишите функцию printNumbers(from, to), которая выводит число каждую секунду, начиная от from и заканчивая to.
<!-- basicblock-start oid="ObsVIyxYJIyd72uK40lzwrkc"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Напишите функцию printNumbers(from, to), которая выводит число каждую секунду, начиная от from и заканчивая to.::


setInterval мое
```

function printNumbers(from, to) {
  function closure(from,to) {
  let index = 0;
    return function() {
      while (index <= to) {
        console.log(`index: ${index}`)
        return index++;
     }
    }
  }
  let count = closure(from,to);
  setInterval(count,1000);
}


// let counter = closure(1,5);
// console.log(counter());
// console.log(counter());
// console.log(counter());
// console.log(counter());
// console.log(counter());
// console.log(counter());
// console.log(counter());
// console.log(counter());

printNumbers(1,5);

```

setInterval не мое
```

function printNumbers(from, to) {
  let current = from;

  let timerId = setInterval(function() {
    console.log(current);
    if (current == to) {
      clearInterval(timerId);
    }
    current++;
  }, 1000);
}

// использование:
printNumbers(5, 10);

```

рекурсивный setTimeout не мое
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# f
<!-- basicblock-start oid="Obs7k7ERtVkSJYkyWTsosDqy"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
f::


<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Что в общем можно сказать про setTimeout и setInterval?
<!-- basicblock-start oid="ObsUD52tuNsXXDZuk54bry60"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Что в общем можно сказать про setTimeout и setInterval?::



    Методы setInterval(func, delay, ...args) и setTimeout(func, delay, ...args) позволяют выполнять func регулярно или только один раз после задержки delay, заданной в мс.
    Для отмены выполнения необходимо вызвать clearInterval/clearTimeout со значением, которое возвращают методы setInterval/setTimeout.
    Вложенный вызов setTimeout является более гибкой альтернативой setInterval. Также он позволяет более точно задать интервал между выполнениями.
    Планирование с нулевой задержкой setTimeout(func,0) или, что то же самое, setTimeout(func) используется для вызовов, которые должны быть исполнены как можно скорее, после завершения исполнения текущего кода.
    Браузер ограничивает 4-мя мс минимальную задержку между пятью и более вложенными вызовами setTimeout, а также для setInterval, начиная с 5-го вызова.

Обратим внимание, что все методы планирования не гарантируют точную задержку.

Например, таймер в браузере может замедляться по многим причинам:

    Перегружен процессор.
    Вкладка браузера в фоновом режиме.
    Работа ноутбука от аккумулятора.

Всё это может увеличивать минимальный интервал срабатывания таймера (и минимальную задержку) до 300 или даже 1000 мс в зависимости от браузера и настроек производительности ОС.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Что можно сказать про setTimeout с нулевой задержкой?
<!-- basicblock-start oid="ObsIIUYOBCd9MGUudKjuhloi"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Что можно сказать про setTimeout с нулевой задержкой?::


Особый вариант использования: setTimeout(func, 0) или просто setTimeout(func).
Это планирует вызов func настолько быстро, насколько это возможно. Но планировщик будет вызывать функцию только после завершения выполнения текущего кода.
Так вызов функции будет запланирован сразу после выполнения текущего кода.
Например, этот код выводит «Привет» и затем сразу «Мир»:

```
setTimeout(() => alert("Мир"));
alert("Привет");
```

Первая строка помещает вызов в «календарь» через 0 мс. Но планировщик проверит «календарь» только после того, как текущий код завершится. Поэтому "Привет" выводится первым, а "Мир" – после него.

Есть и более продвинутые случаи использования нулевой задержки в браузерах, которые мы рассмотрим в главе Событийный цикл: микрозадачи и макрозадачи.

Минимальная задержка вложенных таймеров в браузере

В браузере есть ограничение на то, как часто внутренние счётчики могут выполняться. В стандарте HTML5 говорится: «после пяти вложенных таймеров интервал должен составлять не менее четырёх миллисекунд.».

Продемонстрируем в примере ниже, что это означает. Вызов setTimeout повторно вызывает себя через 0 мс. Каждый вызов запоминает реальное время от предыдущего вызова в массиве times. Какова реальная задержка? Посмотрим:

```
let start = Date.now();
let times = [];

setTimeout(function run() {
  times.push(Date.now() - start); // запоминаем задержку от предыдущего вызова

  if (start + 100 < Date.now()) alert(times); // показываем задержку через 100 мс
  else setTimeout(run); // если нужно ещё запланировать
});

// пример вывода:
// 1,1,1,1,9,15,20,24,30,35,40,45,50,55,59,64,70,75,80,85,90,95,100
```

Первый таймер запускается сразу (как и указано в спецификации), а затем задержка вступает в игру, и мы видим 9, 15, 20, 24....

Аналогичное происходит при использовании setInterval вместо setTimeout: setInterval(f) запускает f несколько раз с нулевой задержкой, а затем с задержкой 4+ мс.

Это ограничение существует давно, многие скрипты полагаются на него, поэтому оно сохраняется по историческим причинам.

Этого ограничения нет в серверном JavaScript. Там есть и другие способы планирования асинхронных задач. Например, setImmediate для Node.js. Так что это ограничение относится только к браузерам.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Сборка мусора и колбэк setTimeout/setInterval
<!-- basicblock-start oid="ObsEyWnauU3ndy8clT2yV1iK"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Сборка мусора и колбэк setTimeout/setInterval::


Когда функция передаётся в setInterval/setTimeout, на неё создаётся внутренняя ссылка и сохраняется в планировщике. Это предотвращает попадание функции в сборщик мусора, даже если на неё нет других ссылок.

```
// функция остаётся в памяти до тех пор, пока планировщик обращается к ней
setTimeout(function() {...}, 100);
```

Для setInterval функция остаётся в памяти до тех пор, пока не будет вызван clearInterval.

Есть и побочный эффект. Функция ссылается на внешнее лексическое окружение, поэтому пока она существует, внешние переменные существуют тоже. Они могут занимать больше памяти, чем сама функция. Поэтому, если регулярный вызов функции больше не нужен, то лучше отменить его, даже если функция очень маленькая.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Что можно сказать про вложенный setTimeout?
<!-- basicblock-start oid="Obs4OiKgULVv0h9h1N3jVRYy"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Что можно сказать про вложенный setTimeout?::


```
let timerId = setTimeout(function tick() {
  console.log('tick');
  timerId = setTimeout(tick, 2000);
},2000);
```

Метод setTimeout выше планирует следующий вызов прямо после окончания текущего (*).

Вложенный setTimeout – более гибкий метод, чем setInterval. С его помощью последующий вызов может быть задан по-разному в зависимости от результатов предыдущего.

Например, необходимо написать сервис, который отправляет запрос для получения данных на сервер каждые 5 секунд, но если сервер перегружен, то необходимо увеличить интервал запросов до 10, 20, 40 секунд… Вот псевдокод:
```
let delay = 5000;

let timerId = setTimeout(function request() {
  ...отправить запрос...

  if (ошибка запроса из-за перегрузки сервера) {
    // увеличить интервал для следующего запроса
    delay *= 2;
  }

  timerId = setTimeout(request, delay);

}, delay);
```

А если функции, которые мы планируем, ресурсоёмкие и требуют времени, то мы можем измерить время, затраченное на выполнение, и спланировать следующий вызов раньше или позже.

Вложенный setTimeout позволяет задать задержку между выполнениями более точно, чем setInterval.

Сравним два фрагмента кода. Первый использует setInterval:

```
let i = 1;
setInterval(function() {
  func(i);
}, 100);
```
Второй использует вложенный setTimeout:
```
let i = 1;
setTimeout(function run() {
  func(i);
  setTimeout(run, 100);
}, 100);
```

Если кратко, то для setTimeout внутренний планировщик будет работать каждые 100 мс, включая время на работу самой ф-ии. Например. ф - я отрабатывала 30 сек то интервал останется 70 сек

Это нормально, потому что время, затраченное на выполнение func, использует часть заданного интервала времени.

Вполне возможно, что выполнение func будет дольше, чем мы ожидали, и займёт более 100 мс.

В данном случае движок ждёт окончания выполнения func и затем проверяет планировщик и, если время истекло, немедленно запускает его снова.

В крайнем случае, если функция всегда выполняется дольше, чем задержка delay, то вызовы будут выполняться без задержек вообще.

Ниже представлено изображение, показывающее процесс работы рекурсивного setTimeout:

**ВложенныйsetTimeout гарантирует фиксированную задержку (здесь 100 мс).**

Это потому, что новый вызов планируется в конце предыдущего.
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Сколько способов есть запускать что-то регулярно?
<!-- basicblock-start oid="ObsVa6zIzHW9mSmyPJFuNV3N"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Сколько способов есть запускать что-то регулярно?::


1 - setInterval
2 - вложенный setTimeout
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Как выглядит пример с setInterval и clearInterval
<!-- basicblock-start oid="Obs00XC4v1lwGyq07pmLLgLe"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Как выглядит пример с setInterval и clearInterval::


```
// Повторить с интервалом 2c
let timerId = setInterval(() => console.log('tick'),2000);

// Остановить показ
setTimeout(() => {clearInterval(timerId), console.log("stop")}, 5000)
```
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Что можно сказать про функцию setInterval?
<!-- basicblock-start oid="ObsklNgNzUwHxaIGO7etr7Bk"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Что можно сказать про функцию setInterval?::


Метод setInterval имеет такой же синтаксис как setTimeout:

let timerId = setInterval(func|code, [delay], [arg1], [arg2], ...);

Все аргументы имеют такое же значение. Но отличие этого метода от setTimeout в том, что функция запускается не один раз, а периодически через указанный интервал времени.
Чтобы остановить дальнейшее выполнение функции, необходимо вызвать clearInterval(timerId).
Следующий пример выводит сообщение каждые 2 секунды. Через 5 секунд вывод прекращается:

```
// повторить с интервалом 2 секунды
let timerId = setInterval(() => alert('tick'), 2000);

// остановить вывод через 5 секунд
setTimeout(() => { clearInterval(timerId); alert('stop'); }, 5000);
```
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Как выглядит clearTimeout?
<!-- basicblock-start oid="ObsTgGNeCtgd57Ieryt5clkt"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Как выглядит clearTimeout?::


```
let timerId = setTimeout(() => alert("ничего не происходит"), 1000);
alert(timerId); // идентификатор таймера

clearTimeout(timerId);
alert(timerId); // тот же идентификатор (
```
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Покажи пример функции setTimeout() 
<!-- basicblock-start oid="ObsVf5YjVYiIfcDi8yPX0G2X"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Покажи пример функции setTimeout() ::


```
function cnsl(str) {
  console.log(str);
}

setTimeout(cnsl,3000,"world");
setTimeout(cnsl("hello"),1000);
```
<!-- basicblock-end -->




#learnJsTasks_part_1_6_advanced_work_with_functions_timeouts
#part_1_6_advanced_work_with_functions_timeouts

#telegram 

# Какие методы планирования вызова существуют?
<!-- basicblock-start oid="Obsf882jjPOfZ9eSQI11Z2oc"  deck='learnJsTasks_part_1_6_advanced_work_with_functions_timeouts' -->
Какие методы планирования вызова существуют?::


Для этого существуют два метода:

    setTimeout позволяет вызвать функцию один раз через определённый интервал времени.
    setInterval позволяет вызывать функцию регулярно, повторяя вызов через определённый интервал времени.
<!-- basicblock-end -->



