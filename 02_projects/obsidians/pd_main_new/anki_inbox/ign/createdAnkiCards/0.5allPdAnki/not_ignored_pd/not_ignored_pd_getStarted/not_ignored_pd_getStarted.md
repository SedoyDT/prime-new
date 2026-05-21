
#not_ignored_pd_getStarted
#getStarted

#telegram 

# Что можно сказать про typescript в контексте require js&
<!-- basicblock-start oid="ObsUV5PrSE5mZHLA1CHy72Pm"  deck='not_ignored_pd_getStarted' -->
Что можно сказать про typescript в контексте require js&::


##TypeScript TypeScript настроен на компиляцию модулей в системе [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md). Поэтому ничего особенного делать не надо.

API определения асинхронного модуля (AMD) определяет механизм определения модулей, позволяющий асинхронно загружать модуль и его зависимости. Это особенно хорошо подходит для среды браузера, где синхронная загрузка модулей приводит к проблемам с производительностью, удобством использования, отладкой и междоменным доступом. (    define(id?, dependencies?, factory);)

```
main/child1.ts
```

```
export var b = 2;
```

```
import {a} from "./main/child1";
 import {b} from "./main/child2";
 
 console.log(a + b); // 3
```
<!-- basicblock-end -->




#not_ignored_pd_getStarted
#getStarted

#telegram 

# Что можно сказать про загрузку параметров в проекте (requirejs)?
<!-- basicblock-start oid="ObsOqMXC1zpnhfLp4x4sjWSX"  deck='not_ignored_pd_getStarted' -->
Что можно сказать про загрузку параметров в проекте (requirejs)?::


Для передачи параметров в модуль необходимо объявить переменную require до подгрузки requirejs:

```

<script>
    window.require = {
        config: {
            'scripts/main': {
                a: 'b',
            }
        }
    };
</script>
<script data-main="scripts/main" src="scripts/require.js"></script>
```

Использование в модуле

```
define(["require", "exports", "module", "./main/child1", "./main/child2"], function (require, exports, module, child_1, child_2)
{
    "use strict";
    // получение параметров
    const config = module.config();
    console.log(config.a); // b
    // code
});
```
<!-- basicblock-end -->




#not_ignored_pd_getStarted
#getStarted

#telegram 

# Как осуществляется работа с модулями и зависимостями?
<!-- basicblock-start oid="ObsOmcZnNJ26QHrmGCNpAQQ4"  deck='not_ignored_pd_getStarted' -->
Как осуществляется работа с модулями и зависимостями?::


Модуль отличается от традиционного файла сценария тем, что он определяет объект с четкой областью действия, который позволяет избежать загрязнения глобального пространства имен. Он может явно перечислять свои зависимости и получать дескрипторы этих зависимостей без необходимости обращаться к глобальным объектам, но вместо этого получать зависимости в качестве аргументов функции, которая определяет модуль. Модули в RequireJS являются расширением шаблона модуля, преимуществом которого является отсутствие необходимости использования глобальных переменных для ссылки на другие модули.

Синтаксис RequireJS для модулей позволяет загружать их максимально быстро, даже не по порядку, но оценивать в правильном порядке зависимостей, а поскольку глобальные переменные не создаются, это дает возможность загружать несколько версий модуля на странице. .

(Если вы знакомы с модулями CommonJS или используете их, пожалуйста, также ознакомьтесь с примечаниями к CommonJS, чтобы узнать, как формат модуля RequireJS сопоставляется с модулями CommonJS).

Для каждого файла на диске должно быть только одно определение модуля. Модули могут быть сгруппированы в оптимизированные пакеты с помощью инструмента оптимизации.

Если модуль не имеет никаких зависимостей и представляет собой просто набор пар имя/значение, просто передайте литерал объекта в define():

```
//Inside file my/shirt.js:
define({
    color: "black",
    size: "unisize"
});
```

Если модуль не имеет зависимостей, но ему необходимо использовать функцию для выполнения некоторой работы по настройке, то определите itself, передайте функцию в define():

```
//my/shirt.js now does setup work
//before returning its module definition.
define(function () {
    //Do setup work here

    return {
        color: "black",
        size: "unisize"
    }
});
```

Настройки проекта по умолчанию лежат в файле /typescript/app/config.ts
<!-- basicblock-end -->




#not_ignored_pd_getStarted
#getStarted

#telegram 

# Для автоматической загрузки файла `scripts/main.js` со всеми его зависимостями необходимо указать `requireJs`, что с него необходимо начать загрузку. 
<!-- basicblock-start oid="ObsOt2il2wgDXe6P0cUfd41h"  deck='not_ignored_pd_getStarted' -->
Для автоматической загрузки файла `scripts/main.js` со всеми его зависимостями необходимо указать `requireJs`, что с него необходимо начать загрузку. ::


