<?php
/**
 * Абстрактный класс передатчика данных для сервиса
 * {Template_Description_Abstract}
 *
 * @author Kononov Vladimir
 * @date 28.06.2016
 * @copyright {Template_Description_Copyrights}
 */
class App_Network_Sender_Abstract
{

    /**
     * Url общей точки входа всех сервисов, куда посылать данные
     * @var string
     */
    private $_recieverUrl = '/network/recieve/';

    /**
     * Массив файлов, которые нужно посылать на удалённый сервис
     * @var array
     */
    protected $_files = array();

    /**
     * Ассоциативный массив данных, которые нужно посылать на удалённый сервис
     * @var array
     */
    protected $_data = array();

    /**
     * Название сервиса, обязательно
     * Если обработчик вашего сервиса находится в подпапке, то название модуля
     * должно быть через _
     * @var string
     */
    protected $_module = '';

    /**
     * Какое действие требуется от сервиса,
     * название публичного метода у класса сервиса
     * @var string
     */
    protected $_action = '';

    /**
     * Объект, содержащий ответ сервиса
     * @var App_Network_Request_Result
     */
    protected $_requestResult;

    /**
     * Код ответа сервиса
     * @var integer
     */
    protected $_requestCode;

    /**
     * Массив ошибок передатчика, cURL или HTTP(400, 500 и т.д.) ошибки
     * @var array
     */
    protected $_errors = array();

    /**
     * Массив описаний ошибок передатчика
     * @var array
     */
    protected static $_errorsDescriptions = array();

    /**
     * Массив описаний ошибок передатчика по-умолчанию
     * @var array
     */
    protected static $_defaultErrorsDescriptions = array(
        '1' => "Неподдерживаемый протокол",
        '2' => "Не удалось инициализировать CURL",
        '3' => "Неправильно сформирован URL сервиса",
        '6' => "Не удалось найти удалённый хост",
        '7' => "Нельзя подключиться к сервису",
        '28' => "Время ожидания сервиса истекло",
        '34' => "Неизвестная программная ошибка",
        '403' => "Подключение запрещено",
        '500' => "Внутренняя ошибка сервиса"
    );

    /**
     * Id проекта, к которому будет отправлен запрос
     * @var integer
     */
    protected $_projectId;

    /**
     * Флаг для определения, можно изменять проект или нет
     * @var boolean
     */
    private $_isProjectIdEditable = true;

    /**
     * Курл
     * @var resource
     */
    private $_curl;

    /**
     * обработчик результата
     * @var App_Network_Sender_ResultHandler
     */
    protected $_resultHandler;

    public function __construct()
    {
        $this->_resultHandler = new App_Network_Sender_ResultHandler($this);
        
        $this->_curl = $this->_initCurl();
        if ($this->_curl === false) {
            throw new App_Network_Sender_Exception("Не удалось ининциализировать cURL");
        }

        $this->_requestResult = new App_Network_Request_Result();
//        echo "<pre>" . print_r($this->_requestResult, true); echo "</pre>"; // FrolovDEBUG
//        exit();
        static::initErrorDescription();

        // убираем возможность выставлять id проекта, если в классе уже выставлен проект
        if ($this->getProjectId() > 0) {
            $this->_isProjectIdEditable = false;
        }

        $this->_initSender();
    }

    /**
     * Дополнительная инициализация отправщика
     * Происходит в самом конце конструктора
     */
    protected function _initSender()
    {
    }

    public function __destruct()
    {
        $this->curlClose();
    }

    public function curlClose(): void
    {
        if (is_resource($this->_curl)) {
            curl_close($this->_curl);
        }
    }

    /**
     * Метод возвращает дескриптор cURL
     * @return resource
     */
    protected function _initCurl()
    {
        $curl = curl_init();

        curl_setopt($curl, CURLOPT_HEADER, 0);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 60);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($curl, CURLOPT_POSTREDIR, 3);
        curl_setopt($curl, CURLOPT_MAXREDIRS, 2);

