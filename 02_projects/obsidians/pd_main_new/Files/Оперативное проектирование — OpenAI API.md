---
created: 2024-03-31T07:49:00 (UTC +03:00)
tags: []
source: https://platform.openai.com/docs/guides/prompt-engineering/strategy-test-changes-systematically
author: 
tags:
 - web
 - firefox
---
[[2024-03-31]]

# Оперативное проектирование — OpenAI API

> ## Excerpt
> Explore developer resources, tutorials, API docs, and dynamic examples to get the most out of OpenAI's platform.

---
[](https://platform.openai.com/docs/guides/prompt-engineering/prompt-engineering)

## [Оперативное проектирование](https://platform.openai.com/docs/guides/prompt-engineering/prompt-engineering)

В этом руководстве описаны стратегии и тактики получения лучших результатов от больших языковых моделей (иногда называемых моделями GPT), таких как GPT-4. Описанные здесь методы иногда можно использовать в комбинации для достижения большего эффекта. Мы поощряем эксперименты, чтобы найти методы, которые лучше всего подходят для вас.

Некоторые из продемонстрированных здесь примеров в настоящее время работают только с нашей самой функциональной моделью. `gpt-4`. В общем, если вы обнаружите, что модель не справляется с задачей и доступна более мощная модель, часто стоит попробовать еще раз с более эффективной моделью.

Вы также можете изучить примеры подсказок, демонстрирующие возможности наших моделей:

[

Подскажите примеры

Изучите примеры, чтобы узнать, на что способны модели GPT.



](https://platform.openai.com/examples)

[](https://platform.openai.com/docs/guides/prompt-engineering/six-strategies-for-getting-better-results)

## [Шесть стратегий для достижения лучших результатов](https://platform.openai.com/docs/guides/prompt-engineering/six-strategies-for-getting-better-results)

[](https://platform.openai.com/docs/guides/prompt-engineering/write-clear-instructions)

### [Напишите четкие инструкции](https://platform.openai.com/docs/guides/prompt-engineering/write-clear-instructions)

Эти модели не умеют читать ваши мысли. Если результаты слишком длинные, попросите краткие ответы. Если результаты слишком просты, попросите написать их на экспертном уровне. Если вам не нравится формат, продемонстрируйте тот формат, который вы хотели бы видеть. Чем меньше модели придется гадать, чего вы хотите, тем больше вероятность, что вы это получите.

Тактика:

-   [Include details in your query to get more relevant answers](https://platform.openai.com/docs/guides/prompt-engineering/tactic-include-details-in-your-query-to-get-more-relevant-answers)
-   [Ask the model to adopt a persona](https://platform.openai.com/docs/guides/prompt-engineering/tactic-ask-the-model-to-adopt-a-persona)
-   [Use delimiters to clearly indicate distinct parts of the input](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-delimiters-to-clearly-indicate-distinct-parts-of-the-input)
-   [Specify the steps required to complete a task](https://platform.openai.com/docs/guides/prompt-engineering/tactic-specify-the-steps-required-to-complete-a-task)
-   [Приведите примеры](https://platform.openai.com/docs/guides/prompt-engineering/tactic-provide-examples)
-   [Укажите желаемую длину вывода](https://platform.openai.com/docs/guides/prompt-engineering/tactic-specify-the-desired-length-of-the-output)

[](https://platform.openai.com/docs/guides/prompt-engineering/provide-reference-text)

### [Предоставьте ссылочный текст](https://platform.openai.com/docs/guides/prompt-engineering/provide-reference-text)

Языковые модели могут уверенно придумывать ложные ответы, особенно когда их спрашивают об эзотерических темах или о цитатах и URL-адресах. Точно так же, как листок с заметками может помочь учащемуся лучше сдать тест, предоставление справочного текста к этим моделям может помочь в ответе с меньшим количеством выдумок.

Тактика:

-   [Попросите модель ответить, используя справочный текст](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-answer-using-a-reference-text)
-   [Попросите модель ответить цитатами из справочного текста.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-answer-with-citations-from-a-reference-text)

[](https://platform.openai.com/docs/guides/prompt-engineering/split-complex-tasks-into-simpler-subtasks)

### [Разделите сложные задачи на более простые подзадачи](https://platform.openai.com/docs/guides/prompt-engineering/split-complex-tasks-into-simpler-subtasks)

Точно так же, как в разработке программного обеспечения хорошей практикой является разложение сложной системы на набор модульных компонентов, то же самое справедливо и для задач, представленных в языковой модели. Сложные задачи, как правило, имеют более высокий уровень ошибок, чем более простые задачи. Более того, сложные задачи часто можно переопределить как рабочий процесс более простых задач, в котором результаты более ранних задач используются для создания входных данных для более поздних задач.

Тактика:

-   [Используйте классификацию намерений, чтобы определить наиболее релевантные инструкции для запроса пользователя.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-intent-classification-to-identify-the-most-relevant-instructions-for-a-user-query)
-   [Для диалоговых приложений, требующих очень длинных разговоров, суммируйте или фильтруйте предыдущий диалог.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-for-dialogue-applications-that-require-very-long-conversations-summarize-or-filter-previous-dialogue)
-   [Обобщайте длинные документы по частям и рекурсивно создавайте полное резюме.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-summarize-long-documents-piecewise-and-construct-a-full-summary-recursively)

[](https://platform.openai.com/docs/guides/prompt-engineering/give-the-model-time-to-think)

### [Дайте модели время «подумать».](https://platform.openai.com/docs/guides/prompt-engineering/give-the-model-time-to-think)

Если вас попросят умножить 17 на 28, вы, возможно, не сразу узнаете это, но со временем все равно сможете это решить. Точно так же модели допускают больше ошибок в рассуждениях, пытаясь ответить сразу, вместо того, чтобы тратить время на выработку ответа. Запрос на «цепочку мыслей» перед ответом может помочь модели более надежно продумать путь к правильным ответам.

Тактика:

-   [Попросите модель найти собственное решение, прежде чем спешить с выводами.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-work-out-its-own-solution-before-rushing-to-a-conclusion)
-   [Используйте внутренний монолог или последовательность вопросов, чтобы скрыть процесс рассуждения модели.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-inner-monologue-or-a-sequence-of-queries-to-hide-the-model-s-reasoning-process)
-   [Спросите модель, не пропустила ли она что-нибудь при предыдущих проходах.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-ask-the-model-if-it-missed-anything-on-previous-passes)

[](https://platform.openai.com/docs/guides/prompt-engineering/use-external-tools)

### [Используйте внешние инструменты](https://platform.openai.com/docs/guides/prompt-engineering/use-external-tools)

Компенсируйте недостатки модели, снабжая ее результатами других инструментов. Например, система поиска текста (иногда называемая RAG или расширенной генерацией поиска) может сообщить модели о соответствующих документах. Механизм выполнения кода, такой как Code Interpreter OpenAI, может помочь модели выполнять математические вычисления и запускать код. Если задачу можно выполнить более надежно и эффективно с помощью инструмента, а не с помощью языковой модели, разгрузите ее, чтобы получить лучшее от обоих.

Тактика:

-   [Используйте поиск на основе внедрений для реализации эффективного поиска знаний.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-embeddings-based-search-to-implement-efficient-knowledge-retrieval)
-   [Используйте выполнение кода для более точных вычислений или вызова внешних API.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-code-execution-to-perform-more-accurate-calculations-or-call-external-apis)
-   [Предоставьте модели доступ к определенным функциям](https://platform.openai.com/docs/guides/prompt-engineering/tactic-give-the-model-access-to-specific-functions)

[](https://platform.openai.com/docs/guides/prompt-engineering/test-changes-systematically)

### [Тестовые изменения систематически меняются](https://platform.openai.com/docs/guides/prompt-engineering/test-changes-systematically)

Улучшить производительность легче, если вы можете ее измерить. В некоторых случаях изменение приглашения приведет к повышению производительности на нескольких отдельных примерах, но приведет к ухудшению общей производительности на более репрезентативном наборе примеров. Поэтому, чтобы быть уверенным, что изменение положительно повлияет на производительность, может потребоваться определить комплексный набор тестов (также известный как «оценка»).

Тактика:

-   [Оцените результаты модели со ссылкой на ответы «золотого стандарта»](https://platform.openai.com/docs/guides/prompt-engineering/tactic-evaluate-model-outputs-with-reference-to-gold-standard-answers)

[](https://platform.openai.com/docs/guides/prompt-engineering/tactics)

## [Тактика](https://platform.openai.com/docs/guides/prompt-engineering/tactics)

Каждую из перечисленных выше стратегий можно реализовать с помощью конкретной тактики. Цель этой тактики — дать идеи, что можно попробовать. Они ни в коем случае не являются исчерпывающими, и вы можете смело пробовать творческие идеи, не представленные здесь.

[](https://platform.openai.com/docs/guides/prompt-engineering/strategy-write-clear-instructions)

### [Strategy: Write clear instructions](https://platform.openai.com/docs/guides/prompt-engineering/strategy-write-clear-instructions)

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-include-details-in-your-query-to-get-more-relevant-answers)

#### [Tactic: Include details in your query to get more relevant answers](https://platform.openai.com/docs/guides/prompt-engineering/tactic-include-details-in-your-query-to-get-more-relevant-answers)

In order to get a highly relevant response, make sure that requests provide any important details or context. Otherwise you are leaving it up to the model to guess what you mean.

|  |  |
| --- | --- |
| **Worse** | **Better** |
| Как добавить числа в Excel? | Как сложить ряд сумм в долларах в Excel? Я хочу сделать это автоматически для целого листа строк, чтобы все итоги оказались справа в столбце «Итого». |
| Кто президент? | Кто был президентом Мексики в 2021 году и как часто проводятся выборы? |
| Напишите код для вычисления последовательности Фибоначчи. | Напишите функцию TypeScript для эффективного вычисления последовательности Фибоначчи. Комментируйте код подробно, чтобы объяснить, что делает каждый фрагмент и почему он написан именно так. |
| Подведите итоги встречи. | Кратко изложите записи встречи в одном абзаце. Затем напишите уценочный список спикеров и каждого из их ключевых моментов. Наконец, перечислите следующие шаги или действия, предложенные докладчиками, если таковые имеются. |

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-ask-the-model-to-adopt-a-persona)

#### [Тактика: попросите модель принять образ.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-ask-the-model-to-adopt-a-persona)

Системное сообщение можно использовать для указания персонажа, используемого моделью в ее ответах.

Когда я прошу помочь мне написать что-нибудь, вы отвечаете документом, в каждом абзаце которого содержится хотя бы одна шутка или игривый комментарий.

Напишите благодарственное письмо моему поставщику стальных болтов за то, что он доставил товар вовремя и в кратчайшие сроки. Это позволило нам доставить важный заказ.

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-playful-thank-you-note?mode=chat)

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-delimiters-to-clearly-indicate-distinct-parts-of-the-input)

#### [Тактика: используйте разделители, чтобы четко обозначить отдельные части ввода.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-delimiters-to-clearly-indicate-distinct-parts-of-the-input)

Разделители, такие как тройные кавычки, теги XML, заголовки разделов и т. д., могут помочь разграничить разделы текста, которые будут обрабатываться по-разному.

Обобщите текст, заключенный в тройные кавычки, с помощью хайку. """вставьте сюда текст"""

[Open in Playground](https://platform.openai.com/playground/p/default-delimiters-1?mode=chat)

You will be provided with a pair of articles (delimited with XML tags) about the same topic. First summarize the arguments of each article. Then indicate which of them makes a better argument and explain why.

<article> insert first article here </article> <article> insert second article here </article>

[Open in Playground](https://platform.openai.com/playground/p/default-delimiters-2?mode=chat)

You will be provided with a thesis abstract and a suggested title for it. The thesis title should give the reader a good idea of the topic of the thesis but should also be eye-catching. If the title does not meet these criteria, suggest 5 alternatives.

Abstract: insert abstract here Title: insert title here

[Open in Playground](https://platform.openai.com/playground/p/default-delimiters-3?mode=chat)

Для таких простых задач, как эта, использование разделителей может не повлиять на качество вывода. Однако чем сложнее задача, тем важнее устранить неоднозначность ее деталей. Не заставляйте модель работать, чтобы точно понять, что вы от нее просите.

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-specify-the-steps-required-to-complete-a-task)

#### [Тактика: укажите шаги, необходимые для выполнения задачи.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-specify-the-steps-required-to-complete-a-task)

Некоторые задачи лучше всего описать как последовательность шагов. Четкое описание шагов может облегчить модели их выполнение.

Используйте следующие пошаговые инструкции, чтобы реагировать на действия пользователя. Шаг 1. Пользователь предоставит вам текст в тройных кавычках. Обобщите этот текст в одном предложении с префиксом «Резюме:». Шаг 2. Переведите резюме из шага 1 на испанский язык с префиксом «Перевод:».

"""вставьте сюда текст"""

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-step-by-step-summarize-and-translate?mode=chat)

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-provide-examples)

#### [Тактика: приведите примеры](https://platform.openai.com/docs/guides/prompt-engineering/tactic-provide-examples)

Предоставление общих инструкций, применимых ко всем примерам, обычно более эффективно, чем демонстрация всех вариантов задачи на примере, но в некоторых случаях привести примеры может быть проще. Например, если вы хотите, чтобы модель копировала определенный стиль ответа на запросы пользователей, который сложно описать явно. Это известно как подсказка «несколько раз».

Отвечайте в едином стиле.

Река, прорезающая самую глубокую долину, вытекает из скромного родника; Величайшая симфония рождается из одной-единственной ноты; самый замысловатый гобелен начинается с одиночной нити.

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-chat-few-shot?mode=chat)

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-specify-the-desired-length-of-the-output)

#### [Тактика: укажите желаемую длину вывода](https://platform.openai.com/docs/guides/prompt-engineering/tactic-specify-the-desired-length-of-the-output)

Вы можете попросить модель выдавать выходные данные заданной целевой длины. Целевая длина вывода может быть указана в виде количества слов, предложений, абзацев, пунктов списка и т. д. Однако обратите внимание, что указание модели генерировать определенное количество слов не работает с высокой точностью. Модель может более надежно генерировать результаты с определенным количеством абзацев или пунктов списка.

Summarize the text delimited by triple quotes in 2 paragraphs. """insert text here"""

[Open in Playground](https://platform.openai.com/playground/p/default-summarize-text-2-paragraphs?mode=chat)

Summarize the text delimited by triple quotes in 3 bullet points. """insert text here"""

[Open in Playground](https://platform.openai.com/playground/p/default-summarize-text-3-bullet-points?mode=chat)

[](https://platform.openai.com/docs/guides/prompt-engineering/strategy-provide-reference-text)

### [Strategy: Provide reference text](https://platform.openai.com/docs/guides/prompt-engineering/strategy-provide-reference-text)

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-answer-using-a-reference-text)

#### [Tactic: Instruct the model to answer using a reference text](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-answer-using-a-reference-text)

If we can provide a model with trusted information that is relevant to the current query, then we can instruct the model to use the provided information to compose its answer.

Используйте предоставленные статьи, разделенные тройными кавычками, чтобы ответить на вопросы. Если в статьях ответ не найден, напишите «Не удалось найти ответ».

<вставьте статьи, каждая из которых заключена в тройные кавычки> Вопрос: <вставьте сюда вопрос>

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-answer-from-retrieved-documents?mode=chat)

Учитывая, что все модели имеют ограниченные контекстные окна, нам нужен какой-то способ динамического поиска информации, имеющей отношение к задаваемому вопросу. [Вложения](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings) могут использоваться для реализации эффективного поиска знаний. см. в тактике [«Использование поиска на основе внедрений для реализации эффективного поиска знаний» .](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-embeddings-based-search-to-implement-efficient-knowledge-retrieval) Дополнительные сведения о том, как это реализовать,

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-answer-with-citations-from-a-reference-text)

#### [Тактика: попросите модель ответить цитатами из справочного текста.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-answer-with-citations-from-a-reference-text)

Если входные данные были дополнены соответствующими знаниями, можно легко попросить модель добавить цитаты к своим ответам, ссылаясь на отрывки из предоставленных документов. Обратите внимание, что цитаты в выходных данных затем можно проверить программно путем сопоставления строк в предоставленных документах.

Вам будет предоставлен документ, разделенный тройными кавычками и вопросом. Ваша задача — ответить на вопрос, используя только предоставленный документ, и процитировать отрывок(а) документа, использованного для ответа на вопрос. Если в документе нет информации, необходимой для ответа на этот вопрос, то просто напишите: «Недостаточно информации». Если дан ответ на вопрос, он должен быть снабжен цитатой. Используйте следующий формат для цитирования соответствующих отрывков ({"citation": …}).

"""<вставьте сюда документ>""" Вопрос: <вставьте сюда вопрос>

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-answer-with-citation?mode=chat)

[](https://platform.openai.com/docs/guides/prompt-engineering/strategy-split-complex-tasks-into-simpler-subtasks)

### [Стратегия: разбивайте сложные задачи на более простые подзадачи.](https://platform.openai.com/docs/guides/prompt-engineering/strategy-split-complex-tasks-into-simpler-subtasks)

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-intent-classification-to-identify-the-most-relevant-instructions-for-a-user-query)

#### [Тактика: используйте классификацию намерений, чтобы определить наиболее релевантные инструкции для запроса пользователя.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-intent-classification-to-identify-the-most-relevant-instructions-for-a-user-query)

Для задач, в которых для обработки различных случаев требуется множество независимых наборов инструкций, может быть полезно сначала классифицировать тип запроса и использовать эту классификацию, чтобы определить, какие инструкции необходимы. Этого можно достичь путем определения фиксированных категорий и инструкций жесткого кодирования, которые подходят для обработки задач в данной категории. Этот процесс также можно применять рекурсивно для разложения задачи на последовательность этапов. Преимущество этого подхода заключается в том, что каждый запрос будет содержать только те инструкции, которые необходимы для выполнения следующего этапа задачи, что может привести к снижению частоты ошибок по сравнению с использованием одного запроса для выполнения всей задачи. Это также может привести к снижению затрат, поскольку запуск более крупных подсказок обходится дороже ( [см. информацию о ценах](https://openai.com/pricing) ).

Предположим, например, что для приложения обслуживания клиентов запросы можно классифицировать следующим образом:

Вам будут предоставлены вопросы по обслуживанию клиентов. Классифицируйте каждый запрос на первичную категорию и вторичную категорию. Предоставьте вывод в формате json с ключами: основной и дополнительный. Основные категории: выставление счетов, техническая поддержка, управление учетной записью или общий запрос. Дополнительные категории выставления счетов: - Отписаться или обновить - Добавить способ оплаты - Пояснение к оплате - Оспаривать плату Дополнительные категории технической поддержки: - Поиск неисправностей - Совместимость устройств - Обновления программного обеспечения Вторичные категории управления учетными записями: - Восстановление пароля - Обновить личную информацию - Закрыть аккаунт - Безопасность аккаунта Второстепенные категории общего запроса: - Информация о продукте - Цены - Обратная связь - Поговорите с человеком

Мне нужно, чтобы мой интернет снова заработал.

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-decomposition-by-intent-classification-1?mode=chat)

На основе классификации запроса клиента модели может быть предоставлен набор более конкретных инструкций для обработки следующих шагов. Например, предположим, что клиенту требуется помощь в «устранении неполадок».

Вам будут предоставлены запросы в службу поддержки клиентов, требующие устранения неполадок в контексте технической поддержки. Помогите пользователю: - Попросите их проверить, подключены ли все кабели к маршрутизатору и от него. Обратите внимание, что кабели со временем часто ослабляются. - Если все кабели подключены, а проблема не устранена, спросите, какую модель маршрутизатора они используют. - Теперь вы посоветуете им, как перезагрузить устройство: -- Если номер модели — MTD-327J, посоветуйте нажать красную кнопку и удерживать ее в течение 5 секунд, а затем подождать 5 минут, прежде чем проверять соединение. -- Если номер модели — MTD-327S, посоветуйте отключить и снова подключить его, затем подождите 5 минут, прежде чем проверять соединение. - Если проблема клиента не устранена после перезапуска устройства и ожидания 5 минут, подключите его к ИТ-поддержке, выведя {"Запрошена ИТ-поддержка"}. - Если пользователь начинает задавать вопросы, не относящиеся к данной теме, подтвердите, хочет ли он завершить текущий чат об устранении неполадок, и классифицируйте свой запрос по следующей схеме: <вставьте сюда схему первичной/вторичной классификации сверху>

Мне нужно, чтобы мой интернет снова заработал.

[Open in Playground](https://platform.openai.com/playground/p/default-decomposition-by-intent-classification-2?mode=chat)

Notice that the model has been instructed to emit special strings to indicate when the state of the conversation changes. This enables us to turn our system into a state machine where the state determines which instructions are injected. By keeping track of state, what instructions are relevant at that state, and also optionally what state transitions are allowed from that state, we can put guardrails around the user experience that would be hard to achieve with a less structured approach.

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-for-dialogue-applications-that-require-very-long-conversations-summarize-or-filter-previous-dialogue)

#### [Tactic: For dialogue applications that require very long conversations, summarize or filter previous dialogue](https://platform.openai.com/docs/guides/prompt-engineering/tactic-for-dialogue-applications-that-require-very-long-conversations-summarize-or-filter-previous-dialogue)

Поскольку модели имеют фиксированную длину контекста, диалог между пользователем и помощником, в котором весь разговор включен в контекстное окно, не может продолжаться бесконечно.

Существуют различные обходные пути этой проблемы, один из которых — подведение итогов предыдущих ходов разговора. Как только размер входных данных достигнет заранее определенной пороговой длины, это может инициировать запрос, который суммирует часть разговора, и резюме предыдущего разговора может быть включено как часть системного сообщения. Альтернативно, предыдущий разговор может суммироваться асинхронно в фоновом режиме на протяжении всего разговора.

Альтернативное решение — динамически выбирать предыдущие части разговора, которые наиболее релевантны текущему запросу. См. тактику [«Использование поиска на основе вложений для реализации эффективного поиска знаний»](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-embeddings-based-search-to-implement-efficient-knowledge-retrieval) .

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-summarize-long-documents-piecewise-and-construct-a-full-summary-recursively)

#### [Тактика: суммируйте длинные документы по частям и рекурсивно создайте полное резюме.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-summarize-long-documents-piecewise-and-construct-a-full-summary-recursively)

Поскольку модели имеют фиксированную длину контекста, их нельзя использовать для суммирования текста, длина которого превышает длину контекста минус длина сгенерированной сводки в одном запросе.

Чтобы суммировать очень длинный документ, например книгу, мы можем использовать последовательность запросов для суммирования каждого раздела документа. Краткое изложение разделов можно объединять и суммировать, создавая краткое изложение сводных данных. Этот процесс может продолжаться рекурсивно до тех пор, пока не будет обобщен весь документ. Если необходимо использовать информацию о более ранних разделах, чтобы понять смысл последующих разделов, тогда может оказаться полезным еще один трюк — включить краткое изложение текста, который предшествует любому заданному моменту в книге, одновременно суммируя содержание в этом месте. Эффективность этой процедуры реферирования книг изучалась в предыдущих [исследованиях](https://openai.com/research/summarizing-books) OpenAI с использованием вариантов GPT-3.

[](https://platform.openai.com/docs/guides/prompt-engineering/strategy-give-models-time-to-think)

### [Стратегия: дайте моделям время «подумать».](https://platform.openai.com/docs/guides/prompt-engineering/strategy-give-models-time-to-think)

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-work-out-its-own-solution-before-rushing-to-a-conclusion)

#### [Тактика: поручите модели найти собственное решение, прежде чем спешить с выводами.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-work-out-its-own-solution-before-rushing-to-a-conclusion)

Иногда мы получаем лучшие результаты, когда явно предписываем модели рассуждать, исходя из основных принципов, прежде чем прийти к выводу. Предположим, например, что нам нужна модель для оценки решения учащегося математической задачи. Самый очевидный способ подойти к этому — просто спросить модель, правильное решение учащегося или нет.

Determine if the student's solution is correct or not.

Problem Statement: I'm building a solar power installation and I need help working out the financials. - Land costs $100 / square foot - I can buy solar panels for $250 / square foot - I negotiated a contract for maintenance that will cost me a flat $100k per year, and an additional $10 / square foot What is the total cost for the first year of operations as a function of the number of square feet. Student's Solution: Let x be the size of the installation in square feet. 1. Land cost: 100x 2. Solar panel cost: 250x 3. Maintenance cost: 100,000 + 100x Total cost: 100x + 250x + 100,000 + 100x = 450x + 100,000

Решение ученика правильное.

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-rushing-to-a-conclusion?mode=chat)

Но решение ученика на самом деле неверно! Мы можем заставить модель успешно заметить это, предложив ей сначала сгенерировать собственное решение.

Сначала найдите собственное решение проблемы. Затем сравните свое решение с решением учащегося и оцените, правильное решение учащегося или нет. Не решайте, правильно ли решение ученика, пока вы не решите задачу самостоятельно.

Постановка задачи: я строю солнечную электростанцию, и мне нужна помощь в расчете финансовых показателей. - Земля стоит 100 долларов за квадратный фут. - Я могу купить солнечные панели по цене 250 долларов за квадратный фут. - Я заключил контракт на техническое обслуживание, которое будет стоить мне фиксированную сумму в 100 тысяч долларов в год и дополнительные 10 долларов за квадратный фут. Какова общая стоимость первого года эксплуатации в зависимости от количества квадратных футов. Решение учащегося: Пусть x — размер установки в квадратных футах. 1. Стоимость земли: 100x 2. Стоимость солнечной панели: 250x. 3. Стоимость обслуживания: 100 000 + 100x. Общая стоимость: 100x + 250x + 100 000 + 100x = 450x + 100 000.

Пусть x — размер установки в квадратных футах. 1. Стоимость земли: 100x 2. Стоимость солнечной панели: 250x. 3. Стоимость обслуживания: 100 000 + 10x. Общая стоимость: 100x + 250x + 100 000 + 10x = 360x + 100 000. Решение ученика неверное. Они допустили ошибку при расчете стоимости обслуживания, применив 100x вместо 10x. Правильная общая стоимость первого года работы равна 360x + 100 000.

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-avoid-rushing-to-a-conclusion?mode=chat)

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-inner-monologue-or-a-sequence-of-queries-to-hide-the-model-s-reasoning-process)

#### [Тактика: используйте внутренний монолог или последовательность вопросов, чтобы скрыть процесс рассуждения модели.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-inner-monologue-or-a-sequence-of-queries-to-hide-the-model-s-reasoning-process)

Предыдущая тактика демонстрирует, что иногда модели важно подробно рассмотреть проблему, прежде чем ответить на конкретный вопрос. В некоторых приложениях процесс рассуждения, который модель использует для получения окончательного ответа, нецелесообразно делиться с пользователем. Например, в обучающих приложениях мы можем захотеть побудить учащихся самостоятельно найти ответы, но процесс рассуждения модели о решении учащегося может раскрыть ответ учащемуся.

Внутренний монолог — это тактика, которую можно использовать, чтобы смягчить это. Идея внутреннего монолога состоит в том, чтобы поручить модели поместить части вывода, которые должны быть скрыты от пользователя, в структурированный формат, который упрощает их анализ. Затем, прежде чем представить выходные данные пользователю, выходные данные анализируются, и видимой становится только часть выходных данных.

Выполните следующие действия, чтобы ответить на вопросы пользователей. Шаг 1. Сначала найдите собственное решение проблемы. Не полагайтесь на решение учащегося, поскольку оно может быть неверным. Заключите всю свою работу на этом этапе в тройные кавычки ("""). Шаг 2. Сравните свое решение с решением учащегося и оцените, правильное или нет решение учащегося. Заключите всю свою работу на этом этапе в тройные кавычки ("""). Шаг 3. Если ученик допустил ошибку, определите, какую подсказку вы могли бы дать ученику, не раскрывая ответа. Заключите всю свою работу на этом этапе в тройные кавычки ("""). Шаг 4. Если ученик допустил ошибку, дайте ему подсказку из предыдущего шага (кроме тройных кавычек). Вместо написания «Шаг 4 — ...» напишите «Подсказка:».

Постановка проблемы: <вставьте формулировку проблемы> Решение учащегося: <вставьте решение учащегося>

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-inner-monologue?mode=chat)

В качестве альтернативы этого можно достичь с помощью последовательности запросов, в которых выходные данные всех запросов, кроме последнего, скрыты от конечного пользователя.

Во-первых, мы можем попросить модель решить проблему самостоятельно. Поскольку этот первоначальный запрос не требует решения учащегося, его можно опустить. Это дает дополнительное преимущество, заключающееся в том, что нет никакой вероятности того, что решение модели будет искажаться предпринятым студентом решением.

Далее мы можем заставить модель использовать всю доступную информацию для оценки правильности решения студента.

Сравните свое решение с решением учащегося и оцените, правильное или нет решение учащегося.

Постановка задачи: """<вставьте формулировку проблемы>""" Ваше решение: """<вставьте решение, сгенерированное моделью>""" Решение учащегося: """<вставьте решение учащегося>"""

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-query-sequence-2?mode=chat)

Наконец, мы можем позволить модели использовать собственный анализ для построения ответа в лице полезного наставника.

Вы репетитор по математике. Если ученик допустил ошибку, дайте ему подсказку таким образом, чтобы не раскрыть ответ. Если ученик не допустил ошибки, просто предложите ему ободряющий комментарий.

Постановка задачи: """<вставьте формулировку проблемы>""" Ваше решение: """<вставьте решение, сгенерированное моделью>""" Решение учащегося: """<вставьте решение учащегося>""" Анализ: """<вставьте анализ, сгенерированный моделью на предыдущем шаге>"""

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-query-sequence-3?mode=chat)

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-ask-the-model-if-it-missed-anything-on-previous-passes)

#### [Тактика: спросите модель, не пропустила ли она что-нибудь при предыдущих проходах.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-ask-the-model-if-it-missed-anything-on-previous-passes)

Предположим, что мы используем модель для перечисления выдержек из источника, имеющих отношение к конкретному вопросу. После перечисления каждого отрывка модель должна определить, следует ли ей начать писать следующий или остановиться. Если исходный документ большой, модель часто останавливается слишком рано и не отображает все соответствующие выдержки. В этом случае более высокую производительность часто можно получить, предложив модели последующие запросы найти любые фрагменты, которые она пропустила на предыдущих проходах.

Вам будет предоставлен документ, разделенный тройными кавычками. Ваша задача — выбрать отрывки, относящиеся к следующему вопросу: «Какие существенные сдвиги парадигмы произошли в истории искусственного интеллекта». Убедитесь, что отрывки содержат весь соответствующий контекст, необходимый для их интерпретации. Другими словами, не извлекайте небольшие фрагменты, в которых отсутствует важный контекст. Предоставьте вывод в формате JSON следующим образом: \[{"отрывок": "..."}, ... {"отрывок": "..."}\]

"""<вставьте сюда документ>"""

\[{"excerpt": "модель записывает здесь отрывок"}, ... {"excerpt": "модель пишет здесь еще один отрывок"}\]

Are there more relevant excerpts? Take care not to repeat excerpts. Also ensure that excerpts contain all relevant context needed to interpret them - in other words don't extract small snippets that are missing important context.

[Open in Playground](https://platform.openai.com/playground/p/default-2nd-pass?mode=chat)

[](https://platform.openai.com/docs/guides/prompt-engineering/strategy-use-external-tools)

### [Strategy: Use external tools](https://platform.openai.com/docs/guides/prompt-engineering/strategy-use-external-tools)

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-embeddings-based-search-to-implement-efficient-knowledge-retrieval)

#### [Tactic: Use embeddings-based search to implement efficient knowledge retrieval](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-embeddings-based-search-to-implement-efficient-knowledge-retrieval)

A model can leverage external sources of information if provided as part of its input. This can help the model to generate more informed and up-to-date responses. For example, if a user asks a question about a specific movie, it may be useful to add high quality information about the movie (e.g. actors, director, etc…) to the model’s input. Embeddings can be used to implement efficient knowledge retrieval, so that relevant information can be added to the model input dynamically at run-time.

A text embedding is a vector that can measure the relatedness between text strings. Similar or relevant strings will be closer together than unrelated strings. This fact, along with the existence of fast vector search algorithms means that embeddings can be used to implement efficient knowledge retrieval. In particular, a text corpus can be split up into chunks, and each chunk can be embedded and stored. Then a given query can be embedded and vector search can be performed to find the embedded chunks of text from the corpus that are most related to the query (i.e. closest together in the embedding space).

Example implementations can be found in the [OpenAI Cookbook](https://cookbook.openai.com/examples/vector_databases/readme). See the tactic [“Instruct the model to use retrieved knowledge to answer queries”](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-answer-using-a-reference-text) for an example of how to use knowledge retrieval to minimize the likelihood that a model will make up incorrect facts.

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-code-execution-to-perform-more-accurate-calculations-or-call-external-apis)

#### [Tactic: Use code execution to perform more accurate calculations or call external APIs](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-code-execution-to-perform-more-accurate-calculations-or-call-external-apis)

Нельзя полагаться на языковые модели для точного выполнения арифметических или длинных вычислений самостоятельно. В тех случаях, когда это необходимо, модели можно поручить написать и запустить код вместо выполнения собственных вычислений. В частности, модели можно поручить поместить код, предназначенный для запуска, в определенный формат, например тройной обратный апостроф. После получения вывода код можно извлечь и запустить. Наконец, при необходимости выходные данные механизма выполнения кода (т. е. интерпретатора Python) могут быть предоставлены в качестве входных данных модели для следующего запроса.

Вы можете писать и выполнять код Python, заключая его в тройные обратные кавычки, например, \`\`\`код идет здесь\`\`\`. Используйте это для выполнения вычислений.

Найдите все действительные корни следующего многочлена: 3\*x\*\*5 - 5\*x\*\*4 - 3\*x\*\*3 - 7\*x - 10.

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-code-execution?mode=chat)

Еще один хороший вариант использования кода — вызов внешних API. Если модель обучена правильному использованию API, она может написать код, использующий его. Модель можно проинструктировать о том, как использовать API, предоставив ей документацию и/или примеры кода, показывающие, как использовать API.

Вы можете писать и выполнять код Python, заключая его в тройные обратные кавычки. Также обратите внимание, что у вас есть доступ к следующему модулю, который поможет пользователям отправлять сообщения своим друзьям: \`\`\` питон импортировать сообщение message.write(to="Джон", message="Эй, хочешь встретиться после работы?")\`\`\`

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-code-api?mode=chat)

**ВНИМАНИЕ: Выполнение кода, созданного моделью, по своей сути небезопасно, и в любом приложении, которое пытается это сделать, следует принять меры предосторожности. В частности, необходима изолированная среда выполнения кода, чтобы ограничить вред, который может нанести ненадежный код.**

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-give-the-model-access-to-specific-functions)

#### [Тактика: дайте модели доступ к определенным функциям.](https://platform.openai.com/docs/guides/prompt-engineering/tactic-give-the-model-access-to-specific-functions)

API Chat Completions позволяет передавать в запросах список описаний функций. Это позволяет моделям генерировать аргументы функций в соответствии с предоставленными схемами. Сгенерированные аргументы функции возвращаются API в формате JSON и могут использоваться для выполнения вызовов функций. Вывод, предоставленный вызовами функций, затем может быть возвращен в модель в следующем запросе, чтобы замкнуть цикл. Это рекомендуемый способ использования моделей OpenAI для вызова внешних функций. Чтобы узнать больше, см. [раздел «Вызов функций»](https://platform.openai.com/docs/guides/function-calling) в нашем вводном руководстве по созданию текста и дополнительные [примеры вызова функций](https://cookbook.openai.com/examples/how_to_call_functions_with_chat_models) в «Поваренной книге OpenAI».

[](https://platform.openai.com/docs/guides/prompt-engineering/strategy-test-changes-systematically)

### [Стратегия: систематическое тестирование изменений.](https://platform.openai.com/docs/guides/prompt-engineering/strategy-test-changes-systematically)

Иногда бывает трудно определить, делает ли изменение (например, новая инструкция или новый дизайн) вашу систему лучше или хуже. Рассмотрение нескольких примеров может подсказать, какой из них лучше, но при небольших размерах выборки может быть трудно отличить истинное улучшение от случайной удачи. Возможно, это изменение повысит производительность на одних входах, но ухудшит производительность на других.

Процедуры оценки (или «оценки») полезны для оптимизации конструкции системы. Хорошие оценки:

-   Представитель реального использования (или, по крайней мере, разнообразного)
-   Содержит множество тестовых примеров для большей статистической мощности (рекомендации см. в таблице ниже).
-   Легко автоматизировать или повторить

| Разница для обнаружения | Размер выборки необходим для уверенности 95 %. |
| --- | --- |
| 30% | ~10 |
| 10% | ~100 |
| 3% | ~1,000 |
| 1% | ~10,000 |

Оценка результатов может производиться компьютерами, людьми или и тем, и другим. Компьютеры могут автоматизировать оценку с использованием объективных критериев (например, вопросов с единственным правильным ответом), а также некоторых субъективных или нечетких критериев, в которых выходные данные модели оцениваются с помощью других запросов модели. [OpenAI Evals](https://github.com/openai/evals) — это программная платформа с открытым исходным кодом, предоставляющая инструменты для создания автоматических оценок.

Оценки на основе моделей могут быть полезны, когда существует ряд возможных результатов, которые можно считать одинаково качественными (например, для вопросов с длинными ответами). Граница между тем, что можно реалистично оценить с помощью оценки на основе модели, и тем, что требует оценки человеком, размыта и постоянно меняется по мере того, как модели становятся более функциональными. Мы поощряем эксперименты, чтобы выяснить, насколько хорошо оценки на основе моделей могут работать в вашем случае.

[](https://platform.openai.com/docs/guides/prompt-engineering/tactic-evaluate-model-outputs-with-reference-to-gold-standard-answers)

#### [Тактика: Оцените результаты модели со ссылкой на ответы «золотого стандарта».](https://platform.openai.com/docs/guides/prompt-engineering/tactic-evaluate-model-outputs-with-reference-to-gold-standard-answers)

Предположим, известно, что правильный ответ на вопрос должен ссылаться на определенный набор известных фактов. Затем мы можем использовать модельный запрос, чтобы подсчитать, сколько требуемых фактов включено в ответ.

For example, using the following system message:

Вам будет предоставлен текст, разделенный тройными кавычками, который должен быть ответом на вопрос. Проверьте, содержатся ли в ответе непосредственно следующие сведения: - Нил Армстронг был первым человеком, ступившим на Луну. - Дата, когда Нил Армстронг впервые ступил на Луну, — 21 июля 1969 года. Для каждой из этих точек выполните следующие действия: 1 – Еще раз сформулируйте эту мысль. 2 – Приведите цитату из ответа, наиболее близкого к этому вопросу. 3. Подумайте, может ли кто-то, читающий цитату и не знающий темы, напрямую сделать вывод о ее сути. Прежде чем принять решение, объясните, почему или почему нет. 4 – Напишите «да», если ответ на вопрос 3 был «да», в противном случае напишите «нет». Наконец, подсчитайте количество ответов «да». Укажите это количество как {"count": <вставьте количество здесь>}.

[Открыть на детской площадке](https://platform.openai.com/docs/guides/prompt-engineering/strategy-test-changes-systematically?mode=chat)

Вот пример ввода, где выполняются оба пункта:

<вставьте системное сообщение выше>

"""Нил Армстронг известен тем, что был первым человеком, ступившим на Луну. Это историческое событие произошло 21 июля 1969 года во время миссии Аполлона-11."""

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-model-based-eval-1?mode=chat)

Вот пример ввода, где удовлетворяется только одна точка:

<вставьте системное сообщение выше>

"""Нил Армстронг вошел в историю, когда сошел с лунного модуля, став первым человеком, ступившим на Луну."""

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-model-based-eval-2?mode=chat)

Вот пример ввода, где ни один из них не удовлетворен:

<вставьте системное сообщение выше>

"""Летом 69-го года, грандиозное путешествие, Аполлон-11, смелый, как рука легенды. Армстронг сделал шаг, история развернулась, «Один маленький шаг», — сказал он, — к новому миру».

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-model-based-eval-3?mode=chat)

Существует множество возможных вариантов этого типа оценки на основе модели. Рассмотрим следующий вариант, который отслеживает степень совпадения между ответом-кандидатом и ответом по золотому стандарту, а также отслеживает, противоречит ли ответ-кандидат какой-либо части ответа по золотому стандарту.

Используйте следующие шаги, чтобы ответить на вводимые пользователем данные. Полностью переформулируйте каждый шаг, прежде чем продолжить. т.е. «Шаг 1: Причина...». Шаг 1: Пошаговое обоснование того, является ли информация в представленном ответе по сравнению с ответом эксперта: непересекающейся, равной, подмножеством, надмножеством или перекрытием (т. е. некоторым пересечением, но не подмножеством/надмножеством). Шаг 2. Пошаговое обоснование того, противоречит ли представленный ответ какому-либо аспекту ответа эксперта. Шаг 3. Выведите объект JSON, структурированный следующим образом: {"type\_of\_overlap": "непересекающийся" или "равный" или "подмножество" или "супермножество" или "перекрытие", "противоречие": true или false}

[Открыть на детской площадке](https://platform.openai.com/docs/guides/prompt-engineering/strategy-test-changes-systematically?mode=chat)

Вот пример ввода с нестандартным ответом, который, тем не менее, не противоречит ответу эксперта:

<вставьте системное сообщение выше>

Вопрос: """Какое событие наиболее известно Нилу Армстронгу и в какой день оно произошло? Предположим, время UTC.""" Отправленный ответ: """Разве он не ходил по Луне или что-то в этом роде?""" Ответ эксперта: """Нил Армстронг наиболее известен как первый человек, ступивший на Луну. Это историческое событие произошло 21 июля 1969 года."""

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-model-based-eval-4?mode=chat)

Вот пример ввода с ответом, который прямо противоречит ответу эксперта:

<вставьте системное сообщение выше>

Вопрос: """Какое событие наиболее известно Нилу Армстронгу и в какой день оно произошло? Предположим, время UTC.""" Представленный ответ: """21 июля 1969 года Нил Армстронг стал вторым человеком, ступившим на Луну, после Базза Олдрина.""" Ответ эксперта: """Нил Армстронг наиболее известен как первый человек, ступивший на Луну. Это историческое событие произошло 21 июля 1969 года."""

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-model-based-eval-5?mode=chat)

Вот пример ввода с правильным ответом, который также содержит немного больше деталей, чем необходимо:

<вставьте системное сообщение выше>

Вопрос: """Какое событие наиболее известно Нилу Армстронгу и в какой день оно произошло? Предположим, время UTC.""" Представленный ответ: """Примерно в 02:56 по всемирному координированному времени 21 июля 1969 года Нил Армстронг стал первым человеком, ступившим на поверхность Луны, что ознаменовало монументальное достижение в истории человечества.""" Ответ эксперта: """Нил Армстронг наиболее известен как первый человек, ступивший на Луну. Это историческое событие произошло 21 июля 1969 года."""

[Открыть на детской площадке](https://platform.openai.com/playground/p/default-model-based-eval-6?mode=chat)

[](https://platform.openai.com/docs/guides/prompt-engineering/other-resources)

## [Другие источники](https://platform.openai.com/docs/guides/prompt-engineering/other-resources)

Для получения дополнительных идей посетите [кулинарную книгу OpenAI](https://cookbook.openai.com/) , которая содержит примеры кода, а также ссылки на сторонние ресурсы, такие как:

-   [Подсказки библиотек и инструментов](https://cookbook.openai.com/related_resources#prompting-libraries--tools)
-   [Подсказки руководства](https://cookbook.openai.com/related_resources#prompting-guides)
-   [Видео курсы](https://cookbook.openai.com/related_resources#video-courses)
-   [Статьи о расширенных подсказках для улучшения рассуждений](https://cookbook.openai.com/related_resources#papers-on-advanced-prompting-to-improve-reasoning)
