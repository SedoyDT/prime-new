/**
 * Контроллер полей листа согласования "Аренда"
 *
 * @author Popov K. <konstantin.icreative@gmail.com>
 * @package Agreement
 * @subpackage Editor
 * @date_created 10.05.2017
 * @copyright ${Template_Description_Copyrights}
 */

var dependencies = [
    '/js/agreement/editor/abstract/form/abstract.js'
];

define(dependencies, function (abstract) {

    // Наследование об абстрактной формы
    return (function (abstract) {
        /**
         * Конструктор
         * @param options
         */
        var rentForm = function (options) {
            abstract.apply(this, arguments);
        };

        rentForm.prototype = Object.create(abstract.prototype);
        rentForm.prototype.constructor = abstract;


        /**
         * Поле может попросить форму проверить необходимость показать, скрыть те или иные элементы
         * @param currentField
         */
        rentForm.prototype.checkFieldsVisible = function (currentField) {
            this.fields.forEach(function (field) {
                // Не проверяем текущее поле
                if (field == currentField) {
                    return;
                }
                // Если поле типа select и оно открыто, то при открытии другого необходимо его закрыть
                if (field.type == 'select' && field.isOpen()) {
                    field.hide();
                }
            });
        };


        /**
         * Необходимые действия перед отправкой формы
         */
        rentForm.prototype.beforeSubmit = function () {
            this.fields.forEach(function (field) {
                // Сохранение значений в скрытое поле перед отправкой
                if (field.type == 'expansibleList') {
                    field.info();
                }
            }.bind(this));
        };

        return rentForm;
    })(abstract);
});