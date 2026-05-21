
Вот список вопросов по темам `ThisParameterType`, `OmitThisParameter`, `ThisType` и встроенным типам манипуляции со строками в TypeScript, оформленный в заданном формате.

<!-- basicblock-start oid="ObsTA8Zgd3ZZfjVZWXV2UMO2" deck='T_typescript_utility_types' --> 

1.1 Вопрос: "Что делает тип `ThisParameterType<Type>` в TypeScript?" :: 
1.2 Ответ: "Он извлекает тип параметра `this` для функции или возвращает `unknown`, если параметр не определён." 
Пример кода:
```typescript
function toHex(this: Number) {
  return this.toString(16);
}

type ThisTypeExample = ThisParameterType<typeof toHex>; // Number
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsfDRQtpSyXQ0DHPgSEIiT7" deck='T_typescript_utility_types' --> 

2.1 Вопрос: "Как можно использовать `OmitThisParameter<Type>` для удаления параметра `this` из функции?" :: 
2.2 Ответ: "Этот тип создаёт новую функцию без параметра `this`." 
Пример кода: 
```typescript
function toHex(this: Number) {
  return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);
console.log(fiveToHex()); // "5"
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="Obsim0yHUjC3u9NMtcQCPJIV" deck='T_typescript_utility_types' --> 

3.1 Вопрос: "Что такое `ThisType<T>` и как он используется?" :: 
3.2 Ответ: "Это маркерный тип, который используется для задания типа `this` в методах объекта." 
Пример кода:
```typescript
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>;
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    },
  },
});
obj.moveBy(5, 5); // obj.x и obj.y обновятся
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsTeUYsXWvk0v22NFfcytxS" deck='T_typescript_utility_types' --> 

4.1 Вопрос: "Как различаются `ThisParameterType` и `OmitThisParameter`?" :: 
4.2 Ответ: "`ThisParameterType` извлекает тип `this` из функции, в то время как `OmitThisParameter` удаляет параметр `this` из функции." 
Пример кода:
```typescript
function withThis(this: { name: string }) {
  return this.name;
}

type ThisType = ThisParameterType<typeof withThis>; // { name: string }
type NoThisType = OmitThisParameter<typeof withThis>; // () => string
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsapoMHTHnCz5hGLJJLj8cM" deck='T_typescript_utility_types' --> 

5.1 Вопрос: "Как встроенные типы манипуляции со строками в TypeScript, такие как `Uppercase`, `Lowercase`, `Capitalize`, и `Uncapitalize`, помогают при работе со строками?" :: 
5.2 Ответ: "Эти типы позволяют трансформировать строковые литералы в определённые форматы без необходимости создавать дополнительные функции." 
Пример кода:
```typescript
type UpperCaseExample = Uppercase<"hello world">; // "HELLO WORLD"
type LowerCaseExample = Lowercase<"HELLO WORLD">; // "hello world"
type CapitalizeExample = Capitalize<"hello world">; // "Hello world"
type UncapitalizeExample = Uncapitalize<"Hello World">; // "hello World"
```
<!-- basicblock-end --> 

Это должен быть полный набор вопросов и примеров кода по заданным темам.

# 1. **Функция `filterCollection`**:
<!-- basicblock-start oid="ObsAZbjZE5quKQjubMRFHm0e"  deck='T_typescript_utility_types' -->
1. **Функция `filterCollection`**:::

   - Эта функция принимает массив `collection` и метод `filterMethod`, который принимает элемент типа `NoInfer<T>`. Это предотвращает неявный вывод и гарантирует, что метод фильтрации работает только с типами, определенными для элементов коллекции.

2. **Правильный вызов**:
   - Мы можем корректно фильтровать массив чисел, получая только четные числа.

3. **Неправильный вызов**:
   - Если мы пытаемся сравнить элемент с строковым значением, TypeScript выдаст ошибку, так как `item` имеет тип `number`, и это предотвращает ошибки типизации.

### Заключение

Использование `NoInfer<Type>` в этих сложных сценариях помогает контролировать вывод типов и предотвращает потенциальные ошибки, улучшая надежность и читаемость кода. Это особенно полезно в библиотеках и крупных проектах, где требуется строгая типизация и ясные контракты между функциями и их параметрами.
<!-- basicblock-end -->




#T_typescript_utility_types
#typescript_utility_types

#telegram 

# покажи сложный сценарий применения NoInfer?
<!-- basicblock-start oid="ObsbJYDBt3HhRu4xPpe7fBlC"  deck='T_typescript_utility_types' -->
покажи сложный сценарий применения NoInfer?::


Конечно! Давайте рассмотрим более сложный сценарий использования `NoInfer<Type>` в TypeScript, чтобы продемонстрировать, как его можно применять для контроля типов и предотвращения неявного вывода.

### Сложный сценарий: Класс с динамическими свойствами

Предположим, что мы разрабатываем систему, в которой есть класс `Config`, принимающий настройки и предоставляющий методы для получения этих настроек. Мы хотим, чтобы свойства конфигурации могли быть заданы динамически, а также чтобы типы этих свойств не выводились автоматически, чтобы избежать ошибок.

Вот пример, как это можно реализовать:

```
type ConfigOptions = {
  [key: string]: string | number | boolean;
};

class Config<T extends ConfigOptions> {
  private options: T;

  constructor(options: T) {
    this.options = options;
  }

  // Метод для получения значения настройки
  getOption<K extends keyof T>(key: K): NoInfer<T[K]> {
    return this.options[key];
  }
}

// Создание конфигурации
const myConfig = new Config({
  apiUrl: "https://api.example.com",
  timeout: 3000,
  useCache: true,
});

// Правильный вызов
const apiUrl = myConfig.getOption("apiUrl"); // string
const timeout = myConfig.getOption("timeout"); // number
const useCache = myConfig.getOption("useCache"); // boolean

// Неправильный вызов
const invalidOption = myConfig.getOption("nonExistentOption"); // Ошибка: Argument of type '"nonExistentOption"' is not assignable to parameter of type 'keyof T'.
```

### Объяснение

1. **Тип `ConfigOptions`**:
   - Мы определили тип `ConfigOptions`, который представляет собой объект, где ключами являются строки, а значениями — строки, числа или логические значения.

2. **Класс `Config`**:
   - Класс `Config` принимает параметр типа `T`, который расширяет `ConfigOptions`. Он хранит переданные параметры в приватном свойстве `options`.

