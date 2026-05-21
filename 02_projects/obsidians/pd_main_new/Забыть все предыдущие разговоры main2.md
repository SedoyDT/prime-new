---
created: 2024-10-06T16:40:55 (UTC +03:00)
tags: []
source: https://chatgpt.com/c/670274c9-6f54-8001-b733-871a1aaf2683
author: 
---


[Забыть все предыдущие разговоры](https://chatgpt.com/c/670274c9-6f54-8001-b733-871a1aaf2683)
created: [[2024-10-06]]
[[]]
[[]]
[[]]
[[]]

# Забыть все предыдущие разговоры

> ## Excerpt
> A conversational AI system that listens, learns, and challenges

---
Работа с `history` в JavaScript позволяет управлять историей посещенных страниц в браузере. Основные методы, которые мы будем использовать, это `history.back()`, `history.forward()`, и `history.go()`.

Вот примеры, показывающие, как они работают:

### Пример 1: Использование `history.back()`

Этот метод возвращает на одну страницу назад в истории браузера.

```
<div><p>html</p><p><code id="code-lang-html"><span>&lt;!DOCTYPE <span>html</span>&gt;</span>
<span>&lt;<span>html</span> <span>lang</span>=<span>"en"</span>&gt;</span>
<span>&lt;<span>head</span>&gt;</span>
    <span>&lt;<span>meta</span> <span>charset</span>=<span>"UTF-8"</span>&gt;</span>
    <span>&lt;<span>meta</span> <span>name</span>=<span>"viewport"</span> <span>content</span>=<span>"width=device-width, initial-scale=1.0"</span>&gt;</span>
    <span>&lt;<span>title</span>&gt;</span>History Back Example<span>&lt;/<span>title</span>&gt;</span>
<span>&lt;/<span>head</span>&gt;</span>
<span>&lt;<span>body</span>&gt;</span>
    <span>&lt;<span>h1</span>&gt;</span>History Back Example<span>&lt;/<span>h1</span>&gt;</span>
    <span>&lt;<span>button</span> <span>id</span>=<span>"back-button"</span>&gt;</span>Назад<span>&lt;/<span>button</span>&gt;</span>
    <span>&lt;<span>script</span>&gt;</span><span>
        <span>document</span>.<span>getElementById</span>(<span>'back-button'</span>).<span>addEventListener</span>(<span>'click'</span>, <span>() =&gt;</span> {
            history.<span>back</span>(); <span>// Возвращает на предыдущую страницу</span>
        });
    </span><span>&lt;/<span>script</span>&gt;</span>
<span>&lt;/<span>body</span>&gt;</span>
<span>&lt;/<span>html</span>&gt;</span>
</code></p></div>
```

### Пример 2: Использование `history.forward()`

Этот метод возвращает на одну страницу вперед в истории браузера.

```
<div><p>html</p><p><code id="code-lang-html"><span>&lt;!DOCTYPE <span>html</span>&gt;</span>
<span>&lt;<span>html</span> <span>lang</span>=<span>"en"</span>&gt;</span>
<span>&lt;<span>head</span>&gt;</span>
    <span>&lt;<span>meta</span> <span>charset</span>=<span>"UTF-8"</span>&gt;</span>
    <span>&lt;<span>meta</span> <span>name</span>=<span>"viewport"</span> <span>content</span>=<span>"width=device-width, initial-scale=1.0"</span>&gt;</span>
    <span>&lt;<span>title</span>&gt;</span>History Forward Example<span>&lt;/<span>title</span>&gt;</span>
<span>&lt;/<span>head</span>&gt;</span>
<span>&lt;<span>body</span>&gt;</span>
    <span>&lt;<span>h1</span>&gt;</span>History Forward Example<span>&lt;/<span>h1</span>&gt;</span>
    <span>&lt;<span>button</span> <span>id</span>=<span>"forward-button"</span>&gt;</span>Вперед<span>&lt;/<span>button</span>&gt;</span>
    <span>&lt;<span>script</span>&gt;</span><span>
        <span>document</span>.<span>getElementById</span>(<span>'forward-button'</span>).<span>addEventListener</span>(<span>'click'</span>, <span>() =&gt;</span> {
            history.<span>forward</span>(); <span>// Переходит на следующую страницу</span>
        });
    </span><span>&lt;/<span>script</span>&gt;</span>
<span>&lt;/<span>body</span>&gt;</span>
<span>&lt;/<span>html</span>&gt;</span>
</code></p></div>
```

### Пример 3: Использование `history.go()`

Метод `history.go()` позволяет переходить к любой странице в истории, используя целое число в качестве аргумента. Например, `-1` вернет на одну страницу назад, `1` — вперед, а `0` обновит текущую страницу.

```
<div><p>html</p><p><code id="code-lang-html"><span>&lt;!DOCTYPE <span>html</span>&gt;</span>
<span>&lt;<span>html</span> <span>lang</span>=<span>"en"</span>&gt;</span>
<span>&lt;<span>head</span>&gt;</span>
    <span>&lt;<span>meta</span> <span>charset</span>=<span>"UTF-8"</span>&gt;</span>
    <span>&lt;<span>meta</span> <span>name</span>=<span>"viewport"</span> <span>content</span>=<span>"width=device-width, initial-scale=1.0"</span>&gt;</span>
    <span>&lt;<span>title</span>&gt;</span>History Go Example<span>&lt;/<span>title</span>&gt;</span>
<span>&lt;/<span>head</span>&gt;</span>
<span>&lt;<span>body</span>&gt;</span>
    <span>&lt;<span>h1</span>&gt;</span>History Go Example<span>&lt;/<span>h1</span>&gt;</span>
    <span>&lt;<span>button</span> <span>id</span>=<span>"go-back-button"</span>&gt;</span>Назад<span>&lt;/<span>button</span>&gt;</span>
    <span>&lt;<span>button</span> <span>id</span>=<span>"go-forward-button"</span>&gt;</span>Вперед<span>&lt;/<span>button</span>&gt;</span>
    <span>&lt;<span>button</span> <span>id</span>=<span>"refresh-button"</span>&gt;</span>Обновить<span>&lt;/<span>button</span>&gt;</span>
    <span>&lt;<span>script</span>&gt;</span><span>
        <span>document</span>.<span>getElementById</span>(<span>'go-back-button'</span>).<span>addEventListener</span>(<span>'click'</span>, <span>() =&gt;</span> {
            history.<span>go</span>(-<span>1</span>); <span>// Возвращает на предыдущую страницу</span>
        });

        <span>document</span>.<span>getElementById</span>(<span>'go-forward-button'</span>).<span>addEventListener</span>(<span>'click'</span>, <span>() =&gt;</span> {
            history.<span>go</span>(<span>1</span>); <span>// Переходит на следующую страницу</span>
        });

        <span>document</span>.<span>getElementById</span>(<span>'refresh-button'</span>).<span>addEventListener</span>(<span>'click'</span>, <span>() =&gt;</span> {
            history.<span>go</span>(<span>0</span>); <span>// Обновляет текущую страницу</span>
        });
    </span><span>&lt;/<span>script</span>&gt;</span>
<span>&lt;/<span>body</span>&gt;</span>
<span>&lt;/<span>html</span>&gt;</span>
</code></p></div>
```

### Пример 4: Обработка `popstate` для управления состоянием

Когда вы используете методы `pushState` или `replaceState`, вы можете также обрабатывать события `popstate`, чтобы реагировать на навигацию назад и вперед.

```
<div><p>html</p><p><code id="code-lang-html"><span>&lt;!DOCTYPE <span>html</span>&gt;</span>
<span>&lt;<span>html</span> <span>lang</span>=<span>"en"</span>&gt;</span>
<span>&lt;<span>head</span>&gt;</span>
    <span>&lt;<span>meta</span> <span>charset</span>=<span>"UTF-8"</span>&gt;</span>
    <span>&lt;<span>meta</span> <span>name</span>=<span>"viewport"</span> <span>content</span>=<span>"width=device-width, initial-scale=1.0"</span>&gt;</span>
    <span>&lt;<span>title</span>&gt;</span>Popstate Example<span>&lt;/<span>title</span>&gt;</span>
<span>&lt;/<span>head</span>&gt;</span>
<span>&lt;<span>body</span>&gt;</span>
    <span>&lt;<span>h1</span>&gt;</span>Popstate Example<span>&lt;/<span>h1</span>&gt;</span>
    <span>&lt;<span>button</span> <span>id</span>=<span>"go-to-page-1"</span>&gt;</span>Перейти на страницу 1<span>&lt;/<span>button</span>&gt;</span>
    <span>&lt;<span>button</span> <span>id</span>=<span>"go-to-page-2"</span>&gt;</span>Перейти на страницу 2<span>&lt;/<span>button</span>&gt;</span>

    <span>&lt;<span>div</span> <span>id</span>=<span>"content"</span>&gt;</span><span>&lt;/<span>div</span>&gt;</span>

    <span>&lt;<span>script</span>&gt;</span><span>
        <span>function</span> <span>loadPage</span>(<span>page</span>) {
            <span>document</span>.<span>getElementById</span>(<span>'content'</span>).<span>innerText</span> = <span>`Содержимое страницы <span>${page}</span>`</span>;
            history.<span>pushState</span>({ <span>page</span>: page }, <span>''</span>, <span>`?page=<span>${page}</span>`</span>);
        }

        <span>window</span>.<span>addEventListener</span>(<span>'popstate'</span>, <span>(<span>event</span>) =&gt;</span> {
            <span>if</span> (event.<span>state</span>) {
                <span>loadPage</span>(event.<span>state</span>.<span>page</span>);
            }
        });

        <span>document</span>.<span>getElementById</span>(<span>'go-to-page-1'</span>).<span>addEventListener</span>(<span>'click'</span>, <span>() =&gt;</span> {
            <span>loadPage</span>(<span>1</span>);
        });

        <span>document</span>.<span>getElementById</span>(<span>'go-to-page-2'</span>).<span>addEventListener</span>(<span>'click'</span>, <span>() =&gt;</span> {
            <span>loadPage</span>(<span>2</span>);
        });
    </span><span>&lt;/<span>script</span>&gt;</span>
<span>&lt;/<span>body</span>&gt;</span>
<span>&lt;/<span>html</span>&gt;</span>
</code></p></div>
```

### Объяснение кода:

-   **loadPage(page)**: Эта функция обновляет содержимое страницы и добавляет новое состояние в историю с помощью `pushState`.
-   **popstate**: Это событие срабатывает, когда пользователь переходит к предыдущей или следующей странице в истории. Оно позволяет загружать нужное содержимое, сохраняя при этом состояние.

### Итоги

Использование методов `history` позволяет создать плавный интерфейс с поддержкой навигации, которая не требует перезагрузки страницы. Это особенно полезно для одностраничных приложений (SPA) и динамически загружаемых контентов.
created: [[2024-10-06]]