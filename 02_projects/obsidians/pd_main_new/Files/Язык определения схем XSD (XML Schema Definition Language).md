---
created: 2024-03-22T09:16:12 (UTC +03:00)
tags: []
source: https://bdpx.github.io/xml/xsd.html
author: 
tags:
 - web
 - firefox
---
[[2024-03-22]]

# Язык определения схем XSD (XML Schema Definition Language)

> ## Excerpt
> Технологии XML: XSD

---
Цель лабораторной работы:

1.  Познакомиться c XML схемами на примере XSD
2.  Научиться описывать структуру XML документов с помощью XSD

### Язык определения схем XSD

Консорциум W3C выработал рекомендацию языка определения схем XML (XSD), объединив наиболее популярные языки описания схем в один стандарт. Основная цель, которая при этом преследовалась, — получение стандарта, который можно широко реализовать и при этом он платформно-независимый.

Язык XML Schema Definition Language, также его называют XML Schema Language. Схемы XSD способны решать следующие задачи:

-   Перечисление элементов в документе XML и проверка наличия в документе только объявленных элементов.
-   Объявление и определение атрибутов, модифицирующих элементы документа.
-   Определение родительско-дочерних отношений между элементами.
-   Определение состояний и моделей содержания для элементов и атрибутов.
-   Задание типов данных.
-   Установка значений по умолчанию.
-   Возможность расширения.
-   Поддержка использования пространств имен.

Корневым элементом в схеме XML является элемент schema, который содержит все остальные элементы в документе схемы. В рамках корневого элемента схемы XSD атрибутом xmlns определяется пространство имен XMLSchema, которое содержит элементы и атрибуты XSD схемы.

```
<tt><span>&lt;xsd:schema</span><span> </span><span>xmlns:xsd</span><span>=</span><span>"http://www.w3.org/2001/XMLSchema"</span><span>&gt;</span>
</tt>
```

Все элементы XSD начинаются с префикса xsd:, который указывается для пространства имен XSD, объявленного в корневом элементе экземпляра схемы.

XML-документ, который проверяется с помощью схемы, также должен содержать объявление пространства имен. Пространство имен всегда указывается в корневом элементе экземпляра документа с помощью атрибута xmlns:

```
<tt><span>&lt;root</span><span> </span><span>xmlns:xsi</span><span>=</span><span>"http://www.w3.org/2001/XMLSchema-instance"</span><span>&gt;</span>
</tt>
```

Это пространство имен содержит элементы и атрибуты XMLSchema, которые можно включать в документ XML. По общему соглашению префикс xsi используется для этого пространства имен и добавляется в начале имен всех элементов и атрибутов, принадлежащих пространству имен, отделяясь от них двоеточием.

Ссылка на конкретную схему приводится в атрибуте

```
<tt><span>&lt;root</span><span> </span><span>xsi:schemaLocation</span><span>=</span><span>"http://www.example.com/scemes/имя_файла.xsd"</span><span>&gt;</span>
</tt>
```

### Объявление элемента и атрибута XSD

Процесс создания схемы включает в себя два шага — определение и объявление типов элементов или типов атрибутов. Элементы и атрибуты XML-документа объявляются элементами схемы xsd:element и xsd:attribute. Структура же XML-документа определяется элементами схемы xsd:simpleType и xsd:complexType.

Основное **объявление элемента** состоит из имени и типа данных

```
<tt><span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"имя_элемента"</span><span> </span><span>type</span><span>=</span><span>"xsd:тип_данных"</span><span>/&gt;</span>
</tt>
```

В схемах XSD дескрипторы, используемые в документах XML, разделяются на две категории — сложные типы и простые типы. Элементы сложных типов могут содержать другие элементы, а также обладают определенными атрибутами; элементы простых типов такими возможностями не обладают.

**Атрибут** - объявление простого типа, которое не может содержать другие элементы. Объявление атрибута похоже на объявление элемента:

```
<tt><span>&lt;xsd:attribute</span><span> </span><span>name</span><span>=</span><span>"имя_атрибута"</span><span> </span><span>type</span><span>=</span><span>"xsd:тип_данных"</span><span>/&gt;</span>
</tt>
```

### Простые типы данных

Есть две главных категории **простых типов**:

-   встроенные типы
-   определенные пользователем простые типы

Язык XSD имеет большое количество встроенных простых типов данных. Встроенные типы включают в себя примитивные типы и производные. Примитивные типы данных не получены из других типов данных. Например, числа с плавающей запятой - математическое понятие, которое не получено из других типов данных. Производные типы данных определены в терминах существующих типов данных. Например, целое число - частный случай, полученный из десятичного типа данных.

