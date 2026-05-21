---
author: Frolov Anatolui
date: 2024-11-08
time: 07:11:25
aliases: 
- 
tags:
- unique-note
---
Отлично, если у вас есть собственный API для работы с календарем и вы хотите интегрировать его с Vue.js, то вы можете полностью контролировать обработку данных, не полагаясь на сторонние библиотеки календарей.

Давайте создадим пример **SPA календаря** с использованием Vue.js, который будет взаимодействовать с вашим собственным API для получения и отображения событий, а также для добавления новых событий.

### Шаг 1: Создание проекта Vue.js

Если у вас еще нет проекта на Vue, создайте его с помощью Vue CLI:

1. Установите Vue CLI (если он еще не установлен):

   ```bash
   npm install -g @vue/cli
   ```

2. Создайте новый проект:

   ```bash
   vue create vue-calendar-app
   cd vue-calendar-app
   ```

3. Выберите настройки по умолчанию для проекта.

4. Запустите проект:

   ```bash
   npm run serve
   ```

Теперь у вас есть базовое приложение Vue, работающее на `http://localhost:8080`.

### Шаг 2: Структура проекта

Организуем структуру проекта:

```
/src
  /components
    Calendar.vue
  /services
    calendarService.js
  App.vue
  main.js
```

### Шаг 3: Создание сервиса для работы с API

Создайте сервис, который будет взаимодействовать с вашим API для получения, добавления и удаления событий.

Создайте файл `src/services/calendarService.js`:

```javascript
import axios from 'axios';

const API_URL = 'https://your-calendar-api.com'; // Замените на ваш API URL

export default {
  // Получить все события
  getEvents() {
    return axios.get(`${API_URL}/events`);
  },

  // Добавить новое событие
  addEvent(event) {
    return axios.post(`${API_URL}/events`, event);
  },

  // Удалить событие
  deleteEvent(eventId) {
    return axios.delete(`${API_URL}/events/${eventId}`);
  }
};
```

В этом сервисе мы определили три метода:

- `getEvents()`: для получения всех событий.
- `addEvent(event)`: для добавления нового события.
- `deleteEvent(eventId)`: для удаления события по ID.

### Шаг 4: Создание компонента календаря

Теперь создадим компонент календаря, который будет отображать календарь и события, а также позволит добавлять новые события.

Создайте файл `src/components/Calendar.vue`:

```vue
<template>
  <div class="calendar">
    <h1>Календарь</h1>
    <div>
      <button @click="addEventFormVisible = !addEventFormVisible">
        {{ addEventFormVisible ? 'Закрыть форму' : 'Добавить событие' }}
      </button>

      <!-- Форма добавления события -->
      <div v-if="addEventFormVisible">
        <input v-model="newEventTitle" placeholder="Название события" />
        <input type="date" v-model="newEventDate" />
        <button @click="saveEvent">Сохранить событие</button>
      </div>
    </div>

    <!-- Календарь -->
    <div class="calendar-view">
      <h2>{{ currentMonthName }} {{ currentYear }}</h2>
      <div class="calendar-grid">
        <div v-for="day in daysInMonth" :key="day" class="calendar-day">
          <span>{{ day }}</span>
          <div v-for="event in events.filter(e => new Date(e.date).getDate() === day)" :key="event.id" class="event">
            <span>{{ event.title }}</span>
            <button @click="deleteEvent(event.id)">Удалить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import calendarService from '@/services/calendarService';

export default {
  data() {
    return {
      currentDate: new Date(),
      events: [], // Список событий
      newEventTitle: '', // Название нового события
      newEventDate: '', // Дата нового события
      addEventFormVisible: false, // Флаг отображения формы добавления события
    };
  },
  computed: {
    currentMonthName() {
      const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ];
      return monthNames[this.currentDate.getMonth()];
    },
    currentYear() {
      return this.currentDate.getFullYear();
    },
    daysInMonth() {
      const date = new Date(this.currentYear, this.currentDate.getMonth() + 1, 0);
      const days = [];
      for (let i = 1; i <= date.getDate(); i++) {
        days.push(i);
      }
      return days;
    }
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await calendarService.getEvents();
        this.events = response.data;
      } catch (error) {
        console.error('Ошибка при получении событий', error);
      }
    },
    async saveEvent() {
      if (!this.newEventTitle || !this.newEventDate) {
        alert('Пожалуйста, заполните все поля!');
        return;
      }

      const newEvent = {
        title: this.newEventTitle,
        date: this.newEventDate,
      };

      try {
        await calendarService.addEvent(newEvent);
        this.newEventTitle = '';
        this.newEventDate = '';
        this.addEventFormVisible = false;
        await this.fetchEvents(); // Обновить список событий
      } catch (error) {
        console.error('Ошибка при добавлении события', error);
      }
    },
    async deleteEvent(eventId) {
      try {
        await calendarService.deleteEvent(eventId);
        this.fetchEvents(); // Обновить список событий
      } catch (error) {
        console.error('Ошибка при удалении события', error);
      }
    }
  },
  mounted() {
    this.fetchEvents(); // Загружаем события при монтировании компонента
  }
};
</script>

<style scoped>
.calendar {
  text-align: center;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-top: 20px;
}

.calendar-day {
  border: 1px solid #ccc;
  padding: 10px;
}

.event {
  background-color: #ffeb3b;
  padding: 5px;
  margin-top: 5px;
}

button {
  margin: 5px;
}
</style>
```

### Объяснение компонентов и методов:

- **Компонент `Calendar.vue`**:
  - Отображает календарь текущего месяца с датами.
  - Показана форма для добавления события (название и дата).
  - Для каждого дня отображаются события, которые происходят в этот день.
  - При клике на кнопку "Добавить событие" открывается форма для ввода.
  - С помощью кнопки "Удалить" можно удалять события.

- **Методы**:
  - `fetchEvents`: получает события из вашего API и отображает их.
  - `saveEvent`: добавляет новое событие в API и обновляет список.
  - `deleteEvent`: удаляет событие по ID и обновляет список.

### Шаг 5: Использование компонента в `App.vue`

Теперь подключите компонент `Calendar` в главный компонент `App.vue`:

```vue
<template>
  <div id="app">
    <Calendar />
  </div>
</template>

<script>
import Calendar from './components/Calendar.vue';

export default {
  name: 'App',
  components: {
    Calendar
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

### Шаг 6: Запуск приложения

Теперь вы можете запустить приложение:

```bash
npm run serve
```

Перейдите по адресу `http://localhost:8080` и протестируйте ваш календарь, который взаимодействует с вашим собственным API для получения и добавления событий.

### Дополнительные улучшения

1. **Сортировка событий**: Можете сортировать события по дате или другим параметрам.
2. **Валидация данных**: Добавьте дополнительные проверки на корректность данных, таких как проверка даты события или уникальности заголовка.
3. **Поддержка других видов отображения**: Можно добавить переключение между видами (день, неделя, месяц) для более гибкого отображения календаря.
4. **Интернационализация (i18n)**: Для поддержки нескольких языков добавьте локализацию.

Это базовый пример создания календаря с Vue.js, который взаимодействует с вашим API для работы с событиями. Вы можете развивать его в зависимости от ваших потребностей!

