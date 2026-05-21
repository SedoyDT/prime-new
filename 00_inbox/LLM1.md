Ниже — **готовый семантически плотный “супер-запрос”**, который можно вставить в ChatGPT как постановку задачи для получения архитектурного плана системы.

Он уже оптимизирован под: LLM-архитектуру, агентов, RAG, event-driven слой, автономную разработку, сценарии co-work.

---

# 📌 MASTER PROMPT (AI System Design / Autonomous Dev OS)

Ты — **архитектор распределённых AI-систем уровня staff+**, специализация:

- multi-agent systems
    
- event-driven architectures
    
- LLM orchestration (RAG + tool use + codegen)
    
- автономные dev pipelines
    

Твоя задача — спроектировать **AISD (AI-Integrated Self-Developing system)**: автономную систему разработки, где человек выступает как визионер, а система — как исполнитель + ко-воркер.

---

# 🎯 ЦЕЛЬ СИСТЕМЫ

Создать инфраструктуру, где:

1. Пользователь (визионер) задаёт намерения, идеи, задачи
    
2. AI:
    
    - генерирует идеи из входных потоков (заметки / аудио / текст / интернет)
        
    - приоритизирует задачи по ценностям и ресурсам
        
    - проектирует и создаёт код
        
    - валидирует результаты
        
    - ведёт разработку автономно в отдельных ветках
        
    - документирует всё
        
    - предлагает инструкции пользователю только когда требуется участие
        
3. Система работает в 2 режимах:
    
    - **Co-work mode** (человек + AI синхронно)
        
    - **Autonomous mode** (AI работает параллельно и асинхронно)
        

---

# 🧠 КЛЮЧЕВОЕ ТРЕБОВАНИЕ

AI НЕ должен:

- мешать пользователю
    
- блокировать процесс
    
- запрашивать подтверждение на каждое действие
    

AI ДОЛЖЕН:

- действовать автономно в sandbox/branch
    
- фиксировать изменения
    
- генерировать инструкции только при необходимости вмешательства
    

---

# 🧱 СТЕК СИСТЕМЫ (L0)

Опиши архитектуру с учётом:

- LLM: Qwen3-30B-A3B-2507 (локально LM Studio)
    
- Whisper (speech-to-text)
    
- Coqui TTS
    
- OpenHands / Codex (code agents)
    
- Postgres (state + memory)
    
- Redis (cache + state)
    
- NATS (event bus)
    
- Docker (изоляция)
    
- Git (multi-branch execution)
    
- Tailscale (network layer)
    

---

# 🧠 АГЕНТНАЯ СИСТЕМА (L1)

Опиши набор агентов:

- idea-generator (из заметок, аудио, текста)
    
- priority-keeper (ценностная модель приоритетов)
    
- idea-saver (структурирование в Postgres)
    
- dev-orchestrator (управление задачами разработки)
    
- feedback-analyzer (обратная связь + переоценка задач)
    
- prompt-engine (создание/улучшение промтов)
    
- prompt-refiner → prompt-validator → prompt-optimizer → prompt-archiver
    
- code-generator (OpenHands + Codex + Qwen)
    
- code-validator (тесты, безопасность, стиль, sanity checks)
    

Каждый агент:

- event-driven
    
- stateless execution + state in Postgres
    
- подписка на NATS события
    

---

# 🔄 ОРКЕСТРАЦИЯ (L2)

Опиши event-driven систему:

## Event Bus (NATS)

События:

- idea.created
    
- idea.prioritized
    
- task.generated
    
- dev.process.started
    
- code.generated
    
- code.validated
    
- feedback.collected
    
- deployment.ready
    

## Оркестрация:

- scheduler запускает pipeline
    
- workers выполняют задачи
    
- dev-orchestrator управляет workflow
    
- каждый шаг может запускаться параллельно
    

---

# 🧪 RAG СЛОЙ

Система памяти:

