<?php

/**
 * Класс для работы с таблицами depot_n
 */
class App_Db_Depot2 extends App_Db_Abstract
{
    const GET_FIELD_STRATEGY_DEFAULT = 1;
    const GET_FIELD_STRATEGY_MANAGER = 2;

    /**
     * Таблица
     * @var string
     */
    protected $table;

    /**
     * Значения таблицы
     * @var string
     */
    protected $tableValues = DB_DEPOT_2_FIELDS;

    /**
     * WHERE
     * @var array
     */
    public $where;

    /**
     * Название таблицы
     * @var string
     */
    protected $_name = 'depot_2';

    /**
     * Первичный ключ таблицы
     * @var string
     */
    protected $_primary = 'id';

    /**
     * ID склада
     * @var int
     */
    protected $_depotId;


    /**
     * Стратегия составления запроса на получение данных товара
     * @var string
     */
    protected $_getFieldStrategy = self::GET_FIELD_STRATEGY_DEFAULT;


    /**
     * Получить объект таблицы
     * @return App_Db_Depot2|App_Db_Abstract
     */
    public static function obtain()
    {
        return App_Db::get(DB_DEPOT_2);
    }


    /**
     * App_Db_Depot2 constructor.
     * @param string $table
     */
    public function __construct($table = 'depot_2')
    {
        $this->_name = $this->table = $table;
        $this->_depotId = (int) str_replace('depot_', '', $this->table);

        parent::__construct();
    }


    /**
     * Возвращает ID склада
     * @return int|mixed
     * @throws Exception
     */
    public function getDepotId()
    {
        if (!is_int($this->_depotId) || !$this->_depotId) {
            throw new \Exception('Не установлен ID склада!');
        }

        return $this->_depotId;
    }


    /**
     * Получение стратегии составления запроса на получение данных товара
     * @return string
     */
    public function getGetFieldStrategy()
    {
        return $this->_getFieldStrategy;
    }


    /**
     * Установка стратегии составления запроса на получение данных товара
     * @param string $getFieldStrategy
     */
    public function setGetFieldStrategy($getFieldStrategy)
    {
        $this->_getFieldStrategy = $getFieldStrategy;
    }


    /*
     *Получение строковых значений
     *по уникальным id из таблицы depot_ID
     *@param String $in
     *@return Object
     */
    public function getStrValues($in, $field = null)
    {
        if (!is_null($in)) {
            // поля свзяи
            $select = $this->_db->select();
            $select->from($this->tableValues, array('id', 'text'))
                    ->where('id IN (' . $in . ')');
            $select->order('text');
            $stmt = $this->_db->query($select);
            $result = $stmt->fetchAll();
        } else {
            print 'IN for str not set!';
            exit;
        }
        return $result;
    }


    /*
     * Получение строкового значения
     * по уникальным id из таблицы depot_ID
     * @param String $in
     * @return Object
     */
    public function getStrValue($in, $fieldId)
    {
        if (!is_null($in) && !is_null($fieldId)) {
            // поля свзяи
            $select = $this->_db->select();
            $select->from($this->tableValues, array('id', 'text'))
                ->where('id = ?', $in)
                ->where('fieldId = ?', $fieldId);
            $select->order('text');
            $stmt = $this->_db->query($select);
            $result = $stmt->fetchAll();
        } else {
            print 'IN for str not set!';
            exit;
        }
        return $result;
    }



    /*
     *Выбор всех уникальных id
     @param String $field
     *@return Array
     */
    public function fetchDistinct($field)
    {
        //$this->_db->setFetchMode(Zend_Db::FETCH_NAMED);

        $select = $this->_db->select();
        $select->distinct()->from($this->table, $field);
        if (isset($this->where)) {
            //Zend_Debug::dump($this->where);
            $str = '';
            foreach ($this->where as $fieldName => $where) {
                //$select->where($field . " IN (" . $where . ")");
                if ($fieldName == $field) {
                    continue;
                }
                //$str .= $fieldName . ' IN (' . $where . ') ';
                $select->where($fieldName . " IN (" . $where . ")");
            }
            //Zend_Debug::dump($str);
        }
        $select->order($field);
        //Zend_Debug::dump($select->__toString());
        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll(Zend_Db::FETCH_COLUMN);

        //Zend_Debug::dump($result);
        return $result;
    }


    /**
     *получение уникальных значений полей типа Int
     *@param String $field
     *@return Array
     */
    public function getIntValues($field)
    {
        //Zend_Debug::dump($this->where);
        $select = $this->_db->select();
        $select->distinct()->from($this->table, array('field' => $field));
        if (isset($this->where)) {
            //Zend_Debug::dump($this->where);
            foreach ($this->where as $fieldName => $where) {
                if ($fieldName == $field) {
                    continue;
                }
                $select->where($fieldName . " IN (" . $where . ")");
            }
        }
        //$select->where($field . ' != ' . NULL);
        //$select->where($field . ' != ""');
        $select->order('field');
        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll();

        //Zend_Debug::dump($result);

        return $result;
    }


    /**
     *получение id записей для выборки
     *@return Array
     */
    public function getSearchIds()
    {
        $select = $this->_db->select();
        $select->from($this->table, 'id');
        if (isset($this->where)) {
            foreach ($this->where as $field => $where) {
                // если есть условие, если нету, то 0
                // if(isset($where) && strlen($where)) {
                    // $where .= ",0";
                // }else {
                    // $where = 0;
                // }
                $select->where($field . " IN (" . $where . ")");
            }
        }
        //$sql = $select->__toString();
        //Zend_Debug::dump($sql);
        // print '<br>';
        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll(Zend_Db::FETCH_COLUMN);

        //Zend_Debug::dump($result);
        return $result;
    }


    /**
     *Получение всех значений с сортировкой по полю field1
     *@return Array
     */
    public function getSearchFields($in, $page = 1, $amountF = null, $blockF = null, $amountKGF = null)
    {
        // Zend_Debug::dump($in);
        // exit;
        $fields = array('a.*','b.text');
        if (!is_null($amountF) && !is_null($blockF)) {
            if (is_null($amountKGF)) {
                // Если не задано поле количество упаковок, для роликов
                $fields[$amountF] = new Zend_Db_Expr($amountF . '-' . $blockF);
            } else {
                // HACK для склада Зюганова, для товаров типа ролики
                /*
                SELECT
                    IF(field15 = 2, field12-field14, field12) AS field12,
                    IF(field15 = 1, field11-field14, field11) AS field11
                FROM `depot_2` WHERE 1
                */
                //Zend_Debug::dump($amountKGF);
                $fields[] = new Zend_Db_Expr("IF(field15 = 2, $amountKGF - $blockF, ROUND(($amountF - $blockF) / field10, 2)) AS $amountKGF");
                $fields[] = new Zend_Db_Expr("IF(field15 = 1, $amountF - $blockF, $amountF - ($blockF * field10)) AS $amountF");

            }
        }
        $select = $this->_db->select();
        $select->from(array('a' => $this->table))
               ->join(array('b' => $this->tableValues), 'a.field1 = b.id', $fields)
               ->where('a.id IN (' . $in . ')')
               ->order('b.text');
        if (Zend_Registry::isRegistered('notMoved') && Zend_Registry::get('notMoved') === true) {
            $notInIds = Zend_Registry::get('notMovedIds');
            if (!is_null($notInIds)) {
                $select->where('a.id NOT IN (' . $notInIds . ')');
            }
        }
        //$sql = $select->__toString();
        //Zend_Debug::dump($sql);
        $countSelect = clone $select;
        $counter = $this->_countResult($countSelect);
        //Zend_Debug::dump($counter);
        //$counter = 5;

        $select->limitPage($page, 15);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll();
        //Zend_Debug::dump($result);
        return array(0 => $result, 1 => $counter);
    }


    /**
     *Получение всех значений с сортировкой по полю field1
     *@return Array
     */
    public function getSearchSectionFields($in, $page = 1, $amountF = null, $blockF = null, $amountKGF = null)
    {
        // Zend_Debug::dump($in);
        // exit;
        $fields = array('a.*','b.text');
        /*
        if(!is_null($amountF) && !is_null($blockF)) {
            if(is_null($amountKGF)) {
                // Если не задано поле количество упаковок, для роликов
                $fields[$amountF] = new Zend_Db_Expr($amountF . '-' . $blockF);
            }else {
                // HACK для склада Зюганова, для товаров типа ролики
                //Zend_Debug::dump($amountKGF);
                $fields[] = new Zend_Db_Expr("IF(field15 = 2, $amountKGF - $blockF, ROUND(($amountF - $blockF) / field10, 2)) AS $amountKGF");
                $fields[] = new Zend_Db_Expr("IF(field15 = 1, $amountF - $blockF, $amountF - ($blockF * field10)) AS $amountF");

            }
        }
        */
        $select = $this->_db->select();
        $select->from(array('a' => $this->table))
               ->join(array('b' => $this->tableValues), 'a.field1 = b.id', $fields)
               ->where('a.id IN (' . $in . ')');
        $select->order('b.text');
        // $sql = $select->__toString();
        // Zend_Debug::dump($sql);
        $countSelect = clone $select;
        $counter = $this->_countResult($countSelect);
        //Zend_Debug::dump($counter);
        //$counter = 5;

        $select->limitPage($page, 15);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll();
        //Zend_Debug::dump($result);
        return array(0 => $result, 1 => $counter);
    }


