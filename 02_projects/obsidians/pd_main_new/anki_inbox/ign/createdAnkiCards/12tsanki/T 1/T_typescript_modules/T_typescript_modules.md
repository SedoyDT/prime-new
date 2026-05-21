

<!-- basicblock-start oid="Obs9HS2AN3vDIGl0gz38CoBw" deck='T_typescript_classes' --> 

9.1 Вопрос: "Что такое экспорт по умолчанию (default export) в модулях TypeScript?" :: 
9.2 Ответ: "Экспорт по умолчанию позволяет экспортировать одну основную сущность из модуля. Это удобно, когда модуль представляет собой единую концепцию." 
Пример кода: 
```
// Файл: greeting.ts
export default function greet(name: string) {
  return `Hello, ${name}!`;
}
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObskPxfhagMcQDsTsMRoNoL0" deck='T_typescript_classes' --> 

10.1 Вопрос: "Как можно переименовать импортируемые члены модуля?" :: 
10.2 Ответ: "При импорте можно использовать синтаксис `import { oldName as newName }` для изменения имени импортируемого члена." 
Пример кода: 
```
// Файл: maths.ts
export const pi = 3.14;

// Файл: app.ts
import { pi as π } from './maths.js';
console.log(π); // 3.14
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObssLk45KmE8sumpAB7QTHVj" deck='T_typescript_classes' --> 

11.1 Вопрос: "Как можно импортировать модуль без использования его экспортируемых членов?" :: 
11.2 Ответ: "Можно использовать синтаксис `import './module.js';`, чтобы выполнить код в модуле без импорта конкретных членов." 
Пример кода: 
```
// Файл: setup.ts
console.log("Setup complete");

// Файл: app.ts
import './setup.js'; // Выполнит код в setup.ts
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObspxbEcAvWmNQpmwFK7vEtN" deck='T_typescript_classes' --> 

12.1 Вопрос: "Что такое неймспейсы в TypeScript и как они отличаются от модулей?" :: 
12.2 Ответ: "Неймспейсы (namespaces) используются для организации кода в одну логическую единицу, но работают в глобальной области видимости, в отличие от модулей." 
Пример кода: 
```
namespace Shapes {
  export class Circle {
    constructor(public radius: number) {}
  }
}

// Использование
const circle = new Shapes.Circle(5);
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsegsGW1HB1OM2oqr5Mz1wC" deck='T_typescript_classes' --> 

13.1 Вопрос: "Как TypeScript обрабатывает конфликты имен при импорте?" :: 
13.2 Ответ: "Если два члена имеют одинаковые имена, можно использовать алиасы при импорте, чтобы избежать конфликтов." 
Пример кода: 
```
// Файл: shapes.ts
export const circle = "Circle";
export const square = "Square";

// Файл: colors.ts
export const circle = "Red";

// Файл: app.ts
import { circle as shapeCircle } from './shapes.js';
import { circle as colorCircle } from './colors.js';

console.log(shapeCircle); // Circle
console.log(colorCircle); // Red
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="Obs9lvHLjxgIutNgcwoZcQ6o" deck='T_typescript_classes' --> 

14.1 Вопрос: "Что происходит при попытке импортировать модуль, который не существует?" :: 
14.2 Ответ: "TypeScript выдаст ошибку компиляции, сообщая, что не может найти указанный модуль." 
Пример кода: 
```
// Файл: app.ts
import { nonExistentFunction } from './nonExistentModule.js'; // Ошибка: Cannot find module
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsiulJHrmdllltgLhmULfgy" deck='T_typescript_classes' --> 

15.1 Вопрос: "Как использовать конфигурационный файл `tsconfig.json` для настройки модулей?" :: 
15.2 Ответ: "В `tsconfig.json` можно настроить параметры компиляции, такие как `module`, `target` и `moduleResolution`, для контроля поведения модулей." 
Пример кода: 
```
{
  "compilerOptions": {
    "module": "ES6",
    "target": "ES5",
    "moduleResolution": "node"
  }
}
```
<!-- basicblock-end --> 





