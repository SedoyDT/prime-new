<?php


namespace App\Development\TypeScript;


use App\Development\TypeScript\Decorator\OldDecoratorsAdapter;
use App\Development\TypeScript\FilterResult\TotalsContainInterface;
use App\Development\TypeScript\Mask\AbstractMask;
use App\Development\TypeScript\Mask\MaskCollection;
use App\Development\TypeScript\Mask\MaskConfig;
use App\Development\TypeScript\Mask\MaskInterface;
use App\Development\TypeScript\Mask\Options\Decorators\QueryCallableDecorator;
use App_Db;
use App_Db_Abstract;
use App_Filter_Component_Decorator_Type_AbstractType_Decorator as OldAbstractDecorator;
use Exception;
use Generator;
use Zend_Db;
use Zend_Db_Adapter_Abstract;

/**
 * Class AbstractFilter
 * @package App\Development\TypeScript
 */
abstract class AbstractFilter implements FilterInterface
{
    /**
     * @var array
     */
    private $configConditions;

    /**
     * @var OldDecoratorsAdapter
     */
    protected $_oldDecoratorsAdapter;

    /**
     * Параметры сортировки
     * @example
     * field[]
     * [[field => name, sort => direction]]
     * @var array
     */
    protected $_order = [];

    /**
     * Начальная строка
     * @var int
     */
    protected $_startRow = 0;

    /**
     * Количество запрашиваемых строк
     * @var int
     */
    protected $_rowCount = 50;

    /**
     * @var App_Db_Abstract|Zend_Db_Adapter_Abstract
     */
    protected $_db;

    /**
     * Данные масок
     * @var array
     */
    protected $_maskData;

    /**
     * Колекция массок
     * @var MaskCollection
     */
    protected $_masks;

    /**
     * Условия WHERE, по разным именам
     * @example
     *         WHERE  => ['a', 'b'],
     *         WHERE2 => ['a', 'c']
     * @var array
     */
    protected $_where = [];

    /**
     * Условия HAVING
     * @var array
     */
    protected $_having = [];

    /**
     * @var FilterResultInterface
     */
    protected $_filterResult;

    /**
     * Возвращать sql
     * @var bool
     */
    protected $_showSql = false;

    /**
     * флаг использования отдельного запроса для маски
     * @var bool
     */
    protected $_useMaskSql = false;

    /**
     * Флаг работы через getResult
     * @var bool
     */
    private $useResultSql = false;


    /**
     * FilterAngular constructor.
     * @param App_Db_Abstract|Zend_Db_Adapter_Abstract $db
     */
    public function __construct(Zend_Db_Adapter_Abstract $db = null)
    {
        $this->_db    = $db ?? App_Db::get();
        $this->_masks = new MaskCollection();
    }

    /**
     * @return App_Db_Abstract|Zend_Db_Adapter_Abstract
     */
    public function getDb()
    {
        return $this->_db;
    }


    /**
     * @return bool
     */
    public function isUseMaskSql(): bool
    {
        return $this->_useMaskSql;
    }


    /**
     * @return bool
     */
    public function isShowSql(): bool
    {
        return $this->_showSql;
    }


    /**
     * @param bool $showSql
     * @return $this
     */
    public function setShowSql(bool $showSql): AbstractFilter
    {
        $this->_showSql = $showSql;
        return $this;
    }


    /**
     * @return FilterResultInterface
     */
    public function getFilterResult(): FilterResultInterface
    {
        if (!$this->_filterResult) {
            $this->_filterResult = new FilterResult();
        }
        return $this->_filterResult;
    }


    /**
     * @param FilterResultInterface $filterResult
     * @return AbstractFilter
     */
    public function setFilterResult(FilterResultInterface $filterResult): AbstractFilter
    {
        $this->_filterResult = $filterResult;
        return $this;
    }


    /**
     * Устанвоить флаг вывода полного запроса в случае ошибки sql
     * @return $this
     */
    public function debugSql()
    {
        setcookie('debugsql', '1');
        return $this;
    }


    /**
     * Получить шаблон запроса данных
     * @use SQL_CALC_FOUND_ROWS
     * @return string
     */
    public abstract function getResultSql(): string;


