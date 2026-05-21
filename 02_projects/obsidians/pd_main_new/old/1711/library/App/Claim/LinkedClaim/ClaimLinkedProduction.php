<?php

/**
 * {Template_Description_Abstract}
 *
 * @author IvanPak
 * @date_created 16.03.2018
 * @copyright {Template_Description_Copyrights}
 */

use App_Constant_Table_ClaimTypePair as ClaimTypePair;

class App_Claim_LinkedClaim_ClaimLinkedProduction
{
    /**
     * ID заявки на производство
     * @var int
     */
    public $claimProductionId = 0;

    /**
     * ID заявки в которой выбрано производство
     * @var int
     */
    public $claimId = 0;

    /**
     * Предыдущее состояние
     * @var App_Claim_LinkedClaim_ClaimLinkedProduction
     */
    public $previousState;

    /**
     * id дочернего проекта, на котором были созданы связанные заявки
     * @var int
     */
    public $subProjectId;


    /**
     * Возвращает право на поле "Производство"
     * @param array $accessArray
     * @return mixed
     * @throws Exception
     */
    public static function getAccess(array $accessArray)
    {
        if (empty($accessArray['claimId'])) {
            throw new \Exception('Не указан ID заявки!');
        }

        if (empty($accessArray['claimTypeId'])) {
            $accessArray['claimTypeId'] = App_Db_Claims::obtain()->getClaimTypeId($accessArray['claimId']);
        }

        if (empty($accessArray['claimTypeId'])) {
            throw new \Exception('Заявка не найдена!1');
        }

        return App_Access::get(
            'all',
            'claim>' . ClaimTypePair::getKeyAlias($accessArray['claimTypeId']) . '>field>',
            $accessArray
        )->linkedproduction;
    }


    /**
     * Создает экземпляр класса по ID заявки на ремонт
     * @param $claimProductionId
     * @return static
     */
    public static function createByClaimProductionId($claimProductionId)
    {
        return static::createByParams(array('claimProductionId' => $claimProductionId))
            ->setProperties((array) App_Db_ClaimLinkedProduction::obtain()->getRow(
                array('claim_production_id = ?' => $claimProductionId), Zend_Db::FETCH_ASSOC
            )
        );
    }


    /**
     * Создает экземпляр класса по ID заявки
     * @param $claimId
     * @return static
     */
    public static function createByClaimId($claimId)
    {
        return static::createByParams(array('claimId' => $claimId))
            ->setProperties((array) App_Db_ClaimLinkedProduction::obtain()->getRow(
                array('claim_id = ?' => $claimId), Zend_Db::FETCH_ASSOC
            )
        );
    }


    /**
     * Создание экземпляра на основе объекта с дочернего проекта
     * @param App_Claim_LinkedClaim_ClaimLinkedProduction $claimLinkedProduction
     * @return App_Claim_LinkedClaim_ClaimLinkedProduction
     */
    public static function createBySubsidiaryClaimLinkedProduction(App_Claim_LinkedClaim_ClaimLinkedProduction $claimLinkedProduction)
    {
        $linkedProduction = static::createByParams(App_Db_ClaimLinked::obtain()->getClaimLinkedProduction($claimLinkedProduction));

        $params = App_Db_ClaimLinkedProduction::obtain()->getBySubClaimOutId(
            $claimLinkedProduction->previousState->claimProductionId,
            $claimLinkedProduction->subProjectId
        );

        $linkedProduction->setProperties(array(
            'previousState' => static::createByParams($params)
        ));

        return $linkedProduction;
    }


    /**
     * Создание экземпляра на основе объекта с дочернего проекта
     * @param App_Claim_LinkedClaim_ClaimLinkedProduction $claimLinkedProduction
     * @return App_Claim_LinkedClaim_ClaimLinkedProduction
     */
    public static function createByMainClaimLinkedProduction(App_Claim_LinkedClaim_ClaimLinkedProduction $claimLinkedProduction)
    {
        $linkedProduction = static::createByParams(App_Db_ClaimLinked::obtain()->getClaimLinkedProduction($claimLinkedProduction));

        $params = App_Db_ClaimLinkedProduction::obtain()->getByMainClaimOutId(
            $claimLinkedProduction->previousState->claimProductionId
        );

        $linkedProduction->setProperties(array(
            'previousState' => static::createByParams($params)
        ));

        return $linkedProduction;
    }


