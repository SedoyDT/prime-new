import {Inject, Injectable} from "../../../../../angular/decorator/component.decorator";
import {THero} from "../module";
import {HEROES} from "../mock-heroes";
import {IPromise, IQService} from "angular";
import {MessageService} from "./message.service";
import AjaxFormBackendService from "../../../../../angular/service/ajax-form-backend.service";

@Injectable()
export class HeroService
{
    public constructor(
        @Inject(AjaxFormBackendService) private httpService: AjaxFormBackendService,
        @Inject(MessageService) private messageService: MessageService,
    )
    {
    }
    public getHeroes(): IPromise<THero[]>
    {
        // return HEROES;
        this.messageService.add("Fetched heroes");
        return this.httpService.get<{ heroes: THero[] }>('/tour-of-heroes/index/get-data')
            .then((response) => response.heroes);
    }

    public updateHero(hero: THero)
    {
        return this.httpService.postOverlay('/tour-of-heroes/index/update',{hero})
    }

    public addHero(hero: THero)
    {
        return this.httpService.postOverlay<{ hero: THero }>('/tour-of-heroes/index/add', {hero})
            .then(response => response.hero);
    }

    public deleteHero(id: number)
    {
        return this.httpService.postOverlay<{ hero: THero }>('/tour-of-heroes/index/delete', {id});
    }

}