
#x_xdebug
#xdebug

#telegram 

# Как выглядит пример xdebug?
<!-- basicblock-start  deck='x_xdebug' -->
Как выглядит пример xdebug?::


```
zend_extension=xdebug.so
xdebug.remote_enable=1
xdebug.mode=debug
xdebug.start_with_request=yes
xdebug.client_host=host.docker.internal
xdebug.client_port=9003
xdebug.remote_port=9004
xdebug.log=/var/www/html/xdebug.log
xdebug.ide_key=PHPSTORM
```
<!-- basicblock-end -->




#x_xdebug
#xdebug

#telegram 

# Как выглядит установка xdebug?
<!-- basicblock-start  deck='x_xdebug' -->
Как выглядит установка xdebug?::


```
# Установка Xdebug версии 2.x
RUN pecl install xdebug-2.9.8 \
    && docker-php-ext-enable xdebug

# Конфигурация Xdebug
RUN echo "zend_extension=xdebug.so" > /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.remote_enable=1" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.remote_host=host.docker.internal" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.remote_port=9000" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.remote_autostart=1" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
```
<!-- basicblock-end -->