3. **Метод `getOption`**:
   - Метод `getOption` принимает ключ `key` и возвращает значение, связанное с этим ключом. Использование `NoInfer<T[K]>` позволяет предотвратить неявный вывод типа значения, связанного с ключом, обеспечивая, что мы получаем строго типизированное значение.

4. **Создание экземпляра `Config`**:
   - Мы создаем экземпляр `Config`, передавая объект с тремя свойствами: `apiUrl`, `timeout`, и `useCache`.

5. **Правильные вызовы**:
   - Мы можем корректно получить значения по ключам, передавая допустимые ключи. TypeScript правильно выводит типы для этих значений.

6. **Неправильный вызов**:
   - Если мы пытаемся получить значение по ключу `nonExistentOption`, TypeScript выдаст ошибку, так как это ключ не существует в объекте настроек. Это предотвращает ошибки, связанные с попыткой доступа к несуществующим свойствам.

### Применение `NoInfer` в этом сценарии

Использование `NoInfer` в методе `getOption` позволяет нам избежать ситуации, когда TypeScript автоматически выводит тип возвращаемого значения, что может привести к нежелательным последствиям, если, например, ключ был бы динамически определен. Это обеспечивает более строгую типизацию и предотвращает ошибки в коде.

### Дополнительный пример: Работа с функциями

Чтобы показать другой подход, предположим, что мы разрабатываем функцию, которая принимает коллекцию и метод для фильтрации этой коллекции. Мы хотим убедиться, что метод фильтрации точно соответствует типу элементов в коллекции.

```
function filterCollection<T>(
  collection: T[],
  filterMethod: (item: NoInfer<T>) => boolean
): T[] {
  return collection.filter(filterMethod);
}

// Пример использования
const numbers = [1, 2, 3, 4, 5];

// Правильный вызов
const evenNumbers = filterCollection(numbers, (num) => num % 2 === 0); // [2, 4]

// Неправильный вызов
const filteredStrings = filterCollection(numbers, (item) => {
  // Ошибка: Argument of type 'NoInfer<number>' is not assignable to parameter of type 'string'.
  return item === "2"; // здесь 'item' типизирован как 'number'
});
```

### Объяснение
<!-- basicblock-end -->




#T_typescript_utility_types
#typescript_utility_types

#telegram 

# Для чего используется утилита noinfer?
<!-- basicblock-start oid="ObsiXwr0l5TNaOFC22y3zmRz"  deck='T_typescript_utility_types' -->
Для чего используется утилита noinfer?::


Утилита `NoInfer<Type>` в TypeScript была введена в версии 5.4 и используется для блокировки вывода типов внутри обобщений. Это позволяет указать, что определенный тип не должен выводиться автоматически, что может быть полезно для предотвращения ошибок типизации в определенных контекстах.

### `NoInfer<Type>`

`NoInfer<Type>` используется для предотвращения неявного вывода типа в ситуациях, когда это может привести к нежелательным последствиям. В остальном он функционирует так же, как и `Type`.

### Пример использования

Рассмотрим пример использования `NoInfer` в функции:

```
function createStreetLight<C extends string>(
  colors: C[],
  defaultColor?: NoInfer<C>,
) {
  // Внутри функции можно использовать colors и defaultColor
  console.log(`Available colors: ${colors.join(", ")}`);
  console.log(`Default color: ${defaultColor}`);
}

// Примеры вызовов функции

// Вызов с допустимым значением
createStreetLight(["red", "yellow", "green"], "red");  // OK

// Вызов с недопустимым значением
createStreetLight(["red", "yellow", "green"], "blue");  // Error: Argument of type '"blue"' is not assignable to parameter of type 'NoInfer<"red" | "yellow" | "green">'.
```

### Подробное объяснение примера

1. **Определение функции**:
   - Функция `createStreetLight` принимает два параметра: `colors`, который является массивом строк, и `defaultColor`, который имеет тип `NoInfer<C>`. Это означает, что `defaultColor` должен быть одним из строковых значений, которые передаются в `colors`, но его тип не будет автоматически выведен.

2. **Вызов функции**:
   - При вызове функции с аргументами `["red", "yellow", "green"]` и `"red"` все корректно, так как `"red"` входит в массив `colors`.
   - Однако вызов функции с `"blue"` вызывает ошибку, так как `"blue"` не является допустимым значением в типе `C`, который определяется на основании переданных значений массива `colors`.

### Применение `NoInfer`

Использование `NoInfer` полезно в следующих ситуациях:

- **Предотвращение неявного вывода**: Когда вы хотите четко указать, что параметр должен принимать только те значения, которые явно указаны, а не выводимые автоматически.

- **Сложные типы и обобщения**: В случаях, когда вы работаете с сложными обобщениями, `NoInfer` позволяет избежать ситуаций, когда TypeScript может неправильно вывести тип.

- **Создание API и библиотек**: При проектировании интерфейсов и библиотек важно контролировать типы, чтобы избежать неправильного использования и повысить надежность кода.

### Заключение

Утилита `NoInfer<Type>` предоставляет разработчикам возможность контролировать вывод типов в TypeScript, что особенно полезно в сложных и обобщенных контекстах. Это помогает избежать потенциальных ошибок и обеспечивает более строгую типизацию.
<!-- basicblock-end -->




#T_typescript_utility_types
#typescript_utility_types

#telegram 

# Что делает Утилита InstanceType<Type> в TypeScript?
<!-- basicblock-start oid="Obsn4YwbWa8Mf5DHHLpQH38b"  deck='T_typescript_utility_types' -->
Что делает Утилита InstanceType<Type> в TypeScript?::


Утилита `InstanceType<Type>` в TypeScript позволяет извлекать тип экземпляра конструктора, указанного в `Type`. Это полезно, когда вы хотите работать с типами экземпляров классов и обеспечить корректную типизацию при создании или использовании объектов.

### `InstanceType<Type>`

`InstanceType<Type>` создает тип, который соответствует экземпляру конструктора, определенного в `Type`.

- **`Type`** — это тип конструктора, из которого вы хотите извлечь экземпляр.

### Примеры использования

Рассмотрим различные примеры использования `InstanceType`:

