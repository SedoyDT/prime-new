
#A_angular_services
#angular_services

#telegram 

# Как регистрировать сервис?
<!-- basicblock-start  deck='A_angular_services' -->
Как регистрировать сервис?::


Сервисы регистрируются в модулях через API модуля. Обычно для регистрации службы вы используете API фабрики модулей:
```
var myModule = angular.module('myModule', []);
myModule.factory('serviceId', function() {
  var shinyNewServiceInstance;
  // factory function body that constructs shinyNewServiceInstance
  return shinyNewServiceInstance;
});
```

Вы также можете зарегистрировать службы через службу $provide внутри функции конфигурации модуля:
```
angular.module('myModule', []).config(['$provide', function($provide) {
  $provide.factory('serviceId', function() {
    var shinyNewServiceInstance;
    // factory function body that constructs shinyNewServiceInstance
    return shinyNewServiceInstance;
  });
}]);
```
<!-- basicblock-end -->




#A_angular_services
#angular_services

#telegram 

# Что делает service factory function?
<!-- basicblock-start  deck='A_angular_services' -->
Что делает service factory function?::


Функция фабрики сервисов генерирует один объект или функцию, которая представляет сервис для остальной части приложения. 

Объект или функция, возвращаемые службой, внедряется в любой компонент (контроллер, службу, фильтр или директиву), который определяет зависимость от службы.
<!-- basicblock-end -->




#A_angular_services
#angular_services

#telegram 

# Что такое сервисы angular?
<!-- basicblock-start  deck='A_angular_services' -->
Что такое сервисы angular?::


Сервисы AngularJS — это заменяемые объекты, которые связаны друг с другом с помощью внедрения зависимостей (DI). Вы можете использовать сервисы для организации и совместного использования кода в вашем приложении.
<!-- basicblock-end -->



