
#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# K extends keyof T> что это делает?
<!-- basicblock-start oid="ObsVYOI7ZRYuS9abKZ4QCNED"  deck='T_typescript_type_manipulations_generics' -->
K extends keyof T> что это делает?::


Конструкция `K extends keyof T` в TypeScript используется для создания обобщенного параметра `K`, который ограничивается ключами типа `T`. Давайте разберем эту конструкцию по частям:

### Разбор конструкции

- **`K`**: Это параметр типа, который может быть любым типом, но он будет ограничен в следующей части выражения.
- **`extends`**: Ключевое слово, используемое для обозначения ограничения на параметр типа. Оно говорит TypeScript, что параметр `K` должен соответствовать определенному условию.
- **`keyof T`**: Это оператор, который создает объединение (union) строковых литералов, представляющих ключи типа `T`. То есть, если `T` — это объект, `keyof T` даст вам все возможные ключи этого объекта как строковые литералы.

### Пример использования

Рассмотрим пример, чтобы понять, как это работает:

```
interface User {
  id: number;
  name: string;
  email: string;
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Пример использования функции
const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

// Получение значений по ключу
const userName = getProperty(user, "name"); // string
const userId = getProperty(user, "id");     // number
```

### Что здесь происходит

1. **Определение интерфейса `User`**:
   - Мы создаем интерфейс `User`, который имеет три свойства: `id`, `name` и `email`.

2. **Функция `getProperty`**:
   - Эта функция принимает два параметра: объект `obj` типа `T` и ключ `key` типа `K`, который ограничен ключами типа `T` (то есть, ключами объекта `obj`).
   - Возвращаемый тип функции — это тип свойства, соответствующий ключу `K`, т.е. `T[K]`.

3. **Пример использования**:
   - Когда мы вызываем `getProperty(user, "name")`, TypeScript проверяет, что строка `"name"` является допустимым ключом для типа `User`, и выводит тип `string` для `userName`.
   - Аналогично, при вызове `getProperty(user, "id")`, TypeScript выводит тип `number` для `userId`.

### Преимущества

- **Безопасность типов**: Конструкция `K extends keyof T` позволяет гарантировать, что переданные ключи являются действительными свойствами объекта, что предотвращает ошибки, связанные с обращением к несуществующим свойствам.
- **Генерализация**: Это позволяет функции работать с любыми типами объектов, а не только с конкретными, сохраняя типизацию.
- **Поддержка обобщений**: Позволяет писать более универсальные и переиспользуемые функции и классы.

### Заключение

Конструкция `K extends keyof T` является мощным инструментом в TypeScript, который помогает создавать типобезопасные функции и обобщения, позволяя вам работать с динамическими ключами объектов без риска ошибок типизации. Это особенно полезно в случаях, когда вы хотите создать функции, работающие с объектами разных типов, сохраняя строгую типизацию.
<!-- basicblock-end -->




#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# Как выглядит пример использования template literal types ?
<!-- basicblock-start oid="Obs1FnANo4HVsF1npiHOOwez"  deck='T_typescript_type_manipulations_generics' -->
Как выглядит пример использования template literal types ?::


```
type Colors = "red"   | "green" | "blue";
type Shades = "light" | "dark";

type ColorVariant = `${Shades}-${Colors}`;

function getColorCode(variant: ColorVariant) {
    switch (variant) {
        case "light-red":
            return "#FFC0CB";  // светло-красный
        case "dark-red":
            return "#8B0000";  // темно-красный
        case "light-green":
            return "#90EE90";  // светло-зеленый
        case "dark-green":
            return "#006400";  // темно-зеленый
        case "light-blue":
            return "#ADD8E6";  // светло-голубой
        case "dark-blue":
            return "#00008B";  // темно-синий
        default:
            return "#000000";  // черный по умолчанию
    }
}

// Пример вызова функции
const colorCode = getColorCode("dark-blue");
console.log(colorCode); // "#00008B"
```
<!-- basicblock-end -->




#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# Как выглядит реализация паттерна наблюдатель на TS?
<!-- basicblock-start oid="ObsLm0pNUWvsVK6WDiiyQSGw"  deck='T_typescript_type_manipulations_generics' -->
Как выглядит реализация паттерна наблюдатель на TS?::


Чтобы вызывать обработчик при чтении свойства объекта, нужно изменить логику прокси таким образом, чтобы при каждом чтении свойства проверялось наличие соответствующего обработчика. В TypeScript, это можно сделать, добавив в перехватчик `get` логику для вызова обработчиков.

### Обновленный код

В этом коде добавлен функционал для вызова обработчиков при чтении свойства, используя событие `"${Key}Read"`.

