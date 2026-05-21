<?php
/**
 * Контроллер для запросов к сервисам
 *
 * @author vofchek
 */
class Network_RecieveController extends Zend_Controller_Action
{

    public function init()
    {
        $layout = Zend_Controller_Action_HelperBroker::getStaticHelper('layout');
        $layout->disableLayout();

        $helper = Zend_Controller_Action_HelperBroker::getStaticHelper('viewRenderer');
        $helper->setNoRender(true);
    }
    
    public function indexAction()
    {
        $controller = new App_Network_Reciever_Controller();

//        echo "<pre>" . print_r('module', true); echo "</pre>"; // FrolovDEBUG
//        echo "<pre>" . print_r($this->getRequest()->getPost('module'), true); echo "</pre>"; // FrolovDEBUG
//        exit();

//        echo "<pre>" . print_r($this->getRequest()->getPost('module'), true); echo "</pre>"; // FrolovDEBUG
//        exit();

//        echo "<pre>" . print_r($controller, true); echo "</pre>"; // FrolovDEBUG
//        exit();
        $controller->setProjectId($this->getRequest()->getPost('project_id'));
        $controller->setModule($this->getRequest()->getPost('module'));
        $controller->setAction($this->getRequest()->getPost('action'));
        $controller->setData($this->_getParam('data', array()));
        $controller->setFiles($_FILES);

        $controller->run();
    }
}
