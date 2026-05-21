
#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что можно сказать в общем про миксины?
<!-- basicblock-start oid="ObsemthaHKrA3dckLrOBkk8a"  deck='J_js_learn_js_classes' -->
Что можно сказать в общем про миксины?::


Примесь – общий термин в объектно-ориентированном программировании: класс, который содержит в себе методы для других классов.

Некоторые другие языки допускают множественное наследование. JavaScript не поддерживает множественное наследование, но с помощью примесей мы можем реализовать нечто похожее, скопировав методы в прототип.

Мы можем использовать примеси для расширения функциональности классов, например, для обработки событий, как мы сделали это выше.

С примесями могут возникнуть конфликты, если они перезаписывают существующие методы класса. Стоит помнить об этом и быть внимательнее при выборе имён для методов примеси, чтобы их избежать.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 





#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Вот подробное объяснение работы цепочки прототипов в JavaScript с использованием классов, конструкций `extends` и метода `__proto__`. Код содержит комментарии и демонстрирует, как прототипы работают при наследовании.
<!-- basicblock-start oid="ObseEtAHgrxT9JOScuTPUSNW"  deck='J_js_learn_js_classes' -->
Вот подробное объяснение работы цепочки прототипов в JavaScript с использованием классов, конструкций `extends` и метода `__proto__`. Код содержит комментарии и демонстрирует, как прототипы работают при наследовании.::


### Часть 1: Базовая цепочка прототипов с использованием функции-конструктора

```
// Функция-конструктор Animal
function Animal(name) {
  this.name = name;
}

// Добавляем метод в прототип Animal
Animal.prototype.sayHello = function() {
  console.log(`Hello, I am ${this.name}!`);
};

// Создаём экземпляр Animal
let animal = new Animal("Elephant");

animal.sayHello(); // 'Hello, I am Elephant!'

// Цепочка прототипов:
// 1. animal.__proto__ === Animal.prototype
// 2. Animal.prototype.__proto__ === Object.prototype
// 3. Object.prototype.__proto__ === null

console.log(animal.__proto__ === Animal.prototype); // true
console.log(Animal.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null); // true
```

**Объяснение**:
- `__proto__` указывает на прототип объекта. Для объекта `animal` это `Animal.prototype`.
- Каждый объект наследует методы через цепочку прототипов. В данном случае:
  - `animal.__proto__` указывает на `Animal.prototype`.
  - `Animal.prototype.__proto__` указывает на `Object.prototype`, который является прототипом всех объектов в JavaScript.
- `Object.prototype.__proto__` равен `null`, так как это конец цепочки.

### Часть 2: Наследование с помощью `extends` в ES6

```
// Создаём класс Animal
class Animal {
  constructor(name) {
    this.name = name;
  }

  sayHello() {
    console.log(`Hello, I am ${this.name}!`);
  }
}

// Создаём класс Dog, который наследует от Animal
class Dog extends Animal {
  bark() {
    console.log(`${this.name} says Woof!`);
  }
}

// Создаём экземпляр Dog
let dog = new Dog("Buddy");

dog.sayHello(); // 'Hello, I am Buddy!'
dog.bark(); // 'Buddy says Woof!'

// Цепочка прототипов:
// 1. dog.__proto__ === Dog.prototype
// 2. Dog.prototype.__proto__ === Animal.prototype
// 3. Animal.prototype.__proto__ === Object.prototype

console.log(dog.__proto__ === Dog.prototype); // true
console.log(Dog.prototype.__proto__ === Animal.prototype); // true
console.log(Animal.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null); // true
```

**Объяснение**:
- `class` и `extends` — это синтаксический сахар для работы с прототипами.
- Класс `Dog` наследует от класса `Animal`, что означает, что `Dog.prototype` автоматически ссылается на `Animal.prototype`. Это позволяет объектам `Dog` наследовать методы из `Animal`.
- Цепочка прототипов: `dog.__proto__` указывает на `Dog.prototype`, а `Dog.prototype.__proto__` указывает на `Animal.prototype`. Дальше цепочка продолжается через `Object.prototype`.

### Часть 3: Использование `Object.getPrototypeOf()` и `Object.setPrototypeOf()`

```
// Создаём объекты напрямую
let animal = {
  eats: true
};

let rabbit = {
  jumps: true
};

// Устанавливаем animal как прототип для rabbit
Object.setPrototypeOf(rabbit, animal);

console.log(rabbit.eats); // true (наследуется от animal)
console.log(Object.getPrototypeOf(rabbit) === animal); // true

// Цепочка прототипов:
// 1. rabbit.__proto__ === animal
// 2. animal.__proto__ === Object.prototype
// 3. Object.prototype.__proto__ === null
```

**Объяснение**:
- `Object.setPrototypeOf()` устанавливает прототип объекта. В этом примере объект `rabbit` получает доступ к свойству `eats`, потому что его прототипом стал объект `animal`.
- Используя `Object.getPrototypeOf()`, мы можем узнать, что прототипом `rabbit` является объект `animal`.

### Часть 4: Прототипы с использованием `extends` и родительских методов

```::

class Animal {
  constructor(name) {
    this.name = name;
  }

  sayHello() {
    console.log(`Hello, I am ${this.name}!`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Вызываем конструктор родительского класса
    this.breed = breed;
  }

  bark() {
    console.log(`${this.name} says Woof!`);
  }

  // Переопределяем метод родительского класса
  sayHello() {
    super.sayHello(); // Вызов метода родителя
    console.log(`I am a ${this.breed}`);
  }
}

let dog = new Dog("Buddy", "Labrador");

dog.sayHello(); 
// 'Hello, I am Buddy!'
// 'I am a Labrador'

dog.bark(); // 'Buddy says Woof!'

// Цепочка прототипов аналогична предыдущему примеру
```

**Объяснение**:
- Использование `super()` позволяет вызывать методы и конструкторы родительского класса.
- `super.sayHello()` вызывает метод `sayHello` из класса `Animal`, но затем в классе `Dog` этот метод может быть дополнен или переопределён.
- Цепочка прототипов сохраняется такой же: `Dog.prototype` указывает на `Animal.prototype`.

### Разбор понятий `__proto__` и `prototype`

1. **`__proto__`**:
   - Это скрытое свойство каждого объекта, которое указывает на его прототип. Оно позволяет объекту наследовать свойства и методы от другого объекта.
   - Например, `dog.__proto__` указывает на `Dog.prototype`, а затем на `Animal.prototype` и, в конечном счёте, на `Object.prototype`.

2. **`prototype`**:
   - Это свойство конструктора (функции или класса), которое определяет прототип для всех объектов, созданных с помощью этого конструктора.
   - Например, `Dog.prototype` — это объект, от которого будут наследовать все экземпляры класса `Dog`.

### Итог:
- **`__proto__`**: используется для указания на прототип объекта (наследует свойства и методы).
- **`prototype`**: используется как прототипный объект для создания новых объектов через функции-конструкторы или классы.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что такое примесь?
<!-- basicblock-start oid="ObscOp3SeezJlOrlPWjI5Wrv"  deck='J_js_learn_js_classes' -->
Что такое примесь?::


это класс методы, которого предназначены для использования в других классах, при этом без наследования от примеси.

Другими словами, примесь определят методы, которые реализуют некоторое поведение без непосредственного наследования от примесей. То есть мы не используем примесь саму по себе, а используем для того, чтобы реализовать недостающий функционал в некотором классе
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Чем A.prototype отличается от Object.prototype?
<!-- basicblock-start oid="Obs9rWMpy9XjopqRlJp6q74s"  deck='J_js_learn_js_classes' -->
Чем A.prototype отличается от Object.prototype?::


`A.prototype` и `Object.prototype` относятся к разным концепциям в JavaScript и играют разные роли в цепочке прототипов.

### `A.prototype`

- **Что это**: `A.prototype` — это прототипный объект, связанный с конструктором `A`. Когда вы создаёте новый объект с помощью конструктора `A` (например, `let a = new A();`), этот новый объект будет иметь `A.prototype` в качестве своего прототипа.

