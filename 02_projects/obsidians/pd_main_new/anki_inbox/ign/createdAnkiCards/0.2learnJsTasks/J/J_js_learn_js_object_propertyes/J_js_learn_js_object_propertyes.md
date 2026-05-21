
#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Как создать чистый словарный объект в JS?
<!-- basicblock-start oid="ObsdBfCLt05wWfMaaaEruXMm"  deck='J_js_learn_js_object_propertyes' -->
Как создать чистый словарный объект в JS?::


let obj = Object.create(null);
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Как создать клон объекта с помощью // клон obj c тем же прототипом (с поверхностным копированием свойств)
<!-- basicblock-start oid="ObsfSIxA9OrYXg8bj8EIyXg4"  deck='J_js_learn_js_object_propertyes' -->
Как создать клон объекта с помощью // клон obj c тем же прототипом (с поверхностным копированием свойств)::


let clone = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Как выглядит пример создания объекта с указанием [[Prototype]] и указанием дескрипторов?
<!-- basicblock-start oid="ObsVtNKpGyr5z5h0cnBszfvF"  deck='J_js_learn_js_object_propertyes' -->
Как выглядит пример создания объекта с указанием [[Prototype]] и указанием дескрипторов?::


```
let animal = {
  eats: true
};

let rabbit = Object.create(animal, {
  jumps: {
    value: true
  }
});

console.log(rabbit.jumps); // true
```
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# устанавливает свойство [[Prototype]] объекта obj как proto.
<!-- basicblock-start oid="ObsJFR9eOMsJg6LbKMVDvhte"  deck='J_js_learn_js_object_propertyes' -->
устанавливает свойство [[Prototype]] объекта obj как proto.::


Object.setPrototypeOf(obj, proto) – устанавливает свойство [[Prototype]] объекта obj как proto.
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# возвращает свойство [[Prototype]] объекта obj.
<!-- basicblock-start oid="ObsTtwZWYSVMYQzrilMimALc"  deck='J_js_learn_js_object_propertyes' -->
возвращает свойство [[Prototype]] объекта obj.::


Object.getPrototypeOf(obj) – возвращает свойство [[Prototype]] объекта obj.
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Как создать пустой объект со свойством [[Prototype]] ?
<!-- basicblock-start oid="ObskFInMmrNfrL6WVRRjxChP"  deck='J_js_learn_js_object_propertyes' -->
Как создать пустой объект со свойством [[Prototype]] ?::


Object.create(proto[, descriptors]) – создаёт пустой объект со свойством [[Prototype]], указанным как proto, и необязательными дескрипторами свойств descriptors.
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# а
<!-- basicblock-start oid="Obs1aNbXKyuzRsaEXXBORO1I"  deck='J_js_learn_js_object_propertyes' -->
Почему функция 1 работает не так как функция 2 ?

Функция 1
```JS
function f(a,b) {
  console.log(a+b);
}
Function.prototype.defer = function(time) {
  return (...args) => {
    setTimeout(this(args[0],args[1], time));
  };
};

f.defer(5000)(1,4); // выведет "Hello!" через 1 секунду
f.defer(3000)(1,2); // выведет "Hello!" через 1 секунду
```

Функция 2
```javascript
Function.prototype.defer = function(ms) {
  let f = this;
  return function(...args) {
    setTimeout(() => f.apply(this, args), ms);
  }
};

// check it
function f(a, b) {
  alert( a + b );
}

f.defer(1000)(1, 2); // выведет 3 через 1 секунду.
```
::

Ваш код не работает так, как ожидается, по следующим причинам:

### 1. **Некорректный вызов функции в `setTimeout`**
   
```javascript
setTimeout(this(args[0], args[1], time));
```

Здесь вы вызываете функцию `this` (которая ссылается на `f`) немедленно, а не передаете ее в `setTimeout` для выполнения через заданное время. В результате функция `f` выполняется сразу, а `setTimeout` получает не функцию, которую он должен вызвать через время, а результат выполнения функции `f`.

Для того чтобы функция выполнялась через заданное время, необходимо передать функцию-обертку (или ссылку на функцию) в `setTimeout`.

### 2. **Неверное использование `setTimeout`**

`setTimeout` принимает два аргумента:
- Первый аргумент — это функция, которую нужно выполнить через определенное время.
- Второй аргумент — это задержка в миллисекундах.

