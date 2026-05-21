<?php

/**
 *Cascade Adapter
 *Общий интерфейс для всех адаптеров каскадера
 *
 */


abstract class App_Cascade_Adapter_Abstract
{

    /**
     *Id типа каскада
     *@var Integer $cascade
     */
    protected $_cascade;

    /**
     *Id объекта для которого
     *@var Integer
     */
    protected $_objectId;

    /**
     *Detector
     *@var App_Logger_Detector_Abstract
     */
    protected $_detector = null;

    /**
     *Detector namespace
     *@var String
     */
    protected $_detectorNamespace = 'App_Cascade_Detector';

    /**
     *Detector Name
     *@var String
     */
    protected $_detectorName = null;

    /**
     *Translator
     *@var App_Logger_Translator_Interface
     */
    protected $_translator = null;

    /**
     *Translator namespace
     *@var String
     */
    protected $_translatorNamespace = 'App_Cascade_Translator';

    /**
     *Translator Name
     *@var String
     */
    protected $_translatorName = null;

    /**
     *Флаг логировать событие или нет
     *@var Boolean
     */
    protected $_doLogFlag = false;

    /**
     *@var Zend_Log
     */
    protected $_logger = null;

    /**
     * Флаг удаления заявки
     * @var bool
     */
    protected $_deleteFlag = false;


    /**
     *Constructor
     *
     *@param Integer $event - id события
     *@param mixed $oldObject  Object || Array объект или массив со старыми значениями(было)
     *@param mixed $newObject  Object || Array объект или массив с новыми значениями(стало)
     *@return void
     */
    public function __construct($event, $oldObject = null, $newObject = null)
    {
        $this->_event = $event;

        if(!is_null($oldObject)) {
            $this->_getDetector()->setOld($oldObject);
        }
        if(!is_null($newObject)) {
            $this->_getDetector()->setNew($newObject);
        }
        //$this->_setTranslator();
    }


    /**
    *Set objectId
    *@param Integer $objectId - id объекта
    */
    public function setObjectId($objectId)
    {
        $this->_objectId = $objectId;
    }

    /**
     *Get detector object
     *@return App_Cascade_Detector_Abstract
     */
    protected function _getDetector()
    {
        if(null === $this->_detector) {
            $this->_setDetector();
        }
        return $this->_detector;
    }


    /**
     *Log event
     *
     */
    public function doCascade()
    {
        $detectorResult = $this->_detector->detect();
//        echo "<pre>" . print_r(unserialize($detectorResult->products['del']['1|16334']['companyEquipment']), true); echo "</pre>"; // FrolovDEBUG
////        echo "<pre>" . print_r(unserialize($detectorResult->products['add']['3|16334']['companyEquipment']), true); echo "</pre>"; // FrolovDEBUG


//        echo "<pre>" . print_r($detectorResult, true); echo "</pre>"; // FrolovDEBUG
//        exit();

        //Если есть изменения, или удаление заявки - показываем форму изменений
        if (false !== $detectorResult || $this->_deleteFlag) {
?>
            <div class="centered-block text-align_center">
                <form action="" method="post" id="cascadeForm">
                    <input type="hidden" name="accept" value="0" id="cascadeAccept">
                    <br>
                    <?php $detectorResult && $this->_cascade($detectorResult); ?>
                </form>
            </div>
<?php
        }
    }


    /**
     *Запуск каскада
     *@return String
     */
    protected function _cascade($changeObject)
    {
        $updater      = new App_Cascade_Updater();
        $objectParser = new App_Cascade_ObjectParser($updater);
        $objectParser->setParams(array(
            'config'     => $this->_getDetector()->getConfig(),
            'oldObject'  => $this->_getDetector()->getOldObject(),
            'newObject'  => $this->_getDetector()->getNewObject(),
            'objectType' => $this->_getModuleType())
        );
        $objectParser->parse($changeObject);
        $updater->notify();
    }


    /**
     *Установка параметра объекта было
     *@param Object || Array
     *@return void
     */
    public function setOldObject($oldObject)
    {
        $this->_getDetector()->setOld($oldObject);
    }


    /**
     *Установка параметра объекта стало
     *@param Object || Array
     *@return void
     */
    public function setNewObject($newObject)
    {
        $this->_getDetector()->setNew($newObject);
    }


    /**
     *Set detector object
     @return void
     */
    protected function _setDetector()
    {
        $this->_setDetectorName();

        $detectorClassName = $this->_detectorNamespace . '_';
        $detectorClassName .= str_replace(' ', '_', ucwords(str_replace('_', ' ', strtolower($this->_detectorName))));

        if(!class_exists($detectorClassName)) {
            Zend_Loader::loadClass($detectorClassName);
        }

        $this->_detector = new $detectorClassName($this);

        if(! $this->_detector instanceof App_Cascade_Detector_Abstract) {
            throw new Exception("Detector class '{$detectorClassName}' dos not extend App_Cascade_Detector_Abstract");
        }
    }


    /**
     *Set detector name
     *@return void
     */
    protected function _setDetectorName()
    {}


    /**
     *Return depot_id
     *@return Integer
     */
    abstract protected function _getDepotId();


    /**
     *Return module type id
     *@return Integer
     */
    protected function _getModuleType()
    {}

    /**
     * Возращает различия старой и новой модели
     * @return array
     */
    public function getDifferences()
    {
        $detectorResult = $this->_detector->detect();

        if((false !== $detectorResult) and (array_key_exists("products", $detectorResult))) {
            $result = array();
            // выбираем значения number и item_id из массива различий в старой и новой модели
            foreach ($detectorResult->products AS $row){
                foreach ($row AS $key => $element){
                    $item = new stdClass();

                    $explodeRow = explode("|", $key);
                    $item->number = $explodeRow[0];
                    $item->item_id = $explodeRow[1];

                    $result[] = $item;
                }
            }
            return $result;
        }
    }

    /**
     * Удалить заявку
     *
     * @return $this
     */
    public function deleteClaim(): self
    {
        $this->_deleteFlag = true;
        return $this;
    }

}