```
// Пример 1: Класс с свойствами
class C {
  x = 0;
  y = 0;
}

// Пример 2: Извлечение типа экземпляра класса
type T0 = InstanceType<typeof C>;
// T0 = C

// Пример 3: Тип с any
type T1 = InstanceType<any>;
// T1 = any

// Пример 4: Тип never
type T2 = InstanceType<never>;
// T2 = never

// Пример 5: Некорректный тип
type T3 = InstanceType<string>; 
// Ошибка, так как string не является конструктором

// Пример 6: Тип Function
type T4 = InstanceType<Function>; 
// Ошибка, так как Function не соответствует сигнатуре конструктора
```

### Подробное объяснение примеров

1. **Класс `C`**:
   - В этом примере класс `C` имеет два свойства: `x` и `y`. Используя `InstanceType<typeof C>`, мы получаем тип `C`, который соответствует экземплярам этого класса.

2. **Тип с `any`**:
   - `InstanceType<any>` возвращает `any`, так как тип `any` может быть любым, включая конструкции классов.

3. **Тип `never`**:
   - `InstanceType<never>` возвращает `never`, так как `never` не имеет экземпляров.

4. **Некорректный тип**:
   - `InstanceType<string>` вызывает ошибку, так как `string` не является конструкцией класса или конструктора.

5. **Тип `Function`**:
   - `InstanceType<Function>` также вызывает ошибку, так как `Function` не соответствует сигнатуре конструктора, которая требует наличия метода `new`.

### Применение

Утилита `InstanceType` полезна в следующих ситуациях:

- **Работа с экземплярами классов**: Удобно использовать `InstanceType`, чтобы обеспечить типизацию при создании экземпляров классов.

- **Создание оберток для классов**: Если вы создаете функции или классы, которые принимают конструкторы, `InstanceType` позволяет легко извлекать и использовать типы экземпляров.

- **Типизация библиотек**: При работе с библиотеками, которые предоставляют классы, вы можете извлекать и использовать их экземпляры в своем коде.

### Заключение

Утилита `InstanceType<Type>` — это мощный инструмент в TypeScript, позволяющий извлекать типы экземпляров из классов, что делает работу с типами более удобной и безопасной. Это особенно полезно в больших проектах и при работе с сложными структурами типов.
<!-- basicblock-end -->




#T_typescript_utility_types
#typescript_utility_types

#telegram 

# Что делает утилита `ReturnType<Type>` в TypeScript позволяет извлекать тип возвращаемого значения из заданного функционального типа. Это полезно, когда нужно работать с результатами функций и гарантировать правильные типы при использовании их возвращаемых значений.
<!-- basicblock-start oid="Obs2d117pAHVxslh7ybM3n8v"  deck='T_typescript_utility_types' -->
Что делает утилита `ReturnType<Type>` в TypeScript позволяет извлекать тип возвращаемого значения из заданного функционального типа. Это полезно, когда нужно работать с результатами функций и гарантировать правильные типы при использовании их возвращаемых значений.::


### `ReturnType<Type>`

`ReturnType<Type>` создает тип, состоящий из возвращаемого типа функции, указанной в `Type`.

- **`Type`** — это тип функции, из которого вы хотите извлечь возвращаемый тип.

### Примеры использования

Рассмотрим различные примеры использования `ReturnType`:

```
// Пример 1: Функция, возвращающая объект
declare function f1(): { a: number; b: string };

// Пример 2: Возвращаемый тип функции без параметров
type T0 = ReturnType<() => string>;
// T0 = string

// Пример 3: Возвращаемый тип функции с одним параметром
type T1 = ReturnType<(s: string) => void>;
// T1 = void

// Пример 4: Возвращаемый тип функции с обобщенным параметром
type T2 = ReturnType<<T>() => T>;
// T2 = unknown

// Пример 5: Возвращаемый тип функции с обобщениями
type T3 = ReturnType<<T extends U, U extends number[]>() => T>;
// T3 = number[]

// Пример 6: Возвращаемый тип перегруженной функции
type T4 = ReturnType<typeof f1>;
// T4 = { a: number; b: string }

// Пример 7: Возвращаемый тип с типом any
type T5 = ReturnType<any>;
// T5 = any

// Пример 8: Возвращаемый тип с типом never
type T6 = ReturnType<never>;
// T6 = never

// Пример 9: Возвращаемый тип некорректного типа
type T7 = ReturnType<string>; // Ошибка, так как string не является функцией

// Пример 10: Возвращаемый тип для типа Function
type T8 = ReturnType<Function>; // Ошибка, так как Function не соответствует сигнатуре функции
```

### Подробное объяснение примеров

1. **Возвращаемый тип функции `f1`**:
   - `ReturnType<typeof f1>` извлекает возвращаемый тип функции `f1`, который в данном случае является объектом с полями `a` и `b`. Результат — `{ a: number; b: string }`.

2. **Функция без параметров**:
   - `ReturnType<() => string>` извлекает возвращаемый тип из функции, которая возвращает строку. Результат — `string`.

3. **Функция с одним параметром**:
   - `ReturnType<(s: string) => void>` возвращает `void`, так как функция не возвращает значения.

4. **Функция с обобщенными параметрами**:
   - `ReturnType<<T>() => T>` возвращает `unknown`, поскольку тип возвращаемого значения не определен явно.

5. **Функция с обобщениями и массивами**:
   - `ReturnType<<T extends U, U extends number[]>() => T>` возвращает `number[]`, так как возвращаемый тип определен как массив чисел.

6. **Параметры функции с типом any**:
   - `ReturnType<any>` возвращает `any`, потому что результат функции может быть любым типом.

7. **Параметры функции с типом never**:
   - `ReturnType<never>` возвращает `never`, так как `never` не имеет возвращаемого значения.

8. **Некорректный тип**:
   - `ReturnType<string>` вызывает ошибку, так как `string` не является функцией.

9. **Тип Function**:
   - `ReturnType<Function>` также вызывает ошибку, так как `Function` не соответствует сигнатуре функции.

### Применение

Утилита `ReturnType` полезна в следующих ситуациях:

- **Создание оберток для функций**: Вы можете использовать извлеченные возвращаемые типы для создания оберток вокруг существующих функций.
  
- **Типизация возвращаемых значений**: `ReturnType` помогает обеспечить корректную типизацию возвращаемых значений, что повышает безопасность кода.

- **Работа с библиотеками**: При использовании сторонних библиотек вы можете легко извлекать возвращаемые типы функций и использовать их в своем коде.

### Заключение

Утилита `ReturnType<Type>` — это мощный инструмент в TypeScript, позволяющий извлекать возвращаемые типы из функций, что делает работу с типами более удобной и безопасной. Это особенно полезно в больших проектах и при работе с сложными структурами типов.
<!-- basicblock-end -->




