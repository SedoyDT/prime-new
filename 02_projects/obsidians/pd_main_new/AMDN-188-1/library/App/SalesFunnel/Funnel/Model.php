<?php
/**
 * модель
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author Kononov Vladimir<vofchek@gmail.com>
 * @date 21.12.2021
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution

 */

namespace App\SalesFunnel\Funnel;

use App\SalesFunnel\Form\Funnel;
use App\Spl\Markable\ObserverModel as AbstractModel;
use App\SalesFunnel\Funnel\Filter;
use App\SalesFunnel\Stage;
use App\SalesFunnel\Funnel\Datasource\Avito\Collection as AvitoDatasourceCollection;
use \App\SalesFunnel\Funnel\Services\Factory AS FunnelFactory;
class Model extends AbstractModel
{


    /**
     * сущность
     * @var Entity
     */
    protected $_entity;

    /**
     * @var Filter\Department\Collection | callable
     */
    protected $departmentFilterCollection;

    /**
     * @var Filter\Role\Collection | callable
     */
    protected $roleFilterCollection;

    /**
     * @var Filter\User\Collection | callable
     */
    protected $userFilterCollection;

    /**
     * @var Stage\Collection | callable
     */
    protected $stageCollection;

    /**
     * @var DefaultAssignee\Collection | callable
     */
    protected $defaultAssigneeCollection;

    /**
     * @var AvitoDatasourceCollection|callable|null
     */
    protected $avitoDatasource;

    /**
     * @param Entity $_entity
     * @param Filter\Department\Collection|callable $departmentFilterCollection
     * @param Filter\Role\Collection|callable $roleFilterCollection
     * @param Filter\User\Collection|callable $userFilterCollection
     * @param Stage\Collection|callable $stageCollection
     * @param DefaultAssignee\Collection|callable $defaultAssigneeCollection
     */
    public function __construct(
        Entity $_entity,
               $departmentFilterCollection,
               $roleFilterCollection,
               $userFilterCollection,
               $stageCollection,
               $defaultAssigneeCollection
    ) {
        parent::__construct($_entity);

        $this->departmentFilterCollection = $departmentFilterCollection;
        $this->roleFilterCollection = $roleFilterCollection;
        $this->userFilterCollection = $userFilterCollection;
        $this->stageCollection = $stageCollection;
        $this->defaultAssigneeCollection = $defaultAssigneeCollection;
    }

    /**
     * @return Entity
     */
    public function getEntity(): Entity
    {
        return $this->_entity;
    }


    /**
     * @param Entity $entity
     */
    public function setEntity(Entity $entity): void
    {
        $this->_entity = $entity;
    }

    /**
     * @return Filter\Department\Collection
     */
    public function getDepartmentFilterCollection(): Filter\Department\Collection
    {
        if (is_callable($this->departmentFilterCollection)) {
            $this->departmentFilterCollection = call_user_func($this->departmentFilterCollection);
        }
        return $this->departmentFilterCollection;
    }

    /**
     * @return Filter\Role\Collection
     */
    public function getRoleFilterCollection(): Filter\Role\Collection
    {
        if (is_callable($this->roleFilterCollection)) {
            $this->roleFilterCollection = call_user_func($this->roleFilterCollection);
        }
        return $this->roleFilterCollection;
    }

    /**
     * @return Filter\User\Collection
     */
    public function getUserFilterCollection(): Filter\User\Collection
    {
        if (is_callable($this->userFilterCollection)) {
            $this->userFilterCollection = call_user_func($this->userFilterCollection);
        }
        return $this->userFilterCollection;
    }


    /**
     * @return \App\SalesFunnel\Stage\Collection
     */
    public function getStageCollection(): \App\SalesFunnel\Stage\Collection
    {
        if (is_callable($this->stageCollection)) {
            $this->stageCollection = call_user_func($this->stageCollection);
        }
        return $this->stageCollection;
    }

    /**
     * @param Stage\Collection|callable $stageCollection
     */
    public function setStageCollection($stageCollection): void
    {
        $this->stageCollection = $stageCollection;
    }

    /**
     * @return DefaultAssignee\Collection
     */
    public function getDefaultAssigneeCollection(): DefaultAssignee\Collection
    {
        if (is_callable($this->defaultAssigneeCollection)) {
            $this->defaultAssigneeCollection = call_user_func($this->defaultAssigneeCollection);
        }
        return $this->defaultAssigneeCollection;
    }

    /**
     * @return AvitoDatasourceCollection
     */
    public function getAvitoDatasource(): AvitoDatasourceCollection
    {
        if (is_callable($this->avitoDatasource)) {
            $this->avitoDatasource = call_user_func($this->avitoDatasource);
        }
        return $this->avitoDatasource;
    }

    /**
     * @param AvitoDatasourceCollection|callable|null $avitoDatasource
     * @return Model
     */
    public function setAvitoDatasource($avitoDatasource): self
    {
        $this->avitoDatasource = $avitoDatasource;
        return $this;
    }

    /**
     * запуск обновления ограничений видимости
     * @param array $access
     */
    public function updateAccess(array $access)
    {
        $currentAccess = $this->getEntity()->getAccess()->getArrayCopy();

        $this->getEntity()->getAccess()->exchangeArray($access);

        if ($currentAccess != $access) {
            $this->markDirty();
        }
    }
}
