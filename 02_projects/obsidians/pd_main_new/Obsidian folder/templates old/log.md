```dataview
table dateformat(date(file.ctime), "yyyy-MM-dd") as "created", dateformat(date(file.mtime), "hh:mm:ss") as "lastEdited",file.tags
sort dateformat(date(file.mtime), "hh:mm:ss") desc
from [[]]
where dateformat(date(file.ctime), "yyyy-MM-dd") = dateformat(date(file.ctime), "2024-01-24")
```
