
#T_typescript_datatypes
#typescript_datatypes

#telegram 

# ```
<!-- basicblock-start oid="ObsSlcP89OZdTdPqNlksQqKy"  deck='T_typescript_datatypes' -->
```::

function getLength(input: unknown): number {
  if (typeof input === "string") {
    return input.length;
  } else if (Array.isArray(input)) {
    return input.length;
  } else {
    throw new Error("Неподдерживаемый тип данных");
  }
}

const data: unknown = "Hello, TypeScript!";
console.log(getLength(data)); // 18

const arrayData: unknown = [1, 2, 3];
console.log(getLength(arrayData)); // 3
```

**Объяснение**:
- Мы используем проверку типа, чтобы убедиться, что `input` является строкой или массивом, прежде чем вызывать свойство `.length`.
- Если тип данных не поддерживается, выбрасывается ошибка.

---

### Заключение:

Тип `unknown` — это мощный инструмент для работы с данными, тип которых заранее неизвестен. Он заставляет разработчика явно проверять тип перед использованием, что делает код более безопасным и предсказуемым. В то же время, он предоставляет гибкость для работы с динамическими данными, такими как JSON, API-ответы или пользовательский ввод.

Основные моменты:
- Используйте `unknown`, когда тип данных заранее неизвестен.
- Всегда проверяйте тип перед использованием данных типа `unknown`.
- Используйте **type guards** (например, `typeof`, `Array.isArray`, пользовательские функции) для безопасной работы с `unknown`.
<!-- basicblock-end -->




#T_typescript_datatypes
#typescript_datatypes

#telegram 

# Расскажи подробробнее про тип unkonwn?
<!-- basicblock-start oid="ObsDFNoxHJOsGklCVbyRoNFC"  deck='T_typescript_datatypes' -->
Расскажи подробробнее про тип unkonwn?::


Тип `unknown` в TypeScript используется, когда тип значения заранее неизвестен или может быть любым. В отличие от типа `any`, который отключает проверку типов, `unknown` требует явной проверки типа перед использованием значения. Это делает `unknown` более безопасным вариантом для работы с данными, которые могут прийти из внешних источников (например, API).

Давайте рассмотрим несколько примеров применения `unknown`.

---

### Пример 1: **Безопасная работа с JSON**

Предположим, вы получаете данные из внешнего API в формате JSON. Эти данные могут быть любого типа, и вы хотите безопасно обработать их.

```
function parseJSON(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch (e) {
    console.error("Ошибка парсинга JSON:", e);
    return null;
  }
}

const jsonString = '{"name": "Alice", "age": 25}';
const parsedData: unknown = parseJSON(jsonString);

// Мы не можем сразу использовать parsedData как объект
// console.log(parsedData.name); // Ошибка: Object is of type 'unknown'

// Для безопасного использования нужно выполнить проверку типа
if (typeof parsedData === "object" && parsedData !== null) {
  console.log((parsedData as { name: string }).name); // Alice
}
```

**Объяснение**:
- Функция `parseJSON` возвращает значение типа `unknown`, потому что результат парсинга JSON может быть любым.
- Перед использованием данных мы проверяем, является ли `parsedData` объектом, чтобы избежать ошибок во время выполнения.

---

### Пример 2: **Обработка данных из внешнего источника**

Предположим, у вас есть функция, которая принимает данные из внешнего источника (например, API), и вы хотите безопасно обработать эти данные.

```
function processInput(input: unknown): void {
  if (typeof input === "string") {
    console.log(`Строка: ${input.toUpperCase()}`);
  } else if (typeof input === "number") {
    console.log(`Число: ${input * 2}`);
  } else if (Array.isArray(input)) {
    console.log(`Массив: ${input.join(", ")}`);
  } else {
    console.log("Неизвестный тип данных");
  }
}

processInput("hello"); // Строка: HELLO
processInput(42); // Число: 84
processInput([1, 2, 3]); // Массив: 1, 2, 3
processInput({ key: "value" }); // Неизвестный тип данных
```

**Объяснение**:
- Функция `processInput` принимает значение типа `unknown`.
- Перед использованием данных выполняется проверка типа с помощью `typeof`, `Array.isArray` и других методов.
- Это гарантирует, что данные будут обработаны только после того, как их тип будет определен.

---

### Пример 3: **Использование `unknown` с пользовательскими типами**

Предположим, у вас есть функция, которая принимает данные неизвестного типа, но вы хотите работать с ними только в том случае, если они соответствуют определенной структуре.

```
interface User {
  name: string;
  age: number;
}

function isUser(input: unknown): input is User {
  return (
    typeof input === "object" &&
    input !== null &&
    "name" in input &&
    "age" in input &&
    typeof (input as User).name === "string" &&
    typeof (input as User).age === "number"
  );
}

function processUser(input: unknown): void {
  if (isUser(input)) {
    console.log(`Пользователь: ${input.name}, возраст: ${input.age}`);
  } else {
    console.log("Неверные данные пользователя");
  }
}

const user: unknown = { name: "Bob", age: 30 };
processUser(user); // Пользователь: Bob, возраст: 30

const invalidUser: unknown = { name: "Charlie" };
processUser(invalidUser); // Неверные данные пользователя
```

**Объяснение**:
- Функция `isUser` — это **type guard**, которая проверяет, соответствует ли входное значение интерфейсу `User`.
- Если проверка проходит успешно, мы можем безопасно работать с данными как с объектом типа `User`.

---

### Пример 4: **Приведение типа (`type assertion`) с `unknown`**

Если вы уверены в типе данных, вы можете использовать приведение типа (`type assertion`) для преобразования `unknown` в конкретный тип.
<!-- basicblock-end -->




#T_typescript_datatypes
#typescript_datatypes

#telegram 

# Что можно сказать о типе unknown?
<!-- basicblock-start oid="ObskWlYt6GTWAJx6PIEko4li"  deck='T_typescript_datatypes' -->
Что можно сказать о типе unknown?::


Этот тип используется когда заранее неизвестно, какой тип дынных будет установлен, но при этом требуется более безопасное поведение, чем при использовании any.

Он безопастнее, потому что перед назначением переменной с типом unknown необходимо использовать проверку типа type assertion или type guard
<!-- basicblock-end -->



