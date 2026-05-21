<?php

/**
 * Синхронизация Depot2Fields
 * {Template_Description_Abstract}
 *
 * @author Kononov Vladimir<vofchek@gmail.com>
 * @date 12.02.2018
 * @copyright {Template_Description_Copyrights}
 */
class App_Network_Service_Synchronize_Data_Type_Default_Depot2Fields extends App_Network_Service_Synchronize_Data_Type_Abstract
{


    public function prepareData()
    {
        throw new Exception("here");
        $sql = App_Db::get()->quoteInto("
            SELECT *
            FROM " . DB_DEPOT_2_FIELDS . "
            WHERE id IN (?)
        ", $this->getPkValues());
        return App_Db::get()->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC);
    }

    public function processData(array $data)
    {
        throw new Exception("here2");
        if (count($data) === 0) {
            return ;
        }
        
        $insertStmt = new Zend_Db_Statement_Pdo(App_Db::get(), "
            INSERT INTO " . DB_DEPOT_2_FIELDS . "(id, `text`, fieldId)
            VALUES (:id, :text, :fieldId)
            ON DUPLICATE KEY UPDATE `text` = VALUES(`text`), `fieldId` = VALUES(`fieldId`)
        ");

        foreach ($data as $row) {
            $insertStmt->execute($row);
        }
    }
}
