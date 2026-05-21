import {Module} from "../../../angular/decorator/module.decorator";
import AmdGridModule from "../../../angular/component/amd-grid/amd-grid.module";
import {PageComponent} from "./component/page.component";
import mod = require("module");
import {AmdButtonModule} from "../../../angular/directive/amd-button/amd-button.module";
import {AmdCommonServiceModule} from "../../../angular/common-service";
import {AmdDialogModule} from "../../../angular/component/amd-dialog/amd-dialog.module";
import {FormComponent} from "./component/form.component";

@Module({
    imports     : [
        AmdGridModule,
        AmdButtonModule,
        AmdCommonServiceModule,
        AmdDialogModule,
    ],
    declarations: [
        PageComponent,
        FormComponent,
    ],
    providers   : [
        {provide: 'ConfigService', useValue: mod.config()},
],
})
export class PageModule {}
