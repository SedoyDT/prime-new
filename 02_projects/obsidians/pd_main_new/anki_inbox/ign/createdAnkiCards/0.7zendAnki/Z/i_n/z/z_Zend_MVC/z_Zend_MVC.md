
#z_Zend_MVC
#Zend_MVC

#telegram 

# Библиотеки и логика
<!-- basicblock-start oid="ObsQ17aoKWQqk4zrznVoHbX7"  deck='z_Zend_MVC' -->
Библиотеки и логика::

Внешние библиотеки (Zend, Composer, Pear, PHPExcel) и часть логики находится по пути /library
Часть логики приложения находится в папке /library/App
в этой папке можно использовать наименование классов PSR-4 c корнем /library
пр: \App\Example\ConcreteClass => /library/App/Example/ConcreteClass.php
<!-- basicblock-end -->




#z_Zend_MVC
#Zend_MVC

#telegram 

# Что можно сказать про обработку url в проекте?
<!-- basicblock-start oid="ObsnDHLK6io6yyVb0aYpMpUy"  deck='z_Zend_MVC' -->
Что можно сказать про обработку url в проекте?::


Если маршрут специально не описан в конфиге routers.ini или не добавлен в файлах Bootstrap.php, то диспетчер ZF будет искать обработчик по пути /<module>/<controller>/[action=index]. Если controller содержит _, то путь будет обработан согласно PSR-0

Пр.:

/claim/main/show => Claim_MainController::showAction
/libdoc/ajax_offers_type1/get-actual-data => Libdoc_Ajax_Offers_Type1Controller::getActualDataAction
<!-- basicblock-end -->




#z_Zend_MVC
#Zend_MVC

#telegram 

# Загрузчик классов ZF меняет часть имени классов на псевдонимы:
<!-- basicblock-start oid="Obsu0nMVMiltIGsT93qjftyg"  deck='z_Zend_MVC' -->
Загрузчик классов ZF меняет часть имени классов на псевдонимы:::


Model => models
ExampleModule_Model_User будет искать по пути /application/modules/example-module/models/User.php
Пр.: Cash_Model_Abstract => /application/modules/cash/models/Abstract.php

Controller => controllers
ExampleModule_UserController будет искать по пути /application/modules/example-module/controllers/UserController.php
Пр.: Cash_CashController => /application/modules/cash/controllers/CashController.php

Form => forms
ExampleModule_Form_User будет искать по пути /application/modules/example-module/forms/User.php
Пр.: Cash_Form_Abstract => /application/modules/cash/forms/Abstract.php
<!-- basicblock-end -->




#z_Zend_MVC
#Zend_MVC

#telegram 

# ```
<!-- basicblock-start oid="ObsMnvhn5jV69zt9sNx2wDPu"  deck='z_Zend_MVC' -->
```::

-- основной каталог приложения application
-- модули лежат в каталоге modules
-- папка модуля именуется в kebab-case
-- в папке модуля должен находится файл Bootstrap.php(<module-dir>/Bootstrap.php) с классом
<ModuleDir>_Bootstrap.php extends Zend_Application_Module_Bootstrap
```
<!-- basicblock-end -->




#z_Zend_MVC
#Zend_MVC

#telegram 

# Основные моменты Zend MVC:
<!-- basicblock-start oid="Obs2lx8VyYY4T6y2yzeZHiSo"  deck='z_Zend_MVC' -->
Основные моменты Zend MVC:::


основной каталог приложения application
модули лежат в каталоге modules
папка модуля именуется в kebab-case
в папке модуля должен находится файл Bootstrap.php(<module-dir>/Bootstrap.php) с классом
<ModuleDir>_Bootstrap.php extends Zend_Application_Module_Bootstrap
<!-- basicblock-end -->




#z_Zend_MVC
#Zend_MVC

#telegram 

# В паттерне Model-View-Controller (MVC) три основных компонента работают вместе, чтобы разделить логику приложения на отдельные, управляемые части. Вот краткое описание каждого компонента:
<!-- basicblock-start oid="ObsD3hWy9UzAund6HYxgkc2a"  deck='z_Zend_MVC' -->
В паттерне Model-View-Controller (MVC) три основных компонента работают вместе, чтобы разделить логику приложения на отдельные, управляемые части. Вот краткое описание каждого компонента:::


