# 🧠 Что ты уже сделал

Ты собрал базовый локальный LLM runtime:

```text
Python → OpenAI SDK → LM Studio → локальная модель → ответ
```

Это уже не “чатик”, а основа агентной системы.

---

# ⚙️ Что ты настроил

## 1. Локальный inference server

Ты использовал:

- LM Studio
    
- OpenAI-compatible API
    

---

## Что это даёт

Любая программа может обращаться к локальной модели так же, как к OpenAI API:

```python
client.chat.completions.create(...)
```

---

# 2. Локальная модель

Ты тестировал:

- Qwen2.5-7B-Instruct-1M-GGUF
    
- Qwen2.5-Coder-7B-Instruct-MLX-4bit
    

---

# 🧠 Что важно понимать

## GGUF

Формат модели для inference через llama.cpp-style runtime.

### Плюсы:

- стабильность
    
- хороший контроль памяти
    
- mature ecosystem
    

---

## MLX

Apple Silicon runtime/framework.

### Плюсы:

- быстрее на Mac
    
- лучше использует Metal GPU
    
- низкая latency
    

---

# ⚙️ Quantization

Ты изучал:

```text
Q4_K_M
```

---

# Что это

Сжатие весов модели.

---

# Почему это важно

Без quantization:

|формат|память|скорость|
|---|---|---|
|FP16|огромная|медленно|
|Q4|маленькая|быстро|

---

# Что означает `Q4_K_M`

|часть|смысл|
|---|---|
|Q4|4-bit веса|
|K|improved quantization|
|M|medium preset|

---

# Что могут спросить на собеседовании

## ❓ “Почему Q4_K_M?”

### Нормальный ответ:

> Это хороший компромисс между качеством и latency для локального inference. Для агентных систем скорость итераций часто важнее максимального качества модели.

---

# ⚙️ GPU Offload

Ты выставлял:

```text
GPU Offload = MAX
```

---

# Что это делает

Переносит слои модели:

- с CPU
    
- на GPU (Metal на Mac)
    

---

# Почему это важно

LLM inference = matrix multiplication.

GPU делает это намного быстрее.

---

# Что могут спросить

## ❓ “Почему inference ускоряется?”

Потому что:

- GPU massively parallel
    
- CPU плохо подходит для tensor operations
    

---

# ⚙️ Context Length

Ты уменьшал:

```text
2048
```

---

# Что это

Максимальный размер контекста модели.

---

# Почему большой context медленный

Чем больше context:

- тем больше KV-cache
    
- тем выше memory pressure
    
- тем медленнее prefill phase
    

---

# Что могут спросить

## ❓ “Почему 1M context плох для latency?”

Потому что модель оптимизирована под giant-context workloads:

- больше KV infrastructure
    
- выше prefill cost
    
- хуже interactive latency
    

---

# ⚙️ CPU Thread Pool Size

Ты ставил:

```text
10
```

---

# Что это

Количество CPU потоков inference runtime.

---

# Что важно знать

Больше потоков ≠ быстрее.

На Apple Silicon:

- scheduler уже умный
    
- слишком много threads → contention
    

---

# ⚙️ Evaluation Batch Size

Ты изучал:

```text
1
```

---

# Что это

Количество токенов/запросов, обрабатываемых за evaluation step.

---

# Важный момент

Batch size:

- почти не помогает одиночному запросу
    
- полезен для multi-agent systems
    

---

# ⚙️ Flash Attention

Ты включил:

```text
ON
```

---

# Что это

Оптимизированный attention algorithm.

---

# Почему важен

Attention — самый дорогой этап inference.

Flash Attention:

- уменьшает memory access
    
- ускоряет long-context inference
    

---

# ⚙️ mmap

Ты включил:

```text
ON
```

---

# Что это

Memory-mapped loading модели.

---

# Почему важно

Модель:

- не копируется полностью в RAM
    
- загружается эффективнее
    
- быстрее стартует
    

---

# 🧠 Что ты понял про агентные системы

Очень важный вывод:

## ❌ “самая умная модель” ≠ лучшая система

---

# Для агентов важнее:

|фактор|важность|
|---|---|
|latency|очень высокая|
|iteration speed|критично|
|orchestration|критично|
|memory system|важно|
|model IQ|важно, но не главное|

---

# 🧠 Что такое агент (технически)

Не “AI с сознанием”.

---

# Агент =

```text
LLM
+ prompt
+ tools
+ memory
+ loop
+ orchestration
```

---

# Что такое orchestration

Управление:

- ролями
    
- очередями
    
- состоянием
    
- взаимодействием агентов
    

---

# Что ты уже начал строить

Ты пошёл в сторону:

```text
planner → executor → critic
```

Это классическая multi-agent architecture.

---

# Что полезно знать дальше

## 1. Prefill vs Decode

### Prefill

Обработка входного prompt.

### Decode

Генерация новых токенов.

---

# Важно

Большой prompt:

- убивает prefill latency
    
- даже если ответ короткий
    

---

# 2. KV Cache

Модель хранит attention state:

- чтобы не пересчитывать всё заново
    

---

# Почему context дорогой

KV-cache растёт с длиной контекста.

---

# 3. Tokens/sec ≠ UX

Даже быстрые tok/sec:

- могут иметь плохой first-token latency
    

---

# 4. Streaming важен

```python
stream=True
```

---

# Почему

Пользователь видит ответ сразу.

---

# 5. Маленькие модели underrated

7B модели:

- surprisingly capable
    
- очень хороши для agent loops
    

---

# Что сейчас считается хорошим тоном в agent engineering

## Популярная схема:

|слой|модель|
|---|---|
|planner|small fast|
|executor|medium|
|critic|large|
|embeddings|separate model|

---

# 🧠 Самое важное что ты уже понял

Локальный AI — это:

```text
не “одна умная модель”
```

а:

```text
runtime + orchestration + memory + loops
```

И это уже ближе к настоящему agent engineering.

[[2026-05-07]]