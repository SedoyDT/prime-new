<?php
/**
 * блокировщик товаров для заявки-списание
 * {Template_Description_Abstract}
 * @author Vladimir Kononov
 * @date 15.01.2020
 * @copyright {Template_Description_Copyrights}
 */

namespace App\Product\CompanyEquipment\WriteOffClaim;


class BlockManager
{


    /**
     * добавление блокировки
     * @param \App_Product_CompanyEquipment_Model $model
     * @param int $claimOutId
     * @return void
     * @throws \Zend_Db_Table_Exception
     */
    public function block(\App_Product_CompanyEquipment_Model $model, int $claimOutId)
    {
        $item = $model->getItem();
//        echo "<pre>" . print_r('$item', true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($item, true); echo "</pre>"; // FrolovDEBUG
//        exit();
        $depotDetailed = $model->getDepotDetailed();

        list($blockAmount, $amount, $boxes) = array_values($this->_getBlockAmount($item, $depotDetailed));

        // изменение записи в claim_products
        $claimProductsRecord = $this->_getClaimProductsEntity($item->id, $claimOutId);

        $claimOut = $this->_getClaimEntity($claimOutId);
//        $claimInEntity = $this->_getClaimEntity($model->getClaimIn()->id);
        $claimOut->setProperties([
           'depot_index' => $model->getClaimIn()->depot_index
        ]);
        $claimOut->save();

        $claimProductsRecord->setProperties([
            'claim_id' => $claimOutId,
            'product_id' => $item->id,
            'price' => '0.00',
            'totalPrice' => 0,
            'itemtype' => $item->field15,
            'flag' => 1,
            'depot_id' => $model->getClaimIn()->depot_index,
            'number' => ($claimProductsRecord->id == 0 ? (int) \App_Db_ClaimProducts::obtain()->getMaxNumber($claimOutId)[0] + 1 : $claimProductsRecord->number),
            'amount' => (float) $claimProductsRecord->amount + $amount,
            'boxes' => (float) $claimProductsRecord->boxes + $boxes,
        ]);
        $claimProductsRecord->inboxes = $claimProductsRecord->amount / ($claimProductsRecord->boxes ?: 1);
        $claimProductsRecord->save();

        // создание записи в blocks
        $blockRow = \App_Db_Entities_Blocks::createByGetRow([
            'claim_id = ?' => $claimOutId,
            'detailed_id = ?' => $depotDetailed->id
        ]);

        $blockRow->setProperties([
            'item_id' => $item->id,
            'detailed_id' => $depotDetailed->id,
            'claim_id' => $claimOutId,
            'manager_id' => \Zend_Auth::getInstance()->getIdentity()->id,
            'date' => time(),
            'state' => 0,
            'blockAmount' => (float) $blockAmount,
            'amount' => (float) $amount,
            'boxes' => (int) $boxes
        ]);
        $this->_saveBlock($blockRow);

        $depotDetailed->amount = 0;
        $depotDetailed->boxes = 0;
        $depotDetailed->save();

        // обновление полей с блокировкой в depot_2
        $item->field11 = round($item->field11 - $blockAmount, -1 * log10(AMD_PRECISION));
        if ($item->field11 < 0) {
            throw new \LogicException("field11 не может быть меньше 0");
        }

        $item->field12 = round($item->field12 - $boxes, -1 * log10(AMD_PRECISION));
        if ($item->field12 < 0) {
            throw new \LogicException("field12 не может быть меньше 0");
        }

        $item->save();

        \App_Db_DepotDetailedOut::obtain()->resetByBlocks($claimOutId);
    }

