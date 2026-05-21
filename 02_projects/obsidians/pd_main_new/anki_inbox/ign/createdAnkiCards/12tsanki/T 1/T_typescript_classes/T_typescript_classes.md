
#T_typescript_classes1
#typescript_classes

#telegram 

Конечно! Вот список вопросов и ответов с примерами кода по заданным темам:

<!-- basicblock-start oid="Obs00R6Mp5qctJN2BTGAdn0a" deck='T_typescript_classes' --> 

1.1 Вопрос: "Что такое параметр свойства в TypeScript?" :: 
1.2 Ответ: "Параметр свойства позволяет создавать свойства класса на основе параметров конструктора." 
Пример кода:
```typescript
class Params {
  constructor(public readonly x: number, protected y: number, private z: number) {}
}
const a = new Params(1, 2, 3);
console.log(a.x); // 1
// console.log(a.z); // Ошибка: Property 'z' is private and only accessible within class 'Params'.
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsgtNrXWVeJ2bOKCLmzAXo1" deck='T_typescript_classes' --> 

2.1 Вопрос: "Какой модификатор доступа необходимо использовать перед параметром конструктора, чтобы создать его свойство как только для чтения?" :: 
2.2 Ответ: "`readonly`" 
Пример кода: 
```typescript
class Params {
  constructor(public readonly x: number) {}
}
const a = new Params(10);
console.log(a.x); // 10
// a.x = 20; // Ошибка: Cannot assign to 'x' because it is a constant or a read-only property.
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="Obsswt5pw5hV45kAHvBBdvoE" deck='T_typescript_classes' --> 

3.1 Вопрос: "Какой модификатор доступа делает свойство доступным только внутри класса и его подклассов?" :: 
3.2 Ответ: "`protected`" 
Пример кода: 
```typescript
class Base {
  protected value: number;
  constructor(value: number) {
    this.value = value;
  }
}
class Derived extends Base {
  showValue() {
    console.log(this.value); // Доступно, так как это подкласс
  }
}
const d = new Derived(5);
d.showValue(); // 5
// console.log(d.value); // Ошибка: Property 'value' is protected and only accessible within class 'Base' and its subclasses.
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsknJalHMfEafSNtqiexzQp" deck='T_typescript_classes' --> 

4.1 Вопрос: "Что произойдет, если попытаться использовать `private` свойство в подклассе?" :: 
4.2 Ответ: "Попытка доступа к `private` свойству в подклассе приведет к ошибке." 
Пример кода: 
```typescript
class Base {
  private secret: number;
  constructor(secret: number) {
    this.secret = secret;
  }
}
class Derived extends Base {
  revealSecret() {
    // console.log(this.secret); // Ошибка: Property 'secret' is private and only accessible within class 'Base'.
  }
}
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObscOdDKqhhpP2O5icnbWgdl" deck='T_typescript_classes' --> 

5.1 Вопрос: "Как параметры свойств влияют на читаемость кода?" :: 
5.2 Ответ: "Они делают код более лаконичным и понятным, уменьшая количество повторяющихся строк кода." 
Пример кода: 
```typescript
class User {
  constructor(public name: string, public age: number) {}
}
const user = new User("Alice", 30);
console.log(user.name); // Alice
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsMr23l7UzN4N8CPOAE6WKp" deck='T_typescript_classes' --> 

6.1 Вопрос: "Какой модификатор доступа делает свойство доступным в любом месте программы?" :: 
6.2 Ответ: "`public`" 
Пример кода: 
```typescript
class Example {
  public value: number;
  constructor(value: number) {
    this.value = value;
  }
}
const example = new Example(10);
console.log(example.value); // 10
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsEW3ZOD8StK5m4kINYVTp5" deck='T_typescript_classes' --> 

7.1 Вопрос: "Как параметр свойства отличается от обычного свойства класса?" :: 
7.2 Ответ: "Параметр свойства автоматически создает свойство на основе параметров конструктора без необходимости его явного объявления." 
Пример кода: 
```typescript
class AutoProperty {
  constructor(public auto: string) {} // auto автоматически создается как свойство
}
const obj = new AutoProperty("Hello");
console.log(obj.auto); // Hello
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="Obs7XhU4gigJIDX99EesBQRu" deck='T_typescript_classes' --> 

8.1 Вопрос: "Что произойдет, если попытаться создать два свойства с одинаковыми именами, используя разные модификаторы доступа?" :: 
8.2 Ответ: "Это приведет к конфликту имен и ошибке компиляции." 
Пример кода: 
```typescript
class Conflict {
  public x: number;
  private x: string; // Ошибка: Duplicate identifier 'x'.
  constructor() {
    this.x = 5; // Не достигнет компиляции из-за конфликта
  }
}
```
<!-- basicblock-end --> 

Если нужны дополнительные вопросы или изменения, дайте знать!

# Какое сообщение выдаст TypeScript при реализации через класс некоего интерфейса?
<!-- basicblock-start oid="Obs61CIizRfH8PQrwqDdRimf"  deck='T_typescript_classes' -->
Какое сообщение выдаст TypeScript при реализации через класс некоего интерфейса?::


    // Method ping from interface Pingable is not implemented

Да, в TypeScript для реализации интерфейса в классе необходимо **обязательно** реализовать все методы и свойства, которые описаны в интерфейсе. Это проверка на уровне компиляции, чтобы убедиться, что класс соответствует требованиям интерфейса. Если метод интерфейса не реализован, TypeScript выдаст ошибку, как в вашем примере с классом `Ball`.

В вашем коде:

```
interface Pingable {
    ping(): void;
}

class Sonar implements Pingable {
    ping() {
        console.log('Ping'); // frolov debug
    }
}

