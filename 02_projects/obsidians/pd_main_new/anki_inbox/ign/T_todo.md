
#T_todo
#todo

#telegram 

# Попробовать что-то из книги современный php
<!-- basicblock-start  deck='T_todo' -->
Попробовать что-то из книги современный php::


<!-- basicblock-end -->




#T_todo
#todo

#telegram 

# Прочитать 
<!-- basicblock-start  deck='T_todo' -->
Прочитать ::


https://habr.com/ru/articles/525536/
<!-- basicblock-end -->




#T_todo
#todo

#telegram 

# Прочитать 
<!-- basicblock-start  deck='T_todo' -->
Прочитать ::


https://translated.turbopages.org/proxy_u/en-ru.ru.bc93b1aa-66efdb5b-8cddbfef-74722d776562/https/www.c-sharpcorner.com/article/a-comprehensive-guide-to-understanding-javascript-observables/
<!-- basicblock-end -->




#T_todo
#todo

#telegram 

# class QuickSort {
<!-- basicblock-start  deck='T_todo' -->
class QuickSort {::

    protected _high: number;
    protected _low: number;
    protected _array: number[];
    protected _sortedArray: number[];

    constructor(array: number[]) {
        this._array = array;
        this._low = 0;
        this._high = array.length - 1;
    }

    sort(array: number[], low: number, high: number): void {
        if (low < high) {
            let pi = this.partition(this._array, low, high);

            this.sort(this.array, low, pi - 1);
            this.sort(this.array, pi + 1, high);
        }
    }

