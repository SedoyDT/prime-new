---
author: Frolov Anatolui
date: 2025-11-13
time: 16:11:59
aliases: 
- 
tags:
- unique-note
---
```
<?php  
  
/**  
 * Все права на программный код принадлежат ООО "ПИАР СИТИ" * * @author CodeGenerator * @date 04.08.2022 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution */  
namespace App\RestAPI\Module\SalesFunnel\Lead\Service;  
  
use App\RestAPI\Module\SalesFunnel\Lead\Resource\Add\LeadResource as AddLeadResource;  
use App\RestAPI\Module\SalesFunnel\Lead\Resource\Edit\LeadResource as EditLeadResource;  
use App\RestAPI\Module\SalesFunnel\Lead\Resource\GetOne\LeadResource as GetOneLeadResource;  
use App\RestAPI\Module\ServiceInterface;  
use App\RestAPI\Response\AbstractResponse;  
use App\RestAPI\Response\BadRequestResponse;  
use App\RestAPI\Response\NotFoundResponse;  
use App\RestAPI\Response\SuccessResponse;  
use App\SalesFunnel\Form\RestAPI\LeadCreationForm;  
use App\SalesFunnel\Form\RestAPI\LeadUpdateForm;  
use App\SalesFunnel\Lead\Email\Services\Factory as LeadEmailFactory;  
use App\SalesFunnel\Lead\Model;  
use App\SalesFunnel\Lead\Phone\Services\Factory as LeadPhoneFactory;  
use App\SalesFunnel\Lead\Services\Creator;  
use App\SalesFunnel\Lead\Services\Crud as LeadCrud;  
use App\SalesFunnel\Lead\Services\Factory as LeadFactory;  
use App\SalesFunnel\Lead\Services\RelationManager;  
use App\SalesFunnel\LeadProp\PropValue\Behaviour\UpdateBehaviour;  
use App\SalesFunnel\LeadProp\PropValue\PropValueStorageRepo;  
use App\SalesFunnel\LeadTag\Operations\FlushTags;  
use App\SalesFunnel\LeadTag\Operations\UpdateTags;  
use App\SalesFunnel\Resource\LeadPropStorageResource;  
use App\SalesFunnel\Stage\Services\Factory as StageFactory;  
use App_User_Wrapper;  
use libphonenumber\NumberParseException;  
use RuntimeException;  
use Zend_Db;  
use App\SalesFunnel\LeadLog\Reason\ReasonRepository AS ReasonRepository;  
use App\SalesFunnel\Lead\Email\Services\EventGenerator AS EmailEventGenerator;  
use App\SalesFunnel\Lead\Phone\Services\EventGenerator AS PhoneEventGenerator;  
use App\SalesFunnel\Lead\Email\Services\Crud AS EmailCrud;  
use App\SalesFunnel\Lead\Phone\Services\Crud AS PhoneCrud;  
use App\SalesFunnel\Lead\Services\EventGenerator AS LeadEventGenerator;  
use App\Service\EventService;  
/**  
 * Сервис с реализацией методов API */class LeadService implements ServiceInterface  
{  
    /**  
     * @var LeadEmailFactory  
     */  
    protected $leadEmailFactory;  
    /**  
     * @var StageFactory  
     */  
    private $stageFactory;  
  
    /**  
     * @var LeadPhoneFactory  
     */  
    private $leadPhoneFactory;  
  
    /**  
     * @var LeadCrud  
     */  
    private $leadCrud;  
  
    /**  
     * @var Creator  
     */  
    private $leadCreator;  
  
    /**  
     * @var LeadPropStorageResource  
     */  
    private $leadPropsResource;  
  
    /**  
     * @var LeadFactory  
     */  
    private $leadFactory;  
  
    /**  
     * @var UpdateBehaviour  
     */  
    private $leadPropUpdater;  
  
    /**  
     * @var PropValueStorageRepo  
     */  
    private $leadPropRepo;  
  
    /**  
     * @var \App\SalesFunnel\Lead\Email\Services\EventGenerator  
     */  
    private $emailEventGenerator;  
  
    /**  
     * @var \App\SalesFunnel\Lead\Phone\Services\EventGenerator  
     */  
    private $phoneEventGenerator;  
  
    /**  
     * @var \App\SalesFunnel\LeadLog\Reason\ReasonRepository  
     */  
    private $leadEventReasonRepo;  
  
    /**  
     * @var \App\SalesFunnel\Lead\Services\EventGenerator  
     */  
    protected $leadEventGenerator;  
  
    /**  
     * @var \App\SalesFunnel\Lead\Phone\Services\Crud  
     */  
    private $leadPhoneCrud;  
  
    /**  
     * @var \App\SalesFunnel\Lead\Email\Services\Crud  
     */  
    private $leadEmailCrud;  
  
  
    /**  
     * @param StageFactory $stageFactory  
     * @param LeadPhoneFactory $leadPhoneFactory  
     * @param LeadCrud $leadCrud  
     * @param Creator $leadCreator  
     * @param LeadPropStorageResource $leadPropsResource  
     * @param LeadFactory $leadFactory  
     * @param UpdateBehaviour $leadPropUpdater  
     * @param PropValueStorageRepo $leadPropRepo  
     * @param LeadEmailFactory $leadEmailFactory  
     * @param EmailEventGenerator $emailEventGenerator  
     * @param PhoneEventGenerator $phoneEventGenerator  
     * @param ReasonRepository $leadEventReasonRepo  
     * @param PhoneCrud $leadPhoneCrud  
     * @param EmailCrud $leadEmailCrud  
     */  
    public function __construct(  
        StageFactory            $stageFactory,  
        LeadPhoneFactory        $leadPhoneFactory,  
        LeadCrud                $leadCrud,  
        Creator                 $leadCreator,  
        LeadPropStorageResource $leadPropsResource,  
        LeadFactory             $leadFactory,  
        UpdateBehaviour         $leadPropUpdater,  
        PropValueStorageRepo    $leadPropRepo,  
        LeadEmailFactory        $leadEmailFactory,  
        EmailEventGenerator     $emailEventGenerator,  
        PhoneEventGenerator     $phoneEventGenerator,  
        ReasonRepository        $leadEventReasonRepo,  
        PhoneCrud               $leadPhoneCrud,  
        EmailCrud               $leadEmailCrud,  
        LeadEventGenerator      $leadEventGenerator  
  
    ) {  
        $this->stageFactory = $stageFactory;  
        $this->leadPhoneFactory = $leadPhoneFactory;  
        $this->leadCrud = $leadCrud;  
        $this->leadCreator = $leadCreator;  
        $this->leadPropsResource = $leadPropsResource;  
        $this->leadFactory = $leadFactory;  
        $this->leadPropUpdater = $leadPropUpdater;  
        $this->leadPropRepo = $leadPropRepo;  
        $this->leadEmailFactory = $leadEmailFactory;  
        $this->phoneEventGenerator = $phoneEventGenerator;  
        $this->emailEventGenerator = $emailEventGenerator;  
        $this->leadEventReasonRepo = $leadEventReasonRepo;  
        $this->leadPhoneCrud = $leadPhoneCrud;  
        $this->leadEmailCrud = $leadEmailCrud;  
        $this->leadEventGenerator = $leadEventGenerator;  
  
    }  
  
  
    /**  
     * @param array $params  
     * @return AbstractResponse  
     */  
    public function getAll(array $params = []): AbstractResponse  
    {  
        throw new RuntimeException('Not implemented!');  
    }  
  
    /**  
     * получение информации по 1 лиду     * @param array $params  
     * @return AbstractResponse  
     */  
    public function getOne(array $params): AbstractResponse  
    {  
        $lead = $this->leadFactory->fromId($params['id']);  
        if (!$lead->getEntity()->getId()) {  
            return (new NotFoundResponse())->setMessages(["Лид не найден"]);  
        }  
  
        return (new SuccessResponse())->setData(  
            $this->hydrateLeadResource(new GetOneLeadResource(), $lead)  
        );  
    }  
  
    /**  
     * добавление лида     * @param array $params  
     * @return AbstractResponse  
     * @throws \Zend_Db_Statement_Exception  
     * @throws \Zend_Form_Exception  
     * @throws NumberParseException  
     */  
    public function add(array $params): AbstractResponse  
    {  
        $creationForm = new LeadCreationForm();  
        if (!$creationForm->isValid($params)) {  
            return (new BadRequestResponse())  
                ->setMessages($creationForm->getMessages())  
            ;  
        }  
  
        $lead = $this->getLeadIfExist($creationForm->getValues());  
        if (!is_null($lead)) {  
            $this->updateExistedLead($creationForm->getValues(), $lead);  
            $this->generateRestIntersection($lead->getEntity()->getId());  
            return (new SuccessResponse())->setData(  
                $this->hydrateLeadResource(new AddLeadResource(), $lead)  
            );  
        }  
  
        \App_Db::get()->beginTransaction();  
  
        $creationCancelReason = "";  
        $lead = $this->leadCreator->createFromRestApi(  
            $creationForm,  
            App_User_Wrapper::getInstance()->getId(),  
            $creationCancelReason  
        );  
        if (is_null($lead)) {  
            \App_Db::get()->rollBack();  
  
            return (new BadRequestResponse())->setMessages([  
                'common' => $creationCancelReason,  
            ]);  
        }  
  
        $this->leadPropUpdater->updatePropValues(  
            $lead->getProps(),  
            $creationForm->getValue('props') ?? []  
        );  
        $this->leadPropRepo->savePropValueStorage($lead->getProps());  
  
        // сохранение тегов  
        UpdateTags::perform($lead->getTags(), $creationForm->getValue('tags') ?: []);  
        $lead->getTags()->setLeadId($lead->getEntity()->getId());  
        FlushTags::perform($lead->getTags());  
  
        \App_Db::get()->commit();  
  
        $this->generateRestIntersection($lead->getEntity()->getId());  
  
        return (new SuccessResponse())->setData(  
            $this->hydrateLeadResource(new AddLeadResource(), $lead)  
        );  
    }  
  
    /**  
     * обновление лида     * @param array $params  
     * @return AbstractResponse  
     * @throws \Zend_Form_Exception  
     */  
    public function edit(array $params): AbstractResponse  
    {  
        $updateForm = new LeadUpdateForm();  
        if (!$updateForm->isValid($params)) {  
            return (new BadRequestResponse())  
                ->setMessages($updateForm->getMessages())  
                ;  
        }  
  
        $lead = $this->leadFactory->fromId($updateForm->getValue('id'));  
  
        if (!$lead->getEntity()->getId()) {  
            return (new NotFoundResponse())->setMessages(["Лид не найден"]);  
        }  
  
        $lead->getEntity()->setTitle($updateForm->getValue('title'));  
        $lead->getEntity()->setAnnotation((string) $updateForm->getValue('annotation') ?? "");  
  
        if (!empty($updateForm->getValue('phones'))) {  
            foreach ($updateForm->getValue('phones') as $phone) {  
                $phoneModel = $this->leadPhoneFactory->emptyModel();  
                $phoneModel->setPhone($phone);  
                $lead->getPhoneCollection()->addIfNotExists($phoneModel);  
            }  
        }  
  
        if (!empty($updateForm->getValue('emails'))) {  
            foreach ($updateForm->getValue('emails') as $email) {  
                $emailModel = $this->leadEmailFactory->emptyModel();  
                $emailModel->setEmail($email);  
                $lead->getEmailCollection()->addIfNotExists($emailModel);  
            }  
        }  
  
        if (!empty($updateForm->getValue('stageId'))) {  
            $stage = $this->stageFactory->fromId($updateForm->getValue('stageId'));  
            $lead->moveOnStage($stage, App_User_Wrapper::getInstance()->getId());  
        }  
  
        $isAdvertising = $updateForm->getValue('isAdvertising');  
  
        if (!is_null($isAdvertising)) {  
            if ($isAdvertising) {  
                $sourceId = $lead->getEntity()->getDatasourceTypeId();  
                if (in_array($sourceId, [  
                    \App_Constant_Table_SalesFunnelDatasourceType::TYPE_USER,  
                    \App_Constant_Table_SalesFunnelDatasourceType::TYPE_AVITO_CHAT,  
                    \App_Constant_Table_SalesFunnelDatasourceType::TYPE_PARENT_LEAD,  
                    \App_Constant_Table_SalesFunnelDatasourceType::TYPE_MAIL_SERVER,  
                ])) {  
                    return (new BadRequestResponse())->setMessages(["Нельзя поменять рекламную платформу для лида с данным источником"]);  
                }  
  
                $lead->getEntity()  
                    ->setIsAdvertising(true)  
                    ->setAdvertisingPlatformId($updateForm->getValue('advertisingPlatformId'));  
            } else {  
                $lead->getEntity()  
                    ->setIsAdvertising(false)  
                    ->setAdvertisingPlatformId(null);  
            }  
        }  
  
        $this->leadPropUpdater->updatePropValues(  
            $lead->getProps(),  
            $updateForm->getValue('props') ?? [],  
            false  
        );  
  
        // сохранение тегов  
        UpdateTags::perform($lead->getTags(), $updateForm->getValue('tags') ?: []);  
        $lead->getTags()->setLeadId($lead->getEntity()->getId());  
  
        \App_Db::get()->beginTransaction();  
  
        $this->leadCrud->saveModel($lead);  
        $this->leadPropRepo->savePropValueStorage($lead->getProps());  
        FlushTags::perform($lead->getTags());  
  
        \App_Db::get()->commit();  
  
        return (new SuccessResponse())->setData(  
            $this->hydrateLeadResource(new EditLeadResource(), $lead)  
        );  
    }  
  
    /**  
     * @param array $params  
     * @return AbstractResponse  
     */  
    public function delete(array $params): AbstractResponse  
    {  
        throw new RuntimeException('Not implemented!');  
    }  
  
    public function getModuleId(): int  
    {  
        return \App_Constant_Table_RestApiModule::TYPE_SALES_FUNNEL;  
    }  
  
    private function hydrateLeadResource($leadResource, \App\SalesFunnel\Lead\Model $lead)  
    {  
        $leadResource->setProperties([  
            'id' => $lead->getEntity()->getId(),  
            'title' => $lead->getEntity()->getTitle(),  
            'stageId' => $lead->getEntity()->getStageId(),  
            'funnelId' => $lead->getEntity()->getFunnelId(),  
            'plannedSum' => $lead->getEntity()->getPlannedSum(),  
            'actualSum' => $lead->getEntity()->getActualSum(),  
            'isAdvertising' => $lead->getEntity()->getIsAdvertising(),  
            'advertisingPlatformId' => $lead->getEntity()->getAdvertisingPlatformId(),  
            'clientTitle' => \App_Db_Clients::obtain()->getRowField('s_title', ['id = ?' => $lead->getEntity()->getClientId() ?: -1]),  
            'annotation' => $lead->getEntity()->getAnnotation(),  
            'userId' => $lead->getEntity()->getUserId(),  
        ]);  
        $leadResource->props = $this->leadPropsResource->generate($lead->getProps());  
        $leadResource->phones = array_map(  
            function (\App\SalesFunnel\Lead\Phone\Model $phone) {  
                return $phone->getEntity()->getPhoneE164();  
            },  
            $lead->getPhoneCollection()->getItems()  
        );  
        $leadResource->emails = array_map(  
            function (\App\SalesFunnel\Lead\Email\Model $phone) {  
                return $phone->getEntity()->getEmail();  
            },  
            $lead->getEmailCollection()->getItems()  
        );  
        $leadResource->tags = array_map(  
            function (\App\SalesFunnel\LeadTag\Entity $tag) {  
                return $tag->getTag();  
            },  
            array_values($lead->getTags()->getValues())  
        );  
  
        return $leadResource;  
    }  
  
    /**  
     * Метод для получения на основе параметров активного лида если имеется таковой     * @param array $params  
     * @return Model | null  
     */  
    private function getLeadIfExist(array $params): ?Model  
    {  
        $phonesLeadId = null;  
        if (!empty($params['phones'])) {  
            $phoneQuery = (new \App\SalesFunnel\Lead\Query)  
                ->byPhone($params['phones'])  
                ->activeOnly()  
                ->order('id desc')  
                ->limit(1);  
            if (!empty($params['funnelId'])) {  
                $phoneQuery->byFunnelId([$params['funnelId']]);  
            }  
  
            $phonesLeadId = $phoneQuery->fetch(Zend_Db::FETCH_COLUMN);  
        }  
  
        $emailsLeadId = null;  
        if (!empty($params['emails'])) {  
            $emailQuery = (new \App\SalesFunnel\Lead\Query)  
                ->byEmails($params['emails'])  
                ->activeOnly()  
                ->order('id desc')  
                ->limit(1);  
            if (!empty($params['funnelId'])) {  
                $emailQuery->byFunnelId([$params['funnelId']]);  
            }  
  
            $emailsLeadId = $emailQuery->fetch(Zend_Db::FETCH_COLUMN);  
        }  
  
        if (!empty($phonesLeadId)) {  
            return $this->leadFactory->fromId($phonesLeadId);  
        } else if (!empty($emailsLeadId)) {  
            return $this->leadFactory->fromId($emailsLeadId);  
        }  
  
        return null;  
    }  
  
    private function updateExistedLead(array $params, \App\SalesFunnel\Lead\Model $lead)  
    {  
        \App_Db::get()->beginTransaction();  
        $this->phoneEventGenerator->setEventReason("Обращение через API");  
        $this->phoneEventGenerator->setEventAuthor(\App_User_Wrapper::systemUserId());  
        $this->emailEventGenerator->setEventReason("Обращение через API");  
        $this->emailEventGenerator->setEventAuthor(\App_User_Wrapper::systemUserId());  
        $this->leadEventGenerator->setEventReason("Обращение через API");  
        $this->leadEventGenerator->setEventAuthor(\App_User_Wrapper::systemUserId());  
  
        if (!empty($params['phones'])) {  
            foreach ($params['phones'] as $phone) {  
                $phoneModel = $this->leadPhoneFactory->emptyModel();  
                $phoneModel->setPhone($phone);  
                $lead->getPhoneCollection()->addIfNotExists($phoneModel);  
            }  
        }  
  
        if (!empty($params['emails'])) {  
            foreach ($params['emails'] as $email) {  
                $emailModel = $this->leadEmailFactory->emptyModel();  
                $emailModel->setEmail($email);  
                $lead->getEmailCollection()->addIfNotExists($emailModel);  
            }  
        }  
  
        $oldAnnotation = $lead->getEntity()->getAnnotation();  
        $restAnnotation = $params['annotation'];  
        $newAnnotation = join(PHP_EOL, array_filter([$oldAnnotation, $restAnnotation]));  
        $lead->getEntity()->setAnnotation($newAnnotation);  
        $this->leadCrud->saveModel($lead);  
  
        $this->phoneEventGenerator->clearEventReason();  
        $this->emailEventGenerator->clearEventReason();  
        $this->leadEventGenerator->clearEventReason();  
  
        \App_Db::get()->commit();  
    }  
  
    public function generateRestIntersection(int $leadId): void  
    {  
        $subject = new \App\Event\SalesFunnel\Subject\Lead();  
        $subject->setLeadId($leadId);  
  
        $event =  new \App\Event\SalesFunnel\Type\RestApiInteraction($subject);  
        EventService::getInstance()->trigger($event);  
  
    }  
}
```

