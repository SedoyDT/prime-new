<?php
/**
 * Контроллер сервисов
 * {Template_Description_Abstract}
 *
 * @author Kononov Vladimir
 * @date 28.06.2016
 * @copyright {Template_Description_Copyrights}
 */
class App_Network_Reciever_Controller
{

    /**
     * Название сервиса
     * @var string
     */
    protected $_module;

    /**
     * Действие, которое должен произвести сервис
     * @var string
     */
    protected $_action;

    /**
     * Массив данных для сервиса
     * @var array
     */
    protected $_data;

    /**
     * Массив файлов для сервиса
     * @var array
     */
    protected $_files;

    /**
     * Id проекта, с которого произведён запрос
     * @var int
     */
    protected $_projectId;

    /**
     * Возвращает значение свойства $_projectId
     * @return string
     */
    public function getProjectId()
    {
        return $this->_projectId;
    }

    /**
     * Установка значения свойства $_projectId
     * @param int - id проекта с которого пришёл запрос
     */
    public function setProjectId($projectId)
    {
        $this->_projectId = $projectId;
    }

    /**
     * Возвращает значение свойства $_module
     * @return string
     */
    public function getModule()
    {
        return $this->_module;
    }

    /**
     * Возвращает значение свойства $_action
     * @return string
     */
    public function getAction()
    {
        return $this->_action;
    }

    /**
     * Возвращает значение свойства $_data
     * @return array
     */
    public function getData()
    {
        return $this->_data;
    }

    /**
     * Возвращает значение свойства $_files
     * @return array
     */
    public function getFiles()
    {
        return $this->_files;
    }

    /**
     * Установка значения свойства $_module
     * @param string - название модуля
     */
    public function setModule($module)
    {
        $this->_module = $module;
    }

    /**
     * Установка значения свойства $_action
     * @param string - название действия
     */
    public function setAction($action)
    {
        $this->_action = $action;
    }

    /**
     * Установка значения свойства $_data
     * @param array - массив данных
     */
    public function setData($data)
    {
        $this->_data = $data;
    }

    /**
     * Установка значения свойства $_files
     * @param array - массив файлов
     */
    public function setFiles($files)
    {
        $this->_files = $files;
    }

    /**
     * Запуск сервиса
     * @return void
     */
    public function run()
    {
        $requestResult = new App_Network_Request_Result();

//        echo "<pre>" . print_r($requestResult, true); echo "</pre>"; // FrolovDEBUG
//        exit();
        echo "<pre>" . print_r('piiiidoor', true); echo "</pre>"; // FrolovDEBUG
        echo "<pre>" . print_r($this->getModule(), true); echo "</pre>"; // FrolovDEBUG
        exit();
        try {
            $reciever = App_Network_Reciever_Factory::create($this->getModule());

            $reciever->setProjectId($this->getProjectId());
            $reciever->setData($this->getData());
            $reciever->setFiles($this->getFiles());

            $result = $reciever->execute($this->getAction());

            if ($reciever->hasErrors()) {
                $requestResult->setSuccess(false);
                $requestResult->setErrors($reciever->getErrors());
            } else {
                $requestResult->setSuccess(true);
                $requestResult->setResult($result);
            }
        } catch (Exception $e) {
            $requestResult->setSuccess(false);
            $requestResult->setError($e->getCode(), "\n" . $e->getMessage() . (getenv('DEVELOPMENT') ? "\nTrace:\n" . $e->getTraceAsString() : ''));

            error_log("[App_Network ERROR] " . $e->getMessage());
            error_log("[App_Network ERROR TRACE] " . $e->getTraceAsString());
        }

        echo json_encode($requestResult->toArray(), JSON_FORCE_OBJECT);
    }
}
