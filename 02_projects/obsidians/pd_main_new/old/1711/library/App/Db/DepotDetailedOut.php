<?php


/**
 * Таблица склад подробности вес отгрузка
 * сохранение веса для каждой секции
 * для роликов
 */

class App_Db_DepotDetailedOut extends App_Db_Abstract
{

    /**
     * Название таблицы
     * @var string
     */
    protected $_name = 'depot_detailed_out';

    /**
     * Первичный ключ
     * @var int
     */
    protected $_primary = 'id';


    /**
     * Получить объект таблицы
     * @return App_Db_DepotDetailedOut
     */
    public static function obtain()
    {
        return App_Db::get(DB_DEPOT_DETAILED_OUT);
    }


    /**
     * Получение данных о товаре по заявке
     * @param Integer $claimId
     * @param Integer $itemId
     * @return Array
     */
    public function getItemInfo($claimId, $itemId)
    {
        //var_dump($claimId,);
        $select = $this->_db->select();
        $select->from($this->_name)
                   ->where('claim_id = ?', $claimId)
                   ->where('item_id = ?', $itemId);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll(Zend_Db::FETCH_ASSOC);
        return $result;
    }


    /**
     * Получение данных о весе товара
     * в секции
     * @param Integer $claimId
     * @param Integer $itemId
     * @param Integer $detailedId
     * @return Float
     */
    public function getAmountInfo($claimId, $itemId, $detailedId)
    {
        $select = $this->_db->select();
        $select->from($this->_name, array('amount'))
               ->where('claim_id = ?', $claimId)
               ->where('item_id = ?', $itemId)
               ->where('detailed_id = ?', $detailedId);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetch(Zend_Db::FETCH_COLUMN);
        return $result;
    }


    /**
     * Получение данных о товаре по заявке
     * включая номер секции
     * @param Integer $claimId
     * @param Integer $itemId
     * @return Array
     */
    public function getItemSectionInfo($claimId, $itemId)
    {
        //var_dump($claimId,);
        $select = $this->_db->select();
        $select->from(array('a' => $this->_name))
                ->join(array('b' => 'depot_detailed'), 'a.detailed_id = b.id', array('placing', 'in_claim_id' => 'b.claim_id'))
                ->where('a.claim_id = ?', $claimId)
                ->where('a.item_id = ?', $itemId);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll(Zend_Db::FETCH_ASSOC);
        return $result;
    }


    /**
     * проверка на существование записи
     * @param integer $claimId
     * @param integer $detailedId
     * @return object|false
     */
    public function recordExists($claimId, $detailedId)
    {
        $select = $this->select()
                        ->where('claim_id = ?', $claimId)
                        ->where('detailed_id = ?', $detailedId);
        $stmt = $this->_db->query($select);
        $result = $stmt->fetch(Zend_Db::FETCH_OBJ);
        return $result?(object)$result:false;
    }


    /**
     * Обновляет записи в DB_DEPOT_DETAILED_OUT для заявки (только весовой товар)
     * @param $claimId
     * @return bool
     * @throws Exception
     */
    public function resetByBlocks($claimId)
    {
        if (!is_numeric($claimId) || $claimId < 1) {
            throw new \Exception('Необходимо передать ID заявки!');
        }

        // Удалить текущую детализацию по отгрузке
        App_Db_DepotDetailedOut::obtain()->delete(array('claim_id = ?' => $claimId));

        $depotIndex = App_Db_Claims::obtain()->getRowField('depot_index', ['id = ?' => $claimId]);
        $depotName = 'depot_' . $depotIndex;

        $sql= "
            INSERT INTO
                " . DB_DEPOT_DETAILED_OUT . " (claim_id, detailed_id, item_id, amount)
            SELECT
                b.claim_id,
                b.detailed_id,
                b.item_id,
                b.amount
            FROM " . DB_BLOCKS . " b
            LEFT JOIN " . $depotName . " d
            ON
                d.id = b.item_id
            WHERE
                b.claim_id = " . $claimId . " AND
                d.field15 = " . App_Constant_Depot_ItemTypes::TYPE_WEIGHT;

        return App_Db::get()->prepare($sql)->execute();
    }

    /**
     * Получение веса по нескольким товарам
     * @param array $data - массив данных вида:<br/>
     * <pre>
     * array(
     *  0 => array(
     *      'claim_id' => 0,
     *      'detailed_id' => 0,
     *      'product_id' => 0
     *  )
     * )</pre>
     * @return array 
     */
    public function getAmountInfoMany(array $data)
    {
        $claims = array_map(function ($element) {
            return $element['claim_id'];
        }, $data);

        $items = array_map(function ($element) {
            return $element['item_id'];
        }, $data);

        $detailed = array_map(function ($element) {
            return $element['detailed_id'];
        }, $data);

        $sql = "
            SELECT ddo1.*
            FROM depot_detailed_out AS ddo1
            INNER JOIN depot_detailed_out AS ddo2
            ON ddo1.`claim_id` = ddo2.`claim_id`
                AND ddo1.item_id = ddo2.`item_id`
                AND ddo1.`detailed_id` = ddo2.`detailed_id`
            INNER JOIN depot_detailed_out AS ddo3
            ON ddo2.`claim_id` = ddo3.`claim_id`
                AND ddo2.`item_id` = ddo3.`item_id`
                AND ddo2.`detailed_id` = ddo3.`detailed_id`
            WHERE ddo1.claim_id IN (" . implode(", ", $claims) . ")
                AND ddo2.`item_id` IN (" . implode(", ", $items) . ")
                AND ddo3.`detailed_id` IN (" . implode(", ", $detailed) . ")
        ";
        $rows = $this->_db->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC);

        $result = array();
        foreach ($rows as $row) {
            $result[$row['claim_id'] . '-' . $row['detailed_id'] . '-' . $row['item_id']] = (float) $row['amount'];
        }

        return $result;
    }
}
