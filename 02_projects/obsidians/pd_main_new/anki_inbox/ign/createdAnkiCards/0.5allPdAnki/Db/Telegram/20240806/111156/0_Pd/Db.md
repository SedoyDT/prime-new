
# Начало карточки

<!-- basicblock-start oid="ObsuMSjtr7h39H4ZU5DUrke0"  deck='0_Pd_Db' -->
```PHP::

<?php

require *DIR* . '/../library/Composer/autoload.php';

use DI\Bridge\ZendFramework1\Dispatcher;
use DI\ContainerBuilder;

/**
 * Настройки приложения
 */
class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{

    /**
     * Инициализация переменной окружения STAGE.
     * Устанавливает константу STAGE в зависимости от переменной окружения или режима командной строки.
     * @return void
     */
    protected function _initTracy()
    {
        if(getenv('STAGE')) {
            define('STAGE', getenv('STAGE'));
        }else{
            if(PHP_SAPI == 'cli') {
                define('STAGE', 'DEVELOPMENT');
            }else{
                die("Не установлена переменная окружения SetEnv STAGE [PRODUCTION|DEVELOPMENT]");
            }
        }
    }

    /**
     * Инициализация контейнера сервисов.
     * Из-за замены диспетчера, инициализация контейнера должна быть в начале.
     * @throws Exception
     */
    protected function _initAppContainer()
    {
        $builder = new ContainerBuilder(App_Container_Services::class);
        $builder->useAnnotations(true);

        // Загрузка конфигурации контейнера в зависимости от режима работы
        if ($this->isProduction()) {
            $file = '/configs/services.php';
        } else {
            $file = '/configs/services.dev.php';
        }
        $builder->addDefinitions(APPLICATION_PATH . $file);

        /** @var App_Container_Services $container */
        $container = $builder->build();

        // Сохранение контейнера сервисов
        App_Container::$services = $container;

        // Инициализация и замена диспетчера запросов на диспетчер с DI
        $dispatcher = new Dispatcher();
        $dispatcher->setContainer($container);
        Zend_Controller_Front::getInstance()->setDispatcher($dispatcher);

        // Регистрация дополнительных сервисов
        App_Container::$services->set('commandBus', new App_Command_ValidationCommandBus(new App_Command_BaseCommandBus));

        // Сохранение контейнера в реестре Zend
        Zend_Registry::set('container', $container);
    }

    /**
     * Инициализация конфигурации проекта.
     * @return void
     */
    protected function _initConfig()
    {
        App_Config::init();
        Zend_Registry::set('config', $this->getOptions());
        define('PROJECT_PREFIX', App_Config::get('project')->prefix); // Префикс для ссылок
        define('BLOCK_DOUBLE', (bool)App_Config::get('project')->double_block); // Конфигурация блока
    }

    /**
     * Инициализация временной зоны.
     * @throws Exception
     */
    protected function _initTimezone()
    {
        $projectConfig = App_Config::get('project');

        if (!($projectConfig instanceof stdClass)) {
            throw new \Exception('Не удалось получить конфигурацию!');
        }

        $timeZone = property_exists($projectConfig, 'timezone')
            ? $projectConfig->timezone
            : 'Europe/Moscow';

        date_default_timezone_set($timeZone);
    }

    /**
     * Инициализация вида и подключение скриптов.
     * @return Zend_View
     */
    protected function _initView()
    {
        // Инициализация вида
        $view = new Zend_View();

        // Добавление пути к вспомогательным классам
        $view->addHelperPath("App/Views/Helpers", 'App_View_Helper_');

        // Подключение JavaScript файлов
        $view->headScript()->appendFile('/js/jquery-1.8.3.min.js');
        $view->headScript()->appendFile('/js/boot.js');
        $view->headScript()->appendFile('/js/replacement/replace.js');
        $view->headScript()->appendFile('/js/regex-templates.js');
        $view->headScript()->appendScript('JS_CONST = {};');
        $view->headScript()->appendFile('/js/constant/table/abstract.js');
        $view->headScript()->appendFile("/js/lib.moment.min.js");

        // Разделитель заголовков страницы
        $view->headTitle()->setSeparator(' :: ');

        // Скрипт для отслеживания авторизации
        $view->headScript()->appendFile('/js/authwatcher.js');
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

```PHP
<?php

