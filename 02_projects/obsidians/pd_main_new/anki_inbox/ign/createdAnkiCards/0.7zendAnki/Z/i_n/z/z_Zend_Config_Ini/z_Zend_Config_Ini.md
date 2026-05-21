
#z_Zend_Config_Ini
#Zend_Config_Ini

#telegram 

# ### Zend_Config_Ini
<!-- basicblock-start oid="Obs5A5E6pOZAwcegzARnxBB1"  deck='z_Zend_Config_Ini' -->
### Zend_Config_Ini::


`Zend_Config_Ini` позволяет разработчикам хранить данные конфигурации в привычном формате INI и считывать их в приложении с использованием синтаксиса вложенных свойств объектов. Формат INI специально разработан для предоставления возможности иметь иерархию ключей конфигурационных данных и наследование между секциями конфигурации. Иерархии данных конфигурации поддерживаются разделением ключей точкой ("."). Секция может расширять или наследовать данные другой секции, добавляя к имени секции двоеточие (":") и имя секции, от которой следует наследование данных.

#### Примечание: Разбор файла INI
`Zend_Config_Ini` использует функцию PHP `parse_ini_file()`. Ознакомьтесь с документацией этой функции, чтобы быть в курсе её специфического поведения, которое также распространяется на `Zend_Config_Ini`, например, как обрабатываются специальные значения "TRUE", "FALSE", "yes", "no" и "NULL".

#### Примечание: Разделитель ключей
По умолчанию, символ-разделитель ключей — это точка ("."). Однако его можно изменить, изменив параметр `$options['nestSeparator']` при создании объекта `Zend_Config_Ini`. Например:

```
$options['nestSeparator'] = ':';
$config = new Zend_Config_Ini('/path/to/config.ini', 'staging', $options);
```

### Пример #1 Использование Zend_Config_Ini

Этот пример иллюстрирует базовое использование `Zend_Config_Ini` для загрузки данных конфигурации из файла INI. В этом примере есть конфигурационные данные как для производственной системы, так и для тестовой системы. Поскольку данные конфигурации тестовой системы очень похожи на данные для производственной, секция тестовой системы наследует данные из секции производственной. В данном случае решение является произвольным и могло быть написано наоборот, когда секция производственной системы наследует данные из тестовой секции, хотя это может не быть применимо для более сложных ситуаций. Предположим, что следующий файл конфигурации содержится в `/path/to/config.ini`:

```
; Конфигурационные данные производственного сайта
[production]
webhost                  = www.example.com
database.adapter         = pdo_mysql
database.params.host     = db.example.com
database.params.username = dbuser
database.params.password = secret
database.params.dbname   = dbname

; Конфигурационные данные тестовой системы наследуют от производственной и
; переопределяют значения по мере необходимости
[staging : production]
database.params.host     = dev.example.com
database.params.username = devuser
database.params.password = devsecret
```

Затем, предположим, что разработчику приложения нужно получить данные конфигурации тестовой системы из файла INI. Это просто сделать, указав файл INI и секцию тестовой системы:

```
$config = new Zend_Config_Ini('/path/to/config.ini', 'staging');

echo $config->database->params->host;   // выводит "dev.example.com"
echo $config->database->params->dbname; // выводит "dbname"
```

#### Примечание:
Параметры конструктора Zend_Config_Ini:

- **$filename**: Файл INI для загрузки.
- **$section**: Секция `[section]` внутри файла INI, которую нужно загрузить. Установка этого параметра в NULL загрузит все секции. В качестве альтернативы можно передать массив имен секций для загрузки нескольких секций.
- **$options (по умолчанию FALSE)**: Массив параметров. Поддерживаются следующие ключи:
  - **allowModifications**: Установите в TRUE, чтобы разрешить последующие изменения загруженных данных конфигурации в памяти. По умолчанию NULL.
  - **nestSeparator**: Установите символ, который будет использоваться в качестве разделителя для вложенных данных. По умолчанию это ".".

1. [`/claim/main/show => Claim_MainController::showAction`](file:///home/anatoluy/amd-docker-dev/data/www/lp/development/application/modules/claim/controllers/MainController.php)
2. [`/libdoc/ajax_offers_type1/get-actual-data => Libdoc_Ajax_Offers_Type1Controller::getActualDataAction`](file:///home/anatoluy/amd-docker-dev/data/www/lp/development/application/modules/libdoc/controllers/Ajax/Offers/Type1Controller.php)


<!-- basicblock-end -->



