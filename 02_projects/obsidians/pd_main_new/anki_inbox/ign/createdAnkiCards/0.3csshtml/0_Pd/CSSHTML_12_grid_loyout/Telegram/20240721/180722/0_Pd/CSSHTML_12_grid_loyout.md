
# Начало карточки

<!-- basicblock-start oid="ObsxrCmnq2bVMJFNyRApbj2w"  deck='0_Pd_CSSHTML_12_grid_loyout' -->
Как работает простой todo с draganddrop на html + js + css?::


```

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Список задач с drag & drop</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div class="container">
      <section class="tasks">
        <h1 class="tasks__title">To do list</h1>
        
        <ul class="tasks__list">
          <li class="tasks__item">learn HTML</li>
          <li class="tasks__item">learn CSS</li>
          <li class="tasks__item">learn JavaScript</li>
          <li class="tasks__item">learn PHP</li>
          <li class="tasks__item">stay alive</li>
        </ul>
      </section>
    </div>
    
    <script src="main.js"></script>
  </body>
</html
```


```

html, body {
  margin: 0;
  padding: 0;
}

body {
  font-family: "Tahoma", sans-serif;
  font-size: 18px;
  line-height: 25px;
  color: #164a44;
  
  background-color: #b2d9d0;
}

.container {
  display: flex;
  justify-content: center;
}

.tasks__title {
  margin: 50px 0 20px 0;
  
  text-align: center;
  text-transform: uppercase;
}

.tasks__list {
  margin: 0;
  padding: 0;
  
  list-style: none;
}

.tasks__item {
  max-width: 250px;
  margin-bottom: 10px;
  padding: 5px;
  
  text-align: center;
  border: 2px dashed #b2d9d0;
  border-radius: 10px;
  cursor: move;
  background-color: #dff2ef;

  transition: background-color 0.5s;
}

.tasks__item:last-child {
  margin-bottom: 0;
}

.selected {
  opacity: 0.6;
}
```


```

const tasksListElement = document.querySelector(`.tasks__list`);
const taskElements = tasksListElement.querySelectorAll(`.tasks__item`);

for (const task of taskElements) {
  task.draggable = true;
}

tasksListElement.addEventListener(`dragstart`, (evt) => {
  evt.target.classList.add(`selected`);
});

tasksListElement.addEventListener(`dragend`, (evt) => {
  evt.target.classList.remove(`selected`);
});

const getNextElement = (cursorPosition, currentElement) => {
  const currentElementCoord = currentElement.getBoundingClientRect();
  const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;
  
  const nextElement = (cursorPosition < currentElementCenter) ?
    currentElement :
    currentElement.nextElementSibling;
  
  return nextElement;
};

tasksListElement.addEventListener(`dragover`, (evt) => {
  evt.preventDefault();
  
  const activeElement = tasksListElement.querySelector(`.selected`);
  const currentElement = evt.target;
  const isMoveable = activeElement !== currentElement &&
    currentElement.classList.contains(`tasks__item`);
    
  if (!isMoveable) {
    return;
  }
  
  const nextElement = getNextElement(evt.clientY, currentElement);
  
  if (
    nextElement && 
    activeElement === nextElement.previousElementSibling ||
    activeElement === nextElement
  ) {
    return;
  }
  
 tasksListElement.insertBefore(activeElement, nextElement);
});
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Как работает простой todo с draganddrop на html + js + css?

```

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Список задач с drag & drop</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div class="container">
      <section class="tasks">
        <h1 class="tasks__title">To do list</h1>
        
        <ul class="tasks__list">
          <li class="tasks__item">learn HTML</li>
          <li class="tasks__item">learn CSS</li>
          <li class="tasks__item">learn JavaScript</li>
          <li class="tasks__item">learn PHP</li>
          <li class="tasks__item">stay alive</li>
        </ul>
      </section>
    </div>
    
    <script src="main.js"></script>
  </body>
</html
```


```

html, body {
  margin: 0;
  padding: 0;
}

body {
  font-family: "Tahoma", sans-serif;
  font-size: 18px;
  line-height: 25px;
  color: #164a44;
  
  background-color: #b2d9d0;
}

.container {
  display: flex;
  justify-content: center;
}

.tasks__title {
  margin: 50px 0 20px 0;
  
  text-align: center;
  text-transform: uppercase;
}

.tasks__list {
  margin: 0;
  padding: 0;
  
  list-style: none;
}

.tasks__item {
  max-width: 250px;
  margin-bottom: 10px;
  padding: 5px;
  
  text-align: center;
  border: 2px dashed #b2d9d0;
  border-radius: 10px;
  cursor: move;
  background-color: #dff2ef;

  transition: background-color 0.5s;
}

.tasks__item:last-child {
  margin-bottom: 0;
}

.selected {
  opacity: 0.6;
}
```


```

const tasksListElement = document.querySelector(`.tasks__list`);
const taskElements = tasksListElement.querySelectorAll(`.tasks__item`);

for (const task of taskElements) {
  task.draggable = true;
}

tasksListElement.addEventListener(`dragstart`, (evt) => {
  evt.target.classList.add(`selected`);
});

tasksListElement.addEventListener(`dragend`, (evt) => {
  evt.target.classList.remove(`selected`);
});

const getNextElement = (cursorPosition, currentElement) => {
  const currentElementCoord = currentElement.getBoundingClientRect();
  const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;
  
  const nextElement = (cursorPosition < currentElementCenter) ?
    currentElement :
    currentElement.nextElementSibling;
  
  return nextElement;
};

tasksListElement.addEventListener(`dragover`, (evt) => {
  evt.preventDefault();
  
  const activeElement = tasksListElement.querySelector(`.selected`);
  const currentElement = evt.target;
  const isMoveable = activeElement !== currentElement &&
    currentElement.classList.contains(`tasks__item`);
    
  if (!isMoveable) {
    return;
  }
  
  const nextElement = getNextElement(evt.clientY, currentElement);
  
  if (
    nextElement && 
    activeElement === nextElement.previousElementSibling ||
    activeElement === nextElement
  ) {
    return;
  }
  
 tasksListElement.insertBefore(activeElement, nextElement);
});
```



