<?php

/**
 * Модель заявки на отгрузку
 * {Template_Description_Abstract}
 *
 * @author Kononov Vladimir<vofchek@gmail.com>
 * @date 19.04.2017
 * @copyright {Template_Description_Copyrights}
 */

use App\Claim\LinkedClaim\PaymentStrategy\Out\PaymentStrategyFactory;

class App_Claim_LinkedClaim_Type_MainOut_DomainModel extends App_Claim_LinkedClaim_Type_AbstractOut
{


    /**
     * id менеджера
     * @var integer
     */
    protected static $_managerId;

    /**
     * id клиента
     * @var array
     */
    protected static $_clientId = [];

    /**
     * Получение id менеджера
     * @return integer
     */
    public static function getManagerId()
    {
        if (is_null(self::$_managerId)) {
            $optionValues = App_Db_Options::obtain()->getOptions(array('linked_claim_main_manager'));
            self::$_managerId = (int) $optionValues['linked_claim_main_manager']->value;
        }

        return self::$_managerId;
    }

    /**
     * Получение id клиента
     * @param int $projectId - id дочернего проекта для которого создаётся заявка
     * @return integer
     */
    public static function getClientId(int $projectId)
    {
        if (!array_key_exists($projectId, self::$_clientId)) {
            self::$_clientId[$projectId] = App_Db_ClaimLinkedSubsidiaryClient::obtain()->getClientByProject($projectId);
            if (empty(self::$_clientId[$projectId])) {
                throw new RuntimeException('Не указан клиент, представляющий дочерний проект');
            }
        }

        return self::$_clientId[$projectId];
    }

    /**
     * Создание заявки
     * @param integer $linkedClaimId - id связанной заявки на отгрузку, заявки в филиале
     * @param int $projectId - id дочернего проекта с которого создана заявка
     * @return App_Claim_LinkedClaim_Type_MainOut_DomainModel
     * @throws Zend_Db_Statement_Exception
     */
    public static function create(int $linkedClaimId, int $projectId)
    {
        $params = array(
            'depot_id' => 2,
            'manager_id' => self::getManagerId(),
            'client_id' => self::getClientId($projectId),
            'payment' => PaymentStrategyFactory::bySubProjectId($projectId)->getPaymentType(),
            'payment_flag' => 1,
            'car' => 0,
            'talibFlag' => 0,
            'date' => App_Formatter::getCurTime(),
            'annotation' => 'Автоматически созданная отгрузка в проект ' . App_Project_Repository::getInstance()->getProject($projectId)->getTitle()
        );

        $mapper = new App_Claim_Mapper_Out();
        $model = $mapper->create($params);

        // удаление блокировки из block_source
        App_Db_BlockSource::obtain()->delete(array(
            'type = ?' => 2,
            'source_id = ?' => $model->getId()
        ));

        App_Db_ClaimLinked::obtain()->updateOrCreateLink(
            $model->getId(),
            $projectId,
            array(
                'out' => $linkedClaimId
            )
        );

        return new self($model);
    }


    /**
     * Запуск обновления связанных заявок
     * @param array $params - доп параметры
     * @return boolean|array
     * @throws Exception
     */
    public function update($params = array())
    {
        if (!is_array($params)) {
            throw new \InvalidArgumentException('Параметры должны быть массивом или вовсе не заданы');
        }
        
        $updateStrategy = new App_Claim_LinkedClaim_UpdateStrategy_Main_Out($this);
        if (array_key_exists('moveOnNextStatus', $params)) {
            $updateStrategy->setMoveOnNextStatus($params['moveOnNextStatus']);
        }

        if (array_key_exists('formData', $params)) {
            $updateStrategy->setFormData($params['formData']);
        }
        
        return $updateStrategy->execute();
    }

    /**
     * Запуск обновления заявки данными с другого проекта
     * @param array $claimData - данные по заявке для обновления
     * @param array $files - информация о файлах для сохранения
     * @return void
     */
    public function updateFromOutside(array $claimData, $files = array())
    {
        $updateStrategy = new App_Claim_LinkedClaim_UpdateStrategy_Main_Out($this);
        $updateStrategy->importData($claimData);
    }

    /**
     * Выполнение блокировки товара
     * @param array $itemData информация по блокировке
     * @param boolean $updateLinkedOut обновить связанную заявку или нет
     * @return array
     */
    public function block(array $itemData, $updateLinkedOut = true)
    {
        $claimTypeReference = new App_Claim_Reference($this->getClaimId(), App_Claim_Factory::TYPE_ID_OUT, App_Claim_Factory::CLAIM_TYPE_OUT);
        $financeService = Finance_Model_Integration_Service::getInstance();
        $financeService->setUp($claimTypeReference);
        $financeSupport = $financeService->getFinanceSupportIntegration();

        $startEventId = $financeSupport->getControllerIntegration()->getStartEventId();
        $result = App_Claim_Helper_Out::setBlockProduct((object) $itemData);
        if ($startEventId > 0) {
            $financeSupport->getControllerIntegration()->integrateSetBlockItem($startEventId, true);
            $financeSupport->getControllerIntegration()->integrateHasArchivedDepotTicket(true);
        }

        Finance_Model_Integration_Register::getInstance()->getControllerIntegration()->updateDepotTicketModified();

        if (property_exists($result, 'ahtung')
            && property_exists($result, 'error')
        ) {
            return array(
                'success' => false,
                'result' => $result
            );
        }

        App_Db_Claims::obtain()->update(
            ['depot_index' => $itemData['depotId']], ['id = ?' => $this->getClaimId()]
        );

        $linkedClaimBlockResult = [];
        if ($updateLinkedOut) {
            // необходимо подготовить данные для филиала, т.к.
            // изменение может быть произведено по одной секции на главном проекте,
            // но в филилале для товара есть всего одна секция и для неё нужна
            // суммарная информация по amount и boxes
            $itemInfoHarvester = App_Network_Service_Synchronize_Data_Factory::create($this->getSubProjectModel()->getApplicationEnv(), 'depot_2');
            $itemInfoHarvester->setPkValues(array($itemData['itemId']));
            $itemInfo = $itemInfoHarvester->prepareData();
//
//            echo "<pre>" . print_r('$itemInfo', true); echo "</pre>"; // FrolovDEBUG
//            echo "<pre>" . print_r($itemInfo, true); echo "</pre>"; // FrolovDEBUG
//            exit();

            $sender = new App_Network_Service_LinkedProject_Claim_Sender();
            $sender->setProjectId($this->getSubProjectModel()->getId());

            $linkedClaimBlockResult = $sender->blockItem(
                $this->_prepareBlockDataForSubsidiary($itemData['itemId'], $itemData),
                $this->getClaimId(),
                $itemInfo
            );

            if ($linkedClaimBlockResult['success'] === false) {
                return $linkedClaimBlockResult;
            }
        }

        return array(
            'success' => true,
            'result' => (array) $result,
            'remoteBlockInfo' => $linkedClaimBlockResult['result']
        );
    }

