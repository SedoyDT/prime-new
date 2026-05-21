
#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Какие объекты поддерживает JSON?
<!-- basicblock-start oid="ObsEwDJIqyQgLQnZkMW10QLt"  deck='learnJsTasks_part_1_5_data_types' -->
Какие объекты поддерживает JSON?::


JSON поддерживает простые объекты, массивы, строки, числа, логические значения и null.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Для чего JSON.parse?
<!-- basicblock-start oid="ObsBpYwOWdk3xKSY9y3g1uBH"  deck='learnJsTasks_part_1_5_data_types' -->
Для чего JSON.parse?::


JSON.parse для преобразования JSON обратно в объект.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Для чего JSON.stringify?
<!-- basicblock-start oid="ObsJWFxFwW2whxxNpwyS6ucI"  deck='learnJsTasks_part_1_5_data_types' -->
Для чего JSON.stringify?::


JSON.stringify для преобразования объектов в JSON.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что можно сказать про методо toJson? 
<!-- basicblock-start oid="ObsG6cgKF113UmLxMSvQuLnB"  deck='learnJsTasks_part_1_5_data_types' -->
Что можно сказать про методо toJson? ::


Это своего рода магический методо, который вызывается когда мы пытаемся выполнить Json.stringify для объекта. Его можно переопределить.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# В Европейских странах неделя начинается с понедельника (день номер 1), затем идёт вторник (номер 2) и так до воскресенья (номер 7). Напишите функцию getLocalDay(date), которая возвращает «европейский» день недели для даты date.
<!-- basicblock-start oid="ObsPYArRmAsrkGrGUqP8z7kQ"  deck='learnJsTasks_part_1_5_data_types' -->
В Европейских странах неделя начинается с понедельника (день номер 1), затем идёт вторник (номер 2) и так до воскресенья (номер 7). Напишите функцию getLocalDay(date), которая возвращает «европейский» день недели для даты date.::


```

function getLocalDay(date) {

  let day = date.getDay();

  if (day == 0) { // день недели 0 (воскресенье) в европейской нумерации будет 7
    day = 7;
  }

  return day;
}
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Напишите функцию getWeekDay(date), показывающую день недели в коротком формате: «ПН», «ВТ», «СР», «ЧТ», «ПТ», «СБ», «ВС».
<!-- basicblock-start oid="ObsMPRsLmaLIMjxRkck3zauM"  deck='learnJsTasks_part_1_5_data_types' -->
Напишите функцию getWeekDay(date), показывающую день недели в коротком формате: «ПН», «ВТ», «СР», «ЧТ», «ПТ», «СБ», «ВС».::


function getWeekDay(date) {
  let days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

  return days[date.getDay()];
}

let date = new Date(2014, 0, 3); // 3 января 2014 года
alert( getWeekDay(date) ); // ПТ
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Создайте объект Date для даты: 20 февраля 2012 года, 3 часа 12 минут. Временная зона – местная.
<!-- basicblock-start oid="Obs2ObmcYQiN1vPIci47VtY1"  deck='learnJsTasks_part_1_5_data_types' -->
Создайте объект Date для даты: 20 февраля 2012 года, 3 часа 12 минут. Временная зона – местная.::


let d = new Date(2012, 1, 20, 3, 12);
alert( d );
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что в общем можно сказать про Date в js?
<!-- basicblock-start oid="ObsnXZ0Nl4IQTCzamqfHGpRy"  deck='learnJsTasks_part_1_5_data_types' -->
Что в общем можно сказать про Date в js?::


```


    Дата и время в JavaScript представлены объектом Date. Нельзя создать «только дату» или «только время»: объекты Date всегда содержат и то, и другое.
    Счёт месяцев начинается с нуля (да, январь – это нулевой месяц).
    Дни недели в getDay() также отсчитываются с нуля, что соответствует воскресенью.
    Объект Date самостоятельно корректируется при введении значений, выходящих за рамки допустимых. Это полезно для сложения/вычитания дней/месяцев/недель.
    Даты можно вычитать, и разность возвращается в миллисекундах. Так происходит, потому что при преобразовании в число объект Date становится таймстампом.
    Используйте Date.now() для быстрого получения текущего времени в формате таймстампа.

Учтите, что, в отличие от некоторых других систем, в JavaScript таймстамп в миллисекундах, а не в секундах.

Порой нам нужно измерить время с большей точностью. Собственными средствами JavaScript измерять время в микросекундах (одна миллионная секунды) нельзя, но в большинстве сред такая возможность есть. К примеру, в браузерах есть метод performance.now(), возвращающий количество миллисекунд с начала загрузки страницы с точностью до микросекунд (3 цифры после точки):

alert(`Загрузка началась ${performance.now()}мс назад`);
// Получаем что-то вроде: "Загрузка началась 34731.26000000001мс назад"
// .26 –- это микросекунды (260 микросекунд)
// корректными являются только первые три цифры после точки, а остальные -- это ошибка точности

В Node.js для этого предусмотрен модуль microtime и ряд других способов. Технически почти любое устройство или среда позволяет добиться большей точности, просто её нет в объекте Date.
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что делает метод Date.parse(str)?
<!-- basicblock-start oid="ObsuLb54WRotJH31jOKA0NWk"  deck='learnJsTasks_part_1_5_data_types' -->
Что делает метод Date.parse(str)?::


Метод Date.parse(str) считывает дату из строки.
Формат строки должен быть следующим: YYYY-MM-DDTHH:mm:ss.sssZ, где:
```

    YYYY-MM-DD – это дата: год-месяц-день.
    Символ "T" используется в качестве разделителя.
    HH:mm:ss.sss – время: часы, минуты, секунды и миллисекунды.
    Необязательная часть 'Z' обозначает часовой пояс в формате +-hh:mm. Если указать просто букву Z, то получим UTC+0.
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# У нас есть объект salaries с зарплатами:
<!-- basicblock-start oid="ObsqMp8Psh7N2dla8ntIx1dP"  deck='learnJsTasks_part_1_5_data_types' -->
У нас есть объект salaries с зарплатами:
```JS
let salaries = {
  "John": 100,
  "Pete": 300,
  "Mary": 250
};
```
Создайте функцию `topSalary(salaries)`, которая возвращает имя самого высокооплачиваемого сотрудника.

- Если объект `salaries` пустой, то нужно вернуть `null`.
- Если несколько высокооплачиваемых сотрудников, можно вернуть любого из них.

P.S. Используйте `Object.entries` и деструктурирование, чтобы перебрать пары ключ/значение.

::

```javascript
function topSalary(salaries) {

  let max = 0;
  let maxName = null;

  for(const [name, salary] of Object.entries(salaries)) {
    if (max < salary) {
      max = salary;
      maxName = name;
    }
  }

  return maxName;
}
```

<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# У нас есть объект:
<!-- basicblock-start oid="ObsD4au5ce5s6ievvfMwzNPi"  deck='learnJsTasks_part_1_5_data_types' -->
У нас есть объект:

```javascript
let user = {
  name: "John",
  years: 30
};
```

Напишите деструктурирующее присваивание, которое:

- свойство `name` присвоит в переменную `name`.
- свойство `years` присвоит в переменную `age`.
- свойство `isAdmin` присвоит в переменную `isAdmin` (false, если нет такого свойства)
  
  Пример переменных после вашего присваивания:
  
```javascript
let user = { name: "John", years: 30 };

// ваш код должен быть с левой стороны:
// ... = user

alert( name ); // John
alert( age ); // 30
alert( isAdmin ); // false
```
```

::

```js
let user = { name: "John", years: 30 };

let {name,years: age, isAdmin = false} = user;

console.log( name ); // John
console.log( age ); // 30
console.log( isAdmin ); // false
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# В общем о диструктуризации?
<!-- basicblock-start oid="Obs1oc8VRWdYZtFtuV93XUOv"  deck='learnJsTasks_part_1_5_data_types' -->
В общем о диструктуризации?::


Деструктуризация позволяет разбивать объект или массив на переменные при присвоении.

Полный синтаксис для объекта:

```

let {prop : varName = defaultValue, ...rest} = object
```


Cвойство prop объекта object здесь должно быть присвоено переменной varName. Если в объекте отсутствует такое свойство, переменной varName присваивается значение по умолчанию.

Свойства, которые не были упомянуты, копируются в объект rest.

Полный синтаксис для массива:

```

let [item1 = defaultValue, item2, ...rest] = array
```

- Можно извлекать данные из вложенных объектов и массивов, для этого левая сторона должна иметь ту же структуру, что и правая.

<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Как работают умные параметры функций и деструктуризация?
<!-- basicblock-start oid="ObsIuLsthfsD60MmLmkiMRfu"  deck='learnJsTasks_part_1_5_data_types' -->
Как работают умные параметры функций и деструктуризация?::


Есть ситуации, когда функция имеет много параметров, большинство из которых не обязательны. Это особенно верно для пользовательских интерфейсов. Представьте себе функцию, которая создаёт меню. Она может иметь ширину, высоту, заголовок, список элементов и так далее.

Вот так – плохой способ писать подобные функции:

```