    /**
     * Возвращает SQL-запрос для подсчета количества строк в результате
     * @return string
     */
    public function getResultCountSqlQuery()
    {
        // return "SELECT FOUND_ROWS()";
        return "SELECT COUNT(*) FROM (" . $this->setRowCount(0)->buildQuery() . ") AS r";
    }


    /**
     * @param OldAbstractDecorator $decorator
     * @param array                $targets
     * @return $this
     * @throws Exception
     */
    public function addOldDecorator(OldAbstractDecorator $decorator, $targets = ['WHERE'])
    {
        $this->_getOldDecoratorsAdapter()->addDecorator($decorator, $targets);

        return $this;
    }


    /**
     * Получить конфиг фильтра
     * @return MaskConfig[]
     */
    public function getConfigFilter()
    {
        $configData = [];

        foreach ($this->getMasks()->getList() as $mask) {
            if ($mask->isEnabled() && $mask->isFilterUse()) {
                $configData[] = $mask->getConfig();
            }
        }

        return $configData;
    }

    /**
     * Получить варианты для конкретного фильтра
     * @param string $name
     * @return array
     */
    public function getFieldOptions(string $name): array
    {
        $mask = $this->getMasks()->get($name);

        if ($mask && ($options = $mask->getOptions())) {
            return $options->getOptions();
        }
        return [];
    }

    /**
     * Получить маски фильтра
     * дублированно на js в ArrayFilterDataSource.loadMask
     * @param string $field
     * @param array  $maskData
     * @return array
     */
    public function getMaskFilter($field, $maskData)
    {
        $masks = array_filter($this->getMasks()->getList(), function ($mask) {
            return $mask->isEnabled() && $mask->isMaskUse();
        });

        return $this->getMasksValues($masks, $maskData);
    }


    /**
     * Получить коллекцию с масками
     * @return MaskCollection
     */
    public function getMasks(): MaskCollection
    {
        return $this->_masks;
    }


    /**
     * Инициализировать фильтр
     * @param mixed $params
     * @return AbstractFilter
     */
    public function init($params = null): AbstractFilter
    {
        return $this;
    }


    /**
     * @param int $limit
     * @return $this
     */
    public function setRowCount($limit)
    {
        $this->_rowCount = $limit;
        return $this;
    }


    /**
     * @param int $page
     * @return $this
     */
    public function setStartRow(int $page)
    {
        $this->_startRow = $page;
        return $this;
    }


    /**
     * @param array|string $order
     * @return $this
     */
    public function setOrder($order)
    {
        $this->_order = [];

        if (!empty($order)) {
            // преобразование в единый формат
            if (is_string($order)) {
                $order = [$order];
            }

            foreach ($order as $part) {
                if (is_array($part)) {
                    $this->_order[] = $part;
                } else {
                    $this->_order[] = ['field' => $part, 'sort' => 'asc'];
                }
            }
        }

        return $this;
    }


    /**
     * @param array $data
     * @return $this
     */
    public function setMaskData($data)
    {
        $this->_maskData = $this->_prepareMaskData($data);

        return $this;
    }

    /**
     * @return array
     */
    public function getMaskData(): array
    {
        return $this->_maskData;
    }


    /**
     * Добавить маску
     * @param array|MaskInterface $maskOrData
     * @return $this
     */
    public function addMask($maskOrData)
    {
        $this->getMasks()->add($this->prepareMask($maskOrData));
        return $this;
    }


    /**
     * Добавить маску в начало
     * @param array|MaskInterface $maskOrData
     * @return $this
     */
    public function unshiftMask($maskOrData): self
    {
        $this->getMasks()->unshift($this->prepareMask($maskOrData));
        return $this;
    }


    /**
     * @param $maskOrData
     * @return MaskInterface|mixed
     */
    private function prepareMask($maskOrData)
    {
        if ($maskOrData instanceof MaskInterface) {
            $mask = $maskOrData;
        } else {
            $maskOrData['db'] = $this->_db;

            $class = $maskOrData['type'];
            $mask  = new $class($maskOrData);
        }

        return $mask;
    }


