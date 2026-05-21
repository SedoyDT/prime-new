<?php

/**
 * {Template_Description_Abstract}
 *
 * @author
 * @date 18.07.2018
 * @copyright {Template_Description_Copyrights}
 */

use App_Cascade_Helper_Params as Params;

/**
 * Удаление существующего товара
 */
class App_Cascade_Changer_In_ProductDelete extends App_Cascade_Changer_Product
{


    /**
     * Подготовка данных перед отображением
     * @return void
     * @throws Zend_View_Exception
     */
    protected function _prepareValues()
    {
        $where = [
            'claim_id = ?' => $this->_changeObject->claimId,
            'item_id = ?' => $this->_productId,
            'number = ?' => $this->_productNumber
        ];

        $ddRow = App_Db_DepotDetailed::obtain()->getRow($where, Zend_Db::FETCH_OBJ);

        if (App_Container::$services->depotDetailedRepository->getSectionDdmInfo($ddRow->id)->managersRowsCount > 0) {
            // Информация о блокировках секции под менеджеров
            $ddmTransferFormInfo = new Depot_Model_DepotDetailedManager_Transfer_Info($ddRow->id);

            $view = new Zend_View();
            $view->setScriptPath(APPLICATION_PATH . '/modules/depot/views/scripts/section/depotdetailedmanager');
            $view->assign(array('data' => $ddmTransferFormInfo->getSectionDdmRows()));
            $this->_values['ddmTableHtml'] = $view->render('table.phtml');
        }
    }


    /**
     * @return void
     * @throws Zend_Db_Statement_Exception
     * @throws Zend_View_Exception
     */
    protected function _doUpdate()
    {
//        echo "<pre>" . print_r('here1', true); echo "</pre>"; // FrolovDEBUG
//        exit();
        $this->_prepareValues();
        $this->_buildCascadeHeader('Удаление товара');

?>
            <tr>
                <td align="center">
                    <div style="width: 998px; overflow-x: scroll;">
                        <?php $this->_productViewer->showProduct();?>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="border: 1px solid #FFFFFF;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" class="aItemsTable">
                        <tr>
                            <td class="aItemTitle">
                                Удаляемое количество
                            </td>
                        </tr>
                        <tr style="background: #FFFFFF;">
                            <td class="aItemProductTitle">
                                <table width="300" cellspacing="1" style="border: 0px solid grey;">
                                    <tr>
                                        <td class="aClientClaimId" width="130" align="left">
                                            <?php echo $this->_names[$this->_productType]['boxes']?>
                                        </td>
                                        <td class="aItemProductTitle" width="170" align="center">
                                            <?php echo $this->_values['boxes'];?>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="aClientClaimId" align="left">
                                            <?php echo $this->_names[$this->_productType]['amount']?>
                                        </td>
                                        <td class="aItemProductTitle" align="center">
                                            <?php echo $this->_values['amount'];?>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="aClientClaimId" align="left">
                                            <?php echo $this->_names[$this->_productType]['inboxes']?>
                                        </td>
                                        <td class="aItemProductTitle" align="center">
                                            <?php echo $this->_values['inboxes'];?>
                                        </td>
                                    </tr>
<?php
                                    if (array_key_exists('ddmTableHtml', $this->_values)) {
?>
                                        <td class="aClientClaimId" align="left" colspan="2">
                                            <?php echo $this->_names[$this->_productType]['ddmTransferFormData']?>
                                            <?php echo $this->_values['ddmTableHtml'];?>
                                        </td>
<?php
                                    }
?>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" class="aItemsTable">
                        <tr>
                            <td class="aItemTitle">
                                Изменения по товару
                            </td>
                        </tr>
                        <tr style="background: #FFFFFF;">
                            <td class="aItemProductTitle">
                                Удаление данных о товаре из заявки (таблица claim_products)
                            </td>
                        </tr>
                        <tr style="background: #F0F0F6;">
                            <td class="aItemProductTitle">
                                Удаление данных о товаре из склада подробности (таблица depot_detailed)
                            </td>
                        </tr>
                        <tr style="background: #FFFFFF;">
                            <td class="aItemProductTitle">
                                Удаление данных о товаре из склада (таблица depot_2)
                            </td>
                        </tr>
                        <tr style="background: #F0F0F6;">
                            <td class="aItemProductTitle">
                                Обновление полей "кол-во(штук)/общий вес", "кол-во упаковок/кол-во роликов"
                            </td>
                        </tr>
<?php
                    if (isset($this->_values['production_manager_id']) && (int) $this->_values['production_manager_id'] > 0) {
                        // Если удаляемый товар был заказан под менеджера
                        $user = App_Db_Users::obtain()->findOneById($this->_values['production_manager_id']);
?>
                        <tr style="background: #FFFFFF;">
                            <td class="aItemProductTitle">
                                Товар был заблокирован под менеджера <?php echo $user->name ?>
                            </td>
                        </tr>
<?php
                    }
?>
                    </table>
<?php
                $this->_renderCompanyEquipment();
?>
                </td>
            </tr>
<?php
        $sql = "SELECT
            c.`url`,
            c.`full_id`
        FROM
            depot_detailed dd
        INNER JOIN
            blocks b
            ON
                b.`detailed_id` = dd.`id`
        INNER JOIN
            claims c
            ON
                c.id = b.`claim_id`
        WHERE
            dd.`claim_id` = {$this->_changeObject->claimId}
            AND dd.`number` = {$this->_productNumber}
            AND dd.`item_id` = {$this->_productId}
            AND c.id NOT IN (
                SELECT claim_out
                FROM depot_inventory_claims
                UNION
                SELECT claim_out_id
                FROM depot_inventory_numbers
            )
        GROUP BY
            c.id;";
        $claimsInfo = App_Db::get()->query($sql)->fetchAll(Zend_Db::FETCH_OBJ);

        if(!count($claimsInfo)) {
            $this->_deleteProduct();
        }else {
            Zend_Registry::set('cantEdit', true);
?>
            <tr>
                <td style="border: 1px solid #FFFFFF;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" class="aItemsTable">
                        <tr>
                            <td class="aItemTitle" style="background: #EF3737; color: #FFFFFF;">
                                Невозможно произвести удаление товара!
                                <br>
                                По товару есть блокировки!
                                <br>
                                Данный товар отгружен или заблокирован по следующим заявкам : <br>
                                <?php
                                foreach($claimsInfo as $claim) {
                                    printf('    - <a href="%s" target="_blank">%s</a><br>', $claim->url, $claim->full_id);
                                }
                                ?>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
<?php
        }

        $this->_buildCascadeFooter();
    }