    /**
     * Создает копию себя
     * @return $this
     */
    public function cloneAsPreviousState()
    {
        $this->previousState = clone $this;

        return $this;
    }


    /**
     * Создает экземпляр класса на основе переданных параметров
     * @param array $properties
     * @return static
     */
    public static function createByParams(array $properties)
    {
        $instance = new static();

        return $instance->setProperties($properties);
    }


    /**
     * Сеттер свойств
     * @param array $properties
     * @return $this
     */
    public function setProperties(array $properties)
    {
        foreach ($properties as $propertyName => $propertyValue) {
            // Название свойства в camelCase
            $propertyName = App_Helper_Data::underScoreToCamelCase($propertyName);

            if (property_exists($this, $propertyName)) {
                $this->{$propertyName} = $propertyValue;
            }
        }

        return $this;
    }


    /**
     * Описание
     * @return void
     * @throws Exception
     */
    public function save()
    {
        if (!$this->claimId) {
            throw new \Exception('Не установлен ID заявки!');
        }

        // Сервис для отправки запросов на удаленный проект
        $sender = new App_Network_Service_LinkedProject_Claim_Sender();
        if (App_Project_Repository::getInstance()->getCurrentProject()->isMainProject()) {
            $sender->setProjectId($this->subProjectId);
        }

        // Нет связи с производством, удалить записи
        if (!$this->claimProductionId) {
            // Удалить на локальном проекте (проект на котором был вызов)
            $this->delete();
            // Удалить на удаленном проекте
            if ($sender->getProjectId() > 0) {
                $sender->deleteClaimLinkedProduction($this);
            }
        }
        // Есть связь с производством
        else {
            // Обновить/добавить на локальном проекте (проект на котором был вызов)
            $this->insertUpdate();
            // Обновить/добавить на удаленном проекте
            if ($sender->getProjectId() > 0) {
                $sender->insertUpdateClaimLinkedProduction($this);
            }
        }
    }


    /**
     * Удалить запись
     * @return void
     */
    public function delete()
    {
        App_Db_ClaimLinkedProduction::obtain()->delete(array(
            'claim_id = ?' => (int) $this->previousState->claimId,
            'claim_production_id = ?' => (int) $this->previousState->claimProductionId
        ));

        // удаление записей для нераспределённых затрат
        // форма действует только на проекте, который считается главным
        if (App_Project_Repository::getInstance()->getCurrentProject()->isMainProject()
            && $this->claimId > 0
        ) {
            $repository = new App_UnaccountedCosts_Post_Repositoty();
            $postCollection = $repository->fetchCollection($this->previousState->claimId);
            if ($postCollection->size() > 0) {
                $postCollection->markRemoved();
                $repository->saveCollection($postCollection);
            }
        }
    }


    /**
     * Обновить или добавить запись
     * @return void
     * @throws Exception
     */
    public function insertUpdate()
    {
        $this->delete();

        App_Db_ClaimLinkedProduction::obtain()->insert(array(
            'claim_id' => $this->claimId,
            'claim_production_id' => $this->claimProductionId
        ));

        // создание пустых записей для нераспределённых затрат
        if (App_Project_Repository::getInstance()->getCurrentProject()->isMainProject()
            && $this->claimId > 0
        ) {
            $repository = new App_UnaccountedCosts_Post_Repositoty();
            // на случай замены привязки к производству, удаляем существующие записи
            $existingCollection = $repository->fetchCollection($this->previousState->claimId);
            if ($existingCollection->size() > 0) {
                $existingCollection->markRemoved();
                $repository->saveCollection($existingCollection);
            }

            $postCollection = $repository->fetchNewCollection($this->claimId);
            $repository->saveCollection($postCollection);
        }
    }
}