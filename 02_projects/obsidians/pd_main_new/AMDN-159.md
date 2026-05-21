https://my-atlassian-site-131.atlassian.net/browse/AMDN-159

Необходимо добавить возможность обработки массива с пользователями, а так же создание нового праметра для API - алгоритм выбора владельца для лида из массива пользователей ( необязательный к передаче).  
Методы выбора пользователя:  
- Случайно  
- С минимальной загрузкой

---

1. добавить параметр users - массив цифр
2. добавить параметр userSelectionStrat - цифра, 1 - случайно, 2 - мин загрузка
3. перегенирить файлы rest api
4. реализовать выбор стратегии выбора
    1. userId в приоритете

---

Что сделал?

Внес изменения в файл config.json

```json
"users": {  
    "description": "id пользователей в системе",  
    "type": "array",  
    "required": false,  
    "items": {  
        "type": "integer"  
    }  
},  
"userSelectionStrat": {  
    "description": "алгоритм выбора пользователей из списка users 1 - рандомно, 2 - с минимальной загрузкой",  
    "type": "integer",  
    "required": false,  
    "enum": [1,2]  
}
```

Выполнил
~/amd-docker-dev/bin/amd-executor.sh php ../amd-code-generator/bin/console rest-api:generate SalesFunnel Lead