    /**
     * Удаление товара из таблиц
     * @return void
     */
    protected function _deleteProduct()
    {
//        echo "<pre>" . print_r('here3', true); echo "</pre>"; // FrolovDEBUG
//        exit();
        $this->_processCompanyEquipment();

        // claim_products
        $this->_deleteProductFromClaim();
        // delete from depot_detailed_photo
        $this->_deleteProductFromDetailedPhoto();
        // depot_detailed
        $this->_deleteProductFromDetailed();

        // depot_2
        $deleteFromDepotFunction = '_deleteProductFromDepot' . $this->_functionType;
        echo "<pre>" . print_r('$deleteFromDepotFunction', true); echo "</pre>"; // FrolovDEBUG
        echo "<pre>" . print_r($deleteFromDepotFunction, true); echo "</pre>"; // FrolovDEBUG
        exit();
        $this->$deleteFromDepotFunction();
    }


    /**
     * Удаление товара из таблицы склада КГ
     * @return void
     * @throws Zend_Db_Adapter_Exception
     * @throws Zend_Db_Statement_Exception
     */
    protected function _deleteProductFromDepotKg()
    {
        // Удаление общего веса
        $this->getDepotAdapter()->updateAmount($this->getDepotAdapter()->getName(), 'field11', $this->_values['amount'], $this->_productId, '-', true);
        // Удаление количества роликов
        $this->getDepotAdapter()->updateAmount($this->getDepotAdapter()->getName(), 'field12', $this->_values['boxes'], $this->_productId, '-');
        // Обновление среднего веса ролика
        // Средний вес (количество в упаковке) = общий вес (количество) / количество роликов (количество упаковок)
        $this->getDepotAdapter()->updateAverageField('field11', 'field12', 'field10', $this->_productId);
    }


