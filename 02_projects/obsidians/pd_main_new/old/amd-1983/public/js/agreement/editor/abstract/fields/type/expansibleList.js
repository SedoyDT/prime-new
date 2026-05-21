/**
 * Класс для полей типа "expansibleList"
 *
 * @package Agreement
 * @subpackage Fields
 * @copyright ${Template_Description_Copyrights}
 * @date 12.05.2017
 *
 * @author Popov K. <konstantin.icreative@gmail.com>
 */

var dependencies = [
    '/js/agreement/editor/abstract/fields/abstract.js'
];

define(dependencies, function (abstract) {

    // Наследование об абстрактного поля
    return (function (abstract) {

        var expansibleList = function (options, form) {

            abstract.apply(this, arguments);

            /**
             * Тип поля, может понадобится для проверки при иттерировании полей формы
             * @type {string}
             */
            this.type = 'expansibleList';

            /**
             * Селектор поля с выбранным значением, которое будет отправлено на сервер
             * @type string
             */
            this.targetField = $(this.options.targetFieldSelector);

            /**
             * Родительский контейнер для поиска и привязки событий
             */
            this.container = this.targetField.parent();

            /**
             * Имя текущего пользователя
             * @type string
             */
            this.currentUserName = this.options.currentUserName;

            /**
             * Изначальное состояние
             */
            this.initializeState = this.targetField.val() ? JSON.parse(this.targetField.val()) : [];


            // Генерация выпадающего окна
            this.init();

            this.bindEvents();
        };

        expansibleList.prototype = Object.create(abstract.prototype);
        expansibleList.prototype.constructor = abstract;


        /**
         * Генерация строк для сохранённых в БД значений
         */
        expansibleList.prototype.init = function () {

            this.container
                .addClass('field-type-expansible-list')
                .append($('<ol>'));

            // Если значение из базы пустое
            if (!this.targetField.val()) {
                this.getListElement().append($('<li>').append(
                    $('<textarea>'),
                    $('<span>',  {
                        text: this.currentUserName
                    })
                ));
            } else {
                // Загрузка данных
                this.initializeState.forEach(function (row) {
                    this.getListElement()
                        .append($('<li>')
                        .append(
                            $('<textarea>', {
                                rows: 1,
                                value: row.value
                            }),
                            $('<span>', {
                                text: row.author
                            })
                        ));
                }.bind(this))
            }
            // Если есть доступ на редактирование (добавление)
            if (this.access == 2) {
                this.container.append($('<div>', {
                    class: 'addBtn pull-right',
                    click: function () {
                        var copy = this.getListElement().find('li').last().clone();
                        copy.find('textarea').val('').css('height', '');
                        copy.find('span').text(this.currentUserName);
                        this.getListElement().append(copy);
                        // Привязываем события к добавленному элементу
                        this.bindEvents();
                    }.bind(this)
                }));
            } else {
                // Если только просмотр, то запретим редактировать
                this.getListElement().find('textarea').attr('readonly', true);
            }
        };

        /**
         * Привязка событий
         */
        expansibleList.prototype.bindEvents = function () {
            // Автоматическое увеличение высоты
            this.container.find('textarea').keyup(function () {
                this.style.height = (this.scrollHeight)+"px";
            }).trigger('keyup');
        };


        /**
         * Сохранение всех значений в скрытое поле формы
         */
        expansibleList.prototype.info = function () {

            // Сохранение данных
            var currentState = [];
            this.getListElement().find('textarea').each(function (key, item) {
                if (item.value.trim()) {
                    currentState.push({
                        key: key,
                        value: item.value.trim(),
                        author: this.currentUserName
                    })
                }
            }.bind(this));

            // Проверки на авторство конкретных строк
            currentState.forEach(function (currentStateRow) {
                var initialStateRow = this.initializeState[currentStateRow.key];

                // Если эта строка содержалась в изначальных данных
                if (initialStateRow) {
                    // Тогда проверяем изменился ли текст (если нет, то сохраняем предыдущего автора)
                    if (currentStateRow.value == initialStateRow.value) {
                        currentStateRow.author = initialStateRow.author;
                    }
                }
            }.bind(this));

            this.targetField.val(
                currentState.length
                ? JSON.stringify(currentState)
                : ''
            );
        };


        expansibleList.prototype.getListElement = function () {
            return this.container.find('ol');
        };

        return expansibleList;
    })(abstract);
});