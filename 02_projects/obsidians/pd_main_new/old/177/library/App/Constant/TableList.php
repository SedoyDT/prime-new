<?php

/**
 * ToDo добавить комментарий
 */
define('DB_0_TABLE_EXAMPLE', '0_TABLE_EXAMPLE');

/**
 * Листья дерева прав
 */
define('DB_ACCESS_DATA', 'access_data');

/**
 * Роли пользователей
 */
define('DB_ACCESS_ROLES', 'access_roles');

/**
 * Установленные значения прав для пользователей и ролей
 */
define('DB_ACCESS_ROLES_DATA', 'access_roles_data');

/**
 * Хранит параметры страницы Редактирование прав пользователя
 */
define('DB_ACCESS_SETTINGS', 'access_settings');

/**
 * Дерево прав
 */
define('DB_ACCESS_TREE', 'access_tree');

/**
 * Файлы в актах сверок, для отчетов и записей
 */
define('DB_ACT_REVISE_CONTROL_FILES', 'act_revise_control_files');

/**
 * Записи в актах сверок
 */
define('DB_ACT_REVISE_CONTROL_LIST', 'act_revise_control_list');

/**
 * Статусы записей в актах сверок
 */
define('DB_ACT_REVISE_CONTROL_LIST_STATES', 'act_revise_control_list_states');

/**
 * Отчеты актов сверок
 */
define('DB_ACT_REVISE_CONTROL_REPORT', 'act_revise_control_report');

/**
 * Статусы отчетов в проверке актов сверок
 */
define('DB_ACT_REVISE_CONTROL_REPORT_STATES', 'act_revise_control_report_states');

/**
 * Временные интервалы оповещений
 */
define('DB_ACTIVITY_NOTIFICATION_INTERVALS', 'activity_notification_intervals');

/**
 * Правила выбора пользователей для наблюдения
 */
define('DB_ACTIVITY_NOTIFICATION_USERS', 'activity_notification_users');

/**
 * Журнал авторизации: оповещения
 */
define('DB_ACTIVITY_NOTIFICATIONS', 'activity_notifications');

/**
 * Таблица с группами правил
 */
define('DB_ACTIVITY_RULES', 'activity_rules');

/**
 * Исключения контроля рабочего времени
 */
define('DB_ACTIVITY_RULES_EXCEPTIONS', 'activity_rules_exceptions');

/**
 * Градация суммы штрафов
 */
define('DB_ACTIVITY_RULES_GRADUATIONS', 'activity_rules_graduations');

/**
 * Объекты правил
 */
define('DB_ACTIVITY_RULES_OBJECTS', 'activity_rules_objects');

/**
 * Индивидуальные временные правила
 */
define('DB_ACTIVITY_RULES_TIME', 'activity_rules_time');

/**
 * Активность вода кода dsa09
 */
define('DB_ACTIVITY_SECRET_KEY', 'activity_secret_key');

/**
 * Контроль рабочего времени
 */
define('DB_ACTIVITY_TIME_TRACKER', 'activity_time_tracker');

/**
 * Сводный результат за месяц
 */
define('DB_ACTIVITY_TIME_TRACKER_MONTH', 'activity_time_tracker_month');

/**
 * Типы активности пользователей для таблицы activity_user
 */
define('DB_ACTIVITY_TYPE', 'activity_type');

/**
 * Активность входов в систему пользователей
 */
define('DB_ACTIVITY_USER', 'activity_user');

/**
 * Рекламные площадки
 */
define('DB_ADVERTISING_PLATFORMS', 'advertising_platforms');

/**
 * Клиенты с которыми мы общаемся по сети
 */
define('DB_AMD_NETWORK_CLIENTS', 'amd_network_clients');

/**
 * Конфигурации аналитических отчётов
 */
define('DB_ANALITIC_REPORT_CONFIGS', 'analitic_report_configs');

/**
 * Виды аналитических отчётов
 */
define('DB_ANALITIC_REPORTS_TYPES', 'analitic_reports_types');

/**
 * Корректировки сальдо руководителей
 */
define('DB_ANALITICS_DIRECTORWAGE_BALANCE_CORRECTION', 'analitics_directorwage_balance_correction');

/**
 * Исключения транзакций из кассы нал для сальдо руководителя
 */
define('DB_ANALITICS_DIRECTORWAGE_BALANCE_EXCLUSION', 'analitics_directorwage_balance_exclusion');

/**
 * Таблица с данными по расходам для зарплаты руководителей, собранными с двух проектов, данные формируются через отчёт
 */
define('DB_ANALITICS_DIRECTORWAGE_DETAILED_EXPENSE', 'analitics_directorwage_detailed_expense');

/**
 * Доходы для зарплаты руководителей
 */
define('DB_ANALITICS_DIRECTORWAGE_EARNING', 'analitics_directorwage_earning');

/**
 * Таблица с расходами для расчёта зарплаты руководителей
 */
define('DB_ANALITICS_DIRECTORWAGE_EXPENSE', 'analitics_directorwage_expense');

/**
 * Таблица для хранения переходов расходов, нужно для корректировки
 */
define('DB_ANALITICS_DIRECTORWAGE_EXPENSE_TRANSFER', 'analitics_directorwage_expense_transfer');

/**
 * Таблица используемых коэффициентов разбитая по периодам
 */
define('DB_ANALITICS_DIRECTORWAGE_OPTION', 'analitics_directorwage_option');

/**
 * Прибыль отделов, с зарплатой руководителей
 */
define('DB_ANALITICS_DIRECTORWAGE_PROFIT', 'analitics_directorwage_profit');

/**
 * Список зафиксированных отчетов с зарплатами руководителей
 */
define('DB_ANALITICS_DIRECTORWAGE_REPORT', 'analitics_directorwage_report');

/**
 * Таблица с отделами-участниками расчётов отчета зп руководителей
 */
define('DB_ANALITICS_DIRECTORWAGE_REPORT_PARTICIPANT', 'analitics_directorwage_report_participant');

/**
 * зп руководителей: зп отдела снабжения
 */
define('DB_ANALITICS_DIRECTORWAGE_SUPPLIER_MOTIVATION', 'analitics_directorwage_supplier_motivation');

/**
 * Таблица с неоплаченными заявками для расчёта зп руководителей
 */
define('DB_ANALITICS_DIRECTORWAGE_UNPAIDCLAIM', 'analitics_directorwage_unpaidclaim');

/**
 * Настройки пользователя для страницы Зарплата руководителей
 */
define('DB_ANALITICS_DIRECTORWAGE_USER_SETTINGS', 'analitics_directorwage_user_settings');

/**
 * Таблица для хранения зарплат пользователей, рассчитанная из прибыли по отделам
 */
define('DB_ANALITICS_DIRECTORWAGE_USER_WAGE', 'analitics_directorwage_user_wage');

/**
 * Отгруженный вес для расчёта зарплаты руководителей
 */
define('DB_ANALITICS_DIRECTORWAGE_WEIGHT', 'analitics_directorwage_weight');

/**
 * Примечания для отчёта "стоимость транспорта за кг"
 */
define('DB_ANALITICS_TRANSPORTPRICES_ANNOTATIONS', 'analitics_transportprices_annotations');

/**
 * Документы для примечаний отчёта "стоимость транспорта за кг"
 */
define('DB_ANALITICS_TRANSPORTPRICES_ANNOTATIONS_DOCUMENTS', 'analitics_transportprices_annotations_documents');

/**
 * Дополнительная информация для отчёта запросы без производства
 */
define('DB_ANALITYCS_CLOSEDBYMANAGER', 'analitycs_closedbymanager');

/**
 * Финансовый саппорт документы на проверку
 */
define('DB_ANALYTICS_FINANCE', 'analytics_finance');

/**
 * Архивные записи отчета с низкомаржинальными закупками
 */
define('DB_ANALYTICS_LOW_MARGIN_PURCHASE_ARCHIVE', 'analytics_low_margin_purchase_archive');

/**
 * прибыльность по товарам: прибыльность товаров по складам, колонки складов добавляются динамически
 */
define('DB_ANALYTICS_PRODUCT_PROFITABILITY', 'analytics_product_profitability');

/**
 * прибыльность по товарам: данные по прибыльности товаров по складам
 */
define('DB_ANALYTICS_PRODUCT_PROFITABILITY_BY_DEPOT', 'analytics_product_profitability_by_depot');

/**
 * прибыльность по товарам: настройки расчета прибыльности
 */
define('DB_ANALYTICS_PRODUCT_PROFITABILITY_SETTING', 'analytics_product_profitability_setting');

/**
 * Рассчитанные данные по переменным для расчета рентабельности бизнеса
 */
define('DB_ANALYTICS_PROFITABILITY_VARS', 'analytics_profitability_vars');

/**
 * Данные по докапитализации
 */
define('DB_ANALYTICS_PROJECT_CAPITALIZATION', 'analytics_project_capitalization');

/**
 * Анализ продаж, исходные данные для отчета
 */
define('DB_ANALYTICS_SALES_ANALYSIS', 'analytics_sales_analysis');

/**
 * ToDo добавить комментарий
 */
define('DB_ANALYTICS_SALES_ANALYSIS_MARGINALITY', 'analytics_sales_analysis_marginality');

/**
 * Анализ продаж, очередь сбора данных
 */
define('DB_ANALYTICS_SALES_ANALYSIS_QUEUE', 'analytics_sales_analysis_queue');

/**
 * ToDo добавить комментарий
 */
define('DB_ANALYTICS_SALES_ANALYSIS_TURNOVER', 'analytics_sales_analysis_turnover');

/**
 * Рейтинг клиентов Авантпак
 */
define('DB_ANALYTICS_TOP_CLIENTS_AVANTPACK', 'analytics_top_clients_avantpack');

/**
 * Категории итогового рейтинга
 */
define('DB_ANALYTICS_TOP_CLIENTS_AVANTPACK_CATEGORIES', 'analytics_top_clients_avantpack_categories');

/**
 * Настройки отображения рейтинга по ролям(-1 - по умолчанию)
 */
define('DB_ANALYTICS_TOP_CLIENTS_AVANTPACK_ROLE_SETTINGS', 'analytics_top_clients_avantpack_role_settings');

/**
 * Настройки рейтинга клиентов Авантпак
 */
define('DB_ANALYTICS_TOP_CLIENTS_AVANTPACK_SETTINGS', 'analytics_top_clients_avantpack_settings');

/**
 * Доп информация для отчета Не проведённый транспорт
 */
define('DB_ANALYTICS_TRANSPORT_WITHOUT_TRANSACTION', 'analytics_transport_without_transaction');

/**
 * Исключенные пользователи авансовых транзакций
 */
define('DB_ANALYTICS_UNPROCESSED_RETURNS_EXCLUDED_USERS', 'analytics_unprocessed_returns_excluded_users');

/**
 * Авито: аккаунты
 */
define('DB_AVITO_ACCOUNT', 'avito_account');

/**
 * Авито: чаты
 */
define('DB_AVITO_CHAT', 'avito_chat');

/**
 * Авито: сообщения в чатах
 */
define('DB_AVITO_CHAT_MESSAGE', 'avito_chat_message');

/**
 * Авито: типы сообщений
 */
define('DB_AVITO_CHAT_MESSAGE_TYPE', 'avito_chat_message_type');

/**
 * Авито: типы чатов
 */
define('DB_AVITO_CHAT_TYPE', 'avito_chat_type');

/**
 * авито: связь пользователей с объявлениями
 */
define('DB_AVITO_EMPLOYEE_ITEM', 'avito_employee_item');

/**
 * Авито: объявления
 */
define('DB_AVITO_ITEM', 'avito_item');

/**
 * Авито: пользователи
 */
define('DB_AVITO_USER', 'avito_user');

/**
 * Базовые цены: базовые цены по товарам на текущий момент
 */
define('DB_BASE_PRICE_CURRENT', 'base_price_current');

/**
 * Установленные базовые цены для товаров
 */
define('DB_BASE_PRICES', 'base_prices');

/**
 * Журнал событий изменения базовой цены
 */
define('DB_BASE_PRICES_CLAIM_PRODUCTS', 'base_prices_claim_products');

/**
 * Классификации групп БЦ
 */
define('DB_BASE_PRICES_CLASSIFICATION', 'base_prices_classification');

/**
 * Параметры классификаций групп БЦ
 */
define('DB_BASE_PRICES_CLASSIFICATION_DATA', 'base_prices_classification_data');

/**
 * Расшифровка параметров классификаций групп БЦ
 */
define('DB_BASE_PRICES_CLASSIFICATION_PARAMS', 'base_prices_classification_params');

/**
 * Группы БЦ
 */
define('DB_BASE_PRICES_GROUPS', 'base_prices_groups');

/**
 * Акционные БЦ Групп
 */
define('DB_BASE_PRICES_GROUPS_ABP', 'base_prices_groups_abp');

/**
 * Значения параметров группы БЦ
 */
define('DB_BASE_PRICES_GROUPS_DATA', 'base_prices_groups_data');

/**
 * История изменения группы БЦ
 */
define('DB_BASE_PRICES_GROUPS_HISTORY', 'base_prices_groups_history');

/**
 * Расшифровка значений параметров группы БЦ
 */
define('DB_BASE_PRICES_GROUPS_VALUES', 'base_prices_groups_values');

/**
 * Планы на базовые цены
 */
define('DB_BASE_PRICES_PLANS', 'base_prices_plans');

/**
 * Контроль блокировки заявок
 */
define('DB_BLOCK_SOURCE', 'block_source');

/**
 * Блокировка сырья на складе
 */
define('DB_BLOCKS', 'blocks');

/**
 * Блокировка сырья на складе
 */
define('DB_BLOCKS_DETAILED', 'blocks_detailed');

/**
 * Блокировка по товарам на торговых площадках
 */
define('DB_BLOCKS_MARKETPLACE', 'blocks_marketplace');

/**
 * Блокировка сырья для переработки
 */
define('DB_BLOCKS_MATERIAL', 'blocks_material');

/**
 * Связь блокировок запчастей на Дочернем проекте с секциями на Главном
 */
define('DB_BLOCKS_SPARE', 'blocks_spare');

/**
 * Список бункеров смесителя для расчета
 */
define('DB_CALCULATION_MIXER_BUNKERS', 'calculation_mixer_bunkers');

/**
 * Производительность бункеров смесителя
 */
define('DB_CALCULATION_MIXER_BUNKERS_PERFORMANCE', 'calculation_mixer_bunkers_performance');

/**
 * Листы с расчётами
 */
define('DB_CALCULATION_SHEET', 'calculation_sheet');

/**
 * Список типов оплаты
 */
define('DB_CALCULATION_SHEET_PAYMENT_TYPES', 'calculation_sheet_payment_types');

/**
 * Статусы листов расчета
 */
define('DB_CALCULATION_SHEET_STATUSES', 'calculation_sheet_statuses');

/**
 * Параметры календаря, хранит все  выходные и праздничные дни
 */
define('DB_CALENDAR_DATE_OPTIONS', 'calendar_date_options');

/**
 * Календарь: типы событий на календаре
 */
define('DB_CALENDAR_EVENT_TYPE', 'calendar_event_type');

/**
 * Календарь: режимы работы календаря
 */
define('DB_CALENDAR_MODE', 'calendar_mode');

/**
 * Календарь: напоминания
 */
define('DB_CALENDAR_NOTIFICATION', 'calendar_notification');

/**
 * Календарь: пользовательские настройки
 */
define('DB_CALENDAR_USER_SETTINGS', 'calendar_user_settings');

/**
 * Календарь: настройки синхронизации с яндекс календарём
 */
define('DB_CALENDAR_YANDEX_SYNC_SETTINGS', 'calendar_yandex_sync_settings');

/**
 * Календарь: пользовательские настройки синхронизации
 */
define('DB_CALENDAR_YANDEX_SYNC_USER', 'calendar_yandex_sync_user');

/**
 * Проверка входящих звонков, связь с таблице call_records
 */
define('DB_CALL_CHECK', 'call_check');

/**
 * Возможные варианты ответов для вопроса
 */
define('DB_CALL_CHECK_ANSWERS', 'call_check_answers');

/**
 * Ответы на вопросы которые дал пользователь
 */
define('DB_CALL_CHECK_GIVEN_ANSWERS', 'call_check_given_answers');

/**
 * Связь вопросов с ответами
 */
define('DB_CALL_CHECK_QUESTION_ANSWER', 'call_check_question_answer');

/**
 * Список вопросов для проверки звонков
 */
define('DB_CALL_CHECK_QUESTIONS', 'call_check_questions');

/**
 * Статусы проверок
 */
define('DB_CALL_CHECK_STATES', 'call_check_states');

/**
 * Типы подозрительности проверки
 */
define('DB_CALL_CHECK_SUSPICION_KINDS', 'call_check_suspicion_kinds');

/**
 * Рассчитанные данные клиентов на обзвон
 */
define('DB_CALL_CLIENTS_BACK', 'call_clients_back');

/**
 * Дополнительные данные для call_clients_back
 */
define('DB_CALL_CLIENTS_BACK_DATA', 'call_clients_back_data');

/**
 * Связь id из call_clients_back с клиентами проектов
 */
define('DB_CALL_CLIENTS_BACK_PROJECTS', 'call_clients_back_projects');

/**
 * Связь номера с отделом
 */
define('DB_CALL_DEPARTMENT_PHONES', 'call_department_phones');

/**
 * Лог загрузок файлов для модуля несоответствия исходящих звонков
 */
define('DB_CALL_DISPARITY_LOG', 'call_disparity_log');

/**
 * Детальная информация для модуля несоответствия исходящих звонков
 */
define('DB_CALL_DISPARITY_RESULT', 'call_disparity_result');

/**
 * Типы принимающих номеров
 */
define('DB_CALL_HOST_NUMBER_TYPES', 'call_host_number_types');

/**
 * Напоминания о звонках, те что отправляются на почту
 */
define('DB_CALL_NOTIFICATION', 'call_notification');

/**
 * Лог XMK парсера
 */
define('DB_CALL_PARSE_LOG', 'call_parse_log');

/**
 * Таблица с телефонами по которым определяется, что звонок для пользователя - личный
 */
define('DB_CALL_PERSONAL_PHONE', 'call_personal_phone');

/**
 * Файлы для номеров в контроле звонков
 */
define('DB_CALL_PHONE_FILES', 'call_phone_files');

/**
 * Описание аудиофайлов для контроля звонков
 */
define('DB_CALL_RECORDS', 'call_records');

/**
 * Регистрация звонков вход. исход.
 */
define('DB_CALL_REGISTRY', 'call_registry');

/**
 * Таблица с привязками записей контроля звонков к клиентам
 */
define('DB_CALL_REGISTRY_CLIENT', 'call_registry_client');

/**
 * Данные из регистрации звонков
 */
define('DB_CALL_REGISTRY_DATA', 'call_registry_data');

/**
 * Направления звонков
 */
define('DB_CALL_REGISTRY_DIRECTIONS', 'call_registry_directions');

/**
 * Флаги об обработке упущенных звонков
 */
define('DB_CALL_REGISTRY_MISSED_CALL_VIEW', 'call_registry_missed_call_view');

/**
 * Номера телефонов из регистрации звонков
 */
define('DB_CALL_REGISTRY_PHONES', 'call_registry_phones');

/**
 * Результат пост проверки звонков, пришедших с атс
 */
define('DB_CALL_REGISTRY_POSTCHECK', 'call_registry_postcheck');

/**
 * Описание потенциальный клиент или нет в регистрации звонков
 */
define('DB_CALL_REGISTRY_POTENTIAL', 'call_registry_potential');

/**
 * Типы потенциальных клиентов
 */
define('DB_CALL_REGISTRY_POTENTIAL_TYPES', 'call_registry_potential_types');

/**
 * ToDo добавить комментарий
 */
define('DB_CALL_REGISTRY_RECORD_STATES', 'call_registry_record_states');

/**
 * Типы записей в регистрации звонков
 */
define('DB_CALL_REGISTRY_TYPES', 'call_registry_types');

/**
 * Напоминания о звонка, выставленные в гриде
 */
define('DB_CALL_REMINDER', 'call_reminder');

/**
 * Связь проверки с отчетом
 */
define('DB_CALL_REPORT_CHECK', 'call_report_check');

/**
 * Отчеты проверок в контроле звонков
 */
define('DB_CALL_REPORTS', 'call_reports');

/**
 * Типы расценок в тарифах проверки звонков
 */
define('DB_CALL_TARIFF_VALUE_TYPES', 'call_tariff_value_types');

/**
 * Расценки тарифного плана
 */
