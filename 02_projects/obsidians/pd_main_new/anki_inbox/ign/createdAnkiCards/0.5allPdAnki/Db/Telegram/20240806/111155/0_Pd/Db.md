
# Начало карточки

<!-- basicblock-start oid="ObscEqDnrmHapZKZBQLfu80S"  deck='0_Pd_Db' -->
/**::

 * Реальный URL сайта
 */
if (php_sapi_name() != "cli") {
    define('SITE_NAME', (array_key_exists('HTTPS', $_SERVER) && strtolower($_SERVER['HTTPS']) != 'off' ? 'https://' : 'http://' ) . $_SERVER["SERVER_NAME"]);
}

/**
 * Имя сессии для хелпера отображения информации о бонусе
 */
define('MOTIVATION_INFOBLOCK_SESSION_NAME', 'app_view_helper_showmotivationbonus');

/**
 * Имя cookie хелпера для отображения информации о бонусе
 */
define('MOTIVATION_INFOBLOCK_COOKIE_NAME', 'bonusMotivationInfoBlock');

/**
 * Максимальное количество менеджеров, привязанных к клиенту
 */
define('MAX_CLIENT_MANAGERS', 10);

// Id отчёта "Расчёт прибыли"
define('ANALITIC_REPORT_CALCULATE_ID', 1);
// Id отчёта "Движение по складу"
define('ANALITIC_REPORT_DEPOT_MOTION_ID', 2);
// Id отчёта "Движение по складу" расшифровка заявки
define('ANALITIC_REPORT_DEPOT_MOTION_OUTINFO_ID', 3);
// Id отчёта "Движение по складу переработчика"
define('ANALITIC_REPORT_CONVERSION_ID', 4);
// Id отчёта "Движение по складу переработчика" расшифровка заявки
define('ANALITIC_REPORT_CONVERSION_OUTINFO_ID', 5);
// Id отчёта "Сальдо. Акт сверки"
define('ANALITIC_REPORT_BALANCE_ID', 6);

/**
 * Папка для временных файлов
 * APPLICATION_PATH . '/../public/files/tmp'
 */
define('APPLICATION_TEMP_DIR', realpath(APPLICATION_PATH . '/../public/files/tmp'));

// Строка с датой заливки задачи 6673, в которой добавили проверку, что нельзя загрузить договор, если есть активный лист с договором поручительства
define('TICKET_6673_START_DATE', '2019-07-02');

// Дата заливки задачи 7033, по которой определяется возможность редактирования заявок на приход через каскад
define('TICKET_7033_DATE', '2020-07-13');

// Формат даты для отображения
define('PUBLIC_DATE_FORMAT', 'd.m.Y');

// Формат даты и времени для отображения
define('PUBLIC_DATETIME_FORMAT', 'd.m.Y H:i');

// Формат даты для сохранения в базу данных
define('MYSQL_DATE_FORMAT', 'Y-m-d');

// Формат даты и времени для сохранения в базу данных
define('MYSQL_DATETIME_FORMAT', 'Y-m-d H:i:s');
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

/**
 * Реальный URL сайта
 */
if (php_sapi_name() != "cli") {
    define('SITE_NAME', (array_key_exists('HTTPS', $_SERVER) && strtolower($_SERVER['HTTPS']) != 'off' ? 'https://' : 'http://' ) . $_SERVER["SERVER_NAME"]);
}

/**
 * Имя сессии для хелпера отображения информации о бонусе
 */
define('MOTIVATION_INFOBLOCK_SESSION_NAME', 'app_view_helper_showmotivationbonus');

/**
 * Имя cookie хелпера для отображения информации о бонусе
 */
define('MOTIVATION_INFOBLOCK_COOKIE_NAME', 'bonusMotivationInfoBlock');

/**
 * Максимальное количество менеджеров, привязанных к клиенту
 */
define('MAX_CLIENT_MANAGERS', 10);

