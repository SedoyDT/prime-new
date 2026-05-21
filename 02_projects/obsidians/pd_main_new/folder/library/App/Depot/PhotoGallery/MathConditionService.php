<?php
/**
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author Frolov Anatoliyfrolov_anatoliy@amd-co.ru>
 * @date 12.12.2024
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution
 */


namespace App\Depot\PhotoGallery;


class MathConditionService
{
    protected $aliasedTypes = [
        'equals' => '=',
        'notEqual' => '≠',
        'lessThan' => '<',
        'lessThanOrEqual' => '<=',
        'greaterThan' => '>',
        'greaterThanOrEqual' => '>=',
    ];

    /**
     * Метод получения всего списка условий c алиасами
     * @return array|string[]
     */
    public function getAliasedTypes(): array
    {
        return $this->aliasedTypes;
    }

    /**
     * Метод передачи формирующий математические условия для фронта
     * @return array
     */
    public function getAmdSelectList(): array
    {
        $data = [];
        foreach ($this->getAliasedTypes() as $key => $type) {
            $data[] = [
                'value' => $key,
                'text' => $type
            ];
        }

        return $data;
    }

}