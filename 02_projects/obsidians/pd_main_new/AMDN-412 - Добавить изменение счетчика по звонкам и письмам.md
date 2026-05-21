Добавить изменение счетчика по звонкам и письмам

Изменение счетчика производим по событиям:
1. \App\Event\SalesFunnel\Type\RelationWithCallCreated
2. \App\Event\SalesFunnel\Type\RelationWithCallRemoved - можно сгенерить выделением звонка в отдельный лид(кнопка в логе лида)
3. \App\Event\SalesFunnel\Type\RelationWithMailServerMessageCreated
4. \App\Event\SalesFunnel\Type\RelationWithMailServerMessageRemoved
Обработчики зарегистрировать в `\App\SalesFunnel\EventSubscriber\LeadAutomatizationEventSubscriber`