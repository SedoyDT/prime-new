/**
 * репозиторий для информации о списке должностей
 * @returns {undefined}
 */
define([], function () {
    angular
        .module('modules.claim.unaccounted-costs-form')
        .factory('postRepository', postRepository);

    postRepository.$inject = ['claimId', 'backend'];
    function postRepository(claimId, backend) {
        /**
         * объект, в котором хранятся полученные данные
         * @type Object
         */
        var list = {};

        /**
         * флаг для обозначения загруженности списка
         * @type Boolean
         */
        var loaded = false;

        return {
            "load": load,
            "save": save,
            "isEmpty": isEmpty,
            "addEmptyDistribution": addEmptyDistribution,
            "fillWithUser": fillWithUser,
            "deleteDistibution": deleteDistibution,
            "calculateTotal": calculateTotal,

            "list": list
        };

        /**
         * получение данных о списке должностей
         * если данных нет в кеш-объекте, то происходит запрос на получение
         * данных с сервера
         * @returns {Promise}
         */
        function load()
        {
            if (loaded) {
                return Promise.resolve(list);
            } else {
                return backend.getPostList(claimId).then(function (data) {
                    for (var key in data) {
                        list[key] = data[key];
                        prepareItem(list[key], key);
                    }                    
                    loaded = true;
                    
                    return list;
                });
            }
        };

        /**
         * добавление пустого распределения
         * @param {Number} number
         * @returns {Object}
         */
        function addEmptyDistribution(number)
        {
            list[number].distribution.push({
                id: 0,
                userId: 0,
                time: 0,
                summ: 0
            });
            prepareItem(list[number], number);

            return list[number].distribution[list[number].distribution.length - 1];
        }

        /**
         * размножение исполнителя по всем должностям
         * @param {Number} userId
         * @returns {undefined}
         */
        function fillWithUser(userId)
        {
            for (var key in list) {
                var item = list[key];

                if (item.distributionUsers.indexOf(userId) !== -1) {
                    continue;
                }

                var newEntry = addEmptyDistribution(key);
                newEntry.userId = userId;
                item.distributionUsers.push(userId);
            }
        }

        /**
         * удаление распределения
         * @param {Number} postNumber - индекс должности
         * @param {Number} distributionIndex - индекс распределения
         * @returns {undefined}
         */
        function deleteDistibution(postNumber, distributionIndex)
        {
            var post = list[postNumber];
            var distribution = post.distribution[distributionIndex];
            
            var distributionUsersIndex = post.distributionUsers.indexOf(distribution.userId);
            if (distributionUsersIndex !== -1) {
                post.distributionUsers.splice(distributionUsersIndex, 1);
            }
            post.distribution.splice(distributionUsersIndex, 1);
            calculateTotal(postNumber);
        }

        /**
         * подготовка данных о должности
         * @param {Object} postInfo
         * @param {Number} number индекс должности
         * @returns {undefined}
         */
        function prepareItem(postInfo, number)
        {
            postInfo.distributionUsers = [];

            postInfo.coefFormatted = _.round(postInfo.coef * 60, 5);
            postInfo.timeMinute = parseInt(postInfo.time / 60);
            postInfo.timeSecond = postInfo.time % 60;

            postInfo.distribution.forEach(function (distribution) {                
                postInfo.distributionUsers.push(distribution.userId);
                postInfo.prevUserId = postInfo.userId;
                postInfo.userNameFilter = undefined;

                distribution.timeMinute = parseInt(distribution.time / 60);
                distribution.timeSecond = distribution.time % 60;
            });

            calculateTotal(number);
        }

        /**
         * Запуск созранения данных
         * @returns {Promise}
         */
        function save()
        {
            for (var key in list) {
                delete list[key]._key;
                delete list[key].coefFormatted;
                delete list[key].distributionTotal;
                delete list[key].distributionUsers;
                delete list[key].errors;
                delete list[key].errorsExist;
                delete list[key].prevUserId;
                delete list[key].userNameFilter;
            }
            
            return backend.info(claimId).then(function (data) {
                for (var number in data) {
                    list[number].id = data[number].id;
                    _.remove(list[number].distribution);
                    for (var index in data[number].distribution) {
                        list[number].distribution.push(data[number].distribution[index]);
                    }

                    prepareItem(list[number], number);
                }
            });
        };

        /**
         * проверка списка на пустоту
         * @returns {Boolean}
         */
        function isEmpty()
        {
            return !angular.isObject(list) || Object.values(list).length === 0;
        };

        /**
         * вычисление итоговых значений
         * @param {Number} number - индекс должности
         * @returns {undefined}
         */
        function calculateTotal(number)
        {
            var item = list[number];

            if (!item) {
                throw new Error('Должность не найдена');
            }

            if (!('distributionTotal' in item)) {
                item.distributionTotal = {
                    'time': 0,
                    'timeMinute': 0,
                    'timeSecond': 0,
                    'summ': 0
                };
            }

            item.distributionTotal.summ = _.round(item.distribution.reduce(function (summ, element) {
                return summ + element.summ;
            }, 0), 5);

            item.distributionTotal.time = item.distribution.reduce(function (time, element) {
                return time + element.time;
            }, 0);

            item.distributionTotal.timeMinute = parseInt(item.distributionTotal.time / 60);
            item.distributionTotal.timeSecond = item.distributionTotal.time % 60;
        }
    }
});