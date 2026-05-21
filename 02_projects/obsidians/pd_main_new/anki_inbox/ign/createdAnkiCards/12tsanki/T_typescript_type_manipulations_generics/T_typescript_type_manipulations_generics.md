
#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# Что такое утиная типизация?
<!-- basicblock-start oid="ObsfzsWj4HUAi4DckiZAe7al"  deck='T_typescript_type_manipulations_generics' -->
Что такое утиная типизация?::


**Утиная типизация** (*duck typing*) — это концепция в программировании, согласно которой тип объекта определяется его поведением (методами и свойствами), а не явным указанием его типа. Принцип этой типизации можно описать фразой: *"Если это выглядит как утка, плавает как утка и крякает как утка, то это, вероятно, утка."*

В контексте утиной типизации, если объект имеет все необходимые методы и свойства, он может рассматриваться как объект определённого типа, даже если этот тип не указан явно.

### Пример утиной типизации в JavaScript:

```
function makeNoise(animal) {
    if (animal.quack) {
        animal.quack();
    }
}

const duck = {
    quack: () => console.log('Quack!')
};

const person = {
    quack: () => console.log('Person imitating a duck!')
};

makeNoise(duck);   // Выведет: Quack!
makeNoise(person); // Выведет: Person imitating a duck!
```

В этом примере функция `makeNoise` не проверяет тип аргумента `animal`. Важно лишь то, что у объекта есть метод `quack`. Оба объекта — и утка, и человек — могут быть переданы в функцию, потому что они реализуют поведение, ожидаемое от "ути", а именно метод `quack`.

### Утиная типизация vs Явная типизация

