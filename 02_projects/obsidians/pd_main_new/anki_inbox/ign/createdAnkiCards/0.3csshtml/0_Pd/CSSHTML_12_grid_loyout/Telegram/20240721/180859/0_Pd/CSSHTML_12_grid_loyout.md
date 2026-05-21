
# Начало карточки

<!-- basicblock-start oid="ObsKAJTvmb1QP9bAEetClnwB"  deck='0_Pd_CSSHTML_12_grid_loyout' -->
Что такое именнованные грид линии и как они работают?::


```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width" />
        <title>Grid Layout в CSS3</title>
        <style>
            *{
                box-sizing: border-box;
            }
            html, body {
                padding: 0;
                margin: 0;
            }
 
            .grid-container {
                display: grid;
                height: 100vh;
                grid-template-rows: 6em 10px 1fr;
                grid-template-columns: [mainstart] 1fr [mainend] 10px [sidebarestart] 25% [sidebarend];
            }
 
            .grid-item-content {
                background-color: #455a64;
                grid-row: 3 / 4;
                grid-column: mainstart / mainend;
            }
 
            .grid-item-sidebar {
                background-color: #37474f;
                grid-row: 3 / 4;
                grid-column: sidebarestart / sidebarend;
            }
 
            .grid-item-header{
                background-color: #263238;
                grid-row: 1 / 2;
                grid-column: mainstart / sidebarend;
            }
 
            .grid-item {
                color: #fff;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <main class="grid-container">
            <header class="grid-item grid-item-header">
                <h1>Header</h1>
            </header>
                 
            <article class="grid-item grid-item-content">
                <h1>Main Content</h1>
            </article>
             
            <aside class="grid-item grid-item-sidebar">
                <h1>Sidebar</h1>
            </aside>
        </main>
    </body>
</html>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что такое именнованные грид линии и как они работают?

```

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width" />
        <title>Grid Layout в CSS3</title>
        <style>
            *{
                box-sizing: border-box;
            }
            html, body {
                padding: 0;
                margin: 0;
            }
 
            .grid-container {
                display: grid;
                height: 100vh;
                grid-template-rows: 6em 10px 1fr;
                grid-template-columns: [mainstart] 1fr [mainend] 10px [sidebarestart] 25% [sidebarend];
            }
 
            .grid-item-content {
                background-color: #455a64;
                grid-row: 3 / 4;
                grid-column: mainstart / mainend;
            }
 
            .grid-item-sidebar {
                background-color: #37474f;
                grid-row: 3 / 4;
                grid-column: sidebarestart / sidebarend;
            }
 
            .grid-item-header{
                background-color: #263238;
                grid-row: 1 / 2;
                grid-column: mainstart / sidebarend;
            }
 
            .grid-item {
                color: #fff;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <main class="grid-container">
            <header class="grid-item grid-item-header">
                <h1>Header</h1>
            </header>
                 
            <article class="grid-item grid-item-content">
                <h1>Main Content</h1>
            </article>
             
            <aside class="grid-item grid-item-sidebar">
                <h1>Sidebar</h1>
            </aside>
        </main>
    </body>
</html>
```



