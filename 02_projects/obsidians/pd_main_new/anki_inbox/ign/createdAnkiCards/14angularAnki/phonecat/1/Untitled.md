Вот список вопросов по тексту в указанном формате:

<!-- basicblock-start oid="ObsoPRbhsRUmk8jmj1ecdx6v" deck='angular-phone-cat' --> 

1.1 Вопрос: "Что такое директива ng-app и для чего она используется?" :: 
1.2 Ответ: "Директива ng-app указывает корневой элемент приложения AngularJS." 
Пример кода:
```html
<html ng-app>
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsBbUxxmzF4XXniE3pXXymI" deck='angular-phone-cat' --> 

2.1 Вопрос: "Что делает тег `<script src='lib/angular/angular.js'>`?" :: 
2.2 Ответ: "Этот тег загружает библиотеку AngularJS и инициализирует приложение." 
Пример кода:
```html
<script src="lib/angular/angular.js"></script>
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsNiZlXOTQlIqLTR8L9MXPV" deck='angular-phone-cat' --> 

3.1 Вопрос: "Что такое двойное фигурное связывание в AngularJS?" :: 
3.2 Ответ: "Двойное фигурное связывание позволяет вставлять результаты выражений в DOM." 
Пример кода:
```html
<p>Здесь пока ничего нет {{'еще' + '!'}}</p>
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsShQwb4Y1BPKRSClvP94Os" deck='angular-phone-cat' --> 

4.1 Вопрос: "Как инициализируется приложение AngularJS?" :: 
4.2 Ответ: "Приложение инициализируется с помощью директивы ng-app, создавая инжектор и корневую область видимости." 
Пример кода:
```html
<html ng-app>
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObslNzmR6vHfx9DpIZlN5Has" deck='angular-phone-cat' --> 

5.1 Вопрос: "В чем разница между автоматической и ручной инициализацией приложений AngularJS?" :: 
5.2 Ответ: "Автоматическая инициализация проще и подходит для большинства случаев, в то время как ручная инициализация используется в более сложных сценариях." 
Пример кода:
```javascript
// Ручная инициализация с использованием angular.bootstrap
angular.bootstrap(document, ['myApp']);
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsClDH6idtUVrK8iia8v4VB" deck='angular-phone-cat' --> 

6.1 Вопрос: "Что происходит в фазе инициализации AngularJS?" :: 
6.2 Ответ: "Создается инжектор, корневая область видимости и компилируется DOM." 
Пример кода:
```javascript
// Пример создания инжектора
var injector = angular.injector(['ng']);
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="ObsxY7g2TNoFHLKNnXJCuKBI" deck='angular-phone-cat' --> 

7.1 Вопрос: "Как можно увидеть приложение в браузере?" :: 
7.2 Ответ: "Запустите `npm start` и откройте `http://localhost:8000/index.html`." 
Пример кода:
```bash
npm start
```

<!-- basicblock-end --> 

<!-- basicblock-start oid="Obsfhn1gYKa5KqDg39HFW4LA" deck='angular-phone-cat' --> 

8.1 Вопрос: "Что произойдет, если я обновлю страницу в браузере после перехода на step-0?" :: 
8.2 Ответ: "Страница обновится, и вы увидите текущую версию приложения, а не кэшированную." 
Пример кода:
```javascript
// Просто нажмите F5 или Ctrl+R для обновления страницы
```

<!-- basicblock-end --> 

Если нужно добавить или изменить что-то, дайте знать!