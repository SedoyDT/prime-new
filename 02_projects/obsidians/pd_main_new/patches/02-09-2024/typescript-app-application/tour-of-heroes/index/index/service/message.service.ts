import {Injectable} from "../../../../../angular/decorator/component.decorator";

@Injectable()
export class MessageService
{
    public messages: string[] = [];

    public add(message: string) {
        this.messages.push(message);
    }

    public clear() {
        this.messages = [];
    }
}