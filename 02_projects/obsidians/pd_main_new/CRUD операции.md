Для реализации CRUD операций и получения данных контрагента, следуйте приведенным ниже шагам. Мы создадим ресурс для контрагента, контроллер для обработки запросов и обновим типы в TypeScript.

### 1. Создание ресурса

Создайте файл `library/App/Counteragent/Resources/CounteragentResource.php` с указанным содержимым:

```php
<?php

/**
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author Your Name
 * @date 01.01.2025
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution
 */

namespace App\Counteragent\Resources;

use App\Counteragent\Models\CounteragentModel;

class CounteragentResource
{
    public function generate(CounteragentModel $counteragent): array
    {
        $data = [
            'id'            => $counteragent->getId(),
            'title'         => $counteragent->getTitle(),
            'inn'           => $counteragent->getInn(),
            'establishedAt' => $counteragent->getEstablishedAt() ? $counteragent->getEstablishedAt()->format(MYSQL_DATE_FORMAT) : null,
            'accountNumber' => $counteragent->getAccountNumber(),
            'hasEdm'        => (bool) $counteragent->getHasEdm(),
            'typeId'        => (string) $counteragent->getTypeId(),
            'statusId'      => (string) $counteragent->getStatusId(),
            'comment'       => $counteragent->getComment(),
            'phones'        => [],
        ];

        foreach ($counteragent->getPhones() as $phone) {
            $data['phones'][] = [
                'id'      => $phone->getId(),
                'number'  => $phone->getNumber(),
                'comment' => $phone->getComment(),
            ];
        }

        return $data;
    }
}
```

### 2. Создание контроллера

Создайте файл `application/modules/counteragent/controllers/CrudController.php` с указанным содержимым:

```php
<?php

/**
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author Your Name
 * @date 01.01.2025
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution
 */

use App\Counteragent\Models\CounteragentModel;
use App\Counteragent\Models\CounteragentPhoneModel;
use App\Counteragent\Repositories\CounteragentRepository;
use App\Counteragent\Resources\CounteragentResource;

class Counteragent_CrudController extends Zend_Controller_Action
{
    /**
     * @var CounteragentResource
     * @Inject
     */
    protected $counteragentResource;

    /**
     * @var CounteragentRepository
     * @Inject
     */
    protected $counteragentRepository;

    /**
     * @throws Exception
     */
    public function getCounteragentAction(): void
    {
        App_Form_AjaxForm_Factory::send(function () {
            $counteragentId = (int) $this->_getParam('id');

            if ($counteragentId) {
                $counteragent = $this->counteragentRepository->findById($counteragentId);
            } else {
                $counteragent = new CounteragentModel();
                $counteragent->setPhones([new CounteragentPhoneModel()]);
            }

            if (!$counteragent) {
                throw new App_Form_AjaxForm_Form_FormException("Контрагент не найден");
            }

            return [
                'counteragent' => $this->counteragentResource->generate($counteragent)
            ];
        });
    }
}
```

### 3. Проверка работы контроллера

Проверьте работу контроллера, перейдя по следующим ссылкам:
- `/counteragent/crud/get-counteragent/id/<COUNTERAGENT_ID>` — должны получить данные контрагента.
- `/counteragent/crud/get-counteragent` — должны получить незаполненного контрагента.

### 4. Обновление типов TS

Обновите файл `../../typescript/app/application/counteragent/index/types.ts`, добавив описание контрагента:

```ts
export type TCounteragent = {
    id: string,
    title: string,
    inn: string,
    establishedAt: Date,
    accountNumber: string,
    hasEdm: boolean,
    typeId: string,
    statusId: string,
    comment: string,
    phones: TCounteragentPhone[],
};

export type TCounteragentPhone = {
    id: string,
    number: string,
    comment: string,
};
```

### Заключение

Теперь у вас есть ресурс для контрагента, контроллер для обработки запросов и обновленные типы в TypeScript. Выполните commit изменений, убедившись, что вы находитесь в ветке с задачей. Если у вас есть дополнительные вопросы или требуется помощь с другими аспектами проекта, дайте знать!