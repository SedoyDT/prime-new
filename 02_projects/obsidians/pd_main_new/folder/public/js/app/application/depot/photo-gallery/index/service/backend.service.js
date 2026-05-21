var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "../../../../../angular/decorator/component.decorator", "../../../../../angular/service/ajax-form-backend.service"], function (require, exports, component_decorator_1, ajax_form_backend_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BackendService = void 0;
    let BackendService = class BackendService {
        constructor(httpService) {
            this.httpService = httpService;
        }
        getBlockInfo(itemId) {
            console.log(itemId);
        }
    };
    exports.BackendService = BackendService;
    exports.BackendService = BackendService = __decorate([
        (0, component_decorator_1.Injectable)(),
        __param(0, (0, component_decorator_1.Inject)(ajax_form_backend_service_1.default))
    ], BackendService);
});