    /**
     *Подсчет количества записей результата
     *
     *@return Integer
     */
    protected function _countResult($select)
    {
        $select->reset(Zend_Db_Select::COLUMNS);
        $select->columns(array('counter' => 'COUNT(*)'));
        $stmt = $this->_db->query($select);
        $result = $stmt->fetch(Zend_Db::FETCH_ASSOC);

        //Zend_Debug::dump($result);
        return (int)$result['counter'];
    }


    /**
     *Получение уникальных строковых значений
     *@return Array
     */
    public function getStringUniqValues($field, $in = null)
    {
        //Zend_Debug::dump($in);
        // exit;
        $select = $this->_db->select();
        $select->distinct()->from($this->table, $field)
               ->order($field);
        if(!is_null($in)) {
            $select->where('id IN (' . $in . ')');
        }
        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll(Zend_Db::FETCH_COLUMN);

        return $result;
    }


    /**
     *проверка есть ли такой title
     *@return false || Array
     */
    public function getFieldTitle($fId, $fieldValue)
    {
        $select = $this->_db->select();
        $select->from($this->tableValues, 'id')
               ->where('fieldId = ?', $fId)
               ->where('BINARY text = ?', $fieldValue);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetch();

        return $result;
    }


    /**
     *добавление нового title
     *@return Integer
     */
    public function insertTitle($fId, $fieldValue)
    {
        $data = array(
                    'fieldId' => $fId,
                    'text'      => $fieldValue
                    );
        $this->_db->insert($this->tableValues, $data);
        $ids = (int) $this->_db->lastInsertId();

        return $ids;
    }


    /**
     *добавление новой записи
     *@return Integer
     */
    public function insertField($data)
    {
        //var_dump($data);
        // exit;
        $this->_db->insert($this->table, $data);
        return (int) $this->_db->lastInsertId();
    }


    /**
     *получение значений для select в форме
     *@return Array
     */
    public function getEnumValues($fId)
    {
        // Zend_Debug::dump($fId);
        // exit;
        $select = $this->_db->select();
        $select->from($this->tableValues, array('id', 'text'))
               ->where('fieldId = ?', $fId);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll();

        return $result;
    }


    /**
     *удаление записи
     *@return Integer
     */
    public function deleteField($fId)
    {
        $where = $this->_db->quoteInto('id = ?', $fId);

        $n = $this->_db->delete($this->table, $where);

        return $n;
    }


    /**
     *редактирование записи
     *@return Integer
     */
    public function saveEditField($values, $fId)
    {
        $data = array();
        foreach($values as $key => $val) {
            $data[$key] = $val;
        }
        // Zend_Debug::dump($data, '$data: ');
        // exit;
        $where = "id = " . $fId;

        $n = $this->_db->update($this->table, $data, $where);

        return $n;
    }


    /**
     * Получение данных о товаре
     *
     * @param integer $fId        Идентификатор товара
     * @param string $amountF     Название поля "Кол-во (штук) / общий вес"
     * @param string $blockF      Название поля "Блок"
     * @param string $amountKGF   Название поля "Кол-во упаковок / кол-во роликов"
     *
     * @return array Результат выборки из depot_2
     */
    public function getField($fId, $amountF, $blockF, $amountKGF)
    {
        $commonFields = array(
            '*',
            'd2d.parity',
            'IFNULL(d2d.guarantee, 0) AS guarantee'
        );

        switch ($this->getGetFieldStrategy()) {
            // По-умолчанию, везде, где не нужен учёт блокировок
            case self::GET_FIELD_STRATEGY_DEFAULT:

                if (!is_null($amountF) && !is_null($blockF)) {
                    if (is_null($amountKGF)) {
                        // Если не задано название поля "Кол-во упаковок / кол-во роликов", вычисляем только поле "Кол-во (штук) / общий вес"
                        $fields[] = new Zend_Db_Expr($amountF . '-' . $blockF . ' AS ' . $amountF);
                    } else {
                        // "Кол-во (штук) / общий вес"
                        $fields[] = new Zend_Db_Expr("IF(field15 = 1, $amountF - $blockF, $amountF - ($blockF * field10)) AS `{$amountF}`");
                        // "Кол-во упаковок / кол-во роликов"
                        $fields[] = new Zend_Db_Expr("IF(field15 = 2, $amountKGF - $blockF, ROUND(($amountF - $blockF) / field10, 2)) AS `{$amountKGF}`");
                    }
                }

                // Составляем запрос
                return $this
                    ->getAdapter()
                    ->select()
                    ->from(['d' => $this->table], $commonFields)
                    ->joinLeft(
                        ['d2d' => 'depot_2_data'],
                        "d.id = d2d.item_id AND d2d.depot_id = {$this->getDepotId()}",
                        array()
                    )
                    ->where('id = ?', $fId)
                    ->query()
                    ->fetch(Zend_Db::FETCH_ASSOC);

            case self::GET_FIELD_STRATEGY_MANAGER:
                $resultFields = array('`r`.*'); // Массив полей для выборки из подзапроса

                /**
                 * ticket1051, блокировка заказанного товара
                 *
                 * Ниже, внутри условного оператора к переданным названиям полей добавляется 'WithoutManagersBlocks'.
                 * Т.е. вычисляются значения полей без учёта блокировок товара под менеджеров.
                 * Далее, в массиве $resultFields учитываются блокировки товара под менеджеров, а в роли названий полей выступают, как и было задумано, {$amountF}, {$blockF} и {$amountKGF}.
                 */
                if (!is_null($amountF) && !is_null($blockF)) {
                    if (is_null($amountKGF)) {
                        // Если не задано название поля "Кол-во упаковок / кол-во роликов", вычисляем только поле "Кол-во (штук) / общий вес"
                        $commonFields[$amountF . 'WithoutManagersBlocks'] = new Zend_Db_Expr($amountF . '-' . $blockF);
                        $resultFields[] = '(ROUND(`r`.`' . $amountF . 'WithoutManagersBlocks` - `r`.`' . Depot_Model_ManagersBlocks::MANAGERS_BLOCKS_HIDDEN_AMOUNT . "`, 5)) AS $amountF";
                    } else {
                        // "Кол-во (штук) / общий вес"
                        $commonFields[] = new Zend_Db_Expr("IF(field15 = 1, $amountF - $blockF, $amountF - ($blockF * field10)) AS `{$amountF}WithoutManagersBlocks`");
                        $resultFields[] = "(ROUND(`r`.`{$amountF}WithoutManagersBlocks` - `" . Depot_Model_ManagersBlocks::MANAGERS_BLOCKS_HIDDEN_AMOUNT . "`, 5)) AS `$amountF`";
                        // "Кол-во упаковок / кол-во роликов"
                        $commonFields[] = new Zend_Db_Expr("IF(field15 = 2, $amountKGF - $blockF, ROUND(($amountF - $blockF) / field10, 2)) AS `{$amountKGF}WithoutManagersBlocks`");
                        $resultFields[] = "(ROUND(`r`.`{$amountKGF}WithoutManagersBlocks` - `r`.`" . Depot_Model_ManagersBlocks::MANAGERS_BLOCKS_HIDDEN_BOXES . "`, 5)) AS `$amountKGF`";
                    }
                }

                $managersBlocksFields = Depot_Model_ManagersBlocks::getInstance()->getManagersBlocksFields(
                    [$this->getDepotId()], $fId
                );

                if (!empty($managersBlocksFields)) {
                    foreach ($managersBlocksFields as $fieldName => $fieldQuery) {
                        $commonFields[] = new Zend_Db_Expr("$fieldQuery as $fieldName");
                    }
                }

                // Составляем Подзапрос
                $subQuerySQL = $this
                    ->getAdapter()
                    ->select()
                    ->from(['d' => $this->table], $commonFields)
                    ->joinLeft(
                        ["d2d" => "depot_2_data"],
                        "d2d.item_id = d.id AND d2d.depot_id = {$this->getDepotId()}",
                        []
                    )
                    ->where("id = ?", $fId)
                    ->assemble();

                // Оборачиваем подзапрос и указываем поля для выборки
                $resultQuerySQL = str_replace('{FIELDS}', implode(',', $resultFields), "SELECT {FIELDS} FROM ($subQuerySQL) AS `r`");

                return $this->_db->query($resultQuerySQL)->fetch(Zend_Db::FETCH_ASSOC);
        }
    }


    /**
     * получение данных о записи для движения по складу переработчика
     * @param Integer $fId
     * @param Integer $clientId
     * @return Array
     */

