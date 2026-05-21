<?php

/**
 * Синхронизация Depot2
 * {Template_Description_Abstract}
 *
 * @author Kononov Vladimir<vofchek@gmail.com>
 * @date 22.11.2018
 * @copyright {Template_Description_Copyrights}
 */
use \App_Network_Service_Synchronize_Data_Type_Default_Depot2Data as Depot2Data;
use \App_Network_Service_Synchronize_Data_Type_Default_Depot2ItemWeight as Depot2ItemWeight;
use \App_Network_Service_Synchronize_Data_Type_Default_Depot2Fields as Depot2Fields;
use \App_Network_Service_Synchronize_Data_Type_Default_ProductFormuls as ProductFormuls;

class App_Network_Service_Synchronize_Data_Type_Project18_Depot2 extends App_Network_Service_Synchronize_Data_Type_Abstract
{


    public function prepareData()
    {
        $data = array();

//        throw new Exception('here');
        $sql = App_Db::get()->quoteInto("
            SELECT id, field1, field2, field3, field4, field5, field6, field7, field8, field9, field10, field13, field15, field16
            FROM " . DB_DEPOT_2 . " AS d2
            WHERE id IN (?)
        ", $this->getPkValues());

        $data['depot_2'] = App_Db::get()->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC);
        if (count($data['depot_2']) === 0) {
            return [];
        }

        $data['depot_2_data'] = [];
        try {
            $depot2Data = App_Network_Service_Synchronize_Data_Factory::create(
                App_Project_Repository::getInstance()->getProject($this->getProjectId())->getApplicationEnv(),
                'depot_2_data'
            );
            $depot2Data->setPkValues($this->getPkValues());
            $data['depot_2_data'] = $depot2Data->prepareData();
        } catch (App_Network_Service_Synchronize_Data_Exception_DataTypeNotFound $e) {}

        $depot2Fields = new Depot2Fields();
        $project11Config = App_Project_Config_Pool::getInstance()->get($this->getProjectId());
        $depot2FieldsStringFields = array(13, 15);
        for ($i = 1; $i < 10; $i++) {
            if ($project11Config->depot->{'field' . $i}->type === 'string') {
                $depot2FieldsStringFields[] = $i;
            }
        }

        $depot2FieldsId = array();
        foreach ($data['depot_2'] as $depot2) {
            foreach ($depot2FieldsStringFields as $fieldId) {
                $depot2FieldsId[] = $depot2['field' . $fieldId];
            }
        }

        $depot2Fields->setPkValues($depot2FieldsId);
        $data['depot_2_fields'] = $depot2Fields->prepareData();

        // порядок важен, из-за того что для таблицы product_formuls есть триггеры,
        // устаналивающие значение поля depot_2_item_weight.value в -1
        $productFormuls = new ProductFormuls();
        $productNames = array();
        foreach ($data['depot_2_fields'] as $field) {
            if ($field['fieldId'] == 1) {
                $productNames[] = $field['text'];
            }
        }
        $productFormuls->setPkValues($productNames);
        $data['product_formuls'] = $productFormuls->prepareData();

        $depot2ItemWeight = new Depot2ItemWeight();
        $depot2ItemWeight->setPkValues($this->getPkValues());
        $data['depot_2_item_weight'] = $depot2ItemWeight->prepareData();

        $data['base_price'] = $this->_prepareBasePrices(
            array_map(function ($element) {
                return $element['id'];
            }, $data['depot_2']),
            array_unique(array_merge(
                array_map(function ($element) {
                    return $element['base_price_group_id'];
                }, $data['depot_2_data']),
                array_map(function ($element) {
                    return $element['base_price_in_group_id'];
                }, $data['depot_2_data'])
            ))
        );

        return $data;
    }

    /**
     * Обработка данных о товаре, используется mysql транзакция
     * @param array $data
     * @return void
     */
    public function processData(array $data)
    {
        Zend_Db_Table::getDefaultAdapter()->beginTransaction();

        $this->processDataWithoutTransaction($data);

        Zend_Db_Table::getDefaultAdapter()->commit();
    }

