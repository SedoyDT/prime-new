---
author: Frolov Anatolui
date: 2024-09-22
time: 15:09:24
aliases: 
tags:
  - unique-note
  - amd
---


Этот `tsconfig.json` файл содержит конфигурацию для компиляции TypeScript проекта. Давайте разберем каждую настройку с комментариями:

```json
{
    "compileOnSave": true, 
    // При сохранении файла автоматически запускает компиляцию TypeScript.

    "compilerOptions": {
        "tsBuildInfoFile": ".tsbuildinfo",
        // Файл для хранения информации о компиляции при инкрементальной сборке. Помогает ускорить повторные компиляции.

        "incremental": true, 
        // Включает инкрементальную компиляцию, позволяющую повторно использовать часть предыдущей компиляции, чтобы ускорить процесс.

        "sourceMap": false, 
        // Отключает генерацию карт исходных файлов для отладки. Если включено, это создаст файл `.map` для сопоставления с исходным кодом.

        "inlineSourceMap": false, 
        // Отключает встраивание карты исходного кода непосредственно в скомпилированные файлы JavaScript. Если бы это было true, карты бы встраивались прямо в код.

        "outDir": "./public/js", 
        // Директория, куда компилятор TypeScript будет записывать скомпилированные JavaScript файлы.

        "rootDir": "./typescript", 
        // Указывает корневую директорию для исходных файлов TypeScript. Это позволяет компилятору сохранить структуру папок при выводе.

        "allowJs": true, 
        // Разрешает компиляцию JavaScript файлов наряду с TypeScript файлами.

        "removeComments": true, 
        // Удаляет комментарии из скомпилированного JavaScript кода.

        "target": "es2015", 
        // Указывает версию ECMAScript, в которую нужно транслировать код TypeScript. В данном случае — ES2015.

        "experimentalDecorators": true, 
        // Включает поддержку экспериментальных декораторов. Полезно, если используется Angular или другие библиотеки, которые активно используют декораторы.

        "lib": [
            "webworker",
            "es5",
            "dom",
            "scripthost",
            "es2017",
            "es2018.promise"
        ],
        // Определяет библиотеки, которые будут доступны для проекта. Включает поддержку для webworkers, ES5, DOM API, хост-скриптов, и функций ES2017 и ES2018, таких как Promises.

        "module": "amd", 
        // Указывает модульную систему. Здесь используется AMD (Asynchronous Module Definition), обычно используется в браузерах для загрузки модулей.

        "baseUrl": ".", 
        // Устанавливает базовый путь для поиска модулей.

        "paths": { 
            // Определяет алиасы путей для удобного подключения модулей по коротким путям.
            "angular": [
              "typescript/@types/angular/index",
              "typescript/@types/angular-material/index"
            ],
            "datatable": [
                "typescript/@types/datatable/index"
            ],
            "ui-date": [
                "typescript/@types/ui-date/index"
            ],
            "amCharts/serial": [
                "typescript/@types/amcharts/index"
            ],
            "amCharts/stock": [
                "typescript/@types/amcharts/index"
            ],
            "fullcalendar": [
                "typescript/@types/fullcalendar/index"
            ],
            "@fullcalendar/core": [
                "typescript/@types/fullcalendar/core"
            ],
            "@fullcalendar/common": [
                "typescript/@types/fullcalendar/common"
            ],
            "@fullcalendar/interaction": [
                "typescript/@types/fullcalendar/interaction"
            ],
            "@fullcalendar/daygrid": [
                "typescript/@types/fullcalendar/daygrid"
            ],
            "@fullcalendar/timegrid": [
                "typescript/@types/fullcalendar/timegrid"
            ],
            "@fullcalendar/list": [
                "typescript/@types/fullcalendar/list"
            ],
            "@fullcalendar/vdom": [
                "typescript/@types/fullcalendar/vdom"
            ]
        },
        // Определяет пути для библиотек и модулей, чтобы их можно было импортировать через алиасы.

        "typeRoots": [
            "./typescript/@types"
        ]
        // Путь к директориям, где находятся определения типов TypeScript. В данном случае он указывает на локальную папку с определениями типов.
    },

    "exclude": [
        "node_modules"
    ],
    // Исключает папку `node_modules` из компиляции, поскольку она содержит зависимости, которые уже скомпилированы.

    "include": [
        "./typescript/**/*"
    ]
    // Определяет, какие файлы TypeScript нужно компилировать. В данном случае все файлы в папке `typescript`.
}
```

Этот файл помогает управлять компиляцией TypeScript проекта, обеспечивая гибкость и оптимизацию процесса сборки.