- **Роль**: `A.prototype` предоставляет свойства и методы, которые будут доступны всем объектам, созданным с помощью конструктора `A`. 

  ```
  function A() {}
  A.prototype.sayHello = function() {
    console.log('Hello from A!');
  };

  let a = new A();
  a.sayHello(); // 'Hello from A!'
  
```

  В этом примере метод `sayHello` доступен всем объектам, созданным с помощью конструктора `A`, так как он определён в `A.prototype`.

### `Object.prototype`

- **Что это**: `Object.prototype` — это глобальный прототип, от которого наследуют все объекты в JavaScript. Он представляет собой базовый прототип, который определяет свойства и методы, доступные всем объектам.

- **Роль**: `Object.prototype` предоставляет методы, которые доступны всем объектам, включая объекты, созданные с помощью конструктора `A`. Это включает методы такие как `toString()`, `hasOwnProperty()`, `isPrototypeOf()` и другие.

  ```
  function A() {}
  let a = new A();
  console.log(a.toString()); // '[object Object]'
  
```

  В этом примере метод `toString` доступен объекту `a`, потому что `Object.prototype` является частью цепочки прототипов для всех объектов.

### Основные отличия

- **Область действия**:
  - `A.prototype` относится к конкретному конструктору `A` и его экземплярам.
  - `Object.prototype` является глобальным прототипом, от которого наследуют все объекты в JavaScript.

- **Использование**:
  - `A.prototype` используется для определения свойств и методов, специфичных для объектов, созданных с помощью конструктора `A`.
  - `Object.prototype` предоставляет общие методы и свойства, доступные всем объектам.

### Цепочка прототипов

При создании объекта `a` с помощью конструктора `A`, цепочка прототипов будет выглядеть так:

```
a --> A.prototype --> Object.prototype --> null
```

Таким образом, `a` наследует свойства и методы от `A.prototype`, и, в свою очередь, от `Object.prototype`.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# почему?
<!-- basicblock-start oid="ObshXrL22kxptHMZyL2zf0mT"  deck='J_js_learn_js_classes' -->
почему?

```JS
function A() {}
function B() {}

A.prototype = B.prototype = {};

let a = new A();

alert( a instanceof B ); // true
```
::

В этом коде `a instanceof B` возвращает `true` из-за того, что оба конструктора `A` и `B` имеют одинаковый прототип. Вот как это работает:

1. **Прототипы конструктора**:
   ```javascript
   A.prototype = B.prototype = {};
   ```
   Здесь вы устанавливаете `A.prototype` и `B.prototype` на один и тот же объект `{}`. Это означает, что оба конструктора, `A` и `B`, будут использовать один и тот же объект в качестве прототипа. Этот объект становится прототипом всех объектов, созданных с помощью этих конструкторов.

2. **Создание объекта**:
   ```javascript
   let a = new A();
   ```
   Когда вы создаёте новый объект `a` с помощью конструктора `A`, его прототипом становится объект, указанный в `A.prototype`, который в данном случае также является прототипом для конструктора `B`.

3. **Оператор `instanceof`**:
   ```javascript
   alert(a instanceof B); // true
   ```
   Оператор `instanceof` проверяет, находится ли объект `a` в цепочке прототипов конструктора `B`. Поскольку `a` был создан с помощью конструктора `A`, и `A.prototype` и `B.prototype` ссылаются на один и тот же объект, это означает, что прототип `a` совпадает с прототипом `B`. Следовательно, `a` является экземпляром `B` по цепочке прототипов.

Вот диаграмма, которая может помочь понять это:

```plaintext
a --> A.prototype (который равен B.prototype) --> {}
            ↑
            B.prototype
```

Таким образом, объект `a` наследует от объекта `B.prototype`, и поэтому `a instanceof B` возвращает `true`.

<!-- basicblock-end -->

# Что можно сказать про Symbol.toStringTag?
<!-- basicblock-start oid="ObsTTu5h65Kcr1YQYQBeaAhc"  deck='J_js_learn_js_classes' -->
Что можно сказать про Symbol.toStringTag?::


Поведение метода объектов toString можно настраивать, используя специальное свойство объекта Symbol.toStringTag.

Например:

```
let user = {
  [Symbol.toStringTag]: "User"
};

alert( {}.toString.call(user) ); // [object User]
```

Такое свойство есть у большей части объектов, специфичных для определённых окружений. Вот несколько примеров для браузера:

// toStringTag для браузерного объекта и класса
```
alert( window[Symbol.toStringTag]); // window
alert( XMLHttpRequest.prototype[Symbol.toStringTag] ); // XMLHttpRequest

alert( {}.toString.call(window) ); // [object Window]
alert( {}.toString.call(new XMLHttpRequest()) ); // [object XMLHttpRequest]
```

Как вы можете видеть, результат – это значение Symbol.toStringTag (если он имеется) обёрнутое в [object ...].

В итоге мы получили «typeof на стероидах», который не только работает с примитивными типами данных, но также и со встроенными объектами, и даже может быть настроен.

Можно использовать {}.toString.call вместо instanceof для встроенных объектов, когда мы хотим получить тип в виде строки, а не просто сделать проверку.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что означает object.prototype? чем отличается от object._proto_?
<!-- basicblock-start oid="ObsZXcDagTlpvqDB005bNnwj"  deck='J_js_learn_js_classes' -->
Что означает object.prototype? чем отличается от object._proto_?::


`Object.prototype` и `object.__proto__` связаны с прототипным наследованием в JavaScript, но выполняют разные функции:

1. **`Object.prototype`**:
   - Это свойство объекта `Object`, которое представляет собой прототип всех объектов в JavaScript. Оно содержит свойства и методы, которые доступны всем объектам.
   - Примеры свойств и методов, которые можно найти в `Object.prototype`, включают `toString()`, `hasOwnProperty()`, `isPrototypeOf()` и другие.
   - Когда вы создаёте новый объект, он по умолчанию наследует свойства и методы от `Object.prototype`.

   Пример использования:

   ```
   let obj = {};
   console.log(obj.toString()); // Выведет строку '[object Object]'
   
```

   Здесь метод `toString` вызван для объекта `obj`, который унаследовал его от `Object.prototype`.

2. **`object.__proto__`**:
   - Это внутреннее свойство объекта, которое указывает на его прототип. Используется для получения или установки прототипа конкретного объекта.
   - Это не стандартный способ работы с прототипами, но он всё ещё используется в некоторых старых реализациях JavaScript и поддерживается большинством современных браузеров.

   Пример использования:

   ```
   let animal = {
     eats: true
   };

   let rabbit = {
     jumps: true
   };

   rabbit.__proto__ = animal;

   console.log(rabbit.eats); // true
   
```

   Здесь `rabbit.__proto__` указывает на `animal`, таким образом `rabbit` наследует свойство `eats` от `animal`.

**Основные отличия**:
- `Object.prototype` — это глобальный прототип, от которого наследуют все объекты.
- `object.__proto__` — это свойство конкретного объекта, которое указывает на его прототип и может быть изменено.

В современных JavaScript-реализациях рекомендуется использовать методы `Object.getPrototypeOf()` и `Object.setPrototypeOf()` для работы с прототипами, так как они являются стандартными и более безопасными.

Примеры использования:

```
let obj = {};
let proto = Object.getPrototypeOf(obj); // Получение прототипа
Object.setPrototypeOf(obj, proto); // Установка прототипа
```
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Объясни как работает цепочка прототипов в js?
<!-- basicblock-start oid="ObsI5Y5mDsMgzNX9fByZI9Ok"  deck='J_js_learn_js_classes' -->
Объясни как работает цепочка прототипов в js?::


Цепочка прототипов в JavaScript представляет собой механизм, с помощью которого объекты наследуют свойства и методы от других объектов. Вот основные концепции, которые стоит учитывать:

1. **Прототипы и наследование**: В JavaScript каждый объект имеет ссылку на прототип (prototype), который является другим объектом. Когда у объекта запрашивается свойство или метод, которого нет в самом объекте, JavaScript ищет это свойство или метод в его прототипе. Если оно не найдено, поиск продолжается по цепочке прототипов, пока не будет найдено или не достигнут конец цепочки (который обычно является объектом `null`).