function showMenu(title = "Untitled", width = 200, height = 100, items = []) {
  // ...
}

```

В реальной жизни проблема заключается в том, как запомнить порядок всех аргументов. Обычно IDE пытаются помочь нам, особенно если код хорошо документирован, но всё же… Другая проблема заключается в том, как вызвать функцию, когда большинство параметров передавать не надо, и значения по умолчанию вполне подходят.

Разве что вот так?

```

// undefined там, где подходят значения по умолчанию
showMenu("My Menu", undefined, undefined, ["Item1", "Item2"])

```
Это выглядит ужасно. И становится нечитаемым, когда мы имеем дело с большим количеством параметров.

На помощь приходит деструктуризация!

Мы можем передать параметры как объект, и функция немедленно деструктурирует его в переменные:

```

// мы передаём объект в функцию
let options = {
  title: "My menu",
  items: ["Item1", "Item2"]
};

// ...и она немедленно извлекает свойства в переменные
function showMenu({title = "Untitled", width = 200, height = 100, items = []}) {
  // title, items – взято из options,
  // width, height – используются значения по умолчанию
  alert( `${title} ${width} ${height}` ); // My Menu 200 100
  alert( items ); // Item1, Item2
}

showMenu(options);

```

Мы также можем использовать более сложное деструктурирование с вложенными объектами и двоеточием:

```

let options = {
  title: "My menu",
  items: ["Item1", "Item2"]
};

function showMenu({
  title = "Untitled",
  width: w = 100,  // width присваиваем в w
  height: h = 200, // height присваиваем в h
  items: [item1, item2] // первый элемент items присваивается в item1, второй в item2
}) {
  alert( `${title} ${w} ${h}` ); // My Menu 100 200
  alert( item1 ); // Item1
  alert( item2 ); // Item2
}

showMenu(options);

```

Полный синтаксис – такой же, как для деструктурирующего присваивания:

```

function({
  incomingProperty: varName = defaultValue
  ...
})

```

Тогда для объекта с параметрами будет создана переменная varName для свойства с именем incomingProperty по умолчанию равная defaultValue.

Пожалуйста, обратите внимание, что такое деструктурирование подразумевает, что в showMenu() будет обязательно передан аргумент. Если нам нужны все значения по умолчанию, то нам следует передать пустой объект:

```

showMenu({}); // ок, все значения - по умолчанию

showMenu(); // так была бы ошибка

```

Мы можем исправить это, сделав {} значением по умолчанию для всего объекта параметров:

```

function showMenu({ title = "Menu", width = 100, height = 200 } = {}) {
  alert( `${title} ${width} ${height}` );
}

showMenu(); // Menu 100 200

```
В приведённом выше коде весь объект аргументов по умолчанию равен {}, поэтому всегда есть что-то, что можно деструктурировать.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Как выглядит вложенная диструктуризация?
<!-- basicblock-start oid="Obsje7GWA5eC4ayk7ALpAmPE"  deck='learnJsTasks_part_1_5_data_types' -->
Как выглядит вложенная диструктуризация?::


```

let options = {
  size: {
    width: 100,
    height: 200
  },
  items: ["Cake", "Donut"],
  extra: true
};

// деструктуризация разбита на несколько строк для ясности
let {
  size: { // положим size сюда
    width,
    height
  },
  items: [item1, item2], // добавим элементы к items
  title = "Menu" // отсутствует в объекте (используется значение по умолчанию)
} = options;

alert(title);  // Menu
alert(width);  // 100
alert(height); // 200
alert(item1);  // Cake
alert(item2);  // Donut
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Как и в случае с массивами, значениями по умолчанию могут быть любые выражения или даже функции. Они выполнятся, если значения отсутствуют.
<!-- basicblock-start oid="ObsZ6nPXzt0oPy0P0nJnU3sO"  deck='learnJsTasks_part_1_5_data_types' -->
Как и в случае с массивами, значениями по умолчанию могут быть любые выражения или даже функции. Они выполнятся, если значения отсутствуют.::


В коде ниже prompt запросит width, но не title:
```

let options = {
  title: "Menu"
};

let {width = prompt("width?"), title = prompt("title?")} = options;

alert(title);  // Menu
alert(width);  // (результат prompt)
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Как работает деструктуризация объекта?
<!-- basicblock-start oid="ObsysEzltE6SkXLuL46Sh9IL"  deck='learnJsTasks_part_1_5_data_types' -->
Как работает деструктуризация объекта?::


let {var1, var2} = {var1:…, var2:…}

```

let options = {
  title: "Menu",
  width: 100,
  height: 200
};

let {title, width, height} = options;

alert(title);  // Menu
alert(width);  // 100
alert(height); // 200
```


Порядок не имеет значения. Вот так – тоже работает:

```

let {height, width, title} = { title: "Menu", height: 200, width: 100 }
```


Шаблон с левой стороны может быть более сложным и определять соответствие между свойствами и переменными.

Если мы хотим присвоить свойство объекта переменной с другим названием, например, свойство options.width присвоить переменной w, то мы можем использовать двоеточие:

```

let options = {
  title: "Menu",
  width: 100,
  height: 200
};

// { sourceProperty: targetVariable }
let {width: w, height: h, title} = options;

// width -> w
// height -> h
// title -> title

alert(title);  // Menu
alert(w);      // 100
alert(h);      // 200
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Как будет выглядеть деструктурирующее присваивание в цикле с entries?
<!-- basicblock-start oid="ObsN1nx1WB6vaayWEtNjIQkN"  deck='learnJsTasks_part_1_5_data_types' -->
Как будет выглядеть деструктурирующее присваивание в цикле с entries?::


```

let user = {
  name: "John",
  age: 30
};

// цикл по ключам и значениям
for (let [key, value] of Object.entries(user)) {
  alert(`${key}:${value}`); // name:John, затем age:30
}
```


тоже самое для map

```

let user = new Map();
user.set("name", "John");
user.set("age", "30");

// Map перебирает как пары [ключ, значение], что очень удобно для деструктурирования
for (let [key, value] of user) {
  alert(`${key}:${value}`); // name:John, затем age:30
}
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что такое Деструктурирующее присваивание?
<!-- basicblock-start oid="ObsEoWNLyZ5zZgtCKNYJfICT"  deck='learnJsTasks_part_1_5_data_types' -->
Что такое Деструктурирующее присваивание?::


Деструктурирующее присваивание – это специальный синтаксис, который позволяет нам «распаковать» массивы или объекты в несколько переменных, так как иногда они более удобны.

Деструктуризация также прекрасно работает со сложными функциями, которые имеют много параметров, значений по умолчанию и так далее. Скоро мы увидим это.

```

// у нас есть массив с именем и фамилией
let arr = ["Ilya", "Kantor"];

// деструктурирующее присваивание
// записывает firstName = arr[0]
// и surname = arr[1]
let [firstName, surname] = arr;

alert(firstName); // Ilya
alert(surname);  // Kantor
```


```

let [firstName, surname] = "Ilya Kantor".split(' ');
alert(firstName); // Ilya
alert(surname);  // Kantor
```


«Деструктуризация» не означает «разрушение».

«Деструктурирующее присваивание» не уничтожает массив. Оно вообще ничего не делает с правой частью присваивания, его задача – только скопировать нужные значения в переменные.

Это просто короткий вариант записи:

```

// let [firstName, surname] = arr;
let firstName = arr[0];
let surname = arr[1];}
```


Пропускайте элементы, используя запятые

Нежелательные элементы массива также могут быть отброшены с помощью дополнительной запятой:

```

// второй элемент не нужен
let [firstName, , title] = ["Julius", "Caesar", "Consul", "of the Roman Republic"];

alert( title ); // Consul
```

Работает с любым перебираемым объектом с правой стороны

…На самом деле мы можем использовать любой перебираемый объект, не только массивы:
```


let [a, b, c] = "abc";
let [one, two, three] = new Set([1, 2, 3]);
```

Присваивайте чему угодно с левой стороны

Мы можем использовать что угодно «присваивающее» с левой стороны.

Например, можно присвоить свойству объекта:
```


let user = {};
[user.name, user.surname] = "Ilya Kantor".split(' ');

alert(user.name); // Ilya
alert(user.surname); // Kantor
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Как получить массив пар ключ значение объекта?
<!-- basicblock-start oid="Obsoer7VmtHEBMjXtBjbEfzC"  deck='learnJsTasks_part_1_5_data_types' -->
Как получить массив пар ключ значение объекта?::