Следующая таблица представляет список примитивных типов данных XML-схемы, аспекты, которые могут быть применены к типу данных и описания типа данных.

Примитивные типы данных
| Тип данных | Аспекты | Описание |
| --- | --- | --- |
| string | length, pattern, maxLength, minLength, enumeration, whiteSpace | Представляет символьную строку. |
| Boolean | pattern, whiteSpace | Представляет логическое значение, которое может быть true или false. |
| decimal | enumeration, pattern, totalDigits, fractionDigits, minInclusive, minExclusive, maxInclusive, maxExclusive, whiteSpace | Представляет произвольное число. |
| float | pattern, enumeration, minInclusive, minExclusive, maxInclusive, maxExclusive, whiteSpace | Представляет 32-битовое число с плавающей запятой одиночной точности. |
| double | pattern, enumeration, minInclusive, minExclusive, maxInclusive, maxExclusive, whiteSpace | Представляет 64-битовое число с плавающей запятой двойной точности. |
| duration | enumeration, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, whiteSpace | Представляет продолжительность времени. Шаблон для duration следующий - PnYnMnDTnHnMnS, где nY представляет число лет; nM - месяцев; nD - дней; Т - разделитель даты и времени; nH - число часов; nM - минут; nS - секунд. |
| dateTime | enumeration, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, whiteSpace | Представляет конкретное время. Шаблон для dateTime следующий - CCYY-MM-DDThh:mm:ss, где CC представляет столетие; YY - год; MM - месяц; DD - день; Т - разделитель даты и времени; hh - число часов; mm - минут; ss - секунд. При необходимости можно указывать доли секунды. Например, сотые доли в шаблоне: ss.ss |
| time | enumeration, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, whiteSpace | Представляет конкретное время дня. Шаблон для time следующий -hh:mm:ss.sss (долевая часть секунд необязательна). |
| date | enumeration, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, whiteSpace | Представляет календарную дату. Шаблон для date такой - CCYY-MM-DD (здесь необязательна часть, представляющая время). |
| gYearMonth | enumeration, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, whiteSpace | Представляет конкретный месяц конкретного года (CCYY-MM ). |
| gYear | enumeration, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, whiteSpace | Представляет календарный год (CCYY). |
| gMonthDay | enumeration, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, whiteSpace | Представляет конкретный день конкретного месяца (--MM-DD). |
| gDay | enumeration, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, whiteSpace | Представляет календарный день (---DD). |
| gMonth | enumeration, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, whiteSpace | Представляет календарный месяц (--MM--). |
| hexBinary | length, pattern, maxLength, minLength, enumeration, whiteSpace | Представляет произвольную шестнадцатерично-закодированную двоичную информацию. HexBinary - набор двоичных октетов фиксированной длины, состоящий из четырех пар шестнадцатеоисных символов. Например, 0-9a-fA-F. |
| base64Binary | length, pattern, maxLength, minLength, enumeration, whiteSpace | Представляет произвольную Base64-закодированную двоичную информацию. Base64Binary - набор двоичных октетов фиксированной длины. |
| anyURI | length, pattern, maxLength, minLength, enumeration, whiteSpace | Представляет URI как определено в RFC 2396. Значение anyURI может быть абсолютно или относительно, и может иметь необязательный идентификатор фрагмента. |
| QName | length, enumeration, pattern, maxLength, minLength, whiteSpace | Представляет составное имя. Имя составлено из префикса и локального названия, отделенного двоеточием. И префикс и локальные названия должны быть NCNAME. Префикс должен быть связан с namespace URI ссылкой, используя объявление пространства имени. |
| NOTATION | length, enumeration, pattern, maxLength, minLength, whiteSpace | Представляет тип атрибута СИСТЕМЫ ОБОЗНАЧЕНИЙ. Набор QNAMES. |

Следующая таблица представляет список производных типов данных XML-схемы, аспекты, которые могут быть применены к типу данных и описания типа данных.

