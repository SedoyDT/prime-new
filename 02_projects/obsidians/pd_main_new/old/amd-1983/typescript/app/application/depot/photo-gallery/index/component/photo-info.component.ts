import {IComponentController, IPromise} from "angular";
import {AmdWindowComponent} from "../../../../../angular/component/amd-dialog/component/amd-window.component";
import {Component, Inject, Require} from "../../../../../angular/decorator/component.decorator";
import AjaxFormBackendService from "../../../../../angular/service/ajax-form-backend.service";

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

@Component({
    selector: 'photo-info',
    template: TEMPLATE,
})
export class PhotoInfoComponent implements IComponentController {

    @Require('^amdWindow')
    private amdWindow: AmdWindowComponent<{row}, boolean>;

    private loadingPromise: IPromise<any>;

    private claimId: number;

    private itemId: any;

    private photos: any;
    
    private photoIndex: number;

    public constructor(
        @Inject('AjaxFormBackendService') public ajaxService: AjaxFormBackendService,
    ) {
    }

    public $onInit() {
        this.photoIndex = 0;
        this.amdWindow.onChangeParams(() => {
            this.getDetailedPhotoListGroupFromServer(this.amdWindow.params.row.claimId, this.amdWindow.params.row.id);

        });
    }

    private getDetailedPhotoListGroupFromServer(claimId, itemId) {
        this.loadingPromise = this.ajaxService.get<{records: [item: {photo: string}], productId: number, order: number}>(
            '/claim/ajax/detailed-photo-list-group',{claimId: claimId, itemId: itemId}
        ).then((data) => {
                data.records.forEach(item => {
                    this.photos = item.photo.link;
                });
                this.photos.forEach(item => {
                    if (!item.type) {
                        item.publicLink = '/img/system/file-not-found-200.png';
                    }
                })
            });

        this.ajaxService.get('/depot/photo-gallery/get-claim-data',{claimId: claimId, itemId: itemId});
    }

    private increase()
    {
        console.log(this.photos) // frolov debug
        if (this.photoIndex == this.photos.length-1) {
            this.photoIndex = 0;
        } else {
            this.photoIndex = this.photoIndex + 1;
        }
    }

    private decrease()
    {
        console.log(this.photos) // frolov debug
        if (this.photoIndex == 0) {
            this.photoIndex = this.photos.length-1;
        } else {
            this.photoIndex = this.photoIndex - 1;
        }
    }
}

