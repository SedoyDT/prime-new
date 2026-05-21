В MySQL 8.0+ (и в 8.4 тем более) есть две большие и часто пересекающиеся темы:
1. **CTE (Common Table Expressions)** — общие табличные выражения (`WITH ... AS (...)`), временные «виртуальные» таблицы, создаваемые внутри запроса.
2. **Оконные функции** — функции, которые вычисляют значения по строкам _внутри окна_ (partition), без группировки.
    
Они _работают отлично вместе_, но — это разные механизмы. Ниже — коротко и понятно по каждому.
---
# ✅ **CTE в MySQL 8.4**
### Зачем нужны CTE:
- улучшить читаемость
- переиспользовать промежуточные вычисления
- рекурсивные запросы (например, дерево категорий)
### Синтаксис:
```sql
WITH cte_name AS (
    SELECT ...
)
SELECT *
FROM cte_name;
```
### Пример (выбрать дорогие товары, затем посчитать их среднюю цену):
```sql
WITH expensive AS (
    SELECT id, name, price
    FROM products
    WHERE price > 1000
)
SELECT name, price, (SELECT AVG(price) FROM expensive) AS avg_price
FROM expensive;
```
### Рекурсивный CTE (MySQL 8+):

```sql
WITH RECURSIVE nums AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM nums WHERE n < 10
)
SELECT * FROM nums;
```
---
# ✅ **Оконные функции в MySQL 8.4**

Они позволяют выполнять анализ данных без GROUP BY, сохраняя строки.
### Формат:
```sql
function(...) OVER (
    [PARTITION BY ...]
    [ORDER BY ...]
    [ROWS | RANGE ...]
)
```
---
## 🇬🇧 Основные оконные функции
### **1. Аналитические**
- `ROW_NUMBER()`
- `RANK()`, `DENSE_RANK()`
- `NTILE(n)`
- `LAG()`, `LEAD()`
- `FIRST_VALUE()`, `LAST_VALUE()`
Пример: пронумеровать строки в каждой категории
```sql
SELECT
    category,
    product_name,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn
FROM products;
```
---
### **2. Агрегатные как оконные**
Все агрегаты могут работать «поверх окна»:
- `SUM()`
- `AVG()`
- `COUNT()`
- `MIN()`
- `MAX()`
Пример: посчитать скользящую сумму по последним 3 записям:
```sql
SELECT
    id,
    amount,
    SUM(amount) OVER (
        ORDER BY id
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS moving_sum
FROM payments;
```
---
# 🧩 **Использование CTE + оконных функций вместе**
Обычно так, чтобы вынести сложные выборки отдельно:
Пример: Цены товаров + предыдущая цена (LAG), но сам список формируем в CTE:
```sql
WITH sorted_products AS (
    SELECT
        id,
        name,
        price,
        created_at
    FROM products
    ORDER BY created_at
)
SELECT
    id,
    name,
    price,
    LAG(price) OVER (ORDER BY created_at) AS prev_price
FROM sorted_products;
```
Окно работает уже поверх результата CTE.
---
# 📌 **Ограничения MySQL 8.4**
- Нельзя использовать оконную функцию в WHERE — нужно CTE или подзапрос:
    ```sql
    WITH t AS (
        SELECT *,
               ROW_NUMBER() OVER (ORDER BY id) AS rn
        FROM users
    )
    SELECT * FROM t WHERE rn <= 10;
    ```
- Нельзя использовать оконные функции в `GROUP BY`
- ORDER BY в оконной функции не влияет на ORDER BY всего запроса
---

[[Объяснение запроса выше]]
# 🎁 Краткая шпаргалка

|Цель|Использовать|
|---|---|
|Разбить данные на группы, но не сгруппировать — оставить строки|`PARTITION BY`|
|Нумерация строк|`ROW_NUMBER()`|
|Получить значение предыдущей/следующей строки|`LAG()`, `LEAD()`|
|Скользящие суммы, средние, окна|`ROWS BETWEEN ...`|
|Вынести промежуточный набор|CTE|
|Делать рекурсивные деревья, иерархии|`WITH RECURSIVE`|
---
Если хочешь — могу написать мини-конспект:
### ✔ топ 10 оконных функций
### ✔ сравнение оконных функций vs подзапросов
### ✔ 20 частых задач (ранжирование, скользящее окно, день-к-дню, проценты)
### ✔ примеры именно под твою задачу из разработки.
Какой формат нужен?