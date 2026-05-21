
#s_sql
#sql

#telegram 

# Попытка получить список лидов для которых запись с определенным типом последняя
<!-- basicblock-start  deck='s_sql' -->
Попытка получить список лидов для которых запись с определенным типом последняя::


SELECT
    sflr.lead_id AS v,
    sflr.lead_id AS t
FROM sales_funnel_lead_relation sflr
JOIN (
    SELECT lead_id, MAX(id) AS max_id
    FROM sales_funnel_lead_relation
    GROUP BY lead_id
) last ON 
    last.lead_id = sflr.lead_id AND 
    last.max_id = sflr.id
WHERE sflr.relation_type_id = 19
ORDER by sflr.lead_id
<!-- basicblock-end -->




#s_sql
#sql

#telegram 

# **120 ключевых вопросов по SQL за 2025 год**
<!-- basicblock-start  deck='s_sql' -->
**120 ключевых вопросов по SQL за 2025 год**::


**Статья содержит 120 ключевых вопросо**в по SQL для собеседований, разделённых по темам и уровням сложности, с краткими пояснениями. 

Основываясь на актуальных требованиях 2025 года, вопросы охватывают базу данных, оптимизацию, практические задачи и нюансы СУБД (MySQL, PostgreSQL, SQL Server). 

🔜 [Подробности](https://uproger.com/120-klyuchevyh-voprosov-po-sql-za-2025-god/)
<!-- basicblock-end -->




#s_sql
#sql

#telegram 

# **120 ключевых вопросов по SQL за 2025 год**
<!-- basicblock-start  deck='s_sql' -->
**120 ключевых вопросов по SQL за 2025 год**::


**Статья содержит 120 ключевых вопросо**в по SQL для собеседований, разделённых по темам и уровням сложности, с краткими пояснениями. 

Основываясь на актуальных требованиях 2025 года, вопросы охватывают базу данных, оптимизацию, практические задачи и нюансы СУБД (MySQL, PostgreSQL, SQL Server). 

🔜 [Подробности](https://uproger.com/120-klyuchevyh-voprosov-po-sql-za-2025-god/)
<!-- basicblock-end -->




#s_sql
#sql

#telegram 

# **<u>🤔</u>****<u> По чему WHERE AVG считает в среднем?</u>**
<!-- basicblock-start oid="ObsxLj9RWTgyQs9jTLZKJNUJ"  deck='s_sql' -->
**<u>🤔</u>****<u> По чему WHERE AVG считает в среднем?</u>**::


В SQL, когда мы используем `AVG()`, мы рассчитываем среднее значение по множеству строк. Но `WHERE` фильтрует отдельные строки, а не группы данных.  

Проблема  
```
SELECT * FROM products WHERE AVG(price) > 100; -- ❌ Ошибка!
```

🚩**Как правильно использовать `AVG()` в фильтрах?**  

Использовать `HAVING` вместо `WHERE` (если есть `GROUP BY`)  
```
SELECT category, AVG(price) as avg_price 
FROM products 
GROUP BY category 
HAVING AVG(price) > 100;
```

Использовать подзапрос (`SUBQUERY`) в `WHERE`  
```
SELECT * FROM products 
WHERE price > (SELECT AVG(price) FROM products);
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->



