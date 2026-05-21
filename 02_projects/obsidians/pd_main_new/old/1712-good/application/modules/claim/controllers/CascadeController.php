<?php


use App_Cascade_Helper_Params as CascadeParams;

/**
 * Контроллер для каскадов
 */
class Claim_CascadeController extends Zend_Controller_Action
{
    /**
     * Вывод информации об изменениях, применение каскада если нажали кнопку "Принять"
     * @return void
     * @throws Exception
     */
    public function indexAction()
    {
        // Подключение стилей
        $this->_getHeadLink()->appendCssFiles(array('/css/claim/cascade.css'));

        $cascadeHandler = App_Claim_Cascade_Main::getInstance();

//        if ($cascadeHandler instanceof App_Claim_Cascade_In) {
//            echo "<pre>" . print_r('here1', true); echo "</pre>"; // FrolovDEBUG
//        } else {
//            echo "<pre>" . print_r('here2', true); echo "</pre>"; // FrolovDEBUG
//        }
//
//        exit();
        if ($cascadeHandler->cascadeSession->cancelCascade) {
            // Удалить сессию с каскадом
            Zend_Session::namespaceUnset('cascade');
            // Редирект на страницу с заявкой
            $cascadeHandler->redirectToClaim();
        }

        // Подготовка модели "Было"
        $cascadeHandler->prepareOldModel();

//        echo "<pre>" . print_r('$cascadeHandler', true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r('$cascadeHandler->claimModelOld', true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($cascadeHandler->claimModelOld, true); echo "</pre>"; // FrolovDEBUG

        // Подготовка модели "Стало"
        $cascadeHandler->prepareNewModel();

//        echo "<pre>" . print_r('$cascadeHandler->claimModelNew', true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($cascadeHandler->claimModelNew, true); echo "</pre>"; // FrolovDEBUG

        // Установка подготовленных данных в адаптер
        $cascadeHandler->prepareCascadeAdapter();


//        echo "<pre>" . print_r('$cascadeHandler->cascadeAdapterName', true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($cascadeHandler->cascadeAdapterName, true); echo "</pre>"; // FrolovDEBUG
//        exit();

        // Установка модели было для логгера
        $cascadeHandler->setLoggerOldModel();

        // Нажали кнопку принять?
        if (CascadeParams::get()->cascadeConfirmed = $accept = (bool) $this->_getParam('accept')) {
            Zend_Registry::set('cascadeAccepted', true);
        }

        // Начать транзакцию
        App_Db::get()->beginTransaction();

        // Удаление заявки - добавляем флаг удаления
        if ($cascadeHandler->request['deleteOnCascade']) {
            $cascadeHandler->claimCascadeAdapter->deleteClaim();
        }


//        $reflection = new ReflectionClass($cascadeHandler);

//        echo "<pre>" . print_r($cascadeHandler, true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r('$cascadeHandler->request', true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($cascadeHandler->request, true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r('$cascadeHandler->claimCascadeAdapter', true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($cascadeHandler->claimCascadeAdapter, true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r('$reflection->getProperties()', true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($reflection->getProperties(), true); echo "</pre>"; // FrolovDEBUG
//        exit();

        // Действия до каскада
        $cascadeHandler->beforeDoCascade();

        //        echo "<pre>" . print_r($cascadeHandler->claimCascadeAdapter, true); echo "</pre>"; // FrolovDEBUG
        //        exit();

        // Запустить каскад
        $cascadeHandler->claimCascadeAdapter->doCascade();
//        echo "<pre>" . print_r('here', true); echo "</pre>"; // FrolovDEBUG
//        exit();
        // Действия после каскада
        $cascadeHandler->afterDoCascade();

        // Удаление заявки
        if ($cascadeHandler->request['deleteOnCascade']) {
            (new App_Claim_Service_Remove_Router($cascadeHandler->claimId))->delete();
        }

        $minusCheck = (Zend_Registry::isRegistered('minusCheck') && Zend_Registry::get('minusCheck') === false) ? false : true;

        // Наличие ошибок при проведении каскада
        $cantEdit = (Zend_Registry::isRegistered('cantEdit') && Zend_Registry::get('cantEdit') === true);

        $this->view->assign(array(
            'canEdit' => $cantEdit,
            'deleteOnCascade' => !empty($cascadeHandler->request['deleteOnCascade']) ? 1 : 0
        ));

        // Приняли каскад и прошли проверку
        if ($accept && $minusCheck && !$cantEdit) {
            $cascadeHandler->onAcceptCascade();

            $this->_proccessInventoryNumbers();

            // Комит изменений
            Zend_Db_Table_Abstract::getDefaultAdapter()->commit();

            \App\Service\EventService::getInstance()->trigger(new \App\Event\Claim\Type\CascadeSave(
                (new \App\Event\Claim\Subject())
                    ->setClaimId($cascadeHandler->claimId)
                    ->setClaimTypeId($cascadeHandler->claimModelNew->getClaimType())
            ));

            // создание объявления для ЗП руководителей
            if ($cascadeHandler->claimModelNew->getDirectorWageConfirmation()) {
                Analitics_Model_DirectorWage_Report_Declaration::getInstance()->sendAboutChangeInClosedPeriod(App_User_Wrapper::getInstance()->getId(), $cascadeHandler->claimModelNew, new DateTime());
            }

            // Разблокировать заявку
            $cascadeHandler->unblockClaim();

            if ($cascadeHandler->request['deleteOnCascade']) {
                $cascadeHandler->setLoggerEventType(3);
            }

            $cascadeHandler->setLoggerNewModel()->claimLoggerAdapter->writeLog();

            // Создание корректировок для ЗП отчета
            $this->view->assign($cascadeHandler->salaryDocCorrection());

            $this->view->assign(array(
                'success' => true
            ));

            // При изменении с безнала в нал если есть документы (копия) они будут удалены
            $cascadeHandler->paymentChangeHandler();

            // Заявка удалена
            if ($cascadeHandler->request['deleteOnCascade']) {
                // Список файлов хранится в статическом свойстве класса
                App_Claim_Service_Remove_Handler_RemoveFiles::removeFiles();
            }
        }

        // Обновление клиента и суммы в cash_planned
        $this->_updateCashPlanned($cascadeHandler->claimId);

        $this->view->assign(array(
            'typeTitle' => App_Constant_Table_ClaimType::getKeyTitle($cascadeHandler->claimModelOld->getClaimType()),
            'claim' => $cascadeHandler->claimModelOld
        ));
    }


