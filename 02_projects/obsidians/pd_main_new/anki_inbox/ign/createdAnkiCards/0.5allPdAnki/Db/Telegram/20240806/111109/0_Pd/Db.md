
# Начало карточки

<!-- basicblock-start oid="ObsEOFWR0pEFrC9FutCi4IyO"  deck='0_Pd_Db' -->
// Константы для файлового менеджера::

define('FM_DIR_TYPE_STRUCTURE', -2); // Тип структуры каталога
define('FM_DIR_TYPE_ALL',       -1); // Тип для всех директорий
define('FM_DIR_TYPE_MUTUAL',     0);  // Тип взаимных директорий
define('FM_DIR_TYPE_HOME',       1);  // Тип домашнего каталога
define('FM_DIR_TYPE_SHARED',     2);  // Тип общих директорий
define('FM_DIR_TYPE_COMMON',     3);  // Тип общих каталогов

// Конфликты при перемещении файлов в файловом менеджере
define('FM_CONFLICT_REPLACE',   1); // Замена существующего файла
define('FM_CONFLICT_DUPLICATE', 2); // Создание дубликата файла
define('FM_CONFLICT_PASS',      3); // Пропуск перемещения
define('FM_CONFLICT_DEFAULT',   4); // Действие по умолчанию

// Типы элементов файлового менеджера: каталог или файл
define('FM_ELEMENT_DIR',  1); // Каталог
define('FM_ELEMENT_FILE', 2); // Файл

// Точность для вычислений
define('AMD_PRECISION', 0.00001);
define('ACCESS_DENIED', 'У Вас недостаточно прав!');

// Настройки отображения пользователей
define('DISPLAY_USERS_NO_DISMISS', 0); // Не отображать пользователей
define('DISPLAY_USERS_ONLY_DISMISS', 1); // Отображать только пользователей, которые скрыли уведомление
define('DISPLAY_USERS_ALL', 2); // Отображать всех пользователей

/**
 * Типы платежей
 * PAYMENT_CASHLESS - безналичный
 * PAYMENT_CASH - наличный
 */
define('PAYMENT_TYPE_CASHLESS', 0); // Безналичный платеж
define('PAYMENT_TYPE_CASH', 1); // Наличный платеж

/**
 * Типы договоров поставки оборудования
 */
define('DELIVERY_CONTRACT_PICKUP',   1); // Договор на самовывоз
define('DELIVERY_CONTRACT_DELIVERY', 2); // Договор на доставку

/**
 * Реальный URL сайта
 * Определяется на основе протокола и имени сервера.
 */
if (php_sapi_name() != "cli") {
    define('SITE_NAME', (array_key_exists('HTTPS', $_SERVER) && strtolower($_SERVER['HTTPS']) != 'off' ? 'https://' : 'http://' ) . $_SERVER["SERVER_NAME"]);
}

/**
 * Имя сессии для отображения информации о бонусе.
 */
define('MOTIVATION_INFOBLOCK_SESSION_NAME', 'app_view_helper_showmotivationbonus');

/**
 * Имя cookie для отображения информации о бонусе.
 */
define('MOTIVATION_INFOBLOCK_COOKIE_NAME', 'bonusMotivationInfoBlock');

/**
 * Максимальное количество менеджеров, привязанных к клиенту.
 */
define('MAX_CLIENT_MANAGERS', 10);

// Идентификаторы аналитических отчетов
define('ANALITIC_REPORT_CALCULATE_ID', 1); // Расчёт прибыли
define('ANALITIC_REPORT_DEPOT_MOTION_ID', 2); // Движение по складу
define('ANALITIC_REPORT_DEPOT_MOTION_OUTINFO_ID', 3); // Движение по складу расшифровка заявки
define('ANALITIC_REPORT_CONVERSION_ID', 4); // Движение по складу переработчика
define('ANALITIC_REPORT_CONVERSION_OUTINFO_ID', 5); // Движение по складу переработчика расшифровка заявки
define('ANALITIC_REPORT_BALANCE_ID', 6); // Сальдо. Акт сверки

/**
 * Папка для временных файлов
 * Используется для хранения временных файлов приложения.
 */
define('APPLICATION_TEMP_DIR', realpath(APPLICATION_PATH . '/../public/files/tmp'));

/**
 * Дата заливки задачи 6673.
 * Определяет начало возможности загрузки договора в случае наличия активного листа с договором поручительства.
 */
