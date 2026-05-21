
#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Что делает await?
<!-- basicblock-start oid="Obspnv7H55Ws7QgkVkU1L9Oo"  deck='J_js_1_learnjs_11_promises_and_async' -->
Что делает await?::


Ключевое слово await заставит интерпретатор JavaScript ждать до тех пор, пока промис справа от await не выполнится. После чего оно вернёт его результат, и выполнение кода продолжится.
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Что делает async функция?
<!-- basicblock-start oid="Obs6BkDmQl7zbjxYIh536Hy5"  deck='J_js_1_learnjs_11_promises_and_async' -->
Что делает async функция?::


Всегда возвращает promise
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# В каком случае возникает необработанная ошибка в контекcте Promise?
<!-- basicblock-start oid="ObsXxKrWlk6uUxNlVleW0ats"  deck='J_js_1_learnjs_11_promises_and_async' -->
В каком случае возникает необработанная ошибка в контекcте Promise?::


Если она не была обработана в конце очереди микрозадач
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Что предусматривает стандарт для правильного управления потоком асинхронных задач?
<!-- basicblock-start oid="ObsdlJnuoWais7rVv1AgTcZG"  deck='J_js_1_learnjs_11_promises_and_async' -->
Что предусматривает стандарт для правильного управления потоком асинхронных задач?::


внутреннюю очередь PromiseJobs, более известную как «очередь микрозадач (microtask queue)» (термин V8).
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Обработчики промисов .then/.catch/.finally
<!-- basicblock-start oid="ObsaqjPGovJYhZetAy5zdGad"  deck='J_js_1_learnjs_11_promises_and_async' -->
Обработчики промисов .then/.catch/.finally::


Обработчики промисов .then/.catch/.finally всегда асинхронны.
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# В каком случае буссмысленно использовать промисификацию?
<!-- basicblock-start oid="Obs8TGVzF2WdxMFT5adAkS1I"  deck='J_js_1_learnjs_11_promises_and_async' -->
В каком случае буссмысленно использовать промисификацию?::


Промисификацию бессмысленно использовать, когда функция, над которой ее приминяют вызывает например два колбека, второй будет проигнорирован
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Что такое промисификация?
<!-- basicblock-start oid="ObsBjruV3zByW5wq0YbrtI2s"  deck='J_js_1_learnjs_11_promises_and_async' -->
Что такое промисификация?::


Это преобразование функции которая выполняет callback в функцию которая возвращает promise
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Что в общем можно сказать про Promises?
<!-- basicblock-start oid="ObsPQOUF6bMRBG4p8EQ4thVe"  deck='J_js_1_learnjs_11_promises_and_async' -->
Что в общем можно сказать про Promises?::


Мы ознакомились с шестью статическими методами класса Promise:

    Promise.all(promises) – ожидает выполнения всех промисов и возвращает массив с результатами. Если любой из указанных промисов вернёт ошибку, то результатом работы Promise.all будет эта ошибка, результаты остальных промисов будут игнорироваться.
    Promise.allSettled(promises) (добавлен недавно) – ждёт, пока все промисы завершатся и возвращает их результаты в виде массива с объектами, у каждого объекта два свойства:
        status: "fulfilled", если выполнен успешно или "rejected", если ошибка,
        value – результат, если успешно или reason – ошибка, если нет.
    Promise.race(promises) – ожидает первый выполненный промис, который становится его результатом, остальные игнорируются.
    Promise.any(promises) (добавлен недавно) – ожидает первый успешно выполненный промис, который становится его результатом, остальные игнорируются. Если все переданные промисы отклонены, AggregateError становится ошибкой Promise.any.
    Promise.resolve(value) – возвращает успешно выполнившийся промис с результатом value.
    Promise.reject(error) – возвращает промис с ошибкой error.

Из всех перечисленных методов, самый часто используемый – это, пожалуй, Promise.all.
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Что делает Promise.any?
<!-- basicblock-start oid="ObsMNjIRjwEbdxWHQ03rwwWK"  deck='J_js_1_learnjs_11_promises_and_async' -->
Что делает Promise.any?::


