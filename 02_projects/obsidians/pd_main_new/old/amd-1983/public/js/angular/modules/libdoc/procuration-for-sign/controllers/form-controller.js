/**
 * контроллер формы создания записей
 */
define(function () {
    angular.module('modules.libdoc.procurationForSign')
        .controller('FormController', FormController);

    FormController.$inject = ['$scope', '$mdDialog', 'DataService', 'ConfigService', 'DatatableApi', 'MessageService', 'FormApi'];
    function FormController($scope, $mdDialog, DataService, ConfigService, DatatableApi, MessageService, FormApi)
    {
        let _self = this;

        this.waiting = false;

        FormApi.show = this.show = show;
        this.close = close;
        this.save = save;

        activate();

        function activate()
        {
            $scope.ConfigService = ConfigService;
            $scope.DataService = DataService;
        }

        /**
         * открытие формы
         * @param {} $event
         * @returns {Promise}
         */
        function show($event)
        {
            $mdDialog.show({
                templateUrl: '/libdoc/procuration-for-sign/form/template',
                autoWrap: false,
                event: $event,
                disableParentScroll: true, // запрет на прокрутку радительского окна
                clickOutsideToClose: false, // запрет на закрытие формы, после клика за пределами формы
                escapeToClose: false,
                parent: angular.element(document.body),
                multiple: true,
                scope: $scope, // установка области видимости для формы
                preserveScope: true, // чтобы при закрытии формы не обнулялась область видимости
            });
        }

        /**
         * закрытие формы
         * @returns {undefined}
         */
        function close($event)
        {
            $mdDialog.hide();
            DataService.clear();
        }

        /**
         * сохранение формы
         * @param $event
         */
        function save($event)
        {
            _self.waiting = true;

            DataService.info().then(function (result) {
                _self.waiting = false;
                if (result) {
                    DatatableApi.update();
                    close($event);
                }
            }).catch(function (error) {
                _self.waiting = false;

                MessageService.alert(error.message);
            });
        }
    }


    /**
     * api для управления формы из других мест
     */
    angular.module('modules.libdoc.procurationForSign')
        .factory('FormApi', FormApi);

    FormApi.$inject = [];
    function FormApi()
    {
        return {
            show: null
        }
    }

    return {};
});