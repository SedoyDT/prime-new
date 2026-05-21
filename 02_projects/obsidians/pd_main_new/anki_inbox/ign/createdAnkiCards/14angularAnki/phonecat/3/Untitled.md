Вот вопросы по статье на тему AngularJS компонентов, оформленные в запрашиваемом формате:

<!-- basicblock-start oid="ObsDDLh1hIUyjxMFH4DIxURn" deck='angular-phone-cat' --> 

1.1 Вопрос: "Что такое компонент в AngularJS и зачем он используется?" ::  
1.2 Ответ: "Компонент в AngularJS — это изолированная и повторно используемая сущность, которая объединяет шаблон и контроллер для создания динамического представления."  
Пример кода:  
```javascript
angular.module('myApp').component('greetUser', {
  template: 'Hello, {{$ctrl.user}}!',
  controller: function GreetUserController() {
    this.user = 'world';
  }
});
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="Obszxz4dgD2Y2sGKsWhJsIPS" deck='angular-phone-cat' -->  

2.1 Вопрос: "Какие преимущества использования компонента в AngularJS по сравнению с контроллером?" ::  
2.2 Ответ: "Компоненты предоставляют изолированную область и уменьшают риск конфликтов между различными частями приложения, улучшая повторное использование и тестируемость."  
Пример кода:  
```javascript
// Компонент обеспечивает изолированную область для своего контроллера и шаблона
angular.module('myApp').component('phoneList', {
  template: '<ul><li ng-repeat="phone in $ctrl.phones">{{phone.name}}</li></ul>',
  controller: function PhoneListController() {
    this.phones = [{ name: 'Nexus S' }, { name: 'Motorola XOOM' }];
  }
});
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="ObsMI71uPNwtQxmjLJeVgHjo" deck='angular-phone-cat' -->  

3.1 Вопрос: "Чем отличается использование `$ctrl` от непосредственного использования `$scope` в шаблонах?" ::  
3.2 Ответ: "`$ctrl` используется как alias для доступа к данным и методам контроллера, что улучшает читаемость и делает код более явным, в то время как `$scope` является более старым подходом для привязки данных."  
Пример кода:  
```javascript
// Использование $ctrl для доступа к свойствам контроллера
angular.module('myApp').component('greetUser', {
  template: 'Hello, {{$ctrl.user}}!',
  controller: function GreetUserController() {
    this.user = 'world';
  }
});
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="ObsdlvPooy3Rt34lRS6naVS0" deck='angular-phone-cat' -->  

4.1 Вопрос: "Как выглядит процесс создания компонента с помощью метода `.component()` в AngularJS?" ::  
4.2 Ответ: "Процесс создания компонента состоит из регистрации компонента в модуле с указанием шаблона и контроллера."  
Пример кода:  
```javascript
angular.module('myApp').component('greetUser', {
  template: 'Hello, {{$ctrl.user}}!',
  controller: function GreetUserController() {
    this.user = 'world';
  }
});
```

<!-- basicblock-end -->  

<!-- basicblock-start oid="ObswDq8DbksXc0tChErQNdCE" deck='angular-phone-cat' -->  

5.1 Вопрос: "В чем разница между компонентами и директивами в AngularJS?" ::  
5.2 Ответ: "Компоненты можно рассматривать как упрощенную версию директив, которая создается для стандартных случаев, тогда как директивы предоставляют больше возможностей для расширения HTML, но требуют больше кода."  
Пример кода:  
```javascript
// Пример компонента
angular.module('myApp').component('simpleComponent', {
  template: '<p>Простой компонент</p>',
  controller: function SimpleController() {}
});

// Пример директивы
angular.module('myApp').directive('simpleDirective', function() {
  return {
    template: '<p>Простая директива</p>',
    controller: function SimpleDirectiveController() {}
  };
});
```

<!-- basicblock-end -->