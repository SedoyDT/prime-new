

```dataview

table dateformat(date(file.ctime), "yyyy-MM-dd") as "created",dateformat(date(file.mtime), "yyyy-MM-dd HH:mm:ss") as "edited"
from #20-80
where dateformat(date(file.ctime), "yyyy-MM-dd") = dateformat(date(file.ctime), "{{date:YYYY-MM-DD}}")
sort file.mtime desc
```