### Исправленный вариант:

```javascript
Function.prototype.defer = function(time) {
  return (...args) => {
    setTimeout(() => this(...args), time);
  };
};
```

### Что происходит в исправленном коде:

1. **Возвращаемая функция-обертка:**
   - `return (...args) => { ... }` возвращает новую стрелочную функцию, которая принимает аргументы (`args`).

2. **Корректное использование `setTimeout`:**
   - `setTimeout(() => this(...args), time);` использует стрелочную функцию как первый аргумент. Эта стрелочная функция вызывает исходную функцию (`this`, которая ссылается на `f`), передавая ей аргументы `args` через заданное время `time`.

### Пример:

Теперь, если вы выполните код:

```javascript
function f(a, b) {
  console.log(a + b);
}

f.defer(5000)(1, 4); // выведет 5 через 5 секунд
f.defer(3000)(1, 2); // выведет 3 через 3 секунды
```

Результатом будет вывод суммы аргументов через 5 и 3 секунды соответственно.

### Заключение:

Ошибка заключалась в том, что вы сразу выполняли функцию вместо того, чтобы передать ее в `setTimeout` для выполнения через указанное время. Исправление позволяет функции `f` выполняться через заданную задержку, как это и предполагалось.


<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Что происходит в функции?
<!-- basicblock-start oid="ObsHNjiRA9d5pigT6qYKRJpo"  deck='J_js_learn_js_object_propertyes' -->
Что происходит в функции?
```javascript
Function.prototype.defer = function(ms) {
  let f = this;
  return function(...args) {
    setTimeout(() => f.apply(this, args), ms);
  }
};

// check it
function f(a, b) {
  alert( a + b );
}

f.defer(1000)(1, 2); // выведет 3 через 1 секунду.
```

::


Давайте разберем код по шагам, чтобы понять, что происходит в этой функции.

### 1. **Добавление метода `defer` в `Function.prototype`**

```javascript
Function.prototype.defer = function(ms) {
  // ...
};
```

Эта строка добавляет новый метод `defer` ко всем функциям. Это делается за счет добавления его в `Function.prototype`, от которого наследуют все функции в JavaScript. Таким образом, любая функция, созданная в будущем, будет иметь доступ к методу `defer`.

### 2. **Сохранение ссылки на исходную функцию**

```javascript
let f = this;
```

Здесь сохраняется ссылка на текущую функцию в переменной `f`. `this` в этом контексте ссылается на функцию, к которой применяется метод `defer`. Например, в вашем случае это будет функция `f`.

### 3. **Возвращение новой функции**

```javascript
return function(...args) {
  setTimeout(() => f.apply(this, args), ms);
};
```

Здесь метод `defer` возвращает новую функцию. Эта функция:

- Принимает любые аргументы (`...args`), которые затем будут переданы исходной функции `f`.
- Внутри функции используется `setTimeout` для откладывания вызова исходной функции `f` на определённое количество миллисекунд (`ms`).

### 4. **Использование `setTimeout` для отложенного вызова**

```javascript
setTimeout(() => f.apply(this, args), ms);
```

`setTimeout` используется для вызова функции `f` через указанный промежуток времени (`ms`). 

- Функция, переданная в `setTimeout`, это стрелочная функция `() => f.apply(this, args)`.
- Стрелочная функция сохраняет контекст `this` таким, каким он был в момент вызова новой функции (то есть в контексте функции, возвращённой `defer`).
- `f.apply(this, args)` вызывает исходную функцию `f` в контексте текущего `this`, передавая ей аргументы `args`.

### 5. **Пример использования**

Рассмотрим пример, который вы привели:

```javascript
function f(a, b) {
  alert( a + b );
}

f.defer(1000)(1, 2); // выведет 3 через 1 секунду.
```

Что происходит здесь:

1. `f.defer(1000)` — это вызов метода `defer` на функции `f`, передавая ей задержку в 1000 миллисекунд (1 секунду). Метод `defer` возвращает новую функцию.

2. `(1, 2)` — это передача аргументов (1 и 2) в возвращенную функцию. Эта функция вызывает `setTimeout`, который через 1 секунду выполнит исходную функцию `f`, передавая ей эти аргументы.