Object.entries(obj) – возвращает массив пар [ключ, значение].
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Как получить массив значений объекта?
<!-- basicblock-start oid="ObsRo638OqYv09gFze9SFbiG"  deck='learnJsTasks_part_1_5_data_types' -->
Как получить массив значений объекта?::


Object.values(obj) – возвращает массив значений.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Как получить массив ключей массива?
<!-- basicblock-start oid="ObszvURUGH39B3AuTOEwuFOO"  deck='learnJsTasks_part_1_5_data_types' -->
Как получить массив ключей объекта?::

- Деструктуризация позволяет разбивать объект или массив на переменные при присвоении.
Object.keys(obj) – возвращает массив ключей.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что в общем можно сказать про итерируемые объекты?
<!-- basicblock-start oid="Obsn3cm85pX5SiZ0tIqI5euW"  deck='learnJsTasks_part_1_5_data_types' -->
Что в общем можно сказать про итерируемые объекты?::


Объекты, которые можно использовать в цикле for..of, называются итерируемыми.

    Технически итерируемые объекты должны иметь метод Symbol.iterator.
        Результат вызова obj[Symbol.iterator] называется итератором. Он управляет процессом итерации.
        Итератор должен иметь метод next(), который возвращает объект {done: Boolean, value: any}, где done:true сигнализирует об окончании процесса итерации, в противном случае value – следующее значение.
    Метод Symbol.iterator автоматически вызывается циклом for..of, но можно вызвать его и напрямую.
    Встроенные итерируемые объекты, такие как строки или массивы, также реализуют метод Symbol.iterator.
    Строковый итератор знает про суррогатные пары.

Объекты, имеющие индексированные свойства и length, называются псевдомассивами. Они также могут иметь другие свойства и методы, но у них нет встроенных методов массивов.

Если мы заглянем в спецификацию, мы увидим, что большинство встроенных методов рассчитывают на то, что они будут работать с итерируемыми объектами или псевдомассивами вместо «настоящих» массивов, потому что эти объекты более абстрактны.

Array.from(obj[, mapFn, thisArg]) создаёт настоящий Array из итерируемого объекта или псевдомассива obj, и затем мы можем применять к нему методы массивов. Необязательные аргументы mapFn и thisArg позволяют применять функцию с задаваемым контекстом к каждому элементу.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что можно сказать про Array.from ?
<!-- basicblock-start oid="ObsBFFFQIhMoLNjXue8qKpCM"  deck='learnJsTasks_part_1_5_data_types' -->
Что можно сказать про Array.from ?::


Есть универсальный метод Array.from, который принимает итерируемый объект или псевдомассив и делает из него «настоящий» Array. После этого мы уже можем использовать методы массивов.

```

let arrayLike = {
  0: "Hello",
  1: "World",
  length: 2
};

let arr = Array.from(arrayLike); // (*)
alert(arr.pop()); // World (метод работает)
```


Array.from в строке (*) принимает объект, проверяет, является ли он итерируемым объектом или псевдомассивом, затем создаёт новый массив и копирует туда все элементы.

То же самое происходит с итерируемым объектом:

```

// range взят из примера в начале статьи

let arr = Array.from(range);
alert(arr); // 1,2,3,4,5 (преобразование массива через toString работает)
```


Полный синтаксис Array.from позволяет указать необязательную «трансформирующую» функцию:

```

Array.from(obj[, mapFn, thisArg])
```


Необязательный второй аргумент может быть функцией, которая будет применена к каждому элементу перед добавлением в массив, а thisArg позволяет установить this для этой функции.

Например:

```

// range взят из примера в начале статьи

// возводим каждое число в квадрат
let arr = Array.from(range, num => num * num);

alert(arr); // 1,4,9,16,25
```


Здесь мы используем Array.from, чтобы превратить строку в массив её элементов:

```
JS
let str = '𝒳😂';

// разбивает строку на массив её элементов
let chars = Array.from(str);

alert(chars[0]); // 𝒳
alert(chars[1]); // 😂
alert(chars.length); // 2
```


В отличие от str.split, этот метод в работе опирается на итерируемость строки, и поэтому, как и for..of, он корректно работает с суррогатными парами.

Технически это то же самое, что и:```


JS
let str = '𝒳😂';

let chars = []; // Array.from внутри себя выполняет тот же цикл
for (let char of str) {
  chars.push(char);
}

alert(chars
```);


…Но гораздо короче.

Мы можем даже создать slice, который поддерживает суррогатные пар```
ы:

JS
function slice(str, start, end) {
  return Array.from(str).slice(start, end).join('');
}

let str = '𝒳😂𩷶';

alert( slice(str, 1, 3) ); // 😂𩷶

// а вот встроенный метод не поддерживает суррогатные пары
alert( str.slice(1, 3) ); // мусор (две части различных суррогатных 
```пар)
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что можно сказать про итерируемые объекты и псевдомассивы?
<!-- basicblock-start oid="ObsH8ydGRzKBQ5IwiqdKv4fi"  deck='learnJsTasks_part_1_5_data_types' -->
Что можно сказать про итерируемые объекты и псевдомассивы?::


Есть два официальных термина, которые очень похожи, но в то же время сильно различаются. Поэтому убедитесь, что вы как следует поняли их, чтобы избежать путаницы.

    Итерируемые объекты – это объекты, которые реализуют метод Symbol.iterator, как было описано выше.
    Псевдомассивы – это объекты, у которых есть индексы и свойство length, то есть, они выглядят как массивы.

При использовании JavaScript в браузере или других окружениях мы можем встретить объекты, которые являются итерируемыми или псевдомассивами, или и тем, и другим.

Например, строки итерируемы (для них работает for..of) и являются псевдомассивами (они индексированы и есть length).

Но итерируемый объект может не быть псевдомассивом. И наоборот: псевдомассив может не быть итерируемым.

Например, объект range из примера выше – итерируемый, но не является псевдомассивом, потому что у него нет индексированных свойств и length.

А вот объект, который является псевдомассивом, но его нельзя итерировать:

```

let arrayLike = { // есть индексы и свойство length => псевдомассив
  0: "Hello",
  1: "World",
  length: 2
};

// Ошибка (отсутствует Symbol.iterator)
for (let item of arrayLike) {}

```

Что у них общего? И итерируемые объекты, и псевдомассивы – это обычно не массивы, у них нет методов push, pop и т.д. Довольно неудобно, если у нас есть такой объект и мы хотим работать с ним как с массивом. Например, мы хотели бы работать с range, используя методы массивов. Как этого достичь?
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Явный вызов итератора для строки что это такое и когда может понадобиться?
<!-- basicblock-start oid="ObsxtzgLNGZbHrb4yfuOkqKP"  deck='learnJsTasks_part_1_5_data_types' -->
Явный вызов итератора для строки что это такое и когда может понадобиться?::


```

let str = "Hello";

// делает то же самое, что и
// for (let char of str) alert(char);

let iterator = str[Symbol.iterator]();

while (true) {
  let result = iterator.next();
  if (result.done) break;
  alert(result.value); // выводит символы один за другим
}

```

Такое редко бывает необходимо, но это даёт нам больше контроля над процессом, чем for..of. Например, мы можем разбить процесс итерации на части: перебрать немного элементов, затем остановиться, сделать что-то ещё и потом продолжить.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что можно сказать про Symbol.iterator?
<!-- basicblock-start oid="ObsEvicCIBzqDsNinjNIIMOM"  deck='learnJsTasks_part_1_5_data_types' -->
Что можно сказать про Symbol.iterator?::


Мы легко поймём принцип устройства перебираемых объектов, создав один из них.

Например, у нас есть объект. Это не массив, но он выглядит подходящим для for..of.

Например, объект range, который представляет собой диапазон чисел:

```

let range = {
  from: 1,
  to: 5
};

// Мы хотим, чтобы работал for..of:
// for(let num of range) ... num=1,2,3,4,5

```
Чтобы сделать range итерируемым (и позволить for..of работать с ним), нам нужно добавить в объект метод с именем Symbol.iterator (специальный встроенный Symbol, созданный как раз для этого).

    Когда цикл for..of запускается, он вызывает этот метод один раз (или выдаёт ошибку, если метод не найден). Этот метод должен вернуть итератор – объект с методом next.
    Дальше for..of работает только с этим возвращённым объектом.
    Когда for..of хочет получить следующее значение, он вызывает метод next() этого объекта.
    Результат вызова next() должен иметь вид {done: Boolean, value: any}, где done=true означает, что цикл завершён, в противном случае value содержит очередное значение.

Вот полная реализация range с пояснениями:

```

let range = {
  from: 1,
  to: 5
};

// 1. вызов for..of сначала вызывает эту функцию
range[Symbol.iterator] = function() {

  // ...она возвращает объект итератора:
  // 2. Далее, for..of работает только с этим итератором,
  // запрашивая у него новые значения
  return {
    current: this.from,
    last: this.to,

    // 3. next() вызывается на каждой итерации цикла for..of
    next() {
      // 4. он должен вернуть значение в виде объекта {done:.., value :...}
      if (this.current <= this.last) {
        return { done: false, value: this.current++ };
      } else {
        return { done: true };
      }
    }
  };
};

// теперь работает!
for (let num of range) {
  alert(num); // 1, затем 2, 3, 4, 5
}

```