    public function getFieldConversions($fId, $clientId)
    {
        $this->_db->setFetchMode(Zend_Db::FETCH_ASSOC);
        $fields = array('*');

        $fields[] = new Zend_Db_Expr("ROUND(SUM(IFNULL(dcl.amount, 0)), 5) AS field11");
	$fields[] = new Zend_Db_Expr("ROUND(SUM(IFNULL(dcl.amount, 0)) / d.field10, 5) AS field12");

        $select = $this->_db->select();
        $select->from(array('d' => $this->table), $fields)
               ->join(array('dcl' => 'detailed_clients'), 'dcl.item_id = d.id', array('dId' => 'dcl.id'))
               ->where('d.id = ?', $fId)
               ->where('dcl.client_id = ?', $clientId);

        $stmt = $this->_db->query($select);
        $result = $stmt->fetch();

        $this->_db->setFetchMode(Zend_Db::FETCH_OBJ);

        return $result;
    }


    /**
     *Получение значения текстового поля по id
     *@return Object
     */
    public function getValueForString($ids)
    {
        $select = $this->_db->select();
        $select->from($this->tableValues, array('text'))
               ->where('id = ?', $ids);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetch();

        return $result->text;
    }


    /**
     * Получение подробной информации о товаре
     * @param $ids - id товара
     * @param $depotId - id склада
     * @return array
     */
    public function getDetailedInfo($ids, $depotId)
    {
        $rawInClaimType = array(
            App_Claim_Factory::CLAIM_TYPE_IN_RAW,
            App_Claim_Factory::CLAIM_TYPE_RETURN_OUT_RAW,
        );

        $sql = "
            SELECT
                dd.amount,
                dd.boxes,
                IF(
                    c.claimType IN (" . join(',', $rawInClaimType) . "), 
                    ROUND(IFNULL(cir.franco_boss, 0), 2), 
                    dd.price
                ) AS price,
                dd.dateIn,
                dd.claim_id,
                dd.placing,
                dd.number,
                dd.item_id,
                dd.defect,
                dd.defect_reason,
                dd.id,
                c.full_id,
                c.claimType,
                c.url,
                d2.field15 AS itemtype,
                bpcp.value AS baseprice,
                IF(d2iw.value = -1,
                    'н.д.',
                    IFNULL(ROUND(bpcp.value * d2iw.value, 8), '')
                ) AS item_baseprice,
                bpcp_in.value AS baseprice_in,
                IF(d2iw.value = -1,
                    'н.д.',
                    IFNULL(ROUND(bpcp_in.value * d2iw.value, 8), '')
                ) AS item_baseprice_in,
                d2d.annotation_in AS annotationIn
            FROM depot_detailed AS dd
            INNER JOIN claims AS c
            ON
                dd.claim_id = c.id
            INNER JOIN depot_2 AS d2
            ON
                d2.id = dd.item_id
            LEFT JOIN depot_2_data AS d2d
            ON
                d2d.depot_id = {$depotId} AND
                d2d.item_id = d2.id   
            LEFT JOIN base_prices_claim_products AS bpcp ON 
                bpcp.claim_id = dd.claim_id AND
                bpcp.product_id = dd.item_id AND
                bpcp.confirmed = '1' AND
                bpcp.bp_type = '1'
            LEFT JOIN base_prices_claim_products AS bpcp_in ON 
                bpcp_in.claim_id = dd.claim_id AND
                bpcp_in.product_id = dd.item_id AND
                bpcp_in.confirmed = '1' AND
                bpcp_in.bp_type = '2'
            LEFT JOIN
            (
                SELECT id, claim_id, product_id, number, franco_boss
                FROM claim_in_raw_product
                
                UNION ALL
                
                SELECT id, claim_id, product_id, number, franco_boss
                FROM claim_in_raw_waste
                    
                UNION ALL
                
                SELECT id, claim_id, product_id, number, franco_boss
                FROM claim_in_raw_base_product
            ) AS cir
            ON
                c.id = cir.claim_id AND
                dd.item_id = cir.product_id AND
                dd.number = cir.number
            LEFT JOIN depot_2_item_weight AS d2iw
            ON
                dd.item_id = d2iw.id
            WHERE
                (dd.item_id = ?) AND (dd.depot_id = ?) AND
                (dd.amount != 0) AND
                ((c.claim_status = 0 OR c.claimType IN (" . join(',', $rawInClaimType) . ")))
            GROUP
                BY dd.id
            ORDER BY
                dd.datein DESC,
                dd.price DESC
        ";

        $stmt = $this->_db->query($sql, array($ids, $depotId));
        $result = $stmt->fetchAll();

        return $result;
    }

    /**
     * Получение информации к товару по заявке
     * @param int $itemId
     * @param int $claimId
     */
    public function getDetailedInfoClaim($itemId, $claimId)
    {
        $sql = "
            SELECT 
                SUM(amount) amount,
                SUM(boxes) boxes,
                SUM(dAmount) depotAmount,
                SUM(dBoxes) depotBoxes,
                GROUP_CONCAT(section SEPARATOR ' / ') section,
                full_id,
                url,
                claim_date,
                claim_client,
                manager_name,
                manager_phone1,
                title,
                baseprice,
                ROUND(AVG(price), 2) price,
                ROUND(SUM(totalprice), 2) totalprice,
                ROUND(SUM(depotTotalprice), 2) depotTotalprice,
                (SELECT GROUP_CONCAT(user_phone.phone SEPARATOR ',<br />') FROM user_phone WHERE user_phone.`user_id` = e.userId GROUP BY user_phone.`user_id`) AS manager_phone
            FROM
                (SELECT 
                    cp.product_id id,
                    # если товар штучный и по заявке Приход от переработчика новый, берется boxes как amount
                    IF (d2.field15 = 1 AND c.claimType = 12, cp.boxes, cp.amount) AS amount,    
                    # если товар штучный и по заявке Приход от переработчика новый, boxes расчитывается из ср. веса
                    IF (d2.field15 = 1 AND c.claimType = 12, cp.boxes/d2.field10, cp.boxes) AS boxes,
                    dd.amount dAmount,
                    dd.boxes dBoxes,
                    dd.placing section,
                    c.full_id,
                    c.url,
                    c.date claim_date,
                    cl.s_title claim_client,
                    u.name manager_name,
                    u.`id` AS userId,
                    GROUP_CONCAT(up.phone SEPARATOR ',<br />') manager_phone1,
                    ct.title,
                    CONCAT(bp.value,IF(bp2.cur_price IS NOT NULL, CONCAT(' / ', bp2.cur_price), '')) baseprice,
                    cp.price,
                    # если товар штучный и по заявке Приход от переработчика новый, берется boxes как amount
                    (cp.price * IF (d2.field15 = 1 AND c.claimType = 12, cp.boxes, cp.amount)) totalprice, 
                    (dd.price * dd.amount) depotTotalprice 
                FROM
                    claim_products cp 
                INNER JOIN claims c 
                    ON (cp.claim_id = c.id) 
                INNER JOIN depot_detailed dd
                    ON cp.claim_id = dd.claim_id 
                   AND cp.product_id = dd.item_id
                   AND cp.number = dd.number
                INNER JOIN depot_2 AS d2 
                    ON d2.id = cp.product_id   
                LEFT JOIN (SELECT * FROM base_prices_claim_products bbp) bp 
                    ON (
                        bp.claim_id = c.id 
                        AND bp.product_id = cp.product_id 
                        AND bp.confirmed = '1'
                        AND bp.bp_type = '1'
                    ) 
                LEFT JOIN base_prices bp2
                    ON (
                        bp2.item_id = cp.product_id
                        AND bp2.cur_date <= NOW()
                        AND (
                            bp2.date_to >= NOW() 
                         OR bp2.date_to IS NULL
                        )
                        AND bp2.type = 2
                        AND bp2.bp_type = 1
                    )
                LEFT JOIN claim_type ct 
                    ON (ct.id = c.claimType) 
                LEFT JOIN clients cl 
                    ON (cl.id = c.client_id) 
                LEFT JOIN users u 
                    ON (u.id = c.manager_id) 
                LEFT JOIN user_phone up 
                    ON (up.user_id = u.id) 
                WHERE c.id = " . $claimId . " 
                  AND cp.product_id = " . $itemId . " 
                  AND (cp.amount != 0)) e 
            GROUP BY id 
        ";

        echo "<pre>" . print_r($sql, true); echo "</pre>"; // // 20.12.2024 17:27  Frolovdump Froldebug
        exit();

        return $this->_db->query($sql)->fetch();
    }


    /**
     *Получение подробной информации о товаре
     *на складе переработчика
     *@param Integer $ids - id товара
     *@param Integer $depotId - id склада
     *@return Array
     */
    public function getConversionDetailedInfo($ids, $depotId)
    {
        $select = $this->_db->select();
        $select->from('detailed_clients', array('amount', 'price', 'dateIn'))
               ->where('item_id = ?', $ids)
               ->where('depot_id = ?', $depotId)
               ->where('amount != ?', 0)
               ->order('price DESC');
        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll();

        return $result;
    }