Метод очень похож на Promise.race, но ждёт только первый успешно выполненный промис, из которого берёт результат.

Если ни один из переданных промисов не завершится успешно, тогда возвращённый объект Promise будет отклонён с помощью AggregateError – специального объекта ошибок, который хранит все ошибки промисов в своём свойстве errors.

```
let promise = Promise.any(iterable);
```

Например, здесь, результатом будет 1:

Первый промис в этом примере был самым быстрым, но он был отклонён, поэтому результатом стал второй. После того, как первый успешно выполненный промис «выиграет гонку», все дальнейшие результаты будут проигнорированы.

Вот пример, в котором все промисы отклоняются:

```
Promise.any([
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Ошибка!")), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Ещё одна ошибка!")), 2000))
]).catch(error => {
  console.log(error.constructor.name); // AggregateError
  console.log(error.errors[0]); // Error: Ошибка!
  console.log(error.errors[1]); // Error: Ещё одна ошибка!
});
```
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Что делает Promise.all?
<!-- basicblock-start oid="ObsvCq993lkChE1wCQr4Lw8a"  deck='J_js_1_learnjs_11_promises_and_async' -->
Что делает Promise.all?::


Метод очень похож на Promise.all, но ждёт только первый выполненный промис, из которого берёт результат (или ошибку).

let promise = Promise.race(iterable);

```
Promise.race([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Ошибка!")), 2000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
]).then(alert); // 1
```
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Что делает Promise.Allsteled?
<!-- basicblock-start oid="ObsVXfgXlxizSu6zVyL7uaFN"  deck='J_js_1_learnjs_11_promises_and_async' -->
Что делает Promise.Allsteled?::


Возвращает массив результатов, с объектами хранащими статусы промисов вроде

    {status:"fulfilled", value:результат} для успешных завершений,
    {status:"rejected", reason:ошибка} для ошибок.
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Что будет c Promise.All если любой из промисов завершится ошибкой?
<!-- basicblock-start oid="ObsHCeYA7kUJip53nxOTBJIa"  deck='J_js_1_learnjs_11_promises_and_async' -->
Что будет c Promise.All если любой из промисов завершится ошибкой?::


То промис возвращенный Promise.All завершится с ошибкой.
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Что можно сделать для отлова необработынных ошибок?
<!-- basicblock-start oid="Obs1jIjwQ6xRbeJ3HmuObWoE"  deck='J_js_1_learnjs_11_promises_and_async' -->
Что можно сделать для отлова необработынных ошибок?::


```
window.addEventListener('unhandledrejection', function(event) {
  // объект события имеет два специальных свойства:
  alert(event.promise); // [object Promise] - промис, который сгенерировал ошибку
  alert(event.reason); // Error: Ошибка! - объект ошибки, которая не была обработана
});

new Promise(function() {
  throw new Error("Ошибка!");
}); // нет обработчика ошибок
```
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Что Являются ли фрагменты кода ниже эквивалентными? Другими словами, ведут ли они себя одинаково во всех обстоятельствах, для всех переданных им обработчиков? promise.then(f1).catch(f2); promise.then(f1, f2);
<!-- basicblock-start oid="ObsupVV0jyf91x8CaQrfUrzx"  deck='J_js_1_learnjs_11_promises_and_async' -->
Что Являются ли фрагменты кода ниже эквивалентными? Другими словами, ведут ли они себя одинаково во всех обстоятельствах, для всех переданных им обработчиков? promise.then(f1).catch(f2); promise.then(f1, f2);::


Короткий ответ: нет, они не эквивалентны:

Разница в том, что если ошибка произойдёт в f1, то она будет обработана в .catch в этом примере:

promise
  .then(f1)
  .catch(f2);

…но не в этом:

promise
  .then(f1, f2);

Ошибка передаётся по цепочке, но во втором примере нет продолжения цепочки после f1.

