```dataview
TABLE WITHOUT ID
("[[" + file.folder + "|" + file.folder + "]]") AS Путь
FROM "anki_inbox/ign/createdAnkiCards/10devops"
WHERE file.folder != "anki_inbox/ign/createdAnkiCards/10devops"
  AND contains(file.folder, "/")
```