class Ball implements Pingable {
    pong() {
        console.log("Pong"); // frolov debug
    }
    // Ошибка: Метод ping из интерфейса Pingable не реализован
}
```

### Почему это важно?
TypeScript использует интерфейсы, чтобы обеспечить соответствие классов строгим требованиям. Если интерфейс `Pingable` говорит, что класс должен иметь метод `ping()`, то каждый класс, который его реализует, обязан предоставить такую реализацию. Это позволяет TypeScript гарантировать, что все объекты типа `Pingable` будут обладать нужными методами и свойствами.

### Можно ли избежать явной реализации методов?
Если метод интерфейса не нужен в каком-то классе, вы можете:

1. **Переопределить метод с пустой реализацией**, если метод интерфейса не используется. 
2. **Изменить интерфейс**, создав несколько интерфейсов для разного функционала и реализовав только нужные.

Пример с пустой реализацией:

```
class Ball implements Pingable {
    ping() {}  // Пустая реализация метода ping
    pong() {
        console.log("Pong"); // frolov debug
    }
}
```

Если метод `ping` действительно не нужен, можно создать отдельный интерфейс:

```
interface Pingable {
    ping(): void;
}

interface Pongable {
    pong(): void;
}

class Sonar implements Pingable {
    ping() {
        console.log("Ping");
    }
}

class Ball implements Pongable {
    pong() {
        console.log("Pong");
    }
}

``` 

В этом случае классы `Sonar` и `Ball` реализуют только нужные методы.
<!-- basicblock-end -->




#T_typescript_classes1
#typescript_classes

#telegram 


Вот список вопросов по теме классов в TypeScript с примерами кода.

<!-- basicblock-start oid="Obs1p0UqGGb5v05sjuijoWOS" deck='T_typescript_classes' --> 

1.1 Вопрос: "Какие основные особенности класса в TypeScript?" ::  
1.2 Ответ: "Класс в TypeScript — это структура, которая позволяет создавать объекты с определёнными свойствами и методами, также в классе можно добавлять аннотации типов и модификаторы доступа."  
Пример кода:
```typescript
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // Метод для вычисления расстояния до другой точки
  distanceTo(other: Point): number {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
  }
}
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="ObsjDup6WoX8QebosNmOzxvd" deck='T_typescript_classes' --> 

2.1 Вопрос: "Что такое поле класса и чем оно отличается от метода?" ::  
2.2 Ответ: "Поле класса — это переменная, которая определяет данные, принадлежащие объекту класса. Метод — это функция, которая описывает поведение объекта."  
Пример кода:
```typescript
class Car {
  color: string; // Поле класса
  constructor(color: string) {
    this.color = color;
  }

  drive(): void { // Метод класса
    console.log(`Машина ${this.color} цвета едет!`);
  }
}
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="ObsgVES5jinBbQ9YdmtkVU61" deck='T_typescript_classes' --> 

3.1 Вопрос: "Как в TypeScript работают `public`, `private` и `protected` модификаторы доступа?" ::  
3.2 Ответ: "Модификатор `public` делает свойство или метод доступным везде, `private` — только внутри класса, а `protected` — в классе и его наследниках."  
Пример кода:
```typescript
class Animal {
  public name: string;
  protected age: number;
  private isHungry: boolean;

  constructor(name: string, age: number, isHungry: boolean) {
    this.name = name;
    this.age = age;
    this.isHungry = isHungry;
  }

  public eat(): void {
    this.isHungry = false;
  }
}

class Dog extends Animal {
  constructor(name: string, age: number, isHungry: boolean) {
    super(name, age, isHungry);
  }

  public showInfo(): void {
    console.log(`Имя: ${this.name}, Возраст: ${this.age}`);
    // console.log(this.isHungry); // Ошибка: поле isHungry - private
  }
}
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="ObsRSApiX2Hq3qHlDHYAIgBB" deck='T_typescript_classes' --> 

4.1 Вопрос: "Что такое `readonly` поля и в чём их отличие от обычных полей?" ::  
4.2 Ответ: "Поля `readonly` нельзя изменять после их инициализации. Они задаются либо при объявлении, либо в конструкторе."  
Пример кода:
```typescript
class Book {
  readonly title: string;
  author: string;

  constructor(title: string, author: string) {
    this.title = title;
    this.author = author;
  }

  updateAuthor(newAuthor: string): void {
    this.author = newAuthor;
    // this.title = "Новое название"; // Ошибка: title - readonly
  }
}
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="Obs5u5z5dWlNafEPgruT7gKy" deck='T_typescript_classes' --> 

5.1 Вопрос: "Как в TypeScript работает `strictPropertyInitialization` и зачем он нужен?" ::  
5.2 Ответ: "Настройка `strictPropertyInitialization` требует, чтобы все свойства класса были инициализированы в конструкторе или имели начальные значения, чтобы избежать неопределенных значений."  
Пример кода:
```typescript
class User {
  name: string; // Ошибка при включенном strictPropertyInitialization

  constructor(name: string) {
    this.name = name;
  }
}

class Product {
  price = 0; // Здесь ошибки не будет, т.к. указано значение по умолчанию
}
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="ObsMFQ6Cs4gwhwEbhWnOagQR" deck='T_typescript_classes' --> 

6.1 Вопрос: "Чем отличаются `get` и `set` аксессоры от обычных методов?" ::  
6.2 Ответ: "Аксессоры `get` и `set` позволяют определять поведение при доступе к полям и их изменении, тогда как обычные методы вызываются вручную."  
Пример кода:
```typescript
class Rectangle {
  private _width: number = 0;

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    if (value > 0) {
      this._width = value;
    }
  }
}

const rect = new Rectangle();
rect.width = 10;  // Используется set
console.log(rect.width); // Используется get
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="ObsDzxtAHLDG5EEjlQ0pAMg0" deck='T_typescript_classes' --> 

7.1 Вопрос: "Как правильно использовать `super` для вызова конструктора родительского класса?" ::  
7.2 Ответ: "Для вызова конструктора родительского класса в производном классе используется `super`. Важно, что `super` нужно вызывать до обращения к `this`."  
Пример кода:
```typescript
class Vehicle {
  constructor(public brand: string) {}
}

