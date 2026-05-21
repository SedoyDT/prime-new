```dataview
TABLE WITHOUT ID
("[[" + file.folder + "|" + file.folder + "]]") AS Путь
FROM "anki_inbox/ign/createdAnkiCards/12tsanki"
WHERE file.folder != "anki_inbox/ign/createdAnkiCards/12tsanki"
  AND contains(file.folder, "/")
```
