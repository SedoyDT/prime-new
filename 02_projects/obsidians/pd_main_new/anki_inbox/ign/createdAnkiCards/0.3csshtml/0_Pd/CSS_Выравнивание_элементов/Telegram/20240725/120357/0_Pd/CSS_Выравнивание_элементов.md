
# Начало карточки

<!-- basicblock-start oid="ObsmSSlwwZ3maSilDClOwUaH"  deck='0_Pd_CSS_Выравнивание_элементов' -->
Как работает выравнивание с помощью inline блоков?::


https://codepen.io/sedoydt/pen/oNrzEGz

Проще всего выравнивать текст по горизонтали. Для этого существует свойство text-align: center, которое применяется к родительскому элементу.

```

.parent {
  text-align: center;
  border: 2px solid blue;
}

```

```

<div class="parent">Текст</div>

```

Несмотря на своё название, text-align можно применять не только к тексту. Для этого нужно сделать элементы, которые хотите выровнять, встроенными — с помощью display: inline-block.

```

.parent {
  text-align: center;
  border: 2px solid blue;
}

.child {
  display: inline-block;
  border: 2px solid black;
}

```

```

<div class="parent">
  <div class="child">Блок с текстом</div>
</div>

```
В этом методе так же, как и в первом, размеры блока подстраиваются под содержимое. Но при желании можно явно задать ширину и высоту.
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Как работает выравнивание с помощью inline блоков?

https://codepen.io/sedoydt/pen/oNrzEGz

Проще всего выравнивать текст по горизонтали. Для этого существует свойство text-align: center, которое применяется к родительскому элементу.

```

.parent {
  text-align: center;
  border: 2px solid blue;
}

```

```

<div class="parent">Текст</div>

```

Несмотря на своё название, text-align можно применять не только к тексту. Для этого нужно сделать элементы, которые хотите выровнять, встроенными — с помощью display: inline-block.

```

.parent {
  text-align: center;
  border: 2px solid blue;
}

.child {
  display: inline-block;
  border: 2px solid black;
}

```

```

<div class="parent">
  <div class="child">Блок с текстом</div>
</div>

```
В этом методе так же, как и в первом, размеры блока подстраиваются под содержимое. Но при желании можно явно задать ширину и высоту.