    /**
     * Разблокировка товара
     * @param integer $itemId
     * @param boolean $updateLinkedOut обновить связанную заявку или нет
     * @return array
     * @throws Exception
     */
    public function unblock($itemId, $updateLinkedOut = true)
    {
        $claimTypeReference = new App_Claim_Reference(
            $this->getClaimId(),
            App_Claim_Factory::TYPE_ID_OUT,
            App_Claim_Factory::CLAIM_TYPE_OUT
        );
        $financeService = Finance_Model_Integration_Service::getInstance();
        $financeService->setUp($claimTypeReference);

        $financeService->getFinanceSupportIntegration()->getControllerIntegration()->integrateValidateDropProduct($itemId, true);
        $financeService->getFinanceSupportIntegration()->getControllerIntegration()->integrateHasArchivedDepotTicket(true);

        $result = App_Claim_Helper_Out::deleteProduct($this->getClaimId(), $itemId);

        Finance_Model_Integration_Register::getInstance()->getControllerIntegration()->updateDepotTicketModified();

        if ($updateLinkedOut) {
            $sender = new App_Network_Service_LinkedProject_Claim_Sender();
            $sender->setProjectId($this->getSubProjectModel()->getId());

            App_Network_Service_LinkedProject_Claim_Component_UnblockItem_DataService::getInstance(array(
                'itemId' => $itemId,
                'subsidiaryClaimId' => $this->getClaimId(),
            ));
            $linkedClaimUnblockResult = $sender->unblockItem();
        }

        return $result;
    }

    /**
     * Существует заявка или нет
     * @return boolean
     */
    public function isExists()
    {
        return $this->_claimId > 0;
    }

    /**
     * Подготовка данных для изменения в связанной отгрузке в филиале
     * @param integer $itemId - id товара
     * @param array $itemData - параметры формы блокировки
     * @return array 
     */
    private function _prepareBlockDataForSubsidiary($itemId, array $itemData)
    {
        $data = array(
            'claimId' => $this->getClaimId(),
            'depotId' => $itemData['depotId'],
            'subsidiaryClaimDepotId' => $itemData['subsidiaryClaimDepotId'],
            'itemId' => $itemId,
            'pnumber' => $itemData['pnumber'],
            'afterClose' => $itemData['afterClose'],
            'data' => array(
                0 => array(
                    "curBlockAmount" => 0,
                    "curBlockBoxes" => 0,
                    "depot_detailed_manager_rows" => array(
                        0 => array(
                            "curBlockAmount" => 0,
                            "curBlockBoxes" => 0,
                        )
                    ),
                )
            ),
        );

        $placing = array();

        $blockRecords = App_Db_Blocks::obtain()->getBlockedItems($this->getClaimId(), $itemId);
        foreach ($blockRecords as $blockRecord) {
            $data['data'][0]["curBlockAmount"] += $blockRecord['amount'];
            $data['data'][0]["curBlockBoxes"] += $blockRecord['boxes'];
            $data['data'][0]['depot_detailed_manager_rows'][0]['curBlockAmount'] += $blockRecord['amount'];
            $data['data'][0]['depot_detailed_manager_rows'][0]['curBlockBoxes'] += $blockRecord['boxes'];
            $placing[] = App_Db_DepotDetailed::obtain()->find($blockRecords[0]['detailed_id'])->current()->placing;
        }

        $data['data'][0]['placing'] = implode('|', $placing);

        // если запрос пришёл от франшизы, то посчитаем среднее франко для выбранного товара
        if ($this->getSubProjectModel()->isFranchise()) {
            $data['data'][0]['franco'] = App_Db_DepotDetailed::obtain()->getAverageFranco($this->getClaimId(), (int) $itemId);
        }
        
        return $data;
    }

    /**
     * Откат заявки на статус
     * @param integer $claimNewStatus - новый статус
     * @param integer $updateLinkedClaim - нужно обновлять связанные заявки или нет
     * @return void
     */
    public function returnOnStatus($claimNewStatus, $updateLinkedClaim = true)
    {
        App_Claim_Model_Out::backStatus($this->getClaimId(), $claimNewStatus);

        if ($updateLinkedClaim) {
            $sender = new App_Network_Service_LinkedProject_Claim_Sender();
            $sender->setProjectId($this->getSubProjectModel()->getId());

            $sender->returnOnStatus($this->getClaimId(), $claimNewStatus);
        }
    }
}
