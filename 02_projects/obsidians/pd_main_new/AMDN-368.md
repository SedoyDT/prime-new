### Исходный запрос
```sql
UPDATE claims AS c  
    JOIN log_main AS lm ON  
        lm.object_id = c.id  
    LEFT JOIN log_events AS le ON  
        lm.event_type_id = le.event_id  
    LEFT JOIN log_fields AS lf ON  
        lf.event_kind_id = lm.event_kind_id  
    LEFT JOIN log_fields_data AS lfd ON  
        lfd.event_id = lm.id  
SET c.date_set_in_work_pending_status = FROM_UNIXTIME(lm.time)  
WHERE lm.event_kind_id = 36 AND  
    le.event_id = 2 AND  
    lf.property_title = 'claimStatus' AND  
    lfd.newValue IS NOT NULL AND  
    lfd.oldValue IS NOT NULL AND  
    lfd.newValue = 55;
```

Ваш запрос действительно может работать **очень долго**, особенно если таблицы `log_main`, `log_fields_data` и другие **не имеют подходящих индексов** или содержат **миллионы записей**.

Давайте оптимизируем его по шагам.

---

## 🔍 Проблемы текущего запроса

1. **Много JOIN'ов**, особенно `LEFT JOIN` к большим лог-таблицам.
2. **Фильтрация по полям из присоединённых таблиц** (`le.event_id`, `lf.property_title`, `lfd.newValue`) без гарантии, что СУБД может эффективно использовать индексы.
3. **Нет индексов** по полям, участвующим в `WHERE` и `JOIN`.
4. Обновление может затрагивать **много строк**, даже если на самом деле нужно обновить **по одной записи на claim** (последнее событие).

---

## ✅ Решение: Оптимизированный подход

### Шаг 1. Убедитесь, что есть **индексы**

Добавьте (если их нет) следующие индексы:

```sql
-- Для log_main
ALTER TABLE log_main ADD INDEX idx_event_kind_object_id (event_kind_id, object_id);
ALTER TABLE log_main ADD INDEX idx_event_type_id (event_type_id);

-- Для log_events (если много строк, но обычно их мало)
-- Достаточно первичного ключа по event_id

-- Для log_fields
ALTER TABLE log_fields ADD INDEX idx_event_kind_property (event_kind_id, property_title);

-- Для log_fields_data
ALTER TABLE log_fields_data ADD INDEX idx_event_id_new_old (event_id, newValue, oldValue);
```

> Особенно критичен индекс на `log_fields_data (event_id, newValue, oldValue)` — он позволит быстро отфильтровать строки с `newValue = 55` и непустыми old/new.

---

### Шаг 2. Перепишите запрос, **сначала отфильтровав нужные event_id из log_fields_data**

Идея: сначала найти **только нужные `lm.id`**, затем обновить.

```sql
UPDATE claims AS c
JOIN (
    SELECT
        lm.object_id AS claim_id,
        MAX(lm.time) AS max_time  -- или MAX(lm.id), если time не уникален
    FROM log_main AS lm
    INNER JOIN log_events AS le
        ON lm.event_type_id = le.event_id AND le.event_id = 2
    INNER JOIN log_fields AS lf
        ON lf.event_kind_id = lm.event_kind_id AND lf.property_title = 'claimStatus'
    INNER JOIN log_fields_data AS lfd
        ON lfd.event_id = lm.id
        AND lfd.newValue = '55'
        AND lfd.oldValue IS NOT NULL
    WHERE
        lm.event_kind_id = 36
    GROUP BY lm.object_id
) AS filtered ON filtered.claim_id = c.id
SET c.date_set_in_work_pending_status = FROM_UNIXTIME(filtered.max_time);
```

> 💡 Почему это быстрее?
> - Мы делаем **один проход** по логам с агрегацией.
> - Используем **INNER JOIN** вместо LEFT JOIN — сразу отсекаем неподходящие строки.
> - Обновляем **ровно по одной строке на claim** (последнее событие).
> - Меньше данных передаётся в `UPDATE`.

> ⚠️ Убедитесь, что `newValue` — строка или число?  
> Если в БД `newValue` — строка (`VARCHAR`), то пишите `'55'`. Если число (`INT`) — `55`. Несоответствие типов **ломает использование индекса**.

---

### Шаг 3. (Опционально) Обновлять только те claims, где поле ещё не заполнено

Если вы запускаете это регулярно, добавьте:

```sql
...
) AS filtered ON filtered.claim_id = c.id
WHERE c.date_set_in_work_pending_status IS NULL  -- только незаполненные
```

Это уменьшит количество обновлений.

---

### Шаг 4. Проверьте план выполнения

Выполните `EXPLAIN` для подзапроса:

```sql
EXPLAIN
SELECT
    lm.object_id,
    MAX(lm.time)
FROM log_main AS lm
...
```

Убедитесь, что в колонке `type` везде `ref` или `range`, а не `ALL`.

---

## 🧪 Альтернатива: пошаговое обновление (если данных очень много)

Если claims — сотни тысяч, обновляйте **пачками**:

```sql
UPDATE claims AS c
JOIN (...) AS filtered ON ...
SET ...
WHERE c.id BETWEEN 1 AND 10000;
```

Или используйте `LIMIT`, но в MySQL `UPDATE` с `JOIN` + `LIMIT` может быть непредсказуем — лучше по ID-диапазонам.

---

## 📌 Итог

Используйте **агрегирующий подзапрос с INNER JOIN и GROUP BY**, добавьте **индексы**, и запрос будет работать **в разы быстрее**.

Если скажете:
- Сколько строк в `log_main` и `log_fields_data`,
- Есть ли уже индексы,
- Нужно ли именно **последнее** событие или **все**,

— я помогу ещё точнее.