#T_typescript_utility_types
#typescript_utility_types

#telegram 

# Что делает Утилита `ConstructorParameters<Type>` в TypeScript ?
<!-- basicblock-start oid="ObsFiHH9gfGbLtVX7c9yZZrR"  deck='T_typescript_utility_types' -->
Что делает Утилита `ConstructorParameters<Type>` в TypeScript ?::


позволяет извлекать типы параметров конструктора из заданного функционального типа, представляющего конструктор. Она возвращает кортежный тип, содержащий типы параметров конструктора, или `never`, если тип не является конструктором.

### `ConstructorParameters<Type>`

`ConstructorParameters<Type>` создает кортежный тип из типов параметров конструктора, определенного в `Type`.

- **`Type`** — это тип конструктора, из которого вы хотите извлечь параметры.

### Примеры использования

Рассмотрим различные примеры использования `ConstructorParameters`:

```
// Пример 1: Параметры конструктора Error
type T0 = ConstructorParameters<ErrorConstructor>;
// T0 = [message?: string]

// Пример 2: Параметры конструктора Function
type T1 = ConstructorParameters<FunctionConstructor>;
// T1 = string[]

// Пример 3: Параметры конструктора RegExp
type T2 = ConstructorParameters<RegExpConstructor>;
// T2 = [pattern: string | RegExp, flags?: string]

// Пример 4: Параметры конструктора пользовательского класса
class C {
  constructor(a: number, b: string) {}
}
type T3 = ConstructorParameters<typeof C>;
// T3 = [a: number, b: string]

// Пример 5: Параметры конструктора с типом any
type T4 = ConstructorParameters<any>;
// T4 = unknown[]

// Пример 6: Параметры некорректного типа
type T5 = ConstructorParameters<Function>; 
// Ошибка, так как Function не является конструктором
```

### Подробное объяснение примеров

1. **Параметры конструктора `Error`**:
   - `ConstructorParameters<ErrorConstructor>` извлекает параметры конструктора стандартного объекта `Error`. Параметры состоят из одного необязательного параметра `message`, что соответствует типу `[message?: string]`.

2. **Параметры конструктора `Function`**:
   - `ConstructorParameters<FunctionConstructor>` возвращает `string[]`, так как конструктор `Function` принимает переменное количество аргументов типа `string`.

3. **Параметры конструктора `RegExp`**:
   - `ConstructorParameters<RegExpConstructor>` извлекает параметры конструктора для создания регулярного выражения. Это соответствует типу `[pattern: string | RegExp, flags?: string]`, где `pattern` — обязательный параметр, а `flags` — необязательный.

4. **Параметры конструктора пользовательского класса**:
   - В классе `C` есть конструктор, который принимает два параметра: `a` и `b`. Используя `ConstructorParameters<typeof C>`, мы получаем кортеж `[a: number, b: string]`, который представляет типы параметров конструктора класса `C`.

5. **Параметры с типом any**:
   - `ConstructorParameters<any>` возвращает `unknown[]`, потому что `any` может быть любым типом, включая конструктора.

6. **Некорректный тип**:
   - `ConstructorParameters<Function>` вызывает ошибку, так как `Function` не соответствует требованиям, необходимым для конструктора. Она должна соответствовать сигнатуре `abstract new (...args: any) => any`.

### Применение

Утилита `ConstructorParameters` полезна в следующих ситуациях:

- **Создание оберток для конструкторов**: Вы можете использовать извлеченные параметры конструктора для создания оберток вокруг существующих конструкторов.
  
- **Работа с библиотеками**: Если вы работаете с библиотеками, которые предоставляют конструкторы, `ConstructorParameters` позволяет вам легко извлекать и использовать параметры этих конструкторов.

- **Упрощение работы с классами**: При создании новых классов, которые используют существующие, `ConstructorParameters` позволяет автоматически определять параметры, что снижает вероятность ошибок.

### Заключение

Утилита `ConstructorParameters<Type>` — это мощный инструмент в TypeScript, позволяющий извлекать параметры из конструкторов, что делает работу с типами более удобной и безопасной. Это особенно полезно в больших проектах и при работе с сложными структурами типов.
<!-- basicblock-end -->




#T_typescript_utility_types
#typescript_utility_types

#telegram 

# Что делает Утилита Parameters<Type>?
<!-- basicblock-start oid="ObsirtHjBigQ4aWMuVOEc8A4"  deck='T_typescript_utility_types' -->
Что делает Утилита Parameters<Type>?::


Утилита `Parameters<Type>` в TypeScript позволяет извлечь типы параметров из функциональных типов. Это может быть полезно, когда вам нужно работать с аргументами функции, особенно в случаях, когда функции перегружены или используются обобщенные параметры.

### `Parameters<Type>`

`Parameters<Type>` создает кортежный тип, состоящий из типов параметров функции, определенной в `Type`.

- **`Type`** — это функциональный тип, из которого вы хотите извлечь параметры.

### Примеры использования

Рассмотрим различные примеры использования `Parameters`:

```
// Пример 1: Функция без параметров
type T0 = Parameters<() => string>;
// T0 = []

// Пример 2: Функция с одним параметром
type T1 = Parameters<(s: string) => void>;
// T1 = [s: string]

// Пример 3: Функция с обобщенными параметрами
type T2 = Parameters<<T>(arg: T) => T>;
// T2 = [arg: unknown]

// Пример 4: Перегруженная функция
declare function f1(arg: { a: number; b: string }): void;
type T3 = Parameters<typeof f1>;
// T3 = [arg: { a: number; b: string }]

// Пример 5: Параметры функции с типом any
type T4 = Parameters<any>;
// T4 = unknown[]

// Пример 6: Параметры функции с типом never
type T5 = Parameters<never>;
// T5 = never

// Пример 7: Параметры некорректного типа
type T6 = Parameters<string>; // Ошибка, так как string не является функцией

// Пример 8: Параметры типа Function
type T7 = Parameters<Function>; // Ошибка, так как Function не соответствует сигнатуре функции
```

### Подробное объяснение примеров

1. **Функция без параметров**:
   - `Parameters<() => string>` извлекает параметры функции, и поскольку у нее нет параметров, результатом будет пустой массив (`[]`).

2. **Функция с одним параметром**:
   - `Parameters<(s: string) => void>` извлекает параметры из функции, у которой есть один параметр `s` типа `string`. Результат — кортеж, содержащий тип `string`.

