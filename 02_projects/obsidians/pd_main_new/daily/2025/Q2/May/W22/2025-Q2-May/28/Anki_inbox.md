---
author: Frolov Anatolui
date: 2025-05-28
time: 20:05:40
aliases: 
tags:
  - unique-note
---

```dataview
TABLE dateformat(date(file.ctime), "yyyy-MM-dd") as "created", file.name 
FROM "anki_inbox"
```
