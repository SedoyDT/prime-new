import {Inject, Injectable} from "../../../../angular/decorator/component.decorator";
import AjaxFormBackendService from "../../../../angular/service/ajax-form-backend.service";
import {AJAX_FORM_BACKEND_SERVICE, TAjaxFormDataResponse} from "../../../../angular/service/network-service.module";
import {TAmdSelectRow} from "../../../../angular/component/amd-select/amd-select";

/**
 * Сервис для отправки запросов, связанных с ОКК, на бэкенд
 */
@Injectable()
export class BackendService
{
    /**
     * @param httpService
     */
    public constructor(
        @Inject(AJAX_FORM_BACKEND_SERVICE) private httpService: AjaxFormBackendService,
    )
    {
    }

    /**
     * Отправить запрос на получение воронок подтверждения
     */
    public getConfirmFunnels()
    {
        return this.httpService.get<TAjaxFormDataResponse<TAmdSelectRow<{ is_confirm: boolean }>[]>>(
            '/sales-funnel/quality-control_confirm-funnels/get-funnels'
        );
    }

    /**
     * Отправить запрос на получение воронок подтверждения
     */
    public getConfirmStages()
    {
        return this.httpService.get<TAjaxFormDataResponse<TAmdSelectRow[]>>(
            '/sales-funnel/quality-control_confirm-funnels/get-stages'
        );
    }

    public getConfirmStagesFunnels()
    {
        return this.getConfirmStages() && this.getConfirmFunnels()
    }
    /**
     * Отправить запрос на установку воронок подтверждения
     * @param funnelIds
     */
    public setConfirmFunnels(funnelIds: string[])
    {
        return this.httpService.post<TAjaxFormResponse>(
            '/sales-funnel/quality-control_confirm-funnels/set-funnels',
            {funnelIds}
        );
    }


    public getFunnelsToConfirm()
    {
        return this.httpService.get<TAjaxFormDataResponse<TAmdSelectRow[]>>(
            '/sales-funnel/quality-control_confirm-funnels/get-funnels-to-confirm'
        );
    }


    public getStagesToConfirm()
    {
        return this.httpService.get<TAjaxFormDataResponse<TAmdSelectRow[]>>(
            '/sales-funnel/quality-control_confirm-funnels/get-stages-to-confirm'
        );
    }
}
