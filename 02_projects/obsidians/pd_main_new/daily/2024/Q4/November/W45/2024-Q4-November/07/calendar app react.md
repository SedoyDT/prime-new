---
author: Frolov Anatolui
date: 2024-11-07
time: 19:11:07
aliases: 
- 
tags:
- unique-note
---


Чтобы начать проект с использованием **Redux** в **React**, нужно выполнить несколько шагов, включая установку необходимых библиотек, настройку хранилища (store), создание редьюсеров и подключение их к компонентам.

Вот пошаговое руководство по созданию проекта с Redux:

### Шаг 1: Создайте новый React-проект

Если у вас еще нет проекта на React, создайте его с помощью **Create React App**:

```bash
npx create-react-app my-redux-app
cd my-redux-app
```

### Шаг 2: Установите Redux и React-Redux

Теперь установим Redux и React-Redux (обертка для интеграции Redux с React):

```bash
npm install redux react-redux
```

### Шаг 3: Создайте структуру проекта

Организуем структуру проекта для Redux. Обычно структура выглядит так:

```
/src
  /actions
    counterActions.js
  /reducers
    counterReducer.js
    index.js (для комбинирования редьюсеров)
  /store
    store.js
  App.js
  index.js
```

### Шаг 4: Настройка Redux

#### 1. **Создайте действия (actions)**

В Redux, действия (actions) — это объекты, которые описывают, что должно произойти в приложении. Давайте создадим действия для инкремента и декремента счетчика.

Создайте файл `src/actions/counterActions.js`:

```javascript
// Действия для счетчика
export const increment = () => {
  return {
    type: 'INCREMENT',
  };
};

export const decrement = () => {
  return {
    type: 'DECREMENT',
  };
};
```

#### 2. **Создайте редьюсер (reducer)**

Редьюсер — это функция, которая определяет, как состояние изменяется в ответ на действия. Создадим редьюсер для управления состоянием счетчика.

Создайте файл `src/reducers/counterReducer.js`:

```javascript
// Редьюсер для счетчика
const initialState = {
  count: 0,
};

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1,
      };
    default:
      return state;
  }
};

export default counterReducer;
```

#### 3. **Комбинируйте редьюсеры (если их несколько)**

Если у вас несколько редьюсеров, их нужно объединить. Создайте файл `src/reducers/index.js`:

```javascript
import { combineReducers } from 'redux';
import counterReducer from './counterReducer';

const rootReducer = combineReducers({
  counter: counterReducer,
});

export default rootReducer;
```

#### 4. **Создайте хранилище (store)**

Теперь создадим хранилище Redux, которое будет хранить глобальное состояние. В файле `src/store/store.js` создайте хранилище:

```javascript
import { createStore } from 'redux';
import rootReducer from '../reducers';

const store = createStore(
  rootReducer,
  // Включите Redux DevTools для отладки, если используете браузер
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
```

### Шаг 5: Подключение Redux к React

Теперь нужно подключить Redux к вашему приложению.

#### 1. **Оборачиваем приложение в `Provider`**

Для того чтобы React компоненты могли получить доступ к состоянию Redux, нужно обернуть все приложение в компонент `Provider` из библиотеки `react-redux`. Сделаем это в файле `src/index.js`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/store'; // Импортируем store

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

#### 2. **Подключаем состояние и действия в компоненты**

Теперь можно подключить состояния и действия Redux к React-компонентам. Например, создадим простой компонент `App.js`, который будет отображать и изменять значение счетчика.

```javascript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Хуки для доступа к состоянию и отправки действий
import { increment, decrement } from './actions/counterActions'; // Импортируем действия

function App() {
  // Получаем значение счетчика из глобального состояния
  const count = useSelector(state => state.counter.count);
  
  // Получаем функцию для отправки действий
  const dispatch = useDispatch();

  return (
    <div className="App">
      <h1>Счетчик: {count}</h1>
      <button onClick={() => dispatch(increment())}>Инкремент</button>
      <button onClick={() => dispatch(decrement())}>Декремент</button>
    </div>
  );
}

export default App;
```

### Шаг 6: Запуск проекта

Теперь, когда все настроено, вы можете запустить проект:

```bash
npm start
```

Перейдите по адресу [http://localhost:3000](http://localhost:3000), и вы должны увидеть интерфейс с кнопками "Инкремент" и "Декремент", которые изменяют значение счетчика.

### Шаг 7: Дополнительные улучшения

1. **Добавление асинхронных действий**:
   Для асинхронных операций (например, запросов к серверу) используйте `redux-thunk` или `redux-saga`.
   
   Чтобы установить `redux-thunk`, выполните:
   ```bash
   npm install redux-thunk
   ```

   Затем примените middleware в вашем `store.js`:
   ```javascript
   import { createStore, applyMiddleware } from 'redux';
   import thunk from 'redux-thunk';
   import rootReducer from '../reducers';

   const store = createStore(
     rootReducer,
     applyMiddleware(thunk),
     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
   );
   ```

2. **Использование TypeScript**:
   Если вы хотите использовать TypeScript, просто создайте проект с `npx create-react-app my-app --template typescript`, и добавьте типизацию для состояний, действий и редьюсеров.

---

Теперь у вас есть работающий проект с Redux! Вы можете расширять его, добавлять новые редьюсеры, действия, а также улучшать архитектуру, используя различные подходы, такие как модули или срезы (slice).