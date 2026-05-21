<?php

use App_Filter_Component_Behaviour_AbstractBehaviour as Behaviour;

class App_Filter_Component_Behaviour_Result extends Behaviour
{

    /**
     * Пост-процесс результата
     * @var Closure[]
     */
    protected $_postProcessCallbacks = array();

    /**
     * Возвращает результат
     * @throws Exception
     * @return array
     */
    public function fetch()
    {
        $filter = $this->getFilter();

        $postData = $this->getPostData();
        $config = $filter->getConfig();
        $masks = $filter->getMask();
        $inalias = $filter->getInAlias();

        $data = $postData["data"];
        $wheres = array();
        $wheresin = array();

        if (is_array($data) && count($data)) {
            foreach ($data as $fieldName => $value) {
                if ($value['sql']) {
                    $whereExpr = trim($masks->getByFieldName($fieldName)->getWhereExpression($config->getByFieldName($fieldName), $value['sql']));

                    if ($whereExpr && strlen($whereExpr)) {
                        if (isset($inalias[$fieldName])) {
                            $wheresin[] = str_replace($fieldName, $inalias[$fieldName], $whereExpr);
                        } else {
                            $wheres[] = $whereExpr;
                        }
                    }
                }
            }
        }

        $sqlFormatter = clone $filter->getSqlFormatter();
        $sqlFormatter->getWhereConditions()->applyFromArray($wheres);
        $sqlFormatter->getWhereConditionsInner()->applyFromArray($wheresin);
        $sqlFormatter->getLimitExpression()->setLimit(max(0, $postData['from']), max(0, $postData['perPage']));

        if ($postData['column']) {
            $sqlFormatter->getOrderExpression()->add($postData['column'], strtoupper($postData['sort']));
        }

        $sqlQueryForResult = $sqlFormatter->format('result', $filter->getResultSqlQuery());
//        echo "<pre>" . print_r('$sqlQueryForResult', true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($sqlQueryForResult, true); echo "</pre>"; // FrolovDEBUG
//        exit();
        $sqlQueryForCount  = $sqlFormatter->format('count', $filter->getResultSqlQuery());
        
        $sqlQueryCount = $filter->getResultCountSqlQuery();
        $sqlQueryCount = str_replace('{RESULT}', $sqlQueryForCount, $sqlQueryCount);

        $sqlQuerySum = $filter->getResultSumSqlQuery();
//        echo "<pre>" . print_r('$sqlQuerySum', true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($sqlQuerySum, true); echo "</pre>"; // FrolovDEBUG
//        exit();

        /** @var $db Zend_Db_Adapter_Abstract */
        if (!is_null($this->_filter->getDbAdapter())) {
            $db = $this->_filter->getDbAdapter();
        } else {
            $db = App_Db::get();
        }

        $callbacks = $this->getPostProcessCallbacks();

        $result = $db->query($sqlQueryForResult)->fetchAll(Zend_Db::FETCH_OBJ);

//        echo "<pre>" . print_r('$result', true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($result, true); echo "</pre>"; // FrolovDEBUG
//        exit();

        // весь результат
        if ($filter->useTotalResult) {
            $totalResult = $db->query($sqlQueryForCount)->fetchAll(Zend_Db::FETCH_OBJ);
        }

        if (is_array($callbacks) && count($callbacks) > 0) {
            foreach ($callbacks as $callback) {
                if (!(is_callable($callback))) {
                    throw new \Exception("Invalid callback, expected Closure, got " . gettype($callback));
                }

                $callback($result);
            }
        }

        $sqlQueryCountResult = $db->query($sqlQueryCount)->fetchAll(Zend_Db::FETCH_COLUMN);
        
        return (object) array(
                    'result'        => $result,
                    'total'         => (int) isset($sqlQueryCountResult[0]) ? $sqlQueryCountResult[0] : 0,
                    'sum'           => $sqlQuerySum ? App_Db::get()->query($sqlFormatter->format('count', $filter->getResultSumSqlQuery()))->fetch() : 0,
                    'totalResult'   => !empty($totalResult) ? $totalResult: 0,
        );
    }

    /**
     * Получает POST-данные из $_POST
     * @return array
     */
    protected function _fetchPostData()
    {
        $postData = array();
        $postSourceData = $this->getSourcePostData();
        $requiredData = array(
            "data"      => array(),
            "page"      => 0,
            "perPage"   => $this->getFilter()->getRecordsPerPage(),
            "column"    => "id",
            "sort"      => "asc",
        );

        foreach ($requiredData as $key => $defaultValue) {
            if (array_key_exists($key, $postSourceData)) {
                $value = $postSourceData[$key];

                if (is_string($value)) {
                    $value = trim($value);
                }

                if (!($value) || !(is_string($value) && strlen($value))) {
                    $value = $defaultValue;
                }
            } else {
                $value = $defaultValue;
            }

            $postData[$key] = $value;
        }

        $postData['data'] = is_string($postData['data']) && (@unserialize($postData['data']) !== false) 
            ? unserialize($postData['data']) 
            : $postData['data'];
        $postData['from'] = $postData['page'] * $postData['perPage'];

        return $postData;
    }

    /**
     * Применить переданный коллбэк как пост-процесс результата
     * @param Closure $postProcessFunc
     */
    public function appendPostProcessCallback(Closure $postProcessFunc)
    {
        $this->_postProcessCallbacks[] = $postProcessFunc;
    }

    /**
     * Удаляет переданный коллбэк
     * @param callable $postProcessCallback
     */
    public function removePostProcessCallback(Closure $postProcessCallback)
    {
        $callbacks = $this->getPostProcessCallbacks();

        if (is_array($callbacks) && count($callbacks) > 0) {
            foreach ($callbacks as $position => $callback) {
                if ($callback == $postProcessCallback) {
                    unset($callbacks[$position]);
                }
            }
        }

        ksort($callbacks);
    }

    /**
     * Возвращает пост-процесс коллбэк либо NULL в случае его отсутствия
     * @return Closure|null
     */
    public function &getPostProcessCallbacks()
    {
        return $this->_postProcessCallbacks;
    }

}
