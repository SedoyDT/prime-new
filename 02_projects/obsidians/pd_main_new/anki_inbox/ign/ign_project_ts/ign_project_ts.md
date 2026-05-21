
#ign_project_ts
#project_ts

#telegram 

# Что деллает import "ngLocaleRu";?
<!-- basicblock-start  deck='ign_project_ts' -->
Что деллает import "ngLocaleRu";?::

меняет отображение даты с Feb 9, 2023 на 9 февр. 2023 г.
<!-- basicblock-end -->




#ign_project_ts
#project_ts

#telegram 

# depot_tooltip.js
<!-- basicblock-start  deck='ign_project_ts' -->
depot_tooltip.js::


```

$('body').on('click', function(event) {
    // Если в контейнере есть активный tooltip, удаляем его
    $('div#depotTooltipContainer').empty();
});

$('body').on('click', '.depotTooltipWrapper', function(event){
    event.stopPropagation(); // Останавливаем распространение события, чтобы клик на tooltip не триггерил удаление

    // Клонируем текст текущего примечания (tooltip) из поля, для вставки в контейнер
    var tooltipTextInContainer = $(event.currentTarget).find('div#tooltipText').clone(true);
    // Есть ли в контейнере какие-либо tooltip-ы
    var isContainerHasTooltip = $('div#depotTooltipContainer').has('div#tooltipText').length > 0;
    // Содержится ли в контейнере текущий tooltip.
    var isTooltipAlreadyContained = $('div#depotTooltipContainer *').is('div#tooltipText[data-tooltip-id=' +tooltipTextInContainer.data('tooltip-id')+ ']');

    if (isContainerHasTooltip) {
        // Если в контейнере содержатся tooltip-ы, то чистим контейнер
        _emptyTooltipContainer();
        if (!isTooltipAlreadyContained) {
            // Если до чистки, в контейнере не было текущего tooltip, то добавляем и показываем его
            _showTooltip();
        }
    } else {
        // Контейнер пуст - добавляем и показываем текущий tooltip
        _showTooltip();
    }

    // добавить tooltip в контейнер и показать его
    function _showTooltip() {
        $('div#depotTooltipContainer').prepend(tooltipTextInContainer);
        tooltipTextInContainer.css({zIndex: 99999,  left:event.clientX+15, top:event.clientY+15}).fadeIn();
    }

    // Очистить контейнер
    function _emptyTooltipContainer() {
        $('div#depotTooltipContainer').empty();
    }
});
```
<!-- basicblock-end -->




#ign_project_ts
#project_ts

#telegram 

# **Общие моменты:**
<!-- basicblock-start  deck='ign_project_ts' -->
**Общие моменты:**::

1. **Плагин**: Код организован в виде плагина, который отвечает за отображение всплывающих подсказок (tooltips) на странице.
2. **Инициализация и настройки**: Перед использованием плагина, требуется его настройка, которая включает в себя установку прав, шаблонов и других параметров. Эти настройки проверяются на корректность перед использованием.
3. **Работа с DOM**: Используя jQuery, плагин взаимодействует с элементами DOM, чтобы добавлять, показывать и удалять tooltip'ы.
4. **Валидация**: Плагин включает функции валидации для проверки типов данных, таких как строки и объекты.
5. **Логирование**: Включена система предупреждений, которая собирает и выводит все ошибки или несоответствия, возникающие в процессе работы плагина.

Каждая функция и часть кода в этом плагине имеет четко определенное предназначение, что делает код более структурированным и поддерживаемым.
<!-- basicblock-end -->




#ign_project_ts
#project_ts

#telegram 

