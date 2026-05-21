
#0_Pd_mysql_reference
#mysql_reference

# Вопрос: "Что такое non-locking read?"
<!-- basicblock-start oid="ObsMZm3X5sSbyO2l8I8u6itY"  deck='0_Pd_mysql_reference' -->
Вопрос: "Что такое non-locking read?"::


14.2 Ответ: "Non-locking read — это чтение данных без блокировки таблиц или строк, что позволяет другим транзакциям изменять данные одновременно. Это помогает улучшить производительность в многопользовательских системах."
<!-- basicblock-end -->



Вот список вопросов и ответов по темам из глоссария MySQL. В некоторых случаях приведены примеры кода, где это применимо.

<!-- basicblock-start oid="ObstlRikTpNrZ8Ob8RyC3jm1" deck='' --> 

1.1 Вопрос: "Что такое `ACID`?" :: 
1.2 Ответ: "`ACID` (Atomicity, Consistency, Isolation, Durability) — это набор свойств транзакций в реляционных базах данных, обеспечивающий надежность выполнения операций. Он гарантирует, что все транзакции выполняются полностью и корректно, или не выполняются вовсе." 

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsCaIHcCA9pyFhdREAMJZ6U" deck='' --> 

2.1 Вопрос: "Чем `InnoDB` отличается от `MyISAM`?" :: 
2.2 Ответ: "`InnoDB` и `MyISAM` — это два разных движка хранения данных в MySQL. `InnoDB` поддерживает транзакции, внешние ключи и высокую степень параллелизма, тогда как `MyISAM` не поддерживает транзакции и внешние ключи, но может быть быстрее для чтения." 

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsYdo4ifIcWgSOrlIJdNUuH" deck='' --> 

3.1 Вопрос: "Что такое `adaptive hash index`?" :: 
3.2 Ответ: "`Adaptive hash index` — это структура данных, используемая в `InnoDB`, которая создает хеш-индексы на лету, чтобы ускорить выполнение запросов. Он адаптируется к часто выполняемым запросам, улучшая их производительность." 

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsgmUOIeQcTwGMOpWNvsgDn" deck='' --> 

4.1 Вопрос: "Что такое `auto-increment`?" :: 
4.2 Ответ: "`Auto-increment` — это атрибут столбца в MySQL, который автоматически увеличивает значение при вставке новой строки, что позволяет создавать уникальные идентификаторы для записей." 
Пример кода:
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsPDFYasSVuI46uyNsVRTEV" deck='' --> 

5.1 Вопрос: "Как `B-tree` индекс отличается от `hash index`?" :: 
5.2 Ответ: "`B-tree` индекс используется для упорядочивания данных и эффективного поиска, поддерживает диапазонные запросы. `Hash index` обеспечивает быстрый поиск точных совпадений, но не поддерживает диапазонные запросы." 

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsgYcGFonwYCL1fV9IO4tcI" deck='' --> 

6.1 Вопрос: "Что такое `binary log`?" :: 
6.2 Ответ: "`Binary log` — это журнал транзакций MySQL, который записывает все изменения, внесенные в базу данных. Он используется для репликации и восстановления данных." 

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsYBJay3S4GjEqHzr5FmvFV" deck='' --> 

7.1 Вопрос: "Что такое `buffer pool` в `InnoDB`?" :: 
7.2 Ответ: "`Buffer pool` — это область памяти, используемая `InnoDB` для кэширования данных и индексов, чтобы уменьшить количество операций ввода/вывода на диске." 

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsJgOSeIsoYjYWp6QW01Inq" deck='' --> 

8.1 Вопрос: "Что означает `full-text search` в MySQL?" :: 
8.2 Ответ: "`Full-text search` — это метод поиска, который позволяет находить записи в текстовых столбцах по ключевым словам или фразам. Он используется для быстрого поиска текста в больших объемах данных." 

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsXGfo7phKwqDn9saghTxxr" deck='' --> 

9.1 Вопрос: "Чем `compressed backup` отличается от `full backup`?" :: 
9.2 Ответ: "`Compressed backup` — это резервная копия данных, которая сжимается для уменьшения размера файла. `Full backup` включает все данные базы данных без сжатия." 

<!-- basicblock-end --> 

<!-- basicblock-start oid="Obsnagu0aZyRAIBVq1jYHh1M" deck='' --> 

10.1 Вопрос: "Что такое `transaction ID`?" :: 
10.2 Ответ: "`Transaction ID` — это уникальный идентификатор, присваиваемый каждой транзакции в базе данных, который используется для отслеживания и управления транзакциями." 

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsDE94zL0inNl5MVWLk4ICk" deck='' --> 

11.1 Вопрос: "Что такое `UUID` и как его использовать в MySQL?" :: 
11.2 Ответ: "`UUID` (Universally Unique Identifier) — это 128-битное значение, используемое для уникальной идентификации записей. В MySQL можно использовать функцию `UUID()` для генерации уникальных идентификаторов." 
Пример кода:
```sql
SELECT UUID();
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsuRHQR1VJhN3T46TK9SFEK" deck='' --> 

12.1 Вопрос: "Что такое `schema` в контексте базы данных?" :: 
12.2 Ответ: "`Schema` — это структура базы данных, которая включает в себя таблицы, представления, индексы и другие объекты базы данных." 

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsDY9tTusKYVASotlvQDnCM" deck='' --> 

13.1 Вопрос: "Что такое `row-based replication` и как она отличается от `statement-based replication`?" :: 
13.2 Ответ: "`Row-based replication` передает изменения на уровне строк в базу данных, тогда как `statement-based replication` передает SQL-запросы. `Row-based replication` более точна, особенно при изменении данных таблиц, которые содержат пользовательские функции." 

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsGtKNT6MhevSGbhGtRwNxP" deck='' --> 

14.1 Вопрос: "Что такое `non-locking read`?" :: 
14.2 Ответ: "`Non-locking read` — это чтение данных без блокировки таблиц или строк, что позволяет другим транзакциям изменять данные одновременно. Это помогает улучшить производительность в многопользовательских системах." 

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsotP8Q2jl5UUcttNHOKc29" deck='' --> 

15.1 Вопрос: "Чем `clustered index` отличается от `non-clustered index`?" :: 
15.2 Ответ: "`Clustered index` определяет физический порядок строк в таблице, что делает его более эффективным для диапазонных запросов. `Non-clustered index` создает отдельную структуру для хранения индексов, а данные хранятся отдельно от индексов." 

<!-- basicblock-end -->