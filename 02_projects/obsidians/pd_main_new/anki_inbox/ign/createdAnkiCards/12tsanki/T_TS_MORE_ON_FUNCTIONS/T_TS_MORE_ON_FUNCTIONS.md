
#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# я не все закончил
<!-- basicblock-start oid="Obsw0eOl3JQRWEeZzTAKm7Fy"  deck='T_TS_MORE_ON_FUNCTIONS' -->
я не все закончил::


<!-- basicblock-end -->




#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# #todo к этому топику не помешает вернуться еще
<!-- basicblock-start oid="ObsnJb8JabXHPLbBSCOkRmNQ"  deck='T_TS_MORE_ON_FUNCTIONS' -->
#todo к этому топику не помешает вернуться еще::


<!-- basicblock-end -->




#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# Правила написания дженериков?
<!-- basicblock-start oid="ObsEjoBkTdcsVRlaPJRB8IZP"  deck='T_TS_MORE_ON_FUNCTIONS' -->
Правила написания дженериков?::


Rule: When possible, use the type parameter itself rather than constraining it
Rule: Always use as few type parameters as possible
Rule: If a type parameter only appears in one location, strongly reconsider if you actually need it
Rule: When writing a function type for a callback, never write an optional parameter unless you intend to call the function without passing that argument
<!-- basicblock-end -->




#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# Как работает параметр со значением по умолчанию?
<!-- basicblock-start oid="Obsj3aZk2x0OStuqftdGps2u"  deck='T_TS_MORE_ON_FUNCTIONS' -->
Как работает параметр со значением по умолчанию?::


Параметр со значением по умолчанию инициализируется этим значением, если аргумент не передан или передан undefined. Таким образом, тип параметра остается строгим.

```
function f(x = 10) {
  console.log(x);
}

f();            // OK, logs: 10 (значение по умолчанию)
f(5);          // OK, logs: 5
f(undefined);  // OK, logs: 10 (значение по умолчанию)
```
<!-- basicblock-end -->




#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# Что происходит с параметром в функции, если он помечен как необязательный с помощью ??"
<!-- basicblock-start oid="Obs2ycUCDDeC17K3DNB319Ei"  deck='T_TS_MORE_ON_FUNCTIONS' -->
Что происходит с параметром в функции, если он помечен как необязательный с помощью ??"::


Если параметр помечен как необязательный, он может принимать значение undefined, и его тип будет number | undefined. Это означает, что вызов функции без аргументов будет допустим.

```
function f(x?: number) {
  console.log(x);
}

f();       // OK, logs: undefined
f(10);     // OK, logs: 10
```
<!-- basicblock-end -->




#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# Когда параметр типа можно исключить из сигнатуры функции?
<!-- basicblock-start oid="Obsorpi93vPaK3PuXZ8xZ4e9"  deck='T_TS_MORE_ON_FUNCTIONS' -->
Когда параметр типа можно исключить из сигнатуры функции?::


Если параметр типа появляется только один раз в сигнатуре функции и не связывает несколько типов между собой, его можно исключить. Параметры типов нужны для связи типов нескольких значений.

```
// Ненужное использование параметра типа
function greet<Str extends string>(s: Str) {
  console.log("Hello, " + s);
}

// Упрощённая версия
function greet(s: string) {
  console.log("Hello, " + s);
}
```
<!-- basicblock-end -->




#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# Почему важно минимизировать количество параметров типов при создании обобщённых функций?"
<!-- basicblock-start oid="ObsQjmINTqvDTevNLHH8wQau"  deck='T_TS_MORE_ON_FUNCTIONS' -->
Почему важно минимизировать количество параметров типов при создании обобщённых функций?"::


Чем меньше параметров типов, тем проще использовать и понимать функцию. Лишние параметры усложняют код и заставляют вызывающего указывать ненужные аргументы типов.

```
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}

function filter2<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func);
}
```
<!-- basicblock-end -->




#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# Как правильно использовать параметры типов в обобщённых функциях, чтобы улучшить вывод типов?"
<!-- basicblock-start oid="ObsAiE7A02J1FMu2RT3JpRM5"  deck='T_TS_MORE_ON_FUNCTIONS' -->
Как правильно использовать параметры типов в обобщённых функциях, чтобы улучшить вывод типов?"::


Лучше всего использовать параметр типа напрямую, без лишних ограничений, чтобы TypeScript мог корректно выводить типы элементов во время вызова функции."
Пример кода:



