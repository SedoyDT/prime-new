import {IAngularStatic} from "angular";
// импорт общего конфига с описанием подключения библиотек, которые не поддерживают requirejs
import defaultConfig from "../../../../config";

declare var angular: IAngularStatic;

// примененить настройкиe
requirejs.config(defaultConfig);

// загрузить файл ./page.module.ts и запустить angularjs на элементе <page></page>
require(['page.module'], () => angular.bootstrap('page', ['pageModule']));