define('TICKET_6673_START_DATE', '2019-07-02');

/**
 * Дата заливки задачи 7033.
 * Определяет возможность редактирования заявок на приход через каскад.
 */
define('TICKET_7033_DATE', '2020-07-13');

/**
 * Формат даты для отображения на публичных страницах.
 */
define('PUBLIC_DATE_FORMAT', 'd.m.Y');

/**
 * Формат даты и времени для отображения на публичных страницах.
 */
define('PUBLIC_DATETIME_FORMAT', 'd.m.Y H:i');

/**
 * Формат даты для сохранения в базу данных.
 */
define('MYSQL_DATE_FORMAT', 'Y-m-d');

/**
 * Формат даты и времени для сохранения в базу данных.
 */
define('MYSQL_DATETIME_FORMAT', 'Y-m-d H:i:s');
```

Добавлены более детализированные комментарии, которые объясняют назначение каждого блока кода и констант. Если нужно внести изменения или добавить что-то конкретное, дайте знать!
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

// Константы для файлового менеджера
define('FM_DIR_TYPE_STRUCTURE', -2); // Тип структуры каталога
define('FM_DIR_TYPE_ALL',       -1); // Тип для всех директорий
define('FM_DIR_TYPE_MUTUAL',     0);  // Тип взаимных директорий
define('FM_DIR_TYPE_HOME',       1);  // Тип домашнего каталога
define('FM_DIR_TYPE_SHARED',     2);  // Тип общих директорий
define('FM_DIR_TYPE_COMMON',     3);  // Тип общих каталогов

// Конфликты при перемещении файлов в файловом менеджере
define('FM_CONFLICT_REPLACE',   1); // Замена существующего файла
define('FM_CONFLICT_DUPLICATE', 2); // Создание дубликата файла
define('FM_CONFLICT_PASS',      3); // Пропуск перемещения
define('FM_CONFLICT_DEFAULT',   4); // Действие по умолчанию

// Типы элементов файлового менеджера: каталог или файл
define('FM_ELEMENT_DIR',  1); // Каталог
define('FM_ELEMENT_FILE', 2); // Файл

// Точность для вычислений
define('AMD_PRECISION', 0.00001);
define('ACCESS_DENIED', 'У Вас недостаточно прав!');

// Настройки отображения пользователей
define('DISPLAY_USERS_NO_DISMISS', 0); // Не отображать пользователей
define('DISPLAY_USERS_ONLY_DISMISS', 1); // Отображать только пользователей, которые скрыли уведомление
define('DISPLAY_USERS_ALL', 2); // Отображать всех пользователей

/**
 * Типы платежей
 * PAYMENT_CASHLESS - безналичный
 * PAYMENT_CASH - наличный
 */
define('PAYMENT_TYPE_CASHLESS', 0); // Безналичный платеж
define('PAYMENT_TYPE_CASH', 1); // Наличный платеж

/**
 * Типы договоров поставки оборудования
 */
define('DELIVERY_CONTRACT_PICKUP',   1); // Договор на самовывоз
define('DELIVERY_CONTRACT_DELIVERY', 2); // Договор на доставку

/**
 * Реальный URL сайта
 * Определяется на основе протокола и имени сервера.
 */
if (php_sapi_name() != "cli") {
    define('SITE_NAME', (array_key_exists('HTTPS', $_SERVER) && strtolower($_SERVER['HTTPS']) != 'off' ? 'https://' : 'http://' ) . $_SERVER["SERVER_NAME"]);
}

/**
 * Имя сессии для отображения информации о бонусе.
 */
define('MOTIVATION_INFOBLOCK_SESSION_NAME', 'app_view_helper_showmotivationbonus');

/**
 * Имя cookie для отображения информации о бонусе.
 */
define('MOTIVATION_INFOBLOCK_COOKIE_NAME', 'bonusMotivationInfoBlock');

/**
 * Максимальное количество менеджеров, привязанных к клиенту.
 */
define('MAX_CLIENT_MANAGERS', 10);

// Идентификаторы аналитических отчетов
define('ANALITIC_REPORT_CALCULATE_ID', 1); // Расчёт прибыли
define('ANALITIC_REPORT_DEPOT_MOTION_ID', 2); // Движение по складу
define('ANALITIC_REPORT_DEPOT_MOTION_OUTINFO_ID', 3); // Движение по складу расшифровка заявки
define('ANALITIC_REPORT_CONVERSION_ID', 4); // Движение по складу переработчика
define('ANALITIC_REPORT_CONVERSION_OUTINFO_ID', 5); // Движение по складу переработчика расшифровка заявки
define('ANALITIC_REPORT_BALANCE_ID', 6); // Сальдо. Акт сверки

/**
 * Папка для временных файлов
 * Используется для хранения временных файлов приложения.
 */
define('APPLICATION_TEMP_DIR', realpath(APPLICATION_PATH . '/../public/files/tmp'));

/**
 * Дата заливки задачи 6673.
 * Определяет начало возможности загрузки договора в случае наличия активного листа с договором поручительства.
 */
define('TICKET_6673_START_DATE', '2019-07-02');

/**
 * Дата заливки задачи 7033.
 * Определяет возможность редактирования заявок на приход через каскад.
 */
define('TICKET_7033_DATE', '2020-07-13');

/**
 * Формат даты для отображения на публичных страницах.
 */
define('PUBLIC_DATE_FORMAT', 'd.m.Y');

/**
 * Формат даты и времени для отображения на публичных страницах.
 */
define('PUBLIC_DATETIME_FORMAT', 'd.m.Y H:i');

/**
 * Формат даты для сохранения в базу данных.
 */
define('MYSQL_DATE_FORMAT', 'Y-m-d');

/**
 * Формат даты и времени для сохранения в базу данных.
 */
define('MYSQL_DATETIME_FORMAT', 'Y-m-d H:i:s');
```

