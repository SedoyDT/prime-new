<?php
/**
 * Общий фильтр страниц, где есть инвентарные номера
 */
use App_Filter_AbstractFilter as AbstractFilter;

class Inventory_Model_Index_Filter extends AbstractFilter
{


    /**
     * доступ к полю доступ
     * @var []
     */
    protected $_accessPermissions = null;

    /**
     * id секции, записи из которой нужно отображать
     * @return int
     */
    public function getSectionId() : int
    {
        return (int) $this->_options['section_id'] ?? 0;
    }

    /**
     * тип
     * @return int
     */
    public function getTypeId() : int
    {
        return (int) $this->_options['type_id'] ?? 0;
    }

    /**
     * нужны активные записи или нет
     * @return int
     */
    public function getIsActive() : int
    {
        return (int) $this->_options['is_active'] ?? 0;
    }

    /**
     * список названий товаров, у которых можно просматривать поле "доступ"
     * @return array
     */
    public function getAccessPermissions()
    {
        if (is_null($this->_accessPermissions)) {
            if (App_Access::get('key', 'inventory>all_access')) {
                $this->_accessPermissions = ['*'];
            } else {
                $this->_accessPermissions = explode(',', App_Access::get('key', 'inventory>list_access'));
            }
        }

        return $this->_accessPermissions;
    }


    /**
     * @return string
     */
    public function getAccessPermissionsString()
    {
        return "'" . join("','", $this->getAccessPermissions()) . "'";
    }

    public function init()
    {
        $whereDecorator = new App_Filter_Component_Decorator_Type_DefaultWhereConditions_Decorator();
        $whereDecorator->getWhereConditionsInner()->add('data.section_id = ' . $this->getSectionId());

        $whereDecorator->getWhereConditionsInner()->add('data.is_active = ' . $this->getIsActive());

        $avaliableProjects = array_merge(
            [0],
            explode(',', App_Access::get('key', 'inventory>projects'))
        );
        $whereDecorator->getWhereConditionsInner()->add('data.project_id IN (' . implode(',', $avaliableProjects) . ')');

        $this->addDecorator($whereDecorator);

        $managersDecorator = new Inventory_Model_Index_AclManagersDecorator();
        $managersDecorator->setAclPath('inventory>managers');
        // имя поля, которое нужно использовать для фильтрации менеджеров
        $managersDecorator->setFilterFieldManager('data.user_id');
        // имя поля, которое нужно использовать для фильтрации отделов
        $managersDecorator->setFilterFieldDepartment('data.orgstructure_id');
        $managersDecorator->setUseWhereInner(true);
        $this->addDecorator($managersDecorator);

        $accessPermission = $this->getAccessPermissions();
        $this->registerResultPostProcess(function (&$result) use($accessPermission) {
            $users = [];
            $orgstructures = [];
            $findUser = function (int $userId) use($users) {
                if (!in_array($userId, $users)) {
                    $users[$userId] = App_Db_ExtInventoryUser::obtain()->getRow(['id = ?' => $userId]);
                }

                return $users[$userId];
            };

            $findOrgstructure = function (int $orgstructureId) use($orgstructures, $findUser) {
                if (!in_array($orgstructureId, $orgstructures)) {
                    $orgstructures[$orgstructureId] = App_Db_ExtInventoryOrgstructure::obtain()->getRow([
                        'id = ?' => $orgstructureId
                    ]);
                }

                return $orgstructures[$orgstructureId];
            };

            $getProject = function (?int $projectId) : App_Project_Model {
                if (is_null($projectId)) {
                    $project = new App_Project_Model();
                    $project->setState(false);
                    return $project;
                }

                return App_Project_Repository::getInstance()->getProject($projectId);
            };

            foreach ($result as &$rowData) {
                $rowData->__uniqueId = $rowData->is_free . ':' . $rowData->id;

                $rowData->field5_value_md5 = md5($rowData->field5_value);
                $rowData->field3_value_md5 = md5($rowData->field3_value);

                // Есть ограничения по доступам
                if (!in_array('*', $accessPermission)) {
                    // Для проектов, у которых field5 = названию
                    if (in_array($rowData->project_id, [7]) && !in_array($rowData->field5_value_md5, $accessPermission)) {
                        $rowData->access = '';
                    }
                    // Для проектов, у которых field3 = названию
                    else if (!in_array($rowData->field3_value_md5, $accessPermission)) {
                        $rowData->access = '';
                    }
                }

                $rowData->description = strip_tags($rowData->description);
                $rowData->project_title = App_Project_Repository::getInstance()->getProject($rowData->project_id)->getTitle();

                $rowData->is_active_formatted = $rowData->is_active == 1 ? 'не списан' : 'списан';
                $rowData->type_title = App_Constant_Depot_Inventory_Type::getDescription()[(int) $rowData->type_id];

                $rowData->project_create_user = $rowData->project_create_user_id > 0 ? $findUser((int) $rowData->project_create_user_id)['name'] : '';
                $rowData->project_claim_in_manager = $rowData->project_claim_in_manager_id > 0 ? $findUser((int) $rowData->project_claim_in_manager_id)['name'] : '';
                $rowData->assigned_user = $rowData->assigned_user_id > 0 ? $findUser((int) $rowData->assigned_user_id)['name'] : '';
                $rowData->assigned_project_title = $rowData->assigned_user_id > 0 ? $getProject((int) $rowData->assigned_project_id)->getTitle() : '';
                $rowData->assigned_orgstructure_title = $rowData->assigned_user_id > 0 ? $findOrgstructure((int) $rowData->assigned_orgstructure_id)['title'] : '';
                $rowData->previous_assigned_user = $rowData->previous_assigned_user_id > 0 ? $findUser((int) $rowData->previous_assigned_user_id)['name'] : '';
                $rowData->previous_assigned_project_title = $rowData->previous_assigned_user_id > 0 ? $getProject($findUser((int) $rowData->previous_assigned_user_id)['project_id'])->getTitle() : '';
                $rowData->owner_project_title = $rowData->owner_project_id > 0 ? $getProject($rowData->owner_project_id)->getTitle() : '';
                $rowData->claim_in_url = App_Project_Repository::getInstance()->getProject($rowData->project_id)->getFullUrl() . '/claim/in/' . $rowData->claim_in;
                $rowData->claim_out_url = App_Project_Repository::getInstance()->getProject($rowData->project_id)->getFullUrl() . '/claim/out/' . $rowData->claim_out;

                $rowData->is_inventory_number = $rowData->type_id == App_Constant_Depot_Inventory_Type::INVENTORY_NUMBER;
                $rowData->is_consumables = $rowData->type_id == App_Constant_Depot_Inventory_Type::CONSUMABLES;

                $rowData->in_repair_formatted = $rowData->in_repair > 0 ? 'Да' : 'Нет';
            }
        });
    }