Обратите внимание на ключевую особенность итераторов: разделение ответственности.

    У самого range нет метода next().
    Вместо этого другой объект, так называемый «итератор», создаётся вызовом range[Symbol.iterator](), и именно его next() генерирует значения.

Таким образом, объект итератор отделён от самого итерируемого объекта.

Технически мы можем объединить их и использовать сам range как итератор, чтобы упростить код.

Например, вот так:

```

let range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    this.current = this.from;
    return this;
  },

  next() {
    if (this.current <= this.to) {
      return { done: false, value: this.current++ };
    } else {
      return { done: true };
    }
  }
};

for (let num of range) {
  alert(num); // 1, затем 2, 3, 4, 5
}


```

Теперь range[Symbol.iterator]() возвращает сам объект range: у него есть необходимый метод next(), и он запоминает текущее состояние итерации в this.current. Короче? Да. И иногда такой способ тоже хорош.

Недостаток такого подхода в том, что теперь мы не можем использовать этот объект в двух параллельных циклах for..of: у них будет общее текущее состояние итерации, потому что теперь существует лишь один итератор – сам объект. Но необходимость в двух циклах for..of, выполняемых одновременно, возникает редко, даже при наличии асинхронных операций.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что такое перебираемые объекты?
<!-- basicblock-start oid="ObstVsVxSSwyGHVFvcUcL7QR"  deck='learnJsTasks_part_1_5_data_types' -->
Что такое перебираемые объекты?::


Перебираемые (или итерируемые) объекты – это обобщение массивов. Концепция, которая позволяет использовать любой объект в цикле for..of.

Конечно же, сами массивы являются перебираемыми объектами. Но есть и много других встроенных перебираемых объектов, например, строки.

Если объект не является массивом, но представляет собой коллекцию каких-то элементов (список, набор), то удобно использовать цикл for..of для их перебора, так что давайте посмотрим, как это сделать.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Какие есть способы сгруппировать объект?
<!-- basicblock-start oid="ObsbKeTngUUzeVTanLGuOooZ"  deck='learnJsTasks_part_1_5_data_types' -->
Какие есть способы сгруппировать объект?::


Object.groupBy()

```

let users = [
  {id: 'john', name: "John Smith", age: 20},
  {id: 'ann', name: "Ann Smith", age: 24},
  {id: 'pete', name: "Pete Peterson", age: 31},
];

function groupById(arr) {
  let obj = {};
  arr.map(item => obj[item.id] = item);
  return obj;
}

function groupById2(array) {
  return array.reduce((obj, value) => {
    obj[value.id] = value;
    return obj;
  }, {})
}

let usersById = groupById(users);
console.log(usersById);
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Напишите функцию shuffle(array), которая перемешивает (переупорядочивает случайным образом) элементы массива.
<!-- basicblock-start oid="ObsQPEY6jCAOdkIdBTTUyA1t"  deck='learnJsTasks_part_1_5_data_types' -->
Напишите функцию shuffle(array), которая перемешивает (переупорядочивает случайным образом) элементы массива.::


```

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

let arr = [1, 2, 3];
shuffle(arr);
alert(arr);

```

Это, конечно, будет работать, потому что Math.random() - 0.5 отдаёт случайное число, которое может быть положительным или отрицательным, следовательно, функция сортировки меняет порядок элементов случайным образом.

Но поскольку метод sort не предназначен для использования в таких случаях, не все возможные варианты имеют одинаковую вероятность.

Например, рассмотрим код ниже. Он запускает shuffle 1000000 раз и считает вероятность появления для всех возможных вариантов arr:

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

// подсчёт вероятности для всех возможных вариантов
let count = {
  '123': 0,
  '132': 0,
  '213': 0,
  '231': 0,
  '321': 0,
  '312': 0
};

for (let i = 0; i < 1000000; i++) {
  let array = [1, 2, 3];
  shuffle(array);
  count[array.join('')]++;
}

// показать количество всех возможных вариантов
for (let key in count) {
  alert(`${key}: ${count[key]}`);
}

Результат примера (зависят от движка JS):

123: 250706
132: 124425
213: 249618
231: 124880
312: 125148
321: 125223

Теперь мы отчётливо видим допущенное отклонение: 123 и 213 появляются намного чаще, чем остальные варианты.

Результаты этого кода могут варьироваться при запуске на разных движках JavaScript, но очевидно, что такой подход не надёжен.

Так почему это не работает? Если говорить простыми словами, то sort это «чёрный ящик»: мы бросаем в него массив и функцию сравнения, ожидая получить отсортированный массив. Но из-за абсолютной хаотичности сравнений чёрный ящик сходит с ума, и как именно он сходит с ума, зависит от конкретной его реализации, которая различна в разных движках JavaScript.

Есть и другие хорошие способы решить эту задачу. Например, есть отличный алгоритм под названием Тасование Фишера — Йетса. Суть заключается в том, чтобы проходить по массиву в обратном порядке и менять местами каждый элемент со случайным элементом, который находится перед ним.


```

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i

    // поменять элементы местами
    // мы используем для этого синтаксис "деструктурирующее присваивание"
    // подробнее о нём - в следующих главах
    // то же самое можно записать как:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
}

```

Давайте проверим эту реализацию на том же примере:

```

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// подсчёт вероятности для всех возможных вариантов
let count = {
  '123': 0,
  '132': 0,
  '213': 0,
  '231': 0,
  '321': 0,
  '312': 0
};

for (let i = 0; i < 1000000; i++) {
  let array = [1, 2, 3];
  shuffle(array);
  count[array.join('')]++;
}

// показать количество всех возможных вариантов
for (let key in count) {
  alert(`${key}: ${count[key]}`);
}

```
Теперь всё в порядке: все варианты появляются с одинаковой вероятностью.

Кроме того, если посмотреть с точки зрения производительности, то алгоритм «Тасование Фишера — Йетса» намного быстрее, так как в нём нет лишних затрат на сортировку.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Напишите функцию filterRange(arr, a, b), которая принимает массив arr, ищет элементы со значениями больше или равными a и меньше или равными b и возвращает результат в виде массива.
<!-- basicblock-start oid="Obsb6uC2TilWiumpRJbqxDv8"  deck='learnJsTasks_part_1_5_data_types' -->
Напишите функцию filterRange(arr, a, b), которая принимает массив arr, ищет элементы со значениями больше или равными a и меньше или равными b и возвращает результат в виде массива.::


```

function filterRange(arr,start,end) {
  return arr.filter(item => item >= start && item <= end)
}

let arr = [5, 3, 8, 1];

let filtered = filterRange(arr, 1, 4);

console.log(filtered); // 3,1 (совпадающие значения)
console.log(arr); // 5,3,8,1 (без изменений)
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что в ЦЕЛОМ МОЖНО СКАЗАТЬ ПРО МАССИВЫ?
<!-- basicblock-start oid="ObspAh6mo42uuyHpLph17obo"  deck='learnJsTasks_part_1_5_data_types' -->
Что в ЦЕЛОМ МОЖНО СКАЗАТЬ ПРО МАССИВЫ?::


Шпаргалка по методам массива:

    Для добавления/удаления элементов:
        push(...items) – добавляет элементы в конец,
        pop() – извлекает элемент с конца,
        shift() – извлекает элемент с начала,
        unshift(...items) – добавляет элементы в начало.
        splice(pos, deleteCount, ...items) – начиная с индекса pos удаляет deleteCount элементов и вставляет items.
        slice(start, end) – создаёт новый массив, копируя в него элементы с индекса start до end (не включая end).
        concat(...items) – возвращает новый массив: копирует все члены текущего массива и добавляет к нему items. Если какой-то из items является массивом, тогда берутся его элементы.

    Для поиска среди элементов:
        indexOf/lastIndexOf(item, pos) – ищет item, начиная с позиции pos, и возвращает его индекс или -1, если ничего не найдено.
        includes(value) – возвращает true, если в массиве имеется элемент value, в противном случае false.
        find/filter(func) – фильтрует элементы через функцию и отдаёт первое/все значения, при прохождении которых через функцию возвращается true.
        findIndex похож на find, но возвращает индекс вместо значения.

    Для перебора элементов:
        forEach(func) – вызывает func для каждого элемента. Ничего не возвращает.

    Для преобразования массива:
        map(func) – создаёт новый массив из результатов вызова func для каждого элемента.
        sort(func) – сортирует массив «на месте», а потом возвращает его.
        reverse() – «на месте» меняет порядок следования элементов на противоположный и возвращает изменённый массив.
        split/join – преобразует строку в массив и обратно.
        reduce/reduceRight(func, initial) – вычисляет одно значение на основе всего массива, вызывая func для каждого элемента и передавая промежуточный результат между вызовами.

    Дополнительно:
        Array.isArray(arr) проверяет, является ли arr массивом.