# // Проверка - была ли проведена корректная первичная настройка плагина.
<!-- basicblock-start  deck='ign_project_ts' -->
// Проверка - была ли проведена корректная первичная настройка плагина.::

        if (false == _self.isSettingsDone) {
            _self.warnings.setNew('Первичная инициализация плагина (settings) не проводилась, или проведена некорректно');
        }

        // Проверка прав пользователя на показ tooltip.
        if (false == checkPermissions()) {
            _self.warnings.setNew('Отсутствуют права на показ tooltip-примечания');
        }

        // Проверка корректности переданных опций.
        checkOptions(options);

        // Вывести предупреждения, если они есть.
        if (!_self.warnings.isEmpty()) {
            _self.warnings.printAll();
        }

        return _self;
    };

    /**
     * Проверка прав пользователя.
     * @returns {boolean} Возвращает true, если пользователь имеет право на показ tooltip.
     */
    function checkPermissions() {
        return (1 == _self.permissions || 2 == _self.permissions);
    }



    /**
     * Проверка корректности опций инициализации.
     * @param options Опции, переданные для инициализации.
     */
    function checkOptions(options) {
        // Если опции переданы, проверяем их корректность и добавляем в текущий объект опций.
        if (!_self.validate.isUndefined(options) && _self.validate.isObject(options)) {
            // Если передано имя HTML-шаблона, оно должно быть строкой.
            if (_self.validate.isString(options.htmlPatternName)) {
                _self.options.htmlPatternName = options.htmlPatternName;
            } else {
                _self.warnings.setNew('В метод init() передано некорректное имя HTML-шаблона');
            }

            // Если передано примечание, оно должно быть строкой.
            if (_self.validate.isString(options.annotation)) {
                _self.options.annotation = options.annotation;
            } else {
                _self.warnings.setNew('В метод init() передано некорректное значение примечания');
            }

            // Если передано имя заголовка, оно должно быть строкой.
            if (_self.validate.isString(options.headerName)) {
                _self.options.headerName = options.headerName;
            } else {
                _self.warnings.setNew('В метод init() передано некорректное имя заголовка');
            }
        } else {
            _self.warnings.setNew('Некорректные опции, переданные в метод init()');
        }
    }

    /**
     * Проверка корректности настроек перед первым использованием плагина.
     * @param settings Объект настроек, переданный при вызове settings().
     */
    function checkSettings(settings) {
        // Проверяем, что объект настроек был передан.
        if (_self.validate.isUndefined(settings)) {
            _self.warnings.setNew('Не переданы настройки плагина depot_tooltip');
        }

        // Проверяем, что объект настроек содержит все необходимые поля.
        if (!_self.validate.isObject(settings)) {
            _self.warnings.setNew('Некорректные настройки, переданные в метод settings()');
        } else {
            if (_self.validate.isUndefined(settings.permissions)) {
                _self.warnings.setNew('Не указаны права пользователя в настройках');
            }

            if (_self.validate.isUndefined(settings.headers)) {
                _self.warnings.setNew('Не указаны заголовки в настройках');
            }

            if (_self.validate.isUndefined(settings.configFields)) {
                _self.warnings.setNew('Не указаны поля для вставки примечаний в настройках');
            }

            if (_self.validate.isUndefined(settings.patternsList)) {
                _self.warnings.setNew('Не указаны HTML-шаблоны в настройках');
            }
        }
    }
})();
```
<!-- basicblock-end -->




#ign_project_ts
#project_ts

#telegram 

# /**
<!-- basicblock-start  deck='ign_project_ts' -->
/**::

     * Установка событий.
     *
     * Логика показа примечания:
     * - При клике на любой div.depotTooltipWrapper копируем из него текст примечания в контейнер div.depotTooltipContainer
     *   и сразу показываем пользователю.
     * - При повторном клике на div.depotTooltipWrapper текущего примечания или на само окно примечания удаляем текст из контейнера,
     *   скрывая его от пользователя.
     * - Контейнер div.depotTooltipContainer хранит текст только одного (текущего) примечания.
     *   При закрытии всех примечаний - контейнер пуст.
     */
    this.setEvents = function() {
        // Добавляем контейнер для хранения текущего tooltip на страницу.
        $('body').prepend('<div id="depotTooltipContainer"></div>');

        // Назначаем обработчик событий на клик по элементам с классом .depotTooltipWrapper.
        $('body').on('click', '.depotTooltipWrapper', function(event){
            // Клонируем текст текущего примечания (tooltip) из элемента и сохраняем его для вставки в контейнер.
            var tooltipTextInContainer = $(event.currentTarget).find('div#tooltipText').clone(true);
            // Проверяем, есть ли в контейнере какие-либо tooltip.
            var isContainerHasTooltip = $('div#depotTooltipContainer').has('div#tooltipText').length > 0;
            // Проверяем, содержится ли в контейнере текущий tooltip.
            var isTooltipAlreadyContained = $('div#depotTooltipContainer *').is('div#tooltipText[data-tooltip-id=' +tooltipTextInContainer.data('tooltip-id')+ ']');

            if (isContainerHasTooltip) {
                // Если в контейнере уже есть tooltip, очищаем контейнер.
                _emptyTooltipContainer();
                if (!isTooltipAlreadyContained) {
                    // Если в контейнере не было текущего tooltip, добавляем и показываем его.
                    _showTooltip();
                }
            } else {
                // Если контейнер пуст, добавляем и показываем текущий tooltip.
                _showTooltip();
            }

            /**
             * Добавить tooltip в контейнер и показать его.
             */
            function _showTooltip() {
                $('div#depotTooltipContainer').prepend(tooltipTextInContainer);
                tooltipTextInContainer.css({zIndex: 99999,  left:event.clientX+15, top:event.clientY+15}).fadeIn();
            }

            /**
             * Очистить контейнер от всех tooltip.
             */
            function _emptyTooltipContainer() {
                $('div#depotTooltipContainer').empty();
            }

            // Назначаем обработчик событий на клик по tooltip в контейнере, чтобы его удалить.
            $('body').on('click', 'div#depotTooltipContainer div#tooltipText[data-tooltip-id=' +tooltipTextInContainer.data('tooltip-id')+ ']',
                function() {
                    this.remove();
                }
            );
        });
    };

    /**
     * Настройка плагина перед первым использованием. Производится только один раз.
     * @param settings Объект настроек, содержащий необходимые параметры.
     */
    this.settings = function(settings) {
        checkSettings(settings); // Проверяем корректность настроек.

        // Устанавливаем права, шаблоны, заголовки и поля на основе переданных настроек.
        _self.permissions = settings.permissions;
        _self.patternsList = settings.patternsList;
        _self.headers = settings.headers;
        _self.configFields = settings.configFields;

        _self.setEvents(); // Устанавливаем события.
        _self.isSettingsDone = true; // Отмечаем, что настройка выполнена.

        return _self;
    };

    /**
     * Блок инициализации. Запускается каждый раз (только после настройки плагина (settings))
     * для получения конкретного экземпляра tooltip.
     * @param options Опции для инициализации tooltip.
     */
    this.init = function(options) {
        // Сбросить значения опций, оставшиеся после предыдущего использования, на значения по умолчанию.
        _self.resetOptionsToDefault();
<!-- basicblock-end -->




#ign_project_ts
#project_ts

#telegram 

# Конечно, давайте я добавлю комментарии, которые объяснят каждую часть кода:
<!-- basicblock-start  deck='ign_project_ts' -->
Конечно, давайте я добавлю комментарии, которые объяснят каждую часть кода:::


```javascript
/**
 * Плагин для создания всплывающих подсказок (tooltip) для товаров склада.
 * Использует jQuery для работы с DOM. Этот плагин позволяет отображать текстовые подсказки при клике на элементы страницы.
 */