3. **Функция с обобщенными параметрами**:
   - `Parameters<<T>(arg: T) => T>` возвращает кортеж с одним элементом, который имеет тип `unknown`. Это происходит потому, что параметр `T` может быть любым типом.

4. **Перегруженная функция**:
   - В случае с `f1`, параметры извлекаются из последней перегрузки функции. Поскольку у `f1` есть только одна сигнатура, результатом будет кортеж, содержащий объект с полями `a` и `b`.

5. **Параметры функции с типом any**:
   - `Parameters<any>` возвращает `unknown[]`, потому что `any` может быть любым типом.

6. **Параметры функции с типом never**:
   - `Parameters<never>` возвращает `never`, потому что у `never` нет параметров.

7. **Некорректный тип**:
   - `Parameters<string>` вызывает ошибку, так как `string` не является функцией. Точно так же `Parameters<Function>` также вызывает ошибку, поскольку `Function` не соответствует сигнатуре функции.

### Применение

Утилита `Parameters` полезна, когда вам нужно:

- Создавать обертки для функций и сохранять их параметры.
- Извлекать и переиспользовать параметры других функций.
- Работать с перегрузками функций, где требуется учитывать последний набор параметров.

### Заключение

Утилита `Parameters<Type>` — это мощный инструмент в TypeScript, который позволяет извлекать параметры из функциональных типов, упрощая работу с функциями и обеспечивая строгую типизацию. Это особенно полезно в больших проектах, где типы функций могут быть сложными и разнообразными.
<!-- basicblock-end -->




#T_typescript_utility_types
#typescript_utility_types

#telegram 

# Что делает утилита `NonNullable<Type>` в TypeScript?
<!-- basicblock-start oid="ObsfZsCNm5caseZBJD8XBfxT"  deck='T_typescript_utility_types' -->
Что делает утилита `NonNullable<Type>` в TypeScript?::


 создает новый тип, исключая `null` и `undefined` из указанного типа `Type`. Это полезно, когда нужно гарантировать, что значения не будут равны `null` или `undefined`.

### `NonNullable<Type>`

`NonNullable<Type>` формирует тип, исключая любые значения, которые могут быть `null` или `undefined`.

- **`Type`** — исходный тип, из которого удаляются `null` и `undefined`.

#### Примеры использования

Примеры показывают, как `NonNullable` убирает `null` и `undefined` из объединений типов:

```
// Исключаем undefined из объединения string | number | undefined
type T0 = NonNullable<string | number | undefined>;
// T0 = string | number

// Исключаем null и undefined из объединения string[] | null | undefined
type T1 = NonNullable<string[] | null | undefined>;
// T1 = string[]
```

### Заключение

- **`NonNullable<Type>`** — утилита TypeScript, создающая тип, исключающий `null` и `undefined` из `Type`.
- Полезна для создания типов, в которых гарантированно отсутствуют `null` и `undefined`, что снижает вероятность ошибок, связанных с этими значениями.

Давайте рассмотрим более подробный пример использования утилиты `NonNullable<Type>` в TypeScript, а также объясним, как она может быть полезной в различных ситуациях.

### Пример использования `NonNullable<Type>`

Предположим, у нас есть интерфейс, который описывает пользователя и может содержать некоторые поля, которые могут быть не определены (например, при получении данных из API). Мы хотим создать функцию, которая принимает пользователя и гарантирует, что все значения полей являются ненулевыми.

```
interface User {
  id: number;
  name: string | null;          // имя может быть null
  email: string | undefined;    // email может быть undefined
  age?: number;                 // возраст может быть не указан (optional)
}

type NonNullableUser = {
  [K in keyof User]: NonNullable<User[K]>;
};

// Теперь NonNullableUser гарантирует, что все поля не могут быть null или undefined
const user: NonNullableUser = {
  id: 1,
  name: "Alice",  // теперь name обязательно
  email: "alice@example.com", // теперь email обязательно
  age: 30, // age все еще может быть не указан, так как это optional
};

// Функция, принимающая пользователя
function printUser(user: NonNullableUser): void {
  console.log(`User ID: ${user.id}`);
  console.log(`Name: ${user.name}`);
  console.log(`Email: ${user.email}`);
  if (user.age !== undefined) {
    console.log(`Age: ${user.age}`);
  }
}

// Вызов функции с корректными данными
printUser(user);
```

### Объяснение кода

1. **Интерфейс User**: Определяет тип пользователя, где поля `name` и `email` могут быть `null` или `undefined`. Поле `age` является необязательным.
  
2. **Тип NonNullableUser**: Использует mapped types и утилиту `NonNullable`, чтобы создать новый тип, в котором все свойства из `User` становятся ненулевыми. Это гарантирует, что в `NonNullableUser` поля `name` и `email` не могут быть `null` или `undefined`.

3. **Создание объекта user**: Мы создаем объект `user`, который соответствует типу `NonNullableUser`, что позволяет избежать ошибок на этапе компиляции.

4. **Функция printUser**: Эта функция принимает объект `NonNullableUser` и безопасно выводит информацию о пользователе. Поскольку `name` и `email` теперь гарантированно определены, мы можем обращаться к ним без дополнительных проверок на `null` и `undefined`.

### Преимущества использования `NonNullable<Type>`

- **Устойчивость к ошибкам**: Использование `NonNullable` позволяет избежать ошибок, связанных с попытками доступа к значениям `null` или `undefined`, что делает код более безопасным и надежным.
  
- **Четкая типизация**: Гарантия отсутствия `null` и `undefined` помогает упростить логику кода, так как вы можете быть уверены, что значения существуют.

- **Улучшенная документация**: Код становится более понятным, так как разработчики могут видеть, что ожидаются только ненулевые значения, что упрощает сопровождение и использование.

### Заключение

Использование `NonNullable<Type>` позволяет вам более точно описывать свои типы, исключая ненужные значения и делая код более надежным и устойчивым к ошибкам.
<!-- basicblock-end -->




#T_typescript_utility_types
#typescript_utility_types

#telegram 

# Что делает Утилита Extract<Type, Union>?
<!-- basicblock-start oid="ObsZfLaXT7xC0Qa1ld9G7VN4"  deck='T_typescript_utility_types' -->
Что делает Утилита Extract<Type, Union>?::


