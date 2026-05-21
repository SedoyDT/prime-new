# не работает {{row.num.toFixed(2)}} angular js
<!-- basicblock-start oid="Obsu8Xq35dHF0UE608wVamyg"  deck='A_angular' -->
не работает {{row.num.toFixed(2)}} angular js::


Ошибка с использованием `{{row.num.toFixed(2)}}` в AngularJS связана с тем, что AngularJS интерполирует выражения внутри двойных фигурных скобок, но `.toFixed()` — это метод объекта, который не всегда поддерживается в контексте интерполяции в шаблоне.

### Решение 1: Использовать фильтр AngularJS `number`

Вместо использования метода `.toFixed()` прямо в шаблоне, вы можете использовать встроенный фильтр AngularJS `number`, который форматирует числа с указанным количеством знаков после запятой.

Пример:

```
{{ row.num | number:2 }}
```

Это отформатирует число `row.num` с двумя знаками после запятой, так же как и `.toFixed(2)`.

### Решение 2: Создать контроллерную функцию

Если вам нужно использовать именно метод `.toFixed()` для более сложной логики или манипуляции с данными, вы можете сделать это в контроллере:

1. В контроллере создайте метод для форматирования числа


```
   $scope.formatNumber = function(num) {
       return num.toFixed(2);
   };
   
```

2. В шаблоне используйте этот метод:

```
   {{ formatNumber(row.num) }}
   
```

Таким образом, форматирование будет происходить на уровне контроллера, и вы сможете использовать любые методы объекта JavaScript, такие как `.toFixed()`.


<!-- basicblock-end -->






# Как может выглядеть массив зависимостей?
<!-- basicblock-start oid="ObsHDGMJ5byICRzl8Q3mPsVk"  deck='A_angular' -->
Как может выглядеть массив зависимостей?::


Массив зависимостей в AngularJS используется для указания зависимостей, которые должны быть внедрены в контроллер, директиву или сервис. Он представляет собой массив строк, где каждая строка соответствует имени зависимости, а последний элемент массива — это функция, которая получает эти зависимости в качестве аргументов.

Вот пример, как может выглядеть массив зависимостей для контроллера:

### Пример 1: Контроллер с несколькими зависимостями

```
angular.module('myApp').controller('MyController', ['$http', '$scope', 'MyService', 
  function($http, $scope, MyService) {
    // Логика контроллера
    $scope.data = [];

    // Используем $http для получения данных
    $http.get('/api/data').then(function(response) {
      $scope.data = response.data;
    });

    // Используем MyService
    $scope.customData = MyService.getData();
  }
]);
```

### Пример 2: Директива с зависимостями

```
angular.module('myApp').directive('myDirective', ['$compile', '$timeout', 
  function($compile, $timeout) {
    return {
      restrict: 'E',
      link: function(scope, element) {
        // Логика директивы
        element.append('<p>Привет, мир!</p>');
        $compile(element.contents())(scope);
      }
    };
  }
]);
```

### Пример 3: Сервис с зависимостями

```
angular.module('myApp').factory('MyService', ['$http', '$q', 
  function($http, $q) {
    return {
      getData: function() {
        var deferred = $q.defer();
        
        $http.get('/api/data').then(function(response) {
          deferred.resolve(response.data);
        }, function(error) {
          deferred.reject(error);
        });

        return deferred.promise;
      }
    };
  }
]);
```

### Объяснение структуры

- **Имя зависимости**: Каждая строка в массиве соответствует имени зависимости. Это может быть любой сервис, контроллер, директива или другой объект, доступный в AngularJS.
- **Функция**: Последний элемент массива — это функция, в которой вы можете использовать зависимости. Параметры функции соответствуют именам, указанным в массиве.

### Использование «strict DI»

Также важно отметить, что использование массива зависимостей позволяет избежать проблем с минификацией кода. Когда код минифицируется, имена переменных могут изменяться, и использование массива зависимостей гарантирует, что зависимости будут корректно внедрены, независимо от изменений в именах.

Использование массива зависимостей — это стандартная практика в AngularJS, и она помогает организовать код и управлять зависимостями более эффективно.
<!-- basicblock-end -->




#A_angular
#angular

#telegram 

# Для чего .config()
<!-- basicblock-start oid="ObsvkKqaQRlPHLG6Et9xm4Pj"  deck='A_angular' -->
Для чего .config()::


Используя метод .config(), мы запрашиваем внедрение необходимых поставщиков (например, $routeProvider) в нашу функцию настройки, а затем используем их методы для указания поведения соответствующих служб. Здесь мы используем методы $routeProvider.when() и $routeProvider.в противном случае() для определения маршрутов нашего приложения.
<!-- basicblock-end -->




