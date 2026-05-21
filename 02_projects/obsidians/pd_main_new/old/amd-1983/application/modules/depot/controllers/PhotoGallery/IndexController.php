<?php
/**
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author Frolov Anatoliyfrolov_anatoliy@amd-co.ru>
 * @date 09.12.2024
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution
 */


use App\Controller\AngularJS\AbstractFilterPageController;
use App\Depot\PhotoGallery\Index\Filter as Filter;
use App\Depot\PhotoGallery\Index\FilterConfigurator as FilterConfigurator;

/**
 * Модуль Фотогалерея
 */
class Depot_PhotoGallery_IndexController extends AbstractFilterPageController
{
    /**
     *  Инициализация
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Главная страница "Фотогалерея"
     */
    public function indexAction()
    {
        $depotsData = App_Filter_SubFilters_DepotList_ListHandler::getInstance()->getAngularParams();

        $this->_getHeadLink()->appendCssFiles([
            "/css/scss/app/application/depot/photo-gallery/index/index.css",
        ]);

        Zend_Registry::set('statusString', 'Фотогалерея');

        $this->view->getRequire()
            ->setDataMain('/js/app/application/depot/photo-gallery/index/config')
            ->setParams('page.module',
                [
                    'dataTable' => [
                        'urls' => $this->_getDatatableRoutes(),
                    ],
                    'depotsData' => $depotsData,
                ]
            );
    }

    /**
     *  Создание фильтра
     */
    public function createFilter()
    {
        $depots = $this->_getParam('selectedDepots');
        return $this->getFilterConfigurator()->setUpFilter(
            (new Filter())
                ->setShowSql(true)
                ->setOnlyBlocked((int)$this->_getParam('onlyBlocked'))
                ->setNotEmpty((int)$this->_getParam('notEmpty'))
                ->setSearchId((int)$this->_getParam('searchId'))
                ->setAmountWeight((int)$this->_getParam('amountWeight'))
                ->setShowSale((int) $this->_getParam('showSale'))
                ->setDepots($depots)
        );
    }


    public function getFilterConfigurator(): ?\App\Development\TypeScript\FilterConfiguratorInterface
    {
        return (new FilterConfigurator());
    }

    /**
     * Получение данных о товаре по заявке
     */
    public function getClaimDataAction()
    {
        App_Form_AjaxForm_Factory::send(function (App_Form_AjaxForm_Form_AbstractForm $form) {
            $claimId = $this->_getParam('claimId');
            $itemId = $this->_getParam('itemId');

            $data = [];

            $depotIndex = App_Db_Claims::obtain()->getRowField('depot_index', ['id' => $claimId ]);

            if (is_numeric($claimId) && is_numeric($itemId)) {
                if (!is_null($depotIndex)) {
                    $this->depotWrapper = new App_Depot_Wrapper($depotIndex);

                    $sql = "
                    SELECT
                        SUM(amount) amount,
                        SUM(boxes) boxes,
                        SUM(dAmount) depotAmount,
                        SUM(dBoxes) depotBoxes,
                        GROUP_CONCAT(section SEPARATOR ' / ') section,
                        full_id,
                        url,
                        claim_date,
                        claim_client,
                        manager_name,
                        title,
                        bpValue,
                        bpCurPrice,
                        ROUND(AVG(price), 2) price,
                        ROUND(SUM(totalprice), 2) totalprice,
                        ROUND(SUM(depotTotalprice), 2) depotTotalprice,
                        manager_phone
                    FROM
                        (SELECT
                             cp.product_id id,
                             # если товар штучный и по заявке Приход от переработчика новый, берется boxes как amount
                             IF (d2.field15 = 1 AND c.claimType = 12, cp.boxes, cp.amount) AS amount,
                             # если товар штучный и по заявке Приход от переработчика новый, boxes расчитывается из ср. веса
                             IF (d2.field15 = 1 AND c.claimType = 12, cp.boxes/d2.field10, cp.boxes) AS boxes,
                             dd.amount dAmount,
                             dd.boxes dBoxes,
                             dd.placing section,
                             c.full_id,
                             c.url,
                             c.date claim_date,
                             cl.s_title claim_client,
                             u.name manager_name,
                             u.`id` AS userId,
                             GROUP_CONCAT(up.phone SEPARATOR ',') manager_phone,
                             ct.title,
                             bp.value AS bpValue,
                             bp2.cur_price AS bpCurPrice,
                             cp.price,
                             # если товар штучный и по заявке Приход от переработчика новый, берется boxes как amount
                             (cp.price * IF (d2.field15 = 1 AND c.claimType = 12, cp.boxes, cp.amount)) totalprice,
                             (dd.price * dd.amount) depotTotalprice,
                             up.phone
                         FROM
                             claim_products cp
                                 INNER JOIN claims c
                                            ON (cp.claim_id = c.id)
                                 INNER JOIN depot_detailed dd
                                            ON cp.claim_id = dd.claim_id
                                                AND cp.product_id = dd.item_id
                                                AND cp.number = dd.number
                                 INNER JOIN depot_2 AS d2
                                            ON d2.id = cp.product_id
                                 LEFT JOIN (SELECT * FROM base_prices_claim_products bbp) bp
                                           ON (
                                               bp.claim_id = c.id
                                                   AND bp.product_id = cp.product_id
                                                   AND bp.confirmed = '1'
                                                   AND bp.bp_type = '1'
                                               )
                                 LEFT JOIN base_prices bp2
                                           ON (
                                               bp2.item_id = cp.product_id
                                                   AND bp2.cur_date <= NOW()
                                                   AND (
                                                   bp2.date_to >= NOW()
                                                       OR bp2.date_to IS NULL
                                                   )
                                                   AND bp2.type = 2
                                                   AND bp2.bp_type = 1
                                               )
                                 LEFT JOIN claim_type ct
                                           ON (ct.id = c.claimType)
                                 LEFT JOIN clients cl
                                           ON (cl.id = c.client_id)
                                 LEFT JOIN users u
                                           ON (u.id = c.manager_id)
                                 LEFT JOIN user_phone up
                                           ON (up.user_id = u.id) AND
                                              up.corp_phone_id IS NOT NULL
                         WHERE c.id = :claimId
                           AND cp.product_id = :itemId
                           AND (cp.amount != 0)) e
                    GROUP BY id;
                ";

                    $data['itemId']  = $itemId;
                    $data['claimId'] = $claimId;

                    $detailedInfo = App_Db::get()->query($sql, ['claimId' => $claimId, 'itemId' => $itemId])->fetchAll();

                    $data['fields'] = $this->depotWrapper->getBasicConfig();
                    $data['fieldInfo'] = $this->depotWrapper->getFieldData($itemId, true);

                    $data['detailedInfo'] = $detailedInfo;

                }
            }

            return [
                'result' => $data,
            ];
        });


    }
}
