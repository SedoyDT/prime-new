---
created: 2024-08-20T08:43:16 (UTC +03:00)
tags: []
source: https://devdocs.io/css/width
author: 
---

# CSS / width — DevDocs

> ## Excerpt
> Fast, offline, and free documentation browser for developers. Search 100+ docs in one web app including HTML, CSS, JavaScript, PHP, Ruby, Python, Go, C, C++, and many more.

---
## ширина

Свойство `width` CSS задает ширину элемента. По умолчанию он устанавливает ширину [области содержимого](https://devdocs.io/css/css_box_model/introduction_to_the_css_box_model#content_area), но если [`box-sizing`](https://devdocs.io/css/box-sizing) установлено значение `border-box`, то устанавливается ширина [пограничной области](https://devdocs.io/css/css_box_model/introduction_to_the_css_box_model#border_area).

## Попробуйте

Указанное значение `width` применяется к области содержимого до тех пор, пока его значение остается в пределах значений, определенных [`min-width`](https://devdocs.io/css/min-width) и [`max-width`](https://devdocs.io/css/max-width).

-   Если значение для `width` меньше значения для `min-width`, то `min-width` переопределяется `width`.
-   Если значение для `width` больше значения для `max-width`, то `max-width` переопределяется `width`.

## Синтаксис

```css
width/* значения <длины> */ 300px;
width: 25em;


width: 75%;


width: max-content;
width: min-content;
width: fit-content(20em);
width: auto; 


ширина: унаследовать;
ширина: начальная;
ширина: вернуть;
ширина: вернуть слой;
ширина: сбросить;
```

### Значения

[`<length>`](https://devdocs.io/css/length)

Определяет ширину как значение расстояния.

[`<percentage>`](https://devdocs.io/css/percentage)

Определяет ширину как процент от ширины [содержащего блока](https://devdocs.io/css/containing_block).

[`auto`](https://devdocs.io/css/width#auto)

Браузер рассчитает и выберет ширину для указанного элемента.

[`max-content`](https://devdocs.io/css/width#max-content)

Внутренняя предпочтительная ширина.

[`min-content`](https://devdocs.io/css/width#min-content)

Внутренняя минимальная ширина.

[`fit-content(`](https://devdocs.io/css/width#fit-content)``[`<length-percentage>`](https://devdocs.io/css/length-percentage))``

Использует формулу fit-content, в которой доступное пространство заменяется указанным аргументом, т.е. `min(max-content, max(min-content, <length-percentage>))`.

## Проблемы с доступом

Убедитесь, что элементы, заданные с помощью `width`, не обрезаются и / или не закрывают другое содержимое при увеличении масштаба страницы для увеличения размера текста.

-   [Понимание MDN WCAG, пояснения к руководству 1.4](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable#guideline_1.4_make_it_easier_for_users_to_see_and_hear_content_including_separating_foreground_from_background)
-   [Понимание критерия успеха 1.4.4 | W3C Понимание WCAG 2.0](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-scale.html)

## Формальное определение

## Формальный синтаксис

```
<span id="width"><ya-tr-span data-index="459-0" data-translated="true" data-source-lang="en" data-target-lang="ru" data-value="width = " data-translation="width = " data-ch="0" data-type="trSpan">width = </ya-tr-span></span><br>  <span><ya-tr-span data-index="459-0" data-translated="true" data-source-lang="en" data-target-lang="ru" data-value="auto" data-translation="auto" data-ch="0" data-type="trSpan">auto</ya-tr-span></span>                                      <a href="https://devdocs.io/css/value_definition_syntax#single_bar"><ya-tr-span data-index="459-0" data-translated="true" data-source-lang="en" data-target-lang="ru" data-value="|" data-translation="|" data-ch="0" data-type="trSpan">|</ya-tr-span></a><br>  <a href="https://devdocs.io/css/length-percentage"><span><ya-tr-span data-index="459-0" data-translated="true" data-source-lang="en" data-target-lang="ru" data-value="<length-percentage [0,∞]>" data-translation="<длина в процентах [0,∞]>" data-ch="0" data-type="trSpan">&lt;длина в процентах [0,∞]&gt;</ya-tr-span></span></a>                 <a href="https://devdocs.io/css/value_definition_syntax#single_bar"><ya-tr-span data-index="459-0" data-translated="true" data-source-lang="en" data-target-lang="ru" data-value="|" data-translation="|" data-ch="0" data-type="trSpan">|</ya-tr-span></a><br>  <span><ya-tr-span data-index="460-0" data-translated="true" data-source-lang="en" data-target-lang="ru" data-value="min-content" data-translation="минимальное содержимое" data-ch="0" data-type="trSpan">минимальное содержимое</ya-tr-span></span>                               <a href="https://devdocs.io/css/value_definition_syntax#single_bar"><ya-tr-span data-index="460-0" data-translated="true" data-source-lang="en" data-target-lang="ru" data-value="|" data-translation="|" data-ch="0" data-type="trSpan">|</ya-tr-span></a><br>  <span><ya-tr-span data-index="461-0" data-translated="true" data-source-lang="en" data-target-lang="ru" data-value="max-content" data-translation="максимальное содержимое" data-ch="0" data-type="trSpan">максимальное содержимое</ya-tr-span></span>                               <a href="https://devdocs.io/css/value_definition_syntax#single_bar"><ya-tr-span data-index="461-0" data-translated="true" data-source-lang="en" data-target-lang="ru" data-value="|" data-translation="|" data-ch="0" data-type="trSpan">|</ya-tr-span></a><br>  <span><ya-tr-span data-index="462-0" data-translated="true" data-source-lang="en" data-target-lang="ru" data-value="fit-content(" data-translation="подгонка содержимого(" data-ch="0" data-type="trSpan">подгонка содержимого(</ya-tr-span></span> <a href="https://devdocs.io/css/length-percentage"><span><ya-tr-span data-index="462-0" data-translated="true" data-source-lang="en" data-target-lang="ru" data-value="<length-percentage [0,∞]>" data-translation="<длина в процентах [0,∞]>" data-ch="0" data-type="trSpan">&lt;длина в процентах [0,∞]&gt;</ya-tr-span></span></a> <span><ya-tr-span data-index="462-0" data-translated="true" data-source-lang="en" data-target-lang="ru" data-value=")" data-translation=")" data-ch="0" data-type="trSpan">)</ya-tr-span></span>  <br><br><span id="<length-percentage>"><ya-tr-span data-index="463-0" data-translated="true" data-source-lang="en" data-target-lang="ru" data-value="<length-percentage> = " data-translation="<длина-в процентах> = " data-ch="0" data-type="trSpan">&lt;длина-в процентах&gt; = </ya-tr-span></span><br>  <a href="https://devdocs.io/css/length"><span><ya-tr-span data-index="464-0" data-translated="true" data-source-lang="en" data-target-lang="ru" data-value="<length>" data-translation="<длина>" data-ch="0" data-type="trSpan">&lt;длина&gt;</ya-tr-span></span></a>      <a href="https://devdocs.io/css/value_definition_syntax#single_bar"><ya-tr-span data-index="464-0" data-translated="true" data-source-lang="en" data-target-lang="ru" data-value="|" data-translation="|" data-ch="0" data-type="trSpan">|</ya-tr-span></a><br>  <a href="https://devdocs.io/css/percentage"><span><ya-tr-span data-index="464-0" data-translated="true" data-source-lang="en" data-target-lang="ru" data-value="<percentage>" data-translation="<процент>" data-ch="0" data-type="trSpan">&lt;процент&gt;</ya-tr-span></span></a>  <br><br>
```

## Примеры

### Ширина по умолчанию

```css
: background
  {p.goldie gold;
}
```

```html
>" =goldie"class<pСообщество Mozilla производит множество отличного программного обеспечения.</p>
```

### Example using pixels and ems

```css
.px_length {
  width: 200px;
  background-color: red;
  color: white;
  border: 1px solid black;
}

.em_length {
  width: 20em;
  background-color: white;
  color: red;
  border: 1px solid black;
}
```

```html
<div class="px_length">Width measured in px</div>
<div class="em_length">Width measured in em</div>
```

### Example with percentage

```css
.percent {
  width: 20%;
  background-color: silver;
  border: 1px solid red;
}
```

```html
<div class="percent">Width in percentage</div>
```

### Example using "max-content"

```css
p.maxgreen {
  background: lightgreen;
  width: intrinsic; 
  width: -moz-max-content; 
  width: -webkit-max-content; 
  width: max-content;
}
```

```html
<p class="maxgreen">The Mozilla community produces a lot of great software.</p>
```

### Example using "min-content"

```css
p.minblue {
  background: lightblue;
  width: -moz-min-content; 
  width: -webkit-min-content; 
  width: min-content;
}
```

```html
>" =minblue"class<pСообщество Mozilla производит множество отличного программного обеспечения.</p>
```

## Технические характеристики

## Совместимость с браузерами

|  | Для рабочего стола | Мобильный |
| --- | --- | --- |
|  | Chrome | Край | Firefox | Internet Explorer | Opera | Safari | WebView для Android | Chrome для Android | Firefox для Android | Opera для Android | Safari на IOS | Samsung Internet |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `width` | 1 | 12 | 1 | 4 | 3.5 | 1 | 4.4 | 18 | 4 | 10.1 | 1 | 1.0 |
| `animatable` | 26 | 12 | 16 | 11 | 15 | 7 | 4.4 | 26 | 16 | 14 | 7 | 1.5 |
| `fit-content` | 46221–48 | 7979 | 943 | НЕТ | 331515–35 | 1172 | 464.44.4–48 | 462518–48 | 944 | 331414–35 | 1171 | 5.01.51.0–5.0 |
| `fit-content_function` | НЕТ | НЕТ | 91 | НЕТ | НЕТ | НЕТ | НЕТ | НЕТ | НЕТ | НЕТ | НЕТ | НЕТ |
| `max-content` | 4622 | 7979 | 663 | НЕТ | 44 | 112 | 46 | 46 | 664 | 43 | 111 | 5.0 |
| `min-content` | 461–48 | 79 | 663 | НЕТ | 3315–35 | 112 | 464.4–48 | 4618–48 | 664 | 3314–35 | 111 | 5.01.0–5.0 |
| `stretch` | 22 | 79 | 3 | НЕТ | 15 | 7 | 4.4 | 25 | 4 | 14 | 7 | 5.0 |

## Смотрите также
