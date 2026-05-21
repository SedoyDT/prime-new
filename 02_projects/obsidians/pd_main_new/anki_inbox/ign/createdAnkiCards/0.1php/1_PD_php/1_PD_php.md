
#1_PD_php
#php

#telegram 

# Что делает htmlspecialchars(),?
<!-- basicblock-start oid="ObsyW9d7D9kW0g7k6dzBvGSZ"  deck='1_PD_php' -->
Что делает htmlspecialchars(),?::


htmlspecialchars — Преобразовывает специальные символы в HTML-сущности

```
htmlspecialchars(
    string $string,
    int $flags = ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML401,
    ?string $encoding = null,
    bool $double_encode = true
): string
```

Ряд символов в HTML несёт отдельный смысл и для сохранения значения такие символы представляют HTML-сущностями. Функция возвращает строку с этими преобразованиями. Вместо этой функции вызывают функцию htmlentities(), когда требуется перевести каждую входную подстроку, у которой есть связанная именованная сущность.

Если у входной строки, которую передали в эту функцию, и результирующего документа одинаковый набор символов, то этой функции хватит, чтобы подготовить входные данные для вставки в бо́льшую часть контекстов HTML-документа. Однако, если данные содержат символы, которые не закодированы в наборе символов результирующего документа, и требуется сохранить эти символы (как числовые или именованные сущности), то как этой функции, так и функции htmlentities() (которые преобразовывают только подстроки, у которых есть эквивалентные именованные сущности), будет недостаточно. Вместо них пользуются функцией mb_encode_numericentity().
<!-- basicblock-end -->




#1_PD_php
#php

#telegram 

# Что делает htmlentities?
<!-- basicblock-start oid="Obs8kFDhFAeG26HdWoYfpyYv"  deck='1_PD_php' -->
Что делает htmlentities?::


htmlentities — Преобразовывает возможные символы в HTML-сущности
htmlentities(
    string $string,
    int $flags = ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML401,
    ?string $encoding = null,
    bool $double_encode = true
): string

Функция работает идентично функции htmlspecialchars(), за исключением того, что функция htmlentities() преобразовывает в HTML-сущности каждый символ, для которого в таблице перевода содержится эквивалентная HTML-сущность. Таблицу перевода, которую использует эта функция и которая зависит от констант, которые передали в параметр flags, возвращает функция get_html_translation_table().
<!-- basicblock-end -->