- заметки Obsidian → ingestion pipeline
    
- транскрипции Whisper → структурирование
    
- теги + embeddings
    
- retrieval:
    
    - semantic search
        
    - context assembly
        
    - prompt injection control
        

RAG используется для:

- генерации идей
    
- анализа приоритетов
    
- генерации кода
    
- восстановления контекста проекта
    

---

# 🧠 PROMPT ENGINEERING PIPELINE

Опиши цепочку:

1. prompt-refiner (очистка + структура)
    
2. prompt-validator (проверка на противоречия)
    
3. prompt-optimizer (минимизация токенов + усиление смысла)
    
4. prompt-archiver (сохранение успешных промтов)
    

---

# 💻 CODE GENERATION PIPELINE

code-generator:

- принимает task spec
    
- генерирует структуру проекта
    
- создаёт код через:
    
    - OpenHands
        
    - Codex-like agent
        
    - Qwen3-30B fallback
        
- создаёт отдельную git branch
    
- запускает тесты
    
- передаёт результат code-validator
    

code-validator:

- unit tests
    
- linting
    
- security scan (basic heuristic)
    
- sanity checks
    
- возвращает статус:
    
    - approved
        
    - needs fix
        
    - partial
        

---

# 🔁 СЦЕНАРИИ РАБОТЫ

## Сценарий A (co-work mode)

- пользователь пишет задачу
    
- AI:
    
    - предлагает улучшения
        
    - параллельно начинает реализацию в отдельной ветке
        
    - не мешает основному потоку
        
- пользователь может:
    
    - принять изменения
        
    - игнорировать
        
    - слить позже
        

---

## Сценарий B (autonomous mode)

- пользователь задаёт цель или папку проекта
    
- AI:
    
    - создаёт структуру проекта
        
    - инициализирует репозиторий
        
    - пишет README + архитектуру
        
    - запускает dev pipeline
        
    - пишет код без участия пользователя
        
    - создаёт инструкции:
        
        - “что сделано”
            
        - “что нужно проверить”
            
        - “что дальше”
            

---

# 🧩 UX СИСТЕМЫ

Интеграции:

- Telegram bot (контроль задач)
    
- Web UI (dashboard проектов)
    
- iOS push (события)
    
- CLI tool (локальная работа)
    

---

# 💰 МОНЕТИЗАЦИЯ

Опиши модели:

- шаблоны AI-систем (selling system blueprints)
    
- подписка на AI dev assistant
    
- RAG packs (knowledge systems)
    
- workflow automation kits
    
- dev pipelines as a service
    

Цель: 200 000 руб/мес к 2027  
Фокус: пассивные доходы, минимальное участие

---

# ⚙️ ОГРАНИЧЕНИЯ

- система должна быть модульной
    
- event-driven обязательно
    
- все агенты независимы
    
- никакого централизованного монолита
    
- поддержка масштабирования
    
- Docker-first architecture
    
- git-first development workflow
    

---

# 📦 РЕЗУЛЬТАТ ОТ ТЕБЯ (LLM)

Сформируй:

1. Архитектуру (L0–L3)
    
2. Схему агентов
    
3. Event flow diagram (описательно)
    
4. Pipeline разработки
    
5. MVP план на 8 часов (очень конкретный)
    
6. Риски и узкие места
    
7. Минимальный стартовый стек (что реально собрать сегодня)
    

---

# 🧠 КРИТЕРИЙ УСПЕХА

Система должна:

- уменьшать когнитивную нагрузку пользователя
    
- позволять параллельную разработку AI и человека
    
- быть расширяемой до production-scale
    
- работать даже при минимальном вмешательстве
    

---

Если ты захочешь, следующим шагом можно из этого сделать:

- реальный repo structure (готовый GitHub scaffold)
    
- docker-compose для L0
    
- NATS event schema
    
- или MVP за 8 часов с конкретными файлами
    

Но это уже следующий уровень боли для железа и времени 😏