<?php
/**
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author Frolov Anatoliyfrolov_anatoliy@amd-co.ru>
 * @date 09.12.2024
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution
 */


namespace App\Depot\PhotoGallery\Index;

use App\Development\TypeScript\Mask\ExpressionMask;
use App\Development\TypeScript\Mask\MaskInterface;
use App\Development\TypeScript\Mask\NumberMask;
use App\Development\TypeScript\Mask\StringMask;
use App_Config;
use App_Config_Depot;
use App_Constant_Depot_ItemTypes;
use App\Depot\PhotoGallery\Index\Filter as Filter;
use App_Db;
use PHPExcel_Worksheet;
use stdClass;
use Zend_Db;

class FilterConfigurator extends \App\Development\TypeScript\FilterConfigurator\DefaultFilterConfigurator
{

    public function preSetUp()
    {
        $this->setTitle('');
        $this->setFileName(' ' . date('d.m.Y') . '.xlsx');
    }

    /**
     * Метод для настройки фильтра
     */
    public function setUpFilter(Filter $filter)
    {

        // Только заблокированные заявки
        $filter->addMask([
            'type' => NumberMask::class,
            'name' => 'onlyBlocked',
            'target' => [MaskInterface::TARGET_WHERE => 'ddp.item_id'],
        ]);

        // Показать не пустые кол-во > 0
        $filter->addMask([
            'type' => NumberMask::class,
            'name' => 'notEmpty',
            'target' => [MaskInterface::TARGET_WHERE => 'd2.amountWeight'],
        ]);

        // Только заблокированные заявки
        $filter->addMask([
            'type' => NumberMask::class,
            'name' => 'searchId',
            'target' => [MaskInterface::TARGET_WHERE => 'ddp.item_id'],
        ]);

        $filter->addMask([
            'type' => NumberMask::class,
            'name' => 'amountWeight',
            'target' => [MaskInterface::TARGET_WHERE => 'd2.amountWeight'],
        ]);

        $filter->addMask([
            'type' => ExpressionMask::class,
            'name' => 'showSale',
            'expression' =>'bpc.out_sale_price > 0',
            'target' => '',
        ]);

        $configData = App_Config::get('depot');
        $config     = [];

        $idList = App_Db::get()
            ->query('SELECT DISTINCT item_id FROM depot_detailed_photo')
            ->fetchAll(Zend_Db::FETCH_COLUMN)
        ;

        $idList = $idList ? join(',', $idList) : '0';

        for ($i = 1; $i <= 9; $i++) {
            $fieldData = $configData->{'field' . $i};

            $config[] = (object) [
                'caption'    => $fieldData->title,
                'fieldName'  => $fieldData->filterfname,
                'filterType' => $fieldData->filtertype,
                'filterUse'  => $fieldData->filteruse,
                'options'    => App_Config_Depot::getFieldOption($fieldData, $idList),
            ];
        }

        foreach ($config as $item) {
            if (is_string($item->options)) {
//                $item->options = App_Db::get()->query($item->options)->fetchAll(Zend_Db::FETCH_OBJ);
                $filter->addMask([
                    'caption'   => $item->caption,
                    'type'      => StringMask::class,
                    'name'      => $item->fieldName,
                    'filterUse' => $item->filterUse,
                    'options'   => $item->options,
                ]);
            }
        }


//        $filter->addMask([
//            'caption'   => 'ID',
//            'type'      => NumberMask::class,
//            'name'      => 'id',
//            'filterUse' => "select",
//            'options'   => "
//                SELECT
//                    acd.id as v,
//                    acd.id as t
//                FROM
//                    analytics_project_capitalization AS acd
//            "
//        ]);


//        $filter->addMask([
//            'caption'   => 'Год',
//            'type'      => NumberMask::class,
//            'name'      => 'year',
//            'filterUse' => "select",
//            'options'   => "
//                SELECT
//                    acd.year as v,
//                    acd.year as t
//                FROM
//                    analytics_project_capitalization AS acd
//            "
//        ]);
//
//        $filter->addMask([
//            'caption'   => 'Месяц',
//            'type'      => NumberMask::class,
//            'name'      => 'month',
//            'filterUse' => "select",
//            'options'   => "
//                SELECT
//                    acd.month as v,
//                    CASE MONTH(STR_TO_DATE(acd.month, '%m'))
//                        WHEN 1 THEN 'Январь'
//                        WHEN 2 THEN 'Февраль'
//                        WHEN 3 THEN 'Март'
//                        WHEN 4 THEN 'Апрель'
//                        WHEN 5 THEN 'Май'
//                        WHEN 6 THEN 'Июнь'
//                        WHEN 7 THEN 'Июль'
//                        WHEN 8 THEN 'Август'
//                        WHEN 9 THEN 'Сентябрь'
//                        WHEN 10 THEN 'Октябрь'
//                        WHEN 11 THEN 'Ноябрь'
//                        WHEN 12 THEN 'Декабрь'
//                    END AS t
//                FROM
//                    analytics_project_capitalization AS acd
//            ",
//        ]);
//
//        $filter->addMask([
//            'caption'   => 'Прибыль',
//            'type'      => NumberMask::class,
//            'name'      => 'turnover',
//            'filterUse' => "select",
//            'options'   => "
//                SELECT
//                    acd.turnover as v,
//                    acd.turnover as t
//                FROM
//                    analytics_project_capitalization AS acd
//            "
//        ]);
//
//        $filter->addMask([
//            'caption'   => 'Чистая прибыль',
//            'type'      => NumberMask::class,
//            'name'      => 'profit',
//            'filterUse' => "select",
//            'options'   => "
//                SELECT
//                    acd.profit as v,
//                    acd.profit as t
//                FROM
//                    analytics_project_capitalization AS acd
//            "
//        ]);
//
//        $filter->addMask([
//            'caption'   => 'Деньги в проекте (конечная дата)',
//            'type'      => NumberMask::class,
//            'name'      => 'final_project_money',
//            'filterUse' => "select",
//            'options'   => "
//                SELECT
//                    acd.final_project_money as v,
//                    acd.final_project_money as t
//                FROM
//                    analytics_project_capitalization AS acd
//            "
//        ]);
//
////        $filter->addMask([
////            'caption' => 'Деньги в проекте (среднее значение)',
////            'type' => NumberMask::class,
////            'name' => 'type',
////            'filterUse' => "select",
////            'options' => "
////                SELECT
////                    acd.average_project_money as v,
////                    acd.average_project_money as t
////                FROM
////                    analytics_project_capitalization AS acd
////            "
////        ]);
//
//
//        $filter->addMask([
//            'caption'   => 'Докапитализация',
//            'type'      => NumberMask::class,
//            'name'      => 'capitalization_delta',
//            'filterUse' => "select",
//            'options'   => "
//                SELECT
//                    acd.capitalization_delta as v,
//                    acd.capitalization_delta as t
//                FROM
//                    analytics_project_capitalization AS acd
//            "
//        ]);

        return $filter;
    }


    public function setUpMap()
    {
        $excelMap = $this->_excelConverter->getMap();

        $excelMap->create("plain", [
            "field" => "id",
            "title" => "ID",
            "align" => "center",
            "width" => 13
        ]);


    }
}
