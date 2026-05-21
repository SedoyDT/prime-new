---
author: Frolov Anatolui
date: 2025-05-28
time: 19:05:15
aliases: 
- 
tags:
- unique-note
---
```dataview
TABLE dateformat(date(file.ctime), "yyyy-MM-dd") as "created", file.name 
FROM "copilot-conversations"
```