    /**
     * Определение копии записи в базе
     * UPD Даный метод устарел, так как для товаров добавлено новое свойство product_type
     * данное свойство хранится в таблице depot_2_data. Для проверки товара на уникальность
     * также неоходимо учесть это св-во товара.
     * @param array $fields
     * @return int|mixed
     */
    public function recordExist($fields)
    {
        $select = $this->_db->select();
        $select->from($this->table);

        foreach($fields as $key => $field) {
            $select->where($key . ' = ?', $field);
        }
        $stmt = $this->_db->query($select);
        $result = $stmt->rowCount();

        return $result;
    }


    /**
     * Поиск записи по полям
     * @param $fields
     * @return object|FALSE
     */
    public function getRecordByFields($fields)
    {
        $select = $this->_db->select();
        $select->from($this->table);

        foreach($fields as $key => $field) {
            $select->where($key . ' = ?', $field);
        }

        return $this->_db->query($select)->fetch();
    }


    /**
     * Поиск значений поля по начальным буквам
     * @param $fId
     * @param $sString
     * @return array
     * @Deprecated
     */
    public function getFValues($fId, $sString)
    {
        //Zend_Debug::dump($sString);

        $select = $this->_db->select();
        $select->from($this->tableValues, 'text')
               ->where('text LIKE(?)', $sString . '%')
               ->where('fieldId = ?', $fId)
               ->order('text');
        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll();

        //Zend_Debug::dump($result);
        return $result;
    }


    /**
     * Обновленная версия getFValues
     * @param int $fieldId
     * @param string $value
     * @param int $limit
     * @return array
     */
    public function getFieldValues(int $fieldId, string $value, int $limit = 0): array
    {
        $select = $this->getAdapter()->select();

        $select->from($this->tableValues, 'text')
               ->where('text LIKE(?)', $value . '%')
               ->where('fieldId = ?', $fieldId)
               ->order('text');

        if ($limit > 0) {
            $select->limit($limit);
        }

        return $this->_db->fetchCol($select);
    }


    /**
     * Проверка на существование записи с id клиента, id позиции, id склада
     * @param $fieldId
     * @param $clientId
     * @param $depotId
     * @return bool
     */
    public function fieldExists($fieldId, $clientId, $depotId)
    {
        $select = $this->_db->select();
        $select->from('client_marks')
               ->where('client_id = ?', $clientId)
               ->where('field_id = ?', $fieldId)
               ->where('depot_id = ?', $depotId);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetch();
        if($result === false) {
            return false;
        }
        return true;
    }


    /**
     * Создание записи позиции с привязкой к клиенту
     *@return void
     */
    public function attachFieldToClient($fieldId, $clientId, $depotId)
    {
        $data = array(
                        'field_id' => $fieldId,
                        'client_id' => $clientId,
                        'depot_id' => $depotId
                    );
        $this->_db->insert('client_marks', $data);
    }


    /**
     *Привязать/отзвязать поле
     *@return void
     */
    public function fieldBindChange($fieldId, $clientId, $depotId, $status)
    {
        $data = array(
                        'state' => $status
                    );
        $where[] = 'field_id = ' . $fieldId;
        $where[] = 'client_id = ' . $clientId;
        $where[] = 'depot_id = ' . $depotId;

        $this->_db->update('client_marks', $data, $where);
    }


    /**
     *Получение полей привязанных к клиенту
     *@return Array
     */
    public function getClientFields($clientId, $depotId)
    {
        $select = $this->_db->select();
        $select->distinct()
               ->from('client_marks', array('field_id', 'price'))
               ->where('client_id = ?', $clientId)
               ->where('depot_id = ?', $depotId)
               ->where('state = ?', 1);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll();

        return $result;
    }


    /**
     *Изменение цены
     *@return void
     */
    public function setPrice($fieldId, $clientId, $depotId, $price)
    {
        $data = array(
                        'price' => $price
                    );
        $where[] = 'depot_id = ' . $depotId;
        $where[] = 'client_id = ' . $clientId;
        $where[] = 'field_id = ' . $fieldId;
        $where[] = 'state = 1';

        $this->_db->update('client_marks', $data, $where);
    }


    /**
     *Получение всех id полей привязанных к клиенту
     *@return Array
     */
    public function getCFIDS($clientId, $depotId)
    {
        $select = $this->_db->select();
        $select->distinct()->from('client_marks', array('field_id'))
               ->where('client_id = ?', $clientId)
               ->where('depot_id = ?', $depotId)
               ->where('state = ?', 1);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll();

        return $result;
    }


    /**
     *Обновление поля количество при закрытии заявки
     *@return void
     */
    public function updateAmount($table, $field, $amount, $pId, $mark, $flag = false)
    {
        $roundVal = ($flag) ? 5 : 0;
        $data = array(
            //$field => new Zend_Db_Expr('ROUND(' . $field . ' ' . $mark . ' ' . $amount . ',' . $roundVal . ')')
            $field => new Zend_Db_Expr('ROUND(' . $field . ' ' . $mark . ' ' . $amount . ',5)')
        );
        $where = 'id = ' . $pId;
        $this->_db->update($table, $data, $where);

    }


    /**
     * Проверка минимального количества товара на складе с учетом блокировок, отправка рассылки, если значение меньше заданного
     * @param int $claimId
     * @param int $depotId
     * @param int $productId
     * @param null $typeAction - тип события block - блокировка, close - закрытие заявки
     * @return void
     * @throws Zend_Db_Statement_Exception
     */
    public function checkMinAmount(int $claimId, int $depotId, int $productId, $typeAction = null)
    {
        // не выполнять проверку минимального количества товара на складе если не установлено по правам
        if (!$this->_getEndingGoodsPermissions($typeAction)) {
            return;
        }

        $sql = "
            SELECT
                dpma.min_amount AS minAmount,
                d.field11 AS amountWeightWithoutBlock,
                (
                    CASE WHEN d.field15 = 1
                        THEN ROUND(d.field11 - d.field14, 5)
                        ELSE ROUND((d.field11 - IFNULL(SUM(b.amount), 0)), 5)
                    END
                ) AS amountWeight,
                IFNULL(rp.calculated, 0) AS receiptPurchases
            FROM depot_{$depotId} AS d
            INNER JOIN depot_product_min_amount AS dpma
            ON
                dpma.product_id = d.id AND
                dpma.depot_id = {$depotId}
            LEFT JOIN blocks AS b
            ON
                b.item_id = d.id AND
                b.state = 1
            LEFT JOIN receipt_purchases AS rp
                ON (rp.item_id = d.id)
            WHERE
                d.id = {$productId}
            GROUP BY
                d.id
        ";

        $item = $this->_db->query($sql)->fetchAll()[0];

        // Если выставлено право, то проверяем с количеством с блокировкой, иначе без.
        $control = App_Access::get('key', 'analitics>endinggoods>controlWithBlocks')
            ? $item->amountWeight
            : $item->amountWeightWithoutBlock;

        // Необходимые закупки по плану производства
        $control -= $item->receiptPurchases;

        // отправляем рассылку, если значение меньше заданного
        if ($control <= $item->minAmount) {
            $this->sendMinAmountMail(
                $depotId, $productId, $item->amountWeight, $item->amountWeightWithoutBlock, $item->minAmount
            );
        }

        $this->checkGroupMinAmount($productId, $claimId);
    }

    /**
     * Возвращает права выполнять ли проверку минимального количества товара на складе
     * @param string $typeAction - тип события block - блокировка, close - закрытие заявки
     * @return bool
     */
    protected function _getEndingGoodsPermissions($typeAction = null)
    {
        // если тип действия не установлен возврвщает false
        if (!$typeAction) {
            return false;
        }

        // получение права по типу действия block - блокировка, close - закрытие заявки
        return App_Access::get('access', 'analitics>endinggoods>alarm' . $typeAction);
    }


    /**
     * Проверка минимального количества товара по группе на складе с учетом блокировок,
     * отправка рассылки, если значение меньше заданного
     * @param int $productId
     * @param int $claimId
     * @return void
     * @throws Zend_Db_Statement_Exception
     */
    public function checkGroupMinAmount(int $productId, int $claimId)
    {
        $groupData = App_Db_DepotGroupMinAmount::obtain()->getRowByProductId($productId);

        if (!$groupData) {
            return;
        }

        $depotIds = $groupData->depot_id == -1 ? array_keys(App_Depot_Handlers_Manager::getCollection()) : [$groupData->depot_id];

        $sql = "
            SELECT
                dgma.*,
                SUM(ROUND(d.field11, 5)) AS amountWeightWithoutBlock,
                SUM((CASE WHEN d.field15 = 1 then ROUND(d.field11 - d.field14, 5) ELSE ROUND((d.field11 - IFNULL(blocks.sumAmount,0)), 5) END)) AS amountWeightUnsigned,
                GROUP_CONCAT(dpma.product_id SEPARATOR ',') AS item_ids
            FROM depot_group_min_amount AS dgma
            LEFT JOIN depot_product_min_amount AS dpma
            ON
                dpma.depot_id = {$groupData->depot_id} AND
                dpma.group_id = dgma.id
            LEFT JOIN " . App_Depot_Handlers_Wrapper::getInstance()->getDepotQuery($depotIds) . " AS d
            ON
                d.id = dpma.product_id
            LEFT JOIN
            (
                SELECT
                    SUM(b.amount) AS sumAmount,
                    b.item_id
                FROM blocks AS b
                INNER JOIN depot_detailed AS dd
                ON
                    dd.depot_id = {$groupData->depot_id} AND
                    dd.id = b.detailed_id
                WHERE
                    b.state = 1
                GROUP BY
                    b.item_id
            ) AS blocks
            ON
                blocks.item_id = d.id
            WHERE
                dgma.id = {$groupData->id}
            GROUP BY
                dgma.id
        ";

        $item = $this->_db->query($sql)->fetchObject();

        // Если выставлено право, то проверяем с количеством с блокировкой, иначе без.
        $control = App_Access::get('key', 'analitics>endinggoods>controlWithBlocks') ? $item->amountWeightUnsigned : $item->amountWeightWithoutBlock;

        // Отправка рассылки, если значение меньше заданного
        if ($control <= $item->min_amount) {
            $this->sendGroupMinAmountMail($groupData->id, $item->item_ids, $claimId, $productId);
        }
    }


