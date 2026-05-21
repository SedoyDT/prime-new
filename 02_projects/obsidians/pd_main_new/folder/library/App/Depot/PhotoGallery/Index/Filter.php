<?php
/**
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author Frolov Anatoliyfrolov_anatoliy@amd-co.ru>
 * @date 09.12.2024
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution
 */

namespace App\Depot\PhotoGallery\Index;

use App\Depot\PhotoGallery\FilterResult;
use App_Filter_SubFilters_DepotList_RequestHandler as DepotListSubFilter;

use App\Development\TypeScript\Mask\ExpressionMask;
use App\Development\TypeScript\Mask\MaskInterface;
use App_Access;
use App_Claim_Factory;
use App_Config_Depot;
use App_Db_DepotDetailed;
use App_Db_DepotList;
use App_Depot_Filter_Products_Configurator_Abstract;
use App_Depot_Handlers_Wrapper;

/**
 *  Фильтр модуля: Потенциальные клиенты
 */
class Filter extends \App\Development\TypeScript\AbstractFilter
{
    /**
     * @var int|null
     */
    private $searchId;

    /**
     * @var int|null
     */
    private $notEmpty;

    /**
     * @var int|null
     */
    private $onlyBlocked;

    /**
     * @var int|null
     */
    private $amountWeight;

    /**
     * @var string|null
     */
    private $amountWeightParam;

    /**
     * @var int|null
     */
    private $showSale;

    public function init($params = null): \App\Development\TypeScript\AbstractFilter
    {
        $this->setFilterResult(new FilterResult());

        return parent::init($params);
    }

    /**
     * @inheritDoc
     * @return string
     */
    public function getResultCountSqlQuery()
    {
        return "SELECT FOUND_ROWS()";
    }

    /**
     * @return int|null
     */
    public function getOnlyBlocked(): ?int
    {
        return $this->onlyBlocked;
    }

    /**
     * @return int|null
     */
    public function getNotEmpty(): ?int
    {
        return $this->notEmpty;
    }

    /**
     * @return int|null
     */
    public function getAmountWeight(): ?int
    {
        return $this->amountWeight;
    }

    public function getAmountWeightParams(): ?string
    {
        return $this->amountWeightParam;
    }

    /**
     * @return int|null
     */
    public function getSearchId(): ?int
    {
        return $this->searchId;
    }

    /**
     * @return int|null
     */
    public function getShowSale(): ?int
    {
        return $this->showSale;
    }

    public function getResultSql(): string
    {
        // Инициализация конфигуратора
        $configurator = App_Depot_Filter_Products_Configurator_Abstract::findConfigurator(
            'MainDepot', [2]
        );

        $sql = "
            SELECT SQL_CALC_FOUND_ROWS
                d2.*,
                ddp.claim_id AS claimId,
                '<div>hello</div>' AS html,
                ROUND(d2.block,0) AS block_amount
            FROM depot_detailed_photo AS ddp
            INNER JOIN
            (
                SELECT
                    {DEPOT_CONFIG_FIELDS},
                    d2d.annotation_in AS annotationIn,
                    d2d.product_type,
                    d2iw.value AS item_weight
                FROM depot_2 AS d
                INNER JOIN depot_2_data AS d2d
                ON
                    d2d.item_id = d.id
                LEFT JOIN depot_2_item_weight AS d2iw
                ON 
                    d2iw.id = d.id
                {DEPOT_CONFIG_TABLE}
            ) AS d2
            ON
                ddp.item_id = d2.id 
            LEFT JOIN base_price_current AS bpc ON
                ddp.item_id = bpc.item_id 
            {WHERE}
        ";

        App_Depot_Handlers_Wrapper::getInstance()->applyDepotConfigFieldsResult(
            $sql, DepotListSubFilter::getInstance()->getDepotListSubFilter()
        );

        return $sql;
    }


    protected function _prepareMaskData($data)
    {
        // Поиск товара по id
        if ($this->getSearchId()) {
            $data['searchId'] = [
                'type' => 'equals',
                'filter' => $this->getSearchId(),
            ];
        }

        // Показать только заблокированные записи
        if ($this->getOnlyBlocked()) {
            // Записи с блокировками
            $blockedValues = App_Db_DepotDetailed::obtain()->getAllBlockedItems(array_keys(App_Db_DepotList::obtain()->getDepots()));

            $data['onlyBlocked'] = [
                'type'   => 'select',
                'filter' => $blockedValues ?: [-1],
            ];

        }

        // Показать не пустые кол-во > 0
        if ($this->getNotEmpty()) {
            $data['notEmpty'] = [
                'type'   => 'greaterThan',
                'filter' => 0,
            ];
        }

        // По кол-ву
        if ($this->getAmountWeight() && $this->getAmountWeightParams()) {
            $data['amountWeight'] = [
                'type'   => $this->getAmountWeightParams(),
                'filter' => $this->getAmountWeight(),
            ];
        }

        // Показать только акции
        if ($this->getShowSale()) {
            $data['showSale'] = [
                'type' => 'greaterThan',
                'filter' => 0,
            ];
        }


        return parent::_prepareMaskData($data);
    }

    public function getConfigFilter()
    {
        return parent::getConfigFilter();
    }

    /**
     * Метод установки фильтра на получение только заблокированных товаров
     * @param int|null $onlyBlocked
     * @return \App\Depot\PhotoGallery\Index\Filter
     */
    public function setOnlyBlocked(?int $onlyBlocked): Filter
    {
        $this->onlyBlocked = $onlyBlocked;
        return $this;
    }

    /**
     * @param bool|null $notEmpty
     * @return \App\Depot\PhotoGallery\Index\Filter
     */
    public function setNotEmpty(?bool $notEmpty): Filter
    {
        $this->notEmpty = $notEmpty;
        return $this;
    }

    /**
     * @param int|null $searchId
     * @return \App\Depot\PhotoGallery\Index\Filter
     */
    public function setSearchId(?int $searchId): Filter
    {
        $this->searchId = $searchId;
        return $this;
    }

    /**
     * @param int|null $amountWeight
     * @return \App\Depot\PhotoGallery\Index\Filter
     */
    public function setAmountWeight(?int $amountWeight): Filter
    {
        $this->amountWeight = $amountWeight;
        return $this;
    }

    /**
     * @param string|null $amountWeightParam
     * @return \App\Depot\PhotoGallery\Index\Filter
     */
    public function setAmountWeightParams(?string $amountWeightParam): Filter
    {
        $this->amountWeightParam = $amountWeightParam;
        return $this;
    }

    /**
     * @param string|null $showSale
     * @return \App\Depot\PhotoGallery\Index\Filter
     */
    public function setShowSale(?int $showSale): Filter
    {
        $this->showSale = $showSale;
        return $this;
    }

}