class Car extends Vehicle {
  constructor(brand: string, public model: string) {
    super(brand); // Вызываем конструктор Vehicle
  }
}
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="ObsoKwOamH8BgxNfdIhYUibi" deck='T_typescript_classes' --> 

8.1 Вопрос: "В чём разница между полем и методом?" ::  
8.2 Ответ: "Поле — это свойство класса, которое хранит данные, а метод — это функция класса, описывающая его поведение."  
Пример кода:
```typescript
class Person {
  name: string; // Поле класса

  constructor(name: string) {
    this.name = name;
  }

  greet(): void { // Метод класса
    console.log(`Привет, ${this.name}!`);
  }
}
```

<!-- basicblock-end -->


Конечно, вот дополнительный список вопросов по указанным темам с примерами кода.

<!-- basicblock-start oid="ObshUURitzbkopQAjFXncLcn" deck='T_typescript_classes' --> 

1.1 Вопрос: "Что такое поля (fields) в классе TypeScript и как можно их инициализировать?" ::  
1.2 Ответ: "Поля класса представляют собой переменные, определенные в классе. Их можно инициализировать напрямую при объявлении или в конструкторе."  
Пример кода:
```typescript
class Car {
  color: string = "red"; // Инициализация поля при объявлении
  model: string;

  constructor(model: string) {
    this.model = model; // Инициализация поля в конструкторе
  }
}
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="ObsqAbLFq1kEWpdXygdHvQAQ" deck='T_typescript_classes' --> 

2.1 Вопрос: "Что делает модификатор `readonly` в полях класса?" ::  
2.2 Ответ: "`readonly` запрещает изменение значения поля после его инициализации."  
Пример кода:
```typescript
class Book {
  readonly title: string;

  constructor(title: string) {
    this.title = title;
  }

  changeTitle(newTitle: string) {
    // this.title = newTitle; // Ошибка: поле title — readonly
  }
}
```

<!-- basicblock-end -->  

Вот список вопросов по теме видимости членов класса и модификаторов доступа в TypeScript:

<!-- basicblock-start oid="Obs8DUSuvHTc65I4p9J5uJX0" deck='T_typescript_classes' --> 

1.1 Вопрос: "Что означает модификатор доступа `public` в классе TypeScript?" :: 
1.2 Ответ: "Модификатор доступа `public` делает член класса доступным откуда угодно."  
Пример кода:
```typescript
class Greeter {
  public greet() {
    console.log("hi!");
  }
}
const g = new Greeter();
g.greet(); // Вызов метода greet
```

<!-- basicblock-end --> 
Вот список вопросов по теме статических членов класса в TypeScript:

<!-- basicblock-start oid="ObsJgvrtZfiHPzKgqn0GxEih" deck='T_typescript_classes' --> 

1.1 Вопрос: "Что такое статические члены класса в TypeScript?" :: 
1.2 Ответ: "Статические члены класса не связаны с конкретным экземпляром класса и доступны через сам класс."  
Пример кода:
```typescript
class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}
console.log(MyClass.x); // Доступ к статическому члену
MyClass.printX(); // Вызов статического метода
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsNoYR4USdNVCV0yIUiXq9o" deck='T_typescript_classes' --> 

2.1 Вопрос: "Как можно использовать модификаторы видимости для статических членов?" :: 
2.2 Ответ: "Статические члены могут использовать модификаторы public, protected и private."  
Пример кода:
```typescript
class MyClass {
  private static x = 0;
}
// console.log(MyClass.x); // Ошибка: 'x' является приватным
```
<!-- basicblock-end --> 



<!-- basicblock-start oid="Obs4iooJFzQWGweb2Xb7xCol" deck='T_typescript_classes' --> 

3.1 Вопрос: "Как статические члены класса наследуются в TypeScript?" :: 
3.2 Ответ: "Статические члены класса могут быть унаследованы подклассами."  
Пример кода:
```typescript
class Base {
  static getGreeting() {
    return "Hello world";
  }
}
class Derived extends Base {
  myGreeting = Derived.getGreeting(); // Доступ к статическому методу
}
```

<!-- basicblock-end --> 

Понял, извините за путаницу! Вот список вопросов в правильном формате:

<!-- basicblock-start oid="ObsLh1NA0lTQHfLeZPRsgTAE" deck='T_typescript_classes' -->

1.1 Вопрос: "Что такое обобщенные классы в TypeScript?" ::
1.2 Ответ: "Обобщенные классы позволяют создавать классы с параметризованными типами, что делает код более универсальным и повторно используемым."  
Пример кода:
```typescript
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}
```

<!-- basicblock-end -->

<!-- basicblock-start oid="ObsHSNxKXVaAFvnw5TlGO01x" deck='T_typescript_classes' -->

2.1 Вопрос: "Как создается экземпляр обобщенного класса?" ::
2.2 Ответ: "Экземпляр обобщенного класса создается с указанием типа при вызове конструктора."  
Пример кода:
```typescript
const stringBox = new Box<string>("Hello");
const numberBox = new Box<number>(42);
```

<!-- basicblock-end -->

<!-- basicblock-start oid="ObsEWKAPeBxRPqzuV23H7Z0S" deck='T_typescript_classes' -->

3.1 Вопрос: "Как можно установить ограничения для параметров типа в обобщенном классе?" ::
3.2 Ответ: "Ограничения можно установить с помощью ключевого слова `extends`, чтобы указать, какие типы могут быть использованы."  
Пример кода:
```typescript
class Box<Type extends string | number> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}
```

<!-- basicblock-end -->

<!-- basicblock-start oid="Obsf7PRFcSAnKT1P1z6TTGE6" deck='T_typescript_classes' -->