        return $curl;
    }

    /**
     * Метод для отправки данных на сервис
     * @return boolean
     * @throws App_Network_Sender_Exception
     */
    public function send()
    {
        $this->prepareCurl();

        $result = curl_exec($this->_curl);

//        echo "<pre>" . print_r($result, true); echo "</pre>"; // FrolovDEBUG
//        exit();
        return $this->handleCurlResult($result);
    }

    /**
     * подготовка curl обработчика
     * @return resource
     * @throws App_Network_Sender_Exception
     */
    public function prepareCurl()
    {
        if (!$this->getModule()) {
            throw new App_Network_Sender_Exception('У отправителя запросов не указан модуль');
        }

        if (!$this->getProjectId()) {
            throw new App_Network_Sender_Exception('Не указан проект');
        }

        if ($this->_getProject()->getUseSSL()) {
            curl_setopt($this->_curl, CURLOPT_SSL_VERIFYPEER, 0);
        }
//        echo "<pre>" . print_r($this->_buildQuery(), true); echo "</pre>"; // FrolovDEBUG
//        exit();
        curl_setopt($this->_curl, CURLOPT_URL, $this->_getUrl());
        curl_setopt($this->_curl, CURLOPT_POSTFIELDS, $this->_buildQuery());

        return $this->_curl;
    }

    /**
     * обработка результата работы curl
     * @param $result
     * @return bool
     */
    public function handleCurlResult($result): bool
    {
//
//        echo "<pre>" . print_r($this->getProjectId(), true); echo "</pre>"; // FrolovDEBUG
//        exit();
//
//        echo "<pre>" . print_r($result, true); echo "</pre>"; // FrolovDEBUG
//        exit();

        $this->_requestCode = curl_getinfo($this->_curl, CURLINFO_HTTP_CODE);

        // curl не смог выполнить запрос
        if ($result === false) {
            $this->_errors = [
                'code' => curl_errno($this->_curl),
                'message' => $this->getErrorDescription(curl_errno($this->_curl), curl_error($this->_curl))
            ];
        }
        // запрос выполнен успешно
        else if ($this->_requestCode == 200) {
            $this->_processResult($result);
        }
        // при работе сервиса возникла ошибка, на другом сервере
        else {
            $this->_errors = [
                'code' => $this->_requestCode,
                'message' => $this->getErrorDescription($this->_requestCode, 'Ошибка сервиса')
            ];
            $result = false;
        }

        return $result;
    }

    /**
     * Выпремление массива данных для cURL, превращение многомерного массива в одномерный
     * array('a' => array('1' => 0)) => array('a[1]' => 0)
     * @return array
     */
    protected function _buildQuery()
    {
        // обязательные для отправки данные
        $data = array(
            'project_id' => App_Project_Repository::getInstance()->getCurrentProject()->getId(),
            'module' => $this->getModule(),
            'action' => $this->getAction(),
        );

        // преобразование многомерного массива в одномерный
        if (!empty($this->_data)) {
            $simplifiedData = self::_simplifyArray(array('data' => $this->getData()));
            $data = array_merge($data, $simplifiedData);
//            echo "<pre>" . print_r('$data', true); echo "</pre>"; // FrolovDEBUG
//            echo "<pre>" . print_r($data, true); echo "</pre>"; // FrolovDEBUG
//            exit();
        }

        if (!empty($this->_files)) {
            $filesToSend = array('files' => $this->_files);

            $simplifiedFiles = array();
            $flattenedArray = array_filter(self::_simplifyArray($filesToSend));

            foreach ($flattenedArray as $key => $value) {
                if (!($value instanceof CURLFile)) {
                    $simplifiedFiles[$key] = new CURLFile($value);
                } else {
                    $simplifiedFiles[$key] = $value;
                }
            }

            $data = array_merge($data, $simplifiedFiles);
        }

        return $data;
    }

    /**
     * Метод возвращает значение свойства $_projectId
     * @return integer
     */
    public function getProjectId()
    {
        return $this->_projectId;
    }

    /**
     * Метод получает значение свойства $_projectId
     * @param int $projectId - id проекта
     * @return $this
     */
    public function setProjectId($projectId)
    {
        if ($this->_isProjectIdEditable) {
            $this->_projectId = $projectId;
        }
        return $this;
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
     * Возвращает значение свойства $_data
     * @return array
     */
    final public function getData()
    {
        return $this->_data;
    }

    /**
     * Возвращает значение свойства $_module
     * @return string
     */
    final public function getModule()
    {
        return $this->_module;
    }

    /**
     * Устанавливает название модуля
     * @param string $module
     */
    final public function setModule($module)
    {
        $this->_module = $module;
    }

    /**
     * Возвращает значение свойства $_action
     * @return string
     */
    final public function getAction()
    {
        return $this->_action;
    }

    /**
     * Установка значения свойства $_files
     * @return void
     */
    public function setFiles($files)
    {
        $this->_files = $files;
    }

    /**
     * Установка значения свойства $_data
     * @return void
     */
    public function setData($data)
    {
        $this->_data = $data;
    }

    /**
     * Установка значения свойства $_action
     * @return void
     */
    public function setAction($action)
    {
        $this->_action = $action;
    }

    /**
     * Метод для формирования url, на который нужно посылать данные
     * @return string
     */
    protected function _getUrl()
    {
        return $this->_getHost() . $this->_recieverUrl;
    }

    /**
     * Метод для обработки ответа сервиса
     * @param string $result - данные в формате JSON
     * @return void
     */
    protected function _processResult($result)
    {
        $jsonResult = json_decode($result, true);
        $this->_requestResult->setRawResult($result);
        if (!is_null($jsonResult)) {
            $this->_requestResult->setSuccess($jsonResult['success']);
            $this->_requestResult->setDecodedResult($jsonResult['result']);
            $this->_requestResult->setErrors($jsonResult['errors']);
        } else {
            $this->_requestResult->setSuccess(false);
            $this->_requestResult->setResult(array());
            $this->_requestResult->setErrors(array(
                'BAD_JSON' => 'Невозможно понять ответ сервера'
            ));
        }
    }

    /**
     * Метод для получения ошибок передатчика
     * @return array
     */
    final public function getErrors()
    {
        return $this->_errors;
    }

    /**
     * Метод для получения объекта ответа сервиса
     * @return App_Network_Request_Result
     */
    final public function getRequestResult()
    {
        return $this->_requestResult;
    }

    /**
     * инициализация описаний ошибок
     * @return void
     */
    public static function initErrorDescription()
    {
        self::$_errorsDescriptions = self::$_errorsDescriptions + self::$_defaultErrorsDescriptions;
    }

    /**
     * Метод для получения описания ошибки по её коду
     * @param mixed $code - строка или число, код ошибки
     * @param string $defaultMessage - сообщение по-умолчанию
     * @return string
     */
    final public static function getErrorDescription($code, $defaultMessage = '')
    {
//        echo "<pre>" . print_r($code, true); echo "</pre>"; // FrolovDEBUG
//        exit();
        if (array_key_exists((string) $code, self::$_errorsDescriptions)) {
            return self::$_errorsDescriptions[$code];
        }

        return $defaultMessage;
    }

    /**
     * Метод для определения домена, на который уйдёт запрос
     * @return string
     */
    final protected function _getHost()
    {
        return ($this->_getProject()->getUseSSL() ? 'https://' : 'http://') . $this->_getProject()->getHost();
    }

    /**
     * Метод для перевода многомерного массива в одномерный
     * @param array $array
     * @return array
     */
    protected static function _simplifyArray(array $array)
    {
        $result = $array;
        $tmp = array();
        $stop = false;
        while (true && !$stop) {
            $stop = true;
            foreach ($result as $key => $value) {
                if ($value instanceof JsonSerializable) {
                    $tmp[$key] = json_encode($value);
                } else if (is_object($value) && !($value instanceof CURLFile)) {
                    $tmp[$key] = serialize($value);
                } else if (is_array($value)) {
                    $stop = false;
                    foreach ($value as $subKey => $subValue) {
                        $tmp[$key . '[' . $subKey . ']'] = $subValue;
                    }
                } else {
                    $tmp[$key] = $value;
                }
            }

            $result = $tmp;
            $tmp = array();
        }

        return $result;
    }

    /**
     * Возвращает модель проекта
     * @return App_Project_Model
     */
    private function _getProject()
    {
        return App_Project_Repository::getInstance()->getProject($this->getProjectId());
    }


    /**
     * @param $sendResult
     * @return $this
     * @throws Exception
     */
    protected function checkResult($sendResult): self
    {
        if (!$sendResult) {
            $errors = $this->getErrors();
            throw new Exception(sprintf(
                'Ошибка связи с сервисом "%s": %s',
                static::class,
                $errors['message']
            ));
        } else if ($this->getRequestResult()->isBadJSONError()) {
            throw new Exception(sprintf(
                'Ошибка сервиса "%s": Нераспознаваемый ответ, %s',
                static::class,
                $this->getRequestResult()->getRawResult()
            ));
        } else if ($this->getRequestResult()->hasErrors()) {
            throw new Exception(sprintf(
                'Ошибка сервиса "%s": %s',
                static::class,
                implode(', ', $this->getRequestResult()->getErrors())
            ));
        }

        return $this;
    }
}