3. Через 1 секунду после вызова `f.defer(1000)(1, 2);`, `setTimeout` вызовет `f.apply(this, args)` внутри стрелочной функции, что выполнит `f(1, 2)`.

4. Функция `f` сработает и вызовет `alert(1 + 2)`, то есть выведет `3`.

### Итог

Метод `defer` добавляет задержку перед выполнением функции. Он возвращает новую функцию, которая, будучи вызванной с аргументами, откладывает выполнение исходной функции на заданное количество миллисекунд. В примере вызов `f.defer(1000)(1, 2);` приведет к тому, что через 1 секунду будет выполнена функция `f(1, 2)` с выводом результата `3`.



<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Добавьте всем функциям в прототип метод defer(ms), который возвращает обёртку, откладывающую вызов функции на ms миллисекунд.
<!-- basicblock-start oid="Obsdh9iUC4N8n59hSUXh70t1"  deck='J_js_learn_js_object_propertyes' -->
Добавьте всем функциям в прототип метод defer(ms), который возвращает обёртку, откладывающую вызов функции на ms миллисекунд.::


```
Function.prototype.defer = function(ms) {
  let f = this;
  return function(...args) {
    setTimeout(() => f.apply(this, args), ms);
  }
};

// check it
function f(a, b) {
  alert( a + b );
}

f.defer(1000)(1, 2); // выведет 3 через 1 секунду.
```
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Что можно сказать про встроенные прототтипы?
<!-- basicblock-start oid="ObsB6GxPzpbDnZsMnVxkeBbq"  deck='J_js_learn_js_object_propertyes' -->
Что можно сказать про встроенные прототтипы?::



    Все встроенные объекты следуют одному шаблону:
        Методы хранятся в прототипах (Array.prototype, Object.prototype, Date.prototype и т.д.).
        Сами объекты хранят только данные (элементы массивов, свойства объектов, даты).
    Примитивы также хранят свои методы в прототипах объектов-обёрток: Number.prototype, String.prototype, Boolean.prototype. Только у значений undefined и null нет объектов-обёрток.
    Встроенные прототипы могут быть изменены или дополнены новыми методами. Но не рекомендуется менять их. Единственная допустимая причина – это добавление нового метода из стандарта, который ещё не поддерживается движком JavaScript.
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Свойство "prototype" широко используется внутри самого языка JavaScript. 
<!-- basicblock-start oid="Obs4oPJUbwEmsxNIKUOfJON9"  deck='J_js_learn_js_object_propertyes' -->
Свойство "prototype" широко используется внутри самого языка JavaScript. ::


Все встроенные функции-конструкторы используют его.
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Что кратко можно сказать о F.prototype?
<!-- basicblock-start oid="ObslWw3O90AEGVlj7YP36v2M"  deck='J_js_learn_js_object_propertyes' -->
Что кратко можно сказать о F.prototype?::


В этой главе мы кратко описали способ задания [[Prototype]] для объектов, создаваемых с помощью функции-конструктора. Позже мы рассмотрим, как можно использовать эту возможность.

Всё достаточно просто. Выделим основные моменты:

    Свойство F.prototype (не путать с [[Prototype]]) устанавливает [[Prototype]] для новых объектов при вызове new F().
    Значение F.prototype должно быть либо объектом, либо null. Другие значения не будут работать.
    Свойство "prototype" является особым, только когда оно назначено функции-конструктору, которая вызывается оператором new.

В обычных объектах prototype не является чем-то особенным:

```
let user = {
  name: "John",
  prototype: "Bla-bla" // никакой магии нет - обычное свойство
};
```

По умолчанию все функции имеют F.prototype = { constructor: F }, поэтому мы можем получить конструктор объекта через свойство "constructor".
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# У нас есть два хомяка: шустрый (speedy) и ленивый (lazy); оба наследуют от общего объекта hamster. Когда мы кормим одного хомяка, второй тоже наедается. Почему? Как это исправить?
<!-- basicblock-start oid="ObswP8jrEKdwqG0JPkz5TMcu"  deck='J_js_learn_js_object_propertyes' -->
У нас есть два хомяка: шустрый (speedy) и ленивый (lazy); оба наследуют от общего объекта hamster. Когда мы кормим одного хомяка, второй тоже наедается. Почему? Как это исправить?::


