```dataview
TABLE WITHOUT ID
("[[" + file.folder + "|" + file.folder + "]]") AS Путь
FROM "anki_inbox/ign/createdAnkiCards/13algoAnki"
WHERE file.folder != "anki_inbox/ign/createdAnkiCards/13algoAnki"
  AND contains(file.folder, "/")
```
