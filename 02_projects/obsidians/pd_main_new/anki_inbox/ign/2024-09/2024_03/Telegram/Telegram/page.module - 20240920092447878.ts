import {PageComponent} from "./component/page.component";
import {Module} from "../../../../angular/decorator/module.decorator";
import mod = require("module");
import {
    AMD_ACCESS_SERVICE_DATA,
    AmdAccessModule
} from "../../../../angular/service/amd-access.module";
import AmdFieldsModule from "../../../../angular/component/amd-fields/amd-fields.module";
import AmdSubFilterModule from "../../../../angular/component/amd-sub-filter/amd-sub-filter.module";
import {AmdButtonModule} from "../../../../angular/directive/amd-button/amd-button.module";
import {AmdGrid2Module} from "../../../../angular/component/amd-grid/amd-grid2.module";
import "ngLocaleRu";
import {AmdIconModule} from "../../../../angular/component/amd-icon/amd-icon.module";
import {DepotFiltersModule} from "../../../../angular/filter/depot/depot-filters.module";
import {AmdFieldsHiderModule} from "../../../../angular/component/amd-grid/fields-hider/amd-fields-hider.module";
import {
    ProductMeasureTypeHintComponent
} from "../../../../angular/component/amd-grid/elements/product-measure-type-hint.component";
import {AmdDialogModule} from "../../../../angular/component/amd-dialog/amd-dialog.module";
import {SetAnnotationFormComponent} from "./component/set-annotation.component";
import {AnnotationComponent} from "../../../claim/components/fields/annotation/component/annotation.component";
import {AmdClaimAnnotationModule} from "../../../claim/components/fields/annotation/amd-claim-annotation.module";
import {
    AmdClaimUnloadAddressModule
} from "../../../claim/components/fields/unload-manager/amd-claim-unload-address.module";
import {AmdClaimDimensionsModule} from "../../../claim/components/fields/dimensions/amd-claim-dimensions.module";
import {AmdClaimDispatcherModule} from "../../../claim/components/fields/dispatcher/amd-claim-dispatcher.module";
import {DeliveryComponent} from "../../../claim/components/fields/delivery/component/delivery.component";
import {CarTypeComponent} from "../../../claim/components/fields/delivery/component/car-type.component";
import {RentPriceComponent} from "../../../claim/components/fields/delivery/component/rent-price.component";
import {CarDataComponent} from "../../../claim/components/fields/delivery/component/car-data.component";
import {TypeComponent} from "../../../claim/components/fields/delivery/component/type.component";
import {CarProxyComponent} from "../../../claim/components/fields/delivery/component/car-proxy.component";

@Module({
    declarations: [
        PageComponent,
        ProductMeasureTypeHintComponent,
        SetAnnotationFormComponent,

        DeliveryComponent,
        CarTypeComponent,
        RentPriceComponent,
        CarDataComponent,
        TypeComponent,
        CarProxyComponent,
    ],
    providers   : [
        {provide: 'ConfigService', useValue: mod.config()},
        {provide: AMD_ACCESS_SERVICE_DATA, useValue: mod.config().access},
    ],
    imports     : [
        AmdAccessModule,
        AmdGrid2Module,
        DepotFiltersModule,
        AmdFieldsModule,
        AmdSubFilterModule,
        AmdButtonModule,
        AmdIconModule,
        AmdFieldsHiderModule,
        AmdDialogModule,
        AmdClaimAnnotationModule,

        AmdClaimUnloadAddressModule,
        AmdClaimDimensionsModule,
        AmdClaimDispatcherModule,
        AmdClaimAnnotationModule,
        AmdButtonModule,
    ],
})
export class PageModule {}