
#ZEND_Zend_Form
#Zend_Form
#zend 
#telegram 

# Форма - ничто без своих элементов. Zend_Form поставляется с некоторыми элементами по умолчанию, которые визуализируются XHTML через Zend_View helpers. Это следующие:
<!-- basicblock-start oid="Obs28x1C8u2XQzCd0fMyNmc3"  deck='ZEND_Zend_Form' -->
Форма - ничто без своих элементов. Zend_Form поставляется с некоторыми элементами по умолчанию, которые визуализируются XHTML через Zend_View helpers. Это следующие:::


button

checkbox (or many checkboxes at once with multiCheckbox)

hidden

image

password

radio

reset

select (both regular and multi-select types)

submit

text

textarea
<!-- basicblock-end -->




#ZEND_Zend_Form
#Zend_Form

#telegram 

# Вы можете установить дополнительные HTML атрибуты для тега <form> с помощью команды
<!-- basicblock-start oid="ObsEB6dZ5m5eECXmrglG4Is1"  deck='ZEND_Zend_Form' -->
Вы можете установить дополнительные HTML атрибуты для тега <form> с помощью команды::


setAttrib() или setAttribs() методы. Например, если вы хотите установить идентификатор, установите "ID" атрибут:
$form->setAttrib('id', 'логин');
<!-- basicblock-end -->




#ZEND_Zend_Form
#Zend_Form

#telegram 

# Если вы хотите указать действие формы и метод (всегда хорошие идеи), вы можете сделать это с помощью 
<!-- basicblock-start oid="ObsLCwhtDVFeaCLcxkmrKu0o"  deck='ZEND_Zend_Form' -->
Если вы хотите указать действие формы и метод (всегда хорошие идеи), вы можете сделать это с помощью ::


setAction() и setMethod() средств доступа:

$form->setAction('/ресурс / процесс')
->setMethod('post');
<!-- basicblock-end -->




#ZEND_Zend_Form
#Zend_Form

#telegram 

# Что такое Zend_Form?
<!-- basicblock-start oid="ObsU32wg8hmZhGwCuP0zYCMv"  deck='ZEND_Zend_Form' -->
Что такое Zend_Form?::


Zend_Form упрощает создание форм и их обработку в вашем веб-приложении. Он выполняет следующие задачи:

Фильтрация и проверка входных данных элементов

Упорядочивание элементов

Отрисовка элементов и форм, включая экранирование

Группировка элементов и форм

Конфигурация на уровне элементов и форм

Zend_Form использует несколько компонентов Zend Framework для достижения своих целей, включая Zend_Config, Zend_Validate, Zend_Filter, Zend_Loader_PluginLoader и, необязательно, Zend_View.
<!-- basicblock-end -->



