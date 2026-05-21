<?php

/**
 * Получатель запросов сервиса "Копирование склада"
 *
 * @author IvanPak
 * @date 25.08.2018
 * @copyright {Template_Description_Copyrights}
 */
class App_Network_Service_DepotCopy_Reciever extends App_Network_Reciever_Abstract
{
    /**
     * Копирование склада
     * @return bool
     * @throws Exception
     */
    public function copy()
    {
        $data = $this->getData();

        /** @var App_Depot_Handlers_Entity_DepotList|bool $depotModel */
        $depotModel = !empty($data['depotModel']) ? unserialize($data['depotModel']) : false;

//        echo "<pre>" . print_r('$depotModel', true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($depotModel, true); echo "</pre>"; // FrolovDEBUG
//        exit();
        if (!($depotModel instanceof App_Depot_Handlers_Entity_DepotList)) {
            throw new \Exception('Для создания копии необходимо передать, модель склада!');
        }
//        echo "<pre>" . print_r($this->getProjectId(), true); echo "</pre>"; // FrolovDEBUG
//        exit();;

        $depotModel->type_id = 0;
        $depotModel->client_id = null;

        App_Db::get()->beginTransaction();

        $depotModel->save();

        App_Db::get()->commit();

        return true;
    }


    /**
     * Валидация состояния склада
     * @return array
     * @throws Zend_Application_Exception
     */
    public function validateState()
    {
        $validator = new App_Depot_Handlers_Validator_State();
        $validator->validate();

        return ['validator' => serialize($validator)];
    }


    /**
     * Создание/обновление товара
     * @return bool
     */
    public function copyProduct()
    {
        $data = $this->getData();

        if (!($formData = $data['formData'] ?? [])) {
            throw new \Exception('Не переданы данные формы!');
        }

        Zend_Registry::set('network_user_id', App_Db_Users::obtain()->getRow(array('login = ?' => 'system'), Zend_Db::FETCH_OBJ)->id);

        // Базовые поумолчанию для текущего проекта
        $defaultBasePriceGroups = App_Db_BasePricesGroups::obtain()->getDefaultGroups();

        $formData['basePriceGroup'] = $defaultBasePriceGroups[1];
        $formData['basePriceInGroup'] = $defaultBasePriceGroups[2];

        $depotWrapper = new App_Depot_Wrapper(2);
        $depotWrapper->savefield($formData);

        return true;
    }
}