2. **Свойство `__proto__`**: Каждый объект в JavaScript имеет скрытое свойство `__proto__`, которое ссылается на прототип этого объекта.

3. **Прототипы функций (конструкторов)**: У функций в JavaScript также есть прототипы. Если функция используется как конструктор (с оператором `new`), создаваемый объект будет иметь прототип, связанный с этой функцией.

4. **Наследование и классы**: С появлением классов в ECMAScript 2015 (ES6) появилась более удобная абстракция для работы с прототипами. Однако, классы в JavaScript всё равно основаны на прототипах.

Пример цепочки прототипов:

```
// Создаём объекты
let animal = {
  eats: true
};

let rabbit = {
  jumps: true
};

// Устанавливаем прототипы
rabbit.__proto__ = animal;

// Теперь rabbit наследует свойства от animal
console.log(rabbit.eats); // true
console.log(rabbit.jumps); // true
```

В этом примере объект `rabbit` наследует свойство `eats` от объекта `animal`, потому что `rabbit.__proto__` ссылается на `animal`.

Цепочка прототипов позволяет создавать иерархии объектов, что упрощает повторное использование кода и организацию данных в JavaScript.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Какой алгоритм работы у obj instanceof Class ?
<!-- basicblock-start oid="Obsjmu2jDs5RfObrMJD79SHe"  deck='J_js_learn_js_classes' -->
Какой алгоритм работы у obj instanceof Class ?::


Алгоритм работы obj instanceof Class работает примерно так:

Если имеется статический метод `Symbol.hasInstance`, тогда вызвать его: `Class[Symbol.hasInstance](obj)`. Он должен вернуть либо `true`, либо `false`, и это конец. Это как раз и есть возможность ручной настройки `instanceof`.

```javascript
/ проверка instanceof будет полагать,
// что всё со свойством canEat - животное Animal
class Animal {
  static [Symbol.hasInstance](obj) {
    if (obj.canEat) return true;
  }
}

let obj = { canEat: true };
alert(obj instanceof Animal); // true: вызван Animal[Symbol.hasInstance](obj)
```

Большая часть классов не имеет метода `Symbol.hasInstance`. В этом случае используется стандартная логика: проверяется, равен ли `Class.prototype` одному из прототипов в прототипной цепочке `obj`.
Другими словами, сравнивается:

```javascript
obj.__proto__ === Class.prototype?
obj.__proto__.__proto__ === Class.prototype?
obj.__proto__.__proto__.__proto__ === Class.prototype?
...
// если какой-то из ответов true - возвратить true
// если дошли до конца цепочки - false
```

В примере выше `rabbit.__proto__ === Rabbit.prototype`, так что результат будет получен немедленно.

В случае с наследованием, совпадение будет на втором шаге:

```javascript
class Animal {}
class Rabbit extends Animal {}

let rabbit = new Rabbit();
alert(rabbit instanceof Animal); // true

// rabbit.__proto__ === Animal.prototype (нет совпадения)
// rabbit.__proto__.__proto__ === Animal.prototype (совпадение!)
```


<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Для чего используется оператор instanceof ?
<!-- basicblock-start oid="ObsAvrmPFOPd4ufBljC1n2Gf"  deck='J_js_learn_js_classes' -->
Для чего используется оператор instanceof ?::


instanceof просматривает для проверки цепочку прототипов. 
Но это поведение может быть изменено при помощи статического метода Symbol.hasInstance.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что выведет это?
<!-- basicblock-start oid="ObspxsTnBCog88LMnXDP5lZ3"  deck='J_js_learn_js_classes' -->
Что выведет это?::


```
let arr = [1, 2, 3];
console.log( arr instanceof Array ); // true
console.log( arr instanceof Object ); // true
```
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что такое полиморфная функция?
<!-- basicblock-start oid="Obs2Km8HUGC2hMi46iXzrv3Z"  deck='J_js_learn_js_classes' -->
Что такое полиморфная функция?::


Функция, которая интерпретирует аргументирует аргументы по-разному в зависимости от их типа
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что можно сказать про Отсутствие статического наследования встроенных классов?
<!-- basicblock-start oid="ObsnzTZwARXv5tBeweCO5pw8"  deck='J_js_learn_js_classes' -->
Что можно сказать про Отсутствие статического наследования встроенных классов?::


У встроенных объектов есть собственные статические методы, например Object.keys, Array.isArray и т. д.

Как мы уже знаем, встроенные классы расширяют друг друга.

Обычно, когда один класс наследует другой, то наследуются и статические методы. Это было подробно разъяснено в главе Статические свойства и методы.

Но встроенные классы – исключение. Они не наследуют статические методы друг друга.

Например, и Array, и Date наследуют от Object, так что в их экземплярах доступны методы из Object.prototype. Но Array.[[Prototype]] не ссылается на Object, поэтому нет методов Array.keys() или Date.keys().

Ниже вы видите структуру Date и Object:

Как видите, нет связи между Date и Object. Они независимы, только Date.prototype наследует от Object.prototype.

В этом важное отличие наследования встроенных объектов от того, что мы получаем с использованием extends.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что можно сказать про расширение встроенных классов?
<!-- basicblock-start oid="Obs4huxfdCNxnrOa6PLqaYF7"  deck='J_js_learn_js_classes' -->
Что можно сказать про расширение встроенных классов?::


От встроенных классов, таких как Array, Map и других, тоже можно наследовать.
Например, в этом примере PowerArray наследуется от встроенного Array:

```
// добавим один метод (можно более одного)
class PowerArray extends Array {
  isEmpty() {
    return this.length === 0;
  }
}

let arr = new PowerArray(1, 2, 5, 10, 50);
alert(arr.isEmpty()); // false

let filteredArr = arr.filter(item => item >= 10);
alert(filteredArr); // 10, 50
alert(filteredArr.isEmpty()); // false
```

Обратите внимание на интересный момент: встроенные методы, такие как filter, map и другие возвращают новые объекты унаследованного класса PowerArray. Их внутренняя реализация такова, что для этого они используют свойство объекта constructor.

В примере выше,

```
arr.constructor === PowerArray
```

Поэтому при вызове метода arr.filter() он внутри создаёт массив результатов, именно используя arr.constructor, а не обычный массив. Это замечательно, поскольку можно продолжать использовать методы PowerArray далее на результатах.

Более того, мы можем настроить это поведение.

При помощи специального статического геттера Symbol.species можно вернуть конструктор, который JavaScript будет использовать в filter, map и других методах для создания новых объектов.

Если бы мы хотели, чтобы методы map, filter и т. д. возвращали обычные массивы, мы могли бы вернуть Array в Symbol.species, вот так:


```
class PowerArray extends Array {
  isEmpty() {
    return this.length === 0;
  }

  // встроенные методы массива будут использовать этот метод как конструктор
  static get [Symbol.species]() {
    return Array;
  }
}

let arr = new PowerArray(1, 2, 5, 10, 50);
alert(arr.isEmpty()); // false

// filter создаст новый массив, используя arr.constructor[Symbol.species] как конструктор
let filteredArr = arr.filter(item => item >= 10);

// filteredArr не является PowerArray, это Array
alert(filteredArr.isEmpty()); // Error: filteredArr.isEmpty is not a function
```

Как вы видите, теперь .filter возвращает Array. Расширенная функциональность не будет передаваться далее.


Аналогично работают другие коллекции

Другие коллекции, такие как Map, Set, работают аналогично. Они также используют Symbol.species.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Чем отличается Rabbit.prototype.*proto* и Rabbit.*proto*?
<!-- basicblock-start oid="ObsJxukeyudqoFMfYu3wYsya"  deck='J_js_learn_js_classes' -->
Чем отличается Rabbit.prototype.*proto* и Rabbit.*proto*?::


В JavaScript `Rabbit.prototype.__proto__` и `Rabbit.__proto__` выполняют разные функции и относятся к разным частям цепочки прототипов. Вот их различия:

