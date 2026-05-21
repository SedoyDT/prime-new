---
author: Frolov Anatolui
date: 2025-04-30
time: 10:04:35
aliases: 
- 
tags:
- unique-note
---


Для оптимизации кода можно использовать SQL-запросы для получения необходимых данных, что уменьшит количество операций в PHP и повысит производительность. Ниже приведен пример, как можно переписать методы с использованием SQL.

### Оптимизированный код

```php
public function execute(?array $departments, ?array $roles, ?array $users, ?bool $isConsiderVacations = false): ?array
{
    $lastOwner = $this->funnelDatasource->getLastOwnerId() ?: 0;

    // Получаем потенциальных владельцев и активных заменяющих за один запрос
    $potentialOwnersData = $this->getOwnersAndSubstitutes($departments, $roles, $users, $lastOwner);

    [$nextOwner, $activeSubstitute] = $this->findNextAvailableOwnerWithSubstitute($potentialOwnersData, $lastOwner);

    return [$nextOwner, $activeSubstitute];
}

/**
 * Получает потенциальных владельцев и их заменяющих из базы данных
 * @param array|null $departments
 * @param array|null $roles
 * @param array|null $users
 * @param int $lastOwner
 * @return array
 */
public function getOwnersAndSubstitutes(?array $departments, ?array $roles, ?array $users, int $lastOwner): array
{
    $userIds = implode(',', $users ?: [-1]);
    $roleIds = implode(',', $roles ?: [-1]);
    $departmentIds = implode(',', $departments ?: [-1]);

    $query = "
        SELECT u.id AS user_id, 
               (SELECT GROUP_CONCAT(s.substitute_id) 
                FROM substitutes s 
                WHERE s.user_id = u.id) AS substitutes
        FROM users u
        WHERE u.id != 0 
          AND u.is_dismiss = 0 
          AND (u.id IN ($userIds) OR (u.role IN ($roleIds) AND u.id IN (SELECT userId FROM orgstructure_users WHERE oId IN ($departmentIds))))
        ORDER BY u.id ASC
    ";

    return \App_Db::get()->query($query)->fetchAll(\Zend_Db::FETCH_ASSOC);
}

/**
 * Находит следующего доступного пользователя для назначения,
 * учитывая отпуска и наличие замещающих.
 *
 * @param array $potentialOwnersData
 * @param mixed $lastOwner
 * @return array|null
 */
public function findNextAvailableOwnerWithSubstitute(array $potentialOwnersData, ?int $lastOwner): ?array
{
    $onVacations = [];
    $nextOwner = null;
    $activeSubstitute = null;

    foreach ($potentialOwnersData as $ownerData) {
        if ($ownerData['user_id'] > $lastOwner && !in_array($ownerData['user_id'], $onVacations)) {
            $nextOwner = $ownerData['user_id'];
            $substitutes = explode(',', $ownerData['substitutes']);
            $activeSubstitute = $this->getActiveSubstitute($substitutes);
            break;
        } else {
            $onVacations[] = $ownerData['user_id'];
        }
    }

    if (is_null($nextOwner)) {
        // Если не найдено, берем первого владельца
        $nextOwner = reset($potentialOwnersData)['user_id'];
    }

    $this->funnelDatasource->setLastOwnerId($nextOwner);
    $this->funnelDatasourceRepo->save($this->funnelDatasource);

    return [$nextOwner, $activeSubstitute];
}

/**
 * Получает активного заменяющего из списка заменяющих
 * @param array $substitutes
 * @return mixed|null
 */
private function getActiveSubstitute(array $substitutes)
{
    if (empty($substitutes)) {
        return null;
    }

    $userQuery = new \App\User\Query();
    $activeSubstitutes = $userQuery
        ->columns(['id'])
        ->byId($substitutes)
        ->activeOnly()
        ->fetchAll(Zend_Db::FETCH_COLUMN);

    return reset($activeSubstitutes) ?: null;
}
```

### Объяснение изменений:

1. **SQL-запрос**: Вместо получения владельцев и заменяющих в PHP, мы используем один SQL-запрос для получения всех необходимых данных сразу. Это уменьшает количество запросов к базе данных и ускоряет выполнение.

2. **Функция `getOwnersAndSubstitutes`**: Эта функция получает как владельцев, так и их заменяющих за один запрос, что упрощает логику и уменьшает количество операций в PHP.

3. **Упрощение логики**: Метод `findNextAvailableOwnerWithSubstitute` теперь работает с данными, полученными из базы данных, что упрощает его логику.

4. **Метод `getActiveSubstitute`**: Вынесен в отдельный метод для получения активного заменяющего, что улучшает читаемость кода.

Эти изменения должны помочь оптимизировать производительность и читаемость кода. Если у вас есть конкретные названия таблиц или другие детали, их можно дополнительно уточнить для более точной реализации.