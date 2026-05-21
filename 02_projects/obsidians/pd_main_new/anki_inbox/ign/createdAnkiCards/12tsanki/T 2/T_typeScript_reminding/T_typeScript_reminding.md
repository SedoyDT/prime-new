
#T_typeScript_reminding
#typeScript_reminding

#telegram 

# Создайте тип для результата API-запроса: успешного (data) и с ошибкой (error)
<!-- basicblock-start oid="ObsyhZnjxFIvgq9hwa5YSk3c"  deck='T_typeScript_reminding' -->
Создайте тип для результата API-запроса: успешного (data) и с ошибкой (error)::


Вот пример типа для описания результата API-запроса с учётом успешного (`data`) и ошибочного (`error`) сценария. Этот тип может быть реализован в TypeScript: 

```
type ApiResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// Пример использования:
interface User {
  id: number;
```
<!-- basicblock-end -->




#T_typeScript_reminding
#typeScript_reminding

#telegram 

# Создайте тип для результата API-запроса: успешного (data) и с ошибкой (error)
<!-- basicblock-start oid="ObsunJQu3lukms7o03gstyG0"  deck='T_typeScript_reminding' -->
Создайте тип для результата API-запроса: успешного (data) и с ошибкой (error)::


Вот пример типа для описания результата API-запроса с учётом успешного (`data`) и ошибочного (`error`) сценария. Этот тип может быть реализован в TypeScript: 

```typescript
type ApiResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// Пример использования:
interface User {
  id: number;
<!-- basicblock-end -->




#T_typeScript_reminding
#typeScript_reminding

#telegram 

# Определите тип, который может быть либо строкой, либо числом. Напишите функцию, которая обрабатывает оба случая.
<!-- basicblock-start oid="ObsWWblqXtv1hxIm9UWF9lAx"  deck='T_typeScript_reminding' -->
Определите тип, который может быть либо строкой, либо числом. Напишите функцию, которая обрабатывает оба случая.::


```
// Тип, который может быть строкой или числом
type StringOrNumber = string | number;

// Функция, обрабатывающая оба случая
function processInput(input: StringOrNumber): string {
  if (typeof input === "string") {
    return `Длина строки: ${input.length}`;
  } else if (typeof input === "number") {
    return `Квадрат числа: ${input * input}`;
  }
  return "Неподдерживаемый тип";
}

// Примеры использования
console.log(processInput("Hello")); // Вывод: "Длина строки: 5"
console.log(processInput(10));      // Вывод: "Квадрат числа: 100"
```
<!-- basicblock-end -->




#T_typeScript_reminding
#typeScript_reminding

#telegram 

# Определите тип, который может быть либо строкой, либо числом. Напишите функцию, которая обрабатывает оба случая. Создайте тип для результата API-запроса: успешного (`data`) и с ошибкой (`error`).?
<!-- basicblock-start oid="ObsaM0zU2rYuZYCtGIKcRMja"  deck='T_typeScript_reminding' -->
Определите тип, который может быть либо строкой, либо числом. Напишите функцию, которая обрабатывает оба случая. Создайте тип для результата API-запроса: успешного (`data`) и с ошибкой (`error`).?::


```
// Обобщенная функция, которая принимает массив типа T[] и возвращает его первый элемент
function getFirstElement<T>(array: T[]): T | undefined {
    // Если массив не пустой, возвращаем первый элемент. Если массив пустой, возвращаем undefined.
    return array[0];
}

// Пример использования функции
// Массив чисел
const numbers = [1, 2, 3, 4];
const firstNumber = getFirstElement(numbers);
console.log(firstNumber);

const words = ['apple', 'bannana', 'pineapple', 'grape'];
const firstWord = getFirstElement(words);
console.log(firstWord);
```

# Интерфейс с дженериками для хранилища данных

```
interface Storage<T> {
    get(): T | null;
    set(value: T): void;
}
```

```
class StringStorage implements Storage<string> {
    private data: string | null = null;

    get(): string | null {
        return this.data;
    }

    set(value: string): void {
        this.data = value;
    }
}

const stringStorage = new StringStorage();
stringStorage.set('Hello, world!');
console.log(stringStorage.get()); // 'Hello, world!'

class NumberStorage implements Storage<number> {
    private data: number | null = null;

    get(): number | null {
        return this.data;
    }

    set(value: number): void {
        this.data = value;
    }
}

const numberStorage = new NumberStorage();
numberStorage.set(42);
console.log(numberStorage.get()); // 42
```
<!-- basicblock-end -->




#T_typeScript_reminding
#typeScript_reminding

#telegram 

# Определите тип для объекта, представляющего книгу в библиотеке (`title`, `author`, `year`, `isAvailable`). Напишите функцию, которая принимает такой объект и возвращает строку с его описанием.
<!-- basicblock-start oid="ObsnxuQixNnjb7ZbWwI6gKqr"  deck='T_typeScript_reminding' -->
Определите тип для объекта, представляющего книгу в библиотеке (`title`, `author`, `year`, `isAvailable`). Напишите функцию, которая принимает такой объект и возвращает строку с его описанием.::


```
type TBook = {
    title: string,
    author: string,
    year: number,
    isAvailable: boolean
}

// Пример использования
const book: TBook = {
    title: "Война и мир",
    author: "Лев Толстой",
    year: 1869,
    isAvailable: true
};

function describeBook(book: TBook): string {
    const availability = book.isAvailable ? "доступна" : "недоступна";
    return `Книга "${book.title}", автор: ${book.author}, год издания: ${book.year}. Статус: ${availability}.`;
}

console.log(describeBook(book))
// Тип ObjectType

type ObjectType = {
    name: string;
    type: string;
    attributes: Record<string, string>;
};
// Пример использования
const obj: ObjectType = {
    name: "Яблоко",
    type: "Фрукт",
    attributes: {
        color: "красный",
        size: "средний",
        taste: "сладкий"
    }
};

function describeObject(obj: ObjectType): string {
    const name = obj.name || "Без имени";
    const type = obj.type || "Без типа";
    const attributes = obj.attributes || {};

    // Генерация строки с атрибутами
    const attributesDescription = Object.entries(attributes)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

    return `Объект '${name}' (тип: ${type}). Атрибуты: ${attributesDescription}.`;
}

console.log(describeObject(obj));
```
<!-- basicblock-end -->




#T_typeScript_reminding
#typeScript_reminding

#telegram 

# f
<!-- basicblock-start oid="ObsYow04jnVnSPIUb2EUYKcA"  deck='T_typeScript_reminding' -->
f::


<!-- basicblock-end -->



