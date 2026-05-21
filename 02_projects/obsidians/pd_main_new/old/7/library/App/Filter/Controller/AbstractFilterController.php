<?php
use App_Filter_AbstractFilter as Filter;
use App_Filter_Excel_Converter as ExcelConverter;
use App_Filter_Component_Decorator_Type_WorkPeriod_Decorator as WorkPeriodDecorator;

/**
 * Абстрактный базовый контроллер для фильтров
 * Имеет поддержку всех базовых методов фильтра, а именно:
 *  - getfilterresult
 *  - getfilterconfig
 *  - getfiltermask
 *
 * Дополнительно имеет средства по автоматической выгрузке результатов фильтра в excel-файл:
 *  - getfilterexcel
 *
 * Дополнительно, если фильтр имеет декоратор WorkPeriodDecorator:
 *  - setworkperiod
 *
 * При создании контроллера необходимо наследовать следующие методы:
 *  - _createFilter
 *  - _setUpFilterExcelConverter
 */
abstract class App_Filter_Controller_AbstractFilterController extends Zend_Controller_Action
{
    /**
     * Фильтр
     * @var Filter
     */
    protected $_filter;
    
    /**
     * JqueryUI
     * @var string 
     */
    protected $_jqueryUi = '/js/jqueryui/jquery-ui.js';


    /**
     * Инициализация контроллера
     * Необходимые для работы скрипты и js-файлы
     */
    public function init()
    {
        $this->appendCss();

        $this->appendJs();
    }


    /**
     * Добавить файлы стилей
     * @return void
     */
    public function appendCss()
    {
        $cssFiles = [
            '/css/ajax_file_uploader.css',
            '/css/filter/grid.css',
            '/css/filter/filter.css',
            '/css/sass/form/form-abstract.css',
            '/css/sass/filter/filter.css',
            '/css/sass/jquery.css',
            '/css/themes/smoothness/ui.all.css',
            '/css/themes/smoothness/ui.datepicker.css',
        ];

        foreach ($cssFiles as $cssFile) {
            $this->_getHeadLink()->appendStylesheet($cssFile);
        }
    }


    /**
     * Добавить необходимые скрипты
     * @return void
     */
    public function appendJs()
    {
        $jsFiles = [
            '/js/filemanager/preview.js',
            '/js/ajax_file_uploader.js',
            $this->_jqueryUi,
            '/js/filter/filter.js',
            '/js/filter/grid.js',
            '/js/filter/serialize.php.js',
            '/js/datatable/datatable.js',
            '/js/jqueryui/datepickerru/ui.datepicker-ru.js',
            '/js/jquery/jquery.ajaxStatus.js',
            '/js/jquery/jquery.ajaxHandler.js',
            '/js/jquery/jquery.transition.js',
        ];

        foreach ($jsFiles as $jsFile) {
            $this->_getHeadScript()->appendFile($jsFile);
        }
    }


    /**
     * Возвращает результат фильтра
     * @see App_Filter_FilterInterface::getResult
     */
    public final function getfilterresultAction() {
        $filter = $this->_getFilter();

//        echo "<pre>" . print_r($this, true); echo "</pre>"; // FrolovDEBUG
//        exit();
        header('Content-Type: application/json');
        echo json_encode($filter->getResult());
        exit();
    }

    /**
     * Возвращает конфиг фильтра
     * @see App_Filter_FilterInterface::getConfigFilter
     */
    public final function getfilterconfigAction() {
        $filter = $this->_getFilter();

        header('Content-Type: application/json');
        echo json_encode($filter->getConfigFilter());
        exit();
    }

    /**
     * Возвращает маску фильтра
     * @see App_Filter_FilterInterface::getMaskFilter
     */
    public final function getfiltermaskAction() {
        $filter = $this->_getFilter();

        header('Content-Type: application/json');
        echo json_encode($filter->getMaskFilter());
        exit();
    }

    /**
     * Выгрузка в *.xls
     */
    public function getfilterexcelAction() {
        $filter = $this->_getFilter();
        $filter->setRecordsPerPage(0);

        define('EXCEL_CONVERTER', true);

        $converter = new ExcelConverter();
        $converter->setFilter($filter);
        $converter->setOutput('php://output');

        if($this->_getParam('hidden_fields')) {
            $converter->setHiddenFields(explode(',', $this->_getParam('hidden_fields')));
        }

        $this->_setUpFilterExcelConverter($filter, $converter);

        $converter
            ->setDownloadFilename($this->_getExcelFileName())
            ->download();
    }

    /**
     * Настраивает workPeriod фильтра
     */
    public final function setworkperiodAction() {
        try {
            $startDate = $this->_getParam('startDate');
            $endDate = $this->_getParam('endDate');

            $startDate = strlen($startDate) ? new Zend_Date($startDate, App_Db::ZEND_DATETIME_RU_FORMAT) : null;
            $endDate = strlen($endDate) ? new Zend_Date($endDate, App_Db::ZEND_DATETIME_RU_FORMAT) : null;

            $decorator = $this->_getFilter()->getDecorators()->findByClassName('App_Filter_Component_Decorator_Type_WorkPeriod_Decorator');

            if($decorator instanceof WorkPeriodDecorator) {
                $decorator->setStartDate($startDate);
                $decorator->setEndDate($endDate);
            }

            $jsonData = array("success" => true, 'sessionData' => $decorator->getSessionData());
        }
        catch (\Exception $e) {
            $jsonData = array(
                'success' => false,
                'error' => $e->getMessage()
            );
        }

        header('Content-Type: application/json');
        echo json_encode($jsonData);
        exit();
    }

    /**
     * Возвращает фильтр
     * @return Analitics_Model_Credit_Filter
     */
    protected final function _getFilter() {
        if(!($this->_filter instanceof Filter)) {
            $this->_filter = $this->_createFilter();

        }

        return $this->_filter;
    }

    /**
     * Возвращает фильтр контроллера
     * В этом методе также данный фильтр можно конфигурировать
     * @return Filter
     */
    protected abstract function _createFilter();

    /**
     * Метод, вызываемые при создании excel-конвертера
     * Вся конфигурация конвертера описывается здесь
     * @param App_Filter_AbstractFilter $filter Фильтр контроллера
     * @param App_Filter_Excel_Converter $excelConverter Конвертер Filter->.xls

     */
    protected function _setUpFilterExcelConverter(Filter $filter, ExcelConverter $excelConverter) {}

    /**
     * Возвращает название excel-файла выгрузки
     * @return string
     */
    protected function _getExcelFileName() {
        return uniqid(date('d.m.Y').'_').'.xlsx';
    }
}
