<?php

/**
 *
 * Класс для проведения каскада для заявок Приход
 *
 * @author zaharov-a <a3axappob@gmail.com>
 * @date 12.12.2017
 * @copyright
 */

use App\Claim\Cascade\Service\UpdateMarketplaceSupplyPrice;
use App\Claim\LinkedClaim\PaymentStrategy\Out\RecursivePriceUpdateService;
use App_Product_CompanyEquipment_ChangeList_Composite as CompanyEquipmentChangeListComposite;

class App_Claim_Cascade_In extends App_Claim_Cascade_Main
{
    /**
     * Действия после doCascade
     * @throws Exception
     */
    public function afterDoCascade(): void
    {
        parent::afterDoCascade();

        Claim_Model_DepotReject_DepotReject::get($this->claimId)->save(isset($this->request['depotreject']) ? $this->request['depotreject'] : array());

        // Обновление цен в "Поставках маркетплейс"
        (new UpdateMarketplaceSupplyPrice())->updateByAdmissionClaimId(
            $this->claimId
        );
    }

    public function prepareOldModel()
    {
        $result = parent::prepareOldModel();

        // добавляем для каждого товара соответствующую модель имущества компании, чтобы происходило сравнение данных
        if (App_Container::$services->getCompanyEquipmentWriteOffService()->writeOffClaimExists($this->claimModelOld->id)) {
            $newProducts = [];
            foreach ($this->claimModelOld->getProducts() as $product) {
                $companyEquipmentCollection = App_Container::$services->getCompanyEquipmentService()->findByQuery(
                    (new App_Product_CompanyEquipment_Query())
                        ->byDetailedId([App_Db_DepotDetailed::obtain()->getDetailedId($product['depot_id'], $product['claim_id'], $product['number'])])
                );
                if ($companyEquipmentCollection->size() > 0) {
                    $product['companyEquipment'] = $companyEquipmentCollection->getFirst();
                }

                $newProducts[] = $product;
            }
            $this->claimModelOld->setProducts($newProducts);
        }

//        echo "<pre>" . print_r('oldModel', true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($result, true); echo "</pre>"; // FrolovDEBUG
//        exit();
        return $result;
    }

    public function prepareNewModel()
    {
        $result = parent::prepareNewModel();

        if (isset($this->request['companyEquipment']) && !empty($this->request['companyEquipment'])) {
            CompanyEquipmentChangeListComposite::fromArray(json_decode($this->request['companyEquipment'], true))
                ->applyToClaim($this->claimModelNew)
                ->cache();
        }

//        echo "<pre>" . print_r('newModel', true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r('$result', true); echo "</pre>"; // FrolovDEBUG
//        exit();
        return $result;
    }


    /**
     * @return void
     * @throws Exception
     */
    public function onAcceptCascade(): void
    {
        parent::onAcceptCascade();

        // Обновление цен в связанных "Отгрузках" на главном проекте и "Приходах" на дочернем
        RecursivePriceUpdateService::getInstance()->updateMainClaims();
    }
}
