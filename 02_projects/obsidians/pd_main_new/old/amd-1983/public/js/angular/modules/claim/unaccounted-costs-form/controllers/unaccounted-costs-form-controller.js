/**
 * контроллер формы неучтённые затраты
 * @returns {undefined}
 */
define([], function () {
    angular
        .module('modules.claim.unaccounted-costs-form')
        .controller('unaccountedCostsFormController', unaccountedCostsFormController);

    unaccountedCostsFormController.$inject = [
        '$rootScope',
        '$scope',
        '$mdDialog',
        'claimId',
        'postRepository',
        'userList',
        'mode',
        'validationService'
    ];
    function unaccountedCostsFormController(
        $rootScope,
        $scope,
        $mdDialog,
        claimId,
        postRepository,
        userList,
        mode,
        validationService
    ) {
        var __self = this;
        
        this.mode = mode;

        this.postList = postRepository.list;

        this.waiting = false;

        // получение через сервис
        this.claimId = claimId;

        // нужно получать с сервера
        this.userList = userList;

        // первый выбранный товар
        this.selectedItemNumber = 0;

        // выбранный товар
        this.selectedItem = {};

        /**
         * настройка окна для отображения сообщений
         * @type Object
         */
        var alertWindowConfig = $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(false)
            .title('Ошибка')
            .multiple(true)
            .theme('app')
            .ok('Закрыть');
        
        __self.showForm = showForm;
        __self.closeDialog = closeDialog;
        __self.info        = save;
        __self.itemChoose  = itemChoose;
        __self.isEditMode = isEditMode;
        __self.getDistributionUserName = getDistributionUserName;
        __self.isPostListEmpty = isPostListEmpty;

        /**
         * открытие формы
         * @param {} $event
         * @returns {undefined}
         */
        function showForm($event) {            
            // подгружаем список товаров с сервера
            postRepository.load().then(function () {
                if (!postRepository.isEmpty()) {
                    // установка выбранного товара по умолчанию
                    itemChoose(Object.keys(__self.postList)[0]);
                }

                $mdDialog.show({
                    templateUrl: '/claim/unaccounted-costs-form/get-form-template',
                    autoWrap: false,
                    targetEvent: $event,
                    disableParentScroll: true, // запрет на прокрутку радительского окна
                    clickOutsideToClose: false, // запрет на закрытие формы, после клика за пределами формы
                    escapeToClose: false,
                    parent: angular.element(document.body),
                    multiple: true,
                    scope: $scope, // установка области видимости для формы
                    preserveScope: true, // чтобы при закрытии формы не обнулялась область видимости
                });
            }).catch(function (error) {
                $mdDialog.show(
                    alertWindowConfig.targetEvent($event).htmlContent(error.message)
                );
            });
        };

        /**
         * закрытие формы
         * @returns {undefined}
         */
        function closeDialog() {
            $mdDialog.hide(function () {
                $rootScope.$emit('rootScope:clearEvents');
            });
        };

        /**
         * обработка нажатия на кнопку "сохранить"
         * @param {} $event
         * @returns {undefined}
         */
        function save($event) {
            __self.waiting = true;
            if (validationService.validate(__self.postList)) {
                postRepository.info().then(function () {
                    __self.waiting = false;
                    $mdDialog.show(
                        alertWindowConfig
                            .targetEvent($event)
                            .title(undefined)
                            .htmlContent('Данные сохранены')
                            .clickOutsideToClose(true)
                    );
                }).catch(function (error) {
                    __self.waiting = false;
                    $mdDialog.show(
                        alertWindowConfig.targetEvent($event).htmlContent(error.message)
                    );
                });
            } else {
                var firstItemWithError = _.findKey(__self.postList, {errorsExist: true});
                if (firstItemWithError >= 0) {
                    itemChoose(firstItemWithError);                    
                }

                __self.waiting = false;
            }
        };

        /**
         * обработка нажатия на товар в списке
         * @param {Number} itemNumber
         * @returns {undefined}
         */
        function itemChoose(itemNumber) {
            $scope.selectedItemNumber = __self.selectedItemNumber = itemNumber;
            // запускается обновление DOM через магию angular
            $scope.selectedItem = __self.selectedItem = __self.postList[__self.selectedItemNumber];
        };

        /**
         * проверка режима, редактирование - 2, просмотр - 1
         * @returns {Boolean}
         */
        function isEditMode() {
            return __self.mode === 2;
        };

        /**
         * получение имени исполнителя
         * @param {Number} userId
         * @returns {String}
         */
        function getDistributionUserName(userId) {
            if (userId <= 0) {
                return 'Не найдено';
            }

            var user = _.find(__self.userList, function (user) { // используется lodash
                return user.id == userId;
            });

            if (user) {
                return user.name;
            } else {
                return 'Не найдено';
            }
        };

        /**
         * Проверка на пустоту списка должностей
         * @returns {Boolean}
         */
        function isPostListEmpty()
        {
            return Object.values(__self.postList).length === 0;
        }
    }
});