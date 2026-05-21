<?php

/**
 * {Template_Description_Abstract}
 *
 * @author
 * @date 18.07.2018
 * @copyright {Template_Description_Copyrights}
 */

/**
 * Добавление нового товара
 */
class App_Cascade_Changer_In_ProductAdd extends App_Cascade_Changer_Product
{
    /**
     * Подготовка данных перед отображением
     */
    protected function _prepareValues()
    {
        foreach($this->_values as $key => $value) {
            if ($key === 'ddmTransferFormData' && is_string($value) && strlen($value) > 0) {
                // Для формы блокировки секции под менеджеров

                $view = new Zend_View();
                $view->setScriptPath(APPLICATION_PATH . '/modules/depot/views/scripts/section/depotdetailedmanager');
                if (!($value = json_decode($value, true))) {
                    throw new Exception('Неверно указаны данные для сохранения формы блокировки секции под менеджеров');
                }
                $view->assign(array('data' => $value['data']));
                $this->_values['ddmTransferFormDataHtml'] = $view->render('table.phtml');
            }
        }

        // Далее, если данных для сохранении формы блокировки секции под менеджеров всё таки не нашлось,
        // но выполняется "замена заказного товара", проверим существование блокировок вручную
        if (
            !isset($this->_values['ddmTransferFormDataHtml'])
            && ($replacedDdId = (int) $this->_values['replaced_dd_id']) > 0
            && App_Container::$services->depotDetailedRepository->getSectionDdmInfo($replacedDdId)->managersRowsCount > 0
        ) {
            $ddmTransferFormInfo = new Depot_Model_DepotDetailedManager_Transfer_Info($replacedDdId);
            $sectionDdmRows = $ddmTransferFormInfo->getSectionDdmRows();
            $this->_values['ddmTransferFormData'] = json_encode(array(
                'data' => $sectionDdmRows,
                'initial_raw_json_encoded_data' => json_encode($sectionDdmRows)
            ));

            $view = new Zend_View();
            $view->setScriptPath(APPLICATION_PATH . '/modules/depot/views/scripts/section/depotdetailedmanager');
            $view->assign(array('data' => $sectionDdmRows));

            $this->_values['ddmTransferFormDataHtml'] = $view->render('table.phtml');
        }
    }

