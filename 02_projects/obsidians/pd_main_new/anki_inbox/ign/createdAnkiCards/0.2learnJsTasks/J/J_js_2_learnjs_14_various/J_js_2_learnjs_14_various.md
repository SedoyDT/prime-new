
#J_js_2_learnjs_14_various
#js_2_learnjs_14_various

#telegram 

# Что можно сказать про Отключаемые прокси?
<!-- basicblock-start oid="Obs3J16jDBTvN32aHncd6Gkc"  deck='J_js_2_learnjs_14_various' -->
Что можно сказать про Отключаемые прокси?::


Отключаемый (revocable) прокси – это прокси, который может быть отключён вызовом специальной функции.

Допустим, у нас есть какой-то ресурс, и мы бы хотели иметь возможность закрыть к нему доступ в любой момент.

Для того, чтобы решить поставленную задачу, мы можем использовать отключаемый прокси, без ловушек. Такой прокси будет передавать все операции на проксируемый объект, и у нас будет возможность в любой момент отключить это.

let {proxy, revoke} = Proxy.revocable(target, handler)
<!-- basicblock-end -->




#J_js_2_learnjs_14_various
#js_2_learnjs_14_various

#telegram 

# Что можно сказать про Отключаемые прокси?
<!-- basicblock-start oid="ObsBHu3GoTwZjmkkznqTtuXP"  deck='J_js_2_learnjs_14_various' -->
Что можно сказать про Отключаемые прокси?::


<!-- basicblock-end -->




#J_js_2_learnjs_14_various
#js_2_learnjs_14_various

#telegram 

# Прокси не перехватывают проверку на 
<!-- basicblock-start oid="Obsdh9SyY92eUwYVdte9e5JW"  deck='J_js_2_learnjs_14_various' -->
Прокси не перехватывают проверку на ::



Прокси не перехватывают проверку на строгое равенство ===
Прокси способны перехватывать много операторов, например new (ловушка construct), in (ловушка has), delete (ловушка deleteProperty) и так далее.
Но нет способа перехватить проверку на строгое равенство. Объект строго равен только самому себе, и никаким другим значениям.
Так что все операции и встроенные классы, которые используют строгую проверку объектов на равенство, отличат прокси от изначального объекта. Прозрачной замены в данном случае не произойдёт.
<!-- basicblock-end -->




#J_js_2_learnjs_14_various
#js_2_learnjs_14_various

#telegram 

# Что можно сказать про ограничения Proxy?
<!-- basicblock-start oid="ObscuSGPEPxFqHJ063UyETOh"  deck='J_js_2_learnjs_14_various' -->
Что можно сказать про ограничения Proxy?::


Ограничения прокси

Прокси – уникальное средство для настройки поведения объектов на самом низком уровне. Но они не идеальны, есть некоторые ограничения.

Многие встроенные объекты, например Map, Set, Date, Promise и другие используют так называемые «внутренние слоты».

Это как свойства, но только для внутреннего использования в самой спецификациии. Например, Map хранит элементы во внутреннем слоте [[MapData]]. Встроенные методы обращаются к слотам напрямую, не через [[Get]]/[[Set]]. Таким образом, прокси не может перехватить их.

Почему это имеет значение? Они же всё равно внутренние!

Есть один нюанс. Если встроенный объект проксируется, то в прокси не будет этих «внутренних слотов», так что попытка вызвать на таком прокси встроенный метод приведёт к ошибке.

Пример:

```
let map = new Map();
let proxy = new Proxy(map, {});
proxy.set('test', 1); // будет ошибка
```

```
let map = new Map();

let proxy = new Proxy(map, {
  get(target, prop, receiver) {
    let value = Reflect.get(...arguments);
    return typeof value == 'function' ? value.bind(target) : value;
  }
});

proxy.set('test', 1);
alert(proxy.get('test')); // 1 (работает!)
```
<!-- basicblock-end -->




#J_js_2_learnjs_14_various
#js_2_learnjs_14_various

#telegram 