    /**
     * Обновление клиента и суммы в cash_planned
     */
    protected function _updateCashPlanned($claimId)
    {
        $claimData = App_Claim_Factory::getInstance()->getClaimData($claimId);

        App_Spl_TypeCheck::getInstance()->positiveNumeric($claimId);

        switch($claimData->type_id)
        {
            case App_Claim_Factory::TYPE_ID_IN:
            case App_Claim_Factory::TYPE_ID_IN_RAW:
            case App_Claim_Factory::TYPE_ID_OUT:
            case App_Claim_Factory::TYPE_ID_OUT_RAW:
                $claimFactory = App_Claim_Factory::getInstance();
                $stringType   = $claimFactory->claimTypeIdToString($claimData->claimType);
                $claimType    = $claimFactory->getStringClaimModelType($stringType);
                $strategy     = 'App_Claim_SaveStrategy_' . $claimType;
                $saveHelper   = new $strategy;
                $saveHelper->setClaimId($claimId);
                $saveHelper->updateCashPlannedClient();
        }
    }


    /**
     * расчет баланса клиента по заявке на переработку
     * @param integer $incomeClaimId
     * @return float or false
    */
    protected function getConversionId($incomeClaimId)
    {
        $claimTable = App_Db::get(DB_CLAIMS);
        $conversionClaimId = (object)$claimTable->getFlag('connectivity', $incomeClaimId);
        return $conversionClaimId->connectivity;
    }
    /**
     * обновление баланса клиента
     */
    protected function updateClientBalance($incomeClaimId, $oldValue, $newValue)
    {
        if (!($oldValue-$newValue)) {
            return;
        }
        $claimTable = App_Db::get(DB_CLAIMS);
        $conversionClaimId = $claimTable->getFlag('connectivity', $incomeClaimId);
        if ($claimTable->getClaimStatus($conversionClaimId)) {
            return;
        }
        $clientId = $claimTable->getClaimClient($conversionClaimId);
        echo $this->_showInfo('Изменение сальдо клиента', "Сальдо клиента изменилось на ".($oldValue-$newValue));
        App_Cascade_Helper_ClientBalance::updateClientBalance($clientId, $newValue-$oldValue, '-');
    }