Производные типы данных
| Тип данных | Аспекты | Описание |
| --- | --- | --- |
| normalizedString | length, pattern, maxLength, minLength, enumeration, whiteSpace | Представляет нормализованные строки. Этот тип данных получен из string. |
| token | enumeration, pattern, length, minLength, maxLength, whiteSpace | Представляет маркированные строки. Этот тип данных получен из normalizedString. |
| language | length, pattern, maxLength, minLength, enumeration, whiteSpace | Представляет идентификаторы естественного языка (определенный RFC 1766). Этот тип данных получен из token |
| IDREFS | length, maxLength, minLength, enumeration, whiteSpace | Представляет тип атрибута IDREFS. Содержит набор значений типа IDREF. |
| ENTITIES | length, maxLength, minLength, enumeration, whiteSpace | Представляет тип атрибута ENTITIES. Содержит набор значений типа ENTITY. |
| NMTOKEN | length, pattern, maxLength, minLength, enumeration, whiteSpace | Представляет тип атрибута NMTOKEN. NMTOKEN - набор символов имен (символы, цифры и другие символы) в любой комбинации. В отличие отName и NCNAME, NMTOKEN не имеет никаких ограничений на первый символ. Этот тип данных получен из token. |
| NMTOKENS | length, maxLength, minLength, enumeration, whiteSpace | Представляет тип атрибута NMTOKENS. Содержит набор значений типа NMTOKEN. |
| Name | length, pattern, maxLength, minLength, enumeration, whiteSpace | Представляет имена в XML. Name - лексема(маркер), которая начинается с символа, символа подчеркивания или двоеточия и продолжается символами имен (символы, цифры, и другие символы). Этот тип данных получен из token. |
| NCName | length, pattern, maxLength, minLength, enumeration, whiteSpace | Представляет неколонкированные названия. Этот тип данных - тот же, что и Name, но не может начинаться с двоеточия. Этот тип данных получен из Name. |
| ID | length, enumeration, pattern, maxLength, minLength, whiteSpace | Представляет тип атрибута ID, определенный в XML 1.0 Рекомендации. ИДЕНТИФИКАТОР не должен иметь двоеточия (NCName) и должен быть уникален в пределах XML документа. Этот тип данных получен из NCNAME. |
| IDREF | length, enumeration, pattern, maxLength, minLength, whiteSpace | Представляет ссылку к элементу, имеющему атрибут ID, который точно соответствует установленному ИДЕНТИФИКАТОРУ. IDREF должен быть NCNAME и должен быть значением элемента или атрибута типа ID в пределах XML документа. Этот тип данных получен из NCNAME. |
| ENTITY | length, enumeration, pattern, maxLength, minLength, whiteSpace | Представляет тип атрибута ENTITY. Это - ссылка к неанализируемому объекту с именем, которое точно соответствует установленному имени. ENTITY должен быть NCNAME и должен быть объявлен в схеме как неанализируемое имя объекта. Этот тип данных получен из NCNAME. |
| integer | enumeration, fractionDigits, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, totalDigits, whiteSpace | Представляет последовательность десятичных цифр с необязательным знаком (+ или -). Этот тип данных получен из decimal. |
| nonPositiveInteger | enumeration, fractionDigits, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, totalDigits, whiteSpace | Представляет целое число, меньшее или равное нулю. NonPositiveInteger состоит из отрицательного знака (-) и последовательности десятичных цифр. Этот тип данных получен из целого числа. |
| negativeInteger | enumeration, fractionDigits, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, totalDigits, whiteSpace | Представляет целое число, меньшее нуля. Этот тип данных получен из nonPositiveInteger. |
| long | enumeration, fractionDigits, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, totalDigits, whiteSpace | Представляет целое число с минимальным значением -9223372036854775808 и максимумом 9223372036854775807. Этот тип данных получен из целого числа. |
| int | enumeration, fractionDigits, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, totalDigits, whiteSpace | Представляет целое число с минимальным значением -2147483648 и максимумом 2147483647. Этот тип данных получен из long. |
| short | enumeration, fractionDigits, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, totalDigits, whiteSpace | Представляет целое число с минимальным значением -32768 и максимумом 32767. Этот тип данных получен из int. |
| byte | enumeration, fractionDigits, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, totalDigits, whiteSpace | Представляет целое число с минимальным значением -128 и максимумом 127. Этот тип данных получен из short. |
| nonNegativeInteger | enumeration, fractionDigits, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, totalDigits, whiteSpace | Представляет целое число, большее равное нулю. Этот тип данных получен из целого числа. |
| unsignedLong | enumeration, fractionDigits, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, totalDigits, whiteSpace | Представляет целое число с минимумом нуль и максимумом 18446744073709551615. Этот тип данных получен из nonNegativeInteger. |
| unsignedInt | enumeration, fractionDigits, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, totalDigits, whiteSpace | Представляет целое число с минимумом нуль и максимумом 4294967295. Этот тип данных получен из unsignedLong. |
| unsignedShort | enumeration, fractionDigits, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, totalDigits, whiteSpace | Представляет целое число с минимумом нуль и максимумом 65535. Этот тип данных получен из unsignedInt. |
| unsignedByte | enumeration, fractionDigits, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, totalDigits, whiteSpace | Представляет целое число с минимумом нуля и максимума 255. Этот тип данных получен из unsignedShort. |
| positiveInteger | enumeration, fractionDigits, pattern, minInclusive, minExclusive, maxInclusive, maxExclusive, totalDigits, whiteSpace | Представляет целое число, которое является большим чем нуль. Этот тип данных получен из nonNegativeInteger. |

