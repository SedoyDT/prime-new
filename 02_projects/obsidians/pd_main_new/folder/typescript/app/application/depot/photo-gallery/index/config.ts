import {IAngularStatic} from "angular";
import defaultConfig from "../../../../config";

declare var angular: IAngularStatic;

requirejs.config(defaultConfig);

require(['page.module'], () => angular.bootstrap('page', ['pageModule']));