    /**
     * Получить результат
     * @return FilterResultInterface
     */
    public function getResult(): FilterResultInterface
    {
        $this->useResultSql();

        $result = $this->getFilterResult();

        if ($this->isShowSql()) {
            $result->setSql($this->buildQuery());
        }

        if ($result instanceof TotalsContainInterface) {
            $rows       = $this->getRows();
            $totalData = $this->getTotalData();

            $this->disableUseResultSql();

            return $result
                ->setRows($rows)
                ->setTotals($totalData);
        } else {
            $rows       = $this->getRows();
            $totalCount = $this->getTotalCount();

            $this->disableUseResultSql();

            return $result
                ->setRows($rows)
                ->setTotalCount($totalCount);
        }
    }


    /**
     * Применить данные масок
     * @return void
     */
    public function applyMask()
    {
        $this->_clearHaving();
        $this->_clearWhere();

        if ($this->_oldDecoratorsAdapter) {
            $this->_oldDecoratorsAdapter->onBeforeSqlFormat();
        }

        if (!$this->_maskData) {
            return;
        }

        $data = $this->_maskData;
        foreach ($this->getMasks()->getList() as $mask) {
            if (!$mask->isEnabled()) {
                continue;
            }
            $maskName = $mask->getName();
            if (array_key_exists($maskName, $data)) {
                $value    = $data[$maskName];
                $maskList = $mask->getMask($value);
                foreach ($maskList as $condition) {
                    $this->_appendCondition($condition);
                }
            }
        }
    }


    /**
     * Построить запрос
     * @return string
     */
    public function buildQuery()
    {
        $this->applyMask();

        $query  = $this->getResultSql();
//        echo "<pre>" . print_r($query, true); echo "</pre>"; // // 12.12.2024 14:44  Frolovdump Froldebug
//        exit();
        $where  = $this->getWhereClause();
//        echo "<pre>" . print_r($where, true); echo "</pre>"; // // 12.12.2024 14:44  Frolovdump Froldebug
//        exit();
        $having = $this->getHavingClause();
        $limit  = $this->getLimitClause();
        $order  = $this->getOrderClause();

        foreach ($where as $target => $condition) {
            $query = str_replace("{{$target}}", $condition, $query);
        }

//        echo "<pre>" . print_r($where, true); echo "</pre>"; // // 12.12.2024 14:29  Frolovdump Froldebug
//        exit();

        $sql = $query
            . $having
            . $order
            . $limit;

//        echo "<pre>" . print_r($sql, true); echo "</pre>"; // // 12.12.2024 08:56  Frolovdump Froldebug
//        exit();

        return $query
            . $having
            . $order
            . $limit;
    }


    /**
     * Получить часть по всем значениям $this->_where
     * @return array
     */
    public function getWhereClause()
    {
        return array_map(
            function ($where) {
                return $where ? (' WHERE ' . implode(' AND ', $where)) : '';
            },
            $this->_where
        );
    }


    /**
     * Получить условия для HAVING
     * @return string
     */
    public function getHavingClause()
    {
        if (!$this->_having) {
            return '';
        }

        return ' HAVING ' . implode(' AND ', $this->_having);
    }


    /**
     * Получить ограничения по количеству строк
     * @return string
     */
    public function getLimitClause()
    {
        if (!$this->_rowCount) {
            return '';
        }
        return sprintf(' LIMIT %s, %s', $this->_startRow, (int)$this->_rowCount);
    }


    /**
     * Получить параметры сортировки
     * @return string
     */
    public function getOrderClause()
    {
        if (!$this->_order) {
            return '';
        }

        $order = [];

        foreach ($this->_order as $part) {
            $order[] = $this->_db->quoteIdentifier($part['field']) . ' ' . (strtolower($part['sort']) == 'desc' ? 'DESC' : 'ASC');
        }

        return ' ORDER BY ' . implode(', ', $order);
    }


    /**
     * Получить отфильтрованные строки
     * @param int $fetchMode
     * @return array
     */
    public function getRows($fetchMode = Zend_Db::FETCH_ASSOC)
    {
        $sql = $this->buildQuery();

        if (defined('FILTER_SQL_FORMATTER_DEBUG')) {
            exit("\r\n<pre>\r\n" . __FILE__ . ':' . __LINE__ . "\r\n" . print_r([$sql], true) . "\r\n</pre>\r\n");
        }

        return $this->_db->fetchAll($sql, null, $fetchMode);
    }

