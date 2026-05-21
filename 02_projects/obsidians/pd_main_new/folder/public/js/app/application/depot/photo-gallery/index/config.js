define(["require", "exports", "../../../../config"], function (require, exports, config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    requirejs.config(config_1.default);
    require(['page.module'], () => angular.bootstrap('page', ['pageModule']));
});