    /**
     * Отправка рассылки для товара минимальное кол-во которого меньше заданного
     * @param int $depotId
     * @param string $itemIds
     * @param $amountWeight
     * @param $amountWeightWithoutBlock
     * @param $minAmount
     * @return void
     * @throws Zend_Db_Statement_Exception
     */
    public function sendMinAmountMail(int $depotId, string $itemIds, $amountWeight, $amountWeightWithoutBlock, $minAmount)
    {
        $depotWrapper = new App_Depot_Wrapper($depotId);

        $sql = "
            SELECT
                d.id,
                " . App_Config_Depot::getQueryPart() . ",
                dpma.min_amount AS minAmount,
                c.url AS url,
                c.full_id AS full_id,
                SUM(b.amount) AS amount,
                SUM(b.boxes) AS boxes,
                DATE_FORMAT(FROM_UNIXTIME(b.date), '%d.%m.%Y') AS date,
                GROUP_CONCAT(clients.s_title SEPARATOR ', ') AS clients,
                GROUP_CONCAT(cIn.full_id SEPARATOR ',') AS cInFull_id,
                GROUP_CONCAT(cIn.url SEPARATOR ',') AS cInUrl
            FROM depot_2 AS d
            INNER JOIN depot_product_min_amount AS dpma
            ON
                dpma.depot_id = {$depotId} AND
                dpma.product_id = d.id
            LEFT JOIN blocks AS b
            ON
                b.item_id = d.id AND
                b.state = 1
            LEFT JOIN claims AS c
            ON
                c.id = b.claim_id
            LEFT JOIN depot_detailed AS dd
            ON
                dd.id = b.detailed_id
            LEFT JOIN claims AS cIn
            ON
                cIn.id = dd.claim_id
            LEFT JOIN clients
            ON
                clients.id = cIn.client_id
            WHERE
                d.id IN ({$itemIds}) AND
                dd.depot_id = {$depotId}
            GROUP BY
                b.claim_id
            ORDER BY
                b.date DESC
        ";

        $stmt = $this->_db->query($sql);
        $result = $stmt->fetchAll();
        $view = Zend_Layout::getMvcInstance()->getView();
        if (count($result) > 0) {
            foreach ($result as &$value) {
                $cInArray = explode(',', $value->cInFull_id);
                $cInUrlArray = explode(',', $value->cInUrl);
                $resultCIn = '';
                if (count($cInUrlArray) > 0) {
                    foreach ($cInUrlArray as $cInUrlkey => $cInUrlItem) {
                        $resultCIn .= '<a href="' . SITE_NAME . $view->linkPrefix() . $cInUrlItem .
                        '" title="Открыть заявку" target="_blank">' .
                        $cInArray[$cInUrlkey] . '</a>, ';
                    }
                    $value->cIn = substr($resultCIn, '0', '-2');
                }
                $value->cOut = '<a href="' . SITE_NAME . $view->linkPrefix() . $value->url .
                        '" title="Открыть заявку" target="_blank">' .
                        $value->full_id . '</a>';
                $value->amount = number_format($value->amount, 2, ',', ' ');
                $value->boxes = number_format($value->boxes, 2, ',', ' ');
                $value->minAmount = number_format($minAmount, 2, ',', ' ');
            }
            $mailData = array(
                'productInfo'                     => $result,
                'fields'                          => $depotWrapper->getBasicConfig(),
                'productAmountWeight'             => $amountWeight < 0 ? 0 : number_format($amountWeight, 2, ',', ' '),
                'productAmountWeightWithoutBlock' => $amountWeightWithoutBlock < 0 ? 0 : number_format($amountWeightWithoutBlock, 2, ',', ' ')
            );
            try {
                App_Sendmail_Abstract::sendMail(21, $mailData);
            } catch(Exception $e) {
                echo '<b>Exception:</b> '. $e->getMessage() .'<br/>';
            }
        }
    }


    /**
     * Отправка рассылки для группы товара минимальное кол-во которого меньше заданного
     * @param int $groupId - id группы
     * @param string $item_ids - id товаров
     * @param int $claimId - id заявки
     * @param int $itemId - id товара
     */
    public function sendGroupMinAmountMail($groupId, $item_ids, $claimId, $itemId)
    {
        $groupData = App_Db_DepotGroupMinAmount::obtain()->getRow(
            ['id = ?' => $groupId], Zend_Db::FETCH_OBJ
        );

        // Выбор склада, группа может относиться к одному складу или ко всем складам
        $depotIds = $groupData->depot_id == -1 ? array_keys(App_Depot_Handlers_Manager::getCollection()) : [$groupData->depot_id];

        $sql = "
            SELECT
                dgma.*,
                SUM(ROUND(d.field11, 5)) as amountWeightWithoutBlock,
                SUM((CASE WHEN d.field15 = 1 then ROUND(d.field11 - d.field14, 5) ELSE ROUND((d.field11 - IFNULL(blocks.sumAmount, 0)), 5) END)) AS amountWeightUnsigned
            FROM depot_group_min_amount AS dgma
            LEFT JOIN depot_product_min_amount AS dpma 
            ON
                dpma.depot_id = {$groupData->depot_id} AND
                dpma.group_id = dgma.id
            LEFT JOIN " . App_Depot_Handlers_Wrapper::getInstance()->getDepotQuery($depotIds) . " AS d
            ON
                d.id = dpma.product_id
            LEFT JOIN
            (
                SELECT
                    SUM(b.amount) AS sumAmount,
                    b.item_id
                FROM blocks AS b
                INNER JOIN depot_detailed AS dd
                ON
                    dd.depot_id IN (" . join(",", $depotIds) . ") AND
                    dd.id = b.detailed_id
                WHERE
                    b.state = 1
                GROUP BY
                    b.item_id
            ) AS blocks
            ON
                blocks.item_id = d.id
            WHERE
                dgma.id = {$groupData->id}
            GROUP BY
                dgma.id
        ";

        $groupObject = $this->getAdapter()->query($sql)->fetchObject();

        $sql = "
            SELECT
                e.*,
                IF(amountWeightUnsigned <= 0, '', amountWeightUnsigned) AS amountWeight
            FROM
            (
                SELECT
                    d.id,
                    " . App_Config_Depot::getQueryPart() . ",
                    d.field10 AS inBoxes,
                    d.field11 AS totalAmount,
                    d.field12 AS totalBoxes,
                    c.url AS url,
                    (SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13) AS description,
                    d.field14 AS block,
                    d.field15 AS type,
                    dpma.min_amount AS minAmount,
                    (CASE WHEN d.field15 = 1 then ROUND(d.field11 - d.field14, 5) ELSE ROUND((d.field11 - IFNULL(SUM(b.amount), 0)), 5) END) AS amountWeightUnsigned,
                    (CASE WHEN d.field15 = 1 then ROUND((d.field11 - d.field14)/d.field10, 5) ELSE ROUND(d.field12 - d.field14, 5) END) AS boxesRols,
                    dpma.group_id AS group_min_amount_id
                FROM " . App_Depot_Handlers_Wrapper::getInstance()->getDepotQuery($depotIds) . " AS d
                LEFT JOIN depot_product_min_amount AS dpma
                ON
                    dpma.depot_id = {$groupData->id} AND
                    dpma.product_id = d.id
                LEFT JOIN blocks AS b
                ON
                    b.item_id = d.id AND
                    b.state = 1
                INNER JOIN depot_detailed AS dd
                ON
                    dd.id = b.detailed_id AND
                    dd.depot_id IN (" . join(",", $depotIds) . ")
                LEFT JOIN claims AS c
                ON
                    c.id = b.claim_id
                WHERE
                    d.id IN ({$item_ids})
                GROUP BY
                    d.id
            ) AS e
        ";

        $claim   = App_Db_Claims::obtain()->getById($claimId);
        $manager = App_Db_Users::obtain()->getUser($claim->manager_id) ;

        $result = $this->_db->query($sql)->fetchAll();

        $view = Zend_Layout::getMvcInstance()->getView();

        if (count($result) > 0) {
            foreach ($result as &$value) {
                $value->totalAmount = number_format((float)$value->totalAmount, 2, ',', ' ');
                $value->amount = number_format((float)$value->amountWeight, 2, ',', ' ');
                $value->inBoxes = number_format((float)$value->inBoxes, 2, ',', ' ');
                $value->boxes = number_format((float)$value->boxesRols, 2, ',', ' ');
                $value->minAmount = number_format((float)$value->minAmount, 2, ',', ' ');
                $value->link = '<a href="' . SITE_NAME . $view->linkPrefix() . $claim->url .
                        '" title="Открыть заявку" target="_blank">' .
                        $claim->full_id . '</a>';
            }

            $depotWrapper = new App_Depot_Wrapper(2);

            $mailData = array(
                'subjectParams' => array(
                    'title' => '"' . $groupObject->title . '"'
                ),
                'productInfo'   => $result,
                'fields'        => $depotWrapper->getBasicConfig(),
                'group'         => $groupObject,
                'manager'       => $manager->name,
                'itemId'        => $itemId
            );
            try {
                App_Sendmail_Abstract::sendMail(24, $mailData);
            } catch(Exception $e) {
                echo '<b>Exception:</b> '. $e->getMessage() .'<br/>';
            }
        }
    }