    /**
     * Обработка данных о товаре, не используется mysql транзакция
     * @param array $data
     * @return void
     */
    public function processDataWithoutTransaction(array $data)
    {
        if (count($data) === 0) {
            return ;
        }

        $allId = array_map(
            function ($element) {
                return $element['id'];
            },
            $data['depot_2']
        );
        $existingId = $this->_findExistingItems($allId);
        $newId = (array) array_diff($allId, $existingId);

        foreach (App_Depot_Handlers_Manager::getCollection() as $depotData) {
            foreach ($data['depot_2'] as $row) {
                App_Depot_Handlers_Router::getInstance()->getDepotAdapter($depotData->id)->insertUpdate($row);
            }
        }

        // нет цикла, потому точ важен порядок заполнения таблиц
        $synchronizeReciever = new App_Network_Service_Synchronize_Reciever();
        if (array_key_exists('depot_2_group_minamount', $data)) {
            $synchronizeReciever->proccessData('depot_2_group_minamount', $data['depot_2_group_minamount']);
        }

        if (array_key_exists('depot_2_data', $data)) {
            $synchronizeReciever->proccessData('depot_2_data', $data['depot_2_data']);
        }

        if (array_key_exists('product_formuls', $data)) {
            // только добавляем новые формулы
            $productFormulsId = array();
            foreach ($data['product_formuls'] as $productFormul) {
                $productFormulsId[] = $productFormul['id'];
            }

            $sql = "
                SELECT id
                FROM product_formuls
                WHERE id IN (?)
            ";
            $existingPproductFormuls = (array) App_Db::get()->query($sql, array(implode(',', $productFormulsId)))->fetchAll(Zend_Db::FETCH_COLUMN);

            foreach ($data['product_formuls'] as $index => $product) {
                if (in_array($product['id'], $existingPproductFormuls)) {
                    unset($data['product_formuls'][$index]);
                }
            }

            $synchronizeReciever->proccessData('product_formuls', $data['product_formuls']);
        }

        if (array_key_exists('depot_2_item_weight', $data)) {
            $synchronizeReciever->proccessData('depot_2_item_weight', $data['depot_2_item_weight']);
        }

        if (array_key_exists('depot_2_fields', $data)) {
            $synchronizeReciever->proccessData('depot_2_fields', $data['depot_2_fields']);
        }

        if (count($newId) > 0) {
            $this->_proccessBasePrice($data['base_price'], $newId);
        }
    }

    /**
     * Подготовка информации о бц
     * @param array $itemIds - id товаров
     * @param array $basePriceGroups - id групп бц
     * @return array
     */
    private function _prepareBasePrices($itemIds, $basePriceGroups)
    {
        $basePriceInfo = array();

        $sql = App_Db::get()->quoteInto("
            SELECT id
            FROM " . DB_BASE_PRICES . "
            WHERE item_id IN (?) AND
                cur_date <= NOW() AND
                (date_to IS NULL OR date_to >= NOW())
            GROUP BY item_id
        ", $itemIds);
        $bpSynchronizer = App_Network_Service_Synchronize_Data_Factory::create(
            App_Project_Repository::getInstance()->getProject($this->getProjectId())->getApplicationEnv(),
            'base_prices'
        );
        $bpSynchronizer->setPkValues(
            App_Db::get()->query($sql)->fetchAll(Zend_Db::FETCH_COLUMN)
        );
        $basePriceInfo['base_prices'] = $bpSynchronizer->prepareData();

        $sql = App_Db::get()->quoteInto("
            SELECT *
            FROM " . DB_BASE_PRICES_GROUPS . "
            WHERE id IN (?)
        ", $basePriceGroups);
        $basePriceInfo['base_prices_groups'] = App_Db::get()->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC);

        $sql = App_Db::get()->quoteInto("
            SELECT *
            FROM " . DB_BASE_PRICES_CLASSIFICATION . "
            WHERE id IN (?)
        ", array_map(
            function ($element) {
                return $element['classification_id'];
            },
            $basePriceInfo['base_prices_groups']
        ));
        $basePriceInfo['base_prices_classification'] = App_Db::get()->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC);

