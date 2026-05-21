---
kanban-plugin: basic
tags:
- tag
- WEEKLY
---

# Недельный план — {{date:YYYY-MM}} - week-{{date:WW}}

## Цели недели
kl



```dataviewjs
const file = dv.current().file;

// дата создания текущей заметки
const created = file.ctime;

// разбор даты
const year = created.year;
const month = String(created.month).padStart(2, "0");
const quarter = Math.ceil(created.month / 3);

// base строится от creation date
const base = `${year}/${year}-Q${quarter}/${year}-${month}`;

// сбор подпапок внутри base
const folders = new Map();

for (let f of app.vault.getAllLoadedFiles()) {
  if (f.path.startsWith(base + "/")) {
    const parts = f.path.split("/");

    if (parts.length > 4) {
      const folderPath = parts.slice(0, -1).join("/");
      const folderName = parts[parts.length - 2];

      folders.set(folderPath, folderName);
    }
  }
}

// вывод ссылок на файлы с тем же именем
dv.table(
  ["File"],
  [...folders.entries()].map(([folderPath, name]) => {
    const filePath = `${folderPath}/${name}`;
    return [dv.fileLink(filePath)];
  })
);
```








## 🧭 Матрица Эйзенхауэра за неделю
| Срочно + Важно | Не срочно + Важно |
|----------------|-------------------|
|                |                   |

| Срочно + Не важно | Не срочные и неважные |
| ----------------- | --------------------- |
|                   |                       |
## List Library
- [ ] [[]]
## Documents
- [ ] [[]]

## List A
- [ ] [[]]
- [ ] 
## List B
- [ ] 
## List C
- [ ] [[]]
- [ ] 
## List D
- [ ] 
- [ ] 
## Screenshots
- [ ] 

```dataview

table from #WEEKLY
sort file.ctime desc
```


#dataview

%% kanban:settings
```
{"kanban-plugin":"basic"}
```
%%