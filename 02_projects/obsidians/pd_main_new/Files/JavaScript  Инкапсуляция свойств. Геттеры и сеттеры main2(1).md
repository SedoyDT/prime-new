---
created: 2024-07-08T14:03:20 (UTC +03:00)
tags: []
source: https://metanit.com/web/javascript/4.7.php
author: 
---


[JavaScript | Инкапсуляция свойств. Геттеры и сеттеры](https://metanit.com/web/javascript/4.7.php)
created: [[2024-07-08]]
[[]]
[[]]
[[]]
[[]]

# JavaScript | Инкапсуляция свойств. Геттеры и сеттеры

> ## Excerpt
> Инкапсуляция свойств объектов в языке программирования JavaScript, скрытие свойств от доступа извне, сеттеры и геттеры, методы доступа к свойствам

---
## Инкапсуляция свойств. Геттеры и сеттеры

Последнее обновление: 25.10.2023

Инкапсуляция является одним из ключевых понятий объектно-ориентированного программирования и представляет сокрытие состояния объекта от прямого доступа извне для поддержания целостности данных. По умолчанию все свойства объектов являются публичными, общедоступными, и мы к ним можем обратиться из любого места программы.

<table><tbody><tr><td><p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p><p>10</p><p>11</p></td><td><div><p><code>function</code> <code>User(uName, uAge) {</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>this</code><code>.name = uName;</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>this</code><code>.age = uAge;</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>this</code><code>.print = </code><code>function</code><code>(){</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>console.log(`Name: ${</code><code>this</code><code>.name}&nbsp; Age: ${</code><code>this</code><code>.age}`);</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>};</code></p><p><code>}</code></p><p><code>const tom = </code><code>new</code> <code>User(</code><code>"Tom"</code><code>, 39);</code></p><p><code>tom.age = 11500;</code></p><p><code>tom.print();&nbsp;&nbsp;&nbsp;</code></p></div></td></tr></tbody></table>

Однако подобный способ доступа может быть нежелателен. Так, в примере выше свойству age, которое представляет возраст, мы можем присвоить самые разные, в том числе и недопустимые значения.

Но мы можем их скрыть от доступа извне. Для этого свойство определяется как локальная переменная/константа:

<table><tbody><tr><td><p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p><p>10</p><p>11</p></td><td><div><p><code>function</code> <code>User(uName, uAge) {</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>this</code><code>.name = uName;</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>let _age = uAge;</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>this</code><code>.print = </code><code>function</code><code>(){</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>console.log(`Name: ${</code><code>this</code><code>.name}&nbsp; Age: ${_age}`);</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>};</code></p><p><code>}</code></p><p><code>const tom = </code><code>new</code> <code>User(</code><code>"Tom"</code><code>, 39);</code></p><p><code>tom._age = 11500;</code></p><p><code>tom.print();&nbsp;&nbsp;&nbsp;</code></p></div></td></tr></tbody></table>

В конструкторе User объявляется локальная переменная `_age` вместо свойства `age`:

Как правило, названия локальных переменных в конструкторах начинаются со знака подчеркивания. Причем такая переменная также может получать данные из параметров конструктора, и ее можно использовать в функциях внутри конструктора. Однако обратиться извне к ней не получится:

Здесь для объекта tom определяется новое свойство, которое называется, как и переменная \_age. Но это свойство \_age не окажет никакого влияния на локальную переменную \_age, что мы можем увидеть по консольному выводу метода print.

### Геттеры и сеттеры

Выше мы скрыли от доступа извне значение возраста в локальную переменную \_age, однако иногда все таки требуется некоторый доступ, например, для того же консольного вывода или изменения. В этом случае мы можем определить специальные методы доступа - геттер (для получения значения) и сеттер (для изменения значения).

<table><tbody><tr><td><p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p><p>10</p><p>11</p><p>12</p><p>13</p><p>14</p><p>15</p><p>16</p><p>17</p><p>18</p><p>19</p><p>20</p><p>21</p><p>22</p><p>23</p><p>24</p><p>25</p><p>26</p><p>27</p></td><td><div><p><code>function</code> <code>User(uName, uAge) {</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>this</code><code>.name = uName;</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>let _age = uAge;</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>this</code><code>.getAge = </code><code>function</code><code>() { </code><code>return</code> <code>_age; }</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>this</code><code>.setAge = </code><code>function</code><code>(age) {</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>if</code><code>(age &gt;0 &amp;&amp; age&lt;110){&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>_age = age;</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>} </code><code>else</code> <code>{</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>console.log(</code><code>"Недопустимое значение"</code><code>);</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>}</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>}</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>this</code><code>.print = </code><code>function</code><code>(){</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>console.log(`Name: ${</code><code>this</code><code>.name}&nbsp; Age: ${_age}`);</code></p><p><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>};</code></p><p><code>}</code></p><p><code>const tom = </code><code>new</code> <code>User(</code><code>"Tom"</code><code>, 39);</code></p><p><code>console.log(tom.getAge())&nbsp;&nbsp;</code></p><p><code>tom.setAge(22);</code></p><p><code>console.log(tom.getAge())&nbsp;&nbsp;</code></p><p><code>tom.setAge(11500);&nbsp;&nbsp;&nbsp;&nbsp;</code></p><p><code>console.log(tom.getAge())&nbsp;&nbsp;</code></p></div></td></tr></tbody></table>

Для того, чтобы работать с возрастом пользователя извне, определяются два метода. Метод `getAge()` предназначен для получения значения переменной \_age. Этот метод еще называется геттер (getter). Второй метод - `setAge`, который еще называется сеттер (setter), предназначен для установки значения переменной \_age.

Плюсом такого подхода является то, что мы имеем больший контроль над доступом к значению \_age. Например, мы можем проверить какие-то сопутствующие условия, как в данном случае проверяются тип значение (он должен представлять число), само значение (возраст не может быть меньше 0).

Стоит отметить, что JavaScript также предоставляет специальные конструкции для создания геттеров и сеттеров - get и set соответственно. Правда, в контексте функций-конструкторов они не имеют большого смысла, поэтому будут рассмотрены дальше.
created: [[2024-07-08]]