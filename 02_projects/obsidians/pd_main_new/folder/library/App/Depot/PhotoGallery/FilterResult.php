<?php
/**
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author Frolov Anatoliyfrolov_anatoliy@amd-co.ru>
 * @date 13.12.2024
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution
 */

/**
 * результат фильтра
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author Frolov Anatoliyfrolov_anatoliy@amd-co.ru>
 * @date 18.09.2024
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution
 */

namespace App\Depot\PhotoGallery;

use App\Development\TypeScript\FilterResultInterface;
use App_Db_Depot2ItemWeight;

class FilterResult extends \App\Development\TypeScript\FilterResult
{
    public function setRows(array $rows): FilterResultInterface
    {

// TODO
//        if (!empty($rows)) {
//            foreach ($rows as & $row) {
//                $row['filename'] = join(DIRECTORY_SEPARATOR, ['/uploads/claim/detailed/', $row['claim_id'],  $row['item_id'], $row['filename']]);
//
//                if (!file_exists($row['filename'])) {
//                    $row['filename'] = '';
//                }
//            }
//        }

        return parent::setRows($rows);
    }
}