    /**
     * Проверка минимального кол-во товара на складе по заявке
     * @param int $claimId
     */
    public function checkMinAmountByClaim($claimId)
    {
        $sql = "
            SELECT cp.product_id, cp.depot_id
            FROM claim_products AS cp
            WHERE
                cp.claim_id = {$claimId}
            GROUP BY
                cp.product_id
        ";

        // ID товаров в заявке
        $result =  App_Db::get()->query($sql)->fetchAll();

        if (count($result)) {
            foreach($result as $item) {
                App_Db_Depot2::obtain()->checkMinAmount(
                    $claimId, (int) $item->depot_id, (int) $item->product_id, 'close'
                );
            }
        }
    }


    /**
     * Обновление поля количество упаковок для товаров тпа мешки ШТ
     * Обновление поля средний вес, для товаров типа ролики КГ
     * @param $field1
     * @param $field2
     * @param $field3
     * @param $productId
     * @return void
     * @throws Zend_Db_Adapter_Exception
     * @throws Zend_Db_Statement_Exception
     */
    public function updateAverageField($field1, $field2, $field3, $productId)
    {
        $field1Row = $this
            ->getAdapter()
            ->select()
            ->from($this->getName(), [$field1])
            ->where('id = ?', $productId)
            ->limit()
            ->query()
            ->fetch(Zend_Db::FETCH_ASSOC);

        $field2Row = $this
            ->getAdapter()
            ->select()
            ->from($this->getName(), [$field2])
            ->where('id = ?', $productId)
            ->limit()
            ->query()
            ->fetch(Zend_Db::FETCH_ASSOC);

        // $field2 - это "Кол-во уп-к/кол-во роликов" (boxes)
        if ($field2 === 'field12') {
            if ($field2Row[$field2] == 0) {
                $this->getAdapter()->update(
                    $this->getName(),
                    ['field11' => 0],
                    ['id =?' => $productId]
                );
            }
        }

        $this->getAdapter()->update(
            $this->getName(),
            [$field3 => round(($field2Row[$field2] == 0 ? 0 : $field1Row[$field1] / $field2Row[$field2]), 5)],
            ['id = ?' => $productId]
        );
    }


    /**
     *Получение значения доступного для блокировки
     *field11(всего штук) - field13(в блоке)
     *@return Float
     */
    public function getAvailValue($pId, $fieldAmount, $fieldBlock)
    {
        $select = $this->_db->select();
        $select->from($this->table, array('amountAvailable' => new Zend_Db_Expr($fieldAmount .' - ' . $fieldBlock)));
        $select->where('id = ?', $pId);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetch(Zend_Db::FETCH_COLUMN);
        return $result;
    }


    /**
     *Получение типа товара
     *@param Integer $pId
     *@return Integer
     */
    public function getProductType($pId)
    {
        $select = $this->_db->select();
        $select->from($this->table, array('field15'))
               ->where('id = ?', $pId);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetch(Zend_Db::FETCH_ASSOC);
        return $result['field15'];
    }


    /**
     *Получение id товаров у которых
     *значения количества > 0
     *@return Array
     */
    public function getNotNullItems()
    {
        $select = $this->_db->select();
        $select->from($this->table, array('id'))
               ->where('field10 > 0')
               ->where('field11 > 0')
               ->where('field12 > 0');
        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll(Zend_Db::FETCH_COLUMN);

        return $result;
    }


    /**
     *Поулчение поля количество в упаковке
     *@return Float
     */
    public function getInboxesValue($ids)
    {
        $select = $this->_db->select();
        $select->from($this->table, array('field10'))
               ->where('id = ?', $ids);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetch(Zend_Db::FETCH_COLUMN);
        return $result;
    }


    /**
     *Получение всех id товаров из таблицы items_not_empty
     *@param Integer $processorId - id переработчика
     *@return Array
     */
    public function getNotEmptyIds($processorId)
    {
        $select = $this->_db->select();
        $select->from('items_not_empty', array('item_id'))
               ->where('client_id = ?', $processorId);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll(Zend_Db::FETCH_COLUMN);
        return $result;
    }


    /**
     *Получение названия товара
     *@return String
     */
    public function getProductTitle($pId)
    {
        $fields = array(
            'ptitle' => 'b.text'
        );
        $select = $this->_db->select();
        $select->from(array('a' => $this->table), $fields)
               ->join(array('b' => $this->tableValues), 'a.field1 = b.id', $fields)
               ->where('a.id = ?', $pId);
        $select->order('b.text');
        $stmt = $this->_db->query($select);
        $result = $stmt->fetch(Zend_Db::FETCH_COLUMN);
        return $result;
    }


    /**
     *Получение записей
     *с не нулевыми значениями
     *@return Array
     */
    public function getUniqueNotNullValues($field, $blockField = null)
    {
        $select = $this->_db->select();
        $select->distinct()->from($this->table, array($field))
               ->where($field . ' != ?', 0);
        if(!is_null($blockField)) {
            $select->where(new Zend_DB_Expr('IF(field15 = 1, ' . $field . ' - ' . $blockField . ' != 0, field12 - ' . $blockField . ' != 0)'));

            //$select->where(new Zend_DB_Expr($field . ' - ' . $blockField) . '!= ?', 0);
            // $fields[] = new Zend_Db_Expr("IF(field15 = 2, $amountKGF - $blockF, ROUND(($amountF - $blockF) / field10, 2)) AS $amountKGF");
            // $fields[] = new Zend_Db_Expr("IF(field15 = 1, $amountF - $blockF, $amountF - ($blockF * field10)) AS $amountF");
        }
        //Zend_Debug::dump($select->__toString());
        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll(Zend_Db::FETCH_COLUMN);
        return $result;
    }


    /**
     *Получение значения amount - block, сколько доступно для блокировки
     *@return float
     */
    public function getAvailAmount($field, $ids)
    {
        $select = $this->_db->select();
        $select->from($this->table, array('avail' => new Zend_Db_Expr($field . ' - field14')))
               ->where('id = ?', $ids);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetch(Zend_Db::FETCH_COLUMN);
        return $result;
    }


    /**
     * Ищет поставщика (fieldId = 6) с соответствующим именем
     *
     * @param type $name Предполагаемое имя поставщика
     *
     * @return mixed Идентификатор найденной записи | FALSE
     */
    public function getVendorIdByName($name = false)
    {
        $result = false;
        if ($name) {
            // TODO каким то образом понимать, что надо брать поле6
            $select = $this->_db->select();
            $select->from($this->tableValues)
                ->where('fieldId = 6')
                ->where('text = ?', $name);
            $result = $this->_db->query($select)->fetch(Zend_Db::FETCH_COLUMN);
        }
        return $result;
    }


    /**
     * Меняет имя поставщика (fieldId = 6) на указанное в параметре $name
     *
     * @param type $id      Идентификатор записи d2_field_id
     * @param type $name    Новое имя
     *
     * @return boolean      Результат выполнения
     */
    public function setVendornameByD2fId($id = false, $name = false)
    {
        if ($id && $name) {
            return $this->_db->update($this->tableValues, array('text' => $name), array('id = ' . $id, 'fieldId = 6'));
        }
        return false;
    }

    /**
     * Ищет поставщиков (fieldId = 6)
     *
     * @return mixed Результат
     */
    public function getAllVendorsTitles()
    {
        return $this->getAdapter()->select()
            ->from(array('d2f' => $this->tableValues), array('text'))
            ->joinLeft(array('v' => DB_VENDORNAME), 'd2f.id = v.d2_field_id')
            ->where('fieldId = 6')
            ->where('v.id IS NULL') // Не берём уже связанных поставщиков
            ->query()
            ->fetchAll(Zend_Db::FETCH_COLUMN, 0);
    }