define('DB_CALL_TARIFF_VALUES', 'call_tariff_values');

/**
 * Тарифы в проверке звонков
 */
define('DB_CALL_TARIFFS', 'call_tariffs');

/**
 * Таблица для хранения архива задач руководителя
 */
define('DB_CALL_TASKS_ARCHIVE', 'call_tasks_archive');

/**
 * звонки: расшифровка
 */
define('DB_CALL_TRANSCRIPTION', 'call_transcription');

/**
 * Неопределенные номера при парсинге ХМЛ в контроле звонков
 */
define('DB_CALL_UNDEFINED_EXT', 'call_undefined_ext');

/**
 * Установленные параметры доступа к кассе
 */
define('DB_CASH_ACCESS', 'cash_access');

/**
 * Касса безнал, хранит транзакции по безналу
 */
define('DB_CASH_ACCOUNT', 'cash_account');

/**
 * Анализ безнальных расходов, связь транзакций или запросов с примечаниями, статус записей
 */
define('DB_CASH_ACCOUNT_EXPENSES_ANALYSIS', 'cash_account_expenses_analysis');

/**
 * Анализ безнальных расходов, примечания
 */
define('DB_CASH_ACCOUNT_EXPENSES_ANALYSIS_ANNOTATIONS', 'cash_account_expenses_analysis_annotations');

/**
 * Список счетов
 */
define('DB_CASH_ACCOUNT_NUMBERS', 'cash_account_numbers');

/**
 * Обработанные авансовые транзакции
 */
define('DB_CASH_ACCOUNT_VZM', 'cash_account_vzm');

/**
 * Примечание для транзакций
 */
define('DB_CASH_ANNOTATION', 'cash_annotation');

/**
 * ToDo добавить комментарий
 */
define('DB_CASH_BACKUP', 'cash_backup');

/**
 * Список банков с реквизитами
 */
define('DB_CASH_BANKS', 'cash_banks');

/**
 * Отделы, на которое не падает расход по транзакции в отчете зп руководителей
 */
define('DB_CASH_DIRECTOR_WAGE_EXCEPTIONS', 'cash_director_wage_exceptions');

/**
 * Хранит копии транзакций при загрузке из файла
 */
define('DB_CASH_DUPLICATES', 'cash_duplicates');

/**
 * Таблица для хранения мнимых транзакций
 */
define('DB_CASH_IMAGINARY', 'cash_imaginary');

/**
 * Конфиг типов мнимых транзакций
 */
define('DB_CASH_IMAGINARY_CONFIG', 'cash_imaginary_config');

/**
 * Правила учета типа мнимых транзакции для модуля
 */
define('DB_CASH_IMAGINARY_MODULE_RULES', 'cash_imaginary_module_rules');

/**
 * Список модулей для которых нужны правила учета типов мнимых транзакций
 */
define('DB_CASH_IMAGINARY_MODULES', 'cash_imaginary_modules');

/**
 * История импорта транзакций
 */
define('DB_CASH_IMPORT', 'cash_import');

/**
 * Касса нал, хранит транзакции по налу
 */
define('DB_CASH_MONEY', 'cash_money');

/**
 * Запросы кассового чека
 */
define('DB_CASH_MONEY_CHECK_REQUEST', 'cash_money_check_request');

/**
 * Запрос кассового чека: файлы
 */
define('DB_CASH_MONEY_CHECK_REQUEST_FILE', 'cash_money_check_request_file');

/**
 * Запрос кассового чека: типы файлов
 */
define('DB_CASH_MONEY_CHECK_REQUEST_FILE_TYPE', 'cash_money_check_request_file_type');

/**
 * Данные о последних просмотрах запросов
 */
define('DB_CASH_MONEY_CHECK_REQUEST_LAST_VIEW', 'cash_money_check_request_last_view');

/**
 * Статусы запросов кассового чека
 */
define('DB_CASH_MONEY_CHECK_REQUEST_STATE', 'cash_money_check_request_state');

/**
 * ToDo добавить комментарий
 */
define('DB_CASH_MONEY_GROUPPED_TRANSACTIONS', 'cash_money_groupped_transactions');

/**
 * Таблица связей транзакций типа "Возвратные деньги"
 */
define('DB_CASH_MONEY_RETURN_PARTS', 'cash_money_return_parts');

/**
 * Касса нал Планируемые транзакции, безнал Контроль документов
 */
define('DB_CASH_PLANNED', 'cash_planned');

/**
 * Документы для транзакций
 */
define('DB_CASH_PLANNED_DOCUMENT', 'cash_planned_document');

/**
 * Авторизованные номера водителей
 */
define('DB_CASH_PLANNED_DRIVER_PHONE_CHECKED', 'cash_planned_driver_phone_checked');

/**
 * Подтвержденные платежи по заявкам
 */
define('DB_CASH_PLANNED_REJECTED', 'cash_planned_rejected');

/**
 * Статусы планируемого платежа
 */
define('DB_CASH_PLANNED_STATES', 'cash_planned_states');

/**
 * Транзакции отклоненные или без изменений при загрузке
 */
define('DB_CASH_POOL', 'cash_pool');

/**
 * Остатки на счетах компании
 */
define('DB_CASH_PROJECT_BALANCES', 'cash_project_balances');

/**
 * Компании исключения для модуля "Деньги в проекте"
 */
define('DB_CASH_PROJECT_COMPANIES', 'cash_project_companies');

/**
 * Задолженности нашей компании
 */
define('DB_CASH_PROJECT_CREDITS', 'cash_project_credits');

/**
 * Задолженности перед нашей компанией
 */
define('DB_CASH_PROJECT_DEBTS', 'cash_project_debts');

/**
 * Клиенты у которых производились изменения задним числом
 */
define('DB_CASH_PROJECT_EDIT_CLIENTS', 'cash_project_edit_clients');

/**
 * Деньги в проекте:  список клиентов с внешним офисом
 */
define('DB_CASH_PROJECT_EXTERNAL_OFFICE', 'cash_project_external_office');

/**
 * Деньги в проекте:  сальдо внешних офисов
 */
define('DB_CASH_PROJECT_EXTERNAL_OFFICE_BALANCE', 'cash_project_external_office_balance');

/**
 * Товары исключения для модуля "Деньги в проекте"
 */
define('DB_CASH_PROJECT_PRODUCTS', 'cash_project_products');

/**
 * деньги в проекте: информация по контейнерам
 */
define('DB_CASH_PROJECT_SHIPPING_CONTAINER', 'cash_project_shipping_container');

/**
 * деньги в проекте: отсрочка поставщика по контейнерам
 */
define('DB_CASH_PROJECT_SHIPPING_CONTAINER_CREDIT', 'cash_project_shipping_container_credit');

/**
 * Таблица расчетов деньги в проекте на каждый день
 */
define('DB_CASH_PROJECT_TOTAL', 'cash_project_total');

/**
 * Перемещение денег между проектами
 */
define('DB_CASH_PROJECT_TRANSFERS', 'cash_project_transfers');

/**
 * Основание для транзакций
 */
define('DB_CASH_REASON', 'cash_reason');

/**
 * Заказ средств
 */
define('DB_CASH_REQUEST', 'cash_request');

/**
 * Уравнивающие транзакции (таблица для сопоставления транзакций и заявок)
 */
define('DB_CASH_SETTLEMENT_TRANSACTIONS', 'cash_settlement_transactions');

/**
 * Информация по картам
 */
define('DB_CASH_TRANSACTION_CARDS', 'cash_transaction_cards');

/**
 * Расширенные транзакции
 */
define('DB_CASH_TRANSACTION_EXTENDED', 'cash_transaction_extended');

/**
 * Просто прикрепленные файлы транзакций
 */
define('DB_CASH_TRANSACTION_FILES', 'cash_transaction_files');

/**
 * ToDo добавить комментарий
 */
define('DB_CASH_TRANSACTION_RENTABLE', 'cash_transaction_rentable');

/**
 * Статусы запросов на списание
 */
define('DB_CHARGE_OFF_REQUEST_STATUS_TYPES', 'charge_off_request_status_types');

/**
 * Запросы на списание транзакций назначения "прочее"
 */
define('DB_CHARGE_OFF_REQUESTS', 'charge_off_requests');

/**
 * Результаты проверок в модуле проверок
 */
define('DB_CHECK_REPORT', 'check_report');

/**
 * Тип проверки для модуля проверок
 */
define('DB_CHECK_TYPES', 'check_types');

/**
 * Данные ТК, памятка водителю
 */
define('DB_CLAIM_CAR_DATA', 'claim_car_data');

/**
 * Хранит старое состояние заявки для проведения каскада
 */
define('DB_CLAIM_CASCADE_TEMP', 'claim_cascade_temp');

/**
 * Уведомления о заявках без документов
 */
define('DB_CLAIM_DOCUMENT_DEBT', 'claim_document_debt');

/**
 * Информация об ошибках в заявках
 */
define('DB_CLAIM_ERROR', 'claim_error');

/**
 * Прикрепленные к заявкам файлы
 */
define('DB_CLAIM_FILES', 'claim_files');

/**
 * Примечание для транзакций
 */
define('DB_CLAIM_FILES_ANNOTATION', 'claim_files_annotation');

/**
 * Типы файла в заявке
 */
define('DB_CLAIM_FILES_TYPE', 'claim_files_type');

/**
 * Таблица с сырьём
 */
define('DB_CLAIM_IN_RAW', 'claim_in_raw');

/**
 * Корректировки распределения
 */
define('DB_CLAIM_IN_RAW_ALLOCATION_ADJUSTMENT', 'claim_in_raw_allocation_adjustment');

/**
 * Кипы
 */
define('DB_CLAIM_IN_RAW_BALE', 'claim_in_raw_bale');

/**
 * Базовый товар
 */
define('DB_CLAIM_IN_RAW_BASE_PRODUCT', 'claim_in_raw_base_product');

/**
 * Грузчики в заявке
 */
define('DB_CLAIM_IN_RAW_CAR_LOADERS', 'claim_in_raw_car_loaders');

/**
 * Статусы оплаты грузчиков
 */
define('DB_CLAIM_IN_RAW_CAR_LOADERS_PAYMENT_STATES', 'claim_in_raw_car_loaders_payment_states');

/**
 * Ставки для грузчиков
 */
define('DB_CLAIM_IN_RAW_CAR_LOADERS_RATES', 'claim_in_raw_car_loaders_rates');

/**
 * Типы грузчиков
 */
define('DB_CLAIM_IN_RAW_CAR_LOADERS_TYPES', 'claim_in_raw_car_loaders_types');

/**
 * Уровни сложности
 */
define('DB_CLAIM_IN_RAW_DIFFICULTY', 'claim_in_raw_difficulty');

/**
 * Тарифы ЗП ведомость иностранных граждан
 */
define('DB_CLAIM_IN_RAW_DIFFICULTY_RATES', 'claim_in_raw_difficulty_rates');

/**
 * Грузчики
 */
define('DB_CLAIM_IN_RAW_LOADER', 'claim_in_raw_loader');

/**
 * Кипованный товар
 */
define('DB_CLAIM_IN_RAW_PRODUCT', 'claim_in_raw_product');

/**
 * Переопределение товаров
 */
define('DB_CLAIM_IN_RAW_REDEFINED_PRODUCTS', 'claim_in_raw_redefined_products');

/**
 * Бригады
 */
define('DB_CLAIM_IN_RAW_TEAM', 'claim_in_raw_team');

/**
 * Мусор на выброс
 */
define('DB_CLAIM_IN_RAW_TRASH', 'claim_in_raw_trash');

/**
 * Типы отходов
 */
define('DB_CLAIM_IN_RAW_TRASH_TYPES', 'claim_in_raw_trash_types');

/**
 * Мусор на продажу
 */
define('DB_CLAIM_IN_RAW_WASTE', 'claim_in_raw_waste');

/**
 * Счета по заявке
 */
define('DB_CLAIM_INVOICES', 'claim_invoices');

/**
 * Таблица со связями заявок. нужно для реализации филиала
 */
define('DB_CLAIM_LINKED', 'claim_linked');

/**
 * Таблица со связями ремонта и производства. необходима для реализации филиала
 */
define('DB_CLAIM_LINKED_PRODUCTION', 'claim_linked_production');

/**
 * Таблица с клиентами, которые представляют дочерние проекты в связанных заявках
 */
define('DB_CLAIM_LINKED_SUBSIDIARY_CLIENT', 'claim_linked_subsidiary_client');

/**
 * Заявки которые еще не были открыты нач. склада и диспетчером
 */
define('DB_CLAIM_NEW_FLAGS', 'claim_new_flags');

/**
 * Хранит количество дней по истечению которых наступает просрочка по заявке
 */
define('DB_CLAIM_NOT_CLOSED_CONDITION', 'claim_not_closed_condition');

/**
 * Таблица существующих мнимых тюков
 */
define('DB_CLAIM_OUT_RAW_BALE_IMAGINARY', 'claim_out_raw_bale_imaginary');

/**
 * Платежи по заявке
 */
define('DB_CLAIM_PAYMENT', 'claim_payment');

/**
 * Примечания к заявкам на производство
 */
define('DB_CLAIM_PRODUCTION_ANNOTATION', 'claim_production_annotation');

/**
 * Правила просрочки обращений на обработку БЦ для заявок на производство
 */
define('DB_CLAIM_PRODUCTION_BASE_PRICE_PROCESS_EXPIRATION_RULES', 'claim_production_base_price_process_expiration_rules');

/**
 * Обращения на обработку БЦ для заявок на производство
 */
define('DB_CLAIM_PRODUCTION_BASE_PRICE_PROCESS_REQUESTS', 'claim_production_base_price_process_requests');

/**
 * Таблица для хранения связанных заявок на отгрузку для производств на ПЗО
 */
define('DB_CLAIM_PRODUCTION_CLAIM_RESULT', 'claim_production_claim_result');

/**
 * Таблица с детализацией выгрузок заявок на производство
 */
define('DB_CLAIM_PRODUCTION_EXPORT', 'claim_production_export');

/**
 * Отчет по производству форм.
 */
define('DB_CLAIM_PRODUCTION_FORMS', 'claim_production_forms');

/**
 * Рубрики товара в заявке на производство
 */
define('DB_CLAIM_PRODUCTION_ITEM_RUBRIC', 'claim_production_item_rubric');

/**
 * Таблица распределения заявок на производство по производственным площадкам
 */
define('DB_CLAIM_PRODUCTION_MANUFACTURER', 'claim_production_manufacturer');

/**
 * История изменения даты готовности позиций
 */
define('DB_CLAIM_PRODUCTION_MANUFACTURER_DATE_DONE', 'claim_production_manufacturer_date_done');

/**
 * Список товаров, которые должна произвести площадка для заявки на производство
 */
define('DB_CLAIM_PRODUCTION_MANUFACTURER_ITEM', 'claim_production_manufacturer_item');

/**
 * Содержит связь cpm к сформированным заявкам
 */
define('DB_CLAIM_PRODUCTION_MANUFACTURER_RESULT', 'claim_production_manufacturer_result');

/**
 * Содержит связь cpmr к товарам сформированных заявок
 */
define('DB_CLAIM_PRODUCTION_MANUFACTURER_RESULT_PRODUCTS', 'claim_production_manufacturer_result_products');

/**
 * Значения параметров по заявкам на производство
 */
define('DB_CLAIM_PRODUCTION_PARAM', 'claim_production_param');

/**
 * Файлы, указанные при сохранении параметров заявок на произв.
 */
define('DB_CLAIM_PRODUCTION_PARAM_FILE', 'claim_production_param_file');

/**
 * Типы параметров по заявке по заявке на производство
 */
define('DB_CLAIM_PRODUCTION_PARAM_TYPE', 'claim_production_param_type');

/**
 * Варианты значений для параметров по заявке на производство
 */
define('DB_CLAIM_PRODUCTION_PARAM_TYPE_VALUE', 'claim_production_param_type_value');

/**
 * Производственные площадки (указанные предварительно)
 */
define('DB_CLAIM_PRODUCTION_PREMANUFACTURERS', 'claim_production_premanufacturers');

/**
 * Таблица примечаний к записям отчета "Соответствие цен производства"
 */
define('DB_CLAIM_PRODUCTION_PRICES_EQUALITY_ANNOTATION', 'claim_production_prices_equality_annotation');

/**
 * Таблица примечаний к записям отчета "Соответствие цен производства"
 */
define('DB_CLAIM_PRODUCTION_PRICES_EQUALITY_ARCHIVE', 'claim_production_prices_equality_archive');

/**
 * Товары по заявкам на производство
 */
define('DB_CLAIM_PRODUCTION_PRODUCT', 'claim_production_product');

/**
 * Таблица содержит историю изменения БЦ
 */
define('DB_CLAIM_PRODUCTION_PRODUCT_BASEPRICE_HISTORY', 'claim_production_product_baseprice_history');

/**
 * Значения полей товаров по заявке на производство
 */
define('DB_CLAIM_PRODUCTION_PRODUCT_FIELDS', 'claim_production_product_fields');

/**
 * Запросы на отрисовку для заявок на производство
 */
define('DB_CLAIM_PRODUCTION_RENDER_REQUEST', 'claim_production_render_request');

/**
 * Файлы запросов на отрисовку для заявок на производство
 */
define('DB_CLAIM_PRODUCTION_RENDER_REQUEST_FILE', 'claim_production_render_request_file');

/**
 * Отсрочки аренды по товарам созданным через производство
 */
define('DB_CLAIM_PRODUCTION_RENT_DELAY', 'claim_production_rent_delay');

/**
 * Каталог рубрик для товаров в заявках на производство
 */
define('DB_CLAIM_PRODUCTION_RUBRIC_CATALOG', 'claim_production_rubric_catalog');

/**
 * Параметры соответствий для схожих товаров по заявке
 */
define('DB_CLAIM_PRODUCTION_SIMILARPRODUCTS_PARAM', 'claim_production_similarproducts_param');

/**
 * Шаблоны для вывода блока параметров по заявке на произв.
 */
define('DB_CLAIM_PRODUCTION_TEMPLATE', 'claim_production_template');

/**
 * Привязка типов параметров по заявке на производство к шабл.
 */
define('DB_CLAIM_PRODUCTION_TEMPLATE_PARAM_TYPE', 'claim_production_template_param_type');

/**
 * Привязка шаблонов к типам товаров
 */
define('DB_CLAIM_PRODUCTION_TEMPLATE_PRODUCT_TYPE', 'claim_production_template_product_type');

/**
 * Названия клиентов, указанные вручную
 */
define('DB_CLAIM_PRODUCTION_TEXTCLIENTNAME', 'claim_production_textclientname');

/**
 * Псевдосрочное производство
 */
define('DB_CLAIM_PRODUCTION_URGENT', 'claim_production_urgent');

/**
 * Товары в заявке
 */
define('DB_CLAIM_PRODUCTS', 'claim_products');

/**
 * ToDo добавить комментарий
 */
define('DB_CLAIM_PRODUCTS_DETAILED', 'claim_products_detailed');

/**
 * ToDo добавить комментарий
 */
define('DB_CLAIM_PRODUCTS_EARLY_BOOKING', 'claim_products_early_booking');

/**
 * Дополнительные товары. Для заявки приход
 */
define('DB_CLAIM_PRODUCTS_EXTRA', 'claim_products_extra');

/**
 * Штрафы за невыполнение обещаний по товарам ненадлежащего качества
 */
define('DB_CLAIM_RAW_BAD_QUALITY_PRODUCTS_PENALTY', 'claim_raw_bad_quality_products_penalty');

/**
 * Принятое сырье
 */
define('DB_CLAIM_RAW_RECEPTION', 'claim_raw_reception');

/**
 * Примечания для принятого сырья
 */
define('DB_CLAIM_RAW_RECEPTION_ANNOTATION', 'claim_raw_reception_annotation');

/**
 * Отчеты по принятому сырью
 */
define('DB_CLAIM_RAW_RECEPTION_REPORT', 'claim_raw_reception_report');

/**
 * Настройки максимальный % потерь для сырья
 */
define('DB_CLAIM_RECEIPT_PERCENTOFF', 'claim_receipt_percentoff');

/**
 * Причина обнуления суммы в заявке аренда
 */
define('DB_CLAIM_RENT_EMPTY_SUM', 'claim_rent_empty_sum');

/**
 * ToDo добавить комментарий
 */
define('DB_CLAIM_RENT_ITEMS', 'claim_rent_items');

/**
 * ToDo добавить комментарий
 */
define('DB_CLAIM_RENT_PERIODS', 'claim_rent_periods');

