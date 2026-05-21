<?php
/**
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author Frolov Anatoliyfrolov_anatoliy@amd-co.ru>
 * @date 07.02.2025
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution
 */


use App_Network_Service_Synchronize_Data_Type_Abstract as AbstractType;

class App_Network_Service_Synchronize_Data_Type_Inventory_DepotList extends AbstractType
{

    public function prepareData()
    {
        $pkValues = array_map(
            function ($element) {
                return (int)$element;
            },
            $this->getPkValues()
        );

        if (empty($pkValues)) {
            return [];
        }

        $sql = "
            SELECT *
            FROM " . DB_DEPOT_2_FIELDS . "
            WHERE id IN (" . implode(',', $pkValues) . ")
        ";

        return App_Db::get()->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC);
    }

    public function processData(array $data)
    {
        if (empty($data)) {
            return true;
        }

        $sqlStmt = new Zend_Db_Statement_Pdo(App_Db::get(), "
            INSERT INTO " . DB_EXT_INVENTORY_DEPOT_2_FIELDS . "(project_id, id, fieldId, `text`)
            VALUES (:project_id, :id, :fieldId, :text)
            ON DUPLICATE KEY UPDATE `text` = VALUES(`text`)
        ");

        foreach ($data as $dataToSave) {
            $sqlStmt->execute([
                ':project_id' => $this->getProjectId(),
                ':id'         => $dataToSave['id'],
                ':fieldId'    => $dataToSave['fieldId'],
                ':text'       => $dataToSave['text'],
            ]);
        }
    }
}