Другими словами, .then передаёт результат или ошибку следующему блоку .then/catch. Так как в первом примере в цепочке далее имеется блок catch, а во втором – нет, то ошибка в нём останется необработанной.
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Что в обзем по мелочи можно сказать про promise?
<!-- basicblock-start oid="ObsImJhABysmNBrcIclF2iqp"  deck='J_js_1_learnjs_11_promises_and_async' -->
Что в обзем по мелочи можно сказать про promise?::


Изображения <img>, внешние стили, скрипты и другие ресурсы предоставляют события load и error для отслеживания загрузки:

    load срабатывает при успешной загрузке,
    error срабатывает при ошибке загрузки.

Единственное исключение – это <iframe>: по историческим причинам срабатывает всегда load вне зависимости от того, как завершилась загрузка, даже если страница не была найдена.

Событие readystatechange также работает для ресурсов, но используется редко, потому что события load/error проще в использовании.
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Что в обзем по мелочи можно сказать про promise?
<!-- basicblock-start oid="ObstDBwwAWWfJYLjPqmy3R4J"  deck='J_js_1_learnjs_11_promises_and_async' -->
Что в обзем по мелочи можно сказать про promise?::


<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Существует три уровня кросс-доменного доступа:
<!-- basicblock-start oid="ObsqSl1FP2Ig1khOa5vSGzHJ"  deck='J_js_1_learnjs_11_promises_and_async' -->
Существует три уровня кросс-доменного доступа:::



    Атрибут crossorigin отсутствует – доступ запрещён.
    crossorigin="anonymous" – доступ разрешён, если сервер отвечает с заголовком Access-Control-Allow-Origin со значениями * или наш домен. Браузер не отправляет авторизационную информацию и куки на удалённый сервер.
    crossorigin="use-credentials" – доступ разрешён, если сервер отвечает с заголовками Access-Control-Allow-Origin со значением наш домен и Access-Control-Allow-Credentials: true. Браузер отправляет авторизационную информацию и куки на удалённый сервер.
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Что можно сказать про onload/onerror?
<!-- basicblock-start oid="ObsWJxImy1Ja1WQyIace9atz"  deck='J_js_1_learnjs_11_promises_and_async' -->
Что можно сказать про onload/onerror?::


Обработчики onload/onerror отслеживают только сам процесс загрузки.

Ошибки обработки и выполнения загруженного скрипта ими не отслеживаются. Чтобы «поймать» ошибки в скрипте, нужно воспользоваться глобальным обработчиком window.onerror.
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Что аля итогово можно сказать про finally ?
<!-- basicblock-start oid="ObscxxGAuevjI77Z8fBFXYC0"  deck='J_js_1_learnjs_11_promises_and_async' -->
Что аля итогово можно сказать про finally ?::


Подведем итог:

    Обработчик finally не получает результат предыдущего обработчика (у него нет аргументов). Вместо этого этот результат передается следующему подходящему обработчику.
    Если обработчик finally возвращает что-то, это игнорируется.
    Когда finally выдает ошибку, выполнение переходит к ближайшему обработчику ошибок.

Эти функции полезны и заставляют все работать правильно, если мы используем finally так, как предполагается: для общих процедур очистки.

На завершённых промисах обработчики запускаются сразу

Если промис в состоянии ожидания, обработчики в .then/catch/finally будут ждать его.

Иногда может случиться так, что промис уже выполнен, когда мы добавляем к нему обработчик.

В таком случае эти обработчики просто запускаются немедленно:
```
// при создании промиса он сразу переводится в состояние "успешно завершён"
let promise = new Promise(resolve => resolve("готово!"));

promise.then(alert); // готово! (выведется сразу)
```
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Как выглядит примеры promise для различных ситуаций?
<!-- basicblock-start oid="ObsIWe8MQjCMUYAugeyQuo0a"  deck='J_js_1_learnjs_11_promises_and_async' -->
Как выглядит примеры promise для различных ситуаций?::


