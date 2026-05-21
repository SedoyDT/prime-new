---
created: 2024-08-19T21:14:46 (UTC +03:00)
tags: []
source: https://devdocs.io/css/width
author: 
---


[CSS / width — DevDocs](https://devdocs.io/css/width)
created: [[2024-08-19]]
[[]]
[[]]
[[]]
[[]]

# CSS / width — DevDocs

> ## Excerpt
> Fast, offline, and free documentation browser for developers. Search 100+ docs in one web app including HTML, CSS, JavaScript, PHP, Ruby, Python, Go, C, C++, and many more.

---
## width

The `width` CSS property sets an element's width. By default, it sets the width of the [content area][], but if [`box-sizing`][] is set to `border-box`, it sets the width of the [border area][].

## Try it

The specified value of `width` applies to the content area so long as its value remains within the values defined by [`min-width`][] and [`max-width`][].

-   If the value for `width` is less than the value for `min-width`, then `min-width` overrides `width`.
-   If the value for `width` is greater than the value for `max-width`, then `max-width` overrides `width`.

## Syntax

```css
width: 300px;
width: 25em;


width: 75%;


width: max-content;
width: min-content;
width: fit-content(20em);
width: auto;


width: inherit;
width: initial;
width: revert;
width: revert-layer;
width: unset;
```

### Values

[`<length>`][]

Defines the width as a distance value.

[`<percentage>`][]

Defines the width as a percentage of the [containing block][]'s width.

[`auto`][]

The browser will calculate and select a width for the specified element.

[`max-content`][]

The intrinsic preferred width.

[`min-content`][]

The intrinsic minimum width.

[`fit-content(`][]``[`<length-percentage>`][])``

Uses the fit-content formula with the available space replaced by the specified argument, i.e. `min(max-content, max(min-content, <length-percentage>))`.

## Accessibility concerns

Ensure that elements set with a `width` aren't truncated and/or don't obscure other content when the page is zoomed to increase text size.

-   [MDN Understanding WCAG, Guideline 1.4 explanations][]
-   [Understanding Success Criterion 1.4.4 | W3C Understanding WCAG 2.0][]

## Formal definition

<table><tbody><tr><th scope="row"><a href="https://devdocs.io/css/initial_value">Initial value</a></th><td><code>auto</code></td></tr><tr><th scope="row">Applies to</th><td>all elements but non-replaced inline elements, table rows, and row groups</td></tr><tr><th scope="row"><a href="https://devdocs.io/css/inheritance">Inherited</a></th><td>no</td></tr><tr><th scope="row">Percentages</th><td>refer to the width of the containing block</td></tr><tr><th scope="row"><a href="https://devdocs.io/css/computed_value">Computed value</a></th><td>a percentage or <code>auto</code> or the absolute length</td></tr><tr><th scope="row">Animation type</th><td>a <a href="https://devdocs.io/css/length#interpolation">length</a>, <a href="https://devdocs.io/css/percentage#interpolation">percentage</a> or calc();</td></tr></tbody></table>

## Formal syntax

```
<span id="width">width = </span><br>  <span>auto</span>                                      <a href="https://devdocs.io/css/value_definition_syntax#single_bar">|</a><br>  <a href="https://devdocs.io/css/length-percentage"><span>&lt;length-percentage [0,∞]&gt;</span></a>                 <a href="https://devdocs.io/css/value_definition_syntax#single_bar">|</a><br>  <span>min-content</span>                               <a href="https://devdocs.io/css/value_definition_syntax#single_bar">|</a><br>  <span>max-content</span>                               <a href="https://devdocs.io/css/value_definition_syntax#single_bar">|</a><br>  <span>fit-content(</span> <a href="https://devdocs.io/css/length-percentage"><span>&lt;length-percentage [0,∞]&gt;</span></a> <span>)</span>  <br><br><span id="<length-percentage>">&lt;length-percentage&gt; = </span><br>  <a href="https://devdocs.io/css/length"><span>&lt;length&gt;</span></a>      <a href="https://devdocs.io/css/value_definition_syntax#single_bar">|</a><br>  <a href="https://devdocs.io/css/percentage"><span>&lt;percentage&gt;</span></a>  <br><br>
```