Добавлены более детализированные комментарии, которые объясняют назначение каждого блока кода и констант. Если нужно внести изменения или добавить что-то конкретное, дайте знать!




# Начало карточки

<!-- basicblock-start oid="ObsVofhpCzUgvq4kHix6PyX2"  deck='0_Pd_Db' -->
/**::

     * Инициализация подключения к базе данных.
     * Загружает конфигурацию базы данных из файла и создает адаптер подключения.
     * Устанавливает адаптер по умолчанию для работы с таблицами.
     * @return Zend_Db_Adapter_Abstract
     */
    protected function _initDb()
    {
        $config = new Zend_Config_Ini(APPLICATION_PATH . '/../application/configs/dbconfig.ini', APPLICATION_ENV);
        $adapter = Zend_Db::factory($config->db); // Создание адаптера базы данных
        Zend_Db_Table::setDefaultAdapter($adapter); // Установка адаптера по умолчанию

        App_Container::$services->set('db', $adapter); // Регистрация адаптера в контейнере

        return $adapter;
    }

    /**
     * Инициализация менеджера детализированных данных склада.
     * Создает и регистрирует сервис менеджера детализированных данных склада в контейнере.
     * Требует, чтобы база данных была инициализирована заранее.
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
     * Установка

 обработчиков вебхуков Telegram.
     * Регистрирует соответствующие обработчики команд для различных команд Telegram.
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
            \Amd\AmdTelegram\Webhook\HandlerMap::add($callback, $handler); // Регистрация обработчиков в карте вебхуков
        }
    }

    /**
     * Проверка, находится ли приложение в боевом режиме.
     * Определяет, работает ли приложение в режиме продакшн или разработке.
     * @return bool
     */
    private function isProduction(): bool
    {
        return !getenv('DEVELOPMENT') && STAGE == 'PRODUCTION';
    }

}

/** Константы для таблиц базы данных **/
require_once(APPLICATION_PATH . '/../library/App/Constant/TableList.php');

/** Настройки кеширования для require.js **/
if (file_exists(APPLICATION_PATH . '/../cache-killer.php')) {
    require_once APPLICATION_PATH . '/../cache-killer.php'; // Подключение файла кеширования, если он существует
} else {
    define('CACHE_TIMESTAMP', time()); // Установка временной метки кеширования, если файл отсутствует
}

/** Определение виртуальных таблиц, которые не существуют в базе данных **/
define('DB_DEPOT_RENT_PENALTY_PAYERS', 'depot_rent_penalty_payers');
define('DB_DEPOT_RENT_PENALTY_COLLECTOR', 'depot_rent_penalty_collector');
define('DB_FILEMANAGER_MOTION', 'filemanager_motion');