/**
 * ToDo добавить комментарий
 */
define('DB_CLAIM_RENT_TYPES', 'claim_rent_types');

/**
 * Причины повторных обращений для заявок
 */
define('DB_CLAIM_REPEATED_APPEAL_REASONS', 'claim_repeated_appeal_reasons');

/**
 * Повторные обращения для заявок
 */
define('DB_CLAIM_REPEATED_APPEALS', 'claim_repeated_appeals');

/**
 * Резерв товара под заявку
 */
define('DB_CLAIM_RESERVE', 'claim_reserve');

/**
 * Мусор на выброс
 */
define('DB_CLAIM_RETURN_IN_RAW_TRASH', 'claim_return_in_raw_trash');

/**
 * Связь отгруженных и возвращаемых кип
 */
define('DB_CLAIM_RETURN_RAW_BALE', 'claim_return_raw_bale');

/**
 * Служебные записки для игнорирования сверки актов
 */
define('DB_CLAIM_REVISE_FILES', 'claim_revise_files');

/**
 * Этапы заявок
 */
define('DB_CLAIM_STAGES', 'claim_stages');

/**
 * Результаты испытаний
 */
define('DB_CLAIM_TESTING_SAMPLE', 'claim_testing_sample');

/**
 * Протоколы испытаний
 */
define('DB_CLAIM_TESTING_SAMPLE_FILES', 'claim_testing_sample_files');

/**
 * Типы заявок
 */
define('DB_CLAIM_TYPE', 'claim_type');

/**
 * Типы заявок вместе с парными
 */
define('DB_CLAIM_TYPE_PAIR', 'claim_type_pair');

/**
 * Данные для доступа ТС на территорию
 */
define('DB_CLAIM_VEHICLE_ACCESS', 'claim_vehicle_access');

/**
 * Приоритеты доступа ТС
 */
define('DB_CLAIM_VEHICLE_ACCESS_PRIORITIES', 'claim_vehicle_access_priorities');

/**
 * Заявки
 */
define('DB_CLAIMS', 'claims');

/**
 * Запросы на добавление клиента (Примечания)
 */
define('DB_CLIENT_ADD_REQUEST_ANNOTATION', 'client_add_request_annotation');

/**
 * Запросы на добавление клиента (Типы примечаний)
 */
define('DB_CLIENT_ADD_REQUEST_ANNOTATION_TYPES', 'client_add_request_annotation_types');

/**
 * Данные запроса на добавление клиента
 */
define('DB_CLIENT_ADD_REQUEST_DATA', 'client_add_request_data');

/**
 * Отклонения по запросам на добавление клиента
 */
define('DB_CLIENT_ADD_REQUEST_REJECTIONS', 'client_add_request_rejections');

/**
 * Статусы запросов на добавление клиента
 */
define('DB_CLIENT_ADD_REQUEST_STATES', 'client_add_request_states');

/**
 * Запросы на добавление клиента
 */
define('DB_CLIENT_ADD_REQUESTS', 'client_add_requests');

/**
 * Черный список клиентов
 */
define('DB_CLIENT_BLACKLIST', 'client_blacklist');

/**
 * Номера карт клиентов
 */
define('DB_CLIENT_CARDS', 'client_cards');

/**
 * Дополнительные договоры с клиентами
 */
define('DB_CLIENT_CONTRACT_ADDITIONAL', 'client_contract_additional');

/**
 * Файлы доп договоров клиента
 */
define('DB_CLIENT_CONTRACT_ADDITIONAL_FILE', 'client_contract_additional_file');

/**
 * Пролонгации доп договоров
 */
define('DB_CLIENT_CONTRACT_ADDITIONAL_PROLONGATION', 'client_contract_additional_prolongation');

/**
 * Клиентские договора на поставку на торговые площадки
 */
define('DB_CLIENT_CONTRACT_MARKETPLACE', 'client_contract_marketplace');

/**
 * Пролонгации договоров на поставку на торговые площадки
 */
define('DB_CLIENT_CONTRACT_MARKETPLACE_PROLONGATION', 'client_contract_marketplace_prolongation');

/**
 * Клиентские договора на прочие расходы
 */
define('DB_CLIENT_CONTRACT_OTHER', 'client_contract_other');

/**
 * Пролонгации договоров на прочие расходы
 */
define('DB_CLIENT_CONTRACT_OTHER_PROLONGATION', 'client_contract_other_prolongation');

/**
 * Клиентские договора на закупку
 */
define('DB_CLIENT_CONTRACT_PURCHASE', 'client_contract_purchase');

/**
 * Пролонгации договоров на закупку
 */
define('DB_CLIENT_CONTRACT_PURCHASE_PROLONGATION', 'client_contract_purchase_prolongation');

/**
 * Схема проезда (адрес выгрузки)
 */
define('DB_CLIENT_DIRECTIONS', 'client_directions');

/**
 * Экономическая деятельность клиента
 */
define('DB_CLIENT_ECONOMIC_ACTIVITY', 'client_economic_activity');

/**
 * Общероссийский классификатор видов экономической деятельности
 */
define('DB_CLIENT_ECONOMIC_ACTIVITY_KINDS', 'client_economic_activity_kinds');

/**
 * Адреса электронной почты Клиентов
 */
define('DB_CLIENT_EMAIL', 'client_email');

/**
 * Обратная связь клиента
 */
define('DB_CLIENT_FEEDBACK', 'client_feedback');

/**
 * Группы клиентов
 */
define('DB_CLIENT_GROUPS', 'client_groups');

/**
 * Таблица с записями об увиденных пользователем перехватах клиентов
 */
define('DB_CLIENT_INTERCEPTION', 'client_interception');

/**
 * письма с почтового сервера, которые показывают перехват клиента
 */
define('DB_CLIENT_INTERCEPTION_EMAIL', 'client_interception_email');

/**
 * перехват клиентов по email: связь клиентов и писем с почтового сервера
 */
define('DB_CLIENT_INTERCEPTION_EMAIL_CLIENT', 'client_interception_email_client');

/**
 * перехват клиентов по email: клиентские почты
 */
define('DB_CLIENT_INTERCEPTION_EMAIL_CLIENT_EMAIL', 'client_interception_email_client_email');

/**
 * перехват клиентов по email: связь пользователей и писем с почтового сервера
 */
define('DB_CLIENT_INTERCEPTION_EMAIL_USER', 'client_interception_email_user');

/**
 * перехват клиентов по email: пользовательские отметки ознакомился
 */
define('DB_CLIENT_INTERCEPTION_EMAIL_USER_VIEW', 'client_interception_email_user_view');

/**
 * перехват клиентов: правила исключения звонков из перехватов
 */
define('DB_CLIENT_INTERCEPTION_EXCEPTION_RULE', 'client_interception_exception_rule');

/**
 * Возможные перехваты клиентов с других проектов
 */
define('DB_CLIENT_INTERCEPTION_OTHER_PROJECT', 'client_interception_other_project');

/**
 * клиенты: данные из контур фокуса
 */
define('DB_CLIENT_KONTUR_FOCUS_DATA', 'client_kontur_focus_data');

/**
 * Хранит КПП клиентов
 */
define('DB_CLIENT_KPP', 'client_kpp');

/**
 * Договоры аренды
 */
define('DB_CLIENT_LEASE', 'client_lease');

/**
 * Файлы пролонгации договоров аренды
 */
define('DB_CLIENT_LEASE_PROLONGATION', 'client_lease_prolongation');

/**
 * Юридический статус клиента
 */
define('DB_CLIENT_LEGAL_STATUSES', 'client_legal_statuses');

/**
 * Листы согласования
 */
define('DB_CLIENT_LIST_AGREEMENT', 'client_list_agreement');

/**
 * результаты проверки клиента в листах согласования
 */
define('DB_CLIENT_LIST_AGREEMENT_CLIENT_CHECK', 'client_list_agreement_client_check');

/**
 * ToDo добавить комментарий
 */
define('DB_CLIENT_LIST_AGREEMENT_ENTITY_RENT', 'client_list_agreement_entity_rent');

/**
 * ToDo добавить комментарий
 */
define('DB_CLIENT_LIST_AGREEMENT_ENTITY_SALE', 'client_list_agreement_entity_sale');

/**
 * Файлы листов согласования
 */
define('DB_CLIENT_LIST_AGREEMENT_FILES', 'client_list_agreement_files');

/**
 * Файлы для гос договоров
 */
define('DB_CLIENT_LIST_AGREEMENT_GCFILES', 'client_list_agreement_gcfiles');

/**
 * ToDo добавить комментарий
 */
define('DB_CLIENT_LIST_AGREEMENT_MPFILES', 'client_list_agreement_mpfiles');

/**
 * Переговоры по отсрочке
 */
define('DB_CLIENT_LIST_AGREEMENT_NEGOTIATION', 'client_list_agreement_negotiation');

/**
 * Статусы листов согласования
 */
define('DB_CLIENT_LIST_AGREEMENT_STATUS', 'client_list_agreement_status');

/**
 * Последовательности статусов
 */
define('DB_CLIENT_LIST_AGREEMENT_STATUS_CHAIN', 'client_list_agreement_status_chain');

/**
 * Типы листов согласования
 */
define('DB_CLIENT_LIST_AGREEMENT_TYPES', 'client_list_agreement_types');

/**
 * Листы согласования проверки контрагентов
 */
define('DB_CLIENT_LIST_LAWYER_VERIFICATIONS', 'client_list_lawyer_verifications');

/**
 * ToDo добавить комментарий
 */
define('DB_CLIENT_MARKS', 'client_marks');

/**
 * Официальные статусы клиента из ЕГРЮЛ или ЕГРИП
 */
define('DB_CLIENT_OFFICIAL_STATES', 'client_official_states');

/**
 * Персональные данные клиента
 */
define('DB_CLIENT_PERSONAL_DATA', 'client_personal_data');

/**
 * Номера телефонов, факсов клиентов
 */
define('DB_CLIENT_PHONE', 'client_phone');

/**
 * Адреса сайтов Клиентов
 */
define('DB_CLIENT_SITE', 'client_site');

/**
 * Статистика просмотра информации по клиентам
 */
define('DB_CLIENT_STATISTICS', 'client_statistics');

/**
 * Список действий
 */
define('DB_CLIENT_STATISTICS_ACTIONS', 'client_statistics_actions');

/**
 * Статистика пояснительных записок и отсрочек на оплату по клиенту
 */
define('DB_CLIENT_STATISTICS_CONTRACTS', 'client_statistics_contracts');

/**
 * Параметры поиска в модуле Клиенты
 */
define('DB_CLIENT_STATISTICS_DATA', 'client_statistics_data');

/**
 * Кол-во действий пользователя за период
 */
define('DB_CLIENT_STATISTICS_USER_ACTIONS_COUNT', 'client_statistics_user_actions_count');

/**
 * Превышение пользователями среднего кол-ва действий за день
 */
define('DB_CLIENT_STATISTICS_USER_ACTIONS_EXCESS', 'client_statistics_user_actions_excess');

/**
 * Тарифы для транзакций "Возвратные деньги"
 */
define('DB_CLIENT_TARIFFS_RETURN', 'client_tariffs_return');

/**
 * История тарифов для транзакций "Возвратные деньги"
 */
define('DB_CLIENT_TARIFFS_RETURN_HISTORY', 'client_tariffs_return_history');

/**
 * Спец. тарифы для транзакций "Возвратные деньги"
 */
define('DB_CLIENT_TARIFFS_RETURN_SPECIAL', 'client_tariffs_return_special');

/**
 * История спец. тарифы для транзакций "Возвратные деньги"
 */
define('DB_CLIENT_TARIFFS_RETURN_SPECIAL_HISTORY', 'client_tariffs_return_special_history');

/**
 * ToDo добавить комментарий
 */
define('DB_CLIENT_TOUGH_CLIENT_CLAIMS', 'client_tough_client_claims');

/**
 * Запросы проверки возможности перевода клиента пользователями
 */
define('DB_CLIENT_TRANSFER_CHECK_REQUEST', 'client_transfer_check_request');

/**
 * Договора клиента
 */
define('DB_CLIENT_TREATY', 'client_treaty');

/**
 * Файлы пролонгации договоров
 */
define('DB_CLIENT_TREATY_PROLONGATION', 'client_treaty_prolongation');

/**
 * Типы клиентов
 */
define('DB_CLIENT_TYPES', 'client_types');

/**
 * Клиенты, не проходившие проверку ОСВ - Архивные
 */
define('DB_CLIENT_WITHOUT_REVISE_ARCHIVE', 'client_without_revise_archive');

/**
 * Клиенты
 */
define('DB_CLIENTS', 'clients');

/**
 * История распределения клиентов среди менеджеров
 */
define('DB_CLIENTS_ASSIGMENT_HISTORY', 'clients_assigment_history');

/**
 * Клиенты менеджеров
 */
define('DB_CLIENTS_MANAGERS', 'clients_managers');

/**
 * Клиенты-производственные площадки
 */
define('DB_CLIENTS_MANUFACTURERS', 'clients_manufacturers');

/**
 * результаты проверки клиентов на проблемы
 */
define('DB_CLIENTS_PROBLEMS_CHECK_RESULTS', 'clients_problems_check_results');

/**
 * типы флагов при проверке клиента на наличие проблем
 */
define('DB_CLIENTS_PROBLEMS_CHECK_STATEMENT_TYPES', 'clients_problems_check_statement_types');

/**
 * типы решений по клиенту с проблемами
 */
define('DB_CLIENTS_PROBLEMS_DECISION_TYPES', 'clients_problems_decision_types');

/**
 * лог принятых по клиентам с проблемами решений
 */
define('DB_CLIENTS_PROBLEMS_DECISIONS_LOG', 'clients_problems_decisions_log');

/**
 * Клиенты из свободного доступа от которых отказались менеджеры
 */
define('DB_CLIENTS_REFUSED', 'clients_refused');

/**
 * Таблица со значениями максимальных цен транспортировки 1 кг товаров
 */
define('DB_CLIENTS_TRANSPORT_MAX_PRICE', 'clients_transport_max_price');

/**
 * Данные менеджера адресов
 */
define('DB_CLIENTS_UNLOAD_ADDRESSES', 'clients_unload_addresses');

/**
 * Таблица хранит номера телефонов адресов выгрузки
 */
define('DB_CLIENTS_UNLOAD_ADDRESSES_PHONES', 'clients_unload_addresses_phones');

/**
 * Специализация сотрудников по товарам (field1)
 */
define('DB_COMPANY_STAFF_SPECIALIZATIONS', 'company_staff_specializations');

/**
 * Список статусов сотрудников в работе
 */
define('DB_COMPANY_STAFF_STATUSES', 'company_staff_statuses');

/**
 * Конфиг периодов действия ндс его размера
 */
define('DB_CONFIG_NDS', 'config_nds');

/**
 * Записи о договорах об услугах для клиентов
 */
define('DB_CONTRACT_OF_SERVICE', 'contract_of_service');

/**
 * Связь договоров об услугах и заявок на аренду
 */
define('DB_CONTRACT_OF_SERVICE_CLAIM', 'contract_of_service_claim');

/**
 * Список товаров для выписанных счетов
 */
define('DB_CONTRACT_PRODUCTS', 'contract_products');

/**
 * Доп информация по договорам на аренду транспортного средства
 */
define('DB_CONTRACT_TRANSPORT_RENT', 'contract_transport_rent');

/**
 * ToDo добавить комментарий
 */
define('DB_CONTRACT_TYPES', 'contract_types');

/**
 * Договоры
 */
define('DB_CONTRACTS', 'contracts');

/**
 * Контроль задолжностей
 */
define('DB_CONTROL_OF_DEBTS', 'control_of_debts');

/**
 * История изменения примечаний в просроченных платежах
 */
define('DB_CONTROL_OF_DEBTS_ANNOTATION_HISTORY', 'control_of_debts_annotation_history');

/**
 * Контроль задолжностей исключения
 */
define('DB_CONTROL_OF_DEBTS_DEFERMENT', 'control_of_debts_deferment');

/**
 * Комментарии для контроля наличия документов
 */
define('DB_CONTROL_OF_DEBTS_DOCUMENT_ANNOTATION', 'control_of_debts_document_annotation');

/**
 * Список корпоративных почт
 */
define('DB_CORP_EMAIL', 'corp_email');

/**
 * Алиасы для корпоративной почты
 */
define('DB_CORP_EMAIL_ALIAS', 'corp_email_alias');

/**
 * Кол-во просмотренных пользователем паролей корп почт за день
 */
define('DB_CORP_EMAIL_PASSWORD_VIEW_COUNTER', 'corp_email_password_view_counter');

/**
 * Корпоративные телефоны
 */
define('DB_CORP_PHONE', 'corp_phone');

/**
 * Лицевые счета корп телефонов компании
 */
define('DB_CORP_PHONE_ACCOUNT', 'corp_phone_account');

/**
 * События связанные с корп телефонами
 */
define('DB_CORP_PHONE_EVENT', 'corp_phone_event');

/**
 * Тарифы корпоративных телефонов
 */
define('DB_CORP_PHONE_TARIFF', 'corp_phone_tariff');

/**
 * ID стран клиентов
 */
define('DB_COUNTRY', 'country');

/**
 * ToDo добавить комментарий
 */
define('DB_CRON_LIST', 'cron_list');

/**
 * ToDo добавить комментарий
 */
define('DB_CRON_LIST_PROJECTS', 'cron_list_projects');

/**
 * ToDo добавить комментарий
 */
define('DB_CRON_SERVICE', 'cron_service');

/**
 * Типы валют
 */
define('DB_CURRENCY', 'currency');

/**
 * ToDo добавить комментарий
 */
define('DB_CURRENCY_RATES', 'currency_rates');

/**
 * Хэши пользователя для входа пользователя в систему по хэшу
 */
define('DB_D_HASHES', 'd_hashes');

/**
 * Запись временных периодов для каждого пользователя
 */
define('DB_DATE_PERIOD', 'date_period');

/**
 * Товары для формы ЗП за сделку
 */
define('DB_DEAL_WAGE_ITEM', 'deal_wage_item');

/**
 * Распределение товара по исполнителям для формы ЗП за сделку
 */
define('DB_DEAL_WAGE_ITEM_DISTRIBUTION', 'deal_wage_item_distribution');

/**
 * Связь между штрафами/премиями и товарами из формы зп за сделку
 */
define('DB_DEAL_WAGE_SALARY_BONUS', 'deal_wage_salary_bonus');

/**
 * Рассчитанные оклады для отображения записей в отчёте "ЗП за сделку"
 */
define('DB_DEAL_WAGE_USER_WAGE_CALCULATED', 'deal_wage_user_wage_calculated');

/**
 * ToDo добавить комментарий
 */
define('DB_DECLARATION', 'declaration');

/**
 * Файлы, прикреплённые к объявлениям
 */
define('DB_DECLARATION_FILE', 'declaration_file');

/**
 * Список объектов получателей
 */
define('DB_DECLARATION_MAIL_LIST', 'declaration_mail_list');

/**
 * Список шаблонов рассылок объявлений
 */
define('DB_DECLARATION_MAIL_TEMPLATE', 'declaration_mail_template');

/**
 * ToDo добавить комментарий
 */
define('DB_DECLARATION_USER', 'declaration_user');

/**
 * ToDo добавить комментарий
 */
define('DB_DEPOT_1', 'depot_1');

/**
 * ToDo добавить комментарий
 */
define('DB_DEPOT_1_FIELDS', 'depot_1_fields');

/**
 * Склад
 */
define('DB_DEPOT_2', 'depot_2');

/**
 * Дополнительные поля - характеристики товара
 */
define('DB_DEPOT_2_DATA', 'depot_2_data');

/**
 * Значения полей для таблицы склада
 */
define('DB_DEPOT_2_FIELDS', 'depot_2_fields');

/**
 * Описание значений полей таблицы
 */
define('DB_DEPOT_2_FIELDS_CONFIG', 'depot_2_fields_config');

/**
 * Рассчитанные значения для ед. шт. товара
 */
define('DB_DEPOT_2_ITEM_WEIGHT', 'depot_2_item_weight');

/**
 * Фотографии товаров
 */
define('DB_DEPOT_2_PRODUCT_PHOTO', 'depot_2_product_photo');

/**
 * Список актов приема-передачи склада
 */
define('DB_DEPOT_ACCEPTANCE_REPORT', 'depot_acceptance_report');

/**
 * Дополнительные расходы по товару, за 1 amount
 */
define('DB_DEPOT_ADDITIONAL_EXPENSES', 'depot_additional_expenses');

