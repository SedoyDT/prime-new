
#learnJsTasks_mdnTasks
#mdnTasks

#telegram 

# Как с помощью addEventListener реализовать перменещине круга по экрану?
<!-- basicblock-start oid="Obsv9PLHt6y5o3PCRgKMgJeh"  deck='learnJsTasks_mdnTasks' -->
Как с помощью addEventListener реализовать перменещине круга по экрану?::

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
  <canvas>
    
  </canvas>
пер</html>
```

```JS

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const consoleLog = document.getElementById("console-log");

function drawCircle(x, y, size) {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fill();
}

let x = 50;
let y = 50;
const size = 30;

drawCircle(x, y, size);

function logMessage(message) {
  consoleLog.innerText += `${message}\n`;
}

window.addEventListener("keydown", (e) => {
 ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Определяем нажатую клавишу и изменяем координаты
    switch (event.key) {
        case 'w':
            y -= 10; 
            console.log(y)
            break;
        case 'a':
            x -= 10; 
            console.log(x)
            break;
        case 's':
            y += 10; 
            console.log(y)
            break;
        case 'd':
            x += 10; 
            console.log(x)
            break;
    }

    // Рисуем круг на новой позиции
    drawCircle(x, y, size);
});

```

<!-- basicblock-end -->




#learnJsTasks_mdnTasks
#mdnTasks

#telegram 

# В нашей первой задаче, связанной с событиями, вам нужно создать простой обработчик событий, который вызывает изменение текста внутри кнопки (btn) при нажатии на нее и обратно при повторном нажатии.
<!-- basicblock-start oid="ObsUNBDtgc9HfxXatF8B2KTY"  deck='learnJsTasks_mdnTasks' -->
В нашей первой задаче, связанной с событиями, вам нужно создать простой обработчик событий, который вызывает изменение текста внутри кнопки (btn) при нажатии на нее и обратно при повторном нажатии. ::

```html

```

```JS

const btn = document.querySelector('.off');

function handler() {
  let toggle = true;

  return function() {
    toggle = !toggle
    if (toggle) {
      btn.textContent = "Machine is on";
    } else {
      btn.textContent = "Machine is off";
    }
  };
}
let handle = handler();

btn.addEventListener("click", handle)

```

```JS
document.getElementById('btn').addEventListener('click', function() {
    // Проверяем текущий текст кнопки
    if (this.textContent === 'Machine is on') {
        this.textContent = 'Machine is off';
    } else {
        this.textContent = 'Machine is on';
    }
});
```
<!-- basicblock-end -->