1. **`Rabbit.prototype.__proto__`**:
   - Это ссылка на прототип объекта `Rabbit.prototype`.
   - Поскольку `Rabbit.prototype` — это объект, созданный через `Function.prototype`, его `__proto__` указывает на `Object.prototype`.
   - Другими словами, `Rabbit.prototype.__proto__` — это прототип объекта-прототипа для экземпляров `Rabbit`, то есть `Object.prototype`.

   Поэтому следующая строка верна:
   ```
   alert( Rabbit.prototype.__proto__ === Object.prototype ); // true
   
```

2. **`Rabbit.__proto__`**:
   - Это ссылка на прототип функции-конструктора `Rabbit`.
   - Поскольку `Rabbit` является функцией, его `__proto__` указывает на `Function.prototype`, так как все функции в JavaScript наследуются от `Function.prototype`.

   Поэтому следующая строка ложна:
   ```
   alert( Rabbit.__proto__ === Object ); // false
   
```

   Вместо этого `Rabbit.__proto__` будет равно `Function.prototype`.

Что касается последнего:

- Строка `alert( Rabbit.getOwnPropertyNames({a: 1, b: 2}) );` вызовет ошибку, потому что у `Rabbit` нет метода `getOwnPropertyNames`. Этот метод является статическим методом объекта `Object`, поэтому его следует вызывать как `Object.getOwnPropertyNames({a: 1, b: 2})`.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# 1. Прототип экземпляров (через `prototype`) указывает на `Parent.prototype` — это позволяет экземплярам дочернего класса использовать методы и свойства родителя.
<!-- basicblock-start oid="ObsCZhiDMAnEFARfn7G00hns"  deck='J_js_learn_js_classes' -->
1. Прототип экземпляров (через `prototype`) указывает на `Parent.prototype` — это позволяет экземплярам дочернего класса использовать методы и свойства родителя.::

2. Прототип самого конструктора (`__proto__`) дочернего класса указывает на родительский конструктор — это обеспечивает наследование статических методов и свойств.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Какие два прототипа устанавливает extends?
<!-- basicblock-start oid="Obs27Hqp6R5ke8FnDZswYisw"  deck='J_js_learn_js_classes' -->
Какие два прототипа устанавливает extends?::


Когда класс наследуется с помощью ключевого слова `extends` в JavaScript, устанавливаются два прототипа:

1. **Прототип экземпляров класса** (`[[Prototype]]` или `__proto__`):
   - При наследовании экземпляры дочернего класса (например, `new Child()`) получают прототип, указывающий на экземпляры родительского класса.
   - Это означает, что методы и свойства, определённые в родительском классе, становятся доступными для экземпляров дочернего класса.
   - Например:
     ```
     class Parent {
       parentMethod() {
         console.log('parent method');
       }
     }

     class Child extends Parent {}

     const child = new Child();
     child.parentMethod(); // 'parent method'
     
```

   Здесь `child.__proto__` указывает на `Parent.prototype`, что позволяет экземпляру `Child` вызывать методы родительского класса.

2. **Прототип конструктора дочернего класса**:
   - При наследовании также устанавливается связь между конструктором дочернего класса и конструктором родительского класса.
   - Конструктор дочернего класса (например, `Child`) наследует статические методы и свойства родительского конструктора (например, `Parent`).
   - Это означает, что `Child.__proto__` указывает на `Parent`.
   - Например:
     ```
     class Parent {
       static staticMethod() {
         console.log('static method');
       }
     }

     class Child extends Parent {}

     Child.staticMethod(); // 'static method'
     
```

   Здесь `Child.__proto__` указывает на `Parent`, что позволяет дочернему классу вызывать статические методы родительского.

Таким образом, `extends` устанавливает два прототипа:
1. Прототип экземпляра дочернего класса указывает на `Parent.prototype`.
2. Прототип конструктора дочернего класса указывает на сам конструктор родительского класса.

Как мы знаем, синтаксис «extends» устанавливает 2 прототипа:

    Между "prototype" функций-конструкторов (для методов)
    Между самими функциями-конструкторами (для статических методов).

Да, совершенно верно! Когда используется синтаксис `extends` в JavaScript, устанавливаются две важные цепочки прототипов:

1. **Прототип между "prototype" функций-конструкторов**:
   - Каждый класс в JavaScript имеет объект `prototype`, который хранит все методы и свойства экземпляров этого класса.
   - Когда класс наследуется с помощью `extends`, цепочка прототипов для экземпляров устанавливается так, что прототип дочернего класса ссылается на прототип родительского класса.
   - Это означает, что методы, объявленные в `Parent.prototype`, становятся доступными для экземпляров дочернего класса.
   - Например:
     ```
     class Parent {
       method() {
         console.log('Parent method');
       }
     }

     class Child extends Parent {}

     const child = new Child();
     child.method(); // 'Parent method'
     
```
     Здесь `child.__proto__ === Child.prototype`, а `Child.prototype.__proto__ === Parent.prototype`. Это позволяет экземплярам класса `Child` использовать методы, объявленные в `Parent`.

2. **Прототип между самими функциями-конструкторами (для статических методов)**:
   - Классы в JavaScript — это функции-конструкторы, и они сами также могут иметь свои прототипы.
   - При использовании `extends`, конструктор дочернего класса (например, `Child`) наследует статические методы и свойства от конструктора родительского класса (например, `Parent`).
   - Это создаёт связь между самими функциями-конструкторами: `Child.__proto__ === Parent`, что означает, что `Child` может вызывать статические методы родителя.
   - Например:
     ```
     class Parent {
       static staticMethod() {
         console.log('Parent static method');
       }
     }

     class Child extends Parent {}

     Child.staticMethod(); // 'Parent static method'
     
```
     Здесь `Child.__proto__ === Parent`, что позволяет дочернему классу использовать статические методы родителя.

Таким образом, когда используется `extends`:
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что в целом можно сказать про статические методы в js?
<!-- basicblock-start oid="ObsmFsOLmHTGXUwHXdkWNSRO"  deck='J_js_learn_js_classes' -->
Что в целом можно сказать про статические методы в js?::


Статические методы используются для функциональности, принадлежат классу «в целом», а не относятся к конкретному объекту класса.

Например, метод для сравнения двух статей Article.compare(article1, article2) или фабричный метод Article.createTodays().

В объявлении класса они помечаются ключевым словом static.

Статические свойства используются в тех случаях, когда мы хотели бы сохранить данные на уровне класса, а не какого-то одного объекта.

Синтаксис:

```
class MyClass {
  static property = ...;

  static method() {
    ...
  }
}
```
Технически, статическое объявление – это то же самое, что и присвоение классу:
```
MyClass.property = ...
MyClass.method = ...
```

Статические свойства и методы наследуются.

Для class B extends A прототип класса B указывает на A: B.[[Prototype]] = A. Таким образом, если поле не найдено в B, поиск продолжается в A.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Наследуются ли статические свойства и методы?
<!-- basicblock-start oid="ObsviiOl2i22aPlC8DByGozd"  deck='J_js_learn_js_classes' -->
Наследуются ли статические свойства и методы?::


Да
```
class Animal {

  constructor(name, speed) {
    this.speed = speed;
    this.name = name;
  }

  run(speed = 0) {
    this.speed += speed;
    alert(`${this.name} бежит со скоростью ${this.speed}.`);
  }

  static compare(animalA, animalB) {
    return animalA.speed - animalB.speed;
  }

}

// Наследует от Animal
class Rabbit extends Animal {
  hide() {
    alert(`${this.name} прячется!`);
  }
}

let rabbits = [
  new Rabbit("Белый кролик", 10),
  new Rabbit("Чёрный кролик", 5)
];

rabbits.sort(Rabbit.compare);

rabbits[0].run(); // Чёрный кролик бежит со скоростью 5.
```
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что можно сказать про пример использования статического класса (фабричный метод)?
<!-- basicblock-start oid="Obsh0VXsBkdnnRS5Xiy6aN7D"  deck='J_js_learn_js_classes' -->
Что можно сказать про пример использования статического класса (фабричный метод)?::


