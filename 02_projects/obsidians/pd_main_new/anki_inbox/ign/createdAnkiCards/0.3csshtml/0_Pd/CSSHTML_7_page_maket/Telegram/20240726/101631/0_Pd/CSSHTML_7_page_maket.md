
# Начало карточки

<!-- basicblock-start oid="ObskPmf2eFOQx76MUzigx2Mu"  deck='0_Pd_CSSHTML_7_page_maket' -->
Как можно скрыть элемент со страницы?::


Существует несколько способов скрыть элемент со страницы с помощью CSS и HTML. Каждый метод имеет свои особенности и может быть использован в зависимости от контекста и требуемого результата.

### Методы скрытия элемента

1. **Свойство `display: none`**
   - Элемент не отображается на странице и не занимает место в потоке документа.
   ```

   .hidden {
     display: none;
   }
   
```

2. **Свойство `visibility: hidden`**
   - Элемент не виден, но продолжает занимать место на странице.
   ```

   .hidden {
     visibility: hidden;
   }
   
```

3. **Свойство `opacity: 0`**
   - Элемент полностью прозрачный, но интерактивный и занимает место на странице.
   ```

   .hidden {
     opacity: 0;
   }
   
```

4. **Перемещение элемента за пределы видимой области**
   - Элемент перемещается за пределы видимой области экрана, что делает его невидимым, но он все еще занимает место на странице.
   ```

   .hidden {
     position: absolute;
     left: -9999px;
   }
   
```

5. **Скрытие с помощью HTML-атрибута `hidden`**
   - В HTML5 можно использовать атрибут `hidden`, который скрывает элемент.
   ```

   <div hidden>
     Этот элемент скрыт.
   </div>
   
```

### Примеры использования

#### Использование CSS для скрытия элемента

```

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Примеры скрытия элемента</title>
  <style>
    .hidden-display {
      display: none;
    }
    .hidden-visibility {
      visibility: hidden;
    }
    .hidden-opacity {
      opacity: 0;
    }
    .hidden-position {
      position: absolute;
      left: -9999px;
    }
  </style>
</head>
<body>
  <div class="hidden-display">Этот элемент скрыт с помощью display: none.</div>
  <div class="hidden-visibility">Этот элемент скрыт с помощью visibility: hidden.</div>
  <div class="hidden-opacity">Этот элемент скрыт с помощью opacity: 0.</div>
  <div class="hidden-position">Этот элемент скрыт с помощью left: -9999px.</div>
</body>
</html>

```

#### Использование JavaScript для скрытия элемента

```

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Скрытие элемента с помощью JavaScript</title>
  <style>
    .hidden {
      display: none;
    }
  </style>
</head>
<body>
  <div id="element">Этот элемент будет скрыт</div>
  <button onclick="hideElement()">Скрыть элемент</button>

  <script>
    function hideElement() {
      document.getElementById('element').classList.add('hidden');
    }
  </script>
</body>
</html>

```

В этом примере кнопка добавляет класс `hidden` к элементу, скрывая его с помощью свойства `display: none`.

### Выбор метода

- **`display: none`**: Полное скрытие элемента без его участия в потоке документа.
- **`visibility: hidden`**: Скрытие элемента, сохраняя его место на странице.
- **`opacity: 0`**: Полная прозрачность, элемент остается интерактивным.
- **Перемещение за пределы экрана**: Элемент невидим, но занимает место.
- **Атрибут `hidden`**: Быстрое и простое скрытие элемента в HTML5.

Выбор метода зависит от конкретных требований вашего проекта.
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Как можно скрыть элемент со страницы?

Существует несколько способов скрыть элемент со страницы с помощью CSS и HTML. Каждый метод имеет свои особенности и может быть использован в зависимости от контекста и требуемого результата.

### Методы скрытия элемента

1. **Свойство `display: none`**
   - Элемент не отображается на странице и не занимает место в потоке документа.
   ```

   .hidden {
     display: none;
   }
   
```

2. **Свойство `visibility: hidden`**
   - Элемент не виден, но продолжает занимать место на странице.
   ```

   .hidden {
     visibility: hidden;
   }
   
```

3. **Свойство `opacity: 0`**
   - Элемент полностью прозрачный, но интерактивный и занимает место на странице.
   ```

   .hidden {
     opacity: 0;
   }
   
```

4. **Перемещение элемента за пределы видимой области**
   - Элемент перемещается за пределы видимой области экрана, что делает его невидимым, но он все еще занимает место на странице.
   ```

   .hidden {
     position: absolute;
     left: -9999px;
   }
   
```

5. **Скрытие с помощью HTML-атрибута `hidden`**
   - В HTML5 можно использовать атрибут `hidden`, который скрывает элемент.
   ```

   <div hidden>
     Этот элемент скрыт.
   </div>
   
```

### Примеры использования

#### Использование CSS для скрытия элемента

```

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Примеры скрытия элемента</title>
  <style>
    .hidden-display {
      display: none;
    }
    .hidden-visibility {
      visibility: hidden;
    }
    .hidden-opacity {
      opacity: 0;
    }
    .hidden-position {
      position: absolute;
      left: -9999px;
    }
  </style>
</head>
<body>
  <div class="hidden-display">Этот элемент скрыт с помощью display: none.</div>
  <div class="hidden-visibility">Этот элемент скрыт с помощью visibility: hidden.</div>
  <div class="hidden-opacity">Этот элемент скрыт с помощью opacity: 0.</div>
  <div class="hidden-position">Этот элемент скрыт с помощью left: -9999px.</div>
</body>
</html>

```

#### Использование JavaScript для скрытия элемента

```

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Скрытие элемента с помощью JavaScript</title>
  <style>
    .hidden {
      display: none;
    }
  </style>
</head>
<body>
  <div id="element">Этот элемент будет скрыт</div>
  <button onclick="hideElement()">Скрыть элемент</button>

  <script>
    function hideElement() {
      document.getElementById('element').classList.add('hidden');
    }
  </script>
</body>
</html>

```

В этом примере кнопка добавляет класс `hidden` к элементу, скрывая его с помощью свойства `display: none`.

### Выбор метода

- **`display: none`**: Полное скрытие элемента без его участия в потоке документа.
- **`visibility: hidden`**: Скрытие элемента, сохраняя его место на странице.
- **`opacity: 0`**: Полная прозрачность, элемент остается интерактивным.
- **Перемещение за пределы экрана**: Элемент невидим, но занимает место.
- **Атрибут `hidden`**: Быстрое и простое скрытие элемента в HTML5.

Выбор метода зависит от конкретных требований вашего проекта.