require *DIR* . '/../library/Composer/autoload.php';

use DI\Bridge\ZendFramework1\Dispatcher;
use DI\ContainerBuilder;

/**
 * Настройки приложения
 */
class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{

    /**
     * Инициализация переменной окружения STAGE.
     * Устанавливает константу STAGE в зависимости от переменной окружения или режима командной строки.
     * @return void
     */
    protected function _initTracy()
    {
        if(getenv('STAGE')) {
            define('STAGE', getenv('STAGE'));
        }else{
            if(PHP_SAPI == 'cli') {
                define('STAGE', 'DEVELOPMENT');
            }else{
                die("Не установлена переменная окружения SetEnv STAGE [PRODUCTION|DEVELOPMENT]");
            }
        }
    }

    /**
     * Инициализация контейнера сервисов.
     * Из-за замены диспетчера, инициализация контейнера должна быть в начале.
     * @throws Exception
     */
    protected function _initAppContainer()
    {
        $builder = new ContainerBuilder(App_Container_Services::class);
        $builder->useAnnotations(true);

        // Загрузка конфигурации контейнера в зависимости от режима работы
        if ($this->isProduction()) {
            $file = '/configs/services.php';
        } else {
            $file = '/configs/services.dev.php';
        }
        $builder->addDefinitions(APPLICATION_PATH . $file);

        /** @var App_Container_Services $container */
        $container = $builder->build();

        // Сохранение контейнера сервисов
        App_Container::$services = $container;

        // Инициализация и замена диспетчера запросов на диспетчер с DI
        $dispatcher = new Dispatcher();
        $dispatcher->setContainer($container);
        Zend_Controller_Front::getInstance()->setDispatcher($dispatcher);

        // Регистрация дополнительных сервисов
        App_Container::$services->set('commandBus', new App_Command_ValidationCommandBus(new App_Command_BaseCommandBus));

        // Сохранение контейнера в реестре Zend
        Zend_Registry::set('container', $container);
    }

    /**
     * Инициализация конфигурации проекта.
     * @return void
     */
    protected function _initConfig()
    {
        App_Config::init();
        Zend_Registry::set('config', $this->getOptions());
        define('PROJECT_PREFIX', App_Config::get('project')->prefix); // Префикс для ссылок
        define('BLOCK_DOUBLE', (bool)App_Config::get('project')->double_block); // Конфигурация блока
    }

    /**
     * Инициализация временной зоны.
     * @throws Exception
     */
    protected function _initTimezone()
    {
        $projectConfig = App_Config::get('project');

        if (!($projectConfig instanceof stdClass)) {
            throw new \Exception('Не удалось получить конфигурацию!');
        }

        $timeZone = property_exists($projectConfig, 'timezone')
            ? $projectConfig->timezone
            : 'Europe/Moscow';

        date_default_timezone_set($timeZone);
    }

    /**
     * Инициализация вида и подключение скриптов.
     * @return Zend_View
     */
    protected function _initView()
    {
        // Инициализация вида
        $view = new Zend_View();

        // Добавление пути к вспомогательным классам
        $view->addHelperPath("App/Views/Helpers", 'App_View_Helper_');

        // Подключение JavaScript файлов
        $view->headScript()->appendFile('/js/jquery-1.8.3.min.js');
        $view->headScript()->appendFile('/js/boot.js');
        $view->headScript()->appendFile('/js/replacement/replace.js');
        $view->headScript()->appendFile('/js/regex-templates.js');
        $view->headScript()->appendScript('JS_CONST = {};');
        $view->headScript()->appendFile('/js/constant/table/abstract.js');
        $view->headScript()->appendFile("/js/lib.moment.min.js");

        // Разделитель заголовков страницы
        $view->headTitle()->setSeparator(' :: ');

        // Скрипт для отслеживания авторизации
        $view->headScript()->appendFile('/js/authwatcher.js');