```
class Article {
  constructor(title, date) {
    this.title = title;
    this.date = date;
  }

  static createTodays() {
    // помним, что this = Article
    return new this("Сегодняшний дайджест", new Date());
  }
}

let article = Article.createTodays();

alert( article.title ); // Сегодняшний дайджест
```
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что можно сказать про статические свойства и методы в js?
<!-- basicblock-start oid="ObsHzltwYItRdg1JqOlOBbAU"  deck='J_js_learn_js_classes' -->
Что можно сказать про статические свойства и методы в js?::


Мы также можем присвоить метод самому классу. Такие методы называются статическими.

В объявление класса они добавляются с помощью ключевого слова static, например:
```
class User {
  static staticMethod() {
    alert(this === User);
  }
}

User.staticMethod(); // true
```

Это фактически то же самое, что присвоить метод напрямую как свойство функции:

```
class User { }

User.staticMethod = function() {
  alert(this === User);
};
```
Значением this при вызове User.staticMethod() является сам конструктор класса User (правило «объект до точки»).

Обычно статические методы используются для реализации функций, которые будут принадлежать классу в целом, но не какому-либо его конкретному объекту.

Звучит не очень понятно? Сейчас все встанет на свои места.

Например, есть объекты статей Article, и нужна функция для их сравнения.

Естественное решение – сделать для этого статический метод Article.compare:
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# а
<!-- basicblock-start oid="ObsEz1oN6KXx1O3wmLni5E7F"  deck='J_js_learn_js_classes' -->
Назови все способы добавить функцию в этот объект

```JS
let obj = {
name: "Мое имя",
lgName: function() {
console.log(this.name);
	}
};

obj.lgName(); // 'Мое имя'
```
::


В JavaScript есть несколько способов добавить функцию в объект. Давайте рассмотрим все возможные варианты и разберём их отличия.

### 1. **Определение метода непосредственно в объекте (как в вашем примере)**

```javascript
let obj = {
  name: "Мое имя",
  lgName: function() {
    console.log(this.name);
  }
};

obj.lgName(); // 'Мое имя'
```

**Отличие**: Функция добавляется при создании объекта. Это наиболее стандартный способ добавления метода в объект.

---

### 2. **Использование короткого синтаксиса методов объекта (ES6)**

```javascript
let obj = {
  name: "Мое имя",
  lgName() {
    console.log(this.name);
  }
};

obj.lgName(); // 'Мое имя'
```

**Отличие**: Это более лаконичный синтаксис, представленный в ES6, который делает определение метода короче. Внутренне это создаёт аналогичную функцию, но без явного использования `function`.

---

### 3. **Добавление метода после создания объекта (с помощью присвоения)**

```javascript
let obj = {
  name: "Мое имя"
};

obj.lgName = function() {
  console.log(this.name);
};

obj.lgName(); // 'Мое имя'
```

**Отличие**: Метод добавляется после создания объекта. Это полезно, если объект уже определён, а метод нужно добавить или изменить динамически. Также это позволяет добавлять методы к объектам, импортированным из другого места.

---

### 4. **Использование `Object.defineProperty`**

```javascript
let obj = {
  name: "Мое имя"
};

Object.defineProperty(obj, 'lgName', {
  value: function() {
    console.log(this.name);
  },
  writable: true,   // Позволяет изменять функцию
  enumerable: true, // Метод будет перечисляться в циклах
  configurable: true // Можно удалить или изменить метод
});

obj.lgName(); // 'Мое имя'
```

**Отличие**: `Object.defineProperty` даёт больше контроля над свойством: можно указать, будет ли оно изменяемым, перечисляемым или конфигурируемым. Это полезно для управления доступом к методу или его поведением в циклах.

---

### 5. **Использование `Object.assign`**

```javascript
let obj = {
  name: "Мое имя"
};

Object.assign(obj, {
  lgName: function() {
    console.log(this.name);
  }
});

obj.lgName(); // 'Мое имя'
```

**Отличие**: `Object.assign` копирует свойства и методы из одного или нескольких объектов в целевой объект. Это полезно для копирования или добавления методов и свойств из других объектов.

---

### 6. **Использование `Object.setPrototypeOf`**

```javascript
let obj = {
  name: "Мое имя"
};

let methods = {
  lgName() {
    console.log(this.name);
  }
};

Object.setPrototypeOf(obj, methods);

obj.lgName(); // 'Мое имя'
```

**Отличие**: Этот способ изменяет прототип объекта, добавляя методы в прототип, а не в сам объект. Это влияет на все объекты, созданные с этим прототипом, но не добавляет метод в сам объект напрямую.

---

### 7. **Использование `prototype` для создания методов в конструкторе объекта**

Если объект создаётся с помощью конструктора:

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.lgName = function() {
  console.log(this.name);
};

let obj = new Person("Мое имя");
obj.lgName(); // 'Мое имя'
```

**Отличие**: Метод добавляется в прототип конструктора, что означает, что все экземпляры этого конструктора будут иметь доступ к этому методу через свой прототип. Это полезно для уменьшения дублирования памяти при создании множества экземпляров.

---

### 8. **Использование геттера (для вызова функции без скобок)**

```javascript
let obj = {
  name: "Мое имя",
  
  get lgName() {
    console.log(this.name);
  }
};

obj.lgName; // 'Мое имя'
```

**Отличие**: Геттер позволяет обращаться к методу как к свойству, без необходимости вызывать его с помощью скобок.

---

### 9. **Добавление с помощью `bind` (если нужна привязка контекста)**

```javascript
let obj = {
  name: "Мое имя"
};

function showName() {
  console.log(this.name);
}

obj.lgName = showName.bind(obj);

obj.lgName(); // 'Мое имя'
```

**Отличие**: Метод создаётся с помощью `bind`, что привязывает контекст `this` к конкретному объекту. Это полезно, если функция должна использовать определённый контекст, независимо от того, как она вызывается.

---

### Итог:

- **Встроенные методы** (варианты 1 и 2) удобны и понятны для прямого создания объектов.
- **Присвоение после создания объекта** (вариант 3) удобно для динамических изменений.
- **`Object.defineProperty`** и **`Object.assign`** (варианты 4 и 5) дают больше контроля над свойствами и удобны для более сложных случаев.
- **Изменение прототипа** (вариант 6) полезно для влияния на все объекты, созданные с одним прототипом.
- **Прототипы** (вариант 7) используются в объектно-ориентированном стиле для общего использования методов между экземплярами.
- **Геттеры** (вариант 8) позволяют вызывать метод без скобок.
- **`bind`** (вариант 9) полезен, когда нужно явно привязать контекст `this`.

Каждый способ имеет своё предназначение и используется в зависимости от задачи.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Как определить функцию чтобы ее можно было вызвать без скобок?
<!-- basicblock-start oid="Obsgc02zCFXmYJK6ENsXyfJM"  deck='J_js_learn_js_classes' -->
Как определить функцию чтобы ее можно было вызвать без скобок?::


В JavaScript функцию **без скобок** можно вызвать при помощи **геттеров** объекта или класса. Это позволяет вызывать функцию как свойство объекта, не используя скобки.

### Пример с использованием геттера:

```
let obj = {
  name: "Мое имя",
  
  get lgName() {  // Используем get
    console.log(this.name);
  }
};

obj.lgName;  // Вызов геттера без скобок, выводит "Мое имя"
```

### Как это работает:
- Геттер (`get`) — это специальное свойство объекта, которое позволяет вызывать функцию при обращении к нему как к свойству.
- Когда вы обращаетесь к свойству `lgName` без скобок, автоматически вызывается функция, определённая в геттере.

### Пример с классом:

```
class Person {
  constructor(name) {
    this.name = name;
  }

  get lgName() {
    console.log(this.name);
  }
}

