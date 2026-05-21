# CRUD операции
Удаление контрагента

### Обновление контроллера
Добавьте метод `deleteCounteragentAction` в [контроллер](../../application/modules/counteragent/controllers/CrudController.php).

```php
/**
 * @throws Exception
 */
public function deleteCounteragentAction(): void
{
    App_Form_AjaxForm_Factory::send(
        App_Form_AjaxForm_Factory::TYPE_DB_TRANSACTION,
        [
            function () {
                $this->counteragentService->deleteById(
                    $this->_getParam('id')
                );
            }
        ]
    );
}
```

### Обновление BackendService
Добавьте метод `deleteCounteragent` в [сервис](../../typescript/app/application/counteragent/index/service/backend.service.ts).

```ts
public deleteCounteragent(id: number): IPromise<boolean>
{
    return this.ajaxFormBackendService
        .postOverlay('/counteragent/crud/delete-counteragent', { id })
        .then((response: TAjaxFormResponse) => {
            return response.success;
        });
}
```

### Обновление обработчика кнопки
Обновите файл [файл](../../typescript/app/application/counteragent/index/component/page.component.ts). 

Добавьте импорт:
```ts
import BackendService from "../service/backend.service";
```

Добавьте внедрение зависимости:
```ts
constructor(
    // ...
    @Inject(BackendService) private backendService: BackendService,
)
```

Обновите обработчик кнопки удалить:
```ts
protected deleteCounteragent(): void
{
    const selectedRow: TAmdGridRow = this.selection.getData();

    if (!selectedRow) {
        this.messageService.alert('Контрагент не выбран').then(() => void 0);
        return;
    }

    this.messageService
        .confirm('Подтвердите удаление')
        .then(
            () => {
                this.backendService
                    .deleteCounteragent(+selectedRow.id)
                    .then(result => {
                        this.grid.update();
                    })
                    .catch((reason) => {
                        this.messageService.alert(reason).then(() => void 0);
                    });
            },
            () => void 0
        );
}
```

Проверьте работу кнопки "Удалить".

> Выполните commit изменений, Вы должны находиться в ветке с задачей.

[← Назад](Part-9.md) ⦁ [К содержанию](OnboardTask.md) ⦁ [Вперед →](Part-11.md)