# Для чего используется receiver в reflcet?
<!-- basicblock-start oid="ObstEbsrQsCg6pulcZaCwBnk"  deck='J_js_2_learnjs_14_various' -->
Для чего используется receiver в reflcet?::


Он используется для правильной передаче this

в контексте следующего использования

```
let user = {
  _name: "Гость",
  get name() {
    return this._name;
  }
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    return target[prop]; // (*) target = user
  }
});

let admin = {
  __proto__: userProxy,
  _name: "Админ"
};
```

Правильное использование 

```
let user = {
  _name: "Гость",
  get name() {
    return this._name;
  }
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) { // receiver = admin
    return Reflect.get(target, prop, receiver); // (*)
  }
});


let admin = {
  __proto__: userProxy,
  _name: "Админ"
};

alert(admin.name); // Админ
```
<!-- basicblock-end -->




#J_js_2_learnjs_14_various
#js_2_learnjs_14_various

#telegram 

# Для чего используется receiver в reflcet?
<!-- basicblock-start oid="ObsrESqHryNNC3TEt5SkGM7l"  deck='J_js_2_learnjs_14_various' -->
Для чего используется receiver в reflcet?::


Он используется для правильной передаче this

в контексте следующего использования

```JS
let user = {
<!-- basicblock-end -->




#J_js_2_learnjs_14_various
#js_2_learnjs_14_various

#telegram 

# Для каждого внутреннего метода, перехватываемого Proxy, есть соответствующий метод в 
<!-- basicblock-start oid="ObsELF2fM9UDPtdIg6GGwBQW"  deck='J_js_2_learnjs_14_various' -->
Для каждого внутреннего метода, перехватываемого Proxy, есть соответствующий метод в ::


Для каждого внутреннего метода, перехватываемого Proxy, есть соответствующий метод в Reflect, который имеет такое же имя и те же аргументы, что и у ловушки Proxy.

Поэтому мы можем использовать Reflect, чтобы перенаправить операцию на исходный объект.

В этом примере обе ловушки get и set прозрачно (как будто их нет) перенаправляют операции чтения и записи на объект, при этом выводя сообщение:
<!-- basicblock-end -->




#J_js_2_learnjs_14_various
#js_2_learnjs_14_various

#telegram 

# Что такое reflect?
<!-- basicblock-start oid="ObsGkpIbsAOxO8qkICYg0cqZ"  deck='J_js_2_learnjs_14_various' -->
Что такое reflect?::


reflect - это встроенный объект позволяющий упрощать создание proxy в js

существуют только в спецификации, что к ним нельзя обратиться напрямую.

Объект Reflect делает это возможным. Его методы – минимальные обёртки вокруг внутренних методов.

Вот примеры операций и вызовы Reflect, которые делают то же самое:
<!-- basicblock-end -->




#J_js_2_learnjs_14_various
#js_2_learnjs_14_various

#telegram 

# Что важно помнить о использовании Proxy?
<!-- basicblock-start oid="ObsufrjBJvqJirQY8q1cJ6av"  deck='J_js_2_learnjs_14_various' -->
Что важно помнить о использовании Proxy?::


Прокси следует использовать везде вместо target
Пожалуйста, обратите внимание: прокси перезаписывает переменную:
```
dictionary = new Proxy(dictionary, ...);
```
Прокси должен заменить собой оригинальный объект повсюду. Никто не должен ссылаться на оригинальный объект после того, как он был проксирован. Иначе очень легко запутаться.
<!-- basicblock-end -->




#J_js_2_learnjs_14_various
#js_2_learnjs_14_various

#telegram 

# Ловушки как раз перехватывают вызовы этих внутренних методов. Полный список методов, которые можно перехватывать, перечислен в спецификации Proxy, а также в таблице ниже.
<!-- basicblock-start oid="Obs3w1Vn5hZdXJZkLZkoGuc4"  deck='J_js_2_learnjs_14_various' -->
Ловушки как раз перехватывают вызовы этих внутренних методов. Полный список методов, которые можно перехватывать, перечислен в спецификации Proxy, а также в таблице ниже.::


Внутренний метод   Ловушка   Что вызывает
[[Get]]   get   чтение свойства
[[Set]]   set   запись свойства
[[HasProperty]]   has   оператор in
[[Delete]]   deleteProperty   оператор delete
[[Call]]   apply   вызов функции
[[Construct]]   construct   оператор new
[[GetPrototypeOf]]   getPrototypeOf   Object.getPrototypeOf
[[SetPrototypeOf]]   setPrototypeOf   Object.setPrototypeOf
[[IsExtensible]]   isExtensible   Object.isExtensible
[[PreventExtensions]]   preventExtensions   Object.preventExtensions
[[DefineOwnProperty]]   defineProperty   Object.defineProperty, Object.defineProperties
[[GetOwnProperty]]   getOwnPropertyDescriptor   Object.getOwnPropertyDescriptor, for..in, Object.keys/values/entries
[[OwnPropertyKeys]]   ownKeys   Object.getOwnPropertyNames, Object.getOwnPropertySymbols, for..in, Object.keys/values/entries
<!-- basicblock-end -->




#J_js_2_learnjs_14_various
#js_2_learnjs_14_various

#telegram 

# Что такое объекты Proxy?
<!-- basicblock-start oid="ObsJlgwWr59DtLMZyNwCXSQy"  deck='J_js_2_learnjs_14_various' -->
Что такое объекты Proxy?::


Объект Proxy «оборачивается» вокруг другого объекта и может перехватывать (и, при желании, самостоятельно обрабатывать) разные действия с ним, например чтение/запись свойств и другие. Далее мы будем называть такие объекты «прокси».

Прокси используются во многих библиотеках и некоторых браузерных фреймворках. В этой главе мы увидим много случаев применения прокси в решении реальных задач.

Синтаксис

```
let proxy = new Proxy(target, handler);
```
target – это объект, для которого нужно сделать прокси, может быть чем угодно, включая функции.

handler – конфигурация прокси: объект с «ловушками» («traps»): методами, которые перехватывают разные операции, например, ловушка get – для чтения свойства из target, ловушка set – для записи свойства в target и так далее.

При операциях над proxy, если в handler имеется соответствующая «ловушка», то она срабатывает, и прокси имеет возможность по-своему обработать её, иначе операция будет совершена над оригинальным объектом target.

В качестве начального примера создадим прокси без всяких ловушек:

```
let target = {};
let proxy = new Proxy(target, {}); // пустой handler

