```dataview
table dateformat(date(file.ctime), "yyyy-MM-dd") as "created", dateformat(date(file.mtime), "hh:mm:ss") as "lastEdited",file.tags
from #telegram 
```

sort dateformat(date(file.mtime), "hh:mm:ss") desc