```
let promise = new Promise(function(resolve, reject) {
  resolve("done");

  reject(new Error("…")); // игнорируется
  setTimeout(() => resolve("…")); // игнорируется
});

promise.then((resolve) => {
  console.log(resolve)
})

let promise2 = new Promise(function(resolve, reject) {
  // задача, не требующая времени
  resolve(123); // мгновенно выдаст результат: 123
});

promise2.then((resolve) => console.log(resolve));

let promise3 = new Promise(function(resolve, reject) {
  setTimeout(() => resolve("done!3"), 1000);
});

// resolve запустит первую функцию, переданную в .then
promise3.then(
  result => console.log(result), // выведет "done!" через одну секунду
  error => console.log(error) // не будет запущена
);

let promise4 = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("Ошибка!1")), 1000);
});

// .catch(f) это то же самое, что promise.then(null, f)
promise4.catch(alert); // выведет "Error: Ошибка!" спустя одну секунду

let promise5 = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done!4"), 1000);
  /* сделать что-то, что займёт время, и после вызвать resolve или может reject */
});
promise5.finally(() => console.log("// выполнится, когда промис завершится, независимо от того, успешно или нет"))
  .then(result => console.log("показать результат"), err => console.log("показать ошибку"))

let promise6 = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("Ошибка!2")), 1000);
  /* сделать что-то, что займёт время, и после вызвать resolve или может reject */
});
promise6.finally(() => console.log("// выполнится, когда промис завершится, независимо от того, успешно или нет"))
  .then(result => console.log("показать результат"), err => console.log("показать ошибку"))
```
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Вызов .catch(f) – это сокращённый, «укороченный» вариант
<!-- basicblock-start oid="Obsli7lVqHur3sliBNOWxKZY"  deck='J_js_1_learnjs_11_promises_and_async' -->
Вызов .catch(f) – это сокращённый, «укороченный» вариант::


 .then(null, f).
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Что можно сказать про catch?
<!-- basicblock-start oid="ObsT7CxjYGgii5r8R5IzpkVt"  deck='J_js_1_learnjs_11_promises_and_async' -->
Что можно сказать про catch?::


Если мы хотели бы только обработать ошибку, то можно использовать null в качестве первого аргумента: .then(null, errorHandlingFunction). Или можно воспользоваться методом .catch(errorHandlingFunction), который сделает то же самое:

```
let promise = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error("Ошибка!")), 1000);
});

// .catch(f) это то же самое, что promise.then(null, f)
promise.catch(alert); // выведет "Error: Ошибка!" спустя одну секунду
```
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Какие внутренние свойства есть у объекта Promise?
<!-- basicblock-start oid="ObsQbcAVzXWVP0rc1IotR3I8"  deck='J_js_1_learnjs_11_promises_and_async' -->
Какие внутренние свойства есть у объекта Promise?::


разные блять, вспоминай
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Как называется функция, которую передают в new Promise();?
<!-- basicblock-start oid="ObsSaa8vz7GNQrueFK1metnV"  deck='J_js_1_learnjs_11_promises_and_async' -->
Как называется функция, которую передают в new Promise();?::


executor
Когда promise создается executor вызывается автоматически
<!-- basicblock-end -->




#J_js_1_learnjs_11_promises_and_async
#js_1_learnjs_11_promises_and_async

#telegram 

# Например, рассмотрим функцию loadScript(src):
<!-- basicblock-start oid="Obsdl6pGsALbPSgitqTEHFTL"  deck='J_js_1_learnjs_11_promises_and_async' -->
Например, рассмотрим функцию loadScript(src):::

```javascript
function loadScript(src) {
  let script = document.createElement('script');
  script.src = src;
  document.head.append(script);
}
```

Эта функция загружает на страницу новый скрипт. Когда в тело документа добавится конструкция `<script src="…">`, браузер загрузит скрипт и выполнит его.

```javascript
// загрузит и выполнит скрипт
loadScript('/my/script.js');
```


<!-- basicblock-end -->



