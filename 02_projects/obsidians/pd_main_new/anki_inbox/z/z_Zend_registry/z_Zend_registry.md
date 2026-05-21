
#z_Zend_registry
#Zend_registry

#telegram 

# - Используйте наследование: `class My_Form_User extends Zend_Form`
<!-- basicblock-start oid="Obs0hNexP86vnmnjqebm9akq"  deck='z_Zend_registry' -->
- Используйте наследование: `class My_Form_User extends Zend_Form`::

- Для повторяющихся форм используйте свой `Collection2` или `Zend_Form_SubForm`
- Если проект новый — рассмотрите использование `Laminas\Form` или `Symfony\Component\Form`
- Для миграции с ZF1 на современные версии: [Laminas Project](https://getlaminas.org/)

---

Хочешь пример формы с вашим `Collection2`?  
Или пример работы с JS для динамического добавления полей?
<!-- basicblock-end -->




#z_Zend_registry
#Zend_registry

#telegram 

# Работа с `Zend_Form` — это часть старой библиотеки Zend Framework 1, которая всё ещё используется в legacy-проектах. Ниже приведено **пошаговое руководство**, как работать с `Zend_Form`, создавать формы, добавлять элементы, валидировать и отображать.
<!-- basicblock-start oid="ObsVtEB32cclzRhgviITHNo7"  deck='z_Zend_registry' -->
Работа с `Zend_Form` — это часть старой библиотеки Zend Framework 1, которая всё ещё используется в legacy-проектах. Ниже приведено **пошаговое руководство**, как работать с `Zend_Form`, создавать формы, добавлять элементы, валидировать и отображать.::


---

## 🧱 Основные понятия

| Термин | Описание |
|-------|----------|
| `Zend_Form` | Класс, представляющий всю форму. |
| `Zend_Form_Element_*` | Базовые типы полей: текст, пароль, чекбокс и т.д. |
| `Validator` | Проверяет данные (например, Email, NotEmpty, Regex). |
| `Filter` | Обрабатывает значения до валидации (например, StringTrim, Int). |
| `DisplayGroup` | Группирует элементы для вывода. |
| `Decorator` | Настройка отображения HTML формы. *(Устарело в новых фреймворках)* |

---

## ✅ Пример создания простой формы

```
class My_Form_Login extends Zend_Form
{
    public function init()
    {
        // Установить метод отправки
        $this->setMethod('post');

        // Добавить поля
        $this->addElement('text', 'email', [
            'label'      => 'Email:',
            'required'   => true,
            'filters'    => ['StringTrim'],
            'validators' => [
                ['EmailAddress', true],
                ['NotEmpty', true]
            ]
        ]);

        $this->addElement('password', 'password', [
            'label'      => 'Пароль:',
            'required'   => true,
            'validators' => [
                ['StringLength', false, ['min' => 6]]
            ]
        ]);

        // Кнопка отправки
        $this->addElement('submit', 'submit', [
            'label' => 'Войти'
        ]);
    }
}
```

---

## 🔁 Использование формы в контроллере

```
public function loginAction()
{
    $form = new My_Form_Login();

    if ($this->_request->isPost()) {
        $data = $this->_request->getPost();

        if ($form->isValid($data)) {
            // Данные корректны
            $values = $form->getValues();
            // ... обработка ...
        } else {
            // Вывести ошибки
            foreach ($form->getMessages() as $message) {
                echo $message . '<br>';
            }
        }
    }

    $this->view->form = $form;
}
```

---

## 🖼 Отображение формы в шаблоне (`.phtml`)

```
<?php echo $this->form ?>
```

Или поэлементно:

```
<?php echo $this->form->getElement('email') ?>
<?php echo $this->form->getElement('password') ?>
<?php echo $this->form->getElement('submit') ?>
```

---

## 📦 Работа с коллекциями (`Collection2`)

Если вы используете ваш класс `Collection2`, вот как его можно использовать:

### 1. Создание дочернего блока

```
$stageElement = new Zend_Form_Element_Text('id');
$stageElement->setLabel('Stage ID')
             ->addValidator('Int')
             ->setRequired(true);

$stageCollection = new Collection2('selectedStage');
$stageCollection->addElement($stageElement)
                ->setMin(1)
                ->setMax(5);
```

### 2. Добавление коллекции в основную форму

```
$funnelId = new Zend_Form_Element_Hidden('funnelId');

$userForm = new Zend_Form();
$userForm->addElement($funnelId)
         ->addElement($stageCollection);
```

---

## 🛡 Валидация

```
if ($userForm->isValid($_POST)) {
    $values = $userForm->getValues();
    print_r($values);
} else {
    print_r($userForm->getMessages());
}
```

---

## 🎨 Декораторы (необязательно)

Для кастомного вывода HTML:

```
$element->setDecorators([
    'ViewHelper',
    'Errors',
    ['Label', ['tag' => 'div']],
    ['HtmlTag', ['tag' => 'div', 'class' => 'form-group']]
]);
```

---

## 📦 Полезные ссылки

- [Zend Framework 1 Documentation](https://framework.zend.com/manual/1.12/en/)
- [Zend_Form](https://framework.zend.com/manual/1.12/en/zend.form.forms.html)
- [Validators](https://framework.zend.com/manual/1.12/en/zend.validate.introduction.html)
- [Filters](https://framework.zend.com/manual/1.12/en/zend.filter.introduction.html)

---

## 💡 Советы
<!-- basicblock-end -->



