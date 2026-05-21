import {IComponentController} from "angular";
import {Component, Inject} from "../../../../../angular/decorator/component.decorator";
import {MessageService} from "../service/message.service";

@Component({
    selector: 'messages',
    template: `
<!--            <div ng-if="$ctrl.messageService.messages.length">-->
<!--            <h2>Messages</h2>-->
<!--            <button class="clear"-->
<!--                  ng-click="$ctrl.messageService.clear()">Clear messages</button>-->
<!--            <div ng-repeat='message in $ctrl.messageService.messages track by $index'> {{message}} </div>-->
<!--        </div>-->
<div ng-if="$ctrl.messageService.messages.length">
    <h2>Messages</h2>
    <amd-button ng-click="$ctrl.messageService.clear()">Clear messages</amd-button>
    <div ng-repeat='message in $ctrl.messageService.messages track by $index'> {{message}} </div>
</div>
    `,
})
export class MessageComponent implements IComponentController
{
    public constructor(
        @Inject(MessageService) private messageService: MessageService
    )
    {
    }

    public $onInit()
    {
    }
}