/**
 * Контроль закупочных цен
 */
define('DB_DEPOT_CONTROL', 'depot_control');

/**
 * Архив несоответствия закупочных цен
 */
define('DB_DEPOT_CONTROL_ARCHIVE', 'depot_control_archive');

/**
 * Детализация приходов на склад
 */
define('DB_DEPOT_DETAILED', 'depot_detailed');

/**
 * Таблица, содержащая данные о блокировке товара, находящегося в секции (по `dd_id`), под конкретного пользователя
 */
define('DB_DEPOT_DETAILED_MANAGER', 'depot_detailed_manager');

/**
 * Таблица, содержащая блокировки depot_detailed_manager-записи
 */
define('DB_DEPOT_DETAILED_MANAGER_BLOCK', 'depot_detailed_manager_block');

/**
 * Детализация склада, веса по отгрузкам для роликов
 */
define('DB_DEPOT_DETAILED_OUT', 'depot_detailed_out');

/**
 * Детализация склада, веса по отгрузкам для роликов. Детализирует информацию для основой таблицы depot_detailed_out
 */
define('DB_DEPOT_DETAILED_OUT_DETAILED', 'depot_detailed_out_detailed');

/**
 * Фотографии по товарам
 */
define('DB_DEPOT_DETAILED_PHOTO', 'depot_detailed_photo');

/**
 * Детализация склада для заявки на ремонт
 */
define('DB_DEPOT_DETAILED_REPAIR', 'depot_detailed_repair');

/**
 * Таблица связи при возврате сырь между детализацией склада и складом пер-ка
 */
define('DB_DEPOT_DETAILED_RETURN', 'depot_detailed_return');

/**
 * Детализация перемещений
 */
define('DB_DEPOT_DETAILED_TRANSFER', 'depot_detailed_transfer');

/**
 * Детализация созданного оборудования
 */
define('DB_DEPOT_EQUIPMENT', 'depot_equipment');

/**
 * Группы мин. кол-ва
 */
define('DB_DEPOT_GROUP_MIN_AMOUNT', 'depot_group_min_amount');

/**
 * Товары подготовленные для проекта уин
 */
define('DB_DEPOT_INVENTORY', 'depot_inventory');

/**
 * Связь приходов инвентарных номеров и заявок-списаний
 */
define('DB_DEPOT_INVENTORY_CLAIMS', 'depot_inventory_claims');

/**
 * Номенклатурные позиции
 */
define('DB_DEPOT_INVENTORY_NUMBERS', 'depot_inventory_numbers');

/**
 * Список складов
 */
define('DB_DEPOT_LIST', 'depot_list');

/**
 * Условные склады AMD-121
 */
define('DB_DEPOT_LIST_NOMINAL', 'depot_list_nominal');

/**
 * Связь наших товаров depot_2 и товаров с торговых площадок
 */
define('DB_DEPOT_MARKETPLACE', 'depot_marketplace');

/**
 * Минимальное кол-во товара
 */
define('DB_DEPOT_PRODUCT_MIN_AMOUNT', 'depot_product_min_amount');

/**
 * Таблица красного склада (Выполнить до)
 */
define('DB_DEPOT_REJECT', 'depot_reject');

/**
 * Аренда склада, файлы плательщика (доказательства).
 */
define('DB_DEPOT_RENT_PAYER_FILES', 'depot_rent_payer_files');

/**
 * Активные записи в аренде склада
 */
define('DB_DEPOT_RENT_PENALTY', 'depot_rent_penalty');

/**
 * Файлы для отсрочки активной аренды склада
 */
define('DB_DEPOT_RENT_PENALTY_FILES', 'depot_rent_penalty_files');

/**
 * Неоплаченная аренда склада
 */
define('DB_DEPOT_RENT_PENALTY_UNPAID', 'depot_rent_penalty_unpaid');

/**
 * Связь товара с пользователем, кастомная граммовка
 */
define('DB_DEPOT_RENT_PRODUCT_DATA', 'depot_rent_product_data');

/**
 * Виртуальный склад
 */
define('DB_DEPOT_VIRTUAL', 'depot_virtual');

/**
 * Поля виртуального склада
 */
define('DB_DEPOT_VIRTUAL_FIELDS', 'depot_virtual_fields');

/**
 * Файлы виртуального склада
 */
define('DB_DEPOT_VIRTUAL_FILES', 'depot_virtual_files');

/**
 * Переписка по задаче
 */
define('DB_DEPOT_VIRTUAL_TASK_MESSAGES', 'depot_virtual_task_messages');

/**
 * Учет просмотра сообщений
 */
define('DB_DEPOT_VIRTUAL_TASK_MESSAGES_VIEWS', 'depot_virtual_task_messages_views');

/**
 * Стоимость выполнения задания
 */
define('DB_DEPOT_VIRTUAL_TASK_PRICES', 'depot_virtual_task_prices');

/**
 * Задачи по виртуальному складу
 */
define('DB_DEPOT_VIRTUAL_TASKS', 'depot_virtual_tasks');

/**
 * ToDo добавить комментарий
 */
define('DB_DEPOT_WAREHOUSE', 'depot_warehouse');

/**
 * ToDo добавить комментарий
 */
define('DB_DEPOT_WAREHOUSE_SECTIONS', 'depot_warehouse_sections');

/**
 * Названия складов
 */
define('DB_DEPOTS', 'depots');

/**
 * Склад клиента (пер-ка)
 */
define('DB_DETAILED_CLIENTS', 'detailed_clients');

/**
 * Данные по складам торговых площадок
 */
define('DB_DETAILED_CLIENTS_MARKETPLACE', 'detailed_clients_marketplace');

/**
 * Споры по поставкам на торговые площадки
 */
define('DB_DETAILED_CLIENTS_MARKETPLACE_DISPUTES', 'detailed_clients_marketplace_disputes');

/**
 * История изменения споров
 */
define('DB_DETAILED_CLIENTS_MARKETPLACE_DISPUTES_HISTORY', 'detailed_clients_marketplace_disputes_history');

/**
 * Возвраты с торговых площадок, дополнительные данные
 */
define('DB_DETAILED_CLIENTS_MARKETPLACE_RETURN', 'detailed_clients_marketplace_return');

/**
 * Овердрафты для склада клиента переработчика
 */
define('DB_DETAILED_CLIENTS_OVERDRAFT', 'detailed_clients_overdraft');

/**
 * Цепочки овердрафтов
 */
define('DB_DETAILED_CLIENTS_OVERDRAFT_CHAINS', 'detailed_clients_overdraft_chains');

/**
 * Параметры изменений заявки при ручном каскаде
 */
define('DB_DETAILED_HISTORY', 'detailed_history');

/**
 * Списание сырья по заявкам на переработку
 */
define('DB_DISCARD_CONVERSIONS', 'discard_conversions');

/**
 * Хранит статьи документации по проекту
 */
define('DB_DOCUMENTATION', 'documentation');

/**
 * Дополнительные права на редактирование отдельных разделов или статей
 */
define('DB_DOCUMENTATION_HELP_ACCESS', 'documentation_help_access');

/**
 * Контент страниц справки
 */
define('DB_DOCUMENTATION_HELP_CONTENT', 'documentation_help_content');

/**
 * Грубая статистика редактирования справки
 */
define('DB_DOCUMENTATION_HELP_STATISTICS', 'documentation_help_statistics');

/**
 * Дерево разделов справки
 */
define('DB_DOCUMENTATION_HELP_TREE', 'documentation_help_tree');

/**
 * Хранит связи статей с листьями дерева прав
 */
define('DB_DOCUMENTATION_REFERENCES', 'documentation_references');

/**
 * Документооборот/Документы
 */
define('DB_DOCUMENTS_SHEET', 'documents_sheet');

/**
 * Договоры
 */
define('DB_DOCUMENTS_SHEET_CLIENT_TREATY', 'documents_sheet_client_treaty');

/**
 * Тип документа для модуля Контроль документов
 */
define('DB_DOCUMENTS_TYPES', 'documents_types');

/**
 * Доверенность для водителя
 */
define('DB_DRIVER_PROCURATION', 'driver_procuration');

/**
 * Водители
 */
define('DB_DRIVERS', 'drivers');

/**
 * Водители Диспетчеров
 */
define('DB_DRIVERS_USERS', 'drivers_users');

/**
 * ToDo добавить комментарий
 */
define('DB_EARLY_BOOKING_DETAILED_DATA', 'early_booking_detailed_data');

/**
 * ToDo добавить комментарий
 */
define('DB_EARLY_BOOKING_FILES', 'early_booking_files');

/**
 * ToDo добавить комментарий
 */
define('DB_EARLY_BOOKING_MANAGER_ALERT', 'early_booking_manager_alert');

/**
 * EDNA: Учетные записи
 */
define('DB_EDNA_ACCOUNT', 'edna_account');

/**
 * EDNA: Возможные статусы учетных записей
 */
define('DB_EDNA_ACCOUNT_STATE', 'edna_account_state');

/**
 * EDNA: Каскады
 */
define('DB_EDNA_CASCADE', 'edna_cascade');

/**
 * EDNA: Этапы каскадов
 */
define('DB_EDNA_CASCADE_STAGE', 'edna_cascade_stage');

/**
 * EDNA: Статусы каскадов
 */
define('DB_EDNA_CASCADE_STATUS', 'edna_cascade_status');

/**
 * EDNA: Каналы
 */
define('DB_EDNA_CHANNEL', 'edna_channel');

/**
 * EDNA: Статус регистрации канала
 */
define('DB_EDNA_CHANNEL_REGISTRATION_STATUS', 'edna_channel_registration_status');

/**
 * EDNA: Типы каналов
 */
define('DB_EDNA_CHANNEL_TYPE', 'edna_channel_type');

/**
 * EDNA: Тип идентификатора клиента
 */
define('DB_EDNA_IDENTIFIER_TYPE', 'edna_identifier_type');

/**
 * EDNA: Сообщения
 */
define('DB_EDNA_MESSAGE', 'edna_message');

/**
 * EDNA: Вложение сообщения, связь 1 к 1
 */
define('DB_EDNA_MESSAGE_ATTACHMENT', 'edna_message_attachment');

/**
 * EDNA: Файлы вложений
 */
define('DB_EDNA_MESSAGE_ATTACHMENT_FILE', 'edna_message_attachment_file');

/**
 * EDNA: Тип содержимого сообщения
 */
define('DB_EDNA_MESSAGE_CONTENT_TYPE', 'edna_message_content_type');

/**
 * EDNA: Статус отправки сообщения
 */
define('DB_EDNA_MESSAGE_STATUS', 'edna_message_status');

/**
 * EDNA: Шаблоны
 */
define('DB_EDNA_TEMPLATE', 'edna_template');

/**
 * EDNA: Статус шаблона
 */
define('DB_EDNA_TEMPLATE_STATUS', 'edna_template_status');

/**
 * EDNA: пользователи
 */
define('DB_EDNA_USER', 'edna_user');

/**
 * Типы агрегации данных
 */
define('DB_EQUIPMENT_CATALOG_AGGREGATION_TYPE', 'equipment_catalog_aggregation_type');

/**
 * Типы данных
 */
define('DB_EQUIPMENT_CATALOG_DATA_TYPE', 'equipment_catalog_data_type');

/**
 * Номенклатурная позиция
 */
define('DB_EQUIPMENT_CATALOG_ENTRY', 'equipment_catalog_entry');

/**
 * Документация к номенклатурной позиции
 */
define('DB_EQUIPMENT_CATALOG_ENTRY_DOCUMENTATION', 'equipment_catalog_entry_documentation');

/**
 * Значения параметров для номенклатурной позиции
 */
define('DB_EQUIPMENT_CATALOG_ENTRY_PROPERTY_VALUE', 'equipment_catalog_entry_property_value');

/**
 * Запчасти и расходные материалы
 */
define('DB_EQUIPMENT_CATALOG_ENTRY_RELATED_PRODUCT', 'equipment_catalog_entry_related_product');

/**
 * Значения требований для номенклатурной позиции
 */
define('DB_EQUIPMENT_CATALOG_ENTRY_REQUIREMENT_VALUE', 'equipment_catalog_entry_requirement_value');

/**
 * Ссылки номенклатурной позиции
 */
define('DB_EQUIPMENT_CATALOG_ENTRY_URL', 'equipment_catalog_entry_url');

/**
 * Ссылки на видео номенклатурной позиции
 */
define('DB_EQUIPMENT_CATALOG_ENTRY_VIDEO_URL', 'equipment_catalog_entry_video_url');

/**
 * Единицы измерения
 */
define('DB_EQUIPMENT_CATALOG_MEASURE_UNIT', 'equipment_catalog_measure_unit');

/**
 * Параметры оборудования
 */
define('DB_EQUIPMENT_CATALOG_PROPERTY', 'equipment_catalog_property');

/**
 * Разделы с параметрами оборудования
 */
define('DB_EQUIPMENT_CATALOG_SECTION', 'equipment_catalog_section');

/**
 * Шаблоны с параметрами оборудования
 */
define('DB_EQUIPMENT_CATALOG_TEMPLATE', 'equipment_catalog_template');

/**
 * Условия для связи шаблона с товарами склада
 */
define('DB_EQUIPMENT_CATALOG_TEMPLATE_PRODUCT_BIND', 'equipment_catalog_template_product_bind');

/**
 * Каталог условий для построения условий
 */
define('DB_EQUIPMENT_CATALOG_TEMPLATE_PRODUCT_BIND_CONDITIONS', 'equipment_catalog_template_product_bind_conditions');

/**
 * Типы условий для связи с товарами склада
 */
define('DB_EQUIPMENT_CATALOG_TEMPLATE_PRODUCT_BIND_TYPES', 'equipment_catalog_template_product_bind_types');

/**
 * Сопутствующие товары
 */
define('DB_EQUIPMENT_CATALOG_TEMPLATE_RELATED_PRODUCT', 'equipment_catalog_template_related_product');

/**
 * Требования к эксплуатации
 */
define('DB_EQUIPMENT_CATALOG_TEMPLATE_REQUIREMENT', 'equipment_catalog_template_requirement');

/**
 * Разделы шаблона
 */
define('DB_EQUIPMENT_CATALOG_TEMPLATE_SECTION', 'equipment_catalog_template_section');

/**
 * Параметры в разделах шаблона
 */
define('DB_EQUIPMENT_CATALOG_TEMPLATE_SECTION_PROPERTY', 'equipment_catalog_template_section_property');

/**
 * Хранит названия товаров которые являются оборудованием
 */
define('DB_EQUIPMENT_TITLE_BIND', 'equipment_title_bind');

/**
 * Хранит номер последней ошибки
 */
define('DB_ERROR_NUMBER', 'error_number');

/**
 * Шаблоны товаров для пре-ки
 */
define('DB_ERROR_SQL', 'error_sql');

/**
 * Доп контактные телефоны для звонка с комментариями
 */
define('DB_EXT_ATS_CALL_ADDITIONAL_PHONE', 'ext_ats_call_additional_phone');

/**
 * Данные по звонку, которые пришли от мегафона
 */
define('DB_EXT_ATS_CALL_HISTORY', 'ext_ats_call_history');

/**
 * Примечание к уведомлению о звонке
 */
define('DB_EXT_ATS_CALL_NOTE', 'ext_ats_call_note');

/**
 * Настройки для переброса звонков пользователя
 */
define('DB_EXT_ATS_CALL_SENDING_SETTING', 'ext_ats_call_sending_setting');

/**
 * атс: транскрибация звонков
 */
define('DB_EXT_ATS_CALL_TRANSCRIPTION', 'ext_ats_call_transcription');

/**
 * Очередь звонков для переброса на проекты
 */
define('DB_EXT_ATS_CALL_TRANSFER_QUERY', 'ext_ats_call_transfer_query');

/**
 * Телефоны клиентов со всех проектов
 */
define('DB_EXT_ATS_CLIENT_PHONE', 'ext_ats_client_phone');

/**
 * Наши корп телефоны
 */
define('DB_EXT_ATS_CORP_PHONE', 'ext_ats_corp_phone');

/**
 * Таблица с телефонами, звонки на которые должны считаться личными
 */
define('DB_EXT_ATS_PERSONAL_PHONE', 'ext_ats_personal_phone');

/**
 * Телефоны клиентов, звонки с/на которые не нужно перебрасывать на проекты
 */
define('DB_EXT_ATS_PHONE_EXCEPTION', 'ext_ats_phone_exception');

/**
 * Записи об отправлениях меток о возможных перехватах клиентов на проекты
 */
define('DB_EXT_ATS_POSSIBLE_CLIENT_INTERCEPTION', 'ext_ats_possible_client_interception');

/**
 * Роли чьи звонки должны перебрасываться на обычные проекты
 */
define('DB_EXT_ATS_ROLE_TRANSFER', 'ext_ats_role_transfer');

/**
 * Телефоны пользователей для атс
 */
define('DB_EXT_ATS_USER_PHONE', 'ext_ats_user_phone');

/**
 * Пользователи чьи звонки должны перебрасываться на обычные проекты
 */
define('DB_EXT_ATS_USER_TRANSFER', 'ext_ats_user_transfer');

/**
 * Инвентарные номера с проектов
 */
define('DB_EXT_INVENTORY_ACCOUNTING', 'ext_inventory_accounting');

/**
 * Группы инвентарных позиций
 */
define('DB_EXT_INVENTORY_ACCOUNTING_GROUP', 'ext_inventory_accounting_group');

/**
 * Таблица с историей изменения инвентарных номеров
 */
define('DB_EXT_INVENTORY_ASSIGMENT_HISTORY', 'ext_inventory_assigment_history');

/**
 * Записи о перебросах инвентарных номеров с проекта на проект
 */
define('DB_EXT_INVENTORY_CHANGE_PROJECT', 'ext_inventory_change_project');

/**
 * Записи о перебрасываемых с проекта на проект инвентарных номерах
 */
define('DB_EXT_INVENTORY_CHANGE_PROJECT_CONTENT', 'ext_inventory_change_project_content');

/**
 * Склад
 */
define('DB_EXT_INVENTORY_DEPOT_2', 'ext_inventory_depot_2');

/**
 * Значения полей для таблицы склада
 */
define('DB_EXT_INVENTORY_DEPOT_2_FIELDS', 'ext_inventory_depot_2_fields');

/**
 * Приходы записей для уин
 */
define('DB_EXT_INVENTORY_DEPOT_DETAILED', 'ext_inventory_depot_detailed');

/**
 * таблица связи складов проектов
 */
define('DB_EXT_INVENTORY_DEPOT_LIST', 'ext_inventory_depot_list');

/**
 * Таблица с отделами проектов
 */
define('DB_EXT_INVENTORY_ORGSTRUCTURE', 'ext_inventory_orgstructure');

/**
 * Таблица с пользователями с других проектов
 */
define('DB_EXT_INVENTORY_USER', 'ext_inventory_user');

/**
 * Файлы доверенного лица для ВМИГ
 */
define('DB_EXT_STAFF_AGENT_FILES', 'ext_staff_agent_files');

/**
 * Типы файлов доверенного лица для ВМИГ
 */
define('DB_EXT_STAFF_AGENT_FILES_TYPES', 'ext_staff_agent_files_types');

/**
 * Доверенность
 */
define('DB_EXT_STAFF_AGENT_PROCURATIONS', 'ext_staff_agent_procurations');

/**
 * Файлы доверенностей
 */
define('DB_EXT_STAFF_AGENT_PROCURATIONS_FILES', 'ext_staff_agent_procurations_files');

/**
 * Представители на которых может быть оформлена доверенность
 */
define('DB_EXT_STAFF_AGENTS', 'ext_staff_agents');

/**
 * Примечания к иностранным гражданам
 */
define('DB_EXT_STAFF_ANNOTATIONS', 'ext_staff_annotations');

/**
 * Комментарий по иностранным гражданам
 */
define('DB_EXT_STAFF_COMMENT', 'ext_staff_comment');

/**
 * Договоры с иностранными гражданами
 */
define('DB_EXT_STAFF_CONTRACTS', 'ext_staff_contracts');

/**
 * Документы иностранных граждан
 */
define('DB_EXT_STAFF_FILES', 'ext_staff_files');

/**
 * Типы файлов иностранных граждан
 */
define('DB_EXT_STAFF_FILES_TYPES', 'ext_staff_files_types');

/**
 * Карта иностранного гражданина
 */
define('DB_EXT_STAFF_FOREIGN_CITIZEN_CARD', 'ext_staff_foreign_citizen_card');

/**
 * Патенты, РВП, ВНЖ иностранных граждан
 */
