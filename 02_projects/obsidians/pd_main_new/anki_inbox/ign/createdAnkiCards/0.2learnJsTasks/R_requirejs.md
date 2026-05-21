
#R_requirejs
#requirejs

#telegram 

# Как настроить загрузку requirejs angular?
<!-- basicblock-start oid="Obsz0OncJzMgLoh4lO7vGA6i"  deck='R_requirejs' -->
Как настроить загрузку requirejs angular?::


Для того чтобы правильно настроить загрузку **AngularJS** и **RequireJS** в вашем HTML-шаблоне, нужно учесть несколько важных моментов. В частности, **AngularJS** и **RequireJS** могут быть загружены в нужном порядке, и вам необходимо правильно указать конфигурацию для работы с ними. 

### Проблемы и предложения

1. **Модульный тип для AngularJS**: AngularJS обычно не работает с типом модуля `module` в браузере напрямую, поскольку это специфично для современных JavaScript-приложений, использующих ES6. Вам нужно будет использовать `angular.js` в старом формате, а **RequireJS** поможет загрузить AngularJS и другие зависимости.

2. **Тип загрузки скриптов**: Вам нужно будет гарантировать, что **RequireJS** сначала загружает все зависимости, а затем инициализирует ваше приложение. Поскольку вы используете **RequireJS**, то **AngularJS** должен быть также загружен с помощью RequireJS, а потом уже ваш собственный скрипт `myApp.js`.

### Шаги для настройки

1. **Использование RequireJS для загрузки AngularJS**: Если вы хотите загрузить AngularJS через **RequireJS**, вам нужно настроить правильный путь к AngularJS и указать его как зависимость в вашей конфигурации RequireJS.

2. **Загрузка зависимостей в `myApp.js`**: Ваш скрипт `myApp.js` должен быть загружен через **RequireJS**. 

### Пример конфигурации

1. **Настройка RequireJS**:
   
   Вам нужно создать конфигурацию для **RequireJS** (например, в отдельном файле `require-config.js`), где вы укажете пути к библиотекам и модулям.

   Пример **require-config.js**:

   ```
   require.config({
       baseUrl: './',  // или путь, где находятся ваши скрипты
       paths: {
           angular: 'lib/angular/angular',  // Путь к AngularJS (без расширения .js)
           app: 'public/js/myApp',          // Путь к вашему приложению
           // Здесь можно указать другие библиотеки, если они есть
       },
       shim: {
           angular: {
               exports: 'angular'  // Это указывает, что AngularJS должен экспортировать глобальный объект 'angular'
           }
       }
   });
   
```

2. **HTML-шаблон**:

   Обновите ваш HTML-шаблон, чтобы **RequireJS** загружал все необходимые зависимости:

   ```
   return '
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>Title</title>
       <!-- Загрузка RequireJS -->
       <script src="node_modules/requirejs/require.js"></script>

       <!-- Загрузка стилей -->
       <link rel="stylesheet" href="styles/index.css">

       <!-- Подключаем конфигурацию для RequireJS -->
       <script src="require-config.js"></script>
   </head>
   <body>

   <!-- Основной тег приложения -->
   <body ng-app="calendar">
     <div ng-controller="ParentCalendarController">
         <button ng-click="decrease()">decrease</button>
         <button ng-click="increase()">increase</button>
         <p>Parent year: {{year}} from increase child</p>
         
         <div class="calendar">
             <div ng-controller="ParentCalendarController">
                 <p>Good {{year}}, {{name}}!</p>

                 <div ng-controller="ChildCalendarController">
                     <button ng-click="decrease()">decrease</button>
                     <button ng-click="increase()">increase child</button>
                     <p>Good {{year}}, {{name}}!</p>
                 </div>
             </div>
         </div>
     </div>

     <div class="container">
         
     </div>
     <div id="loading-indicator" class="overflow">
         <div id="loading-text">Loading</div>
     </div>

   </body>
   </html>
   ';
   
```

3. **Загрузка модуля в `myApp.js`**:

   В **myApp.js** вы должны использовать **RequireJS** для загрузки **AngularJS** и вашего приложения.

   Пример **myApp.js**:
<!-- basicblock-end -->




#R_requirejs
#requirejs

#telegram 

# ```
<!-- basicblock-start oid="ObscmVl57E9GRvMcbXPg2Ssg"  deck='R_requirejs' -->
```::

   define(['angular'], function(angular) {
       // Создаем модуль
       const calendar = angular.module('calendar', []);

       // Родительский контроллер
       calendar.controller('ParentCalendarController', ['$scope', function($scope) {
           $scope.year = (new Date()).getFullYear();
           $scope.name = 'parent';

           $scope.increase = function() {
               $scope.year = $scope.year + 1;
           };

           $scope.decrease = function() {
               $scope.year = $scope.year - 1;
           };
       }]);

       // Дочерний контроллер
       calendar.controller('ChildCalendarController', ['$scope', function($scope) {
           $scope.year = (new Date()).getFullYear();
           $scope.name = 'child';

           $scope.increase = function() {
               const parent = $scope.$parent;
               $scope.year = $scope.year + 1;
               parent.year = $scope.year + 1;
           };

           $scope.decrease = function() {
               $scope.year = $scope.year - 1;
           };
       }]);

       // Инициализация приложения
       angular.bootstrap(document, ['calendar']);
   });
   
```

4. **Инициализация в `index.html` через RequireJS**:

   В **HTML-шаблоне** теперь будет работать загрузка модуля через **RequireJS**. Нужно указать, чтобы **RequireJS** сначала загрузил ваш `myApp.js`, который зависит от **AngularJS**.

   Добавьте следующую строку в конец вашего HTML-шаблона перед закрывающимся тегом `</body>`:

   ```
   <script>
       require(['app'], function() {
           console.log('AngularJS app is bootstrapped!');
       });
   </script>
   
```

### Итоговая структура:

- **require-config.js**: конфигурация для RequireJS (путь к AngularJS и другим библиотекам).
- **index.html**: загрузка скриптов через RequireJS.
- **myApp.js**: главный модуль приложения, который зависит от AngularJS и других модулей.

### Важные замечания:
1. **Загрузите все зависимости перед их использованием**. В данном случае **RequireJS** будет гарантировать, что AngularJS загружается до вашего кода приложения.
2. **Использование модулей через `define`** — это специфика **RequireJS**. Ваши контроллеры и другие компоненты AngularJS будут работать только после того, как AngularJS будет загружен и доступен.

Если после этого у вас еще возникают проблемы с инициализацией или загрузкой модулей, то важно проверить консоль браузера на наличие ошибок или предупреждений.
<!-- basicblock-end -->



