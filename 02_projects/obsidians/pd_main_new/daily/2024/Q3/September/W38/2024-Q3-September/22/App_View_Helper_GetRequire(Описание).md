---
author: Frolov Anatolui
date: 2024-09-22
time: 16:09:29
aliases: 
tags:
  - unique-note
  - amd
---


Этот код представляет собой класс `App_View_Helper_GetRequire`, который служит адаптером для работы с представлениями, используя функциональность класса `App_Require_MarkupHelper`. Весь класс настроен для упрощенного управления конфигурацией и отображением разметки в представлениях (views). Давайте подробно прокомментируем каждую часть.

```php
<?php

/**
 * {Template_Description_Abstract}
 * Описание шаблона (здесь шаблон для документации).
 *
 * @author Pak Ivan
 * Указывает автора кода.
 *
 * @date 14.03.2019
 * Дата создания.
 *
 * @copyright {Template_Description_Copyrights}
 * Информация об авторских правах.
 */

/**
 * Адаптер к App_Require_MarkupHelper для работы с представлениями
 * Class App_View_Helper_GetRequire
 * 
 * Этот класс является адаптером для работы с помощью App_Require_MarkupHelper.
 * Он предоставляет методы для установки и управления конфигурациями, необходимыми для отображения разметки в представлении.
 */
class App_View_Helper_GetRequire
{
    /**
     * @var App_Require_MarkupHelper
     * Экземпляр класса App_Require_MarkupHelper, который используется для работы с разметкой и конфигурацией.
     */
    protected $requireMarkupHelper;


    /**
     * App_View_Helper_Require constructor.
     * Конструктор класса, который создает экземпляр App_Require_MarkupHelper при создании объекта этого класса.
     */
    public function __construct()
    {
        // Инициализирует объект App_Require_MarkupHelper
        $this->requireMarkupHelper = new App_Require_MarkupHelper();
    }

    /**
     * Проверка на использование хелпера, чтобы понять, как грузить старые скрипты.
     * @return bool
     * Возвращает true, если путь data-main настроен, иначе false.
     */
    public function isActivated() : bool
    {
        // Проверяет, установлен ли путь для data-main
        return $this->requireMarkupHelper->getMainConfig()->getDataMainPath() > '';
    }

    /**
     * Устанавливает путь для data-main.
     * @param string $dataMainPath
     * @return $this
     * Возвращает текущий объект для цепочного вызова методов.
     */
    public function setDataMain(string $dataMainPath)
    {
        // Устанавливает путь data-main в конфигурации
        $this->requireMarkupHelper->getMainConfig()->setDataMainPath($dataMainPath);
        return $this;
    }

    /**
     * Устанавливает набор конфигураций для модуля.
     * @param string $moduleName
     * Название модуля.
     *
     * @param array $params
     * Параметры, передаваемые в конфигурацию.
     * 
     * @return $this
     * Возвращает текущий объект для цепочного вызова методов.
     */
    public function setParams(string $moduleName, array $params)
    {
        // Устанавливает имя модуля и параметры в основной конфигурации
        $this->requireMarkupHelper->getMainConfig()->setModuleName($moduleName)->setParams($params);
        return $this;
    }

    /**
     * Устанавливает параметры для дополнительной конфигурации.
     * @param string $moduleName
     * Название модуля.
     *
     * @param array $params
     * Параметры для модуля.
     * 
     * @return $this
     * @throws Exception
     * Бросает исключение в случае ошибки.
     */
    public function setSubParams(string $moduleName, array $params): self
    {
        // Создает новую конфигурацию модуля и добавляет её как подконфигурацию
        $moduleConfig = (new App_Require_ModuleConfig())->setModuleName($moduleName)->setParams($params);
        $this->requireMarkupHelper->addSubConfig($moduleConfig);

        return $this;
    }

    /**
     * Устанавливает отдельный параметр конфигурации.
     * @param string $paramName
     * Название параметра.
     *
     * @param $paramValue
     * Значение параметра.
     * 
     * @return $this
     */
    public function setParam(string $paramName, $paramValue)
    {
        // Устанавливает параметр в основной конфигурации
        $this->requireMarkupHelper->getMainConfig()->setParam($paramName, $paramValue);
        return $this;
    }

    /**
     * Устанавливает параметры для json_encode.
     * @param int $jsonEncodeParams
     * Параметры для кодировки в JSON.
     * 
     * @return $this
     */
    public function setJsonEncodeParams(int $jsonEncodeParams)
    {
        // Устанавливает параметры для кодирования данных в JSON
        $this->requireMarkupHelper->setJsonEncodeParams($jsonEncodeParams);
        return $this;
    }

    /**
     * Отображает разметку.
     * @return void
     */
    public function render()
    {
        // Выводит объект как строку (вызов __toString)
        echo $this;
    }

    /**
     * Добавляет новую дополнительную настройку.
     * @param string $moduleName
     * Название модуля.
     *
     * @param array $params
     * Параметры для модуля.
     * 
     * @return $this
     * @throws Exception
     */
    public function addSubConfig(string $moduleName, array $params)
    {
        // Создает и добавляет новую подконфигурацию
        $this->requireMarkupHelper->addSubConfig(
            (new App_Require_ModuleConfig)->setModuleName($moduleName)->setParams($params)
        );

        return $this;
    }

    /**
     * Возвращает конкретную дополнительную конфигурацию.
     * @param string $moduleName
     * Название модуля.
     * 
     * @return App_Require_ModuleConfig|null
     * Возвращает объект конфигурации модуля или null.
     */
    public function getSubConfig(string $moduleName)
    {
        // Получает подконфигурацию по имени модуля
        return $this->requireMarkupHelper->getSubConfig($moduleName);
    }

    /**
     * Возвращает текущий объект.
     * @return $this
     */
    public function getRequire()
    {
        // Возвращает текущий объект (для цепочных вызовов методов)
        return $this;
    }

    /**
     * Преобразует объект в строку.
     * @return string
     * Возвращает строковое представление объекта, вызывая рендер разметки.
     */
    public function __toString()
    {
        // Возвращает отрендеренную разметку как строку
        return $this->requireMarkupHelper->renderMarkup();
    }
}
```

### Описание ключевых моментов:

- **`App_View_Helper_GetRequire`** — это класс, который предоставляет интерфейс для работы с разметкой и конфигурацией с помощью `App_Require_MarkupHelper`. 
- **`$requireMarkupHelper`** — экземпляр класса `App_Require_MarkupHelper`, который управляет конфигурациями для отображения разметки.
- **Методы `setDataMain`, `setParams`, `setSubParams` и др.** — они позволяют настраивать конфигурации, параметры и модули для разметки.
- **Метод `render()`** — выводит разметку, используя механизм преобразования объекта в строку через метод `__toString()`.