### Определённые пользователем простые типы

Получены из встроенных типов, применением к ним именованых ограничений, называемыми аспектами(Facets). **Аспекты** ограничивают допустимые значения простых типов. Синтаксис применения аспектов ограничения следующий:

```
<tt><span>&lt;xsd:restriction</span><span> </span><span>base</span><span>=</span><span>"тип_данных"</span><span>&gt;</span>
<span>    </span><span>&lt;xsd:</span><span>имя_аспекта </span><span>value</span><span>=</span><span>"значение_аспекта"</span><span>/&gt;</span>
<span>&lt;/xsd:restriction&gt;</span>
</tt>
```

<table><caption>Аспекты ограничения простых типов</caption><tbody><tr><th>Аспект</th><th>Значение</th></tr><tr><td><dfn>enumeration</dfn></td><td>Определенный набор значений. Ограничивает тип данных указанными значениями.</td></tr><tr><td><dfn>fractionDigits</dfn></td><td>Значение с определенным максимальным числом десятичных цифр в дробной части.</td></tr><tr><td><dfn>length</dfn></td><td>Целочисленное число единиц длины. Единицы длины зависят от типа данных.</td></tr><tr><td><dfn>maxExclusive</dfn></td><td>Верхний предел значений (все значения - меньше указанного).</td></tr><tr><td><dfn>maxInclusive</dfn></td><td>Максимальное значение.</td></tr><tr><td><dfn>maxLength</dfn></td><td>Целочисленное число единиц максимальной длины.</td></tr><tr><td><dfn>minExclusive</dfn></td><td>Нижний предел значений (все значения - больше указанного).</td></tr><tr><td><dfn>minInclusive</dfn></td><td>Минимальное значение.</td></tr><tr><td><dfn>minLength</dfn></td><td>Целочисленное число единиц минимальной длины.</td></tr><tr><td><dfn>pattern</dfn></td><td>Литеральный шаблон, которому должны соответствовать значения.</td></tr><tr><td><dfn>totalDigits</dfn></td><td>Значение с определенным максимальным числом десятичных цифр.</td></tr><tr><td><dfn>whiteSpace</dfn></td><td>Одно из предопределенных значений: preserve, replace или collapse</td></tr></tbody></table>

<table><caption>Значения аспекта <dfn>whiteSpace</dfn></caption><tbody><tr><th>Значение</th><th>Описание</th></tr><tr><td><dfn>preserve</dfn></td><td>Никакая нормализация не выполняется.</td></tr><tr><td><dfn>replace</dfn></td><td>Все #x9 (tab), #xA (line feed) and #xD (carriage return) заменяются на #x20 (пробел).</td></tr><tr><td><dfn>collapse</dfn></td><td>После replace-обработки все внутренние цепочки #x20 разрушаются до одного пробела, а окружающие пробелы удаляются.</td></tr></tbody></table>

Аспекты могут быть указаны только однажды в определении типа, кроме enumeration и pattern - они могут иметь многократные вхождения и группируются.

### Именованный тип данных

В языке XSD, в отличие от тех двух, с которыми вы познакомились раньше, существует концепция именованных типов. Например, при создании определения, можно присвоить этому определению имя, чтобы повторно использовать его в схеме XSD. Вы можете создать определение простого типа simpleType и назвать его, например, txt15pre. В результате вы получите именованное ограничение. После этого вы сможете применять это ограничение и к другим элементам в схеме. Это особенно полезно, когда в определении применяются аспекты ограничения типа данных, чтобы не повторять их каждый раз в других определениях. Например, элемент simpleType может быть связан с элементом Фамилия и атрибутом Телефон для объявления содержания этих элемента и значения атрибута как строковых данных:

