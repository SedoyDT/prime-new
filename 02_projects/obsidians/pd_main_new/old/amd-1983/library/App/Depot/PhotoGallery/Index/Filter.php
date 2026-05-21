<?php
/**
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author Frolov Anatoliyfrolov_anatoliy@amd-co.ru>
 * @date 09.12.2024
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution
 */

namespace App\Depot\PhotoGallery\Index;

use App\Depot\Filter\DepotMaskFactory;
use App\Depot\PhotoGallery\FilterResult;
use App\Development\TypeScript\Mask\MaskInterface;
use App\Development\TypeScript\Mask\NumberMask;
use App_Access;
use App_Config;
use App_Db;
use App_Db_DepotDetailed;
use App_Db_DepotList;
use App_Depot_Filter_Products_Configurator_Abstract;
use App_Depot_Handlers_Wrapper;
use App_Filter_SubFilters_DepotList_RequestHandler as DepotListSubFilter;
use Zend_Db;

/**
 *  Фильтр модуля: Фотогалерея
 */
class Filter extends \App\Development\TypeScript\AbstractFilter
{
    const WHERE = 'WHERE';

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
     * @var int|null
     */
    private $showSale;

    /**
     * @var array|null
     */
    private $depots;

    public function init($params = null): \App\Development\TypeScript\AbstractFilter
    {
        $this->setFilterResult(new FilterResult());
        $depotIds = $this->getDepotListSubFilter()->getDepotListSubFilter();

        if (App_Access::get('access', 'depot>access>baseprice')) {
            $this->addMask(
                (new NumberMask())
                    ->setName('cur_price')
                    ->setCaption('Текущая БЦ')
                    ->setTarget([MaskInterface::TARGET_WHERE => 'bpc.out_current_price'])
                    ->setFilterUse('combo')
                    ->setOptions("
                        SELECT DISTINCT
                            bpc.out_current_price AS v,
                            bpc.out_current_price AS t
                        FROM base_price_current AS bpc
                        WHERE
                            bpc.out_current_price > 0 AND
                            bpc.depot_id = 2
                        ORDER BY t
                    ")
            );
        }

        // Поля склада
        $depotMaskFactory = new DepotMaskFactory();
        for ($i = 1; $i <= 9; $i++) {
            // Параметры поля
            if (($depotFieldMask = $depotMaskFactory->create("field{$i}"))) {
                $this->addMask($depotFieldMask);
            }
        }

        // Только заблокированные заявки
        $this->addMask(
            (new NumberMask())
                ->setName('onlyBlocked')
                ->setTarget([MaskInterface::TARGET_WHERE => 'ddp.item_id'])
        );

        $this->addMask(
            (new NumberMask())
                ->setName('showSale')
                ->setTarget([MaskInterface::TARGET_WHERE => 'bpc.out_sale_price'])
        );

        // Поиск по
        $this->addMask(
            (new NumberMask())
                ->setName('amountWeight')
                ->setTarget([MaskInterface::TARGET_WHERE => 'd2.amountWeight'])
        );

        // Поиск по id товара
        $this->addMask(
            (new NumberMask())
                ->setName('searchId')
                ->setTarget([MaskInterface::TARGET_WHERE => 'ddp.item_id'])
        );

        // Показать не пустые кол-во > 0
        $this->addMask(
            (new NumberMask())
                ->setName('notEmpty')
                ->setTarget([MaskInterface::TARGET_WHERE => 'd2.amountWeight'])
        );

        for ($i = 1; $i <= 9; $i++) {
            // Параметры поля
            if (($depotFieldMask = $depotMaskFactory->create("field{$i}", [self::WHERE]))) {
                $this->addMask($depotFieldMask);
            }
        }

        return parent::init($params);
    }

    public function getDepotListSubFilter()
    {
        return DepotListSubFilter::getInstance()->setProperties(['depotListSubFilter' => $this->getDepots()]);
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
            'MainDepot', $this->getDepots()
        );

        $sql = "
            SELECT SQL_CALC_FOUND_ROWS
                d2.*,
                ddp.claim_id AS claimId,
                ROUND(d2.block, 0) AS block_amount,
                ddp.filename,
                d2.id
            FROM depot_detailed_photo AS ddp
            INNER JOIN
            (
                SELECT
                    {DEPOT_CONFIG_FIELDS},
                    d2d.annotation_in AS annotationIn,
                    d2d.product_type,
                    d2iw.value AS item_weight
                FROM     " .
                App_Depot_Handlers_Wrapper::getInstance()->getDepotAndDepot2DataQuery(
                    DepotListSubFilter::getInstance()->getDepotListSubFilter()
                ) . "
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
     * @param string|null $showSale
     * @return \App\Depot\PhotoGallery\Index\Filter
     */
    public function setShowSale(?int $showSale): Filter
    {
        $this->showSale = $showSale;
        return $this;
    }

    /**
     * @param array|null $depots
     * @return Filter
     */
    public function setDepots(?array $depots): Filter
    {
        $this->depots = $depots;
        return $this;
    }

    /**
     * @return array|null
     */
    public function getDepots(): ?array
    {
        return $this->depots;
    }
}
