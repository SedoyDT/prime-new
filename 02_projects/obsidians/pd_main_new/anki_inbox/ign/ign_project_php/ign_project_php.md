
#ign_project_php
#project_php

#telegram 

# ->query("SELECT `id` FROM `block_source` WHERE `free_values` LIKE ?", ["%\"userId\";i:{$userid};%"])
<!-- basicblock-start  deck='ign_project_php' -->
->query("SELECT `id` FROM `block_source` WHERE `free_values` LIKE ?", ["%\"userId\";i:{$userid};%"])::


Эта строка выполняет SQL-запрос, который ищет строки в таблице `block_source`, где поле `free_values` содержит значение, похожее на `userId`.

### Разбор запроса:
1. **`SELECT id`**: Запрос выбирает столбец `id` из таблицы. Это значит, что в результате выполнения запроса будут возвращены значения `id` всех строк, которые соответствуют критерию поиска.

2. **`FROM block_source`**: Указывает таблицу, из которой выполняется выборка (`block_source`).

3. **`WHERE free_values LIKE ?`**: Фильтрация строк на основе условия, что значение в столбце `free_values` должно соответствовать шаблону, указанному в параметре `LIKE`.

4. **`LIKE ?`**: Используется для поиска подстроки в поле `free_values`. Символ `?` здесь заменяется параметром, который передается в запросе (в данном случае `"%\"userId\";i:{$userid};%"`).

5. **`["%\"userId\";i:{$userid};%"]`**: Этот массив передает значение, которое заменяет `?` в запросе. Оно означает, что мы ищем строки, где `free_values` содержит текст, который включает:
   - `"userId"` — строка `"userId"` (обернутая в кавычки).
   - `i:{$userid}` — строка вида `i:<значение userId>`, где `<значение userId>` — это конкретное значение переменной `$userid`.
   - `%` — подстановочный символ SQL, который означает «любое количество символов». Он используется для указания того, что перед `"userId"` и после `i:<значение userId>` могут быть любые символы.

### Итог
Этот SQL-запрос выбирает `id` из таблицы `block_source` для всех записей, у которых поле `free_values` содержит подстроку, включающую `"userId"` с соответствующим значением `i:{$userid}`. 

Если, например, `free_values` хранит сериализованные данные или данные в формате JSON, то этот запрос ищет строки, где `userId` равен значению `$userid`.
<!-- basicblock-end -->




#ign_project_php
#project_php

#telegram 

# Чтобы воспользоваться встроенным в PHP веб-сервером для запуска проекта с такой структурой, вы можете использовать команду `php -S`. Вот как это можно сделать:
<!-- basicblock-start  deck='ign_project_php' -->
Чтобы воспользоваться встроенным в PHP веб-сервером для запуска проекта с такой структурой, вы можете использовать команду `php -S`. Вот как это можно сделать:::


### Запуск веб-сервера для `index.php` в корневой директории

1. Откройте терминал и перейдите в корневую директорию вашего проекта (там, где находится файл `index.php`).

   ```
   cd /path/to/your/project
   
```

2. Запустите PHP веб-сервер с указанием хоста и порта (например, `localhost:8000`):

   ```
   php -S localhost:8000
   
```

   Теперь веб-сервер запущен, и вы можете получить доступ к вашему `index.php`, открыв в браузере:

   ```

   http://localhost:8000/
   
```

### Доступ к файлам в подкаталогах

Для того чтобы получить доступ к файлам, расположенным в подкаталогах (`step1/alphabet.php`, `step1/index.php` и т.д.), просто добавьте путь к URL.

- **Для `step1/index.php`**:
  
  ```

  http://localhost:8000/step1/index.php
  
```

- **Для `step1/alphabet.php`**:
  
  ```

  http://localhost:8000/step1/alphabet.php
  
```

- **Для файлов в `step2` или `step3`**:

  ```

  http://localhost:8000/step2/README.md
  http://localhost:8000/step3/README.md
  
```

### Пример полного запуска и доступа

```
cd /path/to/your/project
php -S localhost:8000
```

После этого в браузере вы сможете получить доступ к различным файлам, просто добавляя нужный путь:

- **Корневой `index.php`**: `http://localhost:8000/`
- **`step1/index.php`**: `http://localhost:8000/step1/index.php`
- **`step1/alphabet.php`**: `http://localhost:8000/step1/alphabet.php`
- **`step2/README.md`**: `http://localhost:8000/step2/README.md`
- **`step3/README.md`**: `http://localhost:8000/step3/README.md`

### Пояснения:

- **`php -S`**: Команда для запуска встроенного веб-сервера PHP.
- **`localhost:8000`**: Хост и порт, на которых будет доступен сервер. Вы можете использовать любой другой свободный порт.
- **Пути в URL**: Соответствуют структуре директорий вашего проекта.