## Examples

### Default width

```css
p.goldie {
  background: gold;
}
```

```html
<p class="goldie">The Mozilla community produces a lot of great software.</p>
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
<p class="minblue">The Mozilla community produces a lot of great software.</p>
```

## Specifications

## Browser compatibility

|  | Desktop | Mobile |
| --- | --- | --- |
|  | Chrome | Edge | Firefox | Internet Explorer | Opera | Safari | WebView Android | Chrome Android | Firefox for Android | Opera Android | Safari on IOS | Samsung Internet |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `width` | 1 | 12 | 1 | 4 | 3.5 | 1 | 4.4 | 18 | 4 | 10.1 | 1 | 1.0 |
| `animatable` | 26 | 12 | 16 | 11 | 15 | 7 | 4.4 | 26 | 16 | 14 | 7 | 1.5 |
| `fit-content` | 46221–48 | 7979 | 943 | No | 331515–35 | 1172 | 464.44.4–48 | 462518–48 | 944 | 331414–35 | 1171 | 5.01.51.0–5.0 |
| `fit-content_function` | No | No | 91 | No | No | No | No | No | No | No | No | No |
| `max-content` | 4622 | 7979 | 663 | No | 44 | 112 | 46 | 46 | 664 | 43 | 111 | 5.0 |
| `min-content` | 461–48 | 79 | 663 | No | 3315–35 | 112 | 464.4–48 | 4618–48 | 664 | 3314–35 | 111 | 5.01.0–5.0 |
| `stretch` | 22 | 79 | 3 | No | 15 | 7 | 4.4 | 25 | 4 | 14 | 7 | 5.0 |

## See also

[content area]: https://devdocs.io/css/css_box_model/introduction_to_the_css_box_model#content_area
[`box-sizing`]: https://devdocs.io/css/box-sizing
[border area]: https://devdocs.io/css/css_box_model/introduction_to_the_css_box_model#border_area
[`min-width`]: https://devdocs.io/css/min-width
[`max-width`]: https://devdocs.io/css/max-width
[`<length>`]: https://devdocs.io/css/length
[`<percentage>`]: https://devdocs.io/css/percentage
[containing block]: https://devdocs.io/css/containing_block
[`auto`]: https://devdocs.io/css/width#auto
[`max-content`]: https://devdocs.io/css/width#max-content
[`min-content`]: https://devdocs.io/css/width#min-content
[`fit-content(`]: https://devdocs.io/css/width#fit-content
[`<length-percentage>`]: https://devdocs.io/css/length-percentage
[MDN Understanding WCAG, Guideline 1.4 explanations]: https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable#guideline_1.4_make_it_easier_for_users_to_see_and_hear_content_including_separating_foreground_from_background
[Understanding Success Criterion 1.4.4 | W3C Understanding WCAG 2.0]: https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-scale.html
[Initial value]: https://devdocs.io/css/initial_value
[Inherited]: https://devdocs.io/css/inheritance
[Computed value]: https://devdocs.io/css/computed_value
[length]: https://devdocs.io/css/length#interpolation
[percentage]: https://devdocs.io/css/percentage#interpolation
[|]: https://devdocs.io/css/value_definition_syntax#single_bar
[<length-percentage \[0,∞\]>]: https://devdocs.io/css/length-percentage
[|]: https://devdocs.io/css/value_definition_syntax#single_bar
[|]: https://devdocs.io/css/value_definition_syntax#single_bar
[|]: https://devdocs.io/css/value_definition_syntax#single_bar
[<length-percentage \[0,∞\]>]: https://devdocs.io/css/length-percentage
[<length>]: https://devdocs.io/css/length
[|]: https://devdocs.io/css/value_definition_syntax#single_bar
[<percentage>]: https://devdocs.io/css/percentage
created: [[2024-08-19]]