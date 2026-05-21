
#T_typescipt
#typescipt

#telegram 

# Что можно сказать про Non-null Assertion Operator (Postfix 
<!-- basicblock-start oid="ObssiVL6twT534EOcqmMjvOQ"  deck='T_typescipt' -->
Что можно сказать про Non-null Assertion Operator (Postfix ::


В TypeScript также есть специальный синтаксис для удаления null и undefined из типа без выполнения какой-либо явной проверки. Запись ! после любого выражения фактически является утверждением типа о том, что значение не является null или undefined:

```
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```
Как и другие утверждения типа, это не меняет поведение вашего кода во время выполнения, поэтому важно использовать ! только тогда, когда вы знаете, что значение не может быть null или undefined .
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram 

# Что можно сказать про null and undefined?
<!-- basicblock-start oid="Obso1cNIv9D3EwsQbdRefMh4"  deck='T_typescipt' -->
Что можно сказать про null and undefined?::


null 
 и 
undefined
В JavaScript есть два примитивных значения, используемых для обозначения отсутствующего или неинициализированного значения: null и undefined .

В TypeScript есть два соответствующих типа с одинаковыми именами. Поведение этих типов зависит от того, включена ли у вас опция strictNullChecks.

strictNullChecks 
 выкл.
Если strictNullChecks отключены, к значениям, которые могут быть null или undefined, по-прежнему можно получить обычный доступ, а значения null и undefined могут быть присвоены свойству любого типа. Это похоже на то, как ведут себя языки без проверок null (например, C #, Java). Отсутствие проверки этих значений, как правило, является основным источником ошибок; мы всегда рекомендуем пользователям включать strictNullChecks, если это целесообразно сделать в их кодовой базе.

strictNullChecks 
 вкл.
При включенной strictNullChecks, когда значение равно null или не определено, вам нужно будет проверить наличие этих значений, прежде чем использовать методы или свойства для этого значения. Точно так же, как проверка на наличие undefined перед использованием необязательного свойства, мы можем использовать сужение для проверки значений, которые могут быть null:

```
function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram 

# Что можно сказать про буквальный вывод literal inference ?
<!-- basicblock-start oid="ObsMqnPJslHLk1tcQVUVwVCJ"  deck='T_typescipt' -->
Что можно сказать про буквальный вывод literal inference ?::


```
// Когда вы инициализируете переменную с помощью объекта,
// TypeScript предполагает, что свойства этого объекта могут изменить значения позже.
// Например, если вы написали код, подобный этому:

const obj = { counter: 0 };
if (someCondition) {
    obj.counter = 1;
}
// TypeScript не предполагает, что присвоение 1 полю, в котором ранее было 0,
// является ошибкой. Другой способ сказать это заключается в том,
// что obj.counter должен иметь номер типа, а не 0,
// потому что типы используются для определения поведения как при чтении, так и при записи.
// То же самое относится и к строкам:

declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" };
// handleRequest(req.url, req.method);
// Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.

// В приведенном выше примере предполагается, что req.method является string,
// а не "GET". Поскольку код может быть оценен между созданием запроса
// и вызовом handleRequest, который может назначить новую строку типа "GUESS"
// для запроса.method, TypeScript считает, что этот код содержит ошибку.

// Есть два способа обойти это.

// Вы можете изменить вывод, добавив утверждение типа в любом месте:

// Изменение 1:
// const req = { url: "https://example.com", method: "GET" as "GET" };
// Изменение 2
// handleRequest(req.url, req.method as "GET");

// Изменение 1 означает “я намереваюсь, чтобы req.method всегда имел литеральный тип "GET"”,
// предотвращая возможное присвоение "GUESS" этому полю после.
// Изменение 2 означает “Я знаю по другим причинам, что req.method имеет значение "GET"“.

// You can use as const to convert the entire object to be type literals:

// const req = { url: "https://example.com", method: "GET" } as const;
// handleRequest(req.url, req.method);

// Суффикс as const действует как const, но для системы типов,
// гарантируя, что всем свойствам присваивается литеральный тип,
// а не более общая версия, такая как string или number .
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram 

# Что можно сказать про литеральные типы?
<!-- basicblock-start oid="ObsjKX9caaTjgrdDUw3aQvPb"  deck='T_typescipt' -->
Что можно сказать про литеральные типы?::


```
// В дополнение к общим типам string и number ,
// мы можем ссылаться на конкретные строки и числа в позициях типа.
//
// Один из способов подумать об этом - рассмотреть,
// как JavaScript предлагает различные способы объявления переменной.
// И var, и let позволяют изменять то, что хранится внутри переменной,
// а const - нет. Это отражено в том, как TypeScript создает типы для литералов.

let x: "hello" = "hello";
// OK
x = "hello";
// ...
// x = "howdy";
// Type '"howdy"' is not assignable to type '"hello"'.

function printText(s: string, alignment: "left" | "right" | "center") {
    // ...
}
printText("Hello, world", "left");
// printText("G'day, mate", "centre");
// Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.

// Числовые литеральные типы работают точно так же:

function compare(a: string, b: string): -1 | 0 | 1 {
    return a === b ? 0 : a > b ? 1 : -1;
}

console.log(compare("1","2"));

//interface Options {
//   width: number;
// }
// function configure(x: Options | "auto") {
//   // ...
// }
// configure({ width: 100 });
// configure("auto");
// configure("automatic");

interface Options {
    width: number;
}
function configure(x: Options | "auto") {
    // ...
}
// Конечно, вы можете комбинировать их с нелитеральными типами:
configure({ width: 100 });
configure("auto");
// configure("automatic"); // ошибочка
// Существует еще один тип литералов: логические литералы.
// Существует только два типа логических литералов, и, как вы могли догадаться,
// это типы true и false .
// Тип boolean сам по себе на самом деле является просто псевдонимом для объединения true | false.
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram 

# Что можно сказать про утверждения типов?
<!-- basicblock-start oid="ObslAgYC7RFHzFRa5BEN3AjH"  deck='T_typescipt' -->
Что можно сказать про утверждения типов?::


```
// Иногда у вас будет информация о типе значения, о котором TypeScript не может знать.
//
// Например, если вы используете document.getElementById , TypeScript знает только, что это вернет какой-то HTMLElement
// , но вы можете знать, что на вашей странице всегда будет HTMLCanvasElement с заданным идентификатором.
//
// В этой ситуации вы можете использовать утверждение типа, чтобы указать более конкретный тип:

const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;

// Подобно аннотации типа, утверждения типа удаляются компилятором и не повлияют на поведение вашего кода во время выполнения.
// Вы также можете использовать синтаксис угловых скобок (за исключением случаев, когда код находится в файле .tsx), что эквивалентно:

// js
// const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");

//TypeScript допускает только утверждения типа, которые
// преобразуются в более конкретную или менее конкретную версию типа.
// Это правило предотвращает "невозможные” принуждения, такие как:

const x = "hello" as number;

// Иногда это правило может быть слишком консервативным и запрещать более сложные принуждения,
// которые могли бы быть действительными. Если это произойдет, вы можете использовать два утверждения,
// сначала к любому (или неизвестному, о котором мы расскажем позже), затем к желаемому типу:

// const a = expr as any as T;
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram 

# В чем разница между интерфесом и типом в плане добавления новых полей?
<!-- basicblock-start oid="ObspnnUt771dKMu8YSwBZgtU"  deck='T_typescipt' -->
В чем разница между интерфесом и типом в плане добавления новых полей?::


```
// Расширение интерфейса

interface Animal {
    name: string;
}

interface Bear extends Animal {
    honey: boolean;
}

function getBear() : Bear
{
    return {name: "Винни-пух", honey: true};
}
const bear = getBear();

console.log(bear.name);
console.log(bear.honey);

// Расширение Типа

type Jivotnoe = {
    name: string;
}

type Medved = Jivotnoe & {
    medovoha: boolean;
}
function getMedved() : Medved {
    return {name: "Dmitry", medovoha: true}
}

const medved = getMedved();

console.log(medved.name);
console.log(medved.medovoha);


// Добавление нового полья в существующий интерфейс
interface Window {
    title: string;
}

interface Window {
    ts: TypeScriptAPI;
}

const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});

// type Window = {
//     title: string;
// }
//
// type Window = {
//     ts: TypeScriptAPI;
// }
//
// // Error: Duplicate identifier 'Window'.
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram 

# В чем разница между интерфейсом и типом в плане расширения?
<!-- basicblock-start oid="ObsPujUM1LGE1c9DThb0Ewhf"  deck='T_typescipt' -->
В чем разница между интерфейсом и типом в плане расширения?::


```
// Расширение интерфейса

interface Animal {
    name: string;
}

interface Bear extends Animal {
    honey: boolean;
}

function getBear() : Bear
{
    return {name: "Винни-пух", honey: true};
}
const bear = getBear();

console.log(bear.name);
console.log(bear.honey);

// Расширение Типа

type Jivotnoe = {
    name: string;
}

type Medved = Jivotnoe & {
    medovoha: boolean;
}
function getMedved() : Medved {
    return {name: "Dmitry", medovoha: true}
}

const medved = getMedved();

console.log(medved.name);
console.log(medved.medovoha)
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram 

# Что можно сказать про интерфейсы ?
<!-- basicblock-start oid="Obs2KahQFN7KjruZCHfHuF7u"  deck='T_typescipt' -->
Что можно сказать про интерфейсы ?::


```
// Объявление интерфейса - это еще один способ присвоения имени объектному типу:
interface Point {
    x: number;
    y: number
}

function printCoord(pt: Point) {
    console.log(pt.x)
    console.log(pt.y)
}
printCoord({x: 10, y: 20});
// Точно так же, как когда мы использовали псевдоним типа выше,
// этот пример работает так же, как если бы мы использовали анонимный объектный тип.
// TypeScript заботится только о структуре значения, которое мы передали в printCoord
// - его волнует только то, что оно обладает ожидаемыми свойствами.
// Заботясь только о структуре и возможностях типов, мы называем TypeScript структурно типизированной системой типов.
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram 

# Что можно сказать про псевдонимы типа ?
<!-- basicblock-start oid="ObsjRbtgRlAtQhgksbeERpMn"  deck='T_typescipt' -->
Что можно сказать про псевдонимы типа ?::


```
// Мы использовали объектные типы и типы объединения,
// записывая их непосредственно в аннотации типов.
// Это удобно, но часто бывает,
// что один и тот же тип требуется использовать
// более одного раза и ссылаться на него одним именем.

// Псевдоним типа - это именно то, что называется именем для любого типа.
// Синтаксис псевдонима типа таков:

type Point = {
    x: number;
    y: number;
};

// Exactly the same as the earlier example
function printCoord(pt: Point) {
    console.log("The coordinate's x value is " + pt.x);
    console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });

// Фактически, псевдоним типа можно использовать для присвоения имени любому типу вообще,
// а не только объектному типу. Например, псевдоним типа может указывать на тип объединения:

type ID = number | string;
// Обратите внимание, что псевдонимы - это всего лишь псевдонимы
// - вы не можете использовать псевдонимы типов для создания разных "версий” одного и того же типа.
// Когда вы используете псевдоним, это точно так же, как если бы вы написали псевдонимный тип.
// Другими словами, этот код может показаться незаконным, но в соответствии с TypeScript это нормально,
// потому что оба типа являются псевдонимами для одного и того же типа:

// type UserInputSanitizedString = string;

// function sanitizeInput(str: string): UserInputSanitizedString {
//     return sanitize(str);
// }

// Create a sanitized input
// let userInput = sanitizeInput(getInput());

// Can still be re-assigned with a string though
// userInput = "new input";
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram 

# Что можно сказать про алиасы типов?
<!-- basicblock-start oid="ObsURemih78Fg3X8TUiwQ709"  deck='T_typescipt' -->
Что можно сказать про алиасы типов?::


```
// Мы использовали объектные типы и типы объединения,
// записывая их непосредственно в аннотации типов.
// Это удобно, но часто бывает,
// что один и тот же тип требуется использовать
// более одного раза и ссылаться на него одним именем.

// Псевдоним типа - это именно то, что называется именем для любого типа.
// Синтаксис псевдонима типа таков:

type Point = {
    x: number;
    y: number;
};

// Exactly the same as the earlier example
function printCoord(pt: Point) {
    console.log("The coordinate's x value is " + pt.x);
    console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });

// Фактически, псевдоним типа можно использовать для присвоения имени любому типу вообще,
// а не только объектному типу. Например, псевдоним типа может указывать на тип объединения:

type ID = number | string;
// Обратите внимание, что псевдонимы - это всего лишь псевдонимы
// - вы не можете использовать псевдонимы типов для создания разных "версий” одного и того же типа.
// Когда вы используете псевдоним, это точно так же, как если бы вы написали псевдонимный тип.
// Другими словами, этот код может показаться незаконным, но в соответствии с TypeScript это нормально,
// потому что оба типа являются псевдонимами для одного и того же типа:

// type UserInputSanitizedString = string;

// function sanitizeInput(str: string): UserInputSanitizedString {
//     return sanitize(str);
// }

// Create a sanitized input
// let userInput = sanitizeInput(getInput());

// Can still be re-assigned with a string though
// userInput = "new input";
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram 

# Что можно сказать про объединение типов?
<!-- basicblock-start oid="ObsDIqoyBRPSpiMlRqQxMyTD"  deck='T_typescipt' -->
Что можно сказать про объединение типов?::


```
function printId(id: number | string) {
    if (typeof id == "string") {
        console.log(id.toUpperCase());
    } else {
        console.log(id);
    }
}

printId("id");
printId("121");
printId(12)

function welcomePeople(x: string[] | string) {
    if (Array.isArray(x)) {
        console.log(`Welcome here dear ${x.join(" and ")}`);
    } else {
        console.log(`Welcome here alone stranger ${x}`);
    }
}

welcomePeople(["John", "Lucy", "Peter"]);
welcomePeople("Stas");

// Чтобы проверить, существует ли метод `slice` у объекта, можно использовать несколько способов в JavaScript:
// ### Способ 1: Использование `typeof` и проверка метода

function getFirstThree0(x: string | []) {
    if (typeof x.slice === 'function') {
        console.log(x.slice(0, 3));
    } else {
        console.log("Метод slice не доступен.");
    }
}

// ### Способ 2: Использование оператора `in`
// Этот метод проверяет, существует ли свойство (включая методы) у объекта.
function getFirstThree1(x: string | []) {
    if ('slice' in x) {
        console.log(x.slice(0, 3));
    } else {
        console.log("Метод slice не доступен.");
    }
}

// ### Способ 3: Использование метода `hasOwnProperty`
// Этот метод проверяет наличие метода только у самого объекта (без учета прототипа).
function getFirstThree2(x: string | []) {
    if (x.hasOwnProperty('slice')) {
        console.log(x.slice(0, 3));
    } else {
        console.log("Метод slice не доступен.");
    }
}

// ### Способ 4: Использование проверки через прототип объекта
// Можно проверить, находится ли метод в цепочке прототипов объекта.
function getFirstThree3(x: string | []) {
    if (Object.prototype.hasOwnProperty.call(x, 'slice') || 'slice' in x) {
        console.log(x.slice(0, 3));
    } else {
        console.log("Метод slice не доступен.");
    }
}

// Самым надёжным способом является первый, с использованием `typeof`, так как он напрямую проверяет, является ли `slice` функцией.

function getFirstThree4(x: string | []) {
    if (Array.prototype.slice === x.slice || String.prototype.slice === x.slice) {
        console.log(x.slice(0, 3));
    } else {
        console.log("Метод slice не доступен.");
    }
}
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram

# Что можно сказать про явные типы в TS?
<!-- basicblock-start oid="Obsutl33E4zyu86MyeBp58NN"  deck='T_typescipt' -->
Что можно сказать про явные типы в TS?::


function greet(person: string, date: Date) {
console.log(`Hello ${person}, today is ${date.toDateString()}`);
}
// greet("Person",  Date())
// Argument to string is not assignable to parameter of type "Date"

// Возможно, удивительно, но вызов Date() в JavaScript возвращает a string. С другой стороны, построение a Date с помощью new Date() фактически дает нам то, что мы ожидали.

let msg = "Hello there!";
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram

# Что можно сказать про type tooling?
<!-- basicblock-start oid="ObstxAYYEYFg1QBckC39LRKU"  deck='T_typescipt' -->
Что можно сказать про type tooling?::


```
// TypeScript может обнаруживать ошибки, когда мы допускаем ошибки в нашем коде.
// Это здорово, но TypeScript может также предотвратить нас от совершения этих ошибок в первую очередь.
//
// Средство проверки типов располагает информацией для проверки таких вещей, как доступ к правильным свойствам переменных и другим свойствам.
// Получив эту информацию, оно также может начать предлагать , какие свойства вы, возможно, захотите использовать.
//
// Это означает, что TypeScript можно использовать и для редактирования кода,
// а основная программа проверки типов может выдавать сообщения об ошибках и завершении кода по мере ввода текста в редакторе. Это часть того, на что люди часто ссылаются, когда говорят об инструментах в TypeScript.

// @ts-ignore
import express from "express";
const app = express();

app.get("/", function (req, res) {
    res.send
})
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram

# Что можно сказать про non - exception failure?
<!-- basicblock-start oid="Obs5DNi56TqeRgmfKSYcZk5V"  deck='T_typescipt' -->
Что можно сказать про non - exception failure?::


```
const user = {
    name: "Daniel",
    age: 26,
};
// user.location; // returns undefined

const announcement = "Hello World!";

// How quickly can you spot the typos?
// announcement.toLocaleLowercase();
// announcement.toLocalLowerCase();

// We probably meant to write this...
announcement.toLocaleLowerCase();


function flipCoin() {
    // Meant to be Math.random()
    return Math.random < 0.5;
    // Operator '<' cannot be applied to types '() => number' and 'number'.
}

// Или ошибка базовой логики
const value = Math.random() < 0.5 ? "a" : "b";
if (value !== "a") {
    // ...
} else if (value === "b") {
    // This comparison appears to be unintentional because the types '"a"' and '"b"' have no overlap.
    // Oops, unreachable
}
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram

# Что можно сказать про структурную или как еще говорят утиную типизацию?
<!-- basicblock-start oid="Obsv19Z0XYPjoLltNlJYRhrk"  deck='T_typescipt' -->
Что можно сказать про структурную или как еще говорят утиную типизацию?::


```
// Система структурных типов

// Одна из ключевых core особеннойстей
/// центральных особенностей typescript - это то что проверка типов фокусируется на форме, которую имеет значение
// это еще называют утиной типизацией

// В системе структурных типов,
// если два объекта имеют одинаковую форму,
// они считаются принадлежащими к одному и тому же типу.

interface Point {
    x: number;
    y: number;
}

function logPoint(p: Point) {
    console.log(`${p.x}, ${p.y} `);
}

// logs "12,26"
const point = {x: 12, y: 26};
logPoint(point);

// Переменная point никогда не объявляется как тип Point, однако TypeScript сравнивает форму point c формой Point
// в проверке типов. У них одинаковая форма, значит код проходит

const point3 = { x: 12, y: 26, z: 89 };
logPoint(point3); // logs "12, 26"

const rect = { x: 33, y: 3, width: 30, height: 80 };
logPoint(rect); // logs "33, 3"

// Для сопоставления формы требуется совпадение только подмножества полей объекта.
const color = { hex: "#187ABF" };
// logPoint(color); // ошибка

// Нет никакой разницы между тем, как классы и объекты соответствуют формам:
class VirtualPoint {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

const newVPoint = new VirtualPoint(13, 56);
logPoint(newVPoint); // logs "13, 56"
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram

# Что можно сказать про обобщения genericts?
<!-- basicblock-start oid="ObsG3UoifX43ORVUcCdCY4JG"  deck='T_typescipt' -->
Что можно сказать про обобщения genericts?::


```
// Обобщения предоставляют переменные для типов.
// Распространенным примером является массив.
// Массив без обобщений может содержать что угодно.
// Массив с обобщениями может описывать значения, содержащиеся в массиве.


type StringArray = Array<string>
type NumberArray = Array<number>
type ObjectWithNameArray = Array<{name : string}>

// Bы можете объявить свой собственный тип, использую Дженерики
interface BackPack<Type> {
    add: (obj: Type) => void;
    get: () => Type;
}

// Эта строка - короткий путь сообщить TypeScript, что существует константа
// с именем `backpack` , и не беспокоиться о том, откуда она взялась.
declare const backpack: BackPack<string>

// object - это строка, потому что мы объявили ее выше как переменную часть Backpack .
const object = backpack.get();

// Поскольку backpack - это строка вы не можете передать число в функцию add
// backpack.add(23);
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram

# Что можно сказать про Generics /Обобщения?
<!-- basicblock-start oid="ObsBrRJL8hXciLhNINpsiMbR"  deck='T_typescipt' -->
Что можно сказать про Generics /Обобщения?::


// Обобщения предоставляют переменные для типов.
// Распространенным примером является массив.
// Массив без обобщений может содержать что угодно.
// Массив с обобщениями может описывать значения, содержащиеся в массиве.


type StringArray = Array<string>
type NumberArray = Array<number>
type ObjectWithNameArray = Array<{name : string}>

// Bы можете объявить свой собственный тип, использую Дженерики
interface BackPack<Type> {
add: (obj: Type) => void;
get: () => Type;
}

// Эта строка - короткий путь сообщить TypeScript, что существует константа
// с именем `backpack` , и не беспокоиться о том, откуда она взялась.
declare const backpack: BackPack<string>

// object - это строка, потому что мы объявили ее выше как переменную часть Backpack .
const object = backpack.get();

// Поскольку backpack - это строка вы не можете передать число в функцию add
// backpack.add(23);
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram

# Что можно сказать про объединения?
<!-- basicblock-start oid="ObsRN92YYpCltlvY5Jvp7dPh"  deck='T_typescipt' -->
Что можно сказать про объединения?::


```
// С помощью объединения вы можете объявить, что тип может быть одним из многих типов. Например, вы можете описать boolean тип как или true или false:
type MyBool = true | false;

// Примечание: Если вы наведете указатель мыши на MyBool выше, вы увидите, что он классифицируется как boolean. Это свойство системы структурных типов. Подробнее об этом ниже.
//
// Популярным вариантом использования типов объединения является описание набора string или number литералов, которым разрешено принимать значение:
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "Locked" | "Unlocked";
type PositiveOddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;

//  Объединения также предоставляют способ обработки различных типов. Например, у вас может быть функция, которая принимает array или string:
function getLength(obj: string | string[]) {
    return obj.length;
}

console.log(getLength(["saed",'afsdf','asf']));
console.log(getLength("str"));


// Например, вы можете заставить функцию возвращать разные значения в зависимости от того, передается ли ей строка или массив:
function wrapInArray(obj: string | string[]) {
    if (typeof obj === "string") {
        return [obj];


    }
    return obj;
};

console.log(wrapInArray('QWERTY'));
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram

# Какие способы и есть для создания комплексных типов(типов, которые объединяют в себе другие типы)?
<!-- basicblock-start oid="Obs7wltZBqHZ4EGygGtZKqnz"  deck='T_typescipt' -->
Какие способы и есть для создания комплексных типов(типов, которые объединяют в себе другие типы)?::


**Unions**

**Generics**
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram

# You can use interfaces to annotate parameters and return values to functions:
<!-- basicblock-start oid="ObsmWaOHSSwpx6HRz7Kmzrl8"  deck='T_typescipt' -->
You can use interfaces to annotate parameters and return values to functions:::


```
function deleteUser(user: User) {
  // ...
}
 
function getAdminUser(): User {
  //...
}
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram

# Поскольку JavaScript поддерживает классы и объектно-ориентированное программирование, то же самое делает и TypeScript. Вы можете использовать объявление интерфейса с классами:
<!-- basicblock-start oid="ObsxWcZNe6To12MLhLosPvt2"  deck='T_typescipt' -->
Поскольку JavaScript поддерживает классы и объектно-ориентированное программирование, то же самое делает и TypeScript. Вы можете использовать объявление интерфейса с классами:::


```
interface User {
  name: string;
  id: number;
}
 
class UserAccount {
  name: string;
  id: number;
 
  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}
 
const user: User = new UserAccount("Murphy", 1);
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram

# Defining Types это?
<!-- basicblock-start oid="ObsWE8uf8UWVYotFgRLNUiuZ"  deck='T_typescipt' -->
Defining Types это?::


В JavaScript можно использовать большое разнообразие шаблонов проектирования. Однако некоторые шаблоны проектирования затрудняют автоматический вывод типов (например, шаблоны, использующие динамическое программирование). Чтобы охватить эти случаи, TypeScript поддерживает расширение языка JavaScript, в котором есть места, где вы можете указать TypeScript, какими должны быть типы.

Например, чтобы создать объект с предполагаемым типом, который включает name: string и id: number, вы можете написать:

```
const user = {
  name: "Hayes",
  id: 0,
};
```

Вы можете четко описать форму этого объекта с помощью interface декларация:

```
interface User {
  name: string;
  id: number;
}
```
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram

# Types by inference это?
<!-- basicblock-start oid="ObsA72MTQGqh8coDnHCqiJ54"  deck='T_typescipt' -->
Types by inference это?::


TypeScript знает язык JavaScript и во многих случаях будет генерировать типы для вас. Например, при создании переменной и присвоении ей определенного значения TypeScript будет использовать значение в качестве своего типа.

Понимая, как работает JavaScript, TypeScript может создать систему типов, которая принимает код JavaScript, но имеет типы. Это предлагает систему типов без необходимости добавлять дополнительные символы, чтобы сделать типы явными в вашем коде. Вот как TypeScript узнает, что это helloWorld является a string в приведенном выше примере.

Возможно, вы написали JavaScript в коде Visual Studio и у вас было автозаполнение редактора. Visual Studio Code использует TypeScript под капотом, чтобы упростить работу с JavaScript.
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram

# Что можно сказать про optional propertyes?
<!-- basicblock-start oid="ObsekehVPwKwfOi5r8jg6qsC"  deck='T_typescipt' -->
Что можно сказать про optional propertyes?::


Типы объектов также могут указывать, что некоторые или все их свойства являются необязательными. Для этого добавьте ? после имени свойства:
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram

# Что можно сказать про типы объектов?
<!-- basicblock-start oid="ObsfyHZUNao1NxXEvzPo3V9k"  deck='T_typescipt' -->
Что можно сказать про типы объектов?::


Помимо примитивов, наиболее распространённым типом, с которым вы столкнётесь, является тип объекта. Это относится к любому значению JavaScript со свойствами, а таких почти все! Чтобы определить тип объекта, мы просто перечисляем его свойства и их типы.

Например, вот функция, которая принимает точечный объект:

```
// The parameter's type annotation is an object type
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

Здесь мы пометили параметр типом с двумя свойствами - x и y, - которые оба относятся к типу number. Вы можете использовать , или ; для разделения свойств, и последний разделитель в любом случае необязателен.
<!-- basicblock-end -->




#T_typescipt
#typescipt

#telegram

# Что такое contextual typing?
<!-- basicblock-start oid="ObsuwIWVCGjQqxJtVU6QebbL"  deck='T_typescipt' -->
Что такое contextual typing?::


```
const names = ["Alice", "Bob", "Eve"];
 
// Contextual typing for function - parameter s inferred to have type string
names.forEach(function (s) {
  console.log(s.toUpperCase());
});
 
// Contextual typing also applies to arrow functions
names.forEach((s) => {
  console.log(s.toUpperCase());
});
```

Несмотря на то, что параметр s не имел аннотации типа, TypeScript использовал типы forEach функции вместе с предполагаемым типом массива, чтобы определить тип, который s будет иметь.

Этот процесс называется контекстным набором текста, потому что контекст, в котором выполняется функция, сообщает, какой тип она должна иметь.

Подобно правилам вывода, вам не нужно явно изучать, как это происходит, но понимание того, что это действительно происходит, может помочь вам заметить, когда аннотации типов не нужны. Позже мы увидим больше примеров того, как контекст, в котором встречается значение, может влиять на его тип.
<!-- basicblock-end -->