```
<tt><span>&lt;xsd:simpleType</span><span> </span><span>name</span><span>=</span><span>"txt15pre"</span><span>&gt;</span>
<span>    </span><span>&lt;xsd:restriction</span><span> </span><span>base</span><span>=</span><span>"xsd:string"</span><span>&gt;</span>
<span>        </span><span>&lt;xsd:maxLength</span><span> </span><span>value</span><span>=</span><span>"15"</span><span>/&gt;</span>
<span>        </span><span>&lt;xsd:whiteSpace</span><span> </span><span>value</span><span>=</span><span>"preserve"</span><span>/&gt;</span>
<span>    </span><span>&lt;/xsd:restriction&gt;</span>
<span>&lt;/xsd:simpleType&gt;</span>
<span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"Фамилия"</span><span> </span><span>type</span><span>=</span><span>"txt15pre"</span><span>/&gt;</span>
<span>&lt;xsd:attribute</span><span> </span><span>name</span><span>=</span><span>"Телефон"</span><span> </span><span>type</span><span>=</span><span>"txt15pre"</span><span> </span><span>use</span><span>=</span><span>"required"</span><span>/&gt;</span>
</tt>
```

Обратили внимание на ключевое слово required в объявлении атрибута? Как и в предыдущих схемах, оно все так же означает обязательность использования объявленного атрибута. Другими предопределенными значениями атрибута use элемента схемы xsd:attribute могут быть ключевые слова optional и prohibited. Если первое из них означает необязательность использования, то второе запрещает использование объявленного атрибута. Такая необходимость возникает в случае локального объявления ранее определенной группы атрибутов элементом схемы xsd:attributeGroup, например:

```
<tt><span>&lt;xsd:attributeGroup</span><span> </span><span>name</span><span>=</span><span>"Связь"</span><span>&gt;</span>
<span>    </span><span>&lt;xsd:attribute</span><span> </span><span>name</span><span>=</span><span>"Телефон"</span><span> </span><span>type</span><span>=</span><span>"txt15pre"</span><span>/&gt;</span>
<span>    </span><span>&lt;xsd:attribute</span><span> </span><span>name</span><span>=</span><span>"Факс"</span><span> </span><span>type</span><span>=</span><span>"txt15pre"</span><span>/&gt;</span>
<span>&lt;/xsd:attributeGroup&gt;</span>
</tt>
```

далее в контексте определения элемента сложного типа мы делаем ограничение на применение атрибутов этой группы:

```
<tt><span>&lt;xsd:complexType</span><span> </span><span>name</span><span>=</span><span>"Клиент"</span><span>&gt;</span>
<span>    </span><span>&lt;xsd:complexContent&gt;</span>
<span>        </span><span>&lt;xsd:restriction</span><span> </span><span>base</span><span>=</span><span>"xsd:Связь"</span><span>&gt;</span>
<span>            </span><span>&lt;xsd:attribute</span><span> </span><span>name</span><span>=</span><span>"Телефон"</span><span> </span><span>use</span><span>=</span><span>"required"</span><span>/&gt;</span>
<span>            </span><span>&lt;xsd:attribute</span><span> </span><span>name</span><span>=</span><span>"Факс"</span><span> </span><span>use</span><span>=</span><span>"prohibited"</span><span>/&gt;</span>
<span>        </span><span>&lt;/xsd:restriction&gt;</span>
<span>    </span><span>&lt;/xsd:complexContent&gt;</span>
<span>&lt;/xsd:complexType&gt;</span>
</tt>
```

### Сложные типы данных

Модель содержания элемента сложного типа - формальное описание структуры и допустимого содержания элемента, которое используется для проверки правильности XML документа. Модели содержания Схемы предоставляют больший контроль структуры элементов, чем модели содержания DTD. Кроме того, модели содержания схемы позволяют проверять правильность смешанного содержания.

Модель содержания может ограничивать документ до некоторого набора элементных типов и атрибутов, описывать и поддерживать связи между этими различными компонентами и уникально обозначать отдельные элементы. Свободное использование модели содержания позволяет разработчикам изменять структурную информацию.

Перечень объявлений дочерних элементов приводится в структуре группирующих XSD-элементов **choice**, **sequence**, и **all**.

Элемент xsd:choice позволяет только одному из элементов, содержащихся в группе присутствовать в составе элемента. Элемент xsd:sequence требует появления элементов группы в точно установленной последовательности в составе элемента. xsd:all элемент позволяет элементам в группе быть (или не быть) в любом порядке в составе элемента.

Элемент xsd:group используется для четкого определения группы и для ссылки к именованной группе. Вы можете использовать модель группы, чтобы определить набор элементов, которые могут быть повторены в документе. Это полезно для формирования определения комплексного типа. Именованную модель группы можно далее определить, используя <xsd:sequence>, <xsd:choice> или <xsd:all> дочерние элементы. Именованные группы должны определяться в корне схемы. При необходимости многократного использования перечня элементов, определенного в группе, не надо каждый раз писать этот перечень - достаточно дать ссылку на именованную группу