// Id отчёта "Расчёт прибыли"
define('ANALITIC_REPORT_CALCULATE_ID', 1);
// Id отчёта "Движение по складу"
define('ANALITIC_REPORT_DEPOT_MOTION_ID', 2);
// Id отчёта "Движение по складу" расшифровка заявки
define('ANALITIC_REPORT_DEPOT_MOTION_OUTINFO_ID', 3);
// Id отчёта "Движение по складу переработчика"
define('ANALITIC_REPORT_CONVERSION_ID', 4);
// Id отчёта "Движение по складу переработчика" расшифровка заявки
define('ANALITIC_REPORT_CONVERSION_OUTINFO_ID', 5);
// Id отчёта "Сальдо. Акт сверки"
define('ANALITIC_REPORT_BALANCE_ID', 6);

/**
 * Папка для временных файлов
 * APPLICATION_PATH . '/../public/files/tmp'
 */
define('APPLICATION_TEMP_DIR', realpath(APPLICATION_PATH . '/../public/files/tmp'));

// Строка с датой заливки задачи 6673, в которой добавили проверку, что нельзя загрузить договор, если есть активный лист с договором поручительства
define('TICKET_6673_START_DATE', '2019-07-02');

// Дата заливки задачи 7033, по которой определяется возможность редактирования заявок на приход через каскад
define('TICKET_7033_DATE', '2020-07-13');

// Формат даты для отображения
define('PUBLIC_DATE_FORMAT', 'd.m.Y');

// Формат даты и времени для отображения
define('PUBLIC_DATETIME_FORMAT', 'd.m.Y H:i');

// Формат даты для сохранения в базу данных
define('MYSQL_DATE_FORMAT', 'Y-m-d');

