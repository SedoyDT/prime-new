
#ign_getstarted
#getstarted

#telegram 

# #Маски
<!-- basicblock-start  deck='ign_getstarted' -->
#Маски::

[`\App\Development\TypeScript\Mask\*`](../../../../../library/App/Development/TypeScript/Mask) - доступные маски для фильтров

Маски служат для формирования условий выборки.

## Интерфейс
[`\App\Development\TypeScript\Mask\MaskInterface`](../../../../../library/App/Development/TypeScript/Mask/MaskInterface.php)

### Константы
####Типы фильтров на фронтенде
На фронтенде есть три вида фильтров:
1. Выбор из списка
1. Выбор периода (даты)
1. Комбо - имеет два режима работы
    1. Выбор из списка
    1. Расширенный режим, который зависит от типа. Например:
        1. для чисел можно указать: больше, меньше и тп
        1. для строк можно указать: содержит, не содержит и тп

Соответственно имеются константы:
```
interface MaskInterface
{
    //...
    const FILTER_USE_DATE   = 'date';
    const FILTER_USE_COMBO  = 'combo';
    const FILTER_USE_SELECT = 'select';
    //...
}
```
#### Места вставки условий масок
Для удобства добавлены константы названий стандартных мест вставок:
```
interface MaskInterface
{
    //...
    /**
     * Место вставки в стандартное where
     */
    const TARGET_WHERE = 'WHERE';


    /**
     * Место вставки в having
     */
    const TARGET_HAVING = 'HAVING';
    //...
}
```
Все маски, которые добавлены без указания мест вставок, 
будут по умолчанию определены в `MaskInterface::TARGET_WHERE`.

### Методы
- `getMask($data): MaskCondition[]` - получение условий фильтрации
- `getName(): string` - получить имя маски, по нему распределяются данные приходящие в фильтр
- `getFieldName(): string` - имя поля по которому будет формироваться список вариантов маски из результата
- `getSplit(): ?array` - варианты разделения значения. Используется для извлечения данных из сгруппированных полей.  
  Пр.: в поле отображаются список id товаров через запятую
- `enable(): MaskInterface` - включить маску
- `disable(): MaskInterface` - выключить маску
-  `isEnabled(): bool` - проверить включена ли маска
-  `isFilterUse(): bool` - проверить будет ди маска использоваться во фронтенде
-  `isMaskUse(): bool` - проверить используется ли маска для фильтра
-  `getConfig(): MaskConfig` - получить конфиг маски для фронтенда;

## Абстрактная маска
[`\App\Development\TypeScript\Mask\AbstractMask`](../../../../../library/App/Development/TypeScript/Mask/AbstractMask.php) - 
реализует основной функционал и интерфейс `\App\Development\TypeScript\Mask\MaskInterface`.

## Список реализованных масок
### Даты
- `\App\Development\TypeScript\Mask\DateMask` - маска по датам
- `\App\Development\TypeScript\Mask\DateTimeMask` - маска по датам со временем
- `\App\Development\TypeScript\Mask\TimestampMask` - маска по секундам

### Строки
- `\App\Development\TypeScript\Mask\StringMask` - маска по строкам
- `\App\Development\TypeScript\Mask\NullableStringMask` - маска по строкам, где может быть `NULL`
- `\App\Development\TypeScript\Mask\StringIdMask` - маска для расширенного фильтра, в котором для селекта используется id,
  а для расширенного режима поле - строка

### Числа
- `\App\Development\TypeScript\Mask\NumberMask` - маска по числам
- `\App\Development\TypeScript\Mask\NullableNumberMask` - маска по числам, где может быть `NULL` 
- `\App\Development\TypeScript\Mask\FloatMask` - маска по числам с приведением значения к типу `float`

### Другие
- `\App\Development\TypeScript\Mask\ExpressionMask` - маска возвращающая SQL - выражение
<!-- basicblock-end -->




#ign_getstarted
#getstarted

#telegram 

