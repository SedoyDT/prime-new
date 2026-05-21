<?php
/**
 * Все права на программный код принадлежат ООО "ПИАР СИТИ"
 *
 * @author Frolov Anatoliyfrolov_anatoliy@amd-co.ru>
 * @date 29.08.2024
 * @copyright Copyright (c) ООО "Пиар Сити" project AMDSolution
 */
use App\Controller\AngularJS\AbstractPageController;
use App\TourOfHeroes\Form\HeroForm;

class TourOfHeroes_IndexController extends AbstractPageController
{
    public function indexAction()
    {
        $this->view->getRequire()->setDataMain('/js/app/application/tour-of-heroes/index/index/config');
        $this->view->headLink()->appendCssFiles(['/css/scss/app/application/tour-of-heroes/index.css']);
    }

    public function getDataAction()
    {
        App_Form_AjaxForm_Factory::send(function () {
            return [
                'heroes' => App_Db_Heroes::obtain()->fetchAll()->toArray(),
            ];
        });
    }

    public function updateAction()
    {
        App_Form_AjaxForm_Factory::send(function () {
           $hero = $this->_getParam("hero");
           $form = new \App\TourOfHeroes\Form\HeroForm($hero);
           if (!$form->isValid($hero)) {
              return [
                  "success" => false,
                  "errors" => $form->getMessages(),
              ];
           }
           App_Db_Heroes::obtain()->update(['name' => $hero['name']], ['id=?' => $hero['id']]);
        });
    }

    public function addAction()
    {
        App_Form_AjaxForm_Factory::send(function () {
            $hero = $this->_getParam('hero');
            $form = new \App\TourOfHeroes\Form\HeroForm($hero);
            if (!$form->isValid($hero)) {
                return [
                    "success" => false,
                    "errors" => $form->getMessages(),
                ];
            }

            $hero['id'] = App_Db_Heroes::obtain()->insert(['name' => $hero['name']]);
            return [
                'hero' => $hero,
            ];
        });
    }

    public function deleteAction()
    {
        App_Form_AjaxForm_Factory::send(function () {
            $id = $this->_getParam('id');
            App_Db_Heroes::obtain()->delete(['id=?'=>$id]);
        });
    }
}