
#v_vuejs
#vuejs

#telegram 

# !!!!! я тут попутал типы и вместо options смотрел components
<!-- basicblock-start oid="Obs5PjohgbpyZFS29UijXS23"  deck='v_vuejs' -->
!!!!! я тут попутал типы и вместо options смотрел components::


<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Что можно сказать про жизненный цикл и ссылки в шаблонах?
<!-- basicblock-start oid="ObskfKE6qu0eCkPDPAUAF8Cj"  deck='v_vuejs' -->
Что можно сказать про жизненный цикл и ссылки в шаблонах?::


До сих пор Vue выполнял все обновления DOM за нас, благодаря реактивности и декларативному рендерингу. Однако могут быть случаи, когда нам потребуется работать с DOM вручную.

Мы можем обратиться к template ref, который является ссылкой на элемент в шаблоне, используя специальный атрибут ref:

```
<p ref="pElementRef">привет</p>
```

Элемент будет доступен в this.$refs как this.$refs.pElementRef. Однако доступ к нему возможен только после того, как компонент будет смонтирован.

Для выполнения кода после монтирования, мы можем использовать параметр mounted:

```
export default {
  mounted() {
    // компонент теперь смонтирован.
  }
}
```

Это называется хуком жизненного цикла, позволяющего нам указать функцию обратного вызова в определенные моменты жизненного цикла компонента. Также существуют другие хуки, такие как created и updated. Чтобы узнать больше, просмотрите Диаграмму жизненного цикла.

Теперь попробуйте добавить хук mounted для того, чтобы получить доступ к <p> через this.$refs.pElementRef и выполните любые операции с DOM (например, измените его textContent).
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Как выглядит пример с работой вычисляемого свойства?
<!-- basicblock-start oid="Obsp3U7YJQnyxdqMFtC9s2D4"  deck='v_vuejs' -->
Как выглядит пример с работой вычисляемого свойства?::


```
<script>
let id = 0

export default {
  data() {
    return {
      newTodo: '',
      hideCompleted: false,
      todos: [
        { id: id++, text: 'Изучить HTML', done: true },
        { id: id++, text: 'Изучить JavaScript', done: true },
        { id: id++, text: 'Изучить Vue', done: false }
      ]
    }
  },
  computed: {
    // ...
    filteredTodos() {
      return this.hideCompleted 
        ?  this.todos.filter(item => {item.done})
        : this.todos
        
    }
  },
  methods: {
    addTodo() {
      this.todos.push({ id: id++, text: this.newTodo, done: false })
      this.newTodo = ''
    },
    removeTodo(todo) {
      this.todos = this.todos.filter((t) => t !== todo)
    }
  }
}
</script>

<template>
  <form @submit.prevent="addTodo">
    <input v-model="newTodo" required placeholder="new todo">
    <button>Добавить задачу</button>
  </form>
  <ul>
    <li v-for="todo in filteredTodos" :key="todo.id">
      <input type="checkbox" v-model="todo.done">
      <span :class="{ done: todo.done }">{{ todo.text }}</span>
      <button @click="removeTodo(todo)">X</button>
    </li>
  </ul>
  <button @click="hideCompleted = !hideCompleted">
    {{ hideCompleted ? 'Показать все' : 'Скрыть выполненные' }}
  </button>
</template>

<style>
.done {
  text-decoration: line-through;
}
</style>
```
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Что делает вычисляемое свойство?
<!-- basicblock-start oid="ObsvbzlumAKdq79DBntrGP2G"  deck='v_vuejs' -->
Что делает вычисляемое свойство?::


Вычисляемое свойство отслеживает другие реактивные состояния, используемые при его вычислении, в качестве зависимостей. Оно кэширует результат и автоматически обновляет его при изменении зависимостей.
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Что можно сказать про вычисляемые свойства?
<!-- basicblock-start oid="ObstBWeo02HjJWF2HbScLYaN"  deck='v_vuejs' -->
Что можно сказать про вычисляемые свойства?::


Вычисляемые свойства 
Продолжим работу над списком задач, составленным на предыдущем шаге. Здесь мы уже добавили функцию переключения для каждой задачи. Для этого мы добавили свойство done к каждому объекту todo и с помощью v-model привязали его к чекбоксу:

```
<li v-for="todo in todos">
  <input type="checkbox" v-model="todo.done">
  ...
</li>
```

Следующее улучшение, которое мы можем добавить - это возможность скрывать уже выполненные задания. У нас уже есть кнопка, которая переключает состояние hideCompleted. Но как отобразить различные элементы списка в зависимости от этого состояния?

Встречайте вычисляемое свойство. Мы можем объявить свойство, которое реактивно вычисляется из других свойств с помощью параметра computed:

