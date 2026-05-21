<?php
/**
 * Таблица ext_inventory_depot_list
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author Frolov Anatoliy<frolov_anatoliy@amd-co.ru>
 * @date 09.02.2025
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution

*/

class App_Db_ExtInventoryDepotList extends App_Db_Abstract
{

    protected $_name = 'ext_inventory_depot_list';

    protected $_primary = 'id';

    /**
     * @return App_Db_ExtInventoryDepotList
     */
    public static function obtain()
    {
        return App_Db::get(DB_EXT_INVENTORY_DEPOT_LIST);
    }
}