    /**
     * Получить строки по очереди, для экономии памяти
     * @return Generator
     * @throws \Zend_Db_Statement_Exception
     */
    protected function getStream(): Generator
    {
        $sql = $this->buildQuery();

        if (defined('FILTER_SQL_FORMATTER_DEBUG')) {
            exit("\r\n<pre>\r\n" . __FILE__ . ':' . __LINE__ . "\r\n" . print_r([$sql], true) . "\r\n</pre>\r\n");
        }

        $result = $this->_db->query($sql);

        while ($row = $result->fetch(Zend_Db::FETCH_ASSOC)) {
            yield $row;
        }
    }

    /**
     * Получить общее количество строк попадающие под условия
     * @return int
     */
    public function getTotalCount(): int
    {
        return (int)$this->_db->fetchOne($this->getResultCountSqlQuery());
    }


    /**
     * Получить суммарные данные (кол-во всего, сумма всего)
     * @return array
     */
    public function getTotalData()
    {
        return $this->_db->fetchRow($this->getResultCountSqlQuery(), [], Zend_Db::FETCH_ASSOC);
    }


    /**
     * Добавить условие для HAVING
     * @param Mask\MaskCondition $condition
     */
    private function _appendHaving(Mask\MaskCondition $condition)
    {
        $this->_having[] = $condition->getCondition();
    }


    /**
     * Добавить условие для WHERE
     * @param Mask\MaskCondition $condition
     */
    private function _appendWhere(Mask\MaskCondition $condition)
    {
        if (!isset($this->_where[$condition->getTarget()])) {
            $this->_where[$condition->getTarget()] = [];
        }
        $this->_where[$condition->getTarget()][] = $condition->getCondition();
    }


    /**
     * Очистить условия HAVING
     * @return void
     */
    protected function _clearHaving()
    {
        $this->_having = [];
    }


    /**
     * Очистить условия WHERE
     * для каждой цели(target) создается пустой массив, для замены в шаблоне запроса
     * @return void
     */
    protected function _clearWhere()
    {
        $list = array_unique(
            array_reduce(
                array_map(
                    function ($mask) {
                        return array_keys($mask->getTarget());
                    },
                    $this->getMasks()->getList()
                ),
                'array_merge',
                []
            )
        );


        $this->_where = array_fill_keys(array_map('strtoupper', $list), []);
    }


    /**
     * Добавить условие запроса
     * @param Mask\MaskCondition $condition
     */
    protected function _appendCondition(Mask\MaskCondition $condition)
    {
        if ($condition->getTarget() == AbstractMask::TARGET_HAVING) {
            $this->_appendHaving($condition);
        } else {
            $this->_appendWhere($condition);
        }
    }


    /**
     * Подготовить данные маски
     * @param array $data
     * @return array
     */
    protected function _prepareMaskData($data)
    {
        return $data;
    }


    /**
     * @return OldDecoratorsAdapter
     */
    protected function _getOldDecoratorsAdapter()
    {
        if (!$this->_oldDecoratorsAdapter) {
            $this->_oldDecoratorsAdapter = new OldDecoratorsAdapter(
                function (Mask\MaskCondition $condition) {
                    $this->_appendCondition($condition);
                }
            );
        }

        return $this->_oldDecoratorsAdapter;
    }


    /**
     * включение использования отдельного запроса для данных маски
     * @return AbstractFilter
     */
    public function useMaskSql()
    {
        $this->_useMaskSql = true;
        return $this;
    }

    /**
     * выключение использования отдельного запроса для данных маски
     * @return $this
     */
    public function disableMaskSql()
    {
        $this->_useMaskSql = false;
        return $this;
    }


    /**
     * @return bool
     */
    protected function isUseResultSql(): bool
    {
        return $this->useResultSql;
    }


    /**
     * Установить флаг работы из метода getResult
     * @return \App\Development\TypeScript\AbstractFilter
     */
    private function useResultSql(): AbstractFilter
    {
        $this->useResultSql = true;
        return $this;
    }


