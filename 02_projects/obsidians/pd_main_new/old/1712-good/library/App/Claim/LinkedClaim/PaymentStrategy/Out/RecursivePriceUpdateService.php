<?php

/**
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author Pak Ivan
 * @date 02.02.2024
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution
 */

namespace App\Claim\LinkedClaim\PaymentStrategy\Out;

use App\Event\Claim\Subject\MainOutPriceRecalculateSubject;
use App\Event\Claim\Type\MainOutPriceRecalculateEvent;
use App\Service\EventService;
use App_Claim_LinkedClaim_Closer_SettlementTransactions as SettlementTransactions;
use App_Constant_PaymentTypes;
use App_Constant_Table_TransactionTypes;
use App_Db;
use App_Db_Blocks;
use App_Db_CashAccount;
use App_Db_CashMoney;
use App_Db_CashPlanned;
use App_Db_CashSettlementTransactions;
use App_Db_ClaimLinked;
use App_Db_ClaimPayment;
use App_Db_ClaimProducts;
use App_Db_Claims;
use App_Db_DepotDetailed;
use App_Network_Service_LinkedProject_Claim_Sender;
use App_Salary_SalesReport_Service;
use App_Trait_Singleton;
use Exception;
use Zend_Db;
use Zend_Db_Expr;

/**
 * Сервис для обновления цен в связанных заявках.
 * Запускается при обновлении цен в приходе.
 * Задача сервиса:
 * - на главном проекте в связанных отгрузках установить новую средневзвешенную цену
 * - на дочернем проекте в связанных приходах установить новую средневзвешенную цену
 */
class RecursivePriceUpdateService
{
    use App_Trait_Singleton;

    private $detailedIds = [];


    /**
     * @param int $detailedId
     * @return void
     */
    public function addDetailedId(int $detailedId): void
    {
        if (!in_array($detailedId, $this->detailedIds)) {
            $this->detailedIds[] = $detailedId;
        }
    }


    /**
     * @param array $detailedIds
     */
    public function setDetailedIds(array $detailedIds): void
    {
        $this->detailedIds = $detailedIds;
    }


    /**
     * @throws Exception
     */
    public function updateMainClaims(): void
    {
//        echo "<pre>" . print_r(empty($this->detailedIds), true); echo "</pre>"; // FrolovDEBUG
//        exit();
        if (empty($this->detailedIds)) {
            return;
        }

        /** @var array{main_claim_out_id:int,sub_project_id:int} $linkedClaim */
        foreach ($this->findLinkedClaims() as $linkedClaim) {
            $claimId = $linkedClaim['main_claim_out_id'];
            $prices  = App_Db_Blocks::obtain()->getWeightedAvgInPrices($claimId); // Средневзвешенные цены для отгрузки

            // Обновление цен у товаров
            foreach ($prices as $productId => $price) {
                App_Db_ClaimProducts::obtain()->update(
                    ['price' => $price, 'totalprice' => new Zend_Db_Expr('amount *' . $price)],
                    ['product_id = ?' => $productId, 'claim_id = ?' => $claimId]
                );
            }

            $total = $this->getClaimSumByClaimProducts($claimId);  // Сумма по заявке

            App_Db_Claims::obtain()->update(
                ['summ' => $total],
                ['id = ?' => $claimId]
            );

            // App_Db_ClaimPayment::obtain()->update(
            //    ['factsumm' => $total],
            //    ['claim_id = ?' => $claimId]
            // );

            App_Db_CashPlanned::obtain()->update(
                ['summ' => $total],
                ['reason = ?' => $claimId]
            );

            // Обновление уравнивающих транзакций
            $this->updateSettlementTransactions(
                $claimId, $total
            );

            // Создание корректировок по заявкам
            App_Salary_SalesReport_Service::createCorrection($claimId);
        }

        // Уведомление дочернего проекта об необходимости выполнить каскады
        foreach ($this->findLinkedClaims() as $linkedClaim) {
            $subject = new MainOutPriceRecalculateSubject();
            $subject->setMainClaimOutId($linkedClaim['main_claim_out_id']);
            $subject->setSubClaimOutId($linkedClaim['sub_claim_out_id']);
            $subject->setSubProjectId($linkedClaim['sub_project_id']);

            EventService::getInstance()->trigger(new MainOutPriceRecalculateEvent($subject));
        }

        $this->detailedIds = [];
    }