// Формат даты и времени для сохранения в базу данных
define('MYSQL_DATETIME_FORMAT', 'Y-m-d H:i:s');
```




# Начало карточки

<!-- basicblock-start oid="Obs7nc10g84AeZOzKggI5Ynu"  deck='0_Pd_Db' -->
\App\Service\EventService::getInstance()->initImmideateSubscribers();::

    }

    /**
     * Инициализация констант для модуля "Инвентарные номера".
     * @return void
     */
    protected function _initInventoryNumbersConstant()
    {
        $options = App_Db::get('options')->getOptions(array('client_writeoff', 'client_inventory_numbers', 'inventory_numbers_claim_id'));
        foreach ($options as $optionName => $option) {
            define(strtoupper($optionName), (int) $option->value);
        }
    }

    /**
     * Инициализация обработчиков вебхуков Telegram.
     * @return void
     */
    protected function _initTelegramWebhookHandlers()
    {
        foreach ([
            \App\Telegram\Callbacks\AgreementListForward\Command::class => \App\Telegram\Callbacks\AgreementListForward\Handler::class,
            \App\Telegram\Callbacks\AgreementListBackward\Command::class => \App\Telegram\Callbacks\AgreementListBackward\Handler::class,
            \App\Telegram\Callbacks\AgreementListReject\Command::class => \App\Telegram\Callbacks\AgreementListReject\Handler::class,

            \App\Tasks\StaffTasks\Notifications\NewTask\Callback\Command::class => \App\Tasks\StaffTasks\Notifications\NewTask\Callback\Handler::class
        ] as $callback => $handler) {
            \Amd\AmdTelegram\Webhook\HandlerMap::add($callback, $handler);
        }
    }

    /**
     * Проверка, находится ли приложение в боевом режиме.
     * @return bool
     */
    private function isProduction(): bool
    {
        return !getenv('DEVELOPMENT') && STAGE == 'PRODUCTION';
    }

}

/** Названия таблиц начало **/
require_once(APPLICATION_PATH . '/../library/App/Constant/TableList.php');

/** Настройки кеширования require.js **/
if (file_exists(APPLICATION_PATH . '/../cache-killer.php')) {
    require_once APPLICATION_PATH . '/../cache-killer.php';
} else {
    define('CACHE_TIMESTAMP', time());
}

/** Виртуальные таблицы (таблиц нет в базе) */
define('DB_DEPOT_RENT_PENALTY_PAYERS', 'depot_rent_penalty_payers');
define('DB_DEPOT_RENT_PENALTY_COLLECTOR', 'depot_rent_penalty_collector');
define('DB_FILEMANAGER_MOTION', 'filemanager_motion');

/** Представления */
define('DB_DEPOT_RENT_PRODUCT_DATA_EXTENDED', 'view_depot_rent_product_data_extended');
define('DB_ITEMS_NOT_EMPTY', 'items_not_empty');
define('DB_VIEW_SALARY_BONUS_FINE', 'view_salary_bonus_fine');
define('DB_VIEW_RAW_PRODUCTS', 'view_raw_products');
define('DB_VIEW_DEPOT_DETAILED_MANAGER', 'view_depot_detailed_manager');
define('DB_VIEW_DEPOT_DETAILED_MANAGER_BLOCK_INFO', 'view_depot_detailed_manager_block_info');
define('DB_VIEW_PRODUCTS', 'view_products');
define('DB_VIEW_DEPOT_2', 'view_depot_2');

/** ----------------          CONSTANTS              ------------------- **/

// Depot Id
define('DEPOT_ID', 2);
define('DEPOT_RENT_PENALTY_MONTH_LENGTH', 30);

// Файловый менеджер "Константы"
define('FM_DIR_TYPE_STRUCTURE', -2);
define('FM_DIR_TYPE_ALL',       -1);
define('FM_DIR_TYPE_MUTUAL',     0);
define('FM_DIR_TYPE_HOME',       1);
define('FM_DIR_TYPE_SHARED',     2);
define('FM_DIR_TYPE_COMMON',     3);

// Файловый менеджер "Действия при перемещении файлов"
define('FM_CONFLICT_REPLACE',   1);
define('FM_CONFLICT_DUPLICATE', 2);
define('FM_CONFLICT_PASS',      3);
define('FM_CONFLICT_DEFAULT',   4);

// Файловый менеджер типы элементов "каталог" / "файл"
define('FM_ELEMENT_DIR',  1);
define('FM_ELEMENT_FILE', 2);

define('AMD_PRECISION', 0.00001);
define('ACCESS_DENIED', 'У Вас недостаточно прав!');

define('DISPLAY_USERS_NO_DISMISS', 0);
define('DISPLAY_USERS_ONLY_DISMISS', 1);
define('DISPLAY_USERS_ALL', 2);

/**
 * Тип платежа
 * PAYMENT_CASHLESS - безнал
 * PAYMENT_CASH - нал
 */
define('PAYMENT_TYPE_CASHLESS', 0);
define('PAYMENT_TYPE_CASH', 1);

/**
 * Тип договора поставки оборудования
 */
define('DELIVERY_CONTRACT_PICKUP',   1);
define('DELIVERY_CONTRACT_DELIVERY', 2);
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

\App\Service\EventService::getInstance()->initImmideateSubscribers();
    }

    /**
     * Инициализация констант для модуля "Инвентарные номера".
     * @return void
     */
    protected function _initInventoryNumbersConstant()
    {
        $options = App_Db::get('options')->getOptions(array('client_writeoff', 'client_inventory_numbers', 'inventory_numbers_claim_id'));
        foreach ($options as $optionName => $option) {
            define(strtoupper($optionName), (int) $option->value);
        }
    }

    /**
     * Инициализация обработчиков вебхуков Telegram.
     * @return void
     */
    protected function _initTelegramWebhookHandlers()
    {
        foreach ([
            \App\Telegram\Callbacks\AgreementListForward\Command::class => \App\Telegram\Callbacks\AgreementListForward\Handler::class,
            \App\Telegram\Callbacks\AgreementListBackward\Command::class => \App\Telegram\Callbacks\AgreementListBackward\Handler::class,
            \App\Telegram\Callbacks\AgreementListReject\Command::class => \App\Telegram\Callbacks\AgreementListReject\Handler::class,

            \App\Tasks\StaffTasks\Notifications\NewTask\Callback\Command::class => \App\Tasks\StaffTasks\Notifications\NewTask\Callback\Handler::class
        ] as $callback => $handler) {
            \Amd\AmdTelegram\Webhook\HandlerMap::add($callback, $handler);
        }
    }

    /**
     * Проверка, находится ли приложение в боевом режиме.
     * @return bool
     */
    private function isProduction(): bool
    {
        return !getenv('DEVELOPMENT') && STAGE == 'PRODUCTION';
    }

}

/** Названия таблиц начало **/
require_once(APPLICATION_PATH . '/../library/App/Constant/TableList.php');

/** Настройки кеширования require.js **/
if (file_exists(APPLICATION_PATH . '/../cache-killer.php')) {
    require_once APPLICATION_PATH . '/../cache-killer.php';
} else {
    define('CACHE_TIMESTAMP', time());
}

/** Виртуальные таблицы (таблиц нет в базе) */
define('DB_DEPOT_RENT_PENALTY_PAYERS', 'depot_rent_penalty_payers');
define('DB_DEPOT_RENT_PENALTY_COLLECTOR', 'depot_rent_penalty_collector');
define('DB_FILEMANAGER_MOTION', 'filemanager_motion');

/** Представления */
define('DB_DEPOT_RENT_PRODUCT_DATA_EXTENDED', 'view_depot_rent_product_data_extended');
define('DB_ITEMS_NOT_EMPTY', 'items_not_empty');
define('DB_VIEW_SALARY_BONUS_FINE', 'view_salary_bonus_fine');
define('DB_VIEW_RAW_PRODUCTS', 'view_raw_products');
define('DB_VIEW_DEPOT_DETAILED_MANAGER', 'view_depot_detailed_manager');
define('DB_VIEW_DEPOT_DETAILED_MANAGER_BLOCK_INFO', 'view_depot_detailed_manager_block_info');
define('DB_VIEW_PRODUCTS', 'view_products');
define('DB_VIEW_DEPOT_2', 'view_depot_2');

/** ----------------          CONSTANTS              ------------------- **/

// Depot Id
define('DEPOT_ID', 2);
define('DEPOT_RENT_PENALTY_MONTH_LENGTH', 30);

// Файловый менеджер "Константы"
define('FM_DIR_TYPE_STRUCTURE', -2);
define('FM_DIR_TYPE_ALL',       -1);
define('FM_DIR_TYPE_MUTUAL',     0);
define('FM_DIR_TYPE_HOME',       1);
define('FM_DIR_TYPE_SHARED',     2);
define('FM_DIR_TYPE_COMMON',     3);

// Файловый менеджер "Действия при перемещении файлов"
define('FM_CONFLICT_REPLACE',   1);
define('FM_CONFLICT_DUPLICATE', 2);
define('FM_CONFLICT_PASS',      3);
define('FM_CONFLICT_DEFAULT',   4);

// Файловый менеджер типы элементов "каталог" / "файл"
define('FM_ELEMENT_DIR',  1);
define('FM_ELEMENT_FILE', 2);

define('AMD_PRECISION', 0.00001);
define('ACCESS_DENIED', 'У Вас недостаточно прав!');

define('DISPLAY_USERS_NO_DISMISS', 0);
define('DISPLAY_USERS_ONLY_DISMISS', 1);
define('DISPLAY_USERS_ALL', 2);

/**
 * Тип платежа
 * PAYMENT_CASHLESS - безнал
 * PAYMENT_CASH - нал
 */
define('PAYMENT_TYPE_CASHLESS', 0);
define('PAYMENT_TYPE_CASH', 1);

/**
 * Тип договора поставки оборудования
 */
define('DELIVERY_CONTRACT_PICKUP',   1);
define('DELIVERY_CONTRACT_DELIVERY', 2);




# Начало карточки

<!-- basicblock-start oid="ObsFi6wPVaxM9lBbSHDBZDmI"  deck='0_Pd_Db' -->
// Установка вида для ViewRenderer::

        $viewRenderer = Zend_Controller_Action_HelperBroker::getStaticHelper('ViewRenderer');
        $viewRenderer->setView($view);

        return $view;
    }

    /**
     * Инициализация плагинов контроллеров.
     * @return void
     */
    protected function _initActionPlugins()
    {
        Zend_Controller_Action_HelperBroker::addPath(APPLICATION_PATH . '/../library/App/Controller/Helpers', 'Helper');
    }

    /**
     * Инициализация данных для сервиса отправки СМС.
     * @return void
     */
    protected function _initAuth()
    {
        $config = new Zend_Config_Ini(APPLICATION_PATH . '/../application/configs/auth.ini', 'production');
        Zend_Registry::set('auth', $config->auth);
    }

    /**
     * Инициализация роутов.
     * @return void
     */
    protected function _initRoutes()
    {
        $this->bootstrap('frontController');
        $front = $this->getResource('frontController');
        $router = $front->getRouter();

        $config = new Zend_Config_Ini(APPLICATION_PATH . '/../application/configs/routes.ini', 'production');
        $router->addConfig($config, 'routes');
    }

    /**
     * Инициализация подключения к базе данных.
     * @return Zend_Db_Adapter_Abstract
     */
    protected function _initDb()
    {
        $config = new Zend_Config_Ini(APPLICATION_PATH . '/../application/configs/dbconfig.ini', APPLICATION_ENV);
        $adapter = Zend_Db::factory($config->db);
        Zend_Db_Table::setDefaultAdapter($adapter);

        App_Container::$services->set('db', $adapter);

        return $adapter;
    }

    /**
     * Инициализация менеджера детализированных данных склада.
     * Перенес инициализацию сервиса ниже инициализации базы, т.к. сервис обращается к базе.
     * @return void
     * @throws Exception
     */
    protected function _initDepotDetailedManager()
    {
        App_Container::$services->set(
            'depotDetailedManager',
            App_Container_Services::createObject(App_Depot_DepotDetailedManager_Service_DepotDetailedManagerService::class)
        );
    }

    /**
     * Установка списка складов в Zend_Registry.
     * @return void
     */
    protected function _initDepotList()
    {
        App_Depot_Handlers_Manager::setFullDepotList();
    }

    /**
     * Инициализация Memcached.
     * @return void
     */
    protected function _initMemcached()
    {
        if (file_exists($configPath = APPLICATION_PATH . '/../application/configs/memcached.ini')) {
            $iniConfig = new Zend_Config_Ini($configPath, APPLICATION_ENV);

            $frontend = array(
                'caching' => true,
                'automatic_serialization' => true,
                'lifetime' => 1800
            );

            $backend = [
                'servers' => [
                    [
                        'host' => $iniConfig->get('memcached')->host,
                        'port' => $iniConfig->get('memcached')->port,
                    ],
                ],
            ];

            Zend_Registry::set('memcached', Zend_Cache::factory('Core', 'App_Cache_Backend_Memcached', $frontend, $backend, false, true));
        } else {
            Zend_Registry::set('memcached', Zend_Cache::factory('Core', 'Black-Hole', array(
                'automatic_serialization' => true
            )));
        }
    }

    /**
     * Установка режима выборки данных из базы данных по умолчанию.
     * @return void
     */
    protected function _initDbFetchMode()
    {
        $this->bootstrap('db');
        $db = $this->getResource('db');
        $db->setFetchMode(Zend_Db::FETCH_OBJ);
        Zend_Registry::set('db', $db);
    }

    /**
     * Инициализация менеджера событий.
     * @return void
     */
    protected function _initEventManager()
    {
        $eventManager = App_EventManager_EventManagerFactory::create();

        $eventManager->getListeners()->register(new \App\EventManager\Component\Listener\ClaimListener());

        Zend_Registry::set('eventManager', $eventManager);
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

// Установка вида для ViewRenderer
        $viewRenderer = Zend_Controller_Action_HelperBroker::getStaticHelper('ViewRenderer');
        $viewRenderer->setView($view);

        return $view;
    }

    /**
     * Инициализация плагинов контроллеров.
     * @return void
     */
    protected function _initActionPlugins()
    {
        Zend_Controller_Action_HelperBroker::addPath(APPLICATION_PATH . '/../library/App/Controller/Helpers', 'Helper');
    }

    /**
     * Инициализация данных для сервиса отправки СМС.
     * @return void
     */
    protected function _initAuth()
    {
        $config = new Zend_Config_Ini(APPLICATION_PATH . '/../application/configs/auth.ini', 'production');
        Zend_Registry::set('auth', $config->auth);
    }

    /**
     * Инициализация роутов.
     * @return void
     */
    protected function _initRoutes()
    {
        $this->bootstrap('frontController');
        $front = $this->getResource('frontController');
        $router = $front->getRouter();

        $config = new Zend_Config_Ini(APPLICATION_PATH . '/../application/configs/routes.ini', 'production');
        $router->addConfig($config, 'routes');
    }

    /**
     * Инициализация подключения к базе данных.
     * @return Zend_Db_Adapter_Abstract
     */
    protected function _initDb()
    {
        $config = new Zend_Config_Ini(APPLICATION_PATH . '/../application/configs/dbconfig.ini', APPLICATION_ENV);
        $adapter = Zend_Db::factory($config->db);
        Zend_Db_Table::setDefaultAdapter($adapter);

        App_Container::$services->set('db', $adapter);

        return $adapter;
    }

    /**
     * Инициализация менеджера детализированных данных склада.
     * Перенес инициализацию сервиса ниже инициализации базы, т.к. сервис обращается к базе.
     * @return void
     * @throws Exception
     */
    protected function _initDepotDetailedManager()
    {
        App_Container::$services->set(
            'depotDetailedManager',
            App_Container_Services::createObject(App_Depot_DepotDetailedManager_Service_DepotDetailedManagerService::class)
        );
    }

    /**
     * Установка списка складов в Zend_Registry.
     * @return void
     */
    protected function _initDepotList()
    {
        App_Depot_Handlers_Manager::setFullDepotList();
    }

    /**
     * Инициализация Memcached.
     * @return void
     */
    protected function _initMemcached()
    {
        if (file_exists($configPath = APPLICATION_PATH . '/../application/configs/memcached.ini')) {
            $iniConfig = new Zend_Config_Ini($configPath, APPLICATION_ENV);

            $frontend = array(
                'caching' => true,
                'automatic_serialization' => true,
                'lifetime' => 1800
            );

            $backend = [
                'servers' => [
                    [
                        'host' => $iniConfig->get('memcached')->host,
                        'port' => $iniConfig->get('memcached')->port,
                    ],
                ],
            ];

            Zend_Registry::set('memcached', Zend_Cache::factory('Core', 'App_Cache_Backend_Memcached', $frontend, $backend, false, true));
        } else {
            Zend_Registry::set('memcached', Zend_Cache::factory('Core', 'Black-Hole', array(
                'automatic_serialization' => true
            )));
        }
    }

    /**
     * Установка режима выборки данных из базы данных по умолчанию.
     * @return void
     */
    protected function _initDbFetchMode()
    {
        $this->bootstrap('db');
        $db = $this->getResource('db');
        $db->setFetchMode(Zend_Db::FETCH_OBJ);
        Zend_Registry::set('db', $db);
    }

    /**
     * Инициализация менеджера событий.
     * @return void
     */
    protected function _initEventManager()
    {
        $eventManager = App_EventManager_EventManagerFactory::create();

        $eventManager->getListeners()->register(new \App\EventManager\Component\Listener\ClaimListener());

        Zend_Registry::set('eventManager', $eventManager);