    /**
     * Отключить флаг работы из метода getResult
     * @return $this
     */
    private function disableUseResultSql(): AbstractFilter
    {
        $this->useResultSql = false;
        return $this;
    }

    /**
     * @return int
     */
    public function getStartRow(): int
    {
        return $this->_startRow;
    }

    /**
     * @return int
     */
    public function getRowCount(): int
    {
        return $this->_rowCount;
    }

    /**
     * Получить декоратор запроса конфига по умолчанию
     * Будут применены доп.маски, и декораторы основного запроса
     * @return QueryCallableDecorator
     */
    protected function getOptionsQueryDecorator(): QueryCallableDecorator
    {
        // можно использовать один на всех
        return new QueryCallableDecorator(function ($baseSql) {
            [$where, $having] = $this->getConfigConditions();
            foreach ($where as $target => $condition) {
                $baseSql = str_replace("{{$target}}", $condition, $baseSql);
            }
            return $baseSql . $having;
        });
    }

    /**
     * Получить условия для запроса конфига
     * @return array
     */
    private function getConfigConditions(): array
    {
        if (!$this->configConditions) {
            $this->setMaskData([])->applyMask();
            $this->configConditions = [
                $this->getWhereClause(),
                $this->getHavingClause(),
            ];
        }

        return $this->configConditions;
    }

    /**
     * Заполнить маски
     * @param MaskInterface[] $masks
     * @param Generator     $data
     * @param array          $result
     * @return void
     */
    private function getMaskValues(array $masks, Generator $data, array &$result)
    {
        foreach ($data as $row) {
            foreach ($masks as $mask) {
                if (!array_key_exists($mask->getFieldName(), $row)) {
                    continue;
                }
                // если значения извлекаются из сгруппированного поля
                if (($splitParams = $mask->getSplit())) {
                    $splitField     = $splitParams[0];
                    $splitSeparator = $splitParams[1];

                    $variants = ($row[$splitField] ? explode($splitSeparator, $row[$splitField]) : []);
                    foreach ($variants as $variant) {
                        $result[$mask->getName()][$variant] = null;
                    }
                    if ($mask->isNullable() && is_null($row[$splitField])) {
                        $result[$mask->getName()][$mask->getNullableValue()] = null;
                    }
                } else {
                    $value = $row[$mask->getFieldName()];
                    if ($mask->isNullable() && is_null($value)) {
                        $value = $mask->getNullableValue();
                    }
                    $result[$mask->getName()][$value] = null;
                }
            }
        }
    }

    /**
     * @param MaskInterface[] $masks
     * @param array|null $maskData
     * @return array[]
     * @throws \Zend_Db_Statement_Exception
     */
    protected function getMasksValues(array $masks, ?array $maskData): array
    {
        $this->useMaskSql();

        $this->_rowCount = 0;
        $this->_order    = [];

        $maskData = array_filter($maskData ?? []);

        $result = array_fill_keys(
            array_map(function ($mask) {
                return $mask->getName();
            }, $masks),
            []
        );

        /** Маски без фильтрации */
        $commonQueryMasks = array_filter($masks, function ($mask) use ($maskData) {
            return !isset($maskData[$mask->getName()]);
        });

        if ($commonQueryMasks) {
            $fullData = $this->setMaskData($maskData)->getStream();
            $this->getMaskValues($commonQueryMasks, $fullData, $result);
            unset($fullData);
        }

        /** Маски с фильтрацией */
        $individualQueryMasks = array_filter($masks, function ($mask) use ($maskData) {
            return isset($maskData[$mask->getName()]);
        });

        if ($individualQueryMasks) {
            foreach ($individualQueryMasks as $mask) {
                $rows = $this->setMaskData(array_diff_key($maskData, [$mask->getName() => 1]))
                    ->getStream();

                $this->getMaskValues([$mask], $rows, $result);
                unset($rows);
            }
        }
        return array_map(function($maskOptions){
            return array_map('strval', array_keys($maskOptions));
        }, $result);
    }

    public function getWhere(): array
    {
        return $this->_where;
    }
}