Теперь вы можете тестировать свои PHP-скрипты, как если бы они работали на полноценном веб-сервере.
<!-- basicblock-end -->




#ign_project_php
#project_php

#telegram 

# Функция `htmlspecialchars` сама по себе не удаляет и не заменяет неразрывные пробелы. Она предназначена для преобразования специальных символов (таких как `<`, `>`, `&`, `"`, и `'`) в HTML-сущности для защиты от XSS-атак.
<!-- basicblock-start  deck='ign_project_php' -->
Функция `htmlspecialchars` сама по себе не удаляет и не заменяет неразрывные пробелы. Она предназначена для преобразования специальных символов (таких как `<`, `>`, `&`, `"`, и `'`) в HTML-сущности для защиты от XSS-атак.::


Чтобы обработать неразрывные пробелы (`&nbsp;` или `\u00A0`) с помощью `htmlspecialchars`, можно применить дополнительную обработку строки перед или после вызова этой функции.

Вот как это можно сделать:

### 1. **Использование `str_replace` вместе с `htmlspecialchars`**
Вы можете заменить неразрывные пробелы на обычные пробелы до или после вызова `htmlspecialchars`:

#### Пример 1: Замена перед вызовом `htmlspecialchars`
```
$string = "Пример строки с неразрывными&nbsp;пробелами";

// Заменяем &nbsp; на обычный пробел
$string = str_replace('&nbsp;', ' ', $string);

// Применяем htmlspecialchars
$secure_string = htmlspecialchars($string);

echo $secure_string;
```

#### Пример 2: Замена после вызова `htmlspecialchars`
Если вам нужно сохранить HTML-сущности, но удалить неразрывные пробелы, сделайте это после обработки:
```
$string = "Пример строки с неразрывными&nbsp;пробелами";

// Применяем htmlspecialchars
$secure_string = htmlspecialchars($string);

// Удаляем неразрывные пробелы
$secure_string = str_replace('&nbsp;', ' ', $secure_string);

echo $secure_string;
```

### 2. **Если неразрывные пробелы представлены как символы**
Если неразрывные пробелы в строке представлены как `\u00A0` (код неразрывного пробела), можно заменить их на обычные пробелы:

```
$string = "Пример строки с неразрывными пробелами";

// Заменяем неразрывные пробелы на обычные пробелы
$string = str_replace("\u00A0", ' ', $string);

// Применяем htmlspecialchars
$secure_string = htmlspecialchars($string);

echo $secure_string;
```

### 3. **Удаление всех пробелов после `htmlspecialchars`**
Если вы хотите удалить все неразрывные пробелы после применения `htmlspecialchars`:

```
$string = "Пример строки с неразрывными пробелами";

// Применяем htmlspecialchars
$secure_string = htmlspecialchars($string);

// Удаляем неразрывные пробелы
$secure_string = str_replace("\u00A0", '', $secure_string);

echo $secure_string;
```

Таким образом, `htmlspecialchars` не управляет неразрывными пробелами, но вы можете использовать комбинацию с другими функциями для достижения нужного результата.
<!-- basicblock-end -->




#ign_project_php
#project_php

# [[App_Db_Abstract]]
<!-- basicblock-start  deck='ign_project_php' -->
[[App_Db_Abstract]]::

