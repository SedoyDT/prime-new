---
author: Frolov Anatolui
date: 2024-10-10
time: 22:10:31
aliases: 
tags:
  - unique-note
  - pet
---
Для улучшения кода с учётом использования ЕЫ (если под этим имеется в виду «единый язык» или оптимизация общей структуры и упрощения), можно выполнить следующие шаги:

1. **Оптимизация работы с событиями**:
   Сейчас используются несколько обработчиков событий на основе `click`. Это можно централизовать, чтобы избежать дублирования кода.

2. **Разделение на более мелкие функции**:
   Функции вроде `displayYear` и `displayMonth` можно разделить на более мелкие части. Например, создание кнопок, создание сетки можно выделить в отдельные функции, чтобы улучшить читаемость.

3. **Улучшение имен переменных**:
   Например, такие имена как `increase`, `decrease`, можно сделать более осмысленными: `increaseButton`, `decreaseButton`.

4. **Модульная организация**:
   Вы уже используете модульную структуру (utils, main, display), но можно ещё больше унифицировать некоторые процессы. Например, обработка данных месяцев и дней, чтобы исключить возможные повторы.

5. **Асинхронные операции**:
   Убедитесь, что асинхронные вызовы обрабатываются должным образом (например, проверка наличия ошибок при вызове API через `try/catch`).

6. **История состояний**:
   Добавьте более гибкую работу с `history.pushState`, возможно, передача состояния через URL и восстановление его.

Пример улучшенного кода:

```ts
const display = (function () {
    let currentClickHandler: EventListener = null;

    function createButton(id: string, text: string, className: string): HTMLButtonElement {
        const button = document.createElement("button");
        button.id = id;
        button.innerText = text;
        button.classList.add(className);
        return button;
    }

    function clearMainContainer() {
        const mainContainer = document.querySelector(".container") as HTMLElement;
        mainContainer.innerHTML = '';
        if (currentClickHandler) {
            mainContainer.removeEventListener("click", currentClickHandler);
        }
    }

    function appendYearControls(header: HTMLElement, state: TState) {
        const decreaseButton = createButton('decrease', '←', 'change-year');
        const increaseButton = createButton('increase', '→', 'change-year');

        const yearParagraph = document.createElement("p");
        yearParagraph.innerText = state.year.toString();
        yearParagraph.id = "year";

        header.appendChild(decreaseButton);
        header.appendChild(yearParagraph);
        header.appendChild(increaseButton);
    }

    function displayYear(state: TState) {
        clearMainContainer();

        const mainContainer = document.querySelector(".container") as HTMLElement;
        const header = document.createElement("div");
        header.classList.add('header');
        mainContainer.appendChild(header);

        appendYearControls(header, state);

        const gridContainer = document.createElement("div");
        gridContainer.classList.add('grid-container');

        state.months.forEach((month, i) => {
            const monthDiv = document.createElement("div");
            monthDiv.classList.add("grid-item", "month");
            monthDiv.id = `item${i}`;
            monthDiv.innerText = month.title;
            monthDiv.style.display = "flex";
            monthDiv.style.justifyContent = "center";
            monthDiv.style.alignItems = "center";
            monthDiv.addEventListener('click', () => {
                utils.changeState(state.year, i, monthDiv.dataset.link || '');
            });
            gridContainer.appendChild(monthDiv);
        });

        mainContainer.appendChild(gridContainer);
        history.pushState(state, "", `../calendar/${state.year}`);
    }

    async function displayMonth(state: TState) {
        clearMainContainer();

        const mainContainer = document.querySelector(".container") as HTMLElement;
        state.days = await utils.getDays(state.year, state.viewMod);

        const increase = createButton("increase-month", "→", "change-month");
        const decrease = createButton("decrease-month", "←", "change-month");

        const headerYear = document.createElement("h1");
        const headerMonth = document.createElement("h2");
        const yearSpan = document.createElement("span");
        yearSpan.id = "year";
        yearSpan.innerText = state.year.toString();
        headerYear.appendChild(yearSpan);

        const date = new Date();
        date.setMonth(state.viewMod);
        headerMonth.innerText = date.toLocaleString("ru", { month: "long" });
        headerMonth.id = "home";

        mainContainer.appendChild(headerYear);
        mainContainer.appendChild(headerMonth);

        const gridContainer = document.createElement("div");
        gridContainer.classList.add("second-grid-container");
        gridContainer.appendChild(decrease);

        if (state.days.length > 0 && state.days[0].dayOfWeek !== 'Monday') {
            const daysBefore = utils.getDaysBefore(state.days[0].dayOfWeek);
            daysBefore.forEach(dayBefore => {
                const dayDiv = document.createElement("div");
                dayDiv.classList.add("grid-item");
                dayDiv.innerText = dayBefore;
                gridContainer.appendChild(dayDiv);
            });
        }

        state.days.forEach(day => {
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("grid-item");
            dayDiv.innerText = day.dayOfWeek.toString();
            gridContainer.appendChild(dayDiv);
        });

        gridContainer.appendChild(increase);
        mainContainer.appendChild(gridContainer);

        currentClickHandler = utils.increaseDecreaseMonth(state);
        mainContainer.addEventListener("click", currentClickHandler);
        history.pushState(state, "", `../${state.link}`);
    }

    return {
        displayYear,
        displayMonth
    };
})();
```

**Что улучшено**:
1. Введена функция `createButton` для создания кнопок, что делает код компактнее и переиспользуемым.
2. Выделены дополнительные функции (`clearMainContainer`, `appendYearControls`) для улучшения читаемости и переиспользования.
3. Централизована логика очистки контейнера и удаления обработчиков событий.
4. Модифицирована работа с событиями, сделана более гибкой (например, создание элементов на основе данных).

Это улучшает как структуру, так и поддерживаемость кода.