#Решение 1
```
let hamster = {
  stomach: [],

  eat(food) {
    this.stomach.push(food);
  },
  
};

let speedy = {
  __proto__: hamster,
  stomach: [],
};

let lazy = {
  __proto__: hamster,
   stomach: [],
};

// Этот хомяк нашёл еду
speedy.eat("apple");
console.log( speedy.stomach ); // apple
// У этого хомяка тоже есть еда. Почему? Исправьте
console.log( lazy.stomach ); // apple
```

#Решение 2
```javascript
let hamster = {
  stomach: [],

  eat(food) {
    // присвоение значения this.stomach вместо вызова this.stomach.push
    this.stomach = [food];
  }
};

let speedy = {
   __proto__: hamster
};

let lazy = {
  __proto__: hamster
};

// Шустрый хомяк нашёл еду
speedy.eat("apple");
alert( speedy.stomach ); // apple

// Живот ленивого хомяка пуст
alert( lazy.stomach ); // <ничего>
```
```

<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Покажи пример прототипного наследования js?
<!-- basicblock-start oid="ObsdEVYsl4R6kYsSayVyL4Vo"  deck='J_js_learn_js_object_propertyes' -->
Покажи пример прототипного наследования js?::


```
let head = {
  glasses: 1
};

let table = {
  pen: 3
};

let bed = {
  sheet: 1,
  pillow: 2
};

let pockets = {
  money: 2000
};
Object.setPrototypeOf(pockets, bed);
Object.setPrototypeOf(bed,table);
Object.setPrototypeOf(table, head);
console.log(pockets.glasses);
```
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Как определить свойство объекта, которое будет вычелсяться на основе другого свойства (полезно для решения проблем совместимости старого кода и нового)?
<!-- basicblock-start oid="Obsl7IW0vhV8AooIF9AfevgW"  deck='J_js_learn_js_object_propertyes' -->
Как определить свойство объекта, которое будет вычелсяться на основе другого свойства (полезно для решения проблем совместимости старого кода и нового)?::


```
function User(name,birthday) {
  this.name = name;
  this.birthday = birthday;
  
  Object.defineProperty(this,"age", {
    get() {
      let todayYear = new Date().getFullYear();
      return todayYear - this.birthday.getFullYear();
    }
  })
}
let tolya = new User("Tolya", new Date(1998,05,12));
console.log(tolya.age);
```
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Что можно сказать про умные геттеры и сеттеры?
<!-- basicblock-start oid="Obs3Ns8OMpncmxRUHs6WlARX"  deck='J_js_learn_js_object_propertyes' -->
Что можно сказать про умные геттеры и сеттеры?::


```
let user = {
  get name() {
    return this._name;
  },

  set name(value) {
    if (value.length < 4) {
      alert("Имя слишком короткое, должно быть более 4 символов");
      return;
    }
    this._name = value;
  }
};

user.name = "Pete";
alert(user.name); // Pete