    protected function _getSqlQuery()
    {
        $sql = "
            SELECT *
            FROM (
                SELECT
                    ext_inventory_depot_list.title AS depot_title,
                    ext_inventory_depot_list.id AS depot_id,
                    0 AS is_free,
                    ext_inventory_accounting.id,
                    ext_inventory_depot_detailed.project_id,
                    ext_inventory_depot_detailed.section_id,
                    ext_inventory_depot_detailed.type_id,
                    ext_inventory_accounting.amount AS amount,
                    ext_inventory_depot_detailed.inboxes AS inboxes,
                    IFNULL(ext_inventory_accounting.placing, '') AS placing,
                    ext_inventory_accounting.placing_hash,
    
                    orgstructure_users.userId AS user_id,
                    orgstructure_users.oId AS orgstructure_id,
    
                    ext_inventory_accounting.project_create_user_id,
    
                    ext_inventory_depot_detailed.claim_in AS claim_in,
                    ext_inventory_depot_detailed.claim_in_manager_id AS project_claim_in_manager_id,
                       
                    ext_inventory_depot_detailed.claim_in_date,
                    IFNULL(DATE_FORMAT(ext_inventory_depot_detailed.claim_in_date, '%d.%m.%Y'), '-') AS project_claim_in_date_formatted,
                       
                    ext_inventory_depot_detailed.claim_out,
    
                    ext_inventory_depot_detailed.price AS price,
                    ext_inventory_depot_detailed.item_id AS project_item_id,
    
                    ext_inventory_accounting.project_inventory_number_id,
                    ext_inventory_accounting.project_inventory_number,
    
                    ext_inventory_accounting.assign_date AS assign_date,
                    IF ( 
                        ext_inventory_accounting.assign_date IS NULL OR 
                        ext_inventory_accounting.assign_date = '0000-00-00 00:00:00'
                        , 
                        '', 
                        DATE_FORMAT(ext_inventory_accounting.assign_date, '%d.%m.%Y')
                    ) AS assign_date_formatted,
                    IFNULL(ext_inventory_accounting.assigned_user_id, 0) AS assigned_user_id,
                    IFNULL(ext_inventory_user.project_id, 0) AS assigned_project_id,
                    IFNULL(ext_inventory_user.ext_inventory_orgstructure_id, 0) AS assigned_orgstructure_id,
                   
                    ext_inventory_accounting.is_active,
                       
                    ext_inventory_accounting.group_id,
                    IFNULL(ext_inventory_accounting_group.name, '-') AS group_name,
    
                    IFNULL(did2f_description.text, '') AS `description`,
                    did2f_description.id AS description_id,
    
                    ext_inventory_accounting.`access`,
                    ext_inventory_accounting.access_hash,
    
                    IFNULL(ext_inventory_accounting.previous_assigned_user_id, 0) AS previous_assigned_user_id,
                    previous_ext_inventory_user.project_id AS previous_assigned_project_id,
    
                    ext_inventory_accounting.office,
                    ext_inventory_accounting.office_hash,
                    
                    ext_inventory_accounting.comment,
                    ext_inventory_accounting.comment_hash,
    
                    ext_inventory_accounting.sweeping,
                    ext_inventory_accounting.usb_flash,
                    ext_inventory_accounting.is_off,
                    
                    ext_inventory_accounting.owner_project_id,
                    ext_inventory_accounting.connectivity,
                       
                    IFNULL(ext_inventory_depot_detailed.auto_deactivation_comment, '') AS auto_deactivation_comment,
                    ext_inventory_depot_detailed.auto_deactivation_comment_hash AS auto_deactivation_comment_hash,
                       
                    IFNULL(ext_inventory_accounting.deactivation_comment, '') AS deactivation_comment,
                    ext_inventory_accounting.deactivation_comment_hash AS deactivation_comment_hash,
                    
                    ext_inventory_accounting.in_repair,    
                    ext_inventory_accounting.deactivation_user AS deactivation_user_id,
                    u.name AS deactivation_user_name,
                    
                    ext_inventory_accounting.deactivation_date,
                    DATE_FORMAT(ext_inventory_accounting.deactivation_date, '%d.%m.%Y') AS deactivation_date_formatted,
    
                    {DEPOT_CONFIG_QUERY}
                FROM ext_inventory_accounting          
                INNER JOIN ext_inventory_depot_detailed
                ON
                    ext_inventory_accounting.ext_inventory_depot_detailed_id = ext_inventory_depot_detailed.id
                INNER JOIN orgstructure_users
                ON
                    ext_inventory_accounting.user_id = orgstructure_users.userId
                INNER JOIN ext_inventory_depot_2
                ON
                    ext_inventory_depot_detailed.project_id = ext_inventory_depot_2.project_id AND
                    ext_inventory_depot_detailed.item_id = ext_inventory_depot_2.id
                LEFT JOIN ext_inventory_depot_2_fields AS did2f_description
                ON 
                    ext_inventory_depot_detailed.project_id = did2f_description.project_id AND
                    did2f_description.fieldId = 13 AND
                    did2f_description.id = ext_inventory_depot_2.field13
                LEFT JOIN ext_inventory_accounting_group
                ON
                    ext_inventory_accounting_group.id = ext_inventory_accounting.group_id
                LEFT JOIN ext_inventory_user
                ON 
                    ext_inventory_user.id = ext_inventory_accounting.assigned_user_id
                LEFT JOIN ext_inventory_user AS previous_ext_inventory_user
                ON 
                    previous_ext_inventory_user.id = ext_inventory_accounting.previous_assigned_user_id
                LEFT JOIN users u
                ON 
                    ext_inventory_accounting.deactivation_user = u.id
                LEFT JOIN ext_inventory_depot_list ON 
                    ext_inventory_depot_list.id = ext_inventory_depot_detailed.depot_id 
    
                UNION ALL
                
                SELECT 
                    ext_inventory_depot_list.title AS depot_title,
                    ext_inventory_depot_list.id AS depot_id,
                    1 AS is_free,
                    ext_inventory_depot_detailed.id AS id,
                    ext_inventory_depot_detailed.project_id,
                    ext_inventory_depot_detailed.section_id,
                    ext_inventory_depot_detailed.type_id,
                    ext_inventory_depot_detailed.free_amount AS amount,
                    ext_inventory_depot_detailed.inboxes AS inboxes,
                    IFNULL(ext_inventory_depot_detailed.placing, '') AS placing,
                    ext_inventory_depot_detailed.placing_hash,
                       
                    orgstructure_users.userId AS user_id,
                    orgstructure_users.oId AS orgstructure_id,
                       
                    ext_inventory_depot_detailed.project_create_user_id,
                       
                    ext_inventory_depot_detailed.claim_in AS claim_in,
                    ext_inventory_depot_detailed.claim_in_manager_id AS project_claim_in_manager_id,
                   
                    ext_inventory_depot_detailed.claim_in_date,
                    IFNULL(DATE_FORMAT(ext_inventory_depot_detailed.claim_in_date, '%d.%m.%Y'), '-') AS project_claim_in_date_formatted,
                       
                    ext_inventory_depot_detailed.claim_out,
                       
                    ext_inventory_depot_detailed.price AS price,
                    ext_inventory_depot_detailed.item_id AS project_item_id,
                       
                    NULL AS project_inventory_number_id,
                    NULL AS project_inventory_number,
                       
                    NULL AS assign_date,
                    '' AS assign_date_formatted,
                    0 AS assigned_user_id,
                    0 AS assigned_project_id,
                    0 AS assigned_orgstructure_id,
                       
                    1 AS is_active,
                       
                    NULL AS group_id,
                    '-' AS group_name,
                       
                    IFNULL(did2f_description.text, '') AS `description`,
                    did2f_description.id AS description_id,
                       
                    '' AS `access`,
                    '' AS access_hash,
    
                    0 AS previous_assigned_user_id,
                    0 AS previous_assigned_project_id,
    
                    '' AS office,
                    '' AS office_hash,
                    
                    '' AS comment,
                    '' AS comment_hash,
    
                    '' AS sweeping,
                    '' AS usb_flash,
                    '' AS is_off,
                    
                    '' AS owner_project_id,
                    0 AS connectivity,
                       
                    ext_inventory_depot_detailed.auto_deactivation_comment AS auto_deactivation_comment,
                    ext_inventory_depot_detailed.auto_deactivation_comment_hash AS auto_deactivation_comment_hash,
                       
                    0 AS in_repair,

                    '' AS deactivation_comment,
                    NULL AS deactivation_comment_hash,
                    NULL AS deactivation_user_id,
                    NULL AS deactivation_user_name,
                    NULL AS deactivation_date,
                    NULL AS deactivation_date_formatted,
                    
                    {DEPOT_CONFIG_QUERY}
                FROM ext_inventory_depot_detailed
                INNER JOIN orgstructure_users
                ON
                    ext_inventory_depot_detailed.user_id = orgstructure_users.userId
                INNER JOIN ext_inventory_depot_2
                ON
                    ext_inventory_depot_detailed.project_id = ext_inventory_depot_2.project_id AND
                    ext_inventory_depot_detailed.item_id = ext_inventory_depot_2.id
                LEFT JOIN ext_inventory_depot_2_fields AS did2f_description
                ON 
                    ext_inventory_depot_detailed.project_id = did2f_description.project_id AND
                    did2f_description.fieldId = 13 AND
                    did2f_description.id = ext_inventory_depot_2.field13
                LEFT JOIN ext_inventory_depot_list ON 
                    ext_inventory_depot_list.id = ext_inventory_depot_detailed.depot_id 
                WHERE ext_inventory_depot_detailed.free_amount > 0
            ) AS data
            {WHEREIN}
        ";

        $sql = $this->_prepareDepotParamsSql($sql);
        return $sql;
    }

