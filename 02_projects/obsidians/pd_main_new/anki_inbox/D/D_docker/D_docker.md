
#D_docker
#docker

#telegram 

# **<u>🤔</u>****<u> Как сделать так, чтобы приложение разворачивалось быстрее в Docker`е?</u>**
<!-- basicblock-start  deck='D_docker' -->
**<u>🤔</u>****<u> Как сделать так, чтобы приложение разворачивалось быстрее в Docker`е?</u>**::


При развёртывании приложения в Docker важно минимизировать время сборки и оптимизировать слои контейнера.  

🟠**Использовать `.dockerignore`**  
Не копировать лишние файлы в контейнер (например, `node_modules`, `.git`, `vendor`, `.env`).  
```
.git
node_modules
vendor
.env
*.log
```

🟠**Оптимизировать `Dockerfile` (Меньше слоёв, кэширование)**  
Плохо (лишние слои, без кэширования)
```
FROM php:8.2-cli

WORKDIR /app

COPY . .      # Копирует ВСЕ файлы (долго и некэшируемо)
RUN composer install
RUN npm install
RUN npm run build
```

Хорошо (разделение слоёв, кэширование)
```
FROM php:8.2-cli

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist # Используем кэширование слоёв

COPY package.json package-lock.json ./
RUN npm install --only=production && npm cache clean --force

COPY . . # Копируем код ПОСЛЕ установки зависимостей (чтобы кэширование работало)
RUN npm run build
```

🟠**Использовать `multi-stage builds` (если контейнер весит много)**  
Позволяет уменьшить размер конечного образа, убрав ненужные файлы и инструменты.
```
# 1-й этап: сборка зависимостей (Node.js)
FROM node:18 as frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# 2-й этап: финальный образ
FROM php:8.2-cli
WORKDIR /app
COPY --from=frontend /app/dist /app/public # Берём только готовые файлы
COPY . .
CMD ["php", "artisan", "serve", "--host=0.0.0.0"]
```

🟠**Использовать `docker build --cache-from`**  
Позволяет использовать кеш из предыдущих сборок.
```
docker build --cache-from=myapp:latest -t myapp .
```

🟠**Оптимизировать `docker-compose` (если используется)**  
Перенести volume для `vendor` и `node_modules` на хост, чтобы не скачивать их в контейнере.  
```
services:
  app:
    build: .
    volumes:
      - .:/app
      - /app/vendor  # Чтобы composer install не запускался каждый раз
      - /app/node_modules # Чтобы npm install не замедлял перезапуск
```

🟠**Использовать `Alpine Linux` (если важен размер образа)**  
Alpine – лёгкая версия Linux (~5 MB), подходит для PHP, Nginx, Node.js.
```
FROM php:8.2-fpm-alpine
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_php_ru/52)
<!-- basicblock-end -->



