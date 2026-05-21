<?php
/**
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author Frolov Anatoliyfrolov_anatoliy@amd-co.ru>
 * @date 06.02.2025
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution
 */
require_once __DIR__.'/../../application.php';

$serviceSender = new App_Network_Service_Global_Db_Sender();
$isInventory = APPLICATION_ENV == "inventory";
$projectIds = array_flip(App_Db::get()->query("SELECT DISTINCT project_id FROM ext_inventory_depot_detailed")->fetchAll(Zend_Db::FETCH_COLUMN));
$table = 'depot_list';
$method = 'getDepots';

if ($isInventory) {
    echo 'Инициализирован процесс установки значений в таблицу на основе ';

    App_Db::get()->query("truncate ext_inventory_depot_detailed");
    App_Db::get()->query("
        INSERT INTO ext_inventory_depot_detailed(project_id,depot_id, title)
        VALUES
           -- amdcoru 
            (1,2, 'Подольск'),
            -- kkl,
            (2,2, 'Подольск'),
            -- 15dd,
            (3,2, 'Подольск'),
            -- goroda,
            (5,2, 'Подольск'),
            -- goroda,
            (7,2, 'Подольск'),
            -- pzo,
            (8,2, 'Подольск'),
            -- zaco,
            (9,2, 'Подольск'),
            -- project18,
            (18,2, 'Подольск'),
            -- project19,
            (19,2, 'Новосибирск'),
            -- project20,
            (20,2, 'Казань')
        ");
}
