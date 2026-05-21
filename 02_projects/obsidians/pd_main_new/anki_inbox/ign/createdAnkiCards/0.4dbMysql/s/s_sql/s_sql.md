
#s_sql
#sql

#telegram 

# Пусть есть потребность извлечь дубликаты и предполагается что их больше двух. Мы хотим,  чтобы были получены только записи которые имеют наибольшие id (запись которая дублируется но имеет минимальный идентификатор не должна быть получена) как это сделать?
<!-- basicblock-start oid="ObsOdpEHj8AWb2YX5xFM6DYp"  deck='s_sql' -->
Пусть есть потребность извлечь дубликаты и предполагается что их больше двух. Мы хотим,  чтобы были получены только записи которые имеют наибольшие id (запись которая дублируется но имеет минимальный идентификатор не должна быть получена) как это сделать?::


```
SELECT id
FROM call_registry_client
WHERE id NOT IN (
    SELECT MIN(id)
    FROM call_registry_client
    GROUP BY client_id, registry_id
    HAVING COUNT(*) > 1
)
GROUP BY client_id, registry_id
HAVING COUNT(*) > 1;
```
<!-- basicblock-end -->




#s_sql
#sql

#telegram 

# Как найти среди дубликатов записи с максимальным id?
<!-- basicblock-start oid="ObsGPGVc4iqQDkxWRsm3y3gc"  deck='s_sql' -->
Как найти среди дубликатов записи с максимальным id?::


Для того чтобы найти среди дубликатов записи с максимальным `id`, например, в базе данных SQL, вы можете воспользоваться следующими подходами:

### Пример на SQL

Предположим, у вас есть таблица `my_table` с колонками `id` и `name`, и вам нужно найти записи с максимальным `id` для каждого уникального значения в колонке `name`.

#### 1. Используя подзапросы:
```
SELECT * 
FROM my_table AS t1
WHERE id = (
    SELECT MAX(id)
    FROM my_table AS t2
    WHERE t1.name = t2.name
);
```
Здесь подзапрос выбирает максимальный `id` для каждой уникальной записи `name`.

#### 2. Используя `GROUP BY`:
Если вы хотите получить только колонки `name` и максимальный `id`, можно сделать это так:

```
SELECT name, MAX(id) as max_id
FROM my_table
GROUP BY name;
```

#### 3. Используя оператор `JOIN`:
Этот запрос найдет все колонки записи с максимальным `id` для каждой уникальной записи `name`.

```
SELECT t1.*
FROM my_table t1
JOIN (
    SELECT name, MAX(id) as max_id
    FROM my_table
    GROUP BY name
) t2 ON t1.name = t2.name AND t1.id = t2.max_id;
```

SELECT
    call_registry_client.id,
    call_registry_client.registry_id, COUNT(*),
    max(id) AS max_id
FROM call_registry_client
GROUP BY registry_id, client_id
HAVING COUNT(*) > 1
ORDER BY registry_id ASC ;

Этот подход помогает выбрать все поля из строки с максимальным значением `id` для каждой уникальной записи по полю `name`.
<!-- basicblock-end -->




#s_sql
#sql

#telegram 

# Как найти записи которые дублируются по нескольким полям ?
<!-- basicblock-start oid="ObsSTFTY8PC0jqjqvn6IXhoB"  deck='s_sql' -->
Как найти записи которые дублируются по нескольким полям ?::


https://sky.pro/wiki/sql/poisk-dublikatov-v-sql-uslovie-s-ind-y-i-sortirovka/
<!-- basicblock-end -->




#s_sql
#sql

#telegram 

# Как найти записи которые дублируются по нескольким полям ?
<!-- basicblock-start oid="ObsYSEEyJDNy9IoSnx0d42e5"  deck='s_sql' -->
Как найти записи которые дублируются по нескольким полям ?::


```
SELECT registry_id, COUNT(*)
FROM call_registry_client
GROUP BY registry_id, client_id
HAVING COUNT(*) > 1;
```
<!-- basicblock-end -->