const user = new Person("Alice");
user.lgName;  // Выводит "Alice" без скобок
```

### Примечание:
Использование геттеров — это особенность синтаксиса JavaScript, которая делает код более удобным для чтения. Однако стоит использовать их с осторожностью, так как может быть сложнее отследить, что свойство вызывает функцию, а не просто возвращает значение.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Чем статический метод объекта в js отличается от нестатического?
<!-- basicblock-start oid="ObsX8TGoZ8Oxue1sIpByXin8"  deck='J_js_learn_js_classes' -->
Чем статический метод объекта в js отличается от нестатического?::


В JavaScript **статические** и **нестатические** методы класса отличаются следующими ключевыми аспектами:

### 1. **Доступ к методам**

- **Статический метод** доступен только через сам класс, а не через его экземпляры.
  
  ```
  class MyClass {
    static staticMethod() {
      return 'This is a static method';
    }
  }

  console.log(MyClass.staticMethod()); // 'This is a static method'
  
  const obj = new MyClass();
  // obj.staticMethod(); // Error: obj.staticMethod is not a function
  
```

- **Нестатический метод** доступен только через экземпляры класса.

  ```
  class MyClass {
    instanceMethod() {
      return 'This is an instance method';
    }
  }

  const obj = new MyClass();
  console.log(obj.instanceMethod()); // 'This is an instance method'
  
```

### 2. **Контекст (`this`)**

- **Статический метод** не имеет доступа к свойствам и методам экземпляра класса через `this`, так как он вызывается напрямую на классе.

  ```
  class MyClass {
    constructor(name) {
      this.name = name;
    }

    static staticMethod() {
      return this; // `this` будет ссылаться на сам класс
    }
  }

  console.log(MyClass.staticMethod()); // Вернёт сам класс MyClass
  
```

- **Нестатический метод** вызывается через экземпляр, и его `this` ссылается на конкретный объект.

  ```
  class MyClass {
    constructor(name) {
      this.name = name;
    }

    instanceMethod() {
      return this.name; // `this` будет ссылаться на экземпляр
    }
  }

  const obj = new MyClass('Alice');
  console.log(obj.instanceMethod()); // 'Alice'
  
```

### 3. **Наследование**

- **Статические методы** могут наследоваться, и при их вызове в дочерних классах контекст (`this`) будет ссылаться на дочерний класс.

  ```
  class Parent {
    static staticMethod() {
      return 'Parent static method';
    }
  }

  class Child extends Parent {}

  console.log(Child.staticMethod()); // 'Parent static method'
  
```

- **Нестатические методы** также могут наследоваться и вызываться на экземплярах дочернего класса.

  ```
  class Parent {
    instanceMethod() {
      return 'Parent instance method';
    }
  }

  class Child extends Parent {}

  const child = new Child();
  console.log(child.instanceMethod()); // 'Parent instance method'
  
```

### 4. **Назначение**

- **Статические методы** обычно используются для функциональности, которая относится ко всему классу или служит утилитарной функцией, не зависящей от состояния экземпляра.
  
  Пример: статические методы для создания экземпляров класса или утилиты вроде математических операций.

  ```
  class MathUtils {
    static add(a, b) {
      return a + b;
    }
  }

  console.log(MathUtils.add(2, 3)); // 5
  
```

- **Нестатические методы** используются для работы с данными, которые специфичны для конкретного экземпляра класса, и оперируют его состоянием.

  ```
  class User {
    constructor(name) {
      this.name = name;
    }

    sayHello() {
      return `Hello, ${this.name}!`;
    }
  }

  const user = new User('Alice');
  console.log(user.sayHello()); // 'Hello, Alice!'
  
```

### Итог

- **Статические методы** привязаны к самому классу и не могут обращаться к данным конкретного экземпляра.
- **Нестатические методы** работают с данными конкретного экземпляра класса и требуют создания объекта для вызова.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Какие альтернативы статическим js функциям есть?
<!-- basicblock-start oid="ObsV6ud7U4pQxu9pJBCarMCW"  deck='J_js_learn_js_classes' -->
Какие альтернативы статическим js функциям есть?::


Альтернативами статическим функциям в JavaScript могут быть следующие подходы:

### 1. **Методы объектов и классов**
Вместо использования статических функций можно определить методы внутри объектов или классов. Это позволяет инкапсулировать функциональность и поддерживать контекст выполнения.

```
class Calculator {
  add(a, b) {
    return a + b;
  }
}

const calc = new Calculator();
console.log(calc.add(5, 3)); // 8
```

### 2. **Модули (ES6)**
С помощью модулей можно экспортировать функции и переменные, что позволяет избегать глобального состояния и организовать код более структурированно.

```
// math.js
export function add(a, b) {
  return a + b;
}

// main.js
import { add } from './math.js';
console.log(add(5, 3)); // 8
```

### 3. **Функции высшего порядка**
Функции высшего порядка принимают другие функции в качестве аргументов или возвращают их. Это гибкий способ динамически определять поведение программы.

```
function withLogging(func) {
  return function(...args) {
    console.log('Arguments:', args);
    return func(...args);
  };
}

const add = (a, b) => a + b;
const loggedAdd = withLogging(add);

console.log(loggedAdd(5, 3)); // Arguments: [5, 3], 8
```

### 4. **Замыкания (Closures)**
Замыкания позволяют создавать функции с сохранённым состоянием, избегая глобальных переменных.

```
function counter() {
  let count = 0;
  return function() {
    count += 1;
    return count;
  };
}

const myCounter = counter();
console.log(myCounter()); // 1
console.log(myCounter()); // 2
```

### 5. **Фабричные функции (Factory Functions)**
Это функции, которые возвращают объекты, позволяя создавать экземпляры с различными состояниями и методами.

```
function createUser(name) {
  return {
    name,
    greet() {
      console.log(`Hello, ${name}!`);
    }
  };
}

const user = createUser('Alice');
user.greet(); // Hello, Alice!
```

### 6. **Функции-генераторы**
Генераторы позволяют контролировать выполнение функций и возвращать значения на каждом шаге через `yield`.

```
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const gen = idGenerator();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
```

Каждый из этих подходов помогает структурировать код, улучшить читаемость и избежать излишнего использования глобальных статических функций.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что в общем можно сказать про наследование классов в js?
<!-- basicblock-start oid="ObsO0nA5FZG3t0s5DXDCmdPr"  deck='J_js_learn_js_classes' -->
Что в общем можно сказать про наследование классов в js?::



    Чтобы унаследовать от класса: class Child extends Parent:
        При этом Child.prototype.*proto* будет равен Parent.prototype, так что методы будут унаследованы.
    При переопределении конструктора:
        Обязателен вызов конструктора родителя super() в конструкторе Child до обращения к this.
    При переопределении другого метода:
        Мы можем вызвать super.method() в методе Child для обращения к методу родителя Parent.
    Внутренние детали:
        Методы запоминают свой объект во внутреннем свойстве [[HomeObject]]. Благодаря этому работает super, он в его прототипе ищет родительские методы.
        Поэтому копировать метод, использующий super, между разными объектами небезопасно.

Также:

    У стрелочных функций нет своего this и super, поэтому они «прозрачно» встраиваются во внешний контекст.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Чем методы объекта отличаются от свойств-функции объекта?
<!-- basicblock-start oid="Obs4JkoXMbJpYb1f0wTEPC4R"  deck='J_js_learn_js_classes' -->
Чем методы объекта отличаются от свойств-функции объекта?::


Свойство [[HomeObject]] определено для методов как классов, так и обычных объектов. Но для объектов методы должны быть объявлены именно как method(), а не "method: function()".

Для нас различий нет, но они есть для JavaScript.

В приведённом ниже примере используется синтаксис не метода, свойства-функции. Поэтому у него нет [[HomeObject]], и наследование не работает:

```
let animal = {
  eat: function() { // намеренно пишем так, а не eat() { ...
    // ...
  }
};

let rabbit = {
  __proto__: animal,
  eat: function() {
    super.eat();
  }
};