define('DB_EXT_STAFF_LEGAL_DOCUMENTS', 'ext_staff_legal_documents');

/**
 * Возможные правовые статусы иностранного гражданина
 */
define('DB_EXT_STAFF_LEGAL_STATUSES', 'ext_staff_legal_statuses');

/**
 * Миграционные карты иностранных граждан
 */
define('DB_EXT_STAFF_MIGRATION_CARDS', 'ext_staff_migration_cards');

/**
 * Паспорта иностранных граждан
 */
define('DB_EXT_STAFF_PASSPORTS', 'ext_staff_passports');

/**
 * Оплата патента
 */
define('DB_EXT_STAFF_PATENT_PAYMENTS', 'ext_staff_patent_payments');

/**
 * Файлы проектов для ВМИГ
 */
define('DB_EXT_STAFF_PROJECT_FILES', 'ext_staff_project_files');

/**
 * Типы файлов проекта для ВМИГ
 */
define('DB_EXT_STAFF_PROJECT_FILES_TYPES', 'ext_staff_project_files_types');

/**
 * Регистрации иностранных граждан
 */
define('DB_EXT_STAFF_REGISTRATIONS', 'ext_staff_registrations');

/**
 * ToDo добавить комментарий
 */
define('DB_EXT_STAFF_SALARY_CARDS', 'ext_staff_salary_cards');

/**
 * Статусы иностранных граждан
 */
define('DB_EXT_STAFF_STATES', 'ext_staff_states');

/**
 * Сотрудники иностранные граждане
 */
define('DB_EXT_STAFF_USERS', 'ext_staff_users');

/**
 * Привязка иностранных граждан к проектам
 */
define('DB_EXT_STAFF_USERS_PROJECTS', 'ext_staff_users_projects');

/**
 * Адреса трудовой деятельности
 */
define('DB_EXT_STAFF_WORK_ADDRESS', 'ext_staff_work_address');

/**
 * Таблица с хешами ссылок для доступами к функционалу системы из вне
 */
define('DB_EXTERNAL_LINK', 'external_link');

/**
 * ToDo добавить комментарий
 */
define('DB_FILE_USER_BIND', 'file_user_bind');

/**
 * ToDo добавить комментарий
 */
define('DB_FILE_USER_FILE', 'file_user_file');

/**
 * ToDo добавить комментарий
 */
define('DB_FILE_USER_TREE', 'file_user_tree');

/**
 * ToDo добавить комментарий
 */
define('DB_FILEMANAGER_ACCESS', 'filemanager_access');

/**
 * Блокировки файлового менеджера
 */
define('DB_FILEMANAGER_BLOCK', 'filemanager_block');

/**
 * Каталоги файлового менеджера
 */
define('DB_FILEMANAGER_DIRECTORY', 'filemanager_directory');

/**
 * Файлы файлового менеджера
 */
define('DB_FILEMANAGER_FILE', 'filemanager_file');

/**
 * ToDo добавить комментарий
 */
define('DB_FILEMANAGER_GROUP', 'filemanager_group');

/**
 * Лог событий в файловом менеджере
 */
define('DB_FILEMANAGER_LOG_EVENT_DATA', 'filemanager_log_event_data');

/**
 * Типы событий в файловом менеджере
 */
define('DB_FILEMANAGER_LOG_EVENT_TYPES', 'filemanager_log_event_types');

/**
 * Лога файлового менеджера
 */
define('DB_FILEMANAGER_LOG_EVENTS', 'filemanager_log_events');

/**
 * Права файлового менеджера
 */
define('DB_FILEMANAGER_PERMISSION', 'filemanager_permission');

/**
 * Дефолтные шаблоны фильтра
 */
define('DB_FILTER_DEFAULT_TEMPLATE', 'filter_default_template');

/**
 * Список фильтров
 */
define('DB_FILTER_LIST', 'filter_list');

/**
 * ToDo добавить комментарий
 */
define('DB_FILTER_LIST_TEMPLATE_CONNECTION', 'filter_list_template_connection');

/**
 * Настройки фильтров для разных модулей
 */
define('DB_FILTER_SETTINGS', 'filter_settings');

/**
 * Шаблоны для фильтров
 */
define('DB_FILTER_TEMPLATES', 'filter_templates');

/**
 * Таблица для мониторинга генерации ссылок в футере
 */
define('DB_FOOTER_STAT', 'footer_stat');

/**
 * Таблица запрещенных паролей
 */
define('DB_FORBIDDEN_PASSWORD', 'forbidden_password');

/**
 * Оплаты ЗП ведомость иностранных граждан
 */
define('DB_FOREIGN_CITIZEN_PAYMENTS', 'foreign_citizen_payments');

/**
 * Ставки ЗП ведомость иностранных граждан
 */
define('DB_FOREIGN_CITIZEN_POSITION_RATES', 'foreign_citizen_position_rates');

/**
 * ЗП ведомость иностранных граждан: статусы должностей
 */
define('DB_FOREIGN_CITIZEN_POSITION_STATES', 'foreign_citizen_position_states');

/**
 * Специальности ЗП ведомость иностранных граждан
 */
define('DB_FOREIGN_CITIZEN_POSITIONS', 'foreign_citizen_positions');

/**
 * Модификатор ставки иностранных граждан
 */
define('DB_FOREIGN_CITIZEN_RATE_MULTIPLIER', 'foreign_citizen_rate_multiplier');

/**
 * ЗП за сортировку за период для бригады
 */
define('DB_FOREIGN_CITIZEN_TEAM_PAYMENT', 'foreign_citizen_team_payment');

/**
 * Модификатор рабочего времени иностранных граждан
 */
define('DB_FOREIGN_CITIZEN_TIME_MULTIPLIER', 'foreign_citizen_time_multiplier');

/**
 * Дополнительная цена на товары для франшизы
 */
define('DB_FRANCHISE_ADDITIONAL_PRICE', 'franchise_additional_price');

/**
 * Подготовленные данные для формирования отчёта с клиентами в свободном доступе
 */
define('DB_FREECLIENTS_AGGREGATED_DATA', 'freeclients_aggregated_data');

/**
 * Лог синхронизации данных для модуля свободного доступа
 */
define('DB_FREECLIENTS_SYNC_LOG', 'freeclients_sync_log');

/**
 * ФТП соединения
 */
define('DB_FTP_CONNECTIONS', 'ftp_connections');

/**
 * Информация по топливным картам
 */
define('DB_FUEL_CARD', 'fuel_card');

/**
 * Транзакции топливных карт
 */
define('DB_FUEL_CARD_TRANSACTION', 'fuel_card_transaction');

/**
 * Связка топливных карт и пользователей
 */
define('DB_FUEL_CARD_USER', 'fuel_card_user');

/**
 * Правила проведения транзакций по топливным картам по кассе нал
 */
define('DB_FUEL_CARD_USER_DISCOUNT', 'fuel_card_user_discount');

/**
 * Список доступных полов
 */
define('DB_GENDERS', 'genders');

/**
 * Глобальная информация по звонкам
 */
define('DB_GLOBAL_CALL_DATA', 'global_call_data');

/**
 * Телефоны глобальных звонков
 */
define('DB_GLOBAL_CALL_PHONE', 'global_call_phone');

/**
 * Глобальная таблица клиентов
 */
define('DB_GLOBAL_CLIENT', 'global_client');

/**
 * Глобальные клиенты: листы согласования
 */
define('DB_GLOBAL_CLIENT_AGREEMENT_LIST', 'global_client_agreement_list');

/**
 * Информация по листам с расчетами
 */
define('DB_GLOBAL_CLIENT_CALCULATION_SHEET', 'global_client_calculation_sheet');

/**
 * Глобальные клиенты: список транзакций
 */
define('DB_GLOBAL_CLIENT_CASH', 'global_client_cash');

/**
 * Глобальный клиент: последние заявки
 */
define('DB_GLOBAL_CLIENT_CLAIM', 'global_client_claim');

/**
 * Глобальные клиенты: товары из заявок
 */
define('DB_GLOBAL_CLIENT_CLAIM_ITEM', 'global_client_claim_item');

/**
 * Глобальные клиенты: договора
 */
define('DB_GLOBAL_CLIENT_CONTRACT', 'global_client_contract');

/**
 * Глобальный клиент: данные из контроля наличия документов
 */
define('DB_GLOBAL_CLIENT_DEBT_DOCUMENT', 'global_client_debt_document');

/**
 * Почты глобальных клиентов
 */
define('DB_GLOBAL_CLIENT_EMAIL', 'global_client_email');

/**
 * Информация по счетам
 */
define('DB_GLOBAL_CLIENT_INVOICE', 'global_client_invoice');

/**
 * Глобальные клиенты: юр. претензия
 */
define('DB_GLOBAL_CLIENT_JUDICIAL_CLAIM', 'global_client_judicial_claim');

/**
 * Глобальный клиент: менеджеры
 */
define('DB_GLOBAL_CLIENT_MANAGER', 'global_client_manager');

/**
 * Информация по коммерческим предложениям
 */
define('DB_GLOBAL_CLIENT_OFFER', 'global_client_offer');

/**
 * Глобальный клиент: клиенты не прошедшие проверку осв
 */
define('DB_GLOBAL_CLIENT_OSV', 'global_client_osv');

/**
 * Глобальные клиенты: просроченные платежи + контроль планируемых платежей
 */
define('DB_GLOBAL_CLIENT_PAYMENT', 'global_client_payment');

/**
 * Телефоны глобальных клиентов
 */
define('DB_GLOBAL_CLIENT_PHONE', 'global_client_phone');

/**
 * Глобальная таблица пользователей
 */
define('DB_GLOBAL_DATA_USER', 'global_data_user');

/**
 * Карта соответствий между пользователями и проектами
 */
define('DB_GLOBAL_DATA_USER_PROJECT', 'global_data_user_project');

/**
 * События системы: то что не было отправлено в очередь
 */
define('DB_GLOBAL_EVENT_QUEUE', 'global_event_queue');

/**
 * Все обращения к контроллерам системы
 */
define('DB_GLOBAL_STATISTICS', 'global_statistics');

/**
 * Информация о ручном каскаде
 */
define('DB_HAND_CASCADE', 'hand_cascade');

/**
 * звонки: правила скрытия тэгов по ролям
 */
define('DB_IMOTIO_HIDDEN_TAG', 'imotio_hidden_tag');

/**
 * звонки: названия тегов с сервиса imotio
 */
define('DB_IMOTIO_TAG_CATALOG', 'imotio_tag_catalog');

/**
 * Таблица, содержащая архивные записи из таблицы "Аналитика" -> "Невозможно сделать продукцию"
 */
define('DB_IMPOSSIBLETOMAKE_CLAIMS_ARCHIVE', 'impossibletomake_claims_archive');

/**
 * Таблица для хранения комментариев, указанных при отправке заявок в архив
 */
define('DB_IMPOSSIBLETOMAKE_CLAIMS_ARCHIVE_COMMENT', 'impossibletomake_claims_archive_comment');

/**
 * Условия для модуля неэффективные сотрудники
 */
define('DB_INEFFICIENT_MANAGER_CONDITION', 'inefficient_manager_condition');

/**
 * Правила для условий модуля неэффективные сотрудники
 */
define('DB_INEFFICIENT_MANAGER_RULE', 'inefficient_manager_rule');

/**
 * Список субъектов(роль, отдел, пользователь) для которых применяются условия для модуля неэффективные сотрудники
 */
define('DB_INEFFICIENT_MANAGER_SUBJECT', 'inefficient_manager_subject');

/**
 * Инфляция по годам
 */
define('DB_INFLATION', 'inflation');

/**
 * Информационная панель: настройки
 */
define('DB_INFO_PANEL_SETTINGS', 'info_panel_settings');

/**
 * Настройки слайдов по отделам
 */
define('DB_INFO_TABLE_SLIDE_SETTINGS', 'info_table_slide_settings');

/**
 * Список слайдов на информационного табло
 */
define('DB_INFO_TABLE_SLIDES', 'info_table_slides');

/**
 * Счета к оплате
 */
define('DB_INVOICE', 'invoice');

/**
 * Баннеры для счетов
 */
define('DB_INVOICE_BANNER', 'invoice_banner');

/**
 * Привязка баннера для счета к пользователю/отделу
 */
define('DB_INVOICE_BANNER_BINDING', 'invoice_banner_binding');

/**
 * Список товаров для выписанных счетов
 */
define('DB_INVOICE_GOODS', 'invoice_goods');

/**
 * список правил для ограничения видения реквизитов
 */
define('DB_INVOICE_REQUISITES_RULES', 'invoice_requisites_rules');

/**
 * Реквизиты правил и фильтры для подбора правила пользователю
 */
define('DB_INVOICE_REQUISITES_RULES_OBJECTS', 'invoice_requisites_rules_objects');

/**
 * Контроль претензий
 */
define('DB_JUDICIAL_CLIENTS', 'judicial_clients');

/**
 * Комментарии к претензиям
 */
define('DB_JUDICIAL_COMMENTS', 'judicial_comments');

/**
 * Статусы претензий
 */
define('DB_JUDICIAL_STATUSES', 'judicial_statuses');

/**
 * Выгрузка из кладра, области районы, города
 */
define('DB_KLADR', 'kladr');

/**
 * ToDo добавить комментарий
 */
define('DB_KLADR_PREFIXES', 'kladr_prefixes');

/**
 * Договоры-заявки
 */
define('DB_LIBDOC_CLAIM_CONTRACTS', 'libdoc_claim_contracts');

/**
 * JSON данные по документам библиотеки
 */
define('DB_LIBDOC_DATA', 'libdoc_data');

/**
 * Письма для рассылки
 */
define('DB_LIBDOC_LETTERS', 'libdoc_letters');

/**
 * Коммерческие предложения
 */
define('DB_LIBDOC_OFFERS', 'libdoc_offers');

/**
 * Список пользователей с правом на подпись доверенностей
 */
define('DB_LIBDOC_PROCURATION_FOR_SIGN', 'libdoc_procuration_for_sign');

/**
 * Настройки секций из файлов (invoice.ini = contracts.ini)
 */
define('DB_LIBDOC_SECTIONS', 'libdoc_sections');

/**
 * Типы документов библиотеки
 */
define('DB_LIBDOC_TYPES', 'libdoc_types');

/**
 * ToDo добавить комментарий
 */
define('DB_LOG_DB', 'log_db');

/**
 * Тип объекта в модуле с которым произошло событие
 */
define('DB_LOG_EVENT_KINDS', 'log_event_kinds');

/**
 * Тип события логгера
 */
define('DB_LOG_EVENTS', 'log_events');

/**
 * Поля модулей по которым происходит логирование
 */
define('DB_LOG_FIELDS', 'log_fields');

/**
 * Действия произведенные с полями в событии
 */
define('DB_LOG_FIELDS_DATA', 'log_fields_data');

/**
 * События логгера
 */
define('DB_LOG_MAIN', 'log_main');

/**
 * Хранит наименования модулей в который произошло логирование
 */
define('DB_LOG_MODULES', 'log_modules');

/**
 * Привязка доменов к smtp серверам
 */
define('DB_MAIL_DOMAIN_SMTP', 'mail_domain_smtp');

/**
 * Список адресов для типов рассылки
 */
define('DB_MAIL_LIST', 'mail_list');

/**
 * Список рассылок
 */
define('DB_MAIL_LIST_TYPE', 'mail_list_type');

/**
 * Учётные записи
 */
define('DB_MAIL_SERVER_ACCOUNT', 'mail_server_account');

/**
 * Алиасы для аккаунтов почтового сервера
 */
define('DB_MAIL_SERVER_ACCOUNT_ALIAS', 'mail_server_account_alias');

/**
 * Статусы учётных записей
 */
define('DB_MAIL_SERVER_ACCOUNT_STATES', 'mail_server_account_states');

/**
 * Статус синхронизации учётной записи
 */
define('DB_MAIL_SERVER_ACCOUNT_SYNC_STATES', 'mail_server_account_sync_states');

/**
 * Синхронизация за текущий день
 */
define('DB_MAIL_SERVER_DAILY_SYNC', 'mail_server_daily_sync');

/**
 * Сообщения почтового ящика
 */
define('DB_MAIL_SERVER_MESSAGE', 'mail_server_message');

/**
 * Направления писем
 */
define('DB_MAIL_SERVER_MESSAGE_DIRECTIONS', 'mail_server_message_directions');

/**
 * Встроенные вложения писем (те что внутри текста)
 */
define('DB_MAIL_SERVER_MESSAGE_EMBEDDED_ATTACHMENT', 'mail_server_message_embedded_attachment');

/**
 * Почты фигурирующие в сообщении
 */
define('DB_MAIL_SERVER_MESSAGE_PARTICIPANT', 'mail_server_message_participant');

/**
 * Лог отправки сообщений с почтового сервера
 */
define('DB_MAIL_SERVER_SEND_MESSAGE_LOG', 'mail_server_send_message_log');

/**
 * Сообщения обработка которых была пропущена
 */
define('DB_MAIL_SERVER_SKIPPED_MESSAGE', 'mail_server_skipped_message');

/**
 * Почтовые сервера
 */
define('DB_MAIL_SMTP_SERVERS', 'mail_smtp_servers');

/**
 * Шаблоны писем
 */
define('DB_MAIL_TEMPLATES', 'mail_templates');

/**
 * Дополнительные данные товаров заявок маркетплейс
 */
define('DB_MARKETPLACE_CLAIM_PRODUCTS', 'marketplace_claim_products');

/**
 * Дополнительные данные заявок маркетплейс
 */
define('DB_MARKETPLACE_CLAIMS', 'marketplace_claims');

/**
 * Импорты по маркетплейсам
 */
define('DB_MARKETPLACE_IMPORTS', 'marketplace_imports');

/**
 * Связь наших поставок с поставками клиентов
 */
define('DB_MARKETPLACE_SUPPLIES', 'marketplace_supplies');

/**
 * Детализация поставок на marketplacе, информация заносится в модуле споры маркетплейс
 */
define('DB_MARKETPLACE_SUPPLY_DETAILS', 'marketplace_supply_details');

/**
 * Сырье для товара в переработке
 */
define('DB_MATERIALS', 'materials');

/**
 * Распределение прихода от пер-ка по секциям на складе
 */
define('DB_MATERIALS_INCOME_SECTIONS', 'materials_income_sections');

/**
 * ToDo добавить комментарий
 */
define('DB_MATERIALS_PERCENT', 'materials_percent');

/**
 * ToDo добавить комментарий
 */
define('DB_MATERIALS_RETURN_SECTIONS', 'materials_return_sections');

/**
 * Дефолтные колонки нижнего меню
 */
define('DB_MENU_BOTTOM_COLUMNS', 'menu_bottom_columns');

/**
 * Элементы пользователя в колонке
 */
define('DB_MENU_BOTTOM_COLUMNS_ELEMENTS', 'menu_bottom_columns_elements');

/**
 * Пользовательские названия колонок
 */
define('DB_MENU_BOTTOM_USER_COLUMNS', 'menu_bottom_user_columns');

/**
 * Главное меню
 */
define('DB_MENU_MAIN', 'menu_main');

/**
 * ToDo добавить комментарий
 */
define('DB_MENU_MAIN_ELEMENT_COUNTER_VALUES', 'menu_main_element_counter_values');

/**
 * Данные элементов меню
 */
define('DB_MENU_MAIN_ELEMENT_DATA', 'menu_main_element_data');

/**
 * Связи между элементами меню
 */
define('DB_MENU_MAIN_RELATIONS', 'menu_main_relations');

/**
 * Очередь пересчета счетчиков
 */
define('DB_MENU_MAIN_UPDATE_QUEUE', 'menu_main_update_queue');

/**
 * Аккаунты Яндекса данные о приложении
 */
define('DB_METRIKA_ACCOUNTS', 'metrika_accounts');

/**
 * Ошибки возникающие в ходе работы с API
 */
define('DB_METRIKA_API_ERRORS', 'metrika_api_errors');

/**
 * История счетчика
 */
define('DB_METRIKA_COUNTER_HISTORY', 'metrika_counter_history');

/**
 * Ежедневный отчет
 */
define('DB_METRIKA_REPORT', 'metrika_report');

/**
 * Связь счетчика с пользователем
 */
define('DB_METRIKA_REPORT_USER', 'metrika_report_user');

/**
 * Информация о миграциях
 */
define('DB_MIGRATION', 'migration');

/**
 * История claim_weight по периодам
 */
define('DB_MOTIVATION_PLAN_CLAIM_WEIGHT_PERIOD', 'motivation_plan_claim_weight_period');

