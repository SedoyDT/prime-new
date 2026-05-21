import {IComponentController, IScope, ITimeoutService} from "angular";
import {Component, Inject} from "../../../../../angular/decorator/component.decorator";
import AmdGridComponent from "../../../../../angular/component/amd-grid/amd-grid.component";
import HttpDataSource from "../../../../../angular/component/amd-grid/data-source/http.data-source";
import {AmdAccessService} from "../../../../../angular/service/amd-access.module";
import {
    DatatableTemplateGenerator
} from "../../../../../angular/component/amd-grid/generator/datatable-template.generator";
import {FILTER_CONFIG} from "../filter.config";
import {
    FieldsHiderDataModel
} from "../../../../../angular/component/amd-grid/fields-hider/model/fields-hider-data.model";
import {FieldsHiderFactory} from "../../../../../angular/component/amd-grid/generator/fields-hider.factory";
import {TParams} from "../../../potential-clients/index/component/shipped-info.component";
import {AmdWindowService} from "../../../../../angular/component/amd-dialog/service/amd-window.service";

@Component({
    selector: 'page',
    template: `
        <amd-grid 
            data-bind-view-child="$ctrl.setViewChild(grid)"
            data-data-source="$ctrl.gridDataSource"
            data-default-mask="{}"
            data-fields-hider-model="$ctrl.fieldsHiderModel"
        >
            <filter-left-controls>
                <amd-fields-hider></amd-fields-hider>
            </filter-left-controls>
            ${(new DatatableTemplateGenerator()).generate(FILTER_CONFIG)}
        </amd-grid>
    `,
})
export class PageComponent implements IComponentController
{

    private gridDataSource: HttpDataSource<any>

    private grid: AmdGridComponent<any>;

    private fieldsHiderModel: FieldsHiderDataModel = (new FieldsHiderFactory).factory(FILTER_CONFIG,'analytics.manages-blocks.list');

    public constructor(
        @Inject(AmdAccessService) private accessService: AmdAccessService,
        @Inject(AmdWindowService) private amdWindowService: AmdWindowService
    )
    {
        this.gridDataSource   = new HttpDataSource({
            result: "/analitics/managersblocks/list/get-filter-result",
            config: "/analitics/managersblocks/list/get-filter-config",
            mask  : "/analitics/managersblocks/list/get-filter-mask",
            excel : "/analitics/managersblocks/list/get-filter-excel"
        });
    }


    public $onInit(): void
    {
        if (!this.accessService.getAccess('managersblocks>gridfields>client_buyer').isAllowed()) {
            this.fieldsHiderModel.disable("client_buyer")
        }
        if (!this.accessService.getAccess('managersblocks>gridfields>client').isAllowed()) {
            this.fieldsHiderModel.disable("client")
        }
        if (!this.accessService.getAccess('managersblocks>annotation').isAllowed()) {
            this.fieldsHiderModel.disable("annotation_value")
        }
    }

    setViewChild(component)
    {
        this.grid = component;
    }

    public setAnnotation(row)
    {
        console.log(row) // frolov debug

        this.amdWindowService
            .get<TParams, void>({
                destroyOnHide: true,
                width        : 200,
                template     : `<set-annotation></set-annotation>`,
            })
            .show()
            // .then( ()=> {} );
    }

}
