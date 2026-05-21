<?php

/**
 * {Template_Description_Abstract}
 *
 * @author IvanPak
 * @date_created 17.04.2018
 * @copyright {Template_Description_Copyrights}
 */

use \App\Depot\Filter\DepotList\Filter;
use \App\Depot\Filter\DepotList\FilterConfigurator;
use App\Depot\Service\DepotSynchronizer;

/**
 * Учет иностранных граждан
 */
class Depot_ListController extends \App\Filter\Controller\AbstractDataSourceController
{

    /**
     * Главная страница с данными
     * @return void
     */
    public function indexAction()
    {
        if (!App_Access::get('access', 'depot>list>access')) {
            $this->_redirect('/');
        }

        Zend_Registry::set('statusString', 'Список складов');

        $this->view->getRequire()->setDataMain('/js/app/application/depot/list/config')
            ->setParams('page.module', [
                'routes' => [
                    'datatable' => $this->_getDatatableRoutes(),
                ],
                'clients' => App_Db_Clients::obtain()->getRowsInPairs(['id', 's_title']),
            ]);
    }


    /**
     * Сохранить данные о складе
     * @return void
     */
    public function saveDepotAction()
    {
        App_Form_AjaxForm_Factory::send(function (App_Form_AjaxForm_Form_AbstractForm $ajaxForm) {
            if (!App_Access::get('access', 'depot>list>access')) {
                $ajaxForm->error('Доступ запрещен!');
            }

            $formData = $this->_getParam('formData');

            if (empty($formData['depot'])) {
                $ajaxForm->error('Не переданы данные о складе!');
            }

            $depotModel = App_Depot_Handlers_Entity_DepotList::createByParams(
                $formData['depot']
            );

            $depotValidation = $depotModel->validateDepotData();

            if ($depotValidation) {
                $ajaxForm->error(join("\n", $depotValidation));
            }

            // Открыть транзакцию
            // ВНИМАНИЕ при создании склада запускается запрос CREATE TABLE учтите это при работе с запросами
            App_Db::get()->beginTransaction();
            // Сохранить данные по складу
            $depotModel->save();

            (new DepotSynchronizer())->synchronize($depotModel);
            App_Network_Service_Synchronize_ChangedMarker::markChanged('depot_list', $depotModel->id);

            // Завершить транзакцию
            App_Db::get()->commit();

        });
    }

    public function createFilter()
    {
        return $this->getFilterConfigurator()->setUpFilter(new Filter());
    }

    public function getFilterConfigurator(): ?\App\Development\TypeScript\FilterConfiguratorInterface
    {
        return new FilterConfigurator();
    }
}
