var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "../../../../../angular/decorator/component.decorator"], function (require, exports, component_decorator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PhotoInfoComponent = void 0;
    const TEMPLATE = `
<amd-dialog data-wait-promise="$ctrl.loadingPromise" >
    <dialog-header>
          <p>Информация о фото</p>
    </dialog-header>
    <dialog-body>
    <div class="photos-container">
        <div class="photos-container__item photos-container__item_left">
            <amd-icon style="font-size: 7em" ng-click="$ctrl.decrease()">angleLeft</amd-icon>
        </div>
        <div class="photos-container__item photos-container__item_centered">
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column">
                    <p>{{$ctrl.photos[$ctrl.photoIndex].title}}</p>    
                    <img src='{{$ctrl.photos[$ctrl.photoIndex].publicLink}}' class='photo-container__image'
                        alt='Фото {{$ctrl.photos[$ctrl.photoIndex].fileName}}' />
            </div>
        </div>
        <div class="photos-container__item photos-container__item_right">
            <amd-icon style="font-size: 7em" ng-click="$ctrl.increase()">angleRight</amd-icon>
        </div>
        <div class="photos-container__item photos-container__item_claim-info"></div>
    </div>
    </dialog-body>
    <dialog-footer>
        <amd-button ng-click="$ctrl.amdWindow.hide()">Закрыть</amd-button>
    </dialog-footer>
</amd-dialog>
`;
    let PhotoInfoComponent = class PhotoInfoComponent {
        constructor(ajaxService) {
            this.ajaxService = ajaxService;
        }
        $onInit() {
            this.photoIndex = 0;
            this.amdWindow.onChangeParams(() => {
                this.getDetailedPhotoListGroupFromServer(this.amdWindow.params.row.claimId, this.amdWindow.params.row.id);
            });
        }
        getDetailedPhotoListGroupFromServer(claimId, itemId) {
            this.loadingPromise = this.ajaxService.get('/claim/ajax/detailed-photo-list-group', { claimId: claimId, itemId: itemId }).then((data) => {
                data.records.forEach(item => {
                    this.photos = item.photo.link;
                });
                this.photos.forEach(item => {
                    if (!item.type) {
                        item.publicLink = '/img/system/file-not-found-200.png';
                    }
                });
            });
            this.ajaxService.get('/depot/photo-gallery/get-claim-data', { claimId: claimId, itemId: itemId });
        }
        increase() {
            console.log(this.photos);
            if (this.photoIndex == this.photos.length - 1) {
                this.photoIndex = 0;
            }
            else {
                this.photoIndex = this.photoIndex + 1;
            }
        }
        decrease() {
            console.log(this.photos);
            if (this.photoIndex == 0) {
                this.photoIndex = this.photos.length - 1;
            }
            else {
                this.photoIndex = this.photoIndex - 1;
            }
        }
    };
    exports.PhotoInfoComponent = PhotoInfoComponent;
    __decorate([
        (0, component_decorator_1.Require)('^amdWindow')
    ], PhotoInfoComponent.prototype, "amdWindow", void 0);
    exports.PhotoInfoComponent = PhotoInfoComponent = __decorate([
        (0, component_decorator_1.Component)({
            selector: 'photo-info',
            template: TEMPLATE,
        }),
        __param(0, (0, component_decorator_1.Inject)('AjaxFormBackendService'))
    ], PhotoInfoComponent);
});