```
export default {
  // ...
  computed: {
    filteredTodos() {
      // возвращает отфильтрованные по `this.hideCompleted` задачи
    }
  }
}

```

```
- <li v-for="todo in todos">
+ <li v-for="todo in filteredTodos">
```

Вычисляемое свойство отслеживает другие реактивные состояния, используемые при его вычислении, в качестве зависимостей. Оно кэширует результат и автоматически обновляет его при изменении зависимостей.

Теперь попробуйте добавить вычисляемое свойство filteredTodos и реализовать его логику! Если все реализовано правильно, то отметив задачу как выполненную, она должна быть мгновенно скрыта из списка задач.
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Как выглядит пример vue рендеринга списков?
<!-- basicblock-start oid="ObsVibUAxodTn5JkzzoyNb4V"  deck='v_vuejs' -->
Как выглядит пример vue рендеринга списков?::


```
<script>
// выдаем всем todo уникальные id
let id = 0

export default {
  data() {
    return {
      newTodo: '',
      todos: [
        { id: id++, text: 'Изучить HTML' },
        { id: id++, text: 'Изучить JavaScript' },
        { id: id++, text: 'Изучить Vue' }
      ]
    }
  },
  methods: {
    addTodo() {
      this.todos.push({ id: id++, text: this.newTodo })
      this.newTodo = ''
    },
    removeTodo(todo) {
      this.todos = this.todos.filter((t) => t !== todo)
    }
  }
}
</script>

<template>
  <form @submit.prevent="addTodo">
    <input v-model="newTodo" required placeholder="new todo">
    <button>Добавить задачу</button>
  </form>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      {{ todo.text }}
      <button @click="removeTodo(todo)">X</button>
    </li>
  </ul>
</template>
```
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Как выглядит мой пример рендеринга списков todo?
<!-- basicblock-start oid="ObsFSReaKZwwU85Ru9TGiZBh"  deck='v_vuejs' -->
Как выглядит мой пример рендеринга списков todo?::


```
<script>
// выдаем всем todo уникальные id
let id = 0

export default {
  data() {
    return {
      newTodo: '',
      todos: [
        { id: id++, text: 'Изучить HTML' },
        { id: id++, text: 'Изучить JavaScript' },
        { id: id++, text: 'Изучить Vue' }
      ]
    }
  },
  methods: {
    addTodo() {
      this.todos.push({id: id++, text: this.newTodo})
    },
    removeTodo(todo) {
      // ...
      let clickedId = todo.id;
      this.todos = this.todos.filter((item,index) => {
        if (item.id != clickedId) {
          return true;
        }
      })
    }
  }
}
</script>

<template>
  <form @submit.prevent="addTodo">
    <input :value="newTodo" disabled>
    <input v-model="newTodo" required placeholder="new todo">
    <button>Добавить задачу</button>
  </form>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      {{ todo.text }}
      <button @click="removeTodo(todo)">X</button>
    </li>
  </ul>
</template>
```
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Что можно скзать про Рендеринг списков 
<!-- basicblock-start oid="ObshBKxrarHJjP1EUElhEE0v"  deck='v_vuejs' -->
Что можно скзать про Рендеринг списков ::


Можно использовать директиву v-for для вывода списка элементов на основе исходного массива:

```
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

Здесь todo - локальная переменная, представляющая элемент массива, по которому в данный момент выполняется итерация. Она доступна только в элементе v-for или внутри него, подобно области видимости функции.

Обратите внимание, что здесь также присваиваем каждому объекту todo уникальный id и связываем его как [специальный атрибут](https://vuejs-doc-ru.vercel.app/api/built-in-special-attributes#key) key для каждого <li>. key позволяет Vue точно перемещать каждый <li>, чтобы он соответствовал положению соответствующего объекта в массиве.

Существует два способа обновления списка:

Существует два способа обновления списка:

    Вызов [мутирующих](https://stackoverflow.com/questions/9009879/which-javascript-array-functions-are-mutating) методов в исходном массиве:

Замена массива на новый:

```
this.todos = this.todos.filter(/* ... */)
```

Здесь у нас есть простой список todo - попробуйте реализовать логику для методов addTodo() и removeTodo(), чтобы заставить его работать!

Подробнее о v-for: 
```
https://vuejs-doc-ru.vercel.app/guide/essentials/list.html
```
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Как выглядит пример условного рендеринга во vue?
<!-- basicblock-start oid="ObsBZokpuzSwLpW33OmGqHHN"  deck='v_vuejs' -->
Как выглядит пример условного рендеринга во vue?::


```
<script>
export default {
  data() {
    return {
      awesome: true
    }
  },
  methods: {
    toggle() {
      // ...
      this.awesome = !this.awesome
    }
  }
}
</script>

