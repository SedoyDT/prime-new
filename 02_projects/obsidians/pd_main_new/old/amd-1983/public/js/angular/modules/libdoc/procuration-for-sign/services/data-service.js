/**
 * сервис для работы с данными
 */
define(function () {
    angular.module('modules.libdoc.procurationForSign')
        .factory('DataService', DataService);

    DataService.$inject = ['BackendService', 'Model', 'ConfigService'];
    function DataService(BackendService, Model, ConfigService)
    {
        let _model = Model.factory();
        let _validationErrors = {};

        return {
            model: _model,
            validationErrors: _validationErrors,

            save: save,
            clear: clear,
            remove: remove
        };

        /**
         * сохранение данных
         * @return {*}
         */
        function save()
        {
            for (let key in _validationErrors) {
                if (!_validationErrors.hasOwnProperty(key)) {
                    continue;
                }
                _validationErrors[key] = null;
            }

            // /libdoc/procuration-for-sign/form/save
            return BackendService.post(ConfigService.routes.info, _model.collect()).then(function (data) {
                if (data && data.validationErrors) {
                    Object.entries(data.validationErrors).forEach(function ([key, value]) {
                        _validationErrors[key] = value;
                    });

                    return false;
                }

                return true;
            });
        }

        /**
         * очистка модели
         */
        function clear()
        {
            _model.clear();
        }

        /**
         * удаление записи
         * @param id
         * @return {*}
         */
        function remove(id = 0)
        {
            // /libdoc/procuration-for-sign/form/delete
            return BackendService.post(ConfigService.routes.remove, {id: id});
        }
    }

    return {};
});