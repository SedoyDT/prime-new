
#D_docker
#docker

#telegram 

# **🤔**** Чем отличается COPY от ADD?**
<!-- basicblock-start oid="ObsVkgI0OrSkgoNoKrYeCB10"  deck='D_docker' -->
**🤔**** Чем отличается COPY от ADD?**::


COPY копирует файлы из локальной системы в контейнер. ADD, кроме копирования файлов, может извлекать архивы и загружать данные по URL. Использование ADD предоставляет дополнительные возможности, но рекомендуется применять COPY для простого копирования файлов.

Ставь 👍 если знал ответ, 🔥 если нет
Забирай [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_devops/400)
<!-- basicblock-end -->




#D_docker
#docker

#telegram 

# 🤔 **<u>Что будет если в докерфайле сразу указать и entry point и cmd?</u>** 
<!-- basicblock-start oid="ObsXk6xFfKIX1yeR58sGVqAc"  deck='D_docker' -->
🤔 **<u>Что будет если в докерфайле сразу указать и entry point и cmd?</u>** ::


В Dockerfile можно указать как `ENTRYPOINT`, так и `CMD`. Они оба определяют, какая команда будет выполнена при запуске контейнера, но имеют разные цели и взаимодействие между собой. 

🚩**`ENTRYPOINT` и `CMD` в Dockerfile**

🟠**`ENTRYPOINT`**:
Устанавливает основную команду и аргументы, которые не могут быть переопределены во время запуска контейнера с помощью `docker run`, за исключением явного использования опции `--entrypoint`.

🟠**`CMD`**: 
Устанавливает команду и аргументы по умолчанию для запуска контейнера. Эти параметры могут быть переопределены при запуске контейнера, если передать другие аргументы в `docker run`.

🚩**Совместное использование**

Когда в Dockerfile указаны оба, `ENTRYPOINT` и `CMD`, они работают совместно. `CMD` предоставляет аргументы по умолчанию для команды, указанной в `ENTRYPOINT`. Таким образом, `CMD` будет использоваться в качестве аргументов для `ENTRYPOINT`, если при запуске контейнера не указаны другие аргументы.
```
FROM ubuntu:latest

ENTRYPOINT ["echo"]
CMD ["Hello, World!"]
```

🚩**Основные сценарии использования**

🟠**Фиксированная команда с изменяемыми аргументами**:
  `ENTRYPOINT` используется для фиксированной команды, которую контейнер должен всегда выполнять, а `CMD` для указания аргументов по умолчанию.
🟠**Предоставление аргументов по умолчанию**:
   `CMD` используется для задания аргументов по умолчанию для команды, указанной в `ENTRYPOINT`.

🚩**Взаимодействие с `docker run`**

🟠Если указан только `ENTRYPOINT`, то команда и аргументы из `ENTRYPOINT` будут выполнены при запуске контейнера.
🟠Если указан только `CMD`, то команда и аргументы из `CMD` будут выполнены при запуске контейнера.
🟠Если указаны оба, то команда из `ENTRYPOINT` будет выполнена с аргументами из `CMD` по умолчанию. Если при запуске контейнера указать дополнительные аргументы, они заменят аргументы из `CMD`.
```
FROM python:3.9

ENTRYPOINT ["python", "-m"]
CMD ["http.server"]
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_devops/400)
<!-- basicblock-end -->




#D_docker
#docker

#telegram 

# Как выглядит простейшая php сборка 
<!-- basicblock-start oid="ObsOublfot48ujyVpQkKraA2"  deck='D_docker' -->
Как выглядит простейшая php сборка ::


Файл который перенаправляет все запросы, направленные не к папкам или файлам на index.php

```
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.php [L]
```

#dockerfile 

```
FROM php:8.2-apache

RUN chown -R www-data:www-data /var/www/
#USER www-data
RUN #chmod -R 777 /var/www/html
#WORKDIR /var/www/html
RUN apt-get update && apt-get install -y \
    libicu-dev \
    && docker-php-ext-install intl
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite
#EXPOSE 80
#CMD ["apache2-foreground"]
RUN service apache2 restart
```

```

<VirtualHost *:80>
    ServerName Calendar
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>

```

```
services:
  web:
    build:
      context: ./images
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    volumes:
      - ./server:/var/www/html
    networks:
      - app-network
networks:
  app-network:
    driver: bridge
```
<!-- basicblock-end -->




#D_docker
#docker

#telegram 

# Что делает docker sytem prune  -a?
<!-- basicblock-start oid="ObsYWrLEk2qaVC1jmSFAgVvK"  deck='D_docker' -->
Что делает docker sytem prune  -a?::


Команда `docker prune` используется для очистки неиспользуемых данных в Docker. Она помогает освободить место, удаляя ненужные объекты, которые не используются в данный момент. В Docker есть несколько типов `prune` команд, каждая из которых очищает определённые виды ресурсов:

### Основные команды `docker prune`

1. **`docker system prune`**

   Эта команда удаляет неиспользуемые объекты Docker, включая контейнеры, образы, тома и сети, которые не связаны с запущенными контейнерами.

   ```
   docker system prune
   
```

   Вы можете использовать флаг `-a` для удаления всех неиспользуемых образов, не только зависимостей от контейнеров:

   ```
   docker system prune -a
   
```

2. **`docker container prune`**

   Эта команда удаляет все остановленные контейнеры.

   ```
   docker container prune
   
```

3. **`docker image prune`**

   Эта команда удаляет неиспользуемые образы Docker. Вы можете использовать флаг `-a` для удаления всех неиспользуемых образов, а не только зависимостей от контейнеров:

   ```
   docker image prune
   
```

   ```
   docker image prune -a
   
```

4. **`docker volume prune`**

   Эта команда удаляет все неиспользуемые тома.

   ```
   docker volume prune
   
```

5. **`docker network prune`**

   Эта команда удаляет все неиспользуемые сети.

   ```
   docker network prune
   
```

### Важные замечания:

- Все команды `prune` подтверждают удаление объектов, если вы не используете флаг `--force`. Вы можете добавить `-f` (или `--force`), чтобы пропустить подтверждение и выполнить очистку сразу.

- Использование команды `docker system prune` без флага `-a` удалит только неиспользуемые объекты, такие как остановленные контейнеры и неиспользуемые образы, но оставит образы, которые используются в текущих контейнерах.

- Будьте осторожны при использовании `-a` или `--force`, так как это удалит все неиспользуемые данные, и восстановить их будет сложно.

Эти команды помогают поддерживать чистоту и оптимизацию вашего Docker-окружения, освобождая место на диске и предотвращая накопление неиспользуемых ресурсов.
<!-- basicblock-end -->





***


#D_docker
#docker

#telegram 

# 👩‍💻 Здесь собраны основные концепции Docker в одну диаграмму
<!-- basicblock-start oid="ObsXWWtl0oXi2Z6KI1w1T05g"  deck='D_docker' -->
👩‍💻 Здесь собраны основные концепции Docker в одну диаграмму::


👉 [DevOps Portal](https://t.me/loose_code)
<!-- basicblock-end -->



