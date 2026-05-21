<?php
/**
 * Таблица ExtInventoryDepotDetailed
 * {Template_Description_Abstract}
 * @author vofchek
 * @date 23.08.2019
 * @copyright {Template_Description_Copyrights}
 */

class App_Db_ExtInventoryDepotDetailed extends App_Db_Abstract
{

    protected $_name = 'ext_inventory_depot_detailed';

    protected $_primary = 'id';

    /**
     * @return App_Db_ExtInventoryDepotDetailed
     */
    public static function obtain()
    {
        return App_Db::get(DB_EXT_INVENTORY_DEPOT_DETAILED);
    }

    /**
     * пересчёт кол-ва инвентарных позиций
     * @param array $depotDetailed
     * @return void
     */
    public function recalculateBlocked(array $depotDetailed)
    {
        if (empty($depotDetailed)) {
            return ;
        }

        $this->update([
            'blocked' => new Zend_Db_Expr('
                (
                    SELECT SUM(amount)
                    FROM ext_inventory_accounting 
                    WHERE ext_inventory_depot_detailed_id = ext_inventory_depot_detailed.id
                )
            '),
            'free_amount' => new Zend_Db_Expr('amount-blocked'),
        ], [
            'id IN (?)' => $depotDetailed,
        ]);
    }
}