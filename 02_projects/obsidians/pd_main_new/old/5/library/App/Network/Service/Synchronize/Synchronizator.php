<?php
/**
 * синхронизатор данных
 * {Template_Description_Abstract}
 * @author Vladimir Kononov
 * @date 09.06.2020
 * @copyright {Template_Description_Copyrights}
 */

namespace App\Network\Service\Synchronize;


class Synchronizator
{

    /**
     * список типов данных, которые не нужно синхронизировать
     * @var array
     */
    protected $_exceptionTypeList = [];

    /**
     * список данных, которые нужно синхронизировать
     * @var array
     */
    protected $_typeList = [];

    /**
     * кол-во синхронизируемых за раз типов
     * @var int
     */
    protected $_typeLimit = 10;

    /**
     * кол-во синхронизируемых за раз записей одного типа
     * @var int
     */
    protected $_limit = 10;

    /**
     * Synchronizator constructor.
     * @param array $_typelist
     * @param int $_limit
     * @param array $_exceptiontypelist
     * @param int $_typelimit
     */
    public function __construct(
        array $_typelist = [],
        int $_limit = 10,
        array $_exceptiontypelist = [],
        int $_typelimit = 10
    ) {
        $this->_exceptionTypeList = $_exceptiontypelist;
        $this->_typeList = $_typelist;
        $this->_typeLimit = $_typelimit;
        $this->_limit = $_limit;
    }

    public function synchronize(\Zend_Log $logger)
    {
        // получаем массив изменённых данных, сгрупированных по типу в размере 10 id на сущность
        // id не уникальны
        if (count($this->_typeList) > 0) {
            $data = \App_Db_SynchronizationChangedData::obtain()->getGroupedDataByType($this->_typeList, $this->_limit);
        } else {
            $data = \App_Db_SynchronizationChangedData::obtain()->getGroupedData($this->_typeLimit, $this->_limit);
        }

        $data = array_filter($data, function ($key) {
            return !in_array($key, $this->_exceptionTypeList);
        }, ARRAY_FILTER_USE_KEY);

        if (empty($data)) {
            return ;
        }

        $synchronizationProject = array();
        if (!is_null(\App_Config::get('synchronization'))) {
            $synchronizationProject = \App_Config::get('synchronization')->project;
        }

        foreach ($synchronizationProject as $projectCode) {
            $projectModel = \App_Project_Repository::getInstance()->getProjectByCode($projectCode);
            $logger->info('Working with project ' . $projectModel->getTitle());

            // подготовка данных, сборка в единый массив
            $logger->info('Preparing data');

            $dataToSend = array();
            $dataObjects = array();
            $filesToSend = array();

            foreach ($data as $table => $ids) {
                try {
                    $object = \App_Network_Service_Synchronize_Data_Factory::create($projectCode, $table);
                } catch (\App_Network_Service_Synchronize_Data_Exception_DataTypeNotFound $e) {
                    continue;
                }

                $object->setPkValues(array_unique(array_values($ids)));
                $dataToSend[$table] = $object->prepareData();
                $filesToSend[$table] = $object->prepareFiles();
                $dataObjects[$table] = $object;
                if (empty($dataToSend[$table]) && empty($filesToSend[$table])) {
                    unset($dataToSend[$table], $dataObjects[$table], $filesToSend[$table]);
                }
            }

            if (count($dataToSend) === 0) {
                continue;
            }

            $logger->info('Sending data');
            $sender = new \App_Network_Service_Synchronize_Sender();
//            echo "<pre>" . print_r($projectModel->getId(), true); echo "</pre>"; // FrolovDEBUG
//            exit();

            $sender->setProjectId($projectModel->getId());
            // отправка данных
            $sendResult = $sender->synchronize($dataToSend, $filesToSend);

//            echo "<pre>" . print_r('$sendResult', true); echo "</pre>"; // FrolovDEBUG
//            echo "<pre>" . print_r($sender->getRequestResult()->getErrors(), true); echo "</pre>"; // FrolovDEBUG
//            exit();
            // обработка результата
            $error = null;
            if (!$sendResult) {
                $error = 'Sender ' . ($projectModel->getFullUrl()) . ' error: ' . $sender->getErrors()['message'] . '. Wanted to send: ' . print_r($data, true);
            } else if ($sender->getRequestResult()->hasErrors() && $sender->getRequestResult()->isBadJSONError()) {
                $error = 'Service ' . ($projectModel->getFullUrl()) . ' returned abrakadabra: ' . $sender->getRequestResult()->getRawResult() . '. Wanted to send: ' . print_r($data, true);
            } else if ($sender->getRequestResult()->hasErrors()){
                $error = 'Service from ' . ($projectModel->getFullUrl()) . ' returned error: ' . implode(',', $sender->getRequestResult()->getErrors()) . '. Wanted to send: ' . print_r($data, true);
            }

//            echo "<pre>" . print_r('here', true); echo "</pre>"; // FrolovDEBUG
//            exit();
            if (!empty($error)) {
                throw new \RuntimeException($error);
            }

            $logger->info('Data synchronized');

            foreach ($dataObjects as $dataObject) {
                $dataObject->onSynchronizeEnd();
            }

            unset($dataToSend, $dataObjects, $filesToSend);
        }

        $logger->info('Deleting');
        foreach ($data as $table => $ids) {
            if (!empty($ids)) {
                \App_Db_SynchronizationChangedData::obtain()->delete(['id IN (?)' => array_keys($ids)]);
            }
            $logger->info('Data for ' . $table . ' deleted: ' . print_r($ids, true));
        }
    }
}