Утилита `Extract<Type, Union>` в TypeScript создает новый тип, извлекая из `Type` те члены объединения, которые могут быть присвоены `Union`. Эта утилита является противоположностью `Exclude` и позволяет выделить только те части типа, которые соответствуют определенному условию.

### `Extract<Type, Union>`

`Extract<Type, Union>` создает тип, содержащий все члены `Type`, которые можно присвоить `Union`.

- **`Type`** — исходное объединение типов, из которого будут извлечены члены.
- **`Union`** — объединение типов, которые нужно извлечь из `Type`.

#### Примеры использования

Примеры показывают, как использовать `Extract` для извлечения нужных членов объединения:

```
// Извлекаем только "a" из объединения "a" | "b" | "c", если он есть в "a" | "f"
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
// T0 = "a"

// Извлекаем функцию из объединения string | number | (() => void)
type T1 = Extract<string | number | (() => void), Function>;
// T1 = () => void
```

#### Пример с объектными типами

`Extract` также полезен для работы с объектными типами, когда необходимо выделить определенные типы объектов из объединения:

```
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };

// Извлекаем объект с kind: "circle" из объединения Shape
type T2 = Extract<Shape, { kind: "circle" }>;
// T2 = { kind: "circle"; radius: number }
```

В этом примере:
1. `Shape` — объединенный тип, представляющий несколько форм (круг, квадрат и треугольник).
2. `T2` создается с помощью `Extract`, извлекая только объект `{ kind: "circle"; radius: number }` из объединения `Shape`.

### Заключение

- **`Extract<Type, Union>`** — утилита TypeScript, создающая тип, содержащий только те члены объединения `Type`, которые соответствуют объединению `Union`.
- Полезна, когда нужно выделить определенные члены из объединения типов, не затрагивая остальные.
<!-- basicblock-end -->




#T_typescript_utility_types
#typescript_utility_types

#telegram 

# Что делает утилита Exclude<UnionType, ExcludedMembers> ?
<!-- basicblock-start oid="ObsQ8xh8xdeR5v37aiznEKKc"  deck='T_typescript_utility_types' -->
Что делает утилита Exclude<UnionType, ExcludedMembers> ?::


Утилита `Exclude<UnionType, ExcludedMembers>` в TypeScript создает новый тип, исключая из объединения `UnionType` те члены, которые могут быть присвоены `ExcludedMembers`. Это полезно, когда нужно исключить определенные варианты из объединенного типа.

### `Exclude<UnionType, ExcludedMembers>`

`Exclude<UnionType, ExcludedMembers>` формирует тип, состоящий из всех членов `UnionType`, которые не могут быть присвоены `ExcludedMembers`. 

- **`UnionType`** — это объединение типов, из которого нужно исключить определенные члены.
- **`ExcludedMembers`** — типы, которые будут исключены из `UnionType`.

#### Примеры использования

Примеры показывают различные сценарии использования `Exclude`:

```
// Исключаем строковый литерал "a" из объединения "a" | "b" | "c"
type T0 = Exclude<"a" | "b" | "c", "a">;
// T0 = "b" | "c"

// Исключаем строковые литералы "a" и "b" из объединения "a" | "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
// T1 = "c"

// Исключаем тип Function из объединения string | number | (() => void)
type T2 = Exclude<string | number | (() => void), Function>;
// T2 = string | number
```

#### Пример с объектными типами

`Exclude` также полезен для работы с объектными типами, когда необходимо исключить конкретные типы объектов из объединения:

```
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };

// Исключаем объект с kind: "circle" из объединения Shape
type T3 = Exclude<Shape, { kind: "circle" }>;
// T3 = {
//     kind: "square";
//     x: number;
//   } | {
//     kind: "triangle";
//     x: number;
//     y: number;
//   }
```

В этом примере:
1. `Shape` — объединенный тип, представляющий несколько форм (круг, квадрат и треугольник).
2. `T3` создается с помощью `Exclude`, исключая объект `{ kind: "circle"; radius: number }` из объединения `Shape`, оставляя только квадрат и треугольник.

### Заключение

- **`Exclude<UnionType, ExcludedMembers>`** — утилита TypeScript, создающая тип, исключающий из объединения `UnionType` все члены, которые могут быть присвоены `ExcludedMembers`.
- Полезна для работы с объединенными типами, когда нужно убрать определенные члены, не влияя на другие.
<!-- basicblock-end -->




#T_typescript_utility_types
#typescript_utility_types

#telegram 

# Что можно сказать про Omit<Type, Keys>?
<!-- basicblock-start oid="Obs4dlGdJRpzmVP8vHSmbsaM"  deck='T_typescript_utility_types' -->
Что можно сказать про Omit<Type, Keys>?::


Утилита `Omit<Type, Keys>` в TypeScript создает новый тип, который включает все свойства из исходного типа `Type`, за исключением тех, что указаны в `Keys`. Это противоположность утилите `Pick`, которая выбирает только определенные свойства.

### `Omit<Type, Keys>`

`Omit<Type, Keys>` создает новый тип, состоящий из всех свойств исходного типа, кроме тех, что перечислены в `Keys` (строковый литерал или объединение строковых литералов).

- **`Type`** — исходный тип, из которого будут исключены свойства.
- **`Keys`** — набор свойств (в виде строк), которые нужно исключить из исходного типа.

#### Пример использования

Пример работы `Omit<Type, Keys>` на основе интерфейса `Todo`:

```
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Убрать комнату",
  completed: false,
  createdAt: 1615544252770,
};

todo; // { title: "Убрать комнату", completed: false, createdAt: 1615544252770 }

type TodoInfo = Omit<Todo, "completed" | "createdAt">;

const todoInfo: TodoInfo = {
  title: "Забрать детей",
  description: "Детский сад закрывается в 5 вечера",
};

todoInfo; // { title: "Забрать детей", description: "Детский сад закрывается в 5 вечера" }
```

В этом примере:
1. `Todo` — исходный интерфейс, содержащий четыре свойства: `title`, `description`, `completed` и `createdAt`.
2. `TodoPreview` создается с помощью `Omit`, исключая свойство `description`. Новый тип `TodoPreview` включает только `title`, `completed`, и `createdAt`.
3. `TodoInfo` создается с использованием `Omit` для исключения `completed` и `createdAt`, оставляя только `title` и `description`.

### Заключение

- **`Omit<Type, Keys>`** — утилита TypeScript, которая позволяет создать новый тип с подмножеством свойств, исключая из исходного типа `Type` указанные в `Keys`.
- Полезна, когда нужно создать тип, включающий большинство свойств исходного типа, но исключающий определенные ненужные.
<!-- basicblock-end -->