rabbit.eat();  // Ошибка вызова super (потому что нет [[HomeObject]])
```
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что можно сказать про [[HomeObject]] в JS?
<!-- basicblock-start oid="ObsMmlj8Xbpk9wpvwr2tWTK8"  deck='J_js_learn_js_classes' -->
Что можно сказать про [[HomeObject]] в JS?::


Для решения этой проблемы в JavaScript было добавлено специальное внутреннее свойство для функций: [[HomeObject]].

Когда функция объявлена как метод внутри класса или объекта, её свойство [[HomeObject]] становится равно этому объекту.

Затем super использует его, чтобы получить прототип родителя и его методы.

Давайте посмотрим, как это работает – опять же, используя простые объекты:

```
let animal = {
  name: "Животное",
  eat() {         // animal.eat.[[HomeObject]] == animal
    alert(`${this.name} ест.`);
  }
};

let rabbit = {
  __proto__: animal,
  name: "Кролик",
  eat() {         // rabbit.eat.[[HomeObject]] == rabbit
    super.eat();
  }
};

let longEar = {
  __proto__: rabbit,
  name: "Длинноух",
  eat() {         // longEar.eat.[[HomeObject]] == longEar
    super.eat();
  }
};

// работает верно
longEar.eat();  // Длинноух ест.
```

Это работает как задумано благодаря [[HomeObject]]. Метод, такой как longEar.eat, знает свой [[HomeObject]] и получает метод родителя из его прототипа. Вообще без использования this.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Какое есть тонкое замечание про переопределение полей класса?
<!-- basicblock-start oid="ObsYG5w7COG7ilaywkCBysJM"  deck='J_js_learn_js_classes' -->
Какое есть тонкое замечание про переопределение полей класса?::



Продвинутое замечание

В этом подразделе предполагается, что у вас уже есть определённый опыт работы с классами, возможно, в других языках программирования.

Это даёт лучшее представление о языке, а также объясняет поведение, которое может быть источником ошибок (но не очень часто).

Если вы считаете этот материал слишком трудным для понимания, просто продолжайте читать дальше, а затем вернитесь к нему через некоторое время.

Мы можем переопределять не только методы, но и поля класса.

Однако, когда мы получаем доступ к переопределенному полю в родительском конструкторе, это поведение отличается от большинства других языков программирования.

Рассмотрим этот пример:
```
class Animal {
  name = 'animal';

  constructor() {
    alert(this.name); // (*)
  }
}

class Rabbit extends Animal {
  name = 'rabbit';
}

new Animal(); // animal
new Rabbit(); // animal
```

Здесь, класс Rabbit расширяет Animal и переопределяет поле name своим собственным значением.

В Rabbit нет собственного конструктора, поэтому вызывается конструктор Animal.

Что интересно, в обоих случаях: new Animal() и new Rabbit(), alert в строке (*) показывает animal.

Другими словами, родительский конструктор всегда использует своё собственное значение поля, а не переопределённое.

Что же в этом странного?

Если это ещё не ясно, сравните с методами.

Вот тот же код, но вместо поля this.name, мы вызываем метод this.showName():

```
class Animal {
  showName() {  // вместо this.name = 'animal'
    alert('animal');
  }

  constructor() {
    this.showName(); // вместо alert(this.name);
  }
}

class Rabbit extends Animal {
  showName() {
    alert('rabbit');
  }
}

new Animal(); // animal
new Rabbit(); // rabbit
```
Обратите внимание: теперь результат другой.

И это то, чего мы, естественно, ожидаем. Когда родительский конструктор вызывается в производном классе, он использует переопределённый метод.

…Но для полей класса это не так. Как уже было сказано, родительский конструктор всегда использует родительское поле.

Почему же наблюдается разница?

Что ж, причина заключается в порядке инициализации полей. Поле класса инициализируется:

    Перед конструктором для базового класса (который ничего не расширяет),
    Сразу после super() для производного класса.

В нашем случае Rabbit – это производный класс. В нем нет конструктора constructor(). Как было сказано ранее, это то же самое, как если бы был пустой конструктор, содержащий только super(...args).

Итак, new Rabbit() вызывает super(), таким образом, выполняя родительский конструктор, и (согласно правилу для производных классов) только после этого инициализируются поля его класса. На момент выполнения родительского конструктора ещё нет полей класса Rabbit, поэтому используются поля Animal.

Это тонкое различие между полями и методами характерно для JavaScript.

К счастью, такое поведение проявляется только в том случае, когда переопределенное поле используется в родительском конструкторе. Тогда может быть трудно понять, что происходит, поэтому мы объясняем это здесь.

Если это становится проблемой, её можно решить, используя методы или геттеры/сеттеры вместо полей.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что Конструкторы в наследуемых классах должны обязательно вызывать ?
<!-- basicblock-start oid="ObsRg8ZFXygfgk4I1KnoVX6A"  deck='J_js_learn_js_classes' -->
Что Конструкторы в наследуемых классах должны обязательно вызывать ?::



    Конструкторы в наследуемых классах должны обязательно вызывать super(...), и (!) делать это перед использованием this.

…Но почему? Что происходит? Это требование кажется довольно странным.

Конечно, всему есть своё объяснение. Давайте углубимся в детали, чтобы вы действительно поняли, что происходит.

В JavaScript существует различие между «функцией-конструктором наследующего класса» и всеми остальными. В наследующем классе соответствующая функция-конструктор помечена специальным внутренним свойством [[ConstructorKind]]:"derived".

Разница в следующем:

    Когда выполняется обычный конструктор, он создаёт пустой объект и присваивает его this .
    Когда запускается конструктор унаследованного класса, он этого не делает. Вместо этого он ждёт, что это сделает конструктор родительского класса.

Поэтому, если мы создаём собственный конструктор, мы должны вызвать super, в противном случае объект для this не будет создан, и мы получим ошибку.

Чтобы конструктор Rabbit работал, он должен вызвать super() до того, как использовать this, чтобы не было ошибки:


```javascript
class Animal {

  constructor(name) {
    this.speed = 0;
    this.name = name;
  }

  // ...
}

class Rabbit extends Animal {

  constructor(name, earLength) {
    super(name);
    this.earLength = earLength;
  }

  // ...
}

// теперь работает
let rabbit = new Rabbit("Белый кролик", 10);
alert(rabbit.name); // Белый кролик
alert(rabbit.earLength); // 10
```



<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что происходит если класс наследуется от другого класса и при этом не определяет конструктор?
<!-- basicblock-start oid="ObsVZ4IqSBMHysk4jlSi05y7"  deck='J_js_learn_js_classes' -->
Что происходит если класс наследуется от другого класса и при этом не определяет конструктор?::


Согласно спецификации, если класс расширяет другой класс и не имеет конструктора, то автоматически создаётся такой «пустой» конструктор:
```
class Rabbit extends Animal {
  // генерируется для классов-потомков, у которых нет своего конструктора
  constructor(...args) {
    super(...args);
  }
}
```
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# У стрелочных функций нет 
<!-- basicblock-start oid="ObsCcFWTFezLpaElATz8YhGX"  deck='J_js_learn_js_classes' -->
У стрелочных функций нет ::


У стрелочных функций нет super
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что значит, что После extends разрешены любые выражения?
<!-- basicblock-start oid="ObsKXcotw1rQdulUO4nXgqXm"  deck='J_js_learn_js_classes' -->
Что значит, что После extends разрешены любые выражения?::


Синтаксис создания класса допускает указывать после extends не только класс, но и любое выражение.

Пример вызова функции,  которая генерирует родительский класс:

```
function f(phrase) {
  return class {
    sayHi() { alert(phrase); }
  };
}

class User extends f("Привет") {}