```
type PropEventSource<Type> = {
    on<Key extends keyof Type & string>(
        eventName: `${Key}Changed` | `${Key}Read`, // Добавляем событие чтения `${Key}Read`
        callback: (newValue: Type[Key]) => void
    ): void;
};

function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type> {
    // Словарь для хранения обработчиков событий.
    const listeners: { [key: string]: Array<(newValue: any) => void> } = {};

    // Создаем прокси для перехвата операций с объектом `obj`.
    const proxy = new Proxy(obj as Type & PropEventSource<Type>, {
        // Перехватчик установки значений свойств.
        set(target, key: keyof Type, value: Type[keyof Type]) {
            if (target[key] !== value) {
                target[key] = value;

                // Формируем имя события для изменения свойства.
                const eventName = `${key as string}Changed`;
                if (listeners[eventName]) {
                    for (const listener of listeners[eventName]) {
                        listener(value); // Вызываем обработчики изменения.
                    }
                }
            }
            return true;
        },
        // Перехватчик для чтения значений свойств.
        get(target, key) {
            // Если запрашивается метод `on`, возвращаем функцию подписки.
            if (key === 'on') {
                return (eventName: string, callback: (newValue: any) => void) => {
                    listeners[eventName] = listeners[eventName] || [];
                    listeners[eventName].push(callback);
                };
            }

            // Если читается свойство объекта, формируем событие `${key}Read`.
            const readEventName = `${key as string}Read`;
            if (listeners[readEventName]) {
                for (const listener of listeners[readEventName]) {
                    listener(target[key]); // Вызываем обработчики чтения.
                }
            }

            // Возвращаем значение свойства.
            return target[key];
        }
    });

    return proxy;
}

// Пример использования:
const person = makeWatchedObject({
    firstName: "Alice",
    lastName: "Cooper",
    age: 30,
});

// Подписка на событие изменения firstName.
person.on("firstNameChanged", (newName) => {
    console.log(`Новое имя свойства: ${newName.toUpperCase()}`);
});

// Подписка на событие чтения свойства firstName.
person.on("firstNameRead", (name) => {
    console.log(`Свойство firstName прочитано: ${name}`);
});

// Изменение свойства вызовет событие firstNameChanged.
person.firstName = "Top"; // Выведет: Новое имя свойства: TOP

// Чтение свойства вызовет событие firstNameRead.
console.log(person.firstName); // Выведет: Свойство firstName прочитано: Top
```

### Объяснение изменений
1. **Добавление события `${Key}Read`**: Теперь интерфейс `PropEventSource` поддерживает события как для изменения (`${Key}Changed`), так и для чтения (`${Key}Read`) свойства.
2. **Обработка события чтения**: В `get` добавлена проверка на наличие обработчиков для события `"${key}Read"`. Если обработчики есть, они вызываются при каждом чтении значения свойства.
3. **Пример использования**: После подписки на событие `"firstNameRead"`, при каждом чтении `person.firstName` будет вызываться соответствующий обработчик, который выводит сообщение в консоль.
<!-- basicblock-end -->




#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# Можешь показать пример Generic Types?
<!-- basicblock-start oid="ObsR92FghTfvo0PbJJXHZsbq"  deck='T_typescript_type_manipulations_generics' -->
Можешь показать пример Generic Types?::


Вот пример использования обобщённых типов (Generic Types) в TypeScript:

### Пример обобщённого типа

```
// Обобщённый тип Pair
type Pair<T, U> = {
    first: T;
    second: U;
};

// Использование обобщённого типа с разными типами
const stringNumberPair: Pair<string, number> = {
    first: "Hello",
    second: 42,
};

const numberBooleanPair: Pair<number, boolean> = {
    first: 100,
    second: true,
};

// Использование обобщённого типа с объектами
const objectPair: Pair<{ name: string }, { age: number }> = {
    first: { name: "Alice" },
    second: { age: 30 },
};

// Функция, использующая обобщённый тип
function printPair<T, U>(pair: Pair<T, U>): void {
    console.log(`First: ${pair.first}, Second: ${pair.second}`);
}

// Вызов функции с разными типами
printPair(stringNumberPair);  // Выведет: "First: Hello, Second: 42"
printPair(numberBooleanPair); // Выведет: "First: 100, Second: true"
printPair(objectPair);        // Выведет: "First: [object Object], Second: [object Object]"
```

### Объяснение:

1. **Обобщённый тип `Pair<T, U>`**:
   - Мы объявляем обобщённый тип `Pair`, который принимает два параметра типа: `T` и `U`. Это означает, что `first` может быть одного типа, а `second` — другого.
   - Это гибкий способ хранения двух значений разных типов в одном объекте.

2. **Пример использования**:
   - Мы создаём объекты типа `Pair<string, number>`, `Pair<number, boolean>` и `Pair<{ name: string }, { age: number }>`, что позволяет хранить пары значений разных типов.
   - Благодаря обобщённым типам TypeScript знает, какие типы данных используются, и проверяет их корректность.

3. **Функция `printPair`**:
   - Функция принимает аргумент, тип которого — обобщённый тип `Pair<T, U>`. Это позволяет передавать в неё пары любых типов.
   - При вызове функции TypeScript автоматически понимает типы, которые передаются в параметры `pair.first` и `pair.second`.

