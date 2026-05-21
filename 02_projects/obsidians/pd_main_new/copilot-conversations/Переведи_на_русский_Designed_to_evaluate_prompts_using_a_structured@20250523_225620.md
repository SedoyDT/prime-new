---
epoch: 1748030180217
modelKey: copilot-plus-flash|copilot-plus
tags:
  - copilot-conversation
---

**user**: Переведи на русский

Designed to **evaluate prompts** using a structured 35-criteria rubric with clear scoring, critique, and actionable refinement suggestions.

---

You are a **senior prompt engineer** participating in the **Prompt Evaluation Chain**, a quality system built to enhance prompt design through systematic reviews and iterative feedback. Your task is to **analyze and score a given prompt** following the detailed rubric and refinement steps below.

---

## 🎯 Evaluation Instructions

1. **Review the prompt** provided inside triple backticks (```).
2. **Evaluate the prompt** using the **35-criteria rubric** below.
3. For **each criterion**:
 - Assign a **score** from 1 (Poor) to 5 (Excellent).
 - Identify **one clear strength**.
 - Suggest **one specific improvement**.
 - Provide a **brief rationale** for your score (1–2 sentences).
4. **Validate your evaluation**:
 - Randomly double-check 3–5 of your scores for consistency.
 - Revise if discrepancies are found.
5. **Simulate a contrarian perspective**:
 - Briefly imagine how a critical reviewer might challenge your scores.
 - Adjust if persuasive alternate viewpoints emerge.
6. **Surface assumptions**:
 - Note any hidden biases, assumptions, or context gaps you noticed during scoring.
7. **Calculate and report** the total score out of 175.
8. **Offer 7–10 actionable refinement suggestions** to strengthen the prompt.

> ⏳ **Time Estimate:** Completing a full evaluation typically takes 10–20 minutes.

---

### ⚡ Optional Quick Mode

If evaluating a shorter or simpler prompt, you may:
- Group similar criteria (e.g., group 5-10 together)
- Write condensed strengths/improvements (2–3 words)
- Use a simpler total scoring estimate (+/- 5 points)

Use full detail mode when precision matters.

---

## 📊 Evaluation Criteria Rubric

1. Clarity & Specificity 
2. Context / Background Provided 
3. Explicit Task Definition
4. Feasibility within Model Constraints
5. Avoiding Ambiguity or Contradictions 
6. Model Fit / Scenario Appropriateness
7. Desired Output Format / Style
8. Use of Role or Persona
9. Step-by-Step Reasoning Encouraged 
10. Structured / Numbered Instructions
11. Brevity vs. Detail Balance
12. Iteration / Refinement Potential
13. Examples or Demonstrations
14. Handling Uncertainty / Gaps
15. Hallucination Minimization
16. Knowledge Boundary Awareness
17. Audience Specification
18. Style Emulation or Imitation
19. Memory Anchoring (Multi-Turn Systems)
20. Meta-Cognition Triggers
21. Divergent vs. Convergent Thinking Management
22. Hypothetical Frame Switching
23. Safe Failure Mode
24. Progressive Complexity
25. Alignment with Evaluation Metrics
26. Calibration Requests 
27. Output Validation Hooks
28. Time/Effort Estimation Request
29. Ethical Alignment or Bias Mitigation
30. Limitations Disclosure
31. Compression / Summarization Ability
32. Cross-Disciplinary Bridging
33. Emotional Resonance Calibration
34. Output Risk Categorization
35. Self-Repair Loops

> 📌 **Calibration Tip:** For any criterion, briefly explain what a 1/5 versus 5/5 looks like. Consider a "gut-check": would you defend this score if challenged?

---

## 📝 Evaluation Template

```markdown
1. Clarity & Specificity – X/5 
 - Strength: [Insert] 
 - Improvement: [Insert] 
 - Rationale: [Insert]

2. Context / Background Provided – X/5 
 - Strength: [Insert] 
 - Improvement: [Insert] 
 - Rationale: [Insert]

... (repeat through 35)

💯 Total Score: X/175 
🛠️ Refinement Summary: 
- [Suggestion 1] 
- [Suggestion 2] 
- [Suggestion 3] 
- [Suggestion 4] 
- [Suggestion 5] 
- [Suggestion 6] 
- [Suggestion 7] 
- [Optional Extras]
```

---

## 💡 Example Evaluations

### Good Example

```markdown
1. Clarity & Specificity – 4/5 
 - Strength: The evaluation task is clearly defined. 
 - Improvement: Could specify depth expected in rationales. 
 - Rationale: Leaves minor ambiguity in expected explanation length.
```

### Poor Example

```markdown
1. Clarity & Specificity – 2/5 
 - Strength: It's about clarity. 
 - Improvement: Needs clearer writing. 
 - Rationale: Too vague and unspecific, lacks actionable feedback.
```

---

## 🎯 Audience

This evaluation prompt is designed for **intermediate to advanced prompt engineers** (human or AI) who are capable of nuanced analysis, structured feedback, and systematic reasoning.

---

## 🧠 Additional Notes

- Assume the persona of a **senior prompt engineer**.
- Use **objective, concise language**.
- **Think critically**: if a prompt is weak, suggest concrete alternatives.
- **Manage cognitive load**: if overwhelmed, use Quick Mode responsibly.
- **Surface latent assumptions** and be alert to context drift.
- **Switch frames** occasionally: would a critic challenge your score? 
- **Simulate vs predict**: Predict typical responses, simulate expert judgment where needed.

✅ *Tip: Aim for clarity, precision, and steady improvement with every evaluation.*

---

## 📥 Prompt to Evaluate

Paste the prompt you want evaluated between triple backticks (```), ensuring it is complete and ready for review.
[Timestamp: 2025/05/23 22:56:20]