    /**
     *Вывод названия каскада
     *@param string $title
     *@param string $description
     *@return String
     */
    protected function _showInfo($title, $description)
    {
        $html = "<table width=1000 cellpadding=0 cellspacing=1 border=0 class=aClientTable style=\"border: 1px solid #FFF; margin: 5px 0px 15px 0px;\">";
        $html .= "<tr><td class=aClientTitle>$title</td></tr>";
        $html .= "<tr><td class=\"aClientClaimId\" style=\"border: 1px solid #FFFFFF;\">$description</td></tr>";
        $html .= "</table><br><hr style=\"width: 1000px; color: #6B4D37;\" size=2><br><br>";
        return $html;
    }

    protected function _recountPrice($obj)
    {
        foreach($obj->component as $key=>$v){
            $rechanger = new App_Cascade_Helper_CloseOverdraftComponents($key, $obj->client);
            $rechanger->distribution();
        }
    }

	/**
	 * получить имя клиента
	 * @param integer $clientId
	 * @return string
	 */
	protected function _getClientsName($clientId)
	{
		$db = Zend_Db_Table_Abstract::getDefaultAdapter();
		$sql = "select * from clients where id=$clientId";
		$stmt = $db->query($sql);
		return (object)$stmt->fetch(Zend_Db::FETCH_ASSOC);
	}


	protected function _showClientBalanceAndUpdate($old, $new)
	{
		if ($old->client != $new->client){
			$title = "Баланс клиента : ".$this->_getClientsName($old->client)->s_title;
			$description = " - баланс изменился на : ".($old->value);
			App_Cascade_Helper_ClientBalance::updateClientBalance($old->client, $old->value, '+');
			echo $this->_showInfo($title, $description);

			$title = "Баланс клиента : ".$this->_getClientsName($new->client)->s_title;
			$description = " - баланс изменился на : ".(-$new->value);
			App_Cascade_Helper_ClientBalance::updateClientBalance($old->client, -$new->value, '+');
			echo $this->_showInfo($title, $description);
		}
		else {
			$title = "Баланс клиента : ".$this->_getClientsName($old->client)->s_title;
			if ($old->value != $new->value){
				$description = "баланс изменился на : ".($old->value - $new->value);
				App_Cascade_Helper_ClientBalance::updateClientBalance($old->client, $old->value - $new->value, '+');
			}
			else {
				$description = " - баланс не изменился";
			}
			echo $this->_showInfo($title, $description);
		}
	}

    public function correctionAction()
    {
        $remoteClaimId       = $this->_getParam('claim', 0);
        if (empty($remoteClaimId)) {
            $cascadeSession = new Zend_Session_Namespace('cascade');
            $request = $cascadeSession->request;
            $manager_id = $request['claim']['managerId'];
        } else {
            $data = App_Db::get(DB_CLAIMS)->getRow(array('id = ?' => $remoteClaimId));
            $manager_id = is_object($data) ? $data->manager_id : $data['manager_id'];
        }
        $users = (array) App_Salary_Helper_Bonus::getStructUsers(true);
        $this->view->managerId = (!empty($manager_id))? $manager_id : 0;
        $this->view->users = $users;
    }

    public function correctionaddAction()
    {
        $this->_helper->viewRenderer->setNoRender();
        $docId         = $this->_getParam('docId');
        $userId        = $this->_getParam('userId');
        $fine          = $this->_getParam('fine');
        $description   = $this->_getParam('description');
        $remoteClaimId = $this->_getParam('claimId', 0);
        $currentUser   = (int)Zend_Auth::getInstance()->getIdentity()->id;
        $date = date('Y-m-d');
        if (empty($docId) && !empty($remoteClaimId)) {
            $claimId = (int)$remoteClaimId;
            $docId = 'NULL';
        } else {
            $claimObj = App_Db::get(DB_SALARY_DOC_CLAIM)->getRow(array('id = ?' => $docId));
            $claimId = is_object($claimObj) ? $claimObj->claim_id : $claimObj['claim_id'];
        }
        App_Db::get()->query("call salary_add_description_fine({$docId}, '{$description}', {$fine}, {$userId}, {$currentUser}, '{$date}', 'каскад к заявке ID:{$claimId}')");

        print '1';
    }

    /**
     * Обработка изменений в инвентарных номерах, если такие изменения есть
     * @throws Exception
     */
    protected function _proccessInventoryNumbers()
    {
        $saveResult = App_Product_CompanyEquipment_ChangeList_SaveResult::fromCache();
//        echo "<pre>" . print_r('$saveResult', true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($saveResult, true); echo "</pre>"; // FrolovDEBUG
//        exit();
        if (!$saveResult->isEmpty()) {
            App_Container::$services->getCompanyEquipmentService()->pushChanges($saveResult);
        }
    }
}