proxy.test = 5; // записываем в прокси (1)
alert(target.test); // 5, свойство появилось в target!

alert(proxy.test); // 5, мы также можем прочитать его из прокси (2)

for(let key in proxy) alert(key); // test, итерация работает (3)
```

Так как нет ловушек, то все операции на proxy применяются к оригинальному объекту target.

    Запись свойства proxy.test= устанавливает значение на target.
    Чтение свойства proxy.test возвращает значение из target.
    Итерация по proxy возвращает значения из target.

Как мы видим, без ловушек proxy является прозрачной обёрткой над target.

Proxy – это особый, «экзотический», объект, у него нет собственных свойств. С пустым handler он просто перенаправляет все операции на target.

Чтобы активировать другие его возможности, добавим ловушки.

Что именно мы можем ими перехватить?

Для большинства действий с объектами в спецификации JavaScript есть так называемый «внутренний метод», который на самом низком уровне описывает, как его выполнять. Например, [[Get]] – внутренний метод для чтения свойства, [[Set]] – для записи свойства, и так далее. Эти методы используются только в спецификации, мы не можем обратиться напрямую к ним по имени.

Ловушки как раз перехватывают вызовы этих внутренних методов. Полный список методов, которые можно перехватывать, перечислен в спецификации Proxy, а также в таблице ниже.

Для каждого внутреннего метода в этой таблице указана ловушка, то есть имя метода, который мы можем добавить в параметр handler при создании new Proxy, чтобы перехватывать данную операцию:
<!-- basicblock-end -->