    /**
     * удаление блокировки
     * @param \App_Product_CompanyEquipment_Model $model
     * @param int $claimOutId
     * @return void
     * @throws \Zend_Db_Table_Exception
     * @throws \Exception
     */
    public function unblock(\App_Product_CompanyEquipment_Model $model, int $claimOutId)
    {
        // удаление блокировки
        $item = $model->getItem();

//        echo "<pre>" . print_r($claimOutId, true); echo "</pre>"; // FrolovDEBUG
//        exit();

        $blockRow = \App_Db_Entities_Blocks::createByGetRow([
            'claim_id = ?' => $claimOutId,
            'detailed_id = ?' => $model->getEntity()->getDetailedId()
        ]);

        if (empty($blockRow->id)) {
            return ;
        }

        // изменение записи в claim_products
        $claimProductsRecord = $this->_getClaimProductsEntity($item->id, $claimOutId);

        if ($claimProductsRecord->id > 0) {
            $claimProductsRecord->amount = (float) $claimProductsRecord->amount - $blockRow->amount;
            $claimProductsRecord->boxes = (int) $claimProductsRecord->boxes - $blockRow->boxes;
            if ($claimProductsRecord->boxes == 0) {
                $claimProductsRecord->delete();
            } else {
                $claimProductsRecord->inboxes = $claimProductsRecord->amount / $claimProductsRecord->boxes;
                $claimProductsRecord->save();
            }
        }

        // обновление блокировки в depot_detailed
        $depotDetailed = \App_Db_Entities_DepotDetailed::createByPrimaryKeys([$model->getEntity()->getDetailedId()]);
        if ($depotDetailed->id > 0) {
            $depotDetailed->amount = $blockRow->amount;
            $depotDetailed->boxes = $blockRow->boxes;
            $depotDetailed->save();
        }

//        echo "<pre>" . print_r($item, true); echo "</pre>"; // FrolovDEBUG
//        exit();


        // обновление полей с блокировкой в depot_2
        $item->field11 = round((float) $item->field11 + (float) $blockRow->amount, -1 * log10(AMD_PRECISION));
        $item->field12 = round((float) $item->field12 + (float) $blockRow->boxes, -1 * log10(AMD_PRECISION));

        echo "<pre>" . print_r($item->field11, true); echo "</pre>"; // FrolovDEBUG
        exit();
//        $item->save();

        $blockRow->delete();

        \App_Db_DepotDetailedOut::obtain()->resetByBlocks($claimOutId);
    }

    /**
     * Метод для получения количества товара для блокировки
     * @param \Zend_Db_Table_Row $item
     * @param \Zend_Db_Table_Row $depotDetailed
     * @return array
     */
    protected function _getBlockAmount(\Zend_Db_Table_Row $item, \Zend_Db_Table_Row $depotDetailed)
    {
        $claimProductRow = \App_Db_Entities_ClaimProducts::createByGetRow([
            'claim_id = ?' => $depotDetailed->claim_id,
            'number = ?' => $depotDetailed->number,
            'product_id = ?' => $depotDetailed->item_id
        ]);

        $amount = $claimProductRow->amount;
        $boxes = $claimProductRow->boxes;
        $blockAmount = 0;

        switch ((int) $item->field15) {
            case \App_Constant_Depot_ItemTypes::TYPE_PIECE:
                $blockAmount = $claimProductRow->amount;
                break;
            case \App_Constant_Depot_ItemTypes::TYPE_WEIGHT:
                $blockAmount = $claimProductRow->boxes;
                break;
        }

        return array(
            'blockAmount' => $blockAmount,
            'amount' => $amount,
            'boxes' => $boxes
        );
    }

    /**
     * Метод для получения записи из claim_products
     * @param int $itemId - id товара
     * @param int $claimId - id заявки
     * @return \App_Db_Entities_ClaimProducts
     */
    protected function _getClaimProductsEntity($itemId, $claimId)
    {
        return \App_Db_Entities_ClaimProducts::createByGetRow([
            'claim_id = ?' => $claimId,
            'product_id = ?' => $itemId
        ]);
    }

    /**
     * Метод для получения записи из claims
     * @param int $claimId - id заявки
     * @return \App_Db_Entities_ClaimProducts
     */
    protected function _getClaimEntity($claimId)
    {
        return \App_Db_Entities_Claims::createByGetRow([
            'id = ?' => $claimId,
        ]);
    }

    /**
     * Метод для сохранения блокировки
     * @param \App_Db_Entities_Blocks $blockEntity - строка блокировки
     * @throws \Exception
     */
    protected function _saveBlock(\App_Db_Entities_Blocks $blockEntity)
    {
        if ($blockEntity->id > 0) {
            $blockEntity->update();
        } else {
            // нельзя использовать результат метода, пока primary key у App_Db_Blocks - detailed_id
            $blockEntity->insert();
            $blockEntity->id = \App_Db::get()->lastInsertId();
        }

        // Добавление строки ddmb для корректной блокировки
        \App_Db_DepotDetailedManagerBlock::obtain()->save(array(
            'blocks_id' => $blockEntity->id,
            // В общий доступ
            'dd_manager_id' => 0,
            'amount' => $blockEntity->amount,
            'boxes' => $blockEntity->boxes,
            'blockAmount' =>  $blockEntity->blockAmount
        ));
    }
}