user.name = ""; // Имя слишком короткое...
```
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Что такое аксессоры ?
<!-- basicblock-start oid="Obs6iNrMhoTUW0Xt6DHMAkUE"  deck='J_js_learn_js_object_propertyes' -->
Что такое аксессоры ?::


Это специальные методы которые предоставляют методы которые позволяют контролировать свойства объекта

есть геттеры и сеттеры
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Как выглядит объект с методом     // геттер, срабатывает при чтении obj.propName и     // геттер, срабатывает при чтении obj.propName     и методом // сеттер, срабатывает при записи obj.propName = value?
<!-- basicblock-start oid="Obs0YmFQhRBr0z7gG6yIIIYM"  deck='J_js_learn_js_object_propertyes' -->
Как выглядит объект с методом     // геттер, срабатывает при чтении obj.propName и     // геттер, срабатывает при чтении obj.propName     и методом // сеттер, срабатывает при записи obj.propName = value?::


```
let obj = {
  get propName() {
    // геттер, срабатывает при чтении obj.propName
  },

  set propName(value) {
    // сеттер, срабатывает при записи obj.propName = value
  }
};
```
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Возвращает true, если добавление/удаление/изменение свойств запрещено, и для всех текущих свойств установлено configurable: false, writable: false.
<!-- basicblock-start oid="ObsZ3dRIT3RKeZRiwu8piOoc"  deck='J_js_learn_js_object_propertyes' -->
Возвращает true, если добавление/удаление/изменение свойств запрещено, и для всех текущих свойств установлено configurable: false, writable: false.::


На практике эти методы используются редко.

Object.isFrozen(obj)
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Возвращает true, если добавление/удаление свойств запрещено и для всех существующих свойств установлено configurable: false.
<!-- basicblock-start oid="ObssLJpA4RxftPuHCtRElfUE"  deck='J_js_learn_js_object_propertyes' -->
Возвращает true, если добавление/удаление свойств запрещено и для всех существующих свойств установлено configurable: false.::


Object.isSealed(obj)
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Возвращает false, если добавление свойств запрещено, иначе true.
<!-- basicblock-start oid="ObsvFNuV3x0Lg4cYqJyXrvno"  deck='J_js_learn_js_object_propertyes' -->
Возвращает false, если добавление свойств запрещено, иначе true.::


Object.isExtensible(obj)
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Запрещает добавлять/удалять/изменять свойства. Устанавливает configurable: false, writable: false для всех существующих свойств. А также есть методы для их проверки:
<!-- basicblock-start oid="ObszBGA9HmJ8UREzxIaggsMz"  deck='J_js_learn_js_object_propertyes' -->
Запрещает добавлять/удалять/изменять свойства. Устанавливает configurable: false, writable: false для всех существующих свойств. А также есть методы для их проверки:::


Object.freeze(obj)
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Запрещает добавлять/удалять свойства. Устанавливает configurable: false для всех существующих свойств.
<!-- basicblock-start oid="Obsg61brnCvf6G6OtBV49mZH"  deck='J_js_learn_js_object_propertyes' -->
Запрещает добавлять/удалять свойства. Устанавливает configurable: false для всех существующих свойств.::


Object.seal(obj)
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Запрещает добавлять новые свойства в объект.
<!-- basicblock-start oid="Obs3r9fzvzSrFCzC7rrI3tYt"  deck='J_js_learn_js_object_propertyes' -->
Запрещает добавлять новые свойства в объект.::


Object.preventExtensions(obj)
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Чтобы получить все дескрипторы свойств сразу, можно воспользоваться методом ?
<!-- basicblock-start oid="ObsoqdrpZtO48oQvOrG5V6Pj"  deck='J_js_learn_js_object_propertyes' -->
Чтобы получить все дескрипторы свойств сразу, можно воспользоваться методом ?::


Чтобы получить все дескрипторы свойств сразу, можно воспользоваться методом Object.getOwnPropertyDescriptors(obj).

Вместе с Object.defineProperties этот метод можно использовать для клонирования объекта вместе с его флагами:

let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));

Обычно при клонировании объекта мы используем присваивание, чтобы скопировать его свойства:

for (let key in user) {
  clone[key] = user[key]
}

…Но это не копирует флаги. Так что если нам нужен клон «получше», предпочтительнее использовать Object.defineProperties.

Другое отличие в том, что for..in игнорирует символьные и неперечислимые свойства, а Object.getOwnPropertyDescriptors возвращает дескрипторы всех свойств.
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Существует метод который позволяет определять множество свойств сразу.
<!-- basicblock-start oid="ObsBkGxu2RvA9ULRTIfWf0xO"  deck='J_js_learn_js_object_propertyes' -->
Существует метод который позволяет определять множество свойств сразу.::


 Object.defineProperties(obj, descriptors),
```
Object.defineProperties(obj, {
  prop1: descriptor1,
  prop2: descriptor2
  // ...
});
```
<!-- basicblock-end -->




#J_js_learn_js_object_propertyes
#js_learn_js_object_propertyes

#telegram 

# Как создать свою константу?
<!-- basicblock-start oid="ObsEYkp98KpNonTquukxtdf4"  deck='J_js_learn_js_object_propertyes' -->
Как создать свою константу?::


```
let user = {
  name: "John"
};

Object.defineProperty(user, "name", {
  writable: false,
  configurable: false
});

// теперь невозможно изменить user.name или его флаги
// всё это не будет работать:
user.name = "Pete";
delete user.name;
Object.defineProperty(user, "name", { value: "Pete" });
```
<!-- basicblock-end -->



