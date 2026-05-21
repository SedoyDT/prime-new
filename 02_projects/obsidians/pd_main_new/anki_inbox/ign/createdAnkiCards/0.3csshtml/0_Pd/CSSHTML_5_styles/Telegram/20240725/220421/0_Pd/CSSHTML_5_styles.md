
# Начало карточки

<!-- basicblock-start oid="Obsg4KZES57Kha4afa8ETb5J"  deck='0_Pd_CSSHTML_5_styles' -->
Переопределение ширины блока::


Свойство box-sizing позволяет переопределить установленные размеры элементов. Оно может принимать одно из следующих значений:

Свойство `box-sizing` в CSS определяет, как рассчитываются размеры элемента, включая его ширину и высоту, а также его внутренние отступы (padding) и границы (border). Оно особенно полезно для создания более предсказуемых макетов и предотвращения переполнения элементов.

### Значения `box-sizing`

1. **`content-box` (значение по умолчанию)**
   - При использовании `content-box` ширина и высота элемента задаются для его содержимого. Внутренние отступы (padding) и границы (border) добавляются к этим значениям.
   - Это может приводить к неожиданным результатам, особенно при использовании фиксированных размеров.

   ```

   .example-content-box {
     width: 200px;
     padding: 20px;
     border: 10px solid #000;
     box-sizing: content-box;
   }
   
```
   В этом примере реальная ширина элемента будет `200px + 20px + 20px (padding) + 10px + 10px (border) = 260px`.

2. **`border-box`**
   - При использовании `border-box` ширина и высота элемента включают его содержимое, внутренние отступы и границы. Это делает макет более предсказуемым.
   - Все пространство внутри указанных ширины и высоты используется для содержимого, padding и border.

   ```

   .example-border-box {
     width: 200px;
     padding: 20px;
     border: 10px solid #000;
     box-sizing: border-box;
   }
   
```
   В этом примере реальная ширина элемента останется 200px, потому что padding и border будут включены в общую ширину.

### Примеры использования

#### Установить `border-box` для всех элементов
Часто бывает полезно задать `box-sizing: border-box` для всех элементов на странице, чтобы избежать проблем с размерами элементов.

```

*,
*::before,
*::after {
  box-sizing: border-box;
}

```

Этот код устанавливает `box-sizing: border-box` для всех элементов и псевдоэлементов на странице, что упрощает управление размерами и отступами.

### Пример HTML и CSS

```

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Пример box-sizing</title>
    <style>
        .content-box-example,
        .border-box-example {
            margin: 10px;
            padding: 20px;
            border: 5px solid #333;
        }
        
        .content-box-example {
            width: 200px;
            box-sizing: content-box;
            background-color: lightblue;
        }
        
        .border-box-example {
            width: 200px;
            box-sizing: border-box;
            background-color: lightcoral;
        }
    </style>
</head>
<body>
    <div class="content-box-example">
        Это пример с box-sizing: content-box.
    </div>
    <div class="border-box-example">
        Это пример с box-sizing: border-box.
    </div>
</body>
</html>

```

В этом примере два блока имеют одинаковую ширину 200px, но один использует `content-box`, а другой — `border-box`. Вы можете заметить разницу в визуальной ширине из-за того, как учитываются padding и border.
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Переопределение ширины блока

Свойство box-sizing позволяет переопределить установленные размеры элементов. Оно может принимать одно из следующих значений:

Свойство `box-sizing` в CSS определяет, как рассчитываются размеры элемента, включая его ширину и высоту, а также его внутренние отступы (padding) и границы (border). Оно особенно полезно для создания более предсказуемых макетов и предотвращения переполнения элементов.

### Значения `box-sizing`

1. **`content-box` (значение по умолчанию)**
   - При использовании `content-box` ширина и высота элемента задаются для его содержимого. Внутренние отступы (padding) и границы (border) добавляются к этим значениям.
   - Это может приводить к неожиданным результатам, особенно при использовании фиксированных размеров.

   ```

   .example-content-box {
     width: 200px;
     padding: 20px;
     border: 10px solid #000;
     box-sizing: content-box;
   }
   
```
   В этом примере реальная ширина элемента будет `200px + 20px + 20px (padding) + 10px + 10px (border) = 260px`.

2. **`border-box`**
   - При использовании `border-box` ширина и высота элемента включают его содержимое, внутренние отступы и границы. Это делает макет более предсказуемым.
   - Все пространство внутри указанных ширины и высоты используется для содержимого, padding и border.

   ```

   .example-border-box {
     width: 200px;
     padding: 20px;
     border: 10px solid #000;
     box-sizing: border-box;
   }
   
```
   В этом примере реальная ширина элемента останется 200px, потому что padding и border будут включены в общую ширину.

### Примеры использования

#### Установить `border-box` для всех элементов
Часто бывает полезно задать `box-sizing: border-box` для всех элементов на странице, чтобы избежать проблем с размерами элементов.

```

*,
*::before,
*::after {
  box-sizing: border-box;
}

```

Этот код устанавливает `box-sizing: border-box` для всех элементов и псевдоэлементов на странице, что упрощает управление размерами и отступами.

### Пример HTML и CSS

```

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Пример box-sizing</title>
    <style>
        .content-box-example,
        .border-box-example {
            margin: 10px;
            padding: 20px;
            border: 5px solid #333;
        }
        
        .content-box-example {
            width: 200px;
            box-sizing: content-box;
            background-color: lightblue;
        }
        
        .border-box-example {
            width: 200px;
            box-sizing: border-box;
            background-color: lightcoral;
        }
    </style>
</head>
<body>
    <div class="content-box-example">
        Это пример с box-sizing: content-box.
    </div>
    <div class="border-box-example">
        Это пример с box-sizing: border-box.
    </div>
</body>
</html>

```

В этом примере два блока имеют одинаковую ширину 200px, но один использует `content-box`, а другой — `border-box`. Вы можете заметить разницу в визуальной ширине из-за того, как учитываются padding и border.



