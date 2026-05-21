Отлично! Вы хотите решить классическую задачу **«gaps and islands»** («острова и промежутки»):  
**найти последовательные (подряд идущие) события одного типа (`event`) в хронологическом порядке и посчитать длину каждой такой последовательности.**

Для этого **нельзя просто делать `GROUP BY event`**, потому что это объединит все вхождения, даже если они разделены другими событиями.

---

### ✅ Правильный подход с CTE и оконными функциями (MySQL 8.0+)

```sql
WITH ordered_events AS (
    -- Пронумеруем все события по времени
    SELECT
        date_for_sorting,
        event,
        ROW_NUMBER() OVER (ORDER BY date_for_sorting) AS rn
    FROM sales_funnel_lead_log
    WHERE lead_id = 75526
),
grouped_events AS (
    -- Пронумеруем события внутри каждого типа event
    SELECT
        date_for_sorting,
        event,
        rn,
        ROW_NUMBER() OVER (PARTITION BY event ORDER BY date_for_sorting) AS rn_part
    FROM ordered_events
),
islands AS (
    -- Разность rn - rn_part даёт уникальный ID "острова"
    SELECT
        date_for_sorting,
        event,
        rn - rn_part AS island_id
    FROM grouped_events
)
-- Теперь группируем по event + island_id и считаем длину каждой серии
SELECT
    event,
    COUNT(*) AS consecutive_count,
    MIN(date_for_sorting) AS start_date,
    MAX(date_for_sorting) AS end_date
FROM islands
GROUP BY event, island_id
ORDER BY MIN(date_for_sorting);
```

---

### 🔍 Как это работает?

1. **`rn`** — глобальный порядковый номер всех событий по дате.
2. **`rn_part`** — порядковый номер событий **внутри одного `event`** по дате.
3. **`rn - rn_part`** — даёт **одинаковое значение для всех строк, идущих подряд с одним `event`**. Как только между ними вклинивается другое событие — разность меняется → новый «остров».
4. Группируем по `event` и `island_id` → получаем каждую непрерывную серию.

---

### 📌 Пример

Допустим, у вас такие данные (упорядочены по дате):

| date_for_sorting | event |
|------------------|-------|
| 2025-01-01       | A     |
| 2025-01-02       | A     |
| 2025-01-03       | B     |
| 2025-01-04       | A     |

Результат запроса:

| event | consecutive_count | start_date  | end_date    |
|-------|-------------------|-------------|-------------|
| A     | 2                 | 2025-01-01  | 2025-01-02  |
| B     | 1                 | 2025-01-03  | 2025-01-03  |
| A     | 1                 | 2025-01-04  | 2025-01-04  |

→ Видно, что `A` встречался **дважды подряд**, потом **ещё раз отдельно**.

---

### 💡 Если нужно просто вывести каждую строку с номером в своей серии

Если вы хотите, как в исходном запросе, **для каждой строки указать, какой она по счёту в своей подряд идущей серии**, то:

```sql
WITH ordered_events AS (
    SELECT
        date_for_sorting,
        event,
        ROW_NUMBER() OVER (ORDER BY date_for_sorting) AS rn
    FROM sales_funnel_lead_log
    WHERE lead_id = 75526
),
islands AS (
    SELECT
        date_for_sorting,
        event,
        rn - ROW_NUMBER() OVER (PARTITION BY event ORDER BY date_for_sorting) AS island_id
    FROM ordered_events
),
numbered AS (
    SELECT
        date_for_sorting,
        event,
        ROW_NUMBER() OVER (PARTITION BY event, island_id ORDER BY date_for_sorting) AS a
    FROM islands
)
SELECT
    date_for_sorting,
    event,
    a
FROM numbered
ORDER BY date_for_sorting;
```

Теперь `a = 1, 2, …` внутри каждой реальной последовательности подряд идущих одинаковых `event`.

---

✅ Оба варианта **полностью заменяют** ваш исходный код с `@n`, `@e`, но делают это **корректно**, **предсказуемо** и **без зависимости от порядка вычислений в MySQL**.

Если у вас MySQL < 8.0 — оконные функции недоступны, и тогда придётся использовать переменные (но с `ORDER BY date_for_sorting`, а не `event, date_for_sorting`). Но раз вы просите CTE — предполагаю, у вас MySQL 8.0+.