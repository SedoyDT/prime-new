import {PageComponent} from "./component/page.component"
import {Module} from "../../../../angular/decorator/module.decorator";
import {AmdCommonServiceModule} from "../../../../angular/common-service";
import {AmdGrid2Module} from "../../../../angular/component/amd-grid/amd-grid2.module";
import AmdSubFilterModule from "../../../../angular/component/amd-sub-filter/amd-sub-filter.module";
import {AmdTrustAsHtmlModule} from "../../../../angular/filter/trust-as-html.filter";
import {AmdNetworkServiceModule} from "../../../../angular/service/network-service.module";
import {AmdDialogModule} from "../../../../angular/component/amd-dialog/amd-dialog.module";
import {PhotoInfoComponent} from "./component/photo-info.component";
import {AmdIconModule} from "../../../../angular/component/amd-icon/amd-icon.module";
import {AmdPanelRowModule} from "../../../../angular/component/amd-panel-row/amd-panel-row.component";
import {AmdContentModule} from "../../../../angular/component/amd-content/amd-content.module";
import mod = require("module");
import {AmdButtonModule} from "../../../../angular/directive/amd-button/amd-button.module";

@Module({
    declarations: [
        PageComponent,
        PhotoInfoComponent

    ],
    providers   : [
        {provide: 'ConfigService', useValue: mod.config()},

    ],
    imports     : [
        AmdCommonServiceModule,
        AmdGrid2Module,
        AmdSubFilterModule,
        AmdTrustAsHtmlModule,
        AmdNetworkServiceModule,
        AmdDialogModule,
        AmdIconModule,
        AmdContentModule,
        AmdPanelRowModule,
        AmdButtonModule
    ],

})
export class PageModule
{
}


