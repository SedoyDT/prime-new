<?php
/**
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author    Zakharov.A
 * @date      16.03.2022
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution
 */

namespace App\SalesFunnel\QualityControl\Services;

use App\DataSource\AmdSelectRow;
use App\DataSource\AmdSelectRowGroup;
use App_Access;
use App_Db;
use Zend_Db;
use Zend_Db_Statement_Exception;

/**
 * Сервис для получения данных для страницы отдела контроля качества
 * Class FormDataSourceService
 * @package App\SalesFunnel\QualityControl\Services
 */
class FormDataSourceService
{
    /**
     * @var \App\SalesFunnel\Resource\Stage
     */
    protected $stageResource;
    /**
     * @var \App\SalesFunnel\Stage\Services\Factory
     */
    protected $stageFactory;

    public function __construct(
        \App\SalesFunnel\Resource\Stage $stageResource,
        \App\SalesFunnel\Stage\Services\Factory $stageFactory
    ) {

        $this->stageResource = $stageResource;
        $this->stageFactory = $stageFactory;
    }


    /**
     * Получить список пользователей
     * @return array
     */
    public function getUsers(): array
    {
        if (($users = $this->getUserRows())) {
            $departmentIds = array_unique(array_column($users, 'department_id'));
            $departments   = $this->getDb()->fetchPairs(
                $this->getDb()->quoteInto(
                    '
                    SELECT
                        id,
                        title
                    FROM orgstructure
                    WHERE
                        id IN (?)
                    ',
                    [$departmentIds]
                )
            );

            $groups = array_fill_keys($departmentIds, []);

            foreach ($users as $row) {
                $groups[$row['department_id']][] = $row;
            }

            $result = [];
            foreach ($departments as $id => $title) {
                $group = new AmdSelectRowGroup($title);
                foreach ($groups[$id] as $user) {
                    $group->addChild(new AmdSelectRow($user['id'], $user['name']));
                }
                $result[] = $group;
            }
            return $result;
        }
        return [];
    }

    /**
     * Получить список этапов по воронкам
     * @return array[][]
     */
    public function getStages(): array
    {
        $stages = [];

        $stageCollection = $this->stageFactory->collectionFromEntityArray(
            \App\SalesFunnel\Stage\Repository::find()->all()
        );

        /** @var \App\SalesFunnel\Stage\Model $item */
        foreach ($stageCollection as $item) {
            if (!isset($stages[$item->getEntity()->getFunnelId()])) {
                $stages[$item->getEntity()->getFunnelId()] = [];
            }

            $stageResource = $this->stageResource->generate($item);
            $stageResource['value'] = (string) $stageResource['id'];
            $stageResource['text'] = (string) $stageResource['title'];
            $stages[$item->getEntity()->getFunnelId()][] = $stageResource;
        }

        return $stages;
    }

    /**
     * Получить список воронок
     * @return array
     */
    public function getFunnels(): array
    {
        return $this->convertPairsToDataSource($this->getFunnelPairs());
    }

    /**
     * Получить список этапов по воронке
     * @param int $funnelId
     * @return array
     */
    public function getFunnelStagePairs(int $funnelId): array
    {
        return $this->getDb()->fetchPairs(
            '
                SELECT
                    id,
                    title
                FROM sales_funnel_stage
                WHERE
                    is_closed_without_deal <> 1 AND
                    funnel_id = ?
            ',
            [$funnelId]
        );
    }

    /**
     * Получить список воронок
     * На текущий момент Серега сказал, что показываем все воронки, без ограничений.
     * И в таком случае возможно перевести лид в воронку к которой не имеет доступа менеджер
     * @return array
     */
    public function getFunnelPairs(): array
    {
        return $this->getDb()->fetchPairs(
            '
                SELECT 
                     sf.id,
                     sf.title
                FROM sales_funnel AS sf
                ORDER BY sf.title
            '
        );
    }

    /**
     * Получить список пользователей
     * @return array
     */
    public function getUserPairs(): array
    {
        $rows = $this->getUserRows();

        $result = [];

        foreach ($rows as $row) {
            $result[$row['id']] = $row['name'];
        }

        return $result;
    }

