<?php
/**
 * Класс для отправки запросов на сервис "синхронизация"
 * {Template_Description_Abstract}
 *
 * @author Kononov Vladimir
 * @date 19.07.2016
 * @copyright {Template_Description_Copyrights}
 */
class App_Network_Service_Synchronize_Sender extends App_Network_Sender_Abstract
{

    protected $_module = 'synchronize';

    protected function _initSender()
    {
        $this->_resultHandler->setServiceName('Синхронизация данных');
    }

    /**
     * Метод для синхронизации
     * @param array $data - данные для синхронизации
     * @param array $files - файлы, которые нужно синхронизировать
     * @return boolean
     */
    public function synchronize(array $data, array $files = array())
    {
        var_dump('$data');
        var_dump($data);
        if (empty($data)) {
            return true;
        }

        $this->setAction('synchronize');

        $this->setData(array(
            'data' => $data,
        ));

        if (count($files) !== 0) {
            $this->setFiles($files);
        }

//        return $this->send();
    }

    /**
     * получение подготовленных данных с главного проекта
     * @param string $dataType
     * @param array $pkValue
     * @return mixed
     * @throws App_Network_Sender_Exception
     */
    public function getActualData(string $dataType, array $pkValue = [])
    {
        if (!App_Project_Repository::getInstance()->getCurrentProject()->isSubsidiaryProject()) {
            throw new \RuntimeException('Может выполняться только на дочернем проекте');
        }
        $this->setProjectId(App_Project_Link::getInstance()->getMainProject(App_Project_Repository::getInstance()->getCurrentProject())->getId());
        $this->setData([
            'dataType' => $dataType,
            'pkValue' => $pkValue
        ]);
        $this->setAction('getActualData');

        return $this->_resultHandler->handle();
    }
}