```
function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}

function firstElement2<Type extends any[]>(arr: Type) {
  return arr[0];
}

// a: number (хорошо)
const a = firstElement1([1, 2, 3]);

// b: any (плохо)
const b = firstElement2([1, 2, 3]);
```
<!-- basicblock-end -->




#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# Что можно сказать про specifing type arguments Указание Аргументов типа ? 
<!-- basicblock-start oid="ObsJYbpac9Bu9IDC0V0b8l8b"  deck='T_TS_MORE_ON_FUNCTIONS' -->
Что можно сказать про specifing type arguments Указание Аргументов типа ? ::


```
// TypeScript обычно может вывести предполагаемые аргументы типа в общем вызове,
// но не всегда. Например, предположим, вы написали функцию для объединения двух массивов:

// Давайте напишем функцию, которая объединяет два массива

function combine<Type>(arr1: Type[], arr2: Type[]) {
    return arr1.concat(arr2);
}


//
// combine([1,2,3],['1','2']);

// Но это не будет работать потому что у содержимого массивов разные типы
// Но мы можем указать в дженерике, что у массивов могут быть разные типы

let newArr = combine<number | string >([1,2,3],['1','2','3']);
console.log(newArr); // Frolov Debug
```
<!-- basicblock-end -->




#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# Что можно сказать про specifing type arguments?
<!-- basicblock-start oid="ObsnV1Y06pYRNQ8avzWdrgzg"  deck='T_TS_MORE_ON_FUNCTIONS' -->
Что можно сказать про specifing type arguments?::


<!-- basicblock-end -->




#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# Расскажи про ограничения constrains ?
<!-- basicblock-start oid="ObsUBTCjDjIw67XMbrss0ZBv"  deck='T_TS_MORE_ON_FUNCTIONS' -->
Расскажи про ограничения constrains ?::


```
function longest<Type extends {length: number}> (a: Type, b: Type) : Type {
    if (a.length >= b.length ) {
        return a;
    } else {
        return b;
    }
}

const longerArray = longest([1,2], [1,2,3,4]);
console.log(longerArray);

const longestString = longest('srt', 'number');
console.log(longestString);

// const notOl = longest(1,2);

// const notOl = longest(1,2);
// В этом примере есть несколько интересных моментов, на которые следует обратить внимание.
// Мы разрешили TypeScript определять возвращаемый тип longest .
// Вывод типа возвращаемого значения также работает с универсальными функциями.
//
// Поскольку мы ограничили тип значением { длина: число },
// нам разрешили получить доступ к свойству .length параметров a и b.
// Без ограничения типа мы не смогли бы получить доступ к этим свойствам,
// потому что значения могли быть какого-либо другого типа без свойства длины .
//
// Типы longerArray и longerString были выведены на основе аргументов.
// Помните, что все обобщения связаны с двумя или более значениями одного и того же типа!
//
// Наконец, как и хотелось бы, вызов longest(10, 100) отклоняется, поскольку тип number не имеет
// a .свойство длины.
```
<!-- basicblock-end -->




#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# ### Заключение:
<!-- basicblock-start oid="ObsWGxu6DN3W9QeUtHjeV4ak"  deck='T_TS_MORE_ON_FUNCTIONS' -->
### Заключение:::

Функция `map` с дженериками предоставляет мощный способ преобразования массивов в TypeScript, сохраняя информацию о типах входных данных и результатах. В данном примере функция преобразует массив строк в массив чисел, используя типизированный механизм TypeScript для обеспечения безопасности типов.
<!-- basicblock-end -->




#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# Что можно сказать про дженерики и возможность функции возвращать любой тип inference?
<!-- basicblock-start oid="Obs65b9kpPk6DVgVIYxQlt0B"  deck='T_TS_MORE_ON_FUNCTIONS' -->
Что можно сказать про дженерики и возможность функции возвращать любой тип inference?::


### Подробное описание кода:

```
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
    return arr.map(func);
}

const parsed = map(['1', '2', '3'], (n) => parseInt(n));
```

### 1. **Объявление функции `map` с использованием дженериков**:

Функция `map` — это обобщенная функция, использующая два параметра типа (`Input` и `Output`), которые делают её гибкой и применимой для различных типов данных. Обобщенные функции (generic functions) позволяют работать с типами, которые определяются только во время вызова.

#### Структура функции:
```
function map<Input, Output>(
    arr: Input[],                         // аргумент arr: массив элементов типа Input
    func: (arg: Input) => Output          // аргумент func: функция, принимающая Input и возвращающая Output
): Output[] {                             // возвращаемое значение: массив элементов типа Output
    return arr.map(func);                 // вызов стандартного метода массива map с переданной функцией
}
```