Пожалуйста, обратите внимание, что методы push, pop, shift, unshift, sort, reverse и splice изменяют исходный массив.

Эти методы – самые используемые, их достаточно в 99% случаев. Но существуют и другие:

    arr.some(fn)/arr.every(fn) проверяет массив.

    Функция fn вызывается для каждого элемента массива аналогично map. Если какие-либо/все результаты вызовов являются true, то метод возвращает true, иначе false.

    Эти методы ведут себя примерно так же, как операторы || и &&: если fn возвращает истинное значение, arr.some() немедленно возвращает true и останавливает перебор остальных элементов; если fn возвращает ложное значение, arr.every() немедленно возвращает false и также прекращает перебор остальных элементов.

    Мы можем использовать every для сравнения массивов:

    function arraysEqual(arr1, arr2) {
      return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
    }

    alert( arraysEqual([1, 2], [1, 2])); // true

    arr.fill(value, start, end) – заполняет массив повторяющимися value, начиная с индекса start до end.

    arr.copyWithin(target, start, end) – копирует свои элементы, начиная с позиции start и заканчивая end, в себя, на позицию target (перезаписывая существующие).

    arr.flat(depth)/arr.flatMap(fn) создаёт новый плоский массив из многомерного массива.

Полный список есть в справочнике MDN.

На первый взгляд может показаться, что существует очень много разных методов, которые довольно сложно запомнить. Но это гораздо проще, чем кажется.

Внимательно изучите шпаргалку, представленную выше, а затем, чтобы попрактиковаться, решите задачи, предложенные в данной главе. Так вы получите необходимый опыт в правильном использовании методов массива.

Всякий раз, когда вам будет необходимо что-то сделать с массивом, а вы не знаете, как это сделать – приходите сюда, смотрите на таблицу и ищите правильный метод. Примеры помогут вам всё сделать правильно, и вскоре вы быстро запомните методы без особых усилий.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что можно сказать про thisArg?
<!-- basicblock-start oid="ObsE0ouTahpnalwQXcAQUCfN"  deck='learnJsTasks_part_1_5_data_types' -->
Что можно сказать про thisArg?::


Большинство методов поддерживают «thisArg»

Почти все методы массива, которые вызывают функции – такие как find, filter, map, за исключением метода sort, принимают необязательный параметр thisArg.

Этот параметр не объяснялся выше, так как очень редко используется, но для наиболее полного понимания темы мы обязаны его рассмотреть.

Вот полный синтаксис этих методов:

```

arr.find(func, thisArg);
arr.filter(func, thisArg);
arr.map(func, thisArg);
// ...
// thisArg -- необязательный последний аргумент

```

Значение параметра thisArg становится this для func.

Например, тут мы используем метод объекта army как фильтр, и thisArg передаёт ему контекст:

```

let army = {
  minAge: 18,
  maxAge: 27,
  canJoin(user) {
    return user.age >= this.minAge && user.age < this.maxAge;
  }
};

let users = [
  {age: 16},
  {age: 20},
  {age: 23},
  {age: 30}
];

// найти пользователей, для которых army.canJoin возвращает true
let soldiers = users.filter(army.canJoin, army);

alert(soldiers.length); // 2
alert(soldiers[0].age); // 20
alert(soldiers[1].age); // 23

```

Если бы мы в примере выше использовали просто users.filter(army.canJoin), то вызов army.canJoin был бы в режиме отдельной функции, с this=undefined. Это тут же привело бы к ошибке.

Вызов users.filter(army.canJoin, army) можно заменить на users.filter(user => army.canJoin(user)), который делает то же самое. Последняя запись используется даже чаще, так как функция-стрелка более наглядна.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Как проверить что массив это массив?
<!-- basicblock-start oid="ObsR8MTeylyVlVJZYvONP0fV"  deck='learnJsTasks_part_1_5_data_types' -->
Как проверить что массив это массив?::


Массивы не образуют отдельный тип данных. Они основаны на объектах.

Поэтому typeof не может отличить простой объект от массива:

…Но массивы используются настолько часто, что для этого придумали специальный метод: Array.isArray(value). Он возвращает true, если value массив, и false, если нет.


alert(Array.isArray({})); // false

alert(Array.isArray([])); // true
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что делает метод reduce/reduceRight?
<!-- basicblock-start oid="ObstGcv4O5ZQjo7OuXiFjNGs"  deck='learnJsTasks_part_1_5_data_types' -->
Что делает метод reduce/reduceRight?::


Когда нам нужно перебрать массив – мы можем использовать forEach, for или for..of.

Когда нам нужно перебрать массив и вернуть данные для каждого элемента – мы можем использовать map.

Методы arr.reduce и arr.reduceRight похожи на методы выше, но они немного сложнее. Они используются для вычисления единого значения на основе всего массива.

Синтаксис:

```

let value = arr.reduce(function(accumulator, item, index, array) {
  // ...
}, [initial]);
```

Функция применяется по очереди ко всем элементам массива и «переносит» свой результат на следующий вызов.

Аргументы:

    accumulator – результат предыдущего вызова этой функции, равен initial при первом вызове (если передан initial),
    item – очередной элемент массива,
    index – его позиция,
    array – сам массив.

При вызове функции результат её предыдущего вызова передаётся на следующий вызов в качестве первого аргумента.

Так, первый аргумент является по сути аккумулятором, который хранит объединённый результат всех предыдущих вызовов функции. По окончании он становится результатом reduce.

Звучит сложно?

Этот метод проще всего понять на примере.

Тут мы получим сумму всех элементов массива одной строкой:

```

let arr = [1, 2, 3, 4, 5];
let result = arr.reduce((sum, current) => sum + current, 0);
alert(result); // 15
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что можно сказать про методы split и join?
<!-- basicblock-start oid="ObsptSHrKURgbhFo8IgNUhWP"  deck='learnJsTasks_part_1_5_data_types' -->
Что можно сказать про методы split и join?::


Ситуация из реальной жизни. Мы пишем приложение для обмена сообщениями, и посетитель вводит имена тех, кому его отправить, через запятую: Вася, Петя, Маша. Но нам-то гораздо удобнее работать с массивом имён, чем с одной строкой. Как его получить?

Метод str.split(delim) именно это и делает. Он разбивает строку на массив по заданному разделителю delim.

В примере ниже таким разделителем является строка из запятой и пробела.

```

let names = 'Вася, Петя, Маша';

let arr = names.split(', ');

for (let name of arr) {
  alert( `Сообщение получат: ${name}.` ); // Сообщение получат: Вася (и другие имена)
}
```

У метода split есть необязательный второй числовой аргумент – ограничение на количество элементов в массиве. Если их больше, чем указано, то остаток массива будет отброшен. На практике это редко используется:

```

let arr = 'Вася, Петя, Маша, Саша'.split(', ', 2);
alert(arr); // Вася, Петя
```


Разбивка по буквам

Вызов split(s) с пустым аргументом s разбил бы строку на массив букв:

```

let str = "тест";
alert( str.split('') ); // т,е,с,т
```


Вызов arr.join(glue) делает в точности противоположное split. Он создаёт строку из элементов arr, вставляя glue между ними.

Например:
```

let arr = ['Вася', 'Петя', 'Маша'];
let str = arr.join(';'); // объединить массив в строку через ;
alert( str ); // Вася;Петя;Маша
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что делает метод array.reverse?
<!-- basicblock-start oid="ObsnXgy5LIKcYqsqS2MQegmq"  deck='learnJsTasks_part_1_5_data_types' -->
Что делает метод array.reverse?::


Метод arr.reverse меняет порядок элементов в arr на обратный.

```

let arr = [1, 2, 3, 4, 5];
arr.reverse();

alert( arr ); // 5,4,3,2,1

```

Он также возвращает массив arr с изменённым порядком элементов.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что можно сказать про метод sort?
<!-- basicblock-start oid="ObsXybttKCgm19rwdWlPguV9"  deck='learnJsTasks_part_1_5_data_types' -->
Что можно сказать про метод sort?::


Вызов arr.sort() сортирует массив на месте, меняя в нём порядок элементов.

Он также возвращает отсортированный массив, но обычно возвращаемое значение игнорируется, так как изменяется сам arr.

Например:

```

let arr = [ 1, 2, 15 ];

// метод сортирует содержимое arr
arr.sort();

alert( arr );  // 1, 15, 2

```

Не заметили ничего странного в этом примере?

Порядок стал 1, 15, 2. Это неправильно. Но почему?

По умолчанию элементы сортируются как строки.