```php
<?php

class App_Db_Abstract extends Zend_Db_Table_Abstract
{
    /**
     * Выборка строк, ключом строки будет значение первой колонки
     * @param null $where Условия для выборки
     * @param int $fetch Как именно получать данные (например, ассоциативный массив)
     * @param null $dump Если не null, то отладочный вывод SQL-запроса
     * @return array Возвращает данные в виде ассоциативного массива
     */
    public function getRowsAssoc($where = null, $fetch = Zend_Db::FETCH_ASSOC, $dump = null)
    {
        $select = $this->select();

        // Проверка на наличие условий для выборки
        if (!is_null($where)) {
            // Конвертация условий в массив, если они не массив
            if (!is_array($where)) {
                $where = (array)$where;
            }
            // Перебираем условия и добавляем их к запросу
            foreach ($where as $key => $val) {
                if (is_numeric($key)) {
                    $select->where($val);
                } else {
                    $select->where($key, $val);
                }
            }
        }

        // Упорядочиваем результаты по первичному ключу
        $select->order($this->_primary);

        // Отладочный вывод SQL-запроса
        if ($dump) {
            Zend_Debug::dump($select->__toString(), 'sql : ');
        }

        // Выполняем запрос и возвращаем результат в виде ассоциативного массива
        return $this->_db->fetchAssoc($select);
    }

    /**
     * Получение записей по произвольному условию
     * @param array|string|null $where Условия для выборки
     * @param int $fetch Как именно получать данные (например, ассоциативный массив)
     * @param null $dump Если не null, то отладочный вывод SQL-запроса
     * @return array|false Возвращает данные в виде массива или false в случае ошибки
     */
    public function getRows($where = null, $fetch = Zend_Db::FETCH_ASSOC, $dump = null)
    {
        $select = $this->select();

        if (!is_null($where)) {
            if (!is_array($where)) {
                $where = (array)$where;
            }
            foreach ($where as $key => $val) {
                if (is_numeric($key)) {
                    $select->where($val);
                } else {
                    $select->where($key, $val);
                }
            }
        }

        if ($dump) {
            Zend_Debug::dump($select->__toString(), 'sql : ');
        }

        $stmt = $this->_db->query($select);
        $result = $stmt->fetchAll($fetch);
        return $result;
    }

    /**
     * Получение одной записи по произвольному условию
     * @param array|string $where Условия для выборки
     * @param int $fetch Как именно получать данные (например, ассоциативный массив)
     * @param null $dump Если не null, то отладочный вывод SQL-запроса
     * @return mixed Возвращает одну запись
     */
    public function getRow($where, $fetch = Zend_Db::FETCH_ASSOC, $dump = null)
    {
        $select = $this->select();

        if (!is_array($where)) {
            $where = (array)$where;
        }
        foreach ($where as $key => $val) {
            if (is_numeric($key)) {
                $select->where($val);
            } else {
                $select->where($key, $val);
            }
        }

        if ($dump) {
            Zend_Debug::dump($select->__toString(), 'sql : ');
        }

        $stmt = $this->_db->query($select);
        $result = $stmt->fetch($fetch);
        return $result;
    }

    /**
     * Получение значения конкретного поля
     * @param string $field Имя поля, значение которого нужно получить
     * @param array $where Условия для выборки
     * @param int $fetch Как именно получать данные (например, объект)
     * @return int|string|null Значение поля или null, если поле не найдено
     * @throws Exception
     */
    public function getRowField($field, array $where, $fetch = Zend_Db::FETCH_OBJ)
    {
        $select = $this->select()->from($this->_name, $field);
        
        if (!empty($where)) {::

            foreach ($where as $key => $val) {
                $select->where($key, $val);
            }
        }

        $row = $this->_db->query($select)->fetch($fetch);

        if (is_object($row) && property_exists($row, $field)) {
            return $row->{$field};
        } else if (is_array($row) && key_exists($field, $row)) {
            return $row[$field];
        }

        return null;
    }

    /**
     * Возвращает указанные поля записи
     * @param array $fields Список полей, которые нужно выбрать
     * @param array $where Условия для выборки
     * @param int $fetch Как именно получать данные (например, объект)
     * @param bool $lockInShareMode Использовать LOCK IN SHARE MODE или нет
     * @return mixed Возвращает запись с указанными полями
     * @throws Zend_Db_Statement_Exception
     */
    public function getRowFields(array $fields, array $where, $fetch = Zend_Db::FETCH_OBJ, bool $lockInShareMode = false)
    {
        $select = $this->select()->from($this->_name, $fields);

        if (!empty($where)) {
            foreach ($where as $key => $val) {
                $select->where($key, $val);
            }
        }

        return $this->_db->query($select->assemble() . ($lockInShareMode ? " LOCK IN SHARE MODE " : ""))->fetch($fetch);
    }

    /**
     * Возвращает значение конкретного поля из всех строк
     * @param string $field Имя поля
     * @param array $where Условия для выборки
     * @param array $order Порядок сортировки
     * @param int $fetch Как именно получать данные (например, список значений)
     * @return mixed Возвращает список значений поля
     * @throws Zend_Db_Statement_Exception
     */
    public function getRowsField(string $field, array $where = [], array $order = [], $fetch = Zend_Db::FETCH_COLUMN)
    {
        $select = $this->select()->from($this->_name, $field);

        if (!empty($where)) {
            foreach ($where as $key => $val) {
                $select->where($key, $val);
            }
        }

        if ($order) {
            $select->order($order);
        }

        return $this->_db->query($select)->fetchAll($fetch);
    }

    /**
     * Возвращает несколько полей из всех строк
     * @param array $fields Список полей
     * @param array $where Условия для выборки
     * @param array $order Порядок сортировки
     * @param int $fetch Как именно получать данные (например, объекты)
     * @return mixed Возвращает данные в виде массива
     * @throws Zend_Db_Statement_Exception
     */
    public function getRowsFields(array $fields, array $where = [], array $order = [], $fetch = Zend_Db::FETCH_OBJ)
    {
        $select = $this->select()->from($this->_name, $fields);

        if (!empty($where)) {
            foreach ($where as $key => $val) {
                $select->where($key, $val);
            }
        }

        if ($order) {
            $select->order($order);
        }

        return $this->_db->query($select)->fetchAll($fetch);
    }

    /**
     * Вставка записи или обновление, если запись уже существует
     * @param array $values Значения для вставки или обновления
     * @param bool $returnLastInsertId Вернуть ID последней вставленной записи
     * @return bool|string Возвращает результат выполнения или ID последней вставленной записи
     * @throws Exception
     */
    public function insertUpdate(array $values, $returnLastInsertId = false)
    {
        // Проверка на наличие значений для вставки/обновления
        if (empty($values)) {
            throw new \Exception('Не указаны значения для обновления');
        }

        // Проверка на наличие первичного ключа
        if (empty($this->_primary)) {
            throw new \Exception('В классе не инициализирован первичный ключ');
        }

        // Если первичный ключ массив, то используем его как есть, иначе оборачиваем в массив
        $primaryKey = is_array($this->_primary) ? $this->_primary : [$this->_primary];

        $updateParts = array();
        
                foreach ($values AS $fieldName => $fieldValue) {

            // Если значение NULL, используем специальный объект Zend_Db_Expr
            if (is_null($fieldValue)) {
                $fieldValue = new Zend_Db_Expr('NULL');
            }

            // Если поле - первичный ключ, не обновляем его, а используем для условия
            if (in_array($fieldName, $primaryKey)) {
                // Составляем условие
                $where[] = $this->getAdapter()->quoteInto("{$fieldName} = ?", $fieldValue);
                continue;
            }

            // Собираем данные для обновления
            $updateParts[$fieldName] = $fieldValue;
        }

        // Если нет условий для обновления, вставляем новую запись
        if (!isset($where)) {
            $result = $this->insert($values);
            if ($returnLastInsertId) {
                return $this->getAdapter()->lastInsertId();
            }
            return $result;
        }

        // Если есть условия, обновляем запись
        $this->update($updateParts, $where);
        return $returnLastInsertId ? $this->getAdapter()->lastInsertId() : true;
    }

    /**
     * Удаление записей по условиям
     * @param array|string $where Условия для удаления
     * @return int Возвращает количество удалённых записей
     * @throws Exception
     */
    public function deleteRows($where)
    {
        if (!is_array($where)) {
            $where = (array)$where;
        }

        if (empty($where)) {
            throw new \Exception('Не указаны условия для удаления записей');
        }

        return $this->delete($where);
    }

    /**
     * Удаление всех записей из таблицы
     * @return int Возвращает количество удалённых записей
     */
    public function deleteAll()
    {
        return $this->delete([]);
    }
}
```