/**
 * Список привязанных к набору параметров отделов и ролей
 */
define('DB_MOTIVATION_PLAN_ORGSTRUCTURE_RULE', 'motivation_plan_orgstructure_rule');

/**
 * Набор параметров для мотивации в соответствии с планом
 */
define('DB_MOTIVATION_PLAN_PARAM', 'motivation_plan_param');

/**
 * Сформированный список пользователей со значениями, влияющими на мотивацию, за период
 */
define('DB_MOTIVATION_PLAN_USER_LIST', 'motivation_plan_user_list');

/**
 * Список пользователей с исключениями, для которых действует набор параметров мотивации
 */
define('DB_MOTIVATION_PLAN_USER_RULE', 'motivation_plan_user_rule');

/**
 * Шаблоны правил мотивации
 */
define('DB_MOTIVATION_RULES_TEMPLATES', 'motivation_rules_templates');

/**
 * История шаблонов правил мотивации
 */
define('DB_MOTIVATION_RULES_TEMPLATES_ARCHIVE', 'motivation_rules_templates_archive');

/**
 * ToDo добавить комментарий
 */
define('DB_MOTIVATION_TOOLS_ACTION', 'motivation_tools_action');

/**
 * ToDo добавить комментарий
 */
define('DB_MOTIVATION_TOOLS_CONDITION', 'motivation_tools_condition');

/**
 * Правила для инструментов мотивирования
 */
define('DB_MOTIVATION_TOOLS_RULE', 'motivation_tools_rule');

/**
 * Мотивация топ менеджеров
 */
define('DB_MOTIVATION_USER_RESULTS', 'motivation_user_results');

/**
 * Правила мотивации для сотрудников
 */
define('DB_MOTIVATION_USERS_RULES', 'motivation_users_rules');

/**
 * Правила уведомлений
 */
define('DB_NOTICE_RULE', 'notice_rule');

/**
 * Типы области действия правил уведомления
 */
define('DB_NOTICE_RULE_INFLUENCE_TYPE', 'notice_rule_influence_type');

/**
 * Выделенные значения для правила в контроле уведомлений
 */
define('DB_NOTICE_RULE_LIST_ITEM', 'notice_rule_list_item');

/**
 * Типы уведомлений
 */
define('DB_NOTICE_RULE_TYPE', 'notice_rule_type');

/**
 * Список различных опций для сайта
 */
define('DB_OPTIONS', 'options');

/**
 * Список отделов, оргструктура
 */
define('DB_ORGSTRUCTURE', 'orgstructure');

/**
 * Связь отделов со складами
 */
define('DB_ORGSTRUCTURE_DEPOT', 'orgstructure_depot');

/**
 * Пользователи принадлежащие к отделу
 */
define('DB_ORGSTRUCTURE_USERS', 'orgstructure_users');

/**
 * Таблица со списком компаний, для которых грузится осв
 */
define('DB_OSV_COMPANY_LIST', 'osv_company_list');

/**
 * Клиенты из ОСВ без ИНН
 */
define('DB_OSV_WITHOUT_INN', 'osv_without_inn');

/**
 * Точки доступа СКУД
 */
define('DB_PACS_ACCESS_POINT', 'pacs_access_point');

/**
 * Карточки доступа СКУД
 */
define('DB_PACS_CARD', 'pacs_card');

/**
 * Связь карт доступов и точек доступов
 */
define('DB_PACS_CARD_ACCESS_POINT', 'pacs_card_access_point');

/**
 * Общая ЗП ведомость
 */
define('DB_PAYROLL_ALL', 'payroll_all');

/**
 * Общая ЗП ведомость
 */
define('DB_PAYROLL_ALL_TEMP', 'payroll_all_temp');

/**
 * Корректировки к авансовым отчетам за период
 */
define('DB_PAYROLL_CORRECTION', 'payroll_correction');

/**
 * Список пользователей с заблокированным полем "К выдаче" в ЗП ведомости
 */
define('DB_PAYROLL_LOCKED_USERS', 'payroll_locked_users');

/**
 * Отчетный период
 */
define('DB_PAYROLL_PERIODS', 'payroll_periods');

/**
 * Авансовые отчеты
 */
define('DB_PAYROLL_STEP', 'payroll_step');

/**
 * Списки файлов подтверждающих закрытие авансового отчета
 */
define('DB_PAYROLL_STEP_FILES', 'payroll_step_files');

/**
 * Временное хранилище пользователей для следующего авансового отчета
 */
define('DB_PAYROLL_STEP_TEMP', 'payroll_step_temp');

/**
 * Пользователи участвующие в авансовом отчете
 */
define('DB_PAYROLL_STEP_USERS', 'payroll_step_users');

/**
 * ToDo добавить комментарий
 */
define('DB_PENALTY_CONTEXT', 'penalty_context');

/**
 * ToDo добавить комментарий
 */
define('DB_PENALTY_FINED', 'penalty_fined');

/**
 * ToDo добавить комментарий
 */
define('DB_PENALTY_SERVICE', 'penalty_service');

/**
 * Кол-во просмотров телефонов пользователями
 */
define('DB_PHONE_VIEW_COUNTER', 'phone_view_counter');

/**
 * Ограничения на просмотр телефонов в сутки
 */
define('DB_PHONE_VIEW_RESTRICTION', 'phone_view_restriction');

/**
 * Настройки схожести товаров для модуля "Потенциальные клиенты"
 */
define('DB_POTENTIALCLIENTS_SIMILARPRODUCTS_PARAM', 'potentialclients_similarproducts_param');

/**
 * Формулы для расчета веса единицы шт товара
 */
define('DB_PRODUCT_FORMULS', 'product_formuls');

/**
 * Типы товаров по измерению
 */
define('DB_PRODUCT_MEASURE_TYPES', 'product_measure_types');

/**
 * Таблица с товарами и клиентами, от которых пришла поставка
 */
define('DB_PRODUCT_SUPPLIER', 'product_supplier');

/**
 * Типы товаров
 */
define('DB_PRODUCT_TYPES', 'product_types');

/**
 * Задачи мастера для работников
 */
define('DB_PRODUCTION_MASTER_TASKS', 'production_master_tasks');

/**
 * Подтверждения работы ОТК
 */
define('DB_PRODUCTION_QUALITY_CONTROL_CONFIRMATIONS', 'production_quality_control_confirmations');

/**
 * Отчет по сменному заданию
 */
define('DB_PRODUCTION_SHIFT_TASK_REPORT', 'production_shift_task_report');

/**
 * Запись из отчета по сменному заданию
 */
define('DB_PRODUCTION_SHIFT_TASK_REPORT_RECORD', 'production_shift_task_report_record');

/**
 * Настройки шаблонов для производства
 */
define('DB_PRODUCTION_TEMPLATE_SETTINGS', 'production_template_settings');

/**
 * ToDo добавить комментарий
 */
define('DB_PROJECT', 'project');

/**
 * Включение отключение проекта
 */
define('DB_PROJECT_ACCESS', 'project_access');

/**
 * Компании исключения для модуля "Деньги в проекте"
 */
define('DB_PROJECT_MONEY_COMPANIES', 'project_money_companies');

/**
 * Задолженности нашей компании
 */
define('DB_PROJECT_MONEY_CREDITS', 'project_money_credits');

/**
 * Задолженности перед нашей компанией
 */
define('DB_PROJECT_MONEY_DEBTS', 'project_money_debts');

/**
 * Клиенты у которых производились изменения задним числом
 */
define('DB_PROJECT_MONEY_EDIT_CLIENTS', 'project_money_edit_clients');

/**
 * Товары исключения для модуля "Деньги в проекте"
 */
define('DB_PROJECT_MONEY_PRODUCTS', 'project_money_products');

/**
 * Очередь для проведения вычислений.
 */
define('DB_QUEUE', 'queue');

/**
 * Названия груп IP-алресов
 */
define('DB_RANGE', 'range');

/**
 * IP адреса принадлежащие к группе и правила их задания
 */
define('DB_RANGE_IP', 'range_ip');

/**
 * Типы формул для сырьевых заявок
 */
define('DB_RAW_FORMULA_TYPES', 'raw_formula_types');

/**
 * Формулы для сырьевых заявок
 */
define('DB_RAW_FORMULAS', 'raw_formulas');

/**
 * Контроль актов сверок переработчиков
 */
define('DB_RECEIPT_CLIENT_ACT_REVISE', 'receipt_client_act_revise');

/**
 * Файлы актов сверок переработчиков
 */
define('DB_RECEIPT_CLIENT_ACT_REVISE_FILE', 'receipt_client_act_revise_file');

/**
 * План производства по деревьям шаблонов
 */
define('DB_RECEIPT_PLAN', 'receipt_plan');

/**
 * Типы привязок заявок к плану
 */
define('DB_RECEIPT_PLAN_BIND_TYPES', 'receipt_plan_bind_types');

/**
 * Блокировка заказов под дилеров
 */
define('DB_RECEIPT_PLAN_BLOCKS', 'receipt_plan_blocks');

/**
 * Распределение товара заявки по записям плана
 */
define('DB_RECEIPT_PLAN_CLAIM_ITEMS', 'receipt_plan_claim_items');

/**
 * Клиенты используемые в плане производства
 */
define('DB_RECEIPT_PLAN_CLIENTS', 'receipt_plan_clients');

/**
 * Файлы записей плана производства
 */
define('DB_RECEIPT_PLAN_FILES', 'receipt_plan_files');

/**
 * Таблица с рассчитанными стоимостями работы за минуту по должностям
 */
define('DB_RECEIPT_POST_COEFFICIENT', 'receipt_post_coefficient');

/**
 * История себестоимости товаров
 */
define('DB_RECEIPT_PRICE_HISTORY', 'receipt_price_history');

/**
 * Стоимость по периодам
 */
define('DB_RECEIPT_PRICE_ITEM_PRICES', 'receipt_price_item_prices');

/**
 * Список типов составляющих цену переработки
 */
define('DB_RECEIPT_PRICE_ITEM_TYPES', 'receipt_price_item_types');

/**
 * Список составляющих цену переработки объектов
 */
define('DB_RECEIPT_PRICE_ITEMS', 'receipt_price_items');

/**
 * Трудоемкость изготовления
 */
define('DB_RECEIPT_PRICE_LABOR_INTENSITY', 'receipt_price_labor_intensity');

/**
 * Трудоемкость переработки: детализация
 */
define('DB_RECEIPT_PRICE_LABOR_INTENSITY_DETAILS', 'receipt_price_labor_intensity_details');

/**
 * История расчетов
 */
define('DB_RECEIPT_PRICE_PREPROFIT_HISTORY', 'receipt_price_preprofit_history');

/**
 * Детализация расчетов
 */
define('DB_RECEIPT_PRICE_PREPROFIT_HISTORY_DETAILS', 'receipt_price_preprofit_history_details');

/**
 * Группы инструментов
 */
define('DB_RECEIPT_PRICE_TOOL_GROUPS', 'receipt_price_tool_groups');

/**
 * Необходимые закупки
 */
define('DB_RECEIPT_PURCHASES', 'receipt_purchases');

/**
 * ToDo добавить комментарий
 */
define('DB_RECEIPT_PURCHASES_DETAILS', 'receipt_purchases_details');

/**
 * Суммарное кол-во заказов по товарам необходимых закупок
 */
define('DB_RECEIPT_PURCHASES_ORDERS', 'receipt_purchases_orders');

/**
 * История изменений заказов
 */
define('DB_RECEIPT_PURCHASES_ORDERS_HISTORY', 'receipt_purchases_orders_history');

/**
 * События по заказам
 */
define('DB_RECEIPT_PURCHASES_ORDERS_PART_EVENTS', 'receipt_purchases_orders_part_events');

/**
 * Список заказов
 */
define('DB_RECEIPT_PURCHASES_ORDERS_PARTS', 'receipt_purchases_orders_parts');

/**
 * Настройки модуля Необходимые закупки
 */
define('DB_RECEIPT_PURCHASES_SETTINGS', 'receipt_purchases_settings');

/**
 * Данные по просмотрам необходимых закупок
 */
define('DB_RECEIPT_PURCHASES_VIEWS', 'receipt_purchases_views');

/**
 * Ремонтный план производства
 */
define('DB_RECEIPT_REPAIR_PLAN', 'receipt_repair_plan');

/**
 * план производства: ремонтные работы: заявки
 */
define('DB_RECEIPT_REPAIR_PLAN_CLAIM', 'receipt_repair_plan_claim');

/**
 * Файлы План производства: Ремонтные работы
 */
define('DB_RECEIPT_REPAIR_PLAN_FILES', 'receipt_repair_plan_files');

/**
 * Статусы обработки заказа в плане производства
 */
define('DB_RECEIPT_REPAIR_PLAN_PROCESSING_STATES', 'receipt_repair_plan_processing_states');

/**
 * Исполнители План производства: Ремонтные работы
 */
define('DB_RECEIPT_REPAIR_PLAN_WORKERS', 'receipt_repair_plan_workers');

/**
 * Шаблоны товаров для пре-ки
 */
define('DB_RECEIPT_TEMPLATE', 'receipt_template');

/**
 * Группы альтернатив для шаблонов переработки
 */
define('DB_RECEIPT_TEMPLATE_ALTERNATIVE_GROUP', 'receipt_template_alternative_group');

/**
 * Состав групп альтернатив для сырья в шаблонах переработки
 */
define('DB_RECEIPT_TEMPLATE_ALTERNATIVE_GROUP_ITEM', 'receipt_template_alternative_group_item');

/**
 * Основание для транзакций
 */
define('DB_RECEIPT_TEMPLATE_COMMENT', 'receipt_template_comment');

/**
 * Файлы шаблонов переработки
 */
define('DB_RECEIPT_TEMPLATE_FILES', 'receipt_template_files');

/**
 * Сырьё в шаблоне переработки
 */
define('DB_RECEIPT_TEMPLATE_ITEM', 'receipt_template_item');

/**
 * Группы альтернативных товаров для сырья из шаблона
 */
define('DB_RECEIPT_TEMPLATE_ITEM_ALTERNATIVE_GROUP', 'receipt_template_item_alternative_group');

/**
 * Исключения из групп альтернативных товаров для сырья из шаблона
 */
define('DB_RECEIPT_TEMPLATE_ITEM_ALTERNATIVE_GROUP_EXCEPTION', 'receipt_template_item_alternative_group_exception');

/**
 * Альтернативные товары для сырья из шаблона
 */
define('DB_RECEIPT_TEMPLATE_ITEM_ALTERNATIVE_ITEM', 'receipt_template_item_alternative_item');

/**
 * Деревья шаблонов
 */
define('DB_RECEIPT_TREE', 'receipt_tree');

/**
 * Шаблоны в дереве шаблонов
 */
define('DB_RECEIPT_TREE_TEMPLATE', 'receipt_tree_template');

/**
 * ToDo добавить комментарий
 */
define('DB_REDIRECT_LOG', 'redirect_log');

/**
 * Проекты для редиректа по истечении сессии
 */
define('DB_REDIRECT_PROJECTS', 'redirect_projects');

/**
 * Региональные номера с привязкой к пользователям
 */
define('DB_REGION_PHONE', 'region_phone');

/**
 * Привязка региональных телефонов к отделам
 */
define('DB_REGION_PHONE_ORGSTRUCTURE', 'region_phone_orgstructure');

/**
 * Переадресация региональных номеров
 */
define('DB_REGION_PHONE_REDIRECTS', 'region_phone_redirects');

/**
 * Объекты для аренды
 */
define('DB_RENTABLE', 'rentable');

/**
 * Реклама для аренды
 */
define('DB_RENTABLE_ADS', 'rentable_ads');

/**
 * История изменения статусов записей
 */
define('DB_RENTABLE_ADS_STATE_HISTORY', 'rentable_ads_state_history');

/**
 * Статусы рекламы аренды
 */
define('DB_RENTABLE_ADS_STATES', 'rentable_ads_states');

/**
 * Таблица связи услуги в заявке на аренду с объектами аренды
 */
define('DB_RENTABLE_ITEM_CONNECTION', 'rentable_item_connection');

/**
 * Недвижимость для аренды
 */
define('DB_RENTABLE_REALTY', 'rentable_realty');

/**
 * Типы документов объектов аренды
 */
define('DB_RENTABLE_REALTY_FILE_TYPES', 'rentable_realty_file_types');

/**
 * Документы объекта аренды
 */
define('DB_RENTABLE_REALTY_FILES', 'rentable_realty_files');

/**
 * Показы недвижимости
 */
define('DB_RENTABLE_REALTY_SHOW', 'rentable_realty_show');

/**
 * Типы недвижимости
 */
define('DB_RENTABLE_REALTY_TYPES', 'rentable_realty_types');

/**
 * Список пользователей для замены
 */
define('DB_REPLACEMENT_LIST', 'replacement_list');

/**
 * ToDo добавить комментарий
 */
define('DB_REPORT_ADDRESSER', 'report_addresser');

/**
 * ToDo добавить комментарий
 */
define('DB_REPORT_HISTORY', 'report_history');

/**
 * ToDo добавить комментарий
 */
define('DB_REPORT_LIST', 'report_list');

/**
 * ToDo добавить комментарий
 */
define('DB_REPORT_SETTINGS', 'report_settings');

/**
 * REST API: каталог модулей
 */
define('DB_REST_API_MODULE', 'rest_api_module');

/**
 * Restapi: пользовательские настройки модуля воронки продаж
 */
define('DB_REST_API_SALES_FUNNEL_SETTINGS', 'rest_api_sales_funnel_settings');

/**
 * REST API: пользователи и их ключи
 */
define('DB_REST_API_USER', 'rest_api_user');

/**
 * ToDo добавить комментарий
 */
define('DB_RETURN_SUPPLY_BLOCKS', 'return_supply_blocks');

/**
 * Проверка ОСВ
 */
define('DB_REVISE', 'revise');

/**
 * Клиенты, которых не удалось идентифицировать, проверка ОСВ
 */
define('DB_REVISE_ERRORS', 'revise_errors');

/**
 * Лог проверок ОСВ
 */
define('DB_REVISE_LOG', 'revise_log');

/**
 * Шаблоны для штрафов и премий
 */
define('DB_SALARY_BONUS_FINE_TEMPLATE', 'salary_bonus_fine_template');

/**
 * Типы операций шаблона
 */
define('DB_SALARY_BONUS_FINE_TEMPLATE_OPERATION_TYPE', 'salary_bonus_fine_template_operation_type');

/**
 * Таблица бонусов и штрафов
 */
define('DB_SALARY_BONUSES_FINE', 'salary_bonuses_fine');

/**
 * Формулы с привязкой
 */
define('DB_SALARY_CAT_FORMULS', 'salary_cat_formuls');

/**
 * Шаблоны формул
 */
define('DB_SALARY_CAT_FORMULS_TEMPLATE', 'salary_cat_formuls_template');

/**
 * Типы заявок по знакам
 */
define('DB_SALARY_CAT_OPERATION_TYPE', 'salary_cat_operation_type');

/**
 * Таблица статусов зп отчета
 */
define('DB_SALARY_CAT_STATUSES', 'salary_cat_statuses');

/**
 * Таблица переменных с описанием для формул
 */
define('DB_SALARY_CAT_VARIABLES_FOR_FORMULS', 'salary_cat_variables_for_formuls');

/**
 * Таблица для хранения результатов пересчета статусов оплаты
 */
define('DB_SALARY_CLAIMS', 'salary_claims');

/**
 * Очередь заявок для создания корректировок
 */
define('DB_SALARY_CORRECTIONS_QUEUE', 'salary_corrections_queue');

/**
 * Документ по заявке
 */
define('DB_SALARY_DOC_CLAIM', 'salary_doc_claim');

/**
 * зп отчет: услуги по ремонту
 */
define('DB_SALARY_DOC_CLAIM_REPAIR', 'salary_doc_claim_repair');

/**
 * зп отчёт: информация по ремонтам из заявок
 */
define('DB_SALARY_DOC_CLAIM_REPAIR_DETAILED', 'salary_doc_claim_repair_detailed');

/**
 * Таблица детализации переменных отчета
 */
define('DB_SALARY_DOC_DETAILED', 'salary_doc_detailed');

/**
 * Коэффициент понижения ЗП в зависимости от срока проведенного товаром на складе
 */
define('DB_SALARY_IN_DEPOT_KOOF', 'salary_in_depot_koof');

/**
 * Документ по заявке для зп отчета приходных менеджеров
 */
define('DB_SALARY_IN_DOC_CLAIM', 'salary_in_doc_claim');

