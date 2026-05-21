
#ign_php
#php

#telegram 

# App_Form_AjaxForm_Factory::send(function (App_Form_AjaxForm_Form_AbstractForm $form)
<!-- basicblock-start  deck='ign_php' -->
App_Form_AjaxForm_Factory::send(function (App_Form_AjaxForm_Form_AbstractForm $form)::


Здесь $form - это что-то вроде $this с которым можно выполнять разные шутки
<!-- basicblock-end -->




#ign_php
#php

#telegram 

# Чтобы установить PHP как модуль Apache, нужно выполнить несколько шагов, которые зависят от операционной системы, которую вы используете. Вот общий процесс для Ubuntu/Debian и CentOS/RHEL:
<!-- basicblock-start  deck='ign_php' -->
Чтобы установить PHP как модуль Apache, нужно выполнить несколько шагов, которые зависят от операционной системы, которую вы используете. Вот общий процесс для Ubuntu/Debian и CentOS/RHEL:::


### Установка PHP как модуля Apache на Ubuntu/Debian

1.** Обновите список пакетов:**
  ```
   sudo apt update
   
```
2.** Установите Apache:**
   Если Apache еще не установлен, установите его:
  ```
   sudo apt install apache2
   
```
3.** Установите PHP и модуль Apache для PHP:**
   Это установит PHP и автоматически настроит его как модуль для Apache.
  ```
   sudo apt install php libapache2-mod-php
   
```
4.** Проверьте, что PHP модуль загружен:**
   Откройте файл конфигурации Apache для PHP:
  ```
   sudo nano /etc/apache2/mods-enabled/php7.*.conf
   
```   Убедитесь, что модуль загружен. Там должен быть параметр` LoadModule php7_module.`

5.** Перезапустите Apache, чтобы изменения вступили в силу:**
  ```
   sudo systemctl restart apache2
   
```
6.** Проверьте, работает ли PHP:**
   Создайте тестовый PHP-файл, например,` info.php` в каталоге` /var/www/html/:`
  ```
   echo "<?php phpinfo(); ?>" | sudo tee /var/www/html/info.php
   
```   Затем откройте в браузере` http://localhost/info.php.` Вы должны увидеть страницу с информацией о PHP.

### Установка PHP как модуля Apache на CentOS/RHEL

1.** Обновите список пакетов:**
  ```
   sudo yum update
   
```
2.** Установите Apache:**
   Если Apache еще не установлен, установите его:
  ```
   sudo yum install httpd
   
```
3.** Установите PHP и модуль Apache для PHP:**
   Это установит PHP и автоматически настроит его как модуль для Apache.
  ```
   sudo yum install php php-cli php-common
   
```
4.** Проверьте, что PHP модуль загружен:**
   Откройте файл конфигурации Apache для PHP (если необходимо):
  ```
   sudo nano /etc/httpd/conf/httpd.conf
   
```   Обычно это не требуется, так как модуль загружается автоматически при установке. Модуль PHP должен быть загружен с помощью директивы` LoadModule php_module.`

5.** Перезапустите Apache, чтобы изменения вступили в силу:**
  ```
   sudo systemctl restart httpd
   
```
6.** Проверьте, работает ли PHP:**
   Создайте тестовый PHP-файл, например,` info.php` в каталоге` /var/www/html/:`
  ```
   echo "<?php phpinfo(); ?>" | sudo tee /var/www/html/info.php
   
```   Затем откройте в браузере` http://localhost/info.php.` Вы должны увидеть страницу с информацией о PHP.

### Заключение

После выполнения этих шагов PHP будет установлен и работать как модуль Apache. Вы сможете запускать PHP-скрипты на вашем сервере, и они будут обрабатываться через Apache.
<!-- basicblock-end -->




#ign_php
#php

#telegram 

# Какой наилучший способ добавить новую зависимость ?
<!-- basicblock-start  deck='ign_php' -->
Какой наилучший способ добавить новую зависимость ?::


composer require
<!-- basicblock-end -->



