<?php
/**
 * сервис для работы с заявками-списаниями
 * {Template_Description_Abstract}
 * @author Vladimir Kononov
 * @date 15.01.2020
 * @copyright {Template_Description_Copyrights}
 */

namespace App\Product\CompanyEquipment\WriteOffClaim;


use App_Db_Claims;

class Service
{


    /**
     * репозиторий сущностей
     * @var Repository
     */
    protected $_repository;

    /**
     * менеджер блокировок, чтобы управлять блокировками товаров с заявках на списание
     * @var BlockManager
     */
    protected $_blockManager;

    /**
     * фабрика моделей
     * @var Factory
     */
    protected $_factory;

    /**
     * Service constructor.
     * @param Repository $_repository
     * @param BlockManager $_blockManager
     * @param Factory $_factory
     */
    public function __construct(Repository $_repository, BlockManager $_blockManager, Factory $_factory)
    {
        $this->_repository = $_repository;
        $this->_blockManager = $_blockManager;
        $this->_factory = $_factory;
    }

    /**
     * проверка наличия связи между приходом и заявкой-списанием
     * @param int $claimIn
     * @return bool
     */
    public function writeOffClaimExists(int $claimIn) : bool
    {
        $model = $this->_factory->fromClaimIn($claimIn);
        return $model->getEntity()->isPersistent();
    }

    /**
     * найти или создать заявку списание, если её нет
     * @param int $claimIn
     * @return Model
     */
    public function getOrCreateForClaimIn(int $claimIn) : Model
    {
        $model = $this->_factory->fromClaimIn($claimIn);
        if ($model->getEntity()->isPersistent()) {
            return $model;
        }

        return $this->create($claimIn);
    }

    /**
     * создание заявки-списания
     * @param int $claimIn
     * @return Model
     * @throws \Zend_Db_Table_Exception
     */
    public function create(int $claimIn) : Model
    {
        // поиск клиента "Списание"
        if (!defined('CLIENT_WRITEOFF') || CLIENT_WRITEOFF <= 0) {
            throw new \RuntimeException('BAD_CLIENT', 'Клиент "Списание" отсутствует, создать заявку невозможно');
        }

        // создание заявки
        $claimMapper = new \App_Claim_Mapper_Out();
        $depotIndex = App_Db_Claims::obtain()->getRowField('depot_index', ['id = ?' => $claimIn]);

        $claimModel = $claimMapper->create(array(
            'client_id' => CLIENT_WRITEOFF,
            'depot_id' => 0,
            'depot_index' => $depotIndex,
            'payment_flag' => 1,
            'payment' => 1
        ));

        $claimModel->setManagerId(\App_User_Wrapper::getInstance()->getId());
        $claimModel->setDate(\App_Formatter::getCurTime());
        // машина не наша
        $claimModel->setCar(0);
        // флаг диспетчера
        $claimModel->setTaliFlag(1);
        $claimMapper->disableSaveProducts();
        $claimMapper->save($claimModel, true);

        // перевод заявки в статус "закрыта"
        $claimRow = \App_Db_Claims::obtain()->find($claimModel->getId())->current();
        $claimRow->claim_status = 0;
        $claimRow->date_closed = time();
        $claimRow->car_proxy = -1;
        $claimRow->save();

        $model = $this->_factory->fromEntity(new Entity());
        $model->getEntity()->setClaimIn($claimIn);
        $model->getEntity()->setClaimOut($claimModel->getId());
        $this->_repository->save($model->getEntity());

        return $model;
    }

    /**
     * сохранение товаров в заявке на основе результатов сохранения записей об имуществе компании
     * @param int $claimInId
     * @param \App_Product_CompanyEquipment_ChangeList_SaveResult $changes
     * @return void
     * @throws \Zend_Db_Table_Exception
     */
    public function saveChangesResult(int $claimInId, \App_Product_CompanyEquipment_ChangeList_SaveResult $changes)
    {
        $writeOffClaim = $this->getOrCreateForClaimIn($claimInId);

        if ($changes->getAdd()->size() > 0) {
            /** @var \App_Product_CompanyEquipment_Model $model */
            foreach ($changes->getAdd() as $model) {
                $this->getBlockManager()->block($model, $writeOffClaim->getEntity()->getClaimOut());
            }
        }

        if ($changes->getChange()->size() > 0) {
            // полное удаление изменяемых записей
            /** @var \App_Product_CompanyEquipment_Model $model */
            foreach ($changes->getChange() as $model) {
                $this->getBlockManager()->unblock($model, $writeOffClaim->getEntity()->getClaimOut());
                $this->getBlockManager()->block($model, $writeOffClaim->getEntity()->getClaimOut());
            }
        }

//        echo "<pre>" . print_r($changes->getDelete(), true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($changes->getDelete() > 0, true); echo "</pre>"; // FrolovDEBUG
//        exit();
        if ($changes->getDelete()->size() > 0) {
            /** @var \App_Product_CompanyEquipment_Model $model */
            foreach ($changes->getDelete() as $model) {
                $this->getBlockManager()->unblock($model, $writeOffClaim->getEntity()->getClaimOut());
            }

            $this->deleteIfEmpty($writeOffClaim);
        }
    }

    /**
     * удаление пустой заявки
     * пустая заявка - заявка без файлов
     * @param Model $claim
     * @return void
     */
    public function deleteIfEmpty(Model $claim)
    {
        $items = \App_Db_ClaimProducts::obtain()->getRow(['claim_id = ?' => $claim->getEntity()->getClaimOut()]);
        if (empty($items)) {
            $this->_repository->remove($claim->getEntity());
            \App_Db_Claims::obtain()->delete([
                'id = ?' => $claim->getEntity()->getClaimOut()
            ]);
        }
    }

    /**
     * @return BlockManager
     */
    public function getBlockManager(): BlockManager
    {
        return $this->_blockManager;
    }

    /**
     * @return Factory
     */
    public function getFactory(): Factory
    {
        return $this->_factory;
    }
}