var depot_tooltip = new (function() {
    var _self = this; // Ссылка на текущий объект для использования внутри вложенных функций.

    /**
     * Список заголовков, которые будут отображаться в tooltip. Заполняется при первичной настройке плагина.
     */
    this.headers = {};

    /**
     * Список полей, в которые разрешена вставка примечания (данные берутся из конфига).
     * Заполняется при первичной настройке плагина.
     */
    this.configFields = {};

    /**
     * Флаг, показывающий, была ли проведена корректная настройка плагина перед его первым использованием.
     */
    this.isSettingsDone = false;

    /**
     * HTML-шаблоны, например, иконки, при нажатии на которые срабатывает tooltip.
     * Заполняется при первичной настройке плагина.
     */
    this.patternsList = [];

    /**
     * Права пользователя. Заполняется при первичной настройке плагина.
     */
    this.permissions = 0;

    /**
     * Флаг, отображается ли в данный момент окно с tooltip.
     */
    this.isVisibleNow = false;

    /**
     * Валидаторы для проверки типов данных.
     */
    this.validate = {
        isString : function(param) {
            return 'string' == typeof param; // Проверка, является ли параметр строкой.
        },
        isUndefined : function(param) {
            return 'undefined' == typeof param; // Проверка, является ли параметр неопределенным.
        },
        isObject : function(param) {
            return 'object' == typeof param; // Проверка, является ли параметр объектом.
        }
    };

    /**
     * Объект для работы с предупреждениями и логированием.
     */
    this.warnings = {
        // Массив для хранения предупреждений.
        warningsList : [],
        // Метод для добавления нового предупреждения в список.
        setNew : function(text) {
            this.warningsList.push(text);
        },
        // Метод для вывода всех предупреждений в консоль.
        printAll : function() {
            console.log('В процессе работы плагина depot_tooltip возникли следующие предупреждения: ');
            this.warningsList.forEach(function (item, i) {
                console.log(i+1 + ') ' + item);
            });
        },
        // Метод проверки, пуст ли список предупреждений.
        isEmpty : function() {
            return 0 == this.warningsList.length;
        }
    };

    /**
     * Опции для инициализации. Заполняется при каждой инициализации.
     * Инициализация производится каждый раз при получении конкретного экземпляра tooltip.
     */
    this.options = {};

    /**
     * Восстановить значение опций инициализации по умолчанию.
     */
    this.resetOptionsToDefault = function() {
        // Сбрасываем опции к стандартным значениям.
        $.extend(_self.options, {
            htmlPatternName : '',
            annotation      : '',
            headerName      : 'default'
        });
    };

    /**
     * Проверка - разрешено ли добавлять примечание в поле.
     * @param annotationName Имя категории примечания. Например: примечание отдела закупок - annotationIn
     * @param field Имя проверяемого поля
     * @return {boolean} Возвращает true, если поле разрешено для добавления примечания.
     */
    this.isAllowedField = function(annotationName, field) {
        var fields = _self.configFields[annotationName]; // Получаем список разрешенных полей для данной категории.
        var isAllowed = false;

        // Проверяем, есть ли поле в списке разрешенных.
        for (var key in fields) {
            if (key == field || fields[key] == field) {
                isAllowed = true;
            }
        }

        return isAllowed; // Возвращаем результат проверки.
    };
<!-- basicblock-end -->




#ign_project_ts
#project_ts

#telegram 

# // Проверка - была ли проведена корректная первичная настройка плагина.
<!-- basicblock-start  deck='ign_project_ts' -->
// Проверка - была ли проведена корректная первичная настройка плагина.::

        if (false == _self.isSettingsDone) {
            _self.warnings.setNew('Первичная инициализация плагина (settings) не проводилась, или проведена некорректно');
        }

        // Проверка прав пользователя на показ tooltip.
        if (false == checkPermissions()) {
            _self.warnings.setNew('Отсутствуют права на показ tooltip-примечания');
        }

        // Проверка корректности переданных опций.
        checkOptions(options);

        // Вывести предупреждения, если они есть.
        if (!_self.warnings.isEmpty()) {
            _self.warnings.printAll();
        }

        return _self;
    };

    /**
     * Проверка прав пользователя.
     * @returns {boolean} Возвращает true, если пользователь имеет право на показ tooltip.
     */
    function checkPermissions() {
        return (1 == _self.permissions || 2 == _self.permissions);
    }
<!-- basicblock-end -->




#ign_project_ts
#project_ts

#telegram 

# /**
<!-- basicblock-start  deck='ign_project_ts' -->
/**::

     * Установка событий.
     *
     * Логика показа примечания:
     * - При клике на любой div.depotTooltipWrapper копируем из него текст примечания в контейнер div.depotTooltipContainer
     *   и сразу показываем пользователю.
     * - При повторном клике на div.depotTooltipWrapper текущего примечания или на само окно примечания удаляем текст из контейнера,
     *   скрывая его от пользователя.
     * - Контейнер div.depotTooltipContainer хранит текст только одного (текущего) примечания.
     *   При закрытии всех примечаний - контейнер пуст.
     */
    this.setEvents = function() {
        // Добавляем контейнер для хранения текущего tooltip на страницу.
        $('body').prepend('<div id="depotTooltipContainer"></div>');

        // Назначаем обработчик событий на клик по элементам с классом .depotTooltipWrapper.
        $('body').on('click', '.depotTooltipWrapper', function(event){
            // Клонируем текст текущего примечания (tooltip) из элемента и сохраняем его для вставки в контейнер.
            var tooltipTextInContainer = $(event.currentTarget).find('div#tooltipText').clone(true);
            // Проверяем, есть ли в контейнере какие-либо tooltip.
            var isContainerHasTooltip = $('div#depotTooltipContainer').has('div#tooltipText').length > 0;
            // Проверяем, содержится ли в контейнере текущий tooltip.
            var isTooltipAlreadyContained = $('div#depotTooltipContainer *').is('div#tooltipText[data-tooltip-id=' +tooltipTextInContainer.data('tooltip-id')+ ']');

            if (isContainerHasTooltip) {
                // Если в контейнере уже есть tooltip, очищаем контейнер.
                _emptyTooltipContainer();
                if (!isTooltipAlreadyContained) {
                    // Если в контейнере не было текущего tooltip, добавляем и показываем его.
                    _showTooltip();
                }
            } else {
                // Если контейнер пуст, добавляем и показываем текущий tooltip.
                _showTooltip();
            }

            /**
             * Добавить tooltip в контейнер и показать его.
             */
            function _showTooltip() {
                $('div#depotTooltipContainer').prepend(tooltipTextInContainer);
                tooltipTextInContainer.css({zIndex: 99999,  left:event.clientX+15, top:event.clientY+15}).fadeIn();
            }

            /**
             * Очистить контейнер от всех tooltip.
             */
            function _emptyTooltipContainer() {
                $('div#depotTooltipContainer').empty();
            }

            // Назначаем обработчик событий на клик по tooltip в контейнере, чтобы его удалить.
            $('body').on('click', 'div#depotTooltipContainer div#tooltipText[data-tooltip-id=' +tooltipTextInContainer.data('tooltip-id')+ ']',
                function() {
                    this.remove();
                }
            );
        });
    };

    /**
     * Настройка плагина перед первым использованием. Производится только один раз.
     * @param settings Объект настроек, содержащий необходимые параметры.
     */
    this.settings = function(settings) {
        checkSettings(settings); // Проверяем корректность настроек.

        // Устанавливаем права, шаблоны, заголовки и поля на основе переданных настроек.
        _self.permissions = settings.permissions;
        _self.patternsList = settings.patternsList;
        _self.headers = settings.headers;
        _self.configFields = settings.configFields;

        _self.setEvents(); // Устанавливаем события.
        _self.isSettingsDone = true; // Отмечаем, что настройка выполнена.

        return _self;
    };

    /**
     * Блок инициализации. Запускается каждый раз (только после настройки плагина (settings))
     * для получения конкретного экземпляра tooltip.
     * @param options Опции для инициализации tooltip.
     */
    this.init = function(options) {
        // Сбросить значения опций, оставшиеся после предыдущего использования, на значения по умолчанию.
        _self.resetOptionsToDefault();
<!-- basicblock-end -->




#ign_project_ts
#project_ts

#telegram 

# Конечно, давайте я добавлю комментарии, которые объяснят каждую часть кода:
<!-- basicblock-start  deck='ign_project_ts' -->
Конечно, давайте я добавлю комментарии, которые объяснят каждую часть кода:::


```javascript
/**
 * Плагин для создания всплывающих подсказок (tooltip) для товаров склада.
 * Использует jQuery для работы с DOM. Этот плагин позволяет отображать текстовые подсказки при клике на элементы страницы.
 */
var depot_tooltip = new (function() {
    var _self = this; // Ссылка на текущий объект для использования внутри вложенных функций.

    /**
     * Список заголовков, которые будут отображаться в tooltip. Заполняется при первичной настройке плагина.
     */
    this.headers = {};

    /**
     * Список полей, в которые разрешена вставка примечания (данные берутся из конфига).
     * Заполняется при первичной настройке плагина.
     */
    this.configFields = {};

    /**
     * Флаг, показывающий, была ли проведена корректная настройка плагина перед его первым использованием.
     */
    this.isSettingsDone = false;

    /**
     * HTML-шаблоны, например, иконки, при нажатии на которые срабатывает tooltip.
     * Заполняется при первичной настройке плагина.
     */
    this.patternsList = [];

    /**
     * Права пользователя. Заполняется при первичной настройке плагина.
     */
    this.permissions = 0;

    /**
     * Флаг, отображается ли в данный момент окно с tooltip.
     */
    this.isVisibleNow = false;

    /**
     * Валидаторы для проверки типов данных.
     */
    this.validate = {
        isString : function(param) {
            return 'string' == typeof param; // Проверка, является ли параметр строкой.
        },
        isUndefined : function(param) {
            return 'undefined' == typeof param; // Проверка, является ли параметр неопределенным.
        },
        isObject : function(param) {
            return 'object' == typeof param; // Проверка, является ли параметр объектом.
        }
    };

    /**
     * Объект для работы с предупреждениями и логированием.
     */
    this.warnings = {
        // Массив для хранения предупреждений.
        warningsList : [],
        // Метод для добавления нового предупреждения в список.
        setNew : function(text) {
            this.warningsList.push(text);
        },
        // Метод для вывода всех предупреждений в консоль.
        printAll : function() {
            console.log('В процессе работы плагина depot_tooltip возникли следующие предупреждения: ');
            this.warningsList.forEach(function (item, i) {
                console.log(i+1 + ') ' + item);
            });
        },
        // Метод проверки, пуст ли список предупреждений.
        isEmpty : function() {
            return 0 == this.warningsList.length;
        }
    };

    /**
     * Опции для инициализации. Заполняется при каждой инициализации.
     * Инициализация производится каждый раз при получении конкретного экземпляра tooltip.
     */
    this.options = {};

    /**
     * Восстановить значение опций инициализации по умолчанию.
     */
    this.resetOptionsToDefault = function() {
        // Сбрасываем опции к стандартным значениям.
        $.extend(_self.options, {
            htmlPatternName : '',
            annotation      : '',
            headerName      : 'default'
        });
    };

    /**
     * Проверка - разрешено ли добавлять примечание в поле.
     * @param annotationName Имя категории примечания. Например: примечание отдела закупок - annotationIn
     * @param field Имя проверяемого поля
     * @return {boolean} Возвращает true, если поле разрешено для добавления примечания.
     */
    this.isAllowedField = function(annotationName, field) {
        var fields = _self.configFields[annotationName]; // Получаем список разрешенных полей для данной категории.
        var isAllowed = false;

        // Проверяем, есть ли поле в списке разрешенных.
        for (var key in fields) {
            if (key == field || fields[key] == field) {
                isAllowed = true;
            }
        }

        return isAllowed; // Возвращаем результат проверки.
    };
<!-- basicblock-end -->




#ign_project_ts
#project_ts

#telegram 

# // Проверка - была ли проведена корректная первичная настройка плагина.
<!-- basicblock-start  deck='ign_project_ts' -->
// Проверка - была ли проведена корректная первичная настройка плагина.::

        if (false == _self.isSettingsDone) {
            _self.warnings.setNew('Первичная инициализация плагина (settings) не проводилась, или проведена некорректно');
        }

        // Проверка прав пользователя на показ tooltip.
        if (false == checkPermissions()) {
            _self.warnings.setNew('Отсутствуют права на показ tooltip-примечания');
        }

        // Проверка корректности переданных опций.
        checkOptions(options);

        // Вывести предупреждения, если они есть.
        if (!_self.warnings.isEmpty()) {
            _self.warnings.printAll();
        }

        return _self;
    };

    /**
     * Проверка прав пользователя.
     * @returns {boolean} Возвращает true, если пользователь имеет право на показ tooltip.
     */
    function checkPermissions() {
        return (1 == _self.permissions || 2 == _self.permissions);
    }
```
<!-- basicblock-end -->




#ign_project_ts
#project_ts

#telegram 

# /**
<!-- basicblock-start  deck='ign_project_ts' -->
/**::

     * Установка событий.
     *
     * Логика показа примечания:
     * - При клике на любой div.depotTooltipWrapper копируем из него текст примечания в контейнер div.depotTooltipContainer
     *   и сразу показываем пользователю.
     * - При повторном клике на div.depotTooltipWrapper текущего примечания или на само окно примечания удаляем текст из контейнера,
     *   скрывая его от пользователя.
     * - Контейнер div.depotTooltipContainer хранит текст только одного (текущего) примечания.
     *   При закрытии всех примечаний - контейнер пуст.
     */
    this.setEvents = function() {
        // Добавляем контейнер для хранения текущего tooltip на страницу.
        $('body').prepend('<div id="depotTooltipContainer"></div>');

        // Назначаем обработчик событий на клик по элементам с классом .depotTooltipWrapper.
        $('body').on('click', '.depotTooltipWrapper', function(event){
            // Клонируем текст текущего примечания (tooltip) из элемента и сохраняем его для вставки в контейнер.
            var tooltipTextInContainer = $(event.currentTarget).find('div#tooltipText').clone(true);
            // Проверяем, есть ли в контейнере какие-либо tooltip.
            var isContainerHasTooltip = $('div#depotTooltipContainer').has('div#tooltipText').length > 0;
            // Проверяем, содержится ли в контейнере текущий tooltip.
            var isTooltipAlreadyContained = $('div#depotTooltipContainer *').is('div#tooltipText[data-tooltip-id=' +tooltipTextInContainer.data('tooltip-id')+ ']');

            if (isContainerHasTooltip) {
                // Если в контейнере уже есть tooltip, очищаем контейнер.
                _emptyTooltipContainer();
                if (!isTooltipAlreadyContained) {
                    // Если в контейнере не было текущего tooltip, добавляем и показываем его.
                    _showTooltip();
                }
            } else {
                // Если контейнер пуст, добавляем и показываем текущий tooltip.
                _showTooltip();
            }

            /**
             * Добавить tooltip в контейнер и показать его.
             */
            function _showTooltip() {
                $('div#depotTooltipContainer').prepend(tooltipTextInContainer);
                tooltipTextInContainer.css({zIndex: 99999,  left:event.clientX+15, top:event.clientY+15}).fadeIn();
            }

            /**
             * Очистить контейнер от всех tooltip.
             */
            function _emptyTooltipContainer() {
                $('div#depotTooltipContainer').empty();
            }

            // Назначаем обработчик событий на клик по tooltip в контейнере, чтобы его удалить.
            $('body').on('click', 'div#depotTooltipContainer div#tooltipText[data-tooltip-id=' +tooltipTextInContainer.data('tooltip-id')+ ']',
                function() {
                    this.remove();
                }
            );
        });
    };

    /**
     * Настройка плагина перед первым использованием. Производится только один раз.
     * @param settings Объект настроек, содержащий необходимые параметры.
     */
    this.settings = function(settings) {
        checkSettings(settings); // Проверяем корректность настроек.

        // Устанавливаем права, шаблоны, заголовки и поля на основе переданных настроек.
        _self.permissions = settings.permissions;
        _self.patternsList = settings.patternsList;
        _self.headers = settings.headers;
        _self.configFields = settings.configFields;

        _self.setEvents(); // Устанавливаем события.
        _self.isSettingsDone = true; // Отмечаем, что настройка выполнена.

        return _self;
    };

    /**
     * Блок инициализации. Запускается каждый раз (только после настройки плагина (settings))
     * для получения конкретного экземпляра tooltip.
     * @param options Опции для инициализации tooltip.
     */
    this.init = function(options) {
        // Сбросить значения опций, оставшиеся после предыдущего использования, на значения по умолчанию.
        _self.resetOptionsToDefault();
<!-- basicblock-end -->




#ign_project_ts
#project_ts

#telegram 

# Конечно, давайте я добавлю комментарии, которые объяснят каждую часть кода:
<!-- basicblock-start  deck='ign_project_ts' -->
Конечно, давайте я добавлю комментарии, которые объяснят каждую часть кода:::


```javascript
/**
 * Плагин для создания всплывающих подсказок (tooltip) для товаров склада.
 * Использует jQuery для работы с DOM. Этот плагин позволяет отображать текстовые подсказки при клике на элементы страницы.
 */
var depot_tooltip = new (function() {
    var _self = this; // Ссылка на текущий объект для использования внутри вложенных функций.

    /**
     * Список заголовков, которые будут отображаться в tooltip. Заполняется при первичной настройке плагина.
     */
    this.headers = {};

    /**
     * Список полей, в которые разрешена вставка примечания (данные берутся из конфига).
     * Заполняется при первичной настройке плагина.
     */
    this.configFields = {};

    /**
     * Флаг, показывающий, была ли проведена корректная настройка плагина перед его первым использованием.
     */
    this.isSettingsDone = false;

    /**
     * HTML-шаблоны, например, иконки, при нажатии на которые срабатывает tooltip.
     * Заполняется при первичной настройке плагина.
     */
    this.patternsList = [];

    /**
     * Права пользователя. Заполняется при первичной настройке плагина.
     */
    this.permissions = 0;

    /**
     * Флаг, отображается ли в данный момент окно с tooltip.
     */
    this.isVisibleNow = false;

    /**
     * Валидаторы для проверки типов данных.
     */
    this.validate = {
        isString : function(param) {
            return 'string' == typeof param; // Проверка, является ли параметр строкой.
        },
        isUndefined : function(param) {
            return 'undefined' == typeof param; // Проверка, является ли параметр неопределенным.
        },
        isObject : function(param) {
            return 'object' == typeof param; // Проверка, является ли параметр объектом.
        }
    };

    /**
     * Объект для работы с предупреждениями и логированием.
     */
    this.warnings = {
        // Массив для хранения предупреждений.
        warningsList : [],
        // Метод для добавления нового предупреждения в список.
        setNew : function(text) {
            this.warningsList.push(text);
        },
        // Метод для вывода всех предупреждений в консоль.
        printAll : function() {
            console.log('В процессе работы плагина depot_tooltip возникли следующие предупреждения: ');
            this.warningsList.forEach(function (item, i) {
                console.log(i+1 + ') ' + item);
            });
        },
        // Метод проверки, пуст ли список предупреждений.
        isEmpty : function() {
            return 0 == this.warningsList.length;
        }
    };

    /**
     * Опции для инициализации. Заполняется при каждой инициализации.
     * Инициализация производится каждый раз при получении конкретного экземпляра tooltip.
     */
    this.options = {};

    /**
     * Восстановить значение опций инициализации по умолчанию.
     */
    this.resetOptionsToDefault = function() {
        // Сбрасываем опции к стандартным значениям.
        $.extend(_self.options, {
            htmlPatternName : '',
            annotation      : '',
            headerName      : 'default'
        });
    };

    /**
     * Проверка - разрешено ли добавлять примечание в поле.
     * @param annotationName Имя категории примечания. Например: примечание отдела закупок - annotationIn
     * @param field Имя проверяемого поля
     * @return {boolean} Возвращает true, если поле разрешено для добавления примечания.
     */
    this.isAllowedField = function(annotationName, field) {
        var fields = _self.configFields[annotationName]; // Получаем список разрешенных полей для данной категории.
        var isAllowed = false;

        // Проверяем, есть ли поле в списке разрешенных.
        for (var key in fields) {
            if (key == field || fields[key] == field) {
                isAllowed = true;
            }
        }

        return isAllowed; // Возвращаем результат проверки.
    };
<!-- basicblock-end -->




#ign_project_ts
#project_ts

#telegram 

# // Проверка - была ли проведена корректная первичная настройка плагина.
<!-- basicblock-start  deck='ign_project_ts' -->
// Проверка - была ли проведена корректная первичная настройка плагина.::

        if (false == _self.isSettingsDone) {
            _self.warnings.setNew('Первичная инициализация плагина (settings) не проводилась, или проведена некорректно');
        }

        // Проверка прав пользователя на показ tooltip.
        if (false == checkPermissions()) {
            _self.warnings.setNew('Отсутствуют права на показ tooltip-примечания');
        }

        // Проверка корректности переданных опций.
        checkOptions(options);

        // Вывести предупреждения, если они есть.
        if (!_self.warnings.isEmpty()) {
            _self.warnings.printAll();
        }

        return _self;
    };

    /**
     * Проверка прав пользователя.
     * @returns {boolean} Возвращает true, если пользователь имеет право на показ tooltip.
     */
    function checkPermissions() {
        return (1 == _self.permissions || 2 == _self.permissions);
    }
<!-- basicblock-end -->




#ign_project_ts
#project_ts

#telegram 

# /**
<!-- basicblock-start  deck='ign_project_ts' -->
/**::

     * Установка событий.
     *
     * Логика показа примечания:
     * - При клике на любой div.depotTooltipWrapper копируем из него текст примечания в контейнер div.depotTooltipContainer
     *   и сразу показываем пользователю.
     * - При повторном клике на div.depotTooltipWrapper текущего примечания или на само окно примечания удаляем текст из контейнера,
     *   скрывая его от пользователя.
     * - Контейнер div.depotTooltipContainer хранит текст только одного (текущего) примечания.
     *   При закрытии всех примечаний - контейнер пуст.
     */
    this.setEvents = function() {
        // Добавляем контейнер для хранения текущего tooltip на страницу.
        $('body').prepend('<div id="depotTooltipContainer"></div>');

        // Назначаем обработчик событий на клик по элементам с классом .depotTooltipWrapper.
        $('body').on('click', '.depotTooltipWrapper', function(event){
            // Клонируем текст текущего примечания (tooltip) из элемента и сохраняем его для вставки в контейнер.
            var tooltipTextInContainer = $(event.currentTarget).find('div#tooltipText').clone(true);
            // Проверяем, есть ли в контейнере какие-либо tooltip.
            var isContainerHasTooltip = $('div#depotTooltipContainer').has('div#tooltipText').length > 0;
            // Проверяем, содержится ли в контейнере текущий tooltip.
            var isTooltipAlreadyContained = $('div#depotTooltipContainer *').is('div#tooltipText[data-tooltip-id=' +tooltipTextInContainer.data('tooltip-id')+ ']');

            if (isContainerHasTooltip) {
                // Если в контейнере уже есть tooltip, очищаем контейнер.
                _emptyTooltipContainer();
                if (!isTooltipAlreadyContained) {
                    // Если в контейнере не было текущего tooltip, добавляем и показываем его.
                    _showTooltip();
                }
            } else {
                // Если контейнер пуст, добавляем и показываем текущий tooltip.
                _showTooltip();
            }

            /**
             * Добавить tooltip в контейнер и показать его.
             */
            function _showTooltip() {
                $('div#depotTooltipContainer').prepend(tooltipTextInContainer);
                tooltipTextInContainer.css({zIndex: 99999,  left:event.clientX+15, top:event.clientY+15}).fadeIn();
            }

            /**
             * Очистить контейнер от всех tooltip.
             */
            function _emptyTooltipContainer() {
                $('div#depotTooltipContainer').empty();
            }

            // Назначаем обработчик событий на клик по tooltip в контейнере, чтобы его удалить.
            $('body').on('click', 'div#depotTooltipContainer div#tooltipText[data-tooltip-id=' +tooltipTextInContainer.data('tooltip-id')+ ']',
                function() {
                    this.remove();
                }
            );
        });
    };

    /**
     * Настройка плагина перед первым использованием. Производится только один раз.
     * @param settings Объект настроек, содержащий необходимые параметры.
     */
    this.settings = function(settings) {
        checkSettings(settings); // Проверяем корректность настроек.

        // Устанавливаем права, шаблоны, заголовки и поля на основе переданных настроек.
        _self.permissions = settings.permissions;
        _self.patternsList = settings.patternsList;
        _self.headers = settings.headers;
        _self.configFields = settings.configFields;

        _self.setEvents(); // Устанавливаем события.
        _self.isSettingsDone = true; // Отмечаем, что настройка выполнена.

        return _self;
    };

    /**
     * Блок инициализации. Запускается каждый раз (только после настройки плагина (settings))
     * для получения конкретного экземпляра tooltip.
     * @param options Опции для инициализации tooltip.
     */
    this.init = function(options) {
        // Сбросить значения опций, оставшиеся после предыдущего использования, на значения по умолчанию.
        _self.resetOptionsToDefault();
<!-- basicblock-end -->




#ign_project_ts
#project_ts

#telegram 

# Конечно, давайте я добавлю комментарии, которые объяснят каждую часть кода:
<!-- basicblock-start  deck='ign_project_ts' -->
Конечно, давайте я добавлю комментарии, которые объяснят каждую часть кода:::


```javascript
/**
 * Плагин для создания всплывающих подсказок (tooltip) для товаров склада.
 * Использует jQuery для работы с DOM. Этот плагин позволяет отображать текстовые подсказки при клике на элементы страницы.
 */
var depot_tooltip = new (function() {
    var _self = this; // Ссылка на текущий объект для использования внутри вложенных функций.

    /**
     * Список заголовков, которые будут отображаться в tooltip. Заполняется при первичной настройке плагина.
     */
    this.headers = {};

    /**
     * Список полей, в которые разрешена вставка примечания (данные берутся из конфига).
     * Заполняется при первичной настройке плагина.
     */
    this.configFields = {};

    /**
     * Флаг, показывающий, была ли проведена корректная настройка плагина перед его первым использованием.
     */
    this.isSettingsDone = false;

    /**
     * HTML-шаблоны, например, иконки, при нажатии на которые срабатывает tooltip.
     * Заполняется при первичной настройке плагина.
     */
    this.patternsList = [];

    /**
     * Права пользователя. Заполняется при первичной настройке плагина.
     */
    this.permissions = 0;

    /**
     * Флаг, отображается ли в данный момент окно с tooltip.
     */
    this.isVisibleNow = false;

    /**
     * Валидаторы для проверки типов данных.
     */
    this.validate = {
        isString : function(param) {
            return 'string' == typeof param; // Проверка, является ли параметр строкой.
        },
        isUndefined : function(param) {
            return 'undefined' == typeof param; // Проверка, является ли параметр неопределенным.
        },
        isObject : function(param) {
            return 'object' == typeof param; // Проверка, является ли параметр объектом.
        }
    };

    /**
     * Объект для работы с предупреждениями и логированием.
     */
    this.warnings = {
        // Массив для хранения предупреждений.
        warningsList : [],
        // Метод для добавления нового предупреждения в список.
        setNew : function(text) {
            this.warningsList.push(text);
        },
        // Метод для вывода всех предупреждений в консоль.
        printAll : function() {
            console.log('В процессе работы плагина depot_tooltip возникли следующие предупреждения: ');
            this.warningsList.forEach(function (item, i) {
                console.log(i+1 + ') ' + item);
            });
        },
        // Метод проверки, пуст ли список предупреждений.
        isEmpty : function() {
            return 0 == this.warningsList.length;
        }
    };

    /**
     * Опции для инициализации. Заполняется при каждой инициализации.
     * Инициализация производится каждый раз при получении конкретного экземпляра tooltip.
     */
    this.options = {};

    /**
     * Восстановить значение опций инициализации по умолчанию.
     */
    this.resetOptionsToDefault = function() {
        // Сбрасываем опции к стандартным значениям.
        $.extend(_self.options, {
            htmlPatternName : '',
            annotation      : '',
            headerName      : 'default'
        });
    };

    /**
     * Проверка - разрешено ли добавлять примечание в поле.
     * @param annotationName Имя категории примечания. Например: примечание отдела закупок - annotationIn
     * @param field Имя проверяемого поля
     * @return {boolean} Возвращает true, если поле разрешено для добавления примечания.
     */
    this.isAllowedField = function(annotationName, field) {
        var fields = _self.configFields[annotationName]; // Получаем список разрешенных полей для данной категории.
        var isAllowed = false;

        // Проверяем, есть ли поле в списке разрешенных.
        for (var key in fields) {
            if (key == field || fields[key] == field) {
                isAllowed = true;
            }
        }

        return isAllowed; // Возвращаем результат проверки.
    };
<!-- basicblock-end -->




#ign_project_ts
#project_ts

#telegram 

# <pre ng-if="$ctrl.sql">{{$ctrl.sql}}</pre> 
<!-- basicblock-start  deck='ign_project_ts' -->
<pre ng-if="$ctrl.sql">{{$ctrl.sql}}</pre> ::

 вывод запроса sql в компоненте захара
/home/anatoluy/amd-docker-dev/data/www/lp/development/typescript/app/application/cash/index/money/component/page.component.ts
<!-- basicblock-end -->