```
<tt><span>&lt;xsd:group</span><span> </span><span>ref</span><span>=</span><span>"имя_группы"</span><span>&gt;</span>
</tt>
```

### Определение элемента сложного типа

Определения сложных типов создаются с использованием элемента complexType, его атрибутов и любых допустимых аспектов. Обычно, сложные типы будут содержать набор элементных объявлений, объявлений атрибутов и элементных ссылок.

```
<tt><span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"имя_элемента"</span><span> </span><span>type</span><span>=</span><span>"xsd:тип_данных"</span><span>&gt;</span>
<span>  </span><span>&lt;xsd:complexType&gt;</span>
<span>    </span><span>&lt;xsd:sequence&gt;</span>
<span>      </span><span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"имя_элемента"</span><span> </span><span>type</span><span>=</span><span>"xsd:тип_данных"</span><span>/&gt;</span>
<span>    </span><span>&lt;/xsd:sequence&gt;</span>
<span>    </span><span>&lt;xsd:attribute</span><span> </span><span>name</span><span>=</span><span>"имя_атрибута"</span><span> </span><span>type</span><span>=</span><span>"xsd:тип_данных"</span><span>/&gt;</span>
<span>  </span><span>&lt;/xsd:complexType&gt;</span>
<span>&lt;/xsd:element&gt;</span>
</tt>
```

### Листинг 1. Пример XSD-схемы "Картотека.xsd"

```
<tt><span>&lt;xsd:schema</span><span> </span><span>xmlns:xsd</span><span>=</span><span>"http://www.w3.org/2001/XMLSchema"</span><span>&gt;</span>
<span>  </span><span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"Заказчики"</span><span>&gt;</span>
<span>    </span><span>&lt;xsd:complexType&gt;</span>
<span>      </span><span>&lt;xsd:sequence</span><span> </span><span>maxOccurs</span><span>=</span><span>"unbounded"</span><span>&gt;</span>
<span>        </span><span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"Заказчик"</span><span>&gt;</span>
<span>          </span><span>&lt;xsd:complexType&gt;</span>
<span>            </span><span>&lt;xsd:sequence&gt;</span>
<span>              </span><span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"Компания"</span><span>&gt;</span>
<span>                </span><span>&lt;xsd:complexType&gt;</span>
<span>                  </span><span>&lt;xsd:attribute</span><span> </span><span>name</span><span>=</span><span>"телефон"</span>
<span>                  </span><span>type</span><span>=</span><span>"xsd:string"</span><span> </span><span>use</span><span>=</span><span>"required"</span><span>/&gt;</span>
<span>                </span><span>&lt;/xsd:complexType&gt;</span>
<span>              </span><span>&lt;/xsd:element&gt;</span>
<span>            </span><span>&lt;/xsd:sequence&gt;</span>
<span>          </span><span>&lt;/xsd:complexType&gt;</span>
<span>        </span><span>&lt;/xsd:element&gt;</span>
<span>      </span><span>&lt;/xsd:sequence&gt;</span>
<span>    </span><span>&lt;/xsd:complexType&gt;</span>
<span>  </span><span>&lt;/xsd:element&gt;</span>
<span>&lt;/xsd:schema&gt;</span>
</tt>
```

## Задание на лабораторную работу

Необходимо для XML документа, созданого в первой лабораторной работе, определить его струткуру с помощью XSD. Осуществить проверку соответствия документа описанию его структуры.

## W3C парсеры для XML.

Проблемой при валидации (проверка правилоьности XML документа согласно схеме) является тот факт, что соответствие документов их схемам некоторые броузеры не проверяют. В связи с этим возникает необходимость использовать возможности DOM (Document Object Model - см. лаб.раб. №5) для проверки правильности. Функция валидации так или иначе присутствует в любом парсере.

