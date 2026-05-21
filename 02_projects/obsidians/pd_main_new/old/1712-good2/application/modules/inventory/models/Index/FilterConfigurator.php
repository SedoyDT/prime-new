<?php
/**
 * Общий конфигуратор фильтра
 * @author Kononov
 */
use Inventory_Model_Index_Filter as Filter;
use App_Filter_Excel_Converter as FilterConverter;
use App_Filter_Excel_Component_Decorator_Header as HeaderDecorator;
use App_Filter_Excel_Component_Decorator_AlbumPageSetup as AlbumPageSetupDecorator;
use App_Filter_Excel_Component_Decorator_HorizontalScale as HorizontalScaleDecorator;

abstract class Inventory_Model_Index_FilterConfigurator
{


    public function setUpFilter(Filter $filter)
    {
        $this->_setUpMask($filter);
        $this->_setUpConfig($filter);
    }

    protected function _setUpMask(Filter $filter)
    {
        $mask = $filter->getMask();

        $mask->create('select', 'is_free', 'is_free');
        $mask->create('select', 'type_id', 'type_id');

        $mask->create('select', 'project_id', 'project_id');

        $mask->create('select', 'project_create_user_id','project_create_user_id');

        $mask->create('select', 'claim_in', 'claim_in');
        $mask->create('select', 'depot_title', 'depot_title');
        $mask->create('select', 'price', 'price');
        $mask->create('select', 'project_item_id', 'project_item_id');
        $mask->create('select', 'placing_hash', 'placing_hash');

        $mask->create('select', 'project_claim_in_manager_id', 'project_claim_in_manager_id');
        $mask->create("date_day_range", "claim_in_date", "claim_in_date");

        $mask->create('select', 'id', 'id');

        $mask->create('select', 'assign_date', 'assign_date');
        $mask->create('select', 'assigned_project_id', 'assigned_project_id');
        $mask->create('select', 'assigned_orgstructure_id', 'assigned_orgstructure_id');
        $mask->create('select', 'assigned_user_id', 'assigned_user_id');

        $mask->create('select', 'previous_assigned_project_id', 'previous_assigned_project_id');
        $mask->create('select', 'previous_assigned_user_id', 'previous_assigned_user_id');
        $mask->create('select', 'group_id', 'group_id');

        $mask->add(new Inventory_Model_Index_CompositeSelect(array(
            "name" => 'field1_mask',
            "fieldName" => 'field1_mask',
            "fieldComposition" => array(
                'project_id',
                'field1'
            )
        )));

        $mask->add(new Inventory_Model_Index_CompositeSelect(array(
            "name" => 'field3_mask',
            "fieldName" => 'field3_mask',
            "fieldComposition" => array(
                'project_id',
                'field3'
            )
        )));

        $mask->add(new Inventory_Model_Index_CompositeSelect(array(
            "name" => 'field5_mask',
            "fieldName" => 'field5_mask',
            "fieldComposition" => array(
                'project_id',
                'field5'
            )
        )));

        $mask->create('select', 'description_id', 'description_id');

        if (App_Access::get('key', 'inventory>comment') > 0) {
            $mask->create('select', 'comment_hash', 'comment_hash');
        }

        if (!$filter->getIsActive()) {
            $mask->create('select', 'auto_deactivation_comment_hash', 'auto_deactivation_comment_hash');
            $mask->create('select', 'deactivation_comment_hash', 'deactivation_comment_hash');
            $mask->create('select', 'deactivation_user_id','deactivation_user_id');
            $mask->create('date_day_range', 'deactivation_date','deactivation_date');
        }

        $mask->create('select', 'in_repair', 'in_repair');
    }