    //
    partition(array: number[], low: number, high: number) {
        let pivot = array[high];
        let i = (low - 1);

        for (let j = low; j < high; j++) {
            if (array[j] < pivot) {
                i++;
            }

            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        let temp = array[i + 1];
        array[i + 1] = array[high];
        array[high] = temp;

        return i + 1;
    }

    main(): void {
        console.log(`Текущий неотсортированный массив: ${this._array}`); // frolov debug
        this.sort(this._array, this.low, this.high);
    }

    set array(array: number[]) {
        this._array = array;
    }

    get array(): number[] {
        return this._array;
    }

    set high(value: number) {
        this._high = value;
    }

    get high() : number {
        return this._high;
    }

    set low(value: number) {
        this._low = value;
    }

    get low() : number {
        return this._low;
    }
}

let sort = new QuickSort([1, 2, 4, 5]);
sort.array = [17, 14, 15, 28, 6, 8, -6, 1, 3, 18];
// sort.array = [5, 22, 2, 2];
// console.log(sort.array);
// sort.high = 12;
// sort.low = 0
// console.log(sort.high);
// console.log(sort.low) // frolov debug
sort.main();

dj

вот тут я что-то запутался
<!-- basicblock-end -->




#T_todo
#todo

#telegram 

# ### Что изменилось:
<!-- basicblock-start  deck='T_todo' -->
### Что изменилось:::

1. **Асинхронная функция сортировки**: методы `sort` и `partition` стали асинхронными, чтобы добавить задержку между шагами сортировки.
2. **Метод `updateDisplay`**: обновляет отображение DOM элементов по мере изменения массива с задержкой для наглядности.
3. **Задержка в 100 миллисекунд** между шагами сортировки, что позволяет визуализировать процесс сортировки.

Теперь при запуске сортировки элементы будут постепенно изменять свой размер и цвет, отражая процесс сортировки.
<!-- basicblock-end -->




#T_todo
#todo

#telegram 

# Чтобы визуализировать процесс сортировки в твоём коде, необходимо обновлять DOM элементы по мере выполнения алгоритма сортировки. Это можно сделать с помощью асинхронных функций и `setTimeout` или `async/await` для добавления задержек между шагами сортировки, что позволит увидеть изменение элементов в реальном времени.
<!-- basicblock-start  deck='T_todo' -->
Чтобы визуализировать процесс сортировки в твоём коде, необходимо обновлять DOM элементы по мере выполнения алгоритма сортировки. Это можно сделать с помощью асинхронных функций и `setTimeout` или `async/await` для добавления задержек между шагами сортировки, что позволит увидеть изменение элементов в реальном времени.::


Я дополню твой код с использованием `async` и `await` для пошаговой визуализации:

### Дополненный код для визуализации сортировки:

```
class QuickSort {
    protected _high: number;
    protected _low: number;
    protected _array: number[];
    protected _arrayElems: HTMLDivElement[] = [];

    constructor(array: number[]) {
        this._array = array;
        this._low = 0;
        this._high = array.length - 1;
    }

    async sort(array: number[], low: number, high: number): Promise<void> {
        if (low < high) {
            let pi = await this.partition(array, low, high);
            await this.sort(array, low, pi - 1);
            await this.sort(array, pi + 1, high);
        }
    }

    async partition(array: number[], low: number, high: number): Promise<number> {
        let pivot = array[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (array[j] <= pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                await this.updateDisplay();
            }
        }

        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        await this.updateDisplay();

        return i + 1;
    }

    async updateDisplay(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                for (let i = 0; i < this._arrayElems.length; i++) {
                    this._arrayElems[i].style.height = `${this._array[i]}vh`;
                    this._arrayElems[i].style.backgroundColor = `hsl(${(this._array[i] * 360) / this._high}, 80%, 80%)`;
                }
                resolve();
            }, 100); // Задержка 100 миллисекунд для анимации
        });
    }

    async main(): Promise<void> {
        console.log(`Текущий неотсортированный массив: ${this._array}`);
        await this.sort(this._array, this._low, this._high);
        console.log(`Отсортированный массив: ${this._array}`);
    }

    set array(array: number[]) {
        this._array = array;
        this._low = 0;
        this._high = array.length - 1;
    }

    get array(): number[] {
        return this._array;
    }

    displayArray(): void {
        let container = document.createElement("div");
        container.classList.add("grid-container");
        container.style.display = "grid";
        container.style.gap = "2px";
        container.style.gridTemplateColumns = "repeat(100, 1fr)";

        for (let i = 0; i < this._array.length; i++) {
            let gridItem = document.createElement("div");
            gridItem.classList.add("grid-item");
            gridItem.style.backgroundColor = `hsl(${(i * 360) / this._array.length}, 80%, 80%)`;
            gridItem.dataset.value = String(i);
            gridItem.style.height = `${this._array[i]}vh`;
            this._arrayElems.push(gridItem); // Сохраняем элементы для последующей модификации
            container.appendChild(gridItem);
        }
        document.body.appendChild(container);
    }
}

// Пример использования
let sort = new QuickSort([1, 2, 4, 5]);

function generateArray(length: number): number[] {
    let array = [];
    for (let i = 0; i < length; i++) {
        array[i] = i;
    }
    return array;
}

function shuffleArray(array: number[]): number[] {
    array.sort(() => Math.random() - 0.5);
    return array;
}

let generatedArray = generateArray(100);
let shuffledArray = shuffleArray(generatedArray);

sort.array = shuffledArray;
sort.displayArray();
sort.main(); // Запускаем визуализированную сортировку
```
<!-- basicblock-end -->




#T_todo
#todo

#telegram 

# #todo вот тут нужно разобраться почему этот код работает а который был у меня - нет
<!-- basicblock-start  deck='T_todo' -->
#todo вот тут нужно разобраться почему этот код работает а который был у меня - нет::


<!-- basicblock-end -->




#T_todo
#todo

#telegram 

# Почитать про тайменеджмент
<!-- basicblock-start  deck='T_todo' -->
Почитать про тайменеджмент::


<!-- basicblock-end -->





***


#T_todo
#todo

#telegram 

# удалить
<!-- basicblock-start  deck='T_todo' -->
удалить::


<!-- basicblock-end -->





***


#T_todo
#todo

#telegram 

# Разобраться с этой хуйней
<!-- basicblock-start  deck='T_todo' -->
Разобраться с этой хуйней::


<!-- basicblock-end -->