<!-- basicblock-end -->




#ign_project_php
#project_php

# [[/public/index.php]]
<!-- basicblock-start  deck='ign_project_php' -->
/public/index.php::


```PHP

<?php

$begin = microtime(true);
// Засекает текущее время в начале выполнения скрипта для измерения времени выполнения.

if (getenv('DEVELOPMENT')) {
    error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_STRICT);
    // Если установена переменная окружения DEVELOPMENT, включаются все уровни сообщений об ошибках, кроме устаревших (E_DEPRECATED), уведомлений (E_NOTICE) и строгих стандартов (E_STRICT).
} else {
    error_reporting(E_ERROR);
    // Если переменная окружения DEVELOPMENT не установлена, включаются только фатальные ошибки (E_ERROR).
}

// Define path to application directory
defined('APPLICATION_PATH')
|| define('APPLICATION_PATH', realpath(dirname(__FILE__).'/../application'));
// Определяет константу APPLICATION_PATH, указывающую на путь к директории приложения. Если константа уже определена, она не будет изменена.

// Define application environment
defined('APPLICATION_ENV')
|| define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));
// Определяет константу APPLICATION_ENV, указывающую на среду приложения (например, 'development' или 'production'). Если переменная окружения APPLICATION_ENV установлена, её значение будет использовано; в противном случае будет установлено значение 'production'.

// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    realpath(APPLICATION_PATH.'/../library'),
    realpath(APPLICATION_PATH.'/../library/PEAR'),
    get_include_path(),
)));
// Обновляет include_path PHP, добавляя пути к библиотекам. Это позволяет PHP находить и загружать классы и файлы из указанных директорий.

/** Zend_Application */
require_once 'Zend/Application.php';
// Подключает основной класс Zend_Application из Zend Framework, который необходим для создания и запуска приложения.

// Create application, bootstrap, and run
$application = new Zend_Application(
    APPLICATION_ENV, // Среда приложения, определённая ранее (например, 'development' или 'production').
    APPLICATION_PATH.'/configs/application.ini' // Путь к файлу конфигурации приложения.
);
$application->bootstrap()->run();
// Создаёт экземпляр Zend_Application, выполняет инициализацию приложения (bootstrap) и запускает его выполнение.

$end = microtime(true);
$time = $end - $begin;
```
<!-- basicblock-end -->



