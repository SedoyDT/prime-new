/**
 * {Template_Description_Abstract}
 *
 * @author Popov K. konstantin.icreative@gmail.com
 * @date_created 12.07.17
 * @copyright {Template_Description_Copyrights}
 */

var dependencies = [];

define(dependencies, function () {
    var app = angular.module('modules.total-price.forms.index.resources');

    /**
     * Сервис для инициализации tinyMCE редактора
     */
    app.directive('tinymce', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ngModel) {

                var options, tinyInstance;

                options = Object.assign(
                    {},
                    AMD_TINY_MCE_DEFAULT_OPTIONS,
                    {
                        // Update model when calling setContent (such as from the source editor popup)
                        setup: function (ed) {
                            ed.on('init', function (args) {
                                tinyInstance = ed;
                                ngModel.$render();
                            });
                            // Update model on button click
                            ed.on('ExecCommand', function (e) {
                                ed.info();
                                ngModel.$setViewValue(elm.val());
                                if (!scope.$$phase) {
                                    scope.$apply();
                                }
                            });
                            // Update model on keypress
                            ed.on('keyup', function (e) {
                                ed.info();
                                ngModel.$setViewValue(elm.val());
                                if (!scope.$$phase) {
                                    scope.$apply();
                                }
                            });
                        },
                        selector: `#${attrs.id}`,
                        // mode: 'exact',
                        // elements: attrs.id
                    }
                );

                if (attrs.tinymce) {
                    angular.extend(options, scope.$eval(attrs.tinymce));
                }

                if (attrs.width) {
                    angular.extend(options, {width: attrs.width});
                }

                if (attrs.height) {
                    angular.extend(options, {height: attrs.height});
                }

                // Отложенная инициализация tinyMCE, когда форма будет отрисована
                scope.$watch('dataService.isAjaxFormLoaded',
                    function (value) {
                        if (value) {
                            tinymce.init(options);
                        }
                    }
                );

                ngModel.$render = function () {
                    // if (!tinyInstance) {
                    //     tinyInstance = tinymce.get(attrs.id);
                    // }
                    if (tinyInstance) {
                        tinyInstance.setContent(ngModel.$viewValue || '');
                    }
                };
            }
        };
    }]);
});