<template>
  <button @click="toggle">Переключить</button>
  <h1 v-if="awesome">Vue - это потрясающе!</h1>
  <h1 v-if="!awesome">О нет 😢</h1>
</template>
```
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Что можно сказать про условный рендеринг?
<!-- basicblock-start oid="Obszhwge5PXeMHCNlFs2tgII"  deck='v_vuejs' -->
Что можно сказать про условный рендеринг?::


Условный рендеринг 

Мы можем использовать директиву v-if для условного отображения элемента:

```
<h1 v-if="awesome">Vue - это потрясающе!</h1>
```

Это <h1> будет отображаться только в том случае, если значение awesome равно truthy. Если awesome изменится на значение falsy, оно будет удалено из DOM. Также можно использовать v-else и v-else-if для обозначения других ветвей условия:

```
<h1 v-if="awesome">Vue - это потрясающе!</h1>
<h1 v-else>О нет 😢</h1>
```

В настоящее время демонстрация показывает оба <h1> одновременно, а кнопка ничего не делает. Попробуйте добавить к ним директивы v-if и v-else и реализовать метод toggle(), чтобы можно было использовать кнопку для переключения между ними.
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Как выглядит пример привязки форм vuejs?
<!-- basicblock-start oid="Obs59hohyUvocvHv1FKBfprk"  deck='v_vuejs' -->
Как выглядит пример привязки форм vuejs?::


```
<script>
export default {
  data() {
    return {
      text: ''
    }
  },
  methods: {
    onInput(e) {
      this.text = e.target.value
    }
  }
}
</script>

<template>
  <input :value="text" @input="onInput" placeholder="Пишите тут">
  <input v-model="text" placeholder="Пишите тут" disabled>
  <p>{{ text }}</p>
</template>
```
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Что можно сказать про привязки форм vue?
<!-- basicblock-start oid="ObsonTGIUq6niIaOc7ZUhLSz"  deck='v_vuejs' -->
Что можно сказать про привязки форм vue?::


Привязки форм 

Используя v-bind и v-on вместе, можно создавать двусторонние привязки для элементов ввода формы:

```
<input :value="text" @input="onInput">
```

```
methods: {
  onInput(e) {
    // обработчик v-on получает собственное событие DOM.
    // в качестве аргумента.
    this.text = e.target.value
  }
}
```

Попробуйте ввести текст в поле ввода - вы должны увидеть, как текст в <p> обновляется по мере ввода.

Чтобы упростить двустороннее связывание, Vue предоставляет директиву v-model, которая, по сути, является синтаксическим сахаром для вышеописанного:

```
<input v-model="text">
```

v-model автоматически синхронизирует значение <input> с привязанным состоянием, поэтому больше не нужно использовать для этого обработчик событий.

v-model работает не только с текстовым вводом, но и с другими типами ввода, такими как чекбоксы, радио кнопки и выпадающие списки выбора (селекты). Более подробно об этом рассказывается в [Привязки направляющих форм](https://vuejs-doc-ru.vercel.app/guide/essentials/forms.html).

Теперь попробуйте отрефакторить код, чтобы вместо него использовать v-model.
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Как выглядит пример прослушки событий vuejs?
<!-- basicblock-start oid="ObsMVur3a3Cg2yq5LEgPcTlt"  deck='v_vuejs' -->
Как выглядит пример прослушки событий vuejs?::


```
<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++;
    }
  }
}
</script>

<template>
  <!-- сделайте так, чтобы кнопка работала -->
  <button @click=increment>Количество: {{ count }}</button>
</template>
```
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Что можно сказать про слушатели событий vue?
<!-- basicblock-start oid="ObsYaZeuVNJBnjEL0pQRF7JH"  deck='v_vuejs' -->
Что можно сказать про слушатели событий vue?::


Слушатели событий 
Мы можем прослушивать события DOM, используя директиву v-on:
```
<button v-on:click="increment">{{ count }}</button>
```

Из-за его частого использования v-on также имеет сокращенный синтаксис:

```
<button @click="increment">{{ count }}</button>
```

Здесь increment ссылается на функцию, объявленную с использованием опции methods:

```
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // обновление состояния компонента
      this.count++
    }
  }
}
```

Внутри метода можно получить доступ к экземпляру компонента, используя this. Экземпляр компонента раскрывает свойства данных, объявленные в data. Можно обновлять состояние компонента, изменяя эти свойства.

Обработчики событий также могут использовать встроенные выражения и могут упростить общие задачи с помощью модификаторов. Эти подробности рассматриваются в [Руководстве - Обработка событий](https://vuejs-doc-ru.vercel.app/guide/essentials/event-handling.html).

Теперь попробуйте самостоятельно реализовать increment метод и привязать ее к кнопке с помощью v-on.
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Как выглядит пример связывания атрибутов vuejs?
<!-- basicblock-start oid="ObsRN5RfEV8vZLHNkDN5yGD9"  deck='v_vuejs' -->
Как выглядит пример связывания атрибутов vuejs?::


```
<script>
export default {
  data() {
    return {
      titleClass: 'title'
    }
  }
}
</script>