    protected function _doUpdate()
    {
//        echo "<pre>" . print_r('here2', true); echo "</pre>"; // FrolovDEBUG
//        exit();
        $this->_prepareValues();
        $this->_buildCascadeHeader('Добавление товара');
        
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
                                Данные для добавления
                            </td>
                        </tr>
                        <tr style="background: #FFFFFF;">
                            <td class="aItemProductTitle">
                                <table width="300" cellspacing="1" style="border: 0px solid grey;">
                                    <tr>
                                        <td class="aClientClaimId" width="130" align="left">
                                            <?php echo $this->_names[$this->_productType]['price']?>
                                        </td>
                                        <td class="aItemProductTitle" width="170" align="center">
                                            <?php echo $this->_values['price'];?>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="aClientClaimId" width="130" align="left">
                                            <?php echo $this->_names[$this->_productType]['totalprice']?>
                                        </td>
                                        <td class="aItemProductTitle" width="170" align="center">
                                            <?php echo $this->_values['totalprice'];?>
                                        </td>
                                    </tr>
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
                                    <tr>
                                        <td class="aClientClaimId" align="left">
                                            <?php echo $this->_names[$this->_productType]['section']?>
                                        </td>
                                        <td class="aItemProductTitle" align="center">
                                            <?php echo $this->_values['section'];?>
                                        </td>
                                    </tr>
<?php
                                    if (array_key_exists('ddmTransferFormDataHtml', $this->_values)) {
?>
                                        <td class="aClientClaimId" align="left" colspan="2">
                                            <?php echo $this->_names[$this->_productType]['ddmTransferFormData']?>
                                            <?php echo $this->_values['ddmTransferFormDataHtml'];?>
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
                                Добавление данных о товаре в заявку (таблица calim_products)
                            </td>
                        </tr>
                        <tr style="background: #F0F0F6;">
                            <td class="aItemProductTitle">
                                Добавление данных о товаре в склад подробности (таблица depot_detailed)
                            </td>
                        </tr>
                        <tr style="background: #FFFFFF;">
                            <td class="aItemProductTitle">
                                Добавление данных о товаре в склад (таблица depot_n)
                            </td>
                        </tr>
                        <tr style="background: #F0F0F6;">
                            <td class="aItemProductTitle">
                                Обновление полей "кол-во(штук)/общий вес", "кол-во упаковок/кол-во роликов"
                            </td>
                        </tr>
<?php
                    if (isset($this->_values['reserved_cpmrp_row_id']) && (int) $this->_values['reserved_cpmrp_row_id'] > 0) {
                        /* ticket2841, доработка №7, пункт 2, "добавить из площадки" */
?>
                        <tr style="background: #FFFFFF;">
                            <td class="aItemProductTitle">
                                <?php echo Manufacturers_Model_ManufacturerClaims_Reserver::$cascadeMessage ?>
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
        $this->_buildCascadeFooter();

        // Zend_Debug::dump($this->_changeValue);
        // Zend_Debug::dump($this->_values);
        $this->_addProduct();
        
    }
    
    
    /**
     *Добавление товара в таблицы
     *@return void
     */
    protected function _addProduct()
    {
        // claim_products
        $this->_addProductToClaim();
        // depot_detailed
        $ddId = $this->_addProductToDetailed();
        //update claims depot_index
        $this->_updateClaimsDepot();

        // depot_2
        $addToDepotFunction = '_addProductToDepot' . $this->_functionType;
        $this->$addToDepotFunction();

        if (
            array_key_exists('ddmTransferFormData', $this->_values)
            && is_string($this->_values['ddmTransferFormData'])
            && strlen($this->_values['ddmTransferFormData']) > 0
        ) {
            // В случае, если по секции есть данные с формы детализаций, необходимо эту форму сохранить

            if (!($ddmTransferFormData = json_decode($this->_values['ddmTransferFormData'], true))) {
                throw new Exception('Неверно указаны данные для сохранения формы блокировки секции под менеджеров');
            }

            $ddmTransferFormSaver = new Depot_Model_DepotDetailedManager_Transfer_Saver(
                /**
                 * ticket2841, пункт 7, часть 1, замена заказного товара
                 * Используем ключ 'replaced_dd_id', если был использован функционал "замена заказного товара" (идентификатор заменяемой `depot_detailed`-записи).
                 * В противном случае - идектификатор добавленной `depot_detailed`-записи.
                 *
                 * Ключ 'replaced_dd_id' добавляется в App_Cascade_Detector_Claim_Depot2_Din::_prepareNewObject
                 */
                $this->_values['replaced_dd_id'] ? $this->_values['replaced_dd_id'] : $ddId,
                null,
                $ddmTransferFormData['data'],
                $ddmTransferFormData['initial_raw_json_encoded_data'],
                array(
                    // Передаем идентификатор добавленной секции в качестве подставного.
                    // Он будет использован для сохранения `depot_detailed_manager`-строк.
                    'id' => $ddId
                )
            );
            $claim = App_Db_Claims::obtain()->findOneById($this->_changeObject->claimId);
            $logContext = 'Заявка типа "Приход" ' . $claim->full_id  . ' (в режиме "каскад"), добавление товара';
            if ($this->_values['replaced_dd_id']) {
                $logContext .= ' (использован функционал "замена заказного товара")';
            }
            $ddmTransferFormSaver->setLogContext($logContext);

            if ($ddmTransferFormSaver->validate()) {
                $ddmTransferFormSaver->save();
            } else {
                throw new RuntimeException("  При проверке формы обнаружены ошибки: \r\n\r\n" . implode("\r\n", $ddmTransferFormSaver->getValidateErrors()));
            }
        }

        $this->_processCompanyEquipment();
    }


    /**
     * Добавление товара в таблицу склад КГ
     * @return void
     * @throws Zend_Db_Adapter_Exception
     * @throws Zend_Db_Statement_Exception
     */
    protected function _addProductToDepotKg()
    {
        // Добавление общего веса
        $this->getDepotAdapter()->updateAmount($this->getDepotAdapter()->getName(), 'field11', $this->_values['amount'], $this->_productId, '+', true);
        // Добавление количества роликов
        $this->getDepotAdapter()->updateAmount($this->getDepotAdapter()->getName(), 'field12', $this->_values['boxes'], $this->_productId, '+');
        // Обновление среднего веса ролика
        // Средний вес (количество в упаковке) = общий вес (количество) / количество роликов (количество упаковок)
        $this->getDepotAdapter()->updateAverageField('field11', 'field12', 'field10', $this->_productId);
    }


    /**
     * Добавление товара в таблицу склад ШТ
     * @return void
     * @throws Zend_Db_Adapter_Exception
     * @throws Zend_Db_Statement_Exception
     */
    protected function _addProductToDepotSht()
    {

        // Добавление количества
        $this->getDepotAdapter()->updateAmount($this->getDepotAdapter()->getName(), 'field11', $this->_values['amount'], $this->_productId, '+');
        // Обновление поля количество упаковок
        // Кооличество упаковок = количество / количество в упаковке
        $this->getDepotAdapter()->updateAverageField('field11', 'field10', 'field12', $this->_productId);
    }


    /**
     * Добавление товара в таблицу claim_products
     * @return void
     */
    protected function _addProductToClaim()
    {
        $data = [
            'claim_id' => $this->_changeObject->claimId,
            'depot_id' => $this->_values['depot_id'],
            'product_id' => $this->_productId,
            'number' => $this->_productNumber,
            'flag' => 2,
            'price' => $this->_values['price'],
            'totalprice' => $this->_values['totalprice'],
            'amount' => $this->_values['amount'],
            'boxes' => $this->_values['boxes'],
            'inboxes' => $this->_values['inboxes'],
            'fweight' => $this->_values['fweight'],
            'itemtype' => $this->_productType,
            'rent_koof' => $this->_values['rent_koof'],
        ];

        $insertedRowId = App_Db_ClaimProducts::obtain()->insert($data);

        if (isset($this->_values['replaced_cp_id']) && (($replacedCpId = (int) $this->_values['replaced_cp_id']) > 0)) {
            /**
             * ticket2841, пункт 7, часть 1, замена заказного товара
             * Если указан идентификатор заменяемой `claim_products`-строки, сделаем эту замену
             * в `claim_production_manufacturer_result_products`
             * Ключ 'replaced_cp_id' добавляется в App_Cascade_Detector_Claim_Depot2_Din::_prepareNewObject
             */
            if ($cpmrpRow = App_Db_ClaimProductionManufacturerResultProducts::obtain()->getRow(['cp_id = ?' => $replacedCpId])) {
                App_Db_ClaimProductionManufacturerResultProducts::obtain()->update(
                    ['cp_id' => $insertedRowId], ['cp_id = ?' => $replacedCpId]
                );
            }
        }
    }


    /**
     * Добавление товара в таблицу depot_detailed
     * @return mixed
     * @throws Zend_Db_Table_Exception
     */
    protected function _addProductToDetailed()
    {
        $claimDate = App_Db_Claims::obtain()->find($this->_changeObject->claimId)->current()->date;

        $data = [
            'claim_id' => $this->_changeObject->claimId,
            'depot_id' => $this->_values['depot_id'],
            'item_id' => $this->_productId,
            'number' => $this->_productNumber,
            'amount' => $this->_values['amount'],
            'boxes' => $this->_values['boxes'],
            'price' => $this->_values['price'],
            'totalprice' => $this->_values['totalprice'],
            'dateIn' => $claimDate,
            'placing' => $this->_values['section']
        ];

        if (isset($this->_values['reserved_cpmrp_row_id']) && (int) $this->_values['reserved_cpmrp_row_id'] > 0) {
            // ticket2841, доработка №7, пункт 2, обработка резервов позиций производства с формы
            Manufacturers_Model_ManufacturerClaims_Reserver::getInstance()->addRow([
                'product_number' => $this->_productNumber,
                'id' => $this->_values['reserved_cpmrp_row_id']
            ]);
        }

        return App_Db_DepotDetailed::obtain()->insert($data);
    }

    /**
     * обработка изменений в имуществе компании
     * @return void
     * @throws Exception
     */
    protected function _processCompanyEquipment()
    {
//        echo "<pre>" . print_r(1, true); echo "</pre>"; // FrolovDEBUG
//        exit();
        if (empty($this->_values['companyEquipment'])) {
            return ;
        }

        $number = $this->_productNumber;

        $changes = new App_Product_CompanyEquipment_ChangeList_Composite();

        $changes->getAdd()->addHash(
            App_Product_CompanyEquipment_ChangeList_Composite::fromCache()
                ->getAdd()
                ->filter(function (int $key, array $item) use($number) {
                    return $item['number'] == $number;
                })
        );
//
//        echo "<pre>" . print_r($changes->getAdd(), true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($changes->getDelete(), true); echo "</pre>"; // FrolovDEBUG
//        exit();

        $saveResult = App_Container::$services->getCompanyEquipmentService()
            ->saveChangeList($this->_changeObject->claimId, $changes);
        if ($saveResult->getAdd()->size() > 0) {
            App_Container::$services->getCompanyEquipmentWriteOffService()
                ->saveChangesResult($this->_changeObject->claimId, $saveResult);

            App_Product_CompanyEquipment_ChangeList_SaveResult::fromCache()
                ->setAdd($saveResult->getAdd())
                ->cache();
        }
    }

    /**
     * отображение изменений в имуществе компании
     * @return void
     */
    protected function _renderCompanyEquipment()
    {
        if (empty($this->_values['companyEquipment'])) {
            return ;
        }

        $tmp = explode('|', $this->_values['companyEquipment']);
        $newValue = $tmp[0] ? unserialize($tmp[0]) : new App_Product_CompanyEquipment_Model(new App_Product_CompanyEquipment_Entity());

        echo '        
            <table width="100%" cellpadding="0" cellspacing="0" border="0" class="aItemsTable">
                <tr>
                    <td class="aItemTitle" colspan="3">
                        Записи для проекта УИН
                    </td>
                </tr>
                ' . $this->_renderUinEntityModel($newValue) . '
            </table>
        ';
    }

    protected function _updateClaimsDepot()
    {
        \App_Db_Claims::obtain()->update(
          ['depot_index' => $this->_values['depot_id']],
          ['id = ?' => $this->_changeObject->claimId]
        );
    }
}
