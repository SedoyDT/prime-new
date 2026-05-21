
#1_PD_server
#server

#telegram 

# В чем отличие target от currentTarget?
<!-- basicblock-start oid="Obs5WwDhMhnfIhuMHC1ZXSsn"  deck='1_PD_server' -->
В чем отличие target от currentTarget?::

Разница в том, что target относится к элементу, для которого изначально было запущено событие, а currentTarget относится к элементу, к которому был прикреплен этот обработчик события.
https://codepen.io/sedoydt/pen/bGPvRLz
<!-- basicblock-end -->




#1_PD_server
#server

#telegram 

# Как работает погружение?
<!-- basicblock-start oid="ObsZj3t8oYww7ynLBSSlbiUB"  deck='1_PD_server' -->
Как работает погружение?::


https://codepen.io/sedoydt/pen/ZEdxyyE

```
<body>
  <div id="container">
    <button>Click me!</button>
  </div>
  <pre id="output"></pre>
</body>
```

```
const output = document.querySelector("#output");
function handleClick(e) {
  output.textContent += `You clicked on a ${e.currentTarget.tagName} element\n`;
}

const container = document.querySelector("#container");
const button = document.querySelector("button");

document.body.addEventListener("click", handleClick, { capture: true });
container.addEventListener("click", handleClick, { capture: true });
button.addEventListener("click", handleClick);
```
<!-- basicblock-end -->




#1_PD_server
#server

#telegram 

# Как выполнить эту команду в консоли с mv чтобы перенести все файлы кроме bak?
<!-- basicblock-start oid="ObsftAnJdCkQpTWbv6ATeU0m"  deck='1_PD_server' -->
Как выполнить эту команду в консоли с mv чтобы перенести все файлы кроме bak?::


Для перемещения всех файлов, кроме тех, которые содержат "bak" в имени, можно использовать комбинацию команды `find` с `mv`. Вот пример команды, которую можно выполнить в консоли:

```
find . -type f ! -name '*bak*' -exec mv {} /путь/к/целевой/директории/ \;
```

### Разбор команды:

1. `find .` — выполняет поиск в текущей директории.
2. `-type f` — ищет только файлы (не директории).
3. `! -name '*bak*'` — исключает файлы, содержащие "bak" в имени.
4. `-exec mv {} /путь/к/целевой/директории/ \;` — выполняет команду `mv` для каждого найденного файла (`{}` заменяется на имя файла).

Эта команда переместит все файлы, кроме тех, которые содержат "bak" в имени, в указанную целевую директорию.

Замените `/путь/к/целевой/директории/` на реальный путь к нужной вам директории.
<!-- basicblock-end -->



