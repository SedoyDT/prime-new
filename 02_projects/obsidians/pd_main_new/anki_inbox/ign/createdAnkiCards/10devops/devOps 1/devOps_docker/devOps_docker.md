
#devOps_docker
#docker

#telegram 

# 📌 **<u>Каким инцидентом готов на работе с чем разбиратьсясок?</u>** 
<!-- basicblock-start oid="ObspajsScItGUckL3rhCNQv6"  deck='devOps_docker' -->
📌 **<u>Каким инцидентом готов на работе с чем разбиратьсясок?</u>** ::


💬 [Спрашивают в 13% собеседований](https://easyoffer.ru/rating/devops)

🤔 **Инциденты и их решение**

1️⃣ **Сбой развертывания приложения**

**Симптомы**: Приложение не запускается, ошибки в логах.

**Решение**:
- Проверка логов пода (`kubectl logs <pod-name>`).
- Анализ конфигурации деплоя (`kubectl describe pod <pod-name>`).
- Откат к предыдущей версии (`kubectl rollout undo deployment <deployment-name>`).

2️⃣ **Проблемы с производительностью**

**Симптомы**: Высокая нагрузка на CPU, медленная работа приложений.

**Решение**:
- Мониторинг метрик (Prometheus, Grafana).
- Анализ потребления ресурсов (`kubectl top pods`).
- Масштабирование подов (`kubectl scale deployment <deployment-name> --replicas=<number>`).
- Оптимизация кода и запросов.

3️⃣ **Недоступность сервисов**

**Симптомы**: Приложение недоступно, ошибки 500/503.

**Решение**:
- Проверка состояния подов и сервисов (`kubectl get pods`, `kubectl get services`).
- Анализ логов ingress-контроллера.
- Проверка DNS и балансировки нагрузки.
- Перезапуск подов или сервисов.

4️⃣ **Утечка памяти**

**Симптомы**: Постепенное увеличение потребления памяти, перезапуски подов.

**Решение**:
- Мониторинг памяти (Prometheus, Grafana).
- Анализ логов и дампов памяти.
- Оптимизация кода.
- Настройка лимитов памяти (`kubectl describe pod <pod-name>`).
- Перезапуск подов.

5️⃣ **Проблемы с базой данных**

**Симптомы**: Ошибки подключения, медленные запросы.

**Решение**:
- Проверка состояния базы данных и логов.
- Анализ производительности запросов.
- Настройка параметров базы данных.
- Резервное копирование и восстановление данных.

🤔 **Инструменты для решения инцидентов**

🤔 **Kubernetes (kubectl)**

- Управление подами и сервисами.
- Анализ логов и описаний ресурсов.
- Масштабирование и обновление деплоя.

🤔 **Prometheus и Grafana**

- Мониторинг метрик.
- Настройка алертинга.
- Визуализация данных.

🤔 **CI/CD инструменты (Jenkins, GitLab CI/CD)**

- Автоматизация развертывания.
- Настройка пайплайнов.
- Интеграция с системами мониторинга.

🤔 **Логирование (ELK Stack, Fluentd)**

- Сбор и анализ логов.
- Настройка дашбордов.
- Централизованное логирование.

🤔 **Краткое резюме**

Готов решать инциденты, такие как сбои развертывания, проблемы с производительностью, недоступность сервисов, утечки памяти и проблемы с базами данных. Использую инструменты Kubernetes, Prometheus, Grafana, CI/CD системы и логирование для эффективного устранения проблем и поддержания стабильности приложений.

🔥  [ТОП ВОПРОСОВ С СОБЕСОВ](https://easyoffer.ru/rating/devops)

🔒 [База собесов](https://t.me/access_interview_bot) | 🔒 [База тестовых](https://t.me/eo_test_task_bot)
<!-- basicblock-end -->




#devOps_docker
#docker

#telegram 

# 📌 **<u>Какие команды знаешь?</u>** 
<!-- basicblock-start oid="Obs92Hn3sgzySTjGCeXmsuQ6"  deck='devOps_docker' -->
📌 **<u>Какие команды знаешь?</u>** ::


💬 [Спрашивают в 13% собеседований](https://easyoffer.ru/rating/devops)

🤔 **Git**

- `git init`: Инициализация нового репозитория.
- `git clone <url>`: Клонирование репозитория.
- `git add <file>`: Добавление файла к коммиту.
- `git commit -m "сообщение"`: Создание коммита.
- `git push`: Отправка изменений.
- `git pull`: Получение изменений.
- `git branch`: Список веток.
- `git checkout <branch>`: Переключение ветки.

🤔 **Docker**

- `docker build -t <image_name> .`: Создание образа.
- `docker run -d -p 80:80 <image_name>`: Запуск контейнера.
- `docker ps`: Список контейнеров.
- `docker stop <container_id>`: Остановка контейнера.
- `docker rm <container_id>`: Удаление контейнера.
- `docker images`: Список образов.
- `docker rmi <image_id>`: Удаление образа.

🤔** Kubernetes (kubectl)**

- `kubectl get pods`: Список подов.
- `kubectl get services`: Список сервисов.
- `kubectl describe pod <pod_name>`: Информация о поде.
- `kubectl logs <pod_name>`: Логи пода.
- `kubectl apply -f <file.yaml>`: Применение конфигурации.
- `kubectl delete pod <pod_name>`: Удаление пода.
- `kubectl exec -it <pod_name> -- /bin/bash`: Подключение к поду.

🤔 **Ansible**

- `ansible-playbook <playbook.yml>`: Запуск плейбука.
- `ansible <host> -m ping`: Проверка хостов.
- `ansible <host> -m command -a 'uptime'`: Выполнение команды.
- `ansible-galaxy install <role>`: Установка роли.

🤔 **Terraform**

- `terraform init`: Инициализация.
- `terraform plan`: Планирование изменений.
- `terraform apply`: Применение изменений.
- `terraform destroy`: Удаление ресурсов.

🤔 **Linux (bash)**

- `ls`: Список файлов.
- `cd <directory>`: Перемещение в каталог.
- `pwd`: Текущий каталог.
- `cp <source> <destination>`: Копирование файлов.
- `mv <source> <destination>`: Перемещение файлов.
- `rm <file>`: Удаление файла.
- `mkdir <directory>`: Создание каталога.
- `grep <pattern> <file>`: Поиск шаблона.
- `find <directory> -name <pattern>`: Поиск файлов.
- `chmod <permissions> <file>`: Изменение прав.
- `chown <user>:<group> <file>`: Изменение владельца.
- `top`: Мониторинг процессов.
- `ps aux`: Список процессов.

🤔 **CI/CD (GitLab, Jenkins, GitHub Actions)**

🤔 **GitLab CI/CD:**
- `.gitlab-ci.yml`: Конфигурация пайплайна.
- `gitlab-runner register`: Регистрация Runner.
- `gitlab-runner list`: Список Runner.

🤔 **Jenkins**:
- `jenkins-cli.jar`: Утилита CLI.
- `jenkins-jobs create <job_name>`: Создание задачи.
- `jenkins-jobs build <job_name>`: Запуск задачи.
- `jenkins-jobs list`: Список задач.

🤔 **GitHub Actions**:
- `workflow_dispatch`: Ручной запуск.
- `.github/workflows/<workflow>.yml`: Конфигурация workflow.

🤔 **Пример CI/CD пайплайна в GitLab CI/CD**
```
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - echo "Building..."
    - ./build.sh

test:
  stage: test
  script:
    - echo "Testing..."
    - ./test.sh

deploy:
  stage: deploy
  script:
    - echo "Deploying..."
    - ./deploy.sh
```

🤔 **Краткое резюме**

Эти команды охватывают управление версиями, контейнеризацию, оркестрацию, автоматизацию развертывания и администрирование систем. Знание этих команд помогает эффективно управлять процессами разработки и эксплуатации ПО.

🔥  [ТОП ВОПРОСОВ С СОБЕСОВ](https://easyoffer.ru/rating/devops)

🔒 [База собесов](https://t.me/access_interview_bot) | 🔒 [База тестовых](https://t.me/eo_test_task_bot)
<!-- basicblock-end -->