В нашем проекте по умолчанию используется метод указания через [data-main](https://requirejs.org/docs/api.html#data-main)

Атрибут data-main — это специальный атрибут, который require.js проверит, чтобы начать загрузку скрипта:

```


<!--когда require.js загружается, он вставляет еще один тег сценария
    (с атрибутом async) для скриптов/main.js ->
<script data-main="scripts/main" src="scripts/require.js"></script>
```

Обычно вы используете сценарий data-main для установки параметров конфигурации, а затем загружаете первый модуль приложения. Примечание. Тег сценария require.js, создаваемый для вашего модуля data-main, включает атрибут async. Это означает, что вы не можете предполагать, что загрузка и выполнение вашего основного сценария данных завершится раньше, чем другие сценарии, упомянутые далее на той же странице.
```
<script data-main="scripts/main" src="scripts/require.js"></script>
<script src="scripts/other.js"></script>
```

```
// contents of main.js:
require.config({
    paths: {
        foo: 'libs/foo-1.1.3'
    }
});

```

// содержимое другого.js:

// Этот код может быть вызван перед вызовом require.config() в main.js
// выполнилось. Когда это произойдет, require.js попытается
// загружаем «scripts/foo.js» вместо «scripts/libs/foo-1.1.3.js»

```
require(['foo'], function(foo) {

});
```
Если вы хотите выполнять вызовы require() на HTML-странице, лучше не использовать data-main. data-main предназначен для использования только в том случае, если на странице есть только одна основная точка входа — скрипт data-main. Для страниц, которые хотят выполнять встроенные вызовы require(), лучше всего вложить их в вызов require() для конфигурации:

```
<script src="scripts/require.js"></script>
<script>
require(['scripts/config'], function() {
    // Configuration loaded now, safe to do other require calls
    // that depend on that config.
    require(['foo'], function(foo) {

    });
});
```
<!-- basicblock-end -->




#not_ignored_pd_getStarted
#getStarted

#telegram 

# Что можно сказать про паттерн модуль?
<!-- basicblock-start oid="ObsD2eOAIbVH6G98GzWe7oMv"  deck='not_ignored_pd_getStarted' -->
Что можно сказать про паттерн модуль?::


[module](http://www.adequatelygood.com/tag/javascript/)
<!-- basicblock-end -->




#not_ignored_pd_getStarted
#getStarted

#telegram 

# f
<!-- basicblock-start oid="ObsQK0n36jGEp6NanOfI0FtY"  deck='not_ignored_pd_getStarted' -->
Пусть есть такая струкрура

scripts  
├── main.js  
└── main  
    ├── child1.js    └── child2.js

Что нужно, чтобы 
::

Для автоматической загрузки файла `scripts/main.js` со всеми его зависимостями необходимо указать `requireJs`, что с  
него необходимо начать загрузку.

```html  
  
<script data-main="scripts/main" src="scripts/require.js"></script>  
```
<!-- basicblock-end -->




#not_ignored_pd_getStarted
#getStarted

#telegram 

# Что есть в проекте для облегчения работы с requirejs?
<!-- basicblock-start oid="ObsP6oG6H3J8gGuBoI6RXtdy"  deck='not_ignored_pd_getStarted' -->
Что есть в проекте для облегчения работы с requirejs?::


App_View_Helper_GetRequire
<!-- basicblock-end -->




#not_ignored_pd_getStarted
#getStarted

#telegram 

# Что такое requirejs?
<!-- basicblock-start oid="ObshZFRsPuSONlXGnwdaTGot"  deck='not_ignored_pd_getStarted' -->
Что такое requirejs?::


RequireJS - это загрузчик файлов и модулей JavaScript. Он оптимизирован для использования в браузере, но может использоваться в других средах JavaScript, таких, как Rhino и Node. Использование модульного загрузчика скриптов, такого как RequireJS, повысит скорость и качество вашего кода.
<!-- basicblock-end -->




#not_ignored_pd_getStarted
#getStarted

#telegram 

# 1 requre js
<!-- basicblock-start oid="Obs8jbUtXFyOoD6ufTFAFZYm"  deck='not_ignored_pd_getStarted' -->
1 requre js::

2 angular js
3 amd dialog
4 controllerAs
5 ng-click
https://devdocs.io/angularjs~1.7/api/ng/directive/ngcontroller
https://code.angularjs.org/1.7.8/docs/guide/component
<!-- basicblock-end -->



