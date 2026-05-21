
#M_mysql
#mysql

#telegram 

# как в mysql узнать кто занянял таблицу
<!-- basicblock-start oid="ObsWBX3laAER5JzNFtFhtM8a"  deck='M_mysql' -->
как в mysql узнать кто занянял таблицу::


В MySQL можно определить, кто занял таблицу (например, заблокировал её), с помощью системных представлений и команд для мониторинга блокировок. Вот несколько способов это сделать:

---

### 1. Использование `INFORMATION_SCHEMA.INNODB_LOCKS` и `INNODB_LOCK_WAITS`
Если вы используете механизм хранения InnoDB, вы можете проверить блокировки с помощью таблиц `INNODB_LOCKS` и `INNODB_LOCK_WAITS`:

```
SELECT
    r.trx_id AS blocking_trx_id,
    r.trx_mysql_thread_id AS blocking_thread_id,
    r.trx_query AS blocking_query,
    b.trx_id AS waiting_trx_id,
    b.trx_mysql_thread_id AS waiting_thread_id,
    b.trx_query AS waiting_query
FROM
    information_schema.innodb_lock_waits w
JOIN
    information_schema.innodb_trx b ON w.requesting_trx_id = b.trx_id
JOIN
    information_schema.innodb_trx r ON w.blocking_trx_id = r.trx_id;

```

Этот запрос покажет, какая транзакция блокирует таблицу и какая транзакция ожидает.

---

### 2. Использование `SHOW ENGINE INNODB STATUS`
Команда `SHOW ENGINE INNODB STATUS` предоставляет информацию о текущих блокировках и транзакциях. Выполните команду:

```
SHOW ENGINE INNODB STATUS\G

```

Затем в секции **TRANSACTIONS** найдите информацию о блокировках. Вы увидите, какие транзакции активны, какие запросы выполняются и какие блокировки удерживаются.

---

### 3. Использование `PROCESSLIST`
Команда `SHOW PROCESSLIST` покажет текущие соединения и выполняемые запросы. Если таблица заблокирована, вы увидите статус `Locked`:

```
SHOW PROCESSLIST;

```

Или более удобный вариант:

```
SELECT * FROM information_schema.processlist WHERE state = 'Locked';

```

Результат покажет ID соединения, пользователя, хост, выполняемый запрос и другую информацию.

---

### 4. Уточнение блокировок на уровне таблицы
Если вы хотите проверить блокировки конкретной таблицы, выполните:

```
SELECT
    t.trx_id,
    t.trx_mysql_thread_id,
    t.trx_query,
    l.lock_table,
    l.lock_mode
FROM
    information_schema.innodb_trx t
JOIN
    information_schema.innodb_locks l ON t.trx_id = l.lock_trx_id
WHERE
    l.lock_table LIKE '%имя_таблицы%';

```

Замените `имя_таблицы` на имя вашей таблицы.

---

### 5. Завершение блокирующего соединения
Если вы нашли соединение, которое блокирует таблицу, вы можете завершить его с помощью команды `KILL`. Например, если ID соединения — 123:

```
KILL 123;

```

---

### Примечание
Для выполнения этих запросов вам могут потребоваться привилегии администратора (например, `SUPER` или доступ к системным представлениям). Убедитесь, что вы понимаете последствия завершения соединений или транзакций, чтобы избежать потери данных.
<!-- basicblock-end -->




#M_mysql
#mysql

#telegram 

# Как работает CROSS JOIN
<!-- basicblock-start oid="Obsoj5xNGaGCGxSZ5N3atAyT"  deck='M_mysql' -->
Как работает CROSS JOIN::


`CROSS JOIN` в SQL выполняет декартово произведение двух таблиц — то есть каждая строка из первой таблицы соединяется с каждой строкой из второй таблицы.

**Основные моменты:**

- Если в первой таблице `A` — `m` строк, а во второй таблице `B` — `n` строк, то результат `CROSS JOIN` будет содержать `m * n` строк.
- В результате каждая комбинация строк из обеих таблиц присутствует.
- `CROSS JOIN` не требует условия соединения (`ON`), в отличие от `INNER JOIN` или `LEFT JOIN`.
- Используется, когда нужно получить все возможные комбинации строк из двух таблиц.

---

**Пример:**

```
SELECT *
FROM table1
CROSS JOIN table2;
```

Если `table1` содержит 2 строки, а `table2` — 3 строки, результат будет 6 строк (2 × 3).

---

**Применение в вашем случае:**

Когда нужно добавить к каждой строке из основной таблицы одно значение (например, общее количество пользователей), можно использовать `CROSS JOIN` с подзапросом, возвращающим одно значение:

```
SELECT t.*, total.count_users
FROM your_table t
CROSS JOIN (SELECT COUNT(*) AS count_users FROM user) AS total;
```

Здесь подзапрос возвращает одну строку с числом пользователей, и это значение добавляется ко всем строкам из `your_table`.

---

**Итог:** `CROSS JOIN` — это способ объединить каждую строку одной таблицы с каждой строкой другой, часто используется для добавления константных или агрегированных значений ко всем строкам.
<!-- basicblock-end -->



