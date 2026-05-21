import {PageComponent} from "./component/page.component"
import {Module} from "../../../../angular/decorator/module.decorator";
import {AmdCommonServiceModule} from "../../../../angular/common-service";
import {AmdButtonModule} from "../../../../angular/directive/amd-button/amd-button.module";
import {
    ProductMeasureTypeHintComponent
} from "../../../../angular/component/amd-grid/elements/product-measure-type-hint.component";
import {AmdGrid2Module} from "../../../../angular/component/amd-grid/amd-grid2.module";
import AmdSubFilterModule from "../../../../angular/component/amd-sub-filter/amd-sub-filter.module";

// import {BackendService} from "../../../analytics/potential-clients/index/service/backend.service";

// import {BackendService} from "./service/backend.service";

import AmdGridModule from "../../../../angular/component/amd-grid/amd-grid.module";
import {DepotFiltersModule} from "../../../../angular/filter/depot/depot-filters.module";
import CommonFilters from "../../../../angular/common-filters";
import {AmdIconModule} from "../../../../angular/component/amd-icon/amd-icon.module";
import {AmdDialogModule} from "../../../../angular/component/amd-dialog/amd-dialog.module";
import AmdZendFormModule from "../../../../angular/component/amd-zend-form/amd-zend-form.module";
import {AmdDatatableModule} from "../../../../angular/directive/markup/amd-datatable.directive";
import mod = require("module");
import {AmdTrustAsHtmlModule} from "../../../../angular/filter/trust-as-html.filter";
import {AmdNetworkServiceModule} from "../../../../angular/service/network-service.module";

@Module({
    declarations: [
        PageComponent,
        ProductMeasureTypeHintComponent,

    ],
    providers   : [
        // BackendService
        {provide: 'ConfigService', useValue: mod.config()},

    ],
    imports     : [
        AmdButtonModule,
        AmdCommonServiceModule,
        AmdGrid2Module,
        AmdSubFilterModule,
        AmdTrustAsHtmlModule,
        AmdNetworkServiceModule,

        // AmdCommonServiceModule,
        // AmdGridModule,
        // DepotFiltersModule,
        // CommonFilters,
        // AmdIconModule,
        // AmdDialogModule,
        // AmdZendFormModule,
        // AmdDatatableModule,
    ],

})
export class PageModule
{
}