<template>
  <h1 v-bind:class="titleClass">Сделай меня красным</h1> <!-- Добавьте сюда динамическую привязку класса -->
</template>

<style>
.title {
  color: red;
}
</style>
```
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Как работает связывание атрибутов vue?
<!-- basicblock-start oid="Obs2AQmIJxAK4BO7hegLxL68"  deck='v_vuejs' -->
Как работает связывание атрибутов vue?::


Связывание атрибутов 

Во Vue синтаксис двойных фигурных скобок используется только для интерполяции текста. Чтобы привязать атрибут к динамическому значению, мы используем директиву v-bind:

```
<div v-bind:id="dynamicId"></div>
```

Директива - это специальный атрибут, который начинается с префикса v-. Они являются частью синтаксиса шаблонов Vue. Подобно текстовым интерполяциям, значения директив представляют собой выражения JavaScript, которые имеют доступ к состоянию компонента. Полная информация о v-bind и синтаксисе директивы обсуждается в [Руководство — синтаксис шаблона.](https://vuejs-doc-ru.vercel.app/guide/essentials/template-syntax.html)

Часть после двоеточия (:id) является "аргументом" директивы. Здесь атрибут id элемента будет синхронизирован со свойством dynamicId из состояния компонента.

Поскольку v-bind используется так часто, у него есть специальный сокращенный синтаксис:

```
<div :id="dynamicId"></div>
```

Теперь попробуйте добавить динамическую привязку class к <h1>, используя в качестве значения свойство titleClass data. Если привязка выполнена правильно, текст должен стать красным.
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Какие главные фундаментальные особенности vue?
<!-- basicblock-start oid="ObsvbNEM9lGs0aBFAXmHxhMO"  deck='v_vuejs' -->
Какие главные фундаментальные особенности vue?::


Пример выше демонстрирует две главные фундаментальные особенности Vue:

    Декларативная отрисовка: Vue расширяет стандартный HTML синтаксисом шаблонов, который позволяет декларативно описывать финальный HTML на основе состояния JavaScript.

    Реактивность: Vue автоматически отслеживает изменения состояния JavaScript и эффективно обновляет DOM, когда происходят изменения.
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Какое состояние называется реактивным?
<!-- basicblock-start oid="Obsv4DL6rA4zHKChVdGF5sMm"  deck='v_vuejs' -->
Какое состояние называется реактивным?::


Состояние, которое может запускать обновления при изменении, считается реактивным. Во Vue реактивное состояние сохраняется в компонентах.
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Что является основной особенностью vue?
<!-- basicblock-start oid="ObsUoE2ySojvfWmkwHqFjkJh"  deck='v_vuejs' -->
Что является основной особенностью vue?::


Основной особенностью Vue является декларативный рендеринг: используя синтаксис шаблонов, расширяющий HTML, мы можем описать, как должен выглядеть HTML на основе состояния JavaScript. Когда состояние меняется, HTML обновляется автоматически.
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# С помощью каких двух различных стилей можно можно создавать компоненты vue?
<!-- basicblock-start oid="Obs9REHjBsk2U1984ST77307"  deck='v_vuejs' -->
С помощью каких двух различных стилей можно можно создавать компоненты vue?::


Компоненты Vue можно создавать с использованием двух различных стилей: Options API и Composition API.
<!-- basicblock-end -->




#v_vuejs
#vuejs

#telegram 

# Что можно сказать про однофайловые компоненты vue?
<!-- basicblock-start oid="ObsmOIwPxhsIkZyS4ebt5StW"  deck='v_vuejs' -->
Что можно сказать про однофайловые компоненты vue?::


В большинстве проектов Vue, где есть шаг сборки, компоненты Vue создаются с использованием файлов HTML-подобного формата, называемого однофайловыми компонентами (также известного как *.vue файлы, сокращённо называемых SFC). Однофайловые компоненты Vue, как следует из названия, объединяют в себе логику компонента (JavaScript), шаблон (HTML) и стили (CSS) в одном файле. Вот предыдущий пример, написанный в формате однофайлового компонента:

```
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">Счётчик: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

Однофайловые компоненты — отличительная особенность Vue и рекомендуемый способ создания компонентов Vue, если сценарий использования предполагает шаг сборки. Подробнее можно узнать в отдельном разделе как и почему SFC — но сейчас достаточно знать, что Vue будет заниматься настройкой всех инструментов сборки для вас.
<!-- basicblock-end -->