Буквально, элементы преобразуются в строки при сравнении. Для строк применяется лексикографический порядок, и действительно выходит, что "2" > "15".

Чтобы использовать наш собственный порядок сортировки, нам нужно предоставить функцию в качестве аргумента arr.sort().

Функция должна для пары значений возвращать:

```

function compare(a, b) {
  if (a > b) return 1; // если первое значение больше второго
  if (a == b) return 0; // если равны
  if (a < b) return -1; // если первое значение меньше второго
}

```

Например, для сортировки чисел:

```

function compareNumeric(a, b) {
  if (a > b) return 1;
  if (a == b) return 0;
  if (a < b) return -1;
}
let arr = [ 1, 2, 15 ];
arr.sort(compareNumeric);
alert(arr);  // 1, 2, 15

```

Теперь всё работает как надо.

Сделаем отступление и подумаем, что происходит. arr может быть массивом чего угодно, верно? Он может содержать числа, строки, объекты или что-то ещё. У нас есть набор каких-то элементов. Чтобы отсортировать его, нам нужна упорядочивающая функция, которая знает, как сравнивать его элементы. По умолчанию элементы сортируются как строки.

Метод arr.sort(fn) реализует общий алгоритм сортировки. Нам не нужно заботиться о том, как он работает внутри (в большинстве случаев это оптимизированная быстрая сортировка или Timsort). Она проходится по массиву, сравнивает его элементы с помощью предоставленной функции и переупорядочивает их. Всё, что нам нужно, – предоставить fn, которая делает сравнение.

Кстати, если мы когда-нибудь захотим узнать, какие элементы сравниваются – ничто не мешает нам вывести их на экран:

[1, -2, 15, 2, 0, 8].sort(function(a, b) {
  alert( a + " <> " + b );
  return a - b;
});

В процессе работы алгоритм может сравнивать элемент со множеством других, но он старается сделать как можно меньше сравнений.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что можно сказать про метод map?
<!-- basicblock-start oid="Obsdrl2cCGGXKRYqgdTVwsWg"  deck='learnJsTasks_part_1_5_data_types' -->
Что можно сказать про метод map?::


Метод arr.map является одним из наиболее полезных и часто используемых.
Он вызывает функцию для каждого элемента массива и возвращает массив результатов выполнения этой функции.

```

let result = arr.map(function(item, index, array) {
  // возвращается новое значение вместо элемента
});
```


Например, здесь мы преобразуем каждый элемент в его длину:

```

let lengths = ["Бильбо", "Гэндальф", "Назгул"].map(item => item.length);
alert(lengths); // 6,8,6
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что делает метод filter?
<!-- basicblock-start oid="Obsq2ZzfkwpgsMyxy4tUXhDL"  deck='learnJsTasks_part_1_5_data_types' -->
Что делает метод filter?::


Метод find ищет один (первый) элемент, который заставит функцию вернуть true.
Если найденных элементов может быть много, можно использов**ать arr.filter**(fn).

Синтаксис схо**ж с** find,** но f**ilter возвращает массив из всех подходящих элементов:

```

let results = arr.filter(function(item, index, array) {
  // если `true` -- элемент добавляется к results и перебор продолжается
  // возвращается пустой массив в случае, если ничего не найдено
});
```

```

let users = [
  {id: 1, name: "Вася"},
  {id: 2, name: "Петя"},
  {id: 3, name: "Маша"}
];

// возвращает массив, состоящий из двух первых пользователей
let someUsers = users.filter(item => item.id < 3);

alert(someUsers.length); // 2
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что можно сказать про методы find, findIndex, findLastIndexOf?
<!-- basicblock-start oid="ObsR7bN9PC3oCw71ymqeb5m4"  deck='learnJsTasks_part_1_5_data_types' -->
Что можно сказать про методы find, findIndex, findLastIndexOf?::


Представьте, что у нас есть массив объектов. Как нам найти объект с определённым условием?

Здесь пригодится метод arr.find.

Синтаксис:
```

let result = arr.find(function(item, index, array) {
  // если true - возвращается текущий элемент и перебор прерывается
  // если все итерации оказались ложными, возвращается undefined
});
```


Функция вызывается по очереди для каждого элемента массива:

    item – очередной элемент.
    index – его индекс.
    array – сам массив.


Если функция возвращает true, поиск прерывается и возвращается item. Если ничего не найдено, возвращается undefined.
Например, у нас есть массив пользователей, каждый из которых имеет поля id и name. Найдем пользователя с id == 1:

```

let users = [
  {id: 1, name: "Вася"},
  {id: 2, name: "Петя"},
  {id: 3, name: "Маша"}
];

let user = users.find(item => item.id == 1);

alert(user.name); // Вася
```


В реальной жизни массивы объектов – обычное дело, поэтому метод find крайне полезен.

Обратите внимание, что в данном примере мы передаём find функцию item => item.id == 1 с одним аргументом. Это типично, другие аргументы этой функции используются редко.

У метода arr.findIndex такой же синтаксис, но он возвращает индекс, на котором был найден элемент, а не сам элемент. Значение -1 возвращается, если ничего не найдено.

Метод arr.findLastIndex похож на findIndex, но ищет справа налево, наподобие lastIndexOf.

```

let users = [
  {id: 1, name: "Вася"},
  {id: 2, name: "Петя"},
  {id: 3, name: "Маша"},
  {id: 4, name: "Вася"}
];

// Найти индекс первого Васи
alert(users.findIndex(user => user.name == 'Вася')); // 0

// Найти индекс последнего Васи
alert(users.findLastIndex(user => user.name == 'Вася')); // 3
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Метод includes правильно обрабатывает
<!-- basicblock-start oid="ObsZyjXyyQo5FKp71ELhWAUD"  deck='learnJsTasks_part_1_5_data_types' -->
Метод includes правильно обрабатывает::

 
NaN

Незначительная, но заслуживающая внимания особенность includes – он правильно обрабатывает NaN, в отличие от indexOf:

```

const arr = [NaN];
alert( arr.indexOf(NaN) ); // -1 (неверно, должен быть 0)
alert( arr.includes(NaN) );// true (верно)

```
Это связано с тем, что includes был добавлен в JavaScript гораздо позже и использует более современный алгоритм сравнения.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что можно сказать про arr.indexOf, arr.includes?
<!-- basicblock-start oid="ObskWUZWdfaC82mwW0KOvzJK"  deck='learnJsTasks_part_1_5_data_types' -->
Что можно сказать про arr.indexOf, arr.includes?::


У методов arr.indexOf и arr.includes одинаковый синтаксис и они делают по сути то же самое, что и их строковые аналоги, но работают с элементами вместо символов:

```

arr.indexOf(item, from) ищет item начиная с индекса from и возвращает номер индекса, на котором был найден искомый элемент, в противном случае -1.

arr.includes(item, from) ищет item начиная с индекса from и возвращает true, если поиск успешен.
```


Обычно эти методы используются только с одним аргументом: искомым item. По умолчанию поиск ведется с начала.
```

let arr = [1, 0, false];

alert( arr.indexOf(0) ); // 1
alert( arr.indexOf(false) ); // 2
alert( arr.indexOf(null) ); // -1

alert( arr.includes(1) ); // true
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что можно сказать про метод forEach?
<!-- basicblock-start oid="ObsyC3c7PwMyHKX66wSx2TI1"  deck='learnJsTasks_part_1_5_data_types' -->
Что можно сказать про метод forEach?::


Метод arr.forEach позволяет запускать функцию для каждого элемента массива.

Синтаксис:
```

arr.forEach(function(item, index, array) {
  // ... делать что-то с item
});
```

Например, этот код выведет на экран каждый элемент массива:

// Вызов alert для каждого элемента
["Бильбо", "Гэндальф", "Назгул"].forEach(alert);

А этот вдобавок расскажет и о позиции элемента в целевом массиве:

```

["Бильбо", "Гэндальф", "Назгул"].forEach((item, index, array) => {
  alert(`У ${item} индекс ${index} в ${array}`);
});
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что можно сказать про arr.concat?
<!-- basicblock-start oid="Obsmd3j3MDj4wIlP4j26Jdas"  deck='learnJsTasks_part_1_5_data_types' -->
Что можно сказать про arr.concat?::


Метод arr.concat создаёт новый массив, в который копирует данные из других массивов и дополнительные значения.

Синтаксис:

```

arr.concat(arg1, arg2...)
```


Он принимает любое количество аргументов, которые могут быть как массивами, так и простыми значениями.

В результате – новый массив, включающий в себя элементы из arr, затем arg1, arg2 и так далее.

Если аргумент argN – массив, то копируются все его элементы. Иначе копируется сам аргумент.

Например:
```

let arr = [1, 2];

// создать массив из: arr и [3,4]
alert( arr.concat([3, 4]) ); // 1,2,3,4