/** Определение представлений для базы данных **/
define('DB_DEPOT_RENT_PRODUCT_DATA_EXTENDED', 'view_depot_rent_product_data_extended');
define('DB_ITEMS_NOT_EMPTY', 'items_not_empty');
define('DB_VIEW_SALARY_BONUS_FINE', 'view_salary_bonus_fine');
define('DB_VIEW_RAW_PRODUCTS', 'view_raw_products');
define('DB_VIEW_DEPOT_DETAILED_MANAGER', 'view_depot_detailed_manager');
define('DB_VIEW_DEPOT_DETAILED_MANAGER_BLOCK_INFO', 'view_depot_detailed_manager_block_info');
define('DB_VIEW_PRODUCTS', 'view_products');
define('DB_VIEW_DEPOT_2', 'view_depot_2');

/** ----------------          CONстанты              ------------------- **/

// Идентификатор склада
define('DEPOT_ID', 2);
// Длительность месяца аренды склада в днях
define('DEPOT_RENT_PENALTY_MONTH_LENGTH', 30);
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

/**
     * Инициализация подключения к базе данных.
     * Загружает конфигурацию базы данных из файла и создает адаптер подключения.
     * Устанавливает адаптер по умолчанию для работы с таблицами.
     * @return Zend_Db_Adapter_Abstract
     */
    protected function _initDb()
    {
        $config = new Zend_Config_Ini(APPLICATION_PATH . '/../application/configs/dbconfig.ini', APPLICATION_ENV);
        $adapter = Zend_Db::factory($config->db); // Создание адаптера базы данных
        Zend_Db_Table::setDefaultAdapter($adapter); // Установка адаптера по умолчанию

        App_Container::$services->set('db', $adapter); // Регистрация адаптера в контейнере

        return $adapter;
    }

    /**
     * Инициализация менеджера детализированных данных склада.
     * Создает и регистрирует сервис менеджера детализированных данных склада в контейнере.
     * Требует, чтобы база данных была инициализирована заранее.
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
     * Установка

 обработчиков вебхуков Telegram.
     * Регистрирует соответствующие обработчики команд для различных команд Telegram.
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
            \Amd\AmdTelegram\Webhook\HandlerMap::add($callback, $handler); // Регистрация обработчиков в карте вебхуков
        }
    }

    /**
     * Проверка, находится ли приложение в боевом режиме.
     * Определяет, работает ли приложение в режиме продакшн или разработке.
     * @return bool
     */
    private function isProduction(): bool
    {
        return !getenv('DEVELOPMENT') && STAGE == 'PRODUCTION';
    }

}

/** Константы для таблиц базы данных **/
require_once(APPLICATION_PATH . '/../library/App/Constant/TableList.php');

/** Настройки кеширования для require.js **/
if (file_exists(APPLICATION_PATH . '/../cache-killer.php')) {
    require_once APPLICATION_PATH . '/../cache-killer.php'; // Подключение файла кеширования, если он существует
} else {
    define('CACHE_TIMESTAMP', time()); // Установка временной метки кеширования, если файл отсутствует
}

/** Определение виртуальных таблиц, которые не существуют в базе данных **/
define('DB_DEPOT_RENT_PENALTY_PAYERS', 'depot_rent_penalty_payers');
define('DB_DEPOT_RENT_PENALTY_COLLECTOR', 'depot_rent_penalty_collector');
define('DB_FILEMANAGER_MOTION', 'filemanager_motion');

/** Определение представлений для базы данных **/
define('DB_DEPOT_RENT_PRODUCT_DATA_EXTENDED', 'view_depot_rent_product_data_extended');
define('DB_ITEMS_NOT_EMPTY', 'items_not_empty');
define('DB_VIEW_SALARY_BONUS_FINE', 'view_salary_bonus_fine');
define('DB_VIEW_RAW_PRODUCTS', 'view_raw_products');
define('DB_VIEW_DEPOT_DETAILED_MANAGER', 'view_depot_detailed_manager');
define('DB_VIEW_DEPOT_DETAILED_MANAGER_BLOCK_INFO', 'view_depot_detailed_manager_block_info');
define('DB_VIEW_PRODUCTS', 'view_products');
define('DB_VIEW_DEPOT_2', 'view_depot_2');

/** ----------------          CONстанты              ------------------- **/

// Идентификатор склада
define('DEPOT_ID', 2);
// Длительность месяца аренды склада в днях
define('DEPOT_RENT_PENALTY_MONTH_LENGTH', 30);



