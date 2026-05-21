
#A_angular_forms
#angular_forms

#telegram 

# Как выгладит код формы с $touched и штуками вроде сообщения с просьбой заполнить
<!-- basicblock-start  deck='A_angular_forms' -->
Как выгладит код формы с $touched и штуками вроде сообщения с просьбой заполнить::


```
angular.module('formExample', [])  // Создаем Angular модуль с именем 'formExample'
    .controller('ExampleController', ['$scope', function($scope) {
        // Инициализируем объект $scope.master, который будет хранить начальные данные формы
        $scope.master = {};

        // Функция обновления данных пользователя, копирует данные из формы в объект master
        $scope.update = function(user) {
            $scope.master = angular.copy(user);  // Копируем объект user в master (предотвращение мутаций)
        };

        // Функция сброса формы, восстанавливает значения по умолчанию и очищает состояние формы
        $scope.reset = function(form) {
            if (form) {
                form.$setPristine();  // Устанавливаем форму в "чистое" состояние (все изменения отменены)
                form.$setUntouched();  // Устанавливаем все поля формы как не были затронуты пользователем
            }
            $scope.user = angular.copy($scope.master);  // Восстанавливаем пользователя в состояние по умолчанию
        };

        // Инициализация формы при загрузке контроллера
        $scope.reset();
    }]);
```
<!-- basicblock-end -->