#### Параметры:
1. **`Input[]`**:  
   Это тип массива, где каждый элемент имеет тип `Input`. В данном случае, тип `Input` будет определяться динамически при вызове функции.
   
2. **`func: (arg: Input) => Output`**:  
   Это тип функции, принимающей один аргумент типа `Input` и возвращающей значение типа `Output`. Она применится к каждому элементу массива.
   
3. **`Output[]`**:  
   Возвращаемое значение функции — массив, где каждый элемент имеет тип `Output`, который также определяется динамически на основе переданной функции.

#### Внутри функции:
Функция `map` использует стандартный метод `Array.prototype.map()`, который:
- Применяет переданную функцию `func` к каждому элементу массива `arr`.
- Возвращает новый массив, содержащий результаты применения функции `func`.

### 2. **Использование функции `map` с массивом строк и функцией `parseInt`**:

```
const parsed = map(['1', '2', '3'], (n) => parseInt(n));
```

#### Что происходит здесь:
1. **Вызов функции `map`**:
   - Первый аргумент: `['1', '2', '3']` — это массив строк.
   - Второй аргумент: `(n) => parseInt(n)` — это функция-стрелка, которая принимает строку (`n`) и возвращает число, преобразованное с помощью функции `parseInt`.

#### Как TypeScript интерпретирует типы:
- **`Input`**:  
  Поскольку первый аргумент — это массив строк, TypeScript выводит тип `Input` как `string`.
  
- **`Output`**:  
  Поскольку функция `parseInt(n)` возвращает число, TypeScript выводит тип `Output` как `number`.

Таким образом, при вызове:
```
const parsed = map<string, number>(['1', '2', '3'], (n) => parseInt(n));
```
- Функция `map` будет принимать массив строк (`Input[]`) и преобразовывать его в массив чисел (`Output[]`).

#### Конечный результат:
- После применения `map`, функция `parseInt` будет вызвана для каждого элемента массива `['1', '2', '3']`, и каждый элемент будет преобразован в число.
  
- Результат вызова:
```
console.log(parsed); // [1, 2, 3]
```
`parsed` — это массив чисел: `[1, 2, 3]`.

### 3. **Рассмотрение типов и использования дженериков**:

- **`Input` и `Output`** — это параметры типа, которые позволяют функции быть гибкой и работать с любыми типами данных. В примере выше:
  - `Input` выводится как `string`, так как функция работает с массивом строк.
  - `Output` выводится как `number`, так как результатом применения функции `parseInt` является число.

- **Дженерики** позволяют функции оставаться универсальной: она может работать с любым массивом и преобразовывать его элементы в любой другой тип с помощью переданной функции.

### 4. **Важные моменты**:

- **Преимущество использования дженериков**:  
  Дженерики делают функцию более гибкой, так как она может быть использована с любым типом данных, а TypeScript будет автоматически выводить нужные типы во время компиляции, что помогает избежать ошибок типов.
  
- **Метод `map` в JavaScript**:  
  Внутри TypeScript-функции используется встроенный метод `Array.prototype.map()`, который создает новый массив, применяя переданную функцию к каждому элементу исходного массива.
<!-- basicblock-end -->




#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# Что можно сказать про Generic functions?
<!-- basicblock-start oid="ObsoiPNBClmqEDjTjCiAg2rW"  deck='T_TS_MORE_ON_FUNCTIONS' -->
Что можно сказать про Generic functions?::


```
// Бла бла бла
// Обычно принято писать функции с указанием типа входных и выходных данны

// function returnFirs(arr: any[]) {
//     return arr[0];
// }

// Было бы гораздо лучше, если бы эта функция возвращала бы тот тип элемента из которых
// состоит переданный массив

// Generics в typescripts используются как раз для этого
// Для сопоставления входным данным выходных данных

// В TypeScript обобщенные значения используются,
// когда мы хотим описать соответствие(corresponding) между двумя значениями.
// Мы делаем это, объявляя параметр типа в сигнатуре функции:

function firstElement<Type>(collection: Type[]): Type | string {
    return collection[0];
}

console.log(typeof firstElement(['123','222','333'])); // Frolov Debug
console.log(typeof firstElement([1,2,3])); // Frolov Debug
console.log(typeof firstElement([[],[],[]])); // Frolov Debug
console.log(typeof firstElement([{}, {}, {}])); // Frolov Debug
```
<!-- basicblock-end -->