4.1 Вопрос: "Почему статические члены обобщенных классов не могут ссылаться на параметры типа?" ::
4.2 Ответ: "Статические члены обобщенных классов не могут ссылаться на параметры типа, потому что они должны быть общими для всех экземпляров класса."  
Пример кода:
```typescript
class Box<Type> {
  static defaultValue: Type; // Ошибка: Статические члены не могут ссылаться на параметры типа
}
```

<!-- basicblock-end -->

<!-- basicblock-start oid="ObsPKlIjv1TPtrE2g97CmWaF" deck='T_typescript_classes' -->

5.1 Вопрос: "Как использовать `this` для динамического указания типа текущего класса?" ::
5.2 Ответ: "Тип `this` позволяет возвращать текущий тип класса, что полезно при создании цепочек методов."  
Пример кода:
```typescript
class Box {
  contents: string = "";
  set(value: string): this {
    this.contents = value;
    return this;
  }
}
```

<!-- basicblock-end -->

<!-- basicblock-start oid="ObsVS9EATTfkHAB4xZpdgjWO" deck='T_typescript_classes' -->

6.1 Вопрос: "Как использовать `this` в параметрах метода?" ::
6.2 Ответ: "Параметр `this` позволяет статически проверять, что метод был вызван с правильным контекстом."  
Пример кода:
```typescript
class MyClass {
  name = "MyClass";
  getName(this: MyClass) {
    return this.name;
  }
}
```

<!-- basicblock-end -->

<!-- basicblock-start oid="Obs8JI6Ad81rn8E446FC0StH" deck='T_typescript_classes' -->

7.1 Вопрос: "Как использовать стрелочные функции для сохранения контекста `this`?" ::
7.2 Ответ: "Стрелочные функции не создают собственный контекст `this`, что позволяет сохранить контекст класса."  
Пример кода:
```typescript
class MyClass {
  name = "MyClass";
  getName = () => {
    return this.name;
  };
}
```

<!-- basicblock-end -->

<!-- basicblock-start oid="ObsKhN2Z9oCBLM8gGCJC9Djh" deck='T_typescript_classes' -->

8.1 Вопрос: "Что такое `this`-основанные типовые охранники?" ::
8.2 Ответ: "Это метод, который возвращает тип текущего класса и помогает в определении типа объекта."  
Пример кода:
```typescript
class FileSystemObject {
  isFile(): this is FileRep {
    return this instanceof FileRep;
  }
}
```

<!-- basicblock-end -->

Если нужно больше вопросов или другая тематика, дайте знать!

<!-- basicblock-start oid="ObsubQz6e1B6UFQdjrV2Mv14" deck='T_typescript_classes' --> 

4.1 Вопрос: "Почему в TypeScript нет понятия 'статический класс'?" :: 
4.2 Ответ: "В TypeScript и JavaScript нет синтаксиса для статических классов, потому что эти языки не требуют всех данных и функций внутри класса."  
Пример кода:
```typescript
// Необходимость в статическом классе отсутствует
class MyStaticClass {
  static doSomething() {}
}

// Предпочтительный вариант
const MyHelperObject = {
  doSomething() {},
};
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsAu1e0trHjt7LChlMmdXYm" deck='T_typescript_classes' --> 

5.1 Вопрос: "Что такое статические блоки в классах TypeScript?" :: 
5.2 Ответ: "Статические блоки позволяют писать последовательности операторов с собственным контекстом и доступом к приватным полям класса."  
Пример кода:
```typescript
class Foo {
    static #count = 0;

    get count() {
        return Foo.#count;
    }

    static {
        const lastInstances = []; // пример загрузки данных
        Foo.#count += lastInstances.length; // Инициализация статического поля
    }
}
```

<!-- basicblock-end --> 

Этот список вопросов охватывает основные аспекты статических членов класса, их использование, наследование и специфику в TypeScript.
<!-- basicblock-start oid="Obs0Xl0wKzKYnUVF3ixChprZ" deck='T_typescript_classes' --> 

2.1 Вопрос: "Какой модификатор доступа используется для членов, доступных только в подклассах?" :: 
2.2 Ответ: "Модификатор доступа `protected` делает члены доступными только в своем классе и его подклассах."  
Пример кода:
```typescript
class Greeter {
  protected getName() {
    return "hi";
  }
}
class SpecialGreeter extends Greeter {
  public howdy() {
    console.log("Howdy, " + this.getName()); // Доступ к защищенному методу
  }
}
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsDneDc74UOqGDEJYMPcLGP" deck='T_typescript_classes' --> 

3.1 Вопрос: "Можно ли доступиться к защищенному члену класса из его подкласса?" :: 
3.2 Ответ: "Да, защищенные члены доступны только в классе и его подклассах."  
Пример кода:
```typescript
class Base {
  protected value = 42;
}
class Derived extends Base {
  public displayValue() {
    console.log(this.value); // Доступ к защищенному члену
  }
}
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsEtivz2FXXq2vylXV36NPe" deck='T_typescript_classes' --> 

4.1 Вопрос: "Как модификатор `private` влияет на доступ к членам класса?" :: 
4.2 Ответ: "Члены с модификатором `private` доступны только в своем классе и недоступны в подклассах."  
Пример кода:
```typescript
class Base {
  private secret = "hidden";
}
class Derived extends Base {
  public showSecret() {
    // console.log(this.secret); // Ошибка: 'secret' является приватным
  }
}
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsZBKgKMA6yicQbMfMrpOdE" deck='T_typescript_classes' --> 

5.1 Вопрос: "Какой уровень доступа имеют члены класса по умолчанию?" :: 
5.2 Ответ: "По умолчанию члены класса имеют уровень доступа `public`."  
Пример кода:
```typescript
class Example {
  greet() {
    console.log("Hello!"); // public по умолчанию
  }
}
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="Obs5mKUhd3J52NkGrRSOoohY" deck='T_typescript_classes' --> 

6.1 Вопрос: "Как можно сделать защищенный член класса публичным в подклассе?" :: 
6.2 Ответ: "Можно сделать защищенный член класса публичным, просто не указывая модификатор доступа."  
Пример кода:
```typescript
class Base {
  protected m = 10;
}
class Derived extends Base {
  public m = 15; // m теперь публичный
}
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsFiT8pEksokTpZCRRZyCeF" deck='T_typescript_classes' --> 

