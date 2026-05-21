---
author: Frolov Anatolui
date: 2025-05-23
time: 17:05:51
aliases: 
- 
tags:
- unique-note
---
```php
<?php  
/**  
 * Все права на программный код принадлежат ООО "ПИАР СИТИ" * * @author Podchasov Oleg * @date   10.08.2023 * @copyright Copyright (c) ООО "Пиар Сити" * project AMDSolution */  
use App\Depot\Marketplace\Model\Response\DataResponse;  
use App\Depot\Marketplace\Model\Response\SuccessResponse;  
use App\Depot\Marketplace\Model\Response\ZendFormFailResponse;  
use App\SalesFunnel\Funnel\Services\Factory as FunnelFactory;  
use \App\SalesFunnel\Funnel\Repository AS FunnelRepository;  
use App\SalesFunnel\QualityControl\Models\ConfirmFunnelModel;  
use App\SalesFunnel\QualityControl\Repositories\ConfirmFunnelRepository;  
use App\SalesFunnel\QualityControl\Repositories\Db\ConfirmFunnelModel\ConfirmFunnelConditions;  
use App\SalesFunnel\QualityControl\Services\FormDataSourceService;  
  
/**  
 * Контроллер функционала воронок с подтверждением ОКК */class SalesFunnel_QualityControl_ConfirmFunnelsController extends Zend_Controller_Action  
{  
    /**  
     * Сервис для получения данных     * @\DI\Annotation\Inject()     * @var FormDataSourceService  
     */  
    private $dataSourceService;  
  
    /**  
     * @\\DI\Annotation\Inject     * @var FunnelFactory  
     */  
    protected $funnelFactory;  
  
    /**  
     * Репозиторий моделей     * @\DI\Annotation\Inject()     * @var ConfirmFunnelRepository  
     */  
    private $confirmFunnelRepository;  
  
    /**  
     * Репозиторий моделей     * @\DI\Annotation\Inject()     * @var FunnelRepository  
     */  
    private $funnelRepository;  
  
    /**  
     * @inheritDoc     */    public function preDispatch()  
    {  
        if (!App_Access::get('access', 'sales_funnel>quality_control>confirm_funnels')) {  
            throw new RuntimeException('Нет прав на работу с воронками с флагом автоподтверждения');  
        }  
    }  
  
    /**  
     * Обработать запрос на получение воронок с флагом автоподтверждения     * @return void  
     * @throws Exception  
     */  
    public function getFunnelsAction()  
    {  
        App_Form_AjaxForm_Factory::send(function () {  
            return new DataResponse($this->dataSourceService->getFunnelsWithConfirmNecessary());  
        });  
    }  
  
    /**  
     * Обработать запрос на перезапись воронок с флагом автоподтверждения     * @return void  
     * @throws Exception  
     */  
    public function setFunnelsAction()  
    {  
        App_Form_AjaxForm_Factory::send(  
            App_Form_AjaxForm_Factory::TYPE_DB_TRANSACTION,  
            [  
                function () {  
                    $funnelIds = $this->_getParam('funnelIds') ?: [];  
  
                    $form = new App_Form();  
                    $form->addElement(  
                        new Zend_Form_Element_Multiselect(  
                            'funnelIds',  
                            [  
                                'required'     => true,  
                                'multiple'     => true,  
                                'multiOptions' => App_Db_SalesFunnel::obtain()->getRowsInPairs(['id', 'id']),  
                            ]  
                        )  
                    );  
  
                    if ($form->isValid(['funnelIds' => $funnelIds])) {  
                        ['funnelIds' => $formValueFunnelIds] = $form->getValues();  
                        //получить все имеющиеся воронки  
                        $conditions     = new ConfirmFunnelConditions();  
                        $confirmFunnels = $this->confirmFunnelRepository->findBy($conditions);  
  
                        //удалить все  
                        foreach ($confirmFunnels as $funnel) {  
                            $funnel->delete();  
                            $this->confirmFunnelRepository->save($funnel);  
                        }  
  
                        //создать новые  
                        foreach ($formValueFunnelIds as $funnelId) {  
                            $entity = (new ConfirmFunnelModel())->setFunnelId($funnelId);  
                            $this->confirmFunnelRepository->save($entity);  
                        }  
  
                        return new SuccessResponse();  
                    }  
  
                    return new ZendFormFailResponse($form->getMessages());  
                },  
            ]  
        );  
    }  
  
    public function getStagesAction()  
    {  
        App_Form_AjaxForm_Factory::send(function () {  
            return new DataResponse($this->dataSourceService->getStagesWithConfirmNecessary());  
        });  
    }  
  
  
    public function getCurrentConfirmFunnelsAction()  
    {  
        echo "<pre>" . print_r('here', true); echo "</pre>"; // FrolovDEBUG  
        exit();  
    }  
  
  
    public function getCurrentConfirmStagesAction()  
    {  
        echo "<pre>" . print_r('here', true); echo "</pre>"; // FrolovDEBUG  
        exit();  
    }  
  
  
    public function getStagesToConfirmAction()  
    {  
        App_Form_AjaxForm_Factory::send(function () {  
            return new DataResponse($this->dataSourceService->getStagesToConfirm());  
        });  
    }  
  
    public function getFunnelsToConfirmAction()  
    {  
        App_Form_AjaxForm_Factory::send(function () {  
            return new DataResponse($this->dataSourceService->getFunnelsToConfirm());  
        });  
    }  
  
  
    public function getConfirmSettingsAction()  
    {  
        $stages = (new DataResponse($this->dataSourceService->getStagesToConfirm()))->getData();  
        $funnels = (new DataResponse($this->dataSourceService->getFunnelsToConfirm()))->getData();  
  
        $db = $this->funnelFactory->collectionFromEntityArray($this->funnelRepository::find()->all())->toArray();  
        foreach ($db as $funnel) {  
  
        }  
  
    }  
}
```