    /**
     * Метод для получения запроса для получения суммы по полю "цена"
     * @return string
     */
    public function getResultSumSqlQuery()
    {
        $sql = "
            SELECT ROUND(IFNULL(SUM(result.price * result.amount), 0), 2) AS total_sum
            FROM (
                {$this->_getSqlQuery()}
            ) AS result
            {WHERE}
        ";

        return $sql;
    }

    /**
     * Метод для подготовки основного запроса
     * @param string $sql - запрос, который нужно подготовить
     * @return string
     */
    protected function _prepareDepotParamsSql($sql)
    {
        $productSql = new App_Product_InventoryNumbers_External_InventoryNumber_ProductSpecification();
        $productSql->setDepot2Alias('ext_inventory_depot_2');
        $productSql->setDepot2FieldsAlias('did2f');
        $productSql->setProjectIdFieldName('ext_inventory_depot_detailed.project_id');
        $depotSql = $productSql->getFieldSql();

        $depotSql[0] .= ", CONCAT(ext_inventory_depot_2.project_id, ':', ext_inventory_depot_2.field1) AS field1_mask";
        $depotSql[2] .= ", CONCAT(ext_inventory_depot_2.project_id, ':', ext_inventory_depot_2.field3) AS field3_mask";
        $depotSql[4] .= ", CONCAT(ext_inventory_depot_2.project_id, ':', ext_inventory_depot_2.field5) AS field5_mask";

        $sql = str_replace(
            array('{DEPOT_CONFIG_QUERY}'),
            array(implode(", ", $depotSql)),
            $sql
        );

        return $sql;
    }
}