#A_angular
#angular

#telegram 

# Из каких простых файлов состоит простая иерархия файлов phone cat 4?
<!-- basicblock-start oid="ObsE99M4PltajesBhFOp3gbj"  deck='A_angular' -->
Из каких простых файлов состоит простая иерархия файлов phone cat 4?::


app
app/index.html

```
 <!doctype html>
<html lang="en" ng-app="phonecatApp">
  <head>
    <meta charset="utf-8">
    <title>Google Phone Gallery</title>
    <link rel="stylesheet" href="lib/bootstrap/dist/css/bootstrap.css" />
    <link rel="stylesheet" href="app.css" />
    <script src="lib/angular/angular.js"></script>
    <script src="app.js"></script>
    <script src="phone-list.component.js"></script>
  </head>
  <body>

    <!-- Use a custom component to render a list of phones -->
    <phone-list></phone-list>

  </body>
</html>
```

app/phone-list/phone-list.component.js
```
'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('phoneList').
  component('phoneList', {
    templateUrl: 'phone-list/phone-list.template.html',
    controller: function PhoneListController() {
      this.phones = [
        {
          name: 'Nexus S',
          snippet: 'Fast just got faster with Nexus S.'
        }, {
          name: 'Motorola XOOM™ with Wi-Fi',
          snippet: 'The Next, Next Generation tablet.'
        }, {
          name: 'MOTOROLA XOOM™',
          snippet: 'The Next, Next Generation tablet.'
        }
      ];
    }
  });
```

app/phone-list/phone-list.module.js
```
'use strict';

// Define the `phoneList` module
angular.module('phoneList', []);
```

app/phone-list/phone-list-template.html
```
<ul>
  <li ng-repeat="phone in $ctrl.phones">
    <span>{{phone.name}}</span>
    <p>{{phone.snippet}}</p>
  </li>
</ul>
```
<!-- basicblock-end -->




#A_angular
#angular

#telegram 

# Что такое компонент?
<!-- basicblock-start oid="ObsXzBfIYyTAFI2QyaD8MshT"  deck='A_angular' -->
Что такое компонент?::


Компонент это лаконичный пример комбинации Это комбинация распространенного шаблона(паттерна)   о связке шаблона и контроллера
<!-- basicblock-end -->




#A_angular
#angular

#telegram 

# Как действует шаблон, а именно часть шаблона содержащая логику?
<!-- basicblock-start oid="ObsciX86rnWD5wxHq21ZdSCu"  deck='A_angular' -->
Как действует шаблон, а именно часть шаблона содержащая логику?::


Шаблон (часть представления, содержащая привязки и логику представления) действует как схема того, как наши данные должны быть организованы и представлены пользователю. Контроллер предоставляет контекст, в котором оцениваются привязки, и применяет поведение и логику к нашему шаблону.
<!-- basicblock-end -->




#A_angular
#angular

#telegram 

# О чем второй урок angularjstemplate?
<!-- basicblock-start oid="Obsfpfx3pgz9cP02Q5czkFKP"  deck='A_angular' -->
О чем второй урок angularjstemplate?::


1) Мы создаем view который является проекцией модели в 
2) Заменяем хардкожено вывод списка циклом [ngRepeat](https://docs.angularjs.org/api/ng/directive/ngRepeat) 
3) Добавили новую диррективу [ngController](https://docs.angularjs.org/api/ng/directive/ngController) , которая закрепляет новый контроллер за тегом <body>
4) Поэксперементировали добавив часть нового функционала и использованием ngRepeat 
5) Была попытка произвести запуск теста, но что-то пошло не так, также были попытки дополнения тестов, но тесты не запускаются
<!-- basicblock-end -->




#A_angular
#angular

#telegram 

# Что такео view в ?
<!-- basicblock-start oid="ObskRJ35rmT6fegeBxg2iEom"  deck='A_angular' -->
Что такео view в ?::


В AngularJS представление представляет собой проекцию модели с помощью шаблона HTML. Это означает, что всякий раз, когда модель изменяется, AngularJS обновляет соответствующие точки привязки, что обновляет представление.
<!-- basicblock-end -->




#A_angular
#angular

#telegram 

# tes
<!-- basicblock-start oid="ObsrYLg9vJqfLBIczNszntEr"  deck='A_angular' -->
tes::


<!-- basicblock-end -->




#A_angular
#angular

#telegram 

# angular tes
<!-- basicblock-start oid="ObsTwdihM42Cm7JbjTRFzEOp"  deck='A_angular' -->
angular tes::


<!-- basicblock-end -->



