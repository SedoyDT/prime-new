<?php

/**
 * Настройки аналитики
 */
class Analitics_Bootstrap extends Zend_Application_Module_Bootstrap
{
    /**
     * Инициализация путей аналитических отчетов
     * @return void
     */
    public function _initFinanceRoutes()
    {
        $this->bootstrap('frontController');

        /** @var $frontController Zend_Controller_Front */
        $frontController = $this->getResource('frontController');

        /** @var $router Zend_Controller_Router_Rewrite */
        $router = $frontController->getRouter();

        $router->addRoute('depotPhotoGallery', new Zend_Controller_Router_Route(
            '/depot/photo-gallery/:action/',
            [
                'module' => 'depot',
                'controller' => 'photo-gallery_index',
                'action' => 'index',
            ]
        ));


        // add /analitics/finance/status/:status route
        $router->addRoute("analytics_finance_index", new Zend_Controller_Router_Route(
            "/analitics/finance/status/:status",
            array(
                'module' => 'analitics',
                'controller' => "finance",
                'action' => 'index'
            )
        ));

        // add /analitics/finance/status/:status/:id route
        $router->addRoute("analytics_finance_index_id", new Zend_Controller_Router_Route(
            "/analitics/finance/status/:status/:id",
            array(
                'module' => 'analitics',
                'controller' => "finance",
                'action' => 'index'
            )
        ));

        $router->addRoute("analytics_balance_verify", new Zend_Controller_Router_Route(
            "/analitics/balance/verify/:action",
            array(
                'module' => 'analitics',
                'controller' => "balance_verify",
                'action' => 'index'
            )
        ));

        // add /analitics/finance/status/:status route
        foreach (array('getfilterresult', 'getfiltermask', 'getfilterconfig', 'setworkperiod', 'getfilterexcel') as $action) {
            $router->addRoute("analytics_finance_{$action}", new Zend_Controller_Router_Route(
                "/analitics/finance/status/:status/{$action}",
                array(
                    'module' => 'analitics',
                    'controller' => "finance",
                    'action' => $action
                )
            ));
        }

        // Акты сверки
        foreach (array('list', 'report') as $type)
        {
            foreach (array('client', 'ajax', 'old') as $controller)
            {
                $router->addRoute("analitics_act_revise_control_{$type}_{$controller}", new Zend_Controller_Router_Route(
                    "/analitics/act/revise/control/{$type}/{$controller}/:action/:id",
                    array(
                        'module'     => 'analitics',
                        'controller' => "act_revise_control_{$type}_{$controller}",
                        'action'     => 'index',
                        'id'         => 0
                    )
                ));
            }
        }

        // Маршруты для аренды склада
        foreach (array('penalty') as $recipient) {
            // Разделы аренды склада
            foreach (array('active', 'ajax', 'unpaid', 'product-data') as $controller) {
                // Добавление маршрута
                $router->addRoute("analitics_depot_rent_{$recipient}_list_{$controller}", new Zend_Controller_Router_Route(
                    "/analitics/depot/rent/{$recipient}/list/{$controller}/:action",
                    array(
                        'module' => 'analitics',
                        'controller' => "depot_rent_{$recipient}_list_{$controller}",
                        'action' => 'index'

                    )
                ));
            }
        }

        // Маршруты для Yandex метрики
        foreach (array('metrika') as $recipient) {
            // Разделы аренды склада
            foreach (array('accounts','report','counter-history','ajax','api') as $controller) {
                // Добавление маршрута
                $router->addRoute("analitics_{$recipient}_{$controller}", new Zend_Controller_Router_Route(
                    "/analitics/{$recipient}/{$controller}/:action",
                    array(
                        'module' => 'analitics',
                        'controller' => "{$recipient}_{$controller}",
                        'action' => 'index'
                    )
                ));
            }
        }

        // add /analitics/depot/analysis/:action route анализ склада
        $router->addRoute("analitics_depot_analysis", new Zend_Controller_Router_Route(
            "/analitics/depot/analysis/:action",
            array(
                'module' => 'analitics',
                'controller' => "depot_analysis_index",
                'action' => 'index'
            )
        ));

        // a set of routes
        $routes = array (
            'dynamic'       => array('module' => 'analitics', 'controller' => 'dynamic_index', 'action' => 'index', 'urlParam' => 'dynamic/:action/:id'),
            'dynamic_index' => array('module' => 'analitics', 'controller' => 'dynamic_index', 'action' => 'index', 'urlParam' => 'dynamic/index/:action/:id'),
            'dynamic_ajax'  => array('module' => 'analitics', 'controller' => 'dynamic_ajax',  'action' => 'index', 'urlParam' => 'dynamic/ajax/:action/:id'),
            'dynamic_out'   => array('module' => 'analitics', 'controller' => 'dynamic_out',   'action' => 'index', 'urlParam' => 'dynamic/out/:action/:id'),
            'dynamic_price' => array('module' => 'analitics', 'controller' => 'dynamic_price', 'action' => 'index', 'urlParam' => 'dynamic/price/:action/:id'),
        );

        // compile a set of routes
        foreach ($routes as $key => $route) {
            $router->addRoute("analitics_" . $key, new Zend_Controller_Router_Route (
                '/analitics/' . $route['urlParam'],
                array (
                    'module'     => $route['module'],
                    'controller' => $route['controller'],
                    'action'     => $route['action'],
                    'id' => 0
                )
            ));
        }

        // Брони заказов
        $router->addRoute("analyticsManagersBlocksList", new Zend_Controller_Router_Route(
            "/analitics/managersblocks/list/:action",
            array(
                'module' => 'analitics',
                'controller' => "managers-blocks_list",
                'action' => 'index'
            )
        ));

        // Брони заказов (разблокировка)
        $router->addRoute("analyticsManagersBlocksTransfer", new Zend_Controller_Router_Route(
            "/analitics/managersblocks/transfer/:action",
            array(
                'module' => 'analitics',
                'controller' => "managers-blocks_transfer",
                'action' => 'index'
            )
        ));

        //Клиенты в свободном доступе
        $router->addRoute("analyticsFreeClientsList", new Zend_Controller_Router_Route(
            "/analitics/free-clients",
            array(
                'module' => 'analitics',
                'controller' => 'free-clients_list',
                'action' => 'index'
            )
        ));

        // ЗП отчеты "Список"
        $router->addRoute("analyticsRawSalaryReports", new Zend_Controller_Router_Route(
            "/analitics/raw/salary-reports/:action",
            array(
                'module' => 'analitics',
                'controller' => 'raw_salary-reports',
                'action' => 'index'
            )
        ));

        // Тюки принятые на склад
        $router->addRoute("analyticsRawAcceptedBales", new Zend_Controller_Router_Route(
            "/analitics/raw/accepted-bales/:action",
            array(
                'module' => 'analitics',
                'controller' => 'raw_accepted-bales',
                'action' => 'index'
            )
        ));

        // Тюки по бригадам
        $router->addRoute("analyticsRawTeamBales", new Zend_Controller_Router_Route(
            "/analitics/raw/team-bales/:action",
            array(
                'module' => 'analitics',
                'controller' => 'raw_team-bales',
                'action' => 'index'
            )
        ));

        // Детализация по тоннажу
        $router->addRoute("analyticsRawTonnageSortingDetails", new Zend_Controller_Router_Route(
            "/analitics/raw/tonnage-sorting-details/:action/*",
            array(
                'module' => 'analitics',
                'controller' => 'raw_tonnage-sorting-details',
                'action' => 'index',
            )
        ));

        // Товары НК
        $router->addRoute("analyticsRawBadQuality", new Zend_Controller_Router_Route(
            "/analitics/raw/bad-quality/:action",
            array(
                'module' => 'analitics',
                'controller' => 'raw_bad-quality',
                'action' => 'index'
            )
        ));

        // Тарифы для бригад
        $router->addRoute("analyticsRawDifficultyRates", new Zend_Controller_Router_Route(
            "/analitics/raw/difficulty-rates/:action",
            array(
                'module' => 'analitics',
                'controller' => 'raw_difficulty-rates',
                'action' => 'index'
            )
        ));

        // Отгрузки по факту продажи
        $router->addRoute("analyticsRawPostpaidShipment", new Zend_Controller_Router_Route(
            "/analitics/raw/postpaid-shipment/:action",
            array(
                'module' => 'analitics',
                'controller' => 'raw_postpaid-shipment',
                'action' => 'index'
            )
        ));

        // AJAX контроллер для работы с запросами по тарифам сортировки
        $router->addRoute("analyticsRawAjax", new Zend_Controller_Router_Route(
            "/analitics/raw/ajax/:action",
            array(
                'module' => 'analitics',
                'controller' => 'raw_ajax',
                'action' => 'index'
            )
        ));

         // Оплата по факту продажи
        $router->addRoute("analyticsRawAllocationAdjustment", new Zend_Controller_Router_Route(
            "/analitics/raw/allocation-adjustment/:action",
            array(
                'module' => 'analitics',
                'controller' => 'raw_allocation-adjustment',
                'action' => 'index'
            )
        ));

        // ЗП за сырьё
        foreach (array("", "excelin") as $action) {
            $router->addRoute("analyticsRawSalary" .$action, new Zend_Controller_Router_Route(
                "/analitics/raw/salary/" . $action,
                array(
                    'module' => 'analitics',
                    'controller' => 'raw_salary',
                    'action' => $action
                )
            ));
        }

        $router->addRoute("analyticsFreeClientsListIndex", new Zend_Controller_Router_Route(
            "/analitics/free-clients/list/:action",
            array(
                'module' => 'analitics',
                'controller' => 'free-clients_list',
                'action' => 'index'
            )
        ));

        //Клиенты в свободном доступе - аякс действия
        $router->addRoute("analyticsFreeClientsListAjax", new Zend_Controller_Router_Route(
            "/analitics/free-clients/ajax/:action",
            array(
                'module' => 'analitics',
                'controller' => 'free-clients_ajax',
            )
        ));

        $router->addRoute("analyticsFreeClientsAssigmentHistoryIndex", new Zend_Controller_Router_Route(
            "/analitics/free-clients/assigment-history/:action",
            array(
                'module' => 'analitics',
                'controller' => 'free-clients_assigment-history',
                'action' => 'index'
            )
        ));

        $router->addRoute("analyticsFreeClientsRiskZone", new Zend_Controller_Router_Route(
            "/analitics/free-clients/risk-zone/:action",
            array(
                'module' => 'analitics',
                'controller' => 'free-clients_risk-zone',
                'action' => 'index'
            )
        ));

        $router->addRoute("analyticsFreeClientsSales", new Zend_Controller_Router_Route(
            "/analitics/free-clients/sales/:action",
            array(
                'module' => 'analitics',
                'controller' => 'free-clients_sales',
                'action' => 'index',
            )
        ));

        $router->addRoute("analyticsFreeClientsAssignmentForm", new Zend_Controller_Router_Route(
            "/analitics/free-clients/assignment-form/:action",
            array(
                'module' => 'analitics',
                'controller' => 'free-clients_assignment-form',
            )
        ));

        /*Отчёт "Нераспределённые мнимые тюки"*/
        $router->addRoute("analyticsImaginaryBalesUnallocatedIndex", new Zend_Controller_Router_Route(
            "/analitics/imaginary-bales-unallocated/",
            array(
                'module' => 'analitics',
                'controller' => 'imaginary-bales-unallocated_index',
                'action' => 'index'
            )
        ));
        $router->addRoute("analyticsImaginaryBalesUnallocatedIndexAction", new Zend_Controller_Router_Route(
            "/analitics/imaginary-bales-unallocated/:action",
            array(
                'module' => 'analitics',
                'controller' => 'imaginary-bales-unallocated_index',
            )
        ));
        $router->addRoute("analyticsImaginaryBalesUnallocated", new Zend_Controller_Router_Route(
            "/analitics/imaginary-bales-unallocated/index/:action",
            array(
                'module' => 'analitics',
                'controller' => 'imaginary-bales-unallocated_index',
            )
        ));
        $router->addRoute("analyticsImaginaryBalesUnallocatedImaginaryBales", new Zend_Controller_Router_Route(
            "/analitics/imaginary-bales-unallocated/imaginary-bales/:action",
            array(
                'module' => 'analitics',
                'controller' => 'imaginary-bales-unallocated_imaginary-bales',
            )
        ));
        $router->addRoute("analyticsImaginaryBalesUnallocatedRemainingBales", new Zend_Controller_Router_Route(
            "/analitics/imaginary-bales-unallocated/remaining-bales/:action",
            array(
                'module' => 'analitics',
                'controller' => 'imaginary-bales-unallocated_remaining-bales',
            )
        ));
        $router->addRoute("analyticsImaginaryBalesUnallocatedAllocatedBales", new Zend_Controller_Router_Route(
            "/analitics/imaginary-bales-unallocated/allocated-bales/:action",
            array(
                'module' => 'analitics',
                'controller' => 'imaginary-bales-unallocated_allocated-bales',
            )
        ));

        $router->addRoute("impossibleToMake", new Zend_Controller_Router_Route(
            "/analitics/impossibletomake/:action/:pageType",
            array(
                'module' => 'analitics',
                'controller' => 'impossibletomake',
                'action' => 'index',
                'pageType' => 'active',
            )
        ));

        $router->addRoute("claimProductionPricesEquality", new Zend_Controller_Router_Route(
            "/analitics/claim-production-prices-equality/:action",
            array(
                'module' => 'analitics',
                'controller' => 'claim-production_prices-equality',
                'action' => 'index'
            )
        ));

        // Внешний модйль учёта
        $router->addRoute("inventory_analitics_expenses", new Zend_Controller_Router_Route (
            '/analitics/inventory/expenses/:action',
            array (
                'module'     => 'analitics',
                'controller' => 'inventory_expenses',
                'action'     => 'index',
                'id' => 0
            )
        ));

        $router->addRoute("receiptTemplate", new Zend_Controller_Router_Route(
            "/analitics/receipttemplates",
            array(
                'module' => 'analitics',
                'controller' => 'receipt-templates_index',
                'action' => ''
            )
        ));

        $router->addRoute("receiptTemplateIndex", new Zend_Controller_Router_Route(
            "/analitics/receipttemplates/:action",
            array(
                'module' => 'analitics',
                'controller' => 'receipt-templates_index',
            )
        ));

        $router->addRoute("receiptTemplateItemAlternative", new Zend_Controller_Router_Route(
            "/analitics/receipttemplates/item-alternative/:action",
            array(
                'module' => 'analitics',
                'controller' => 'receipt-templates_item-alternative',
                'action' => 'index'
            )
        ));

        $router->addRoute("receiptAlternativeGroupIndex", new Zend_Controller_Router_Route(
            "/analitics/receipt-alternative-group/index/:action",
            array(
                'module' => 'analitics',
                'controller' => 'receipt-alternative-group_index',
                'action' => 'index'
            )
        ));

        $router->addRoute("receiptAlternativeGroupEdit", new Zend_Controller_Router_Route(
            "/analitics/receipt-alternative-group/edit/:action",
            array(
                'module' => 'analitics',
                'controller' => 'receipt-alternative-group_edit',
                'action' => 'index'
            )
        ));

        // Отчет аренда "Рекламы" аренда "Недвижимости"
        $router->addRoute("rentable", new Zend_Controller_Router_Route(
            "/analitics/rentable/:action",
            array(
                'module' => 'analitics',
                'controller' => 'rentable_index',
                'action' => ''
            )
        ));

        // Отчет аренда "Рекламы"
        $router->addRoute("rentableAds", new Zend_Controller_Router_Route(
            "/analitics/rentable/ads/:action",
            array(
                'module' => 'analitics',
                'controller' => 'rentable_ads',
                'action' => ''
            )
        ));

        // История изменения статусов объектов аренды
        $router->addRoute("rentableAdsHistory", new Zend_Controller_Router_Route(
            "/analitics/rentable/ads/history/:action",
            array(
                'module' => 'analitics',
                'controller' => 'rentable_ads_history',
                'action' => ''
            )
        ));


        // Отчет аренда "Недвижимости"
        $router->addRoute("rentableRealty", new Zend_Controller_Router_Route(
            "/analitics/rentable/realty/:action",
            array(
                'module' => 'analitics',
                'controller' => 'rentable_realty',
                'action' => 'index'
            )
        ));

        $router->addRoute("analyticsAccountExpensesAnalysisList", new Zend_Controller_Router_Route(
            "/analitics/account-expenses-analysis",
            array(
                'module' => 'analitics',
                'controller' => 'account-expenses-analysis_list',
                'action' => 'index'
            )
        ));

        $router->addRoute("analyticsAccountExpensesAnalysisListIndex", new Zend_Controller_Router_Route(
            "/analitics/account-expenses-analysis/list/:action",
            array(
                'module' => 'analitics',
                'controller' => 'account-expenses-analysis_list',
                'action' => 'index'
            )
        ));

        $router->addRoute("analyticsAccountExpensesAnalysisTransaction", new Zend_Controller_Router_Route(
            "/analitics/account-expenses-analysis/transaction/:action",
            array(
                'module' => 'analitics',
                'controller' => 'account-expenses-analysis_transaction',
                'action' => 'index'
            )
        ));

        // История показов объекта недвижимости
        $router->addRoute("rentableRealtyShow", new Zend_Controller_Router_Route(
            "/analitics/rentable/realty/show/:action",
            array(
                'module' => 'analitics',
                'controller' => 'rentable_realty_show',
                'action' => ''
            )
        ));

        // Объекты рекламы для услуг в заявке на аренду
        $router->addRoute("rentableAdsItem", new Zend_Controller_Router_Route(
            "/analitics/rentable/item/ads-item/:action",
            array(
                'module' => 'analitics',
                'controller' => 'rentable_item_ads-item',
                'action' => ''
            )
        ));

        // Объекты недвижимости для услуг в заявке на аренду
        $router->addRoute("rentableRealtyItem", new Zend_Controller_Router_Route(
            "/analitics/rentable/item/realty-item/:action",
            array(
                'module' => 'analitics',
                'controller' => 'rentable_item_realty-item',
                'action' => ''
            )
        ));

        // Параметры схожести для модуля "Потенциальные клиенты"
        $router->addRoute('analyticsPotentialclientsSimilarproducts', new Zend_Controller_Router_Route(
            '/analitics/potentialclients/similarproducts/:itemType',
            array(
                'module' => 'analitics',
                'controller' => 'potentialclients_similarproducts',
                'action' => 'index',
                'itemType' => false
            )
        ));

        // Форма добавления объекта аренды
        $router->addRoute("rentableForm", new Zend_Controller_Router_Route(
            "/analitics/rentable/form/:action",
            array(
                'module' => 'analitics',
                'controller' => 'rentable_form',
                'action' => ''
            )
        ));

        $router->addRoute("analyticsAccountExpensesAnalysisTicket", new Zend_Controller_Router_Route(
            "/analitics/account-expenses-analysis/ticket/:action",
            array(
                'module' => 'analitics',
                'controller' => 'account-expenses-analysis_ticket',
                'action' => 'index'
            )
        ));

        $router->addRoute("analyticsAccountExpensesAnalysisAjax", new Zend_Controller_Router_Route(
            "/analitics/account-expenses-analysis/ajax/:action",
            array(
                'module' => 'analitics',
                'controller' => 'account-expenses-analysis_ajax',
                'action' => 'index'
            )
        ));

        $router->addRoute('analyticsPotentialclients', new Zend_Controller_Router_Route(
            '/analitics/potentialclients/:action/',
            [
                'module' => 'analitics',
                'controller' => 'potential-clients_index',
                'action' => 'index',
            ]
        ));

        $router->addRoute('analyticsPotentialclientsShow', new Zend_Controller_Router_Route(
            '/analitics/potentialclients/show/:action/',
            [
                'module' => 'analitics',
                'controller' => 'potential-clients_show',
                'action' => 'index',
            ]
        ));

        $router->addRoute("analiticsDirectorWageIndex", new Zend_Controller_Router_Route(
            "/analitics/director-wage/index/:action",
            array(
                'module' => 'analitics',
                'controller' => 'director-wage_index',
                'action' => 'index'
            )
        ));

        $router->addRoute("analiticsDirectorWageAjax", new Zend_Controller_Router_Route(
            "/analitics/director-wage/ajax/:action",
            array(
                'module' => 'analitics',
                'controller' => 'director-wage_ajax',
                'action' => 'index'
            )
        ));

        $router->addRoute("analiticsDirectorWageDetailedExpenseGrid", new Zend_Controller_Router_Route(
            "/analitics/director-wage/detailed-expense/:action",
            array(
                'module' => 'analitics',
                'controller' => 'director-wage_detailed-expense',
            )
        ));

        $router->addRoute("analiticsDirectorWageDetailedExpenseIndex", new Zend_Controller_Router_Route(
            "/analitics/director-wage/detailed-expense/index/:dateFrom/:dateTo",
            array(
                'module' => 'analitics',
                'controller' => 'director-wage_detailed-expense',
                'action' => 'index'
            )
        ));

        $router->addRoute("analiticsDirectorWageView", new Zend_Controller_Router_Route(
            "/analitics/director-wage/view/:year/:month",
            array(
                'module' => 'analitics',
                'controller' => 'director-wage_view',
                'action' => 'index'
            )
        ));

        $router->addRoute("analiticsDirectorWageBalanceIndex", new Zend_Controller_Router_Route(
            "/analitics/director-wage/balance/index/:userId",
            array(
                'module' => 'analitics',
                'controller' => 'director-wage_balance_index',
                'action' => 'index'
            )
        ));

        $router->addRoute("analiticsDirectorWageBalanceAjax", new Zend_Controller_Router_Route(
            "/analitics/director-wage/balance/ajax/:action",
            array(
                'module' => 'analitics',
                'controller' => 'director-wage_balance_ajax',
                'action' => 'index'
            )
        ));

        $router->addRoute("analiticsSupplierMotivationBalance", new Zend_Controller_Router_Route(
            "/analitics/director-wage/balance/supplier-motivation/:action",
            array(
                'module' => 'analitics',
                'controller' => 'director-wage_balance_supplier-motivation',
                'action' => 'index'
            )
        ));

        $router->addRoute("analiticsSupplierMotivationBalanceByUserOnDate", new Zend_Controller_Router_Route(
            "/analitics/director-wage/balance/supplier-motivation/:userId/:onDate",
            array(
                'module' => 'analitics',
                'controller' => 'director-wage_balance_supplier-motivation',
                'action' => 'index',
            )
        ));

        $router->addRoute("analiticsSupplierMotivationBalanceByUser", new Zend_Controller_Router_Route_Regex(
            "analitics/director-wage/balance/supplier-motivation/(\d+)",
            [
                'module' => 'analitics',
                'controller' => 'director-wage_balance_supplier-motivation',
                'action' => 'index',
            ],
            [
                'userId' => 1, // номер группы из regexp
            ],
            "analitics/director-wage/balance/supplier-motivation/%s"
        ));

        $router->addRoute("managerTonnageStatIndex", new Zend_Controller_Router_Route(
            "/analitics/manager-tonnage-stat/index/:action",
            array(
                'module' => 'analitics',
                'controller' => 'manager-tonnage-stat_index',
                'action' => 'index'
            )
        ));

        $router->addRoute("totalPriceTonnageControl", new Zend_Controller_Router_Route(
            "/analitics/total-price-tonnage-control/index/:action",
            array(
                'module' => 'analitics',
                'controller' => 'total-price-tonnage-control',
                'action' => 'index'
            )
        ));

        $router->addRoute("analiticReceiptClientActRevise", new Zend_Controller_Router_Route(
            "/analitics/receipt-client-act-revise/index/:action",
            array(
                'module' => 'analitics',
                'controller' => 'receipt-client-act-revise',
                'action' => 'index'
            )
        ));

        $router->addRoute("analiticReceiptClientActReviseClient", new Zend_Controller_Router_Route(
            "/analitics/receipt-client-act-revise/index/client_id/:clientId",
            array(
                'module' => 'analitics',
                'controller' => 'receipt-client-act-revise',
                'action' => 'index',
            ),
            [
                'clientId' => '\d+'
            ]
        ));

        // /6673 - для теста, чтобы можно было заходить на текущий модуль
        $router->addRoute("clientContractTreatyIndex", new Zend_Controller_Router_Route(
            "/analitics/client-contract/treaty/:action",
            array(
                'module' => 'analitics',
                'controller' => 'client-contract_treaty',
                'action' => 'index'
            )
        ));

        $router->addRoute("clientContractLeaseIndex", new Zend_Controller_Router_Route(
            "/analitics/client-contract/lease/:action",
            array(
                'module' => 'analitics',
                'controller' => 'client-contract_lease',
                'action' => 'index'
            )
        ));

        $router->addRoute("clientContractPurchaseIndex", new Zend_Controller_Router_Route(
            "/analitics/client-contract/purchase/:action",
            array(
                'module' => 'analitics',
                'controller' => 'client-contract_purchase',
                'action' => 'index'
            )
        ));

        $router->addRoute("clientContractMarketplaceIndex", new Zend_Controller_Router_Route(
            "/analitics/client-contract/marketplace/:action",
            array(
                'module' => 'analitics',
                'controller' => 'client-contract_marketplace',
                'action' => 'index'
            )
        ));

        $router->addRoute("clientContractOtherIndex", new Zend_Controller_Router_Route(
            "/analitics/client-contract/other/:action",
            array(
                'module' => 'analitics',
                'controller' => 'client-contract_other',
                'action' => 'index'
            )
        ));

        $router->addRoute("clientContractAjax", new Zend_Controller_Router_Route(
            "/analitics/client-contract/ajax/:action",
            array(
                'module' => 'analitics',
                'controller' => 'client-contract_ajax',
                'action' => 'index'
            )
        ));

        $router->addRoute("analiticsAdditionalClientContract", new Zend_Controller_Router_Route(
            "/analitics/client-contract/additional/:action",
            array(
                'module' => 'analitics',
                'controller' => 'client-contract_additional',
                'action' => 'index'
            )
        ));

        $router->addRoute("analiticsClientContractAgreementList", new Zend_Controller_Router_Route(
            "/analitics/client-contract/agreement-list/:action",
            array(
                'module' => 'analitics',
                'controller' => 'client-contract_agreement-list',
                'action' => 'index'
            )
        ));

        $router->addRoute("analiticsClientContractGateway", new Zend_Controller_Router_Route(
            "/analitics/client-contract/gateway/route-to/:typeId/:clientId",
            array(
                'module' => 'analitics',
                'controller' => 'client-contract_gateway',
                'action' => 'route-to',
                'typeId' => 0,
                'clientId' => 0,
            )
        ));

        $router->addRoute("analiticsControlofdebtsClientContract", new Zend_Controller_Router_Route(
            "/analitics/controlofdebts/client-contract/:action",
            array(
                'module' => 'analitics',
                'controller' => 'controlofdebts_client-contract',
                'action' => 'index'
            )
        ));

        $router->addRoute("analiticsCashProjectDepotDetailed", new Zend_Controller_Router_Route(
            "/analitics/cash-project-depot-detailed/:action/",
            array(
                'module' => 'analitics',
                'controller' => 'cash-project-depot-detailed',
                'action' => 'index',
            )
        ));

        $router->addRoute("analiticsUserEvent", new Zend_Controller_Router_Route(
            "/analitics/user-event/:action/",
            array(
                'module' => 'analitics',
                'controller' => 'user-event',
                'action' => 'index',
            )
        ));

        $router->addRoute("analiticsContractOfService", new Zend_Controller_Router_Route(
            "/analitics/contract-of-service/:action",
            [
                'module' => 'analitics',
                'controller' => 'contract-of-service',
                'action' => 'index'
            ]
        ));

        $router->addRoute("analiticsJudicialClient", new Zend_Controller_Router_Route(
            "/analitics/judicial/id/:id",
            [
                'module' => 'analitics',
                'controller' => 'judicial',
                'action' => 'index',
                'id' => 0
            ]
        ));

        $router->addRoute("customsDocuments", new Zend_Controller_Router_Route(
            "/analitics/documents/customs-documents/:action",
            [
                'module' => 'analitics',
                'controller' => 'documents_customs-documents',
                'action' => 'index',
            ]
        ));
        $router->addRoute("customsDocumentsDownload", new Zend_Controller_Router_Route(
            "/analitics/documents/customs-documents/download-report-archive/:hash",
            [
                'module' => 'analitics',
                'controller' => 'documents_customs-documents',
                'action' => 'download-report-archive',
            ]
        ));
        $router->addRoute("analitycsIndexDocuments", new Zend_Controller_Router_Route(
            "/analitics/documents/index/:action",
            [
                'module' => 'analitics',
                'controller' => 'documents_index',
                'action' => 'index',
            ]
        ));
        $router->addRoute("analitycsDocumentsSheet", new Zend_Controller_Router_Route(
            "/analitics/documents/sheet/:action",
            [
                'module' => 'analitics',
                'controller' => 'documents_sheet',
                'action' => 'index',
            ]
        ));
        $router->addRoute("analitycsDocumentsSheetIndex", new Zend_Controller_Router_Route(
            "/analitics/documents/sheet/:sheetId/:action",
            [
                'module' => 'analitics',
                'controller' => 'documents_sheet',
                'action' => 'index',
                'sheetId' => 0,
            ],
            [
                'sheetId' => '\d+'
            ]
        ));
        $router->addRoute("analitycsDocumentsSheetList", new Zend_Controller_Router_Route(
            "/analitics/documents/sheet-list/:action",
            [
                'module' => 'analitics',
                'controller' => 'documents_sheet-list',
                'action' => 'index',
            ]
        ));

        $router->addRoute("productionClosedByManagerActive", new Zend_Controller_Router_Route(
            "/analitics/closedbymanager/active/:action",
            [
                'module' => 'analitics',
                'controller' => 'closedbymanager',
                'action' => 'index',
                'state' => 'active'
            ]
        ));
        $router->addRoute("productionClosedByManagerArchive", new Zend_Controller_Router_Route(
            "/analitics/closedbymanager/archive/:action",
            [
                'module' => 'analitics',
                'controller' => 'closedbymanager',
                'action' => 'index',
                'state' => 'archive'
            ]
        ));

        $router->addRoute("osvUnidentifiedExcel", new Zend_Controller_Router_Route(
            "/analitics/osv/unidentified/excel",
            [
                'module' => 'analitics',
                'controller' => 'osv',
                'action' => 'unidentified-excel',
            ]
        ));

        $router->addRoute("shippingContainer", new Zend_Controller_Router_Route(
            "/analitics/shipping-container/index/:action",
            [
                'module' => 'analitics',
                'controller' => 'shipping-container_index',
                'action' => 'index',
            ]
        ));

        $router->addRoute("shippingContainerArchive", new Zend_Controller_Router_Route(
            "/analitics/shipping-container/archive/:action",
            [
                'module' => 'analitics',
                'controller' => 'shipping-container_index',
                'action' => 'index',
                'showArchive' => 1
            ]
        ));

        $router->addRoute("shippingContainerCashBinding", new Zend_Controller_Router_Route(
            "/analitics/shipping-container/cash-binding/:action",
            [
                'module' => 'analitics',
                'controller' => 'shipping-container_cash-binding',
                'action' => 'index',
            ]
        ));

        $router->addRoute("analyticsLowMarginPurchaseArchive", new Zend_Controller_Router_Route(
            "/analitics/low-margin-purchase/archive/:action",
            [
                'module' => 'analitics',
                'controller' => 'low-margin-purchase',
                'action' => 'index',
                'showArchive' => true
            ]
        ));

        $router->addRoute('analyticsLowMarginPurchaseProductsInfo', new Zend_Controller_Router_Route(
            '/analitics/low-margin-purchase/products-info/:action',
            [
                'module' => 'analitics',
                'controller' => 'low-margin-purchase_products-info',
                'action' => 'index',
            ]
        ));

        $router->addRoute('analyticsDepotMotionIndex', new Zend_Controller_Router_Route(
            '/analitics/depot/motion/:action',
            [
                'module'     => 'analitics',
                'controller' => 'depot_motion_index',
                'action'     => 'index',
            ]
        ));

        $router->addRoute('analyticsClientInterceptionEmailLocal', new Zend_Controller_Router_Route(
            '/analitics/client-interception/email/local/:action',
            [
                'module'     => 'analitics',
                'controller' => 'client-interception_email_local',
                'action'     => 'index',
            ]
        ));

        $router->addRoute('analyticsClientInterceptionEmailOuter', new Zend_Controller_Router_Route(
            '/analitics/client-interception/email/outer/:action',
            [
                'module'     => 'analitics',
                'controller' => 'client-interception_email_outer',
                'action'     => 'index',
            ]
        ));

        $router->addRoute('analyticsClientInterceptionEmailAjax', new Zend_Controller_Router_Route(
            '/analitics/client-interception/email/ajax/:action',
            [
                'module'     => 'analitics',
                'controller' => 'client-interception_email_ajax',
            ]
        ));


        $router->addRoute('analyticsSBP', new Zend_Controller_Router_Route(
            '/analitics/sbp/:action',
            [
                'module'     => 'analitics',
                'controller' => 'sbp',
                'action'     => 'index',
            ]
        ));

        $router->addRoute('analyticsSBPPlanRegularClientSale', new Zend_Controller_Router_Route(
            '/analitics/sbp/plan/regular-client-sale/:action',
            [
                'module'     => 'analitics',
                'controller' => 'sbp_plan_regular-client-sale',
                'action'     => 'index',
            ]
        ));

        $router->addRoute('analyticsSBPPlanMarketingClientSale', new Zend_Controller_Router_Route(
            '/analitics/sbp/plan/marketing-client-sale/:action',
            [
                'module'     => 'analitics',
                'controller' => 'sbp_plan_marketing-client-sale',
                'action'     => 'index',
            ]
        ));

        $router->addRoute('analyticsSBPPlanCallDuration', new Zend_Controller_Router_Route(
            '/analitics/sbp/plan/call-duration/:action',
            [
                'module'     => 'analitics',
                'controller' => 'sbp_plan_call-duration',
                'action'     => 'index',
            ]
        ));

        $router->addRoute('analyticsTopClientsAvantpack', new Zend_Controller_Router_Route(
            '/analitics/top-clients-avantpack/:action',
            [
                'module'     => 'analitics',
                'controller' => 'top-clients-avantpack_index',
                'action'     => 'index',
            ]
        ));

        $router->addRoute('analyticsTopClientsAvantpackSettings', new Zend_Controller_Router_Route(
            '/analitics/top-clients-avantpack/settings/:action',
            [
                'module'     => 'analitics',
                'controller' => 'top-clients-avantpack_settings',
                'action'     => 'index',
            ]
        ));

        $router->addRoute("analytics_block_main", new Zend_Controller_Router_Route(
            "/analitics/block/main",
            array(
                'module' => 'analitics',
                'controller' => "block_index",
                'action' => 'main'
            )
        ));

        $router->addRoute("analytics_block", new Zend_Controller_Router_Route(
            "/analitics/block/:action",
            array(
                'module' => 'analitics',
                'controller' => "block_index",
                'action' => 'index',
                'oldRoute' => 1,
            )
        ));

        $router->addRoute("analyticsInfoPanel", new Zend_Controller_Router_Route(
            "/analitics/info-panel/:action",
            array(
                'module' => 'analitics',
                'controller' => "info-panel",
                'action' => 'index',
            )
        ));
    }
}