### 1. **Модель (Model)**

- **Назначение**: Модель отвечает за основные функциональные возможности приложения, такие как доступ к данным и бизнес-логику. Она определяет, как данные хранятся и обрабатываются, а также взаимодействует с источниками данных (например, базами данных).
- **Функции**:
  - Определение структуры данных и методов для доступа к ним.
  - Реализация бизнес-логики, связанной с данными.
  - Выполнение операций CRUD (создание, чтение, обновление, удаление).
- **Пример**: В приложении книги отзывов модель может включать методы для получения записей из базы данных, добавления новых записей, их удаления и обновления.

### 2. **Представление (View)**

- **Назначение**: Представление определяет, что будет отображаться пользователю. Оно отвечает за форматирование данных и их представление в удобной для пользователя форме. Представления могут также собирать данные от пользователя (например, через формы).
- **Функции**:
  - Отображение данных пользователю.
  - Формирование HTML-кода и других форматов для вывода информации.
  - Получение пользовательского ввода через формы.
- **Пример**: В приложении книги отзывов представление может включать HTML-шаблоны, которые отображают список отзывов, форму для добавления нового отзыва и другую информацию.

### 3. **Контроллер (Controller)**

- **Назначение**: Контроллер связывает модель и представление, управляя логикой приложения и выбором представлений. Он обрабатывает запросы от пользователя, взаимодействует с моделью для получения данных и выбирает подходящее представление для отображения.
- **Функции**:
  - Управление запросами пользователя и выбор подходящего действия.
  - Взаимодействие с моделью для получения и обработки данных.
  - Передача данных в представление и выбор того, какое представление использовать.
  - Определение следующего шага, возможно, передача управления другому контроллеру.
- **Пример**: В приложении книги отзывов контроллер может обрабатывать запросы на добавление новых отзывов, извлечение существующих отзывов и выбор представления для отображения этих данных.

### Принцип работы MVC на примере

Для создания простого приложения книги отзывов с использованием MVC, каждый компонент выполняет свои функции:

- **Модель**:
  ```
  class Application_Model_DbTable_Guestbook extends Zend_Db_Table_Abstract
  {
      protected $_name = 'guestbook';
  }
  
```

- **Представление**:
  ```
  <!-- В файле application/views/scripts/guestbook/index.phtml -->
  <h1>Guestbook Entries</h1>
  <ul>
      <?php foreach ($this->entries as $entry): ?>
          <li><?php echo htmlspecialchars($entry->message); ?></li>
      <?php endforeach; ?>
  </ul>
  
```

- **Контроллер**:
  ```
  class GuestbookController extends Zend_Controller_Action
  {
      public function init()
      {
          $this->_helper->layout()->setLayout('main');
      }

      public function indexAction()
      {
          $guestbookTable = new Application_Model_DbTable_Guestbook();
          $this->view->entries = $guestbookTable->fetchAll();
      }

      public function addAction()
      {
          if ($this->_request->isPost()) {
              $data = $this->_request->getPost();
              $guestbookTable = new Application_Model_DbTable_Guestbook();
              $guestbookTable->insert($data);
              $this->_redirect('/guestbook');
          }
      }
  }
  
```

### Заключение

Паттерн MVC помогает структурировать приложения, разделяя логику, представление и управление. Это упрощает разработку и поддержку приложений, обеспечивая четкое разделение ответственности между компонентами и позволяя их независимое изменение и тестирование.
<!-- basicblock-end -->




#z_Zend_MVC
#Zend_MVC

#telegram 

# Zend Framework (теперь известный как Laminas Project) — это открытый объектно-ориентированный фреймворк для разработки веб-приложений на PHP. Он предоставляет мощную и гибкую основу для создания веб-приложений и включает в себя множество компонентов, которые могут быть использованы как самостоятельно, так и вместе.
<!-- basicblock-start oid="ObslrTFZa6OUDAt14hbtaWOv"  deck='z_Zend_MVC' -->
Zend Framework (теперь известный как Laminas Project) — это открытый объектно-ориентированный фреймворк для разработки веб-приложений на PHP. Он предоставляет мощную и гибкую основу для создания веб-приложений и включает в себя множество компонентов, которые могут быть использованы как самостоятельно, так и вместе.::


