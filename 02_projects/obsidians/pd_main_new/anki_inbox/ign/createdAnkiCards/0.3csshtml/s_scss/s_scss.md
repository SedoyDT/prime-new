
#s_scss
#scss

#telegram 

# 🤔 **<u>!Important для чего используется?</u>** 
<!-- basicblock-start oid="Obsty4l7VTHfuMg4x1wTBpTM"  deck='s_scss' -->
🤔 **<u>!Important для чего используется?</u>** ::


Для повышения приоритета конкретного правила, чтобы оно переопределяло все другие правила для данного элемента, даже если другие правила имеют более специфичные селекторы.

🚩**Как работает**

Чтобы применить `!important`, добавьте его в конце свойства и перед точкой с запятой:
```
selector {
    property: value !important;
}
```

В этом примере текст в параграфе с классом `important` будет зеленым, несмотря на то, что есть другие правила, определяющие цвет текста для `<p>` и `<p class="special">`.
```
/* Без использования !important */
p {
    color: red;
}

p.special {
    color: blue;
}

/* С использованием !important */
p.important {
    color: green !important;
}
```

🚩**Почему используется**

🟠**Переопределение каскада**
Иногда вам нужно, чтобы определенное правило CSS применялось независимо от других стилей, которые могут быть установлены для этого элемента. `!important` позволяет вам это сделать.

🟠**Временные исправления**
В крупных проектах `!important` может быть полезен для временного исправления или обхода конкретных стилей без необходимости изменять существующие файлы стилей.

В этом примере текст в первом параграфе будет красным, так как применится правило `.normal`. Во втором параграфе текст будет синим, так как правило `.override` с `!important` переопределяет правило `.normal`.
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example</title>
    <style>
        .normal {
            color: red;
        }
        .override {
            color: blue !important;
        }
    </style>
</head>
<body>
    <p class="normal">This text is red.</p>
    <p class="normal override">This text is blue.</p>
</body>
</html>
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->