    /**
     * Получить список доступных лидов
     * @return array
     */
    public function getIdPairs(): array
    {
        $db = $this->getDb();

        $userConditions = [];
        if (!App_Access::get('access', 'sales_funnel>quality_control>managers>all')) {
            $m                = App_Access::get('managers', 'sales_funnel>quality_control');
            $userConditions[] = $db->quoteInto('u.id IN (?)', $m['m'] ?: [-1]);
        }

        return $db->fetchPairs(
            '
                SELECT
                    sfl.id,
                    sfl.id
                FROM sales_funnel_lead AS sfl
                JOIN users AS u ON
                    u.id = sfl.user_id
                JOIN sales_funnel_stage AS sfs ON
                    sfs.id = sfl.stage_id
                LEFT JOIN sales_funnel_quality_control_leads AS sfqcl ON
                    sfqcl.lead_id = sfl.id
                WHERE
                    sfs.is_closed_without_deal = 1 AND
                    IFNULL(sfqcl.is_confirmed, 0) = 0
            '
            . ($userConditions ? (' AND ' . implode(' AND ', $userConditions)) : '')
        );
    }

    /**
     * Получить список воронок, для которых необходимо подтверждение при попадании в ОКК
     * @return AmdSelectRow[]
     * @throws Zend_Db_Statement_Exception
     */
    public function getFunnelsWithConfirmNecessary(): array
    {
        $sql = "
            SELECT
                sf.id,
                sf.title,
                IF(sfqccf.id IS NOT NULL, TRUE, FALSE) AS is_confirm
            FROM sales_funnel AS sf
            LEFT JOIN sales_funnel_quality_control_confirm_funnels AS sfqccf ON
                sfqccf.funnel_id = sf.id
        ";

        $funnels = $this->getDb()->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC) ?: [];

        $result = [];
        foreach ($funnels as $funnel) {
            $result[] = new AmdSelectRow(
                $funnel['id'],
                $funnel['title'],
                ['is_confirm' => boolval($funnel['is_confirm'])]
            );
        }

        return $result;
    }


    public function getStagesWithConfirmNecessary(): array
    {
        $sql = "
            SELECT
                sfl.id,
                sfl.title,
                IF(sfqccf.id IS NOT NULL, TRUE, FALSE) AS is_confirm
            FROM sales_funnel_stage AS sfl
            LEFT JOIN sales_funnel_quality_control_confirm_funnels AS sfqccf ON
                sfqccf.funnel_id = sfl.funnel_id;
        ";

        $funnels = $this->getDb()->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC) ?: [];

        $result = [];
        foreach ($funnels as $funnel) {
            $result[] = [
                $funnel['id'],
                $funnel['title']
            ];
        }

        return $result;
    }
    /**
     * Конвертировать пары в формат селекта
     * @param array $pairs
     * @return array
     */
    private function convertPairsToDataSource(array $pairs): array
    {
        $dataSource = [];

        foreach ($pairs as $value => $text) {
            $dataSource[] = ['value' => (string)$value, 'text' => $text];
        }

        return $dataSource;
    }

    /**
     * Получить БД
     * @return \App_Db_Abstract|mixed|\Zend_Db_Adapter_Abstract
     */
    private function getDb()
    {
        return App_Db::get();
    }

    /**
     * Получить список строк пользователей
     * @return array
     */
    private function getUserRows(): array
    {
        $db = $this->getDb();

        $userConditions = [];
        if (!App_Access::get('access', 'sales_funnel>quality_control>managers>all')) {
            $m                = App_Access::get('managers', 'sales_funnel>quality_control');
            $userConditions[] = $db->quoteInto('u.id IN (?)', $m['m'] ?: [-1]);
        }

        return $db->fetchAll(
            '
                SELECT
                    u.id,
                    u.name,
                    ou.oId AS department_id
                FROM users AS u
                JOIN orgstructure_users AS ou ON
                    ou.userId = u.id
                '
            . ($userConditions ? ('WHERE ' . implode(' AND ', $userConditions)) : '')
            . ' ORDER BY u.`name`',
            null,
            Zend_Db::FETCH_ASSOC
        );
    }


    public function getFunnelsToConfirm()
    {
        $db = $this->getDb();

        $sql = "
            SELECT 
                sf.id
            FROM sales_funnel AS sf
            INNER JOIN sales_funnel_quality_control_confirm_funnels AS sfqccf ON
                sfqccf.funnel_id = sf.id
        ";

        return $this->getDb()->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC) ?: [];
    }


    public function getStagesToConfirm()
    {
        $db = $this->getDb();

        $sql = "
            SELECT
                sfs.id,
                sfs.funnel_id
            FROM sales_funnel_stage AS sfs
            INNER JOIN sales_funnel_quality_control_confirm_stages AS sfqccs ON
                sfqccs.stage_id = sfs.id
        ";

        return $this->getDb()->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC) ?: [];
    }
}
