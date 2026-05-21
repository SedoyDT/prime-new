---
author: Frolov Anatolui
date: 2024-09-22
time: 16:09:46
aliases: 
tags:
  - unique-note
  - amd
---
1. [[config requirejs]]

Для того чтобы понять работу с RequireJS и воспроизвести все описанные действия, выполните следующие шаги:

### 1. Подготовьте файловую структуру проекта

Создайте файловую структуру проекта, которая повторяет приведенный пример:

```
project_folder/
├── scripts/
│   ├── main.js
│   ├── require.js
│   └── main/
│       ├── child1.js
│       └── child2.js
```

- `main.js` — основной файл вашего проекта.
- `child1.js` и `child2.js` — это модули, которые будут подключаться и использоваться в `main.js`.
- `require.js` — это библиотека RequireJS (вы можете скачать её [зд2есь](https://requirejs.org/docs/download.html)).

### 2. Настройте HTML для загрузки RequireJS

Создайте HTML-файл, который будет загружать ваши скрипты с помощью RequireJS:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RequireJS Example</title>
    <!-- Указываем, что нужно начать с загрузки main.js -->
    <script data-main="scripts/main" src="scripts/require.js"></script>
</head>
<body>
</body>
</html>
```

Здесь используется атрибут `data-main` для указания главного скрипта (в нашем случае `scripts/main.js`).

### 3. Создайте `main.js`

Этот файл будет содержать основную логику, а также подключать другие модули.

```javascript
define(["require", "./main/child1", "./main/child2"], function (require, child1, child2) {
    console.log(child1.a + child2.b);  // выводит 3
});
```

- `define` — это функция RequireJS для объявления модуля.
- Мы подключаем два модуля `child1` и `child2` в качестве зависимостей.

### 4. Создайте модули `child1.js` и `child2.js`

**child1.js:**

```javascript
define(function () {
    return {
        a: 1
    };
});
```

**child2.js:**

```javascript
define(function () {
    return {
        b: 2
    };
});
```

Эти модули экспортируют переменные `a` и `b`, которые будут использоваться в `main.js`.

### 5. Настройка параметров перед запуском RequireJS

Вы можете передавать параметры для модулей. Для этого перед подгрузкой `require.js` определите объект `require`.

Пример в HTML:

```html
<script>
    window.require = {
        config: {
            'scripts/main': {
                a: 'b'
            }
        }
    };
</script>
<script data-main="scripts/main" src="scripts/require.js"></script>
```

### 6. Получение параметров в модуле

Теперь в вашем модуле `main.js` вы можете получать параметры, переданные через `module.config()`.

```javascript
define(["require", "module", "./main/child1", "./main/child2"], function (require, module, child1, child2) {
    const config = module.config();
    console.log(config.a);  // Выведет "b"
    console.log(child1.a + child2.b);  // 3
});
```

### 7. TypeScript и AMD

Если вы работаете с TypeScript, настройте ваш проект на компиляцию в AMD-модули. Создайте файлы `child1.ts` и `child2.ts`:

**child1.ts:**

```typescript
export var a = 1;
```

**child2.ts:**

```typescript
export var b = 2;
```

**main.ts:**

```typescript
import {a} from "./main/child1";
import {b} from "./main/child2";

console.log(a + b);  // Выведет 3
```

Скомпилируйте эти файлы в JavaScript, и они автоматически будут совместимы с RequireJS.

### Итоговые шаги:

1. **Создайте структуру проекта.**
2. **Добавьте RequireJS в HTML с указанием `data-main`.**
3. **Создайте `main.js`, подключающий модули.**
4. **Напишите модули `child1.js` и `child2.js`.**
5. **Настройте передачу параметров через RequireJS.**
6. **Если используете TypeScript, настройте компиляцию в AMD-модули.**

После выполнения этих шагов вы сможете увидеть, как работает RequireJS, как подключаются модули и передаются параметры.