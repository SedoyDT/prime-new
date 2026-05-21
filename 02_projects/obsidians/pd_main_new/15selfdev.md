
```dataview
TABLE WITHOUT ID
("[[" + file.folder + "|" + file.folder + "]]") AS Путь
FROM "anki_inbox/ign/createdAnkiCards/15selfDev"
WHERE file.folder != "anki_inbox/ign/createdAnkiCards/15selfDev"
  AND contains(file.folder, "/")
```