/**
 * Таблица детализации переменных ЗП отчета приходных менеджеров
 */
define('DB_SALARY_IN_DOC_DETAILED', 'salary_in_doc_detailed');

/**
 * Распределение расходов по товарам заявки для ЗП отчета закупок
 */
define('DB_SALARY_IN_EXPENSE_DISTRIBUTION', 'salary_in_expense_distribution');

/**
 * Для расчета ЗП закупки отдела Маскаевой
 */
define('DB_SALARY_IN_MARGIN_PERCENT', 'salary_in_margin_percent');

/**
 * Тип операции для заявок в ЗП отчете закупки
 */
define('DB_SALARY_IN_OPERATION_TYPE', 'salary_in_operation_type');

/**
 * Таблица результатов зарплатного отчета для закупок
 */
define('DB_SALARY_IN_REPORT', 'salary_in_report');

/**
 * Таблица детализации переменных ЗП отчета закупок
 */
define('DB_SALARY_IN_REPORT_DETAILED', 'salary_in_report_detailed');

/**
 * Базовые кооф. для расчета ЗП
 */
define('DB_SALARY_KOOF_BASE', 'salary_koof_base');

/**
 * Правила понижения кооф. для части ЗП по ценам от разницы в % между бц и цп
 */
define('DB_SALARY_KOOF_BP', 'salary_koof_bp');

/**
 * Таблица обнала БЦ при расчете коэф. для ЗП отчет
 */
define('DB_SALARY_KOOF_CASHOUT', 'salary_koof_cashout');

/**
 * Правила понижения кооф. для части ЗП по весу от отсрочки
 */
define('DB_SALARY_KOOF_DELEY', 'salary_koof_deley');

/**
 * Расчет зп для каждой строки зп отчета на основе кооф. по обороту и разнице цен
 */
define('DB_SALARY_KOOF_DETAILED_SALARY', 'salary_koof_detailed_salary');

/**
 * Правила понижения кооф. для части ЗП по ценам от отсрочки
 */
define('DB_SALARY_KOOF_GRACE', 'salary_koof_grace');

/**
 * Правила понижения кооф. для части ЗП по весу от разницы в % между бц и цп
 */
define('DB_SALARY_KOOF_SBP', 'salary_koof_sbp');

/**
 * ToDo добавить комментарий
 */
define('DB_SALARY_MASTER_DEPARTURE_SUM', 'salary_master_departure_sum');

/**
 * Список формул для ЗП отчета
 */
define('DB_SALARY_NEW_FORMULA', 'salary_new_formula');

/**
 * Формулы с привязкой
 */
define('DB_SALARY_NEW_FORMULA_BINDING', 'salary_new_formula_binding');

/**
 * Список типов формул
 */
define('DB_SALARY_NEW_FORMULA_TYPE', 'salary_new_formula_type');

/**
 * Переменные для формул нового ЗП отчета
 */
define('DB_SALARY_NEW_FORMULA_VARIABLES', 'salary_new_formula_variables');

/**
 * ToDo добавить комментарий
 */
define('DB_SALARY_REPAIR_DOC_CLAIM', 'salary_repair_doc_claim');

/**
 * ToDo добавить комментарий
 */
define('DB_SALARY_REPAIR_DOC_DETAILED', 'salary_repair_doc_detailed');

/**
 * Дополнительные расходы для заявок на ремонт и ремонт не нашего оборудования
 */
define('DB_SALARY_REPAIR_EXTRA_EXPENSES', 'salary_repair_extra_expenses');

/**
 * Файлы для табеля доп. расходов для заявок на ремонт
 */
define('DB_SALARY_REPAIR_EXTRA_EXPENSES_FILE', 'salary_repair_extra_expenses_file');

/**
 * ToDo добавить комментарий
 */
define('DB_SALARY_REPAIR_REPORT', 'salary_repair_report');

/**
 * ToDo добавить комментарий
 */
define('DB_SALARY_REPAIR_REPORT_DETAILED', 'salary_repair_report_detailed');

/**
 * Таблица результатов отчета
 */
define('DB_SALARY_REPORT', 'salary_report');

/**
 * Таблица детализации переменных отчета
 */
define('DB_SALARY_REPORT_DETAILED', 'salary_report_detailed');

/**
 * Мотивация руководителей
 */
define('DB_SALARY_TOP_MANAGER_MOTIVATION', 'salary_top_manager_motivation');

/**
 * ЗП руководителей отдела закупки
 */
define('DB_SALARY_TOP_MANAGER_REPORT', 'salary_top_manager_report');

/**
 * Воронка продаж: воронка
 */
define('DB_SALES_FUNNEL', 'sales_funnel');

/**
 * воронка продаж: информация по автоответчикам
 */
define('DB_SALES_FUNNEL_AUTO_REPLY_STAT', 'sales_funnel_auto_reply_stat');

/**
 * Воронка продаж: задания для выполнения по крону
 */
define('DB_SALES_FUNNEL_CRON_JOB', 'sales_funnel_cron_job');

/**
 * Воронка продаж: настройки источника данных Авито
 */
define('DB_SALES_FUNNEL_DATASOURCE_AVITO', 'sales_funnel_datasource_avito');

/**
 * Воронка продаж: аккаунты авито связанные с воронкой
 */
define('DB_SALES_FUNNEL_DATASOURCE_AVITO_ACCOUNT', 'sales_funnel_datasource_avito_account');

/**
 * воронка продаж: суммы объявлений авито распределённых по пользователям для стратегии распределения лидов
 */
define('DB_SALES_FUNNEL_DATASOURCE_AVITO_ITEM_BALANCE', 'sales_funnel_datasource_avito_item_balance');

/**
 * Воронка продаж: настройки источника данных EDNA
 */
define('DB_SALES_FUNNEL_DATASOURCE_EDNA', 'sales_funnel_datasource_edna');

/**
 * Воронка продаж: каналы EDNA связанные с воронкой
 */
define('DB_SALES_FUNNEL_DATASOURCE_EDNA_CHANNEL', 'sales_funnel_datasource_edna_channel');

/**
 * Воронка продаж: настройки источника данных "Почтовый сервер"
 */
define('DB_SALES_FUNNEL_DATASOURCE_MAIL_SERVER', 'sales_funnel_datasource_mail_server');

/**
 * Воронка продаж: настройки источника данных "Почтовый сервер", почты
 */
define('DB_SALES_FUNNEL_DATASOURCE_MAIL_SERVER_EMAIL', 'sales_funnel_datasource_mail_server_email');

/**
 * Воронка продаж: каталог с типами источников данных для лидов
 */
define('DB_SALES_FUNNEL_DATASOURCE_TYPE', 'sales_funnel_datasource_type');

/**
 * Воронка продаж: исполнители дочерних лидов в воронке по умолчанию
 */
define('DB_SALES_FUNNEL_DEFAULT_ASSIGNEE', 'sales_funnel_default_assignee');

/**
 * Типы связей комментариев с событиями
 */
define('DB_SALES_FUNNEL_DISCUSSION_BIND_TYPES', 'sales_funnel_discussion_bind_types');

/**
 * Сообщение в обсуждении
 */
define('DB_SALES_FUNNEL_DISCUSSION_MESSAGE', 'sales_funnel_discussion_message');

/**
 * Подписчики
 */
define('DB_SALES_FUNNEL_DISCUSSION_SUBSCRIPTION', 'sales_funnel_discussion_subscription');

/**
 * Просмотры обсуждений
 */
define('DB_SALES_FUNNEL_DISCUSSION_VIEW', 'sales_funnel_discussion_view');

/**
 * Черный список доменов
 */
define('DB_SALES_FUNNEL_DOMAIN_BLACKLIST', 'sales_funnel_domain_blacklist');

/**
 * Воронка продаж: фильтр по отделам для новых лидов
 */
define('DB_SALES_FUNNEL_FILTER_DEPARTMENT', 'sales_funnel_filter_department');

/**
 * Воронка продаж: фильтр по ролям для новых лидов
 */
define('DB_SALES_FUNNEL_FILTER_ROLE', 'sales_funnel_filter_role');

/**
 * Воронка продаж: фильтр по пользователям для новых лидов
 */
define('DB_SALES_FUNNEL_FILTER_USER', 'sales_funnel_filter_user');

/**
 * Воронка продаж: лиды(сделка)
 */
define('DB_SALES_FUNNEL_LEAD', 'sales_funnel_lead');

/**
 * Агрегированные данные лидов
 */
define('DB_SALES_FUNNEL_LEAD_AGGREGATED_DATA', 'sales_funnel_lead_aggregated_data');

/**
 * Комментарий к лиду (общий)
 */
define('DB_SALES_FUNNEL_LEAD_COMMENT', 'sales_funnel_lead_comment');

/**
 * Воронка продаж: настройки создания лидов из звонков
 */
define('DB_SALES_FUNNEL_LEAD_CREATION_RULE', 'sales_funnel_lead_creation_rule');

/**
 * Воронка продаж: крон задания связанные с лидами
 */
define('DB_SALES_FUNNEL_LEAD_CRON_JOB', 'sales_funnel_lead_cron_job');

/**
 * Рейтинг сделок
 */
define('DB_SALES_FUNNEL_LEAD_DEALS_RATING', 'sales_funnel_lead_deals_rating');

/**
 * Направления лидов
 */
define('DB_SALES_FUNNEL_LEAD_DIRECTION', 'sales_funnel_lead_direction');

/**
 * Воронка продаж: lead_email
 */
define('DB_SALES_FUNNEL_LEAD_EMAIL', 'sales_funnel_lead_email');

/**
 * Черный список электронных почт из лидов
 */
define('DB_SALES_FUNNEL_LEAD_EMAIL_BLACKLIST', 'sales_funnel_lead_email_blacklist');

/**
 * воронка продаж: пометка отработавших триггеров бездействия для лидов
 */
define('DB_SALES_FUNNEL_LEAD_EXPIRATION_TRIGGER', 'sales_funnel_lead_expiration_trigger');

/**
 * Воронка продаж: файлы лидов
 */
define('DB_SALES_FUNNEL_LEAD_FILE', 'sales_funnel_lead_file');

/**
 * Воронка продаж: лог событий, связанных с лидами
 */
define('DB_SALES_FUNNEL_LEAD_LOG', 'sales_funnel_lead_log');

/**
 * Воронка продаж: причины событий в логе
 */
define('DB_SALES_FUNNEL_LEAD_LOG_REASON', 'sales_funnel_lead_log_reason');

/**
 * Воронка продаж: история движения лида по статусам
 */
define('DB_SALES_FUNNEL_LEAD_MOVEMENT_HISTORY', 'sales_funnel_lead_movement_history');

/**
 * Воронка продаж: типы стратегий поиска владельца для лида
 */
define('DB_SALES_FUNNEL_LEAD_OWNER_SEARCH_STRAT_TYPE', 'sales_funnel_lead_owner_search_strat_type');

/**
 * Воронка продаж: запросы на изменение владельцев лидов
 */
define('DB_SALES_FUNNEL_LEAD_OWNERSHIP_TRANSFER', 'sales_funnel_lead_ownership_transfer');

/**
 * Воронка продаж: статусы запросов на изменение владельцев лидов
 */
define('DB_SALES_FUNNEL_LEAD_OWNERSHIP_TRANSFER_STATE', 'sales_funnel_lead_ownership_transfer_state');

/**
 * Воронка продаж: телефоны лидов
 */
define('DB_SALES_FUNNEL_LEAD_PHONE', 'sales_funnel_lead_phone');

/**
 * Черный список телефонов из лидов
 */
define('DB_SALES_FUNNEL_LEAD_PHONE_BLACKLIST', 'sales_funnel_lead_phone_blacklist');

/**
 * Воронка продаж: значения булевых доп полей лидов
 */
define('DB_SALES_FUNNEL_LEAD_PROP_BOOL', 'sales_funnel_lead_prop_bool');

/**
 * Воронка продаж: категория доп свойств лида
 */
define('DB_SALES_FUNNEL_LEAD_PROP_CATEGORY', 'sales_funnel_lead_prop_category');

/**
 * Воронка продаж: значения доп полей лидов с датами
 */
define('DB_SALES_FUNNEL_LEAD_PROP_DATE', 'sales_funnel_lead_prop_date');

/**
 * Воронка продаж: значения доп полей типа набор строк для лидов
 */
define('DB_SALES_FUNNEL_LEAD_PROP_ENUM', 'sales_funnel_lead_prop_enum');

/**
 * Воронка продаж: каталог значений для доп полей типа набор строк
 */
define('DB_SALES_FUNNEL_LEAD_PROP_ENUM_CATALOG', 'sales_funnel_lead_prop_enum_catalog');

/**
 * воронка продаж: мульти набор строк
 */
define('DB_SALES_FUNNEL_LEAD_PROP_ENUM_MULTI', 'sales_funnel_lead_prop_enum_multi');

/**
 * Воронка продаж: значения дробных доп свойств лидов
 */
define('DB_SALES_FUNNEL_LEAD_PROP_FLOAT', 'sales_funnel_lead_prop_float');

/**
 * Воронка продаж: значения доп полей лидов с геоданными
 */
define('DB_SALES_FUNNEL_LEAD_PROP_GEO', 'sales_funnel_lead_prop_geo');

/**
 * Воронка продаж: значения целочисленных доп свойств лидов
 */
define('DB_SALES_FUNNEL_LEAD_PROP_INT', 'sales_funnel_lead_prop_int');

/**
 * Воронка продаж: доп свойства лида
 */
define('DB_SALES_FUNNEL_LEAD_PROP_SCHEMA', 'sales_funnel_lead_prop_schema');

/**
 * Воронка продаж: значения строковых доп полей лидов
 */
define('DB_SALES_FUNNEL_LEAD_PROP_STR', 'sales_funnel_lead_prop_str');

/**
 * Воронка продаж: каталог строковых значений доп полей лидов
 */
define('DB_SALES_FUNNEL_LEAD_PROP_STR_CATALOG', 'sales_funnel_lead_prop_str_catalog');

/**
 * Воронка продаж: значения множественных строковых доп полей лидов
 */
define('DB_SALES_FUNNEL_LEAD_PROP_STR_MULTI', 'sales_funnel_lead_prop_str_multi');

/**
 * Воронка продаж: типы полей для доп свойств лидов
 */
define('DB_SALES_FUNNEL_LEAD_PROP_TYPE', 'sales_funnel_lead_prop_type');

/**
 * Воронка продаж: значения доп полей лидов с url
 */
define('DB_SALES_FUNNEL_LEAD_PROP_URL', 'sales_funnel_lead_prop_url');

/**
 * Воронка продаж: связь лидов с сущностями системы(звонки, заявки и т.д.)
 */
define('DB_SALES_FUNNEL_LEAD_RELATION', 'sales_funnel_lead_relation');

/**
 * Воронка продаж: типы сущностей связанных с лидом
 */
define('DB_SALES_FUNNEL_LEAD_RELATION_TYPE', 'sales_funnel_lead_relation_type');

/**
 * Воронка продаж: теги лидов
 */
define('DB_SALES_FUNNEL_LEAD_TAG', 'sales_funnel_lead_tag');

/**
 * Воронка продаж: каталог тегов лидов
 */
define('DB_SALES_FUNNEL_LEAD_TAG_CATALOG', 'sales_funnel_lead_tag_catalog');

/**
 * Распределение сообщений с почтового сервера
 */
define('DB_SALES_FUNNEL_MAIL_SERVER_MESSAGE', 'sales_funnel_mail_server_message');

/**
 * воронки продаж, лиды которых нужно подтвердить при попадании в ОКК
 */
define('DB_SALES_FUNNEL_QUALITY_CONTROL_CONFIRM_FUNNELS', 'sales_funnel_quality_control_confirm_funnels');

/**
 * Данные отдела качества по лидам
 */
define('DB_SALES_FUNNEL_QUALITY_CONTROL_LEADS', 'sales_funnel_quality_control_leads');

/**
 * Воронка продаж: этапы сделок
 */
define('DB_SALES_FUNNEL_STAGE', 'sales_funnel_stage');

/**
 * Воронка продаж: типы дат для расчета
 */
define('DB_SALES_FUNNEL_STAGE_TIME_LIMIT_FROM_TYPE', 'sales_funnel_stage_time_limit_from_type');

/**
 * Воронка продаж: типы ограничения длительности этапов
 */
define('DB_SALES_FUNNEL_STAGE_TIME_LIMIT_TYPE', 'sales_funnel_stage_time_limit_type');

/**
 * Воронка продаж: триггеры для этапов сделок
 */
define('DB_SALES_FUNNEL_STAGE_TRIGGER', 'sales_funnel_stage_trigger');

/**
 * Воронка продаж: каталог событий для триггеров этапов
 */
define('DB_SALES_FUNNEL_STAGE_TRIGGER_COMMAND', 'sales_funnel_stage_trigger_command');

/**
 * Воронка продаж: каталог событий для триггеров этапов
 */
define('DB_SALES_FUNNEL_STAGE_TRIGGER_EVENT', 'sales_funnel_stage_trigger_event');

/**
 * Опросник: результаты опроса
 */
define('DB_SALES_FUNNEL_SURVEY_ANSWER', 'sales_funnel_survey_answer');

/**
 * Опросник: ответы данные в ходе опроса
 */
define('DB_SALES_FUNNEL_SURVEY_ANSWER_OPTION', 'sales_funnel_survey_answer_option');

/**
 * Опросник: список вопросов
 */
define('DB_SALES_FUNNEL_SURVEY_QUESTION', 'sales_funnel_survey_question');

/**
 * Опросник: варианты ответов на вопросы
 */
define('DB_SALES_FUNNEL_SURVEY_QUESTION_OPTION', 'sales_funnel_survey_question_option');

/**
 * Воронка продаж: пользовательские настройки отображения воронки
 */
define('DB_SALES_FUNNEL_USER_SETTINGS', 'sales_funnel_user_settings');

/**
 * План продаж на месяц для менеджеров
 */
define('DB_SALES_PLAN', 'sales_plan');

/**
 * Коэффициенты для пользователей в зависимости от плана продаж
 */
define('DB_SALES_PLAN_COEFFICIENTS', 'sales_plan_coefficients');

/**
 * Группы плана продаж
 */
define('DB_SALES_PLAN_GROUP', 'sales_plan_group');

/**
 * Привязка пользователя к группе плана продаж
 */
define('DB_SALES_PLAN_USER_GROUP', 'sales_plan_user_group');

/**
 * ссп: информация по календарным месяцам
 */
define('DB_SBP_CALENDAR_MONTH', 'sbp_calendar_month');

/**
 * ссп: сумма продолжительности звонков пол-лей по датам звонков
 */
define('DB_SBP_CALL', 'sbp_call');

/**
 * ссп: информация по закрытым отгрузкам
 */
define('DB_SBP_CLAIM', 'sbp_claim');

/**
 * ссп: связи клиентов и менеджеров разбитые по периодам
 */
define('DB_SBP_CLIENT_MANAGER', 'sbp_client_manager');

/**
 * ссп: обработанные менеджером клиенты
 */
define('DB_SBP_CLIENT_PROCESSED_BY_USER', 'sbp_client_processed_by_user');

/**
 * ссп: кол-ва выставленных пол-лем счетов, ревизии игнорируются, по дате создания
 */
define('DB_SBP_INVOICE', 'sbp_invoice');

/**
 * ссп:  флаг "Новые клиенты"
 */
define('DB_SBP_NEW_CLIENT', 'sbp_new_client');

/**
 * ссп: параметры для определения новых клиентов
 */
define('DB_SBP_NEW_CLIENT_PARAM', 'sbp_new_client_param');

/**
 * ссп: план на продолжительность звонков
 */
define('DB_SBP_PLAN_CALL_DURATION', 'sbp_plan_call_duration');

/**
 * ссп: план на отгрузки маркетинговых клиентов
 */
define('DB_SBP_PLAN_MARKETING_CLIENT_SALE', 'sbp_plan_marketing_client_sale');

/**
 * ссп: план на отгрузки постоянных клиентов
 */
define('DB_SBP_PLAN_REGULAR_CLIENT_SALE', 'sbp_plan_regular_client_sale');

/**
 * ссп: даты данные за которые нужно пересчитать
 */
define('DB_SBP_RECALC_DATE', 'sbp_recalc_date');

/**
 * ссп: закрытые лиды по датам закрытия
 */
define('DB_SBP_SALES_FUNNEL_LEAD_CLOSED', 'sbp_sales_funnel_lead_closed');

/**
 * ссп: новые лиды по датам создания
 */
