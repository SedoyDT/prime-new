```dataview
TABLE WITHOUT ID
("[[" + file.folder + "|" + file.folder + "]]") AS Путь
FROM "anki_inbox/ign/createdAnkiCards/11jqueryanki"
WHERE file.folder != "anki_inbox/ign/createdAnkiCards/11jqueryanki"
  AND contains(file.folder, "/")
```