<!-- basicblock-start oid="ObsPXOyWRduG6Vdvnk49M6Tu" deck='T_typescript_classes' --> 

1.1 Вопрос: "Что такое модули в TypeScript?" :: 
1.2 Ответ: "Модули в TypeScript определяются как файлы, содержащие хотя бы одно верхнеуровневое импорт или экспорт. Если файл не содержит таких конструкций, он рассматривается как скрипт." 
Пример кода:
```
// Файл: myModule.ts
export const greeting = "Hello, world!";
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsNGeZdEh4bCnSj357LmXzc" deck='T_typescript_classes' --> 

2.1 Вопрос: "Каковы основные отличия между модулями и скриптами?" :: 
2.2 Ответ: "Модули исполняются в своем собственном контексте, а скрипты находятся в глобальной области видимости. Члены модуля не доступны за его пределами, если не экспортированы." 
Пример кода: 
```
// Файл: module.ts
const localVar = "I'm local"; // Не доступна за пределами модуля
export const exportedVar = "I'm exported"; // Доступна после экспорта
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObseqARqeTG96i0MXj5xUBGz" deck='T_typescript_classes' --> 

3.1 Вопрос: "Как можно экспортировать функции и переменные в ES модулях?" :: 
3.2 Ответ: "Можно использовать `export` для отдельных переменных и функций, а также `export default` для основного экспорта из модуля." 
Пример кода: 
```
// Файл: math.ts
export const pi = 3.14;
export default function add(a: number, b: number) {
  return a + b;
}
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsRgiMIZ20UttjJnJ3I6UTe" deck='T_typescript_classes' --> 

4.1 Вопрос: "Как импортировать функции и переменные из других модулей?" :: 
4.2 Ответ: "Для импорта можно использовать `import { ... } from ...` для именованных экспортов или `import ... from ...` для экспорта по умолчанию." 
Пример кода: 
```
// Файл: app.ts
import add, { pi } from './math.js';

console.log(pi); // 3.14
console.log(add(2, 3)); // 5
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsjOkrpd04leXiBfVw3sHx6" deck='T_typescript_classes' --> 

5.1 Вопрос: "Как можно импортировать всё из модуля в одно пространство имен?" :: 
5.2 Ответ: "Можно использовать синтаксис `import * as ...` для импорта всех экспортов в одно пространство имен." 
Пример кода: 
```
// Файл: app.ts
import * as math from './math.js';

console.log(math.pi); // 3.14
console.log(math.add(2, 3)); // 5
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsKcJ6vkpHAIuccpGVEo2Jj" deck='T_typescript_classes' --> 

6.1 Вопрос: "Что такое `import type` в TypeScript?" :: 
6.2 Ответ: "`import type` позволяет импортировать только типы, что позволяет избежать создания значений во время импорта." 
Пример кода: 
```
// Файл: animal.ts
export type Cat = { breed: string; yearOfBirth: number };

// Файл: app.ts
import type { Cat } from './animal.js';

const myCat: Cat = { breed: "Siamese", yearOfBirth: 2020 };
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsV1R2MjTCRueYPI5VXF2z7" deck='T_typescript_classes' --> 

7.1 Вопрос: "Как происходит интероп между CommonJS и ES модулями?" :: 
7.2 Ответ: "TypeScript предоставляет поддержку для использования CommonJS модулей через флаг компилятора `esModuleInterop`." 
Пример кода: 
```
// Файл: maths.js (CommonJS)
function add(a, b) {
  return a + b;
}
module.exports = { add };

// Файл: app.ts (TypeScript)
import { add } from './maths.js'; // Поддержка ES модулей
console.log(add(2, 3)); // 5
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsLswlMTYDyYqb9XqRQVZwd" deck='T_typescript_classes' --> 

8.1 Вопрос: "Как TypeScript обрабатывает разрешение модулей?" :: 
8.2 Ответ: "TypeScript использует два основных подхода к разрешению модулей: Classic и Node, с Node как более современным подходом, аналогичным тому, как это делает Node.js." 
Пример кода: 
```
// Конфигурация tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node"
  }
}
```
<!-- basicblock-end --> 