// создать массив из: arr и [3,4] и [5,6]
alert( arr.concat([3, 4], [5, 6]) ); // 1,2,3,4,5,6

// создать массив из: arr и [3,4], потом добавить значения 5 и 6
alert( arr.concat([3, 4], 5, 6) ); // 1,2,3,4,5,6
```


Обычно он копирует только элементы из массивов. Другие объекты, даже если они выглядят как массивы, добавляются как есть:

```

let arr = [1, 2];
let arrayLike = {
  0: "что-то",
  length: 1
};
alert( arr.concat(arrayLike) ); // 1,2,[object Object]
```

…Но если массивоподобный объект имеет специальное свойство Symbol.isConcatSpreadable, то он обрабатывается как массив, с помощью concat: вместо него добавляются его элементы:

```

let arr = [1, 2];

let arrayLike = {
  0: "что-то",
  1: "ещё",
  [Symbol.isConcatSpreadable]: true,
  length: 2
};

alert( arr.concat(arrayLike) ); // 1,2,что-то,ещё
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что можно сказать про slice?
<!-- basicblock-start oid="Obs3iisHwROloNfeI65XB9pJ"  deck='learnJsTasks_part_1_5_data_types' -->
Что можно сказать про slice?::


Метод arr.slice намного проще, чем похожий на него arr.splice.

Синтаксис:

```

arr.slice([start], [end])

```

Он возвращает новый массив, в который копирует все элементы с индекса start до end (не включая end). start и end могут быть отрицательными, в этом случае отсчёт позиции будет вестись с конца массива.

Это похоже на строковый метод str.slice, но вместо подстрок возвращает подмассивы.

Например:

```

let arr = ["t", "e", "s", "t"];
alert( arr.slice(1, 3) ); // e,s (копирует с 1 до 3)
alert( arr.slice(-2) ); // s,t (копирует с -2 до конца)

```

Можно вызвать slice без аргументов: arr.slice() создаёт копию arr. Это часто используют, чтобы создать копию массива для дальнейших преобразований, которые не должны менять исходный массив.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что такое arr.splice?
<!-- basicblock-start oid="ObsOMJtSzGV8HBSSdjILGL3g"  deck='learnJsTasks_part_1_5_data_types' -->
Что такое arr.splice?::


Метод arr.splice – это универсальный «швейцарский нож» для работы с массивами. Умеет всё: добавлять, удалять и заменять элементы.

Синтаксис:

```

arr.splice(start[, deleteCount, elem1, ..., elemN])
```


Он изменяет arr начиная с индекса start: удаляет deleteCount элементов и затем вставляет elem1, ..., elemN на их место. Возвращает массив из удалённых элементов.

Этот метод легко понять, рассмотрев примеры.

Начнём с удаления:

```

let arr = ["Я", "изучаю", "JavaScript"];

arr.splice(1, 1); // начиная с индекса 1, удалить 1 элемент

alert( arr ); // осталось ["Я", "JavaScript"]
```


Легко, правда? Начиная с индекса 1, он убрал 1 элемент.

В следующем примере мы удалим 3 элемента и заменим их двумя другими.

```

let arr = ["Я", "изучаю", "JavaScript", "прямо", "сейчас"];

// удалить 3 первых элемента и заменить их другими
arr.splice(0, 3, "Давай", "танцевать");

alert( arr ) // теперь ["Давай", "танцевать", "прямо", "сейчас"]
```

Здесь видно, что splice возвращает массив из удалённых элементов:

```

let arr = ["Я", "изучаю", "JavaScript", "прямо", "сейчас"];

// удалить 2 первых элемента
let removed = arr.splice(0, 2);

alert( removed ); // "Я", "изучаю" <-- массив из удалённых элементов
```

Метод splice также может вставлять элементы без удаления, для этого достаточно установить deleteCount в 0:

```

let arr = ["Я", "изучаю", "JavaScript"];

// с индекса 2
// удалить 0 элементов
// вставить "сложный", "язык"
arr.splice(2, 0, "сложный", "язык");

alert( arr ); // "Я", "изучаю", "сложный", "язык", "JavaScript"
```

Отрицательные индексы разрешены

В этом и в других методах массива допускается использование отрицательных индексов. Они определяют позицию с конца массива, как тут:

```

let arr = [1, 2, 5];

// начиная с индекса -1 (перед последним элементом)
// удалить 0 элементов,
// затем вставить числа 3 и 4
arr.splice(-1, 0, 3, 4);

alert( arr ); // 1,2,3,4,5
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Отсортировать пользователей по возрасту
<!-- basicblock-start oid="ObsGrlbw1WTAU43O8DKqebxJ"  deck='learnJsTasks_part_1_5_data_types' -->
Отсортировать пользователей по возрасту
Напишите функцию `sortByAge(users)`, которая принимает массив объектов со свойством `age` и сортирует их по нему.

Например:
```javascript
let vasya = { name: "Вася", age: 25 };
let petya = { name: "Петя", age: 30 };
let masha = { name: "Маша", age: 28 };

let arr = [ vasya, petya, masha ];

sortByAge(arr);

// теперь: [vasya, masha, petya]
alert(arr[0].name); // Вася
alert(arr[1].name); // Маша
alert(arr[2].name); // Петя
```

::

Решение 1
```JS
let vasya = { name: "Вася", age: 25 };
let petya = { name: "Петя", age: 30 };
let masha = { name: "Маша", age: 28 };

let arr = [ vasya, petya, masha ];

function sortByAge(arr) {
  return arr.sort((a,b) => {
  if (a.age > b.age) return 1; // если первое значение больше второго
  if (a.age == b.age) return 0; // если равны
  if (a.age < b.age) return -1; // если первое значение меньше второго
  });
}

sortByAge(arr);

console.log(arr);
```

Решение 2
```javascript
function sortByAge(arr) {
  arr.sort((a, b) => a.age - b.age);
}

let vasya = { name: "Вася", age: 25 };
let petya = { name: "Петя", age: 30 };
let masha = { name: "Маша", age: 28 };

let arr = [ vasya, petya, masha ];

sortByAge(arr);

// теперь отсортировано: [vasya, masha, petya]
alert(arr[0].name); // Вася
alert(arr[1].name); // Маша
alert(arr[2].name); // Петя
```

<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# У вас есть массив объектов user, и у каждого из объектов есть name, surname и id.
<!-- basicblock-start oid="ObsEgfKa2Asfe1BGvJkZkq1C"  deck='learnJsTasks_part_1_5_data_types' -->
У вас есть массив объектов user, и у каждого из объектов есть name, surname и id.
Напишите код, который создаст ещё один массив объектов с параметрами `id` и `fullName`, где `fullName` – состоит из `name` и `surname`.



Например: 
```javascript
let vasya = { name: "Вася", surname: "Пупкин", id: 1 };
let petya = { name: "Петя", surname: "Иванов", id: 2 };
let masha = { name: "Маша", surname: "Петрова", id: 3 };

let users = [ vasya, petya, masha ];

let usersMapped = /* ... ваш код ... */

/*
usersMapped = [
  { fullName: "Вася Пупкин", id: 1 },
  { fullName: "Петя Иванов", id: 2 },
  { fullName: "Маша Петрова", id: 3 }
]
*/
```
Итак, на самом деле вам нужно трансформировать один массив объектов в другой. Попробуйте использовать `=>`. Это небольшая уловка.

::

```javascript
let vasya = { name: "Вася", surname: "Пупкин", id: 1 };
let petya = { name: "Петя", surname: "Иванов", id: 2 };
let masha = { name: "Маша", surname: "Петрова", id: 3 };

let users = [ vasya, petya, masha ];

let usersMapped = users.map(user => ({
  fullName: `${user.name} ${user.surname}`,
  id: user.id
}));

/*
usersMapped = [
  { fullName: "Вася Пупкин", id: 1 },
  { fullName: "Петя Иванов", id: 2 },
  { fullName: "Маша Петрова", id: 3 }
]
*/