# TypeScript поддерживает компиляцию в модули, совместимые с системой [AMD (Asynchronous Module Definition)](https://github.com/amdjs/amdjs-api/blob/master/AMD.md), используемой RequireJS. Это означает, что TypeScript файлы могут быть скомпилированы в формат, который будет правильно работать с RequireJS.
<!-- basicblock-start  deck='ign_getstarted' -->
TypeScript поддерживает компиляцию в модули, совместимые с системой [AMD (Asynchronous Module Definition)](https://github.com/amdjs/amdjs-api/blob/master/AMD.md), используемой RequireJS. Это означает, что TypeScript файлы могут быть скомпилированы в формат, который будет правильно работать с RequireJS.::


Пример на TypeScript:

1. **`main/child1.ts`**:
    ```

    export var a = 1;
    
```

   - Определяет переменную `a` и экспортирует её, чтобы она могла быть использована в других модулях.

2. **`main/child2.ts`**:
    ```

    export var b = 2;
    
```

   - Определяет переменную `b` и экспортирует её, чтобы она могла быть использована в других модулях.

3. **`main.ts`**:
    ```

    import {a} from "./main/child1";
    import {b} from "./main/child2";
    
    console.log(a + b); // Выводит 3
    
```

   - Импортирует переменные `a` и `b` из модулей `child1` и `child2` соответственно и использует их.

### Заключение

Инструкция объясняет, как настроить и использовать RequireJS для модульной загрузки JavaScript и TypeScript файлов. Использование RequireJS помогает организовать код, управлять зависимостями и улучшает производительность веб-приложений за счет асинхронной загрузки модулей.
<!-- basicblock-end -->




#ign_getstarted
#getstarted

#telegram 

# Эта инструкция описывает использование RequireJS в проекте для модульной загрузки JavaScript и TypeScript файлов. Давайте разберем каждый раздел подробно.
<!-- basicblock-start  deck='ign_getstarted' -->
Эта инструкция описывает использование RequireJS в проекте для модульной загрузки JavaScript и TypeScript файлов. Давайте разберем каждый раздел подробно.::


### 1. Что такое RequireJS?

**RequireJS** — это библиотека JavaScript, которая используется для управления зависимостями и загрузкой модулей в браузере. Она помогает загружать только те файлы, которые необходимы, и загружать их асинхронно, что улучшает производительность веб-приложений.

- **Зачем использовать RequireJS?**
  - Уменьшение количества загружаемых файлов, что снижает время загрузки страницы.
  - Упрощение управления зависимостями между модулями.
  - Улучшение читаемости и модульности кода.

### 2. Пример работы с RequireJS

#### Подключение RequireJS

Чтобы начать использовать RequireJS, его нужно подключить в HTML-файле. Для этого используется `<script>` с атрибутом `data-main`, который указывает на файл, с которого начинается загрузка модулей.

```

<script data-main="scripts/main" src="scripts/require.js"></script>

```

- **`data-main="scripts/main"`**: Указывает начальный файл, с которого RequireJS начнет загрузку модулей. В этом примере, это `scripts/main.js`.
- **`src="scripts/require.js"`**: Путь к библиотеке RequireJS, которая должна быть загружена.

#### Структура проекта

В примере описана структура файлов:

```

scripts
├── main.js
└── main
    ├── child1.js
    └── child2.js

```

- `main.js`: Главный модуль, который загружается первым и управляет остальными модулями.
- `main/child1.js` и `main/child2.js`: Дополнительные модули, которые могут быть загружены по требованию.

### 3. Объявление модулей и зависимостей

В RequireJS, модули объявляются с помощью функции `define`. Эта функция принимает список зависимостей и функцию, которая выполняется, когда все зависимости загружены.

```

define(["require", "exports", "./main/child1", "./main/child2"], function (require, exports, child_1, child_2) {
    "use strict";
    // code
});

```

- **Аргументы функции `define`:**
  - **Массив зависимостей**: Первый аргумент — это массив строк, где каждая строка — это путь или алиас к модулю, который должен быть загружен. В примере указываются `require`, `exports`, `./main/child1`, `./main/child2`.
  - **Функция**: Второй аргумент — функция, которая будет выполнена после загрузки всех зависимостей. Она принимает в качестве параметров загруженные модули (в данном случае `require`, `exports`, `child_1`, `child_2`).

### 4. Настройка RequireJS

Настройки проекта могут быть определены в конфигурационном файле. В примере упоминается файл `/typescript/app/config.ts`, но не предоставляется его содержимое. Обычно такой файл используется для указания путей к модулям, зависимостей, и других настроек RequireJS.

### 5. Передача параметров модулям

Параметры могут быть переданы в модули через глобальную переменную `require`. В примере показано, как это сделать:

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

- **Объявление конфигурации перед загрузкой RequireJS**: Перед загрузкой `require.js`, создается глобальная переменная `require`, которая содержит конфигурацию для модулей. В данном случае, конфигурация для модуля `scripts/main` задает параметр `a` со значением `'b'`.

#### Использование параметров в модуле

Чтобы получить эти параметры в модуле, используется объект `module`, который передается в функцию `define`:

```

define(["require", "exports", "module", "./main/child1", "./main/child2"], function (require, exports, module, child_1, child_2) {
    "use strict";
    // Получение параметров
    const config = module.config();
    console.log(config.a); // Выводит 'b'
    // code
});

```

- **`module.config()`**: Метод, который возвращает конфигурацию модуля, определенную в глобальной переменной `require`.

### 6. Использование TypeScript с RequireJS
<!-- basicblock-end -->




#ign_getstarted
#getstarted

#telegram 

# # RequireJS
<!-- basicblock-start  deck='ign_getstarted' -->
# RequireJS::


[Документация](https://requirejs.org/)

RequireJS - это загрузчик файлов и модулей JavaScript. Он оптимизирован для использования в браузере, но может
использоваться в других средах JavaScript, таких, как Rhino и Node. Использование модульного загрузчика скриптов, такого
как RequireJS, повысит скорость и качество вашего кода.

## Пример работы

Для облегчения работы существует хелпер Zend_View
- [App_View_Helper_GetRequire](../../library/App/Views/Helpers/GetRequire.php)

Основные методы:

```

/** @var \Zend_View_Abstract $this */
$this->getRequire()
    ->setDataMain('/scripts/main') // установка начального скрипта
    ->setParams('main/child1', ['a'=>'b']) // установить данные для модуля ./main/child1 
 
```   ;


## Начало работы

Дано:

```

scripts
├── main.js
└── main
    ├── child1.js
    └── child2
```.js



Для автоматической загрузки файла `scripts/ma`in.js со всеми его зависимостями необходимо указать `requ`ireJs, что с
него необходимо начать загрузку.

В нашем проекте по умолчанию используется метод указания через `data`-main
атрибут ([документация](https://requirejs.org/docs/api.html#data-main)):

```


<script data-main="scripts/main" src="scripts/require.js"></scr
```ipt>


## Модули и зависимости

[Документация](https://requirejs.org/docs/api.html#define)

Модули JS объявляются через функцию define. В качестве зависимости можно указать алиас или путь:

```

define(["require", "exports", "./main/child1", "./main/child2"], function (require, exports, child_1, child_2)
{
    "use strict";
    // code
```
});


## Настройка

[Документация](https://requirejs.org/docs/api.html#config)

Настройки проекта по умолчанию лежат в файле [/typescript/app/config.ts](../../typescript/app/config.ts)

## Передача параметров

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
<script data-main="scripts/main" src="scripts/require.js"></scr
```ipt>


Использование в модуле

```

define(["require", "exports", "module", "./main/child1", "./main/child2"], function (require, exports, module, child_1, child_2)
{
    "use strict";
    // получение параметров
    const config = module.config();
    console.log(config.a); // b
    // code
```
});


##TypeScript
TypeScript настроен на компиляцию модулей в системе [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md). Поэтому ничего особенного делать не надо.

1. `main/chil`d1.ts
    ```

    export var a = 1;
```
    
1. `main/chil`d2.ts
    ```

    export var b = 2;
```
    
3. `ma`in.ts
    ```

    import {a} from "./main/child1";
    import {b} from "./main/child2";
    
    console.log(a + b); // 3
```
<!-- basicblock-end -->