    /**
     * Получение веса еденицы товара
     * @param Integer $pId
     * @return Integer
     */
    public function getProductItemWeight($pId)
    {
        return round((float)App_Db::get()->query("SELECT a.`value` FROM `depot_2_item_weight` a WHERE a.`id` = {$pId}")->fetch(Zend_Db::FETCH_COLUMN), 7);
    }

    /**
     * Получение веса еденицы товара на основе формул
     * @param Integer $pId
     * @return Integer
     */
    public function getProductUnitWeight($pId)
    {
        $title = $this->getProductTitle($pId);
        $res = App_Db::get(DB_PRODUCT_FORMULS)->getRow(array('title = ?' => strtolower($title)), Zend_Db::FETCH_OBJ);
        if (!$res) {
            return 0;
        }
        $pParam = $this->getRow(array('id = ?' => $pId), Zend_Db::FETCH_OBJ);
        $formula = $res->formula;
        foreach($pParam as $key => $value){
            $formula = str_replace('$'.$key, $value, $formula);
        }
        return eval("return ({$formula});");
    }

    /**
     * Метод для отправки товара в архив
     * @param integer $itemId - id товара, который нужно отправить в архив
     * @return integer
     */
    public function setInArchive($itemId)
    {
        $where = Zend_Db_Table::getDefaultAdapter()->quoteInto('id = ?', $itemId);
        return $this->update(array('field16' => 1), $where);
    }

    /**
     * Метод для извлечения товара из архива
     * @param integer $itemId - id товара, который нужно извлечь из архива
     * @return integer
     */
    public function setNotInArchive($itemId)
    {
        $where = Zend_Db_Table::getDefaultAdapter()->quoteInto('id = ?', $itemId);
        return $this->update(array('field16' => 0), $where);
    }

    /**
     * Проверка возможности добавления товара в архив
     * @param integer $itemId - id товара для проверки
     * @return array array('success' => true|false, 'errors' => array())
     */
    public function canAddInArchive($itemId)
    {
        $errors = array();

        // проверка участия товара в незакрытой заявке
        $sql = "
            SELECT
                EXISTS
                (SELECT
                    c.id
                FROM
                    claim_products AS cp
                    INNER JOIN claims AS c
                        ON cp.`claim_id` = c.id
                WHERE cp.product_id = ?
                    AND c.claim_status <> 0) AS active_claim
        ";
        $activeClaimExists = App_Db::get()->query($sql, array($itemId))->fetch(Zend_Db::FETCH_OBJ);
        if ($activeClaimExists->active_claim > 0) {
            $errors[] = 'Товар используется в незакрытой заявке';
        }

        // проверка остатков на складе
        $sql = "
            SELECT
                SUM(amount) AS total_amount,
                SUM(boxes) AS total_boxes
            FROM depot_detailed
            WHERE item_id = ?";
        $itemTotalAmount = App_Db::get()->query($sql, array($itemId))->fetch(Zend_Db::FETCH_OBJ);
        if ($itemTotalAmount->total_amount > 0.1 || $itemTotalAmount->total_boxes > 0.1) {
            $errors[] = 'Товар есть на складе';
        }

        // проверка остатков на складе переработчика
        $sql = "
            SELECT
                SUM(amount) AS total_amount
            FROM detailed_clients
            WHERE item_id = ?
        ";
        $itemTotalAmount = App_Db::get()->query($sql, array($itemId))->fetch(Zend_Db::FETCH_OBJ);
        if ($itemTotalAmount->total_amount > 0.1) {
            $errors[] = 'Товар есть на складе переработчика';
        }

        return array(
            'success' => (count($errors) == 0),
            'errors' => $errors
        );
    }

    /**
     * Добавление блокировки для товара
     * @param int $itemId
     * @param int $amount
     */
    public function addBlockItem($itemId, $amount)
    {
        $sql = "UPDATE {$this->_name} SET field14 = field14 + {$amount} WHERE id = {$itemId}";
        $this->_db->query($sql);
    }


    /**
     * Обновляет данные о блокировке товара (field14) на основе данных из DB_DEPOT_DETAILED
     * @param $productId
     * @return bool
     */
    public function updateProductBlockValue($productId)
    {
        $sql = "
            UPDATE {$this->getName()} AS d2
            INNER JOIN
            (
                SELECT
                    dd.item_id,
                    SUM(dd.block) AS block
                FROM " . DB_DEPOT_DETAILED . " AS dd
                WHERE
                    dd.item_id = " . $productId . " AND
                    dd.depot_id = " . $this->getDepotId() . "
                GROUP BY
                    dd.item_id
            ) AS e
            ON
                e.item_id = d2.id
            SET
                d2.field14 = e.block";

        return App_Db::get()->prepare($sql)->execute();
    }

    /**
     * Проверка наличия схожих товаров по парамметрам соответствия.
     * @param $similarityParams
     * @return bool
     */
    public function checkSimilarProducts($similarityParams)
    {
        // Параметры соответствия
        $similarityParams = $similarityParams? $similarityParams: array();

        // Условие схожести
        $condition = '';
        // ID товаров для поиска схожих
        $ids = '0';

        foreach ($similarityParams as $param) {
            $condition .= ' OR (' . Depot_Model_Similarproducts_Config_Depot::getWhereConditionForProduct($param) . ')';
            $ids .= ', ' . $param['product_id'];
        }

        $sql = "
        SELECT 
            COUNT(*)
        FROM
            " . DB_DEPOT_2 . " AS d
        WHERE d.id <> d.id
            " . $condition . " AND 
            d.id NOT IN (" . $ids . ")
        ";

        return $this->_db->query($sql)->fetchColumn() > 0;
    }


    /**
     * Обновляет DB_DEPOT_2 на основе DB_DEPOT_DETAILED
     * @Todo перевести все заявки связанные с depot_2 на единый метод
     * @param array $claimProductsId
     * @return void
     * @throws Zend_Db_Statement_Exception
     */
    public function resetByDepotDetailed(array $claimProductsId)
    {
        // Типы заявок которые можно учитывать на любом статусе
        $applyOnAnyStatus = array(
            App_Claim_Factory::CLAIM_TYPE_IN_RAW,
            App_Claim_Factory::CLAIM_TYPE_RETURN_OUT_RAW,
        );

        if (!$claimProductsId) {
            return;
        }

        $sql = sprintf(
            '
                UPDATE
                    depot_%1$s AS d2
                INNER JOIN
                    (
                        SELECT
                            dd.item_id,
                            SUM(dd.block)  AS block,
                            SUM(dd.amount) AS amount,
                            SUM(dd.boxes)  AS boxes
                        FROM
                            (
                                SELECT dd1.*
                                FROM depot_detailed AS dd1
                                INNER JOIN claims AS c1
                                ON
                                    dd1.claim_id = c1.id AND
                                    (c1.claim_status = 0 OR c1.claimType IN (%2$s)) AND
                                    dd1.amount >= 0
                            ) AS dd
                        WHERE
                            dd.depot_id = %1$s AND
                            dd.item_id IN (%3$s)
                        GROUP BY
                            dd.item_id
                    ) AS e
                ON
                    e.item_id = d2.id
                SET
                    d2.field14 = e.block,
                    d2.field11 = e.amount,
                    d2.field12 = e.boxes,
                    d2.field10 = (CASE WHEN d2.field15 = 1 THEN d2.field10 ELSE ROUND(e.amount/e.boxes, 5) END)
            ',
            $this->getDepotId(),
            implode(', ', $applyOnAnyStatus),
            implode(', ',$claimProductsId)
        );

        $this->_db->query($sql);
    }


    public function isBigBag($itemId)
    {
        $sql = "
            SELECT IF(field1 = 397, 1, 0) AS value
            FROM depot_2 AS d2
            WHERE
                d2.id = " . (int) $itemId;

        return (int) $this->_db->fetchOne($sql);
    }