**ai**: Конечно, вот перевод на русский язык:

Предназначено для **оценки промптов** с использованием структурированной рубрики из 35 критериев с четкой системой оценки, критикой и практическими предложениями по улучшению.

---

Вы – **опытный инженер по промптам**, участвующий в **Цепочке оценки промптов** – системе качества, созданной для улучшения разработки промптов посредством систематических обзоров и итеративной обратной связи. Ваша задача – **проанализировать и оценить заданный промт**, следуя подробной рубрике и этапам улучшения, указанным ниже.

---

## 🎯 Инструкции по оценке

1. **Просмотрите промт**, представленный внутри тройных обратных кавычек (```).
2. **Оцените промт**, используя **рубрику из 35 критериев**, приведенную ниже.
3. Для **каждого критерия**:
    - Присвойте **оценку** от 1 (Плохо) до 5 (Отлично).
    - Определите **одну явную сильную сторону**.
    - Предложите **одно конкретное улучшение**.
    - Предоставьте **краткое обоснование** вашей оценки (1–2 предложения).
4. **Проверьте свою оценку**:
    - Случайным образом перепроверьте 3–5 своих оценок на предмет согласованности.
    - Внесите изменения, если обнаружены расхождения.
5. **Смоделируйте противоположную точку зрения**:
    - Кратко представьте, как критически настроенный рецензент мог бы оспорить ваши оценки.
    - Скорректируйте, если появятся убедительные альтернативные точки зрения.
6. **Выявите предположения**:
    - Отметьте любые скрытые предубеждения, предположения или пробелы в контексте, которые вы заметили во время оценки.
7. **Рассчитайте и сообщите** общий балл из 175.
8. **Предложите 7–10 практических предложений по улучшению**, чтобы усилить промт.

> ⏳ **Оценка времени:** Полная оценка обычно занимает 10–20 минут.

---

### ⚡ Дополнительный быстрый режим

При оценке более короткого или простого промта вы можете:
- Сгруппировать похожие критерии (например, сгруппировать 5–10 вместе)
- Написать сжатые сильные стороны/улучшения (2–3 слова)
- Использовать более простую общую оценку (+/- 5 баллов)

Используйте режим полной детализации, когда важна точность.

---

## 📊 Рубрика критериев оценки

1. Четкость и конкретность
2. Предоставленный контекст / предыстория
3. Явное определение задачи
4. Осуществимость в рамках ограничений модели
5. Избежание двусмысленности или противоречий
6. Соответствие модели / уместность сценария
7. Желаемый формат / стиль вывода
8. Использование роли или личности
9. Поощрение пошаговых рассуждений
10. Структурированные / пронумерованные инструкции
11. Баланс краткости и детализации
12. Потенциал итерации / улучшения
13. Примеры или демонстрации
14. Обработка неопределенности / пробелов
15. Минимизация галлюцинаций
16. Осведомленность о границах знаний
17. Определение аудитории
18. Эмуляция или имитация стиля
19. Привязка к памяти (многооборотные системы)
20. Триггеры мета-познания
21. Управление дивергентным и конвергентным мышлением
22. Переключение гипотетических фреймов
23. Безопасный режим отказа
24. Прогрессивная сложность
25. Соответствие метрикам оценки
26. Запросы на калибровку
27. Хуки проверки вывода
28. Запрос оценки времени/усилий
29. Этическое соответствие или смягчение предвзятости
30. Раскрытие ограничений
31. Возможность сжатия / суммирования
32. Междисциплинарное соединение
33. Калибровка эмоционального резонанса
34. Категоризация рисков вывода
35. Циклы самовосстановления

> 📌 **Совет по калибровке:** Для любого критерия кратко объясните, как выглядит оценка 1/5 по сравнению с 5/5. Подумайте о "чутье": стали бы вы защищать эту оценку, если бы ее оспорили?

---

## 📝 Шаблон оценки

```markdown
1. Четкость и конкретность – X/5
    - Сильная сторона: [Вставить]
    - Улучшение: [Вставить]
    - Обоснование: [Вставить]

2. Предоставленный контекст / предыстория – X/5
    - Сильная сторона: [Вставить]
    - Улучшение: [Вставить]
    - Обоснование: [Вставить]

... (повторите до 35)

💯 Общий балл: X/175
🛠️ Краткое описание улучшений:
- [Предложение 1]
- [Предложение 2]
- [Предложение 3]
- [Предложение 4]
- [Предложение 5]
- [Предложение 6]
- [Предложение 7]
- [Дополнительные опции]
```

---

## 💡 Примеры оценок

### Хороший пример

```markdown
1. Четкость и конкретность – 4/5
    - Сильная сторона: Задача оценки четко определена.
    - Улучшение: Можно указать ожидаемую глубину обоснований.
    - Обоснование: Оставляет небольшую двусмысленность в ожидаемой длине объяснения.
```

### Плохой пример

```markdown
1. Четкость и конкретность – 2/5
    - Сильная сторона: Речь идет о четкости.
    - Улучшение: Требуется более четкое написание.
    - Обоснование: Слишком расплывчато и неконкретно, отсутствует действенная обратная связь.
```

---

## 🎯 Аудитория

Этот промт оценки предназначен для **инженеров по промптам среднего и продвинутого уровня** (людей или ИИ), способных к детальному анализу, структурированной обратной связи и систематическим рассуждениям.

---

## 🧠 Дополнительные примечания

- Примите образ **опытного инженера по промптам**.
- Используйте **объективный, лаконичный язык**.
- **Мыслите критически**: если промт слабый, предложите конкретные альтернативы.
- **Управляйте когнитивной нагрузкой**: если перегружены, используйте быстрый режим ответственно.
- **Выявляйте скрытые предположения** и будьте внимательны к смещению контекста.
- **Иногда переключайте фреймы**: оспорит ли критик вашу оценку?
- **Моделируйте, а не предсказывайте**: Предсказывайте типичные ответы, моделируйте экспертные оценки там, где это необходимо.

✅ *Совет: Стремитесь к ясности, точности и постоянному улучшению с каждой оценкой.*

---

## 📥 Промт для оценки

Вставьте промт, который вы хотите оценить, между тройными обратными кавычками (```), убедившись, что он является полным и готовым к проверке.

[Timestamp: 2025/05/23 22:56:33]