    /**
     * @param int $mainClaimOutId
     * @param int $subClaimOutId
     * @return void
     * @throws Exception
     */
    public function updateSubClaims(int $mainClaimOutId, int $subClaimOutId): void
    {
        $row = App_Db_ClaimLinked::obtain()->getRow([
            'main_claim_out_id = ?' => $mainClaimOutId,
            'sub_claim_out_id = ?'  => $subClaimOutId
        ]);

        if (!$row || empty($row['sub_claim_in_id'])) {
            return;
        }

        $sender = new App_Network_Service_LinkedProject_Claim_Sender();
        $prices = $sender->getWeightedAvgInPrices($subClaimOutId);

        // Обновление цен у товаров
        foreach ($prices as $productId => $price) {
            App_Db_ClaimProducts::obtain()->update(
                ['price' => $price, 'totalprice' => new Zend_Db_Expr('amount *' . $price)],
                ['product_id = ?' => $productId, 'claim_id = ?' => $row['sub_claim_in_id']]
            );
        }

        $total = $this->getClaimSumByClaimProducts($row['sub_claim_in_id']);  // Сумма по заявке

        $sql= "
            UPDATE depot_detailed AS dd
            INNER JOIN claim_products AS cp ON
                cp.claim_id = dd.claim_id AND
                cp.product_id = dd.item_id AND
                cp.number = dd.number
            SET
                dd.price = cp.price,
                dd.totalprice = cp.totalprice
            WHERE
                dd.claim_id = :claimId;
        ";

        App_Db_DepotDetailed::obtain()->getAdapter()->query($sql, ['claimId' => $row['sub_claim_in_id']]);

        // App_Db_Claims::obtain()->update(
        //    ['summ' => $total],
        //    ['id = ?' => $row['sub_claim_in_id']]
        // );

        App_Db_ClaimPayment::obtain()->update(
            ['factsumm' => $total],
            ['claim_id = ?' => $row['sub_claim_in_id']]
        );

        // App_Db_CashPlanned::obtain()->update(
        //    ['summ' => $total],
        //    ['reason = ?' => $row['sub_claim_in_id']]
        // );

        $this->updateSettlementTransactions(
            $row['sub_claim_in_id'], ($total * -1)
        );

        // Создание корректировок по заявкам
        App_Salary_SalesReport_Service::createCorrection($row['sub_claim_out_id']);
    }


    /**
     * @throws Exception
     */
    private function updateSettlementTransactions(int $claimId, float $total): void
    {
        // Обновление уравнивающих транзакций
        $settlementTransactions = App_Db_CashSettlementTransactions::obtain()->getRows([
            'claim_id = ?' => $claimId
        ]);

        if ($settlementTransactions) {
            foreach ($settlementTransactions as $settlementTransaction) {
                if ($settlementTransaction['trans_type'] == App_Constant_PaymentTypes::TYPE_ACCOUNT) {
                    App_Db_CashAccount::obtain()->update(['summ' => $total], ['id = ?' => $settlementTransaction['trans_id']]);
                } else {
                    App_Db_CashMoney::obtain()->update(['summ' => $total], ['id = ?' => $settlementTransaction['trans_id']]);
                }
            }
        } else {
            $transactionSign = $total >= 0 ? 1 : -1;
            $transactionType = $transactionSign === -1
                ? App_Constant_Table_TransactionTypes::TYPE_PURCHASE
                : App_Constant_Table_TransactionTypes::TYPE_SALE;

            (new SettlementTransactions($claimId))
                ->setImaginaryBehaviour(true)
                ->createTransaction([
                    'transaction_type' => $transactionType,
                    'sum_multiplier'   => $transactionSign,
                ]);
        }
    }


    /**
     * @return array<array{main_claim_out_id:int,sub_project_id:int}>
     * @throws Exception
     */
    private function findLinkedClaims(): array
    {
        $detailedIds = join(',', $this->detailedIds) ?: -1;

        $sql = "
            SELECT DISTINCT
                cl.main_claim_out_id,
                cl.sub_claim_out_id,
                cl.sub_project_id
            FROM depot_detailed AS dd
            INNER JOIN blocks AS b ON
                b.detailed_id = dd.id AND
                b.state = 0
            INNER JOIN claims AS c ON
                c.id = b.claim_id
            INNER JOIN claim_linked AS cl ON
                cl.main_claim_out_id = b.claim_id AND
                cl.sub_project_id = 18
            WHERE
                c.payment = " . App_Constant_PaymentTypes::TYPE_ACCOUNT . " AND
                dd.id IN ($detailedIds)
        ";

        return App_Db::get()->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC) ?: [];
    }


    /**
     * @param int $claimId
     * @return float
     */
    private function getClaimSumByClaimProducts(int $claimId): float
    {
        $sql = "
            SELECT SUM(cp.price * cp.amount)
            FROM claim_products AS cp
            WHERE
                cp.claim_id = :claimId;
        ";

        return (float) App_Db_ClaimProducts::obtain()->getAdapter()->fetchOne($sql, ['claimId' => $claimId]);
    }
}
