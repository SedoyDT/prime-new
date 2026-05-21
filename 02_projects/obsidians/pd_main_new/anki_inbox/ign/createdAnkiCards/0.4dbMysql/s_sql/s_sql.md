
#s_sql
#sql

#telegram 


<!-- basicblock-start oid="ObsQIpHSVbMszslqm6tRlSz0"  deck='s_sql' -->
У нас есть таблица `students_books`, в которой записаны ученики и книги, которые они прочитали. Таблица имеет следующие столбцы:

- `student_id` — идентификатор ученика.
- `book` — название книги, которую прочитал ученик (значения: `"Робинзон Крузо"` или `"Белый Клык"`).

**Задача:**

Нужно написать SQL-запрос, который определит, сколько учеников прочитали **только** книгу "Белый Клык". ::

```JS
WITH book_counts AS (
    SELECT student_id,
           SUM(CASE WHEN book = 'Робинзон Крузо' THEN 1 ELSE 0 END) AS robinson_count,
           SUM(CASE WHEN book = 'Белый Клык' THEN 1 ELSE 0 END) AS white_fang_count
    FROM students_books
    GROUP BY student_id
)
SELECT COUNT(*) AS only_white_fang_readers
FROM book_counts
WHERE robinson_count = 0
  AND white_fang_count = 1;
```

### Объяснение:

1. В подзапросе `book_counts` мы группируем данные по каждому ученику и подсчитываем, сколько книг "Робинзон Крузо" и "Белый Клык" прочитал каждый ученик.
    - Если ученик прочитал "Робинзон Крузо", то добавляем `1` в столбец `robinson_count`.
    - Если ученик прочитал "Белый Клык", то добавляем `1` в столбец `white_fang_count`.
2. В основном запросе фильтруем тех учеников, которые прочитали **только "Белый Клык"** (то есть, у них `robinson_count = 0`, а `white_fang_count = 1`).
3. Возвращаем количество таких учеников с помощью `COUNT(*)`.

### Результат:

Этот запрос вернёт количество учеников, которые прочитали **только "Белый Клык"**.



<!-- basicblock-end -->




