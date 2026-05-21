
#J_js_learn_js_prototypes_inheritance
#js_learn_js_prototypes_inheritance

#telegram 

# Что можно сказать в целом про прототипное наследование?
<!-- basicblock-start oid="ObsxltlVxchyohPloxzfthNq"  deck='J_js_learn_js_prototypes_inheritance' -->
Что можно сказать в целом про прототипное наследование?::



    В JavaScript все объекты имеют скрытое свойство [[Prototype]], которое является либо другим объектом, либо null.
    Мы можем использовать obj.*proto* для доступа к нему (исторически обусловленный геттер/сеттер, есть другие способы, которые скоро будут рассмотрены).
    Объект, на который ссылается [[Prototype]], называется «прототипом».
    Если мы хотим прочитать свойство obj или вызвать метод, которого не существует у obj, тогда JavaScript попытается найти его в прототипе.
    Операции записи/удаления работают непосредственно с объектом, они не используют прототип (если это обычное свойство, а не сеттер).
    Если мы вызываем obj.method(), а метод при этом взят из прототипа, то this всё равно ссылается на obj. Таким образом, методы всегда работают с текущим объектом, даже если они наследуются.
    Цикл for..in перебирает как свои, так и унаследованные свойства. Остальные методы получения ключей/значений работают только с собственными свойствами объекта.
<!-- basicblock-end -->




#J_js_learn_js_prototypes_inheritance
#js_learn_js_prototypes_inheritance

#telegram 

# Что делать если унаследованные свойства нам не нужны?
<!-- basicblock-start oid="ObsyHyjeLLkhh5qFB298f0qQ"  deck='J_js_learn_js_prototypes_inheritance' -->
Что делать если унаследованные свойства нам не нужны?::


Если унаследованные свойства нам не нужны, то мы можем отфильтровать их при помощи встроенного метода obj.hasOwnProperty(key): он возвращает true, если у obj есть собственное, не унаследованное, свойство с именем key.
<!-- basicblock-end -->




#J_js_learn_js_prototypes_inheritance
#js_learn_js_prototypes_inheritance

#telegram 

# Что можно сказать про for in в контексте *proto*?
<!-- basicblock-start oid="ObsqScQlaErprpS7cK27CAXw"  deck='J_js_learn_js_prototypes_inheritance' -->
Что можно сказать про for in в контексте *proto*?::


Цикл for..in проходит не только по собственным, но и по унаследованным свойствам объекта.
<!-- basicblock-end -->




#J_js_learn_js_prototypes_inheritance
#js_learn_js_prototypes_inheritance

#telegram 

# Операция записи не использует прототип — что это значит?
<!-- basicblock-start oid="ObsEwmqeymmbZXaMc2pQoxpa"  deck='J_js_learn_js_prototypes_inheritance' -->
Операция записи не использует прототип — что это значит?::


Прототип используется только для чтения свойств.
Операции записи/удаления работают напрямую с объектом.
В приведённом ниже примере мы присваиваем rabbit собственный метод walk:

Свойства-аксессоры – исключение, так как запись в него обрабатывается функцией-сеттером. То есть это фактически вызов функции.
<!-- basicblock-end -->




#J_js_learn_js_prototypes_inheritance
#js_learn_js_prototypes_inheritance

#telegram 

# Что можно сказать про историчность *proto*?
<!-- basicblock-start oid="Obs41TgHJai4rTRutVKclVF0"  deck='J_js_learn_js_prototypes_inheritance' -->
Что можно сказать про историчность *proto*?::



Свойство *proto* — исторически обусловленный геттер/сеттер для [[Prototype]]

Это распространённая ошибка начинающих разработчиков – не знать разницы между этими двумя понятиями.

Обратите внимание, что *proto* — не то же самое, что внутреннее свойство [[Prototype]]. Это геттер/сеттер для [[Prototype]]. Позже мы увидим ситуации, когда это имеет значение, а пока давайте просто будем иметь это в виду, поскольку мы строим наше понимание языка JavaScript.

Свойство *proto* немного устарело, оно существует по историческим причинам. Современный JavaScript предполагает, что мы должны использовать функции Object.getPrototypeOf/Object.setPrototypeOf вместо того, чтобы получать/устанавливать прототип. Мы также рассмотрим эти функции позже.

По спецификации *proto* должен поддерживаться только браузерами, но по факту все среды, включая серверную, поддерживают его. Так что мы вполне безопасно его используем.

Далее мы будем в примерах использовать *proto*, так как это самый короткий и интуитивно понятный способ установки и чтения прототипа.
<!-- basicblock-end -->




#J_js_learn_js_prototypes_inheritance
#js_learn_js_prototypes_inheritance

#telegram 

# Как выглядит пример задания _proto_?
<!-- basicblock-start oid="ObsnUlnkHW1tciP6Fof5FJi3"  deck='J_js_learn_js_prototypes_inheritance' -->
Как выглядит пример задания _proto_?::


```
let animal = {
  eats: true
};

let rabbit = {
  jumps: true
};

rabbit.__proto__ = animal;
console.log(rabbit.eats);
```
<!-- basicblock-end -->




#J_js_learn_js_prototypes_inheritance
#js_learn_js_prototypes_inheritance

#telegram 

# Как можно задать [[prototype]]
<!-- basicblock-start oid="Obs0nKismbn2JZiJeFaHN5y5"  deck='J_js_learn_js_prototypes_inheritance' -->
Как можно задать [[prototype]]::


через _proto_
<!-- basicblock-end -->




#J_js_learn_js_prototypes_inheritance
#js_learn_js_prototypes_inheritance

#telegram 

# Что произойдет если мы попытаемся получить свойство объекта которого нет?
<!-- basicblock-start oid="Obs9kOFJFpyZasMXYiPtYJcd"  deck='J_js_learn_js_prototypes_inheritance' -->
Что произойдет если мы попытаемся получить свойство объекта которого нет?::


js пропробует найти это свойстово в объекте который указан в [[prototrype]] если оно не равно null
<!-- basicblock-end -->




#J_js_learn_js_prototypes_inheritance
#js_learn_js_prototypes_inheritance

#telegram 

# Какое скрытое свойство есть у объектов в js в контексте наследования?
<!-- basicblock-start oid="Obspyy27mkgZNmMdDVAJjXbn"  deck='J_js_learn_js_prototypes_inheritance' -->
Какое скрытое свойство есть у объектов в js в контексте наследования?::


[[prototype]]
<!-- basicblock-end -->




#J_js_learn_js_prototypes_inheritance
#js_learn_js_prototypes_inheritance

#telegram 

# В чем помогает прототипное наследование?
<!-- basicblock-start oid="ObsdWpaEpADVkUi6MDg2BCzM"  deck='J_js_learn_js_prototypes_inheritance' -->
В чем помогает прототипное наследование?::


Например, у нас есть объект user со своими свойствами и методами, и мы хотим создать объекты admin и guest как его слегка изменённые варианты. Мы хотели бы повторно использовать то, что есть у объекта user, не копировать/переопределять его методы, а просто создать новый объект на его основе.
<!-- basicblock-end -->