### Основные компоненты Zend Framework

1. **Zend_Controller**
   - **Назначение**: Управляет маршрутизацией запросов и контроллерами. Реализует шаблон Model-View-Controller (MVC), разделяя логику приложения, представление и обработку пользовательского ввода.
   - **Использование**: Настройка маршрутизации запросов и обработка их с помощью контроллеров.

2. **Zend_Layout**
   - **Назначение**: Управляет макетами и шаблонами представлений. Позволяет разделить HTML-код на отдельные части (например, заголовок, основной контент, подвал).
   - **Использование**: Создание и использование макетов для обертки ваших представлений.

3. **Zend_Config**
   - **Назначение**: Обеспечивает поддержку конфигурации из различных источников (файлы, базы данных, и т.д.). Поддерживает разные форматы конфигурации, такие как INI, XML и JSON.
   - **Использование**: Загрузка и управление конфигурационными параметрами вашего приложения.

4. **Zend_Db**
   - **Назначение**: Предоставляет средства для работы с базами данных. Включает поддержку различных баз данных и функций работы с ними.
   - **Использование**: Выполнение SQL-запросов и управление подключениями к базам данных.

5. **Zend_Db_Table**
   - **Назначение**: Абстракция для работы с таблицами баз данных, позволяющая работать с таблицами как с объектами.
   - **Использование**: Создание моделей для таблиц базы данных, выполнение операций CRUD (Create, Read, Update, Delete).

6. **Zend_Registry**
   - **Назначение**: Предоставляет механизм для хранения и получения глобальных объектов и конфигураций.
   - **Использование**: Хранение и доступ к общим объектам, таким как конфигурация, база данных и другие ресурсы.

### Пример создания простого приложения

Чтобы создать простое приложение для книги отзывов с использованием компонентов Zend Framework, вам понадобятся следующие шаги:

1. **Настройка и установка Zend Framework**
   - Установите Zend Framework с помощью Composer или загрузите его из официального репозитория.

2. **Создание конфигурации**
   - Настройте файлы конфигурации, используя `Zend_Config` для управления настройками приложения.

3. **Настройка маршрутизации и контроллеров**
   - Используйте `Zend_Controller` для настройки маршрутизации запросов и создания контроллеров.

4. **Создание модели и работы с базой данных**
   - Используйте `Zend_Db` и `Zend_Db_Table` для создания моделей и взаимодействия с базой данных.

5. **Разработка представлений и макетов**
   - Настройте `Zend_Layout` для работы с макетами и создайте представления для отображения данных пользователям.

### Пример кода

Пример создания простого контроллера для добавления записи в книгу отзывов:

```
// В файле application/controllers/GuestbookController.php
class GuestbookController extends Zend_Controller_Action
{
    public function init()
    {
        $this->_helper->layout()->setLayout('main');
    }

    public function indexAction()
    {
        $guestbookTable = new Application_Model_DbTable_Guestbook();
        $this->view->entries = $guestbookTable->fetchAll();
    }

    public function addAction()
    {
        if ($this->_request->isPost()) {
            $data = $this->_request->getPost();
            $guestbookTable = new Application_Model_DbTable_Guestbook();
            $guestbookTable->insert($data);
            $this->_redirect('/guestbook');
        }
    }
}
```

Пример модели для таблицы `guestbook`:

```
// В файле application/models/DbTable/Guestbook.php
class Application_Model_DbTable_Guestbook extends Zend_Db_Table_Abstract
{
    protected $_name = 'guestbook';
}
```

Пример представления для отображения записей:

```
<!-- В файле application/views/scripts/guestbook/index.phtml -->
<h1>Guestbook Entries</h1>
<ul>
    <?php foreach ($this->entries as $entry): ?>
        <li><?php echo htmlspecialchars($entry->message); ?></li>
    <?php endforeach; ?>
</ul>
```

### Резюме
<!-- basicblock-end -->