    /**
     * Возвращает данные о поступлениях товара
     * @param array $depotIds
     * @param int $claimId
     * @param int $productId
     * @return array
     * @throws Zend_Db_Statement_Exception
     */
    public function getProductAdmission(array $depotIds, int $claimId, int $productId)
    {
        $accessFields = [];

        if (App_Access::get('access', 'depot>access>showprice') > 0) {
            $accessFields[] = "ROUND(dd.price, 2) AS price,";
            $accessFields[] = "ROUND(dd.franco, 2) AS franco,";
        }

        if (App_Access::get('access', 'depot>access>baseprice') > 0) {
            $accessFields[] = "
                (
                    SELECT bpcp.value FROM base_prices_claim_products AS bpcp
                    WHERE
                        bpcp.claim_id = dd.claim_id AND
                        bpcp.product_id = dd.item_id AND
                        bpcp.bp_type = 1 AND
                        bpcp.confirmed = 1
                    ORDER BY updated_at DESC
                    LIMIT 1
                ) AS basePriceValue,
            ";
        }

        if (App_Access::get('access', 'depot>access>baseprice_in') > 0) {
            $accessFields[] = "
                (
                    SELECT bpcp.value FROM base_prices_claim_products AS bpcp
                    WHERE
                        bpcp.claim_id = dd.claim_id AND
                        bpcp.product_id = dd.item_id AND
                        bpcp.bp_type = 2 AND
                        bpcp.confirmed = 1
                    ORDER BY updated_at DESC
                    LIMIT 1
                ) AS basePriceInValue,
            ";
        }

        if (\App\ShippingContainer\Repository::find()->count() > 0) {
            $accessFields[] = "
                c.early_booking_container_number,
            ";
        }

        $rawClaims = [
            App_Constant_Table_ClaimTypePair::TYPE_INRAW,
            App_Constant_Table_ClaimTypePair::TYPE_RETURNOUTRAW,
        ];

        $sql = "
            SELECT
                dd.item_id AS product_id,
                -- Все что есть в dd, минус блокировки по другим заявка, плюс блокировки по текущей заявке
                dd.amount - SUM(IFNULL(b.amount, 0)) + IFNULL(cb.amount, 0) AS available_amount,
                dd.boxes - SUM(IFNULL(b.boxes, 0)) + IFNULL(cb.boxes, 0) AS available_boxes,

                dd.amount AS amount,
                dd.boxes AS boxes,
                dd.placing AS placing,

                c.id AS claim_id,
                c.url AS claim_url,
                c.full_id AS claim_full_id,
                FROM_UNIXTIME(c.date, '%d.%m.%Y') AS claim_date,

                " . join(" ", $accessFields) . "

                dl.title AS depot_title
            FROM depot_detailed AS dd
            INNER JOIN claims AS c
            ON
                c.id = dd.claim_id
            -- Активные блокировки по другим заявкам
            LEFT JOIN blocks AS b
            ON
                b.detailed_id = dd.id AND
                b.claim_id <> {$claimId} AND
                b.state <> 0
            -- Блокировки по текущей заявке
            LEFT JOIN blocks AS cb
            ON
                b.detailed_id = dd.id AND
                b.claim_id = {$claimId}
            LEFT JOIN depot_list AS dl
            ON
                dl.id = dd.depot_id
            WHERE
                dd.item_id = {$productId} AND
                dd.depot_id IN (" . join(',', $depotIds) . ") AND
                dd.amount > 0 AND
                (
                    c.claim_status = 0 OR
                    c.type_id IN (" . join(",", $rawClaims) . ")
                )
            GROUP BY
                dd.id
        ";

        return App_Db::get()->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC);
    }


    /**
     * Возвращает информацию по товару
     * @param array $depotIds
     * @param int $claimId
     * @param int $productId
     * @return mixed
     * @throws Zend_Db_Statement_Exception
     */
    public function getProductData(array $depotIds, int $claimId, int $productId)
    {
        $sql = "
            SELECT
                {DEPOT_CONFIG_FIELDS},
                SUM(IFNULL(cb.amount, 0)) AS claimAmount,
                SUM(IFNULL(cb.boxes, 0)) AS claimBoxes
            FROM " . App_Depot_Handlers_Wrapper::getInstance()->getDepotAndDepot2DataQuery($depotIds) . "
            {DEPOT_CONFIG_TABLE}
            LEFT JOIN blocks AS cb
            ON
                cb.item_id = d.id AND
                cb.claim_id = {$claimId}
            WHERE
                d.id = {$productId}
            GROUP BY
                d.id
        ";

        App_Depot_Handlers_Wrapper::getInstance()->applyDepotConfigFieldsResult($sql, $depotIds);

        return App_Db::get()->query($sql)->fetch(Zend_Db::FETCH_ASSOC);
    }


    /**
     * Возвращает качественный параметры товара, и количественные без учета блокировок, работает по одному складу.
     * Используется для отображения свойств товара.
     * Если требуется больше данных необходимо использовать self::getProductData
     * @param int $productId
     * @param array|null $requiredFields
     * @param int $depotId
     * @return mixed
     * @throws Exception
     */
    public function getProductDataLite(int $productId, array $requiredFields = null, int $depotId = 2)
    {
        $sql = "
            SELECT
                {DEPOT_CONFIG_FIELDS}
            FROM depot_2 AS d
            INNER JOIN depot_2_data AS d2d ON
                d2d.item_id = d.id AND
                d2d.depot_id = " . $depotId . "
            {DEPOT_CONFIG_TABLE}
            WHERE
                d.id = " . $productId . "
            GROUP BY
                d.id
        ";

        // Полностью убираются additionalFields
        $_additionalFields = App_Depot_Handlers_Wrapper::getInstance()->additionalFields;
        App_Depot_Handlers_Wrapper::getInstance()->additionalFields = [];
        // Переопределяются requiredFields (если переданы)
        if (!is_null($requiredFields)) {
            $_requiredFields = App_Depot_Handlers_Wrapper::getInstance()->requiredFields;
            App_Depot_Handlers_Wrapper::getInstance()->requiredFields = $requiredFields;
        }

        App_Depot_Handlers_Wrapper::getInstance()->applyDepotConfigFieldsResult($sql, [$depotId]);

        // Возращение в исходное состояние additionalFields
        App_Depot_Handlers_Wrapper::getInstance()->additionalFields = $_additionalFields;
        // Возращение в исходное состояние requiredFields
        if (isset($_requiredFields)) {
            App_Depot_Handlers_Wrapper::getInstance()->requiredFields = $_requiredFields;
        }

        return App_Db::get()->query($sql)->fetch(Zend_Db::FETCH_ASSOC);
    }


    /**
     * Возвращает новое название для склада
     * @return string
     */
    public function getNextDepotName()
    {
        $sql = "
            SELECT table_name 
            FROM information_schema.tables
            WHERE
                table_schema = SCHEMA()  AND
                table_name REGEXP '^depot_[0-9]{1,}$'
            ORDER BY
                table_name DESC
            LIMIT
                1
        ";

        $currentLastTable = App_Db::get()->fetchOne($sql);

        return 'depot_' . (str_replace('depot_', '', $currentLastTable) + 1);
    }


    /**
     * Очищает количественные показатели склада
     * @param $newTableName
     * @return bool
     */
    public function emptyDepot($newTableName)
    {
        $sql = "
            UPDATE " . $newTableName . " AS d2
            SET
                field10 = IF(field15 = 1, field10, 0),
                field11 = 0,
                field12 = 0,
                field14 = 0
        ";

        return App_Db::get()->prepare($sql)->execute();
    }


    /**
     * Создает полную копию таблицы
     * @param $newTableName
     * @return void
     */
    public function duplicateTable($newTableName)
    {
        parent::duplicateTable($newTableName);

        $sql = "
            ALTER TABLE {$newTableName} ADD PRIMARY KEY (id);
        ";

        $this->getAdapter()->query($sql);

        $sql = "
            ALTER TABLE {$newTableName} MODIFY id int(11) NOT NULL AUTO_INCREMENT 
        ";

        $this->getAdapter()->query($sql);
    }


    /**
     * Возвращает ID товаров доступных пользователю
     * Если нет ограничейни вернется пустой массив
     * Если нет доступных товаров вернется массив [-1]
     * В остальных случаях вернется массив с ID
     * @return array
     */
    public function getAllowedProductIds()
    {
        $whereConditions = App_Depot_Handlers_WhereConditions_FieldAccessRules::getInstance(['enabledForModule' => 1]);

        $conditions = $whereConditions->prepareStatement()->getStatement();

        if (!$conditions) {
            return [];
        }

        $ids = $this
            ->getAdapter()
            ->fetchCol("SELECT id FROM depot_2 AS d WHERE " . join(" AND ", $conditions));

        // Не видит ниодин товар
        if (!$ids) {
            $ids = [-1];
        }

        return $ids;
    }

    /**
     * Получение свойств товара
     *
     * @param int $id
     * @return array
     */
    public function getItemProperties(int $id)
    {
        $sql = "
            SELECT
                df1.text as field1,
                df2.text as field2,
                df3.text as field3,
                df4.text as field4,
                df5.text as field5,
                df6.text as field6,
                df7.text as field7
            FROM depot_2 d2
            LEFT JOIN depot_2_fields AS df1
            ON df1.fieldId = 1 AND df1.id = d2.field1
            LEFT JOIN depot_2_fields AS df2
            ON df2.fieldId = 2 AND df2.id = d2.field2
            LEFT JOIN depot_2_fields AS df3
            ON df3.fieldId = 3 AND df3.id = d2.field3
            LEFT JOIN depot_2_fields AS df4
            ON df4.fieldId = 4 AND df4.id = d2.field4
            LEFT JOIN depot_2_fields AS df5
            ON df5.fieldId = 5 AND df5.id = d2.field5
            LEFT JOIN depot_2_fields AS df6
            ON df6.fieldId = 6 AND df6.id = d2.field6
            LEFT JOIN depot_2_fields AS df7
            ON df7.fieldId = 1 AND df7.id = d2.field7
            WHERE d2.id = {$id}
        ";

        return $this->_db->fetchRow($sql, Zend_DB::FETCH_ASSOC);
    }
}