#T_typescript_utility_types
#typescript_utility_types

#telegram 

# Что можно сказать про Pick<Keys, Type>?
<!-- basicblock-start oid="Obs4yxwNv7UuTosEPCjetmVZ"  deck='T_typescript_utility_types' -->
Что можно сказать про Pick<Keys, Type>?::


Утилита `Pick<Type, Keys>` в TypeScript позволяет создать новый тип, который включает только указанные свойства из существующего типа. Это полезно, когда нужно выбрать определенные свойства и сформировать новый тип на их основе.

### `Pick<Type, Keys>`

Утилита `Pick<Type, Keys>` создает новый тип, состоящий только из тех свойств, которые перечислены в `Keys` (это строковый литерал или объединение строковых литералов).

- **`Type`** — исходный тип, из которого выбираются свойства.
- **`Keys`** — набор свойств (в виде строк), которые нужно выбрать из исходного типа.

#### Пример использования

Вот как работает `Pick<Type, Keys>` в реальной ситуации:

```
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Убрать комнату",
  completed: false,
};

todo; // { title: "Убрать комнату", completed: false }
```

В этом примере:
1. `Todo` — это исходный интерфейс с тремя свойствами: `title`, `description` и `completed`.
2. `TodoPreview` создается с помощью `Pick`, и он включает только свойства `title` и `completed` из исходного интерфейса `Todo`.
3. Объект `todo` имеет только свойства `title` и `completed`, так как `description` был исключен.

### Заключение

- **`Pick<Type, Keys>`** — утилита TypeScript, создающая новый тип с подмножеством свойств исходного типа `Type`, указанных в `Keys`.
- Удобна, когда нужно создать тип, включающий только выбранные свойства из другого типа, не затрагивая остальную структуру.
<!-- basicblock-end -->




#T_typescript_utility_types
#typescript_utility_types

#telegram 

# Что можно сказать про утилиту Record<Keys, Type>?
<!-- basicblock-start oid="Obs7P8lauMyYxhh0e0GFD3Kr"  deck='T_typescript_utility_types' -->
Что можно сказать про утилиту Record<Keys, Type>?::


Утилита `Record<Keys, Type>` в TypeScript позволяет создавать объектный тип, в котором ключи свойств определяются типом `Keys`, а значения этих свойств имеют тип `Type`. Эта утилита полезна, когда нужно сопоставить определенные свойства одного типа с другим типом.

### `Record<Keys, Type>`

Использование `Record<Keys, Type>` создает тип, где:
- **`Keys`** — это набор имен ключей, который будет использоваться в объекте.
- **`Type`** — это тип значений для каждого из ключей.

#### Пример использования

В следующем примере `Record` создает объект, описывающий информацию о кошках с использованием определенного набора имен:

```
type CatName = "miffy" | "boris" | "mordred";

interface CatInfo {
  age: number;
  breed: string;
}

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};

cats.boris; // { age: 5, breed: "Maine Coon" }
```

В этом примере:
1. `CatName` — это объединение (`union`) строковых литералов, представляющих имена кошек.
2. `CatInfo` — интерфейс, определяющий свойства объекта, содержащего информацию о кошках.
3. `Record<CatName, CatInfo>` создает объектный тип, где каждый ключ из `CatName` (`miffy`, `boris`, `mordred`) сопоставлен с типом значений `CatInfo`.

Таким образом, `Record<CatName, CatInfo>` позволяет типу `cats` содержать только свойства с именами, указанными в `CatName`, и каждое из этих свойств будет иметь значение типа `CatInfo`.

### Заключение

- **`Record<Keys, Type>`** — это утилита TypeScript, создающая объектный тип, где свойства имеют ключи из `Keys` и значения типа `Type`.
- Полезно для создания типов, в которых нужно сопоставить конкретный набор имен свойств с определенным типом значений.
<!-- basicblock-end -->




#T_typescript_utility_types
#typescript_utility_types

#telegram 

# Что можно сказать про утилиту Readonly<Type>?
<!-- basicblock-start oid="ObszSIfYCoIpgTac6KXfRhC0"  deck='T_typescript_utility_types' -->
Что можно сказать про утилиту Readonly<Type>?::


Утилита `Readonly<Type>` в TypeScript — это мощный инструмент, позволяющий сделать все свойства объекта неизменяемыми. Это особенно полезно, когда нужно гарантировать, что свойства объекта не будут изменены после его создания. Вот пояснение того, как работает `Readonly<Type>`, а также немного о `Object.freeze` и функции `freeze` в TypeScript.

### Утилита `Readonly<Type>`

Утилита `Readonly<Type>` создает новый тип, в котором все свойства указанного типа устанавливаются как `readonly`, что означает, что их нельзя переназначить после первоначального присвоения. Если попытаться изменить `readonly`-свойство, TypeScript выдаст ошибку на этапе компиляции.

#### Синтаксис и пример

Пример работы `Readonly<Type>`:

```
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Удалить неактивных пользователей",
};

// Ошибка: Невозможно присвоить 'title', потому что это свойство доступно только для чтения.
todo.title = "Привет";
```

В этом примере:
1. `Readonly<Todo>` создает версию типа `Todo`, где все свойства (в данном случае только `title`) становятся `readonly`.
2. Попытка переназначить `todo.title` приводит к ошибке, так как `todo` теперь является неизменяемым объектом.

### Использование `Object.freeze`

Метод `Object.freeze` в JavaScript предоставляет аналогичную функциональность, предотвращая любое изменение свойств объекта. Этот метод делает свойства одновременно `readonly` и неконфигурируемыми, что означает:
- Свойства не могут быть переназначены.
- Невозможно добавить новые свойства.
- Невозможно удалить существующие свойства.

В TypeScript мы можем определить универсальную функцию `freeze`, которая использует `Object.freeze` и возвращает `Readonly<Type>`.

#### Пример функции `freeze`

```
function freeze<Type>(obj: Type): Readonly<Type> {
  return Object.freeze(obj);
}

const frozenTodo = freeze({ title: "Пройти учебник по TypeScript" });

// Ошибка: Невозможно присвоить 'title', потому что это свойство доступно только для чтения.
frozenTodo.title = "Обновить учебник";
```

Эта функция `freeze`:
- Принимает объект любого типа.
- Возвращает замороженную, неизменяемую версию объекта, в которой все свойства становятся `readonly`.

