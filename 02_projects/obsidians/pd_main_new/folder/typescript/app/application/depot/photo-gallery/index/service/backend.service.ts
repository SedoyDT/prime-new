import {Inject, Injectable} from "../../../../../angular/decorator/component.decorator";
import AjaxFormBackendService from "../../../../../angular/service/ajax-form-backend.service";

@Injectable()
export class BackendService
{

    public constructor(
        @Inject(AjaxFormBackendService) private httpService: AjaxFormBackendService,
    ) {
    }

    // Метод для получения информации по клиентам для товара
    // public getShippedInfo(itemId: number, order?: number)
    // {
    //
    //     return this.httpService
    //         .post<{productId: number, order: number}>(
    //             '/analitics/potentialclients/get-shipped-info/',
    //             {itemId, order}
    //         )
    // }

    // Метод для получения информации о заблокированных товарах
    public getBlockInfo(itemId: number)
    {
        console.log(itemId);
        // return this.httpService
        //     .post<{itemId: number}>(
        //         '/analitics/potentialclients/get-block-info/',
        //         {itemId}
        //     )
    }
}
