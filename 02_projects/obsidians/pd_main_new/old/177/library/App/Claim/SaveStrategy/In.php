<?php
use App_Claim_SaveStrategy_Abstract as AbstractSaveHelper;

class App_Claim_SaveStrategy_In extends AbstractSaveHelper
{


    /**
     * @var \App\Claim\Validator\DepotCreditLimit\ValidationResult
     */
    private $depotCreditLimitValidation;

    /**
     * @return \App\Claim\Validator\DepotCreditLimit\ValidationResult
     */
    public function getDepotCreditLimitValidation(): \App\Claim\Validator\DepotCreditLimit\ValidationResult
    {
        return $this->depotCreditLimitValidation ?? new \App\Claim\Validator\DepotCreditLimit\ValidationResult();
    }

    /**
     * @inheritdoc
     * 
     * @param boolean $useDbTransactions Нужно ли использовать транзакции
     * 
     * @return int
     */
    public function updateClaimData($claimId, $formData, $changeStatusAvailable, $useDbTransactions = true)
    {
        $claimData = null;

        if ($claimId) {
            $claimData = App_Claim_Factory::getInstance()->getClaimData($claimId);
        }

        if ($useDbTransactions === true) {
            Zend_Db_Table_Abstract::getDefaultAdapter()->beginTransaction();
        }

        $this->validateClaimHasPhotoForEveryProduct($claimId, $changeStatusAvailable);

        if($claimId && $changeStatusAvailable) {
            $this->updateFinanceFlags($claimId);
        }

        // формирование списка изменений записей для уин вынесено до сохранения заявки, чтобы
        // корректно отрабатывала проверка прав доступа на изменение записей для уин
        $companyEquipmentChangeList = new App_Product_CompanyEquipment_ChangeList_Composite();
        if (isset($formData->companyEquipment) && App_Container::$services->getCompanyEquipmentService()->getClaimPermission($claimId)->canEdit()) {
            $companyEquipmentChangeList = App_Product_CompanyEquipment_ChangeList_Composite::fromArray(
                json_decode($formData->companyEquipment, true)
            );
            $formData->companyEquipment = $companyEquipmentChangeList;
        }

        $claimId = App_Claim_Model_In::save($formData, $changeStatusAvailable);
        $this->setClaimId($claimId);

        $this->depotCreditLimitValidation = \App_Claim_Model_In::getObj()->depotCreditLimitValidation;

        $this->updateCashPlannedStatus();

        // Если изменяется тип оплаты
        if ($claimData && isset($formData->claim['payment']) && $claimData->payment != $formData->claim['payment']) {
            $cashPlannedModel = new Cash_Model_Planned;
            $cashPlannedModel->changePayment($claimData, $formData->claim['payment']);
        }

        if (App_Claim_Validator_In::check($claimId)) {
            if (!$companyEquipmentChangeList->isEmpty()) {
                App_Container::$services->getCompanyEquipmentService()->saveChangeList((int) $claimId, $companyEquipmentChangeList);
            }

            // когда закрывается заявка, то создаётся отгрузка списание и запускается создание записей на УИН
            if (App_Db_Claims::obtain()->getRowField('claim_status', ['id = ?' => $claimId]) == App_Claim_Status_In::CLOSE_STATUS) {
                $modelCollection = App_Container::$services->getCompanyEquipmentService()->findByClaimInId((int) $claimId);
                $service=  App_Container::$services->getCompanyEquipmentService();
                var_dump($service);
                exit;
                if ($modelCollection->size() > 0) {
                    App_Container::$services->getCompanyEquipmentWriteOffService()
                        ->saveChangesResult($claimId, (new App_Product_CompanyEquipment_ChangeList_SaveResult())->setAdd($modelCollection));
                    App_Container::$services->getCompanyEquipmentService()->pushChanges(
                        (new App_Product_CompanyEquipment_ChangeList_SaveResult())
                            ->setAdd($modelCollection)
                    );
                }
            }

            if ($useDbTransactions === true) {
                Zend_Db_Table_Abstract::getDefaultAdapter()->commit();
            }
            App_Claim_Validator_In::unsetError($claimId);

            $this->_setErrorData(false);
        } else {
            $error = (object) App_Claim_Validator_In::$error;
            $error->claim = App_Claim_Helper_In::getInfoClaim($claimId);
            $error->request = Zend_Controller_Front::getInstance()->getRequest()->getParams();

            if ((integer) Zend_Controller_Front::getInstance()->getRequest()->getParam('cid')) {
                Zend_Db_Table_Abstract::getDefaultAdapter()->rollBack();
                $errorMessage = "<br>не сохранена,<br>т.к. содержит ошибки<br><br><br>";
            }
            else {
                if ($useDbTransactions === true) {
                    Zend_Db_Table_Abstract::getDefaultAdapter()->commit();
                }
                $errorMessage  = "<br>сохранена,<br>но содержит ошибки<br><br><br>";
            }

            $this->_setErrorData(array(
                'error' => true,
                'errorMsg' => $errorMessage,
                'errorObject' => $error
            ));

            App_Claim_Validator_In::saveErrorAndSetAlarm($error);
        }

        // Уведомление контроля остатков
        App_Db::get(DB_TONNAGE_CONTROL_NOTIFICATION)->sendNotificationEmail($claimId, $changeStatusAvailable);

        if($changeStatusAvailable) {
            $this->updateFinanceSupport();
        }

        $this->updateClaimProductPhotos($claimId);
        
        Claim_Model_DepotReject_DepotReject::get($claimId)->save(isset($formData->depotreject) ? $formData->depotreject : array());

        $this->updateVehicleAccess($claimId, $formData);
    }
}