#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# Что еще можно сказать про call signatures?
<!-- basicblock-start oid="ObsJmNdxBBYLvlmOCyBUdm9a"  deck='T_TS_MORE_ON_FUNCTIONS' -->
Что еще можно сказать про call signatures?::


### Описание темы *Call Signatures* в TypeScript:

В TypeScript, *сигнатура вызова* (или *call signature*) описывает, как можно вызвать функцию или объект, предоставляя информацию о типах аргументов и возвращаемом значении. Это позволяет TypeScript выполнять проверку типов при вызове функций и конструкторов, а также помогает автодополнению в IDE.

#### Пример:
```
// Пример простой сигнатуры вызова для функции
type GreetFunction = (name: string) => string;

const greet: GreetFunction = (name: string) => {
    return `Hello, ${name}!`;
};

console.log(greet("Alice")); // Выведет: Hello, Alice!
```

В этом примере:
- Тип `GreetFunction` описывает сигнатуру вызова для функции. Она принимает один аргумент типа `string` и возвращает `string`.
- При реализации функции `greet` TypeScript проверяет, что она соответствует типу `GreetFunction`, что гарантирует корректность типов при вызове.

#### Сигнатуры вызова с несколькими аргументами:
```
type CalculateFunction = (a: number, b: number) => number;

const add: CalculateFunction = (a, b) => a + b;
const subtract: CalculateFunction = (a, b) => a - b;

console.log(add(5, 3)); // 8
console.log(subtract(5, 3)); // 2
```
- Тип `CalculateFunction` описывает сигнатуру вызова для функций, которые принимают два числа и возвращают число. Любая функция, соответствующая этой сигнатуре, может быть присвоена переменной `add` или `subtract`.

### Сигнатуры вызова для объектов:
TypeScript также поддерживает *сигнатуры вызова* для объектов и классов, что позволяет описывать, как именно объекты могут быть вызваны.

#### Пример с объектом, как функцией:
```
interface StringFormatter {
    (input: string): string;  // сигнатура вызова объекта
}

const toUpperCaseFormatter: StringFormatter = (input: string) => input.toUpperCase();

console.log(toUpperCaseFormatter("hello")); // Выведет: HELLO
```
- В этом примере объект `toUpperCaseFormatter` реализует интерфейс `StringFormatter`, который имеет сигнатуру вызова: он принимает строку и возвращает строку.

### Сигнатуры вызова для конструкторов:
TypeScript поддерживает специальные сигнатуры вызова для конструкторов классов, что позволяет типизировать создание экземпляров классов.

#### Пример:
```
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}

type PersonConstructor = {
    new (name: string): Person;
};

function createPerson(ctor: PersonConstructor, name: string) {
    return new ctor(name);
}

const alice = createPerson(Person, "Alice");
console.log(alice.name); // Выведет: Alice
```

В этом примере:
- `PersonConstructor` описывает сигнатуру вызова для конструктора: он принимает один аргумент `name` типа `string` и возвращает объект типа `Person`.
- Функция `createPerson` принимает типизированный конструктор и создает новый экземпляр класса `Person`.

### Перегрузка сигнатур вызова:
TypeScript поддерживает *перегрузку* сигнатур вызова для функций, что позволяет определять разные варианты вызовов одной и той же функции с различными типами аргументов.

#### Пример:
```
function combine(a: string, b: string): string;
function combine(a: number, b: number): number;
function combine(a: any, b: any): any {
    return a + b;
}

console.log(combine(5, 10));       // 15
console.log(combine("Hello, ", "world!")); // Hello, world!
```

- Здесь определены две перегруженные сигнатуры вызова для функции `combine`. Она может принимать либо два числа, либо две строки, и возвращает соответственно число или строку.

### Вывод:
Сигнатуры вызова в TypeScript позволяют точно описывать поведение функций и объектов при вызове, обеспечивая строгую проверку типов. Это значительно улучшает качество кода и предотвращает ошибки, связанные с передачей некорректных аргументов или неправильным использованием возвращаемых значений.
<!-- basicblock-end -->




#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# Что можно сказать про `call signatures`?
<!-- basicblock-start oid="ObshfEq6nPUq466l2uSuh37S"  deck='T_TS_MORE_ON_FUNCTIONS' -->
Что можно сказать про `call signatures`?::


