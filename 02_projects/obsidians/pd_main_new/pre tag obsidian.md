Используй такой шаблон для дальнейший ответов. Не отвечай ни в коем случае

---
kanban-plugin: basic
tags:
- tag
- {{title}}
---
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

table dateformat(date(file.ctime), "yyyy-MM-dd") from #{{title}}
sort file.ctime desc
```


#dataview

%% kanban:settings
```
{"kanban-plugin":"basic"}
```
%%