    /**
     * Удаление товара из таблицы склада ШТ
     * @return void
     * @throws Zend_Db_Adapter_Exception
     * @throws Zend_Db_Statement_Exception
     */
    protected function _deleteProductFromDepotSht()
    {
        // Удаление количества
        $this->getDepotAdapter()->updateAmount($this->getDepotAdapter()->getName(), 'field11', $this->_values['amount'], $this->_productId, '-');
        // Обновление поля количество упаковок
        // Кооличество упаковок = количество / количество в упаковке
        $this->getDepotAdapter()->updateAverageField('field11', 'field10', 'field12', $this->_productId);
    }


    /**
     * Удаление товара из таблицы claim_products
     * @return void
     */
    protected function _deleteProductFromClaim()
    {
        App_Db_ClaimProducts::obtain()->delete([
            'claim_id = ?' => $this->_changeObject->claimId,
            'product_id = ?' => $this->_productId,
            'number = ?' => $this->_productNumber
        ]);
    }


    /**
     * Удаление товара из таблицы depot_detailed
     * @return void
     */
    protected function _deleteProductFromDetailed()
    {
        App_Db_DepotDetailed::obtain()->delete([
            'claim_id = ?' => $this->_changeObject->claimId,
            'item_id = ?' => $this->_productId,
            'number = ?' => $this->_productNumber
        ]);
    }


    /**
     * Удаление фотографий товара и из таблицы depot_detailed_photo
     * @return void
     */
    protected function _deleteProductFromDetailedPhoto()
    {
        App_Db_DepotDetailedPhoto::obtain()->destroyAllPhotos(
            $this->_changeObject->claimId,
            $this->_productId,
            ['onlyCheckFlag' => Params::get()->cascadeConfirmed ? false : true]
        );
    }

    /**
     * обработка изменений имущества компании
     * @return void
     * @throws Exception
     */
    protected function _processCompanyEquipment()
    {
        if (empty($this->_values['companyEquipment'])) {
            return ;
        }

        $changes = App_Product_CompanyEquipment_ChangeList_Composite::fromCache();
//        echo "<pre>" . print_r($changes, true); echo "</pre>"; // FrolovDEBUG
//        exit();

//        echo "<pre>" . print_r($changes->getDelete()->getItems(), true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($changes->getAdd()->getItems(), true); echo "</pre>"; // FrolovDEBUG
//        exit();
        $deleteChanges = new App_Product_CompanyEquipment_ChangeList_Composite();
        $deleteChanges->getDelete()->merge($changes->getDelete());
        $saveResult = App_Container::$services->getCompanyEquipmentService()
            ->saveChangeList($this->_changeObject->claimId, $deleteChanges);
        if ($saveResult->getDelete()->size() > 0) {
            App_Container::$services->getCompanyEquipmentWriteOffService()
                ->saveChangesResult($this->_changeObject->claimId, $saveResult);

            App_Product_CompanyEquipment_ChangeList_SaveResult::fromCache()
                ->setDelete($saveResult->getDelete())
                ->cache();
        }
    }

    /**
     * отображение изменений имущества компании
     * @return void
     */
    protected function _renderCompanyEquipment()
    {
        if (empty($this->_values['companyEquipment'])) {
            return ;
        }

        $tmp = explode('|', $this->_values['companyEquipment']);
        $oldValue = $tmp[0] ? unserialize($tmp[0]) : new App_Product_CompanyEquipment_Model(new App_Product_CompanyEquipment_Entity());

        echo '
            <table width="100%" cellpadding="0" cellspacing="0" border="0" class="aItemsTable">
                <tr>
                    <td class="aItemTitle" colspan="3">
                        Записи для проекта УИН
                    </td>
                </tr>
                ' . $this->_renderUinEntityModel($oldValue) . '
            </table>
        ';
    }
}