        $sql = "
            SELECT *
            FROM " . DB_BASE_PRICES_CLASSIFICATION_PARAMS;
        $basePriceInfo['base_prices_classification_params'] = App_Db::get()->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC);

        $sql = App_Db::get()->quoteInto("
            SELECT *
            FROM " . DB_BASE_PRICES_CLASSIFICATION_DATA . "
            WHERE classification_id IN (?)
        ", array_map(
            function ($element) {
                return $element['classification_id'];
            },
            $basePriceInfo['base_prices_groups']
        ));
        $basePriceInfo['base_prices_classification_data'] = App_Db::get()->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC);

        $sql = App_Db::get()->quoteInto("
            SELECT *
            FROM " . DB_BASE_PRICES_GROUPS_DATA . "
            WHERE base_price_group_id IN (?)
        ", $basePriceGroups);
        $basePriceInfo['base_prices_groups_data'] = App_Db::get()->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC);

        $basePriceGroupsIdToSearch = array();
        foreach ($basePriceInfo['base_prices_groups_data'] as $basePriceGroupData) {
            $basePriceGroupsIdToSearch[] = 'param_id = ' . $basePriceGroupData['param_id'] . ' AND id = ' . $basePriceGroupData['value_id'];
        }
        if (count($basePriceGroupsIdToSearch) > 0) {
            $sql = "
                SELECT *
                FROM " . DB_BASE_PRICES_GROUPS_VALUES . "
                WHERE " . implode(' OR ', $basePriceGroupsIdToSearch);
            $basePriceInfo['base_prices_groups_values'] = App_Db::get()->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC);
        }

        return $basePriceInfo;
    }

    /**
     * Сохранение информации о бц
     * @param array $data
     * @param array $newIds
     */
    private function _proccessBasePrice($data, $newIds)
    {
        $synchronizeReciever = new App_Network_Service_Synchronize_Reciever();

        if (!empty($data['base_prices'])) {
            $synchronizeReciever->proccessData('base_prices', $data['base_prices']);
        }

        $data['base_prices_groups'] = is_array($data['base_prices_groups']) ? $data['base_prices_groups'] : array();
        foreach ($data['base_prices_groups'] as $basePriceGroup) {
            if (!App_Db_BasePricesGroups::obtain()->recordExist(array("id" => $basePriceGroup['id']))) {
                App_Db_BasePricesGroups::obtain()->insert($basePriceGroup);
            }
        }

        $data['base_prices_classification'] = is_array($data['base_prices_classification']) ? $data['base_prices_classification'] : array();
        foreach ($data['base_prices_classification'] as $basePricesClassification) {
            if (!App_Db_BasePricesClassification::obtain()->recordExist(array("id" => $basePricesClassification['id']))) {
                App_Db_BasePricesClassification::obtain()->insert($basePricesClassification);
            }
        }

        $data['base_prices_classification_params'] = is_array($data['base_prices_classification_params']) ? $data['base_prices_classification_params'] : array();
        foreach ($data['base_prices_classification_params'] as $basePricesClassificationParams) {
            if (!App_Db_BasePricesClassificationParams::obtain()->recordExist(array("id" => $basePricesClassificationParams['id']))) {
                App_Db_BasePricesClassificationParams::obtain()->insert($basePricesClassificationParams);
            }
        }

        $data['base_prices_classification_data'] = is_array($data['base_prices_classification_data']) ? $data['base_prices_classification_data'] : array();
        foreach ($data['base_prices_classification_data'] as $basePricesClassificationData) {
            if (!App_Db_BasePricesClassificationData::obtain()->recordExist(array("id" => $basePricesClassificationData['id']))) {
                App_Db_BasePricesClassificationData::obtain()->insert($basePricesClassificationData);
            }
        }

        $data['base_prices_groups_data'] = is_array($data['base_prices_groups_data']) ? $data['base_prices_groups_data'] : array();
        foreach ($data['base_prices_groups_data'] as $basePricesGroupsData) {
            if (!App_Db_BasePricesClassificationData::obtain()->recordExist(array("id" => $basePricesGroupsData['id']))) {
                App_Db_BasePricesGroupsData::obtain()->insertUpdate($basePricesGroupsData);
            }
        }

        $data['base_prices_groups_values'] = is_array($data['base_prices_groups_values']) ? $data['base_prices_groups_values'] : array();
        foreach ($data['base_prices_groups_values'] as $basePricesGroupsValues) {
            if (!App_Db_BasePricesGroupsValues::obtain()->recordExist(array("id" => $basePricesGroupsValues['id']))) {
                App_Db_BasePricesGroupsValues::obtain()->insert($basePricesGroupsValues);
            }
        }
    }

    /**
     * Возвращает массив существующих товаров
     * @param array $ids
     * @return array
     */
    private function _findExistingItems($ids)
    {
        $id = array();
        $rowSet = App_Db_Depot2::obtain()->find($ids);
        foreach ($rowSet as $row) {
            $id[] = $row->id;
        }

        return $id;
    }
}
