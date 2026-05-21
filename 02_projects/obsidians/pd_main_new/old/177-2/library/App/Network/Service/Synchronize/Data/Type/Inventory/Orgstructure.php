<?php

/**
 * Класс для подготовки и обработки данных об оргструктуре
 * {Template_Description_Abstract}
 *
 * @author Kononov Vladimir<vofchek@gmail.com>
 * @date 26.07.2017
 * @copyright {Template_Description_Copyrights}
 */
use App_Network_Service_Synchronize_Data_Type_Abstract as AbstractType;

class App_Network_Service_Synchronize_Data_Type_Inventory_Orgstructure extends AbstractType
{


    public function prepareData()
    {
        $pkValues = array_map(
            function ($element) {
                return (int) $element;
            },
            $this->getPkValues()
        );

        if (empty($pkValues)) {
            return [];
        }

        $sql = "
            SELECT             
                o.id AS orgstructure_id,
                o.title AS orgstructure_title
            FROM " . DB_ORGSTRUCTURE . " AS o                
            WHERE o.id IN (" . implode(',', $pkValues) . ")
        ";

        return App_Db::get()->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC);
    }

    public function processData(array $data)
    {
        if (empty($data)) {
            return true;
        }

        foreach ($data as $orgstructure) {
            App_Db_ExtInventoryOrgstructure::obtain()->insertUpdate([
                'project_id' => $this->getProjectId(),
                'orgstructure_id' => $orgstructure['orgstructure_id'],
                'title' => $orgstructure['orgstructure_title']
            ]);
        }
    }
}
