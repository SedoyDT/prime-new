#amd-files

#amd-files

```PHP
# Используем образ PHP 7.2 с Apache
FROM php:7.2-apache

# Обновляем пакеты и устанавливаем необходимые библиотеки
RUN apt-get update && \
   apt-get install -y \
        zlib1g-dev libpng-dev \       # Библиотеки для работы с изображениями
        libcurl4-gnutls-dev \          # Библиотека для работы с cURL
        libxml2-dev \                  # Библиотека для работы с XML
        unzip \                        # Утилита для распаковки zip-архивов
        ghostscript                    # Утилита для работы с PDF и PostScript

# Устанавливаем PHP расширения
RUN docker-php-ext-install mysqli pdo pdo_mysql # Поддержка работы с MySQL
RUN docker-php-ext-install mbstring              # Поддержка многобайтовых строк
RUN docker-php-ext-install gd                    # Библиотека для работы с изображениями
RUN docker-php-ext-install zip                   # Поддержка zip-архивов
RUN docker-php-ext-install xml                   # Поддержка XML
RUN docker-php-ext-install curl                  # Поддержка cURL
RUN docker-php-ext-install iconv                 # Поддержка конвертации кодировок
RUN docker-php-ext-install bcmath                # Библиотека для работы с большими числами

# Установка расширения Memcache
RUN curl -sSL -o php7.zip https://github.com/websupport-sk/pecl-memcache/archive/php7.zip && \
    unzip php7.zip && \                          # Распаковываем архив
    rm php7.zip && \                            # Удаляем архив после распаковки
    mkdir -p /usr/src/php/ext && \              # Создаем каталог для расширений
    mv pecl-memcache-php7 /usr/src/php/ext/memcache && \
    echo "extension=memcache.so" > /usr/local/etc/php/conf.d/ext-memcache.ini # Конфигурируем Memcache
RUN docker-php-ext-install memcache              # Устанавливаем расширение Memcache

# Установка расширения Imagick для обработки изображений
RUN apt-get install -y libmagickwand-dev --no-install-recommends # Установка библиотеки ImageMagick
RUN printf "\n" | pecl install imagick         # Установка расширения Imagick через PECL
RUN docker-php-ext-enable imagick               # Включаем расширение Imagick

# Установка библиотеки GMP для работы с большими числами
RUN apt-get install -y libgmp-dev               # Установка библиотеки GMP
RUN docker-php-ext-install gmp                  # Установка расширения GMP

# Установка расширения IMAP для работы с почтовыми протоколами
RUN apt-get install -y libc-client-dev libkrb5-dev && \ # Установка необходимых библиотек
    docker-php-ext-configure imap --with-kerberos --with-imap-ssl && \ # Конфигурация IMAP
    docker-php-ext-install imap                  # Установка расширения IMAP
RUN docker-php-ext-enable imap                   # Включаем расширение IMAP

# Очистка
#RUN apt-get clean
#RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /var/cache/*

# Создаем новый слой на основе php:7.2-apache
FROM php:7.2-apache

# Установка временной зоны
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN printf '[PHP]\ndate.timezone = "${TZ}"\n' > /usr/local/etc/php/conf.d/tzone.ini

# Установка дополнительных библиотек
RUN apt-get update && \
    apt-get install -y --no-install-recommends unzip ghostscript libmagickwand-6.q16-6 libc-client2007e && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /var/cache/*

# Копируем расширения и конфигурации из первого слоя
COPY --from=0 /usr/local/lib/php/extensions /usr/local/lib/php/extensions
COPY --from=0 /usr/local/etc/php/conf.d /usr/local/etc/php/conf.d

# Включаем необходимые модули Apache
RUN a2enmod rewrite
RUN a2enmod vhost_alias
RUN a2enmod ssl

# Копируем Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Перезапускаем Apache (не обязательно, так как это делается автоматически при запуске контейнера)
# RUN service apache2 restart

```