    protected function _setUpConfig(Filter $filter)
    {
        $config = $filter->getConfig();

        $projectsList = $this->_getProjectList();

        $config->create(array(
            'fieldName' => "project_id",
            'caption' => 'Проект',
            'filterType' => 'number',
            'filterUse' => 'select',
            'options' => $projectsList
        ));

        $config->create(array(
            'fieldName' => "is_free",
            'caption' => 'Свободная запись',
            'filterType' => 'number',
            'filterUse' => 'select',
            'options' => [
                ['v' => 0, 't' => 'Нет'],
                ['v' => 1, 't' => 'Да']
            ]
        ));

        $config->create(array(
            'fieldName' => "type_id",
            'caption' => 'Тип',
            'filterType' => 'number',
            'filterUse' => 'select',
            'options' => App_Helper_Data::arrayToValueTitle(App_Constant_Depot_Inventory_Type::getDescription())
        ));

        $config->create(array(
            'fieldName' => "project_create_user_id",
            'caption' => 'Создал',
            'filterType' => 'number',
            'filterUse' => 'inselect',
            'condition' => 'findInSelect',
            'options' => "
                SELECT 
                   GROUP_CONCAT(id) AS v, 
                   `name` AS t
                FROM ext_inventory_user
                GROUP BY ext_inventory_user.name
            "
        ));

        $config->create(array(
            'fieldName' => "project_claim_in_manager_id",
            'caption' => 'Приходной менеджер',
            'filterType' => 'number',
            'filterUse' => 'inselect',
            'condition' => 'findInSelect',
            'options' => "
                SELECT 
                   GROUP_CONCAT(id) AS v, 
                   `name` AS t
                FROM ext_inventory_user
                GROUP BY ext_inventory_user.name
            "
        ));

        $config->create(array(
            'fieldName' => "claim_in",
            'caption' => 'Заявка приход',
            'filterType' => 'number',
            'filterUse' => 'select',
            'options' => "
                SELECT DISTINCT
                    ext_inventory_depot_detailed.claim_in AS v,
                    ext_inventory_depot_detailed.claim_in AS t
                FROM ext_inventory_depot_detailed 
            "
        ));

        $config->create(array(
            'caption' => 'Дата исполнения заявки на приход',
            'fieldName' => 'claim_in_date',
            'filterUse' => 'date',
            'options' => array()
        ));

        $config->create(array(
            'caption' => 'Склад',
            'fieldName' => 'depot_title',
            'filterUse' => 'select',
            'options' => "
                SELECT DISTINCT
                    id          AS v,
                    title       AS t
                FROM ext_inventory_depot_list
                ORDER BY t ASC
            "
        ));

        $config->create(array(
            'fieldName' => "price",
            'caption' => 'Цена',
            'filterType' => 'number',
            'filterUse' => 'combo',
            'options' => "
                SELECT DISTINCT
                    price AS v,
                    price AS t
                FROM ext_inventory_depot_detailed
            "
        ));

        $config->create(array(
            'fieldName' => "project_item_id",
            'caption' => 'Id товара',
            'filterType' => 'number',
            'filterUse' => 'select',
            'options' => "
                SELECT DISTINCT
                    item_id AS v,
                    item_id AS t
                FROM ext_inventory_depot_detailed
                ORDER BY t ASC
            "
        ));

        $config->create(array(
            'fieldName' => "id",
            'caption' => 'Инвентарный номер',
            'filterType' => 'string',
            'filterUse' => 'select',
            'options' => "
                SELECT DISTINCT
                    id AS v,
                    project_inventory_number AS t
                FROM ext_inventory_accounting
                ORDER BY t ASC
            "
        ));

        $config->create([
            'fieldName' => "placing_hash",
            'caption' => 'Название секции',
            'filterType' => 'number',
            'filterUse' => 'select',
            'options' => "
                SELECT DISTINCT 
                    placing AS t,
                    placing_hash AS v   
                FROM ext_inventory_depot_detailed
                UNION ALL
                SELECT DISTINCT 
                    placing AS t,
                    placing_hash AS v   
                FROM ext_inventory_accounting
                ORDER BY t ASC
            "
        ]);

        $config->create(array(
            'caption' => 'Дата назначения',
            'fieldName' => 'assign_date',
            'filterUse' => 'date',
            'options' => array()
        ));

        if (!$filter->getIsActive()) {
            $config->create(array(
                'caption' => 'Дата списания',
                'fieldName' => 'deactivation_date',
                'filterUse' => 'date',
                'options' => array()
            ));
        }

        $serviceProject = new App_Project_ServiceProject();
        $sql = array(
            "WHEN " . $serviceProject->getId() . " THEN '" . $serviceProject->getTitle(). "'",
        );

        foreach ($projectsList as $project) {
            $sql[] = "WHEN " . $project['v'] . " THEN '" . $project['t'] . "'";
        }

        $config->create(array(
            'fieldName' => "assigned_project_id",
            'caption' => 'Числится(Проект)',
            'filterType' => 'number',
            'filterUse' => 'select',
            'options' => "
                SELECT 
                    0 AS v,
                    'Не выбрано' AS t
                UNION ALL
                SELECT *
                FROM (
                    SELECT  
                        ext_inventory_user.project_id AS v,
                        CASE ext_inventory_user.project_id
                            " . implode(" \n ", $sql) . "
                        END AS t
                    FROM ext_inventory_user
                    INNER JOIN ext_inventory_accounting
                    ON
                        ext_inventory_accounting.assigned_user_id = ext_inventory_user.id
                    ORDER BY ext_inventory_user.project_id
                ) AS ordered_table
            "
        ));

        $config->create(array(
            'fieldName' => "assigned_user_id",
            'caption' => 'Числится(ФИО)',
            'filterType' => 'string',
            'filterUse' => 'inselect',
            'condition' => 'findInSelect',
            'options' => "                
                SELECT 
                    0 AS v,
                    'Не выбрано' AS t
                UNION ALL
                SELECT *
                FROM (
                    SELECT
                        GROUP_CONCAT(ext_inventory_user.id) AS v,
                        ext_inventory_user.name AS t
                    FROM ext_inventory_user
                    INNER JOIN ext_inventory_accounting
                    ON
                        ext_inventory_accounting.assigned_user_id = ext_inventory_user.id
                    GROUP BY ext_inventory_user.name ASC
                ) AS ordered_table
            "
        ));

        $config->create(array(
            'fieldName' => "assigned_orgstructure_id",
            'caption' => 'Числится(Отдел)',
            'filterType' => 'string',
            'filterUse' => 'inselect',
            'condition' => 'findInSelect',
            'options' => "                
                SELECT 
                    0 AS v,
                    'Не выбрано' AS t
                UNION ALL
                SELECT *
                FROM (
                    SELECT 
                        GROUP_CONCAT(ext_inventory_user.ext_inventory_orgstructure_id) AS v,
                        ext_inventory_orgstructure.title AS t
                    FROM 
                        ext_inventory_orgstructure
                    INNER JOIN ext_inventory_user
                    ON
                        ext_inventory_orgstructure.id = ext_inventory_user.ext_inventory_orgstructure_id
                    INNER JOIN ext_inventory_accounting
                    ON
                        ext_inventory_user.id = ext_inventory_accounting.assigned_user_id
                    GROUP BY ext_inventory_orgstructure.title ASC
                ) AS ordered_table
            "
        ));

        $config->create(array(
            'fieldName' => "previous_assigned_project_id",
            'caption' => 'Предыдущий проект',
            'filterType' => 'number',
            'filterUse' => 'select',
            'options' => array_merge(
                array(
                    array(
                        'v' => 0,
                        't' => 'Не выбрано'
                    ),
                    array(
                        'v' => $serviceProject->getId(),
                        't' => $serviceProject->getTitle()
                    )
                ),
                $projectsList
            )
        ));

        $config->create(array(
            'fieldName' => "previous_assigned_user_id",
            'caption' => 'Предыдущий владелец',
            'filterType' => 'string',
            'filterUse' => 'inselect',
            'condition' => 'findInSelect',
            'options' => "
                SELECT 
                    0 AS v,
                    'Не выбрано' AS t
                UNION ALL
                SELECT *
                FROM (
                    SELECT DISTINCT
                        GROUP_CONCAT(ext_inventory_user.id) AS v,
                        ext_inventory_user.name AS t
                    FROM ext_inventory_user
                    INNER JOIN ext_inventory_accounting
                    ON
                        ext_inventory_user.id = ext_inventory_accounting.previous_assigned_user_id
                    GROUP BY ext_inventory_user.name ASC
                ) AS ordered_table
            "
        ));

        if (App_Access::get('key', 'inventory>comment') > 0) {
            $config->create(array(
                'fieldName' => "comment_hash",
                'caption' => 'Комментарий',
                'filterType' => 'string',
                'filterUse' => 'select',
                'options' => "
                    SELECT DISTINCT
                        comment_hash AS v,
                        comment AS t
                    FROM " . DB_EXT_INVENTORY_ACCOUNTING
            ));
        }

        $groups = array(
            array(
                'v' => 0,
                't' => 'Нет группы'
            )
        );
        $groupsRows = App_Db_ExtInventoryAccountingGroup::obtain()->getRows();
        foreach ($groupsRows as $groupRow) {
            $groups[] = array(
                'v' => $groupRow['id'],
                't' => $groupRow['name']
            );
        }

        $config->create(array(
            'fieldName' => "group_id",
            'caption' => 'Группа',
            'filterType' => 'number',
            'filterUse' => 'select',
            'options' => $groups
        ));


        $descriptions = App_Db::get()->query("
            SELECT DISTINCT
                eid2f.id AS v,
                eid2f.text AS t
            FROM " . DB_EXT_INVENTORY_DEPOT_2_FIELDS . " AS eid2f
                INNER JOIN " . DB_EXT_INVENTORY_DEPOT_2 . " AS eid2
                    ON eid2f.fieldId = 13 AND eid2.field13 = eid2f.id
                ORDER BY t ASC
        ")->fetchAll(Zend_db::FETCH_ASSOC);
        $descriptionsConfig = array();
        foreach ($descriptions as $description) {
            $descriptionsConfig[] = array(
                'v' => $description['v'],
                't' => strip_tags($description['t'])
            );
        }

        $config->create(array(
            'fieldName' => "description_id",
            'caption' => 'Примечание',
            'filterType' => 'number',
            'options' => $descriptionsConfig
        ));

        $projectIds = array_filter(
            App_Project_Config_Main::getInstance()->getAllProjectsIds(),
            function ($element) {
                return $element !== (int) App_Project_Config_Main::getInstance()->getProjectId('inventory');
            }
        );

        $field3StrProjects = array();
        $field5StrProjects = array();
        foreach ($projectIds as $projectId) {
            if (App_Project_Config_Pool::getInstance()->get($projectId)->depot->field3->type === 'string') {
                $field3StrProjects[] = $projectId;
            }

            if (App_Project_Config_Pool::getInstance()->get($projectId)->depot->field5->type === 'string') {
                $field5StrProjects[] = $projectId;
            }
        }

        $config->create(array(
            'fieldName' => "field1_mask",
            'caption' => 'Наименование',
            'filterType' => 'string',
            'filterUse' => 'inselect',
            'condition' => 'findInSelect',
            'options' => "
                SELECT
                    GROUP_CONCAT(DISTINCT eid2.project_id,':',eid2.field1) AS v,
                    eid2f.text AS t
                FROM
                    ext_inventory_depot_2 AS eid2
                    INNER JOIN `ext_inventory_depot_detailed` AS eia
                    ON eia.project_id = eid2.project_id AND
                        eia.item_id = eid2.id
                    INNER JOIN `ext_inventory_depot_2_fields` AS eid2f
                    ON eid2.`field1` = eid2f.`id` AND
                        eid2f.`project_id` = eid2.`project_id` AND
                        eid2f.`fieldId` = 1
                GROUP BY eid2f.text
            "
        ));

        // конфиг поля 3
        $config->create(array(
            'fieldName' => "field3_mask",
            'caption' => 'Поле3',
            'filterType' => 'string',
            'filterUse' => 'inselect',
            'condition' => 'findInSelect',
            'options' => "
                SELECT
                    GROUP_CONCAT(DISTINCT eid2.project_id,':',eid2.field3) AS v,
                    eid2f.text AS t
                FROM ext_inventory_depot_2 AS eid2
                    INNER JOIN `ext_inventory_depot_detailed` AS eia
                    ON eia.project_id = eid2.project_id AND
                        eia.item_id = eid2.id
                    INNER JOIN `ext_inventory_depot_2_fields` AS eid2f
                    ON eid2.`field3` = eid2f.`id` AND
                        eid2f.`project_id` = eid2.`project_id` AND
                        eid2f.`fieldId` = 3
                WHERE eid2.project_id IN (" . implode(',', $field3StrProjects) . ") AND
                    eia.project_id IN (" . implode(',', $field3StrProjects) . ") AND
                    eid2f.project_id IN (" . implode(',', $field3StrProjects) . ")
                GROUP BY eid2f.text                
            "
        ));

        // конфиг поля 5
        $config->create(array(
            'fieldName' => "field5_mask",
            'caption' => 'Поле5',
            'filterType' => 'string',
            'filterUse' => 'inselect',
            'condition' => 'findInSelect',
            'options' => "
                SELECT
                    GROUP_CONCAT(DISTINCT eid2.project_id,':',eid2.field5) AS v,
                    eid2f.text AS t
                FROM
                    ext_inventory_depot_2 AS eid2
                    INNER JOIN `ext_inventory_depot_detailed` AS eia
                    ON eia.project_id = eid2.project_id AND
                        eia.item_id = eid2.id
                    INNER JOIN `ext_inventory_depot_2_fields` AS eid2f
                    ON eid2.`field5` = eid2f.`id` AND
                        eid2f.`project_id` = eid2.`project_id` AND
                        eid2f.`fieldId` = 5
                WHERE eid2.project_id IN (" . implode(',', $field5StrProjects) . ") AND
                    eia.project_id IN (" . implode(',', $field5StrProjects) . ") AND
                    eid2f.project_id IN (" . implode(',', $field5StrProjects) . ")
                GROUP BY eid2f.text             
            "
        ));

        if (!$filter->getIsActive()) {
            $config->create(array(
                'fieldName' => "auto_deactivation_comment_hash",
                'caption' => 'Комментарий авто списания',
                'filterType' => 'string',
                'options' => "
                    SELECT DISTINCT
                        auto_deactivation_comment AS t,
                        auto_deactivation_comment_hash AS v
                    FROM
                        `ext_inventory_depot_detailed`     
                    ORDER BY v
                "
            ));

            $config->create(array(
                'fieldName' => "deactivation_comment_hash",
                'caption' => 'Комментарий списания',
                'filterType' => 'string',
                'options' => "
                    SELECT DISTINCT
                        deactivation_comment AS t,
                        deactivation_comment_hash AS v
                    FROM
                        `ext_inventory_accounting`     
                    ORDER BY v
                "
            ));


            $config->create(array(
                'fieldName' => "deactivation_user_id",
                'caption' => 'Автор списания',
                'filterType' => 'string',
                'filterUse' => 'inselect',
                'condition' => 'findInSelect',
                'options' => "
                SELECT DISTINCT
                    deactivation_user AS v,
                    u.name AS t
                FROM " . DB_EXT_INVENTORY_ACCOUNTING . " eia
                JOIN users u ON u.id = eia.deactivation_user
                "
            ));
        }

        $config->create(array(
            'fieldName' => "in_repair",
            'caption' => 'В ремонте',
            'filterType' => 'number',
            'options' => [
                ['v' => 0, 't' => 'Нет'],
                ['v' => 1, 't' => 'Да']
            ]
        ));
    }

    /**
     * Карта полей для excel-конвертера
     * @param App_Filter_Excel_Converter $excelConverter
     */
    abstract public function setUpExcelMap(FilterConverter $excelConverter);

    /**
     * Excel header
     * @param App_Filter_Excel_Converter $converter
     */
    protected function _filterExcelHeaderDecorator(FilterConverter $converter)
    {
        if (Zend_Auth::getInstance()->hasIdentity()) {
            $userName = Zend_Auth::getInstance()->getIdentity()->name;
        } else{
            $userName = "<Неизвестно, кто создал данный файл>";
        }

        $title = "Внешний модуль учёта";
        $generationDate = new Zend_Date();
        $generationDateString = $generationDate->toString(App_Db::ZEND_DATETIME_RU_FORMAT);
        $description = "Сгенерировано пользователем ".$userName.", дата генерации: ".$generationDateString;

        $headerDecorator = new HeaderDecorator($converter);
        $headerDecorator->setTitle($title);
        $headerDecorator->setDescription($description);
        $headerDecorator->apply();
    }

    /**
     * @param App_Filter_Excel_Converter $excelConverter
     */
    protected function _filerExcelAlbumPageDecorator(FilterConverter $excelConverter)
    {
        $albumPageSetupDecorator = new AlbumPageSetupDecorator($excelConverter);
        $albumPageSetupDecorator->apply();
    }

    /**
     * @param App_Filter_Excel_Converter $excelConverter
     */
    protected function _filterExcelHorizontalScaleDecorator(FilterConverter $excelConverter)
    {
        $horizontalScaleDecorator = new HorizontalScaleDecorator($excelConverter);
        $horizontalScaleDecorator->apply();
    }

    /**
     * получение списка проектов
     * @return array
     */
    protected function _getProjectList()
    {
        $avaliableProjects = explode(',', App_Access::get('key', 'inventory>projects'));
        $projectsList = array();
        foreach (App_Project_Repository::getInstance()->getProjects() as $project) {
            /* @var $project App_Project_Model */
            if ($project->getId() == App_Project_Config_Main::getCurrentProjectId()
                || $project->getId() > 0 && !in_array($project->getId(), $avaliableProjects)
            ) {
                continue;
            }

            $projectsList[] = array('v' => $project->getId(), 't' => $project->getTitle());
        }

        return $projectsList;
    }
}
