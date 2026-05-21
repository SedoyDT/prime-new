```dataview
TABLE WITHOUT ID
("[[" + file.folder + "|" + file.folder + "]]") AS Путь
FROM "anki_inbox/ign/createdAnkiCards/14angularAnki"
WHERE file.folder != "anki_inbox/ign/createdAnkiCards/14angularAnki"
  AND contains(file.folder, "/")
```
