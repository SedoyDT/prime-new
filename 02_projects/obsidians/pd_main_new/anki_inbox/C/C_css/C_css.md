
#C_css
#css

#telegram 

# **<u>🤔</u>****<u> Расскажи про особенности свойства color</u>**
<!-- basicblock-start oid="ObsxRmjNCzIKyATsbzANA46A"  deck='C_css' -->
**<u>🤔</u>****<u> Расскажи про особенности свойства color</u>**::


`color` – одно из самых базовых CSS-свойств, которое отвечает за цвет текста и текста в элементах (например, градиентных фонах и SVG).  
```
p {
  color: red;
}
```

🟠**Какие значения принимает `color`?**  
CSS позволяет задавать цвета несколькими способами

🟠**Особенности работы `color`**
Наследование
`color` наследуется потомками по умолчанию, в отличие от многих других свойств CSS (например, `background`).  
```
body {
  color: blue;
}
p {
  color: inherit; /* Явное наследование */
}
```

`currentColor` — скрытое золото
Это специальное значение, которое означает "используй текущее значение `color`". Очень полезно для стилизации `border`, `box-shadow`, `outline` и SVG.  
```
button {
  color: red;
  border: 2px solid currentColor; /* Использует color */
}
```

`transparent` — особый цвет
```
p {
  color: transparent;
}
```

Когда `rgba()` или `hsla()` лучше
```
p {
  color: rgba(255, 0, 0, 0.5); /* Полупрозрачный красный */
}
```

`color` и `mix-blend-mode`
Можно заставить текст взаимодействовать с фоном с помощью `mix-blend-mode`
```
h1 {
  color: white;
  mix-blend-mode: difference;
}
```

`color` в `::selection` и `::placeholder`
Некоторые элементы (например, выделенный текст или placeholder в input) требуют отдельного указания `color`
```
::selection {
  background: blue;
  color: white;
}

input::placeholder {
  color: gray;
}
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->




#C_css
#css

#telegram 

# **🤔**** Как считается вес селектора?**
<!-- basicblock-start oid="ObsxNWt69mANaNNWmZDMv1V6"  deck='C_css' -->
**🤔**** Как считается вес селектора?**::


Вес (специфичность) селектора определяется по "весу" каждой его части. Принцип:
-  ID = 100
-  Класс, атрибут, псевдокласс = 10
-  Тег, псевдоэлемент = 1
-  Инлайн-стиль = 1000 (вне конкуренции)
Селектор с большим весом перебивает селекторы с меньшим весом, если они применяются к одному и тому же элементу.

Ставь 👍 если знал ответ, 🔥 если нет
Забирай [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->