7.1 Вопрос: "Почему в TypeScript нельзя обращаться к защищенным членам других подклассов?" :: 
7.2 Ответ: "TypeScript не позволяет это делать для обеспечения инкапсуляции и защиты данных."  
Пример кода:
```typescript
class Base {
  protected x: number = 1;
}
class Derived1 extends Base {
  protected x: number = 5;
}
class Derived2 extends Base {
  f1(other: Derived2) {
    other.x = 10; // Доступ законен
  }
  f2(other: Derived1) {
    // console.log(other.x); // Ошибка: 'x' защищен
  }
}
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObseBB1iOw9brRpS3Jg6Rtvn" deck='T_typescript_classes' --> 

8.1 Вопрос: "Что происходит, если попытаться увеличить видимость приватного члена в подклассе?" :: 
8.2 Ответ: "Попытка увеличить видимость вызовет ошибку компиляции."  
Пример кода:
```typescript
class Base {
  private x = 0;
}
class Derived extends Base {
  // Ошибка: 'x' является приватным в типе 'Base'
  x = 1; 
}
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsaERz1iLKvaEdgDa0gTQo3" deck='T_typescript_classes' --> 

9.1 Вопрос: "Можно ли получить доступ к приватным членам одного экземпляра класса из другого?" :: 
9.2 Ответ: "Да, TypeScript позволяет доступ к приватным членам между экземплярами одного и того же класса."  
Пример кода:
```typescript
class A {
  private x = 10;
  public sameAs(other: A) {
    return other.x === this.x; // Нет ошибки
  }
}
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsbpMHSe09C8i1rJI975MWR" deck='T_typescript_classes' --> 

10.1 Вопрос: "Как можно обойти ограничения приватности в TypeScript?" :: 
10.2 Ответ: "Можно использовать нотацию квадратных скобок для доступа к приватным членам, но это не рекомендуется."  
Пример кода:
```typescript
class MySafe {
  private secretKey = 12345;
}
const s = new MySafe();
// console.log(s.secretKey); // Ошибка
console.log(s["secretKey"]); // OK, но не рекомендуется
```

<!-- basicblock-end --> 

Этот список вопросов охватывает ключевые аспекты видимости членов класса и модификаторов доступа в TypeScript.
<!-- basicblock-start oid="Obs0VgV8hr0LGg21F8Q0WRAU" deck='T_typescript_classes' --> 

3.1 Вопрос: "Как работают конструкторы в TypeScript и какие правила их создания?" ::  
3.2 Ответ: "Конструкторы инициализируют экземпляры класса и могут содержать параметры для задания значений полей."  
Пример кода:
```typescript
class Point {
  x: number;
  y: number;

  constructor(x = 0, y = 0) { // Конструктор с параметрами по умолчанию
    this.x = x;
    this.y = y;
  }
}
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="Obs5WuNlNENfff7tFY7aQYit" deck='T_typescript_classes' --> 

4.1 Вопрос: "Как работает модификатор `public` в полях и методах класса?" ::  
4.2 Ответ: "`public` делает поле или метод доступным везде, где существует объект класса."  
Пример кода:
```typescript
class Person {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  public sayHello(): void {
    console.log(`Hello, my name is ${this.name}`);
  }
}
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="Obs23HlSsgD2Hg6rb6Z9wvVE" deck='T_typescript_classes' --> 

5.1 Вопрос: "Для чего используется `protected` и где его лучше применять?" ::  
5.2 Ответ: "`protected` делает поле или метод доступным внутри класса и его подклассов."  
Пример кода:
```typescript
class Animal {
  protected species: string;

  constructor(species: string) {
    this.species = species;
  }
}

class Dog extends Animal {
  bark(): void {
    console.log(`Woof! I am a ${this.species}`);
  }
}
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="ObsGdLPyRYcQ1AmiWvK1jzIT" deck='T_typescript_classes' --> 

6.1 Вопрос: "Как работает модификатор `private` и чем он отличается от `protected`?" ::  
6.2 Ответ: "`private` делает поле или метод доступным только внутри класса, в котором оно объявлено."  
Пример кода:
```typescript
class BankAccount {
  private balance: number = 0;

  deposit(amount: number) {
    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }
}
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="ObsMN8LaEdvPUpRQLNyHj8Gk" deck='T_typescript_classes' --> 

7.1 Вопрос: "Для чего используются статические (`static`) члены в классе?" ::  
7.2 Ответ: "Статические члены принадлежат самому классу и доступны без создания экземпляра этого класса."  
Пример кода:
```typescript
class MathUtils {
  static PI: number = 3.14;

  static calculateCircleArea(radius: number): number {
    return MathUtils.PI * radius * radius;
  }
}

console.log(MathUtils.calculateCircleArea(5)); // Вывод: 78.5
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="ObsIUfNl01sTK4jASqGVcGhp" deck='T_typescript_classes' --> 

8.1 Вопрос: "Почему в TypeScript нет статических классов?" ::  
8.2 Ответ: "В TypeScript можно использовать модули и пространство имён для группировки статических методов и свойств, что делает статические классы избыточными."  
Пример кода:
```typescript
namespace MathUtils {
  export const PI = 3.14;

  export function calculateCircleArea(radius: number): number {
    return PI * radius * radius;
  }
}

console.log(MathUtils.calculateCircleArea(5)); // Вывод: 78.5
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="Obsx1MM8WYsXhJr84yVry8Vw" deck='T_typescript_classes' --> 

9.1 Вопрос: "Что такое `abstract` классы и члены класса?" ::  
9.2 Ответ: "`abstract` классы нельзя создавать напрямую. Они используются как базовые классы, и могут содержать абстрактные методы, которые должны быть реализованы в подклассах."  
Пример кода:
```typescript
abstract class Shape {
  abstract getArea(): number;
}