### Итог

- **`Readonly<Type>`**: Утилита TypeScript, делающая все свойства типа `readonly`.
- **`Object.freeze`**: Метод JavaScript, делающий объект неизменяемым, делая все свойства не только доступными только для чтения, но и неконфигурируемыми.
- **`freeze<Type>`**: Функция в TypeScript, которая сочетает `Object.freeze` с `Readonly<Type>` для дополнительной проверки типов на этапе компиляции.

Использование `Readonly<Type>` и `freeze` помогает реализовать неизменяемость данных, обеспечивая защиту от случайных изменений объектов. Это особенно полезно в функциональном программировании и ситуациях, где важна неизменяемость данных.
<!-- basicblock-end -->




#T_typescript_utility_types
#typescript_utility_types

#telegram 

# Когда и как используется PartialType в TS?
<!-- basicblock-start oid="Obsy7M95nFWd5BCwCKYvca1S"  deck='T_typescript_utility_types' -->
Когда и как используется PartialType в TS?::


В TypeScript утилита `Partial<Type>` используется для создания типа, в котором все свойства исходного типа `Type` становятся необязательными. Это полезно, когда нужно создать версию объекта, в которой только часть свойств будет определена, или для случаев, когда объект может быть обновлен частично.

### Пример разбора кода с использованием `Partial<Type>`

1. **Определение интерфейса**:
   ```
   interface Todo {
     title: string;
     description: string;
   }
   
```

   Здесь `Todo` — это интерфейс с обязательными свойствами `title` и `description`.

2. **Функция `updateTodo`**:
   ```
   function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
     return { ...todo, ...fieldsToUpdate };
   }
   
```

   Функция `updateTodo` принимает два аргумента:
   - `todo`: объект, содержащий все обязательные поля из `Todo`.
   - `fieldsToUpdate`: объект с типом `Partial<Todo>`, где каждое свойство интерфейса `Todo` стало необязательным.

   `Partial<Todo>` позволяет вызвать функцию `updateTodo`, передавая только те поля, которые нужно изменить.

3. **Использование функции**:
   ```
   const todo1 = {
     title: "organize desk",
     description: "clear clutter",
   };
   
   const todo2 = updateTodo(todo1, {
     description: "throw out trash",
   });
   
```

   Здесь `todo2` — это обновленная версия `todo1`, в которой `description` было изменено, но `title` осталось прежним. Использование `Partial<Todo>` для второго аргумента позволяет обновить только одно свойство, не обязательно указывая все поля `Todo`.

### Как работает `Partial`
`Partial<Todo>` делает все свойства `title` и `description` необязательными, так что при вызове функции `updateTodo` можно передать объект с любым подмножеством свойств типа `Todo`.

### Пример на практике
Это особенно полезно для операций, где только часть объекта нуждается в изменении, как в приложениях для управления состоянием, патч-операциях API и других случаях обновления данных.
<!-- basicblock-end -->





<!-- basicblock-start oid="Obs1QQMfa38kewqwkHYKi58o" deck='T_typescript_utility_types' --> 

1.1 Вопрос: "Что такое тип Awaited<Type> в TypeScript?" ::  
1.2 Ответ: "Тип `Awaited<Type>` рекурсивно распаковывает тип, который передается, чтобы определить его итоговое значение. Это удобно для работы с асинхронными операциями, моделирующими поведение оператора `await` или метода `.then()`." 
Пример кода: 
```
type A = Awaited<Promise<string>>;
// A: string
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="Obsc94zjIzHeVVYBItcPexEk" deck='T_typescript_utility_types' --> 

2.1 Вопрос: "Как тип Awaited<Type> работает с вложенными промисами, такими как Promise<Promise<Type>>?" ::  
2.2 Ответ: "Тип `Awaited<Type>` рекурсивно извлекает значение даже из вложенных промисов, пока не доберется до самого вложенного типа, который возвращается в итоге."  
Пример кода: 
```
type B = Awaited<Promise<Promise<number>>>;
// B: number
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsqL2DBl0zW2m8Xi7RZWT43" deck='T_typescript_utility_types' --> 

3.1 Вопрос: "Как тип Awaited<Type> обрабатывает объединенные типы, такие как boolean | Promise<number>?" ::  
3.2 Ответ: "При передаче объединенного типа, например, `boolean | Promise<number>`, `Awaited<Type>` развернет только типы внутри `Promise`, оставляя остальные типы без изменений."  
Пример кода: 
```
type C = Awaited<boolean | Promise<number>>;
// C: number | boolean
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsUkZbNcpuZkoEURSjEDk1d" deck='T_typescript_utility_types' --> 

4.1 Вопрос: "Какие типы данных можно передавать в Awaited<Type>, и что произойдет при передаче обычного типа, например, number?" ::  
4.2 Ответ: "В `Awaited<Type>` можно передать как промисы, так и обычные типы. Обычные типы, такие как `number`, останутся без изменений, так как они не подлежат распаковке."  
Пример кода: 
```
type D = Awaited<number>;
// D: number
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="Obsd5O5rb9X9bwzxQba9LiKs" deck='T_typescript_utility_types' --> 

5.1 Вопрос: "Можно ли использовать Awaited<Type> для упрощения типов внутри асинхронных функций?" ::  
5.2 Ответ: "Да, `Awaited<Type>` особенно полезен для выведения возвращаемых типов асинхронных функций, где приходится извлекать окончательное значение из вложенных промисов."  
Пример кода: 
```
async function getData(): Promise<Promise<string>> {
  return "data";
}
type DataType = Awaited<ReturnType<typeof getData>>;
// DataType: string
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="Obs5Opu2UT4f5a7LX03dihpg" deck='T_typescript_utility_types' --> 

6.1 Вопрос: "Какие преимущества тип Awaited<Type> предоставляет для работы с асинхронным кодом и промисами в TypeScript?" ::  
6.2 Ответ: "Тип `Awaited<Type>` позволяет автоматически определять тип возвращаемых значений асинхронных операций, не раскрывая вложенные промисы вручную, что делает код более читабельным и типизированным."  
Пример кода: 
```
type Result = Awaited<Promise<Promise<number | string>>>;
// Result: number | string
```
<!-- basicblock-end --> 

Эти вопросы охватывают основные аспекты использования `Awaited<Type>`. Если нужно больше примеров, дайте знать!
<!-- basicblock-end -->