XSD является стандартом, поддерживаемым и развиваемым консорциумом W3C. В рамках этой поддержки[The Apache Software Foundation](http://www.apache.org/) создала набор ПО, представляющего собой парсеры и другое обеспечение для [работы с XML](http://xml.apache.org/). Одним из таких известных парсеров является [Xerces](http://xerces.apache.org/). Он существует в виде отдельного ПО, реализованного на С++ или Java.

Предположим у нас есть XML документ sonnet.xml:

```
<tt><span>&lt;?xml</span><span> </span><span>version</span><span>=</span><span>"1.0"</span><span>?&gt;</span>
<span>&lt;sonnet</span>
<span>  </span><span>xmlns:xsi</span><span>=</span><span>"http://www.w3.org/2001/XMLSchema-instance"</span>
<span>  </span><span>xsi:noNamespaceSchemaLocation</span><span>=</span><span>"sonnet.xsd"</span>
<span>  </span><span>type</span><span>=</span><span>"Shakespearean"</span><span>&gt;</span>
<span>  </span><span>&lt;author&gt;</span>
<span>    </span><span>&lt;lastName&gt;</span><span>Shakespeare</span><span>&lt;/lastName&gt;</span>
<span>    </span><span>&lt;firstName&gt;</span><span>William</span><span>&lt;/firstName&gt;</span>
<span>    </span><span>&lt;nationality&gt;</span><span>British</span><span>&lt;/nationality&gt;</span>
<span>    </span><span>&lt;yearOfBirth&gt;</span><span>1564</span><span>&lt;/yearOfBirth&gt;</span>
<span>    </span><span>&lt;yearOfDeath&gt;</span><span>1616</span><span>&lt;/yearOfDeath&gt;</span>
<span>  </span><span>&lt;/author&gt;</span>
<span>  </span><span>&lt;title&gt;</span><span>Sonnet 130</span><span>&lt;/title&gt;</span>
<span>  </span><span>&lt;lines&gt;</span>
<span>    </span><span>&lt;line&gt;</span><span>My mistress' eyes are nothing like the sun,</span><span>&lt;/line&gt;</span>
<span>    </span><span>&lt;line&gt;</span><span>Coral is far more red than her lips red.</span><span>&lt;/line&gt;</span>
<span>    </span><span>&lt;line&gt;</span><span>If snow be white, why then her breasts are dun,</span><span>&lt;/line&gt;</span>
<span>    </span><span>&lt;line&gt;</span><span>If hairs be wires, black wires grow on her head.</span><span>&lt;/line&gt;</span>
<span>    </span><span>&lt;line&gt;</span><span>I have seen roses damasked, red and white,</span><span>&lt;/line&gt;</span>
<span>    </span><span>&lt;line&gt;</span><span>But no such roses see I in her cheeks.</span><span>&lt;/line&gt;</span>
<span>    </span><span>&lt;line&gt;</span><span>And in some perfumes is there more delight</span><span>&lt;/line&gt;</span>
<span>    </span><span>&lt;line&gt;</span><span>Than in the breath that from my mistress reeks.</span><span>&lt;/line&gt;</span>
<span>    </span><span>&lt;line&gt;</span><span>I love to hear her speak, yet well I know</span><span>&lt;/line&gt;</span>
<span>    </span><span>&lt;line&gt;</span><span>That music hath a far more pleasing sound.</span><span>&lt;/line&gt;</span>
<span>    </span><span>&lt;line&gt;</span><span>I grant I never saw a goddess go,</span><span>&lt;/line&gt;</span>
<span>    </span><span>&lt;line&gt;</span><span>My mistress when she walks, treads on the ground.</span><span>&lt;/line&gt;</span>
<span>    </span><span>&lt;line&gt;</span><span>And yet, by Heaven, I think my love as rare</span><span>&lt;/line&gt;</span>
<span>    </span><span>&lt;line&gt;</span><span>As any she belied with false compare.</span><span>&lt;/line&gt;</span>
<span>  </span><span>&lt;/lines&gt;</span>
<span>&lt;/sonnet&gt;</span>
</tt>
```

И есть соответсвенно схема sonnet.xsd:

```
<tt><span>&lt;?xml</span><span> </span><span>version</span><span>=</span><span>"1.0"</span><span> </span><span>encoding</span><span>=</span><span>"UTF-8"</span><span>?&gt;</span>
<span>&lt;xsd:schema</span><span> </span><span>xmlns:xsd</span><span>=</span><span>"http://www.w3.org/2001/XMLSchema"</span><span>&gt;</span>

<span>  </span><span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"sonnet"</span><span>&gt;</span>
<span>    </span><span>&lt;xsd:complexType&gt;</span>
<span>      </span><span>&lt;xsd:sequence&gt;</span>
<span>        </span><span>&lt;xsd:element</span><span> </span><span>ref</span><span>=</span><span>"author"</span><span>/&gt;</span>
<span>        </span><span>&lt;xsd:element</span><span> </span><span>ref</span><span>=</span><span>"title"</span><span> </span><span>minOccurs</span><span>=</span><span>"0"</span><span>/&gt;</span>
<span>        </span><span>&lt;xsd:element</span><span> </span><span>ref</span><span>=</span><span>"lines"</span><span>/&gt;</span>
<span>      </span><span>&lt;/xsd:sequence&gt;</span>
<span>      </span><span>&lt;xsd:attribute</span><span> </span><span>name</span><span>=</span><span>"type"</span><span> </span><span>type</span><span>=</span><span>"sonnetType"</span>
<span>        </span><span>default</span><span>=</span><span>"Shakespearean"</span><span>/&gt;</span>
<span>    </span><span>&lt;/xsd:complexType&gt;</span>
<span>  </span><span>&lt;/xsd:element&gt;</span>

<span>  </span><span>&lt;xsd:simpleType</span><span> </span><span>name</span><span>=</span><span>"sonnetType"</span><span>&gt;</span>
<span>    </span><span>&lt;xsd:restriction</span><span> </span><span>base</span><span>=</span><span>"xsd:string"</span><span>&gt;</span>
<span>      </span><span>&lt;xsd:enumeration</span><span> </span><span>value</span><span>=</span><span>"Petrarchan"</span><span>/&gt;</span>
<span>      </span><span>&lt;xsd:enumeration</span><span> </span><span>value</span><span>=</span><span>"Shakespearean"</span><span>/&gt;</span>
<span>    </span><span>&lt;/xsd:restriction&gt;</span>
<span>  </span><span>&lt;/xsd:simpleType&gt;</span>

<span>  </span><span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"author"</span><span>&gt;</span>
<span>    </span><span>&lt;xsd:complexType&gt;</span>
<span>      </span><span>&lt;xsd:sequence&gt;</span>
<span>        </span><span>&lt;xsd:element</span><span> </span><span>ref</span><span>=</span><span>"lastName"</span><span>/&gt;</span>
<span>        </span><span>&lt;xsd:element</span><span> </span><span>ref</span><span>=</span><span>"firstName"</span><span>/&gt;</span>
<span>        </span><span>&lt;xsd:element</span><span> </span><span>ref</span><span>=</span><span>"nationality"</span><span>/&gt;</span>
<span>        </span><span>&lt;xsd:element</span><span> </span><span>ref</span><span>=</span><span>"yearOfBirth"</span><span> </span><span>minOccurs</span><span>=</span><span>"0"</span><span>/&gt;</span>
<span>        </span><span>&lt;xsd:element</span><span> </span><span>ref</span><span>=</span><span>"yearOfDeath"</span><span> </span><span>minOccurs</span><span>=</span><span>"0"</span><span>/&gt;</span>
<span>      </span><span>&lt;/xsd:sequence&gt;</span>
<span>    </span><span>&lt;/xsd:complexType&gt;</span>
<span>  </span><span>&lt;/xsd:element&gt;</span>

<span>  </span><span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"lastName"</span><span> </span><span>type</span><span>=</span><span>"xsd:string"</span><span>/&gt;</span>
<span>  </span><span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"firstName"</span><span> </span><span>type</span><span>=</span><span>"xsd:string"</span><span>/&gt;</span>
<span>  </span><span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"nationality"</span><span> </span><span>type</span><span>=</span><span>"xsd:string"</span><span>/&gt;</span>
<span>  </span><span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"yearOfBirth"</span><span> </span><span>type</span><span>=</span><span>"xsd:string"</span><span>/&gt;</span>
<span>  </span><span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"yearOfDeath"</span><span> </span><span>type</span><span>=</span><span>"xsd:string"</span><span>/&gt;</span>

<span>  </span><span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"title"</span><span> </span><span>type</span><span>=</span><span>"xsd:string"</span><span>/&gt;</span>

<span>  </span><span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"lines"</span><span>&gt;</span>
<span>    </span><span>&lt;xsd:complexType&gt;</span>
<span>      </span><span>&lt;xsd:sequence&gt;</span>
<span>        </span><span>&lt;xsd:element</span><span> </span><span>ref</span><span>=</span><span>"line"</span><span> </span><span>minOccurs</span><span>=</span><span>"14"</span><span> </span><span>maxOccurs</span><span>=</span><span>"14"</span><span>/&gt;</span>
<span>      </span><span>&lt;/xsd:sequence&gt;</span>
<span>    </span><span>&lt;/xsd:complexType&gt;</span>
<span>  </span><span>&lt;/xsd:element&gt;</span>

<span>  </span><span>&lt;xsd:element</span><span> </span><span>name</span><span>=</span><span>"line"</span><span> </span><span>type</span><span>=</span><span>"xsd:string"</span><span>/&gt;</span>
<span>&lt;/xsd:schema&gt;</span>
</tt>
```

Проверить правильность sonnet.xml относительно схемы sonnet.xsd (должна находится в том же каталоге) можно командой

```
xmllint --noout --schema sonnet.xsd sonnet.xml
```