class Circle extends Shape {
  constructor(public radius: number) {
    super();
  }

  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="ObsHLquoqAyGvNV0qtr50f4B" deck='T_typescript_classes' --> 

10.1 Вопрос: "Что такое геттеры и сеттеры и когда их стоит использовать?" ::  
10.2 Ответ: "Геттеры и сеттеры предоставляют доступ к приватным полям и позволяют добавлять логику при чтении или записи значений."  
Пример кода:
```typescript
class Rectangle {
  private _width: number = 0;

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    if (value > 0) {
      this._width = value;
    }
  }
}
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="ObsN8skK4G5mwqRdwHo4IAxD" deck='T_typescript_classes' --> 

11.1 Вопрос: "Что такое `extends` и как использовать наследование в TypeScript?" ::  
11.2 Ответ: "`extends` позволяет создавать новый класс на основе другого класса, перенимая его свойства и методы."  
Пример кода:
```typescript
class Vehicle {
  move(): void {
    console.log("The vehicle is moving");
  }
}

class Car extends Vehicle {
  honk(): void {
    console.log("Honk! Honk!");
  }
}

const myCar = new Car();
myCar.move(); // Наследованный метод
myCar.honk(); // Метод класса Car
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="ObsagCyPB3gIVn3ror2OEFbI" deck='T_typescript_classes' --> 

12.1 Вопрос: "Как использовать дженерики в классах?" ::  
12.2 Ответ: "Дженерики позволяют параметризовать классы типами, что делает их более гибкими для различных типов данных."  
Пример кода:
```typescript
class Box<T> {
  contents: T;

  constructor(value: T) {
    this.contents = value;
  }

  getContents(): T {
    return this.contents;
  }
}

const stringBox = new Box<string>("Hello");
console.log(stringBox.getContents()); // Вывод: Hello
```

<!-- basicblock-end -->

Вот список вопросов и ответов с примерами кода по теме "Class Expressions":

<!-- basicblock-start oid="Obsds3FOMNuLEAreOsZqvvUI" deck='T_typescript_classes' --> 

1.1 Вопрос: "Что такое выражение класса в TypeScript?" :: 
1.2 Ответ: "Выражение класса позволяет создавать классы, не обязательно задавая им имя." 
Пример кода:
```typescript
const SomeClass = class {
  greet() {
    return "Hello!";
  }
};
const instance = new SomeClass();
console.log(instance.greet()); // Hello!
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="Obs2Pdd9kUmOmqNJ91nWOPvR" deck='T_typescript_classes' --> 

2.1 Вопрос: "Каковы основные отличия между выражениями класса и объявлениями класса?" :: 
2.2 Ответ: "Главное отличие в том, что выражения класса могут не иметь имени, в то время как объявления класса требуют имени." 
Пример кода: 
```typescript
// Объявление класса
class NamedClass {
  getName() {
    return "Named Class";
  }
}

// Выражение класса
const UnnamedClass = class {
  getName() {
    return "Unnamed Class";
  }
};
const instance = new UnnamedClass();
console.log(instance.getName()); // Unnamed Class
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsKkHgkqQtaaEb30lWpbTdS" deck='T_typescript_classes' --> 

3.1 Вопрос: "Можно ли создавать классы с параметрами типа при использовании выражения класса?" :: 
3.2 Ответ: "Да, можно использовать параметры типа в выражениях класса так же, как и в объявлениях." 
Пример кода: 
```typescript
const GenericClass = class<Type> {
  content: Type;
  constructor(value: Type) {
    this.content = value;
  }
};
const instance = new GenericClass<string>("Hello");
console.log(instance.content); // Hello
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsdN3nKC0IxUYJaup8NrjyV" deck='T_typescript_classes' --> 

4.1 Вопрос: "Можно ли использовать выражения класса как функции высшего порядка?" :: 
4.2 Ответ: "Да, можно передавать и возвращать выражения класса в функции." 
Пример кода: 
```typescript
function createClass<Type>() {
  return class {
    content: Type;
    constructor(value: Type) {
      this.content = value;
    }
  };
}

const DynamicClass = createClass<number>();
const instance = new DynamicClass(42);
console.log(instance.content); // 42
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="Obs9XWdTqsRncQRv0SkLux0g" deck='T_typescript_classes' --> 

5.1 Вопрос: "Как можно создать экземпляр класса, заданного через выражение класса?" :: 
5.2 Ответ: "Экземпляр создается так же, как и для обычного класса, с использованием ключевого слова `new`." 
Пример кода: 
```typescript
const AnotherClass = class {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
};
const anotherInstance = new AnotherClass("Instance Name");
console.log(anotherInstance.name); // Instance Name
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsNoN0oXtDAQAy8GVQKmXuX" deck='T_typescript_classes' --> 

6.1 Вопрос: "Можно ли присваивать выражение класса переменной и использовать её как класс?" :: 
6.2 Ответ: "Да, выражение класса можно присвоить переменной и использовать для создания экземпляров." 
Пример кода: 
```typescript
const MyClass = class {
  value: number;
  constructor(value: number) {
    this.value = value;
  }
};
const instance = new MyClass(100);
console.log(instance.value); // 100
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsVgXzLxfM20vXI53zENRnR" deck='T_typescript_classes' --> 

7.1 Вопрос: "Может ли выражение класса иметь доступ к параметрам своего конструктора?" :: 
7.2 Ответ: "Да, выражение класса может использовать параметры, переданные в его конструктор." 
Пример кода: 
```typescript
const ParamClass = class {
  constructor(public message: string) {}
  showMessage() {
    console.log(this.message);
  }
};
const instance = new ParamClass("Hello from ParamClass");
instance.showMessage(); // Hello from ParamClass
```
<!-- basicblock-end --> 

Если вам нужны дополнительные вопросы или изменения, дайте знать!

Вот список вопросов и ответов с примерами кода по теме "Constructor Signatures":

<!-- basicblock-start oid="ObsZw4AqkxyF8HJgjMYLtINc" deck='T_typescript_classes' --> 

1.1 Вопрос: "Что такое сигнатура конструктора в TypeScript?" :: 
1.2 Ответ: "Сигнатура конструктора определяет тип, который возвращается при создании экземпляра класса с помощью оператора `new`." 
Пример кода:

```typescript
class Circle {
  radius: number;
  constructor(radius: number) {
    this.radius = radius;
  }
}

type CircleInstance = InstanceType<typeof Circle>;
const myCircle: CircleInstance = new Circle(5);
console.log(myCircle.radius); // 5
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsvdZFlxPbUxr4XeqEkxJyu" deck='T_typescript_classes' --> 

2.1 Вопрос: "Как использовать утилиту InstanceType в TypeScript?" :: 
2.2 Ответ: "Утилита InstanceType позволяет получить тип экземпляра класса, чтобы его можно было использовать в других типах." 
Пример кода: 
```typescript
class Rectangle {
  width: number;
  height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

type RectangleInstance = InstanceType<typeof Rectangle>;
const rect: RectangleInstance = new Rectangle(10, 20);
console.log(rect.width, rect.height); // 10 20
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="Obs9s2eY1sYWBpHBbUIVjQAl" deck='T_typescript_classes' --> 

3.1 Вопрос: "Как создается экземпляр класса с помощью оператора new?" :: 
3.2 Ответ: "Экземпляр класса создается с использованием ключевого слова `new` перед именем класса, что вызывает его конструктор." 
Пример кода: 
```typescript
class Car {
  model: string;
  constructor(model: string) {
    this.model = model;
  }
}

const myCar = new Car("Tesla");
console.log(myCar.model); // Tesla
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="Obskldn75suLcNSecIvohlEY" deck='T_typescript_classes' --> 

4.1 Вопрос: "Можно ли передавать экземпляр класса в функцию?" :: 
4.2 Ответ: "Да, экземпляр класса может быть передан в функцию, которая принимает соответствующий тип." 
Пример кода: 
```typescript
class Dog {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

function bark(dog: Dog) {
  console.log(`${dog.name} says Woof!`);
}

const myDog = new Dog("Buddy");
bark(myDog); // Buddy says Woof!
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObshK3hzlO8RUUa8V0ILKbyB" deck='T_typescript_classes' --> 

5.1 Вопрос: "Что произойдет, если попытаться использовать утилиту InstanceType с типом, который не является классом?" :: 
5.2 Ответ: "В таком случае будет выдана ошибка компиляции, поскольку InstanceType ожидает класс или функцию." 
Пример кода: 
```typescript
type NotAClass = string;
// Ошибка: Type 'string' does not satisfy the constraint 'abstract new (...args: any) => any'.
type InstanceNotAClass = InstanceType<NotAClass>; 
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObstXYE7SA43YtPLW2rn0sTP" deck='T_typescript_classes' --> 

6.1 Вопрос: "Как определить, что экземпляр класса имеет конкретный тип?" :: 
6.2 Ответ: "Можно использовать утилиту InstanceType для проверки типа экземпляра и использования его в функции." 
Пример кода: 
```typescript
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

type PersonInstance = InstanceType<typeof Person>;

function greet(person: PersonInstance) {
  console.log(`Hello, ${person.name}!`);
}

const user = new Person("Alice");
greet(user); // Hello, Alice!
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsXH3fXOOeO9CgOdnhOEMSw" deck='T_typescript_classes' --> 

7.1 Вопрос: "Что происходит при вызове метода на экземпляре класса?" :: 
7.2 Ответ: "Метод вызывается в контексте экземпляра класса, и доступ к свойствам класса осуществляется через `this`." 
Пример кода: 
```typescript
class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move(deltaX: number, deltaY: number) {
    this.x += deltaX;
    this.y += deltaY;
  }
}

const pointInstance = new Point(1, 2);
pointInstance.move(2, 3);
console.log(pointInstance.x, pointInstance.y); // 3 5
```
<!-- basicblock-end --> 

Если вам нужны дополнительные вопросы или изменения, дайте знать!

Вот список вопросов и ответов с примерами кода по теме "Abstract Classes and Members":

<!-- basicblock-start oid="Obsd6Rz9ZDc9G5KX7V1GS0uP" deck='T_typescript_classes' --> 

1.1 Вопрос: "Что такое абстрактные классы в TypeScript?" :: 
1.2 Ответ: "Абстрактные классы в TypeScript — это классы, которые не могут быть инстанциированы напрямую и могут содержать абстрактные методы, требующие реализации в производных классах." 
Пример кода:
```typescript
abstract class Animal {
  abstract sound(): string; // Абстрактный метод
  makeSound() {
    console.log(this.sound());
  }
}

// const animal = new Animal(); // Ошибка: нельзя создать экземпляр абстрактного класса
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="Obsk3GHT3bD85s5GXR0m34kW" deck='T_typescript_classes' --> 

2.1 Вопрос: "Как реализовать абстрактные методы в производных классах?" :: 
2.2 Ответ: "Производные классы должны реализовать все абстрактные методы базового класса, иначе они также станут абстрактными." 
Пример кода: 
```typescript
abstract class Shape {
  abstract area(): number; // Абстрактный метод
}

class Rectangle extends Shape {
  constructor(public width: number, public height: number) {
    super();
  }
  area() {
    return this.width * this.height; // Реализация абстрактного метода
  }
}

const rect = new Rectangle(10, 5);
console.log(rect.area()); // 50
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsQo73bQI69GAaJeMafIBci" deck='T_typescript_classes' --> 

3.1 Вопрос: "Что произойдет, если производный класс не реализует абстрактный метод?" :: 
3.2 Ответ: "Если производный класс не реализует все абстрактные методы базового класса, он станет абстрактным и не может быть инстанциирован." 
Пример кода: 
```typescript
abstract class Vehicle {
  abstract drive(): void; // Абстрактный метод
}

class Car extends Vehicle {
  // Ошибка: класс Car не реализует метод drive
}

// const car = new Car(); // Ошибка: нельзя создать экземпляр абстрактного класса
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObslbGv8FO2BZXYSlAmJOx47" deck='T_typescript_classes' --> 

4.1 Вопрос: "Как создать функцию, принимающую конструктор абстрактного класса?" :: 
4.2 Ответ: "Для этого нужно использовать сигнатуру конструктора, чтобы гарантировать, что переданный класс является производным от абстрактного класса." 
Пример кода: 
```typescript
abstract class Base {
  abstract getName(): string;
  printName() {
    console.log("Hello, " + this.getName());
  }
}

function greet(ctor: new () => Base) {
  const instance = new ctor();
  instance.printName();
}

class Derived extends Base {
  getName() {
    return "world";
  }
}

greet(Derived); // Hello, world
// greet(Base); // Ошибка: нельзя передать абстрактный класс
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="Obs1zyC0eNTs5JIm8w13uNE7" deck='T_typescript_classes' --> 

5.1 Вопрос: "Что такое абстрактные сигнатуры конструктора?" :: 
5.2 Ответ: "Абстрактные сигнатуры конструктора позволяют определять функции, которые принимают конструкторы классов, производных от абстрактного класса." 
Пример кода: 
```typescript
abstract class Animal {
  abstract speak(): string;
}

function createAnimal(ctor: new () => Animal): Animal {
  return new ctor();
}

class Dog extends Animal {
  speak() {
    return "Woof!";
  }
}

const dog = createAnimal(Dog);
console.log(dog.speak()); // Woof!
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsvF6RFy3W7BPTyX9WFG00n" deck='T_typescript_classes' --> 

6.1 Вопрос: "Можно ли создать экземпляр абстрактного класса?" :: 
6.2 Ответ: "Нет, экземпляр абстрактного класса не может быть создан напрямую; вместо этого нужно использовать производные классы." 
Пример кода: 
```typescript
abstract class AbstractClass {
  abstract method(): void;
}

// const instance = new AbstractClass(); // Ошибка: нельзя создать экземпляр абстрактного класса
class ConcreteClass extends AbstractClass {
  method() {
    console.log("Concrete implementation");
  }
}

const concreteInstance = new ConcreteClass();
concreteInstance.method(); // Concrete implementation
```
<!-- basicblock-end --> 

Если нужны дополнительные вопросы или изменения, дайте знать!

Вот список вопросов и ответов с примерами кода по теме "Отношения между классами":

<!-- basicblock-start oid="Obs6iwxeNwaZDPuQjaSV1Az0" deck='T_typescript_classes' --> 

1.1 Вопрос: "Как сравниваются классы в TypeScript?" :: 
1.2 Ответ: "Классы в TypeScript сравниваются структурно, что означает, что они могут заменять друг друга, если имеют одинаковую структуру." 
Пример кода:
```typescript
class Point1 {
  x = 0;
  y = 0;
}

class Point2 {
  x = 0;
  y = 0;
}

// OK, Point1 и Point2 имеют одинаковую структуру
const p: Point1 = new Point2();
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsXMKDSl85dwuBcJjwhV7CM" deck='T_typescript_classes' --> 

2.1 Вопрос: "Что происходит при наличии классов с общей структурой?" :: 
2.2 Ответ: "Если классы имеют одинаковые члены, они могут использоваться взаимозаменяемо, даже если не наследуют друг от друга." 
Пример кода: 
```typescript
class Person {
  name: string;
  age: number;
}

class Employee {
  name: string;
  age: number;
  salary: number;
}

// OK, Employee является подтипом Person
const p: Person = new Employee();
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObshMSXmAmz03SprPhbT5aq1" deck='T_typescript_classes' --> 

3.1 Вопрос: "Как ведут себя пустые классы в TypeScript?" :: 
3.2 Ответ: "Пустые классы не имеют членов, поэтому они считаются суперклассом для всех остальных типов." 
Пример кода: 
```typescript
class Empty {}

function fn(x: Empty) {
  // Ничего не делаем с 'x', так как он пустой
}

// Все вызовы допустимы, так как Empty является суперклассом
fn(window);
fn({});
fn(fn);
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsDuRnDdgn0tkgBg3KtcuLI" deck='T_typescript_classes' --> 

4.1 Вопрос: "Может ли класс с меньшим числом членов использоваться вместо класса с большим?" :: 
4.2 Ответ: "Да, класс с меньшим числом членов может использоваться в качестве типа для класса с большим числом членов, если они имеют одинаковые члены." 
Пример кода: 
```typescript
class Animal {
  name: string;
}

class Dog extends Animal {
  bark() {
    console.log("Woof!");
  }
}

// OK, Dog можно использовать как Animal
const myPet: Animal = new Dog();
```
<!-- basicblock-end --> 

<!-- basicblock-start oid="ObswPVBSE6X7UWtg1ziVevFE" deck='T_typescript_classes' --> 

5.1 Вопрос: "Что происходит при попытке присвоить класс с не совпадающей структурой?" :: 
5.2 Ответ: "TypeScript выдаст ошибку компиляции, если классы имеют разные структуры и не могут быть взаимозаменяемыми." 
Пример кода: 
```typescript
class Car {
  wheels: number;
  engine: string;
}

class Bicycle {
  wheels: number;
}

// Ошибка: Bicycle не может быть использован как Car из-за отсутствия 'engine'
const vehicle: Car = new Bicycle(); // Ошибка компиляции
```
<!-- basicblock-end --> 

Если нужны дополнительные вопросы или изменения, дайте знать!