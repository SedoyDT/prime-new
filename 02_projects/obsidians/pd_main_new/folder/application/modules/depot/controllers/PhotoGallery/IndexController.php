<?php
/**
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author Frolov Anatoliyfrolov_anatoliy@amd-co.ru>
 * @date 09.12.2024
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution
 */


use App\Depot\PhotoGallery\Index\Filter AS Filter;
use App\Depot\PhotoGallery\Index\FilterConfigurator AS FilterConfigurator;

use App\Depot\PhotoGallery\MathConditionService AS MathConditionService;

use App\Controller\AngularJS\AbstractFilterPageController;

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
    }

    /**
     * Главная страница "Потенциальные клиенты"
     */
    public function indexAction()
    {
        Zend_Registry::set('statusString', 'Фото галерея');

        $this->view->getRequire()
//            ->setDataMain('/js/app/application/analytics/capitalization-delta/index/config')
            ->setDataMain('/js/app/application/depot/photo-gallery/index/config')
            ->setParams('page.module', [
                'dataTable' => [
                    'urls' => $this->_getDatatableRoutes(),
                ],

                'amountWeightParams' => (new MathConditionService())->getAmdSelectList()
            ]);

        $this->view->headScript()->appendFile("/js/claim/form/section-photo-preview-manager.js");


    }

    /**
     *  Создание фильтра
     */
    public function createFilter()
    {
//        echo "<pre>" . print_r((string) $this->_getParam('searchId'), true); echo "</pre>"; // // 13.12.2024 08:44  Frolovdump Froldebug
//        exit();

        return $this->getFilterConfigurator()->setUpFilter(
            (new Filter())
                ->setShowSql(true)
                ->setOnlyBlocked((int)$this->_getParam('onlyBlocked'))
                ->setNotEmpty((int)$this->_getParam('notEmpty'))
                ->setSearchId((int)$this->_getParam('searchId'))
                ->setAmountWeight((int)$this->_getParam('amountWeight'))
                ->setAmountWeightParams((string) $this->_getParam('amountWeightParams'))
                ->setShowSale((int) $this->_getParam('showSale'))
        );
    }


    public function getFilterConfigurator(): ?\App\Development\TypeScript\FilterConfiguratorInterface
    {
        // TODO: Implement getFilterConfigurator() method.
        return (new FilterConfigurator());
    }
}