### Преимущества:

- Обобщённые типы (Generic Types) дают возможность создавать универсальные и типобезопасные структуры.
- Можно создавать сложные типы, которые работают с разными типами данных, сохраняя строгую типизацию.
- Такие типы полезны, когда нужно создавать контейнеры для данных (например, пары, кортежи, массивы) или когда нужно работать с данными, не привязываясь к конкретным типам.

Этот пример показывает, как можно использовать обобщённые типы для создания гибких структур данных, которые могут быть переиспользованы для различных типов данных.
<!-- basicblock-end -->




#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# Покажи пример использования обобщенного класса в TS?
<!-- basicblock-start oid="Obsc4rsvpfhG31vVruKKG819"  deck='T_typescript_type_manipulations_generics' -->
Покажи пример использования обобщенного класса в TS?::


Вот пример обобщённого класса (дженерик-класса) в TypeScript:

### Пример обобщённого класса

```
class Box<T> {
    private content: T;

    constructor(value: T) {
        this.content = value;
    }

    // Метод для получения содержимого
    getContent(): T {
        return this.content;
    }

    // Метод для установки нового содержимого
    setContent(value: T): void {
        this.content = value;
    }
}

// Создание экземпляра класса с типом string
const stringBox = new Box<string>("Hello, World!");
console.log(stringBox.getContent()); // Выведет: "Hello, World!"

// Создание экземпляра класса с типом number
const numberBox = new Box<number>(123);
console.log(numberBox.getContent()); // Выведет: 123

// Создание экземпляра класса с типом объекта
const objectBox = new Box<{ name: string, age: number }>({ name: "John", age: 30 });
console.log(objectBox.getContent()); // Выведет: { name: "John", age: 30 }

// Изменение содержимого
objectBox.setContent({ name: "Alice", age: 25 });
console.log(objectBox.getContent()); // Выведет: { name: "Alice", age: 25 }
```

### Объяснение:

1. **Класс `Box<T>`**:
   - Это обобщённый класс, где `T` — это параметр типа, который заменяется конкретным типом при создании экземпляра класса.
   - Внутри класса есть поле `content` типа `T`, которое хранит содержимое.
   - В конструкторе и методах `getContent` и `setContent` используется тип `T`, что позволяет классу работать с любым типом данных.

2. **Использование с различными типами**:
   - Мы создаём экземпляры класса `Box`, указав разные типы: `string`, `number`, и даже объект `{ name: string, age: number }`.
   - Благодаря дженерикам, TypeScript автоматически понимает, какого типа содержимое хранится в экземпляре класса, и проверяет типы на этапе компиляции.

3. **Типобезопасность**:
   - Когда вызывается метод `getContent`, TypeScript знает, какой тип возвращается (например, строка или число).
   - Это предотвращает ошибки, связанные с неправильным типом данных при работе с экземплярами класса.

### Преимущества:

- Обобщённые классы позволяют создавать универсальные структуры данных, которые могут работать с разными типами данных.
- Они обеспечивают строгую типизацию, помогая избежать ошибок, связанных с использованием неверных типов.

Этот подход особенно полезен, когда вы работаете с контейнерами, коллекциями или любыми другими структурами данных, которые могут содержать значения различных типов.
<!-- basicblock-end -->




#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# Покажи пример использования обобщенного класса в TS?
<!-- basicblock-start oid="ObslGhhgDJdH8VMv92KjcaCg"  deck='T_typescript_type_manipulations_generics' -->
Покажи пример использования обобщенного класса в TS?::


class Box<T> {
    private content: T;

    constructor(value: T) {
        this.content = value;
    }

    // Метод для получения содержимого
    getContent(): T {
        return this.content;
    }

    // Метод для установки нового содержимого
    setContent(value: T): void {
        this.content = value;
    }
}

// Создание экземпляра класса с типом string
const stringBox = new Box<string>("Hello, World!");
console.log(stringBox.getContent()); // Выведет: "Hello, World!"

// Создание экземпляра класса с типом number
const numberBox = new Box<number>(123);
console.log(numberBox.getContent()); // Выведет: 123

// Создание экземпляра класса с типом объекта
const objectBox = new Box<{ name: string, age: number }>({ name: "John", age: 30 });
console.log(objectBox.getContent()); // Выведет: { name: "John", age: 30 }

// Изменение содержимого
objectBox.setContent({ name: "Alice", age: 25 });
console.log(objectBox.getContent()); // Выведет: { name: "Alice", age: 25 }
<!-- basicblock-end -->





***


#T_typescript_type_manipulations_generics
#typescript_type_manipulations_generics

#telegram 

# 
<!-- basicblock-start oid="ObsSs40GpdQPxhyWksSOnjFh"  deck='T_typescript_type_manipulations_generics' -->
::


<!-- basicblock-end -->