alert( usersMapped[0].id ); // 1
alert( usersMapped[0].fullName ); // Вася Пупкин
```

Обратите внимание, что для стрелочных функций мы должны использовать дополнительные скобки.

Мы не можем написать вот так:

```javascript
let usersMapped = users.map(user => {
  fullName: `${user.name} ${user.surname}`,
  id: user.id
});
```

Как мы помним, есть две функции со стрелками: без тела `value => expr` и с телом `value => {...}`.

Здесь JavaScript будет трактовать `{` как начало тела функции, а не начало объекта. Чтобы обойти это, нужно заключить их в «нормальные» скобки:

```javascript
let usersMapped = users.map(user => ({
  fullName: `${user.name} ${user.surname}`,
  id: user.id
}));
```

<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# У вас есть массив объектов user, и в каждом из них есть user.name. Напишите код, который преобразует их в массив имён.
<!-- basicblock-start oid="ObsLLzr3OA8XxyAoKtYsHBDV"  deck='learnJsTasks_part_1_5_data_types' -->
У вас есть массив объектов user, и в каждом из них есть user.name. Напишите код, который преобразует их в массив имён.::


```JS

let vasya = { name: "Вася", age: 25 };
let petya = { name: "Петя", age: 30 };
let masha = { name: "Маша", age: 28 };

let users = [ vasya, petya, masha ];

let names = users.map(item => item.name);

alert( names ); // Вася, Петя, Маша
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Создайте функцию конструктор Calculator, которая создаёт «расширяемые» объекты калькулятора. Во-первых, реализуйте метод calculate(str), который принимает строку типа "1 + 2" в формате «ЧИСЛО оператор ЧИСЛО» (разделено пробелами) и возвращает результат. Метод должен понимать плюс + и минус -.Затем добавьте метод addMethod(name, func), который добавляет в калькулятор новые операции. Он принимает оператор name и функцию с двумя аргументами func(a,b), которая описывает его.
<!-- basicblock-start oid="ObsnXhPzHDjQQvv1vi9CKvFq"  deck='learnJsTasks_part_1_5_data_types' -->
Создайте функцию конструктор Calculator, которая создаёт «расширяемые» объекты калькулятора. Во-первых, реализуйте метод calculate(str), который принимает строку типа "1 + 2" в формате «ЧИСЛО оператор ЧИСЛО» (разделено пробелами) и возвращает результат. Метод должен понимать плюс + и минус -.Затем добавьте метод addMethod(name, func), который добавляет в калькулятор новые операции. Он принимает оператор name и функцию с двумя аргументами func(a,b), которая описывает его.::


```

function Calculator() {
  this.methods = {
    "+": (a,b) => a + b,
    "-": (a,b) => a - b,
  }
  
  this.calculate = function(str) {
    let arr = str.split(" ");
    return (arr[0]arr[1]arr[2]; 
  }
}

let calc = new Caclucalor;
console.log(calc.calculate("1 + 2"));
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Сортировать в порядке по убыванию?
<!-- basicblock-start oid="ObsXbA92curxZtMj5zTV3IsB"  deck='learnJsTasks_part_1_5_data_types' -->
Сортировать в порядке по убыванию?::


Решение 1
```

let arr = [5, 2, 1, -10, 8];
arr.sort((a, b) => b - a);

```
Решение 2
```JS
let arr = [5, 2, 1, -10, 8];

for (let i = 0; i<arr.length; i++) {
  // console.log("Sring with " + arr[i] +" " + (i+1))
  for (let j = 0; j<arr.length; j++){
    if (arr[i] > arr[j]){
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
}
console.log(arr);
```

<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что такое length у массива 
<!-- basicblock-start oid="Obs4KDn6fzYGBcu3vCnq8ckK"  deck='learnJsTasks_part_1_5_data_types' -->
Что такое length у массива ::


это наибольщий числдовй индекс + 1;
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Как перебрать массив?
<!-- basicblock-start oid="Obs4CpWVQKLbbMSupd5h4X0j"  deck='learnJsTasks_part_1_5_data_types' -->
Как перебрать массив?::


for of

```
let fruits = ["Яблоко", "Апельсин", "Слива"];

// проходит по значениям
for (let fruit of fruits) {
  alert( fruit );
}
```

```
let arr = ["Яблоко", "Апельсин", "Груша"];

for (let key in arr) {
  alert( arr[key] ); // Яблоко, Апельсин, Груша
}
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Создайте функцию extractCurrencyValue(str), которая будет из такой "$120" строки выделять числовое значение и возвращать его.
<!-- basicblock-start oid="ObsjCKhBMuA9ZTJHI437QTmO"  deck='learnJsTasks_part_1_5_data_types' -->
Создайте функцию extractCurrencyValue(str), которая будет из такой "$120" строки выделять числовое значение и возвращать его.::


```
function  extractCurrencyValue(str) {
  return +str.substring(1,str.length);
}
console.log(extractCurrencyValue('$120') === 120)
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Напишите функцию checkSpam(str), возвращающую true, если str содержит 'viagra' или 'XXX', а иначе false.
<!-- basicblock-start oid="Obs3h32fSrBLHtZegZpD1Mat"  deck='learnJsTasks_part_1_5_data_types' -->
Напишите функцию checkSpam(str), возвращающую true, если str содержит 'viagra' или 'XXX', а иначе false.::


```
function checkSpam(str) {
  if (str.includes("xxx") || str.includes("viagra")) {
    return false;
  }   
  return true
}
console.log(checkSpam('buy ViAgRA now'))
console.log(checkSpam('free xxxxx'))
console.log(checkSpam("innocent rabbit"))
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Напиши функцию которая возвращает строку с увеличением первого символа
<!-- basicblock-start oid="ObsFzVH44HB16ZvwRDLvuMRX"  deck='learnJsTasks_part_1_5_data_types' -->
Напиши функцию которая возвращает строку с увеличением первого символа::


```
function ucFirst(str) {
  let first = str.slice(0,1).toUpperCase();
  let word = str.slice(1);
  str = first + word;
  return str;
}
console.log(ucFirst("cтрока"));
```
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что самое основное можно скзать о строках?
<!-- basicblock-start oid="ObsWv1mvP8aXECSrhGjaie6a"  deck='learnJsTasks_part_1_5_data_types' -->
Что самое основное можно скзать о строках?::

str.trim() — убирает пробелы в начале и конце строки.
str.repeat(n) — повторяет строку n раз.
…и другие, которые вы можете найти в справочнике.
Для строк предусмотрены методы для поиска и замены с использованием регулярных выражений. Но это отдельная большая тема, поэтому ей посвящена отдельная глава учебника Регулярные выражения.

Также, на данный момент важно знать, что строки основаны на кодировке Юникод, и поэтому иногда могут возникать проблемы со сравнениями. Подробнее о Юникоде в главе Юникод, внутреннее устройство строк.

Есть три типа кавычек. Строки, использующие обратные кавычки, могут занимать более одной строки в коде и включать выражения ${…}.
Строки в JavaScript кодируются в UTF-16.
Есть специальные символы, такие как разрыв строки \n.
Для получения символа используйте [] или метод at.
Для получения подстроки используйте slice или substring.
Для того, чтобы перевести строку в нижний или верхний регистр, используйте toLowerCase/toUpperCase.
Для поиска подстроки используйте indexOf или includes/startsWith/endsWith, когда надо только проверить, есть ли вхождение.
Чтобы сравнить строки с учётом правил языка, используйте localeCompare.
Строки также имеют ещё кое-какие полезные методы:

<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Как в js  получить значение true/false проверкой есть ли в строке подстрока?
<!-- basicblock-start oid="ObsZjTU4Zcl5BNGqJqOl24iB"  deck='learnJsTasks_part_1_5_data_types' -->
Как в js  получить значение true/false проверкой есть ли в строке подстрока?::


str.includes
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Какие основные методы подстрок есть?
<!-- basicblock-start oid="ObsRABA0RthKQAQ9n2qrrrDV"  deck='learnJsTasks_part_1_5_data_types' -->
Какие основные методы подстрок есть?::


includes
startsWith
endsWith
str.indexOf
str.lastIndexOf(substr, position)

<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Как осуществляется доступ к символам?
<!-- basicblock-start oid="ObsW0NS5Ae3NOAcUn59MK73X"  deck='learnJsTasks_part_1_5_data_types' -->
Как осуществляется доступ к символам?::


str.at[pos] или str[];
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Какое свойство содержит длину строки
<!-- basicblock-start oid="ObsCOcueFDiXGCVz0IiaHaa2"  deck='learnJsTasks_part_1_5_data_types' -->
Какое свойство содержит длину строки::


length
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Какакие есть спецсимволы?
<!-- basicblock-start oid="ObsEZOSauJAMHBsJtSR2hLuU"  deck='learnJsTasks_part_1_5_data_types' -->
Какакие есть спецсимволы?::


\n  Перевод строки

\r  В текстовых файлах Windows для перевода строки используется комбинация символов \r\n, а на других ОС это просто \n. Это так по историческим причинам, ПО под Windows обычно понимает и просто \n.

\', \", \`  Кавычки

\\  Обратный слеш

\t  Знак табуляции

\b, \f, \v  Backspace, Form Feed и Vertical Tab — оставлены для обратной совместимости, сейчас не используются.
<!-- basicblock-end -->




#learnJsTasks_part_1_5_data_types
#part_1_5_data_types

#telegram 

# Что в js представляют из себя любые текстовые даннные?
<!-- basicblock-start oid="Obs6hL1lWeJG4JIAFKFc3E6z"  deck='learnJsTasks_part_1_5_data_types' -->
Что в js представляют из себя любые текстовые даннные?::


string
Всегда utf-16
<!-- basicblock-end -->