define('DB_SBP_SALES_FUNNEL_LEAD_NEW', 'sbp_sales_funnel_lead_new');

/**
 * ссп: прибыль по пол-лю за день
 */
define('DB_SBP_TOTAL_REVENUE', 'sbp_total_revenue');

/**
 * список отложенных заданий: задания
 */
define('DB_SCHEDULED_TASK', 'scheduled_task');

/**
 * список отложенных заданий: статусы заданий
 */
define('DB_SCHEDULED_TASK_STATUS', 'scheduled_task_status');

/**
 * История изменения секций
 */
define('DB_SECTION_HISTORY', 'section_history');

/**
 * Товары для проверки по заданию выборочной инвентаризации
 */
define('DB_SELECTIVE_INVENTORY', 'selective_inventory');

/**
 * Доп пользователи, для которых нужно скрыть остатки на складе
 */
define('DB_SELECTIVE_INVENTORY_PARTICIPANT', 'selective_inventory_participant');

/**
 * Задания по выборочной инвентаризации
 */
define('DB_SELECTIVE_INVENTORY_TASK', 'selective_inventory_task');

/**
 * Задания для 1с
 */
define('DB_SERVICE1C_TASK', 'service1c_task');

/**
 * Ведомости
 */
define('DB_SHEET', 'sheet');

/**
 * Ведомость договоров
 */
define('DB_SHEET_CLIENT_TREATY', 'sheet_client_treaty');

/**
 * Список грузовых контейнеров
 */
define('DB_SHIPPING_CONTAINER', 'shipping_container');

/**
 * Связь грузовых контейнеров и транзакций кассы
 */
define('DB_SHIPPING_CONTAINER_CASH', 'shipping_container_cash');

/**
 * Связь грузовых контейнеров и запросов на оплату
 */
define('DB_SHIPPING_CONTAINER_PAYMENT', 'shipping_container_payment');

/**
 * Снимки, данные для склада, блокировки
 */
define('DB_SNAPSHOT_DEPOT_DATA_BLOCKS', 'snapshot_depot_data_blocks');

/**
 * Снимки, данные для склада, товары заявки
 */
define('DB_SNAPSHOT_DEPOT_DATA_CLAIM_PRODUCTS', 'snapshot_depot_data_claim_products');

/**
 * Снимки, данные для склада, поля заявки
 */
define('DB_SNAPSHOT_DEPOT_DATA_CLAIMS', 'snapshot_depot_data_claims');

/**
 * Название статусов для заявок
 */
define('DB_STATUS_TYPE', 'status_type');

/**
 * мотивация отдела снабжения: список отделов
 */
define('DB_SUPPLY_DEPARTMENT_SALARY_DEPARTMENT', 'supply_department_salary_department');

/**
 * мотивация отдела снабжения: связь отделов с отделами на других проектах
 */
define('DB_SUPPLY_DEPARTMENT_SALARY_DEPARTMENT_PROJECT', 'supply_department_salary_department_project');

/**
 * мотивация отдела снабжения: отчеты
 */
define('DB_SUPPLY_DEPARTMENT_SALARY_REPORT', 'supply_department_salary_report');

/**
 * мотивация отдела снабжения: детализация отчетов
 */
define('DB_SUPPLY_DEPARTMENT_SALARY_REPORT_DETAILED', 'supply_department_salary_report_detailed');

/**
 * мотивация отдела снабжения: детализвация прибыли по отделам по проектам
 */
define('DB_SUPPLY_DEPARTMENT_SALARY_REPORT_DETAILED_DEPARTMENT', 'supply_department_salary_report_detailed_department');

/**
 * мотивация отдела снабжения: статусы отчетов
 */
define('DB_SUPPLY_DEPARTMENT_SALARY_REPORT_STATUS', 'supply_department_salary_report_status');

/**
 * Таблица для хранения типов данных для синхронизации модуля "Внутренний учёт" с локальным проектом
 */
define('DB_SYNCHRONIZATION_CHANGED_DATA', 'synchronization_changed_data');

/**
 * Синхронизации между ВМК и локальными проектами
 */
define('DB_SYNCHRONIZER', 'synchronizer');

/**
 * Таблица с заданиями пользователей
 */
define('DB_TASKS', 'tasks');

/**
 * Условия для автоматического выполнения задачи
 */
define('DB_TASKS_STAFF_AUTO_CLOSE_REQUIREMENTS', 'tasks_staff_auto_close_requirements');

/**
 * Контекст прикрепленного файла
 */
define('DB_TASKS_STAFF_TASK_ATTACHMENT_SCOPE_TYPES', 'tasks_staff_task_attachment_scope_types');

/**
 * Прикрепленные к задаче файлы
 */
define('DB_TASKS_STAFF_TASK_ATTACHMENTS', 'tasks_staff_task_attachments');

/**
 * Условия для автоматического выполнения задачи (назначенные задаче)
 */
define('DB_TASKS_STAFF_TASK_AUTO_CLOSE_REQUIREMENTS', 'tasks_staff_task_auto_close_requirements');

/**
 * Типы решений по запросу
 */
define('DB_TASKS_STAFF_TASK_CHANGE_DEADLINE_DECISIONS', 'tasks_staff_task_change_deadline_decisions');

/**
 * Запросы о переносе срока
 */
define('DB_TASKS_STAFF_TASK_CHANGE_DEADLINE_REQUESTS', 'tasks_staff_task_change_deadline_requests');

/**
 * Связь комментариев с вложениями
 */
define('DB_TASKS_STAFF_TASK_COMMENT_ATTACHMENTS', 'tasks_staff_task_comment_attachments');

/**
 * Комментарии к задаче
 */
define('DB_TASKS_STAFF_TASK_COMMENTS', 'tasks_staff_task_comments');

/**
 * Типы исполнителей
 */
define('DB_TASKS_STAFF_TASK_EXECUTOR_TYPES', 'tasks_staff_task_executor_types');

/**
 * Исполнители задачи
 */
define('DB_TASKS_STAFF_TASK_EXECUTORS', 'tasks_staff_task_executors');

/**
 * Менеджер задач: наблюдатели задач
 */
define('DB_TASKS_STAFF_TASK_OBSERVERS', 'tasks_staff_task_observers');

/**
 * Менеджер задач: настройки модуля. Таблица должна содержать одну строку
 */
define('DB_TASKS_STAFF_TASK_SETTINGS', 'tasks_staff_task_settings');

/**
 * Статусы (этапы) задачи
 */
define('DB_TASKS_STAFF_TASK_STATES', 'tasks_staff_task_states');

/**
 * Задачи сотрудников
 */
define('DB_TASKS_STAFF_TASKS', 'tasks_staff_tasks');

/**
 * Получатели уведомлений в телеграм при изменении листов согласования
 */
define('DB_TELEGRAM_AGREEMENTLIST_RECIPIENT', 'telegram_agreementlist_recipient');

/**
 * Боты Telegram
 */
define('DB_TELEGRAM_BOTS', 'telegram_bots');

/**
 * Обратные вызовы для запросов из телеграмма
 */
define('DB_TELEGRAM_CALLBACK', 'telegram_callback');

/**
 * Телеграм каналы
 */
define('DB_TELEGRAM_CHANNELS', 'telegram_channels');

/**
 * Ссылки с приглашением в каналы
 */
define('DB_TELEGRAM_CHANNELS_INVITE_LINKS', 'telegram_channels_invite_links');

/**
 * Статусы пригласительных ссылок
 */
define('DB_TELEGRAM_CHANNELS_INVITE_LINKS_STATES', 'telegram_channels_invite_links_states');

/**
 * Сообщения отправленные в Telegram из разных модулей системы
 */
define('DB_TELEGRAM_CHANNELS_MODULES_MESSAGES', 'telegram_channels_modules_messages');

/**
 * Список событий для отправки сообщений
 */
define('DB_TELEGRAM_CHANNELS_MODULES_MESSAGES_EVENTS', 'telegram_channels_modules_messages_events');

/**
 * Типы каналов (для ERP)
 */
define('DB_TELEGRAM_CHANNELS_TYPES', 'telegram_channels_types');

/**
 * Участники каналов
 */
define('DB_TELEGRAM_CHANNELS_USERS', 'telegram_channels_users');

/**
 * Статусы пользователей в телеграм канале
 */
define('DB_TELEGRAM_CHANNELS_USERS_STATES', 'telegram_channels_users_states');

/**
 * получатели уведомлений при проверке клиентов на проблемы
 */
define('DB_TELEGRAM_PROBLEM_CLIENTS_RECIPIENT', 'telegram_problem_clients_recipient');

/**
 * Шаблоны документов
 */
define('DB_TEMPLATES_DOCS', 'templates_docs');

/**
 * Тикеты финансового суппорта
 */
define('DB_TICKET', 'ticket');

/**
 * ToDo добавить комментарий
 */
define('DB_TICKET_ANNOTATION', 'ticket_annotation');

/**
 * Дополнительный данные запроса
 */
define('DB_TICKET_DETAILS', 'ticket_details');

/**
 * Доп данные по тикетам "подтверждение габаритов"
 */
define('DB_TICKET_DIMENSION_CONFIRMATION', 'ticket_dimension_confirmation');

/**
 * Прикрепляемые файлы к тикетам финансового суппорта
 */
define('DB_TICKET_DOCUMENT', 'ticket_document');

/**
 * ToDo добавить комментарий
 */
define('DB_TICKET_EXPLANATORY_NOTE', 'ticket_explanatory_note');

/**
 * ToDo добавить комментарий
 */
define('DB_TICKET_HEAD_PERMISSION', 'ticket_head_permission');

/**
 * ToDo добавить комментарий
 */
define('DB_TICKET_HEAD_PERMISSION_VIEWED', 'ticket_head_permission_viewed');

/**
 * ToDo добавить комментарий
 */
define('DB_TICKET_MODIFIED_FIELDS', 'ticket_modified_fields');

/**
 * Тикеты в бухгалтерию, созданные без пояснительной записки с разрешения руководителя
 */
define('DB_TICKET_NOCONTRACT_DIRECTOR_APPROVAL', 'ticket_nocontract_director_approval');

/**
 * Запросы на оплату
 */
define('DB_TICKET_PAYMENT', 'ticket_payment');

/**
 * ToDo добавить комментарий
 */
define('DB_TICKET_PAYMENT_DETAILS', 'ticket_payment_details');

/**
 * История частичных оплат
 */
define('DB_TICKET_PAYMENT_PARTIAL_HISTORY', 'ticket_payment_partial_history');

/**
 * ToDo добавить комментарий
 */
define('DB_TICKET_SERVICE_NOTE', 'ticket_service_note');

/**
 * Связь тикетов "документы отдела снабжения" и планируемых платежей из cash_planned
 */
define('DB_TICKET_SUPPLY_DEPARTMENT_DOCUMENT', 'ticket_supply_department_document');

/**
 * Типы тикетов к финансовому суппорту
 */
define('DB_TICKET_TYPE', 'ticket_type');

/**
 * Просмотр тикетов финансового саппорта
 */
define('DB_TICKET_VIEWED', 'ticket_viewed');

/**
 * Уведомления о создании заявки на приход товара который в переизбытке
 */
define('DB_TONNAGE_CONTROL_NOTIFICATION', 'tonnage_control_notification');

/**
 * Детализация движения по складу
 */
define('DB_TONNAGE_DETAILS', 'tonnage_details');

/**
 * Связь процедур с типами заявок, для вычисления тоннажа
 */
define('DB_TONNAGE_PROCEDURE', 'tonnage_procedure');

/**
 * Каталог
 */
define('DB_TOTAL_PRICE_CATALOG', 'total_price_catalog');

/**
 * Файлы в позиции каталога
 */
define('DB_TOTAL_PRICE_CATALOG_FILES', 'total_price_catalog_files');

/**
 * Телефоны в позиции каталога
 */
define('DB_TOTAL_PRICE_CATALOG_PHONES', 'total_price_catalog_phones');

/**
 * Значения ТНВЭД из каталога (8477,9027)
 */
define('DB_TOTAL_PRICE_CATALOG_TNVED', 'total_price_catalog_tnved');

/**
 * Значения ТНВЭД, введённые вручную
 */
define('DB_TOTAL_PRICE_CATALOG_TNVED_TEXT', 'total_price_catalog_tnved_text');

/**
 * Активные валюты в модуле
 */
define('DB_TOTAL_PRICE_CURRENCIES', 'total_price_currencies');

/**
 * Заказы от менеджеров (продажников)
 */
define('DB_TOTAL_PRICE_MANAGERS_ORDERS', 'total_price_managers_orders');

/**
 * Заказы
 */
define('DB_TOTAL_PRICE_ORDERS', 'total_price_orders');

/**
 * Файлы в заказе
 */
define('DB_TOTAL_PRICE_ORDERS_FILES', 'total_price_orders_files');

/**
 * История изменения суммы заказа
 */
define('DB_TOTAL_PRICE_ORDERS_HISTORY', 'total_price_orders_history');

/**
 * Позиции в заказе
 */
define('DB_TOTAL_PRICE_ORDERS_POSITIONS', 'total_price_orders_positions');

/**
 * Ids найденных транзакций в кассе безнал
 */
define('DB_TOTAL_PRICE_ORDERS_TRANSACTIONS', 'total_price_orders_transactions');

/**
 * Тип воздействия транзакции(увеличение/уменьшение)
 */
define('DB_TR_TYPES', 'tr_types');

/**
 * Типы транзакций
 */
define('DB_TRANSACTION_TYPES', 'transaction_types');

/**
 * Требуемый тип машины
 */
define('DB_TRANSPORT_TYPES', 'transport_types');

/**
 * Таблица с должностями участвующими в производстве, для которых нужно добавить исполнителей
 */
define('DB_UNACCOUNTED_COST', 'unaccounted_cost');

/**
 * Распределение работы по исполнителям
 */
define('DB_UNACCOUNTED_COST_DISTRIBUTION', 'unaccounted_cost_distribution');

/**
 * Список товарок которые пользователь не может блокировать
 */
define('DB_UNBLOCK_DISABLE_LIST', 'unblock_disable_list');

/**
 * Список исключений из запрещенных для блокировки товаров
 */
define('DB_UNBLOCK_ENABLE_LIST', 'unblock_enable_list');

/**
 * Отчеты по разблокировке товаров
 */
define('DB_UNBLOCK_REPORT', 'unblock_report');

/**
 * Блокировки в отчетах по разблокировке товаров
 */
define('DB_UNBLOCK_REPORT_ITEMS', 'unblock_report_items');

/**
 * Единая базовая цена
 */
define('DB_UNIFIED_BASE_PRICE', 'unified_base_price');

/**
 * Данные о загрузке временных файлов в /uploads/tmp/
 */
define('DB_UPLOADS_TMP', 'uploads_tmp');

/**
 * Периоды отсутствия сотрудника на рабочем месте
 */
define('DB_USER_ABSENCE_PERIOD', 'user_absence_period');

/**
 * Список клиентов, к которым выезжал сотрудник за период
 */
define('DB_USER_ABSENCE_PERIOD_CLIENT', 'user_absence_period_client');

/**
 * Доп контакты пользователя
 */
define('DB_USER_ADDITIONAL_CONTACT', 'user_additional_contact');

/**
 * Счета пользователей
 */
define('DB_USER_BANK_ACCOUNT', 'user_bank_account');

/**
 * Уникальные варианты браузеров пользователей
 */
define('DB_USER_BROWSERS', 'user_browsers');

/**
 * Карточки клиента
 */
define('DB_USER_CARDS', 'user_cards');

/**
 * Гражданские договора пользователя
 */
define('DB_USER_CONTRACTS', 'user_contracts');

/**
 * Документы прикрепленные к пользователю
 */
define('DB_USER_DOCUMENT', 'user_document');

/**
 * Адреса электронной почты пользователей
 */
define('DB_USER_EMAIL', 'user_email');

/**
 * Названия файлов с основанием трудоустройства
 */
define('DB_USER_EMPLOYMENT_REASON', 'user_employment_reason');

/**
 * пользователи, включенные в расписание проверки на наличие ИП
 */
define('DB_USER_ENTERPRENEURSHIP_CHECK_SCHEDULE', 'user_enterpreneurship_check_schedule');

/**
 * События, связанные с пользователями
 */
define('DB_USER_EVENT', 'user_event');

/**
 * Превышение пользователями среднего кол-ва действий за день
 */
define('DB_USER_EVENT_ACTION_EXCESS', 'user_event_action_excess');

/**
 * Среднее кол-во событий сгенерированных пользователем за рабочий день
 */
define('DB_USER_EVENT_AVG_ACTION_AMOUNT', 'user_event_avg_action_amount');

/**
 * Подгружаемые файлы для пользователей
 */
define('DB_USER_FILES', 'user_files');

/**
 * Документы материальной ответственности
 */
define('DB_USER_MATERIAL_RESPONSIBILITY', 'user_material_responsibility');

/**
 * Онлайн статус пользователей
 */
define('DB_USER_ONLINE_STATUS', 'user_online_status');

/**
 * Таблица с со списком пропусков пользователей
 */
define('DB_USER_PASS', 'user_pass');

/**
 * Номера телефонов пользователей
 */
define('DB_USER_PHONE', 'user_phone');

/**
 * ToDo добавить комментарий
 */
define('DB_USER_PHONE_HISTORY', 'user_phone_history');

/**
 * Список ключей от помещений у пользователей
 */
define('DB_USER_PLACE_KEY', 'user_place_key');

/**
 * ToDo добавить комментарий
 */
define('DB_USER_PROJECTS', 'user_projects');

/**
 * Привязка регионального телефона к пользователю
 */
define('DB_USER_REGION_PHONE', 'user_region_phone');

/**
 * Доступы к электронным ресурсам
 */
define('DB_USER_RESOURCE_ACCESS', 'user_resource_access');

/**
 * Мотивация(формула расчета ЗП) пользователей
 */
define('DB_USER_SALARY_MOTIVATION', 'user_salary_motivation');

/**
 * Настройки пользователя
 */
define('DB_USER_SETTINGS', 'user_settings');

/**
 * Условия для статистики менеджеров
 */
define('DB_USER_STATISTICS_CONDITION', 'user_statistics_condition');

/**
 * Диапазоны условий для статистики пользователей
 */
define('DB_USER_STATISTICS_RANGE', 'user_statistics_range');

/**
 * Субъекты к которым привязываются условия для статистики менеджеров
 */
define('DB_USER_STATISTICS_SUBJECT', 'user_statistics_subject');

/**
 * Права для показа статистики менеджера
 */
define('DB_USER_STATISTICS_VIEW_ACCESS', 'user_statistics_view_access');

/**
 * ToDo добавить комментарий
 */
define('DB_USER_TARIFFS', 'user_tariffs');

/**
 * Тарифы интернета пользователей
 */
define('DB_USER_TARIFFS_INTERNET', 'user_tariffs_internet');

/**
 * Тарифы телефонов пользователей
 */
define('DB_USER_TARIFFS_PHONE', 'user_tariffs_phone');

/**
 * Оклады сотрудников
 */
define('DB_USER_WAGES', 'user_wages');

/**
 * Пользователи
 */
define('DB_USERS', 'users');

/**
 * Справочная таблица для обновления данных по пользователям
 */
define('DB_USERS_UPDATE_INFO', 'users_update_info');

/**
 * Отпуска
 */
define('DB_VACATIONS', 'vacations');

/**
 * Периоды отпуска
 */
define('DB_VACATIONS_PERIODS', 'vacations_periods');

/**
 * Файлы прикрепленные к периодам
 */
define('DB_VACATIONS_PERIODS_ATTACHMENT', 'vacations_periods_attachment');

/**
 * Связь периода с пользователем
 */
define('DB_VACATIONS_PERIODS_USERS', 'vacations_periods_users');

/**
 * Типы отпусков
 */
define('DB_VACATIONS_TYPES', 'vacations_types');

/**
 * Соответствия поставщиков
 */
define('DB_VENDORNAME', 'vendorname');

/**
 * Оклады за периоды
 */
define('DB_WAGE_PERIOD', 'wage_period');

/**
 * Учётные записи Яндекс 360
 */
define('DB_YANDEX_360_ACCOUNT', 'yandex_360_account');

/**
 * Организации
 */
define('DB_YANDEX_360_ORGANIZATION', 'yandex_360_organization');

/**
 * Домены организации
 */
define('DB_YANDEX_360_ORGANIZATION_DOMAIN', 'yandex_360_organization_domain');

/**
 * ToDo добавить комментарий
 */
define('DB_ZOHO_ACCOUNT', 'zoho_account');