В языках с **явной типизацией** (например, Java или C#) объект должен принадлежать определённому классу или реализовывать интерфейс, чтобы его можно было передать в функцию. В языках с **утиной типизацией** (например, JavaScript или Python) важнее наличие необходимых методов и свойств у объекта, нежели его тип.

### Пример в TypeScript

TypeScript поддерживает утиную типизацию через **структурную типизацию** (*structural typing*). Это означает, что объекты совместимы друг с другом, если они имеют одинаковую структуру.

```
interface Duck {
    quack(): void;
}

const duck: Duck = {
    quack: () => console.log('Quack!')
};

const person = {
    quack: () => console.log('Person imitating a duck!')
};

function makeNoise(animal: Duck) {
    animal.quack();
}

makeNoise(duck);   // Выведет: Quack!
makeNoise(person); // Выведет: Person imitating a duck!
```

Хотя `person` неявно реализует интерфейс `Duck`, TypeScript позволяет использовать его в функции `makeNoise`, поскольку у него есть метод `quack`, что соответствует ожидаемому поведению.
<!-- basicblock-end -->




#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# Что можно сказать про generics contraints?
<!-- basicblock-start oid="ObsPdifFWVQrtAbUCAUaUbW5"  deck='T_typescript_type_manipulations_generics' -->
Что можно сказать про typescript contraints?::


В TypeScript можно накладывать **ограничения (constraints)** на обобщённые типы, чтобы обеспечить выполнение определённых условий на передаваемые типы. Это полезно, когда вам нужно гарантировать наличие конкретных свойств или методов у типов, с которыми вы работаете в обобщённой функции или классе.

### Пример с ограничением
В рассмотренном примере задача состояла в том, чтобы обобщённая функция могла работать только с типами, у которых есть свойство `length`. Мы создали интерфейс `Lengthwise`, который содержит это свойство, и использовали его для ограничения обобщённого типа с помощью ключевого слова `extends`.

#### Код:
```
interface Lengthwise {
  length: number;
}
 
function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length); // Теперь мы знаем, что у arg есть свойство length
  return arg;
}
```

Теперь функция `loggingIdentity` может работать только с типами, у которых есть свойство `length`. Например:

#### Пример использования:
```
loggingIdentity({ length: 10, value: 3 });  // Работает, так как у объекта есть свойство length
loggingIdentity([1, 2, 3]);                // Работает, так как массивы имеют свойство length
```

Если передать тип без свойства `length`, TypeScript выдаст ошибку компиляции:

```
loggingIdentity(3);  // Ошибка: у числа нет свойства length
```

### Когда использовать ограничения для обобщённых типов?
Ограничения полезны в следующих сценариях:

1. **Работа с объектами, имеющими специфические свойства**. Например, если ваша функция должна работать с объектами, у которых есть обязательные свойства, вы можете создать интерфейс для этих свойств и ограничить тип параметров этим интерфейсом.
   ```
   interface HasName {
     name: string;
   }

   function greet<T extends HasName>(obj: T) {
     console.log(`Hello, ${obj.name}`);
   }

   greet({ name: 'John', age: 30 });  // Работает
   greet({ age: 30 });  // Ошибка: свойство 'name' отсутствует
   
```

2. **Работа с массивоподобными структурами**. Вы можете ограничить тип так, чтобы он был массивом или имел индексируемую структуру с определёнными свойствами.
   ```
   function getFirstElement<T extends any[]>(arr: T): T[0] {
     return arr[0];
   }

   getFirstElement([1, 2, 3]);  // Вернёт 1
   getFirstElement(['a', 'b', 'c']);  // Вернёт 'a'
   
```

3. **Комбинирование ограничений**. Вы можете накладывать более сложные ограничения на типы с использованием нескольких интерфейсов или типов, чтобы более точно описать ожидаемые свойства.
   ```
   interface HasId {
     id: number;
   }

   interface HasName {
     name: string;
   }

   function printIdAndName<T extends HasId & HasName>(obj: T) {
     console.log(`ID: ${obj.id}, Name: ${obj.name}`);
   }

   printIdAndName({ id: 1, name: 'Alice' });  // Работает
   printIdAndName({ id: 1 });  // Ошибка: отсутствует свойство 'name'
   
```

### Преимущества использования ограничений
1. **Повышение безопасности типов**: Ограничения позволяют TypeScript отслеживать и проверять корректность типов на этапе компиляции, что помогает избежать ошибок во время выполнения.
2. **Гибкость и переиспользование кода**: Используя обобщённые функции с ограничениями, вы можете писать более универсальные и многократно используемые компоненты, которые работают с различными типами, соответствующими условиям ограничения.
3. **Чёткое описание требований к типам**: Использование интерфейсов или типов с ограничениями делает код более понятным и само-документируемым, что упрощает его сопровождение.

### Заключение
Ограничения обобщённых типов в TypeScript помогают вам контролировать, с какими типами может работать функция или класс, и обеспечивают безопасность типов. Это особенно полезно, когда нужно работать с типами, которые имеют специфические свойства, и вы хотите гарантировать их наличие на этапе компиляции.
<!-- basicblock-end -->




#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# Что можно сказать про Обобщенные компоненты в UI - библиотеках ?
<!-- basicblock-start oid="ObsBQJypcOKljdmAIpuZI9A1"  deck='T_typescript_type_manipulations_generics' -->
Что можно сказать про Обобщенные компоненты в UI - библиотеках ?::


В некоторых UI-фреймворках (например, в React) можно использовать обобщённые классы или функции для создания компонентов, которые могут работать с разными типами данных:

```
class Dropdown<T> {
  constructor(private options: T[]) {}

  render(): void {
    this.options.forEach(option => {
      console.log(option);
    });
  }
}

// Пример использования:
const stringDropdown = new Dropdown<string>(['Option 1', 'Option 2', 'Option 3']);
stringDropdown.render(); // Вывод: 'Option 1', 'Option 2', 'Option 3'

const numberDropdown = new Dropdown<number>([1, 2, 3]);
numberDropdown.render(); // Вывод: 1, 2, 3
```
<!-- basicblock-end -->




#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# Что можно сказать про сценарий использования обобщенных конструкторов для валидатора?
<!-- basicblock-start oid="ObstRJpyVq7UE0QV10uxtqf3"  deck='T_typescript_type_manipulations_generics' -->
Что можно сказать про сценарий использования обобщенных конструкторов для валидатора?::


Обобщённые классы могут использоваться для обработки данных с различными типами, например, при валидации или трансформации данных:

```
class Validator<T> {
  constructor(private rules: ((input: T) => boolean)[]) {}

  validate(input: T): boolean {
    return this.rules.every(rule => rule(input));
  }
}

// Пример использования:
const numberValidator = new Validator<number>([
  (input) => input > 0,
  (input) => input < 100
]);

console.log(numberValidator.validate(10)); // Вывод: true
console.log(numberValidator.validate(200)); // Вывод: false
```
<!-- basicblock-end -->




#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# ```
<!-- basicblock-start oid="ObsAzcs6PYAmiz80Q1bldnAJ"  deck='T_typescript_type_manipulations_generics' -->
```::

class Validator<T> {
  constructor(private rules: ((input: T) => boolean)[]) {}

  validate(input: T): boolean {
    return this.rules.every(rule => rule(input));
  }
}

// Пример использования:
const numberValidator = new Validator<number>([
  (input) => input > 0,
  (input) => input < 100
]);

console.log(numberValidator.validate(10)); // Вывод: true
console.log(numberValidator.validate(200)); // Вывод: false
```

### 7. **Обобщённые компоненты в UI-библиотеках**
В некоторых UI-фреймворках (например, в React) можно использовать обобщённые классы или функции для создания компонентов, которые могут работать с разными типами данных:

```
class Dropdown<T> {
  constructor(private options: T[]) {}

  render(): void {
    this.options.forEach(option => {
      console.log(option);
    });
  }
}

// Пример использования:
const stringDropdown = new Dropdown<string>(['Option 1', 'Option 2', 'Option 3']);
stringDropdown.render(); // Вывод: 'Option 1', 'Option 2', 'Option 3'

const numberDropdown = new Dropdown<number>([1, 2, 3]);
numberDropdown.render(); // Вывод: 1, 2, 3
```

### Заключение

Обобщённые классы в TypeScript — это мощный инструмент для создания многократно используемых и гибких компонентов, которые работают с разными типами данных, обеспечивая строгую типизацию и уменьшение дублирования кода. Сценарии применения могут варьироваться от простых коллекций данных до сложных структур для работы с API, базами данных и пользовательским интерфейсом.
<!-- basicblock-end -->




#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# Какие есть примеры использования обобщенных классов в TS?
<!-- basicblock-start oid="Obs1oO8MEg4uBKJebf3K74Qp"  deck='T_typescript_type_manipulations_generics' -->
Какие есть примеры использования обобщенных классов в TS?::


Обобщённые классы в TypeScript (TS) используются для создания гибких и многократно используемых компонентов, которые могут работать с разными типами данных. Это позволяет разработчикам писать код, который не привязан к конкретным типам, но при этом сохраняет строгую типизацию. Вот несколько сценариев, где обобщённые классы полезны:

### 1. **Коллекции данных (например, списки, стеки, очереди)**
Обобщённые классы часто используются для реализации контейнеров, которые могут хранить элементы любого типа, будь то объекты, строки, числа и т.д. Например, создание обобщённого класса для стека:

```
class Stack<T> {
  private items: T[] = [];

  push(item: T) {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// Пример использования:
const numberStack = new Stack<number>();
numberStack.push(10);
console.log(numberStack.pop()); // Вывод: 10

const stringStack = new Stack<string>();
stringStack.push('Hello');
console.log(stringStack.peek()); // Вывод: 'Hello'
```

### 2. **Обертки для API запросов и ответов**
Когда взаимодействуешь с API, можно использовать обобщённые классы для унифицированного представления запросов или ответов, независимо от типа данных, который возвращается API.

```
class ApiResponse<T> {
  constructor(
    public data: T,
    public success: boolean,
    public message?: string
  ) {}

  hasError(): boolean {
    return !this.success;
  }
}

// Пример использования:
const response = new ApiResponse<string>('User created successfully', true);
console.log(response.data); // Вывод: 'User created successfully'
```

### 3. **Работа с парами значений (Tuple-like структуры)**
Иногда нужно хранить данные в виде пар (ключ-значение или другие пары), где типы могут быть разными. Обобщённые классы позволяют легко реализовать это.

```
class Pair<K, V> {
  constructor(public key: K, public value: V) {}
}

// Пример использования:
const pair = new Pair<number, string>(1, 'One');
console.log(pair.key); // Вывод: 1
console.log(pair.value); // Вывод: 'One'
```

### 4. **Обобщённые классы для кэширования**
Механизм кэширования может быть универсальным для разных типов данных. Обобщённый класс кэша может помочь хранить данные различных типов, избегая повторного кода.

```
class Cache<T> {
  private data: Map<string, T> = new Map();

  set(key: string, value: T) {
    this.data.set(key, value);
  }

  get(key: string): T | undefined {
    return this.data.get(key);
  }

  clear() {
    this.data.clear();
  }
}

// Пример использования:
const stringCache = new Cache<string>();
stringCache.set('greeting', 'Hello');
console.log(stringCache.get('greeting')); // Вывод: 'Hello'

const numberCache = new Cache<number>();
numberCache.set('count', 10);
console.log(numberCache.get('count')); // Вывод: 10
```

### 5. **Работа с сущностями в ORM (Object-Relational Mapping)**
Обобщённые классы могут быть использованы для создания универсальных репозиториев для взаимодействия с базой данных, где операции над сущностями не зависят от их типа.

```
class Repository<T> {
  private entities: T[] = [];

  add(entity: T) {
    this.entities.push(entity);
  }

  findAll(): T[] {
    return this.entities;
  }

  findById(id: number): T | undefined {
    // Допустим, у каждой сущности есть поле id
    return this.entities[id];
  }
}

// Пример использования:
class User {
  constructor(public id: number, public name: string) {}
}

const userRepository = new Repository<User>();
userRepository.add(new User(1, 'John'));
userRepository.add(new User(2, 'Jane'));

const users = userRepository.findAll();
console.log(users); // Вывод: [User { id: 1, name: 'John' }, User { id: 2, name: 'Jane' }]
```

### 6. **Валидация и трансформация данных**
Обобщённые классы могут использоваться для обработки данных с различными типами, например, при валидации или трансформации данных:
<!-- basicblock-end -->




#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# Как выглядит пример обобщенного класса в TS?
<!-- basicblock-start oid="ObsQ9nw8tgJ9HM8FSRteAPf0"  deck='T_typescript_type_manipulations_generics' -->
Как выглядит пример обобщенного класса в TS?::


```
class GenericNumber<Type> {
    zeroValue: Type;
    add: (x: Type, y: Type) => Type;

    constructor(zeroValue: Type, addFunction: (x: Type, y: Type) => Type) {
        this.zeroValue = zeroValue;
        this.add = addFunction;
    }
}

let myGenericNumber = new GenericNumber<number>(0, (x, y) => x + y);
let myGenericString = new GenericNumber<string>('1', (x, y) => x + y);
console.log(myGenericNumber.add(1, 2)); // Вывод: 3
console.log(myGenericString.add("1", "2")); // Вывод: 3
```
<!-- basicblock-end -->




#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# Как выглядит применение интерфейсов для обобщений дженериков в TS на примере myIdentity?
<!-- basicblock-start oid="ObsvaLZFByW71I3tm9so0wUm"  deck='T_typescript_type_manipulations_generics' -->
Как выглядит применение интерфейсов для обобщений дженериков в TS на примере myIdentity?::


```
interface GenericTypeInterface<Type> {
    (arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
    return arg;
}

let myIdentityNumber: GenericTypeInterface<number> = identity;
let myIdentityString: GenericTypeInterface<string> = identity;
let myIdentityArrayNumbers: GenericTypeInterface<number[]> = identity;
let myIdentityArrayStrings: GenericTypeInterface<string[]> = identity;

console.log(myIdentityNumber(1)); // Frolov Debug
console.log(myIdentityString("1")); // Frolov Debug
console.log(myIdentityArrayNumbers([1,2])); // Frolov Debug
console.log(myIdentityArrayStrings(["1","2"])); // Frolov Debug
```
<!-- basicblock-end -->




#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# Что можно сказать про Generic Types in TypeScript
<!-- basicblock-start oid="ObsgFaTttLGwKBCe7kFLG2uJ"  deck='T_typescript_type_manipulations_generics' -->
Что можно сказать про Generic Types in TypeScript::


### Generic Types in TypeScript

In предыдущих разделах мы рассматривали создание обобщенных функций, которые работают с широким диапазоном типов. В этом разделе мы рассмотрим, как определить типы для таких функций и как создавать обобщенные интерфейсы.

### Тип обобщенных функций

Типы обобщенных функций в TypeScript похожи на типы обычных функций, за тем исключением, что типовые параметры указываются первыми, аналогично объявлению самой функции.

Пример:

```
function identity<Type>(arg: Type): Type {
  return arg;
}
 
let myIdentity: <Type>(arg: Type) => Type = identity;
```

В этом примере тип `myIdentity` указывает на то, что это функция, которая принимает типовой параметр `<Type>` и возвращает значение того же типа.

### Использование других имен для типовых параметров

Можем использовать любое имя для типового параметра, если оно соответствует по количеству и логике использования. Например, вместо `Type` можем использовать другое имя, скажем, `Input`:

```
function identity<Type>(arg: Type): Type {
  return arg;
}
 
let myIdentity: <Input>(arg: Input) => Input = identity;
```

Этот код будет работать точно так же, как и предыдущий пример, потому что имя типового параметра не влияет на работу функции.

### Определение типа через объектный литерал

Вместо стандартного синтаксиса для объявления типа функции, можно использовать объектный литерал для описания вызова функции:

```
function identity<Type>(arg: Type): Type {
  return arg;
}
 
let myIdentity: { <Type>(arg: Type): Type } = identity;
```

### Создание обобщенного интерфейса

Теперь можем перенести объектный литерал с вызовом функции в интерфейс:

```
interface GenericIdentityFn {
  <Type>(arg: Type): Type;
}
 
function identity<Type>(arg: Type): Type {
  return arg;
}
 
let myIdentity: GenericIdentityFn = identity;
```

Здесь `GenericIdentityFn` — это интерфейс, который описывает обобщенную функцию, принимающую типовой параметр и возвращающую значение того же типа.

### Перемещение типового параметра на уровень интерфейса

Мы также можем переместить типовой параметр из вызова функции в сам интерфейс. Это позволяет сделать типовой параметр видимым для всех членов интерфейса:

```
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}
 
function identity<Type>(arg: Type): Type {
  return arg;
}
 
let myIdentity: GenericIdentityFn<number> = identity;
```

Теперь вместо того, чтобы описывать обобщенную функцию напрямую, мы описываем функцию, которая фиксирована на определенном типе. В примере выше тип `GenericIdentityFn<number>` фиксирует параметр `Type` на `number`, что означает, что функция будет работать только с числами.

### Когда использовать параметр типа в вызове функции или на уровне интерфейса?

Знание того, когда стоит размещать типовой параметр непосредственно на вызове функции или на уровне интерфейса, может быть полезным для определения, какие части вашего типа будут обобщенными. Например, если вся структура должна работать с одним и тем же типом, разумнее будет переместить параметр на уровень интерфейса.

### Обобщенные классы

Помимо интерфейсов, мы можем создавать обобщенные классы. Пример:

```
class GenericNumber<Type> {
  zeroValue: Type;
  add: (x: Type, y: Type) => Type;

  constructor(zeroValue: Type, addFunction: (x: Type, y: Type) => Type) {
    this.zeroValue = zeroValue;
    this.add = addFunction;
  }
}

let myGenericNumber = new GenericNumber<number>(0, (x, y) => x + y);
console.log(myGenericNumber.add(1, 2)); // Вывод: 3
```

Здесь мы создали класс `GenericNumber`, который использует типовой параметр `Type` для работы с различными типами данных.

### Ограничения

Важно отметить, что в TypeScript **нельзя** создавать обобщенные **enums** и **namespaces**.
<!-- basicblock-end -->




#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# Что можно сказать по теме working with generics types?
<!-- basicblock-start oid="ObsIjqaeGMO03qQ7stgjGy11"  deck='T_typescript_type_manipulations_generics' -->
Что можно сказать по теме working with generics types?::


Когда вы начинаете работать с **generics** в TypeScript, важно помнить, что компилятор будет следить за тем, чтобы вы корректно использовали обобщенные типы в теле функции. Это означает, что вам нужно учитывать, что параметры с обобщенными типами могут быть **любого** типа, и, следовательно, их использование должно быть совместимо с любыми возможными типами.

### Пример ошибки при использовании generics

Рассмотрим нашу функцию идентичности (`identity`) из предыдущих примеров:

```
function identity<Type>(arg: Type): Type {
  return arg;
}
```

Теперь представим, что мы хотим добавить вывод длины аргумента (`arg.length`) в консоль:

```
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length); // Ошибка!
  return arg;
}
```

Здесь TypeScript выдаст ошибку: **`Property 'length' does not exist on type 'Type'.** Причина в том, что обобщенный тип `Type` может представлять любой тип данных. Например, если пользователь вызовет эту функцию с числом, то у числа нет свойства `.length`, и компилятор не может гарантировать его наличие.

### Уточнение типа для массива

Если мы хотим, чтобы функция работала только с **массивами** обобщенных типов, где свойство `.length` доступно, мы можем указать это явно. Например, если `arg` должен быть массивом элементов типа `Type`, то это можно описать следующим образом:

```
function loggingIdentity<Type>(arg: Type[]): Type[] {
  console.log(arg.length); // Теперь длина доступна
  return arg;
}
```

Теперь `arg` — это массив элементов типа `Type`, и у массивов всегда есть свойство `.length`. Таким образом, мы можем вызывать функцию для массива любого типа, и она вернет массив того же типа.

### Альтернативный синтаксис

Вместо использования `Type[]` для описания массива можно использовать тип `Array<Type>`, что эквивалентно:

```
function loggingIdentity<Type>(arg: Array<Type>): Array<Type> {
  console.log(arg.length); // У массива есть .length, так что ошибки нет
  return arg;
}
```

Этот стиль описания часто встречается в других языках программирования и также широко используется в TypeScript.

### Пример использования

Давайте рассмотрим пример вызова функции `loggingIdentity`:

```
let result = loggingIdentity([1, 2, 3]); // Массив чисел
console.log(result); // Вывод: [1, 2, 3] и длина массива 3

let stringResult = loggingIdentity(["hello", "world"]); // Массив строк
console.log(stringResult); // Вывод: ["hello", "world"] и длина массива 2
```

В этом примере TypeScript автоматически выводит тип `Type`, основываясь на переданном аргументе. Если передан массив чисел, `Type` становится `number`, а если передан массив строк, то `Type` — это `string`.

### Вывод

Работа с обобщенными типами позволяет создавать гибкие функции, которые могут работать с разными типами данных, сохраняя при этом типобезопасность. Компилятор TypeScript следит за тем, чтобы мы корректно использовали такие обобщенные типы, и предупреждает об ошибках, если мы пытаемся использовать неподдерживаемые свойства для обобщенных переменных.
<!-- basicblock-end -->




#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# Что там было было в теме hello world дженериков?
<!-- basicblock-start oid="ObsHkIRA3i9ylbqF47EgsLXw"  deck='T_typescript_type_manipulations_generics' -->
Что там было было в теме hello world дженериков?::


В TypeScript "identity function" (или "функция идентичности") — это функция, которая возвращает то же значение, которое получает в качестве аргумента. Она является хорошим примером для демонстрации работы с **generics** (обобщенными типами).

### Пример без использования Generics

Функцию идентичности можно реализовать без использования generics, но тогда она будет либо привязана к конкретному типу данных, либо к типу `any`:

1. **Фиксированный тип:**

```
function identity(arg: number): number {
  return arg;
}
```

Здесь функция принимает только числа и возвращает числа. Это работает, но если вам потребуется поддерживать другие типы данных (например, строки или массивы), вам придется создавать новые версии этой функции для каждого типа.

2. **Тип `any`:**

```
function identity(arg: any): any {
  return arg;
}
```

Использование типа `any` позволяет функции принимать любой тип данных, но проблема в том, что TypeScript больше не знает, какой именно тип был передан. То есть, если вы передадите число, результатом может быть что угодно (так как это `any`).

### Решение с использованием Generics

Чтобы сохранить информацию о типе аргумента и возвращаемого значения, используется **generic** (обобщенный тип):

```
function identity<Type>(arg: Type): Type {
  return arg;
}
```

Здесь `Type` — это **type variable** (переменная типа), которая используется для того, чтобы захватить тип переданного аргумента. В результате тип переданного аргумента используется как для него самого, так и для возвращаемого значения. Функция теперь **генерик**, так как может работать с любым типом данных, сохраняя информацию о нем.

### Вызов функции

Функцию можно вызывать двумя способами:

1. **Явное указание типа**:

```
let output = identity<string>("myString");
```

Здесь мы явно указываем, что тип переменной `Type` должен быть строкой (`string`). Это делается с использованием угловых скобок `<string>`.

2. **Инференция типа (type inference)**:

```
let output = identity("myString");
```

В этом случае мы не указываем тип явно. TypeScript автоматически определяет, что `Type` должен быть `string`, основываясь на типе переданного аргумента. Это делает код более кратким и удобным.

### Преимущества Generics

1. **Гибкость:** Функция может работать с любыми типами данных.
2. **Безопасность:** В отличие от `any`, generics сохраняют информацию о типе, что позволяет избегать ошибок и делать код более предсказуемым.
3. **Инференция типов:** TypeScript может автоматически определить тип, что делает код более лаконичным.

### Пример использования

```
// Функция работает с любым типом данных
function identity<Type>(arg: Type): Type {
  return arg;
}

let result1 = identity<number>(42);   // result1 будет типа number
let result2 = identity<string>("hello");  // result2 будет типа string
let result3 = identity([1, 2, 3]);    // Тип массива будет автоматически определен

console.log(result1);  // 42
console.log(result2);  // "hello"
console.log(result3);  // [1, 2, 3]
```

### Когда нужно использовать явное указание типа

В некоторых случаях TypeScript не сможет вывести тип автоматически. Это может произойти, если контекст слишком сложен, и тогда потребуется явное указание типа:

```
let output = identity<number>("myString"); // Ошибка: "myString" не является числом
```

Здесь мы явно указываем, что ожидаем число, и TypeScript выдаст ошибку, если передан неподходящий тип.

### Заключение

Использование generics позволяет писать более гибкий и безопасный код в TypeScript. Благодаря возможности обобщать функции и классы для работы с различными типами данных, можно избежать избыточности и повысить типобезопасность.
<!-- basicblock-end -->




#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# Что там было было в теме hello world дженериков?
<!-- basicblock-start oid="ObsdCEDwwbxJUElNpaKbnjiT"  deck='T_typescript_type_manipulations_generics' -->
Что там было было в теме hello world дженериков?::


В TypeScript "identity function" (или "функция идентичности") — это функция, которая возвращает то же значение, которое получает в качестве аргумента. Она является хорошим примером для демонстрации работы с **generics** (обобщенными типами).

### Пример без использования Generics

Функцию идентичности можно реализовать без использования generics, но тогда она будет либо привязана к конкретному типу данных, либо к типу `any`:

1. **Фиксированный тип:**

```
function identity(arg: number): number {
  return arg;
}
```

Здесь функция принимает только числа и возвращает числа. Это работает, но если вам потребуется поддерживать другие типы данных (например, строки или массивы), вам придется создавать новые версии этой функции для каждого типа.

2. **Тип `any`:**

```
function identity(arg: any): any {
  return arg;
}
```

Использование типа `any` позволяет функции принимать любой тип данных, но проблема в том, что TypeScript больше не знает, какой именно тип был передан. То есть, если вы передадите число, результатом может быть что угодно (так как это `any`).

### Решение с использованием Generics

Чтобы сохранить информацию о типе аргумента и возвращаемого значения, используется **generic** (обобщенный тип):

```
function identity<Type>(arg: Type): Type {
  return arg;
}
```

Здесь `Type` — это **type variable** (переменная типа), которая используется для того, чтобы захватить тип переданного аргумента. В результате тип переданного аргумента используется как для него самого, так и для возвращаемого значения. Функция теперь **генерик**, так как может работать с любым типом данных, сохраняя информацию о нем.

### Вызов функции

Функцию можно вызывать двумя способами:

1. **Явное указание типа**:

```
let output = identity<string>("myString");
```

Здесь мы явно указываем, что тип переменной `Type` должен быть строкой (`string`). Это делается с использованием угловых скобок `<string>`.

2. **Инференция типа (type inference)**:

```
let output = identity("myString");
```

В этом случае мы не указываем тип явно. TypeScript автоматически определяет, что `Type` должен быть `string`, основываясь на типе переданного аргумента. Это делает код более кратким и удобным.

### Преимущества Generics

1. **Гибкость:** Функция может работать с любыми типами данных.
2. **Безопасность:** В отличие от `any`, generics сохраняют информацию о типе, что позволяет избегать ошибок и делать код более предсказуемым.
3. **Инференция типов:** TypeScript может автоматически определить тип, что делает код более лаконичным.

### Пример использования

```
// Функция работает с любым типом данных
function identity<Type>(arg: Type): Type {
  return arg;
}

let result1 = identity<number>(42);   // result1 будет типа number
let result2 = identity<string>("hello");  // result2 будет типа string
let result3 = identity([1, 2, 3]);    // Тип массива будет автоматически определен

console.log(result1);  // 42
console.log(result2);  // "hello"
console.log(result3);  // [1, 2, 3]
```

### Когда нужно использовать явное указание типа

В некоторых случаях TypeScript не сможет вывести тип автоматически. Это может произойти, если контекст слишком сложен, и тогда потребуется явное указание типа:

```
let output = identity<number>("myString"); // Ошибка: "myString" не является числом
```

Здесь мы явно указываем, что ожидаем число, и TypeScript выдаст ошибку, если передан неподходящий тип.

### Заключение

Использование generics позволяет писать более гибкий и безопасный код в TypeScript. Благодаря возможности обобщать функции и классы для работы с различными типами данных, можно избежать избыточности и повысить типобезопасность.
<!-- basicblock-end -->