new User().sayHi(); // Привет
```

Здесь class User наследует от результата вызова f("Привет").

Это может быть полезно для продвинутых приёмов проектирования, где мы можем использовать функции для генерации классов в зависимости от многих условий и затем наследовать их.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Как работает ключевое слово extends?
<!-- basicblock-start oid="ObsHzmc9PYSgjNa3vasbaQkp"  deck='J_js_learn_js_classes' -->
Как работает ключевое слово extends?::


Внутри ключевое слово extends работает по старой доброй механике прототипов. Оно устанавливает Rabbit.prototype.[[Prototype]] в Animal.prototype. Таким образом, если метода не оказалось в Rabbit.prototype, JavaScript берет его из Animal.prototype.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Расскажи про Вычисляемые свойства
<!-- basicblock-start oid="Obs4xyRLXKPG0icEBxM07pwQ"  deck='J_js_learn_js_classes' -->
Расскажи про Вычисляемые свойства::

 
Вычисляемые свойства объекта в JavaScript позволяют использовать выражения в качестве имен свойств объекта. Это полезно, когда вы хотите динамически задать имя свойства объекта во время создания объекта или обновления его значений.

### Синтаксис

Вычисляемое свойство указывается в квадратных скобках `[ ]` внутри литерала объекта:

```
let propertyName = 'name';
let user = {
    [propertyName]: 'John'
};

console.log(user.name); // 'John'
```

### Как это работает

- Внутри квадратных скобок `[propertyName]` можно поместить любое выражение, которое будет вычислено и использовано как имя свойства.
- В примере выше значение переменной `propertyName` равно `'name'`, поэтому при создании объекта у него будет свойство `name` со значением `'John'`.

### Примеры

1. **Использование переменной как имени свойства:**

    ```
    let key = 'favoriteColor';
    let user = {
        name: 'Alice',
        [key]: 'blue'
    };

    console.log(user.favoriteColor); // 'blue'
    
```

2. **Вычисляемые свойства в цикле:**

    ```
    let fruits = ['apple', 'orange', 'banana'];
    let fruitObject = {};

    fruits.forEach((fruit, index) => {
        fruitObject[`fruit_${index + 1}`] = fruit;
    });

    console.log(fruitObject);
    // { fruit_1: 'apple', fruit_2: 'orange', fruit_3: 'banana' }
    
```

3. **Вычисляемые свойства и методы объекта:**

    Вычисляемые свойства могут использоваться не только для значений, но и для методов объекта:

    ```
    let methodName = 'sayHello';

    let person = {
        [methodName]() {
            return 'Hello!';
        }
    };

    console.log(person.sayHello()); // 'Hello!'
    
```

### Использование вычисляемых свойств

1. **Динамическое создание объектов:** Вычисляемые свойства полезны, когда вы хотите динамически создавать свойства объекта на основе переменных или выражений.
  
2. **Обработка данных:** Они удобны, когда необходимо создавать свойства объектов на основе данных из массивов или других источников.

3. **Простое написание кода:** Вычисляемые свойства делают код более компактным и читаемым в случаях, когда требуется создавать или обновлять объекты с динамическими свойствами.

### Ограничения

- Вычисляемые свойства доступны только в контексте создания или изменения объекта. Они не могут быть использованы для обращения к свойствам объекта напрямую (например, `object[propertyName]` — это не вычисляемое свойство, а стандартный способ доступа к свойству объекта).

### Заключение

Вычисляемые свойства объекта добавляют гибкость и динамичность в работу с объектами в JavaScript. Это мощный инструмент для создания объектов с динамическими именами свойств, что особенно полезно в сложных сценариях и при работе с данными.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Как выглядит пример класса с вычисляемым свойством?
<!-- basicblock-start oid="ObsLcydMydtwxn79rhjJC1F2"  deck='J_js_learn_js_classes' -->
Как выглядит пример класса с вычисляемым свойством?::


```
class User {

  ['say' + 'Hi']() {
    alert("Привет");
  }

}

new User().sayHi();
```
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что можно сказать про Class Expression?
<!-- basicblock-start oid="ObsjTiXR7kSLUiTqUvYIZewd"  deck='J_js_learn_js_classes' -->
Что можно сказать про Class Expression?::


Как и функции, классы можно определять внутри другого выражения, передавать, возвращать, присваивать и т.д.

Пример Class Expression (по аналогии с Function Expression):

```
let User = class {
  sayHi() {
    alert("Привет");
  }
};
```

Аналогично Named Function Expression, Class Expression может иметь имя.
Если у Class Expression есть имя, то оно видно только внутри класса:

```
// "Named Class Expression"
// (в спецификации нет такого термина, но происходящее похоже на Named Function Expression)
let User = class MyClass {
  sayHi() {
    alert(MyClass); // имя MyClass видно только внутри класса
  }
};

new User().sayHi(); // работает, выводит определение MyClass

console.log(MyClass); // ошибка, имя MyClass не видно за пределами класса
```

Мы даже можем динамически создавать классы «по запросу»:
```
function makeClass(phrase) {
  // объявляем класс и возвращаем его
  return class {
    sayHi() {
      alert(phrase);
    };
  };
}

// Создаём новый класс
let User = makeClass("Привет");

new User().sayHi(); // Привет
```
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Почему не нужно считать, что класс это просто синтаксический сахар в JS?
<!-- basicblock-start oid="Obsf45TWuZ0GkjSAE3B8Ovct"  deck='J_js_learn_js_classes' -->
Почему не нужно считать, что класс это просто синтаксический сахар в JS?::


И хотя 
```
// перепишем класс User на чистых функциях

// 1. Создаём функцию constructor
function User(name) {
  this.name = name;
}
// каждый прототип функции имеет свойство constructor по умолчанию,
// поэтому нам нет необходимости его создавать

// 2. Добавляем метод в прототип
User.prototype.sayHi = function() {
  alert(this.name);
};

// Использование:
let user = new User("Иван");
user.sayHi();
```

Результат этого кода очень похож. Поэтому, действительно, есть причины, по которым class можно считать синтаксическим сахаром для определения конструктора вместе с методами прототипа.

НОО
1) Функция созданная с помощью class, помечена специальным внутренним свойством [[IsClassConstructor]]: true,
В отличие от обычных функций, конструктор класса не может быть вызван без new

Кроме того, строковое представление конструктора класса в большинстве движков JavaScript начинается с class 

2) Методы класса являются неперечислимыми. Определение класса устанавливает флаг enumerable в false для всех методов в prototype

3) Классы всегда используют use strict. Десь код внутри класса автоматически находится в строгом режиме
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# При вызове метода объекта new User он будет взят из прототипа
<!-- basicblock-start oid="ObsV318u8qLUb7GKElDC0dui"  deck='J_js_learn_js_classes' -->
При вызове метода объекта new User он будет взят из прототипа::


как описано в главе [F.prototype](https://learn.javascript.ru/function-prototype). Таким образом, объекты new User имеют доступ к методам класса.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Вот что на самом деле делает конструкция class User {...}:
<!-- basicblock-start oid="ObsdVdONWK3pOkWUbRFEKaJh"  deck='J_js_learn_js_classes' -->
Вот что на самом деле делает конструкция class User {...}:::



    Создаёт функцию с именем User, которая становится результатом объявления класса. Код функции берётся из метода constructor (она будет пустой, если такого метода нет).
    Сохраняет все методы, такие как sayHi, в User.prototype.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# В JavaScript класс – это
<!-- basicblock-start oid="ObsHSeRddykE8kwlJ7GCXB1f"  deck='J_js_learn_js_classes' -->
В JavaScript класс – это::


В JavaScript класс – это разновидность функции.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Методы в классе не разделяются запятой
<!-- basicblock-start oid="ObspUX9RGLGxDusjnJybRAn9"  deck='J_js_learn_js_classes' -->
Методы в классе не разделяются запятой::


Частая ошибка начинающих разработчиков – ставить запятую между методами класса, что приводит к синтаксической ошибке.

Синтаксис классов отличается от литералов объектов, не путайте их. Внутри классов запятые не требуются.
<!-- basicblock-end -->




#J_js_learn_js_classes
#js_learn_js_classes

#telegram 

# Что такое класс?
<!-- basicblock-start oid="ObsTuchOaI4N7qzmLV4JyiKy"  deck='J_js_learn_js_classes' -->
Что такое класс?::


В объектно-ориентированном программировании класс – это расширяемый шаблон кода для создания объектов, который устанавливает в них начальные значения (свойства) и реализацию поведения (методы).
<!-- basicblock-end -->