Этот код иллюстрирует использование *конструкторного типа* (`SomeConstructor`), где объявляется *сигнатура вызова* (call signature) для функции-конструктора, которая создает объект типа `SomeObject`. В TypeScript, сигнатуры вызова описывают, какие аргументы принимает функция и что она возвращает. 

Рассмотрим код с комментариями:

```
class ParentObject {

    protected name: string;
    protected age: number;

    constructor(name: string, age: number) {
        // Инициализация полей класса ParentObject
        this.name = name;
        this.age = age;
    }

}

class SomeObject extends ParentObject {
    private level: number;

    constructor(name: string, age: number, level: number) {
        // Вызов конструктора родительского класса ParentObject
        super(name, age);
        // Инициализация собственного поля level
        this.level = level;
    }

    // Метод для вывода приветствия, где используется поле name, унаследованное от родителя
    sayHi() {
        console.log(`Hi, my name is ` + this.name);
    }
}

// Определение типа SomeConstructor
// Это сигнатура вызова для конструктора: тип функции, которая создает объект SomeObject
type SomeConstructor = {
    // new означает, что это сигнатура конструктора
    // s: string, n: number, a: number — аргументы конструктора
    // Возвращает объект типа SomeObject
    new (s: string, n: number, a: number): SomeObject;
}

function createSomeObject(ctor: SomeConstructor, name: string, age: number, level: number) {
    // Вызов конструктора, описанного в SomeConstructor
    // ctor — это тип, который соответствует сигнатуре вызова конструктора
    return new ctor(name, age, level);
}

// Создание нового объекта SomeObject с помощью функции createSomeObject
let newObj = createSomeObject(SomeObject, "slim shady", 15, 20);

// Вызов метода sayHi для созданного объекта
newObj.sayHi();
```

### Объяснение согласно теме сигнатур вызова (call signatures):
1. **Конструкторные сигнатуры**:  
   Тип `SomeConstructor` представляет собой конструкторную сигнатуру — это описание функции-конструктора, которая принимает три аргумента (`string`, `number`, `number`) и возвращает объект типа `SomeObject`. 
   - Тип сигнатуры `new (s: string, n: number, a: number): SomeObject` говорит TypeScript, что это *функция-конструктор*, которая должна быть вызвана с `new`, и что она возвращает объект класса `SomeObject`.

2. **Передача конструктора как аргумента**:  
   В функции `createSomeObject` мы передаем `SomeObject` как аргумент конструктора. Это позволяет вызывать конструктор `SomeObject` динамически, не зная заранее, какой именно класс будет использоваться.

3. **Проверка совместимости типов**:  
   Когда мы вызываем `createSomeObject`, TypeScript проверяет, что `SomeObject` имеет конструктор, который соответствует сигнатуре типа `SomeConstructor`. Это обеспечивает безопасное создание объектов с помощью конструктора, гарантируя, что передаются правильные типы аргументов.

4. **Инкапсуляция и доступ к полям**:  
   В методе `sayHi` используется свойство `name`, унаследованное от родительского класса `ParentObject`. Благодаря модификатору доступа `protected`, это свойство доступно в подклассе `SomeObject`.

### Вывод:
Этот код демонстрирует, как можно использовать сигнатуры вызова (call signatures) в TypeScript для описания конструкторов, которые принимают аргументы и возвращают объекты определенного типа. Благодаря этому, функция `createSomeObject` может быть типизирована так, чтобы принимать любой конструктор, который соответствует сигнатуре, описанной в `SomeConstructor`.
<!-- basicblock-end -->




#T_TS_MORE_ON_FUNCTIONS
#TS_MORE_ON_FUNCTIONS

#telegram 

# Что можно сказать про Function Type Expression?
<!-- basicblock-start oid="ObsPc2g9hJWdIZ8Bmd9Gmn1w"  deck='T_TS_MORE_ON_FUNCTIONS' -->
Что можно сказать про Function Type Expression?::


```
// Самый простой способ описать функцию - с помощью выражения типа функции.
// Эти типы синтаксически похожи на функции со стрелками:

function greeter(fn: (a: string) => void) {
    fn("hello world");
}

function printToConsole(s: string) {
    console.log(s);
}

greeter(printToConsole);

// Of course, we can use a type alias to name a function type:
// Конечно мы можем использовать псевдоним типа для указания типа функции

type greeterFunc = (a: string) => void;

function greeter2(fn: greeterFunc) {
    fn("hello world");
}

function printToConsole2(s: string) {
    console.log(s);
}
```
<!-- basicblock-end -->



